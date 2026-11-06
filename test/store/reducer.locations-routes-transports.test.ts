import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { IAction } from "../../src/store/store.types";

const act = (type: ActionsTypes, payload: IAction["payload"] = {}) =>
    ({ type, payload }) as IAction;

const groupOf = (s: ReturnType<typeof buildStore>) =>
    s.LocationGroups.find((g) => g.id === s.sessionState.locationGroupInEdit)!;

describe("root reducer - location groups", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    it("NEW_LOCATION_GROUP adds an empty group, selects it and updates briefs", () => {
        const state = buildStore();
        const result = reducer(state, act(ActionsTypes.NEW_LOCATION_GROUP));
        expect(result.LocationGroups).toHaveLength(
            state.LocationGroups.length + 1
        );
        const added = result.LocationGroups.at(-1)!;
        expect(added.Locations).toEqual([]);
        expect(result.sessionState.locationGroupInEdit).toBe(added.id);
        expect(result.recordBriefs.map((r) => r.id)).toContain(added.id);
    });

    it("CHOOSE_LOCATION_GROUP sets the group in edit", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.CHOOSE_LOCATION_GROUP, { id: "X" })
        );
        expect(result.sessionState.locationGroupInEdit).toBe("X");
    });

    it("CHOOSE_LOCATION_GROUP_TAB sets the open tab", () => {
        const result = reducer(
            buildStore(),
            act(ActionsTypes.CHOOSE_LOCATION_GROUP_TAB, { id: "2" })
        );
        expect(result.sessionState.LocationGroupTabOpen).toBe("2");
    });

    it("RENAME_LOCATION_GROUP renames only the matching group", () => {
        const state = buildStore();
        const id = state.LocationGroups[0].id;
        const result = reducer(
            state,
            act(ActionsTypes.RENAME_LOCATION_GROUP, { id, value: "renamed" })
        );
        expect(result.LocationGroups[0].name).toBe("renamed");
        expect(result.recordBriefs.find((r) => r.id === id)!.name).toBe(
            "renamed"
        );
    });

    it("CLONE_LOCATION_GROUP deep clones with a new id", () => {
        const state = buildStore();
        const source = state.LocationGroups[0];
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_LOCATION_GROUP, { id: source.id })
        );
        const copy = result.LocationGroups.at(-1)!;
        expect(copy.id).not.toBe(source.id);
        expect(copy.Locations).toEqual(source.Locations);
        expect(result.sessionState.locationGroupInEdit).toBe(copy.id);
    });

    // Known issue: CloneUtil.deepCloneLocationGroup reassigns the source's
    // Locations array, so the clone and the source share it.
    it.fails(
        "CLONE_LOCATION_GROUP does not share the Locations array (known issue)",
        () => {
            const state = buildStore();
            const result = reducer(
                state,
                act(ActionsTypes.CLONE_LOCATION_GROUP, {
                    id: state.LocationGroups[0].id,
                })
            );
            expect(result.LocationGroups.at(-1)!.Locations).not.toBe(
                result.LocationGroups[0].Locations
            );
        }
    );

    it("CLONE_LOCATION_GROUP with an unknown id adds nothing", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_LOCATION_GROUP, { id: "zz" })
        );
        expect(result.LocationGroups).toHaveLength(state.LocationGroups.length);
    });

    it("DELETE_LOCATION_GROUP removes the group and clears the edit selection when none remain", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION_GROUP, {
                id: state.LocationGroups[0].id,
            })
        );
        expect(result.LocationGroups).toHaveLength(0);
        expect(result.sessionState.locationGroupInEdit).toBeNull();
    });

    it("UPDATE_LOCATION_GROUP refreshes the record briefs", () => {
        const result = reducer(
            buildStore(),
            act(ActionsTypes.UPDATE_LOCATION_GROUP)
        );
        expect(result.recordBriefs.length).toBeGreaterThan(0);
    });
});

describe("root reducer - locations", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const stateWithGroup = () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = state.LocationGroups[0].id;
        return state;
    };

    it("ADD_NEW_LOCATION appends a location with the next id", () => {
        const state = stateWithGroup();
        const before = groupOf(state).Locations.length;
        const result = reducer(state, act(ActionsTypes.ADD_NEW_LOCATION));
        expect(groupOf(result).Locations).toHaveLength(before + 1);
    });

    it("ADD_NEW_LOCATION without a group in edit changes nothing", () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = null;
        const result = reducer(state, act(ActionsTypes.ADD_NEW_LOCATION));
        expect(result.LocationGroups).toEqual(state.LocationGroups);
    });

    it("START_EDIT_LOCATION and STOP_EDIT_LOCATION toggle the location in edit", () => {
        const started = reducer(
            stateWithGroup(),
            act(ActionsTypes.START_EDIT_LOCATION, { id: "3" })
        );
        expect(started.sessionState.locationMainInEdit).toBe("3");
        const stopped = reducer(started, act(ActionsTypes.STOP_EDIT_LOCATION));
        expect(stopped.sessionState.locationMainInEdit).toBeNull();
    });

    it("UPDATE_LOCATION replaces the location by id", () => {
        const state = stateWithGroup();
        const loc = groupOf(state).Locations[0];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_LOCATION, { ...loc, name: "updated" })
        );
        expect(groupOf(result).Locations[0].name).toBe("updated");
    });

    it("DELETE_LOCATION removes the location by id", () => {
        const state = stateWithGroup();
        const loc = groupOf(state).Locations[0];
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION, { id: loc.id })
        );
        expect(groupOf(result).Locations.map((l) => l.id)).not.toContain(
            loc.id
        );
    });

    it("DELETE_LOCATION with an unknown id changes nothing", () => {
        const state = stateWithGroup();
        const before = groupOf(state).Locations.length;
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION, { id: "nope" })
        );
        expect(groupOf(result).Locations).toHaveLength(before);
    });
});

describe("root reducer - routes", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const stateWithGroup = () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = state.LocationGroups[0].id;
        return state;
    };

    it("ADD_NEW_ROUTE appends a route and selects it", () => {
        const state = stateWithGroup();
        const before = groupOf(state).Routes.length;
        const result = reducer(state, act(ActionsTypes.ADD_NEW_ROUTE));
        expect(groupOf(result).Routes).toHaveLength(before + 1);
        expect(result.sessionState.routeIdInEdit).toBe(
            groupOf(result).Routes.at(-1)!.id
        );
    });

    it("START_EDIT_ROUTE and STOP_EDIT_ROUTE toggle the route in edit", () => {
        const state = stateWithGroup();
        const id = groupOf(state).Routes[0].id;
        const started = reducer(
            state,
            act(ActionsTypes.START_EDIT_ROUTE, { id })
        );
        expect(started.sessionState.routeIdInEdit).toBe(id);
        const stopped = reducer(started, act(ActionsTypes.STOP_EDIT_ROUTE));
        expect(stopped.sessionState.locationMainInEdit).toBeNull();
    });

    it("CLONE_ROUTE adds a copy of the route", () => {
        const state = stateWithGroup();
        const before = groupOf(state).Routes.length;
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_ROUTE, { id: groupOf(state).Routes[0].id })
        );
        expect(groupOf(result).Routes).toHaveLength(before + 1);
    });

    it("DELETE_ROUTE removes the route", () => {
        const state = stateWithGroup();
        const id = groupOf(state).Routes[0].id;
        const result = reducer(state, act(ActionsTypes.DELETE_ROUTE, { id }));
        expect(groupOf(result).Routes.map((r) => r.id)).not.toContain(id);
    });

    it("UPDATE_ROUTE stores the new comments", () => {
        const state = stateWithGroup();
        const route = groupOf(state).Routes[0];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_ROUTE, { ...route, comments: "note" })
        );
        expect(
            groupOf(result).Routes.find((r) => r.id === route.id)!.comments
        ).toBe("note");
    });

    it("ADD_LOCATION_TO_ROUTE appends a stop to the route in edit", () => {
        const state = stateWithGroup();
        const route = groupOf(state).Routes[0];
        state.sessionState.routeIdInEdit = route.id;
        const stops = route.routeStops.length;
        const result = reducer(
            state,
            act(ActionsTypes.ADD_LOCATION_TO_ROUTE, {
                id: groupOf(state).Locations[0].id,
            })
        );
        expect(
            groupOf(result).Routes.find((r) => r.id === route.id)!.routeStops
        ).toHaveLength(stops + 1);
    });
});

describe("root reducer - transports", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const stateWithGroup = () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = state.LocationGroups[0].id;
        return state;
    };

    it("ADD_NEW_TRANSPORT appends a transport and selects it", () => {
        const state = stateWithGroup();
        const before = groupOf(state).Transports.length;
        const result = reducer(state, act(ActionsTypes.ADD_NEW_TRANSPORT));
        expect(groupOf(result).Transports).toHaveLength(before + 1);
        expect(result.sessionState.transportIdInEdit).toBe(
            groupOf(result).Transports.at(-1)!.id
        );
    });

    it("START_EDIT_TRANSPORT and STOP_EDIT_TRANSPORT toggle the transport in edit", () => {
        const state = stateWithGroup();
        const id = groupOf(state).Transports[0].id;
        const started = reducer(
            state,
            act(ActionsTypes.START_EDIT_TRANSPORT, { id })
        );
        expect(started.sessionState.transportIdInEdit).toBe(id);
        const stopped = reducer(started, act(ActionsTypes.STOP_EDIT_TRANSPORT));
        expect(stopped.sessionState.locationMainInEdit).toBeNull();
    });

    it("CLONE_TRANSPORT adds a copy", () => {
        const state = stateWithGroup();
        const before = groupOf(state).Transports.length;
        const result = reducer(
            state,
            act(ActionsTypes.CLONE_TRANSPORT, {
                id: groupOf(state).Transports[0].id,
            })
        );
        expect(groupOf(result).Transports).toHaveLength(before + 1);
    });

    it("DELETE_TRANSPORT removes the transport", () => {
        const state = stateWithGroup();
        const id = groupOf(state).Transports[0].id;
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_TRANSPORT, { id })
        );
        expect(groupOf(result).Transports.map((t) => t.id)).not.toContain(id);
    });

    it("UPDATE_TRANSPORT stores the new comments", () => {
        const state = stateWithGroup();
        const transport = groupOf(state).Transports[0];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_TRANSPORT, {
                ...transport,
                comments: "note",
            })
        );
        expect(
            groupOf(result).Transports.find((t) => t.id === transport.id)!
                .comments
        ).toBe("note");
    });

    it("ADD_LOCATION_TO_TRANSPORT appends a stop to the transport in edit", () => {
        const state = stateWithGroup();
        const transport = groupOf(state).Transports[0];
        state.sessionState.transportIdInEdit = transport.id;
        const stops = transport.TransportStops.length;
        const result = reducer(
            state,
            act(ActionsTypes.ADD_LOCATION_TO_TRANSPORT, {
                id: groupOf(state).Locations[0].id,
            })
        );
        expect(
            groupOf(result).Transports.find((t) => t.id === transport.id)!
                .TransportStops
        ).toHaveLength(stops + 1);
    });
});
