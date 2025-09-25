import { useState, useCallback } from "react";

interface AsyncState<T> {
  isLoading: boolean;
  error: Error | null;
  value: T | null;
}

/**
 * Hook that manages async operations with loading, error, and success states.
 *
 * Provides a clean interface for handling asynchronous functions with automatic
 * state management for loading indicators and error handling.
 *
 * @template T - The type of data returned by the async function
 * @param asyncFunction - The async function to execute
 *
 * @returns An object containing:
 *   - `execute`: Function to trigger the async operation
 *   - `status`: Current state with `isLoading`, `error`, and `value` properties
 *
 * @example
 * ```tsx
 * const fetchUser = async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * };
 *
 * const { execute, status } = useAsync(fetchUser);
 *
 * // In your component
 * if (status.isLoading) return <div>Loading...</div>;
 * if (status.error) return <div>Error: {status.error.message}</div>;
 * if (status.value) return <div>User: {status.value.name}</div>;
 *
 * // Trigger the async operation
 * <button onClick={() => execute('user-123')}>Load User</button>
 * ```
 *
 * @see https://thibault.sh/hooks/use-async
 */
export function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>): {
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
