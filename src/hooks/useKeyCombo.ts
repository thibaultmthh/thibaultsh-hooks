import { useEffect, useState } from "react";

type KeyCombo = string[];

/**
 * Hook that detects when a specific combination of keys is pressed
 * @param targetCombo - Array of keys that make up the combination (e.g., ["Control", "Shift", "a"])
 * @returns boolean indicating if the combination is currently active
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
