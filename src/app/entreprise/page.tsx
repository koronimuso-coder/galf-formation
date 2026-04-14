"use client"
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { Briefcase, Users, FileText, Send, TrendingUp, CheckCircle2, Shield, ArrowRight, Star } from 'lucide-react'
import { useState } from 'react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function EntreprisePortal() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  const inputStyle = { background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }
  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute left-[-10%] top-0 w-[700px] h-[700px] opacity-10 pointer-events-none z-0">
        <AnimatedMachineHeader type="grue" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Partenaires corporate</div>
          <TextReveal 
            text="PORTAIL ENTREPRISES" 
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-white" 
          />
          <p className="text-xl max-w-3xl leading-relaxed mb-16" style={{ color: 'var(--galf-text-secondary)' }}>
            Formez vos équipes aux standards internationaux. GALF accompagne les professionnels du BTP et des mines dans la montée en compétence de leur personnel.
          </p>
        </FadeIn>

        {/* Advantages */}
        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: TrendingUp, t: "ROI garanti", d: "Des opérateurs formés = moins d'accidents, meilleure productivité et conformité réglementaire assurée." },
              { icon: Shield, t: "Normes HSE", d: "Toutes nos formations intègrent les normes HSE en vigueur, réduisant vos risques juridiques." },
              { icon: Users, t: "Sur-mesure", d: "Programmes adaptés à vos chantiers, votre parc d'engins et vos objectifs de performance." },
            ].map((adv, i) => (
              <div key={i} className="glass-card p-6 rounded-xl hover:border-galf-yellow/30 transition-colors">
                <adv.icon className="w-8 h-8 text-galf-yellow mb-4" />
                <h3 className="font-black text-lg mb-2" style={{ color: 'var(--galf-text)' }}>{adv.t}</h3>
                <p className="text-sm" style={{ color: 'var(--galf-text-secondary)' }}>{adv.d}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12">
          <FadeIn delay={0.2}>
            <h2 className="text-3xl font-black mb-8" style={{ color: 'var(--galf-text)' }}>Solutions <span className="text-galf-yellow">B2B</span></h2>
            <div className="space-y-6">
              {[
                { icon: Users, t: "Formations Intra-entreprise", d: "Nous déployons nos équipements et instructeurs directement sur vos sites d'exploitation." },
                { icon: FileText, t: "Devis Groupé", d: "Tarification dégressive pour l'inscription de plusieurs collaborateurs à nos sessions." },
                { icon: Briefcase, t: "Partenariat Recrutement", d: "Accédez en priorité aux profils les mieux formés de nos promotions pour vos recrutements." },
              ].map((b, i) => (
                <div key={i} className="glass-card p-6 rounded-xl flex gap-4 hover:border-galf-yellow/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-2" style={{ color: 'var(--galf-text)' }}>{b.t}</h3>
                    <p className="text-sm" style={{ color: 'var(--galf-text-secondary)' }}>{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="glass-card p-8 rounded-xl relative overflow-hidden border-galf-yellow/20">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3" style={{ color: 'var(--galf-text)' }}>
                <Briefcase className="text-galf-yellow" /> Pôle B2B
              </h2>
              {submitted ? (
                <div className="text-center p-12 bg-galf-yellow/10 rounded-2xl border border-galf-yellow/30 mt-8">
                  <CheckCircle2 className="w-16 h-16 text-galf-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--galf-text)' }}>Demande Envoyée</h3>
                  <p style={{ color: 'var(--galf-text-secondary)' }}>Notre équipe commerciale vous contactera sous 24h.</p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ l: "Entreprise", p: "Nom de l'entreprise" }, { l: "Contact", p: "Votre nom" }].map((f, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>{f.l}</label>
                        <input required type="text" placeholder={f.p} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Email professionnel</label>
                    <input required type="email" placeholder="email@entreprise.com" className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Nombre de collaborateurs</label>
                    <select className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle}>
                      <option>1-5</option><option>6-15</option><option>16-30</option><option>30+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Besoin</label>
                    <select className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={inputStyle}>
                      <option>Devis groupé</option><option>Formation sur site (Intra)</option><option>Partenariat recrutement</option><option>Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Détails</label>
                    <textarea rows={4} placeholder="Précisez engins, calendrier, etc." className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow resize-none" style={inputStyle}></textarea>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                    <Send className="w-5 h-5" /> {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
        {/* Recruitment Teaser - NEW PREMIUM FEATURE */}
        <FadeIn delay={0.4}>
          <div className="mt-32 p-12 rounded-[2.5rem] relative overflow-hidden glass-card border-galf-yellow/20">
             <div className="absolute top-0 right-0 w-[40%] h-full bg-galf-yellow/5 skew-x-12 translate-x-32" />
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-galf-yellow/10 border border-galf-yellow/30 rounded-full text-galf-yellow text-[10px] font-black uppercase tracking-widest mb-6">
                      <Star className="w-3 h-3 fill-current" /> Sourcing de Talents
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                      Recrutez l'élite du <span className="text-galf-yellow">BTP ivoirien</span>
                   </h2>
                   <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--galf-text-secondary)' }}>
                      Accédez à notre base de données d'apprenants certifiés. Filtrez par engin, niveau d'expérience et disponibilité pour vos chantiers stratégiques.
                   </p>
                   <ul className="space-y-4 mb-10">
                      {[ 
                        "Vérification instantanée des certificats GALF", 
                        "Accès aux notes de conduite technique (Théorie & Pratique)", 
                        "Contact direct avec les meilleurs profils de chaque promo"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold text-sm" style={{ color: 'var(--galf-text)' }}>
                           <CheckCircle2 className="w-5 h-5 text-galf-yellow" /> {item}
                        </li>
                      ))}
                   </ul>
                   <Link href="/entreprise/recrutement" className="bg-white text-galf-carbon px-12 py-5 rounded-2xl font-black text-lg hover:bg-galf-yellow transition-all flex items-center justify-center gap-3 shrink-0">
                      Accéder au Hub Recruteur <ArrowRight className="w-5 h-5" />
                   </Link>
                </div>

                <div className="relative group">
                   {/* Fake Talent Dashboard Preview */}
                   <div className="glass-card p-6 rounded-2xl border-white/5 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700 bg-galf-carbon/80 backdrop-blur-md">
                      <div className="flex items-center justify-between mb-8">
                         <div className="text-xs font-black uppercase tracking-widest text-galf-text-muted">Candidats certifiés dispo.</div>
                         <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full bg-galf-yellow/20 border-2" style={{ borderColor: 'var(--galf-border)' }} />
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         {[
                           { name: "Yao Anderson", job: "Opérateur Pelle", score: "18.5/20", tag: "Expert" },
                           { name: "Diarra Moussa", job: "Grutier à Tour", score: "17.0/20", tag: "Confirmé" },
                           { name: "Koné Fatou", job: "Conductrice Bulldozer", score: "19.0/20", tag: "Major Promo" },
                         ].map((c, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-white/5 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-lg bg-galf-yellow flex items-center justify-center font-black text-galf-carbon">{c.name[0]}</div>
                                 <div>
                                    <div className="text-sm font-black text-white">{c.name}</div>
                                    <div className="text-[10px] font-bold text-galf-yellow uppercase">{c.job}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-xs font-black text-white">{c.score}</div>
                                 <span className="text-[8px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/60">{c.tag}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/5 text-center">
                         <span className="text-[10px] font-bold text-galf-text-muted uppercase tracking-[0.2em]">+ 128 autres candidats disponibles</span>
                      </div>
                   </div>
                   {/* Decorative floating icon */}
                   <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-galf-yellow rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <TrendingUp className="w-10 h-10 text-galf-carbon" />
                   </div>
                </div>
             </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
