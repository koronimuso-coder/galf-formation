"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Search, Filter, ShieldCheck, Star, MapPin, Calendar, CheckCircle2, Phone, Briefcase, Award, ArrowRight, X, Download, ShieldCheck as ShieldCheckIcon } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { jsPDF } from 'jspdf'

interface Candidate {
  id: string
  name: string
  job: string
  score: string
  tag: string
  exp: string
  location: string
  image: string
  status: string
  distanceKm: number
  scores: {
    hse: number
    tech: number
    speed: number
    maint: number
    theory: number
  }
}

const CANDIDATES: Candidate[] = [
  { id: "C-001", name: "Yao Anderson", job: "Opérateur Pelle", score: "18.5/20", tag: "Expert", exp: "5 ans", location: "San Pedro", image: "Y", status: "Disponible", distanceKm: 12, scores: { hse: 95, tech: 90, speed: 85, maint: 80, theory: 95 } },
  { id: "C-002", name: "Diarra Moussa", job: "Grutier à Tour", score: "17.0/20", tag: "Confirmé", exp: "3 ans", location: "Abidjan", image: "D", status: "En mission", distanceKm: 45, scores: { hse: 90, tech: 85, speed: 75, maint: 85, theory: 80 } },
  { id: "C-003", name: "Koné Fatou", job: "Conductrice Bulldozer", score: "19.0/20", tag: "Major Promo", exp: "2 ans", location: "Bouaké", image: "K", status: "Disponible", distanceKm: 85, scores: { hse: 100, tech: 95, speed: 90, maint: 90, theory: 100 } },
  { id: "C-004", name: "Kouakou Marc", job: "Opérateur Chargeuse", score: "16.5/20", tag: "Nouveau", exp: "CQP 2024", location: "Abidjan", image: "M", status: "Disponible", distanceKm: 5, scores: { hse: 80, tech: 80, speed: 85, maint: 70, theory: 85 } },
  { id: "C-005", name: "Sylla Amadou", job: "Forage Minier", score: "18.0/20", tag: "Expert", exp: "7 ans", location: "Korhogo", image: "S", status: "Disponible", distanceKm: 150, scores: { hse: 95, tech: 90, speed: 80, maint: 85, theory: 90 } },
  { id: "C-006", name: "Bamba Fanta", job: "Spécialiste HSE", score: "19.5/20", tag: "Major Promo", exp: "4 ans", location: "San Pedro", image: "F", status: "Disponible", distanceKm: 18, scores: { hse: 100, tech: 80, speed: 85, maint: 90, theory: 100 } },
]

function RadarChart({ scores }: { scores: { hse: number, tech: number, speed: number, maint: number, theory: number } }) {
  const cx = 100
  const cy = 100
  const r = 60
  
  const categories = [
    { key: 'hse', label: 'HSE' },
    { key: 'tech', label: 'Technique' },
    { key: 'speed', label: 'Vitesse' },
    { key: 'maint', label: 'Maintenance' },
    { key: 'theory', label: 'Théorie' }
  ]
  
  const getPentagonPoints = (radius: number) => {
    return categories.map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')
  }
  
  const getScorePoints = () => {
    return categories.map((cat, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const score = (scores as any)[cat.key] || 50
      const x = cx + r * Math.cos(angle) * (score / 100)
      const y = cy + r * Math.sin(angle) * (score / 100)
      return `${x},${y}`
    }).join(' ')
  }
  
  return (
    <div className="w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, idx) => (
          <polygon 
            key={idx} 
            points={getPentagonPoints(r * scale)} 
            fill="none" 
            stroke="rgba(255,176,0,0.15)" 
            strokeWidth="1" 
          />
        ))}
        {categories.map((cat, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,176,0,0.2)" strokeWidth="1.5" />
              <text 
                x={cx + (r + 18) * Math.cos(angle)} 
                y={cy + (r + 18) * Math.sin(angle) + 3} 
                fill="rgba(255,255,255,0.7)" 
                fontSize="9" 
                fontWeight="bold"
                textAnchor="middle"
              >
                {cat.label}
              </text>
            </g>
          )
        })}
        <polygon 
          points={getScorePoints()} 
          fill="rgba(255,176,0,0.25)" 
          stroke="#FFB000" 
          strokeWidth="2.5" 
        />
      </svg>
    </div>
  )
}

export default function RecruitmentHub() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Tous")
  const [verifyingId, setVerifyingId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<null | 'valid' | 'invalid'>(null)
  
  // Geolocation radius state
  const [radiusKm, setRadiusKm] = useState(200)

  // Candidate detail modal state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showMessagingDrawer, setShowMessagingDrawer] = useState(false)
  
  // Interview Scheduler states
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewScheduled, setInterviewScheduled] = useState(false)

  const filters = ["Tous", "Pelle", "Grue", "Bulldozer", "Forage", "HSE", "Chargeuse"]

  const filteredCandidates = CANDIDATES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.job.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === "Tous" || c.job.includes(activeFilter)
    const matchesRadius = c.distanceKm <= radiusKm
    return matchesSearch && matchesFilter && matchesRadius
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

  // jsPDF Exporter
  const generatePDFReport = (candidate: Candidate) => {
    try {
      const doc = new jsPDF()
      
      // Branding Header
      doc.setFont("helvetica", "bold")
      doc.setFontSize(22)
      doc.setTextColor(255, 176, 0)
      doc.text("GALF FORMATION", 20, 25)
      
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.setFont("helvetica", "italic")
      doc.text("Fiche d'Évaluation de Recrutement Certifiée", 20, 31)
      
      doc.setDrawColor(255, 176, 0)
      doc.setLineWidth(1)
      doc.line(20, 38, 190, 38)
      
      // Title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(30, 30, 30)
      doc.text("FICHE SYNTHÈSE DU CANDIDAT", 20, 50)
      
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(80, 80, 80)
      
      doc.text(`Identifiant : ${candidate.id}`, 20, 60)
      doc.text(`Nom complet : ${candidate.name}`, 20, 66)
      doc.text(`Poste ciblé : ${candidate.job}`, 20, 72)
      doc.text(`Niveau GALF : ${candidate.tag}`, 20, 78)
      doc.text(`Expérience : ${candidate.exp}`, 20, 84)
      doc.text(`Localisation : ${candidate.location}`, 20, 90)
      
      // Score Box
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(30, 30, 30)
      doc.text("SCORE TECHNIQUE GLOBAL : " + candidate.score, 20, 105)
      
      // Criteria Grid
      doc.setFillColor(26, 26, 29)
      doc.rect(20, 115, 170, 9, "F")
      doc.setTextColor(255, 255, 255)
      doc.text("Critère d'Évaluation", 24, 121)
      doc.text("Score Établi (%)", 140, 121)
      
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "normal")
      doc.text("Rigueur et Conformité HSE", 24, 133)
      doc.text(`${candidate.scores.hse}%`, 140, 133)
      
      doc.text("Maîtrise Technique d'Opération", 24, 142)
      doc.text(`${candidate.scores.tech}%`, 140, 142)
      
      doc.text("Productivité et Vitesse de Manœuvre", 24, 151)
      doc.text(`${candidate.scores.speed}%`, 140, 151)
      
      doc.text("Maintenance Premier Niveau & Inspection", 24, 160)
      doc.text(`${candidate.scores.maint}%`, 140, 160)
      
      doc.text("Théorie & Réglementation Générale", 24, 169)
      doc.text(`${candidate.scores.theory}%`, 140, 169)
      
      doc.setDrawColor(220, 220, 220)
      doc.line(20, 175, 190, 175)
      
      doc.setFontSize(8)
      doc.setTextColor(140, 140, 140)
      doc.text("Document certifié conforme issu de la base d'évaluation technique GALF CI.", 20, 190)
      doc.text("Pour toute vérification, contactez le comité B2B ou flashez le QR code d'authentification.", 20, 195)
      
      // Stamp box
      doc.setDrawColor(255, 176, 0)
      doc.rect(130, 190, 50, 25)
      doc.setFont("helvetica", "italic")
      doc.text("Authentifié GALF CI", 138, 203)
      
      doc.save(`Evaluation-GALF-${candidate.name.replace(/\s+/g, '-')}.pdf`)
    } catch (err) {
      console.error("Failed to generate candidate report PDF", err)
    }
  }

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!interviewDate || !interviewTime) return
    setInterviewScheduled(true)
    setTimeout(() => {
      setInterviewScheduled(false)
      setInterviewDate('')
      setInterviewTime('')
      alert("Entretien planifié avec succès ! Le candidat recevra une notification automatique.")
    }, 1500)
  }

  const inputStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="HUB RECRUTEUR"
        subtitle="Accédez à l'élite des opérateurs certifiés par GALF. Qualité technique, rigueur HSE et expérience terrain garantie."
        badge="Elite Talent Pool"
      />

      <div className="container-galf relative z-10 mt-12">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="text-xs font-black uppercase tracking-widest text-galf-yellow mb-4">Sourcing de Talents</div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--galf-text-secondary)' }}>
                Consultez les profils certifiés GALF et vérifiez instantanément l'authenticité de leurs certificats industriels.
              </p>

              {/* Geolocation slider */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-w-md">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-white mb-2">
                  <span>Rayon de Sourcing</span>
                  <span className="text-galf-yellow">{radiusKm} km</span>
                </div>
                <input 
                  type="range" min="10" max="200" step="10" value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                />
                <span className="text-[10px] text-white/40 block mt-1.5 font-mono">
                  Distance par rapport aux principaux bassins (Abidjan/San Pedro)
                </span>
              </div>
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
                  <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" /> Certificat Authentique GALF
                </div>
              )}
              {verificationResult === 'invalid' && (
                <div className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-fadeIn">
                  <ShieldCheckIcon className="w-3.5 h-3.5" /> ID Introuvable ou Invalide
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
              <div className="glass-card rounded-[2rem] overflow-hidden group hover:border-galf-yellow/40 transition-all duration-500 hover:shadow-2xl hover:shadow-galf-yellow/5 border-galf-border">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-galf-yellow flex items-center justify-center text-3xl font-black text-galf-carbon group-hover:rotate-6 transition-transform">
                      {c.image}
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-black uppercase px-2 py-1 rounded inline-block mb-1 ${c.status === 'Disponible' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {c.status}
                      </div>
                      <div className="text-xs font-bold text-white/40">ID: {c.id}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-1 group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{c.name}</h3>
                  <div className="text-xs font-black uppercase tracking-wider text-galf-yellow mb-6">{c.job} · <span className="opacity-50">{c.distanceKm} km</span></div>

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
                    <button 
                      onClick={() => setSelectedCandidate(c)}
                      className="flex items-center gap-2 text-xs font-black group-hover:translate-x-1 transition-transform text-white hover:text-galf-yellow"
                    >
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
            <div className="text-center py-20 glass-card rounded-3xl border-dashed border-galf-border">
              <Briefcase className="w-16 h-16 text-galf-text-muted opacity-30 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2 text-white">Aucun candidat correspondant</h3>
              <p style={{ color: 'var(--galf-text-secondary)' }}>Essayez d'ajuster vos filtres ou contactez-nous pour une recherche sur-mesure.</p>
            </div>
          </FadeIn>
        )}

        {/* CTA B2B */}
        <FadeIn delay={0.5}>
          <div className="mt-24 p-12 rounded-[2.5rem] bg-galf-carbon relative overflow-hidden text-center group border border-white/5 shadow-2xl">
             <div className="absolute inset-0 bg-galf-yellow opacity-0 group-hover:opacity-5 transition-opacity" />
             <div className="relative z-10 animate-fadeIn">
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tighter italic">Besoin d'un recrutement massif ?</h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                  Nos conseillers B2B vous accompagnent dans le sourcing et la validation technique de vos futures équipes.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <a href="https://wa.me/2250711826507" className="bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl">
                    <Phone className="w-5 h-5" /> Parler à un expert
                  </a>
                  <button className="glass-card px-10 py-4 rounded-2xl font-black text-lg text-slate-900 dark:text-white hover:border-galf-yellow/30 transition-all border-galf-border">
                    Demander une étude
                  </button>
                </div>
             </div>
          </div>
        </FadeIn>
      </div>

      {/* ═══════════════════════════════════════════════
          CANDIDATE DETAIL MODAL
         ═══════════════════════════════════════════════ */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => { setSelectedCandidate(null); setShowMessagingDrawer(false); }} />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-3xl glass-card rounded-[2.5rem] overflow-hidden border-galf-yellow/20 flex flex-col md:flex-row text-white z-10 shadow-2xl">
            {/* Left side: profile general details */}
            <div className="p-8 md:w-1/2 flex flex-col justify-between" style={{ background: 'var(--galf-bg-alt)' }}>
              <div>
                <button 
                  onClick={() => { setSelectedCandidate(null); setShowMessagingDrawer(false); }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10 mb-6"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-20 h-20 rounded-2xl bg-galf-yellow flex items-center justify-center text-4xl font-black text-galf-carbon mb-6">
                  {selectedCandidate.image}
                </div>
                <h3 className="text-3xl font-black">{selectedCandidate.name}</h3>
                <div className="text-sm font-bold uppercase text-galf-yellow tracking-widest mt-1 mb-4">{selectedCandidate.job}</div>
                
                <div className="space-y-2.5 text-xs text-white/70">
                  <div className="flex justify-between"><span className="opacity-50">Localisation:</span><span className="font-bold">{selectedCandidate.location}</span></div>
                  <div className="flex justify-between"><span className="opacity-50">Expérience:</span><span className="font-bold">{selectedCandidate.exp}</span></div>
                  <div className="flex justify-between"><span className="opacity-50">Certification ID:</span><span className="font-mono text-galf-yellow">{selectedCandidate.id}</span></div>
                  <div className="flex justify-between"><span className="opacity-50">Rayon Sourcing:</span><span className="font-bold">{selectedCandidate.distanceKm} km</span></div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button 
                  onClick={() => generatePDFReport(selectedCandidate)}
                  className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Fiche Synthèse PDF
                </button>
                <button 
                  onClick={() => setShowMessagingDrawer(true)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/30 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  💬 Messagerie Rapide RH
                </button>
              </div>
            </div>

            {/* Right side: radar competencies & interview planning OR messaging drawer */}
            <div className="p-8 md:w-1/2 bg-galf-carbon/50 flex flex-col justify-between">
              {!showMessagingDrawer ? (
                <>
                  <div>
                    <h4 className="text-xs font-black uppercase text-galf-yellow tracking-widest mb-6 pb-2 border-b border-white/5 text-center">
                      Radar des Compétences GALF
                    </h4>
                    <RadarChart scores={selectedCandidate.scores} />
                  </div>

                  {/* Interview Scheduler form */}
                  <div className="mt-8">
                    <h4 className="text-xs font-black uppercase text-white/50 tracking-wider mb-3">Planifier un Entretien</h4>
                    {interviewScheduled ? (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-xs font-bold text-green-400">
                        Planification en cours d'envoi...
                      </div>
                    ) : (
                      <form onSubmit={handleScheduleInterview} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            required type="date" value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-galf-yellow" style={inputStyle}
                          />
                          <input 
                            required type="time" value={interviewTime}
                            onChange={(e) => setInterviewTime(e.target.value)}
                            className="rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-galf-yellow" style={inputStyle}
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="w-full py-3 rounded-lg bg-white text-galf-carbon font-black text-xs uppercase tracking-widest hover:bg-galf-yellow transition-all"
                        >
                          Réserver le Créneau
                        </button>
                      </form>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-between h-full animate-fadeIn">
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                      <h4 className="text-xs font-black uppercase text-galf-yellow tracking-widest">
                        Messagerie Rapide RH
                      </h4>
                      <button 
                        onClick={() => setShowMessagingDrawer(false)}
                        className="text-[10px] font-black uppercase text-white/60 hover:text-white"
                      >
                        Retour ↩
                      </button>
                    </div>

                    <p className="text-[11px] text-white/60 mb-4 leading-relaxed">
                      Envoyez une invitation pré-rédigée à **{selectedCandidate.name}** pour ce poste d'**{selectedCandidate.job}**.
                    </p>

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-[10px] font-mono text-white/80 leading-relaxed mb-6">
                      <p className="font-bold text-galf-yellow mb-1">Modèle d'invitation :</p>
                      "Bonjour {selectedCandidate.name}, suite à l'analyse de votre profil GALF d'{selectedCandidate.job}, nous aimerions vous rencontrer pour un projet BTP en cours."
                    </div>

                    <div className="space-y-3">
                      <a 
                        href={`https://wa.me/2250711826507?text=${encodeURIComponent(`Bonjour ${selectedCandidate.name}, suite à l'analyse de votre profil GALF d'${selectedCandidate.job}, nous aimerions vous rencontrer pour un projet BTP en cours.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-xl bg-green-500 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 text-center"
                      >
                        💬 Envoyer via WhatsApp
                      </a>
                      <a 
                        href={`mailto:recrutement@chantier-galf.ci?subject=Candidature%20BTP%20-%20GALF&body=${encodeURIComponent(`Bonjour ${selectedCandidate.name},\n\nSuite à l'analyse de votre profil d'${selectedCandidate.job} sur GALF, nous souhaitons planifier un entretien.\n\nCordialement,\nService RH`)}`}
                        className="w-full py-3 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 text-center"
                      >
                        ✉️ Envoyer par Email
                      </a>
                      <a 
                        href={`sms:?body=${encodeURIComponent(`Bonjour ${selectedCandidate.name}, votre profil GALF d'${selectedCandidate.job} nous intéresse. Contactez le service RH au 0711826507.`)}`}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10 text-center"
                      >
                        📱 Envoyer par SMS
                      </a>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowMessagingDrawer(false)}
                    className="w-full mt-6 py-2.5 rounded-lg border border-white/5 hover:border-white/15 text-[10px] font-black uppercase text-white/50 transition-all"
                  >
                    Fermer la Messagerie
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
