import {ActionsTypes} from './types.actions'
import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {VehicleModel} from '../models/Vehicle.model';
import {SketchModel} from '../models/Sketch.model';
import {LocationGroup} from '../models/Location.model';

export type ActionType = string;

export type IAction = {
    type: ActionsTypes
    payload: any | { value: any }
}

export interface SidurRecord {
    id: string,
    Name: string,
    orders: OrderModel[];
    vehicles: VehicleModel[];
    deletedOrders: OrderModel[];
    defaultOrderValues?: OrderModel,
    sketches: SketchModel[],
    chosenSketch: string,
    locationGroup: LocationGroup | null
}

export interface DisplaySettings {
    view: 'orders' | 'sketch' | 'locationsView'
}

export interface SessionModel {
    locationGroupInEdit: null | string;
    orderIdInEdit: null | string;
    pendingOrderIdInEdit: null | string;
    SketchIdInEdit: null | string;
    LocationGroupTabOpen: null | string;
    dataHolderForCurrentOrderInEdit: null | OrderModel
}

export interface SidurStore {
    sidurCollection: SidurRecord[];
    sidurArchive: SidurRecord[];
    orders: OrderModel[];
    vehicles: VehicleModel[];
    deletedOrders: OrderModel[];
    defaultOrderValues: OrderModel,
    displaySetting: DisplaySettings,
    sketches: SketchModel[];
    sidurId: string;
    LocationGroups: null | LocationGroup[];
    currentSessionState: SessionModel;
    // Move to Session state
    dataHolderForCurrentOrderInEdit: OrderModel | null;
    locationGroupInEdit: null | string;
    orderIdInEdit: null | string;
    pendingOrderIdInEdit: null | string;
    SketchIdInEdit: null | string;

}

export const defaultOrderValues: OrderModel = {
    id: '1',
    driverName: '',
    startHour: '08:00',
    finishHour: '09:00',
    TypeOfDrive: DriveType.OneWayTo,
    Comments: '',
    passengers: '1',
    flexibility: ['-30', '10'],
    location: ''
}
export const defaultVehicleValues: VehicleModel = {
    id: '1',
    vehicleName: 'רכב',
    startHour: '08:00',
    endHour: '09:00',
    kmLimit: '',
    seats: '5',
    Comments: ''
}
export const AppConstants = {
    deleteIdPrefix: 'Del',
    ArchiveIdPrefix: 'Arch',

}

export enum FileUploadType {
    uploadFullDataAndReplace = 1,
    uploadFullDataAndAdd = 2,
    uploadSpecificData = 3
}

export interface SaveDataModel {
    userId: string,
    userName: string,
    timeStamp: string,
    savedStore: SidurStore,
    hash: string
}
