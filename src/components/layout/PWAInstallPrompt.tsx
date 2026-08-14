"use client"

import { useState, useEffect } from 'react'
import { HardHat, Download, X, Smartphone, Sparkles, CheckCircle2, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

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
    }

    // 3. Détection iOS
    const ua = window.navigator.userAgent
    const isAppleIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
    setIsIOS(isAppleIOS)

    // 4. Écoute de l'événement PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)

      const dismissedTime = localStorage.getItem('galf_pwa_dismissed')
      if (dismissedTime) {
        const elapsed = Date.now() - parseInt(dismissedTime, 10)
        if (elapsed < 24 * 60 * 60 * 1000) return
      }

      setShowPrompt(true)
    }

    // 5. Écoute du déclenchement manuel (Clic sur le bouton "Installer App" dans le menu)
    const handleManualTrigger = () => {
      setShowModal(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('galf-open-pwa-modal', handleManualTrigger)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('galf-open-pwa-modal', handleManualTrigger)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setShowPrompt(false)
      setShowModal(false)
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    } else {
      // Fallback instructions modal for browsers where prompt is not directly available
      setShowModal(true)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowModal(false)
    localStorage.setItem('galf_pwa_dismissed', Date.now().toString())
  }

  return (
    <>
      {/* ── BANNIÈRE D'INSTALLATION AUTOMATIQUE PWA (En bas à droite) ── */}
      {showPrompt && !isInstalled && (
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
                    Android &amp; iPhone
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

      {/* ── MODAL D'INSTRUCTIONS COMPLÈTE PWA (Déclenchée au clic dans le Menu) ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/30 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white relative space-y-5">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <HardHat className="w-7 h-7 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Télécharger l&apos;Application GALF</h3>
                <p className="text-xs text-amber-400 font-bold">Compatible Android, iPhone (iOS) &amp; Ordinateur</p>
              </div>
            </div>

            {/* Android / PC Direct Action */}
            {deferredPrompt ? (
              <div className="space-y-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Installation automatique disponible</span>
                </div>
                <p className="text-xs text-slate-300">
                  Votre navigateur prend en charge l&apos;installation directe en un clic.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Installer sur mon appareil</span>
                </button>
              </div>
            ) : null}

            {/* Guide Android */}
            <div className="space-y-2 bg-slate-950/60 border border-white/10 p-4 rounded-2xl text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Pour Android (Chrome / Edge) :</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                <li>Appuyez sur les <strong>3 points verticalement (⋮)</strong> en haut à droite du navigateur</li>
                <li>Sélectionnez <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong> ou <strong>&quot;Installer l&apos;application&quot;</strong></li>
                <li>Validez pour ajouter l&apos;icône GALF FORMATION sur votre téléphone</li>
              </ol>
            </div>

            {/* Guide iPhone / iOS */}
            <div className="space-y-2 bg-slate-950/60 border border-white/10 p-4 rounded-2xl text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-2">
                <Share className="w-4 h-4 text-amber-400" />
                <span>Pour iPhone / iPad (Safari) :</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                <li>Appuyez sur l&apos;icône de <strong>Partage</strong> en bas au centre dans Safari</li>
                <li>Faites défiler vers le bas et appuyez sur <strong>&quot;Sur l&apos;écran d&apos;accueil&quot;</strong></li>
                <li>Appuyez sur <strong>Ajouter</strong> en haut à droite</li>
              </ol>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Fonction globale pour déclencher l'ouverture du Modal PWA depuis n'importe quel bouton */
export function openPWAModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('galf-open-pwa-modal'))
  }
}
