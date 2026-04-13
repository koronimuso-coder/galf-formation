"use client"
import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const whatsappNumber = "2250711826507"
  const defaultMessage = "Bonjour GALF Formation, je souhaite avoir plus d'informations sur vos offres de formation."

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      <span className="absolute right-20 px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none hidden md:block" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>
        Besoin d'aide ? +225 07 11 82 65 07
      </span>
      {/* Ping indicator */}
      <span className="absolute top-0 right-0 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2" style={{ borderColor: 'var(--galf-bg)' }}></span>
      </span>
    </a>
  )
}
