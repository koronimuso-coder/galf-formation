"use client"

import { useState, useEffect } from 'react'
import { HardHat, Download, X, Smartphone, Sparkles } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // 1. Enregistrement du Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('PWA Service Worker registration failed:', err)
        })
      })
    }

    // 2. Vérification si déjà en mode standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // 3. Détection iOS
    const ua = window.navigator.userAgent
    const isAppleIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
    setIsIOS(isAppleIOS)

    // 4. Écoute de l'événement PWA (Android / Desktop Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)

      // Vérifier si l'utilisateur n'a pas fermé le prompt récemment (24h)
      const dismissedTime = localStorage.getItem('galf_pwa_dismissed')
      if (dismissedTime) {
        const elapsed = Date.now() - parseInt(dismissedTime, 10)
        if (elapsed < 24 * 60 * 60 * 1000) return
      }

      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    setShowPrompt(false)
    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSGuide(false)
    localStorage.setItem('galf_pwa_dismissed', Date.now().toString())
  }

  if (isInstalled) return null

  return (
    <>
      {/* ── BANNIÈRE D'INSTALLATION FLOOTTANTE PWA ── */}
      {showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-950/95 dark:bg-slate-900/98 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-slate-950/80 text-white relative">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fermer la notification PWA"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <HardHat className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">Application GALF CI</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    PWA Officiel
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Installez l&apos;application sur votre écran d&apos;accueil pour un accès instantané et le mode hors-ligne.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={handleDismiss}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 transition-colors"
              >
                Plus tard
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Installer maintenant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GUIDE D'INSTALLATION IOS (Apple Safari) ── */}
      {isIOS && !showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs z-40">
          <button
            onClick={() => setShowIOSGuide(!showIOSGuide)}
            className="w-full bg-slate-950/90 backdrop-blur-md border border-amber-500/30 text-white p-3 rounded-2xl flex items-center justify-between shadow-xl text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              Installer sur iPhone / iPad
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {showIOSGuide && (
            <div className="mt-2 bg-slate-950/95 border border-white/10 text-slate-200 p-4 rounded-2xl text-xs space-y-2 backdrop-blur-2xl shadow-2xl">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>Pour installer sur iOS :</span>
                <button onClick={() => setShowIOSGuide(false)}><X className="w-3.5 h-3.5" /></button>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Appuyez sur le bouton <strong>Partager</strong> dans Safari</li>
                <li>Faites défiler et sélectionnez <strong>Sur l&apos;écran d&apos;accueil</strong></li>
                <li>Appuyez sur <strong>Ajouter</strong></li>
              </ol>
            </div>
          )}
        </div>
      )}
    </>
  )
}
