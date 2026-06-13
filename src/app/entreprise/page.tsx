"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Briefcase, Users, FileText, Send, TrendingUp, CheckCircle2, Shield, ArrowRight, Star, Calculator, Download, Calendar } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GALF_FORMATIONS } from '@/lib/data'
import { jsPDF } from 'jspdf'

export default function EntreprisePortal() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Interactive Devis B2B state
  const [viewMode, setViewMode] = useState<'contact' | 'devis' | 'roi'>('contact')
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedFormations, setSelectedFormations] = useState<string[]>([])
  const [operatorsCount, setOperatorsCount] = useState(5)
  const [isIntra, setIsIntra] = useState(false)
  const [optEnglish, setOptEnglish] = useState(false)
  const [optAudit, setOptAudit] = useState(false)

  // ROI Calculator states
  const [fleetSize, setFleetSize] = useState(10)
  const [incidentsCount, setIncidentsCount] = useState(5)

  // Fleet Optimizer states
  const [fleetPelles, setFleetPelles] = useState(5)
  const [fleetGrues, setFleetGrues] = useState(3)
  const [fleetBulldozers, setFleetBulldozers] = useState(4)

  // B2B Annual Planner State
  const [reservedSlots, setReservedSlots] = useState<string[]>([])
  const [plannerSubmitted, setPlannerSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  // Devis B2B calculations
  const basePricePerOperator = selectedFormations.reduce((sum, id) => {
    const f = GALF_FORMATIONS.find(x => x.id === id)
    return sum + (f ? (f.pricePromo || f.price) : 0)
  }, 0)

  const rawTotal = basePricePerOperator * operatorsCount
  const modalityExtra = isIntra ? Math.round(rawTotal * 0.15) : 0
  const englishExtra = optEnglish ? 150000 * operatorsCount : 0
  const auditExtra = optAudit ? 250000 : 0
  const subTotal = rawTotal + modalityExtra + englishExtra + auditExtra

  // Discount brackets based on operator count
  const discountPercent = operatorsCount >= 30 ? 25 : operatorsCount >= 16 ? 15 : operatorsCount >= 6 ? 10 : 0
  const discountAmount = Math.round(subTotal * (discountPercent / 100))
  const grandTotal = subTotal - discountAmount

  // jsPDF Quote generation
  const handleDownloadB2BQuote = () => {
    try {
      const doc = new jsPDF()
      
      doc.setFont("helvetica", "bold")
      doc.setFontSize(22)
      doc.setTextColor(255, 176, 0)
      doc.text("GALF FORMATION", 20, 25)
      
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.setFont("helvetica", "italic")
      doc.text("L'Élite de la Formation Industrielle, BTP & Mines", 20, 31)
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text("Abidjan, Côte d'Ivoire | info@galfformation.com | www.galfformation.com", 20, 36)
      
      doc.setDrawColor(255, 176, 0)
      doc.setLineWidth(1)
      doc.line(20, 42, 190, 42)
      
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(30, 30, 30)
      doc.text("ESTIMATION DE DEVIS DE FORMATION CORPORATE", 20, 54)
      
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(80, 80, 80)
      doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, 20, 62)
      doc.text(`Entreprise partenaire : ${companyName || 'Partenaire Corporate'}`, 20, 68)
      doc.text(`Représentant : ${contactName || 'Responsable Formation'}`, 20, 74)
      doc.text(`E-mail : ${email || 'Non spécifié'}`, 20, 80)
      
      doc.setFillColor(26, 26, 29)
      doc.rect(20, 90, 170, 9, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.text("Désignation du Module", 24, 96)
      doc.text("Opérateurs", 110, 96)
      doc.text("Tarif Unit.", 138, 96)
      doc.text("Total HT", 168, 96)
      
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "normal")
      let currentY = 107
      
      selectedFormations.forEach((fId) => {
        const f = GALF_FORMATIONS.find(x => x.id === fId)
        if (f) {
          const uPrice = f.pricePromo || f.price
          doc.text(f.name, 24, currentY)
          doc.text(`${operatorsCount}`, 115, currentY)
          doc.text(`${uPrice.toLocaleString('fr-FR')} F`, 138, currentY)
          doc.text(`${(uPrice * operatorsCount).toLocaleString('fr-FR')} F`, 168, currentY)
          currentY += 9
        }
      })
      
      if (isIntra) {
        doc.text("Frais Logistiques & Déplacement (Intra-Entreprise)", 24, currentY)
        doc.text("-", 115, currentY)
        doc.text("15%", 138, currentY)
        doc.text(`${modalityExtra.toLocaleString('fr-FR')} F`, 168, currentY)
        currentY += 9
      }
      if (optEnglish) {
        doc.text("Anglais Technique Minier Additionnel", 24, currentY)
        doc.text(`${operatorsCount}`, 115, currentY)
        doc.text("150 000 F", 138, currentY)
        doc.text(`${englishExtra.toLocaleString('fr-FR')} F`, 168, currentY)
        currentY += 9
      }
      if (optAudit) {
        doc.text("Audit de Sécurité du Parc d'Engins (Forfait)", 24, currentY)
        doc.text("1", 115, currentY)
        doc.text("250 000 F", 138, currentY)
        doc.text(`${auditExtra.toLocaleString('fr-FR')} F`, 168, currentY)
        currentY += 9
      }
      
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.5)
      doc.line(20, currentY - 2, 190, currentY - 2)
      currentY += 8
      
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 30, 30)
      doc.text("Sous-total Brut :", 115, currentY)
      doc.setFont("helvetica", "normal")
      doc.text(`${subTotal.toLocaleString('fr-FR')} F CFA`, 155, currentY)
      currentY += 8
      
      if (discountPercent > 0) {
        doc.setFont("helvetica", "bold")
        doc.setTextColor(219, 68, 85)
        doc.text(`Remise Corporate (${discountPercent}%) :`, 115, currentY)
        doc.setFont("helvetica", "normal")
        doc.text(`- ${discountAmount.toLocaleString('fr-FR')} F CFA`, 155, currentY)
        currentY += 8
      }
      
      doc.setDrawColor(255, 176, 0)
      doc.setLineWidth(0.5)
      doc.line(115, currentY - 2, 190, currentY - 2)
      
      doc.setFont("helvetica", "bold")
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(11)
      doc.text("TOTAL ESTIMATIF HT :", 115, currentY + 4)
      doc.setTextColor(255, 176, 0)
      doc.setFontSize(12)
      doc.text(`${grandTotal.toLocaleString('fr-FR')} F CFA`, 155, currentY + 4)
      
      currentY += 32
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.setTextColor(140, 140, 140)
      doc.text("1. Ce document constitue une estimation financière indicative.", 20, currentY)
      doc.text("2. Un devis définitif ferme sera édité après étude des plannings et disponibilités de nos formateurs.", 20, currentY + 4)
      doc.text("3. Les formations Intra-entreprise nécessitent la mise à disposition d'un terrain adapté.", 20, currentY + 8)
      
      doc.setDrawColor(220, 220, 220)
      doc.rect(135, currentY - 5, 50, 25)
      doc.setFont("helvetica", "italic")
      doc.setFontSize(7)
      doc.text("Cachet GALF CI", 148, currentY + 8)
      
      doc.save(`Estimation-Devis-GALF-${companyName ? companyName.replace(/\s+/g, '-') : 'B2B'}.pdf`)
    } catch (err) {
      console.error("Failed to generate PDF quote:", err)
    }
  }

  const toggleFormationSelection = (id: string) => {
    setSelectedFormations(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Planner toggle logic
  const togglePlannerSlot = (slot: string) => {
    if (plannerSubmitted) return
    setReservedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    )
  }

  const handleBookPlanner = () => {
    if (reservedSlots.length === 0) return
    setPlannerSubmitted(true)
    setTimeout(() => {
      setPlannerSubmitted(false)
      setReservedSlots([])
      alert("Votre calendrier de réservations a été transmis à nos ingénieurs pédagogiques !")
    }, 2000)
  }

  const inputStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }
  
  const quarters = [
    { id: 'Q1', label: '1er Trimestre (Jan-Mar)' },
    { id: 'Q2', label: '2ème Trimestre (Avr-Jun)' },
    { id: 'Q3', label: '3ème Trimestre (Jul-Sep)' },
    { id: 'Q4', label: '4ème Trimestre (Oct-Dec)' },
  ]

  const machines = [
    { name: 'Pelle Hydraulique', icon: '🪖' },
    { name: 'Grue à Tour', icon: '🏗️' },
    { name: 'Bulldozer D6', icon: '🚜' },
    { name: 'HSE Expert Chantiers', icon: '🛡️' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="PORTAIL ENTREPRISES"
        subtitle="Formez vos équipes aux standards internationaux. GALF accompagne les professionnels du BTP et des mines dans la montée en compétence de leur personnel."
        badge="Partenaires corporate"
      />

      <div className="container-galf relative z-10 mt-12">

        {/* Advantages */}
        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: TrendingUp, t: "ROI garanti", d: "Des opérateurs formés = moins d'accidents, meilleure productivité et conformité réglementaire assurée." },
              { icon: Shield, t: "Normes HSE", d: "Toutes nos formations intègrent les normes HSE en vigueur, réduisant vos risques juridiques." },
              { icon: Users, t: "Sur-mesure", d: "Programmes adaptés à vos chantiers, votre parc d'engins et vos objectifs de performance." },
            ].map((adv, i) => (
              <div key={i} className="glass-card p-6 rounded-xl hover:border-galf-yellow/30 transition-colors border-galf-border">
                <adv.icon className="w-8 h-8 text-galf-yellow mb-4" />
                <h3 className="font-black text-lg mb-2" style={{ color: 'var(--galf-text)' }}>{adv.t}</h3>
                <p className="text-sm" style={{ color: 'var(--galf-text-secondary)' }}>{adv.d}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <FadeIn delay={0.2}>
            <h2 className="text-3xl font-black mb-8" style={{ color: 'var(--galf-text)' }}>Solutions <span className="text-galf-yellow">B2B</span></h2>
            <div className="space-y-6">
              {[
                { icon: Users, t: "Formations Intra-entreprise", d: "Nous déployons nos équipements et instructeurs directement sur vos sites d'exploitation." },
                { icon: FileText, t: "Devis Groupé", d: "Tarification dégressive pour l'inscription de plusieurs collaborateurs à nos sessions." },
                { icon: Briefcase, t: "Partenariat Recrutement", d: "Accédez en priorité aux profils les mieux formés de nos promotions pour vos recrutements." },
              ].map((b, i) => (
                <div key={i} className="glass-card p-6 rounded-xl flex gap-4 hover:border-galf-yellow/30 transition-colors border-galf-border">
                  <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-2" style={{ color: 'var(--galf-text)' }}>{b.t}</h3>
                    <p className="text-sm" style={{ color: 'var(--galf-text-secondary)' }}>{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="glass-card p-8 rounded-xl relative overflow-hidden border border-galf-yellow/20">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-galf-border">
                <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                  <Briefcase className="text-galf-yellow" /> Espace Corporate
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode('contact')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'contact' ? 'bg-galf-yellow text-galf-carbon' : 'opacity-50 text-white'}`}
                  >
                    Contact
                  </button>
                  <button 
                    onClick={() => setViewMode('devis')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'devis' ? 'bg-galf-yellow text-galf-carbon' : 'opacity-50 text-white'}`}
                  >
                    Devis
                  </button>
                  <button 
                    onClick={() => setViewMode('roi')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'roi' ? 'bg-galf-yellow text-galf-carbon' : 'opacity-50 text-white'}`}
                  >
                    Calculette ROI
                  </button>
                </div>
              </div>

              {submitted ? (
                <div className="text-center p-12 bg-galf-yellow/10 rounded-2xl border border-galf-yellow/30 mt-8">
                  <CheckCircle2 className="w-16 h-16 text-galf-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--galf-text)' }}>Demande Envoyée</h3>
                  <p style={{ color: 'var(--galf-text-secondary)' }}>Notre équipe commerciale vous contactera sous 24h.</p>
                </div>
              ) : viewMode === 'contact' ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ l: "Entreprise", p: "Nom de l'entreprise" }, { l: "Contact", p: "Votre nom" }].map((f, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>{f.l}</label>
                        <input required type="text" placeholder={f.p} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Email professionnel</label>
                    <input required type="email" placeholder="email@entreprise.com" className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Nombre de collaborateurs</label>
                    <select className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle}>
                      <option>1-5</option><option>6-15</option><option>16-30</option><option>30+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Besoin</label>
                    <select className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle}>
                      <option>Devis groupé</option><option>Formation sur site (Intra)</option><option>Partenariat recrutement</option><option>Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Détails</label>
                    <textarea rows={4} placeholder="Précisez engins, calendrier, etc." className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow resize-none" style={inputStyle}></textarea>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                    <Send className="w-5 h-5" /> {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                  </button>
                </form>
              ) : viewMode === 'devis' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-galf-text-muted">Entreprise</label>
                      <input 
                        type="text" placeholder="Ex: SMB SA" value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-galf-yellow" style={inputStyle}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-galf-text-muted">Représentant</label>
                      <input 
                        type="text" placeholder="Ex: M. Bamba" value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-galf-yellow" style={inputStyle}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-galf-text-muted block">Choisir les formations</label>
                    <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                      {GALF_FORMATIONS.filter(f => f.status === 'Actif' && f.price > 100000).map(f => {
                        const isSelected = selectedFormations.includes(f.id)
                        return (
                          <button
                            key={f.id}
                            onClick={() => toggleFormationSelection(f.id)}
                            className={`p-2 rounded-lg text-left text-[11px] font-bold border transition-all ${
                              isSelected ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' : 'bg-galf-bg border-galf-border text-galf-text-secondary hover:border-galf-yellow/30'
                            }`}
                          >
                            <span className="block truncate">{f.name}</span>
                            <span className="opacity-60 font-mono">{(f.pricePromo || f.price).toLocaleString('fr-FR')} F</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 items-center">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-galf-text-muted">
                        <span>Opérateurs</span>
                        <span className="text-galf-yellow font-black">{operatorsCount}</span>
                      </div>
                      <input 
                        type="range" min="1" max="50" value={operatorsCount}
                        onChange={(e) => setOperatorsCount(parseInt(e.target.value))}
                        className="w-full h-1 bg-galf-border rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-galf-text-muted block">Modalité de cours</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setIsIntra(false)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${!isIntra ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-galf-border text-galf-text-secondary'}`}
                        >
                          Centre
                        </button>
                        <button 
                          onClick={() => setIsIntra(true)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${isIntra ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-galf-border text-galf-text-secondary'}`}
                        >
                          Intra (Sur site)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-galf-text-muted block">Options additionnelles</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-galf-text-secondary hover:text-galf-text select-none">
                        <input 
                          type="checkbox" checked={optEnglish} onChange={(e) => setOptEnglish(e.target.checked)}
                          className="rounded border-galf-border bg-galf-bg text-galf-yellow focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Anglais Tech (+150k/op)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-galf-text-secondary hover:text-galf-text select-none">
                        <input 
                          type="checkbox" checked={optAudit} onChange={(e) => setOptAudit(e.target.checked)}
                          className="rounded border-galf-border bg-galf-bg text-galf-yellow focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Audit de Sécurité (+250k)</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/10 space-y-2 text-xs">
                    <div className="flex justify-between text-galf-text-secondary">
                      <span>Coût brut des formations ({selectedFormations.length} sélectionnés) :</span>
                      <span className="font-mono">{rawTotal.toLocaleString('fr-FR')} F</span>
                    </div>
                    {isIntra && (
                      <div className="flex justify-between text-galf-text-secondary">
                        <span>Logistique Intra-Entreprise (+15%) :</span>
                        <span className="font-mono">{modalityExtra.toLocaleString('fr-FR')} F</span>
                      </div>
                    )}
                    {(optEnglish || optAudit) && (
                      <div className="flex justify-between text-galf-text-secondary">
                        <span>Options additionnelles :</span>
                        <span className="font-mono">{(englishExtra + auditExtra).toLocaleString('fr-FR')} F</span>
                      </div>
                    )}
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>Remise groupe B2B (-{discountPercent}%) :</span>
                        <span className="font-mono">-{discountAmount.toLocaleString('fr-FR')} F</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black pt-2 border-t border-galf-border" style={{ color: 'var(--galf-text)' }}>
                      <span>Total HT estimatif :</span>
                      <span className="text-galf-yellow font-mono">{grandTotal.toLocaleString('fr-FR')} F CFA</span>
                    </div>
                  </div>

                  <button 
                    disabled={selectedFormations.length === 0}
                    onClick={handleDownloadB2BQuote} 
                    className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" /> Télécharger mon Devis PDF
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.15em] mb-4">
                    Simulateur de Rentabilité HSE (B2B)
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold uppercase text-white/70">
                        <span>Taille de la flotte d'engins</span>
                        <span className="text-galf-yellow font-black">{fleetSize} machines</span>
                      </div>
                      <input 
                        type="range" min="1" max="50" value={fleetSize}
                        onChange={(e) => setFleetSize(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold uppercase text-white/70">
                        <span>Pannes / Accidents par an (Avant Formation)</span>
                        <span className="text-galf-yellow font-black">{incidentsCount} sinistres</span>
                      </div>
                      <input 
                        type="range" min="1" max="25" value={incidentsCount}
                        onChange={(e) => setIncidentsCount(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>
                  </div>

                  {(() => {
                    const costPerIncident = 1500000 
                    const costTrainingPerOp = 350000 
                    const initialLoss = incidentsCount * costPerIncident
                    const postTrainingLoss = initialLoss * 0.25 
                    const savings = initialLoss - postTrainingLoss
                    const trainingCost = fleetSize * costTrainingPerOp
                    const netRoi = savings - trainingCost
                    const returnRatio = trainingCost > 0 ? (savings / trainingCost).toFixed(1) : '0'

                    return (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs leading-relaxed">
                          <div className="flex justify-between text-white/50">
                            <span>Coût annuel des pannes/accidents :</span>
                            <span className="font-mono text-white">{initialLoss.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-white/50">
                            <span>Réduction des pannes post-formation (75%) :</span>
                            <span className="font-mono text-green-400">-{savings.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-white/50">
                            <span>Coût d'investissement formation GALF :</span>
                            <span className="font-mono text-red-400">-{trainingCost.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-xs font-black pt-2 border-t border-white/5 text-white">
                            <span>Bénéfice Net Première Année :</span>
                            <span className={netRoi >= 0 ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
                              {netRoi.toLocaleString('fr-FR')} F CFA
                            </span>
                          </div>
                        </div>

                        {netRoi > 0 ? (
                          <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-xs font-bold text-green-400 animate-pulse">
                            🎉 Rentabilité de {returnRatio}x l'investissement dès la 1ère année !
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center text-xs font-bold text-white/60">
                            Ajustez les curseurs pour modéliser le retour sur investissement.
                          </div>
                        )}

                        <a 
                          href="https://wa.me/2250711826507" 
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-xl text-center hover:brightness-110 transition-all block text-xs uppercase tracking-widest shadow-xl shadow-galf-yellow/10"
                        >
                          Demander un Audit HSE sur Site
                        </a>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* ═══════════════════════════════════════════════
            NEW: B2B ANNUAL TRAINING PLANNER CALENDAR
           ═══════════════════════════════════════════════ */}
        <FadeIn delay={0.35}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            <h2 className="text-3xl font-black mb-2 text-white flex items-center gap-3">
              <Calendar className="text-galf-yellow w-7 h-7" /> Planificateur Annuel de Formations B2B
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-8 leading-relaxed">
              Réservez à l'avance des sessions prioritaires sur notre calendrier annuel pour garantir la disponibilité de nos instructeurs et engins.
            </p>

            {plannerSubmitted ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-black mb-2 text-white">Réservation Transmise</h3>
                <p className="text-xs text-white/50">Nos équipes étudient votre calendrier pour vous proposer un planning définitif ferme sous 48h.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-6">
                  {quarters.map(q => (
                    <div key={q.id} className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-galf-yellow pb-2 border-b border-white/5">
                        {q.label}
                      </div>
                      <div className="space-y-2">
                        {machines.map(m => {
                          const slotId = `${q.id}-${m.name}`
                          const isReserved = reservedSlots.includes(slotId)
                          return (
                            <button
                              key={m.name}
                              onClick={() => togglePlannerSlot(slotId)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center gap-2 ${
                                isReserved 
                                  ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                                  : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10'
                              }`}
                            >
                              <span>{m.icon}</span>
                              <span className="truncate">{m.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 gap-4">
                  <div className="text-xs font-bold text-white/60">
                    SESSIONS SÉLECTIONNÉES : <span className="text-galf-yellow font-black">{reservedSlots.length} sessions</span>
                  </div>
                  <button
                    disabled={reservedSlots.length === 0}
                    onClick={handleBookPlanner}
                    className="bg-galf-yellow text-galf-carbon px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-galf-yellow/10"
                  >
                    Valider le calendrier prévisionnel
                  </button>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Feature 9: Interactive Company Fleet Optimizer */}
        <FadeIn delay={0.4}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            <h2 className="text-3xl font-black mb-2 text-white flex items-center gap-3">
              <Calculator className="text-galf-yellow w-7 h-7" /> Optimisateur de Flotte & Risques Pannes
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-8 leading-relaxed font-sans">
              Modélisez la composition de votre parc de machines de chantier pour obtenir une recommandation d'effectif qualifié et estimer la réduction des pannes.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                <h4 className="text-xs font-black uppercase text-galf-yellow tracking-widest mb-4 font-sans">Composition de la Flotte</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Pelles Hydrauliques</span>
                      <span className="text-white font-mono font-bold">{fleetPelles}</span>
                    </div>
                    <input
                      type="range" min="0" max="20" value={fleetPelles}
                      onChange={(e) => setFleetPelles(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Grues à Tour / Mobiles</span>
                      <span className="text-white font-mono font-bold">{fleetGrues}</span>
                    </div>
                    <input
                      type="range" min="0" max="15" value={fleetGrues}
                      onChange={(e) => setFleetGrues(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Bulldozers / Tombereaux</span>
                      <span className="text-white font-mono font-bold">{fleetBulldozers}</span>
                    </div>
                    <input
                      type="range" min="0" max="25" value={fleetBulldozers}
                      onChange={(e) => setFleetBulldozers(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-galf-yellow tracking-widest mb-4 font-sans">Opérateurs à Retraîner</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed font-sans mb-4">
                    Nombre conseillé d'opérateurs à certifier ou recycler par an pour maintenir un taux de pannes de flotte minimal (idéalement 1.2 opérateur par machine).
                  </p>
                </div>
                
                <div className="text-center py-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-4xl font-black text-white font-mono">{Math.round((fleetPelles + fleetGrues + fleetBulldozers) * 1.2)}</div>
                  <div className="text-[9px] uppercase font-bold text-galf-text-secondary mt-1 tracking-widest">Opérateurs / an recommandés</div>
                </div>
              </div>

              <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-galf-yellow tracking-widest mb-4 font-sans">Performance Flotte</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed font-sans mb-4">
                    Impact estimé sur le taux d'usure mécanique et la durée de vie moyenne de vos engins lourds.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/60">Taux de Pannes Évité :</span>
                    <span className="text-green-400 font-bold font-mono">-{Math.round((fleetPelles*2 + fleetGrues*3 + fleetBulldozers*1.5) * 1.5)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Gain Durée de Vie Engins :</span>
                    <span className="text-green-400 font-bold font-mono">+{Math.round((fleetPelles + fleetGrues + fleetBulldozers) > 0 ? 3.5 : 0)} ans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Feature 11: Corporate Sponsor Wall */}
        <FadeIn delay={0.45}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16">
            <h2 className="text-3xl font-black mb-2 text-white text-center">
              Nos Partenaires de Recrutement B2B
            </h2>
            <p className="text-sm text-white/60 text-center max-w-xl mx-auto mb-10 leading-relaxed font-sans">
              Ils font confiance à l'excellence GALF FORMATION pour équiper leurs chantiers d'Afrique de l'Ouest.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: "Bouygues Bâtiment", logo: "🏢 BOUYGUES", trained: 42, hired: 35, placement: "83%" },
                { name: "Colas Afrique", logo: "🥾 COLAS", trained: 58, hired: 52, placement: "89%" },
                { name: "Razel-Bec", logo: "🏗️ RAZEL", trained: 31, hired: 28, placement: "90%" },
                { name: "Vinci Construction", logo: "⚡ VINCI", trained: 47, hired: 41, placement: "87%" },
                { name: "Eiffage Infrastructure", logo: "🚜 EIFFAGE", trained: 25, hired: 22, placement: "88%" }
              ].map((partner, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/5 bg-black/40 hover:border-galf-yellow/40 transition-all text-center relative group cursor-pointer animate-fadeIn"
                >
                  <div className="text-xs font-black text-white/80 py-4 font-sans tracking-wider">{partner.logo}</div>
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 border border-white/10 text-white rounded-xl p-4 text-[10px] w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-30 font-sans text-left leading-relaxed">
                    <div className="font-black text-xs text-galf-yellow mb-1.5">{partner.name}</div>
                    <div>Collaborateurs formés : <strong>{partner.trained}</strong></div>
                    <div>Diplômés embauchés : <strong>{partner.hired}</strong></div>
                    <div>Taux d'insertion : <strong>{partner.placement}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Recruitment Teaser */}
        <FadeIn delay={0.4}>
          <div className="p-12 rounded-[2.5rem] relative overflow-hidden glass-card border-galf-yellow/20 border-galf-border">
             <div className="absolute top-0 right-0 w-[40%] h-full bg-galf-yellow/5 skew-x-12 translate-x-32" />
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-galf-yellow/10 border border-galf-yellow/30 rounded-full text-galf-yellow text-[10px] font-black uppercase tracking-widest mb-6">
                      <Star className="w-3 h-3 fill-current" /> Sourcing de Talents
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                      Recrutez l'élite du <span className="text-galf-yellow">BTP ivoirien</span>
                   </h2>
                   <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
                      Accédez à notre base de données d'apprenants certifiés. Filtrez par engin, niveau d'expérience et disponibilité pour vos chantiers stratégiques.
                   </p>
                   <ul className="space-y-4 mb-10">
                      {[ 
                        "Vérification instantanée des certificats GALF", 
                        "Accès aux notes de conduite technique (Théorie & Pratique)", 
                        "Contact direct avec les meilleurs profils de chaque promo"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold text-sm" style={{ color: 'var(--galf-text)' }}>
                           <CheckCircle2 className="w-5 h-5 text-galf-yellow" /> {item}
                        </li>
                      ))}
                   </ul>
                   <Link href="/entreprise/recrutement" className="bg-slate-900 dark:bg-white text-white dark:text-galf-carbon hover:bg-galf-yellow dark:hover:bg-galf-yellow px-12 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shrink-0">
                      Accéder au Hub Recruteur <ArrowRight className="w-5 h-5" />
                   </Link>
                </div>

                <div className="relative group">
                   <div className="glass-card p-6 rounded-2xl border-white/5 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700 bg-galf-carbon/80 backdrop-blur-md">
                      <div className="flex items-center justify-between mb-8">
                         <div className="text-xs font-black uppercase tracking-widest text-galf-text-muted">Candidats certifiés dispo.</div>
                         <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full bg-galf-yellow/20 border-2" style={{ borderColor: 'var(--galf-border)' }} />
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         {[
                           { name: "Yao Anderson", job: "Opérateur Pelle", score: "18.5/20", tag: "Expert" },
                           { name: "Diarra Moussa", job: "Grutier à Tour", score: "17.0/20", tag: "Confirmé" },
                           { name: "Koné Fatou", job: "Conductrice Bulldozer", score: "19.0/20", tag: "Major Promo" },
                         ].map((c, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-white/5 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-lg bg-galf-yellow flex items-center justify-center font-black text-galf-carbon">{c.name[0]}</div>
                                 <div>
                                    <div className="text-sm font-black text-white">{c.name}</div>
                                    <div className="text-[10px] font-bold text-galf-yellow uppercase">{c.job}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-xs font-black text-white">{c.score}</div>
                                 <span className="text-[8px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/60">{c.tag}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/5 text-center">
                         <span className="text-[10px] font-bold text-galf-text-muted uppercase tracking-[0.2em]">+ 128 autres candidats disponibles</span>
                      </div>
                   </div>
                   <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-galf-yellow rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <TrendingUp className="w-10 h-10 text-galf-carbon" />
                   </div>
                </div>
             </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
import Link from 'next/link'
