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
    recordSketchOf,
    sketchOf,
    vehicleById,
} from "./helpers/build-sketch";

describe("root reducer - sketch drive orders", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    describe("REMOVE_ORDER_FROM_SKETCH_DRIVE", () => {
        it("unlinks the order from the drive and moves it to the end of pending", () => {
            // arrange
            const state = buildStoreWithSketch();
            // act
            const result = reducer(
                state,
                act(ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE, {
                    sketchDriveId: FIXTURE.drive14,
                    orderId: "202",
                })
            );
            // assert
            const sketch = sketchOf(result);
            expect(driveOf(result, FIXTURE.drive14).implementsOrders).toEqual(
                []
            );
            expect(ids(sketch.assignedOrders)).toEqual(["201", "203"]);
            expect(ids(sketch.unassignedOrders).at(-1)).toBe("202");
            expect(ids(recordSketchOf(result)!.unassignedOrders)).toEqual(
                ids(sketch.unassignedOrders)
            );
        });

        it("only edits the drive when the order is not assigned", () => {
            const state = buildStoreWithSketch();
            driveOf(state, FIXTURE.drive14).implementsOrders.push(
                FIXTURE.pendingOverlapping
            );
            const pendingBefore = ids(sketchOf(state).unassignedOrders);
            const assignedBefore = ids(sketchOf(state).assignedOrders);
            const result = reducer(
                state,
                act(ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE, {
                    sketchDriveId: FIXTURE.drive14,
                    orderId: FIXTURE.pendingOverlapping,
                })
            );
            expect(driveOf(result, FIXTURE.drive14).implementsOrders).toEqual([
                "202",
            ]);
            expect(ids(sketchOf(result).unassignedOrders)).toEqual(
                pendingBefore
            );
            expect(ids(sketchOf(result).assignedOrders)).toEqual(
                assignedBefore
            );
        });

        it("is a no-op on sketches when no sketch is in edit", () => {
            const state = buildStoreWithSketch();
            state.sessionState.sketchIdInEdit = null;
            const before = structuredClone(state.sketches);
            const result = reducer(
                state,
                act(ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE, {
                    sketchDriveId: FIXTURE.drive14,
                    orderId: "202",
                })
            );
            expect(result.sketches).toEqual(before);
        });
    });

    describe("DELETE_SKETCH_DRIVE", () => {
        it("keeps all drives for an unknown drive id", () => {
            const state = buildStoreWithSketch();
            const before = structuredClone(sketchOf(state).vehicleSchedules);
            const result = reducer(
                state,
                act(ActionsTypes.DELETE_SKETCH_DRIVE, {
                    value: { ...driveOf(state, "1"), id: "unknown" },
                })
            );
            expect(sketchOf(result).vehicleSchedules).toEqual(before);
        });

        it("keeps the remaining drives sorted by start hour", () => {
            const state = buildStoreWithSketch();
            // put v1 out of order: 14:00 before 10:00, plus a 12:00 drive
            const v1 = vehicleById(state, FIXTURE.vehicle1);
            v1.drives = [
                v1.drives[1],
                { ...v1.drives[0], id: "9", startHour: "12:00" },
                v1.drives[0],
            ];
            const result = reducer(
                state,
                act(ActionsTypes.DELETE_SKETCH_DRIVE, {
                    value: { id: "9" },
                })
            );
            expect(ids(vehicleById(result, FIXTURE.vehicle1).drives)).toEqual([
                FIXTURE.drive10,
                FIXTURE.drive14,
            ]);
            expect(
                ids(recordSketchOf(result)!.vehicleSchedules[0].drives)
            ).toEqual([FIXTURE.drive10, FIXTURE.drive14]);
        });
    });

    describe("ADD_SKETCH_DRIVE_FROM_PENDING_ORDER", () => {
        it("places the new drive in start-hour order among existing drives", () => {
            // arrange: 08:00 Tsamud order into v1 (10:00, 14:00)
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingTsamud,
            });
            // act
            const result = reducer(
                state,
                act(ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER, {
                    value: FIXTURE.vehicle1,
                })
            );
            // assert: new id is the next over all drive ids ("4")
            expect(ids(vehicleById(result, FIXTURE.vehicle1).drives)).toEqual([
                "4",
                FIXTURE.drive10,
                FIXTURE.drive14,
            ]);
            expect(driveOf(result, "4").implementsOrders).toEqual([
                FIXTURE.pendingTsamud,
            ]);
            expect(ids(sketchOf(result).assignedOrders)).toContain(
                FIXTURE.pendingTsamud
            );
            expect(result.sessionState.pendingOrderInEditAction).toBeNull();
            expect(
                result.sessionState.pendingOrderInEditActionSelectDrives
            ).toBeNull();
        });

        it("with an unknown vehicle still moves the order to assigned", () => {
            // Current behaviour: the order leaves pending although no drive
            // implements it.
            const state = buildStoreWithSketch({
                pendingOrderIdInEdit: FIXTURE.pendingTsamud,
            });
            const drivesBefore = structuredClone(
                sketchOf(state).vehicleSchedules
            );
            const result = reducer(
                state,
                act(ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER, {
                    value: "no-such-vehicle",
                })
            );
            expect(sketchOf(result).vehicleSchedules).toEqual(drivesBefore);
            expect(ids(sketchOf(result).assignedOrders)).toContain(
                FIXTURE.pendingTsamud
            );
        });
    });
});
