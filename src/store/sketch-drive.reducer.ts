import { IAction, SidurStore } from "./store.types";
import {
    SketchDriveUpdateReducer,
    SketchDriveUpdateReducerFunctions,
} from "./sketch-drive-update.reducer";
import {
    SketchDriveOrderReducer,
    SketchDriveOrderReducerFunctions,
} from "./sketch-drive-order.reducer";

export type SketchDriveReducerFunctions =
    | SketchDriveUpdateReducerFunctions
    | SketchDriveOrderReducerFunctions;

export const SketchDriveReducer: Record<
    SketchDriveReducerFunctions,
    (state: SidurStore, action: IAction) => SidurStore
> = {
    ...SketchDriveUpdateReducer,
    ...SketchDriveOrderReducer,
};
