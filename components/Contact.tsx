import React, { useState } from 'react';
import { MapPin, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';
import { CONTACT, WHATSAPP_NUMBER } from '../src/siteConfig';

type Subject = 'inscription' | 'benevolat' | 'autre';

const SUBJECTS: { value: Subject; label: string }[] = [
  { value: 'inscription', label: 'Inscrire un élève' },
  { value: 'benevolat', label: 'Devenir bénévole' },
  { value: 'autre', label: 'Autre demande' },
];

/**
 * Le formulaire ouvre WhatsApp avec le message déjà rédigé : aucun backend à
 * héberger, et l'association répond depuis son téléphone.
 */
const Contact: React.FC = () => {
  const [subject, setSubject] = useState<Subject>('inscription');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!WHATSAPP_NUMBER) return;

    const label = SUBJECTS.find((s) => s.value === subject)?.label ?? 'Demande';
    const detail = subject === 'inscription' ? "Classe de l'élève" : 'Matières & disponibilités';
    const text = [
      `Bonjour, je vous écris depuis le site de l'association Al Kindi.`,
      '',
      `Demande : ${label}`,
      `Nom : ${name}`,
      level ? `${detail} : ${level}` : '',
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <section id="contact" className="bg-ak-sand py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16">
          <Reveal>
            <p className="eyebrow">Nous écrire</p>
            <h2 className="mt-5 text-[30px] sm:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-ak-ink">
              Parlons de votre enfant
            </h2>
            <p className="mt-5 text-[16px] leading-[1.75] text-ak-text">
              Dites-nous en quelques lignes où en est l'élève. Le message part sur WhatsApp, nous
              revenons vers vous pour un premier échange, sans engagement.
            </p>

            <ul className="mt-10 space-y-5">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-ak-green" strokeWidth={2} />
                <span className="text-[15px] font-medium text-ak-text">
                  {CONTACT.addressLine ? `${CONTACT.addressLine}, ` : ''}
                  {CONTACT.city}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-ak-green" strokeWidth={2} />
                <span className="text-[15px] font-medium text-ak-text">
                  Réponse sur WhatsApp, en général sous 48 h
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="ak-card p-6 sm:p-8">
              <fieldset>
                <legend className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                  Votre demande
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSubject(s.value)}
                      className={`rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors border-2 ${
                        subject === s.value
                          ? 'bg-ak-green border-ak-green text-white'
                          : 'bg-white border-ak-ink/12 text-ak-text hover:border-ak-green/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">Votre nom</span>
                  <input
                    className="ak-input mt-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom et nom"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                    {subject === 'inscription' ? "Classe de l'élève" : 'Matières & disponibilités'}
                  </span>
                  <input
                    className="ak-input mt-2"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder={subject === 'inscription' ? 'ex. 4ᵉ' : 'ex. maths, mercredi après-midi'}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">Votre message</span>
                <textarea
                  className="ak-input mt-2 min-h-[130px] resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Où ça coince, ce que vous cherchez, vos disponibilités…"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={!WHATSAPP_NUMBER}
                className="btn-press group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-7 py-4 text-[16px] font-bold text-white disabled:opacity-50"
              >
                <MessageCircle size={18} strokeWidth={2.2} />
                Envoyer sur WhatsApp
              </button>

              <p className="mt-4 text-center text-[12px] text-ak-text/60">
                WhatsApp s'ouvre avec votre message déjà rédigé. Aucune donnée n'est stockée par ce site.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
