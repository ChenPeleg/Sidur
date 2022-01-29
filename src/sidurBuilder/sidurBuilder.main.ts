import {SidurRecord} from '../store/store.types';
import {SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {OrderMetaDataModel, SidurBuildSettings} from './models/sidurBuilder.models';
import {SidurBuilderBuildOrdersMetaData} from './sidurBuilder.buildOrdersMetaData';
import {SidurBuilderBuildVehiclesAndUnAssigned} from './sidurBuilder.buildVehicles';
import {SidurBuilderTools} from './sidurBuilder.tools';
import {Utils} from '../services/utils';
import {OrderModel} from '../models/Order.model';
import {LocationModel} from '../models/Location.model';

export const SidurBuilder = (Sidur: SidurRecord, locations: LocationModel[], _buildSettings: any = null): SketchModel => {

    const settings: SidurBuildSettings = {custom: null}
    const ordersMetaData: OrderMetaDataModel[] = SidurBuilderBuildOrdersMetaData(Sidur.orders, locations, settings)
    const BuildResult = SidurBuilderBuildVehiclesAndUnAssigned(ordersMetaData, Sidur.vehicles, locations, settings);
    const initialVehicles: VehicleScheduleModel [] = BuildResult.vehicleSchedules;
    const unassignedOrders: OrderModel [] = BuildResult.unassignedOrders;
    const assignedOrders: OrderModel [] = BuildResult.assignedOrders;


    const baseSketch: SketchModel = {
        id: '2',
        name: 'first sketch',
        vehicleSchedules: initialVehicles,
        Comments: '',
        unassignedOrders: unassignedOrders,
        assignedOrders: assignedOrders
    };

    baseSketch.id = Utils.getNextId(Sidur.sketches.map(v => v.id));
    baseSketch.name = SidurBuilderTools.createSketchName(baseSketch.id);

    return baseSketch
}
