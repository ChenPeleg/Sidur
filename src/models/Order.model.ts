import {DriveType} from './DriveType.enum';

export interface OrderModel {
    id: string,
    driverName: string,
    startHour: string,
    finishHour: string,
    TypeOfDrive: DriveType | null,
    location: string,
    Comments: string,
    passengers: string,
    flexibility: [string, string]
}

export class OrderFields implements OrderModel {
    id: string = 'id';
    driverName: string = 'driverName';
    startHour: string = 'startHour';
    finishHour: string = 'finishHour';
    TypeOfDrive: DriveType | null = null;
    Comments: string = 'Comments';
    location: string = 'location';
    passengers: string = 'passengers';
    flexibility: [string, string] = ['flexibility', 'flexibility']

    constructor() {

    }
}
