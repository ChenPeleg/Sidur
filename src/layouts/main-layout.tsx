import React from "react";
import { useSelector } from "react-redux";
import { DisplaySettings } from "../store/store.types";
import { SketchesContainer } from "../components/Sketch/SketchesContainer";
import { LocationGroupEditWrapper } from "../components/LocationsEdit/location-group-edit-wrapper";
import { OrdersLayout } from "./orders-layout";
import { Route, Routes } from "react-router";

export const MainLayout = () => {
    const displaySetting: DisplaySettings = useSelector(
        (state: { displaySetting: DisplaySettings }) => state.displaySetting
    );
    let displaySketches: boolean = false;
    let displayOrders: boolean = true;
    let displayLocations: boolean = false;

    switch (displaySetting?.view) {
        case "orders":
            displayOrders = true;
            displaySketches = false;
            break;
        case "sketch":
            displayOrders = false;
            displaySketches = true;
            break;
        case "locationsView":
            displayOrders = false;
            displaySketches = false;
            displayLocations = true;
            break;
        default:
            break;
    }

    return (
        <main>
            <div className="m-[20px] flex flex-row items-start justify-start">
                <div className="flex flex-col flex-wrap items-start justify-start">
                    <Routes>
                        <Route path="/sketch" element={<SketchesContainer />} />
                        <Route path="/orders" element={<OrdersLayout />} />
                        <Route
                            path="/locations"
                            element={<LocationGroupEditWrapper />}
                        />
                    </Routes>
                </div>
            </div>
        </main>
    );
};
