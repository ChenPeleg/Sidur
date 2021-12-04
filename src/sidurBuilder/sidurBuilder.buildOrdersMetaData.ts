import {OrderModel} from '../models/Order.model';
import {OrderMetaDataModel} from './models/sidurBuilder.models';
import {SidurBuilderTools} from './sidurBuilder.tools';
import {LocationModel} from '../models/Location.model';
import {DriveType} from '../models/DriveType.enum';
import {CloneUltil, Utilities} from '../services/utilities';

export const SidurBuilderBuildOrdersMetaData = (orders: OrderModel[], buildSettings: any = null): OrderMetaDataModel[] => {
    const clonedOrders: OrderModel[] = orders.map((o: OrderModel) => Utilities.deepCloneByType([o, 'OrderModel'])) as OrderModel[];
    const forstOrder: OrderModel = CloneUltil.deep('OrderModel', orders[0])
    const ordersMeta: OrderMetaDataModel[] = clonedOrders.map((order: OrderModel) => {
        const start: number = SidurBuilderTools.hourTextToDecimal(order.startHour);
        const finish: number = SidurBuilderTools.hourTextToDecimal(order.finishHour);
        const length = finish - start;
        const metaOrder: OrderMetaDataModel = {
            order: {...order},
            finish: finish,
            start: start,
            length: length
        }

        return metaOrder
    })

    // Estimate finish hour of non-Tsamud Drives
    ordersMeta.forEach((metaOrder: OrderMetaDataModel) => {
        if (metaOrder.order.TypeOfDrive === DriveType.Tsamud) {
            return
        }

    })
    let o = ordersMeta;
    return ordersMeta
}

const EstimateLengthTimeBasedOnLocation = (location: LocationModel): number => {
    return 0.75
}
