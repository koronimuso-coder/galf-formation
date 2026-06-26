"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, BarChart3, CheckCircle, TrendingUp} from 'lucide-react'

import { getCurrentUser, signOutUser, UserProfile } from '@/lib/firebase/services/auth'
import { dbGetDocs, dbGetDoc, dbUpdateDoc } from '@/lib/firebase/services/dbClient'
import { ReferredProspect, logCommercialActivity } from '@/lib/firebase/services/commercial'
import { GALF_FORMATIONS } from '@/lib/data'

interface CommercialPerformance {
  uid: string;
  name: string;
  assignedLeads: number;
  completedTasks: number;
  conversions: number;
  conversionRate: number;
}

export default function ResponsableWorkspace() {
  const router = useRouter()
  
  // Auth state
  const [supervisorUser, setSupervisorUser] = useState<UserProfile | null>(null)
  
  // Team metrics states
  const [teamProspects, setTeamProspects] = useState<ReferredProspect[]>([])
  const [commercials, setCommercials] = useState<UserProfile[]>([])
  const [teamPerformance, setTeamPerformance] = useState<CommercialPerformance[]>([])

  // Re-assignment modal state
  const [selectedProspect, setSelectedProspect] = useState<ReferredProspect | null>(null)
  const [newCommercialId, setNewCommercialId] = useState('')
  const [isReassigning, setIsReassigning] = useState(false)

  // Intermediate validation state
  const [validationProspect, setValidationProspect] = useState<ReferredProspect | null>(null)
  const [validationComment, setValidationComment] = useState('')
  const [isSubmittingValidation, setIsSubmittingValidation] = useState(false)

  const loadSupervisorData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user || !['RESPONSABLE_COMMERCIAL', 'ADMIN_PARRAINAGE', 'SUPER_ADMIN'].includes(user.role)) {
        router.push('/programme-ambassadeur/connexion')
        return
      }
      setSupervisorUser(user)

      // Fetch all referred prospects
      const prospectsSnaps = await dbGetDocs("referred_prospects")
      const prospectsList = prospectsSnaps.map(s => s.data() as ReferredProspect)
      setTeamProspects(prospectsList)

      // Fetch all commercials
      const usersSnaps = await dbGetDocs("users")
      const usersList = usersSnaps.map(s => s.data() as UserProfile)
      const commercialList = usersList.filter(u => u.role === 'COMMERCIAL')
      setCommercials(commercialList)

      // Calculate performance metrics
      const perfList: CommercialPerformance[] = commercialList.map(comm => {
        const assigned = prospectsList.filter(p => p.assignedCommercialId === comm.uid)
        const conversions = assigned.filter(p => p.status === 'inscription_validee').length
        const rate = assigned.length > 0 ? Math.round((conversions / assigned.length) * 100) : 0
        
        return {
          uid: comm.uid,
          name: comm.displayName,
          assignedLeads: assigned.length,
          completedTasks: Math.floor(assigned.length * 1.5), // simulated count
          conversions,
          conversionRate: rate
        }
      })
      setTeamPerformance(perfList)

    } catch (e) {
      console.error("Failed to load supervisor workspace:", e)
    }
  }

  useEffect(() => {
    loadSupervisorData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReassignLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProspect || !newCommercialId || isReassigning || !supervisorUser) return
    setIsReassigning(true)

    try {
      const commSnap = await dbGetDoc("users", newCommercialId)
      const commName = commSnap.exists() ? (commSnap.data() as UserProfile).displayName : "Nouveau Commercial"

      await dbUpdateDoc("referred_prospects", selectedProspect.id, {
        assignedCommercialId: newCommercialId,
        updatedAt: new Date().toISOString()
      })

      // Log in history
      await logCommercialActivity(
        selectedProspect.id,
        supervisorUser.uid,
        "pipeline_change",
        `Dossier réassigné au commercial : ${commName} par le responsable.`,
        selectedProspect.status,
        selectedProspect.status
      )

      alert("Prospect réassigné avec succès !")
      setSelectedProspect(null)
      setNewCommercialId('')
      await loadSupervisorData()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la réassignation.")
    } finally {
      setIsReassigning(false)
    }
  }

  const handleIntermediateValidation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validationProspect || isSubmittingValidation || !supervisorUser) return
    setIsSubmittingValidation(true)

    try {
      // Advance to payment verification / orientation done
      const nextStatus = validationProspect.status === 'nouveau_prospect' || validationProspect.status === 'a_contacter'
        ? 'orientation_effectuee'
        : 'dossier_commence'

      await dbUpdateDoc("referred_prospects", validationProspect.id, {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      })

      await logCommercialActivity(
        validationProspect.id,
        supervisorUser.uid,
        "pipeline_change",
        `Validation intermédiaire du responsable. Dossier qualifié conforme. Action : ${validationComment}`,
        validationProspect.status,
        nextStatus
      )

      alert("Validation intermédiaire enregistrée !")
      setValidationProspect(null)
      setValidationComment('')
      await loadSupervisorData()
    } catch (err) {
      console.error(err)
      alert("Erreur de validation.")
    } finally {
      setIsSubmittingValidation(false)
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/programme-ambassadeur/connexion')
  }

  // Dashboard calculations
  const totalLeads = teamProspects.length
  const totalConversions = teamProspects.filter(p => p.status === 'inscription_validee').length
  const avgConvRate = totalLeads > 0 ? Math.round((totalConversions / totalLeads) * 100) : 0
  const pendingValidationCount = teamProspects.filter(p => ['nouveau_prospect', 'a_contacter', 'dossier_commence'].includes(p.status)).length

  return (
    <div className="min-h-screen pt-28 pb-24 text-left" style={{ background: 'var(--galf-bg)' }}>
      <div className="container-galf">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-galf-yellow">Console Supervision</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Espace Responsable Commercial</h2>
            <div className="text-xs text-white/50 mt-1">
              Responsable : <strong className="text-white">{supervisorUser?.displayName}</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/programme-ambassadeur/commercial" className="px-5 py-3 rounded-xl bg-galf-surface border border-galf-border text-white text-xs font-black uppercase hover:bg-white/5 transition-all">
              Vue Commercial
            </Link>
            {['ADMIN_PARRAINAGE', 'SUPER_ADMIN'].includes(supervisorUser?.role || '') && (
              <Link href="/programme-ambassadeur/admin" className="px-5 py-3 rounded-xl bg-galf-surface border border-galf-border text-white text-xs font-black uppercase hover:bg-white/5 transition-all">
                Console Admin
              </Link>
            )}
            <button onClick={handleSignOut} className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase hover:bg-red-500/20 transition-all">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Global KPIs Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Leads Parrainés", val: totalLeads, icon: Users, color: "text-blue-400 bg-blue-500/10" },
            { label: "Dossiers à Qualifier", val: pendingValidationCount, icon: BarChart3, color: "text-yellow-400 bg-yellow-500/10" },
            { label: "Inscriptions Validées", val: totalConversions, icon: CheckCircle, color: "text-green-400 bg-green-500/10" },
            { label: "Taux de Conversion Moyen", val: `${avgConvRate}%`, icon: TrendingUp, color: "text-purple-400 bg-purple-500/10" }
          ].map((kpi, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 text-left">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono">{kpi.val}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* TEAM PERFORMANCE BOARD (Width: 8/12) */}
          <div className="lg:col-span-8 glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Performance de l'Équipe Commerciale</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead className="border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="pb-3 text-left">Commercial</th>
                    <th className="pb-3 text-center">Prospects Attribués</th>
                    <th className="pb-3 text-center">Tâches Effectuées</th>
                    <th className="pb-3 text-center font-mono">Conversions</th>
                    <th className="pb-3 text-right">Taux de conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {teamPerformance.map(comm => (
                    <tr key={comm.uid} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-galf-yellow/10 flex items-center justify-center text-galf-yellow text-[10px] font-black">
                          {comm.name.slice(0, 2).toUpperCase()}
                        </div>
                        {comm.name}
                      </td>
                      <td className="py-4 text-center font-mono text-white/70">{comm.assignedLeads}</td>
                      <td className="py-4 text-center font-mono text-white/70">{comm.completedTasks}</td>
                      <td className="py-4 text-center font-mono text-green-400 font-bold">{comm.conversions}</td>
                      <td className="py-4 text-right">
                        <span className={`px-2 py-0.5 rounded font-black font-mono ${
                          comm.conversionRate >= 40 ? 'text-green-400 bg-green-500/10' :
                          comm.conversionRate >= 20 ? 'text-yellow-400 bg-yellow-500/10' :
                          'text-white/40 bg-white/5'
                        }`}>
                          {comm.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DÉPARTEMENTS / CENTRES ANALYTICS (Width: 4/12) */}
          <div className="lg:col-span-4 glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Répartition par Centres</h3>
              
              <div className="space-y-4">
                {[
                  { name: "Chantier-École Yopougon (Abidjan)", count: teamProspects.filter(p => p.preferredCenterId.includes("Yopougon") || p.preferredCenterId.includes("Abidjan")).length },
                  { name: "Centre Pratique San Pedro", count: teamProspects.filter(p => p.preferredCenterId.includes("San Pedro")).length },
                  { name: "Centre Pratique Korhogo", count: teamProspects.filter(p => p.preferredCenterId.includes("Korhogo")).length }
                ].map((center, idx) => {
                  const percent = totalLeads > 0 ? Math.round((center.count / totalLeads) * 100) : 0
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-white/70">
                        <span>{center.name}</span>
                        <span className="font-mono text-white">{center.count} leads ({percent}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-galf-yellow" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-xs text-white/50 leading-relaxed bg-galf-yellow/5 p-4 rounded-xl border border-galf-yellow/20">
              <strong className="text-white block mb-1">💡 Règle de round-robin active :</strong>
              Les nouveaux prospects parrainés sont attribués automatiquement à tour de rôle aux commerciaux actifs pour garantir un traitement équitable sous 24h.
            </div>
          </div>

        </div>

        {/* PROSPECT ASSIGNATION & APPROVALS PANEL */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Piloter les Assignations & Validations Intermédiaires</h3>

          {teamProspects.length === 0 ? (
            <div className="p-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl bg-black/10">
              Aucun prospect parrainé n'a été enregistré.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead className="border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="pb-3 text-left">Candidat</th>
                    <th className="pb-3 text-left">Formation</th>
                    <th className="pb-3 text-left">Commercial assigné</th>
                    <th className="pb-3 text-center">Pipeline</th>
                    <th className="pb-3 text-right">Actions de supervision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {teamProspects.map(p => {
                    const formation = GALF_FORMATIONS.find(f => f.id === p.desiredFormationId)
                    const commercial = commercials.find(c => c.uid === p.assignedCommercialId)
                    
                    const isCandidateValidable = ['nouveau_prospect', 'a_contacter', 'dossier_commence'].includes(p.status)

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <strong className="text-white uppercase block">{p.fullName}</strong>
                          <span className="text-[10px] text-white/40 font-mono">{p.phone} · Ville: {p.city}</span>
                        </td>
                        <td className="py-4 text-white/70">{formation ? formation.name : "Formation BTP"}</td>
                        <td className="py-4">
                          {commercial ? (
                            <span className="font-bold text-white">{commercial.displayName}</span>
                          ) : (
                            <span className="text-red-400 font-bold">Non attribué</span>
                          )}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                            p.status === 'inscription_validee' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            p.status === 'fraude_suspectee' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-white/5 text-white/50 border-white/10'
                          }`}>
                            {p.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setSelectedProspect(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-galf-surface border border-galf-border text-galf-yellow font-black text-[9px] uppercase hover:bg-white/5 transition-all"
                            >
                              Réassigner
                            </button>
                            {isCandidateValidable && (
                              <button 
                                onClick={() => setValidationProspect(p)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase hover:bg-emerald-500/20 transition-all"
                              >
                                Valider Dossier
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: RE-ASSIGN COMMERCIAL */}
      {selectedProspect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1A1A1D] border-white/10 max-w-md w-full text-left relative">
            <h3 className="text-lg font-black text-white mb-2 uppercase">Réassigner le Prospect</h3>
            <p className="text-xs text-white/60 mb-6">Sélectionnez le nouveau commercial responsable de ce dossier.</p>

            <form onSubmit={handleReassignLead} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Choisir le commercial *</label>
                <select 
                  value={newCommercialId}
                  onChange={e => setNewCommercialId(e.target.value)}
                  required
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="" disabled>Sélectionner...</option>
                  {commercials.map(comm => (
                    <option key={comm.uid} value={comm.uid}>{comm.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setSelectedProspect(null)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isReassigning || !newCommercialId}
                  className="px-6 py-3 rounded-xl bg-galf-yellow text-galf-carbon font-black text-xs uppercase hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                >
                  Confirmer réassignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INTERMEDIATE REVIEW VALIDATION */}
      {validationProspect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1A1A1D] border-white/10 max-w-md w-full text-left relative">
            <h3 className="text-lg font-black text-white mb-2 uppercase">Validation de dossier intermédiaire</h3>
            <p className="text-xs text-white/60 mb-6">Valider la conformité des justificatifs avant le contrôle financier.</p>

            <form onSubmit={handleIntermediateValidation} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/40">Candidat :</span>
                  <span className="text-white font-bold">{validationProspect.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Statut actuel :</span>
                  <span className="text-galf-yellow font-black uppercase text-[10px]">{validationProspect.status}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Remarque / Instructions de suivi *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Dossier CNI valide, acompte en cours de versement..." 
                  required
                  value={validationComment}
                  onChange={e => setValidationComment(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setValidationProspect(null)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingValidation || !validationComment}
                  className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-black text-xs uppercase hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                >
                  Valider dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
