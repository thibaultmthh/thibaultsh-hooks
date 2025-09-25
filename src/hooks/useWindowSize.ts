import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook that tracks the browser window dimensions and updates on resize.
 *
 * Automatically listens for window resize events and provides the current
 * width and height. Safe for SSR environments by checking for window availability.
 *
 * @returns An object containing:
 *   - `width`: Current window inner width in pixels
 *   - `height`: Current window inner height in pixels
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { width, height } = useWindowSize();
 *
 *   return (
 *     <div>
 *       <p>Window size: {width} x {height}</p>
 *       {width < 768 ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-window-size
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
