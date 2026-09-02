import React from 'react';
import { HeartHandshake, ShieldCheck, Sprout } from 'lucide-react';
import Reveal from './Reveal';
import { VALUES } from '../src/content';

const ICONS = [HeartHandshake, ShieldCheck, Sprout];
const TINTS = ['bg-ak-orange/10 text-ak-orange', 'bg-ak-green/10 text-ak-green', 'bg-ak-gold/20 text-[#B8860B]'];

const Values: React.FC = () => (
  <section className="bg-ak-sand py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Reveal>
        <p className="eyebrow">Notre charte</p>
        <h2 className="mt-5 text-[30px] sm:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-ak-ink max-w-2xl">
          Ce sur quoi les familles peuvent compter
        </h2>
      </Reveal>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {VALUES.map((value, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={value.title} delay={i * 0.07}>
              <div className="ak-card ak-card-lift h-full p-7">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${TINTS[i % TINTS.length]}`}>
                  <Icon size={22} strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-[19px] font-extrabold text-ak-ink">{value.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-ak-text">{value.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default Values;
