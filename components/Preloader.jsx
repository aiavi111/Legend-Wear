'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsapClient';

const LETTERS = ['L', 'E', 'G', 'E', 'N', 'D'];

export default function Preloader() {
  const rootRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.inOut' },
        onComplete: () => {
          document.documentElement.style.overflow = '';
          setDone(true);
        },
      });

      tl.fromTo(
        '.pl-letter',
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.055, ease: 'power4.out' },
      )
        .to('.pl-track', { letterSpacing: '0.55em', duration: 0.9, ease: 'power2.inOut' }, '<0.15')
        .to('.pl-sub', { opacity: 1, duration: 0.5, ease: 'none' }, '<0.3')
        .to(root, { yPercent: -100, duration: 0.95, delay: 0.25 })
        .to('.pl-inner', { yPercent: 40, opacity: 0, duration: 0.95 }, '<');
    }, root);

    return () => {
      document.documentElement.style.overflow = '';
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink text-bone"
      aria-hidden="true"
    >
      <div className="pl-inner text-center">
        <div className="pl-track flex justify-center font-serif text-4xl tracking-[0.35em] sm:text-5xl">
          {LETTERS.map((l, i) => (
            <span key={i} className="mask">
              <span className="pl-letter">{l}</span>
            </span>
          ))}
        </div>
        <p className="pl-sub mt-6 text-[10px] uppercase tracking-mega text-bone/50 opacity-0">
          Create your legend
        </p>
      </div>
    </div>
  );
}
