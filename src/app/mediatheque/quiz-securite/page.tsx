"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, Share2, 
  HardHat, RefreshCw, ChevronRight, Award, ShieldAlert, Volume2, VolumeX
} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { motion, AnimatePresence } from 'framer-motion'

// CACES Question Bank
const QUIZ_BANKS = {
  pelle: {
    title: "Pelle Hydraulique (CACES R482 B1)",
    questions: [
      {
        q: "Quelle est la distance minimale de sécurité à respecter par rapport aux lignes électriques aériennes de moyenne tension (< 50 kV) ?",
        options: [
          "1 mètre",
          "3 mètres (distance réglementaire)",
          "5 mètres"
        ],
        correct: 1,
        explain: "Pour les lignes de moyenne tension (< 50 kV), la distance minimale de sécurité réglementaire est de 3 mètres pour parer à tout risque d'amorçage d'arc électrique."
      },
      {
        q: "Lors du stationnement d'une pelle hydraulique en fin de journée, comment doit être positionné le godet ?",
        options: [
          "Suspendu à 1 mètre de haut pour éviter les chocs au démarrage",
          "Posé à plat sur le sol, dents vers le bas, équipement replié",
          "Bloqué en l'air contre la cabine"
        ],
        correct: 1,
        explain: "L'équipement doit toujours être posé à plat au sol pour annuler toute pression et énergie potentielle résiduelle dans les vérins hydrauliques."
      },
      {
        q: "Quelle pente maximale est généralement tolérée pour l'évolution d'une pelle sur chenilles standard ?",
        options: [
          "15% (ou 15 degrés)",
          "30% (environ 30 degrés) selon le constructeur",
          "60% en toutes circonstances"
        ],
        correct: 1,
        explain: "Les pelles sur chenilles tolèrent des pentes importantes (jusqu'à 30% ou 30 degrés selon les modèles), mais les manœuvres doivent être très douces et le godet maintenu près du sol."
      },
      {
        q: "Que signifie le terme 'VGP' dans le contexte des engins de chantier ?",
        options: [
          "Vitesse Générale de Pivotement",
          "Vérification Générale Périodique (obligatoire tous les 6 ou 12 mois)",
          "Valve de Gavage de Pression"
        ],
        correct: 1,
        explain: "La VGP désigne la Vérification Générale Périodique, un contrôle de sécurité périodique obligatoire pour s'assurer du bon état de l'engin."
      },
      {
        q: "Quel est l'effet d'une chenille trop lâche sur une pelle hydraulique ?",
        options: [
          "Elle augmente la vitesse maximale de translation",
          "Elle risque de décheniller lors de virages sur sol instable",
          "Elle réduit les émissions de CO2 de 10%"
        ],
        correct: 1,
        explain: "Une chenille trop lâche présente un risque élevé de déchenillage, en particulier sur les sols meubles ou caillouteux lors des rotations."
      },
      {
        q: "Lors du levage d'une charge avec une pelle, quel accessoire doit obligatoirement être utilisé ?",
        options: [
          "Un crochet soudé d'origine sur le godet ou la biellette",
          "Une élingue enroulée directement autour des dents du godet",
          "Un simple câble en acier noué au bras"
        ],
        correct: 0,
        explain: "Toute opération de levage nécessite d'utiliser le crochet de levage homologué avec son linguet de sécurité, et jamais d'enrouler des élingues autour des dents du godet."
      },
      {
        q: "Pour réduire la consommation de gazole (éco-conduite), quelle règle s'applique à l'arrêt ?",
        options: [
          "Laisser le moteur tourner à plein régime pour garder la pression d'huile",
          "Couper le contact lors d'un arrêt prolongé supérieur à 3 minutes (anti-idle)",
          "Activer tous les mouvements hydrauliques simultanément"
        ],
        correct: 1,
        explain: "Couper le moteur lors des arrêts prolongés évite le gaspillage de carburant et réduit considérablement l'usure de l'engin et les émissions de carbone."
      },
      {
        q: "Que indique une fumée d'échappement noire et dense sur une pelle diesel ?",
        options: [
          "Une combustion trop propre",
          "Un problème d'injection ou un filtre à air colmaté (mélange trop riche en carburant)",
          "Un niveau d'huile hydraulique insuffisant"
        ],
        correct: 1,
        explain: "Une fumée noire indique un excès de carburant non brûlé, souvent causé par un manque d'air (filtre colmaté) ou un injecteur défectueux."
      },
      {
        q: "Dans quel sens doit-on orienter la cabine lorsqu'on charge un camion-benne ?",
        options: [
          "Faire passer le godet au-dessus de la cabine du chauffeur du camion",
          "Toujours charger par l'arrière ou le côté opposé à la cabine du camion",
          "Klaxonner en continu pendant la rotation"
        ],
        correct: 1,
        explain: "Pour des raisons évidentes de sécurité, le godet chargé ne doit jamais survoler la cabine du camion ou des personnes à pied."
      },
      {
        q: "Quel EPI est obligatoire lors de toute intervention de graissage des axes de la flèche ?",
        options: [
          "Un gilet de sauvetage",
          "Des gants de protection et des lunettes de sécurité (risques de projections)",
          "Des chaussures de ville souples"
        ],
        correct: 1,
        explain: "Le graissage expose à des pressions résiduelles et des produits irritants. Porter des gants et lunettes est indispensable pour éviter des blessures oculaires ou dermatologiques."
      }
    ]
  },
  grue: {
    title: "Grue à Tour (CACES R487 / R483)",
    questions: [
      {
        q: "À partir de quelle vitesse de vent le travail d'une grue à tour doit-il obligatoirement être interrompu ?",
        options: [
          "50 km/h",
          "72 km/h (selon la réglementation standard)",
          "100 km/h"
        ],
        correct: 1,
        explain: "Au-delà d'un vent de 72 km/h, la stabilité et le contrôle de la charge suspendue sont menacés. La grue doit être mise hors service et configurée en girouette."
      },
      {
        q: "Que signifie mettre une grue à tour en 'girouette' en fin de journée ?",
        options: [
          "Serrer le frein d'orientation au maximum",
          "Laisser la grue libre de tourner au vent pour réduire la prise au vent du mât",
          "Orienter la flèche face au coucher du soleil"
        ],
        correct: 1,
        explain: "Mettre la flèche en girouette (frein desserré) permet à la flèche de s'aligner naturellement avec le vent, minimisant ainsi le couple de torsion appliqué au mât."
      },
      {
        q: "Que représente la 'courbe de charge' d'une grue à tour ?",
        options: [
          "Le coût annuel de l'électricité consommée par le moteur de levage",
          "La relation entre la portée (distance du mât) et la charge maximale autorisée",
          "L'usure du câble de levage en fonction du temps"
        ],
        correct: 1,
        explain: "La courbe de charge indique que plus le chariot s'éloigne du mât (grande portée), plus la capacité de levage maximale diminue pour éviter le basculement."
      },
      {
        q: "Quel signal correspond à l'écarquillement des bras levés au-dessus de la tête ?",
        options: [
          "Lever la charge lentement",
          "Arrêt d'urgence immédiat !",
          "Descendre le chariot"
        ],
        correct: 1,
        explain: "Les bras croisés ou levés au-dessus de la tête est le signal international dictant un arrêt d'urgence. Tout grutier doit y obéir immédiatement."
      },
      {
        q: "Qu'est-ce que le 'mouflage' d'une grue ?",
        options: [
          "Le système de réduction mécanique par poulies pour multiplier la force de levage",
          "Le nettoyage périodique du mât de la grue",
          "La lubrification des moteurs d'orientation"
        ],
        correct: 0,
        explain: "Le mouflage fait passer le câble dans plusieurs poulies. Il permet de soulever des charges plus lourdes au détriment de la vitesse de levage (mouflage 4 brins vs 2 brins)."
      },
      {
        q: "Quel organe de sécurité coupe le mouvement si la charge dépasse la capacité de la grue à une portée donnée ?",
        options: [
          "Le limiteur de moment de renversement (LMR)",
          "L'anémomètre",
          "Le bouton de klaxon cabine"
        ],
        correct: 0,
        explain: "Le limiteur de moment coupe automatiquement la levée et la distribution si la charge menace de dépasser la stabilité maximale de l'installation."
      },
      {
        q: "Quelle est la fonction première de l'anémomètre installé au sommet de la grue ?",
        options: [
          "Mesurer la température de l'air",
          "Mesurer la vitesse du vent en temps réel",
          "Calculer le taux d'humidité de la flèche"
        ],
        correct: 1,
        explain: "L'anémomètre mesure la vitesse du vent pour alerter le grutier par une alarme visuelle et sonore dès que des seuils critiques (50 et 72 km/h) sont atteints."
      },
      {
        q: "Quelle précaution doit-on prendre avant d'élinguer une charge métallique lisse (tubes, plaques) ?",
        options: [
          "Aucune, les câbles adhèrent sur le métal",
          "Utiliser des protections d'angle (fourreaux) pour éviter de couper ou d'endommager les élingues textiles",
          "Mouiller la charge avec de l'eau"
        ],
        correct: 1,
        explain: "Les arêtes métalliques peuvent couper les élingues en nylon sous tension. Utiliser des fourreaux de protection est obligatoire pour préserver l'élingage."
      },
      {
        q: "Que doit faire le grutier si une personne pénètre dans la zone de survol de la charge ?",
        options: [
          "Continuer prudemment sans rien dire",
          "Klaxonner pour avertir et arrêter la manœuvre si la personne ne s'écarte pas",
          "Lancer un outil depuis la cabine pour alerter"
        ],
        correct: 1,
        explain: "Le survol de personnes est strictement interdit. Le grutier doit klaxonner pour donner l'alerte et immobiliser la charge hors de danger."
      },
      {
        q: "Comment contrôle-t-on le balancement d'une charge lors d'une translation de flèche ?",
        options: [
          "En effectuant un contre-appel (petit mouvement d'orientation inverse en fin de course)",
          "En descendant la charge rapidement pour la freiner au sol",
          "En tournant la flèche dans le sens inverse du vent"
        ],
        correct: 0,
        explain: "Pour stabiliser une charge qui balance, le grutier effectue des mouvements correctifs synchronisés (contre-appels) pour aligner la tête de flèche avec le centre d'inertie de la charge."
      }
    ]
  },
  chariot: {
    title: "Chariot Élévateur (CACES R489)",
    questions: [
      {
        q: "Où se situe le centre de gravité d'un chariot élévateur à vide ?",
        options: [
          "Très haut dans le mât de levage",
          "Bas et plutôt vers l'arrière (au niveau du contrepoids)",
          "Exactement sous le siège de l'opérateur"
        ],
        correct: 1,
        explain: "Le contrepoids situé à l'arrière déplace le centre de gravité d'un chariot vide vers l'arrière. Ce centre avance et remonte au fur et à mesure que l'on charge les fourches."
      },
      {
        q: "Dans quelle position doivent être les fourches lors des déplacements du chariot ?",
        options: [
          "À 50 cm de hauteur pour mieux voir les obstacles",
          "À environ 15-20 cm du sol (hauteur de sécurité), mât incliné en arrière",
          "Posées à plat sur le sol"
        ],
        correct: 1,
        explain: "La hauteur de sécurité (15 à 20 cm) maintient la charge basse, abaissant le centre de gravité et minimisant les risques de basculement tout en conservant une bonne visibilité."
      },
      {
        q: "Comment doit-on descendre une pente prononcée (>10%) avec un chariot élévateur chargé ?",
        options: [
          "En marche avant, fourches relevées",
          "En marche arrière (la charge face à la montée pour éviter qu'elle ne glisse)",
          "Au point mort (roue libre)"
        ],
        correct: 1,
        explain: "En descente, un chariot chargé doit reculer pour que la charge reste appuyée contre le dossier de fourches et éviter le basculement frontal."
      },
      {
        q: "Que représente le 'triangle de stabilité' d'un chariot à 3 roues ?",
        options: [
          "Les trois angles formés par les fourches",
          "La zone formée par la roue directrice arrière et les deux roues motrices avant",
          "La forme du contrepoids arrière"
        ],
        correct: 1,
        explain: "Le triangle de stabilité relie les points d'appui au sol. Si le centre de gravité combiné (chariot + charge) sort de ce triangle, le chariot se renverse."
      },
      {
        q: "Quelle plaque doit-on consulter pour vérifier si l'on peut lever une palette de 2 tonnes à 4 mètres ?",
        options: [
          "La plaque constructeur du moteur",
          "La plaque de capacité de charge (ou diagramme de charge)",
          "Le manuel d'entretien hydraulique"
        ],
        correct: 1,
        explain: "Le diagramme de charge indique la charge maximale admissible en fonction de la hauteur de levage et de la distance du centre de gravité de la palette (CDG)."
      },
      {
        q: "Quelle est la principale cause de renversement latéral d'un chariot élévateur ?",
        options: [
          "Une vitesse excessive dans les virages, surtout à vide",
          "Une charge trop lourde soulevée bien droite",
          "Un pneu trop gonflé à l'arrière"
        ],
        correct: 0,
        explain: "La force centrifuge dans un virage rapide déplace latéralement le centre de gravité hors du triangle de stabilité, provoquant le renversement immédiat du chariot."
      },
      {
        q: "À quoi sert le bouton d'arrêt d'urgence de type 'coup de poing' sur un chariot électrique ?",
        options: [
          "À klaxonner plus fort",
          "À couper instantanément l'alimentation électrique de puissance pour stopper l'engin en cas de danger",
          "À bloquer uniquement le mât de levage"
        ],
        correct: 1,
        explain: "Le bouton coup de poing coupe le circuit principal d'alimentation de l'engin pour prévenir tout mouvement incontrôlable ou échauffement."
      },
      {
        q: "Quelle précaution prendre avant de descendre du chariot élévateur ?",
        options: [
          "Laisser le moteur tourner pour ne pas user la batterie",
          "Serrer le frein de stationnement, abaisser les fourches au sol et couper le contact",
          "Relever le mât au maximum pour sécuriser la zone"
        ],
        correct: 1,
        explain: "L'opérateur ne doit quitter un chariot que s'il est immobilisé : freins serrés, fourches au sol pour éviter les trébuchements, clés retirées pour éviter tout usage non autorisé."
      },
      {
        q: "Que devez-vous vérifier en priorité concernant les fourches lors de l'inspection journalière ?",
        options: [
          "Leur couleur",
          "L'absence de fissures (notamment au talon) et de déformation permanente",
          "Leur largeur exacte"
        ],
        correct: 1,
        explain: "Le talon des fourches subit des contraintes énormes. L'apparition de fissures à cet endroit menace directement la résistance mécanique et peut provoquer la chute brutale d'une charge."
      },
      {
        q: "Peut-on transporter un passager sur un chariot élévateur standard ?",
        options: [
          "Oui, debout sur le contrepoids pour faire contrepoids supplémentaire",
          "Non, c'est strictement interdit sauf s'il existe un siège passager homologué constructeur",
          "Uniquement s'il se tient fermement au mât de levage"
        ],
        correct: 1,
        explain: "Le transport de personnes sur les fourches ou le châssis d'un chariot standard est formellement interdit et constitue une cause majeure d'accidents mortels."
      }
    ]
  }
}

export default function QuizSecuritePage() {
  const [category, setCategory] = useState<'pelle' | 'grue' | 'chariot' | null>(null)
  const [step, setStep] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizDone, setQuizDone] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [userName, setUserName] = useState("")
  const [badgeSaved, setBadgeSaved] = useState(false)
  const [badgeId, setBadgeId] = useState("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Web Audio Synth for Retro Game sounds
  const playSound = (type: 'correct' | 'wrong' | 'fanfare' | 'tick') => {
    if (!soundEnabled) return
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      const now = ctx.currentTime
      const gain = ctx.createGain()
      gain.connect(ctx.destination)

      if (type === 'correct') {
        const osc = ctx.createOscillator()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(523.25, now) // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16) // G5
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.35)
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(180, now)
        osc.frequency.linearRampToValueAtTime(100, now + 0.4)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.4)
      } else if (type === 'fanfare') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]
        notes.forEach((f, i) => {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(f, now + i * 0.08)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.04, now + i * 0.08)
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4)
          osc.connect(g)
          g.connect(ctx.destination)
          osc.start(now + i * 0.08)
          osc.stop(now + i * 0.08 + 0.4)
        })
      } else if (type === 'tick') {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1000, now)
        gain.gain.setValueAtTime(0.015, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.03)
      }
      setTimeout(() => ctx.close(), 600)
    } catch {}
  }

  // Timer loop
  useEffect(() => {
    if (!category || quizDone || answered) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleTimeout()
          return 0
        }
        if (prev <= 6) {
          playSound('tick')
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, step, quizDone, answered])

  const handleTimeout = () => {
    setSelectedIdx(-1) // marked as skipped / wrong
    setAnswered(true)
    playSound('wrong')
  }

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIdx(idx)
    setAnswered(true)
    if (timerRef.current) clearInterval(timerRef.current)

    const bank = QUIZ_BANKS[category!]
    const isCorrect = idx === bank.questions[step].correct
    if (isCorrect) {
      setScore(prev => prev + 1)
      playSound('correct')
    } else {
      playSound('wrong')
    }
  }

  const handleNext = () => {
    const bank = QUIZ_BANKS[category!]
    if (step < bank.questions.length - 1) {
      setStep(prev => prev + 1)
      setSelectedIdx(null)
      setAnswered(false)
      setTimeLeft(30)
    } else {
      setQuizDone(true)
      playSound('fanfare')
      setBadgeId(`GALF-BADGE-${Math.floor(100000 + Math.random() * 900000)}`)
    }
  }

  const handleReset = () => {
    setCategory(null)
    setStep(0)
    setSelectedIdx(null)
    setAnswered(false)
    setScore(0)
    setTimeLeft(30)
    setQuizDone(false)
    setBadgeSaved(false)
    setUserName("")
  }

  const activeBank = category ? QUIZ_BANKS[category] : null
  const currentQ = activeBank ? activeBank.questions[step] : null

  return (
    <div className="min-h-screen pt-28 pb-24 text-left relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background industrial grid */}
      <div className="absolute inset-0 bg-diagonal opacity-5 pointer-events-none" />

      <div className="container-galf max-w-4xl relative z-10">
        
        {/* TOP BAR / NAVIGATION HEADER */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
          <Link href="/mediatheque" className="text-xs font-bold text-galf-yellow uppercase tracking-widest flex items-center gap-1 hover:underline">
            ← Médiathèque
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-all flex items-center gap-2 text-xs"
              title="Activer/Désactiver le son"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-galf-yellow" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline font-bold uppercase tracking-wider">{soundEnabled ? "Audio On" : "Muet"}</span>
            </button>
          </div>
        </div>

        {/* HERO TITLE */}
        {!category && (
          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              <HardHat className="w-3.5 h-3.5" /> Centre d'entraînement CACES R482/R483
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              TESTEZ VOS COMPÉTENCES <span className="text-galf-yellow">DE SÉCURITÉ</span>
            </h1>
            <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
              Sélectionnez une catégorie d'engins lourds pour démarrer un examen blanc chronométré de 10 questions. Obtenez 80% ou plus pour débloquer votre badge digital de réussite.
            </p>
          </div>
        )}

        {/* CATEGORY SELECTOR SCREEN */}
        {!category && (
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(QUIZ_BANKS).map(([key, bank]) => (
              <FadeIn key={key}>
                <button
                  onClick={() => {
                    setCategory(key as any)
                    setTimeLeft(30)
                    playSound('tick')
                  }}
                  className="w-full text-left glass-card p-6 rounded-3xl border border-white/5 hover:border-galf-yellow/40 hover:shadow-xl hover:shadow-galf-yellow/5 hover:-translate-y-1 transition-all group flex flex-col justify-between h-[220px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-galf-yellow/15 border border-galf-yellow/20 text-galf-yellow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {key === 'pelle' ? '🚜' : key === 'grue' ? '🏗️' : '📦'}
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-galf-yellow transition-colors">{bank.title}</h3>
                    <p className="text-xs text-white/50 mt-1">Examen blanc : 10 questions chronométrées.</p>
                  </div>
                  <span className="text-[10px] font-black uppercase text-galf-yellow flex items-center gap-1 mt-4">
                    Commencer le test <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </FadeIn>
            ))}
          </div>
        )}

        {/* ACTIVE QUIZ SCREEN */}
        {category && !quizDone && currentQ && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-center flex-wrap gap-4 bg-black/30 border border-white/5 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-black uppercase text-galf-yellow tracking-widest">{activeBank?.title}</span>
                <div className="text-sm font-bold text-white mt-0.5">Question {step + 1} sur 10</div>
              </div>

              {/* Dynamic Circular Timer */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="2.5" />
                    <circle 
                      cx="18" cy="18" r="16" fill="none" 
                      className={timeLeft <= 8 ? 'stroke-red-500' : 'stroke-galf-yellow'} 
                      strokeWidth="2.5" 
                      strokeDasharray="100" 
                      strokeDashoffset={100 - (timeLeft / 30) * 100}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-black text-white">
                    {timeLeft}
                  </div>
                </div>
                <span className="text-xs font-bold text-white/60">secondes</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-galf-yellow transition-all duration-300" style={{ width: `${(step / 10) * 100}%` }} />
            </div>

            {/* Question Text */}
            <div className="glass-card p-8 rounded-3xl border-white/5 bg-black/40">
              <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentQ.q}
              </h2>
            </div>

            {/* Options grid */}
            <div className="grid gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedIdx === idx
                const isCorrectAnswer = idx === currentQ.correct

                let btnClass = "bg-white/5 border-transparent text-white/80 hover:bg-white/10"
                if (answered) {
                  if (isCorrectAnswer) {
                    btnClass = "bg-green-500/10 border-green-500/40 text-green-400 font-bold"
                  } else if (isSelected) {
                    btnClass = "bg-red-500/10 border-red-500/40 text-red-400 font-bold"
                  } else {
                    btnClass = "bg-white/5 border-transparent text-white/30"
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    className={`w-full text-left p-5 rounded-2xl border transition-all text-sm flex items-center justify-between gap-4 ${btnClass}`}
                  >
                    <span>{option}</span>
                    {answered && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                    {answered && isSelected && !isCorrectAnswer && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
                  </button>
                )
              })}
            </div>

            {/* Explanation box / Next button */}
            <AnimatePresence>
              {answered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4"
                >
                  <div className="p-5 rounded-2xl bg-galf-yellow/5 border border-galf-yellow/20 flex gap-3 text-xs leading-relaxed text-white/80">
                    <AlertTriangle className="w-5 h-5 text-galf-yellow shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-galf-yellow uppercase block mb-1">Réglementation et Explication :</span>
                      {currentQ.explain}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-galf-yellow/10"
                  >
                    Question Suivante <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {category && quizDone && (
          <FadeIn className="space-y-8">
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-black/40 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
              
              <Trophy className="w-20 h-20 text-galf-yellow mx-auto mb-6 animate-bounce" />

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                RÉSULTAT DE L'EXAMEN
              </h2>
              <p className="text-sm text-white/50 uppercase tracking-widest mt-1">Examen blanc {activeBank?.title}</p>

              {/* Large Score Counter */}
              <div className="my-8">
                <span className="text-6xl md:text-8xl font-black text-galf-yellow font-mono">{score}</span>
                <span className="text-2xl md:text-3xl text-white/40 font-mono"> / 10</span>
              </div>

              {/* Status Ribbon */}
              {score >= 8 ? (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl max-w-md mx-auto mb-8">
                  🎉 Reçu ! Vous maîtrisez les fondamentaux de sécurité.
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl max-w-md mx-auto mb-8">
                  ⚠️ Échec. Entraînez-vous encore avant de passer l'examen réel.
                </div>
              )}

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-xs text-white/70 border-t border-white/5 pt-8">
                <div className="text-left space-y-1">
                  <span className="text-white/40 uppercase font-black">Taux de réussite</span>
                  <p className="text-lg font-black text-white font-mono">{score * 10}%</p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-white/40 uppercase font-black">Statut CACES</span>
                  <p className={`text-lg font-black ${score >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                    {score >= 8 ? 'Éligible' : 'Non validé'}
                  </p>
                </div>
              </div>
            </div>

            {/* DIGITAL BADGE INTERACTIVE SECTION */}
            {score >= 8 && (
              <div className="glass-card p-8 rounded-[2.5rem] border border-galf-yellow/20 bg-galf-yellow/5 space-y-6">
                <div className="text-center">
                  <Award className="w-12 h-12 text-galf-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white uppercase">DÉBLOQUEZ VOTRE BADGE DIGITAL</h3>
                  <p className="text-xs text-white/60 mt-1 max-w-md mx-auto leading-relaxed">
                    Saisissez votre nom complet pour imprimer et sauvegarder votre attestation de réussite CACES virtuelle certifiée par GALF.
                  </p>
                </div>

                {!badgeSaved ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!userName.trim()) return
                      setBadgeSaved(true)
                      playSound('correct')
                    }}
                    className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                  >
                    <input 
                      type="text" 
                      required 
                      placeholder="Votre Prénom et Nom"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="flex-1 bg-galf-bg border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-galf-yellow outline-none transition-all"
                    />
                    <button 
                      type="submit" 
                      className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg"
                    >
                      Enregistrer
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8 animate-fadeIn">
                    
                    {/* The Certification Badge Card */}
                    <div 
                      id="galf-badge-card" 
                      className="w-full max-w-sm mx-auto aspect-[1.586/1] bg-gradient-to-br from-black via-zinc-900 to-zinc-950 border border-galf-yellow/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between"
                      style={{ boxShadow: '0 20px 45px rgba(0,0,0,0.6), 0 0 30px rgba(255,176,0,0.05)' }}
                    >
                      {/* Technical Background Details */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-galf-yellow/10 to-transparent rounded-bl-full pointer-events-none" />
                      <div className="absolute inset-0 bg-diagonal opacity-5 pointer-events-none" />

                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-black tracking-widest text-galf-yellow uppercase">ATTESTATION RÉUSSITE</div>
                          <div className="text-[8px] font-mono text-white/40 mt-0.5">{badgeId}</div>
                        </div>
                        <HardHat className="text-galf-yellow w-5 h-5" />
                      </div>

                      {/* Main */}
                      <div className="my-2">
                        <div className="text-xs text-white/40 uppercase font-black tracking-wider">Lauréat</div>
                        <div className="text-lg font-black text-white tracking-tight leading-tight uppercase mt-0.5 font-sans">
                          {userName}
                        </div>
                        <div className="text-[10px] text-galf-yellow font-bold mt-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Examen théorique validé ({score}/10)
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-end pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[7px] text-white/30 uppercase block">Spécialité</span>
                          <span className="text-[10px] font-bold text-white uppercase">{activeBank?.title.split(' (')[0]}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] text-white/30 uppercase block">Délivré par</span>
                          <span className="text-[9px] font-black text-galf-yellow font-mono uppercase tracking-widest">GALF CI</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto">
                      <button 
                        onClick={() => {
                          alert(`Badge ${badgeId} partagé sur votre profil avec succès !`)
                        }} 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" /> Partager
                      </button>
                      <button 
                        onClick={() => {
                          window.print()
                        }} 
                        className="bg-galf-yellow text-galf-carbon px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Award className="w-4 h-4" /> Imprimer le Badge
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reset / Return button */}
            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="text-xs font-black uppercase tracking-widest text-galf-yellow hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Recommencer avec un autre engin
              </button>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
