import { ActionsTypes } from "./types.actions";
import { IAction, SidurStore } from "./store.types";
import { DriveModel, SketchModel } from "../models/Sketch.model";
import { OrderModel } from "../models/Order.model";
import { StoreUtils } from "./store-utils";
import { LanguageUtilities } from "../services/language-utilities";
import {
    getNewDriveIdFromSketch,
    getVehicleIdFromDriveId,
    sortVehicleByStartHour,
} from "./utils/sketch-drive-helpers";

export type SketchDriveOrderReducerFunctions =
    | ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER
    | ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE
    | ActionsTypes.DELETE_SKETCH_DRIVE;

export const SketchDriveOrderReducer: Record<
    SketchDriveOrderReducerFunctions,
    (state: SidurStore, action: IAction) => SidurStore
> = {
    [ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        const newState = { ...state };
        const vehicleTimeTableId: string = action.payload.value;
        const sketchIdInEdit = newState.sessionState.sketchIdInEdit;
        const pendingOrderId = newState.sessionState.pendingOrderIdInEdit;
        newState.sessionState.pendingOrderInEditAction = null;
        newState.sessionState.pendingOrderInEditActionSelectDrives = null;
        const sketchObj: SketchModel | undefined = newState.sketches.find(
            (record: SketchModel) => record.id === sketchIdInEdit
        );
        const pendingOrder = sketchObj?.unassignedOrders.find(
            (o) => o.id === pendingOrderId
        );

        if (sketchObj && pendingOrder) {
            const newDriveId = getNewDriveIdFromSketch(sketchObj);
            const newDriveToInsert: DriveModel = {
                ...pendingOrder,
                id: newDriveId,
                implementsOrders: [pendingOrder.id],
                description: LanguageUtilities.buildBriefText(
                    pendingOrder,
                    newState.Locations
                ).driverAndLocation,
            };

            const relevantVehicle = sketchObj.vehicleSchedules.find(
                (v) => v.id === vehicleTimeTableId
            );

            if (relevantVehicle) {
                relevantVehicle.drives.push(newDriveToInsert);
                sortVehicleByStartHour(relevantVehicle);
            }

            sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter(
                (o: OrderModel) => o.id !== pendingOrderId
            );
            sketchObj.assignedOrders.push(pendingOrder);
        }
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },

    [ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        const newState = { ...state };

        const sketchDriveChangedId: string = action.payload.sketchDriveId;
        const orderIdToRemove: string = action.payload.orderId;
        const sketchIdInEdit = newState.sessionState.sketchIdInEdit;

        const sketchObj: SketchModel | undefined = newState.sketches.find(
            (record: SketchModel) => record.id === sketchIdInEdit
        );

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(
                state,
                sketchDriveChangedId
            );
            const relevantVehicle = sketchObj.vehicleSchedules.find(
                (v) => v.id === vehicleId
            );
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map(
                    (d: DriveModel) => {
                        if (d.id === sketchDriveChangedId) {
                            const newDrive = { ...d };
                            newDrive.implementsOrders =
                                newDrive.implementsOrders.filter(
                                    (ord) => ord !== orderIdToRemove
                                );

                            return newDrive;
                        } else {
                            return d;
                        }
                    }
                );
                sortVehicleByStartHour(relevantVehicle);
            }
            const orderToMoveToUnassigned: OrderModel | undefined =
                sketchObj.assignedOrders.find((o) => o.id === orderIdToRemove);
            if (orderToMoveToUnassigned) {
                sketchObj.assignedOrders = sketchObj.assignedOrders.filter(
                    (o) => o.id !== orderIdToRemove
                );
                sketchObj.unassignedOrders = [...sketchObj.unassignedOrders];
                sketchObj.unassignedOrders.push(orderToMoveToUnassigned);
            }
        }
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.DELETE_SKETCH_DRIVE]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        const newState = { ...state };
        const sketchDriveToDelete: DriveModel = action.payload.value;
        const sketchIdInEdit = newState.sessionState.sketchIdInEdit;

        const sketchObj: SketchModel | undefined = newState.sketches.find(
            (record: SketchModel) => record.id === sketchIdInEdit
        );

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(
                state,
                sketchDriveToDelete.id
            );
            const relevantVehicle = sketchObj.vehicleSchedules.find(
                (v) => v.id === vehicleId
            );
            if (relevantVehicle) {
                const newDrives: (DriveModel | null)[] =
                    relevantVehicle.drives.map((d: DriveModel) => {
                        if (d.id === sketchDriveToDelete.id) {
                            return null;
                        } else {
                            return d;
                        }
                    });
                relevantVehicle.drives = newDrives.filter(
                    (d) => d
                ) as DriveModel[];
                sortVehicleByStartHour(relevantVehicle);
            }
        }
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
};
