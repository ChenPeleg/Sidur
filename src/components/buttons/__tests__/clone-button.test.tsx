import "../../../setupTests";
import { CloneButton, CloneButtonProps } from "../clone-button";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const clickMock = vi.fn();
const props: CloneButtonProps = {
    sx: null,
    cloneClickHandler: clickMock,
};

describe("Clone Button", () => {
    it("only one button", () => {
        render(
            <CloneButton
                cloneClickHandler={props.cloneClickHandler}
                sx={null}
            />
        );
        expect(screen.getAllByRole("button")).toHaveLength(1);
    });
    it("only have text to add", () => {
        render(
            <CloneButton
                cloneClickHandler={props.cloneClickHandler}
                sx={null}
            />
        );
        expect(screen.getAllByRole("button")[0].innerHTML).toContain(
            "ContentCopyIcon"
        );
    });
    it("click triggers click handler", async () => {
        render(
            <CloneButton
                cloneClickHandler={props.cloneClickHandler}
                sx={null}
            />
        );
        await userEvent.click(screen.getByRole("button"));
        expect(clickMock).toHaveBeenCalled();
    });
});
