import { SketchModel } from "../../models/Sketch.model";
import { SidurStore } from "../store.types";

/**
 * Finds the current sketch being edited from the state.
 */
export const getSketchInEdit = (
    state: SidurStore
): SketchModel | undefined => {
    const sketchIdInEdit = state.sessionState.sketchIdInEdit;
    return state.sketches.find(
        (record: SketchModel) => record.id === sketchIdInEdit
    );
};

/**
 * Returns a new state with the updated sketch replacing the old one in the sketches array.
 */
export const updateSketchInState = (
    state: SidurStore,
    updatedSketch: SketchModel
): SidurStore => {
    const sketchIdInEdit = state.sessionState.sketchIdInEdit;
    return {
        ...state,
        sketches: state.sketches.map((sketch: SketchModel) => {
            if (sketch.id === sketchIdInEdit) {
                return { ...updatedSketch };
            }
            return sketch;
        }),
    };
};
