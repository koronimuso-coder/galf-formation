"use client"
import Link from 'next/link'
import { HardHat, LogIn, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Animated Machine Background */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[600px] opacity-[0.08] pointer-events-none z-0 hidden lg:block">
        <AnimatedMachineHeader type="pelle" />
      </div>
      <div className="absolute inset-0 z-10 hidden lg:block" style={{ background: 'var(--galf-hero-overlay-grad)' }} />

      <div className="container relative z-20 mx-auto px-4 flex min-h-[80vh]">
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-md mx-auto lg:mx-0">
          <FadeIn>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-galf-yellow mb-8 shadow-lg">
              <HardHat className="w-8 h-8 text-galf-carbon" />
            </div>

            <h1 className="text-4xl font-black tracking-tighter mb-2" style={{ color: 'var(--galf-text)' }}>CONNEXION</h1>
            <p className="mb-8" style={{ color: 'var(--galf-text-secondary)' }}>Accédez à votre espace Candidat ou Apprenant.</p>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Adresse Email</label>
                <input type="email" placeholder="votre@email.com" required
                  className="w-full rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-galf-yellow"
                  style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Mot de passe</label>
                  <Link href="/mot-de-passe-oublie" className="text-xs text-galf-yellow font-bold hover:underline">Oublié ?</Link>
                </div>
                <input type="password" placeholder="••••••••" required
                  className="w-full rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-galf-yellow"
                  style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
              </div>
              <button type="button" className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" /> Se Connecter
              </button>
            </form>

            <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-galf-yellow font-bold hover:underline inline-flex items-center gap-1">
                Créer un compte <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
