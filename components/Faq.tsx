import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Reveal from './Reveal';
import { FAQ } from '../src/content';

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-5 text-[30px] sm:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-ak-ink">
            Ce que les parents nous demandent
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className="ak-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-5 px-6 py-5 text-left"
                  >
                    <span className="text-[17px] font-bold text-ak-ink">{item.q}</span>
                    <span
                      className={`mt-0.5 shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ak-green/10 text-ak-green transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      <Plus size={18} strokeWidth={2.4} />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 pr-14 text-[15px] leading-[1.75] text-ak-text">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
