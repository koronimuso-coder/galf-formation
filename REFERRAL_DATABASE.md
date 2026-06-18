# Dictionnaire de Données - GALF Referral Growth OS

Ce document liste l'ensemble des entités, collections Firestore et structures de données utilisées pour le fonctionnement de la plateforme.

---

## 1. Dictionnaire des Collections Firestore

### 1.1 `users`

Contient les comptes utilisateurs et leurs rôles de sécurité.

* **Document ID** : `uid` (fourni par Firebase Auth ou généré USR-XXXXXX)
* **Champs** :
  * `uid` : string (ID unique)
  * `displayName` : string (Nom complet)
  * `email` : string (Adresse e-mail unique)
  * `role` : string (`PARRAIN` | `COMMERCIAL` | `RESPONSABLE_COMMERCIAL` | `COMPTABLE` | `ADMIN_PARRAINAGE` | `SUPER_ADMIN`)
  * `createdAt` : string (ISO Timestamp)
  * `updatedAt` : string (ISO Timestamp)

### 1.2 `referral_campaigns`

Stocke les configurations des campagnes de parrainage.

* **Document ID** : `id` (ex. `CAM-mines-2026`)
* **Champs** :
  * `id` : string (ID campagne)
  * `name` : string (Nom descriptif)
  * `slug` : string (Slug unique pour l'URL)
  * `slogan` : string (Slogan principal)
  * `description` : string (Texte public)
  * `startDate` : string (Date de début)
  * `endDate` : string (Date de fin)
  * `status` : string (`brouillon` | `active` | `terminee` | `suspendue`)
  * `threshold` : number (Seuil d'inscriptions pour la récompense, ex. 5)
  * `rewardDescription` : string (Description du cadeau)
  * `rules` : string (Règlement en Markdown)

### 1.3 `referral_members`

Profils complémentaires des parrains inscrits.

* **Document ID** : `id` (Format : `userId_campaignId` pour garantir l'unicité par campagne)
* **Champs** :
  * `userId` : string (Lien vers `users.uid`)
  * `campaignId` : string (Lien vers `referral_campaigns.id`)
  * `whatsapp` : string (Numéro WhatsApp normalisé, ex: `+2250700000000`)
  * `city` : string (Ville de résidence)
  * `commune` : string (Commune)
  * `currentSituation` : string (Situation professionnelle)
  * `availability` : string (Disponibilité)
  * `objective` : string (Objectif professionnel)
  * `code` : string (Lien vers `referral_codes.code`)
  * `termsAccepted` : boolean (Acceptation règlement)
  * `marketingConsent` : boolean (Consentement marketing)

### 1.4 `referral_codes`

Contient les codes uniques actifs des parrains.

* **Document ID** : `code` (ex. `GALF-RENAUD-8K4P`)
* **Champs** :
  * `code` : string (Code unique de parrainage)
  * `memberId` : string (Lien vers `referral_members.id`)
  * `userId` : string (Lien vers `users.uid`)
  * `campaignId` : string (Lien vers `referral_campaigns.id`)
  * `status` : string (`actif` | `suspendu` | `expire`)

### 1.5 `referred_prospects`

Leads/filleuls générés.

* **Document ID** : `id` (Généré PRP-XXXXXX)
* **Champs** :
  * `id` : string (ID prospect)
  * `campaignId` : string (Lien vers campagne)
  * `sponsorUserId` : string (Lien vers parrain `users.uid`)
  * `referralCode` : string (Code parrain utilisé)
  * `fullName` : string (Nom complet du filleul)
  * `phone` : string (WhatsApp normalisé)
  * `email` : string (Optionnel)
  * `city` : string (Ville)
  * `commune` : string (Commune)
  * `desiredFormationId` : string (Formation demandée)
  * `preferredCenterId` : string (Centre choisi)
  * `assignedCommercialId` : string (Commercial assigné)
  * `status` : string (Statut du pipeline commercial)
  * `leadScore` : number (Score calculé, 0-100)
  * `leadCategory` : string (`froid` | `tiede` | `chaud` | `prioritaire`)
  * `fraudScore` : number (Score de fraude, 0-100)

### 1.6 `referral_rewards`

Bons de récompenses générés pour les parrains.

* **Document ID** : `id` (ex. `GALF-REWARD-2026-000145`)
* **Champs** :
  * `id` : string (Réf unique de récompense)
  * `userId` : string (Lien vers parrain `users.uid`)
  * `campaignId` : string (Lien vers campagne)
  * `status` : string (`eligible` | `verification_en_cours` | `approuvee` | `programmee` | `utilisee` | `refusee`)
  * `reference` : string (Identifiant identique au Document ID)
  * `offeredFormationId` : string (Lien vers la formation offerte)
  * `approvedBy` : string (Lien vers l'admin `users.uid`)
  * `approvedAt` : string (ISO Timestamp)
  * `expiresAt` : string (ISO Timestamp)

### 1.7 `reward_qualifying_entries`

Associe chaque récompense aux 5 prospects qui l'ont déclenchée (pour éviter le double comptage).

* **Document ID** : `id` (Format : `rewardId_prospectId`)
* **Champs** :
  * `rewardId` : string (Lien vers `referral_rewards.id`)
  * `prospectId` : string (Lien vers `referred_prospects.id`)

### 1.8 `payment_records`

Preuves de paiements d'acomptes soumises.

* **Document ID** : `id` (Généré PAY-XXXXXX)
* **Champs** :
  * `prospectId` : string (Lien vers prospect)
  * `amount` : number (Montant versé)
  * `paymentMethod` : string (`wave` | `orange` | `mtn` | `cash`)
  * `reference` : string (Numéro de transaction Wave/OM/MTN)
  * `paymentDate` : string (ISO Timestamp)
  * `status` : string (`a_verifier` | `confirme` | `echoue` | `annule`)
  * `verifiedBy` : string (Lien vers comptable `users.uid`)
  * `comment` : string (Note de rapprochement)

### 1.9 `commercial_activities` & `commercial_tasks`

Suivis d'appels et rappels de relances.

* **`commercial_activities`** : Historique des notes, objections et changements de statut.
* **`commercial_tasks`** : Relances avec date d'échéance (`dueDate`), priorité (`basse` | `moyenne` | `haute`) et statut (`non_commence` | `complete` | `annule`).
