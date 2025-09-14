/**
 * Focuses the results section and scrolls to it based on layout mode
 * Mobile: smooth scroll to results
 * Desktop: programmatic focus only (no scroll)
 */
export function focusResults(): void {
  const resultsElement = document.getElementById('results-root');
  if (!resultsElement) return;

  // Check if we're in mobile layout
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  
  if (isMobile) {
    // Mobile: smooth scroll to results section
    resultsElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  } else {
    // Desktop: focus for keyboard users, no scroll
    // Results are already visible in sidebar layout
    (resultsElement as HTMLElement).focus({ 
      preventScroll: true 
    });
  }
}

/**
 * Scrolls to the top of the results section smoothly
 * Used when changing countries or refreshing results
 */
export function scrollToResults(): void {
  const resultsElement = document.getElementById('results-root');
  if (!resultsElement) return;

  // Always scroll on explicit result changes
  resultsElement.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

/**
 * Focuses the first interactive element within the results
 * Used for keyboard accessibility after results are loaded
 */
export function focusFirstResult(): void {
  const resultsElement = document.getElementById('results-root');
  if (!resultsElement) return;

  // Find the first focusable element in results
  const firstFocusable = resultsElement.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as HTMLElement;

  if (firstFocusable) {
    firstFocusable.focus();
  } else {
    // Fallback to results container
    (resultsElement as HTMLElement).focus();
  }
}

/**
 * Announces results to screen readers
 */
export function announceResults(count: number, currency: string): void {
  // Create or update live region for screen readers
  let liveRegion = document.getElementById('results-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'results-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  // Announce results
  const message = count > 0 
    ? `${count} exchange rates found for ${currency}`
    : `No exchange rates found`;
  
  liveRegion.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  }, 1000);
}

/**
 * Handles reduced motion preferences for animations
 */
export function respectsReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smooth scroll with reduced motion support
 */
export function smoothScrollTo(element: Element, options: ScrollIntoViewOptions = {}): void {
  const shouldReduce = respectsReducedMotion();
  
  element.scrollIntoView({
    behavior: shouldReduce ? 'auto' : 'smooth',
    block: 'start',
    ...options
  });
}