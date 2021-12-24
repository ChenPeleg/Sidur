import {ActionsTypes} from './types.actions';


import {IAction, SidurRecord, SidurStore} from './store.types';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {CloneUtil} from '../services/clone-utility';
import {OrderModel} from '../models/Order.model';

export type SketchDriveReducerFunctions = ActionsTypes.DELETE_SKETCH_DRIVE
                                          | ActionsTypes.UPDATE_SKETCH_DRIVE | ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE


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

    [ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}

        const sketchDriveChangedId: string = action.payload.sketchDriveId
        const orderIdToRemove: string = action.payload.orderId
        const SketchIdInEdit = newState.SketchIdInEdit;


        const sketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(state, sketchDriveChangedId);
            const relevantVehicle = sketchObj.vehicleSchedules.find(v => v.id === vehicleId);
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map((d: DriveModel) => {
                    if (d.id === sketchDriveChangedId) {
                        const newDrive = {...d};
                        newDrive.implementsOrders = (newDrive.implementsOrders).filter(ord => ord !== orderIdToRemove)

                        return newDrive
                    } else {
                        return d
                    }
                })
            }
            let OrderToMoveToUnassinged: OrderModel | undefined = sketchObj.assignedOrders.find(o => o.id === orderIdToRemove);
            if (OrderToMoveToUnassinged) {
                sketchObj.assignedOrders = sketchObj.assignedOrders.filter(o => o.id !== orderIdToRemove);
                sketchObj.unassignedOrders = [...sketchObj.unassignedOrders];
                sketchObj.unassignedOrders.push(OrderToMoveToUnassinged);


            }


        }
        updateSidurRecordWithSketchChanges(newState)
        return newState

    },
    [ActionsTypes.DELETE_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchDriveToDelete: DriveModel = action.payload.value
        const SketchIdInEdit = newState.SketchIdInEdit;

        const sketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(state, sketchDriveToDelete.id);
            const relevantVehicle = sketchObj.vehicleSchedules.find(v => v.id === vehicleId);
            if (relevantVehicle) {

                const newDrives: (DriveModel | null) [] = relevantVehicle.drives.map((d: DriveModel) => {
                    if (d.id === sketchDriveToDelete.id) {
                        return null
                    } else {
                        return d
                    }
                });
                relevantVehicle.drives = newDrives.filter(d => d) as DriveModel[]
            }


        }
        updateSidurRecordWithSketchChanges(newState)
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
