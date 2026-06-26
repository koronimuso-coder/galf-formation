"use client"
import { useState } from 'react'
import Link from 'next/link'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import Image from 'next/image'
import { FadeIn } from '@/components/animations/FadeIn'
import { Search, Clock, MapPin, ArrowRight, X, HelpCircle, Award, RefreshCcw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdBanner } from '@/components/layout/AdBanner'

interface Question {
  q: string
  options: { text: string; value: string }[]
}

export default function FormationsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')

  // Orientation Quiz State
  const [quizActive, setQuizActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [recommendation, setRecommendation] = useState<any | null>(null)

  const categories = ['Toutes', ...Array.from(new Set(GALF_FORMATIONS.map(f => f.category)))]

  const filtered = GALF_FORMATIONS.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.shortDesc.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Toutes' || f.category === category
    return matchSearch && matchCat && f.status === 'Actif'
  })

  // Quiz Questions Definition
  const questions: Question[] = [
    {
      q: "Quel type d'environnement de chantier vous attire le plus ?",
      options: [
        { text: "Les hauteurs vertigineuses et le levage de précision", value: "grue" },
        { text: "Au sol, pour creuser, pivoter et modeler le terrain", value: "pelle" },
        { text: "Les grands espaces à niveler et terrasser en masse", value: "bulldozer" },
        { text: "Les sous-sols profonds, l'extraction et le forage minier", value: "forage" }
      ]
    },
    {
      q: "Quelle est votre principale qualité opérationnelle ?",
      options: [
        { text: "Une patience infinie et une attention extrême aux consignes", value: "grue" },
        { text: "La polyvalence et l'amour de la maniabilité technique", value: "pelle" },
        { text: "La force brute, la puissance mécanique de déplacement", value: "bulldozer" },
        { text: "L'attrait pour la haute technologie géologique et de forage", value: "forage" }
      ]
    },
    {
      q: "Quelle est votre ambition professionnelle à court terme ?",
      options: [
        { text: "Travailler sur les grands chantiers résidentiels urbains (Tours)", value: "grue" },
        { text: "Être l'opérateur le plus demandé et polyvalent des travaux publics", value: "pelle" },
        { text: "Participer aux grands terrassements d'infrastructures routières", value: "bulldozer" },
        { text: "Entrer dans l'industrie minière pour des salaires très attractifs", value: "forage" }
      ]
    }
  ]

  const startQuiz = () => {
    setQuizActive(true)
    setCurrentStep(0)
    setAnswers([])
    setRecommendation(null)
  }

  const handleAnswerSelect = (val: string) => {
    const newAnswers = [...answers, val]
    setAnswers(newAnswers)
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Calculate final recommendation based on majority vote
      const counts: { [key: string]: number } = { pelle: 0, grue: 0, bulldozer: 0, forage: 0 }
      newAnswers.forEach(ans => { counts[ans] = (counts[ans] || 0) + 1 })
      
      let winner = 'pelle'
      let maxCount = 0
      Object.keys(counts).forEach(key => {
        if (counts[key] > maxCount) {
          maxCount = counts[key]
          winner = key
        }
      })

      // Find matching formation slug
      const slugs: { [key: string]: string } = {
        pelle: 'pelle-hydraulique',
        grue: 'grue-tour',
        bulldozer: 'bulldozer',
        forage: 'forage-minier'
      }
      const targetSlug = slugs[winner]
      const recFormation = GALF_FORMATIONS.find(f => f.slug === targetSlug) || GALF_FORMATIONS[0]
      setRecommendation(recFormation)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="NOS FORMATIONS EXPERTES"
        subtitle="De 15 000 à 850 000 FCFA, trouvez la formation qui correspond à votre ambition et forgez votre avenir."
        badge="19 parcours certifiants"
      />
      
      <div className="container-galf relative z-10 mt-16">

        {/* ═══════════════════════════════════════════════
            NEW: INTERACTIVE MACHINERY ORIENTATION QUIZ
           ═══════════════════════════════════════════════ */}
        <FadeIn>
          <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--galf-border)] shadow-2xl mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            
            {!quizActive ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <span className="text-[10px] font-black uppercase bg-galf-yellow text-galf-carbon px-2.5 py-1 rounded tracking-wider">
                    Orientation Express
                  </span>
                  <h3 className="text-2xl font-black mt-3 text-adaptive">Quel engin BTP est fait pour vous ?</h3>
                  <p className="text-xs text-adaptive-secondary mt-1.5 max-w-xl">
                    Faites notre test interactif en 3 questions pour découvrir quel engin correspond le mieux à votre profil technique et à vos ambitions.
                  </p>
                </div>
                <button 
                  onClick={startQuiz}
                  className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shrink-0 shadow-lg shadow-galf-yellow/10"
                >
                  Démarrer le Test d'Orientation
                </button>
              </div>
            ) : recommendation ? (
              <div className="text-center py-4 animate-fadeIn">
                <Award className="w-12 h-12 text-galf-yellow mx-auto mb-4 animate-bounce" />
                <span className="text-[9px] font-black uppercase text-adaptive-muted tracking-widest">Recommandation personnalisée</span>
                <h4 className="text-2xl font-black text-adaptive mt-1 mb-2">{recommendation.name}</h4>
                <p className="text-xs text-adaptive-secondary max-w-md mx-auto mb-6">
                  {recommendation.shortDesc} Ce module offre d'excellents débouchés et convient parfaitement à vos réponses.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={startQuiz}
                    className="px-6 py-3 rounded-xl border border-adaptive text-xs font-black uppercase tracking-widest text-adaptive-secondary hover:bg-galf-yellow/5 transition-colors flex items-center gap-2"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Recommencer
                  </button>
                  <Link 
                    href={`/formations/${recommendation.slug}`}
                    className="bg-galf-yellow text-galf-carbon px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Découvrir le parcours →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-adaptive">
                  <span className="text-[10px] font-black uppercase text-galf-yellow tracking-widest flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Question {currentStep + 1} / {questions.length}
                  </span>
                  <button onClick={() => setQuizActive(false)} className="text-adaptive-muted hover:text-adaptive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h4 className="text-lg font-black text-adaptive leading-snug">
                  {questions[currentStep].q}
                </h4>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {questions[currentStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(opt.value)}
                      className="w-full text-left p-4 rounded-xl text-xs font-bold choice-btn hover:border-galf-yellow/50 transition-all"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* AdSense Placement - entre quiz orientation et liste formations */}
        <FadeIn delay={0.15}>
          <AdBanner slot="formations_listing_mid" format="horizontal" />
        </FadeIn>

        {/* Search & Filters */}
        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--galf-text-secondary)' }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une formation..."
                className="w-full rounded-lg pl-12 pr-10 py-4 focus:outline-none focus:ring-2 focus:ring-galf-yellow transition-all"
                style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
              {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--galf-text-secondary)' }}><X className="w-4 h-4" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${category === cat ? 'bg-galf-yellow text-galf-carbon' : ''}`}
                  style={category !== cat ? { background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' } : {}}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="text-sm font-bold mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
            {filtered.length} formation{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((f, i) => (
            <FadeIn key={f.id} delay={Math.min(0.08 * i, 0.5)}>
              <Link href={`/formations/${f.slug}`} className="group block h-full">
                <div className="glass-card rounded-xl overflow-hidden h-full hover:border-galf-yellow/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col border-galf-border">
                   <div className="h-44 relative overflow-hidden shrink-0">
                    <Image 
                      src={getFormationImage(f.slug)} 
                      alt={f.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {f.pricePromo && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 text-[10px] font-black uppercase rounded-md animate-pulse">Promo</div>}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{f.category}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-black mb-2 group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{f.name}</h3>
                    <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: 'var(--galf-text-secondary)' }}>{f.shortDesc}</p>
                    <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--galf-text-secondary)' }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--galf-border)' }}>
                      <div>
                        {f.pricePromo ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-galf-yellow">{f.pricePromo.toLocaleString('fr-FR')} F</span>
                            <span className="text-xs line-through" style={{ color: 'var(--galf-text-secondary)' }}>{f.price.toLocaleString('fr-FR')}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-black text-galf-yellow">{f.price.toLocaleString('fr-FR')} FCFA</span>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-galf-yellow transition-colors" style={{ border: '1px solid var(--galf-border)' }}>
                        <ArrowRight className="w-4 h-4 group-hover:text-galf-carbon transition-colors" style={{ color: 'var(--galf-text-secondary)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 text-adaptive-muted">🔍</div>
            <h3 className="text-xl font-black mb-2 text-adaptive">Aucune formation trouvée</h3>
            <p style={{ color: 'var(--galf-text-secondary)' }}>Essayez un autre terme.</p>
          </div>
        )}
      </div>
    </div>
  )
}
