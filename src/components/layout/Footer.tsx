"use client"
import Link from "next/link"
import { HardHat, MapPin, Phone, Mail, ArrowRight, ChevronUp, Facebook, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="pt-24 pb-8 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-galf-yellow flex items-center justify-center">
                <HardHat className="text-galf-carbon w-6 h-6" />
              </div>
              <div className="text-2xl font-black tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                GALF<span className="text-galf-yellow">.</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--galf-text-secondary)' }}>
              Centre d'excellence pour la formation aux engins de chantier, équipements BTP, mines et transport lourd en Côte d'Ivoire.
            </p>
            <p className="text-[10px] font-black tracking-widest uppercase mb-6 p-2 rounded-md bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow">
              Agréé par le Ministère de l\'Enseignement Technique et de la Formation Professionnelle
            </p>
            <div className="space-y-3">
              <a href="https://wa.me/2250711826507" className="flex items-center gap-2 font-bold text-sm hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>
                <Phone className="w-4 h-4 text-galf-yellow" /> +225 07 11 82 65 07
              </a>
              <a href="mailto:galformation@gmail.com" className="flex items-center gap-2 text-sm hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text-secondary)' }}>
                <Mail className="w-4 h-4 text-galf-yellow" /> galformation@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                <MapPin className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" /> Yopougon, Marché Bagnon, Abidjan
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="https://facebook.com/galf.officiel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all bg-galf-surface border border-galf-border" style={{ color: 'var(--galf-text-secondary)' }}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all bg-galf-surface border border-galf-border" style={{ color: 'var(--galf-text-secondary)' }}>
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: 'var(--galf-text)' }}>Plateforme</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
              <li><Link href="/formations" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Nos formations</Link></li>
              <li><Link href="/entreprise" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Espace Entreprise</Link></li>
              <li><Link href="/inscription" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Inscription</Link></li>
              <li><Link href="/connexion" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Connexion</Link></li>
              <li><Link href="/programme-ambassadeur" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Programme Ambassadeur</Link></li>
              <li><Link href="/programme-ambassadeur/reglement" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Règlement</Link></li>
              <li><Link href="/programme-ambassadeur#faq" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Questions fréquentes</Link></li>
              <li><Link href="/programme-ambassadeur/connexion" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Connexion parrain</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: 'var(--galf-text)' }}>Découvrir</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
              <li><Link href="/a-propos" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> À propos</Link></li>
              <li><Link href="/blog" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Actualités</Link></li>
              <li><Link href="/mediatheque" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Médiathèque</Link></li>
              <li><Link href="/faq" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: 'var(--galf-text)' }}>Newsletter</h4>
            <p className="text-sm mb-4" style={{ color: 'var(--galf-text-secondary)' }}>Recevez nos offres et actualités BTP.</p>
            <form className="flex gap-2 mb-6">
              <input type="email" placeholder="Votre email" className="rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
              <button className="bg-galf-yellow text-galf-carbon px-4 py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all shrink-0">OK</button>
            </form>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-xs text-galf-yellow font-bold mb-1">📍 Horaires d'ouverture</div>
              <div className="text-xs" style={{ color: 'var(--galf-text-secondary)' }}>Lun - Sam : 08h00 - 18h00</div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ borderTop: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>
          <p>© {new Date().getFullYear()} GALF FORMATION. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/cgu" className="hover:text-galf-yellow transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-galf-yellow transition-colors">Confidentialité</Link>
          </div>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-xl bg-galf-surface border border-galf-border flex items-center justify-center hover:border-galf-yellow/50 hover:text-galf-yellow transition-all group"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}
