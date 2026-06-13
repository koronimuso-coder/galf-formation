"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { MapPin, Phone, Mail, Send, Clock, MessageCircle, CheckCircle2, AlertCircle, Calendar } from 'lucide-react'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Callback scheduler states
  const [phoneToCall, setPhoneToCall] = useState('')
  const [callbackTimeSlot, setCallbackTimeSlot] = useState('urgent')
  const [callbackScheduled, setCallbackScheduled] = useState(false)
  const [countdownSeconds, setCountdownSeconds] = useState(300)

  // Map Switcher State
  const [activeCenter, setActiveCenter] = useState<'abidjan' | 'sanpedro'>('abidjan')

  // Callback countdown timer hook
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callbackScheduled && callbackTimeSlot === 'urgent' && countdownSeconds > 0) {
      interval = setInterval(() => {
        setCountdownSeconds(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callbackScheduled, callbackTimeSlot, countdownSeconds])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneToCall) return
    setCallbackScheduled(true)
    setCountdownSeconds(300) // 5 minutes count
  }

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const centerDetails = {
    abidjan: {
      title: "Centre d'Excellence d'Abidjan",
      address: "Yopougon, Marché Bagnon, Abidjan, CI",
      access: "Autoroute du Nord, Sortie Yopougon centre. Lignes de bus 27 et 82.",
      machines: ["🏗️ Grue à Tour", "🪖 Pelle Hydraulique", "🚜 Chargeuse articulée"]
    },
    sanpedro: {
      title: "Centre Minier de San Pedro",
      address: "Zone Industrielle, Port de San Pedro, CI",
      access: "Route côtière, à 2 km de l'entrée du Port Autonome.",
      machines: ["🚜 Bulldozer D6", "🪖 Pelle de tranchée", "⛏️ Foreuse de mine"]
    }
  }

  const currentCenter = centerDetails[activeCenter]

  const inputStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="NOUS CONTACTER"
        subtitle="Candidat, professionnel ou entreprise, notre équipe est disponible pour répondre à vos questions."
        badge="Restons en contact"
      />

      <div className="container-galf relative z-10 mt-12">

        <div className="grid md:grid-cols-2 gap-12">
          <FadeIn delay={0.2} className="space-y-6">
            {[
              { icon: MapPin, t: "Notre Centre Principal", d: "Yopougon, Marché Bagnon, Abidjan, Côte d'Ivoire" },
              { icon: Phone, t: "Téléphone & WhatsApp", d: "+225 07 11 82 65 07" },
              { icon: Mail, t: "Email", d: "contact@galf-formation.ci" },
              { icon: Clock, t: "Horaires d'accueil", d: "Lun - Sam : 08h00 - 18h00" },
            ].map((info, i) => (
              <div key={i} className="glass-card p-6 rounded-xl flex items-start gap-4 hover:border-galf-yellow/30 transition-colors border-galf-border">
                <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow flex items-center justify-center shrink-0">
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black mb-1" style={{ color: 'var(--galf-text)' }}>{info.t}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'var(--galf-text-secondary)' }}>{info.d}</p>
                </div>
              </div>
            ))}

            <a href="https://wa.me/2250711826507" className="flex items-center justify-center gap-3 bg-green-500 text-white font-black py-4 px-6 rounded-xl hover:bg-green-600 transition-colors shadow-md">
              <MessageCircle className="w-6 h-6" /> Écrire sur WhatsApp
            </a>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="glass-card p-8 rounded-xl relative overflow-hidden border border-galf-border">
              <h2 className="text-2xl font-black mb-8 relative z-10" style={{ color: 'var(--galf-text)' }}>Envoyez-nous un message</h2>
              
              {submitted ? (
                <div className="text-center py-12 px-6 bg-galf-yellow/10 rounded-2xl border border-galf-yellow/20 animate-fadeIn relative z-10">
                  <CheckCircle2 className="w-16 h-16 text-galf-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--galf-text)' }}>Message Envoyé !</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                    Merci de nous avoir contacté. Un conseiller GALF vous répondra par email ou téléphone sous 24h.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-xs font-black uppercase tracking-widest text-galf-yellow hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ l: "Nom", p: "Votre nom" }, { l: "Prénom", p: "Votre prénom" }].map((f, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>{f.l}</label>
                        <input required type="text" placeholder={f.p} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Email</label>
                    <input required type="email" placeholder="votre@email.com" className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Sujet</label>
                    <select className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>
                      <option>Demande d'information</option>
                      <option>Inscription à une formation</option>
                      <option>Demande de devis entreprise</option>
                      <option>Partenariat</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Message</label>
                    <textarea required rows={5} placeholder="Comment pouvons-nous vous aider ?" className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow resize-none" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}></textarea>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                    <Send className={`w-5 h-5 ${isSubmitting ? 'animate-bounce' : ''}`} /> 
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>

        {/* ═══════════════════════════════════════════════
            NEW ROW: MAP SWITCHER & CALLBACK SCHEDULER
           ═══════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          
          {/* Map Switcher (Left) */}
          <FadeIn delay={0.4}>
            <div className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-xl font-black mb-2 text-white flex items-center gap-2">
                  <MapPin className="text-galf-yellow w-5 h-5" /> Localisation des Centres d'Apprentissage
                </h3>
                <p className="text-xs text-white/60 mb-6">
                  Basculez entre nos deux sites pour voir les détails d'accès et le parc de machines.
                </p>

                {/* SVG Map */}
                <div className="mb-6">
                  <svg viewBox="0 0 200 150" className="w-full h-40 bg-black/40 rounded-xl border border-white/5 overflow-visible">
                    {/* Côte d'Ivoire coastal shape mockup */}
                    <path 
                      d="M10,80 L40,85 L80,95 L120,105 L160,110 L190,115 L200,120 M10,80 L20,10 L180,10 L190,115"
                      fill="none" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                    />
                    
                    {/* San Pedro Pin */}
                    <g className="cursor-pointer" onClick={() => setActiveCenter('sanpedro')}>
                      <circle 
                        cx="50" cy="110" r={activeCenter === 'sanpedro' ? "7" : "5"} 
                        fill={activeCenter === 'sanpedro' ? "#FFB000" : "rgba(255,176,0,0.4)"} 
                        className="transition-all duration-300"
                      />
                      {activeCenter === 'sanpedro' && (
                        <circle cx="50" cy="110" r="12" fill="none" stroke="#FFB000" strokeWidth="1" className="animate-ping" />
                      )}
                      <text x="50" y="98" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle" className="pointer-events-none uppercase">San Pedro</text>
                    </g>

                    {/* Abidjan Pin */}
                    <g className="cursor-pointer" onClick={() => setActiveCenter('abidjan')}>
                      <circle 
                        cx="140" cy="105" r={activeCenter === 'abidjan' ? "7" : "5"} 
                        fill={activeCenter === 'abidjan' ? "#FFB000" : "rgba(255,176,0,0.4)"} 
                        className="transition-all duration-300"
                      />
                      {activeCenter === 'abidjan' && (
                        <circle cx="140" cy="105" r="12" fill="none" stroke="#FFB000" strokeWidth="1" className="animate-ping" />
                      )}
                      <text x="140" y="93" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle" className="pointer-events-none uppercase">Abidjan</text>
                    </g>
                  </svg>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-black text-galf-yellow">{currentCenter.title}</div>
                  <div className="text-xs text-white/80 font-semibold">{currentCenter.address}</div>
                  <p className="text-xs text-white/50 leading-relaxed">{currentCenter.access}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block mb-2">Engins disponibles sur site :</span>
                <div className="flex flex-wrap gap-2">
                  {currentCenter.machines.map((m, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2.5 py-1 bg-white/5 border border-white/5 text-white/70 rounded-lg">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Callback Scheduler (Right) */}
          <FadeIn delay={0.5}>
            <div className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-xl font-black mb-2 text-white flex items-center gap-2">
                  <Phone className="text-galf-yellow w-5 h-5 animate-pulse" /> Planificateur de Rappel Téléphonique
                </h3>
                <p className="text-xs text-white/60 mb-6">
                  Saisissez votre numéro de téléphone. Un conseiller GALF s'engage à vous rappeler au créneau choisi.
                </p>

                {callbackScheduled ? (
                  <div className="bg-galf-yellow/15 border border-galf-yellow/30 rounded-2xl p-6 text-center my-4 animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-galf-yellow mx-auto mb-3 animate-bounce" />
                    <div className="text-sm font-black text-white uppercase tracking-wider">Demande enregistrée !</div>
                    <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
                      Votre conseiller technique étudie votre fiche de contact.
                    </p>

                    {callbackTimeSlot === 'urgent' && countdownSeconds > 0 ? (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Compte à rebours avant appel</span>
                        <div className="text-3xl font-mono font-black text-galf-yellow mt-1">
                          {formatCountdown(countdownSeconds)}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-xs font-bold text-galf-yellow">
                        Appel planifié dans le créneau horaire choisi.
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">
                        Votre numéro de téléphone
                      </label>
                      <input 
                        required
                        type="tel"
                        placeholder="Ex: +225 07 11 82 65 07"
                        value={phoneToCall}
                        onChange={(e) => setPhoneToCall(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">
                        Créneau de Rappel
                      </label>
                      <select
                        value={callbackTimeSlot}
                        onChange={(e) => setCallbackTimeSlot(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-galf-yellow"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="urgent">Rappel Immédiat (Sous 5 minutes)</option>
                        <option value="1h">Dans 1 heure</option>
                        <option value="afternoon">Cet après-midi</option>
                        <option value="tomorrow">Demain matin</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-galf-yellow/10"
                    >
                      Planifier mon Rappel
                    </button>
                  </form>
                )}
              </div>

              <div className="text-[9px] text-white/30 text-center mt-6">
                * Ce service est gratuit et réservé aux appels sur le territoire ivoirien.
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </div>
  )
}
