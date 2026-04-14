"use client"
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { Search, Filter, ShieldCheck, Star, MapPin, Calendar, CheckCircle2, Phone, Briefcase, Award, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

const CANDIDATES = [
  { id: "C-001", name: "Yao Anderson", job: "Opérateur Pelle", score: "18.5/20", tag: "Expert", exp: "5 ans", location: "San Pedro", image: "Y", status: "Disponible" },
  { id: "C-002", name: "Diarra Moussa", job: "Grutier à Tour", score: "17.0/20", tag: "Confirmé", exp: "3 ans", location: "Abidjan", image: "D", status: "En mission" },
  { id: "C-003", name: "Koné Fatou", job: "Conductrice Bulldozer", score: "19.0/20", tag: "Major Promo", exp: "2 ans", location: "Bouaké", image: "K", status: "Disponible" },
  { id: "C-004", name: "Kouakou Marc", job: "Opérateur Chargeuse", score: "16.5/20", tag: "Nouveau", exp: "CQP 2024", location: "Abidjan", image: "M", status: "Disponible" },
  { id: "C-005", name: "Sylla Amadou", job: "Forage Minier", score: "18.0/20", tag: "Expert", exp: "7 ans", location: "Korhogo", image: "S", status: "Disponible" },
  { id: "C-006", name: "Bamba Fanta", job: "Spécialiste HSE", score: "19.5/20", tag: "Major Promo", exp: "4 ans", location: "San Pedro", image: "F", status: "Disponible" },
]

export default function RecruitmentHub() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Tous")
  const [verifyingId, setVerifyingId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<null | 'valid' | 'invalid'>(null)

  const filters = ["Tous", "Pelle", "Grue", "Bulldozer", "Forage", "HSE", "Chargeuse"]

  const filteredCandidates = CANDIDATES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.job.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === "Tous" || c.job.includes(activeFilter)
    return matchesSearch && matchesFilter
  })

  const handleVerify = () => {
    if (!verifyingId) return
    setIsVerifying(true)
    setVerificationResult(null)
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationResult(verifyingId.startsWith("GALF-") ? 'valid' : 'invalid')
    }, 1500)
  }

  const inputStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG - Grue for "Picking Talent" */}
      <div className="absolute right-[-10%] top-[0%] w-[900px] h-[900px] opacity-[0.03] pointer-events-none z-0">
        <AnimatedMachineHeader type="grue" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-3xl">
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Elite Talent Pool</div>
              <TextReveal 
                text="HUB RECRUTEUR" 
                className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none text-white" 
              />
              <p className="text-xl leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                Accédez à l'élite des opérateurs certifiés par GALF. Qualité technique, rigueur HSE et expérience terrain garantie.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border-galf-yellow/20 flex flex-col gap-4 min-w-[320px]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: 'var(--galf-text)' }}>
                <ShieldCheck className="text-galf-yellow w-4 h-4" /> Vérifier un certificat
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ID: GALF-2024-..." 
                  value={verifyingId}
                  onChange={(e) => setVerifyingId(e.target.value)}
                  className="flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-galf-yellow" 
                  style={inputStyle} 
                />
                <button 
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="bg-galf-yellow text-galf-carbon px-4 py-2 rounded-lg font-black text-sm hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isVerifying ? "..." : "OK"}
                </button>
              </div>
              {verificationResult === 'valid' && (
                <div className="text-[10px] font-bold text-green-500 flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3 h-3" /> Certificat Authentique GALF
                </div>
              )}
              {verificationResult === 'invalid' && (
                <div className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fadeIn">
                  <ShieldCheck className="w-3 h-3" /> ID Introuvable ou Invalide
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Search & Filters */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" style={{ color: 'var(--galf-text)' }} />
              <input 
                type="text" 
                placeholder="Rechercher par nom ou spécialité (ex: Grutier)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-galf-yellow/50 transition-all" 
                style={{ ...inputStyle, fontSize: '1rem' }} 
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <Filter className="w-4 h-4 mr-2 shrink-0" style={{ color: 'var(--galf-text-secondary)' }} />
              {filters.map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border ${activeFilter === f ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-galf-border hover:border-galf-yellow/30'}`}
                  style={activeFilter !== f ? { color: 'var(--galf-text-secondary)' } : {}}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCandidates.map((c, i) => (
            <FadeIn key={c.id} delay={0.1 + i * 0.05}>
              <div className="glass-card rounded-[2rem] overflow-hidden group hover:border-galf-yellow/40 transition-all duration-500 hover:shadow-2xl hover:shadow-galf-yellow/5">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-galf-yellow flex items-center justify-center text-3xl font-black text-galf-carbon group-hover:rotate-6 transition-transform">
                      {c.image}
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-black uppercase px-2 py-1 rounded inline-block mb-1 ${c.status === 'Disponible' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {c.status}
                      </div>
                      <div className="text-xs font-bold" style={{ color: 'var(--galf-text-muted)' }}>ID: {c.id}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-1 group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{c.name}</h3>
                  <div className="text-sm font-bold uppercase tracking-wider text-galf-yellow mb-6">{c.job}</div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-galf-yellow/5 border border-galf-yellow/10">
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase opacity-40 mb-1" style={{ color: 'var(--galf-text)' }}>
                        <Award className="w-3 h-3 text-galf-yellow" /> Score Technique
                      </div>
                      <div className="text-sm font-black" style={{ color: 'var(--galf-text)' }}>{c.score}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-galf-yellow/5 border border-galf-yellow/10">
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase opacity-40 mb-1" style={{ color: 'var(--galf-text)' }}>
                        <Calendar className="w-3 h-3 text-galf-yellow" /> Expérience
                      </div>
                      <div className="text-sm font-black" style={{ color: 'var(--galf-text)' }}>{c.exp}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--galf-text-secondary)' }}>
                      <MapPin className="w-4 h-4 text-galf-yellow" /> {c.location}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--galf-text-secondary)' }}>
                      <Star className="w-4 h-4 text-galf-yellow" /> Major de promotion GALF
                    </div>
                  </div>

                  <div className="pt-6 border-t border-galf-border flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-galf-yellow text-galf-carbon px-2 py-1 rounded">{c.tag}</span>
                    <button className="flex items-center gap-2 text-sm font-black group-hover:translate-x-1 transition-transform" style={{ color: 'var(--galf-text)' }}>
                      Voir profil complet <ArrowRight className="w-4 h-4 text-galf-yellow" />
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* No Results */}
        {filteredCandidates.length === 0 && (
          <FadeIn>
            <div className="text-center py-20 glass-card rounded-3xl border-dashed">
              <Briefcase className="w-16 h-16 text-galf-text-muted opacity-30 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2" style={{ color: 'var(--galf-text)' }}>Aucun candidat correspondant</h3>
              <p style={{ color: 'var(--galf-text-secondary)' }}>Essayez d'ajuster vos filtres ou contactez-nous pour une recherche sur-mesure.</p>
            </div>
          </FadeIn>
        )}

        {/* CTA B2B */}
        <FadeIn delay={0.5}>
          <div className="mt-24 p-12 rounded-[2.5rem] bg-galf-carbon relative overflow-hidden text-center group">
             <div className="absolute inset-0 bg-galf-yellow opacity-0 group-hover:opacity-5 transition-opacity" />
             <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tighter italic">Besoin d'un recrutement massif ?</h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                  Nos conseillers B2B vous accompagnent dans le sourcing et la validation technique de vos futures équipes.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <a href="https://wa.me/2250711826507" className="bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl">
                    <Phone className="w-5 h-5" /> Parler à un expert
                  </a>
                  <button className="glass-card px-10 py-4 rounded-2xl font-black text-lg text-white hover:border-galf-yellow/30 transition-all">
                    Demander une étude
                  </button>
                </div>
             </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
