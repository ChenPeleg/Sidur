import React from "react";
import { useSelector } from "react-redux";
import { OrderModel } from "../../models/Order.model";
import { Typography } from "@mui/material";
import { translations } from "../../services/translations";
import { LanguageUtilities } from "../../services/language-utilities";
import { LocationModel } from "../../models/Location.model";
import { DriveType } from "../../models/DriveType.enum";

type AppProps = {
    orderId: string;
    className: string;
    isInEdit: boolean;
};

const areDetailsMissing = (orderValues: OrderModel): boolean => {
    if (
        !orderValues.TypeOfDrive ||
        !orderValues.driverName ||
        !orderValues.startHour
    ) {
        return true;
    }
    if (orderValues.TypeOfDrive === DriveType.Tsamud) {
        if (!orderValues.finishHour || !orderValues.startHour) {
            return true;
        }
    }
    return false;
};

const buildBriefText = (
    orderValues: OrderModel,
    locations: LocationModel[]
): string => {
    const isWithName = orderValues.driverName.trim() !== "";
    if (!isWithName) {
        return translations.NewOrder;
    }
    let timeText = orderValues?.startHour || "";
    if (
        orderValues.TypeOfDrive === DriveType.Tsamud &&
        orderValues?.startHour &&
        orderValues?.finishHour
    ) {
        timeText = orderValues.finishHour + " - " + orderValues.startHour;
    }
    let briefText = timeText + " " + orderValues.driverName;
    if (orderValues.TypeOfDrive && orderValues.location) {
        const driveTimeLanguage = LanguageUtilities.getPrefixByDriveType(
            orderValues.TypeOfDrive
        );
        const location = locations.find((l) => l.id === orderValues.location);
        if (location) {
            briefText += " " + driveTimeLanguage.location + location.name;
        }
    }

    return briefText;
};
export const OrderCarBrief = (props: AppProps) => {
    const id = props.orderId;
    const orderValues = useSelector((state: { orders: OrderModel[] }) => {
        return state.orders.find((order) => order.id === id) as OrderModel;
    });
    const locations = useSelector(
        (state: { Locations: LocationModel[] }) => state.Locations
    );

    const missingDetailsShown: boolean =
        areDetailsMissing(orderValues) && !props.isInEdit;

    return (
        <div className={`p-[5px] flex flex-row justify-start items-start ${props.className}`}>
            <Typography
                fontWeight={props.isInEdit ? "bold" : "initial"}
                fontSize={"large"}
                padding={"initial"}
            >
                {buildBriefText(orderValues, locations)}
            </Typography>
            <Typography fontSize={"large"} color={"red"} padding={"initial"}>
                {" "}
                &nbsp;
                {missingDetailsShown
                    ? " (" + translations.missingDetails + ") "
                    : null}
            </Typography>
        </div>
    );
};
