"use client"
import { TrendingUp, DollarSign, Building2 } from 'lucide-react'

const DEBOUCHES_DB: { [key: string]: { jobs: string[], salary: string, demand: string, sectors: string } } = {
  "pelle-hydraulique": {
    jobs: ["Conducteur de Pelle Hydraulique", "Chef d'Équipe Terrassement", "Conducteur d'Engins Polyvalent"],
    salary: "250 000 à 450 000 FCFA",
    demand: "+35% de croissance annuelle en Côte d'Ivoire",
    sectors: "Grands projets routiers, Aménagements fonciers, Carrières & Ports"
  },
  "grue-tour": {
    jobs: ["Grutier à Tour Certifié", "Chef de Manœuvre Élingueur", "Superviseur de Levage Sécurité"],
    salary: "300 000 à 600 000 FCFA",
    demand: "+45% de demande sur les chantiers immobiliers d'Abidjan",
    sectors: "Construction résidentielle de grande hauteur, Projets d'infrastructures de ponts"
  },
  "bulldozer": {
    jobs: ["Opérateur Bulldozer D6 / D8", "Terrassier de Masse", "Conducteur d'Engins de Nivellement"],
    salary: "280 000 à 500 000 FCFA",
    demand: "+30% de demande nationale dans les infrastructures",
    sectors: "Ouvertures de pistes, Préparation de sites miniers, Terrassement d'autoroutes"
  },
  "forage-minier": {
    jobs: ["Conducteur de Foreuse de Mine (RC / Core)", "Technicien de Forage Minier", "Foreur d'Exploration"],
    salary: "400 000 à 850 000 FCFA",
    demand: "+60% de recrutement direct dans l'industrie extractive",
    sectors: "Mines d'or, Compagnies de forages géotechniques & d'exploration"
  },
  "chariot-elevateur": {
    jobs: ["Cariste d'Entrepôt", "Magasinier Cariste Certifié", "Opérateur Racks & Logistique"],
    salary: "150 000 à 280 000 FCFA",
    demand: "+25% d'offres d'emploi logistique",
    sectors: "Zones industrielles portuaires (Abidjan/San Pedro), Centres de distribution"
  }
}

export function BlocDebouches({ slug = 'pelle-hydraulique' }: { slug?: string }) {
  const data = DEBOUCHES_DB[slug] || DEBOUCHES_DB["pelle-hydraulique"]

  return (
    <div className="stitch-card p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[6rem] pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block mb-1">Opportunités de Carrière</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Débouchés Métiers</h3>
          <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-sans leading-relaxed mt-1">
            Découvrez les opportunités d'emploi concrètes qui vous attendent après l'obtention de votre certificat.
          </p>
        </div>

        <div className="space-y-4 font-sans text-xs">
          {/* Salary Card */}
          <div className="p-4 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block font-bold">Salaire moyen de départ</span>
              <span className="text-base font-black text-galf-yellow block mt-0.5">{data.salary} / mois</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-galf-yellow/10 border border-galf-yellow/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-galf-yellow" />
            </div>
          </div>

          {/* Job growth */}
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold block text-slate-900 dark:text-white text-[11px] uppercase tracking-wide">Tension du Marché</span>
              <span className="text-[10px] text-slate-600 dark:text-zinc-400 leading-normal block">{data.demand}</span>
            </div>
          </div>

          {/* Secteurs */}
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-galf-yellow" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold block text-slate-900 dark:text-white text-[11px] uppercase tracking-wide">Secteurs recruteurs</span>
              <span className="text-[10px] text-slate-600 dark:text-zinc-400 leading-normal block">{data.sectors}</span>
            </div>
          </div>

          {/* Target jobs list */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block mb-2 font-bold">Postes accessibles :</span>
            <div className="space-y-1.5">
              {data.jobs.map((job, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-galf-yellow text-sm font-bold">✓</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide leading-tight">{job}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
