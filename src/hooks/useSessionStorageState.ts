import { useState, useEffect } from "react";

/**
 * Hook that manages state synchronized with sessionStorage.
 *
 * Provides persistent state that survives page refreshes but is cleared when
 * the browser tab is closed. Automatically handles JSON serialization/deserialization
 * and provides SSR-safe initialization.
 *
 * @template T - The type of the stored value
 * @param key - The sessionStorage key to store the value under
 * @param initialValue - The default value used when no stored value exists
 *
 * @returns A tuple containing:
 *   - The current stored value (or initial value if none exists)
 *   - A setter function that updates both state and sessionStorage
 *
 * @example
 * ```tsx
 * function UserPreferences() {
 *   const [theme, setTheme] = useSessionStorageState('theme', 'light');
 *   const [sidebarOpen, setSidebarOpen] = useSessionStorageState('sidebar', true);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *         Current theme: {theme}
 *       </button>
 *       <button onClick={() => setSidebarOpen(!sidebarOpen)}>
 *         Sidebar: {sidebarOpen ? 'Open' : 'Closed'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-session-storage-state
 */
export function useSessionStorageState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from session storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to session storage
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue];
}
