import { useState, useEffect } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook that tracks the current window scroll position in real-time.
 *
 * Automatically updates when the user scrolls and handles SSR scenarios
 * by safely checking for window availability.
 *
 * @returns An object containing:
 *   - `x`: Horizontal scroll position in pixels
 *   - `y`: Vertical scroll position in pixels
 *
 * @example
 * ```tsx
 * function ScrollIndicator() {
 *   const { x, y } = useScrollPosition();
 *
 *   return (
 *     <div className="scroll-info">
 *       <p>Horizontal: {x}px</p>
 *       <p>Vertical: {y}px</p>
 *       {y > 100 && (
 *         <button onClick={() => window.scrollTo(0, 0)}>
 *           Back to Top
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-scroll-position
 */
export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}
