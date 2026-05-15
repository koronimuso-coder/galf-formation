"use client"
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getPageHeaderImage } from '@/lib/images'

interface PageHeaderProps {
  title: string
  subtitle: string
  badge?: string
  bgImage?: string
  centered?: boolean
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, badge, bgImage, centered = false, children }: PageHeaderProps) {
  const pathname = usePathname()
  const headerBg = bgImage || getPageHeaderImage(pathname)
  
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden">
      {/* ── Background Cinematic WebP ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={headerBg} 
          alt={title} 
          fill 
          className="object-cover" 
          priority
          unoptimized={headerBg.endsWith('.webp')} // Important for animated webp
        />
        {/* Overlays for industrial cinematic look */}
        <div className={`absolute inset-0 z-10 ${centered ? 'bg-black/60' : 'bg-gradient-to-r from-[#0E0E10] via-[#0E0E10]/80 to-transparent'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] to-transparent opacity-80 z-10" />
      </div>

      <div className={`container-galf relative z-20 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
        <FadeIn>
          <div className={centered ? 'max-w-3xl' : 'max-w-4xl'}>
            {badge && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8 bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow">
                <span className="w-2 h-2 rounded-full bg-galf-yellow animate-pulse" />
                {badge}
              </div>
            )}
            <TextReveal 
              text={title} 
              className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.9] ${centered ? 'mx-auto' : ''}`} 
            />
            <p className={`text-lg md:text-xl text-white/70 leading-relaxed ${centered ? 'mx-auto' : ''}`}>
              {subtitle}
            </p>
            {children}
          </div>
        </FadeIn>
      </div>

      {/* Decorative side element */}
      {!centered && (
        <div className="absolute right-0 bottom-0 w-1/3 h-1 bg-galf-yellow opacity-50 z-20 shadow-[0_0_20px_rgba(255,176,0,0.5)]" />
      )}
    </section>
  )
}
