import { useState, useEffect, useRef } from "react";

/**
 * Hook that throttles a value, limiting how often it can update.
 *
 * Unlike debouncing which delays execution until after a quiet period, throttling
 * ensures the value updates at most once per specified interval, making it ideal
 * for scroll events, resize handlers, or any high-frequency updates.
 *
 * @template T - The type of the value being throttled
 * @param value - The value to throttle
 * @param interval - The minimum time interval between updates in milliseconds
 *
 * @returns The throttled value that updates at most once per interval
 *
 * @example
 * ```tsx
 * function ScrollTracker() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 100);
 *
 *   useEffect(() => {
 *     const handleScroll = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, []);
 *
 *   useEffect(() => {
 *     // This will only run at most once every 100ms
 *     console.log('Throttled scroll position:', throttledScrollY);
 *   }, [throttledScrollY]);
 *
 *   return <div>Scroll position: {throttledScrollY}px</div>;
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-throttle
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timeoutId = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timeoutId);
    }
  }, [value, interval]);

  return throttledValue;
}
