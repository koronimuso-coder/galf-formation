"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowLeft, ArrowRight, Clock, MapPin, BarChart3, BookOpen, Target, Briefcase, CheckCircle2, Phone, Shield, Play, AlertCircle, Eye, ShieldAlert, ClipboardCheck, ArrowUpDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useState, useEffect } from 'react'
import { AdBanner } from '@/components/layout/AdBanner'
import { BlocDocuments } from '@/components/sections/BlocDocuments'
import { BlocDebouches } from '@/components/sections/BlocDebouches'
import { FormationsSimilaires } from '@/components/sections/FormationsSimilaires'
import { FormulaireBrochure } from '@/components/sections/FormulaireBrochure'
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA'
import { SeatTimeTracker } from '@/components/sections/SeatTimeTracker'

const COMPARE_DB: { [key: string]: { name: string, weight: string, power: string, capacity: string, boom: string, caces: string } } = {
  "pelle-hydraulique": { name: "Pelle Hydraulique", weight: "22 tonnes", power: "165 ch", capacity: "1.2 m³", boom: "8.5 m", caces: "R482 Catégorie B1" },
  "grue-tour": { name: "Grue à Tour", weight: "12 tonnes (flèche)", power: "75 kW", capacity: "8 tonnes max", boom: "60 m", caces: "R487 Catégorie 1" },
  "bulldozer": { name: "Bulldozer D6", weight: "20 tonnes", power: "215 ch", capacity: "5.5 m³ (lame)", boom: "N/A", caces: "R482 Catégorie C1" },
  "chariot-elevateur": { name: "Chariot Élévateur", weight: "4.5 tonnes", power: "45 kW", capacity: "3.5 tonnes", boom: "4.7 m", caces: "R489 Catégorie 3 & 4" },
  "forage-minier": { name: "Foreuse de Mine", weight: "35 tonnes", power: "320 ch", capacity: "Diamètre 152mm", boom: "12 m", caces: "Spécifique Mine" }
}

export default function FormationDetail() {
  const params = useParams()
  const formation = GALF_FORMATIONS.find(f => f.slug === params.slug)

  // Interactive Video Player State
  const [activeChapter, setActiveChapter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Seats countdown state
  const [seatsReserved] = useState(17)
  const [totalSeats] = useState(20)

  // Wave 3 features state
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const [paymentTerm, setPaymentTerm] = useState<'1x' | '3x' | '6x'>('3x')
  const [eligAge, setEligAge] = useState(false)
  const [eligLicense, setEligLicense] = useState(false)
  const [eligAptitude, setEligAptitude] = useState(false)
  const [eligResult, setEligResult] = useState<'idle' | 'success' | 'fail'>('idle')

  // Wave 4 features state
  const [safetyDistance, setSafetyDistance] = useState(6) // meters
  const [slopeAngle, setSlopeAngle] = useState(8) // degrees
  const [checklist, setChecklist] = useState({
    fluids: false,
    tires: false,
    leaks: false,
    horn: false,
    epi: false
  })
  const [isEngineStarted, setIsEngineStarted] = useState(false)
  const [compareSlug, setCompareSlug] = useState("grue-tour")

  // Warning siren effect when slope is dangerous (>15 degrees)
  useEffect(() => {
    if (slopeAngle <= 15) return
    
    const interval = setInterval(() => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.3)
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.35)
        setTimeout(() => ctx.close(), 400)
      } catch {}
    }, 600)

    return () => clearInterval(interval)
  }, [slopeAngle])

  const handlePlaySound = (soundKey: string) => {
    setActiveSound(soundKey)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      if (soundKey === 'engine') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(80, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4)
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 1.2)
        gain.gain.setValueAtTime(0.12, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 1.5)
      } else if (soundKey === 'beep') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(950, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.setValueAtTime(0.001, ctx.currentTime + 0.25)
        setTimeout(() => {
          try {
            const osc2 = ctx.createOscillator()
            const gain2 = ctx.createGain()
            osc2.type = 'sine'
            osc2.frequency.setValueAtTime(950, ctx.currentTime)
            gain2.gain.setValueAtTime(0.1, ctx.currentTime)
            gain2.gain.setValueAtTime(0.001, ctx.currentTime + 0.25)
            osc2.connect(gain2)
            gain2.connect(ctx.destination)
            osc2.start()
            osc2.stop(ctx.currentTime + 0.25)
          } catch {}
        }, 350)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      } else if (soundKey === 'hydraulic') {
        const bufferSize = ctx.sampleRate * 1.0
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2500, ctx.currentTime)
        filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.9)
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0)
        
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        noise.start()
      } else if (soundKey === 'clank') {
        osc.type = 'square'
        osc.frequency.setValueAtTime(100, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.5)
      }
    } catch {}
    
    setTimeout(() => setActiveSound(null), 1500)
  }

  const handleCheckEligibility = () => {
    if (eligAge && eligLicense && eligAptitude) {
      setEligResult('success')
      triggerAudioClick()
    } else {
      setEligResult('fail')
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtx) {
          const ctx = new AudioCtx()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(180, ctx.currentTime)
          gain.gain.setValueAtTime(0.08, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.3)
        }
      } catch {}
    }
  }

  const chapters = [
    { title: "Introduction et consignes HSE", time: "00:00", desc: "Présentation des règles indispensables de sécurité de chantier." },
    { title: "Connaissance technique de l'engin", time: "05:15", desc: "Analyse mécanique, moteurs diesel et commandes hydrauliques." },
    { title: "Manœuvres et levage de précision", time: "12:40", desc: "Exercices pratiques de conduite en terrain accidenté." },
    { title: "Maintenance de premier niveau", time: "22:10", desc: "Checklist quotidienne, graissage et diagnostic de pannes." }
  ]

  if (!formation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--galf-bg)' }}>
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>404</h1>
          <p className="mb-8" style={{ color: 'var(--galf-text-secondary)' }}>Formation introuvable.</p>
          <Link href="/formations" className="bg-galf-yellow text-galf-carbon px-8 py-3 rounded-lg font-black">Retour</Link>
        </div>
      </div>
    )
  }

  // Audio click chime
  const triggerAudioClick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(650, ctx.currentTime)
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
      setTimeout(() => ctx.close(), 200)
    } catch {}
  }

  const handleSelectChapter = (idx: number) => {
    triggerAudioClick()
    setActiveChapter(idx)
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Hero */}
      <PageHeader
        title={formation.name.toUpperCase()}
        subtitle={formation.shortDesc}
        badge={formation.category}
        bgImage={getFormationImage(formation.slug)}
      >
        <div className="flex flex-wrap gap-4 mt-8">
          <Link href="/formations" className="glass-card px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-galf-yellow/50 transition-all border-galf-border">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md bg-white/10 border border-white/10 text-white/70">{formation.level}</span>
            <span className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md bg-white/10 border border-white/10 text-white/70">{formation.modality}</span>
          </div>
        </div>
      </PageHeader>

      <div className="container-galf relative z-20 -mt-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FadeIn delay={0.2}>
              <div className="glass-card p-8 rounded-3xl border border-galf-yellow/20">
                <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Présentation du parcours</h2>
                <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>{formation.longDesc}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { icon: Clock, v: formation.duration, label: "Durée" },
                    { icon: MapPin, v: formation.city, label: "Lieu" },
                    { icon: BarChart3, v: formation.level, label: "Niveau" },
                    { icon: BookOpen, v: formation.modality, label: "Modalité" },
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase text-galf-yellow tracking-widest">{m.label}</span>
                      <span className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--galf-text)' }}>
                        <m.icon className="w-3 h-3 text-galf-yellow" /> {m.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ═══════════════════════════════════════════════
                NEW: INTERACTIVE VIDEOCLASS CHAPTER PLAYER
               ═══════════════════════════════════════════════ */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-6 text-white flex items-center gap-2">
                  <Play className="text-galf-yellow w-5 h-5 fill-current" /> Extrait de Cours & Démo interactive
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Left: Interactive Chapters */}
                  <div className="md:col-span-1 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2">Plan d'étude</span>
                    {chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectChapter(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                          activeChapter === idx 
                            ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                            : 'bg-black/30 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex justify-between text-[11px] font-black">
                          <span className="truncate">{ch.title}</span>
                          <span className="font-mono text-white/50">{ch.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right: Simulated Video Player Screen */}
                  <div className="md:col-span-2 rounded-2xl bg-[#0c0c0e] border border-white/10 p-6 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    
                    <div className="relative z-10">
                      <span className="text-[8px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/60 uppercase">
                        {isPlaying ? 'LECTURE EN COURS' : 'VIDÉO EN PAUSE'}
                      </span>
                      <h4 className="text-base font-black text-white mt-3 leading-snug">{chapters[activeChapter].title}</h4>
                      <p className="text-xs text-white/60 leading-relaxed mt-2">{chapters[activeChapter].desc}</p>
                    </div>

                    <div className="relative z-10 pt-6">
                      {/* Video Seekbar */}
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2 cursor-pointer">
                        <div 
                          className="h-full bg-galf-yellow transition-all duration-1000"
                          style={{ width: isPlaying ? '65%' : '0%' }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>{isPlaying ? '03:12' : '00:00'}</span>
                        <span>08:45</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Feature 12: Boîte à Sons Industriels (Soundboard) */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <Play className="text-galf-yellow w-5 h-5 fill-current" /> Boîte à Sons Pédagogiques
                </h2>
                <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                  Découvrez l'environnement sonore réel de cette machine en écoutant nos simulations acoustiques.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: 'engine', label: "Démarrage Moteur", desc: "Rumble diesel lourd", icon: "🚜" },
                    { key: 'beep', label: "Avertisseur Recul", desc: "Beep de sécurité", icon: "🔊" },
                    { key: 'hydraulic', label: "Hiss Hydraulique", desc: "Soupape de décharge", icon: "💨" },
                    { key: 'clank', label: "Bruit d'Échappement", desc: "Benne / Dent de godet", icon: "⚙️" }
                  ].map(sound => {
                    const isActive = activeSound === sound.key
                    return (
                      <button
                        key={sound.key}
                        onClick={() => handlePlaySound(sound.key)}
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden ${
                          isActive 
                            ? 'bg-galf-yellow/20 border-galf-yellow text-galf-yellow shadow-[0_0_15px_rgba(255,176,0,0.2)] scale-[0.98]' 
                            : 'bg-black/30 border-white/5 text-white/80 hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl">{sound.icon}</span>
                        <div>
                          <div className="text-xs font-black truncate">{sound.label}</div>
                          <div className="text-[9px] opacity-50 mt-0.5 truncate font-sans">{sound.desc}</div>
                        </div>
                        {isActive && (
                          <span className="absolute right-2 top-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-galf-yellow opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-galf-yellow" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </FadeIn>

            {/* AdSense — entre la boîte à sons et les modules de détails */}
            <AdBanner slot="formation_detail_mid" format="horizontal" />

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Target, title: "Objectifs", items: formation.objectives, check: true },
                { icon: Shield, title: "Prérequis", items: formation.prerequisites, check: false },
              ].map((sec, idx) => (
                <FadeIn key={idx} delay={0.1 * idx}>
                  <div className="glass-card p-8 rounded-2xl h-full border-galf-border">
                    <div className="flex items-center gap-3 mb-6">
                      <sec.icon className="w-6 h-6 text-galf-yellow" />
                      <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>{sec.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${sec.check ? 'text-galf-yellow' : 'text-gray-400'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}

              <FadeIn delay={0.2}>
                <div className="glass-card p-8 rounded-2xl h-full border-galf-border">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-galf-yellow" />
                    <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>Compétences</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formation.skills.map((s, i) => (
                      <span key={i} className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="glass-card p-8 rounded-2xl h-full border-galf-border">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="w-6 h-6 text-galf-yellow" />
                    <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>Débouchés</h3>
                  </div>
                  <ul className="space-y-3">
                    {formation.careers.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 font-bold text-sm" style={{ color: 'var(--galf-text)' }}>
                        <ArrowRight className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>

            {/* Feature 14: Test d'Éligibilité Prérequis */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <Shield className="text-galf-yellow w-5 h-5" /> Test Rapide d'Éligibilité
                </h2>
                <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                  Vérifiez en quelques clics si vous remplissez les conditions requises pour vous inscrire à cette formation certifiante.
                </p>

                <div className="space-y-4 font-sans">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-white/20 transition-all select-none">
                      <input
                        type="checkbox"
                        checked={eligAge}
                        onChange={(e) => setEligAge(e.target.checked)}
                        className="rounded border-white/10 bg-black/40 text-galf-yellow w-4 h-4 focus:ring-0 animate-fadeIn"
                      />
                      <span className="text-xs text-white font-bold leading-tight font-sans">Avoir 18 ans révolus</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-white/20 transition-all select-none">
                      <input
                        type="checkbox"
                        checked={eligLicense}
                        onChange={(e) => setEligLicense(e.target.checked)}
                        className="rounded border-white/10 bg-black/40 text-galf-yellow w-4 h-4 focus:ring-0 animate-fadeIn"
                      />
                      <span className="text-xs text-white font-bold leading-tight font-sans">Permis conduire (Auto/Poids lourd)</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-white/20 transition-all select-none">
                      <input
                        type="checkbox"
                        checked={eligAptitude}
                        onChange={(e) => setEligAptitude(e.target.checked)}
                        className="rounded border-white/10 bg-black/40 text-galf-yellow w-4 h-4 focus:ring-0 animate-fadeIn"
                      />
                      <span className="text-xs text-white font-bold leading-tight font-sans">Aptitude médicale conforme</span>
                    </label>
                  </div>

                  <button
                    onClick={handleCheckEligibility}
                    className="w-full bg-galf-yellow text-galf-carbon py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md cursor-pointer"
                  >
                    Vérifier mon éligibilité
                  </button>

                  {eligResult === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-center text-xs font-bold text-green-400 animate-fadeIn font-sans">
                      ✅ ÉLIGIBILITÉ CONFIRMÉE : Vous remplissez toutes les conditions pour vous inscrire à cette formation !
                    </div>
                  )}

                  {eligResult === 'fail' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center text-xs font-bold text-red-400 animate-fadeIn font-sans">
                      ❌ CONSEIL : Vous devez valider l'ensemble des critères ci-dessus (18 ans, permis et aptitude médicale) avant inscription.
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* ═══════════════════════════════════════════════
                NEW: TEST DE VISION & DISTANCE DE SÉCURITÉ
               ═══════════════════════════════════════════════ */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <Eye className="text-galf-yellow w-5 h-5" /> Estimateur de Distance de Sécurité
                </h2>
                <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                  Modélisez l'éloignement de votre engin par rapport aux obstacles (lignes électriques de 20kV, tranchées) pour tester les distances réglementaires.
                </p>

                <div className="space-y-6">
                  {/* Visual SVG representation */}
                  <div className="relative h-36 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-between px-8">
                    {/* Machine representation */}
                    <div className="flex flex-col items-center">
                      <div className="text-4xl">🚜</div>
                      <span className="text-[8px] font-bold text-white/40 uppercase mt-1">Engin</span>
                    </div>

                    {/* Distance zone indicator line */}
                    <div className="flex-1 px-4 relative flex flex-col justify-center">
                      <div className={`h-1.5 rounded-full w-full transition-all duration-300 ${
                        safetyDistance < 3 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                        safetyDistance < 7 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-slate-900 border border-white/10 px-2.5 py-0.5 rounded text-[10px] font-mono font-black text-white">
                        {safetyDistance} mètres
                      </div>
                    </div>

                    {/* Hazard representation */}
                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl animate-pulse">⚡</div>
                      <span className="text-[8px] font-bold text-red-500 uppercase mt-1">Ligne 20kV</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Distance de travail</span>
                      <span className="text-galf-yellow font-black">{safetyDistance} mètres</span>
                    </div>
                    <input 
                      type="range" min="1" max="15" step="0.5" value={safetyDistance}
                      onChange={(e) => {
                        setSafetyDistance(parseFloat(e.target.value));
                        triggerAudioClick();
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                    />
                  </div>

                  <div className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                    safetyDistance < 3 
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                      : safetyDistance < 7 
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                      : 'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    {safetyDistance < 3 && "🚨 ZONE CRITIQUE : Danger immédiat d'arc électrique ou de collision ! Gardez au moins 3m de distance réglementaire."}
                    {safetyDistance >= 3 && safetyDistance < 7 && "⚠️ ZONE DE VIGILANCE : Distance intermédiaire. Manœuvres à vitesse réduite sous surveillance étroite."}
                    {safetyDistance >= 7 && "✅ ZONE SÉCURISÉE : Distance de sécurité optimale pour les opérations standard."}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ═══════════════════════════════════════════════
                NEW: SIMULATEUR DE STABILITÉ & INCLINAISON
               ═══════════════════════════════════════════════ */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <ShieldAlert className="text-galf-yellow w-5 h-5" /> Stabilisateur &amp; Inclinaison d'Engin
                </h2>
                <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                  Modélisez l'angle de pente du sol (de 0° à 30°). Si la pente dépasse le seuil critique de 15°, l'alarme de basculement retentit automatiquement.
                </p>

                <div className="grid sm:grid-cols-2 gap-8 items-center">
                  {/* SVG Slope Indicator */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-center h-48 relative overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[140px] overflow-visible">
                      {/* Horizon */}
                      <line x1="5" y1="80" x2="95" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                      
                      {/* Tilted ground */}
                      <line 
                        x1="5" y1={80 + Math.sin(slopeAngle * Math.PI / 180) * 40} 
                        x2="95" y2={80 - Math.sin(slopeAngle * Math.PI / 180) * 40} 
                        stroke="#FFB000" strokeWidth="2.5" 
                        className="transition-all duration-300"
                      />

                      {/* Tilted Machine Silhouette */}
                      <g 
                        transform={`translate(50, 65) rotate(${slopeAngle})`} 
                        className="origin-center transition-all duration-300"
                      >
                        {/* Simple machine SVG representation */}
                        <rect x="-15" y="-12" width="30" height="15" fill="none" stroke="white" strokeWidth="2" rx="2" />
                        <rect x="-10" y="-22" width="18" height="10" fill="none" stroke="white" strokeWidth="1.5" rx="1" />
                        <circle cx="-10" cy="8" r="4" fill="none" stroke="white" strokeWidth="1.5" />
                        <circle cx="10" cy="8" r="4" fill="none" stroke="white" strokeWidth="1.5" />
                      </g>
                    </svg>

                    {slopeAngle > 15 && (
                      <div className="absolute inset-0 bg-red-600/10 border border-red-500/30 flex items-center justify-center animate-pulse z-10 pointer-events-none">
                        <span className="text-[10px] font-black uppercase text-red-500 tracking-widest px-2.5 py-1 bg-slate-950/90 border border-red-500/20 rounded-lg shadow-2xl">
                          🚨 Siren Activée
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-white/70">
                        <span>Pente latérale</span>
                        <span className="text-galf-yellow font-black">{slopeAngle}° Degrés</span>
                      </div>
                      <input 
                        type="range" min="0" max="30" value={slopeAngle}
                        onChange={(e) => {
                          setSlopeAngle(parseInt(e.target.value));
                          triggerAudioClick();
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>

                    <div className={`p-4 rounded-xl border text-xs font-bold leading-normal ${
                      slopeAngle > 15 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                        : 'bg-white/5 border-transparent text-white/60'
                    }`}>
                      {slopeAngle > 15 
                        ? "🚨 DANGER : Pente supérieure à 15° ! Alarme active. Risque critique de glissement ou de basculement de l'engin."
                        : "✓ STABILITÉ CONFORME : Inclinaison sous le seuil d'alerte. Veillez à garder les stabilisateurs ancrés."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ═══════════════════════════════════════════════
                NEW: CHECKLIST DIGITALE DE PRISE DE POSTE
               ═══════════════════════════════════════════════ */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <ClipboardCheck className="text-galf-yellow w-5 h-5" /> Checklist Digitale de Prise de Poste
                </h2>
                <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                  Validez les 5 points de contrôle obligatoires de sécurité avant de lancer le moteur diesel de votre engin.
                </p>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { key: 'fluids', label: "Vérifier les niveaux de fluides (huile, liquide, carburant)" },
                      { key: 'tires', label: "Inspecter les chenilles, pneus et vérins stabilisateurs" },
                      { key: 'leaks', label: "S'assurer de l'absence de fuite hydraulique sous l'engin" },
                      { key: 'horn', label: "Tester le klaxon et le signal d'alerte de recul sonore" },
                      { key: 'epi', label: "Porter ses EPI (Gilet jaune, casque de chantier, gants)" }
                    ].map((item) => (
                      <label 
                        key={item.key} 
                        className={`flex items-start gap-3 p-3.5 bg-black/20 rounded-xl border cursor-pointer hover:bg-black/40 transition-all select-none ${
                          checklist[item.key as keyof typeof checklist] ? 'border-galf-yellow/40 text-white' : 'border-white/5 text-white/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checklist[item.key as keyof typeof checklist]}
                          onChange={(e) => {
                            setChecklist(prev => ({ ...prev, [item.key]: e.target.checked }));
                            triggerAudioClick();
                          }}
                          className="rounded border-white/10 bg-black/40 text-galf-yellow w-4 h-4 focus:ring-0 mt-0.5"
                        />
                        <span className="font-bold leading-tight font-sans">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  {(() => {
                    const allChecked = Object.values(checklist).every(v => v === true);
                    return (
                      <div className="pt-2">
                        {isEngineStarted ? (
                          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-xs font-bold text-green-400 animate-fadeIn">
                            🔊 MOTEUR DIESEL DE L'ENGIN EN ROUTE ! Checklist validée, prêt pour les exercices pratiques.
                          </div>
                        ) : (
                          <button
                            disabled={!allChecked}
                            onClick={() => {
                              setIsEngineStarted(true);
                              handlePlaySound('engine');
                            }}
                            className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-galf-yellow/10"
                          >
                            Démarrer le moteur de la machine (Checklist requise)
                          </button>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </FadeIn>

            {/* ═══════════════════════════════════════════════
                NEW: COMPARATEUR DE SPÉCIFICATIONS DE MACHINES
               ═══════════════════════════════════════════════ */}
            <FadeIn>
              <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <ArrowUpDown className="text-galf-yellow w-5 h-5" /> Comparateur Spécifications Techniques
                </h2>
                <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                  Comparez les caractéristiques opérationnelles de cet engin avec les autres machines lourdes du parc GALF FORMATION.
                </p>

                <div className="space-y-6 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Engin de comparaison</label>
                    <select
                      value={compareSlug}
                      onChange={(e) => {
                        setCompareSlug(e.target.value);
                        triggerAudioClick();
                      }}
                      className="w-full sm:w-72 bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-galf-yellow"
                      style={{ colorScheme: 'light dark' }}
                    >
                      <option value="pelle-hydraulique">Pelle Hydraulique</option>
                      <option value="grue-tour">Grue à Tour</option>
                      <option value="bulldozer">Bulldozer D6</option>
                      <option value="chariot-elevateur">Chariot Élévateur</option>
                      <option value="forage-minier">Foreuse de Mine</option>
                    </select>
                  </div>

                  {(() => {
                    const currentSpecs = COMPARE_DB[formation.slug] || COMPARE_DB["pelle-hydraulique"];
                    const targetSpecs = COMPARE_DB[compareSlug];

                    return (
                      <div className="grid grid-cols-3 border border-white/5 rounded-2xl overflow-hidden bg-black/20 text-white/80">
                        {/* Headers */}
                        <div className="bg-black/40 p-3.5 font-bold border-r border-b border-white/5 uppercase text-white/40 text-[9px] tracking-wider">Critère</div>
                        <div className="bg-black/40 p-3.5 font-bold border-r border-b border-white/5 uppercase text-galf-yellow text-[9px] tracking-wider">Cet engin ({currentSpecs.name})</div>
                        <div className="bg-black/40 p-3.5 font-bold border-b border-white/5 uppercase text-white/60 text-[9px] tracking-wider">Engin comparé ({targetSpecs.name})</div>

                        {/* Weight */}
                        <div className="p-3 border-r border-b border-white/5 font-semibold text-white/50">Poids op.</div>
                        <div className="p-3 border-r border-b border-white/5 text-white font-bold">{currentSpecs.weight}</div>
                        <div className="p-3 border-b border-white/5">{targetSpecs.weight}</div>

                        {/* Power */}
                        <div className="p-3 border-r border-b border-white/5 font-semibold text-white/50">Puissance</div>
                        <div className="p-3 border-r border-b border-white/5 text-white font-bold">{currentSpecs.power}</div>
                        <div className="p-3 border-b border-white/5">{targetSpecs.power}</div>

                        {/* Capacity */}
                        <div className="p-3 border-r border-b border-white/5 font-semibold text-white/50">Capacité</div>
                        <div className="p-3 border-r border-b border-white/5 text-white font-bold">{currentSpecs.capacity}</div>
                        <div className="p-3 border-b border-white/5">{targetSpecs.capacity}</div>

                        {/* Boom */}
                        <div className="p-3 border-r border-b border-white/5 font-semibold text-white/50">Flèche / Bras</div>
                        <div className="p-3 border-r border-b border-white/5 text-white font-bold">{currentSpecs.boom}</div>
                        <div className="p-3 border-b border-white/5">{targetSpecs.boom}</div>

                        {/* CACES */}
                        <div className="p-3 border-r border-white/5 font-semibold text-white/50">Catégorie CACES</div>
                        <div className="p-3 border-r border-white/5 text-white font-bold">{currentSpecs.caces}</div>
                        <div className="p-3">{targetSpecs.caces}</div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-6">
              <BlocDocuments />
              <BlocDebouches slug={formation.slug} />
            </div>
          </div>

          {/* Price & Registration Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.5}>
              <div className="glass-card rounded-3xl p-8 sticky top-28 border-galf-yellow/20 border-galf-border">
                <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.2em] mb-4">Tarif de la formation</div>

                {formation.pricePromo ? (
                  <div className="mb-6">
                    <div className="text-4xl font-black text-galf-yellow">{formation.pricePromo.toLocaleString('fr-FR')} FCFA</div>
                    <div className="text-lg line-through" style={{ color: 'var(--galf-text-secondary)' }}>{formation.price.toLocaleString('fr-FR')} FCFA</div>
                    <div className="mt-2 inline-block bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-md animate-pulse">
                      REMISE : -{(formation.price - formation.pricePromo).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl font-black text-galf-yellow mb-6">{formation.price.toLocaleString('fr-FR')} FCFA</div>
                )}

                {/* ═══════════════════════════════════════════════
                    NEW: LIVE SEATS COUNTDOWN URGENCY INDICATOR
                   ═══════════════════════════════════════════════ */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-6 text-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Places disponibles
                    </span>
                    <span className="text-galf-yellow">{seatsReserved} / {totalSeats} Réservées</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-galf-yellow to-red-500 transition-all duration-1000"
                      style={{ width: `${(seatsReserved / totalSeats) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-red-400 font-bold block uppercase tracking-wider text-center animate-pulse">
                    Plus que {totalSeats - seatsReserved} places avant fermeture !
                  </span>
                </div>

                {/* Feature 13: Calculateur d'Échéancier de Paiement */}
                <div className="mb-6 pt-4 border-t border-white/10">
                  <label className="text-[10px] font-black uppercase text-galf-yellow tracking-wider block mb-2 font-sans">Options d'Échelonnement</label>
                  <div className="flex gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5 mb-3">
                    {(['1x', '3x', '6x'] as const).map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => { triggerAudioClick(); setPaymentTerm(term); }}
                        className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          paymentTerm === term
                            ? 'bg-galf-yellow text-galf-carbon'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const price = formation.pricePromo || formation.price
                    let detailText = ""
                    let perMonth = price

                    if (paymentTerm === '1x') {
                      detailText = "Payable à l'inscription (0% frais)"
                      perMonth = price
                    } else if (paymentTerm === '3x') {
                      perMonth = Math.round((price * 1.03) / 3)
                      detailText = `${perMonth.toLocaleString('fr-FR')} F / mois pendant 3 mois`
                    } else if (paymentTerm === '6x') {
                      perMonth = Math.round((price * 1.06) / 6)
                      detailText = `${perMonth.toLocaleString('fr-FR')} F / mois pendant 6 mois`
                    }

                    return (
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-white font-mono">{perMonth.toLocaleString('fr-FR')} F CFA</div>
                        <div className="text-[9px] text-white/50 mt-0.5 font-sans">{detailText}</div>
                      </div>
                    )
                  })()}
                </div>

                <div className="space-y-3 mb-8 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                  {["Paiement en plusieurs fois", "Supports de cours inclus", "Certificat de formation", "Accès plateforme e-learning"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {t}
                    </div>
                  ))}
                </div>

                <Link href="/inscription" className="block w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-xl text-center hover:brightness-110 transition-all mb-4 shadow-xl shadow-galf-yellow/10">
                  S'inscrire maintenant
                </Link>
                <a href="https://wa.me/2250711826507" className="block w-full glass-card font-bold py-4 rounded-xl text-center hover:border-galf-yellow/40 transition-all flex items-center justify-center gap-2 border-galf-border" style={{ color: 'var(--galf-text)' }}>
                  <Phone className="w-4 h-4" /> Appeler un conseiller
                </a>
              </div>
            </FadeIn>
          </div>
      </div>
    </div>

      <div className="container-galf mt-12 mb-16 relative z-10">
        <SeatTimeTracker slug={formation.slug} />
      </div>
      
      <FormationsSimilaires currentSlug={formation.slug} />
      
      <div id="formulaire-brochure-section">
        <FormulaireBrochure initialSlug={formation.slug} />
      </div>

      <StickyMobileCTA slug={formation.slug} price={formation.price} pricePromo={formation.pricePromo} />
    </div>
  )
}
