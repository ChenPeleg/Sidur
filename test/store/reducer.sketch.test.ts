import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { SidurStore } from "../../src/store/store.types";
import * as downloads from "../../src/services/downloadFile";
import { act } from "./helpers/build-sketch";

const withSketch = (): SidurStore =>
    reducer(buildStore(), act(ActionsTypes.NEW_SKETCH));

describe("root reducer - sketches", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("NEW_SKETCH builds a sketch with the next id and selects it", () => {
        const state = buildStore();
        const result = reducer(state, act(ActionsTypes.NEW_SKETCH));
        expect(result.sketches).toHaveLength(1);
        expect(result.sketches[0].id).toBe("1");
        expect(result.sessionState.sketchIdInEdit).toBe("1");
        expect(result.sidurCollection[0].sketches).toHaveLength(1);
        const second = reducer(result, act(ActionsTypes.NEW_SKETCH));
        expect(second.sketches.map((s) => s.id)).toEqual(["1", "2"]);
    });

    it("NEW_SKETCH does nothing when the current sidur record is missing", () => {
        const state = buildStore({ sidurId: "missing" });
        const result = reducer(state, act(ActionsTypes.NEW_SKETCH));
        expect(result.sketches).toHaveLength(0);
    });

    it("CHOOSE_SKETCH selects the sketch and stores it on the record", () => {
        const two = reducer(withSketch(), act(ActionsTypes.NEW_SKETCH));
        const result = reducer(
            two,
            act(ActionsTypes.CHOOSE_SKETCH, { id: "1" })
        );
        expect(result.sessionState.sketchIdInEdit).toBe("1");
        expect(result.sidurCollection[0].chosenSketch).toBe("1");
    });

    it("CHOOSE_SKETCH with the current id is a no-op", () => {
        const state = withSketch();
        const result = reducer(
            state,
            act(ActionsTypes.CHOOSE_SKETCH, { id: "1" })
        );
        expect(result).toEqual(state);
    });

    it("RENAME_SKETCH renames, and ignores empty names", () => {
        const state = withSketch();
        const renamed = reducer(
            state,
            act(ActionsTypes.RENAME_SKETCH, { id: "1", value: "plan" })
        );
        expect(renamed.sketches[0].name).toBe("plan");
        expect(renamed.sidurCollection[0].sketches[0].name).toBe("plan");
        const ignored = reducer(
            renamed,
            act(ActionsTypes.RENAME_SKETCH, { id: "1", value: "" })
        );
        expect(ignored.sketches[0].name).toBe("plan");
    });

    it("CLONE_SKETCH appends a copy with a new id and selects it", () => {
        const state = withSketch();
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_SKETCH, { id: "1" })
        );
        expect(result.sketches).toHaveLength(2);
        expect(result.sketches[1].id).toBe("2");
        expect(result.sketches[1].name).toContain(state.sketches[0].name);
        expect(result.sessionState.sketchIdInEdit).toBe("2");
    });

    it("CLONE_SKETCH with an unknown id changes nothing", () => {
        const state = withSketch();
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_SKETCH, { id: "9" })
        );
        expect(result.sketches).toHaveLength(1);
    });

    it("DELETE_SKETCH removes the sketch and selects a remaining one", () => {
        const two = reducer(withSketch(), act(ActionsTypes.NEW_SKETCH));
        const result = reducer(
            two,
            act(ActionsTypes.DELETE_SKETCH, { id: "2" })
        );
        expect(result.sketches.map((s) => s.id)).toEqual(["1"]);
        expect(result.sessionState.sketchIdInEdit).toBe("1");
    });

    it("DELETE_SKETCH of the last sketch clears the selection", () => {
        const result = reducer(
            withSketch(),
            act(ActionsTypes.DELETE_SKETCH, { id: "1" })
        );
        expect(result.sketches).toHaveLength(0);
        expect(result.sessionState.sketchIdInEdit).toBe("");
    });

    it("DOWNLOAD_SKETCH downloads a CSV named after the sidur and sketch", () => {
        const spy = vi
            .spyOn(downloads, "DownloadCSVFile")
            .mockImplementation(() => undefined);
        const state = withSketch();
        reducer(state, act(ActionsTypes.DOWNLOAD_SKETCH, { id: "1" }));
        expect(spy).toHaveBeenCalledTimes(1);
        const [name] = spy.mock.calls[0];
        expect(name).toContain(state.sidurCollection[0].Name);
        expect(name.endsWith(".csv")).toBe(true);
    });

    it("DOWNLOAD_SKETCH with an unknown id downloads nothing", () => {
        const spy = vi
            .spyOn(downloads, "DownloadCSVFile")
            .mockImplementation(() => undefined);
        reducer(withSketch(), act(ActionsTypes.DOWNLOAD_SKETCH, { id: "9" }));
        expect(spy).not.toHaveBeenCalled();
    });
});
