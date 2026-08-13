"use client"
import { ShieldCheck, HardHat, Briefcase, CreditCard } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function BandeauReassurance() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Certifié par l'État",
      desc: "Diplômes agréés par le Ministère de l'Enseignement Technique de Côte d'Ivoire."
    },
    {
      icon: HardHat,
      title: "80% Pratique Terrain",
      desc: "Pratique réelle intensive sur plateau technique de pointe et simulateur 3D."
    },
    {
      icon: Briefcase,
      title: "Réseau Emploi B2B",
      desc: "Partenariats avec 50+ grandes entreprises du BTP et des Mines pour l'insertion."
    },
    {
      icon: CreditCard,
      title: "Financement Souple",
      desc: "Facilités de paiement échelonnées en 3x ou 6x par Wave, OM ou virement."
    }
  ]

  return (
    <section className="py-12 border-y border-slate-200 dark:border-white/10 relative overflow-hidden bg-slate-50 dark:bg-slate-950/50">
      <div className="container-galf">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className="glass-card p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start group border border-slate-200 dark:border-white/10 hover:border-amber-500/40 transition-all shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-orange-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all">
                <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
