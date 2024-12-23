import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value updates", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: "initial" },
    });

    // Update the value
    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should cancel previous debounce on new updates", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: "initial" },
    });

    // First update
    rerender({ value: "first update" });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Second update before first one completes
    rerender({ value: "second update" });
    expect(result.current).toBe("initial");

    // Fast forward to just after first debounce would have completed
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("initial");

    // Fast forward to when second debounce should complete
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe("second update");
  });
});
