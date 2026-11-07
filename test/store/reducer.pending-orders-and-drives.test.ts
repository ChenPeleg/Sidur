import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { SidurStore } from "../../src/store/store.types";
import { act } from "./helpers/build-sketch";

const withSketch = (): SidurStore =>
    reducer(buildStore(), act(ActionsTypes.NEW_SKETCH));

const sketchOf = (s: SidurStore) =>
    s.sketches.find((k) => k.id === s.sessionState.sketchIdInEdit)!;

describe("root reducer - pending orders", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("CLICKED_PENDING_ORDER selects the pending order and resets the action", () => {
        const state = withSketch();
        const id = sketchOf(state).unassignedOrders[0].id;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_PENDING_ORDER, { id })
        );
        expect(result.sessionState.pendingOrderIdInEdit).toBe(id);
        expect(result.sessionState.pendingOrderInEditAction).toBeNull();
        expect(
            result.sessionState.pendingOrderInEditActionSelectDrives
        ).toEqual([]);
    });

    it("CLICKED_PENDING_ORDER without an id keeps the selection", () => {
        const state = withSketch();
        state.sessionState.pendingOrderIdInEdit = "keep";
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_PENDING_ORDER, {})
        );
        expect(result.sessionState.pendingOrderIdInEdit).toBe("keep");
    });

    it("CLICKED_CLOSE_PENDING_ORDER clears the selection", () => {
        const state = withSketch();
        state.sessionState.pendingOrderIdInEdit = "103";
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_CLOSE_PENDING_ORDER)
        );
        expect(result.sessionState.pendingOrderIdInEdit).toBeNull();
    });

    it("CLICKED_REMOVE_PENDING_ORDER moves the order to assigned", () => {
        const state = withSketch();
        const sketch = sketchOf(state);
        const id = sketch.unassignedOrders[0].id;
        const unassignedBefore = sketch.unassignedOrders.length;
        const assignedBefore = sketch.assignedOrders.length;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_REMOVE_PENDING_ORDER, { id })
        );
        const after = sketchOf(result);
        expect(after.unassignedOrders).toHaveLength(unassignedBefore - 1);
        expect(after.assignedOrders).toHaveLength(assignedBefore + 1);
        expect(after.assignedOrders.map((o) => o.id)).toContain(id);
    });

    it("CLICKED_REMOVE_PENDING_ORDER with an unknown id keeps the sketch lists", () => {
        const state = withSketch();
        const before = sketchOf(state).unassignedOrders.length;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_REMOVE_PENDING_ORDER, { id: "unknown" })
        );
        expect(sketchOf(result).unassignedOrders).toHaveLength(before);
    });

    it("CLICKED_MOVE_TO_TOP_PENDING_ORDER moves the order to the front", () => {
        const state = withSketch();
        const last = sketchOf(state).unassignedOrders.at(-1)!.id;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER, { id: last })
        );
        expect(sketchOf(result).unassignedOrders[0].id).toBe(last);
    });

    it("CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER moves the order to the end", () => {
        const state = withSketch();
        const first = sketchOf(state).unassignedOrders[0].id;
        const count = sketchOf(state).unassignedOrders.length;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER, {
                id: first,
            })
        );
        const list = sketchOf(result).unassignedOrders;
        expect(list).toHaveLength(count);
        expect(list.at(-1)!.id).toBe(first);
    });

    it("CLICKED_MERGE_PENDING_ORDER sets the merge action", () => {
        const state = withSketch();
        state.sessionState.pendingOrderIdInEdit =
            sketchOf(state).unassignedOrders[0].id;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_MERGE_PENDING_ORDER)
        );
        expect(result.sessionState.pendingOrderInEditAction).not.toBeNull();
    });
});

describe("root reducer - sketch drives", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("ADD_SKETCH_DRIVE_FROM_PENDING_ORDER adds a drive to the vehicle", () => {
        const state = withSketch();
        const sketch = sketchOf(state);
        const order = sketch.unassignedOrders[0];
        state.sessionState.pendingOrderIdInEdit = order.id;
        const vehicle = sketch.vehicleSchedules[0];
        const drivesBefore = vehicle.drives.length;
        const result = reducer(
            state,
            act(ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER, {
                value: vehicle.id,
            })
        );
        const after = sketchOf(result);
        expect(after.vehicleSchedules[0].drives).toHaveLength(drivesBefore + 1);
        expect(
            after.vehicleSchedules[0].drives.some((d) =>
                d.implementsOrders.includes(order.id)
            )
        ).toBe(true);
        expect(after.unassignedOrders.map((o) => o.id)).not.toContain(order.id);
    });

    it("ADD_SKETCH_DRIVE_FROM_PENDING_ORDER without a pending order does nothing", () => {
        const state = withSketch();
        const sketch = sketchOf(state);
        const total = sketch.vehicleSchedules.flatMap((v) => v.drives).length;
        const result = reducer(
            state,
            act(ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER, {
                value: sketch.vehicleSchedules[0].id,
            })
        );
        expect(
            sketchOf(result).vehicleSchedules.flatMap((v) => v.drives)
        ).toHaveLength(total);
    });

    it("DELETE_SKETCH_DRIVE removes the drive from its vehicle", () => {
        const state = withSketch();
        const vehicle = sketchOf(state).vehicleSchedules.find(
            (v) => v.drives.length
        )!;
        const drive = vehicle.drives[0];
        const before = vehicle.drives.length;
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_SKETCH_DRIVE, { value: drive })
        );
        const after = sketchOf(result).vehicleSchedules.find(
            (v) => v.id === vehicle.id
        )!;
        expect(after.drives).toHaveLength(before - 1);
        expect(after.drives.map((d) => d.id)).not.toContain(drive.id);
    });

    it("UPDATE_SKETCH_DRIVE replaces the drive content", () => {
        const state = withSketch();
        const vehicle = sketchOf(state).vehicleSchedules.find(
            (v) => v.drives.length
        )!;
        const drive = vehicle.drives[0];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE, {
                value: { ...drive, driverName: "changed" },
            })
        );
        const updated = sketchOf(result)
            .vehicleSchedules.flatMap((v) => v.drives)
            .find((d) => d.id === drive.id)!;
        expect(updated.driverName).toBe("changed");
    });

    it("REMOVE_ORDER_FROM_SKETCH_DRIVE with an unknown drive keeps the drives", () => {
        const state = withSketch();
        const total = sketchOf(state).vehicleSchedules.flatMap(
            (v) => v.drives
        ).length;
        const result = reducer(
            state,
            act(ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE, {
                sketchDriveId: "unknown",
                orderId: "unknown",
            })
        );
        expect(
            sketchOf(result).vehicleSchedules.flatMap((v) => v.drives)
        ).toHaveLength(total);
    });
});
