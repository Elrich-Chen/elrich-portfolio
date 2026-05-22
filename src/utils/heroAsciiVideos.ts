/** Per-route ASCII backdrop video (fixed layer in Base, persisted across ClientRouter nav). */
export const HERO_ASCII_BY_PATH: Record<string, { videoSrc: string; loop: boolean }> = {
  '/': { videoSrc: '/videos/snow-cats.mp4', loop: true },
  '/about/': { videoSrc: '/videos/eagle.mp4', loop: true },
  '/projects/': { videoSrc: '/videos/chameleon.mp4', loop: true },
  '/photos/': { videoSrc: '/videos/tiger-yawn.mp4', loop: true },
  '/hobbies/': { videoSrc: '/videos/jellyfish.mp4', loop: true },
};

export function normalizeHeroPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getHeroAsciiConfig(pathname: string): { videoSrc: string; loop: boolean } | null {
  const path = normalizeHeroPath(pathname);
  return HERO_ASCII_BY_PATH[path] ?? null;
}

/** Read video config from a persisted hero wrapper element (SSR or post–before-swap). */
export function readHeroPersistConfig(el: HTMLElement | null): { videoSrc: string; loop: boolean } | null {
  if (!el) return null;
  const videoSrc = el.dataset.heroVideo;
  if (!videoSrc) return null;
  return { videoSrc, loop: el.dataset.heroLoop === '1' };
}

/** Apply route config to the persisted shell (pathname is authoritative on client nav). */
export function applyHeroAsciiToShell(
  shell: HTMLElement | null,
  pathname: string
): { videoSrc: string; loop: boolean } | null {
  if (!shell) return null;
  const config = getHeroAsciiConfig(pathname);
  if (!config) {
    shell.setAttribute('hidden', '');
    return null;
  }
  shell.removeAttribute('hidden');
  shell.dataset.heroVideo = config.videoSrc;
  shell.dataset.heroLoop = config.loop ? '1' : '0';
  return config;
}

/**
 * Sync persisted hero video for ClientRouter swaps.
 * Prefer destination pathname (event.to) over incoming DOM — persist keeps the old shell,
 * and the incoming snapshot can lag behind the navigated route.
 */
export function syncPersistedHeroShell(
  existing: HTMLElement | null,
  incoming: HTMLElement | null,
  destinationPathname?: string
): { videoSrc: string; loop: boolean } | null {
  if (!existing) return null;

  if (destinationPathname) {
    return applyHeroAsciiToShell(existing, destinationPathname);
  }

  if (!incoming) {
    existing.setAttribute('hidden', '');
    return null;
  }
  existing.removeAttribute('hidden');
  const config = readHeroPersistConfig(incoming);
  if (!config) return null;
  existing.dataset.heroVideo = config.videoSrc;
  existing.dataset.heroLoop = config.loop ? '1' : '0';
  return config;
}
