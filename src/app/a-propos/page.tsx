"use client"
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { ShieldCheck, Target, Users, MapPin, Award, Clock, TrendingUp } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG - Foreuse for "Deep Roots/History" */}
      <div className="absolute right-[-10%] top-[0%] w-[800px] h-[800px] opacity-[0.03] pointer-events-none z-0">
        <AnimatedMachineHeader type="foreuse" />
      </div>

      {/* Hero */}
      <div className="container-galf mb-24 relative z-10">
        <FadeIn>
          <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Qui sommes-nous</div>
          <TextReveal 
            text="L'EXCELLENCE INDUSTRIELLE" 
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-white" 
          />
          <p className="text-xl max-w-3xl leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
            GALF FORMATION a été créé avec une vision claire : combler le fossé entre la théorie classique et les exigences réelles des chantiers modernes en Côte d'Ivoire et en Afrique de l'Ouest.
          </p>
        </FadeIn>
      </div>

      {/* Story */}
      <div className="container-galf mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl" style={{ border: '1px solid var(--galf-border)' }}>
            <img src="/images/engins/pelle-hydraulique.png" alt="Centre GALF Formation" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">Depuis 2018</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <h2 className="text-3xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>Notre Histoire, Notre Mission</h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--galf-text-secondary)' }}>
              Né du constat que les entreprises du BTP et de l'extraction minière peinaient à recruter des opérateurs qualifiés et immédiatement opérationnels, GALF a investi dans un véritable centre d'apprentissage par la pratique.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
              Aujourd'hui, nous disposons d'une flotte d'engins lourds récents et d'une équipe d'instructeurs cumulant des décennies d'expérience sur les plus grands chantiers du continent.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "1500+", l: "Opérateurs formés" },
                { n: "50+", l: "Entreprises partenaires" },
                { n: "98%", l: "Taux de réussite" },
              ].map((s, i) => (
                <div key={i} className="glass-card p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-galf-yellow">{s.n}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--galf-text-muted)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Values */}
      <div className="py-24" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)', borderBottom: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <FadeIn><h2 className="text-3xl font-black mb-16 text-center" style={{ color: 'var(--galf-text)' }}>Nos Valeurs <span className="text-galf-yellow">Fondamentales</span></h2></FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, t: "Sécurité Absolue", p: "Le standard zéro accident est le fondement de tous nos enseignements." },
              { icon: Target, t: "Pragmatisme", p: "80% de pratique terrain sur nos chantiers-écoles sécurisés." },
              { icon: Users, t: "Accompagnement", p: "De l'inscription à la recherche d'emploi, un suivi personnalisé." },
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="up">
                <div className="glass-card p-8 rounded-xl text-center h-full hover:border-galf-yellow/30 transition-colors">
                  <val.icon className="w-12 h-12 text-galf-yellow mx-auto mb-6" />
                  <h3 className="text-xl font-black mb-4" style={{ color: 'var(--galf-text)' }}>{val.t}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{val.p}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Implantations */}
      <div className="py-24" style={{ background: 'var(--galf-bg)' }}>
        <div className="container-galf">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Nos sites</div>
              <h2 className="text-3xl font-black" style={{ color: 'var(--galf-text)' }}>Nos <span className="text-galf-yellow">implantations</span></h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: "Abidjan", desc: "Siège social — Zone Industrielle de Yopougon", main: true },
              { city: "San Pedro", desc: "Centre régional Sud-Ouest", main: false },
              { city: "Bouaké", desc: "Centre régional Centre", main: false },
              { city: "Korhogo", desc: "Centre régional Nord", main: false },
            ].map((loc, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className={`glass-card p-6 rounded-xl h-full hover:border-galf-yellow/30 transition-colors ${loc.main ? 'border-galf-yellow/30' : ''}`}>
                  <MapPin className="w-6 h-6 text-galf-yellow mb-3" />
                  <h3 className="text-lg font-black mb-2" style={{ color: 'var(--galf-text)' }}>{loc.city}</h3>
                  <p className="text-sm" style={{ color: 'var(--galf-text-secondary)' }}>{loc.desc}</p>
                  {loc.main && <span className="inline-block mt-3 text-[10px] bg-galf-yellow text-galf-carbon font-black px-2 py-0.5 rounded-md uppercase">Siège</span>}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20" style={{ background: 'var(--galf-bg-alt)' }}>
        <div className="container-galf text-center">
          <FadeIn>
            <h2 className="text-3xl font-black mb-6" style={{ color: 'var(--galf-text)' }}>Rejoignez l'aventure <span className="text-galf-yellow">GALF</span></h2>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>Candidat, entreprise ou partenaire, découvrez comment collaborer avec nous.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-lg font-black hover:brightness-110 transition-all shadow-md">S'inscrire</Link>
              <Link href="/contact" className="glass-card px-8 py-4 rounded-lg font-bold hover:border-galf-yellow/30 transition-all" style={{ color: 'var(--galf-text)' }}>Nous contacter</Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
