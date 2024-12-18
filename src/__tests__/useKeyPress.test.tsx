import { renderHook } from "@testing-library/react";
import { useKeyPress } from "../useKeyPress";
import { fireEvent } from "@testing-library/react";

describe("useKeyPress", () => {
  it("should detect key press and release", () => {
    const { result } = renderHook(() => useKeyPress("a"));

    expect(result.current).toBe(false);

    fireEvent.keyDown(window, { key: "a" });
    expect(result.current).toBe(true);

    fireEvent.keyUp(window, { key: "a" });
    expect(result.current).toBe(false);
  });

  it("should not trigger for different keys", () => {
    const { result } = renderHook(() => useKeyPress("a"));

    fireEvent.keyDown(window, { key: "b" });
    expect(result.current).toBe(false);
  });
});
