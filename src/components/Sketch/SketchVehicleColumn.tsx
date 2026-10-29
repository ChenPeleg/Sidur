import React from "react";
import { Collapse, Divider, Typography } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { DriveModel, VehicleScheduleModel } from "../../models/Sketch.model";
import { ChooseDriveMode, SketchDrive } from "./SketchDrive";
import { SketchVehicleAddButton } from "../buttons/sketch-vehicle-add-button";

interface SketchVehicleColumnProps {
    vehicleTimeTable: VehicleScheduleModel;
    vehicleName: string | null;
    addToVehicleButtonShown: boolean;
    pendingOrderInEditActionSelectDrives: string[];
    onDriveClick: (
        event: React.MouseEvent<HTMLElement>,
        drive: DriveModel,
        vehicleId: string
    ) => void;
    onAddDrive: (vehicleTimeTableId: string) => void;
}

export const SketchVehicleColumn = ({
    vehicleTimeTable,
    vehicleName,
    addToVehicleButtonShown,
    pendingOrderInEditActionSelectDrives,
    onDriveClick,
    onAddDrive,
}: SketchVehicleColumnProps) => {
    return (
        <div key={vehicleTimeTable.id}>
            <div
                id={"vehicle-column"}
                className="flex flex-col items-stretch m-[15px] mt-0 justify-start min-w-[6vw] min-h-[60vh]"
            >
                <Typography variant={"h6"}>
                    &nbsp;{vehicleName || vehicleTimeTable.VehicleId}&nbsp;
                </Typography>
                {addToVehicleButtonShown ? (
                    <SketchVehicleAddButton
                        sketchDriveClick={() => onAddDrive(vehicleTimeTable.id)}
                    />
                ) : null}
                <TransitionGroup>
                    {vehicleTimeTable.drives.map(
                        (drive: DriveModel, i: number) => {
                            let chooseDriveMode = ChooseDriveMode.NotActive;
                            if (
                                pendingOrderInEditActionSelectDrives.length > 0
                            ) {
                                if (
                                    pendingOrderInEditActionSelectDrives.includes(
                                        drive.id
                                    )
                                ) {
                                    chooseDriveMode = ChooseDriveMode.selectable;
                                } else {
                                    chooseDriveMode =
                                        ChooseDriveMode.nonSelectable;
                                }
                            }

                            return (
                                <Collapse key={i}>
                                    <SketchDrive
                                        chooseDriveMode={chooseDriveMode}
                                        sketchDriveClick={(
                                            event: React.MouseEvent<HTMLElement>,
                                            drive: DriveModel
                                        ) =>
                                            onDriveClick(
                                                event,
                                                drive,
                                                vehicleTimeTable.id
                                            )
                                        }
                                        key={i}
                                        drive={drive}
                                        previousDrive={
                                            vehicleTimeTable.drives[i - 1] ||
                                            null
                                        }
                                    />
                                </Collapse>
                            );
                        }
                    )}
                </TransitionGroup>
            </div>
            <Divider
                orientation="vertical"
                variant={"fullWidth"}
                sx={{ borderRight: "2px solid black " }}
                flexItem
            />
        </div>
    );
};
