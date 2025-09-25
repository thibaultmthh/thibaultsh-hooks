import { useState, useRef, useEffect, RefObject } from "react";

/**
 * Hook that detects when an element is being hovered over.
 *
 * Provides a simple way to track hover state for any HTML element, with support
 * for both internal ref management and external ref usage.
 *
 * @template T - The type of HTML element being monitored (extends HTMLElement)
 * @param _ref - Optional React ref object for the element to monitor. If not provided,
 *               the hook will create and return its own ref.
 *
 * @returns A tuple containing:
 *   - `ref`: React ref object to attach to the target element
 *   - `isHovered`: Boolean indicating whether the element is currently being hovered
 *
 * @example
 * ```tsx
 * // Using the hook's internal ref
 * function HoverButton() {
 *   const [ref, isHovered] = useHover<HTMLButtonElement>();
 *
 *   return (
 *     <button
 *       ref={ref}
 *       style={{ backgroundColor: isHovered ? 'lightblue' : 'white' }}
 *     >
 *       {isHovered ? 'Hovered!' : 'Hover me'}
 *     </button>
 *   );
 * }
 *
 * // Using an external ref
 * function HoverDiv() {
 *   const myRef = useRef<HTMLDivElement>(null);
 *   const [, isHovered] = useHover(myRef);
 *
 *   return (
 *     <div ref={myRef}>
 *       {isHovered && <span>You're hovering!</span>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-hover
 */
export const useHover = <T extends HTMLElement>(_ref?: RefObject<T | null> | null): [RefObject<T>, boolean] => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = _ref?.current || ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return [(ref as RefObject<T>) || _ref, isHovered];
};
