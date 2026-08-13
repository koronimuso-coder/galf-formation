"use client"
import Link from 'next/link'
import { Phone, FileText } from 'lucide-react'

interface StickyMobileCTAProps {
  slug?: string
  price?: number
  pricePromo?: number
}

export function StickyMobileCTA({ price, pricePromo }: StickyMobileCTAProps) {
  const displayPrice = pricePromo || price

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[49] bg-white/95 dark:bg-zinc-950/95 border-t border-slate-200 dark:border-white/15 backdrop-blur-md px-4 py-3.5 flex items-center justify-between gap-4 shadow-[0_-10px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_25px_rgba(0,0,0,0.5)] font-sans">
      <div className="flex flex-col">
        <span className="text-[8px] text-slate-500 dark:text-zinc-500 font-mono uppercase tracking-widest block">Tarif unique</span>
        {displayPrice ? (
          <span className="text-sm font-black text-galf-yellow block leading-tight">{displayPrice.toLocaleString('fr-FR')} F</span>
        ) : (
          <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">Devis B2B</span>
        )}
      </div>

      <div className="flex gap-2 flex-1 justify-end">
        {/* Brochure request (scrolls to brochure form or opens link) */}
        <button 
          onClick={() => {
            const el = document.getElementById('formulaire-brochure-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white w-11 h-11 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Télécharger la brochure"
        >
          <FileText className="w-5 h-5 text-galf-yellow" />
        </button>

        {/* Call advisor */}
        <a 
          href="tel:+2250711826507"
          className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white w-11 h-11 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Appeler un conseiller"
        >
          <Phone className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        </a>

        {/* Primary CTA */}
        <Link 
          href="/inscription" 
          className="bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex-1 text-center flex items-center justify-center active:scale-95 transition-transform"
        >
          S'inscrire
        </Link>
      </div>
    </div>
  )
}
