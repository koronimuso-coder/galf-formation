"use client"
import { useEffect, useRef, useState } from 'react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getPageHeaderImage } from '@/lib/images'
import { Compass, ShieldCheck, Activity, Target } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle: string
  badge?: string
  bgImage?: string
  centered?: boolean
  children?: React.ReactNode
}

interface ScanPoint {
  x: number
  y: number
  originX: number
  originY: number
  speed: number
  radius: number
  intensity: number
}

export function PageHeader({ title, subtitle, badge, bgImage, centered = false, children }: PageHeaderProps) {
  const pathname = usePathname()
  const headerBg = bgImage || getPageHeaderImage(pathname)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hudCanvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ rx: 0, ry: 0, canvasX: -9999, canvasY: -9999 })
  
  // HUD Telemetry States
  const [elevation, setElevation] = useState(105)
  const [gpsCoords, setGpsCoords] = useState("5°19'11\"N 4°01'36\"W") // Abidjan default
  const [activeScanIndex, setActiveScanIndex] = useState(0)
  
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

  // Oscillating elevation & scan counter in HUD to simulate live tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setElevation(prev => {
        const delta = (Math.random() - 0.5) * 0.16
        return parseFloat((prev + delta).toFixed(2))
      })
      setActiveScanIndex(prev => (prev + 1) % 1000)
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  // Mouse move listener to update mouse offsets & canvas coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = (e.clientX - rect.left) / rect.width - 0.5
    const ry = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ rx, ry, canvasX: x, canvasY: y })
  }

  const handleMouseLeave = () => {
    setMousePos({ rx: 0, ry: 0, canvasX: -9999, canvasY: -9999 })
  }

  // --- Dynamic Triangulation Canvas Grid (with LIDAR Sweep) ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let frameId: number
    
    const initCanvasSize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800
      canvas.height = canvas.parentElement?.clientHeight || 450
    }
    
    initCanvasSize()
    
    // Generate triangulation point coordinates
    const pointsCount = 32
    const points: ScanPoint[] = []
    
    for (let i = 0; i < pointsCount; i++) {
      const rx = Math.random() * canvas.width
      const ry = Math.random() * canvas.height
      points.push({
        x: rx,
        y: ry,
        originX: rx,
        originY: ry,
        speed: 0.2 + Math.random() * 0.4,
        radius: 1.5 + Math.random() * 2,
        intensity: 0
      })
    }

    let time = 0
    let sweepY = 0
    let sweepDirection = 1

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      time += 0.004
      
      // 1. Move LIDAR Sweep line
      sweepY += 2.2 * sweepDirection
      if (sweepY > h) {
        sweepY = h
        sweepDirection = -1
      } else if (sweepY < 0) {
        sweepY = 0
        sweepDirection = 1
      }

      // Draw Sweep Line and Glow
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, sweepY)
      ctx.lineTo(w, sweepY)
      ctx.stroke()

      const sweepGrad = ctx.createLinearGradient(0, sweepY - 30, 0, sweepY + 30)
      sweepGrad.addColorStop(0, 'rgba(255, 176, 0, 0)')
      sweepGrad.addColorStop(0.5, 'rgba(255, 176, 0, 0.08)')
      sweepGrad.addColorStop(1, 'rgba(255, 176, 0, 0)')
      ctx.fillStyle = sweepGrad
      ctx.fillRect(0, sweepY - 30, w, 60)
      
      // Calculate dynamic mouse offsets
      const mouseOffsetX = mousePos.rx * 50
      const mouseOffsetY = mousePos.ry * 50
      
      // 2. Update & Draw points
      points.forEach((p, idx) => {
        // Natural floating movement + Mouse tilt
        const targetX = p.originX + Math.sin(time + idx) * 14 + mouseOffsetX
        const targetY = p.originY + Math.cos(time + idx) * 14 + mouseOffsetY
        
        // Linear ease towards targets
        p.x += (targetX - p.x) * 0.08
        p.y += (targetY - p.y) * 0.08
        
        // Decaying intensity from sweep/hover
        p.intensity *= 0.96

        // Check LIDAR line intersection
        if (Math.abs(p.y - sweepY) < 18) {
          p.intensity = Math.max(p.intensity, 1.0)
        }

        // Check mouse proximity intersection
        if (mousePos.canvasX > 0) {
          const dx = p.x - mousePos.canvasX
          const dy = p.y - mousePos.canvasY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            p.intensity = Math.max(p.intensity, 1 - (dist / 130))
            
            // Connect to mouse with dashed laser
            ctx.strokeStyle = `rgba(255, 176, 0, ${(1 - dist/130) * 0.25})`
            ctx.lineWidth = 0.5
            ctx.setLineDash([2, 4])
            ctx.beginPath()
            ctx.moveTo(mousePos.canvasX, mousePos.canvasY)
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
        
        // Draw coordinate tags for scanned points
        if (p.intensity > 0.4) {
          ctx.fillStyle = `rgba(255, 176, 0, ${(p.intensity - 0.4) * 0.8})`
          ctx.font = '6px monospace'
          ctx.fillText(`[x:${Math.round(p.x)} y:${Math.round(p.y)}]`, p.x + 8, p.y - 4)
        }

        // Draw Point Circle
        ctx.fillStyle = `rgba(255, 176, 0, ${0.15 + p.intensity * 0.6})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius + p.intensity * 1.5, 0, Math.PI * 2)
        ctx.fill()

        if (p.intensity > 0.6) {
          ctx.strokeStyle = `rgba(255, 176, 0, ${(p.intensity - 0.6) * 0.5})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius + 6, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
      
      // Connect points (forming BTP triangulation mesh)
      ctx.lineWidth = 0.5
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 150) {
            const meanIntensity = (points[i].intensity + points[j].intensity) / 2
            ctx.strokeStyle = `rgba(255, 176, 0, ${0.05 + meanIntensity * 0.2})`
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

    const handleResize = () => {
      initCanvasSize()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [mousePos])

  // --- Dynamic HUD Oscillograph Canvas ---
  useEffect(() => {
    const hudCanvas = hudCanvasRef.current
    if (!hudCanvas) return
    const hCtx = hudCanvas.getContext('2d')
    if (!hCtx) return
    
    let hudFrameId: number
    hudCanvas.width = 160
    hudCanvas.height = 36
    
    let hudTime = 0
    const drawHud = () => {
      const w = hudCanvas.width
      const h = hudCanvas.height
      hCtx.clearRect(0, 0, w, h)
      
      // Grid lines in HUD chart
      hCtx.strokeStyle = 'rgba(255, 176, 0, 0.05)'
      hCtx.lineWidth = 0.5
      for (let i = 0; i < w; i += 20) {
        hCtx.beginPath()
        hCtx.moveTo(i, 0)
        hCtx.lineTo(i, h)
        hCtx.stroke()
      }
      for (let j = 0; j < h; j += 10) {
        hCtx.beginPath()
        hCtx.moveTo(0, j)
        hCtx.lineTo(w, j)
        hCtx.stroke()
      }

      // Signal wave
      hCtx.strokeStyle = 'rgba(255, 176, 0, 0.75)'
      hCtx.shadowColor = '#FFB000'
      hCtx.shadowBlur = 4
      hCtx.lineWidth = 1
      hCtx.beginPath()
      
      hudTime += 0.08
      for (let x = 0; x < w; x++) {
        // Compose two sine waves for complex radar frequency telemetry
        const y = (h / 2) + Math.sin(x * 0.08 + hudTime * 2) * 8 + Math.cos(x * 0.15 - hudTime) * 3 + (Math.random() - 0.5) * 1.5
        if (x === 0) hCtx.moveTo(x, y)
        else hCtx.lineTo(x, y)
      }
      hCtx.stroke()
      hCtx.shadowBlur = 0 // reset
      
      hudFrameId = requestAnimationFrame(drawHud)
    }
    drawHud()
    
    return () => {
      cancelAnimationFrame(hudFrameId)
    }
  }, [])

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[480px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-950 pb-16"
    >
      {/* ── Background Image — Clean & Bright ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={headerBg} 
          alt={title} 
          fill 
          className="object-cover opacity-90 dark:opacity-75 transition-transform duration-700 ease-out" 
          priority
          unoptimized={headerBg.endsWith('.webp')}
        />
        
        {/* Soft, natural gradient overlay to guarantee text legibility without darkening */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 z-10" />
      </div>

      <div className="container-galf relative z-20 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-28 sm:pt-32 lg:pt-36">
        <div className={centered ? 'max-w-3xl mx-auto text-center flex flex-col items-center' : 'max-w-4xl'}>
          <FadeIn>
            {/* Clean main text container */}
            <div className="relative p-6 md:p-10 rounded-3xl backdrop-blur-md bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden group">
              {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-5 bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {badge}
                </div>
              )}
              
              <TextReveal 
                text={title} 
                className={`page-header-title text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-4 md:mb-5 leading-[0.95] text-metallic-yellow ${centered ? 'mx-auto' : ''}`} 
              />
              
              <p className={`text-sm md:text-base text-slate-700 dark:text-white/80 font-medium leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
                {subtitle}
              </p>
            </div>
            
            {children && <div className="mt-6">{children}</div>}
          </FadeIn>
        </div>

        {/* Clean Center Info Panel */}
        {!centered && (
          <FadeIn delay={0.2} className="shrink-0 w-full lg:w-80">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 font-mono text-[10px] space-y-4 transform lg:translate-y-[-10px] backdrop-blur-md shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2.5 text-amber-600 dark:text-amber-400 font-black uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-amber-500" /> Centre &amp; Plateau</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ouvert</span>
              </div>
              
              {/* Oscilloscope canvas */}
              <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[7px] text-slate-500 uppercase tracking-widest block font-bold">FRÉQUENCE ACTIVITÉ</span>
                  <span className="text-slate-700 dark:text-white/60 text-[8px] flex items-center gap-1"><Activity className="w-2.5 h-2.5 text-amber-500" /> SIGNAL: {activeScanIndex}Hz</span>
                </div>
                <canvas ref={hudCanvasRef} className="w-32 h-9 opacity-80" />
              </div>

              <div className="space-y-2 border-t border-slate-200 dark:border-white/5 pt-2">
                <div className="flex justify-between">
                  <span className="opacity-60 dark:opacity-45">COORDS GPS:</span>
                  <span className="font-bold text-slate-900 dark:text-white/95">{gpsCoords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60 dark:opacity-45">ALTITUDE:</span>
                  <span className="font-bold text-slate-900 dark:text-white/95">{elevation} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60 dark:opacity-45">STATUT PLATEAU:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> ACTIF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60 dark:opacity-45">CONFORMITÉ:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> NORME HSE
                  </span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 text-[8px] uppercase tracking-widest text-center font-bold">
                GALF FORMATION CÔTE D&apos;IVOIRE
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {!centered && (
        <div className="absolute right-0 bottom-0 w-1/3 h-1.5 bg-gradient-to-r from-transparent via-galf-yellow to-orange-500 z-20 shadow-[0_0_20px_rgba(255,176,0,0.4)]" />
      )}
    </section>
  )
}
