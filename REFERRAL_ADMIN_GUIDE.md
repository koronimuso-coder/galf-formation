# Guide de l'Administrateur - GALF Referral Growth OS

Ce guide pratique est destiné aux administrateurs du programme et comptables de GALF FORMATION. Il explique comment gérer les campagnes, valider les paiements, attribuer les récompenses, et utiliser les exports.

---

## 1. Gestion des Campagnes de Parrainage

Pour configurer ou lancer une nouvelle campagne :
1. Connectez-vous avec vos identifiants d'administration sur `/programme-ambassadeur/connexion`.
2. Accédez à l'onglet **Campagnes**.
3. Remplissez le formulaire de création :
   * **Nom** : ex. "Campagne de Rentrée BTP 2026".
   * **Slug** : ex. "rentree-2026" (l'URL de partage sera `galf-formation.ci/programme-ambassadeur?ref=CODE`).
   * **Seuil** : 5 inscriptions validées.
   * **Slogan publicitaire** : Slogan accrocheur qui apparaîtra sur la landing page.
4. Cliquez sur **Enregistrer Brouillon**.
5. Pour lancer officiellement la campagne, cliquez sur le bouton **Activer** à côté du brouillon. L'activation d'une campagne clôture automatiquement les autres campagnes actives pour éviter les conflits d'attribution.

---

## 2. Validation Comptable des Paiements (Acomptes)

Lorsqu'un commercial ou un candidat déclare un paiement d'acompte (Wave, Orange, MTN ou Espèces) :
1. Accédez à l'onglet **Paiements** dans la console d'administration.
2. Une liste de transactions en attente s'affiche.
3. Comparez les informations (montant, référence de transaction Wave/OM/MTN, nom du candidat) avec votre compte bancaire ou vos passerelles de paiement.
4. Cliquez sur **Valider Paiement**.
5. Rédigez un court commentaire de rapprochement (ex. "Reçu sur compte Wave GALF n°1 le 18/06"), puis cliquez sur **Confirmer** ou **Échoué**.
   * *Si vous confirmez* : le statut du prospect passe à "Inscription Validée" et le compteur de son parrain est incrémenté. S'il atteint le seuil (5), une alerte de récompense est déclenchée.
   * *Si vous marquez échoué* : le prospect est renvoyé au statut "À contacter" et le commercial est notifié de l'échec de la transaction.

---

## 3. Attribution & Approbation des Récompenses

Le moteur de récompenses détecte automatiquement quand un parrain atteint 5 inscriptions confirmées.
1. Accédez à l'onglet **Récompenses** (les dossiers à valider affichent le statut `eligible`).
2. Cliquez sur **Approuver le dossier**.
3. Sélectionnez dans la liste déroulante la formation offerte choisie par l'ambassadeur (ex. "Pelle Hydraulique" d'une valeur de 195 000 F CFA).
4. Cliquez sur **Approuver & Émettre**.
   * Le bon de récompense passe au statut "approuvee".
   * Une notification est envoyée au parrain dans son cockpit.
   * Le parrain dispose de 90 jours pour réclamer sa session gratuite en contactant GALF avec sa référence `GALF-REWARD-2026-XXXXXX`.

---

## 4. Simulation de Rentabilité & Exports

* **Indicateurs ROI** : Utilisez l'onglet **Moniteur & ROI** pour simuler le retour sur investissement. Saisissez le tarif moyen de vos formations et les coûts marketing réels pour voir s'afficher la marge brute globale générée par la campagne parrainage.
* **Exports CSV** : L'onglet **Exports B.O.** vous permet de télécharger en un clic sous Excel la liste complète des ambassadeurs, des filleuls, des paiements reçus et des récompenses attribuées. Les fichiers sont encodés en BOM UTF-8 pour supporter les accents.
