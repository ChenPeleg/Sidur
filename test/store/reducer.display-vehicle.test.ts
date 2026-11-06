import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore, freezeCollections } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { act } from "./helpers/build-sketch";

describe("root reducer - display", () => {
    it("CHANGE_VIEW sets the view without touching the input", () => {
        const state = buildStore();
        const before = state.displaySetting.view;
        const next = before === "sketch" ? "orders" : "sketch";
        const result = reducer(
            state,
            act(ActionsTypes.CHANGE_VIEW, { value: next })
        );
        expect(result.displaySetting.view).toBe(next);
        expect(state.displaySetting.view).toBe(before);
        expect(result.orders).toBe(state.orders);
    });

    it("toggles the loading animation", () => {
        const state = buildStore();
        const stopped = reducer(
            state,
            act(ActionsTypes.STOP_LOADING_ANIMATION)
        );
        expect(stopped.sessionState.isAnimationRunning).toBe(false);
        const started = reducer(
            stopped,
            act(ActionsTypes.START_LOADING_ANIMATION)
        );
        expect(started.sessionState.isAnimationRunning).toBe(true);
    });

    it("stopping the animation twice is idempotent", () => {
        const once = reducer(
            buildStore(),
            act(ActionsTypes.STOP_LOADING_ANIMATION)
        );
        const twice = reducer(once, act(ActionsTypes.STOP_LOADING_ANIMATION));
        expect(twice.sessionState).toEqual(once.sessionState);
    });
});

describe("root reducer - vehicles", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const newVehicle = (name: string) => ({
        id: "",
        vehicleName: name,
        passengers: 4,
        kind: "",
    });

    it("NEW_VEHICLE assigns the next id and syncs the sidur record", () => {
        const state = freezeCollections(buildStore());
        const maxId = Math.max(...state.vehicles.map((v) => Number(v.id)));
        const result = reducer(
            state,
            act(ActionsTypes.NEW_VEHICLE, { value: newVehicle("unique-car") })
        );
        expect(result.vehicles).toHaveLength(state.vehicles.length + 1);
        expect(result.vehicles.at(-1)!.id).toBe(String(maxId + 1));
        expect(result.sidurCollection[0].vehicles).toHaveLength(
            result.vehicles.length
        );
        expect(state.vehicles).toHaveLength(result.vehicles.length - 1);
        expect(result.orders).toBe(state.orders);
    });

    it("NEW_VEHICLE appends the id to a duplicate name", () => {
        const state = buildStore();
        const dup = state.vehicles[0].vehicleName;
        const result = reducer(
            state,
            act(ActionsTypes.NEW_VEHICLE, { value: newVehicle(dup) })
        );
        const added = result.vehicles.at(-1)!;
        expect(added.vehicleName).toBe(`${dup} ${added.id}`);
    });

    it("UPDATE_VEHICLE replaces by id and keeps others", () => {
        const state = freezeCollections(buildStore());
        const target = state.vehicles[1];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_VEHICLE, {
                value: { ...target, vehicleName: "renamed" },
            })
        );
        expect(result.vehicles[1].vehicleName).toBe("renamed");
        expect(result.vehicles[0]).toBe(state.vehicles[0]);
        expect(state.vehicles[1].vehicleName).toBe(target.vehicleName);
    });

    it("UPDATE_VEHICLE appends the id when the name collides with another vehicle", () => {
        const state = buildStore();
        const target = state.vehicles[1];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_VEHICLE, {
                value: {
                    ...target,
                    vehicleName: state.vehicles[0].vehicleName,
                },
            })
        );
        expect(result.vehicles[1].vehicleName).toBe(
            `${state.vehicles[0].vehicleName} ${target.id}`
        );
    });

    it("UPDATE_VEHICLE with id 0 gets a fresh id", () => {
        const state = buildStore();
        state.vehicles = [
            ...state.vehicles,
            { ...state.vehicles[0], id: "0", vehicleName: "zero" },
        ];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_VEHICLE, {
                value: { ...state.vehicles.at(-1)!, vehicleName: "zero2" },
            })
        );
        expect(result.vehicles.at(-1)!.id).not.toBe("0");
    });

    it("UPDATE_VEHICLE without a vehicle leaves vehicles unchanged", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_VEHICLE, { value: undefined })
        );
        expect(result.vehicles).toEqual(state.vehicles);
    });

    it("DELETE_VEHICLE removes by id", () => {
        const state = freezeCollections(buildStore());
        const id = state.vehicles[0].id;
        const result = reducer(state, act(ActionsTypes.DELETE_VEHICLE, { id }));
        expect(result.vehicles.map((v) => v.id)).not.toContain(id);
        expect(result.vehicles).toHaveLength(state.vehicles.length - 1);
    });

    it("DELETE_VEHICLE with an unknown id changes nothing", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_VEHICLE, { id: "nope" })
        );
        expect(result.vehicles).toEqual(state.vehicles);
    });
});
