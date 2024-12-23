import { renderHook } from "@testing-library/react";
import { useKeyCombo } from "../hooks/useKeyCombo";
import { fireEvent } from "@testing-library/react";

describe("useKeyCombo", () => {
  it("should detect key combination", () => {
    const { result } = renderHook(() => useKeyCombo(["Control", "Shift", "a"]));

    expect(result.current).toBe(false);

    fireEvent.keyDown(window, { key: "Control" });
    fireEvent.keyDown(window, { key: "Shift" });
    fireEvent.keyDown(window, { key: "a" });

    expect(result.current).toBe(true);

    fireEvent.keyUp(window, { key: "Shift" });
    expect(result.current).toBe(false);
  });
});
