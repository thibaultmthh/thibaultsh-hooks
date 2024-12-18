import { useEffect, useRef, RefObject } from "react";

type EventMap = WindowEventMap & HTMLElementEventMap & DocumentEventMap;

/**
 * Hook that adds an event listener to a target element or window
 * @param eventName - Name of the event to listen for
 * @param handler - Event handler function
 * @param element - Target element (defaults to window)
 * @param options - AddEventListener options
 */
export function useEventListener<K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element?: RefObject<HTMLElement> | null,
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