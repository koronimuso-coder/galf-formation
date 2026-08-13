"use client"
import { Award, FileText, CheckCircle } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function AccreditationBlock() {
  const accreditations = [
    {
      title: "Ministère de l'Enseignement Technique",
      subtitle: "Agrément Officiel N°2024/METFIP",
      desc: "Programmes pédagogiques homologués et conformes au référentiel national de formation professionnelle.",
      icon: Award
    },
    {
      title: "Référentiel CACES & International",
      subtitle: "Certifications R482, R483, R489",
      desc: "Examens théoriques et pratiques calqués sur les normes de sécurité européennes et ouest-africaines.",
      icon: FileText
    },
    {
      title: "Accréditation Normes HSE",
      subtitle: "Conformité SST & Sécurité Chantier",
      desc: "Chaque apprenant est formé aux standards de sécurité les plus rigoureux exigés par les majors minières et BTP.",
      icon: CheckCircle
    }
  ]

  return (
    <section className="py-24 border-t border-slate-200 dark:border-white/5 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.02] pointer-events-none" />
      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em] mb-3 block">Crédibilité & Agréments</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Une certification <span className="text-amber-500">reconnue</span>
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-3 font-medium">
              GALF FORMATION est un établissement agréé. Nos certificats ouvrent directement les portes de l'emploi en Côte d'Ivoire et dans la sous-région.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {accreditations.map((acc, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className="glass-card p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <acc.icon className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wide leading-tight">
                    {acc.title}
                  </h3>
                  <span className="text-[10px] text-amber-500 font-bold block mt-1 uppercase tracking-wider">
                    {acc.subtitle}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2 font-medium">
                  {acc.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                <span>Statut : ACTIF & CONFORME</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Validé
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
