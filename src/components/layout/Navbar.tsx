"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, HardHat, Menu, X, ChevronDown, Sun, Moon,
  GraduationCap, Wrench, Flame, Calculator, ShieldAlert, Users, Newspaper,
  Award, FileText, CheckCircle2, BookOpen, FileCheck, Play, Info, PhoneCall, Sparkles
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface SubLink {
  href: string
  label: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavLink {
  href: string
  label: string
  isHome?: boolean
  subLinks?: SubLink[]
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [showMarquee, setShowMarquee] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
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
    }, 150)
  }

  const toggleMobileSection = (label: string) => {
    setOpenMobileSection(prev => prev === label ? null : label)
  }

  const links: NavLink[] = [
    {
      href: '/',
      label: 'Accueil',
      isHome: true
    },
    { 
      href: '/formations', 
      label: 'Formations',
      subLinks: [
        { href: '/formations', label: 'Catalogue CACES & Formations', desc: 'Catalogue complet engins lourds et levage', icon: GraduationCap },
        { href: '/formations/pelle-hydraulique', label: 'Pelle Hydraulique', desc: 'Terrassement et excavation de masse', icon: HardHat },
        { href: '/formations/grue-tour', label: 'Grue à Tour & Mobile', desc: 'Manœuvre et levage en hauteur', icon: Wrench },
        { href: '/formations/forage-minier', label: 'Foreuse Minière', desc: 'Conduite pour chantiers extractifs', icon: Flame },
        { href: '/formations/chariot-elevateur', label: 'Chariot Élévateur', desc: 'Manutention et logistique d\'entrepôt', icon: FileCheck },
        { href: '/verification-certificat', label: 'Vérification Certificat', desc: 'Authentification des diplômes certifiés', icon: Award }
      ]
    },
    { 
      href: '/entreprise', 
      label: 'Entreprises',
      subLinks: [
        { href: '/entreprise', label: 'Solutions B2B Corporate', desc: 'Formations sur site ou en centres agréés', icon: Users },
        { href: '/entreprise/calculateur-roi', label: 'Simulateur ROI Carburant', desc: 'Optimisation des coûts d\'exploitation', icon: Calculator },
        { href: '/entreprise/audit-securite', label: 'Audit Sécurité Chantier', desc: 'Conformité HSE et prévention risques', icon: ShieldAlert },
        { href: '/recrutement/annuaire-operateurs', label: 'Sourcing Conducteurs', desc: 'Recrutement d\'opérateurs certifiés', icon: CheckCircle2 }
      ]
    },
    { 
      href: '/mediatheque', 
      label: 'Médiathèque 3D',
      subLinks: [
        { href: '/mediatheque/simulateur', label: 'Simulateur 3D Immersif', desc: 'Conduite virtuelle sur machines BTP', icon: Play },
        { href: '/mediatheque', label: 'Guides & Fiches HSE', desc: 'Documentation technique et sécurité', icon: BookOpen },
        { href: '/mediatheque/abaque-grue', label: 'Abaque de Grue', desc: 'Calculateur graphique portées de levage', icon: Calculator },
        { href: '/mediatheque/chasse-aux-risques', label: 'Chasse aux Risques HSE', desc: 'Exercice interactif sécurité chantier', icon: ShieldAlert }
      ]
    },
    { 
      href: '/recrutement', 
      label: 'Recrutement',
      subLinks: [
        { href: '/recrutement', label: 'Offres d\'Emploi BTP & Mines', desc: 'Postes actifs de nos entreprises partenaires', icon: Newspaper },
        { href: '/recrutement/annuaire-operateurs', label: 'Annuaire des Diplômés', desc: 'Base de données vérifiée des opérateurs', icon: Award },
        { href: '/apprenant/cv-generator', label: 'Générateur CV Opérateur', desc: 'Création rapide de CV spécialisé BTP', icon: FileText }
      ]
    },
    { 
      href: '/a-propos', 
      label: 'À Propos',
      subLinks: [
        { href: '/a-propos', label: 'Qui sommes-nous ?', desc: 'Notre histoire, nos centres et notre vision', icon: Info },
        { href: '/accreditations', label: 'Accréditations & Agréments', desc: 'Certifications officielles Ministère & CACES', icon: Award },
        { href: '/programme-ambassadeur', label: 'Programme Ambassadeur', desc: 'Recommandation et parrainage d\'apprenants', icon: Users },
        { href: '/contact', label: 'Nous Contacter', desc: 'Centres d\'Abidjan & San Pedro', icon: PhoneCall }
      ]
    }
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full transition-all duration-300">
        
        {/* Marquee Banner */}
        {showMarquee && (
          <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-[11px] font-black py-1.5 px-4 relative z-50 flex items-center justify-between border-b border-amber-600/20 shadow-md">
            <div className="overflow-hidden whitespace-nowrap flex-1 mr-8">
              <div className="inline-flex gap-8 animate-marquee font-sans tracking-wide">
                <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> <strong>Nouveau :</strong> Gagnez votre formation 100% offerte en parrainant vos proches !</span>
                <span className="flex items-center gap-2">⚡ <strong>Offre Spéciale :</strong> -15% sur toutes les sessions Grue &amp; Pelle ce mois-ci !</span>
                <span className="flex items-center gap-2">🏆 <strong>Certification :</strong> Diplômes officiels agréés METFIP &amp; normes CACES !</span>
                
                {/* Duplicated for smooth loop */}
                <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> <strong>Nouveau :</strong> Gagnez votre formation 100% offerte en parrainant vos proches !</span>
                <span className="flex items-center gap-2">⚡ <strong>Offre Spéciale :</strong> -15% sur toutes les sessions Grue &amp; Pelle ce mois-ci !</span>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-3 bg-gradient-to-l from-amber-400 via-amber-400 to-transparent z-20">
              <button 
                onClick={handleCloseMarquee} 
                className="hover:bg-slate-950/15 rounded-full p-1 transition-colors cursor-pointer"
                aria-label="Fermer la barre d'information"
              >
                <X className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* Refined Main Navbar */}
        <div className={`w-full flex justify-center transition-all duration-300 ${
          scrolled ? 'px-3 sm:px-6 pt-3' : 'px-0 pt-0'
        }`}>
          <nav 
            className={`w-full transition-all duration-300 ${
              scrolled
                ? 'max-w-7xl rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl'
                : 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/90 dark:border-white/10 shadow-sm'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
              
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  <HardHat className="text-slate-950 w-5 h-5 fill-current" />
                </div>
                <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
                  GALF<span className="text-amber-500 font-black ml-0.5">FORMATION</span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
                {links.map(link => {
                  const isOpenDropdown = activeDropdown === link.label
                  const isActive = link.isHome ? pathname === '/' : (pathname.startsWith(link.href) && link.href !== '/')

                  // Dedicated "Accueil" Button
                  if (link.isHome) {
                    return (
                      <Link
                        key={link.href}
                        href="/"
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-black transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]' 
                            : 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/20 shadow-xs'
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>ACCUEIL</span>
                      </Link>
                    )
                  }
                  
                  if (link.subLinks) {
                    return (
                      <div 
                        key={link.href} 
                        className="relative py-4"
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-extrabold transition-all cursor-pointer group ${
                          isActive 
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 shadow-xs' 
                            : 'text-slate-800 hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}>
                          <Link href={link.href} className="hover:underline">
                            {link.label}
                          </Link>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpenDropdown ? 'rotate-180 text-amber-500' : 'text-slate-400'
                          }`} />
                        </div>
                        
                        {/* Streamlined Dropdown Card */}
                        <div className={`absolute top-full left-0 mt-1 w-[380px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white/98 dark:bg-slate-900/98 p-3 shadow-2xl backdrop-blur-2xl transition-all duration-200 z-50 ${
                          isOpenDropdown 
                            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                            : 'opacity-0 translate-y-1 pointer-events-none scale-95'
                        }`}>
                          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-white/5 mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest">
                              Espace {link.label}
                            </span>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">GALF CI</span>
                          </div>

                          <div className="space-y-0.5">
                            {link.subLinks.map(sub => {
                              const IconComp = sub.icon
                              const isSubActive = pathname === sub.href
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group/item ${
                                    isSubActive 
                                      ? 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400 font-bold' 
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-amber-500 group-hover/item:text-slate-950 transition-colors">
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                                      {sub.label}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                                      {sub.desc}
                                    </div>
                                  </div>
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
                      className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-extrabold transition-all ${
                        isActive 
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 shadow-xs' 
                          : 'text-slate-800 hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Changer de thème"
                  title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                <Link 
                  href="/connexion" 
                  className="text-xs font-bold text-slate-700 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-400 px-2 py-2 transition-colors"
                >
                  Connexion
                </Link>

                <Link 
                  href="/inscription" 
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 xl:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  S&apos;inscrire
                </Link>
              </div>

              {/* Mobile Right Controls */}
              <div className="flex items-center gap-2 lg:hidden">
                <button 
                  onClick={toggleTheme} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
                  aria-label="Ouvrir le menu"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </nav>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* MOBILE DRAWER PANEL */}
      <div 
        className={`fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-md">
              <HardHat className="text-slate-950 w-4 h-4 fill-current" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              GALF<span className="text-amber-500">FORMATION</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {links.map((link) => {
            const isActive = link.isHome ? pathname === '/' : (pathname.startsWith(link.href) && link.href !== '/')

            if (link.isHome) {
              return (
                <Link 
                  key={link.href} 
                  href="/" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider mb-3 transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md' 
                      : 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-500/25'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>ACCUEIL</span>
                </Link>
              )
            }

            if (link.subLinks) {
              const isSectionOpen = openMobileSection === link.label
              return (
                <div key={link.href} className="border-b border-slate-100 dark:border-white/5 pb-2">
                  <button
                    onClick={() => toggleMobileSection(link.label)}
                    className={`w-full flex items-center justify-between text-left py-2.5 font-bold text-xs focus:outline-none transition-colors ${
                      isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isSectionOpen ? 'rotate-180 text-amber-500' : 'text-slate-400'
                    }`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-200 ${
                    isSectionOpen ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-amber-500/30">
                      {link.subLinks.map(sub => {
                        const SubIcon = sub.icon
                        const isSubActive = pathname === sub.href
                        return (
                          <Link 
                            key={sub.href} 
                            href={sub.href} 
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                              isSubActive 
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold' 
                                : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400'
                            }`}
                          >
                            <SubIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{sub.label}</span>
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
                className={`block text-xs font-bold transition-colors border-b border-slate-100 dark:border-white/5 py-3 ${
                  isActive ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-slate-800 dark:text-white hover:text-amber-500'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Drawer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-2 bg-slate-50 dark:bg-slate-900/50">
          <Link 
            href="/connexion" 
            onClick={() => setIsOpen(false)} 
            className="block w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-center font-bold text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            Connexion
          </Link>
          <Link 
            href="/inscription" 
            onClick={() => setIsOpen(false)} 
            className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-center font-extrabold text-xs shadow-md"
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      </div>
    </>
  )
}
