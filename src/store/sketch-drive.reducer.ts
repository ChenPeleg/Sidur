import {ActionsTypes} from './types.actions';


import {IAction, SidurStore} from './store.types';
import {DriveModel, SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {OrderModel} from '../models/Order.model';
import {StoreUtils} from './store-utils';
import {Utils} from '../services/utils';
import {LanguageUtilities} from '../services/language-utilities';

export type SketchDriveReducerFunctions =
    ActionsTypes.DELETE_SKETCH_DRIVE
    | ActionsTypes.UPDATE_SKETCH_DRIVE
    | ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE
    | ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER
    | ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER


export const SketchDriveReducer: Record<SketchDriveReducerFunctions, (state: SidurStore, action: IAction) => SidurStore> = {

    [ActionsTypes.UPDATE_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchDriveChanged: DriveModel = action.payload.value
        const SketchIdInEdit = newState.sessionState.SketchIdInEdit;

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
                });
                sortVehicleByStartHour(relevantVehicle);
            }


        }
        return newState

    },
    [ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchDriveChanged: DriveModel = action.payload.value
        const SketchIdInEdit = newState.sessionState.SketchIdInEdit;
        newState.sessionState.pendingOrderInEditAction = null;
        newState.sessionState.pendingOrderInEditActionSelectDrives = null;
        const sketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);

        if (sketchObj !== undefined) {
            const vehicleId = getVehicleIdFromDriveId(state, sketchDriveChanged.id);
            const relevantVehicle = sketchObj.vehicleSchedules.find(v => v.id === vehicleId);
            let pendingOrdersToPassToAssigned: string [] | null = null;
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map((d: DriveModel) => {
                    if (d.id === sketchDriveChanged.id) {
                        pendingOrdersToPassToAssigned = d.implementsOrders
                        return sketchDriveChanged
                    } else {
                        return d
                    }
                })
                sortVehicleByStartHour(relevantVehicle)
            }
            if (pendingOrdersToPassToAssigned !== null) {
                const implementedOrders: string [] = pendingOrdersToPassToAssigned as string [];
                const ordersToMoveToAssigned: OrderModel [] = sketchObj.unassignedOrders.filter((o: OrderModel) => implementedOrders.includes(o.id))
                sketchObj.assignedOrders = sketchObj.assignedOrders.concat(ordersToMoveToAssigned);
                sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter((o: OrderModel) => !implementedOrders.includes(o.id))


            }


        }
        return newState

    },
    [ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchDriveToReplace: DriveModel = action.payload.value;
        const SketchIdInEdit = newState.sessionState.SketchIdInEdit;
        const pendingOrderId = newState.sessionState.pendingOrderIdInEdit;
        newState.sessionState.pendingOrderInEditAction = null;
        newState.sessionState.pendingOrderInEditActionSelectDrives = null;
        const sketchObj: SketchModel | undefined = newState.sketches.find((record: SketchModel) => record.id === SketchIdInEdit);
        const pendingOrder = sketchObj?.unassignedOrders.find(o => o.id === pendingOrderId);


        if (sketchObj && pendingOrder) {
            const newDriveId = getNewDriveIdFromSketch(sketchObj);
            const newDriveToInsert: DriveModel = {
                ...pendingOrder,
                id: newDriveId,
                implementsOrders: [pendingOrder.id],
                description: LanguageUtilities.buildBriefText(pendingOrder, newState.Locations).driverAndLocation
            }
            const vehicleId = getVehicleIdFromDriveId(state, sketchDriveToReplace.id);
            const relevantVehicle = sketchObj.vehicleSchedules.find(v => v.id === vehicleId);
            let assignedOrdersPassToPending: string [] | null = null;
            if (relevantVehicle) {
                relevantVehicle.drives = relevantVehicle.drives.map((d: DriveModel) => {
                    if (d.id === sketchDriveToReplace.id) {
                        assignedOrdersPassToPending = d.implementsOrders
                        return newDriveToInsert
                    } else {
                        return d
                    }
                })
                sortVehicleByStartHour(relevantVehicle)
            }

            sketchObj.unassignedOrders = sketchObj.unassignedOrders.filter((o: OrderModel) => o.id !== pendingOrderId);

            if (assignedOrdersPassToPending !== null) {
                const implementedOrdersFromReplacedDrive: string [] = assignedOrdersPassToPending as string [];
                const ordersToMoveToPending: OrderModel [] = sketchObj.assignedOrders.filter((o: OrderModel) => implementedOrdersFromReplacedDrive.includes(o.id))
                sketchObj.unassignedOrders = sketchObj.unassignedOrders.concat(ordersToMoveToPending);
                sketchObj.assignedOrders = sketchObj.assignedOrders.filter((o: OrderModel) => !implementedOrdersFromReplacedDrive.includes(o.id))


            }


        }
        return newState

    },

    [ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}

        const sketchDriveChangedId: string = action.payload.sketchDriveId
        const orderIdToRemove: string = action.payload.orderId
        const SketchIdInEdit = newState.sessionState.SketchIdInEdit;


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
                sortVehicleByStartHour(relevantVehicle)
            }
            let OrderToMoveToUnassinged: OrderModel | undefined = sketchObj.assignedOrders.find(o => o.id === orderIdToRemove);
            if (OrderToMoveToUnassinged) {
                sketchObj.assignedOrders = sketchObj.assignedOrders.filter(o => o.id !== orderIdToRemove);
                sketchObj.unassignedOrders = [...sketchObj.unassignedOrders];
                sketchObj.unassignedOrders.push(OrderToMoveToUnassinged);


            }


        }
        StoreUtils.updateSidurRecordWithSketchChanges(newState)
        return newState

    },
    [ActionsTypes.DELETE_SKETCH_DRIVE]: (state: SidurStore, action: IAction): SidurStore => {
        let newState = {...state}
        const sketchDriveToDelete: DriveModel = action.payload.value
        const SketchIdInEdit = newState.sessionState.SketchIdInEdit;

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
                relevantVehicle.drives = newDrives.filter(d => d) as DriveModel[];
                sortVehicleByStartHour(relevantVehicle)
            }


        }
        StoreUtils.updateSidurRecordWithSketchChanges(newState)
        return newState

    },


}


const getVehicleIdFromDriveId = (state: SidurStore, driveId: string): string => {
    const SketchIdInEdit = state.sessionState.SketchIdInEdit
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
const getNewDriveIdFromSketch = (sketch: SketchModel): string => {
    const allDriveIds: string [] = ['1'];
    sketch.vehicleSchedules.forEach(v => {
        v.drives.forEach(d => {
            allDriveIds.push(d.id)
        })
    })
    return Utils.getNextId(allDriveIds)

}
const sortVehicleByStartHour = (vehicle: VehicleScheduleModel): VehicleScheduleModel => {

    vehicle.drives.sort((aDrive, bDrive) => {
        const a = Utils.hourTextToDecimal(aDrive.startHour);
        const b = Utils.hourTextToDecimal(bDrive.startHour);

        return a < b ? -1 : b < a ? 1 : 0

    })
    return vehicle

}

