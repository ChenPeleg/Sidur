import React from "react";
import { customMatcherRunner } from "../__tests-utils__/cutom-matchers";
import { vi } from "vitest";

vi.mock("react-dom", () => ({ render: vi.fn() }));

customMatcherRunner();

describe("Application root", () => {
    it("try custom matchers", () => {
        expect(9).toBePowerOf(9, 6);
    });
    it("try custom matchers with message ", () => {
        expect(9).eq(9, "9 is not equal to 8");
    });
});
