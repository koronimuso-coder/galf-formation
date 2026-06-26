"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, Search, ArrowRight, ShieldCheck, MapPin, RefreshCw } from 'lucide-react'


function VerificationContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('id') || ''
  
  const [searchId, setSearchId] = useState(initialId)
  const [isSearching, setIsSearching] = useState(false)
  const [verifyResult, setVerifyResult] = useState<any | null>(null)
  const [scanned, setScanned] = useState(false)

  const handleVerify = (idToVerify: string) => {
    if (!idToVerify.trim()) return
    setIsSearching(true)
    setVerifyResult(null)
    setScanned(false)

    setTimeout(() => {
      const code = idToVerify.trim().toUpperCase()
      if (code === 'GALF-2024-XP-03') {
        setVerifyResult({
          status: 'AUTHENTIQUE',
          id: 'GALF-2024-XP-03',
          name: "JEAN KOUADIO",
          course: "Pelle Hydraulique sur chenilles",
          date: "11 Avril 2024",
          score: "18.5/20",
          validity: "À vie (Recyclage conseillé tous les 5 ans)",
          authority: "Comité Pédagogique GALF Côte d'Ivoire",
          location: "Yopougon Chantier-École, Abidjan"
        })
      } else if (code === 'GALF-PELLE-2026') {
        setVerifyResult({
          status: 'AUTHENTIQUE',
          id: 'GALF-PELLE-2026',
          name: "YAO N'GUESSAN",
          course: "Pelle Hydraulique",
          date: "12 Avril 2026",
          score: "18.5/20",
          validity: "À vie (Recyclage conseillé tous les 5 ans)",
          authority: "Comité Pédagogique GALF Côte d'Ivoire",
          location: "Yopougon Chantier-École, Abidjan"
        })
      } else if (code === 'GALF-GRUE-2026') {
        setVerifyResult({
          status: 'AUTHENTIQUE',
          id: 'GALF-GRUE-2026',
          name: "MARC KOFFI",
          course: "Grue à Tour",
          date: "10 Avril 2026",
          score: "17.0/20",
          validity: "À vie (Recyclage conseillé tous les 5 ans)",
          authority: "Comité Pédagogique GALF Côte d'Ivoire",
          location: "Yopougon Chantier-École, Abidjan"
        })
      } else {
        setVerifyResult({
          status: 'INTROUVABLE',
          id: code
        })
      }
      setIsSearching(false)
      setScanned(true)
    }, 1200)
  }

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId)
    }
  }, [initialId])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="glass-card p-6 rounded-3xl border-white/5 bg-black/30">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleVerify(searchId)
          }} 
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Identifiant du diplôme (Ex: GALF-2024-XP-03)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-galf-bg border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-galf-yellow outline-none transition-all uppercase font-mono"
            />
            <Search className="absolute left-4 top-4.5 w-5 h-5 text-white/30" />
          </div>
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-galf-yellow text-galf-carbon px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-galf-yellow/10"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Vérifier"}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {isSearching && (
        <div className="glass-card p-12 rounded-3xl border-white/5 text-center space-y-4">
          <div className="relative w-40 h-40 mx-auto border-2 border-dashed border-galf-yellow/20 rounded-2xl flex items-center justify-center bg-black/30 overflow-hidden">
            <div className="absolute left-0 w-full h-1 bg-galf-yellow animate-scan" style={{ animation: 'scan 2s linear infinite' }} />
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-xs text-white/50 uppercase tracking-widest font-black">Interrogation du registre sécurisé GALF...</p>
        </div>
      )}

      {scanned && verifyResult && (
        <div className="animate-fadeIn">
          {verifyResult.status === 'AUTHENTIQUE' ? (
            <div className="glass-card p-8 rounded-[2.5rem] border-green-500/20 bg-green-500/5 relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[5rem]" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      Diplôme Authentifié
                    </span>
                    <h3 className="text-xl font-black text-white mt-1.5 font-mono">{verifyResult.id}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/40 block font-mono">Délivré le</span>
                  <span className="text-sm font-bold text-white font-mono">{verifyResult.date}</span>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid sm:grid-cols-2 gap-6 text-xs text-white/80">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Titulaire</span>
                  <p className="text-sm font-black text-white">{verifyResult.name}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Formation</span>
                  <p className="text-sm font-black text-white">{verifyResult.course}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Moyenne Examen</span>
                  <p className="text-sm font-mono font-bold text-galf-yellow">{verifyResult.score}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Validité administrative</span>
                  <p className="text-sm font-bold text-white">{verifyResult.validity}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Centre d'évaluation</span>
                  <p className="text-sm font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-galf-yellow" /> {verifyResult.location}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Autorité de délivrance</span>
                  <p className="text-sm font-bold text-white">{verifyResult.authority}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] text-white/40 font-mono">
                  Document vérifié numériquement conforme à la réglementation R482/R483.
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-[2.5rem] border-red-500/20 bg-red-500/5 relative overflow-hidden flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 inline-block mb-1.5">
                  Diplôme Introuvable
                </span>
                <h4 className="text-sm font-black text-white">Aucun enregistrement pour : "{verifyResult.id}"</h4>
                <p className="text-xs text-white/50 leading-relaxed font-sans pt-1">
                  Nous n'avons trouvé aucun certificat de réussite correspondant à cet identifiant dans notre base de données sécurisée. Veuillez vérifier la saisie ou contacter notre secrétariat.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CertificateVerificationPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 text-left" style={{ background: 'var(--galf-bg)' }}>
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      <div className="container-galf max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-galf-yellow bg-galf-yellow/10 px-3 py-1 rounded-full border border-galf-yellow/20">
            REGISTRE DES DIPLÔMES GALF
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Vérification de <span className="text-galf-yellow">Certificat</span>
          </h1>
          <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
            Service public d'authentification des diplômes d'opérateurs d'engins lourds délivrés par GALF Formation Côte d'Ivoire.
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center p-12 text-white/50">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-galf-yellow" />
            <p className="text-xs uppercase tracking-widest font-black">Chargement du validateur...</p>
          </div>
        }>
          <VerificationContent />
        </Suspense>

        <div className="text-center mt-12">
          <Link href="/" className="text-xs font-black uppercase tracking-wider text-galf-yellow hover:text-white transition-colors flex items-center justify-center gap-1">
            Retourner au site principal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
