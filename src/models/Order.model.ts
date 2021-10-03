import {DriveType} from './DriveType.enum';

export interface OrderModel {
    driverName: string,
    startHour: string,
    finishHour: string,
    TypeOfDrive: DriveType | null,
}

export class OrderFields implements OrderModel {
    driverName: string = 'driverName';
    startHour: string = 'startHour';
    finishHour: string = 'finishHour';
    TypeOfDrive: DriveType | null = null;

    constructor() {

    }
}
