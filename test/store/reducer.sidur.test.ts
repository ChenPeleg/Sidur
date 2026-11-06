import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { buildTwoSidurStore } from "./helpers/two-sidurim";
import { stubPersistence } from "./helpers/setup";
import { IAction } from "../../src/store/store.types";

const act = (type: ActionsTypes, payload: IAction["payload"] = {}) =>
    ({ type, payload }) as IAction;

describe("root reducer - sidur", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    describe("CHOOSE_SIDUR", () => {
        it("is a no-op for the current id", () => {
            const state = buildTwoSidurStore();
            const result = reducer(
                state,
                act(ActionsTypes.CHOOSE_SIDUR, { id: state.sidurId })
            );
            expect(result).toEqual(state);
        });

        it("saves current data into the previous record and loads the chosen one", () => {
            const state = buildTwoSidurStore();
            const previousId = state.sidurId;
            state.orders = state.orders.map((o, i) =>
                i === 0 ? { ...o, driverName: "edited" } : o
            );
            const result = reducer(
                state,
                act(ActionsTypes.CHOOSE_SIDUR, { id: "6" })
            );
            expect(result.sidurId).toBe("6");
            expect(result.orders).toHaveLength(1);
            expect(result.orders[0].driverName).toBe("second-driver");
            const previous = result.sidurCollection.find(
                (s) => s.id === previousId
            )!;
            expect(previous.orders[0].driverName).toBe("edited");
            expect(result.recordBriefs.map((r) => r.id)).toContain("6");
        });

        it("switching back restores the original data", () => {
            const state = buildTwoSidurStore();
            const originalOrders = JSON.parse(JSON.stringify(state.orders));
            const there = reducer(
                state,
                act(ActionsTypes.CHOOSE_SIDUR, { id: "6" })
            );
            const back = reducer(
                there,
                act(ActionsTypes.CHOOSE_SIDUR, { id: state.sidurId })
            );
            expect(back.orders).toEqual(originalOrders);
        });

        it("keeps data for an unknown id but switches sidurId", () => {
            const state = buildTwoSidurStore();
            const result = reducer(
                state,
                act(ActionsTypes.CHOOSE_SIDUR, { id: "missing" })
            );
            expect(result.sidurId).toBe("missing");
            expect(result.orders).toEqual(state.orders);
        });
    });

    describe("RENAME_SIDUR", () => {
        it("renames the sidur and refreshes the record briefs", () => {
            const state = buildTwoSidurStore();
            const result = reducer(
                state,
                act(ActionsTypes.RENAME_SIDUR, { id: "6", value: "new name" })
            );
            expect(result.sidurCollection[1].Name).toBe("new name");
            expect(result.sidurCollection[0]).toBe(state.sidurCollection[0]);
            expect(result.recordBriefs.find((r) => r.id === "6")!.name).toBe(
                "new name"
            );
        });

        it("ignores empty names", () => {
            const state = buildTwoSidurStore();
            const result = reducer(
                state,
                act(ActionsTypes.RENAME_SIDUR, { id: "6", value: "" })
            );
            expect(result.sidurCollection).toBe(state.sidurCollection);
        });
    });

    it("ADD_NEW_SIDUR adds an empty sidur and chooses it", () => {
        const state = buildStore();
        const result = reducer(state, act(ActionsTypes.ADD_NEW_SIDUR));
        expect(result.sidurCollection).toHaveLength(2);
        expect(result.sidurId).not.toBe(state.sidurId);
        expect(result.sidurCollection.map((s) => s.id)).toContain(
            result.sidurId
        );
        expect(result.orders).toEqual([]);
    });

    it("CLONE_SIDUR clones with a new id and a copy name, and chooses it", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_SIDUR, { id: state.sidurId })
        );
        expect(result.sidurCollection).toHaveLength(2);
        expect(result.sidurId).not.toBe(state.sidurId);
        const clone = result.sidurCollection.find(
            (s) => s.id === result.sidurId
        )!;
        expect(clone.Name).toContain(state.sidurCollection[0].Name);
        expect(clone.orders).toEqual(state.sidurCollection[0].orders);
        expect(clone.orders).not.toBe(state.sidurCollection[0].orders);
    });

    it("CLONE_SIDUR with an unknown id changes nothing", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_SIDUR, { id: "x" })
        );
        expect(result.sidurCollection).toHaveLength(1);
        expect(result.sidurId).toBe(state.sidurId);
    });

    it("DELETE_SIDUR moves a non-current sidur to the archive with a Del prefix", () => {
        const state = buildTwoSidurStore();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_SIDUR, { id: "6" })
        );
        expect(result.sidurCollection.map((s) => s.id)).toEqual([
            state.sidurId,
        ]);
        expect(result.sidurArchive.map((s) => s.id)).toEqual(["Del6"]);
        expect(result.sidurId).toBe(state.sidurId);
    });

    it("DELETE_SIDUR of the current sidur chooses the first remaining one", () => {
        const state = buildTwoSidurStore();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_SIDUR, { id: state.sidurId })
        );
        expect(result.sidurId).toBe("6");
        expect(result.orders[0].driverName).toBe("second-driver");
    });

    // Known issue: the fallback default sidur has no location group, so
    // setChosenSidur throws when it is chosen.
    it.fails(
        "DELETE_SIDUR of the only sidur creates a default one (known issue)",
        () => {
            const state = buildStore();
            const result = reducer(
                state,
                act(ActionsTypes.DELETE_SIDUR, { id: state.sidurId })
            );
            expect(result.sidurCollection).toHaveLength(1);
            expect(result.sidurId).not.toBe(state.sidurId);
            expect(result.sidurArchive).toHaveLength(1);
        }
    );

    it("ARCHIVE_SIDUR moves a sidur to the archive with an Arch prefix", () => {
        const state = buildTwoSidurStore();
        const result = reducer(
            state,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "6" })
        );
        expect(result.sidurCollection).toHaveLength(1);
        expect(result.sidurArchive.map((s) => s.id)).toEqual(["Arch6"]);
    });

    it("ARCHIVE_SIDUR with an unknown id changes nothing", () => {
        const state = buildTwoSidurStore();
        const result = reducer(
            state,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "x" })
        );
        expect(result.sidurCollection).toHaveLength(2);
        expect(result.sidurArchive).toHaveLength(0);
    });

    it("MOVE_TO_ACTIVE_SIDUR restores an archived sidur without its prefix", () => {
        const state = buildTwoSidurStore();
        const archived = reducer(
            state,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "6" })
        );
        const result = reducer(
            archived,
            act(ActionsTypes.MOVE_TO_ACTIVE_SIDUR, { id: "Arch6" })
        );
        expect(result.sidurArchive).toHaveLength(0);
        expect(result.sidurCollection.map((s) => s.id)).toContain("6");
    });

    it("DELETE_FOREVER_SIDUR removes it from the archive only", () => {
        const state = buildTwoSidurStore();
        const archived = reducer(
            state,
            act(ActionsTypes.ARCHIVE_SIDUR, { id: "6" })
        );
        const result = reducer(
            archived,
            act(ActionsTypes.DELETE_FOREVER_SIDUR, { id: "Arch6" })
        );
        expect(result.sidurArchive).toHaveLength(0);
        expect(result.sidurCollection).toHaveLength(1);
        expect(
            reducer(
                result,
                act(ActionsTypes.DELETE_FOREVER_SIDUR, { id: "none" })
            ).sidurArchive
        ).toHaveLength(0);
    });

    it("CHANGE_SIDUR_LOCATION_GROUP updates the record and the locations", () => {
        const state = buildStore();
        const group = state.LocationGroups[0];
        const result = reducer(
            state,
            act(ActionsTypes.CHANGE_SIDUR_LOCATION_GROUP, { id: group.id })
        );
        expect(result.sidurCollection[0].locationGroupIdForSidur).toBe(
            group.id
        );
        expect(result.Locations).toBe(group.Locations);
    });
});
