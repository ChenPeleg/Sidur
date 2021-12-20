import {OrderModel} from '../models/Order.model';
import {OrderMetaDataModel, OrderMetaStatus} from './models/sidurBuilder.models';
import {DriveType} from '../models/DriveType.enum';
import {locations} from '../services/locations';
import {CloneUtil} from '../services/clone-utility';
import {Utils} from '../services/utils';

export const SidurBuilderBuildOrdersMetaData = (orders: OrderModel[], buildSettings: any = null): OrderMetaDataModel[] => {
    let idCount: number = 1;
    const clonedOrders: OrderModel[] = orders.map((o: OrderModel) => CloneUtil.deep(o, 'OrderModel'));

    const ordersMeta: OrderMetaDataModel[] = clonedOrders.map((order: OrderModel) => {
        const start: number = Utils.hourTextToDecimal(order.startHour);
        const finish: number = Utils.hourTextToDecimal(order.finishHour);
        const length = finish - start;
        const metaOrder: OrderMetaDataModel = {
            id: idCount.toString(),
            order: {...order},
            finish: finish,
            start: start,
            length: length,
            status: OrderMetaStatus.None
        }
        idCount++;

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
        const EtaInHours = Utils.minutesToFraction(locationObj.ETA);
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


