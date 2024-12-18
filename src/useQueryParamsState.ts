import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing state persisted in URL query parameters
 * @param key - The query parameter key
 * @param initialValue - The initial value to use if the parameter doesn't exist
 * @param options - Configuration options
 * @param options.serialize - Function to convert value to string (default: JSON.stringify)
 * @param options.deserialize - Function to parse string back to value (default: JSON.parse)
 * @returns A tuple containing the current value and a setter function
 */
export function useQueryParamsState<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
): [T, (value: T) => void] {
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
    (newValue: T) => {
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
