"use client"
import { useState } from 'react'
import { Download, CheckCircle2, Loader2, FileText } from 'lucide-react'
import { GALF_FORMATIONS } from '@/lib/data'

export function FormulaireBrochure({ initialSlug = '' }: { initialSlug?: string }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    formation: initialSlug || (GALF_FORMATIONS[0]?.slug || '')
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email) return

    setLoading(true)
    // Simulate API download request
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      // Open brochure PDF sample in a new tab if desired, or simulate it
    }, 1500)
  }

  return (
    <section className="py-24 border-t border-slate-200 dark:border-white/5 relative overflow-hidden bg-slate-50/60 dark:bg-zinc-950/40">
      <div className="absolute inset-0 stitch-blueprint-grid opacity-[0.03] pointer-events-none" />
      <div className="container-galf max-w-4xl relative z-10">
        <div className="stitch-card p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 stitch-hud-corner shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-galf-yellow/5 rounded-bl-[12rem] pointer-events-none" />
          
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase bg-galf-yellow/10 text-galf-yellow border border-galf-yellow/20 tracking-wider">
              <FileText className="w-3.5 h-3.5 animate-pulse" /> Documentations
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
              Brochure <span className="text-galf-yellow">Complète</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
              Téléchargez notre brochure officielle contenant les fiches techniques détaillées de nos engins, le planning des prochaines sessions, le programme complet des cours théoriques/pratiques et le détail des modalités de paiement.
            </p>
          </div>

          <div className="w-full md:w-[400px] bg-slate-100/90 dark:bg-black/60 border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden stitch-hud-corner">
            {success ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Lien Prêt !</h4>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-sans">
                  Votre demande a été enregistrée. Cliquez ci-dessous pour télécharger votre brochure.
                </p>
                <a 
                  href="/documents/brochure_galf_formation.pdf" 
                  download
                  className="w-full bg-gradient-to-r from-galf-yellow to-orange-500 text-galf-carbon py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md shadow-galf-yellow/10"
                >
                  <Download className="w-4 h-4" /> Télécharger (PDF)
                </a>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white transition-colors uppercase tracking-widest block mx-auto pt-2"
                >
                  Faire une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block">Nom &amp; Prénom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé Konan"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-galf-yellow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block">Téléphone</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 07 08 09 10"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-galf-yellow"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block">E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: mail@domain.com"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-galf-yellow"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block">Formation ciblée</label>
                  <select
                    value={form.formation}
                    onChange={(e) => setForm(prev => ({ ...prev, formation: e.target.value }))}
                    className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-galf-yellow cursor-pointer"
                    style={{ colorScheme: 'light dark' }}
                  >
                    {GALF_FORMATIONS.map(f => (
                      <option key={f.slug} value={f.slug}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-galf-yellow text-galf-carbon py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Recevoir la brochure
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
