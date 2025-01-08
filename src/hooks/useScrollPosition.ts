import { useState, useEffect } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook that tracks window scroll position
 * @returns Object containing current scroll x and y coordinates
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