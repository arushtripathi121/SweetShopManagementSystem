// Extend Vitest with jest-dom matchers
import "@testing-library/jest-dom";

// Cleanup after each test (prevents memory leaks)
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
});
