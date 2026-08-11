'use client';

import { useRef, useState } from 'react';
import { useGsap, gsap } from '@/lib/gsapClient';
import { useLang } from '@/lib/i18n';

export default function Teaser() {
  const root = useRef(null);
  const [sent, setSent] = useState(false);
  const { t } = useLang();

  useGsap(() => {
    gsap.fromTo(
      '.ts-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      },
    );
  }, []);

  return (
    <section ref={root} className="border-t border-line px-5 py-24 text-center sm:px-8 sm:py-32">
      <p className="ts-reveal mb-6 text-[10px] uppercase tracking-mega text-ember">{t('teaser.next')}</p>
      <h2 className="ts-reveal text-[12vw] font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-7xl">
        Drop 002
      </h2>
      <p className="ts-reveal mt-4 font-serif text-2xl italic text-smoke sm:text-3xl">{t('teaser.soon')}</p>

      {/* NOTE: wire this form to your email tool (Formspree / Mailchimp) — see README */}
      {sent ? (
        <p className="ts-reveal mx-auto mt-10 max-w-md text-sm tracking-wide text-smoke" role="status">
          {t('teaser.onList')}
        </p>
      ) : (
        <form
          className="ts-reveal mx-auto mt-10 flex max-w-md items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="flex-1 text-left">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-smoke">
              {t('teaser.email')}
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border-b border-ink/30 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-smoke/60 focus:border-ink"
            />
          </label>
          <button
            type="submit"
            className="whitespace-nowrap border border-ink px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-500 ease-swift hover:bg-ink hover:text-bone"
          >
            {t('teaser.notify')}
          </button>
        </form>
      )}
    </section>
  );
}
