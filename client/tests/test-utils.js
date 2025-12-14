// tests/test-utils.js
import { render } from "@testing-library/react";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
});

export * from "@testing-library/react";

export { render };
