"use client"
import { useState } from 'react'
import gsap from 'gsap'
import { FadeIn } from '@/components/animations/FadeIn'
import { PageHeader } from '@/components/layout/PageHeader'
import { Search, Briefcase, MapPin, ShieldCheck, X, Send, Award, Phone } from 'lucide-react'

interface Operator {
  id: string
  name: string
  spec: string
  category: string
  location: string
  experience: string
  status: 'Disponible' | 'En contrat'
  skills: string[]
  avatar: string
}

export default function OperatorDirectory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpec, setSelectedSpec] = useState('all')
  const [selectedLoc, setSelectedLoc] = useState('all')
  
  // Contact Modal state
  const [contactOperator, setContactOperator] = useState<Operator | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSent, setContactSent] = useState(false)

  const operators: Operator[] = [
    { id: "GALF-2024-PL-09", name: "Mamadou Koné", spec: "Pelle hydraulique", category: "CACES R482 Cat B1 (Chenilles)", location: "Abidjan, CI", experience: "4 ans", status: "Disponible", skills: ["HSE Expert", "VGP Check", "Excavation"], avatar: "MK" },
    { id: "GALF-2025-GR-14", name: "Awa Sidibé", spec: "Grue à Tour", category: "CACES R487 (GME)", location: "San Pedro, CI", experience: "2 ans", status: "Disponible", skills: ["Levage aveugle", "Anémomètre check", "Radio guidage"], avatar: "AS" },
    { id: "GALF-2023-BZ-33", name: "Yao Kouakou", spec: "Bulldozer & Chargeuse", category: "CACES R482 Cat C1 / D", location: "Korhogo, CI", experience: "6 ans", status: "En contrat", skills: ["Nivellement", "Mine d'Or", "Ripping"], avatar: "YK" },
    { id: "GALF-2024-CH-22", name: "Ibrahim Doumbia", spec: "Chariot élévateur", category: "CACES R489 Cat 3 & 5", location: "Abidjan, CI", experience: "3 ans", status: "Disponible", skills: ["Logistique Port", "Rackage", "Sécurité Entrepôt"], avatar: "ID" },
    { id: "GALF-2025-GM-07", name: "Salimata Traoré", spec: "Grue Mobile", category: "CACES R483 Cat B (Télescopique)", location: "Bouaké, CI", experience: "5 ans", status: "Disponible", skills: ["Calage stabilisateurs", "Levage lourd", "Élingage"], avatar: "ST" },
    { id: "GALF-2024-EX-41", name: "Jean-Pierre Koffi", spec: "Pelle hydraulique", category: "CACES R482 Cat B1 / C1", location: "San Pedro, CI", experience: "3 ans", status: "En contrat", skills: ["Terrassement", "Tranchées", "Port maritime"], avatar: "JK" }
  ]

  const specs = ['all', 'Pelle hydraulique', 'Grue à Tour', 'Bulldozer & Chargeuse', 'Chariot élévateur', 'Grue Mobile']
  const locations = ['all', 'Abidjan, CI', 'San Pedro, CI', 'Bouaké, CI', 'Korhogo, CI']

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(card, {
      rotateY: x * 0.08,
      rotateX: -y * 0.08,
      transformPerspective: 800,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power3.out"
    })
  }

  const filteredOperators = operators.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          op.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          op.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSpec = selectedSpec === 'all' || op.spec === selectedSpec
    const matchesLoc = selectedLoc === 'all' || op.location === selectedLoc
    return matchesSearch && matchesSpec && matchesLoc
  })

  const handleOpenContact = (op: Operator) => {
    setContactOperator(op)
    setContactMessage(`Bonjour ${op.name}, nous avons vu votre profil certifié sur l'Annuaire GALF. Seriez-vous intéressé par un poste temporaire/CDI dans le secteur de ${op.location} ?`)
    setContactSent(false)
  }

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setTimeout(() => {
      setContactOperator(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="ANNUAIRE DES OPÉRATEURS CERTIFIÉS"
        subtitle="Recrutez instantanément nos diplômés qualifiés. Profils vérifiés sur Blockchain GALF avec compétences de conduite validées."
        badge="Recrutement Premium BTP & Mines"
      />

      <div className="container-galf mt-16 relative z-10">
        
        {/* Search & Filter Header */}
        <div className="glass-card p-6 rounded-2xl border border-galf-border flex flex-col md:flex-row gap-4 mb-12">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-galf-text-muted" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, ID GALF ou compétence (ex: Ripping, Levage...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-galf-surface border border-galf-border outline-none focus:border-galf-yellow transition-all"
              style={{ color: 'var(--galf-text)' }}
            />
          </div>

          {/* Specialty Filter */}
          <div className="w-full md:w-64">
            <select 
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-galf-surface border border-galf-border outline-none focus:border-galf-yellow transition-all text-sm font-semibold"
              style={{ color: 'var(--galf-text-secondary)' }}
            >
              <option value="all">Toutes les spécialités</option>
              {specs.filter(s => s !== 'all').map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="w-full md:w-56">
            <select 
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-galf-surface border border-galf-border outline-none focus:border-galf-yellow transition-all text-sm font-semibold"
              style={{ color: 'var(--galf-text-secondary)' }}
            >
              <option value="all">Toutes les villes</option>
              {locations.filter(l => l !== 'all').map((l, idx) => (
                <option key={idx} value={l}>{l.replace(', CI', '')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-galf-text-muted">
          <span>{filteredOperators.length} Opérateurs trouvés</span>
          <span>Actualisé en temps réel</span>
        </div>

        {/* Operators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOperators.map((op, idx) => (
            <FadeIn key={op.id} delay={0.08 * idx}>
              <div 
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="glass-card rounded-[2rem] border border-galf-border p-6 flex flex-col justify-between hover:border-galf-yellow/40 transition-all duration-300 relative overflow-hidden group transform-gpu"
              >
                
                {/* Header card */}
                <div>
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    {/* Avatar circle */}
                    <div className="w-14 h-14 rounded-full bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-center font-black text-lg text-galf-yellow shadow-md shrink-0">
                      {op.avatar}
                    </div>
                    {/* Name & ID */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-white">{op.name}</h4>
                        <ShieldCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
                      </div>
                      <div className="text-[10px] font-mono text-white/50">{op.id}</div>
                    </div>
                  </div>

                  {/* Details list */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-white/60">
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Spécialité</span>
                      <span className="font-bold text-white text-right">{op.spec}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/60">
                      <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Certification</span>
                      <span className="font-bold text-galf-yellow text-right text-[10px] uppercase font-mono">{op.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/60">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Localisation</span>
                      <span className="font-bold text-white text-right">{op.location.replace(', CI', '')}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/60">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Expérience</span>
                      <span className="font-bold text-white text-right">{op.experience}</span>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {op.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] uppercase font-bold text-white/40">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-wider">
                    <span className={`w-2 h-2 rounded-full ${op.status === 'Disponible' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className={op.status === 'Disponible' ? 'text-green-500' : 'text-yellow-500'}>{op.status}</span>
                  </div>

                  <button 
                    onClick={() => handleOpenContact(op)}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-galf-yellow text-galf-carbon hover:brightness-110 rounded-lg transition-all"
                  >
                    Recruter
                  </button>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>

      {/* Contact modal */}
      {contactOperator && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setContactOperator(null)} />
          
          <div className="relative glass-card w-full max-w-md p-8 rounded-3xl border border-galf-yellow/20 text-white z-10 animate-scaleUp bg-galf-carbon">
            <button 
              onClick={() => setContactOperator(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-red-600 transition-all flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {contactSent ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto text-2xl animate-bounce">
                  ✓
                </div>
                <h4 className="text-lg font-black uppercase tracking-wider">Message Transmis !</h4>
                <p className="text-xs text-white/60">
                  Votre demande de contact a été transmise directement sur le numéro Whatsapp de **{contactOperator.name}** via la passerelle GALF.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase bg-galf-yellow text-galf-carbon px-2.5 py-1 rounded tracking-wider">Demande de recrutement</span>
                  <h3 className="text-xl font-black mt-3">Contacter {contactOperator.name}</h3>
                  <p className="text-xs text-white/50 mt-1">ID : {contactOperator.id}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Votre Entreprise</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Nom de l'entreprise"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs focus:border-galf-yellow outline-none text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Message</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs focus:border-galf-yellow outline-none text-white transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4.5 rounded-xl bg-galf-yellow text-galf-carbon text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Envoyer la Demande
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
