"use client"
import { ShieldCheck, Star, BookOpen } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function InstructorTeam() {
  const instructors = [
    {
      name: "Bamba Seydou",
      role: "Instructeur Principal Forage & Mines",
      exp: "18 ans d'expérience",
      desc: "Ancien inspecteur technique chez Caterpillar Afrique de l'Ouest. Spécialiste de la maintenance préventive et de la conduite de foreuses minières de grande capacité.",
      badges: ["EX-CAT INSPECTOR", "MINE VETERAN"],
      rating: "9.9/10"
    },
    {
      name: "Koffi Alexis",
      role: "Spécialiste Levage & Grue",
      exp: "15 ans d'expérience",
      desc: "Ancien responsable de la sécurité du levage portuaire à Abidjan. Examinateur agréé CACES, expert en plan de levage complexe et manœuvre de charges suspendues.",
      badges: ["EXAMINATEUR CACES", "EX-PORT SAFETY"],
      rating: "9.8/10"
    },
    {
      name: "Diallo Fatoumata",
      role: "Directrice Pédagogique HSE",
      exp: "12 ans d'expérience",
      desc: "Ingénieure sécurité diplômée et auditrice de risques industriels. Certifiée NEBOSH et IOSH, elle forme aux protocoles de sécurité chantier les plus stricts.",
      badges: ["CERTIFIÉE NEBOSH", "AUDITRICE HSE"],
      rating: "9.9/10"
    }
  ]

  return (
    <section className="py-24 border-t border-slate-200 dark:border-white/5 relative overflow-hidden bg-slate-50/50 dark:bg-zinc-950/20">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.02] pointer-events-none" />
      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-[10px] text-galf-yellow font-bold uppercase tracking-[0.3em] mb-3 block">Ressources Humaines d'Élite</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Nos instructeurs <span className="text-galf-yellow">agréés</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-xl mx-auto mt-3 font-sans">
              À GALF, vous n'apprenez pas avec de simples conducteurs, mais avec des cadres et experts certifiés de l'industrie minière et du BTP.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {instructors.map((ins, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} className="stitch-card p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full stitch-hud-corner group">
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-galf-yellow uppercase tracking-widest block font-bold">{ins.role}</span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide leading-tight group-hover:text-galf-yellow transition-colors">
                      {ins.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-sans block">{ins.exp}</span>
                  </div>
                  
                  {/* Rating / KPI */}
                  <div className="bg-galf-yellow/10 border border-galf-yellow/20 rounded-lg px-2.5 py-1 text-center shrink-0">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-galf-yellow uppercase tracking-wider font-mono">
                      <Star className="w-3 h-3 text-galf-yellow fill-current" /> {ins.rating}
                    </div>
                    <span className="text-[7px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-mono">Score HSE</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans pt-2">
                  {ins.desc}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {ins.badges.map((b, bIdx) => (
                    <span 
                      key={bIdx}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-[8px] font-black tracking-widest text-slate-700 dark:text-white/60 uppercase"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Secure footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-galf-yellow" /> Habilité METFIP</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Actif</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
