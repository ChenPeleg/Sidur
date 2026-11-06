import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ActionsTypes } from "../../src/store/types.actions";
import { SidurReducer } from "../../src/store/sidur.reducer";
import { OrderReducer } from "../../src/store/order.reducer";
import { ImportExportReducer } from "../../src/store/import-export.reducer";
import { VehicleReducer } from "../../src/store/vehicle.reducer";
import { DisplayReducer } from "../../src/store/display.reducer";
import { SketchReducer } from "../../src/store/sketch.reducer";
import { PendingOrdersReducer } from "../../src/store/pendingOrders.reducer";
import { SketchDriveReducer } from "../../src/store/sketch-drive.reducer";
import { LocationGroupReducer } from "../../src/store/locationGroup.reducer";
import { LocationReducer } from "../../src/store/location.reducer";
import { RouteReducer } from "../../src/store/route.reducer";
import { TransportReducer } from "../../src/store/transport.reducer";
import staticReducer from "../../src/store/reducer";
import { buildStore } from "./helpers/build-store";
import { IAction } from "../../src/store/store.types";

const domainMaps: Record<string, unknown>[] = [
    SidurReducer,
    OrderReducer,
    ImportExportReducer,
    VehicleReducer,
    DisplayReducer,
    SketchReducer,
    PendingOrdersReducer,
    SketchDriveReducer,
    LocationGroupReducer,
    LocationReducer,
    RouteReducer,
    TransportReducer,
];

const unroutedActions: string[] = [ActionsTypes.OPEN_MY_PROFILE];

describe("root reducer routing", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it("uses the default state when state is undefined", async () => {
        vi.resetModules();
        const { default: reducer } = await import("../../src/store/reducer");
        const result = reducer(undefined, {
            type: ActionsTypes.OPEN_MY_PROFILE,
            payload: {},
        } as IAction);
        expect(result.orders.length).toBeGreaterThan(0);
        expect(result.sidurCollection.length).toBe(1);
    });

    it("uses the saved localStorage state when present", async () => {
        vi.resetModules();
        const saved = buildStore({ sidurId: "saved-marker" });
        const { SaveLoadService } =
            await import("../../src/services/save-load.service");
        const { StoreUtils } = await import("../../src/store/store-utils");
        SaveLoadService.saveToLocalStorage(
            StoreUtils.buildSaveDataModel(saved, "chen", "chen")
        );
        const { default: reducer } = await import("../../src/store/reducer");
        const result = reducer(undefined, {
            type: ActionsTypes.OPEN_MY_PROFILE,
            payload: {},
        } as IAction);
        expect(result.sidurId).toBe("saved-marker");
    });

    it("returns an equal but not identical state for an unknown action", () => {
        const reducer = staticReducer;
        const state = buildStore();
        const result = reducer(state, {
            type: "NOT_A_REAL_ACTION",
            payload: {},
        } as unknown as IAction);
        expect(result).toEqual(state);
        expect(result).not.toBe(state);
    });

    it("documents OPEN_MY_PROFILE as not routed", () => {
        const reducer = staticReducer;
        const state = buildStore();
        const result = reducer(state, {
            type: ActionsTypes.OPEN_MY_PROFILE,
            payload: {},
        } as IAction);
        expect(result).toEqual(state);
    });

    const routed = Object.values(ActionsTypes).filter(
        (t) => !unroutedActions.includes(t)
    );

    it.each(routed)("routes %s to exactly one domain reducer", (type) => {
        const reducer = staticReducer;
        const owners = domainMaps.filter((m) => type in m);
        expect(owners).toHaveLength(1);
        const spy = vi
            .spyOn(owners[0], type)
            .mockImplementation((s: unknown) => s);
        const state = buildStore();
        const action = { type, payload: {} } as IAction;
        const result = reducer(state, action);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(state, action);
        expect(spy.mock.calls[0][0]).not.toBe(state);
        expect(result).toBe(spy.mock.calls[0][0]);
    });
});
