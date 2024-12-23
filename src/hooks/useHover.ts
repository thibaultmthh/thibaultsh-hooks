import { useState, useRef, useEffect, RefObject } from "react";

/**
 * Hook that detects hover state on an element
 * @param ref - (optional) React ref object for the element to monitor
 * @returns Tuple containing ref to attach to element and boolean indicating hover state
 */
export const useHover = <T extends HTMLElement = HTMLElement>(_ref?: RefObject<T>): [RefObject<T>, boolean] => {
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

  return [_ref || ref, isHovered];
};
