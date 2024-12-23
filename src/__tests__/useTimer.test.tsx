import { renderHook } from "@testing-library/react";
import { useTimer } from "../hooks/useTimer";
import { act } from "react";

describe("useTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with given time", () => {
    const { result } = renderHook(() => useTimer(60));
    const [time] = result.current;
    expect(time).toBe(60);
  });

  it("should count up when started", () => {
    const { result } = renderHook(() => useTimer(0));
    const [, controls] = result.current;

    act(() => {
      controls.start();
      jest.advanceTimersByTime(3000);
    });

    const [time] = result.current;
    expect(time).toBe(3);
  });

  it("should count down when in countdown mode", () => {
    const { result } = renderHook(() => useTimer(10, 1, true));
    const [, controls] = result.current;

    act(() => {
      controls.start();
      jest.advanceTimersByTime(3000);
    });

    const [time] = result.current;
    expect(time).toBe(7);
  });

  it("should pause and resume", () => {
    const { result } = renderHook(() => useTimer(0));

    // Start the timer
    act(() => {
      result.current[1].start();
    });

    // Advance by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Check after 2 seconds
    expect(result.current[0]).toBe(2);

    // Pause the timer
    act(() => {
      result.current[1].pause();
    });

    // Verify timer is paused
    expect(result.current[1].isRunning).toBe(false);

    // Advance by 2 more seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Time should still be 2
    expect(result.current[0]).toBe(2);
  });

  it("should reset to initial time", () => {
    const { result } = renderHook(() => useTimer(60));
    const [, controls] = result.current;

    act(() => {
      controls.start();
      jest.advanceTimersByTime(10000);
      controls.reset();
    });

    const [time] = result.current;
    expect(time).toBe(60);
  });

  it("should stop at zero in countdown mode", () => {
    const { result } = renderHook(() => useTimer(2, 1, true));
    const [, controls] = result.current;

    act(() => {
      controls.start();
      jest.advanceTimersByTime(3000);
    });

    const [time, { isRunning }] = result.current;
    expect(time).toBe(0);
    expect(isRunning).toBe(false);
  });
});
