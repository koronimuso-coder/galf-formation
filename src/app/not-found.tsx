import Link from 'next/link'
import { HardHat, ArrowLeft, AlertTriangle } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine for 404 */}
      <div className="absolute left-[5%] bottom-[5%] w-[600px] h-[600px] opacity-[0.05] pointer-events-none z-0">
        <AnimatedMachineHeader type="bulldozer" />
      </div>

      <div className="text-center px-4 max-w-lg relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-galf-yellow/10 border border-galf-yellow/20 mb-8">
          <AlertTriangle className="w-10 h-10 text-galf-yellow" />
        </div>
        <h1 className="text-8xl font-black mb-4 text-galf-yellow">404</h1>
        <h2 className="text-2xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>Zone en chantier</h2>
        <p className="mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
          Cette page n'existe pas ou est en cours de construction. Revenez sur la piste principale !
        </p>
        <Link href="/" className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-lg font-black hover:brightness-110 transition-all inline-flex items-center gap-2 shadow-md">
          <ArrowLeft className="w-5 h-5" /> Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
