# LEGEND WEAR — Create Your Legend

Premium streetwear site. Next.js 14 · Tailwind CSS · GSAP · Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # static site in /out — deploy anywhere (Vercel, Netlify, any hosting)
```

`out/index.html` also opens directly in a browser (internet needed for photos/fonts).

## Make it yours (everything is in one file)

**`lib/site.js`** holds ALL content: products, prices, sizes, texts, and every image path.

All photos are your real campaign shots, already optimized in `/public`. To swap or add:
drop a file into `/public` and point the path in `lib/site.js` (e.g. `'/new-shot.jpg'`).

- Hero → `campaign-hero.jpg` · Products → `front` + `back` (hover view)
- Craft details → `detail-*.jpg` · Story → `story-night.jpg` · Community → `comm-*.jpg`

## ВАЖНО: настройка приёма заказов (один раз)

Заказы приходят через серверный маршрут `/api/order`, ему нужен доступ к репозиторию:

1. Vercel → ваш проект → **Settings → Environment Variables**
2. Name: `GH_TOKEN`, Value: ваш GitHub-токен (classic, галочка **repo**), Environments: все три
3. Save → вкладка **Deployments** → у последнего деплоя **⋯ → Redeploy**

Без этой переменной кнопка «Я оплатил» вернёт ошибку.

## Языки

RU (по умолчанию), KY, EN. Переключатель — в шапке и в подвале. Все тексты в `lib/i18n.jsx`.

## Оплата по QR

QR-код и подпись меняются в админке (вкладка «Настройки»), файл `lib/settings.json`.
Покупатель: корзина → данные → QR → «Я оплатил» → заказ падает в `data/orders.json`.

## Admin panel — /admin

Open `yoursite.vercel.app/admin`. Paste a GitHub token (classic, `repo` scope) once —
it stays in that browser only. You can add / edit / delete / reorder products and upload
photos. "Сохранить всё" commits `lib/products.json` to GitHub → Vercel rebuilds the live
site automatically in ~2 minutes. Give your brother his own token from a GitHub account
that has access to the repo (Settings → Collaborators → add him).

## Other notes

- **Drop 002 email form** (`components/Teaser.jsx`) is UI-only. Wire it to Formspree /
  Mailchimp / Telegram bot before launch — marked with a NOTE in the code.
- **Cart / mini-shop**: customers pick size, add to cart (saved in the browser), and on
  checkout the full order text is copied to their clipboard while your Instagram opens —
  they just paste it in your DM. No payment backend needed.
- Colors/fonts: `tailwind.config.js` (bone / ink / smoke / ember, Bodoni Moda + Archivo —
  the serif matches your logo).
- Logo: `public/legend-mark.jpg` (also the favicon via `app/icon.jpg`).
- Animations respect `prefers-reduced-motion`.
