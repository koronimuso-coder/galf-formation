"use client"
import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, ChevronRight, 
  HelpCircle, Target, Trophy
} from 'lucide-react'



interface Question {
  id: number
  text: string
  options: {
    text: string
    scores: { pelle: number; grue: number; bulldozer: number }
  }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Face au vertige et à la hauteur...",
    options: [
      { text: "Je suis extrêmement à l'aise, j'aime dominer le paysage de très haut.", scores: { pelle: 0, grue: 10, bulldozer: 0 } },
      { text: "Pas de problème si je suis dans une cabine fermée et stable.", scores: { pelle: 5, grue: 3, bulldozer: 5 } },
      { text: "Je préfère impérativement avoir les pieds sur terre et opérer au niveau du sol.", scores: { pelle: 8, grue: 0, bulldozer: 10 } }
    ]
  },
  {
    id: 2,
    text: "Quel type de tâches vous motive le plus dans le travail ?",
    options: [
      { text: "La précision chirurgicale, creuser une tranchée centimètre par centimètre.", scores: { pelle: 10, grue: 2, bulldozer: 0 } },
      { text: "Le déplacement de volumes massifs, dégager les obstacles et aplanir le terrain.", scores: { pelle: 2, grue: 0, bulldozer: 10 } },
      { text: "La manutention aérienne et le levage coordonné de charges lourdes de plusieurs tonnes.", scores: { pelle: 0, grue: 10, bulldozer: 0 } }
    ]
  },
  {
    id: 3,
    text: "Face à une situation imprévue (obstacle ou vent violent)...",
    options: [
      { text: "J'analyse les abaques de charge, la force du vent et recalcule mes angles.", scores: { pelle: 0, grue: 10, bulldozer: 0 } },
      { text: "Je teste la résistance hydraulique de mon godet et adapte ma manipulation.", scores: { pelle: 10, grue: 0, bulldozer: 4 } },
      { text: "J'utilise la puissance du train de chenilles pour pousser avec régularité.", scores: { pelle: 3, grue: 0, bulldozer: 10 } }
    ]
  },
  {
    id: 4,
    text: "Quelle qualité naturelle vous correspond le mieux ?",
    options: [
      { text: "Une excellente perception tridimensionnelle de l'espace et du moment.", scores: { pelle: 2, grue: 10, bulldozer: 1 } },
      { text: "Une excellente coordination œil-main rapide pour manipuler des doubles joysticks.", scores: { pelle: 10, grue: 2, bulldozer: 3 } },
      { text: "Une sensibilité aux vibrations de la machine pour ajuster le nivellement.", scores: { pelle: 2, grue: 0, bulldozer: 10 } }
    ]
  },
  {
    id: 5,
    text: "Votre cabine de travail idéale se trouve...",
    options: [
      { text: "À 40 mètres du sol, offrant une vue panoramique sur toute la ville.", scores: { pelle: 0, grue: 10, bulldozer: 0 } },
      { text: "Au-dessus de la tourelle d'une excavatrice lourde pivotante.", scores: { pelle: 10, grue: 0, bulldozer: 2 } },
      { text: "Installée sur un châssis blindé à chenilles de terrassement autoroutier.", scores: { pelle: 1, grue: 0, bulldozer: 10 } }
    ]
  }
]

const PROFILE_DETAILS = {
  pelle: {
    title: "Opérateur Pelle Hydraulique",
    desc: "Vous êtes rigoureux et possédez une excellente coordination motrice. La conduite d'excavatrice exige de la minutie pour le tracé des tranchées, le respect des réseaux enterrés (gaz, électricité) et le chargement précis. C'est le métier le plus recherché sur les chantiers routiers et miniers en Côte d'Ivoire.",
    route: "/formations/planificateur?engin=pelle"
  },
  grue: {
    title: "Grutier à Tour / Mobile",
    desc: "Vous possédez un calme olympien et une perception spatiale hors norme. Le grutier est le chef d'orchestre du chantier de bâtiment. Vous aimez la hauteur et la physique du levage. C'est une spécialité prestigieuse, exigeant un respect absolu des consignes de charge utile et de la météo (force du vent).",
    route: "/formations/planificateur?engin=grue"
  },
  bulldozer: {
    title: "Conducteur de Bulldozer / Engins de terrassement",
    desc: "Vous aimez la puissance mécanique brute et le travail de nivellement de grande envergure. Le conducteur de bulldozer prépare le terrain, déplace des volumes de terre gigantesques et gère le tracé des routes et pistes minières. Vous avez le sens des reliefs et des nivellements.",
    route: "/formations/planificateur?engin=bulldozer"
  }
}

export default function TestAptitudePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<typeof QUESTIONS[0]['options'][0]['scores'][]>([])
  const [isFinished, setIsFinished] = useState(false)

  const handleSelectOption = (scores: typeof QUESTIONS[0]['options'][0]['scores']) => {
    const updated = [...answers, scores]
    setAnswers(updated)
    triggerAudioFeedback(550, 0.06)

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsFinished(true)
      triggerAudioFeedback(660, 0.1)
      setTimeout(() => triggerAudioFeedback(880, 0.15), 100)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers([])
    setIsFinished(false)
    triggerAudioFeedback(440, 0.08)
  }

  // Calculate final aggregate scores
  const getAggregatedScores = () => {
    let pelle = 0
    let grue = 0
    let bulldozer = 0
    answers.forEach(score => {
      pelle += score.pelle
      grue += score.grue
      bulldozer += score.bulldozer
    })
    
    const maxVal = Math.max(pelle, grue, bulldozer)
    const bestProfile: 'pelle' | 'grue' | 'bulldozer' = 
      maxVal === grue ? 'grue' :
      maxVal === bulldozer ? 'bulldozer' : 'pelle'
      
    // Convert to percentages
    const totalPoints = pelle + grue + bulldozer || 1
    return {
      pelle: Math.round((pelle / totalPoints) * 100),
      grue: Math.round((grue / totalPoints) * 100),
      bulldozer: Math.round((bulldozer / totalPoints) * 100),
      bestProfile
    }
  }

  const { pelle, grue, bulldozer, bestProfile } = isFinished 
    ? getAggregatedScores() 
    : { pelle: 0, grue: 0, bulldozer: 0, bestProfile: 'pelle' as const }

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
          <ArrowLeft className="w-4 h-4" /> Retour aux Formations
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              Orientation Professionnelle
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mt-3" style={{ color: 'var(--galf-text)' }}>
              TEST D'APTITUDE <span className="text-galf-yellow">OPÉRATEUR</span>
            </h1>
            <p className="text-sm max-w-xl mt-2 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
              Faites le point sur vos forces, votre tolérance au vertige, et votre style de conduite pour identifier l'engin de chantier optimal pour votre carrière.
            </p>
          </div>
        </div>

        {/* Central interactive wizard block */}
        <div className="max-w-3xl mx-auto mt-12">
          {!isFinished ? (
            // ACTIVE QUESTION SCREEN
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] bg-black/40 border-white/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-full" />

              {/* Steps Progress */}
              <div className="flex justify-between items-center text-xs font-bold text-white/50">
                <span className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-galf-yellow" /> QUESTION {currentStep + 1} / {QUESTIONS.length}</span>
                <span className="font-mono">{Math.round(((currentStep) / QUESTIONS.length) * 100)}% COMPLÉTÉ</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-galf-yellow transition-all duration-300"
                  style={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                {QUESTIONS[currentStep].text}
              </h3>

              {/* Options Stack */}
              <div className="space-y-4 pt-4">
                {QUESTIONS[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.scores)}
                    className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-galf-yellow/30 hover:bg-galf-yellow/5 text-white/80 hover:text-white transition-all duration-200 flex items-center justify-between gap-4 group cursor-pointer"
                  >
                    <span className="text-xs md:text-sm font-medium leading-relaxed">{opt.text}</span>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-galf-yellow shrink-0 transition-all group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // DIAGNOSTIC PROFILE RESULT SCREEN
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] bg-black/40 border-white/5 space-y-8 relative overflow-hidden animate-fadeIn text-center md:text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full" />
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded text-green-400 border border-green-500/20 inline-block mb-2">
                    Profil Déterminé
                  </span>
                  <h2 className="text-3xl font-black text-white uppercase">{PROFILE_DETAILS[bestProfile].title}</h2>
                </div>
                <Trophy className="w-12 h-12 text-galf-yellow animate-bounce" />
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-start">
                
                {/* Visual score bars (5 cols) */}
                <div className="md:col-span-5 space-y-5 bg-zinc-950/40 p-6 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-wider block mb-2">Jauges de compatibilité</span>
                  
                  {/* Pelle bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-white/80">
                      <span>Pelle Hydraulique</span>
                      <span className="font-mono">{pelle}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-galf-yellow transition-all duration-700" style={{ width: `${pelle}%` }} />
                    </div>
                  </div>

                  {/* Grue bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-white/80">
                      <span>Grue à Tour / Mobile</span>
                      <span className="font-mono">{grue}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-galf-yellow transition-all duration-700" style={{ width: `${grue}%` }} />
                    </div>
                  </div>

                  {/* Bulldozer bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-white/80">
                      <span>Bulldozer & Terrassement</span>
                      <span className="font-mono">{bulldozer}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-galf-yellow transition-all duration-700" style={{ width: `${bulldozer}%` }} />
                    </div>
                  </div>
                </div>

                {/* Description and CTA (7 cols) */}
                <div className="md:col-span-7 space-y-6">
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans">
                    {PROFILE_DETAILS[bestProfile].desc}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link 
                      href={PROFILE_DETAILS[bestProfile].route}
                      className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-galf-yellow/10"
                    >
                      <Target className="w-4.5 h-4.5" /> Planifier cette formation
                    </Link>
                    <button 
                      onClick={handleReset}
                      className="glass-card px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white hover:border-galf-yellow/30 transition-all"
                    >
                      Recommencer
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}
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
