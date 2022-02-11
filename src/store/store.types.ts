import {ActionsTypes} from './types.actions'
import {OrderModel} from '../models/Order.model';
import {DriveType} from '../models/DriveType.enum';
import {VehicleModel} from '../models/Vehicle.model';
import {SketchModel} from '../models/Sketch.model';
import {LocationGroup, LocationModel} from '../models/Location.model';
import {SketchOrderEditActionEnum} from '../models/SketchOrderEditActionEnum';

export type ActionType = string;

export type IAction = {
    type: ActionsTypes
    payload: any | { value: any }
}

export interface SidurRecord {
    id: string,
    dbId: string,
    Name: string,
    orders: OrderModel[];
    vehicles: VehicleModel[];
    deletedOrders: OrderModel[];
    defaultOrderValues?: OrderModel,
    sketches: SketchModel[],
    chosenSketch: string,
    locationGroupIdForSidur: string;
}

export interface DisplaySettings {
    view: 'orders' | 'sketch' | 'locationsView'
}

export interface SessionModel {
    locationGroupInEdit: null | string;
    orderIdInEdit: null | string;
    routeIdInEdit: null | string;
    transportIdInEdit: null | string;
    pendingOrderIdInEdit: null | string;
    pendingOrderInEditAction: null | SketchOrderEditActionEnum;
    pendingOrderInEditActionSelectDrives: null | string[];
    SketchIdInEdit: null | string;
    LocationGroupTabOpen: null | string;
    dataHolderForCurrentOrderInEdit: null | OrderModel,
    isAnimationRunning: boolean,
    locationMainInEdit: null | string
}

export enum TypeOfRecord {
    Sidur = 1,
    LocationGroup = 2
}

export interface RecordBriefModel {
    id: string,
    dbId: string,
    name: string,
    typeOfRecord: TypeOfRecord,
    locationGroupOrSidurId: string
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
    Locations: LocationModel[];
    LocationGroups: LocationGroup[];
    sessionState: SessionModel;
    recordBriefs: RecordBriefModel[]


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
