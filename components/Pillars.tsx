import React from 'react';
import { BookOpen, Calculator, Compass, Palette } from 'lucide-react';
import Reveal from './Reveal';
import { PILLARS } from '../src/content';

const STYLES: Record<string, { icon: React.ElementType; tint: string; text: string; chip: string }> = {
  devoirs: { icon: BookOpen, tint: 'bg-ak-green/10', text: 'text-ak-green', chip: 'bg-ak-green/10 text-ak-green' },
  matieres: { icon: Calculator, tint: 'bg-ak-sky/10', text: 'text-ak-sky', chip: 'bg-ak-sky/10 text-ak-sky' },
  methode: { icon: Compass, tint: 'bg-ak-orange/10', text: 'text-ak-orange', chip: 'bg-ak-orange/10 text-ak-orange' },
  ouverture: { icon: Palette, tint: 'bg-ak-gold/15', text: 'text-[#B8860B]', chip: 'bg-ak-gold/20 text-[#B8860B]' },
};

const Pillars: React.FC = () => (
  <section id="actions" className="relative bg-ak-sand py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Reveal>
        <p className="eyebrow">Nos actions</p>
        <h2 className="mt-5 text-[30px] sm:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-ak-ink max-w-2xl">
          Quatre façons d'aider un élève à reprendre la main
        </h2>
      </Reveal>

      <div className="mt-12 grid sm:grid-cols-2 gap-5">
        {PILLARS.map((pillar, i) => {
          const style = STYLES[pillar.key];
          const Icon = style.icon;
          return (
            <Reveal key={pillar.key} delay={i * 0.07}>
              <article className="ak-card ak-card-lift h-full p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${style.tint} ${style.text}`}>
                    <Icon size={26} strokeWidth={2} />
                  </span>
                  <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${style.chip}`}>
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="mt-6 text-[21px] font-extrabold text-ak-ink">{pillar.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-ak-text">{pillar.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default Pillars;
