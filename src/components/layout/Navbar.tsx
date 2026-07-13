"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  HardHat, Menu, X, ChevronRight, ChevronDown, Sun, Moon,
  GraduationCap, Wrench, Flame, Activity, Calendar, Coins,
  Briefcase, Calculator, Cpu, ShieldAlert, Users, Newspaper,
  Award, FileText, CheckCircle2, BookOpen, FileCheck, Play,
  Info, HelpCircle, PhoneCall, ArrowRight
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface SubLink {
  href: string
  label: string
  desc: string
  badge?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}

interface DropdownBanner {
  title: string
  desc: string
  btnText: string
  href: string
}

interface NavLink {
  href: string
  label: string
  subLinks?: SubLink[]
  banner?: DropdownBanner
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [showMarquee, setShowMarquee] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Fake latency metric for industrial HUD look
  const [telemetryLatency, setTelemetryLatency] = useState(42)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const closedTime = localStorage.getItem('galf_marquee_closed_time')
    if (closedTime) {
      const elapsed = Date.now() - parseInt(closedTime, 10)
      if (elapsed < 24 * 60 * 60 * 1000) {
        setShowMarquee(false)
        document.documentElement.style.setProperty('--marquee-offset', '0px')
        return
      }
    }
    setShowMarquee(true)
    document.documentElement.style.setProperty('--marquee-offset', '36px')
  }, [])

  // Modulate fake latency just for HUD animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryLatency(prev => {
        const offset = Math.floor(Math.random() * 6) - 3
        const next = prev + offset
        return next > 60 ? 40 : next < 20 ? 30 : next
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleCloseMarquee = () => {
    localStorage.setItem('galf_marquee_closed_time', Date.now().toString())
    setShowMarquee(false)
    document.documentElement.style.setProperty('--marquee-offset', '0px')
  }

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 250) // Grace period to prevent flicker
  }

  const toggleMobileSection = (label: string) => {
    setOpenMobileSection(prev => prev === label ? null : label)
  }

  const links: NavLink[] = [
    { 
      href: '/formations', 
      label: 'Formations',
      banner: {
        title: "Financement FDFP & Parrainage",
        desc: "Découvrez comment financer votre formation ou parrainer un ami pour obtenir un remboursement.",
        btnText: "Simuler mon financement",
        href: "/financement"
      },
      subLinks: [
        { href: '/formations', label: 'Catalogue Complet', desc: 'Découvrez toutes nos machines lourdes et CACES.', badge: 'VOIR TOUT', icon: GraduationCap, iconColor: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' },
        { href: '/formations/pelle-hydraulique', label: 'Pelle Hydraulique', desc: 'Terrassement, excavation de masse et chargement.', badge: 'POPULAIRE', icon: HardHat, iconColor: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20' },
        { href: '/formations/grue-tour', label: 'Grue à Tour / Mobile', desc: 'Manœuvre de charges lourdes et levage en hauteur.', badge: 'RECRUTE', icon: Wrench, iconColor: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20' },
        { href: '/formations/forage-minier', label: 'Foreuse de Mine', desc: 'Conduite de foreuses sur chantiers extractifs.', badge: 'MINES', icon: Flame, iconColor: 'bg-red-500/10 text-red-500 dark:bg-red-500/20' },
        { href: '/formations/chariot-elevateur', label: 'Chariot Élévateur (Cariste)', desc: 'Manutention, stockage et logistique d\'entrepôt.', badge: 'CACES', icon: FileCheck, iconColor: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' },
        { href: '/formations/test-aptitude', label: 'Test d\'Aptitude Engins', desc: 'Déterminez vos prédispositions professionnelles.', badge: 'QUIZ', icon: Activity, iconColor: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20' },
        { href: '/formations/planificateur', label: 'Planificateur de Parcours', desc: 'Organisez vos sessions et gérez vos dates d\'examen.', badge: 'OUTIL', icon: Calendar, iconColor: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20' },
        { href: '/verification-certificat', label: 'Certification Blockchain', desc: 'Authentification inviolable des diplômés GALF.', badge: 'SÉCURISÉ', icon: Coins, iconColor: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20' }
      ]
    },
    { 
      href: '/entreprise', 
      label: 'Entreprises',
      banner: {
        title: "Solutions B2B sur-mesure",
        desc: "Formez vos collaborateurs sur site ou dans nos centres avec un plan d'apprentissage optimisé.",
        btnText: "Découvrir l'offre B2B",
        href: "/entreprise"
      },
      subLinks: [
        { href: '/entreprise', label: 'Portail Corporate', desc: 'Présentation des offres pour PME et grands groupes.', badge: 'B2B', icon: Briefcase, iconColor: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/20' },
        { href: '/entreprise/calculateur-roi', label: 'Simulateur ROI & Carburant', desc: 'Calculez le gain de consommation de vos conducteurs.', badge: 'RENTABILITÉ', icon: Calculator, iconColor: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' },
        { href: '/entreprise/telemetrie', label: 'Télémétrie Engins (IoT)', desc: 'Suivi de conduite en temps réel et alertes sécurité.', badge: 'INNOVATION', icon: Cpu, iconColor: 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20' },
        { href: '/entreprise/audit-securite', label: 'Audit Sécurité Chantier', desc: 'Évaluez la conformité HSE et limitez les accidents.', badge: 'HSE', icon: ShieldAlert, iconColor: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20' },
        { href: '/entreprise/recrutement', label: 'Recrutement Opérateurs', desc: 'Déléguez le sourcing de vos conducteurs certifiés.', badge: 'SOURCING', icon: Users, iconColor: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20' }
      ]
    },
    { 
      href: '/recrutement', 
      label: 'Recrutement',
      banner: {
        title: "Annuaire des Opérateurs",
        desc: "Tous nos apprenants certifiés sont répertoriés dans un annuaire public sécurisé sur la Blockchain.",
        btnText: "Consulter l'annuaire",
        href: "/recrutement/annuaire-operateurs"
      },
      subLinks: [
        { href: '/recrutement', label: 'Offres d\'Emploi', desc: 'Consultez les postes actifs de nos partenaires chantiers.', badge: 'POSTES', icon: Newspaper, iconColor: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20' },
        { href: '/recrutement/annuaire-operateurs', label: 'Annuaire Opérateurs', desc: 'Accédez à nos diplômés certifiés sur la Blockchain.', badge: 'BLOCKCHAIN', icon: Award, iconColor: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20' },
        { href: '/apprenant/cv-generator', label: 'Générateur de CV Pro', desc: 'Créez votre CV d\'opérateur spécialisé en 2 minutes.', badge: 'OUTIL', icon: FileText, iconColor: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' },
        { href: '/apprenant/carrieres', label: 'Suivi de Carrière', desc: 'Coaching de placement, mentorat et débouchés.', badge: 'COACHING', icon: CheckCircle2, iconColor: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' }
      ]
    },
    { 
      href: '/mediatheque', 
      label: 'Médiathèque',
      banner: {
        title: "Simulations Immersives 3D",
        desc: "Pilotez virtuellement une Pelle, Grue ou Bulldozer directement depuis votre navigateur.",
        btnText: "Lancer le simulateur 3D",
        href: "/mediatheque/simulateur"
      },
      subLinks: [
        { href: '/mediatheque', label: 'Guides & Ressources HSE', desc: 'Bibliothèque de documents HSE et fiches techniques.', badge: 'DOCS', icon: BookOpen, iconColor: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20' },
        { href: '/mediatheque/checklist-securite', label: 'Inspection Prise de Poste', desc: 'Créez et exportez vos fiches d\'inspection machine.', badge: 'HSE', icon: FileCheck, iconColor: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20' },
        { href: '/mediatheque/abaque-grue', label: 'Abaque de Grue', desc: 'Simulateur graphique de charge et portée de levage.', badge: 'LEVAGE', icon: Calculator, iconColor: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20' },
        { href: '/mediatheque/chasse-aux-risques', label: 'Chasse aux Risques HSE', desc: 'Jeu interactif d\'identification de dangers sur chantier.', badge: 'JEU HSE', icon: ShieldAlert, iconColor: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20' },
        { href: '/mediatheque/inspection-visuelle', label: 'Inspection Visuelle 3D', desc: 'Inspectez un engin en 3D interactif avant démarrage.', badge: 'VGP', icon: Activity, iconColor: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20' },
        { href: '/mediatheque/commandes-vocales', label: 'Commandes Vocales', desc: 'Technologie d\'assistance vocale pour le grutage.', badge: 'ASSISTANT', icon: Cpu, iconColor: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20' },
        { href: '/mediatheque/quiz-securite', label: 'Quiz Sécurité CACES', desc: 'Entraînez-vous pour les examens théoriques CACES.', badge: 'TEST', icon: FileCheck, iconColor: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20' },
        { href: '/mediatheque/simulateur', label: 'Simulateur WebGL 3D', desc: 'Entraînement virtuel immersif sur machines de chantier.', badge: '3D WEB', icon: Play, iconColor: 'bg-red-500/10 text-red-500 dark:bg-red-500/20' }
      ]
    },
    { 
      href: '/programme-ambassadeur', 
      label: 'Partenariats',
      banner: {
        title: "Devenez Ambassadeur GALF",
        desc: "Faites la promotion de nos certifications et touchez des commissions attractives sur chaque inscription.",
        btnText: "Rejoindre le programme",
        href: "/programme-ambassadeur"
      },
      subLinks: [
        { href: '/programme-ambassadeur', label: 'Espace Parrainage', desc: 'Gagnez des primes en recommandant nos formations.', badge: 'GROWTH', icon: Coins, iconColor: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' },
        { href: '/instructeur/train-the-trainer', label: 'Formation de Formateurs', desc: 'Devenez formateur d\'engins agréé (Train-the-Trainer).', badge: 'PRO', icon: Users, iconColor: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20' },
        { href: '/programme-ambassadeur/reglement', label: 'Règlement & Conditions', desc: 'Fonctionnement et barème des gains du parrainage.', badge: 'LÉGAL', icon: FileText, iconColor: 'bg-zinc-500/10 text-zinc-500 dark:bg-zinc-500/20' }
      ]
    },
    { 
      href: '/a-propos', 
      label: 'À Propos',
      banner: {
        title: "Leader de la formation BTP",
        desc: "Découvrez notre histoire, nos valeurs et nos accréditations ministérielles de Côte d'Ivoire.",
        btnText: "Lire notre manifeste",
        href: "/a-propos"
      },
      subLinks: [
        { href: '/a-propos', label: 'Qui sommes-nous ?', desc: 'Notre histoire, nos formateurs et centres d\'Abidjan.', badge: 'GALF', icon: Info, iconColor: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20' },
        { href: '/blog', label: 'Actualités & Blog', desc: 'Suivez les tendances du BTP, des mines et de la sécurité.', badge: 'ACTUS', icon: Newspaper, iconColor: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20' },
        { href: '/faq', label: 'Foire Aux Questions', desc: 'Toutes les réponses à vos questions administratives.', badge: 'AIDE', icon: HelpCircle, iconColor: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20' },
        { href: '/rse-impact', label: 'RSE & Impact', desc: 'Nos engagements pour l\'environnement et l\'emploi local.', badge: 'ENGAGÉ', icon: Activity, iconColor: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' },
        { href: '/accreditations', label: 'Accréditations & Qualité', desc: 'Nos agréments officiels et conformité CACES.', badge: 'AGRÉÉ', icon: Award, iconColor: 'bg-red-500/10 text-red-500 dark:bg-red-500/20' },
        { href: '/contact', label: 'Nous Contacter', desc: 'Localisation de nos centres et formulaires de contact.', badge: 'CONTACT', icon: PhoneCall, iconColor: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20' }
      ]
    }
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full px-0 transition-all duration-300">
        
        {/* Top Info Ribbon */}
        {showMarquee && (
          <div className="bg-galf-yellow text-galf-carbon text-[10px] uppercase tracking-wider font-black h-9 flex items-center relative overflow-hidden border-b border-galf-yellow/20 select-none z-[60]">
            <div className="flex-1 overflow-hidden relative h-full flex items-center pr-12">
              <div className="animate-marquee whitespace-nowrap flex gap-16 absolute pl-4">
                <span className="flex items-center gap-2">🎁 Nouveau : Gagnez votre formation 100% offerte en parrainant vos proches ! Rendez-vous sur votre espace Ambassadeur.</span>
                <span className="flex items-center gap-2">⚡ Offre Exceptionnelle : -15% sur toutes les formations Grue et Pelle jusqu&apos;à la fin du mois !</span>
                <span className="flex items-center gap-2">🏗️ Nouveau : Ouverture de notre centre de pratique à San Pedro ! Réservez vite.</span>
                
                {/* Duplicated for infinite effect */}
                <span className="flex items-center gap-2">⚡ Offre Exceptionnelle : -15% sur toutes les formations Grue et Pelle jusqu&apos;à la fin du mois !</span>
                <span className="flex items-center gap-2">🏗️ Nouveau : Ouverture de notre centre de pratique à San Pedro ! Réservez vite.</span>
                <span className="flex items-center gap-2">🎓 Conformité : Certifications BTP de pointe en Côte d&apos;Ivoire.</span>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 flex items-center pl-6 pr-4 bg-gradient-to-l from-galf-yellow via-galf-yellow to-transparent z-20">
              <button 
                onClick={handleCloseMarquee} 
                className="hover:scale-110 transition-transform p-1 rounded-full hover:bg-black/10 flex items-center justify-center cursor-pointer"
                aria-label="Fermer l'annonce"
              >
                <X className="w-4 h-4 text-galf-carbon" />
              </button>
            </div>
          </div>
        )}

        {/* Outer container adjusting margins when scrolled (forming the capsule) */}
        <div className={`w-full flex justify-center transition-all duration-500 ${
          scrolled ? 'px-4 md:px-8 pt-4' : 'px-0 pt-0'
        }`}>
          
          <nav 
            className={`w-full transition-all duration-500 overflow-visible ${
              scrolled
                ? 'navbar-capsule animate-glow-border'
                : 'border-b border-zinc-200/50 dark:border-white/5 bg-white/90 dark:bg-zinc-950/75 backdrop-blur-md'
            }`}
          >
            <div className="container mx-auto px-6 h-18 md:h-20 flex items-center justify-between max-w-7xl">
              
              {/* Logo block */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-galf-yellow/40 stitch-orbit pointer-events-none" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-galf-yellow to-orange-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-galf-yellow/20">
                    <HardHat className="text-galf-carbon w-5.5 h-5.5 fill-current" />
                  </div>
                </div>
                <div className="font-black text-xl tracking-tighter text-zinc-900 dark:text-white">
                  GALF<span className="text-galf-yellow font-extrabold animate-pulse">.</span>
                </div>
              </Link>

              {/* Desktop links */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-4">
                {links.map(link => {
                  const isOpenDropdown = activeDropdown === link.label
                  const isLargeDropdown = link.subLinks && link.subLinks.length >= 6
                  
                  if (link.subLinks) {
                    return (
                      <div 
                        key={link.href} 
                        className="relative py-6"
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-all cursor-pointer group">
                          <Link 
                            href={link.href}
                            className="text-[12px] xl:text-[13px] font-black uppercase tracking-wider text-zinc-700 hover:text-galf-yellow dark:text-zinc-200 dark:hover:text-galf-yellow transition-colors relative after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-galf-yellow after:transition-all after:duration-300 group-hover:after:w-full"
                          >
                            {link.label}
                          </Link>
                          <ChevronDown className={`w-3.5 h-3.5 opacity-55 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${
                            isOpenDropdown ? 'rotate-180 text-galf-yellow' : ''
                          }`} />
                        </div>
                        
                        {/* ULTRA-PREMIUM MEGA DROPDOWN PANEL */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 rounded-3xl border border-zinc-200/80 dark:border-galf-yellow/20 bg-white dark:bg-zinc-950/98 p-6 shadow-2xl transition-all duration-300 z-50 backdrop-blur-2xl bg-[radial-gradient(ellipse_at_top,rgba(255,176,0,0.04),transparent)] stitch-hud-corner ${
                          isOpenDropdown 
                            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                            : 'opacity-0 translate-y-2 pointer-events-none scale-[0.98]'
                        } ${
                          isLargeDropdown ? 'w-[780px]' : 'w-[520px]'
                        }`}>
                          <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.08] dark:opacity-15 rounded-3xl pointer-events-none" />
                          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-galf-yellow/45 to-transparent" />
                          
                          <div className="relative z-10 flex gap-6">
                            {/* Left Side: Sublinks grid */}
                            <div className="flex-1 space-y-4">
                              <div className="text-[10px] font-mono text-zinc-400 dark:text-galf-yellow/60 font-black uppercase tracking-[0.25em] border-b border-zinc-100 dark:border-white/5 pb-2 mb-2 flex justify-between items-center">
                                <span>{link.label} · ACCÈS DIRECT</span>
                                <span className="text-[8px] text-zinc-400 dark:text-galf-yellow/60 font-mono">SYS-SCAN // OK</span>
                              </div>
                              
                              <div className={`grid gap-3 ${isLargeDropdown ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {link.subLinks.map(sub => {
                                  const IconComponent = sub.icon
                                  return (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50/0 hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200/50 dark:hover:border-white/5 transition-all duration-300 text-left group/item"
                                    >
                                      {/* Icon Medallion */}
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 ${sub.iconColor}`}>
                                        <IconComponent className="w-5 h-5" />
                                      </div>
                                      
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-100 group-hover/item:text-galf-yellow transition-colors">
                                            {sub.label}
                                          </span>
                                          {sub.badge && (
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow">
                                              {sub.badge}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                                          {sub.desc}
                                        </p>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                            
                            {/* Right Side: Showcase Side Panel */}
                            {link.banner && (
                              <div className="w-[200px] shrink-0 border-l border-zinc-100 dark:border-white/5 pl-6 flex flex-col justify-between py-1">
                                <div className="space-y-3">
                                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow">
                                    FOCUS
                                  </span>
                                  <h4 className="text-xs font-black text-zinc-800 dark:text-white uppercase tracking-wider">
                                    {link.banner.title}
                                  </h4>
                                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                                    {link.banner.desc}
                                  </p>
                                </div>
                                
                                <Link 
                                  href={link.banner.href}
                                  className="mt-6 flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 hover:bg-galf-yellow dark:bg-white/5 dark:hover:bg-galf-yellow hover:text-galf-carbon text-[9px] font-black uppercase tracking-widest transition-all text-zinc-800 dark:text-zinc-200"
                                >
                                  <span>{link.banner.btnText}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="px-3 py-2 text-[12px] xl:text-[13px] font-black uppercase tracking-wider text-zinc-700 hover:text-galf-yellow dark:text-zinc-200 dark:hover:text-galf-yellow transition-colors relative after:absolute after:bottom-[16px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-galf-yellow after:transition-all after:duration-300 hover:after:w-full group" 
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* Action buttons & HUD status */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
                {/* HUD Latency telemetre */}
                <div className="flex items-center gap-2 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>SYS: {telemetryLatency}ms</span>
                </div>

                {/* Language Toggle */}
                <div className="relative group/lang select-none">
                  <button 
                    type="button"
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white text-[9px] font-mono font-black tracking-widest uppercase transition-all cursor-pointer"
                  >
                    FR
                  </button>
                  <div className="absolute top-full right-0 mt-1.5 w-32 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 p-1 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/lang:opacity-100 group-hover/lang:translate-y-0 group-hover/lang:pointer-events-auto transition-all duration-200 z-50">
                    <button type="button" className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-white/5 font-mono uppercase tracking-wider">Français</button>
                    <button type="button" className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all font-mono uppercase tracking-wider">English</button>
                  </div>
                </div>

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <Link href="/connexion" className="text-[12px] xl:text-[13px] font-black uppercase tracking-wider text-zinc-700 dark:text-white hover:text-galf-yellow dark:hover:text-galf-yellow transition-colors">
                  Connexion
                </Link>
                <Link href="/inscription" className="bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,176,0,0.3)] transition-all">
                  S&apos;inscrire
                </Link>
              </div>

              {/* Mobile controls */}
              <div className="flex items-center gap-3 lg:hidden shrink-0">
                <button 
                  type="button"
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white/70 text-[9px] font-mono font-black"
                >
                  FR
                </button>
                <button 
                  onClick={toggleTheme} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white/70"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-800 dark:text-white border border-zinc-200 dark:border-white/10"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </nav>
        </div>
      </div>

      {/* MOBILE PREMIUM DRAWER */}
      <div 
        className={`fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[340px] bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-500 lg:hidden flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-galf-yellow to-orange-500 flex items-center justify-center shadow-md">
              <HardHat className="text-galf-carbon w-4 h-4 fill-current" />
            </div>
            <span className="font-black text-lg text-zinc-900 dark:text-white">
              GALF<span className="text-galf-yellow">.</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg border border-zinc-100 dark:border-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Drawer Links Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {links.map((link) => {
            if (link.subLinks) {
              const isSectionOpen = openMobileSection === link.label
              return (
                <div key={link.href} className="border-b border-zinc-100 dark:border-white/5 pb-2">
                  <button
                    onClick={() => toggleMobileSection(link.label)}
                    className="w-full flex items-center justify-between text-left py-2 font-black text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider focus:outline-none"
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${
                      isSectionOpen ? 'rotate-180 text-galf-yellow' : ''
                    }`} />
                  </button>
                  
                  {/* Collapsible Area */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isSectionOpen ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="flex flex-col gap-2 pl-3 border-l border-zinc-100 dark:border-white/5">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-black uppercase text-galf-yellow hover:underline flex items-center gap-1 py-1"
                      >
                        Accéder à l&apos;espace {link.label} <ChevronRight className="w-3 h-3" />
                      </Link>
                      
                      {link.subLinks.map(sub => {
                        const SubIcon = sub.icon
                        return (
                          <Link 
                            key={sub.href} 
                            href={sub.href} 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between py-1.5 text-xs font-bold text-zinc-600 hover:text-galf-yellow dark:text-zinc-300 dark:hover:text-galf-yellow transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${sub.iconColor} scale-90`}>
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <span>{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest uppercase bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow scale-90">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="block text-xs font-black uppercase text-zinc-800 dark:text-white hover:text-galf-yellow dark:hover:text-galf-yellow transition-colors border-b border-zinc-100 dark:border-white/5 py-3.5"
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-zinc-100 dark:border-white/5 space-y-3 bg-zinc-50 dark:bg-zinc-950/40">
          <Link 
            href="/connexion" 
            onClick={() => setIsOpen(false)} 
            className="block w-full py-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-center font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
          >
            Connexion
          </Link>
          <Link 
            href="/inscription" 
            onClick={() => setIsOpen(false)} 
            className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon text-center font-black text-xs uppercase tracking-widest shadow-md hover:brightness-110 transition-all"
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      </div>
    </>
  )
}
