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
    smoothing: overrides.smoothing ?? num(d.smoothing, 0.1),
    overlayScrim: overrides.overlayScrim ?? num(d.overlayScrim, 0.45),
    useWindowScroll: overrides.useWindowScroll ?? bool(d.useWindowScroll, false),
    enabled: overrides.enabled ?? bool(d.enabled, true),
  };
}

/**
 * Vanilla port of React Bits <ScrollExpand />.
 * Expects the markup produced by ScrollExpand.astro (data-scroll-expand root).
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

  let raf = 0;
  let current = 0;
  let target = 0;
  let stageH = 0;
  let running = false;

  const applyProgress = (p: number) => {
    const e = smoothstep(0, 1, p);

    // Snap the last fraction to a true full-bleed inset so we don't
    // stall on a near-100% rounded card (and drop `round` entirely).
    if (e >= 0.995) {
      frame.style.clipPath = 'inset(0)';
      media.style.transform = 'scale(1)';
    } else {
      const w = props.startWidth + (100 - props.startWidth) * e;
      const h = props.startHeight + (100 - props.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = props.startRadius + (props.endRadius - props.startRadius) * e;
      frame.style.clipPath =
        r <= 0.5
          ? `inset(${iy}% ${ix}% ${iy}% ${ix}%)`
          : `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
      media.style.transform = `scale(${props.mediaZoom + (1 - props.mediaZoom) * e})`;
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
  };

  const readProgress = () => {
    if (!props.enabled) return 1;
    const span = stageH * Math.max(0.01, props.scrollDistance);
    if (props.useWindowScroll) {
      const top = track.getBoundingClientRect().top;
      return clamp(-top / span, 0, 1);
    }
    return clamp(root.scrollTop / span, 0, 1);
  };

  const tick = () => {
    const k = props.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * props.smoothing));
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0004) {
      current = target;
      running = false;
    }
    applyProgress(current);
    raf = running ? requestAnimationFrame(tick) : 0;
  };

  const kick = () => {
    if (running) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onScroll = () => {
    target = readProgress();
    if (props.smoothing <= 0 || reduceMotion) {
      current = target;
      applyProgress(current);
      return;
    }
    kick();
  };

  const onResize = () => {
    measure();
    target = readProgress();
    current = target;
    applyProgress(current);
  };

  measure();
  target = readProgress();
  current = target;
  applyProgress(current);

  const scroller: HTMLElement | Window = props.useWindowScroll ? window : root;
  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(root);

  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    },
  };
}
