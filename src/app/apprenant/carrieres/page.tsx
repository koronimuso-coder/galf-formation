"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { Briefcase, MapPin, Building2, TrendingUp, Search, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function CareerHub() {
  const [searchTerm, setSearchTerm] = useState('')

  const allJobs = [
    { title: "Opérateur Pelle Hydraulique Expérimenté", company: "SMB SA", location: "San Pedro, CI", type: "CDI", salary: "450k - 600k CFA", desc: "Besoin de 5 opérateurs certifiés GALF pour projet d'extension portuaire.", tags: ["Pelle", "Terrassement", "Urgent"] },
    { title: "Grutier à Tour (GME)", company: "BTP-CI", location: "Abidjan, Cocody", type: "CDD (12 mois)", salary: "500k CFA", desc: "Chantier de tour résidentielle VIP. Expertise en levage aveugle requise.", tags: ["Levage", "Précision"] },
    { title: "Conducteur de Bulldozer", company: "Mine-Ivoire", location: "Korhogo (Site Minier)", type: "CDI", salary: "750k CFA + Logement", desc: "Extraction de masse. Rotation 3x8. Certificat GALF obligatoire.", tags: ["Mine", "Lourd", "Premium"] },
    { title: "Superviseur Manutention", company: "GESTOCI", location: "Vridi, Abidjan", type: "CDI", salary: "Relié expérience", desc: "Gestion des flux logistiques pétroliers. Formation CACES/GALF.", tags: ["Logistique", "Sécurité"] },
  ]
  const jobs = allJobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase()) || job.desc.toLowerCase().includes(searchTerm.toLowerCase()))


  return (
    <div className="min-h-screen pt-28 pb-24" style={{ background: 'var(--galf-bg)' }}>
      <div className="container-galf">
        <FadeIn>
          <div className="max-w-4xl mb-16">
            <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Service Exclusif GALF</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8" style={{ color: 'var(--galf-text)' }}>
              Propulsez votre <span className="text-galf-yellow">carrière</span>
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
              Accédez au réseau d'emploi n°1 du BTP et des Mines en Afrique de l'Ouest. Des offres exclusives réservées aux diplômés GALF Formation.
            </p>
          </div>
        </FadeIn>

        {/* Career Stats & Trust */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
           <FadeIn delay={0.1} className="glass-card p-8 rounded-2xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-galf-yellow/10 flex items-center justify-center">
                 <Building2 className="w-8 h-8 text-galf-yellow" />
              </div>
              <div>
                 <div className="text-3xl font-black" style={{ color: 'var(--galf-text)' }}>50+</div>
                 <div className="text-xs font-bold uppercase tracking-widest text-galf-text-muted">Partenaires Recruteurs</div>
              </div>
           </FadeIn>
           <FadeIn delay={0.2} className="glass-card p-8 rounded-2xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-galf-yellow/10 flex items-center justify-center">
                 <TrendingUp className="w-8 h-8 text-galf-yellow" />
              </div>
              <div>
                 <div className="text-3xl font-black" style={{ color: 'var(--galf-text)' }}>85%</div>
                 <div className="text-xs font-bold uppercase tracking-widest text-galf-text-muted">Placement à 3 mois</div>
              </div>
           </FadeIn>
           <FadeIn delay={0.3} className="glass-card p-8 rounded-2xl flex items-center gap-6 border-galf-yellow/30 bg-galf-yellow/5">
              <div className="w-16 h-16 rounded-full bg-galf-yellow flex items-center justify-center">
                 <ShieldCheck className="w-8 h-8 text-galf-carbon" />
              </div>
              <div>
                 <div className="text-xl font-black text-galf-yellow">Premium Search</div>
                 <div className="text-xs font-bold uppercase tracking-widest text-galf-text-muted">Accès illimité</div>
              </div>
           </FadeIn>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-galf-text-muted" />
              <input 
                 type="text" 
                 placeholder="Quel métier recherchez-vous ?" 
                 className="w-full pl-12 pr-6 py-4 rounded-xl bg-galf-surface border border-galf-border outline-none focus:border-galf-yellow transition-all"
                 style={{ color: 'var(--galf-text)' }}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="px-8 py-4 rounded-xl glass-card flex items-center gap-3 font-bold text-white hover:border-galf-yellow/30">
              <Filter className="w-5 h-5" /> Filtres avancés
           </button>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
           {jobs.map((job, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                 <div className="glass-card p-8 rounded-3xl group hover:border-galf-yellow/40 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[100px] flex items-start justify-end p-6 group-hover:bg-galf-yellow/10 transition-colors">
                       <Briefcase className="w-6 h-6 text-galf-yellow" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-2xl font-black group-hover:text-galf-yellow transition-colors" style={{ color: 'var(--galf-text)' }}>{job.title}</h3>
                             <span className="px-3 py-1 rounded-full bg-galf-yellow/10 border border-galf-yellow/30 text-galf-yellow text-[10px] font-black uppercase">{job.type}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-sm font-bold" style={{ color: 'var(--galf-text-muted)' }}>
                             <span className="flex items-center gap-2 text-galf-text"><Building2 className="w-4 h-4" /> {job.company}</span>
                             <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                             <span className="text-galf-yellow/80">{job.salary}</span>
                          </div>
                       </div>
                       <button className="bg-white text-galf-carbon px-10 py-4 rounded-xl font-black text-sm uppercase group-hover:bg-galf-yellow transition-all">
                          Postuler maintenant
                       </button>
                    </div>
                    
                    <p className="max-w-2xl mb-8 leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>
                       {job.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                       {job.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-lg bg-galf-border text-[10px] uppercase font-black tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>
                             {tag}
                          </span>
                       ))}
                       <div className="ml-auto flex items-center gap-2 text-[10px] font-black text-green-500 uppercase">
                          <CheckCircle2 className="w-4 h-4" /> Profil GALF Certifié Demandé
                       </div>
                    </div>
                 </div>
              </FadeIn>
           ))}
        </div>
      </div>
    </div>
  )
}
