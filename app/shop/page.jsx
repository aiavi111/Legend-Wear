'use client';

import { useState } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import { LangProvider, useLang } from '@/lib/i18n';
import CartProvider, { useCart } from '@/components/CartContext';
import CartDrawer from '@/components/CartDrawer';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useGsap, gsap } from '@/lib/gsapClient';
import { products } from '@/lib/site';

function Catalog() {
  const { favs } = useCart();
  const { t } = useLang();
  const [onlyFav, setOnlyFav] = useState(false);
  const list = onlyFav ? products.filter((p) => favs.includes(p.id)) : products;

  useGsap(() => {
    gsap.fromTo(
      '.cat-reveal',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.15 },
    );
  }, []);

  return (
    <main className="min-h-[100svh] px-5 pb-28 pt-28 sm:px-8 sm:pt-36">
      <header className="cat-reveal">
        <p className="mb-5 text-[10px] uppercase tracking-mega text-ember">{t('shop.label')}</p>
        <h1 className="leading-[0.95]">
          <span className="block text-[14vw] font-extrabold uppercase tracking-[-0.02em] sm:text-8xl">
            {t('shop.title')}
          </span>
          <span className="block font-serif text-[7vw] italic text-smoke sm:text-4xl">{t('shop.tagline')}</span>
        </h1>
      </header>

      <div className="cat-reveal mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5 sm:mt-14">
        <p className="text-[11px] uppercase tracking-[0.25em] text-smoke">
          {list.length} {t('shop.pieces')}
        </p>
        <div className="flex gap-2" role="group" aria-label="filter">
          <button
            onClick={() => setOnlyFav(false)}
            aria-pressed={!onlyFav}
            className={`border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 ${
              !onlyFav ? 'border-ink bg-ink text-bone' : 'border-line text-smoke hover:border-ink hover:text-ink'
            }`}
          >
            {t('shop.all')}
          </button>
          <button
            onClick={() => setOnlyFav(true)}
            aria-pressed={onlyFav}
            className={`flex items-center gap-2 border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 ${
              onlyFav ? 'border-ink bg-ink text-bone' : 'border-line text-smoke hover:border-ink hover:text-ink'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
              <path d="M12 20.7C7.05 16.6 3.6 13.42 3.6 9.9 3.6 7.2 5.7 5 8.4 5c1.5 0 2.9.72 3.6 1.9C12.7 5.72 14.1 5 15.6 5c2.7 0 4.8 2.2 4.8 4.9 0 3.52-3.45 6.7-8.4 10.8Z" />
            </svg>
            {t('shop.favorites')}{favs.length ? ` (${favs.length})` : ''}
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-28 text-center">
          <p className="font-serif text-2xl italic text-smoke">{t('shop.noFav')}</p>
          <p className="max-w-xs text-xs leading-relaxed text-smoke">{t('shop.noFavHint')}</p>
          <button
            onClick={() => setOnlyFav(false)}
            className="mt-2 border border-ink px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ease-swift hover:bg-ink hover:text-bone"
          >
            {t('shop.browseAll')}
          </button>
        </div>
      ) : (
        <div className="cat-reveal mt-10 grid grid-cols-1 gap-x-6 gap-y-16 sm:mt-12 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} total={products.length} wide />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ShopPage() {
  return (
    <LangProvider>
      <SmoothScroll>
        <CartProvider>
          <Nav />
          <Catalog />
          <Footer />
          <CartDrawer />
        </CartProvider>
      </SmoothScroll>
    </LangProvider>
  );
}
