"use client"
import { useState } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { GALF_FORMATIONS } from '@/lib/data'
import { User, Book, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, HardHat, FileCheck, Info, Wallet } from 'lucide-react'
import Link from 'next/link'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function Inscription() {
  const [step, setStep] = useState(1)
  const [selectedFormation, setSelectedFormation] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [acompte, setAcompte] = useState(30)
  
  const totalSteps = 5
  const steps = [
    { label: "Formation", icon: Book },
    { label: "Informations", icon: User },
    { label: "Paiement", icon: CreditCard },
    { label: "Récapitulatif", icon: FileCheck },
    { label: "Confirmation", icon: CheckCircle2 },
  ]

  const formation = GALF_FORMATIONS.find(f => f.id === selectedFormation)
  const price = formation ? (formation.pricePromo || formation.price) : 0
  const totalAcompte = (price * acompte) / 100

  const paymentMethods = [
    { id: 'wave', label: 'Wave', color: 'bg-[#1DB9D4]', logo: '🌊' },
    { id: 'orange', label: 'Orange Money', color: 'bg-[#FF7900]', logo: '🍊' },
    { id: 'mtn', label: 'MTN MoMo', color: 'bg-[#FFCC00]', logo: '💸' },
    { id: 'cash', label: 'Espèces (Agence)', color: 'bg-galf-carbon', logo: '🏢' },
  ]

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute right-[-10%] top-[10%] w-[700px] h-[700px] opacity-[0.04] pointer-events-none z-0">
        <AnimatedMachineHeader type="grue" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4" style={{ color: 'var(--galf-text)' }}>
              Inscription <span className="text-galf-yellow">GALF</span>
            </h1>
            <p style={{ color: 'var(--galf-text-secondary)' }} className="max-w-xl mx-auto text-sm">
              Processus sécurisé en {totalSteps} étapes. Votre avenir commence ici.
            </p>
          </div>
        </FadeIn>

        {/* Steps Progress */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center mb-16 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
                    step > i + 1 ? 'bg-green-500 text-white rotate-[360deg]' :
                    step === i + 1 ? 'bg-galf-yellow text-galf-carbon shadow-[0_0_20px_rgba(255,176,0,0.3)]' :
                    'bg-galf-surface border border-galf-border text-galf-text-muted'
                  }`} style={{ color: step === i + 1 ? 'var(--galf-carbon)' : 'inherit' }}>
                    {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-3 hidden sm:block ${step === i + 1 ? 'text-galf-yellow' : 'opacity-40'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div className={`h-[1px] w-full transition-all duration-700 ${step > i + 1 ? 'bg-green-500' : 'bg-galf-border'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>1. Sélectionnez votre domaine</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 px-1">
                  {GALF_FORMATIONS.filter(f => f.status === 'Actif').map(f => (
                    <button key={f.id} onClick={() => setSelectedFormation(f.id)}
                      className={`w-full text-left p-5 rounded-xl transition-all flex items-center justify-between group h-full ${selectedFormation === f.id ? 'border-galf-yellow' : 'hover:border-galf-yellow/30'}`}
                      style={selectedFormation === f.id ? { border: '2px solid #FFB000', background: 'var(--galf-yellow-glow)' } : { border: '1px solid var(--galf-border)', background: 'var(--galf-surface)' }}>
                      <div>
                        <div className="font-black text-sm" style={{ color: 'var(--galf-text)' }}>{f.name}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest mt-1 text-galf-yellow">{f.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black" style={{ color: 'var(--galf-text)' }}>{(f.pricePromo || f.price).toLocaleString('fr-FR')} F</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {step === 2 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-black mb-8" style={{ color: 'var(--galf-text)' }}>2. Vos coordonnées</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Nom complet</label>
                    <input type="text" className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" placeholder="Ex: Jean Kouassi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">WhatsApp / Tel</label>
                    <input type="tel" className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" placeholder="+225 07..." />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Email professionnel</label>
                    <input type="email" className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" placeholder="jean@mail.com" />
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {step === 3 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>3. Modalités de paiement</h2>
                
                <div className="mb-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4 block">Montant de l'acompte</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 50, 100].map(val => (
                      <button key={val} onClick={() => setAcompte(val)}
                        className={`p-4 rounded-xl font-black text-sm transition-all border ${acompte === val ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'bg-galf-bg border-galf-border opacity-60'}`}>
                        {val}%
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/20 flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Acompte à régler :</span>
                    <span className="font-black text-galf-yellow">{totalAcompte.toLocaleString('fr-FR')} F CFA</span>
                  </div>
                </div>

                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4 block">Moyen de paiement</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(pm => (
                    <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                      className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${paymentMethod === pm.id ? 'border-galf-yellow bg-galf-yellow/10' : 'bg-galf-bg border-galf-border opacity-60 hover:opacity-100'}`}>
                      <span className="text-xl">{pm.logo}</span>
                      <span className="font-black text-xs">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {step === 4 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <FileCheck className="w-24 h-24 text-galf-yellow" />
                </div>
                <h2 className="text-xl font-black mb-8" style={{ color: 'var(--galf-text)' }}>4. Récapitulatif de dossier</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-galf-border">
                    <span className="text-xs font-bold opacity-60">Formation choisie</span>
                    <span className="font-black text-right max-w-[200px]">{formation?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-galf-border">
                    <span className="text-xs font-bold opacity-60">Total Formation</span>
                    <span className="font-black">{price.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-galf-border">
                    <span className="text-xs font-bold opacity-60">Acompte ({acompte}%)</span>
                    <span className="font-black text-galf-yellow">{totalAcompte.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-xs font-bold opacity-60">Méthode de règlement</span>
                    <span className="font-black uppercase text-xs">{paymentMethod || 'Non spécifié'}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-[10px] leading-relaxed opacity-70">En cliquant sur confirmer, vous recevrez les instructions de paiement par SMS/WhatsApp. L'inscription n'est validée qu'après confirmation du dépôt.</p>
                </div>
              </div>
            </FadeIn>
          )}

          {step === 5 && (
            <FadeIn>
              <div className="glass-card p-12 rounded-2xl text-center shadow-2xl border-2 border-green-500/30">
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-black mb-4">Dossier transmis !</h2>
                <p className="text-sm mb-10 opacity-70 max-w-sm mx-auto">
                  Excellent choix ! Notre équipe examine vos informations. Un conseiller vous contactera d'ici 1 heure pour finaliser le dépôt.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/apprenant" className="bg-galf-yellow text-galf-carbon px-10 py-5 rounded-xl font-black hover:brightness-110 flex items-center justify-center gap-2">
                    Accéder à mon espace <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          )}

          {step < totalSteps && (
            <FadeIn delay={0.2} className="flex justify-between mt-10">
               <button onClick={() => setStep(step - 1)} disabled={step === 1}
                 className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold opacity-60 hover:opacity-100 disabled:opacity-0 transition-all">
                 <ArrowLeft className="w-4 h-4" /> Retour
               </button>
               <button onClick={() => setStep(step + 1)} disabled={(step === 1 && !selectedFormation) || (step === 3 && !paymentMethod)}
                 className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-xl font-black hover:brightness-110 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50">
                 {step === 4 ? "Confirmer l'inscription" : "Étape suivante"} <ArrowRight className="w-4 h-4" />
               </button>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  )
}
