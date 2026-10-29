import React from "react";

import { useSelector } from "react-redux";
import {
    DriveModel,
    SketchModel,
    VehicleScheduleModel,
} from "../../models/Sketch.model";
import { VehicleModel } from "../../models/Vehicle.model";
import { SketchPendingOrders } from "./SketchPendeingOrders";
import { SketchDriveEditDialog } from "../Dialogs/sketch-drive-edit-dialog";
import { SidurStore } from "../../store/store.types";
import { SketchNoSketchMessage } from "./sketch-no-sketch-message";
import { SketchDriveMergeDialog } from "../Dialogs/sketch-drive-merge-dialog";
import { SketchDriveOrderEditActionEnum } from "../../models/SketchDriveOrderEditActionEnum";
import { SketchOrderToTransportDialog } from "../Dialogs/sketch-order-to-transport-dialog";
import { SketchVehicleColumn } from "./SketchVehicleColumn";
import { useSketchDialogs } from "./hooks/useSketchDialogs";

export const Sketch = () => {
    const sketchIdInEdit = useSelector(
        (state: SidurStore) => state.sessionState.sketchIdInEdit
    );
    const pendingOrderInEditActionSelectDrives = useSelector(
        (state: SidurStore) =>
            state.sessionState.pendingOrderInEditActionSelectDrives || []
    );
    const pendingOrderInEditAction: SketchDriveOrderEditActionEnum | null =
        useSelector(
            (state: SidurStore) => state.sessionState.pendingOrderInEditAction
        );
    const sessionState = useSelector((state: SidurStore) => state.sessionState);
    const vehicles = useSelector(
        (state: { vehicles: VehicleModel[] }) => state.vehicles
    );
    const sketches: SketchModel[] = useSelector(
        (state: { sketches: SketchModel[] }) => state.sketches
    );

    const dialogs = useSketchDialogs();

    const addToVehicleButtonShown =
        pendingOrderInEditAction ===
        SketchDriveOrderEditActionEnum.AddToVehicle;

    const sketchDriveClickHandler = (
        event: React.MouseEvent<HTMLElement>,
        drive: DriveModel,
        vehicleId: string
    ) => {
        if (
            sessionState.pendingOrderInEditAction &&
            sessionState.pendingOrderIdInEdit
        ) {
            const order = sketchInEdit?.unassignedOrders.find(
                (o) => o.id === sessionState.pendingOrderIdInEdit
            );
            if (order) {
                switch (sessionState.pendingOrderInEditAction) {
                    case SketchDriveOrderEditActionEnum.ReplaceExisting:
                        dialogs.HandleDriveReplace(order, drive, vehicleId);
                        break;
                    case SketchDriveOrderEditActionEnum.Merge:
                        dialogs.HandleDriveMerge(order, drive, vehicleId);
                        break;
                }
            }
            return;
        }
        dialogs.setChosenDrive({ drive, vehicleId });
        dialogs.setSketchDriveEditOpen(true);
    };

    const getVehicleNameFromId = (vehicleId: string): string | null => {
        return (
            vehicles.find((v) => v.id === vehicleId)?.vehicleName || vehicleId
        );
    };

    const sketchInEdit: SketchModel | null =
        sketches.find((sketch: SketchModel) => sketch.id === sketchIdInEdit) ||
        null;

    return sketchInEdit ? (
        <div id={"sketch--scroll-container"} className="overflow-auto w-screen">
            <div id={"sketch-container"} className="inline-block">
                <div
                    id={"sketch-wrapper-row"}
                    className="pr-5 pl-20 flex flex-row items-start mb-2.5 justify-center min-w-[30vw]"
                >
                    <SketchPendingOrders
                        pendingOrders={sketchInEdit.unassignedOrders}
                    />

                    {sketchInEdit.vehicleSchedules.map(
                        (vehicleTimeTable: VehicleScheduleModel, i: number) => (
                            <SketchVehicleColumn
                                key={i}
                                vehicleTimeTable={vehicleTimeTable}
                                vehicleName={getVehicleNameFromId(
                                    vehicleTimeTable.VehicleId
                                )}
                                addToVehicleButtonShown={
                                    addToVehicleButtonShown
                                }
                                pendingOrderInEditActionSelectDrives={
                                    pendingOrderInEditActionSelectDrives
                                }
                                onDriveClick={sketchDriveClickHandler}
                                onAddDrive={dialogs.HandleAddDrive}
                            />
                        )
                    )}
                </div>
                {dialogs.chosenDrive ? (
                    <SketchDriveEditDialog
                        vehicleId={"1"}
                        open={dialogs.sketchDriveEditOpen}
                        onClose={dialogs.handleSketchDriveEditClose}
                        sketchDriveData={dialogs.chosenDrive}
                        onDelete={dialogs.handleSketchDriveEditDelete}
                    />
                ) : null}
                {dialogs.chosenDrive &&
                sessionState.pendingOrderIdInEdit &&
                dialogs.sketchDriveMergeOpen ? (
                    <SketchDriveMergeDialog
                        vehicleId={"1"}
                        open={dialogs.sketchDriveMergeOpen}
                        onClose={dialogs.handleSketchDriveMergeClose}
                        sketchDriveData={dialogs.chosenDrive}
                        PendingOrderToMergeId={
                            sessionState.pendingOrderIdInEdit
                        }
                        onDelete={dialogs.handleSketchDriveEditDelete}
                    />
                ) : null}
                {sessionState.pendingOrderIdInEdit &&
                dialogs.sketchOrderToTransportOpen ? (
                    <SketchOrderToTransportDialog
                        open={dialogs.sketchOrderToTransportOpen}
                        onClose={dialogs.handleSketchOrderToTransportClose}
                        PendingOrderToTransportId={
                            sessionState.pendingOrderIdInEdit
                        }
                    />
                ) : null}
            </div>
        </div>
    ) : (
        <SketchNoSketchMessage />
    );
};

