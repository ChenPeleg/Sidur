import React, { useState } from "react";
import { translations } from "../../services/translations";
import { useDispatch, useSelector } from "react-redux";
import { ActionsTypes } from "../../store/types.actions";
import { VehicleModel } from "../../models/Vehicle.model";
import { Add, TimeToLeave } from "@mui/icons-material";
import { Badge, Button } from "@mui/material";
import { VehicleEditDialog } from "../Dialogs/vehicle-edit-dialog";
import { defaultVehicleValues } from "../../store/store.types";

export const Vehicles = () => {
    const [vehicleEditOpen, setVehicleEditOpen] = useState(false);
    const [vehicleClicked, setVehicleClicked] = useState(null);
    const dispatch = useDispatch();
    const vehicles = useSelector(
        (state: { vehicles: VehicleModel[] }) => state.vehicles || []
    );

    const handleVehicleEditClose = (value: VehicleModel | null) => {
        setVehicleEditOpen(false);

        if (value) {
            if (value.id === "0") {
                dispatch({
                    type: ActionsTypes.NEW_VEHICLE,
                    payload: {
                        value,
                    },
                });
            } else {
                dispatch({
                    type: ActionsTypes.UPDATE_VEHICLE,
                    payload: {
                        value,
                    },
                });
            }
        }
    };
    const handleVehicleDelete = (id: string | null) => {
        setVehicleEditOpen(false);
        if (id) {
            dispatch({
                type: ActionsTypes.DELETE_VEHICLE,
                payload: {
                    id,
                },
            });
        }
    };
    const vehicleClickHandler = (event: any, vehicleId: string) => {
        const foundVehicle = vehicles.find((v) => v.id === vehicleId);
        const vehicle: any =
            vehicleId !== "0" && foundVehicle
                ? foundVehicle
                : {
                      ...defaultVehicleValues,
                      id: "0",
                  };
        setVehicleClicked(vehicle);
        setVehicleEditOpen(true);
    };

    return (
        <div>
            <div className="text-lg mb-[1em] flex flex-row flex-wrap items-start justify-start">
                {vehicles.map((v: VehicleModel, index: number) => (
                    <div key={index} className="flex m-[0.5em] mt-0 flex-col items-center justify-center">
                        <Button
                            variant="contained"
                            onClick={(event) => {
                                vehicleClickHandler(event, v.id);
                            }}
                        >
                            <Badge
                                color={"warning"}
                                invisible={v.seats === "5"}
                                badgeContent={7}
                            >
                                <TimeToLeave
                                    sx={{
                                        width: "1.2em",
                                        height: "1.2em",
                                    }}
                                />
                            </Badge>

                            {v.vehicleName}
                        </Button>
                    </div>
                ))}
                <div className="flex m-[0.5em] mt-0 flex-col items-center justify-center">
                    <Button
                        variant="contained"
                        onClick={(event) => vehicleClickHandler(event, "0")}
                    >
                        <Add
                            sx={{
                                width: "1.2em",
                                height: "1.2em",
                            }}
                        />{" "}
                        {translations.AddVehicles}{" "}
                    </Button>
                </div>
            </div>
            <VehicleEditDialog
                vehicleData={vehicleClicked}
                open={vehicleEditOpen}
                onClose={handleVehicleEditClose}
                onDelete={handleVehicleDelete}
            />
        </div>
    );
};
