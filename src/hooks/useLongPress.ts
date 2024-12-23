import { useCallback, useRef, useState } from "react";

interface LongPressOptions {
  /** Duration in milliseconds before long press is triggered (default: 400) */
  delay?: number;
  /** Whether to disable context menu on long press (default: true) */
  preventContext?: boolean;
  /** Callbacks for different long press states */
  onLongPressStart?: () => void;
  onLongPress?: () => void;
  onLongPressEnd?: () => void;
  /** Callbacks for normal press states */
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  /** Callback when long press is canceled */
  onCancel?: () => void;
}

interface PressState {
  isPressed: boolean;
  isLongPressed: boolean;
}

/**
 * Hook that handles long press interactions for both mouse and touch events
 * @param options - Configuration options for the long press behavior
 * @param options.delay - Duration in milliseconds before long press is triggered (default: 400)
 * @param options.preventContext - Whether to disable context menu on long press (default: true)
 * @param options.onLongPressStart - Callback fired when long press starts
 * @param options.onLongPress - Callback fired when long press is triggered
 * @param options.onLongPressEnd - Callback fired when long press ends
 * @param options.onPress - Callback fired for normal press (when released before long press triggers)
 * @param options.onPressStart - Callback fired when press starts
 * @param options.onPressEnd - Callback fired when press ends
 * @param options.onCancel - Callback fired when press is canceled
 * @returns Object containing event handlers and current press state
 */
export function useLongPress(options: LongPressOptions = {}) {
  const {
    delay = 400,
    preventContext = true,
    onLongPressStart,
    onLongPress,
    onLongPressEnd,
    onPress,
    onPressStart,
    onPressEnd,
    onCancel,
  } = options;

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const [pressState, setPressState] = useState<PressState>({
    isPressed: false,
    isLongPressed: false,
  });

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (preventContext) {
        event.preventDefault();
      }

      setPressState((prev) => ({ ...prev, isPressed: true }));
      onPressStart?.();

      timeout.current = setTimeout(() => {
        setPressState((prev) => ({ ...prev, isLongPressed: true }));
        onLongPressStart?.();
        onLongPress?.();
      }, delay);
    },
    [delay, onLongPress, onLongPressStart, onPressStart, preventContext]
  );

  const end = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      const wasLongPress = pressState.isLongPressed;

      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      if (wasLongPress) {
        onLongPressEnd?.();
      } else {
        onPress?.();
      }

      onPressEnd?.();
      setPressState({ isPressed: false, isLongPressed: false });
    },
    [onLongPressEnd, onPress, onPressEnd, pressState]
  );

  const cancel = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      onCancel?.();
      onPressEnd?.();
      setPressState({ isPressed: false, isLongPressed: false });
    },
    [onCancel, onPressEnd]
  );

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: end,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: end,
      onTouchCancel: cancel,
    },
    state: {
      isPressed: pressState.isPressed,
      isLongPressed: pressState.isLongPressed,
    },
  };
}
