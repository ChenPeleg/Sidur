import {ActionTypes} from './actionTypes';
import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';

export type ActionType = string;

export type IAction = {
    type: ActionTypes
    payLoad: any
}

export interface SidurRecord {
    id: string,
    Name: string,
    orders: OrderModel[];
    deletedOrders: OrderModel[];
    defaultOrderValues?: OrderModel,
}

export interface SidurStore {
    sidurCollection: SidurRecord[];
    sidurArchive: SidurRecord[];
    sidurId: string;
    orders: OrderModel[];
    deletedOrders: OrderModel[];
    orderIdInEdit: null | string;
    dataHolderForCurrentOrderInEdit: OrderModel | null;
    defaultOrderValues: OrderModel,
}

export const defaultOrderValues: OrderModel = {
    id: '1',
    driverName: '',
    startHour: '08:00',
    finishHour: '09:00',
    TypeOfDrive: DriveType.OneWayTo,
    Comments: ''
}
