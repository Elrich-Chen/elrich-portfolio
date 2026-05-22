/** Canonical slideshow order for main portfolio pages (circular). */
export const PAGE_FLOW_ORDER = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/projects/', label: 'Projects' },
  { href: '/photos/', label: 'Photos' },
  { href: '/hobbies/', label: 'Hobbies' },
] as const;

export type PageFlowEntry = (typeof PAGE_FLOW_ORDER)[number];

export function normalizeFlowPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** True only for exact top-level flow routes (not hobby slugs/tags). */
export function isPageFlowRoute(pathname: string): boolean {
  const path = normalizeFlowPath(pathname);
  return PAGE_FLOW_ORDER.some((entry) => normalizeFlowPath(entry.href) === path);
}

export function getPageFlowNeighbors(pathname: string): {
  prev: PageFlowEntry;
  next: PageFlowEntry;
  current: PageFlowEntry;
} | null {
  const path = normalizeFlowPath(pathname);
  const index = PAGE_FLOW_ORDER.findIndex((entry) => normalizeFlowPath(entry.href) === path);
  if (index === -1) return null;

  const len = PAGE_FLOW_ORDER.length;
  return {
    current: PAGE_FLOW_ORDER[index],
    prev: PAGE_FLOW_ORDER[(index - 1 + len) % len],
    next: PAGE_FLOW_ORDER[(index + 1) % len],
  };
}

/** Site-wide edge arrows on main flow routes (Home → About → Projects → Photos → Hobbies). */
export function shouldShowPageFlowNav(pathname: string): boolean {
  return getPageFlowNeighbors(pathname) !== null;
}
