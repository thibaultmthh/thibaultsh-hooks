import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

describe("useLocalStorageState", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should return initial value when no value in localStorage", () => {
    const { result } = renderHook(() => useLocalStorageState("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored value"));
    const { result } = renderHook(() => useLocalStorageState("test-key", "initial"));
    expect(result.current[0]).toBe("stored value");
  });

  it("should update localStorage when setting new value", () => {
    const { result } = renderHook(() => useLocalStorageState("test-key", "initial"));

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(JSON.parse(window.localStorage.getItem("test-key")!)).toBe("new value");
  });

  it("should handle complex objects", () => {
    const initialValue = { test: "value", number: 42 };
    const { result } = renderHook(() => useLocalStorageState("test-key", initialValue));

    const newValue = { test: "updated", number: 43 };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(window.localStorage.getItem("test-key")!)).toEqual(newValue);
  });

  it("should handle errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    window.localStorage.setItem("test-key", "invalid json");

    const { result } = renderHook(() => useLocalStorageState("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
