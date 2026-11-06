import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { SidurStore } from "../../src/store/store.types";
import {
    buildStoreWithSketch,
    driveOf,
    FIXTURE,
    ids,
    sketchOf,
} from "./helpers/build-sketch";
import { SidurEditorService } from "../../src/sidurEditor/sidurEditor.service";
import { LanguageUtilities } from "../../src/services/language-utilities";
import { act } from "./helpers/build-sketch";

describe("root reducer - end to end sequence", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("keeps data when editing, sketching and switching between sidurim", () => {
        let state = buildStore();
        const originalSidurId = state.sidurId;
        const originalCount = state.orders.length;

        state = reducer(state, act(ActionsTypes.ADD_NEW_ORDER));
        const newOrder = state.orders[0];
        expect(state.orders).toHaveLength(originalCount + 1);

        state = reducer(
            state,
            act(ActionsTypes.CLICKED_ORDER, { id: newOrder.id })
        );
        state = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER_IN_EDIT, {
                ...newOrder,
                driverName: "Seq Driver",
            })
        );
        state = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER, { id: newOrder.id })
        );
        expect(state.orders[0].driverName).toBe("Seq Driver");

        state = reducer(state, act(ActionsTypes.NEW_SKETCH));
        expect(state.sketches).toHaveLength(1);

        state = reducer(state, act(ActionsTypes.ADD_NEW_SIDUR));
        const otherId = state.sidurId;
        expect(otherId).not.toBe(originalSidurId);
        expect(state.orders).toEqual([]);

        state = reducer(
            state,
            act(ActionsTypes.CHOOSE_SIDUR, { id: originalSidurId })
        );
        expect(state.orders).toHaveLength(originalCount + 1);
        expect(state.orders[0].driverName).toBe("Seq Driver");
        expect(state.sketches).toHaveLength(1);
        expect(
            state.sidurCollection.find((s) => s.id === otherId)!.orders
        ).toEqual([]);
    });

    it("pending order: merge into a drive, then remove it back to pending", () => {
        let state = buildStore();
        state = reducer(state, act(ActionsTypes.NEW_SKETCH));

        // pick a pending order that overlaps at least one drive
        const sketch = sketchOf(state);
        const pending = sketch.unassignedOrders.find(
            (o) =>
                SidurEditorService.getRelevantDriveIdsToChoose(sketch, o.id)
                    .length > 0
        )!;
        expect(pending).toBeDefined();

        state = reducer(
            state,
            act(ActionsTypes.CLICKED_PENDING_ORDER, { id: pending.id })
        );
        state = reducer(state, act(ActionsTypes.CLICKED_MERGE_PENDING_ORDER));
        const selectable =
            state.sessionState.pendingOrderInEditActionSelectDrives!;
        expect(selectable.length).toBeGreaterThan(0);

        // the merge dialog pushes the pending id into the drive's
        // implementsOrders before dispatching (see sketch-drive-merge-dialog)
        const target = driveOf(state, selectable[0]);
        target.implementsOrders.push(pending.id);
        state = reducer(
            state,
            act(ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER, {
                value: { ...target, description: "merged" },
            })
        );
        expect(ids(sketchOf(state).assignedOrders)).toContain(pending.id);
        expect(ids(sketchOf(state).unassignedOrders)).not.toContain(pending.id);
        expect(state.sessionState.pendingOrderInEditAction).toBeNull();

        state = reducer(
            state,
            act(ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE, {
                sketchDriveId: target.id,
                orderId: pending.id,
            })
        );
        expect(driveOf(state, target.id).implementsOrders).not.toContain(
            pending.id
        );
        expect(ids(sketchOf(state).unassignedOrders).at(-1)).toBe(pending.id);
        expect(ids(sketchOf(state).assignedOrders)).not.toContain(pending.id);
    });

    it("replace: the replaced drive survives switching sidur and back", () => {
        let state: SidurStore = buildStoreWithSketch();
        state.sidurCollection = [
            ...state.sidurCollection,
            {
                ...structuredClone(state.sidurCollection[0]),
                id: "6",
                Name: "second",
                orders: [],
                sketches: [],
            },
        ];

        state = reducer(
            state,
            act(ActionsTypes.CLICKED_PENDING_ORDER, {
                id: FIXTURE.pendingLonely,
            })
        );
        state = reducer(
            state,
            act(ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER)
        );
        state = reducer(
            state,
            act(ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER, {
                value: driveOf(state, FIXTURE.drive10),
            })
        );
        const replacedSketch = structuredClone(sketchOf(state));
        expect(driveOf(state, "4").implementsOrders).toEqual([
            FIXTURE.pendingLonely,
        ]);

        state = reducer(state, act(ActionsTypes.CHOOSE_SIDUR, { id: "6" }));
        expect(state.sketches).toEqual([]);
        state = reducer(state, act(ActionsTypes.CHOOSE_SIDUR, { id: "5" }));

        expect(sketchOf(state)).toEqual(replacedSketch);
        expect(
            state.sidurCollection
                .find((s) => s.id === "5")!
                .sketches.find((k) => k.id === replacedSketch.id)
        ).toEqual(replacedSketch);
    });

    it("location group switch: new orders resolve against the new group", () => {
        let state = buildStore();
        const oldGroupId = state.LocationGroups[0].id;

        state = reducer(state, act(ActionsTypes.NEW_LOCATION_GROUP));
        const newGroupId = state.sessionState.locationGroupInEdit!;
        state = reducer(state, act(ActionsTypes.ADD_NEW_LOCATION));
        const newLocation = state.LocationGroups.find(
            (g) => g.id === newGroupId
        )!.Locations[0];

        state = reducer(
            state,
            act(ActionsTypes.CHANGE_SIDUR_LOCATION_GROUP, { id: newGroupId })
        );
        expect(state.Locations.map((l) => l.id)).toEqual([newLocation.id]);

        state = reducer(state, act(ActionsTypes.ADD_NEW_ORDER));
        const order = state.orders[0];
        state = reducer(
            state,
            act(ActionsTypes.CLICKED_ORDER, { id: order.id })
        );
        state = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER_IN_EDIT, {
                ...order,
                driverName: "Seq Driver",
                location: newLocation.id,
            })
        );
        state = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER, { id: order.id })
        );

        const brief = LanguageUtilities.buildBriefText(
            state.orders[0],
            state.Locations
        ).driverAndLocation;
        expect(brief).toContain(newLocation.name);
        const record = state.sidurCollection.find(
            (s) => s.id === state.sidurId
        )!;
        expect(record.locationGroupIdForSidur).toBe(newGroupId);
        expect(record.locationGroupIdForSidur).not.toBe(oldGroupId);
        expect(record.orders[0].location).toBe(newLocation.id);
    });
});
