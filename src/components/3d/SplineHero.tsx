"use client"
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/* Generate bubble/particle data only on the client to avoid hydration mismatch */
function generateEmbers(count: number) {
  return Array.from({ length: count }, () => ({
    w: 2 + Math.random() * 6,
    left: 5 + Math.random() * 90,
    bottom: 5 + Math.random() * 15,
    opacity: 0.4 + Math.random() * 0.4,
    delay: Math.random() * 12,
    dur: 8 + Math.random() * 10,
  }))
}

function generateDust(count: number) {
  return Array.from({ length: count }, () => ({
    w: 1 + Math.random() * 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    alpha: 0.1 + Math.random() * 0.2,
    glow: 1 + Math.random() * 3,
  }))
}

function generateSpotlights(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: 5 + i * 22,
    width: 60 + Math.random() * 100,
    rotate: -12 + Math.random() * 24,
  }))
}

export function SplineHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [embers] = useState(() => generateEmbers(15))
  const [dust] = useState(() => generateDust(30))
  const [spotlights] = useState(() => generateSpotlights(4))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const ctx = gsap.context(() => {
      // Animate embers (rising heat/sparks)
      gsap.utils.toArray<HTMLElement>('.hero-ember').forEach((ember) => {
        const delay = parseFloat(ember.dataset.delay || '0')
        const dur = parseFloat(ember.dataset.dur || '10')
        gsap.to(ember, {
          y: '-110vh',
          x: `random(-40, 40)`,
          opacity: 0,
          duration: dur,
          delay,
          repeat: -1,
          ease: 'power1.out',
        })
      })

      // Industrial Spotlights
      gsap.to('.industrial-spotlight', {
        opacity: 0.2,
        duration: 4,
        stagger: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Floating dust particles
      gsap.utils.toArray<HTMLElement>('.dust-particle').forEach((p) => {
        gsap.to(p, {
          y: `random(-50, 50)`,
          x: `random(-30, 30)`,
          duration: `random(4, 8)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: `random(0, 4)`,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [mounted])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      {/* ── Spline 3D Scene (Industrial Transition) ── */}
      <iframe
        src="https://my.spline.design/underwatertransition-8FSK06H8l3gK9VL4qah91vrS/"
        frameBorder="0"
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full"
        style={{
          border: 'none',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
          pointerEvents: 'none',
          filter: 'hue-rotate(170deg) saturate(1.4) brightness(0.8) contrast(1.1)',
        }}
        onLoad={() => setIsLoaded(true)}
        title="GALF Formation - Industrial 3D"
        allow="autoplay"
      />

      {/* ── Fallback background while Spline loads ── */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isLoaded ? 0 : 1,
          background: 'linear-gradient(180deg, #0e0e10 0%, #161618 50%, #0e0e10 100%)',
        }}
      />

      {/* ── Industrial embers / sparks (client-only) ── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {embers.map((e, i) => (
            <div
              key={i}
              className="hero-ember absolute rounded-full"
              data-delay={`${e.delay}`}
              data-dur={`${e.dur}`}
              style={{
                width: `${e.w}px`,
                height: `${e.w}px`,
                left: `${e.left}%`,
                bottom: `-${e.bottom}%`,
                background: `radial-gradient(circle at 30% 30%, #ffb000, #c47137)`,
                boxShadow: '0 0 10px #ffb000, 0 0 20px #c47137',
                opacity: e.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Industrial spotlights (client-only) ── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {spotlights.map((s, i) => (
            <div
              key={i}
              className="industrial-spotlight absolute top-0 opacity-0"
              style={{
                left: `${s.left}%`,
                width: `${s.width}px`,
                height: '100%',
                background: `linear-gradient(180deg, rgba(255,176,0,0.1) 0%, transparent 80%)`,
                transform: `rotate(${s.rotate}deg)`,
                filter: 'blur(40px)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Floating dust particles / metallic debris (client-only) ── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {dust.map((d, i) => (
            <div
              key={i}
              className="dust-particle absolute rounded-full"
              style={{
                width: `${d.w}px`,
                height: `${d.w}px`,
                left: `${d.left}%`,
                top: `${d.top}%`,
                background: `#8b939c`,
                boxShadow: `0 0 ${d.glow}px rgba(255,176,0,0.2)`,
                opacity: d.alpha,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Industrial overlays for text readability ── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(14,14,16,1) 0%, rgba(14,14,16,0.8) 40%, rgba(14,14,16,0.4) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0e0e10 0%, rgba(14,14,16,0.6) 35%, transparent 65%)',
        }}
      />

      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(14,14,16,0.8) 100%)',
        }}
      />

      {/* ── Blur Shield for internal Spline text ── */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'radial-gradient(circle at 30% 50%, rgba(14,14,16,0.4) 0%, transparent 60%)'
        }}
      />
    </div>
  )
}
