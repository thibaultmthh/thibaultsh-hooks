import { useEffect, RefObject } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Hook that handles click outside of the referenced element
 * @param ref - React ref object for the element to monitor
 * @param handler - Callback function to execute when click outside occurs
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | null,
  handler: Handler
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref?.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
