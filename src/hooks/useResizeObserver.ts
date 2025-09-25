import { useState, useEffect, RefObject } from "react";

interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly;
  contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  target: Element;
}

/**
 * Hook that observes element size changes using the ResizeObserver API.
 *
 * Provides detailed resize information including content rect, box sizes, and device pixel ratios.
 * Automatically cleans up the observer when the component unmounts or the ref changes.
 *
 * @param elementRef - React ref object pointing to the target element to observe
 *
 * @returns ResizeObserverEntry with detailed size information, or null if no element or no resize has occurred
 *   - `contentRect`: The content rectangle of the element
 *   - `contentBoxSize`: Array of content box dimensions
 *   - `borderBoxSize`: Array of border box dimensions
 *   - `devicePixelContentBoxSize`: Array of device pixel content box dimensions
 *   - `target`: The observed element
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const resizeEntry = useResizeObserver(containerRef);
 *
 *   const width = resizeEntry?.contentRect.width ?? 0;
 *   const height = resizeEntry?.contentRect.height ?? 0;
 *
 *   return (
 *     <div ref={containerRef}>
 *       <p>Size: {width} x {height}</p>
 *       <div>Content adapts based on container size</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-resize-observer
 */
export function useResizeObserver<T extends HTMLElement>(elementRef: RefObject<T> | null): ResizeObserverEntry | null {
  const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);

  useEffect(() => {
    if (!elementRef?.current) return;

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
