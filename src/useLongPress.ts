import { useCallback, useRef } from "react";

interface Options {
  /** Duration in milliseconds before long press is triggered */
  delay?: number;
  /** Callback when long press starts */
  onStart?: () => void;
  /** Callback when long press ends */
  onEnd?: () => void;
  /** Callback when long press is canceled */
  onCancel?: () => void;
}

/**
 * Hook that detects a long press gesture
 * @param callback - Function to call when long press is detected
 * @param options - Configuration options
 * @returns Object with event handlers to attach to target element
 */
export function useLongPress(callback: () => void, options: Options = {}) {
  const { delay = 400, onStart, onEnd, onCancel } = options;
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      event.preventDefault();
      const element = event.target;
      target.current = element;
      timeout.current = setTimeout(() => {
        onStart?.();
        callback();
      }, delay);
    },
    [callback, delay, onStart]
  );

  const clear = useCallback(
    (event: React.TouchEvent | React.MouseEvent, shouldTriggerEnd = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerEnd && onEnd?.();
      target.current = undefined;
    },
    [onEnd]
  );

  const cancel = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      clear(event, false);
      onCancel?.();
    },
    [clear, onCancel]
  );

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: cancel,
  };
}
