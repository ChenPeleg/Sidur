import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { stubPersistence } from "./helpers/setup";
import {
    act,
    buildStoreWithSketch,
    FIXTURE,
    ids,
    recordSketchOf,
    sketchOf,
} from "./helpers/build-sketch";
import { SketchDriveOrderEditActionEnum } from "../../src/models/SketchDriveOrderEditActionEnum";
import { DriveType } from "../../src/models/DriveType.enum";
import { StoreUtils } from "../../src/store/store-utils";

describe("root reducer - pending order actions", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("CLICKED_ADD_TO_VEHICLE_PENDING_ORDER sets AddToVehicle with a placeholder drive list", () => {
        const state = buildStoreWithSketch({
            pendingOrderIdInEdit: FIXTURE.pendingOverlapping,
        });
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_ADD_TO_VEHICLE_PENDING_ORDER)
        );
        expect(result.sessionState.pendingOrderInEditAction).toBe(
            SketchDriveOrderEditActionEnum.AddToVehicle
        );
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toEqual(["noDrivesRealyNeeded"]);
    });

    it("REMOVE_PENDING_ORDER_STATUS clears the action and the drive selection", () => {
        const state = buildStoreWithSketch();
        state.sessionState.pendingOrderInEditAction =
            SketchDriveOrderEditActionEnum.Merge;
        state.sessionState.pendingOrderInEditActionSelectDrives = ["1"];
        const result = reducer(
            state,
            act(ActionsTypes.REMOVE_PENDING_ORDER_STATUS)
        );
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toBeNull();
    });

    describe.each([
        [
            ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER,
            SketchDriveOrderEditActionEnum.ReplaceExisting,
        ],
        [
            ActionsTypes.CLICKED_MERGE_PENDING_ORDER,
            SketchDriveOrderEditActionEnum.Merge,
        ],
    ])("%s", (type, expectedAction) => {
        it("selects the overlapping drives when there are some", () => {
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingOverlapping,
            });
            const result = reducer(state, act(type));
            expect(result.sessionState.pendingOrderInEditAction).toBe(
                expectedAction
            );
            expect(
                result.sessionState.pendingOrderInEditActionSelectDrives
            ).toEqual([FIXTURE.drive14]);
        });

        it("keeps the previous drive selection when no drive overlaps", () => {
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingLonely,
            });
            state.sessionState.pendingOrderInEditActionSelectDrives = [
                "previous",
            ];
            const result = reducer(state, act(type));
            expect(result.sessionState.pendingOrderInEditAction).toBe(
                expectedAction
            );
            expect(
                result.sessionState.pendingOrderInEditActionSelectDrives
            ).toEqual(["previous"]);
        });
    });

    it("CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER selects the order for public transport", () => {
        const state = buildStoreWithSketch();
        state.sessionState.pendingOrderInEditActionSelectDrives = ["1"];
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER, {
                id: FIXTURE.pendingLonely,
            })
        );
        expect(result.sessionState.pendingOrderInEditAction).toBe(
            SketchDriveOrderEditActionEnum.publicTransport
        );
        expect(result.sessionState.pendingOrderIdInEdit).toBe(
            FIXTURE.pendingLonely
        );
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toBeNull();
    });

    describe("CLICKED_SPLIT_PENDING_ORDER", () => {
        it("replaces the order by two halves with consecutive new ids at the front", () => {
            // arrange
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingTsamud,
            });
            state.sessionState.pendingOrderInEditAction =
                SketchDriveOrderEditActionEnum.Split;
            // act
            const result = reducer(
                state,
                act(ActionsTypes.CLICKED_SPLIT_PENDING_ORDER, {
                    id: FIXTURE.pendingTsamud,
                })
            );
            // assert: next id over assigned (201-203) + unassigned (301-303)
            const sketch = sketchOf(result);
            expect(ids(sketch.unassignedOrders)).toEqual([
                "304",
                "305",
                FIXTURE.pendingOverlapping,
                FIXTURE.pendingLonely,
            ]);
            const [to, from] = sketch.unassignedOrders;
            expect(to.TypeOfDrive).toBe(DriveType.OneWayTo);
            expect(to.startHour).toBe("08:00");
            expect(from.TypeOfDrive).toBe(DriveType.OneWayFrom);
            expect(from.finishHour).toBe("13:00");
            expect(result.sessionState.pendingOrderIdInEdit).toBeNull();
            expect(result.sessionState.pendingOrderInEditAction).toBeNull();
            expect(
                result.sessionState.pendingOrderInEditActionSelectDrives
            ).toEqual([]);
            expect(ids(recordSketchOf(result)!.unassignedOrders)).toEqual(
                ids(sketch.unassignedOrders)
            );
        });

        it("with an unknown id keeps the orders but clears the edit id", () => {
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingTsamud,
            });
            const before = ids(sketchOf(state).unassignedOrders);
            const result = reducer(
                state,
                act(ActionsTypes.CLICKED_SPLIT_PENDING_ORDER, { id: "nope" })
            );
            expect(ids(sketchOf(result).unassignedOrders)).toEqual(before);
            expect(result.sessionState.pendingOrderIdInEdit).toBeNull();
        });

        it("with no sketch in edit only aborts the session action", () => {
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingTsamud,
            });
            state.sessionState.sketchIdInEdit = null;
            state.sessionState.pendingOrderInEditAction =
                SketchDriveOrderEditActionEnum.Split;
            const before = structuredClone(state.sketches);
            const result = reducer(
                state,
                act(ActionsTypes.CLICKED_SPLIT_PENDING_ORDER, {
                    id: FIXTURE.pendingTsamud,
                })
            );
            expect(result.sketches).toEqual(before);
            expect(result.sessionState.pendingOrderIdInEdit).toBe(
                FIXTURE.pendingTsamud
            );
            expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        });
    });

    // Not implemented yet: these actions only persist the state. Documented so
    // that implementing them is a visible change.
    describe.each([
        ActionsTypes.CLICKED_CHANGE_PENDING_ORDER,
        ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER,
        ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER,
    ])("%s (current no-op)", (type) => {
        it("returns an equal but new state and persists once", () => {
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingOverlapping,
            });
            const before = structuredClone(state);
            const result = reducer(
                state,
                act(type, { id: FIXTURE.pendingOverlapping })
            );
            expect(result).not.toBe(state);
            expect(result).toEqual(before);
            expect(
                StoreUtils.HandleReducerSaveToLocalStorage
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe.each([
        ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER,
        ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER,
    ])("%s guards", (type) => {
        it("keeps the order list for an unknown id", () => {
            const state = buildStoreWithSketch();
            const before = ids(sketchOf(state).unassignedOrders);
            const result = reducer(state, act(type, { id: "nope" }));
            expect(ids(sketchOf(result).unassignedOrders)).toEqual(before);
        });

        it("keeps the sketches and aborts the action with no sketch in edit", () => {
            const state = buildStoreWithSketch();
            state.sessionState.sketchIdInEdit = null;
            state.sessionState.pendingOrderInEditAction =
                SketchDriveOrderEditActionEnum.Merge;
            const before = structuredClone(state.sketches);
            const result = reducer(
                state,
                act(type, { id: FIXTURE.pendingLonely })
            );
            expect(result.sketches).toEqual(before);
            expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        });
    });
});
