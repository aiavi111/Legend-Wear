'use client';

import { useRef } from 'react';
import { useGsap, gsap } from '@/lib/gsapClient';

export default function Manifesto() {
  const root = useRef(null);

  useGsap(() => {
    gsap.fromTo(
      '.mf-line > span',
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      },
    );
    gsap.fromTo(
      '.mf-label',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, scrollTrigger: { trigger: root.current, start: 'top 72%' } },
    );
  }, []);

  return (
    <section ref={root} className="px-5 py-28 sm:px-8 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <p className="mf-label mb-10 text-[10px] uppercase tracking-mega text-smoke">The brand — 01</p>
        <h2 className="text-[8.5vw] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          <span className="mf-line mask">
            <span>Not for everyone.</span>
          </span>
          <span className="mf-line mask">
            <span className="font-serif font-normal normal-case italic tracking-normal text-smoke">
              Since day one —
            </span>
          </span>
          <span className="mf-line mask">
            <span className="font-serif font-normal normal-case italic tracking-normal text-smoke">
              earn your legacy.
            </span>
          </span>
        </h2>
      </div>
    </section>
  );
}
