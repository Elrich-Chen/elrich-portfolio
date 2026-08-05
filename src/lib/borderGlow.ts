export type BorderGlowOptions = {
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
  className?: string;
  /** Track pointer here too (e.g. tabs next to the card). Defaults to the card. */
  trackRoot?: HTMLElement | null;
};

export type BorderGlowHandle = {
  destroy: () => void;
};

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
];
const GRADIENT_KEYS = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
] as const;
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildGlowVars(
  glowColor: string,
  intensity: number
): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] =
      `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

function buildGradientVars(colors: string[]): Record<string, string> {
  const safe = colors.length > 0 ? colors : ['#f97316', '#fb7185', '#38bdf8'];
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = safe[Math.min(COLOR_MAP[i], safe.length - 1)];
    vars[GRADIENT_KEYS[i]] =
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${safe[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x: number) {
  return x * x * x;
}

type AnimateOpts = {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
  signal?: AbortSignal;
};

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
  signal,
}: AnimateOpts) {
  let rafId = 0;
  let timeoutId = 0;

  const cancel = () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (timeoutId) window.clearTimeout(timeoutId);
  };

  if (signal?.aborted) return cancel;
  signal?.addEventListener('abort', cancel, { once: true });

  timeoutId = window.setTimeout(() => {
    const t0 = performance.now();
    const tick = (now: number) => {
      if (signal?.aborted) return;
      const t = Math.min((now - t0) / duration, 1);
      onUpdate(start + (end - start) * ease(t));
      if (t < 1) rafId = requestAnimationFrame(tick);
      else onEnd?.();
    };
    rafId = requestAnimationFrame(tick);
  }, delay);

  return cancel;
}

function getCenterOfElement(el: HTMLElement): [number, number] {
  const { width, height } = el.getBoundingClientRect();
  return [width / 2, height / 2];
}

function getEdgeProximity(el: HTMLElement, x: number, y: number): number {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
}

function getCursorAngle(el: HTMLElement, x: number, y: number): number {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}

/**
 * Vanilla port of React Bits BorderGlow.
 * Expects (or builds) `.border-glow-card` → `.edge-light` + `.border-glow-inner` children.
 */
export function mountBorderGlow(
  el: HTMLElement,
  options: BorderGlowOptions = {}
): BorderGlowHandle {
  const {
    edgeSensitivity = 30,
    glowColor = '24 95 55',
    backgroundColor = '#0a0a0a',
    borderRadius = 26,
    glowRadius = 36,
    glowIntensity = 0.85,
    coneSpread = 25,
    animated = false,
    colors = ['#f97316', '#fb7185', '#38bdf8'],
    fillOpacity = 0.4,
    className = '',
    trackRoot = null,
  } = options;

  const ac = new AbortController();
  const { signal } = ac;
  const cancelFns: Array<() => void> = [];
  const trackEl = trackRoot instanceof HTMLElement ? trackRoot : el;

  el.classList.add('border-glow-card');
  if (className) {
    className
      .split(/\s+/)
      .filter(Boolean)
      .forEach((c) => el.classList.add(c));
  }

  let edgeLight = el.querySelector<HTMLElement>(':scope > .edge-light');
  if (!edgeLight) {
    edgeLight = document.createElement('div');
    edgeLight.className = 'edge-light';
    edgeLight.setAttribute('aria-hidden', 'true');
    el.insertBefore(edgeLight, el.firstChild);
  }

  let inner = el.querySelector<HTMLElement>(':scope > .border-glow-inner');
  let wrappedChildren = false;
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'border-glow-inner';
    const toMove = Array.from(el.childNodes).filter(
      (node) => node !== edgeLight
    );
    for (const node of toMove) inner.appendChild(node);
    el.appendChild(inner);
    wrappedChildren = true;
  }

  const styleVars: Record<string, string | number> = {
    '--card-bg': backgroundColor,
    '--edge-sensitivity': edgeSensitivity,
    '--border-radius': `${borderRadius}px`,
    '--glow-padding': `${glowRadius}px`,
    '--cone-spread': coneSpread,
    '--fill-opacity': fillOpacity,
    ...buildGlowVars(glowColor, glowIntensity),
    ...buildGradientVars(colors),
  };

  for (const [key, value] of Object.entries(styleVars)) {
    el.style.setProperty(key, String(value));
  }

  const onPointerMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edge = getEdgeProximity(el, x, y);
    const angle = getCursorAngle(el, x, y);
    el.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    el.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  };

  const onPointerEnter = () => el.classList.add('glow-lit');
  const onPointerLeave = () => {
    el.classList.remove('glow-lit');
    el.style.setProperty('--edge-proximity', '0');
  };

  trackEl.addEventListener('pointermove', onPointerMove, { signal });
  trackEl.addEventListener('pointerenter', onPointerEnter, { signal });
  trackEl.addEventListener('pointerleave', onPointerLeave, { signal });

  if (animated) {
    const angleStart = 110;
    const angleEnd = 465;
    el.classList.add('sweep-active');
    el.style.setProperty('--cursor-angle', `${angleStart}deg`);

    cancelFns.push(
      animateValue({
        duration: 500,
        signal,
        onUpdate: (v) => el.style.setProperty('--edge-proximity', String(v)),
      })
    );
    cancelFns.push(
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        signal,
        onUpdate: (v) => {
          el.style.setProperty(
            '--cursor-angle',
            `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`
          );
        },
      })
    );
    cancelFns.push(
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        signal,
        onUpdate: (v) => {
          el.style.setProperty(
            '--cursor-angle',
            `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`
          );
        },
      })
    );
    cancelFns.push(
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        signal,
        onUpdate: (v) => el.style.setProperty('--edge-proximity', String(v)),
        onEnd: () => el.classList.remove('sweep-active'),
      })
    );
  }

  let destroyed = false;

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ac.abort();
      cancelFns.forEach((fn) => fn());
      el.classList.remove('sweep-active', 'border-glow-card', 'glow-lit');
      if (className) {
        className
          .split(/\s+/)
          .filter(Boolean)
          .forEach((c) => el.classList.remove(c));
      }
      for (const key of Object.keys(styleVars)) {
        el.style.removeProperty(key);
      }
      el.style.removeProperty('--edge-proximity');
      el.style.removeProperty('--cursor-angle');

      if (wrappedChildren && inner) {
        while (inner.firstChild) el.insertBefore(inner.firstChild, inner);
        inner.remove();
      }
      // Only remove edge-light if we created the wrap structure from scratch
      // and it would otherwise be orphaned chrome — keep static markup if present.
      if (wrappedChildren && edgeLight?.parentElement === el) {
        edgeLight.remove();
      }
    },
  };
}
