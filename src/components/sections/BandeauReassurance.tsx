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
    <section className="py-12 border-b border-white/5 relative overflow-hidden bg-zinc-950/20">
      <div className="container-galf">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className="stitch-card p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start stitch-hud-corner group">
              <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform stitch-icon-glow">
                <item.icon className="w-5 h-5 text-galf-yellow" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs uppercase tracking-wider text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-zinc-400 font-sans">
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
