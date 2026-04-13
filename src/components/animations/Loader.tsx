"use client"
import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { HardHat } from 'lucide-react'

export function Loader() {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ 
      onComplete: () => setIsComplete(true),
      defaults: { ease: "expo.inOut" } 
    })

    tl.set('.loader-container', { background: 'black' })
      .to('.loader-logo', { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.7)" })
      .to('.loader-text-char', { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 }, "-=0.6")
      .to('.loader-progress-bar', { width: "100%", duration: 2, ease: "power4.inOut" }, "-=0.4")
      .to('.loader-logo', { scale: 0.8, opacity: 0, duration: 0.5 }, "+=0.2")
      .to('.loader-text-char', { y: -20, opacity: 0, duration: 0.4, stagger: 0.02 }, "-=0.3")
      .to('.loader-container', { opacity: 0, duration: 0.8, ease: "power2.inOut" })
      .to('.loader-container', { display: 'none', duration: 0 })

    return () => { tl.kill() }
  }, [])

  if (isComplete) return null

  const text = "GALF FORMATION"

  return (
    <div className="loader-container fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Texture noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="loader-logo opacity-0 scale-50 inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-galf-yellow mb-10 shadow-[0_0_50px_rgba(255,176,0,0.4)]">
          <HardHat className="text-galf-carbon w-14 h-14" />
        </div>

        <div className="flex overflow-hidden mb-10">
          {text.split("").map((char, i) => (
            <span key={i} className="loader-text-char font-black text-3xl md:text-5xl tracking-tighter translate-y-20 opacity-0 whitespace-pre" 
              style={{ color: i < 4 ? 'var(--galf-yellow)' : 'white' }}>
              {char}
            </span>
          ))}
        </div>

        <div className="w-48 h-[2px] rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="loader-progress-bar absolute top-0 left-0 h-full bg-galf-yellow w-0 rounded-full shadow-[0_0_10px_#FFB000]" />
        </div>
        
        <div className="mt-6 text-[10px] uppercase tracking-[0.5em] font-black text-white/40 animate-pulse">
          Excellence Industrielle
        </div>
      </div>

      {/* Rhythmic ambient pulses */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-1 h-1 bg-galf-yellow/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  )
}
