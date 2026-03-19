import React, { useState, useEffect } from "react";
import { MuiFormPropsModel } from "../../models/mui-form-props.model";
import { useDispatch, useSelector } from "react-redux";
import { HourPicker } from "../Form/hour-picker";
import { OrderFields, OrderModel } from "../../models/Order.model";
import { RenderTextField } from "../Form/text-field";
import { RenderSelectField } from "../Form/select-field";
import { DriveType } from "../../models/DriveType.enum";
import { Button, MenuItem } from "@mui/material";
import { translations } from "../../services/translations";
import { ActionsTypes } from "../../store/types.actions";
import { LocationModel } from "../../models/Location.model";
import { LanguageUtilities } from "../../services/language-utilities";
import { RenderPassengerField } from "../Form/passengers-field";
import { RenderFlexibilityField } from "../Form/flexibility-field";
import { RenderSelectFieldAutoComplete } from "../Form/select-field-auto-complete";

const TRL = translations;

const fieldWrapper = "p-[10px]";
const selectFieldWrapper = "p-[10px] pb-0";
const fieldWrapperText = "inline-flex p-[10px] max-w-[150px]";

const orderFields: OrderModel = new OrderFields();

const Divider = () => <div className="w-[10px] h-[5px]" />;

const createInputProps = (
    name: string,
    value: any,
    onChange: (name: string, val: any) => void
) => ({
    name,
    value: value === undefined || value === null ? "" : value,
    onChange: (eventOrValue: any, possibleValue?: any) => {
        let val = eventOrValue;
        if (possibleValue !== undefined) {
            val = possibleValue;
        } else if (
            eventOrValue &&
            eventOrValue.target &&
            eventOrValue.target.value !== undefined
        ) {
            val = eventOrValue.target.value;
        }
        onChange(name, val);
    },
});

const getInputAdapter = (
    name: string,
    values: any,
    handleChange: any
): { input: any; meta: any; custom: any } => {
    return {
        input: createInputProps(name, values ? values[name] : "", handleChange),
        meta: {
            touched: false,
            error: null,
        },
        custom: {},
    };
};

export const OrderCarForm = (formProps: MuiFormPropsModel) => {
    const dispatch = useDispatch();
    const id = formProps.orderId;
    const orders = useSelector(
        (state: { orders: OrderModel[] }) => state.orders
    );

    const initialValues = orders.find((order) => order.id === id);

    const [values, setValues] = useState<OrderModel | undefined>(initialValues);
    const [isAdvanced, setIsAdvanced] = useState(false);

    useEffect(() => {
        if (initialValues && !values) {
            setValues(initialValues);
        }
    }, [initialValues, values]);

    if (!values) return <div>Loading...</div>;

    const handleFieldChange = (name: string, value: any) => {
        const newValues = { ...values, [name]: value };
        setValues(newValues);

        if (formProps.isInEdit) {
            dispatch({
                type: ActionsTypes.UPDATE_ORDER_IN_EDIT,
                payload: newValues,
            });
        }
    };

    const handleSubmit = () => {
        if (!formProps.isInEdit) {
            return;
        }
        dispatch({
            type: ActionsTypes.UPDATE_ORDER,
            payload: {
                id: id,
            },
        });
    };

    const typeOfDrive = values.TypeOfDrive || undefined;
    const driveTimeLanguage =
        LanguageUtilities.getPrefixByDriveType(typeOfDrive);
    const locations = formProps.locations;

    const advanceFieldWrapper = fieldWrapper + (isAdvanced ? "" : " hidden");

    const propsFor = (name: string) =>
        getInputAdapter(name, values, handleFieldChange);

    const TextFieldAny = RenderTextField as any;
    const SelectFieldAny = RenderSelectField as any;
    const AutoCompleteAny = RenderSelectFieldAutoComplete as any;
    const HourPickerAny = HourPicker as any;
    const PassengerFieldAny = RenderPassengerField as any;
    const FlexibilityFieldAny = RenderFlexibilityField as any;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            dir={"rtl"}
        >
            <div id={"form-wrapper"} className="flex flex-row flex-wrap">
                <div className={fieldWrapperText}>
                    <TextFieldAny
                        {...propsFor(orderFields.driverName)}
                        label={TRL.Name}
                    />
                </div>
                <div className={selectFieldWrapper}>
                    <SelectFieldAny
                        {...propsFor("TypeOfDrive")}
                        label={TRL.TypeOfDrive}
                    >
                        <MenuItem value={DriveType.Tsamud.toString()}>
                            {TRL.Tsamud}
                        </MenuItem>
                        <MenuItem value={DriveType.OneWayFrom.toString()}>
                            {" "}
                            {TRL.OneWayFrom}
                        </MenuItem>
                        <MenuItem value={DriveType.OneWayTo.toString()}>
                            {TRL.OneWayTo}
                        </MenuItem>
                    </SelectFieldAny>
                </div>

                <div className={selectFieldWrapper}>
                    <AutoCompleteAny
                        {...propsFor(orderFields.location)}
                        label={TRL.Where}
                        selectoptions={locations.map(
                            (location: LocationModel) => ({
                                ...location,
                                Name:
                                    driveTimeLanguage.location + location.name,
                            })
                        )}
                    />
                </div>

                <div className={fieldWrapper}>
                    <HourPickerAny
                        {...propsFor(orderFields.startHour)}
                        label={driveTimeLanguage.timeStart}
                    />
                </div>
                <div className={fieldWrapper}>
                    <HourPickerAny
                        {...propsFor(orderFields.finishHour)}
                        custom={{ inActive: typeOfDrive !== DriveType.Tsamud }}
                        label={driveTimeLanguage.timeEnd}
                    />
                </div>

                <div className={fieldWrapper}>
                    <TextFieldAny
                        {...propsFor(orderFields.Comments)}
                        label={TRL.Comments}
                        rows={2}
                    />
                </div>

                <div className={fieldWrapper}>
                    <PassengerFieldAny
                        {...propsFor(orderFields.passengers)}
                        label={TRL.passengers}
                        type={"text"}
                    />
                </div>

                <div className={advanceFieldWrapper}>
                    <FlexibilityFieldAny
                        {...propsFor(orderFields.flexibility[0])}
                        label={TRL.flexibility}
                        rows={2}
                    />
                </div>

                <div className="p-[10px] flex flex-row">
                    <Button
                        sx={{ display: isAdvanced ? "none" : "initial" }}
                        variant="text"
                        type="button"
                        onClick={() => setIsAdvanced(true)}
                    >
                        {TRL.Advanced}
                    </Button>
                    <Divider />
                    <Button
                        sx={{ m: "5px" }}
                        variant="contained"
                        color={"primary" as any}
                        type="button"
                        onClick={handleSubmit}
                    >
                        {TRL.Submit}
                    </Button>
                </div>
            </div>
        </form>
    );
};
