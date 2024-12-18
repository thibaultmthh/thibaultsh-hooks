import { useState, useEffect, useCallback, useRef } from "react";

interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
}

/**
 * Hook that provides a timer with controls
 * @param initialTime - Initial time in seconds
 * @param step - Time step in seconds (default: 1)
 * @param countDown - Whether to count down instead of up (default: false)
 * @returns [currentTime, controls]
 */
export function useTimer(initialTime: number, step: number = 1, countDown: boolean = false): [number, TimerControls] {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = countDown ? prevTime - step : prevTime + step;
          if (countDown && newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return newTime;
        });
      }, step * 1000);
    }
  }, [isRunning, step, countDown]);

  const pause = useCallback(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, []);

  return [
    time,
    {
      start,
      pause,
      reset,
      isRunning,
    },
  ];
}
