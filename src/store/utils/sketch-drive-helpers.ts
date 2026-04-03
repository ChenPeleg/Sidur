import { DriveModel, SketchModel, VehicleScheduleModel } from "../../models/Sketch.model";
import { SidurStore } from "../store.types";
import { Utils } from "../../services/utils";

export const getVehicleIdFromDriveId = (
    state: SidurStore,
    driveId: string
): string => {
    const sketchIdInEdit = state.sessionState.sketchIdInEdit;
    const sketchObj: SketchModel | undefined = state.sketches.find(
        (record: SketchModel) => record.id === sketchIdInEdit
    );
    const vehicleSchedules = sketchObj?.vehicleSchedules || [];
    let vehicleId = "";
    vehicleSchedules.forEach((v: VehicleScheduleModel) => {
        v.drives.forEach((d: DriveModel) => {
            if (d.id === driveId) {
                vehicleId = v.id;
            }
        });
    });
    return vehicleId;
};

export const getNewDriveIdFromSketch = (sketch: SketchModel): string => {
    const allDriveIds: string[] = ["1"];
    sketch.vehicleSchedules.forEach((v) => {
        v.drives.forEach((d) => {
            allDriveIds.push(d.id);
        });
    });
    return Utils.getNextId(allDriveIds);
};

export const sortVehicleByStartHour = (
    vehicle: VehicleScheduleModel
): VehicleScheduleModel => {
    vehicle.drives.sort((aDrive, bDrive) => {
        const a = Utils.hourTextToDecimal(aDrive.startHour);
        const b = Utils.hourTextToDecimal(bDrive.startHour);

        return a < b ? -1 : b < a ? 1 : 0;
    });
    return vehicle;
};
