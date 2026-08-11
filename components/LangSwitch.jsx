'use client';

import { useLang, LANGS } from '@/lib/i18n';

export default function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${className}`} role="group" aria-label="Language">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-30">/</span>}
          <button
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`transition-opacity duration-300 ${lang === l ? 'opacity-100 underline underline-offset-4' : 'opacity-45 hover:opacity-80'}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
