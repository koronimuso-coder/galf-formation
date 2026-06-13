"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Plus, Minus, MessageSquare, Send, X, Bot, CheckCircle2, Search, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'

interface Message {
  sender: 'user' | 'bot'
  text: string
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  // FAQ helpfulness feedback state
  const [votes, setVotes] = useState<{ [key: number]: 'yes' | 'no' }>({})

  // Search and Autocomplete states
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load votes from localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem('galf_faq_votes')
    if (savedVotes) {
      try {
        setVotes(JSON.parse(savedVotes))
      } catch (e) {}
    }
  }, [])

  const handleVote = (index: number, type: 'yes' | 'no') => {
    triggerAudioClick()
    const updated = { ...votes, [index]: type }
    setVotes(updated)
    localStorage.setItem('galf_faq_votes', JSON.stringify(updated))
  }
  
  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Bonjour ! Je suis l'Assistant Virtuel de GALF FORMATION. Posez-moi vos questions sur les admissions, les modalités de paiement ou le simulateur 3D !" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const faqs = [
    { q: "Quelles sont les conditions d'admission ?", a: "Pour la plupart de nos formations sur engins, il faut être âgé d'au moins 18 ans, savoir lire et écrire le français, et présenter une aptitude médicale valide. Aucun diplôme spécifique n'est requis pour les formations de base." },
    { q: "Proposez-vous des facilités de paiement ?", a: "Oui ! Nous proposons des paiements échelonnés en 2 ou 3 fois sans frais. Un acompte de 30% minimum est requis à l'inscription. Le solde peut être réglé via Wave, Orange Money, MTN MoMo, virement bancaire ou espèces." },
    { q: "Est-ce que je trouverai du travail après la formation ?", a: "Le secteur du BTP et des mines recrute en permanence. Nous accompagnons nos apprenants : transmission de CV à notre réseau de 50+ entreprises partenaires, coaching en entretien, et réseau alumni actif." },
    { q: "Comment se déroulent les cours pratiques ?", a: "La pratique représente 80% de votre temps. Vous manipulerez les engins sur nos chantiers-écoles sécurisés, encadrés par des instructeurs certifiés, avec des objectifs de progression quotidiens." },
    { q: "Vos certificats sont-ils reconnus ?", a: "Absolument. Nos certificats sont délivrés selon les normes en vigueur et sont reconnus par les acteurs du BTP, de l'industrie pétrolière et minière en Côte d'Ivoire et en Afrique de l'Ouest." },
    { q: "Quelle est la durée des formations ?", a: "Nos formations varient de 3 jours (carte opérateur) à 3 mois (formations spécialisées comme le forage minier). La majorité dure entre 2 et 6 semaines." },
    { q: "Puis-je suivre des cours en ligne ?", a: "Oui, notre plateforme e-learning permet de suivre les modules théoriques en ligne. La partie pratique reste obligatoirement en présentiel dans nos centres." },
    { q: "Proposez-vous des formations pour les entreprises ?", a: "Oui, nous proposons des formations sur-mesure pour les entreprises : sessions intra-entreprise, formations collectives avec tarifs préférentiels, et plans de développement des compétences." },
  ]

  // Suggested keywords/questions for autocomplete
  const suggestions = [
    { label: "Paiement en plusieurs fois", query: "paiement" },
    { label: "Conditions d'admission", query: "admission" },
    { label: "Durée de la formation", query: "durée" },
    { label: "Reconnaissance de l'État", query: "certificat" },
    { label: "Cours théorique en ligne", query: "ligne" }
  ]

  // Chatbot responses lookup dictionary
  const chatbotReplies: { [key: string]: string } = {
    "duree": "Nos formations durent en moyenne 2 à 6 semaines, sauf pour le Forage Minier qui s'étend sur 3 mois.",
    "paiement": "Nous acceptons Wave, Orange Money, MTN MoMo, virement bancaire et espèces, avec paiement échelonné en 3 fois max.",
    "simulateur": "Le simulateur de conduite 3D permet de vous entraîner virtuellement sur Pelle, Grue ou Bulldozer avant d'entrer en cabine réelle !",
    "certificat": "Oui, les diplômes GALF sont agréés par l'État et reconnus par les multinationales du BTP et des mines en Afrique de l'Ouest.",
    "default": "Je n'ai pas tout à fait compris votre demande. N'hésitez pas à appeler un conseiller GALF au +225 07 11 82 65 07 pour plus de précisions !"
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Audio Click Alert
  const triggerAudioClick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
      setTimeout(() => ctx.close(), 150)
    } catch(e) {}
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return
    triggerAudioClick()
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }])
    setInputVal("")
    setIsTyping(true)

    // Match keywords
    const lower = text.toLowerCase()
    let matchedKey = 'default'
    if (lower.includes('durée') || lower.includes('durer') || lower.includes('temps')) matchedKey = 'duree'
    else if (lower.includes('paiement') || lower.includes('payer') || lower.includes('wave') || lower.includes('tranche')) matchedKey = 'paiement'
    else if (lower.includes('simulateur') || lower.includes('3d') || lower.includes('virtuel')) matchedKey = 'simulateur'
    else if (lower.includes('certificat') || lower.includes('reconnu') || lower.includes('agréé') || lower.includes('diplome')) matchedKey = 'certificat'

    setTimeout(() => {
      setIsTyping(false)
      const botResponse = chatbotReplies[matchedKey]
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }])
    }, 1200)
  }

  // Regex string escaping utility
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Highlight matches inside FAQ text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-galf-yellow/30 text-galf-yellow rounded px-0.5 font-bold">{part}</mark>
            : part
        )}
      </>
    )
  }

  // Filter FAQs based on search input
  const filteredFaqs = faqs.filter(faq => {
    const qMatch = faq.q.toLowerCase().includes(searchQuery.toLowerCase())
    const aMatch = faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    return qMatch || aMatch
  })

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="QUESTIONS FRÉQUENTES"
        subtitle="Trouvez rapidement les réponses à vos interrogations sur nos formations, admissions et tarifs."
        badge="Besoin d'aide ?"
        centered={true}
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 mt-12">

        {/* ═══════════════════════════════════════════════
            SEARCH BAR WITH AUTOCOMPLETE PANEL (FEATURE 16)
           ═══════════════════════════════════════════════ */}
        <FadeIn delay={0.1}>
          <div className="mb-10 relative">
            <div className="glass-card p-2 rounded-2xl border border-white/5 flex items-center gap-3 focus-within:border-galf-yellow/45 transition-colors">
              <div className="pl-4 text-white/40">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une question ou un mot-clé (ex: paiement, certificat, admission...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-white placeholder-white/40"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                    triggerAudioClick()
                  }}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Panel */}
            {showSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-card p-4 rounded-xl border border-white/10 shadow-2xl bg-galf-carbon/95 backdrop-blur-md animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-galf-yellow tracking-wider mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Suggestions de recherche</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions
                    .filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.query.includes(searchQuery.toLowerCase()))
                    .map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(s.query)
                          setShowSuggestions(false)
                          triggerAudioClick()
                        }}
                        className="text-xs px-3 py-1.5 bg-white/5 hover:bg-galf-yellow hover:text-galf-carbon rounded-lg border border-white/5 font-semibold text-white/80 transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  {suggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.query.includes(searchQuery.toLowerCase())).length === 0 && (
                    <span className="text-xs text-white/40 italic">Aucune suggestion rapide pour cette saisie.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq, index) => (
            <FadeIn key={index} delay={0.05 * index}>
              <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 border-galf-border ${openIndex === index ? 'border-galf-yellow/40 glow-yellow' : 'hover:border-galf-yellow/20'}`}>
                <button className="w-full px-6 py-6 flex items-center justify-between focus:outline-none text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  <span className="font-bold text-lg pr-8" style={{ color: 'var(--galf-text)' }}>
                    {highlightText(faq.q, searchQuery)}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-galf-yellow text-galf-carbon' : ''}`}
                    style={openIndex !== index ? { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-muted)' } : {}}>
                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="leading-relaxed text-sm mb-4" style={{ color: 'var(--galf-text-secondary)' }}>
                    {highlightText(faq.a, searchQuery)}
                  </p>
                  
                  {/* Helpfulness feedback system */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-white/50">
                    <span>Cette réponse vous a-t-elle été utile ?</span>
                    <div className="flex items-center gap-3">
                      {votes[index] ? (
                        <span className="text-galf-yellow animate-fadeIn">
                          ✓ Merci pour votre avis !
                        </span>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleVote(index, 'yes')}
                            className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:border-white/20 transition-all"
                          >
                            👍 Oui
                          </button>
                          <button 
                            onClick={() => handleVote(index, 'no')}
                            className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:border-white/20 transition-all"
                          >
                            👎 Non
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Fallback if no matching FAQs */}
          {filteredFaqs.length === 0 && (
            <FadeIn>
              <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                <Search className="w-12 h-12 text-white/20 mx-auto" />
                <h3 className="text-lg font-black" style={{ color: 'var(--galf-text)' }}>Aucun résultat trouvé</h3>
                <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                  Aucune question de notre base de connaissances ne correspond à votre recherche "{searchQuery}". Essayez de saisir un autre mot-clé ou demandez de l'aide en direct à notre assistant.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    triggerAudioClick()
                  }}
                  className="px-5 py-2.5 bg-galf-yellow text-galf-carbon text-xs font-black uppercase rounded-lg hover:brightness-110 transition-all"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            </FadeIn>
          )}
        </div>

        <FadeIn>
          <div className="glass-card p-8 rounded-xl text-center border-galf-border">
            <h3 className="text-xl font-black mb-3" style={{ color: 'var(--galf-text)' }}>Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>Contactez-nous directement, notre équipe vous répondra sous 24h.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="bg-galf-yellow text-galf-carbon px-8 py-3 rounded-lg font-black hover:brightness-110 transition-all shadow-md">Nous contacter</Link>
              <a href="https://wa.me/2250711826507" className="glass-card px-8 py-3 rounded-lg font-bold hover:border-galf-yellow/30 transition-all border-galf-border" style={{ color: 'var(--galf-text)' }}>WhatsApp</a>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ═══════════════════════════════════════════════
          FLOATING AI ASSISTANT CHATBOT WIDGET
         ═══════════════════════════════════════════════ */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        {/* Chat window */}
        {chatOpen && (
          <div className="w-80 h-96 bg-galf-carbon rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between mb-4 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-galf-yellow text-galf-carbon px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Assistant Pédagogique</span>
              </div>
              <button onClick={() => setChatOpen(false)}>
                <X className="w-4 h-4 hover:scale-115 transition-transform" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-galf-yellow text-galf-carbon font-bold rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-white rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 text-white p-3 rounded-xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button 
                onClick={() => handleSendMessage("Quelle est la durée ?")}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[9px] font-bold border border-white/10 text-white/70 whitespace-nowrap"
              >
                ⏱️ Durée
              </button>
              <button 
                onClick={() => handleSendMessage("Quels paiements acceptez-vous (Wave) ?")}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[9px] font-bold border border-white/10 text-white/70 whitespace-nowrap"
              >
                💳 Paiement
              </button>
              <button 
                onClick={() => handleSendMessage("Comment fonctionne le simulateur 3D ?")}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[9px] font-bold border border-white/10 text-white/70 whitespace-nowrap"
              >
                🎮 Simulateur
              </button>
            </div>

            {/* Message input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputVal)
              }} 
              className="p-3 border-t border-white/5 flex gap-2 shrink-0 bg-black/20"
            >
              <input 
                type="text" 
                placeholder="Posez votre question..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-xs bg-black/40 border border-white/10 text-white outline-none focus:border-galf-yellow"
              />
              <button 
                type="submit"
                className="w-8 h-8 rounded-lg bg-galf-yellow text-galf-carbon flex items-center justify-center hover:brightness-110 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => {
            triggerAudioClick()
            setChatOpen(!chatOpen)
          }}
          className="w-14 h-14 rounded-full bg-galf-yellow text-galf-carbon flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
        >
          {chatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

    </div>
  )
}
