"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import Link from 'next/link'
import gsap from 'gsap'
import { 
  Briefcase, Users, FileText, Send, TrendingUp, CheckCircle2, Shield, Star, Calculator, Download, Calendar, Search, Upload, 
  FileSpreadsheet, AlertTriangle, Check, MapPin, ShieldAlert
} from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GALF_FORMATIONS } from '@/lib/data'
import { jsPDF } from 'jspdf'


// Graduate database for Recruiting Express matching (Extended with CACES & Experience)
const GRADUATES_DB = [
  { id: 1, machine: "Pelle Hydraulique", exp: "Expert", name: "Opérateur GP-902", score: "19.2/20", city: "Abidjan", skills: "Terrassement complexe, talutage précis, sécurité HSE", status: "Disponible", yearsExp: 7, caces: "R482 Cat A" },
  { id: 2, machine: "Pelle Hydraulique", exp: "Confirmé", name: "Opérateur GP-405", score: "17.5/20", city: "San Pedro", skills: "Excavation de tranchées, nivellement", status: "Disponible", yearsExp: 4, caces: "R482 Cat A" },
  { id: 3, machine: "Pelle Hydraulique", exp: "Débutant", name: "Opérateur GP-102", score: "15.0/20", city: "Abidjan", skills: "Manœuvres de base, chargement de camions", status: "Disponible", yearsExp: 1, caces: "R482 Cat A" },
  { id: 4, machine: "Grue à Tour", exp: "Expert", name: "Opérateur GT-801", score: "18.8/20", city: "Abidjan", skills: "Grue de grande hauteur, élingage complexe, vents forts", status: "Disponible", yearsExp: 8, caces: "R483 Cat B" },
  { id: 5, machine: "Grue à Tour", exp: "Confirmé", name: "Opérateur GT-330", score: "16.9/20", city: "San Pedro", skills: "Levage standard, contrôle des charges", status: "Disponible", yearsExp: 3, caces: "R483 Cat B" },
  { id: 6, machine: "Bulldozer D6", exp: "Expert", name: "Opérateur BD-702", score: "19.5/20", city: "San Pedro", skills: "Terrassement de masse, ouverture de pistes minières", status: "Disponible", yearsExp: 10, caces: "R482 Cat C" },
  { id: 7, machine: "Bulldozer D6", exp: "Confirmé", name: "Opérateur BD-224", score: "17.0/20", city: "Abidjan", skills: "Régalage de matériaux, pousse standard", status: "Disponible", yearsExp: 4, caces: "R482 Cat C" },
  { id: 8, machine: "Chariot Élévateur", exp: "Confirmé", name: "Opérateur CE-509", score: "16.8/20", city: "Yamoussoukro", skills: "Gerbage grande hauteur, chargement racks", status: "Disponible", yearsExp: 3, caces: "R489 Cat 3" },
]

// Mock operators data for fleet validation
const MOCK_FLEET_COMPLIANCE = [
  { name: "Kouamé N'guessan", machine: "Pelle Hydraulique", certificate: "CACES-R482-A", status: "Valide", date: "2029-04-12" },
  { name: "Diarra Moussa", machine: "Grue à Tour", certificate: "CACES-R483-B", status: "Attention", date: "2026-07-15" },
  { name: "Koné Fatou", machine: "Bulldozer D6", certificate: "CACES-R482-C", status: "Valide", date: "2028-11-20" },
  { name: "Koffi Gnamien", machine: "Chariot Élévateur", certificate: "Expiré ou inexistant", status: "Expiré", date: "Expiré" },
  { name: "Sidiki Diallo", machine: "Grue Mobile", certificate: "CACES-R483-C", status: "Valide", date: "2030-01-10" }
]

export default function EntreprisePortal() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(card, {
      rotateY: x * 0.05,
      rotateX: -y * 0.05,
      transformPerspective: 1000,
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

  // ROI Calculator states (Extended for Wave 4)
  const [fleetSize, setFleetSize] = useState(10)
  const [incidentsCount, setIncidentsCount] = useState(5)
  const [fuelPerDay, setFuelPerDay] = useState(80) // Liters per day per machine
  const [maintPerYear, setMaintPerYear] = useState(1200000) // FCFA per machine per year

  // Matching Recrutement Express states (Extended for F16)
  const [recruitMachine, setRecruitMachine] = useState("Pelle Hydraulique")
  const [recruitExp, setRecruitExp] = useState("Expert")
  const [recruitCity, setRecruitCity] = useState("Abidjan")
  const [recruitCaces, setRecruitCaces] = useState("Tous")
  const [recruitMinYears, setRecruitMinYears] = useState("Tous")
  const [isSearchingRecruit, setIsSearchingRecruit] = useState(false)
  const [searchedRecruits, setSearchedRecruits] = useState<typeof GRADUATES_DB | null>(null)
  const [recruitContactMessage, setRecruitContactMessage] = useState("")

  // F17: B2B Job Board Publisher States
  const [publishedJobs, setPublishedJobs] = useState<any[]>([
    { id: 'JOB-901', title: 'Opérateur Pelle Hydraulique Sénior', type: 'CDI', location: 'San Pedro', caces: 'R482 Cat A', salary: '450 000 F', description: 'Recherche conducteur de pelle certifié pour excavation en carrière minière.' },
    { id: 'JOB-902', title: 'Conducteur de Bulldozer D6', type: 'CDD', location: 'Abidjan', caces: 'R482 Cat C', salary: '380 000 F', description: 'Mission temporaire de régalage, nivellement et ouverture de pistes BTP.' }
  ])
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newJobType, setNewJobType] = useState('CDI')
  const [newJobLocation, setNewJobLocation] = useState('Abidjan')
  const [newJobCaces, setNewJobCaces] = useState('R482 Cat A')
  const [newJobSalary, setNewJobSalary] = useState('')
  const [newJobDesc, setNewJobDesc] = useState('')

  // F18: Temporary Operator Booking states
  const [bookingDate, setBookingDate] = useState('2026-06-20')
  const [bookingHours, setBookingHours] = useState<string[]>([])
  const [bookingOperatorsCount, setBookingOperatorsCount] = useState(1)
  const [bookingMachineType, setBookingMachineType] = useState('Pelle Hydraulique')
  const [bookingSubmitted, setBookingSubmitted] = useState(false)

  // F19: Virtual Tour Map states
  const [selectedMapHotspot, setSelectedMapHotspot] = useState<string | null>(null)

  // F20: Heavy Machine Spec Comparer states
  const [machineA, setMachineA] = useState('pelle_cat_320')
  const [machineB, setMachineB] = useState('bulldozer_d6')

  // Fleet Checker CSV states
  const [uploadedFleet, setUploadedFleet] = useState<typeof MOCK_FLEET_COMPLIANCE | null>(null)
  const [isUploadingFleet, setIsUploadingFleet] = useState(false)

  // Site Safety Audit Booking states
  const [auditLocation, setAuditLocation] = useState("")
  const [auditType, setAuditType] = useState("Chantier BTP")
  const [auditDate, setAuditDate] = useState("2026-06-25")
  const [auditPhone, setAuditPhone] = useState("")
  const [auditScheduled, setAuditScheduled] = useState(false)
  const [auditId, setAuditId] = useState("")

  // Fleet Optimizer states
  const [fleetPelles, setFleetPelles] = useState(5)
  const [fleetGrues, setFleetGrues] = useState(3)
  const [fleetBulldozers, setFleetBulldozers] = useState(4)

  // B2B Annual Planner State
  const [reservedSlots, setReservedSlots] = useState<string[]>([])
  const [plannerSubmitted, setPlannerSubmitted] = useState(false)

  // F19: Lookups for Virtual Tour
  const activeZoneInfo = selectedMapHotspot ? ({
    zone_a: {
      title: "Zone A - Excavation & Terrassement",
      activity: "Excavation de tranchées profondes, blindage de fouilles et chargement de camions bennes.",
      machines: "Pelle Hydraulique Caterpillar 320D, Tombereau Articulé.",
      danger: "Risques d'éboulement de parois (Blindage obligatoire) et angles morts engins.",
      instructor: "M. Koffi (Ingénieur Travaux)"
    },
    zone_b: {
      title: "Zone B - Levage & Élingage",
      activity: "Manœuvres de levage de charges de précision avec vents latéraux de simulation.",
      machines: "Grue à Tour Potain MCT 88, Grue Mobile Grove.",
      danger: "Rupture d'élingue, mauvaise répartition des charges, vent supérieur à 50km/h.",
      instructor: "M. Diallo (Spécialiste Levage)"
    },
    zone_c: {
      title: "Zone C - Piste d'Évolution Bulldozer",
      activity: "Ouverture de pistes minières en côte, nivellement de précision et régalage.",
      machines: "Bulldozer Komatsu D65EX, Compacteur à rouleau vibrant.",
      danger: "Renversement sur talus, collision arrière.",
      instructor: "M. Konan (Expert Nivellement)"
    },
    zone_d: {
      title: "Zone D - Aire d'Entraînement HSE & EPI",
      activity: "Sensibilisation aux consignes de sécurité, exercices incendie et vérification des EPI.",
      machines: "Simulateurs d'atmosphère confinée, portiques de travail en hauteur.",
      danger: "Travail en hauteur non assuré (Harnais obligatoire).",
      instructor: "Mme N'Guessan (Auditeur HSE)"
    }
  } as any)[selectedMapHotspot] : null

  // F20: Specs Comparer helper
  const getMachineSpecs = (key: string) => {
    const specs = {
      pelle_cat_320: { name: "Pelle Caterpillar 320", power: "148 ch", weight: "22 tonnes", capacity: "1.2 m\u00b3", caces: "R482 Cat\u00e9gorie B1", speed: "5.5 km/h" },
      bulldozer_d6: { name: "Bulldozer Komatsu D65", power: "220 ch", weight: "21.5 tonnes", capacity: "5.6 m\u00b3 (Lame)", caces: "R482 Cat\u00e9gorie C1", speed: "11 km/h" },
      grue_potain: { name: "Grue \u00e0 Tour Potain MCT 88", power: "75 ch", weight: "40 tonnes (lest\u00e9e)", capacity: "5 tonnes max", caces: "R483 Cat\u00e9gorie R483", speed: "Vitesse variable" },
      chariot_toyota: { name: "Chariot \u00c9l\u00e9vateur Toyota 8FDF30", power: "55 ch", weight: "4.7 tonnes", capacity: "3 tonnes", caces: "R489 Cat\u00e9gorie 3", speed: "19 km/h" }
    } as any
    return specs[key]
  }

  const specA = getMachineSpecs(machineA)
  const specB = getMachineSpecs(machineB)

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
              <div 
                key={i} 
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="glass-card p-6 rounded-xl hover:border-galf-yellow/30 transition-colors border-galf-border transform-gpu"
              >
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
                <div 
                  key={i} 
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="glass-card p-6 rounded-xl flex gap-4 hover:border-galf-yellow/30 transition-colors border-galf-border transform-gpu"
                >
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
            <div 
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="glass-card p-8 rounded-xl relative overflow-hidden border border-galf-yellow/20 transform-gpu"
            >
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
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Entreprise</label>
                      <input required type="text" placeholder="Nom de l'entreprise" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Contact</label>
                      <input required type="text" placeholder="Votre nom" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Email professionnel</label>
                    <input required type="email" placeholder="email@entreprise.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
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
                    Simulateur de ROI de Formation (Maintenance & Carburant)
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

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold uppercase text-white/70">
                        <span>Consommation de carburant par machine / jour</span>
                        <span className="text-galf-yellow font-black">{fuelPerDay} Litres</span>
                      </div>
                      <input 
                        type="range" min="20" max="250" step="5" value={fuelPerDay}
                        onChange={(e) => setFuelPerDay(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold uppercase text-white/70">
                        <span>Budget Maintenance annuel moyen / machine</span>
                        <span className="text-galf-yellow font-black">{(maintPerYear).toLocaleString('fr-FR')} F</span>
                      </div>
                      <input 
                        type="range" min="300000" max="3000000" step="100000" value={maintPerYear}
                        onChange={(e) => setMaintPerYear(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                      />
                    </div>
                  </div>

                  {(() => {
                    // Cost calculations
                    const costPerIncident = 1500000 
                    const costTrainingPerOp = 350000 
                    
                    // Fuel: 300 operating days per year, 850 FCFA per liter of diesel
                    const dieselPrice = 850
                    const annualFuelCost = fleetSize * fuelPerDay * 300 * dieselPrice
                    const fuelSavings = Math.round(annualFuelCost * 0.15) // Eco-driving saves 15%

                    // Maintenance: 30% reduction in wear and tear
                    const totalMaintCost = fleetSize * maintPerYear
                    const maintSavings = Math.round(totalMaintCost * 0.30)

                    // Accidents: 75% reduction
                    const initialAccidentLoss = incidentsCount * costPerIncident
                    const accidentSavings = Math.round(initialAccidentLoss * 0.75)

                    const totalSavings = fuelSavings + maintSavings + accidentSavings
                    const trainingCost = fleetSize * costTrainingPerOp
                    const netRoi = totalSavings - trainingCost
                    const returnRatio = trainingCost > 0 ? (totalSavings / trainingCost).toFixed(1) : '0'

                    return (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs leading-relaxed">
                          <div className="flex justify-between text-white/50">
                            <span>Économie Carburant estimée (Éco-conduite -15%) :</span>
                            <span className="font-mono text-green-400">+{fuelSavings.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-white/50">
                            <span>Économie Maintenance (Usure évitée -30%) :</span>
                            <span className="font-mono text-green-400">+{maintSavings.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-white/50">
                            <span>Sinistralité Évitée (Accidents -75%) :</span>
                            <span className="font-mono text-green-400">+{accidentSavings.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-white/50 pt-1 border-t border-white/5">
                            <span>Investissement Formation GALF ({fleetSize} op.) :</span>
                            <span className="font-mono text-red-400">-{trainingCost.toLocaleString('fr-FR')} F</span>
                          </div>
                          <div className="flex justify-between text-xs font-black pt-2 border-t border-white/5 text-white">
                            <span>Bénéfice Net Global (An 1) :</span>
                            <span className={netRoi >= 0 ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
                              {netRoi.toLocaleString('fr-FR')} F CFA
                            </span>
                          </div>
                        </div>

                        {netRoi > 0 ? (
                          <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-xs font-bold text-green-400 animate-pulse">
                            🎉 Rentabilité nette de {returnRatio}x l'investissement formation !
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center text-xs font-bold text-white/60">
                            Ajustez les curseurs pour modéliser le retour sur investissement.
                          </div>
                        )}

                        <Link 
                          href="/entreprise/calculateur-roi"
                          className="w-full border border-galf-yellow text-galf-yellow hover:bg-galf-yellow/15 font-black py-4 rounded-xl text-center transition-all block text-xs uppercase tracking-widest text-center"
                        >
                          Simulateur Complet & Audit PDF →
                        </Link>

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

        {/* F18: B2B Operator Hourly Booking Calendar */}
        <FadeIn delay={0.38}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            <h2 className="text-3xl font-black mb-2 text-white flex items-center gap-3">
              <Users className="text-galf-yellow w-7 h-7" /> Réservation d'Opérateurs Temporaires
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-8 leading-relaxed font-sans">
              Besoin d'un opérateur qualifié en urgence ? Réservez des créneaux horaires d'opérateurs certifiés (CACES) avec engin fourni ou non.
            </p>

            {bookingSubmitted ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-black mb-2 text-white font-sans">Réservation Temporaire Validée</h3>
                <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
                  Votre demande a été attribuée à nos conducteurs disponibles pour le {new Date(bookingDate).toLocaleDateString('fr-FR')}. Un SMS de confirmation vous a été envoyé.
                </p>
                <button 
                  onClick={() => { setBookingSubmitted(false); setBookingHours([]); }}
                  className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Nouvelle Réservation
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 text-xs">
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Type de Machine d'Exploitation</label>
                    <select
                      value={bookingMachineType}
                      onChange={e => setBookingMachineType(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                      style={{ colorScheme: 'light dark' }}
                    >
                      <option>Pelle Hydraulique</option>
                      <option>Grue à Tour</option>
                      <option>Bulldozer D6</option>
                      <option>Chariot Élévateur</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Date d'Affectation</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-galf-yellow"
                        style={{ colorScheme: 'light dark' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Conducteurs requis</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={bookingOperatorsCount}
                        onChange={e => setBookingOperatorsCount(parseInt(e.target.value))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                      />
                    </div>
                  </div>

                  <button
                    disabled={bookingHours.length === 0}
                    onClick={() => setBookingSubmitted(true)}
                    className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    Confirmer la réservation temporaire
                  </button>
                </div>

                {/* Hour Slots Calendar Grid */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-galf-text-muted">Sélectionnez les Créneaux Horaires (Tarif : 10 000 F / heure)</span>
                    <span className="text-[9px] font-bold text-galf-yellow bg-galf-yellow/10 px-2 py-0.5 rounded border border-galf-yellow/20">Planning horaire</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      '08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00',
                      '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'
                    ].map(slot => {
                      const isSelected = bookingHours.includes(slot)
                      return (
                        <button
                          key={slot}
                          onClick={() => {
                            setBookingHours(prev => 
                              prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
                            )
                          }}
                          className={`p-4 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow shadow-md' 
                              : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <div className="font-mono text-xs">{slot}</div>
                          <div className="text-[8px] opacity-65 uppercase font-black mt-1">Disponible</div>
                        </button>
                      )
                    })}
                  </div>

                  {bookingHours.length > 0 && (
                    <div className="p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/10 text-xs flex justify-between items-center text-white">
                      <div>
                        <div>Nombre d'heures sélectionnées : <strong>{bookingHours.length * 2}h</strong></div>
                        <div className="text-[10px] text-white/50">Conducteurs demandés : {bookingOperatorsCount} · Machine : {bookingMachineType}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-white/40 block">Coût total estimé HT</span>
                        <span className="text-galf-yellow font-black font-mono">{(bookingHours.length * 2 * 10000 * bookingOperatorsCount).toLocaleString('fr-FR')} F CFA</span>
                      </div>
                    </div>
                  )}
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
              {/* ═══════════════════════════════════════════════
            NEW: MATCHING RECRUTEMENT EXPRESS (F16)
           ═══════════════════════════════════════════════ */}
        <FadeIn delay={0.4}>
          <div className="p-12 rounded-[2.5rem] relative overflow-hidden glass-card border-galf-yellow/20 border-galf-border mb-16 text-left">
             <div className="absolute top-0 right-0 w-[40%] h-full bg-galf-yellow/5 skew-x-12 translate-x-32" />
             <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-5 text-left">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-galf-yellow/10 border border-galf-yellow/30 rounded-full text-galf-yellow text-[10px] font-black uppercase tracking-widest mb-6">
                      <Star className="w-3 h-3 fill-current" /> Recrutement Express
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter text-white">
                      Trouvez le candidat <span className="text-galf-yellow">idéal</span>
                   </h2>
                   <p className="text-xs text-white/60 mb-6 leading-relaxed">
                      Filtrez notre base de données de diplômés certifiés par type d'engin, catégorie de CACES exact, années d'expérience et localisation pour sourcer instantanément des profils qualifiés.
                   </p>
                   
                   <div className="space-y-4 text-xs">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Engin Ciblé</label>
                         <select 
                           value={recruitMachine} 
                           onChange={(e) => setRecruitMachine(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                           style={{ colorScheme: 'light dark' }}
                         >
                           <option>Pelle Hydraulique</option>
                           <option>Grue à Tour</option>
                           <option>Bulldozer D6</option>
                           <option>Chariot Élévateur</option>
                         </select>
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Catégorie CACES</label>
                         <select 
                           value={recruitCaces} 
                           onChange={(e) => setRecruitCaces(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                           style={{ colorScheme: 'light dark' }}
                         >
                           <option value="Tous">Tous les CACES</option>
                           <option value="R482 Cat A">R482 Catégorie A</option>
                           <option value="R482 Cat C">R482 Catégorie C</option>
                           <option value="R483 Cat B">R483 Catégorie B</option>
                           <option value="R489 Cat 3">R489 Catégorie 3</option>
                         </select>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Expérience</label>
                         <select 
                           value={recruitExp} 
                           onChange={(e) => setRecruitExp(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                           style={{ colorScheme: 'light dark' }}
                         >
                           <option value="Tous">Tous les niveaux</option>
                           <option>Expert</option>
                           <option>Confirmé</option>
                           <option>Débutant</option>
                         </select>
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Années d'Exp. Min</label>
                         <select 
                           value={recruitMinYears} 
                           onChange={(e) => setRecruitMinYears(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                           style={{ colorScheme: 'light dark' }}
                         >
                           <option value="Tous">Tous</option>
                           <option value="1">1+ an</option>
                           <option value="3">3+ ans</option>
                           <option value="5">5+ ans</option>
                           <option value="8">8+ ans</option>
                         </select>
                       </div>
                     </div>
                     
                     <div className="space-y-1">
                       <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Lieu d'Affectation</label>
                       <select 
                         value={recruitCity} 
                         onChange={(e) => setRecruitCity(e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                         style={{ colorScheme: 'light dark' }}
                       >
                         <option value="Tous">Toutes les villes</option>
                         <option>Abidjan</option>
                         <option>San Pedro</option>
                         <option>Yamoussoukro</option>
                       </select>
                     </div>

                     <button
                       onClick={() => {
                         setIsSearchingRecruit(true);
                         setSearchedRecruits(null);
                         setTimeout(() => {
                           const res = GRADUATES_DB.filter(g => {
                             const matchMachine = g.machine === recruitMachine;
                             const matchExp = recruitExp === "Tous" || g.exp === recruitExp;
                             const matchCity = recruitCity === "Tous" || g.city === recruitCity;
                             const matchCaces = recruitCaces === "Tous" || g.caces === recruitCaces;
                             
                             let matchYears = true;
                             if (recruitMinYears !== "Tous") {
                               const min = parseInt(recruitMinYears);
                               matchYears = g.yearsExp >= min;
                             }
                             
                             return matchMachine && matchExp && matchCity && matchCaces && matchYears;
                           });
                           setSearchedRecruits(res);
                           setIsSearchingRecruit(false);
                         }, 800);
                       }}
                       className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                     >
                       <Search className="w-4 h-4" /> Rechercher les profils dispo.
                     </button>
                   </div>
                </div>

                <div className="lg:col-span-7 text-left">
                   <div className="glass-card p-6 rounded-2xl border-white/5 shadow-2xl bg-galf-carbon/80 backdrop-blur-md min-h-[280px] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                            <div className="text-xs font-black uppercase tracking-widest text-galf-text-muted">Profils correspondants</div>
                            <div className="text-[9px] font-bold text-galf-yellow px-2 py-0.5 bg-galf-yellow/10 rounded border border-galf-yellow/20">
                              Base Active
                            </div>
                        </div>

                        {isSearchingRecruit ? (
                          <div className="py-16 text-center space-y-3">
                            <Upload className="w-8 h-8 text-galf-yellow animate-spin mx-auto" />
                            <span className="text-xs text-white/50 block font-sans">Indexation de la base de données apprenants...</span>
                          </div>
                        ) : searchedRecruits === null ? (
                          <div className="py-12 text-center text-white/40 space-y-2">
                            <Users className="w-10 h-10 mx-auto opacity-35" />
                            <div className="text-xs font-bold font-sans">Prêt à rechercher</div>
                            <p className="text-[10px] text-white/30 max-w-xs mx-auto leading-relaxed">
                              Sélectionnez vos critères à gauche et cliquez sur Rechercher pour simuler le sourcing d'opérateurs certifiés.
                            </p>
                          </div>
                        ) : searchedRecruits.length === 0 ? (
                          <div className="py-12 text-center text-white/40 space-y-2">
                            <AlertTriangle className="w-10 h-10 mx-auto text-galf-yellow opacity-75" />
                            <div className="text-xs font-bold font-sans text-white">Aucun profil exact disponible</div>
                            <p className="text-[10px] text-white/30 max-w-xs mx-auto leading-relaxed">
                              Il n'y a pas de diplômé correspondant disponible immédiatement. Modifiez vos critères de recherche.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                             {searchedRecruits.map((c) => (
                               <div key={c.id} className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                 <div>
                                   <div className="flex items-center gap-2">
                                     <span className="font-black text-white">{c.name}</span>
                                     <span className="text-[8px] font-black uppercase bg-galf-yellow/20 text-galf-carbon px-1.5 py-0.5 rounded">{c.caces}</span>
                                     <span className="text-[8px] font-black uppercase bg-white/10 text-white/60 px-1.5 py-0.5 rounded">{c.yearsExp} ans exp</span>
                                     <span className="text-[8px] font-black uppercase bg-white/10 text-white/60 px-1.5 py-0.5 rounded">{c.city}</span>
                                   </div>
                                   <div className="text-[10px] text-white/50 mt-1 font-sans">
                                     Points forts : <strong>{c.skills}</strong>
                                   </div>
                                 </div>
                                 <div className="flex items-center gap-3 shrink-0">
                                   <div className="text-right">
                                     <div className="font-mono font-black text-galf-yellow text-sm">{c.score}</div>
                                     <div className="text-[8px] text-white/40 font-bold uppercase">Moyenne Examen</div>
                                   </div>
                                   <button 
                                     onClick={() => setRecruitContactMessage(`Demande d'entretien initiée pour le profil anonyme ${c.name} (${c.machine}). Nos conseillers B2B vont vous recontacter par téléphone.`)}
                                     className="bg-galf-yellow hover:brightness-110 text-galf-carbon px-3 py-2 rounded-lg font-black text-[10px] uppercase transition-all"
                                   >
                                     Recruter
                                   </button>
                                 </div>
                                </div>
                             ))}
                          </div>
                        )}
                      </div>

                      {recruitContactMessage && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-[10px] font-bold leading-relaxed animate-fadeIn flex items-center justify-between gap-2">
                          <span>{recruitContactMessage}</span>
                          <button onClick={() => setRecruitContactMessage("")} className="text-white hover:text-galf-yellow">✕</button>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-white/5 text-center shrink-0">
                         <span className="text-[9px] font-bold text-galf-text-muted uppercase tracking-[0.2em]">+ 128 autres opérateurs certifiés recensés en base active</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </FadeIn>

        {/* ═══════════════════════════════════════════════
            NEW: B2B JOB BOARD PUBLISHER FORM (F17)
           ═══════════════════════════════════════════════ */}
        <FadeIn delay={0.42}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
            <h2 className="text-3xl font-black mb-2 text-white flex items-center gap-3">
              <Briefcase className="text-galf-yellow w-7 h-7" /> Publier une Offre d'Emploi (Réseau GALF)
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-8 leading-relaxed font-sans">
              Rédigez et diffusez vos offres de recrutement à destination des diplômés certifiés de nos promotions.
            </p>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newJobTitle || !newJobSalary || !newJobDesc) return;
                  const newJob = {
                    id: `JOB-${Math.floor(903 + Math.random() * 900)}`,
                    title: newJobTitle,
                    type: newJobType,
                    location: newJobLocation,
                    caces: newJobCaces,
                    salary: newJobSalary,
                    description: newJobDesc,
                    applicants: 0
                  };
                  setPublishedJobs(prev => [newJob, ...prev]);
                  setNewJobTitle('');
                  setNewJobSalary('');
                  setNewJobDesc('');
                  alert("Votre offre d'emploi a été publiée sur la console de nos diplômés !");
                }}
                className="lg:col-span-5 space-y-4 text-xs bg-black/20 p-6 rounded-2xl border border-white/5"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Intitulé du Poste *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Grutier de Chantier senior"
                    value={newJobTitle}
                    onChange={e => setNewJobTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-galf-yellow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Type de contrat</label>
                    <select
                      value={newJobType}
                      onChange={e => setNewJobType(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-galf-yellow"
                      style={{ colorScheme: 'light dark' }}
                    >
                      <option>CDI</option>
                      <option>CDD</option>
                      <option>Intérim</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Lieu</label>
                    <select
                      value={newJobLocation}
                      onChange={e => setNewJobLocation(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-galf-yellow"
                      style={{ colorScheme: 'light dark' }}
                    >
                      <option>Abidjan</option>
                      <option>San Pedro</option>
                      <option>Yamoussoukro</option>
                      <option>Bouaké</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">CACES Requis</label>
                    <select
                      value={newJobCaces}
                      onChange={e => setNewJobCaces(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-galf-yellow"
                      style={{ colorScheme: 'light dark' }}
                    >
                      <option>R482 Cat A</option>
                      <option>R482 Cat B</option>
                      <option>R482 Cat C</option>
                      <option>R483 Cat B</option>
                      <option>R489 Cat 3</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Salaire Mensuel Estimé *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 350 000 F CFA"
                      value={newJobSalary}
                      onChange={e => setNewJobSalary(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Description des Missions *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Détails du poste, type d'engin, contraintes..."
                    value={newJobDesc}
                    onChange={e => setNewJobDesc(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-galf-yellow resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-galf-yellow text-galf-carbon py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Publier l'Offre
                </button>
              </form>

              {/* List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-galf-text-muted">Offres Actives de l'Écosystème ({publishedJobs.length})</span>
                  <span className="text-[9px] font-bold text-galf-yellow bg-galf-yellow/10 px-2 py-0.5 rounded border border-galf-yellow/20">Flux Réseau Live</span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {publishedJobs.map(job => (
                    <div key={job.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-galf-yellow/20 transition-all text-xs">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <strong className="text-white block text-sm font-bold">{job.title}</strong>
                          <span className="text-[9px] font-mono text-white/40">{job.id} · {job.type}</span>
                        </div>
                        <span className="text-galf-yellow font-bold font-mono">{job.salary}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 my-2">
                        <span className="px-2 py-0.5 bg-white/10 text-white/70 rounded text-[9px] font-bold">{job.location}</span>
                        <span className="px-2 py-0.5 bg-galf-yellow/15 text-galf-yellow rounded text-[9px] font-black">{job.caces}</span>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-[9px] font-bold">Candidatures reçues : {job.applicants || Math.floor(Math.random() * 5)}</span>
                      </div>

                      <p className="text-[11px] text-white/60 leading-relaxed italic line-clamp-2 mt-2">
                        "{job.description}"
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          alert(`Une alerte a été envoyée aux instructeurs GALF pour présélectionner des candidats pour le poste : "${job.title}".`);
                        }}
                        className="mt-3 text-[9px] font-black uppercase text-galf-yellow hover:underline block cursor-pointer"
                      >
                        Demander une présélection d'apprenants →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ═══════════════════════════════════════════════
            NEW: CSV FLEET COMPLIANCE CHECKER & SAFETY AUDIT PLANNER
           ═══════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          {/* Fleet compliance checker */}
          <FadeIn delay={0.45}>
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[420px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <FileSpreadsheet className="text-galf-yellow w-6 h-6" /> Vérificateur de Flotte (CACES)
                </h3>
                <p className="text-xs text-white/60 mb-6">
                  Importez la liste de vos conducteurs pour en analyser instantanément l'état de conformité réglementaire.
                </p>

                {uploadedFleet ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between p-3.5 bg-galf-yellow/10 border border-galf-yellow/20 rounded-2xl text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-galf-yellow shrink-0" />
                        <div>
                          <span className="text-white font-bold block">Analyse complétée</span>
                          <span className="text-[10px] text-white/50">Fichier : fleet_operators.csv (5 lignes)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-galf-yellow">60%</span>
                        <span className="text-[9px] text-white/40 block font-bold uppercase">Conformité</span>
                      </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto custom-scrollbar border border-white/5 rounded-xl text-[10px]">
                      <table className="w-full text-left text-white/80 border-collapse">
                        <thead>
                          <tr className="bg-black/40 text-[9px] font-black uppercase text-white/40 border-b border-white/5">
                            <th className="p-2">Conducteur</th>
                            <th className="p-2">Engin</th>
                            <th className="p-2">Statut</th>
                            <th className="p-2 text-right">Expiration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedFleet.map((op, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-2 font-bold text-white">{op.name}</td>
                              <td className="p-2">{op.machine}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                  op.status === 'Valide' ? 'bg-green-500/20 text-green-400' :
                                  op.status === 'Attention' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {op.status}
                                </span>
                              </td>
                              <td className="p-2 text-right font-mono">{op.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center my-4 space-y-4 hover:border-galf-yellow/40 transition-colors">
                    <Upload className="w-10 h-10 text-white/20 mx-auto animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-white block">Glissez-déposez le fichier CSV de vos employés</span>
                      <span className="text-[10px] text-white/40 mt-1 block">Format requis : nom, prenom, categorie, date_caces</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsUploadingFleet(true);
                        setTimeout(() => {
                          setUploadedFleet(MOCK_FLEET_COMPLIANCE);
                          setIsUploadingFleet(false);
                        }, 1000);
                      }}
                      disabled={isUploadingFleet}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider text-white rounded-xl transition-all disabled:opacity-50"
                    >
                      {isUploadingFleet ? "Analyse en cours..." : "Simuler l'importation de fichier CSV"}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50">
                <span>Besoin de recycler vos CACES arrivés à échéance ?</span>
                {uploadedFleet && (
                  <button 
                    onClick={() => {
                      setUploadedFleet(null);
                    }} 
                    className="text-red-400 font-bold uppercase hover:underline"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Site Safety Audit Booking */}
          <FadeIn delay={0.5}>
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[420px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              <div>
                <h3 className="text-2xl font-black mb-2 text-white flex items-center gap-2">
                  <ShieldAlert className="text-galf-yellow w-6 h-6" /> Planificateur d'Audit de Sécurité sur site
                </h3>
                <p className="text-xs text-white/60 mb-6">
                  Réservez une visite d'audit et diagnostic HSE de votre parc de machines et chantiers de construction par nos ingénieurs pédagogiques.
                </p>

                {auditScheduled ? (
                  <div className="bg-galf-yellow/15 border border-galf-yellow/30 rounded-2xl p-6 text-center my-4 animate-fadeIn">
                    <Check className="w-12 h-12 text-galf-yellow mx-auto mb-3 animate-bounce" />
                    <div className="text-xs font-black text-white uppercase tracking-wider">Demande d'Audit enregistrée !</div>
                    <div className="text-[9px] font-black text-galf-yellow bg-galf-yellow/10 px-2.5 py-0.5 rounded border border-galf-yellow/20 inline-block my-2">
                      ID : {auditId}
                    </div>
                    <p className="text-[10px] text-white/60 mt-1 max-w-xs mx-auto leading-relaxed">
                      Notre équipe HSE va prendre contact au <strong>{auditPhone}</strong> sous 24h pour valider l'accès de sécurité à votre chantier à la date du <strong>{auditDate}</strong>.
                    </p>
                    <button 
                      onClick={() => setAuditScheduled(false)} 
                      className="mt-4 text-[9px] font-black uppercase text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded hover:bg-red-400/20 transition-all"
                    >
                      Planifier une autre visite
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if(!auditLocation || !auditPhone) return;
                      setAuditId(`GALF-AUDIT-${Math.floor(1000 + Math.random() * 9000)}`);
                      setAuditScheduled(true);
                    }} 
                    className="space-y-3.5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase text-white/50 tracking-wider">Lieu / Adresse du Chantier</label>
                      <input 
                        required
                        type="text"
                        placeholder="Ex: Yopougon Zone Industrielle, Lot 4"
                        value={auditLocation}
                        onChange={(e) => setAuditLocation(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase text-white/50 tracking-wider">Type d'Activité</label>
                        <select 
                          value={auditType}
                          onChange={(e) => setAuditType(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                          style={{ colorScheme: 'light dark' }}
                        >
                          <option>Chantier BTP</option>
                          <option>Exploitation Minière</option>
                          <option>Carrière / Concassage</option>
                          <option>Entrepôt / Logistique</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase text-white/50 tracking-wider">Date Souhaitée</label>
                        <input 
                          required
                          type="date"
                          value={auditDate}
                          onChange={(e) => setAuditDate(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-galf-yellow"
                          style={{ colorScheme: 'light dark' }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase text-white/50 tracking-wider">Téléphone du Responsable Site</label>
                      <input 
                        required
                        type="tel"
                        placeholder="Ex: +225 07 11 82 65 07"
                        value={auditPhone}
                        onChange={(e) => setAuditPhone(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-galf-yellow"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-galf-yellow/10"
                    >
                      Réserver le Diagnostic HSE
                    </button>
                  </form>
                )}
              </div>

              <div className="text-[9px] text-white/30 text-center mt-4 shrink-0">
                * Les audits permettent de cartographier les risques d'accidents liés aux engins lourds.
              </div>
            </div>
          </FadeIn>
        </div>

        {/* F19: Virtual Tour Interactive Map of Yopougon Chantier-École */}
        <FadeIn delay={0.42}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16 relative overflow-hidden text-left">
            <h2 className="text-3xl font-black mb-2 text-white flex items-center gap-3">
              <MapPin className="text-galf-yellow w-7 h-7" /> Visite Interactive du Chantier-École de Yopougon
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-8 leading-relaxed font-sans">
              Découvrez la disposition en temps réel de notre plateau d'évolution de 5 hectares. Cliquez sur les zones pour voir les exercices pratiques et engins actifs.
            </p>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              {/* Map Layout (CSS Grid / absolute positions representing a mini dashboard view of map) */}
              <div className="lg:col-span-7 bg-[#111] border border-white/5 rounded-3xl p-8 relative min-h-[350px] flex items-center justify-center overflow-hidden">
                {/* Background decorative path lines */}
                <div className="absolute inset-0 opacity-15" style={{ 
                  backgroundImage: 'radial-gradient(var(--galf-yellow) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />
                
                {/* Schematic zones */}
                <div className="w-full max-w-md aspect-[4/3] relative border border-white/10 rounded-2xl bg-black/40 p-4">
                  {/* Roadway outline */}
                  <div className="absolute top-[45%] left-0 right-0 h-4 bg-white/5 rounded-full border-t border-b border-white/10" />
                  <div className="absolute left-[50%] top-0 bottom-0 w-4 bg-white/5 rounded-full border-l border-r border-white/10" />

                  {/* Hotspots */}
                  {[
                    { id: 'zone_a', top: '15%', left: '15%', label: 'Zone A - Excavation', icon: '🚜', color: 'bg-blue-500' },
                    { id: 'zone_b', top: '15%', right: '15%', label: 'Zone B - Levage', icon: '🏗️', color: 'bg-purple-500' },
                    { id: 'zone_c', bottom: '15%', left: '20%', label: 'Zone C - Piste Évolution', icon: '🚜', color: 'bg-green-500' },
                    { id: 'zone_d', bottom: '15%', right: '20%', label: 'Zone D - HSE', icon: '🛡️', color: 'bg-red-500' },
                  ].map(spot => {
                    const isSelected = selectedMapHotspot === spot.id
                    return (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedMapHotspot(spot.id)}
                        style={{ top: spot.top, left: spot.left, right: spot.right }}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center border transition-all text-lg shadow-lg hover:scale-110 active:scale-95 cursor-pointer ${
                          isSelected 
                            ? 'bg-galf-yellow border-white text-galf-carbon ring-4 ring-galf-yellow/20 animate-pulse' 
                            : 'bg-galf-surface border-white/10 text-white hover:border-galf-yellow'
                        }`}
                      >
                        {spot.icon}
                      </button>
                    )
                  })}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-white/15 px-3 py-1.5 rounded-full text-[9px] font-black uppercase text-white/50 tracking-wider">
                    Poste Central HSE
                  </div>
                </div>
              </div>

              {/* Sidebar detail */}
              <div className="lg:col-span-5 bg-black/20 p-6 rounded-3xl border border-white/5 flex flex-col justify-between text-xs">
                <div>
                  <h4 className="text-xs font-black uppercase text-galf-yellow tracking-widest mb-4 font-sans border-b border-white/5 pb-2">Information de la Zone</h4>
                  
                  {!activeZoneInfo ? (
                    <div className="text-center py-12 text-white/40 space-y-2">
                      <MapPin className="w-10 h-10 mx-auto opacity-35" />
                      <div className="font-bold">Sélectionnez une zone sur la carte</div>
                      <p className="text-[10px] text-white/30 max-w-xs mx-auto leading-relaxed">
                        Cliquez sur n'importe quel repère d'exercice pratique à gauche pour afficher les détails opérationnels et de sécurité correspondants.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <h5 className="font-black text-white text-sm">{activeZoneInfo.title}</h5>
                      <div>
                        <span className="text-[9px] font-bold text-white/40 uppercase block">Activité en cours :</span>
                        <p className="text-white/80 leading-relaxed font-medium mt-0.5">{activeZoneInfo.activity}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-white/40 uppercase block">Équipements actifs :</span>
                          <span className="text-galf-yellow font-bold mt-0.5 block">{activeZoneInfo.machines}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white/40 uppercase block">Instructeur Principal :</span>
                          <span className="text-white font-bold mt-0.5 block">{activeZoneInfo.instructor}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                        <strong className="block text-[9px] uppercase tracking-wider font-bold">⚠️ Risque Majeur Identifié :</strong>
                        <p className="text-[10px] opacity-90 mt-0.5 font-medium">{activeZoneInfo.danger}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 text-[9px] text-white/40 flex justify-between items-center">
                  <span>Actualisé en temps réel depuis le Chantier-École</span>
                  {selectedMapHotspot && (
                    <button onClick={() => setSelectedMapHotspot(null)} className="text-galf-yellow hover:underline uppercase font-bold cursor-pointer">Réinitialiser la vue</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* F20: Side-by-Side Heavy Machine Specs Comparer */}
        <FadeIn delay={0.45}>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-16 relative overflow-hidden text-left">
            <h2 className="text-3xl font-black mb-2 text-white flex items-center gap-3">
              <Calculator className="text-galf-yellow w-7 h-7" /> Comparateur Technique d'Engins de Chantier
            </h2>
            <p className="text-sm text-white/60 max-w-xl mb-8 leading-relaxed font-sans">
              Comparez les spécifications physiques et mécaniques de nos engins de formation pour adapter votre plan de formation corporate.
            </p>

            <div className="space-y-6 text-xs">
              {/* Selectors */}
              <div className="grid grid-cols-2 gap-8 bg-black/20 p-5 rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Engin A</label>
                  <select
                    value={machineA}
                    onChange={e => setMachineA(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-2.5 text-white outline-none cursor-pointer focus:border-galf-yellow"
                    style={{ colorScheme: 'light dark' }}
                  >
                    <option value="pelle_cat_320">Pelle Caterpillar 320</option>
                    <option value="bulldozer_d6">Bulldozer Komatsu D65</option>
                    <option value="grue_potain">Grue à Tour Potain MCT 88</option>
                    <option value="chariot_toyota">Chariot Élévateur Toyota</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Engin B</label>
                  <select
                    value={machineB}
                    onChange={e => setMachineB(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-2.5 text-white outline-none cursor-pointer focus:border-galf-yellow"
                    style={{ colorScheme: 'light dark' }}
                  >
                    <option value="pelle_cat_320">Pelle Caterpillar 320</option>
                    <option value="bulldozer_d6">Bulldozer Komatsu D65</option>
                    <option value="grue_potain">Grue à Tour Potain MCT 88</option>
                    <option value="chariot_toyota">Chariot Élévateur Toyota</option>
                  </select>
                </div>
              </div>

              {/* Side by side comparison cards */}
              {specA && specB && (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Machine A */}
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase text-galf-yellow tracking-widest mb-4">Engin A</div>
                      <h4 className="text-lg font-black text-white mb-6 font-sans">{specA.name}</h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: "Puissance Moteur", val: specA.power },
                          { label: "Poids Opérationnel", val: specA.weight },
                          { label: "Capacité Nominale", val: specA.capacity },
                          { label: "Classe CACES GALF", val: specA.caces },
                          { label: "Vitesse de déplacement", val: specA.speed }
                        ].map((spec, i) => (
                          <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-white/50">{spec.label}</span>
                            <span className="text-white font-bold">{spec.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Machine B */}
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase text-galf-yellow tracking-widest mb-4">Engin B</div>
                      <h4 className="text-lg font-black text-white mb-6 font-sans">{specB.name}</h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: "Puissance Moteur", val: specB.power },
                          { label: "Poids Opérationnel", val: specB.weight },
                          { label: "Capacité Nominale", val: specB.capacity },
                          { label: "Classe CACES GALF", val: specB.caces },
                          { label: "Vitesse de déplacement", val: specB.speed }
                        ].map((spec, i) => (
                          <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-white/50">{spec.label}</span>
                            <span className="text-white font-bold">{spec.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
