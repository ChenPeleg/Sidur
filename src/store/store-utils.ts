import {
    AppConstants,
    RecordBriefModel,
    SaveDataModel,
    SessionModel,
    SidurRecord,
    SidurStore,
    TypeOfRecord,
} from "./store.types";
import { SaveLoadService } from "../services/save-load.service";
import { hashFunction } from "../services/hash-function";
import { CloneUtil } from "../services/clone-utility";
import { ActionsTypes } from "./types.actions";
import { SketchModel } from "../models/Sketch.model";
import { arrangeSketchInCarColumns } from "./arrangeSketchInCarColumns";
import { VehicleModel } from "../models/Vehicle.model";

export const StoreUtils = {
    buildCSVFileFromSketch: (
        sketchObj: SketchModel,
        vehicles: VehicleModel[],
        preferences: any
    ): string => {
        return arrangeSketchInCarColumns(sketchObj, vehicles, preferences);
    },
    removeIdPrefix: (id: string): string => {
        const replaceIdsNames: RegExp = new RegExp(
            AppConstants.ArchiveIdPrefix + "|" + AppConstants.deleteIdPrefix,
            "g"
        );
        return id.replace(replaceIdsNames, "");
    },
    HandleReducerSaveToLocalStorage: (state: SidurStore): void => {
        const saveObj: SaveDataModel = StoreUtils.buildSaveDataModel(
            state,
            "chen",
            "chen"
        );
        SaveLoadService.saveToLocalStorage(saveObj);
    },
    updateRecordBrief: (state: SidurStore): SidurStore => {
        const newState = { ...state };
        const allSiduresVisiable = newState.sidurCollection.concat(
            newState.sidurArchive
        );
        const allLocationGroups = [...newState.LocationGroups];
        const sidurRecords: RecordBriefModel[] = allSiduresVisiable.map((s) => {
            const newSidurRecord: RecordBriefModel = {
                dbId: s.dbId,
                id: s.id,
                locationGroupOrSidurId: s.locationGroupIdForSidur,
                name: s.Name,
                typeOfRecord: TypeOfRecord.Sidur,
            };
            return newSidurRecord;
        });
        const locationRecords: RecordBriefModel[] = allLocationGroups.map(
            (s) => {
                const newSidurRecord: RecordBriefModel = {
                    dbId: s.dbId,
                    id: s.id,
                    locationGroupOrSidurId: s.id,
                    name: s.name,
                    typeOfRecord: TypeOfRecord.LocationGroup,
                };
                return newSidurRecord;
            }
        );

        newState.recordBriefs = sidurRecords.concat(locationRecords);
        return newState;
    },

    UpdateSidurCollectionWithCurrenSidur: (
        state: SidurStore
    ): SidurRecord[] => {
        const newState = { ...state };
        const sidurId = newState.sidurId;
        const updatedOrders = newState.orders.map((o) => ({ ...o }));
        const updatedVehicles = newState.vehicles.map((o) => ({ ...o }));
        const updatedDeletedOrders = newState.deletedOrders.map((o) => ({
            ...o,
        }));
        const updatedSketches = newState.sketches.map((o) => ({ ...o }));
        newState.sidurCollection = newState.sidurCollection.map(
            (sidur: SidurRecord) => {
                if (sidur.id === sidurId) {
                    const updatedSidur = { ...sidur };
                    updatedSidur.orders = updatedOrders;
                    updatedSidur.vehicles = updatedVehicles;
                    updatedSidur.sketches = updatedSketches;
                    updatedSidur.deletedOrders = updatedDeletedOrders;
                    return updatedSidur;
                } else {
                    return sidur;
                }
            }
        );
        return newState.sidurCollection;
    },
    buildSaveDataModel: (
        state: SidurStore,
        userName: string = "chen",
        userId: string = "chen"
    ): SaveDataModel => {
        const hash = hashFunction(JSON.stringify(state));
        return {
            userName: "chen",
            userId: "chen",
            savedStore: state,
            timeStamp: SaveLoadService.getTimeStampFromDate(),
            hash: hash.toString(),
        };
    },
    updateSidurRecordWithSketchChanges(state: SidurStore): SidurStore {
        const newState = { ...state };
        const thisSidurInCollection: SidurRecord | undefined =
            newState.sidurCollection.find(
                (sidur: SidurRecord) => sidur.id === newState.sidurId
            );

        if (thisSidurInCollection) {
            thisSidurInCollection.sketches = newState.sketches.map((s) =>
                CloneUtil.deepCloneSketch(s)
            );
        }

        return newState;
    },
    shieldAnimationBeforeDispatch(
        dispatchingAction: () => void,
        dispatchFunct: any,
        delay: number = 600
    ) {
        const callArguments = {
            type: ActionsTypes.START_LOADING_ANIMATION,
            payload: {
                value: null,
            },
        };
        dispatchFunct(callArguments);
        setTimeout((_) => {
            dispatchingAction();
        }, delay);
    },

    defaultSessionState(): SessionModel {
        const defaultSession: SessionModel = {
            LocationGroupTabOpen: null,
            SketchIdInEdit: null,
            dataHolderForCurrentOrderInEdit: null,
            isAnimationRunning: true,
            locationGroupInEdit: null,
            locationMainInEdit: null,
            orderIdInEdit: null,
            pendingOrderInEditAction: null,
            pendingOrderInEditActionSelectDrives: null,
            pendingOrderIdInEdit: null,
            routeIdInEdit: null,
            transportIdInEdit: null,
            openDialog: null,
            importSheetCheckStatus: false,
        };
        return defaultSession;
    },
    abortSessionPendingOrderState(state: SidurStore) {
        state.sessionState.pendingOrderInEditActionSelectDrives = [];
        state.sessionState.pendingOrderInEditAction = null;
    },
};
