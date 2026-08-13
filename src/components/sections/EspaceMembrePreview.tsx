"use client"
import { PlayCircle, CheckSquare, Clock, GraduationCap } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function EspaceMembrePreview() {
  const modules = [
    {
      icon: PlayCircle,
      title: "Vidéos de Conduite & HSE",
      desc: "Accédez à plus de 20h de vidéos explicatives sur la mécanique des engins et les gestes de commandement."
    },
    {
      icon: CheckSquare,
      title: "Quiz Code & Sécurité CACES",
      desc: "Testez vos connaissances avec nos tests d'entraînement interactifs illimités corrigés en temps réel."
    },
    {
      icon: Clock,
      title: "Réservation de Cabine Simulateur",
      desc: "Planifiez vos séances de conduite sur simulateur 3D dans nos centres en fonction de vos disponibilités."
    },
    {
      icon: GraduationCap,
      title: "Diplômes Blockchain Certifiés",
      desc: "Retrouvez vos attestations de formation et certificats enregistrés sur la blockchain, infalsifiables."
    }
  ]

  return (
    <section className="py-24 border-t border-zinc-200 dark:border-white/10 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/40">
      <div className="container-galf relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Col: Explanations */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 animate-pulse" /> E-Learning
            </span>
            
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-tight">
              Préparez-vous <br />
              <span className="text-amber-500">en ligne</span>
            </h2>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg font-medium">
              Optimisez votre temps ! Étudiez le code de la route de chantier et les protocoles de sécurité HSE depuis votre smartphone ou ordinateur. Validez vos heures théoriques en ligne avant de passer à la conduite pratique réelle sur notre plateau technique.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase">Accès Instantané après Inscription</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Compte étudiant créé automatiquement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase">Suivi de Progression par Instructeur</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Votre instructeur valide vos quiz théoriques à distance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Dashboard Mockup */}
          <div className="lg:col-span-7">
            <FadeIn className="glass-card p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              {/* Telemetry Header */}
              <div className="text-[9px] font-mono text-amber-500 font-black uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-white/10 pb-3 mb-6 flex justify-between items-center">
                <span>PLATEFORME D'APPRENTISSAGE // DEMO-MOCK</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> SYS: OK</span>
              </div>

              {/* Grid of E-Learning features */}
              <div className="grid sm:grid-cols-2 gap-4">
                {modules.map((m, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 space-y-3 hover:border-amber-500/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <m.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">{m.title}</h4>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock platform CTA */}
              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  Lancement officiel : Fin 2026
                </span>
                <button 
                  disabled
                  className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-6 py-2.5 rounded-xl font-extrabold text-[10px] uppercase tracking-widest opacity-60 cursor-not-allowed"
                >
                  Accéder à mon espace étudiant
                </button>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  )
}
