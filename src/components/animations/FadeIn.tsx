"use client"
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  duration?: number
  distance?: number
  style?: React.CSSProperties
}

export function FadeIn({ children, delay = 0, direction = 'up', className = '', duration = 1, distance = 60, style }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let x = 0, y = 0
    if (direction === 'up') y = distance
    if (direction === 'down') y = -distance
    if (direction === 'left') x = distance
    if (direction === 'right') x = -distance

    const anim = gsap.fromTo(el,
      { opacity: 0, x, y },
      {
        opacity: 1, x: 0, y: 0,
        duration, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none reverse" }
      }
    )

    return () => { anim.kill() }
  }, [direction, delay, duration, distance])

  // Initial styling ensures they become visible even if JS fails or is delayed. We let GSAP override opacity inline
  return <div ref={ref} className={`${className} transform-gpu`} style={style}>{children}</div>
}

/* ── Counter animation for stats ── */
export function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (hasAnimated) return
        setHasAnimated(true)
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (el) el.textContent = prefix + Math.floor(obj.val).toLocaleString('fr-FR') + suffix
          }
        })
      }
    })
  }, [target, suffix, prefix, hasAnimated])

  return <span ref={ref}>0</span>
}

/* ── Magnetic hover effect wrapper ── */
export function MagneticHover({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: "power2.out" })
    }
    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" })
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}

/* ── Parallax scroll wrapper ── */
export function Parallax({ children, speed = 0.2, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.to(el, {
      y: () => speed * ScrollTrigger.maxScroll(window) * -0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    })
  }, [speed])

  return <div ref={ref} className={className}>{children}</div>
}

/* ── Text reveal animation ── */
export function TextReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = el.querySelectorAll('.word')
    gsap.fromTo(words,
      { opacity: 0, y: 40, rotationX: -40 },
      {
        opacity: 1, y: 0, rotationX: 0,
        stagger: 0.05, duration: 0.8, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
      }
    )
  }, [text, delay])

  return (
    <div ref={ref} className={className} style={{ perspective: '600px' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="word inline-block mr-[0.3em]">{word}</span>
      ))}
    </div>
  )
}
