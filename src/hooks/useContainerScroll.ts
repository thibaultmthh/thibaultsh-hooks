import { useState, useEffect, RefObject } from "react";

interface ContainerScroll {
  scrollTop: number;
  scrollLeft: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  isScrolling: boolean;
}

/**
 * Hook that tracks scroll position, dimensions, and scrolling state of a container element.
 *
 * Provides real-time scroll information including position, dimensions, and a debounced
 * scrolling indicator that's useful for optimizing scroll-based animations or effects.
 *
 * @param containerRef - React ref object pointing to the scrollable container element
 * @param delay - Delay in milliseconds before setting `isScrolling` to false (default: 150)
 *
 * @returns An object containing:
 *   - `scrollTop`: Vertical scroll position in pixels
 *   - `scrollLeft`: Horizontal scroll position in pixels
 *   - `scrollWidth`: Total scrollable width of the content
 *   - `scrollHeight`: Total scrollable height of the content
 *   - `clientWidth`: Visible width of the container
 *   - `clientHeight`: Visible height of the container
 *   - `isScrolling`: Boolean indicating if the user is currently scrolling (debounced)
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const scroll = useContainerScroll(containerRef, 200);
 *
 * return (
 *   <div ref={containerRef} className="scrollable-container">
 *     <div>Scroll position: {scroll.scrollTop}px</div>
 *     <div>Container size: {scroll.clientWidth}x{scroll.clientHeight}</div>
 *     <div>Content size: {scroll.scrollWidth}x{scroll.scrollHeight}</div>
 *     {scroll.isScrolling && <div>Currently scrolling...</div>}
 *
 *     <div style={{ height: '2000px' }}>Long content...</div>
 *   </div>
 * );
 * ```
 * @see https://thibault.sh/hooks/use-container-scroll
 */
export function useContainerScroll(containerRef: RefObject<HTMLElement | null>, delay: number = 150): ContainerScroll {
  const [scroll, setScroll] = useState<ContainerScroll>({
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
    isScrolling: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const element = containerRef.current;

    const handleScroll = () => {
      const { scrollTop, scrollLeft, scrollWidth, scrollHeight, clientWidth, clientHeight } = element;

      setScroll((prev) => ({
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
        isScrolling: true,
      }));

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScroll((prev) => ({ ...prev, isScrolling: false }));
      }, delay);
    };

    element.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      element.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [containerRef]);

  return scroll;
}
