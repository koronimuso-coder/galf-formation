"use client"

import { FadeIn } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getPageHeaderImage } from '@/lib/images'
import { Award, CheckCircle2, MapPin } from 'lucide-react'

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
    <div className="w-full flex flex-col pt-16 sm:pt-20">
      {/* ── 1. Pure, Clean HD Header Image (Zero Text Overlay, 100% Bright) ── */}
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] overflow-hidden bg-slate-950">
        <Image 
          src={headerBg} 
          alt={title} 
          fill 
          className="object-cover object-center opacity-100 transition-transform duration-700 ease-out hover:scale-105" 
          priority
          unoptimized={headerBg.endsWith('.webp')}
        />
        {/* Subtle accent border line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 z-10" />
      </div>

      {/* ── 2. Clean Title & Subtitle Section (Positioned Below Header Image) ── */}
      <section className="w-full bg-slate-900 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 py-8 md:py-10">
        <div className="container-galf flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Main Title & Description */}
          <div className={centered ? 'max-w-3xl mx-auto text-center flex flex-col items-center' : 'max-w-3xl'}>
            <FadeIn>
              {badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-3.5 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  {badge}
                </div>
              )}
              
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3 leading-tight ${centered ? 'mx-auto' : ''}`}>
                {title}
              </h1>
              
              <p className={`text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
                {subtitle}
              </p>
              
              {children && <div className="mt-5">{children}</div>}
            </FadeIn>
          </div>

          {/* Quick Info Badge (Right Side) */}
          {!centered && (
            <FadeIn delay={0.2} className="shrink-0 w-full lg:w-80">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-lg space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-2 text-amber-600 dark:text-amber-400 font-black uppercase text-xs tracking-wider">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> GALF CI</span>
                  <span className="text-emerald-500 text-[11px] font-bold">Agréé METFIP</span>
                </div>
                
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>80% Pratique sur engins réels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Centres d&apos;Abidjan &amp; San Pedro</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

        </div>
      </section>
    </div>
  )
}
