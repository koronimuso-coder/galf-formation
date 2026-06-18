"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, BookOpen, Lock, CheckCircle, ArrowRight, ArrowLeft, 
  Sparkles, CheckCircle2, ShieldCheck, AlertTriangle 
} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { GALF_FORMATIONS } from '@/lib/data'
import { registerUser } from '@/lib/firebase/services/auth'
import { registerSponsor, getCampaigns, Campaign } from '@/lib/firebase/services/referral'
import { PageHeader } from '@/components/layout/PageHeader'

export default function InscriptionParrain() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null)

  // ── FORM STATE ──
  // Step 1: Identity
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [ville, setVille] = useState('Abidjan')
  const [commune, setCommune] = useState('')

  // Step 2: Project
  const [formationSouhaitee, setFormationSouhaitee] = useState(GALF_FORMATIONS[1].id)
  const [centrePrefere, setCentrePrefere] = useState('Chantier-École de Yopougon')
  const [situationActuelle, setSituationActuelle] = useState('Recherche d\'emploi')
  const [disponibilite, setDisponibilite] = useState('Immédiate')
  const [objectifProfessionnel, setObjectifProfessionnel] = useState('')
  const [sourceDecouverte, setSourceDecouverte] = useState('Facebook')

  // Step 3: Account
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptReglement, setAcceptReglement] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptComm, setAcceptComm] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaign = async () => {
      const list = await getCampaigns()
      const active = list.find(c => c.status === 'active')
      if (active) setActiveCampaign(active)
    }
    fetchCampaign()
  }, [])

  // Auto-saver: Restore draft on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('galf_sponsor_signup_draft')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.nom) setNom(parsed.nom)
          if (parsed.prenom) setPrenom(parsed.prenom)
          if (parsed.whatsapp) setWhatsapp(parsed.whatsapp)
          if (parsed.email) setEmail(parsed.email)
          if (parsed.ville) setVille(parsed.ville)
          if (parsed.commune) setCommune(parsed.commune)
          
          if (parsed.formationSouhaitee) setFormationSouhaitee(parsed.formationSouhaitee)
          if (parsed.centrePrefere) setCentrePrefere(parsed.centrePrefere)
          if (parsed.situationActuelle) setSituationActuelle(parsed.situationActuelle)
          if (parsed.disponibilite) setDisponibilite(parsed.disponibilite)
          if (parsed.objectifProfessionnel) setObjectifProfessionnel(parsed.objectifProfessionnel)
          if (parsed.sourceDecouverte) setSourceDecouverte(parsed.sourceDecouverte)
          
          if (parsed.step) setStep(parsed.step)
        } catch (e) {}
      }
    }
  }, [])

  // Auto-saver: Save draft on change
  const saveDraft = (nextStep: number) => {
    localStorage.setItem('galf_sponsor_signup_draft', JSON.stringify({
      nom, prenom, whatsapp, email, ville, commune,
      formationSouhaitee, centrePrefere, situationActuelle, disponibilite, objectifProfessionnel, sourceDecouverte,
      step: nextStep
    }))
  }

  useEffect(() => {
    if (step < 4) {
      saveDraft(step)
    }
  }, [nom, prenom, whatsapp, email, ville, commune, formationSouhaitee, centrePrefere, situationActuelle, disponibilite, objectifProfessionnel, sourceDecouverte, step])

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('galf_sponsor_signup_draft')
  }

  // Audio Click Feedback
  const playClick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(450, now)
      gain.gain.setValueAtTime(0.01, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      osc.start(now)
      osc.stop(now + 0.05)
      setTimeout(() => ctx.close(), 100)
    } catch (e) {}
  }

  // Next step validation
  const canGoNext = () => {
    if (step === 1) {
      return nom.trim() !== '' && prenom.trim() !== '' && whatsapp.trim() !== '' && ville.trim() !== '' && commune.trim() !== ''
    }
    if (step === 2) {
      return formationSouhaitee !== '' && centrePrefere !== '' && situationActuelle !== '' && disponibilite !== '' && objectifProfessionnel.trim().length >= 10
    }
    if (step === 3) {
      return password.length >= 6 && password === confirmPassword && acceptReglement && acceptPrivacy && acceptComm
    }
    return true
  }

  const handleNext = () => {
    playClick()
    if (canGoNext()) {
      setStep(prev => prev + 1)
      setErrorMessage('')
    }
  }

  const handleBack = () => {
    playClick()
    if (step > 1) {
      setStep(prev => prev - 1)
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playClick()
    if (!canGoNext() || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage('')

    const campaignId = activeCampaign?.id || "campagne-initiale-2026"
    
    // For parrains, email defaults to a placeholder if empty
    const userEmail = email.trim() !== '' ? email.trim() : `parrain-${whatsapp}@galf-ref.ci`

    try {
      // 1. Create account
      const userProfile = await registerUser(userEmail, password, `${prenom} ${nom}`, 'PARRAIN')
      
      // 2. Register Sponsor Member details
      await registerSponsor(
        userProfile.uid,
        campaignId,
        {
          whatsapp,
          city: ville,
          commune,
          currentSituation: situationActuelle,
          availability: disponibilite,
          objective: objectifProfessionnel,
          discoverySource: sourceDecouverte,
          termsAccepted: acceptReglement,
          marketingConsent: acceptMarketing
        },
        prenom
      )

      clearDraft()
      router.push('/programme-ambassadeur/dashboard')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Une erreur s'est produite lors de l'inscription. Veuillez vérifier vos informations.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedFormation = GALF_FORMATIONS.find(f => f.id === formationSouhaitee)

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="INSCRIPTION AMBASSADEUR"
        subtitle="Créez votre profil parrain et commencez à recommander GALF."
        badge="Rejoignez la communauté"
        bgImage="/images/cinematic/animate-2026-04-15T170949.508-ezgif.com-video-to-webp-converter.webp"
        centered={true}
      />

      <div className="container-galf mt-12 relative z-10 max-w-3xl">
        {/* Step tracker */}
        <div className="flex items-center justify-center mb-12 max-w-xl mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 ${
                  step > s ? 'bg-green-500 text-white' :
                  step === s ? 'bg-galf-yellow text-galf-carbon shadow-md' :
                  'bg-galf-surface border border-galf-border text-galf-text-muted'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : <span>0{s}</span>}
                </div>
              </div>
              {s < 4 && (
                <div className="flex-1 px-2">
                  <div className={`h-[1px] w-full ${step > s ? 'bg-green-500' : 'bg-galf-border'}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form container */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-black/30 border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMessage && (
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-left text-xs text-red-400 font-bold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="space-y-4 text-left animate-fadeIn">
                <h3 className="text-sm font-black uppercase text-galf-yellow tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> 1. Votre Identité
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Nom *</label>
                    <input type="text" placeholder="Ex: Kouadio" value={nom} onChange={e => setNom(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Prénoms *</label>
                    <input type="text" placeholder="Ex: Jean Renaud" value={prenom} onChange={e => setPrenom(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Numéro WhatsApp *</label>
                    <input type="tel" placeholder="Ex: +225 07 00 00 00 00" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                    <p className="text-[9px] text-white/40 italic">Ce numéro servira à vous envoyer vos notifications de parrainage.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Adresse E-mail (Facultatif)</label>
                    <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Ville de résidence *</label>
                    <input type="text" placeholder="Ex: Abidjan" value={ville} onChange={e => setVille(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Commune *</label>
                    <input type="text" placeholder="Ex: Yopougon" value={commune} onChange={e => setCommune(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROJECT */}
            {step === 2 && (
              <div className="space-y-4 text-left animate-fadeIn">
                <h3 className="text-sm font-black uppercase text-galf-yellow tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> 2. Votre Projet Pédagogique
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Formation souhaitée en récompense *</label>
                    <select value={formationSouhaitee} onChange={e => setFormationSouhaitee(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all cursor-pointer">
                      {GALF_FORMATIONS.filter(f => f.status === 'Actif').map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Centre d'examen préféré *</label>
                    <select value={centrePrefere} onChange={e => setCentrePrefere(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all cursor-pointer">
                      <option value="Chantier-École de Yopougon">Chantier-École de Yopougon (Abidjan)</option>
                      <option value="Centre d'Excellence de San Pedro">Centre d'Excellence de San Pedro</option>
                      <option value="Centre Pratique de Korhogo">Centre Pratique de Korhogo</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Situation actuelle *</label>
                    <select value={situationActuelle} onChange={e => setSituationActuelle(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all cursor-pointer">
                      <option value="Recherche d'emploi">Recherche d'emploi / Chômage</option>
                      <option value="Étudiant">Étudiant / Apprenant</option>
                      <option value="Salarié BTP">Salarié du secteur BTP/Mine</option>
                      <option value="Autre secteur">Salarié dans un autre domaine</option>
                      <option value="Indépendant">Entrepreneur / Indépendant</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Disponibilité pour formation *</label>
                    <select value={disponibilite} onChange={e => setDisponibilite(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all cursor-pointer">
                      <option value="Immédiate">Immédiate (Temps plein)</option>
                      <option value="Semaine de cours">En cours de semaine</option>
                      <option value="Weekend">Samedi et Dimanche uniquement</option>
                      <option value="Flexible">Flexible / Hybride</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Quel est votre objectif professionnel ? *</label>
                  <textarea rows={3} placeholder="Expliquez en quoi cette formation changera votre carrière... (min 10 caractères)" value={objectifProfessionnel} onChange={e => setObjectifProfessionnel(e.target.value)} required
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Comment avez-vous connu GALF FORMATION ?</label>
                  <select value={sourceDecouverte} onChange={e => setSourceDecouverte(e.target.value)}
                    className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all cursor-pointer">
                    <option value="Facebook">Réseaux Sociaux (Facebook, TikTok)</option>
                    <option value="Recommandation">Recommandation d'un ami</option>
                    <option value="Affiche">Panneau publicitaire / Affiche</option>
                    <option value="Presse">Radio / Télévision / Web</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: ACCOUNT & AGREEMENTS */}
            {step === 3 && (
              <div className="space-y-4 text-left animate-fadeIn">
                <h3 className="text-sm font-black uppercase text-galf-yellow tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4" /> 3. Sécurisation de votre Compte
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Mot de passe (min. 6 car.) *</label>
                    <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Confirmer mot de passe *</label>
                    <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                      className="w-full bg-galf-bg border border-galf-border rounded-xl p-3.5 text-xs text-white focus:border-galf-yellow outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Consentements Obligatoires</label>
                  
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input type="checkbox" checked={acceptReglement} onChange={e => setAcceptReglement(e.target.checked)} required
                      className="mt-0.5 rounded border-galf-border bg-galf-bg focus:ring-galf-yellow text-galf-yellow cursor-pointer w-4 h-4 shrink-0" />
                    <span className="text-[11px] text-galf-text-secondary leading-relaxed">
                      J'accepte sans réserve le règlement officiel du programme ambassadeur de GALF FORMATION. *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input type="checkbox" checked={acceptPrivacy} onChange={e => setAcceptPrivacy(e.target.checked)} required
                      className="mt-0.5 rounded border-galf-border bg-galf-bg focus:ring-galf-yellow text-galf-yellow cursor-pointer w-4 h-4 shrink-0" />
                    <span className="text-[11px] text-galf-text-secondary leading-relaxed">
                      J'accepte la politique de confidentialité de traitement de mes données personnelles et leur stockage sécurisé. *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input type="checkbox" checked={acceptComm} onChange={e => setAcceptComm(e.target.checked)} required
                      className="mt-0.5 rounded border-galf-border bg-galf-bg focus:ring-galf-yellow text-galf-yellow cursor-pointer w-4 h-4 shrink-0" />
                    <span className="text-[11px] text-galf-text-secondary leading-relaxed">
                      J'autorise GALF FORMATION à m'envoyer des notifications et communications officielles par WhatsApp ou e-mail. *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-white/5">
                    <input type="checkbox" checked={acceptMarketing} onChange={e => setAcceptMarketing(e.target.checked)}
                      className="mt-0.5 rounded border-galf-border bg-galf-bg focus:ring-galf-yellow text-galf-yellow cursor-pointer w-4 h-4 shrink-0" />
                    <span className="text-[11px] text-galf-text-secondary leading-relaxed">
                      (Optionnel) J'accepte de recevoir des offres d'emploi, actualités BTP et bons plans promotionnels de GALF FORMATION.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: RECAP & CONFIRMATION */}
            {step === 4 && (
              <div className="space-y-6 text-left animate-fadeIn">
                <h3 className="text-sm font-black uppercase text-galf-yellow tracking-widest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> 4. Vérification de vos Informations
                </h3>
                
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="opacity-50 font-bold">Ambassadeur</span>
                    <span className="font-black text-white">{prenom} {nom}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="opacity-50 font-bold">Contact WhatsApp</span>
                    <span className="font-black text-white font-mono">{whatsapp}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="opacity-50 font-bold">E-mail</span>
                    <span className="font-black text-white">{email || "Non spécifié"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="opacity-50 font-bold">Localisation</span>
                    <span className="font-black text-white">{ville} ({commune})</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="opacity-50 font-bold">Récompense Visée</span>
                    <span className="font-black text-galf-yellow">{selectedFormation?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="opacity-50 font-bold">Disponibilité</span>
                    <span className="font-black text-white">{disponibilite}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-galf-yellow/5 border border-galf-yellow/20 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-galf-yellow shrink-0" />
                  <p className="text-[10px] leading-relaxed text-galf-text-secondary">
                    Vos données sont cryptées et stockées de manière conforme en Côte d'Ivoire. En finalisant, vous créez votre espace Cockpit Ambassadeur.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t border-white/5">
              {step > 1 ? (
                <button type="button" onClick={handleBack} disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold opacity-60 hover:opacity-100 disabled:opacity-30 transition-all text-xs text-white border border-white/10 hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button type="button" onClick={handleNext} disabled={!canGoNext()}
                  className="bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-xs uppercase hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all flex items-center gap-2 shadow-md">
                  Étape suivante <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting || !canGoNext()}
                  className="bg-green-500 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all flex items-center gap-2 shadow-lg shadow-green-500/15">
                  {isSubmitting ? "Finalisation du profil..." : "Valider mon Inscription"} <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>
        </div>

        <div className="mt-8 text-center text-xs" style={{ color: 'var(--galf-text-secondary)' }}>
          Vous êtes déjà ambassadeur ?{' '}
          <Link href="/programme-ambassadeur/connexion" className="text-galf-yellow font-bold hover:underline inline-flex items-center gap-0.5">
            Connectez-vous à votre cockpit <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
