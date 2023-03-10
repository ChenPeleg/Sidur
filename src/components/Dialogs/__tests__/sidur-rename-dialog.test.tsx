import React from "react";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "../../../__tests-utils__/redux-mock-store";

import { RenameDialog } from "../rename-dialog";
import Mock = jest.Mock;
import userEvent from "@testing-library/user-event";

describe("ShmiraList rename import Dialog", () => {
  let fileDialog: any = null;
  let component: HTMLElement;
  let _baseElement: any = null;
  let store: any;
  let onClose: Mock = jest.fn();
  const shmiraListDefaultName = "name of shmiraList";
  beforeEach(async () => {
    onClose = jest.fn();

    const middlewares: any = [];
    const mockStore = configureStore(middlewares);
    store = mockStore({});
    fileDialog = (
      <Provider store={store}>
        <RenameDialog
          selectedValue={shmiraListDefaultName}
          open={true}
          key={"1"}
          onClose={onClose}
        />
      </Provider>
    );
    render(fileDialog);
    component = screen.getByRole("dialog", { hidden: true });
  });

  it("component renders", async () => {
    expect(component.children).toHaveLength(3);
    expect(component).toBeTruthy();
    expect(component.innerHTML.toString()).toContain("MuiDialog");
  });
  it("renders one text-field", async () => {
    expect(component.querySelectorAll("input").length).toBeGreaterThan(0);
  });
  it("closes dialog on press cancel", async () => {
    const cancelButton = (await screen.getByTestId(
      "shmiraList-rename-cancel-button"
    )) as HTMLElement;
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledWith(null);
  });
  it("entering value and pressing approve triggers dispatch", async () => {
    await act(async () => {
      const input: HTMLInputElement = component.querySelector(
        "input#shmiraList-rename-dialog-text-field"
      ) as HTMLInputElement;
      input.value = "rename shmiraList";
      const aprvButton = (await component.querySelector(
        "#shmiraList-rename-approve-button"
      )) as HTMLElement;
      await userEvent.click(aprvButton);

      expect(onClose).toHaveBeenCalledWith("rename shmiraList");
    });
  });
});
