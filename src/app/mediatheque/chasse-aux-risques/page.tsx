"use client"
import { useState } from 'react'
import Link from 'next/link'
import { 
  ShieldAlert, Download, RefreshCw, 
  ArrowLeft, HelpCircle, Trophy, Eye, CheckCircle
} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

import { jsPDF } from 'jspdf'

interface Hazard {
  id: string
  title: string
  desc: string
  rule: string
  corrective: string
  x: number // center x on SVG
  y: number // center y on SVG
  r: number // radius of hotspot
}

const HAZARDS: Hazard[] = [
  {
    id: "h1",
    title: "Piéton sous charge suspendue",
    desc: "Un ouvrier traverse le chantier directement sous le container de ciment soulevé par la grue à tour.",
    rule: "R482 / Référentiel HSE Levage : Interdiction stricte de circuler ou de stationner sous une charge suspendue. Risque de rupture de câble ou de glissement de charge.",
    corrective: "Délimiter une zone d'exclusion au sol avec des barrières de sécurité et affecter un signaleur au guidage.",
    x: 175,
    y: 80,
    r: 16
  },
  {
    id: "h2",
    title: "Proximité de ligne haute tension",
    desc: "Le bras articulé de la pelle hydraulique effectue des rotations à moins de 2 mètres d'un pylône électrique aérien.",
    rule: "Norme de sécurité électrique : Distance minimale de sécurité de 3 mètres pour les lignes < 50kV et 5 mètres pour les lignes > 50kV.",
    corrective: "Mettre la ligne hors tension ou installer un portique de limitation physique de hauteur (gabarit) pour restreindre l'amplitude du bras.",
    x: 275,
    y: 130,
    r: 18
  },
  {
    id: "h3",
    title: "Tranchée instable non étayée",
    desc: "Un opérateur de terrassement travaille au fond d'une tranchée d'excavation de 2.20 mètres de profondeur sans aucun blindage.",
    rule: "Réglementation des fouilles et blindage : Obligation de blinder, étayer ou taluter toute tranchée de plus de 1.30 m de profondeur pour éviter les éboulements.",
    corrective: "Installer des caissons de blindage métalliques ou réaliser un talutage respectant l'angle naturel d'éboulement du sol.",
    x: 100,
    y: 280,
    r: 20
  },
  {
    id: "h4",
    title: "Stabilisateurs de grue non déployés",
    desc: "Une grue mobile effectue un levage lourd alors que ses vérins stabilisateurs latéraux ne sont pas entièrement déployés au sol.",
    rule: "Règles d'utilisation des grues mobiles : Les stabilisateurs doivent être sortis au maximum et posés sur des plaques de répartition de charge stables.",
    corrective: "Déployer entièrement les bras de stabilisation, utiliser des madriers d'appui de dimensions suffisantes et vérifier le niveau à bulle.",
    x: 45,
    y: 190,
    r: 16
  },
  {
    id: "h5",
    title: "Ouvrier sans gilet haute visibilité",
    desc: "Un manœuvre au sol circule juste derrière le camion-benne en marche arrière sans gilet réfléchissant de sécurité orange.",
    rule: "Équipements de Protection Individuelle (EPI) : Port obligatoire du gilet de classe 2 ou 3 sur toute zone de circulation d'engins lourds.",
    corrective: "Équiper immédiatement l'ouvrier d'un gilet haute visibilité fluo homologué et s'assurer que le camion possède un radar d'obstacles actif.",
    x: 200,
    y: 215,
    r: 14
  }
]

export default function ChasseAuxRisquesPage() {
  const [spottedIds, setSpottedIds] = useState<string[]>([])
  const [activeHazard, setActiveHazard] = useState<Hazard | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [username, setUsername] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [certGenerated, setCertGenerated] = useState(false)

  const handleSpotHazard = (h: Hazard) => {
    if (spottedIds.includes(h.id)) {
      setActiveHazard(h)
      return
    }

    const updated = [...spottedIds, h.id]
    setSpottedIds(updated)
    setActiveHazard(h)
    
    // Play success sound chime (Web Audio)
    triggerAudioChime(660, 'sine', 0.1)
    setTimeout(() => triggerAudioChime(880, 'sine', 0.15), 100)

    if (updated.length === HAZARDS.length) {
      setGameOver(true)
      // Play fanfare sound
      setTimeout(() => {
        triggerAudioChime(523.25, 'triangle', 0.2) // C5
        setTimeout(() => triggerAudioChime(659.25, 'triangle', 0.2), 150) // E5
        setTimeout(() => triggerAudioChime(783.99, 'triangle', 0.2), 300) // G5
        setTimeout(() => triggerAudioChime(1046.50, 'triangle', 0.4), 450) // C6
      }, 600)
    }
  }

  const handleReset = () => {
    setSpottedIds([])
    setActiveHazard(null)
    setGameOver(false)
    setCertGenerated(false)
    setUsername("")
    triggerAudioChime(440, 'sawtooth', 0.1)
  }

  const triggerAudioChime = (freq: number, type: OscillatorType, duration: number) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtxClass) return
      const ctx = new AudioCtxClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
      setTimeout(() => ctx.close(), 300)
    } catch {}
  }

  const handleExportPDF = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setIsGenerating(true)

    setTimeout(() => {
      try {
        const doc = new jsPDF()

        // 1. Gold Frame Background
        doc.setFillColor(26, 26, 29) // Dark Carbon Background
        doc.rect(0, 0, 210, 297, "F")

        // Gold border lines
        doc.setDrawColor(255, 176, 0)
        doc.setLineWidth(1.5)
        doc.rect(8, 8, 194, 281)
        doc.rect(10, 10, 190, 277)

        // 2. Certificate Header
        doc.setFont("helvetica", "bold")
        doc.setFontSize(28)
        doc.setTextColor(255, 176, 0) // Gold
        doc.text("ATTESTATION DE VIGILANCE HSE", 105, 50, { align: "center" })

        doc.setFontSize(11)
        doc.setTextColor(250, 250, 250)
        doc.setFont("helvetica", "normal")
        doc.text("DÉCERNÉE PAR LE COMITÉ D'ÉVALUATION PEDAGOGIQUE GALF", 105, 60, { align: "center" })

        // Safety Ribbon Accent
        doc.setFillColor(255, 176, 0)
        doc.rect(40, 68, 130, 1.5, "F")

        // 3. Candidate Name
        doc.setFont("helvetica", "italic")
        doc.setFontSize(14)
        doc.setTextColor(180, 180, 180)
        doc.text("Cette attestation d'honneur certifie que", 105, 95, { align: "center" })

        doc.setFont("helvetica", "bold")
        doc.setFontSize(24)
        doc.setTextColor(255, 255, 255)
        doc.text(username.toUpperCase(), 105, 110, { align: "center" })

        // 4. Achievement text
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10.5)
        doc.setTextColor(190, 190, 190)
        
        const descText = "a complété avec succès le test d'évaluation de la 'Chasse aux Risques HSE' de GALF Formation. L'apprenant a identifié l'ensemble des 5 situations de danger majeures liées aux manœuvres d'engins lourds, travaux d'excavation et levage conformes aux référentiels CACES R482."
        const splitText = doc.splitTextToSize(descText, 150)
        doc.text(splitText, 105, 128, { align: "center" })

        // 5. Score Banner
        doc.setFillColor(255, 176, 0)
        doc.rect(70, 165, 70, 16, "F")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(13)
        doc.setTextColor(26, 26, 29)
        doc.text("SCORE PARFAIT : 5 / 5", 105, 175, { align: "center" })

        // 6. Signatures and Stamp
        const sigY = 220
        doc.setFontSize(9)
        doc.setTextColor(160, 160, 160)
        doc.text("Directeur Pédagogique", 45, sigY, { align: "center" })
        doc.text("Responsable HSE GALF CI", 155, sigY, { align: "center" })

        doc.setFont("helvetica", "bold")
        doc.setTextColor(255, 255, 255)
        doc.text("B. KONE", 45, sigY + 8, { align: "center" })
        doc.text("J. KOUADIO", 155, sigY + 8, { align: "center" })

        // Digital Authentication Code
        doc.setFont("courier", "bold")
        doc.setFontSize(7)
        doc.setTextColor(100, 100, 100)
        doc.text(`ID AUTHENTIQUE VERIFIABLE : GALF-HSE-SH-${Math.floor(100000 + Math.random() * 900000)}`, 105, 275, { align: "center" })

        // Save PDF
        doc.save(`Attestation-HSE-GALF-${username.replace(/\s+/g, '-')}.pdf`)
        setCertGenerated(true)
      } catch (err) {
        console.error(err)
      }
      setIsGenerating(false)
    }, 1500)
  }

  const fieldStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden text-left" style={{ background: '#0a0a0c' }}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal opacity-5" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-galf-yellow/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-galf pt-24 relative z-10">
        
        <Link 
          href="/mediatheque"
          className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-xs mb-4 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la Médiathèque
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              Jeu Pédagogique HSE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mt-3">
              CHASSE AUX <span className="text-galf-yellow">RISQUES HSE</span>
            </h1>
            <p className="text-white/60 text-sm max-w-xl mt-2 leading-relaxed">
              Analysez la scène de chantier ci-dessous. Repérez et cliquez sur les 5 anomalies ou situations de danger pour tester vos réflexes d'inspecteur de sécurité.
            </p>
          </div>

          <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border-galf-yellow/20 bg-white/5 shrink-0">
             <Trophy className="w-8 h-8 text-galf-yellow animate-bounce" />
             <div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40 text-white">Score de vigilance</div>
                <div className="text-sm font-black text-white font-mono">{spottedIds.length} / 5 Dangers trouvés</div>
             </div>
          </div>
        </div>

        {/* Game Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE INTERACTIVE SVG SCENE (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card p-4 rounded-[2.5rem] bg-zinc-950/80 border-white/5 relative overflow-hidden select-none">
              
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="text-[9px] font-black uppercase bg-black/60 border border-white/10 px-2.5 py-1 rounded-lg text-white flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-galf-yellow" /> Chantier Actif 2D
                </span>
              </div>

              {/* Styled Construction/Mining Site Vector SVG */}
              <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
                
                <svg viewBox="0 0 350 350" className="w-full h-full p-2">
                  {/* Sky background and ground */}
                  <rect x="0" y="0" width="350" height="230" fill="#141416" />
                  <rect x="0" y="230" width="350" height="120" fill="#252529" />
                  
                  {/* Ground grid for tech look */}
                  <path d="M 0,230 L 350,230 M 0,260 L 350,260 M 0,290 L 350,290 M 0,320 L 350,320" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <path d="M 50,230 L 0,350 M 120,230 L 50,350 M 200,230 L 150,350 M 280,230 L 260,350" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  {/* ────────────────────────────────────────────────
                      1. Tower Crane Element (h1: Suspended Load Danger)
                     ──────────────────────────────────────────────── */}
                  <g>
                    {/* Tower Mast */}
                    <rect x="130" y="40" width="8" height="190" fill="#3f3f46" />
                    <line x1="130" y1="40" x2="138" y2="230" stroke="rgba(255,176,0,0.3)" strokeWidth="1" />
                    {/* Jib */}
                    <rect x="50" y="36" width="160" height="6" fill="#ffb000" />
                    {/* Cable */}
                    <line x1="175" y1="42" x2="175" y2="76" stroke="#a1a1aa" strokeWidth="1.5" />
                    {/* Heavy concrete container load */}
                    <rect x="168" y="76" width="14" height="12" fill="#ef4444" rx="1" />
                    {/* Ground worker walking right underneath the load */}
                    <circle cx="175" cy="222" r="3.5" fill="#f43f5e" />
                    <line x1="175" y1="225" x2="175" y2="230" stroke="#f43f5e" strokeWidth="2.5" />
                  </g>

                  {/* ────────────────────────────────────────────────
                      2. Electric Pole / Ligne HT (h2: High Voltage proximity)
                     ──────────────────────────────────────────────── */}
                  <g>
                    {/* Pole */}
                    <line x1="285" y1="80" x2="285" y2="230" stroke="#71717a" strokeWidth="3" />
                    <line x1="265" y1="95" x2="305" y2="95" stroke="#71717a" strokeWidth="2.5" />
                    {/* High voltage wires */}
                    <path d="M 230,85 Q 265,95 285,95 Q 315,95 350,85" fill="none" stroke="#52525b" strokeWidth="1" />
                    {/* Excavator arm very close to it */}
                    <path d="M 230,230 L 250,160 L 274,130" fill="none" stroke="#ffb000" strokeWidth="4.5" strokeLinecap="round" />
                    <rect x="220" y="210" width="22" height="15" fill="#27272a" rx="2" />
                    {/* Bucket */}
                    <path d="M 274,130 L 282,126 L 278,136 Z" fill="#ffb000" />
                  </g>

                  {/* ────────────────────────────────────────────────
                      3. Unshielded Trench (h3: Excavation Landslide risk)
                     ──────────────────────────────────────────────── */}
                  <g>
                    {/* Deep trench cutout */}
                    <polygon points="70,230 85,300 125,300 140,230" fill="#18181b" />
                    <path d="M 85,300 L 125,300" stroke="#7f1d1d" strokeWidth="1.5" />
                    {/* Ground worker inside trench */}
                    <circle cx="103" cy="285" r="3" fill="#f43f5e" />
                    <line x1="103" y1="288" x2="103" y2="298" stroke="#f43f5e" strokeWidth="2" />
                  </g>

                  {/* ────────────────────────────────────────────────
                      4. Mobile Crane (h4: Stabilizers Tipping risk)
                     ──────────────────────────────────────────────── */}
                  <g>
                    {/* Mobile crane body */}
                    <rect x="35" y="200" width="22" height="12" fill="#ffb000" rx="1.5" />
                    <circle cx="40" cy="213" r="3" fill="#000" />
                    <circle cx="52" cy="213" r="3" fill="#000" />
                    {/* Crane boom */}
                    <line x1="52" y1="200" x2="25" y2="150" stroke="#e4e4e7" strokeWidth="3" strokeLinecap="round" />
                    {/* Outriggers showing unextended and hovering */}
                    <line x1="36" y1="208" x2="36" y2="216" stroke="#ef4444" strokeWidth="1.5" />
                  </g>

                  {/* ────────────────────────────────────────────────
                      5. Worker without Vest (h5: High vis collision risk)
                     ──────────────────────────────────────────────── */}
                  <g>
                    {/* Dump truck reversing */}
                    <rect x="215" y="195" width="28" height="16" fill="#3f3f46" rx="2" />
                    <circle cx="222" cy="212" r="3" fill="#000" />
                    <circle cx="236" cy="212" r="3" fill="#000" />
                    <rect x="235" y="185" width="15" height="14" fill="#a1a1aa" />
                    {/* Ground worker behind it, wearing normal dark grey clothes */}
                    <circle cx="198" cy="212" r="3" fill="#52525b" />
                    <line x1="198" y1="215" x2="198" y2="225" stroke="#52525b" strokeWidth="2.5" />
                  </g>

                  {/* ────────────────────────────────────────────────
                      HOTSPOTS (Invisible overlay zones)
                     ──────────────────────────────────────────────── */}
                  {HAZARDS.map((h) => {
                    const isSpotted = spottedIds.includes(h.id)
                    const isActive = activeHazard?.id === h.id

                    return (
                      <g key={h.id} className="cursor-pointer" onClick={() => handleSpotHazard(h)}>
                        {/* Glow halo when spotted */}
                        {isSpotted && (
                          <circle 
                            cx={h.x} 
                            cy={h.y} 
                            r={h.r + 4} 
                            fill="none" 
                            stroke={isActive ? "#ffb000" : "#22c55e"} 
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                        )}

                        {/* Interactive hotspot dot */}
                        <circle 
                          cx={h.x} 
                          cy={h.y} 
                          r={h.r} 
                          fill={isSpotted ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 176, 0, 0.05)"} 
                          stroke={isSpotted ? "#22c55e" : "rgba(255, 176, 0, 0.15)"} 
                          strokeWidth={isSpotted ? 2 : 1}
                          strokeDasharray={isSpotted ? undefined : "3,3"}
                          className="hover:fill-galf-yellow/20 hover:stroke-galf-yellow transition-all"
                        />

                        {/* Spotted check mark */}
                        {isSpotted && (
                          <g transform={`translate(${h.x - 4}, ${h.y - 4})`}>
                            <circle cx="4" cy="4" r="5" fill="#22c55e" />
                            <path d="M 2.5,4 L 3.5,5 L 5.5,3" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
                          </g>
                        )}
                      </g>
                    )
                  })}

                </svg>

              </div>
            </div>
          </div>

          {/* RIGHT: DANGER DESCRIPTION CARD / CONGRATS ACTION (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active spotted hazard explanation box */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 min-h-[300px] flex flex-col justify-between">
              {activeHazard ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-black text-galf-yellow uppercase tracking-widest">
                    <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" /> Danger identifié
                  </div>
                  
                  <h3 className="text-xl font-black text-white">{activeHazard.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">{activeHazard.desc}</p>
                  
                  <div className="p-3.5 bg-red-950/20 border border-red-500/10 rounded-xl space-y-1">
                    <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Infraction Réglementaire</span>
                    <p className="text-[10px] text-red-200 leading-relaxed font-medium">{activeHazard.rule}</p>
                  </div>

                  <div className="p-3.5 bg-green-950/20 border border-green-500/10 rounded-xl space-y-1">
                    <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Action Corrective</span>
                    <p className="text-[10px] text-green-200 leading-relaxed font-medium">{activeHazard.corrective}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/40 space-y-3">
                  <HelpCircle className="w-12 h-12 text-galf-yellow/40 animate-pulse" />
                  <div className="text-xs uppercase tracking-wider font-bold">Sélectionnez une zone</div>
                  <p className="text-[11px] leading-relaxed">
                    Cliquez sur les cercles pointillés de la scène pour inspecter le chantier et repérer les défaillances.
                  </p>
                </div>
              )}

              {/* Game state progression bar */}
              <div className="pt-6 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-wider">
                  <span>Recherche en cours</span>
                  <span>{spottedIds.length} / 5 Dangers</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-galf-yellow transition-all duration-500" 
                    style={{ width: `${(spottedIds.length / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Game Over Attestation Generator Form */}
            {gameOver && (
              <FadeIn>
                <div className="glass-card p-6 rounded-[2.5rem] border-galf-yellow/30 bg-galf-yellow/5 space-y-4">
                  <div className="text-center space-y-2">
                    <Trophy className="w-10 h-10 text-galf-yellow mx-auto animate-bounce" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">FÉLICITATIONS !</h3>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      Vous avez identifié la totalité des anomalies. Réclamez votre certificat de vigilance HSE GALF.
                    </p>
                  </div>

                  <form onSubmit={handleExportPDF} className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Votre nom complet" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                    />
                    
                    <button
                      type="submit"
                      disabled={isGenerating || !username.trim()}
                      className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span>Télécharger mon Attestation</span>
                    </button>
                  </form>

                  {certGenerated && (
                    <div className="text-[10px] text-green-400 font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                      <CheckCircle className="w-3.5 h-3.5" /> Fichier de réussite PDF exporté.
                    </div>
                  )}

                  <button 
                    onClick={handleReset}
                    className="w-full text-center text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors"
                  >
                    Recommencer la chasse ↺
                  </button>
                </div>
              </FadeIn>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
