"use client"
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ShieldAlert, Printer, CheckCircle, RefreshCw, ClipboardList, HelpCircle } from 'lucide-react'

interface CheckItem {
  id: string
  label: string
  critical: boolean
}

interface MachineCategory {
  title: string
  items: CheckItem[]
}

export default function SecurityChecklist() {
  const [machineType, setMachineType] = useState<'pelle' | 'grue' | 'chariot'>('pelle')
  const [operatorName, setOperatorName] = useState('')
  const [machineId, setMachineId] = useState('')
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  // State to track check answers: { item_id: 'ok' | 'fail' | 'na' }
  const [answers, setAnswers] = useState<Record<string, 'ok' | 'fail' | 'na'>>({})

  // Safety items checklists
  const checklists: Record<'pelle' | 'grue' | 'chariot', Record<string, MachineCategory>> = {
    pelle: {
      engine: {
        title: "Compartiment Moteur & Fluides",
        items: [
          { id: "p1_oil", label: "Niveau d'huile moteur et absence de fuite apparente", critical: true },
          { id: "p1_coolant", label: "Niveau de liquide de refroidissement et état du radiateur", critical: false },
          { id: "p1_fuel", label: "Niveau de carburant et absence d'eau dans le décanteur", critical: false },
          { id: "p1_belt", label: "Tension et état de la courroie d'alternateur", critical: false }
        ]
      },
      hydraulic: {
        title: "Système Hydraulique",
        items: [
          { id: "p2_h_oil", label: "Niveau d'huile hydraulique (bras replié au sol)", critical: true },
          { id: "p2_hoses", label: "Flexibles hydrauliques: absence de craquelures ou fuites de pression", critical: true },
          { id: "p2_cylinders", label: "Tiges de vérins exemptes de rayures ou traces de corrosion", critical: false }
        ]
      },
      safety: {
        title: "Organes de Sécurité",
        items: [
          { id: "p3_emergency_stop", label: "Coupe-circuit / bouton d'arrêt d'urgence fonctionnel", critical: true },
          { id: "p3_horn", label: "Avertisseur sonore (klaxon) audible sur le chantier", critical: true },
          { id: "p3_backup_alarm", label: "Bip de recul automatique actif en marche arrière", critical: true },
          { id: "p3_lights", label: "Feux de travail de cabine et gyrophare orange", critical: false }
        ]
      },
      structure: {
        title: "Cabine & Train de Chenilles",
        items: [
          { id: "p4_tracks", label: "Tension des chenilles et absence de boulons desserrés", critical: false },
          { id: "p4_windows", label: "Vitres de cabine propres et rétroviseurs ajustés", critical: false },
          { id: "p4_belt", label: "Ceinture de sécurité en bon état et verrouillage fonctionnel", critical: true }
        ]
      }
    },
    grue: {
      structure: {
        title: "Vérifications Structurales & Câbles",
        items: [
          { id: "g1_cable_state", label: "État du câble de levage (absence de torons cassés ou d'écrasement)", critical: true },
          { id: "g1_pulleys", label: "Poulies de mouflage libres de tourner et bien graissées", critical: false },
          { id: "g1_limiteur", label: "Limiteur de fin de course haut et bas fonctionnel", critical: true }
        ]
      },
      electrical: {
        title: "Système Électrique & Guidage",
        items: [
          { id: "g2_radio", label: "Télécommande ou console de cabine fonctionnelle, batterie chargée", critical: true },
          { id: "g2_emergency", label: "Arrêt d'urgence électrique et coupe-circuit principal", critical: true },
          { id: "g2_anemometer", label: "Anémomètre de girouette (mesure vitesse du vent) actif", critical: true }
        ]
      },
      brakes: {
        title: "Organes de Freinage & Rotation",
        items: [
          { id: "g3_brake_translation", label: "Frein de translation du chariot fonctionnel", critical: true },
          { id: "g3_slewing_brake", label: "Frein de rotation du pivotement (orientation de la flèche)", critical: true },
          { id: "g3_anti_collision", label: "Système électronique anti-collision opérationnel", critical: false }
        ]
      }
    },
    chariot: {
      lifting: {
        title: "Organes de Levage & Mât",
        items: [
          { id: "c1_forks", label: "Fourches exemptes de déformations ou fissures", critical: true },
          { id: "c1_chains", label: "Chaînes de levage tendues de façon égale et graissées", critical: true },
          { id: "c1_backrest", label: "Dosseret d'appui de charge bien fixé", critical: false }
        ]
      },
      hydraulic: {
        title: "Direction & Hydraulique",
        items: [
          { id: "c2_leaks", label: "Absence de fuite de liquide de frein ou d'huile hydraulique", critical: true },
          { id: "c2_steering", label: "Direction assistée souple et freins de service/parking réactifs", critical: true },
          { id: "c2_tires", label: "État des pneus (pression ou absence de coupures sur bandages)", critical: false }
        ]
      },
      safety: {
        title: "Cabine & Dispositifs HSE",
        items: [
          { id: "c3_overhead_guard", label: "Toit de protection (arceau de sécurité) intact", critical: true },
          { id: "c3_seatbelt", label: "Ceinture de sécurité et contacteur de présence sous le siège", critical: true },
          { id: "c3_emergency_power", label: "Prise rapide de déconnexion batterie (coupe-circuit)", critical: true }
        ]
      }
    }
  }

  const handleSelectOption = (itemId: string, status: 'ok' | 'fail' | 'na') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        if (status === 'fail') {
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(220, ctx.currentTime)
          gain.gain.setValueAtTime(0.04, ctx.currentTime)
        } else {
          osc.type = 'sine'
          osc.frequency.setValueAtTime(450, ctx.currentTime)
          gain.gain.setValueAtTime(0.015, ctx.currentTime)
        }
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.05)
        setTimeout(() => ctx.close(), 150)
      }
    } catch {}
    
    setAnswers(prev => ({
      ...prev,
      [itemId]: status
    }))
  }

  const handleResetChecklist = () => {
    setAnswers({})
    setOperatorName('')
    setMachineId('')
    setNotes('')
  }

  // Check if any critical item has failed
  const activeChecklist = checklists[machineType]
  let hasCriticalFailure = false
  const failedCriticalItemsList: string[] = []

  Object.values(activeChecklist).forEach((cat) => {
    cat.items.forEach(item => {
      if (answers[item.id] === 'fail') {
        if (item.critical) {
          hasCriticalFailure = true
          failedCriticalItemsList.push(item.label)
        }
      }
    })
  })

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="FICHE D'INSPECTION PRÉ-OPÉRATIONNELLE"
        subtitle="Effectuez votre contrôle de sécurité quotidien obligatoire avant chaque prise de poste, conformément aux normes HSE OSHA et CACES."
        badge="Centre de Sécurité Chantier GALF"
      />

      <div className="container-galf mt-16 relative z-10 print:mt-0 print:p-0">
        
        {/* Print wrapper header (hidden on screen, visible on print) */}
        <div className="hidden print:block mb-8 border-b border-black pb-4 text-black">
          <h1 className="text-3xl font-black uppercase">GALF Formation CI - Rapport HSE</h1>
          <p className="text-sm font-semibold">Contrôle de Sécurité Quotidien des Engins Mobiles & Appareils de Levage</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 print:block">
          
          {/* Left / Center: Checklist fields */}
          <div className="lg:col-span-2 space-y-6 print:w-full">
            
            {/* Operator and machine identifier form */}
            <div className="glass-card p-6 rounded-2xl border border-galf-border grid md:grid-cols-3 gap-4 print:border-black print:bg-white print:text-black">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 print:text-black/60">Opérateur de conduite</label>
                <input 
                  type="text" 
                  placeholder="Nom & Prénom"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs focus:border-galf-yellow outline-none text-white transition-all print:border-black/30 print:bg-transparent print:text-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 print:text-black/60">Identifiant Engin / Code</label>
                <input 
                  type="text" 
                  placeholder="ex: PL-04 ou GR-12"
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs focus:border-galf-yellow outline-none text-white transition-all print:border-black/30 print:bg-transparent print:text-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 print:text-black/60">Date du contrôle</label>
                <input 
                  type="date" 
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs focus:border-galf-yellow outline-none text-white transition-all print:border-black/30 print:bg-transparent print:text-black"
                />
              </div>
            </div>

            {/* Machine Type tab selector (hidden on print) */}
            <div className="flex gap-4 print:hidden">
              {[
                { type: 'pelle', label: '🏗️ Pelle Hydraulique R482' },
                { type: 'grue', label: '🗼 Grue à Tour R487' },
                { type: 'chariot', label: '🚜 Chariot Élévateur R489' }
              ].map((t) => (
                <button
                  key={t.type}
                  onClick={() => { setMachineType(t.type as any); setAnswers({}); }}
                  className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
                    machineType === t.type 
                      ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-lg shadow-galf-yellow/15' 
                      : 'border-white/5 bg-black/20 text-white/70 hover:border-white/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Main Checklist Card */}
            <div className="glass-card p-8 rounded-3xl border border-galf-border space-y-8 print:border-black print:bg-white print:text-black">
              {Object.entries(activeChecklist).map(([catId, cat]) => (
                <div key={catId} className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-galf-yellow border-b border-white/5 pb-2 print:text-black print:border-black/20">
                    {cat.title}
                  </h3>

                  <div className="divide-y divide-white/5 print:divide-black/10">
                    {cat.items.map((item) => (
                      <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Check label */}
                        <div className="flex-1 flex gap-2.5 items-start">
                          {item.critical && (
                            <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest shrink-0 mt-0.5 print:border-red-500 print:text-red-600">
                              Critique
                            </span>
                          )}
                          <span className="text-xs leading-relaxed text-white/90 print:text-black">{item.label}</span>
                        </div>

                        {/* Answers controls */}
                        <div className="flex gap-2 shrink-0">
                          {[
                            { val: 'ok', label: 'Conforme (OK)', color: 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20', activeColor: 'bg-green-500 text-black border-green-500 font-bold' },
                            { val: 'fail', label: 'Défaillant (D)', color: 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20', activeColor: 'bg-red-500 text-white border-red-500 font-bold' },
                            { val: 'na', label: 'N/A', color: 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10', activeColor: 'bg-white/20 text-white border-white/30 font-bold' }
                          ].map((opt) => {
                            const isSelected = answers[item.id] === opt.val
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => handleSelectOption(item.id, opt.val as any)}
                                className={`px-4 py-2 rounded-lg border text-[10px] uppercase tracking-wider transition-all print:border-black/30 print:text-black ${
                                  isSelected ? opt.activeColor : opt.color
                                }`}
                              >
                                {opt.val.toUpperCase()}
                              </button>
                            )
                          })}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            {/* Notes Section */}
            <div className="glass-card p-6 rounded-2xl border border-galf-border space-y-2 print:border-black print:bg-white print:text-black">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 print:text-black/60">Observations & Remarques du conducteur</label>
              <textarea 
                rows={3}
                placeholder="Renseignez ici toute anomalie constatée ne bloquant pas l'utilisation immédiate (fuite légère, rayure carrosserie, ampoule grillée...)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs focus:border-galf-yellow outline-none text-white transition-all resize-none print:border-black/30 print:bg-transparent print:text-black"
              />
            </div>

          </div>

          {/* Right Column: HSE Real-time analysis status (sticky block) */}
          <div className="print:hidden">
            <div className="glass-card p-8 rounded-3xl border border-galf-border space-y-6 sticky top-24">
              <h3 className="text-lg font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">
                Statut HSE Machine
              </h3>

              {hasCriticalFailure ? (
                // Danger flag status
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-red-500 animate-pulse">
                    <ShieldAlert className="w-8 h-8 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">Machine non conforme</h4>
                      <p className="text-[10px] opacity-75">Interdiction d'utilisation</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-red-400">
                    <strong>Alerte critique :</strong> Au moins un organe de sécurité essentiel a été déclaré défaillant. Conformément aux consignes GALF HSE, vous devez appliquer le protocole de consignation (lockout-tagout) et avertir immédiatement le chef de chantier.
                  </p>
                  
                  {/* List of failed critical checks */}
                  <div className="space-y-1.5 border-t border-red-500/20 pt-4">
                    <div className="text-[10px] font-black uppercase tracking-wider text-red-500/70">Points défaillants :</div>
                    {failedCriticalItemsList.map((item, idx) => (
                      <div key={idx} className="text-[10px] font-semibold text-white flex items-start gap-1">
                        <span className="text-red-500 font-bold shrink-0">•</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : Object.keys(answers).length === 0 ? (
                // Initial empty check state
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center space-y-3">
                  <ClipboardList className="w-12 h-12 text-galf-yellow/40 mx-auto animate-pulse" />
                  <h4 className="font-bold text-xs uppercase text-white/70">En attente de contrôle</h4>
                  <p className="text-[10px] leading-relaxed text-white/40">
                    Veuillez évaluer l'état de chaque composant de l'engin dans le formulaire de gauche.
                  </p>
                </div>
              ) : (
                // Successful checklist status (Green)
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-green-500">
                    <CheckCircle className="w-8 h-8 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">Contrôle Réussi</h4>
                      <p className="text-[10px] opacity-75">Machine apte au service</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-green-400">
                    Tous les organes de sécurité et vérifications critiques ont été déclarés conformes. La machine est prête à opérer en toute sécurité sur votre chantier.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => window.print()}
                  disabled={!operatorName || !machineId || Object.keys(answers).length === 0}
                  className="w-full py-4 rounded-xl bg-galf-yellow text-galf-carbon text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-galf-yellow/10"
                >
                  <Printer className="w-4 h-4" /> Signer & Imprimer (.PDF)
                </button>

                <button 
                  onClick={handleResetChecklist}
                  className="w-full py-3.5 rounded-xl border border-white/10 text-white/70 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Réinitialiser
                </button>
              </div>

              {/* HSE Instruction reminder */}
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-[10px] leading-relaxed text-white/50 flex items-start gap-2.5">
                <HelpCircle className="w-4.5 h-4.5 text-galf-yellow shrink-0 mt-0.5" />
                <span>
                  Le rapport d'inspection quotidien doit être conservé dans la cabine de l'engin pendant toute la durée du poste et archivé par le service HSE.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
