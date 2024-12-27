import { useState, useEffect, RefObject } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Hook that tracks an element's dimensions using ResizeObserver
 * @param elementRef - React ref object pointing to the target element
 * @returns Object containing current element width and height
 */
export function useElementSize(elementRef: RefObject<HTMLElement>): ElementSize {
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;

      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    resizeObserver.observe(element);
    setSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef]);

  return size;
}
