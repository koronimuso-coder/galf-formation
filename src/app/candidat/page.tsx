"use client"
import { useState } from 'react'
import jsPDF from 'jspdf'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { FileText, CheckCircle2, Clock, AlertCircle, Download, Phone, ShieldCheck, ChevronRight, Upload, Info, MapPin, Briefcase, Award } from 'lucide-react'
import Link from 'next/link'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function CandidatDashboard() {
  const [cvStep, setCvStep] = useState(1)
  const [cvData, setCvData] = useState({
    fullName: "Koffi Kouakou",
    phone: "+225 07 11 82 65 07",
    city: "San Pedro, CI",
    primaryMachine: "Pelle Hydraulique",
    experienceYears: "5 ans",
    caces: "CACES R482 Catégorie B1",
    pastChantier: "Projet Autoroute du Nord / Port Autonome de San Pedro",
    skills: "Terrassement de masse, Nivellement, Maintenance de premier niveau, Lecture de plans"
  })

  const generateBtpCv = () => {
    const doc = new jsPDF()
    
    // Industrial Dark Carbon & Gold accents styling
    doc.setFillColor(8, 8, 10) // Dark carbon header
    doc.rect(0, 0, 210, 50, 'F')
    
    // Header text
    doc.setTextColor(255, 176, 0) // Gold
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.text("OPERATEUR ENGINS BTP - CERTIFIE GALF", 15, 20)
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.text(cvData.fullName.toUpperCase(), 15, 32)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(`${cvData.phone} | ${cvData.city}`, 15, 42)
    
    // Main Body
    doc.setTextColor(20, 20, 20)
    
    // Column 1: Info & Certifications
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("PROFIL ET CERTIFICATIONS", 15, 65)
    doc.setDrawColor(255, 176, 0)
    doc.setLineWidth(0.5)
    doc.line(15, 68, 95, 68)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(`Engin Principal : ${cvData.primaryMachine}`, 15, 76)
    doc.text(`Expérience : ${cvData.experienceYears}`, 15, 83)
    doc.text(`Habilitation : ${cvData.caces}`, 15, 90)
    
    // Column 2: Competences
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("COMPETENCES TECHNIQUES", 115, 65)
    doc.line(115, 68, 195, 68)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    const skillList = cvData.skills.split(',')
    let yOffset = 76
    skillList.forEach(s => {
      doc.text(`- ${s.trim()}`, 115, yOffset)
      yOffset += 7
    })
    
    // Row 3: Expériences & Chantiers
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("REALISATIONS & PROJETS MARQUANTS", 15, 120)
    doc.line(15, 123, 195, 123)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const chantierLines = doc.splitTextToSize(cvData.pastChantier, 170)
    doc.text(chantierLines, 15, 132)
    
    // Footer - GALF verification badge
    doc.setFillColor(240, 240, 240)
    doc.rect(15, 250, 180, 25, 'F')
    
    doc.setTextColor(8, 8, 10)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("VERIFICATION ACADEMIQUE ET CONFORMITE SECURITE", 20, 258)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text("Ce CV est certifié conforme par GALF Formation Cote d'Ivoire. Le candidat a validé ses tests théoriques HSE.", 20, 264)
    
    doc.save(`CV-BTP-${cvData.fullName.replace(/\s+/g, '-')}.pdf`)
  }

  const steps = [
    { label: "Formulaire rempli", status: "done", date: "10/04" },
    { label: "Dossier reçu", status: "done", date: "11/04" },
    { label: "Vérification en cours", status: "current", date: "En cours" },
    { label: "Entretien technique", status: "pending", date: "À venir" },
    { label: "Validation finale", status: "pending", date: "À venir" },
  ]

  const documents = [
    { name: "Pièce d'identité", status: "valid", icon: ShieldCheck },
    { name: "Certificat Médical", status: "pending", icon: Clock },
    { name: "Permis de conduire", status: "valid", icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Cinematic Background */}
      <div className="absolute right-[-15%] top-[10%] w-[700px] h-[700px] opacity-[0.03] pointer-events-none z-0 rotate-12">
        <AnimatedMachineHeader type="chargeuse" />
      </div>
      <div className="absolute left-[-10%] bottom-0 w-[500px] h-[500px] opacity-[0.02] pointer-events-none z-0">
        <AnimatedMachineHeader type="pelle" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.4em] mb-4">Espace personnel</div>
              <TextReveal 
                text="SUIVI INSCRIPTION" 
                className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-slate-900 dark:text-white" 
              />
              <p className="text-xl mt-4" style={{ color: 'var(--galf-text-secondary)' }}>Bienvenue, M. Kouakou. Votre dossier est en cours d'examen prioritaire.</p>
            </div>
            <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border-galf-yellow/20">
               <div className="w-12 h-12 rounded-full bg-galf-yellow/10 flex items-center justify-center">
                  <Info className="text-galf-yellow w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Délai estimé</div>
                  <div className="text-sm font-black" style={{ color: 'var(--galf-text)' }}>Réponse sous 48h</div>
               </div>
            </div>
          </div>
        </FadeIn>

        {/* Cinematic Timeline */}
        <FadeIn delay={0.1}>
          <div className="glass-card p-10 rounded-[2.5rem] mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            <h3 className="text-xl font-black mb-10 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
              <div className="w-1 h-6 bg-galf-yellow rounded-full" /> Progression de la candidature
            </h3>
            
            <div className="flex flex-col md:flex-row items-start justify-between relative gap-8">
              {/* Connector Line */}
              <div className="absolute top-7 left-7 md:left-[10%] md:right-[10%] w-1 md:w-auto md:h-1 bg-galf-border hidden md:block" />
              
              {steps.map((step, i) => (
                <div key={i} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-4 md:text-center group flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                    step.status === 'done' ? 'bg-green-500 text-white rotate-6' :
                    step.status === 'current' ? 'bg-galf-yellow text-galf-carbon animate-pulse scale-110 shadow-galf-yellow/30' : 
                    'bg-galf-surface border border-galf-border text-galf-text-muted'
                  }`}>
                    {step.status === 'done' ? <CheckCircle2 className="w-7 h-7" /> :
                     step.status === 'current' ? <Clock className="w-7 h-7" /> :
                     <span className="text-lg font-black">{i + 1}</span>}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-galf-yellow uppercase tracking-widest mb-1">{step.date}</div>
                    <div className="text-sm font-black transition-colors group-hover:text-galf-yellow" style={{ color: step.status === 'pending' ? 'var(--galf-text-muted)' : 'var(--galf-text)' }}>{step.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <FadeIn delay={0.2}>
              <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-galf-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-black text-lg mb-8 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                  <FileText className="w-5 h-5 text-galf-yellow" /> Détails de la formation
                </h3>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <Link href="/formations/pelle-hydraulique" className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden border border-galf-border shadow-2xl block">
                    <img src="/images/about/candidat-check.png" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </Link>
                  <div className="flex-1">
                    <Link href="/formations/pelle-hydraulique">
                      <div className="text-2xl font-black mb-2 hover:text-galf-yellow transition-colors cursor-pointer" style={{ color: 'var(--galf-text)' }}>Pelle Hydraulique sur chenilles</div>
                    </Link>
                    <div className="flex flex-wrap gap-4 text-sm font-bold opacity-60 mb-6" style={{ color: 'var(--galf-text)' }}>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 1 mois</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> San Pedro</span>
                      <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Financement: Personnel</span>
                    </div>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow text-sm font-black uppercase italic">
                      <Clock className="w-4 h-4 animate-spin-slow" /> Vérification en cours (48h)
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Document Vault */}
            <FadeIn delay={0.3}>
              <div className="glass-card p-8 rounded-[2rem]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-lg flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                    <ShieldCheck className="w-5 h-5 text-galf-yellow" /> Coffre-fort numérique
                  </h3>
                  <button className="text-xs font-black text-galf-yellow flex items-center gap-2 hover:translate-x-1 transition-transform">
                    Tout télécharger <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-galf-bg border border-galf-border hover:border-galf-yellow/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status === 'valid' ? 'bg-green-500/10 text-green-500' : 'bg-galf-yellow/10 text-galf-yellow'}`}>
                             <doc.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold" style={{ color: 'var(--galf-text)' }}>{doc.name}</span>
                       </div>
                       {doc.status === 'valid' ? (
                         <CheckCircle2 className="w-5 h-5 text-green-500" />
                       ) : (
                         <button className="bg-galf-yellow/20 text-galf-yellow p-2 rounded-lg hover:bg-galf-yellow hover:text-galf-carbon transition-all">
                            <Upload className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                  ))}
                  <div className="flex items-center justify-center p-5 rounded-2xl border-2 border-dashed border-galf-border hover:border-galf-yellow/40 transition-all cursor-pointer group">
                     <span className="text-xs font-black text-galf-text-muted group-hover:text-galf-yellow text-center">+ Ajouter un document</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8">
            <FadeIn delay={0.4}>
              <div className="glass-card p-8 rounded-[2rem] bg-galf-yellow text-galf-carbon shadow-2xl shadow-galf-yellow/20">
                <h3 className="text-xl font-black mb-4">Besoin de finaliser ?</h3>
                <p className="text-sm font-bold opacity-80 mb-8">Téléchargez votre convocation préliminaire pour la visite médicale.</p>
                <button className="w-full bg-galf-carbon text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl">
                  <Download className="w-5 h-5" /> Télécharger Convocation
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="glass-card p-8 rounded-[2.5rem]">
                <h3 className="font-black text-lg mb-6" style={{ color: 'var(--galf-text)' }}>Support de dossier</h3>
                <p className="text-sm mb-8" style={{ color: 'var(--galf-text-secondary)' }}>Une question sur les pièces à fournir ou les modalités de paiement ?</p>
                <div className="space-y-4">
                  <a href="https://wa.me/2250711826507" className="w-full bg-green-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg">
                    <Phone className="w-5 h-5" /> Expert Inscription
                  </a>
                  <Link href="/faq" className="w-full flex items-center justify-between p-5 rounded-2xl bg-galf-surface border border-galf-border hover:border-galf-yellow/30 transition-all">
                    <span className="text-sm font-black" style={{ color: 'var(--galf-text)' }}>Questions fréquentes</span>
                    <ChevronRight className="w-5 h-5 text-galf-yellow" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            NEW: INTERACTIVE BTP CV BUILDER
           ═══════════════════════════════════════════════ */}
        <FadeIn delay={0.6}>
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] mt-16 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] font-black uppercase bg-galf-yellow text-galf-carbon px-2.5 py-1 rounded tracking-wider">
                  Service Professionnel
                </span>
                <h3 className="text-3xl font-black mt-3 text-white flex items-center gap-2">
                  <Briefcase className="text-galf-yellow w-6 h-6" /> Créateur de CV BTP Officiel
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Générez un CV professionnel aux normes des chantiers internationaux en 3 étapes.
                </p>
              </div>

              {/* Progress steps */}
              <div className="flex gap-2 text-xs font-black">
                {[1, 2, 3].map(step => (
                  <div 
                    key={step} 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                      cvStep === step 
                        ? 'bg-galf-yellow border-galf-yellow text-galf-carbon' 
                        : cvStep > step 
                          ? 'bg-green-500/20 border-green-500 text-green-400' 
                          : 'bg-black/30 border-white/5 text-white/40'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields according to Step */}
            {cvStep === 1 && (
              <div className="space-y-4 max-w-2xl animate-fadeIn">
                <h4 className="text-sm font-black text-galf-yellow uppercase tracking-widest mb-4">Étape 1 : Informations de contact</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Nom & Prénoms</label>
                    <input 
                      type="text" 
                      value={cvData.fullName}
                      onChange={e => setCvData({ ...cvData, fullName: e.target.value })}
                      className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Téléphone</label>
                    <input 
                      type="text" 
                      value={cvData.phone}
                      onChange={e => setCvData({ ...cvData, phone: e.target.value })}
                      className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Ville de résidence</label>
                  <input 
                    type="text" 
                    value={cvData.city}
                    onChange={e => setCvData({ ...cvData, city: e.target.value })}
                    className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                  />
                </div>
              </div>
            )}

            {cvStep === 2 && (
              <div className="space-y-4 max-w-2xl animate-fadeIn">
                <h4 className="text-sm font-black text-galf-yellow uppercase tracking-widest mb-4">Étape 2 : Spécialisation et Engins</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Engin principal maîtrisé</label>
                    <input 
                      type="text" 
                      value={cvData.primaryMachine}
                      onChange={e => setCvData({ ...cvData, primaryMachine: e.target.value })}
                      className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Années d'expérience</label>
                    <input 
                      type="text" 
                      value={cvData.experienceYears}
                      onChange={e => setCvData({ ...cvData, experienceYears: e.target.value })}
                      className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Certifications / Permis (ex: CACES R482 Catégorie B1)</label>
                  <input 
                    type="text" 
                    value={cvData.caces}
                    onChange={e => setCvData({ ...cvData, caces: e.target.value })}
                    className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                  />
                </div>
              </div>
            )}

            {cvStep === 3 && (
              <div className="space-y-4 max-w-2xl animate-fadeIn">
                <h4 className="text-sm font-black text-galf-yellow uppercase tracking-widest mb-4">Étape 3 : Expérience de chantier et compétences</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Compétences clés (séparées par des virgules)</label>
                  <input 
                    type="text" 
                    value={cvData.skills}
                    onChange={e => setCvData({ ...cvData, skills: e.target.value })}
                    className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Chantiers notables et projets marquants</label>
                  <textarea 
                    rows={4}
                    value={cvData.pastChantier}
                    onChange={e => setCvData({ ...cvData, pastChantier: e.target.value })}
                    className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
              <button
                disabled={cvStep === 1}
                onClick={() => setCvStep(prev => prev - 1)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:border-white/20 disabled:opacity-30 text-xs font-bold transition-all"
              >
                Précédent
              </button>

              {cvStep < 3 ? (
                <button
                  onClick={() => setCvStep(prev => prev + 1)}
                  className="bg-galf-yellow text-galf-carbon px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={generateBtpCv}
                  className="bg-green-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-green-500/15"
                >
                  <Download className="w-4 h-4" /> Télécharger mon CV BTP
                </button>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

