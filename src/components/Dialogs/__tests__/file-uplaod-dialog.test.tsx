import { FileUploadDialog } from "../file-uplaod-dialog";

import React from "react";
import { render, screen } from "@testing-library/react";
// @ts-ignore
import userEvent, { TargetElement } from "@testing-library/user-event";
import { vi, Mock } from "vitest";

describe("File Upload Dialog", () => {
  let fileDialog: any = null;
  let component: HTMLElement;
  let onClose: Mock = vi.fn();
  beforeEach(async () => {
    onClose = vi.fn();
    fileDialog = (
      <FileUploadDialog
        selectedValue={"abc"}
        open={true}
        key={"1"}
        onClose={onClose}
      />
    );
    render(fileDialog);
    component = (await screen.getByRole("dialog", {
      hidden: true,
    })) as HTMLElement;
  });

  it("component renders", async () => {
    expect(component.children).toHaveLength(3);
    expect(component).toBeTruthy();
    expect(component.innerHTML.toString()).toContain("MuiDialog");
  });
  it("only have text to add", async () => {
    expect(component.querySelectorAll("#choose-file-button")).toHaveLength(1);
  });
  it("closes dialog on press cancel", async () => {
    const target: TargetElement = component?.querySelector(
      "#file-upload-cancel-button"
    ) as TargetElement;
    await userEvent.click(target);
    expect(onClose).toHaveBeenCalledWith(null);
  });
});
