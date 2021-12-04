import {OrderModel} from '../../models/Order.model';

export interface SuggestionModel {
    driveId: string | string [];
}

export interface SidurBuildSettings {
    custom: any
}

export enum OrderMetaStatus {
    None = 0,
    Approved = 1,
    Pending = 2,
}

export interface OrderMetaDataModel {
    id: string
    order: OrderModel,
    start: number
    finish: number,
    length: number,
    status: OrderMetaStatus
}

export const BuilderConstants: Object = {
    drivesToResolve: 'DtoRes'
}
