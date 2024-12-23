import { renderHook } from "@testing-library/react";
import { useContainerScroll } from "../hooks/useContainerScroll";
import { act } from "react";

describe("useContainerScroll", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should track container scroll position and dimensions", () => {
    const container = document.createElement("div");
    Object.defineProperties(container, {
      scrollTop: { value: 100, configurable: true },
      scrollLeft: { value: 50, configurable: true },
      scrollWidth: { value: 1000, configurable: true },
      scrollHeight: { value: 2000, configurable: true },
      clientWidth: { value: 800, configurable: true },
      clientHeight: { value: 600, configurable: true },
    });

    const ref = { current: container };
    const { result } = renderHook(() => useContainerScroll(ref));

    act(() => {
      container.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({
      scrollTop: 100,
      scrollLeft: 50,
      scrollWidth: 1000,
      scrollHeight: 2000,
      clientWidth: 800,
      clientHeight: 600,
      isScrolling: true,
    });

    act(() => {
      jest.advanceTimersByTime(180);
    });

    expect(result.current.isScrolling).toBe(false);
  });
});
