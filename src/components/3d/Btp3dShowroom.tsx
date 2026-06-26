"use client"
import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  HardHat, Activity, AlertTriangle, Play, 
  Volume2, VolumeX, Shield, Compass, Drill 
} from 'lucide-react'
import gsap from 'gsap'

export default function Btp3dShowroom() {
  const [activeTab, setActiveTab] = useState<'crane' | 'scanner' | 'excavator'>('crane')
  
  // HUD Telemetry & States
  const [engineStarted, setEngineStarted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [rpm, setRpm] = useState(0)
  const [hydraulicPressure, setHydraulicPressure] = useState(30) // in bar
  const [engineTemp, setEngineTemp] = useState(40) // in °C
  const [systemAlert, setSystemAlert] = useState<string | null>("MOTEUR ARRÊTÉ — SYSTÈME EN ATTENTE")
  
  // --- Crane Simulation State ---
  const [craneYaw, setCraneYaw] = useState(30) // rotation of jib (degrees)
  const [trolleyDist, setTrolleyDist] = useState(60) // trolley distance from center (%)
  const [hookHeight, setHookHeight] = useState(50) // hook depth (%)
  const [loadWeight, setLoadWeight] = useState(5) // tonnes (0 - 15)
  const [windForce, setWindForce] = useState(20) // km/h (0 - 90)
  const [swayOffset, setSwayOffset] = useState(0) // dynamic sway in Y/X
  
  // --- Excavator Simulation State ---
  const [boomAngle, setBoomAngle] = useState(15) // degrees
  const [armAngle, setArmAngle] = useState(-30) // degrees
  const [bucketAngle, setBucketAngle] = useState(10) // degrees
  const [excavationVol, setExcavationVol] = useState(0) // m³ excavated
  
  // --- Scanner Simulation State ---
  const [isScanning, setIsScanning] = useState(false)
  const [scanDensity, setScanDensity] = useState(25) // grid subdivisions
  const [terrainRoughness, setTerrainRoughness] = useState(40) // height scale
  const [scanProgress, setScanProgress] = useState(0)
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const craneRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const engineOscRef = useRef<OscillatorNode | null>(null)
  const engineGainRef = useRef<GainNode | null>(null)
  
  // Web Audio Synthesizer
  const initAudio = () => {
    if (audioContextRef.current) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioCtx()
    } catch (e) {
      console.warn("Web Audio not supported", e)
    }
  }

  const toggleSound = () => {
    initAudio()
    if (!soundEnabled) {
      setSoundEnabled(true)
      triggerAudioAlert(440, 0.08)
    } else {
      setSoundEnabled(false)
      stopEngineSound()
    }
  }

  const triggerAudioAlert = useCallback((freq: number, duration: number) => {
    if (!soundEnabled || !audioContextRef.current) return
    try {
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {}
  }, [soundEnabled])

  const startEngineSound = () => {
    if (!soundEnabled || !audioContextRef.current) return
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') ctx.resume()
      
      // Low rumble osc for diesel engine
      const osc1 = ctx.createOscillator()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(45, ctx.currentTime) // Very low rumble
      
      // Filter out high sizzle
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(120, ctx.currentTime)
      
      // Gain node
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      
      osc1.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      
      osc1.start()
      engineOscRef.current = osc1
      engineGainRef.current = gain
    } catch {}
  }

  const stopEngineSound = () => {
    if (engineOscRef.current) {
      try {
        engineOscRef.current.stop()
      } catch {}
      engineOscRef.current = null
    }
    engineGainRef.current = null
  }

  // Engine Startup / Shutdown
  const handleToggleEngine = () => {
    initAudio()
    if (!engineStarted) {
      setEngineStarted(true)
      setSystemAlert("DÉMARRAGE EN COURS...")
      triggerAudioAlert(300, 0.2)
      setTimeout(() => triggerAudioAlert(600, 0.4), 250)
      
      gsap.to({ rpmVal: 0, temp: 40, press: 30 }, {
        rpmVal: 850,
        temp: 72,
        press: 180,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function() {
          setRpm(Math.floor(this.targets()[0].rpmVal))
          setEngineTemp(Math.floor(this.targets()[0].temp))
          setHydraulicPressure(Math.floor(this.targets()[0].press))
        },
        onComplete: () => {
          setSystemAlert(null)
          if (soundEnabled) startEngineSound()
        }
      })
    } else {
      setSystemAlert("EXTINCTION SYSTÈME...")
      stopEngineSound()
      gsap.to({ rpmVal: rpm, temp: engineTemp, press: hydraulicPressure }, {
        rpmVal: 0,
        temp: 40,
        press: 30,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
          setRpm(Math.floor(this.targets()[0].rpmVal))
          setEngineTemp(Math.floor(this.targets()[0].temp))
          setHydraulicPressure(Math.floor(this.targets()[0].press))
        },
        onComplete: () => {
          setEngineStarted(false)
          setSystemAlert("MOTEUR ARRÊTÉ — SYSTÈME EN ATTENTE")
        }
      })
    }
  }

  // Modulate engine sound pitch when sliders move (simulating load)
  useEffect(() => {
    if (engineOscRef.current && engineGainRef.current && engineStarted && soundEnabled) {
      const extraLoad = (loadWeight / 15) * 15 + (windForce / 90) * 10
      engineOscRef.current.frequency.setValueAtTime(45 + extraLoad, audioContextRef.current!.currentTime)
      engineGainRef.current.gain.setValueAtTime(0.04 + (extraLoad * 0.0005), audioContextRef.current!.currentTime)
    }
  }, [loadWeight, windForce, engineStarted, soundEnabled])

  // --- Dynamic Crane Sway and Wind Stress Alerts ---
  useEffect(() => {
    let swayAnim: gsap.core.Tween | null = null
    if (engineStarted) {
      const currentSway = (windForce / 90) * (loadWeight / 15 + 0.5) * 8
      swayAnim = gsap.to({ val: 0 }, {
        val: Math.PI * 2,
        duration: 4 - (windForce / 30),
        repeat: -1,
        ease: "none",
        onUpdate: function() {
          setSwayOffset(Math.sin(this.targets()[0].val) * currentSway)
        }
      })
      
      // Wind warning threshold
      if (windForce > 70) {
        setSystemAlert("⚠️ ALERTE VENT VIOLENT : SÉCURITÉ DE LEVAGE EXTRÊME !")
        triggerAudioAlert(880, 0.15)
      } else if (loadWeight > 12) {
        setSystemAlert("⚠️ CHARGE CRITIQUE : CAPACITÉ TENSION DE CÂBLE LIMITE")
        triggerAudioAlert(750, 0.2)
      } else {
        setSystemAlert(null)
      }
    }
    return () => { swayAnim?.kill() }
  }, [windForce, loadWeight, engineStarted, triggerAudioAlert])

  // --- HTML5 Canvas 3D Terrain Grid & Scanner ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear and set sizes
    canvas.width = canvas.parentElement?.clientWidth || 600
    canvas.height = canvas.parentElement?.clientHeight || 400
    
    const w = canvas.width
    const h = canvas.height
    
    let frameId: number
    
    // Generate static terrain height coordinates
    const gridCols = scanDensity
    const gridRows = scanDensity
    const gridData: number[][] = []
    
    for (let r = 0; r < gridRows; r++) {
      gridData[r] = []
      for (let c = 0; c < gridCols; c++) {
        // Form a crater/valley pattern in the center + noise
        const distFromCenter = Math.sqrt(Math.pow(r - gridRows/2, 2) + Math.pow(c - gridCols/2, 2))
        const baseHeight = Math.sin(distFromCenter * 0.4) * terrainRoughness
        gridData[r][c] = baseHeight + (Math.random() - 0.5) * 8
      }
    }
    
    let scanLineY = 0
    let scannerDir = 1

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      
      // Cyber Grid Background (Radar-like circle rings)
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.05)'
      ctx.lineWidth = 1
      for (let r = 50; r < Math.min(w, h); r += 50) {
        ctx.beginPath()
        ctx.arc(w/2, h/2, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      // Isometric projection function
      // Project 3D points (x, y, z) into 2D canvas screen
      const isoX = (x: number, y: number) => {
        const rad = 28 * Math.PI / 180
        return w/2 + (x - y) * Math.cos(rad)
      }
      
      const isoY = (x: number, y: number, z: number) => {
        const rad = 28 * Math.PI / 180
        // Isometric incline + Z offset (height)
        return h/2 + (x + y) * Math.sin(rad) - z
      }
      
      const scale = Math.min(w, h) / 380 * 7 // Grid spacing scaler
      
      // Draw grid meshes
      ctx.lineWidth = 0.8
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const x3d = (c - gridCols/2) * scale
          const y3d = (r - gridRows/2) * scale
          const z3d = gridData[r][c]
          
          const screenX = isoX(x3d, y3d)
          const screenY = isoY(x3d, y3d, z3d)
          
          // Connect to right neighbor
          if (c < gridCols - 1) {
            const nextX = isoX((c + 1 - gridCols/2) * scale, y3d)
            const nextY = isoY((c + 1 - gridCols/2) * scale, y3d, gridData[r][c+1])
            
            // Highlight color if scanning line is passing through
            const isScanningPoint = isScanning && Math.abs(r - scanLineY) < 1.5
            ctx.strokeStyle = isScanningPoint 
              ? 'rgba(34, 197, 94, 0.75)' 
              : 'rgba(255, 176, 0, 0.15)'
            
            if (isScanningPoint) ctx.lineWidth = 1.6
            else ctx.lineWidth = 0.8
            
            ctx.beginPath()
            ctx.moveTo(screenX, screenY)
            ctx.lineTo(nextX, nextY)
            ctx.stroke()
          }
          
          // Connect to bottom neighbor
          if (r < gridRows - 1) {
            const nextX = isoX(x3d, (r + 1 - gridRows/2) * scale)
            const nextY = isoY(x3d, (r + 1 - gridRows/2) * scale, gridData[r+1][c])
            
            const isScanningPoint = isScanning && Math.abs(r - scanLineY) < 1.5
            ctx.strokeStyle = isScanningPoint 
              ? 'rgba(34, 197, 94, 0.75)' 
              : 'rgba(255, 176, 0, 0.15)'
            
            if (isScanningPoint) ctx.lineWidth = 1.6
            else ctx.lineWidth = 0.8
            
            ctx.beginPath()
            ctx.moveTo(screenX, screenY)
            ctx.lineTo(nextX, nextY)
            ctx.stroke()
          }
          
          // Draw points on major intersections
          if (r % 4 === 0 && c % 4 === 0) {
            ctx.fillStyle = isScanning ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 176, 0, 0.4)'
            ctx.beginPath()
            ctx.arc(screenX, screenY, 1.8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      
      // Update scan line movement
      if (isScanning) {
        scanLineY += 0.12 * scannerDir
        if (scanLineY >= gridRows || scanLineY <= 0) {
          scannerDir *= -1
          triggerAudioAlert(523, 0.05) // Sweep sound
        }
        setScanProgress(Math.floor((scanLineY / gridRows) * 100))
        
        // Draw Laser plane line overlay
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)'
        ctx.lineWidth = 2
        ctx.beginPath()
        
        const ptLeftX = isoX((-gridCols/2) * scale, (scanLineY - gridRows/2) * scale)
        const ptLeftY = isoY((-gridCols/2) * scale, (scanLineY - gridRows/2) * scale, 0)
        const ptRightX = isoX((gridCols/2 - 1) * scale, (scanLineY - gridRows/2) * scale)
        const ptRightY = isoY((gridCols/2 - 1) * scale, (scanLineY - gridRows/2) * scale, 0)
        
        ctx.moveTo(ptLeftX, ptLeftY)
        ctx.lineTo(ptRightX, ptRightY)
        ctx.stroke()
      }
      
      // Request next frame
      frameId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [scanDensity, terrainRoughness, isScanning, triggerAudioAlert])

  // Handle Scan toggle
  const handleToggleScan = () => {
    if (!engineStarted) {
      setSystemAlert("MOTEUR REQUIS POUR PROCÉDER AU SCAN DU TERRAIN")
      triggerAudioAlert(250, 0.3)
      return
    }
    setIsScanning(prev => !prev)
    triggerAudioAlert(400, 0.1)
  }

  // --- Articulated Excavator Arm digging simulation ---
  const triggerDigSequence = () => {
    if (!engineStarted) {
      setSystemAlert("ERREUR: DÉMARRER LE SYSTÈME HYDRAULIQUE D'ABORD")
      triggerAudioAlert(250, 0.3)
      return
    }
    
    setSystemAlert("SÉQUENCE D'EXCAVATION EN COURS...")
    triggerAudioAlert(500, 0.1)
    
    // GSAP timeline to articulate excavator joints
    const tl = gsap.timeline({
      onUpdate: () => {
        // Sound mod
        if (soundEnabled && audioContextRef.current) {
          triggerAudioAlert(Math.random() * 200 + 100, 0.02)
        }
      },
      onComplete: () => {
        setExcavationVol(prev => prev + 2.4)
        setSystemAlert("EXCAVATION COMPLÉTÉE +2.4 m³")
        triggerAudioAlert(600, 0.3)
      }
    })
    
    tl.to({ b: boomAngle, a: armAngle, bu: bucketAngle }, {
      b: 38,
      a: -5,
      bu: -40,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: function() {
        setBoomAngle(this.targets()[0].b)
        setArmAngle(this.targets()[0].a)
        setBucketAngle(this.targets()[0].bu)
      }
    })
    .to({ b: 38, a: -5, bu: -40 }, {
      b: 15,
      a: -30,
      bu: 25,
      duration: 1.0,
      ease: "power1.inOut",
      onUpdate: function() {
        setBoomAngle(this.targets()[0].b)
        setArmAngle(this.targets()[0].a)
        setBucketAngle(this.targets()[0].bu)
      }
    })
  }

  return (
    <div className="glass-card rounded-[2.5rem] border border-galf-border p-6 md:p-8 w-full bg-black/45 relative overflow-hidden" style={{ backdropFilter: 'blur(30px)' }}>
      {/* HUD overlay grid patterns */}
      <div className="absolute inset-0 btp-blueprint-grid opacity-20 pointer-events-none z-0" />
      <div className="absolute inset-0 btp-blueprint-grid-fine opacity-20 pointer-events-none z-0" />
      <div className="absolute inset-0 crt-overlay opacity-[0.03] pointer-events-none z-20" />
      
      {/* Title block */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-8">
        <div>
          <span className="bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow text-[10px] font-black uppercase px-3 py-1 rounded-md tracking-[0.2em] inline-flex items-center gap-1.5 mb-2">
            <HardHat className="w-3.5 h-3.5" /> Technologie Simulation BTP 3D
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
            ESPACE IMMERSIF <span className="text-galf-yellow">DE CONDUITE 3D</span>
          </h3>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/5 gap-2 shrink-0">
          <button 
            onClick={() => { setActiveTab('crane'); triggerAudioAlert(400, 0.05) }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'crane' ? 'bg-galf-yellow text-galf-carbon shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            🏗️ Grue à Tour
          </button>
          <button 
            onClick={() => { setActiveTab('scanner'); triggerAudioAlert(400, 0.05) }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'scanner' ? 'bg-galf-yellow text-galf-carbon shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            🌐 Scanner 3D
          </button>
          <button 
            onClick={() => { setActiveTab('excavator'); triggerAudioAlert(400, 0.05) }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'excavator' ? 'bg-galf-yellow text-galf-carbon shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            🚜 Excavatrice
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry HUD + 3D Viewport */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Controls & Telemetry */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          
          {/* Engine Power Switch & Sound */}
          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Commandes Cabine</span>
              <button 
                onClick={toggleSound}
                className={`p-2 rounded-lg transition-colors border ${soundEnabled ? 'bg-galf-yellow/20 border-galf-yellow/35 text-galf-yellow' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleToggleEngine}
                className={`flex-1 py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                  engineStarted 
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' 
                    : 'bg-green-500/15 border-green-500/30 text-green-500 hover:bg-green-500/25'
                }`}
              >
                <Play className={`w-4 h-4 ${engineStarted ? 'rotate-90 fill-current' : ''}`} />
                {engineStarted ? "Éteindre Moteur" : "Démarrer Moteur"}
              </button>
            </div>
          </div>

          {/* TELEMETRY READOUT PANEL */}
          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex-1 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-4">Télémétrie en Direct</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-2 border-galf-yellow pl-3 py-1">
                  <div className="text-[9px] font-bold text-white/40 uppercase">Régime Moteur</div>
                  <div className="text-xl font-black text-white font-mono">{rpm} <span className="text-xs text-white/40">tr/m</span></div>
                </div>
                <div className="border-l-2 border-orange-500 pl-3 py-1">
                  <div className="text-[9px] font-bold text-white/40 uppercase">Press. Hydraulique</div>
                  <div className="text-xl font-black text-white font-mono">{hydraulicPressure} <span className="text-xs text-white/40">bar</span></div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-1">
                  <div className="text-[9px] font-bold text-white/40 uppercase">Temp. Moteur</div>
                  <div className="text-xl font-black text-white font-mono">{engineTemp} <span className="text-xs text-white/40">°C</span></div>
                </div>
                <div className="border-l-2 border-indigo-400 pl-3 py-1">
                  <div className="text-[9px] font-bold text-white/40 uppercase">Statut Système</div>
                  <div className="text-xs font-black text-emerald-400 uppercase mt-1 animate-pulse flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" /> Sécurisé
                  </div>
                </div>
              </div>
            </div>

            {/* Warn message ticker */}
            <div className="mt-4 pt-3 border-t border-white/5 min-h-[44px]">
              {systemAlert ? (
                <div className="flex items-start gap-2 text-xs font-bold text-amber-500 animate-pulse leading-snug">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{systemAlert}</span>
                </div>
              ) : (
                <div className="text-[10px] font-bold text-white/30 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Télémétrie nominale active
                </div>
              )}
            </div>
          </div>
          
          {/* Dynamic Sliders based on active tab */}
          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-4">Ajustements Manuels</span>
            
            {activeTab === 'crane' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Pivot Flèche (Yaw)</span>
                    <span>{craneYaw}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" value={craneYaw} 
                    onChange={(e) => setCraneYaw(parseInt(e.target.value))}
                    disabled={!engineStarted}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Position Chariot</span>
                    <span>{trolleyDist}%</span>
                  </div>
                  <input 
                    type="range" min="15" max="85" value={trolleyDist} 
                    onChange={(e) => setTrolleyDist(parseInt(e.target.value))}
                    disabled={!engineStarted}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Profondeur Crochet</span>
                    <span>{hookHeight}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="90" value={hookHeight} 
                    onChange={(e) => setHookHeight(parseInt(e.target.value))}
                    disabled={!engineStarted}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/55 uppercase mb-1">Charge (T)</label>
                    <select 
                      value={loadWeight} 
                      onChange={(e) => setLoadWeight(parseFloat(e.target.value))}
                      disabled={!engineStarted}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-1.5 text-xs font-bold"
                    >
                      <option value="2">2 T (Léger)</option>
                      <option value="5">5 T (Standard)</option>
                      <option value="10">10 T (Lourd)</option>
                      <option value="15">15 T (Max)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/55 uppercase mb-1">Vent (km/h)</label>
                    <select 
                      value={windForce} 
                      onChange={(e) => setWindForce(parseInt(e.target.value))}
                      disabled={!engineStarted}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-1.5 text-xs font-bold"
                    >
                      <option value="5">Calme (5)</option>
                      <option value="20">Modéré (20)</option>
                      <option value="45">Fort (45)</option>
                      <option value="80">Tempête (80)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'scanner' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Densité du Maillage</span>
                    <span>{scanDensity} × {scanDensity}</span>
                  </div>
                  <input 
                    type="range" min="15" max="45" value={scanDensity} 
                    onChange={(e) => setScanDensity(parseInt(e.target.value))}
                    disabled={isScanning}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Profil de Dénivelé</span>
                    <span>{terrainRoughness}m</span>
                  </div>
                  <input 
                    type="range" min="10" max="80" value={terrainRoughness} 
                    onChange={(e) => setTerrainRoughness(parseInt(e.target.value))}
                    disabled={isScanning}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>

                <button
                  onClick={handleToggleScan}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                    isScanning 
                      ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30' 
                      : 'bg-galf-yellow text-galf-carbon hover:brightness-110'
                  }`}
                >
                  <Compass className={`w-4 h-4 ${isScanning ? 'animate-spin-slow' : ''}`} />
                  {isScanning ? `Scan en cours (${scanProgress}%)` : "Lancer le scan laser"}
                </button>
              </div>
            )}
            
            {activeTab === 'excavator' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Angle Flèche (Boom)</span>
                    <span>{Math.floor(boomAngle)}°</span>
                  </div>
                  <input 
                    type="range" min="-10" max="60" value={boomAngle} 
                    onChange={(e) => setBoomAngle(parseInt(e.target.value))}
                    disabled={!engineStarted}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Articulation Balancier</span>
                    <span>{Math.floor(armAngle)}°</span>
                  </div>
                  <input 
                    type="range" min="-70" max="10" value={armAngle} 
                    onChange={(e) => setArmAngle(parseInt(e.target.value))}
                    disabled={!engineStarted}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5">
                    <span>Inclinaison Godet</span>
                    <span>{Math.floor(bucketAngle)}°</span>
                  </div>
                  <input 
                    type="range" min="-60" max="40" value={bucketAngle} 
                    onChange={(e) => setBucketAngle(parseInt(e.target.value))}
                    disabled={!engineStarted}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow disabled:opacity-30" 
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={triggerDigSequence}
                    className="flex-1 py-3 bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Drill className="w-4 h-4 animate-bounce" /> Actionner Godet (Creuser)
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right column: 3D Viewport */}
        <div className="lg:col-span-8 bg-[#0a0a0c] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          
          {/* Compass grid markers overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest bg-black/60 px-3 py-1 rounded-md border border-white/5">
              Viewport: {activeTab === 'crane' ? 'Perspective CSS 3D' : activeTab === 'scanner' ? 'Laser Canvas Iso' : 'Kinetic Arm SVG'}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <div className="text-[9px] font-mono text-white/40 uppercase bg-black/60 px-2.5 py-1 rounded border border-white/5">
              {activeTab === 'crane' && `Sway index: ${swayOffset.toFixed(2)}`}
              {activeTab === 'scanner' && `Points parsed: ${scanDensity * scanDensity}`}
              {activeTab === 'excavator' && `Volume extrait: ${excavationVol.toFixed(1)} m³`}
            </div>
          </div>

          {/* MAIN 3D RENDERING AREA */}
          <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden min-h-[360px]">
            
            {/* VIEWPORT 1: TOWER CRANE IN 3D PERSPECTIVE (CSS 3D) */}
            {activeTab === 'crane' && (
              <div 
                ref={craneRef}
                className="scene-3d w-[320px] h-[320px] relative flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: `rotateX(65deg) rotateZ(${craneYaw}deg)`
                }}
              >
                {/* Site Base Grid */}
                <div className="absolute w-[240px] h-[240px] border border-galf-yellow/20 bg-galf-yellow/5 rounded-lg flex items-center justify-center" style={{ transform: 'translateZ(-10px)' }}>
                  <div className="w-[120px] h-[120px] border border-white/5 bg-white/5 border-dashed rounded-full" />
                </div>

                {/* Main vertical Mast (3D Column) */}
                <div 
                  className="absolute w-8 h-[220px] border-2 border-galf-yellow bg-black/40 flex flex-col justify-between"
                  style={{
                    transform: 'rotateX(-90deg) translateZ(105px)',
                    backgroundImage: 'linear-gradient(45deg, transparent 45%, rgba(255, 176, 0, 0.4) 45%, rgba(255, 176, 0, 0.4) 55%, transparent 55%)',
                    backgroundSize: '15px 15px'
                  }}
                >
                  <div className="h-4 border-b border-galf-yellow" />
                  <div className="h-4 border-b border-galf-yellow" />
                  <div className="h-4 border-b border-galf-yellow" />
                  <div className="h-4 border-b border-galf-yellow" />
                </div>

                {/* Rotary Cabin cabin box */}
                <div 
                  className="absolute w-12 h-10 bg-orange-500 border border-black rounded flex items-center justify-center shadow-lg text-white font-mono text-[8px] font-black"
                  style={{
                    transform: 'translateZ(210px) rotateY(-90deg)',
                    boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)'
                  }}
                >
                  CAB
                </div>

                {/* Jib Arm truss (Long front beam + counter jib) */}
                <div 
                  className="absolute h-4 flex items-center object-3d"
                  style={{
                    width: '320px',
                    transform: 'translateZ(220px) rotateY(0deg) translateX(40px)',
                  }}
                >
                  {/* Front Jib (truss pattern) */}
                  <div 
                    className="h-3 bg-black/70 border border-galf-yellow relative rounded-r"
                    style={{
                      width: '220px',
                      backgroundImage: 'linear-gradient(45deg, transparent 45%, rgba(255, 176, 0, 0.3) 45%, rgba(255, 176, 0, 0.3) 55%, transparent 55%)',
                      backgroundSize: '12px 12px'
                    }}
                  >
                    {/* Cable Trolley slider */}
                    <div 
                      className="absolute w-4 h-4 bg-orange-600 rounded border border-white transition-all duration-300"
                      style={{
                        left: `${trolleyDist}%`,
                        top: '-2px'
                      }}
                    >
                      {/* Suspended Hoist Cable & Hook */}
                      <div 
                        className="absolute w-[1px] bg-white/70"
                        style={{
                          height: `${hookHeight}px`,
                          top: '12px',
                          left: '7px',
                          transform: `rotateY(${swayOffset * 0.4}deg)`
                        }}
                      >
                        {/* Hanging load weight block */}
                        <div 
                          className="absolute w-5 h-5 bg-stone-800 border border-orange-500 rounded flex items-center justify-center font-bold font-mono text-[7px] text-white"
                          style={{
                            bottom: '-18px',
                            left: '-10px',
                            boxShadow: loadWeight > 10 ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none'
                          }}
                        >
                          {loadWeight}T
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Counter Jib (shorter back weight beam) */}
                  <div className="w-[80px] h-3 bg-zinc-800 border border-zinc-600 flex items-center justify-end pr-2 rounded-l transform translate-x-[-300px]">
                    {/* Concrete counterweight block */}
                    <div className="w-6 h-6 bg-stone-500 border border-stone-400 rounded shrink-0 shadow-inner" />
                  </div>
                </div>

                {/* Animated direction arrow indicator */}
                <div 
                  className="absolute w-12 h-1 bg-gradient-to-r from-galf-yellow to-transparent" 
                  style={{
                    transform: 'translateZ(230px) rotateY(-90deg) translateX(40px)',
                    opacity: engineStarted ? 0.8 : 0.2
                  }}
                />
              </div>
            )}

            {/* VIEWPORT 2: DYNAMIC HTML5 CANVAS SCANNER */}
            {activeTab === 'scanner' && (
              <div className="w-full h-full min-h-[360px] relative">
                <canvas ref={canvasRef} className="w-full h-full" />
                {isScanning && (
                  <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
                    <div className="scanner-laser-line" />
                  </div>
                )}
              </div>
            )}

            {/* VIEWPORT 3: KINETIC HYDRAULIC EXCAVATOR SVG */}
            {activeTab === 'excavator' && (
              <div className="w-[380px] h-[340px] relative flex items-center justify-center">
                <svg viewBox="0 0 200 180" className="w-full h-full overflow-visible" fill="none" stroke="var(--galf-yellow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Soil layer at bottom */}
                  <path d="M10,150 L190,150" stroke="#78350f" strokeWidth="6" />
                  <path d="M10,150 Q70,150 90,165 T140,165 L190,150" stroke="#451a03" strokeWidth="4" strokeDasharray="3 3" />
                  
                  {/* Excavator tracks (chenilles) */}
                  <path d="M30,145 L90,145 A6,6 0 0,0 96,139 L96,133 A6,6 0 0,0 90,127 L30,127 A6,6 0 0,0 24,133 L24,139 A6,6 0 0,0 30,145 Z" fill="#18181b" />
                  <circle cx="36" cy="136" r="4" fill="white" />
                  <circle cx="50" cy="136" r="4" fill="white" />
                  <circle cx="64" cy="136" r="4" fill="white" />
                  <circle cx="78" cy="136" r="4" fill="white" />
                  
                  {/* Rotating Cabin base */}
                  <g className="machine-cab" style={{ transformOrigin: "56px 127px", transform: 'rotate(0deg)' }}>
                    {/* Counterweight */}
                    <rect x="28" y="102" width="22" height="25" fill="#f97316" rx="3" stroke="#ea580c" />
                    
                    {/* Cabin window body */}
                    <path d="M46,127 L46,92 L75,92 L84,127 Z" fill="#27272a" stroke="var(--galf-yellow)" strokeWidth="2" />
                    <rect x="52" y="98" width="16" height="15" fill="rgba(255,176,0,0.15)" stroke="var(--galf-yellow)" strokeWidth="1" />
                    
                    {/* Dynamic Boom joint */}
                    <g style={{ transformOrigin: "78px 121px", transform: `rotate(${-boomAngle}deg)`, transition: 'transform 0.15s ease-out' }}>
                      <line x1="78" y1="121" x2="135" y2="78" stroke="var(--galf-yellow)" strokeWidth="7" />
                      <line x1="78" y1="121" x2="135" y2="78" stroke="#f97316" strokeWidth="4" />
                      <circle cx="78" cy="121" r="3.5" fill="white" />
                      
                      {/* Hydraulic boom cylinder */}
                      <line x1="60" y1="110" x2="105" y2="90" stroke="#a1a1aa" strokeWidth="2.5" />
                      
                      {/* Arm Joint (Balancier) */}
                      <g style={{ transformOrigin: "135px 78px", transform: `rotate(${-armAngle}deg)`, transition: 'transform 0.15s ease-out' }}>
                        <line x1="135" y1="78" x2="168" y2="125" stroke="var(--galf-yellow)" strokeWidth="5" />
                        <line x1="135" y1="78" x2="168" y2="125" stroke="#f97316" strokeWidth="3" />
                        <circle cx="135" cy="78" r="3.5" fill="white" />
                        
                        {/* Hydraulic cylinder for arm */}
                        <line x1="110" y1="85" x2="148" y2="95" stroke="#a1a1aa" strokeWidth="2" />
                        
                        {/* Bucket joint (Godet) */}
                        <g style={{ transformOrigin: "168px 125px", transform: `rotate(${-bucketAngle}deg)`, transition: 'transform 0.15s ease-out' }}>
                          <circle cx="168" cy="125" r="3.5" fill="white" />
                          
                          {/* Excavator bucket path shape */}
                          <path d="M168,125 Q164,136 150,138 L142,126 L154,116 Z" fill="#27272a" stroke="var(--galf-yellow)" strokeWidth="2" />
                          {/* Teeth of bucket */}
                          <line x1="142" y1="126" x2="137" y2="128" stroke="var(--galf-yellow)" strokeWidth="2.5" />
                          <line x1="144" y1="129" x2="139" y2="131" stroke="var(--galf-yellow)" strokeWidth="2.5" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            )}

          </div>
          
          {/* Footer stats bar */}
          <div className="bg-black/60 border-t border-white/5 py-4 px-6 flex items-center justify-between z-10">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Interface de contrôle B2B</span>
            <div className="flex gap-4">
              <span className="text-[10px] text-white/55 font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Web Audio Actif
              </span>
              <span className="text-[10px] text-white/55 font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Accélération GPU
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
