import { dbGetDoc, dbSetDoc, dbAddDoc, dbGetDocs, dbUpdateDoc, QueryFilter } from "./dbClient";

// Phone Normalization for Côte d'Ivoire & WhatsApp
export const normalizeWhatsApp = (phone: string): string => {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");
  
  // If starting with 00225 or 225, format with +225
  if (cleaned.startsWith("00225")) {
    cleaned = "+" + cleaned.slice(2);
  } else if (cleaned.startsWith("225") && cleaned.length > 8) {
    cleaned = "+" + cleaned;
  }
  
  // If it's a 10-digit number starting with 0 (Standard CI mobile)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+225" + cleaned;
  }
  
  // Ensure it has the '+' prefix if it starts with 225
  if (!cleaned.startsWith("+") && cleaned.startsWith("225")) {
    cleaned = "+" + cleaned;
  }
  
  // If it's still missing the prefix and looks like a local number, prepend +225
  if (!cleaned.startsWith("+") && cleaned.length === 8) {
    cleaned = "+22507" + cleaned; // Assume default mobile prefix
  } else if (!cleaned.startsWith("+") && cleaned.length === 10) {
    cleaned = "+225" + cleaned;
  }
  
  return cleaned;
};

// Interface definitions
export interface Campaign {
  id: string;
  name: string;
  slug: string;
  title: string;
  slogan: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'brouillon' | 'programmee' | 'active' | 'suspendue' | 'terminee' | 'archivee';
  threshold: number;
  rewardDescription: string;
  rules: string;
  faq: Array<{ q: string; a: string }>;
  createdAt?: string;
}

export interface SponsorProfile {
  id: string; // userId_campaignId
  userId: string;
  campaignId: string;
  whatsapp: string;
  city: string;
  commune: string;
  currentSituation: string;
  availability: string;
  objective: string;
  discoverySource: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
  code: string;
  createdAt?: string;
}

export interface Badge {
  id: string;
  userId: string;
  badgeType: 'premier_impact' | 'ambassadeur_actif' | 'influence_positive' | 'presque_gagnant' | 'laureat';
  earnedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ────────────────────────────────────────────────────────────────────────
// CAMPAIGNS
// ────────────────────────────────────────────────────────────────────────

export const getCampaigns = async (): Promise<Campaign[]> => {
  const snaps = await dbGetDocs("referral_campaigns", undefined, "createdAt", "desc");
  return snaps.map(s => s.data() as Campaign);
};

export const getCampaignBySlug = async (slug: string): Promise<Campaign | null> => {
  const snaps = await dbGetDocs("referral_campaigns", [{ field: "slug", op: "==", value: slug }]);
  return snaps.length > 0 ? (snaps[0].data() as Campaign) : null;
};

export const createCampaign = async (campaign: Omit<Campaign, "id">): Promise<string> => {
  const id = `CAM-${campaign.slug}`;
  await dbSetDoc("referral_campaigns", id, { ...campaign, id });
  return id;
};

// ────────────────────────────────────────────────────────────────────────
// SPONSOR MEMBERSHIP & CODES
// ────────────────────────────────────────────────────────────────────────

// Generate Unique Code: GALF-PRENOM-XXXX
export const generateUniqueReferralCode = async (firstName: string): Promise<string> => {
  const cleanName = firstName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z]/g, "") // letters only
    .toUpperCase();
    
  let attempts = 0;
  while (attempts < 10) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const candidate = `GALF-${cleanName.slice(0, 8)}-${randomHex}`;
    
    // Check uniqueness
    const docSnap = await dbGetDoc("referral_codes", candidate);
    if (!docSnap.exists()) {
      return candidate;
    }
    attempts++;
  }
  
  // Fallback
  return `GALF-AMB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// Register a sponsor
export const registerSponsor = async (
  userId: string,
  campaignId: string,
  data: Omit<SponsorProfile, "id" | "userId" | "campaignId" | "code">,
  firstName: string
): Promise<SponsorProfile> => {
  const normalizedWhatsapp = normalizeWhatsApp(data.whatsapp);
  
  // Check if WhatsApp is already registered in the campaign
  const existing = await dbGetDocs("referral_members", [
    { field: "campaignId", op: "==", value: campaignId },
    { field: "whatsapp", op: "==", value: normalizedWhatsapp }
  ]);
  
  if (existing.length > 0) {
    throw new Error("Un compte ambassadeur est déjà associé à ce numéro WhatsApp.");
  }

  const memberId = `${userId}_${campaignId}`;
  const code = await generateUniqueReferralCode(firstName);

  // Create referral code doc
  await dbSetDoc("referral_codes", code, {
    code,
    memberId,
    userId,
    campaignId,
    status: "actif",
    createdAt: new Date().toISOString()
  });

  const profile: SponsorProfile = {
    ...data,
    id: memberId,
    userId,
    campaignId,
    whatsapp: normalizedWhatsapp,
    code,
    createdAt: new Date().toISOString()
  };

  await dbSetDoc("referral_members", memberId, profile);
  
  // Log audit & award first badge
  await dbAddDoc("admin_audit_logs", {
    userId,
    action: "sponsor_registration",
    targetId: memberId,
    details: `Sponsor registered with code ${code}`,
    createdAt: new Date().toISOString()
  });
  
  await awardBadge(userId, "premier_impact");
  await createNotification(userId, "Bienvenue Ambassadeur !", `Votre code de parrainage ${code} est actif. Partagez-le pour gagner votre formation !`);

  return profile;
};

export const getSponsorProfile = async (userId: string, campaignId: string): Promise<SponsorProfile | null> => {
  const memberId = `${userId}_${campaignId}`;
  const snap = await dbGetDoc("referral_members", memberId);
  return snap.exists() ? (snap.data() as SponsorProfile) : null;
};

// ────────────────────────────────────────────────────────────────────────
// CLICKS & COOKIES ATTRIBUTION (30 DAYS)
// ────────────────────────────────────────────────────────────────────────

export const logReferralClick = async (code: string, ip: string, userAgent: string, referrer: string) => {
  // Hash IP simple representation for privacy
  const hashedIp = ip.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0).toString(16);
  await dbAddDoc("referral_clicks", {
    code,
    ip: hashedIp,
    userAgent,
    referrer,
    createdAt: new Date().toISOString()
  });
};

export const setAttributionCookie = (code: string) => {
  if (typeof document === "undefined") return;
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  document.cookie = `galf_ref_code=${code}; path=/; max-age=${maxAge}; SameSite=Lax`;
  // Also save to localStorage as fallback
  localStorage.setItem("galf_ref_code", code);
  localStorage.setItem("galf_ref_assigned_at", new Date().toISOString());
};

export const getAttributionCode = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const refCookie = cookies.find(row => row.startsWith("galf_ref_code="));
  if (refCookie) return refCookie.split("=")[1];
  
  // Fallback to localStorage if cookie expired but is within 30 days
  const localCode = localStorage.getItem("galf_ref_code");
  const assignedAt = localStorage.getItem("galf_ref_assigned_at");
  if (localCode && assignedAt) {
    const elapsed = Date.now() - new Date(assignedAt).getTime();
    if (elapsed < 30 * 24 * 60 * 60 * 1000) {
      return localCode;
    }
  }
  return null;
};

// ────────────────────────────────────────────────────────────────────────
// BADGES & NOTIFICATIONS
// ────────────────────────────────────────────────────────────────────────

export const awardBadge = async (userId: string, badgeType: Badge['badgeType']): Promise<void> => {
  const id = `${userId}_${badgeType}`;
  const snap = await dbGetDoc("referral_badges", id);
  if (!snap.exists()) {
    await dbSetDoc("referral_badges", id, {
      id,
      userId,
      badgeType,
      earnedAt: new Date().toISOString()
    });
    
    // Notify
    let badgeLabel = "";
    if (badgeType === "premier_impact") badgeLabel = "Premier Impact 🚀";
    if (badgeType === "ambassadeur_actif") badgeLabel = "Ambassadeur Actif 🌟";
    if (badgeType === "influence_positive") badgeLabel = "Influence Positive 🔥";
    if (badgeType === "presque_gagnant") badgeLabel = "Presque Gagnant 💪";
    if (badgeType === "laureat") badgeLabel = "Lauréat Officiel 🏆";

    await createNotification(userId, "Nouveau badge débloqué !", `Félicitations, vous avez obtenu le badge : ${badgeLabel}`);
  }
};

export const getSponsorBadges = async (userId: string): Promise<Badge[]> => {
  const snaps = await dbGetDocs("referral_badges", [{ field: "userId", op: "==", value: userId }]);
  return snaps.map(s => s.data() as Badge);
};

export const createNotification = async (userId: string, title: string, message: string): Promise<void> => {
  await dbAddDoc("referral_notifications", {
    userId,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString()
  });
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const snaps = await dbGetDocs("referral_notifications", 
    [{ field: "userId", op: "==", value: userId }], 
    "createdAt", "desc"
  );
  return snaps.map(s => s.data() as Notification);
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await dbUpdateDoc("referral_notifications", notificationId, { read: true });
};
