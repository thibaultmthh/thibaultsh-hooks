import { useState, useCallback } from "react";

interface AsyncState<T> {
  isLoading: boolean;
  error: Error | null;
  value: T | null;
}

/**
 * Hook that handles async operations with loading and error states
 * @param asyncFunction - Async function to execute
 * @returns Object containing execute function, loading state, error, and value
 */
export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): {
  execute: (...args: any[]) => Promise<void>;
  status: AsyncState<T>;
} {
  const [status, setStatus] = useState<AsyncState<T>>({
    isLoading: false,
    error: null,
    value: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setStatus({ isLoading: true, error: null, value: null });
      try {
        const result = await asyncFunction(...args);
        setStatus({ isLoading: false, error: null, value: result });
      } catch (error) {
        setStatus({
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
          value: null,
        });
      }
    },
    [asyncFunction]
  );

  return { execute, status };
} 