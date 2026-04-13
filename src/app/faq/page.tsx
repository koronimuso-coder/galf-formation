"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { q: "Quelles sont les conditions d'admission ?", a: "Pour la plupart de nos formations sur engins, il faut être âgé d'au moins 18 ans, savoir lire et écrire le français, et présenter une aptitude médicale valide. Aucun diplôme spécifique n'est requis pour les formations de base." },
    { q: "Proposez-vous des facilités de paiement ?", a: "Oui ! Nous proposons des paiements échelonnés en 2 ou 3 fois sans frais. Un acompte de 30% minimum est requis à l'inscription. Le solde peut être réglé via Wave, Orange Money, MTN MoMo, virement bancaire ou espèces." },
    { q: "Est-ce que je trouverai du travail après la formation ?", a: "Le secteur du BTP et des mines recrute en permanence. Nous accompagnons nos apprenants : transmission de CV à notre réseau de 50+ entreprises partenaires, coaching en entretien, et réseau alumni actif." },
    { q: "Comment se déroulent les cours pratiques ?", a: "La pratique représente 80% de votre temps. Vous manipulerez les engins sur nos chantiers-écoles sécurisés, encadrés par des instructeurs certifiés, avec des objectifs de progression quotidiens." },
    { q: "Vos certificats sont-ils reconnus ?", a: "Absolument. Nos certificats sont délivrés selon les normes en vigueur et sont reconnus par les acteurs du BTP, de l'industrie pétrolière et minière en Côte d'Ivoire et en Afrique de l'Ouest." },
    { q: "Quelle est la durée des formations ?", a: "Nos formations varient de 3 jours (carte opérateur) à 3 mois (formations spécialisées comme le forage minier). La majorité dure entre 2 et 6 semaines." },
    { q: "Puis-je suivre des cours en ligne ?", a: "Oui, notre plateforme e-learning permet de suivre les modules théoriques en ligne. La partie pratique reste obligatoirement en présentiel dans nos centres." },
    { q: "Proposez-vous des formations pour les entreprises ?", a: "Oui, nous proposons des formations sur-mesure pour les entreprises : sessions intra-entreprise, formations collectives avec tarifs préférentiels, et plans de développement des compétences." },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute left-[-15%] top-[5%] w-[700px] h-[700px] opacity-[0.04] pointer-events-none z-0">
        <AnimatedMachineHeader type="grue" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-galf-yellow/10 border border-galf-yellow/20 mb-6">
              <HelpCircle className="w-8 h-8 text-galf-yellow" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none" style={{ color: 'var(--galf-text)' }}>
              QUESTIONS <span className="text-galf-yellow">FRÉQUENTES</span>
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>
              Trouvez rapidement les réponses à vos interrogations sur nos formations, admissions et tarifs.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <FadeIn key={index} delay={0.05 * index}>
              <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-galf-yellow/40 glow-yellow' : 'hover:border-galf-yellow/20'}`}>
                <button className="w-full px-6 py-6 flex items-center justify-between focus:outline-none text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  <span className="font-bold text-lg pr-8" style={{ color: 'var(--galf-text)' }}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-galf-yellow text-galf-carbon' : ''}`}
                    style={openIndex !== index ? { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-muted)' } : {}}>
                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{faq.a}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="glass-card p-8 rounded-xl text-center">
            <h3 className="text-xl font-black mb-3" style={{ color: 'var(--galf-text)' }}>Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="mb-6" style={{ color: 'var(--galf-text-secondary)' }}>Contactez-nous directement, notre équipe vous répondra sous 24h.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="bg-galf-yellow text-galf-carbon px-8 py-3 rounded-lg font-black hover:brightness-110 transition-all shadow-md">Nous contacter</Link>
              <a href="https://wa.me/2250711826507" className="glass-card px-8 py-3 rounded-lg font-bold hover:border-galf-yellow/30 transition-all" style={{ color: 'var(--galf-text)' }}>WhatsApp</a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
