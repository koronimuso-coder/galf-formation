"use client";

import { useParams, useRouter } from 'next/navigation'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'
import { Calendar, User, ArrowLeft, Share2, MessageSquare, Tag, Bookmark } from 'lucide-react'
import Link from 'next/link'

// This would be exported if it was a server component, 
// since it is a client component, we rely on the parent layout or just set title in useEffect.
// However, for Next.js 15, we can use generateMetadata in a separate layout if needed.
// For now, I'll add a simple head title update via useEffect for cinematic responsiveness.
import { useEffect } from 'react'

export default function BlogDetail() {
  const { slug } = useParams()
  const router = useRouter()

  useEffect(() => {
    document.title = `${post.title} | Blog GALF`
  }, [])

  // Mock post data based on slug (in real app, fetch from CMS/Firebase)
  const post = {
    title: "Les nouvelles normes HSE dans le secteur minier en Afrique de l'Ouest",
    category: "Sécurité",
    date: "10 Avril 2026",
    author: "Équipe Pédagogique",
    authorTitle: "Expert HSE & Formation mobile",
    readTime: "8 min de lecture",
    img: "/images/engins/chargeuse.png",
    content: `
      <p class="mb-6">L'industrie minière en Afrique de l'Ouest connaît une transformation radicale de ses standards de sécurité. Avec l'arrivée de nouveaux acteurs internationaux et le durcissement des régulations locales (notamment en Côte d'Ivoire et au Burkina Faso), la certification des opérateurs n'est plus une option, mais une nécessité absolue pour la survie des entreprises.</p>
      
      <h2 class="text-2xl font-black mb-4 text-white">1. Vers un standard « Zéro Accident »</h2>
      <p class="mb-6">Le concept de Vision Zero n'est plus réservé aux géants comme Rio Tinto ou Glencore. Aujourd'hui, les sous-traitants locaux doivent prouver que leurs conducteurs de pelles, bulldozers et forages maîtrisent non seulement la machine, mais aussi l'environnement complexe du site minier.</p>
      
      <div class="glass-card p-8 rounded-2xl border-l-4 border-galf-yellow mb-8">
        <p class="italic text-lg">"La sécurité n'est pas un coût, c'est l'investissement le plus rentable pour une entreprise minière. Un arrêt de chantier suite à un incident peut coûter des millions de FCFA par heure."</p>
      </div>

      <h2 class="text-2xl font-black mb-4 text-white">2. Ce que GALF Formation apporte</h2>
      <p class="mb-6">Nos programmes 2026 intègrent désormais des modules sur la psychologie de la sécurité et la détection précoce des risques mécaniques. Un opérateur formé chez GALF ne se contente pas de déplacer de la terre ; il gère une unité de production critique avec une conscience aiguë des protocoles VGP (Vérification Générale Périodique).</p>
    `,
    tags: ["Mines", "HSE", "Afrique", "Certification", "Sécurité"]
  }

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG - Grue for "Vision & Expertise" */}
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
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight" style={{ color: 'var(--galf-text)' }}>
                {post.title}
              </h1>
              
              <div className="aspect-video rounded-3xl overflow-hidden mb-12 relative border border-galf-border shadow-2xl">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div 
                className="prose prose-invert prose-yellow max-w-none text-lg leading-relaxed mb-16"
                style={{ color: 'var(--galf-text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="flex flex-wrap gap-2 pt-8" style={{ borderTop: '1px solid var(--galf-border)' }}>
                {post.tags.map(tag => (
                  <span key={tag} className="glass-card px-4 py-1.5 rounded-full text-xs font-bold" style={{ color: 'var(--galf-text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <FadeIn delay={0.2}>
              <div className="glass-card p-8 rounded-3xl sticky top-32">
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
                  <button className="w-full glass-card text-white font-bold py-3 rounded-xl hover:border-galf-yellow/30 transition-all flex items-center justify-center gap-2 border border-galf-border">
                    <Bookmark className="w-4 h-4" /> Sauvegarder
                  </button>
                </div>

                <div className="pt-8" style={{ borderTop: '1px solid var(--galf-border)' }}>
                   <h3 className="font-black text-white mb-4 uppercase tracking-widest text-xs">Articles Recommandés</h3>
                   <div className="space-y-6">
                      {[1, 2].map(i => (
                        <div key={i} className="group cursor-pointer">
                           <div className="text-[10px] text-galf-yellow font-black uppercase mb-1">Expertise</div>
                           <h4 className="font-bold text-sm leading-snug group-hover:text-galf-yellow transition-colors">Maîtriser la grue à tour : Les 5 erreurs fatales à éviter.</h4>
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
