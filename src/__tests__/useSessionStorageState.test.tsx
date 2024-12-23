import { renderHook } from "@testing-library/react";
import { useSessionStorageState } from "../hooks/useSessionStorageState";
import { act } from "react";

describe("useSessionStorageState", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("should return initial value when no value in sessionStorage", () => {
    const { result } = renderHook(() => useSessionStorageState("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value from sessionStorage", () => {
    window.sessionStorage.setItem("test-key", JSON.stringify("stored value"));
    const { result } = renderHook(() => useSessionStorageState("test-key", "initial"));
    expect(result.current[0]).toBe("stored value");
  });

  it("should update sessionStorage when setting new value", () => {
    const { result } = renderHook(() => useSessionStorageState("test-key", "initial"));

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(JSON.parse(window.sessionStorage.getItem("test-key")!)).toBe("new value");
  });

  it("should handle complex objects", () => {
    const initialValue = { test: "value", number: 42 };
    const { result } = renderHook(() => useSessionStorageState("test-key", initialValue));

    const newValue = { test: "updated", number: 43 };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(window.sessionStorage.getItem("test-key")!)).toEqual(newValue);
  });

  it("should handle errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    window.sessionStorage.setItem("test-key", "invalid json");

    const { result } = renderHook(() => useSessionStorageState("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
