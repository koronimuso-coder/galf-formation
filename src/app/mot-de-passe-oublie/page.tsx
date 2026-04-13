"use client"
import Link from 'next/link'
import { HardHat, Mail, ArrowLeft } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute right-[-15%] top-[10%] w-[500px] h-[500px] opacity-[0.04] pointer-events-none z-0">
        <AnimatedMachineHeader type="bulldozer" />
      </div>

      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-galf-yellow mb-6 shadow-lg">
              <HardHat className="w-8 h-8 text-galf-carbon" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2" style={{ color: 'var(--galf-text)' }}>Mot de passe oublié</h1>
            <p style={{ color: 'var(--galf-text-secondary)' }}>Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--galf-text-muted)' }} />
                  <input type="email" placeholder="votre@email.com" required
                    className="w-full rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-galf-yellow"
                    style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
                </div>
              </div>
              <button type="button" className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md">
                Envoyer le lien
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/connexion" className="text-sm font-bold hover:text-galf-yellow transition-colors inline-flex items-center gap-2" style={{ color: 'var(--galf-text-secondary)' }}>
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
