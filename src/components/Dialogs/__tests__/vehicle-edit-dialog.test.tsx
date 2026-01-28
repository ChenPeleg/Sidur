import React from "react";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "../../../__tests-utils__/redux-mock-store";

import { VehicleEditDialog } from "../vehicle-edit-dialog";
import { VehicleModel } from "../../../models/Vehicle.model";
import { vi, Mock } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Vehicle edit  Dialog", () => {
  let fileDialog: any = null;
  let component: HTMLElement;
  let _baseElement: any = null;
  let store: any;
  let onClose: Mock = vi.fn();
  let onDelete: Mock = vi.fn();
  const mockVehicleData: VehicleModel = {
    startHour: '',
    id: "1",
    vehicleName: "1",
    seats: "7",
    kmLimit: "1",
    endHour: "1",
    Comments: "1"
  };
  beforeEach(async () => {
    onClose = vi.fn();
    onDelete = vi.fn();

    const middlewares: any = [];
    const mockStore = configureStore(middlewares);
    store = mockStore({});
    fileDialog = (
      <Provider store={store}>
        <VehicleEditDialog
          onDelete={onDelete}
          vehicleData={mockVehicleData}
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
    const cancelButton = component.querySelector(
      "#vehicle-edit-cancel-button"
    ) as HTMLElement;
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledWith(null);
  });
  it("entering value and pressing approve triggers dispatch", async () => {
    await act(async () => {
      const inputName = component.querySelector(
        "input#vehicle-rename-dialog-text-field"
      ) as HTMLInputElement;
      const inputComments = component.querySelector(
        "input#vehicle-comments-dialog-text-field"
      ) as HTMLInputElement;
      inputName.value = "rename car";
      inputComments.value = "car comments";
      const approveBtn = component.querySelector(
        "#vehicle-edit-approve-button"
      ) as HTMLElement;
      await userEvent.click(approveBtn);
      expect(onClose).toHaveBeenCalledWith({
        Comments: "car comments",
        endHour: "1",
        id: "1",
        kmLimit: "1",
        seats: "7",
        "startHour": "",
        vehicleName: "rename car",
      });
    });
  });
});
