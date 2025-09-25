import { useState, useEffect, RefObject } from "react";

interface IntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Hook that tracks when an element enters or leaves the viewport using the Intersection Observer API.
 *
 * Useful for implementing lazy loading, infinite scrolling, animations on scroll,
 * or tracking visibility of elements for analytics purposes.
 *
 * @param elementRef - React ref object pointing to the target element to observe
 * @param options - Configuration options for the intersection observer:
 *   - `threshold`: Number or array defining at what percentage of visibility the callback should trigger (0-1)
 *   - `root`: Element used as viewport for checking visibility (defaults to browser viewport)
 *   - `rootMargin`: Margin around the root element (CSS-like syntax, e.g., "10px 20px")
 *   - `freezeOnceVisible`: If true, stops observing once element becomes visible (useful for one-time animations)
 *
 * @returns IntersectionObserverEntry object containing visibility information, or null if element not found
 *
 * @example
 * ```tsx
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const imgRef = useRef<HTMLImageElement>(null);
 *   const entry = useIntersectionObserver(imgRef, {
 *     threshold: 0.1,
 *     freezeOnceVisible: true
 *   });
 *
 *   const isVisible = entry?.isIntersecting;
 *
 *   return (
 *     <img
 *       ref={imgRef}
 *       src={isVisible ? src : undefined}
 *       alt={alt}
 *       style={{ opacity: isVisible ? 1 : 0 }}
 *     />
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-intersection-observer
 */
export function useIntersectionObserver<T extends HTMLElement>(
  elementRef: RefObject<T> | null,
  { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false }: IntersectionOptions = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    // Don't observe if element is already visible and freeze is enabled
    if (freezeOnceVisible && entry?.isIntersecting) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, entry?.isIntersecting]);

  return entry;
}
