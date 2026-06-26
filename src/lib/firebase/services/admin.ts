import { dbGetDoc, dbSetDoc, dbAddDoc, dbGetDocs, dbUpdateDoc } from "./dbClient";
import { createNotification, awardBadge } from "./referral";
import { ReferredProspect, logCommercialActivity } from "./commercial";

export interface PaymentRecord {
  id: string;
  prospectId: string;
  amount: number;
  paymentMethod: 'wave' | 'orange' | 'mtn' | 'cash';
  reference: string;
  paymentDate: string;
  proofUrl?: string;
  status: 'en_attente' | 'a_verifier' | 'confirme' | 'partiel' | 'echoue' | 'annule' | 'rembourse';
  verifiedBy?: string;
  comment?: string;
  createdAt?: string;
}

export interface ReferralReward {
  id: string; // doc ID, ex: "GALF-REWARD-2026-000145"
  userId: string;
  campaignId: string;
  status: 'non_commencee' | 'en_progression' | 'eligible' | 'verification_en_cours' | 'informations_requises' | 'approuvee' | 'programmee' | 'attribuee' | 'utilisee' | 'expiree' | 'refusee' | 'suspendue' | 'annulee';
  reference: string;
  offeredFormationId?: string;
  approvedBy?: string;
  approvedAt?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface FraudFlag {
  id: string;
  prospectId: string;
  userId?: string;
  signalType: 'same_phone' | 'same_email' | 'auto_referral' | 'rapid_submissions' | 'similar_numbers';
  severity: 'faible' | 'moyen' | 'eleve' | 'critique';
  description: string;
  status: 'en_attente' | 'resolu_rejete' | 'resolu_ignore';
  createdAt?: string;
}

// ────────────────────────────────────────────────────────────────────────
// PAYMENT SUBMISSION & CONFIRMATION
// ────────────────────────────────────────────────────────────────────────

export const submitPaymentRecord = async (payment: Omit<PaymentRecord, "id" | "status">): Promise<string> => {
  const id = `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const fullPayment: PaymentRecord = {
    ...payment,
    id,
    status: "a_verifier",
    createdAt: new Date().toISOString()
  };
  await dbSetDoc("payment_records", id, fullPayment);

  // Update prospect status to 'paiement_a_verifier'
  await dbUpdateDoc("referred_prospects", payment.prospectId, {
    status: "paiement_a_verifier",
    updatedAt: new Date().toISOString()
  });

  await logCommercialActivity(
    payment.prospectId,
    "system",
    "payment_submitted",
    `Preuve de paiement soumise pour montant ${payment.amount} F. Référence : ${payment.reference}`,
    "nouveau_prospect",
    "paiement_a_verifier"
  );

  return id;
};

export const verifyPaymentStatus = async (
  paymentId: string,
  verifierUserId: string,
  status: PaymentRecord['status'],
  comment: string
): Promise<void> => {
  const paySnap = await dbGetDoc("payment_records", paymentId);
  if (!paySnap.exists()) throw new Error("Paiement introuvable");
  const payment = paySnap.data() as PaymentRecord;

  await dbUpdateDoc("payment_records", paymentId, {
    status,
    verifiedBy: verifierUserId,
    comment,
    updatedAt: new Date().toISOString()
  });

  // If payment is confirmed, mark prospect as 'inscription_validee' (or payment complete)
  if (status === "confirme") {
    const prospectSnap = await dbGetDoc("referred_prospects", payment.prospectId);
    if (prospectSnap.exists()) {
      const prospect = prospectSnap.data() as ReferredProspect;
      
      await dbUpdateDoc("referred_prospects", payment.prospectId, {
        status: "inscription_validee",
        updatedAt: new Date().toISOString()
      });

      await logCommercialActivity(
        payment.prospectId,
        verifierUserId,
        "pipeline_change",
        `Paiement de l'acompte confirmé. Inscription validée par le service financier. Commentaire : ${comment}`,
        "paiement_a_verifier",
        "inscription_validee"
      );

      // Trigger the rewards calculation for this sponsor
      await checkAndTriggerRewards(prospect.sponsorUserId, prospect.campaignId);
    }
  } else if (status === "echoue" || status === "annule") {
    await dbUpdateDoc("referred_prospects", payment.prospectId, {
      status: "a_contacter",
      updatedAt: new Date().toISOString()
    });
    
    await logCommercialActivity(
      payment.prospectId,
      verifierUserId,
      "pipeline_change",
      `Échec du paiement. Retour du prospect au statut 'À contacter'. Commentaire : ${comment}`,
      "paiement_a_verifier",
      "a_contacter"
    );
  }
};

// ────────────────────────────────────────────────────────────────────────
// AUTOMATIC REWARDS ENGINE
// ────────────────────────────────────────────────────────────────────────

export const checkAndTriggerRewards = async (sponsorUserId: string, campaignId: string): Promise<void> => {
  // 1. Get all validated prospects for this sponsor in this campaign
  const validatedProspectsSnap = await dbGetDocs("referred_prospects", [
    { field: "sponsorUserId", op: "==", value: sponsorUserId },
    { field: "campaignId", op: "==", value: campaignId },
    { field: "status", op: "==", value: "inscription_validee" }
  ]);
  const validatedProspects = validatedProspectsSnap.map(s => s.data() as ReferredProspect);
  const totalValidated = validatedProspects.length;

  // 2. Get existing rewards for this sponsor/campaign
  const existingRewardsSnap = await dbGetDocs("referral_rewards", [
    { field: "userId", op: "==", value: sponsorUserId },
    { field: "campaignId", op: "==", value: campaignId }
  ]);
  const existingRewards = existingRewardsSnap.map(s => s.data() as ReferralReward);
  const existingCount = existingRewards.length;

  // Calculate target reward count: 1 reward per 5 validated prospects
  const targetCount = Math.floor(totalValidated / 5);

  if (targetCount > existingCount) {
    const rewardsToCreate = targetCount - existingCount;

    // Find all prospects that are already linked to existing rewards
    const linkedEntriesSnap = await dbGetDocs("reward_qualifying_entries", []);
    const linkedProspectIds = new Set(linkedEntriesSnap.map(s => s.data().prospectId));

    // Filter validated prospects that are NOT yet linked to any reward
    const unlinkedProspects = validatedProspects.filter(p => !linkedProspectIds.has(p.id));

    // Sort by creation date to assign the oldest ones first
    unlinkedProspects.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));

    for (let r = 0; r < rewardsToCreate; r++) {
      // Pick 5 prospects for this reward
      const slice = unlinkedProspects.slice(r * 5, (r + 1) * 5);
      if (slice.length < 5) {
        console.warn(`Not enough unlinked prospects for reward creation ${r + 1}`);
        break;
      }

      // Generate reward reference: GALF-REWARD-2026-XXXXXX
      const randomRef = Math.floor(100000 + Math.random() * 900000);
      const rewardId = `GALF-REWARD-2026-${randomRef}`;

      const newReward: ReferralReward = {
        id: rewardId,
        userId: sponsorUserId,
        campaignId,
        status: "eligible",
        reference: rewardId,
        createdAt: new Date().toISOString()
      };

      await dbSetDoc("referral_rewards", rewardId, newReward);

      // Link these 5 prospects to the reward to lock them in
      for (const p of slice) {
        const linkId = `${rewardId}_${p.id}`;
        await dbSetDoc("reward_qualifying_entries", linkId, {
          id: linkId,
          rewardId,
          prospectId: p.id,
          createdAt: new Date().toISOString()
        });
      }

      // Award Lauréat badge and send notification
      await awardBadge(sponsorUserId, "laureat");
      await createNotification(
        sponsorUserId, 
        "Félicitations ! Seuil de 5 atteint.", 
        `Vous êtes éligible à une formation offerte. Réf de dossier : ${rewardId}. Choix en cours de validation.`
      );

      // Notify administrator
      await dbAddDoc("referral_notifications", {
        userId: "admin", // admin-wide
        title: "Nouvelle récompense éligible",
        message: `L'ambassadeur ${sponsorUserId} a atteint 5 filleuls validés. Dossier ${rewardId} en attente de vérification.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Update current milestones/badges for progression
  if (totalValidated >= 1) await awardBadge(sponsorUserId, "premier_impact");
  if (totalValidated >= 2) await awardBadge(sponsorUserId, "ambassadeur_actif");
  if (totalValidated >= 3) await awardBadge(sponsorUserId, "influence_positive");
  if (totalValidated >= 4) await awardBadge(sponsorUserId, "presque_gagnant");
};

export const approveReward = async (
  rewardId: string,
  adminUserId: string,
  offeredFormationId: string,
  expiresInDays: number = 90
): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  await dbUpdateDoc("referral_rewards", rewardId, {
    status: "approuvee",
    offeredFormationId,
    approvedBy: adminUserId,
    approvedAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    updatedAt: new Date().toISOString()
  });

  const snap = await dbGetDoc("referral_rewards", rewardId);
  if (snap.exists()) {
    const reward = snap.data() as ReferralReward;
    await createNotification(
      reward.userId,
      "Récompense approuvée ! 🎉",
      `Votre récompense ${rewardId} a été validée pour la formation sélectionnée. Utilisez-la avant le ${expiresAt.toLocaleDateString("fr-FR")}.`
    );
  }
};

// ────────────────────────────────────────────────────────────────────────
// ANALYTICS & SIMULATION DE RENTABILITÉ
// ────────────────────────────────────────────────────────────────────────

export interface ProfitabilityMetrics {
  totalRevenue: number;
  rewardValueEstimated: number;
  grossMargin: number;
  cpa: number; // Cost Per Acquisition
  roi: number;
}

export const getProfitabilityMetrics = async (
  campaignId: string,
  avgFormationPrice: number = 195000,
  avgRewardValue: number = 195000,
  operationCosts: number = 100000
): Promise<ProfitabilityMetrics> => {
  // Get all validated enrollments
  const prospectsSnap = await dbGetDocs("referred_prospects", [
    { field: "campaignId", op: "==", value: campaignId },
    { field: "status", op: "==", value: "inscription_validee" }
  ]);
  const validatedCount = prospectsSnap.length;

  // Get all approved rewards
  const rewardsSnap = await dbGetDocs("referral_rewards", [
    { field: "campaignId", op: "==", value: campaignId },
    { field: "status", op: "==", value: "approuvee" }
  ]);
  const approvedRewardCount = rewardsSnap.length;

  const totalRevenue = validatedCount * avgFormationPrice;
  const rewardValueEstimated = approvedRewardCount * avgRewardValue;
  const totalCosts = rewardValueEstimated + operationCosts;
  const grossMargin = totalRevenue - totalCosts;

  const cpa = validatedCount > 0 ? totalCosts / validatedCount : 0;
  const roi = totalCosts > 0 ? (grossMargin / totalCosts) * 100 : 0;

  return {
    totalRevenue,
    rewardValueEstimated,
    grossMargin,
    cpa,
    roi
  };
};

// ────────────────────────────────────────────────────────────────────────
// EXPORTS CSV HELPER
// ────────────────────────────────────────────────────────────────────────

export const exportCollectionToCSV = (headers: string[], rows: any[][]): string => {
  let csvContent = "\ufeff"; // BOM for Excel accents compatibility
  csvContent += headers.join(",") + "\n";
  
  rows.forEach(row => {
    const escapedRow = row.map(val => {
      if (val === undefined || val === null) return "";
      let str = String(val);
      // Escape double quotes and wrap in quotes if has commas/newlines
      str = str.replace(/"/g, '""');
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str}"`;
      }
      return str;
    });
    csvContent += escapedRow.join(",") + "\n";
  });
  
  return csvContent;
};
