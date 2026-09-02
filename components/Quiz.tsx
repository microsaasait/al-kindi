import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, RotateCcw, Sparkles, X } from 'lucide-react';
import Reveal from './Reveal';
import QuizReward from './QuizReward';
import { PERSO, PERSO_PAR_THEME } from '../src/personnages';
import {
  CHEERS,
  MISSES,
  QUESTION_BANK,
  ROUND_SIZE,
  WIN_THRESHOLD,
  drawQuestions,
  scoreMessage,
} from '../src/questions';

type Phase = 'intro' | 'playing' | 'done';

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

/** Petite pluie de confettis aux couleurs du logo. */
const cheer = (big = false) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti({
    particleCount: big ? 140 : 45,
    spread: big ? 90 : 55,
    startVelocity: big ? 45 : 30,
    origin: { y: 0.6 },
    colors: ['#1E7A4B', '#6BBF59', '#F0B429', '#EE7B1C'],
    disableForReducedMotion: true,
  });
};

const Quiz: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(() => drawQuestions());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const question = round[index];
  const isLast = index === round.length - 1;
  const answered = picked !== null;
  const progress = phase === 'done' ? 100 : ((index + (answered ? 1 : 0)) / round.length) * 100;
  const result = useMemo(() => scoreMessage(score, round.length), [score, round.length]);
  const perso = PERSO[PERSO_PAR_THEME[question?.theme ?? ''] ?? 'eleve'];

  const start = useCallback(() => {
    setRound(drawQuestions());
    setPhase('playing');
    setIndex(0);
    setScore(0);
    setPicked(null);
    setFeedback('');
  }, []);

  const answer = (i: number) => {
    if (answered) return;
    setPicked(i);
    if (i === question.correct) {
      setScore((s) => s + 1);
      setFeedback(pick(CHEERS));
      cheer();
    } else {
      setFeedback(pick(MISSES));
    }
  };

  const next = () => {
    if (isLast) {
      setPhase('done');
      if (score >= Math.ceil(round.length * 0.6)) cheer(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setFeedback('');
  };

  return (
    <section id="quiz" className="relative py-20 sm:py-24 overflow-hidden">
      {/* Personnages qui flottent autour de la section */}
      <motion.img
        src={PERSO.garcon}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[4%] top-24 hidden h-16 w-16 lg:block"
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      />
      <motion.img
        src={PERSO.fille}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-40 hidden h-16 w-16 lg:block"
        animate={{ y: [0, -11, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.img
        src={PERSO.studieux}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[7%] bottom-24 hidden h-14 w-14 lg:block"
        animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1.1 }}
      />
      <motion.img
        src={PERSO.mainLevee}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[7%] bottom-32 hidden h-16 w-16 lg:block"
        animate={{ y: [0, -13, 0] }}
        transition={{ repeat: Infinity, duration: 4.6, ease: 'easeInOut', delay: 0.3 }}
      />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow">
              <Sparkles size={14} className="text-ak-gold" />
              Mini-jeu
            </p>
            <h2 className="mt-5 text-[30px] sm:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-ak-ink">
              Teste tes connaissances
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-ak-text">
              Dix questions niveau brevet, tirées au hasard parmi {QUESTION_BANK.length}. Une explication à
              chaque réponse, et un ticket pour le tirage du mois à partir de {WIN_THRESHOLD} sur{' '}
              {ROUND_SIZE}.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="ak-card mt-10 overflow-hidden">
            {phase === 'playing' && (
              <div className="h-2.5 w-full bg-ak-ink/8">
                <motion.div
                  className="h-full rounded-r-full bg-ak-green"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            )}

            <div className="p-6 sm:p-9">
              <AnimatePresence mode="wait">
                {phase === 'intro' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                  >
                    <div className="flex items-end justify-center gap-3">
                      <motion.img
                        src={PERSO.eleve}
                        alt=""
                        className="h-16 w-16"
                        animate={{ y: [0, -7, 0] }}
                        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                      />
                      <motion.img
                        src={PERSO.prof}
                        alt=""
                        className="h-24 w-24"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 0.4 }}
                      />
                      <motion.img
                        src={PERSO.diplome}
                        alt=""
                        className="h-14 w-14"
                        animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.8 }}
                      />
                    </div>
                    <p className="mt-6 text-[18px] font-bold text-ak-ink">
                      Prêt ? {ROUND_SIZE} questions, 2 minutes.
                    </p>
                    <p className="mt-2 text-[15px] text-ak-text">
                      Histoire, sciences, géo, français, calcul : on verra bien où tu en es.
                    </p>
                    <button
                      type="button"
                      onClick={start}
                      className="btn-press mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-8 py-4 text-[16px] font-bold text-white"
                    >
                      Commencer le quiz
                    </button>
                  </motion.div>
                )}

                {phase === 'playing' && (
                  <motion.div
                    key={`q-${index}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-ak-gold/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#B8860B]">
                        {question.theme}
                      </span>
                      <span className="text-[13px] font-bold text-ak-text/70">
                        {index + 1} / {round.length}
                      </span>
                    </div>

                    <div className="mt-5 flex items-start gap-4">
                      <motion.img
                        key={perso}
                        src={perso}
                        alt=""
                        aria-hidden="true"
                        className="hidden h-14 w-14 shrink-0 sm:block"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={
                          answered
                            ? picked === question.correct
                              ? { scale: 1, opacity: 1, y: [0, -12, 0], rotate: [0, 10, -6, 0] }
                              : { scale: 1, opacity: 1, x: [0, -5, 5, 0] }
                            : { scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 0.5 }}
                      />
                      <h3 className="text-[21px] sm:text-[24px] font-extrabold leading-[1.3] text-ak-ink">
                        {question.question}
                      </h3>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {question.answers.map((label, i) => {
                        const isCorrect = i === question.correct;
                        const isPicked = picked === i;

                        let tone = 'bg-white border-ak-ink/12 text-ak-ink hover:border-ak-green/50';
                        if (answered && isCorrect) tone = 'bg-ak-green/10 border-ak-green text-ak-ink';
                        else if (answered && isPicked) tone = 'bg-red-50 border-red-400 text-ak-ink';
                        else if (answered) tone = 'bg-white border-ak-ink/10 text-ak-text/50';

                        return (
                          <motion.button
                            key={label}
                            type="button"
                            onClick={() => answer(i)}
                            disabled={answered}
                            whileTap={answered ? undefined : { scale: 0.985 }}
                            animate={answered && isCorrect ? { scale: [1, 1.03, 1] } : {}}
                            transition={{ duration: 0.35 }}
                            className={`flex items-center justify-between gap-4 rounded-2xl border-2 px-5 py-4 text-left text-[16px] font-semibold transition-colors ${tone}`}
                          >
                            <span>{label}</span>
                            {answered && isCorrect && (
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ak-green text-white">
                                <Check size={16} strokeWidth={3} />
                              </span>
                            )}
                            {answered && isPicked && !isCorrect && (
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400 text-white">
                                <X size={16} strokeWidth={3} />
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {answered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className={`mt-6 rounded-2xl border-2 p-5 ${
                              picked === question.correct
                                ? 'bg-ak-green/8 border-ak-green/30'
                                : 'bg-ak-gold/10 border-ak-gold/40'
                            }`}
                          >
                            <p className="text-[16px] font-extrabold text-ak-ink">{feedback}</p>
                            <p className="mt-1.5 text-[15px] leading-[1.65] text-ak-text">
                              {question.explanation}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={next}
                            className="btn-press mt-5 w-full rounded-2xl bg-ak-ink border-black/25 px-7 py-4 text-[16px] font-bold text-white"
                          >
                            {isLast ? 'Voir mon score' : 'Question suivante'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {phase === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 90 }}
                  >
                    <div className="text-center py-2">
                      <motion.img
                        src={score >= WIN_THRESHOLD ? PERSO.trophee : PERSO.mainLevee}
                        alt=""
                        className="mx-auto h-20 w-20"
                        animate={{ y: [0, -9, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      />
                      <p className="mt-5 text-[44px] font-extrabold leading-none text-ak-ink">
                        {score}
                        <span className="text-[24px] text-ak-text/60"> / {round.length}</span>
                      </p>
                      <p className="mt-4 text-[20px] font-extrabold text-ak-ink">{result.title}</p>
                      <p className="mx-auto mt-2 max-w-md text-[15px] leading-[1.7] text-ak-text">
                        {result.text}
                      </p>
                    </div>

                    {score >= WIN_THRESHOLD && <QuizReward score={score} />}

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        type="button"
                        onClick={start}
                        className="btn-press inline-flex items-center justify-center gap-2 rounded-2xl bg-white border-ak-ink/15 px-7 py-4 text-[16px] font-bold text-ak-ink"
                      >
                        <RotateCcw size={17} strokeWidth={2.4} />
                        Rejouer, 10 autres questions
                      </button>
                      <a
                        href="#contact"
                        className="btn-press inline-flex items-center justify-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-7 py-4 text-[16px] font-bold text-white"
                      >
                        Se faire accompagner
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Quiz;
