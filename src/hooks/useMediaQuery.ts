import { useEffect, useState } from "react";

/**
 * Hook that tracks the state of a CSS media query and updates when it changes.
 *
 * Provides a reactive way to respond to viewport changes, screen sizes, or any
 * CSS media query conditions in your React components.
 *
 * @param query - The CSS media query string to track (e.g., "(min-width: 768px)")
 *
 * @returns Boolean indicating whether the media query currently matches
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 *   const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileLayout />}
 *       {isTablet && <TabletLayout />}
 *       {isDarkMode ? <DarkTheme /> : <LightTheme />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-media-query
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
};
