"use client"

import { FadeIn } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getPageHeaderImage } from '@/lib/images'
import { ShieldCheck, Award, MapPin, CheckCircle2 } from 'lucide-react'

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
    <section className="relative min-h-[380px] md:min-h-[460px] flex items-center overflow-hidden bg-slate-950 pt-28 pb-14 border-b border-amber-500/20">
      {/* ── Bright HD Background Image & Elegant Scrim ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={headerBg} 
          alt={title} 
          fill 
          className="object-cover object-center opacity-85 transition-transform duration-700 ease-out hover:scale-105" 
          priority
          unoptimized={headerBg.endsWith('.webp')}
        />
        
        {/* Balanced Scrim: Ensures text legibility while keeping background image bright & clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
      </div>

      <div className="container-galf relative z-20 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6 sm:pt-10">
        {/* Left Column: Title & Subtitle */}
        <div className={centered ? 'max-w-3xl mx-auto text-center flex flex-col items-center' : 'max-w-3xl'}>
          <FadeIn>
            {badge && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-5 bg-amber-500/20 border border-amber-400/40 text-amber-400 backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {badge}
              </div>
            )}
            
            <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-[1.1] drop-shadow-lg ${centered ? 'mx-auto' : ''}`}>
              {title}
            </h1>
            
            <p className={`text-sm sm:text-base md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow ${centered ? 'mx-auto' : ''}`}>
              {subtitle}
            </p>
            
            {children && <div className="mt-6">{children}</div>}
          </FadeIn>
        </div>

        {/* Right Column: Clean & Professional Information Card */}
        {!centered && (
          <FadeIn delay={0.2} className="shrink-0 w-full lg:w-80">
            <div className="p-5 rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl space-y-3.5">
              <div className="flex justify-between items-center border-b border-white/10 pb-2.5 text-amber-400 font-black uppercase text-xs tracking-wider">
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> GALF CI</span>
                <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Agréé État</span>
              </div>
              
              <div className="space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Diplômes &amp; Certifications Métier</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Plateaux Techniques Abidjan &amp; San Pedro</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>80% Pratique terrain sur machines réelles</span>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute right-0 bottom-0 w-1/3 h-1 bg-gradient-to-r from-transparent via-amber-500 to-orange-500 z-20" />
    </section>
  )
}
