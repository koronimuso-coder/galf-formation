"use client"
import { Users, BookOpen, Banknote, Briefcase, ChevronRight, Activity, LayoutDashboard, Settings, FileText, PieChart } from 'lucide-react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen pt-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Sidebar Admin */}
      <aside className="w-64 border-r hidden lg:block shrink-0 h-[calc(100vh-80px)] sticky top-20" style={{ background: 'var(--galf-surface)', borderRight: '1px solid var(--galf-border)' }}>
         <div className="p-6 border-b" style={{ borderBottom: '1px solid var(--galf-border)' }}>
            <div className="font-black text-xl tracking-tighter" style={{ color: 'var(--galf-text)' }}>ADMIN<span className="text-galf-yellow">.</span></div>
         </div>
         <nav className="p-4 space-y-1 text-sm">
            {[
              { label: "Dashboard", icon: LayoutDashboard, active: true },
              { label: "Formations", icon: BookOpen },
              { label: "Inscriptions", icon: FileText },
              { label: "Candidats", icon: Users },
              { label: "Finance", icon: Banknote },
              { label: "Entreprises", icon: Briefcase },
              { label: "Analyses", icon: PieChart },
              { label: "Paramètres", icon: Settings },
            ].map((item, i) => (
              <a key={i} href="#" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? 'bg-galf-yellow text-galf-carbon font-bold shadow-md' : 'hover:bg-galf-yellow/10'}`}
                style={!item.active ? { color: 'var(--galf-text-secondary)' } : {}}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
         </nav>
      </aside>

      <main className="flex-1 p-8 w-full relative overflow-hidden">
         {/* Background Machine for Admin - Rouleau for Management/Finalization */}
         <div className="absolute right-[-10%] top-[-5%] w-[800px] h-[800px] opacity-[0.03] pointer-events-none z-0">
            <AnimatedMachineHeader type="rouleau" />
         </div>

         <div className="relative z-10">
         <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
               <div>
                  <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-2">Bienvenue Admin</div>
                  <TextReveal 
                    text="ADMINISTRATION" 
                    className="text-3xl font-black tracking-tighter text-white" 
                  />
               </div>
               <div className="mt-4 md:mt-0 glass-card px-4 py-2 rounded-xl text-xs font-bold" style={{ color: 'var(--galf-text-secondary)' }}>
                  Dernières sync : Aujourd'hui à 14:32
               </div>
            </div>
         </FadeIn>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Candidats totaux", value: "342", icon: Users, color: "text-blue-500", trend: "+12%" },
              { label: "Inscriptions", value: "28", icon: BookOpen, color: "text-galf-yellow", trend: "+5%" },
              { label: "Revenu Estimé", value: "8.5M F", icon: Banknote, color: "text-green-500", trend: "+18%" },
              { label: "Demandes B2B", value: "12", icon: Briefcase, color: "text-purple-500", trend: "0%" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1*i}>
                <div className="glass-card p-6 rounded-2xl border hover:border-galf-yellow/30 transition-all cursor-default group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--galf-text)' }}>{stat.label}</div>
                      <div className="w-8 h-8 rounded-lg bg-galf-yellow/10 flex items-center justify-center">
                         <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                   </div>
                   <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-black" style={{ color: 'var(--galf-text)' }}>{stat.value}</div>
                      <div className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>{stat.trend}</div>
                   </div>
                </div>
              </FadeIn>
            ))}
         </div>

         <div className="grid lg:grid-cols-3 gap-8">
            <FadeIn delay={0.4} className="lg:col-span-2">
               <div className="glass-card rounded-2xl p-6 h-full">
                  <h3 className="font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                    <Activity className="w-4 h-4 text-galf-yellow" /> Dernières candidatures
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b" style={{ borderBottom: '1px solid var(--galf-border)' }}>
                         <tr>
                           <th className="pb-4 font-black text-[10px] uppercase opacity-40">Candidat</th>
                           <th className="pb-4 font-black text-[10px] uppercase opacity-40">Formation</th>
                           <th className="pb-4 font-black text-[10px] uppercase opacity-40">Statut</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderBottom: '1px solid var(--galf-border)' }}>
                         {[
                           { name: "Kouakou Marc", form: "Pelle hydraulique", status: "Nouveau", sCol: "text-blue-500 bg-blue-500/10" },
                           { name: "Sylla Amadou", form: "Forage minier", status: "En attente", sCol: "text-yellow-500 bg-yellow-500/10" },
                           { name: "Bamba Fanta", form: "HSE", status: "Admis", sCol: "text-green-500 bg-green-500/10" },
                           { name: "Kone Cheick", form: "Grue mobile", status: "Nouveau", sCol: "text-blue-500 bg-blue-500/10" },
                         ].map((row, i) => (
                           <tr key={i} className="hover:bg-galf-yellow/5 transition-colors">
                             <td className="py-4 font-bold" style={{ color: 'var(--galf-text)' }}>{row.name}</td>
                             <td className="py-4 text-xs opacity-60" style={{ color: 'var(--galf-text)' }}>{row.form}</td>
                             <td className="py-4">
                               <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${row.sCol}`}>
                                 {row.status}
                               </span>
                             </td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </FadeIn>

            <FadeIn delay={0.5}>
               <div className="glass-card rounded-2xl p-6 h-full">
                  <h3 className="font-black mb-8 uppercase tracking-widest text-xs text-center" style={{ color: 'var(--galf-text)' }}>Populaire</h3>
                  <div className="space-y-6">
                    {[
                      { n: "Pelle hydraulique", c: 45 },
                      { n: "Chariot élévateur", c: 38 },
                      { n: "Grue mobile", c: 32 },
                      { n: "HSE", c: 29 },
                    ].map((t, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-bold" style={{ color: 'var(--galf-text)' }}>{t.n}</span>
                          <span className="text-galf-yellow font-black">{t.c}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
                          <div className="h-full bg-galf-yellow" style={{ width: `${(t.c / 50) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/20 text-center">
                     <p className="text-[10px] font-bold opacity-60" style={{ color: 'var(--galf-text)' }}>Promotion active : -15% sur le catalogue Levant</p>
                  </div>
               </div>
            </FadeIn>
         </div>
         </div>
      </main>
    </div>
  )
}
