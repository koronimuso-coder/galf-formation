"use client"
import { useState } from 'react'

import { Award, Download, User, Briefcase, Mail, Phone, MapPin, 
  Settings, RefreshCw, Sparkles, Plus, Trash2} from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { jsPDF } from 'jspdf'

interface Experience {
  company: string
  role: string
  duration: string
  desc: string
}

export default function CvGeneratorPage() {
  const [name, setName] = useState("JEAN KOUADIO")
  const [email, setEmail] = useState("jean.kouadio@email.com")
  const [phone, setPhone] = useState("+225 07 11 82 65 07")
  const [city, setCity] = useState("Abidjan, Côte d'Ivoire")
  const [title, setTitle] = useState("Opérateur de Pelle Hydraulique & Chargeuse")
  const [bio, setBio] = useState("Opérateur d'engins lourds certifié GALF CACES R482 avec 3 ans d'expérience pratique sur chantiers de terrassement et de génie civil. Rigoureux, formé aux normes HSE de sécurité internationales.")
  
  const [cacesList, setCacesList] = useState<string[]>([
    "CACES R482 Catégorie B1 (Pelle Hydraulique)",
    "CACES R482 Catégorie C1 (Bulldozer D6)"
  ])
  const [newCaces, setNewCaces] = useState("")

  const [skills, setSkills] = useState<string[]>([
    "Terrassement de masse",
    "Excavation précise de tranchées",
    "Talutage & Nivellement de précision",
    "Règles de sécurité de chantier (HSE)",
    "Vérification journalière des machines (VGP)"
  ])
  const [newSkill, setNewSkill] = useState("")

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "SOGEA-SATOM CI",
      role: "Opérateur Pelle Hydraulique",
      duration: "Septembre 2024 - Présent",
      desc: "Conduite d'une pelle Caterpillar 320D pour le creusement de tranchées et chargement de camions-bennes sur le chantier routier d'Abidjan."
    },
    {
      company: "Chantier-École GALF (Stage Pratique)",
      role: "Conducteur d'Engins Stagiaire",
      duration: "Juin 2024 - Août 2024",
      desc: "80 heures de manipulation intensive sur pelle lourde et bulldozer. Réalisation d'exercices de précision sous la direction d'instructeurs agréés."
    }
  ])

  const [expCompany, setExpCompany] = useState("")
  const [expRole, setExpRole] = useState("")
  const [expDuration, setExpDuration] = useState("")
  const [expDesc, setExpDesc] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [cvTheme, setCvTheme] = useState<'carbon' | 'steel'>('carbon')

  const handleAddCaces = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCaces.trim()) return
    setCacesList(prev => [...prev, newCaces.trim()])
    setNewCaces("")
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    setSkills(prev => [...prev, newSkill.trim()])
    setNewSkill("")
  }

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expCompany.trim() || !expRole.trim() || !expDuration.trim()) return
    setExperiences(prev => [
      {
        company: expCompany.trim(),
        role: expRole.trim(),
        duration: expDuration.trim(),
        desc: expDesc.trim()
      },
      ...prev
    ])
    setExpCompany("")
    setExpRole("")
    setExpDuration("")
    setExpDesc("")
  }

  const handleRemoveExperience = (idx: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== idx))
  }

  const handleRemoveCaces = (idx: number) => {
    setCacesList(prev => prev.filter((_, i) => i !== idx))
  }

  const handleRemoveSkill = (idx: number) => {
    setSkills(prev => prev.filter((_, i) => i !== idx))
  }

  const handleExportPDF = () => {
    setIsGenerating(true)

    setTimeout(() => {
      try {
        const doc = new jsPDF()
        
        // Background structure
        const primaryColor = cvTheme === 'carbon' ? [255, 176, 0] : [100, 110, 120] // Yellow vs Steel
        
        // 1. Header Banner
        doc.setFillColor(26, 26, 29)
        doc.rect(0, 0, 210, 55, "F")

        // Name
        doc.setFont("helvetica", "bold")
        doc.setFontSize(22)
        doc.setTextColor(255, 255, 255)
        doc.text(name.toUpperCase(), 15, 22)

        // Title
        doc.setFontSize(11)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(title.toUpperCase(), 15, 30)

        // Contact info in Header
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor(180, 180, 180)
        doc.text(`Email : ${email}  |  Tel : ${phone}  |  Adresse : ${city}`, 15, 38)
        doc.text(`Certifications vérifiables sur www.galfformation.com/verification-certificat`, 15, 43)

        // Safety Accent line
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.rect(0, 52, 210, 3, "F")

        // 2. Profile Bio Section
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(30, 30, 30)
        doc.text("PROFIL PROFESSIONNEL", 15, 70)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(70, 70, 70)
        const splitBio = doc.splitTextToSize(bio, 180)
        doc.text(splitBio, 15, 76)

        const currentY = 76 + (splitBio.length * 5) + 8

        // Draw separator
        doc.setDrawColor(220, 220, 220)
        doc.line(15, currentY - 4, 195, currentY - 4)

        // 3. Columns Layout: Left (Experiences) - Right (CACES & Competences)
        const leftColX = 15
        const rightColX = 120

        // Experiences title
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(30, 30, 30)
        doc.text("EXPÉRIENCES PROFESSIONNELLES", leftColX, currentY)

        // Certifications title
        doc.text("CERTIFICATIONS & CACES", rightColX, currentY)

        let expY = currentY + 8
        let certY = currentY + 8

        // LEFT COLUMN: Experiences loop
        experiences.forEach((exp) => {
          if (expY > 260) return // Simple overflow protection
          
          doc.setFont("helvetica", "bold")
          doc.setFontSize(9.5)
          doc.setTextColor(40, 40, 40)
          doc.text(exp.role, leftColX, expY)

          doc.setFont("helvetica", "italic")
          doc.setFontSize(8)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text(`${exp.company}  |  ${exp.duration}`, leftColX, expY + 4.5)

          doc.setFont("helvetica", "normal")
          doc.setFontSize(8.5)
          doc.setTextColor(80, 80, 80)
          const splitDesc = doc.splitTextToSize(exp.desc, 95)
          doc.text(splitDesc, leftColX, expY + 9)
          
          expY += 9 + (splitDesc.length * 4) + 6
        })

        // RIGHT COLUMN: CACES loop
        cacesList.forEach((caces) => {
          if (certY > 260) return
          doc.setFont("helvetica", "bold")
          doc.setFontSize(8.5)
          doc.setTextColor(30, 30, 30)
          
          // Draw mini square icon
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.rect(rightColX, certY - 2.5, 2, 2, "F")
          
          doc.text(caces, rightColX + 4, certY)
          certY += 6.5
        })

        // Skills section in right col
        certY += 4
        if (certY < 260) {
          doc.setFont("helvetica", "bold")
          doc.setFontSize(12)
          doc.setTextColor(30, 30, 30)
          doc.text("COMPÉTENCES TECHNIQUES", rightColX, certY)
          certY += 7

          skills.forEach((skill) => {
            if (certY > 260) return
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8.5)
            doc.setTextColor(80, 80, 80)
            
            // Draw mini dash
            doc.setFillColor(180, 180, 180)
            doc.rect(rightColX, certY - 2, 1.5, 1.5, "F")
            
            doc.text(skill, rightColX + 4, certY)
            certY += 5.5
          })
        }

        // 4. Verification Stamp Box at the bottom
        const footerY = 270
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setLineWidth(0.5)
        doc.rect(15, footerY - 14, 180, 12)
        
        doc.setFont("helvetica", "bold")
        doc.setFontSize(7.5)
        doc.setTextColor(30, 30, 30)
        doc.text("DIPLÔME VERIFIÉ ET HOMOLOGUÉ GALF FORMATION CÔTE D'IVOIRE", 20, footerY - 8)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(6.5)
        doc.setTextColor(140, 140, 140)
        doc.text("Ce document inclut des habilitations à la conduite d'engins conformes à la réglementation ouest-africaine.", 20, footerY - 5)

        // Save PDF
        doc.save(`CV-GALF-${name.replace(/\s+/g, '-')}.pdf`)
      } catch (err) {
        console.error("Failed to generate CV PDF:", err)
      }
      setIsGenerating(false)
    }, 1500)
  }

  const fieldStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="GÉNÉRATEUR DE CV OPÉRATEUR"
        subtitle="Valorisez votre diplôme GALF. Créez un CV professionnel au format international, intégrant vos certifications CACES vérifiables par les recruteurs."
        badge="Insertion professionnelle"
      />

      <div className="container-galf relative z-10 mt-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE INTERACTIVE INPUT FIELDS FORM */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Identity Card Form */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                <User className="w-4.5 h-4.5 text-galf-yellow" /> Informations Personnelles
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Prénom & Nom</label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)} 
                    className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Titre du Profil</label>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
                    className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Téléphone</label>
                  <input 
                    type="text" value={phone} onChange={(e) => setPhone(e.target.value)} 
                    className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Email</label>
                  <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Ville & Pays</label>
                <input 
                  type="text" value={city} onChange={(e) => setCity(e.target.value)} 
                  className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Accroche / Profil de sécurité</label>
                <textarea 
                  rows={3} value={bio} onChange={(e) => setBio(e.target.value)} 
                  className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none resize-none" style={fieldStyle}
                />
              </div>
            </div>

            {/* Certifications (CACES) Section */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                <Award className="w-4.5 h-4.5 text-galf-yellow" /> Certifications & CACES GALF
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {cacesList.map((c, i) => (
                  <span key={i} className="text-[11px] font-bold bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-1.5">
                    {c}
                    <button onClick={() => handleRemoveCaces(i)} className="hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddCaces} className="flex gap-2">
                <input 
                  type="text" placeholder="Ex: CACES R482 Catégorie E" value={newCaces} onChange={(e) => setNewCaces(e.target.value)}
                  className="flex-1 rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                />
                <button type="submit" className="bg-galf-yellow text-galf-carbon p-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center shrink-0">
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>

            {/* Experiences Section */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                <Briefcase className="w-4.5 h-4.5 text-galf-yellow" /> Expériences de conduite
              </h3>

              <div className="space-y-3">
                {experiences.map((exp, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">{exp.role}</h4>
                      <span className="text-[10px] text-galf-yellow font-medium mt-0.5 block">{exp.company} | {exp.duration}</span>
                      <p className="text-[10px] text-white/50 leading-relaxed mt-1">{exp.desc}</p>
                    </div>
                    <button onClick={() => handleRemoveExperience(i)} className="text-white/40 hover:text-red-500 transition-colors shrink-0 mt-0.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Ajouter une expérience</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" placeholder="Entreprise" value={expCompany} onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                  <input 
                    type="text" placeholder="Poste" value={expRole} onChange={(e) => setExpRole(e.target.value)}
                    className="w-full rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                  />
                </div>
                <input 
                  type="text" placeholder="Durée (Ex: Mars 2024 - Juin 2024)" value={expDuration} onChange={(e) => setExpDuration(e.target.value)}
                  className="w-full rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                />
                <textarea 
                  rows={2} placeholder="Description des tâches (engins conduits, chantier...)" value={expDesc} onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none resize-none" style={fieldStyle}
                />
                <button 
                  onClick={handleAddExperience}
                  className="w-full bg-galf-yellow/10 border border-galf-yellow/20 hover:bg-galf-yellow/25 text-galf-yellow font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Enregistrer l'expérience
                </button>
              </div>
            </div>

            {/* Skills Competences Section */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                <Settings className="w-4.5 h-4.5 text-galf-yellow" /> Compétences
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="text-[11px] font-bold bg-white/5 border border-white/5 text-white/80 pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-1.5">
                    {s}
                    <button onClick={() => handleRemoveSkill(i)} className="hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text" placeholder="Ex: Guidage laser 3D" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                />
                <button type="submit" className="bg-galf-yellow text-galf-carbon p-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center shrink-0">
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT: REAL-TIME PREVIEW PANEL */}
          <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-galf-yellow" /> Aperçu du CV en temps réel
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCvTheme('carbon')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${cvTheme === 'carbon' ? 'bg-galf-yellow text-galf-carbon' : 'opacity-40 text-white'}`}
                  >
                    Carbon
                  </button>
                  <button 
                    onClick={() => setCvTheme('steel')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${cvTheme === 'steel' ? 'bg-galf-yellow text-galf-carbon' : 'opacity-40 text-white'}`}
                  >
                    Steel
                  </button>
                </div>
              </div>

              {/* The styled paper sheet simulator */}
              <div 
                className="w-full bg-white text-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl space-y-6"
                style={{ fontSize: '12px' }}
              >
                {/* Header Banner Mock */}
                <div className="bg-zinc-900 -mx-8 -mt-8 p-6 md:p-8 text-white relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-galf-yellow/10 to-transparent rounded-bl-full" />
                  
                  <h2 className="text-xl font-black tracking-tight uppercase leading-none">{name || 'Nom complet'}</h2>
                  <p className="text-xs font-black uppercase tracking-wider mt-1.5" style={{ color: cvTheme === 'carbon' ? '#ffb000' : '#8b939c' }}>
                    {title || 'Titre recherché'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[9px] text-zinc-400 font-medium">
                    <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-galf-yellow shrink-0" /> {email || 'Email'}</div>
                    <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-galf-yellow shrink-0" /> {phone || 'Téléphone'}</div>
                    <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3 h-3 text-galf-yellow shrink-0" /> {city || 'Adresse'}</div>
                  </div>
                </div>

                {/* Safety colored ribbon */}
                <div className="h-1 -mx-8" style={{ background: cvTheme === 'carbon' ? '#ffb000' : '#8b939c' }} />

                {/* Profile Bio */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-900">Profil</h4>
                  <p className="text-zinc-600 leading-relaxed text-[11px] font-medium">{bio || 'Description du profil...'}</p>
                </div>

                <div className="grid grid-cols-12 gap-6 pt-4 border-t border-zinc-200">
                  
                  {/* Left Column (Experiences) */}
                  <div className="col-span-7 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">Expériences de conduite</h4>
                    
                    <div className="space-y-4">
                      {experiences.map((exp, i) => (
                        <div key={i} className="space-y-1">
                          <h5 className="font-bold text-zinc-800 text-[11px]">{exp.role}</h5>
                          <div className="text-[9px] font-bold" style={{ color: cvTheme === 'carbon' ? '#c48900' : '#64748b' }}>
                            {exp.company} &bull; {exp.duration}
                          </div>
                          <p className="text-zinc-500 leading-relaxed text-[10px] font-medium mt-0.5">{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column (Certifications & Skills) */}
                  <div className="col-span-5 space-y-4">
                    
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">Certifications CACES</h4>
                      <div className="space-y-1">
                        {cacesList.map((c, i) => (
                          <div key={i} className="text-[10px] font-bold text-zinc-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cvTheme === 'carbon' ? '#ffb000' : '#8b939c' }} />
                            <span className="truncate">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">Compétences</h4>
                      <div className="space-y-1">
                        {skills.map((s, i) => (
                          <div key={i} className="text-[10px] text-zinc-600 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-[1px] shrink-0 bg-zinc-300" />
                            <span className="truncate">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Footer Cert Stamp Box */}
                <div className="pt-4 border-t border-zinc-150 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center font-black text-xs text-white border border-zinc-700">
                      🏆
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-zinc-900">GALF CI CERTIFIED</div>
                      <div className="text-[7px] text-zinc-400">ID d'authentification vérifiable inclus</div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-zinc-100 rounded flex items-center justify-center font-mono text-[7px] text-zinc-400 border border-zinc-200 text-center uppercase">
                    QR Code
                  </div>
                </div>

              </div>

              {/* Action trigger button */}
              <button
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="w-full mt-6 bg-galf-yellow text-galf-carbon py-4.5 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-galf-yellow/10 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Télécharger mon CV PDF
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
