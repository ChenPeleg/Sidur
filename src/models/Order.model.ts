import {DriveType} from './DriveType.enum';

export interface OrderModel {
    driverName: string,
    startHour: string,
    finishHour: string,
    TypeOfDrive: DriveType,
}
