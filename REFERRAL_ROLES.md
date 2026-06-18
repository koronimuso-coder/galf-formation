# Gestion des Rôles & Autorisations - GALF Referral Growth OS

Ce document présente la matrice de sécurité et les autorisations d'accès par rôle pour la plateforme de parrainage de GALF FORMATION.

---

## 1. Définition des Rôles

La plateforme prend en charge 6 profils d'utilisateurs distincts :

1. **`PARRAIN` (Ambassadeur)** : 
   Apprenant, prospect, ancien élève ou partenaire qui recommande GALF. Accède uniquement à son cockpit personnel, son code, ses filleuls anonymisés, ses badges et ses récompenses.
2. **`COMMERCIAL`** : 
   Conseiller commercial chargé de contacter et convertir les prospects qui lui sont attribués. Accède à son pipeline de vente dédié, ses rappels et peut soumettre des preuves de paiement.
3. **`RESPONSABLE_COMMERCIAL` (Superviseur)** : 
   Superviseur des ventes. Dispose d'une vue sur toutes les performances des commerciaux, peut réassigner manuellement des leads et effectuer des validations de dossier de niveau 1.
4. **`COMPTABLE` (Validateur Financier)** : 
   Agent administratif chargé du rapprochement bancaire. Reçoit les alertes de paiement de l'acompte (Wave/OM/MTN) et valide ou rejette les transactions pour débloquer l'inscription.
5. **`ADMIN_PARRAINAGE`** : 
   Administrateur du programme. Gère les campagnes de parrainage, approuve et émet les récompenses (dossiers à 5 validated leads), examine les fraudes.
6. **`SUPER_ADMIN`** : 
   Accès total et illimité à l'ensemble du système, incluant la configuration de la sécurité globale, des variables d'environnement et de l'audit trail général.

---

## 2. Matrice des Droits d'Accès (CRUD)

| Ressource / Collection | PARRAIN | COMMERCIAL | RESPONSABLE | COMPTABLE | ADMIN_PARRAINAGE | SUPER_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`users`** | R (soi) | R (soi) | R | R (soi) | R / W | R / W / D |
| **`referral_campaigns`** | R | R | R | R | R / W | R / W / D |
| **`referral_members`** | R / W (soi) | R | R | R | R / W | R / W / D |
| **`referred_prospects`** | R (anonyme) | R / W (assigné) | R / W | R | R / W | R / W / D |
| **`payment_records`** | - | R / W (créer) | R | R / W (valider) | R | R / W / D |
| **`referral_rewards`** | R (soi) | R (assigné) | R | R | R / W (valider) | R / W / D |
| **`referral_fraud_flags`** | - | - | R | R | R / W (résoudre) | R / W / D |
| **`admin_audit_logs`** | - | - | - | - | R | R |

*Légende : **R** (Read), **W** (Write/Update), **D** (Delete/Archive), **-** (Aucun accès).*

---

## 3. Sécurité Côté Serveur (Next.js Middleware)

Toutes les routes d'espaces privés sont filtrées côté serveur dans [middleware.ts](file:///c:/Users/NYAMMA/GALF%20FORMATION/src/middleware.ts) par le biais des cookies `session` et `user_role`. Un utilisateur tentant de forcer l'URL d'un autre rôle est automatiquement redirigé vers la page de connexion :
* `/programme-ambassadeur/dashboard` ➔ Réservé aux parrains et admins.
* `/programme-ambassadeur/commercial` ➔ Réservé aux commerciaux et superviseurs.
* `/programme-ambassadeur/responsable` ➔ Réservé aux superviseurs et admins.
* `/programme-ambassadeur/admin` ➔ Réservé aux comptables, admins de parrainage et super-admins.
