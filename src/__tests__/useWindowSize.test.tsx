import { renderHook } from "@testing-library/react";
import { useWindowSize } from "../useWindowSize";
import { act } from "react";

describe("useWindowSize", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  it("should return current window dimensions", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it("should update on window resize", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.innerWidth = 1920;
      window.innerHeight = 1080;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({
      width: 1920,
      height: 1080,
    });
  });
});
