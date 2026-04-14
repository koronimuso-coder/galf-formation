"use client"
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const equipmentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Grid animations
      gsap.to('.grid-line-h', { opacity: 1, stagger: 0.04, duration: 1.2, ease: "power2.out" })
      gsap.to('.grid-line-v', { opacity: 1, stagger: 0.02, duration: 1, ease: "power2.out", delay: 0.3 })
      
      // Equipment floating parallax
      gsap.to(equipmentRef.current, {
        y: -15,
        rotation: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Mouse parallax
      const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        const xPos = (clientX / window.innerWidth - 0.5) * 40
        const yPos = (clientY / window.innerHeight - 0.5) * 40
        
        gsap.to(equipmentRef.current, {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: "power2.out"
        })
      }

      window.addEventListener('mousemove', onMouseMove)
      return () => window.removeEventListener('mousemove', onMouseMove)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const hLines = Array.from({ length: 12 })
  const vLines = Array.from({ length: 20 })

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
      {/* Ambient glows */}
      <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-40" style={{ background: 'var(--galf-yellow-glow)' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[150px]" />

      {/* Grid */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%]" style={{ perspective: '1000px' }}>
        <div className="relative w-full h-full" style={{ transform: 'rotateX(65deg)', transformOrigin: 'bottom center' }}>
          {hLines.map((_, i) => (
            <div key={`h-${i}`} className="grid-line-h absolute left-0 right-0 opacity-0" style={{
              bottom: `${(i / hLines.length) * 100}%`, height: '1px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,176,0,0.2) 50%, transparent 95%)',
            }} />
          ))}
          {vLines.map((_, i) => (
            <div key={`v-${i}`} className="grid-line-v absolute top-0 bottom-0 opacity-0" style={{
              left: `${(i / vLines.length) * 100}%`, width: '1px',
              background: `linear-gradient(180deg, transparent 5%, var(--galf-border) 50%, transparent 95%)`,
            }} />
          ))}
        </div>
      </div>

      {/* Giant Animated Machine Blueprint */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[800px] h-[600px] z-10 hidden lg:block opacity-40">
        <AnimatedMachineHeader type="bulldozer" className="w-full h-full" color="var(--galf-yellow)" />
      </div>

      {/* Overlay vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--galf-bg)] via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--galf-bg)] via-transparent to-transparent opacity-40 shrink-0" />
    </div>
  )
}
