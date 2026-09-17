const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const num = (raw: string | undefined, fallback: number) => {
  if (raw == null || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

const bool = (raw: string | undefined, fallback: boolean) => {
  if (raw == null || raw === '') return fallback;
  if (raw === 'true' || raw === '') return true;
  if (raw === 'false') return false;
  return fallback;
};

export type ScrollExpandOptions = {
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
};

export type ScrollExpandHandle = {
  destroy: () => void;
};

type Props = Required<ScrollExpandOptions>;

function readOptions(root: HTMLElement, overrides: ScrollExpandOptions = {}): Props {
  const d = root.dataset;
  return {
    startWidth: overrides.startWidth ?? num(d.startWidth, 42),
    startHeight: overrides.startHeight ?? num(d.startHeight, 58),
    startRadius: overrides.startRadius ?? num(d.startRadius, 24),
    endRadius: overrides.endRadius ?? num(d.endRadius, 0),
    mediaZoom: overrides.mediaZoom ?? num(d.mediaZoom, 1.35),
    scrollDistance: overrides.scrollDistance ?? num(d.scrollDistance, 1.2),
    holdDistance: overrides.holdDistance ?? num(d.holdDistance, 0.35),
    // Slightly snappier default — long lag behind native scroll reads as stutter.
    smoothing: overrides.smoothing ?? num(d.smoothing, 0.055),
    overlayScrim: overrides.overlayScrim ?? num(d.overlayScrim, 0.45),
    useWindowScroll: overrides.useWindowScroll ?? bool(d.useWindowScroll, false),
    enabled: overrides.enabled ?? bool(d.enabled, true),
  };
}

/**
 * Vanilla port of React Bits <ScrollExpand />.
 * Expects the markup produced by ScrollExpand.astro (data-scroll-expand root).
 *
 * Uses transform + border-radius (compositor) instead of clip-path (paint)
 * so sticky scrubbing stays smooth while scrolling.
 */
export function mountScrollExpand(
  root: HTMLElement,
  overrides: ScrollExpandOptions = {}
): ScrollExpandHandle {
  const track = root.querySelector<HTMLElement>('[data-se-track]');
  const stage = root.querySelector<HTMLElement>('[data-se-stage]');
  const frame = root.querySelector<HTMLElement>('[data-se-frame]');
  const media = root.querySelector<HTMLElement>('[data-se-media]');
  const titleEl = root.querySelector<HTMLElement>('[data-se-title]');
  const overlay = root.querySelector<HTMLElement>('[data-se-overlay]');
  const scrim = root.querySelector<HTMLElement>('[data-se-scrim]');
  const hint = root.querySelector<HTMLElement>('[data-se-hint]');

  if (!track || !stage || !frame || !media) {
    return { destroy() {} };
  }

  const props: Props = readOptions(root, overrides);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phones shouldn't pay for a multi-viewport expand theater — keep a short
  // bridge so Experience → Projects doesn't feel like empty black scroll.
  const compact = window.matchMedia('(max-width: 720px)').matches;
  if (compact) {
    props.scrollDistance = Math.min(props.scrollDistance, 0.38);
    props.holdDistance = Math.min(props.holdDistance, 0.1);
    props.startWidth = Math.max(props.startWidth, 82);
    props.startHeight = Math.max(props.startHeight, 64);
    props.mediaZoom = Math.min(props.mediaZoom, 1.1);
    props.smoothing = Math.min(props.smoothing, 0.04);
  }

  let raf = 0;
  let current = 0;
  let target = 0;
  let stageH = 0;
  let trackTop = 0;
  let running = false;
  let inView = true;
  let lastApplied = -1;
  let lastTs = 0;
  let scrubbing = false;

  const setScrubbing = (on: boolean) => {
    if (scrubbing === on) return;
    scrubbing = on;
    root.classList.toggle('is-scrubbing', on);
  };

  const applyProgress = (p: number) => {
    // Skip redundant paints when the value barely moved.
    if (Math.abs(p - lastApplied) < 0.00035) return;
    lastApplied = p;

    const e = smoothstep(0, 1, p);

    // Snap the last fraction to a true full-bleed so we don't stall on a
    // near-100% rounded card.
    if (e >= 0.985) {
      frame.style.transform = 'translate3d(0,0,0)';
      frame.style.borderRadius = '0';
      media.style.transform = 'translate3d(0,0,0) scale(1)';
    } else {
      const sx = (props.startWidth + (100 - props.startWidth) * e) / 100;
      const sy = (props.startHeight + (100 - props.startHeight) * e) / 100;
      const r = props.startRadius + (props.endRadius - props.startRadius) * e;
      // Compensate radius for the scale so the on-screen corner matches `r`.
      const rPx = r <= 0.5 ? 0 : r / Math.min(sx, sy);
      frame.style.transform = `translate3d(0,0,0) scale(${sx}, ${sy})`;
      frame.style.borderRadius = `${rPx}px`;

      // Counter-scale media so zoom matches the old clip-path look (media stays
      // ~full-stage sized while the window grows around it).
      const mz = props.mediaZoom + (1 - props.mediaZoom) * e;
      media.style.transform = `translate3d(0,0,0) scale(${mz / sx}, ${mz / sy})`;
    }

    if (scrim) scrim.style.opacity = `${props.overlayScrim * e}`;

    if (titleEl) {
      const out = smoothstep(0.4, 0.88, p);
      titleEl.style.opacity = `${1 - out}`;
      titleEl.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hint) {
      const gone = smoothstep(0, 0.12, p);
      hint.style.opacity = `${1 - gone}`;
      hint.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlay) {
      const inn = smoothstep(0.68, 1, p);
      overlay.style.opacity = `${inn}`;
      overlay.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
      overlay.style.pointerEvents = inn > 0.55 ? 'auto' : 'none';
    }
  };

  const measure = () => {
    stageH = props.useWindowScroll ? window.innerHeight : root.clientHeight;
    if (stageH <= 0) return;
    stage.style.height = `${stageH}px`;
    track.style.height = `${stageH * (1 + Math.max(0, props.scrollDistance) + Math.max(0, props.holdDistance))}px`;

    const w = root.clientWidth || stageH;
    stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);

    // Cache document Y once per measure — avoid getBoundingClientRect on scroll.
    if (props.useWindowScroll) {
      trackTop = track.getBoundingClientRect().top + window.scrollY;
    }
  };

  const readProgress = () => {
    if (!props.enabled) return 1;
    const span = stageH * Math.max(0.01, props.scrollDistance);
    if (props.useWindowScroll) {
      return clamp((window.scrollY - trackTop) / span, 0, 1);
    }
    return clamp(root.scrollTop / span, 0, 1);
  };

  const tick = (ts: number) => {
    const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 1 / 60;
    lastTs = ts;

    if (props.smoothing <= 0) {
      current = target;
    } else {
      // Frame-rate independent exponential smoothing.
      const k = 1 - Math.exp(-dt / props.smoothing);
      current += (target - current) * k;
    }

    if (Math.abs(target - current) < 0.0008) {
      current = target;
      running = false;
      setScrubbing(false);
    }

    applyProgress(current);
    raf = running ? requestAnimationFrame(tick) : 0;
    if (!running) lastTs = 0;
  };

  const kick = () => {
    if (!inView && target === current) return;
    setScrubbing(true);
    if (running) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onScroll = () => {
    if (!inView && props.useWindowScroll) {
      // Still update target so we snap correctly when re-entering view,
      // but skip the rAF loop while fully off-screen.
      target = readProgress();
      if (Math.abs(target - current) > 0.002) {
        current = target;
        lastApplied = -1;
        applyProgress(current);
      }
      return;
    }

    target = readProgress();
    if (props.smoothing <= 0 || reduceMotion) {
      current = target;
      applyProgress(current);
      setScrubbing(false);
      return;
    }
    kick();
  };

  const onResize = () => {
    measure();
    target = readProgress();
    current = target;
    lastApplied = -1;
    applyProgress(current);
  };

  measure();
  target = readProgress();
  current = target;
  applyProgress(current);

  const scroller: HTMLElement | Window = props.useWindowScroll ? window : root;
  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  const ro = new ResizeObserver(onResize);
  ro.observe(root);

  let io: IntersectionObserver | undefined;
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(
      (entries) => {
        inView = !!entries[0]?.isIntersecting;
        if (inView) onScroll();
        else setScrubbing(false);
      },
      { rootMargin: '20% 0px' }
    );
    io.observe(root);
  }

  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      setScrubbing(false);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      io?.disconnect();
    },
  };
}
