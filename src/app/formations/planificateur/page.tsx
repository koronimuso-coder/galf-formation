"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Download, 
  MapPin, RefreshCw, 
  Layers, Clock, ShieldCheck, DollarSign
} from 'lucide-react'


import { jsPDF } from 'jspdf'

interface MachineInfo {
  slug: string
  name: string
  basePrice: number // base registration fee
  hourOnlineRate: number // price per hour online
  hourPracticalRate: number // price per hour practical
  baseHours: {
    debutant: number
    intermediaire: number
    recyclage: number
  }
}

const MACHINES_DB: Record<string, MachineInfo> = {
  pelle: {
    slug: "pelle",
    name: "Pelle Hydraulique sur chenilles",
    basePrice: 50000,
    hourOnlineRate: 5000,
    hourPracticalRate: 15000,
    baseHours: { debutant: 60, intermediaire: 40, recyclage: 12 }
  },
  grue: {
    slug: "grue",
    name: "Grue à Tour stationnaire",
    basePrice: 65000,
    hourOnlineRate: 6000,
    hourPracticalRate: 18000,
    baseHours: { debutant: 80, intermediaire: 50, recyclage: 15 }
  },
  bulldozer: {
    slug: "bulldozer",
    name: "Bulldozer Caterpillar D6",
    basePrice: 45000,
    hourOnlineRate: 4500,
    hourPracticalRate: 13500,
    baseHours: { debutant: 50, intermediaire: 30, recyclage: 10 }
  }
}

const COHORTS = [
  { id: 1, date: "Lundi 06 Juillet 2026", available: 8 },
  { id: 2, date: "Lundi 20 Juillet 2026", available: 12 },
  { id: 3, date: "Lundi 03 Août 2026", available: 15 },
  { id: 4, date: "Lundi 17 Août 2026", available: 10 }
]

function PlanificateurContent() {
  const searchParams = useSearchParams()
  const enginParam = searchParams.get('engin')
  
  const [selectedMachine, setSelectedMachine] = useState<'pelle' | 'grue' | 'bulldozer'>('pelle')

  useEffect(() => {
    if (enginParam === 'pelle' || enginParam === 'grue' || enginParam === 'bulldozer') {
      setSelectedMachine(enginParam)
    }
  }, [enginParam])
  const [selectedLevel, setSelectedLevel] = useState<'debutant' | 'intermediaire' | 'recyclage'>('debutant')
  const [onlineRatio, setOnlineRatio] = useState<number>(30) // percentage of e-learning
  const [selectedCenter, setSelectedCenter] = useState<string>("Yopougon Chantier-École, Abidjan")
  const [selectedCohortId, setSelectedCohortId] = useState<number>(1)
  
  // Registration state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [registered, setRegistered] = useState(false)

  const activeMachine = MACHINES_DB[selectedMachine]
  const totalHours = activeMachine.baseHours[selectedLevel]
  
  const onlineHours = Math.round(totalHours * (onlineRatio / 100))
  const practicalHours = totalHours - onlineHours

  const costOnline = onlineHours * activeMachine.hourOnlineRate
  const costPractical = practicalHours * activeMachine.hourPracticalRate
  const totalCost = activeMachine.basePrice + costOnline + costPractical

  const handleRatioChange = (val: number) => {
    setOnlineRatio(val)
    triggerAudioFeedback(400 + val * 4, 0.05)
  }

  const handleCohortSelect = (id: number) => {
    setSelectedCohortId(id)
    triggerAudioFeedback(600, 0.08)
  }

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) return

    setIsGenerating(true)
    setTimeout(() => {
      try {
        const doc = new jsPDF()

        // 1. Header Banner
        doc.setFillColor(26, 26, 29)
        doc.rect(0, 0, 210, 48, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.setTextColor(255, 255, 255)
        doc.text("DEVIS PRO-FORMA DE FORMATION", 15, 20)

        doc.setFontSize(9)
        doc.setTextColor(255, 176, 0)
        doc.text("GALF FORMATION CÔTE D'IVOIRE — EXCELLENCE ET SÉCURITÉ INDUSTRIELLE", 15, 28)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(180, 180, 180)
        doc.text(`Identifiant devis : GALF-Q-${Math.floor(100000 + Math.random() * 900000)}  |  Date : ${new Date().toLocaleDateString('fr-FR')}`, 15, 36)
        doc.text("Agréé FDFP - Éligible au cofinancement entreprise.", 15, 41)

        // Safety line
        doc.setFillColor(255, 176, 0)
        doc.rect(0, 45, 210, 3, "F")

        // 2. Client & Cohort Info
        let currentY = 62
        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.setTextColor(30, 30, 30)
        doc.text("INFORMATIONS BÉNÉFICIAIRE :", 15, currentY)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor(70, 70, 70)
        doc.text(`Nom complet : ${name.toUpperCase()}`, 15, currentY + 5.5)
        doc.text(`Téléphone : ${phone}  |  Email : ${email}`, 15, currentY + 11)
        if (company) {
          doc.text(`Société : ${company.toUpperCase()}`, 15, currentY + 16.5)
        }

        // Center / Cohort details on right
        doc.setFont("helvetica", "bold")
        doc.text("CENTRE ET PLANIFICATION :", 115, currentY)
        doc.setFont("helvetica", "normal")
        doc.text(`Site : ${selectedCenter}`, 115, currentY + 5.5)
        doc.text(`Date de rentrée : ${COHORTS.find(c => c.id === selectedCohortId)?.date}`, 115, currentY + 11)

        // 3. Devis Details Table
        currentY += 28
        doc.setFillColor(240, 240, 242)
        doc.rect(15, currentY, 180, 8, "F")
        
        doc.setFont("helvetica", "bold")
        doc.text("DESCRIPTION DU PARCOURS", 18, currentY + 5.5)
        doc.text("VOLUME HORAIRE", 110, currentY + 5.5)
        doc.text("TARIF HORAIRE", 145, currentY + 5.5)
        doc.text("PRIX TOTAL", 175, currentY + 5.5)

        // Items Row
        currentY += 8
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        
        // Line 1: Registration fee
        doc.line(15, currentY, 195, currentY)
        doc.text(`Frais administratifs & Assurance (${activeMachine.name})`, 18, currentY + 5)
        doc.text("-", 110, currentY + 5)
        doc.text("-", 145, currentY + 5)
        doc.text(`${activeMachine.basePrice.toLocaleString('fr-FR')} FCFA`, 175, currentY + 5)

        // Line 2: Online theory
        currentY += 7.5
        doc.line(15, currentY, 195, currentY)
        doc.text(`Théorie e-learning (Réglementation, Risques HSE)`, 18, currentY + 5)
        doc.text(`${onlineHours} heures`, 110, currentY + 5)
        doc.text(`${activeMachine.hourOnlineRate.toLocaleString('fr-FR')} FCFA/h`, 145, currentY + 5)
        doc.text(`${costOnline.toLocaleString('fr-FR')} FCFA`, 175, currentY + 5)

        // Line 3: Practical driving
        currentY += 7.5
        doc.line(15, currentY, 195, currentY)
        doc.text(`Conduite pratique & Manœuvre sur chantier-école`, 18, currentY + 5)
        doc.text(`${practicalHours} heures`, 110, currentY + 5)
        doc.text(`${activeMachine.hourPracticalRate.toLocaleString('fr-FR')} FCFA/h`, 145, currentY + 5)
        doc.text(`${costPractical.toLocaleString('fr-FR')} FCFA`, 175, currentY + 5)

        // Totals Row
        currentY += 7.5
        doc.setLineWidth(0.5)
        doc.setDrawColor(26, 26, 29)
        doc.line(15, currentY, 195, currentY)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.text("TOTAL DEVIS HORS TAXE (FCFA)", 18, currentY + 6)
        doc.text(`${totalHours} heures`, 110, currentY + 6)
        doc.text(`${totalCost.toLocaleString('fr-FR')} FCFA`, 175, currentY + 6)

        // 4. Stamp and validation
        currentY += 24
        doc.setFillColor(245, 245, 245)
        doc.rect(15, currentY, 180, 22, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(8.5)
        doc.setTextColor(26, 26, 29)
        doc.text("MODALITÉS DE PAIEMENT & CONDITIONS :", 20, currentY + 6)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(7.5)
        doc.setTextColor(80, 80, 80)
        doc.text("- Acompte de 40% requis à l'inscription pour réserver le planning pratique.", 20, currentY + 12)
        doc.text("- Solde échelonnable sur la durée de la formation théorique.", 20, currentY + 17)

        // Save PDF
        doc.save(`Devis-GALF-${name.replace(/\s+/g, '-')}.pdf`)
        setRegistered(true)
      } catch (err) {
        console.error(err)
      }
      setIsGenerating(false)
    }, 1500)
  }

  const fieldStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden text-left" style={{ background: 'var(--galf-bg)' }}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal opacity-5" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-galf-yellow/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-galf pt-24 relative z-10">
        
        <Link 
          href="/formations"
          className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-xs mb-4 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux formations
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              Devis & Calendrier sur mesure
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mt-3" style={{ color: 'var(--galf-text)' }}>
              PLANIFICATEUR <span className="text-galf-yellow">DE SESSION</span>
            </h1>
            <p className="text-sm max-w-xl mt-2 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
              Ajustez vos heures de théorie en ligne et pratique terrain pour calculer votre devis de formation aux engins lourds.
            </p>
          </div>
        </div>

        {/* Form and Simulator Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: SESSIONS CONFIGURATOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Machine & Level selector */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-galf-yellow" /> Choix du module d'apprentissage
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'pelle', label: 'Pelle Hydraulique' },
                  { id: 'grue', label: 'Grue à Tour' },
                  { id: 'bulldozer', label: 'Bulldozer D6' }
                ].map(mach => (
                  <button
                    key={mach.id}
                    onClick={() => {
                      setSelectedMachine(mach.id as any)
                      triggerAudioFeedback(580, 0.05)
                    }}
                    className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                      selectedMachine === mach.id 
                        ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                        : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    {mach.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'debutant', label: 'Débutant', desc: 'Formation complète' },
                  { id: 'intermediaire', label: 'Intermédiaire', desc: 'Perfectionnement' },
                  { id: 'recyclage', label: 'Recyclage', desc: 'Mise à niveau' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setSelectedLevel(lvl.id as any)
                      triggerAudioFeedback(640, 0.05)
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedLevel === lvl.id 
                        ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                        : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider">{lvl.label}</div>
                    <div className="text-[8px] opacity-60 mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hybrid hours distribution slide control */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-galf-yellow" /> Répartition Théorie / Pratique
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>En ligne (Théorie) : {onlineRatio}%</span>
                  <span>Chantier-École (Pratique) : {100 - onlineRatio}%</span>
                </div>
                
                <input 
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={onlineRatio}
                  onChange={(e) => handleRatioChange(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Théorie E-Learning</div>
                    <div className="text-xl font-black text-white mt-1.5">{onlineHours} Heures</div>
                    <p className="text-[9px] text-white/50 mt-1 leading-relaxed">Réglementation, abaques, sécurité sur tableau de bord interactif.</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Pratique Chantier</div>
                    <div className="text-xl font-black text-galf-yellow mt-1.5">{practicalHours} Heures</div>
                    <p className="text-[9px] text-white/50 mt-1 leading-relaxed">Conduite réelle sous la supervision de nos formateurs certifiés.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Centre de formation et date de rentrée */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-galf-yellow" /> Centre pratique & Calendrier
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Yopougon Chantier-École, Abidjan",
                  "San Pedro Port Extension Campus"
                ].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => {
                      setSelectedCenter(cnt)
                      triggerAudioFeedback(600, 0.05)
                    }}
                    className={`p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer text-left ${
                      selectedCenter === cnt 
                        ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                        : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-galf-yellow mb-2" />
                    {cnt}
                  </button>
                ))}
              </div>

              {/* Cohorts grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider block">Sélectionnez votre cohorte (Rentrée théorique)</span>
                <div className="grid grid-cols-2 gap-3">
                  {COHORTS.map(c => {
                    const isSelected = c.id === selectedCohortId
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleCohortSelect(c.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                          isSelected 
                            ? 'bg-white/5 border-white/20 text-white' 
                            : 'bg-transparent border-white/5 text-white/40'
                        }`}
                      >
                        <div className="text-xs">
                          <div className="font-bold">{c.date}</div>
                          <div className="text-[9px] opacity-60 mt-0.5">{c.available} places dispos</div>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-galf-yellow' : 'border-white/20'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-galf-yellow" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: COST SUMMARY & ENROLLMENT FORM (5 COLS) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-galf-yellow" /> Estimation Financière du Devis
              </h3>

              {/* Price Details Stack */}
              <div className="space-y-3.5 text-xs text-white/80 font-medium">
                <div className="flex justify-between">
                  <span className="opacity-60">Frais administratifs de base :</span>
                  <span className="font-bold font-mono">{activeMachine.basePrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Théorie e-learning ({onlineHours}h) :</span>
                  <span className="font-bold font-mono">{costOnline.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Pratique Chantier ({practicalHours}h) :</span>
                  <span className="font-bold font-mono text-galf-yellow">{costPractical.toLocaleString('fr-FR')} FCFA</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm font-black text-white">
                  <span>TOTAL ESTIMÉ H.T.</span>
                  <span className="text-xl text-galf-yellow font-mono">{totalCost.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Form trigger submission */}
              <form onSubmit={handleGenerateQuote} className="space-y-4 pt-4 border-t border-white/5">
                <div className="text-[10px] font-black uppercase text-white/40 tracking-wider">Demander mon inscription & devis officiel</div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/40">Nom Complet</label>
                  <input 
                    type="text" placeholder="Ex: Koffi Kouassi" required
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-white/40">Téléphone</label>
                    <input 
                      type="text" placeholder="+225 07..." required
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-white/40">Email</label>
                    <input 
                      type="email" placeholder="email@adresse.com" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/40">Entreprise / Parrain (Facultatif)</label>
                  <input 
                    type="text" placeholder="Ex: SOGEA-SATOM CI"
                    value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full mt-4 bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Devis en cours de création...
                    </>
                  ) : (
                    <>
                      <Download className="w-4.5 h-4.5" /> Télécharger mon Devis PDF
                    </>
                  )}
                </button>
              </form>

              {registered && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-start gap-3 text-green-200">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">Demande de devis enregistrée !</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      Votre devis PDF a été généré. Nos conseillers vous contacteront sous 24h ouvrées pour confirmer les modalités de co-financement FDFP.
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  )

  function triggerAudioFeedback(freq = 660, duration = 0.08) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
      setTimeout(() => ctx.close(), 200)
    } catch{}
  }
}

export default function PlanificateurPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-galf-yellow mb-2" />
          <p className="text-xs uppercase tracking-widest font-black">Chargement du planificateur...</p>
        </div>
      </div>
    }>
      <PlanificateurContent />
    </Suspense>
  )
}
