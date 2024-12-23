import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "../hooks/useThrottle";

describe("useThrottle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-01-01").getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("initial", 1000));
    expect(result.current).toBe("initial");
  });

  it("should throttle value updates", () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 1000), {
      initialProps: { value: "initial" },
    });

    // Update the value
    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("updated");
  });

  it("should only update once within throttle interval", () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 1000), {
      initialProps: { value: "initial" },
    });

    // Multiple updates within interval
    rerender({ value: "update 1" });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: "update 2" });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: "update 3" });
    expect(result.current).toBe("initial");

    // Fast forward to end of interval
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current).toBe("update 3");
  });
});
