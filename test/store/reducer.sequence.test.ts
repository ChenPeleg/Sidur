import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { IAction } from "../../src/store/store.types";

const act = (type: ActionsTypes, payload: IAction["payload"] = {}) =>
    ({ type, payload }) as IAction;

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
});
