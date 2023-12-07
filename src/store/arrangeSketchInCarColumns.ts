import { SketchModel, VehicleScheduleModel } from "../models/Sketch.model";

type VehicleSketchColumn = {
    vehicleSchedule: VehicleScheduleModel;
    numberOfColumns: number;
    position: number;
};

const NUMBER_OF_ROWS_FOR_HEADER = 2;
const NUMBER_OF_COLUMNS_FOR_VEHICLE = 3;

const calculateNumberOfRows = (sketchObj: SketchModel): number => {
    const drivesPerVehicle = sketchObj.vehicleSchedules.map(
        (v) => v.drives.length
    );
    return (
        drivesPerVehicle.reduce((a, b) => Math.max(a, b), 0) +
        NUMBER_OF_ROWS_FOR_HEADER
    );
};

const vehicleSketchModelToVehicleSketchColumn = (
    vehicleSchedule: VehicleScheduleModel,
    numberOfColumns: number
) => {
    return {
        vehicleSchedule,
        numberOfColumns: numberOfColumns,
        position: 0,
    };
};

export const arrangeSketchInCarColumns = (
    sketchObj: SketchModel,
    preferences: any
): string => {
    const numberOfRows = calculateNumberOfRows(sketchObj);
    const vehicleSketchColumns = sketchObj.vehicleSchedules.map((v) =>
        vehicleSketchModelToVehicleSketchColumn(
            v,
            NUMBER_OF_COLUMNS_FOR_VEHICLE
        )
    );
    console.log("numberOfRows", numberOfRows);
    return ",,,,,,,,,,,,,";
};
