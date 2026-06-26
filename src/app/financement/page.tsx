"use client"

import { useState } from 'react'

import { 
  CreditCard, 
  ArrowRight, Landmark, Calculator, HelpCircle 
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FadeIn } from '@/components/animations/FadeIn'

const BTP_COURSES = [
  { id: 'pelle', name: 'Pelle Hydraulique sur chenilles', price: 450000 },
  { id: 'grue', name: 'Grue Mobile & Élingage', price: 650000 },
  { id: 'chariot', name: 'Chariot Élévateur (CACES R489)', price: 250000 },
  { id: 'bulldozer', name: 'Bulldozer & Terrassement', price: 500000 },
  { id: 'hse', name: 'Habilitation Sécurité HSE Chantier', price: 150000 },
  { id: 'chargeuse', name: 'Chargeuse sur pneus', price: 400000 }
]

export default function FinancementPage() {
  const [profile, setProfile] = useState<'particular' | 'company'>('particular')
  const [selectedCourse, setSelectedCourse] = useState(BTP_COURSES[0].id)
  const [installments, setInstallments] = useState(3)
  const [simulatorSuccess, setSimulatorSuccess] = useState(false)

  // Calculations
  const activeCourse = BTP_COURSES.find(c => c.id === selectedCourse) || BTP_COURSES[0]
  const coursePrice = activeCourse.price
  
  // Calculate monthly payment for individuals
  const monthlyPayment = Math.round(coursePrice / installments)
  
  // Calculate FDFP refund estimation for companies (normally up to 80-100%)
  const fdfpRefund = Math.round(coursePrice * 0.9)
  const netCost = coursePrice - fdfpRefund

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background patterns */}
      <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0 bg-diagonal" />
      
      <PageHeader 
        title="FINANCEMENT & PRISES EN CHARGE" 
        subtitle="Des solutions de financement flexibles adaptées aux budgets des particuliers et des dispositifs de remboursement FDFP pour les entreprises."
        badge="Financement Flexible"
        bgImage="/images/headers/formations.png"
      />

      <div className="container-galf relative z-10 -mt-16">
        
        {/* Profile Switcher */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-16">
            <div className="bg-galf-bg-alt/80 border border-adaptive p-1.5 rounded-2xl flex gap-1">
              <button
                onClick={() => setProfile('particular')}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  profile === 'particular'
                    ? 'bg-galf-yellow text-galf-carbon shadow-md'
                    : 'text-adaptive-muted hover:text-adaptive'
                }`}
              >
                Particulier / Étudiant
              </button>
              <button
                onClick={() => setProfile('company')}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  profile === 'company'
                    ? 'bg-galf-yellow text-galf-carbon shadow-md'
                    : 'text-adaptive-muted hover:text-adaptive'
                }`}
              >
                Entreprise / Salarié
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Informational Column (Left) */}
          <div className="lg:col-span-3 space-y-8">
            {profile === 'particular' ? (
              <div className="space-y-8">
                <FadeIn delay={0.2}>
                  <div>
                    <h3 className="text-3xl font-black text-adaptive uppercase tracking-tight mb-4">
                      Facilités de Paiement pour Particuliers
                    </h3>
                    <p className="text-sm text-adaptive-secondary leading-relaxed mb-6">
                      Chez GALF, nous croyons que le coût d'une formation de qualité ne doit pas être un frein à votre insertion professionnelle. C'est pourquoi nous proposons des modalités de paiement échelonnées sans intérêt pour vous permettre d'apprendre à votre rythme.
                    </p>
                  </div>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-6">
                  <FadeIn delay={0.1}>
                    <div className="glass-card p-6 rounded-2xl border-galf-yellow/20">
                      <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow mb-4">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-sm text-adaptive uppercase tracking-wider mb-2">Paiement Échelonné 0%</h4>
                      <p className="text-xs text-adaptive-secondary leading-relaxed">
                        Réglez votre formation en 2, 3 ou 4 mensualités. Aucun frais supplémentaire ni taux d'intérêt n'est appliqué sur vos mensualités.
                      </p>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.2}>
                    <div className="glass-card p-6 rounded-2xl border-galf-yellow/20">
                      <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow mb-4">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-sm text-adaptive uppercase tracking-wider mb-2">Micro-crédits Études</h4>
                      <p className="text-xs text-adaptive-secondary leading-relaxed">
                        Grâce à nos partenariats avec des institutions de micro-finance locales, vous pouvez solliciter un prêt étudiant remboursable après obtention de votre diplôme.
                      </p>
                    </div>
                  </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                  <div className="p-6 bg-galf-bg-alt/50 border border-adaptive rounded-2xl">
                    <h5 className="font-black text-sm text-adaptive uppercase tracking-wider mb-3">📄 Conditions d'accès</h5>
                    <ul className="space-y-2 text-xs text-adaptive-secondary">
                      <li className="flex items-center gap-2">✔ Un premier versement (acompte) à l'inscription pour bloquer votre place en session.</li>
                      <li className="flex items-center gap-2">✔ Les mensualités suivantes doivent être soldées avant le passage de l'examen final de certification.</li>
                    </ul>
                  </div>
                </FadeIn>
              </div>
            ) : (
              <div className="space-y-8">
                <FadeIn delay={0.2}>
                  <div>
                    <h3 className="text-3xl font-black text-adaptive uppercase tracking-tight mb-4">
                      Dispositif de Financement FDFP B2B
                    </h3>
                    <p className="text-sm text-adaptive-secondary leading-relaxed mb-6">
                      En tant qu'établissement habilité par le FDFP, les formations d'engins et de sécurité dispensées par GALF peuvent être prises en charge et remboursées à votre entreprise. Optimisez vos plans de formation et mettez à niveau vos équipes sans impacter votre trésorerie.
                    </p>
                  </div>
                </FadeIn>

                <div className="space-y-4">
                  <FadeIn delay={0.1}>
                    <div className="glass-card p-6 rounded-2xl flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow shrink-0">
                        <span className="font-black text-lg">1</span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-adaptive uppercase tracking-wider mb-1">Dépôt du Plan de Formation</h4>
                        <p className="text-xs text-adaptive-secondary leading-relaxed">
                          Nos conseillers B2B vous accompagnent dans la rédaction et le chiffrage de votre plan de formation annuel pour vos conducteurs d'engins, afin de le soumettre au FDFP.
                        </p>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.2}>
                    <div className="glass-card p-6 rounded-2xl flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow shrink-0">
                        <span className="font-black text-lg">2</span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-adaptive uppercase tracking-wider mb-1">Habilitation & Exécution</h4>
                        <p className="text-xs text-adaptive-secondary leading-relaxed">
                          Dès réception de la lettre d'accord du FDFP, nous planifions et dispensons la formation (dans notre centre ou directement en intra-entreprise sur vos chantiers).
                        </p>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.3}>
                    <div className="glass-card p-6 rounded-2xl flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow shrink-0">
                        <span className="font-black text-lg">3</span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-adaptive uppercase tracking-wider mb-1">Prise en Charge / Remboursement</h4>
                        <p className="text-xs text-adaptive-secondary leading-relaxed">
                          Nous vous délivrons les justificatifs, feuilles d'émargement et attestations requis par le FDFP pour débloquer votre remboursement (allant de 80% à 100% du montant HT).
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Calculator Simulator (Right) */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.3}>
              <div className="glass-card p-8 rounded-[2.5rem] border-galf-yellow/20 bg-diagonal bg-opacity-5">
                <div className="flex items-center gap-2.5 mb-6">
                  <Calculator className="w-6 h-6 text-galf-yellow" />
                  <h4 className="text-lg font-black text-adaptive uppercase tracking-wide">
                    Simulateur de Budget
                  </h4>
                </div>

                {simulatorSuccess ? (
                  /* Thank you state */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h5 className="font-black text-lg text-adaptive uppercase tracking-tight">Demande Enregistrée</h5>
                    <p className="text-xs text-adaptive-secondary leading-relaxed">
                      Votre simulation a été transmise à notre conseiller financier. Un devis personnalisé avec le plan de financement vous sera envoyé par e-mail sous 24h.
                    </p>
                    <button
                      onClick={() => setSimulatorSuccess(false)}
                      className="bg-galf-yellow text-galf-carbon px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
                    >
                      Nouvelle simulation
                    </button>
                  </div>
                ) : (
                  /* Interactive Form Form */
                  <form onSubmit={(e) => { e.preventDefault(); setSimulatorSuccess(true); }} className="space-y-6">
                    {/* Course select */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-adaptive uppercase tracking-wider">
                        Sélectionner la formation
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl input-adaptive text-sm font-medium transition-all"
                      >
                        {BTP_COURSES.map(course => (
                          <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                      </select>
                    </div>

                    {profile === 'particular' ? (
                      /* Individual calculator details */
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-adaptive uppercase tracking-wider">
                            Nombre d'échéances souhaitées
                          </label>
                          <div className="flex gap-2">
                            {[2, 3, 4].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setInstallments(num)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  installments === num
                                    ? 'bg-galf-yellow text-galf-carbon font-extrabold shadow-sm'
                                    : 'choice-btn hover:border-galf-yellow/45'
                                }`}
                              >
                                {num} Mois
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Breakdown Display */}
                        <div className="p-4 bg-galf-bg rounded-xl border border-adaptive space-y-3">
                          <div className="flex justify-between text-xs font-bold text-adaptive-secondary">
                            <span>Coût Total</span>
                            <span className="font-black text-adaptive">{coursePrice.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-adaptive-secondary">
                            <span>Taux d'intérêt</span>
                            <span className="text-green-500 font-black">0% (Aucun frais)</span>
                          </div>
                          <div className="border-t border-adaptive pt-3 flex justify-between text-xs font-bold text-adaptive">
                            <span>Mensualité ({installments} mois)</span>
                            <span className="text-base font-black text-galf-yellow">{monthlyPayment.toLocaleString('fr-FR')} FCFA / mois</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Corporate FDFP details */
                      <div className="space-y-6">
                        {/* Breakdown Display */}
                        <div className="p-4 bg-galf-bg rounded-xl border border-adaptive space-y-3">
                          <div className="flex justify-between text-xs font-bold text-adaptive-secondary">
                            <span>Coût catalogue HT</span>
                            <span className="font-black text-adaptive">{coursePrice.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-adaptive-secondary">
                            <span>Estimation remboursement FDFP</span>
                            <span className="text-green-500 font-black">~ {fdfpRefund.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                          <div className="border-t border-adaptive pt-3 flex justify-between text-xs font-bold text-adaptive">
                            <span>Reste à charge net entreprise</span>
                            <span className="text-base font-black text-galf-yellow">{netCost.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        </div>

                        <div className="p-3 bg-galf-yellow/5 border border-galf-yellow/20 rounded-xl flex gap-2 text-[10px] leading-relaxed text-adaptive-secondary">
                          <HelpCircle className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" />
                          <span>Cette simulation est indicative. Le remboursement réel dépend des fonds de tirage disponibles sur votre compte FDFP d'entreprise.</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Obtenir mon Devis Nominatif
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

        </div>

      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
