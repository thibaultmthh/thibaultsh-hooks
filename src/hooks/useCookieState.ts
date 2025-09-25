import { useState, useCallback } from "react";

/**
 * Options for configuring cookie behavior
 */
interface CookieOptions {
  /** Number of days until the cookie expires (default: 7) */
  days?: number;
  /** Cookie path (default: "/") */
  path?: string;
  /** Cookie domain */
  domain?: string;
  /** Whether the cookie requires HTTPS (default: false) */
  secure?: boolean;
  /** SameSite cookie attribute (default: "Lax") */
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Hook for managing state that persists in browser cookies with SSR support.
 *
 * Provides a React state-like interface for reading, writing, and deleting cookies.
 * Automatically handles encoding/decoding, error handling, and server-side rendering compatibility.
 *
 * @param name - The name of the cookie to manage
 * @param initialValue - The default value to use when no cookie exists or on server-side
 *
 * @returns A tuple containing:
 *   - `value`: Current cookie value as string, or null if not set
 *   - `setCookie`: Function to update the cookie with optional configuration
 *   - `deleteCookie`: Function to remove the cookie from the browser
 *
 * @example
 * ```tsx
 * const [theme, setTheme, deleteTheme] = useCookieState('theme', 'light');
 *
 * // Read current value
 * console.log(theme); // 'light' or saved value
 *
 * // Update cookie with default options (7 days expiry)
 * setTheme('dark');
 *
 * // Update with custom options
 * setTheme('dark', {
 *   days: 30,
 *   secure: true,
 *   sameSite: 'Strict'
 * });
 *
 * // Remove the cookie
 * deleteTheme();
 * ```
 *
 * @example
 * ```tsx
 * // User preferences with longer expiry
 * const [userPrefs, setUserPrefs] = useCookieState('preferences', '{}');
 *
 * const updatePreference = (key: string, value: any) => {
 *   const prefs = JSON.parse(userPrefs || '{}');
 *   prefs[key] = value;
 *   setUserPrefs(JSON.stringify(prefs), { days: 365 });
 * };
 * ```
 * @see https://thibault.sh/hooks/use-cookie-state
 */
export function useCookieState(
  name: string,
  initialValue: string
): [string | null, (newValue: string, options?: CookieOptions) => void, () => void] {
  const [value, setValue] = useState<string | null>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));

      return cookie ? decodeURIComponent(cookie.split("=")[1]) : initialValue;
    } catch (error) {
      console.warn(`Error reading cookie "${name}":`, error);
      return initialValue;
    }
  });

  const setCookie = useCallback(
    (newValue: string, options: CookieOptions = {}) => {
      if (typeof window === "undefined") return;

      try {
        const { days = 7, path = "/", domain, secure = false, sameSite = "Lax" } = options;

        const expires = new Date(Date.now() + days * 864e5).toUTCString();

        document.cookie = [
          `${name}=${encodeURIComponent(newValue)}`,
          `expires=${expires}`,
          `path=${path}`,
          domain ? `domain=${domain}` : "",
          secure ? "secure" : "",
          `SameSite=${sameSite}`,
        ]
          .filter(Boolean)
          .join("; ");

        setValue(newValue);
      } catch (error) {
        console.warn(`Error setting cookie "${name}":`, error);
      }
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    if (typeof window === "undefined") return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    setValue(null);
  }, [name]);

  return [value, setCookie, deleteCookie];
}
