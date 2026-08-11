'use client';

import { useRef } from 'react';
import { useGsap, gsap, scrollToId } from '@/lib/gsapClient';
import { useLang } from '@/lib/i18n';

export default function Hero() {
  const root = useRef(null);
  const ghostRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const { t } = useLang();

  useGsap(() => {
    /* entrance — timed to land as the preloader lifts */
    const tl = gsap.timeline({ delay: 1.4, defaults: { ease: 'power4.out' } });
    tl.fromTo(
      ghostRef.current,
      { scale: 1.25, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.4, ease: 'expo.out' },
    )
      .fromTo(
        '.hero-line > span',
        { yPercent: 115 },
        { yPercent: 0, duration: 1.15, stagger: 0.12 },
        '-=2.1',
      )
      .fromTo(
        [card1Ref.current, card2Ref.current],
        { y: 90, opacity: 0, rotate: (i) => (i === 0 ? -12 : 10) },
        { y: 0, opacity: 1, rotate: (i) => (i === 0 ? -6 : 5), duration: 1.4, stagger: 0.15, ease: 'expo.out' },
        '-=1.1',
      )
      .fromTo(
        '.hero-fade',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
        '-=1',
      )
      .fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, '-=0.8');

    /* mobile photo — slow settle + scroll parallax */
    gsap.fromTo('.hero-photo', { scale: 1.16 }, { scale: 1.08, duration: 2.4, ease: 'expo.out', delay: 1.4 });
    gsap.to('.hero-photo', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    /* ghost word — slow breathing; cards — gentle float */
    gsap.to(ghostRef.current, { scale: 1.05, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(card1Ref.current, { y: '+=14', duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 3 });
    gsap.to(card2Ref.current, { y: '+=18', duration: 5.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 3.2 });

    /* scroll — content drifts up, layers separate */
    gsap.to('.hero-content', {
      yPercent: -16,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(ghostRef.current, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-cards', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    /* mouse parallax — ghost and cards move on opposite depths (desktop, non-reduced) */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const gx = gsap.quickTo(ghostRef.current, 'x', { duration: 1.2, ease: 'power3.out' });
      const gy = gsap.quickTo(ghostRef.current, 'y', { duration: 1.2, ease: 'power3.out' });
      const cx = gsap.quickTo('.hero-cards', 'x', { duration: 1.4, ease: 'power3.out' });
      const cy = gsap.quickTo('.hero-cards', 'y', { duration: 1.4, ease: 'power3.out' });
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        gx(nx * 46);
        gy(ny * 30);
        cx(nx * -22);
        cy(ny * -14);
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    });
  }, []);

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] flex-col overflow-hidden bg-ink text-bone"
      aria-label="Legend Wear"
    >
      {/* mobile — full-bleed campaign photo (Nike style) */}
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        <img
          src="/campaign-mobile.jpg"
          alt=""
          className="hero-photo h-full w-full scale-[1.08] object-cover object-[50%_32%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/25" />
      </div>

      {/* hairline column grid — desktop */}
      <div className="pointer-events-none absolute inset-0 hidden lg:grid lg:grid-cols-4" aria-hidden="true">
        <div className="border-l border-bone/[0.05]" />
        <div className="border-l border-bone/[0.05]" />
        <div className="border-l border-bone/[0.05]" />
        <div className="border-l border-bone/[0.05]" />
      </div>

      {/* ghost wordmark */}
      <p
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif uppercase leading-none tracking-[0.02em] text-transparent will-change-transform lg:block lg:text-[30vw]"
        style={{ WebkitTextStroke: '1px rgba(243,240,234,0.13)' }}
      >
        Legend
      </p>

      {/* floating product cards — tablet & desktop */}
      <div className="hero-cards pointer-events-none absolute inset-0 z-[5] hidden sm:block">
        <figure
          ref={card1Ref}
          className="absolute bottom-[18%] right-[4%] top-auto w-[30vw] -rotate-6 shadow-2xl shadow-black/50 sm:bottom-auto sm:top-[16%] sm:w-[24vw] lg:right-[9%] lg:top-[14%] lg:w-[17vw]"
        >
          <img
            src="/mockup-black-hanger-back.jpg"
            alt="Black Legend Script Tee — signature back print"
            className="w-full border border-bone/15"
          />
          <figcaption className="mt-2 hidden justify-between text-[9px] uppercase tracking-[0.25em] text-bone/50 sm:flex">
            <span>Script Tee</span>
            <span>001</span>
          </figcaption>
        </figure>
        <figure
          ref={card2Ref}
          className="absolute bottom-[26%] right-[24%] hidden w-[20vw] rotate-[5deg] shadow-2xl shadow-black/50 sm:block lg:right-[22%] lg:w-[13.5vw]"
        >
          <img
            src="/mockup-bloom-hanger-back.jpg"
            alt="White Bloom Tee — cherry blossom back print"
            className="w-full border border-bone/15"
          />
          <figcaption className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.25em] text-bone/50">
            <span>Bloom Tee</span>
            <span>003</span>
          </figcaption>
        </figure>
      </div>

      {/* content */}
      <div className="hero-content relative z-10 flex flex-1 flex-col justify-end px-5 pb-10 pt-24 sm:px-8 lg:justify-between lg:pb-8 lg:pt-28">
        {/* headline */}
        <div className="lg:my-auto lg:py-8">
          <h1 className="leading-[0.9]">
            <span className="hero-line mask">
              <span className="block text-[13vw] font-extrabold uppercase tracking-[-0.03em] lg:text-[11vw]">
                Create
              </span>
            </span>
            <span className="hero-line mask">
              <span className="stroke-lg block text-[13vw] font-extrabold uppercase tracking-[-0.03em] lg:text-[11vw]">
                Your
              </span>
            </span>
            <span className="hero-line mask">
              <span className="block font-serif text-[15vw] italic leading-[0.95] lg:pl-[8vw] lg:text-[13vw]">
                Legend<span className="not-italic text-ember">.</span>
              </span>
            </span>
          </h1>
        </div>

        {/* bottom row */}
        <div className="mt-8 lg:mt-0">
          <div className="hero-rule mb-7 hidden h-px origin-left bg-bone/15 lg:block" />
          <div className="hero-fade flex items-center gap-5">
            {/* mobile — Nike-style pill */}
            <a
              href="/shop"
              className="inline-flex items-center rounded-full bg-bone px-9 py-3.5 text-[13px] font-semibold text-ink transition-opacity active:opacity-80 lg:hidden"
            >
              {t('hero.shop')}
            </a>
            {/* desktop — bordered */}
            <a
              href="/shop"
              className="group hidden items-center gap-4 border border-bone/40 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ease-swift hover:bg-bone hover:text-ink lg:inline-flex"
            >
              {t('hero.shopCollection')}
              <span className="transition-transform duration-500 ease-swift group-hover:translate-x-1.5">→</span>
            </a>
            <button
              onClick={() => scrollToId('drop')}
              className="u-link hidden text-[11px] font-semibold uppercase tracking-[0.3em] text-bone/70 lg:block"
            >
              {t('hero.viewDrop')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
