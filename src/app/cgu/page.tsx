"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
import { ShieldCheck, FileText, Scale } from 'lucide-react'

export default function CGU() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--galf-bg)' }}>
      {/* Header with Animation */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b" style={{ borderBottom: '1px solid var(--galf-border)' }}>
        <div className="absolute right-[-10%] top-0 w-[500px] h-[500px] opacity-[0.05] pointer-events-none z-0">
          <AnimatedMachineHeader type="chargeuse" />
        </div>

        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center border border-galf-yellow/20">
                <Scale className="w-6 h-6 text-galf-yellow" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                Conditions Générales <span className="text-galf-yellow">d'Utilisation</span>
              </h1>
            </div>
            <p className="max-w-2xl text-lg opacity-70" style={{ color: 'var(--galf-text)' }}>
              Dernière mise à jour : 13 Avril 2026. Veuillez lire attentivement les conditions régissant l'utilisation de la plateforme GALF Formation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container-galf">
          <div className="max-w-4xl mx-auto space-y-12">
            <FadeIn delay={0.1}>
              <div className="glass-card p-10 rounded-2xl">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                  <FileText className="text-galf-yellow w-6 h-6" /> 1. Objet
                </h2>
                <p className="leading-relaxed opacity-80 mb-4" style={{ color: 'var(--galf-text)' }}>
                  Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services du site GALF Formation, ci-après nommé « le Site » et les conditions d'utilisation du Site par l'Utilisateur.
                </p>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  Toute commande de formation ou accès au Site implique l'acceptation sans réserve par l'Acheteur et son adhésion pleine et entière aux présentes CGU.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-card p-10 rounded-2xl">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                  <ShieldCheck className="text-galf-yellow w-6 h-6" /> 2. Accès au Site
                </h2>
                <p className="leading-relaxed opacity-80 mb-4" style={{ color: 'var(--galf-text)' }}>
                  Le Site est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Site, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'Utilisateur.
                </p>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  GALF Formation met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au Site, mais n'est tenu à aucune obligation d'y parvenir.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="glass-card p-10 rounded-2xl">
                <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>3. Propriété Intellectuelle</h2>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  La structure générale du Site, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de GALF Formation. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale des contenus et services proposés par le Site, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de GALF Formation est strictement interdite.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="glass-card p-10 rounded-2xl">
                <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>4. Inscriptions et Formations</h2>
                <p className="leading-relaxed opacity-80 mb-4" style={{ color: 'var(--galf-text)' }}>
                  Toute inscription à une formation via le Site est soumise à validation par nos conseillers pédagogiques. GALF Formation se réserve le droit de refuser toute inscription qui ne satisferait pas aux prérequis techniques ou financiers.
                </p>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  Les tarifs indiqués sont fermes et définitifs à la date de validation de l'inscription.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
