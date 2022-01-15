import {DriveModel, SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {OrderModel} from '../models/Order.model';
import {SidurRecord} from '../store/store.types';
import {LocationGroup} from '../models/Location.model';


export class CloneUtil {
    constructor() {
    }

    static deepCloneOrder(obj: OrderModel): OrderModel {
        const cloned: OrderModel = {...obj}
        cloned.flexibility = [...cloned.flexibility]
        return cloned
    }

    static deepCloneDrive(obj: DriveModel): DriveModel {
        const cloned: DriveModel = {...obj}
        cloned.flexibility = [...cloned.flexibility]
        return cloned
    }

    static deepCloneVehicleSchedules(obj: VehicleScheduleModel): VehicleScheduleModel {
        const cloned: VehicleScheduleModel = {...obj}
        cloned.drives = cloned.drives.map(d => CloneUtil.deepCloneDrive(d))
        return cloned
    }

    static deepCloneSidur(sidur: SidurRecord): SidurRecord {
        const clonedSidur = {...sidur}
        clonedSidur.orders = clonedSidur.orders.map(o => (CloneUtil.deepCloneOrder(o)));
        clonedSidur.deletedOrders = clonedSidur.deletedOrders.map(o => (CloneUtil.deepCloneOrder(o)));
        clonedSidur.sketches = clonedSidur.sketches.map(o => (CloneUtil.deepCloneSketch(o)));
        clonedSidur.defaultOrderValues = clonedSidur.defaultOrderValues ? {...clonedSidur.defaultOrderValues} : undefined
        return clonedSidur
    }

    static deepCloneSketch(obj: SketchModel): SketchModel {
        obj.vehicleSchedules = obj.vehicleSchedules.map(vs => CloneUtil.deepCloneVehicleSchedules(vs))
        return {...obj}
    }

    static deepCloneLocationGroup(obj: LocationGroup): LocationGroup {
        obj.Locations = obj.Locations.map(l => ({...l}))
        return {...obj}
    }

    public static deep(obj: SidurRecord, name: 'SidurRecord'): OrderModel ;
    public static deep(obj: OrderModel, name: 'OrderModel'): OrderModel ;
    public static deep(obj: SketchModel, name: 'SketchModel'): SketchModel ;
    public static deep(obj: any, name: string,): any {
        const newObj = {...obj}
        switch (name) {
            case 'SketchModel':
                return CloneUtil.deepCloneSketch(obj)
            case 'SidurRecord':
                return CloneUtil.deepCloneSidur(obj)
            case 'OrderModel':
                newObj.flexibility = [(newObj).flexibility[0], (newObj).flexibility[1]];
        }
        return newObj;
    }
}

