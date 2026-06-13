"use client"
import { useState, useEffect } from 'react'
import { FadeIn, TextReveal } from '@/components/animations/FadeIn'
import { Users, Video, Calendar, Upload, Settings, Check, X, Clock, AlertTriangle, Send, Bell, Plus, Trash2, Award } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

// Initial student database
const INITIAL_STUDENTS = [
  { id: 1, name: "Jean Kouadio", presence: "present", notes: { pelle: 14, grue: 12, safety: 16 } },
  { id: 2, name: "Marc Koffi", presence: "present", notes: { pelle: 16, grue: 15, safety: 18 } },
  { id: 3, name: "Aya Konan", presence: "late", notes: { pelle: 11, grue: 10, safety: 12 } },
  { id: 4, name: "Fatou Sylla", presence: "absent", notes: { pelle: 9, grue: 8, safety: 14 } },
  { id: 5, name: "Bakary Touré", presence: "present", notes: { pelle: 15, grue: 17, safety: 19 } }
]

export default function InstructeurDashboard() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false)
  const [smsMessage, setSmsMessage] = useState("")
  const [smsStatus, setSmsStatus] = useState("")
  const [examStudentId, setExamStudentId] = useState(1)
  const [examDate, setExamDate] = useState("2026-06-18")
  const [examTime, setExamTime] = useState("09:00")
  const [examMachine, setExamMachine] = useState("Pelle Hydraulique")
  const [exams, setExams] = useState<any[]>([])

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
  }, [])

  // Helper to save students
  const saveStudentsToLocal = (updatedList: typeof students) => {
    setStudents(updatedList)
    localStorage.setItem('galf_instructor_students', JSON.stringify(updatedList))
  }

  // Feature 1: Toggle presence
  const handleTogglePresence = (studentId: number, status: 'present' | 'absent' | 'late') => {
    const updated = students.map(s => s.id === studentId ? { ...s, presence: status } : s)
    saveStudentsToLocal(updated)
  }

  // Feature 2: Edit grades
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

  // Feature 3: Schedule exams
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
  }

  const handleDeleteExam = (id: number) => {
    const updated = exams.filter(ex => ex.id !== id)
    setExams(updated)
    localStorage.setItem('galf_instructor_exams', JSON.stringify(updated))
    triggerSound(330, 'sawtooth', 0.1)
  }

  // Feature 4: Alert SMS broadcast
  const handleBroadcastSMS = () => {
    if (!smsMessage.trim()) return
    setSmsStatus("Envoi en cours...")
    
    // Play alert sound
    triggerSound(520, 'triangle', 0.2)
    setTimeout(() => {
      triggerSound(780, 'sine', 0.25)
    }, 150)

    setTimeout(() => {
      setSmsStatus("Succès : Alerte SMS envoyée aux 48 élèves de la cohorte !")
      setSmsMessage("")
      setTimeout(() => setSmsStatus(""), 4000)
    }, 1500)
  }

  // Synth helper using Web Audio API
  const triggerSound = (freq: number, type: OscillatorType, duration: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (err) {}
  }

  // Calculations for Feature 5 (Radar chart coordinates)
  // Calculate average notes
  const avgPelle = students.reduce((acc, s) => acc + s.notes.pelle, 0) / students.length
  const avgGrue = students.reduce((acc, s) => acc + s.notes.grue, 0) / students.length
  const avgSafety = students.reduce((acc, s) => acc + s.notes.safety, 0) / students.length
  
  // Simulated stats for Radar Chart
  const radarAxes = [
    { label: "Précision Pelle", score: avgPelle * 5 }, // scale to 100
    { label: "Manœuvre Grue", score: avgGrue * 5 },
    { label: "Règlement Sécurité", score: avgSafety * 5 },
    { label: "Maintenance", score: 80 }, // constant default
    { label: "Eco-conduite", score: 70 }  // constant default
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

  return (
    <div className="flex bg-galf-carbon min-h-screen">
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
         {/* Background decoration */}
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
               <div className="glass-card border-galf-border rounded-2xl p-6 h-full">
                 <h3 className="font-black text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                   <Users className="w-5 h-5 text-galf-yellow" /> Feuille d'émargement dynamique (Cohorte Mars)
                 </h3>
                 
                 <div className="space-y-4">
                   {students.map((student) => (
                     <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/20 rounded-xl border border-galf-border gap-4">
                       <div>
                         <div className="text-sm font-black text-white mb-1">{student.name}</div>
                         <div className="text-[10px] text-galf-text-secondary uppercase font-bold">Inscrit : Pelle + Grue</div>
                       </div>
                       
                       {/* Segmented control for presence */}
                       <div className="flex gap-1.5 bg-black/40 p-1.5 rounded-lg border border-white/5">
                         {[
                           { status: 'present', label: 'Présent', color: 'bg-green-500 text-white' },
                           { status: 'late', label: 'En Retard', color: 'bg-yellow-500 text-black' },
                           { status: 'absent', label: 'Absent', color: 'bg-red-500 text-white' }
                         ].map((btn) => (
                           <button
                             key={btn.status}
                             onClick={() => handleTogglePresence(student.id, btn.status as any)}
                             className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-wider transition-all ${
                               student.presence === btn.status 
                                 ? btn.color 
                                 : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                         stroke="rgba(255,255,255,0.05)"
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
                       const radius = (axis.score / 100) * 80
                       const x = 100 + radius * Math.cos(angle)
                       const y = 100 + radius * Math.sin(angle)
                       const labelX = 100 + 95 * Math.cos(angle)
                       const labelY = 100 + 95 * Math.sin(angle)
                       
                       return (
                         <g key={i}>
                           {/* Axis line */}
                           <line x1="100" y1="100" x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
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
                 <h3 className="font-black text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                   <Settings className="w-5 h-5 text-galf-yellow" /> Carnet de notes pratique interactif
                 </h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-xs border-collapse">
                     <thead>
                       <tr className="border-b border-galf-border text-galf-text-secondary font-black uppercase tracking-widest">
                         <th className="py-4">Étudiant</th>
                         <th className="py-4 px-2 text-center">Pelle /20</th>
                         <th className="py-4 px-2 text-center">Grue /20</th>
                         <th className="py-4 px-2 text-center">HSE /20</th>
                         <th className="py-4 text-center">Moyenne</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-galf-border">
                       {students.map((student) => {
                         const average = (student.notes.pelle + student.notes.grue + student.notes.safety) / 3
                         return (
                           <tr key={student.id} className="hover:bg-white/5 transition-colors">
                             <td className="py-4 font-black text-white">{student.name}</td>
                             
                             {/* Pelle grade */}
                             <td className="py-2 px-2 text-center">
                               <input
                                 type="number"
                                 value={student.notes.pelle}
                                 onChange={(e) => handleUpdateGrade(student.id, 'pelle', Number(e.target.value))}
                                 className={`w-12 text-center bg-black/40 border border-white/10 rounded p-1 font-mono text-white ${student.notes.pelle < 10 ? 'text-red-500 border-red-500/30' : ''}`}
                               />
                             </td>
                             
                             {/* Grue grade */}
                             <td className="py-2 px-2 text-center">
                               <input
                                 type="number"
                                 value={student.notes.grue}
                                 onChange={(e) => handleUpdateGrade(student.id, 'grue', Number(e.target.value))}
                                 className={`w-12 text-center bg-black/40 border border-white/10 rounded p-1 font-mono text-white ${student.notes.grue < 10 ? 'text-red-500 border-red-500/30' : ''}`}
                               />
                             </td>
                             
                             {/* Safety grade */}
                             <td className="py-2 px-2 text-center">
                               <input
                                 type="number"
                                 value={student.notes.safety}
                                 onChange={(e) => handleUpdateGrade(student.id, 'safety', Number(e.target.value))}
                                 className={`w-12 text-center bg-black/40 border border-white/10 rounded p-1 font-mono text-white ${student.notes.safety < 10 ? 'text-red-500 border-red-500/30' : ''}`}
                               />
                             </td>
                             
                             {/* Average math */}
                             <td className={`py-4 text-center font-black font-mono ${average < 12 ? 'text-red-400' : 'text-galf-yellow'}`}>
                               {average.toFixed(1)}
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
               {/* Feature 4: Live Class Alert Broadcast */}
               <FadeIn>
                 <div className="glass-card border-galf-border rounded-2xl p-6">
                   <h3 className="font-black text-white mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                     <Bell className="w-5 h-5 text-galf-yellow" /> Alerte SMS Cohorte
                   </h3>
                   <p className="text-[10px] text-galf-text-secondary leading-relaxed mb-4">
                     Diffuser instantanément un SMS à tous les apprenants d'Abidjan et San Pedro.
                   </p>
                   
                   <textarea
                     rows={3}
                     placeholder="Ex: Pluie diluvienne sur Abidjan. Les cours pratiques de Pelle prévus ce matin sont décalés à 13h30. Soyez prudents."
                     value={smsMessage}
                     onChange={(e) => setSmsMessage(e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow font-sans mb-3 resize-none"
                   />
                   
                   <button
                     onClick={handleBroadcastSMS}
                     disabled={!smsMessage.trim() || smsStatus !== ""}
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
                   <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                     {exams.length === 0 ? (
                       <div className="text-[10px] text-galf-text-secondary text-center py-4">Aucun examen planifié.</div>
                     ) : (
                       exams.map((ex) => (
                         <div key={ex.id} className="p-3 bg-black/25 border border-galf-border rounded-lg flex items-center justify-between gap-2">
                           <div className="min-w-0">
                             <div className="text-[11px] font-black text-white truncate">{ex.studentName}</div>
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
             </div>
           </div>
         </div>
      </main>

      {/* Feature 3: Exam Planner Drawer Panel */}
      {isAlertDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-galf-surface h-full border-l border-galf-border p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-wider">Planifier un examen</h3>
                <button
                  onClick={() => setIsAlertDrawerOpen(false)}
                  className="hover:scale-110 transition-transform p-1.5 rounded-lg border border-galf-border"
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
                    className="w-full bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id} className="bg-galf-surface text-white">{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Engin d'examen</label>
                  <select
                    value={examMachine}
                    onChange={(e) => setExamMachine(e.target.value)}
                    className="w-full bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow"
                  >
                    <option value="Pelle Hydraulique" className="bg-galf-surface text-white">Pelle Hydraulique</option>
                    <option value="Grue à Tour" className="bg-galf-surface text-white">Grue à Tour</option>
                    <option value="Bulldozer D6" className="bg-galf-surface text-white">Bulldozer D6</option>
                    <option value="Chariot Élévateur" className="bg-galf-surface text-white">Chariot Élévateur</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Date</label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-galf-text-secondary tracking-widest">Heure</label>
                    <input
                      type="time"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                      className="w-full bg-black/30 border border-galf-border rounded-xl p-3 text-xs text-white outline-none focus:border-galf-yellow font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg mt-6"
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
    </div>
  )
}
