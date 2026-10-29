import { ActionsTypes } from "./types.actions";

import { IAction, SidurRecord, SidurStore } from "./store.types";
import { StoreUtils } from "./store-utils";
import { Utils } from "../services/utils";
import { SidurBuilder } from "../sidurBuilder/sidurBuilder.main";
import { SketchModel } from "../models/Sketch.model";
import { CloneUtil } from "../services/clone-utility";
import { translations } from "../services/translations";
import { DownloadCSVFile } from "../services/downloadFile";

export type SketchReducerFunctions =
    | ActionsTypes.NEW_SKETCH
    | ActionsTypes.CHOOSE_SKETCH
    | ActionsTypes.RENAME_SKETCH
    | ActionsTypes.DELETE_SKETCH
    | ActionsTypes.CLONE_SKETCH
    | ActionsTypes.DOWNLOAD_SKETCH;

export const SketchReducer: Record<
    SketchReducerFunctions,
    (state: SidurStore, action: IAction) => SidurStore
> = {
    [ActionsTypes.NEW_SKETCH]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        if (!newState.sketches) {
            newState.sketches = [];
        }
        const newId = Utils.getNextId(newState.sketches.map((v) => v.id));
        const chosenSidurObj: SidurRecord | undefined =
            newState.sidurCollection.find(
                (record: SidurRecord) => record.id === newState.sidurId
            );
        if (chosenSidurObj !== undefined) {
            const updatedSidur = { ...chosenSidurObj };
            updatedSidur.orders = newState.orders;
            updatedSidur.sketches = newState.sketches;
            updatedSidur.vehicles = newState.vehicles;
            const newSketch = SidurBuilder(
                updatedSidur,
                newState.Locations
            );
            newSketch.id = newId;
            if (!newState.sketches) {
                newState.sketches = [];
            }
            newState.sketches.push(newSketch);
            newState.sessionState.sketchIdInEdit = newId;
        }

        newState = StoreUtils.updateSidurRecordWithSketchChanges(newState);
        StoreUtils.HandleReducerSaveToLocalStorage(newState);
        return newState;
    },
    [ActionsTypes.DOWNLOAD_SKETCH]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const sketchId = action.payload.id;
        const sketchToDownload = newState.sketches.find(
            (s) => s.id === sketchId
        );
        if (sketchToDownload) {
            const thisSidurInCollection: SidurRecord | undefined =
                newState.sidurCollection.find(
                    (sidur: SidurRecord) => sidur.id === newState.sidurId
                );
            const saveObj: string = StoreUtils.buildCSVFileFromSketch(
                sketchToDownload,
                thisSidurInCollection?.vehicles || [],
                {}
            );
            const sidurName = thisSidurInCollection?.Name || "";
            const name =
                sidurName +
                " " +
                translations.Sketch +
                " " +
                sketchToDownload.name +
                ".csv";
            DownloadCSVFile(name, saveObj);
        }
        newState = StoreUtils.updateSidurRecordWithSketchChanges(newState);
        return newState;
    },
    [ActionsTypes.CHOOSE_SKETCH]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const chosenSketchId = action.payload.id;
        const previousSketchId = newState.sessionState.sketchIdInEdit;
        if (chosenSketchId === previousSketchId) {
            return newState;
        }
        newState.sessionState.sketchIdInEdit = chosenSketchId;
        const chosenSketchObj: SketchModel | undefined = newState.sketches.find(
            (record: SketchModel) => record.id === chosenSketchId
        );
        if (chosenSketchObj !== undefined) {
            const thisSidurInCollection: SidurRecord | undefined =
                newState.sidurCollection.find(
                    (sidur: SidurRecord) => sidur.id === newState.sidurId
                );

            if (thisSidurInCollection) {
                thisSidurInCollection.chosenSketch = chosenSketchId;
            }
        }
        return newState;
    },
    [ActionsTypes.RENAME_SKETCH]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const sketchId = action.payload.id; // newState.sidurId;
        const newName = action.payload.value;
        if (!newName) {
            return newState;
        }
        newState.sketches = newState.sketches.map((sketch: SketchModel) => {
            if (sketch.id === sketchId) {
                const updatedSketch = { ...sketch };
                updatedSketch.name = newName;
                return updatedSketch;
            } else {
                return sketch;
            }
        });
        newState = StoreUtils.updateSidurRecordWithSketchChanges(newState);
        return newState;
    },
    [ActionsTypes.DELETE_SKETCH]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const sketchToDelete = action.payload.id;
        let posOfDeletedSketch = -1;
        let deletedSketch: SketchModel | undefined = newState.sketches.find(
            (s) => s.id === sketchToDelete
        );
        if (deletedSketch) {
            posOfDeletedSketch = newState.sketches.indexOf(deletedSketch);
            deletedSketch = { ...deletedSketch };
            deletedSketch.id = "Del" + deletedSketch.id;
            // newState.sidurArchive.push(deletedSketch);
        }

        newState.sketches = newState.sketches.filter(
            (s) => s.id !== sketchToDelete
        );
        if (newState.sketches.length) {
            const sketchesIds = newState.sketches.map((s) => s.id);
            if (posOfDeletedSketch > 1) {
                newState.sessionState.sketchIdInEdit =
                    sketchesIds[posOfDeletedSketch - 1];
            } else {
                newState.sessionState.sketchIdInEdit = sketchesIds[0];
            }
        } else {
            newState.sessionState.sketchIdInEdit = "";
        }

        newState = StoreUtils.updateSidurRecordWithSketchChanges(newState);
        return newState;
    },
    [ActionsTypes.CLONE_SKETCH]: (
        state: SidurStore,
        action: IAction
    ): SidurStore => {
        let newState = { ...state };
        const sketchIdToClone = action.payload.id; // newState.sidurId;
        let sketchForCloning: SketchModel | undefined = newState.sketches.find(
            (s) => s.id === sketchIdToClone
        );

        if (sketchForCloning) {
            const newSketch: SketchModel =
                CloneUtil.deepCloneSketch(sketchForCloning);
            newSketch.name = translations.CopyOf + " " + newSketch.name;
            const newSketchId = Utils.getNextId(getAllSketchesIDs(state));
            newSketch.id = newSketchId;
            newState.sketches = newState.sketches.map((c) => c);
            newState.sketches.push(newSketch);
            newState.sessionState.sketchIdInEdit = newSketchId;
            // newState = setChosenSidur(newState, newSketch);
        }
        newState = StoreUtils.updateSidurRecordWithSketchChanges(newState);
        return newState;
    },
};

const getAllSketchesIDs = (state: SidurStore): string[] => {
    const sketchesIds = state.sketches.map((o) => o.id);

    return [...sketchesIds];
};
