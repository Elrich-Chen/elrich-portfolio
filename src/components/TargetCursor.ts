// Lightweight target cursor with no dependencies
// Creates a custom crosshair cursor that follows mouse movement

let cursor: HTMLElement | null = null;
let cursorDot: HTMLElement | null = null;

function init() {
  // Create cursor elements
  cursor = document.createElement('div');
  cursor.className = 'target-cursor';

  cursorDot = document.createElement('div');
  cursorDot.className = 'target-cursor-dot';

  cursor.appendChild(cursorDot);
  document.body.appendChild(cursor);

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Expand on hover over interactive elements
  const interactiveElements = 'a, button, input, textarea, [role="button"], .cursor-target';

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(interactiveElements)) {
      cursor?.classList.add('target-cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(interactiveElements)) {
      cursor?.classList.remove('target-cursor-hover');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor?.classList.add('target-cursor-hidden');
  });

  document.addEventListener('mouseenter', () => {
    cursor?.classList.remove('target-cursor-hidden');
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
