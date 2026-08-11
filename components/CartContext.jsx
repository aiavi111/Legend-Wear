'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products, site } from '@/lib/site';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сом';

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { key, id, size, qty }
  const [favs, setFavs] = useState([]); // product ids
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* persist */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lw-cart') || '[]');
      if (Array.isArray(saved)) setItems(saved);
      const savedFavs = JSON.parse(localStorage.getItem('lw-favs') || '[]');
      if (Array.isArray(savedFavs)) setFavs(savedFavs);
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem('lw-cart', JSON.stringify(items));
  }, [items, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem('lw-favs', JSON.stringify(favs));
  }, [favs, hydrated]);

  const toggleFav = (id) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const add = (id, size) => {
    const key = `${id}-${size}`;
    setItems((prev) => {
      const ex = prev.find((i) => i.key === key);
      if (ex) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { key, id, size, qty: 1 }];
    });
  };
  const setQty = (key, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  const remove = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);

  const detailed = useMemo(
    () =>
      items
        .map((i) => ({ ...i, p: products.find((p) => p.id === i.id) }))
        .filter((i) => i.p),
    [items],
  );
  const count = detailed.reduce((s, i) => s + i.qty, 0);
  const total = detailed.reduce((s, i) => s + i.p.priceNum * i.qty, 0);

  /* checkout — copies the order and opens Instagram DM flow */
  const checkout = async () => {
    const lines = detailed.map(
      (i) => `• ${i.p.name} ${i.p.colorway} — ${i.size} × ${i.qty} — ${fmt(i.p.priceNum * i.qty)}`,
    );
    const text = `LEGEND WEAR — ORDER\n${lines.join('\n')}\nTOTAL: ${fmt(total)}\n\nName:\nPhone:\nCity / address:`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    window.open(site.instagram, '_blank', 'noopener');
  };

  return (
    <CartCtx.Provider
      value={{ items: detailed, count, total, open, setOpen, add, setQty, remove, clear, checkout, favs, toggleFav }}
    >
      {children}
    </CartCtx.Provider>
  );
}
