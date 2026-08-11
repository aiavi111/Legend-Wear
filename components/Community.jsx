'use client';

import { useRef } from 'react';
import { useGsap, gsap } from '@/lib/gsapClient';
import { community, site } from '@/lib/site';
import { useLang } from '@/lib/i18n';

export default function Community() {
  const root = useRef(null);
  const { t } = useLang();

  useGsap(() => {
    gsap.fromTo(
      '.cm-head > span',
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      },
    );

    /* independent parallax speeds per tile (desktop only) */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.cm-item').forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '1');
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: (1 - speed) * 220,
            ease: 'none',
            scrollTrigger: { trigger: '.cm-grid', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });
  }, []);

  return (
    <section ref={root} id="community" className="overflow-hidden px-5 py-28 sm:px-8 sm:py-40">
      <header className="mb-16 flex flex-wrap items-end justify-between gap-10 sm:mb-24">
        <div>
          <p className="mb-6 text-[10px] uppercase tracking-mega text-smoke">The movement — 04</p>
          <h2 className="leading-[0.98]">
            <span className="cm-head mask">
              <span className="block text-[11vw] font-extrabold uppercase tracking-[-0.02em] sm:text-7xl lg:text-8xl">
                Follow the
              </span>
            </span>
            <span className="cm-head mask">
              <span className="block font-serif text-[11vw] italic text-smoke sm:text-7xl lg:text-8xl">
                movement
              </span>
            </span>
          </h2>
        </div>
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          className="u-link-static u-link pb-2 font-serif text-2xl italic sm:text-3xl"
        >
          {site.handle}
        </a>
      </header>

      {/* editorial grid — replace with real community photos */}
      <div className="cm-grid grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-12">
        {community.map((c, i) => {
          const spans = [
            'lg:col-span-5 lg:mt-0 aspect-[4/5]',
            'lg:col-span-4 lg:mt-24 aspect-[3/4]',
            'lg:col-span-3 lg:mt-48 aspect-[4/5]',
            'lg:col-span-3 lg:col-start-2 lg:-mt-10 aspect-square',
            'lg:col-span-5 lg:mt-16 aspect-[4/5]',
            'lg:col-span-3 lg:mt-2 aspect-[3/4]',
          ];
          return (
            <a
              key={i}
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              data-speed={c.speed}
              className={`cm-item group relative block overflow-hidden bg-bone-2 ${spans[i % spans.length]}`}
            >
              <img
                src={c.img}
                alt={c.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1100ms] ease-swift group-hover:scale-[1.06]"
              />
              <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-10 text-[10px] uppercase tracking-[0.25em] text-bone opacity-0 transition-all duration-500 ease-swift group-hover:translate-y-0 group-hover:opacity-100">
                {site.handle} <span>↗</span>
              </span>
            </a>
          );
        })}
      </div>

      <div className="mt-16 flex justify-center sm:mt-24">
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          className="border border-ink px-10 py-5 text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ease-swift hover:bg-ink hover:text-bone"
        >
          {t('community.follow')}
        </a>
      </div>
    </section>
  );
}
