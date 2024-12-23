import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useCookieState } from "../hooks/useCookieState";

describe("useCookieState", () => {
  beforeEach(() => {
    document.cookie = "";
  });

  it("should return initial value when no cookie exists", () => {
    const { result } = renderHook(() => useCookieState("test-cookie", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should set and get cookie value", () => {
    const { result } = renderHook(() => useCookieState("test-cookie", "initial"));

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
  });

  it("should delete cookie", () => {
    const { result } = renderHook(() => useCookieState("test-cookie", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBeNull();
    expect(document.cookie).not.toContain("test-cookie=new-value");
  });

  it("should set cookie with custom options", () => {
    const { result } = renderHook(() => useCookieState("test-cookie", "initial"));

    act(() => {
      result.current[1]("new-value", {
        days: 7,
        path: "/test",
        secure: true,
        sameSite: "Strict",
      });
    });

    const cookie = document.cookie;
    expect(cookie).toContain("test-cookie=new-value");
    expect(cookie).toContain("path=/test");
    expect(cookie).toContain("secure");
    expect(cookie).toContain("SameSite=Strict");
  });

  it("should handle special characters in cookie values", () => {
    const { result } = renderHook(() => useCookieState("test-cookie", "initial"));
    const specialValue = "test value with spaces and @#$%";

    act(() => {
      result.current[1](specialValue);
    });

    expect(result.current[0]).toBe(specialValue);
    expect(document.cookie).toContain(`test-cookie=${encodeURIComponent(specialValue)}`);
  });
});
