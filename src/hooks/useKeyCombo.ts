import { useEffect, useState } from "react";

type KeyCombo = string[];

/**
 * Hook that detects when a specific combination of keys is pressed simultaneously.
 *
 * Useful for implementing keyboard shortcuts, hotkeys, or complex key combinations
 * in your React components. The hook tracks all currently pressed keys and returns
 * true when all keys in the target combination are active.
 *
 * @param targetCombo - Array of key names that make up the combination
 *
 * @returns Boolean indicating if all keys in the combination are currently pressed
 *
 * @example
 * ```tsx
 * function App() {
 *   const isSaveCombo = useKeyCombo(['Control', 's']);
 *   const isUndoCombo = useKeyCombo(['Control', 'z']);
 *   const isComplexCombo = useKeyCombo(['Control', 'Shift', 'p']);
 *
 *   useEffect(() => {
 *     if (isSaveCombo) {
 *       console.log('Save shortcut pressed!');
 *       // Handle save action
 *     }
 *   }, [isSaveCombo]);
 *
 *   return (
 *     <div>
 *       <p>Press Ctrl+S to save</p>
 *       <p>Save combo active: {isSaveCombo ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-key-combo
 */
export function useKeyCombo(targetCombo: KeyCombo): boolean {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((prev) => new Set([...prev, event.key]));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(event.key);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return targetCombo.every((key) => pressedKeys.has(key));
}
