"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Briefcase, MapPin, Building2, TrendingUp, Search, Filter, ShieldCheck, CheckCircle2, X, Download, ShieldAlert, Award } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'

interface Job {
  title: string
  company: string
  location: string
  type: string
  salary: string
  desc: string
  tags: string[]
}

export default function CareerHub() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Application Drawer State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applyStep, setApplyStep] = useState(1) // 1: Check credentials, 2: Sign Canvas, 3: Submit loading/success
  const [checkingCredentials, setCheckingCredentials] = useState(true)
  const [credentialsChecked, setCredentialsChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submissionProgress, setSubmissionProgress] = useState(0)
  
  // Signature Drawing State
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  // Track applied jobs dynamically
  const [appliedJobs, setAppliedJobs] = useState<any[]>([
    { title: "Opérateur Chargeuse Débutant", company: "BTP-CI", date: "10 Juin 2026", status: "Consulté par le recruteur" }
  ])

  const allJobs: Job[] = [
    { title: "Opérateur Pelle Hydraulique Expérimenté", company: "SMB SA", location: "San Pedro, CI", type: "CDI", salary: "450k - 600k CFA", desc: "Besoin de 5 opérateurs certifiés GALF pour projet d'extension portuaire.", tags: ["Pelle", "Terrassement", "Urgent"] },
    { title: "Grutier à Tour (GME)", company: "BTP-CI", location: "Abidjan, Cocody", type: "CDD (12 mois)", salary: "500k CFA", desc: "Chantier de tour résidentielle VIP. Expertise en levage aveugle requise.", tags: ["Levage", "Précision"] },
    { title: "Conducteur de Bulldozer", company: "Mine-Ivoire", location: "Korhogo (Site Minier)", type: "CDI", salary: "750k CFA + Logement", desc: "Extraction de masse. Rotation 3x8. Certificat GALF obligatoire.", tags: ["Mine", "Lourd", "Premium"] },
    { title: "Superviseur Manutention", company: "GESTOCI", location: "Vridi, Abidjan", type: "CDI", salary: "Relié expérience", desc: "Gestion des flux logistiques pétroliers. Formation CACES/GALF.", tags: ["Logistique", "Sécurité"] },
  ]

  const jobs = allJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.desc.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ----------------------------------------------------
  // DRAWING CANVAS LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    if (applyStep === 2 && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
      }
    }
  }, [applyStep])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)
    }
  }

  // ----------------------------------------------------
  // SIMULATE CREDENTIAL CHECKING
  // ----------------------------------------------------
  useEffect(() => {
    if (selectedJob && applyStep === 1) {
      setCheckingCredentials(true)
      setCredentialsChecked(false)
      const timer = setTimeout(() => {
        setCheckingCredentials(false)
        setCredentialsChecked(true)
        triggerAudioAlert(523.25, 0.15) // C5 check sound
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [selectedJob, applyStep])

  // ----------------------------------------------------
  // SUBMISSION PIPELINE LOGIC
  // ----------------------------------------------------
  const handleFinalSubmit = () => {
    setApplyStep(3)
    setSubmitting(true)
    setSubmissionProgress(0)

    const interval = setInterval(() => {
      setSubmissionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setSubmitting(false)
          triggerSuccessChime()
          // Save to list
          if (selectedJob) {
            setAppliedJobs(prevJobs => [
              ...prevJobs,
              {
                title: selectedJob.title,
                company: selectedJob.company,
                date: new Date().toLocaleDateString('fr-FR'),
                status: "Candidature transmise"
              }
            ])
          }
          return 100
        }
        return prev + 10
      })
    }, 250)
  }

  // ----------------------------------------------------
  // AUDIO SYNTH
  // ----------------------------------------------------
  const triggerAudioAlert = (freq = 440, duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
      setTimeout(() => ctx.close(), duration * 1000 + 100)
    } catch(e) {}
  }

  const triggerSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.12)
        gain.gain.setValueAtTime(0.06, now + idx * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.12)
        osc.stop(now + idx * 0.12 + 0.3)
      })
      setTimeout(() => ctx.close(), 1000)
    } catch (e) {}
  }

  const handleOpenApply = (job: Job) => {
    triggerAudioAlert(600, 0.1)
    setSelectedJob(job)
    setApplyStep(1)
    setSubmissionProgress(0)
    setHasSignature(false)
  }

  const handleCloseApply = () => {
    triggerAudioAlert(300, 0.1)
    setSelectedJob(null)
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="PROPULSEZ VOTRE CARRIÈRE"
        subtitle="Accédez au réseau d'emploi n°1 du BTP et des Mines en Afrique de l'Ouest. Des offres exclusives réservées aux diplômés GALF Formation."
        badge="Service Exclusif GALF"
      />

      <div className="container-galf mt-16 relative z-10">

        {/* Career Stats & Trust */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
           <FadeIn delay={0.1} className="glass-card p-8 rounded-2xl flex items-center gap-6 border-galf-border">
              <div className="w-16 h-16 rounded-full bg-galf-yellow/10 flex items-center justify-center">
                 <Building2 className="w-8 h-8 text-galf-yellow" />
              </div>
              <div>
                 <div className="text-3xl font-black text-white">50+</div>
                 <div className="text-xs font-bold uppercase tracking-widest text-galf-text-muted">Partenaires Recruteurs</div>
              </div>
           </FadeIn>
           <FadeIn delay={0.2} className="glass-card p-8 rounded-2xl flex items-center gap-6 border-galf-border">
              <div className="w-16 h-16 rounded-full bg-galf-yellow/10 flex items-center justify-center">
                 <TrendingUp className="w-8 h-8 text-galf-yellow" />
              </div>
              <div>
                 <div className="text-3xl font-black text-white">85%</div>
                 <div className="text-xs font-bold uppercase tracking-widest text-galf-text-muted">Placement à 3 mois</div>
              </div>
           </FadeIn>
           <FadeIn delay={0.3} className="glass-card p-8 rounded-2xl flex items-center gap-6 border-galf-yellow/30 bg-galf-yellow/5">
              <div className="w-16 h-16 rounded-full bg-galf-yellow flex items-center justify-center">
                 <ShieldCheck className="w-8 h-8 text-galf-carbon" />
              </div>
              <div>
                 <div className="text-xl font-black text-galf-yellow">Premium Search</div>
                 <div className="text-xs font-bold uppercase tracking-widest text-galf-text-muted">Accès illimité</div>
              </div>
           </FadeIn>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-galf-text-muted" />
              <input 
                 type="text" 
                 placeholder="Quel métier recherchez-vous (Pelle, Grue, Bulldozer) ?" 
                 className="w-full pl-12 pr-6 py-4 rounded-xl bg-galf-surface border border-galf-border outline-none focus:border-galf-yellow transition-all"
                 style={{ color: 'var(--galf-text)' }}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="px-8 py-4 rounded-xl glass-card flex items-center gap-3 font-bold text-slate-900 dark:text-white hover:border-galf-yellow/30 border-galf-border">
              <Filter className="w-5 h-5" /> Filtres avancés
           </button>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
           {jobs.map((job, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                 <div className="glass-card p-8 rounded-3xl group hover:border-galf-yellow/40 transition-all cursor-pointer relative overflow-hidden border-galf-border">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[100px] flex items-start justify-end p-6 group-hover:bg-galf-yellow/10 transition-colors">
                       <Briefcase className="w-6 h-6 text-galf-yellow" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-2xl font-black group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{job.title}</h3>
                             <span className="px-3 py-1 rounded-full bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow text-[10px] font-black uppercase">{job.type}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-sm font-bold" style={{ color: 'var(--galf-text-muted)' }}>
                             <span className="flex items-center gap-2 text-galf-text"><Building2 className="w-4 h-4" /> {job.company}</span>
                             <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                             <span className="text-galf-yellow/80">{job.salary}</span>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleOpenApply(job)}
                         className="bg-slate-900 dark:bg-white text-white dark:text-galf-carbon px-10 py-4 rounded-xl font-black text-sm uppercase hover:bg-galf-yellow dark:hover:bg-galf-yellow group-hover:bg-galf-yellow dark:group-hover:bg-galf-yellow transition-all shadow-md"
                       >
                          Postuler maintenant
                       </button>
                    </div>
                    
                    <p className="max-w-2xl mb-8 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                       {job.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                       {job.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-lg bg-galf-border text-[10px] uppercase font-black tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>
                             {tag}
                          </span>
                       ))}
                       <div className="ml-auto flex items-center gap-2 text-[10px] font-black text-green-500 uppercase">
                          <CheckCircle2 className="w-4 h-4" /> Profil GALF Certifié Demandé
                       </div>
                    </div>
                 </div>
              </FadeIn>
           ))}
        </div>

        {/* ═══════════════════════════════════════════════
            DYNAMIC "MES CANDIDATURES" TRACKING SECTION
           ═══════════════════════════════════════════════ */}
        <div className="mt-20 border-t border-galf-border pt-16">
          <FadeIn>
            <h3 className="text-2xl font-black mb-8 text-white uppercase tracking-wider flex items-center gap-3">
              <Award className="text-galf-yellow w-6 h-6 animate-pulse" /> Mes Candidatures en Cours
            </h3>
            
            <div className="glass-card rounded-[2rem] border-galf-border p-6 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-white">
                  <thead>
                    <tr className="border-b border-white/5 opacity-50 uppercase tracking-widest text-[9px]">
                      <th className="pb-4">Poste</th>
                      <th className="pb-4">Entreprise</th>
                      <th className="pb-4">Date de Postulation</th>
                      <th className="pb-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {appliedJobs.map((job, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 text-sm font-black text-galf-yellow">{job.title}</td>
                        <td className="py-4 text-white/80">{job.company}</td>
                        <td className="py-4 text-white/50">{job.date}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase ${
                            job.status.includes('transmise') ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500 animate-pulse'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════
          SLIDE-OVER DRAWER FOR QUICK APPLY
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseApply}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Slide Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg h-full bg-galf-carbon border-l border-white/5 shadow-2xl flex flex-col justify-between p-8 text-white z-10"
            >
              {/* Close Button */}
              <button 
                onClick={handleCloseApply}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-red-600 transition-colors flex items-center justify-center border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6 pt-6">
                <span className="text-[10px] font-black uppercase bg-galf-yellow text-galf-carbon px-2.5 py-1 rounded tracking-wider">Candidature Rapide</span>
                <h3 className="text-xl font-black mt-3 leading-snug">{selectedJob.title}</h3>
                <div className="text-xs font-bold text-white/50 mt-1">{selectedJob.company} · {selectedJob.location}</div>
              </div>

              {/* Multi-step Application Body */}
              <div className="flex-1 flex flex-col justify-center">
                
                {/* STEP 1: CREDENTIALS CHECK */}
                {applyStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-xs font-black uppercase text-galf-yellow tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Étape 1 : Vérification des Diplômes
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="opacity-50">Candidat :</span>
                        <span className="font-bold">Jean Kouadio</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-50">Certification active :</span>
                        <span className="font-bold text-galf-yellow">CQP 2024 / Pelle Chenille</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-50">Identifiant GALF ID :</span>
                        <span className="font-mono text-white/80">GALF-2024-XP-03</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      {[
                        { label: "Vérification GALF Blockchain ID...", check: !checkingCredentials },
                        { label: "Extraction des notes de conduite...", check: !checkingCredentials },
                        { label: "Rapport d'admissibilité HSE...", check: !checkingCredentials },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          {item.check ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-green-500 shrink-0" />
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border-2 border-dashed border-galf-yellow animate-spin shrink-0" />
                          )}
                          <span className={item.check ? 'text-white' : 'text-white/40'}>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={checkingCredentials}
                      onClick={() => setApplyStep(2)}
                      className="w-full py-4.5 rounded-xl font-black text-xs uppercase tracking-widest bg-galf-yellow text-galf-carbon hover:brightness-110 transition-all disabled:opacity-40 shadow-xl shadow-galf-yellow/10 mt-8"
                    >
                      Étape Suivante : Signature →
                    </button>
                  </div>
                )}

                {/* STEP 2: CANVAS SIGNATURE PAD */}
                {applyStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-xs font-black uppercase text-galf-yellow tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Étape 2 : Signature Électronique
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed">
                      Veuillez apposer votre signature manuelle dans la zone ci-dessous pour certifier l'exactitude de vos notes de conduite.
                    </p>

                    <div className="border border-white/10 rounded-2xl bg-black/40 overflow-hidden relative">
                      <canvas 
                        ref={canvasRef}
                        width={400}
                        height={180}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full cursor-crosshair h-[180px]"
                      />
                      <button 
                        onClick={clearSignature}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-wider transition-colors"
                      >
                        Effacer
                      </button>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={() => setApplyStep(1)}
                        className="px-6 py-4 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white/70 hover:bg-white/5 transition-colors"
                      >
                        Retour
                      </button>
                      <button
                        disabled={!hasSignature}
                        onClick={handleFinalSubmit}
                        className="flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-galf-yellow text-galf-carbon hover:brightness-110 transition-all disabled:opacity-40 shadow-xl shadow-galf-yellow/10"
                      >
                        Signer et Transmettre
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SUBMIT PIPELINE */}
                {applyStep === 3 && (
                  <div className="text-center py-6">
                    {submitting ? (
                      <div className="space-y-6">
                        <div className="w-16 h-16 rounded-full border-4 border-dashed border-galf-yellow animate-spin mx-auto flex items-center justify-center">
                          <Award className="w-6 h-6 text-galf-yellow" />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-widest">Envoi du Dossier en Cours...</h4>
                        <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden mx-auto">
                          <div className="h-full bg-galf-yellow transition-all duration-200" style={{ width: `${submissionProgress}%` }} />
                        </div>
                        <p className="text-[10px] font-mono text-white/50">
                          {submissionProgress < 40 ? "Cryptage du profil et signature..." : 
                           submissionProgress < 80 ? "Validation auprès des serveurs GALF..." : 
                           "Transmission sécurisée à l'employeur..."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 animate-bounce">
                          <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-white">Dossier Transmis !</h4>
                        <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                          Votre profil certifié GALF et votre signature électronique ont bien été transmis aux recruteurs de **{selectedJob.company}**.
                        </p>
                        <button
                          onClick={handleCloseApply}
                          className="bg-galf-yellow text-galf-carbon px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-galf-yellow/15"
                        >
                          Retourner à l'Espace Emploi
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Footer Terms */}
              <div className="text-center opacity-30 text-[9px] font-mono leading-relaxed mt-6">
                GALF Signature Sécurisée · Protocole Blockchain v3.0
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
