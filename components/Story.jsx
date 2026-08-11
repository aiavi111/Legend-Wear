'use client';

import { useRef } from 'react';
import { useGsap, gsap } from '@/lib/gsapClient';
import { story } from '@/lib/site';
import { useLang } from '@/lib/i18n';

const LINES = [
  { text: 'Legend Wear is more', serif: false },
  { text: 'than clothing.', serif: false },
  { text: 'It is a mindset.', serif: true },
];

export default function Story() {
  const root = useRef(null);
  const { t } = useLang();

  useGsap(() => {
    gsap.fromTo(
      '.story-line > span',
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.25,
        stagger: 0.14,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.story-copy', start: 'top 70%' },
      },
    );
    gsap.fromTo(
      '.story-fade',
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.story-copy', start: 'top 55%' },
      },
    );
    /* cinematic parallax on the image band */
    gsap.fromTo(
      '.story-img',
      { yPercent: -12, scale: 1.2 },
      {
        yPercent: 12,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: { trigger: '.story-band', start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }, []);

  return (
    <section ref={root} id="story" className="bg-ink text-bone">
      <div className="story-copy px-5 py-28 sm:px-8 sm:py-40">
        <div className="mx-auto max-w-5xl">
          <img
            src="/legend-mark.jpg"
            alt="Legend Wear logo"
            className="story-fade mb-14 h-16 w-16 object-cover mix-blend-screen sm:h-20 sm:w-20"
            loading="lazy"
          />
          <p className="story-fade mb-10 text-[10px] uppercase tracking-mega text-ember">
            The mindset — 03
          </p>

          <h2 className="leading-[1.05]">
            {LINES.map((l, i) => (
              <span key={i} className="story-line mask">
                <span
                  className={
                    l.serif
                      ? 'block font-serif text-[10vw] italic text-bone/90 sm:text-7xl'
                      : 'block text-[10vw] font-extrabold uppercase tracking-[-0.02em] sm:text-7xl'
                  }
                >
                  {l.text}
                </span>
              </span>
            ))}
          </h2>

          <p className="story-fade mt-12 max-w-md text-base leading-loose text-bone/60">{t('story.para')}</p>
        </div>
      </div>

      {/* cinematic band */}
      <figure className="story-band relative h-[62vh] overflow-hidden sm:h-[75vh]">
        <img
          src={story.image}
          alt={story.alt}
          loading="lazy"
          className="story-img absolute inset-0 h-full w-full object-cover object-[50%_68%] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <figcaption className="absolute bottom-8 left-5 text-[10px] uppercase tracking-mega text-bone/70 sm:left-8">
          {t('story.caption')}
        </figcaption>
      </figure>
    </section>
  );
}
