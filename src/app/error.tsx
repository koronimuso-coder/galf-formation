"use client"
import { useEffect } from 'react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG - Camion stalled/parked */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
        <div className="w-[1000px] h-[1000px] -rotate-12 translate-x-20">
          <AnimatedMachineHeader type="camion" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <FadeIn>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 mb-12">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          
          <div className="mb-4 text-red-500 font-black text-xl tracking-[0.3em] uppercase">Panne Système</div>
          
          <TextReveal 
            text="CHAMP D'ACTION BLOQUÉ" 
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-white" 
          />
          
          <p className="text-xl max-w-2xl mx-auto mb-16 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
            Une erreur inattendue a stoppé les opérations. Nos techniciens virtuels ont été alertés. Veuillez essayer de redémarrer le module.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => reset()}
              className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-2xl shadow-galf-yellow/30"
            >
              <RefreshCw className="w-5 h-5" /> Relancer les machines
            </button>
            <Link href="/" className="glass-card px-12 py-5 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-3 hover:border-galf-yellow/30 transition-all">
              <Home className="w-5 h-5" /> Hub Principal
            </Link>
          </div>
          
          {error.digest && (
             <div className="mt-12 text-[10px] font-mono opacity-20 text-white uppercase tracking-widest">
                Log ID: {error.digest}
             </div>
          )}
        </FadeIn>
      </div>
    </div>
  )
}
