import { useState, useEffect, RefObject } from "react";

interface IntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Hook that tracks element's intersection with viewport using IntersectionObserver
 * @param elementRef - React ref object pointing to the target element
 * @param options - IntersectionObserver options with additional freezeOnceVisible flag
 * @returns IntersectionObserverEntry if available, null otherwise
 */
export function useIntersectionObserver(
  elementRef: RefObject<HTMLElement>,
  {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
  }: IntersectionOptions = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = elementRef.current;
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