import { useEffect, RefObject } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Hook that detects clicks outside a referenced element and executes a callback.
 *
 * Useful for implementing dropdown menus, modals, or any component that should
 * close when the user clicks outside of it. Handles both mouse and touch events.
 *
 * @template T - The type of HTML element being referenced
 * @param ref - React ref object pointing to the element to monitor
 * @param handler - Callback function executed when a click occurs outside the element
 *
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(dropdownRef, () => {
 *     setIsOpen(false);
 *   });
 *
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>
 *         Toggle Dropdown
 *       </button>
 *       {isOpen && (
 *         <div className="dropdown-menu">
 *           <p>Dropdown content</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-click-outside
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | null,
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
