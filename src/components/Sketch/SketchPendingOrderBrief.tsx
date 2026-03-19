import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { LanguageUtilities } from "../../services/language-utilities";
import { OrderModel } from "../../models/Order.model";
import { LocationModel } from "../../models/Location.model";

interface sketchPendingOrderProps {
    order: OrderModel;
    isInEdit: boolean;
}

const timeText = (drive: OrderModel, locations: LocationModel[]) =>
    LanguageUtilities.buildBriefText(drive, locations).timeText;
const driverAndLocation = (drive: OrderModel, locations: LocationModel[]) =>
    LanguageUtilities.buildBriefText(drive, locations).driverAndLocation;
export const SketchPendingOrderBrief = (props: sketchPendingOrderProps) => {
    const order = props.order;
    const locations = useSelector(
        (state: { Locations: LocationModel[] }) => state.Locations
    );

    return (
        <div id={"pending-order"}>
            <div id={"drive-description"}>
                <div className="w-[5px] h-[10px]" />
                <Typography variant={"subtitle1"}>
                    {timeText(order, locations) +
                        " " +
                        driverAndLocation(order, locations)}{" "}
                </Typography>
            </div>
        </div>
    );
};
