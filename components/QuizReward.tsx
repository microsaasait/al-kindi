import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Gift, Loader2, Ticket } from 'lucide-react';
import Wheel, { type WheelSegment } from './Wheel';
import { PERSO } from '../src/personnages';
import { currentPeriod, periodLabel, supabase, supabaseReady } from '../src/supabase';

/** Huit tickets : au-dessus de 8 bonnes réponses, la participation est acquise. */
const SEGMENTS: WheelSegment[] = [
  { label: '🎟️ Ticket', color: '#1E7A4B' },
  { label: '⭐ Ticket', color: '#F0B429' },
  { label: '🍀 Ticket', color: '#EE7B1C' },
  { label: '🎯 Ticket', color: '#14603A' },
  { label: '🎟️ Ticket', color: '#F0B429' },
  { label: '🚀 Ticket', color: '#1E7A4B' },
  { label: '💡 Ticket', color: '#EE7B1C' },
  { label: '🏆 Ticket', color: '#14603A' },
];

type Step = 'idle' | 'spinning' | 'form' | 'sent';

interface Props {
  score: number;
}

const QuizReward: React.FC<Props> = ({ score }) => {
  const [step, setStep] = useState<Step>('idle');
  const [target, setTarget] = useState<number | null>(null);

  const [firstName, setFirstName] = useState('');
  const [contactKind, setContactKind] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [level, setLevel] = useState('');
  const [parentalOk, setParentalOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const period = currentPeriod();

  // Sans configuration Supabase, on n'affiche pas une promesse qu'on ne peut pas tenir.
  if (!supabaseReady) return null;

  const spin = () => {
    setStep('spinning');
    setTarget(Math.floor(Math.random() * SEGMENTS.length));
  };

  const onWheelStop = () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#1E7A4B', '#6BBF59', '#F0B429', '#EE7B1C'],
        disableForReducedMotion: true,
      });
    }
    setStep('form');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!parentalOk) {
      setError('Il faut l’accord de tes parents pour participer.');
      return;
    }

    setBusy(true);
    const { error: dbError } = await supabase.from('ak_participants').insert({
      period,
      first_name: firstName.trim(),
      contact: contact.trim(),
      contact_kind: contactKind,
      school_level: level.trim() || null,
      score,
      parental_ok: parentalOk,
    });
    setBusy(false);

    if (dbError) {
      // 23505 = doublon : une seule participation par contact et par mois.
      setError(
        dbError.code === '23505'
          ? 'Tu as déjà un ticket pour ce mois-ci. Reviens le mois prochain !'
          : 'L’enregistrement n’a pas fonctionné. Réessaie dans un instant.'
      );
      return;
    }

    setStep('sent');
  };

  return (
    <div className="mt-8 rounded-3xl border-2 border-ak-gold/50 bg-ak-gold/10 p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.img
              src={PERSO.fete}
              alt=""
              className="mx-auto h-20 w-20"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            />
            <p className="mt-4 text-[20px] font-extrabold text-ak-ink">
              {score} bonnes réponses : tu peux tourner la roue !
            </p>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-[1.65] text-ak-text">
              À partir de 8 sur 10, tu décroches un ticket pour le tirage au sort du mois. Chaque fin de
              mois, un ticket est tiré et son propriétaire gagne <strong>20 € de crédit</strong> sur la
              plateforme de son choix.
            </p>
            <button
              type="button"
              onClick={spin}
              className="btn-press mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-ak-orange border-[#C4620F] px-8 py-4 text-[16px] font-extrabold text-white"
            >
              <Gift size={18} strokeWidth={2.4} />
              Faire tourner la roue
            </button>
          </motion.div>
        )}

        {step === 'spinning' && (
          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
            <Wheel segments={SEGMENTS} target={target} onFinish={onWheelStop} size={280} />
            <p className="mt-6 text-center text-[15px] font-bold text-ak-text">La roue tourne…</p>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <img src={PERSO.trophee} alt="" className="h-14 w-14" />
              <div>
                <p className="text-[19px] font-extrabold text-ak-ink">Ticket décroché !</p>
                <p className="text-[14px] text-ak-text">
                  Laisse-nous de quoi te prévenir si tu gagnes en {periodLabel(period)}.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">Ton prénom</span>
                  <input
                    className="ak-input mt-2"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    minLength={2}
                    maxLength={40}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                    Ta classe <span className="font-medium normal-case">(facultatif)</span>
                  </span>
                  <input
                    className="ak-input mt-2"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="ex. 4ᵉ"
                    maxLength={40}
                  />
                </label>
              </div>

              <div className="mt-4">
                <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
                  Comment te prévenir ?
                </span>
                <div className="mt-2 flex gap-2">
                  {(['email', 'phone'] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setContactKind(kind)}
                      className={`rounded-full border-2 px-4 py-2 text-[13px] font-bold transition-colors ${
                        contactKind === kind
                          ? 'bg-ak-green border-ak-green text-white'
                          : 'bg-white border-ak-ink/12 text-ak-text hover:border-ak-green/50'
                      }`}
                    >
                      {kind === 'email' ? 'Par email' : 'Par téléphone'}
                    </button>
                  ))}
                </div>
                <input
                  className="ak-input mt-3"
                  type={contactKind === 'email' ? 'email' : 'tel'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={contactKind === 'email' ? 'prenom@exemple.fr' : '06 12 34 56 78'}
                  required
                />
              </div>

              <label className="mt-5 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={parentalOk}
                  onChange={(e) => setParentalOk(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#1E7A4B]"
                />
                <span className="text-[14px] leading-[1.6] text-ak-text">
                  Mes parents sont d’accord pour que je participe et que l’association me contacte si je
                  gagne. Ces informations servent uniquement au tirage et sont effacées ensuite.
                </span>
              </label>

              {error && (
                <p className="mt-4 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-press mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-7 py-4 text-[16px] font-bold text-white disabled:opacity-60"
              >
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Ticket size={18} strokeWidth={2.4} />}
                {busy ? 'Enregistrement…' : 'Valider mon ticket'}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 110 }}
            className="text-center py-2"
          >
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ak-green text-white">
              <Check size={30} strokeWidth={3} />
            </span>
            <p className="mt-5 text-[20px] font-extrabold text-ak-ink">Ticket enregistré, {firstName} !</p>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-[1.65] text-ak-text">
              Le tirage de {periodLabel(period)} a lieu à la fin du mois. Si ton ticket sort, l’association
              te prévient et t’offre 20 € de crédit sur la plateforme de ton choix.
            </p>
            <img src={PERSO.acrobate} alt="" className="mx-auto mt-5 h-16 w-16" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizReward;
