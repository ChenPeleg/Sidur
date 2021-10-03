import {DriveType} from './DriveType.enum';

export interface OrderModel {
    driverName: string,
    startHour: string,
    finishHour: string,
    TypeOfDrive: DriveType | null,
    Comments: string
}

export class OrderFields implements OrderModel {
    driverName: string = 'driverName';
    startHour: string = 'startHour';
    finishHour: string = 'finishHour';
    TypeOfDrive: DriveType | null = null;
    Comments: string = 'Comments'

    constructor() {

    }
}
