import { renderHook } from "@testing-library/react";
import { useEventListener } from "../hooks/useEventListener";
import { fireEvent } from "@testing-library/react";

describe("useEventListener", () => {
  it("should add event listener to window by default", () => {
    const handler = jest.fn();
    renderHook(() => useEventListener("click", handler));

    fireEvent.click(window);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should add event listener to specified element", () => {
    const element = document.createElement("div");
    const handler = jest.fn();
    const ref = { current: element };

    renderHook(() => useEventListener("click", handler, ref));

    fireEvent.click(element);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should remove event listener on unmount", () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useEventListener("click", handler));

    unmount();
    fireEvent.click(window);
    expect(handler).not.toHaveBeenCalled();
  });

  it("should update handler when it changes", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const { rerender } = renderHook(({ handler }) => useEventListener("click", handler), {
      initialProps: { handler: handler1 },
    });

    fireEvent.click(window);
    expect(handler1).toHaveBeenCalledTimes(1);

    rerender({ handler: handler2 });
    fireEvent.click(window);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("should handle options parameter", () => {
    const element = document.createElement("div");
    const child = document.createElement("div");
    element.appendChild(child);
    document.body.appendChild(element);

    const handler = jest.fn();
    const ref = { current: element };

    renderHook(() => useEventListener("click", handler, ref, { capture: true }));

    fireEvent.click(child);
    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element);
  });
});
