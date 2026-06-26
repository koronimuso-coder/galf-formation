import { auth } from "../config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut} from "firebase/auth";
import { dbGetDoc, dbSetDoc, dbGetDocs } from "./dbClient";

// Helper to check if Firebase Auth is in dummy mode
const isDummy = () => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !key || key.includes("Dummy") || key === "" || !auth;
};

// Set cookies for middleware
const setAuthCookies = (uid: string, role: string) => {
  if (typeof document === "undefined") return;
  // Set cookies valid for 30 days
  const maxAge = 30 * 24 * 60 * 60;
  document.cookie = `session=${uid}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const clearAuthCookies = () => {
  if (typeof document === "undefined") return;
  document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'PARRAIN' | 'COMMERCIAL' | 'RESPONSABLE_COMMERCIAL' | 'COMPTABLE' | 'ADMIN_PARRAINAGE' | 'SUPER_ADMIN';
  createdAt?: string;
}

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: UserProfile['role'] = 'PARRAIN'
): Promise<UserProfile> => {
  if (isDummy()) {
    // Generate dummy UID
    const uid = `USR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // Check if user already exists in users collection
    const existing = await dbGetDocs("users", [{ field: "email", op: "==", value: email }]);
    if (existing.length > 0) {
      throw new Error("Un compte est déjà associé à cette adresse e-mail.");
    }

    const profile: UserProfile = {
      uid,
      email,
      displayName,
      role,
      createdAt: new Date().toISOString()
    };
    
    await dbSetDoc("users", uid, profile);
    setAuthCookies(uid, role);
    return profile;
  } else {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      };
      
      await dbSetDoc("users", cred.user.uid, profile);
      setAuthCookies(cred.user.uid, role);
      return profile;
    } catch (e: any) {
      console.error("Auth register error:", e);
      throw new Error(e.message || "Erreur lors de la création du compte.");
    }
  }
};

// Sign in a user
export const signInUser = async (email: string, password: string): Promise<UserProfile> => {
  if (isDummy()) {
    const docs = await dbGetDocs("users", [{ field: "email", op: "==", value: email }]);
    if (docs.length === 0) {
      throw new Error("Identifiants incorrects ou compte inexistant.");
    }
    const profile = docs[0].data() as UserProfile;
    // For testing/mock purposes, any password is accepted in dummy mode
    setAuthCookies(profile.uid, profile.role);
    return profile;
  } else {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user profile from database to get the role
      const profileSnap = await dbGetDoc("users", cred.user.uid);
      if (profileSnap.exists()) {
        const profile = profileSnap.data() as UserProfile;
        setAuthCookies(cred.user.uid, profile.role);
        return profile;
      } else {
        // Fallback default role
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || "Utilisateur GALF",
          role: "PARRAIN",
          createdAt: new Date().toISOString()
        };
        await dbSetDoc("users", cred.user.uid, profile);
        setAuthCookies(cred.user.uid, profile.role);
        return profile;
      }
    } catch (e: any) {
      console.error("Auth signin error:", e);
      throw new Error("Identifiants incorrects. Veuillez réessayer.");
    }
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  clearAuthCookies();
  if (!isDummy()) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error("Auth signout error:", e);
    }
  }
};

// Get current session user profile
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  if (typeof window === "undefined") return null;
  // Get uid from cookies
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find(row => row.startsWith("session="));
  if (!sessionCookie) return null;
  const uid = sessionCookie.split("=")[1];
  
  const snap = await dbGetDoc("users", uid);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};
