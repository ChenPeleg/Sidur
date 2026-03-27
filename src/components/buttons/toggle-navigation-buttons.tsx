import * as React from "react";
import { translations } from "../../services/translations";
import { useDispatch } from "react-redux";
import { ActionsTypes } from "../../store/types.actions";
import { AppToggleButton } from "./app-toggle-button";

export const ToggleNavigationButtons = () => {
    const [alignment, setAlignment] = React.useState("web");
    const dispatch = useDispatch();
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        setAlignment(newAlignment);

        dispatch({
            type: ActionsTypes.CHANGE_VIEW,
            payload: {
                value: newAlignment,
            },
        });
    };
    const customToggleButtonStyle = "rounded-full mx-1";

    return (
        <div className="flex flex-row  " dir="ltr">
            <AppToggleButton
                to="/locations"
                value="locationsView"
                className={customToggleButtonStyle}
                selected={alignment === "locationsView"}
                onClick={(e) => handleChange(e, "locationsView")}
            >
                {translations.Locations}
            </AppToggleButton>

            <AppToggleButton
                to="/sketch"
                value="sketch"
                selected={alignment === "sketch"}
                className={customToggleButtonStyle}
                onClick={(e) => handleChange(e, "sketch")}
            >
                {translations.Sketch}
            </AppToggleButton>

            <AppToggleButton
                to="/orders"
                value="orders"
                selected={alignment === "orders"}
                className={customToggleButtonStyle}
                onClick={(e) => handleChange(e, "orders")}
            >
                {translations.Orders}
            </AppToggleButton>
        </div>
    );
};
