import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, HeartHandshake, PenLine, Sparkles } from 'lucide-react';
import { HERO } from '../src/content';

/** Petite icône qui flotte autour du logo : le clin d'œil ludique de la page. */
const Floating: React.FC<{
  icon: React.ElementType;
  className: string;
  color: string;
  delay: number;
}> = ({ icon: Icon, className, color, delay }) => (
  <motion.div
    className={`absolute hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-white border-2 border-ak-ink/10 shadow-[0_8px_0_-2px_rgba(20,67,44,0.08)] ${className}`}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
    transition={{
      opacity: { delay, duration: 0.4 },
      scale: { delay, type: 'spring', stiffness: 120 },
      y: { repeat: Infinity, duration: 4 + delay, ease: 'easeInOut' },
    }}
    aria-hidden="true"
  >
    <Icon size={22} strokeWidth={2} className={color} />
  </motion.div>
);

const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden pt-[72px]">
    <div className="absolute inset-0 ak-dots opacity-70" aria-hidden="true" />
    <div
      className="pointer-events-none absolute -top-28 right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(240,180,41,0.28) 0%, transparent 70%)' }}
      aria-hidden="true"
    />

    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 sm:pt-20 sm:pb-24">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-12 items-center">
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles size={14} className="text-ak-gold" />
            {HERO.eyebrow}
          </motion.p>

          <motion.h1
            className="mt-6 text-[38px] leading-[1.08] sm:text-[54px] lg:text-[60px] font-extrabold tracking-[-0.03em] text-ak-ink"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            {HERO.title}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">{HERO.titleAccent}</span>
              {/* trait de marqueur sous le mot clé */}
              <motion.span
                className="absolute left-0 bottom-1 h-[14px] w-full rounded-full bg-ak-gold/45 -z-0"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-[17px] leading-[1.7] text-ak-text max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
          >
            {HERO.lead}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <a
              href="#contact"
              className="btn-press group inline-flex items-center justify-center gap-2 bg-ak-green border-ak-greenDark text-white text-[16px] font-bold px-8 py-4 rounded-2xl"
            >
              Inscrire un élève
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#benevoles"
              className="btn-press inline-flex items-center justify-center gap-2 bg-white border-ak-ink/15 text-ak-ink text-[16px] font-bold px-8 py-4 rounded-2xl"
            >
              <HeartHandshake size={18} className="text-ak-orange" />
              Devenir bénévole
            </a>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            {HERO.proof.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white border-2 border-ak-ink/10 px-4 py-1.5 text-[13px] font-semibold text-ak-text"
              >
                {tag}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[400px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <motion.img
            src="/media/logo.webp"
            alt="Logo de l'association Al Kindi : entraide, soutien et réussite, Roquebrune-sur-Argens"
            className="w-full h-auto mix-blend-multiply"
            width={800}
            height={800}
            fetchPriority="high"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          />
          <Floating icon={BookOpen} className="top-4 -left-2" color="text-ak-green" delay={0.5} />
          <Floating icon={PenLine} className="bottom-10 -right-1" color="text-ak-orange" delay={0.8} />
          <Floating icon={Sparkles} className="top-1/3 -right-6" color="text-ak-gold" delay={1.1} />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
