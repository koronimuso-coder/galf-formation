import { dbGetDoc, dbSetDoc, dbAddDoc, dbGetDocs, dbUpdateDoc } from "./dbClient";
import { normalizeWhatsApp } from "./referral";

export interface ReferredProspect {
  id: string;
  campaignId: string;
  sponsorUserId: string;
  referralCode: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  commune: string;
  desiredFormationId: string;
  preferredCenterId: string;
  currentSituation: string;
  availability: string;
  professionalObjective: string;
  source: string;
  assignedCommercialId?: string;
  status: 'nouveau_prospect' | 'a_contacter' | 'contacte' | 'interesse' | 'orientation_effectuee' | 'rdv_prevu' | 'dossier_commence' | 'paiement_a_verifier' | 'paiement_partiel' | 'paiement_complet' | 'inscription_validee' | 'non_interesse' | 'a_relancer' | 'annule' | 'fraude_suspectee';
  leadScore: number;
  leadCategory: 'froid' | 'tiede' | 'chaud' | 'prioritaire';
  fraudScore: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScoreFactor {
  value: number;
  label: string;
}

export interface ExplicableScore {
  score: number;
  category: ReferredProspect['leadCategory'];
  factors: ScoreFactor[];
}

export interface CommercialActivity {
  id: string;
  prospectId: string;
  authorId: string;
  type: 'pipeline_change' | 'call' | 'meeting' | 'note' | 'objection' | 'payment_submitted';
  oldStatus?: string;
  newStatus?: string;
  comment: string;
  nextAction?: string;
  createdAt: string;
}

export interface CommercialTask {
  id: string;
  prospectId: string;
  assignedCommercialId: string;
  dueDate: string;
  channel: 'phone' | 'whatsapp' | 'email' | 'in_person';
  priority: 'basse' | 'moyenne' | 'haute';
  comment: string;
  status: 'non_commence' | 'en_cours' | 'complete' | 'annule';
  createdAt?: string;
}

// ────────────────────────────────────────────────────────────────────────
// LEAD SCORING ALGORITHM (EXPLICABLE)
// ────────────────────────────────────────────────────────────────────────

export const evaluateLeadScore = (prospect: Partial<ReferredProspect>): ExplicableScore => {
  let score = 15; // base score
  const factors: ScoreFactor[] = [{ value: 15, label: "Score de base pour nouveau prospect" }];

  if (prospect.email && prospect.email.trim() !== "") {
    score += 10;
    factors.push({ value: 10, label: "Adresse e-mail renseignée" });
  }
  
  if (prospect.professionalObjective && prospect.professionalObjective.trim().length > 10) {
    score += 15;
    factors.push({ value: 15, label: "Objectif professionnel détaillé fourni" });
  }

  const avail = prospect.availability?.toLowerCase() || "";
  if (avail.includes("immédiat") || avail.includes("total") || avail.includes("plein") || avail.includes("oui")) {
    score += 20;
    factors.push({ value: 20, label: "Disponibilité immédiate pour formation intensive" });
  } else if (avail.includes("partiel") || avail.includes("soir")) {
    score += 10;
    factors.push({ value: 10, label: "Disponibilité partielle" });
  }

  const city = prospect.city?.toLowerCase() || "";
  if (city.includes("abidjan") || city.includes("san pedro") || city.includes("yamoussoukro")) {
    score += 15;
    factors.push({ value: 15, label: "Résidence dans un centre de formation actif" });
  }

  const status = prospect.status;
  if (status) {
    if (status === "orientation_effectuee" || status === "rdv_prevu") {
      score += 20;
      factors.push({ value: 20, label: "Prospect orienté et rendez-vous fixé" });
    } else if (status === "dossier_commence") {
      score += 25;
      factors.push({ value: 25, label: "Dossier administratif commencé" });
    } else if (status === "paiement_a_verifier" || status === "paiement_partiel") {
      score += 30;
      factors.push({ value: 30, label: "Preuve de paiement de l'acompte soumise" });
    } else if (status === "inscription_validee" || status === "paiement_complet") {
      score += 40;
      factors.push({ value: 40, label: "Inscription payée et validée par GALF" });
    } else if (status === "non_interesse" || status === "annule") {
      score -= 30;
      factors.push({ value: -30, label: "Désintérêt ou annulation du dossier" });
    }
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let category: ReferredProspect['leadCategory'] = 'froid';
  if (score >= 81) category = 'prioritaire';
  else if (score >= 61) category = 'chaud';
  else if (score >= 31) category = 'tiede';

  return { score, category, factors };
};

// ────────────────────────────────────────────────────────────────────────
// PROSPECTS REGISTRATION & ASSIGNMENT
// ────────────────────────────────────────────────────────────────────────

const arePhonesSimilar = (phone1: string, phone2: string): boolean => {
  const p1 = phone1.replace(/[^0-9]/g, "");
  const p2 = phone2.replace(/[^0-9]/g, "");
  if (p1.length !== p2.length) return false;
  let diffCount = 0;
  for (let i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i]) {
      diffCount++;
    }
  }
  return diffCount <= 2; // differs by at most 2 digits
};

// Register referred prospect
export const registerReferredProspect = async (
  prospect: Omit<ReferredProspect, "id" | "phone" | "status" | "leadScore" | "leadCategory" | "fraudScore">,
  rawPhone: string
): Promise<ReferredProspect> => {
  const phone = normalizeWhatsApp(rawPhone);
  
  // Prevent duplicate prospect in same campaign
  const existing = await dbGetDocs("referred_prospects", [
    { field: "campaignId", op: "==", value: prospect.campaignId },
    { field: "phone", op: "==", value: phone }
  ]);

  if (existing.length > 0) {
    throw new Error("Un dossier prospect avec ce numéro WhatsApp existe déjà pour cette campagne.");
  }

  // ── DETECT MULTIPLE FRAUD SIGNALS ──
  let isAutoReferral = false;
  let isSameEmail = false;
  let isRapidSubmission = false;
  let isSimilarPhone = false;
  let similarPhoneDetails = "";

  // 1. Check Auto-Referral
  const sponsorSnap = await dbGetDocs("referral_members", [
    { field: "campaignId", op: "==", value: prospect.campaignId },
    { field: "userId", op: "==", value: prospect.sponsorUserId }
  ]);
  
  if (sponsorSnap.length > 0) {
    const sponsorProfile = sponsorSnap[0].data();
    if (normalizeWhatsApp(sponsorProfile.whatsapp) === phone) {
      isAutoReferral = true;
    }
  }

  // 2. Check Same Email across other prospects
  if (prospect.email && prospect.email.trim() !== "") {
    const existingEmail = await dbGetDocs("referred_prospects", [
      { field: "campaignId", op: "==", value: prospect.campaignId },
      { field: "email", op: "==", value: prospect.email.trim() }
    ]);
    if (existingEmail.length > 0) {
      isSameEmail = true;
    }
  }

  // 3. Check Rapid Submissions (more than 3 signups in last 5 minutes by same sponsor)
  if (prospect.sponsorUserId && prospect.sponsorUserId !== "") {
    const sponsorProspects = await dbGetDocs("referred_prospects", [
      { field: "campaignId", op: "==", value: prospect.campaignId },
      { field: "sponsorUserId", op: "==", value: prospect.sponsorUserId }
    ]);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recentSubmissions = sponsorProspects.filter(p => {
      const pData = p.data();
      return pData.createdAt && pData.createdAt >= fiveMinutesAgo;
    });
    if (recentSubmissions.length >= 3) {
      isRapidSubmission = true;
    }
  }

  // 4. Check Similar Phone numbers registered by same sponsor
  if (prospect.sponsorUserId && prospect.sponsorUserId !== "") {
    const sponsorProspects = await dbGetDocs("referred_prospects", [
      { field: "campaignId", op: "==", value: prospect.campaignId },
      { field: "sponsorUserId", op: "==", value: prospect.sponsorUserId }
    ]);
    for (const snap of sponsorProspects) {
      const existingProspect = snap.data();
      if (arePhonesSimilar(phone, existingProspect.phone)) {
        isSimilarPhone = true;
        similarPhoneDetails = existingProspect.phone;
        break;
      }
    }
  }

  // Calculate Fraud Score
  let fraudScore = 0;
  if (isAutoReferral) fraudScore += 100;
  if (isSameEmail) fraudScore += 50;
  if (isRapidSubmission) fraudScore += 70;
  if (isSimilarPhone) fraudScore += 60;
  fraudScore = Math.min(100, fraudScore);

  // Automatic Commercial assignment (Round Robin on available commercials)
  const commercials = await dbGetDocs("users", [{ field: "role", op: "==", value: "COMMERCIAL" }]);
  let assignedCommercialId = "";
  if (commercials.length > 0) {
    const randomIndex = Math.floor(Math.random() * commercials.length);
    assignedCommercialId = commercials[randomIndex].id;
  }

  const initialStatus = fraudScore >= 50 ? "fraude_suspectee" : "nouveau_prospect";
  
  const tempProspect: Partial<ReferredProspect> = {
    ...prospect,
    phone,
    status: initialStatus,
    assignedCommercialId
  };

  const evalResult = evaluateLeadScore(tempProspect);

  const fullProspect: ReferredProspect = {
    ...tempProspect,
    id: `PRP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    leadScore: evalResult.score,
    leadCategory: evalResult.category,
    fraudScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as ReferredProspect;

  await dbSetDoc("referred_prospects", fullProspect.id, fullProspect);

  // Log audit trail
  await dbAddDoc("admin_audit_logs", {
    userId: prospect.sponsorUserId,
    action: "prospect_registration",
    targetId: fullProspect.id,
    details: `Prospect ${fullProspect.fullName} registered under code ${prospect.referralCode}. Fraud score: ${fraudScore}/100.`,
    createdAt: new Date().toISOString()
  });

  // Log fraud flags if any
  if (isAutoReferral) {
    await dbAddDoc("referral_fraud_flags", {
      prospectId: fullProspect.id,
      userId: prospect.sponsorUserId,
      signalType: "auto_referral",
      severity: "critique",
      description: `Tentative d'auto-parrainage détectée pour le numéro ${phone}`,
      status: "en_attente",
      createdAt: new Date().toISOString()
    });
  }
  if (isSameEmail) {
    await dbAddDoc("referral_fraud_flags", {
      prospectId: fullProspect.id,
      userId: prospect.sponsorUserId,
      signalType: "same_email",
      severity: "moyen",
      description: `Email doublon détecté pour ${prospect.email}`,
      status: "en_attente",
      createdAt: new Date().toISOString()
    });
  }
  if (isRapidSubmission) {
    await dbAddDoc("referral_fraud_flags", {
      prospectId: fullProspect.id,
      userId: prospect.sponsorUserId,
      signalType: "rapid_submissions",
      severity: "eleve",
      description: `Soumissions trop rapides (spam) détectées pour le parrain`,
      status: "en_attente",
      createdAt: new Date().toISOString()
    });
  }
  if (isSimilarPhone) {
    await dbAddDoc("referral_fraud_flags", {
      prospectId: fullProspect.id,
      userId: prospect.sponsorUserId,
      signalType: "similar_numbers",
      severity: "eleve",
      description: `Numéro similaire détecté (${phone} ressemble à ${similarPhoneDetails})`,
      status: "en_attente",
      createdAt: new Date().toISOString()
    });
  }

  // Create initial activity log
  await logCommercialActivity(
    fullProspect.id,
    "system",
    "pipeline_change",
    `Création du dossier prospect. Attribué à commercial : ${assignedCommercialId || "Aucun"}`,
    undefined,
    initialStatus
  );

  return fullProspect;
};

// ────────────────────────────────────────────────────────────────────────
// COMMERCIAL ACTIVITIES & STATUS UPDATES
// ────────────────────────────────────────────────────────────────────────

export const logCommercialActivity = async (
  prospectId: string,
  authorId: string,
  type: CommercialActivity['type'],
  comment: string,
  oldStatus?: string,
  newStatus?: string,
  nextAction?: string
): Promise<void> => {
  await dbAddDoc("commercial_activities", {
    prospectId,
    authorId,
    type,
    comment,
    oldStatus,
    newStatus,
    nextAction,
    createdAt: new Date().toISOString()
  });
};

export const updateProspectPipelineStatus = async (
  prospectId: string,
  authorId: string,
  newStatus: ReferredProspect['status'],
  comment: string,
  nextAction?: string
): Promise<void> => {
  const snap = await dbGetDoc("referred_prospects", prospectId);
  if (!snap.exists()) throw new Error("Prospect introuvable");
  
  const prospect = snap.data() as ReferredProspect;
  const oldStatus = prospect.status;
  
  // Calculate new score with the new status
  const updatedProspect = { ...prospect, status: newStatus };
  const evalResult = evaluateLeadScore(updatedProspect);
  
  await dbUpdateDoc("referred_prospects", prospectId, {
    status: newStatus,
    leadScore: evalResult.score,
    leadCategory: evalResult.category,
    updatedAt: new Date().toISOString()
  });

  await logCommercialActivity(prospectId, authorId, "pipeline_change", comment, oldStatus, newStatus, nextAction);

  // Trigger rewards calculation check if the status is validated or cancelled
  if (newStatus === "inscription_validee" || oldStatus === "inscription_validee") {
    // Import and trigger reward check (we handle this in admin service to avoid circular dependency)
    // We can call an admin service check helper or let the admin page verify.
  }
};

// ────────────────────────────────────────────────────────────────────────
// TASK MANAGER
// ────────────────────────────────────────────────────────────────────────

export const createCommercialTask = async (task: Omit<CommercialTask, "id" | "status">): Promise<string> => {
  const id = `TSK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const fullTask: CommercialTask = {
    ...task,
    id,
    status: "non_commence",
    createdAt: new Date().toISOString()
  };
  await dbSetDoc("commercial_tasks", id, fullTask);
  return id;
};

export const getCommercialTasks = async (commercialId: string): Promise<CommercialTask[]> => {
  const snaps = await dbGetDocs("commercial_tasks", [{ field: "assignedCommercialId", op: "==", value: commercialId }]);
  return snaps.map(s => s.data() as CommercialTask);
};

export const updateTaskStatus = async (taskId: string, status: CommercialTask['status']): Promise<void> => {
  await dbUpdateDoc("commercial_tasks", taskId, { status });
};
