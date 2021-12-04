import {OrderModel} from '../models/Order.model';
import {OrderMetaDataModel} from './models/sidurBuilder.models';
import {SidurBuilderTools} from './sidurBuilder.tools';
import {DriveType} from '../models/DriveType.enum';
import {CloneUtil} from '../services/utilities';
import {locations} from '../services/locations';

export const SidurBuilderBuildOrdersMetaData = (orders: OrderModel[], buildSettings: any = null): OrderMetaDataModel[] => {
    const clonedOrders: OrderModel[] = orders.map((o: OrderModel) => CloneUtil.deep(o, 'OrderModel'));

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
        const driveType = metaOrder.order.TypeOfDrive
        if (driveType === DriveType.Tsamud) {
            return
        }
        const locationId = metaOrder.order.location;
        let locationObj = locations.find(l => l.id === locationId);
        if (!locationObj) {
            locationObj = locations.find(l => l.Name === 'Other') ||
                {
                    EnName: 'Other',
                    id: '999',
                    Name: 'אחר',
                    ETA: 45,
                }

        }
        const EtaInHours = SidurBuilderTools.minutesToFraction(locationObj.ETA);
        switch (driveType) {
            case DriveType.OneWayTo:
                metaOrder.finish = metaOrder.start + EtaInHours * 2;
                break;
            case DriveType.OneWayFrom:
                metaOrder.finish = metaOrder.start + EtaInHours;
                metaOrder.start = metaOrder.start - EtaInHours;
                break;
        }
        ;
        metaOrder.length = metaOrder.finish - metaOrder.start;


    })

    return ordersMeta
}


