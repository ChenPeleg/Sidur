import React from "react";
import { Orders } from "../components/Orders/orders";
import { Vehicles } from "../components/Vehicles/vehicles";
import { LocationGroupSelect } from "../components/LocationGroupSelect/location-group-select";

export const OrdersLayout = () => (
    <div className={"flex flex-col max-w-screen"}>
        <LocationGroupSelect />
        <Vehicles />
        <Orders />
    </div>
);
