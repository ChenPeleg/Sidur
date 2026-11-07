import { DriveType } from "../../../src/models/DriveType.enum";
import { OrderModel } from "../../../src/models/Order.model";
import {
    DriveModel,
    SketchModel,
    VehicleScheduleModel,
} from "../../../src/models/Sketch.model";
import { IAction, SidurStore } from "../../../src/store/store.types";
import { ActionsTypes } from "../../../src/store/types.actions";
import { buildStore } from "./build-store";

export const act = (type: ActionsTypes, payload: IAction["payload"] = {}) =>
    ({ type, payload }) as IAction;

export const SKETCH_ID = "1";

const order = (
    id: string,
    startHour: string,
    finishHour: string,
    extra: Partial<OrderModel> = {}
): OrderModel => ({
    id,
    driverName: "driver " + id,
    startHour,
    finishHour,
    TypeOfDrive: DriveType.OneWayTo,
    location: "1",
    Comments: "",
    passengers: "1",
    flexibility: ["-30", "10"],
    ...extra,
});

const drive = (
    id: string,
    implementedOrder: OrderModel,
    extra: Partial<DriveModel> = {}
): DriveModel => ({
    ...implementedOrder,
    id,
    implementsOrders: [implementedOrder.id],
    description: "drive " + id,
    ...extra,
});

/**
 * Order ids used by the fixture sketch.
 * - assigned: 201 (drive "1", v1 10:00), 202 (drive "2", v1 14:00),
 *   203 (drive "3", v2 08:00)
 * - pending: 301 (14:00-15:00, overlaps drive "2" only),
 *   302 (Tsamud 08:00-13:00), 303 (22:00-23:00, overlaps no drive)
 */
export const FIXTURE = {
    vehicle1: "v1",
    vehicle2: "v2",
    drive10: "1",
    drive14: "2",
    drive08: "3",
    pendingOverlapping: "301",
    pendingTsamud: "302",
    pendingLonely: "303",
} as const;

export const buildFixtureSketch = (): SketchModel => {
    const o201 = order("201", "10:00", "11:00");
    const o202 = order("202", "14:00", "15:00");
    const o203 = order("203", "08:00", "09:00");
    const v1: VehicleScheduleModel = {
        id: FIXTURE.vehicle1,
        VehicleId: "1",
        Comments: "",
        drives: [drive("1", o201), drive("2", o202)],
    };
    const v2: VehicleScheduleModel = {
        id: FIXTURE.vehicle2,
        VehicleId: "3",
        Comments: "",
        drives: [drive("3", o203)],
    };
    return {
        id: SKETCH_ID,
        name: "fixture sketch",
        Comments: "",
        vehicleSchedules: [v1, v2],
        assignedOrders: [o201, o202, o203],
        unassignedOrders: [
            order("301", "14:00", "15:00"),
            order("302", "08:00", "13:00", {
                TypeOfDrive: DriveType.Tsamud,
                location: "6",
            }),
            order("303", "22:00", "23:00"),
        ],
    };
};

export interface BuildSketchOptions {
    pendingOrderIdInEdit?: string | null;
}

/** A store whose current sidur has the fixture sketch in edit. */
export const buildStoreWithSketch = (
    opts: BuildSketchOptions = {}
): SidurStore => {
    const state = buildStore();
    state.sketches = [buildFixtureSketch()];
    state.sidurCollection.find((s) => s.id === state.sidurId)!.sketches = [
        buildFixtureSketch(),
    ];
    state.sessionState = {
        ...state.sessionState,
        sketchIdInEdit: SKETCH_ID,
        pendingOrderIdInEdit: opts.pendingOrderIdInEdit ?? null,
        pendingOrderInEditAction: null,
        pendingOrderInEditActionSelectDrives: null,
    };
    return state;
};

export const sketchOf = (s: SidurStore): SketchModel =>
    s.sketches.find((k) => k.id === s.sessionState.sketchIdInEdit)!;

export const recordSketchOf = (s: SidurStore): SketchModel | undefined =>
    s.sidurCollection
        .find((r) => r.id === s.sidurId)!
        .sketches.find((k) => k.id === s.sessionState.sketchIdInEdit);

export const vehicleOf = (s: SidurStore, driveId: string) =>
    sketchOf(s).vehicleSchedules.find((v) =>
        v.drives.some((d) => d.id === driveId)
    )!;

export const vehicleById = (s: SidurStore, vehicleId: string) =>
    sketchOf(s).vehicleSchedules.find((v) => v.id === vehicleId)!;

export const driveOf = (s: SidurStore, driveId: string): DriveModel =>
    sketchOf(s)
        .vehicleSchedules.flatMap((v) => v.drives)
        .find((d) => d.id === driveId)!;

export const ids = (list: { id: string }[]) => list.map((x) => x.id);
