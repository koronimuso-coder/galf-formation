"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Compass, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, 
  MapPin, Sliders, Volume2, VolumeX, Download, 
  Activity, Gauge, Fuel, Thermometer, Wind, FileSpreadsheet, ArrowLeft
} from 'lucide-react'


import { jsPDF } from 'jspdf'

interface Machine {
  id: string
  name: string
  type: 'pelle' | 'grue' | 'bulldozer'
  site: string
  operator: string
  rpm: number
  load: number
  maxLoad: number
  oilTemp: number
  fuel: number
  wind: number
  status: 'OPTIMAL' | 'ATTENTION' | 'DANGER'
  coords: { x: number; y: number }
}

const INITIAL_MACHINES: Machine[] = [
  {
    id: "CAT-320D-102",
    name: "Pelle Hydraulique Caterpillar 320D",
    type: "pelle",
    site: "Port Autonome de San Pedro",
    operator: "Jean Kouadio (Certifié GALF)",
    rpm: 1800,
    load: 12.5,
    maxLoad: 15.0,
    oilTemp: 78,
    fuel: 85,
    wind: 15,
    status: "OPTIMAL",
    coords: { x: 130, y: 310 } // San Pedro area
  },
  {
    id: "LIEB-LTM-08",
    name: "Grue Mobile Liebherr LTM 1050",
    type: "grue",
    site: "Chantier Métro d'Abidjan - Plateau",
    operator: "Marc Koffi (Certifié GALF)",
    rpm: 1400,
    load: 22.0,
    maxLoad: 50.0,
    oilTemp: 65,
    fuel: 70,
    wind: 28,
    status: "OPTIMAL",
    coords: { x: 230, y: 280 } // Abidjan area
  },
  {
    id: "KOM-D65EX-14",
    name: "Bulldozer Komatsu D65EX",
    type: "bulldozer",
    site: "Autoroute du Nord - Section Yamoussoukro",
    operator: "Bakary Touré (Certifié GALF)",
    rpm: 1950,
    load: 8.0,
    maxLoad: 10.0,
    oilTemp: 82,
    fuel: 45,
    wind: 12,
    status: "OPTIMAL",
    coords: { x: 200, y: 200 } // Yamoussoukro area
  }
]

export default function TelemetriePage() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES)
  const [selectedMachineId, setSelectedMachineId] = useState<string>("CAT-320D-102")
  const [isSirenOn, setIsSirenOn] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    "14:20:05 [INFO] Système de télémétrie GALF VisionLink initialisé.",
    "14:20:10 [INFO] Connexion établie avec l'engin LIEB-LTM-08 (Abidjan).",
    "14:20:12 [INFO] Connexion établie avec l'engin CAT-320D-102 (San Pedro).",
    "14:20:15 [INFO] Connexion établie avec l'engin KOM-D65EX-14 (Yamoussoukro)."
  ])
  const [isExporting, setIsExporting] = useState(false)

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null)
  const osc1Ref = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sirenIntervalRef = useRef<any>(null)

  const activeMachine = machines.find(m => m.id === selectedMachineId) || machines[0]

  // Add event to log
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString('fr-FR')
    setLogs(prev => [`${time} ${message}`, ...prev.slice(0, 19)])
  }

  // Handle slide values update
  const handleSliderChange = (field: 'rpm' | 'load' | 'oilTemp' | 'fuel' | 'wind', value: number) => {
    setMachines(prev => prev.map(m => {
      if (m.id === selectedMachineId) {
        const updated = { ...m, [field]: value }
        
        // Safety logic checklist
        let status: 'OPTIMAL' | 'ATTENTION' | 'DANGER' = 'OPTIMAL'
        if (field === 'load') {
          if (value > m.maxLoad) {
            status = 'DANGER'
          } else if (value > m.maxLoad * 0.85) {
            status = 'ATTENTION'
          }
        } else if (field === 'oilTemp') {
          if (value > 95) {
            status = 'DANGER'
          } else if (value > 85) {
            status = 'ATTENTION'
          }
        } else if (field === 'wind') {
          if (m.type === 'grue' && value > 40) {
            status = 'DANGER'
          } else if (m.type === 'grue' && value > 30) {
            status = 'ATTENTION'
          }
        }
        
        return { ...updated, status }
      }
      return m
    }))
  }

  // Trigger alarms when state goes DANGER
  useEffect(() => {
    if (activeMachine.status === 'DANGER') {
      setIsSirenOn(true)
      const alertMsg = `[ALERTE ROUGE] Paramètres critiques dépassés sur ${activeMachine.name} ! Charge: ${activeMachine.load}T / ${activeMachine.maxLoad}T, Temp: ${activeMachine.oilTemp}°C, Vent: ${activeMachine.wind}km/h.`
      // Prevent spamming log with duplicate dangerous entries
      setLogs(prev => {
        if (prev[0] && prev[0].includes(activeMachine.id) && prev[0].includes("ALERTE ROUGE")) return prev
        return [`${new Date().toLocaleTimeString('fr-FR')} ${alertMsg}`, ...prev.slice(0, 19)]
      })
    } else {
      setIsSirenOn(false)
    }
  }, [activeMachine.status, activeMachine.load, activeMachine.oilTemp, activeMachine.wind, activeMachine.id, activeMachine.name, activeMachine.maxLoad])

  // Siren Sound synthesis (modulating frequency)
  useEffect(() => {
    if (isSirenOn && isAudioEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        audioCtxRef.current = ctx

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        osc1Ref.current = osc
        gainNodeRef.current = gain

        // Modulate frequency like a real safety siren (wail)
        let rising = true
        sirenIntervalRef.current = setInterval(() => {
          if (!osc || ctx.state === 'closed') return
          const currentFreq = osc.frequency.value
          if (rising) {
            osc.frequency.setValueAtTime(currentFreq + 40, ctx.currentTime)
            if (currentFreq >= 900) rising = false
          } else {
            osc.frequency.setValueAtTime(currentFreq - 40, ctx.currentTime)
            if (currentFreq <= 500) rising = true
          }
        }, 30)

      } catch (err) {
        console.error(err)
      }
    } else {
      stopSiren()
    }

    return () => stopSiren()
  }, [isSirenOn, isAudioEnabled])

  const stopSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current)
      sirenIntervalRef.current = null
    }
    if (osc1Ref.current) {
      try {
        osc1Ref.current.stop()
      } catch {}
      osc1Ref.current = null
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close()
      } catch {}
      audioCtxRef.current = null
    }
  }

  const handleExportPDF = () => {
    setIsExporting(true)
    setTimeout(() => {
      try {
        const doc = new jsPDF()

        // Styles & colors
        const primaryColor = [255, 176, 0] // Yellow Safety

        // Title Header
        doc.setFillColor(26, 26, 29)
        doc.rect(0, 0, 210, 45, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.setTextColor(255, 255, 255)
        doc.text("RAPPORT DE SÉCURITÉ DE FLOTTE B2B", 15, 20)

        doc.setFontSize(10)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text("SERVICE DE SURVEILLANCE & CONFORMITÉ HABILITATIONS GALF CI", 15, 28)

        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}  |  Technologie VisionLink GALF`, 15, 36)

        // Safety Ribbon
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.rect(0, 42, 210, 3, "F")

        // Section 1: Overview
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(30, 30, 30)
        doc.text("1. SYNTHÈSE DE LA FLOTTE EN OPÉRATION", 15, 60)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9.5)
        doc.setTextColor(70, 70, 70)
        doc.text("Ce diagnostic compile l'activité et le respect des abaques de charge des engins lourds exploités par vos équipes.", 15, 66)

        // Draw Table
        let startY = 75
        doc.setFillColor(240, 240, 242)
        doc.rect(15, startY, 180, 8, "F")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8.5)
        doc.setTextColor(40, 40, 40)
        doc.text("ID MACHINE", 18, startY + 5.5)
        doc.text("ENGIN / MODÈLE", 45, startY + 5.5)
        doc.text("CONDUITE PAR", 95, startY + 5.5)
        doc.text("CHARGE (MAX)", 145, startY + 5.5)
        doc.text("STATUT", 175, startY + 5.5)

        startY += 8
        machines.forEach(m => {
          doc.setDrawColor(220, 220, 220)
          doc.line(15, startY, 195, startY)
          
          doc.setFont("helvetica", "normal")
          doc.setFontSize(8)
          doc.setTextColor(60, 60, 60)
          doc.text(m.id, 18, startY + 5)
          doc.text(m.name.substring(0, 28), 45, startY + 5)
          doc.text(m.operator.substring(0, 24), 95, startY + 5)
          doc.text(`${m.load} T / ${m.maxLoad} T`, 145, startY + 5)
          
          if (m.status === 'DANGER') {
            doc.setTextColor(220, 50, 50)
            doc.setFont("helvetica", "bold")
            doc.text("DANGER (SURCHARGE)", 175, startY + 5)
          } else if (m.status === 'ATTENTION') {
            doc.setTextColor(200, 150, 20)
            doc.setFont("helvetica", "bold")
            doc.text("ATTENTION", 175, startY + 5)
          } else {
            doc.setTextColor(30, 150, 30)
            doc.text("OPTIMAL", 175, startY + 5)
          }
          
          startY += 7.5
        })

        // Section 2: Log events
        startY += 10
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(30, 30, 30)
        doc.text("2. LOGS D'ÉVÉNEMENTS HSE RÉCENTS", 15, startY)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor(100, 100, 100)
        
        startY += 6
        logs.slice(0, 7).forEach(log => {
          doc.text(log, 15, startY)
          startY += 5.5
        })

        // Section 3: Stamp & Sign
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setLineWidth(0.5)
        doc.rect(15, 240, 180, 20)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        doc.setTextColor(30, 30, 30)
        doc.text("AVERTISSEMENT LÉGAL - TÉLÉMÉTRIE DE SÉCURITÉ GALF Côte d'Ivoire", 20, 246)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(7)
        doc.setTextColor(120, 120, 120)
        doc.text("Les données télémétriques sont fournies à titre indicatif et ne remplacent pas la présence d'un chef de manœuvre agréé.", 20, 251)
        doc.text("En cas de surcharges répétées, GALF propose des sessions obligatoires de recyclage de conduite HSE.", 20, 255)

        // Save PDF
        doc.save(`Rapport-Telemetrie-GALF-${new Date().toISOString().slice(0, 10)}.pdf`)
        addLog(`[INFO] Bilan de télémétrie PDF exporté avec succès.`);
      } catch (err) {
        console.error(err)
      }
      setIsExporting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden text-left" style={{ background: '#0a0a0c' }}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-diagonal opacity-5" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-galf-yellow/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-galf pt-24 relative z-10">
        
        <Link 
          href="/entreprise"
          className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-xs mb-4 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'Espace Entreprises
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              Caterpillar VisionLink Simulator
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mt-3">
              TÉLÉMÉTRIE DE <span className="text-galf-yellow">FLOTTE B2B</span>
            </h1>
            <p className="text-white/60 text-sm max-w-xl mt-2 leading-relaxed">
              Supervisez l'état, la géolocalisation et le respect des abaques de charge des engins opérés sur vos chantiers miniers et de travaux publics.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-4 rounded-xl border flex items-center gap-2 transition-all ${
                isAudioEnabled 
                  ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-xs font-black uppercase tracking-wider">Son Alarme</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-galf-yellow text-galf-carbon px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Exporter Rapport</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ACTIVE FLEET LIST & MAP (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Interactive SVG Map */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Compass className="w-5 h-5 text-galf-yellow animate-spin" style={{ animationDuration: '6s' }} /> Carte de Suivi HSE - Chantiers Actifs (Côte d'Ivoire)
              </h3>

              <div className="relative w-full aspect-[16/9] rounded-2xl bg-zinc-950 overflow-hidden border border-white/5 flex items-center justify-center">
                
                {/* Visual grid grid lines */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />

                {/* Côte d'Ivoire map shape simulator (SVG) */}
                <svg viewBox="0 0 350 350" className="w-full h-full p-4 relative z-10">
                  {/* Outline of Côte d'Ivoire styled in tech grid style */}
                  <polygon 
                    points="70,50 170,30 270,40 320,120 300,240 270,300 230,300 130,320 80,240 60,150 70,50" 
                    fill="none" 
                    stroke="rgba(255, 176, 0, 0.15)" 
                    strokeWidth="2.5" 
                    strokeDasharray="4,4"
                  />
                  
                  <polygon 
                    points="75,55 165,35 265,45 315,125 295,235 265,295 225,295 135,315 85,235 65,155 75,55" 
                    fill="rgba(255,176,0,0.02)"
                  />

                  {/* Côte d'Ivoire major roads / lines for tech grid aesthetic */}
                  <line x1="230" y1="280" x2="200" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="200" y1="200" x2="130" y2="310" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="200" y1="200" x2="270" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                  {/* Location reference indicators */}
                  <text x="245" y="285" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">ABIDJAN</text>
                  <text x="145" y="315" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">SAN PEDRO</text>
                  <text x="210" y="195" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">YAKRO</text>

                  {/* Active telemetry machines dots */}
                  {machines.map((m) => {
                    const isSelected = m.id === selectedMachineId
                    const isDanger = m.status === 'DANGER'
                    
                    return (
                      <g 
                        key={m.id} 
                        className="cursor-pointer" 
                        onClick={() => {
                          setSelectedMachineId(m.id)
                          triggerAudioFeedback()
                        }}
                      >
                        {/* Flashing rings for danger state */}
                        {isDanger && (
                          <circle 
                            cx={m.coords.x} 
                            cy={m.coords.y} 
                            r="16" 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="1.5"
                            className="animate-ping" 
                            style={{ transformOrigin: `${m.coords.x}px ${m.coords.y}px` }}
                          />
                        )}

                        {/* Selected halo */}
                        {isSelected && (
                          <circle 
                            cx={m.coords.x} 
                            cy={m.coords.y} 
                            r="11" 
                            fill="none" 
                            stroke="#ffb000" 
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        )}

                        {/* Dot indicator */}
                        <circle 
                          cx={m.coords.x} 
                          cy={m.coords.y} 
                          r="6" 
                          fill={isDanger ? "#ef4444" : isSelected ? "#ffb000" : "#22c55e"} 
                          className="transition-all"
                        />
                        
                        {/* Short machine slug name tag */}
                        <text 
                          x={m.coords.x + 10} 
                          y={m.coords.y + 3} 
                          fill={isSelected ? "#ffb000" : "#ffffff"} 
                          fontSize="7" 
                          fontWeight="black" 
                          className="font-mono bg-black"
                        >
                          {m.id.split('-')[0]}-{m.id.split('-')[2] || m.id.split('-')[1]}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 text-[9px] font-mono text-white/70 space-y-1.5 z-20">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block" /> ENGING OPÉRATIONNEL OPTIMAL</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block animate-pulse" /> ALERTE SÉCURITÉ DE CHARGE / SEUIL</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ffb000] inline-block" /> ENGIN ACTUELLEMENT SÉLECTIONNÉ</div>
                </div>

              </div>
            </div>

            {/* Fleet Status List Table */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-galf-yellow" /> État Général de la Flotte
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {machines.map((m) => {
                  const isSelected = m.id === selectedMachineId
                  const isDanger = m.status === 'DANGER'
                  const isAttention = m.status === 'ATTENTION'

                  return (
                    <div 
                      key={m.id}
                      onClick={() => {
                        setSelectedMachineId(m.id)
                        triggerAudioFeedback()
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-galf-yellow/10 border-galf-yellow shadow-[0_0_15px_rgba(255,176,0,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono font-bold text-white/40">{m.id}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          isDanger ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          isAttention ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white truncate">{m.name}</h4>
                      <p className="text-[9px] text-white/50 truncate mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-galf-yellow shrink-0" /> {m.site}</p>
                      
                      {/* Sub-bar showing loading ratio */}
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-white/60">
                          <span>Charge: {m.load} T</span>
                          <span>Max: {m.maxLoad} T</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isDanger ? 'bg-red-500' : isAttention ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, (m.load / m.maxLoad) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tech Logs Console */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-galf-yellow" /> Journal d'événements Télémétrie HSE
                </h3>
                <span className="text-[9px] text-white/30 uppercase font-mono">20 LIGNES MAX</span>
              </div>
              <div className="bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-zinc-400 space-y-2 h-44 overflow-y-auto scrollbar-thin text-left leading-relaxed">
                {logs.map((log, i) => (
                  <div 
                    key={i} 
                    className={`transition-all duration-300 ${
                      log.includes('ALERTE ROUGE') ? 'text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-500/10' :
                      log.includes('INFO') ? 'text-green-400' : 'text-zinc-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAILED METRICS SIMULATOR (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-full" />
              
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-galf-yellow" /> Simulateur de Télémétrie Machine
              </h3>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl mb-6">
                <div className="text-[10px] font-black text-white/40 uppercase tracking-wider">Engin connecté</div>
                <div className="text-xs font-black text-white mt-1">{activeMachine.name}</div>
                <div className="text-[9px] font-bold text-galf-yellow mt-0.5">{activeMachine.operator}</div>
              </div>

              {/* Sliders inputs */}
              <div className="space-y-6">
                
                {/* 1. Load weight slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-galf-yellow" /> Poids de charge</span>
                    <span className={activeMachine.status === 'DANGER' ? 'text-red-400 font-black font-mono animate-pulse' : 'text-white font-mono'}>
                      {activeMachine.load} T / {activeMachine.maxLoad} T
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={(activeMachine.maxLoad * 1.3).toFixed(1)}
                    step="0.5"
                    value={activeMachine.load}
                    onChange={(e) => handleSliderChange('load', Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono">
                    <span>A vide</span>
                    <span>Capacité nominale ({activeMachine.maxLoad}T)</span>
                    <span>Surcharge</span>
                  </div>
                </div>

                {/* 2. Engine RPM slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-galf-yellow" /> Régime Moteur</span>
                    <span className="text-white font-mono">{activeMachine.rpm} RPM</span>
                  </div>
                  <input 
                    type="range"
                    min="800"
                    max="2800"
                    step="50"
                    value={activeMachine.rpm}
                    onChange={(e) => handleSliderChange('rpm', Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono">
                    <span>Ralenti</span>
                    <span>Optimal (1800)</span>
                    <span>Zone rouge (2800)</span>
                  </div>
                </div>

                {/* 3. Oil Temperature slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-galf-yellow" /> Température d'Huile</span>
                    <span className={activeMachine.oilTemp > 95 ? 'text-red-400 font-black font-mono animate-pulse' : 'text-white font-mono'}>
                      {activeMachine.oilTemp} °C
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="40"
                    max="120"
                    step="1"
                    value={activeMachine.oilTemp}
                    onChange={(e) => handleSliderChange('oilTemp', Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono">
                    <span>Froid</span>
                    <span>Nominal (80°C)</span>
                    <span>Surchauffe ({'>'}95°C)</span>
                  </div>
                </div>

                {/* 4. Fuel slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-1"><Fuel className="w-3.5 h-3.5 text-galf-yellow" /> Réservoir Diesel</span>
                    <span className="text-white font-mono">{activeMachine.fuel} %</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={activeMachine.fuel}
                    onChange={(e) => handleSliderChange('fuel', Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono">
                    <span>Vide</span>
                    <span>Plein</span>
                  </div>
                </div>

                {/* 5. Wind slider (only relevant for Crane) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-galf-yellow" /> Vitesse du vent</span>
                    <span className={activeMachine.wind > 40 ? 'text-red-400 font-black font-mono animate-pulse' : 'text-white font-mono'}>
                      {activeMachine.wind} km/h
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="80"
                    step="2"
                    value={activeMachine.wind}
                    onChange={(e) => handleSliderChange('wind', Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono">
                    <span>Calme</span>
                    <span>Limite grue (40km/h)</span>
                    <span>Tempête (80km/h)</span>
                  </div>
                </div>

              </div>

              {/* Status Alert Message panel */}
              {activeMachine.status === 'DANGER' && (
                <div className="mt-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 text-red-200">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">Alerte de Sécurité Cabine</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      Les seuils autorisés par la réglementation CACES sont dépassés. Risque de basculement ou d'avarie mécanique immédiat.
                    </div>
                  </div>
                </div>
              )}

              {activeMachine.status === 'ATTENTION' && (
                <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3 text-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">Avertissement de charge</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      La charge ou le vent atteint 85% de la limite maximale autorisée. Conduire à vitesse réduite.
                    </div>
                  </div>
                </div>
              )}

              {activeMachine.status === 'OPTIMAL' && (
                <div className="mt-8 bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-start gap-3 text-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">Paramètres optimaux</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      Toutes les constantes de conduite sont dans la plage recommandée. Aucun risque identifié.
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
