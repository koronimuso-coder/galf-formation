// Standalone test runner for GALF Referral Growth OS business rules
// Run this file using: node scratch/test-referral.js

const { normalizeWhatsApp } = require('../src/lib/firebase/services/referral');
const { evaluateLeadScore } = require('../src/lib/firebase/services/commercial');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`\x1b[32m[PASS]\x1b[0m ${message}`);
    testsPassed++;
  } else {
    console.error(`\x1b[31m[FAIL]\x1b[0m ${message}`);
    testsFailed++;
  }
}

console.log("=== EXÉCUTION DU PLAN DE TESTS REFERRAL ===");

// 1. WhatsApp Normalization Tests
try {
  console.log("\n--- Tests de normalisation WhatsApp ---");
  
  // Standard 10 digits CI format starting with 07
  assert(
    normalizeWhatsApp("0708736871") === "+2250708736871",
    "Nettoyage 10 chiffres Standard CI (07...)"
  );
  
  // Format with spaces and dashes
  assert(
    normalizeWhatsApp("+225 07-11-82-65-07") === "+2250711826507",
    "Suppression des espaces et tirets"
  );
  
  // Format starting with 225 directly
  assert(
    normalizeWhatsApp("2250556966492") === "+2250556966492",
    "Ajout du préfixe '+' sur indicatif direct"
  );
  
  // Format starting with 00225
  assert(
    normalizeWhatsApp("002250707070707") === "+2250707070707",
    "Correction du double zéro international"
  );
} catch (e) {
  console.error("Erreur durant les tests WhatsApp:", e);
  testsFailed++;
}

// 2. Lead Scoring Tests
try {
  console.log("\n--- Tests du calculateur de Lead Scoring ---");
  
  // Test case 1: Base prospect
  const baseProspect = {
    fullName: "Koffi Blaise",
    phone: "+2250707070707"
  };
  const res1 = evaluateLeadScore(baseProspect);
  assert(
    res1.score === 15 && res1.category === "froid",
    `Score de base: ${res1.score}/100 (Attendu: 15) - Catégorie: ${res1.category}`
  );

  // Test case 2: Warm prospect with email and residency in training center
  const warmProspect = {
    fullName: "Yao Anderson",
    phone: "+2250711826507",
    email: "yao@mail.com",
    city: "San Pedro",
    availability: "immédiate",
    professionalObjective: "Devenir opérateur certifié de pelle hydraulique pour chantiers miniers."
  };
  const res2 = evaluateLeadScore(warmProspect);
  assert(
    res2.score === 75 && res2.category === "chaud",
    `Score qualifié chaud: ${res2.score}/100 (Attendu: 75) - Catégorie: ${res2.category}`
  );

  // Test case 3: Priority prospect with payment in validation queue
  const priorityProspect = {
    fullName: "Bamba Mariam",
    phone: "+2250556966492",
    email: "mariam@mail.com",
    city: "Abidjan",
    availability: "totalement disponible",
    professionalObjective: "Se former au métier de cariste logistique.",
    status: "paiement_a_verifier"
  };
  const res3 = evaluateLeadScore(priorityProspect);
  assert(
    res3.score === 100 && res3.category === "prioritaire",
    `Score acompte en cours: ${res3.score}/100 (Attendu: 100 cap) - Catégorie: ${res3.category}`
  );
  
} catch (e) {
  console.error("Erreur durant les tests Lead Scoring:", e);
  testsFailed++;
}

console.log("\n=================================");
console.log(`Bilan : ${testsPassed} tests réussis, ${testsFailed} tests échoués.`);
if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
