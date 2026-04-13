# GALF FORMATION - Plateforme Web Full Stack 🚀

Une plateforme web premium, complète et immersive développée pour GALF FORMATION, le leader de la formation aux engins lourds en Côte d'Ivoire.
Ce projet intègre les technologies les plus avancées pour offrir une expérience hors norme : **Next.js 15, Tailwind CSS, GSAP, React Three Fiber (3D), Zustand, Firebase**.

## 🏗 Architecture & Fonctionnalités

1. **Site Vitrine Premium (UI / UX)**
   - Accueil spectaculaire avec scène 3D (React Three Fiber)
   - Animations fluides via GSAP & ScrollTrigger
   - Mode sombre industriel premium (Anthracite, Noir Charbon, Jaune Sécurité)
   - Catalogue de formations complet avec filtres
   - Fiches formation dynamiques

2. **Tunnel d'Inscription**
   - Inscription multi-étapes
   - Validation de formulaire
   - Sauvegarde de progression d'inscription

3. **Espace Candidat**
   - Suivi de l'évolution du dossier
   - Gestion des documents requis
   - Suivi financier et paiements

4. **Espace Apprenant (LMS)**
   - Tableau de bord personnel
   - Reprise de lecture vidéo
   - Suivi de progression (modules, quiz)
   - Téléchargement de documents & Certificats

5. **Interface Administrateur (CRM/LMS)**
   - Suivi statistique (Inscriptions, Revenus, Leads)
   - Gestion des formations
   - Pilotage des candidats
   - Gestion des rôles

## 🚀 Technologie

- **Framework Front :** Next.js 15 (App Router)
- **Langage :** TypeScript strict
- **Styles :** Tailwind CSS v3 / Shadcn UI
- **Animations :** GSAP
- **3D :** Three.js + React Three Fiber
- **Data & Auth :** Firebase (prêt à l'emploi)
- **Déploiement :** Prêt pour Vercel

## ⚙️ Exécution Locale

\`\`\`bash
# 1. Nettoyer les caches si problèmes npm connus (Recommandé sur PC Windows)
npm cache clean --force

# 2. Installer les dépendances 
npm install --legacy-peer-deps

# 3. Lancer le serveur de développement
npm run dev
\`\`\`

## 📚 Structure

- `src/app/` : Routes Next.js
  - `/` -> Accueil (Hero 3D, Stats, Carousel)
  - `/formations` -> Catalogue
  - `/inscription` -> Tunnel form
  - `/candidat` -> Espace Candidat
  - `/apprenant` -> LMS Espace
  - `/admin` -> Dashboard Admin
- `src/components/` : Composants Réutilisables
  - `layout/` -> Navbar, Footer
  - `animations/` -> FadeIn GSAP Wrappers
  - `3d/` -> `HeroScene.tsx` (Scène placeholder R3F)
- `src/lib/` : Utilitaires et Data 
  - `data.ts` -> Seed complet des 19 formations GALF avec prix et spécifications réelles
  - `utils.ts` -> Fonction merge (shadcn)

## 🎯 Prochaines étapes de déploiement réel
- Ajouter les vrais clés Firebase API
- Modèles 3D GLTF réels des engins dans `/public/models`
- Connexion passerelle de paiement
