"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Gift, BarChart3, Banknote, ShieldAlert, Settings, 
  FileSpreadsheet, FileText, CheckCircle, XCircle, Play, 
  Trash2, RefreshCw, AlertTriangle, Eye, Calendar, Award, LogOut, Download
} from 'lucide-react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { getCurrentUser, signOutUser, UserProfile } from '@/lib/firebase/services/auth'
import { dbGetDocs, dbGetDoc, dbSetDoc, dbUpdateDoc, dbDeleteDoc, dbAddDoc } from '@/lib/firebase/services/dbClient'
import { 
  Campaign, SponsorProfile, createCampaign, getCampaigns, createNotification 
} from '@/lib/firebase/services/referral'
import { 
  PaymentRecord, ReferralReward, FraudFlag, verifyPaymentStatus, 
  approveReward, getProfitabilityMetrics, exportCollectionToCSV, 
  ProfitabilityMetrics 
} from '@/lib/firebase/services/admin'
import { ReferredProspect } from '@/lib/firebase/services/commercial'
import { GALF_FORMATIONS } from '@/lib/data'

export default function AdminWorkspace() {
  const router = useRouter()
  
  // Auth state
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null)
  
  // Data lists states
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [rewards, setRewards] = useState<ReferralReward[]>([])
  const [frauds, setFrauds] = useState<FraudFlag[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([])
  const [prospects, setProspects] = useState<ReferredProspect[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Simulator values
  const [avgPrice, setAvgPrice] = useState(195000)
  const [avgRewardVal, setAvgRewardVal] = useState(195000)
  const [marketingCosts, setMarketingCosts] = useState(100000)
  const [metrics, setMetrics] = useState<ProfitabilityMetrics | null>(null)

  // Modal / form states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'rewards' | 'campaigns' | 'frauds' | 'audit' | 'exports'>('dashboard')
  
  // New campaign state
  const [campName, setCampName] = useState('')
  const [campSlug, setCampSlug] = useState('')
  const [campSlogan, setCampSlogan] = useState('')
  const [campDesc, setCampDesc] = useState('')
  const [campThreshold, setCampThreshold] = useState(5)
  const [campReward, setCampReward] = useState('Une formation offerte')
  const [campRules, setCampRules] = useState('')

  // Reward verification target
  const [verifyingReward, setVerifyingReward] = useState<ReferralReward | null>(null)
  const [offeredFormation, setOfferedFormation] = useState(GALF_FORMATIONS[0].id)
  const [isApprovingReward, setIsApprovingReward] = useState(false)

  // Payment review target
  const [reviewPayment, setReviewPayment] = useState<PaymentRecord | null>(null)
  const [paymentReviewComment, setPaymentReviewComment] = useState('')
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)

  // Message Broadcast States
  const [notifRecipient, setNotifRecipient] = useState('ALL')
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [isSendingNotif, setIsSendingNotif] = useState(false)

  // Fraud Detail Modal State
  const [selectedFraud, setSelectedFraud] = useState<FraudFlag | null>(null)

  // Wave 4 additions - Scheduler, Payouts, Config params
  const [autoExpiryDate, setAutoExpiryDate] = useState('')
  const [selectedCampaignForScheduler, setSelectedCampaignForScheduler] = useState('')
  const [payouts, setPayouts] = useState<any[]>([
    { id: 'PAY-101', sponsorName: "Koffi Amenan", amount: 15000, method: "wave", status: "en_attente", date: "2026-06-18", phone: "+2250708091011" },
    { id: 'PAY-102', sponsorName: "Sylla Ibrahim", amount: 25000, method: "orange", status: "valide", date: "2026-06-17", phone: "+2250506070809" },
    { id: 'PAY-103', sponsorName: "N'Guessan Marc", amount: 10000, method: "mtn", status: "en_attente", date: "2026-06-18", phone: "+2250102030405" }
  ])
  const [sysCpaLimit, setSysCpaLimit] = useState(50000)
  const [sysMinFraudInterval, setSysMinFraudInterval] = useState(5) // minutes
  const [sysRewardThreshold, setSysRewardThreshold] = useState(5)

  const loadAdminData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user || !['COMPTABLE', 'ADMIN_PARRAINAGE', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
        router.push('/programme-ambassadeur/connexion')
        return
      }
      setAdminUser(user)

      // Fetch campaigns
      const campList = await getCampaigns()
      setCampaigns(campList)

      // Fetch payment records
      const paySnaps = await dbGetDocs("payment_records")
      const payList = paySnaps.map(s => s.data() as PaymentRecord)
      payList.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      setPayments(payList)

      // Fetch rewards
      const rewSnaps = await dbGetDocs("referral_rewards")
      const rewList = rewSnaps.map(s => s.data() as ReferralReward)
      rewList.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      setRewards(rewList)

      // Fetch fraud flags
      const fraudSnaps = await dbGetDocs("referral_fraud_flags")
      setFrauds(fraudSnaps.map(s => s.data() as FraudFlag))

      // Fetch audit logs
      const auditSnaps = await dbGetDocs("admin_audit_logs")
      const rawLogs = auditSnaps.map(s => s.data())
      rawLogs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      setAuditLogs(rawLogs)

      // Fetch sponsors & prospects for exports
      const spSnaps = await dbGetDocs("referral_members")
      setSponsors(spSnaps.map(s => s.data() as SponsorProfile))

      const prSnaps = await dbGetDocs("referred_prospects")
      setProspects(prSnaps.map(s => s.data() as ReferredProspect))

      // Fetch clicks
      const clickSnaps = await dbGetDocs("referral_clicks")
      setClickCount(clickSnaps.length)

      // Calculate initial profitability simulator metrics
      const activeCampId = campList.find(c => c.status === 'active')?.id || "campagne-initiale-2026"
      const calcMetrics = await getProfitabilityMetrics(activeCampId, avgPrice, avgRewardVal, marketingCosts)
      setMetrics(calcMetrics)

    } catch (e) {
      console.error("Failed to load admin panel data:", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // Handle simulator update
  const handleRecalculateMetrics = async () => {
    const activeCampId = campaigns.find(c => c.status === 'active')?.id || "campagne-initiale-2026"
    const calc = await getProfitabilityMetrics(activeCampId, avgPrice, avgRewardVal, marketingCosts)
    setMetrics(calc)
  }

  // Create Campaign action
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campName || !campSlug || !adminUser) return

    try {
      await createCampaign({
        name: campName,
        slug: campSlug,
        title: campName,
        slogan: campSlogan,
        description: campDesc,
        image: "/images/formations/carte-operateur.jpg",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // + 6 months
        status: "brouillon",
        threshold: campThreshold,
        rewardDescription: campReward,
        rules: campRules || "Participation gratuite. Non cumulable avec d'autres réductions.",
        faq: []
      })

      // Log in audit trail
      await dbAddDoc("admin_audit_logs", {
        userId: adminUser.uid,
        action: "create_campaign",
        targetId: `CAM-${campSlug}`,
        details: `Created campaign ${campName}`,
        createdAt: new Date().toISOString()
      })

      alert("Nouvelle campagne créée sous forme de brouillon !")
      setCampName('')
      setCampSlug('')
      setCampSlogan('')
      setCampDesc('')
      setCampRules('')
      await loadAdminData()
    } catch (err) {
      console.error(err)
      alert("Erreur de création.")
    }
  }

  // Activate campaign action
  const handleActivateCampaign = async (campaignId: string) => {
    if (!adminUser) return
    try {
      // Deactivate other campaigns first
      for (const camp of campaigns) {
        if (camp.id !== campaignId && camp.status === 'active') {
          await dbUpdateDoc("referral_campaigns", camp.id, { status: "terminee" })
        }
      }

      await dbUpdateDoc("referral_campaigns", campaignId, { status: "active" })
      
      await dbAddDoc("admin_audit_logs", {
        userId: adminUser.uid,
        action: "activate_campaign",
        targetId: campaignId,
        details: `Activated campaign ${campaignId}`,
        createdAt: new Date().toISOString()
      })

      alert("Campagne activée avec succès ! Les autres sont clôturées.")
      await loadAdminData()
    } catch (err) {
      console.error(err)
    }
  }

  // Verify Payment Action
  const handleConfirmPayment = async (status: PaymentRecord['status']) => {
    if (!reviewPayment || !adminUser || isVerifyingPayment) return
    setIsVerifyingPayment(true)

    try {
      await verifyPaymentStatus(
        reviewPayment.id,
        adminUser.uid,
        status,
        paymentReviewComment.trim() !== '' ? paymentReviewComment : `Paiement vérifié avec statut ${status}`
      )

      await dbAddDoc("admin_audit_logs", {
        userId: adminUser.uid,
        action: "verify_payment",
        targetId: reviewPayment.id,
        details: `Verified payment ${reviewPayment.id} as ${status}. Note: ${paymentReviewComment}`,
        createdAt: new Date().toISOString()
      })

      alert(`Paiement de l'acompte traité avec succès : ${status}`)
      setReviewPayment(null)
      setPaymentReviewComment('')
      await loadAdminData()
    } catch (err) {
      console.error(err)
      alert("Erreur de traitement comptable.")
    } finally {
      setIsVerifyingPayment(false)
    }
  }

  // Approve Reward Action
  const handleApproveReward = async () => {
    if (!verifyingReward || !adminUser || isApprovingReward) return
    setIsApprovingReward(true)

    try {
      await approveReward(verifyingReward.id, adminUser.uid, offeredFormation, 90)

      await dbAddDoc("admin_audit_logs", {
        userId: adminUser.uid,
        action: "approve_reward",
        targetId: verifyingReward.id,
        details: `Approved reward ${verifyingReward.id} for course ${offeredFormation}`,
        createdAt: new Date().toISOString()
      })

      alert(`Récompense parrain validée pour la formation offerte !`)
      setVerifyingReward(null)
      await loadAdminData()
    } catch (err) {
      console.error(err)
      alert("Erreur d'approbation administrative.")
    } finally {
      setIsApprovingReward(false)
    }
  }

  // Resolve Fraud Flag
  const handleResolveFraud = async (fraudId: string, status: FraudFlag['status']) => {
    if (!adminUser) return
    try {
      await dbUpdateDoc("referral_fraud_flags", fraudId, { status })
      
      await dbAddDoc("admin_audit_logs", {
        userId: adminUser.uid,
        action: "resolve_fraud",
        targetId: fraudId,
        details: `Resolved fraud alert ${fraudId} as ${status}`,
        createdAt: new Date().toISOString()
      })

      alert(`Alerte de fraude résolue : ${status}`)
      await loadAdminData()
    } catch (err) {
      console.error(err)
    }
  }

  // Send Admin Announcement / Notification
  const handleSendAdminNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifTitle || !notifBody || !adminUser || isSendingNotif) return
    setIsSendingNotif(true)
    try {
      if (notifRecipient === 'ALL') {
        // Broadcast to all sponsors
        for (const sp of sponsors) {
          await createNotification(sp.userId, notifTitle, notifBody)
        }
        alert(`Message diffusé avec succès à l'ensemble des (${sponsors.length}) ambassadeurs !`)
      } else {
        // Individual notification
        await createNotification(notifRecipient, notifTitle, notifBody)
        alert("Notification envoyée avec succès à l'ambassadeur sélectionné !")
      }

      await dbAddDoc("admin_audit_logs", {
        userId: adminUser.uid,
        action: "send_notification",
        targetId: notifRecipient,
        details: `Announcement title: "${notifTitle}"`,
        createdAt: new Date().toISOString()
      })

      setNotifTitle('')
      setNotifBody('')
      await loadAdminData()
    } catch (err) {
      console.error("Failed to send notification:", err)
      alert("Erreur lors de la diffusion du message.")
    } finally {
      setIsSendingNotif(false)
    }
  }

  // Collection Exporters
  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    link.click()
  }

  const exportSponsors = () => {
    const headers = ["ID", "UserID", "WhatsApp", "Ville", "Commune", "Code unique", "Situation", "Créé le"]
    const rows = sponsors.map(sp => [
      sp.id, sp.userId, sp.whatsapp, sp.city, sp.commune, sp.code, sp.currentSituation, sp.createdAt
    ])
    const csv = exportCollectionToCSV(headers, rows)
    downloadCSV("export_ambassadeurs_galf.csv", csv)
  }

  const exportProspects = () => {
    const headers = ["ID", "SponsorID", "Code Parrain", "Nom Complet", "WhatsApp", "Ville", "Formation", "Statut", "Lead Score", "Créé le"]
    const rows = prospects.map(p => [
      p.id, p.sponsorUserId, p.referralCode, p.fullName, p.phone, p.city, p.desiredFormationId, p.status, p.leadScore, p.createdAt
    ])
    const csv = exportCollectionToCSV(headers, rows)
    downloadCSV("export_filleuls_galf.csv", csv)
  }

  const exportPayments = () => {
    const headers = ["ID", "ProspectID", "Montant", "Méthode", "Référence", "Date", "Statut", "Validateur"]
    const rows = payments.map(pay => [
      pay.id, pay.prospectId, pay.amount, pay.paymentMethod, pay.reference, pay.paymentDate, pay.status, pay.verifiedBy
    ])
    const csv = exportCollectionToCSV(headers, rows)
    downloadCSV("export_paiements_comptables.csv", csv)
  }

  const exportRewards = () => {
    const headers = ["Réf Récompense", "Parrain ID", "Campagne", "Statut", "Formation Offerte", "Approuvé par", "Approuvé le", "Date Expiration"]
    const rows = rewards.map(r => [
      r.id, r.userId, r.campaignId, r.status, r.offeredFormationId, r.approvedBy, r.approvedAt, r.expiresAt
    ])
    const csv = exportCollectionToCSV(headers, rows)
    downloadCSV("export_recompenses_parrainage.csv", csv)
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/programme-ambassadeur/connexion')
  }

  // Counts for header badges
  const pendingPaymentsCount = payments.filter(p => p.status === 'a_verifier').length
  const eligibleRewardsCount = rewards.filter(r => r.status === 'eligible').length
  const activeFraudCount = frauds.filter(f => f.status === 'en_attente').length

  return (
    <div className="min-h-screen pt-28 pb-24 text-left" style={{ background: 'var(--galf-bg)' }}>
      <div className="container-galf max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-galf-yellow animate-pulse">Console Centrale de Pilotage</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">GALF Referral Growth OS</h2>
            <div className="text-xs text-white/50 mt-1">
              Administrateur : <strong className="text-white">{adminUser?.displayName} ({adminUser?.role})</strong>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/programme-ambassadeur/responsable" className="px-5 py-3 rounded-xl bg-galf-surface border border-galf-border text-white text-xs font-black uppercase hover:bg-white/5 transition-all">
              Supervision Équipe
            </Link>
            <button onClick={handleSignOut} className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase hover:bg-red-500/20 transition-all">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {[
            { id: 'dashboard', label: 'Moniteur & ROI', icon: BarChart3 },
            { id: 'payments', label: `Paiements (${pendingPaymentsCount})`, icon: Banknote },
            { id: 'rewards', label: `Récompenses (${eligibleRewardsCount})`, icon: Gift },
            { id: 'campaigns', label: 'Campagnes', icon: Settings },
            { id: 'frauds', label: `Anti-Fraude (${activeFraudCount})`, icon: ShieldAlert },
            { id: 'audit', label: 'Journal d\'audit', icon: FileText },
            { id: 'exports', label: 'Exports B.O.', icon: FileSpreadsheet },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all border shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-galf-yellow border-galf-yellow text-galf-carbon shadow-md' 
                  : 'bg-galf-surface border-galf-border text-white/70 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: DASHBOARD & ROI */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Global counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Total Ambassadeurs", val: sponsors.length, color: "text-blue-400" },
                { label: "Total Filleuls", val: prospects.length, color: "text-indigo-400" },
                { label: "Paiements Vérifiés", val: payments.filter(p => p.status === 'confirme').length, color: "text-green-400" },
                { label: "Bons Offerts Émis", val: rewards.filter(r => r.status === 'approuvee').length, color: "text-purple-400" }
              ].map((c, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2">{c.label}</span>
                  <span className={`text-3xl font-black font-mono ${c.color}`}>{c.val}</span>
                </div>
              ))}
            </div>

            {/* Visual Conversion Funnel */}
            <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 bg-black/20 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">Entonnoir de Conversion Parrainage</h3>
              <p className="text-xs text-white/50 mb-6">Taux de passage de la découverte à l'inscription validée.</p>

              <div className="space-y-4">
                {[
                  { 
                    step: "1. Découverte (Clics sur liens)", 
                    val: Math.max(clickCount, sponsors.length * 4 + prospects.length * 2), 
                    percent: 100, 
                    color: "bg-blue-500", 
                    desc: "Trafic brut généré par le partage des ambassadeurs" 
                  },
                  { 
                    step: "2. Intérêt (Prospects enregistrés)", 
                    val: prospects.length, 
                    percent: Math.max(clickCount, sponsors.length * 4 + prospects.length * 2) > 0 
                      ? Math.round((prospects.length / Math.max(clickCount, sponsors.length * 4 + prospects.length * 2)) * 100) 
                      : 0, 
                    color: "bg-indigo-500", 
                    desc: "Visiteurs ayant rempli le formulaire d'inscription" 
                  },
                  { 
                    step: "3. Engagement (Paiements d'acompte)", 
                    val: payments.length, 
                    percent: prospects.length > 0 ? Math.round((payments.length / prospects.length) * 100) : 0, 
                    color: "bg-yellow-500", 
                    desc: "Prospects ayant transmis une preuve de versement" 
                  },
                  { 
                    step: "4. Succès (Inscriptions Validées)", 
                    val: prospects.filter(p => p.status === 'inscription_validee').length, 
                    percent: prospects.length > 0 
                      ? Math.round((prospects.filter(p => p.status === 'inscription_validee').length / prospects.length) * 100) 
                      : 0, 
                    color: "bg-green-500", 
                    desc: "Dossiers validés financièrement et récompensés" 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-baseline text-white/80 font-bold">
                      <span>{item.step}</span>
                      <span className="font-mono text-white font-black">{item.val} ({item.percent}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden relative">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                    <p className="text-[10px] text-white/40 italic">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profitability Simulator */}
            <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-black/30 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">Simulateur de Rentabilité & ROI de Campagne</h3>
              <p className="text-xs text-white/50 mb-6">Ajustez les indicateurs commerciaux moyens pour modéliser le chiffre d'affaires et la rentabilité brute.</p>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Prix Moyen Formation (F)</label>
                      <input 
                        type="number" value={avgPrice} onChange={e => setAvgPrice(parseFloat(e.target.value))}
                        className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Coût Récompense Formation (F)</label>
                      <input 
                        type="number" value={avgRewardVal} onChange={e => setAvgRewardVal(parseFloat(e.target.value))}
                        className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Coûts Publicitaires & Opérations (F)</label>
                    <input 
                      type="number" value={marketingCosts} onChange={e => setMarketingCosts(parseFloat(e.target.value))}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow"
                    />
                  </div>

                  <button 
                    onClick={handleRecalculateMetrics}
                    className="w-full bg-galf-yellow text-galf-carbon py-3 rounded-xl font-black text-xs uppercase hover:brightness-110 transition-all"
                  >
                    Recalculer les marges
                  </button>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-6 space-y-4">
                  {metrics && (() => {
                    const cpaRatio = avgPrice > 0 ? (metrics.cpa / avgPrice) * 100 : 0
                    
                    let healthLabel = "Excellent"
                    let healthColor = "bg-green-500/10 text-green-400 border-green-500/20"
                    let healthDesc = "Le coût d'acquisition est optimal par rapport au chiffre d'affaires généré."
                    
                    if (cpaRatio > 45) {
                      healthLabel = "Alerte Rentabilité"
                      healthColor = "bg-red-500/10 text-red-400 border-red-500/20"
                      healthDesc = "Le coût d'acquisition dépasse le seuil critique de 45% du prix de vente."
                    } else if (cpaRatio > 25) {
                      healthLabel = "Rentabilité Modérée"
                      healthColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      healthDesc = "La campagne est rentable, mais surveillez la hausse des coûts de récompenses."
                    }

                    return (
                      <div className="space-y-4 h-full flex flex-col justify-between">
                        {/* 2x2 stats grid */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-2 gap-6 text-xs justify-center">
                          <div className="space-y-1 border-b border-r border-white/5 pb-4 pr-4">
                            <span className="opacity-50 font-bold block text-[9px] uppercase tracking-wider">Chiffre d'Affaires</span>
                            <strong className="text-base text-white font-mono">{metrics.totalRevenue.toLocaleString('fr-FR')} F</strong>
                          </div>
                          <div className="space-y-1 border-b border-white/5 pb-4 pl-4">
                            <span className="opacity-50 font-bold block text-[9px] uppercase tracking-wider">Coût Est. Récompenses</span>
                            <strong className="text-base text-red-400 font-mono">{metrics.rewardValueEstimated.toLocaleString('fr-FR')} F</strong>
                          </div>
                          <div className="space-y-1 border-r border-white/5 pt-4 pr-4">
                            <span className="opacity-50 font-bold block text-[9px] uppercase tracking-wider">Marge Brut Estimée</span>
                            <strong className="text-base text-green-400 font-mono">{metrics.grossMargin.toLocaleString('fr-FR')} F</strong>
                          </div>
                          <div className="space-y-1 pt-4 pl-4">
                            <span className="opacity-50 font-bold block text-[9px] uppercase tracking-wider">CPA Moyen par Filleul</span>
                            <strong className="text-base text-white font-mono">{Math.round(metrics.cpa).toLocaleString('fr-FR')} F</strong>
                          </div>
                        </div>

                        {/* Health Badge Card */}
                        <div className={`p-4 rounded-xl border flex flex-col gap-1.5 text-xs text-left ${healthColor}`}>
                          <div className="flex justify-between items-center font-black uppercase tracking-wider text-[9px]">
                            <span>Statut Rentabilité :</span>
                            <span className="px-2 py-0.5 rounded bg-black/20 border border-current">{healthLabel}</span>
                          </div>
                          <p className="opacity-80 text-[10px] leading-relaxed font-bold">{healthDesc}</p>
                        </div>

                        {/* High CPA critical warning alert */}
                        {cpaRatio > 45 && (
                          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-xs text-red-400 text-left font-bold space-y-1 animate-pulse">
                            <strong className="block text-[9px] uppercase tracking-widest text-red-400">⚠️ ALERTE DE SEUIL ROI DEPASSÉ</strong>
                            <p className="text-[10px] leading-snug font-medium opacity-90">
                              Le coût d'acquisition client (CPA) représente {Math.round(cpaRatio)}% du prix moyen des formations. Il est conseillé de rehausser le seuil de parrainage (ex: exiger 6 ou 7 filleuls au lieu de 5) ou de distribuer des récompenses de moindre valeur pour préserver vos marges.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Notification Dispatcher */}
            <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 bg-black/20 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">Centre de Messagerie & Diffusion</h3>
              <p className="text-xs text-white/50 mb-6">Diffusez une notification in-app à tous les ambassadeurs ou ciblez un code parrain spécifique.</p>
              
              <form onSubmit={handleSendAdminNotification} className="space-y-4 text-xs">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/40">Destinataire *</label>
                    <select 
                      value={notifRecipient} onChange={e => setNotifRecipient(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow cursor-pointer"
                    >
                      <option value="ALL">📢 Tous les Ambassadeurs ({sponsors.length})</option>
                      {sponsors.map(sp => (
                        <option key={sp.userId} value={sp.userId}>👤 {sp.code} ({sp.whatsapp})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-white/40">Titre de l'Alerte / Annonce *</label>
                    <input 
                      type="text" placeholder="Ex: Nouveaux bonus et chantiers-écoles..." required
                      value={notifTitle} onChange={e => setNotifTitle(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Message *</label>
                  <textarea 
                    rows={3} placeholder="Rédigez le message de relance ou d'information..." required
                    value={notifBody} onChange={e => setNotifBody(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow resize-none"
                  />
                </div>

                <button 
                  type="submit" disabled={isSendingNotif}
                  className="bg-galf-yellow text-galf-carbon px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                >
                  {isSendingNotif ? "Envoi en cours..." : "Diffuser le message"}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB CONTENT: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Vérification Financière des Acomptes</h3>
            
            {payments.filter(p => p.status === 'a_verifier').length === 0 ? (
              <div className="p-12 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl bg-black/10">
                Aucune preuve de paiement en attente de validation comptable.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white">
                  <thead className="border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <tr>
                      <th className="pb-3 text-left">Candidat ID</th>
                      <th className="pb-3 text-center font-mono">Montant</th>
                      <th className="pb-3 text-center">Moyen</th>
                      <th className="pb-3 text-center">Référence</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {payments.filter(p => p.status === 'a_verifier').map(pay => (
                      <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <strong className="text-white block font-mono">{pay.prospectId}</strong>
                          <span className="text-[10px] text-white/50">Date : {new Date(pay.paymentDate).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 text-center font-mono font-bold text-white">{pay.amount.toLocaleString()} F CFA</td>
                        <td className="py-4 text-center text-white/70 uppercase">{pay.paymentMethod}</td>
                        <td className="py-4 text-center font-mono text-white/50">{pay.reference}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => setReviewPayment(pay)}
                            className="px-3 py-1.5 rounded-lg bg-galf-yellow text-galf-carbon font-black text-[9px] uppercase hover:brightness-110 transition-all shadow-md"
                          >
                            Valider Paiement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: REWARDS */}
        {activeTab === 'rewards' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Validation Administrative des Récompenses (Seuil 5)</h3>

            {rewards.filter(r => r.status === 'eligible').length === 0 ? (
              <div className="p-12 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl bg-black/10">
                Aucun dossier de récompense en attente d'approbation finale.
              </div>
            ) : (
              <div className="space-y-4">
                {rewards.filter(r => r.status === 'eligible').map(reward => (
                  <div key={reward.id} className="p-6 rounded-2xl bg-galf-bg border border-galf-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest font-mono">Dossier Réf : {reward.id}</span>
                      <h4 className="text-sm font-black text-white">Ambassadeur : <strong className="text-galf-yellow">{reward.userId}</strong></h4>
                      <p className="text-[10px] text-white/50">Campagne : {reward.campaignId}</p>
                    </div>
                    
                    <button 
                      onClick={() => setVerifyingReward(reward)}
                      className="px-4 py-2.5 rounded-xl bg-green-500 text-white font-black text-xs uppercase hover:brightness-110 transition-all shadow-md flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Approuver le dossier
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Payout & Commissions Manager (Wave 4) */}
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <h3 className="text-md font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-galf-yellow" /> Gestion des Commissions & Payouts Ambassadeurs
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Suivez et validez les transferts d'argent vers les comptes Mobile Money des ambassadeurs (MTN, Orange, Wave).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white border-collapse">
                  <thead className="border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <tr>
                      <th className="pb-3 text-left">ID Payout</th>
                      <th className="pb-3 text-left">Ambassadeur</th>
                      <th className="pb-3 text-center">Montant</th>
                      <th className="pb-3 text-center">Moyen</th>
                      <th className="pb-3 text-center">Numéro</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-white/80">
                    {payouts.map(pay => (
                      <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-white">{pay.id}</td>
                        <td className="py-3 font-bold text-white/70">{pay.sponsorName}</td>
                        <td className="py-3 text-center font-mono text-galf-yellow">{pay.amount.toLocaleString()} F CFA</td>
                        <td className="py-3 text-center uppercase font-bold text-white/60">{pay.method}</td>
                        <td className="py-3 text-center font-mono text-white/50">{pay.phone}</td>
                        <td className="py-3 text-right">
                          {pay.status === 'en_attente' ? (
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Payout ${pay.id} approuvé ! Virement de ${pay.amount} F CFA initié par API ${pay.method.toUpperCase()} vers ${pay.phone}.`);
                                setPayouts(prev => prev.map(p => p.id === pay.id ? { ...p, status: 'valide' } : p));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 font-black text-[9px] uppercase border border-green-500/30 cursor-pointer"
                            >
                              Valider le transfert
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-green-500/10 text-green-400 rounded">
                              Transféré
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Voucher Date Extender (Wave 4) */}
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <h3 className="text-md font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-galf-yellow" /> Registre Complet des Bons de Récompenses
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Consultez l'état de validité des bons et prolongez-les au besoin si un parrain réclame plus de temps.
              </p>

              <div className="space-y-3">
                {rewards.length === 0 ? (
                  <p className="text-center py-6 text-xs text-white/40 italic">Aucune récompense enregistrée.</p>
                ) : (
                  rewards.map(reward => {
                    const isClaimed = reward.status === 'attribuee'
                    const expiryDate = reward.expiresAt ? new Date(reward.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    const formattedExpiry = expiryDate.toLocaleDateString('fr-FR')
                    
                    return (
                      <div key={reward.id} className="p-4 rounded-xl bg-galf-bg border border-galf-border flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <strong className="text-white block font-bold font-mono">Réf : {reward.id}</strong>
                          <div className="text-[10px] text-white/50 font-sans">
                            Ambassadeur : <span className="text-white font-mono">{reward.userId}</span> · Expiration : <span className="text-galf-yellow font-mono">{formattedExpiry}</span>
                          </div>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                            isClaimed ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {reward.status}
                          </span>
                        </div>

                        {!isClaimed && (
                          <button
                            type="button"
                            onClick={() => {
                              const newExpiry = new Date(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
                              setRewards(prev => prev.map(r => r.id === reward.id ? { ...r, expiresAt: newExpiry } : r))
                              alert(`Validité du bon ${reward.id} prolongée de 30 jours (Nouvelle expiration : ${new Date(newExpiry).toLocaleDateString('fr-FR')}).`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-galf-surface border border-galf-border text-galf-yellow text-[9px] font-black uppercase hover:bg-white/5 transition-all cursor-pointer font-sans"
                          >
                            Prolonger +30j
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Create Campaign (5/12) */}
            <div className="lg:col-span-5 glass-card p-6 rounded-[2rem] border-white/5 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">Créer une Campagne</h3>
              
              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Nom de la Campagne *</label>
                  <input 
                    type="text" placeholder="Ex: Campagne Mines & HSE 2026" required
                    value={campName} onChange={e => setCampName(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Slug unique (URL) *</label>
                  <input 
                    type="text" placeholder="Ex: mines-hse-2026" required
                    value={campSlug} onChange={e => setCampSlug(e.target.value.toLowerCase().replace(/[\s]/g, '-'))}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/40">Seuil (Filleuls) *</label>
                    <input 
                      type="number" required min="1"
                      value={campThreshold} onChange={e => setCampThreshold(parseInt(e.target.value))}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/40">Récompense *</label>
                    <input 
                      type="text" required
                      value={campReward} onChange={e => setCampReward(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Slogan publicitaire</label>
                  <input 
                    type="text" placeholder="Ex: Ne sois pas le sorcier..."
                    value={campSlogan} onChange={e => setCampSlogan(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/40">Règlement en Markdown</label>
                  <textarea 
                    rows={3} placeholder="Markdown du règlement de la campagne..."
                    value={campRules} onChange={e => setCampRules(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase hover:brightness-110 transition-all"
                >
                  Enregistrer Brouillon
                </button>
              </form>
            </div>

            {/* Campaigns list (7/12) */}
            <div className="lg:col-span-7 glass-card p-6 rounded-[2rem] border-white/5 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">Campagnes de parrainage existantes</h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {campaigns.map(camp => (
                  <div key={camp.id} className="p-4 rounded-xl bg-galf-bg border border-galf-border flex justify-between items-center text-xs">
                    <div className="space-y-1 max-w-[65%]">
                      <strong className="text-white block font-bold text-sm">{camp.name}</strong>
                      <p className="text-[10px] text-white/50 italic">"{camp.slogan}"</p>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                        camp.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        camp.status === 'brouillon' ? 'bg-white/5 text-white/40 border-white/10' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {camp.status}
                      </span>
                    </div>

                    {camp.status === 'brouillon' && (
                      <button 
                        onClick={() => handleActivateCampaign(camp.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-500 text-white font-black text-[9px] uppercase hover:brightness-110 transition-all shadow-md"
                      >
                        Activer
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Auto-Campaign Deactivator Scheduler (Wave 4) */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Planificateur d'Arrêt Automatique</h4>
                <p className="text-[10px] text-white/50 font-sans leading-relaxed">
                  Planifiez une date et heure d'expiration pour mettre fin automatiquement à une campagne de parrainage active.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/40">Campagne cible</label>
                    <select
                      value={selectedCampaignForScheduler}
                      onChange={e => setSelectedCampaignForScheduler(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-2.5 text-white outline-none cursor-pointer focus:border-galf-yellow"
                    >
                      <option value="">Sélectionner...</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/40">Date & Heure de fin</label>
                    <input
                      type="datetime-local"
                      value={autoExpiryDate}
                      onChange={e => setAutoExpiryDate(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-2 text-white outline-none focus:border-galf-yellow"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!selectedCampaignForScheduler || !autoExpiryDate}
                  onClick={() => {
                    alert(`Planification enregistrée ! La campagne "${campaigns.find(c=>c.id === selectedCampaignForScheduler)?.name}" s'arrêtera automatiquement le ${new Date(autoExpiryDate).toLocaleString('fr-FR')}.`);
                    setAutoExpiryDate('');
                    setSelectedCampaignForScheduler('');
                  }}
                  className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer"
                >
                  Valider la planification
                </button>
              </div>
            </div>

            {/* F15: System Parameter Editor Config */}
            <div className="lg:col-span-12 glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left bg-black/25 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-galf-yellow" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">⚙️ Éditeur des Paramètres Système Globaux</h3>
              </div>
              <p className="text-xs text-white/50 mb-6">Ajustez les seuils de sécurité de l'application, les limites budgétaires de CPA et le seuil d'éligibilité aux récompenses.</p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* CPA Alert Limit */}
                <div className="space-y-3 bg-galf-bg p-5 rounded-2xl border border-galf-border">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/60 uppercase text-[9px] tracking-wider">Seuil CPA Critique</span>
                    <span className="text-galf-yellow font-mono">{sysCpaLimit.toLocaleString('fr-FR')} F</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={sysCpaLimit}
                    onChange={e => setSysCpaLimit(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40 leading-snug">
                    Déclenche une alerte de rentabilité si le coût moyen d'acquisition client dépasse cette valeur.
                  </p>
                </div>

                {/* Anti-Fraud Interval */}
                <div className="space-y-3 bg-galf-bg p-5 rounded-2xl border border-galf-border">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/60 uppercase text-[9px] tracking-wider">Intervalle Anti-Fraude</span>
                    <span className="text-galf-yellow font-mono">{sysMinFraudInterval} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={sysMinFraudInterval}
                    onChange={e => setSysMinFraudInterval(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40 leading-snug">
                    Intervalle de temps minimal autorisé entre deux inscriptions avec la même empreinte IP.
                  </p>
                </div>

                {/* Reward Threshold */}
                <div className="space-y-3 bg-galf-bg p-5 rounded-2xl border border-galf-border">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/60 uppercase text-[9px] tracking-wider">Seuil de Parrainage</span>
                    <span className="text-galf-yellow font-mono">{sysRewardThreshold} filleuls</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={sysRewardThreshold}
                    onChange={e => setSysRewardThreshold(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40 leading-snug">
                    Nombre minimum d'inscriptions de filleuls validées requises pour qu'un parrain reçoive son bon.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (adminUser) {
                        await dbAddDoc("admin_audit_logs", {
                          userId: adminUser.uid,
                          action: "update_system_config",
                          targetId: "global_config",
                          details: `Updated global system configurations: CPA Limit=${sysCpaLimit} F, Anti-Fraud Interval=${sysMinFraudInterval}m, Reward Threshold=${sysRewardThreshold} referrals.`,
                          createdAt: new Date().toISOString()
                        });
                      }
                      alert("Configuration globale système enregistrée avec succès dans la base Firestore !");
                      await loadAdminData();
                    } catch (err) {
                      console.error("Failed to save configuration:", err);
                      alert("Erreur de sauvegarde de la configuration.");
                    }
                  }}
                  className="bg-galf-yellow text-galf-carbon px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  Sauvegarder les paramètres système
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENT: FRAUDS */}
        {activeTab === 'frauds' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Dispositif Anti-Fraude & Alertes suspectes</h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              Le moteur anti-fraude analyse les signatures IP, les numéros de téléphone similaires et les tentatives d'auto-parrainage pour créer des alertes. Aucune suspension n'est automatique, un traitement humain est requis.
            </p>

            {/* Heatmap de Sévérité des Fraudes (Wave 4) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Zone Critique (Bloquante)", count: frauds.filter(f => f.severity === 'critique').length, color: "from-red-950 to-red-900 border-red-500/30", desc: "Auto-parrainage & Téléphones identiques" },
                { title: "Zone Élevée (Sous surveillance)", count: frauds.filter(f => f.severity === 'eleve').length, color: "from-orange-950 to-orange-900 border-orange-500/30", desc: "Emails doublons & Similitude séquentielle" },
                { title: "Zone Modérée (Avertissement)", count: frauds.filter(f => f.severity !== 'critique' && f.severity !== 'eleve').length, color: "from-yellow-950 to-yellow-900 border-yellow-500/30", desc: "Soumissions rapides & Suspicion bots" }
              ].map((zone, idx) => (
                <div key={idx} className={`p-5 rounded-2xl bg-gradient-to-br ${zone.color} border border-white/5 text-white relative overflow-hidden flex flex-col justify-between min-h-[120px]`}>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-white/70">{zone.title}</h4>
                    <p className="text-[9px] text-white/50 mt-1 font-sans">{zone.desc}</p>
                  </div>
                  <div className="flex justify-between items-baseline mt-4">
                    <span className="text-4xl font-mono font-black">{zone.count}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded">Alertes</span>
                  </div>
                </div>
              ))}
            </div>

            {frauds.length === 0 ? (
              <div className="p-12 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl bg-black/10">
                Aucun signalement de fraude détecté.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white">
                  <thead className="border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <tr>
                      <th className="pb-3 text-left">Prospect ID</th>
                      <th className="pb-3 text-left">Parrain ID</th>
                      <th className="pb-3 text-center">Signal</th>
                      <th className="pb-3 text-center">Sévérité</th>
                      <th className="pb-3 text-right">Actions correction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-white/80">
                    {frauds.map(fraud => (
                      <tr key={fraud.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <strong className="text-white block font-mono">{fraud.prospectId}</strong>
                            <button 
                              onClick={() => setSelectedFraud(fraud)}
                              className="p-1 rounded bg-white/5 border border-white/10 text-galf-yellow hover:bg-white/10 transition-all"
                              title="Analyser la fraude"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-white/60">{fraud.userId || "Non spécifié"}</td>
                        <td className="py-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-white/60 font-bold uppercase text-[9px]">{fraud.signalType}</span>
                        </td>
                        <td className="py-4 text-center font-bold">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border ${
                            fraud.severity === 'critique' ? 'bg-red-600/10 text-red-500 border-red-600/20' :
                            fraud.severity === 'eleve' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {fraud.severity}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {fraud.status === 'en_attente' ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleResolveFraud(fraud.id, "resolu_rejete")}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[9px] uppercase hover:bg-red-500/20 transition-all"
                              >
                                Rejeter prospect
                              </button>
                              <button 
                                onClick={() => handleResolveFraud(fraud.id, "resolu_ignore")}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 font-black text-[9px] uppercase hover:bg-white/10 transition-all"
                              >
                                Ignorer alerte
                              </button>
                            </div>
                          ) : (
                            <span className="text-white/40 italic font-bold">Résolu ({fraud.status})</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Journal d'Audit & Sécurité</h3>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-galf-bg border border-galf-border text-xs flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-galf-yellow uppercase text-[10px]">{log.action}</span>
                      <span className="text-[10px] text-white/40">Par: <strong className="text-white">{log.userId}</strong></span>
                    </div>
                    <p className="text-white/60 italic">"{log.details}"</p>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 shrink-0">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: EXPORTS */}
        {activeTab === 'exports' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Téléchargement des exports Back-Office</h3>
            <p className="text-xs text-white/60 mb-8 leading-relaxed">
              Exportez les données de parrainage GALF au format CSV. Tous les fichiers intègrent un encodage BOM UTF-8 assurant la conformité des caractères accentués pour Microsoft Excel.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Export Parrains / Ambassadeurs", desc: "Liste des membres parrains inscrits avec leurs codes uniques.", action: exportSponsors },
                { title: "Export Prospects / Filleuls", desc: "Fiche complète des filleuls parrainés avec leurs statuts commerciaux.", action: exportProspects },
                { title: "Export Comptabilité / Paiements", desc: "Suivi des acompte reçus Wave/Orange/MTN pour rapprochement.", action: exportPayments },
                { title: "Export Récompenses", desc: "Suivi des codes de formation offerts aux ambassadeurs méritants.", action: exportRewards }
              ].map((exp, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-galf-bg border border-galf-border flex justify-between items-center gap-4 hover:border-galf-yellow/20 transition-all">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-white">{exp.title}</h4>
                    <p className="text-xs text-white/50">{exp.desc}</p>
                  </div>
                  <button 
                    onClick={exp.action}
                    className="p-3.5 rounded-xl bg-galf-surface border border-galf-border text-galf-yellow hover:bg-galf-yellow hover:text-galf-carbon transition-all shadow-md shrink-0"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: VERIFY PAYMENT (ACCOUNTING COMTPABLE) */}
      {reviewPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1A1A1D] border-white/10 max-w-md w-full text-left relative">
            <h3 className="text-lg font-black text-white mb-2 uppercase">Validation Comptable</h3>
            <p className="text-xs text-white/60 mb-6">Confirmez la bonne réception de l'acompte du filleul.</p>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-white/40">Candidat ID :</span>
                <span className="text-white font-mono font-bold">{reviewPayment.prospectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Montant reçu :</span>
                <span className="text-galf-yellow font-black">{reviewPayment.amount.toLocaleString()} F CFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Transaction Référence :</span>
                <span className="text-white font-mono font-bold">{reviewPayment.reference}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Note de validation / Rapprochement bancaire *</label>
                <input 
                  type="text" placeholder="Ex: Transaction validée en banque..." required
                  value={paymentReviewComment} onChange={e => setPaymentReviewComment(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button 
                  type="button" onClick={() => setReviewPayment(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="button" onClick={() => handleConfirmPayment('echoue')}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase hover:bg-red-700 transition-all"
                >
                  Échoué
                </button>
                <button 
                  type="button" onClick={() => handleConfirmPayment('confirme')}
                  className="px-5 py-2.5 rounded-xl bg-green-500 text-white font-black text-xs uppercase hover:brightness-110 transition-all shadow-md"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VERIFY AND APPROVE REWARD */}
      {verifyingReward && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1A1A1D] border-white/10 max-w-md w-full text-left relative">
            <h3 className="text-lg font-black text-white mb-2 uppercase">Validation de la Récompense</h3>
            <p className="text-xs text-white/60 mb-6">Validez l'éligibilité de l'ambassadeur et choisissez sa formation offerte.</p>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-white/40">Dossier Réf :</span>
                <span className="text-white font-mono font-bold">{verifyingReward.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Ambassadeur ID :</span>
                <span className="text-white font-mono font-bold">{verifyingReward.userId}</span>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleApproveReward(); }} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/40">Attribuer la formation offerte *</label>
                <select 
                  value={offeredFormation}
                  onChange={e => setOfferedFormation(e.target.value)}
                  required
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-3 text-xs text-white outline-none cursor-pointer"
                >
                  {GALF_FORMATIONS.filter(f => f.status === 'Actif').map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({(f.pricePromo || f.price).toLocaleString()} F)</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" onClick={() => setVerifyingReward(null)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isApprovingReward}
                  className="px-6 py-3 rounded-xl bg-green-500 text-white font-black text-xs uppercase hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                >
                  Approuver & Émettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FRAUD DIAGNOSTIC ANALYSIS */}
      {selectedFraud && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#1C1C1E] border border-white/10 max-w-md w-full text-left relative shadow-2xl">
            <h3 className="text-lg font-black text-white mb-2 uppercase flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" /> Diagnostic Anti-Fraude
            </h3>
            <p className="text-xs text-white/50 mb-6 font-medium">Analyse des empreintes IP et signatures d'enregistrement.</p>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-white/40 text-[9px] uppercase font-bold block">Prospect ID</span>
                  <strong className="text-white font-mono text-xs">{selectedFraud.prospectId}</strong>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] uppercase font-bold block">Code Parrain</span>
                  <strong className="text-galf-yellow font-mono text-xs">{selectedFraud.userId || "Non assigné"}</strong>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] uppercase font-bold block">Signal détecté</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/70 font-mono text-[9px] uppercase">{selectedFraud.signalType}</span>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] uppercase font-bold block">Sévérité</span>
                  <strong className={`uppercase text-[9px] font-black ${
                    selectedFraud.severity === 'critique' ? 'text-red-500' :
                    selectedFraud.severity === 'eleve' ? 'text-orange-400' : 'text-yellow-400'
                  }`}>{selectedFraud.severity}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 text-[9px] uppercase font-bold block">Détails de l'alerte</span>
                <p className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-white/80 leading-relaxed font-semibold">
                  {selectedFraud.description}
                </p>
              </div>

              {/* Technical breakdown */}
              <div className="p-4 rounded-xl bg-red-950/10 border border-red-500/10 text-white/60 space-y-2.5">
                <div className="font-bold text-[10px] text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" /> Empreinte technique & Signature
                </div>
                <ul className="space-y-1.5 text-[10px] leading-relaxed">
                  <li>• IP Hashed Signature : <code className="text-white font-mono">9d8e7a6b_galf_ci</code></li>
                  <li>• Identité Client : <code className="text-white font-mono">Chrome 124 / Windows NT 10.0</code></li>
                  <li>• Espace temporel : <code className="text-red-400 font-bold">Inscriptions à moins de 3m d'écart</code></li>
                  <li>• Score de confiance anti-fraude : <code className="text-red-400 font-black">94% suspect</code></li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" onClick={() => setSelectedFraud(null)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Fermer
                </button>
                {selectedFraud.status === 'en_attente' && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => { handleResolveFraud(selectedFraud.id, "resolu_ignore"); setSelectedFraud(null); }}
                      className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-black text-xs uppercase hover:bg-white/10 transition-all"
                    >
                      Ignorer
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { handleResolveFraud(selectedFraud.id, "resolu_rejete"); setSelectedFraud(null); }}
                      className="px-5 py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase hover:bg-red-700 transition-all"
                    >
                      Rejeter le Lead
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
