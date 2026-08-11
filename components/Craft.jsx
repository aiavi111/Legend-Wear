'use client';

import { useRef, useState } from 'react';
import { useGsap, gsap, ScrollTrigger } from '@/lib/gsapClient';
import { craft } from '@/lib/site';
import { useLang } from '@/lib/i18n';

export default function Craft() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const { t } = useLang();

  useGsap(() => {
    /* sync sticky image with scroll position of each row */
    gsap.utils.toArray('.craft-row').forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      });
      gsap.fromTo(
        row,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 80%' },
        },
      );
    });

    gsap.fromTo(
      '.craft-head > span',
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      },
    );
  }, []);

  return (
    <section ref={root} id="craft" className="border-t border-line">
      <div className="px-5 pt-24 sm:px-8 sm:pt-32">
        <p className="mb-6 text-[10px] uppercase tracking-mega text-smoke">The craft — 02</p>
        <h2 className="craft-head mask max-w-4xl">
          <span className="block text-[9vw] font-extrabold uppercase leading-[1] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Considered in
          </span>
        </h2>
        <h2 className="craft-head mask max-w-4xl">
          <span className="block font-serif text-[9vw] italic leading-[1.1] text-smoke sm:text-6xl lg:text-7xl">
            every detail.
          </span>
        </h2>
      </div>

      <div className="mt-16 grid lg:grid-cols-2">
        {/* sticky visual */}
        <div className="relative lg:sticky lg:top-0 lg:h-screen">
          <div className="relative aspect-[4/5] overflow-hidden bg-bone-2 lg:absolute lg:inset-0 lg:aspect-auto">
            {craft.map((c, i) => (
              <img
                key={c.n}
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-swift"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
            <p className="absolute bottom-5 left-5 bg-ink/70 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-bone backdrop-blur-sm">
              {craft[active].caption}
            </p>
          </div>
        </div>

        {/* spec rows */}
        <div className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:py-[18vh] lg:pl-16 lg:pr-[7vw]">
          {craft.map((c, i) => (
            <button
              key={c.n}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`craft-row group border-t border-line py-10 text-left transition-opacity duration-500 last:border-b lg:py-14 ${
                active === i ? 'opacity-100' : 'lg:opacity-40'
              }`}
            >
              <div className="flex items-baseline gap-6">
                <span className="text-[10px] tracking-[0.3em] text-ember">{c.n}</span>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-[-0.01em] sm:text-2xl">
                    {t(`craft.c${i + 1}t`)}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-smoke">{t(`craft.c${i + 1}d`)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
