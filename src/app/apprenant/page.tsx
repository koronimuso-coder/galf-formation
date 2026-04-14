"use client"
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { Play, BookOpen, CheckCircle2, Clock, Award, Video, ChevronRight, Lock, FileText, Download, ExternalLink, TrendingUp } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function ApprenantDashboard() {
  const [activeTab, setActiveTab] = useState<'cours' | 'certificats'>('cours')
  const [activeModule, setActiveModule] = useState(2)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const certificateRef = useRef<HTMLDivElement>(null)

  const modules = [
    { id: 1, title: "Module 1 : Sécurité et réglementation", duration: "2h30", completed: true, lessons: 5 },
    { id: 2, title: "Module 2 : Connaissance de l'engin", duration: "3h00", completed: true, lessons: 6 },
    { id: 3, title: "Module 3 : Conduite en terrain plat", duration: "4h00", completed: false, lessons: 8, current: true },
    { id: 4, title: "Module 4 : Travaux de terrassement", duration: "5h00", completed: false, lessons: 7 },
    { id: 5, title: "Module 5 : Situations complexes", duration: "3h30", completed: false, lessons: 5 },
    { id: 6, title: "Module 6 : Évaluation finale", duration: "2h00", completed: false, lessons: 3 },
  ]

  const resources = [
    { title: "Manuel de l'opérateur - Pelle hydraulique", type: "PDF", size: "12 MB" },
    { title: "Guide des signaux de chantier", type: "PDF", size: "4.5 MB" },
    { title: "Checklist de maintenance journalière", type: "XLS", size: "1.2 MB" },
  ]

  const [certData, setCertData] = useState({
    userName: "JEAN KOUADIO",
    course: "Pelle Hydraulique sur chenilles",
    date: "11 Avril 2024",
    id: "GALF-2024-XP-03",
    score: "18.5/20"
  })

  const handleGenerateCertificate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowCertificate(true)
    }, 3000)
  }

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 3, // Higher scale for premium print quality
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificat-GALF-${certData.userName.replace(' ', '-')}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  }

  const completedCount = modules.filter(m => m.completed).length
  const progress = Math.round((completedCount / modules.length) * 100)

  return (
    <div className="min-h-screen relative overflow-hidden pt-28 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute left-[-10%] top-[20%] w-[600px] h-[600px] opacity-[0.03] pointer-events-none z-0">
        <AnimatedMachineHeader type="pelle" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-2">Espace apprenant</div>
              <TextReveal 
                text={`${certData.course} — FORMATION`} 
                className="text-3xl md:text-6xl font-black tracking-tighter text-white" 
              />
            </div>
            
            <div className="mt-8 md:mt-0 flex gap-4">
              <button 
                onClick={() => setActiveTab('cours')}
                className={`px-8 py-3 rounded-xl font-bold transition-all border ${activeTab === 'cours' ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-galf-border'}`}
                style={activeTab !== 'cours' ? { color: 'var(--galf-text)' } : {}}
              >
                Mon Parcours
              </button>
              <button 
                onClick={() => setActiveTab('certificats')}
                className={`px-8 py-3 rounded-xl font-bold transition-all border ${activeTab === 'certificats' ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-[0_0_20px_rgba(255,176,0,0.3)]' : 'border-galf-border'}`}
                style={activeTab !== 'certificats' ? { color: 'var(--galf-text)' } : {}}
              >
                Certificats
              </button>
            </div>
          </div>
        </FadeIn>

        {activeTab === 'cours' ? (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.1}>
                {/* Progress Card Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Terminé", val: "2/6", icon: CheckCircle2 },
                    { label: "Temps passé", val: "5h 30m", icon: Clock },
                    { label: "Moyenne", val: certData.score, icon: Award },
                    { label: "Progression", val: `${progress}%`, icon: TrendingUp },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl border-galf-border">
                       <div className="flex items-center gap-2 mb-2 text-galf-yellow">
                          <stat.icon className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-black tracking-widest">{stat.label}</span>
                       </div>
                       <div className="text-xl font-black" style={{ color: 'var(--galf-text)' }}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                <div className="aspect-video rounded-3xl overflow-hidden relative mb-8 group cursor-pointer shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5" style={{ background: 'black' }}>
                  <img src="/images/engins/pelle-hydraulique.png" alt="Module en cours" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-galf-yellow flex items-center justify-center shadow-[0_0_50px_rgba(255,176,0,0.5)] group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 text-galf-carbon ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
                    <div className="glass-card px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-galf-yellow animate-ping" />
                      Module 3 : Conduite en terrain plat
                    </div>
                    <div className="glass-card px-6 py-3 rounded-xl text-sm font-bold">45:00</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-galf-yellow" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--galf-text)' }}>Objectifs</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>Maîtriser les rotations et le nivellement de précision.</p>
                     </div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-galf-yellow" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--galf-text)' }}>Durée</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>4h de vidéo + 2h d'exercices pratiques interactifs.</p>
                     </div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-galf-yellow" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--galf-text)' }}>Supports</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>Accès illimité aux manuels PDF et guides de sécurité.</p>
                     </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <FadeIn delay={0.2}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-xl" style={{ color: 'var(--galf-text)' }}>Programme</h3>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow uppercase">6 Modules</span>
                </div>
                <div className="space-y-3">
                  {modules.map((mod, i) => (
                    <button key={i} onClick={() => setActiveModule(i)}
                      className={`w-full text-left p-5 rounded-2xl transition-all relative overflow-hidden group border-2 ${activeModule === i ? 'border-galf-yellow shadow-xl' : 'border-transparent'}`}
                      style={activeModule === i ? { background: 'var(--galf-yellow-glow)' } : { background: 'var(--galf-surface)', border: '1px solid var(--galf-border)' }}>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${mod.completed ? 'bg-green-500/20 text-green-500' : mod.current ? 'bg-galf-yellow text-galf-carbon' : 'bg-white/5 text-white/20'}`}>
                          {mod.completed ? <CheckCircle2 className="w-5 h-5" /> : mod.current ? <Play className="w-4 h-4 fill-current" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-black truncate ${mod.current ? 'text-galf-carbon' : ''}`} style={!mod.current ? { color: 'var(--galf-text)' } : {}}>{mod.title}</div>
                          <div className={`text-[10px] font-bold ${mod.current ? 'text-galf-carbon/60' : 'text-galf-text-muted'}`}>{mod.duration} · {mod.lessons} leçons</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <h3 className="font-black text-xl mb-6" style={{ color: 'var(--galf-text)' }}>Supports de cours</h3>
                <div className="space-y-3">
                  {resources.map((res, i) => (
                    <div key={i} className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-galf-yellow/50 transition-all cursor-pointer group border-galf-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-galf-yellow/5 flex items-center justify-center group-hover:bg-galf-yellow/10 transition-colors">
                          <FileText className="w-6 h-6 text-galf-yellow" />
                        </div>
                        <div>
                          <div className="text-sm font-black" style={{ color: 'var(--galf-text)' }}>{res.title}</div>
                          <div className="text-[10px] uppercase font-bold text-galf-yellow tracking-widest">{res.type} · {res.size}</div>
                        </div>
                      </div>
                      <Download className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" style={{ color: 'var(--galf-text-secondary)' }} />
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        ) : (
          /* CERTIFICATIONS TAB */
          <div className="max-w-5xl mx-auto">
             <FadeIn>
               {!showCertificate ? (
                 <div className="glass-card p-12 rounded-[2.5rem] text-center border-galf-yellow/20 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-galf-border">
                     <div className="h-full bg-galf-yellow transition-all duration-[3000ms]" style={{ width: isGenerating ? '100%' : '33%' }} />
                   </div>
                   
                   <Award className={`w-24 h-24 mx-auto mb-8 transition-all duration-1000 ${isGenerating ? 'text-galf-yellow scale-125 animate-pulse' : 'text-galf-text-muted opacity-40'}`} />
                   <h2 className="text-4xl font-black mb-4 tracking-tighter" style={{ color: 'var(--galf-text)' }}>Certificat d'Excellence GALF</h2>
                   <p className="text-lg max-w-md mx-auto mb-12" style={{ color: 'var(--galf-text-secondary)' }}>
                     {isGenerating 
                      ? "Génération de votre certificat sécurisé en cours... Nous vérifions vos scores et validations." 
                      : "Vous avez complété la formation avec brio. Réclamez votre certification officielle maintenant."}
                   </p>
                   
                   <button 
                    disabled={isGenerating}
                    onClick={handleGenerateCertificate}
                    className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-2xl font-black text-xl hover:brightness-110 transition-all shadow-2xl shadow-galf-yellow/30 disabled:opacity-50"
                   >
                     {isGenerating ? "Moteur de génération IA actif..." : "Générer mon Certificat Officiel"}
                   </button>
                 </div>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 30 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   className="glass-card p-5 rounded-[3rem] border-galf-yellow/40 shadow-[0_50px_150px_-20px_rgba(0,0,0,0.6)]"
                 >
                   <div ref={certificateRef} className="bg-white p-12 md:p-24 rounded-[2rem] relative overflow-hidden text-[#1a1a1a] font-serif shadow-inner">
                      {/* Premium Background Pattern */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <div className="absolute inset-0 border-[40px] border-double border-galf-yellow/10 pointer-events-none" />
                      
                      {/* Decorative Corner Ornaments */}
                      <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-galf-yellow" />
                      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-galf-yellow" />
                      
                      <div className="text-center relative z-10">
                        <div className="flex justify-center mb-10">
                          <div className="w-20 h-20 rounded-xl bg-galf-carbon flex items-center justify-center p-4">
                             <HardHat className="text-galf-yellow w-full h-full" />
                          </div>
                        </div>

                        <div className="text-galf-yellow font-black text-2xl mb-4 tracking-[0.4em] uppercase font-sans">Attestation de Réussite</div>
                        <h3 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter text-galf-carbon font-sans">EXCELLENCE <span className="text-galf-yellow">BTP</span></h3>
                        
                        <div className="w-32 h-1 bg-galf-yellow mx-auto mb-12" />
                        
                        <p className="text-2xl mb-4 italic">Ce document certifie officiellement que</p>
                        <div className="text-5xl md:text-6xl font-black mb-12 uppercase text-galf-carbon border-b-4 border-galf-carbon/10 inline-block px-16 pb-4 font-sans tracking-tight">
                          {certData.userName}
                        </div>
                        
                        <p className="text-xl mb-16 max-w-3xl mx-auto leading-relaxed">
                          A complété avec succès le cycle de formation de niveau expert sur <strong>{certData.course}</strong>. 
                          Le titulaire est reconnu apte à la manipulation technique avancée et à l'application rigoureuse des normes <strong>HSE</strong> internationales de chantier.
                        </p>
                        
                        <div className="flex flex-col md:flex-row justify-between items-center mt-20 gap-12">
                          <div className="text-center md:text-left order-2 md:order-1">
                            <div className="font-black text-2xl font-sans text-galf-carbon">GALF Formation CI</div>
                            <div className="text-sm uppercase font-bold tracking-widest text-galf-yellow mb-4">Le comité pédagogique</div>
                            <div className="w-48 h-20 bg-galf-yellow/5 rounded-xl border border-dashed border-galf-yellow/20 flex items-center justify-center">
                               <span className="text-galf-yellow/40 italic font-bold">Signature Digitale</span>
                            </div>
                          </div>

                          <div className="order-1 md:order-2">
                             {/* Central Seal */}
                             <div className="w-40 h-40 rounded-full bg-galf-yellow flex items-center justify-center shadow-2xl relative">
                                <div className="absolute inset-2 border-2 border-white/40 rounded-full" />
                                <div className="absolute inset-4 border-2 border-galf-carbon/10 rounded-full border-dashed" />
                                <div className="text-galf-carbon text-center">
                                   <div className="text-[10px] font-black uppercase tracking-widest mb-1">Authentifié</div>
                                   <Award className="w-10 h-10 mx-auto mb-1" />
                                   <div className="text-[10px] font-black uppercase tracking-widest">GALF 2024</div>
                                </div>
                             </div>
                          </div>

                          <div className="text-center md:text-right order-3">
                             <div className="w-24 h-24 bg-white border-2 border-galf-carbon/10 p-2 mx-auto md:ml-auto mb-4 rounded-lg flex items-center justify-center">
                                {/* Mock QR Code */}
                                <div className="w-full h-full opacity-60 flex flex-wrap gap-0.5">
                                   {Array.from({length: 64}).map((_, i) => (
                                     <div key={i} className={`w-[11.5%] h-[11.5%] ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                   ))}
                                </div>
                             </div>
                             <div className="font-bold text-sm text-galf-carbon font-sans">Vérification ID: <span className="text-galf-yellow">{certData.id}</span></div>
                             <div className="text-xs opacity-60 font-sans">Délivré à Abidjan le {certData.date}</div>
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row justify-center gap-6 mt-16 mb-8 px-12">
                     <button 
                       onClick={handleDownloadPDF}
                       disabled={isDownloading}
                       className="flex-1 bg-galf-yellow text-galf-carbon px-12 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl shadow-galf-yellow/20 disabled:opacity-50 group"
                     >
                       <Download className={`w-6 h-6 ${isDownloading ? 'animate-bounce' : 'group-hover:-translate-y-1 transition-transform'}`} /> 
                       {isDownloading ? "Traitement HD en cours..." : "Télécharger mon Diplôme (PDF Ultra-HD)"}
                     </button>
                     <button className="glass-card flex-1 px-12 py-5 rounded-[1.5rem] font-black text-lg text-white flex items-center justify-center gap-3 hover:border-galf-yellow/50 transition-all group">
                       <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Propulser sur LinkedIn
                     </button>
                   </div>
                   
                   <div className="text-center pb-8 opacity-40 text-xs font-bold uppercase tracking-[0.3em]">
                      Validation sécurisée par GALF Blockchain Services
                   </div>
                 </motion.div>
               )}
             </FadeIn>
          </div>
        )}
      </div>
    </div>
  )
}

import { HardHat } from 'lucide-react'

