import {DriveType} from './DriveType.enum';
import {OrderModel} from './Order.model';

export interface DriveModel extends OrderModel {
    id: string,
    driverName: string,
    startHour: string,
    finishHour: string,
    TypeOfDrive: DriveType | null,
    location: string,
    Comments: string,
    passengers: string,
    flexibility: [string, string],
    /**
     * @summary more properties that were not in the original drive
     */
    implementsOrders: string [],
    description: string,
    
}

export interface VehicleScheduleModel {
    id: string
    VehicleId: string,
    drives: DriveModel[],
    Comments: string
}

export interface SketchModel {
    id: string,
    name: string,
    vehicleSchedules: VehicleScheduleModel[],
    unassignedOrders: OrderModel[],
    assignedOrders: OrderModel[],
    Comments: string,
    suggestions?: any,
}
