import { useEffect, useRef, RefObject } from "react";

type EventMap = WindowEventMap & HTMLElementEventMap & DocumentEventMap;

/**
 * Hook that adds an event listener to a target element with automatic cleanup.
 *
 * Automatically handles adding and removing event listeners, ensuring proper cleanup
 * when the component unmounts or dependencies change. Supports all standard DOM events
 * on window, document, or specific HTML elements.
 *
 * @template K - The event type key from the event map
 * @param eventName - The name of the event to listen for (e.g., 'click', 'keydown', 'resize')
 * @param handler - The event handler function that will be called when the event fires
 * @param element - Optional ref to the target element. Defaults to window if not provided
 * @param options - Optional event listener options (capture, once, passive, etc.)
 *
 * @example
 * ```tsx
 * function Component() {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *
 *   // Listen for clicks on a specific element
 *   useEventListener('click', (e) => {
 *     console.log('Button clicked!', e);
 *   }, buttonRef);r
 *
 *   // Listen for window resize events
 *   useEventListener('resize', () => {
 *     console.log('Window resized');
 *   });
 *
 *   // Listen for escape key presses
 *   useEventListener('keydown', (e) => {
 *     if (e.key === 'Escape') {
 *       console.log('Escape pressed');
 *     }
 *   });
 *
 *   return <button ref={buttonRef}>Click me</button>;
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-event-listener
 */
export function useEventListener<K extends keyof EventMap, T extends HTMLElement>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element?: RefObject<T | null> | null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element?.current || window;
    if (!targetElement?.addEventListener) return;

    const eventListener = (event: Event) => {
      savedHandler.current(event as EventMap[K]);
    };

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
