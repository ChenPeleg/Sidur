import {OrderModel} from '../../models/Order.model';

export interface SuggestionModel {
    driveId: string | string [];
}

export interface SidurBuildSettings {
    custom: any
}

export interface OrderMetaDataModel {
    order: OrderModel,
    start: number
    finish: number,
    length: number
}

export const BuilderConstants: Object = {
    drivesToResolve: 'DtoRes'
}
