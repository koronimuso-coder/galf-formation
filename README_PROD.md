# GALF FORMATION - DOCUMENTATION ET MISE EN PRODUCTION

Ce document contient toutes les informations requises pour exploiter le projet en mode Production, sur Vercel, et comment le configurer techniquement.

## 1. DÉPLOIEMENT VERCEL
1. Créez un compte sur [Vercel](https://vercel.com/)
2. Installez le Vercel CLI ou connectez votre compte Github.
3. À la racine du projet, si via CLI, exécutez `vercel`.
4. Configurez les variables d'environnement dans le dashboard Vercel en copiant le contenu de `.env.example`.

## 2. GESTION DES MÉDIAS ET 3D
### Modèles 3D (React Three Fiber)
Actuellement, le composant `src/components/3d/HeroScene.tsx` utilise des primitives mathématiques (boxGeometry, cylinderGeometry) comme placeholders ("placeholders cheap" évités en créant un rendu abstrait stylisé).
**Pour utiliser un vrai modèle (GLTF/GLB) :**
1. Exportez vos machines au format `.glb` optimisé (draco compression recommandée).
2. Glissez les fichiers dans le dossier `/public/models/`. (ex: `/public/models/excavator.glb`)
3. Dans `HeroScene.tsx`, importez `useGLTF` de `@react-three/drei`.
4. Remplacez le composant `PlaceholderMachine` par :
\`\`\`tsx
const { scene } = useGLTF('/models/excavator.glb')
return <primitive object={scene} />
\`\`\`

### Remplacement des Images Réelles
- Les images proviennent actuellement d'Unsplash via les URLs directes.
- Téléchargez vos médias HD, compressez-les au format `webp`.
- Placez-les dans un dossier `/public/images/`.
- Dans `src/lib/data.ts`, remplacez les clés `imageUrl` par les chemins locaux (ex: `/images/pelle-hd.webp`).

## 3. FIREBASE ET BASE DE DONNÉES
- Un schéma complet a été structuré dans `database_schema.md`.
- Le fichier `src/lib/firebase/config.ts` initialise le backend.
- Les données actuelles de démonstration (GALF_FORMATIONS) sont injectées côté client dans `data.ts`.
- **Pour passer sur la prod :**
  1. Activer Cloud Firestore et Firebase Authentication (Email/Password).
  2. Remplacer les appels simulés (Mock) dans les formulaires d'inscription par des requêtes d'insertion Firestore (`addDoc(collection(db, 'applications'), formData)`).

## 4. MIDDLEWARE ET SÉCURITÉ
- Le fichier `src/middleware.ts` empêche l'accès aux dossiers protégés (`/admin`, `/candidat`, etc.) si un cookie de session n'est pas présent.
- Assurez-vous lors de la connexion Firebase de basculer l'ID Token Firebase en *Session Cookie* côté serveur afin que Next.js puisse intercepter et valider l'authenticité de l'utilisateur.

## 5. PAIEMENT
Des points d'entrées virtuels sont conçus dans `/candidat`. Pour intégrer **Wave / Orange Money**, vous devrez écrire une Route d'API Next.js dans `/src/app/api/payments/route.ts` afin d'initier la transaction serveur à serveur, de récupérer un lien de paiement et de le renvoyer au Frontend.
