import {SidurRecord} from '../store/store.types';
import {SketchModel, VehicleScheduleModel} from '../models/Sketch.model';
import {Utilities} from '../services/utilities';
import {OrderMetaDataModel, SidurBuildSettings} from './models/sidurBuilder.models';
import {SidurBuilderBuildOrdersMetaData} from './sidurBuilder.buildOrdersMetaData';
import {SidurBuilderBuildVehicles} from './sidurBuilder.buildVehicles';

export const SidurBuilder = (Sidur: SidurRecord, buildSettings: any = null): SketchModel => {
    const settings: SidurBuildSettings = {custom: null}
    const ordersMetaData: OrderMetaDataModel[] = SidurBuilderBuildOrdersMetaData(Sidur.orders, settings)
    const initialVehicles: VehicleScheduleModel [] = SidurBuilderBuildVehicles(ordersMetaData, Sidur.vehicles, settings);

    const defaultSketch: SketchModel
        = Utilities.defaultSketchMMock();
    return defaultSketch
}
