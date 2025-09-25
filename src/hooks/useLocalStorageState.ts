import { useState, useEffect } from "react";

/**
 * Hook that manages state synchronized with localStorage.
 *
 * Provides a useState-like interface that automatically persists state changes
 * to localStorage and initializes from stored values on mount. Handles SSR
 * compatibility and JSON serialization/deserialization automatically.
 *
 * @template T - The type of the value being stored
 * @param key - The localStorage key to use for persistence
 * @param initialValue - The default value to use if no stored value exists
 *
 * @returns A tuple containing:
 *   - Current stored value (T)
 *   - Setter function that updates both state and localStorage
 *
 * @example
 * ```tsx
 * function UserPreferences() {
 *   const [theme, setTheme] = useLocalStorageState('theme', 'light');
 *   const [settings, setSettings] = useLocalStorageState('settings', {
 *     notifications: true,
 *     language: 'en'
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *         Current theme: {theme}
 *       </button>
 *
 *       <button onClick={() => setSettings(prev => ({
 *         ...prev,
 *         notifications: !prev.notifications
 *       }))}>
 *         Notifications: {settings.notifications ? 'On' : 'Off'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-local-storage-state
 */
export function useLocalStorageState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue];
}
