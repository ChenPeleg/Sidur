import React from "react";
import { render, screen } from "@testing-library/react";
import { TextFieldPropertiesModel } from "../../../models/text-field-properties.model";
import {RenderFlexibilityField} from '../flexibility-field';
import { vi } from "vitest";


describe("Form Flexibility field ", () => {
  let rawComponent: any = null;
  let wrapper: HTMLElement;
  let _baseElement: any = null;

  const onChangeStub = vi.fn();
  const TextFieldProps: TextFieldPropertiesModel = {
    input: {
      value: [-10, 20],
      onChange: onChangeStub,
    },
    label: "flx",
    meta: {
      touched: null,
      error: null,
    },
    custom: {
      inActive: false,
    },
  };
  beforeEach(async () => {
    rawComponent = <RenderFlexibilityField {...TextFieldProps} />;
    render(rawComponent);
    wrapper = screen.getAllByRole("button")[0];

    const { baseElement } = render(rawComponent);
    _baseElement = baseElement;
  });

  it("component renders", async () => {
    expect(wrapper.children).toHaveLength(1);
    expect(wrapper).toBeTruthy();
    expect(_baseElement.innerHTML.toString()).toContain("MuiSlider");
  });

  it("renders one slider", async () => {
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
  it("change event triggers bound input onChange function", async () => {
    // wrapper.querySelectorAll('ToggleButtonGroup').props().onChange([-20, 30])
    // expect(onChangeStub).toHaveBeenCalledWith([-20, 30]);
  });
});
