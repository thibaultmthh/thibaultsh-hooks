import "@testing-library/jest-dom";

// Mock localStorage and sessionStorage
const mockStorage = () => {
  let storage: { [key: string]: string } = {};
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      storage = {};
    },
  };
};

Object.defineProperty(window, "localStorage", { value: mockStorage() });
Object.defineProperty(window, "sessionStorage", { value: mockStorage() });

// Mock cookies
Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: "",
});
