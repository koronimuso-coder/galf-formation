"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowLeft, ArrowRight, Clock, MapPin, BarChart3, BookOpen, Target, Briefcase, CheckCircle2, Shield, Phone } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function FormationDetail() {
  const params = useParams()
  const formation = GALF_FORMATIONS.find(f => f.slug === params.slug)

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--galf-bg)' }}>
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.06] dark:opacity-[0.1]" style={{ backgroundImage: `url(${getFormationImage(formation.slug)})` }} />
        
        {/* Animated Machine Layer */}
        <div className="absolute right-[-5%] top-[10%] w-[500px] h-[500px] opacity-[0.05] pointer-events-none z-0">
          <AnimatedMachineHeader type={formation.category.toLowerCase().includes('chantier') ? 'pelle' : 'grue'} />
        </div>

        <div className="container-galf relative z-20">
          <FadeIn>
            <Link href="/formations" className="inline-flex items-center gap-2 text-sm font-bold hover:text-galf-yellow transition-colors mb-8 uppercase tracking-widest" style={{ color: 'var(--galf-text-secondary)' }}>
              <ArrowLeft className="w-4 h-4" /> Retour au catalogue
            </Link>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{formation.category}</span>
                  <span className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>{formation.level}</span>
                  <span className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>{formation.modality}</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.95]" style={{ color: 'var(--galf-text)' }}>
                  {formation.name}
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>{formation.longDesc}</p>
              </FadeIn>

              <FadeIn delay={0.4} className="flex flex-wrap gap-6 text-sm">
                {[
                  { icon: Clock, v: formation.duration },
                  { icon: MapPin, v: formation.city },
                  { icon: BarChart3, v: formation.level },
                  { icon: BookOpen, v: formation.modality },
                ].map((m, i) => (
                  <span key={i} className="flex items-center gap-2 font-bold" style={{ color: 'var(--galf-text)' }}>
                    <m.icon className="w-4 h-4 text-galf-yellow" /> {m.v}
                  </span>
                ))}
              </FadeIn>
            </div>

            {/* Price card */}
            <div>
              <FadeIn delay={0.5}>
                <div className="glass-card rounded-xl p-8 sticky top-28">
                  <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.2em] mb-4">Tarif de la formation</div>

                  {formation.pricePromo ? (
                    <div className="mb-6">
                      <div className="text-4xl font-black text-galf-yellow">{formation.pricePromo.toLocaleString('fr-FR')} FCFA</div>
                      <div className="text-lg line-through" style={{ color: 'var(--galf-text-secondary)' }}>{formation.price.toLocaleString('fr-FR')} FCFA</div>
                      <div className="mt-2 inline-block bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-md">
                        -{(formation.price - formation.pricePromo).toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-black text-galf-yellow mb-6">{formation.price.toLocaleString('fr-FR')} FCFA</div>
                  )}

                  <div className="space-y-3 mb-8 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                    {["Paiement en plusieurs fois", "Supports de cours inclus", "Certificat de formation", "Accès plateforme e-learning"].map((t, i) => (
                      <div key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t}</div>
                    ))}
                  </div>

                  <Link href="/inscription" className="block w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg text-center hover:brightness-110 transition-all mb-4 shadow-md">
                    S'inscrire à cette formation
                  </Link>
                  <a href="https://wa.me/2250711826507" className="block w-full glass-card font-bold py-4 rounded-lg text-center hover:border-galf-yellow/40 transition-all flex items-center justify-center gap-2" style={{ color: 'var(--galf-text)' }}>
                    <Phone className="w-4 h-4" /> Appeler un conseiller
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-20" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Target, title: "Objectifs", items: formation.objectives, check: true },
              { icon: Shield, title: "Prérequis", items: formation.prerequisites, check: false },
            ].map((sec, idx) => (
              <FadeIn key={idx} delay={0.1 * idx}>
                <div className="glass-card p-8 rounded-xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <sec.icon className="w-6 h-6 text-galf-yellow" />
                    <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>{sec.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {sec.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3" style={{ color: 'var(--galf-text-secondary)' }}>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${sec.check ? 'text-galf-yellow' : 'text-gray-400'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.2}>
              <div className="glass-card p-8 rounded-xl h-full">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-galf-yellow" />
                  <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>Compétences acquises</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formation.skills.map((s, i) => (
                    <span key={i} className="text-sm font-bold px-4 py-2 rounded-lg" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="glass-card p-8 rounded-xl h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-galf-yellow" />
                  <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>Débouchés</h3>
                </div>
                <ul className="space-y-3">
                  {formation.careers.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 font-bold" style={{ color: 'var(--galf-text)' }}>
                      <ArrowRight className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
