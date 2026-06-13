"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { 
  ShieldCheck, Target, Users, Award, Calendar, Briefcase, Network, 
  CheckCircle2, Scale, Lightbulb, Sparkles, UserCheck, Smile 
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'
import { useState } from 'react'

export default function About() {
  // ── Wave 5: About Us Interactive Feature States ──
  const [activeJalonIdx, setActiveJalonIdx] = useState(0)

  // Feature 90: Team Board Member
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number | null>(null)
  const teamMembers = [
    { name: "Dr. Marc Koffi", role: "Directeur Général", spec: "Stratégie & Logistique", badge: "Gouvernance", bio: "Plus de 15 ans d'expérience dans l'organisation des centres de formation en Afrique de l'Ouest." },
    { name: "Ing. Bamba Yacouba", role: "Directeur Pédagogique", spec: "Génie Civil & Levage", badge: "Instructeur Chef", bio: "Ancien grutier certifié international. Supervise tous les examens CACES du groupe." },
    { name: "Mme. Sidibé Assetou", role: "Responsable RSE & Insertion", spec: "Partenariats & Emplois", badge: "Accompagnement", bio: "Coordonne l'insertion directe des diplômés GALF avec notre réseau de 50+ entreprises." },
    { name: "M. Yao Kouassi", role: "Instructeur Principal Engins", spec: "Excavation & Terrassement", badge: "Pelle & Bulldozer", bio: "Expert en conduite préventive et VGP d'engins lourds de chantier BTP." }
  ]

  // Feature 91: Test Alignement des Valeurs
  const [activeValueTest, setActiveValueTest] = useState<string | null>(null)
  const [valueTestAnswer, setValueTestAnswer] = useState<boolean | null>(null)

  // Feature 92: Impact Simulator
  const [simApprenants, setSimApprenants] = useState(1500)
  const [simFeminin, setSimFeminin] = useState(15) // 15% women
  const [simHeures, setSimHeures] = useState(40) // average safety hours

  const playSynthBeep = (type: 'success' | 'warn' | 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, now)
        gain.gain.setValueAtTime(0.03, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
      } else if (type === 'warn') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(220, now)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, now)
        gain.gain.setValueAtTime(0.015, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
      }
      setTimeout(() => ctx.close(), 300)
    } catch(e){}
  }
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
            <h2 className="text-3xl font-black mb-16 text-center" style={{ color: 'var(--galf-text)' }}>
              Historique & <span className="text-galf-yellow">Jalons Clés</span>
            </h2>
          </FadeIn>
          <div className="max-w-4xl mx-auto">
            {/* Year Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { year: "2022", title: "Fondation & Lancement" },
                { year: "2023", title: "Maillage Territorial" },
                { year: "2024", title: "Partenariats B2B" },
                { year: "2025", title: "GALF Connect" },
                { year: "2026", title: "Conférence Nationale" }
              ].map((jalon, i) => (
                <button
                  key={i}
                  onClick={() => { playSynthBeep('click'); setActiveJalonIdx(i); }}
                  className={`px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                    activeJalonIdx === i 
                      ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-lg' 
                      : 'hover:border-galf-yellow'
                  }`}
                  style={{
                    background: activeJalonIdx !== i ? 'var(--galf-bg)' : undefined,
                    borderColor: activeJalonIdx !== i ? 'var(--galf-border)' : undefined,
                    color: activeJalonIdx !== i ? 'var(--galf-text-secondary)' : undefined
                  }}
                >
                  <span className="text-sm font-black">{jalon.year}</span>
                  <span className="text-[8px] opacity-75 font-normal">{jalon.title}</span>
                </button>
              ))}
            </div>

            {/* Jalon detail Card */}
            <div className="glass-card p-6 md:p-8 rounded-2xl text-left animate-fadeIn" style={{ background: 'var(--galf-yellow-glow)', borderColor: 'var(--galf-border)' }}>
              {[
                { year: "2022", t: "Fondation à Abidjan", desc: "Création de GALF avec l'ambition de restructurer la formation aux engins lourds. Inauguration du plateau technique d'Abidjan Yopougon et certification des premiers instructeurs d'État. Lancement de la première cohorte d'élèves.", details: "🎯 Objectif : 100% de réussite pratique. Cabines équipées, formateurs qualifiés et habilitations agréées." },
                { year: "2023", t: "Déploiement National", desc: "Création d'une antenne stratégique à San Pedro pour accompagner le développement portuaire et industriel du Sud-Ouest. Achat de simulateurs hydrauliques de dernière génération pour réduire les risques de prise de poste.", details: "🚜 Flotte : Ajout de compacteurs et grues mobiles au parc. Intégration de la formation théorique e-learning." },
                { year: "2024", t: "Hub Partenaires & Mines", desc: "Établissement de partenariats majeurs avec des entreprises de génie civil et d'extraction minière. Lancement des programmes de parrainage de bourses pour les jeunes en difficulté.", details: "💼 Emploi : Taux d'insertion immédiate de 70% constaté sur la cohorte annuelle." },
                { year: "2025", t: "Digitalisation & GALF Connect", desc: "Création du portail numérique GALF Connect permettant aux recruteurs de vérifier la validité des CACES et d'embaucher instantanément les meilleurs diplômés.", details: "💻 Innovation : Modules de sécurité en réalité virtuelle lancés en avant-première." },
                { year: "2026", t: "Consolidation & Conférence", desc: "Organisation de la 1ère Conférence Nationale des Conducteurs d'Engins de Côte d'Ivoire. Présentation des bilans d'impact RSE et expansion vers de nouvelles certifications environnementales (éco-conduite).", details: "🌟 Futur : Objectif de former 3000 conducteurs d'élite d'ici fin 2026." }
              ].map((item, idx) => {
                if (idx !== activeJalonIdx) return null
                return (
                  <div key={idx} className="space-y-4">
                    <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--galf-border)' }}>
                      <h4 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--galf-text)' }}>{item.t}</h4>
                      <span className="text-lg font-black text-galf-yellow">{item.year}</span>
                    </div>
                    <p className="text-xs leading-relaxed font-semibold" style={{ color: 'var(--galf-text-secondary)' }}>{item.desc}</p>
                    <div className="p-3 rounded-xl text-[10px] flex items-center gap-2" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>
                      <Sparkles className="w-4 h-4 text-galf-yellow shrink-0 animate-pulse" />
                      <span>{item.details}</span>
                    </div>
                  </div>
                )
              })}
            </div>
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

      {/* ═══════════════════════════════════════════════
          EQUIPE & IMPACT SOCIAL INTERACTIF (FEATURES 90-92)
         ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            
            {/* COLUMN 1: Trombinoscope & Valeurs */}
            <div className="space-y-8 flex flex-col justify-between">
              
              {/* Feature 90: Trombinoscope d'Équipe Interactif */}
              <div className="glass-card p-8 rounded-[2rem] flex-1">
                <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <Users className="w-5 h-5 text-galf-yellow animate-pulse" /> Équipe de Direction &amp; Formateurs
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                  Découvrez l'équipe pédagogique et administrative de GALF. Cliquez sur un membre pour voir sa fiche d'expertise.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {teamMembers.map((member, idx) => (
                    <button
                      key={idx}
                      onClick={() => { playSynthBeep('click'); setSelectedMemberIdx(idx); }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedMemberIdx === idx 
                          ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow font-black' 
                          : 'hover:border-galf-yellow'
                      }`}
                      style={{
                        background: selectedMemberIdx !== idx ? 'var(--galf-bg)' : undefined,
                        borderColor: selectedMemberIdx !== idx ? 'var(--galf-border)' : undefined,
                        color: selectedMemberIdx !== idx ? 'var(--galf-text-secondary)' : undefined
                      }}
                    >
                      <h4 className="text-xs font-black">{member.name}</h4>
                      <p className="text-[10px] text-galf-yellow/80 mt-1">{member.role}</p>
                    </button>
                  ))}
                </div>

                {selectedMemberIdx !== null && (
                  <div className="p-4 rounded-2xl animate-fadeIn space-y-2" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                    <span className="text-[9px] font-black uppercase text-galf-yellow bg-galf-yellow/10 border border-galf-yellow/20 px-2 py-0.5 rounded">
                      {teamMembers[selectedMemberIdx].badge}
                    </span>
                    <h4 className="text-sm font-black mt-2" style={{ color: 'var(--galf-text)' }}>{teamMembers[selectedMemberIdx].name}</h4>
                    <p className="text-[11px] font-bold" style={{ color: 'var(--galf-text-secondary)' }}>Domaine : {teamMembers[selectedMemberIdx].spec}</p>
                    <p className="text-xs leading-relaxed italic mt-1" style={{ color: 'var(--galf-text-muted)' }}>{teamMembers[selectedMemberIdx].bio}</p>
                  </div>
                )}
              </div>

              {/* Feature 91: Test d'Alignement des Valeurs GALF */}
              <div className="glass-card p-8 rounded-[2rem]">
                <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  <ShieldCheck className="w-5 h-5 text-galf-yellow" /> Test d'Alignement des Valeurs GALF
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                  Évaluez vos réflexes de sécurité et de discipline par rapport à la charte d'éthique de GALF.
                </p>

                {!activeValueTest ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'safety', label: 'Sécurité' },
                      { id: 'discipline', label: 'Discipline' },
                      { id: 'integrity', label: 'Intégrité' }
                    ].map(val => (
                      <button
                        key={val.id}
                        onClick={() => { playSynthBeep('click'); setActiveValueTest(val.id); setValueTestAnswer(null); }}
                        className="py-2.5 px-2 rounded-xl border text-[10px] font-black uppercase transition-all hover:border-galf-yellow"
                        style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                      >
                        {val.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="animate-fadeIn space-y-4">
                    {activeValueTest === 'safety' && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Scénario Sécurité :</span>
                        <h4 className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>Vous constatez un défaut de graissage sur les chenilles avant de démarrer. Que faites-vous ?</h4>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => { playSynthBeep('warn'); setValueTestAnswer(false); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] ${valueTestAnswer === false ? 'bg-red-500/10 border-red-500 text-red-500 font-bold' : ''}`}
                            style={{
                              background: valueTestAnswer !== false ? 'var(--galf-bg)' : undefined,
                              borderColor: valueTestAnswer !== false ? 'var(--galf-border)' : undefined,
                              color: valueTestAnswer !== false ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            ❌ Je démarre quand même pour ne pas perdre de temps
                          </button>
                          <button
                            onClick={() => { playSynthBeep('success'); setValueTestAnswer(true); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] ${valueTestAnswer === true ? 'bg-green-500/10 border-green-500 text-green-600 font-bold' : ''}`}
                            style={{
                              background: valueTestAnswer !== true ? 'var(--galf-bg)' : undefined,
                              borderColor: valueTestAnswer !== true ? 'var(--galf-border)' : undefined,
                              color: valueTestAnswer !== true ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            ✅ Je consigne l'engin et j'avertis le chef de garage immédiatement
                          </button>
                        </div>
                      </div>
                    )}

                    {activeValueTest === 'discipline' && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Scénario Discipline :</span>
                        <h4 className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>Un retard indépendant de votre volonté survient lors d'une session de TP de levage.</h4>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => { playSynthBeep('warn'); setValueTestAnswer(false); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] ${valueTestAnswer === false ? 'bg-red-500/10 border-red-500 text-red-500 font-bold' : ''}`}
                            style={{
                              background: valueTestAnswer !== false ? 'var(--galf-bg)' : undefined,
                              borderColor: valueTestAnswer !== false ? 'var(--galf-border)' : undefined,
                              color: valueTestAnswer !== false ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            ❌ Je rentre discrètement sur le plateau technique sans prévenir personne
                          </button>
                          <button
                            onClick={() => { playSynthBeep('success'); setValueTestAnswer(true); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] ${valueTestAnswer === true ? 'bg-green-500/10 border-green-500 text-green-600 font-bold' : ''}`}
                            style={{
                              background: valueTestAnswer !== true ? 'var(--galf-bg)' : undefined,
                              borderColor: valueTestAnswer !== true ? 'var(--galf-border)' : undefined,
                              color: valueTestAnswer !== true ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            ✅ Je m'excuse et je signale mon arrivée à l'instructeur principal
                          </button>
                        </div>
                      </div>
                    )}

                    {activeValueTest === 'integrity' && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Scénario Intégrité :</span>
                        <h4 className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>Un camarade vous propose de falsifier votre heure de début sur simulateur pour partir plus tôt.</h4>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => { playSynthBeep('warn'); setValueTestAnswer(false); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] ${valueTestAnswer === false ? 'bg-red-500/10 border-red-500 text-red-500 font-bold' : ''}`}
                            style={{
                              background: valueTestAnswer !== false ? 'var(--galf-bg)' : undefined,
                              borderColor: valueTestAnswer !== false ? 'var(--galf-border)' : undefined,
                              color: valueTestAnswer !== false ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            ❌ J'accepte, le principal est que je sache manipuler les manettes
                          </button>
                          <button
                            onClick={() => { playSynthBeep('success'); setValueTestAnswer(true); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] ${valueTestAnswer === true ? 'bg-green-500/10 border-green-500 text-green-600 font-bold' : ''}`}
                            style={{
                              background: valueTestAnswer !== true ? 'var(--galf-bg)' : undefined,
                              borderColor: valueTestAnswer !== true ? 'var(--galf-border)' : undefined,
                              color: valueTestAnswer !== true ? 'var(--galf-text-secondary)' : undefined
                            }}
                          >
                            ✅ Je refuse et je respecte scrupuleusement mes 10h obligatoires
                          </button>
                        </div>
                      </div>
                    )}

                    {valueTestAnswer !== null && (
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black uppercase">
                          {valueTestAnswer ? "🎉 Alignement parfait !" : "⚠️ Réflexe à corriger"}
                        </span>
                        <button
                          onClick={() => { playSynthBeep('click'); setActiveValueTest(null); setValueTestAnswer(null); }}
                          className="bg-galf-yellow text-galf-carbon text-[9px] font-black uppercase px-3 py-1.5 rounded-lg hover:brightness-110"
                        >
                          Retour
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* COLUMN 2: Impact social simulator */}
            <div className="space-y-8 flex flex-col justify-between">
              
              {/* Feature 92: Simulateur d'Impact Socio-Économique */}
              <div className="glass-card p-8 rounded-[2rem] flex-1 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[6rem]" />
                <div>
                  <h3 className="text-xl font-black mb-2 flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                    <Target className="w-5 h-5 text-galf-yellow" /> Simulateur d'Impact Social GALF Connect
                  </h3>
                  <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                    Ajustez les curseurs de formation pour projeter l'impact de l'insertion et de la féminisation en Afrique de l'Ouest.
                  </p>

                  <div className="space-y-4 text-xs">
                    {/* Apprenants slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center" style={{ color: 'var(--galf-text-secondary)' }}>
                        <span>Objectif apprenants formés :</span>
                        <span className="font-black" style={{ color: 'var(--galf-text)' }}>{simApprenants} jeunes</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={simApprenants}
                        onChange={(e) => { playSynthBeep('click'); setSimApprenants(Number(e.target.value)); }}
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                        style={{ background: 'var(--galf-border)' }}
                      />
                    </div>

                    {/* Feminin slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center" style={{ color: 'var(--galf-text-secondary)' }}>
                        <span>Taux de féminisation ciblé :</span>
                        <span className="font-black" style={{ color: 'var(--galf-text)' }}>{simFeminin}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={simFeminin}
                        onChange={(e) => { playSynthBeep('click'); setSimFeminin(Number(e.target.value)); }}
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                        style={{ background: 'var(--galf-border)' }}
                      />
                    </div>

                    {/* Safety Hours slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center" style={{ color: 'var(--galf-text-secondary)' }}>
                        <span>Heures de pratique préventive / élève :</span>
                        <span className="font-black" style={{ color: 'var(--galf-text)' }}>{simHeures} heures</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={simHeures}
                        onChange={(e) => { playSynthBeep('click'); setSimHeures(Number(e.target.value)); }}
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                        style={{ background: 'var(--galf-border)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 text-center mt-6" style={{ borderTop: '1px solid var(--galf-border)' }}>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                    <span className="text-[8px] block uppercase font-black" style={{ color: 'var(--galf-text-muted)' }}>Emplois Directs</span>
                    <span className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>{Math.round(simApprenants * 0.82)}</span>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                    <span className="text-[8px] block uppercase font-black" style={{ color: 'var(--galf-text-muted)' }}>Insertion %</span>
                    <span className="text-xs font-black text-galf-yellow">{Math.min(98, Math.round(70 + (simHeures * 0.3)))}%</span>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)' }}>
                    <span className="text-[8px] block uppercase font-black" style={{ color: 'var(--galf-text-muted)' }}>Femmes Qualifiées</span>
                    <span className="text-xs font-black" style={{ color: 'var(--galf-text)' }}>{Math.round(simApprenants * (simFeminin / 100))}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

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
