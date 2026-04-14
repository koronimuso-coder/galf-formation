"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cpu, Weight, Move, Zap, CheckCircle2, MapPin } from 'lucide-react'
import { EQUIPMENT_SPECS } from '@/lib/data'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface MachineSpecsModalProps {
  isOpen: boolean
  onClose: () => void
  machineSlug: string
  machineName: string
  machineImg: string
}

function StatCounter({ value, label }: { value: string, label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayValue, setDisplayValue] = useState("0")
  
  // Extract number and unit (e.g., "350 ch" -> 350, "ch")
  const numMatch = value.match(/(\d+[\.,]?\d*)/)
  const unit = value.replace(numMatch ? numMatch[0] : "", "").trim()
  const targetValue = numMatch ? parseFloat(numMatch[0].replace(',', '.')) : 0

  useEffect(() => {
    if (!ref.current) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: targetValue,
      duration: 1.5,
      delay: 0.5,
      ease: "power3.out",
      onUpdate: () => {
        const current = obj.val % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1)
        setDisplayValue(`${current} ${unit}`)
      }
    })
  }, [targetValue, unit])

  return (
    <div ref={ref} className="text-2xl font-black" style={{ color: 'var(--galf-text)' }}>
      {displayValue}
    </div>
  )
}

export function MachineSpecsModal({ isOpen, onClose, machineSlug, machineName, machineImg }: MachineSpecsModalProps) {
  const specs = EQUIPMENT_SPECS[machineSlug]

  if (!specs) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-galf-carbon/95 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl h-full max-h-[90vh] glass-card rounded-3xl overflow-hidden flex flex-col lg:flex-row border-galf-yellow/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-galf-yellow hover:text-galf-carbon transition-all flex items-center justify-center border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Column: Image & Hero Title */}
            <div className="lg:w-1/2 relative overflow-hidden group">
              <img src={machineImg} alt={machineName} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-galf-carbon via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-galf-yellow font-bold uppercase tracking-[0.4em] mb-4"
                >
                  Spécifications Techniques
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-black text-white tracking-tighter italic"
                >
                  {machineName}
                </motion.h2>
              </div>
            </div>

            {/* Right Column: Specs Grid */}
            <div className="lg:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar" style={{ background: 'var(--galf-bg)' }}>
              <div className="grid grid-cols-2 gap-6 mb-12">
                {Object.entries(specs).map(([key, value], idx) => {
                  if (key === 'features') return null
                  const icons: any = { power: Cpu, weight: Weight, depth: Move, bucket: Zap, capacity: Zap, reach: Move, height: Move }
                  const Icon = icons[key] || CheckCircle2
                  const labels: any = { power: 'Puissance', weight: 'Poids', depth: 'Profondeur max', bucket: 'Capacité Godet', capacity: 'Capacité', reach: 'Portée', height: 'Hauteur max' }
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="p-6 bg-galf-yellow/5 border border-galf-yellow/10 rounded-2xl group hover:border-galf-yellow/40 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-galf-yellow/10 flex items-center justify-center text-galf-yellow group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-galf-yellow/60">{labels[key] || key}</span>
                      </div>
                      <StatCounter value={value as string} label={key} />
                    </motion.div>
                  )
                })}
              </div>

              {/* Advanced Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 pb-4 border-b border-galf-border" style={{ color: 'var(--galf-text)' }}>Technologies Embarquées</h3>
                <div className="space-y-4">
                  {(specs as any).features?.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-2 h-2 rounded-full bg-galf-yellow group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(255,176,0,0.5)]" />
                      <span className="text-lg font-bold" style={{ color: 'var(--galf-text-secondary)' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-16"
              >
                <button className="w-full bg-galf-yellow text-galf-carbon font-black py-5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-galf-yellow/10">
                  Réserver cet engin pour formation <Move className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

