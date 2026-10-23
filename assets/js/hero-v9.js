/** Rosela Miranda: frame-by-frame scroll morph from first approved apple-heart sequence.
 *  Keeps headings and CTA legible by bounding parallax; only the portrait drifts slightly.
 */
(() => {
  const hero = document.querySelector('.v3-first[data-motion-v9]');
  const icon = hero?.querySelector('[data-apple-heart]');
  const image = icon?.querySelector('img');
  if (!hero || !image) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 781px)');
  const title = hero.querySelector('[data-parallax="heading"]');
  const portrait = hero.querySelector('.v3-portrait img');
  const filenames = Array.from({ length: 6 }, (_, i) =>
    `assets/images/apple-heart/apple-heart-${String(i + 1).padStart(2, '0')}.webp`
  );
  let frame = 0;
  let scheduled = false;
  let heroHeight = hero.offsetHeight;

  // Predecode only the six tiny local files. No animation library or video download.
  if (!prefersReducedMotion.matches) {
    for (const src of filenames.slice(1)) {
      const prefetch = new Image();
      prefetch.decoding = 'async';
      prefetch.src = src;
    }
  }

  const update = () => {
    scheduled = false;
    if (prefersReducedMotion.matches) {
      if (frame !== 0) { frame = 0; image.src = filenames[0]; }
      if (title) title.style.transform = '';
      if (portrait) portrait.style.transform = '';
      return;
    }
    const scroll = Math.max(0, window.scrollY - hero.offsetTop);
    const progress = Math.min(1, scroll / Math.max(1, heroHeight * 0.85));
    const next = Math.min(5, Math.floor(progress * 6));
    if (next !== frame) {
      image.src = filenames[next];
      frame = next;
    }

    if (desktop.matches) {
      // Max 12px of heading movement; description remains entirely stationary.
      if (title) title.style.transform = `translate3d(0, ${Math.min(12, scroll * 0.022).toFixed(1)}px, 0)`;
      if (portrait) portrait.style.transform = `translate3d(0, ${(-Math.min(13, scroll * 0.021)).toFixed(1)}px, 0)`;
    } else {
      if (title) title.style.transform = '';
      if (portrait) portrait.style.transform = '';
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    heroHeight = hero.offsetHeight;
    schedule();
  }, { passive: true });
  prefersReducedMotion.addEventListener?.('change', schedule);
  desktop.addEventListener?.('change', schedule);
  update();
})();