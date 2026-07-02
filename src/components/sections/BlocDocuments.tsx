"use client"
import { useState } from 'react'
import { FileCheck } from 'lucide-react'

export function BlocDocuments() {
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({
    cni: false,
    photos: false,
    medical: false,
    formulaire: false
  })

  const documents = [
    {
      key: "cni",
      title: "Pièce d'Identité Officielle",
      desc: "Copie recto-verso de la CNI, de l'Attestation d'Identité ou du Passeport en cours de validité."
    },
    {
      key: "photos",
      title: "2 Photos d'Identité Couleur",
      desc: "Photos récentes sur fond blanc, format d'identité standard pour votre livret de formation."
    },
    {
      key: "medical",
      title: "Certificat Médical d'Aptitude",
      desc: "Certificat d'aptitude physique et visuelle pour la conduite d'engins lourds (peut être passé dans nos centres)."
    },
    {
      key: "formulaire",
      title: "Formulaire d'Inscription GALF",
      desc: "Formulaire officiel d'inscription à remplir et signer sur place au secrétariat ou en ligne."
    }
  ]

  const handleToggle = (key: string) => {
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const allReady = Object.values(checkedDocs).every(v => v === true)

  return (
    <div className="stitch-card p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden bg-zinc-950/40 stitch-hud-corner shadow-2xl">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-galf-yellow/5 rounded-bl-[6rem] pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[9px] font-black uppercase text-galf-yellow tracking-widest block mb-1">Dossier Administratif</span>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Pièces à fournir</h3>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mt-1">
            Préparez votre dossier d'inscription. Cochez les cases ci-dessous au fur et à mesure pour vérifier qu'il est complet.
          </p>
        </div>

        <div className="space-y-3 font-sans text-xs">
          {documents.map((doc) => {
            const isChecked = checkedDocs[doc.key]
            return (
              <label 
                key={doc.key}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer hover:bg-black/40 transition-all select-none ${
                  isChecked ? 'border-galf-yellow/40 bg-black/30 text-white' : 'border-white/5 bg-black/10 text-zinc-400'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(doc.key)}
                  className="rounded border-white/10 bg-black/40 text-galf-yellow w-4 h-4 focus:ring-0 mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="font-bold block text-xs uppercase tracking-wide leading-tight text-white">{doc.title}</span>
                  <span className="text-[10px] text-zinc-400 leading-relaxed block">{doc.desc}</span>
                </div>
              </label>
            )
          })}
        </div>

        {allReady ? (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-xs font-bold text-green-400 animate-fadeIn flex items-center justify-center gap-2">
            <FileCheck className="w-4 h-4 animate-bounce" /> Votre dossier est complet ! Prêt pour le secrétariat.
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-galf-yellow/5 border border-galf-yellow/10 text-center text-[10px] text-galf-yellow/80 font-bold uppercase tracking-wider">
            Veuillez rassembler toutes les pièces requises
          </div>
        )}
      </div>
    </div>
  )
}
