'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { useLang } from '@/lib/i18n';

export default function ProductCard({ p, total, wide = false }) {
  const { add, setOpen, favs, toggleFav } = useCart();
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);
  const faved = favs?.includes(p.id);
  const stock = typeof p.stock === 'number' ? p.stock : null;
  const soldOut = p.status === 'Sold out' || stock === 0;

  const onAdd = () => {
    if (soldOut) return;
    add(p.id, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className={`group ${wide ? 'w-full' : 'w-[80vw] shrink-0 snap-start sm:w-[52vw] lg:w-[30vw]'}`}>
      {/* gallery */}
      <figure className="relative aspect-[3/4] overflow-hidden bg-bone-2">
        {p.images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={i === 0 ? p.alt : ''}
            aria-hidden={i !== 0}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-swift ${
              i === idx
                ? `opacity-100 ${idx === 0 ? 'lg:group-hover:opacity-0' : ''}`
                : i === 1 && idx === 0
                  ? 'opacity-0 lg:group-hover:opacity-100 lg:group-hover:scale-[1.03]'
                  : 'opacity-0'
            }`}
          />
        ))}
        <figcaption className="absolute left-4 top-4 bg-bone/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-ink backdrop-blur-sm">
          {t(`status.${p.status}`)}
          {stock !== null && stock > 0 && stock <= 5 && ` · ${t('card.left')} ${stock}`}
        </figcaption>
        {/* like */}
        <button
          onClick={() => toggleFav(p.id)}
          aria-pressed={faved}
          aria-label="favorite"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center bg-bone/85 backdrop-blur-sm transition-transform duration-300 ease-swift hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 transition-colors duration-300 ${faved ? 'fill-ember stroke-ember' : 'fill-transparent stroke-ink'}`}
            strokeWidth="1.6"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20.7C7.05 16.6 3.6 13.42 3.6 9.9 3.6 7.2 5.7 5 8.4 5c1.5 0 2.9.72 3.6 1.9C12.7 5.72 14.1 5 15.6 5c2.7 0 4.8 2.2 4.8 4.9 0 3.52-3.45 6.7-8.4 10.8Z" />
          </svg>
        </button>
        <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.3em] text-bone mix-blend-difference">
          {p.id} / 00{total}
        </span>
      </figure>

      {/* thumbnails */}
      <div className="mt-3 flex flex-wrap gap-2">
        {p.images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setIdx(i)}
            aria-label={`photo ${i + 1}`}
            className={`w-12 overflow-hidden bg-bone-2 transition-opacity duration-300 aspect-[3/4] border ${
              idx === i ? 'border-ink opacity-100' : 'border-line opacity-50 hover:opacity-80'
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-extrabold uppercase tracking-[-0.01em] sm:text-2xl">
            {p.name} <span className="font-serif font-normal normal-case italic tracking-normal">{p.colorway}</span>
          </h3>
          <p className="whitespace-nowrap text-lg font-extrabold tabular-nums">{p.price}</p>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-smoke">{p.type} · {p.fabric}</p>
        <p className="mt-2.5 text-xs leading-relaxed text-smoke">{p.desc}</p>

        {/* sizes */}
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em]">{t('card.selectSize')}</p>
        <div className="mt-2.5 flex gap-2" role="group" aria-label="size">
          {p.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`h-11 flex-1 border text-[12px] font-semibold tracking-wider transition-colors duration-300 sm:max-w-[64px] ${
                size === s ? 'border-ink bg-ink text-bone' : 'border-line text-smoke hover:border-ink hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* actions */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={onAdd}
            disabled={soldOut}
            className={`flex-1 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] transition-all duration-500 ease-swift ${
              soldOut
                ? 'cursor-not-allowed bg-line text-smoke'
                : added
                  ? 'bg-ember text-bone'
                  : 'bg-ink text-bone hover:opacity-85'
            }`}
          >
            {soldOut ? t('card.soldOut') : added ? t('card.added') : t('card.addToCart')}
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label="cart"
            className="u-link whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.25em]"
          >
            {t('card.cart')}
          </button>
        </div>
      </div>
    </article>
  );
}
