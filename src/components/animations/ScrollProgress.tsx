"use client"
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const tl = gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none">
       <div 
        ref={barRef}
        className="h-full bg-galf-yellow origin-left scale-x-0 shadow-[0_0_10px_rgba(255,176,0,0.5)]"
       />
    </div>
  )
}
