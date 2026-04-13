"use client"
import { FadeIn } from '@/components/animations/FadeIn'
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
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('Certificat-Excellence-GALF.pdf');
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
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                Pelle Hydraulique — <span className="text-galf-yellow">Formation en cours</span>
              </h1>
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
                    { label: "Moyenne", val: "16.5/20", icon: Award },
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
          <div className="max-w-4xl mx-auto">
             <FadeIn>
               {!showCertificate ? (
                 <div className="glass-card p-12 rounded-3xl text-center border-galf-yellow/20 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-galf-border">
                     <div className="h-full bg-galf-yellow transition-all duration-[3000ms]" style={{ width: isGenerating ? '100%' : '33%' }} />
                   </div>
                   
                   <Award className={`w-20 h-20 mx-auto mb-8 transition-all duration-1000 ${isGenerating ? 'text-galf-yellow scale-125 animate-pulse' : 'text-galf-text-muted opacity-40'}`} />
                   <h2 className="text-3xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>Certificat d'Excellence GALF</h2>
                   <p className="text-lg max-w-md mx-auto mb-12" style={{ color: 'var(--galf-text-secondary)' }}>
                     {isGenerating 
                      ? "Génération de votre certificat sécurisé en cours... Nous vérifions vos scores et validations." 
                      : "Vous avez complété 33% de votre formation. Complétez les modules restants pour débloquer votre certification officielle."}
                   </p>
                   
                   <button 
                    disabled={isGenerating}
                    onClick={handleGenerateCertificate}
                    className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-2xl font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-galf-yellow/20 disabled:opacity-50"
                   >
                     {isGenerating ? "Moteur de génération IA actif..." : "Réclamer mon Certificat Officiel"}
                   </button>
                 </div>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="glass-card p-4 rounded-3xl border-galf-yellow shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                 >
                   <div ref={certificateRef} className="bg-white p-12 md:p-20 rounded-2xl relative overflow-hidden text-galf-carbon">
                      {/* Certificate Design */}
                      <div className="absolute inset-0 border-[20px] border-galf-yellow/10 pointer-events-none" />
                      <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-galf-yellow/20 flex items-center justify-center opacity-30">
                        <Award className="w-16 h-16 text-galf-yellow" />
                      </div>
                      
                      <div className="text-center relative z-10">
                        <div className="text-galf-yellow font-black text-xl mb-4 tracking-[0.3em] uppercase">Certificat de Réussite</div>
                        <h3 className="text-4xl md:text-6xl font-black mb-12 uppercase">EXCELLENCE BTP</h3>
                        <p className="text-xl mb-2">Ce certificat est fièrement décerné à :</p>
                        <div className="text-4xl font-black mb-12 border-b-2 border-galf-carbon inline-block px-12 pb-2">JEAN KOUADIO</div>
                        <p className="text-lg mb-16 max-w-2xl mx-auto">
                          Pour avoir complété avec succès la formation de niveau expert sur <strong>Pelle Hydraulique sur chenilles</strong>, validant les compétences de manipulation, terrassement et normes HSE internationales.
                        </p>
                        
                        <div className="flex justify-between items-end mt-20">
                          <div className="text-left">
                            <div className="font-black italic text-xl">GALF Formation</div>
                            <div className="text-sm opacity-60">Le Directeur Pédagogique</div>
                          </div>
                          <div className="w-32 h-32 bg-galf-carbon flex items-center justify-center rounded-xl rotate-12 shadow-2xl">
                             <div className="text-white font-black text-xs text-center p-2">Sceau Officiel GALF</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">ID: GALF-2024-XP-03</div>
                            <div className="text-sm opacity-60">Délivré le : 11 Avril 2024</div>
                          </div>
                        </div>
                      </div>
                   </div>
                   <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 mb-8">
                     <button 
                       onClick={handleDownloadPDF}
                       disabled={isDownloading}
                       className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:brightness-110 transition-colors disabled:opacity-50"
                     >
                       <Download className="w-5 h-5" /> 
                       {isDownloading ? "Génération du PDF..." : "Télécharger (PDF Haute Qualité)"}
                     </button>
                     <button className="glass-card flex-1 sm:flex-none justify-center px-8 py-4 rounded-xl font-black text-white flex items-center gap-3 hover:border-galf-yellow/30 transition-all">
                       <ExternalLink className="w-5 h-5" /> Partager sur LinkedIn
                     </button>
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
