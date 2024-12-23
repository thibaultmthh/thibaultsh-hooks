import { renderHook } from "@testing-library/react";
import { useElementSize } from "../hooks/useElementSize";
import { act } from "react";

// Mock ResizeObserver
let resizeCallback: (entries: any[]) => void;

const mockResizeObserver = jest.fn();
mockResizeObserver.mockImplementation((callback) => ({
  observe: jest.fn(() => {
    resizeCallback = callback;
    callback([
      {
        contentRect: {
          width: 100,
          height: 50,
        },
      },
    ]);
  }),
  disconnect: jest.fn(),
}));

// @ts-ignore
global.ResizeObserver = mockResizeObserver;

describe("useElementSize", () => {
  it("should return element dimensions", () => {
    const element = document.createElement("div");
    Object.defineProperties(element, {
      offsetWidth: { value: 100 },
      offsetHeight: { value: 50 },
    });

    const ref = { current: element };
    const { result } = renderHook(() => useElementSize(ref));

    expect(result.current).toEqual({
      width: 100,
      height: 50,
    });
  });

  it("should update on resize", () => {
    const element = document.createElement("div");
    Object.defineProperties(element, {
      offsetWidth: { value: 200 },
      offsetHeight: { value: 100 },
    });

    const ref = { current: element };
    const { result } = renderHook(() => useElementSize(ref));

    // Wait for initial size to be set
    act(() => {
      resizeCallback([
        {
          contentRect: {
            width: 200,
            height: 100,
          },
        },
      ]);
    });

    expect(result.current).toEqual({
      width: 200,
      height: 100,
    });

    // Simulate resize event
    act(() => {
      resizeCallback([
        {
          contentRect: {
            width: 300,
            height: 150,
          },
        },
      ]);
    });

    expect(result.current).toEqual({
      width: 300,
      height: 150,
    });
  });
});
