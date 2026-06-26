"use client"
import { useState } from 'react'
import { InteractiveMachineSimulator } from '@/components/3d/InteractiveMachineSimulator'
import { ArrowLeft, Play, Info } from 'lucide-react'
import Link from 'next/link'

export default function SimulatorPage() {
  const [selectedMachine, setSelectedMachine] = useState<'pelle-hydraulique' | 'grue-tour' | 'bulldozer' | null>(null)

  const machines = [
    {
      slug: 'pelle-hydraulique' as const,
      name: 'Pelle Hydraulique',
      desc: 'Excavation de tranchées et terrassement intensif.',
      img: '/images/formations/pelle-hydraulique.png',
      difficulty: 'Intermédiaire',
    },
    {
      slug: 'grue-tour' as const,
      name: 'Grue à Tour',
      desc: 'Levage de charges lourdes et manutention aérienne.',
      img: '/images/formations/grue-tour.png',
      difficulty: 'Avancé',
    },
    {
      slug: 'bulldozer' as const,
      name: 'Bulldozer D6',
      desc: 'Poussage et nivellement de précision sur chenilles.',
      img: '/images/formations/bulldozer.png',
      difficulty: 'Débutant',
    },
  ]

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: '#0a0a0c' }}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal opacity-5" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-galf-yellow/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="container-galf pt-24 relative z-10">
        
        {/* Header navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link 
              href="/mediatheque"
              className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-xs mb-4 hover:gap-4 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à la Médiathèque
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
              Simulateur <span className="text-galf-yellow">3D Interactif</span>
            </h1>
            <p className="text-white/60 text-sm max-w-xl mt-2">
              Bénéficiez de la technologie de formation virtuelle de GALF. Testez la manipulation des commandes hydrauliques et appliquez le protocole de sécurité HSE.
            </p>
          </div>

          <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border-galf-yellow/20 bg-white/5">
             <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow">
                <Info className="w-5 h-5" />
             </div>
             <div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40 text-white">Technologie de pointe</div>
                <div className="text-xs font-black text-white">Synthèse Web Audio & SVGs Actifs</div>
             </div>
          </div>
        </div>

        {/* Simulator Area */}
        {!selectedMachine ? (
          // Selection view
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {machines.map((mach, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedMachine(mach.slug)}
                className="glass-card rounded-[2rem] overflow-hidden group hover:border-galf-yellow/40 transition-all duration-500 cursor-pointer flex flex-col h-full bg-white/5 border-white/5"
              >
                <div className="h-48 relative overflow-hidden bg-black shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={mach.img} 
                    alt={mach.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-galf-yellow text-galf-carbon text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-md">
                      {mach.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-galf-yellow transition-colors">{mach.name}</h3>
                    <p className="text-xs text-white/60 leading-relaxed mb-6">{mach.desc}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/30">MODULE SIMULATEUR</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-galf-yellow group-hover:border-galf-yellow transition-colors">
                      <Play className="w-4 h-4 text-white group-hover:text-galf-carbon ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Active simulator view
          <div className="flex flex-col gap-6 mt-8">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 px-6 rounded-2xl">
              <span className="text-xs font-bold text-white/50">
                Engin en cours : <strong className="text-white uppercase font-black">{selectedMachine.replace('-', ' ')}</strong>
              </span>
              <button 
                onClick={() => setSelectedMachine(null)}
                className="text-xs font-black text-galf-yellow uppercase hover:underline"
              >
                Changer de machine
              </button>
            </div>
            
            <InteractiveMachineSimulator 
              machineSlug={selectedMachine} 
              machineName={machines.find(m => m.slug === selectedMachine)?.name || ''} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
