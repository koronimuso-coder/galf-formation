"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HardHat, Menu, X, ChevronRight, ChevronDown, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface SubLink {
  href: string
  label: string
  desc: string
  badge?: string
}

interface NavLink {
  href: string
  label: string
  subLinks?: SubLink[]
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [showMarquee, setShowMarquee] = useState(false)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  
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

  const toggleMobileSection = (label: string) => {
    setOpenMobileSection(prev => prev === label ? null : label)
  }

  const links: NavLink[] = [
    { 
      href: '/formations', 
      label: 'Formations',
      subLinks: [
        { href: '/formations', label: 'Catalogue Complet', desc: 'Parcourez notre catalogue complet de machines lourdes.', badge: 'TOUT VOIR' },
        { href: '/formations/pelle-hydraulique', label: 'Pelle Hydraulique', desc: 'Terrassement, excavation de masse et chargement.', badge: 'POPULAIRE' },
        { href: '/formations/grue-tour', label: 'Grue à Tour / Mobile', desc: 'Manœuvre de charges lourdes et levage en hauteur.', badge: 'RECRUTE' },
        { href: '/formations/forage-minier', label: 'Foreuse de Mine', desc: 'Conduite de foreuses sur chantiers extractifs.', badge: 'MINES' },
        { href: '/formations/chariot-elevateur', label: 'Chariot Élévateur (Cariste)', desc: 'Manutention, stockage et logistique d\'entrepôt.', badge: 'CACES' },
        { href: '/formations/test-aptitude', label: 'Test d\'Aptitude Engins', desc: 'Évaluez vos compétences pour la conduite d\'engins.', badge: 'QUIZ' },
        { href: '/formations/planificateur', label: 'Planificateur de Parcours', desc: 'Planifiez vos modules et dates de formation.', badge: 'INTELLIGENT' },
        { href: '/verification-certificat', label: 'Certification Blockchain', desc: 'Vérifiez l\'authenticité des certificats de nos diplômés.', badge: 'CONFIANCE' }
      ]
    },
    { 
      href: '/entreprise', 
      label: 'Entreprises',
      subLinks: [
        { href: '/entreprise', label: 'Portail Corporate & B2B', desc: 'Solutions sur-mesure pour PME et grands groupes.', badge: 'ENTREPRISE' },
        { href: '/entreprise/calculateur-roi', label: 'Simulateur ROI & Carburant', desc: 'Calculez le gain de consommation de vos conducteurs.', badge: 'ROI' },
        { href: '/entreprise/telemetrie', label: 'Télémétrie Engins (IoT)', desc: 'Suivi en temps réel et maintenance prédictive.', badge: 'NOUVEAU' },
        { href: '/entreprise/audit-securite', label: 'Audit Sécurité Chantier', desc: 'Évaluation des risques et conformité réglementaire.', badge: 'AUDIT' },
        { href: '/entreprise/recrutement', label: 'Recrutement Opérateurs', desc: 'Déléguez le sourcing de vos conducteurs certifiés.', badge: 'SOURCING' }
      ]
    },
    { 
      href: '/recrutement', 
      label: 'Recrutement BTP',
      subLinks: [
        { href: '/recrutement', label: 'Offres Emploi BTP/Mines', desc: 'Consultez les postes actifs de nos partenaires chantiers.', badge: 'EMPLOIS' },
        { href: '/recrutement/annuaire-operateurs', label: 'Annuaire Opérateurs', desc: 'Accédez à nos diplômés certifiés sur la Blockchain.', badge: 'BLOCKCHAIN' },
        { href: '/apprenant/cv-generator', label: 'Générateur de CV Pro', desc: 'Créez votre CV professionnel d\'opérateur en ligne.', badge: 'CV' },
        { href: '/apprenant/carrieres', label: 'Suivi de Carrière', desc: 'Coaching, accompagnement et placement professionnel.', badge: 'COACHING' }
      ]
    },
    { 
      href: '/mediatheque', 
      label: 'Médiathèque',
      subLinks: [
        { href: '/mediatheque', label: 'Guides & Ressources HSE', desc: 'Bibliothèque de documents de sécurité HSE et tutoriels.', badge: 'DOCS' },
        { href: '/mediatheque/checklist-securite', label: 'Fiche Inspection HSE', desc: 'Créez vos fiches de prise de poste engin en 2 min.', badge: 'HSE' },
        { href: '/mediatheque/abaque-grue', label: 'Abaque de Grue', desc: 'Calculez les capacités de levage en toute sécurité.', badge: 'LEVAGE' },
        { href: '/mediatheque/chasse-aux-risques', label: 'Chasse aux Risques HSE', desc: 'Identifiez les dangers sur un chantier virtuel.', badge: 'JEU HSE' },
        { href: '/mediatheque/inspection-visuelle', label: 'Inspection Visuelle 3D', desc: 'Examinez un engin avant de démarrer le moteur.', badge: 'VGP' },
        { href: '/mediatheque/commandes-vocales', label: 'Commandes Vocales', desc: 'Pilotez les consignes HSE par reconnaissance vocale.', badge: 'VOIX' },
        { href: '/mediatheque/quiz-securite', label: 'Quiz Sécurité CACES', desc: 'Testez vos connaissances en sécurité de chantier.', badge: 'TEST' },
        { href: '/mediatheque/simulateur', label: 'Simulateur 3D WebGL', desc: 'Pilotez virtuellement une Pelle, Grue ou Bulldozer.', badge: 'IMMERSION' }
      ]
    },
    { 
      href: '/programme-ambassadeur', 
      label: 'Partenariats',
      subLinks: [
        { href: '/programme-ambassadeur', label: 'Programme Ambassadeur', desc: 'Recommandez GALF et gagnez des récompenses.', badge: 'GROWTH' },
        { href: '/instructeur/train-the-trainer', label: 'Devenir Formateur', desc: 'Formation de formateurs certifiés (Train-the-Trainer).', badge: 'PRO' },
        { href: '/programme-ambassadeur/reglement', label: 'Règlement Parrainage', desc: 'Conditions légales du programme ambassadeur.', badge: 'LEGAL' }
      ]
    },
    { 
      href: '/a-propos', 
      label: 'À Propos',
      subLinks: [
        { href: '/a-propos', label: 'Qui sommes-nous ?', desc: 'Notre histoire, nos valeurs et nos centres de pratique.', badge: 'GALF' },
        { href: '/blog', label: 'Actualités & Blog', desc: 'Dernières nouvelles du BTP et de la formation.', badge: 'ACTUS' },
        { href: '/faq', label: 'Questions Fréquentes (FAQ)', desc: 'Réponses à toutes vos questions administratives.', badge: 'AIDE' },
        { href: '/rse-impact', label: 'RSE & Impact', desc: 'Nos initiatives sociales et environnementales.', badge: 'DURABLE' },
        { href: '/accreditations', label: 'Accréditations & Normes', desc: 'Nos agréments officiels et certifications qualité.', badge: 'AGRÉÉ' },
        { href: '/contact', label: 'Contact & Agences', desc: 'Nos coordonnées, cartes et formulaires de contact.', badge: 'CONTACT' }
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
                : 'border-b border-zinc-200/50 dark:border-white/5 bg-white/80 dark:bg-zinc-950/45 backdrop-blur-md'
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
              <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                {links.map(link => {
                  if (link.subLinks) {
                    const isGridDropdown = link.subLinks.length >= 6
                    return (
                      <div key={link.href} className="relative group py-6">
                        <div className="flex items-center gap-1">
                          <Link 
                            href={link.href}
                            className="text-[12px] xl:text-[13px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-white/80 group-hover:text-galf-yellow dark:group-hover:text-galf-yellow transition-colors"
                          >
                            {link.label}
                          </Link>
                          <ChevronDown className="w-3.5 h-3.5 opacity-50 text-zinc-500 dark:text-white/50 transition-transform group-hover:rotate-180 group-hover:text-galf-yellow" />
                        </div>
                        
                        {/* PREMIUM INDUSTRIAL MEGA DROPDOWN */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 rounded-2xl border border-zinc-200/50 dark:border-galf-yellow/25 bg-white dark:bg-zinc-950/95 p-5 shadow-2xl opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 backdrop-blur-xl bg-[radial-gradient(ellipse_at_top,rgba(255,176,0,0.06),transparent)] stitch-hud-corner ${
                          isGridDropdown ? 'w-[640px]' : 'w-[380px]'
                        }`}>
                          <div className="absolute inset-0 stitch-blueprint-grid opacity-15 rounded-2xl pointer-events-none" />
                          <div className="absolute inset-0 w-full h-[1px] bg-gradient-to-r from-transparent via-galf-yellow/40 to-transparent" />
                          
                          <div className="relative z-10 space-y-3">
                            <div className="text-[9px] font-mono text-zinc-400 dark:text-galf-yellow/60 font-black uppercase tracking-[0.25em] border-b border-zinc-100 dark:border-white/5 pb-2 mb-2 flex justify-between items-center">
                              <span>{link.label} · Accès Direct</span>
                              <span className="text-[7px] text-zinc-400 dark:text-galf-yellow/60">SYS-SCAN // ON</span>
                            </div>
                            
                            <div className={isGridDropdown ? 'grid grid-cols-2 gap-2.5' : 'space-y-2'}>
                              {link.subLinks.map(sub => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="block p-3 rounded-xl bg-transparent hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200/50 dark:hover:border-white/5 transition-all text-left group/item"
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-white group-hover/item:text-galf-yellow transition-colors">
                                      {sub.label}
                                    </span>
                                    {sub.badge && (
                                      <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-zinc-500 dark:text-white/55 leading-relaxed font-semibold">
                                    {sub.desc}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="text-[12px] xl:text-[13px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-white/80 hover:text-galf-yellow dark:hover:text-galf-yellow transition-colors py-6" 
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* Action buttons & HUD status */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
                {/* HUD Latency telemetre */}
                <div className="flex items-center gap-2 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>HUD // SYS: {telemetryLatency}ms</span>
                </div>

                {/* Language Toggle */}
                <div className="relative group/lang select-none">
                  <button 
                    type="button"
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-700 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white text-[9px] font-mono font-black tracking-widest uppercase transition-all cursor-pointer"
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
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-700 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <Link href="/connexion" className="text-[12px] xl:text-[13px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-white hover:text-galf-yellow dark:hover:text-galf-yellow transition-colors">
                  Connexion
                </Link>
                <Link href="/inscription" className="bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-galf-yellow/10">
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

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden overflow-y-auto bg-white dark:bg-[#08080a] ${
          isOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
        }`}
      >
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] dark:opacity-5 pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col justify-start items-center min-h-screen py-24 px-6 gap-8">
          <div className="w-full max-w-md space-y-4">
            
            {links.map((link) => {
              if (link.subLinks) {
                const isSectionOpen = openMobileSection === link.label
                return (
                  <div key={link.href} className="border-b border-zinc-100 dark:border-white/5 py-2">
                    <button
                      onClick={() => toggleMobileSection(link.label)}
                      className="w-full flex items-center justify-between text-left py-2 font-black text-sm text-zinc-850 dark:text-white uppercase tracking-wider focus:outline-none"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${
                        isSectionOpen ? 'rotate-180 text-galf-yellow' : ''
                      }`} />
                    </button>
                    
                    {/* Collapsible Sublinks */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isSectionOpen ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="flex flex-col gap-2 pl-4 border-l border-zinc-200 dark:border-white/10">
                        {/* Direct Category Link */}
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-black uppercase text-galf-yellow hover:underline flex items-center gap-1 py-1"
                        >
                          Accéder à l&apos;espace {link.label} <ChevronRight className="w-3 h-3" />
                        </Link>
                        
                        {link.subLinks.map(sub => (
                          <Link 
                            key={sub.href} 
                            href={sub.href} 
                            onClick={() => setIsOpen(false)}
                            className="py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-galf-yellow dark:hover:text-galf-yellow flex items-center justify-between transition-colors"
                          >
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow scale-90">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
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
                  className="block text-sm font-black uppercase text-zinc-800 dark:text-white hover:text-galf-yellow dark:hover:text-galf-yellow transition-colors border-b border-zinc-100 dark:border-white/5 py-3"
                >
                  {link.label}
                </Link>
              )
            })}
            
            <div className="w-full h-[1px] bg-zinc-100 dark:bg-white/10 pt-4" />
            
            <div className="flex flex-col gap-4 pt-2">
              <Link 
                href="/connexion" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-center font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-white"
              >
                Connexion
              </Link>
              <Link 
                href="/inscription" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon text-center font-black text-xs uppercase tracking-widest shadow-md shadow-galf-yellow/10"
              >
                S&apos;inscrire maintenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
