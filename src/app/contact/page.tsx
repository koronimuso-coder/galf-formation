"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { 
  MapPin, Phone, Mail, Send, Clock, MessageCircle, CheckCircle2, 
  AlertCircle, Calendar, LifeBuoy, User, Wrench, Laptop, 
  CreditCard, Sparkles, RefreshCw, FileText, Check, TrendingUp 
} from 'lucide-react'

// Smart diagnostic tips and technician responses for the simulator
const SMART_DIAGNOSTICS = {
  elearning: {
    title: "Accès E-learning & Compte",
    icon: Laptop,
    tip: "💡 Astuce rapide : Les emails de connexion automatique peuvent se retrouver dans vos Courriers Indésirables (Spams). Si vous avez perdu votre mot de passe, utilisez la page dédiée de réinitialisation.",
    techResponse: "Bonjour, je viens de vérifier l'état du serveur e-learning de GALF. Votre compte est bien actif. Si vous ne recevez pas l'email automatique, veuillez m'indiquer une adresse email alternative afin que je force la synchronisation."
  },
  docs: {
    title: "Dossier d'Inscription & Pièces",
    icon: FileText,
    tip: "💡 Astuce rapide : Veillez à ce que vos documents (CNI, Certificat médical) soient au format PDF ou JPG et ne dépassent pas 5 Mo par fichier.",
    techResponse: "Bonjour. Après vérification du statut d'inscription, votre dossier est actuellement en attente de la visite médicale. Dès que vous téléversez votre certificat médical d'aptitude, nos équipes valideront votre dossier en moins de 4 heures."
  },
  simu: {
    title: "Simulateur 3D & Graphismes",
    icon: Wrench,
    tip: "💡 Astuce rapide : Nos simulateurs 3D s'exécutent via WebGL. Activez l'accélération matérielle dans les paramètres de votre navigateur (Paramètres > Système > Utiliser l'accélération matérielle).",
    techResponse: "Bonjour. Le simulateur 3D nécessite au moins 4 Go de RAM et un processeur graphique compatible WebGL 2.0. Avez-vous essayé d'ouvrir la page dans un onglet de navigation privée sans extensions actives ?"
  },
  pay: {
    title: "Paiement & Facturation",
    icon: CreditCard,
    tip: "💡 Astuce rapide : Pour les règlements via Wave ou Mobile Money, la transaction est instantanée. Pensez à faire une capture d'écran du reçu SMS de l'opérateur.",
    techResponse: "Bonjour, je suis le comptable de permanence. Si votre paiement mobile money a été débité mais n'apparaît pas comme validé dans votre espace, veuillez me transmettre la référence de transaction à 10 chiffres (ex: CO2606...) ci-dessous."
  }
}

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

  // Support Ticket Simulator States
  const [ticketCategory, setTicketCategory] = useState<'elearning' | 'docs' | 'simu' | 'pay'>('elearning')
  const [ticketDesc, setTicketDesc] = useState('')
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const [activeTicket, setActiveTicket] = useState<{
    id: string
    category: 'elearning' | 'docs' | 'simu' | 'pay'
    description: string
    status: 'received' | 'assigned' | 'replied' | 'resolved'
    createdAt: string
  } | null>(null)
  
  const [ticketLogs, setTicketLogs] = useState<Array<{ sender: 'user' | 'tech' | 'system'; text: string; time: string }>>([])
  const [techTyping, setTechTyping] = useState(false)
  const [userTicketMsg, setUserTicketMsg] = useState('')

  // Wave 4 states
  const [brakingSpeed, setBrakingSpeed] = useState(20)
  const [brakingSurface, setBrakingSurface] = useState("Sec")
  const [brakingWeight, setBrakingWeight] = useState("Moyen")
  const [firstAidStep, setFirstAidStep] = useState(1)
  const [firstAidChoice, setFirstAidChoice] = useState<string | null>(null)

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

  // Play Web Audio Sound FX
  const playTicketSound = (type: 'success' | 'notify') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      if (type === 'success') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.setValueAtTime(880, now + 0.1)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(now + 0.25)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(950, now)
        gain.gain.setValueAtTime(0.03, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(now + 0.15)
      }
      setTimeout(() => ctx.close(), 300)
    } catch (e) {}
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      playTicketSound('success')
    }, 2000)
  }

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneToCall) return
    setCallbackScheduled(true)
    setCountdownSeconds(300) // 5 minutes count
    playTicketSound('success')
  }

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Handle support ticket creation
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketDesc.trim()) return

    setIsCreatingTicket(true)
    playTicketSound('success')

    const newTicketId = `GALF-TKT-${Math.floor(1000 + Math.random() * 9000)}`
    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

    setTimeout(() => {
      setActiveTicket({
        id: newTicketId,
        category: ticketCategory,
        description: ticketDesc,
        status: 'received',
        createdAt: nowStr
      })
      setTicketLogs([
        { sender: 'system', text: `Ticket créé avec succès. ID : ${newTicketId}`, time: nowStr },
        { sender: 'system', text: "Diagnostic automatique en cours d'analyse...", time: nowStr }
      ])
      setIsCreatingTicket(false)
      setTicketDesc('')

      // Transition to assigned after 2 seconds
      setTimeout(() => {
        setTicketLogs(prev => [
          ...prev,
          { sender: 'system', text: "Ticket assigné à l'agent technique de permanence (M. Diallo).", time: nowStr }
        ])
        playTicketSound('notify')
        setActiveTicket(prev => prev ? { ...prev, status: 'assigned' } : null)

        // Technician typing simulation after another 2.5s
        setTimeout(() => {
          setTechTyping(true)
          
          setTimeout(() => {
            setTechTyping(false)
            const responseText = SMART_DIAGNOSTICS[ticketCategory].techResponse
            setTicketLogs(prev => [
              ...prev,
              { sender: 'tech', text: responseText, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
            ])
            playTicketSound('notify')
            setActiveTicket(prev => prev ? { ...prev, status: 'replied' } : null)
          }, 3000)

        }, 2500)

      }, 2000)

    }, 1500)
  }

  // Handle user responding on the ticket chat
  const handleSendTicketMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userTicketMsg.trim() || !activeTicket) return

    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const userText = userTicketMsg
    setTicketLogs(prev => [
      ...prev,
      { sender: 'user', text: userText, time: nowStr }
    ])
    setUserTicketMsg('')
    playTicketSound('success')

    // Tech responds again
    setTimeout(() => {
      setTechTyping(true)
      setTimeout(() => {
        setTechTyping(false)
        setTicketLogs(prev => [
          ...prev,
          { 
            sender: 'tech', 
            text: "Entendu. J'ai mis à jour les informations dans notre base de données. Nos agents vont faire une double vérification et reviendront vers vous par téléphone sous peu.", 
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) 
          }
        ])
        playTicketSound('notify')
      }, 2500)
    }, 1500)
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
            ROW 2: MAP SWITCHER & CALLBACK SCHEDULER
           ═══════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          
          {/* Map Switcher (Left) */}
          <FadeIn delay={0.4}>
            <div className="glass-card p-8 rounded-[2rem] border border-adaptive relative overflow-hidden flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-xl font-black mb-2 text-adaptive flex items-center gap-2">
                  <MapPin className="text-galf-yellow w-5 h-5" /> Localisation des Centres d'Apprentissage
                </h3>
                <p className="text-xs text-adaptive-secondary mb-6">
                  Basculez entre nos deux sites pour voir les détails d'accès et le parc de machines.
                </p>

                {/* SVG Map */}
                <div className="mb-6">
                  <svg viewBox="0 0 200 150" className="w-full h-40 svg-map-bg overflow-visible">
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
                      <text x="50" y="98" fill="currentColor" fontSize="7" fontWeight="bold" textAnchor="middle" className="pointer-events-none uppercase text-adaptive">San Pedro</text>
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
                      <text x="140" y="93" fill="currentColor" fontSize="7" fontWeight="bold" textAnchor="middle" className="pointer-events-none uppercase text-adaptive">Abidjan</text>
                    </g>
                  </svg>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-black text-galf-yellow">{currentCenter.title}</div>
                  <div className="text-xs text-adaptive font-semibold">{currentCenter.address}</div>
                  <p className="text-xs text-adaptive-secondary leading-relaxed">{currentCenter.access}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-adaptive">
                <span className="label-adaptive block mb-2">Engins disponibles sur site :</span>
                <div className="flex flex-wrap gap-2">
                  {currentCenter.machines.map((m, idx) => (
                    <span key={idx} className="chip-adaptive text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Callback Scheduler (Right) */}
          <FadeIn delay={0.5}>
            <div className="glass-card p-8 rounded-[2rem] border border-adaptive relative overflow-hidden flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-xl font-black mb-2 text-adaptive flex items-center gap-2">
                  <Phone className="text-galf-yellow w-5 h-5 animate-pulse" /> Planificateur de Rappel Téléphonique
                </h3>
                <p className="text-xs text-adaptive-secondary mb-6">
                  Saisissez votre numéro de téléphone. Un conseiller GALF s'engage à vous rappeler au créneau choisi.
                </p>

                {callbackScheduled ? (
                  <div className="bg-galf-yellow/15 border border-galf-yellow/30 rounded-2xl p-6 text-center my-4 animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-galf-yellow mx-auto mb-3 animate-bounce" />
                    <div className="text-sm font-black text-adaptive uppercase tracking-wider">Demande enregistrée !</div>
                    <p className="text-xs text-adaptive-secondary mt-1 max-w-xs mx-auto">
                      Votre conseiller technique étudie votre fiche de contact.
                    </p>

                    {callbackTimeSlot === 'urgent' && countdownSeconds > 0 ? (
                      <div className="mt-4 pt-4 border-t border-adaptive">
                        <span className="label-adaptive">Compte à rebours avant appel</span>
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
                      <label className="label-adaptive">
                        Votre numéro de téléphone
                      </label>
                      <input 
                        required
                        type="tel"
                        placeholder="Ex: +225 07 11 82 65 07"
                        value={phoneToCall}
                        onChange={(e) => setPhoneToCall(e.target.value)}
                        className="input-adaptive w-full rounded-xl p-3.5 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="label-adaptive">
                        Créneau de Rappel
                      </label>
                      <select
                        value={callbackTimeSlot}
                        onChange={(e) => setCallbackTimeSlot(e.target.value)}
                        className="input-adaptive w-full rounded-xl p-3.5 text-xs"
                        style={{ colorScheme: 'light dark' }}
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

              <div className="text-[9px] text-adaptive-muted text-center mt-6">
                * Ce service est gratuit et réservé aux appels sur le territoire ivoirien.
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ═══════════════════════════════════════════════
            NEW: BRAKING DISTANCE CALCULATOR & FIRST AID SIMULATOR
           ═══════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          
          {/* Braking Distance Calculator */}
          <FadeIn delay={0.4}>
            <div className="glass-card p-8 rounded-[2rem] border border-adaptive relative overflow-hidden flex flex-col justify-between h-full min-h-[420px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-2xl font-black mb-2 text-adaptive flex items-center gap-2">
                  <TrendingUp className="text-galf-yellow w-6 h-6" /> Distance d'Arrêt &amp; Freinage d'Engin
                </h3>
                <p className="text-xs text-adaptive-secondary mb-6">
                  Estimez la distance d'arrêt d'une machine lourde en fonction de sa vitesse de roulage, de la masse de l'engin et de l'état d'adhérence du sol.
                </p>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="label-adaptive">Type de sol</label>
                      <select 
                        value={brakingSurface}
                        onChange={(e) => { setBrakingSurface(e.target.value); playTicketSound('notify'); }}
                        className="input-adaptive w-full rounded-xl p-2.5 text-xs"
                        style={{ colorScheme: 'light dark' }}
                      >
                        <option value="Sec">Sol Sec / Béton (Adh. 0.6)</option>
                        <option value="Humide">Sol Humide / Terre (Adh. 0.3)</option>
                        <option value="Boueux">Sol Boueux / Argile (Adh. 0.15)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="label-adaptive">Masse Engin</label>
                      <select 
                        value={brakingWeight}
                        onChange={(e) => { setBrakingWeight(e.target.value); playTicketSound('notify'); }}
                        className="input-adaptive w-full rounded-xl p-2.5 text-xs"
                        style={{ colorScheme: 'light dark' }}
                      >
                        <option value="Léger">Léger (Chariot 4t)</option>
                        <option value="Moyen">Moyen (Pelle 22t)</option>
                        <option value="Lourd">Lourd (Tombereau 60t)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-adaptive-secondary">
                      <span>Vitesse de déplacement</span>
                      <span className="text-galf-yellow font-black">{brakingSpeed} km/h</span>
                    </div>
                    <input 
                      type="range" min="5" max="40" step="5" value={brakingSpeed}
                      onChange={(e) => {
                        setBrakingSpeed(parseInt(e.target.value));
                        playTicketSound('notify');
                      }}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-galf-yellow" style={{ background: 'var(--galf-border)' }}
                    />
                  </div>

                  {(() => {
                    const speedMs = brakingSpeed / 3.6;
                    const reactionDist = Math.round(speedMs * 1.0); // 1s reaction time
                    
                    let coef = 0.6;
                    if (brakingSurface === "Humide") coef = 0.3;
                    if (brakingSurface === "Boueux") coef = 0.15;

                    let mult = 1.0;
                    if (brakingWeight === "Moyen") mult = 1.3;
                    if (brakingWeight === "Lourd") mult = 1.6;

                    const brakingDist = Math.round(((speedMs * speedMs) / (2 * 9.81 * coef)) * mult);
                    const totalDist = reactionDist + brakingDist;

                    return (
                      <div className="space-y-3 pt-2">
                        {/* Interactive SVG Bar */}
                        <div className="h-10 panel-bg rounded-xl overflow-hidden flex text-[8px] font-bold text-center" style={{ color: 'var(--galf-text)' }}>
                          <div 
                            className="bg-yellow-500 flex items-center justify-center transition-all duration-300"
                            style={{ width: `${Math.max(10, (reactionDist / totalDist) * 100)}%` }}
                          >
                            <span className="truncate px-1">Réaction : {reactionDist}m</span>
                          </div>
                          <div 
                            className="bg-red-500 flex items-center justify-center transition-all duration-300 text-white"
                            style={{ width: `${Math.max(10, (brakingDist / totalDist) * 100)}%` }}
                          >
                            <span className="truncate px-1">Freinage : {brakingDist}m</span>
                          </div>
                        </div>

                        <div className="p-3 inner-card space-y-1.5 leading-normal">
                          <div className="flex justify-between text-adaptive-muted text-[10px]">
                            <span>Distance de réaction (1s) :</span>
                            <span className="text-adaptive font-mono">{reactionDist} m</span>
                          </div>
                          <div className="flex justify-between text-adaptive-muted text-[10px]">
                            <span>Distance de freinage mécanique :</span>
                            <span className="text-adaptive font-mono">{brakingDist} m</span>
                          </div>
                          <div className="flex justify-between text-xs font-black pt-1 border-t border-adaptive text-adaptive">
                            <span>Distance totale d'arrêt :</span>
                            <span className="text-galf-yellow font-mono">{totalDist} mètres</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="text-[9px] text-adaptive-muted text-center mt-4 shrink-0">
                * Calculs théoriques basés sur le modèle physique standard de décélération d'engins mobiles.
              </div>
            </div>
          </FadeIn>

          {/* First Aid Simulator */}
          <FadeIn delay={0.5}>
            <div className="glass-card p-8 rounded-[2rem] border border-adaptive relative overflow-hidden flex flex-col justify-between h-full min-h-[420px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-2xl font-black mb-2 text-adaptive flex items-center gap-2">
                  <AlertCircle className="text-galf-yellow w-6 h-6" /> Scénarios de Premiers Secours
                </h3>
                <p className="text-xs text-adaptive-secondary mb-6">
                  Testez vos réactions en cas d'accident sur un chantier BTP ou d'exploitation minière pour garantir la sécurité des personnes.
                </p>

                {firstAidStep === 1 ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="inner-card p-4">
                      <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest">Situation 1 : Risque Électrique</span>
                      <p className="text-xs text-adaptive font-bold leading-relaxed mt-1 font-sans">
                        Un ouvrier gît inerte au sol à côté d'une pelle dont la flèche touche un câble de 20kV. Que faites-vous ?
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {[
                        { id: '1A', label: "A. Saisir l'ouvrier par les mains pour le tirer hors de la zone.", correct: false, desc: "❌ ERREUR : Risque immédiat d'électrisation par conduction de courant du sol ou de l'ouvrier." },
                        { id: '1B', label: "B. Faire disjoncter la ligne ou appeler l'opérateur réseau avant d'approcher.", correct: true, desc: "✅ EXCELLENT : La sécurité du sauveteur est la priorité. Ne jamais approcher d'une source active." },
                        { id: '1C', label: "C. Remplir un seau d'eau et le verser sur l'ouvrier pour le réveiller.", correct: false, desc: "❌ DANGER EXTRÊME : L'eau conduit l'électricité, augmentant dramatiquement le risque de décès." }
                      ].map(choice => (
                        <button
                          key={choice.id}
                          onClick={() => { setFirstAidChoice(choice.id); playTicketSound('success'); }}
                          disabled={firstAidChoice !== null}
                          className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${
                            firstAidChoice === choice.id
                              ? choice.correct 
                                ? 'bg-green-500/10 border border-green-500/40 text-green-700 dark:text-green-400' 
                                : 'bg-red-500/10 border border-red-500/40 text-red-700 dark:text-red-400'
                              : 'choice-btn'
                          }`}
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>

                    {firstAidChoice && (
                      <div className="space-y-3 animate-fadeIn">
                        <p className="text-[10px] text-adaptive-secondary leading-relaxed font-sans p-3.5 inner-card">
                          {firstAidChoice === '1A' && "❌ ERREUR : Risque immédiat d'électrisation par conduction de courant du sol ou de l'ouvrier."}
                          {firstAidChoice === '1B' && "✅ EXCELLENT : La sécurité du sauveteur est la priorité. Ne jamais approcher d'une source active."}
                          {firstAidChoice === '1C' && "❌ DANGER EXTRÊME : L'eau conduit l'électricité, augmentant dramatiquement le risque de décès."}
                        </p>
                        <button
                          onClick={() => { setFirstAidStep(2); setFirstAidChoice(null); playTicketSound('notify'); }}
                          className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110"
                        >
                          Scénario suivant →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="inner-card p-4">
                      <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest">Situation 2 : Hémorragie Externe</span>
                      <p className="text-xs text-adaptive font-bold leading-relaxed mt-1 font-sans">
                        Un mécanicien s'est coupé au bras sur un carter d'engin et présente un saignement abondant en jet.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {[
                        { id: '2A', label: "A. Poser un garrot directement autour du cou de la victime.", correct: false, desc: "❌ CRITIQUE : Le garrot cervical bloque l'irrigation du cerveau, ce qui est fatal immédiat !" },
                        { id: '2B', label: "B. Allonger l'opérateur, appuyer sur la plaie avec un tissu propre et surélever le bras.", correct: true, desc: "✅ CORRECT : Compression directe et élévation pour réduire la pression et stopper le flux." },
                        { id: '2C', label: "C. Appliquer de la terre grasse du chantier pour boucher la plaie ouverte.", correct: false, desc: "❌ INFECTION : Introduire de la terre souillée expose la victime au tétanos et à de graves infections." }
                      ].map(choice => (
                        <button
                          key={choice.id}
                          onClick={() => { setFirstAidChoice(choice.id); playTicketSound('success'); }}
                          disabled={firstAidChoice !== null}
                          className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${
                            firstAidChoice === choice.id
                              ? choice.correct 
                                ? 'bg-green-500/10 border border-green-500/40 text-green-700 dark:text-green-400' 
                                : 'bg-red-500/10 border border-red-500/40 text-red-700 dark:text-red-400'
                              : 'choice-btn'
                          }`}
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>

                    {firstAidChoice && (
                      <div className="space-y-3 animate-fadeIn">
                        <p className="text-[10px] text-adaptive-secondary leading-relaxed font-sans p-3.5 inner-card">
                          {firstAidChoice === '2A' && "❌ CRITIQUE : Le garrot cervical bloque l'irrigation du cerveau, ce qui est fatal immédiat !"}
                          {firstAidChoice === '2B' && "✅ CORRECT : Compression directe et élévation pour réduire la pression et stopper le flux."}
                          {firstAidChoice === '2C' && "❌ INFECTION : Introduire de la terre souillée expose la victime au tétanos et à de graves infections."}
                        </p>
                        <button
                          onClick={() => { setFirstAidStep(1); setFirstAidChoice(null); playTicketSound('notify'); }}
                          className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110"
                        >
                          Recommencer la simulation ↺
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-[9px] text-adaptive-muted text-center mt-4 shrink-0">
                * Les gestes de premiers secours sauvent des vies. Ces réponses simulent les directives SST officielles.
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ═══════════════════════════════════════════════
            ROW 3: SUPPORT TICKET SIMULATOR (NEW FEATURE 15)
           ═══════════════════════════════════════════════ */}
        <div className="mt-16">
          <FadeIn delay={0.6}>
            <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-adaptive relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(255,176,0,0.05),transparent)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[8rem]" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-center text-galf-yellow">
                  <LifeBuoy className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-adaptive uppercase tracking-tight">Simulateur de Tickets de Support</h3>
                  <p className="text-xs text-adaptive-secondary">Obtenez un diagnostic technique automatisé et suivez la résolution de votre incident en direct.</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 mt-8 pt-6 border-t border-adaptive">
                {/* Left Side: Ticket Creation Form & Diagnostics */}
                <div className="lg:col-span-5 space-y-6">
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="label-adaptive">
                        Catégorie de l'incident
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value as any)}
                        disabled={!!activeTicket}
                        className="input-adaptive w-full rounded-xl p-3.5 text-xs disabled:opacity-50"
                        style={{ colorScheme: 'light dark' }}
                      >
                        <option value="elearning">Accès E-learning &amp; Connexion</option>
                        <option value="docs">Dossier d'Inscription &amp; Documents</option>
                        <option value="simu">Simulateur 3D &amp; Problème WebGL</option>
                        <option value="pay">Paiement / Validation Mobile Money</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="label-adaptive">
                        Description détaillée
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Ex: Je ne parviens pas à charger mon certificat médical / Mon écran reste noir sur le simulateur 3D..."
                        value={ticketDesc}
                        onChange={(e) => setTicketDesc(e.target.value)}
                        disabled={!!activeTicket}
                        className="input-adaptive w-full rounded-xl p-3.5 text-xs resize-none disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingTicket || !!activeTicket}
                      className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isCreatingTicket ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Création en cours...
                        </>
                      ) : activeTicket ? (
                        <>
                          <Check className="w-4 h-4" />
                          Ticket Actif en Simulation
                        </>
                      ) : (
                        "Ouvrir un Ticket de Support"
                      )}
                    </button>
                  </form>

                  {/* Smart Diagnostic Block (Real-time tip based on selected category) */}
                  <div className="panel-bg rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-galf-yellow">
                      {(() => {
                        const Icon = SMART_DIAGNOSTICS[ticketCategory].icon
                        return <Icon className="w-4 h-4" />
                      })()}
                      <span>Aide Automatisée : {SMART_DIAGNOSTICS[ticketCategory].title}</span>
                    </div>
                    <p className="text-[11px] text-adaptive-secondary leading-relaxed">
                      {SMART_DIAGNOSTICS[ticketCategory].tip}
                    </p>
                  </div>
                </div>

                {/* Right Side: Live Ticket Tracker Console */}
                <div className="lg:col-span-7">
                  <div className="console-bg p-6 h-full flex flex-col justify-between min-h-[350px]">
                    
                    {!activeTicket ? (
                      <div className="my-auto text-center space-y-3 p-6">
                        <AlertCircle className="w-10 h-10 text-adaptive-muted mx-auto" />
                        <h4 className="text-xs font-black text-adaptive-secondary uppercase tracking-wider">Aucun ticket actif</h4>
                        <p className="text-[10px] text-adaptive-muted max-w-xs mx-auto leading-relaxed">
                          Remplissez le formulaire de support à gauche et soumettez-le pour initier la console de suivi technique simulée.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full justify-between">
                        {/* Ticket Header Metadata */}
                        <div className="pb-4 border-b border-adaptive flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-black uppercase text-galf-yellow bg-galf-yellow/10 px-2 py-0.5 rounded border border-galf-yellow/20">
                              {activeTicket.id}
                            </span>
                            <h4 className="text-xs font-black text-adaptive mt-1 uppercase tracking-tight">
                              {SMART_DIAGNOSTICS[activeTicket.category].title}
                            </h4>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] font-bold text-adaptive-muted block">Statut du ticket :</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${
                              activeTicket.status === 'received' ? 'text-blue-400' :
                              activeTicket.status === 'assigned' ? 'text-orange-400' :
                              activeTicket.status === 'replied' ? 'text-green-400' :
                              'text-white/60'
                            }`}>
                              {activeTicket.status === 'received' && "✓ Reçu / Diagnostic"}
                              {activeTicket.status === 'assigned' && "⚡ Assigné (M. Diallo)"}
                              {activeTicket.status === 'replied' && "💬 Réponse de l'agent"}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Live Log Timeline */}
                        <div className="flex-1 my-4 p-4 panel-bg-deep rounded-2xl overflow-y-auto max-h-48 space-y-3 text-xs custom-scrollbar">
                          {ticketLogs.map((log, idx) => (
                            <div key={idx} className={`flex flex-col ${
                              log.sender === 'user' ? 'items-end' :
                              log.sender === 'tech' ? 'items-start' :
                              'items-center'
                            }`}>
                              {log.sender === 'system' ? (
                                <div className="chat-bubble-system px-2.5 py-1 text-center">
                                  {log.text}
                                </div>
                              ) : (
                                <div className={`max-w-[85%] rounded-xl p-3 relative ${
                                  log.sender === 'user'
                                    ? 'bg-galf-yellow text-galf-carbon font-semibold rounded-tr-none'
                                    : 'chat-bubble-tech rounded-tl-none'
                                }`}>
                                  <div className="text-[9px] opacity-60 font-bold mb-1 flex items-center gap-1">
                                    <User className="w-2.5 h-2.5" />
                                    {log.sender === 'user' ? 'Vous' : 'M. Diallo (Support GALF)'}
                                    <span className="ml-auto">{log.time}</span>
                                  </div>
                                  <p className="leading-relaxed text-[11px]">{log.text}</p>
                                </div>
                              )}
                            </div>
                          ))}

                          {techTyping && (
                            <div className="flex items-start">
                              <div className="panel-bg px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1.5 text-[10px] text-adaptive-muted">
                                <RefreshCw className="w-3 h-3 animate-spin text-galf-yellow" />
                                <span>M. Diallo rédige une réponse...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Reply Form */}
                        <div className="pt-4 border-t border-adaptive flex items-center justify-between gap-4">
                          {activeTicket.status === 'replied' ? (
                            <form onSubmit={handleSendTicketMessage} className="w-full flex gap-2">
                              <input
                                required
                                type="text"
                                placeholder="Tapez votre réponse ici..."
                                value={userTicketMsg}
                                onChange={(e) => setUserTicketMsg(e.target.value)}
                                className="input-adaptive flex-1 rounded-xl px-3 py-2 text-xs"
                              />
                              <button
                                type="submit"
                                className="bg-galf-yellow text-galf-carbon px-4 py-2 rounded-xl font-black text-xs uppercase hover:brightness-110 transition-all shrink-0"
                              >
                                Répondre
                              </button>
                            </form>
                          ) : (
                            <div className="text-[10px] text-adaptive-muted italic">
                              * Vous pourrez répondre dès que le technicien aura formulé une analyse personnalisée (environ 4 secondes).
                            </div>
                          )}

                          <button
                            onClick={() => {
                              playTicketSound('success')
                              setActiveTicket(null)
                              setTicketLogs([])
                            }}
                            className="text-[9px] font-black uppercase text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1.5 rounded-lg hover:bg-red-400/20 transition-all shrink-0"
                          >
                            Annuler / Fermer
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

            </div>
          </FadeIn>
        </div>

      </div>
    </div>
  )
}

