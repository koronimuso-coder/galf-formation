# Quick Deployment Guide - GALF Referral Growth OS

Ce fichier sert de checklist rapide pour le déploiement en production. Pour des détails approfondis sur l'architecture, veuillez consulter [REFERRAL_DEPLOYMENT.md](file:///c:/Users/NYAMMA/GALF%20FORMATION/REFERRAL_DEPLOYMENT.md).

---

## 1. Commande de Build & Compilation Locale

Avant de pousser vos modifications sur votre branche principale, assurez-vous que l'application compile sans aucune erreur TypeScript ou Next.js :

```bash
# 1. Nettoyer les caches Next
rm -rf .next

# 2. Installer proprement les dépendances si nécessaire
npm install --legacy-peer-deps

# 3. Lancer la compilation de production localement
npm run build
```

---

## 2. Secrets & Variables d'Environnement à Configurer (Dashboard Vercel)

Configurez les variables suivantes dans le panneau d'administration de votre hébergeur :

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="galf-formation.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="galf-formation"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="galf-formation.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
NEXT_PUBLIC_APP_URL="https://galf-formation.ci"
```

---

## 3. Checklist Post-Lancement (Smoke Test)

1. **Vérification des Domaines** :
   * Accédez à [https://galf-formation.ci/programme-ambassadeur](https://galf-formation.ci/programme-ambassadeur).
   * Vérifiez la présence du bandeau d'ouverture publicitaire **"NE SOIS PAS LE SORCIER DE TA FAMILLE"**.
2. **Attribution par Clic** :
   * Ouvrez l'URL avec un paramètre de test : `https://galf-formation.ci/programme-ambassadeur?ref=GALF-TEST-8K4P`.
   * Vérifiez qu'un bandeau jaune confirme la détection du parrain.
3. **Création de Dossier** :
   * Complétez une inscription complète et vérifiez la génération instantanée de la carte ambassadeur avec son QR Code.
4. **Vérification de Sécurité (Rôles)** :
   * Tentez d'accéder à `/programme-ambassadeur/admin` sans être connecté. Le système doit vous renvoyer vers la page de connexion.
