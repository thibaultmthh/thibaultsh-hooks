import { useState, useEffect, RefObject } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Hook that tracks an element's dimensions and updates when the element is resized.
 *
 * Uses ResizeObserver to efficiently monitor size changes and provides real-time
 * width and height measurements. Automatically handles cleanup and provides
 * initial measurements immediately.
 *
 * @param elementRef - React ref object pointing to the target HTML element
 *
 * @returns An object containing:
 *   - `width`: Current width of the element in pixels
 *   - `height`: Current height of the element in pixels
 *
 * @example
 * ```tsx
 * function ResizableComponent() {
 *   const elementRef = useRef<HTMLDivElement>(null);
 *   const { width, height } = useElementSize(elementRef);
 *
 *   return (
 *     <div>
 *       <div ref={elementRef} style={{ resize: 'both', overflow: 'auto' }}>
 *         Resizable content
 *       </div>
 *       <p>Size: {width} x {height}px</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-element-size
 */
export function useElementSize<T extends HTMLElement>(elementRef: RefObject<T | null> | null): ElementSize {
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!elementRef?.current) return;

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
