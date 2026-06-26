"use client"
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { FadeIn } from '@/components/animations/FadeIn'
import { GALF_FORMATIONS } from '@/lib/data'
import { User, Book, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, FileCheck, Info, Sparkles, Smile, Download, Trophy } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { getAttributionCode } from '@/lib/firebase/services/referral'
import { registerReferredProspect } from '@/lib/firebase/services/commercial'
import { dbGetDoc } from '@/lib/firebase/services/dbClient'

export default function Inscription() {
  const [step, setStep] = useState(1)
  const [selectedFormations, setSelectedFormations] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [acompte, setAcompte] = useState(30)
  
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState('')
  const [education, setEducation] = useState('')
  const [experience, setExperience] = useState('')
  
  const [receiptId, setReceiptId] = useState('')
  const [registrationDate, setRegistrationDate] = useState('')
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)
  
  const [detectedRefCode, setDetectedRefCode] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const toggleFormation = (fId: string) => {
    try {
      playPromoSound('click')
    } catch {}
    if (selectedFormations.includes(fId)) {
      setSelectedFormations(selectedFormations.filter(id => id !== fId))
    } else {
      setSelectedFormations([...selectedFormations, fId])
    }
  }
  
  // ── Wave 5: Enrollment Interactive Feature States ──
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  // Auto-saver notice
  const [draftRestored, setDraftRestored] = useState(false)

  // Document validation
  const [cniFile, setCniFile] = useState<{ name: string; size: string; valid: boolean } | null>(null)
  const [certifFile, setCertifFile] = useState<{ name: string; size: string; valid: boolean } | null>(null)

  // Motivation test
  const [showMotivationTest, setShowMotivationTest] = useState(false)
  const [motivationScore, setMotivationScore] = useState(0)
  const [motivationQIdx, setMotivationQIdx] = useState(0)
  const [motivationDone, setMotivationDone] = useState(false)
  
  const motivationQuestions = [
    { q: "Pourquoi souhaitez-vous intégrer GALF ?", opts: [{ text: "Pour la stabilité de l'emploi dans les mines/BTP", pts: 3 }, { text: "Par curiosité", pts: 1 }] },
    { q: "Quelle importance donnez-vous aux règles HSE ?", opts: [{ text: "Une importance vitale absolue", pts: 3 }, { text: "Ce sont juste des contraintes", pts: 0 }] },
    { q: "Êtes-vous disponible pour 4 semaines intensives ?", opts: [{ text: "Oui, totalement disponible", pts: 3 }, { text: "Seulement à temps partiel", pts: 1 }] }
  ]

  const totalSteps = 5
  const steps = [
    { label: "Formation", icon: Book },
    { label: "Informations", icon: User },
    { label: "Paiement", icon: CreditCard },
    { label: "Récapitulatif", icon: FileCheck },
    { label: "Confirmation", icon: CheckCircle2 },
  ]

  // Auto-saver: Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('galf_enrollment_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.selectedFormations) setSelectedFormations(parsed.selectedFormations)
        else if (parsed.selectedFormation) setSelectedFormations([parsed.selectedFormation])
        
        if (parsed.acompte) setAcompte(parsed.acompte)
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod)
        if (parsed.fullName) setFullName(parsed.fullName)
        if (parsed.phone) setPhone(parsed.phone)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.idNumber) setIdNumber(parsed.idNumber)
        if (parsed.birthDate) setBirthDate(parsed.birthDate)
        if (parsed.city) setCity(parsed.city)
        if (parsed.gender) setGender(parsed.gender)
        if (parsed.education) setEducation(parsed.education)
        if (parsed.experience) setExperience(parsed.experience)
        if (parsed.step) setStep(parsed.step)
        setDraftRestored(true)
      } catch {}
    }
    
    // Read global referral attribution cookie
    const refCode = getAttributionCode()
    if (refCode) {
      setDetectedRefCode(refCode)
    }
  }, [])

  // Clear draft & set receipt info on confirmation step
  useEffect(() => {
    if (step === 5) {
      localStorage.removeItem('galf_enrollment_draft')
      const date = new Date()
      const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      setRegistrationDate(formattedDate)
      
      const randNum = Math.floor(1000 + Math.random() * 9000)
      const firstSelected = selectedFormations[0]
      const codeSuffix = firstSelected ? firstSelected.toUpperCase().slice(0, 5) : 'GEN'
      setReceiptId(`GALF-${codeSuffix}-${randNum}`)
    }
  }, [step, selectedFormations])

  // Auto-saver: Save draft when changing inputs
  const saveDraft = (nextStep: number) => {
    localStorage.setItem('galf_enrollment_draft', JSON.stringify({
      selectedFormations,
      acompte,
      paymentMethod,
      fullName,
      phone,
      email,
      idNumber,
      birthDate,
      city,
      gender,
      education,
      experience,
      step: nextStep
    }))
  }

  // Automatic saving on state changes
  useEffect(() => {
    if (step < 5 && (selectedFormations.length > 0 || fullName || phone || email || idNumber || birthDate || city || gender || education || experience || paymentMethod)) {
      saveDraft(step)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFormations, acompte, paymentMethod, fullName, phone, email, idNumber, birthDate, city, gender, education, experience, step])

  const handleDownloadReceiptPDF = async () => {
    if (!receiptRef.current) return;
    setIsDownloadingReceipt(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const formattedName = fullName.trim().toUpperCase().replace(/\s+/g, '-');
      pdf.save(`Reçu-GALF-${formattedName || 'Preinscription'}.pdf`);
    } catch (err) {
      console.error('Failed to generate Receipt PDF', err);
    } finally {
      setIsDownloadingReceipt(false);
    }
  }

  const playPromoSound = (type: 'success' | 'fail' | 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(659.25, now + 0.1)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'fail') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(150, now)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, now)
        gain.gain.setValueAtTime(0.015, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
      }
      setTimeout(() => ctx.close(), 400)
    } catch {}
  }

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim()
    if (code === 'GALF2026') {
      setDiscountPercent(10)
      setPromoApplied(true)
      setPromoError('')
      playPromoSound('success')
    } else if (code === 'CACES15') {
      setDiscountPercent(15)
      setPromoApplied(true)
      setPromoError('')
      playPromoSound('success')
    } else if (code === 'MOTIVATION5') {
      setDiscountPercent(5)
      setPromoApplied(true)
      setPromoError('')
      playPromoSound('success')
    } else {
      setPromoError('Code promotionnel invalide')
      playPromoSound('fail')
    }
  }

  const handleConfirmEnrollment = async () => {
    playPromoSound('click')
    setIsSaving(true)
    setSaveError('')
    
    let sponsorUserId = ""
    let campaignId = "campagne-initiale-2026"
    
    if (detectedRefCode) {
      try {
        const codeSnap = await dbGetDoc("referral_codes", detectedRefCode)
        if (codeSnap.exists()) {
          const codeData = codeSnap.data()
          sponsorUserId = codeData.userId
          campaignId = codeData.campaignId || "campagne-initiale-2026"
        }
      } catch (e) {
        console.error("Failed to retrieve sponsor code details:", e)
      }
    }
    
    try {
      const selectedId = selectedFormations[0] || ""
      const formation = GALF_FORMATIONS.find(f => f.id === selectedId)
      const centerId = formation?.category === "Mines & Engins" ? "Chantier-École de Yopougon" : "Centre Pratique de Korhogo"
      
      await registerReferredProspect({
        campaignId,
        sponsorUserId,
        referralCode: detectedRefCode || "",
        fullName,
        email: email || `candidat-${phone.replace(/[^0-9]/g, '')}@galf-ref.ci`,
        city,
        commune: city.toLowerCase() === 'abidjan' ? 'Yopougon' : '',
        desiredFormationId: selectedId,
        preferredCenterId: centerId,
        currentSituation: experience || "Débutant",
        availability: "Immédiate",
        professionalObjective: `Obtenir la certification ${formation?.name || "BTP"} et s'insérer sur le marché de l'emploi.`,
        source: detectedRefCode ? "ambassadeur" : "site_direct"
      }, phone)
      
      const nextStep = step + 1
      setStep(nextStep)
      saveDraft(nextStep)
    } catch (err: any) {
      console.error(err)
      setSaveError(err.message || "Erreur de connexion lors de l'enregistrement de votre dossier.")
      playPromoSound('fail')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedList = GALF_FORMATIONS.filter(f => selectedFormations.includes(f.id))
  const basePrice = selectedList.reduce((sum, f) => sum + (f.pricePromo || f.price), 0)
  const discountAmount = (basePrice * discountPercent) / 100
  const price = basePrice - discountAmount
  const totalAcompte = (price * acompte) / 100

  const paymentMethods = [
    { id: 'wave', label: 'Wave', color: 'bg-[#1DB9D4]', logo: '🌊' },
    { id: 'orange', label: 'Orange Money', color: 'bg-[#FF7900]', logo: '🍊' },
    { id: 'mtn', label: 'MTN MoMo', color: 'bg-[#FFCC00]', logo: '💸' },
    { id: 'cash', label: 'Espèces (Agence)', color: 'bg-galf-carbon', logo: '🏢' },
  ]

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="INSCRIPTION GALF"
        subtitle="Processus sécurisé en 5 étapes. Votre avenir commence ici."
        badge="Rejoignez l'élite"
        bgImage="/images/cinematic/animate-2026-04-15T170949.508-ezgif.com-video-to-webp-converter.webp"
        centered={true}
      />

      <div className="container-galf relative z-10 mt-12">

        {/* Feature 97: Draft Restored Alert Banner */}
        {draftRestored && (
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl flex items-center justify-between border border-green-500/30 bg-green-500/5 backdrop-blur-md text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--galf-text)' }}>Brouillon restauré !</h4>
                  <p className="text-[10px]" style={{ color: 'var(--galf-text-secondary)' }}>Nous avons récupéré vos informations de session précédente pour vous faire gagner du temps.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { playPromoSound('click'); setDraftRestored(false); }}
                className="text-[10px] font-black uppercase text-galf-yellow hover:underline px-3 py-1.5"
              >
                Ignorer
              </button>
            </div>
          </FadeIn>
        )}

        {detectedRefCode && (
          <FadeIn>
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl flex items-center justify-between border border-galf-yellow/30 bg-galf-yellow/5 backdrop-blur-md text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-galf-yellow/10 flex items-center justify-center text-galf-yellow shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Avantage Parrainage Activé !</h4>
                  <p className="text-[10px] text-white/60">
                    Vous êtes recommandé par l&apos;ambassadeur <strong className="text-galf-yellow font-mono">{detectedRefCode}</strong>. Votre dossier bénéficie d&apos;un traitement prioritaire.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Steps Progress */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center mb-16 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
                    step > i + 1 ? 'bg-green-500 text-white rotate-[360deg]' :
                    step === i + 1 ? 'bg-galf-yellow text-galf-carbon shadow-[0_0_20px_rgba(255,176,0,0.3)]' :
                    'bg-galf-surface border border-galf-border text-galf-text-muted'
                  }`}>
                    {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-3 hidden sm:block ${step === i + 1 ? 'text-galf-yellow' : 'opacity-40'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div className={`h-[1px] w-full transition-all duration-700 ${step > i + 1 ? 'bg-green-500' : 'bg-galf-border'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>1. Sélectionnez votre domaine</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 px-1">
                  {GALF_FORMATIONS.filter(f => f.status === 'Actif').map(f => {
                    const isSelected = selectedFormations.includes(f.id)
                    return (
                      <button key={f.id} onClick={() => toggleFormation(f.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group border-2 ${isSelected ? 'border-galf-yellow' : 'border-galf-border hover:border-galf-yellow/40'}`}
                        style={{ background: isSelected ? 'var(--galf-yellow-glow)' : 'var(--galf-surface)' }}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-galf-yellow border-galf-yellow text-galf-carbon' : 'border-galf-border group-hover:border-galf-yellow/60'
                          }`}>
                            {isSelected && <span className="text-[10px] font-black">✓</span>}
                          </div>
                          <div>
                            <div className="font-black text-sm" style={{ color: 'var(--galf-text)' }}>{f.name}</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest mt-1 text-galf-yellow">{f.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black" style={{ color: 'var(--galf-text)' }}>{(f.pricePromo || f.price).toLocaleString('fr-FR')} F</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          )}

          {step === 2 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-black mb-8" style={{ color: 'var(--galf-text)' }}>2. Vos coordonnées &amp; Justificatifs</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Nom complet *</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" 
                      placeholder="Ex: Jean Kouassi" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">WhatsApp / Tel *</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" 
                      placeholder="+225 07..." 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Email professionnel *</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" 
                      placeholder="jean@mail.com" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">N° de CNI / Passeport *</label>
                    <input 
                      type="text" 
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" 
                      placeholder="Ex: C01234567" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Date de naissance *</label>
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all text-sm" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Genre / Sexe *</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all text-sm cursor-pointer"
                      required
                    >
                      <option value="" disabled>Sélectionner le genre</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Ville de résidence *</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all" 
                      placeholder="Ex: Abidjan, Bouaké..." 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Niveau d'études *</label>
                    <select 
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all text-sm cursor-pointer"
                      required
                    >
                      <option value="" disabled>Sélectionner votre niveau</option>
                      <option value="Sans diplôme">Sans diplôme</option>
                      <option value="CAP / BEP">CAP / BEP</option>
                      <option value="BAC">BAC</option>
                      <option value="BAC+2">BAC+2 (BTS, etc.)</option>
                      <option value="BAC+3 et plus">BAC+3 et plus (Licence, Master)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Expérience en conduite d'engins *</label>
                    <select 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 focus:border-galf-yellow outline-none transition-all text-sm cursor-pointer"
                      required
                    >
                      <option value="" disabled>Sélectionner votre expérience</option>
                      <option value="Débutant (Jamais conduit)">Débutant (Jamais conduit)</option>
                      <option value="Intermédiaire (Bases de conduite)">Intermédiaire (Bases de conduite)</option>
                      <option value="Expérimenté (Déjà opérateur certifié)">Expérimenté (Déjà opérateur certifié)</option>
                    </select>
                  </div>
                </div>

                {/* Feature 98: Document Validator Simulator */}
                <div className="grid md:grid-cols-2 gap-6 mt-6 border-t border-white/5 pt-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">CNI ou Passeport (PDF / JPG, Max 5 Mo)</label>
                    <div className="p-4 rounded-xl border border-dashed border-white/15 bg-black/20 text-center relative hover:border-galf-yellow transition-all">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const isValid = file.size <= 5 * 1024 * 1024 && (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg')
                            setCniFile({ name: file.name, size: `${Math.round(file.size / 1024 / 1024 * 10) / 10} Mo`, valid: isValid })
                            playPromoSound(isValid ? 'success' : 'fail')
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {cniFile ? (
                        <div className="text-xs">
                          <span className={cniFile.valid ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                            {cniFile.valid ? "✅ Fichier conforme" : "❌ Fichier invalide"}
                          </span>
                          <p className="text-[10px] opacity-60 truncate mt-1">{cniFile.name} ({cniFile.size})</p>
                        </div>
                      ) : (
                        <span className="text-[10px] opacity-40">Déposer ou cliquer pour ajouter la CNI</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Certificat Médical (PDF / JPG, Max 5 Mo)</label>
                    <div className="p-4 rounded-xl border border-dashed border-white/15 bg-black/20 text-center relative hover:border-galf-yellow transition-all">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const isValid = file.size <= 5 * 1024 * 1024 && (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg')
                            setCertifFile({ name: file.name, size: `${Math.round(file.size / 1024 / 1024 * 10) / 10} Mo`, valid: isValid })
                            playPromoSound(isValid ? 'success' : 'fail')
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {certifFile ? (
                        <div className="text-xs">
                          <span className={certifFile.valid ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                            {certifFile.valid ? "✅ Fichier conforme" : "❌ Fichier invalide"}
                          </span>
                          <p className="text-[10px] opacity-60 truncate mt-1">{certifFile.name} ({certifFile.size})</p>
                        </div>
                      ) : (
                        <span className="text-[10px] opacity-40">Déposer ou cliquer pour ajouter le certificat</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feature 99: Motivation Test */}
                <div className="mt-8 pt-6 text-left" style={{ borderTop: '1px solid var(--galf-border)' }}>
                  <h3 className="text-xs font-black uppercase text-galf-yellow tracking-widest mb-3 flex items-center gap-1.5">
                    <Smile className="w-4 h-4" /> Optionnel : Test de Motivation d'Opérateur
                  </h3>
                  <p className="text-[11px] mb-4" style={{ color: 'var(--galf-text-muted)' }}>
                    Évaluez votre profil et débloquez une réduction immédiate de 5% si vous obtenez un score de motivation optimal.
                  </p>

                  {!showMotivationTest && !motivationDone ? (
                    <button
                      type="button"
                      onClick={() => { playPromoSound('click'); setShowMotivationTest(true); }}
                      className="text-[10px] font-black uppercase py-2.5 px-4 rounded-xl transition-all"
                      style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                    >
                      Lancer le test de motivation
                    </button>
                  ) : showMotivationTest && !motivationDone ? (
                    <div className="p-4 rounded-2xl space-y-3" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                      <span className="text-[9px] font-black text-galf-yellow uppercase">Question {motivationQIdx + 1} / {motivationQuestions.length}</span>
                      <h4 className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>{motivationQuestions[motivationQIdx].q}</h4>
                      <div className="flex flex-col gap-2">
                        {motivationQuestions[motivationQIdx].opts.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              playPromoSound('click')
                              setMotivationScore(prev => prev + opt.pts)
                              if (motivationQIdx < motivationQuestions.length - 1) {
                                setMotivationQIdx(prev => prev + 1)
                              } else {
                                setMotivationDone(true)
                                setShowMotivationTest(false)
                                playPromoSound('success')
                              }
                            }}
                            className="w-full text-left p-2.5 rounded-lg border text-xs transition-all animate-fadeIn"
                            style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center space-y-2">
                      <h4 className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>Test terminé avec succès !</h4>
                      <p className="text-[10px]" style={{ color: 'var(--galf-text-secondary)' }}>
                        {motivationScore >= 8 
                          ? "🌟 Félicitations ! Votre profil démontre une motivation exceptionnelle. Utilisez le code promo suivant à l'étape de paiement : MOTIVATION5" 
                          : "Merci d'avoir complété le test ! Votre dossier sera analysé en priorité par nos recruteurs."
                        }
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </FadeIn>
          )}

          {step === 3 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>3. Modalités de paiement</h2>
                
                <div className="mb-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4 block">Montant de l'acompte</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 50, 100].map(val => (
                      <button key={val} onClick={() => setAcompte(val)}
                        className={`p-4 rounded-xl font-black text-sm transition-all border ${acompte === val ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'bg-galf-bg border-galf-border opacity-60'}`}>
                        {val}%
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/20 flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Acompte à régler :</span>
                    <span className="font-black text-galf-yellow">{totalAcompte.toLocaleString('fr-FR')} F CFA</span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4 block">Moyen de paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map(pm => (
                      <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                        className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${paymentMethod === pm.id ? 'border-galf-yellow bg-galf-yellow/10' : 'bg-galf-bg border-galf-border opacity-60 hover:opacity-100'}`}>
                        <span className="text-xl">{pm.logo}</span>
                        <span className="font-black text-xs">{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature 100: Promo Code Calculator */}
                <div className="border-t border-white/5 pt-6 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2 block">Code Promotionnel (Optionnel)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value)
                        setPromoError('')
                      }}
                      placeholder="Ex: GALF2026, MOTIVATION5"
                      className="flex-1 bg-galf-bg border border-galf-border rounded-xl p-3 focus:border-galf-yellow outline-none text-xs transition-all uppercase"
                      disabled={promoApplied}
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      className={`px-6 rounded-xl font-black text-xs uppercase transition-all ${
                        promoApplied 
                          ? 'bg-green-500 text-white cursor-default' 
                          : 'bg-galf-yellow text-galf-carbon hover:brightness-110'
                      }`}
                      disabled={promoApplied}
                    >
                      {promoApplied ? 'Appliqué' : 'Valider'}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-400 text-[10px] mt-2 font-bold">{promoError}</p>
                  )}
                  {promoApplied && (
                    <div className="mt-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-left space-y-1.5 animate-fadeIn">
                      <p className="text-green-400 text-[10px] font-bold">
                        🎉 Réduction de {discountPercent}% appliquée avec succès !
                      </p>
                      <div className="text-[10px] space-y-0.5" style={{ color: 'var(--galf-text-muted)' }}>
                        <div className="flex justify-between">
                          <span>Tarif d'origine :</span>
                          <span className="line-through">{basePrice.toLocaleString('fr-FR')} F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remise ({discountPercent}%) :</span>
                          <span>-{discountAmount.toLocaleString('fr-FR')} F</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 mt-1" style={{ borderTop: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>
                          <span>Nouveau tarif :</span>
                          <span className="text-galf-yellow">{price.toLocaleString('fr-FR')} F CFA</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </FadeIn>
          )}

          {step === 4 && (
            <FadeIn>
              <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <FileCheck className="w-24 h-24 text-galf-yellow" />
                </div>
                <h2 className="text-xl font-black mb-8" style={{ color: 'var(--galf-text)' }}>4. Récapitulatif de dossier</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-start py-4 border-b border-galf-border">
                    <span className="text-xs font-bold opacity-60">Formations choisies</span>
                    <span className="font-black text-right max-w-[250px] flex flex-col gap-1">
                      {selectedList.map(f => (
                        <span key={f.id}>{f.name} ({(f.pricePromo || f.price).toLocaleString('fr-FR')} F)</span>
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-galf-border">
                    <span className="text-xs font-bold opacity-60">Total Formation</span>
                    <span className="font-black">{price.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-galf-border">
                    <span className="text-xs font-bold opacity-60">Acompte ({acompte}%)</span>
                    <span className="font-black text-galf-yellow">{totalAcompte.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-xs font-bold opacity-60">Méthode de règlement</span>
                    <span className="font-black uppercase text-xs">{paymentMethod || 'Non spécifié'}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-[10px] leading-relaxed opacity-70">En cliquant sur confirmer, vous recevrez les instructions de paiement par SMS/WhatsApp. L'inscription n'est validée qu'après confirmation du dépôt.</p>
                </div>
              </div>
            </FadeIn>
          )}

                    {step === 5 && (
            <FadeIn>
              <div className="glass-card p-8 md:p-12 rounded-2xl text-center shadow-2xl border-2 border-green-500/30">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black mb-3">Dossier de pré-inscription transmis !</h2>
                <p className="text-xs mb-6 opacity-70 max-w-md mx-auto">
                  Votre pré-inscription est enregistrée avec succès. Pour valider définitivement votre place, veuillez procéder au paiement de votre acompte de <span className="font-bold text-galf-yellow">{totalAcompte.toLocaleString('fr-FR')} F CFA</span>.
                </p>

                {/* Official Receipt Card (Light Theme for Printing) */}
                <div className="my-8 max-w-xl mx-auto text-left bg-white text-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl relative overflow-hidden font-sans" ref={receiptRef}>
                  {/* Watermark/Grid decoration */}
                  <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '15px 15px' }} />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-[5rem] -z-0" />
                  
                  {/* Decorative Borders */}
                  <div className="absolute inset-4 border border-slate-100 pointer-events-none rounded-2xl" />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <div className="text-galf-yellow font-black text-lg tracking-wider font-sans uppercase">GALF FORMATION</div>
                        <div className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Chantier-École d'Excellence</div>
                        <div className="text-[7px] text-slate-400 mt-0.5">Abidjan, Côte d'Ivoire · Contact: +225 07 08 73 68 71</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase bg-green-100 text-green-700 border border-green-200">
                          Pré-inscrit
                        </span>
                        <div className="text-[9px] font-mono text-slate-500 mt-1.5 font-bold">{receiptId}</div>
                      </div>
                    </div>

                    <h3 className="text-center text-sm font-black uppercase tracking-wider text-slate-800 mb-4">Fiche de Pré-inscription Officielle</h3>

                    {/* Content Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-[10px]">
                      <div className="space-y-1.5">
                        <h4 className="text-[8px] uppercase tracking-widest text-slate-400 font-black">Informations Candidat</h4>
                        <div className="bg-slate-50 p-3 rounded-xl space-y-1 border border-slate-100">
                          <div><span className="font-medium text-slate-500">Nom :</span> <strong className="text-slate-800 uppercase">{fullName || 'Non renseigné'}</strong></div>
                          <div><span className="font-medium text-slate-500">WhatsApp :</span> <strong className="text-slate-800">{phone || 'Non renseigné'}</strong></div>
                          <div><span className="font-medium text-slate-500">Email :</span> <strong className="text-slate-800">{email || 'Non renseigné'}</strong></div>
                          <div><span className="font-medium text-slate-500">N° Pièce :</span> <strong className="text-slate-800">{idNumber || 'Non renseigné'}</strong></div>
                          <div><span className="font-medium text-slate-500">Date Naiss. :</span> <strong className="text-slate-800">{birthDate || 'Non renseigné'}</strong></div>
                          <div><span className="font-medium text-slate-500">Ville :</span> <strong className="text-slate-800">{city || 'Non renseigné'}</strong></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-[8px] uppercase tracking-widest text-slate-400 font-black">Détails Formations</h4>
                        <div className="bg-slate-50 p-3 rounded-xl space-y-1 border border-slate-100">
                          <div>
                            <span className="font-medium text-slate-500">Formations :</span>{' '}
                            <strong className="text-slate-800">
                              {selectedList.map(f => f.name).join(', ')}
                            </strong>
                          </div>
                          <div><span className="font-medium text-slate-500">Date :</span> <strong className="text-slate-800">{registrationDate}</strong></div>
                          {detectedRefCode && (
                            <div className="mt-1 pt-1 border-t border-slate-100 flex justify-between">
                              <span className="font-medium text-slate-500">Code Parrain :</span>
                              <strong className="text-galf-yellow font-mono text-[9px]">{detectedRefCode}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-slate-900 text-white rounded-xl p-4 mb-6">
                      <h4 className="text-[8px] uppercase tracking-widest text-slate-400 font-black mb-3">Résumé Financier</h4>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex justify-between text-slate-300">
                          <span>Prix de base de la formation :</span>
                          <span>{basePrice.toLocaleString('fr-FR')} F CFA</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span>Remise appliquée ({discountPercent}%) :</span>
                            <span>-{discountAmount.toLocaleString('fr-FR')} F CFA</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold pt-1.5 border-t border-slate-800">
                          <span>Total de la formation :</span>
                          <span className="text-galf-yellow">{price.toLocaleString('fr-FR')} F CFA</span>
                        </div>
                        <div className="flex justify-between font-black pt-1.5 border-t border-dashed border-slate-800">
                          <span>Acompte dû ({acompte}%) :</span>
                          <span className="text-green-400">{totalAcompte.toLocaleString('fr-FR')} F CFA</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[8px] pt-1">
                          <span>Solde restant à régler au démarrage :</span>
                          <span>{(price - totalAcompte).toLocaleString('fr-FR')} F CFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / QR Validation */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 gap-4">
                      <div>
                        <div className="text-[9px] font-bold text-slate-800">Méthode choisie : <span className="uppercase text-galf-yellow font-black">{paymentMethod || 'Non spécifié'}</span></div>
                        <p className="text-[8px] text-slate-400 mt-1 leading-relaxed">
                          Ce reçu fait office de preuve de pré-enregistrement sous réserve de la validation du paiement de l'acompte dans un délai de 48 heures.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-12 h-12 bg-white border border-slate-200 p-1 rounded-lg flex items-center justify-center">
                          {/* Structured Grid QR Code Mock */}
                          <div className="w-full h-full opacity-80 flex flex-wrap gap-[1px]">
                            {Array.from({length: 49}).map((_, i) => (
                              <div key={i} className={`w-[13%] h-[13%] ${((i * 7 + 13) % 5 === 0 || (i % 3 === 0 && i % 2 === 0)) ? 'bg-slate-900' : 'bg-transparent'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-[7px] text-slate-400 leading-tight">
                          <span className="font-bold text-slate-600 block">Vérifié par GALF</span>
                          ID: {receiptId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 max-w-xl mx-auto">
                  <button 
                    onClick={handleDownloadReceiptPDF}
                    disabled={isDownloadingReceipt}
                    className="flex-1 bg-galf-yellow text-galf-carbon px-6 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> 
                    {isDownloadingReceipt ? "Génération PDF..." : "Télécharger mon Reçu Officiel (PDF)"}
                  </button>
                </div>

                <div className="border-t border-white/5 pt-6 mb-6">
                  <p className="text-[11px] opacity-75 mb-4 font-bold">Sélectionnez votre moyen de paiement pour régler l'acompte :</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 max-w-xl mx-auto">
                    <a href="https://pay.wave.com/m/M_ci_1b4IJS09Q_cJ/c/ci/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#1DB9D4] text-white px-6 py-3.5 rounded-xl font-black text-xs hover:brightness-110 transition-all flex-1">
                      <span className="text-lg">🌊</span> Payer via Wave
                    </a>
                    <a href="tel:+2250708736871" className="flex flex-col items-center justify-center gap-0.5 bg-[#FF7900] text-white px-6 py-3 rounded-xl font-black text-xs hover:brightness-110 transition-all flex-1">
                      <span className="flex items-center gap-1.5"><span className="text-lg">🍊</span> Orange Money</span>
                      <span className="text-[9px] font-normal">+225 07 08 73 68 71</span>
                    </a>
                    <a href="tel:+2250556966492" className="flex flex-col items-center justify-center gap-0.5 bg-[#FFCC00] text-black px-6 py-3 rounded-xl font-black text-xs hover:brightness-110 transition-all flex-1">
                      <span className="flex items-center gap-1.5"><span className="text-lg">💸</span> MTN MoMo</span>
                      <span className="text-[9px] font-normal">+225 05 56 96 64 92</span>
                    </a>
                  </div>
                </div>

                {/* Viral Loops: Invite candidate to become an ambassador */}
                <div className="my-8 p-6 rounded-2xl border border-galf-yellow/20 bg-galf-yellow/5 text-left max-w-xl mx-auto backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy className="w-16 h-16 text-galf-yellow" />
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">Remboursez votre formation ! 🎁</h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        Rejoignez le programme Ambassadeurs de GALF FORMATION. Si <strong className="text-galf-yellow font-bold">5 proches</strong> s&apos;inscrivent avec votre lien, votre propre formation devient <strong className="text-galf-yellow font-bold">100% GRATUITE</strong> et votre acompte vous sera intégralement remboursé !
                      </p>
                      <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <Link 
                          href="/programme-ambassadeur/inscription" 
                          className="px-4 py-2.5 rounded-lg bg-galf-yellow text-galf-carbon font-black text-[10px] uppercase tracking-wider text-center hover:brightness-110 transition-all shadow-md font-bold"
                        >
                          Devenir Ambassadeur
                        </Link>
                        <Link 
                          href="/programme-ambassadeur" 
                          className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider text-center hover:bg-white/10 transition-all"
                        >
                          En savoir plus
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link href="/apprenant" className="bg-galf-surface border border-galf-border text-galf-text px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:border-galf-yellow/30 flex items-center justify-center gap-2 transition-all">
                    Accéder à mon espace apprenant <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          )}

          {step < totalSteps && (
            <FadeIn delay={0.2} className="flex justify-between mt-10">
               <button 
                 onClick={() => {
                   playPromoSound('click');
                   const nextStep = step - 1;
                   setStep(nextStep);
                   saveDraft(nextStep);
                 }} 
                 disabled={step === 1}
                 className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold opacity-60 hover:opacity-100 disabled:opacity-0 transition-all"
               >
                 <ArrowLeft className="w-4 h-4" /> Retour
               </button>
               <div className="flex flex-col items-end gap-3">
                  {saveError && (
                    <div className="text-[10px] font-black text-red-400 uppercase bg-red-500/5 border border-red-500/10 px-3 py-1.5 rounded-lg mb-1">
                      ⚠️ {saveError}
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      if (step === 4) {
                        handleConfirmEnrollment()
                      } else {
                        playPromoSound('click')
                        const nextStep = step + 1
                        setStep(nextStep)
                        saveDraft(nextStep)
                      }
                    }} 
                    disabled={
                       isSaving ||
                       (step === 1 && selectedFormations.length === 0) || 
                       (step === 2 && (
                         !fullName.trim() || 
                         !phone.trim() || 
                         !email.trim() || 
                         !idNumber.trim() || 
                         !birthDate || 
                         !city.trim() || 
                         !gender || 
                         !education || 
                         !experience
                       )) || 
                       (step === 3 && !paymentMethod)
                     }
                    className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-xl font-black hover:brightness-110 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50 min-w-[200px] justify-center"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4.5 h-4.5 border-2 border-galf-carbon border-t-transparent rounded-full animate-spin" />
                        Traitement...
                      </span>
                    ) : (
                      <>
                        {step === 4 ? "Confirmer l'inscription" : "Étape suivante"} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  )
}
