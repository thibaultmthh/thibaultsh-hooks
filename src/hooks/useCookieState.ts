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
 * Hook for managing state persisted in a browser cookie
 * @param name - The name of the cookie
 * @param initialValue - The initial value to use if no cookie exists
 * @returns A tuple containing:
 * - The current cookie value (or null if not set)
 * - A function to update the cookie value and its options
 * - A function to delete the cookie
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
