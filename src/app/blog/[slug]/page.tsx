"use client";
import { useParams, useRouter } from 'next/navigation'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
import { Calendar, ArrowLeft, Share2, MessageSquare, Tag, Bookmark, Heart, Send } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function BlogDetail() {
  const { slug } = useParams()
  const router = useRouter()

  // Comfort Reader States
  const [comfortBg, setComfortBg] = useState<'day' | 'night' | 'sepia'>('day')
  const [comfortSize, setComfortSize] = useState<number>(18) // Font size in px

  // Local comments state
  const [comments, setComments] = useState([
    { author: "Mamadou Sylla", text: "Excellent article ! Les consignes de sécurité HSE sont trop souvent négligées sur nos chantiers. Merci pour ce rappel.", date: "Il y a 2h" },
    { author: "Awa Touré", text: "La formation pratique m'a permis d'intégrer rapidement un chantier de terrassement à Abidjan.", date: "Il y a 5h" }
  ])
  const [newAuthor, setNewAuthor] = useState("")
  const [newComment, setNewComment] = useState("")

  // Reactions state
  const [reactions, setReactions] = useState({
    like: 18,
    operator: 12,
    crane: 25,
    trophy: 8
  })

  // Mock post data based on slug
  const post = {
    title: "Les nouvelles normes HSE dans le secteur minier en Afrique de l'Ouest",
    category: "Sécurité",
    date: "10 Avril 2026",
    author: "Équipe Pédagogique",
    authorTitle: "Expert HSE & Formation mobile",
    readTime: "8 min de lecture",
    img: "/images/formations/chargeuse.png",
    content: `
      <p class="mb-6">L'industrie minière en Afrique de l'Ouest connaît une transformation radicale de ses standards de sécurité. Avec l'arrivée de nouveaux acteurs internationaux et le durcissement des régulations locales (notamment en Côte d'Ivoire et au Burkina Faso), la certification des opérateurs n'est plus une option, mais une nécessité absolue pour la survie des entreprises.</p>
      
      <h2 class="text-2xl font-black mb-4 text-slate-900 dark:text-white">1. Vers un standard « Zéro Accident »</h2>
      <p class="mb-6">Le concept de Vision Zero n'est plus réservé aux géants comme Rio Tinto ou Glencore. Aujourd'hui, les sous-traitants locaux doivent prouver que leurs conducteurs de pelles, bulldozers et forages maîtrisent non seulement la machine, mais aussi l'environnement complexe du site minier.</p>
      
      <div class="glass-card p-8 rounded-2xl border-l-4 border-galf-yellow mb-8 bg-black/20">
        <p class="italic text-lg">"La sécurité n'est pas un coût, c'est l'investissement le plus rentable pour une entreprise minière. Un arrêt de chantier suite à un incident peut coûter des millions de FCFA par heure."</p>
      </div>

      <h2 class="text-2xl font-black mb-4 text-slate-900 dark:text-white">2. Ce que GALF Formation apporte</h2>
      <p class="mb-6">Nos programmes 2026 intègrent désormais des modules sur la psychologie de la sécurité et la détection précoce des risques mécaniques. Un opérateur formé chez GALF ne se contente pas de déplacer de la terre ; il gère une unité de production critique avec une conscience aiguë des protocoles VGP (Vérification Générale Périodique).</p>
    `,
    tags: ["Mines", "HSE", "Afrique", "Certification", "Sécurité"]
  }

  useEffect(() => {
    document.title = `${post.title} | Blog GALF`
  }, [post.title])

  const triggerAudioClick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(500, ctx.currentTime)
      gain.gain.setValueAtTime(0.01, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
      setTimeout(() => ctx.close(), 150)
    } catch(e) {}
  }

  const handleReactionClick = (key: keyof typeof reactions) => {
    triggerAudioClick()
    setReactions(prev => ({ ...prev, [key]: prev[key] + 1 }))
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthor.trim() || !newComment.trim()) return
    triggerAudioClick()
    setComments(prev => [
      ...prev,
      { author: newAuthor, text: newComment, date: "À l'instant" }
    ])
    setNewAuthor("")
    setNewComment("")
  }

  const bgColors = {
    day: 'transparent',
    night: '#08080a',
    sepia: '#211a12'
  }

  const textColors = {
    day: 'var(--galf-text-secondary)',
    night: '#d1d5db',
    sepia: '#d6cbb5'
  }

  const borderColors = {
    day: 'var(--galf-border)',
    night: 'rgba(255,255,255,0.05)',
    sepia: 'rgba(255,176,0,0.1)'
  }

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute right-[-10%] top-[0%] w-[600px] h-[600px] opacity-[0.03] pointer-events-none z-0">
        <AnimatedMachineHeader type="grue" />
      </div>

      <div className="container-galf relative z-10">
        {/* Back navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-galf-yellow font-bold uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </button>

        <div className="grid lg:grid-cols-[1fr_350px] gap-16">
          <article>
            <FadeIn>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-galf-yellow text-galf-carbon text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md">{post.category}</span>
                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--galf-text-muted)' }}>
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>
                  {post.readTime}
                </span>
              </div>
              
              <TextReveal 
                text={post.title}
                className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight text-slate-900 dark:text-white" 
              />
              
              {/* Comfort Controls Widget */}
              <div className="p-4 rounded-2xl panel-bg mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-adaptive-muted uppercase tracking-wider text-[10px]">Thème de lecture :</span>
                  {(['day', 'night', 'sepia'] as const).map(t => (
                    <button 
                      key={t} 
                      onClick={() => { triggerAudioClick(); setComfortBg(t); }}
                      className={`px-3 py-1 rounded-lg uppercase text-[9px] font-black border transition-all ${
                        comfortBg === t 
                          ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' 
                          : 'choice-btn hover:border-galf-yellow/30 text-adaptive-secondary'
                      }`}
                    >
                      {t === 'day' ? 'Jour' : t === 'night' ? 'Nuit' : 'Sépia'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-adaptive-muted uppercase tracking-wider text-[10px]">Taille du texte :</span>
                  <button 
                    disabled={comfortSize <= 14}
                    onClick={() => { triggerAudioClick(); setComfortSize(prev => prev - 2); }}
                    className="w-8 h-8 rounded-lg choice-btn flex items-center justify-center hover:border-galf-yellow/30 text-adaptive disabled:opacity-30"
                  >
                    A-
                  </button>
                  <span className="text-adaptive w-6 text-center text-xs">{comfortSize}px</span>
                  <button 
                    disabled={comfortSize >= 24}
                    onClick={() => { triggerAudioClick(); setComfortSize(prev => prev + 2); }}
                    className="w-8 h-8 rounded-lg choice-btn flex items-center justify-center hover:border-galf-yellow/30 text-adaptive disabled:opacity-30"
                  >
                    A+
                  </button>
                </div>
              </div>
              
              <div className="aspect-video rounded-3xl overflow-hidden mb-12 relative border border-galf-border shadow-2xl">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Comfort Reader content wrapper */}
              <div 
                className="p-8 md:p-12 rounded-3xl transition-all duration-500 max-w-none leading-relaxed border"
                style={{ 
                  background: bgColors[comfortBg], 
                  color: textColors[comfortBg], 
                  fontSize: `${comfortSize}px`,
                  borderColor: borderColors[comfortBg]
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="flex flex-wrap gap-2 pt-8 mt-12" style={{ borderTop: '1px solid var(--galf-border)' }}>
                {post.tags.map(tag => (
                  <span key={tag} className="glass-card px-4 py-1.5 rounded-full text-xs font-bold" style={{ color: 'var(--galf-text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* ═══════════════════════════════════════════════
                  NEW: EMOJI REACTIONS SECTION
                  ═══════════════════════════════════════════════ */}
              <div className="mt-16 panel-bg rounded-3xl p-6 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h4 className="text-sm font-black text-adaptive">Réagissez à cet article</h4>
                  <p className="text-[11px] text-adaptive-muted">Montrez votre intérêt aux autres apprenants de la communauté.</p>
                </div>
                <div className="flex gap-3">
                  {(Object.keys(reactions) as Array<keyof typeof reactions>).map(key => {
                    const iconMap = { like: '👍', operator: '👷', crane: '🏗️', trophy: '🏆' }
                    return (
                      <button
                        key={key}
                        onClick={() => handleReactionClick(key)}
                        className="px-4 py-2 choice-btn hover:border-galf-yellow/30 rounded-xl text-xs font-bold text-adaptive transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                      >
                        <span className="text-sm">{iconMap[key]}</span>
                        <span>{reactions[key]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ═══════════════════════════════════════════════
                  NEW: INTERACTIVE COMMENT FIL D'ACTUALITÉ
                  ═══════════════════════════════════════════════ */}
              <div className="mt-16 space-y-8">
                <h3 className="text-2xl font-black text-adaptive flex items-center gap-2">
                  <MessageSquare className="text-galf-yellow w-6 h-6" /> Commentaires ({comments.length})
                </h3>

                {/* List */}
                <div className="space-y-4">
                  {comments.map((comm, idx) => (
                    <div key={idx} className="p-5 rounded-2xl panel-bg animate-fadeIn">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-galf-yellow">{comm.author}</span>
                        <span className="text-[10px] text-adaptive-muted font-mono">{comm.date}</span>
                      </div>
                      <p className="text-xs text-adaptive-secondary leading-relaxed">{comm.text}</p>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleCommentSubmit} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-black uppercase text-adaptive-muted tracking-wider">Ajouter un commentaire</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      required
                      type="text" 
                      placeholder="Votre nom" 
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      className="input-adaptive rounded-xl p-3.5 text-xs"
                    />
                  </div>
                  <textarea 
                    required
                    rows={3} 
                    placeholder="Écrivez votre message..." 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="input-adaptive w-full rounded-xl p-3.5 text-xs resize-none"
                  />
                  <button 
                    type="submit"
                    className="bg-galf-yellow text-galf-carbon px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Publier le commentaire
                  </button>
                </form>
              </div>

            </FadeIn>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <FadeIn delay={0.2}>
              <div className="glass-card p-8 rounded-3xl sticky top-32 border border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-galf-yellow/20 flex items-center justify-center text-galf-yellow border border-galf-yellow/30 font-black text-2xl uppercase">
                    {post.author[0]}
                  </div>
                  <div>
                    <div className="font-black text-white">{post.author}</div>
                    <div className="text-[10px] font-bold text-galf-yellow uppercase tracking-widest">{post.authorTitle}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <button className="w-full bg-galf-yellow text-galf-carbon font-black py-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg">
                    <Share2 className="w-4 h-4" /> Partager l'article
                  </button>
                  <button className="w-full glass-card text-white font-bold py-3 rounded-xl hover:border-galf-yellow/30 transition-all flex items-center justify-center gap-2 border border-white/10">
                    <Bookmark className="w-4 h-4" /> Sauvegarder
                  </button>
                </div>

                <div className="pt-8" style={{ borderTop: '1px solid var(--galf-border)' }}>
                   <h3 className="font-black text-white mb-4 uppercase tracking-widest text-xs">Articles Recommandés</h3>
                   <div className="space-y-6">
                      {[1, 2].map(i => (
                        <div key={i} className="group cursor-pointer">
                           <div className="text-[10px] text-galf-yellow font-black uppercase mb-1">Expertise</div>
                           <h4 className="font-bold text-sm leading-snug group-hover:text-galf-yellow transition-colors text-white/80">Maîtriser la grue à tour : Les 5 erreurs fatales à éviter.</h4>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </FadeIn>
          </aside>
        </div>
      </div>
    </div>
  )
}
