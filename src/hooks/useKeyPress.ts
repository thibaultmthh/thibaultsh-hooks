import { useEffect, useState } from "react";

/**
 * Hook that detects when a specific key is pressed and held down.
 *
 * Tracks the current pressed state of a keyboard key, returning true while
 * the key is held down and false when released.
 *
 * @param targetKey - The key to detect (e.g., "Enter", "Escape", "ArrowUp", "a")
 *
 * @returns Boolean indicating if the target key is currently pressed
 *
 * @example
 * ```tsx
 * function GameControls() {
 *   const isSpacePressed = useKeyPress(' ');
 *   const isEnterPressed = useKeyPress('Enter');
 *   const isArrowUpPressed = useKeyPress('ArrowUp');
 *
 *   return (
 *     <div>
 *       <p>Space: {isSpacePressed ? 'Pressed' : 'Released'}</p>
 *       <p>Enter: {isEnterPressed ? 'Pressed' : 'Released'}</p>
 *       <p>Arrow Up: {isArrowUpPressed ? 'Pressed' : 'Released'}</p>
 *
 *       {isSpacePressed && <div>🚀 Boost active!</div>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-key-press
 */
export function useKeyPress(targetKey: string): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKey]);

  return isPressed;
}
