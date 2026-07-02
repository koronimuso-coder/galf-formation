"use client"
import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "Quels sont les prérequis pour s'inscrire aux formations d'engins ?",
      a: "Il faut être âgé de 18 ans minimum, savoir lire et écrire de préférence, et être déclaré apte physiquement lors de notre visite d'aptitude professionnelle. Aucun diplôme universitaire ou permis de conduire n'est exigé au préalable, sauf pour les engins circulant fréquemment sur la voie publique (Grue Mobile, etc.) où un permis de conduire de catégorie B ou C est un atout."
    },
    {
      q: "Peut-on payer en plusieurs mensualités ?",
      a: "Oui, GALF FORMATION propose des facilités de paiement flexibles. Vous pouvez régler vos frais de formation en 1 fois (0% frais), 3 fois ou 6 fois. Les paiements s'effectuent en agence par Wave, Orange Money, chèque ou virement bancaire. Un acompte initial est nécessaire pour valider votre inscription et réserver votre place."
    },
    {
      q: "Vos diplômes sont-ils valables à l'international ?",
      a: "Absolument. GALF FORMATION est agréé par le Ministère de l'Enseignement Technique et de la Formation Professionnelle de Côte d'Ivoire. De plus, nos formations intègrent les référentiels de sécurité CACES européens. Nos diplômés travaillent aujourd'hui dans toute l'Afrique de l'Ouest (Sénégal, Guinée, Mali, Burkina Faso) dans les secteurs des mines, des travaux publics et de la logistique portuaire."
    },
    {
      q: "Comment s'organise l'apprentissage pratique terrain ?",
      a: "Notre méthodologie est axée à 80% sur la pratique. La formation débute par de la théorie réglementaire de sécurité HSE et des séances sur simulateur 3D immersif pour acquérir les réflexes de commande. Ensuite, vous passez directement à la manœuvre d'engins réels de chantier (excavation, talutage, levage de charges lourdes) sur nos plateaux techniques d'Abidjan et de San Pedro."
    },
    {
      q: "Proposez-vous un accompagnement vers l'emploi ?",
      a: "Oui, notre cellule RSE & Insertion travaille en partenariat avec plus de 50 entreprises majeures du secteur minier et du BTP. Nous optimisons les CV de nos apprenants, préparons les simulations d'entretiens d'embauche et transmettons directement les profils de nos meilleurs diplômés aux recruteurs via notre Annuaire National des Opérateurs Blockchain."
    }
  ]

  const toggleFAQ = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx)
  }

  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden bg-zinc-950/20">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.02] pointer-events-none" />
      <div className="container-galf max-w-4xl relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-[10px] text-galf-yellow font-bold uppercase tracking-[0.3em] mb-3 block">FAQ Générale</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Des réponses à vos <span className="text-galf-yellow">questions</span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl mx-auto mt-3 font-sans">
              Retrouvez toutes les informations indispensables pour bien préparer votre dossier d'inscription et comprendre le déroulement de votre formation.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx
            return (
              <FadeIn key={idx} delay={idx * 0.05} className="stitch-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-black uppercase text-xs tracking-wider text-white hover:text-galf-yellow transition-colors font-mono"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-galf-yellow' : 'text-zinc-500'}`} />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-galf-yellow' : 'text-zinc-500'}`} />
                </button>
                
                {/* Collapsible Answer */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-white/5' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 text-xs leading-relaxed text-zinc-400 font-sans bg-black/25">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
