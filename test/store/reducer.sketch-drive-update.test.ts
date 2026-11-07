import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { stubPersistence } from "./helpers/setup";
import {
    act,
    buildStoreWithSketch,
    driveOf,
    FIXTURE,
    ids,
    sketchOf,
    vehicleById,
} from "./helpers/build-sketch";
import { SketchDriveOrderEditActionEnum } from "../../src/models/SketchDriveOrderEditActionEnum";
import { LanguageUtilities } from "../../src/services/language-utilities";

const withPendingAction = (pendingOrderIdInEdit: string | null = null) => {
    const state = buildStoreWithSketch({ pendingOrderIdInEdit });
    state.sessionState.pendingOrderInEditAction =
        SketchDriveOrderEditActionEnum.Merge;
    state.sessionState.pendingOrderInEditActionSelectDrives = ["2"];
    return state;
};

describe("root reducer - UPDATE_SKETCH_DRIVE", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("re-sorts the vehicle's drives by start hour after an hour change", () => {
        // arrange
        const state = buildStoreWithSketch();
        const drive = driveOf(state, FIXTURE.drive10);
        // act
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE, {
                value: { ...drive, startHour: "16:00", finishHour: "17:00" },
            })
        );
        // assert
        expect(ids(vehicleById(result, FIXTURE.vehicle1).drives)).toEqual([
            FIXTURE.drive14,
            FIXTURE.drive10,
        ]);
        expect(driveOf(result, FIXTURE.drive10).startHour).toBe("16:00");
    });

    it("leaves the drives as they were for an unknown drive id", () => {
        const state = buildStoreWithSketch();
        const before = structuredClone(sketchOf(state).vehicleSchedules);
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE, {
                value: { ...driveOf(state, "1"), id: "unknown" },
            })
        );
        expect(sketchOf(result).vehicleSchedules).toEqual(before);
    });

    it("is a no-op when no sketch is in edit", () => {
        const state = buildStoreWithSketch();
        state.sessionState.sketchIdInEdit = null;
        const before = structuredClone(state.sketches);
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE, {
                value: { ...before[0].vehicleSchedules[0].drives[0] },
            })
        );
        expect(result.sketches).toEqual(before);
    });
});

describe("root reducer - UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("replaces the drive and moves the old drive's orders from pending to assigned", () => {
        // arrange: the merge dialog pushes the pending id into the drive's
        // (shared) implementsOrders array before dispatching
        const state = withPendingAction(FIXTURE.pendingOverlapping);
        const old = driveOf(state, FIXTURE.drive14);
        old.implementsOrders.push(FIXTURE.pendingOverlapping);
        const merged = {
            ...old,
            implementsOrders: [...old.implementsOrders],
            description: "merged",
            startHour: "09:00",
        };
        // act
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER, {
                value: merged,
            })
        );
        // assert
        const sketch = sketchOf(result);
        expect(driveOf(result, FIXTURE.drive14).description).toBe("merged");
        expect(ids(vehicleById(result, FIXTURE.vehicle1).drives)).toEqual([
            FIXTURE.drive14,
            FIXTURE.drive10,
        ]);
        expect(ids(sketch.assignedOrders)).toContain(
            FIXTURE.pendingOverlapping
        );
        expect(ids(sketch.unassignedOrders)).not.toContain(
            FIXTURE.pendingOverlapping
        );
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toBeNull();
    });

    // Known issue: the reducer reads implementsOrders from the drive *before*
    // the update, so it only works because the merge dialog mutates the shared
    // array. With an immutable payload the merged order stays pending.
    it.fails(
        "moves the merged order to assigned with an immutable payload (known issue)",
        () => {
            const state = withPendingAction(FIXTURE.pendingOverlapping);
            const old = driveOf(state, FIXTURE.drive14);
            const result = reducer(
                state,
                act(ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER, {
                    value: {
                        ...old,
                        implementsOrders: [
                            ...old.implementsOrders,
                            FIXTURE.pendingOverlapping,
                        ],
                    },
                })
            );
            expect(ids(sketchOf(result).unassignedOrders)).not.toContain(
                FIXTURE.pendingOverlapping
            );
        }
    );

    it("with an unknown drive id only clears the session action", () => {
        const state = withPendingAction(FIXTURE.pendingOverlapping);
        const before = structuredClone(sketchOf(state));
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER, {
                value: { ...driveOf(state, "1"), id: "unknown" },
            })
        );
        expect(sketchOf(result)).toEqual(before);
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toBeNull();
    });

    it("with no sketch in edit only clears the session action", () => {
        const state = withPendingAction();
        state.sessionState.sketchIdInEdit = null;
        const before = structuredClone(state.sketches);
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER, {
                value: { ...before[0].vehicleSchedules[0].drives[0] },
            })
        );
        expect(result.sketches).toEqual(before);
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toBeNull();
    });
});

describe("root reducer - REPLACE_SKETCH_DRIVE_WITH_ORDER", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("swaps the drive for one built from the pending order", () => {
        // arrange: replace drive "1" (v1, 10:00, order 201) with pending 303 (22:00)
        const state = withPendingAction(FIXTURE.pendingLonely);
        const pending = sketchOf(state).unassignedOrders.find(
            (o) => o.id === FIXTURE.pendingLonely
        )!;
        const expectedDescription = LanguageUtilities.buildBriefText(
            pending,
            state.Locations
        ).driverAndLocation;
        // act
        const result = reducer(
            state,
            act(ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER, {
                value: driveOf(state, FIXTURE.drive10),
            })
        );
        // assert
        const sketch = sketchOf(result);
        const v1 = vehicleById(result, FIXTURE.vehicle1);
        // next id over ["1", "1", "2", "3"] is "4"
        expect(ids(v1.drives)).toEqual([FIXTURE.drive14, "4"]);
        const inserted = driveOf(result, "4");
        expect(inserted.implementsOrders).toEqual([FIXTURE.pendingLonely]);
        expect(inserted.description).toBe(expectedDescription);
        expect(inserted.startHour).toBe(pending.startHour);
        expect(ids(sketch.unassignedOrders)).toEqual([
            FIXTURE.pendingOverlapping,
            FIXTURE.pendingTsamud,
            "201",
        ]);
        expect(ids(sketch.assignedOrders)).toEqual(["202", "203"]);
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toBeNull();
    });

    it("is a no-op on the sketch when pendingOrderIdInEdit is null", () => {
        const state = withPendingAction(null);
        const before = structuredClone(sketchOf(state));
        const result = reducer(
            state,
            act(ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER, {
                value: driveOf(state, FIXTURE.drive10),
            })
        );
        expect(sketchOf(result)).toEqual(before);
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
    });

    it("is a no-op on the sketch when the pending order is not in unassignedOrders", () => {
        const state = withPendingAction("201");
        const before = structuredClone(sketchOf(state));
        const result = reducer(
            state,
            act(ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER, {
                value: driveOf(state, FIXTURE.drive10),
            })
        );
        expect(sketchOf(result)).toEqual(before);
    });

    // Current behaviour: the pending order is dropped from the sketch even
    // though no drive implements it (it is lost). Documented, not endorsed.
    it("with an unknown drive drops the pending order without inserting a drive", () => {
        const state = withPendingAction(FIXTURE.pendingOverlapping);
        const drivesBefore = structuredClone(sketchOf(state).vehicleSchedules);
        const result = reducer(
            state,
            act(ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER, {
                value: { ...driveOf(state, "1"), id: "unknown" },
            })
        );
        expect(sketchOf(result).vehicleSchedules).toEqual(drivesBefore);
        expect(ids(sketchOf(result).unassignedOrders)).not.toContain(
            FIXTURE.pendingOverlapping
        );
    });
});
