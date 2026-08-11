import { NextResponse } from 'next/server';

/* Принимает заказ с сайта и дописывает его в data/orders.json репозитория.
   Нужен секрет GH_TOKEN в Vercel (Settings → Environment Variables). */

const OWNER = 'aiavi111';
const REPO = 'Legend-Wear';
const BRANCH = 'main';
const FILE = 'data/orders.json';

const gh = (token) => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const s = (v, max) => String(v ?? '').slice(0, max).trim();

export async function POST(req) {
  const token = process.env.GH_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: 'GH_TOKEN is not configured' }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const name = s(body.name, 80);
  const phone = s(body.phone, 40);
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: 'name and phone required' }, { status: 400 });
  }
  const items = Array.isArray(body.items)
    ? body.items.slice(0, 30).map((i) => ({
        id: s(i.id, 10),
        name: s(i.name, 60),
        colorway: s(i.colorway, 40),
        size: s(i.size, 6),
        qty: Math.max(1, Math.min(99, Number(i.qty) || 1)),
        price: Math.max(0, Number(i.price) || 0),
      }))
    : [];
  if (!items.length) {
    return NextResponse.json({ ok: false, error: 'empty order' }, { status: 400 });
  }

  const order = {
    id: Date.now(),
    ts: new Date().toISOString(),
    status: 'new',
    name,
    phone,
    address: s(body.address, 200),
    comment: s(body.comment, 300),
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
  };

  const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`;

  try {
    /* читаем текущие заказы */
    let orders = [];
    let sha;
    const cur = await fetch(`${api}?ref=${BRANCH}`, { headers: gh(token), cache: 'no-store' });
    if (cur.ok) {
      const data = await cur.json();
      sha = data.sha;
      try {
        orders = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
        if (!Array.isArray(orders)) orders = [];
      } catch {
        orders = [];
      }
    }

    orders.unshift(order);
    if (orders.length > 500) orders = orders.slice(0, 500);

    const put = await fetch(api, {
      method: 'PUT',
      headers: gh(token),
      body: JSON.stringify({
        message: `Order ${order.id} (${name})`,
        content: Buffer.from(JSON.stringify(orders, null, 2) + '\n', 'utf8').toString('base64'),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!put.ok) throw new Error(`github ${put.status}`);

    return NextResponse.json({ ok: true, id: order.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e.message || e) }, { status: 502 });
  }
}
