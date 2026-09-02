import React from 'react';
import { ArrowRight, Clock, GraduationCap, Users } from 'lucide-react';
import Reveal from './Reveal';

const POINTS = [
  { icon: Clock, label: '2 h par semaine suffisent' },
  { icon: GraduationCap, label: 'Étudiant, prof, retraité, pro' },
  { icon: Users, label: 'En petit groupe, jamais seul' },
];

const Volunteers: React.FC = () => (
  <section id="benevoles" className="py-4 sm:py-8">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-ak-green px-6 py-14 sm:px-14 sm:py-16 text-white">
          <div className="absolute inset-0 ak-dots opacity-40" aria-hidden="true" />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border-2 border-white/20 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide">
                Devenir bénévole
              </span>
              <h2 className="mt-5 text-[28px] sm:text-[38px] leading-[1.16] font-extrabold tracking-[-0.02em]">
                Deux heures par semaine peuvent changer l'année d'un élève
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-white/85 max-w-xl">
                Si vous maîtrisez une matière et que vous savez l'expliquer simplement, vous avez votre
                place chez nous. Dites-nous vos matières et vos disponibilités, on s'occupe du reste.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {POINTS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/12 border-2 border-white/15 px-4 py-2 text-[13px] font-semibold"
                  >
                    <Icon size={15} strokeWidth={2.2} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:justify-self-end">
              <a
                href="#contact"
                className="btn-press group inline-flex items-center justify-center gap-2 bg-ak-gold border-[#C8901F] text-ak-ink text-[16px] font-extrabold px-8 py-4 rounded-2xl"
              >
                Proposer mon aide
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Volunteers;
