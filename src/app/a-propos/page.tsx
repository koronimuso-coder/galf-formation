"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { ShieldCheck, Target, Users, Award, Calendar, Briefcase, Network, CheckCircle2, Scale, Lightbulb } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="À PROPOS DE GALF"
        subtitle="Découvrez le Groupe Africain de Logistique et Formation, leader de la formation professionnelle spécialisée en Côte d'Ivoire."
        badge="Qui sommes-nous"
      />

      {/* Hero Content */}
      <div className="container-galf mb-24 relative z-10 mt-12">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl" style={{ border: '1px solid var(--galf-border)' }}>
            {/* The image should be replaced with the one provided by the user if placed in public/images/about/director.jpg */}
            <Image 
              src="/images/about/director.png" 
              alt="Direction GALF Formation" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">Depuis 2022</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <h2 className="text-3xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>Groupe Africain Logistique & Formation</h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--galf-text-secondary)' }}>
              Le <strong>Groupe Africain Logistique & Formation (GALF Formation)</strong> est un organisme ivoirien de formation professionnelle spécialisé dans les métiers de la logistique, du BTP et de la conduite d’engins. 
            </p>
            <p className="leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
              Le groupe s’est donné pour mission de répondre aux défis du chômage et du sous-emploi des jeunes en Côte d’Ivoire en formant une main-d’œuvre qualifiée et immédiatement opérationnelle.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, t: "Excellence", p: "Savoir-faire technique" },
                { icon: Briefcase, t: "Insertion", p: "Immédiatement opérationnel" },
              ].map((val, i) => (
                <div key={i} className="glass-card p-4 rounded-xl flex items-center gap-3">
                  <val.icon className="w-8 h-8 text-galf-yellow shrink-0" />
                  <div>
                    <div className="text-sm font-black text-galf-text">{val.t}</div>
                    <div className="text-[10px] font-bold text-galf-text-secondary">{val.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Historique & Jalons */}
      <div className="py-24" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <FadeIn>
            <h2 className="text-3xl font-black mb-16 text-center" style={{ color: 'var(--galf-text)' }}>Historique & <span className="text-galf-yellow">Jalons Clés</span></h2>
          </FadeIn>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { year: "2022", text: "Création du Groupe GALF Formation à Abidjan et lancement des premières formations en conduite d’engins et logistique." },
              { year: "2023", text: "Déploiement d’antennes en Côte d’Ivoire (maillage territorial) pour rapprocher la formation des apprenants." },
              { year: "2024", text: "Renforcement du réseau de partenaires et montée en puissance des programmes d’insertion professionnelle." },
              { year: "2025", text: "Lancement de l’initiative GALF Connect pour connecter formation, emploi et partenaires ; consolidation des partenariats à vocation sociale." },
              { year: "2026", text: "Organisation de la 1ère Conférence nationale des conducteurs d’engins (GALF Connect) prévue à Abidjan les 11–12 juin 2026." },
            ].map((jalon, i) => (
              <FadeIn key={i} delay={i * 0.1} className="flex gap-6 items-start">
                <div className="w-20 text-right shrink-0 font-black text-galf-yellow text-xl">{jalon.year}</div>
                <div className="w-4 h-4 rounded-full bg-galf-yellow mt-1.5 shrink-0 shadow-[0_0_10px_rgba(255,176,0,0.5)]" />
                <div className="flex-1 pb-8" style={{ borderLeft: i !== 4 ? '2px dashed var(--galf-border)' : 'none', paddingLeft: '1.5rem', marginLeft: '-1.5rem' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--galf-text)' }}>{jalon.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Valeurs */}
      <div className="py-24" style={{ background: 'var(--galf-bg)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <FadeIn>
            <h2 className="text-3xl font-black mb-12 text-center" style={{ color: 'var(--galf-text)' }}>
              Notre <span className="text-galf-yellow">Mission</span>
            </h2>
          </FadeIn>
          
          <div className="max-w-4xl mx-auto mb-20">
            <FadeIn>
              <p className="text-lg leading-relaxed text-center font-medium mb-12" style={{ color: 'var(--galf-text-secondary)' }}>
                Notre mission est de former, accompagner et insérer durablement les jeunes et les professionnels dans le monde du travail en leur offrant des formations pratiques, certifiantes et adaptées aux besoins réels des entreprises.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-card p-8 md:p-10 rounded-[2rem] border-galf-yellow/20">
                <h3 className="text-sm font-black mb-8 text-galf-yellow uppercase tracking-[0.2em] text-center">Nous nous engageons à :</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Développer les compétences techniques et professionnelles de nos apprenants ;",
                    "Fournir des formations de qualité répondant aux exigences du marché de l'emploi ;",
                    "Faciliter l'insertion professionnelle grâce à des partenariats avec les entreprises ;",
                    "Accompagner les organisations dans le renforcement des capacités de leurs collaborateurs ;",
                    "Promouvoir l'excellence, la sécurité au travail et le professionnalisme ;",
                    "Contribuer au développement économique et social de la Côte d'Ivoire et de l'Afrique par la formation et l'emploi."
                  ].map((commitment, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-lg bg-galf-yellow/10 flex items-center justify-center shrink-0 mt-0.5 border border-galf-yellow/20">
                        <CheckCircle2 className="w-4 h-4 text-galf-yellow" />
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{commitment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="w-16 h-[1px] bg-galf-border mx-auto my-16" />

          <FadeIn>
            <h2 className="text-3xl font-black mb-16 text-center" style={{ color: 'var(--galf-text)' }}>
              Nos <span className="text-galf-yellow">Valeurs</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Briefcase, t: "Professionnalisme", p: "Le respect des normes et l'éthique dans toutes nos interventions." },
              { icon: Award, t: "Excellence", p: "La recherche constante de la qualité et de la performance." },
              { icon: ShieldCheck, t: "Discipline", p: "La rigueur et l'auto-discipline au cœur de l'apprentissage." },
              { icon: Scale, t: "Intégrité", p: "L'honnêteté, la transparence et la droiture au quotidien." },
              { icon: Users, t: "Respect", p: "La considération envers chaque apprenant, collaborateur et partenaire." },
              { icon: Lightbulb, t: "Innovation", p: "L'adaptation et le développement d'outils pédagogiques modernes." },
              { icon: Network, t: "Esprit d'équipe", p: "La force du collectif pour atteindre nos objectifs." },
              { icon: Target, t: "Engagement", p: "L'implication totale pour la réussite de nos apprenants." },
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.05} direction="up">
                <div className="glass-card p-6 rounded-xl text-center h-full hover:border-galf-yellow/30 transition-colors flex flex-col justify-center items-center">
                  <val.icon className="w-10 h-10 text-galf-yellow mb-4" />
                  <h3 className="text-lg font-black mb-2" style={{ color: 'var(--galf-text)' }}>{val.t}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{val.p}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Formations & Programmes */}
      <div className="py-24" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>Formations & <span className="text-galf-yellow">Programmes</span></h2>
              <p className="max-w-2xl mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>
                Les formations allient théorie et pratique intensive sur matériel réel ou pédagogique. Chaque parcours vise une insertion facilitée avec stage en entreprise et suivi professionnel.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.1} className="glass-card p-6 rounded-xl border-l-4 border-l-galf-yellow">
              <h3 className="text-xl font-black mb-3">Engins de chantier & mines</h3>
              <p className="text-sm opacity-80">Excavatrices, bulldozers, niveleuses, chargeuses, grues, tombereaux, etc.</p>
            </FadeIn>
            <FadeIn delay={0.2} className="glass-card p-6 rounded-xl border-l-4 border-l-galf-yellow">
              <h3 className="text-xl font-black mb-3">Manutention & logistique</h3>
              <p className="text-sm opacity-80">Chariots élévateurs (caristes), gerbeurs et équipements de levage.</p>
            </FadeIn>
            <FadeIn delay={0.3} className="glass-card p-6 rounded-xl border-l-4 border-l-galf-yellow">
              <h3 className="text-xl font-black mb-3">Transport poids lourds</h3>
              <p className="text-sm opacity-80">Sensibilisation sécurité routière et exploitation logistique.</p>
            </FadeIn>
            <FadeIn delay={0.4} className="glass-card p-6 rounded-xl border-l-4 border-l-galf-yellow">
              <h3 className="text-xl font-black mb-3">HSE</h3>
              <p className="text-sm opacity-80">Hygiène, sécurité et environnement, prévention des risques et bonnes pratiques sur chantier.</p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* GALF Connect & Conference */}
      <div className="py-24" style={{ background: 'var(--galf-bg)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>L'Écosystème <span className="text-galf-yellow">GALF Connect</span></h2>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.1} className="glass-card p-8 rounded-2xl border border-galf-yellow/20 relative overflow-hidden group hover:border-galf-yellow/50 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Network className="w-32 h-32 text-galf-yellow" /></div>
              <h3 className="text-2xl font-black mb-4 text-galf-yellow">La Plateforme</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--galf-text-secondary)' }}>
                Profils apprenants (CV, certifications) visibles par les entreprises partenaires, diffusion d’offres d’emploi, invitations à des événements, réservations d’entretiens et animation de la communauté alumni.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.2} className="glass-card p-8 rounded-2xl border border-galf-yellow/20 relative overflow-hidden group hover:border-galf-yellow/50 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Calendar className="w-32 h-32 text-galf-yellow" /></div>
              <h3 className="text-2xl font-black mb-4 text-galf-yellow">La Conférence</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--galf-text-secondary)' }}>
                Rendez-vous national prévu les <strong>11–12 juin 2026 à Abidjan</strong>, réunissant opérateurs d’engins, entreprises BTP, experts sécurité et institutions, avec panels, ateliers, démonstrations et espace recrutement.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Partenariats & Perspectives */}
      <div className="py-24" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)', borderBottom: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <div className="grid md:grid-cols-2 gap-16">
            <FadeIn>
              <h3 className="text-2xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>Partenariats & Reconnaissance</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--galf-text-secondary)' }}>
                GALF Formation est <strong>agréé par les autorités compétentes</strong> et collabore avec des entreprises du BTP, de l’industrie et de la logistique pour co-construire des modules, proposer des stages et déboucher sur des embauches.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                Des partenariats à vocation sociale et internationale renforcent l’impact du groupe en offrant des alternatives professionnelles locales et viables aux jeunes.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>Perspectives d’Avenir</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--galf-text-secondary)' }}>
                Le groupe poursuit son expansion et l’innovation pédagogique (simulateurs, e-learning), consolide la plateforme GALF Connect et ambitionne d’étendre son réseau de centres en Afrique de l’Ouest.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                <strong>Objectif :</strong> former des professionnels compétents, accélérer l’insertion et contribuer au développement des secteurs clés de l’économie.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20" style={{ background: 'var(--galf-carbon)' }}>
        <div className="container-galf text-center">
          <FadeIn>
            <h2 className="text-4xl font-black mb-4 text-white">
              GALF Formation : aujourd’hui tu apprends, <span className="text-galf-yellow">demain tu construis l’avenir.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-lg font-black hover:brightness-110 transition-all shadow-md">S'inscrire Maintenant</Link>
              <Link href="/contact" className="glass-card px-8 py-4 rounded-lg font-bold hover:border-galf-yellow/30 transition-all text-white border-white/20">Nous contacter</Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
