"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Download, RefreshCw, Compass, AlertTriangle, 
  CheckCircle2, Volume2, VolumeX, Sliders, ShieldCheck, Activity, Gauge
} from 'lucide-react'
import { jsPDF } from 'jspdf'

interface CraneModel {
  id: string
  name: string
  type: 'mobile' | 'tower'
  maxCapacity: number // tons
  minRadius: number // meters
  minBoom: number // meters
  maxBoom: number // meters
}

const CRANE_MODELS: CraneModel[] = [
  {
    id: "LIEB-LTM-1050",
    name: "Grue Mobile Liebherr LTM 1050-3.1",
    type: "mobile",
    maxCapacity: 50.0,
    minRadius: 3.0,
    minBoom: 11.4,
    maxBoom: 38.0
  },
  {
    id: "POTAIN-MC-310",
    name: "Grue à Tour Potain MC 310 K12",
    type: "tower",
    maxCapacity: 12.0,
    minRadius: 2.5,
    minBoom: 20.0,
    maxBoom: 70.0
  }
]

export default function AbaqueGruePage() {
  const [selectedModelId, setSelectedModelId] = useState<string>("LIEB-LTM-1050")
  const [boomLength, setBoomLength] = useState<number>(25)
  const [radius, setRadius] = useState<number>(12)
  const [loadWeight, setLoadWeight] = useState<number>(6.5)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [reportGenerated, setReportGenerated] = useState<boolean>(false)
  const [liftPlanId, setLiftPlanId] = useState<string>("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Audio state refs
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const alarmIntervalRef = useRef<any>(null)

  const activeCrane = CRANE_MODELS.find(c => c.id === selectedModelId) || CRANE_MODELS[0]

  // Enforce geometric constraints: Radius must be less than Boom Length
  useEffect(() => {
    // Clamp boom length to model boundaries
    if (boomLength < activeCrane.minBoom) setBoomLength(activeCrane.minBoom)
    if (boomLength > activeCrane.maxBoom) setBoomLength(activeCrane.maxBoom)
    
    // Radius cannot exceed boom length (geometrical projection)
    if (radius > boomLength) {
      setRadius(Math.max(activeCrane.minRadius, Math.floor(boomLength - 1)))
    }
  }, [boomLength, activeCrane, radius])

  // Setup unique lift plan ID on mount
  useEffect(() => {
    setLiftPlanId(`LIFT-PLAN-GALF-${Math.floor(100000 + Math.random() * 900000)}`)
  }, [])

  // Calculate Crane capacity using engineering inverse-square approximations
  const calculateCapacity = (): number => {
    const minR = activeCrane.minRadius
    const minB = activeCrane.minBoom
    
    let capacity = activeCrane.maxCapacity
    
    if (activeCrane.type === 'mobile') {
      // Mobile crane capacity decreases quickly with radius and boom extension
      capacity = activeCrane.maxCapacity * Math.pow(minR / radius, 1.25) * Math.pow(minB / boomLength, 0.6)
    } else {
      // Tower crane capacity has a flatter curve due to counterweight trolley system
      capacity = activeCrane.maxCapacity * Math.pow(minR / radius, 1.0) * Math.pow(minB / boomLength, 0.4)
    }

    // Capacity cannot exceed maximum nominal load
    capacity = Math.min(activeCrane.maxCapacity, capacity)
    // Floor value to 0.1 tons minimum
    return parseFloat(Math.max(0.1, capacity).toFixed(2))
  }

  const capacityLimit = calculateCapacity()
  const loadPercentage = parseFloat(((loadWeight / capacityLimit) * 100).toFixed(1))
  
  const isDanger = loadPercentage > 100.0
  const isWarning = loadPercentage > 85.0 && loadPercentage <= 100.0
  const isSafe = loadPercentage <= 85.0

  // Calculate boom angle in degrees: cos(Angle) = Radius / Boom Length
  const calculateAngle = (): number => {
    if (radius >= boomLength) return 0
    const rad = Math.acos(radius / boomLength)
    return Math.round(rad * (180 / Math.PI))
  }

  const boomAngle = calculateAngle()

  // Audio beep feedback triggered by LMI alarms
  useEffect(() => {
    stopAlarm()

    if (!isAudioEnabled) return

    if (isDanger) {
      // Continuous urgent alarm siren
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(880, ctx.currentTime) // High pitch
        gain.gain.setValueAtTime(0.04, ctx.currentTime)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        
        oscRef.current = osc
        gainRef.current = gain

        // Modulate alarm frequency
        let flip = true
        alarmIntervalRef.current = setInterval(() => {
          if (!osc || ctx.state === 'closed') return
          osc.frequency.setValueAtTime(flip ? 980 : 780, ctx.currentTime)
          flip = !flip
        }, 150)
      } catch (err) {
        console.error(err)
      }
    } else if (isWarning) {
      // Intermittent caution beep
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        alarmIntervalRef.current = setInterval(() => {
          if (ctx.state === 'closed') return
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(650, ctx.currentTime)
          gain.gain.setValueAtTime(0.03, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
          
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.15)
        }, 500) // Beeps twice a second
      } catch (err) {
        console.error(err)
      }
    }

    return () => stopAlarm()
  }, [isDanger, isWarning, isAudioEnabled])

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current)
      alarmIntervalRef.current = null
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop()
      } catch {}
      oscRef.current = null
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close()
      } catch {}
      audioCtxRef.current = null
    }
  }

  // Draw simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Draw Grid Lines (CAD Blueprint style)
    ctx.strokeStyle = 'rgba(255, 176, 0, 0.04)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Ground floor
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(30, 360)
    ctx.lineTo(570, 360)
    ctx.stroke()

    // Base coordinates
    const pivotX = 140
    const pivotY = 320

    if (activeCrane.type === 'mobile') {
      // ──── MOBILE CRANE SIMULATION ────
      // Stabilizers pads
      ctx.strokeStyle = '#71717a'
      ctx.fillStyle = '#27272a'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.rect(pivotX - 50, pivotY + 25, 100, 15)
      ctx.fill()
      ctx.stroke()

      // Outriggers extension lines
      ctx.strokeStyle = isDanger ? '#ef4444' : isWarning ? '#eab308' : '#22c55e'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(pivotX - 45, pivotY + 25)
      ctx.lineTo(pivotX - 65, pivotY + 40)
      ctx.moveTo(pivotX + 45, pivotY + 25)
      ctx.lineTo(pivotX + 65, pivotY + 40)
      ctx.stroke()
      
      // Outrigger ground plates
      ctx.fillStyle = '#ffb000'
      ctx.fillRect(pivotX - 75, pivotY + 38, 20, 4)
      ctx.fillRect(pivotX + 55, pivotY + 38, 20, 4)

      // Crane main body / cab
      ctx.fillStyle = '#3f3f46'
      ctx.strokeStyle = '#a1a1aa'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.rect(pivotX - 35, pivotY, 70, 25)
      ctx.fill()
      ctx.stroke()

      // Wheels
      ctx.fillStyle = '#09090b'
      ctx.beginPath()
      ctx.arc(pivotX - 22, pivotY + 28, 12, 0, Math.PI * 2)
      ctx.arc(pivotX + 22, pivotY + 28, 12, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // ──── TOWER CRANE SIMULATION ────
      // Foundation block
      ctx.fillStyle = '#18181b'
      ctx.strokeStyle = '#52525b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(pivotX - 25, 335, 50, 25)
      ctx.fill()
      ctx.stroke()

      // Mast lattice towers
      ctx.strokeStyle = '#a1a1aa'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.rect(pivotX - 8, 140, 16, 200)
      ctx.stroke()

      // Inner diagonal bracing laces
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.beginPath()
      for (let y = 140; y < 340; y += 20) {
        ctx.moveTo(pivotX - 8, y)
        ctx.lineTo(pivotX + 8, y + 20)
        ctx.moveTo(pivotX + 8, y)
        ctx.lineTo(pivotX - 8, y + 20)
      }
      ctx.stroke()

      // Tower cabin cabin top pivot
      ctx.fillStyle = '#ffb000'
      ctx.fillRect(pivotX - 12, 125, 24, 15)
    }

    // Calculate boom graphics length scaling (e.g. 1m = 4 pixels)
    const scale = 4.2
    const graphicBoomLength = boomLength * scale
    const angleRad = (boomAngle * Math.PI) / 180

    // Coordinates of the boom tip
    const boomTipX = pivotX + graphicBoomLength * Math.cos(angleRad)
    // Canvas y coordinate grows downward, so subtract Y offset
    const boomTipY = (activeCrane.type === 'tower' ? 125 : pivotY) - graphicBoomLength * Math.sin(angleRad)

    // Draw the Boom (Flèche)
    // If danger, apply a bending offset to the tip (structural deflection)
    const deflectionY = isDanger ? 12 : isWarning ? 5 : 0
    const actualTipX = boomTipX
    const actualTipY = boomTipY + deflectionY

    ctx.strokeStyle = isDanger ? '#ef4444' : isWarning ? '#eab308' : '#ffb000'
    ctx.lineWidth = activeCrane.type === 'tower' ? 5 : 8
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(pivotX, activeCrane.type === 'tower' ? 125 : pivotY)
    
    if (deflectionY > 0) {
      // Draw bent boom curve using quadratic bezier curves
      ctx.quadraticCurveTo(
        pivotX + (actualTipX - pivotX) * 0.5, 
        (activeCrane.type === 'tower' ? 125 : pivotY) - (activeCrane.type === 'tower' ? 125 - actualTipY : pivotY - actualTipY) * 0.5 - deflectionY * 0.2, 
        actualTipX, 
        actualTipY
      )
    } else {
      ctx.lineTo(actualTipX, actualTipY)
    }
    ctx.stroke()

    // Draw load line (tackle/hook cable)
    const hookY = 280
    ctx.strokeStyle = '#d4d4d8'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(actualTipX, actualTipY)
    ctx.lineTo(actualTipX, hookY)
    ctx.stroke()

    // Draw Hook (crochet)
    ctx.strokeStyle = '#ffb000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(actualTipX, hookY + 4, 3, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()

    // Draw Suspended Load box (Box size relative to weight)
    const boxSize = Math.max(16, Math.min(48, 12 + loadWeight * 1.5))
    ctx.fillStyle = isDanger ? 'rgba(239, 68, 68, 0.85)' : isWarning ? 'rgba(234, 179, 8, 0.85)' : 'rgba(255, 176, 0, 0.85)'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.rect(actualTipX - boxSize / 2, hookY + 7, boxSize, boxSize)
    ctx.fill()
    ctx.stroke()

    // Draw weight text inside load box
    ctx.fillStyle = isDanger || isWarning || activeCrane.type === 'tower' ? '#000000' : '#ffffff'
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${loadWeight}T`, actualTipX, hookY + 7 + (boxSize / 2) + 3)

    // Draw HUD Projection Indicators (Working Radius projection)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 0.7
    ctx.setLineDash([4, 4])
    
    // Draw vertical tip line to floor
    ctx.beginPath()
    ctx.moveTo(actualTipX, actualTipY)
    ctx.lineTo(actualTipX, 360)
    ctx.stroke()

    // Draw horizontal distance radius line from pivot to target
    ctx.strokeStyle = '#ffb000'
    ctx.beginPath()
    ctx.moveTo(pivotX, 360)
    ctx.lineTo(actualTipX, 360)
    ctx.stroke()
    ctx.setLineDash([]) // reset

    // Draw angle symbol sector near pivot
    ctx.strokeStyle = '#ffb000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(pivotX, activeCrane.type === 'tower' ? 125 : pivotY, 25, 0, -angleRad, true)
    ctx.stroke()

    // Label Radius and Angle
    ctx.fillStyle = '#ffb000'
    ctx.font = '9px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`ANGLE: ${boomAngle}°`, pivotX + 28, (activeCrane.type === 'tower' ? 125 : pivotY) - 10)
    ctx.fillText(`PORTÉE: ${radius}m`, pivotX + (actualTipX - pivotX) / 2 - 20, 375)

    // Structural Stress warning indicators in Danger state
    if (isDanger) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText("ALERTE CRITIQUE : DÉPASSEMENT MOMENT DE CHARGE", w / 2, 35)
      
      // Draw stress indicator lines around pivot
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pivotX, activeCrane.type === 'tower' ? 125 : pivotY, 15, 0, Math.PI * 2)
      ctx.stroke()
    }

  }, [activeCrane, boomLength, radius, loadWeight, boomAngle, isDanger, isWarning])

  // PDF plan de levage report generator
  const handleExportPDF = () => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const doc = new jsPDF()

        // 1. Tech Header Block
        doc.setFillColor(26, 26, 29)
        doc.rect(0, 0, 210, 48, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.setTextColor(255, 255, 255)
        doc.text("LIFT PLAN & AVERTISSEUR DE SÉCURITÉ CEC", 15, 20)

        doc.setFontSize(9)
        doc.setTextColor(255, 176, 0)
        doc.text("SERVICE DE DIAGNOSTIC ET VALIDATION DES ABAQUES - GALF FORMATION CI", 15, 28)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(180, 180, 180)
        doc.text(`ID Document : ${liftPlanId}  |  Date : ${new Date().toLocaleString('fr-FR')}`, 15, 36)
        doc.text("Conforme au Code de Sécurité des Travaux Publics de Côte d'Ivoire.", 15, 41)

        // Safety line
        doc.setFillColor(255, 176, 0)
        doc.rect(0, 45, 210, 3, "F")

        // 2. Safety Status Indicator Badge
        let statusText = "STATUT : LEVAGE SÉCURISÉ (APPROUVÉ)"
        let badgeColor = [34, 197, 94] // Green
        
        if (isDanger) {
          statusText = "STATUT : REJETÉ (RISQUE MAJEUR DE BASCULEMENT)"
          badgeColor = [239, 68, 68] // Red
        } else if (isWarning) {
          statusText = "STATUT : CONFORMATION TECHNIQUE (ATTENTION)"
          badgeColor = [234, 179, 8] // Yellow
        }

        doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2])
        doc.rect(15, 58, 180, 10, "F")
        
        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.setTextColor(isWarning ? 26 : 255, isWarning ? 26 : 255, isWarning ? 29 : 255)
        doc.text(statusText, 105, 64.5, { align: "center" })

        // 3. Main parameter columns
        let startY = 82
        doc.setFontSize(11)
        doc.setTextColor(30, 30, 30)
        doc.text("1. PARAMÈTRES TECHNIQUES DU LEVAGE", 15, startY)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(80, 80, 80)
        
        doc.text(`Modèle d'équipement : ${activeCrane.name}`, 15, startY + 8)
        doc.text(`Type d'engin de levage : Grue ${activeCrane.type === 'mobile' ? 'Mobile Télescopique' : 'à Tour de Chantier'}`, 15, startY + 14)
        doc.text(`Longueur de flèche déployée : ${boomLength} mètres`, 15, startY + 20)
        doc.text(`Portée (Rayon de travail réel) : ${radius} mètres`, 15, startY + 26)
        doc.text(`Angle d'inclinaison de flèche : ${boomAngle}° par rapport à l'horizontale`, 15, startY + 32)

        // Column 2 (Right side)
        doc.setFont("helvetica", "bold")
        doc.text("LIMITATIONS PHYSIQUES DU LEVAGE :", 115, startY + 8)
        doc.setFont("helvetica", "normal")
        doc.text(`Charge suspendue simulée : ${loadWeight} tonnes`, 115, startY + 14)
        doc.text(`Capacité limite calculée : ${capacityLimit} tonnes`, 115, startY + 20)
        
        const loadColor = isDanger ? [220, 50, 50] : isWarning ? [200, 150, 20] : [30, 150, 30]
        doc.setFont("helvetica", "bold")
        doc.setTextColor(loadColor[0], loadColor[1], loadColor[2])
        doc.text(`Taux de moment de charge (LMI) : ${loadPercentage}%`, 115, startY + 26)
        doc.setTextColor(80, 80, 80)

        // 4. Load Chart Table
        startY += 48
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.setTextColor(30, 30, 30)
        doc.text("2. ABAQUE DE SÉCURITÉ DE CHARGE DE RÉFÉRENCE", 15, startY)

        doc.setFillColor(240, 240, 242)
        doc.rect(15, startY + 5, 180, 8, "F")
        doc.setFontSize(8.5)
        doc.setTextColor(40, 40, 40)
        doc.text("RAYON (M)", 20, startY + 10.5)
        doc.text("LONGUEUR DE FLÈCHE", 55, startY + 10.5)
        doc.text("ANGLE CALCULÉ", 100, startY + 10.5)
        doc.text("CAPACITÉ MAX (T)", 140, startY + 10.5)
        doc.text("STATUT SÉCURITÉ", 172, startY + 10.5)

        // Simulate some safety values in the chart for the current boom length
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        
        const sampleRadii = [
          Math.max(activeCrane.minRadius, Math.floor(radius * 0.5)),
          radius,
          Math.min(activeCrane.maxBoom, Math.floor(radius * 1.5))
        ].filter(r => r <= boomLength)

        let tableY = startY + 13
        sampleRadii.forEach((r) => {
          // Re-calculate mock capacity for this test radius
          let cVal = activeCrane.maxCapacity
          if (activeCrane.type === 'mobile') {
            cVal = activeCrane.maxCapacity * Math.pow(activeCrane.minRadius / r, 1.25) * Math.pow(activeCrane.minBoom / boomLength, 0.6)
          } else {
            cVal = activeCrane.maxCapacity * Math.pow(activeCrane.minRadius / r, 1.0) * Math.pow(activeCrane.minBoom / boomLength, 0.4)
          }
          cVal = parseFloat(Math.min(activeCrane.maxCapacity, cVal).toFixed(2))

          const computedAngle = Math.round(Math.acos(r / boomLength) * (180 / Math.PI))
          const checkPercent = (loadWeight / cVal) * 100

          doc.line(15, tableY, 195, tableY)
          doc.text(`${r} m`, 20, tableY + 5)
          doc.text(`${boomLength} m`, 55, tableY + 5)
          doc.text(`${computedAngle}°`, 100, tableY + 5)
          doc.text(`${cVal} T`, 140, tableY + 5)

          if (checkPercent > 100.0) {
            doc.setTextColor(220, 50, 50)
            doc.text("DANGER (CRITIQUE)", 172, tableY + 5)
          } else if (checkPercent > 85.0) {
            doc.setTextColor(200, 150, 20)
            doc.text("LIMITE (85%)", 172, tableY + 5)
          } else {
            doc.setTextColor(30, 150, 30)
            doc.text("SÉCURISÉ", 172, tableY + 5)
          }
          doc.setTextColor(80, 80, 80)
          tableY += 7.5
        })

        // 5. HSE Recommendations
        tableY += 12
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.setTextColor(30, 30, 30)
        doc.text("3. INSTRUCTIONS DE SÉCURITÉ OBLIGATOIRES GALF", 15, tableY)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor(70, 70, 70)
        
        doc.text("- Vérifier la vitesse du vent au sommet de flèche à l'aide de l'anémomètre (maximum 40 km/h autorisés).", 15, tableY + 7)
        doc.text("- Assurer une parfaite horizontalité de la grue mobile sur vérins stabilisateurs (tolérance max: 1%).", 15, tableY + 12.5)
        doc.text("- Toujours guider la charge suspendue à l'aide d'un cordage (fil de guidage) pour éviter les oscillations pendulaires.", 15, tableY + 18)

        // 6. Signatures block
        doc.setDrawColor(255, 176, 0)
        doc.setLineWidth(0.5)
        doc.rect(15, 235, 180, 22)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        doc.setTextColor(26, 26, 29)
        doc.text("AVIS DE CONFORMITÉ DIRECTEUR PÉDAGOGIQUE ET INSPECTEUR HSE CI", 20, 241)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(7.5)
        doc.setTextColor(120, 120, 120)
        doc.text("Le plan de levage ci-dessus a été certifié par rapport aux normes techniques de l'OSHA et des agréments CACES R482.", 20, 247)
        doc.text("Toute altération ou surcharge réelle décharge GALF de toute responsabilité civile ou pénale.", 20, 251)

        // Save PDF
        doc.save(`Plan-de-Levage-GALF-${liftPlanId.split('-')[2] || 'CEC'}.pdf`)
        setReportGenerated(true)
      } catch (err) {
        console.error(err)
      }
      setIsGenerating(false)
    }, 1500)
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
    <div className="min-h-screen pb-24 relative overflow-hidden text-left" style={{ background: 'var(--galf-bg)' }}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal opacity-5" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-galf-yellow/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container-galf pt-24 relative z-10">
        
        <Link 
          href="/mediatheque"
          className="inline-flex items-center gap-2 text-galf-yellow font-black uppercase tracking-widest text-xs mb-4 hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la Médiathèque
        </Link>

        {/* HERO TITLE */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
              Indicateur de Moment de Charge (CEC)
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mt-3">
              SIMULATEUR <span className="text-galf-yellow">D'ABAQUES DE CHARGE</span>
            </h1>
            <p className="text-white/60 text-sm max-w-xl mt-2 leading-relaxed">
              Formez-vous aux limites de basculement des grues. Configurez la flèche, la portée et la charge, observez les contraintes sur le modèle de CAO et exportez votre plan de levage.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                triggerAudioClick()
                setIsAudioEnabled(!isAudioEnabled)
              }}
              className={`p-4 rounded-xl border flex items-center gap-2 transition-all ${
                isAudioEnabled 
                  ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-xs font-black uppercase tracking-wider">Son Alarme (CEC)</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="bg-galf-yellow text-galf-carbon px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Générer Plan de Levage</span>
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: INTERACTIVE CANVAS VIEWPORT (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-5 h-5 text-galf-yellow" /> Rendu CAO Structurel 2D
                </h3>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  isDanger ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  isWarning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {isDanger ? 'RISQUE DE BASCULEMENT' : isWarning ? 'ZONE DE CHARGE ATTENTION' : 'MARGE DE LEVAGE SAINE'}
                </span>
              </div>

              {/* The Simulator Canvas */}
              <div className="relative w-full aspect-[16/10] rounded-2xl bg-zinc-950/80 overflow-hidden border border-white/5 flex items-center justify-center">
                <canvas ref={canvasRef} width={600} height={400} className="w-full h-full pointer-events-none" />
                
                {/* LMI Indicator Panel Overlay */}
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md rounded-xl p-3 border border-white/10 text-[9px] font-mono text-white/70 space-y-1.5 z-20 text-left">
                  <div className="text-galf-yellow font-black uppercase text-[10px] tracking-wider border-b border-white/5 pb-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Indicateur LMI (CEC)
                  </div>
                  <div><span className="opacity-50">ANGLE FLÈCHE :</span> <span className="font-bold text-white">{boomAngle}°</span></div>
                  <div><span className="opacity-50">RAYON DE TRAVAIL :</span> <span className="font-bold text-white">{radius} m</span></div>
                  <div><span className="opacity-50">CHARGE RÉELLE :</span> <span className="font-bold text-white">{loadWeight} T</span></div>
                  <div><span className="opacity-50">CHARGE NOMINALE MAX :</span> <span className="font-bold text-white">{capacityLimit} T</span></div>
                  <div className="border-t border-white/5 pt-1 flex justify-between gap-4">
                    <span className="opacity-50">INDICE MOMENT :</span>
                    <span className={`font-black ${isDanger ? 'text-red-400 animate-pulse' : isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                      {loadPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: CONFIGURATION SLIDERS & SAFETY AUDIT (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. MODEL SELECTION */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-galf-yellow" /> Sélection de l'Équipement
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {CRANE_MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => {
                      triggerAudioClick()
                      setSelectedModelId(model.id)
                    }}
                    className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-left transition-all cursor-pointer ${
                      selectedModelId === model.id 
                        ? 'bg-galf-yellow/15 border-galf-yellow text-galf-yellow' 
                        : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <div>{model.name.split(' ')[2]}</div>
                    <div className="text-[8px] opacity-60 mt-0.5">Capacité: {model.maxCapacity}T</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. SLIDERS PANEL */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-galf-yellow" /> Constantes de Levage
              </h3>

              {/* Slider 1: Boom Length */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/60 uppercase text-[10px] tracking-wide">Longueur de Flèche (Boom)</span>
                  <span className="text-white font-mono">{boomLength} m</span>
                </div>
                <input 
                  type="range"
                  min={activeCrane.minBoom}
                  max={activeCrane.maxBoom}
                  step="1"
                  value={boomLength}
                  onChange={(e) => setBoomLength(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                />
                <div className="flex justify-between text-[8px] text-white/30 font-mono">
                  <span>Min ({activeCrane.minBoom}m)</span>
                  <span>Max ({activeCrane.maxBoom}m)</span>
                </div>
              </div>

              {/* Slider 2: Working Radius */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/60 uppercase text-[10px] tracking-wide">Portée (Rayon de Travail)</span>
                  <span className="text-white font-mono">{radius} m</span>
                </div>
                <input 
                  type="range"
                  min={activeCrane.minRadius}
                  max={boomLength} // capped at boomLength
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                />
                <div className="flex justify-between text-[8px] text-white/30 font-mono">
                  <span>Min ({activeCrane.minRadius}m)</span>
                  <span>Max (Flèche max: {boomLength}m)</span>
                </div>
              </div>

              {/* Slider 3: Load Weight */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/60 uppercase text-[10px] tracking-wide">Poids de la charge suspendue</span>
                  <span className={isDanger ? 'text-red-400 font-black animate-pulse font-mono' : 'text-white font-mono'}>
                    {loadWeight} T
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max={activeCrane.maxCapacity}
                  step="0.5"
                  value={loadWeight}
                  onChange={(e) => setLoadWeight(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galf-yellow focus:outline-none"
                />
                <div className="flex justify-between text-[8px] text-white/30 font-mono">
                  <span>0.5 Tonne</span>
                  <span>Capacité nominale ({activeCrane.maxCapacity}T)</span>
                </div>
              </div>
            </div>

            {/* 3. SAFETY DIAGNOSTIC PANEL */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-black/40 border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-galf-yellow" /> Évaluation HSE de Stabilité
              </h3>
              
              {isDanger && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 text-red-200 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">RISQUE DE RENVERSEMENT DE GRUE</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      Moment de charge de {loadPercentage}% critique. Le moment de renversement dépasse la force du contrepoids. Risque de rupture ou de chute de grue imminent !
                    </div>
                  </div>
                </div>
              )}

              {isWarning && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3 text-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">SEUIL DE SÉCURITÉ CRITIQUE</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      Charge de {loadPercentage}% dans la zone d'alerte jaune ({'>'}85%). Le levage requiert l'autorisation expresse de l'inspecteur HSE et une vitesse de manœuvre réduite.
                    </div>
                  </div>
                </div>
              )}

              {isSafe && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-start gap-3 text-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-left">
                    <div className="font-black uppercase tracking-wider">LE VALEUR DE MOMENT EST SAIN</div>
                    <div className="mt-1 leading-relaxed opacity-80">
                      Moment de charge de {loadPercentage}% conforme aux abaques réglementaires CACES R482. Opération de levage autorisée sous conditions normales de vent.
                    </div>
                  </div>
                </div>
              )}

              {reportGenerated && (
                <div className="mt-4 text-[10px] text-green-400 font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> Plan de levage PDF généré.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
