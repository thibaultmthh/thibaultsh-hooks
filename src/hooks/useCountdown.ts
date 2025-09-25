import { useEffect, useRef, useState } from "react";

/**
 * Hook that creates a countdown timer to a target date with automatic updates.
 *
 * Provides real-time countdown values that update at a specified interval.
 * Returns zero values when the target date has passed.
 *
 * @param countDownDate - Target date as a timestamp in milliseconds (e.g., `new Date('2024-12-31').getTime()`)
 * @param refreshRate - Update interval in milliseconds (defaults to 1000ms for 1-second updates)
 *
 * @returns A readonly tuple `[days, hours, minutes, seconds]` representing time remaining
 *
 * @example
 * ```tsx
 * const targetDate = new Date('2024-12-31 23:59:59').getTime();
 * const [days, hours, minutes, seconds] = useCountdown(targetDate);
 *
 * return (
 *   <div>
 *     {days}d {hours}h {minutes}m {seconds}s remaining
 *   </div>
 * );
 * ```
 *
 * @example
 * // Custom refresh rate (every 100ms for smoother animation)
 * const [days, hours, minutes, seconds] = useCountdown(targetDate, 100);
 * @see https://thibault.sh/hooks/use-countdown
 */
export function useCountdown(countDownDate: number, refreshRate?: number) {
  const now = new Date().getTime();
  const firstVal = countDownDate - now;
  const [countDown, setCountDown] = useState(firstVal);
  const intervalRef = useRef<any | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setCountDown(countDownDate - new Date().getTime());
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, refreshRate);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [countDownDate, refreshRate]);

  return getReturnValues(countDown);
}

/**
 * Calculates the remaining time components from a countdown value
 * @param countDown - Time remaining in milliseconds
 * @returns A tuple containing [days, hours, minutes, seconds]
 */
const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  // values can't be negative
  if (days < 0) return [0, 0, 0, 0];
  if (hours < 0) return [0, 0, 0, 0];
  if (minutes < 0) return [0, 0, 0, 0];
  if (seconds < 0) return [0, 0, 0, 0];

  return [days, hours, minutes, seconds] as const;
};
