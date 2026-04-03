import { IAction, SidurStore } from "./store.types";
import { ActionsTypes } from "./types.actions";
import { SketchModel } from "../models/Sketch.model";
import { OrderModel } from "../models/Order.model";
import { StoreUtils } from "./store-utils";
import { SketchDriveOrderEditActionEnum } from "../models/SketchDriveOrderEditActionEnum";
import { SidurEditorService } from "../sidurEditor/sidurEditor.service";
import { Utils } from "../services/utils";
import {
    getSketchInEdit,
    updateSketchInState,
} from "./utils/pending-orders-helpers";

export type PendingOrdersReducerFunctions =
    | ActionsTypes.CLICKED_PENDING_ORDER
    | ActionsTypes.CLICKED_CLOSE_PENDING_ORDER
    | ActionsTypes.CLICKED_REMOVE_PENDING_ORDER
    | ActionsTypes.CLICKED_MERGE_PENDING_ORDER
    | ActionsTypes.CLICKED_SPLIT_PENDING_ORDER
    | ActionsTypes.CLICKED_CHANGE_PENDING_ORDER
    | ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER
    | ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER
    | ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER
    | ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER
    | ActionsTypes.REMOVE_PENDING_ORDER_STATUS
    | ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER
    | ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER
    | ActionsTypes.CLICKED_ADD_TO_VEHICLE_PENDING_ORDER;

export const PendingOrdersReducer: Record<
    PendingOrdersReducerFunctions,
    (state: SidurStore, action: IAction) => SidurStore
> = {
    [ActionsTypes.CLICKED_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        if (action.payload.id) {
            newState.sessionState.pendingOrderIdInEdit = action.payload.id;
            StoreUtils.abortSessionPendingOrderState(newState);
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_CLOSE_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        newState.sessionState.pendingOrderIdInEdit = null;
        StoreUtils.abortSessionPendingOrderState(newState);
        newState.sessionState = { ...newState.sessionState };
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },

    [ActionsTypes.CLICKED_REMOVE_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const orderToRemoveId = action.payload.id;
        const sketchObj = getSketchInEdit(state);

        if (sketchObj) {
            const orderToRemove: OrderModel | undefined =
                sketchObj.unassignedOrders.find(
                    (o) => o.id === orderToRemoveId
                );
            if (orderToRemove) {
                sketchObj.assignedOrders = [
                    ...sketchObj.assignedOrders,
                    orderToRemove,
                ];
                sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter(
                    (o) => o.id !== orderToRemoveId
                );
                newState = updateSketchInState(newState, sketchObj);
            }
            newState.sessionState.pendingOrderIdInEdit = null;
        }
        StoreUtils.abortSessionPendingOrderState(newState);
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },

    [ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const orderToMoveId = action.payload.id;
        const sketchObj = getSketchInEdit(state);

        if (sketchObj) {
            const orderToMove: OrderModel | undefined =
                sketchObj.unassignedOrders.find((o) => o.id === orderToMoveId);
            if (orderToMove) {
                sketchObj.unassignedOrders = [
                    orderToMove,
                    ...sketchObj.unassignedOrders.filter(
                        (o) => o.id !== orderToMoveId
                    ),
                ];
                newState = updateSketchInState(newState, sketchObj);
            }
        }
        StoreUtils.abortSessionPendingOrderState(newState);
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const orderToMoveId = action.payload.id;
        const sketchObj = getSketchInEdit(state);

        if (sketchObj) {
            const orderToMove: OrderModel | undefined =
                sketchObj.unassignedOrders.find((o) => o.id === orderToMoveId);
            if (orderToMove) {
                sketchObj.unassignedOrders = [
                    ...sketchObj.unassignedOrders.filter(
                        (o) => o.id !== orderToMoveId
                    ),
                    orderToMove,
                ];
                newState = updateSketchInState(newState, sketchObj);
            }
            newState.sessionState.pendingOrderIdInEdit = null;
        }
        StoreUtils.abortSessionPendingOrderState(newState);
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_MERGE_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        newState.sessionState.pendingOrderInEditAction =
            SketchDriveOrderEditActionEnum.Merge;

        const sketchObj = getSketchInEdit(state) as SketchModel;
        const relavantDrives = SidurEditorService.getRelevantDriveIdsToChoose(
            sketchObj,
            newState.sessionState.pendingOrderIdInEdit as string
        );
        if (relavantDrives.length > 0) {
            newState.sessionState.pendingOrderInEditActionSelectDrives =
                relavantDrives;
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_ADD_TO_VEHICLE_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        newState.sessionState.pendingOrderInEditAction =
            SketchDriveOrderEditActionEnum.AddToVehicle;
        newState.sessionState.pendingOrderInEditActionSelectDrives = [
            "noDrivesRealyNeeded",
        ];

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.REMOVE_PENDING_ORDER_STATUS]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };

        newState.sessionState.pendingOrderInEditAction = null;
        newState.sessionState.pendingOrderInEditActionSelectDrives = null;

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_SPLIT_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const orderToSplitId = action.payload.id;
        const sketchObj = getSketchInEdit(state);

        if (sketchObj) {
            const orderToSplit: OrderModel | undefined =
                sketchObj.unassignedOrders.find((o) => o.id === orderToSplitId);
            if (orderToSplit) {
                const newOrders = SidurEditorService.splitTsamudOrder(
                    orderToSplit,
                    newState.Locations
                );
                const allSketchOrders = sketchObj.unassignedOrders.concat(
                    sketchObj.assignedOrders
                );
                const newId1 = Utils.getNextId(
                    allSketchOrders.map((o) => o.id)
                );
                const newId2 = (+newId1 + 1).toString();
                newOrders[0].id = newId1;
                newOrders[1].id = newId2;
                sketchObj.unassignedOrders = [
                    newOrders[0],
                    newOrders[1],
                    ...sketchObj.unassignedOrders.filter(
                        (o) => o.id !== orderToSplit.id
                    ),
                ];
                newState = updateSketchInState(newState, sketchObj);
            }
            newState.sessionState.pendingOrderIdInEdit = null;
        }
        StoreUtils.abortSessionPendingOrderState(newState);
        StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_CHANGE_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        newState.sessionState.pendingOrderInEditAction =
            SketchDriveOrderEditActionEnum.ReplaceExisting;

        const sketchObj = getSketchInEdit(state) as SketchModel;
        const relavantDrives = SidurEditorService.getRelevantDriveIdsToChoose(
            sketchObj,
            newState.sessionState.pendingOrderIdInEdit as string
        );
        if (relavantDrives.length > 0) {
            newState.sessionState.pendingOrderInEditActionSelectDrives =
                relavantDrives;
        }

        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        newState.sessionState.pendingOrderInEditAction =
            SketchDriveOrderEditActionEnum.publicTransport;
        newState.sessionState.pendingOrderIdInEdit = action.payload.id;
        newState.sessionState.pendingOrderInEditActionSelectDrives = null;
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
};
