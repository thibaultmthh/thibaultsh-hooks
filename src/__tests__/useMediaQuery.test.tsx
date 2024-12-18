import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "../useMediaQuery";

describe("useMediaQuery", () => {
  const matchMediaMock = jest.fn();

  beforeAll(() => {
    window.matchMedia = matchMediaMock;
  });

  it("should return match state", () => {
    matchMediaMock.mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });
});
