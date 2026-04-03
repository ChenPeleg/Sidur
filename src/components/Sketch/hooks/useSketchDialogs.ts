import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DriveModel, SketchModel } from "../../../models/Sketch.model";
import { OrderModel } from "../../../models/Order.model";
import { ActionsTypes } from "../../../store/types.actions";
import { SidurStore } from "../../../store/store.types";
import { SketchDriveOrderEditActionEnum } from "../../../models/SketchDriveOrderEditActionEnum";

export interface ChosenDrive {
    drive: DriveModel;
    vehicleId: string;
}

export interface UseSketchDialogsResult {
    sketchDriveEditOpen: boolean;
    sketchDriveMergeOpen: boolean;
    sketchOrderToTransportOpen: boolean;
    chosenDrive: ChosenDrive | null;
    handleSketchDriveEditDelete: (sketchDriveData: ChosenDrive) => void;
    handleSketchDriveEditClose: (value: DriveModel | null) => void;
    handleSketchOrderToTransportClose: (value: OrderModel | null) => void;
    handleSketchDriveMergeClose: (value: DriveModel | null) => void;
    HandleDriveMerge: (
        pendingOrderToMerge: OrderModel,
        driveToMerge: DriveModel,
        vehicleId: string
    ) => void;
    HandleDriveReplace: (
        pendingOrder: OrderModel,
        driveToReplace: DriveModel,
        vehicleId: string
    ) => void;
    HandleAddDrive: (vehicleTimeTableId: string) => void;
    setChosenDrive: React.Dispatch<React.SetStateAction<ChosenDrive | null>>;
    setSketchDriveEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSketchDialogs = (): UseSketchDialogsResult => {
    const dispatch = useDispatch();
    const sessionState = useSelector((state: SidurStore) => state.sessionState);

    const [sketchDriveEditOpen, setSketchDriveEditOpen] = useState(false);
    const [sketchDriveMergeOpen, setSketchDriveMergeOpen] = useState(false);
    const [sketchOrderToTransportOpen, setSketchOrderToTransportOpen] =
        useState(false);
    const [chosenDrive, setChosenDrive] = useState<ChosenDrive | null>(null);

    if (
        sessionState.pendingOrderInEditAction ===
            SketchDriveOrderEditActionEnum.publicTransport &&
        !sketchOrderToTransportOpen
    ) {
        setSketchOrderToTransportOpen(true);
    }

    const handleSketchDriveEditDelete = (sketchDriveData: ChosenDrive) => {
        setSketchDriveEditOpen(false);
        setChosenDrive(null);
        const value = sketchDriveData.drive;
        dispatch({
            type: ActionsTypes.DELETE_SKETCH_DRIVE,
            payload: { value },
        });
    };

    const handleSketchDriveEditClose = (value: DriveModel | null) => {
        setSketchDriveEditOpen(false);
        setChosenDrive(null);
        if (value) {
            dispatch({
                type: ActionsTypes.UPDATE_SKETCH_DRIVE,
                payload: { value },
            });
        }
    };

    const handleSketchOrderToTransportClose = (value: OrderModel | null) => {
        setSketchOrderToTransportOpen(false);
        setChosenDrive(null);
        if (value) {
            dispatch({
                type: ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER,
                payload: { value },
            });
        } else {
            dispatch({
                type: ActionsTypes.REMOVE_PENDING_ORDER_STATUS,
                payload: { value },
            });
        }
    };

    const handleSketchDriveMergeClose = (value: DriveModel | null) => {
        setSketchDriveMergeOpen(false);
        setChosenDrive(null);
        if (value) {
            dispatch({
                type: ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER,
                payload: { value },
            });
        } else {
            dispatch({
                type: ActionsTypes.REMOVE_PENDING_ORDER_STATUS,
                payload: { value },
            });
        }
    };

    const HandleDriveMerge = (
        _pendingOrderToMerge: OrderModel,
        driveToMerge: DriveModel,
        vehicleId: string
    ): void => {
        setChosenDrive({ drive: driveToMerge, vehicleId });
        setSketchDriveMergeOpen(true);
    };

    const HandleDriveReplace = (
        _pendingOrder: OrderModel,
        driveToReplace: DriveModel,
        _vehicleId: string
    ): void => {
        dispatch({
            type: ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER,
            payload: { value: driveToReplace },
        });
    };

    const HandleAddDrive = (vehicleTimeTableId: string): void => {
        dispatch({
            type: ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER,
            payload: { value: vehicleTimeTableId },
        });
    };

    return {
        sketchDriveEditOpen,
        sketchDriveMergeOpen,
        sketchOrderToTransportOpen,
        chosenDrive,
        handleSketchDriveEditDelete,
        handleSketchDriveEditClose,
        handleSketchOrderToTransportClose,
        handleSketchDriveMergeClose,
        HandleDriveMerge,
        HandleDriveReplace,
        HandleAddDrive,
        setChosenDrive,
        setSketchDriveEditOpen,
    };
};
