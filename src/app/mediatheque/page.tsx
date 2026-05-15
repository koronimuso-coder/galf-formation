"use client"
import Image from 'next/image'
import { Play, Image as ImageIcon, Video, Filter, Maximize2, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'

export default function Mediatheque() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const items = [
    { type: 'video', title: "Formation Pelle sur site minier", img: "/images/engins/pelle-hydraulique.png", duration: "12:45", cat: "Chantier" },
    { type: 'image', title: "Promotion 2024 - San Pedro", img: "/images/engins/bulldozer-d6.png", cat: "Vie du centre" },
    { type: 'video', title: "Démonstration Grue à Tour", img: "/images/engins/grue-tour.png", duration: "05:20", cat: "Levage" },
    { type: 'image', title: "Techniques de forage minier", img: "/images/engins/foreuse-miniere.png", cat: "Technique" },
    { type: 'video', title: "Sécurité Incendie en Carrière", img: "/images/engins/tombereau-rigide.png", duration: "08:15", cat: "Sécurité" },
    { type: 'image', title: "Nouveau Parc d'Engins", img: "/images/engins/chargeuse-sur-pneus.png", cat: "Equipement" },
    { type: 'video', title: "Manceuvre de Compacteur", img: "/images/engins/compacteur-vibreur.png", duration: "03:50", cat: "Témoignage" },
    { type: 'image', title: "Levage Mobile Précision", img: "/images/engins/grue-mobile.png", cat: "Partenariat" },
  ]

  const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter)

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="MÉDIATHÈQUE GALF"
        subtitle="Immersion totale dans l'univers BTP & Mines. Découvrez nos formations, nos équipements et la réussite de nos apprenants en images."
        badge="Archives Visuelles"
        centered={true}
      />

      <div className="container-galf relative z-10 mt-16">

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: 'all', label: 'Tout', icon: Filter },
            { id: 'image', label: 'Photos', icon: ImageIcon },
            { id: 'video', label: 'Vidéos', icon: Video },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all border ${filter === f.id ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-lg' : 'border-galf-border'}`}
              style={filter !== f.id ? { color: 'var(--galf-text)' } : {}}
            >
              <f.icon className="w-4 h-4" /> {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.title}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-galf-carbon via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <div className="w-16 h-16 rounded-full bg-galf-yellow flex items-center justify-center shadow-2xl">
                    {item.type === 'video' ? <Play className="w-6 h-6 text-galf-carbon ml-1" /> : <Maximize2 className="w-6 h-6 text-galf-carbon" />}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                   <div className="text-[10px] font-black uppercase tracking-widest text-galf-yellow mb-1">{item.cat}</div>
                   <h3 className="text-white font-black leading-tight text-lg">{item.title}</h3>
                   {item.type === 'video' && <div className="text-[10px] text-white/60 font-bold mt-2 flex items-center gap-1"><Video className="w-3 h-3" /> {item.duration}</div>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedItem(null)}
               className="absolute inset-0 bg-galf-carbon/95 backdrop-blur-xl"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass-card"
             >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-galf-yellow hover:text-galf-carbon transition-all flex items-center justify-center"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="aspect-video bg-black relative">
                   <Image 
                    src={selectedItem.img} 
                    alt={selectedItem.title} 
                    fill
                    className="object-contain opacity-40" 
                  />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                         {selectedItem.type === 'video' ? (
                            <>
                               <div className="w-24 h-24 rounded-full bg-galf-yellow mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse">
                                  <Play className="w-10 h-10 text-galf-carbon ml-1" />
                               </div>
                               <h2 className="text-3xl font-black text-white mb-2">{selectedItem.title}</h2>
                               <p className="text-white/60">Lancement du lecteur vidéo premium...</p>
                            </>
                         ) : (
                             <Image 
                              src={selectedItem.img} 
                              alt={selectedItem.title} 
                              width={1200}
                              height={800}
                              className="max-h-[70vh] w-auto rounded-xl shadow-2xl mx-auto" 
                            />
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
