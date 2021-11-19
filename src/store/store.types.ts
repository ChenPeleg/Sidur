import {ActionsTypes} from './types.actions'
import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {VehicleModel} from '../models/Vehicle.model';

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
}

export interface DisplaySettings {
    view: 'orders' | 'sketch' | 'both'
}

export interface SidurStore {
    sidurCollection: SidurRecord[];
    sidurArchive: SidurRecord[];
    sidurId: string;
    orders: OrderModel[];
    vehicles: VehicleModel[];
    deletedOrders: OrderModel[];
    orderIdInEdit: null | string;
    dataHolderForCurrentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel,
    displaySetting: DisplaySettings
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
    id: '0',
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
