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
    <section className="py-12 border-y border-zinc-200 dark:border-white/10 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container-galf">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className="glass-card p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <item.icon className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
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
