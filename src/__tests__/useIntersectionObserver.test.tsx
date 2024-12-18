import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "../useIntersectionObserver";
import { act } from "react";

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: jest.fn(() => {
    callback([
      {
        isIntersecting: true,
        boundingClientRect: {},
        intersectionRatio: 1,
        intersectionRect: {},
        rootBounds: null,
        target: document.createElement("div"),
        time: Date.now(),
      },
    ]);
  }),
  disconnect: jest.fn(),
}));

// @ts-ignore
global.IntersectionObserver = mockIntersectionObserver;

describe("useIntersectionObserver", () => {
  it("should return intersection entry", () => {
    const element = document.createElement("div");
    const ref = { current: element };
    const { result } = renderHook(() => useIntersectionObserver(ref, { threshold: 0.5 }));

    expect(result.current?.isIntersecting).toBe(true);
    expect(result.current?.intersectionRatio).toBe(1);
  });

  it("should respect freezeOnceVisible option", () => {
    const element = document.createElement("div");
    const ref = { current: element };
    const { result } = renderHook(() => useIntersectionObserver(ref, { freezeOnceVisible: true }));

    expect(result.current?.isIntersecting).toBe(true);

    // Simulate another intersection
    act(() => {
      mockIntersectionObserver.mock.calls[0][0]([
        {
          isIntersecting: false,
          boundingClientRect: {},
          intersectionRatio: 0,
          intersectionRect: {},
          rootBounds: null,
          target: element,
          time: Date.now(),
        },
      ]);
    });

    // Should still be true because of freezeOnceVisible
    expect(result.current?.isIntersecting).toBe(true);
  });
});
