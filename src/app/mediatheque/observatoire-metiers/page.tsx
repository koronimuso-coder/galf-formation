"use client"
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FadeIn } from '@/components/animations/FadeIn'
import Link from 'next/link'
import { TrendingUp, DollarSign, Building2, ShieldCheck, ArrowRight } from 'lucide-react'

// Regional career database
const OBSERVATORY_DATA: {
  [countryCode: string]: {
    countryName: string,
    machines: {
      [machineKey: string]: {
        name: string,
        minSalary: number,
        maxSalary: number,
        tension: 'Critique' | 'Très Élevée' | 'Élevée' | 'Moyenne',
        certification: string,
        recruiters: string[],
        growth: string
      }
    }
  }
} = {
  ci: {
    countryName: "Côte d'Ivoire",
    machines: {
      pelle: { name: "Pelle Hydraulique", minSalary: 250000, maxSalary: 450000, tension: "Très Élevée", certification: "CACES R482 B1", recruiters: ["PFO CI", "SOGEA-SATOM", "Eiffage CI"], growth: "+35% ce trimestre" },
      grue: { name: "Grue à Tour / Mobile", minSalary: 300000, maxSalary: 600000, tension: "Critique", certification: "CACES R487 / R483", recruiters: ["Port Autonome d'Abidjan", "Bouygues CI", "Carena"], growth: "+45% sur Abidjan" },
      foreuse: { name: "Foreuse de Mine", minSalary: 400000, maxSalary: 850000, tension: "Critique", certification: "Spécifique Mine & Sondage", recruiters: ["Endeavour Mining", "Ity Gold", "Tongon"], growth: "+60% en zone minière" },
      bulldozer: { name: "Bulldozer / Bouteur", minSalary: 280000, maxSalary: 500000, tension: "Élevée", certification: "CACES R482 C1", recruiters: ["SMB", "Razel-Bec CI", "Kouba BTP"], growth: "+30% projets routiers" },
      chariot: { name: "Chariot Élévateur (Cariste)", minSalary: 150000, maxSalary: 280000, tension: "Moyenne", certification: "CACES R489 Cat 3 & 4", recruiters: ["CMA CGM CI", "Bolloré Logistique", "Brassivoire"], growth: "+25% zone portuaire" }
    }
  },
  sn: {
    countryName: "Sénégal",
    machines: {
      pelle: { name: "Pelle Hydraulique", minSalary: 220000, maxSalary: 420000, tension: "Élevée", certification: "Norme CACES R482", recruiters: ["CSE Sénégal", "Eiffage Sénégal", "Consortium Entreprises"], growth: "+28% projets urbains" },
      grue: { name: "Grue à Tour / Mobile", minSalary: 280000, maxSalary: 550000, tension: "Très Élevée", certification: "Norme CACES R487", recruiters: ["Port Autonome de Dakar", "Sénégalaise des Eaux", "SPIE"], growth: "+40% Diamniadio" },
      foreuse: { name: "Foreuse de Mine", minSalary: 380000, maxSalary: 800000, tension: "Critique", certification: "Spécifique Extraction", recruiters: ["Sabodala-Gold", "Grande Côte Operations", "Dangote Cement"], growth: "+50% secteur phosphate/or" },
      bulldozer: { name: "Bulldozer / Bouteur", minSalary: 250000, maxSalary: 480000, tension: "Élevée", certification: "Norme CACES R482", recruiters: ["CDE Sénégal", "Arela BTP", "Sénégal Travaux"], growth: "+25% autoroute Mbour" },
      chariot: { name: "Chariot Élévateur (Cariste)", minSalary: 140000, maxSalary: 260000, tension: "Moyenne", certification: "Norme CACES R489", recruiters: ["DP World Dakar", "Kirène", "PATISEN"], growth: "+22% logistique Diamniadio" }
    }
  },
  ml: {
    countryName: "Mali",
    machines: {
      pelle: { name: "Pelle Hydraulique", minSalary: 280000, maxSalary: 500000, tension: "Très Élevée", certification: "Option Mines & TP", recruiters: ["Somilo SA", "B2Gold Mali", "Eiffage Mali"], growth: "+40% chantiers d'or" },
      grue: { name: "Grue à Tour / Mobile", minSalary: 320000, maxSalary: 580000, tension: "Élevée", certification: "Habilitation Levage", recruiters: ["Mali Levage", "Sogea Satom Bamako", "Hydro-Mali"], growth: "+30% infrastructures" },
      foreuse: { name: "Foreuse de Mine", minSalary: 450000, maxSalary: 950000, tension: "Critique", certification: "Sondage & Forage Profond", recruiters: ["Syama Gold Mine", "Barrick Gold Loulo", "Fekola Mine"], growth: "+70% forte demande" },
      bulldozer: { name: "Bulldozer / Bouteur", minSalary: 300000, maxSalary: 520000, tension: "Très Élevée", certification: "Option Nivellement", recruiters: ["Resolute Mining", "Mali BTP", "Eaux et Forêts"], growth: "+35% terrassement minier" },
      chariot: { name: "Chariot Élévateur (Cariste)", minSalary: 160000, maxSalary: 300000, tension: "Moyenne", certification: "Logistique & Entrepôt", recruiters: ["Bramali", "Mali Lait", "Transit Sahel"], growth: "+20% hubs Bamako" }
    }
  },
  gn: {
    countryName: "Guinée",
    machines: {
      pelle: { name: "Pelle Hydraulique", minSalary: 300000, maxSalary: 550000, tension: "Critique", certification: "Habilitation Carrière", recruiters: ["CBG (Bauxite)", "GAC Guinée", "Soguipres"], growth: "+50% projet Simandou" },
      grue: { name: "Grue à Tour / Mobile", minSalary: 350000, maxSalary: 650000, tension: "Très Élevée", certification: "Norme Internationale", recruiters: ["Port de Conakry", "Guinée Levage", "Rio Tinto"], growth: "+45% infrastructures" },
      foreuse: { name: "Foreuse de Mine", minSalary: 500000, maxSalary: 1100000, tension: "Critique", certification: "Forage Bauxite & Fer", recruiters: ["SMB Guinée", "Simfer (Rio Tinto)", "Anglogold Ashanti"], growth: "+80% boom minier" },
      bulldozer: { name: "Bulldozer / Bouteur", minSalary: 320000, maxSalary: 580000, tension: "Critique", certification: "Terrassement lourd", recruiters: ["Alufer", "Guiter BTP", "Kamsar Logistique"], growth: "+40% ouvertures de mines" },
      chariot: { name: "Chariot Élévateur (Cariste)", minSalary: 180000, maxSalary: 320000, tension: "Élevée", certification: "Cariste Certifié", recruiters: ["Bolloré Conakry", "Sobragui", "Guinée Transit"], growth: "+30% flux bauxite" }
    }
  }
}

export default function ObservatoireMetiers() {
  const [selectedCountry, setSelectedCountry] = useState('ci')
  const [selectedMachine, setSelectedMachine] = useState('pelle')

  const countryData = OBSERVATORY_DATA[selectedCountry]
  const stats = countryData.machines[selectedMachine]

  const getTensionColor = (tension: string) => {
    switch (tension) {
      case 'Critique': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'Très Élevée': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'Élevée': return 'text-galf-yellow bg-galf-yellow/10 border-galf-yellow/20'
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader
        title="OBSERVATOIRE DES SALAIRES"
        subtitle="Consultez les salaires réels, la demande d'emploi et les recruteurs du secteur des mines et du BTP en Afrique de l'Ouest."
        badge="Données Marché"
      />

      <div className="container-galf mt-12 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Filters selection */}
          <div className="lg:col-span-4 space-y-6">
            <FadeIn className="stitch-card p-6 rounded-3xl border border-white/5 bg-zinc-950/40 stitch-hud-corner shadow-xl">
              <div className="text-[9px] font-mono text-galf-yellow/60 font-black uppercase tracking-[0.2em] border-b border-white/5 pb-3 mb-5 flex justify-between items-center">
                <span>CONFIGURATEUR FILTRES // SYS: ON</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-5 font-sans text-xs">
                {/* Country selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">1. Sélectionner le Pays</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(OBSERVATORY_DATA).map(([code, data]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedCountry(code)}
                        className={`p-3 rounded-xl border font-bold text-center transition-all ${
                          selectedCountry === code
                            ? 'border-galf-yellow bg-galf-yellow/15 text-white'
                            : 'border-white/5 bg-black/20 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        {data.countryName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Machine selector */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">2. Choisir la Spécialité</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: 'pelle', label: 'Pelle Hydraulique' },
                      { key: 'grue', label: 'Grue (Tour & Mobile)' },
                      { key: 'foreuse', label: 'Foreuse de Mine' },
                      { key: 'bulldozer', label: 'Bulldozer (Bouteur)' },
                      { key: 'chariot', label: 'Chariot (Cariste)' }
                    ].map(m => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedMachine(m.key)}
                        className={`p-3.5 rounded-xl border font-bold text-left transition-all flex items-center justify-between ${
                          selectedMachine === m.key
                            ? 'border-galf-yellow bg-galf-yellow/15 text-white'
                            : 'border-white/5 bg-black/20 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        <span>{m.label}</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${selectedMachine === m.key ? 'translate-x-1 text-galf-yellow' : 'text-zinc-500'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right panel: Data Display */}
          <div className="lg:col-span-8 space-y-6">
            <FadeIn className="stitch-card p-8 rounded-3xl border border-white/5 bg-zinc-950/40 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-galf-yellow/5 rounded-bl-[8rem] pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/5 pb-6">
                  <div>
                    <span className="text-[9px] font-mono text-galf-yellow uppercase tracking-widest block mb-1">
                      Fiche Observatoire // {countryData.countryName}
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {stats.name}
                    </h2>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest shrink-0 ${getTensionColor(stats.tension)}`}>
                    Demande : {stats.tension}
                  </span>
                </div>

                {/* Core Stats Block */}
                <div className="grid md:grid-cols-2 gap-6 font-sans text-xs">
                  {/* Salary estimation */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-galf-yellow/10">
                      <DollarSign className="w-12 h-12" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Salaire Mensuel Moyen</span>
                    <div className="space-y-1">
                      <span className="text-2xl font-black text-galf-yellow block leading-none">
                        {stats.minSalary.toLocaleString('fr-FR')} - {stats.maxSalary.toLocaleString('fr-FR')} F
                      </span>
                      <span className="text-[10px] text-zinc-500 block font-mono">FCFA / mois indicatifs de départ</span>
                    </div>
                  </div>

                  {/* Growth & market trend */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-emerald-500/10">
                      <TrendingUp className="w-12 h-12" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Tendance d'Embauche</span>
                    <div className="space-y-1">
                      <span className="text-2xl font-black text-emerald-400 block leading-none">
                        {stats.growth}
                      </span>
                      <span className="text-[10px] text-zinc-500 block font-mono">Croissance constatée du marché</span>
                    </div>
                  </div>
                </div>

                {/* Additional details: Certification & Partners */}
                <div className="grid md:grid-cols-2 gap-6 font-sans text-xs pt-4 border-t border-white/5">
                  {/* Recommended Accreditation */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <ShieldCheck className="w-4 h-4 text-galf-yellow" />
                      <span className="font-bold uppercase tracking-wider text-[11px]">Accréditation Recommandée</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Pour maximiser votre employabilité et obtenir ces fourchettes de salaires, vous devez obtenir la certification :
                    </p>
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 font-mono font-bold text-white text-xs uppercase tracking-wide">
                      {stats.certification}
                    </div>
                  </div>

                  {/* Direct Recruiters */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <Building2 className="w-4 h-4 text-galf-yellow" />
                      <span className="font-bold uppercase tracking-wider text-[11px]">Principaux Employeurs</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Entreprises minières et majors du BTP qui recrutent activement cette spécialité dans ce pays :
                    </p>
                    <div className="space-y-2">
                      {stats.recruiters.map((rec, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5 font-bold text-white text-[11px] uppercase tracking-wide leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-galf-yellow" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Box */}
                <div className="mt-8 p-6 bg-galf-yellow/5 border border-galf-yellow/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Prêt à décrocher ces opportunités ?</h4>
                    <p className="text-[10px] text-zinc-400">
                      Nos formations intègrent exactement les standards exigés par ces recruteurs.
                    </p>
                  </div>
                  <Link 
                    href="/inscription" 
                    className="bg-galf-yellow text-galf-carbon px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-galf-yellow/10"
                  >
                    Lancer mon inscription <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </div>
  )
}
