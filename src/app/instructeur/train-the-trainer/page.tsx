"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Award, ShieldCheck, CheckSquare, ArrowLeft, RefreshCw, ClipboardList, Download} from 'lucide-react'


import { jsPDF } from 'jspdf'

interface Milestone {
  id: number
  title: string
  desc: string
  hours: number
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED'
}

const INITIAL_MILESTONES: Milestone[] = [
  { id: 1, title: "Théorie Pédagogique & HSE", desc: "Méthodologies d'enseignement pour adultes, gestion de groupe et principes fondamentaux de sécurité sur chantier.", hours: 20, status: "COMPLETED" },
  { id: 2, title: "Maîtrise Technique Engins (Pratique)", desc: "Évaluation en situation réelle de la précision de manipulation des pelles, grues et bulldozers.", hours: 40, status: "ACTIVE" },
  { id: 3, title: "Réglementation Ouest-Africaine & CACES R482", desc: "Étude des textes réglementaires du Ministère et équivalences de conformité CACES européennes.", hours: 15, status: "LOCKED" },
  { id: 4, title: "Administration & Délivrance de Licences", desc: "Apprentissage des grilles de notation GALF, enregistrement au registre national et déontologie.", hours: 10, status: "LOCKED" }
]

const CHECKLIST_ITEMS = {
  pelle: [
    { id: "p1", section: "MOTEUR & FLUIDES", label: "Niveau d'huile moteur et liquide de refroidissement" },
    { id: "p2", section: "MOTEUR & FLUIDES", label: "État des courroies et étanchéité du radiateur" },
    { id: "p3", section: "HYDRAULIQUE", label: "Flexibles de flèche et de balancier (absence de suintement)" },
    { id: "p4", section: "HYDRAULIQUE", label: "Tiges de vérins (absence de rayures ou fuite)" },
    { id: "p5", section: "ORGANES DE SÉCURITÉ", label: "Gyrophare et avertisseur de recul fonctionnels" },
    { id: "p6", section: "ORGANES DE SÉCURITÉ", label: "Extincteur de bord en cabine (pression conforme)" },
    { id: "p7", section: "TRAIN DE ROULEMENT", label: "Tension des chenilles et fixations des galets" },
    { id: "p8", section: "TRAIN DE ROULEMENT", label: "État d'usure des dents et axes du godet" },
    { id: "p9", section: "CABINE & VISIBILITÉ", label: "Pare-brise propre et rétroviseurs ajustés" },
    { id: "p10", section: "CABINE & VISIBILITÉ", label: "Fonctionnement de l'arrêt d'urgence et ceintures" }
  ],
  grue: [
    { id: "g1", section: "MÉCANIQUE & STRUCTURE", label: "Alignement de la mâture et absence de déformation" },
    { id: "g2", section: "MÉCANIQUE & STRUCTURE", label: "Fixations et serrage des boulons d'ancrage" },
    { id: "g3", section: "CÂBLES & LEVAGE", label: "État du câble de levage (absence de torons coupés)" },
    { id: "g4", section: "CÂBLES & LEVAGE", label: "Limiteurs de fin de course (haut et bas)" },
    { id: "g5", section: "SÉCURITÉ CHANTIER", label: "Anémomètre actif et jauge de vitesse du vent" },
    { id: "g6", section: "SÉCURITÉ CHANTIER", label: "Frein de rotation du pivot de la flèche" },
    { id: "g7", section: "CHARRIOT & CROCHET", label: "Clapet de sécurité du crochet de levage actif" },
    { id: "g8", section: "CHARRIOT & CROCHET", label: "Galets de roulement du chariot sur la flèche" },
    { id: "g9", section: "CABINE", label: "Bouton d'arrêt d'urgence principal au tableau" },
    { id: "g10", section: "CABINE", label: "Afficheur du moment de charge fonctionnel (LMI)" }
  ],
  bulldozer: [
    { id: "b1", section: "PROPULSION & ENGINE", label: "Jauges moteur, gazole et huile de transmission" },
    { id: "b2", section: "PROPULSION & ENGINE", label: "Absence de fuites sous le bloc moteur" },
    { id: "b3", section: "LAME & RIPPER", label: "Tranchants de lame et fixations des vérins d'inclinaison" },
    { id: "b4", section: "LAME & RIPPER", label: "Dents du ripper arrière et axes d'articulation" },
    { id: "b5", section: "TRAIN DE ROULEMENT", label: "Usure des barbotins, segments et patins" },
    { id: "b6", section: "TRAIN DE ROULEMENT", label: "Nettoyage des barbotins et tendeurs de chenille" },
    { id: "b7", section: "ÉQUIPEMENTS HSE", label: "Structure ROPS/FOPS de la cabine en bon état" },
    { id: "b8", section: "ÉQUIPEMENTS HSE", label: "Projecteurs de travail LED avant et arrière actifs" },
    { id: "b9", section: "CABINE", label: "Pédales de frein et leviers de commande de transmission" },
    { id: "b10", section: "CABINE", label: "Ceinture de sécurité et avertisseur sonore" }
  ]
}

export default function TrainTheTrainerPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES)
  const [selectedMachine, setSelectedMachine] = useState<'pelle' | 'grue' | 'bulldozer'>('pelle')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customTitle, setCustomTitle] = useState("VGP JOURNALIÈRE - STANDARD GALF")

  // Toggle item selection
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    )
    triggerAudioFeedback(520, 0.05)
  }

  // Pre-select all items for the machine
  useEffect(() => {
    const ids = CHECKLIST_ITEMS[selectedMachine].map(item => item.id)
    setSelectedItems(ids)
  }, [selectedMachine])

  // Select/Unselect All
  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedItems(CHECKLIST_ITEMS[selectedMachine].map(i => i.id))
    } else {
      setSelectedItems([])
    }
    triggerAudioFeedback(600, 0.08)
  }

  // Interactive milestone toggle (simulating teacher checking off progress)
  const handleToggleMilestone = (id: number) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        let newStatus: 'COMPLETED' | 'ACTIVE' | 'LOCKED' = 'COMPLETED'
        if (m.status === 'COMPLETED') newStatus = 'ACTIVE'
        else if (m.status === 'ACTIVE') newStatus = 'COMPLETED'
        else newStatus = 'ACTIVE'
        return { ...m, status: newStatus }
      }
      // Unlock next milestones sequentially
      if (m.id === id + 1 && m.status === 'LOCKED') {
        return { ...m, status: 'ACTIVE' }
      }
      return m
    }))
    triggerAudioFeedback(880, 0.1)
  }

  const handleExportPDF = () => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const doc = new jsPDF()
        
        // 1. A4 Header Border
        doc.setFillColor(26, 26, 29)
        doc.rect(0, 0, 210, 48, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(16)
        doc.setTextColor(255, 255, 255)
        doc.text("GALF FORMATION CÔTE D'IVOIRE", 15, 20)

        doc.setFontSize(10)
        doc.setTextColor(255, 176, 0) // Yellow
        doc.text("FICHE DE VÉRIFICATION GENERALE PÉRIODIQUE JOURNALIÈRE (VGP)", 15, 28)
        
        doc.setFont("helvetica", "italic")
        doc.setFontSize(8)
        doc.setTextColor(180, 180, 180)
        doc.text("Document de conformité HSE obligatoire avant la prise de poste opérateur.", 15, 35)
        
        doc.setFont("helvetica", "normal")
        doc.text(`Modèle personnalisé créé le : ${new Date().toLocaleDateString('fr-FR')}`, 15, 40)

        // Safety line
        doc.setFillColor(255, 176, 0)
        doc.rect(0, 45, 210, 3, "F")

        // 2. Info Boxes
        let currentY = 62
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.setTextColor(40, 40, 40)
        doc.text(`MODÈLE D'ENGIN : ${selectedMachine.toUpperCase()}`, 15, currentY)
        doc.text(`TITRE DU DOCUMENT : ${customTitle.toUpperCase()}`, 15, currentY + 6)
        
        // Draw input lines for physical operator fill-in
        doc.setFont("helvetica", "normal")
        doc.text("Nom de l'opérateur : ___________________________", 110, currentY)
        doc.text("Signature : __________________", 110, currentY + 6)

        // Table Header
        currentY += 16
        doc.setFillColor(240, 240, 242)
        doc.rect(15, currentY, 180, 9, "F")
        
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9.5)
        doc.setTextColor(30, 30, 30)
        doc.text("SECTION / ORGANE À VÉRIFIER", 18, currentY + 6.5)
        doc.text("C", 145, currentY + 6.5)
        doc.text("NC", 160, currentY + 6.5)
        doc.text("REMARQUES / ACTION REQUIS", 175, currentY + 6.5)

        // Draw checklist lines
        currentY += 9
        const activeItems = CHECKLIST_ITEMS[selectedMachine].filter(i => selectedItems.includes(i.id))
        
        if (activeItems.length === 0) {
          doc.setFont("helvetica", "italic")
          doc.text("Aucun point de vérification sélectionné.", 20, currentY + 10)
        } else {
          activeItems.forEach(item => {
            doc.setDrawColor(200, 200, 200)
            doc.line(15, currentY, 195, currentY)

            doc.setFont("helvetica", "bold")
            doc.setFontSize(7.5)
            doc.setTextColor(100, 100, 100)
            doc.text(item.section, 18, currentY + 5.5)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            doc.setTextColor(40, 40, 40)
            doc.text(item.label, 50, currentY + 5.5)

            // Conforme/Non Conforme check box grids
            doc.rect(144, currentY + 2.5, 3.5, 3.5)
            doc.rect(159, currentY + 2.5, 3.5, 3.5)
            
            // line for remarks
            doc.line(174, currentY + 6, 192, currentY + 6)

            currentY += 9.5
          })
        }

        // 3. Footer warning stamp
        currentY = Math.max(currentY + 10, 250)
        doc.setFillColor(26, 26, 29)
        doc.rect(15, currentY, 180, 20, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(8.5)
        doc.setTextColor(255, 176, 0)
        doc.text("APPROBATION DU CHEF DE CHANTIER / DIRECTEUR HSE", 20, currentY + 7)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(7.5)
        doc.setTextColor(230, 230, 230)
        doc.text("En signant ce document, l'opérateur atteste avoir réalisé l'inspection visuelle obligatoire journalière.", 20, currentY + 12)
        doc.text("En cas d'anomalie 'NC', la machine ne doit pas être démarrée et le service technique doit être notifié.", 20, currentY + 16)

        // Save PDF
        doc.save(`Fiche-VGP-GALF-${selectedMachine}.pdf`)
      } catch (err) {
        console.error(err)
      }
      setIsGenerating(false)
    }, 1500)
  }

  const fieldStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden text-left" style={{ background: 'var(--galf-bg)' }}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal opacity-5" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-galf-yellow/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-galf pt-24 relative z-10">
        
        <Link 
          href="/mediatheque"
          className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-xs mb-4 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la Médiathèque
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              Instructeurs Internes & HSE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mt-3" style={{ color: 'var(--galf-text)' }}>
              TRAIN-THE-<span className="text-galf-yellow">TRAINER HUB</span>
            </h1>
            <p className="text-sm max-w-xl mt-2 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
              Espace de certification pour les responsables HSE. Validez vos compétences de formateur interne et concevez vos grilles d'inspections VGP sur-mesure.
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: TRAINER CERTIFICATION TRACK (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-full animate-pulse" />
              
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-galf-yellow" /> Progression Certification Formateur
              </h3>

              <div className="space-y-4">
                {milestones.map((m) => {
                  const isCompleted = m.status === 'COMPLETED'
                  const isActive = m.status === 'ACTIVE'
                  
                  return (
                    <div 
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isCompleted ? 'bg-green-500/5 border-green-500/20' :
                        isActive ? 'bg-galf-yellow/5 border-galf-yellow shadow-[0_0_10px_rgba(255,176,0,0.05)] animate-pulse' :
                        'bg-white/5 border-white/5 opacity-40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono font-bold text-white/40">{m.hours} HEURES DE COURS</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          isCompleted ? 'bg-green-500/20 text-green-400' :
                          isActive ? 'bg-galf-yellow/20 text-galf-yellow' :
                          'bg-zinc-800 text-zinc-500'
                        }`}>
                          {isCompleted ? 'Terminé' : isActive ? 'En Cours' : 'Verrouillé'}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        {isCompleted && <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />}
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-white/50 leading-relaxed mt-1">{m.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: VGP CHECKLIST BUILDER & PDF GENERATOR (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-galf-yellow" /> Configurer une fiche d'inspection VGP
              </h3>

              {/* Title input */}
              <div className="space-y-1.5 mb-6">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Titre du document imprimable</label>
                <input 
                  type="text" 
                  value={customTitle} 
                  onChange={(e) => setCustomTitle(e.target.value)} 
                  className="w-full rounded-xl p-3 text-xs focus:ring-1 focus:ring-galf-yellow focus:outline-none" style={fieldStyle}
                />
              </div>

              {/* Machine selection tabs */}
              <div className="flex bg-black/5 dark:bg-black/40 border border-white/5 p-1.5 rounded-xl mb-6">
                {[
                  { id: 'pelle', label: 'Pelle Hydraulique' },
                  { id: 'grue', label: 'Grue à Tour / Mobile' },
                  { id: 'bulldozer', label: 'Bulldozer R482' }
                ].map(mach => (
                  <button
                    key={mach.id}
                    onClick={() => {
                      setSelectedMachine(mach.id as any)
                      triggerAudioFeedback(600, 0.05)
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      selectedMachine === mach.id 
                        ? 'bg-galf-yellow text-galf-carbon shadow-md' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mach.label}
                  </button>
                ))}
              </div>

              {/* Select all actions */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Points de contrôle ({selectedItems.length} sélectionnés)</span>
                <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider">
                  <button onClick={() => handleSelectAll(true)} className="text-galf-yellow hover:underline">Tout cocher</button>
                  <button onClick={() => handleSelectAll(false)} className="text-white/40 hover:text-white">Tout décocher</button>
                </div>
              </div>

              {/* Checklist items list */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 border border-white/5 rounded-2xl p-4 bg-zinc-950/40">
                {CHECKLIST_ITEMS[selectedMachine].map((item) => {
                  const isChecked = selectedItems.includes(item.id)

                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleToggleItem(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isChecked 
                          ? 'bg-white/5 border-white/10 text-white' 
                          : 'bg-transparent border-transparent text-white/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${isChecked ? 'text-galf-yellow' : 'text-white/20'}`} />
                        <div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border mr-2 inline-block ${
                            isChecked ? 'bg-galf-yellow/10 border-galf-yellow/20 text-galf-yellow' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                          }`}>
                            {item.section}
                          </span>
                          <span className="text-xs font-medium">{item.label}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Export Trigger */}
              <button
                onClick={handleExportPDF}
                disabled={isGenerating || selectedItems.length === 0}
                className="w-full mt-6 bg-galf-yellow text-galf-carbon py-4.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-galf-yellow/10 disabled:opacity-40"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Télécharger ma fiche VGP PDF
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  )

  function triggerAudioFeedback(freq = 660, duration = 0.08) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
      setTimeout(() => ctx.close(), 200)
    } catch{}
  }
}
