import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook that tracks window dimensions
 * @returns Object containing current window width and height
 * @example
 * const { width, height } = useWindowSize();
 * console.log(width, height);
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