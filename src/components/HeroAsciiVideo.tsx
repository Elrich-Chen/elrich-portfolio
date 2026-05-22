import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VideoAscii } from 'react-video-ascii';

type HeroAsciiVideoProps = {
  videoSrc?: string;
  loop?: boolean;
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
  /** Short mobile viewports (keyboard, short dvh): cap columns so row count stays drawable. */
  const heightCap = Math.max(24, Math.min(300, Math.floor(h / 3.25)));
  let baseCols = Math.max(24, Math.min(300, densityCap, aspectCap, heightCap));
  if (h < 520) {
    const scale = Math.max(0.55, 0.55 + (h - 200) / 580);
    baseCols = Math.round(baseCols * scale);
  }
  let cols = Math.max(24, Math.min(300, Math.round(baseCols * 0.9)));
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches) {
    cols = Math.min(cols, 72);
  }
  return cols;
}

const SAFE_MIN_DIM = 72;

/**
 * WebGL2 ASCII video layer (home: fixed full-viewport backdrop via `HeroAsciiBackdrop`).
 * Respects reduced motion via CSS in `HeroAsciiBackdrop` (backdrop hidden); island uses `client:load`.
 *
 * Remounts after the tab/window was hidden (e.g. minimized): WebGL2 contexts are often torn
 * down; `react-video-ascii` does not recover from context loss, which shows as a black canvas.
 */
function configureMobileVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('muted', '');
  video.disableRemotePlayback = true;
}

function tryPlayVideo(video: HTMLVideoElement) {
  const result = video.play();
  if (result && typeof result.catch === 'function') result.catch(() => {});
}

export default function HeroAsciiVideo({
  videoSrc = '/videos/jellyfish.mp4',
  loop = false,
}: HeroAsciiVideoProps) {
  const [motionAllowed, setMotionAllowed] = useState(true);
  const src = useMemo(() => videoSrc, [videoSrc]);
  const shellRef = useRef<HTMLDivElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  /** Synced from video-binding effect so replay can clear “held at last frame” before `play`. */
  const frozenAtEndRef = useRef(false);
  const [cols, setCols] = useState(96);
  const [shellReady, setShellReady] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const remount = useCallback(() => setInstanceKey((n) => n + 1), []);
  const wasHiddenWhileMounted = useRef(false);
  const lastGoodPx = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const colsDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const colsInitializedRef = useRef(false);
  const colsRef = useRef(96);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setMotionAllowed(!mq.matches);
    syncMotion();
    mq.addEventListener('change', syncMotion);
    return () => mq.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const sync = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      const next = clampColsForSize(w, h);
      if (!colsInitializedRef.current) {
        colsInitializedRef.current = true;
        colsRef.current = next;
        setCols(next);
      } else if (Math.abs(next - colsRef.current) >= 8) {
        if (colsDebounceRef.current) window.clearTimeout(colsDebounceRef.current);
        colsDebounceRef.current = window.setTimeout(() => {
          const prev = colsRef.current;
          colsRef.current = next;
          setCols(next);
          if (Math.abs(next - prev) >= 12) requestAnimationFrame(() => remount());
        }, 200);
      }

      const prev = lastGoodPx.current;
      const wasSmall =
        prev.w > 0 &&
        prev.h > 0 &&
        (prev.w < SAFE_MIN_DIM || prev.h < SAFE_MIN_DIM);
      const nowOk = w >= SAFE_MIN_DIM && h >= SAFE_MIN_DIM;
      if (wasSmall && nowOk) requestAnimationFrame(() => remount());
      if (w > 0 && h > 0) lastGoodPx.current = { w, h };
      if (w >= SAFE_MIN_DIM && h >= SAFE_MIN_DIM) {
        setShellReady((ready) => ready || true);
      }
    };

    const ro = new ResizeObserver(() => requestAnimationFrame(sync));
    ro.observe(el);
    sync();
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
      if (colsDebounceRef.current) window.clearTimeout(colsDebounceRef.current);
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
      const v = activeVideoRef.current ?? shellRef.current?.querySelector('video');
      if (v instanceof HTMLVideoElement) tryPlayVideo(v);
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

  /** WebGL occasionally stays black across the phone/tablet width boundary — remount only on real crossing. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const bump = () => requestAnimationFrame(() => remount());
    mq.addEventListener('change', bump);
    return () => mq.removeEventListener('change', bump);
  }, [remount]);

  /** Recover from WebGL context loss (common on iOS) instead of staying a black canvas. */
  useEffect(() => {
    const host = shellRef.current;
    if (!host) return;
    const onLost = (event: Event) => {
      event.preventDefault();
      requestAnimationFrame(() => remount());
    };
    const bind = () => {
      const canvas = host.querySelector('canvas');
      if (!canvas) return;
      canvas.addEventListener('webglcontextlost', onLost);
      return canvas;
    };
    let canvas = bind();
    const mo = new MutationObserver(() => {
      if (canvas) canvas.removeEventListener('webglcontextlost', onLost);
      canvas = bind() ?? null;
    });
    mo.observe(host, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      if (canvas) canvas.removeEventListener('webglcontextlost', onLost);
    };
  }, [instanceKey, remount]);

  useEffect(() => {
    const onOrientation = () => {
      window.setTimeout(() => requestAnimationFrame(() => remount()), 120);
    };
    window.addEventListener('orientationchange', onOrientation);
    return () => window.removeEventListener('orientationchange', onOrientation);
  }, [remount]);

  /**
   * `react-video-ascii` manages its own hidden <video>; apply a subtle slow-down after mount.
   * Re-run after remounts so playbackRate sticks across WebGL/context recoveries.
   */
  useEffect(() => {
    const host = shellRef.current;
    if (!host) return;
    let activeVideo: HTMLVideoElement | null = null;

    const bindVideo = (video: HTMLVideoElement) => {
      if (activeVideo === video) return;
      if (activeVideo) {
        activeVideo.removeEventListener('ended', freezeAtLastFrame);
        activeVideo.removeEventListener('timeupdate', freezeNearEnd);
        activeVideo.removeEventListener('play', keepFrozen);
      }
      activeVideo = video;
      activeVideoRef.current = video;
      frozenAtEndRef.current = false;
      configureMobileVideo(activeVideo);
      activeVideo.loop = loop;
      const kickPlayback = () => {
        tryPlayVideo(activeVideo!);
        const p = activeVideo!.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            activeVideo!.playbackRate = 0.88;
            if (activeVideo!.currentTime < 0.01 && activeVideo!.readyState >= 2) {
              activeVideo!.currentTime = 0.001;
            }
          }).catch(() => {});
        }
      };
      kickPlayback();
      activeVideo.addEventListener('loadedmetadata', kickPlayback, { once: true });
      activeVideo.addEventListener('loadeddata', kickPlayback, { once: true });
      activeVideo.addEventListener('canplay', kickPlayback, { once: true });
      activeVideo.addEventListener('canplaythrough', kickPlayback, { once: true });
      if (!loop) {
        activeVideo.addEventListener('ended', freezeAtLastFrame);
        activeVideo.addEventListener('timeupdate', freezeNearEnd);
        activeVideo.addEventListener('play', keepFrozen);
      }
    };

    const freezeAtLastFrame = () => {
      if (loop) return;
      if (!activeVideo || frozenAtEndRef.current) return;
      frozenAtEndRef.current = true;
      const lastFrameTime =
        Number.isFinite(activeVideo.duration) && activeVideo.duration > 0
          ? Math.max(0, activeVideo.duration - 0.04)
          : activeVideo.currentTime;
      activeVideo.currentTime = lastFrameTime;
      activeVideo.pause();
    };

    const freezeNearEnd = () => {
      if (loop) return;
      if (!activeVideo) return;
      if (!Number.isFinite(activeVideo.duration) || activeVideo.duration <= 0) return;
      if (activeVideo.currentTime >= activeVideo.duration - 0.06) {
        freezeAtLastFrame();
      }
    };

    const keepFrozen = () => {
      if (loop) return;
      if (!activeVideo || !frozenAtEndRef.current) return;
      // Replay: we seek to 0 and call play() — do not re-freeze on that play event.
      if (activeVideo.currentTime < 0.35) {
        frozenAtEndRef.current = false;
        return;
      }
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
      activeVideoRef.current = null;
    };
  }, [instanceKey, loop, src]);

  const handleReplay = useCallback(() => {
    const shell = shellRef.current;
    let video = activeVideoRef.current;
    if (!video && shell) {
      const v = shell.querySelector('video');
      if (v instanceof HTMLVideoElement) {
        activeVideoRef.current = v;
        video = v;
      }
    }
    if (!video) return;
    frozenAtEndRef.current = false;
    video.loop = loop;
    video.currentTime = 0;
    const playResult = video.play();
    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(() => {});
    }
  }, [loop]);

  useEffect(() => {
    const onExternalReplay = () => handleReplay();
    window.addEventListener('ascii-video-replay', onExternalReplay);
    return () => window.removeEventListener('ascii-video-replay', onExternalReplay);
  }, [handleReplay]);

  useEffect(() => {
    const unlock = () => {
      const v = activeVideoRef.current ?? shellRef.current?.querySelector('video');
      if (v instanceof HTMLVideoElement && v.paused) tryPlayVideo(v);
    };
    document.addEventListener('touchstart', unlock, { once: true, passive: true });
    document.addEventListener('click', unlock, { once: true });
    return () => {
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
  }, [instanceKey]);

  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (!motionAllowed) return null;

  return (
    <div ref={shellRef} className="hero-ascii-size-guard">
      {shellReady && (
      <VideoAscii
        key={instanceKey}
        src={src}
        videoMode={false}
        charMode="shape"
        saturationRaw={0}
        numColsRaw={cols}
        brightnessRaw={isNarrow ? 0.92 : 0.65}
        bgOpacityRaw={isNarrow ? 0.14 : 0.04}
        mouseEffect={false}
        clickEffect={false}
        revealEffect={false}
        className="hero-video-ascii"
      />
      )}
    </div>
  );
}
