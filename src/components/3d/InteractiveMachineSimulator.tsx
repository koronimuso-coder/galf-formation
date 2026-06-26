"use client"
import { useEffect, useRef, useState } from 'react'
import { HardHat, Shield, Volume2, VolumeX, AlertTriangle, Play, RefreshCw, Key, Sun, Moon, CloudRain, Settings2, Target, Trophy } from 'lucide-react'
import gsap from 'gsap'

interface InteractiveMachineSimulatorProps {
  machineSlug: string
  machineName: string
}

export function InteractiveMachineSimulator({ machineSlug }: InteractiveMachineSimulatorProps) {
  // Weather & Time of Day State
  const [weather, setWeather] = useState<'day' | 'night' | 'rain'>('day')

  // Unit Converter States
  const [convValue, setConvValue] = useState<number>(10)
  const [convType, setConvType] = useState<'bar_psi' | 'cv_kw' | 't_lb'>('bar_psi')

  // Leaderboard States
  const [leaderboard, setLeaderboard] = useState<{ name: string; time: number; date: string }[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(`galf_leaderboard_${machineSlug}`)
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved))
      } catch {}
    } else {
      const defaults = [
        { name: "Yao A. (Instructeur)", time: 12, date: "12/04" },
        { name: "Diarra M.", time: 24, date: "10/04" },
        { name: "Fatou K.", time: 28, date: "11/04" }
      ]
      setLeaderboard(defaults)
      localStorage.setItem(`galf_leaderboard_${machineSlug}`, JSON.stringify(defaults))
    }
  }, [machineSlug])

  // Customizer States
  const [engineIdleSpeed, setEngineIdleSpeed] = useState(1.0) // multiplier for base pitch
  const [turboVolume, setTurboVolume] = useState(0.3) // gain for turbo whistle
  const [exhaustProfile, setExhaustProfile] = useState(140) // lowpass cutoff base
  
  // Mission Mode State
  const [missionActive, setMissionActive] = useState(false)
  const [missionProgress, setMissionProgress] = useState(0)
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [collisionTriggered, setCollisionTriggered] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(45) // 45 seconds timer
  const [missionTargetReached, setMissionTargetReached] = useState(false)

  // Simulator Engine State
  const [engineStarted, setEngineStarted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [rpm, setRpm] = useState(0)
  const [pressure, setPressure] = useState(30)
  const [isOverloaded, setIsOverloaded] = useState(false)
  
  // Safety checks
  const [epiChecked, setEpiChecked] = useState(false)
  const [hornTested, setHornTested] = useState(false)
  const [zoneClear, setZoneClear] = useState(false)
  
  // Pelle (Excavator) Controls
  const [boomAngle, setBoomAngle] = useState(12) // pArmBaseRef rotation
  const [armAngle, setArmAngle] = useState(-35) // pArmTopRef rotation
  const [bucketAngle, setBucketAngle] = useState(15) // pBucketRef rotation
  const [cabRotation, setCabRotation] = useState(0) // Cab translation X
  
  // Grue (Crane) Controls
  const [trolleyPos, setTrolleyPos] = useState(110) // x position of trolley
  const [cableLength, setCableLength] = useState(90) // y2 of cable / y of hook
  const [jibRotation, setJibRotation] = useState(0) // rotation of jib
  
  // Bulldozer Controls
  const [bladeHeight, setBladeHeight] = useState(0) // y translation of blade
  const [bladeTilt, setBladeTilt] = useState(0) // rotation of blade
  const [driveSpeed, setDriveSpeed] = useState(0) // speed of tracks (0 - 100)

  // New Premium States
  const [keyboardActive, setKeyboardActive] = useState(false)
  const [oilTemp, setOilTemp] = useState(45)
  const [fuelLevel, setFuelLevel] = useState(100)
  const [windSpeed, setWindSpeed] = useState(15)
  const [isVaneMode, setIsVaneMode] = useState(false)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [operatorInitials, setOperatorInitials] = useState('')

  // Web Audio Synth references
  const audioContextRef = useRef<AudioContext | null>(null)
  const osc1Ref = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const oscTurboRef = useRef<OscillatorNode | null>(null)
  const turboGainRef = useRef<GainNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const beepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const rainAudioRef = useRef<AudioBufferSourceNode | null>(null)
  
  // GSAP animation references for SVG elements
  const pArmBaseRef = useRef<SVGGElement>(null)
  const pArmTopRef = useRef<SVGGElement>(null)
  const pBucketRef = useRef<SVGGElement>(null)
  const pCabRef = useRef<SVGGElement>(null)
  
  const gJibRef = useRef<SVGGElement>(null)
  const gHookCableRef = useRef<SVGLineElement>(null)
  const gHookRef = useRef<SVGGElement>(null)
  
  const bWheelsRef = useRef<SVGGElement>(null)
  const bBladeRef = useRef<SVGGElement>(null)

  // Rain particle effect variables
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rainAnimationId = useRef<number | null>(null)

  // Support machine types
  const isPelle = machineSlug === 'pelle-hydraulique'
  const isGrue = machineSlug === 'grue-tour' || machineSlug === 'grue-mobile'
  const isBulldozer = machineSlug === 'bulldozer' || machineSlug === 'chargeuse'
  
  const canStart = epiChecked && hornTested && zoneClear

  // Helper for independent click / alert sound feedback
  const triggerAudioAlert = (freq = 600, duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
      setTimeout(() => ctx.close(), 500)
    } catch {}
  }

  // Dynamic wind speed based on weather selection
  useEffect(() => {
    if (weather === 'rain') {
      setWindSpeed(80) // Storm wind speed
    } else if (weather === 'night') {
      setWindSpeed(25)
    } else {
      setWindSpeed(15)
    }
  }, [weather])

  // Align Jib with wind if Girouette mode is active (for Grue)
  useEffect(() => {
    if (isVaneMode && isGrue) {
      gsap.to(gJibRef.current, {
        rotation: 25,
        transformOrigin: "60px 30px",
        duration: 2.0,
        ease: "power1.out"
      })
      setJibRotation(25)
    }
  }, [isVaneMode, isGrue])

  // Continuous physics engine tick: fuel discharge and oil temperature checks
  useEffect(() => {
    if (!engineStarted) {
      const coolInterval = setInterval(() => {
        setOilTemp(prev => Math.max(45, prev - 0.5))
      }, 1000)
      return () => clearInterval(coolInterval)
    }

    const interval = setInterval(() => {
      // 1. Consume Fuel
      setFuelLevel(prev => {
        let consumption = 0.02
        if (isPelle && (boomAngle !== 12 || armAngle !== -35 || bucketAngle !== 15)) {
          consumption = 0.08
        } else if (isGrue && (trolleyPos !== 110 || cableLength !== 90 || jibRotation !== 0)) {
          consumption = 0.08
        } else if (isBulldozer && driveSpeed > 0) {
          consumption = 0.05 + (driveSpeed / 100) * 0.15
        }
        if (isOverloaded) consumption += 0.1

        const next = prev - consumption
        if (next <= 0) {
          setEngineStarted(false)
          triggerAudioAlert(180, 1.2)
          return 0
        }
        return next
      })

      // 2. Oil Temp check
      setOilTemp(prev => {
        let next = prev + 0.02
        if (isOverloaded) next += 0.35
        
        if (next >= 105) {
          setEngineStarted(false)
          triggerAudioAlert(150, 1.5)
          alert("🚨 ARRET THERMIQUE AUTOMATIQUE : Température hydraulique critique (>105°C) !")
          return 105
        }
        return next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [engineStarted, isOverloaded, isPelle, isGrue, isBulldozer, boomAngle, armAngle, bucketAngle, trolleyPos, cableLength, jibRotation, driveSpeed])

  // Wind safety alarm and structural load warning
  useEffect(() => {
    if (!isGrue || !engineStarted) return

    if (windSpeed > 72 && !isVaneMode) {
      const alarmInterval = setInterval(() => {
        triggerAudioAlert(1400, 0.25)
      }, 500)

      let warningTimer: NodeJS.Timeout
      if (trolleyPos !== 110 || cableLength !== 90 || jibRotation !== 0) {
        warningTimer = setTimeout(() => {
          setCollisionTriggered(true)
          triggerAudioAlert(100, 1.5)
        }, 3000)
      }

      return () => {
        clearInterval(alarmInterval)
        if (warningTimer) clearTimeout(warningTimer)
      }
    }
  }, [isGrue, engineStarted, windSpeed, isVaneMode, trolleyPos, cableLength, jibRotation])

  // Keyboard controls keydown/keyup event listener
  useEffect(() => {
    if (!engineStarted || !keyboardActive || isVaneMode || oilTemp > 105 || fuelLevel <= 0) return

    const activeKeys: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      activeKeys[e.key.toLowerCase()] = true
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const interval = setInterval(() => {
      let isMoving = false

      if (isPelle) {
        if (activeKeys['w'] || activeKeys['z']) {
          setBoomAngle(prev => Math.min(45, prev + 1))
          isMoving = true
        }
        if (activeKeys['s']) {
          setBoomAngle(prev => Math.max(-10, prev - 1))
          isMoving = true
        }
        if (activeKeys['a'] || activeKeys['q']) {
          setCabRotation(prev => Math.max(-80, prev - 2))
          isMoving = true
        }
        if (activeKeys['d']) {
          setCabRotation(prev => Math.min(80, prev + 2))
          isMoving = true
        }
        if (activeKeys['arrowup']) {
          setArmAngle(prev => Math.min(15, prev + 1))
          isMoving = true
        }
        if (activeKeys['arrowdown']) {
          setArmAngle(prev => Math.max(-65, prev - 1))
          isMoving = true
        }
        if (activeKeys['arrowleft']) {
          setBucketAngle(prev => Math.max(-45, prev - 1))
          isMoving = true
        }
        if (activeKeys['arrowright']) {
          setBucketAngle(prev => Math.min(55, prev + 1))
          isMoving = true
        }
      } else if (isGrue) {
        if (activeKeys['w'] || activeKeys['z']) {
          setCableLength(prev => Math.max(40, prev - 1.5))
          isMoving = true
        }
        if (activeKeys['s']) {
          setCableLength(prev => Math.min(155, prev + 1.5))
          isMoving = true
        }
        if (activeKeys['a'] || activeKeys['q']) {
          setJibRotation(prev => Math.max(-25, prev - 0.5))
          isMoving = true
        }
        if (activeKeys['d']) {
          setJibRotation(prev => Math.min(25, prev + 0.5))
          isMoving = true
        }
        if (activeKeys['arrowup']) {
          setTrolleyPos(prev => Math.min(175, prev + 1.5))
          isMoving = true
        }
        if (activeKeys['arrowdown']) {
          setTrolleyPos(prev => Math.max(65, prev - 1.5))
          isMoving = true
        }
      } else if (isBulldozer) {
        if (activeKeys['w'] || activeKeys['z']) {
          setBladeHeight(prev => Math.min(15, prev + 0.5))
          isMoving = true
        }
        if (activeKeys['s']) {
          setBladeHeight(prev => Math.max(-12, prev - 0.5))
          isMoving = true
        }
        if (activeKeys['a'] || activeKeys['q']) {
          setBladeTilt(prev => Math.max(-15, prev - 1))
          isMoving = true
        }
        if (activeKeys['d']) {
          setBladeTilt(prev => Math.min(15, prev + 1))
          isMoving = true
        }
        if (activeKeys['arrowup']) {
          setDriveSpeed(prev => Math.min(100, prev + 2))
          isMoving = true
        }
        if (activeKeys['arrowdown']) {
          setDriveSpeed(prev => Math.max(0, prev - 2))
          isMoving = true
        }
      }

      if (isMoving) {
        setOilTemp(prev => Math.min(120, prev + (isOverloaded ? 0.8 : 0.2)))
      } else {
        setOilTemp(prev => Math.max(45, prev - 0.08))
      }
    }, 40)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(interval)
    }
  }, [engineStarted, keyboardActive, isPelle, isGrue, isBulldozer, isOverloaded, isVaneMode, oilTemp, fuelLevel])

  const completeMission = () => {
    setMissionCompleted(true)
    triggerSuccessChime()
    setShowNamePrompt(true)
  }

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault()
    const name = operatorInitials.trim().toUpperCase() || "OPR"
    const timeTaken = 45 - timeRemaining
    const newRecord = { name: `${name} (Opérateur)`, time: timeTaken, date: "Aujourd'hui" }
    
    setLeaderboard(old => {
      const filtered = old.filter(x => x.name !== "Vous (Opérateur)")
      const updated = [...filtered, newRecord].sort((a, b) => a.time - b.time).slice(0, 5)
      localStorage.setItem(`galf_leaderboard_${machineSlug}`, JSON.stringify(updated))
      return updated
    })
    setShowNamePrompt(false)
  }

  // ----------------------------------------------------
  // RAIN ANIMATION (CANVAS OVERLAY)
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.parentElement?.clientWidth || 640
    canvas.height = canvas.parentElement?.clientHeight || 360

    const particles: {x: number, y: number, speed: number, length: number}[] = []
    if (weather === 'rain') {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 8 + Math.random() * 6,
          length: 10 + Math.random() * 10
        })
      }
    }

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (weather !== 'rain') return

      ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)'
      ctx.lineWidth = 1
      particles.forEach(p => {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - 1, p.y + p.length)
        ctx.stroke()

        p.y += p.speed
        p.x -= 0.5
        if (p.y > canvas.height) {
          p.y = -p.length
          p.x = Math.random() * canvas.width
        }
      })
      rainAnimationId.current = requestAnimationFrame(drawRain)
    }

    if (weather === 'rain') {
      drawRain()
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (rainAnimationId.current) cancelAnimationFrame(rainAnimationId.current)
    }

    return () => {
      if (rainAnimationId.current) cancelAnimationFrame(rainAnimationId.current)
    }
  }, [weather])

  // ----------------------------------------------------
  // WEB AUDIO ENGINE SOUND SYNTHESIS
  // ----------------------------------------------------
  const startAudioEngine = () => {
    try {
      if (audioContextRef.current) return
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      
      const ctx = new AudioCtx()
      audioContextRef.current = ctx
      
      // Master Gain
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(soundEnabled ? 0.12 : 0, ctx.currentTime)
      masterGain.connect(ctx.destination)
      gainNodeRef.current = masterGain

      // Lowpass Filter for heavy diesel rumble
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(exhaustProfile, ctx.currentTime)
      filter.connect(masterGain)
      filterRef.current = filter

      // Oscillator 1 - Sawtooth for diesel piston snaps
      const osc1 = ctx.createOscillator()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(40 * engineIdleSpeed, ctx.currentTime)
      osc1.connect(filter)
      osc1Ref.current = osc1

      // Oscillator 2 - Triangle for low engine hum
      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(60 * engineIdleSpeed, ctx.currentTime)
      osc2.connect(filter)
      osc2Ref.current = osc2

      // Oscillator 3 - High frequency sine for Turbocharger whistle
      const oscTurbo = ctx.createOscillator()
      oscTurbo.type = 'sine'
      oscTurbo.frequency.setValueAtTime(900, ctx.currentTime)
      
      const turboGain = ctx.createGain()
      turboGain.gain.setValueAtTime(soundEnabled ? turboVolume * 0.03 : 0, ctx.currentTime)
      
      oscTurbo.connect(turboGain)
      turboGain.connect(masterGain)
      
      oscTurboRef.current = oscTurbo
      turboGainRef.current = turboGain

      // LFO to create engine piston rhythmic vibration
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.setValueAtTime(8, ctx.currentTime) // 8Hz diesel idle vibration
      lfoGain.gain.setValueAtTime(12, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc1.frequency) // Modulate osc1 pitch
      lfo.start()
      lfoRef.current = lfo

      // Cranking startup sequence
      const time = ctx.currentTime
      masterGain.gain.setValueAtTime(0, time)
      
      // Crank 1
      masterGain.gain.linearRampToValueAtTime(soundEnabled ? 0.08 : 0, time + 0.2)
      osc1.frequency.setValueAtTime(25 * engineIdleSpeed, time)
      osc2.frequency.setValueAtTime(35 * engineIdleSpeed, time)
      
      // Crank 2
      masterGain.gain.linearRampToValueAtTime(0, time + 0.4)
      
      // Crank 3
      masterGain.gain.linearRampToValueAtTime(soundEnabled ? 0.10 : 0, time + 0.6)
      osc1.frequency.setValueAtTime(30 * engineIdleSpeed, time + 0.6)
      
      // Ignition & Idle
      masterGain.gain.linearRampToValueAtTime(soundEnabled ? 0.12 : 0, time + 1.2)
      osc1.frequency.exponentialRampToValueAtTime(45 * engineIdleSpeed, time + 1.5)
      osc2.frequency.exponentialRampToValueAtTime(67.5 * engineIdleSpeed, time + 1.5)

      osc1.start(time)
      osc2.start(time)
      oscTurbo.start(time)

      setRpm(Math.round(800 * engineIdleSpeed))
      
      // Synthesize rain noise if raining
      if (weather === 'rain') {
        startRainNoise(ctx, masterGain)
      }
    } catch (e) {
      console.error("Audio Context failed to start:", e)
    }
  }

  const startRainNoise = (ctx: AudioContext, destination: AudioNode) => {
    // Generate white noise for rain sound
    const bufferSize = 2 * ctx.sampleRate
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    // Lowpass filter to make it sound like rain
    const rainFilter = ctx.createBiquadFilter()
    rainFilter.type = 'lowpass'
    rainFilter.frequency.setValueAtTime(800, ctx.currentTime)

    const rainGain = ctx.createGain()
    rainGain.gain.setValueAtTime(soundEnabled ? 0.03 : 0, ctx.currentTime)

    whiteNoise.connect(rainFilter)
    rainFilter.connect(rainGain)
    rainGain.connect(destination)

    whiteNoise.start()
    rainAudioRef.current = whiteNoise
  }

  const stopAudioEngine = () => {
    try {
      if (osc1Ref.current) osc1Ref.current.stop()
      if (osc2Ref.current) osc2Ref.current.stop()
      if (oscTurboRef.current) oscTurboRef.current.stop()
      if (lfoRef.current) lfoRef.current.stop()
      if (rainAudioRef.current) rainAudioRef.current.stop()
      if (audioContextRef.current) audioContextRef.current.close()
    } catch (e) {
      console.error(e)
    }
    osc1Ref.current = null
    osc2Ref.current = null
    oscTurboRef.current = null
    lfoRef.current = null
    rainAudioRef.current = null
    audioContextRef.current = null
    setRpm(0)
  }

  // Handle engine starting/stopping
  useEffect(() => {
    if (engineStarted) {
      startAudioEngine()
    } else {
      stopAudioEngine()
    }
    return () => stopAudioEngine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineStarted])

  // Handle rain noise dynamic activation
  useEffect(() => {
    if (engineStarted && audioContextRef.current && gainNodeRef.current) {
      if (weather === 'rain') {
        if (!rainAudioRef.current) startRainNoise(audioContextRef.current, gainNodeRef.current)
      } else {
        if (rainAudioRef.current) {
          try { rainAudioRef.current.stop() } catch {}
          rainAudioRef.current = null
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, engineStarted])

  // Handle Customizer adjustments on current nodes
  useEffect(() => {
    if (audioContextRef.current) {
      const ctx = audioContextRef.current
      if (filterRef.current) {
        filterRef.current.frequency.setTargetAtTime(exhaustProfile, ctx.currentTime, 0.1)
      }
      if (turboGainRef.current) {
        turboGainRef.current.gain.setTargetAtTime(soundEnabled ? turboVolume * 0.03 : 0, ctx.currentTime, 0.1)
      }
      if (osc1Ref.current && osc2Ref.current) {
        const factor = engineStarted ? 45 * engineIdleSpeed : 0
        osc1Ref.current.frequency.setTargetAtTime(factor, ctx.currentTime, 0.2)
        osc2Ref.current.frequency.setTargetAtTime(factor * 1.5, ctx.currentTime, 0.2)
      }
    }
  }, [engineIdleSpeed, turboVolume, exhaustProfile, engineStarted, soundEnabled])

  // Handle Mute/Unmute
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const targetGain = soundEnabled && engineStarted ? 0.12 : 0
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioContextRef.current.currentTime, 0.1)
      if (turboGainRef.current) {
        turboGainRef.current.gain.setTargetAtTime(soundEnabled && engineStarted ? turboVolume * 0.03 : 0, audioContextRef.current.currentTime, 0.1)
      }
    }
  }, [soundEnabled, engineStarted, turboVolume])

  // Sound warning beep (backup alarm or overload alarm)
  const triggerBuzzer = (freq = 900, duration = 0.1) => {
    if (!audioContextRef.current || !soundEnabled) return
    try {
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (e) {
      console.error(e)
    }
  }

  // Safety Horn test triggers beep
  const triggerHorn = () => {
    setHornTested(true)
    if (!audioContextRef.current) {
      // Create temp AudioContext if engine not started
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        const tempCtx = new AudioCtx()
        const osc = tempCtx.createOscillator()
        const gain = tempCtx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(320, tempCtx.currentTime)
        gain.gain.setValueAtTime(0.12, tempCtx.currentTime)
        osc.connect(gain)
        gain.connect(tempCtx.destination)
        osc.start()
        osc.stop(tempCtx.currentTime + 0.35)
        setTimeout(() => tempCtx.close(), 500)
      }
    } else {
      triggerBuzzer(320, 0.4)
    }
  }

  // Backup beeper loop for moving bulldozer or overload alerts
  useEffect(() => {
    if (engineStarted && soundEnabled && (isOverloaded || collisionTriggered || (isBulldozer && driveSpeed !== 0))) {
      const interval = isOverloaded || collisionTriggered ? 200 : 800
      const freq = collisionTriggered ? 1500 : isOverloaded ? 1200 : 750
      
      beepTimerRef.current = setInterval(() => {
        triggerBuzzer(freq, 0.15)
      }, interval)
    } else {
      if (beepTimerRef.current) {
        clearInterval(beepTimerRef.current)
        beepTimerRef.current = null
      }
    }
    return () => {
      if (beepTimerRef.current) clearInterval(beepTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineStarted, soundEnabled, isOverloaded, collisionTriggered, isBulldozer, driveSpeed])

  // Modulate engine sound parameters on speed/load adjustments
  const updateEngineParams = (loadRatio: number) => {
    if (!audioContextRef.current || !osc1Ref.current || !osc2Ref.current || !filterRef.current || !oscTurboRef.current) return
    const ctx = audioContextRef.current
    
    // Engine load calculations
    const targetRPM = (800 + loadRatio * 1400) * engineIdleSpeed
    setRpm(Math.round(targetRPM))
    
    // Scale sound frequencies
    const baseFreq = (40 + loadRatio * 25) * engineIdleSpeed
    osc1Ref.current.frequency.setTargetAtTime(baseFreq, ctx.currentTime, 0.15)
    osc2Ref.current.frequency.setTargetAtTime(baseFreq * 1.5, ctx.currentTime, 0.15)
    
    // Turbo whistle speed
    oscTurboRef.current.frequency.setTargetAtTime(900 + loadRatio * 1600, ctx.currentTime, 0.2)
    
    // Open up filter for brighter/louder diesel snaps when loaded
    filterRef.current.frequency.setTargetAtTime(exhaustProfile + loadRatio * 180, ctx.currentTime, 0.15)
    
    // Dynamic Hydraulic pressure gauge response
    if (loadRatio > 0.05) {
      setPressure(Math.round(30 + loadRatio * 200 + Math.random() * 15))
    } else {
      setPressure(30)
    }
  }

  // ----------------------------------------------------
  // MISSION MODE COUNTER TIMER
  // ----------------------------------------------------
  useEffect(() => {
    if (!missionActive || missionCompleted || collisionTriggered) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCollisionTriggered(true) // Fail on timeout
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [missionActive, missionCompleted, collisionTriggered])

  // ----------------------------------------------------
  // REAL-TIME GSAP SVG MANIPULATION & SOUND MODULATION
  // ----------------------------------------------------
  
  // Pelle Excavator Effects
  useEffect(() => {
    if (!isPelle) return
    
    // Rotate Boom
    gsap.to(pArmBaseRef.current, {
      rotation: boomAngle,
      transformOrigin: "42px 85px",
      duration: 0.3,
      ease: "power2.out"
    })
    
    // Rotate Arm (dipper boom)
    gsap.to(pArmTopRef.current, {
      rotation: armAngle,
      transformOrigin: "115px 35px",
      duration: 0.3,
      ease: "power2.out"
    })

    // Rotate Bucket
    gsap.to(pBucketRef.current, {
      rotation: bucketAngle,
      transformOrigin: "155px 105px",
      duration: 0.3,
      ease: "power2.out"
    })

    // Rotate Cabin (Simulate 3D skew & shift)
    gsap.to(pCabRef.current, {
      skewX: -cabRotation * 0.05,
      x: cabRotation * 0.12,
      transformOrigin: "50px 105px",
      duration: 0.4,
      ease: "power1.out"
    })

    // Calculate overload warning (reach + height extreme)
    const reachFactor = Math.abs(boomAngle - 20) + Math.abs(armAngle + 15)
    const overloaded = reachFactor > 45 && bucketAngle > 25
    setIsOverloaded(overloaded)

    // MISSION Pelle Logic
    if (missionActive && !missionCompleted && !collisionTriggered) {
      // Danger zone: cable collision if bucket goes too low and reaches too far
      if (boomAngle > 35 && armAngle < -50) {
        setCollisionTriggered(true)
        triggerBuzzer(180, 0.8)
      } else {
        // Target area: boomAngle [15, 25], armAngle [-35, -20], bucketAngle [30, 50]
        const inTarget = boomAngle >= 14 && boomAngle <= 24 &&
                        armAngle >= -40 && armAngle <= -22 &&
                        bucketAngle >= 25 && bucketAngle <= 50
        
        setMissionTargetReached(inTarget)
        if (inTarget) {
          setMissionProgress(prev => {
            if (prev >= 100) {
              completeMission()
              return 100
            }
            return prev + 1.5
          })
        }
      }
    }

    // Modulate sound based on movement
    if (engineStarted) {
      updateEngineParams(0.25) // Idle movement hydraulic hum
      const timer = setTimeout(() => updateEngineParams(0), 400)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boomAngle, armAngle, bucketAngle, cabRotation, isPelle, engineStarted, missionActive, missionCompleted, collisionTriggered])

  // Grue Crane Effects
  useEffect(() => {
    if (!isGrue) return

    // Slewing / Jib Rotation
    gsap.to(gJibRef.current, {
      rotation: jibRotation,
      transformOrigin: "60px 30px",
      duration: 0.3,
      ease: "power2.out"
    })

    // Hoist Cable Length
    if (gHookCableRef.current) {
      gHookCableRef.current.setAttribute("y2", (36 + cableLength).toString())
    }

    // Hook vertical position
    gsap.to(gHookRef.current, {
      y: cableLength - 90,
      duration: 0.1,
      ease: "none"
    })

    // Move Hook trolley horizontally along Jib
    if (gHookCableRef.current && gHookRef.current) {
      gHookCableRef.current.setAttribute("x1", trolleyPos.toString())
      gHookCableRef.current.setAttribute("x2", trolleyPos.toString())
      gsap.to(gHookRef.current, {
        x: trolleyPos - 147,
        duration: 0.1,
        ease: "none"
      })
    }

    // Overload limits (max radius trolley, heavy cargo)
    setIsOverloaded(trolleyPos > 150 && cableLength < 80)

    // MISSION Grue Logic
    if (missionActive && !missionCompleted && !collisionTriggered) {
      // Overload check triggers fail immediately in mission mode
      if (trolleyPos > 155 && cableLength < 75) {
        setCollisionTriggered(true)
      } else {
        // Target: trolleyPos [135, 155], cableLength [110, 130]
        const inTarget = trolleyPos >= 135 && trolleyPos <= 155 &&
                        cableLength >= 105 && cableLength <= 130
        setMissionTargetReached(inTarget)
        if (inTarget) {
          setMissionProgress(prev => {
            if (prev >= 100) {
              completeMission()
              return 100
            }
            return prev + 2.0
          })
        }
      }
    }

    if (engineStarted) {
      updateEngineParams(0.20)
      const timer = setTimeout(() => updateEngineParams(0), 450)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trolleyPos, cableLength, jibRotation, isGrue, engineStarted, missionActive, missionCompleted, collisionTriggered])

  // Bulldozer Effects
  useEffect(() => {
    if (!isBulldozer) return

    // Raise/Lower Front Blade
    gsap.to(bBladeRef.current, {
      y: bladeHeight,
      rotation: bladeTilt,
      transformOrigin: "130px 105px",
      duration: 0.25,
      ease: "power1.out"
    })

    // Rotate Wheels/Crawler tracks if speed > 0
    if (driveSpeed > 0) {
      gsap.to(bWheelsRef.current?.children || [], {
        rotation: "+=360",
        transformOrigin: "50% 50%",
        duration: Math.max(0.5, 4 - (driveSpeed / 25)),
        repeat: -1,
        ease: "none"
      })
    } else {
      gsap.killTweensOf(bWheelsRef.current?.children || [])
    }

    // Overload alarm if blade is buried in ground while driving
    const overloadCondition = bladeHeight > 8 && driveSpeed > 60
    setIsOverloaded(overloadCondition)

    // MISSION Bulldozer Logic
    if (missionActive && !missionCompleted && !collisionTriggered) {
      if (overloadCondition && driveSpeed > 85) {
        setCollisionTriggered(true) // Engine stalled from extreme load
        setEngineStarted(false)
      } else {
        // Target: bladeHeight [5, 12] (scraping ground) & driveSpeed [30, 70]
        const scraping = bladeHeight >= 5 && bladeHeight <= 12 && driveSpeed >= 30 && driveSpeed <= 75
        setMissionTargetReached(scraping)
        if (scraping) {
          setMissionProgress(prev => {
            if (prev >= 100) {
              completeMission()
              return 100
            }
            return prev + 1.2
          })
        }
      }
    }

    if (engineStarted) {
      updateEngineParams(driveSpeed / 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bladeHeight, bladeTilt, driveSpeed, isBulldozer, engineStarted, missionActive, missionCompleted, collisionTriggered])

  // Web Audio Success Chime
  const triggerSuccessChime = () => {
    if (!audioContextRef.current || !soundEnabled) return
    const ctx = audioContextRef.current
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.12)
      gain.gain.setValueAtTime(0.08, now + idx * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.12)
      osc.stop(now + idx * 0.12 + 0.3)
    })
  }

  const startMission = () => {
    setMissionActive(true)
    setMissionCompleted(false)
    setCollisionTriggered(false)
    setMissionProgress(0)
    setTimeRemaining(45)
    setMissionTargetReached(false)
  }

  const resetMission = () => {
    setMissionActive(false)
    setMissionCompleted(false)
    setCollisionTriggered(false)
    setMissionProgress(0)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full p-2 md:p-6 bg-galf-carbon/90 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
      
      {/* ═══════════════════════════════════════════════
          LEFT COLUMN — Simulator Visual Screen & Gauges
         ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* HUD Indicator Status Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full shadow-lg ${engineStarted ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              {engineStarted ? 'Moteur Actif (Simulé)' : 'Moteur Arrêté'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Weather / Time Selector */}
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/10">
              <button 
                onClick={() => setWeather('day')}
                className={`p-1.5 rounded transition-all ${weather === 'day' ? 'bg-galf-yellow text-galf-carbon' : 'text-white/60 hover:text-white'}`}
                title="Jour"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setWeather('night')}
                className={`p-1.5 rounded transition-all ${weather === 'night' ? 'bg-galf-yellow text-galf-carbon' : 'text-white/60 hover:text-white'}`}
                title="Nuit"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setWeather('rain')}
                className={`p-1.5 rounded transition-all ${weather === 'rain' ? 'bg-galf-yellow text-galf-carbon animate-pulse' : 'text-white/60 hover:text-white'}`}
                title="Pluie"
              >
                <CloudRain className="w-3.5 h-3.5" />
              </button>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className={`p-2 rounded-lg border transition-all ${soundEnabled ? 'bg-galf-yellow text-galf-carbon border-galf-yellow' : 'bg-white/5 text-white/40 border-white/10'}`}
              title="Son du moteur"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Cinematic Visual Screen viewport */}
        <div className="relative aspect-video rounded-[2rem] bg-[#0c0c0e] border border-white/10 overflow-hidden flex items-center justify-center p-8 group">
          {/* Grid lines pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          {/* Canvas for Rain Overlay */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20 w-full h-full" />

          {/* Night Lighting Mask Effect */}
          {weather === 'night' && (
            <div className="absolute inset-0 z-10 bg-black/80 pointer-events-none mix-blend-multiply" />
          )}

          {weather === 'night' && (
            <div 
              className="absolute inset-0 z-10 pointer-events-none bg-radial-spotlight"
              style={{
                background: 'radial-gradient(circle 80px at 150px 100px, transparent 20%, rgba(0,0,0,0.85) 90%)'
              }}
            />
          )}

          {/* Collision Flash */}
          {collisionTriggered && (
            <div className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none animate-flash-red" />
          )}

          {/* Overload Alert overlay banner */}
          {isOverloaded && !collisionTriggered && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-red-600/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 border border-red-500 animate-pulse shadow-2xl">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest font-sans">Surcharge / Alerte HSE</span>
            </div>
          )}

          {/* Collision / Fail Panel overlay */}
          {collisionTriggered && (
            <div className="absolute inset-0 bg-black/85 z-40 flex flex-col items-center justify-center p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
              <h4 className="text-red-500 font-black uppercase text-lg tracking-wider mb-2">INCIDENT DE CHANTIER / ÉCHEC</h4>
              <p className="text-white/60 text-xs max-w-sm leading-relaxed mb-6">
                {isPelle ? "Le godet a percuté une canalisation électrique enterrée en zone non autorisée !" : 
                 isGrue ? "Limiteur de charge dépassé à portée maximale. Risque d'effondrement !" :
                 "Surcharge extrême et vitesse trop élevée. Le moteur a calé par bourrage de lame !"}
              </p>
              <button 
                onClick={startMission}
                className="bg-galf-yellow text-galf-carbon px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Recommencer la Mission
              </button>
            </div>
          )}

          {/* Mission Success Overlay */}
          {missionCompleted && (
            <div className="absolute inset-0 bg-black/85 z-40 flex flex-col items-center justify-center p-6 text-center">
              <Trophy className="w-16 h-16 text-galf-yellow mb-4 animate-bounce" />
              <h4 className="text-galf-yellow font-black uppercase text-xl tracking-wider mb-2">MISSION RÉUSSIE !</h4>
              <p className="text-white/60 text-xs max-w-sm leading-relaxed mb-6">
                Excellent travail d'opération technique. Vous avez accompli le défi dans le respect strict des normes de sécurité de GALF FORMATION.
              </p>
              
              {showNamePrompt ? (
                <form onSubmit={handleSaveScore} className="bg-white/5 border border-white/10 p-5 rounded-2xl max-w-xs w-full mb-6 space-y-4">
                  <span className="text-[10px] text-galf-yellow font-black uppercase tracking-wider block">Entrez vos initiales (ex: NYA)</span>
                  <input
                    type="text"
                    maxLength={3}
                    required
                    value={operatorInitials}
                    onChange={(e) => setOperatorInitials(e.target.value.slice(0, 3))}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-center text-lg font-black uppercase text-white outline-none focus:border-galf-yellow font-mono"
                    placeholder="AAA"
                  />
                  <button
                    type="submit"
                    className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Enregistrer le Record
                  </button>
                </form>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={resetMission}
                    className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Fermer
                  </button>
                  <button 
                    onClick={startMission}
                    className="bg-galf-yellow text-galf-carbon px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Refaire la mission
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SVG Machine rendering */}
          <div className="w-full h-full max-w-[480px] max-h-[360px] flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-[1.03]">
            {isPelle && (
              <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible" fill="none" stroke="var(--galf-yellow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Visual Target Area (Digging Zone) */}
                {missionActive && !missionCompleted && (
                  <g className="opacity-70 animate-pulse">
                    <rect x="140" y="110" width="30" height="20" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" fill="rgba(16, 185, 129, 0.05)" />
                    <text x="141" y="105" fill="#10B981" fontSize="6" fontWeight="bold" stroke="none">ZONE FOUILLE</text>
                    
                    {/* Buried Cable Pipe Danger */}
                    <line x1="120" y1="135" x2="190" y2="135" stroke="#EF4444" strokeWidth="3" />
                    <text x="120" y="143" fill="#EF4444" fontSize="5" fontWeight="bold" stroke="none">CABLE HT ENTERRÉ</text>
                  </g>
                )}

                {/* Crawler Tracks base */}
                <path d="M30,135 L100,135 A10,10 0 0,0 110,125 L110,115 A10,10 0 0,0 100,105 L30,105 A10,10 0 0,0 20,115 L20,125 A10,10 0 0,0 30,135 Z" />
                <circle cx="40" cy="120" r="5" /><circle cx="65" cy="120" r="5" /><circle cx="90" cy="120" r="5" />
                
                {/* Rotatable Cabin & Boom assembly */}
                <g ref={pCabRef}>
                  <path d="M40,105 L40,55 L70,55 L80,105 Z" className="transition-all duration-300" />
                  <path d="M45,60 L65,60 L72,85 L45,85 Z" strokeWidth="1.5" />
                  <path d="M80,105 L85,85 L105,85 L105,105 Z" />
                  
                  {/* Headlights Spotlight in Night mode */}
                  {weather === 'night' && (
                    <polygon points="105,95 200,80 200,140 105,105" fill="url(#pelleLightGlow)" stroke="none" className="opacity-40" />
                  )}

                  {/* Hydraulic Cylinders and Boom arms */}
                  <g ref={pArmBaseRef}>
                    <path d="M42,85 L115,35" strokeWidth="5" />
                    
                    {/* Secondary Arm */}
                    <g ref={pArmTopRef}>
                      <path d="M115,35 L155,105" strokeWidth="4" />
                      <circle cx="115" cy="35" r="4" fill="var(--galf-yellow)" />
                      
                      {/* Bucket */}
                      <g ref={pBucketRef}>
                        <circle cx="155" cy="105" r="3" fill="var(--galf-yellow)" />
                        <path d="M155,105 L145,125 L165,130 L175,110 Z" strokeWidth="2.5" />
                      </g>
                    </g>
                  </g>
                </g>

                <defs>
                  <linearGradient id="pelleLightGlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#FFB000" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {isGrue && (
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" fill="none" stroke="var(--galf-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Visual Target Area (Crane Bin) */}
                {missionActive && !missionCompleted && (
                  <g className="opacity-70 animate-pulse">
                    <rect x="135" y="150" width="25" height="15" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" fill="rgba(16, 185, 129, 0.05)" />
                    <text x="135" y="145" fill="#10B981" fontSize="6" fontWeight="bold" stroke="none">BENNE DE DÉPÔT</text>
                  </g>
                )}

                {/* Crane Base & Mast */}
                <path d="M40,190 L80,190" strokeWidth="4" />
                <path d="M50,190 L60,30" strokeWidth="3" />
                <path d="M70,190 L60,30" strokeWidth="3" />
                
                {/* Jib / Slewing Structure */}
                <g ref={gJibRef}>
                   <rect x="65" y="35" width="15" height="20" />
                   <path d="M60,30 L60,10 L80,10 L70,30" strokeWidth="2" />
                   <path d="M60,30 L20,30 L20,35 L60,35" />
                   <path d="M60,30 L180,30" strokeWidth="3" />
                   <path d="M60,35 L180,35" strokeWidth="2" />
                   
                   {/* Trolley hook cable */}
                   <line ref={gHookCableRef} x1={trolleyPos} y1="36" x2={trolleyPos} y2={36 + cableLength} strokeWidth="1.5" />
                   
                   {/* Hook Block */}
                   <g ref={gHookRef}>
                     <path d="M147,95 L143,105 L151,105 Z" fill="currentColor" />
                     <circle cx="147" cy="110" r="3" fill="var(--galf-yellow)" />
                     {/* Suspended Cargo box in mission mode */}
                     {missionActive && (
                       <rect x="137" y="113" width="20" height="15" stroke="currentColor" fill="rgba(255,176,0,0.1)" strokeWidth="1.5" />
                     )}
                   </g>
                </g>
              </svg>
            )}

            {isBulldozer && (
              <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible" fill="none" stroke="var(--galf-yellow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Visual Target Area (Dirt Hill) */}
                {missionActive && !missionCompleted && (
                  <g className="opacity-80">
                    <path d="M130,120 Q145,90 170,120 Z" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" fill="rgba(16, 185, 129, 0.1)" />
                    <text x="135" y="85" fill="#10B981" fontSize="6" fontWeight="bold" stroke="none">NIVELER BUTTE</text>
                  </g>
                )}

                {/* Main Body */}
                <path d="M30,110 L30,60 L70,60 L80,100 L120,100 L130,120 L30,120 Z" />
                
                {/* Headlights Spotlight in Night mode */}
                {weather === 'night' && (
                  <polygon points="120,100 200,90 200,135 120,120" fill="url(#bullLightGlow)" stroke="none" className="opacity-40" />
                )}

                {/* Caterpillar tracks wheels */}
                <g ref={bWheelsRef}>
                  <circle cx="50" cy="120" r="18" strokeWidth="3" />
                  <circle cx="110" cy="120" r="18" strokeWidth="3" />
                </g>
                
                {/* Hydraulic Arm and Front Blade */}
                <g ref={bBladeRef}>
                  <path d="M70,100 L130,105" strokeWidth="4" />
                  <path d="M130,75 Q142,95 137,125 L122,125" strokeWidth="3.5" />
                </g>

                <defs>
                  <linearGradient id="bullLightGlow" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#FFB000" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
          
          {/* HSE safety notification overlays */}
          {!engineStarted && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-galf-yellow">
                <Key className="w-8 h-8" />
              </div>
              <h4 className="text-white font-black uppercase text-sm tracking-widest mb-2">Simulateur en veille</h4>
              <p className="text-white/60 text-xs max-w-xs leading-relaxed">
                Remplissez les consignes de sécurité obligatoires ci-dessous pour démarrer le moteur.
              </p>
            </div>
          )}

          {/* Mission Details overlay inside Screen */}
          {missionActive && !missionCompleted && !collisionTriggered && (
            <div className="absolute bottom-6 left-6 z-25 bg-black/80 px-4 py-2.5 rounded-xl border border-white/10 flex flex-col gap-1 text-[10px] font-mono text-white">
              <div className="flex justify-between gap-6">
                <span>Temps restant:</span>
                <span className={`font-bold ${timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-galf-yellow'}`}>{timeRemaining}s</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Cible atteinte:</span>
                <span className={missionTargetReached ? 'text-green-500 font-bold' : 'text-white/50'}>
                  {missionTargetReached ? 'OUI (Calcul progression...)' : 'NON'}
                </span>
              </div>
              <div className="w-24 bg-white/15 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${missionProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* ----------------- Cockpit HUD Gauges ----------------- */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {/* RPM Gauge */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center text-center relative overflow-hidden group">
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5">Régime Moteur</span>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                <span>{rpm}</span>
                <span className="text-[10px] text-galf-yellow font-black">RPM</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-galf-yellow to-red-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (rpm / 2200) * 100)}%` }}
                />
              </div>
            </div>

            {/* Hydraulic Pressure Gauge */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center text-center relative overflow-hidden group">
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5">Pression Hyd.</span>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                <span>{pressure}</span>
                <span className="text-[10px] text-galf-yellow font-black">BAR</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-galf-yellow transition-all duration-100"
                  style={{ width: `${Math.min(100, (pressure / 250) * 100)}%` }}
                />
              </div>
            </div>

            {/* Load safety indicator */}
            <div className={`p-5 rounded-2xl border transition-colors flex flex-col justify-center text-center relative overflow-hidden group ${
              isOverloaded ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/5'
            }`}>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5">Limiteur de Charge</span>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                <span>{isOverloaded ? 'DANGER' : 'CORRECT'}</span>
              </div>
              <div className="text-[8px] font-black uppercase mt-3 tracking-widest text-white/30">
                {isOverloaded ? 'ALERTE HSE' : 'CHARGE NOMINALE'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Fuel Level */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center text-center relative overflow-hidden group">
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5 flex items-center justify-center gap-1">⛽ Carburant</span>
              <div className="text-xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                <span>{Math.round(fuelLevel)}</span>
                <span className="text-[10px] text-galf-yellow font-black">%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${fuelLevel < 20 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                  style={{ width: `${fuelLevel}%` }}
                />
              </div>
              {engineStarted && fuelLevel < 25 && (
                <button
                  onClick={() => {
                    triggerAudioAlert(880, 0.1)
                    setTimeout(() => triggerAudioAlert(1200, 0.2), 100)
                    setFuelLevel(100)
                  }}
                  className="mt-2 py-1 bg-galf-yellow text-galf-carbon text-[8px] font-black rounded uppercase tracking-wider transition-all"
                >
                  Ravitaillement
                </button>
              )}
            </div>

            {/* Oil Temp */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center text-center relative overflow-hidden group">
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5 flex items-center justify-center gap-1">🌡️ Temp. Huile</span>
              <div className="text-xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                <span>{oilTemp.toFixed(1)}</span>
                <span className="text-[10px] text-galf-yellow font-black">°C</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${oilTemp > 85 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(100, (oilTemp / 120) * 100)}%` }}
                />
              </div>
              {engineStarted && oilTemp > 65 && (
                <button
                  onClick={() => {
                    triggerAudioAlert(440, 0.3)
                    setOilTemp(prev => Math.max(45, prev - 25))
                  }}
                  className="mt-2 py-1 bg-white/10 text-white hover:bg-white/20 text-[8px] font-black rounded uppercase tracking-wider transition-all"
                >
                  Refroidir
                </button>
              )}
            </div>

            {/* Weather Wind / Girouette Status */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center text-center relative overflow-hidden group">
              {isGrue ? (
                <>
                  <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5 flex items-center justify-center gap-1">💨 Vent / Sécurité</span>
                  <div className="text-xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                    <span>{windSpeed}</span>
                    <span className="text-[10px] text-galf-yellow font-black">km/h</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerAudioAlert(600, 0.05)
                      setIsVaneMode(!isVaneMode)
                    }}
                    className={`mt-2 py-1 text-[8px] font-black rounded uppercase tracking-wider transition-all ${
                      isVaneMode 
                        ? 'bg-[#10B981] text-white border-none' 
                        : 'bg-white/10 text-white hover:bg-white/20 border-none'
                    }`}
                  >
                    {isVaneMode ? "Girouette Actif" : "Mettre Girouette"}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-1.5 flex items-center justify-center gap-1">⚡ Alternateur</span>
                  <div className="text-xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
                    <span>{engineStarted ? "14.2" : "0.0"}</span>
                    <span className="text-[10px] text-galf-yellow font-black">V</span>
                  </div>
                  <div className="text-[8px] font-bold mt-2 text-white/40">CHARGE BATTERIE</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT COLUMN — Operator Panel & Safety Controls
         ═══════════════════════════════════════════════ */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col gap-6">
        
        {/* Safety checklist console */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-galf-yellow" /> Protocole de Démarrage HSE
          </h3>

          <div className="space-y-4 mb-6">
            {/* Checkbox 1 */}
            <label className="flex items-start gap-3.5 cursor-pointer group text-xs text-white/70 hover:text-white">
              <input 
                type="checkbox"
                checked={epiChecked}
                onChange={(e) => setEpiChecked(e.target.checked)}
                className="mt-0.5 rounded border-white/10 bg-white/5 text-galf-yellow focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
              <span className="leading-snug select-none">
                <strong className="text-white block font-bold mb-0.5">EPI réglementaires enfilés</strong>
                Casque de chantier, gilet réfléchissant et bottes de sécurité.
              </span>
            </label>

            {/* Checkbox 2 */}
            <div className="flex items-start gap-3.5 group text-xs text-white/70">
              <button 
                onClick={triggerHorn}
                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  hornTested ? 'bg-green-500 border-green-500 text-white' : 'bg-white/5 border-white/10 hover:border-galf-yellow'
                }`}
              >
                {hornTested && <span className="text-[9px]">✓</span>}
              </button>
              <span className="leading-snug">
                <button onClick={triggerHorn} className="text-left select-none block">
                  <strong className="text-white block font-bold mb-0.5 hover:underline">Tester l'avertisseur de recul</strong>
                  Cliquez pour faire retentir le bip sonore d'alerte.
                </button>
              </span>
            </div>

            {/* Checkbox 3 */}
            <label className="flex items-start gap-3.5 cursor-pointer group text-xs text-white/70 hover:text-white">
              <input 
                type="checkbox"
                checked={zoneClear}
                onChange={(e) => setZoneClear(e.target.checked)}
                className="mt-0.5 rounded border-white/10 bg-white/5 text-galf-yellow focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
              <span className="leading-snug select-none">
                <strong className="text-white block font-bold mb-0.5">Périmètre dégagé</strong>
                Aucun obstacle ou ouvrier à proximité dans la zone d'évolution.
              </span>
            </label>
          </div>

          {/* Ignition key button */}
          <div className="flex gap-4">
            <button 
              disabled={!canStart}
              onClick={() => setEngineStarted(!engineStarted)}
              className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
                engineStarted 
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/10'
                  : 'bg-galf-yellow text-galf-carbon hover:brightness-110 shadow-galf-yellow/10 disabled:opacity-35 disabled:cursor-not-allowed'
              }`}
            >
              {engineStarted ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Couper Contact
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Démarrer Moteur
                </>
              )}
            </button>

            {/* Mission Mode Switch */}
            {engineStarted && (
              <button 
                onClick={missionActive ? resetMission : startMission}
                className={`px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xl ${
                  missionActive 
                    ? 'bg-[#10B981] text-white hover:brightness-110'
                    : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <Target className="w-4 h-4 animate-pulse" />
                {missionActive ? 'Mission Active' : 'Mode Mission'}
              </button>
            )}
          </div>
        </div>

        {/* ----------------- HYDRAULIC LEVERS / SLIDERS ----------------- */}
        <div className={`p-6 rounded-3xl bg-white/5 border border-white/5 flex-1 flex flex-col transition-all duration-500 ${
          !engineStarted ? 'opacity-25 pointer-events-none' : ''
        }`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <HardHat className="w-4 h-4 text-galf-yellow" /> Cockpit Hydraulique
            </h3>
            <button
              onClick={() => {
                triggerAudioAlert(600, 0.05)
                setKeyboardActive(!keyboardActive)
              }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                keyboardActive 
                  ? 'bg-galf-yellow text-galf-carbon border-galf-yellow shadow-[0_0_10px_rgba(255,176,0,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {keyboardActive ? "Clavier Actif" : "Activer Clavier"}
            </button>
          </div>

          {keyboardActive && (
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[9px] font-mono text-white/60 space-y-2 mb-4 animate-fadeIn">
              <span className="text-galf-yellow font-black uppercase block tracking-wider text-[8px]">Aide touches clavier :</span>
              {isPelle && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">Z</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">S</kbd> : Flèche</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">Q</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">D</kbd> : Tourelle</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">↑</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">↓</kbd> : Balancier</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">←</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">→</kbd> : Godet</div>
                </div>
              )}
              {isGrue && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">Z</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">S</kbd> : Crochet</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">Q</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">D</kbd> : Orientation</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">↑</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">↓</kbd> : Chariot</div>
                </div>
              )}
              {isBulldozer && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">Z</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">S</kbd> : Hauteur Lame</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">Q</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">D</kbd> : Inclinaison Lame</div>
                  <div><kbd className="bg-white/10 px-1 py-0.5 rounded">↑</kbd> / <kbd className="bg-white/10 px-1 py-0.5 rounded">↓</kbd> : Vitesse Chenilles</div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* ── Pelle controls ── */}
            {isPelle && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Flèche (Boom)</span>
                    <span className="text-galf-yellow">{boomAngle}°</span>
                  </div>
                  <input 
                    type="range" min="-10" max="45" value={boomAngle}
                    onChange={(e) => setBoomAngle(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Balancier (Arm)</span>
                    <span className="text-galf-yellow">{armAngle}°</span>
                  </div>
                  <input 
                    type="range" min="-65" max="15" value={armAngle}
                    onChange={(e) => setArmAngle(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Godet (Bucket)</span>
                    <span className="text-galf-yellow">{bucketAngle}°</span>
                  </div>
                  <input 
                    type="range" min="-45" max="55" value={bucketAngle}
                    onChange={(e) => setBucketAngle(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Rotation Tourelle</span>
                    <span className="text-galf-yellow">{cabRotation}°</span>
                  </div>
                  <input 
                    type="range" min="-80" max="80" value={cabRotation}
                    onChange={(e) => setCabRotation(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
              </>
            )}

            {/* ── Grue controls ── */}
            {isGrue && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Chariot (Trolley)</span>
                    <span className="text-galf-yellow">{trolleyPos - 65} m</span>
                  </div>
                  <input 
                    type="range" min="65" max="175" value={trolleyPos}
                    onChange={(e) => setTrolleyPos(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Hauteur Crochet</span>
                    <span className="text-galf-yellow">{180 - cableLength} m</span>
                  </div>
                  <input 
                    type="range" min="40" max="155" value={cableLength}
                    onChange={(e) => setCableLength(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Orientation Flèche</span>
                    <span className="text-galf-yellow">{jibRotation}°</span>
                  </div>
                  <input 
                    type="range" min="-25" max="25" value={jibRotation}
                    onChange={(e) => setJibRotation(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
              </>
            )}

            {/* ── Bulldozer controls ── */}
            {isBulldozer && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Hauteur Lame</span>
                    <span className="text-galf-yellow">{bladeHeight > 0 ? `-${bladeHeight} px` : `+${Math.abs(bladeHeight)} px`}</span>
                  </div>
                  <input 
                    type="range" min="-12" max="15" value={bladeHeight}
                    onChange={(e) => setBladeHeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Inclinaison Lame</span>
                    <span className="text-galf-yellow">{bladeTilt}°</span>
                  </div>
                  <input 
                    type="range" min="-15" max="15" value={bladeTilt}
                    onChange={(e) => setBladeTilt(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/60">
                    <span>Vitesse Chenilles (RPM Moteur)</span>
                    <span className="text-galf-yellow">{driveSpeed}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={driveSpeed}
                    onChange={(e) => setDriveSpeed(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ----------------- WEB AUDIO SYNTH CUSTOMIZER PANEL ----------------- */}
        <div className={`p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4 transition-all ${
          !engineStarted ? 'opacity-25 pointer-events-none' : ''
        }`}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
            <Settings2 className="w-4 h-4 text-galf-yellow" /> Ajustement Acoustique Moteur
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[9px] font-mono text-white/60">
            {/* Idle pitch customizer */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Vitesse Ralenti</span>
                <span className="text-galf-yellow">{Math.round(engineIdleSpeed * 100)}%</span>
              </div>
              <input 
                type="range" min="0.7" max="1.5" step="0.05" value={engineIdleSpeed}
                onChange={(e) => setEngineIdleSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
              />
            </div>
            
            {/* Turbo whistle gain customizer */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Sifflement Turbo</span>
                <span className="text-galf-yellow">{Math.round(turboVolume * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" value={turboVolume}
                onChange={(e) => setTurboVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
              />
            </div>

            {/* Exhaust profile customizer */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Profil Échappement</span>
                <span className="text-galf-yellow">{exhaustProfile} Hz</span>
              </div>
              <input 
                type="range" min="80" max="250" step="5" value={exhaustProfile}
                onChange={(e) => setExhaustProfile(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded accent-galf-yellow appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            NEW: WIDGET 1 - UNIT CONVERTER SIDEBAR
           ═══════════════════════════════════════════════ */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
            <Settings2 className="w-4 h-4 text-galf-yellow" /> Convertisseur d'Unités Cockpit
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-white/40 tracking-wider">Valeur à Convertir</label>
              <input
                type="number"
                value={convValue}
                onChange={(e) => setConvValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-galf-yellow font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-white/40 tracking-wider">Type de conversion</label>
              <select
                value={convType}
                onChange={(e) => setConvType(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-galf-yellow"
                style={{ colorScheme: 'dark' }}
              >
                <option value="bar_psi">Bar en PSI (Pression)</option>
                <option value="cv_kw">CV en kW (Puissance)</option>
                <option value="t_lb">Tonne en Livre (Poids)</option>
              </select>
            </div>
          </div>

          {(() => {
            let result = 0
            let unitIn = ''
            let unitOut = ''
            if (convType === 'bar_psi') {
              result = convValue * 14.5038
              unitIn = 'Bar'
              unitOut = 'PSI'
            } else if (convType === 'cv_kw') {
              result = convValue * 0.735499
              unitIn = 'CV'
              unitOut = 'kW'
            } else if (convType === 't_lb') {
              result = convValue * 2204.62
              unitIn = 't'
              unitOut = 'lb'
            }

            return (
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 text-center font-mono">
                <span className="text-white/60 text-xs">{convValue} {unitIn} = </span>
                <span className="text-galf-yellow font-black text-sm">{result.toFixed(2)} {unitOut}</span>
              </div>
            )
          })()}
        </div>

        {/* ═══════════════════════════════════════════════
            NEW: WIDGET 2 - LOCAL LEADERBOARD
           ═══════════════════════════════════════════════ */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-white">
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-galf-yellow" /> Tableau des Records (Slew-time)
            </span>
            <span className="text-[8px] font-mono text-white/40">Top 5</span>
          </div>

          <div className="space-y-2">
            {leaderboard.length === 0 ? (
              <p className="text-[10px] text-white/40 text-center py-2">Aucun record enregistré.</p>
            ) : (
              leaderboard.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/40 font-mono w-4">#{idx+1}</span>
                    <span className="font-bold text-white/80">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-galf-yellow font-black">{item.time}s</span>
                    <span className="text-[8px] text-white/30">{item.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
