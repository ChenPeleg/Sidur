import {DriveModel, VehicleScheduleModel} from '../models/Sketch.model';
import {VehicleModel} from '../models/Vehicle.model';
import {OrderMetaDataModel, OrderMetaStatus} from './models/sidurBuilder.models';
import {OrderModel} from '../models/Order.model';
import {Utils} from '../services/utils';
import {LanguageUtilities} from '../services/language-utilities';
import {locations} from '../services/locations';
import {SidurBuilderTools} from './sidurBuilder.tools';

interface OrdMetaScheduleData {
    start: number,
    finish: number,
    id: string,
    passengers: string

}

export const SidurBuilderBuildVehiclesAndUnAssigned = (orders: OrderMetaDataModel[], vehicles: VehicleModel[], buildSettings: any = null): {
    vehicleSchedules: VehicleScheduleModel[],
    unassignedOrders: OrderModel[],
    assignedOrders: OrderModel[],

} => {
    const enumerator = SidurBuilderTools.EnumeratorConstructor();
    const metaOrderScheduleData: OrdMetaScheduleData[] = orders.map((o: OrderMetaDataModel) => {
        return {
            start: o.start,
            finish: o.finish,
            id: o.id,
            passengers: o.order.passengers
        }
    });
    metaOrderScheduleData.sort((a, b) => (a.start > b.start) ? 1 : -1);

    let vehicleScheduleId = 0;
    const vehicleSchedules: VehicleScheduleModel [] = vehicles.map((vehicle: VehicleModel) => {
        vehicleScheduleId++
        const vehicleSchedule: VehicleScheduleModel = {
            id: enumerator.getStrId(),
            VehicleId: vehicle.id,
            drives: [],
            Comments: vehicle.Comments
        }
        return vehicleSchedule
    })
    vehicleSchedules.forEach((schedule: VehicleScheduleModel) => {
        let currentHour: number = 0.1;
        metaOrderScheduleData.forEach(metaOrder => {
            if (metaOrder.start > currentHour) {
                const relevantMetaDrive: OrderMetaDataModel | undefined = orders.find(meta => meta.id === metaOrder.id)
                if (!relevantMetaDrive || relevantMetaDrive.status === OrderMetaStatus.Approved) {
                    return
                }
                currentHour = metaOrder.finish;

                const newDrive: DriveModel = {
                    ...relevantMetaDrive
                        .order,
                    startHour: Utils.DecimalTimeToHourText(metaOrder.start),
                    finishHour: Utils.DecimalTimeToHourText(metaOrder.finish),

                    implementsOrders: [relevantMetaDrive
                        .order.id],
                    description: '',
                    id: enumerator.getStrId(),
                }
                const fakeOrder: OrderModel = {
                    ...relevantMetaDrive
                        .order,
                    startHour: Utils.DecimalTimeToHourText(metaOrder.start),

                    finishHour: Utils.DecimalTimeToHourText(metaOrder.finish),


                }
                newDrive.description = LanguageUtilities.buildBriefText(fakeOrder, locations).driverAndLocation;


                schedule.drives.push(newDrive);
                relevantMetaDrive.status = OrderMetaStatus.Approved;


            }
        })
    })
    const unassignedOrders: OrderModel[] = orders.filter(o => o.status === OrderMetaStatus.None).map(o => o.order);

    const assignedOrders: OrderModel[] = orders.filter(o => o.status !== OrderMetaStatus.None).map(o => o.order);
    return {
        vehicleSchedules,
        unassignedOrders,
        assignedOrders
    }
}
