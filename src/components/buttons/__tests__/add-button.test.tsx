import "../../../setupTests";

import { AddButton, AddButtonProps } from "../../Icons/add-button";
import { translations } from "../../../services/translations";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const clickMock = vi.fn();
const props: AddButtonProps = {
    sx: null,
    addClickHandler: clickMock,
};
describe("Add Button", () => {
    it("only one button last", () => {
        render(<AddButton addClickHandler={props.addClickHandler} />);
        expect(screen.getAllByRole("button")).toHaveLength(1);
    });
    it("only have text  AddPreference", () => {
        render(<AddButton addClickHandler={props.addClickHandler} />);
        expect(screen.getAllByRole("button")[0].textContent).toContain(
            translations.AddOrder
        );
    });
    it("click triggers click handler", async () => {
        render(<AddButton addClickHandler={props.addClickHandler} />);
        await userEvent.click(screen.getByRole("button"));
        expect(clickMock).toHaveBeenCalled();
    });
});
