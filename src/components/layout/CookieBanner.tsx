"use client"
import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import { gsap } from 'gsap'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem('galf-cookies-accepted')
    if (!hasAccepted) {
      // Delay showing the banner to let the initial animations finish
      const timer = setTimeout(() => {
        setIsVisible(true)
        gsap.fromTo('.cookie-banner', 
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
        )
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('galf-cookies-accepted', 'true')
    gsap.to('.cookie-banner', {
      y: 100, opacity: 0, duration: 0.5, ease: "power2.in",
      onComplete: () => setIsVisible(false)
    })
  }

  if (!isVisible) return null

  return (
    <div className="cookie-banner fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 rounded-2xl z-50 shadow-[0_10px_40px_rgba(0,0,0,0.3)] glass-card" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)' }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5 text-galf-yellow" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-sm" style={{ color: 'var(--galf-text)' }}>Préférences Cookies</h4>
            <button onClick={handleAccept} className="text-gray-400 hover:text-galf-yellow transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs mb-3 opacity-80" style={{ color: 'var(--galf-text-secondary)' }}>
            Nous utilisons des cookies pour optimiser votre expérience, analyser notre trafic et sécuriser le site.
          </p>
          <div className="flex gap-2">
            <button onClick={handleAccept} className="flex-1 bg-galf-yellow text-galf-carbon py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all">
              Accepter
            </button>
            <button onClick={handleAccept} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all" style={{ border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
