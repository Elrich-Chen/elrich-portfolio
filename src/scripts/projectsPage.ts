let cleanupProjectsCarousel: (() => void) | null = null;

function bindProjectLinkClicks() {
  document.querySelectorAll('.projects-container .icon-link').forEach((el) => {
    if (el instanceof HTMLAnchorElement && el.dataset.projectLinkBound === '1') return;
    if (el instanceof HTMLAnchorElement) {
      el.dataset.projectLinkBound = '1';
      el.addEventListener('click', () => {
        const card = el.closest('article');
        const projectName = card?.querySelector('.card-title')?.textContent?.trim() || 'unknown';
        window.posthog?.capture('project_link_clicked', {
          project_name: projectName,
          href: el.getAttribute('href') || '',
        });
      });
    }
  });
}

export function cleanupProjectsCarouselState() {
  cleanupProjectsCarousel?.();
  cleanupProjectsCarousel = null;
}

function initProjectsCarousel() {
  cleanupProjectsCarouselState();

  const carousel = document.querySelector('.projects-carousel');
  const viewport = carousel?.querySelector('.carousel-viewport');
  const track = carousel?.querySelector('.carousel-track');
  const prevButton = carousel?.querySelector('.carousel-arrow--prev');
  const nextButton = carousel?.querySelector('.carousel-arrow--next');
  const statusCurrent = carousel?.querySelector('[data-carousel-current]');
  if (
    !(carousel instanceof HTMLElement) ||
    !(viewport instanceof HTMLElement) ||
    !(track instanceof HTMLElement) ||
    !(prevButton instanceof HTMLButtonElement) ||
    !(nextButton instanceof HTMLButtonElement)
  ) {
    return;
  }
  if (carousel.dataset.carouselReady === '1') return;

  const realSlides = Array.from(
    track.querySelectorAll<HTMLElement>('.carousel-slide:not([data-clone])'),
  );
  if (realSlides.length <= 1) return;

  const cloneCount = Math.min(Number(track.dataset.cloneCount) || 3, realSlides.length);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitionValue = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)';
  let reducedMotionEnabled = reducedMotion.matches;
  let cardStep = 0;
  let activeIndex = cloneCount;
  let isTransitioning = false;

  const createClone = (node: HTMLElement, suffix: string) => {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.dataset.clone = suffix;
    clone.setAttribute('aria-hidden', 'true');
    clone
      .querySelectorAll<HTMLElement>('a, button, input, select, textarea, summary, [tabindex]')
      .forEach((focusable) => {
        focusable.setAttribute('tabindex', '-1');
      });
    return clone;
  };

  const headClones = realSlides
    .slice(-cloneCount)
    .map((slide, idx) => createClone(slide, `head-${idx}`));
  const tailClones = realSlides
    .slice(0, cloneCount)
    .map((slide, idx) => createClone(slide, `tail-${idx}`));
  headClones.forEach((clone) => track.prepend(clone));
  tailClones.forEach((clone) => track.append(clone));

  const applyTransition = () => {
    track.style.transition = reducedMotionEnabled ? 'none' : transitionValue;
  };

  const updateMeasurements = () => {
    const firstSlide = track.querySelector<HTMLElement>('.carousel-slide:not([data-clone])');
    if (!firstSlide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
    cardStep = firstSlide.getBoundingClientRect().width + gap;
  };

  const applyTransform = (withTransition = true) => {
    if (!cardStep) updateMeasurements();
    if (!cardStep) return;
    if (!withTransition) {
      track.style.transition = 'none';
    } else {
      applyTransition();
    }
    track.style.transform = `translateX(${-(activeIndex * cardStep)}px)`;
    if (!withTransition) {
      track.getBoundingClientRect();
      applyTransition();
    }
  };

  const getRealSlideIndex = () => {
    const offset = activeIndex - cloneCount;
    return ((offset % realSlides.length) + realSlides.length) % realSlides.length;
  };

  const updateCarouselStatus = () => {
    if (!(statusCurrent instanceof HTMLElement)) return;
    statusCurrent.textContent = String(getRealSlideIndex() + 1);
  };

  const normalizeIndex = () => {
    const maxRealIndex = cloneCount + realSlides.length - 1;
    if (activeIndex < cloneCount) {
      activeIndex += realSlides.length;
      applyTransform(false);
    } else if (activeIndex > maxRealIndex) {
      activeIndex -= realSlides.length;
      applyTransform(false);
    }
    isTransitioning = false;
    updateCarouselStatus();
  };

  const moveBy = (delta: number) => {
    if (isTransitioning && !reducedMotionEnabled) return;
    isTransitioning = !reducedMotionEnabled;
    activeIndex += delta;
    updateCarouselStatus();
    applyTransform(!reducedMotionEnabled);
    if (reducedMotionEnabled) {
      normalizeIndex();
    }
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== 'transform') return;
    normalizeIndex();
  };

  const onReducedMotionChange = (event: MediaQueryListEvent) => {
    reducedMotionEnabled = event.matches;
    applyTransition();
  };

  const onResize = () => {
    updateMeasurements();
    applyTransform(false);
  };

  const onViewportKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(1);
    }
  };

  const onPrevClick = () => moveBy(-1);
  const onNextClick = () => moveBy(1);

  track.addEventListener('transitionend', onTransitionEnd);
  reducedMotion.addEventListener('change', onReducedMotionChange);
  prevButton.addEventListener('click', onPrevClick);
  nextButton.addEventListener('click', onNextClick);
  viewport.addEventListener('keydown', onViewportKeydown);
  window.addEventListener('resize', onResize);

  applyTransition();
  updateMeasurements();
  applyTransform(false);
  updateCarouselStatus();
  carousel.dataset.carouselReady = '1';

  cleanupProjectsCarousel = () => {
    track.removeEventListener('transitionend', onTransitionEnd);
    reducedMotion.removeEventListener('change', onReducedMotionChange);
    prevButton.removeEventListener('click', onPrevClick);
    nextButton.removeEventListener('click', onNextClick);
    viewport.removeEventListener('keydown', onViewportKeydown);
    window.removeEventListener('resize', onResize);
    track.querySelectorAll('[data-clone]').forEach((clone) => clone.remove());
    track.style.transform = '';
    track.style.transition = '';
    delete carousel.dataset.carouselReady;
  };
}

export function initProjectsPage() {
  if (!document.querySelector('.projects-container')) return;
  bindProjectLinkClicks();
  initProjectsCarousel();
}
