"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { FileText, CheckCircle2, Clock, AlertCircle, Download, Phone } from 'lucide-react'
import Link from 'next/link'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function CandidatDashboard() {
  const steps = [
    { label: "Formulaire rempli", status: "done" },
    { label: "Dossier reçu", status: "done" },
    { label: "Vérification en cours", status: "current" },
    { label: "Entretien", status: "pending" },
    { label: "Validation finale", status: "pending" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pt-28 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute right-[-10%] top-[20%] w-[500px] h-[500px] opacity-[0.04] pointer-events-none z-0">
        <AnimatedMachineHeader type="chargeuse" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-2">Espace candidat</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2" style={{ color: 'var(--galf-text)' }}>
            Suivi de votre <span className="text-galf-yellow">candidature</span>
          </h1>
          <p className="mb-12" style={{ color: 'var(--galf-text-secondary)' }}>Bienvenue. Suivez l'avancement de votre dossier d'inscription.</p>
        </FadeIn>

        {/* Timeline */}
        <FadeIn delay={0.1}>
          <div className="glass-card p-8 rounded-xl mb-8">
            <h3 className="font-black mb-6" style={{ color: 'var(--galf-text)' }}>État de votre dossier</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-[10%] right-[10%] h-[2px]" style={{ background: 'var(--galf-border)' }} />
              {steps.map((step, i) => (
                <div key={i} className="relative z-10 text-center flex-1">
                  <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm font-black mb-2 ${
                    step.status === 'done' ? 'bg-green-500 text-white' :
                    step.status === 'current' ? 'bg-galf-yellow text-galf-carbon animate-pulse shadow-md' : ''
                  }`} style={step.status === 'pending' ? { background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-muted)' } : {}}>
                    {step.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> :
                     step.status === 'current' ? <Clock className="w-5 h-5" /> :
                     <span>{i + 1}</span>}
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: step.status === 'pending' ? 'var(--galf-text-muted)' : 'var(--galf-text)' }}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn delay={0.2}>
            <div className="glass-card p-6 rounded-xl h-full">
              <h3 className="font-black mb-4 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                <FileText className="w-5 h-5 text-galf-yellow" /> Formation choisie
              </h3>
              <div className="flex gap-4 items-center mb-4">
                <img src="/images/engins/pelle-hydraulique.png" alt="" className="w-24 h-16 rounded-lg object-cover" style={{ border: '1px solid var(--galf-border)' }} />
                <div>
                  <div className="font-black" style={{ color: 'var(--galf-text)' }}>Pelle Hydraulique</div>
                  <div className="text-sm" style={{ color: 'var(--galf-text-secondary)' }}>1 mois · San Pedro · 230 000 FCFA</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow font-bold">
                <AlertCircle className="w-4 h-4" /> En attente de vérification (48h)
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="glass-card p-6 rounded-xl h-full">
              <h3 className="font-black mb-4" style={{ color: 'var(--galf-text)' }}>Besoin d'aide ?</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--galf-text-secondary)' }}>Notre équipe est disponible pour toute question sur votre dossier.</p>
              <div className="space-y-3">
                <a href="https://wa.me/2250711826507" className="w-full bg-green-500 text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                  <Phone className="w-4 h-4" /> Contacter par WhatsApp
                </a>
                <Link href="/faq" className="w-full glass-card py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:border-galf-yellow/30 transition-colors" style={{ color: 'var(--galf-text)' }}>
                  Consulter la FAQ
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
