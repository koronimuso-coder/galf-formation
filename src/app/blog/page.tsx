"use client"
import Link from 'next/link'
import { FadeIn } from '@/components/animations/FadeIn'
import { Calendar, User, Search, Award, Shield, Zap, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BlogPortal() {
  // ── Wave 5: Blog Interactive Feature States ──
  const [searchQuery, setSearchQuery] = useState('')
  
  // Feature 93: CPF Hours Calculator
  const [cpfHours, setCpfHours] = useState(40)
  
  // Feature 95: Newsletter
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)

  // Feature 96: Industry Survey
  const [votedChoice, setVotedChoice] = useState<number | null>(null)
  const [pollVotes, setPollVotes] = useState([128, 85, 142])

  const playBlogSound = (type: 'success' | 'click') => {
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
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(659.25, now + 0.1)
        gain.gain.setValueAtTime(0.03, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(450, now)
        gain.gain.setValueAtTime(0.015, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
      }
      setTimeout(() => ctx.close(), 300)
    } catch(e){}
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    playBlogSound('success')
    setSubscribed(true)
    setConfettiActive(true)
    setTimeout(() => setConfettiActive(false), 3000)
  }

  const handleVote = (idx: number) => {
    if (votedChoice !== null) return
    playBlogSound('success')
    setVotedChoice(idx)
    setPollVotes(prev => {
      const next = [...prev]
      next[idx] += 1
      return next
    })
  }
  const posts = [
    { slug: "nouvelles-normes-hse-2026", title: "Les nouvelles normes HSE dans le secteur minier en Afrique de l'Ouest", category: "Sécurité", date: "10 Avril 2026", author: "Équipe Pédagogique", img: "/images/formations/chargeuse.png", excerpt: "Découvrez les dernières évolutions réglementaires et comment GALF intègre ces normes dans ses formations." },
    { slug: "pourquoi-devenir-operateur-2026", title: "Pourquoi devenir opérateur de pelle hydraulique en 2026 ?", category: "Carrière", date: "05 Avril 2026", author: "Marc K.", img: "/images/formations/pelle-hydraulique.png", excerpt: "Le métier d'opérateur d'engins lourds offre des perspectives de carrière exceptionnelles en Afrique." },
    { slug: "importance-vgp", title: "L'importance de la Vérification Générale Périodique (VGP)", category: "Technique", date: "28 Mars 2026", author: "Service Technique", img: "/images/formations/grue-tour.png", excerpt: "La VGP est une obligation légale. Comprendre ses enjeux pour la sécurité et la conformité." },
    { slug: "nouveau-centre-san-pedro", title: "GALF inaugure son nouveau centre à San Pedro", category: "Actualité", date: "15 Mars 2026", author: "Direction", img: "/images/formations/tractopelle.png", excerpt: "Un centre de formation flambant neuf pour répondre à la demande croissante dans le Sud-Ouest." },
    { slug: "retour-experience-bulldozer", title: "Retour d'expérience : formation Bulldozer D9", category: "Témoignage", date: "01 Mars 2026", author: "Yao K.", img: "/images/formations/bulldozer.png", excerpt: "Yao nous raconte son parcours de formation et comment il a décroché un poste en mine." },
    { slug: "metiers-btp-demandes-2026", title: "Les métiers du BTP les plus demandés en 2026", category: "Carrière", date: "20 Février 2026", author: "RH GALF", img: "/images/formations/grue-mobile.png", excerpt: "Tour d'horizon des compétences les plus recherchées par les employeurs du secteur." },
  ]

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      {confettiActive && (
        <div className="fixed inset-0 z-[110] pointer-events-none flex items-center justify-center overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 100, x: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -400, x: (i - 10) * 35, scale: 1.5, rotate: 360 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute text-2xl"
            >
              {['🎉', '✨', '🎓', '🚜', '🚀'][i % 5]}
            </motion.div>
          ))}
        </div>
      )}

      <PageHeader 
        title="ACTUALITÉS & EXPERTISE"
        subtitle="Restez informés sur les évolutions du BTP, les normes industrielles et les opportunités d'emploi."
        badge="Actualités & ressources"
      />

      <div className="container-galf relative z-10 mt-12">
        
        {/* Search Bar & CPF Calculator Grid */}
        <div className="grid md:grid-cols-12 gap-8 mb-12 items-stretch">
          
          {/* Feature 94: Search Input */}
          <div className="md:col-span-5 glass-card p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-galf-yellow" /> Recherche Rapide d'Articles
              </h3>
              <p className="text-xs text-white/50 mb-4">
                Filtrez instantanément notre base de connaissances BTP, HSE et actualités.
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: HSE, Pelle, VGP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-galf-yellow transition-all"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Feature 93: CPF Hours Calculator */}
          <div className="md:col-span-7 glass-card p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-galf-yellow" /> Simulateur de Droits de Formation (CPF / Habilitations)
              </h3>
              <p className="text-xs text-white/50 mb-4">
                Estimez le financement disponible selon vos heures acquises et découvrez votre reste à charge théorique.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60 font-bold">Heures CPF estimées :</span>
                <span className="font-black text-galf-yellow">{cpfHours} Heures ({(cpfHours * 15000).toLocaleString('fr-FR')} F CFA)</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={cpfHours}
                onChange={(e) => { playBlogSound('click'); setCpfHours(Number(e.target.value)); }}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
              />

              <div className="flex justify-between items-center pt-2 text-[10px] text-white/50 uppercase font-black border-t border-white/5">
                <span>Formation Pelle (650k)</span>
                <span>Reste à charge : {Math.max(0, 650000 - (cpfHours * 15000)).toLocaleString('fr-FR')} F CFA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
             <FadeIn key={idx} delay={0.08 * idx}>
                <Link href={`/blog/${post.slug}`} className="group cursor-pointer h-full">
                  <div className="glass-card rounded-xl overflow-hidden hover:border-galf-yellow/30 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="h-48 overflow-hidden relative shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                      <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{post.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-black mb-3 group-hover:text-galf-yellow transition-colors leading-tight" style={{ color: 'var(--galf-text)' }}>{post.title}</h3>
                      <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: 'var(--galf-text-secondary)' }}>{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest pt-4" style={{ borderTop: '1px solid var(--galf-border)', color: 'var(--galf-text-muted)' }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/40">
             <p className="text-sm">Aucun article ne correspond à votre recherche.</p>
          </div>
        )}

        {/* ── Newsletter & Poll Grid (Feature 95 & 96) ── */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 items-stretch">
          
          {/* Feature 95: Confetti Newsletter Signup */}
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-galf-yellow" /> Newsletter Pédagogique GALF
              </h3>
              <p className="text-xs text-white/50 mb-6">
                Abonnez-vous pour recevoir nos alertes de recrutement en direct, astuces CACES et nouvelles normes HSE de sécurité.
              </p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  required
                  type="email"
                  placeholder="votre.email@compagnie.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-galf-yellow"
                />
                <button
                  type="submit"
                  className="bg-galf-yellow text-galf-carbon px-6 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                >
                  S'abonner
                </button>
              </form>
            ) : (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-xs font-black text-green-200 animate-fadeIn">
                 🎉 Merci pour votre inscription ! Vous recevrez nos alertes sous peu.
              </div>
            )}
          </div>

          {/* Feature 96: Monthly Industry Survey Poll */}
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-galf-yellow" /> Sondage Industrie : Défi de Chantier 2026
              </h3>
              <p className="text-xs text-white/50 mb-6">
                Selon vos projets, quel est le défi opérationnel le plus stratégique cette année ?
              </p>
            </div>

            {votedChoice === null ? (
              <div className="grid grid-cols-1 gap-2 text-left">
                {[
                  "Pénurie d'opérateurs certifiés d'engins",
                  "Application des normes HSE écologiques",
                  "Intégration de la simulation virtuelle"
                ].map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleVote(oIdx)}
                    className="w-full text-left p-2.5 rounded-lg border border-white/10 hover:border-galf-yellow text-xs text-white bg-black/30 transition-all"
                  >
                    📊 {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block">Résultats du vote en temps réel :</span>
                
                {/* SVG Results Chart */}
                <div className="space-y-2">
                  {[
                    { label: "Opérateurs certifiés", votes: pollVotes[0] },
                    { label: "Normes HSE", votes: pollVotes[1] },
                    { label: "Simulation", votes: pollVotes[2] }
                  ].map((result, idx) => {
                    const totalVotes = pollVotes.reduce((a, b) => a + b, 0)
                    const pct = Math.round((result.votes / totalVotes) * 100)
                    return (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between text-[10px] text-white/80 font-bold mb-1">
                          <span>{result.label}</span>
                          <span>{pct}% ({result.votes} votes)</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-galf-yellow rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
