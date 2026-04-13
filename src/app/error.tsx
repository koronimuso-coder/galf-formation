"use client"
import { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
import { Wrench, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine for Error */}
      <div className="absolute right-[5%] bottom-[5%] w-[600px] h-[600px] opacity-[0.05] pointer-events-none z-0">
        <AnimatedMachineHeader type="pelle" />
      </div>

      <div className="text-center px-4 max-w-lg relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
          <Wrench className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>
          Une panne est <span className="text-red-500">survenue</span>
        </h1>
        
        <p className="mb-8 text-lg opacity-70" style={{ color: 'var(--galf-text)' }}>
          Nos techniciens sont sur le coup. Une erreur inattendue a perturbé le chantier.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-lg font-black hover:brightness-110 transition-all inline-flex items-center gap-2 shadow-md"
          >
            <RefreshCcw className="w-5 h-5" /> Réessayer
          </button>
          
          <Link 
            href="/" 
            className="glass-card px-8 py-4 rounded-lg font-black hover:border-galf-yellow/30 transition-all inline-flex items-center gap-2"
            style={{ color: 'var(--galf-text)' }}
          >
            <Home className="w-5 h-5" /> Accueil
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-8 text-[10px] opacity-30 font-mono tracking-tighter" style={{ color: 'var(--galf-text)' }}>
            ID Erreur: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
