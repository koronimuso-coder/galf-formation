"use client"
import Link from 'next/link'
import { ArrowRight, HardHat, Trophy, Award, MapPin, Star, ChevronRight, Play, Clock, Shield, Users, BookOpen, Search, ArrowUpRight, BarChart3 } from 'lucide-react'
import { FadeIn, AnimatedCounter, MagneticHover, TextReveal } from '@/components/animations/FadeIn'
import { HeroScene } from '@/components/3d/HeroScene'
import { GALF_FORMATIONS } from '@/lib/data'
import { MachineSpecsModal } from '@/components/3d/MachineSpecsModal'
import { useState } from 'react'

export default function Home() {
  const [activeMachine, setActiveMachine] = useState<{slug: string, name: string, img: string} | null>(null)
  const featured = GALF_FORMATIONS.filter(f => f.featured).slice(0, 6)

  /* 🏗️ Engins BTP avec images 3D réalistes générées */
  const equipmentImages = [
    { name: "Pelle Hydraulique", img: "/images/engins/pelle-hydraulique.png", cat: "Engins de chantier", desc: "L'engin roi des chantiers de terrassement" },
    { name: "Grue à Tour", img: "/images/engins/grue-tour.png", cat: "Levage", desc: "La pièce maîtresse des constructions en hauteur" },
    { name: "Bulldozer", img: "/images/engins/bulldozer.png", cat: "Engins de chantier", desc: "La puissance brute du terrassement de masse" },
    { name: "Chariot Élévateur", img: "/images/engins/chariot-elevateur.png", cat: "Logistique", desc: "Manutention de précision en entrepôt" },
    { name: "Chargeuse", img: "/images/engins/chargeuse.png", cat: "Engins de chantier", desc: "Chargement et transport de matériaux" },
    { name: "Grue Mobile", img: "/images/engins/grue-mobile.png", cat: "Levage", desc: "Levage mobile de haute précision" },
    { name: "Tombereau Rigide", img: "/images/engins/tombereau-rigide.png", cat: "Mine", desc: "Le géant des carrières minières" },
    { name: "Tractopelle", img: "/images/engins/tractopelle.png", cat: "Engins de chantier", desc: "L'engin polyvalent par excellence" },
  ]

  /* Map formation image by slug */
  const formationImg = (slug: string) => {
    const map: Record<string, string> = {
      'pelle-hydraulique': '/images/engins/pelle-hydraulique.png',
      'grue-tour': '/images/engins/grue-tour.png',
      'bulldozer': '/images/engins/bulldozer.png',
      'chariot-elevateur': '/images/engins/chariot-elevateur.png',
      'chargeuse': '/images/engins/chargeuse.png',
      'grue-mobile': '/images/engins/grue-mobile.png',
      'tombereau-rigide': '/images/engins/tombereau-rigide.png',
      'tractopelle': '/images/engins/tractopelle.png',
    }
    return map[slug] || '/images/engins/pelle-hydraulique.png'
  }

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════
          HERO — Cinematic
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden noise-overlay" style={{ background: 'var(--galf-bg)' }}>
        <HeroScene />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, var(--galf-bg), transparent 60%)' }} />
        <div className="absolute inset-0 z-10" style={{ background: 'var(--galf-hero-overlay-grad)' }} />

        <div className="container-galf relative z-20 pt-32 pb-20">
          <div className="max-w-4xl">
            <FadeIn delay={0.3}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-galf-yellow/10 border border-galf-yellow/30 rounded-full text-galf-yellow text-xs font-bold tracking-[0.2em] uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-galf-yellow animate-pulse" />
                Centre d'Excellence BTP & Mines — Côte d'Ivoire
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <TextReveal 
                text="FORGEZ VOTRE DESTIN DANS LE BTP" 
                className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 text-white" 
              />
            </FadeIn>

            <FadeIn delay={0.7}>
              <p className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                Maîtrisez les géants de fer. Avec <strong style={{ color: 'var(--galf-text)' }}>GALF FORMATION</strong>, transformez votre ambition en expertise certifiée. Equipements de pointe, instructeurs vétérans.
              </p>
            </FadeIn>

            <FadeIn delay={0.9} className="flex flex-col sm:flex-row gap-6">
              <MagneticHover>
                <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-lg font-black text-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,176,0,0.2)]">
                  Je commence ma carrière <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticHover>
              <Link href="/formations" className="glass-card px-12 py-5 rounded-lg font-bold text-lg hover:border-galf-yellow/40 transition-all flex items-center justify-center gap-2" style={{ color: 'var(--galf-text)' }}>
                Nos 19 formations
              </Link>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="text-[10px] uppercase tracking-[0.5em] font-black opacity-40" style={{ color: 'var(--galf-text)' }}>Explore</div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-galf-yellow via-galf-yellow/50 to-transparent" />
        </div>
      </section>

      {/* ═══ TRUST BAR (PARTNERS) ═══ */}
      <section className="py-12 relative z-20" style={{ background: 'var(--galf-bg)', borderBottom: '1px solid var(--galf-border)' }}>
        <div className="container-galf">
          <div className="text-[10px] uppercase tracking-[0.4em] font-black text-center mb-8 opacity-40" style={{ color: 'var(--galf-text)' }}>Ils nous font confiance</div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simple high-end placeholder logos using text/lucide */}
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>SMB</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>GESTOCI</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>BTP-CI</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>MINES-SA</div>
             <div className="flex items-center gap-2 font-black text-xl italic" style={{ color: 'var(--galf-text)' }}>AFRIQUE-PESAGE</div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)', borderBottom: '1px solid var(--galf-border)' }}>
        <div className="absolute inset-0 bg-diagonal" />
        <div className="container-galf relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: 98, suf: '%', label: "Taux de réussite", icon: Trophy },
              { val: 1500, pre: '+', label: "Opérateurs formés", icon: Users },
              { val: 19, label: "Parcours certifiants", icon: Award },
              { val: 50, pre: '+', label: "Entreprises partenaires", icon: Star },
            ].map((s, i) => (
              <FadeIn key={i} delay={0.1 * i} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 group-hover:border-galf-yellow/50 transition-colors" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)' }}>
                  <s.icon className="w-6 h-6 text-galf-yellow" />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 text-glow-yellow" style={{ color: 'var(--galf-text)' }}>
                  <AnimatedCounter target={s.val} suffix={s.suf || ''} prefix={s.pre || ''} />
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--galf-text-secondary)' }}>{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NOS ENGINS BTP — 3D Gallery with REAL images
         ═══════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Parc de machines</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6" style={{ color: 'var(--galf-text)' }}>
                Nos engins <span className="text-galf-yellow">BTP en 3D</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>
                Formez-vous sur des machines professionnelles dans des conditions réelles de chantier.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentImages.map((eq, i) => {
              const slug = eq.name.toLowerCase().replace(/ /g, '-').replace(/à/g, 'a').replace(/é/g, 'e');
              return (
                <FadeIn key={i} delay={0.1 * i}>
                  <div className="perspective-container" onClick={() => setActiveMachine({ slug, name: eq.name, img: eq.img })}>
                    <div className="card-3d group relative h-[340px] rounded-xl overflow-hidden cursor-pointer" style={{ border: '1px solid var(--galf-border)' }}>
                      <img src={eq.img} alt={eq.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <div className="text-[10px] text-galf-yellow font-bold uppercase tracking-[0.3em] mb-1">{eq.cat}</div>
                        <h3 className="text-xl font-black text-white mb-1">{eq.name}</h3>
                        <p className="text-xs text-white/70">{eq.desc}</p>
                      </div>
                      <div className="absolute inset-0 bg-galf-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-galf-yellow/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                          <Play className="w-6 h-6 text-galf-carbon ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ FORMATIONS PHARES ═══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <div>
                <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Catalogue</div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                  Nos formations <span className="text-galf-yellow">phares</span>
                </h2>
              </div>
              <Link href="/formations" className="mt-6 md:mt-0 text-sm font-bold text-galf-yellow hover:underline flex items-center gap-2 uppercase tracking-widest">
                Voir les 19 formations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((f, i) => (
              <FadeIn key={f.id} delay={0.1 * i}>
                <Link href={`/formations/${f.slug}`} className="group block h-full">
                  <div className="glass-card rounded-xl overflow-hidden h-full hover:border-galf-yellow/30 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                    <div className="h-52 relative overflow-hidden shrink-0">
                      <img src={formationImg(f.slug)} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      {f.pricePromo && <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-black uppercase rounded-md animate-pulse">Promo</div>}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{f.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-black mb-2 group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{f.name}</h3>
                      <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: 'var(--galf-text-secondary)' }}>{f.shortDesc}</p>
                      <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--galf-text-muted)' }}>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.city}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--galf-border)' }}>
                        <div>
                          {f.pricePromo ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-galf-yellow">{f.pricePromo.toLocaleString('fr-FR')} F</span>
                              <span className="text-sm line-through" style={{ color: 'var(--galf-text-muted)' }}>{f.price.toLocaleString('fr-FR')}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-black text-galf-yellow">{f.price.toLocaleString('fr-FR')} F</span>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-galf-yellow group-hover:border-galf-yellow transition-colors" style={{ border: '1px solid var(--galf-border)' }}>
                          <ArrowRight className="w-4 h-4 group-hover:text-galf-carbon transition-colors" style={{ color: 'var(--galf-text-muted)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
        <div className="container-galf relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Avis certifiés</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                Ils ont <span className="text-galf-yellow">réussi avec nous</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Kouadio Jean", role: "Opérateur Pelle Hydraulique", content: "Grâce à GALF, j'ai pu passer de simple aide-ouvrier à conducteur certifié en 3 mois. La pratique est intense et le matériel est de dernière génération.", rating: 5 },
              { name: "Sylla Mariam", role: "Superviseur HSE", content: "Le centre de formation GALF est le plus sérieux de la région. L'accent mis sur la sécurité est impressionnant et les formateurs sont de vrais experts.", rating: 5 },
              { name: "Bamba Drissa", role: "Chef de chantier BTP", content: "Nous recrutons nos opérateurs en priorité chez GALF. On sait qu'ils arrivent sur le chantier en étant immédiatement productifs et respectueux des normes.", rating: 5 },
            ].map((t, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="glass-card p-8 rounded-2xl relative h-full">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-galf-yellow fill-galf-yellow" />)}
                  </div>
                  <p className="italic mb-8 font-medium leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-galf-yellow/20 flex items-center justify-center font-black text-galf-yellow">{t.name[0]}</div>
                    <div>
                      <div className="font-black" style={{ color: 'var(--galf-text)' }}>{t.name}</div>
                      <div className="text-xs font-bold" style={{ color: 'var(--galf-text-muted)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
        <div className="container-galf relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div className="sticky top-32">
                <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Questions fréquentes</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6" style={{ color: 'var(--galf-text)' }}>
                  Tout ce qu'il faut <span className="text-galf-yellow">savoir</span>
                </h2>
                <p className="max-w-md mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
                  Vous avez des questions sur nos formations, les tarifs ou les certificats ? Retrouvez les réponses ici ou contactez-nous directement.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
                  Consulter le centre d'aide <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {[
                  { q: "Quelles sont les conditions d'admission ?", a: "Il n'y a pas de prérequis académique strict pour la plupart de nos formations. Cependant, savoir lire et écrire est essentiel pour la partie théorique. Un test d'aptitude médicale peut être demandé pour les engins de levage." },
                  { q: "Comment se déroule le paiement ?", a: "Nous proposons des facilités de paiement flexibles. Un acompte de 30% est requis à l'inscription, et le solde peut être versé en 2 ou 3 mensualités durant la formation." },
                  { q: "Le certificat GALF est-il reconnu ?", a: "Oui, GALF est un centre agréé par l'État. Nos certificats sont reconnus par les grandes entreprises du BTP et des Mines en Côte d'Ivoire et dans la sous-région." },
                  { q: "Proposez-vous des stages après la formation ?", a: "Grâce à notre réseau de plus de 50 partenaires, nous facilitons l'insertion de nos apprenants. Les meilleurs noms de chaque promotion sont souvent recommandés directement." },
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-xl hover:border-galf-yellow/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="font-black text-sm" style={{ color: 'var(--galf-text)' }}>{item.q}</h3>
                       <ChevronRight className="w-4 h-4 text-galf-yellow group-hover:rotate-90 transition-transform" />
                    </div>
                    <p className="text-xs leading-relaxed opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500 overflow-hidden" style={{ color: 'var(--galf-text-secondary)' }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-40 relative overflow-hidden text-center noise-overlay" style={{ background: 'var(--galf-bg)' }}>
        <div className="container relative z-20 mx-auto px-4 max-w-3xl">
          <FadeIn>
            <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-6">Prêt à construire votre avenir ?</div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]" style={{ color: 'var(--galf-text)' }}>
              Passez du projet <span className="text-galf-yellow">à l'action</span>
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: 'var(--galf-text-secondary)' }}>
              Choisissez une formation, déposez votre dossier en ligne et entrez dans l'univers GALF.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <MagneticHover>
                <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-12 py-5 rounded-lg font-black text-lg hover:brightness-110 transition-all inline-flex items-center gap-3 shadow-lg">
                  Commencer mon inscription <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticHover>
              <Link href="/contact" className="glass-card px-12 py-5 rounded-lg font-bold text-lg hover:border-galf-yellow/40 inline-flex items-center justify-center" style={{ color: 'var(--galf-text)' }}>
                Nous contacter
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ MACHINE SPECS MODAL ═══ */}
      {activeMachine && (
        <MachineSpecsModal
          isOpen={!!activeMachine}
          onClose={() => setActiveMachine(null)}
          machineSlug={activeMachine.slug}
          machineName={activeMachine.name}
          machineImg={activeMachine.img}
        />
      )}
    </div>
  )
}
