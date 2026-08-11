'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollToId } from '@/lib/gsapClient';
import { site } from '@/lib/site';
import { useCart } from '@/components/CartContext';
import { useLang } from '@/lib/i18n';
import LangSwitch from '@/components/LangSwitch';

/* Anchor links point to the home page sections; the Catalog link is its own page. */
const ANCHORS = [
  { id: 'drop', key: 'nav.drop' },
  { id: 'story', key: 'nav.story' },
  { id: 'community', key: 'nav.community' },
];

const isHome = () =>
  typeof window !== 'undefined' &&
  !/shop(\.html)?\/?$/.test(window.location.pathname);

export default function Nav() {
  const barRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const { t } = useLang();

  /* hide on scroll down, reveal on scroll up */
  useEffect(() => {
    const bar = barRef.current;
    const yTo = gsap.quickTo(bar, 'yPercent', { duration: 0.5, ease: 'power3.out' });
    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 200) yTo(-130);
        else yTo(0);
      },
    });
    return () => st.kill();
  }, []);

  /* full-screen menu */
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const links = menu.querySelectorAll('.menu-link');
    const meta = menu.querySelectorAll('.menu-meta');

    if (open) {
      window.__lenis?.stop();
      gsap.set(menu, { display: 'flex' });
      const tl = gsap.timeline();
      tl.fromTo(
        menu,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
      )
        .fromTo(
          links,
          { yPercent: 130 },
          { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out' },
          '-=0.25',
        )
        .fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.4');
    } else {
      window.__lenis?.start();
      gsap.to(menu, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(menu, { display: 'none' }),
      });
    }
  }, [open]);

  /* smooth-scroll on home; normal navigation from other pages */
  const onAnchor = (e, id) => {
    if (isHome()) {
      e.preventDefault();
      setOpen(false);
      setTimeout(() => scrollToId(id), open ? 650 : 0);
    }
  };
  const onHome = (e) => {
    if (isHome()) {
      e.preventDefault();
      setOpen(false);
      window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const MENU = [
    { href: '/shop', label: t('nav.catalog') },
    ...ANCHORS.map((a) => ({ href: `/#${a.id}`, label: t(a.key), id: a.id })),
  ];

  return (
    <>
      {/* bar — wordmark & controls blend, center links float on a glass island */}
      <header ref={barRef} className="pointer-events-none fixed inset-x-0 top-0 z-[190]">
        <nav className="relative flex items-center justify-between px-5 py-5 sm:px-8">
          <a
            href="/"
            onClick={onHome}
            className="pointer-events-auto font-serif text-sm tracking-[0.4em] text-bone mix-blend-difference"
            aria-label="Legend Wear — home"
          >
            LEGEND&nbsp;WEAR
          </a>

          {/* glass island */}
          <div
            className={`pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 rounded-full border border-white/50 bg-white/60 px-8 py-3.5 shadow-[0_10px_40px_rgba(19,18,16,0.18)] backdrop-blur-xl transition-opacity duration-300 lg:flex ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <a href="/shop" className="u-link text-[11px] font-medium uppercase tracking-[0.25em] text-ink">
              {t('nav.catalog')}
            </a>
            {ANCHORS.map((l) => (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={(e) => onAnchor(e, l.id)}
                className="u-link text-[11px] font-medium uppercase tracking-[0.25em] text-ink"
              >
                {t(l.key)}
              </a>
            ))}
            <LangSwitch className="ml-1 text-ink" />
          </div>

          <div className="pointer-events-auto flex items-center gap-6 text-bone mix-blend-difference">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="u-link hidden text-[11px] font-medium uppercase tracking-[0.25em] md:block"
            >
              Instagram ↗
            </a>
            <button
              onClick={() => {
                setOpen(false);
                cart?.setOpen(true);
              }}
              className="u-link text-[11px] font-semibold uppercase tracking-[0.25em]"
              aria-label={`cart ${cart?.count || 0}`}
            >
              {t('nav.cart')}{cart?.count ? ` (${cart.count})` : ''}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-11 w-11 flex-col items-end justify-center gap-[7px]"
            >
              <span
                className={`h-px bg-bone transition-all duration-500 ease-swift ${open ? 'w-7 translate-y-[4px] rotate-45' : 'w-7'}`}
              />
              <span
                className={`h-px bg-bone transition-all duration-500 ease-swift ${open ? 'w-7 -translate-y-[4px] -rotate-45' : 'w-5'}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* full-screen menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[180] hidden flex-col justify-between bg-ink px-5 pb-10 pt-32 text-bone sm:px-8"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <nav className="flex flex-col gap-2">
          {MENU.map((l, i) => (
            <span key={l.label} className="mask">
              <a
                href={l.href}
                onClick={l.id ? (e) => onAnchor(e, l.id) : undefined}
                className="menu-link group flex items-baseline gap-5 text-left"
              >
                <span className="text-[10px] tracking-[0.3em] text-bone/40">00{i + 1}</span>
                <span className="font-serif text-5xl leading-[1.05] transition-colors duration-300 group-hover:text-bone/60 sm:text-7xl">
                  {l.label}
                </span>
              </a>
            </span>
          ))}
        </nav>

        <div className="flex flex-col gap-6 border-t border-bone/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <LangSwitch className="menu-meta text-bone lg:hidden" />
          <div className="menu-meta">
            <p className="text-[10px] uppercase tracking-mega text-bone/40">Follow the movement</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="u-link mt-2 inline-block font-serif text-2xl italic"
            >
              {site.handle}
            </a>
          </div>
          <div className="menu-meta text-[11px] uppercase tracking-[0.25em] text-bone/40">
            {site.city} — Worldwide · Est. {site.est}
          </div>
        </div>
      </div>
    </>
  );
}
