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
 * Hook that tracks scroll position and dimensions of a container element
 * @param containerRef - React ref object pointing to the container element
 * @param delay - Delay in milliseconds before setting isScrolling to false
 * @returns Object containing scroll position and dimension information
 */
export function useContainerScroll(containerRef: RefObject<HTMLElement>, delay: number = 150): ContainerScroll {
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
