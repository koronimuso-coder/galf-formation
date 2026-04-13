"use client"
import { FadeIn } from '@/components/animations/FadeIn'
import { MapPin, Phone, Mail, Send, Clock, MessageCircle } from 'lucide-react'
import { AnimatedMachineHeader } from '@/components/animations/AnimatedMachineHeader'

export default function Contact() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--galf-bg)' }}>
      {/* Background Machine SVG */}
      <div className="absolute right-[-10%] top-[10%] w-[600px] h-[600px] opacity-[0.05] pointer-events-none z-0">
        <AnimatedMachineHeader type="chargeuse" />
      </div>

      <div className="container-galf relative z-10">
        <FadeIn>
          <div className="text-xs text-galf-yellow font-bold uppercase tracking-[0.3em] mb-4">Restons en contact</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none" style={{ color: 'var(--galf-text)' }}>
            NOUS <span className="text-galf-yellow">CONTACTER</span>
          </h1>
          <p className="text-xl max-w-3xl leading-relaxed mb-16" style={{ color: 'var(--galf-text-secondary)' }}>
            Candidat, professionnel ou entreprise, notre équipe est disponible pour répondre à vos questions.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12">
          <FadeIn delay={0.2} className="space-y-6">
            {[
              { icon: MapPin, t: "Notre Centre", d: "Zone Industrielle de Yopougon, Abidjan, Côte d'Ivoire" },
              { icon: Phone, t: "Téléphone & WhatsApp", d: "+225 07 11 82 65 07" },
              { icon: Mail, t: "Email", d: "contact@galf-formation.ci" },
              { icon: Clock, t: "Horaires", d: "Lun - Sam : 08h00 - 18h00" },
            ].map((info, i) => (
              <div key={i} className="glass-card p-6 rounded-xl flex items-start gap-4 hover:border-galf-yellow/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-galf-yellow/10 border border-galf-yellow/20 text-galf-yellow flex items-center justify-center shrink-0">
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black mb-1" style={{ color: 'var(--galf-text)' }}>{info.t}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--galf-text-secondary)' }}>{info.d}</p>
                </div>
              </div>
            ))}

            <a href="https://wa.me/2250711826507" className="flex items-center gap-3 bg-green-500 text-white font-black py-4 px-6 rounded-xl hover:bg-green-600 transition-colors shadow-md">
              <MessageCircle className="w-6 h-6" /> Écrire sur WhatsApp
            </a>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="glass-card p-8 rounded-xl relative overflow-hidden">
              <h2 className="text-2xl font-black mb-8 relative z-10" style={{ color: 'var(--galf-text)' }}>Envoyez-nous un message</h2>
              <form className="space-y-5 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  {[{ l: "Nom", p: "Votre nom" }, { l: "Prénom", p: "Votre prénom" }].map((f, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>{f.l}</label>
                      <input type="text" placeholder={f.p} className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Email</label>
                  <input type="email" placeholder="votre@email.com" className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Sujet</label>
                  <select className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}>
                    <option>Demande d'information</option>
                    <option>Inscription à une formation</option>
                    <option>Demande de devis entreprise</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--galf-text-muted)' }}>Message</label>
                  <textarea rows={5} placeholder="Comment pouvons-nous vous aider ?" className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-galf-yellow resize-none" style={{ background: 'var(--galf-bg)', border: '1px solid var(--galf-border)', color: 'var(--galf-text)' }}></textarea>
                </div>
                <button type="button" className="w-full bg-galf-yellow text-galf-carbon font-black py-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Envoyer le message
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
