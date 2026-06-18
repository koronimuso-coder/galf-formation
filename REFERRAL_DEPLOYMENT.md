# Manuel de Déploiement - GALF Referral Growth OS

Ce document décrit la procédure étape par étape pour mettre en production la plateforme de parrainage sur l'infrastructure de GALF FORMATION (Vercel + Firebase).

---

## 1. Variables d'Environnement Requises

Avant de compiler le projet sur Vercel, assurez-vous d'ajouter les clés Firebase de production dans vos variables d'environnement Vercel :

| Clé | Description | Exemple de valeur |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Clé d'API Firebase Web | `AIzaSyA1B2C3D4...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domaine Auth Firebase | `galf-formation.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID unique du projet Firebase | `galf-formation` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de stockage Firebase | `galf-formation.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID de messagerie Firebase | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ID de l'application Web Firebase | `1:123456:web:abcd` |
| `NEXT_PUBLIC_APP_URL` | URL canonique du site web | `https://galf-formation.ci` |

---

## 2. Configuration de Firebase Firestore (Indexation)

Pour exécuter les requêtes de filtres et de tris du CRM commercial et de l'administration, vous devez créer des index composites dans votre console Firebase (onglet Firestore > Index > Créer un index) :

1. **Index Composite 1** :
   * Collection : `referred_prospects`
   * Champ 1 : `sponsorUserId` (Ascendant)
   * Champ 2 : `campaignId` (Ascendant)
   * Champ 3 : `status` (Ascendant)
2. **Index Composite 2** :
   * Collection : `referred_prospects`
   * Champ 1 : `assignedCommercialId` (Ascendant)
   * Champ 2 : `createdAt` (Descendant)
3. **Index Composite 3** :
   * Collection : `referral_rewards`
   * Champ 1 : `userId` (Ascendant)
   * Champ 2 : `campaignId` (Ascendant)
   * Champ 3 : `createdAt` (Descendant)

---

## 3. Déploiement sur Vercel

Le projet est pré-configuré pour Vercel.

1. Connectez votre dépôt Git à votre compte Vercel.
2. Configurez les variables ci-dessus dans **Project Settings > Environment Variables**.
3. Lancez le déploiement. Vercel exécutera automatiquement le build :
   `npm run build` (Next.js compilera et optimisera les images et routes statiques).

---

## 4. Plan de Recette & Rollback

### Tests Post-Déploiement (Smoke Tests)

* Accédez à `/programme-parrainage` et vérifiez que vous êtes redirigé en 301 vers `/programme-ambassadeur`.
* Créez un compte parrain de test, téléchargez sa carte ambassadeur en format image, et vérifiez que le QR Code s'affiche correctement.
* Enregistrez un filleul de test avec le code du parrain, connectez-vous au cockpit commercial, et vérifiez que le prospect s'affiche dans votre pipeline avec son score d'intérêt calculé.

### Procédure de Rollback (Retour Arrière)

En cas d'erreur critique après mise en production :

1. Sur la console Vercel, accédez à l'onglet **Deployments**.
2. Sélectionnez le déploiement précédent stable.
3. Cliquez sur les options (trois points) et sélectionnez **Redeploy** ou **Promote to Production** pour restaurer immédiatement la version précédente sous 10 secondes.
