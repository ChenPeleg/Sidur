import {ActionsTypes} from './types.actions';


import {IAction, SidurRecord, SidurStore} from './store.types';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {CloneUtil} from '../services/clone-utility';

export type SketchDriveReducerFunctions = ActionsTypes.DELETE_SKETCH_DRIVE
                                          | ActionsTypes.UPDATE_SKETCH_DRIVE


export const SketchDriveReducer: Record<SketchDriveReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {

    [ActionsTypes.UPDATE_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchDriveChanged: DriveModel = action.payload.value
        const SketchIdInEdit = newState.SketchIdInEdit;

        const sketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(state, sketchDriveChanged.id);
            const relevantVehicle = sketchObj.vehicleSchedules.find(v => v.id === vehicleId);
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map((d: DriveModel) => {
                    if (d.id === sketchDriveChanged.id) {
                        return sketchDriveChanged
                    } else {
                        return d
                    }
                })
            }


        }
        return newState

    },

    [ActionsTypes.DELETE_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchToDelete = action.payload.id// newState.sidurId;
        let posOfDeletedSketch = -1;
        let deletedSketch: SketchModel | undefined = newState.sketches.find(s => s.id === sketchToDelete);
        if (deletedSketch) {
            posOfDeletedSketch = newState.sketches.indexOf(deletedSketch);
            deletedSketch = {...deletedSketch};
            deletedSketch.id = 'Del' + deletedSketch.id;
            // newState.sidurArchive.push(deletedSketch);
        }

        newState.sketches = newState.sketches.filter(s => s.id !== sketchToDelete);
        if (newState.sketches.length) {
            const sketchesIds = newState.sketches.map(s => s.id);
            if (posOfDeletedSketch > 1) {
                newState.SketchIdInEdit = sketchesIds [posOfDeletedSketch - 1]
            } else {
                newState.SketchIdInEdit = sketchesIds [0]
            }
        } else {
            newState.SketchIdInEdit = ''
        }

        newState = updateSidurRecordWithSketchChanges(newState)
        return newState

    },


}
const updateSidurRecordWithSketchChanges = (state: SidurStore): SidurStore => {
    const newState = {...state};
    const thisSidurInCollection: SidurRecord | undefined = newState.sidurCollection.find((sidur: SidurRecord) => sidur.id === newState.sidurId);


    if (thisSidurInCollection) {
        thisSidurInCollection.sketches = newState.sketches.map(s => CloneUtil.deepCloneSketch(s))
    }


    return newState

}


const getVehicleIdFromDriveId = (state: SidurStore, driveId: string): string => {
    const SketchIdInEdit = state.SketchIdInEdit
    const sketchObj: SketchModel | undefined = state.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);
    const vehicleSchedules = sketchObj?.vehicleSchedules || [];
    let vehicleId = '';
    vehicleSchedules.forEach((v: VehicleScheduleModel) => {
        v.drives.forEach((d: DriveModel) => {
            if (d.id === driveId) {
                vehicleId = v.id
            }

        })
    })
    return vehicleId

}
