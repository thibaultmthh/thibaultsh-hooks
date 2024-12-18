import { renderHook } from "@testing-library/react";
import { useLongPress } from "../useLongPress";
import { act } from "react";

jest.useFakeTimers();

describe("useLongPress", () => {
  it("should trigger callback after delay", () => {
    const callback = jest.fn();
    const onStart = jest.fn();
    const { result } = renderHook(() => useLongPress(callback, { delay: 500, onStart }));

    const event = {
      preventDefault: jest.fn(),
      target: document.createElement("div"),
    };

    act(() => {
      result.current.onMouseDown(event as any);
    });

    expect(callback).not.toHaveBeenCalled();
    expect(onStart).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("should cancel long press on early release", () => {
    const callback = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() => useLongPress(callback, { delay: 500, onCancel }));

    const event = {
      preventDefault: jest.fn(),
      target: document.createElement("div"),
    };

    act(() => {
      result.current.onMouseDown(event as any);
    });

    act(() => {
      jest.advanceTimersByTime(200);
      result.current.onMouseLeave(event as any);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
