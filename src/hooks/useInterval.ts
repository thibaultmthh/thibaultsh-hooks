import { useEffect, useRef } from "react";

/**
 * Hook that creates a setInterval that automatically cleans up on unmount.
 *
 * Provides a declarative way to use intervals in React components with proper
 * cleanup and the ability to pause/resume by passing null as the delay.
 *
 * @param callback - The function to execute on each interval tick
 * @param delay - The delay in milliseconds between executions, or null to pause the interval
 *
 * @example
 * ```tsx
 * function Timer() {
 *   const [count, setCount] = useState(0);
 *   const [isRunning, setIsRunning] = useState(true);
 *
 *   // Increment count every second when running
 *   useInterval(() => {
 *     setCount(count => count + 1);
 *   }, isRunning ? 1000 : null);
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setIsRunning(!isRunning)}>
 *         {isRunning ? 'Pause' : 'Resume'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://thibault.sh/hooks/use-interval
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
