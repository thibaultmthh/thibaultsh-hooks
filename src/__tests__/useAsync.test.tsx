import { renderHook, act } from "@testing-library/react";
import { useAsync } from "../hooks/useAsync";

describe("useAsync", () => {
  it("should handle successful async operation", async () => {
    const asyncFunction = jest.fn().mockResolvedValue("success");
    const { result } = renderHook(() => useAsync(asyncFunction));

    expect(result.current.status.isLoading).toBe(false);
    expect(result.current.status.error).toBeNull();
    expect(result.current.status.value).toBeNull();

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status.isLoading).toBe(false);
    expect(result.current.status.error).toBeNull();
    expect(result.current.status.value).toBe("success");
  });

  it("should handle async operation with parameters", async () => {
    const asyncFunction = jest.fn().mockResolvedValue("success");
    const { result } = renderHook(() => useAsync(asyncFunction));

    await act(async () => {
      await result.current.execute("param1", "param2");
    });

    expect(asyncFunction).toHaveBeenCalledWith("param1", "param2");
  });

  it("should handle async errors", async () => {
    const error = new Error("test error");
    const asyncFunction = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFunction));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status.isLoading).toBe(false);
    expect(result.current.status.error).toBe(error);
    expect(result.current.status.value).toBeNull();
  });

  it("should handle loading state", async () => {
    const asyncFunction = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve("success"), 100)));
    const { result } = renderHook(() => useAsync(asyncFunction));

    let promise: Promise<void>;
    act(() => {
      promise = result.current.execute();
    });

    expect(result.current.status.isLoading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.status.isLoading).toBe(false);
  });
});
