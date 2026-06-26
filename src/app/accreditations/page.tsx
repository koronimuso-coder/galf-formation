"use client"

import { useState } from 'react'

import { 
  FileText, ShieldCheck, Download, Award, CheckCircle2, Building} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FadeIn } from '@/components/animations/FadeIn'

interface AccordionItem {
  title: string
  reference: string
  body: string
  authority: string
}

const ACCREDITATIONS: AccordionItem[] = [
  {
    title: "Agrément Ministériel de la Formation Professionnelle",
    reference: "Arrêté N°2024-118 / METFPA / Sec",
    body: "Autorisation officielle d'ouverture et d'exercice délivrée par le Ministère de l'Enseignement Technique, de la Formation Professionnelle et de l'Apprentissage de la République de Côte d'Ivoire. Cet agrément valide nos infrastructures, nos programmes pédagogiques et la qualification de nos formateurs.",
    authority: "Ministère de l'Enseignement Technique (METFPA)"
  },
  {
    title: "Habilitation d'Opérateur FDFP (Fonds de Développement)",
    reference: "N° Agrément FDFP: 2025-0842-GALF",
    body: "GALF est agréé en tant qu'organisme de formation habilité par le FDFP. Cela permet à toutes les entreprises assujetties à la taxe d'apprentissage de bénéficier d'une prise en charge intégrale ou partielle de leurs plans de formation pour leurs conducteurs d'engins.",
    authority: "Fonds de Développement de la Formation Professionnelle"
  },
  {
    title: "Conformité aux Référentiels Européens CACES",
    reference: "Équivalence R482 (Engins de chantier) & R490 (Grues)",
    body: "Bien que le CACES soit une certification strictement française, nos programmes de formation théoriques et pratiques intègrent rigoureusement les exigences de sécurité et de contrôle d'aptitude des recommandations R482, R490 et R489 de la CNAM (France), garantissant une employabilité internationale à nos diplômés.",
    authority: "Référentiels de Sécurité Européens"
  },
  {
    title: "Habilitation HSE & Normes OSHA (USA)",
    reference: "Standards OSHA 29 CFR 1926 (BTP)",
    body: "Nos formations de sécurité sur les chantiers respectent les directives de l'OSHA (Occupational Safety and Health Administration) pour le secteur de la construction. Chaque apprenant GALF reçoit un module obligatoire d'initiation aux risques professionnels et aux gestes de premier secours.",
    authority: "Occupational Safety & Health Standards"
  }
]

export default function AccreditationsPage() {
  const [activeTab, setActiveTab] = useState<'national' | 'international'>('national')
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
      // Open dummy document
      window.open('/files/agrement_galf_preview.pdf', '_blank')
    }, 1500)
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Cinematic grid overlay */}
      <div className="absolute right-[-10%] top-[15%] w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0 bg-diagonal" />
      
      <PageHeader 
        title="ACCRÉDITATIONS & NORMES" 
        subtitle="Un enseignement certifié par l'État Ivoirien et aligné sur les plus hauts standards de sécurité internationaux."
        badge="Qualité Certifiée"
        bgImage="/images/headers/actualites.png"
      />

      <div className="container-galf relative z-10 -mt-16">
        
        {/* Quality Badges Grid */}
        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow mb-6">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-adaptive mb-2 uppercase tracking-wide">Agrément National</h4>
              <p className="text-sm text-adaptive-secondary leading-relaxed">
                Habilité officiellement par le Ministère de l'Enseignement Technique de Côte d'Ivoire. Diplômes reconnus sur le marché national.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-adaptive mb-2 uppercase tracking-wide">HSE International</h4>
              <p className="text-sm text-adaptive-secondary leading-relaxed">
                Modules de sécurité calqués sur les normes rigoureuses européennes et américaines (CACES R482 & OSHA Construction).
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-diagonal opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-adaptive mb-2 uppercase tracking-wide">Financement FDFP</h4>
              <p className="text-sm text-adaptive-secondary leading-relaxed">
                Éligible au remboursement des coûts de formation pour toutes les entreprises ivoiriennes cotisantes.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* List of Accreditations */}
          <div className="lg:col-span-2 space-y-6">
            <FadeIn delay={0.2}>
              <div className="flex gap-4 border-b border-adaptive pb-4 mb-8">
                <button
                  onClick={() => setActiveTab('national')}
                  className={`text-sm font-black uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'national' ? 'border-galf-yellow text-galf-yellow' : 'border-transparent text-adaptive-muted hover:text-adaptive'
                  }`}
                >
                  Agréments Nationaux
                </button>
                <button
                  onClick={() => setActiveTab('international')}
                  className={`text-sm font-black uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'international' ? 'border-galf-yellow text-galf-yellow' : 'border-transparent text-adaptive-muted hover:text-adaptive'
                  }`}
                >
                  Conformités Internationales
                </button>
              </div>
            </FadeIn>

            <div className="space-y-6">
              {ACCREDITATIONS.filter((item, idx) => 
                activeTab === 'national' ? idx < 2 : idx >= 2
              ).map((acc, idx) => (
                <FadeIn key={idx} delay={0.1 * idx}>
                  <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-black text-galf-yellow uppercase tracking-widest block mb-1">
                          {acc.authority}
                        </span>
                        <h4 className="text-xl font-black text-adaptive leading-tight">
                          {acc.title}
                        </h4>
                      </div>
                      <span className="bg-galf-bg-alt/80 border border-adaptive text-adaptive-secondary px-3 py-1 rounded-full text-xs font-black self-start">
                        {acc.reference}
                      </span>
                    </div>
                    <p className="text-sm text-adaptive-secondary leading-relaxed mb-6">
                      {acc.body}
                    </p>
                    <div className="flex gap-2 text-xs font-bold text-galf-yellow items-center">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Audit de conformité validé annuellement</span>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Download Box */}
          <FadeIn delay={0.3}>
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden bg-diagonal bg-opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-galf-yellow/5 to-transparent opacity-10" />
              <h4 className="text-xl font-black text-adaptive mb-4 uppercase tracking-wide">
                Dossier Réglementaire
              </h4>
              <p className="text-sm text-adaptive-secondary leading-relaxed mb-6">
                Téléchargez notre brochure officielle d'accréditation comprenant nos arrêtés d'agrément ministériel et notre charte de conformité HSE pour vos audits internes de sous-traitance.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-xs text-adaptive-secondary">
                  <FileText className="w-4 h-4 text-galf-yellow" />
                  <span>Agrément_GALF_2024.pdf (2.4 Mo)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-adaptive-secondary">
                  <FileText className="w-4 h-4 text-galf-yellow" />
                  <span>Referentiel_CACES_Conformite.pdf (1.8 Mo)</span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-galf-yellow text-galf-carbon py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Préparation...
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                    Téléchargé
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Télécharger le dossier (.zip)
                  </>
                )}
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
