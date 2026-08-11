'use client';

import { useEffect, useState } from 'react';
import { useCart, fmt } from '@/components/CartContext';
import { useLang } from '@/lib/i18n';
import { scrollToId } from '@/lib/gsapClient';
import { site } from '@/lib/site';
import settings from '@/lib/settings.json';

export default function CartDrawer() {
  const { items, count, total, open, setOpen, setQty, remove, clear } = useCart();
  const { t } = useLang();

  const [step, setStep] = useState('cart'); // cart | form | pay | done
  const [form, setForm] = useState({ name: '', phone: '', address: '', comment: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [receipt, setReceipt] = useState(''); // data URL

  const pickReceipt = (file) => {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setErr(t('cart.tooBig'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setReceipt(String(reader.result || ''));
      setErr('');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const close = () => {
    setOpen(false);
    if (step === 'done') {
      setStep('cart');
      setForm({ name: '', phone: '', address: '', comment: '' });
      setOrderId(null);
      setReceipt('');
    }
    setErr('');
  };

  async function sendOrder() {
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          receipt,
          items: items.map((i) => ({
            id: i.p.id,
            name: i.p.name,
            colorway: i.p.colorway,
            size: i.size,
            qty: i.qty,
            price: i.p.priceNum,
          })),
        }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || 'fail');
      setOrderId(data.id);
      setStep('done');
      clear();
    } catch {
      setErr(t('cart.err'));
    }
    setBusy(false);
  }

  const input =
    'w-full border border-line bg-transparent px-3 py-3 text-sm outline-none transition-colors placeholder:text-smoke/60 focus:border-ink';
  const label = 'mb-1.5 mt-4 block text-[10px] uppercase tracking-[0.2em] text-smoke';

  return (
    <>
      {/* scrim */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[210] bg-ink/50 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-label={t('cart.title')}
        className={`fixed right-0 top-0 z-[220] flex h-full w-full max-w-md flex-col bg-bone text-ink transition-transform duration-500 ease-swift ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">
            {t('cart.title')} {count > 0 && step === 'cart' && <span className="text-smoke">({count})</span>}
          </p>
          <button onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center text-xl transition-transform duration-300 hover:rotate-90">
            ✕
          </button>
        </header>

        {/* ---------- DONE ---------- */}
        {step === 'done' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-serif text-3xl italic">{t('cart.doneTitle')}</p>
            <p className="text-sm leading-relaxed text-smoke">{t('cart.doneText', { id: orderId })}</p>
            <button onClick={close} className="mt-3 border border-ink px-9 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors hover:bg-ink hover:text-bone">
              OK
            </button>
          </div>
        )}

        {/* ---------- EMPTY ---------- */}
        {step === 'cart' && items.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-serif text-2xl italic text-smoke">{t('cart.empty')}</p>
            <button
              onClick={() => {
                close();
                setTimeout(() => scrollToId('drop'), 500);
              }}
              className="border border-ink px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ease-swift hover:bg-ink hover:text-bone"
            >
              {t('cart.goDrop')}
            </button>
          </div>
        )}

        {/* ---------- CART ---------- */}
        {step === 'cart' && items.length > 0 && (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 border-b border-line py-5">
                  <img src={i.p.images[0]} alt={i.p.alt} className="w-20 shrink-0 self-start bg-bone-2 object-cover aspect-[3/4]" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-bold uppercase">
                        {i.p.name} <span className="font-serif font-normal normal-case italic">{i.p.colorway}</span>
                      </p>
                      <p className="text-sm font-semibold tabular-nums">{fmt(i.p.priceNum * i.qty)}</p>
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-smoke">{t('cart.size')} {i.size}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="−" className="h-9 w-9 hover:bg-bone-2">−</button>
                        <span className="w-8 text-center text-sm tabular-nums">{i.qty}</span>
                        <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="+" className="h-9 w-9 hover:bg-bone-2">+</button>
                      </div>
                      <button onClick={() => remove(i.key)} className="u-link text-[10px] uppercase tracking-[0.25em] text-smoke">
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-line px-6 py-6">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-smoke">{t('cart.total')}</p>
                <p className="text-xl font-extrabold tabular-nums">{fmt(total)}</p>
              </div>
              <button
                onClick={() => setStep('form')}
                className="mt-5 w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-bone transition-opacity duration-300 hover:opacity-85"
              >
                {t('cart.checkout')} →
              </button>
            </footer>
          </>
        )}

        {/* ---------- FORM ---------- */}
        {step === 'form' && (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <button onClick={() => setStep('cart')} className="u-link text-[10px] uppercase tracking-[0.25em] text-smoke">
              {t('cart.back')}
            </button>
            <label className={label}>{t('cart.name')} *</label>
            <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            <label className={label}>{t('cart.phone')} *</label>
            <input className={input} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+996" autoComplete="tel" />
            <label className={label}>{t('cart.address')}</label>
            <input className={input} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} autoComplete="street-address" />
            <label className={label}>{t('cart.comment')}</label>
            <textarea className={`${input} min-h-[70px]`} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
            {err && <p className="mt-3 text-xs text-ember" role="alert">{err}</p>}
            <button
              onClick={() => {
                if (!form.name.trim() || !form.phone.trim()) {
                  setErr(t('cart.required'));
                  return;
                }
                setErr('');
                setStep('pay');
              }}
              className="mt-6 w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-bone transition-opacity hover:opacity-85"
            >
              {t('cart.cont')} →
            </button>
          </div>
        )}

        {/* ---------- PAY ---------- */}
        {step === 'pay' && (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <button onClick={() => setStep('form')} className="u-link text-[10px] uppercase tracking-[0.25em] text-smoke">
              {t('cart.back')}
            </button>
            <p className="mt-5 text-center text-sm font-semibold">
              {t('cart.scan')} <span className="whitespace-nowrap text-lg font-extrabold">{fmt(total)}</span>
            </p>
            <img src={settings.qrImage} alt="QR для оплаты" className="mx-auto mt-4 w-full max-w-[280px] border border-line" />
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-smoke">{settings.payHint}</p>
            <p className="mt-4 text-center text-xs leading-relaxed text-smoke">{t('cart.payHint')}</p>

            {/* чек */}
            <div className="mt-5 border border-line p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-smoke">{t('cart.receipt')}</p>
              {receipt && (
                <img src={receipt} alt="" className="mt-3 max-h-56 w-full border border-line object-contain" />
              )}
              <label className="mt-3 block cursor-pointer border border-ink px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone">
                {receipt ? t('cart.change') : t('cart.attach')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickReceipt(e.target.files?.[0])}
                />
              </label>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-smoke">{t('cart.receiptHint')}</p>
            </div>
            {err && (
              <p className="mt-3 text-center text-xs text-ember" role="alert">
                {err}{' '}
                <a href={site.instagram} target="_blank" rel="noreferrer" className="underline">
                  Instagram ↗
                </a>
              </p>
            )}
            <button
              onClick={sendOrder}
              disabled={busy}
              className="mt-5 w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-bone transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {busy ? t('cart.sending') : t('cart.paid')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
