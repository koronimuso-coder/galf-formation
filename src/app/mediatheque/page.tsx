"use client"
import Image from 'next/image'
import Link from 'next/link'
import { 
  Play, Image as ImageIcon, Video, Filter, Maximize2, X,
  Sun, CloudRain, CloudFog, Wind, Volume2, VolumeX, Download, Info, Compass
} from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { FadeIn } from '@/components/animations/FadeIn'

export default function Mediatheque() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  
  // ── Wave 5: Mediatheque Interactive Feature States ──
  const [weather, setWeather] = useState<'none' | 'sun' | 'rain' | 'fog' | 'sandstorm'>('none')
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [hoveredItemIdx, setHoveredItemIdx] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const engineOscRef = useRef<OscillatorNode | null>(null)
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null)

  const stopAudioSynth = () => {
    try {
      if (engineOscRef.current) {
        engineOscRef.current.stop()
        engineOscRef.current = null
      }
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect()
        noiseNodeRef.current = null
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      setIsAudioPlaying(false)
    } catch (e) {}
  }

  const startAudioSynth = (activeWeather: typeof weather) => {
    try {
      stopAudioSynth()
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtxClass) return
      const ctx = new AudioCtxClass()
      audioCtxRef.current = ctx
      const now = ctx.currentTime

      // 1. Base Engine Rumble (represents BTP site)
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(45, now) // Low diesel rumble
      oscGain.gain.setValueAtTime(0.04, now)

      // LFO for diesel piston vibration
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.setValueAtTime(8, now)
      lfoGain.gain.setValueAtTime(5, now)

      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      osc.connect(oscGain)
      oscGain.connect(ctx.destination)

      lfo.start(now)
      osc.start(now)
      engineOscRef.current = osc

      // 2. Weather Ambient synthesis
      if (activeWeather === 'rain' || activeWeather === 'sandstorm' || activeWeather === 'fog') {
        const bufferSize = 4096
        const noiseNode = ctx.createScriptProcessor(bufferSize, 1, 1)
        noiseNode.onaudioprocess = (e) => {
          const output = e.outputBuffer.getChannelData(0)
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1
          }
        }

        const filterNode = ctx.createBiquadFilter()
        filterNode.type = 'bandpass'
        
        if (activeWeather === 'rain') {
          filterNode.frequency.value = 1200
          filterNode.Q.value = 1
        } else if (activeWeather === 'sandstorm') {
          filterNode.frequency.value = 350
          filterNode.Q.value = 2
        } else { // fog
          filterNode.frequency.value = 150
          filterNode.Q.value = 0.5
        }

        const noiseGain = ctx.createGain()
        noiseGain.gain.setValueAtTime(activeWeather === 'rain' ? 0.08 : 0.05, now)

        noiseNode.connect(filterNode)
        filterNode.connect(noiseGain)
        noiseGain.connect(ctx.destination)
        noiseNodeRef.current = noiseNode
      }

      setIsAudioPlaying(true)
    } catch (e) {}
  }

  const toggleAudioSynth = () => {
    if (isAudioPlaying) {
      stopAudioSynth()
    } else {
      startAudioSynth(weather)
    }
  }

  const handleWeatherChange = (w: typeof weather) => {
    setWeather(w)
    if (isAudioPlaying) {
      startAudioSynth(w)
    }
  }

  const triggerDownload = () => {
    if (downloading) return
    setDownloading(true)
    setDownloadProgress(0)
    
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        const ctx = new AudioCtxClass()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(587.33, ctx.currentTime)
        gain.gain.setValueAtTime(0.03, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
        setTimeout(() => ctx.close(), 200)
      }
    } catch(e){}

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloading(false)
          try {
            const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
            if (AudioCtxClass) {
              const ctx = new AudioCtxClass()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain)
              gain.connect(ctx.destination)
              osc.frequency.setValueAtTime(523.25, ctx.currentTime)
              osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1)
              gain.gain.setValueAtTime(0.03, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
              osc.start()
              osc.stop(ctx.currentTime + 0.25)
              setTimeout(() => ctx.close(), 300)
            }
          } catch(e){}
          alert("🎉 Brochure d'Orientation GALF Formation 2026 téléchargée avec succès !")
          return 0
        }
        return prev + 10
      })
    }, 150)
  }

  const getWeatherFilterStyle = () => {
    switch (weather) {
      case 'sun':
        return { filter: 'brightness(1.1) contrast(1.05) saturate(1.15)' }
      case 'rain':
        return { filter: 'brightness(0.75) contrast(0.9) saturate(0.7) blur(0.5px)' }
      case 'fog':
        return { filter: 'brightness(0.85) contrast(0.65) saturate(0.5) blur(2.5px)' }
      case 'sandstorm':
        return { filter: 'sepia(0.6) hue-rotate(-20deg) brightness(0.9) saturate(1.3)' }
      default:
        return {}
    }
  }

  const items = [
    { type: 'video', title: "Formation Pelle sur site minier", img: "/images/mediatheque/pelle-site-minier.png", duration: "12:45", cat: "Chantier", gps: "5.326° N, -4.017° W", operator: "Yao N.", device: "DJI Inspire 3", date: "12 Avril 2026" },
    { type: 'image', title: "Promotion 2024 - San Pedro", img: "/images/mediatheque/promo-san-pedro.png", cat: "Vie du centre", gps: "4.746° N, -6.637° W", operator: "Koffi J.", device: "Sony FX3", date: "24 Fév 2024" },
    { type: 'video', title: "Démonstration Grue à Tour", img: "/images/formations/grue-tour.png", duration: "05:20", cat: "Levage", gps: "5.316° N, -4.012° W", operator: "Coulibaly A.", device: "DJI Ronin 4D", date: "10 Mars 2026" },
    { type: 'image', title: "Techniques de forage minier", img: "/images/mediatheque/forage-technique.png", cat: "Technique", gps: "5.452° N, -6.211° W", operator: "Diallo M.", device: "Nikon Z9", date: "18 Mai 2025" },
    { type: 'video', title: "Sécurité Incendie en Carrière", img: "/images/mediatheque/securite-incendie-carriere.png", duration: "08:15", cat: "Sécurité", gps: "6.124° N, -5.021° W", operator: "Kouamé B.", device: "GoPro Hero 12 Black", date: "05 Nov 2025" },
    { type: 'image', title: "Nouveau Parc d'Engins", img: "/images/mediatheque/nouveau-parc.png", cat: "Equipement", gps: "5.352° N, -3.992° W", operator: "Administration", device: "Canon R5 C", date: "15 Jan 2026" },
    { type: 'video', title: "Manœuvre de Compacteur", img: "/images/mediatheque/compacteur-manoeuvre.png", duration: "03:50", cat: "Témoignage", gps: "5.336° N, -4.052° W", operator: "Sidibé F.", device: "Sony A7S III", date: "22 Déc 2025" },
    { type: 'image', title: "Levage Mobile Précision", img: "/images/formations/grue-mobile.png", cat: "Partenariat", gps: "5.319° N, -4.019° W", operator: "Instructeur Levage", device: "DJI Mavic 3 Pro", date: "14 Oct 2025" },
  ]

  const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter)

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{ background: 'var(--galf-bg)' }}>
      <PageHeader 
        title="MÉDIATHÈQUE GALF"
        subtitle="Immersion totale dans l'univers BTP & Mines. Découvrez nos formations, nos équipements et la réussite de nos apprenants en images."
        badge="Archives Visuelles"
        centered={true}
      />

      <div className="container-galf relative z-10 mt-16">

        {/* Simulator Banner Promotion */}
        <FadeIn delay={0.1}>
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-galf-yellow/10 to-transparent border-galf-yellow/20 relative overflow-hidden mb-16 group">
            <div className="absolute top-0 right-0 w-[30%] h-full bg-galf-yellow/5 skew-x-12 translate-x-12 pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-galf-yellow/15 border border-galf-yellow/30 rounded-full text-galf-yellow text-[9px] font-black uppercase tracking-widest mb-6 animate-pulse">
                  Nouveau : Simulateur Virtuel
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter" style={{ color: 'var(--galf-text)' }}>
                  Dominez les machines en <span className="text-galf-yellow">3D active</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                  Installez-vous aux commandes de la Pelle hydraulique, de la Grue à tour ou du Bulldozer. Activez le son du moteur diesel et testez vos réflexes HSE.
                </p>
              </div>
              <Link href="/mediatheque/simulateur" className="bg-slate-900 dark:bg-white text-white dark:text-galf-carbon hover:bg-galf-yellow dark:hover:bg-galf-yellow px-10 py-4.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-galf-yellow/10 shrink-0">
                Lancer le Simulateur →
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* ── Weather & Audio Ambient Synthesizer Panel (Feature 85 & 86) ── */}
        <FadeIn delay={0.2}>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            
            {/* Weather selector */}
            <div className="glass-card p-6 rounded-[2rem]">
              <h3 className="text-sm font-black uppercase mb-4 tracking-widest flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                <Sun className="w-4 h-4 text-galf-yellow" /> Filtre Météo Opérationnel (Simulation CSS)
              </h3>
              <p className="text-xs mb-6" style={{ color: 'var(--galf-text-muted)' }}>
                Sélectionnez une ambiance climatique pour appliquer des filtres visuels aux médias et tester les conditions de visibilité réelles.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Normal', icon: Sun },
                  { id: 'sun', label: 'Soleil', icon: Sun },
                  { id: 'rain', label: 'Pluie', icon: CloudRain },
                  { id: 'fog', label: 'Brouillard', icon: CloudFog },
                  { id: 'sandstorm', label: 'Tempête', icon: Wind },
                ].map((wItem) => (
                  <button
                    key={wItem.id}
                    onClick={() => handleWeatherChange(wItem.id as any)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-black border transition-all flex flex-col items-center gap-1.5 ${
                      weather === wItem.id 
                        ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                        : 'hover:border-galf-yellow'
                    }`}
                    style={{
                      background: weather !== wItem.id ? 'var(--galf-bg)' : undefined,
                      borderColor: weather !== wItem.id ? 'var(--galf-border)' : undefined,
                      color: weather !== wItem.id ? 'var(--galf-text-secondary)' : undefined
                    }}
                  >
                    <wItem.icon className="w-4 h-4" />
                    {wItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Ambient Generator */}
            <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase mb-4 tracking-widest flex items-center gap-2" style={{ color: 'var(--galf-text)' }}>
                  {isAudioPlaying ? <Volume2 className="w-4 h-4 text-galf-yellow animate-bounce" /> : <VolumeX className="w-4 h-4" style={{ color: 'var(--galf-text-muted)' }} />}
                  Générateur Sonore Ambiance Chantier (Web Audio API)
                </h3>
                <p className="text-xs mb-4" style={{ color: 'var(--galf-text-muted)' }}>
                  Activer le flux audio synthétisé pour écouter le grondement diesel des pelles de chantier combiné à l'ambiance météo active.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudioSynth}
                  className={`flex-1 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    isAudioPlaying
                      ? 'bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30'
                      : 'bg-galf-yellow text-galf-carbon hover:brightness-110'
                  }`}
                >
                  {isAudioPlaying ? "Couper l'ambiance" : "Démarrer l'ambiance"}
                </button>

                {/* claims brochure downloader button */}
                <button
                  disabled={downloading}
                  onClick={triggerDownload}
                  className="flex-1 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}
                >
                  {downloading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-galf-yellow border-t-transparent rounded-full animate-spin" />
                      <span>{downloadProgress}%</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Brochure CACES</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </FadeIn>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: 'all', label: 'Tout', icon: Filter },
            { id: 'image', label: 'Photos', icon: ImageIcon },
            { id: 'video', label: 'Vidéos', icon: Video },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all border ${filter === f.id ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-lg' : 'border-galf-border'}`}
              style={filter !== f.id ? { color: 'var(--galf-text)' } : {}}
            >
              <f.icon className="w-4 h-4" /> {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.title}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
                onMouseEnter={() => setHoveredItemIdx(idx)}
                onMouseLeave={() => setHoveredItemIdx(null)}
              >
                <div 
                  className="absolute inset-0 z-0 transition-all duration-500"
                  style={getWeatherFilterStyle()}
                >
                  <Image 
                    src={item.img} 
                    alt={item.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-galf-carbon via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                
                {/* Telemetry Overlay Panel (Feature 87) */}
                <div className={`absolute top-4 left-4 right-4 z-20 bg-black/85 backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-all duration-300 pointer-events-none text-left ${
                  hoveredItemIdx === idx ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-galf-yellow uppercase tracking-widest mb-1.5">
                    <Compass className="w-3.5 h-3.5 animate-pulse" /> TÉLÉMÉTRIE HSE ACTIF
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] text-white/70">
                    <div><span className="text-white/40 block font-bold">GPS :</span> {item.gps}</div>
                    <div><span className="text-white/40 block font-bold">OPERATEUR :</span> {item.operator}</div>
                    <div><span className="text-white/40 block font-bold">CAPTEUR :</span> {item.device}</div>
                    <div><span className="text-white/40 block font-bold">DATE :</span> {item.date}</div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <div className="w-16 h-16 rounded-full bg-galf-yellow flex items-center justify-center shadow-2xl">
                    {item.type === 'video' ? <Play className="w-6 h-6 text-galf-carbon ml-1" /> : <Maximize2 className="w-6 h-6 text-galf-carbon" />}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                   <div className="text-[10px] font-black uppercase tracking-widest text-galf-yellow mb-1">{item.cat}</div>
                   <h3 className="text-white font-black leading-tight text-lg">{item.title}</h3>
                   {item.type === 'video' && <div className="text-[10px] text-white/60 font-bold mt-2 flex items-center gap-1"><Video className="w-3 h-3" /> {item.duration}</div>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedItem(null)}
               className="absolute inset-0 bg-galf-carbon/95 backdrop-blur-xl"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass-card"
             >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-galf-yellow hover:text-galf-carbon transition-all flex items-center justify-center"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="aspect-video bg-black relative">
                   <Image 
                    src={selectedItem.img} 
                    alt={selectedItem.title} 
                    fill
                    className="object-contain opacity-40" 
                  />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                         {selectedItem.type === 'video' ? (
                            <>
                               <div className="w-24 h-24 rounded-full bg-galf-yellow mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse">
                                  <Play className="w-10 h-10 text-galf-carbon ml-1" />
                               </div>
                               <h2 className="text-3xl font-black text-white mb-2">{selectedItem.title}</h2>
                               <p className="text-white/60">Lancement du lecteur vidéo premium...</p>
                            </>
                         ) : (
                             <Image 
                              src={selectedItem.img} 
                              alt={selectedItem.title} 
                              width={1200}
                              height={800}
                              className="max-h-[70vh] w-auto rounded-xl shadow-2xl mx-auto" 
                            />
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
