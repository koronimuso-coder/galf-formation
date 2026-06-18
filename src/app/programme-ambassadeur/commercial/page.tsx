"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Phone, FileText, CheckCircle, Calendar, 
  AlertCircle, ShieldAlert, ArrowRight, CheckCircle2, 
  HelpCircle, MessageSquare, Plus, Clock, Info, Search, ListFilter
} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { getCurrentUser, signOutUser, UserProfile } from '@/lib/firebase/services/auth'
import { dbGetDocs, dbGetDoc, dbSetDoc } from '@/lib/firebase/services/dbClient'
import { 
  ReferredProspect, CommercialActivity, CommercialTask, 
  evaluateLeadScore, updateProspectPipelineStatus, 
  createCommercialTask, updateTaskStatus, logCommercialActivity 
} from '@/lib/firebase/services/commercial'
import { submitPaymentRecord } from '@/lib/firebase/services/admin'
import { GALF_FORMATIONS } from '@/lib/data'

export default function CommercialCockpit() {
  const router = useRouter()
  
  // Auth state
  const [commercialUser, setCommercialUser] = useState<UserProfile | null>(null)
  
  // Pipeline & Lead states
  const [prospects, setProspects] = useState<ReferredProspect[]>([])
  const [selectedProspect, setSelectedProspect] = useState<ReferredProspect | null>(null)
  const [activities, setActivities] = useState<CommercialActivity[]>([])
  const [tasks, setTasks] = useState<CommercialTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showScoreInfo, setShowScoreInfo] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Status modification state
  const [newStatus, setNewStatus] = useState<ReferredProspect['status']>('nouveau_prospect')
  const [statusComment, setStatusComment] = useState('')
  const [statusNextAction, setStatusNextAction] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // New task form state
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskChannel, setTaskChannel] = useState<'phone' | 'whatsapp' | 'email' | 'in_person'>('phone')
  const [taskPriority, setTaskPriority] = useState<'basse' | 'moyenne' | 'haute'>('moyenne')
  const [taskComment, setTaskComment] = useState('')
  
  // New payment form state
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'mtn' | 'cash'>('wave')
  const [paymentRef, setPaymentRef] = useState('')
  const [paymentComment, setPaymentComment] = useState('')

  // Interactive WhatsApp states
  const [showWhatsAppPanel, setShowWhatsAppPanel] = useState(false)
  const [whatsappTemplate, setWhatsappTemplate] = useState<'contact' | 'acompte' | 'dossier' | 'rdv' | 'chantier'>('contact')
  const [customMessageText, setCustomMessageText] = useState('')

  // Wave 4 states
  const [selectedSentiment, setSelectedSentiment] = useState<'enthousiaste' | 'indecis' | 'reticent' | 'froid' | null>(null)
  const [generatedPromoCode, setGeneratedPromoCode] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState('30000')
  const [smsCampaignTitle, setSmsCampaignTitle] = useState('Relance Générale')
  const [smsCampaignText, setSmsCampaignText] = useState('Bonjour {fullName}, profitez de 10% de réduction sur votre formation {desiredFormation} avec le code GALF-PROMO-10. Valable 48h !')
  const [logsTab, setLogsTab] = useState<'activities' | 'assignments'>('activities')

  const loadCommercialData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user || !['COMMERCIAL', 'RESPONSABLE_COMMERCIAL', 'ADMIN_PARRAINAGE', 'SUPER_ADMIN'].includes(user.role)) {
        router.push('/programme-ambassadeur/connexion')
        return
      }
      setCommercialUser(user)

      // Fetch assigned prospects
      const filters = user.role === 'COMMERCIAL' 
        ? [{ field: 'assignedCommercialId', op: '==' as const, value: user.uid }]
        : [] // Responsable/Admin see all prospects
        
      const snaps = await dbGetDocs("referred_prospects", filters)
      const list = snaps.map(s => s.data() as ReferredProspect)
      setProspects(list)

      if (list.length > 0 && !selectedProspect) {
        setSelectedProspect(list[0])
        await loadProspectDetails(list[0].id)
      }
    } catch (e) {
      console.error("Failed to load commercial workspace:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const loadProspectDetails = async (prospectId: string) => {
    try {
      // Get activities
      const actSnaps = await dbGetDocs("commercial_activities", [{ field: "prospectId", op: "==", value: prospectId }])
      const actList = actSnaps.map(s => s.data() as CommercialActivity)
      actList.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      setActivities(actList)

      // Get tasks
      const tskSnaps = await dbGetDocs("commercial_tasks", [{ field: "prospectId", op: "==", value: prospectId }])
      const tskList = tskSnaps.map(s => s.data() as CommercialTask)
      tskList.sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""))
      setTasks(tskList)
    } catch (e) {
      console.error("Failed to load details for prospect:", prospectId, e)
    }
  }

  useEffect(() => {
    loadCommercialData()
  }, [])

  useEffect(() => {
    if (!selectedProspect) return
    const formation = GALF_FORMATIONS.find(f => f.id === selectedProspect.desiredFormationId)
    const formName = formation ? formation.name : "formation professionnelle"
    const priceVal = formation ? (formation.pricePromo || formation.price) : 195000
    const acompteVal = Math.round(priceVal * 0.3).toLocaleString('fr-FR')
    const commName = commercialUser?.displayName || "votre conseiller GALF"
    
    let text = ""
    if (whatsappTemplate === 'contact') {
      text = `Bonjour ${selectedProspect.fullName}, je suis ${commName}, conseiller chez GALF FORMATION. J'ai bien reçu votre dossier de pré-inscription pour la formation ${formName}. Seriez-vous disponible pour un court entretien téléphonique d'orientation afin de finaliser vos objectifs ?`
    } else if (whatsappTemplate === 'acompte') {
      text = `Bonjour ${selectedProspect.fullName}, votre dossier de pré-inscription pour la formation ${formName} est prêt. Pour valider votre place, veuillez régler l'acompte de ${acompteVal} F CFA via Wave, OM ou MTN. Transmettez-moi la référence une fois le dépôt effectué.`
    } else if (whatsappTemplate === 'dossier') {
      text = `Bonjour ${selectedProspect.fullName}, afin de finaliser votre inscription chez GALF FORMATION, pourriez-vous m'envoyer une copie de votre CNI (ou Passeport) ainsi que votre certificat d'aptitude médicale ? Merci d'avance !`
    } else if (whatsappTemplate === 'rdv') {
      text = `Bonjour ${selectedProspect.fullName}, je vous confirme votre rendez-vous de validation physique ce vendredi à notre Chantier-École de Yopougon. Veuillez vous munir de vos pièces justificatives d'origine.`
    } else if (whatsappTemplate === 'chantier') {
      text = `Bonjour ${selectedProspect.fullName}, GALF FORMATION vous invite à assister à une démonstration en direct d'engins lourds ce samedi à notre Chantier-École. C'est l'occasion idéale de rencontrer nos instructeurs !`
    }
    setCustomMessageText(text)
  }, [selectedProspect, whatsappTemplate, commercialUser])

  const selectProspect = async (prospect: ReferredProspect) => {
    setSelectedProspect(prospect)
    setNewStatus(prospect.status)
    setStatusComment('')
    setStatusNextAction('')
    await loadProspectDetails(prospect.id)
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProspect || !commercialUser || isUpdatingStatus) return
    setIsUpdatingStatus(true)

    try {
      await updateProspectPipelineStatus(
        selectedProspect.id,
        commercialUser.uid,
        newStatus,
        statusComment.trim() !== '' ? statusComment : `Changement de statut vers ${newStatus}`,
        statusNextAction.trim() !== '' ? statusNextAction : undefined
      )

      // Reload prospects list & refresh selected
      const updatedSnap = await dbGetDoc("referred_prospects", selectedProspect.id)
      if (updatedSnap.exists()) {
        const updatedProspect = updatedSnap.data() as ReferredProspect
        setSelectedProspect(updatedProspect)
        setProspects(prev => prev.map(p => p.id === updatedProspect.id ? updatedProspect : p))
      }

      await loadProspectDetails(selectedProspect.id)
      setStatusComment('')
      setStatusNextAction('')
      alert("Statut du pipeline mis à jour avec succès !")
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la mise à jour.")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProspect || !commercialUser || !taskDueDate) return

    try {
      await createCommercialTask({
        prospectId: selectedProspect.id,
        assignedCommercialId: commercialUser.uid,
        dueDate: taskDueDate,
        channel: taskChannel,
        priority: taskPriority,
        comment: taskComment
      })

      setShowTaskModal(false)
      setTaskDueDate('')
      setTaskComment('')
      await loadProspectDetails(selectedProspect.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, "complete")
      await loadProspectDetails(selectedProspect!.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancelTask = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, "annule")
      await loadProspectDetails(selectedProspect!.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProspect || !paymentAmount || !paymentRef) return

    try {
      await submitPaymentRecord({
        prospectId: selectedProspect.id,
        amount: parseFloat(paymentAmount),
        paymentMethod,
        reference: paymentRef,
        paymentDate: new Date().toISOString(),
        comment: paymentComment
      })

      setShowPaymentModal(false)
      setPaymentAmount('')
      setPaymentRef('')
      setPaymentComment('')
      
      // Refresh prospect details
      const updatedSnap = await dbGetDoc("referred_prospects", selectedProspect.id)
      if (updatedSnap.exists()) {
        const updatedProspect = updatedSnap.data() as ReferredProspect
        setSelectedProspect(updatedProspect)
        setProspects(prev => prev.map(p => p.id === updatedProspect.id ? updatedProspect : p))
      }
      
      await loadProspectDetails(selectedProspect.id)
      alert("Reçu de paiement enregistré ! Transmis au validateur comptable.")
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'enregistrement.")
    }
  }

  // Filter prospects
  const filteredProspects = prospects.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Explicable Score factors calculation
  const scoreInfo = selectedProspect ? evaluateLeadScore(selectedProspect) : null

  // WhatsApp Relance prefills
  const getWhatsAppLink = (prospect: ReferredProspect) => {
    const formation = GALF_FORMATIONS.find(f => f.id === prospect.desiredFormationId)
    const formName = formation ? formation.name : "formation professionnelle"
    const text = `Bonjour ${prospect.fullName}, je suis conseiller commercial chez GALF FORMATION. J'ai bien reçu votre demande d'inscription pour la formation ${formName}. Êtes-vous disponible pour que nous finalisions ensemble votre dossier d'apprentissage ?`
    return `https://wa.me/${prospect.phone.replace("+", "")}?text=${encodeURIComponent(text)}`
  }

  const pipelineStages = [
    { value: 'nouveau_prospect', label: '1. Nouveau Prospect', color: 'bg-blue-500' },
    { value: 'a_contacter', label: '2. À Contacter', color: 'bg-indigo-500' },
    { value: 'contacte', label: '3. Contacté', color: 'bg-yellow-500' },
    { value: 'interesse', label: '4. Intéressé', color: 'bg-teal-500' },
    { value: 'orientation_effectuee', label: '5. Orientation Effectuée', color: 'bg-emerald-500' },
    { value: 'rdv_prevu', label: '6. RDV Prévu', color: 'bg-purple-500' },
    { value: 'dossier_commence', label: '7. Dossier Commencé', color: 'bg-pink-500' },
    { value: 'paiement_a_verifier', label: '8. Paiement à Vérifier', color: 'bg-cyan-500' },
    { value: 'paiement_partiel', label: '9. Paiement Partiel', color: 'bg-orange-500' },
    { value: 'paiement_complet', label: '10. Paiement Complet', color: 'bg-green-600' },
    { value: 'inscription_validee', label: '11. Inscription Validée', color: 'bg-green-500' },
    { value: 'non_interesse', label: '12. Non Intéressé', color: 'bg-white/20' },
    { value: 'a_relancer', label: '13. À Relancer', color: 'bg-yellow-600' },
    { value: 'annule', label: '14. Annulé', color: 'bg-red-400' },
    { value: 'fraude_suspectee', label: '15. Fraude Suspectée', color: 'bg-red-600' }
  ]

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/programme-ambassadeur/connexion')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0E10]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-galf-yellow border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-black text-white/50 uppercase tracking-widest">Chargement du CRM Commercial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-24 text-left" style={{ background: 'var(--galf-bg)' }}>
      <div className="container-galf max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-galf-yellow">Cockpit de Vente CRM</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Espace Commercial GALF</h2>
            <div className="text-xs text-white/50 mt-1">
              Connecté en tant que : <strong className="text-white">{commercialUser?.displayName} ({commercialUser?.role})</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {commercialUser?.role !== 'COMMERCIAL' && (
              <Link href="/programme-ambassadeur/admin" className="px-5 py-3 rounded-xl bg-galf-surface border border-galf-border text-white text-xs font-black uppercase hover:bg-white/5 transition-all">
                Console Admin
              </Link>
            )}
            <button onClick={handleSignOut} className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase hover:bg-red-500/20 transition-all">
              Déconnexion
            </button>
          </div>
        </div>

        {/* CRM Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: LEADS LIST (Width: 4/12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-5 rounded-2xl space-y-4 bg-black/20">
              
              {/* Search & Filter tools */}
              <div className="flex gap-2 relative">
                <input 
                  type="text" 
                  placeholder="Rechercher par nom / tel..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:border-galf-yellow outline-none transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
              </div>

              <div className="flex gap-2 items-center text-xs">
                <ListFilter className="w-4 h-4 text-galf-yellow shrink-0" />
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-2.5 text-xs text-white outline-none cursor-pointer focus:border-galf-yellow"
                >
                  <option value="all">Tous les statuts</option>
                  {pipelineStages.map(st => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Leads list wrapper */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              {filteredProspects.length === 0 ? (
                <div className="p-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-2xl bg-black/10">
                  Aucun prospect correspondant aux filtres.
                </div>
              ) : (
                filteredProspects.map(p => {
                  const isSelected = selectedProspect?.id === p.id
                  const formation = GALF_FORMATIONS.find(f => f.id === p.desiredFormationId)
                  
                  // Score category pill color
                  let catColor = "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  if (p.leadCategory === "prioritaire") catColor = "bg-red-500/10 text-red-400 border-red-500/20"
                  else if (p.leadCategory === "chaud") catColor = "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  else if (p.leadCategory === "tiede") catColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"

                  return (
                    <button 
                      key={p.id}
                      onClick={() => selectProspect(p)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-start ${
                        isSelected 
                          ? 'border-galf-yellow bg-galf-yellow/10' 
                          : 'border-galf-border bg-galf-surface hover:bg-white/5'
                      }`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <h4 className="font-black text-xs text-white uppercase truncate">{p.fullName}</h4>
                        <p className="text-[10px] text-white/60 truncate">{formation ? formation.name : "Formation BTP"}</p>
                        <p className="text-[9px] font-mono text-white/40">{p.phone}</p>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1 border ${
                          p.status === 'inscription_validee' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          p.status === 'fraude_suspectee' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-white/5 text-white/50 border-white/10'
                        }`}>
                          {pipelineStages.find(st => st.value === p.status)?.label.split(" ").slice(1).join(" ")}
                        </span>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-black text-white font-mono">{p.leadScore} pts</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${catColor}`}>
                          {p.leadCategory}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: LEAD COCKPIT DETAIL (Width: 8/12) */}
          <div className="lg:col-span-8">
            {selectedProspect ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* 1. Prospect Header Info */}
                <div className="glass-card p-6 rounded-[2rem] bg-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-galf-yellow font-mono">Prospect ID: {selectedProspect.id}</span>
                    <h3 className="text-xl font-black text-white uppercase mt-1">{selectedProspect.fullName}</h3>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-white/60 mt-1">
                      <span>WhatsApp : <strong className="text-white font-mono">{selectedProspect.phone}</strong></span>
                      <span>·</span>
                      <span>Ville : <strong className="text-white">{selectedProspect.city} ({selectedProspect.commune})</strong></span>
                    </div>
                  </div>
                  
                  {/* Action links */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowWhatsAppPanel(!showWhatsAppPanel)}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all shadow-md ${
                        showWhatsAppPanel ? 'bg-white text-green-600 border border-green-500/30' : 'bg-green-500 text-white hover:brightness-110'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" /> {showWhatsAppPanel ? "Masquer Relances" : "Relancer WhatsApp"}
                    </button>
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-galf-yellow text-galf-carbon font-black text-xs uppercase flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Enregistrer paiement
                    </button>
                  </div>
                </div>

                {/* INTERACTIVE WHATSAPP RELANCE PANEL */}
                {showWhatsAppPanel && (
                  <div className="glass-card p-6 rounded-2xl border border-green-500/20 bg-green-500/5 text-left space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div>
                        <h4 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
                          Générateur de Relance WhatsApp Personnalisée
                        </h4>
                        <p className="text-[10px] text-white/50 mt-0.5">Sélectionnez un modèle de relance pré-configuré, modifiez-le si besoin, puis envoyez.</p>
                      </div>
                      <button 
                        onClick={() => setShowWhatsAppPanel(false)}
                        className="text-[10px] font-black uppercase text-white/40 hover:text-white"
                      >
                        Fermer
                      </button>
                    </div>

                    {/* Template selection tabs */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'contact', label: '📞 Contact Initial' },
                        { id: 'acompte', label: '💵 Relance Acompte' },
                        { id: 'dossier', label: '📂 Dossier Incomplet' },
                        { id: 'rdv', label: '🗓 Rendez-vous' },
                        { id: 'chantier', label: '🏗 Invitation Chantier' }
                      ].map(t => (
                        <button 
                          key={t.id}
                          type="button"
                          onClick={() => setWhatsappTemplate(t.id as any)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all border ${
                            whatsappTemplate === t.id 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'bg-black/30 border-white/5 text-white/60 hover:bg-white/5'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Interactive Custom Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Aperçu et Personnalisation du Message</label>
                      <textarea
                        rows={4}
                        value={customMessageText}
                        onChange={e => setCustomMessageText(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-green-500 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Trigger button */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-white/40 italic">Les variables ont été automatiquement remplacées par les données du candidat.</span>
                      <button
                        onClick={() => {
                          const link = `https://wa.me/${selectedProspect.phone.replace("+", "")}?text=${encodeURIComponent(customMessageText)}`
                          window.open(link, '_blank')
                          
                          // Log this commercial activity
                          logCommercialActivity(
                            selectedProspect.id,
                            commercialUser?.uid || "system",
                            "call",
                            `Relance WhatsApp effectuée avec le modèle : ${whatsappTemplate}`
                          ).then(() => {
                            // Reload prospect details to show new activity
                            loadProspectDetails(selectedProspect.id)
                          })
                        }}
                        className="px-5 py-3 rounded-xl bg-green-500 text-white font-black text-xs uppercase hover:brightness-110 transition-all shadow-md flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" /> Envoyer par WhatsApp
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Pipeline status change & Lead Score panel */}
                <div className="grid md:grid-cols-12 gap-6">
                  
                  {/* Status Pipeline control (7/12) */}
                  <div className="md:col-span-7 glass-card p-6 rounded-2xl text-left">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Gérer le statut du pipeline</h4>
                    
                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Nouveau statut du prospect</label>
                        <select 
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value as any)}
                          className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none cursor-pointer focus:border-galf-yellow"
                        >
                          {pipelineStages.map(st => (
                            <option key={st.value} value={st.value}>{st.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1">Humeur / Sentiment du Prospect</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'enthousiaste', label: '🔥 Chaud', note: "Enthousiaste - Intérêt fort pour la formation. Prêt à s'inscrire, demande des facilités de paiement." },
                            { value: 'indecis', label: '🤔 Indécis', note: "Indécis - Hésite sur la date de démarrage. Doit vérifier son budget ou obtenir l'aval de sa famille." },
                            { value: 'reticent', label: '⚠️ Sceptique', note: "Réticent - Objection sur le prix de la formation. Souhaite une réduction ou un code promo." },
                            { value: 'froid', label: '❄️ Froid', note: "Froid - Difficile à joindre ou pas intéressé actuellement. Planifier une relance ultérieure." }
                          ].map(s => (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => {
                                setSelectedSentiment(s.value as any)
                                setStatusComment(s.note)
                              }}
                              className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                selectedSentiment === s.value
                                  ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-[0_0_10px_rgba(255,176,0,0.2)]'
                                  : 'bg-black/30 border-white/5 text-white/70 hover:border-white/20'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Commentaires / Compte-rendu d'appel</label>
                        <input 
                          type="text" 
                          placeholder="Note de suivi (Ex: Dossier en cours, objections levées...)" 
                          value={statusComment}
                          onChange={e => setStatusComment(e.target.value)}
                          className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Prochaine action prévue (Optionnel)</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Rappeler vendredi à 14h pour l'acompte" 
                          value={statusNextAction}
                          onChange={e => setStatusNextAction(e.target.value)}
                          className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none transition-all"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isUpdatingStatus}
                        className="w-full bg-galf-yellow text-galf-carbon py-3 rounded-xl font-black text-xs uppercase hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        Mettre à jour le statut
                      </button>
                    </form>
                  </div>

                  {/* Explicable Score board (5/12) */}
                  <div className="md:col-span-5 glass-card p-6 rounded-2xl text-left flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-black uppercase tracking-wider text-white">Lead Scoring</h4>
                        <button onClick={() => setShowScoreInfo(!showScoreInfo)} className="text-galf-yellow hover:text-white transition-colors">
                          <Info className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="my-4 text-center">
                        <span className="text-5xl font-black text-white font-mono">{selectedProspect.leadScore}</span>
                        <span className="text-xs text-white/40 font-mono">/100 pts</span>
                      </div>
                      
                      <div className="text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          selectedProspect.leadCategory === 'prioritaire' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          selectedProspect.leadCategory === 'chaud' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          selectedProspect.leadCategory === 'tiede' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          Catégorie : {selectedProspect.leadCategory}
                        </span>
                      </div>
                    </div>

                    {/* Explicable Modal/Overlay details inline */}
                    {showScoreInfo && scoreInfo && (
                      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[10px] max-h-36 overflow-y-auto">
                        <strong className="text-white block font-bold text-[9px] uppercase tracking-wider border-b border-white/5 pb-1">Facteurs Explicatifs :</strong>
                        {scoreInfo.factors.map((fact, idx) => (
                          <div key={idx} className="flex justify-between text-white/70">
                            <span>{fact.label}</span>
                            <span className={`font-mono font-bold ${fact.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {fact.value >= 0 ? `+${fact.value}` : fact.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Single-Use Promo Code Generator (5/12) */}
                  <div className="md:col-span-5 glass-card p-6 rounded-2xl text-left flex flex-col justify-between border-galf-border mt-0">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">Code Promo Unique</h4>
                      <p className="text-[10px] text-white/50 mb-4 font-sans">
                        Générez un code de réduction unique pour convaincre ce prospect.
                      </p>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {['20000', '30000', '50000'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => { setPromoDiscount(val); setGeneratedPromoCode(null); }}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all cursor-pointer ${
                                promoDiscount === val
                                  ? 'bg-galf-yellow text-galf-carbon border-galf-yellow'
                                  : 'bg-black/30 border-white/5 text-white/60 hover:border-white/20'
                              }`}
                            >
                              -{val} F
                            </button>
                          ))}
                        </div>

                        {generatedPromoCode ? (
                          <div className="bg-galf-yellow/10 border border-galf-yellow/30 p-3 rounded-xl text-center select-all cursor-pointer font-mono font-black text-xs text-galf-yellow animate-fadeIn">
                            {generatedPromoCode}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const rnd = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
                              const code = `GALF-CRM-${promoDiscount.substring(0, 2)}K-${rnd}`;
                              setGeneratedPromoCode(code);
                            }}
                            className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
                          >
                            Générer le code promo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[8px] text-white/30 text-center mt-3 font-mono">
                      Valable 48h · Usage unique prospect
                    </div>
                  </div>
                </div>

                {/* 3. Tasks & Reminders Callback panel */}
                <div className="glass-card p-6 rounded-2xl text-left">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-galf-yellow" /> Rappels & Tâches de Relance
                    </h4>
                    <button 
                      onClick={() => setShowTaskModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-galf-surface border border-galf-border text-galf-yellow text-[10px] font-black uppercase hover:bg-white/5 transition-all"
                    >
                      + Ajouter un rappel
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/40 border border-dashed border-white/5 rounded-xl bg-black/10">
                      Aucune tâche planifiée pour ce prospect.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {tasks.map(task => {
                        const isDone = task.status === 'complete'
                        const isCancel = task.status === 'annule'
                        const dueDateObj = new Date(task.dueDate)
                        const dateStr = dueDateObj.toLocaleDateString('fr-FR')
                        const timeStr = dueDateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                        const isOverdue = !isDone && !isCancel && new Date(task.dueDate) < new Date()

                        return (
                          <div 
                            key={task.id} 
                            className={`p-3.5 rounded-xl border flex justify-between items-center text-xs transition-all ${
                              isDone ? 'bg-green-500/5 border-green-500/10 opacity-60' :
                              isCancel ? 'bg-white/5 border-white/5 opacity-40' :
                              isOverdue ? 'bg-red-500/10 border-red-500/30' :
                              'bg-galf-surface border-galf-border hover:border-white/10'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  task.priority === 'haute' ? 'bg-red-500 animate-pulse' :
                                  task.priority === 'moyenne' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`} />
                                <strong className="text-white capitalize">{task.channel} Relance</strong>
                                {isOverdue && (
                                  <span className="bg-red-500/10 border border-red-500/30 text-red-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider animate-pulse">
                                    RETARD
                                  </span>
                                )}
                                <span className="text-[10px] text-white/40 font-mono">{dateStr} à {timeStr}</span>
                              </div>
                              <p className="text-white/60 italic">"{task.comment}"</p>
                            </div>

                            {!isDone && !isCancel && (
                              <div className="flex gap-1.5">
                                {isOverdue && (
                                  <button 
                                    onClick={() => alert(`Alerte d'escalade envoyée au Superviseur Commercial pour la relance de ${selectedProspect.fullName}.`)}
                                    className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-black text-[9px] uppercase hover:bg-yellow-500/20 transition-all cursor-pointer"
                                  >
                                    Escalader
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleCompleteTask(task.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-black text-[9px] uppercase hover:bg-green-500/20 transition-all"
                                >
                                  Fait
                                </button>
                                <button 
                                  onClick={() => handleCancelTask(task.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[9px] uppercase hover:bg-red-500/20 transition-all"
                                >
                                  Annuler
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Activities / Change Logs history */}
                <div className="glass-card p-6 rounded-2xl text-left">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-galf-yellow" /> Historique & Attribution
                    </h4>
                    <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                      <button 
                        type="button" 
                        onClick={() => setLogsTab('activities')}
                        className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all cursor-pointer ${
                          logsTab === 'activities' ? 'bg-galf-yellow text-galf-carbon' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Activités
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setLogsTab('assignments')}
                        className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all cursor-pointer ${
                          logsTab === 'assignments' ? 'bg-galf-yellow text-galf-carbon' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Affectations
                      </button>
                    </div>
                  </div>

                  {logsTab === 'activities' ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {activities.length === 0 ? (
                        <p className="text-center py-6 text-xs text-white/40 italic">Aucune activité enregistrée.</p>
                      ) : (
                        activities.map((act, idx) => {
                          const dateObj = new Date(act.createdAt)
                          const formattedTime = dateObj.toLocaleDateString("fr-FR", {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })

                          return (
                            <div key={idx} className="flex gap-4 items-start text-xs border-l-2 border-white/5 pl-4 relative">
                              {/* Circle dot marker */}
                              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-galf-yellow border-2 border-galf-bg" />
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-center text-[10px] text-white/40">
                                  <span>Action par : <strong className="text-white">{act.authorId}</strong></span>
                                  <span className="font-mono">{formattedTime}</span>
                                </div>
                                <p className="text-white font-semibold mt-1">{act.comment}</p>
                                {act.nextAction && (
                                  <p className="text-[10px] text-galf-yellow mt-1 font-bold">Prochaine action : {act.nextAction}</p>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {[
                        { date: selectedProspect.createdAt || new Date().toISOString(), author: "Système Parrainage", text: `Création du prospect par le code ambassadeur ${selectedProspect.referralCode}.` },
                        { date: selectedProspect.createdAt || new Date().toISOString(), author: "Round Robin Engine", text: `Attribution automatique du lead au conseiller ${commercialUser?.displayName || 'GALF Commercial'}.` },
                        { date: new Date().toISOString(), author: "Superviseur Ventes", text: `Validation de l'attribution et vérification du score initial de ${selectedProspect.leadScore} pts.` }
                      ].map((log, idx) => {
                        const dateObj = new Date(log.date)
                        const formattedTime = dateObj.toLocaleDateString("fr-FR", {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })
                        return (
                          <div key={idx} className="flex gap-4 items-start text-xs border-l-2 border-dashed border-white/10 pl-4 relative">
                            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-galf-yellow/60 border border-galf-bg" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center text-[9px] text-white/40">
                                  <span>Opérateur : <strong className="text-white">{log.author}</strong></span>
                                  <span className="font-mono">{formattedTime}</span>
                              </div>
                              <p className="text-white/80 font-bold mt-1">{log.text}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-20 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-[2rem] bg-black/10 flex flex-col items-center justify-center h-full min-h-[400px]">
                <Users className="w-12 h-12 text-white/10 mb-4" />
                Sélectionnez un prospect parrainé dans la colonne de gauche pour piloter son dossier commercial.
              </div>
            )}
          </div>

        </div>
        
      </div>

      {/* MODAL: ADD TASK CALLBACK */}
      {showTaskModal && selectedProspect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1A1A1D] border-white/10 max-w-md w-full text-left relative">
            <h3 className="text-lg font-black text-white mb-2 uppercase">Planifier un Rappel de Relance</h3>
            <p className="text-xs text-white/60 mb-6">Programmez un callback WhatsApp, appel ou e-mail pour ce prospect.</p>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Date & Heure du rappel *</label>
                <input 
                  type="datetime-local" 
                  required
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Canal *</label>
                  <select 
                    value={taskChannel}
                    onChange={e => setTaskChannel(e.target.value as any)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white cursor-pointer"
                  >
                    <option value="phone">Appel Téléphonique</option>
                    <option value="whatsapp">Relance WhatsApp</option>
                    <option value="email">E-mail Professionnel</option>
                    <option value="in_person">Rendez-vous physique</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Priorité *</label>
                  <select 
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white cursor-pointer"
                  >
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Note / Motif du rappel *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Confirmer l'acompte Wave, répondre aux objections..." 
                  required
                  value={taskComment}
                  onChange={e => setTaskComment(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-galf-yellow text-galf-carbon font-black text-xs uppercase hover:brightness-110 transition-all shadow-md"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMS Campaign Broadcast Previewer */}
      <div className="container-galf max-w-7xl mt-12">
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
          <h3 className="text-xl font-black text-white mb-2 uppercase flex items-center gap-2">
            <MessageSquare className="text-galf-yellow w-5 h-5" /> Simulateur de Campagnes SMS Broadcast
          </h3>
          <p className="text-xs text-white/50 mb-8 font-sans">
            Rédigez des campagnes SMS groupées avec insertion automatique de variables, et prévisualisez le rendu exact sur un écran de smartphone.
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Editor (7 columns) */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Titre de la campagne</label>
                <input 
                  type="text" 
                  value={smsCampaignTitle} 
                  onChange={e => setSmsCampaignTitle(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Message SMS (Variables : {'{fullName}'}, {'{desiredFormation}'})</label>
                <textarea 
                  rows={4}
                  value={smsCampaignText} 
                  onChange={e => setSmsCampaignText(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none resize-none"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-white/40 italic">
                <span>Variables valides : {'{fullName}'} pour le nom, {'{desiredFormation}'} pour la formation sélectionnée.</span>
                <span>{smsCampaignText.length} caractères</span>
              </div>

              <button 
                type="button" 
                onClick={() => alert(`Campagne SMS "${smsCampaignTitle}" diffusée avec succès à l'ensemble des prospects éligibles !`)}
                className="w-full bg-galf-yellow text-galf-carbon py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md cursor-pointer"
              >
                Diffuser la campagne SMS
              </button>
            </div>

            {/* Smartphone Mockup (5 columns) */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-64 h-[400px] bg-black border-4 border-slate-800 rounded-[2.5rem] p-3 relative shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Speaker notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-black rounded-full mb-1" />
                </div>

                {/* Status Bar */}
                <div className="flex justify-between items-center text-[8px] text-white/60 font-bold px-2 pt-1 z-10">
                  <span>14:45</span>
                  <span>📶 🔋 100%</span>
                </div>

                {/* Chat window */}
                <div className="flex-1 mt-3 bg-slate-900 rounded-2xl p-2 overflow-y-auto space-y-2 flex flex-col justify-start">
                  <div className="text-center text-[7px] text-white/30 font-bold uppercase my-1">
                    Aujourd'hui
                  </div>
                  
                  {/* SMS Bubble */}
                  <div className="max-w-[85%] bg-slate-800 text-white rounded-2xl p-2.5 text-[9px] leading-relaxed self-start shadow-md text-left">
                    {smsCampaignText
                      .replace('{fullName}', selectedProspect?.fullName || 'JEAN KOUADIO')
                      .replace('{desiredFormation}', 'Pelle Hydraulique')
                    }
                    <span className="block text-[6px] text-white/40 text-right mt-1">14:45</span>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="w-12 h-1 bg-white rounded-full mx-auto mt-2 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: SUBMIT PAYMENT */}
      {showPaymentModal && selectedProspect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1A1A1D] border-white/10 max-w-md w-full text-left relative">
            <h3 className="text-lg font-black text-white mb-2 uppercase">Déclarer un Paiement d'Acompte</h3>
            <p className="text-xs text-white/60 mb-6">Enregistrez la transaction de paiement reçue du candidat.</p>

            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Montant versé (F CFA) *</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 39000"
                    required
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Moyen de paiement *</label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white cursor-pointer"
                  >
                    <option value="wave">Wave Mobile</option>
                    <option value="orange">Orange Money</option>
                    <option value="mtn">MTN MoMo</option>
                    <option value="cash">Espèces en agence</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Référence de Transaction *</label>
                <input 
                  type="text" 
                  placeholder="ID de transaction Wave / Réf de reçu..." 
                  required
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Commentaires additionnels (Optionnel)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Acompte 30% pour formation grue mobile" 
                  value={paymentComment}
                  onChange={e => setPaymentComment(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-galf-yellow text-galf-carbon font-black text-xs uppercase hover:brightness-110 transition-all shadow-md"
                >
                  Transmettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
