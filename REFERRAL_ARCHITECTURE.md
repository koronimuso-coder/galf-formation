# Architecture Technique - GALF Referral Growth OS

Ce document décrit l'architecture logicielle de la plateforme **GALF Referral Growth OS** intégrée au site principal de GALF FORMATION.

---

## 1. Vue d'Ensemble de l'Architecture

La plateforme repose sur une architecture Next.js 15 (App Router) connectée à une base de données Firebase Firestore, sécurisée par un middleware Next.js au niveau serveur, et animée par Tailwind CSS, Framer Motion et GSAP côté client.

```text
┌──────────────────────────────────────────────────────────────────┐
│                           Client Web                             │
│  (Landing Page, Cockpit Parrain, CRM Commercial, Admin Console)  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Routage & Sécurité (Middleware)                │
│    (Filtres de cookies de session et vérification de rôles)      │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Couche Service DB                          │
│     (Abstrait l'accès entre Firestore et LocalStorage)           │
└───────────────┬──────────────────────────────────┬───────────────┘
                │ (Si clés valides)                │ (Si clés "Dummy")
                ▼                                  ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│      Firebase Firestore      │    │  LocalStorage (Navigateur)   │
│   (Production Cloud DB)      │    │    (Mode Simulation Dev)     │
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## 2. Structure des Dossiers & Fichiers Créés

L'intégration a été réalisée selon une structure modulaire et typée :

* **`/src/app/programme-ambassadeur/`** : Contient toutes les routes et pages de la plateforme :
  * `page.tsx` : Landing page de présentation premium avec simulateur de progression interactif.
  * `reglement/page.tsx` : Règlement légal officiel validable par GALF.
  * `inscription/page.tsx` : Formulaire d'inscription mobile-first multi-étapes.
  * `connexion/page.tsx` : Page d'authentification centralisée pour tous les rôles.
  * `dashboard/page.tsx` : Cockpit Parrain/Ambassadeur avec carte digitale canvas.
  * `commercial/page.tsx` : CRM de vente avec pipeline (15 étapes), lead scoring explicable et rappels.
  * `responsable/page.tsx` : Cockpit supervision (Round-Robin, KPI de l'équipe commerciale).
  * `admin/page.tsx` : Administration centrale (Moniteur, validations comptables, moteur de récompenses).

* **`/src/lib/firebase/services/`** : Services logiques et connexion avec la base de données :
  * `dbClient.ts` : Client d'accès unifié Firestore / LocalStorage.
  * `auth.ts` : Authentification, rôles et cookies de session.
  * `referral.ts` : Gestion des codes, clics, parrains et notifications.
  * `commercial.ts` : Gestion des prospects, pipelines, lead scoring et rappels.
  * `admin.ts` : Gestion des paiements, calculs de ROI, fraudes et exports.

---

## 3. Dispositif de Redirection & SEO

* **Redirection 301** : Pour préserver le SEO et rediriger proprement les anciens liens de campagnes, une redirection permanente a été ajoutée dans [next.config.ts](file:///c:/Users/NYAMMA/GALF%20FORMATION/next.config.ts) :
  `/programme-parrainage` ➔ `/programme-ambassadeur` (permanent 301).
* **Indexation** : Les répertoires privés (`/programme-ambassadeur/dashboard`, `/programme-ambassadeur/admin`, etc.) sont exclus de l'indexation des moteurs de recherche au niveau du fichier robot/sitemap.

---

## 4. Règle d'Attribution Temporaire (30 jours)

Lorsqu'un prospect clique sur le lien d'un ambassadeur (`?ref=GALF-XXXX`) :

1. Le code est enregistré dans un cookie de session client `galf_ref_code` (expirant sous 30 jours) et sauvegardé dans le `localStorage` en secours.
2. Un clic anonymisé est enregistré dans la collection `referral_clicks` (avec empreinte anonyme de l'IP pour le calcul du taux de clics).
3. Lors de l'inscription finale du filleul, le code parrain est automatiquement lu depuis le cookie et prérempli dans son dossier, empêchant toute modification involontaire.
