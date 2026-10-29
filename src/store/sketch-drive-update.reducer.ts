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

export type SketchDriveUpdateReducerFunctions =
    | ActionsTypes.UPDATE_SKETCH_DRIVE
    | ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER
    | ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER;

export const SketchDriveUpdateReducer: Record<
    SketchDriveUpdateReducerFunctions,
    (state: SidurStore, action: IAction) => SidurStore
> = {
    [ActionsTypes.UPDATE_SKETCH_DRIVE]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        const newState = { ...state };
        const sketchDriveChanged: DriveModel = action.payload.value;
        const sketchIdInEdit = newState.sessionState.sketchIdInEdit;

        const sketchObj: SketchModel | undefined = newState.sketches.find(
            (record: SketchModel) => record.id === sketchIdInEdit
        );

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(
                state,
                sketchDriveChanged.id
            );
            const relevantVehicle = sketchObj.vehicleSchedules.find(
                (v) => v.id === vehicleId
            );
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map(
                    (d: DriveModel) => {
                        if (d.id === sketchDriveChanged.id) {
                            return sketchDriveChanged;
                        } else {
                            return d;
                        }
                    }
                );
                sortVehicleByStartHour(relevantVehicle);
            }
        }
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        const newState = { ...state };
        const sketchDriveChanged: DriveModel = action.payload.value;
        const sketchIdInEdit = newState.sessionState.sketchIdInEdit;
        newState.sessionState.pendingOrderInEditAction = null;
        newState.sessionState.pendingOrderInEditActionSelectDrives = null;
        const sketchObj: SketchModel | undefined = newState.sketches.find(
            (record: SketchModel) => record.id === sketchIdInEdit
        );

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(
                state,
                sketchDriveChanged.id
            );
            const relevantVehicle = sketchObj.vehicleSchedules.find(
                (v) => v.id === vehicleId
            );
            let pendingOrdersToPassToAssigned: string[] | null = null;
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map(
                    (d: DriveModel) => {
                        if (d.id === sketchDriveChanged.id) {
                            pendingOrdersToPassToAssigned = d.implementsOrders;
                            return sketchDriveChanged;
                        } else {
                            return d;
                        }
                    }
                );
                sortVehicleByStartHour(relevantVehicle);
            }
            if (pendingOrdersToPassToAssigned !== null) {
                const implementedOrders: string[] =
                    pendingOrdersToPassToAssigned as string[];
                const ordersToMoveToAssigned: OrderModel[] =
                    sketchObj.unassignedOrders.filter((o: OrderModel) =>
                        implementedOrders.includes(o.id)
                    );
                sketchObj.assignedOrders = sketchObj.assignedOrders.concat(
                    ordersToMoveToAssigned
                );
                sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter(
                    (o: OrderModel) => !implementedOrders.includes(o.id)
                );
            }
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        const newState = { ...state };
        const sketchDriveToReplace: DriveModel = action.payload.value;
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
            const vehicleId = getVehicleIdFromDriveId(
                state,
                sketchDriveToReplace.id
            );
            const relevantVehicle = sketchObj.vehicleSchedules.find(
                (v) => v.id === vehicleId
            );
            let assignedOrdersPassToPending: string[] | null = null;
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map(
                    (d: DriveModel) => {
                        if (d.id === sketchDriveToReplace.id) {
                            assignedOrdersPassToPending = d.implementsOrders;
                            return newDriveToInsert;
                        } else {
                            return d;
                        }
                    }
                );
                sortVehicleByStartHour(relevantVehicle);
            }

            sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter(
                (o: OrderModel) => o.id !== pendingOrderId
            );

            if (assignedOrdersPassToPending !== null) {
                const implementedOrdersFromReplacedDrive: string[] =
                    assignedOrdersPassToPending as string[];
                const ordersToMoveToPending: OrderModel[] =
                    sketchObj.assignedOrders.filter((o: OrderModel) =>
                        implementedOrdersFromReplacedDrive.includes(o.id)
                    );
                sketchObj.unassignedOrders = sketchObj.unassignedOrders.concat(
                    ordersToMoveToPending
                );
                sketchObj.assignedOrders = sketchObj.assignedOrders.filter(
                    (o: OrderModel) =>
                        !implementedOrdersFromReplacedDrive.includes(o.id)
                );
            }
        }
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
};
