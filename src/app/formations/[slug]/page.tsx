"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowLeft, ArrowRight, Clock, MapPin, BarChart3, BookOpen, Target, Briefcase, CheckCircle2, Phone, Shield } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

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
    <div className="min-h-screen pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Hero */}
      <PageHeader
        title={formation.name.toUpperCase()}
        subtitle={formation.shortDesc}
        badge={formation.category}
        bgImage={getFormationImage(formation.slug)}
      >
        <div className="flex flex-wrap gap-4 mt-8">
          <Link href="/formations" className="glass-card px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-galf-yellow/50 transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md bg-white/10 border border-white/10 text-white/70">{formation.level}</span>
            <span className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md bg-white/10 border border-white/10 text-white/70">{formation.modality}</span>
          </div>
        </div>
      </PageHeader>

      <div className="container-galf relative z-20 -mt-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FadeIn delay={0.2}>
              <div className="glass-card p-8 rounded-3xl border-galf-yellow/20">
                <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Présentation du parcours</h2>
                <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>{formation.longDesc}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { icon: Clock, v: formation.duration, label: "Durée" },
                    { icon: MapPin, v: formation.city, label: "Lieu" },
                    { icon: BarChart3, v: formation.level, label: "Niveau" },
                    { icon: BookOpen, v: formation.modality, label: "Modalité" },
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase text-galf-yellow tracking-widest">{m.label}</span>
                      <span className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--galf-text)' }}>
                        <m.icon className="w-3 h-3 text-galf-yellow" /> {m.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Target, title: "Objectifs", items: formation.objectives, check: true },
                { icon: Shield, title: "Prérequis", items: formation.prerequisites, check: false },
              ].map((sec, idx) => (
                <FadeIn key={idx} delay={0.1 * idx}>
                  <div className="glass-card p-8 rounded-2xl h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <sec.icon className="w-6 h-6 text-galf-yellow" />
                      <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>{sec.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${sec.check ? 'text-galf-yellow' : 'text-gray-400'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}

              <FadeIn delay={0.2}>
                <div className="glass-card p-8 rounded-2xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-galf-yellow" />
                    <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>Compétences</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formation.skills.map((s, i) => (
                      <span key={i} className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="glass-card p-8 rounded-2xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="w-6 h-6 text-galf-yellow" />
                    <h3 className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>Débouchés</h3>
                  </div>
                  <ul className="space-y-3">
                    {formation.careers.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 font-bold text-sm" style={{ color: 'var(--galf-text)' }}>
                        <ArrowRight className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Price & Registration Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.5}>
              <div className="glass-card rounded-3xl p-8 sticky top-28 border-galf-yellow/20">
                <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.2em] mb-4">Tarif de la formation</div>

                {formation.pricePromo ? (
                  <div className="mb-6">
                    <div className="text-4xl font-black text-galf-yellow">{formation.pricePromo.toLocaleString('fr-FR')} FCFA</div>
                    <div className="text-lg line-through" style={{ color: 'var(--galf-text-secondary)' }}>{formation.price.toLocaleString('fr-FR')} FCFA</div>
                    <div className="mt-2 inline-block bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-md">
                      REMISE : -{(formation.price - formation.pricePromo).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl font-black text-galf-yellow mb-6">{formation.price.toLocaleString('fr-FR')} FCFA</div>
                )}

                <div className="space-y-3 mb-8 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                  {["Paiement en plusieurs fois", "Supports de cours inclus", "Certificat de formation", "Accès plateforme e-learning"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {t}
                    </div>
                  ))}
                </div>

                <Link href="/inscription" className="block w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-xl text-center hover:brightness-110 transition-all mb-4 shadow-xl shadow-galf-yellow/10">
                  S'inscrire maintenant
                </Link>
                <a href="https://wa.me/2250711826507" className="block w-full glass-card font-bold py-4 rounded-xl text-center hover:border-galf-yellow/40 transition-all flex items-center justify-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <Phone className="w-4 h-4" /> Appeler un conseiller
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
