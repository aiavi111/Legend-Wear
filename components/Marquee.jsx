'use client';

const ITEMS = ['Since day one', 'Drop 001 — live now', 'Earn your legacy', 'Premium oversized tees', 'Create your legend', 'Bishkek based · worldwide mindset'];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-8 text-[11px] font-medium uppercase tracking-[0.3em] sm:text-xs">{t}</span>
          <span className="text-ember" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-bone py-4" aria-hidden="true">
      <div className="animate-marquee flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}
