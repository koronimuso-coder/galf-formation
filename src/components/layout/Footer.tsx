"use client"
import Link from "next/link"
import { HardHat, MapPin, Phone, Mail, ArrowRight, ChevronUp, Facebook, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="pt-24 pb-8 relative overflow-hidden" style={{ background: 'var(--galf-bg-alt)', borderTop: '1px solid var(--galf-border)' }}>
      {/* Dynamic Background Constellation */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="footerLaserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
          </defs>
          <g className="stitch-orbit" style={{ transformOrigin: '50% 50%' }}>
            <circle cx="50%" cy="50%" r="300" fill="none" stroke="url(#footerLaserGrad)" strokeWidth="1.5" strokeDasharray="5 15" />
            <circle cx="50%" cy="50%" r="450" fill="none" stroke="url(#footerLaserGrad)" strokeWidth="0.75" strokeDasharray="3 20" />
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#footerLaserGrad)" strokeWidth="0.5" strokeDasharray="5 10" />
            <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="url(#footerLaserGrad)" strokeWidth="0.5" strokeDasharray="5 10" />
          </g>
          <path d="M 0 100 Q 250 50 500 100 T 1000 100" fill="none" stroke="url(#footerLaserGrad)" strokeWidth="1.5" className="stitch-light-pulse" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-galf-yellow to-[#ffd700] flex items-center justify-center shadow-lg shadow-galf-yellow/10 group-hover:rotate-6 transition-transform">
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
              Agréé par le Ministère de l'Enseignement Technique et de la Formation Professionnelle
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
              <a href="https://facebook.com/galf.officiel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all bg-galf-surface border border-galf-border shadow-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all bg-galf-surface border border-galf-border shadow-sm" style={{ color: 'var(--galf-text-secondary)' }}>
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: 'var(--galf-text)' }}>Plateforme</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
              <li><Link href="/formations" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Nos formations</Link></li>
              <li><Link href="/entreprise" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Espace Entreprise</Link></li>
              <li><Link href="/recrutement" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Recrutement BTP</Link></li>
              <li><Link href="/financement" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Financements</Link></li>
              <li><Link href="/accreditations" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Accréditations & Normes</Link></li>
              <li><Link href="/rse-impact" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Charte RSE & Impact</Link></li>
              <li><Link href="/inscription" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Inscription</Link></li>
              <li><Link href="/programme-ambassadeur" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Programme Ambassadeur</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: 'var(--galf-text)' }}>Découvrir</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--galf-text-secondary)' }}>
              <li><Link href="/a-propos" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> À propos</Link></li>
              <li><Link href="/blog" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Actualités</Link></li>
              <li><Link href="/mediatheque" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Médiathèque</Link></li>
              <li><Link href="/mediatheque/quiz-securite" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Quiz Sécurité CACES</Link></li>
              <li><Link href="/mediatheque/inspection-visuelle" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Inspection VGP</Link></li>
              <li><Link href="/mediatheque/commandes-vocales" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Talkie-Walkie</Link></li>
              <li><Link href="/mediatheque/chasse-aux-risques" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Chasse aux Risques HSE</Link></li>
              <li><Link href="/instructeur/train-the-trainer" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> Espace Formateurs (Train-the-Trainer)</Link></li>
              <li><Link href="/faq" className="hover:text-galf-yellow transition-colors flex items-center gap-1"><ArrowRight className="w-3 h-3 text-galf-yellow" /> FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: 'var(--galf-text)' }}>Newsletter</h4>
            <p className="text-sm mb-4" style={{ color: 'var(--galf-text-secondary)' }}>Recevez nos offres et actualités BTP.</p>
            <form className="flex gap-2 mb-6">
              <input type="email" placeholder="Votre email" className="rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-surface)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
              <button className="bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon px-4 py-3 rounded-lg font-black text-sm hover:brightness-110 transition-all shrink-0">OK</button>
            </form>
            <div className="glass-card p-4 rounded-lg border border-galf-yellow/20">
              <div className="text-xs text-galf-yellow font-bold mb-1 flex items-center gap-1">
                <span>📍 Horaires d'ouverture</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--galf-text-secondary)' }}>Lun - Sam : 08h00 - 18h00</div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs relative" style={{ borderTop: '1px solid var(--galf-border)', color: 'var(--galf-text-secondary)' }}>
          <div className="absolute top-[-1px] left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-galf-yellow to-[#ffd700]" />
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
