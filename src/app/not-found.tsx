"use client"
import Link from 'next/link'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG - Pelle digging for the missing page */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none z-0">
        <div className="w-[1000px] h-[1000px] rotate-12">
          <AnimatedMachineHeader type="pelle" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <FadeIn>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-galf-yellow/10 border border-galf-yellow/20 mb-12">
            <Search className="w-10 h-10 text-galf-yellow" />
          </div>
          
          <div className="mb-4 text-galf-yellow font-black text-xl tracking-[0.3em] uppercase">Erreur 404</div>
          
          <TextReveal 
            text="CHANTIER INTROUVABLE" 
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-white" 
          />
          
          <p className="text-xl max-w-2xl mx-auto mb-16 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
            Il semble que l'équipement ait creusé au mauvais endroit. La page que vous recherchez n'existe pas ou a été déplacée vers un autre secteur.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/" className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-2xl shadow-galf-yellow/30">
              <Home className="w-5 h-5" /> Retour à l'accueil
            </Link>
            <Link href="/formations" className="glass-card px-12 py-5 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-3 hover:border-galf-yellow/30 transition-all">
              <ArrowLeft className="w-5 h-5" /> Nos formations
            </Link>
          </div>
        </FadeIn>
        
        {/* Decorative Grid */}
        <div className="mt-24 pt-8 border-t border-galf-border/30 max-w-xs mx-auto">
           <div className="text-[10px] font-bold text-galf-text-muted uppercase tracking-[0.2em]">GALF Navigation Services</div>
        </div>
      </div>
    </div>
  )
}
