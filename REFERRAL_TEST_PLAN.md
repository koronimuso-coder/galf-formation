# Plan de Tests & Recette - GALF Referral Growth OS

Ce document présente le plan de tests unitaires, d'intégration, et de bout en bout (E2E) pour valider le bon fonctionnement de la plateforme de parrainage.

---

## 1. Tests Unitaires & Algorithmes

### 1.1 Normalisation du Numéro WhatsApp (`normalizeWhatsApp`)

* **Objectif** : Valider que tous les formats de numéros ivoiriens ou internationaux saisis par les utilisateurs sont correctement nettoyés pour WhatsApp et indexés de manière unique en base.
* **Cas de Test** :
  * Saisie : `"07 08 73 68 71"` ➔ Sortie attendue : `"+2250708736871"`
  * Saisie : `"01-02-03-04-05"` ➔ Sortie attendue : `"+2250102030405"`
  * Saisie : `"+225 07 11 82 65 07"` ➔ Sortie attendue : `"+2250711826507"`
  * Saisie : `"2250556966492"` ➔ Sortie attendue : `"+2250556966492"`

### 1.2 Unicité & Formatage du Code Parrain (`generateUniqueReferralCode`)

* **Objectif** : Vérifier que le format `GALF-PRENOM-XXXX` est respecté, ne contient pas de caractères spéciaux ou d'accents, et qu'une collision de code en base de données déclenche une régénération automatique avec un nouveau suffixe aléatoire.

### 1.3 Moteur de Lead Scoring (`evaluateLeadScore`)

* **Objectif** : Confirmer que les points sont correctement attribués et que la catégorie associée est exacte.
* **Cas de Test** :
  * Prospect froid (sans email, situation inconnue) ➔ Score : `15 pts` (Catégorie: `froid`)
  * Prospect qualifié (avec email, disponibilité immédiate, ville Abidjan) ➔ Score : `60 pts` (Catégorie: `tiede`)
  * Prospect chaud (dossier commencé, RDV prévu) ➔ Score : `85 pts` (Catégorie: `prioritaire`)

---

## 2. Tests d'Intégration & Scénarios E2E

### Scénario de Rapprochement Financier & Progression Parrain

1. **Étape 1 : Création du Parrain**
   * Un ambassadeur s'inscrit sur `/programme-ambassadeur/inscription` sous le nom "Koffi Marc".
   * Le système génère le code `GALF-MARC-A1B2`.
   * Le badge "Premier Impact" est attribué et une notification de bienvenue apparaît.
2. **Étape 2 : Clic Filleul & Cookie d'Attribution**
   * Un proche clique sur le lien `https://galf-formation.ci/programme-ambassadeur?ref=GALF-MARC-A1B2`.
   * Le système dépose le cookie `galf_ref_code=GALF-MARC-A1B2` et enregistre le clic dans `referral_clicks`.
3. **Étape 3 : Inscription Filleul**
   * Le filleul s'inscrit au tunnel standard de formation. Le code `GALF-MARC-A1B2` est lu depuis le cookie et prérempli.
   * Le prospect est créé dans `referred_prospects` avec le statut "Nouveau Prospect" et attribué à un commercial.
4. **Étape 4 : Suivi Commercial & Paiement**
   * Le commercial appelle le prospect et planifie un rappel.
   * Le prospect règle son acompte de 30%. Le commercial soumet la référence Wave dans le CRM.
   * Le statut du prospect passe à "Paiement à Vérifier".
5. **Étape 5 : Rapprochement Bancaire (Comptable)**
   * Le comptable vérifie la référence Wave, ajoute une note et valide le paiement.
   * Le statut du prospect passe à "Inscription Validée".
   * La progression de Koffi Marc passe à 1/5.
6. **Étape 6 : Récompense automatique à 5/5**
   * Au 5ème filleul validé selon le même parcours, Koffi Marc passe au statut "Éligible".
   * Le système émet une alerte et génère la référence de récompense `GALF-REWARD-2026-XXXXXX`.
   * L'administrateur valide le dossier, sélectionne la formation offerte "Grue Mobile" et approuve le bon.
   * Le parrain reçoit sa notification et son badge de "Lauréat Officiel".

---

## 3. Tests de Résistance & Cas Limites

* **Auto-parrainage** : Tentative d'inscription d'un filleul ayant le même numéro WhatsApp que son parrain. ➔ *Résultat attendu* : Le dossier est créé mais taggué instantanément "Fraude Suspectée", bloquant le compteur du parrain et générant un drapeau d'alerte critique.
* **Soumissions Simultanées** : Double clic sur le bouton de soumission d'acompte. ➔ *Résultat attendu* : Le bouton est désactivé au premier clic pour empêcher le doublon de transaction.
