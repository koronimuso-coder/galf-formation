"use client"
import { useEffect, useRef, useState } from 'react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getPageHeaderImage } from '@/lib/images'
import { Compass, ShieldCheck } from 'lucide-react'

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
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  // HUD Telemetry States
  const [elevation, setElevation] = useState(105)
  const [gpsCoords, setGpsCoords] = useState("5°19'11\"N 4°01'36\"W") // Abidjan default
  
  // Set regional telemetry depending on the page path
  useEffect(() => {
    if (pathname.includes('sanpedro') || pathname.includes('annuaire')) {
      setGpsCoords("4°44'54\"N 6°38'11\"W") // San Pedro
      setElevation(45)
    } else if (pathname.includes('candidat')) {
      setGpsCoords("5°22'14\"N 3°59'40\"W") // Bingerville/Abidjan
      setElevation(82)
    }
  }, [pathname])

  // Mouse move listener to add slight interactive tilt to canvas points
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  // --- Dynamic Triangulation Canvas Grid ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let frameId: number
    canvas.width = canvas.parentElement?.clientWidth || 800
    canvas.height = canvas.parentElement?.clientHeight || 450
    
    const w = canvas.width
    const h = canvas.height
    
    // Generate triangulation point coordinates
    const pointsCount = 28
    const points: { x: number; y: number; originX: number; originY: number; speed: number; radius: number }[] = []
    
    for (let i = 0; i < pointsCount; i++) {
      const rx = Math.random() * w
      const ry = Math.random() * h
      points.push({
        x: rx,
        y: ry,
        originX: rx,
        originY: ry,
        speed: 0.2 + Math.random() * 0.4,
        radius: 1 + Math.random() * 2
      })
    }

    let time = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      time += 0.005
      
      // Calculate dynamic mouse offsets
      const mouseOffsetX = mousePos.x * 60
      const mouseOffsetY = mousePos.y * 60
      
      // Update & Draw points
      points.forEach((p, idx) => {
        // Natural floating movement + Mouse tilt
        const targetX = p.originX + Math.sin(time + idx) * 12 + mouseOffsetX
        const targetY = p.originY + Math.cos(time + idx) * 12 + mouseOffsetY
        
        // Linear ease towards targets
        p.x += (targetX - p.x) * 0.08
        p.y += (targetY - p.y) * 0.08
        
        ctx.fillStyle = 'rgba(255, 176, 0, 0.25)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Connect points within distance threshold (forming BTP triangulation mesh)
      ctx.lineWidth = 0.5
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.06)'
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 140) {
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }
      
      frameId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [mousePos])

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative h-[55vh] md:h-[65vh] min-h-[360px] md:min-h-[520px] flex items-center overflow-hidden bg-zinc-950"
    >
      {/* ── Background Image & Cinematic Overlays ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={headerBg} 
          alt={title} 
          fill 
          className="object-cover opacity-60 filter brightness-[0.7]" 
          priority
          unoptimized={headerBg.endsWith('.webp')}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-black/45 to-transparent z-10" />
        <div className="absolute inset-0 blueprint-header-overlay opacity-30 z-10" />
        
        {/* Dynamic Canvas Triangulation Grid */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60" />
      </div>

      <div className="container-galf relative z-20 w-full flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-12">
        <div className={centered ? 'max-w-3xl mx-auto text-center flex flex-col items-center' : 'max-w-4xl'}>
          <FadeIn>
            <div>
              {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-galf-yellow animate-pulse" />
                  {badge}
                </div>
              )}
              
              <TextReveal 
                text={title} 
                className={`page-header-title text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-4 md:mb-6 leading-[0.95] text-metallic-yellow text-glow-yellow ${centered ? 'mx-auto' : ''}`} 
              />
              
              <p className={`text-sm md:text-base text-white/75 font-semibold leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
                {subtitle}
              </p>
            </div>
            
            {children}
          </FadeIn>
        </div>

        {/* HUD TELEMETRY INFO PANEL (Unprecedented / Inédit) */}
        {!centered && (
          <FadeIn delay={0.2} className="shrink-0 w-full lg:w-72">
            <div className="hud-monitor-card p-5 rounded-2xl border border-white/10 text-white font-mono text-[10px] space-y-3 animate-glow-border transform lg:translate-y-[-10px]">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 text-galf-yellow font-black uppercase tracking-wider">
                <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 animate-spin-slow" /> HUD Telemetry</span>
                <span>ONLINE</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-45">COORDS:</span>
                  <span className="font-bold">{gpsCoords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-45">ELEVATION:</span>
                  <span className="font-bold">{elevation} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-45">GRID SCAN:</span>
                  <span className="font-bold text-emerald-400">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-45">SECURE:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> HSE OK
                  </span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10 text-white/30 text-[8px] uppercase tracking-widest text-center">
                GALF Connect Portal CI
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {!centered && (
        <div className="absolute right-0 bottom-0 w-1/3 h-1.5 bg-gradient-to-r from-transparent via-galf-yellow to-orange-500 z-20 shadow-[0_0_20px_rgba(255,176,0,0.6)]" />
      )}
    </section>
  )
}
