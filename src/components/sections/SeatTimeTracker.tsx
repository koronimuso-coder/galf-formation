"use client"
import { Clock, ShieldAlert, Award, Wrench, HardHat } from 'lucide-react'

interface SeatTimeDetails {
  hse: number
  sim: number
  cabin: number
  maint: number
}

const SEAT_TIME_DATABASE: { [key: string]: SeatTimeDetails } = {
  "pelle-hydraulique": { hse: 24, sim: 16, cabin: 80, maint: 10 },
  "grue-tour": { hse: 32, sim: 20, cabin: 72, maint: 8 },
  "bulldozer": { hse: 20, sim: 16, cabin: 84, maint: 10 },
  "chariot-elevateur": { hse: 12, sim: 8, cabin: 30, maint: 6 },
  "forage-minier": { hse: 40, sim: 24, cabin: 96, maint: 15 }
}

export function SeatTimeTracker({ slug = 'pelle-hydraulique' }: { slug?: string }) {
  const details = SEAT_TIME_DATABASE[slug] || SEAT_TIME_DATABASE["pelle-hydraulique"]
  const totalHours = details.hse + details.sim + details.cabin + details.maint
  const seatTimePercentage = Math.round((details.cabin / totalHours) * 100)

  const items = [
    {
      label: "Conduite Cabine Réelle (Seat-Time)",
      hours: details.cabin,
      desc: "Entraînement en conditions réelles de terrassement, chargement et manœuvres.",
      icon: HardHat,
      color: "bg-galf-yellow",
      textColor: "text-galf-yellow"
    },
    {
      label: "Réglementation & Sécurité HSE",
      hours: details.hse,
      desc: "Étude des abaques de charges, protocoles de balisage et gestes de commandement.",
      icon: ShieldAlert,
      color: "bg-red-500",
      textColor: "text-red-500"
    },
    {
      label: "Simulateur 3D Immersif",
      hours: details.sim,
      desc: "Apprentissage des commandes en cabine virtuelle pour forger les premiers réflexes.",
      icon: Award,
      color: "bg-blue-500",
      textColor: "text-blue-500"
    },
    {
      label: "Maintenance Engin 1er Niveau",
      hours: details.maint,
      desc: "Vérification des niveaux, graissage et diagnostic des pannes mécaniques.",
      icon: Wrench,
      color: "bg-emerald-500",
      textColor: "text-emerald-500"
    }
  ]

  return (
    <div className="stitch-card p-6 md:p-8 rounded-3xl relative overflow-hidden stitch-hud-corner shadow-2xl">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[6rem] pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block mb-1">Transparence Pédagogique</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Répartition des Heures de Vol</h3>
          <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-sans leading-relaxed mt-1">
            À l'international, les entreprises évaluent un conducteur sur son **Seat-Time** (temps passé aux commandes réelles). Voici notre engagement d'heures garanties en cabine.
          </p>
        </div>

        {/* Circular gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-100/80 dark:bg-black/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            {/* SVG circle track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-200 dark:stroke-white/5" strokeWidth="8" fill="transparent" />
              <circle 
                cx="64" 
                cy="64" 
                r="54" 
                stroke="#FFB000" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="339.292"
                strokeDashoffset={339.292 - (339.292 * seatTimePercentage) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white block leading-none">{details.cabin}h</span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-wider block mt-1">Cabine Réelle</span>
            </div>
          </div>

          <div className="space-y-2 font-sans text-xs">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Engagement Qualité GALF</h4>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              Votre formation comprend **{totalHours} heures d'apprentissage cumulées**, dont **{details.cabin} heures garanties en cabine réelle** (soit {seatTimePercentage}% du temps de conduite pratique).
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-galf-yellow uppercase tracking-widest pt-1 font-bold">
              <Clock className="w-3.5 h-3.5" /> Statut : Garanti &amp; Audité
            </div>
          </div>
        </div>

        {/* Grid list of details */}
        <div className="grid md:grid-cols-2 gap-4 font-sans text-xs pt-2">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-galf-yellow/40 transition-all flex gap-3 items-start">
              <div className={`w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 ${item.textColor}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-slate-900 dark:text-white uppercase text-[11px] leading-tight">{item.label}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white shrink-0">{item.hours}h</span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-zinc-400 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
