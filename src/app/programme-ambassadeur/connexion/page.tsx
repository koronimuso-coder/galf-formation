"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HardHat, LogIn, ArrowRight, AlertTriangle } from 'lucide-react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { signInUser } from '@/lib/firebase/services/auth'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function ConnexionAmbassadeur() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const profile = await signInUser(email.trim(), password)
      
      // Redirect based on role
      if (profile.role === 'PARRAIN') {
        router.push('/programme-ambassadeur/dashboard')
      } else if (profile.role === 'COMMERCIAL') {
        router.push('/programme-ambassadeur/commercial')
      } else if (profile.role === 'RESPONSABLE_COMMERCIAL') {
        router.push('/programme-ambassadeur/responsable')
      } else if (['COMPTABLE', 'ADMIN_PARRAINAGE', 'SUPER_ADMIN'].includes(profile.role)) {
        router.push('/programme-ambassadeur/admin')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Identifiants incorrects. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20" style={{ background: 'var(--galf-bg)' }}>
      {/* Animated Machine Background */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[600px] opacity-[0.05] pointer-events-none z-0 hidden lg:block">
        <AnimatedMachineHeader type="pelle" />
      </div>
      <div className="absolute inset-0 z-10 hidden lg:block" style={{ background: 'var(--galf-hero-overlay-grad)' }} />

      <div className="container relative z-20 mx-auto px-4 flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md">
          <FadeIn>
            <div className="glass-card p-8 rounded-[2.5rem] bg-black/30 border-white/5 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[4rem]" />
              
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-galf-yellow mb-6 shadow-md">
                <HardHat className="w-6 h-6 text-galf-carbon" />
              </div>

              <TextReveal 
                text="CONNEXION COCKPIT" 
                className="text-2xl font-black tracking-tighter mb-2 text-white" 
              />
              <p className="text-xs mb-6" style={{ color: 'var(--galf-text-secondary)' }}>
                Accédez à votre espace parrain, commercial ou administration.
              </p>

              {errorMessage && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-left text-xs text-red-400 font-bold flex items-start gap-2.5 mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--galf-text-muted)' }}>Adresse Email</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-galf-yellow transition-all"
                    style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} 
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--galf-text-muted)' }}>Mot de passe</label>
                    <Link href="/mot-de-passe-oublie" className="text-[10px] text-galf-yellow font-bold hover:underline">Oublié ?</Link>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-galf-yellow transition-all"
                    style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-xl hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" /> {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>
                Pas encore ambassadeur ?{' '}
                <Link href="/programme-ambassadeur/inscription" className="text-galf-yellow font-bold hover:underline inline-flex items-center gap-0.5">
                  Créer un compte parrain <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
