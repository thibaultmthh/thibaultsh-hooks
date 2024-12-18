import { renderHook } from "@testing-library/react";
import { useScrollPosition } from "../useScrollPosition";
import { act } from "react";

describe("useScrollPosition", () => {
  beforeEach(() => {
    window.pageXOffset = 0;
    window.pageYOffset = 0;
  });

  it("should return current scroll position", () => {
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("should update on scroll", () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, "pageXOffset", { value: 100 });
      Object.defineProperty(window, "pageYOffset", { value: 200 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({
      x: 100,
      y: 200,
    });
  });
});
