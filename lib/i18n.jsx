'use client';

/* Языки: ru (по умолчанию), ky, en. Тексты можно править прямо здесь. */

import { createContext, useContext, useEffect, useState } from 'react';

export const LANGS = ['ru', 'ky', 'en'];

const dict = {
  ru: {
    nav: { catalog: 'Каталог', drop: 'Дроп 001', story: 'История', community: 'Комьюнити', cart: 'Корзина' },
    hero: { shop: 'В магазин', shopCollection: 'Смотреть коллекцию', viewDrop: 'К дропу ↓' },
    drop: {
      limited: 'Лимитированный выпуск · Без рестоков',
      blurb: 'Четыре вещи. Одно заявление. Оверсайз-крой, маленькие нумерованные партии — что продано, то продано.',
      openCatalog: 'Открыть весь каталог',
      catalogNote: '— размеры, избранное, корзина',
    },
    card: { selectSize: 'Выберите размер', addToCart: 'В корзину +', added: 'Добавлено ✓', cart: 'Корзина →', soldOut: 'Продано', left: 'Осталось' },
    status: { 'In stock': 'В наличии', 'Low stock': 'Мало осталось', 'Last pieces': 'Последние', 'Sold out': 'Продано' },
    shop: {
      label: 'Дроп 001 · Полный каталог', title: 'Каталог', tagline: 'Жми на сердце. Выбирай своё.',
      pieces: 'товаров', all: 'Все', favorites: 'Избранное', noFav: 'Пока пусто.',
      noFavHint: 'Нажмите на сердечко на товаре — он появится здесь.', browseAll: 'Смотреть все',
    },
    cart: {
      title: 'Корзина', empty: 'Корзина пуста.', goDrop: 'К дропу 001', size: 'Размер', remove: 'Убрать', total: 'Итого',
      checkout: 'Оформить заказ', back: '← Назад',
      name: 'Имя', phone: 'Телефон', address: 'Город / адрес', comment: 'Комментарий (необязательно)', cont: 'Продолжить',
      scan: 'Отсканируйте QR и оплатите', payHint: 'После оплаты нажмите кнопку ниже — заказ улетит нам.',
      paid: 'Я оплатил(а) — отправить заказ', sending: 'Отправляю…',
      doneTitle: 'Заказ принят!', doneText: 'Номер заказа №{id}. Мы свяжемся с вами для подтверждения и доставки.',
      err: 'Не получилось отправить заказ. Напишите нам в Instagram — мы всё оформим.',
      required: 'Заполните имя и телефон',
    },
    teaser: { next: 'Дальше', soon: 'Будь первым. Подпишись.', email: 'Электронная почта', notify: 'Сообщить мне', onList: 'Вы в списке — ждите новостей.' },
    footer: {
      shop: 'Магазин', about: 'О бренде', delivery: 'Доставка', contact: 'Контакты',
      deliveryText: 'Бишкек — 1–2 дня.\nКыргызстан — 2–5 дней.\nМеждународная — 7–14 дней.',
      rights: 'Все права защищены', sub: 'Премиальные оверсайз-футболки.\nЛимитированные дропы. Без рестоков.',
    },
    story: {
      para: 'Для тех, кто выделяется, идёт своим путём и пишет собственную историю. Придумано в Бишкеке. Носится новым поколением — везде.',
      caption: 'Бишкек — Мальдивы. Since day one',
    },
    community: { follow: 'Подписаться в Instagram' },
    craft: {
      c1t: 'Плотный хлопок 240 GSM', c1d: 'Плотная, структурная ткань, которая держит форму. Чувствуется сразу, как надел.',
      c2t: 'Честный оверсайз', c2d: 'Спущенные плечи, свободный корпус, выверенная длина. Сидит на людях, а не на манекенах.',
      c3t: 'Фирменные принты', c3d: 'Рисованная сакура и script-логотип, глубокая печать — переживёт любой хайп.',
      c4t: 'Нумерованные партии', c4d: 'Маленькие тиражи. Каждый дроп конечен и не повторяется. Продано — значит продано.',
    },
  },
  ky: {
    nav: { catalog: 'Каталог', drop: 'Дроп 001', story: 'Тарых', community: 'Коомчулук', cart: 'Себет' },
    hero: { shop: 'Дүкөнгө', shopCollection: 'Коллекцияны көрүү', viewDrop: 'Дропко ↓' },
    drop: {
      limited: 'Чектелген чыгарылыш · Рестоксуз',
      blurb: 'Төрт буюм. Бир билдирүү. Оверсайз бычым, номерленген чакан партиялар — сатылып бүтсө, кайра болбойт.',
      openCatalog: 'Толук каталогду ачуу',
      catalogNote: '— өлчөмдөр, тандалмалар, себет',
    },
    card: { selectSize: 'Өлчөмдү тандаңыз', addToCart: 'Себетке +', added: 'Кошулду ✓', cart: 'Себет →', soldOut: 'Сатылып бүттү', left: 'Калды' },
    status: { 'In stock': 'Бар', 'Low stock': 'Аз калды', 'Last pieces': 'Акыркылары', 'Sold out': 'Сатылып бүттү' },
    shop: {
      label: 'Дроп 001 · Толук каталог', title: 'Каталог', tagline: 'Жүрөккө бас. Өзүңдүкүн танда.',
      pieces: 'буюм', all: 'Баары', favorites: 'Тандалмалар', noFav: 'Азырынча бош.',
      noFavHint: 'Буюмдагы жүрөктү басыңыз — ал ушул жерде пайда болот.', browseAll: 'Баарын көрүү',
    },
    cart: {
      title: 'Себет', empty: 'Себет бош.', goDrop: 'Дроп 001ге', size: 'Өлчөм', remove: 'Алып салуу', total: 'Жалпы',
      checkout: 'Заказ берүү', back: '← Артка',
      name: 'Атыңыз', phone: 'Телефон', address: 'Шаар / дарек', comment: 'Комментарий (милдеттүү эмес)', cont: 'Улантуу',
      scan: 'QR-кодду скандап, төлөңүз', payHint: 'Төлөгөндөн кийин төмөнкү баскычты басыңыз — заказ бизге келет.',
      paid: 'Төлөдүм — заказды жөнөтүү', sending: 'Жөнөтүлүүдө…',
      doneTitle: 'Заказ кабыл алынды!', doneText: 'Заказ №{id}. Ырастоо жана жеткирүү боюнча байланышабыз.',
      err: 'Заказ жөнөтүлгөн жок. Instagram аркылуу жазыңыз — баарын жасайбыз.',
      required: 'Атыңызды жана телефонду жазыңыз',
    },
    teaser: { next: 'Кийинки', soon: 'Биринчи бол. Кабарлаш.', email: 'Электрондук почта', notify: 'Мага кабарла', onList: 'Тизмедесиз — жаңылыктарды күтүңүз.' },
    footer: {
      shop: 'Дүкөн', about: 'Бренд жөнүндө', delivery: 'Жеткирүү', contact: 'Байланыш',
      deliveryText: 'Бишкек — 1–2 күн.\nКыргызстан — 2–5 күн.\nЭл аралык — 7–14 күн.',
      rights: 'Бардык укуктар корголгон', sub: 'Премиум оверсайз футболкалар.\nЧектелген дроптор. Рестоксуз.',
    },
    story: {
      para: 'Өзгөчөлөнгөндөр, өз жолу менен жүргөндөр жана өз тарыхын жазгандар үчүн. Бишкекте ойлонулган. Жаңы муун кийет — бардык жерде.',
      caption: 'Бишкек — Мальдивы. Since day one',
    },
    community: { follow: 'Instagram’да ээрчүү' },
    craft: {
      c1t: 'Тыгыз пахта 240 GSM', c1d: 'Форманы кармаган тыгыз, структуралуу кездеме. Кийгенде эле сезилет.',
      c2t: 'Чыныгы оверсайз', c2d: 'Түшүрүлгөн ийиндер, эркин бычым, такталган узундук. Манекенге эмес, адамга ылайыкталган.',
      c3t: 'Фирмалык принттер', c3d: 'Кол менен тартылган сакура жана script-логотип, терең басма — хайптан узак жашайт.',
      c4t: 'Номерленген партиялар', c4d: 'Чакан тираждар. Ар бир дроп чектүү жана кайталанбайт.',
    },
  },
  en: {
    nav: { catalog: 'Catalog', drop: 'Drop 001', story: 'Story', community: 'Community', cart: 'Cart' },
    hero: { shop: 'Shop', shopCollection: 'Shop collection', viewDrop: 'View the drop ↓' },
    drop: {
      limited: 'Limited release · Never restocked',
      blurb: 'Four pieces. One statement. Cut oversized, printed in small numbered runs — when it’s gone, it’s gone.',
      openCatalog: 'Open full catalog',
      catalogNote: '— sizes, favorites, cart',
    },
    card: { selectSize: 'Select size', addToCart: 'Add to cart +', added: 'Added ✓', cart: 'Cart →', soldOut: 'Sold out', left: 'Left' },
    status: { 'In stock': 'In stock', 'Low stock': 'Low stock', 'Last pieces': 'Last pieces', 'Sold out': 'Sold out' },
    shop: {
      label: 'Drop 001 · Full catalog', title: 'Catalog', tagline: 'Tap the heart. Choose your legend.',
      pieces: 'pieces', all: 'All', favorites: 'Favorites', noFav: 'No favorites yet.',
      noFavHint: 'Tap the heart on a piece you love and it will be waiting here.', browseAll: 'Browse all pieces',
    },
    cart: {
      title: 'Cart', empty: 'Your cart is empty.', goDrop: 'View Drop 001', size: 'Size', remove: 'Remove', total: 'Total',
      checkout: 'Checkout', back: '← Back',
      name: 'Name', phone: 'Phone', address: 'City / address', comment: 'Comment (optional)', cont: 'Continue',
      scan: 'Scan the QR and pay', payHint: 'After paying, tap the button below — we get your order instantly.',
      paid: 'I have paid — send order', sending: 'Sending…',
      doneTitle: 'Order received!', doneText: 'Order №{id}. We will contact you to confirm and arrange delivery.',
      err: 'Could not send the order. DM us on Instagram — we will sort it out.',
      required: 'Fill in name and phone',
    },
    teaser: { next: 'Next', soon: 'Be first. Join the list.', email: 'Email address', notify: 'Notify me', onList: 'You’re on the list — watch your inbox.' },
    footer: {
      shop: 'Shop', about: 'About', delivery: 'Delivery', contact: 'Contact',
      deliveryText: 'Bishkek — 1–2 days.\nKyrgyzstan — 2–5 days.\nWorldwide — 7–14 days.',
      rights: 'All rights reserved', sub: 'Premium oversized T-shirts.\nLimited drops. Never restocked.',
    },
    story: {
      para: 'Created for people who stand out, make their own path and write their own story. Designed in Bishkek. Worn by the new generation — everywhere.',
      caption: 'Bishkek to the Maldives — since day one',
    },
    community: { follow: 'Follow on Instagram' },
    craft: {
      c1t: 'Heavyweight 240 GSM cotton', c1d: 'Dense, structured fabric that holds its shape. Feels substantial the second you put it on.',
      c2t: 'True oversized cut', c2d: 'Dropped shoulders, boxy body, considered length. Designed on real people, not mannequins.',
      c3t: 'Signature artwork', c3d: 'Hand-drawn cherry blossom and script graphics, pressed deep — made to outlast the hype.',
      c4t: 'Numbered limited runs', c4d: 'Small batches. Every drop is finite and never restocked. When it’s gone — it’s gone.',
    },
  },
};

const LangCtx = createContext(null);
export const useLang = () => useContext(LangCtx);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('ru');

  useEffect(() => {
    const saved = localStorage.getItem('lw-lang');
    if (LANGS.includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('lw-lang', l);
  };

  const t = (path, vars) => {
    let cur = dict[lang];
    for (const k of path.split('.')) cur = cur?.[k];
    if (typeof cur !== 'string') return path;
    return vars ? cur.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : cur;
  };

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}
