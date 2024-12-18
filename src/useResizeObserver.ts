import { useState, useEffect, RefObject } from "react";

interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly;
  contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  target: Element;
}

/**
 * Hook that tracks element's size changes using ResizeObserver with full entry details
 * @param elementRef - React ref object pointing to the target element
 * @returns Latest ResizeObserverEntry if available, null otherwise
 */
export function useResizeObserver(
  elementRef: RefObject<HTMLElement>
): ResizeObserverEntry | null {
  const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      setEntry(entries[0]);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef]);

  return entry;
} 