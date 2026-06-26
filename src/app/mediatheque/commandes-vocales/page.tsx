"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Radio, Volume2, Mic, MicOff, AlertOctagon, CheckCircle2, VolumeX
} from 'lucide-react'



// Glossary of safety commands with translations & phonetics
const SAFETY_COMMANDS = [
  {
    id: "stop",
    title: "Arrêt d'urgence !",
    desc: "Arrêter immédiatement tout mouvement d'engin ou de levage en cours.",
    icon: "🚨",
    translations: {
      fr: { text: "Arrêtez tout !", audioText: "Arrêtez tout immédiatement !" },
      en: { text: "Emergency stop !", audioText: "Emergency stop !" },
      dioula: { text: "A dabila sissan !", phonetic: "[Ah dah-bee-lah see-sahn]" },
      baoule: { text: "Yaci i sié sissin !", phonetic: "[Yah-chee ee see-eh see-seen]" },
      wolof: { text: "Taxawal fi mu nekk !", phonetic: "[Tah-hah-wal fee moo nekk]" }
    }
  },
  {
    id: "hoist",
    title: "Lever la charge",
    desc: "Lever l'équipement, la flèche ou le moufle de la grue.",
    icon: "⬆️",
    translations: {
      fr: { text: "Montez la charge", audioText: "Montez la charge." },
      en: { text: "Hoist load", audioText: "Hoist the load." },
      dioula: { text: "A yelema sanfé !", phonetic: "[Ah yeh-leh-mah sahn-feh]" },
      baoule: { text: "Kpin i su !", phonetic: "[Kpeen ee soo]" },
      wolof: { text: "Yëkkatil ndabal li !", phonetic: "[Yehk-kah-teel ndah-bahl lee]" }
    }
  },
  {
    id: "lower",
    title: "Baisser la charge",
    desc: "Descendre doucement l'équipement ou la charge.",
    icon: "⬇️",
    translations: {
      fr: { text: "Descendez doucement", audioText: "Descendez doucement." },
      en: { text: "Lower load", audioText: "Lower the load." },
      dioula: { text: "A jigila douma !", phonetic: "[Ah jee-gee-lah doo-mah]" },
      baoule: { text: "Jiré i asié !", phonetic: "[Jee-reh ee ah-see-eh]" },
      wolof: { text: "Wàccal ndabal li !", phonetic: "[Waht-chahl ndah-bahl lee]" }
    }
  },
  {
    id: "swing_left",
    title: "Pivoter à gauche",
    desc: "Faire pivoter la cabine ou la flèche vers la gauche.",
    icon: "↩️",
    translations: {
      fr: { text: "Tournez à gauche", audioText: "Tournez à gauche." },
      en: { text: "Swing left", audioText: "Swing left." },
      dioula: { text: "Taga nouman fê !", phonetic: "[Tah-gah noo-mahn feh]" },
      baoule: { text: "Kou wounouman !", phonetic: "[Koo woo-noo-mahn]" },
      wolof: { text: "Jëmal ko ci cammoñ !", phonetic: "[Jih-mahl koh chee chahm-mohn]" }
    }
  },
  {
    id: "swing_right",
    title: "Pivoter à droite",
    desc: "Faire pivoter la cabine ou la flèche vers la droite.",
    icon: "↪️",
    translations: {
      fr: { text: "Tournez à droite", audioText: "Tournez à droite." },
      en: { text: "Swing right", audioText: "Swing right." },
      dioula: { text: "Taga kini fê !", phonetic: "[Tah-gah kee-nee feh]" },
      baoule: { text: "Kou faman !", phonetic: "[Koo fah-mahn]" },
      wolof: { text: "Jëmal ko ci ndeyjoor !", phonetic: "[Jih-mahl koh chee ndey-johr]" }
    }
  },
  {
    id: "electrical",
    title: "Attention aux câbles !",
    desc: "Alerte de proximité immédiate avec une ligne électrique aérienne.",
    icon: "⚡",
    translations: {
      fr: { text: "Attention ligne électrique !", audioText: "Attention, ligne électrique aérienne !" },
      en: { text: "Watch the power lines !", audioText: "Watch the power lines !" },
      dioula: { text: "Kouran koulou filé togn !", phonetic: "[Koo-rahn koo-loo fee-leh tohn-y]" },
      baoule: { text: "Nian kouran gnan gnin !", phonetic: "[Nee-ahn koo-rahn nyahn nyeen]" },
      wolof: { text: "Moytul fiil kouran yi !", phonetic: "[Moy-tool feel koo-rahn yee]" }
    }
  }
]

export default function CommandesVocalesPage() {
  const [selectedLang, setSelectedLang] = useState<'fr' | 'en' | 'dioula' | 'baoule' | 'wolof'>('fr')
  const [activeCmdId, setActiveCmdId] = useState<string | null>(null)
  
  // Voice training practice states
  const [practiceCmdId, setPracticeCmdId] = useState<string>("stop")
  const [isListening, setIsListening] = useState(false)
  const [practiceResult, setPracticeResult] = useState<'success' | 'fail' | null>(null)
  const [spokenText, setSpokenText] = useState("")
  const [speechSupported, setSpeechSupported] = useState(true)

  const [soundEnabled, setSoundEnabled] = useState(true)

  // Audio refs & synthesis
  const recognitionRef = useRef<any>(null)

  // Speech Recognition setup on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
    } else {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'fr-FR'

      rec.onstart = () => {
        setIsListening(true)
        setPracticeResult(null)
        setSpokenText("")
        playStaticNoise('start')
      }

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript.toLowerCase()
        setSpokenText(resultText)
        
        // Evaluate based on keywords
        const targetCmd = SAFETY_COMMANDS.find(c => c.id === practiceCmdId)
        if (!targetCmd) return

        let matches = false
        if (practiceCmdId === 'stop') {
          matches = resultText.includes('arrêt') || resultText.includes('arretez') || resultText.includes('stop') || resultText.includes('dabila')
        } else if (practiceCmdId === 'hoist') {
          matches = resultText.includes('lever') || resultText.includes('monter') || resultText.includes('hoist')
        } else if (practiceCmdId === 'lower') {
          matches = resultText.includes('baisser') || resultText.includes('descendre') || resultText.includes('lower')
        } else if (practiceCmdId === 'swing_left') {
          matches = resultText.includes('gauche') || resultText.includes('left')
        } else if (practiceCmdId === 'swing_right') {
          matches = resultText.includes('droite') || resultText.includes('right')
        } else if (practiceCmdId === 'electrical') {
          matches = resultText.includes('câble') || resultText.includes('cable') || resultText.includes('tension') || resultText.includes('ligne') || resultText.includes('electric')
        }

        if (matches) {
          setPracticeResult('success')
          playSiren(practiceCmdId)
        } else {
          setPracticeResult('fail')
          playSound('error')
        }
      }

      rec.onerror = () => {
        setIsListening(false)
        setPracticeResult('fail')
        playStaticNoise('stop')
      }

      rec.onend = () => {
        setIsListening(false)
        playStaticNoise('stop')
      }

      recognitionRef.current = rec
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceCmdId])

  // Play static noise squelch for Walkie-Talkie effect
  const playStaticNoise = (type: 'start' | 'stop') => {
    if (!soundEnabled) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      const bufferSize = ctx.sampleRate * (type === 'start' ? 0.25 : 0.18)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (type === 'start' ? 0.25 : 0.18))

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start()
      setTimeout(() => ctx.close(), 400)
    } catch {}
  }

  // Simple feedback audio sounds
  const playSound = (type: 'click' | 'error') => {
    if (!soundEnabled) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'click') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        gain.gain.setValueAtTime(0.015, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      } else {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(150, ctx.currentTime)
        gain.gain.setValueAtTime(0.03, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      }

      osc.start()
      osc.stop(ctx.currentTime + 0.3)
      setTimeout(() => ctx.close(), 400)
    } catch {}
  }

  // Speak voice synthesizer or play simulated beep
  const handleSpeak = (cmdId: string, lang: 'fr' | 'en' | 'dioula' | 'baoule' | 'wolof') => {
    setActiveCmdId(`${cmdId}-${lang}`)
    
    // Walkie talkie click
    playStaticNoise('start')

    const cmd = SAFETY_COMMANDS.find(x => x.id === cmdId)
    if (!cmd) return

    setTimeout(() => {
      // For French and English, use browser Text-to-Speech API
      if (lang === 'fr' || lang === 'en') {
        const text = lang === 'fr' ? cmd.translations.fr.audioText : cmd.translations.en.audioText
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US'
        utterance.rate = 0.95
        utterance.pitch = 0.85 // Lower pitch for radio realism

        utterance.onend = () => {
          playStaticNoise('stop')
          setActiveCmdId(null)
        }

        window.speechSynthesis.speak(utterance)
      } else {
        // For Local Languages, simulate radio tone transmission beep + walkie transmission
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
          if (AudioCtx) {
            const ctx = new AudioCtx()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            
            // F16: Synth complex walkie radio tone
            osc.type = 'square'
            osc.frequency.setValueAtTime(650, ctx.currentTime)
            osc.frequency.setValueAtTime(520, ctx.currentTime + 0.12)
            
            gain.gain.setValueAtTime(0.03, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
            
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start()
            osc.stop(ctx.currentTime + 0.4)
            
            setTimeout(() => {
              ctx.close()
              playStaticNoise('stop')
              setActiveCmdId(null)
            }, 450)
          }
        } catch {
          playStaticNoise('stop')
          setActiveCmdId(null)
        }
      }
    }, 280)
  }

  // Visual simulation action on voice command recognition success
  const playSiren = (cmdId: string) => {
    if (!soundEnabled) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)
      
      if (cmdId === 'stop' || cmdId === 'electrical') {
        // High urgency siren
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3)
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.3)
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6)
        
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
        osc.start()
        osc.stop(ctx.currentTime + 0.6)
      } else {
        // Double success beep
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(523.25, ctx.currentTime)
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.03, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      }
      setTimeout(() => ctx.close(), 800)
    } catch {}
  }

  const handleManualTriggerMicro = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop()
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      } else {
        // Fallback for unsupported devices (Mock Success)
        setIsListening(true)
        setPracticeResult(null)
        playStaticNoise('start')
        
        setTimeout(() => {
          setIsListening(false)
          setSpokenText(SAFETY_COMMANDS.find(x => x.id === practiceCmdId)?.title || "Stop !")
          setPracticeResult('success')
          playSiren(practiceCmdId)
          playStaticNoise('stop')
        }, 1500)
      }
    }
  }

  const activePracticeCmdObj = SAFETY_COMMANDS.find(x => x.id === practiceCmdId)

  return (
    <div className="min-h-screen pt-28 pb-24 text-left relative overflow-hidden" style={{ background: 'var(--galf-bg)' }}>
      <div className="absolute inset-0 bg-diagonal opacity-5 pointer-events-none" />

      <div className="container-galf max-w-6xl relative z-10">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <Link href="/mediatheque" className="text-xs font-bold text-galf-yellow uppercase tracking-widest flex items-center gap-1 hover:underline">
            ← Médiathèque
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-all flex items-center gap-2 text-xs"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-galf-yellow" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline font-bold uppercase tracking-wider">{soundEnabled ? "Audio On" : "Muet"}</span>
            </button>
          </div>
        </div>

        {/* HERO HEADER */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
            <Radio className="w-3.5 h-3.5" /> Sécurité & Coordination Ouest-Africaine
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            TALKIE-WALKIE VOCAUX <span className="text-galf-yellow">&amp; GLOSSAIRE MULTILINGUE</span>
          </h1>
          <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed mt-2">
            Sur un chantier, la communication par talkie-walkie entre le guideur au sol et l'opérateur est vitale. Écoutez les commandes d'urgence dans les langues locales de Côte d'Ivoire et entraînez-vous à les prononcer au micro.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: GLOSSAIRE TABLE DE COMMANDES */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Language Selector Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar bg-black/20 p-2 rounded-2xl border border-white/5">
              {[
                { id: 'fr', label: 'Français (Officiel)' },
                { id: 'en', label: 'English (Mines)' },
                { id: 'dioula', label: 'Dioula (Côte d\'Ivoire)' },
                { id: 'baoule', label: 'Baoulé (Akan)' },
                { id: 'wolof', label: 'Wolof (Sénégal/Mali)' },
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLang(lang.id as any)
                    playSound('click')
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                    selectedLang === lang.id 
                      ? 'bg-galf-yellow text-galf-carbon shadow-md' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* List of Safety Commands Cards */}
            <div className="grid gap-4">
              {SAFETY_COMMANDS.map((cmd) => {
                const tr = (cmd.translations as any)[selectedLang]
                const isActive = activeCmdId === `${cmd.id}-${selectedLang}`
                const isLocal = selectedLang === 'dioula' || selectedLang === 'baoule' || selectedLang === 'wolof'
                
                return (
                  <div 
                    key={cmd.id} 
                    className="glass-card p-5 rounded-2xl border border-white/5 bg-black/30 flex items-start justify-between gap-6 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg shrink-0 mt-0.5">
                        {cmd.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{cmd.title}</h3>
                        <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">{cmd.desc}</p>
                        
                        {/* Dynamic translation row */}
                        <div className="mt-3.5 p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-galf-yellow block">Traduction</span>
                          <span className="text-sm font-black text-white">{tr.text}</span>
                          {isLocal && tr.phonetic && (
                            <span className="text-[10px] text-white/40 block italic font-mono mt-0.5">Phonétique : {tr.phonetic}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeak(cmd.id, selectedLang)}
                      disabled={isActive}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-galf-yellow/20 border-galf-yellow text-galf-yellow animate-pulse' 
                          : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>

          </div>

          {/* RIGHT: THE INTERACTIVE WALKIE-TALKIE WIDGET */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/5 bg-black/40 relative overflow-hidden flex flex-col items-center">
              
              {/* Decorative Antenna */}
              <div className="w-3.5 h-16 bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-t-lg -mt-10 mb-4 border-x border-t border-zinc-700 shadow-md" />
              
              {/* Talkie Walkie Casing Body */}
              <div className="w-full max-w-[280px] bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border border-zinc-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 relative">
                
                {/* Speaker Grill */}
                <div className="flex flex-col gap-1 opacity-20 my-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-full h-1 bg-white rounded-full" />
                  ))}
                </div>

                {/* Tactical LCD Screen Display */}
                <div className="w-full bg-[#1b2f1c] border-2 border-zinc-700 rounded-xl p-4 font-mono text-left space-y-2 relative overflow-hidden">
                  <div className="absolute top-1 right-2 text-[8px] text-[#4af35a] font-sans font-black flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4af35a] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4af35a]"></span>
                    </span>
                    TX ON
                  </div>
                  
                  <div className="text-[10px] text-[#86bf90] uppercase tracking-wider font-sans font-bold">GALF Radio Ch.12</div>
                  
                  <div className="text-xs text-[#4af35a] font-bold">
                    {isListening ? (
                      <span className="animate-pulse">TRANSMISSION EN COURS...</span>
                    ) : (
                      <span>STANDBY</span>
                    )}
                  </div>

                  <div className="text-[9px] text-[#86bf90] border-t border-[#86bf90]/20 pt-1.5 leading-relaxed">
                    <div>Cible : {activePracticeCmdObj?.title}</div>
                    {spokenText && <div className="text-[#4af35a] truncate mt-0.5">&gt; {spokenText}</div>}
                  </div>
                </div>

                {/* Training dropdown */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Commande cible</label>
                  <select 
                    value={practiceCmdId} 
                    onChange={(e) => {
                      setPracticeCmdId(e.target.value)
                      setPracticeResult(null)
                      setSpokenText("")
                      playSound('click')
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:border-galf-yellow outline-none"
                  >
                    {SAFETY_COMMANDS.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {/* PUSH-TO-TALK BUTTON */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleManualTriggerMicro}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 transition-all duration-300 cursor-pointer ${
                      isListening
                        ? 'bg-red-600 border-red-400 animate-pulse scale-95 shadow-red-500/20'
                        : 'bg-zinc-800 border-zinc-600 hover:border-galf-yellow text-white hover:scale-105'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    {isListening ? "Parlez maintenant" : "Appuyer pour parler"}
                  </span>
                </div>

                {/* Evaluation Status LED */}
                {practiceResult && (
                  <div className="animate-scaleIn">
                    {practiceResult === 'success' ? (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-3 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-400" /> Commande Validée !
                      </div>
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                        <AlertOctagon className="w-4 h-4 text-red-400" /> Non reconnu. Réessayez.
                      </div>
                    )}
                  </div>
                )}
                
              </div>

              {/* Speech recognition instructions detail */}
              <div className="mt-8 text-xs text-white/40 leading-relaxed text-center max-w-xs space-y-1">
                <p>
                  {!speechSupported && "⚠️ La reconnaissance vocale n'est pas supportée sur ce navigateur. Une simulation automatique de transmission a été configurée."}
                </p>
                <p>
                  Dites distinctement la commande : <strong>"{activePracticeCmdObj?.title}"</strong> pour valider la transmission.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
