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

  const links: NavLink[] = [
    { href: '/formations', label: 'Formations' },
    { 
      href: '/entreprise', 
      label: 'Entreprises',
      subLinks: [
        { href: '/entreprise', label: 'Portail Corporate', desc: 'Solutions sur-mesure pour PME & grands groupes.', badge: 'B2B' },
        { href: '/entreprise/calculateur-roi', label: 'Simulateur ROI & Carburant', desc: 'Calculez le gain de consommation de vos conducteurs.', badge: 'OPTIMISEUR' }
      ]
    },
    { 
      href: '/recrutement', 
      label: 'Recrutement BTP',
      subLinks: [
        { href: '/recrutement', label: 'Offres Emploi', desc: 'Consultez les postes actifs de nos partenaires chantiers.', badge: 'EMPLOIS' },
        { href: '/recrutement/annuaire-operateurs', label: 'Annuaire Opérateurs', desc: 'Accédez à nos diplômés certifiés sur la Blockchain.', badge: 'BLOCKCHAIN' }
      ]
    },
    { href: '/financement', label: 'Financement' },
    { href: '/accreditations', label: 'Accréditations' },
    { 
      href: '/mediatheque', 
      label: 'Médiathèque',
      subLinks: [
        { href: '/mediatheque', label: 'Ressources & Guides', desc: 'Bibliothèque de documents de sécurité HSE et tutoriels.', badge: 'DOCS' },
        { href: '/mediatheque/checklist-securite', label: 'Fiche Inspection HSE', desc: 'Créez vos fiches de prise de poste engin en 2 min.', badge: 'HSE TOOL' },
        { href: '/mediatheque/simulateur', label: 'Simulateur 3D', desc: 'Pilotez virtuellement une Pelle, Grue ou Bulldozer.', badge: 'IMMERSION' }
      ]
    },
    { href: '/rse-impact', label: 'RSE & Impact' },
    { href: '/contact', label: 'Contact' },
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
                : 'border-b border-white/5 bg-black/45 backdrop-blur-md'
            }`}
          >
            <div className="container mx-auto px-6 h-18 md:h-20 flex items-center justify-between max-w-7xl">
              
              {/* Logo block */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#00f2fe]/40 stitch-orbit pointer-events-none" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2fe] to-orange-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-[#00f2fe]/20">
                    <HardHat className="text-galf-carbon w-5.5 h-5.5 fill-current" />
                  </div>
                </div>
                <div className="font-black text-xl tracking-tighter text-white">
                  GALF<span className="text-[#00f2fe] font-extrabold animate-pulse">.</span>
                </div>
              </Link>

              {/* Desktop links */}
              <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                {links.map(link => {
                  if (link.subLinks) {
                    return (
                      <div key={link.href} className="relative group py-6">
                        <button 
                          className="text-[11px] font-black uppercase tracking-[0.15em] text-white/70 group-hover:text-galf-yellow flex items-center gap-1.5 cursor-pointer focus:outline-none transition-colors"
                        >
                          {link.label}
                          <ChevronDown className="w-3.5 h-3.5 opacity-50 transition-transform group-hover:rotate-180" />
                        </button>
                        
                        {/* PREMIUM INDUSTRIAL MEGA DROPDOWN */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[380px] rounded-2xl border border-[#00f2fe]/20 bg-zinc-950/90 p-4 shadow-2xl opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 backdrop-blur-xl bg-[radial-gradient(ellipse_at_top,rgba(0,242,254,0.06),transparent)] stitch-hud-corner">
                          <div className="absolute inset-0 stitch-blueprint-grid opacity-15 rounded-2xl pointer-events-none" />
                          <div className="absolute inset-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f2fe]/40 to-transparent" />
                          
                          <div className="relative z-10 space-y-3">
                            <div className="text-[9px] font-mono text-galf-yellow/60 font-black uppercase tracking-[0.25em] border-b border-white/5 pb-2 mb-2 flex justify-between items-center">
                              <span>{link.label} · Accès Direct</span>
                              <span className="text-[7px] text-[#00f2fe]/60">SYS-SCAN // ON</span>
                            </div>
                            
                            {link.subLinks.map(sub => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="block p-3 rounded-xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-left group/item"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-xs font-black uppercase tracking-wider text-white group-hover/item:text-[#00f2fe] transition-colors">
                                    {sub.label}
                                  </span>
                                  {sub.badge && (
                                    <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-[#00f2fe]">
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed font-semibold">
                                  {sub.desc}
                                </p>
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
                      className="text-[11px] font-black uppercase tracking-[0.15em] text-white/70 hover:text-galf-yellow transition-colors" 
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* Action buttons & HUD status */}
              <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
                {/* HUD Latency telemetre */}
                <div className="flex items-center gap-2 font-mono text-[9px] text-[#00f2fe] bg-[#00f2fe]/5 border border-[#00f2fe]/10 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,242,254,0.05)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
                  <span>HUD // SYS: {telemetryLatency}ms</span>
                </div>

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors border border-white/10 hover:bg-white/5 text-white/70 hover:text-white"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <Link href="/connexion" className="text-[11px] font-black uppercase tracking-[0.15em] text-white hover:text-galf-yellow transition-colors">
                  Connexion
                </Link>
                <Link href="/inscription" className="bg-gradient-to-r from-[#00f2fe] to-orange-500 text-galf-carbon px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md shadow-[#00f2fe]/10">
                  S&apos;inscrire
                </Link>
              </div>

              {/* Mobile controls */}
              <div className="flex items-center gap-3 lg:hidden shrink-0">
                <button 
                  onClick={toggleTheme} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/70"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/10"
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
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden overflow-y-auto ${
          isOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
        }`}
        style={{ background: '#08080a' }}
      >
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 btp-blueprint-grid opacity-15 pointer-events-none z-0" />
        <div className="absolute inset-0 btp-blueprint-grid-fine opacity-15 pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col justify-start items-center min-h-screen py-28 px-6 gap-8">
          <div className="w-full max-w-md space-y-6">
            {links.map((link) => {
              if (link.subLinks) {
                return (
                  <div key={link.href} className="space-y-2 border-l border-white/10 pl-4 py-1">
                    <span className="text-[10px] font-mono text-galf-yellow font-black uppercase tracking-[0.2em]">
                      {link.label}
                    </span>
                    <div className="flex flex-col gap-3 pt-1">
                      {link.subLinks.map(sub => (
                        <Link 
                          key={sub.href} 
                          href={sub.href} 
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-black uppercase text-white/80 hover:text-galf-yellow flex items-center gap-1.5 transition-colors"
                        >
                          {sub.label} <ChevronRight className="w-3.5 h-3.5 text-galf-yellow" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="block text-xl font-black uppercase text-white hover:text-galf-yellow transition-colors border-b border-white/5 pb-2"
                >
                  {link.label}
                </Link>
              )
            })}
            
            <div className="w-full h-[1px] bg-white/10 pt-4" />
            
            <div className="flex flex-col gap-4">
              <Link 
                href="/connexion" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 rounded-xl border border-white/10 text-center font-bold text-sm uppercase tracking-wider text-white"
              >
                Connexion
              </Link>
              <Link 
                href="/inscription" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 rounded-xl bg-galf-yellow text-galf-carbon text-center font-black text-sm uppercase tracking-widest"
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
