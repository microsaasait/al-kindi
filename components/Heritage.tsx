import React from 'react';
import { Quote } from 'lucide-react';
import Reveal from './Reveal';
import { HERITAGE } from '../src/content';

const Heritage: React.FC = () => (
  <section id="heritage" className="relative py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-ak-ink text-white px-6 py-14 sm:px-14 sm:py-16">
          <div className="absolute inset-0 ak-dots opacity-40" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-[360px] w-[360px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(107,191,89,0.28) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border-2 border-white/15 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-ak-gold">
                {HERITAGE.eyebrow}
              </span>
              <h2 className="mt-5 text-[28px] sm:text-[36px] leading-[1.16] font-extrabold tracking-[-0.02em]">
                {HERITAGE.title}
              </h2>

              <figure className="mt-9 rounded-3xl bg-white/[0.07] border-2 border-white/10 p-6">
                <Quote size={20} className="text-ak-gold" strokeWidth={2} />
                <blockquote className="mt-3 text-[18px] leading-[1.55] font-medium text-white/90">
                  {HERITAGE.quote}
                </blockquote>
                <figcaption className="mt-3 text-[13px] text-white/50">
                  Dans l'esprit d'Al-Kindi, philosophe et mathématicien, IXᵉ siècle
                </figcaption>
              </figure>
            </div>

            <div className="space-y-5">
              {HERITAGE.paragraphs.map((p, i) => (
                <p key={i} className="text-[16px] sm:text-[17px] leading-[1.8] text-white/75">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Heritage;
