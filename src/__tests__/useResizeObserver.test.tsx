import { renderHook } from "@testing-library/react";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { act } from "react";

// Mock DOMRectReadOnly
class DOMRectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
    this.left = x;
  }
}

// @ts-ignore
global.DOMRectReadOnly = DOMRectReadOnly;

let resizeCallback: (entries: any[]) => void;

const mockResizeObserver = jest.fn();
mockResizeObserver.mockImplementation((callback) => ({
  observe: jest.fn(() => {
    resizeCallback = callback;
    callback([
      {
        contentRect: new DOMRectReadOnly(0, 0, 100, 50),
        contentBoxSize: [{ inlineSize: 100, blockSize: 50 }],
        borderBoxSize: [{ inlineSize: 110, blockSize: 60 }],
        devicePixelContentBoxSize: [{ inlineSize: 200, blockSize: 100 }],
        target: document.createElement("div"),
      },
    ]);
  }),
  disconnect: jest.fn(),
}));

// @ts-ignore
global.ResizeObserver = mockResizeObserver;

describe("useResizeObserver", () => {
  it("should return null when ref is null", () => {
    const ref = { current: null };
    const { result } = renderHook(() => useResizeObserver(ref));
    expect(result.current).toBeNull();
  });

  it("should return resize observer entry", () => {
    const element = document.createElement("div");
    const ref = { current: element };
    const { result } = renderHook(() => useResizeObserver(ref));

    expect(result.current?.contentRect.width).toBe(100);
    expect(result.current?.contentRect.height).toBe(50);
    expect(result.current?.contentBoxSize[0].inlineSize).toBe(100);
    expect(result.current?.borderBoxSize[0].blockSize).toBe(60);
  });

  it("should update on resize", () => {
    const element = document.createElement("div");
    const ref = { current: element };
    const { result } = renderHook(() => useResizeObserver(ref));

    act(() => {
      resizeCallback([
        {
          contentRect: new DOMRectReadOnly(0, 0, 200, 100),
          contentBoxSize: [{ inlineSize: 200, blockSize: 100 }],
          borderBoxSize: [{ inlineSize: 220, blockSize: 120 }],
          devicePixelContentBoxSize: [{ inlineSize: 400, blockSize: 200 }],
          target: element,
        },
      ]);
    });

    expect(result.current?.contentRect.width).toBe(200);
    expect(result.current?.contentRect.height).toBe(100);
    expect(result.current?.contentBoxSize[0].inlineSize).toBe(200);
    expect(result.current?.borderBoxSize[0].blockSize).toBe(120);
  });

  it("should handle multiple resize updates", () => {
    const element = document.createElement("div");
    const ref = { current: element };
    const { result } = renderHook(() => useResizeObserver(ref));

    // First resize
    act(() => {
      resizeCallback([
        {
          contentRect: new DOMRectReadOnly(0, 0, 200, 100),
          contentBoxSize: [{ inlineSize: 200, blockSize: 100 }],
          borderBoxSize: [{ inlineSize: 220, blockSize: 120 }],
          devicePixelContentBoxSize: [{ inlineSize: 400, blockSize: 200 }],
          target: element,
        },
      ]);
    });

    expect(result.current?.contentRect.width).toBe(200);

    // Second resize
    act(() => {
      resizeCallback([
        {
          contentRect: new DOMRectReadOnly(0, 0, 300, 150),
          contentBoxSize: [{ inlineSize: 300, blockSize: 150 }],
          borderBoxSize: [{ inlineSize: 320, blockSize: 170 }],
          devicePixelContentBoxSize: [{ inlineSize: 600, blockSize: 300 }],
          target: element,
        },
      ]);
    });

    expect(result.current?.contentRect.width).toBe(300);
    expect(result.current?.contentRect.height).toBe(150);
  });

  it("should cleanup observer on unmount", () => {
    const element = document.createElement("div");
    const ref = { current: element };
    const { unmount } = renderHook(() => useResizeObserver(ref));

    const disconnect = mockResizeObserver.mock.results[0].value.disconnect;

    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("should handle ref changes", () => {
    const element1 = document.createElement("div");
    const element2 = document.createElement("div");
    const ref = { current: element1 };
    const { rerender } = renderHook(() => useResizeObserver(ref));

    const observe = mockResizeObserver.mock.results[0].value.observe;
    const disconnect = mockResizeObserver.mock.results[0].value.disconnect;

    // Change ref
    ref.current = element2;
    rerender();

    expect(disconnect).toHaveBeenCalled();
    expect(observe).toHaveBeenCalledWith(element2);
  });
});
