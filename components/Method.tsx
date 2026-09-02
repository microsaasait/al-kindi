import React from 'react';
import Reveal from './Reveal';
import { STEPS } from '../src/content';

const Method: React.FC = () => (
  <section id="methode" className="py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Reveal>
        <p className="eyebrow">Comment ça marche</p>
        <h2 className="mt-5 text-[30px] sm:text-[40px] leading-[1.14] font-extrabold tracking-[-0.02em] text-ak-ink max-w-2xl">
          De la première rencontre au premier bulletin qui remonte
        </h2>
      </Reveal>

      <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.07}>
            <li className="ak-card ak-card-lift h-full p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ak-ink text-white text-[16px] font-extrabold">
                {step.n}
              </span>
              <h3 className="mt-5 text-[19px] font-extrabold text-ak-ink">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ak-text">{step.text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default Method;
