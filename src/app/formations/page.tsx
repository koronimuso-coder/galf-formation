"use client"
import { useState } from 'react'
import Link from 'next/link'
import { GALF_FORMATIONS } from '@/lib/data'
import { getFormationImage } from '@/lib/images'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { Search, Clock, MapPin, ArrowRight, X } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function FormationsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')

  const categories = ['Toutes', ...Array.from(new Set(GALF_FORMATIONS.map(f => f.category)))]

  const filtered = GALF_FORMATIONS.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.shortDesc.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Toutes' || f.category === category
    return matchSearch && matchCat && f.status === 'Actif'
  })

  return (
    <div className="min-h-screen relative overflow-hidden pt-28 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG - Rouleau for "Solid Foundations" */}
      <div className="absolute right-[-10%] top-[0%] w-[800px] h-[800px] opacity-[0.03] pointer-events-none z-0">
        <AnimatedMachineHeader type="rouleau" />
      </div>
      
      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="mb-16 relative">
            <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">19 parcours certifiants</div>
            <TextReveal 
              text="NOS FORMATIONS EXPERTES" 
              className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white" 
            />
            <p className="text-lg max-w-3xl" style={{ color: 'var(--galf-text-secondary)' }}>
              De 15 000 à 850 000 FCFA, trouvez la formation qui correspond à votre ambition.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--galf-text-secondary)' }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une formation..."
                className="w-full rounded-lg pl-12 pr-10 py-4 focus:outline-none focus:ring-2 focus:ring-galf-yellow transition-all"
                style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
              {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--galf-text-secondary)' }}><X className="w-4 h-4" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${category === cat ? 'bg-galf-yellow text-galf-carbon' : ''}`}
                  style={category !== cat ? { background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' } : {}}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="text-sm font-bold mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
            {filtered.length} formation{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((f, i) => (
            <FadeIn key={f.id} delay={Math.min(0.08 * i, 0.5)}>
              <Link href={`/formations/${f.slug}`} className="group block h-full">
                <div className="glass-card rounded-xl overflow-hidden h-full hover:border-galf-yellow/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                  <div className="h-44 relative overflow-hidden shrink-0">
                    <img src={getFormationImage(f.slug)} alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {f.pricePromo && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 text-[10px] font-black uppercase rounded-md animate-pulse">Promo</div>}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{f.category}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-black mb-2 group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{f.name}</h3>
                    <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: 'var(--galf-text-secondary)' }}>{f.shortDesc}</p>
                    <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--galf-text-secondary)' }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--galf-border)' }}>
                      <div>
                        {f.pricePromo ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-galf-yellow">{f.pricePromo.toLocaleString('fr-FR')} F</span>
                            <span className="text-xs line-through" style={{ color: 'var(--galf-text-secondary)' }}>{f.price.toLocaleString('fr-FR')}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-black text-galf-yellow">{f.price.toLocaleString('fr-FR')} FCFA</span>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-galf-yellow transition-colors" style={{ border: '1px solid var(--galf-border)' }}>
                        <ArrowRight className="w-4 h-4 group-hover:text-galf-carbon transition-colors" style={{ color: 'var(--galf-text-secondary)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black mb-2" style={{ color: 'var(--galf-text)' }}>Aucune formation trouvée</h3>
            <p style={{ color: 'var(--galf-text-secondary)' }}>Essayez un autre terme.</p>
          </div>
        )}
      </div>
    </div>
  )
}
