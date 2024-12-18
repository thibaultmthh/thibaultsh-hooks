import { renderHook } from "@testing-library/react";
import { useQueryParamsState } from "../useQueryParamsState";
import { act } from "react";

describe("useQueryParamsState", () => {
  const originalLocation = window.location;
  let mockPushState: jest.Mock;

  beforeEach(() => {
    // Mock pushState
    mockPushState = jest.fn();
    window.history.pushState = mockPushState;

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        href: "http://localhost/",
        search: "",
        pathname: "/",
      },
      writable: true,
    });

    // Clear URL parameters
    window.history.pushState({}, "", "/");
  });

  afterAll(() => {
    // Restore original location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("should return initial value when no value in URL", () => {
    const { result } = renderHook(() => useQueryParamsState("test", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it.only("should return value from URL", () => {
    // Set URL with JSON-encoded value
    window.history.pushState({}, "", `/?test="${encodeURIComponent("value")}"`);

    // Manually update location.search to match pushState
    Object.defineProperty(window.location, "search", {
      value: `?test="${encodeURIComponent("value")}"`,
      writable: true,
    });

    const { result } = renderHook(() => useQueryParamsState("test", "initial"));
    expect(result.current[0]).toBe("value");
  });

  it("should update URL when setting new value", () => {
    const { result } = renderHook(() => useQueryParamsState("test", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(mockPushState).toHaveBeenCalledWith({}, "", "/?test=%22new-value%22");
  });

  it("should handle complex objects with custom serialization", () => {
    const initialValue = { test: "value", number: 42 };
    const serialize = (value: typeof initialValue) => `${value.test}-${value.number}`;
    const deserialize = (value: string) => {
      const [test, number] = value.split("-");
      return { test, number: parseInt(number) };
    };

    const { result } = renderHook(() => useQueryParamsState("test", initialValue, { serialize, deserialize }));

    const newValue = { test: "updated", number: 43 };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(mockPushState).toHaveBeenCalledWith({}, "", expect.stringContaining("test=updated-43"));
  });

  it("should sync with browser navigation", () => {
    const { result } = renderHook(() => useQueryParamsState("test", "initial"));

    // Simulate URL change
    act(() => {
      window.history.pushState({}, "", "/?test=value1");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current[0]).toBe("value1");
  });
});
