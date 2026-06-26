"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShieldCheck, CheckCircle2, ClipboardList, Info, 
  RefreshCw, HardHat, ShieldAlert, ArrowRight, Volume2, VolumeX, Eye
} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { motion, AnimatePresence } from 'framer-motion'

// Inspection Hotspots data with randomized scenarios (either conforming or defective)
const HOTSPOTS_BASE = [
  {
    id: "engine",
    name: "Jauge d'huile & Compartiment Moteur",
    x: "65%",
    y: "35%",
    desc: "Vérifier le niveau d'huile moteur à froid et l'absence de fuites.",
    scenarios: [
      {
        text: "Le niveau d'huile est précisément entre les repères MIN et MAX. Aucune trace de suintement sur le bloc moteur.",
        correctStatus: "conforme",
        detail: "Niveau d'huile OK. Moteur propre."
      },
      {
        text: "La jauge est sèche et un dépôt de liquide noir est visible sous le carter d'huile.",
        correctStatus: "defectueux",
        detail: "Niveau d'huile CRITIQUE + Fuite active sous le carter !"
      }
    ]
  },
  {
    id: "hydraulics",
    name: "Flexibles & Vérins Hydrauliques",
    x: "48%",
    y: "28%",
    desc: "Inspecter les flexibles haute pression à la recherche de fissures, pincements ou suintements.",
    scenarios: [
      {
        text: "Un léger suintement de liquide hydraulique perle au niveau du raccord principal du vérin de flèche.",
        correctStatus: "defectueux",
        detail: "Fuite hydraulique sous pression - Risque de rupture de flexible !"
      },
      {
        text: "Tous les flexibles sont souples, secs et correctement guidés dans leurs colliers de serrage.",
        correctStatus: "conforme",
        detail: "Flexibles en excellent état."
      }
    ]
  },
  {
    id: "tracks",
    name: "Chenilles & Train de Roulement",
    x: "35%",
    y: "75%",
    desc: "Vérifier la tension de la chenille, l'usure des tuiles et l'absence de cailloux coincés.",
    scenarios: [
      {
        text: "La chenille gauche présente une flèche de 85 mm (limite constructeur : 50 mm). Deux boulons de tuiles sont manquants.",
        correctStatus: "defectueux",
        detail: "Chenille trop détendue + Tuiles instables (Risque de déchenillage) !"
      },
      {
        text: "Tension des chenilles conforme (flèche de 40 mm). Galets de roulement lubrifiés, boulons complets.",
        correctStatus: "conforme",
        detail: "Chenilles opérationnelles."
      }
    ]
  },
  {
    id: "bucket",
    name: "Dents & Axes du Godet",
    x: "82%",
    y: "78%",
    desc: "Inspecter l'état d'usure des dents, la présence des goupilles d'arrêt des axes et les soudures.",
    scenarios: [
      {
        text: "Les dents du godet de terrassement sont présentes. Les goupilles de verrouillage rapide sont toutes en place.",
        correctStatus: "conforme",
        detail: "Dents et axes sécurisés."
      },
      {
        text: "Une goupille d'axe de biellette de godet a été remplacée par un simple fil de fer rouillé. Une dent est fissurée.",
        correctStatus: "defectueux",
        detail: "Goupille non réglementaire + Risque de casse de dent !"
      }
    ]
  },
  {
    id: "visibility",
    name: "Vitres, Rétroviseurs & Cabine",
    x: "28%",
    y: "40%",
    desc: "Contrôler la propreté du pare-brise, l'ajustement des rétroviseurs et le fonctionnement de l'essuie-glace.",
    scenarios: [
      {
        text: "Le pare-brise avant présente un impact circulaire de 5 cm pile dans le champ de vision direct de l'opérateur.",
        correctStatus: "defectueux",
        detail: "Impact pare-brise majeure - Gêne la visibilité de sécurité !"
      },
      {
        text: "Vitres propres, rétroviseurs intacts et réglés, balai d'essuie-glace fonctionnel.",
        correctStatus: "conforme",
        detail: "Excellente visibilité."
      }
    ]
  },
  {
    id: "extinguisher",
    name: "Extincteur & Organes de Sécurité",
    x: "15%",
    y: "55%",
    desc: "Vérifier la date de validité de l'extincteur de cabine, le klaxon et la ceinture de sécurité.",
    scenarios: [
      {
        text: "Le manomètre de l'extincteur à poudre est dans la zone verte. L'étiquette indique une inspection valide.",
        correctStatus: "conforme",
        detail: "Organes de sécurité opérationnels."
      },
      {
        text: "L'aiguille du manomètre de l'extincteur est dans la zone rouge (vide) et l'étiquette de contrôle a expiré depuis 6 mois.",
        correctStatus: "defectueux",
        detail: "Extincteur hors service - Non-conformité réglementaire grave !"
      }
    ]
  }
]

export default function InspectionVirtuellePage() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [scenarios, setScenarios] = useState<any[]>([])
  const [inspectedState, setInspectedState] = useState<Record<string, { status: 'conforme' | 'defectueux'; correct: boolean }>>({})
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [operatorName, setOperatorName] = useState("")
  const [vgpId, setVgpId] = useState("")

  // Generate randomized scenarios on mount
  useEffect(() => {
    const randomized = HOTSPOTS_BASE.map(h => {
      const idx = Math.random() > 0.5 ? 0 : 1
      return {
        ...h,
        scenarioText: h.scenarios[idx].text,
        correctStatus: h.scenarios[idx].correctStatus,
        detail: h.scenarios[idx].detail
      }
    })
    setScenarios(randomized)
    setVgpId(`VGP-GALF-${Math.floor(100000 + Math.random() * 900000)}`)
  }, [])

  // Web Audio Synth sounds
  const playSound = (type: 'click' | 'conform' | 'defect' | 'success' | 'hydraulic') => {
    if (!soundEnabled) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const gain = ctx.createGain()
      gain.connect(ctx.destination)

      if (type === 'click') {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, now)
        gain.gain.setValueAtTime(0.01, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.05)
      } else if (type === 'conform') {
        const osc = ctx.createOscillator()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.setValueAtTime(554.37, now + 0.08)
        gain.gain.setValueAtTime(0.03, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.2)
      } else if (type === 'defect') {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.setValueAtTime(180, now + 0.1)
        gain.gain.setValueAtTime(0.03, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50]
        notes.forEach((f, i) => {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(f, now + i * 0.08)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.02, now + i * 0.08)
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35)
          osc.connect(g)
          g.connect(ctx.destination)
          osc.start(now + i * 0.08)
          osc.stop(now + i * 0.08 + 0.35)
        })
      } else if (type === 'hydraulic') {
        // Hiss sound
        const bufferSize = ctx.sampleRate * 0.5
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        
        const filter = ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(1000, now)
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.5)

        const hissGain = ctx.createGain()
        hissGain.gain.setValueAtTime(0.02, now)
        hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

        noise.connect(filter)
        filter.connect(hissGain)
        hissGain.connect(ctx.destination)
        noise.start(now)
      }
      setTimeout(() => ctx.close(), 800)
    } catch {}
  }

  const handleInspect = (hotspotId: string, status: 'conforme' | 'defectueux') => {
    const sc = scenarios.find(x => x.id === hotspotId)
    if (!sc) return

    const correct = sc.correctStatus === status
    setInspectedState(prev => ({
      ...prev,
      [hotspotId]: { status, correct }
    }))
    setActiveHotspot(null)
    playSound(status === 'conforme' ? 'conform' : 'defect')
  }

  const allInspected = scenarios.length > 0 && Object.keys(inspectedState).length === scenarios.length

  const handleSubmitReport = () => {
    if (!allInspected) return
    setReportSubmitted(true)
    playSound('success')
  }

  const handleReset = () => {
    const randomized = HOTSPOTS_BASE.map(h => {
      const idx = Math.random() > 0.5 ? 0 : 1
      return {
        ...h,
        scenarioText: h.scenarios[idx].text,
        correctStatus: h.scenarios[idx].correctStatus,
        detail: h.scenarios[idx].detail
      }
    })
    setScenarios(randomized)
    setInspectedState({})
    setReportSubmitted(false)
    setActiveHotspot(null)
    setVgpId(`VGP-GALF-${Math.floor(100000 + Math.random() * 900000)}`)
    playSound('hydraulic')
  }

  const correctCount = Object.values(inspectedState).filter(x => x.correct).length
  const scorePercent = scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0

  return (
    <div className="min-h-screen pt-28 pb-24 text-left relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <div className="absolute inset-0 bg-diagonal opacity-5 pointer-events-none" />

      <div className="container-galf max-w-6xl relative z-10">
        
        {/* TOP NAV BAR */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <Link href="/mediatheque" className="text-xs font-bold text-galf-yellow uppercase tracking-widest flex items-center gap-1 hover:underline">
            ← Médiathèque
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-all flex items-center gap-2 text-xs"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-galf-yellow" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline font-bold uppercase tracking-wider">{soundEnabled ? "Audio On" : "Muet"}</span>
            </button>
          </div>
        </div>

        {/* HERO TITLE */}
        {!reportSubmitted && (
          <div className="text-center space-y-4 mb-12">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              <ClipboardList className="w-3.5 h-3.5" /> Module Pratique de Chantier
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              INSPECTION VISUELLE DE <span className="text-galf-yellow">SÉCURITÉ (VGP)</span>
            </h1>
            <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed mt-2">
              Avant de monter en cabine, l'opérateur doit inspecter l'engin (Walk-around). Cliquez sur les 6 points chauds de la pelle hydraulique, lisez le constat visuel, puis classez l'organe comme <strong>Conforme</strong> ou <strong>Défectueux</strong>.
            </p>
          </div>
        )}

        {reportSubmitted ? (
          /* VGP SUMMARY REPORT SCREEN */
          <FadeIn className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-black/40 text-center relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
              
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/5 pb-6">
                <div className="text-left">
                  <span className="text-[10px] font-black text-galf-yellow uppercase tracking-widest">RAPPORT D'INSPECTION VGP</span>
                  <h2 className="text-2xl font-black text-white mt-1 font-mono">{vgpId}</h2>
                </div>
                <div className="text-right mt-3 sm:mt-0">
                  <span className="text-[10px] font-black text-white/40 uppercase block">Opérateur de contrôle</span>
                  <input 
                    type="text" 
                    placeholder="Saisir votre nom"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="bg-transparent border-b border-white/20 text-sm font-bold text-white text-right focus:border-galf-yellow outline-none uppercase font-sans placeholder-white/20 py-1"
                  />
                </div>
              </div>

              {/* Large Score Indicator */}
              <div className="py-6">
                <div className="text-5xl md:text-7xl font-black text-galf-yellow font-mono">{correctCount} / {scenarios.length}</div>
                <p className="text-xs uppercase tracking-widest text-white/40 mt-2">Points d'inspection diagnostiqués corrects</p>
              </div>

              {/* Verification Stamp Banner */}
              {scorePercent >= 80 ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 py-4 px-6 rounded-2xl max-w-md mx-auto text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" /> RAPPORT ACCÈS CHANTIER VALIDE
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-4 px-6 rounded-2xl max-w-md mx-auto text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" /> DANGER : INSPECTION INCOMPLÈTE OU ERRONÉE
                </div>
              )}

              {/* Checks Detailed Breakdown List */}
              <div className="space-y-3 text-left max-w-xl mx-auto border-t border-white/5 pt-8">
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-galf-yellow" /> Détail du diagnostic par organe
                </h4>
                {scenarios.map((sc) => {
                  const userChoice = inspectedState[sc.id]
                  return (
                    <div key={sc.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">{sc.name}</span>
                        <span className="text-[10px] text-white/50 block mt-0.5">{sc.detail}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                          userChoice.status === 'conforme' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {userChoice.status}
                        </span>
                        <span>
                          {userChoice.correct ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                          )}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Imprimer le rapport VGP
                </button>
                <button
                  onClick={handleReset}
                  className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-galf-yellow/10"
                >
                  <RefreshCw className="w-4 h-4" /> Recommencer l'inspection
                </button>
              </div>
            </div>
          </FadeIn>
        ) : (
          /* ACTIVE INTERACTIVE WORKSPACE SCREEN */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. INTERACTIVE ENGING VECTOR PANEL (HOTSPOTS MAP) */}
            <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-white/5 bg-black/30 relative flex flex-col items-center justify-center overflow-hidden">
              <span className="absolute top-4 left-4 text-[10px] font-black uppercase text-white/30 tracking-widest flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Plan 2D d'inspection
              </span>
              
              {/* THE SVG EXCAVATOR DRAWING */}
              <div className="relative w-full aspect-[1.8/1] mt-6 select-none bg-zinc-950/40 rounded-2xl border border-white/5 p-4 flex items-center justify-center">
                <svg viewBox="0 0 800 450" className="w-full h-full text-white/10 fill-none stroke-current" strokeWidth="1.5">
                  <g className="opacity-70 stroke-white/20">
                    {/* Cabin */}
                    <path d="M220 180 L300 180 L290 280 L200 280 Z" />
                    <line x1="220" y1="180" x2="200" y2="280" />
                    <line x1="250" y1="180" x2="245" y2="280" />
                    
                    {/* Chassis / Under Carriage */}
                    <rect x="120" y="320" width="340" height="60" rx="30" />
                    <circle cx="160" cy="350" r="22" />
                    <circle cx="230" cy="350" r="22" />
                    <circle cx="300" cy="350" r="22" />
                    <circle cx="370" cy="350" r="22" />
                    <circle cx="420" cy="350" r="22" />
                    <path d="M 120 350 L 460 350" strokeDasharray="5,5" />
                    
                    {/* Engine Compartment */}
                    <path d="M120 230 L200 230 L200 280 L120 280 Z" />
                    {/* Counter Weight */}
                    <path d="M100 240 L120 230 L120 310 L95 300 Z" fill="rgba(255,176,0,0.1)" />
                    
                    {/* Main Boom Arm */}
                    <path d="M290 260 L420 150 L580 180" strokeWidth="20" strokeLinecap="round" />
                    {/* Hydraulic cylinder for Boom */}
                    <line x1="310" y1="280" x2="410" y2="170" strokeWidth="6" />
                    
                    {/* Stick Arm */}
                    <path d="M580 180 L620 310" strokeWidth="12" strokeLinecap="round" />
                    {/* Hydraulic cylinder for Stick */}
                    <line x1="430" y1="150" x2="560" y2="185" strokeWidth="4" />

                    {/* Bucket */}
                    <path d="M620 310 L680 350 L630 380 L610 325 Z" fill="rgba(255,176,0,0.05)" strokeWidth="3" />
                    {/* Teeth */}
                    <line x1="680" y1="350" x2="695" y2="355" strokeWidth="3" />
                    <line x1="675" y1="355" x2="690" y2="360" strokeWidth="3" />
                    <line x1="670" y1="360" x2="685" y2="365" strokeWidth="3" />
                  </g>
                </svg>

                {/* THE HOTSPOTS MARKERS */}
                {scenarios.map((sc) => {
                  const isChecked = inspectedState[sc.id] !== undefined
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setActiveHotspot(sc.id)
                        playSound('click')
                      }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 flex items-center justify-center"
                      style={{ left: sc.x, top: sc.y }}
                      title={sc.name}
                    >
                      {isChecked ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/80 flex items-center justify-center shadow-lg border border-green-300 animate-scaleIn">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="relative flex h-8 w-8 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-galf-yellow/40 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-galf-yellow text-galf-carbon items-center justify-center text-[10px] font-black shadow-md border border-white/20">
                            !
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. CONTROL DETAILS PANEL */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* STATUS INDICATOR CARD */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <ClipboardList className="w-4.5 h-4.5 text-galf-yellow" /> État de l'inspection VGP
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-white/40 font-bold uppercase block text-[9px] tracking-wider">Avancement</span>
                    <p className="text-base font-black text-white font-mono">
                      {Object.keys(inspectedState).length} / {scenarios.length}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-white/40 font-bold uppercase block text-[9px] tracking-wider">Diagnostic</span>
                    <p className="text-base font-black text-galf-yellow font-mono">
                      {allInspected ? 'Complété' : 'En cours'}
                    </p>
                  </div>
                </div>

                {allInspected && (
                  <button
                    onClick={handleSubmitReport}
                    className="w-full mt-6 bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-galf-yellow/10 animate-bounce"
                  >
                    Soumettre le Rapport VGP <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>

              {/* MAIN POPUP WORKSPACE PANEL (SLOT FOR CURRENT WORK) */}
              <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-[radial-gradient(ellipse_at_top,rgba(255,176,0,0.03),transparent)] min-h-[250px] flex flex-col justify-between relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeHotspot ? (
                    (() => {
                      const sc = scenarios.find(x => x.id === activeHotspot)
                      if (!sc) return null
                      return (
                        <motion.div
                          key={sc.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <span className="text-[10px] font-black text-galf-yellow uppercase tracking-widest">EXAMEN DE L'ORGANE</span>
                            <h3 className="text-lg font-black text-white leading-tight uppercase">{sc.name}</h3>
                            <p className="text-xs text-white/50">{sc.desc}</p>
                            
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80 font-medium leading-relaxed italic">
                              "{sc.scenarioText}"
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                              onClick={() => handleInspect(sc.id, 'conforme')}
                              className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Conforme
                            </button>
                            <button
                              onClick={() => handleInspect(sc.id, 'defectueux')}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Défectueux
                            </button>
                          </div>
                        </motion.div>
                      )
                    })()
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4"
                    >
                      <HardHat className="w-12 h-12 text-white/20" />
                      <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                        Cliquez sur les marqueurs clignotants jaunes sur le schéma 2D de la pelle pour lancer le diagnostic technique de chaque élément.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
