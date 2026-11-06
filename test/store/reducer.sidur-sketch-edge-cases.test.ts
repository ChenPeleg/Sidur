import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { buildTwoSidurStore } from "./helpers/two-sidurim";
import { stubPersistence } from "./helpers/setup";
import { act, buildFixtureSketch, ids } from "./helpers/build-sketch";
import { SidurRecord, SidurStore } from "../../src/store/store.types";
import * as downloads from "../../src/services/downloadFile";

// Name of DefaultSidurTemplate in src/store/utils/sidur-helpers.ts
const DEFAULT_SIDUR_NAME = "הסידור החדש שלי";

/**
 * The fallback default sidur has locationGroupIdForSidur "" (see the known
 * issue in reducer.sidur.test.ts). Adding a group with an empty id lets the
 * fallback be chosen so its id / name logic can be observed.
 */
const withEmptyIdGroup = (state: SidurStore): SidurStore => {
    state.LocationGroups = [
        ...state.LocationGroups,
        { ...state.LocationGroups[0], id: "", name: "empty-id group" },
    ];
    return state;
};

describe("root reducer - sidur edge cases", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("RENAME_SIDUR of a non-current sidur keeps the current one", () => {
        const state = buildTwoSidurStore();
        const result = reducer(
            state,
            act(ActionsTypes.RENAME_SIDUR, { id: "6", value: "renamed" })
        );
        expect(result.sidurId).toBe("5");
        expect(result.sidurCollection.map((s) => s.Name)).toEqual([
            state.sidurCollection[0].Name,
            "renamed",
        ]);
    });

    it("CHANGE_SIDUR_LOCATION_GROUP only changes the current record", () => {
        const state = buildTwoSidurStore();
        state.sidurCollection[1].locationGroupIdForSidur = "other";
        const result = reducer(
            state,
            act(ActionsTypes.CHANGE_SIDUR_LOCATION_GROUP, {
                id: state.LocationGroups[0].id,
            })
        );
        expect(result.sidurCollection[1].locationGroupIdForSidur).toBe("other");
    });

    it("DELETE_SIDUR of an archived sidur swaps the Arch prefix for Del", () => {
        const archived = reducer(
            buildTwoSidurStore(),
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "6" })
        );
        const result = reducer(
            archived,
            act(ActionsTypes.DELETE_SIDUR, { id: "Arch6" })
        );
        expect(ids(result.sidurArchive)).toEqual(["Del6"]);
        expect(ids(result.sidurCollection)).toEqual(["5"]);
        expect(result.sidurId).toBe("5");
    });

    it("DELETE_SIDUR of the only sidur creates the default sidur and chooses it", () => {
        const state = withEmptyIdGroup(buildStore());
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_SIDUR, { id: "5" })
        );
        expect(ids(result.sidurArchive)).toEqual(["Del5"]);
        expect(ids(result.sidurCollection)).toEqual(["6"]);
        expect(result.sidurCollection[0].Name).toBe(DEFAULT_SIDUR_NAME);
        expect(result.sidurId).toBe("6");
        expect(result.orders).toEqual([]);
    });

    it("the default sidur gets its id appended when the name is taken", () => {
        const state = withEmptyIdGroup(buildStore());
        state.sidurArchive = [
            {
                ...state.sidurCollection[0],
                id: "Arch7",
                Name: DEFAULT_SIDUR_NAME,
            },
        ];
        const result = reducer(
            state,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "5" })
        );
        expect(ids(result.sidurCollection)).toEqual(["8"]);
        expect(result.sidurCollection[0].Name).toBe(DEFAULT_SIDUR_NAME + " 8");
        expect(result.sidurId).toBe("8");
    });

    it("ARCHIVE_SIDUR of the current sidur chooses the first remaining one", () => {
        const state = buildTwoSidurStore();
        const result = reducer(
            state,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "5" })
        );
        expect(result.sidurId).toBe("6");
        expect(result.orders.map((o) => o.driverName)).toEqual([
            "second-driver",
        ]);
        expect(ids(result.sidurArchive)).toEqual(["Arch5"]);
    });

    it("ARCHIVE_SIDUR of a deleted sidur currently leaves it deleted", () => {
        const deleted = reducer(
            buildTwoSidurStore(),
            act(ActionsTypes.DELETE_SIDUR, { id: "6" })
        );
        const result = reducer(
            deleted,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "Del6" })
        );
        expect(ids(result.sidurArchive)).toEqual(["Del6"]);
    });

    // Known issue: the "deleted" branch replaces Arch with Del instead of
    // Del with Arch, so archiving a deleted sidur does nothing.
    it.fails(
        "ARCHIVE_SIDUR of a deleted sidur moves it to Arch (known issue)",
        () => {
            const deleted = reducer(
                buildTwoSidurStore(),
                act(ActionsTypes.DELETE_SIDUR, { id: "6" })
            );
            const result = reducer(
                deleted,
                act(ActionsTypes.ARCHIVE_SIDUR, { id: "Del6" })
            );
            expect(ids(result.sidurArchive)).toEqual(["Arch6"]);
        }
    );

    it("MOVE_TO_ACTIVE_SIDUR with an unknown id changes nothing", () => {
        const archived = reducer(
            buildTwoSidurStore(),
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "6" })
        );
        const result = reducer(
            archived,
            act(ActionsTypes.MOVE_TO_ACTIVE_SIDUR, { id: "Arch99" })
        );
        expect(ids(result.sidurArchive)).toEqual(["Arch6"]);
        expect(ids(result.sidurCollection)).toEqual(["5"]);
    });

    it("ADD_NEW_SIDUR without a group in edit uses the first group and a unique name", () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = null;
        const first = reducer(state, act(ActionsTypes.ADD_NEW_SIDUR));
        const second = reducer(first, act(ActionsTypes.ADD_NEW_SIDUR));
        const added = second.sidurCollection.slice(1) as SidurRecord[];
        expect(ids(added)).toEqual(["6", "7"]);
        expect(added[0].locationGroupIdForSidur).toBe(
            state.LocationGroups[0].id
        );
        expect(added[0].Name).not.toBe(added[1].Name);
        expect(added[0].Name.endsWith(" 6")).toBe(true);
    });
});

describe("root reducer - sketch edge cases", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const withSketches = (count: number, selected: string): SidurStore => {
        const state = buildStore();
        state.sketches = Array.from({ length: count }, (_, i) => ({
            ...buildFixtureSketch(),
            id: String(i + 1),
            name: "sketch " + (i + 1),
        }));
        state.sessionState.sketchIdInEdit = selected;
        return state;
    };

    it("NEW_SKETCH works when the sketches list is missing", () => {
        const state = {
            ...buildStore(),
            sketches: undefined,
        } as unknown as SidurStore;
        const result = reducer(state, act(ActionsTypes.NEW_SKETCH));
        expect(ids(result.sketches)).toEqual(["1"]);
    });

    it("CHOOSE_SKETCH with an unknown id selects it but does not touch the record", () => {
        const state = withSketches(2, "1");
        state.sidurCollection[0].chosenSketch = "1";
        const result = reducer(
            state,
            act(ActionsTypes.CHOOSE_SKETCH, { id: "9" })
        );
        expect(result.sessionState.sketchIdInEdit).toBe("9");
        expect(result.sidurCollection[0].chosenSketch).toBe("1");
    });

    it("CHOOSE_SKETCH without a sidur record only changes the selection", () => {
        const state = withSketches(2, "1");
        state.sidurId = "missing";
        const result = reducer(
            state,
            act(ActionsTypes.CHOOSE_SKETCH, { id: "2" })
        );
        expect(result.sessionState.sketchIdInEdit).toBe("2");
        expect(result.sidurCollection[0].chosenSketch).toBe(
            state.sidurCollection[0].chosenSketch
        );
    });

    it("RENAME_SKETCH with an unknown id renames nothing", () => {
        const state = withSketches(2, "1");
        const result = reducer(
            state,
            act(ActionsTypes.RENAME_SKETCH, { id: "9", value: "x" })
        );
        expect(result.sketches.map((s) => s.name)).toEqual([
            "sketch 1",
            "sketch 2",
        ]);
    });

    it("RENAME_SKETCH without a sidur record still renames the sketch", () => {
        const state = withSketches(1, "1");
        state.sidurId = "missing";
        const result = reducer(
            state,
            act(ActionsTypes.RENAME_SKETCH, { id: "1", value: "x" })
        );
        expect(result.sketches[0].name).toBe("x");
    });

    it("DELETE_SKETCH with an unknown id keeps the sketches", () => {
        const state = withSketches(2, "2");
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_SKETCH, { id: "9" })
        );
        expect(ids(result.sketches)).toEqual(["1", "2"]);
    });

    it("DELETE_SKETCH of the third sketch selects the one before it", () => {
        const state = withSketches(4, "3");
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_SKETCH, { id: "3" })
        );
        expect(ids(result.sketches)).toEqual(["1", "2", "4"]);
        expect(result.sessionState.sketchIdInEdit).toBe("2");
        expect(ids(result.sidurCollection[0].sketches)).toEqual([
            "1",
            "2",
            "4",
        ]);
    });

    // Known issue: the selection is recomputed from the deleted sketch's
    // position even when another sketch was selected.
    it.fails(
        "DELETE_SKETCH of a non-selected sketch keeps the selection (known issue)",
        () => {
            const state = withSketches(3, "3");
            const result = reducer(
                state,
                act(ActionsTypes.DELETE_SKETCH, { id: "1" })
            );
            expect(result.sessionState.sketchIdInEdit).toBe("3");
        }
    );

    it("DOWNLOAD_SKETCH without a sidur record uses an empty sidur name", () => {
        const spy = vi
            .spyOn(downloads, "DownloadCSVFile")
            .mockImplementation(() => undefined);
        const state = withSketches(1, "1");
        state.sidurId = "missing";
        reducer(state, act(ActionsTypes.DOWNLOAD_SKETCH, { id: "1" }));
        expect(spy).toHaveBeenCalledTimes(1);
        const [name] = spy.mock.calls[0];
        expect(name.startsWith(" ")).toBe(true);
        expect(name).toContain("sketch 1");
    });

    it("sketch changes are not synced when the sidur record is missing", () => {
        const state = withSketches(1, "1");
        state.sidurId = "missing";
        const before = structuredClone(state.sidurCollection);
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_SKETCH, { id: "1" })
        );
        expect(ids(result.sketches)).toEqual(["1", "2"]);
        expect(result.sidurCollection).toEqual(before);
    });
});
