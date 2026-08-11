'use client';

import { useRef } from 'react';
import { useGsap, gsap, scrollToId } from '@/lib/gsapClient';
import { site } from '@/lib/site';
import { useLang } from '@/lib/i18n';
import LangSwitch from '@/components/LangSwitch';

export default function Footer() {
  const root = useRef(null);
  const { t } = useLang();

  useGsap(() => {
    gsap.fromTo(
      '.ft-mark',
      { yPercent: 45, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      },
    );
  }, []);

  return (
    <footer ref={root} className="bg-ink text-bone">
      <div className="overflow-hidden px-2 pt-20 sm:pt-28">
        <p className="ft-mark text-center font-serif text-[20vw] uppercase leading-[0.8] tracking-[0.04em]" aria-hidden="true">
          Legend
        </p>
      </div>

      <div className="mt-16 grid gap-12 border-t border-bone/15 px-5 py-14 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl italic">{site.tagline}</p>
          <p className="mt-4 whitespace-pre-line text-xs leading-relaxed text-bone/50">{t('footer.sub')}</p>
          <LangSwitch className="mt-6 text-bone" />
        </div>

        <nav aria-label="Footer" className="flex flex-col items-start gap-3 text-[11px] uppercase tracking-[0.25em]">
          <a href="/shop" className="u-link">{t('footer.shop')}</a>
          <button onClick={() => scrollToId('story')} className="u-link">{t('footer.about')}</button>
          <a href="#delivery" onClick={(e) => { e.preventDefault(); scrollToId('delivery'); }} className="u-link">
            {t('footer.delivery')}
          </a>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="u-link">
            Instagram ↗
          </a>
        </nav>

        <div id="delivery">
          <p className="text-[10px] uppercase tracking-mega text-bone/40">{t('footer.delivery')}</p>
          <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-bone/60">{t('footer.deliveryText')}</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-mega text-bone/40">{t('footer.contact')}</p>
          <a href={`mailto:${site.email}`} className="u-link mt-3 inline-block text-xs text-bone/60">
            {site.email}
          </a>
          <br />
          <a href={site.instagram} target="_blank" rel="noreferrer" className="u-link mt-2 inline-block text-xs text-bone/60">
            {site.handle}
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-bone/15 px-5 py-6 text-[10px] uppercase tracking-[0.25em] text-bone/40 sm:flex-row sm:px-8">
        <p>© {site.est} {site.name} — {t('footer.rights')}</p>
        <p>{site.city} · Worldwide</p>
      </div>
    </footer>
  );
}
