"use client"
import { useState } from 'react'
import { Building2, FileSpreadsheet, Users, Briefcase, Loader2, CheckCircle2 } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function BlocEntreprises() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    needs: 'formation_equipe'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName || !form.contactName || !form.phone || !form.email) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  const services = [
    {
      icon: Users,
      title: "Recyclage & VGP Équipes",
      desc: "Remise à niveau obligatoire de vos conducteurs d'engins, renouvellement de cartes CACES et audits HSE de prise de poste."
    },
    {
      icon: Briefcase,
      title: "Placement Direct",
      desc: "Accédez en priorité à notre annuaire d'opérateurs diplômés et certifiés (Pelle, Grue, Mine) prêts à être déployés."
    },
    {
      icon: FileSpreadsheet,
      title: "Ingénierie & Levage",
      desc: "Conception de plans de levage complexes pour grues à tour/mobiles et vérification périodique obligatoire (VGP) d'engins."
    }
  ]

  return (
    <section className="py-24 border-t border-zinc-200 dark:border-white/10 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/40">
      <div className="container-galf relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: corporate offers */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Espace Entreprises B2B
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-tight">
                Partenaire de votre <br />
                <span className="text-amber-500">productivité &amp; sécurité</span>
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                Nous accompagnons les majors du BTP, les compagnies minières, les ports et les industriels d'Afrique de l'Ouest dans le développement des compétences techniques et le renforcement des protocoles de sécurité de leurs conducteurs.
              </p>
            </div>

            <div className="space-y-6">
              {services.map((s, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">{s.title}</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0.5 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-5">
            <FadeIn className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
              {success ? (
                <div className="text-center py-10 space-y-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wide">Demande Envoyée !</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Notre équipe B2B analysera vos besoins et vous recontactera sous 24 heures ouvrées pour vous proposer un devis personnalisé.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-amber-400 text-zinc-950 text-[10px] font-extrabold uppercase px-6 py-2.5 rounded-xl hover:bg-amber-500 tracking-widest transition-colors"
                  >
                    Nouveau Devis
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-2">Demande de Devis Corporatif</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Nom de l'entreprise</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Eiffage CI, SMB..."
                      value={form.companyName}
                      onChange={(e) => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Nom du contact RH / Technique</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: M. Bamba Koffi"
                      value={form.contactName}
                      onChange={(e) => setForm(prev => ({ ...prev, contactName: e.target.value }))}
                      className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Téléphone</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +225 07..."
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Email Pro</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: rh@company.com"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Nature du besoin</label>
                    <select
                      value={form.needs}
                      onChange={(e) => setForm(prev => ({ ...prev, needs: e.target.value }))}
                      className="w-full input-adaptive rounded-xl p-3 text-xs outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="formation_equipe">Formation / Recyclage d'équipes</option>
                      <option value="recrutement">Recrutement d'opérateurs certifiés</option>
                      <option value="audit_securite">Audit Sécurité HSE / Plans de levage</option>
                      <option value="vgp">Contrôle technique VGP d'engins</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-zinc-950 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Traitement...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" /> Demander un devis B2B
                      </>
                    )}
                  </button>
                </form>
              )}
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  )
}
