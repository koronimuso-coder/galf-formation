"use client"
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import { FadeIn } from '@/components/animations/FadeIn'

export function FormationsSimilaires({ currentSlug = '' }: { currentSlug?: string }) {
  // Find related formations (exclude current one, show up to 3)
  const currentFormation = GALF_FORMATIONS.find(f => f.slug === currentSlug)
  const category = currentFormation?.category || 'Chantier'
  
  let related = GALF_FORMATIONS.filter(f => f.slug !== currentSlug && f.category === category && f.status === 'Actif').slice(0, 3)
  if (related.length === 0) {
    related = GALF_FORMATIONS.filter(f => f.slug !== currentSlug && f.status === 'Actif').slice(0, 3)
  }

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-950/20">
      <div className="container-galf">
        <div className="mb-10">
          <span className="text-[10px] text-galf-yellow font-bold uppercase tracking-[0.3em] mb-2 block">Catalogue</span>
          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Formations <span className="text-galf-yellow">similaires</span>
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((f, idx) => {
            const displayImage = getFormationImage(f.slug)
            return (
              <FadeIn key={f.slug} delay={idx * 0.1} className="stitch-card rounded-2xl overflow-hidden flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-300 relative group">
                <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] pointer-events-none" />
                
                <div>
                  {/* Image container */}
                  <div className="relative h-44 w-full bg-slate-900 dark:bg-zinc-900 overflow-hidden">
                    <Image 
                      src={displayImage} 
                      alt={f.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[9px] font-black uppercase text-galf-yellow tracking-widest border border-galf-yellow/20">
                      {f.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3 font-sans">
                    <h4 className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white leading-tight block group-hover:text-galf-yellow transition-colors">
                      {f.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-normal line-clamp-2">
                      {f.shortDesc}
                    </p>
                    <div className="flex gap-4 text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest pt-2 font-bold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-galf-yellow" /> {f.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-galf-yellow" /> {f.city}</span>
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-200 dark:border-white/5 mt-4">
                  <span className="text-xs font-black text-galf-yellow">{f.pricePromo ? `${f.pricePromo.toLocaleString('fr-FR')} F` : `${f.price.toLocaleString('fr-FR')} F`}</span>
                  <Link 
                    href={`/formations/${f.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-white hover:text-galf-yellow transition-colors"
                  >
                    Fiche parcours <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
