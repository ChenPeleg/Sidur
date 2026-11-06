import React from "react";

import App from "../../src/hoc/App";
import { Root } from "../../src/hoc/Root";
import "../../src/setupTests";
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
