import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VideoAscii } from 'react-video-ascii';

type HeroAsciiVideoProps = {
  videoSrc?: string;
};

/**
 * `react-video-ascii` builds a cols×rows ASCII grid from canvas size + numCols.
 * Too many columns vs very small height can yield degenerate grids / blank WebGL draws;
 * tighten caps when height is modest (tablet / narrow breakpoints).
 */
function clampColsForSize(widthPx: number, heightPx: number): number {
  const w = Math.max(48, Math.floor(widthPx || 48));
  const h = Math.max(48, Math.floor(heightPx || 48));
  const densityCap = Math.floor(w / 1.65);
  /** Keep grids from getting absurdly tall+thin vs short canvases (~1024/layout shifts). */
  const aspectCap = Math.max(24, Math.min(300, Math.round((w * h) ** 0.52)));
  const baseCols = Math.max(24, Math.min(300, densityCap, aspectCap));
  return Math.max(24, Math.min(300, Math.round(baseCols * 0.9)));
}

const SAFE_MIN_DIM = 72;

/**
 * WebGL2 ASCII video layer (home: fixed full-viewport backdrop via `HeroAsciiBackdrop`).
 * Respects reduced motion by not mounting when `client:media` excludes this island.
 *
 * Remounts after the tab/window was hidden (e.g. minimized): WebGL2 contexts are often torn
 * down; `react-video-ascii` does not recover from context loss, which shows as a black canvas.
 */
export default function HeroAsciiVideo({ videoSrc = '/videos/jellyfish.mp4' }: HeroAsciiVideoProps) {
  const src = useMemo(() => videoSrc, [videoSrc]);
  const shellRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(96);
  const [instanceKey, setInstanceKey] = useState(0);
  const remount = useCallback(() => setInstanceKey((n) => n + 1), []);
  const wasHiddenWhileMounted = useRef(false);
  const lastGoodPx = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const sync = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      const next = clampColsForSize(w, h);
      setCols((c) => (c === next ? c : next));

      const prev = lastGoodPx.current;
      const wasSmall =
        prev.w > 0 &&
        prev.h > 0 &&
        (prev.w < SAFE_MIN_DIM || prev.h < SAFE_MIN_DIM);
      const nowOk = w >= SAFE_MIN_DIM && h >= SAFE_MIN_DIM;
      if (wasSmall && nowOk) requestAnimationFrame(() => remount());
      if (w > 0 && h > 0) lastGoodPx.current = { w, h };
    };

    const ro = new ResizeObserver(() => requestAnimationFrame(sync));
    ro.observe(el);
    sync();
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [remount]);

  useEffect(() => {
    const markHidden = () => {
      if (document.visibilityState === 'hidden') wasHiddenWhileMounted.current = true;
    };
    markHidden();

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        wasHiddenWhileMounted.current = true;
        return;
      }
      if (!wasHiddenWhileMounted.current) return;
      wasHiddenWhileMounted.current = false;
      requestAnimationFrame(() => remount());
    };

    const onPageShow = (event: Event) => {
      if ((event as PageTransitionEvent).persisted) requestAnimationFrame(() => remount());
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [remount]);

  /** WebGL + ResizeObserver occasionally stay black across the phone/tablet width boundary. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const bump = () => requestAnimationFrame(() => remount());
    mq.addEventListener('change', bump);
    return () => mq.removeEventListener('change', bump);
  }, [remount]);

  /**
   * `react-video-ascii` manages its own hidden <video>; apply a subtle slow-down after mount.
   * Re-run after remounts so playbackRate sticks across WebGL/context recoveries.
   */
  useEffect(() => {
    const host = shellRef.current;
    if (!host) return;
    let activeVideo: HTMLVideoElement | null = null;
    let frozenAtEnd = false;

    const bindVideo = (video: HTMLVideoElement) => {
      if (activeVideo === video) return;
      if (activeVideo) {
        activeVideo.removeEventListener('ended', freezeAtLastFrame);
        activeVideo.removeEventListener('timeupdate', freezeNearEnd);
        activeVideo.removeEventListener('play', keepFrozen);
      }
      activeVideo = video;
      frozenAtEnd = false;
      activeVideo.loop = false;
      activeVideo.playbackRate = 0.88;
      activeVideo.addEventListener('ended', freezeAtLastFrame);
      activeVideo.addEventListener('timeupdate', freezeNearEnd);
      activeVideo.addEventListener('play', keepFrozen);
    };

    const freezeAtLastFrame = () => {
      if (!activeVideo || frozenAtEnd) return;
      frozenAtEnd = true;
      const lastFrameTime =
        Number.isFinite(activeVideo.duration) && activeVideo.duration > 0
          ? Math.max(0, activeVideo.duration - 0.04)
          : activeVideo.currentTime;
      activeVideo.currentTime = lastFrameTime;
      activeVideo.pause();
    };

    const freezeNearEnd = () => {
      if (!activeVideo) return;
      if (!Number.isFinite(activeVideo.duration) || activeVideo.duration <= 0) return;
      if (activeVideo.currentTime >= activeVideo.duration - 0.06) {
        freezeAtLastFrame();
      }
    };

    const keepFrozen = () => {
      if (!activeVideo || !frozenAtEnd) return;
      activeVideo.pause();
      activeVideo.currentTime = Math.max(0, (activeVideo.duration || 0) - 0.04);
    };

    const maybeVideo = host.querySelector('video');
    if (maybeVideo instanceof HTMLVideoElement) bindVideo(maybeVideo);

    const mo = new MutationObserver(() => {
      const v = host.querySelector('video');
      if (v instanceof HTMLVideoElement) bindVideo(v);
    });
    mo.observe(host, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      if (activeVideo) {
        activeVideo.removeEventListener('ended', freezeAtLastFrame);
        activeVideo.removeEventListener('timeupdate', freezeNearEnd);
        activeVideo.removeEventListener('play', keepFrozen);
      }
    };
  }, [instanceKey, src]);

  return (
    <div ref={shellRef} className="hero-ascii-size-guard">
      <VideoAscii
        key={`${instanceKey}-${cols}`}
        src={src}
        videoMode={false}
        charMode="shape"
        saturationRaw={0}
        numColsRaw={cols}
        brightnessRaw={0.6}
        bgOpacityRaw={0.02}
        mouseEffect={false}
        clickEffect={false}
        revealEffect={{ type: 'random', duration: 0.35 }}
        className="hero-video-ascii"
      />
    </div>
  );
}
