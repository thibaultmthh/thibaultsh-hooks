import { useState, useEffect, useCallback } from "react";

/**
 * Hook that manages state synchronized with URL query parameters.
 *
 * Automatically persists state to the URL and keeps it in sync with browser
 * navigation (back/forward buttons). Perfect for shareable URLs and maintaining
 * state across page refreshes.
 *
 * @template T - The type of the state value
 * @param key - The query parameter key to use in the URL
 * @param initialValue - Default value when the parameter doesn't exist
 * @param options - Configuration options for serialization
 * @param options.serialize - Custom function to convert value to string (defaults to JSON.stringify)
 * @param options.deserialize - Custom function to parse string back to value (defaults to JSON.parse)
 *
 * @returns A tuple containing:
 *   - Current state value (synced with URL)
 *   - Setter function (updates both state and URL)
 *
 * @example
 * ```tsx
 * function SearchPage() {
 *   const [query, setQuery] = useQueryParamsState('q', '');
 *   const [filters, setFilters] = useQueryParamsState('filters', { category: 'all' });
 *
 *   return (
 *     <div>
 *       <input
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       <select
 *         value={filters.category}
 *         onChange={(e) => setFilters({ ...filters, category: e.target.value })}
 *       >
 *         <option value="all">All</option>
 *         <option value="books">Books</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-query-params-state
 */
export function useQueryParamsState<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
): [T, (value: T | ((val: T) => T)) => void] {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  // Read value from URL
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const item = params.get(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading query parameter "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize]);

  const [value, setValue] = useState<T>(readValue);

  // Update state and URL when value changes
  const updateValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;

        // Update state
        setValue(valueToStore);

        // Update URL
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          params.set(key, serialize(valueToStore));

          // Update URL without causing page reload
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);
        }
      } catch (error) {
        console.warn(`Error setting query parameter "${key}":`, error);
      }
    },
    [key, serialize, value]
  );

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setValue(readValue());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [readValue]);

  return [value, updateValue];
}
