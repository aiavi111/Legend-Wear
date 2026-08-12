'use client';

/* -------------------------------------------------------------------------
   LEGEND WEAR — ADMIN
   Вкладки: Товары · Заказы · Настройки (QR).
   Всё хранится в репозитории через GitHub API, сайт пересобирается сам.
   Сменить пароль: в консоли на /admin выполнить lwHash('новый пароль')
   и заменить PASS_HASH ниже.
   ------------------------------------------------------------------------- */

import { useRef, useState } from 'react';
import bundledProducts from '@/lib/products.json';
import bundledSettings from '@/lib/settings.json';

const OWNER = 'aiavi111';
const REPO = 'Legend-Wear';
const BRANCH = 'main';
const F_PRODUCTS = 'lib/products.json';
const F_SETTINGS = 'lib/settings.json';
const F_ORDERS = 'data/orders.json';

const ADMIN_USER = 'legend';
const PASS_HASH = '261d08264e2a000fd602ae3e558c4c921b197b130e1847ce78a87d0f3d49d61d';

const STATUSES = ['In stock', 'Low stock', 'Last pieces', 'Sold out'];
const ALL_SIZES = ['S', 'M', 'L', 'XL'];
const fmt = (n) => Number(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сом';

const gh = (token) => ({ Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` });

const te = new TextEncoder();
const td = new TextDecoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const encode = (str) => btoa(String.fromCharCode(...te.encode(str)));

async function sha256hex(str) {
  const d = await crypto.subtle.digest('SHA-256', te.encode(str));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
if (typeof window !== 'undefined') window.lwHash = sha256hex;

async function deriveKey(pass, salt) {
  const km = await crypto.subtle.importKey('raw', te.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
  );
}
async function encryptToken(token, pass) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(token));
  localStorage.setItem('lw-admin-token-enc', JSON.stringify({ s: b64(salt), i: b64(iv), d: b64(data) }));
}
async function decryptToken(pass) {
  const raw = localStorage.getItem('lw-admin-token-enc');
  if (!raw) return null;
  try {
    const { s, i, d } = JSON.parse(raw);
    const key = await deriveKey(pass, unb64(s));
    return td.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(i) }, key, unb64(d)));
  } catch { return null; }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authErr, setAuthErr] = useState('');
  const passRef = useRef('');

  const [tab, setTab] = useState('products');
  const [token, setToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [products, setProducts] = useState(bundledProducts);
  const [settings, setSettings] = useState(bundledSettings);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

  /* ---------- github io ---------- */
  async function readFile(path, t = token) {
    const r = await fetch(`${api}/${path}?ref=${BRANCH}&_=${Date.now()}`, { headers: gh(t), cache: 'no-store' });
    if (!r.ok) return { data: null, sha: null, status: r.status };
    const j = await r.json();
    let data = null;
    try { data = JSON.parse(td.decode(unb64(j.content.replace(/\n/g, '')))); } catch {}
    return { data, sha: j.sha, status: 200 };
  }
  async function writeFile(path, obj, message, t = token) {
    const cur = await readFile(path, t);
    const r = await fetch(`${api}/${path}`, {
      method: 'PUT',
      headers: gh(t),
      body: JSON.stringify({
        message,
        content: encode(JSON.stringify(obj, null, 2) + '\n'),
        branch: BRANCH,
        ...(cur.sha ? { sha: cur.sha } : {}),
      }),
    });
    if (!r.ok) throw new Error(`GitHub: ${r.status}`);
  }

  async function login(e) {
    e.preventDefault();
    setAuthErr('');
    if (loginUser.trim().toLowerCase() !== ADMIN_USER || (await sha256hex(loginPass)) !== PASS_HASH) {
      setAuthErr('Неверный логин или пароль.');
      return;
    }
    passRef.current = loginPass;
    setAuthed(true);
    const saved = await decryptToken(loginPass);
    if (saved) { setToken(saved); connect(saved); }
  }

  function logout() {
    passRef.current = '';
    setAuthed(false); setConnected(false); setToken(''); setLoginPass(''); setMsg('');
  }

  async function connect(t = token) {
    setBusy(true); setMsg('Подключаюсь…');
    try {
      const p = await readFile(F_PRODUCTS, t);
      if (p.status === 401) throw new Error('Неверный токен');
      if (p.data) setProducts(p.data.map((x) => ({ ...x, images: x.images?.length ? x.images : [''] })));
      const s = await readFile(F_SETTINGS, t);
      if (s.data) setSettings(s.data);
      const o = await readFile(F_ORDERS, t);
      setOrders(Array.isArray(o.data) ? o.data : []);
      if (passRef.current) await encryptToken(t, passRef.current);
      setConnected(true); setDirty(false);
      setMsg('Подключено ✓');
    } catch (e) { setMsg(`Ошибка: ${e.message}`); setConnected(false); }
    setBusy(false);
  }

  async function saveProducts() {
    setBusy(true); setMsg('Сохраняю…');
    try {
      const clean = products.map((p, i) => ({
        ...p,
        id: String(i + 1).padStart(3, '0'),
        priceNum: Number(p.priceNum) || 0,
        price: fmt(p.priceNum),
        stock: Math.max(0, Number(p.stock) || 0),
        images: p.images.filter(Boolean),
        alt: p.alt || `${p.name} ${p.colorway}`,
      }));
      await writeFile(F_PRODUCTS, clean, 'Update products via admin');
      setProducts(clean.map((p) => ({ ...p, images: p.images.length ? p.images : [''] })));
      setDirty(false);
      setMsg('Сохранено ✓ Сайт обновится через ~2 мин.');
    } catch (e) { setMsg(`Ошибка: ${e.message}`); }
    setBusy(false);
  }

  async function saveSettings(next = settings) {
    setBusy(true); setMsg('Сохраняю настройки…');
    try {
      await writeFile(F_SETTINGS, next, 'Update settings via admin');
      setSettings(next);
      setMsg('Настройки сохранены ✓');
    } catch (e) { setMsg(`Ошибка: ${e.message}`); }
    setBusy(false);
  }

  async function uploadFile(file, onDone) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const name = `up-${Date.now()}.${ext}`;
    const buf = await file.arrayBuffer();
    let bin = '';
    new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
    const r = await fetch(`${api}/public/${name}`, {
      method: 'PUT', headers: gh(token),
      body: JSON.stringify({ message: `Add ${name}`, content: btoa(bin), branch: BRANCH }),
    });
    if (!r.ok) throw new Error(`GitHub: ${r.status}`);
    onDone(`/${name}`);
  }

  async function uploadImage(pi, ii, file) {
    if (!connected) {
      setMsg('Сначала подключите GitHub-токен вверху страницы ↑');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setBusy(true); setMsg('Загружаю фото…');
    try {
      await uploadFile(file, (path) => setImg(pi, ii, path));
      setMsg('Фото загружено ✓ Нажмите «Сохранить».');
    } catch (e) { setMsg(`Ошибка: ${e.message}`); }
    setBusy(false);
  }

  async function uploadQR(file) {
    if (!connected) {
      setMsg('Сначала подключите GitHub-токен вверху страницы ↑');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setBusy(true); setMsg('Загружаю QR…');
    try {
      await uploadFile(file, async (path) => {
        const next = { ...settings, qrImage: path };
        setSettings(next);
        await writeFile(F_SETTINGS, next, 'Update payment QR');
        setMsg('QR обновлён ✓ Сайт пересоберётся через ~2 мин.');
      });
    } catch (e) { setMsg(`Ошибка: ${e.message}`); }
    setBusy(false);
  }

  /* ---------- orders ---------- */
  async function setOrderStatus(id, status) {
    setBusy(true); setMsg('Обновляю заказ…');
    try {
      const fresh = await readFile(F_ORDERS);
      const list = Array.isArray(fresh.data) ? fresh.data : orders;
      const order = list.find((o) => o.id === id);
      const next = list.map((o) => (o.id === id ? { ...o, status } : o));
      await writeFile(F_ORDERS, next, `Order ${id} → ${status}`);
      setOrders(next);

      /* при подтверждении списываем остатки */
      if (status === 'confirmed' && order && order.status !== 'confirmed') {
        const p = await readFile(F_PRODUCTS);
        const list2 = (p.data || products).map((prod) => {
          const sold = order.items
            .filter((i) => i.id === prod.id || i.name === prod.name)
            .reduce((s, i) => s + i.qty, 0);
          if (!sold) return prod;
          const stock = Math.max(0, (Number(prod.stock) || 0) - sold);
          return { ...prod, stock, status: stock === 0 ? 'Sold out' : stock <= 3 ? 'Last pieces' : prod.status };
        });
        await writeFile(F_PRODUCTS, list2, `Stock update after order ${id}`);
        setProducts(list2.map((x) => ({ ...x, images: x.images?.length ? x.images : [''] })));
        setMsg('Заказ подтверждён ✓ Остатки списаны.');
      } else {
        setMsg('Статус обновлён ✓');
      }
    } catch (e) { setMsg(`Ошибка: ${e.message}`); }
    setBusy(false);
  }

  /* ---------- product helpers ---------- */
  const touch = () => setDirty(true);
  const update = (i, field, value) => {
    setProducts((prev) => prev.map((p, x) => (x === i ? { ...p, [field]: value } : p)));
    touch();
  };
  const setImg = (i, ii, val) => update(i, 'images', products[i].images.map((img, x) => (x === ii ? val : img)));
  const addImg = (i) => update(i, 'images', [...products[i].images, '']);
  const delImg = (i, ii) => update(i, 'images', products[i].images.filter((_, x) => x !== ii));
  const moveImg = (i, ii, dir) => {
    const arr = [...products[i].images];
    const j = ii + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[ii], arr[j]] = [arr[j], arr[ii]];
    update(i, 'images', arr);
  };
  const toggleOpen = (i) => setExpanded((prev) => {
    const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n;
  });
  const addProduct = () => {
    setProducts((prev) => [{
      id: '000', name: 'NEW TEE', colorway: 'Black', type: 'Oversized tee',
      desc: 'Описание товара.', fabric: 'Premium cotton · 240 GSM',
      sizes: ['S', 'M', 'L', 'XL'], price: '2 900 сом', priceNum: 2900,
      status: 'In stock', stock: 10, images: [''], alt: '',
    }, ...prev]);
    setExpanded(new Set([0])); touch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMsg('Новый товар сверху — заполните и сохраните.');
  };
  const removeProduct = (i) => {
    if (confirm('Удалить этот товар?')) { setProducts((prev) => prev.filter((_, x) => x !== i)); touch(); }
  };
  const move = (i, dir) => {
    setProducts((prev) => {
      const n = [...prev]; const j = i + dir;
      if (j < 0 || j >= n.length) return prev;
      [n[i], n[j]] = [n[j], n[i]]; return n;
    });
    touch();
  };

  const imgSrc = (path) => !path ? '' : path.startsWith('/')
    ? `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/public${path}` : path;

  const input = 'w-full border border-line bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink';
  const label = 'mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-smoke';

  /* ---------- stats ---------- */
  const newOrders = orders.filter((o) => o.status === 'new').length;
  const confirmed = orders.filter((o) => o.status === 'confirmed');
  const revenue = confirmed.reduce((s, o) => s + (o.total || 0), 0);
  const soldCount = confirmed.reduce((s, o) => s + o.items.reduce((x, i) => x + i.qty, 0), 0);
  const stockLeft = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);

  /* ---------- login ---------- */
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-bone">
        <form onSubmit={login} className="w-full max-w-sm border border-bone/15 p-8">
          <p className="font-serif text-sm tracking-[0.4em]">LEGEND WEAR</p>
          <h1 className="mt-2 text-2xl font-extrabold uppercase">Админка</h1>
          <label className="mt-8 block text-[10px] uppercase tracking-[0.25em] text-bone/50">Логин</label>
          <input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} autoComplete="username"
            className="mt-2 w-full border border-bone/25 bg-transparent px-3 py-3 text-sm outline-none focus:border-bone" />
          <label className="mt-5 block text-[10px] uppercase tracking-[0.25em] text-bone/50">Пароль</label>
          <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} autoComplete="current-password"
            className="mt-2 w-full border border-bone/25 bg-transparent px-3 py-3 text-sm outline-none focus:border-bone" />
          {authErr && <p className="mt-4 text-xs text-ember" role="alert">{authErr}</p>}
          <button type="submit" className="mt-7 w-full bg-bone py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink transition-opacity hover:opacity-85">
            Войти
          </button>
          <a href="/" className="mt-5 block text-center text-[10px] uppercase tracking-[0.25em] text-bone/40 hover:text-bone">← На сайт</a>
        </form>
      </main>
    );
  }

  const TABS = [
    ['products', 'Товары'],
    ['orders', `Заказы${newOrders ? ` (${newOrders})` : ''}`],
    ['settings', 'Настройки'],
  ];

  return (
    <main className="min-h-screen bg-bone pb-28 text-ink">
      {/* sticky bar */}
      <div className="sticky top-0 z-50 border-b border-line bg-bone/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <p className="mr-auto font-serif text-xs tracking-[0.35em]">LEGEND ADMIN</p>
          {tab === 'products' && (
            <>
              <button onClick={addProduct} className="border border-ink px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone">
                + Товар
              </button>
              <button onClick={saveProducts} disabled={!connected || busy || !dirty}
                className="bg-ink px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-85 disabled:opacity-35">
                {busy ? '…' : dirty ? 'Сохранить' : 'Сохранено ✓'}
              </button>
            </>
          )}
          {tab !== 'products' && (
            <button onClick={() => connect()} disabled={!connected || busy}
              className="border border-ink px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone disabled:opacity-40">
              Обновить
            </button>
          )}
          <button onClick={logout} className="u-link text-[10px] uppercase tracking-[0.2em] text-smoke">Выйти</button>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 px-5 sm:px-8">
          {TABS.map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`border-b-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                tab === k ? 'border-ink text-ink' : 'border-transparent text-smoke hover:text-ink'}`}>
              {lbl}
            </button>
          ))}
        </div>
        {msg && <p className="mx-auto max-w-5xl px-5 pb-2 text-[11px] text-smoke sm:px-8" role="status">{msg}</p>}
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-8">
        {/* connect */}
        {!connected && (
          <section className="mb-8 border border-line p-5">
            <p className={label}>GitHub токен (шифруется паролем, хранится в этом браузере)</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_…" className={input} autoComplete="off" />
              <button onClick={() => connect()} disabled={busy || !token}
                className="whitespace-nowrap border border-ink px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors hover:bg-ink hover:text-bone disabled:opacity-40">
                Подключиться
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-smoke">
              github.com/settings/tokens → Generate new token (classic) → галочка <b>repo</b>.
            </p>
          </section>
        )}

        {/* ---------- ORDERS ---------- */}
        {tab === 'orders' && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Новых заказов', newOrders],
                ['Подтверждено', confirmed.length],
                ['Продано вещей', soldCount],
                ['Выручка', fmt(revenue)],
              ].map(([k, v]) => (
                <div key={k} className="border border-line p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-smoke">{k}</p>
                  <p className="mt-1.5 text-xl font-extrabold tabular-nums">{v}</p>
                </div>
              ))}
            </div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-smoke">Остаток на складе: {stockLeft} шт.</p>

            {orders.length === 0 ? (
              <p className="py-16 text-center font-serif text-xl italic text-smoke">Заказов пока нет.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((o) => (
                  <article key={o.id} className={`border p-4 ${o.status === 'new' ? 'border-ember' : 'border-line'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">
                          №{o.id} · {o.name}{' '}
                          <span className={`ml-2 text-[10px] uppercase tracking-[0.2em] ${
                            o.status === 'new' ? 'text-ember' : o.status === 'confirmed' ? 'text-ink' : 'text-smoke'}`}>
                            {o.status === 'new' ? 'новый' : o.status === 'confirmed' ? 'подтверждён' : 'отменён'}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-smoke">
                          <a href={`tel:${o.phone}`} className="u-link">{o.phone}</a>
                          {o.address ? ` · ${o.address}` : ''}
                        </p>
                        {o.comment && <p className="mt-1 text-xs italic text-smoke">«{o.comment}»</p>}
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke">
                          {new Date(o.ts).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <p className="text-lg font-extrabold tabular-nums">{fmt(o.total)}</p>
                    </div>

                    <div className="mt-3 flex gap-4 border-t border-line pt-3">
                      <ul className="flex-1 text-xs text-smoke">
                        {o.items.map((i, x) => (
                          <li key={x} className="flex justify-between py-0.5">
                            <span>{i.name} {i.colorway} · {i.size} × {i.qty}</span>
                            <span className="tabular-nums">{fmt(i.price * i.qty)}</span>
                          </li>
                        ))}
                      </ul>
                      {o.receipt ? (
                        <a href={imgSrc(o.receipt)} target="_blank" rel="noreferrer" className="shrink-0" title="Открыть чек">
                          <img src={imgSrc(o.receipt)} alt="Чек" className="h-24 w-20 border border-line bg-bone-2 object-cover transition-opacity hover:opacity-80" />
                          <span className="mt-1 block text-center text-[9px] uppercase tracking-[0.2em] text-smoke">чек ↗</span>
                        </a>
                      ) : (
                        <div className="flex h-24 w-20 shrink-0 items-center justify-center border border-dashed border-line text-center text-[9px] leading-tight text-smoke">
                          чека<br />нет
                        </div>
                      )}
                    </div>

                    {o.status === 'new' && (
                      <div className="mt-4 flex gap-3">
                        <button onClick={() => setOrderStatus(o.id, 'confirmed')} disabled={busy}
                          className="bg-ink px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-85 disabled:opacity-40">
                          Подтвердить
                        </button>
                        <button onClick={() => setOrderStatus(o.id, 'cancelled')} disabled={busy}
                          className="border border-ember px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ember transition-colors hover:bg-ember hover:text-bone disabled:opacity-40">
                          Отменить
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* ---------- SETTINGS ---------- */}
        {tab === 'settings' && (
          <section className="max-w-md border border-line p-5">
            <p className={label}>QR-код для оплаты</p>
            <img src={imgSrc(settings.qrImage)} alt="QR" className="w-full max-w-[260px] border border-line" />
            <label className="mt-4 block cursor-pointer border border-ink px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone">
              Загрузить новый QR
              <input type="file" accept="image/*" className="hidden" disabled={busy}
                onChange={(e) => e.target.files[0] && uploadQR(e.target.files[0])} />
            </label>
            <label className={`${label} mt-6`}>Подпись под QR (банки)</label>
            <input className={input} value={settings.payHint || ''}
              onChange={(e) => setSettings({ ...settings, payHint: e.target.value })} />
            <button onClick={() => saveSettings()} disabled={!connected || busy}
              className="mt-4 w-full bg-ink py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-bone transition-opacity hover:opacity-85 disabled:opacity-40">
              Сохранить настройки
            </button>
          </section>
        )}

        {/* ---------- PRODUCTS ---------- */}
        {tab === 'products' && (
          <div className="flex flex-col gap-3">
            {products.map((p, i) => {
              const isOpen = expanded.has(i);
              return (
                <section key={i} className="border border-line">
                  <button onClick={() => toggleOpen(i)} className="flex w-full items-center gap-4 p-3 text-left transition-colors hover:bg-bone-2/60" aria-expanded={isOpen}>
                    {p.images[0]
                      ? <img src={imgSrc(p.images[0])} alt="" className="h-16 w-12 shrink-0 bg-bone-2 object-cover" />
                      : <div className="flex h-16 w-12 shrink-0 items-center justify-center bg-bone-2 text-[9px] text-smoke">фото</div>}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold uppercase">
                        {p.name} <span className="font-serif font-normal normal-case italic">{p.colorway}</span>
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-smoke">
                        {fmt(p.priceNum)} · остаток {Number(p.stock) || 0} · {p.images.filter(Boolean).length} фото
                      </p>
                    </div>
                    <span className={`text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-line p-4">
                      <div className="mb-4 flex items-center justify-end gap-2">
                        <button onClick={() => move(i, -1)} className="border border-line px-3 py-1.5 text-xs hover:border-ink">↑</button>
                        <button onClick={() => move(i, 1)} className="border border-line px-3 py-1.5 text-xs hover:border-ink">↓</button>
                        <button onClick={() => removeProduct(i)}
                          className="border border-ember px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ember transition-colors hover:bg-ember hover:text-bone">
                          Удалить товар
                        </button>
                      </div>

                      <p className={label}>Фото (1-е — главное, 2-е — при наведении)</p>
                      {!connected && (
                        <button
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="mb-3 block w-full border border-ember/60 bg-ember/5 px-3 py-2 text-left text-[11px] text-ember"
                        >
                          ⚠ Токен не подключён — фото не загрузятся. Подключите его вверху страницы ↑
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {p.images.map((img, ii) => (
                          <div key={ii} className="border border-line p-2">
                            {img
                              ? <img src={imgSrc(img)} alt="" className="mb-2 aspect-[3/4] w-full bg-bone-2 object-cover" />
                              : (
                                <label className="mb-2 flex aspect-[3/4] w-full cursor-pointer items-center justify-center bg-bone-2 text-center text-[10px] leading-relaxed text-smoke hover:text-ink">
                                  нажмите,<br />чтобы выбрать
                                  <input type="file" accept="image/*" className="hidden" disabled={busy}
                                    onChange={(e) => e.target.files[0] && uploadImage(i, ii, e.target.files[0])} />
                                </label>
                              )}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] text-smoke">{ii + 1}</span>
                              <div className="flex gap-1">
                                <button onClick={() => moveImg(i, ii, -1)} className="border border-line px-1.5 py-0.5 text-[10px] hover:border-ink">←</button>
                                <button onClick={() => moveImg(i, ii, 1)} className="border border-line px-1.5 py-0.5 text-[10px] hover:border-ink">→</button>
                                {img && (
                                  <label className="cursor-pointer border border-line px-1.5 py-0.5 text-[10px] hover:border-ink" title="Заменить">
                                    ⟳
                                    <input type="file" accept="image/*" className="hidden" disabled={busy}
                                      onChange={(e) => e.target.files[0] && uploadImage(i, ii, e.target.files[0])} />
                                  </label>
                                )}
                                <button onClick={() => delImg(i, ii)} className="border border-line px-1.5 py-0.5 text-[10px] text-ember hover:border-ember">✕</button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addImg(i)}
                          className="flex aspect-[3/4] flex-col items-center justify-center gap-1.5 border border-dashed border-smoke text-smoke transition-colors hover:border-ink hover:text-ink">
                          <span className="text-3xl leading-none">+</span>
                          <span className="text-[9px] uppercase tracking-[0.15em]">Добавить фото</span>
                        </button>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={label}>Название</label>
                          <input className={input} value={p.name} onChange={(e) => update(i, 'name', e.target.value)} />
                        </div>
                        <div>
                          <label className={label}>Цвет / вариант</label>
                          <input className={input} value={p.colorway} onChange={(e) => update(i, 'colorway', e.target.value)} />
                        </div>
                        <div>
                          <label className={label}>Цена (сом)</label>
                          <input className={input} type="number" value={p.priceNum} onChange={(e) => update(i, 'priceNum', e.target.value)} />
                        </div>
                        <div>
                          <label className={label}>Остаток (шт.)</label>
                          <input className={input} type="number" value={p.stock ?? 0} onChange={(e) => update(i, 'stock', e.target.value)} />
                        </div>
                        <div>
                          <label className={label}>Статус</label>
                          <select className={input} value={p.status} onChange={(e) => update(i, 'status', e.target.value)}>
                            {STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={label}>Тип</label>
                          <input className={input} value={p.type} onChange={(e) => update(i, 'type', e.target.value)} />
                        </div>
                        <div>
                          <label className={label}>Размеры</label>
                          <div className="flex gap-2 pt-1">
                            {ALL_SIZES.map((s) => (
                              <button key={s}
                                onClick={() => update(i, 'sizes', p.sizes.includes(s) ? p.sizes.filter((x) => x !== s) : ALL_SIZES.filter((x) => p.sizes.includes(x) || x === s))}
                                className={`h-10 w-11 border text-[11px] font-semibold ${p.sizes.includes(s) ? 'border-ink bg-ink text-bone' : 'border-line text-smoke'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className={label}>Описание</label>
                          <textarea className={`${input} min-h-[70px]`} value={p.desc} onChange={(e) => update(i, 'desc', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
