"use client"

import { useState } from 'react'

import { Star, ArrowRight, ShieldCheck, 
  Heart, Leaf, Sparkles, Quote, Globe 
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FadeIn } from '@/components/animations/FadeIn'

const RSE_PILLARS = [
  {
    icon: Heart,
    title: "Inclusion & Mixité BTP",
    subtitle: "Programme 'Femmes sur Chenilles'",
    body: "Nous brisons les stéréotypes de genre en encourageant et facilitant l'accès des femmes aux formations d'engins lourds. Avec des bourses d'études spécifiques et un accompagnement technique, nous formons les futures conductrices d'élite du BTP et des mines en Côte d'Ivoire."
  },
  {
    icon: Leaf,
    title: "Éco-Conduite & Climat",
    subtitle: "Régulation des émissions de carbone",
    body: "L'apprentissage initial sur nos simulateurs 3D permet d'économiser des milliers de litres de carburant. De plus, nos formations intègrent des modules rigoureux sur l'éco-conduite (réduction des consommations de carburant de 15%) et la gestion écologique des fluides et huiles hydrauliques."
  },
  {
    icon: Globe,
    title: "Impact Communautaire",
    subtitle: "Insertion des jeunes locaux",
    body: "Nous collaborons avec les mairies et collectivités locales pour proposer des programmes d'apprentissage ciblés pour les jeunes en situation de décrochage scolaire ou de vulnérabilité sociale, leur offrant un métier qualifié et durable."
  }
]

export default function RseImpactPage() {
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Cinematic grid overlay */}
      <div className="absolute right-[-10%] top-[15%] w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0 bg-diagonal" />

      <PageHeader 
        title="RSE & IMPACT SOCIAL" 
        subtitle="GALF s'engage pour une formation inclusive, moderne et respectueuse de l'environnement en Côte d'Ivoire."
        badge="Notre Responsabilité"
        bgImage="/images/headers/mediatheque.png"
      />

      <div className="container-galf relative z-10 -mt-16">
        
        {/* Editorial introduction */}
        <FadeIn delay={0.1}>
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] mb-16 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-diagonal opacity-[0.01]" />
            <Sparkles className="w-10 h-10 text-galf-yellow mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-black text-adaptive uppercase tracking-tight mb-4">
              Façonner l'avenir du BTP avec responsabilité
            </h3>
            <p className="text-sm md:text-base text-adaptive-secondary leading-relaxed max-w-3xl mx-auto">
              Chez GALF Formation, nous sommes convaincus que l'excellence technique doit aller de pair avec un engagement sociétal et environnemental fort. Nous formons des opérateurs d'engins conscients des enjeux de sécurité, de mixité et de respect de l'environnement sur les chantiers de demain.
            </p>
          </div>
        </FadeIn>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {RSE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <FadeIn key={idx} delay={0.1 * idx}>
                <div className="glass-card p-8 rounded-3xl h-full flex flex-col justify-between hover:border-galf-yellow/30 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-galf-yellow uppercase tracking-widest block mb-1">
                      {pillar.subtitle}
                    </span>
                    <h4 className="text-xl font-black text-adaptive mb-3 uppercase tracking-wide leading-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-adaptive-secondary leading-relaxed">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        {/* Focus Section: Female Operator Testimonial */}
        <FadeIn delay={0.2}>
          <div className="glass-card p-8 md:p-12 rounded-[3rem] relative overflow-hidden mb-16">
            <div className="absolute right-0 top-0 w-64 h-64 bg-diagonal opacity-[0.03] pointer-events-none" />
            <div className="grid md:grid-cols-3 gap-8 items-center">
              
              {/* Quote details */}
              <div className="md:col-span-2 space-y-6">
                <Quote className="w-12 h-12 text-galf-yellow/30" />
                <h4 className="text-2xl md:text-3xl font-black text-adaptive uppercase tracking-tight leading-snug">
                  "Les femmes ont toute leur place aux commandes de ces monstres d'acier."
                </h4>
                <p className="text-sm text-adaptive-secondary leading-relaxed">
                  « Après ma formation certifiée GALF sur Pelle Hydraulique et Bulldozer, j'ai été embauchée immédiatement sur un grand projet d'infrastructure. La formation théorique en sécurité et les heures passées sur le simulateur m'ont donné l'assurance nécessaire pour diriger de grands chantiers de terrassement sans complexe. »
                </p>
                <div>
                  <div className="font-black text-adaptive text-sm uppercase tracking-wider">Fatou Koné</div>
                  <div className="text-xs text-galf-yellow font-black uppercase tracking-widest">
                    Major de Promotion 2024 — Conductrice de Bulldozer chez PFO Africa
                  </div>
                </div>
              </div>

              {/* Visual Box */}
              <div className="bg-diagonal rounded-2xl aspect-square flex flex-col justify-end p-6 border border-galf-yellow/20 relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Star className="w-16 h-16 text-galf-yellow animate-pulse z-20" />
                </div>
                <div className="relative z-20">
                  <span className="bg-galf-yellow text-galf-carbon px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest block w-max mb-1.5">
                    Success Story
                  </span>
                  <h5 className="font-black text-white text-sm uppercase tracking-wide">
                    Femmes sur Chenilles
                  </h5>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>

        {/* Newsletter / Action Section */}
        <FadeIn delay={0.3}>
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] text-center max-w-2xl mx-auto">
            <h4 className="text-2xl font-black text-adaptive uppercase tracking-tight mb-2">
              Soutenir notre démarche
            </h4>
            <p className="text-xs text-adaptive-secondary max-w-md mx-auto leading-relaxed mb-6">
              Vous êtes une entreprise désireuse de recruter des conductrices certifiées ou vous souhaitez en savoir plus sur nos engagements RSE ? Laissez-nous votre e-mail.
            </p>

            {newsletterSubscribed ? (
              <div className="text-green-500 font-black text-sm uppercase flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Merci de votre intérêt ! Nous vous recontacterons bientôt.</span>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Votre adresse e-mail" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-xl input-adaptive text-sm font-medium transition-all"
                />
                <button
                  type="submit"
                  className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  S'inscrire
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </FadeIn>

      </div>
    </div>
  )
}
