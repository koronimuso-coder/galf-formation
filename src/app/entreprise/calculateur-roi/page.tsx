"use client"
import { useState } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { PageHeader } from '@/components/layout/PageHeader'
import { ShieldCheck, TrendingUp, Calculator, HardHat, FileText, CheckCircle2 } from 'lucide-react'

export default function SafetyRoiCalculator() {
  // Input parameters
  const [fleetSize, setFleetSize] = useState(15) // Number of machines
  const [incidentsPerYear, setIncidentsPerYear] = useState(4) // Incidents/year
  const [avgCostPerIncident, setAvgCostPerIncident] = useState(2500000) // FCFA per incident
  const [fuelConsumptionPerDay, setFuelConsumptionPerDay] = useState(120) // Liters/day/machine
  const fuelPrice = 850 // FCFA per liter
  const [maintenancePerYear, setMaintenancePerYear] = useState(1500000) // FCFA/machine/year
  const [trainingCostPerOperator, setTrainingCostPerOperator] = useState(250000) // FCFA

  // Calculations
  const operatorTrainingInvestment = fleetSize * trainingCostPerOperator

  // 1. Safety / Accident savings (Trained operators reduce accidents by 70%)
  const currentAccidentCost = incidentsPerYear * avgCostPerIncident
  const safetySavings = currentAccidentCost * 0.70

  // 2. Fuel savings (Eco-conduite reduces fuel waste by 12%)
  const operatingDays = 280
  const annualFuelCost = fleetSize * fuelConsumptionPerDay * fuelPrice * operatingDays
  const fuelSavings = annualFuelCost * 0.12

  // 3. Maintenance savings (Preventive driving reduces mechanical wear by 15%)
  const annualMaintenanceCost = fleetSize * maintenancePerYear
  const maintenanceSavings = annualMaintenanceCost * 0.15

  // Totals
  const totalAnnualSavings = safetySavings + fuelSavings + maintenanceSavings
  const paybackPeriodMonths = totalAnnualSavings > 0 
    ? Math.round((operatorTrainingInvestment / totalAnnualSavings) * 12 * 10) / 10 
    : 0

  const formatPrice = (val: number) => {
    return Math.round(val).toLocaleString('fr-FR') + ' FCFA'
  }

  const triggerAudioClick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        gain.gain.setValueAtTime(0.015, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.05)
        setTimeout(() => ctx.close(), 150)
      }
    } catch {}
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="SIMULATEUR DE ROI & AUDIT FINANCIER"
        subtitle="Calculez avec précision l'impact financier de la formation de vos opérateurs sur vos coûts opérationnels (Accidents, Carburant, Maintenance)."
        badge="Portail Entreprise GALF"
      />

      <div className="container-galf mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left panel - Config inputs */}
          <div className="lg:col-span-2 space-y-6">
            <FadeIn delay={0.1} className="glass-card p-8 rounded-3xl border border-galf-border space-y-6">
              <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-3 border-b border-white/5 pb-4">
                <Calculator className="text-galf-yellow w-6 h-6" /> Configuration de votre Flotte
              </h3>

              {/* Slider 1: Fleet Size */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span style={{ color: 'var(--galf-text-muted)' }}>Taille de la flotte (Engins lourds)</span>
                  <span className="text-galf-yellow">{fleetSize} Machines</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={fleetSize}
                  onChange={(e) => { triggerAudioClick(); setFleetSize(parseInt(e.target.value)) }}
                  className="w-full accent-galf-yellow bg-white/5 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Incidents */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span style={{ color: 'var(--galf-text-muted)' }}>Incidents / chocs mécaniques par an</span>
                  <span className="text-galf-yellow">{incidentsPerYear} accidents</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  value={incidentsPerYear}
                  onChange={(e) => { triggerAudioClick(); setIncidentsPerYear(parseInt(e.target.value)) }}
                  className="w-full accent-galf-yellow bg-white/5 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Cost per incident */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span style={{ color: 'var(--galf-text-muted)' }}>Coût moyen par accident (Arrêt + Pièces)</span>
                  <span className="text-galf-yellow">{formatPrice(avgCostPerIncident)}</span>
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="10000000" 
                  step="100000"
                  value={avgCostPerIncident}
                  onChange={(e) => { triggerAudioClick(); setAvgCostPerIncident(parseInt(e.target.value)) }}
                  className="w-full accent-galf-yellow bg-white/5 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 4: Fuel per day */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span style={{ color: 'var(--galf-text-muted)' }}>Consommation carburant par engin</span>
                  <span className="text-galf-yellow">{fuelConsumptionPerDay} L / jour</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="300" 
                  value={fuelConsumptionPerDay}
                  onChange={(e) => { triggerAudioClick(); setFuelConsumptionPerDay(parseInt(e.target.value)) }}
                  className="w-full accent-galf-yellow bg-white/5 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 5: Maintenance cost */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span style={{ color: 'var(--galf-text-muted)' }}>Coût annuel maintenance préventive/engin</span>
                  <span className="text-galf-yellow">{formatPrice(maintenancePerYear)}</span>
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="5000000" 
                  step="50000"
                  value={maintenancePerYear}
                  onChange={(e) => { triggerAudioClick(); setMaintenancePerYear(parseInt(e.target.value)) }}
                  className="w-full accent-galf-yellow bg-white/5 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 6: Training cost */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span style={{ color: 'var(--galf-text-muted)' }}>Budget formation par opérateur</span>
                  <span className="text-galf-yellow">{formatPrice(trainingCostPerOperator)}</span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="600000" 
                  step="10000"
                  value={trainingCostPerOperator}
                  onChange={(e) => { triggerAudioClick(); setTrainingCostPerOperator(parseInt(e.target.value)) }}
                  className="w-full accent-galf-yellow bg-white/5 h-2 rounded-lg cursor-pointer"
                />
              </div>

            </FadeIn>

            {/* Explanatory blocks */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Baisse des accidents (70%)", desc: "La conduite défensive et l'inspection de début de poste éliminent la quasi-totalité des chocs matériels.", icon: ShieldCheck },
                { title: "Éco-Conduite (12% carburant)", desc: "Optimisation de l'utilisation du régime moteur, réduction du ralenti inutile et des accélérations brutales.", icon: TrendingUp },
                { title: "Maintenance Optimisée (15%)", desc: "Moins de surcharges thermiques et hydrauliques prolonge l'espérance de vie des flexibles et vérins.", icon: HardHat }
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <FadeIn key={idx} delay={0.1 * idx} className="glass-card p-6 rounded-2xl border border-galf-border space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-galf-yellow/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-galf-yellow" />
                    </div>
                    <h4 className="font-black text-sm text-white uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{item.desc}</p>
                  </FadeIn>
                )
              })}
            </div>
          </div>

          {/* Right panel - Live ROI analysis & payoff */}
          <div className="space-y-6">
            <FadeIn delay={0.3} className="glass-card p-8 rounded-3xl border border-galf-yellow/20 bg-galf-yellow/5 space-y-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">
                  Bilan Économique Annuel
                </h3>
                
                <div className="mt-8 space-y-6">
                  {/* Category 1: Safety Savings */}
                  <div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Gains Sécurité</div>
                    <div className="text-2xl font-black text-green-400">+{formatPrice(safetySavings)}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">Sur un coût d'accidents de {formatPrice(currentAccidentCost)}</div>
                  </div>

                  {/* Category 2: Fuel Savings */}
                  <div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Économies Carburant</div>
                    <div className="text-2xl font-black text-green-400">+{formatPrice(fuelSavings)}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">Sur un coût annuel de {formatPrice(annualFuelCost)}</div>
                  </div>

                  {/* Category 3: Maintenance Savings */}
                  <div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Longévité des Organes</div>
                    <div className="text-2xl font-black text-green-400">+{formatPrice(maintenanceSavings)}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">Sur un coût de maintenance de {formatPrice(annualMaintenanceCost)}</div>
                  </div>
                </div>
              </div>

              {/* Final Totals Card */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mt-8 space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-galf-yellow">Économies Annuelles Totales</div>
                  <div className="text-3xl font-black text-white mt-1">{formatPrice(totalAnnualSavings)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-white/50">Investissement</div>
                    <div className="text-sm font-black text-white mt-0.5">{formatPrice(operatorTrainingInvestment)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-white/50">Retour sur Inv.</div>
                    <div className="text-sm font-black text-white mt-0.5">{paybackPeriodMonths} Mois</div>
                  </div>
                </div>

                {paybackPeriodMonths > 0 && paybackPeriodMonths <= 3 ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-[10px] leading-relaxed text-green-400 font-bold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Rentabilité immédiate : Moins de 3 mois de retour sur investissement !
                  </div>
                ) : (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-[10px] leading-relaxed text-blue-400 font-bold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Payback inférieur à un an. Investissement stratégique recommandé.
                  </div>
                )}

                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 rounded-xl bg-galf-yellow text-galf-carbon text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Télécharger l'Audit (.PDF)
                </button>
              </div>

            </FadeIn>
          </div>

        </div>
      </div>
    </div>
  )
}
