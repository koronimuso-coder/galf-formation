"use client"
import Link from 'next/link'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowRight, Calendar, User, Tag } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function BlogPortal() {
  const posts = [
    { title: "Les nouvelles normes HSE dans le secteur minier en Afrique de l'Ouest", category: "Sécurité", date: "10 Avril 2026", author: "Équipe Pédagogique", img: "/images/engins/chargeuse.png", excerpt: "Découvrez les dernières évolutions réglementaires et comment GALF intègre ces normes dans ses formations." },
    { title: "Pourquoi devenir opérateur de pelle hydraulique en 2026 ?", category: "Carrière", date: "05 Avril 2026", author: "Marc K.", img: "/images/engins/pelle-hydraulique.png", excerpt: "Le métier d'opérateur d'engins lourds offre des perspectives de carrière exceptionnelles en Afrique." },
    { title: "L'importance de la Vérification Générale Périodique (VGP)", category: "Technique", date: "28 Mars 2026", author: "Service Technique", img: "/images/engins/grue-tour.png", excerpt: "La VGP est une obligation légale. Comprendre ses enjeux pour la sécurité et la conformité." },
    { title: "GALF inaugure son nouveau centre à San Pedro", category: "Actualité", date: "15 Mars 2026", author: "Direction", img: "/images/engins/tractopelle.png", excerpt: "Un centre de formation flambant neuf pour répondre à la demande croissante dans le Sud-Ouest." },
    { title: "Retour d'expérience : formation Bulldozer D9", category: "Témoignage", date: "01 Mars 2026", author: "Yao K.", img: "/images/engins/bulldozer.png", excerpt: "Yao nous raconte son parcours de formation et comment il a décroché un poste en mine." },
    { title: "Les métiers du BTP les plus demandés en 2026", category: "Carrière", date: "20 Février 2026", author: "RH GALF", img: "/images/engins/grue-mobile.png", excerpt: "Tour d'horizon des compétences les plus recherchées par les employeurs du secteur." },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute right-[-10%] top-[5%] w-[600px] h-[600px] opacity-[0.04] pointer-events-none z-0">
        <AnimatedMachineHeader type="bulldozer" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Actualités & ressources</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none" style={{ color: 'var(--galf-text)' }}>
            ACTUALITÉS <span className="text-galf-yellow">& EXPERTISE</span>
          </h1>
          <p className="text-xl max-w-3xl leading-relaxed mb-16" style={{ color: 'var(--galf-text-secondary)' }}>
            Restez informés sur les évolutions du BTP, les normes industrielles et les opportunités d'emploi.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <FadeIn key={idx} delay={0.08 * idx}>
              <div className="group cursor-pointer h-full">
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
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
