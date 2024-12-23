import { useCallback, useRef, useState, useEffect } from "react";

/**
 * Configuration options for the useLongPress hook
 */
interface LongPressOptions {
  /** Duration in milliseconds before long press is triggered (default: 400) */
  delay?: number;
  /** Whether to disable context menu on long press (default: true) */
  preventContext?: boolean;
  /** Callback fired when a normal press (shorter than delay) is completed */
  onPress?: () => void;
  /** Callback fired when a long press is successfully triggered */
  onLongPress?: () => void;
  /** Callback fired when a long press is canceled before completion */
  onLongPressCanceled?: () => void;
}

/**
 * Internal state for tracking press status and progress
 */
interface PressState {
  /** Whether the element is currently being pressed */
  isPressed: boolean;
  /** Whether the press has exceeded the long press threshold */
  isLongPressed: boolean;
  /** Progress towards completing a long press (0 to 1) */
  progress: number;
}

/**
 * A hook that handles both normal press and long press interactions
 *
 * @param options - Configuration options for the long press behavior
 * @param options.delay - Duration in milliseconds before a press is considered a long press (default: 400)
 * @param options.preventContext - When true, prevents the default context menu on long press (default: true)
 * @param options.onPress - Callback fired when a normal press (shorter than delay) is completed.
 *                         Triggers only if the press duration was less than the specified delay
 * @param options.onLongPress - Callback fired when a long press is successfully triggered.
 *                             Triggers exactly once when the press duration exceeds the delay
 * @param options.onLongPressCanceled - Callback fired when a long press is canceled before completion.
 *                                     Triggers if the press is released or canceled before reaching the delay threshold
 * @returns Object containing event handlers and current press state
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { handlers, state } = useLongPress({
 *     delay: 1000,
 *     onPress: () => console.log('Normal press'),
 *     onLongPress: () => console.log('Long press completed'),
 *     onLongPressCanceled: () => console.log('Long press canceled'),
 *   });
 *
 *   return (
 *     <button {...handlers}>
 *       {state.isLongPressed
 *         ? 'Long Press!'
 *         : `Hold me (${Math.round(state.progress * 100)}%)`}
 *     </button>
 *   );
 * };
 * ```
 */
export function useLongPress(options: LongPressOptions = {}) {
  const { delay = 400, preventContext = true, onPress, onLongPress, onLongPressCanceled } = options;

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const startTime = useRef<number>(0);
  const frameRef = useRef<number>();

  const [pressState, setPressState] = useState<PressState>({
    isPressed: false,
    isLongPressed: false,
    progress: 0,
  });

  /**
   * Updates the progress of the long press animation
   * Uses requestAnimationFrame for smooth updates
   */
  const updateProgress = useCallback(() => {
    if (!startTime.current || !pressState.isPressed) return;

    const elapsed = Date.now() - startTime.current;
    const newProgress = Math.min(elapsed / delay, 1);

    setPressState((prev) => ({ ...prev, progress: newProgress }));

    if (newProgress < 1) {
      frameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [delay, pressState.isPressed]);

  // Cleanup animation frames and timeouts on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  /**
   * Handles the start of a press interaction
   * Initializes timers and starts progress tracking
   */
  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (preventContext) {
        event.preventDefault();
      }

      startTime.current = Date.now();
      setPressState({ isPressed: true, isLongPressed: false, progress: 0 });
      frameRef.current = requestAnimationFrame(updateProgress);

      timeout.current = setTimeout(() => {
        setPressState((prev) => ({ ...prev, isLongPressed: true }));
        onLongPress?.();
      }, delay);
    },
    [delay, onLongPress, preventContext, updateProgress]
  );

  /**
   * Handles the end of a press interaction
   * Determines if it was a long press and fires appropriate callbacks
   */
  const end = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeout.current) clearTimeout(timeout.current);

      const wasLongPress = pressState.isLongPressed;

      if (!wasLongPress) {
        if (pressState.progress < 1) {
          onLongPressCanceled?.();
        }
        onPress?.();
      }

      setPressState({ isPressed: false, isLongPressed: false, progress: 0 });
    },
    [onLongPressCanceled, onPress, pressState.isLongPressed, pressState.progress]
  );

  /**
   * Handles cancellation of a press interaction
   * (e.g., pointer leave or touch cancel events)
   */
  const cancel = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeout.current) clearTimeout(timeout.current);

      if (pressState.isPressed && !pressState.isLongPressed) {
        onLongPressCanceled?.();
      }

      setPressState({ isPressed: false, isLongPressed: false, progress: 0 });
    },
    [onLongPressCanceled, pressState.isPressed, pressState.isLongPressed]
  );

  return {
    /** Event handlers to attach to the target element */
    handlers: {
      onMouseDown: start,
      onMouseUp: end,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: end,
      onTouchCancel: cancel,
    },
    /** Current state of the press interaction */
    state: {
      isPressed: pressState.isPressed,
      isLongPressed: pressState.isLongPressed,
      progress: pressState.progress,
    },
  };
}
