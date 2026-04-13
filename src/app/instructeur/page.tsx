"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Users, Video, Calendar, Upload, Settings } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function InstructeurDashboard() {
  return (
    <div className="flex bg-galf-carbon min-h-screen">
      {/* Sidebar Instructeur */}
      <aside className="w-64 bg-galf-anthracite border-r border-galf-steel/10 hidden md:flex flex-col pt-24 shrink-0">
         <div className="px-6 pb-6 border-b border-galf-steel/10">
            <div className="text-white font-black text-xl tracking-tighter">INSTRUCTEUR<span className="text-galf-yellow">.</span></div>
            <div className="text-sm text-galf-steel mt-2">B. Koné (Engins lourds)</div>
         </div>
         <nav className="p-4 space-y-2 text-sm flex-1">
            <a href="#" className="flex items-center gap-3 p-3 rounded-sm bg-galf-yellow/10 text-galf-yellow font-bold">
               <Video className="w-4 h-4" /> Mes Cours
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-sm text-galf-steel hover:bg-white/5 hover:text-white">
               <Users className="w-4 h-4" /> Apprenants
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-sm text-galf-steel hover:bg-white/5 hover:text-white">
               <Calendar className="w-4 h-4" /> Planning Cohorte
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-sm text-galf-steel hover:bg-white/5 hover:text-white">
               <Upload className="w-4 h-4" /> Dépôt ressources
            </a>
         </nav>
         <div className="p-4 border-t border-galf-steel/10">
            <a href="#" className="flex items-center gap-3 p-3 rounded-sm text-galf-steel hover:bg-white/5 hover:text-white text-sm">
               <Settings className="w-4 h-4" /> Paramètres
            </a>
         </div>
      </aside>

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 overflow-y-auto w-full relative overflow-hidden">
         {/* Background Machine for Instructeur */}
         <div className="absolute right-[5%] top-[10%] w-[500px] h-[500px] opacity-[0.03] pointer-events-none z-0">
            <AnimatedMachineHeader type="grue" />
         </div>

         <div className="relative z-10">
         <FadeIn>
           <h1 className="text-3xl font-black text-white mb-8">Espace <span className="text-galf-yellow">Pédagogique</span></h1>
         </FadeIn>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Apprenants actifs", value: "48", icon: Users },
              { label: "Cours mis en ligne", value: "12", icon: Video },
              { label: "Évaluations à corriger", value: "5", icon: Calendar },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1*i}>
                <div className="bg-galf-anthracite p-6 rounded-sm border border-galf-steel/20 shadow-xl shadow-black/20">
                   <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-galf-steel font-bold uppercase">{stat.label}</div>
                      <stat.icon className="w-5 h-5 text-galf-yellow" />
                   </div>
                   <div className="text-3xl font-black text-white">{stat.value}</div>
                </div>
              </FadeIn>
            ))}
         </div>

         <div className="grid lg:grid-cols-2 gap-8">
            <FadeIn delay={0.3}>
              <div className="bg-galf-anthracite border border-galf-steel/20 rounded-sm p-6 shadow-xl">
                 <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-sm flex items-center justify-between">
                   Mes modules récents
                   <button className="text-xs bg-galf-carbon border border-galf-steel/30 px-3 py-1 text-galf-steel hover:text-white rounded-sm">Voir tout</button>
                 </h3>
                 <div className="space-y-4">
                   {[
                     { name: "CACES Pelle Hydraulique - Partie 1", cat: "Pratique", status: "Publié" },
                     { name: "Sécurité VGP - Théorie", cat: "Théorie", status: "Brouillon" },
                     { name: "Techniques de levage", cat: "Pratique", status: "Publié" },
                   ].map((mod, i) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-galf-carbon border border-galf-steel/10 rounded-sm hover:border-galf-yellow/30 transition-colors cursor-pointer">
                        <div>
                          <div className="text-sm font-bold text-white mb-1">{mod.name}</div>
                          <div className="text-xs text-galf-steel uppercase tracking-widest">{mod.cat}</div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-sm ${mod.status === 'Publié' ? 'bg-green-500/10 text-green-500' : 'bg-galf-steel/10 text-galf-steel'}`}>
                          {mod.status}
                        </span>
                     </div>
                   ))}
                 </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-galf-anthracite border border-galf-steel/20 rounded-sm p-6 shadow-xl">
                 <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-sm text-center">Progression Cohorte Mars</h3>
                 <div className="flex flex-col items-center justify-center py-8">
                   <div className="w-48 h-48 rounded-full border-[16px] border-galf-carbon relative flex items-center justify-center shadow-inner">
                      {/* Fake progress circle */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" className="stroke-galf-yellow" strokeWidth="16" fill="none" strokeDasharray="300" strokeDashoffset="75" strokeLinecap="round" />
                      </svg>
                      <div className="text-center">
                        <div className="text-4xl font-black text-white">75%</div>
                        <div className="text-xs text-galf-steel font-bold uppercase mt-1">Complétion</div>
                      </div>
                   </div>
                   <p className="text-sm text-galf-steel mt-8 text-center max-w-xs">
                     Le niveau d'avancement global de la classe est bon. Les évaluations de fin de module 3 sont imminentes.
                   </p>
                 </div>
              </div>
            </FadeIn>
         </div>
         </div>
      </main>
    </div>
  )
}
