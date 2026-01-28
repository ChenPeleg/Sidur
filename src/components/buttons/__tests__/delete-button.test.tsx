import "../../../setupTests";
import { DeleteButton, DeleteButtonProps } from "../delete-button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const clickMock = vi.fn();
const props: DeleteButtonProps = {
    sx: null,
    deleteClickHandler: clickMock,
};

describe("Delete Button", () => {
    it("contains only one button", () => {
        render(
            <DeleteButton
                deleteClickHandler={props.deleteClickHandler}
                sx={null}
            />
        );
        expect(screen.getAllByRole("button")).toHaveLength(1);
    });
    it("only have delete icon", () => {
        render(
            <DeleteButton
                deleteClickHandler={props.deleteClickHandler}
                sx={null}
            />
        );

        expect(screen.getAllByRole("button")[0].innerHTML).toContain(
            "DeleteIcon"
        );
    });
    it("click triggers click handler", async () => {
        render(
            <DeleteButton
                deleteClickHandler={props.deleteClickHandler}
                sx={null}
            />
        );
        await userEvent.click(screen.getByRole("button"));
        expect(clickMock).toHaveBeenCalled();
    });
});
