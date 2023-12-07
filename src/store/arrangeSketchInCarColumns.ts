import { SketchModel, VehicleScheduleModel } from "../models/Sketch.model";
import { SidurRecord } from "./store.types";
import { VehicleModel } from "../models/Vehicle.model";

type VehicleSketchColumn = {
    vehicleSchedule: VehicleScheduleModel;
    numberOfColumns: number;
    vehicleName: string;
    position: number;
};

const NUMBER_OF_ROWS_FOR_HEADER = 2;
const NUMBER_OF_COLUMNS_FOR_VEHICLE = 3;
const SEPERATOR = ",";

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
    vehicles: VehicleModel[],
    numberOfColumns: number
): VehicleSketchColumn => {
    console.log(vehicles, vehicleSchedule);
    return {
        vehicleSchedule,
        vehicleName:
            vehicles.find((v) => v.id === vehicleSchedule.VehicleId)
                ?.vehicleName || "",
        numberOfColumns: numberOfColumns,
        position: 0,
    };
};

const buildCSVRow = (
    vColumn: VehicleSketchColumn[],
    rowNumber: number
): string => {
    const buildViehiclePartOfRow = (
        vColumn: VehicleSketchColumn,
        rowNumber: number
    ): string => {
        if (rowNumber === 0) {
            return (
                vColumn.vehicleName +
                SEPERATOR.repeat(NUMBER_OF_COLUMNS_FOR_VEHICLE)
            );
        } else if (rowNumber === 1) {
            return SEPERATOR + SEPERATOR + SEPERATOR;
        } else {
            const drive =
                vColumn.vehicleSchedule.drives[
                    rowNumber - NUMBER_OF_ROWS_FOR_HEADER
                ];

            if (!drive) {
                return SEPERATOR.repeat(NUMBER_OF_COLUMNS_FOR_VEHICLE);
            }
            return (
                drive.startHour +
                " - " +
                drive.finishHour +
                SEPERATOR +
                SEPERATOR +
                drive.description +
                SEPERATOR
            );
        }
        return SEPERATOR.repeat(NUMBER_OF_COLUMNS_FOR_VEHICLE);
    };
    return vColumn
        .map((vc) => buildViehiclePartOfRow(vc, rowNumber))
        .join(SEPERATOR);
};
export const arrangeSketchInCarColumns = (
    sketchObj: SketchModel,
    vehicles: VehicleModel[],
    preferences: any
): string => {
    const numberOfRows = calculateNumberOfRows(sketchObj);
    const vehicleSketchColumns = sketchObj.vehicleSchedules.map((v) =>
        vehicleSketchModelToVehicleSketchColumn(
            v,
            vehicles,
            NUMBER_OF_COLUMNS_FOR_VEHICLE
        )
    );
    const csvRows = [...new Array(numberOfRows)].map((r, i) =>
        buildCSVRow(vehicleSketchColumns, i)
    );

    return csvRows.join("\n");
};
