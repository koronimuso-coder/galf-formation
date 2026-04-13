"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
import { Lock, Eye, ShieldAlert, Database } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--galf-bg)' }}>
      {/* Header with Animation */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b" style={{ borderBottom: '1px solid var(--galf-border)' }}>
        <div className="absolute right-[-10%] top-0 w-[500px] h-[500px] opacity-[0.05] pointer-events-none z-0">
          <AnimatedMachineHeader type="grue" />
        </div>

        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 flex items-center justify-center border border-galf-yellow/20">
                <Lock className="w-6 h-6 text-galf-yellow" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                Politique de <span className="text-galf-yellow">Confidentialité</span>
              </h1>
            </div>
            <p className="max-w-2xl text-lg opacity-70" style={{ color: 'var(--galf-text)' }}>
              Votre vie privée est notre priorité. Découvrez comment GALF Formation protège et gère vos données personnelles.
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
                  <Database className="text-galf-yellow w-6 h-6" /> 1. Collecte des données
                </h2>
                <p className="leading-relaxed opacity-80 mb-4" style={{ color: 'var(--galf-text)' }}>
                  Nous collectons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à votre compte, faites une demande de formation, et / ou lorsque vous vous déconnectez.
                </p>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  Les informations collectées incluent votre nom, votre adresse e-mail, numéro de téléphone, et les informations relatives à votre parcours professionnel.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-card p-10 rounded-2xl">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                  <Eye className="text-galf-yellow w-6 h-6" /> 2. Utilisation des informations
                </h2>
                <p className="leading-relaxed opacity-80 mb-4" style={{ color: 'var(--galf-text)' }}>
                  Toute les informations que nous recueillons auprès de vous peuvent être utilisées pour :
                </p>
                <ul className="list-disc list-inside space-y-2 opacity-80 mb-4 ml-4" style={{ color: 'var(--galf-text)' }}>
                  <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                  <li>Fournir un contenu pédagogique adapté</li>
                  <li>Améliorer notre service client et vos besoins de prise en charge</li>
                  <li>Vous contacter par e-mail</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="glass-card p-10 rounded-2xl">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                  <ShieldAlert className="text-galf-yellow w-6 h-6" /> 3. Protection des informations
                </h2>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne. Nous protégeons également vos informations hors ligne.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="glass-card p-10 rounded-2xl text-center">
                <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>Consentement</h2>
                <p className="leading-relaxed opacity-80" style={{ color: 'var(--galf-text)' }}>
                  En utilisant notre site, vous consentez à notre politique de confidentialité.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
