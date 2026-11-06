import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    it as vitIt,
    vi,
} from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore, freezeCollections } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { deepFreeze } from "./helpers/deep-freeze";
import { act } from "./helpers/build-sketch";

describe("root reducer - orders", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("ADD_NEW_ORDER puts a default order first with the next id", () => {
        const state = freezeCollections(buildStore());
        const maxId = Math.max(...state.orders.map((o) => Number(o.id)));
        const result = reducer(state, act(ActionsTypes.ADD_NEW_ORDER));
        expect(result.orders).toHaveLength(state.orders.length + 1);
        expect(result.orders[0].id).toBe(String(maxId + 1));
        expect(result.orders[1]).toBe(state.orders[0]);
        expect(result.sidurCollection[0].orders).toHaveLength(
            result.orders.length
        );
    });

    it("ADD_NEW_ORDER avoids ids of deleted and archived orders", () => {
        const state = buildStore();
        const base = state.orders[0];
        state.deletedOrders = [
            { ...base, id: "Del500" },
            { ...base, id: "Arch900" },
        ];
        const result = reducer(state, act(ActionsTypes.ADD_NEW_ORDER));
        expect(result.orders[0].id).toBe("901");
    });

    it("ADD_NEW_ORDER on an empty collection starts at id 1", () => {
        const state = buildStore({ orders: [] });
        const result = reducer(state, act(ActionsTypes.ADD_NEW_ORDER));
        expect(result.orders.map((o) => o.id)).toEqual(["1"]);
    });

    it("CLONE_ORDER inserts a copy right after the source", () => {
        const state = freezeCollections(buildStore());
        const source = state.orders[2];
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_ORDER, { id: source.id })
        );
        expect(result.orders).toHaveLength(state.orders.length + 1);
        const copy = result.orders[3];
        expect(copy.id).not.toBe(source.id);
        expect({ ...copy, id: source.id }).toEqual(source);
        expect(result.orders[2]).toBe(source);
    });

    it("CLONE_ORDER with an unknown id is a no-op", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_ORDER, { id: "unknown" })
        );
        expect(result.orders).toEqual(state.orders);
    });

    it("CLICKED_ORDER sets the order in edit and clears the draft", () => {
        const state = buildStore();
        state.sessionState.dataHolderForCurrentOrderInEdit = null;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_ORDER, { id: "3" })
        );
        expect(result.sessionState.orderIdInEdit).toBe("3");
        expect(result.sessionState.dataHolderForCurrentOrderInEdit).toBeNull();
    });

    it("CLICKED_ORDER commits the draft of the order being edited", () => {
        const state = buildStore();
        const draft = { ...state.orders[0], driverName: "Draft Driver" };
        state.sessionState.orderIdInEdit = draft.id;
        state.sessionState.dataHolderForCurrentOrderInEdit = draft;
        const result = reducer(
            state,
            act(ActionsTypes.CLICKED_ORDER, { id: state.orders[1].id })
        );
        expect(result.orders[0].driverName).toBe("Draft Driver");
        expect(result.sessionState.orderIdInEdit).toBe(state.orders[1].id);
    });

    it("UPDATE_ORDER_IN_EDIT stores the draft", () => {
        const state = buildStore();
        const draft = { ...state.orders[0], driverName: "X" };
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER_IN_EDIT, draft)
        );
        expect(result.sessionState.dataHolderForCurrentOrderInEdit).toEqual(
            draft
        );
    });

    it("UPDATE_ORDER replaces the order with the draft and clears edit state", () => {
        const state = buildStore();
        const draft = { ...state.orders[1], driverName: "Updated" };
        state.sessionState.orderIdInEdit = draft.id;
        state.sessionState.dataHolderForCurrentOrderInEdit = draft;
        freezeCollections(state);
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER, { id: draft.id })
        );
        expect(result.orders[1].driverName).toBe("Updated");
        expect(result.orders[0]).toBe(state.orders[0]);
        expect(result.sessionState.dataHolderForCurrentOrderInEdit).toBeNull();
        expect(result.sessionState.orderIdInEdit).toBeNull();
        expect(result.sidurCollection[0].orders[1].driverName).toBe("Updated");
    });

    it("UPDATE_ORDER without a draft keeps the orders", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER, { id: state.orders[0].id })
        );
        expect(result.orders).toEqual(state.orders);
    });

    it("DELETE_ORDER removes the order and clears edit state pointing at it", () => {
        const state = buildStore();
        const target = state.orders[0];
        state.sessionState.orderIdInEdit = target.id;
        state.sessionState.dataHolderForCurrentOrderInEdit = { ...target };
        freezeCollections(state);
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_ORDER, { id: target.id })
        );
        expect(result.orders.map((o) => o.id)).not.toContain(target.id);
        expect(result.sessionState.orderIdInEdit).toBeNull();
        expect(result.sessionState.dataHolderForCurrentOrderInEdit).toBeNull();
    });

    it("DELETE_ORDER keeps edit state of a different order", () => {
        const state = buildStore();
        state.sessionState.orderIdInEdit = state.orders[1].id;
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_ORDER, { id: state.orders[0].id })
        );
        expect(result.sessionState.orderIdInEdit).toBe(state.orders[1].id);
    });

    it("DELETE_ORDER with an unknown id changes nothing", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_ORDER, { id: "unknown" })
        );
        expect(result.orders).toEqual(state.orders);
    });

    // Known issue: reducers mutate the nested sessionState of their input.
    vitIt.fails("does not mutate the input sessionState (known issue)", () => {
        const state = buildStore();
        deepFreeze(state);
        reducer(
            state,
            act(ActionsTypes.UPDATE_ORDER_IN_EDIT, { ...state.orders[0] })
        );
    });
});
