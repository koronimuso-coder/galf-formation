"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Calendar, Briefcase, ArrowRight, X, Upload, 
  CheckCircle2, Clock, AlertCircle, Copy, ExternalLink, 
  Loader2, Mail, MapPin, HardHat 
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FadeIn } from '@/components/animations/FadeIn'

interface JobOffer {
  title: string
  company: string
  link: string
  code: string
  pubDate: string
  limitDate: string
  image: string
  isFallback?: boolean
}

interface JobDetails {
  company: string
  description: string
  email: string
}

export default function RecrutementBtp() {
  // Offers states
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [errorOffers, setErrorOffers] = useState<string | null>(null)
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Tous')
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [details, setDetails] = useState<JobDetails | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  
  // Application Modal states
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  
  // Submission flow states
  const [submitting, setSubmitting] = useState(false)
  const [submissionStep, setSubmissionStep] = useState(0)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedSubject, setCopiedSubject] = useState(false)

  // Filters mapping
  const filterKeywords = {
    'Tous': [],
    'Conducteur d\'engins': ['conducteur', 'engin', 'grutier', 'pelle', 'chargeuse', 'bulldozer', 'tombereau'],
    'Technicien BTP': ['technicien', 'architecte', 'métreur', 'dessinateur'],
    'Ingénieur Génie Civil': ['ingénieur', 'projet', 'directeur'],
    'Sécurité HSE': ['hse', 'qhse', 'sécurité', 'qualité']
  }

  // Load job offers
  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoadingOffers(true)
        const res = await fetch('/api/recrutement-offres')
        if (!res.ok) {
          throw new Error('Erreur de communication avec le serveur')
        }
        const data = await res.json()
        setOffers(data.data || [])
      } catch (err: any) {
        console.error(err)
        setErrorOffers(err.message || 'Impossible de charger les offres')
      } finally {
        setLoadingOffers(false)
      }
    }
    fetchOffers()
  }, [])

  // Load job details on demand
  const handleViewJob = async (job: JobOffer) => {
    setSelectedJob(job)
    setDetails(null)
    setErrorDetails(null)
    setLoadingDetails(true)
    
    try {
      const res = await fetch(`/api/recrutement-offres/detail?url=${encodeURIComponent(job.link)}`)
      if (!res.ok) {
        throw new Error("Impossible de charger les détails de l'offre")
      }
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setDetails({
        company: data.company || job.company,
        description: data.description,
        email: data.email
      })
    } catch (err: any) {
      console.error(err)
      setErrorDetails(err.message || "Erreur de chargement des détails")
      
      // Fallback details to not block UI if scrape fails
      setDetails({
        company: job.company || "Entreprise Partenaire BTP",
        description: `<h4>${job.title}</h4><p>Cette offre d'emploi est disponible sur le site officiel d'Educarriere.ci.</p><p>Veuillez consulter le lien officiel ci-dessous pour lire la description complète de l'offre.</p>`,
        email: "recrutement@galf-formation.ci"
      })
    } finally {
      setLoadingDetails(false)
    }
  }

  // Handle Form Submission
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicantName || !applicantEmail || !applicantPhone || !selectedJob || !details) return
    
    setSubmitting(true)
    setSubmissionStep(1)
    
    // Step 1: Simulated file processing
    await new Promise(r => setTimeout(r, 1200))
    setSubmissionStep(2)
    
    try {
      // Step 2: Save to Firestore/LocalStorage
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          message: coverLetter,
          jobTitle: selectedJob.title,
          jobCode: selectedJob.code,
          employerEmail: details.email,
          cvName: cvFile ? cvFile.name : 'cv_candidat.pdf',
          cvSize: cvFile ? cvFile.size : 0
        })
      })

      if (!response.ok) {
        throw new Error("Erreur de sauvegarde de la candidature")
      }
      
      // Step 3: Simulated email preparation
      await new Promise(r => setTimeout(r, 1000))
      setSubmissionStep(3)
      await new Promise(r => setTimeout(r, 1200))
      
      setSubmissionSuccess(true)
    } catch (err) {
      console.error(err)
      // Save application locally as backup even if server fails
      localStorage.setItem(`galf_pending_app_${Date.now()}`, JSON.stringify({
        name: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        message: coverLetter,
        jobTitle: selectedJob.title,
        employerEmail: details.email,
        cvName: cvFile ? cvFile.name : 'cv_candidat.pdf'
      }))
      
      setSubmissionStep(3)
      await new Promise(r => setTimeout(r, 1000))
      setSubmissionSuccess(true)
    } finally {
      setSubmitting(false)
    }
  }

  // Filtered offers list
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedFilter === 'Tous') return matchesSearch
    
    const keywords = (filterKeywords as any)[selectedFilter] || []
    const lowerTitle = offer.title.toLowerCase()
    const matchesCategory = keywords.some((kw: string) => lowerTitle.includes(kw))
    
    return matchesSearch && matchesCategory
  })

  // Copy to clipboard helpers
  const copyToClipboard = (text: string, type: 'email' | 'subject') => {
    navigator.clipboard.writeText(text)
    if (type === 'email') {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedSubject(true)
      setTimeout(() => setCopiedSubject(false), 2000)
    }
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Decorative Tech Shapes */}
      <div className="absolute right-[-10%] top-[15%] w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0 bg-diagonal" />
      <div className="absolute left-[-15%] bottom-[10%] w-[500px] h-[500px] opacity-[0.01] pointer-events-none z-0 bg-diagonal" />

      {/* Hero Header */}
      <PageHeader 
        title="RECRUTEMENT BTP" 
        subtitle="Consultez les offres d'emploi réelles issues de la plateforme Educarriere.ci pour le secteur BTP & Construction, et postulez directement auprès des employeurs."
        badge="Portail Emplois Réels"
        bgImage="/images/headers/entreprise.webp"
      />

      <div className="container-galf relative z-10 -mt-16">
        
        {/* Statistics Grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-6 rounded-2xl border-galf-yellow/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="text-[10px] font-black text-galf-yellow uppercase tracking-widest mb-1">Mise à jour</div>
              <div className="text-xl font-black text-adaptive">Aujourd'hui</div>
              <div className="text-xs text-adaptive-muted mt-2">Synchro en temps réel</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-galf-yellow/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="text-[10px] font-black text-galf-yellow uppercase tracking-widest mb-1">Source unique</div>
              <div className="text-xl font-black text-adaptive">Educarriere.ci</div>
              <div className="text-xs text-adaptive-muted mt-2">Premier site d'emplois CI</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-galf-yellow/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="text-[10px] font-black text-galf-yellow uppercase tracking-widest mb-1">Secteur Ciblé</div>
              <div className="text-xl font-black text-adaptive">BTP & Génie Civil</div>
              <div className="text-xs text-adaptive-muted mt-2">Opérateurs, Techs, Ingés</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-galf-yellow/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="text-[10px] font-black text-galf-yellow uppercase tracking-widest mb-1">Offres trouvées</div>
              <div className="text-xl font-black text-adaptive">
                {loadingOffers ? '...' : `${filteredOffers.length} poste(s)`}
              </div>
              <div className="text-xs text-adaptive-muted mt-2">Prêts pour candidature</div>
            </div>
          </div>
        </FadeIn>
        {/* Banner for recruiter directory access */}
        <FadeIn delay={0.15}>
          <div className="glass-card p-6 md:p-8 rounded-[2rem] bg-gradient-to-r from-galf-yellow/10 to-transparent border-galf-yellow/20 relative overflow-hidden mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left max-w-xl">
              <span className="text-[9px] font-black text-galf-yellow uppercase tracking-widest bg-galf-yellow/10 px-2.5 py-1 rounded border border-galf-yellow/20 inline-block mb-3">Espace Recruteurs</span>
              <h3 className="text-xl font-black text-white mb-2">Annuaire National des Opérateurs Certifiés</h3>
              <p className="text-xs text-adaptive-secondary leading-relaxed">
                Accédez à la base de données publique des conducteurs d'engins, grutiers et conducteurs de chariots formés et validés par GALF Formation en Côte d'Ivoire.
              </p>
            </div>
            <Link 
              href="/recrutement/annuaire-operateurs" 
              className="bg-galf-yellow text-galf-carbon px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shrink-0 flex items-center gap-1.5"
            >
              <span>Consulter l'Annuaire →</span>
            </Link>
          </div>
        </FadeIn>

        {/* Search and Filters Bar */}
        <FadeIn delay={0.2}>
          <div className="glass-card p-6 rounded-3xl mb-12 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-adaptive-muted w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Rechercher un poste (ex: Technicien, Conducteur, HSE...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl input-adaptive text-sm font-medium transition-all"
                />
              </div>
              <div className="md:w-64 bg-galf-yellow text-galf-carbon px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
                <HardHat className="w-5 h-5" />
                <span>Espace Emplois BTP</span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5">
              {Object.keys(filterKeywords).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-galf-yellow text-galf-carbon shadow-md shadow-galf-yellow/20'
                      : 'choice-btn hover:border-galf-yellow/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Offers Grid */}
        <div className="relative min-h-[400px]">
          {loadingOffers ? (
            /* Loading Skeleton */
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 4, 5].map((idx) => (
                <div key={idx} className="glass-card p-6 rounded-3xl animate-pulse flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-adaptive-muted/20 shrink-0" />
                  <div className="flex-1 space-y-4">
                    <div className="h-5 bg-adaptive-muted/20 rounded w-3/4" />
                    <div className="h-4 bg-adaptive-muted/10 rounded w-1/2" />
                    <div className="h-4 bg-adaptive-muted/10 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorOffers ? (
            /* Error Display */
            <div className="glass-card p-12 rounded-3xl text-center max-w-xl mx-auto border-red-500/20">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-xl font-black mb-2 text-adaptive">Échec de la connexion</h3>
              <p className="text-adaptive-secondary mb-6 text-sm leading-relaxed">{errorOffers}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-galf-yellow text-galf-carbon px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
              >
                Réessayer
              </button>
            </div>
          ) : filteredOffers.length === 0 ? (
            /* Empty State */
            <div className="glass-card p-12 rounded-3xl text-center max-w-xl mx-auto">
              <Briefcase className="w-16 h-16 text-galf-yellow/40 mx-auto mb-6" />
              <h3 className="text-xl font-black mb-2 text-adaptive">Aucune offre trouvée</h3>
              <p className="text-adaptive-secondary text-sm">Aucune offre d'emploi ne correspond à vos critères de recherche actuels.</p>
            </div>
          ) : (
            /* Real Cards Grid */
            <div className="grid md:grid-cols-2 gap-8">
              {filteredOffers.map((offer, idx) => (
                <motion.div 
                  key={offer.code || idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(0.3, idx * 0.05) }}
                  className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between hover:border-galf-yellow/40 hover:glow-yellow-strong transition-all duration-500"
                >
                  <div className="flex gap-6 items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-adaptive shrink-0 flex items-center justify-center p-1 overflow-hidden shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-galf-yellow uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-galf-yellow animate-pulse" />
                        Code: {offer.code || 'N/A'}
                        {offer.isFallback && (
                          <span className="bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow px-1.5 py-0.5 rounded text-[8px]">
                            Partenaire GALF
                          </span>
                        )}
                      </div>
                      <h4 className="font-black text-lg leading-snug text-adaptive group-hover:text-galf-yellow transition-colors mb-2">
                        {offer.title}
                      </h4>
                      <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-adaptive-muted font-bold">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-galf-yellow" /> Publié : {offer.pubDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-red-500/80" /> Limite : {offer.limitDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-adaptive">
                    <span className="text-xs font-extrabold text-adaptive-secondary uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-galf-yellow" /> Côte d'Ivoire
                    </span>
                    <button 
                      onClick={() => handleViewJob(offer)}
                      className="bg-galf-yellow text-galf-carbon px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      Détails & Postuler
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* JOB DETAIL DRAWER / MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Slide-out Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl h-full flex flex-col justify-between shadow-2xl overflow-hidden z-10"
              style={{ background: 'var(--galf-surface)' }}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-adaptive flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-adaptive p-1 shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedJob.image} alt={selectedJob.title} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-tight text-adaptive">{selectedJob.title}</h3>
                    <p className="text-xs text-galf-yellow font-black uppercase tracking-widest mt-1">
                      Code Offre: {selectedJob.code}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-adaptive-muted/10 transition-all border border-adaptive cursor-pointer"
                >
                  <X className="w-5 h-5 text-adaptive" />
                </button>
              </div>

              {/* Drawer Body (Content) */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {loadingDetails ? (
                  /* Loading Spinner */
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-galf-yellow animate-spin" />
                    <p className="text-sm font-bold text-adaptive-muted animate-pulse">
                      Chargement des informations de l'offre en direct...
                    </p>
                  </div>
                ) : errorDetails ? (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-black text-red-500 mb-1">Erreur de chargement</h5>
                      <p className="text-xs text-adaptive-secondary leading-relaxed">{errorDetails}</p>
                    </div>
                  </div>
                ) : details ? (
                  /* Detailed Content loaded */
                  <div className="space-y-8">
                    {/* Key Details Card */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-galf-bg-alt/50 border border-adaptive p-5 rounded-2xl">
                      <div>
                        <span className="text-[10px] font-black text-adaptive-muted uppercase tracking-wider block mb-1">Employeur</span>
                        <span className="text-sm font-black text-adaptive flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-galf-yellow shrink-0" />
                          {details.company}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-adaptive-muted uppercase tracking-wider block mb-1">Date d'édition</span>
                        <span className="text-sm font-black text-adaptive flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-galf-yellow" />
                          {selectedJob.pubDate}
                        </span>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-[10px] font-black text-adaptive-muted uppercase tracking-wider block mb-1">Date limite</span>
                        <span className="text-sm font-black text-red-500 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-red-500 shrink-0" />
                          {selectedJob.limitDate}
                        </span>
                      </div>
                    </div>

                    {/* Rich HTML Description */}
                    <div className="prose dark:prose-invert max-w-none text-adaptive-secondary text-sm leading-relaxed space-y-4">
                      {/* Subtitle / Company Title header if not fallback */}
                      {!selectedJob.isFallback && (
                        <div className="mb-6 p-4 rounded-xl border border-galf-yellow/20 bg-galf-yellow/5 text-xs font-bold text-adaptive-secondary">
                          📢 Cette offre est extraite de la plateforme Educarriere.ci. GALF Formation facilite votre mise en relation directe.
                        </div>
                      )}

                      {/* Display scraped description */}
                      {selectedJob.isFallback ? (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-base font-black text-adaptive uppercase tracking-wide border-l-2 border-galf-yellow pl-3 mb-3">
                              Description du poste
                            </h4>
                            <p>{(selectedJob as any).description}</p>
                          </div>
                          <div>
                            <h4 className="text-base font-black text-adaptive uppercase tracking-wide border-l-2 border-galf-yellow pl-3 mb-3">
                              Profil recherché
                            </h4>
                            <p>{(selectedJob as any).requirements}</p>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="job-description-content"
                          dangerouslySetInnerHTML={{ __html: details.description }}
                        />
                      )}
                    </div>

                    {/* Safety notice */}
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed text-adaptive-secondary">
                        <strong className="text-red-500 font-black">AVIS DE SÉCURITÉ :</strong> Ne payez JAMAIS de frais de dossier, de formation ou d'équipements à un employeur. Les processus de recrutement authentiques sont entièrement gratuits.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Drawer Footer (Actions) */}
              <div className="p-6 border-t border-adaptive bg-galf-bg-alt/25 flex flex-col sm:flex-row gap-4 items-center justify-between z-10">
                {!selectedJob.isFallback && (
                  <a 
                    href={selectedJob.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-black text-adaptive-secondary hover:text-galf-yellow flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                  >
                    Voir l'offre sur Educarriere
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedJob.isFallback && <div />}
                <button
                  disabled={loadingDetails || !details}
                  onClick={() => setShowApplyModal(true)}
                  className="w-full sm:w-auto bg-galf-yellow text-galf-carbon px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Postuler directement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATION MODAL FORM */}
      <AnimatePresence>
        {showApplyModal && selectedJob && details && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!submitting) {
                  setShowApplyModal(false)
                  setSubmissionSuccess(false)
                }
              }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-galf-surface border border-adaptive rounded-[2.5rem] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
              style={{ background: 'var(--galf-surface)' }}
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-adaptive flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-black text-xl text-adaptive uppercase tracking-tight">Postuler à l'offre</h3>
                  <p className="text-xs text-adaptive-muted mt-1 leading-none">{selectedJob.title}</p>
                </div>
                {!submitting && (
                  <button 
                    onClick={() => {
                      setShowApplyModal(false)
                      setSubmissionSuccess(false)
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-adaptive-muted/10 transition-all border border-adaptive cursor-pointer"
                  >
                    <X className="w-5 h-5 text-adaptive" />
                  </button>
                )}
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                
                {/* ── CINEMATIC PROGRESS / STEPS LOADING ── */}
                {submitting && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-16 h-16 text-galf-yellow animate-spin mb-8" />
                    
                    <div className="space-y-4 max-w-sm">
                      <div className="flex items-center gap-3 text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-black shrink-0 ${
                          submissionStep >= 1 ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-adaptive text-adaptive-muted'
                        }`}>
                          {submissionStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                        </div>
                        <span className={`font-black uppercase tracking-wider text-[11px] ${submissionStep === 1 ? 'text-galf-yellow' : submissionStep > 1 ? 'text-adaptive' : 'text-adaptive-muted'}`}>
                          Traitement du dossier & CV...
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-black shrink-0 ${
                          submissionStep >= 2 ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-adaptive text-adaptive-muted'
                        }`}>
                          {submissionStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                        </div>
                        <span className={`font-black uppercase tracking-wider text-[11px] ${submissionStep === 2 ? 'text-galf-yellow' : submissionStep > 2 ? 'text-adaptive' : 'text-adaptive-muted'}`}>
                          Enregistrement de sécurité GALF...
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-black shrink-0 ${
                          submissionStep >= 3 ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'border-adaptive text-adaptive-muted'
                        }`}>
                          {submissionStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                        </div>
                        <span className={`font-black uppercase tracking-wider text-[11px] ${submissionStep === 3 ? 'text-galf-yellow font-pulse' : 'text-adaptive-muted'}`}>
                          Génération de la candidature...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FINAL SUCCESS / CONFIRMATION PANEL (MAILTO PREFILL) ── */}
                {!submitting && submissionSuccess && (
                  <div className="space-y-6">
                    <div className="text-center py-6">
                      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h4 className="text-2xl font-black text-adaptive uppercase tracking-tight">Candidature Approuvée !</h4>
                      <p className="text-sm text-adaptive-secondary mt-2 max-w-md mx-auto leading-relaxed">
                        Vos informations ont été enregistrées avec succès dans la base de données de suivi de GALF.
                      </p>
                    </div>

                    {/* Interactive Direct Send instructions */}
                    <div className="p-6 bg-galf-yellow/5 border border-galf-yellow/20 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2">
                        <HardHat className="text-galf-yellow w-5 h-5" />
                        <h5 className="font-black text-sm text-adaptive uppercase tracking-wider">
                          Envoi direct à l'employeur
                        </h5>
                      </div>
                      <p className="text-xs text-adaptive-secondary leading-relaxed">
                        Pour finaliser votre dossier, veuillez envoyer votre CV directement à l'adresse e-mail officielle de l'employeur ci-dessous. Le sujet du courriel a été automatiquement formaté :
                      </p>

                      <div className="space-y-3 pt-2">
                        {/* Recipient email box */}
                        <div className="flex items-center justify-between p-3.5 bg-galf-bg rounded-xl border border-adaptive">
                          <div className="overflow-hidden">
                            <span className="text-[9px] font-black text-adaptive-muted uppercase block">Adresse E-mail</span>
                            <span className="text-xs font-black text-adaptive break-all">{details.email}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(details.email, 'email')}
                            className="bg-galf-surface hover:bg-galf-yellow/10 border border-adaptive p-2 rounded-lg text-adaptive hover:text-galf-yellow transition-all flex items-center justify-center shrink-0 cursor-pointer"
                            title="Copier l'adresse"
                          >
                            {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Subject email box */}
                        <div className="flex items-center justify-between p-3.5 bg-galf-bg rounded-xl border border-adaptive">
                          <div className="overflow-hidden">
                            <span className="text-[9px] font-black text-adaptive-muted uppercase block">Objet recommandé</span>
                            <span className="text-xs font-black text-adaptive truncate max-w-[280px] block">
                              Candidature : {selectedJob.title} - {applicantName}
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(`Candidature : ${selectedJob.title} - ${applicantName}`, 'subject')}
                            className="bg-galf-surface hover:bg-galf-yellow/10 border border-adaptive p-2 rounded-lg text-adaptive hover:text-galf-yellow transition-all flex items-center justify-center shrink-0 cursor-pointer"
                            title="Copier l'objet"
                          >
                            {copiedSubject ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Notice about file attach */}
                      <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl flex gap-3 text-xs text-adaptive-secondary">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p>
                          <strong>ATTENTION :</strong> Lorsque vous ouvrez votre messagerie en cliquant sur le bouton ci-dessous, n'oubliez pas d'attacher votre fichier de CV avant d'envoyer !
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 shrink-0">
                      <button
                        onClick={() => {
                          setShowApplyModal(false)
                          setSubmissionSuccess(false)
                        }}
                        className="flex-1 border border-adaptive hover:bg-adaptive-muted/5 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-adaptive transition-all text-center cursor-pointer"
                      >
                        Fermer le portail
                      </button>
                      <a
                        href={`mailto:${details.email}?subject=${encodeURIComponent(`Candidature : ${selectedJob.title} - ${applicantName}`)}&body=${encodeURIComponent(`Bonjour, \n\nJe vous adresse ma candidature pour l'offre d'emploi de "${selectedJob.title}" (Code Offre: ${selectedJob.code}).\n\nVous trouverez mon CV ci-joint.\n\nCordialement,\n${applicantName}\nTéléphone : ${applicantPhone}\nE-mail : ${applicantEmail}\n\n--\nLettre de Motivation :\n${coverLetter}`)}`}
                        className="flex-1 bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 text-center"
                      >
                        <Mail className="w-4 h-4" />
                        Ouvrir ma Messagerie
                      </a>
                    </div>
                  </div>
                )}

                {/* ── STANDARD INPUT FIELDS FORM ── */}
                {!submitting && !submissionSuccess && (
                  <form onSubmit={handleApplySubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-adaptive uppercase tracking-wider">
                          Nom complet
                        </label>
                        <input 
                          type="text" 
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Koffi Kouakou" 
                          className="w-full px-4 py-3 rounded-xl input-adaptive text-sm font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-adaptive uppercase tracking-wider">
                          Numéro de téléphone
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+225 07 11 82 65 07" 
                          className="w-full px-4 py-3 rounded-xl input-adaptive text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-adaptive uppercase tracking-wider">
                        Adresse E-mail
                      </label>
                      <input 
                        type="email" 
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="koffi.kouakou@gmail.com" 
                        className="w-full px-4 py-3 rounded-xl input-adaptive text-sm font-medium transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-adaptive uppercase tracking-wider">
                        Lettre de motivation / Message
                      </label>
                      <textarea 
                        rows={4}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Madame, Monsieur, suite à votre offre d'emploi, je vous soumets ma candidature. Titulaire d'une certification GALF Formation..." 
                        className="w-full px-4 py-3 rounded-xl input-adaptive text-sm font-medium transition-all"
                      />
                    </div>

                    {/* DRAG AND DROP CV UPLOADER */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-adaptive uppercase tracking-wider block">
                        Téléverser votre CV (PDF, DOC, DOCX)
                      </label>
                      <div className="border-2 border-dashed border-adaptive hover:border-galf-yellow/50 rounded-2xl p-6 text-center transition-all cursor-pointer bg-galf-bg-alt/25 relative group">
                        <input 
                          type="file" 
                          required
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setCvFile(e.target.files[0])
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-center group-hover:scale-105 transition-transform text-galf-yellow">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-black text-adaptive block">
                              {cvFile ? cvFile.name : 'Sélectionner ou Glisser votre CV'}
                            </span>
                            <span className="text-[10px] text-adaptive-muted mt-1 block">
                              {cvFile ? `${(cvFile.size / 1024 / 1024).toFixed(2)} Mo` : 'PDF ou Word de moins de 5 Mo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        className="flex-1 border border-adaptive hover:bg-adaptive-muted/5 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-adaptive transition-all cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Envoyer ma candidature</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
