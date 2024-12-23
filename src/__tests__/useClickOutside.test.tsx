import { renderHook } from "@testing-library/react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useRef } from "react";

describe("useClickOutside", () => {
  it("should call handler when clicking outside", () => {
    const handler = jest.fn();
    const ref = { current: document.createElement("div") };

    renderHook(() => useClickOutside(ref, handler));

    const mouseEvent = new MouseEvent("mousedown");
    document.dispatchEvent(mouseEvent);

    expect(handler).toHaveBeenCalled();
  });
});
