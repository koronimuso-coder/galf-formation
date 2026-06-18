# Mesures de Sécurité & Anti-Fraude - GALF Referral Growth OS

Ce document présente l'analyse de sécurité, la politique de protection des données, et le moteur anti-fraude intégré à la plateforme.

---

## 1. Moteur Anti-Fraude (Fraud Detection Engine)

Pour protéger le budget de formation de GALF FORMATION, un système d'analyse multi-critères a été implémenté lors de la création et du suivi de chaque dossier :

* **Détection d'Auto-Parrainage** : 
  Le système compare le numéro WhatsApp normalisé du parrain et du filleul. Si une correspondance est détectée, le statut du filleul est instantanément forcé à `fraude_suspectee`, le compteur du parrain reste inchangé, et une alerte de sévérité **critique** est enregistrée dans `referral_fraud_flags`.
* **Index d'Unicité & Prévention des Doublons** : 
  Un numéro WhatsApp (format normalisé `+225...`) ne peut être enregistré qu'une seule fois dans la collection `referral_members` (parrains) et une seule fois dans `referred_prospects` (filleuls) pour une même campagne. Toute tentative de double soumission génère un message d'erreur générique ne révélant pas l'existence préalable du compte pour des raisons de sécurité.
* **Logs & Rapprochement Humain** :
  Toute transaction suspecte ou drapeau de fraude suspend l'attribution de la récompense et nécessite une résolution manuelle par l'administrateur de parrainage (rejeter le dossier ou ignorer l'alerte).

---

## 2. Confidentialité & RGPD (Anonymisation des Données)

Pour préserver la vie privée des candidats recommandés et respecter les exigences de protection des données personnelles :
* **Masquage Nominatif** :
  Dans le Cockpit Parrain (`/programme-ambassadeur/dashboard`), les noms et prénoms des filleuls sont anonymisés. Seul le prénom et l'initiale du nom de famille s'affichent (ex. "Jean Renaud" devient `"Jean R."`).
* **Masquage des Coordonnées** :
  Les numéros de téléphone, e-mails, montants précis de facturation, et justificatifs de paiements des filleuls ne sont **jamais transmis** à l'espace parrain. Ils sont uniquement visibles dans le CRM commercial sécurisé et la console comptable.
* **Consentement Actif (Opt-in)** :
  L'inscription de l'ambassadeur nécessite des consentements séparés et explicites (règlement, confidentialité, communications obligatoires). Les cases de consentement ne sont jamais pré-cochées.

---

## 3. Sécurité Web & Headers (Middleware)

Au niveau du serveur, le fichier [middleware.ts](file:///c:/Users/NYAMMA/GALF%20FORMATION/src/middleware.ts) injecte des en-têtes de sécurité HTTP sur toutes les requêtes :
* `X-Frame-Options: SAMEORIGIN` (Prévient le Clickjacking).
* `X-Content-Type-Options: nosniff` (Prévient le reniflage de type MIME).
* `X-XSS-Protection: 1; mode=block` (Bloque les attaques par injection de script XSS).
* `Referrer-Policy: strict-origin-when-cross-origin` (Protège le transfert de référents sensibles).
* `Content-Security-Policy (CSP)` configuré dans [next.config.ts](file:///c:/Users/NYAMMA/GALF%20FORMATION/next.config.ts) restreignant les domaines de script et de connexion autorisés (self, Firebase, Spline).
