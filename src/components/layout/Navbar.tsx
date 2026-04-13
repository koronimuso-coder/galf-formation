"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HardHat, Menu, X, ChevronRight, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/formations', label: 'Formations' },
    { href: '/entreprise', label: 'Entreprises' },
    { href: '/mediatheque', label: 'Médiathèque' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/blog', label: 'Actualités' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'shadow-lg border-b border-[var(--galf-border)]'
          : 'border-b border-transparent'
      }`} style={{ background: scrolled ? 'var(--galf-surface)' : 'transparent' }}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-galf-yellow flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <HardHat className="text-galf-carbon w-6 h-6" />
            </div>
            <div className="font-black text-xl tracking-tighter" style={{ color: 'var(--galf-text)' }}>
              GALF<span className="text-galf-yellow">.</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-galf-yellow" style={{ color: 'var(--galf-text-secondary)' }}>
                {link.label}
              </Link>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-galf-yellow/10"
              style={{ color: 'var(--galf-text-secondary)', border: '1px solid var(--galf-border)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link href="/connexion" className="text-[13px] font-bold uppercase tracking-[0.12em] transition-colors hover:text-galf-yellow" style={{ color: 'var(--galf-text)' }}>
              Connexion
            </Link>
            <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-6 py-2.5 rounded-lg font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              S'inscrire
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: 'var(--galf-text-secondary)', border: '1px solid var(--galf-border)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center" style={{ color: 'var(--galf-text)' }}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'var(--galf-bg)' }}>
        <div className="flex flex-col justify-center items-center h-full gap-6">
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
              className="text-2xl font-black uppercase tracking-wider flex items-center gap-2 hover:text-galf-yellow transition-colors"
              style={{ color: 'var(--galf-text)' }}>
              {link.label} <ChevronRight className="w-5 h-5" style={{ color: 'var(--galf-text-secondary)' }} />
            </Link>
          ))}
          <div className="w-16 my-4" style={{ borderTop: '1px solid var(--galf-border)' }} />
          <Link href="/connexion" onClick={() => setIsOpen(false)} className="text-lg font-bold transition-colors hover:text-galf-yellow" style={{ color: 'var(--galf-text-secondary)' }}>
            Connexion
          </Link>
          <Link href="/inscription" onClick={() => setIsOpen(false)} className="bg-galf-yellow text-galf-carbon px-10 py-4 rounded-lg font-black text-lg mt-4 hover:brightness-110 transition-all shadow-lg">
            S'inscrire maintenant
          </Link>
        </div>
      </div>
    </>
  )
}
