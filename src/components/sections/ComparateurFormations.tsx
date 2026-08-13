"use client"
import { useState } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { GALF_FORMATIONS } from '@/lib/data'

export function ComparateurFormations() {
  const [f1, setF1] = useState(GALF_FORMATIONS[0]?.slug || '')
  const [f2, setF2] = useState(GALF_FORMATIONS[1]?.slug || '')

  const form1 = GALF_FORMATIONS.find(f => f.slug === f1) || GALF_FORMATIONS[0]
  const form2 = GALF_FORMATIONS.find(f => f.slug === f2) || GALF_FORMATIONS[1]

  // Extra details database to compare
  const COMPARE_DETAILS: { [key: string]: { duration: string, level: string, practice: string, jobs: string, salary: string } } = {
    "pelle-hydraulique": { duration: "4 à 6 semaines", level: "Tout public", practice: "85%", jobs: "Conducteur d'engins, Terrassier BTP", salary: "250 000 - 450 000 F" },
    "grue-tour": { duration: "6 semaines", level: "Aptitude hauteur requise", practice: "80%", jobs: "Grutier à tour, Chef de manœuvre", salary: "300 000 - 550 000 F" },
    "bulldozer": { duration: "4 semaines", level: "Tout public", practice: "85%", jobs: "Conducteur de bouteur, Mine & BTP", salary: "280 000 - 480 000 F" },
    "chariot-elevateur": { duration: "1 à 2 semaines", level: "Tout public", practice: "80%", jobs: "Cariste, Magasinier, Logistique", salary: "150 000 - 280 000 F" },
    "forage-minier": { duration: "8 semaines", level: "Apte travail minier", practice: "90%", jobs: "Foreur de mine, Conducteur foreuse", salary: "400 000 - 850 000 F" }
  }

  const getDetails = (slug: string) => {
    return COMPARE_DETAILS[slug] || { duration: "2 à 4 semaines", level: "Tout public", practice: "80%", jobs: "Opérateur certifié", salary: "180 000 - 350 000 F" }
  }

  const d1 = getDetails(form1.slug)
  const d2 = getDetails(form2.slug)

  return (
    <section className="py-24 border-t border-slate-200 dark:border-white/5 relative overflow-hidden bg-slate-50/50 dark:bg-zinc-950/20">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.02] pointer-events-none" />
      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-[10px] text-galf-yellow font-bold uppercase tracking-[0.3em] mb-3 block">Aide à la Décision</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Comparez nos <span className="text-galf-yellow">parcours</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-xl mx-auto mt-3 font-sans">
              Analysez les prérequis, tarifs, durées et salaires de départ pour choisir la spécialité la plus adaptée à votre profil.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Selection */}
          <div className="stitch-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[6rem] pointer-events-none" />
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[10px] font-bold uppercase text-galf-yellow tracking-wider">Sélectionner la formation 1</label>
                <select
                  value={f1}
                  onChange={(e) => setF1(e.target.value)}
                  className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-galf-yellow cursor-pointer"
                  style={{ colorScheme: 'light dark' }}
                >
                  {GALF_FORMATIONS.map(f => (
                    <option key={f.slug} value={f.slug}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Compare Data Card */}
              <div className="bg-slate-100/80 dark:bg-black/40 rounded-2xl p-6 space-y-4 text-xs font-sans text-slate-900 dark:text-white/80">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Tarif public</span>
                  <span className="text-galf-yellow font-black text-sm">{form1.pricePromo ? `${form1.pricePromo.toLocaleString('fr-FR')} F` : `${form1.price.toLocaleString('fr-FR')} F`}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Durée formation</span>
                  <span className="font-bold text-slate-900 dark:text-white">{d1.duration}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Volume pratique</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{d1.practice} de pratique terrain</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Public ciblé</span>
                  <span className="font-bold text-slate-900 dark:text-white">{d1.level}</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/5 pb-2 gap-4">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Salaire visé</span>
                  <span className="font-bold text-galf-yellow text-right">{d1.salary} / mois</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Métiers visés</span>
                  <span className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">{d1.jobs}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Selection */}
          <div className="stitch-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[6rem] pointer-events-none" />
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[10px] font-bold uppercase text-galf-yellow tracking-wider">Sélectionner la formation 2</label>
                <select
                  value={f2}
                  onChange={(e) => setF2(e.target.value)}
                  className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-galf-yellow cursor-pointer"
                  style={{ colorScheme: 'light dark' }}
                >
                  {GALF_FORMATIONS.filter(f => f.slug !== f1).map(f => (
                    <option key={f.slug} value={f.slug}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Compare Data Card */}
              <div className="bg-slate-100/80 dark:bg-black/40 rounded-2xl p-6 space-y-4 text-xs font-sans text-slate-900 dark:text-white/80">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Tarif public</span>
                  <span className="text-galf-yellow font-black text-sm">{form2.pricePromo ? `${form2.pricePromo.toLocaleString('fr-FR')} F` : `${form2.price.toLocaleString('fr-FR')} F`}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Durée formation</span>
                  <span className="font-bold text-slate-900 dark:text-white">{d2.duration}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Volume pratique</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{d2.practice} de pratique terrain</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Public ciblé</span>
                  <span className="font-bold text-slate-900 dark:text-white">{d2.level}</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/5 pb-2 gap-4">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Salaire visé</span>
                  <span className="font-bold text-galf-yellow text-right">{d2.salary} / mois</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 dark:text-zinc-500 font-semibold">Métiers visés</span>
                  <span className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">{d2.jobs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
