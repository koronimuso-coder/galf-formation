"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Gift, Award, CheckCircle, ChevronDown, 
  ArrowRight, ShieldCheck, HelpCircle as HelpIcon, Sparkles, Heart, CheckCircle2, ChevronRight
} from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { GALF_FORMATIONS } from '@/lib/data'
import { logReferralClick, setAttributionCookie, getCampaigns } from '@/lib/firebase/services/referral'
import { PageHeader } from '@/components/layout/PageHeader'

function ReferralTracker() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  
  useEffect(() => {
    if (ref) {
      setAttributionCookie(ref)
      // Log click with mock client IP
      logReferralClick(
        ref, 
        "client-ip", 
        typeof window !== "undefined" ? window.navigator.userAgent : "SSR", 
        typeof document !== "undefined" ? document.referrer : "direct"
      )
    }
  }, [ref])
  
  return ref ? (
    <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl border border-galf-yellow/30 bg-galf-yellow/5 backdrop-blur-md flex items-center justify-between text-left animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Code Parrain Détecté !</h4>
          <p className="text-[10px] text-galf-text-secondary">Vous êtes recommandé par l'ambassadeur <strong className="text-galf-yellow font-mono">{ref}</strong>. Votre code sera pré-appliqué à l'inscription.</p>
        </div>
      </div>
      <Link href="/inscription" className="bg-galf-yellow text-galf-carbon px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:brightness-110 transition-all shadow-md shrink-0">
        S'inscrire maintenant
      </Link>
    </div>
  ) : null
}

export default function ProgrammeAmbassadeur() {
  // Simulation states
  const [recommendCount, setRecommendCount] = useState(15)
  const [convRate, setConvRate] = useState(33) // default ~33%
  const [selectedFormationId, setSelectedFormationId] = useState(GALF_FORMATIONS[1].id) // default Chariot Elevateur

  // FAQ states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        await getCampaigns()
      } catch (e) {
        console.error(e)
      }
    }
    fetchCampaigns()
  }, [])

  const selectedFormation = GALF_FORMATIONS.find(f => f.id === selectedFormationId) || GALF_FORMATIONS[1]
  const estEnrollments = Math.round((recommendCount * convRate) / 100)
  const isEligible = estEnrollments >= 5

  const faqs = [
    {
      q: "Qui peut participer au Programme Ambassadeur ?",
      a: "Toute personne physique majeure résidant en Côte d'Ivoire (anciens apprenants, stagiaires, partenaires, sympathisants ou simplement personnes souhaitant recommander nos formations de pointe) peut participer gratuitement."
    },
    {
      q: "Comment obtenir mon code personnel ?",
      a: "Il vous suffit de créer un compte en quelques clics via le bouton d'inscription. Un code unique au format GALF-PRENOM-XXXX ainsi qu'un lien de parrainage et un QR code vous seront automatiquement attribués."
    },
    {
      q: "Quand un filleul compte-t-il comme une inscription validée ?",
      a: "Un filleul est comptabilisé lorsque son dossier est administrativement complet, qu'il a réglé l'acompte obligatoire requis pour sa formation (minimum 30%), et que le paiement a été vérifié par notre service financier."
    },
    {
      q: "Puis-je parrainer un membre de ma famille ?",
      a: "Absolument ! Notre slogan est 'Ne sois pas le sorcier de ta famille'. Nous vous encourageons à partager ces opportunités professionnelles avec vos proches pour les aider à s'insérer sur le marché de l'emploi."
    },
    {
      q: "Puis-je utiliser mon propre code pour ma propre inscription ?",
      a: "Non, l'auto-parrainage est détecté par nos systèmes anti-fraude. Vous ne pouvez pas être le parrain de votre propre inscription."
    },
    {
      q: "Puis-je cumuler plusieurs récompenses ?",
      a: "Oui ! Le cumul est autorisé. Pour chaque groupe de 5 filleuls validés dans la même campagne, vous gagnez une nouvelle formation offerte. (5 filleuls = 1 formation, 10 filleuls = 2 formations, etc.)"
    },
    {
      q: "Puis-je changer la formation choisie en récompense ?",
      a: "Oui, au moment où vous atteignez le seuil des 5 parrainages, vous pouvez choisir n'importe quelle formation éligible dans notre catalogue avant de soumettre votre dossier à la validation administrative."
    },
    {
      q: "Que se passe-t-il si un filleul annule son inscription ?",
      a: "Si une inscription est annulée ou remboursée avant le démarrage de la formation, elle est retirée de votre compteur, et votre progression est recalculée en conséquence."
    },
    {
      q: "Puis-je recevoir de l'argent ou du cash à la place de la formation ?",
      a: "Non, la récompense est uniquement octroyée sous forme d'accès gratuit à une formation professionnelle certifiante pour vous-même ou pour la personne de votre choix (cessible sous conditions)."
    },
    {
      q: "Quand ma récompense finale est-elle validée ?",
      a: "Dès que le compteur de filleuls validés atteint 5, le dossier passe en 'Éligible'. Une vérification administrative humaine de 48h est effectuée pour confirmer la conformité (absence de fraude, vérification des règlements) avant de libérer le bon de formation."
    },
    {
      q: "Comment contacter le service parrainage de GALF ?",
      a: "Vous pouvez nous joindre à tout moment via le bouton de support WhatsApp officiel au +225 07 11 82 65 07 ou par e-mail à galformation@gmail.com."
    }
  ]

  const steps = [
    { title: "Création du compte", desc: "Créez votre profil en 1 minute gratuitement." },
    { title: "Réception du code", desc: "Obtenez instantanément votre code unique." },
    { title: "Partagez l'opportunité", desc: "Envoyez votre lien ou QR code par WhatsApp." },
    { title: "Inscriptions proches", desc: "Vos filleuls s'inscrivent avec votre code." },
    { title: "Validation GALF", desc: "Nous vérifions l'acompte et les coordonnées." },
    { title: "Atteindre le Seuil", desc: "Cumulez 5 inscriptions validées." },
    { title: "Examen du dossier", desc: "Une vérification administrative rapide." },
    { title: "Formation Offerte", desc: "Bénéficiez de la formation de votre choix." }
  ]

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Graphic Accents */}
      <div className="absolute right-[-20%] top-[10%] w-[900px] h-[900px] opacity-[0.02] pointer-events-none z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-galf-yellow">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

      <PageHeader 
        title="PROGRAMME AMBASSADEUR"
        subtitle="Partagez l'opportunité, changez des vies et financez votre avenir."
        badge="Partage commercial d'excellence"
        bgImage="/images/cinematic/animate-2026-04-15T170949.508-ezgif.com-video-to-webp-converter.webp"
        centered={true}
      />

      <div className="container-galf mt-12 relative z-10">
        {/* Suspense Wrapper for SearchParams to prevent SSR hydration bailouts */}
        <Suspense fallback={<div className="h-4" />}>
          <ReferralTracker />
        </Suspense>

        {/* 1. HERO COMMERCIAL SECTION */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20 mt-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hero-badge-industrial text-[10px] font-black uppercase tracking-wider mb-2">
                <Gift className="w-3.5 h-3.5 animate-bounce text-galf-yellow" /> Campagne Active : 5 Filleuls = 1 Formation Offerte
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none mb-4 text-white">
                NE SOIS PAS LE <br className="hidden md:inline" />
                <span className="text-galf-yellow text-glow-yellow">SORCIER</span> DE TA FAMILLE
              </h1>
              <p className="text-lg md:text-xl font-bold max-w-xl leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                Tu connais GALF FORMATION ? Ne garde pas l’information pour toi. Partage l’opportunité autour de toi, oriente tes proches vers des métiers d'avenir.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/programme-ambassadeur/inscription" className="hero-cta-primary px-8 py-5 rounded-xl font-black text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                  Obtenir mon code parrain <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#fonctionnement" className="hero-cta-secondary px-8 py-5 rounded-xl font-black text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all">
                  Découvrir le programme
                </a>
              </div>
              <p className="text-[10px] opacity-50 mt-3 text-white italic">Participation 100% gratuite. Règlements et conditions applicables.</p>
            </FadeIn>
          </div>

          {/* Large Promo Card */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.25}>
              <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden border-2 border-galf-yellow/30 bg-black/40 glow-yellow shadow-2xl text-left">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Award className="w-32 h-32 text-galf-yellow" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-galf-yellow/10 flex items-center justify-center mb-6 border border-galf-yellow/30">
                  <Gift className="w-6 h-6 text-galf-yellow" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Règle d'or du programme</h3>
                <p className="text-sm text-galf-text-secondary leading-relaxed mb-6">
                  Pour chaque groupe de <span className="text-galf-yellow font-black">5 inscriptions payées et confirmées</span> grâce à votre code parrain, GALF FORMATION vous offre la formation de votre choix.
                </p>
                
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-galf-text-secondary">
                  <div className="flex justify-between items-center">
                    <span>Statut campagne :</span>
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-black uppercase text-[9px] tracking-widest border border-green-500/20">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Slogan officiel :</span>
                    <span className="italic text-white">"Partage l'opportunité, change une vie."</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 2. STATS PROOF BLOCK */}
        <div className="mb-20">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Ambassadeurs Actifs", val: "1 240", icon: Users },
                { label: "Personnes Recommandées", val: "4 830", icon: Heart },
                { label: "Inscriptions Confirmées", val: "842", icon: CheckCircle },
                { label: "Formations Offertes", val: "168", icon: Award },
              ].map((s, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl text-center border border-white/5 hover:border-galf-yellow/20 transition-all cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-galf-yellow/10 flex items-center justify-center mx-auto mb-3 text-galf-yellow">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white">{s.val}</div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-white/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* 3. INTERACTIVE SIMULATOR */}
        <div className="glass-card p-8 md:p-12 rounded-[2.5rem] mb-20 border-white/5 text-left relative overflow-hidden bg-black/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[5rem]" />
          <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight text-white">Simulateur de Progression Pédagogique</h2>
          <p className="text-xs text-white/60 mb-8 max-w-xl">Estimez vos résultats en recommandant GALF autour de vous et déterminez votre éligibilité à la formation gratuite.</p>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-white/70">
                  <span>Personnes à qui recommander</span>
                  <span className="text-galf-yellow text-sm font-black">{recommendCount} personnes</span>
                </div>
                <input 
                  type="range" min="5" max="50" step="5" value={recommendCount}
                  onChange={e => setRecommendCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-white/70">
                  <span>Taux estimé d'inscription</span>
                  <span className="text-galf-yellow text-sm font-black">{convRate}% des contacts</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5" value={convRate}
                  onChange={e => setConvRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">Formation souhaitée en récompense</label>
                <select 
                  value={selectedFormationId}
                  onChange={e => setSelectedFormationId(e.target.value)}
                  className="w-full bg-galf-bg border border-galf-border rounded-xl p-4 text-xs text-white outline-none focus:border-galf-yellow cursor-pointer"
                >
                  {GALF_FORMATIONS.filter(f => f.status === 'Actif').map(f => (
                    <option key={f.id} value={f.id}>{f.name} (Valeur : {(f.pricePromo || f.price).toLocaleString('fr-FR')} F CFA)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between h-full min-h-[200px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Inscriptions Estimées</span>
                    <span className="text-xs font-black text-white/60 font-mono">Seuil requis : 5</span>
                  </div>
                  <div className="text-4xl font-black text-white flex items-baseline gap-2">
                    <span className={isEligible ? "text-green-400" : "text-galf-yellow"}>{estEnrollments}</span>
                    <span className="text-xs text-white/40">filleuls validés</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isEligible ? "bg-green-500" : "bg-galf-yellow"}`}
                      style={{ width: `${Math.min(100, (estEnrollments / 5) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-xs">
                  {isEligible ? (
                    <p className="text-green-400 font-bold">
                      🎉 Estimation : Éligibilité débloquée ! En recommandant GALF à {recommendCount} personnes, vous devriez obtenir votre formation <strong className="underline">{selectedFormation.name}</strong> 100% offerte.
                    </p>
                  ) : (
                    <p className="text-white/60">
                      Il vous manque <strong className="text-galf-yellow">{5 - estEnrollments}</strong> filleul(s) validé(s) pour obtenir votre formation offerte. Augmentez le nombre de recommandations !
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. STEPS SECTION */}
        <div id="fonctionnement" className="mb-20 text-left">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-black mb-10 uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-galf-yellow rounded-full" /> Comment fonctionne le programme ?
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={0.05 * idx}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 relative group hover:border-galf-yellow/20">
                  <div className="w-10 h-10 rounded-xl bg-galf-surface-alt border border-galf-border flex items-center justify-center text-xs font-black text-white/50 group-hover:text-galf-yellow group-hover:border-galf-yellow/40 transition-all mb-4">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-black text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-galf-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* 5. FORMATIONS ÉLIGIBLES */}
        <div className="mb-20 text-left">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-black mb-10 uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-galf-yellow rounded-full" /> Formations éligibles
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALF_FORMATIONS.filter(f => f.status === 'Actif' && f.featured).map((f, i) => (
              <FadeIn key={f.id} delay={0.05 * i}>
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5 group hover:border-galf-yellow/20 transition-all flex flex-col justify-between h-full bg-black/20">
                  <div>
                    <div className="h-44 overflow-hidden relative border-b border-white/5 bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/about/candidat-check.png" alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-galf-yellow text-galf-carbon text-[9px] font-black uppercase tracking-wider">
                        {f.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="text-base font-black text-white">{f.name}</h4>
                      <p className="text-xs text-galf-text-secondary line-clamp-2 leading-relaxed">{f.shortDesc}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-bold text-white/50">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-wider">Tarif Normal</span>
                      <span className="text-sm font-black text-white">{(f.pricePromo || f.price).toLocaleString('fr-FR')} F CFA</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] uppercase tracking-wider">Récompense</span>
                      <span className="text-green-400 font-bold">100% Éligible</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/formations" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-galf-yellow hover:underline">
              Consulter tout le catalogue de formations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 6. AVERTISSEMENTS & CONDITIONS */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 text-left">
          {/* Pourquoi Ambassadeur */}
          <FadeIn>
            <div className="glass-card p-8 rounded-[2rem] border-white/5 h-full">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                🌟 Pourquoi devenir Ambassadeur ?
              </h3>
              <ul className="space-y-4 text-xs text-galf-text-secondary leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" />
                  <span><strong>Aider ses proches</strong> : Proposer des formations solides vers des métiers porteurs (mines, BTP, logistique).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" />
                  <span><strong>Zéro frais</strong> : La participation est entièrement gratuite et ouverte à tous.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" />
                  <span><strong>Économiser 100%</strong> : Obtenez une certification professionnelle d'une valeur allant jusqu'à 850 000 F CFA.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-galf-yellow shrink-0 mt-0.5" />
                  <span><strong>Réseau & Communauté</strong> : Intégrez le réseau d'ambassadeurs GALF et recevez des invitations aux chantiers-écoles.</span>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Ce qui valide une inscription */}
          <FadeIn delay={0.1}>
            <div className="glass-card p-8 rounded-[2rem] border-white/5 h-full">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-galf-yellow" /> Ce qui valide une inscription filleul
              </h3>
              <p className="text-xs text-galf-text-secondary mb-4 leading-relaxed">Pour être comptabilisé dans votre progression, le filleul recommandé doit respecter les critères de conformité administratifs :</p>
              <ul className="space-y-3.5 text-xs text-galf-text-secondary leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-galf-yellow font-black shrink-0">✓</span>
                  <span><strong>Personne réelle</strong> : Ses coordonnées WhatsApp et d'identité doivent être vérifiées et valides.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-galf-yellow font-black shrink-0">✓</span>
                  <span><strong>Dossier Conforme</strong> : Enregistrement de sa pré-inscription officielle dans nos systèmes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-galf-yellow font-black shrink-0">✓</span>
                  <span><strong>Acompte Payé</strong> : Dépôt minimum de 30% validé par le validateur comptable GALF.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-galf-yellow font-black shrink-0">✓</span>
                  <span><strong>Aucune Fraude</strong> : Toute tentative d'auto-parrainage ou de doublon suspend le dossier pour vérification administrative.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* 7. FAQ SECTION */}
        <div id="faq" className="mb-20 text-left max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-black mb-10 uppercase tracking-tight text-center text-white flex items-center justify-center gap-2">
              <HelpIcon className="w-6 h-6 text-galf-yellow" /> Questions Fréquentes (FAQ)
            </h2>
          </FadeIn>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <FadeIn key={idx} delay={0.05 * idx}>
                  <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                    <button 
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center text-white font-bold text-sm hover:bg-white/5 transition-colors gap-4"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-galf-yellow shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-galf-text-secondary leading-relaxed border-t border-white/5 bg-black/10 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>

        {/* 8. FOOTER CONTACT BUTTON */}
        <div className="glass-card p-8 rounded-3xl text-center max-w-xl mx-auto border-galf-yellow/20">
          <h4 className="text-base font-black text-white mb-2">Une question complémentaire ?</h4>
          <p className="text-xs text-galf-text-secondary mb-6">Nos experts en parrainage sont à votre service pour vous orienter.</p>
          <a href="https://wa.me/2250711826507" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white font-black px-6 py-3.5 rounded-xl text-xs hover:brightness-110 transition-all shadow-lg">
            📞 Contacter GALF sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
