"use client"
import { Users, BookOpen, Banknote, Briefcase, Activity, LayoutDashboard, Settings, FileText, PieChart, ShieldAlert } from 'lucide-react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
import { useState, useEffect } from 'react'

function IndustrialGauge({ value, label, unit }: { value: number, label: string, unit: string }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-galf-yellow/20 to-transparent" />
      <div className="relative w-28 h-28 flex items-center justify-center mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
          {/* Guide ring */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          {/* Progress ring */}
          <circle 
            cx="50" cy="50" r={radius} fill="none" 
            stroke="var(--galf-yellow)" 
            strokeWidth="6" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black font-mono tracking-tight text-white">{value}{unit}</span>
          <span className="text-[7px] font-black text-white/40 uppercase tracking-widest mt-0.5">{label}</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  // Live workload simulation
  const [simulatorCpu, setSimulatorCpu] = useState(64)
  const [certsIssued, setCertsIssued] = useState(342)
  const [activeB2b, setActiveB2b] = useState(12)

  // Admin Messages State
  const [adminMessages, setAdminMessages] = useState([
    { id: 1, student: "Jean Kouadio", subject: "Erreur signature règlement", text: "Bonjour, je n'arrive pas à signer le règlement intérieur depuis mon cockpit mobile. Pouvez-vous valider mon profil ?", date: "10:14", read: false, replied: false },
    { id: 2, student: "Mariam Diallo", subject: "Justificatif de paiement", text: "J'ai effectué le versement de l'acompte de 30% via Wave. Voici ma référence de transaction.", date: "09:32", read: true, replied: false },
    { id: 3, student: "Yao Anderson", subject: "Demande de stage", text: "Je cherche un stage pratique suite à ma certification de pelle hydraulique. Des opportunités ?", date: "Hier", read: true, replied: true }
  ])
  const [activeMsgId, setActiveMsgId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  // Promo Configurator States
  const [promoCode, setPromoCode] = useState("GALF15")
  const [discountVal, setDiscountVal] = useState(15)
  const [promoActive, setPromoActive] = useState(false)
  const [promoMessage, setPromoMessage] = useState("")

  const activeMessage = adminMessages.find(m => m.id === activeMsgId)

  const handleSendReply = () => {
    if (!activeMsgId || !replyText.trim()) return
    setAdminMessages(prev => prev.map(m => {
      if (m.id === activeMsgId) return { ...m, replied: true, read: true }
      return m
    }))
    setReplyText("")
    alert(`Réponse envoyée à ${activeMessage?.student} !`)
  }

  const handleArchiveMessage = (id: number) => {
    setAdminMessages(prev => prev.filter(m => m.id !== id))
    setActiveMsgId(null)
  }

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return
    setPromoActive(true)
    setPromoMessage(`Promotion '${promoCode}' (${discountVal}%) activée sur tout le catalogue !`)
    localStorage.setItem('galf_global_promo_code', promoCode)
    localStorage.setItem('galf_global_discount', String(discountVal))
    setTimeout(() => {
      setPromoMessage("")
    }, 4000)
  }

  const handleDeactivatePromo = () => {
    setPromoActive(false)
    localStorage.removeItem('galf_global_promo_code')
    localStorage.removeItem('galf_global_discount')
    alert("Promotion globale désactivée.")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Modulate CPU load between 55% and 85%
      setSimulatorCpu(Math.round(55 + Math.random() * 30))
      // Occasionally increment certificates and B2B requests
      if (Math.random() > 0.85) setCertsIssued(prev => prev + 1)
      if (Math.random() > 0.92) setActiveB2b(prev => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen pt-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Sidebar Admin */}
      <aside className="w-64 border-r hidden lg:block shrink-0 h-[calc(100vh-80px)] sticky top-20" style={{ background: 'var(--galf-surface)', borderRight: '1px solid var(--galf-border)' }}>
         <div className="p-6 border-b" style={{ borderBottom: '1px solid var(--galf-border)' }}>
            <div className="font-black text-xl tracking-tighter text-white">ADMIN<span className="text-galf-yellow">.</span></div>
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
         {/* Background Machine for Admin */}
         <div className="absolute right-[-10%] top-[-5%] w-[800px] h-[800px] opacity-[0.03] pointer-events-none z-0">
            <AnimatedMachineHeader type="rouleau" />
         </div>

         <div className="relative z-10">
          <FadeIn>
             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <div>
                   <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-2">Bienvenue Admin</div>
                   <div style={{ color: 'var(--galf-text)' }}>
                      <TextReveal 
                        text="ADMINISTRATION" 
                        className="text-3xl font-black tracking-tighter" 
                      />
                   </div>
                </div>
                <div className="mt-4 md:mt-0 glass-card px-4 py-2 rounded-xl text-xs font-bold" style={{ color: 'var(--galf-text-secondary)' }}>
                   Dernières sync : Aujourd'hui à 14:32
                </div>
             </div>
          </FadeIn>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {[
               { label: "Candidats totaux", value: "342", icon: Users, color: "text-blue-500", trend: "+12%" },
               { label: "Inscriptions", value: "28", icon: BookOpen, color: "text-galf-yellow", trend: "+5%" },
               { label: "Revenu Estimé", value: "8.5M F", icon: Banknote, color: "text-green-500", trend: "+18%" },
               { label: "Demandes B2B", value: "12", icon: Briefcase, color: "text-purple-500", trend: "0%" },
             ].map((stat, i) => (
               <FadeIn key={i} delay={0.1*i}>
                 <div className="glass-card p-6 rounded-2xl border hover:border-galf-yellow/30 transition-all cursor-default group border-galf-border">
                    <div className="flex justify-between items-start mb-4">
                       <div className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">{stat.label}</div>
                       <div className="w-8 h-8 rounded-lg bg-galf-yellow/10 flex items-center justify-center">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                       </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                       <div className="text-3xl font-black text-white">{stat.value}</div>
                       <div className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>{stat.trend}</div>
                    </div>
                 </div>
               </FadeIn>
             ))}
          </div>

          {/* ═══════════════════════════════════════════════
              NEW: INDUSTRIAL DIALS / SYSTEM TRAFFIC GAUGES
             ═══════════════════════════════════════════════ */}
          <div className="mb-12">
            <FadeIn>
              <h3 className="font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-2 text-white">
                <ShieldAlert className="w-4 h-4 text-galf-yellow animate-pulse" /> Moniteur de Charge & Trafic Systèmes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <IndustrialGauge value={simulatorCpu} label="Charge Simul. 3D" unit="%" />
                <IndustrialGauge value={certsIssued} label="Attestations Émises" unit="" />
                <IndustrialGauge value={activeB2b} label="Planning Actif B2B" unit=" req" />
              </div>
            </FadeIn>
          </div>

          {/* ═══════════════════════════════════════════════
              NEW ROW: ADMIN MESSAGING SIMULATOR & PROMO CONFIGURATOR
             ═══════════════════════════════════════════════ */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* 1. Admin Messaging Inbox Simulator */}
            <FadeIn delay={0.2}>
              <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                <div>
                  <h3 className="font-black mb-4 uppercase tracking-widest text-xs text-white flex items-center gap-2">
                    💬 Boîte de Réception Étudiants
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {adminMessages.map(msg => (
                      <button
                        key={msg.id}
                        onClick={() => setActiveMsgId(msg.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-start ${
                          activeMsgId === msg.id 
                            ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                            : 'bg-black/30 border-white/5 text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                            <span>{msg.student}</span>
                            {!msg.read && (
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          <div className="text-xs font-bold truncate mt-0.5">{msg.subject}</div>
                        </div>
                        <span className="text-[9px] opacity-40 font-mono">{msg.date}</span>
                      </button>
                    ))}
                  </div>

                  {activeMessage && (
                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 text-xs animate-fadeIn space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="font-black text-[10px] text-galf-yellow uppercase">Message de {activeMessage.student}</span>
                        <button 
                          onClick={() => handleArchiveMessage(activeMessage.id)}
                          className="text-[9px] font-black uppercase text-red-400 hover:text-red-300"
                        >
                          Archiver ✕
                        </button>
                      </div>
                      <p className="text-white/80 leading-relaxed italic">"{activeMessage.text}"</p>
                      
                      {activeMessage.replied ? (
                        <div className="text-[10px] text-green-400 font-bold">✓ Réponse envoyée avec succès</div>
                      ) : (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Rédiger une réponse..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-galf-yellow"
                          />
                          <button 
                            onClick={handleSendReply}
                            className="bg-galf-yellow text-galf-carbon px-4 py-2 rounded-lg font-black text-xs uppercase"
                          >
                            Envoyer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* 2. Global Pricing Configurator */}
            <FadeIn delay={0.3}>
              <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                <div className="space-y-4">
                  <h3 className="font-black uppercase tracking-widest text-xs text-white flex items-center gap-2">
                    🏷️ Configurateur de Tarification Globale
                  </h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Simulez l'application d'un code promo global sur le catalogue pour booster les inscriptions de fin d'année.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Code Promotionnel</label>
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black uppercase text-white/50">
                        <span>Pourcentage de Remise</span>
                        <span className="text-galf-yellow font-black">{discountVal}%</span>
                      </div>
                      <input 
                        type="range" min="5" max="30" step="5" value={discountVal}
                        onChange={e => setDiscountVal(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  {promoMessage && (
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-xs font-bold text-green-400 animate-pulse">
                      {promoMessage}
                    </div>
                  )}

                  {promoActive ? (
                    <button
                      onClick={handleDeactivatePromo}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg"
                    >
                      Désactiver la promotion active
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyPromo}
                      className="w-full py-3.5 rounded-xl bg-galf-yellow text-galf-carbon font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                    >
                      Appliquer la promotion
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>
            
          </div>

          {/* Tables Row */}
          <div className="grid lg:grid-cols-3 gap-8">
             <FadeIn delay={0.4} className="lg:col-span-2">
                <div className="glass-card rounded-2xl p-6 h-full border-galf-border">
                   <h3 className="font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-2 text-white">
                     <Activity className="w-4 h-4 text-galf-yellow" /> Dernières candidatures
                   </h3>
                   
                   <div className="overflow-x-auto animate-fadeIn">
                     <table className="w-full text-left text-sm text-white">
                       <thead className="border-b border-white/5">
                          <tr>
                            <th className="pb-4 font-black text-[10px] uppercase opacity-40">Candidat</th>
                            <th className="pb-4 font-black text-[10px] uppercase opacity-40">Formation</th>
                            <th className="pb-4 font-black text-[10px] uppercase opacity-40">Statut</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {[
                            { name: "Kouakou Marc", form: "Pelle hydraulique", status: "Nouveau", sCol: "text-blue-500 bg-blue-500/10" },
                            { name: "Sylla Amadou", form: "Forage minier", status: "En attente", sCol: "text-yellow-500 bg-yellow-500/10" },
                            { name: "Bamba Fanta", form: "HSE", status: "Admis", sCol: "text-green-500 bg-green-500/10" },
                            { name: "Kone Cheick", form: "Grue mobile", status: "Nouveau", sCol: "text-blue-500 bg-blue-500/10" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-galf-yellow/5 transition-colors">
                              <td className="py-4 font-bold">{row.name}</td>
                              <td className="py-4 text-xs opacity-60">{row.form}</td>
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
                <div className="glass-card rounded-2xl p-6 h-full border-galf-border">
                   <h3 className="font-black mb-8 uppercase tracking-widest text-xs text-center text-white">Populaire</h3>
                   <div className="space-y-6">
                     {[
                       { n: "Pelle hydraulique", c: 45 },
                       { n: "Chariot élévateur", c: 38 },
                       { n: "Grue mobile", c: 32 },
                       { n: "HSE", c: 29 },
                     ].map((t, i) => (
                       <div key={i}>
                         <div className="flex justify-between text-xs mb-2">
                           <span className="font-bold text-white">{t.n}</span>
                           <span className="text-galf-yellow font-black">{t.c}</span>
                         </div>
                         <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
                           <div className="h-full bg-galf-yellow" style={{ width: `${(t.c / 50) * 100}%` }} />
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-12 p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/20 text-center">
                      <p className="text-[10px] font-bold opacity-60 text-white">Promotion active : -15% sur le catalogue Levant</p>
                   </div>
                </div>
             </FadeIn>
          </div>
         </div>
      </main>
    </div>
  )
}
