import { renderHook } from "@testing-library/react";
import { useHover } from "../hooks/useHover";
import { act } from "react";

describe("useHover", () => {
  it("should track hover state", () => {
    const { result } = renderHook(() => useHover());
    const [ref, isHovered] = result.current;

    expect(isHovered).toBe(false);

    if (ref.current) {
      act(() => {
        ref.current?.dispatchEvent(new MouseEvent("mouseenter"));
      });
      expect(result.current[1]).toBe(true);

      act(() => {
        ref.current?.dispatchEvent(new MouseEvent("mouseleave"));
      });
      expect(result.current[1]).toBe(false);
    }
  });
});
