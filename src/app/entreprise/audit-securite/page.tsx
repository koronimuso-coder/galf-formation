"use client"
import { useState } from 'react'

import { ClipboardCheck, Calculator, ArrowRight, ArrowLeft, 
  Download, RefreshCw} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { PageHeader } from '@/components/layout/PageHeader'
import { jsPDF } from 'jspdf'

export default function SafetyAuditPage() {
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState("")
  const [siteLocation, setSiteLocation] = useState("")
  const [siteType, setSiteType] = useState("BTP / Génie Civil")
  
  // Numerical questions
  const [fleetSize, setFleetSize] = useState(8)
  const [certifiedOperatorsPercent, setCertifiedOperatorsPercent] = useState(60) // 0-100%
  
  // Yes/No Boolean questions
  const [hasVgpRoutine, setHasVgpRoutine] = useState<boolean | null>(null)
  const [hasSurchargeAlarm, setHasSurchargeAlarm] = useState<boolean | null>(null)
  const [hasHseManager, setHasHseManager] = useState<boolean | null>(null)
  const [hasPowerlinesNear, setHasPowerlinesNear] = useState<boolean | null>(null)
  const [hasPpeMandatory, setHasPpeMandatory] = useState<boolean | null>(null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [auditDone, setAuditDone] = useState(false)
  const [auditId, setAuditId] = useState("")

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleCalculateAudit = () => {
    setAuditId(`AUDIT-GALF-${Math.floor(100000 + Math.random() * 900000)}`)
    setAuditDone(true)
  }

  const handleReset = () => {
    setStep(1)
    setCompanyName("")
    setSiteLocation("")
    setSiteType("BTP / Génie Civil")
    setFleetSize(8)
    setCertifiedOperatorsPercent(60)
    setHasVgpRoutine(null)
    setHasSurchargeAlarm(null)
    setHasHseManager(null)
    setHasPowerlinesNear(null)
    setHasPpeMandatory(null)
    setAuditDone(false)
  }

  // Risk calculation engine
  const getRiskScore = () => {
    let penalty = 0
    
    // Certified operators penalty (ideal = 100%)
    if (certifiedOperatorsPercent < 100) {
      penalty += (100 - certifiedOperatorsPercent) * 0.4
    }

    // Checking safety routines
    if (hasVgpRoutine === false) penalty += 15
    if (hasSurchargeAlarm === false) penalty += 10
    if (hasHseManager === false) penalty += 15
    if (hasPpeMandatory === false) penalty += 15
    
    // Environmental threat weight
    if (hasPowerlinesNear === true) penalty += 10

    const score = Math.max(0, Math.min(100, Math.round(penalty)))
    return score
  }

  const riskScore = getRiskScore()
  
  const getRiskTier = (score: number) => {
    if (score >= 60) return { label: "RISQUE ÉLEVÉ", color: "text-red-500 bg-red-500/10 border-red-500/20", desc: "Le chantier présente des non-conformités critiques. Mesures d'urgence recommandées." }
    if (score >= 30) return { label: "RISQUE MODÉRÉ", color: "text-orange-500 bg-orange-500/10 border-orange-500/20", desc: "Des écarts de conformité importants ont été relevés. Une mise à niveau des équipes est nécessaire." }
    return { label: "RISQUE FAIBLE", color: "text-green-500 bg-green-500/10 border-green-500/20", desc: "Le chantier respecte globalement les normes HSE standards. Continuez la veille." }
  }

  const riskTier = getRiskTier(riskScore)

  const handleDownloadPDFReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const doc = new jsPDF()
        
        // Header
        doc.setFillColor(26, 26, 29)
        doc.rect(0, 0, 210, 55, "F")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(22)
        doc.setTextColor(255, 176, 0)
        doc.text("GALF FORMATION", 15, 22)
        
        doc.setFontSize(9)
        doc.setTextColor(150, 150, 150)
        doc.text("AUDIT DE SÉCURITÉ & ANALYSE DE CONFORMITÉ CHANTIER B2B", 15, 29)

        doc.setFontSize(8.5)
        doc.setTextColor(180, 180, 180)
        doc.text(`Identifiant Rapport : ${auditId}`, 15, 38)
        doc.text(`Entreprise : ${companyName || 'Non spécifié'}  |  Chantier : ${siteLocation || 'Non spécifié'}`, 15, 43)

        // Accent line
        doc.setFillColor(255, 176, 0)
        doc.rect(0, 52, 210, 3, "F")

        // Content
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.setTextColor(30, 30, 30)
        doc.text("RÉSULTAT DU DIAGNOSTIC DE SÉCURITÉ CHANTIER", 15, 70)

        // Risk score gauge text
        doc.setFontSize(12)
        doc.text(`Indice de Vulnérabilité Globale : ${riskScore} %`, 15, 80)
        doc.text(`Classement Risque : ${riskTier.label}`, 15, 86)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9.5)
        doc.setTextColor(80, 80, 80)
        doc.text(`Secteur : ${siteType}  |  Nombre d'engins lourds actifs : ${fleetSize}`, 15, 93)

        let currentY = 105

        // Table headers for vulnerabilities
        doc.setFillColor(30, 30, 30)
        doc.rect(15, currentY, 180, 8, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8.5)
        doc.text("Point de conformité inspecté", 18, currentY + 5.5)
        doc.text("Statut", 130, currentY + 5.5)
        doc.text("Action Requise", 155, currentY + 5.5)

        doc.setTextColor(60, 60, 60)
        doc.setFont("helvetica", "normal")
        currentY += 13

        const rows = [
          { label: "Opérateurs certifiés (CACES)", value: `${certifiedOperatorsPercent}% certifiés`, act: certifiedOperatorsPercent < 100 ? "Planifier recyclage GALF" : "À surveiller" },
          { label: "Inspection journalière (VGP)", value: hasVgpRoutine ? "Oui" : "Non", act: hasVgpRoutine ? "Conforme" : "Déployer fiches VGP" },
          { label: "Limiteurs de moment surcharge", value: hasSurchargeAlarm ? "Oui" : "Non", act: hasSurchargeAlarm ? "Conforme" : "Équiper les cabines" },
          { label: "Supervision HSE dédiée", value: hasHseManager ? "Oui" : "Non", act: hasHseManager ? "Conforme" : "Désigner auditeur" },
          { label: "Réglementation EPI obligatoire", value: hasPpeMandatory ? "Oui" : "Non", act: hasPpeMandatory ? "Conforme" : "Contrôle strict EPI" },
          { label: "Danger lignes électriques", value: hasPowerlinesNear ? "Oui (Risque)" : "Non", act: hasPowerlinesNear ? "Balisage 3m requis" : "N/A" }
        ]

        rows.forEach((row) => {
          doc.text(row.label, 18, currentY)
          doc.text(row.value, 130, currentY)
          doc.text(row.act, 155, currentY)
          doc.setDrawColor(220, 220, 220)
          doc.line(15, currentY + 2.5, 195, currentY + 2.5)
          currentY += 8
        })

        // Recommendations B2B
        currentY += 8
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.setTextColor(30, 30, 30)
        doc.text("RECOMMANDATIONS PÉDAGOGIQUES ET PROPOSITION DE REMISE", 15, currentY)
        currentY += 6

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(80, 80, 80)
        
        let promoText = ""
        if (riskScore >= 60) {
          promoText = "GALF Formation Côte d'Ivoire vous propose une remise B2B immédiate de 20% pour l'achat d'un pack de formations sur site de mise en conformité réglementaire de vos opérateurs."
        } else if (riskScore >= 30) {
          promoText = "GALF Formation vous propose une réduction groupe de 10% pour la requalification CACES de vos opérateurs d'engins."
        } else {
          promoText = "Vos pratiques de sécurité sont excellentes. GALF propose un service d'audit de maintien annuel avec réduction pour renouvellement."
        }

        const splitPromo = doc.splitTextToSize(promoText, 180)
        doc.text(splitPromo, 15, currentY)
        currentY += (splitPromo.length * 4) + 12

        // Footer details
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        doc.setTextColor(30, 30, 30)
        doc.text("GALF Formation - Département Audit & Qualité B2B", 15, currentY)
        doc.setFont("helvetica", "italic")
        doc.setFontSize(7.5)
        doc.setTextColor(140, 140, 140)
        doc.text("Rapport généré électroniquement conforme aux prescriptions HSE R482/R483.", 15, currentY + 4)

        doc.save(`Diagnostic-Securite-GALF-${companyName ? companyName.replace(/\s+/g, '-') : 'Site'}.pdf`)
      } catch (err) {
        console.error("Failed to generate audit report:", err)
      }
      setIsGenerating(false)
    }, 1500)
  }

  const inputStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="DIAGNOSTIC DE SÉCURITÉ DE CHANTIER"
        subtitle="Identifiez vos vulnérabilités HSE. Réalisez un audit en ligne de la conformité de vos opérations d'engins lourds et obtenez un plan d'action immédiat."
        badge="Audit de conformité B2B"
      />

      <div className="container-galf max-w-4xl relative z-10 mt-12">
        
        {auditDone ? (
          /* AUDIT RESULTS DIAGNOSTIC SCREEN */
          <FadeIn className="animate-fadeIn space-y-8">
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-black/40 text-center relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />

              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/5 pb-6 text-left">
                <div>
                  <span className="text-[10px] font-black text-galf-yellow uppercase tracking-widest">RAPPORT D'AUDIT SÉCURITÉ</span>
                  <h2 className="text-2xl font-black text-white mt-1 font-mono">{auditId}</h2>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border tracking-wider ${riskTier.color}`}>
                    {riskTier.label}
                  </span>
                </div>
              </div>

              {/* Vulnerability Index Gauge */}
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-2xl mx-auto">
                <div className="relative w-40 h-40 mx-auto">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="16" fill="none" 
                      className={riskScore >= 60 ? 'stroke-red-500' : riskScore >= 30 ? 'stroke-orange-500' : 'stroke-green-500'} 
                      strokeWidth="3.5" 
                      strokeDasharray="100" 
                      strokeDashoffset={100 - riskScore}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white font-mono">{riskScore}%</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/40 font-sans mt-0.5">Vulnérabilité</span>
                  </div>
                </div>

                <div className="text-left space-y-3">
                  <h3 className="text-lg font-black text-white uppercase">SYNTHÈSE DE CONFORMITÉ</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-semibold">
                    {riskTier.desc}
                  </p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Ce score est calculé en croisant le taux de certification des opérateurs B2B, l'exécution des contrôles VGP quotidiens et les risques environnementaux.
                  </p>
                </div>
              </div>

              {/* Action plan summary */}
              <div className="space-y-4 border-t border-white/5 pt-8 text-left max-w-2xl mx-auto">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardCheck className="w-4.5 h-4.5 text-galf-yellow" /> Recommandations Immédiates
                </h4>
                
                <div className="grid gap-3">
                  {certifiedOperatorsPercent < 100 && (
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-white/80 leading-relaxed">
                      ❌ <strong>Déficit de certification CACES</strong> ({100 - certifiedOperatorsPercent}% d'opérateurs non certifiés). Risque juridique majeur en cas de sinistre. Planifiez une session de rattrapage.
                    </div>
                  )}
                  {hasVgpRoutine === false && (
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs text-white/80 leading-relaxed">
                      ⚠️ <strong>Absence de routine d'inspection VGP</strong>. Le manque de contrôle quotidien engendre une usure accélérée des machines (+30% coûts maintenance). Deploiement de fiches de contrôle obligatoire.
                    </div>
                  )}
                  {hasSurchargeAlarm === false && (
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs text-white/80 leading-relaxed">
                      ⚠️ <strong>Risque de rupture structurelle / Surcharge</strong>. Équiper en priorité les cabines de levage de limiteurs acoustiques de surcharge.
                    </div>
                  )}
                  {hasPowerlinesNear === true && (
                    <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-xs text-white/80 leading-relaxed">
                      ⚡ <strong>Présence de lignes électriques aériennes</strong>. Balisage obligatoire de la zone de sécurité (distance de sécurité de 3 mètres minimum).
                    </div>
                  )}
                  {riskScore < 30 && (
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-xs text-green-400 leading-relaxed text-center font-bold">
                      🎉 Félicitations ! Votre site respecte d'excellentes normes HSE. Continuez le suivi régulier.
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleDownloadPDFReport}
                  disabled={isGenerating}
                  className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-galf-yellow/10"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Imprimer le Diagnostic PDF
                </button>
                <button
                  onClick={handleReset}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Nouvel Audit de Chantier
                </button>
              </div>
            </div>
          </FadeIn>
        ) : (
          /* ACTIVE DIAGNOSTIC FORM SCREEN */
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />

            {/* Stepper info */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5 text-xs text-white/50 font-black uppercase tracking-wider">
              <span>Étape {step} sur 4</span>
              <span>{step === 1 ? 'Chantier & Entreprise' : step === 2 ? 'Personnel & Certification' : step === 3 ? 'Opérations & HSE' : 'Environnement & Risques'}</span>
            </div>

            {/* STEP 1: Site Metadata */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60">Nom de l'entreprise</label>
                    <input 
                      type="text" required placeholder="Ex: SMB Construction" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl p-4 focus:ring-1 focus:ring-galf-yellow focus:outline-none text-sm" style={inputStyle}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60">Localisation du chantier</label>
                    <input 
                      type="text" required placeholder="Ex: Yopougon Zone Industrielle" value={siteLocation} onChange={(e) => setSiteLocation(e.target.value)}
                      className="w-full rounded-xl p-4 focus:ring-1 focus:ring-galf-yellow focus:outline-none text-sm" style={inputStyle}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Secteur d'activité du site</label>
                  <select 
                    value={siteType} onChange={(e) => setSiteType(e.target.value)}
                    className="w-full rounded-xl p-4 focus:ring-1 focus:ring-galf-yellow focus:outline-none text-sm" style={inputStyle}
                  >
                    <option>BTP / Génie Civil</option>
                    <option>Exploitation Minière</option>
                    <option>Carrière à ciel ouvert</option>
                    <option>Logistique & Manutention Portuaire</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Operator & Certification count */}
            {step === 2 && (
              <div className="space-y-8">
                
                {/* Fleet Size Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase text-white/60">
                    <span>Nombre d'engins lourds actifs</span>
                    <span className="text-galf-yellow font-black">{fleetSize} machines</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" value={fleetSize} onChange={(e) => setFleetSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                  <p className="text-[10px] text-white/40">Pelles, grues, bulldozers, chargeuses ou chariots élévateurs.</p>
                </div>

                {/* Certified operator percentage */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase text-white/60">
                    <span>Proportion d'opérateurs certifiés (CACES)</span>
                    <span className="text-galf-yellow font-black">{certifiedOperatorsPercent}% des effectifs</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="10" value={certifiedOperatorsPercent} onChange={(e) => setCertifiedOperatorsPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                  <p className="text-[10px] text-white/40">Combien d'opérateurs possèdent des habilitations ou des brevets d'État en cours de validité.</p>
                </div>

              </div>
            )}

            {/* STEP 3: HSE and VGP routines */}
            {step === 3 && (
              <div className="space-y-6">
                
                {/* VGP Routine Check */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold text-white block">Routine d'inspection visuelle (VGP)</span>
                    <span className="text-[10px] text-white/40">Les opérateurs effectuent-ils un walk-around de sécurité chaque matin ?</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setHasVgpRoutine(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasVgpRoutine === true ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white/60'}`}
                    >
                      Oui
                    </button>
                    <button 
                      onClick={() => setHasVgpRoutine(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasVgpRoutine === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-white/60'}`}
                    >
                      Non
                    </button>
                  </div>
                </div>

                {/* Surcharge Alarm Check */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold text-white block">Limiteurs de moment surcharge</span>
                    <span className="text-[10px] text-white/40">Les engins de levage (grues) sont-ils équipés d'alarmes de charge fonctionnelles ?</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setHasSurchargeAlarm(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasSurchargeAlarm === true ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white/60'}`}
                    >
                      Oui
                    </button>
                    <button 
                      onClick={() => setHasSurchargeAlarm(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasSurchargeAlarm === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-white/60'}`}
                    >
                      Non
                    </button>
                  </div>
                </div>

                {/* Mandatory PPE Check */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold text-white block">Réglementation EPI stricte</span>
                    <span className="text-[10px] text-white/40">Le port du casque, gilet réfléchissant et bottes renforcées est-il contrôlé ?</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setHasPpeMandatory(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasPpeMandatory === true ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white/60'}`}
                    >
                      Oui
                    </button>
                    <button 
                      onClick={() => setHasPpeMandatory(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasPpeMandatory === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-white/60'}`}
                    >
                      Non
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 4: Site environmental threats */}
            {step === 4 && (
              <div className="space-y-6">
                
                {/* HSE Coordinator Check */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold text-white block">Superviseur ou Auditeur HSE dédié</span>
                    <span className="text-[10px] text-white/40">Un ingénieur sécurité contrôle-t-il quotidiennement les manœuvres ?</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setHasHseManager(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasHseManager === true ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white/60'}`}
                    >
                      Oui
                    </button>
                    <button 
                      onClick={() => setHasHseManager(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasHseManager === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-white/60'}`}
                    >
                      Non
                    </button>
                  </div>
                </div>

                {/* Power lines risk Check */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold text-white block">Proximité de lignes électriques aériennes</span>
                    <span className="text-[10px] text-white/40">Des câbles moyenne/haute tension survolent-ils les zones d'évolution ?</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setHasPowerlinesNear(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasPowerlinesNear === true ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-white/60'}`}
                    >
                      Oui
                    </button>
                    <button 
                      onClick={() => setHasPowerlinesNear(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${hasPowerlinesNear === false ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white/60'}`}
                    >
                      Non
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Stepper buttons */}
            <div className="flex justify-between items-center border-t border-white/5 pt-8 mt-8">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Précédent
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={step === 1 && (!companyName.trim() || !siteLocation.trim())}
                  className="bg-galf-yellow text-galf-carbon px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                >
                  Suivant <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCalculateAudit}
                  disabled={hasVgpRoutine === null || hasSurchargeAlarm === null || hasHseManager === null || hasPowerlinesNear === null || hasPpeMandatory === null}
                  className="bg-green-500 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                >
                  Calculer le Diagnostic <Calculator className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
