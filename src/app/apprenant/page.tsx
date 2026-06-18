"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Play, BookOpen, CheckCircle2, Clock, Award, FileText, Download, ExternalLink, TrendingUp, Lock, Check, X, AlertTriangle, Timer, Edit3, ShieldAlert, Award as BadgeIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PageHeader } from '@/components/layout/PageHeader'
import { HardHat, Settings } from 'lucide-react'

// Lightweight window-relative canvas confetti particles
function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const particles: any[] = []
    const colors = ['#FFB000', '#FFD700', '#8b939c', '#10B981', '#3B82F6', '#EF4444']

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: 4 + Math.random() * 6,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      })
    }

    let animationId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let finished = true

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2
        p.x += Math.sin(p.tiltAngle)
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15

        if (p.y < canvas.height) {
          finished = false
        }

        ctx.beginPath()
        ctx.lineWidth = p.r
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2)
        ctx.stroke()
      })

      if (!finished) {
        animationId = requestAnimationFrame(draw)
      }
    }

    draw()
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[120] w-full h-full" />
}

export default function ApprenantDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'cours' | 'certificats'>('cours')
  const [activeModule, setActiveModule] = useState(2)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const certificateRef = useRef<HTMLDivElement>(null)

  // Track modules completed state dynamically
  const [modules, setModules] = useState([
    { id: 1, title: "Module 1 : Sécurité et réglementation", duration: "2h30", completed: true, lessons: 5 },
    { id: 2, title: "Module 2 : Connaissance de l'engin", duration: "3h00", completed: true, lessons: 6 },
    { id: 3, title: "Module 3 : Conduite en terrain plat", duration: "4h00", completed: false, lessons: 8, current: true },
    { id: 4, title: "Module 4 : Travaux de terrassement", duration: "5h00", completed: false, lessons: 7 },
    { id: 5, title: "Module 5 : Situations complexes", duration: "3h30", completed: false, lessons: 5 },
    { id: 6, title: "Module 6 : Évaluation finale", duration: "2h00", completed: false, lessons: 3 },
  ])

  // HSE Quiz State
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // ----------------------------------------------------
  // NEW STATES FOR ADVANCED WIDGETS
  // ----------------------------------------------------
  // Pomodoro
  const [pomoMinutes, setPomoMinutes] = useState(25)
  const [pomoSeconds, setPomoSeconds] = useState(0)
  const [pomoActive, setPomoActive] = useState(false)

  // Notes
  const [notes, setNotes] = useState("")

  // EPI Safety Game
  const [equippedEpi, setEquippedEpi] = useState<string[]>([])
  const [epiCompleted, setEpiCompleted] = useState(false)

  // QCM CACES states
  const [cacesQuizStep, setCacesQuizStep] = useState(0)
  const [cacesSelectedOption, setCacesSelectedOption] = useState<number | null>(null)
  const [cacesFeedback, setCacesFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [cacesScore, setCacesScore] = useState(0)
  const [cacesCompleted, setCacesCompleted] = useState(false)

  // Wave 4 additions - QCM countdown timer, Speak config, Scanner simulation
  const [cacesTimer, setCacesTimer] = useState(30)
  const [speakRate, setSpeakRate] = useState(1.0)
  const [speakPitch, setSpeakPitch] = useState(1.0)
  const [showQrScanner, setShowQrScanner] = useState(false)
  const [qrScanProgress, setQrScanProgress] = useState(0)
  const [qrScanResult, setQrScanResult] = useState<string | null>(null)

  // Carbon calculator states
  const [ecoSpeed, setEcoSpeed] = useState(15)
  const [ecoIdle, setEcoIdle] = useState(20)

  // Audio warning states
  const [activeSiren, setActiveSiren] = useState<'recul' | 'evac' | 'surcharge' | 'rumble' | null>(null)
  const sirenAudioRef = useRef<AudioContext | null>(null)
  const sirenNodeRef = useRef<any>(null)

  const cacesQuestions = [
    {
      q: "Dans quel cas est-il obligatoire de porter un gilet de haute visibilité ?",
      options: [
        "Uniquement la nuit sur le chantier",
        "En permanence dès que vous pénétrez sur le plateau technique ou le chantier",
        "Seulement si l'instructeur le demande expressément"
      ],
      correct: 1,
      explain: "Le gilet réfléchissant permet d'être vu par les autres conducteurs d'engins lourds à tout moment, de jour comme de nuit. C'est un EPI indispensable."
    },
    {
      q: "Quel est le risque principal lié à une inclinaison de machine supérieure aux limites constructeur (généralement 15°) ?",
      options: [
        "Le renversement de l'engin (perte de stabilité)",
        "Une surchauffe rapide de l'huile hydraulique",
        "Une augmentation injustifiée des émissions de CO2"
      ],
      correct: 0,
      explain: "Une pente trop forte déplace le centre de gravité hors de la surface d'appui, provoquant le basculement direct de l'engin avec risque d'écrasement."
    },
    {
      q: "Que signifie un signal de main circulaire du chef de chantier avec le bras tendu vers le haut ?",
      options: [
        "Arrêt d'urgence immédiat",
        "Lever la charge ou l'équipement",
        "Faire pivoter l'équipement vers la gauche"
      ],
      correct: 1,
      explain: "Le bras levé avec l'index pointant vers le haut dessinant des cercles indique au grutier de lever la charge."
    },
    {
      q: "Quel organe de l'engin est le plus sollicité pour réduire la consommation (éco-conduite) ?",
      options: [
        "Les chenilles de roulement",
        "Le régime moteur (réduire le régime lors des phases de veille/ralenti)",
        "Les flexibles hydrauliques principaux"
      ],
      correct: 1,
      explain: "Éviter de faire tourner le moteur à haut régime inutilement et couper le contact lors d'un arrêt prolongé (anti-idle) réduit le carburant de 15%."
    },
    {
      q: "Que devez-vous faire immédiatement en cas de déclenchement de l'alarme surcharge d'une grue ?",
      options: [
        "Continuer le levage en accélérant la rotation pour finir vite",
        "Déposer immédiatement la charge ou la ramener vers le mât pour réduire la portée",
        "Éteindre l'alarme sonore dans la cabine pour ne pas être déconcentré"
      ],
      correct: 1,
      explain: "La surcharge menace l'équilibre structurel de la grue. Déposer la charge ou réduire le rayon d'action permet de repasser sous le seuil critique de rupture."
    }
  ]

  const handleCacesOptionSelect = (idx: number) => {
    if (cacesFeedback !== null) return
    setCacesSelectedOption(idx)
    const isCorrect = idx === cacesQuestions[cacesQuizStep].correct
    if (isCorrect) {
      setCacesFeedback('correct')
      setCacesScore(prev => prev + 1)
      triggerAudioAlert(880, 0.15)
    } else {
      setCacesFeedback('wrong')
      triggerAudioAlert(220, 0.3)
    }
  }

  const handleCacesNextQuestion = () => {
    setCacesSelectedOption(null)
    setCacesFeedback(null)
    setCacesTimer(30)
    if (cacesQuizStep < cacesQuestions.length - 1) {
      setCacesQuizStep(prev => prev + 1)
    } else {
      setCacesCompleted(true)
    }
  }

  const handleResetCacesQuiz = () => {
    setCacesQuizStep(0)
    setCacesSelectedOption(null)
    setCacesFeedback(null)
    setCacesScore(0)
    setCacesCompleted(false)
    setCacesTimer(30)
  }

  // QCM CACES countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeTab === 'cours' && !cacesCompleted && cacesFeedback === null) {
      interval = setInterval(() => {
        setCacesTimer(prev => {
          if (prev <= 1) {
            setCacesSelectedOption(-1)
            setCacesFeedback('wrong')
            triggerAudioAlert(220, 0.4)
            return 0
          }
          if (prev <= 6) {
            triggerAudioAlert(440, 0.05)
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [cacesQuizStep, cacesFeedback, cacesCompleted, activeTab])

  // QR Scanner simulation effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showQrScanner && qrScanProgress < 100) {
      timer = setTimeout(() => {
        setQrScanProgress(prev => {
          const next = prev + 5
          if (next >= 100) {
            triggerAudioAlert(880, 0.15)
            setTimeout(() => triggerAudioAlert(1320, 0.2), 100)
            setQrScanResult("AUTHENTIQUE")
          } else {
            if (next % 20 === 0) triggerAudioAlert(600, 0.03)
          }
          return next
        })
      }, 100)
    }
    return () => clearTimeout(timer)
  }, [showQrScanner, qrScanProgress])

  const handleStopSiren = () => {
    if (sirenNodeRef.current) {
      try {
        sirenNodeRef.current.stop()
      } catch (e) {}
      sirenNodeRef.current = null
    }
    setActiveSiren(null)
  }

  const handlePlaySiren = (type: 'recul' | 'evac' | 'surcharge' | 'rumble') => {
    handleStopSiren()
    setActiveSiren(type)

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      sirenAudioRef.current = ctx

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      sirenNodeRef.current = osc

      if (type === 'recul') {
        osc.type = 'square'
        osc.frequency.setValueAtTime(1000, ctx.currentTime)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        
        let isBeeping = true
        const interval = setInterval(() => {
          if (!sirenNodeRef.current) {
            clearInterval(interval)
            return
          }
          isBeeping = !isBeeping
          gain.gain.setValueAtTime(isBeeping ? 0.04 : 0.001, ctx.currentTime)
        }, 300)

      } else if (type === 'evac') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        gain.gain.setValueAtTime(0.03, ctx.currentTime)
        
        let count = 0
        const interval = setInterval(() => {
          if (!sirenNodeRef.current) {
            clearInterval(interval)
            return
          }
          count++
          const freq = 400 + Math.sin(count * 0.25) * 150
          osc.frequency.setValueAtTime(freq, ctx.currentTime)
        }, 60)

      } else if (type === 'surcharge') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(2000, ctx.currentTime)
        gain.gain.setValueAtTime(0.06, ctx.currentTime)
        
        let isBeeping = true
        const interval = setInterval(() => {
          if (!sirenNodeRef.current) {
            clearInterval(interval)
            return
          }
          isBeeping = !isBeeping
          gain.gain.setValueAtTime(isBeeping ? 0.06 : 0.001, ctx.currentTime)
        }, 120)

      } else {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(50, ctx.currentTime)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
      }

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
    } catch(e) {}
  }

  useEffect(() => {
    return () => {
      if (sirenNodeRef.current) {
        try { sirenNodeRef.current.stop() } catch(e) {}
      }
    }
  }, [])

  const quizQuestions = [
    {
      q: "Quelle est la distance minimale de sécurité à respecter par rapport aux lignes électriques aériennes de moyenne tension ?",
      options: [
        "1 mètre",
        "3 mètres (distance réglementaire)",
        "5 mètres"
      ],
      correct: 1,
      explain: "La distance de sécurité minimale réglementaire pour les lignes de moyenne tension (< 50 kV) est de 3 mètres pour éviter tout risque d'arc électrique."
    },
    {
      q: "Lors du stationnement d'une pelle hydraulique en fin de journée, comment doit être positionné le godet ?",
      options: [
        "Suspendu à 1 mètre de haut pour éviter les chocs au démarrage",
        "Posé sur la remorque du camion de transport",
        "Posé à plat sur le sol, dents vers le bas, équipement replié"
      ],
      correct: 2,
      explain: "L'équipement de travail doit toujours être abaissé et reposé au sol pour éliminer toute énergie potentielle et prévenir les chutes accidentelles."
    },
    {
      q: "Quel est le premier réflexe à avoir si vous perdez le contrôle de la machine suite à une rupture de flexible hydraulique ?",
      options: [
        "Abaisser immédiatement tous les équipements au sol et couper le moteur",
        "Sauter hors de la cabine en mouvement",
        "Klaxonner en continu en attendant les secours"
      ],
      correct: 0,
      explain: "Abaisser l'équipement stoppe les mouvements accidentels par gravité. Couper le moteur coupe la pression hydraulique. Ne sautez jamais d'un engin en mouvement !"
    }
  ]

  // ----------------------------------------------------
  // AUDIO SYNTH HELPER
  // ----------------------------------------------------
  const triggerAudioAlert = (freq = 880, duration = 0.2) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
      setTimeout(() => ctx.close(), duration * 1000 + 100)
    } catch (e) {}
  }

  // Load notes from localStorage on client side mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('galf_study_notes')
    if (savedNotes) setNotes(savedNotes)
  }, [])

  // Save notes to localStorage
  const handleNotesChange = (val: string) => {
    setNotes(val)
    localStorage.setItem('galf_study_notes', val)
  }

  // Pomodoro Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (pomoActive) {
      timer = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(prev => prev - 1)
        } else if (pomoMinutes > 0) {
          setPomoMinutes(prev => prev - 1)
          setPomoSeconds(59)
        } else {
          setPomoActive(false)
          triggerAudioAlert(880, 0.4)
          alert("Session d'étude terminée ! Prenez une pause de sécurité obligatoire.")
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [pomoActive, pomoMinutes, pomoSeconds])

  const togglePomodoro = () => {
    triggerAudioAlert(pomoActive ? 440 : 660, 0.15)
    setPomoActive(!pomoActive)
  }

  const resetPomodoro = () => {
    triggerAudioAlert(330, 0.15)
    setPomoActive(false)
    setPomoMinutes(25)
    setPomoSeconds(0)
  }

  // Export Notes
  const handleExportNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Notes-Chantier-GALF-${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  // EPI Safety Game Logic
  const epiItems = [
    { id: 'casque', label: 'Casque de chantier', isEpi: true, icon: '🪖' },
    { id: 'short', label: 'Short léger', isEpi: false, icon: '🩳' },
    { id: 'gilet', label: 'Gilet réfléchissant', isEpi: true, icon: '🦺' },
    { id: 'tong', label: 'Tongs de plage', isEpi: false, icon: '🩴' },
    { id: 'bottes', label: 'Bottes de sécurité', isEpi: true, icon: '🥾' },
    { id: 'gants', label: 'Gants renforcés', isEpi: true, icon: '🧤' },
    { id: 'lunettes', label: 'Lunettes de protection', isEpi: true, icon: '🥽' },
    { id: 'casquette', label: 'Casquette simple', isEpi: false, icon: '🧢' },
  ]

  const handleToggleEpi = (id: string) => {
    if (epiCompleted) return
    triggerAudioAlert(600, 0.05)
    let updated: string[]
    if (equippedEpi.includes(id)) {
      updated = equippedEpi.filter(x => x !== id)
    } else {
      updated = [...equippedEpi, id]
    }
    setEquippedEpi(updated)
    
    // Validate: 5 Correct EPI items and 0 incorrect items
    const episEquipped = updated.filter(x => epiItems.find(item => item.id === x)?.isEpi)
    const nonEpisEquipped = updated.filter(x => !epiItems.find(item => item.id === x)?.isEpi)
    
    if (episEquipped.length === 5 && nonEpisEquipped.length === 0) {
      setEpiCompleted(true)
      triggerAudioAlert(523.25, 0.2)
      setTimeout(() => triggerAudioAlert(659.25, 0.2), 120)
      setTimeout(() => triggerAudioAlert(783.99, 0.35), 240)
    }
  }

  const handleOptionSelect = (idx: number) => {
    if (quizFeedback !== null) return
    setSelectedOption(idx)
    const isCorrect = idx === quizQuestions[quizStep].correct
    if (isCorrect) {
      setQuizFeedback('correct')
      setQuizScore(prev => prev + 1)
      triggerAudioAlert(880, 0.15)
    } else {
      setQuizFeedback('incorrect')
      triggerAudioAlert(220, 0.3)
    }
  }

  const handleNextQuestion = () => {
    setSelectedOption(null)
    setQuizFeedback(null)
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleFinishQuiz = () => {
    setShowQuiz(false)
    setQuizCompleted(false)
    setQuizStep(0)
    setQuizScore(0)
    
    // Set Module 3 as completed, and Module 4 as current
    setModules(prev => prev.map(m => {
      if (m.id === 3) return { ...m, completed: true, current: false }
      if (m.id === 4) return { ...m, current: true }
      return m
    }))
  }

  const [userName, setUserName] = useState("JEAN KOUADIO")
  const [cockpitTheme, setCockpitTheme] = useState<'carbon' | 'steel' | 'gold'>('carbon')
  const [selectedAvatar, setSelectedAvatar] = useState({ name: "Jean Kouadio", icon: "👷", role: "Opérateur de pelle" })
  
  const avatars = [
    { name: "Jean Kouadio", icon: "👷", role: "Opérateur de pelle" },
    { name: "Mariam Diallo", icon: "👩‍🔧", role: "Technicienne HSE" },
    { name: "Kouamé N'Guessan", icon: "🏢", role: "Superviseur de chantier" }
  ]

  // Audio Guide Speech State
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Waiver sign state
  const [isWaiverSigned, setIsWaiverSigned] = useState(false)
  const [waiverChecked, setWaiverChecked] = useState(false)
  const [signatureName, setSignatureName] = useState("")
  const [signatureImg, setSignatureImg] = useState<string | null>(null)
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const rect = canvas.getBoundingClientRect()
    let clientX = 0
    let clientY = 0

    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let clientX = 0
    let clientY = 0

    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureImg(null)
  }

  // --- FEATURE 6: EPI Speed Trial States ---
  const [speedGameActive, setSpeedGameActive] = useState(false)
  const [speedGameTime, setSpeedGameTime] = useState(10)
  const [speedGameSelected, setSpeedGameSelected] = useState<string[]>([])
  const [speedGameStatus, setSpeedGameStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [speedBestTime, setSpeedBestTime] = useState<number | null>(null)

  // --- FEATURE 7: Inspection States ---
  const [inspectMachine, setInspectMachine] = useState<'pelle' | 'grue' | 'bulldozer'>('pelle')
  const [inspectChecks, setInspectChecks] = useState<Record<string, boolean>>({
    oil: false, hoses: false, tracks: false, windshield: false, horn: false
  })
  const [engineStarted, setEngineStarted] = useState(false)

  // --- FEATURE 8: Certificate Verifier States ---
  const [verifyCode, setVerifyCode] = useState("")
  const [verifyResult, setVerifyResult] = useState<any | null>(null)

  // EPI Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (speedGameActive && speedGameTime > 0 && speedGameStatus === 'idle') {
      timer = setInterval(() => {
        setSpeedGameTime(prev => {
          if (prev <= 1) {
            setSpeedGameStatus('fail')
            triggerAudioAlert(220, 0.3) // Fail buzzer
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [speedGameActive, speedGameTime, speedGameStatus])

  const speedItemsList = [
    { id: 'gilet', label: "Gilet Réfléchissant", icon: "🦺", isEpi: true },
    { id: 'harnais', label: "Harnais de Sécurité", icon: "🛡️", isEpi: true },
    { id: 'bottes', label: "Bottes Renforcées", icon: "🥾", isEpi: true },
    { id: 'bruit', label: "Casque Anti-bruit", icon: "🎧", isEpi: true },
    { id: 'lunettes', label: "Lunettes de Protection", icon: "🥽", isEpi: true },
    { id: 'tel', label: "Téléphone Portable", icon: "📱", isEpi: false },
    { id: 'boisson', label: "Boisson Énergisante", icon: "🥤", isEpi: false },
    { id: 'ecouteurs', label: "Écouteurs de Musique", icon: "🎵", isEpi: false }
  ]

  const handleToggleSpeedEpi = (itemId: string) => {
    if (speedGameStatus !== 'idle') return
    
    let updated: string[]
    if (speedGameSelected.includes(itemId)) {
      updated = speedGameSelected.filter(id => id !== itemId)
    } else {
      updated = [...speedGameSelected, itemId]
    }
    setSpeedGameSelected(updated)
    triggerAudioAlert(600, 0.05)

    // Check if player selected exactly the 5 correct EPIs and no non-EPIs
    const episSelected = updated.filter(id => speedItemsList.find(x => x.id === id)?.isEpi)
    const nonEpisSelected = updated.filter(id => !speedItemsList.find(x => x.id === id)?.isEpi)
    
    if (episSelected.length === 5 && nonEpisSelected.length === 0) {
      setSpeedGameStatus('success')
      const timeTaken = 10 - speedGameTime
      if (speedBestTime === null || timeTaken < speedBestTime) {
        setSpeedBestTime(timeTaken)
      }
      triggerAudioAlert(880, 0.15)
      setTimeout(() => triggerAudioAlert(1320, 0.25), 100)
    }
  }

  const handleStartSpeedGame = () => {
    setSpeedGameSelected([])
    setSpeedGameTime(10)
    setSpeedGameStatus('idle')
    setSpeedGameActive(true)
    triggerAudioAlert(440, 0.1)
  }

  const handleToggleInspect = (checkKey: string) => {
    const updated = { ...inspectChecks, [checkKey]: true }
    setInspectChecks(updated)
    triggerAudioAlert(700, 0.1) // Hydraulic click sound
  }

  const handleStartVirtualEngine = () => {
    const allChecked = Object.values(inspectChecks).every(v => v === true)
    if (!allChecked) {
      alert("Veuillez effectuer tous les contrôles de sécurité requis d'abord.")
      return
    }
    setEngineStarted(true)
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        triggerAudioAlert(200, 0.1)
        
        setTimeout(() => {
          const osc1 = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gain = ctx.createGain()
          osc1.type = 'sawtooth'
          osc1.frequency.setValueAtTime(60, ctx.currentTime)
          osc2.type = 'square'
          osc2.frequency.setValueAtTime(30, ctx.currentTime)
          
          gain.gain.setValueAtTime(0.1, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8)
          
          osc1.connect(gain)
          osc2.connect(gain)
          gain.connect(ctx.destination)
          osc1.start()
          osc2.start()
          
          osc1.stop(ctx.currentTime + 1.8)
          osc2.stop(ctx.currentTime + 1.8)
        }, 150)
      }
    } catch(e) {}
  }

  const handleResetInspection = () => {
    setInspectChecks({
      oil: false, hoses: false, tracks: false, windshield: false, horn: false
    })
    setEngineStarted(false)
  }

  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyCode.trim()) return

    const code = verifyCode.trim().toUpperCase()
    if (code === 'GALF-PELLE-2026') {
      setVerifyResult({
        name: "Yao N'Guessan",
        course: "Pelle Hydraulique",
        score: "18.5/20",
        date: "12 Avril 2026",
        status: "AUTHENTIQUE"
      })
    } else if (code === 'GALF-GRUE-2026') {
      setVerifyResult({
        name: "Marc Koffi",
        course: "Grue à Tour",
        score: "17.0/20",
        date: "10 Avril 2026",
        status: "AUTHENTIQUE"
      })
    } else if (code.startsWith('GALF-') && isWaiverSigned && showCertificate) {
      setVerifyResult({
        name: userName,
        course: certData.course,
        score: certData.score,
        date: certData.date,
        status: "AUTHENTIQUE"
      })
    } else {
      setVerifyResult({
        status: "INTROUVABLE"
      })
    }
  }


  const speakModule = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      const textToSpeak = `Module de formation GALF. ${modules[activeModule].title}. Ce module dure environ ${modules[activeModule].duration}. Il contient ${modules[activeModule].lessons} leçons. Veuillez écouter les instructions de sécurité et inspecter votre équipement.`
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = 'fr-FR'
      utterance.rate = speakRate
      utterance.pitch = speakPitch
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    } else {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.")
    }
  }

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const resources = [
    { title: "Manuel de l'opérateur - Pelle hydraulique", type: "PDF", size: "12 MB" },
    { title: "Guide des signaux de chantier", type: "PDF", size: "4.5 MB" },
    { title: "Checklist de maintenance journalière", type: "XLS", size: "1.2 MB" },
  ]

  const [certData] = useState({
    course: "Pelle Hydraulique sur chenilles",
    date: "11 Avril 2024",
    id: "GALF-2024-XP-03",
    score: "18.5/20"
  })

  const handleGenerateCertificate = () => {
    if (!isWaiverSigned) {
      alert("Veuillez d'abord signer le règlement de sécurité de GALF.")
      return
    }
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowCertificate(true)
    }, 3000)
  }

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 3, // Higher scale for premium print quality
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificat-GALF-${userName.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  }

  const completedCount = modules.filter(m => m.completed).length
  const progress = Math.round((completedCount / modules.length) * 100)

  // BADGES DEFINITION
  const badgesList = [
    { name: "Démarrage Rapide", desc: "Modules 1 & 2 validés", icon: "🔑", unlocked: true },
    { name: "Sécuritaire HSE", desc: "Module 3 (Quiz HSE) validé", icon: "🛡️", unlocked: modules[2].completed },
    { name: "Inspecteur EPI", desc: "Jeu des EPI résolu", icon: "🦺", unlocked: epiCompleted },
    { name: "As du Volant", desc: "Score de 3/3 à l'examen", icon: "🏆", unlocked: quizCompleted && quizScore === 3 },
    { name: "Chronométreur", desc: "Bloc-notes de chantier rédigé", icon: "⏱️", unlocked: notes.trim().length > 30 },
    { name: "Major de Promo", desc: "Score parfait global (En cours)", icon: "🎓", unlocked: false },
  ]

  const themeBgColors = {
    carbon: 'var(--galf-bg)',
    steel: '#111827',
    gold: '#1c160c'
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 transition-colors duration-500" style={{ background: themeBgColors[cockpitTheme] }}>
      {(quizCompleted || epiCompleted) && <ConfettiEffect />}
      <PageHeader 
        title={`${certData.course} — FORMATION`}
        subtitle="Suivez votre progression, accédez à vos modules et téléchargez vos certifications officielles."
        badge="Espace apprenant"
      >
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => setActiveTab('cours')}
            className={`px-8 py-3 rounded-xl font-bold transition-all border ${activeTab === 'cours' ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-galf-border'}`}
            style={activeTab !== 'cours' ? { color: 'var(--galf-text)' } : {}}
          >
            Mon Parcours
          </button>
          <button 
            onClick={() => setActiveTab('certificats')}
            className={`px-8 py-3 rounded-xl font-bold transition-all border ${activeTab === 'certificats' ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-[0_0_20px_rgba(255,176,0,0.3)]' : 'border-galf-border'}`}
            style={activeTab !== 'certificats' ? { color: 'var(--galf-text)' } : {}}
          >
            Certificats
          </button>
        </div>
      </PageHeader>

      <div className="container-galf relative z-10 mt-12">

        {activeTab === 'cours' ? (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.1}>
                {/* Progress Card Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Terminé", val: `${completedCount}/${modules.length}`, icon: CheckCircle2 },
                    { label: "Temps passé", val: "5h 30m", icon: Clock },
                    { label: "Moyenne", val: certData.score, icon: Award },
                    { label: "Progression", val: `${progress}%`, icon: TrendingUp },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl border-galf-border">
                       <div className="flex items-center gap-2 mb-2 text-galf-yellow">
                          <stat.icon className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-black tracking-widest">{stat.label}</span>
                       </div>
                       <div className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                {!showQuiz ? (
                  // Normal View: Video Player
                  <div 
                    onClick={() => {
                      if (activeModule === 2) {
                        setShowQuiz(true)
                      }
                    }} 
                    className="aspect-video rounded-3xl overflow-hidden relative mb-8 group cursor-pointer shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5" 
                    style={{ background: 'black' }}
                  >
                    <Image 
                      src="/images/about/apprenant-action.png" 
                      alt="Formation en cours" 
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-galf-yellow flex items-center justify-center shadow-[0_0_50px_rgba(255,176,0,0.5)] group-hover:scale-110 transition-transform">
                        {activeModule === 2 ? (
                          <Award className="w-10 h-10 text-galf-carbon" />
                        ) : (
                          <Play className="w-10 h-10 text-galf-carbon ml-1" />
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
                      <div className="glass-card px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-galf-yellow animate-ping" />
                        {modules[activeModule].title}
                      </div>
                      <div className="glass-card px-6 py-3 rounded-xl text-sm font-bold">
                        {activeModule === 2 ? "Test Prêt" : "45:00"}
                      </div>
                    </div>
                    {activeModule === 2 && (
                      <div className="absolute top-8 right-8 bg-galf-yellow text-galf-carbon px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl group-hover:scale-105 transition-transform">
                        Passer le Test HSE →
                      </div>
                    )}
                  </div>
                ) : (
                  // Quiz View
                  <div className="glass-card p-8 md:p-12 rounded-[2rem] border-galf-yellow/20 bg-galf-carbon text-white mb-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
                    
                    {!quizCompleted ? (
                      // Active Quiz Questions
                      <div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                          <span className="text-xs font-black text-galf-yellow uppercase tracking-widest">
                            Évaluation Module 3 (HSE)
                          </span>
                          <span className="text-xs font-bold text-white/40">
                            Question {quizStep + 1} sur {quizQuestions.length}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black mb-8 leading-snug">
                          {quizQuestions[quizStep].q}
                        </h3>

                        <div className="space-y-4">
                          {quizQuestions[quizStep].options.map((opt, idx) => {
                            const isSelected = selectedOption === idx
                            const isCorrect = idx === quizQuestions[quizStep].correct
                            
                            let btnStyle = "border-white/10 hover:border-galf-yellow/50 bg-white/5"
                            if (isSelected) {
                              if (quizFeedback === 'correct') {
                                  btnStyle = "border-green-500 bg-green-500/20 text-white font-black"
                              } else {
                                  btnStyle = "border-red-500 bg-red-500/20 text-white font-black"
                              }
                            } else if (quizFeedback !== null && isCorrect) {
                              btnStyle = "border-green-500 bg-green-500/10 text-white"
                            }

                            return (
                              <button 
                                key={idx}
                                disabled={quizFeedback !== null}
                                onClick={() => handleOptionSelect(idx)}
                                className={`w-full text-left p-5 rounded-xl text-sm font-bold flex items-center justify-between border transition-all ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isSelected && (
                                  quizFeedback === 'correct' ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 ml-4" /> : <X className="w-5 h-5 text-red-500 shrink-0 ml-4" />
                                )}
                                {!isSelected && quizFeedback !== null && isCorrect && (
                                  <Check className="w-5 h-5 text-green-500 shrink-0 ml-4" />
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {quizFeedback !== null && (
                          <div className={`mt-8 p-5 rounded-2xl border text-xs leading-relaxed flex gap-3 ${
                            quizFeedback === 'correct' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'
                          }`}>
                            {quizFeedback === 'correct' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                            <div>
                              <strong className="block font-black mb-1 uppercase tracking-wider">
                                {quizFeedback === 'correct' ? 'Bonne Réponse !' : 'Mauvaise Réponse'}
                              </strong>
                              {quizQuestions[quizStep].explain}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Quiz Completed view
                      <div className="text-center py-6 flex flex-col items-center justify-center">
                        <Award className="w-20 h-20 text-galf-yellow mb-6 animate-bounce" />
                        <h3 className="text-3xl font-black mb-2 text-white">Évaluation validée avec succès !</h3>
                        <p className="text-sm text-white/60 max-w-sm mb-8">
                          Vous avez obtenu un score parfait de {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}% de réussite). Le Module 3 est désormais validé.
                        </p>
                        <button 
                          onClick={handleFinishQuiz}
                          className="bg-galf-yellow text-galf-carbon px-10 py-4.5 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-galf-yellow/15"
                        >
                          Enregistrer et Retourner au Parcours
                        </button>
                      </div>
                    )}

                    {!quizCompleted && quizFeedback !== null && (
                      <div className="mt-8 flex justify-end">
                        <button 
                          onClick={handleNextQuestion}
                          className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                          {quizStep === quizQuestions.length - 1 ? "Terminer le test" : "Question Suivante →"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-galf-yellow" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--galf-text)' }}>Objectifs</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>Maîtriser les rotations et le nivellement de précision.</p>
                     </div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-galf-yellow" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--galf-text)' }}>Durée</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>4h de vidéo + 2h d'exercices pratiques interactifs.</p>
                     </div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-galf-yellow" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--galf-text)' }}>Supports</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>Accès illimité aux manuels PDF et guides de sécurité.</p>
                     </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    NEW WIDGETS SECTION — Pomodoro, Notes & EPI Game
                   ═══════════════════════════════════════════════ */}
                <div className="border-t border-galf-border pt-12 mt-12">
                  <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <HardHat className="text-galf-yellow w-5 h-5" /> Centre d'Étude & Outils Pratiques
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    
                    {/* 1. Pomodoro Timer Widget */}
                    <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border-galf-border">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5" /> Chronomètre d'Étude BTP
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Pomodoro 25min</span>
                      </div>

                      <div className="flex flex-col items-center py-6">
                        <div className="w-32 h-32 rounded-full border-4 border-dashed border-galf-yellow/20 flex flex-col items-center justify-center relative shadow-inner">
                          {pomoActive && (
                            <div className="absolute inset-0 rounded-full border-4 border-galf-yellow border-t-transparent animate-spin-slow pointer-events-none" />
                          )}
                          <div className="text-3xl font-mono font-black text-white">
                            {String(pomoMinutes).padStart(2, '0')}:{String(pomoSeconds).padStart(2, '0')}
                          </div>
                          <span className="text-[8px] font-bold text-white/40 mt-1 uppercase tracking-widest">
                            {pomoActive ? "Session en Cours" : "En Pause"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={togglePomodoro}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            pomoActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-galf-yellow text-galf-carbon hover:brightness-110'
                          }`}
                        >
                          {pomoActive ? "Pause" : "Démarrer"}
                        </button>
                        <button
                          onClick={resetPomodoro}
                          className="px-4 py-2.5 rounded-xl border border-galf-border hover:border-white/20 text-xs font-bold text-white/70 transition-all"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* 2. Notes Widget */}
                    <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border-galf-border">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" /> Bloc-notes de Chantier
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Autosave activé</span>
                      </div>

                      <textarea
                        rows={5}
                        placeholder="Prenez des notes importantes sur les modules, les consignes de sécurité, etc..."
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        className="w-full rounded-xl p-3 text-xs bg-black/30 border border-white/10 outline-none focus:border-galf-yellow resize-none text-white placeholder-white/20 flex-1 mb-4"
                      />

                      <button
                        onClick={handleExportNotes}
                        disabled={notes.trim().length === 0}
                        className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Exporter mes Notes (.TXT)
                      </button>
                    </div>

                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* 3. Safety Dress-up Gear Mini-Game */}
                    <div className="glass-card p-6 rounded-[2rem] border-galf-border">
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" /> Chasse aux Risques : Équiper l'opérateur
                        </span>
                        <span className="text-[9px] font-mono text-white/40">HSE Protocol</span>
                      </div>

                      <p className="text-[11px] text-white/60 mb-4 leading-relaxed">
                        Sélectionnez uniquement les **5 Équipements de Protection Individuelle (EPI)** indispensables pour accéder au chantier.
                      </p>

                      {epiCompleted ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center my-6 animate-fadeIn">
                          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2 animate-bounce" />
                          <div className="text-xs font-black text-white uppercase tracking-wider">EPI Validés avec Succès !</div>
                          <p className="text-[10px] text-green-300/80 mt-1">
                            Votre opérateur est paré pour le chantier. Le badge "Inspecteur EPI" a été débloqué.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {epiItems.map(item => {
                            const isSelected = equippedEpi.includes(item.id)
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleToggleEpi(item.id)}
                                className={`p-2 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-2.5 ${
                                  isSelected 
                                    ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                                    : 'bg-black/30 border-white/5 text-white/70 hover:border-white/20'
                                }`}
                              >
                                <span className="text-lg shrink-0">{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      <div className="text-[9px] font-mono text-white/30 text-center">
                        {equippedEpi.length}/5 Éléments sélectionnés
                      </div>

                      {/* Locker Protection Rating Gauges */}
                      {(() => {
                        const headEquipped = equippedEpi.includes('casque')
                        const bodyEquipped = equippedEpi.includes('gilet')
                        const feetEquipped = equippedEpi.includes('bottes')
                        const handsEquipped = equippedEpi.includes('gants')
                        const eyesEquipped = equippedEpi.includes('lunettes')
                        const totalProtection = (headEquipped ? 20 : 0) + (bodyEquipped ? 20 : 0) + (feetEquipped ? 20 : 0) + (handsEquipped ? 20 : 0) + (eyesEquipped ? 20 : 0)
                        
                        return (
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] uppercase font-black text-white/50 tracking-wider">
                              <span>Indice de protection global :</span>
                              <span className={`font-mono font-black ${totalProtection === 100 ? 'text-green-400' : 'text-galf-yellow'}`}>{totalProtection}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-500 ${totalProtection === 100 ? 'bg-green-500' : 'bg-galf-yellow'}`} style={{ width: `${totalProtection}%` }} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-[9px] text-white/60">
                              <div className="flex justify-between p-1.5 rounded bg-black/20">
                                <span>🪖 Tête :</span>
                                <span className={headEquipped ? 'text-green-400 font-bold' : 'text-red-400'}>{headEquipped ? '100%' : '0%'}</span>
                              </div>
                              <div className="flex justify-between p-1.5 rounded bg-black/20">
                                <span>🦺 Corps :</span>
                                <span className={bodyEquipped ? 'text-green-400 font-bold' : 'text-red-400'}>{bodyEquipped ? '100%' : '0%'}</span>
                              </div>
                              <div className="flex justify-between p-1.5 rounded bg-black/20">
                                <span>🧤 Mains :</span>
                                <span className={handsEquipped ? 'text-green-400 font-bold' : 'text-red-400'}>{handsEquipped ? '100%' : '0%'}</span>
                              </div>
                              <div className="flex justify-between p-1.5 rounded bg-black/20">
                                <span>🥽 Yeux :</span>
                                <span className={eyesEquipped ? 'text-green-400 font-bold' : 'text-red-400'}>{eyesEquipped ? '100%' : '0%'}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    {/* 4. Badges Cabinet */}
                    <div className="glass-card p-6 rounded-[2rem] border-galf-border">
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <BadgeIcon className="w-3.5 h-3.5" /> Cabinet des Badges GALF
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Gamification</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {badgesList.map((badge, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all group relative ${
                              badge.unlocked 
                                ? 'bg-galf-yellow/5 border-galf-yellow/20 hover:border-galf-yellow/50' 
                                : 'bg-black/40 border-white/5 opacity-30'
                            }`}
                          >
                            <span className={`text-2xl mb-1.5 ${badge.unlocked ? 'animate-pulse' : ''}`}>{badge.icon}</span>
                            <div className="text-[9px] font-black uppercase truncate max-w-full text-white">{badge.name}</div>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full mb-2 bg-slate-900 border border-white/10 text-white rounded-lg p-2 text-[9px] w-28 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-30 font-bold">
                              {badge.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    {/* 5. Cockpit Theme Customizer */}
                    <div className="glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <HardHat className="w-3.5 h-3.5" /> Personnalisation du Cockpit
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Thèmes & Profils</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-white/50 block mb-2">Thème de Couleur</label>
                          <div className="flex gap-2">
                            {(['carbon', 'steel', 'gold'] as const).map(t => (
                              <button
                                key={t}
                                onClick={() => { triggerAudioAlert(600, 0.05); setCockpitTheme(t); }}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                  cockpitTheme === t
                                    ? 'bg-galf-yellow text-galf-carbon border-galf-yellow'
                                    : 'bg-black/30 border-white/5 text-white/60 hover:border-white/20'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-white/50 block mb-2">Avatar de l'Opérateur</label>
                          <div className="grid grid-cols-3 gap-2">
                            {avatars.map((av, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  triggerAudioAlert(600, 0.05);
                                  setSelectedAvatar(av);
                                  setUserName(av.name.toUpperCase());
                                }}
                                className={`p-2 rounded-xl border transition-all flex flex-col items-center gap-1 text-center ${
                                  selectedAvatar.name === av.name
                                    ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow'
                                    : 'bg-black/30 border-white/5 text-white/70 hover:border-white/20'
                                }`}
                              >
                                <span className="text-xl">{av.icon}</span>
                                <span className="text-[8px] font-bold truncate max-w-full block leading-none">{av.name.split(' ')[0]}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 6. Guide Audio Vocal & Accessibilité */}
                    <div className="glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Guide Audio de Formation
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Accessibilité vocal</span>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-4 border border-white/5 flex-1 mb-4 flex flex-col justify-center">
                        <p className="text-[11px] text-white/60 leading-relaxed italic text-center">
                          "{modules[activeModule].title}. Ce module dure environ {modules[activeModule].duration}."
                        </p>
                        
                        {isSpeaking && (
                          <div className="flex justify-center items-center gap-1 mt-3 h-4">
                            {[1, 2, 3, 4, 5].map(i => (
                              <span
                                key={i}
                                className="w-0.5 bg-galf-yellow rounded animate-pulse"
                                style={{
                                  height: `${Math.random() * 100}%`,
                                  animationDuration: `${0.3 + Math.random() * 0.4}s`
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-[10px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-white/50 font-bold uppercase tracking-wider">
                            <span>Vitesse</span>
                            <span>{speakRate.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range" min="0.5" max="2.0" step="0.1" value={speakRate}
                            onChange={(e) => setSpeakRate(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-white/50 font-bold uppercase tracking-wider">
                            <span>Pitch</span>
                            <span>{speakPitch.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range" min="0.5" max="2.0" step="0.1" value={speakPitch}
                            onChange={(e) => setSpeakPitch(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <button
                        onClick={speakModule}
                        className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          isSpeaking 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-galf-yellow text-galf-carbon hover:brightness-110'
                        }`}
                      >
                        {isSpeaking ? "⏹️ Arrêter la lecture" : "🔊 Lire les objectifs (Synthèse Vocale)"}
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    {/* Feature 6: EPI Speed Trial Game */}
                    <div className="glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" /> Défi de Vitesse EPI (10 secondes)
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Speed Challenge</span>
                      </div>

                      <p className="text-[11px] text-white/60 mb-4 leading-relaxed font-sans">
                        Équipez votre opérateur en sélectionnant uniquement les **5 EPI réglementaires** en moins de 10 secondes.
                      </p>

                      {speedGameActive ? (
                        <div>
                          {speedGameStatus === 'idle' ? (
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-white">Sélectionnez les EPI :</span>
                                <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${speedGameTime <= 3 ? 'bg-red-500 text-white animate-pulse' : 'bg-galf-yellow text-galf-carbon'}`}>
                                  ⏱️ {speedGameTime}s
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {speedItemsList.map(item => {
                                  const isSelected = speedGameSelected.includes(item.id)
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => handleToggleSpeedEpi(item.id)}
                                      className={`p-2 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-2 ${
                                        isSelected 
                                          ? 'bg-galf-yellow/20 border-galf-yellow text-galf-yellow' 
                                          : 'bg-black/30 border-white/5 text-white/70 hover:border-white/20'
                                      }`}
                                    >
                                      <span>{item.icon}</span>
                                      <span className="truncate">{item.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ) : speedGameStatus === 'success' ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center my-4">
                              <span className="text-2xl block mb-2">⚡🏆</span>
                              <div className="text-xs font-black text-white uppercase tracking-wider">Défi Réussi !</div>
                              <p className="text-[10px] text-green-300/80 mt-1 font-sans">
                                Vous avez équipé les EPI en {10 - speedGameTime} secondes.
                              </p>
                              {speedBestTime !== null && (
                                <div className="text-[9px] font-mono text-white/40 mt-2">Meilleur temps : {speedBestTime}s</div>
                              )}
                              <button
                                onClick={handleStartSpeedGame}
                                className="mt-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-4 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer"
                              >
                                Rejouer
                              </button>
                            </div>
                          ) : (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center my-4">
                              <span className="text-2xl block mb-2">🚨</span>
                              <div className="text-xs font-black text-white uppercase tracking-wider font-sans">Temps Écoulé !</div>
                              <p className="text-[10px] text-red-300/80 mt-1 font-sans">
                                Vous n'avez pas sélectionné les bons équipements à temps.
                              </p>
                              <button
                                onClick={handleStartSpeedGame}
                                className="mt-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer"
                              >
                                Réessayer
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <button
                            onClick={handleStartSpeedGame}
                            className="bg-galf-yellow text-galf-carbon px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
                          >
                            Lancer le Défi de Vitesse
                          </button>
                        </div>
                      )}

                      <div className="text-[9px] font-mono text-white/30 text-center mt-2">
                        Le port des EPI divise le risque d'accidents graves par 10 sur chantier.
                      </div>
                    </div>

                    {/* Feature 7: Inspection Pré-opérationnelle */}
                    <div className="glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5" /> Inspection Pré-opérationnelle
                        </span>
                        <span className="text-[9px] font-mono text-white/40">Circle Check</span>
                      </div>

                      <div className="mb-4">
                        <div className="flex gap-2 mb-3 bg-black/20 p-1 rounded-lg border border-white/5">
                          {(['pelle', 'grue', 'bulldozer'] as const).map(m => (
                            <button
                              key={m}
                              onClick={() => { triggerAudioAlert(600, 0.05); setInspectMachine(m); handleResetInspection(); }}
                              className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                inspectMachine === m
                                  ? 'bg-galf-yellow text-galf-carbon'
                                  : 'text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          {[
                            { key: 'oil', label: "Vérifier le niveau d'huile moteur" },
                            { key: 'hoses', label: "Inspecter les flexibles hydrauliques" },
                            { key: 'tracks', label: "Contrôler les chenilles / câbles" },
                            { key: 'windshield', label: "Propreté vitrages et cabine" },
                            { key: 'horn', label: "Tester l'avertisseur sonore" }
                          ].map(check => {
                            const done = inspectChecks[check.key]
                            return (
                              <button
                                key={check.key}
                                onClick={() => handleToggleInspect(check.key)}
                                disabled={done || engineStarted}
                                className={`w-full p-2 rounded-xl text-left text-[11px] font-bold border transition-all flex items-center justify-between cursor-pointer ${
                                  done 
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                    : 'bg-black/30 border-white/5 text-white/70 hover:border-white/20'
                                }`}
                              >
                                <span>{check.label}</span>
                                <span>{done ? "✅" : "🔍"}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {engineStarted ? (
                        <div className="bg-galf-yellow/10 border border-galf-yellow/30 rounded-2xl p-3 text-center animate-pulse">
                          <div className="text-xs font-black text-galf-yellow uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-galf-yellow animate-ping" /> MOTEUR EN ROUTE (DIESEL)
                          </div>
                          <button
                            onClick={handleResetInspection}
                            className="mt-2 text-[9px] font-black uppercase tracking-wider text-white/50 hover:text-white cursor-pointer"
                          >
                            Éteindre le moteur
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleStartVirtualEngine}
                          className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md cursor-pointer"
                        >
                          Démarrer le Moteur Virtuel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <FadeIn delay={0.2}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-xl" style={{ color: 'var(--galf-text)' }}>Programme</h3>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow uppercase">6 Modules</span>
                </div>
                <div className="space-y-3">
                  {modules.map((mod, i) => (
                    <button key={i} onClick={() => setActiveModule(i)}
                      className={`w-full text-left p-5 rounded-2xl transition-all relative overflow-hidden group border-2 ${activeModule === i ? 'border-galf-yellow shadow-xl' : 'border-transparent'}`}
                      style={activeModule === i ? { background: 'var(--galf-yellow-glow)' } : { background: 'var(--galf-surface)', border: '1px solid var(--galf-border)' }}>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${mod.completed ? 'bg-green-500/20 text-green-500' : mod.current ? 'bg-galf-yellow text-galf-carbon' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/20'}`}>
                          {mod.completed ? <CheckCircle2 className="w-5 h-5" /> : mod.current ? <Play className="w-4 h-4 fill-current" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-black truncate ${mod.current ? 'text-galf-carbon' : ''}`} style={!mod.current ? { color: 'var(--galf-text)' } : {}}>{mod.title}</div>
                          <div className={`text-[10px] font-bold ${mod.current ? 'text-galf-carbon/60' : 'text-galf-text-muted'}`}>{mod.duration} · {mod.lessons} leçons</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <h3 className="font-black text-xl mb-6" style={{ color: 'var(--galf-text)' }}>Supports de cours</h3>
                <div className="space-y-3">
                  {resources.map((res, i) => (
                    <div key={i} className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-galf-yellow/50 transition-all cursor-pointer group border-galf-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-galf-yellow/5 flex items-center justify-center group-hover:bg-galf-yellow/10 transition-colors">
                          <FileText className="w-6 h-6 text-galf-yellow" />
                        </div>
                        <div>
                          <div className="text-sm font-black" style={{ color: 'var(--galf-text)' }}>{res.title}</div>
                          <div className="text-[10px] uppercase font-bold text-galf-yellow tracking-widest">{res.type} · {res.size}</div>
                        </div>
                      </div>
                      <Download className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" style={{ color: 'var(--galf-text-secondary)' }} />
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

          {/* ═══════════════════════════════════════════════
              WAVE 4 APPRENANT FEATURES: QCM CACES, PORTFOLIO, ECO-DRIVE, ALARMS
             ═══════════════════════════════════════════════ */}
          <div className="grid lg:grid-cols-12 gap-8 mt-12 pt-12 border-t border-galf-border">
            
            {/* 1. QCM CODE CACES WIDGET (5 columns) */}
            <div className="lg:col-span-5 glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between min-h-[380px] relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(255,176,0,0.03),transparent)]">
              {cacesCompleted && cacesScore === 5 && <ConfettiEffect />}
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Préparateur de Code CACES
                  </span>
                  <span className="text-[9px] font-mono text-white/40">5 Questions HSE</span>
                </div>

                {!cacesCompleted ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-white/50 font-bold uppercase tracking-wider">
                      <span>Progression Test</span>
                      <span className={`px-2.5 py-0.5 rounded font-mono font-black ${cacesTimer <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-galf-yellow text-galf-carbon'}`}>
                        ⏱️ {cacesTimer}s
                      </span>
                      <span>Question {cacesQuizStep + 1} / {cacesQuestions.length}</span>
                    </div>

                    <h4 className="text-sm font-black text-white leading-snug min-h-[48px]">
                      {cacesQuestions[cacesQuizStep].q}
                    </h4>

                    <div className="space-y-2.5">
                      {cacesQuestions[cacesQuizStep].options.map((opt, idx) => {
                        const isSelected = cacesSelectedOption === idx
                        const isCorrect = idx === cacesQuestions[cacesQuizStep].correct
                        let btnStyle = "border-white/5 bg-black/30 hover:border-galf-yellow/40 text-white/70 hover:text-white"
                        
                        if (cacesFeedback !== null) {
                          if (isSelected) {
                            btnStyle = cacesFeedback === 'correct'
                              ? "bg-green-500/20 border-green-500 text-green-400 font-bold"
                              : "bg-red-500/20 border-red-500 text-red-400 font-bold"
                          } else if (isCorrect) {
                            btnStyle = "bg-green-500/10 border-green-500/30 text-green-400"
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={cacesFeedback !== null}
                            onClick={() => handleCacesOptionSelect(idx)}
                            className="w-full text-left p-3.5 rounded-xl text-xs border transition-all flex items-center justify-between cursor-pointer border-white/5 bg-black/30 hover:border-galf-yellow/40 text-white/70 hover:text-white"
                            style={{ colorScheme: 'light dark' }}
                          >
                            <span className="flex-1 pr-4">{opt}</span>
                            {cacesFeedback !== null && isCorrect && <span className="text-green-400 font-bold shrink-0">✓</span>}
                          </button>
                        )
                      })}
                    </div>

                    {cacesFeedback !== null && (
                      <div className={`p-3.5 rounded-xl border text-[10px] leading-relaxed transition-all ${
                        cacesFeedback === 'correct' 
                          ? 'bg-green-500/10 border-green-500/20 text-green-300' 
                          : 'bg-red-500/10 border-red-500/20 text-red-300'
                      }`}>
                        <span className="font-black block uppercase mb-1">
                          {cacesFeedback === 'correct' ? "✓ Excellente réponse !" : "✗ Réponse incorrecte"}
                        </span>
                        {cacesQuestions[cacesQuizStep].explain}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <Award className="w-16 h-16 text-galf-yellow mx-auto animate-bounce" />
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Test CACES Terminé !</h4>
                    <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
                      Score : <strong className="text-galf-yellow text-sm">{cacesScore} / {cacesQuestions.length}</strong> ({Math.round((cacesScore / cacesQuestions.length) * 100)}% de réussite).
                      {cacesScore === 5 
                        ? " Félicitations ! Score parfait. Vous maîtrisez les fondamentaux du code de conduite." 
                        : " Quelques règles méritent d'être relues avant le passage de l'examen réel."}
                    </p>
                    <button
                      onClick={handleResetCacesQuiz}
                      className="px-6 py-2.5 bg-galf-yellow text-galf-carbon text-xs font-black uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer"
                    >
                      Recommencer
                    </button>
                  </div>
                )}
              </div>

              {!cacesCompleted && cacesFeedback !== null && (
                <button
                  onClick={handleCacesNextQuestion}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all mt-4 cursor-pointer"
                >
                  {cacesQuizStep === cacesQuestions.length - 1 ? "Voir les résultats" : "Question suivante →"}
                </button>
              )}
            </div>

            {/* 2. PORTFOLIO & ECO-DRIVING (7 columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Feature 6: Operator Machine Portfolio */}
              <div className="glass-card p-6 rounded-[2rem] border-galf-border">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Mon Portfolio d'Engins Conduit
                  </span>
                  <span className="text-[9px] font-mono text-white/40">Heures de vol</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { name: "Pelle Hydraulique", hours: "45 heures", level: "Expert", progress: 90, icon: "🏗️", unlocked: true },
                    { name: "Grue à Tour", hours: "32 heures", level: "Avancé", progress: 65, icon: "🏗️", unlocked: true },
                    { name: "Bulldozer D6", hours: "10 heures", level: "Débutant", progress: 20, icon: "🚜", unlocked: false }
                  ].map((mach, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] ${
                      mach.unlocked 
                        ? 'bg-black/30 border-white/10 hover:border-galf-yellow/30' 
                        : 'bg-black/60 border-white/5 opacity-40'
                    }`}>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-2xl">{mach.icon}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                            mach.unlocked ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                          }`}>
                            {mach.unlocked ? "Validé" : "En cours"}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white">{mach.name}</h4>
                        <span className="text-[9px] text-white/50 font-bold block mt-0.5">{mach.hours} conduites</span>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-[8px] font-bold text-white/40 mb-1">
                          <span>Maîtrise : {mach.level}</span>
                          <span>{mach.progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-galf-yellow h-full transition-all" style={{ width: `${mach.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco-Conduite & Alerte Sonore side-by-side grid */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Feature 7: Eco-Conduite carbon calculator */}
                <div className="glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Bilan Carbone Éco-Conduite
                      </span>
                      <span className="text-[9px] font-mono text-white/40">Émissions</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-bold text-white/50">
                          <span>Vitesse de déplacement</span>
                          <span>{ecoSpeed} km/h</span>
                        </div>
                        <input
                          type="range" min="5" max="30" value={ecoSpeed}
                          onChange={(e) => setEcoSpeed(Number(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-bold text-white/50">
                          <span>Temps de veille moteur</span>
                          <span>{ecoIdle} min/h</span>
                        </div>
                        <input
                          type="range" min="5" max="45" value={ecoIdle}
                          onChange={(e) => setEcoIdle(Number(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between bg-black/20 p-3.5 rounded-xl border border-white/5">
                    <div className="text-left">
                      <span className="text-[8px] font-black text-white/40 uppercase block">CO2 Économisé</span>
                      <span className="text-sm font-black text-green-400">
                        {((30 - ecoSpeed) * 1.5 + (45 - ecoIdle) * 2.2).toFixed(0)} kg / mois
                      </span>
                    </div>

                    <span className="text-[9px] font-black text-galf-yellow bg-galf-yellow/10 border border-galf-yellow/20 px-2 py-1 rounded uppercase">
                      {ecoIdle <= 15 ? "🌱 Éco-Expert" : "⚠️ Ralenti Élevé"}
                    </span>
                  </div>
                </div>

                {/* Feature 8: Safety Sound Alerts reader */}
                <div className="glass-card p-6 rounded-[2rem] border-galf-border flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-galf-yellow flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Alarmes Sécurité Chantier
                      </span>
                      <span className="text-[9px] font-mono text-white/40">Web Audio API</span>
                    </div>

                    <p className="text-[9px] text-white/50 mb-3 leading-relaxed font-sans">
                      Écoutez les signaux d'urgence sonores pour apprendre à les identifier en cabine réelle.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'recul', label: "🚨 Bip de Recul" },
                        { key: 'evac', label: "📢 Évacuation" },
                        { key: 'surcharge', label: "⚠️ Surcharge" },
                        { key: 'rumble', label: "🚜 Régime Moteur" }
                      ].map((siren) => {
                        const isActive = activeSiren === siren.key
                        return (
                          <button
                            key={siren.key}
                            type="button"
                            onClick={() => {
                              if (isActive) handleStopSiren()
                              else handlePlaySiren(siren.key as any)
                            }}
                            className={`p-2 rounded-lg text-[10px] font-bold border transition-all text-left truncate cursor-pointer ${
                              isActive
                                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse font-black'
                                : 'bg-black/30 border-white/5 text-white/70 hover:border-white/20'
                            }`}
                          >
                            {siren.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {activeSiren && (
                    <button
                      onClick={handleStopSiren}
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Couper le son d'alarme
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      ) : (
          /* CERTIFICATIONS TAB */
          <div className="max-w-5xl mx-auto">
             <FadeIn>
               {!isWaiverSigned ? (
                  <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-galf-yellow/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
                    <h2 className="text-3xl font-black mb-4 text-white flex items-center gap-2">
                      <ShieldAlert className="text-galf-yellow w-8 h-8" /> Signature du Règlement de Sécurité Obligatoire
                    </h2>
                    <p className="text-xs text-white/60 mb-6 leading-relaxed">
                      Conformément à la réglementation ivoirienne sur la conduite des engins lourds, vous devez signer numériquement notre charte de sécurité avant d'éditer votre certificat.
                    </p>

                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4 mb-6 max-h-48 overflow-y-auto text-xs text-white/70 leading-relaxed font-mono">
                      <p className="font-bold text-galf-yellow text-center mb-2">RÈGLEMENT DE SÉCURITÉ ET CHARTE DE BONNE CONDUITE GALF FORMATION</p>
                      <p>1. Je m'engage à porter systématiquement mes Équipements de Protection Individuelle (Casque, Gilet réfléchissant, Bottes de sécurité) sur tous les chantiers d'apprentissage.</p>
                      <p>2. Je certifie avoir pris connaissance des procédures d'urgence et de coupure hydraulique de mon engin.</p>
                      <p>3. Je m'engage à effectuer l'inspection pré-opérationnelle complète de ma machine avant chaque session pratique.</p>
                      <p>4. Je promets de respecter strictement les consignes verbales et gestuelles de mon instructeur GALF.</p>
                      <p>5. Toute fausse déclaration ou non-respect de ces règles peut entraîner la suspension immédiate de l'attestation de réussite.</p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-start gap-3 text-xs text-white/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={waiverChecked}
                          onChange={(e) => setWaiverChecked(e.target.checked)}
                          className="mt-1 accent-galf-yellow rounded border-white/10 bg-black/40"
                        />
                        <span>J'accepte sans réserve les termes du règlement de sécurité GALF.</span>
                      </label>

                      <div className="flex flex-col gap-4 max-w-md mb-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">
                            Nom Complet pour le Certificat
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: JEAN KOUADIO"
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">
                            Signature Manuscrite (Dessinez dans le cadre ci-dessous)
                          </label>
                          <div className="relative border border-white/10 rounded-xl overflow-hidden bg-white">
                            <canvas
                              ref={signatureCanvasRef}
                              width={400}
                              height={150}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="w-full h-[150px] cursor-crosshair touch-none"
                            />
                            <button
                              type="button"
                              onClick={clearSignature}
                              className="absolute top-2 right-2 px-2.5 py-1 rounded bg-red-600 text-white text-[9px] font-black uppercase tracking-wider transition-all"
                            >
                              Effacer
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!waiverChecked) {
                            alert("Veuillez cocher la case d'acceptation du règlement.")
                            return
                          }
                          if (!signatureName.trim()) {
                            alert("Veuillez saisir votre nom pour signer numériquement.")
                            return
                          }
                          const canvas = signatureCanvasRef.current
                          if (canvas) {
                            setSignatureImg(canvas.toDataURL())
                            setUserName(signatureName.trim().toUpperCase())
                          }
                          triggerAudioAlert(880, 0.25)
                          setIsWaiverSigned(true)
                        }}
                        className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                      >
                        Signer et Débloquer mon Diplôme
                      </button>
                    </div>
                  </div>
               ) : !showCertificate ? (
                  <div className="glass-card p-12 rounded-[2.5rem] text-center border-galf-yellow/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-galf-border">
                      <div className="h-full bg-galf-yellow transition-all duration-[3000ms]" style={{ width: isGenerating ? '100%' : '33%' }} />
                    </div>
                    
                    <Award className={`w-24 h-24 mx-auto mb-8 transition-all duration-1000 ${isGenerating ? 'text-galf-yellow scale-125 animate-pulse' : 'text-galf-text-muted opacity-40'}`} />
                    <h2 className="text-4xl font-black mb-4 tracking-tighter" style={{ color: 'var(--galf-text)' }}>Certificat d'Excellence GALF</h2>
                    <p className="text-lg max-w-md mx-auto mb-12" style={{ color: 'var(--galf-text-secondary)' }}>
                      {isGenerating 
                       ? "Génération de votre certificat sécurisé en cours... Nous vérifions vos scores et validations." 
                       : "Vous avez complété la formation avec brio. Réclamez votre certification officielle maintenant."}
                    </p>
                    
                    <button 
                     disabled={isGenerating}
                     onClick={handleGenerateCertificate}
                     className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-2xl font-black text-xl hover:brightness-110 transition-all shadow-2xl shadow-galf-yellow/30 disabled:opacity-50"
                    >
                      {isGenerating ? "Moteur de génération IA actif..." : "Générer mon Certificat Officiel"}
                    </button>
                  </div>
               ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="glass-card p-5 rounded-[3rem] border-galf-yellow/40 shadow-[0_50px_150px_-20px_rgba(0,0,0,0.6)]"
                  >
                    <div ref={certificateRef} className="bg-white p-12 md:p-24 rounded-[2rem] relative overflow-hidden text-[#1a1a1a] font-serif shadow-inner">
                       {/* Premium Background Pattern */}
                       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                       <div className="absolute inset-0 border-[40px] border-double border-galf-yellow/10 pointer-events-none" />
                       
                       {/* Decorative Corner Ornaments */}
                       <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-galf-yellow" />
                       <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-galf-yellow" />
                       
                       <div className="text-center relative z-10">
                         <div className="flex justify-center mb-10">
                           <div className="w-20 h-20 rounded-xl bg-galf-carbon flex items-center justify-center p-4">
                              <HardHat className="text-galf-yellow w-full h-full" />
                           </div>
                         </div>

                         <div className="text-galf-yellow font-black text-2xl mb-4 tracking-[0.4em] uppercase font-sans">Attestation de Réussite</div>
                         <h3 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter text-galf-carbon font-sans">EXCELLENCE <span className="text-galf-yellow">BTP</span></h3>
                         
                         <div className="w-32 h-1 bg-galf-yellow mx-auto mb-12" />
                         
                         <p className="text-2xl mb-4 italic">Ce document certifie officiellement que</p>
                         <div className="text-5xl md:text-6xl font-black mb-12 uppercase text-galf-carbon border-b-4 border-galf-carbon/10 inline-block px-16 pb-4 font-sans tracking-tight">
                           {userName}
                         </div>
                         
                         <p className="text-xl mb-16 max-w-3xl mx-auto leading-relaxed">
                           A complété avec succès le cycle de formation de niveau expert sur <strong>{certData.course}</strong>. 
                           Le titulaire est reconnu apte à la manipulation technique avancée et à l'application rigoureuse des normes <strong>HSE</strong> internationales de chantier.
                         </p>
                         
                         <div className="flex flex-col md:flex-row justify-between items-center mt-20 gap-12">
                           <div className="text-center md:text-left order-2 md:order-1">
                             <div className="font-black text-2xl font-sans text-galf-carbon">GALF Formation CI</div>
                             <div className="text-sm uppercase font-bold tracking-widest text-galf-yellow mb-4">Le comité pédagogique</div>
                             <div className="w-48 h-20 bg-galf-yellow/5 rounded-xl border border-dashed border-galf-yellow/20 flex items-center justify-center overflow-hidden">
                                 {signatureImg ? (
                                   <img src={signatureImg} alt="Signature Digitale" className="max-w-full max-h-full object-contain" />
                                 ) : (
                                   <span className="text-galf-yellow/40 italic font-bold">Signature Digitale</span>
                                 )}
                              </div>
                           </div>

                           <div className="order-1 md:order-2">
                              {/* Central Seal */}
                              <div className="w-40 h-40 rounded-full bg-galf-yellow flex items-center justify-center shadow-2xl relative">
                                 <div className="absolute inset-2 border-2 border-white/40 rounded-full" />
                                 <div className="absolute inset-4 border-2 border-galf-carbon/10 rounded-full border-dashed" />
                                 <div className="text-galf-carbon text-center">
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-1">Authentifié</div>
                                    <Award className="w-10 h-10 mx-auto mb-1" />
                                    <div className="text-[10px] font-black uppercase tracking-widest">GALF 2024</div>
                                 </div>
                              </div>
                           </div>

                           <div className="text-center md:text-right order-3">
                              <div className="w-24 h-24 bg-white border-2 border-galf-carbon/10 p-2 mx-auto md:ml-auto mb-4 rounded-lg flex items-center justify-center">
                                 {/* Mock QR Code */}
                                 <div className="w-full h-full opacity-60 flex flex-wrap gap-0.5">
                                    {Array.from({length: 64}).map((_, i) => (
                                      <div key={i} className={`w-[11.5%] h-[11.5%] ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                    ))}
                                 </div>
                              </div>
                              <div className="font-bold text-sm text-galf-carbon font-sans">Vérification ID: <span className="text-galf-yellow">{certData.id}</span></div>
                              <div className="text-xs opacity-60 font-sans">Délivré à Abidjan le {certData.date}</div>
                           </div>
                         </div>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-16 mb-8 px-12">
                      <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex-1 bg-galf-yellow text-galf-carbon px-12 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl shadow-galf-yellow/20 disabled:opacity-50 group"
                      >
                        <Download className={`w-6 h-6 ${isDownloading ? 'animate-bounce' : 'group-hover:-translate-y-1 transition-transform'}`} /> 
                        {isDownloading ? "Traitement HD en cours..." : "Télécharger mon Diplôme (PDF Ultra-HD)"}
                      </button>
                      <button 
                        onClick={() => {
                          setShowQrScanner(true);
                          setQrScanProgress(0);
                          setQrScanResult(null);
                          triggerAudioAlert(880, 0.15);
                        }}
                        className="glass-card flex-1 px-12 py-5 rounded-[1.5rem] font-black text-lg text-slate-900 dark:text-white flex items-center justify-center gap-3 hover:border-galf-yellow/50 transition-all group"
                      >
                        <Award className="w-6 h-6 group-hover:scale-110 transition-transform text-galf-yellow animate-pulse" /> Simuler Scan QR
                      </button>
                      <button className="glass-card flex-1 px-12 py-5 rounded-[1.5rem] font-black text-lg text-slate-900 dark:text-white flex items-center justify-center gap-3 hover:border-galf-yellow/50 transition-all group">
                        <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Propulser sur LinkedIn
                      </button>
                    </div>
                    
                    <div className="text-center pb-8 opacity-40 text-xs font-bold uppercase tracking-[0.3em]">
                       Validation sécurisée par GALF Blockchain Services
                    </div>
                  </motion.div>
               )}
             </FadeIn>

             {/* Feature 8: Certificate Verifier Widget */}
             <div className="glass-card p-8 rounded-[2.5rem] border-galf-border mt-12">
               <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                 <Award className="text-galf-yellow w-6 h-6" /> Vérificateur Public de Certificat
               </h3>
               <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                 Outil d'accès public permettant aux recruteurs et partenaires industriels de vérifier l'authenticité d'une attestation de formation émise par GALF.
               </p>

               <form onSubmit={handleVerifyCertificate} className="flex flex-col sm:flex-row gap-4 mb-6">
                 <input
                   type="text"
                   placeholder="Saisissez l'identifiant du certificat (Ex: GALF-PELLE-2026)"
                   value={verifyCode}
                   onChange={(e) => setVerifyCode(e.target.value)}
                   className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow font-mono uppercase"
                 />
                 <button
                   type="submit"
                   className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shrink-0 cursor-pointer"
                 >
                   Vérifier le diplôme
                 </button>
               </form>

               {verifyResult && (
                 <div className="bg-black/40 border border-white/5 p-6 rounded-2xl animate-fadeIn">
                   {verifyResult.status === 'AUTHENTIQUE' ? (
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <div>
                         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-3 bg-green-500/10 border border-green-500/30 text-green-500">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                           {verifyResult.status}
                         </div>
                         <h4 className="text-lg font-black text-white">{verifyResult.name}</h4>
                         <p className="text-xs text-white/70 mt-1 font-sans">
                           Formation : <strong>{verifyResult.course}</strong> · Moyenne : <strong>{verifyResult.score}</strong>
                         </p>
                       </div>
                       <div className="text-[10px] text-white/40 font-mono self-end sm:self-auto text-right">
                         Émis le {verifyResult.date}
                       </div>
                     </div>
                   ) : (
                     <div className="flex items-center gap-3 text-red-500">
                       <ShieldAlert className="w-6 h-6 shrink-0" />
                       <div>
                         <div className="text-xs font-black uppercase tracking-wider font-sans">CERTIFICAT INTROUVABLE</div>
                         <p className="text-[10px] text-red-400 mt-0.5 font-sans">Aucune correspondance dans notre registre d'attestations sécurisées.</p>
                       </div>
                     </div>
                   )}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      {showQrScanner && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-[150] p-4 animate-fadeIn">
          <style>{`
            @keyframes scan {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            .animate-scan-line {
              position: absolute;
              animation: scan 2.5s linear infinite;
            }
          `}</style>
          
          <div className="w-full max-w-md bg-galf-carbon border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">Simulation de Numérisation QR Code</h3>
            <p className="text-xs text-white/50 mb-6 font-sans">Cadre photo-détecteur actif. Analyse des clés de chiffrement...</p>

            {/* Scanner Animation Box */}
            <div className="relative w-64 h-64 border-2 border-dashed border-galf-yellow/30 mx-auto rounded-3xl overflow-hidden bg-black/60 flex items-center justify-center mb-6">
              {qrScanResult === null ? (
                <>
                  {/* Laser line scanning */}
                  <div className="absolute left-0 w-full h-1 bg-galf-yellow shadow-[0_0_15px_#FFB000] animate-scan-line z-10" />
                  
                  {/* Corner ornaments */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-galf-yellow" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-galf-yellow" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-galf-yellow" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-galf-yellow" />
                  
                  {/* Progress Ring or percentage */}
                  <div className="text-center z-20">
                    <span className="text-4xl block">📸</span>
                    <span className="block text-xs font-mono font-black text-galf-yellow mt-2">{qrScanProgress}%</span>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-4 animate-fadeIn z-20">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-wider block">Certificat Authentique</span>
                    <span className="text-[10px] font-mono text-green-400 mt-1 block">ID: {certData.id}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {qrScanResult === 'AUTHENTIQUE' ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                    L'attestation de réussite pour <strong>{userName}</strong> ({certData.course}) est enregistrée dans nos registres sécurisés.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setShowQrScanner(false);
                        router.push(`/verification-certificat?id=${certData.id}`);
                      }}
                      className="flex-1 bg-galf-yellow text-galf-carbon py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
                    >
                      Ouvrir la Fiche Publique
                    </button>
                    <button 
                      onClick={() => setShowQrScanner(false)}
                      className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowQrScanner(false)}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Annuler la numérisation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
