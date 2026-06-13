"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowLeft, ArrowRight, Clock, MapPin, BarChart3, BookOpen, Target, Briefcase, CheckCircle2, Phone, Shield, Play, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useState } from 'react'

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
          } catch(e) {}
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
    } catch(e) {}
    
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
      } catch(e) {}
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
    } catch(e) {}
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
    </div>
  )
}
