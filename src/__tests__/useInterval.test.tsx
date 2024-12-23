import { renderHook } from "@testing-library/react";
import { useInterval } from "../hooks/useInterval";

describe("useInterval", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call callback on interval", () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should not start interval if delay is null", () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, null));

    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should clear interval on unmount", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    jest.advanceTimersByTime(500);
    unmount();
    jest.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle callback changes", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), { initialProps: { cb: callback1 } });

    jest.advanceTimersByTime(1000);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    rerender({ cb: callback2 });
    jest.advanceTimersByTime(1000);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
