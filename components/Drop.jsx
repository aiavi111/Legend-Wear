'use client';

import { useRef } from 'react';
import { useGsap, gsap } from '@/lib/gsapClient';
import { products } from '@/lib/site';
import ProductCard from '@/components/ProductCard';
import { useLang } from '@/lib/i18n';

export default function Drop() {
  const root = useRef(null);
  const { t } = useLang();

  useGsap(() => {
    gsap.fromTo(
      '.drop-reveal',
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      },
    );
    gsap.fromTo(
      '.drop-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.drop-grid', start: 'top 82%' },
      },
    );
  }, []);

  return (
    <section ref={root} id="drop" className="border-t border-line">
      {/* collection header */}
      <header className="px-5 pb-12 pt-24 sm:px-8 sm:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-mega text-ember">{t('drop.limited')}</p>
            <h2 className="leading-[0.95]">
              <span className="mask">
                <span className="drop-reveal block text-[13vw] font-extrabold uppercase tracking-[-0.02em] sm:text-8xl">
                  Drop 001
                </span>
              </span>
              <span className="mask">
                <span className="drop-reveal block font-serif text-[8vw] normal-case italic text-smoke sm:text-5xl">
                  The Foundation Collection
                </span>
              </span>
            </h2>
          </div>
          <p className="max-w-[260px] pb-2 text-xs leading-relaxed text-smoke">{t('drop.blurb')}</p>
        </div>
      </header>

      {/* comfortable vertical grid — 1 col phone, 2 cols tablet & desktop */}
      <div className="drop-grid grid grid-cols-1 gap-x-8 gap-y-16 px-5 pb-8 sm:grid-cols-2 sm:px-8 lg:gap-x-12 lg:px-[7vw]">
        {products.map((p) => (
          <div key={p.id} className="drop-card">
            <ProductCard p={p} total={products.length} wide />
          </div>
        ))}
      </div>

      {/* full-width catalog entry */}
      <a
        href="/shop"
        className="group mt-12 flex items-center justify-between gap-6 border-y border-line px-5 py-8 transition-colors duration-500 ease-swift hover:bg-ink hover:text-bone sm:px-8 sm:py-10 lg:px-[7vw]"
      >
        <span className="text-xl font-extrabold uppercase tracking-[-0.01em] sm:text-3xl lg:text-4xl">
          {t('drop.openCatalog')}{' '}
          <span className="font-serif font-normal normal-case italic text-smoke transition-colors duration-500 group-hover:text-bone/60">
            {t('drop.catalogNote')}
          </span>
        </span>
        <span className="text-2xl transition-transform duration-500 ease-swift group-hover:translate-x-3 sm:text-4xl">
          →
        </span>
      </a>
    </section>
  );
}
