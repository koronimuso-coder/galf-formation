"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Gift, Users, Link as LinkIcon, Download, Copy, Share2, 
  Award, Bell, HelpCircle, User, LogOut, ShieldCheck, 
  CheckCircle, Clock, AlertCircle, ChevronRight, CheckCircle2 
} from 'lucide-react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { getCurrentUser, signOutUser, UserProfile } from '@/lib/firebase/services/auth'
import { 
  getSponsorProfile, getSponsorBadges, getNotifications, 
  markNotificationAsRead, SponsorProfile, Badge, Notification 
} from '@/lib/firebase/services/referral'
import { dbGetDocs, dbGetDoc } from '@/lib/firebase/services/dbClient'
import { ReferredProspect } from '@/lib/firebase/services/commercial'
import { ReferralReward } from '@/lib/firebase/services/admin'
import { GALF_FORMATIONS } from '@/lib/data'

export default function CockpitAmbassadeur() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [sponsorProfile, setSponsorProfile] = useState<SponsorProfile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [referredProspects, setReferredProspects] = useState<ReferredProspect[]>([])
  const [rewards, setRewards] = useState<ReferralReward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Dashboard states
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'filleuls' | 'rewards' | 'help'>('dashboard')
  const [cardLayout, setCardLayout] = useState<'horizontal' | 'vertical' | 'square'>('horizontal')
  const [generatingCard, setGeneratingCard] = useState(false)

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/programme-ambassadeur/connexion')
        return
      }
      setUserProfile(user)
      
      const campaignId = "campagne-initiale-2026"
      const sponsor = await getSponsorProfile(user.uid, campaignId)
      if (!sponsor) {
        // Fallback: If user is authenticated but not a sponsor, redirect to signup
        router.push('/programme-ambassadeur/inscription')
        return
      }
      setSponsorProfile(sponsor)

      // Get badges
      const badgeList = await getSponsorBadges(user.uid)
      setBadges(badgeList)

      // Get notifications
      const notifList = await getNotifications(user.uid)
      setNotifications(notifList)

      // Get referred prospects
      const prospectsSnaps = await dbGetDocs("referred_prospects", [
        { field: "sponsorUserId", op: "==", value: user.uid },
        { field: "campaignId", op: "==", value: campaignId }
      ])
      const prospects = prospectsSnaps.map(s => s.data() as ReferredProspect)
      setReferredProspects(prospects)

      // Get rewards
      const rewardsSnaps = await dbGetDocs("referral_rewards", [
        { field: "userId", op: "==", value: user.uid },
        { field: "campaignId", op: "==", value: campaignId }
      ])
      setRewards(rewardsSnaps.map(s => s.data() as ReferralReward))

    } catch (e) {
      console.error("Failed to load dashboard data:", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Draw Card on Canvas
  const drawAmbassadorCard = async () => {
    if (!canvasRef.current || !sponsorProfile || !userProfile) return
    setGeneratingCard(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set dimensions based on layout
    let width = 1200
    let height = 630 // horizontal standard
    
    if (cardLayout === 'vertical') {
      width = 1080
      height = 1920 // WhatsApp status
    } else if (cardLayout === 'square') {
      width = 1080
      height = 1080 // Facebook post
    }

    canvas.width = width
    canvas.height = height

    // 1. Draw Background (Galf Dark Theme)
    ctx.fillStyle = '#0E0E10'
    ctx.fillRect(0, 0, width, height)

    // Draw grid design
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
    ctx.lineWidth = 1
    const gridSize = 40
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 2. Yellow Accents
    ctx.fillStyle = '#FFB000' // Galf yellow
    // Top border accent
    ctx.fillRect(0, 0, width, 15)
    
    // Diagonal decorative bar
    ctx.beginPath()
    ctx.moveTo(width * 0.75, 0)
    ctx.lineTo(width, 0)
    ctx.lineTo(width, height * 0.4)
    ctx.lineTo(width * 0.9, height * 0.4)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255, 176, 0, 0.05)'
    ctx.fill()

    // 3. Logo text
    ctx.fillStyle = '#FFB000'
    ctx.font = '900 42px sans-serif'
    ctx.fillText('GALF FORMATION', 80, 80)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText("CHANTIER-ÉCOLE D'EXCELLENCE", 80, 105)

    // 4. Title
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '900 68px sans-serif'
    ctx.fillText('AMBASSADEUR OFFICIEL', 80, height * 0.4)

    // 5. Name
    ctx.fillStyle = '#FFB000'
    ctx.font = 'bold 44px sans-serif'
    ctx.fillText(userProfile.displayName.toUpperCase(), 80, height * 0.5)

    // 6. Referral Code Box
    ctx.strokeStyle = 'rgba(255, 176, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.fillStyle = 'rgba(255, 176, 0, 0.05)'
    const boxX = 80
    const boxY = height * 0.58
    const boxW = 500
    const boxH = 90
    ctx.beginPath()
    ctx.roundRect(boxX, boxY, boxW, boxH, 15)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('CODE PARRAIN :', boxX + 30, boxY + 52)
    
    ctx.fillStyle = '#FFB000'
    ctx.font = '900 32px monospace'
    ctx.fillText(sponsorProfile.code, boxX + 200, boxY + 55)

    // 7. Contact Details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('Contact GALF : +225 07 11 82 65 07', 80, height - 80)
    ctx.fillText('Formez-vous aux métiers du BTP, Engins, HSE et Mines', 80, height - 50)

    // 8. Draw QR Code representation
    const qrX = width - 280
    const qrY = height * 0.5
    const qrSize = 180

    // White backing box for scanning contrast
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.roundRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 20)
    ctx.fill()

    // Draw mock QR Grid
    ctx.fillStyle = '#0E0E10'
    const qrBlocks = 21
    const blockSize = qrSize / qrBlocks
    for (let row = 0; row < qrBlocks; row++) {
      for (let col = 0; col < qrBlocks; col++) {
        // Finder patterns (top left, top right, bottom left)
        const isFinder = 
          (row < 7 && col < 7) || 
          (row < 7 && col >= qrBlocks - 7) || 
          (row >= qrBlocks - 7 && col < 7)
          
        if (isFinder) {
          const isBorder = 
            row === 0 || row === 6 || col === 0 || col === 6 ||
            (row < 7 && (col === qrBlocks - 7 || col === qrBlocks - 1)) ||
            (row === 0 && col >= qrBlocks - 7) || (row === 6 && col >= qrBlocks - 7) ||
            (row >= qrBlocks - 7 && (col === 0 || col === 6)) ||
            (row === qrBlocks - 7 && col < 7) || (row === qrBlocks - 1 && col < 7)
            
          const isCenter = 
            (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
            (row >= 2 && row <= 4 && col >= qrBlocks - 5 && col <= qrBlocks - 3) ||
            (row >= qrBlocks - 5 && row <= qrBlocks - 3 && col >= 2 && col <= 4)

          if (isBorder || isCenter) {
            ctx.fillRect(qrX + col * blockSize, qrY + row * blockSize, blockSize + 0.5, blockSize + 0.5)
          }
        } else {
          // Pseudo-random noise for code content
          const noiseVal = (row * 13 + col * 37) % 5 === 0 || (row * col) % 3 === 0
          if (noiseVal) {
            ctx.fillRect(qrX + col * blockSize, qrY + row * blockSize, blockSize + 0.5, blockSize + 0.5)
          }
        }
      }
    }

    ctx.fillStyle = '#0E0E10'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('SCANNER POUR S\'INSCRIRE', qrX + qrSize/2, qrY + qrSize + 25)
    ctx.textAlign = 'left' // Reset alignment

    setGeneratingCard(false)
  }

  useEffect(() => {
    if (!isLoading && sponsorProfile) {
      drawAmbassadorCard()
    }
  }, [isLoading, sponsorProfile, cardLayout])

  // Actions
  const handleSignOut = async () => {
    await signOutUser()
    router.push('/programme-ambassadeur/connexion')
  }

  const handleCopyCode = () => {
    if (!sponsorProfile) return
    navigator.clipboard.writeText(sponsorProfile.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyLink = () => {
    if (!sponsorProfile) return
    const link = `https://galf-formation.ci/programme-ambassadeur?ref=${sponsorProfile.code}`
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleDownloadCard = () => {
    if (!canvasRef.current || !sponsorProfile) return
    const link = document.createElement('a')
    link.download = `Carte-Ambassadeur-${sponsorProfile.code}-${cardLayout}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  // Calculate Progression
  const validatedCount = referredProspects.filter(p => p.status === 'inscription_validee').length
  const pendingCount = referredProspects.filter(p => ['paiement_a_verifier', 'paiement_partiel'].includes(p.status)).length
  const totalCount = referredProspects.length
  
  // Progression milestone calculation
  const milestoneCount = Math.min(5, validatedCount)
  const remainingCount = 5 - milestoneCount

  let milestoneMessage = "Ton aventure commence maintenant. Partage ton code autour de toi."
  if (milestoneCount === 1) milestoneMessage = "Première inscription validée. Plus que 4."
  else if (milestoneCount === 2) milestoneMessage = "Ton réseau commence à porter ses fruits. Plus que 3."
  else if (milestoneCount === 3) milestoneMessage = "Tu as dépassé la moitié. Plus que 2."
  else if (milestoneCount === 4) milestoneMessage = "Tu y es presque. Une dernière inscription validée."
  else if (milestoneCount === 5) milestoneMessage = "Félicitations ! Ton dossier est éligible à une formation offerte. Vérification finale en cours."

  const sharingMessages = {
    direct: `Je viens de découvrir une opportunité chez GALF FORMATION. Tu peux te former aux métiers des engins, du HSE, des mines, du BTP et de la logistique. Découvre les formations avec mon lien : https://galf-formation.ci/programme-ambassadeur?ref=${sponsorProfile?.code}`,
    family: `Une bonne information peut changer une famille. GALF FORMATION propose des formations professionnelles. Utilise mon lien pour découvrir les opportunités : https://galf-formation.ci/programme-ambassadeur?ref=${sponsorProfile?.code}`,
    professional: `Tu cherches une formation pratique dans les métiers des engins, des mines, du HSE ou de la logistique ? Consulte GALF FORMATION ici : https://galf-formation.ci/programme-ambassadeur?ref=${sponsorProfile?.code}`
  }

  const handleShareWhatsApp = (messageType: keyof typeof sharingMessages) => {
    const text = encodeURIComponent(sharingMessages[messageType])
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleShareEmail = (messageType: keyof typeof sharingMessages) => {
    const text = encodeURIComponent(sharingMessages[messageType])
    window.open(`mailto:?subject=Opportunité de formation GALF&body=${text}`, '_blank')
  }

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0E10]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-galf-yellow border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-black text-white/50 uppercase tracking-widest">Chargement de votre Cockpit...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-24 text-left" style={{ background: 'var(--galf-bg)' }}>
      <div className="container-galf">
        
        {/* En-tête Cockpit */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-center text-galf-yellow font-black text-2xl uppercase shadow-md">
                {userProfile?.displayName.slice(0, 2)}
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-galf-yellow">Cockpit Ambassadeur</span>
                <h2 className="text-2xl md:text-3xl font-black text-white">{userProfile?.displayName}</h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/50 font-medium">
                  <span>Code : <strong className="text-white font-mono">{sponsorProfile?.code}</strong></span>
                  <span>·</span>
                  <span>Campagne : <strong className="text-white">Initiale 2026</strong></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notification badge */}
              <div className="relative">
                <button onClick={() => setActiveTab(activeTab === 'dashboard' ? 'dashboard' : 'dashboard')} className="p-3 rounded-xl bg-galf-surface border border-galf-border text-white hover:bg-white/5 transition-all">
                  <Bell className="w-4 h-4" />
                </button>
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-galf-bg" />
                )}
              </div>
              <button 
                onClick={handleSignOut}
                className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase flex items-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Tab Selection */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: Award },
            { id: 'filleuls', label: `Filleuls (${totalCount})`, icon: Users },
            { id: 'rewards', label: `Récompenses (${rewards.length})`, icon: Gift },
            { id: 'help', label: 'Centre d\'aide', icon: HelpCircle },
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

        {/* TAB CONTENT: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid lg:grid-cols-12 gap-10">
            
            {/* Left Column: Progress & sharing */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Notifications Alert banner */}
              {notifications.filter(n => !n.read).slice(0, 1).map(n => (
                <div key={n.id} className="p-4 rounded-xl border border-galf-yellow/20 bg-galf-yellow/5 flex justify-between items-center gap-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Bell className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-bold">{n.title}</strong>
                      <span className="text-white/60">{n.message}</span>
                    </div>
                  </div>
                  <button onClick={() => handleMarkRead(n.id)} className="text-[10px] uppercase font-black text-galf-yellow hover:underline shrink-0">Marquer lu</button>
                </div>
              ))}

              {/* Progress Panel */}
              <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-black/20 relative overflow-hidden">
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Votre progression de parrainage</h3>
                
                <div className="flex justify-between items-baseline mb-3">
                  <div className="text-3xl font-black text-white font-mono">
                    {milestoneCount}/5
                  </div>
                  <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Inscriptions Validées</span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden mb-6 relative">
                  <div 
                    className="h-full bg-galf-yellow transition-all duration-700 ease-out" 
                    style={{ width: `${(milestoneCount / 5) * 100}%` }}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3.5 items-start text-xs leading-relaxed text-galf-text-secondary">
                  <span className="text-xl shrink-0 mt-0.5">🌟</span>
                  <div>
                    <strong className="text-white block font-bold mb-1">Status : {milestoneCount === 5 ? "Éligible 🏆" : "En cours"}</strong>
                    {milestoneMessage}
                  </div>
                </div>
              </div>

              {/* Sharing Tools */}
              <div className="glass-card p-6 md:p-8 rounded-[2rem]">
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Outils de Partage</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Copy Code */}
                  <div className="p-4 rounded-xl bg-galf-bg border border-galf-border flex justify-between items-center">
                    <div>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Votre Code Parrain</span>
                      <div className="text-base font-black text-white font-mono mt-0.5">{sponsorProfile?.code}</div>
                    </div>
                    <button 
                      onClick={handleCopyCode}
                      className="p-2 rounded-lg bg-galf-surface hover:bg-white/5 text-galf-yellow transition-all border border-galf-border"
                    >
                      {copiedCode ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Copy Link */}
                  <div className="p-4 rounded-xl bg-galf-bg border border-galf-border flex justify-between items-center">
                    <div>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Votre Lien Personnel</span>
                      <div className="text-xs font-bold text-white truncate max-w-[180px] mt-1">galf-formation.ci?ref={sponsorProfile?.code}</div>
                    </div>
                    <button 
                      onClick={handleCopyLink}
                      className="p-2 rounded-lg bg-galf-surface hover:bg-white/5 text-galf-yellow transition-all border border-galf-border"
                    >
                      {copiedLink ? <CheckCircle className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Preformatted Messaging */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-wider">Messages à copier & partager</span>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'direct', label: 'Message Direct / SMS', icon: '💬' },
                      { key: 'family', label: 'Message Familial', icon: '👨‍👩‍👧‍👦' },
                      { key: 'professional', label: 'Message Professionnel', icon: '💼' }
                    ].map(msg => (
                      <div key={msg.key} className="p-4 rounded-xl bg-galf-bg border border-galf-border text-xs space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white/60">{msg.icon} {msg.label}</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleShareWhatsApp(msg.key as any)}
                              className="text-[9px] font-black bg-green-500 text-white px-2.5 py-1.5 rounded hover:bg-green-600 transition-all uppercase"
                            >
                              WhatsApp
                            </button>
                            <button 
                              onClick={() => handleShareEmail(msg.key as any)}
                              className="text-[9px] font-black bg-galf-surface border border-galf-border text-white px-2.5 py-1.5 rounded hover:bg-white/5 transition-all uppercase"
                            >
                              Email
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed italic">
                          "{sharingMessages[msg.key as keyof typeof sharingMessages]}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Digital Ambassador Card */}
            <div className="lg:col-span-5 space-y-6 text-center">
              <div className="glass-card p-6 rounded-[2.5rem] bg-black/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 text-left">Votre Carte Digitale</h3>
                  
                  {/* Hidden Canvas used for generating downloads */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Card Visual Preview Box */}
                  <div className="w-full aspect-[1.9/1] bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative group shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    
                    {/* Rendered representation overlay */}
                    <div className="relative z-20 p-4 w-full h-full flex flex-col justify-between text-left select-none text-[10px]">
                      <div>
                        <div className="text-galf-yellow font-black text-xs">GALF FORMATION</div>
                        <div className="text-[6px] text-white/40 uppercase tracking-widest font-bold">Ambassadeur Officiel</div>
                      </div>
                      <div>
                        <div className="text-white font-black text-sm leading-tight uppercase">{userProfile?.displayName}</div>
                        <div className="text-[8px] font-mono text-galf-yellow mt-1 font-bold">CODE : {sponsorProfile?.code}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card sizes toggles */}
                  <div className="flex gap-2 justify-center mt-4 text-[10px] font-black uppercase">
                    {[
                      { id: 'horizontal', label: 'Carte Digitale' },
                      { id: 'square', label: 'Format Facebook' },
                      { id: 'vertical', label: 'Format WhatsApp' }
                    ].map(lay => (
                      <button 
                        key={lay.id}
                        onClick={() => setCardLayout(lay.id as any)}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          cardLayout === lay.id 
                            ? 'bg-galf-yellow border-galf-yellow text-galf-carbon' 
                            : 'bg-galf-surface border-galf-border text-white/60 hover:bg-white/5'
                        }`}
                      >
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5">
                  <button 
                    onClick={handleDownloadCard}
                    disabled={generatingCard}
                    className="w-full bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> {generatingCard ? "Génération de la carte..." : "Télécharger ma carte (PNG)"}
                  </button>
                </div>
              </div>

              {/* Indicators Stats Panel */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="glass-card p-4 rounded-2xl bg-black/20 border-white/5">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Filleuls Inscrits</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">{totalCount}</div>
                </div>
                <div className="glass-card p-4 rounded-2xl bg-black/20 border-white/5">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Paiements à valider</span>
                  <div className="text-2xl font-black text-galf-yellow font-mono mt-1">{pendingCount}</div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* TAB CONTENT: FILLEULS */}
        {activeTab === 'filleuls' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Vos proches parrainés</h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              Pour protéger la vie privée de vos contacts, leurs numéros de téléphone et justificatifs de paiement sont anonymisés. Dès que le comptable confirme leur acompte, le filleul passe au statut <strong className="text-green-400">validé</strong>.
            </p>

            {referredProspects.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                Aucun filleul enregistré pour le moment. Partagez votre code parrain pour voir apparaître vos recommandations !
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white">
                  <thead className="border-b border-white/5 text-[10px] font-black uppercase text-white/40">
                    <tr>
                      <th className="pb-3 text-left">Filleul</th>
                      <th className="pb-3 text-left">Formation</th>
                      <th className="pb-3 text-left font-mono">Date</th>
                      <th className="pb-3 text-right">Statut parrainage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {referredProspects.map(p => {
                      // Anonymize full name: e.g. "Jean Renaud" -> "Jean R."
                      const nameParts = p.fullName.trim().split(" ")
                      const anonymizedName = nameParts.length > 1 
                        ? `${nameParts[0]} ${nameParts[nameParts.length - 1].slice(0, 1)}.`
                        : p.fullName

                      // Formation name
                      const formation = GALF_FORMATIONS.find(f => f.id === p.desiredFormationId)
                      const formName = formation ? formation.name : "Formation BTP"

                      // Format date
                      const dateObj = p.createdAt ? new Date(p.createdAt) : new Date()
                      const dateStr = dateObj.toLocaleDateString("fr-FR")

                      // Map pipeline status to simplified parrain dashboard status
                      let statusLabel = "En cours"
                      let statusCol = "text-galf-yellow bg-galf-yellow/10 border-galf-yellow/20"
                      
                      if (p.status === "inscription_validee") {
                        statusLabel = "Validé"
                        statusCol = "text-green-500 bg-green-500/10 border-green-500/20"
                      } else if (p.status === "paiement_a_verifier") {
                        statusLabel = "Paiement à vérifier"
                        statusCol = "text-blue-400 bg-blue-400/10 border-blue-400/20"
                      } else if (p.status === "annule" || p.status === "non_interesse") {
                        statusLabel = "Dossier non retenu"
                        statusCol = "text-white/40 bg-white/5 border-white/10"
                      } else if (p.status === "fraude_suspectee") {
                        statusLabel = "Examen administratif"
                        statusCol = "text-red-400 bg-red-400/10 border-red-400/20"
                      }

                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 font-bold text-white">{anonymizedName}</td>
                          <td className="py-4 text-white/70">{formName}</td>
                          <td className="py-4 font-mono text-white/50">{dateStr}</td>
                          <td className="py-4 text-right">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${statusCol}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: REWARDS */}
        {activeTab === 'rewards' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Vos formations offertes</h3>
            
            {rewards.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                Vous n'avez pas encore de récompense validée. Atteignez 5 inscriptions filleuls validées pour débloquer votre première formation offerte !
              </div>
            ) : (
              <div className="space-y-4">
                {rewards.map(reward => {
                  let statusText = "Vérification administrative en cours"
                  let statusColor = "text-galf-yellow bg-galf-yellow/10 border-galf-yellow/20"
                  
                  if (reward.status === 'approuvee') {
                    statusText = "Approuvée · Prêt à programmer"
                    statusColor = "text-green-500 bg-green-500/10 border-green-500/20"
                  } else if (reward.status === 'utilisee') {
                    statusText = "Utilisée · Session en cours"
                    statusColor = "text-white/40 bg-white/5 border-white/10"
                  } else if (reward.status === 'refusee') {
                    statusText = "Refusée administrativement"
                    statusColor = "text-red-400 bg-red-400/10 border-red-400/20"
                  }

                  const expiryStr = reward.expiresAt 
                    ? new Date(reward.expiresAt).toLocaleDateString("fr-FR") 
                    : "Non définie"

                  const formation = GALF_FORMATIONS.find(f => f.id === reward.offeredFormationId)
                  const formName = formation ? formation.name : "En attente de votre choix"

                  return (
                    <div key={reward.id} className="p-6 rounded-2xl bg-galf-bg border border-galf-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-white/40 tracking-widest font-mono">Dossier Réf : {reward.id}</span>
                        <h4 className="text-base font-black text-white">{formName}</h4>
                        <div className="text-[11px] text-white/50">
                          Date limite d'utilisation : <strong className="text-white">{expiryStr}</strong>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${statusColor}`}>
                          {statusText}
                        </span>
                        {reward.status === 'approuvee' && (
                          <a href="https://wa.me/2250711826507" target="_blank" rel="noopener noreferrer" className="bg-galf-yellow text-galf-carbon px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-md">
                            Programmer ma session
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: HELP CENTER */}
        {activeTab === 'help' && (
          <div className="glass-card p-6 md:p-8 rounded-[2rem] text-left">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Centre d'aide Ambassadeur</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-white">Besoin d'assistance directe ?</h4>
                <p className="text-xs text-white/60 leading-relaxed">Notre équipe commerciale dédiée répond à vos questions ou vérifie vos attributions de filleuls du lundi au samedi de 08h à 18h.</p>
                <div className="pt-2">
                  <a href="https://wa.me/2250711826507" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white font-black px-6 py-3.5 rounded-xl text-xs hover:brightness-110 transition-all shadow-lg">
                    📞 Contacter l'Expert Parrainage
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-white mb-4">Règles et Règlements</h4>
                <ul className="space-y-2 text-xs text-white/60 leading-relaxed">
                  <li>• Le parrain ne peut parrainer son propre dossier d'inscription.</li>
                  <li>• Un filleul compte uniquement si son premier acompte (30% min) est validé en banque.</li>
                  <li>• Les récompenses sont valables 90 jours à compter de leur approbation administrative.</li>
                  <li>• Les sessions offertes sont non remboursables et non convertibles en argent liquide.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
