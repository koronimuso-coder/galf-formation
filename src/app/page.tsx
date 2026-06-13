"use client"
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, Trophy, Award, MapPin, Star, ChevronRight, Play, Clock, 
  Users, Factory, Settings, ChevronLeft, Pause, Sparkles, Shield, 
  TrendingUp, CheckCircle2, Calendar, User, Zap, RefreshCw, AlertCircle
} from 'lucide-react'
import { FadeIn, AnimatedCounter, MagneticHover, TextReveal } from '@/components/animations/FadeIn'
import { SplineHero } from '@/components/3d/SplineHero'
import { GALF_FORMATIONS } from '@/lib/data'
import { MachineSpecsModal } from '@/components/3d/MachineSpecsModal'
import { useState, useEffect } from 'react'
import { getFormationImage } from '@/lib/images'

export default function Home() {
  const [activeMachine, setActiveMachine] = useState<{slug: string, name: string, img: string} | null>(null)
  const featured = GALF_FORMATIONS.filter(f => f.featured).slice(0, 6)

  /* 🏗️ Engins BTP avec images HD */
  const equipmentImages = [
    { name: "Pelle Hydraulique", slug: "pelle-hydraulique", img: "/images/formations/pelle-hydraulique.png", cat: "Excavation", desc: "L'engin roi des chantiers de terrassement" },
    { name: "Grue à Tour", slug: "grue-tour", img: "/images/formations/grue-tour.png", cat: "Levage", desc: "La pièce maîtresse des constructions en hauteur" },
    { name: "Bulldozer D6", slug: "bulldozer", img: "/images/formations/bulldozer.png", cat: "Terrassement", desc: "La puissance brute du terrassement de masse" },
    { name: "Chariot Élévateur", slug: "chariot-elevateur", img: "/images/formations/chariot-elevateur.png", cat: "Manutention", desc: "Précision et sécurité en logistique" },
    { name: "Foreuse Minière", slug: "forage-minier", img: "/images/formations/forage-minier.png", cat: "Mines", desc: "Technologie de pointe pour l'extraction" },
    { name: "Tombereau Rigide", slug: "tombereau-rigide", img: "/images/formations/tombereau-rigide.png", cat: "Carrière", desc: "Le géant du transport de masse" },
    { name: "Grue Mobile", slug: "grue-mobile", img: "/images/formations/grue-mobile.png", cat: "Levage", desc: "Flexibilité et puissance de levage mobile" },
    { name: "Compacteur", slug: "compacteur", img: "/images/formations/compacteur.png", cat: "Routes", desc: "Finition et densification des sols" },
  ]

  // 1. Operator Testimonials Carousel States
  const testimonials = [
    { name: "Kouadio Jean", role: "Opérateur Pelle Hydraulique", company: "SOGEA-SATOM CI", salary: "+60% Salaire", content: "Grâce à GALF, j'ai pu passer de simple aide-ouvrier à conducteur certifié en 3 mois. La pratique sur simulateur 3D et engins réels fait toute la différence.", rating: 5, initial: "K" },
    { name: "Sylla Mariam", role: "Conductrice Grue Mobile", company: "Port Autonome d'Abidjan", salary: "Intégration Directe", content: "Le centre de formation GALF offre un accompagnement exceptionnel. Les instructeurs sont très attentifs et la grue mobile sur le plateau technique d'Abidjan est de dernière génération.", rating: 5, initial: "S" },
    { name: "Bamba Drissa", role: "Opérateur Foreuse de Mine", company: "Randgold Resources", salary: "+85% Salaire", content: "La formation Forage Minier à San Pedro est une référence absolue. Dès la fin de mon stage, j'ai signé un CDI pour travailler sur un gisement d'or.", rating: 5, initial: "B" }
  ]
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlayingTestimonials, setIsPlayingTestimonials] = useState(true)

  // Autoplay Testimonials
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlayingTestimonials) {
      interval = setInterval(() => {
        setActiveSlide(prev => (prev + 1) % testimonials.length)
      }, 4500)
    }
    return () => clearInterval(interval)
  }, [isPlayingTestimonials])

  // 2. Career Path Timeline States
  const [activeTimelineStep, setActiveTimelineStep] = useState(0)
  const careerSteps = [
    {
      title: "Orientation & Inscription",
      duration: "1 Semaine",
      badge: "Entrée",
      reward: "📋 Diagnostic d'Aptitude Métier",
      desc: "Analyse de vos objectifs, sélection de la spécialité (Terrassement, Levage ou Mine) et validation de l'aptitude physique et de sécurité obligatoire."
    },
    {
      title: "Simulateur 3D Immersif",
      duration: "2 Semaines",
      badge: "Virtuel",
      reward: "🎮 Badge Pilote Virtuel",
      desc: "Apprentissage des commandes en cabine simulée. Vous effectuez 10 heures d'exercices de précision avant d'approcher un engin de chantier réel."
    },
    {
      title: "Conduite Terrain Intensive",
      duration: "4 Semaines",
      badge: "Réel",
      reward: "🏗️ Brevet Conduite Pratique",
      desc: "80% de pratique. Manipulation directe sur le plateau technique. Terrassement, levage de charges ou creusement de tranchées en conditions réelles."
    },
    {
      title: "Sécurité & HSE Avancé",
      duration: "1 Semaine",
      badge: "Sécurité",
      reward: "🪖 Certificat de Sécurité Chantier",
      desc: "Maîtrise des protocoles de balisage, des gestes de guidage de grue et d'extinction d'incendies. La sécurité est notre priorité absolue."
    },
    {
      title: "Examen d'État & Diplôme",
      duration: "3 Jours",
      badge: "Attestation",
      reward: "🎓 Certificat GALF / CACES Agréé",
      desc: "Évaluation théorique sous forme de QCM et examen pratique chronométré devant un jury d'instructeurs agréés par le Ministère de l'Enseignement Technique."
    },
    {
      title: "Accompagnement B2B",
      duration: "Suivi continu",
      badge: "Emploi",
      reward: "💼 Recommandation Entreprises",
      desc: "Mise en relation avec notre réseau de plus de 50 entreprises partenaires (BTP, mines, ports). Optimisation de votre CV et préparation aux entretiens."
    }
  ]

  // 3. Live Stats Data & Activity Feed
  const [liveStudents, setLiveStudents] = useState(1534)
  const [liveEventText, setLiveEventText] = useState("Un nouvel opérateur vient d'être diplômé à Abidjan (Grue)")

  useEffect(() => {
    // Simulate real-time counter changes
    const interval = setInterval(() => {
      setLiveStudents(prev => prev + 1)
      const events = [
        "Un nouvel opérateur vient d'être diplômé à Abidjan (Grue à Tour)",
        "Nouveau partenariat signé avec SMB Côte d'Ivoire !",
        "Un apprenant vient de valider 100% sur le simulateur Pelle Hydraulique",
        "Session d'examen pratique ouverte à San Pedro",
        "Acompte reçu et inscription validée pour un opérateur minier"
      ]
      setLiveEventText(events[Math.floor(Math.random() * events.length)])
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // 4. Center Tour Booking States
  const [selectedCenter, setSelectedCenter] = useState<'abidjan' | 'sanpedro'>('abidjan')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookedPassId, setBookedPassId] = useState('')

  const availableDays = [15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27] // June 2026 days
  const timeSlots = [
    { time: "09h00 - 10h30", status: "Disponible" },
    { time: "11h00 - 12h30", status: "1 place restante" },
    { time: "14h00 - 15h30", status: "Disponible" },
    { time: "16h00 - 17h30", status: "Complet" }
  ]

  // ── Wave 5: Homepage Interactive Feature States ──
  const [recomStep, setRecomStep] = useState(0)
  const [recomAnswers, setRecomAnswers] = useState({ env: '', style: '', interest: '' })
  
  const [estPrice, setEstPrice] = useState(650000)
  const [estAcompte, setEstAcompte] = useState(30)
  const [estMonths, setEstMonths] = useState(3)

  const [hoveredSalaryIdx, setHoveredSalaryIdx] = useState<number | null>(null)

  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [quizDone, setQuizDone] = useState(false)

  const playQuizSound = (type: 'correct' | 'wrong' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'correct') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(659.25, now + 0.1)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'wrong') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(150, now)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, now)
        gain.gain.setValueAtTime(0.015, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
      }
      setTimeout(() => ctx.close(), 400)
    } catch (e) {}
  }

  const handleRecomAnswer = (key: 'env' | 'style' | 'interest', value: string) => {
    playQuizSound('click')
    setRecomAnswers(prev => ({ ...prev, [key]: value }))
    setRecomStep(prev => prev + 1)
  }

  const getRecomResult = () => {
    const { env, style } = recomAnswers
    if (env === 'mines') {
      return {
        name: "Conducteur d'Engins Miniers",
        desc: "Foreuses de mines et Tombereaux rigides géants. Vous êtes taillé pour la puissance extrême et les carrières à ciel ouvert.",
        slug: "forage-minier",
        caces: "Catégorie E",
        price: 850000
      }
    }
    if (style === 'heights' || env === 'levage') {
      return {
        name: "Opérateur de Levage (Grutier)",
        desc: "Grues à tour et Grues mobiles. Pour ceux qui aiment la hauteur, la précision millimétrique et la coordination visuelle.",
        slug: "grue-tour",
        caces: "CACES R487 / R483",
        price: 750000
      }
    }
    if (style === 'precision') {
      return {
        name: "Conducteur de Chariot Élévateur",
        desc: "Chariots élévateurs et manutention en entrepôt. Idéal pour ceux qui préfèrent le travail indoor, la logistique et la gestion de stocks.",
        slug: "chariot-elevateur",
        caces: "CACES R489 (Catégories 3 & 5)",
        price: 350000
      }
    }
    return {
      name: "Opérateur Pelle Hydraulique & Bulldozer",
      desc: "Terrassement et travaux routiers. Le cœur battant des chantiers de construction urbains et ruraux.",
      slug: "pelle-hydraulique",
      caces: "CACES R482 Catégorie B1",
      price: 650000
    }
  }

  const quizQuestions = [
    {
      q: "Quel est le premier réflexe de sécurité avant de monter en cabine ?",
      options: [
        "Faire le tour de l'engin pour vérifier l'absence d'obstacles (VGP visuelle)",
        "Démarrer le moteur directement pour faire chauffer l'huile",
        "Klaxonner deux fois sans regarder autour"
      ],
      correct: 0,
      tip: "Le tour de sécurité (walk-around) permet de détecter des fuites ou des obstacles au sol."
    },
    {
      q: "Dans quelle condition la stabilité d'un engin lourd est-elle compromise ?",
      options: [
        "Sur un sol plat stabilisé",
        "Sur une pente supérieure à 15% (ou 15 degrés)",
        "Lorsque le godet est posé à terre"
      ],
      correct: 1,
      tip: "Une inclinaison excessive modifie le centre de gravité et risque de renverser la machine."
    },
    {
      q: "Que signifie le fait de croiser les deux bras au-dessus de la tête ?",
      options: [
        "Lever la grue au maximum",
        "Arrêt d'urgence immédiat !",
        "Faire tourner le moteur au ralenti"
      ],
      correct: 1,
      tip: "Les bras croisés au-dessus de la tête est le signal international d'arrêt d'urgence."
    }
  ]

  // Web Audio for Reservation
  const playBookingSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      
      // Triple chord
      const freqs = [330, 440, 554]
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(f, now + idx * 0.05)
        gain.gain.setValueAtTime(0.03, now + idx * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.05)
        osc.stop(now + idx * 0.05 + 0.3)
      })
      setTimeout(() => ctx.close(), 500)
    } catch (e) {}
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDay || !selectedSlot || !visitorName || !visitorPhone) return

    playBookingSound()
    setBookedPassId(`GALF-VIS-${Math.floor(1000 + Math.random() * 9000)}`)
    setBookingConfirmed(true)
  }

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════
          HERO — Industrial Spline 3D Cinematic
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[110vh] flex items-center overflow-hidden" style={{ background: '#0e0e10' }}>
        {/* Spline 3D Industrial Scene */}
        <SplineHero />

        {/* Content overlay */}
        <div className="container-galf relative z-50 pt-24 pb-20">
          <div className="max-w-4xl">
            <FadeIn delay={0.6}>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8 hero-badge-industrial">
                <Factory className="w-4 h-4" />
                L&apos;Élite de la Formation BTP &amp; Mines — Afrique de l&apos;Ouest
              </div>
            </FadeIn>

            <TextReveal 
              text="DOMINEZ LA PUISSANCE DES GÉANTS DE FER" 
              className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 hero-title-industrial" 
              delay={0.8}
            />

            <FadeIn delay={1.0}>
              <p className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed hero-subtitle-industrial">
                GALF FORMATION forge les experts de demain. Accédez à une <strong className="text-white font-bold">expertise d&apos;élite certifiée par l&apos;État</strong> sur des équipements de pointe pour conquérir les chantiers les plus ambitieux.
              </p>
            </FadeIn>

            <FadeIn delay={1.3} className="flex flex-col sm:flex-row gap-6">
              <MagneticHover>
                <Link href="/inscription" className="hero-cta-primary px-12 py-5 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3">
                  Propulsez votre carrière <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticHover>
              <Link href="/formations" className="hero-cta-secondary px-12 py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Nos parcours certifiants
              </Link>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator — industrial themed */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="text-[10px] uppercase tracking-[0.5em] font-black text-galf-yellow/50">Découvrir</div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-galf-yellow/70 via-galf-yellow/30 to-transparent scroll-indicator-pulse" />
        </div>

        {/* Industrial achievement markers */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
          {['TECHNOLOGIE 3D', 'EXPERTISE MÉTIER', 'CERTIFICATION ÉTAT', 'INSERTION DIRECTE'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 opacity-30 hover:opacity-70 transition-opacity">
              <div className="w-4 h-[1px] bg-galf-yellow/50" />
              <span className="text-[9px] font-mono text-galf-yellow/60">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ INDUSTRIAL DIVIDER ═══ */}
      <div className="industrial-divider" />

      {/* ═══ TRUST BAR (PARTNERS) ═══ */}
      <section className="py-12 relative z-20" style={{ background: 'var(--galf-bg)', borderBottom: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <div className="text-[10px] uppercase tracking-[0.4em] font-black text-center mb-8 opacity-40" style={{ color: 'var(--galf-text)' }}>Ils nous font confiance</div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>SMB</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>GESTOCI</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>BTP-CI</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>MINES-SA</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>AFRIQUE-PESAGE</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. LIVE SVG STATS DASHBOARD (NEW FEATURE 19)
         ═══════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)', borderBottom: '1px solid var(--galf-border)' }}>
        <div className="absolute inset-0 bg-diagonal" />
        <div className="container-galf relative z-10">
          
          {/* Live Activity Feed Ribbon */}
          <div className="mb-12 bg-black/5 dark:bg-black/60 border border-[var(--galf-border)] rounded-2xl py-3 px-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--galf-text-secondary)]">Mises à jour en direct :</span>
            </div>
            <p className="text-xs font-semibold animate-fadeIn flex-1 text-[var(--galf-text)]" key={liveEventText}>
              {liveEventText}
            </p>
            <div className="text-[9px] font-bold text-galf-yellow bg-galf-yellow/10 border border-galf-yellow/20 px-2 py-0.5 rounded uppercase">
              Chantier-École
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1: 98% Success */}
            <FadeIn delay={0.1} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative group">
              <div className="relative w-24 h-24 mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path className="text-black/5 dark:text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-galf-yellow transition-all duration-1000" strokeDasharray="98, 100" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-[var(--galf-text)]">98%</span>
                </div>
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[var(--galf-text)]">
                <Trophy className="w-4 h-4 text-galf-yellow" /> Taux de réussite
              </h3>
              <p className="text-[11px] leading-relaxed text-[var(--galf-text-secondary)]">Sur examen de conduite et théorie réglementaire.</p>
            </FadeIn>

            {/* Stat 2: 1530+ Certifies */}
            <FadeIn delay={0.2} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative group">
              <div className="relative w-24 h-24 mb-4 flex items-center justify-center bg-galf-yellow/5 rounded-full border border-galf-yellow/15 group-hover:scale-105 transition-transform">
                <Users className="w-10 h-10 text-galf-yellow animate-pulse" />
              </div>
              <h3 className="text-2xl font-black mb-1 text-[var(--galf-text)]">
                {liveStudents}
              </h3>
              <p className="text-xs font-black text-galf-yellow uppercase tracking-widest mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-galf-yellow" /> Opérateurs Formés
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--galf-text-secondary)]">Compteur live actualisé en direct.</p>
            </FadeIn>

            {/* Stat 3: 19 Parcours */}
            <FadeIn delay={0.3} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative group">
              <div className="relative w-24 h-24 mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path className="text-black/5 dark:text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-galf-yellow/80" strokeDasharray="75, 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-[var(--galf-text)]">19</span>
                </div>
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[var(--galf-text)]">
                <Award className="w-4 h-4 text-galf-yellow" /> Spécialités
              </h3>
              <p className="text-[11px] leading-relaxed text-[var(--galf-text-secondary)]">Formations certifiantes reconnues par l'État.</p>
            </FadeIn>

            {/* Stat 4: 50+ Partners */}
            <FadeIn delay={0.4} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative group">
              <div className="relative w-24 h-24 mb-4 flex items-center justify-center bg-galf-yellow/5 rounded-full border border-galf-yellow/15 group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-10 h-10 text-galf-yellow" />
              </div>
              <h3 className="text-2xl font-black mb-1 text-[var(--galf-text)]">50+</h3>
              <p className="text-xs font-black text-galf-yellow uppercase tracking-widest mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-galf-yellow text-galf-yellow" /> Entreprises
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--galf-text-secondary)]">Partenariats actifs de recrutement.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NOS ENGINS BTP — 3D Gallery with REAL images
         ═══════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Parc de machines</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6" style={{ color: 'var(--galf-text)' }}>
                Nos engins <span className="text-galf-yellow">BTP en 3D</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>
                Formez-vous sur des machines professionnelles dans des conditions réelles de chantier.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentImages.map((eq, i) => {
              return (
                <FadeIn key={i} delay={0.1 * i}>
                  <div className="perspective-container" onClick={() => setActiveMachine({ slug: eq.slug, name: eq.name, img: eq.img })}>
                    <div className="card-3d group relative h-[340px] rounded-xl overflow-hidden cursor-pointer" style={{ border: '1px solid var(--galf-border)' }}>
                      <Image 
                        src={eq.img} 
                        alt={eq.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <div className="text-[10px] text-galf-yellow font-bold uppercase tracking-[0.3em] mb-1">{eq.cat}</div>
                        <h3 className="text-xl font-black text-white mb-1">{eq.name}</h3>
                        <p className="text-xs text-white/70">{eq.desc}</p>
                      </div>
                      <div className="absolute inset-0 bg-galf-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-galf-yellow/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                          <Play className="w-6 h-6 text-galf-carbon ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ FORMATIONS PHARES ═══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <div>
                <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Catalogue</div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                  Nos formations <span className="text-galf-yellow">phares</span>
                </h2>
              </div>
              <Link href="/formations" className="mt-6 md:mt-0 text-sm font-bold text-galf-yellow hover:underline flex items-center gap-2 uppercase tracking-widest">
                Voir les 19 formations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((f, i) => (
              <FadeIn key={f.id} delay={0.1 * i}>
                <Link href={`/formations/${f.slug}`} className="group block h-full">
                  <div className="glass-card rounded-xl overflow-hidden h-full hover:border-galf-yellow/30 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                    <div className="h-52 relative overflow-hidden shrink-0">
                      <Image 
                        src={getFormationImage(f.slug)} 
                        alt={f.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      {f.pricePromo && <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-black uppercase rounded-md animate-pulse">Promo</div>}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{f.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-black mb-2 group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{f.name}</h3>
                      <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: 'var(--galf-text-secondary)' }}>{f.shortDesc}</p>
                      <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--galf-text-muted)' }}>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.city}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--galf-border)' }}>
                        <div>
                          {f.pricePromo ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-galf-yellow">{f.pricePromo.toLocaleString('fr-FR')} F</span>
                              <span className="text-sm line-through" style={{ color: 'var(--galf-text-muted)' }}>{f.price.toLocaleString('fr-FR')}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-black text-galf-yellow">{f.price.toLocaleString('fr-FR')} F</span>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-galf-yellow group-hover:border-galf-yellow transition-colors" style={{ border: '1px solid var(--galf-border)' }}>
                          <ArrowRight className="w-4 h-4 group-hover:text-galf-carbon transition-colors" style={{ color: 'var(--galf-text-muted)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. CAREER TIMELINE EXPLORER (NEW FEATURE 18)
         ═══════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4 block">Parcours d'apprentissage</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-[var(--galf-text)]">
                De l'inscription <span className="text-galf-yellow">à l'emploi</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto text-[var(--galf-text-secondary)]">
                Découvrez les étapes clés de votre formation et les compétences certifiées à chaque jalon de votre carrière.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Steps Navigator */}
            <div className="lg:col-span-5 space-y-3">
              {careerSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTimelineStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    activeTimelineStep === idx 
                      ? 'bg-galf-yellow/10 border-galf-yellow/40 shadow-lg glow-yellow'
                      : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-sm transition-colors ${
                      activeTimelineStep === idx ? 'bg-galf-yellow text-galf-carbon' : 'bg-black/10 dark:bg-white/10 text-[var(--galf-text-secondary)]'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-[var(--galf-text)]">{step.title}</h4>
                      <span className="text-[10px] text-[var(--galf-text-muted)] font-bold uppercase tracking-wider">{step.duration}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                    activeTimelineStep === idx ? 'bg-galf-yellow/20 text-galf-yellow border-galf-yellow/30' : 'bg-black/5 dark:bg-white/5 text-[var(--galf-text-muted)] border-black/5 dark:border-white/5'
                  }`}>
                    {step.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Step Detail Display Panel */}
            <div className="lg:col-span-7">
              <div className="glass-card p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden h-full min-h-[380px] flex flex-col justify-between bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,176,0,0.03),transparent)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[8rem]" />
                
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-galf-yellow tracking-widest mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Focus Étape {activeTimelineStep + 1} / {careerSteps.length}</span>
                  </div>

                  <h3 className="text-3xl font-black mb-6 uppercase tracking-tight text-[var(--galf-text)]">
                    {careerSteps[activeTimelineStep].title}
                  </h3>

                  <p className="text-sm leading-relaxed font-semibold mb-8 text-[var(--galf-text-secondary)]">
                    {careerSteps[activeTimelineStep].desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--galf-border)] flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <span className="text-[10px] text-[var(--galf-text-muted)] font-black uppercase tracking-wider block mb-1">Récompense / Jalon débloqué :</span>
                    <span className="text-sm font-black text-galf-yellow flex items-center gap-2">
                      {careerSteps[activeTimelineStep].reward}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[var(--galf-text-muted)] font-bold uppercase tracking-wider">Durée :</span>
                    <span className="text-xs font-black bg-black/5 dark:bg-white/5 text-[var(--galf-text)] px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                      {careerSteps[activeTimelineStep].duration}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          1. CAROUSEL OF TESTIMONIALS (NEW FEATURE 17)
         ═══════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden bg-diagonal" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4 block">Avis certifiés</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--galf-text)]">
                Ils ont <span className="text-galf-yellow">réussi avec nous</span>
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto relative">
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 glow-yellow min-h-[320px] flex flex-col justify-between">
              
              <div className="flex items-start justify-between gap-6 mb-8">
                <div className="flex gap-1.5">
                  {[...Array(testimonials[activeSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-galf-yellow fill-galf-yellow" />
                  ))}
                </div>
                
                {/* Autoplay Play/Pause */}
                <button
                  onClick={() => setIsPlayingTestimonials(!isPlayingTestimonials)}
                  className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[var(--galf-text-secondary)] hover:text-[var(--galf-text)] transition-all"
                  title={isPlayingTestimonials ? "Pause Autoplay" : "Démarrer Autoplay"}
                >
                  {isPlayingTestimonials ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Slide text with key triggers transition */}
              <div className="mb-10 animate-fadeIn" key={activeSlide}>
                <p className="italic text-base md:text-lg leading-relaxed font-medium text-[var(--galf-text)]">
                  "{testimonials[activeSlide].content}"
                </p>
              </div>

              {/* Avatar and company metadata */}
              <div className="pt-6 border-t border-[var(--galf-border)] flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-galf-yellow text-galf-carbon flex items-center justify-center font-black text-lg">
                    {testimonials[activeSlide].initial}
                  </div>
                  <div>
                    <h4 className="font-black text-[var(--galf-text)]">{testimonials[activeSlide].name}</h4>
                    <span className="text-xs text-[var(--galf-text-muted)] font-bold">{testimonials[activeSlide].role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-lg text-[var(--galf-text-secondary)]">
                    {testimonials[activeSlide].company}
                  </span>
                  <span className="text-xs font-black text-galf-yellow bg-galf-yellow/10 border border-galf-yellow/20 px-3 py-1.5 rounded-lg">
                    {testimonials[activeSlide].salary}
                  </span>
                </div>
              </div>

            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setActiveSlide(prev => (prev - 1 + testimonials.length) % testimonials.length)
                  setIsPlayingTestimonials(false)
                }}
                className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--galf-text-secondary)] hover:text-[var(--galf-text)] flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSlide(idx)
                      setIsPlayingTestimonials(false)
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeSlide === idx ? 'bg-galf-yellow w-8' : 'bg-black/20 dark:bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveSlide(prev => (prev + 1) % testimonials.length)
                  setIsPlayingTestimonials(false)
                }}
                className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--galf-text-secondary)] hover:text-[var(--galf-text)] flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-32 relative overflow-hidden bg-diagonal" style={{ background: 'var(--galf-bg)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div className="sticky top-32">
                <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Questions fréquentes</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6" style={{ color: 'var(--galf-text)' }}>
                  Tout ce qu'il faut <span className="text-galf-yellow">savoir</span>
                </h2>
                <p className="max-w-md mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
                  Vous avez des questions sur nos formations, les tarifs ou les certificats ? Retrouvez les réponses ici ou contactez-nous directement.
                </p>
                <Link href="/faq" className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
                  Consulter le centre d'aide <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {[
                  { q: "Quelles sont les conditions d'admission ?", a: "Il n'y a pas de prérequis académique strict pour la plupart de nos formations. Cependant, savoir lire et écrire est essentiel pour la partie théorique. Un test d'aptitude médicale est requis." },
                  { q: "Comment se déroule le paiement ?", a: "Nous proposons des facilités de paiement flexibles. Un acompte de 30% est requis à l'inscription, et le solde peut être versé en 2 ou 3 mensualités." },
                  { q: "Le certificat GALF est-il reconnu ?", a: "Oui, GALF est un centre agréé par l'État. Nos certificats sont reconnus par les grandes entreprises du BTP et des Mines en Côte d'Ivoire et dans la sous-région." },
                  { q: "Proposez-vous des stages après la formation ?", a: "Grâce à notre réseau de plus de 50 partenaires, nous facilitons l'insertion de nos apprenants. Les meilleurs noms de chaque promotion sont souvent recommandés." },
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-xl hover:border-galf-yellow/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="font-black text-sm" style={{ color: 'var(--galf-text)' }}>{item.q}</h3>
                       <ChevronRight className="w-4 h-4 text-galf-yellow group-hover:rotate-90 transition-transform" />
                    </div>
                    <p className="text-xs leading-relaxed opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500 overflow-hidden" style={{ color: 'var(--galf-text-secondary)' }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. PLANIFICATEUR DE VISITE DE CENTRE (FEATURE 20)
         ═══════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4 block">Réservation guidée</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--galf-text)]">
                Planifier une <span className="text-galf-yellow">visite du centre</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto mt-3 text-[var(--galf-text-secondary)]">
                Venez découvrir nos plateaux techniques de formation, inspecter les engins réels et assister à une démonstration en direct.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-5xl mx-auto">
            {bookingConfirmed ? (
              <FadeIn>
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-galf-yellow/30 bg-galf-yellow/5 text-center max-w-2xl mx-auto relative overflow-hidden glow-yellow">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/10 rounded-bl-[8rem]" />
                  <CheckCircle2 className="w-16 h-16 text-galf-yellow mx-auto mb-6 animate-bounce" />
                  
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--galf-text)]">Visite planifiée avec succès !</h3>
                  <p className="text-xs mt-2 max-w-md mx-auto text-[var(--galf-text-secondary)]">
                    Votre pass d'accès est généré. Notre équipe commerciale vous contactera pour valider les consignes de sécurité.
                  </p>

                  {/* Boarding Pass Ticket */}
                  <div className="my-8 p-6 bg-black/5 dark:bg-black/60 rounded-3xl border border-black/10 dark:border-white/10 text-left space-y-4 max-w-md mx-auto relative">
                    <div className="flex justify-between items-center border-b border-[var(--galf-border)] pb-4">
                      <div>
                        <span className="text-[9px] font-black uppercase block text-[var(--galf-text-muted)]">Site choisi :</span>
                        <span className="text-xs font-black uppercase text-[var(--galf-text)]">
                          {selectedCenter === 'abidjan' ? "Centre d'Abidjan (Yopougon)" : "Centre de San Pedro"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase block text-[var(--galf-text-muted)]">Ticket N° :</span>
                        <span className="text-xs font-mono font-black text-galf-yellow">{bookedPassId}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-bold block text-[var(--galf-text-muted)]">Visiteur :</span>
                        <span className="text-xs font-black text-[var(--galf-text)]">{visitorName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold block text-[var(--galf-text-muted)]">Téléphone :</span>
                        <span className="text-xs font-black text-[var(--galf-text)]">{visitorPhone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-[9px] font-bold block text-[var(--galf-text-muted)]">Date prévue :</span>
                        <span className="text-xs font-black text-[var(--galf-text)]">{selectedDay} Juin 2026</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold block text-[var(--galf-text-muted)]">Créneau horaire :</span>
                        <span className="text-xs font-black text-galf-yellow">{selectedSlot}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--galf-border)] flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-red-500 dark:text-red-400 font-bold block">🛡️ Consignes obligatoires :</span>
                        <span className="text-[8px] block text-[var(--galf-text-secondary)]">• Chaussures fermées / EPI recommandés</span>
                        <span className="text-[8px] block text-[var(--galf-text-secondary)]">• Pièce d'identité requise à l'accueil</span>
                      </div>
                      
                      {/* Mock QR Code */}
                      <svg viewBox="0 0 50 50" className="w-12 h-12 bg-white p-1 rounded-md shrink-0">
                        <rect x="2" y="2" width="10" height="10" fill="black" />
                        <rect x="38" y="2" width="10" height="10" fill="black" />
                        <rect x="2" y="38" width="10" height="10" fill="black" />
                        <rect x="18" y="18" width="14" height="14" fill="black" />
                        <rect x="6" y="22" width="4" height="4" fill="black" />
                        <rect x="38" y="38" width="6" height="6" fill="black" />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingConfirmed(false)
                      setSelectedDay(null)
                      setSelectedSlot(null)
                      setVisitorName('')
                      setVisitorPhone('')
                    }}
                    className="text-xs font-black text-galf-yellow uppercase hover:underline"
                  >
                    Planifier une autre visite
                  </button>
                </div>
              </FadeIn>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Panel: Calendar Grid & Slots */}
                <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-[2rem] space-y-6">
                  {/* Site Tabs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCenter('abidjan')
                        setSelectedSlot(null)
                      }}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${
                        selectedCenter === 'abidjan'
                          ? 'bg-galf-yellow text-galf-carbon border-galf-yellow'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--galf-text-secondary)] border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      Plateau Abidjan
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCenter('sanpedro')
                        setSelectedSlot(null)
                      }}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${
                        selectedCenter === 'sanpedro'
                          ? 'bg-galf-yellow text-galf-carbon border-galf-yellow'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--galf-text-secondary)] border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      Plateau San Pedro
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider mb-3 text-[var(--galf-text-muted)]">Sélecteur de Date — Juin 2026</h4>
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black mb-2 text-[var(--galf-text-muted)]">
                      <span>LU</span><span>MA</span><span>ME</span><span>JE</span><span>VE</span><span>SA</span><span>DI</span>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1.5">
                      {/* Blank spaces for calendar layout */}
                      {[...Array(0)].map((_, i) => <div key={i} />)}
                      
                      {[...Array(30)].map((_, i) => {
                        const dayNum = i + 1
                        const isAvailable = availableDays.includes(dayNum)
                        return (
                          <button
                            key={i}
                            disabled={!isAvailable}
                            type="button"
                            onClick={() => {
                              setSelectedDay(dayNum)
                              setSelectedSlot(null)
                            }}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                              !isAvailable ? 'text-black/10 dark:text-white/10 bg-transparent cursor-not-allowed' :
                              selectedDay === dayNum ? 'bg-galf-yellow text-galf-carbon font-black shadow-lg scale-105' :
                              'bg-black/5 dark:bg-white/5 text-[var(--galf-text)] border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/15'
                            }`}
                          >
                            <span>{dayNum}</span>
                            {isAvailable && selectedDay !== dayNum && (
                              <span className="w-1 h-1 bg-galf-yellow rounded-full absolute bottom-1.5" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Slot selector */}
                  {selectedDay && (
                    <div className="space-y-3 animate-fadeIn">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--galf-text-secondary)]">Créneaux horaires pour le {selectedDay} Juin :</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {timeSlots.map((slot, idx) => {
                          const isFull = slot.status === "Complet"
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isFull}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                isFull ? 'bg-transparent border-black/5 dark:border-white/5 opacity-40 cursor-not-allowed' :
                                selectedSlot === slot.time ? 'bg-galf-yellow/15 border-galf-yellow text-[var(--galf-text)] glow-yellow' :
                                'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:bg-white/20'
                              }`}
                            >
                              <span className="text-xs font-black text-[var(--galf-text)]">{slot.time}</span>
                              <span className={`text-[9px] font-bold mt-1 ${isFull ? 'text-red-400' : 'text-galf-yellow/70'}`}>
                                {slot.status}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Panel: Booking Credentials */}
                <div className="lg:col-span-5">
                  <div className="glass-card p-6 md:p-8 rounded-[2rem] h-full flex flex-col justify-between min-h-[300px]">
                    {!selectedDay || !selectedSlot ? (
                      <div className="my-auto text-center space-y-3 p-6 text-[var(--galf-text-muted)]">
                        <Calendar className="w-10 h-10 mx-auto opacity-30" />
                        <h4 className="text-xs font-black uppercase tracking-wider">Formulaire de réservation</h4>
                        <p className="text-[10px] max-w-xs mx-auto leading-relaxed">
                          Sélectionnez un jour disponible puis un créneau horaire sur le calendrier pour pouvoir finaliser votre visite guidée.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="border-b border-[var(--galf-border)] pb-4 mb-4">
                          <span className="text-[10px] text-[var(--galf-text-muted)] font-bold uppercase block">Visite planifiée le :</span>
                          <span className="text-sm font-black text-galf-yellow uppercase">
                            Le {selectedDay} Juin 2026 à {selectedSlot}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--galf-text-secondary)]">
                            Nom &amp; Prénom
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Votre nom complet"
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                            className="w-full bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-[var(--galf-text)] outline-none focus:border-galf-yellow"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--galf-text-secondary)]">
                            Numéro de téléphone
                          </label>
                          <input
                            required
                            type="tel"
                            placeholder="Ex: +225 07 11 82 65 07"
                            value={visitorPhone}
                            onChange={(e) => setVisitorPhone(e.target.value)}
                            className="w-full bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-[var(--galf-text)] outline-none focus:border-galf-yellow"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-galf-yellow/10 flex items-center justify-center gap-2 mt-4"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirmer ma visite
                        </button>
                      </form>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ORIENTATIONS & FINANCEMENT INTERACTIF (FEATURES 81-84)
         ═══════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4 block">Conseils et simulations</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ color: 'var(--galf-text)' }}>
                Espace <span className="text-galf-yellow">Carrière &amp; Financement</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto mt-3" style={{ color: 'var(--galf-text-secondary)' }}>
                Trouvez la formation idéale, estimez vos mensualités de paiement et évaluez vos réflexes de sécurité en quelques clics.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            
            {/* COLUMN 1: Orientation CACES & Salaires */}
            <div className="space-y-8 flex flex-col justify-between">
              
              {/* Feature 81: Career Path Recommender */}
              <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-galf-yellow/5 rounded-bl-[4rem]" />
                <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <Settings className="w-5 h-5 text-galf-yellow animate-spin-slow" /> Recommandateur de Spécialité CACES
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                  Découvrez en 3 questions quel engin lourd correspond à votre tempérament de conducteur.
                </p>

                {recomStep === 0 && (
                  <div className="space-y-4 py-4 text-center">
                    <p className="text-xs" style={{ color: 'var(--galf-text-secondary)' }}>
                      Prêt à faire le test ? Il vous prendra moins d'une minute et ciblera vos aptitudes naturelles.
                    </p>
                    <button
                      onClick={() => { playQuizSound('click'); setRecomStep(1); }}
                      className="bg-galf-yellow text-galf-carbon text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-md"
                    >
                      Démarrer le questionnaire
                    </button>
                  </div>
                )}

                {recomStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Question 1/2 : Quel environnement de travail préférez-vous ?</span>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleRecomAnswer('env', 'mines')}
                        className="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        🌋 Grand air, sites d'extraction massifs et mines
                      </button>
                      <button 
                        onClick={() => handleRecomAnswer('env', 'levage')}
                        className="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        🏗️ Chantiers urbains, immeubles en hauteur et levage
                      </button>
                      <button 
                        onClick={() => handleRecomAnswer('env', 'terrain')}
                        className="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        🚜 Terrassement, routes et nivellement de sols
                      </button>
                    </div>
                  </div>
                )}

                {recomStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Question 2/2 : Qu'est-ce qui vous caractérise le plus ?</span>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleRecomAnswer('style', 'heights')}
                        className="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        🚁 Je n'ai pas le vertige, j'aime avoir une vue d'ensemble surélevée
                      </button>
                      <button 
                        onClick={() => handleRecomAnswer('style', 'power')}
                        className="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        💪 La force pure de poussée et le déplacement de tonnes de roche
                      </button>
                      <button 
                        onClick={() => handleRecomAnswer('style', 'precision')}
                        className="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        📦 L'adresse millimétrique en intérieur et le chargement rapide
                      </button>
                    </div>
                  </div>
                )}

                {recomStep === 3 && (
                  <div className="space-y-4 animate-fadeIn p-4 rounded-2xl" style={{ background: 'var(--galf-yellow-glow)', border: '1px solid var(--galf-border)' }}>
                    <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Notre Recommandation :</span>
                    <h4 className="text-lg font-black uppercase" style={{ color: 'var(--galf-text)' }}>{getRecomResult().name}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{getRecomResult().desc}</p>
                    
                    <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid var(--galf-border)' }}>
                      <div>
                        <span className="text-[8px] block" style={{ color: 'var(--galf-text-muted)' }}>Certification Cible :</span>
                        <span className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>{getRecomResult().caces}</span>
                      </div>
                      <div>
                        <span className="text-[8px] block" style={{ color: 'var(--galf-text-muted)' }}>Tarif estimé :</span>
                        <span className="text-xs font-black text-galf-yellow">{getRecomResult().price.toLocaleString('fr-FR')} F CFA</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => { playQuizSound('click'); setRecomStep(0); }}
                        className="flex-1 text-[10px] font-black uppercase py-2.5 rounded-xl transition-all"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => {
                          playQuizSound('correct')
                          setEstPrice(getRecomResult().price)
                          const el = document.getElementById('tuition-estimator')
                          if (el) el.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="flex-1 bg-galf-yellow text-galf-carbon text-[10px] font-black uppercase py-2.5 rounded-xl hover:brightness-110"
                      >
                        Simuler le financement
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Feature 83: Interactive Industry Salary Chart */}
              <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden">
                <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <Trophy className="w-5 h-5 text-galf-yellow" /> Salaires Moyens de l'Industrie en Côte d'Ivoire
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                  Salaire mensuel indicatif constaté d'un conducteur certifié (survolez les barres pour voir les détails).
                </p>

                {/* SVG Bar Chart */}
                <div className="relative pt-4 pb-2">
                  <svg viewBox="0 0 400 130" className="w-full h-auto">
                    {[
                      { label: "Chariot (R489)", value: 320000, color: "#9ca3af" },
                      { label: "Pelle (R482)", value: 480000, color: "#fbbf24" },
                      { label: "Grue (R487)", value: 650000, color: "#f59e0b" },
                      { label: "Mines (Forage)", value: 850000, color: "#ffb000" }
                    ].map((item, idx) => {
                      const maxVal = 900000
                      const barWidth = (item.value / maxVal) * 260
                      const yPos = 10 + idx * 30
                      return (
                        <g 
                          key={idx}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredSalaryIdx(idx)}
                          onMouseLeave={() => setHoveredSalaryIdx(null)}
                        >
                          <text x="5" y={yPos + 15} fill="var(--galf-text)" fontSize="10" fontWeight="bold">{item.label}</text>
                          {/* Background bar */}
                          <rect x="110" y={yPos + 5} width="260" height="12" rx="4" fill="var(--galf-bg)" />
                          {/* Value bar */}
                          <rect 
                            x="110" 
                            y={yPos + 5} 
                            width={barWidth} 
                            height="12" 
                            rx="4" 
                            fill={item.color} 
                            opacity={hoveredSalaryIdx === idx ? 1 : 0.8}
                            className="transition-all duration-300"
                          />
                          <text 
                            x={115 + barWidth} 
                            y={yPos + 14} 
                            fill={hoveredSalaryIdx === idx ? "#ffb000" : "var(--galf-text-muted)"} 
                            fontSize="8" 
                            fontWeight="black"
                          >
                            {item.value.toLocaleString('fr-FR')} F
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Tuition Estimator & Safety Quiz */}
            <div id="tuition-estimator" className="space-y-8 flex flex-col justify-between">
              
              {/* Feature 82: Dynamic Tuition Installment Estimator */}
              <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-galf-yellow/5 rounded-bl-[4rem]" />
                <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <Zap className="w-5 h-5 text-galf-yellow" /> Simulateur de Financement &amp; Mensualités
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                  Sélectionnez le prix théorique de votre formation et configurez l'acompte pour calculer le montant restant.
                </p>

                <div className="space-y-5 text-xs">
                  {/* Target Price selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: 'var(--galf-text-secondary)' }}>Prix de la formation ciblé :</span>
                      <span className="font-black" style={{ color: 'var(--galf-text)' }}>{estPrice.toLocaleString('fr-FR')} CFA</span>
                    </div>
                    <select
                      value={estPrice}
                      onChange={(e) => { playQuizSound('click'); setEstPrice(Number(e.target.value)); }}
                      className="w-full rounded-xl p-3 text-xs outline-none focus:border-galf-yellow"
                      style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                    >
                      <option value={350000} className="bg-neutral-900 text-white">Chariot Élévateur (Manutention) - 350 000 F</option>
                      <option value={650000} className="bg-neutral-900 text-white">Pelle Hydraulique (Terrassement) - 650 000 F</option>
                      <option value={750000} className="bg-neutral-900 text-white">Grue à Tour / Mobile (Levage) - 750 000 F</option>
                      <option value={850000} className="bg-neutral-900 text-white">Foreuse de Mine (Mines) - 850 000 F</option>
                    </select>
                  </div>

                  {/* Acompte Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: 'var(--galf-text-secondary)' }}>Acompte à l'inscription :</span>
                      <span className="font-black text-galf-yellow">{estAcompte}% ({(estPrice * estAcompte / 100).toLocaleString('fr-FR')} F)</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="100" 
                      step="5"
                      value={estAcompte}
                      onChange={(e) => { playQuizSound('click'); setEstAcompte(Number(e.target.value)); }}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      style={{ background: 'var(--galf-border)' }}
                    />
                  </div>

                  {/* Installments selector */}
                  {estAcompte < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold" style={{ color: 'var(--galf-text-secondary)' }}>Étalement du solde restant :</span>
                        <span className="font-black" style={{ color: 'var(--galf-text)' }}>{estMonths} mensualités</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => { playQuizSound('click'); setEstMonths(m); }}
                            className="py-2 rounded-lg text-xs font-black border transition-all"
                            style={{
                              background: estMonths === m ? 'var(--galf-yellow-glow)' : 'var(--galf-bg)',
                              borderColor: estMonths === m ? '#FFB000' : 'var(--galf-border)',
                              color: estMonths === m ? 'var(--galf-text)' : 'var(--galf-text-secondary)'
                            }}
                          >
                            {m} Mois
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial Summary */}
                  <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                    <div className="flex justify-between items-center text-[10px] uppercase font-black" style={{ color: 'var(--galf-text-muted)' }}>
                      <span>Dépôt initial requis</span>
                      <span>Mensualité estimative</span>
                    </div>
                    <div className="flex justify-between items-center font-black">
                      <span className="text-sm" style={{ color: 'var(--galf-text)' }}>
                        {Math.round(estPrice * estAcompte / 100).toLocaleString('fr-FR')} F
                      </span>
                      <span className="text-sm text-galf-yellow">
                        {estAcompte === 100 
                          ? "Aucune" 
                          : `${Math.round((estPrice - (estPrice * estAcompte / 100)) / estMonths).toLocaleString('fr-FR')} F / mois`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 84: Express Safety Aptitude Quiz */}
              <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden">
                <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <Shield className="w-5 h-5 text-galf-yellow" /> Mini-Quiz d'Aptitude Sécurité Chantier
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                  Testez vos connaissances en sécurité de conduite avant de monter en cabine réelle.
                </p>

                {!quizDone ? (
                  <div className="space-y-4 animate-fadeIn">
                    <span className="text-[10px] text-galf-yellow font-black uppercase tracking-widest block">
                      Question {quizIndex + 1} / {quizQuestions.length}
                    </span>
                    <h4 className="text-xs font-black leading-snug" style={{ color: 'var(--galf-text)' }}>
                      {quizQuestions[quizIndex].q}
                    </h4>

                    <div className="space-y-2">
                      {quizQuestions[quizIndex].options.map((opt, oIdx) => {
                        const isSelected = quizSelected === oIdx
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              if (quizSelected !== null) return
                              setQuizSelected(oIdx)
                              const isCorrect = oIdx === quizQuestions[quizIndex].correct
                              playQuizSound(isCorrect ? 'correct' : 'wrong')
                              if (isCorrect) setQuizScore(prev => prev + 1)
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                              quizSelected !== null && oIdx === quizQuestions[quizIndex].correct
                                ? 'bg-green-500/10 border-green-500 text-green-600 font-black'
                                : quizSelected === oIdx
                                ? 'bg-red-500/10 border-red-500 text-red-600 font-black'
                                : 'hover:border-galf-yellow'
                            }`}
                            style={{
                              background: quizSelected === null ? 'var(--galf-bg)' : undefined,
                              borderColor: quizSelected === null ? 'var(--galf-border)' : undefined,
                              color: quizSelected === null ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>

                    {quizSelected !== null && (
                      <div className="p-3 rounded-xl space-y-2 animate-fadeIn" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                        <p className="text-[10px] leading-relaxed italic" style={{ color: 'var(--galf-text-secondary)' }}>
                          {quizQuestions[quizIndex].tip}
                        </p>
                        <button
                          onClick={() => {
                            playQuizSound('click')
                            setQuizSelected(null)
                            if (quizIndex < quizQuestions.length - 1) {
                              setQuizIndex(prev => prev + 1)
                            } else {
                              setQuizDone(true)
                            }
                          }}
                          className="bg-galf-yellow text-galf-carbon text-[9px] font-black uppercase px-4 py-2 rounded-lg hover:brightness-110 ml-auto block"
                        >
                          {quizIndex === quizQuestions.length - 1 ? "Voir les résultats" : "Question Suivante →"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-galf-yellow/10 flex items-center justify-center mx-auto text-galf-yellow">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black" style={{ color: 'var(--galf-text)' }}>Score : {quizScore} / {quizQuestions.length}</h4>
                      <p className="text-xs max-w-xs mx-auto mt-1" style={{ color: 'var(--galf-text-muted)' }}>
                        {quizScore === quizQuestions.length 
                          ? "Parfait ! Vos réflexes de sécurité sont excellents. Vous êtes prêt pour la cabine."
                          : "Certains concepts doivent être révisés. La formation GALF met l'accent sur ces aspects HSE."
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        playQuizSound('click')
                        setQuizIndex(0)
                        setQuizScore(0)
                        setQuizSelected(null)
                        setQuizDone(false)
                      }}
                      className="text-[9px] font-black uppercase px-6 py-2.5 rounded-xl transition-all"
                      style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                    >
                      Recommencer le test
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-40 relative overflow-hidden text-center noise-overlay" style={{ background: 'var(--galf-bg)' }}>
        <div className="container relative z-20 mx-auto px-4 max-w-3xl">
          <FadeIn>
            <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-6">Prêt à construire votre avenir ?</div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]" style={{ color: 'var(--galf-text)' }}>
              Passez du projet <span className="text-galf-yellow">à l'action</span>
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>
              Choisissez une formation, déposez votre dossier en ligne et entrez dans l'univers GALF.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <MagneticHover>
                <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-lg font-black text-lg hover:brightness-110 transition-all inline-flex items-center gap-3 shadow-lg">
                  Commencer mon inscription <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticHover>
              <Link href="/contact" className="glass-card px-12 py-5 rounded-lg font-bold text-lg hover:border-galf-yellow/40 inline-flex items-center justify-center" style={{ color: 'var(--galf-text)' }}>
                Nous contacter
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ MACHINE SPECS MODAL ═══ */}
      {activeMachine && (
        <MachineSpecsModal
          isOpen={!!activeMachine}
          onClose={() => setActiveMachine(null)}
          machineSlug={activeMachine.slug}
          machineName={activeMachine.name}
          machineImg={activeMachine.img}
        />
      )}
    </div>
  )
}
