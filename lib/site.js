/* -------------------------------------------------------------------------
   LEGEND WEAR — single source of truth for all content & imagery.
   Products live in lib/products.json — editable from the /admin page.
   ------------------------------------------------------------------------- */

import productsData from './products.json';

export const site = {
  name: 'Legend Wear',
  tagline: 'Create your legend.',
  slogan: 'Since day one — earn your legacy.',
  handle: '@legendwear.kg',
  instagram: 'https://www.instagram.com/legendwear.kg/',
  email: 'hello@legendwear.kg',
  city: 'Bishkek',
  est: '2026',
};

/* HERO — sunset over the water */
export const hero = {
  image: '/campaign-sunset.jpg',
  alt: 'Sunset over calm water — golden horizon over the lake',
};

/* DROP 001 — products come from lib/products.json (edit via /admin).
   images[0] = clean product mockup, images[1..] = worn campaign shots. */
export const products = productsData;

/* CRAFT — the detail section (sticky image + spec rows) */
export const craft = [
  {
    n: '01',
    title: 'Heavyweight 240 GSM cotton',
    text: 'Dense, structured fabric that holds its shape. Feels substantial the second you put it on.',
    caption: 'Detail 01 — Fabric & mark',
    image: '/mockup-black-folded.jpg',
  },
  {
    n: '02',
    title: 'True oversized cut',
    text: 'Dropped shoulders, boxy body, considered length. Designed on real people, not mannequins.',
    caption: 'Detail 02 — Silhouette',
    image: '/detail-fit.jpg',
  },
  {
    n: '03',
    title: 'Signature artwork',
    text: 'Hand-drawn cherry blossom and script graphics, pressed deep into the fabric — made to outlast the hype.',
    caption: 'Detail 03 — Print',
    image: '/detail-print.jpg',
  },
  {
    n: '04',
    title: 'Numbered limited runs',
    text: 'Small batches. Every drop is finite and never restocked. When it is gone — it is gone.',
    caption: 'Detail 04 — Scarcity',
    image: '/mockup-bloom-folded.jpg',
  },
];

/* STORY — cinematic band */
export const story = {
  image: '/story-night.jpg',
  alt: 'Legend Script Tee at night in front of a lit beachfront hotel',
  caption: 'Bishkek to the Maldives — since day one',
};

/* COMMUNITY — real people, real places */
export const community = [
  { img: '/comm-1.jpg', alt: 'Arms wide to the open ocean in the black Script Tee', speed: 1 },
  { img: '/comm-2.jpg', alt: 'Black Script Tee under beach umbrellas', speed: 1.18 },
  { img: '/editorial-mountains.jpg', alt: 'Bloom Tee back print against Kyrgyz mountains', speed: 0.92 },
  { img: '/comm-4.jpg', alt: 'Arms wide on a boat deck in a Legend tee', speed: 1.12 },
  { img: '/comm-5.jpg', alt: 'Night beach in the black Script Tee', speed: 0.95 },
  { img: '/campaign-beach.jpg', alt: 'Legend Wear on the bow of a boat approaching an island beach', speed: 1.08 },
];
