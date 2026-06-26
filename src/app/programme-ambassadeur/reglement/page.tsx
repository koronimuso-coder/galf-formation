"use client"
import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { PageHeader } from '@/components/layout/PageHeader'

export default function ReglementProgramme() {
  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="RÈGLEMENT OFFICIEL"
        subtitle="Règles d'affaires et conditions juridiques de participation."
        badge="Cadre Légal & Conformité"
        bgImage="/images/cinematic/animate-2026-04-15T170949.508-ezgif.com-video-to-webp-converter.webp"
        centered={true}
      />

      <div className="container-galf mt-12 relative z-10 max-w-4xl text-left">
        
        <FadeIn>
          <div className="mb-6">
            <Link href="/programme-ambassadeur" className="inline-flex items-center gap-2 text-xs font-black uppercase text-galf-yellow hover:underline">
              <ArrowLeft className="w-4 h-4" /> Retour au programme
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-galf-yellow/20 bg-galf-yellow/5 flex gap-3 mb-8">
            <ShieldAlert className="w-5 h-5 text-galf-yellow shrink-0 mt-0.5" />
            <div className="text-xs text-galf-text-secondary leading-relaxed">
              <strong className="text-white block mb-1">Mention Administrative Interne :</strong>
              Le présent règlement doit être formellement validé par la direction juridique de GALF FORMATION avant publication définitive.
            </div>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] bg-black/20 border-white/5 space-y-8 text-xs text-galf-text-secondary leading-relaxed">
            
            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                Article 1 : Organisateur
              </h3>
              <p>
                Le présent programme de parrainage et d'acquisition (ci-après dénommé "Programme Ambassadeur") est organisé par <strong>GALF FORMATION</strong>, établissement d'enseignement technique et de formation professionnelle certifié, dont le siège est situé à Yopougon, Marché Bagnon, Abidjan, Côte d'Ivoire.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 2 : Objet du Programme
              </h3>
              <p>
                Le programme vise à transformer les apprenants, anciens stagiaires, partenaires, et sympathisants de GALF FORMATION en ambassadeurs actifs. Les ambassadeurs ont pour mission de recommander les formations certifiantes de GALF à leur entourage professionnel et familial en Côte d'Ivoire.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 3 : Conditions d'Éligibilité des Parrains
              </h3>
              <p>
                La participation est entièrement gratuite et ouverte à toute personne physique majeure résidant en Côte d'Ivoire, sans obligation d'être ou d'avoir été préalablement inscrit en tant qu'apprenant chez GALF. La création d'un profil ambassadeur unique et l'acceptation sans réserve du présent règlement sont obligatoires pour générer un code parrain.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 4 : Méthode d'Attribution & Filleuls
              </h3>
              <p>
                Le filleul recommandé doit s'inscrire en utilisant le code ou le lien unique du parrain. 
                L'attribution du parrainage repose sur la règle du <strong>Premier Clic (First-Click)</strong> enregistré sur nos serveurs dans une limite de 30 jours, sauf si le filleul décide de saisir manuellement le code d'un autre parrain au moment de valider sa pré-inscription finale. 
                Le changement ultérieur de parrain sur un dossier candidat est bloqué, sauf décision administrative exceptionnelle d'un responsable commercial GALF.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 5 : Règle de Récompense (Seuil des 5)
              </h3>
              <p>
                Pour chaque tranche de <strong>5 inscriptions confirmées et validées financièrement</strong> (filleuls distincts ayant réglé l'acompte minimum obligatoire de 30% requis pour leur formation), l'ambassadeur devient éligible à un bon de <strong>formation 100% offerte</strong>.
              </p>
              <p>
                La récompense est strictement personnelle, non remboursable, non échangeable, et <strong>ne peut en aucun cas être convertie en argent ou cash</strong>. L'ambassadeur peut toutefois faire bénéficier un tiers de sa formation offerte, sous réserve de validation écrite par GALF.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 6 : Sécurité & Lutte contre la Fraude
              </h3>
              <p>
                Les systèmes de GALF intègrent un algorithme automatique d'évaluation de la fraude (analyse des adresses IP d'inscription, détection de doublons d'identité, numéros WhatsApp similaires ou séries suspectes). 
                L'auto-parrainage (le fait pour un parrain d'utiliser son propre code pour s'inscrire en tant que candidat) est strictement interdit et entraîne la suspension immédiate du dossier et du compte ambassadeur pour examen humain.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 7 : Expiration & Durée de Validité
              </h3>
              <p>
                À compter de sa validation et de son approbation par l'administration, le bon de formation offerte dispose d'une validité de <strong>90 jours calendaires</strong>. Passé ce délai, la récompense expire et ne peut plus être réclamée.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Article 8 : Données Personnelles (Confidentialité)
              </h3>
              <p>
                Toutes les informations collectées lors de l'inscription sont soumises à notre politique de confidentialité et traitées de manière conforme à la législation sur la protection des données en Côte d'Ivoire. Les filleuls parrainés voient leurs données nominatives et pièces administratives masquées dans le cockpit du parrain pour préserver leur vie privée.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-white/5 text-[10px] text-white/40">
              <p>Règlement Version : 1.0 (Juin 2026)</p>
              <p>GALF FORMATION · Comité de Direction Commerciale</p>
            </section>

          </div>
        </FadeIn>

      </div>
    </div>
  )
}
