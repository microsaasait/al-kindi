import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, MapPin, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';
import { PERSO } from '../src/personnages';
import { CONTACT } from '../src/siteConfig';
import { apiPrete, inserer } from '../src/api';

type Kind = 'inscription' | 'benevolat' | 'autre';

const KINDS: { value: Kind; label: string }[] = [
  { value: 'inscription', label: 'Inscrire un élève' },
  { value: 'benevolat', label: 'Devenir bénévole' },
  { value: 'autre', label: 'Autre demande' },
];

/**
 * La demande part directement dans l'espace de l'association : elle la retrouve
 * dans son tableau de bord, sans dépendre d'une boîte mail ou d'un téléphone.
 */
const Contact: React.FC = () => {
  const [kind, setKind] = useState<Kind>('inscription');
  const [name, setName] = useState('');
  const [contactKind, setContactKind] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [detail, setDetail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // piège à robots, invisible
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (website) return; // un robot a rempli le champ caché
    if (!apiPrete) {
      setError('Le formulaire n’est pas encore configuré.');
      return;
    }

    setBusy(true);
    const echec = await inserer('ak_messages', {
      kind,
      name: name.trim(),
      contact: contact.trim(),
      contact_kind: contactKind,
      detail: detail.trim() || null,
      message: message.trim(),
    });
    setBusy(false);

    if (echec) {
      setError('L’envoi n’a pas fonctionné. Réessayez dans un instant.');
      return;
    }
    setSent(true);
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
              Dites-nous en quelques lignes où en est l’élève. Votre demande arrive directement à
              l’association, qui revient vers vous pour un premier échange, sans engagement.
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
                <MessageSquare size={18} className="mt-0.5 shrink-0 text-ak-green" strokeWidth={2} />
                <span className="text-[15px] font-medium text-ak-text">Réponse en général sous 48 h</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ak-green" strokeWidth={2} />
                <span className="text-[15px] font-medium text-ak-text">
                  Vos coordonnées ne servent qu’à vous répondre
                </span>
              </li>
            </ul>

            <img src={PERSO.profe} alt="" width={192} height={192} loading="lazy" className="mt-10 hidden h-24 w-24 lg:block" />
          </Reveal>

          <Reveal delay={0.1}>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 110 }}
                className="ak-card flex h-full flex-col items-center justify-center p-10 text-center"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ak-green text-white">
                  <Check size={30} strokeWidth={3} />
                </span>
                <p className="mt-5 text-[22px] font-extrabold text-ak-ink">Demande envoyée !</p>
                <p className="mt-3 max-w-sm text-[15px] leading-[1.7] text-ak-text">
                  L’association a bien reçu votre message{name ? `, ${name.trim()}` : ''}. Elle vous
                  répond en général sous 48 heures.
                </p>
                <img src={PERSO.mainLevee} alt="" width={192} height={192} loading="lazy" className="mt-6 h-16 w-16" />
              </motion.div>
            ) : (
              <form onSubmit={submit} className="ak-card p-6 sm:p-8">
                <fieldset>
                  <legend className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                    Votre demande
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {KINDS.map((k) => (
                      <button
                        key={k.value}
                        type="button"
                        onClick={() => setKind(k.value)}
                        className={`rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors border-2 ${
                          kind === k.value
                            ? 'bg-ak-green border-ak-green text-white'
                            : 'bg-white border-ak-ink/12 text-ak-text hover:border-ak-green/50'
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                      Votre nom
                    </span>
                    <input
                      className="ak-input mt-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Prénom et nom"
                      minLength={2}
                      maxLength={80}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                      {kind === 'inscription' ? 'Classe de l’élève' : 'Matières & disponibilités'}
                    </span>
                    <input
                      className="ak-input mt-2"
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder={kind === 'inscription' ? 'ex. 4ᵉ' : 'ex. maths, mercredi après-midi'}
                      maxLength={120}
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                    Comment vous répondre ?
                  </span>
                  <div className="mt-2 flex gap-2">
                    {(['email', 'phone'] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setContactKind(k)}
                        className={`rounded-full border-2 px-4 py-2 text-[13px] font-bold transition-colors ${
                          contactKind === k
                            ? 'bg-ak-green border-ak-green text-white'
                            : 'bg-white border-ak-ink/12 text-ak-text hover:border-ak-green/50'
                        }`}
                      >
                        {k === 'email' ? 'Par email' : 'Par téléphone'}
                      </button>
                    ))}
                  </div>
                  <input
                    className="ak-input mt-3"
                    type={contactKind === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={contactKind === 'email' ? 'vous@exemple.fr' : '06 12 34 56 78'}
                    required
                  />
                </div>

                <label className="mt-4 block">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                    Votre message
                  </span>
                  <textarea
                    className="ak-input mt-2 min-h-[130px] resize-y"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Où ça coince, ce que vous cherchez, vos disponibilités…"
                    maxLength={4000}
                    required
                  />
                </label>

                {/* Piège à robots : invisible pour un humain, rempli par les scripts. */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                {error && (
                  <p className="mt-4 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-press group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-7 py-4 text-[16px] font-bold text-white disabled:opacity-60"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} strokeWidth={2.4} />}
                  {busy ? 'Envoi…' : 'Envoyer ma demande'}
                </button>

                <p className="mt-4 text-center text-[12px] text-ak-text/60">
                  Vos coordonnées servent uniquement à vous répondre et ne sont transmises à personne.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
