import {DriveModel, VehicleScheduleModel} from '../models/Sketch.model';
import {VehicleModel} from '../models/Vehicle.model';
import {OrderMetaDataModel, OrderMetaStatus} from './models/sidurBuilder.models';

interface OrdMetaScheduleData {
    start: number,
    finish: number,
    id: string,
    passengers: string

}

export const SidurBuilderBuildVehicles = (orders: OrderMetaDataModel[], vehicles: VehicleModel[], buildSettings: any = null): VehicleScheduleModel[] => {
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
            id: vehicleScheduleId.toString(),
            VehicleId: vehicle.id,
            drives: [],
            Comments: vehicle.Comments
        }
        return vehicleSchedule
    })
    let idDriveModel = 0;
    vehicleSchedules.forEach((schedule: VehicleScheduleModel) => {
        let currentHour: number = 0.1;
        metaOrderScheduleData.forEach(metaOrder => {
            if (metaOrder.start > currentHour) {
                const releventMetaDrive: OrderMetaDataModel | undefined = orders.find(meta => meta.id === metaOrder.id)
                if (!releventMetaDrive || releventMetaDrive.status === OrderMetaStatus.Approved) {
                    return
                }
                const newDrive: DriveModel = {
                    ...releventMetaDrive
                        .order,
                    implementsOrders: [releventMetaDrive
                        .order.id],
                    description: '',
                    id: idDriveModel.toString()
                }
                schedule.drives.push(newDrive);
                releventMetaDrive.status = OrderMetaStatus.Approved;
                currentHour = metaOrder.finish;


            }
        })
    })

    return vehicleSchedules
}
