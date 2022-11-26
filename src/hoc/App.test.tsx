import React from "react";

import App from "./App";
import { Root } from "./Root";
import "../setupTests";
import { render, screen } from "@testing-library/react";

let component: HTMLElement;
describe("basic app rendering", () => {
    beforeEach(() => {
        render(
            <Root>
                <App />
            </Root>
        );
        component = screen.getByTestId("test-app-back-ground");
    });

    afterEach(() => {
        // if (wrapped) {
        //     wrapped.unmount();
        // }
    });

    it("renders correctly", () => {
        expect(component).toBeTruthy();
    });
});
