import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that creates a countdown timer based on a target date
 * @param countDownDate - Target date in milliseconds (timestamp)
 * @param refreshRate - Optional interval in milliseconds to update the countdown (defaults to 1000ms)
 * @returns A tuple containing [days, hours, minutes, seconds] remaining until the target date
 */
const useCountdown = (countDownDate: number, refreshRate?: number) => {
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
};

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

export default useCountdown;
