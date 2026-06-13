"use client"
import { useState, useEffect } from 'react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { 
  Users, Video, Calendar, Upload, Settings, Check, X, Clock, 
  AlertTriangle, Send, Bell, Plus, Trash2, Award, Printer, 
  Share2, UserCheck, Shield, ChevronRight, FileText
} from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

// Initial student database
const INITIAL_STUDENTS = [
  { id: 1, name: "Jean Kouadio", presence: "present", notes: { pelle: 14, grue: 12, safety: 16 } },
  { id: 2, name: "Marc Koffi", presence: "present", notes: { pelle: 16, grue: 15, safety: 18 } },
  { id: 3, name: "Aya Konan", presence: "late", notes: { pelle: 11, grue: 10, safety: 12 } },
  { id: 4, name: "Fatou Sylla", presence: "absent", notes: { pelle: 9, grue: 8, safety: 14 } },
  { id: 5, name: "Bakary Touré", presence: "present", notes: { pelle: 15, grue: 17, safety: 19 } }
]

// Substitute teachers database
const SUBSTITUTES_DB = [
  { name: "Adama Traoré", machines: ["Pelle Hydraulique", "Bulldozer D6"], status: "Disponible" },
  { name: "Koffi N'guessan", machines: ["Grue à Tour", "Grue Mobile"], status: "Disponible" },
  { name: "Aminata Diallo", machines: ["Pelle Hydraulique", "Chariot Élévateur"], status: "Occupée" },
  { name: "Didier Drogba", machines: ["Bulldozer D6"], status: "Disponible" }
]

// Monthly attendance stats database
const ATTENDANCE_STATS = {
  june: { present: 88, late: 8, absent: 4 },
  may: { present: 92, late: 5, absent: 3 },
  april: { present: 82, late: 12, absent: 6 }
}

export default function InstructeurDashboard() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false)
  
  // SMS broadcast states
  const [selectedSmsTab, setSelectedSmsTab] = useState<'alert' | 'congrats'>('alert')
  const [smsMessage, setSmsMessage] = useState("")
  const [smsStatus, setSmsStatus] = useState("")

  // Exam planner states
  const [examStudentId, setExamStudentId] = useState(1)
  const [examDate, setExamDate] = useState("2026-06-18")
  const [examTime, setExamTime] = useState("09:00")
  const [examMachine, setExamMachine] = useState("Pelle Hydraulique")
  const [exams, setExams] = useState<any[]>([])

  // Feature 1: Monthly Attendance states
  const [attendanceMonth, setAttendanceMonth] = useState<'june' | 'may' | 'april'>('june')

  // Feature 2: Simulated Report Card Overlay
  const [activeReportStudentId, setActiveReportStudentId] = useState<number | null>(null)

  // Feature 3: Substitute Planner drawer
  const [isSubDrawerOpen, setIsSubDrawerOpen] = useState(false)
  const [subDate, setSubDate] = useState("2026-06-16")
  const [subMachine, setSubMachine] = useState("Pelle Hydraulique")
  const [assignedSubs, setAssignedSubs] = useState<Array<{ date: string; machine: string; teacher: string }>>([])

  // Load state from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('galf_instructor_students')
    if (savedStudents) {
      try { setStudents(JSON.parse(savedStudents)) } catch (e) {}
    }
    const savedExams = localStorage.getItem('galf_instructor_exams')
    if (savedExams) {
      try { setExams(JSON.parse(savedExams)) } catch (e) {}
    } else {
      const defaultExams = [
        { id: 1, studentName: "Jean Kouadio", date: "2026-06-15", time: "10:30", machine: "Grue à Tour" },
        { id: 2, studentName: "Bakary Touré", date: "2026-06-16", time: "14:00", machine: "Pelle Hydraulique" }
      ]
      setExams(defaultExams)
      localStorage.setItem('galf_instructor_exams', JSON.stringify(defaultExams))
    }
    const savedSubs = localStorage.getItem('galf_instructor_subs')
    if (savedSubs) {
      try { setAssignedSubs(JSON.parse(savedSubs)) } catch (e) {}
    }
  }, [])

  // Helper to save students
  const saveStudentsToLocal = (updatedList: typeof students) => {
    setStudents(updatedList)
    localStorage.setItem('galf_instructor_students', JSON.stringify(updatedList))
  }

  // Toggle presence
  const handleTogglePresence = (studentId: number, status: 'present' | 'absent' | 'late') => {
    const updated = students.map(s => s.id === studentId ? { ...s, presence: status } : s)
    saveStudentsToLocal(updated)
    triggerSound(400, 'sine', 0.05)
  }

  // Edit grades
  const handleUpdateGrade = (studentId: number, subject: 'pelle' | 'grue' | 'safety', value: number) => {
    const clamped = Math.max(0, Math.min(20, value))
    const updated = students.map(s => {
      if (s.id === studentId) {
        return { ...s, notes: { ...s.notes, [subject]: clamped } }
      }
      return s
    })
    saveStudentsToLocal(updated)
  }

  // Schedule exams
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault()
    const student = students.find(s => s.id === Number(examStudentId))
    if (!student) return

    const newExam = {
      id: Date.now(),
      studentName: student.name,
      date: examDate,
      time: examTime,
      machine: examMachine
    }
    const updatedExams = [...exams, newExam]
    setExams(updatedExams)
    localStorage.setItem('galf_instructor_exams', JSON.stringify(updatedExams))

    // Web Audio Sound confirmation
    triggerSound(660, 'sine', 0.1)
    setTimeout(() => triggerSound(880, 'sine', 0.15), 100)
    setIsAlertDrawerOpen(false)
  }

  const handleDeleteExam = (id: number) => {
    const updated = exams.filter(ex => ex.id !== id)
    setExams(updated)
    localStorage.setItem('galf_instructor_exams', JSON.stringify(updated))
    triggerSound(330, 'sawtooth', 0.1)
  }

  // Alert SMS broadcast / Congrats SMS broadcast
  const handleBroadcastSMS = () => {
    if (!smsMessage.trim()) return
    setSmsStatus("Envoi en cours...")
    
    // Play alert sound
    triggerSound(520, 'triangle', 0.2)
    setTimeout(() => {
      triggerSound(780, 'sine', 0.25)
    }, 150)

    setTimeout(() => {
      setSmsStatus(
        selectedSmsTab === 'alert' 
          ? "Succès : Alerte SMS envoyée aux 48 élèves de la cohorte !"
          : "Succès : SMS de Félicitations envoyé aux majors de la promotion !"
      )
      setSmsMessage("")
      setTimeout(() => setSmsStatus(""), 4000)
    }, 1500)
  }

  // Fill congratulations message automatically
  const handleLoadCongratsMsg = () => {
    // Find students with average >= 15
    const majors = students
      .map(s => ({ name: s.name, avg: (s.notes.pelle + s.notes.grue + s.notes.safety) / 3 }))
      .filter(s => s.avg >= 15)
    
    if (majors.length === 0) {
      setSmsMessage("Aucun élève n'a atteint le seuil d'excellence de 15/20 pour le moment.")
      return
    }

    const majorsNames = majors.map(m => `${m.name} (${m.avg.toFixed(1)}/20)`).join(', ')
    setSmsMessage(`[FÉLICITATIONS GALF] Bravo à nos majors de promotion pour leurs performances exceptionnelles ce mois-ci : ${majorsNames}. Continuez ainsi ! - Instructeur B. Koné`)
    triggerSound(600, 'sine', 0.08)
  }

  // Handle Substitute assignment
  const handleAssignSubstitute = (teacherName: string) => {
    const newSub = {
      date: subDate,
      machine: subMachine,
      teacher: teacherName
    }
    const updated = [...assignedSubs, newSub]
    setAssignedSubs(updated)
    localStorage.setItem('galf_instructor_subs', JSON.stringify(updated))
    setIsSubDrawerOpen(false)
    triggerSound(660, 'sine', 0.1)
    setTimeout(() => triggerSound(880, 'sine', 0.15), 100)
  }

  const handleDeleteSub = (idx: number) => {
    const updated = assignedSubs.filter((_, i) => i !== idx)
    setAssignedSubs(updated)
    localStorage.setItem('galf_instructor_subs', JSON.stringify(updated))
    triggerSound(330, 'sawtooth', 0.1)
  }

  // Synth helper using Web Audio API
  const triggerSound = (freq: number, type: OscillatorType, duration: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (err) {}
  }

  // Calculate average notes
  const avgPelle = students.reduce((acc, s) => acc + s.notes.pelle, 0) / students.length
  const avgGrue = students.reduce((acc, s) => acc + s.notes.grue, 0) / students.length
  const avgSafety = students.reduce((acc, s) => acc + s.notes.safety, 0) / students.length
  
  // Simulated stats for Radar Chart
  const radarAxes = [
    { label: "Précision Pelle", score: avgPelle * 5 }, // scale to 100
    { label: "Manœuvre Grue", score: avgGrue * 5 },
    { label: "Règlement Sécurité", score: avgSafety * 5 },
    { label: "Maintenance", score: 80 },
    { label: "Eco-conduite", score: 70 }
  ]

  // Calculate coordinates for SVG Polygon
  const radarPoints = radarAxes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const radius = (axis.score / 100) * 80 // max radius is 80
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')

  const gridCircles = [20, 40, 60, 80]

  const activeReportStudent = students.find(s => s.id === activeReportStudentId)

  return (
    <div className="flex bg-galf-bg min-h-screen">
      {/* Sidebar Instructeur */}
      <aside className="w-64 bg-galf-bg-alt border-r border-galf-border hidden md:flex flex-col pt-24 shrink-0">
         <div className="px-6 pb-6 border-b border-galf-border">
            <div className="font-black text-xl tracking-tighter" style={{ color: 'var(--galf-text)' }}>INSTRUCTEUR<span className="text-galf-yellow">.</span></div>
            <div className="text-sm text-galf-text-secondary mt-2">B. Koné (Engins lourds)</div>
         </div>
         <nav className="p-4 space-y-2 text-sm flex-1">
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-galf-yellow/10 text-galf-yellow font-bold">
               <Video className="w-4 h-4" /> Mes Cours
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-galf-text-secondary hover:bg-galf-yellow/10 hover:text-galf-yellow transition-colors">
               <Users className="w-4 h-4" /> Apprenants
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-galf-text-secondary hover:bg-galf-yellow/10 hover:text-galf-yellow transition-colors">
               <Calendar className="w-4 h-4" /> Planning Cohorte
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-galf-text-secondary hover:bg-galf-yellow/10 hover:text-galf-yellow transition-colors">
               <Upload className="w-4 h-4" /> Dépôt ressources
            </a>
         </nav>
         <div className="p-4 border-t border-galf-border">
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-galf-text-secondary hover:bg-galf-yellow/10 hover:text-galf-yellow transition-colors text-sm">
               <Settings className="w-4 h-4" /> Paramètres
            </a>
         </div>
      </aside>

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 overflow-y-auto w-full relative">
         <div className="absolute right-[5%] top-[10%] w-[500px] h-[500px] opacity-[0.03] pointer-events-none z-0">
            <AnimatedMachineHeader type="grue" />
         </div>

         <div className="relative z-10 max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-3">Espace Pédagogique</div>
              <TextReveal 
                text="CENTRE DE CONTRÔLE INSTRUCTEUR" 
                className="text-3xl md:text-5xl lg:text-6xl font-black mb-8" 
              />
            </FadeIn>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Apprenants actifs", value: "48", icon: Users },
                { label: "Moyenne Pratique Pelle", value: `${avgPelle.toFixed(1)}/20`, icon: Award },
                { label: "Moyenne Pratique Grue", value: `${avgGrue.toFixed(1)}/20`, icon: Award },
                { label: "Présence moyenne", value: `${((students.filter(s => s.presence === 'present').length + students.filter(s => s.presence === 'late').length * 0.5) / students.length * 100).toFixed(0)}%`, icon: Clock },
              ].map((stat, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <div className="glass-card p-6 rounded-2xl border-galf-border shadow-md">
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-xs text-galf-text-secondary font-black uppercase tracking-wider">{stat.label}</div>
                        <stat.icon className="w-5 h-5 text-galf-yellow" />
                     </div>
                     <div className="text-3xl font-black" style={{ color: 'var(--galf-text)' }}>{stat.value}</div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Feature 1: Digital Presence Panel */}
              <FadeIn className="lg:col-span-2">
                <div className="glass-card border-galf-border rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                      <Users className="w-5 h-5 text-galf-yellow" /> Feuille d'émargement dynamique (Cohorte Mars)
                    </h3>
                    
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/5 dark:bg-black/20 rounded-xl border border-galf-border gap-4">
                          <div>
                            <div className="text-sm font-black text-galf-text mb-1">{student.name}</div>
                            <div className="text-[10px] text-galf-text-secondary uppercase font-bold">Inscrit : Pelle + Grue</div>
                          </div>
                          
                          {/* Segmented control for presence */}
                          <div className="flex gap-1.5 bg-black/5 dark:bg-black/40 p-1.5 rounded-lg border border-galf-border">
                            {[
                              { status: 'present', label: 'Présent', color: 'bg-green-500 text-white' },
                              { status: 'late', label: 'En Retard', color: 'bg-yellow-500 text-black' },
                              { status: 'absent', label: 'Absent', color: 'bg-red-500 text-white' }
                            ].map((btn) => (
                              <button
                                key={btn.status}
                                onClick={() => handleTogglePresence(student.id, btn.status as any)}
                                className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
                                  student.presence === btn.status 
                                    ? btn.color 
                                    : 'text-galf-text-secondary hover:text-galf-text hover:bg-black/5 dark:hover:bg-white/5'
                                  }`}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════════
                      FEATURE 1: SIMULATEUR D'ASSIDUITE GLOBAL (SVG + FILTRES)
                     ═══════════════════════════════════════════════ */}
                  <div className="mt-8 pt-6 border-t border-galf-border">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-xs font-black text-galf-text uppercase tracking-wider">Taux d'Assiduité Global</h4>
                        <p className="text-[9px] text-galf-text-secondary">Statistiques agrégées par mois.</p>
                      </div>

                      {/* Month Filter tabs */}
                      <div className="flex bg-black/5 dark:bg-black/40 border border-galf-border p-1 rounded-lg">
                        {[
                          { key: 'june', label: 'Juin' },
                          { key: 'may', label: 'Mai' },
                          { key: 'april', label: 'Avril' }
                        ].map(month => (
                          <button
                            key={month.key}
                            onClick={() => {
                              setAttendanceMonth(month.key as any)
                              triggerSound(480, 'sine', 0.05)
                            }}
                            className={`text-[9px] font-black uppercase px-2.5 py-1 rounded transition-all cursor-pointer ${
                              attendanceMonth === month.key 
                                ? 'bg-galf-yellow text-galf-carbon' 
                                : 'text-galf-text-secondary hover:text-galf-text'
                            }`}
                          >
                            {month.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SVG Stacked Bar Chart */}
                    <div className="bg-black/5 dark:bg-black/30 border border-galf-border p-4 rounded-xl flex items-center justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-green-500 dark:text-green-400">Présence : {ATTENDANCE_STATS[attendanceMonth].present}%</span>
                          <span className="text-yellow-600 dark:text-yellow-400">Retards : {ATTENDANCE_STATS[attendanceMonth].late}%</span>
                          <span className="text-red-500 dark:text-red-400">Absences : {ATTENDANCE_STATS[attendanceMonth].absent}%</span>
                        </div>

                        {/* Stacked bar drawing */}
                        <svg viewBox="0 0 100 10" className="w-full h-4 rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                          <rect x="0" y="0" width={ATTENDANCE_STATS[attendanceMonth].present} height="10" fill="#22c55e" className="transition-all duration-700" />
                          <rect x={ATTENDANCE_STATS[attendanceMonth].present} y="0" width={ATTENDANCE_STATS[attendanceMonth].late} height="10" fill="#eab308" className="transition-all duration-700" />
                          <rect x={ATTENDANCE_STATS[attendanceMonth].present + ATTENDANCE_STATS[attendanceMonth].late} y="0" width={ATTENDANCE_STATS[attendanceMonth].absent} height="10" fill="#ef4444" className="transition-all duration-700" />
                        </svg>
                      </div>

                      <div className="text-center shrink-0">
                        <span className="text-[8px] font-black text-galf-text-muted block uppercase tracking-wider">Ratio Total</span>
                        <span className="text-xl font-black text-galf-yellow">{ATTENDANCE_STATS[attendanceMonth].present}%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </FadeIn>
 
              {/* Feature 5: Dynamic SVG Radar Chart */}
              <FadeIn>
                <div className="glass-card border-galf-border rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-black text-white mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                      <Award className="w-5 h-5 text-galf-yellow" /> Radar des Compétences Groupe
                    </h3>
                    <p className="text-[10px] text-galf-text-secondary leading-relaxed mb-6">
                      Graphique actualisé en temps réel selon les notes saisies dans le carnet ci-dessous.
                    </p>
                  </div>
 
                  <div className="flex justify-center items-center py-4">
                    <svg width="200" height="200" className="overflow-visible">
                      {/* Circular grids */}
                      {gridCircles.map((r) => (
                        <circle
                          key={r}
                          cx="100"
                          cy="100"
                          r={r}
                          fill="none"
                          stroke="var(--galf-border)"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Radar Web Polygon */}
                      <polygon
                        points={radarPoints}
                        fill="rgba(255, 176, 0, 0.2)"
                        stroke="#FFB000"
                        strokeWidth="2"
                        className="transition-all duration-500 ease-out"
                      />
                      
                      {/* Draw vertices */}
                      {radarAxes.map((axis, i) => {
                        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                        const radius = (axis.score / 100) * 80 // max radius is 80
                        const x = 100 + radius * Math.cos(angle)
                        const y = 100 + radius * Math.sin(angle)
                        const labelX = 100 + 95 * Math.cos(angle)
                        const labelY = 100 + 95 * Math.sin(angle)
                        
                        return (
                          <g key={i}>
                            {/* Axis line */}
                            <line x1="100" y1="100" x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="var(--galf-border)" strokeWidth="1" />
                            {/* Data dot */}
                            <circle cx={x} cy={y} r="3.5" fill="#FFB000" />
                            {/* Text Label */}
                            <text
                              x={labelX}
                              y={labelY}
                              fill="#fff"
                              fontSize="8"
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="opacity-70 font-sans"
                            >
                              {axis.label}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </div>
              </FadeIn>
            </div>
 
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Feature 2: Practical Gradebook Board */}
              <FadeIn className="lg:col-span-2">
                <div className="glass-card border-galf-border rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h3 className="font-black text-white uppercase tracking-wider text-sm flex items-center gap-2">
                      <Settings className="w-5 h-5 text-galf-yellow" /> Carnet de notes pratique interactif
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-galf-border text-galf-text-secondary font-black uppercase tracking-widest">
                          <th className="py-4">Étudiant</th>
                          <th className="py-4 px-2 text-center">Pelle /20</th>
                          <th className="py-4 px-2 text-center">Grue /20</th>
                          <th className="py-4 px-2 text-center">HSE /20</th>
                          <th className="py-4 text-center">Moyenne</th>
                          <th className="py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-galf-border">
                        {students.map((student) => {
                          const average = (student.notes.pelle + student.notes.grue + student.notes.safety) / 3
                          return (
                            <tr key={student.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                              <td className="py-4 font-black text-galf-text">{student.name}</td>
                              
                              {/* Pelle grade */}
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  value={student.notes.pelle}
                                  onChange={(e) => handleUpdateGrade(student.id, 'pelle', Number(e.target.value))}
                                  className={`w-12 text-center bg-black/5 dark:bg-black/40 border border-galf-border rounded p-1 font-mono text-galf-text ${student.notes.pelle < 10 ? 'text-red-500 border-red-500/30' : ''}`}
                                />
                              </td>
                              
                              {/* Grue grade */}
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  value={student.notes.grue}
                                  onChange={(e) => handleUpdateGrade(student.id, 'grue', Number(e.target.value))}
                                  className={`w-12 text-center bg-black/5 dark:bg-black/40 border border-galf-border rounded p-1 font-mono text-galf-text ${student.notes.grue < 10 ? 'text-red-500 border-red-500/30' : ''}`}
                                />
                              </td>
                              
                              {/* Safety grade */}
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  value={student.notes.safety}
                                  onChange={(e) => handleUpdateGrade(student.id, 'safety', Number(e.target.value))}
                                  className={`w-12 text-center bg-black/5 dark:bg-black/40 border border-galf-border rounded p-1 font-mono text-galf-text ${student.notes.safety < 10 ? 'text-red-500 border-red-500/30' : ''}`}
                                />
                              </td>
                              
                              {/* Average math */}
                              <td className={`py-4 text-center font-black font-mono ${average < 12 ? 'text-red-400' : 'text-galf-yellow'}`}>
                                {average.toFixed(1)}
                              </td>

                              {/* ═══════════════════════════════════════════════
                                  FEATURE 2: EXPORTER BULLETIN (PDF GENERATOR)
                                 ═══════════════════════════════════════════════ */}
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => {
                                    setActiveReportStudentId(student.id)
                                    triggerSound(600, 'sine', 0.1)
                                  }}
                                  className="p-1.5 rounded-lg border border-galf-border bg-black/5 dark:bg-white/5 hover:border-galf-yellow hover:bg-galf-yellow/10 text-galf-text hover:text-galf-yellow transition-all flex items-center gap-1.5 ml-auto text-[10px] font-black uppercase tracking-wider cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Relevé
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FadeIn>
 
              {/* Sidebar Drawers for Features 3 & 4 */}
              <div className="space-y-8">
                
                {/* Feature 4: SMS Alert & Congrats Console (SMS Majors integrated) */}
                <FadeIn>
                  <div className="glass-card border-galf-border rounded-2xl p-6">
                    {/* SMS Tabs */}
                    <div className="flex bg-black/5 dark:bg-black/40 border border-galf-border p-1 rounded-xl mb-4">
                      <button
                        onClick={() => {
                          setSelectedSmsTab('alert')
                          setSmsMessage("")
                          triggerSound(400, 'sine', 0.05)
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedSmsTab === 'alert' ? 'bg-galf-yellow text-galf-carbon' : 'text-galf-text-secondary hover:text-galf-text'
                        }`}
                      >
                        Alerte Chantier
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSmsTab('congrats')
                          handleLoadCongratsMsg()
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedSmsTab === 'congrats' ? 'bg-galf-yellow text-galf-carbon' : 'text-galf-text-secondary hover:text-galf-text'
                        }`}
                      >
                        🏆 SMS Félicitations
                      </button>
                    </div>

                    <h3 className="font-black text-galf-text mb-1 uppercase tracking-wider text-xs flex items-center gap-2">
                      <Bell className="w-4 h-4 text-galf-yellow" />
                      {selectedSmsTab === 'alert' ? "SMS Consignes" : "Félicitations aux Majors"}
                    </h3>
                    <p className="text-[9px] text-galf-text-secondary mb-3">
                      {selectedSmsTab === 'alert' 
                        ? "Diffuser une alerte météo ou consigne urgente."
                        : "Générer et envoyer un SMS d'honneur aux élèves ayant >= 15/20."}
                    </p>
                    
                    <textarea
                      rows={3}
                      placeholder={selectedSmsTab === 'alert' ? "Saisissez votre consigne..." : "Cliquez sur générer..."}
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow font-sans mb-3 resize-none"
                    />

                    {selectedSmsTab === 'congrats' && (
                      <button
                        type="button"
                        onClick={handleLoadCongratsMsg}
                        className="w-full mb-2 bg-black/5 dark:bg-white/5 border border-galf-border text-galf-text-secondary hover:text-galf-text py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all"
                      >
                        Actualiser les majors
                      </button>
                    )}
                    
                    <button
                      onClick={handleBroadcastSMS}
                      disabled={!smsMessage.trim() || smsStatus !== "" || smsMessage.includes("Aucun élève")}
                      className="w-full bg-galf-yellow text-galf-carbon py-2.5 rounded-lg text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" /> Diffuser la consigne
                    </button>
                    
                    {smsStatus && (
                      <div className="mt-3 bg-galf-yellow/10 border border-galf-yellow/30 p-2.5 rounded-lg text-[10px] text-galf-yellow font-bold uppercase tracking-wider animate-pulse">
                        {smsStatus}
                      </div>
                    )}
                  </div>
                </FadeIn>
 
                {/* Feature 3: Schedule Exam Slots */}
                <FadeIn>
                  <div className="glass-card border-galf-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-white uppercase tracking-wider text-sm flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-galf-yellow" /> Planning d'examens
                      </h3>
                      <button
                        onClick={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
                        className="bg-galf-yellow text-galf-carbon p-1.5 rounded-md hover:brightness-110 transition-all"
                        title="Planifier un créneau"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
 
                    {/* Scheduled list */}
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                      {exams.length === 0 ? (
                        <div className="text-[10px] text-galf-text-secondary text-center py-4">Aucun examen planifié.</div>
                      ) : (
                        exams.map((ex) => (
                          <div key={ex.id} className="p-3 bg-black/5 dark:bg-black/25 border border-galf-border rounded-lg flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[11px] font-black text-galf-text truncate">{ex.studentName}</div>
                              <div className="text-[9px] text-galf-yellow uppercase font-bold tracking-wider">{ex.machine}</div>
                              <div className="text-[9px] text-galf-text-secondary flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-galf-yellow" /> {ex.date} à {ex.time}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteExam(ex.id)}
                              className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </FadeIn>

                {/* ═══════════════════════════════════════════════
                    FEATURE 3: PLANIFICATEUR DE REMPLACEMENT PEDAGOGIQUE
                   ═══════════════════════════════════════════════ */}
                <FadeIn>
                  <div className="glass-card border-galf-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-galf-yellow" /> Remplacements Pédagogiques
                      </h3>
                      <button
                        onClick={() => {
                          setIsSubDrawerOpen(true)
                          triggerSound(450, 'sine', 0.05)
                        }}
                        className="bg-galf-yellow text-galf-carbon p-1.5 rounded-md hover:brightness-110 transition-all cursor-pointer"
                        title="Affecter un remplaçant"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                      {assignedSubs.length === 0 ? (
                        <div className="text-[10px] text-galf-text-muted text-center py-4 italic">
                          Aucun remplacement de secours actif.
                        </div>
                      ) : (
                        assignedSubs.map((sub, idx) => (
                          <div key={idx} className="p-3 bg-black/5 dark:bg-black/25 border border-galf-border rounded-lg flex items-center justify-between gap-2 text-xs">
                            <div>
                              <div className="font-black text-galf-text">{sub.teacher}</div>
                              <div className="text-[9px] text-galf-yellow uppercase font-semibold">{sub.machine}</div>
                              <div className="text-[9px] text-galf-text-secondary mt-0.5">{sub.date}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteSub(idx)}
                              className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </FadeIn>

              </div>
            </div>
          </div>
       </main>
 
      {/* Exam Planner Drawer Panel */}
      {isAlertDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-galf-surface h-full border-l border-galf-border p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-galf-text uppercase tracking-wider">Planifier un examen</h3>
                <button
                  onClick={() => setIsAlertDrawerOpen(false)}
                  className="hover:scale-110 transition-transform p-1.5 rounded-lg border border-galf-border cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
 
              <form onSubmit={handleAddExam} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Élève à évaluer</label>
                  <select
                    value={examStudentId}
                    onChange={(e) => setExamStudentId(Number(e.target.value))}
                    className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id} className="bg-galf-surface text-galf-text">{s.name}</option>
                    ))}
                  </select>
                </div>
 
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Engin d'examen</label>
                  <select
                    value={examMachine}
                    onChange={(e) => setExamMachine(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow"
                  >
                    <option value="Pelle Hydraulique" className="bg-galf-surface text-galf-text">Pelle Hydraulique</option>
                    <option value="Grue à Tour" className="bg-galf-surface text-galf-text">Grue à Tour</option>
                    <option value="Bulldozer D6" className="bg-galf-surface text-galf-text">Bulldozer D6</option>
                    <option value="Chariot Élévateur" className="bg-galf-surface text-galf-text">Chariot Élévateur</option>
                  </select>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Date</label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Heure</label>
                    <input
                      type="time"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                      className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow font-mono"
                    />
                  </div>
                </div>
 
                <button
                  type="submit"
                  className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg mt-6 cursor-pointer"
                >
                  Valider le créneau d'évaluation
                </button>
              </form>
            </div>
            
            <div className="text-[10px] text-galf-text-secondary text-center leading-relaxed">
              En planifiant cet examen, l'apprenant concerné recevra instantanément une notification par SMS sur son mobile enregistré.
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          FEATURE 3: DRAWER PLANIFICATEUR DE REMPLACEMENT
         ═══════════════════════════════════════════════ */}
      {isSubDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-galf-surface h-full border-l border-galf-border p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-galf-yellow" />
                  <h3 className="text-xl font-black text-galf-text uppercase tracking-wider">Trouver un Remplaçant</h3>
                </div>
                <button
                  onClick={() => setIsSubDrawerOpen(false)}
                  className="hover:scale-110 transition-transform p-1.5 rounded-lg border border-galf-border cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-wider">Date de l'absence</label>
                  <input
                    type="date"
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-wider">Machine concernée</label>
                  <select
                    value={subMachine}
                    onChange={(e) => setSubMachine(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-galf-text outline-none focus:border-galf-yellow"
                  >
                    <option value="Pelle Hydraulique" className="bg-galf-surface text-galf-text">Pelle Hydraulique</option>
                    <option value="Grue à Tour" className="bg-galf-surface text-galf-text">Grue à Tour</option>
                    <option value="Bulldozer D6" className="bg-galf-surface text-galf-text">Bulldozer D6</option>
                    <option value="Chariot Élévateur" className="bg-galf-surface text-galf-text">Chariot Élévateur</option>
                  </select>
                </div>

                {/* Match substitute results list */}
                <div className="pt-4 space-y-3">
                  <span className="text-[10px] font-black uppercase text-galf-text-secondary tracking-wider block">Instructeurs qualifiés :</span>
                  
                  {SUBSTITUTES_DB.map((sub, idx) => {
                    const isQualified = sub.machines.includes(subMachine)
                    const isAvailable = sub.status === "Disponible"
                    
                    return (
                      <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        isQualified && isAvailable
                          ? 'bg-black/30 border-white/10 hover:border-galf-yellow/50'
                          : 'bg-black/60 border-white/5 opacity-40'
                      }`}>
                        <div>
                          <div className="text-xs font-black text-galf-text">{sub.name}</div>
                          <div className="text-[9px] text-galf-text-secondary mt-1 flex flex-wrap gap-1">
                            {sub.machines.map((m, mIdx) => (
                              <span key={mIdx} className="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded border border-galf-border">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-black uppercase tracking-wider block mb-2 ${
                            isAvailable ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {sub.status}
                          </span>
                          
                          {isQualified && isAvailable && (
                            <button
                              type="button"
                              onClick={() => handleAssignSubstitute(sub.name)}
                              className="px-3 py-1.5 bg-galf-yellow text-galf-carbon text-[9px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all cursor-pointer"
                            >
                              Assigner
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="text-[9px] text-galf-text-muted text-center mt-6">
              * Les affectations de remplacement mettent à jour automatiquement l'agenda de la cohorte et alertent l'instructeur remplaçant.
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          FEATURE 2: SIMULATED PRINT / PDF REPORT CARD OVERLAY
         ═══════════════════════════════════════════════ */}
      {activeReportStudentId !== null && activeReportStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-[2rem] p-8 shadow-2xl relative border-4 border-double border-slate-300">
            {/* Header document */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">GALF FORMATION D'ÉLITE</h2>
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mt-0.5">MINISTÈRE DE L'ENSEIGNEMENT TECHNIQUE - CÔTE D'IVOIRE</span>
                <span className="text-[9px] text-slate-500 block">Plateau technique principal Abidjan</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase tracking-wider text-galf-yellow bg-slate-900 px-3 py-1 rounded">RELEVÉ DE NOTES</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">Date: {new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Candidate info */}
            <div className="grid grid-cols-2 gap-6 bg-slate-100 p-4 rounded-xl mb-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Apprenant :</span>
                <span className="text-sm font-black text-slate-950">{activeReportStudent.name}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">N° d'enregistrement :</span>
                <span className="text-sm font-mono font-bold text-slate-950">GALF-2026-00{activeReportStudent.id}</span>
              </div>
            </div>

            {/* Practical Notes Table */}
            <div className="space-y-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Détails des Évaluations Pratiques :</span>
              
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-400 font-bold uppercase">
                    <th className="py-2">Compétence Évaluée</th>
                    <th className="py-2 text-center">Barème</th>
                    <th className="py-2 text-right">Note Obtenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 font-semibold text-slate-950">Conduite de Pelle Hydraulique</td>
                    <td className="py-3 text-center text-slate-500">/20</td>
                    <td className="py-3 text-right font-black text-slate-950">{activeReportStudent.notes.pelle}/20</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-950">Manœuvres de Grue à Tour</td>
                    <td className="py-3 text-center text-slate-500">/20</td>
                    <td className="py-3 text-right font-black text-slate-950">{activeReportStudent.notes.grue}/20</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-950">Protocoles de Sécurité HSE Chantier</td>
                    <td className="py-3 text-center text-slate-500">/20</td>
                    <td className="py-3 text-right font-black text-slate-950">{activeReportStudent.notes.safety}/20</td>
                  </tr>
                  <tr className="bg-slate-50 font-black">
                    <td className="py-4 text-slate-950 uppercase">Moyenne Générale Pratique</td>
                    <td className="py-4 text-center text-slate-900">/20</td>
                    <td className="py-4 text-right text-slate-950 font-mono text-sm">
                      {((activeReportStudent.notes.pelle + activeReportStudent.notes.grue + activeReportStudent.notes.safety) / 3).toFixed(1)}/20
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Verdict and signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-950 mb-8">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Commentaire de l'instructeur :</span>
                <p className="text-[11px] text-slate-800 leading-relaxed italic mt-1">
                  {((activeReportStudent.notes.pelle + activeReportStudent.notes.grue + activeReportStudent.notes.safety) / 3) >= 12
                    ? "Excellent travail. Aptitudes à la manipulation validées avec succès. Prêt pour l'insertion sur chantier réel."
                    : "Résultats insuffisants sur certaines manœuvres. Des heures supplémentaires sur simulateur 3D sont recommandées."}
                </p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Visa de l'établissement :</span>
                {/* Mock signature stamp */}
                <div className="w-24 h-16 border-2 border-red-500/40 rounded-full flex flex-col items-center justify-center text-red-500/50 uppercase font-black font-serif text-[8px] transform -rotate-12 mt-2">
                  <span>AGRÉÉ PAR L'ÉTAT</span>
                  <span className="text-[6px] tracking-widest mt-1">GALF DE DIRECTION</span>
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  triggerSound(600, 'sine', 0.05)
                  window.print()
                }}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Lancer l'impression
              </button>

              <button
                onClick={() => {
                  triggerSound(350, 'sine', 0.05)
                  setActiveReportStudentId(null)
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-300 transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
