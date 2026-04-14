"use client"
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { FileText, CheckCircle2, Clock, AlertCircle, Download, Phone, ShieldCheck, ChevronRight, Upload, Info } from 'lucide-react'
import Link from 'next/link'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function CandidatDashboard() {
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
                className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white" 
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
                    <img src="/images/engins/pelle-hydraulique.png" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
      </div>
    </div>
  )
}

