import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { buildStore } from "./helpers/build-store";
import { stubPersistence } from "./helpers/setup";
import { act } from "./helpers/build-sketch";
import { SidurStore } from "../../src/store/store.types";

/** Builds a store with one top-level field forced to undefined. */
const without = (key: keyof SidurStore, state = buildStore()): SidurStore =>
    ({ ...state, [key]: undefined }) as unknown as SidurStore;

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

type StopsKey = "routeStops" | "TransportStops";
type CollectionKey = "Routes" | "Transports";
type IdInEditKey = "routeIdInEdit" | "transportIdInEdit";

const domains: {
    name: string;
    collection: CollectionKey;
    stops: StopsKey;
    idInEdit: IdInEditKey;
    ADD_NEW: ActionsTypes;
    START_EDIT: ActionsTypes;
    STOP_EDIT: ActionsTypes;
    UPDATE: ActionsTypes;
    DELETE: ActionsTypes;
    CLONE: ActionsTypes;
    ADD_LOCATION: ActionsTypes;
}[] = [
    {
        name: "routes",
        collection: "Routes",
        stops: "routeStops",
        idInEdit: "routeIdInEdit",
        ADD_NEW: ActionsTypes.ADD_NEW_ROUTE,
        START_EDIT: ActionsTypes.START_EDIT_ROUTE,
        STOP_EDIT: ActionsTypes.STOP_EDIT_ROUTE,
        UPDATE: ActionsTypes.UPDATE_ROUTE,
        DELETE: ActionsTypes.DELETE_ROUTE,
        CLONE: ActionsTypes.CLONE_ROUTE,
        ADD_LOCATION: ActionsTypes.ADD_LOCATION_TO_ROUTE,
    },
    {
        name: "transports",
        collection: "Transports",
        stops: "TransportStops",
        idInEdit: "transportIdInEdit",
        ADD_NEW: ActionsTypes.ADD_NEW_TRANSPORT,
        START_EDIT: ActionsTypes.START_EDIT_TRANSPORT,
        STOP_EDIT: ActionsTypes.STOP_EDIT_TRANSPORT,
        UPDATE: ActionsTypes.UPDATE_TRANSPORT,
        DELETE: ActionsTypes.DELETE_TRANSPORT,
        CLONE: ActionsTypes.CLONE_TRANSPORT,
        ADD_LOCATION: ActionsTypes.ADD_LOCATION_TO_TRANSPORT,
    },
];

describe.each(domains)("root reducer - $name guard branches", (d) => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const stateWithGroup = () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = state.LocationGroups[0].id;
        return state;
    };
    type Item = { id: string; name: string } & Record<
        StopsKey,
        { position: number }[]
    >;
    const itemsOf = (s: ReturnType<typeof buildStore>) =>
        groupOf(s)[d.collection] as unknown as Item[];

    describe("with no location group in edit", () => {
        const noGroup = () => {
            const state = buildStore();
            state.sessionState.locationGroupInEdit = null;
            return state;
        };
        const firstId = () => buildStore().LocationGroups[0][d.collection][0];

        it.each([
            ["ADD_NEW", () => ({})],
            ["START_EDIT", () => ({ id: firstId().id })],
            ["UPDATE", () => ({ ...firstId(), comments: "x" })],
            ["DELETE", () => ({ id: firstId().id })],
            ["CLONE", () => ({ id: firstId().id })],
            ["ADD_LOCATION", () => ({ id: "1" })],
        ] as const)(
            "%s leaves the location groups unchanged",
            (key, payload) => {
                const state = noGroup();
                const before = structuredClone(state.LocationGroups);
                const result = reducer(state, act(d[key], payload()));
                expect(result.LocationGroups).toEqual(before);
                expect(result.sessionState[d.idInEdit]).toBe(
                    state.sessionState[d.idInEdit]
                );
            }
        );

        it("STOP_EDIT keeps locationMainInEdit", () => {
            const state = noGroup();
            state.sessionState.locationMainInEdit = "keep";
            const result = reducer(state, act(d.STOP_EDIT));
            expect(result.sessionState.locationMainInEdit).toBe("keep");
        });
    });

    describe("with an unknown id", () => {
        it.each(["DELETE", "CLONE"] as const)(
            "%s leaves the collection unchanged",
            (key) => {
                const state = stateWithGroup();
                const before = structuredClone(itemsOf(state));
                const result = reducer(state, act(d[key], { id: "nope" }));
                expect(itemsOf(result)).toEqual(before);
            }
        );

        it("START_EDIT does not change the item in edit", () => {
            const state = stateWithGroup();
            state.sessionState[d.idInEdit] = "keep";
            const result = reducer(state, act(d.START_EDIT, { id: "nope" }));
            expect(result.sessionState[d.idInEdit]).toBe("keep");
        });

        it("ADD_LOCATION with an unknown item in edit changes nothing", () => {
            const state = stateWithGroup();
            state.sessionState[d.idInEdit] = "nope";
            const before = structuredClone(itemsOf(state));
            const result = reducer(state, act(d.ADD_LOCATION, { id: "1" }));
            expect(itemsOf(result)).toEqual(before);
        });

        it("ADD_LOCATION without a location payload changes nothing", () => {
            const state = stateWithGroup();
            state.sessionState[d.idInEdit] = itemsOf(state)[0].id;
            const before = structuredClone(itemsOf(state));
            const result = reducer(state, act(d.ADD_LOCATION, null));
            expect(itemsOf(result)).toEqual(before);
        });

        // Known issue: the "before update" lookup is cast to the model and
        // dereferenced, so an unknown id throws instead of being ignored.
        it.fails(
            "UPDATE leaves the collection unchanged (known issue: throws)",
            () => {
                const state = stateWithGroup();
                const before = structuredClone(itemsOf(state));
                const result = reducer(
                    state,
                    act(d.UPDATE, { ...itemsOf(state)[0], id: "nope" })
                );
                expect(itemsOf(result)).toEqual(before);
            }
        );
    });

    // Known issue: deleting the item in edit leaves a dangling id in the
    // session state.
    it.fails(
        "DELETE of the item in edit clears the id in edit (known issue)",
        () => {
            const state = stateWithGroup();
            const id = itemsOf(state)[0].id;
            state.sessionState[d.idInEdit] = id;
            const result = reducer(state, act(d.DELETE, { id }));
            expect(result.sessionState[d.idInEdit]).toBeNull();
        }
    );

    describe("auto-built names", () => {
        const fresh = () => {
            const added = reducer(stateWithGroup(), act(d.ADD_NEW));
            return added;
        };
        const inEdit = (s: ReturnType<typeof buildStore>) =>
            itemsOf(s).find((x) => x.id === s.sessionState[d.idInEdit])!;
        const locName = (s: ReturnType<typeof buildStore>, id: string) =>
            groupOf(s).Locations.find((l) => l.id === id)!.name;

        it("ADD_LOCATION rebuilds the name for 1, 2-3 and 4+ stops", () => {
            let state = fresh();
            const id = inEdit(state).id;
            const empty = inEdit(state).name;
            expect(empty.endsWith(" " + id)).toBe(true);

            state = reducer(state, act(d.ADD_LOCATION, { id: "1" }));
            expect(inEdit(state).name).toBe(
                empty + " - " + locName(state, "1")
            );

            state = reducer(state, act(d.ADD_LOCATION, { id: "2" }));
            expect(inEdit(state).name).toBe(
                [locName(state, "1"), locName(state, "2")].join(" - ")
            );

            state = reducer(state, act(d.ADD_LOCATION, { id: "3" }));
            state = reducer(state, act(d.ADD_LOCATION, { id: "4" }));
            // first, middle (index 2) and last of four stops
            expect(inEdit(state).name).toBe(
                [
                    locName(state, "1"),
                    locName(state, "3"),
                    locName(state, "4"),
                ].join(" - ")
            );
            expect(inEdit(state)[d.stops].map((s) => s.position)).toEqual([
                1, 2, 3, 4,
            ]);
        });

        it("ADD_LOCATION keeps a custom name", () => {
            let state = fresh();
            inEdit(state).name = "custom";
            state = reducer(state, act(d.ADD_LOCATION, { id: "1" }));
            expect(inEdit(state).name).toBe("custom");
        });

        it("UPDATE rebuilds an auto-built name when the stops change", () => {
            const state = fresh();
            const item = inEdit(state);
            const result = reducer(
                state,
                act(d.UPDATE, {
                    ...item,
                    [d.stops]: [
                        { locationId: "1", minutesFromLast: 20, position: 1 },
                        {
                            locationId: "unknown",
                            minutesFromLast: 20,
                            position: 2,
                        },
                    ],
                })
            );
            // an unknown location id renders as a blank name
            expect(inEdit(result).name).toBe(locName(state, "1") + " -  ");
        });

        it("UPDATE keeps a name the user changed", () => {
            const state = fresh();
            const item = inEdit(state);
            const result = reducer(
                state,
                act(d.UPDATE, { ...item, name: "mine", [d.stops]: [] })
            );
            expect(inEdit(result).name).toBe("mine");
        });
    });
});

describe("root reducer - location group guard branches", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const withThreeGroups = () => {
        let state = buildStore();
        state = reducer(state, act(ActionsTypes.NEW_LOCATION_GROUP));
        state = reducer(state, act(ActionsTypes.NEW_LOCATION_GROUP));
        return state;
    };

    it("RENAME_LOCATION_GROUP accepts an empty name (no guard)", () => {
        const state = buildStore();
        const id = state.LocationGroups[0].id;
        const result = reducer(
            state,
            act(ActionsTypes.RENAME_LOCATION_GROUP, { id, value: "" })
        );
        expect(result.LocationGroups[0].name).toBe("");
    });

    it("RENAME_LOCATION_GROUP with an unknown id changes no group", () => {
        const state = buildStore();
        const before = structuredClone(state.LocationGroups);
        const result = reducer(
            state,
            act(ActionsTypes.RENAME_LOCATION_GROUP, { id: "nope", value: "x" })
        );
        expect(result.LocationGroups).toEqual(before);
    });

    it("DELETE_LOCATION_GROUP of a non-selected group keeps the first selected group", () => {
        const state = withThreeGroups();
        const [first, second] = state.LocationGroups;
        state.sessionState.locationGroupInEdit = first.id;
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION_GROUP, { id: second.id })
        );
        expect(result.LocationGroups.map((g) => g.id)).not.toContain(second.id);
        expect(result.sessionState.locationGroupInEdit).toBe(first.id);
    });

    // Known issue: the selection always jumps to the first remaining group.
    it.fails(
        "DELETE_LOCATION_GROUP of a non-selected group keeps any selection (known issue)",
        () => {
            const state = withThreeGroups();
            const [first, , third] = state.LocationGroups;
            state.sessionState.locationGroupInEdit = third.id;
            const result = reducer(
                state,
                act(ActionsTypes.DELETE_LOCATION_GROUP, { id: first.id })
            );
            expect(result.sessionState.locationGroupInEdit).toBe(third.id);
        }
    );

    it("DELETE_LOCATION_GROUP with an unknown id keeps all groups", () => {
        const state = withThreeGroups();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION_GROUP, { id: "nope" })
        );
        expect(result.LocationGroups).toHaveLength(3);
    });

    it("DELETE_LOCATION_GROUP of the only group clears the selection", () => {
        const state = buildStore();
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION_GROUP, {
                id: state.LocationGroups[0].id,
            })
        );
        expect(result.LocationGroups).toEqual([]);
        expect(result.sessionState.locationGroupInEdit).toBeNull();
    });

    it("UPDATE_LOCATION_GROUP and NEW_LOCATION_GROUP tolerate a missing LocationGroups list", () => {
        const state = without("LocationGroups");
        const updated = reducer(state, act(ActionsTypes.UPDATE_LOCATION_GROUP));
        expect(updated.LocationGroups).toEqual([]);
        const added = reducer(
            without("LocationGroups"),
            act(ActionsTypes.NEW_LOCATION_GROUP)
        );
        expect(added.LocationGroups).toHaveLength(1);
        expect(added.sessionState.locationGroupInEdit).toBe("1");
    });

    it("DELETE_LOCATION_GROUP and RENAME_LOCATION_GROUP tolerate a missing LocationGroups list", () => {
        const deleted = reducer(
            without("LocationGroups"),
            act(ActionsTypes.DELETE_LOCATION_GROUP, { id: "1" })
        );
        expect(deleted.LocationGroups).toEqual([]);
        expect(deleted.sessionState.locationGroupInEdit).toBeNull();
        const renamed = reducer(
            without("LocationGroups"),
            act(ActionsTypes.RENAME_LOCATION_GROUP, { id: "1", value: "x" })
        );
        expect(renamed.LocationGroups).toEqual([]);
    });

    it("CHOOSE_LOCATION_GROUP_TAB creates a default session when missing", () => {
        const result = reducer(
            without("sessionState"),
            act(ActionsTypes.CHOOSE_LOCATION_GROUP_TAB, { id: "3" })
        );
        expect(result.sessionState.LocationGroupTabOpen).toBe("3");
        expect(result.sessionState.orderIdInEdit).toBeNull();
    });
});

describe("root reducer - location guard branches", () => {
    beforeEach(() => stubPersistence());
    afterEach(() => vi.restoreAllMocks());

    const missingGroup = () => {
        const state = buildStore();
        state.sessionState.locationGroupInEdit = "missing";
        return state;
    };

    it("UPDATE_LOCATION with a missing group in edit changes nothing", () => {
        const state = missingGroup();
        const before = structuredClone(state.LocationGroups);
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_LOCATION, {
                ...state.LocationGroups[0].Locations[0],
                name: "x",
            })
        );
        expect(result.LocationGroups).toEqual(before);
    });

    it("DELETE_LOCATION with a missing group in edit changes nothing", () => {
        const state = missingGroup();
        const before = structuredClone(state.LocationGroups);
        const result = reducer(
            state,
            act(ActionsTypes.DELETE_LOCATION, { id: "1" })
        );
        expect(result.LocationGroups).toEqual(before);
    });

    it("START_EDIT_LOCATION with a missing group still records the id", () => {
        const result = reducer(
            missingGroup(),
            act(ActionsTypes.START_EDIT_LOCATION, { id: "7" })
        );
        expect(result.sessionState.locationMainInEdit).toBe("7");
    });

    it("STOP_EDIT_LOCATION with a missing group keeps the location in edit", () => {
        const state = missingGroup();
        state.sessionState.locationMainInEdit = "7";
        const result = reducer(state, act(ActionsTypes.STOP_EDIT_LOCATION));
        expect(result.sessionState.locationMainInEdit).toBe("7");
    });

    it("UPDATE_LOCATION on a group that is not the sidur's leaves Locations alone", () => {
        let state = buildStore();
        state = reducer(state, act(ActionsTypes.NEW_LOCATION_GROUP));
        state = reducer(state, act(ActionsTypes.ADD_NEW_LOCATION));
        const locationsBefore = state.Locations;
        const loc = groupOf(state).Locations[0];
        const result = reducer(
            state,
            act(ActionsTypes.UPDATE_LOCATION, { ...loc, name: "other" })
        );
        expect(groupOf(result).Locations[0].name).toBe("other");
        expect(result.Locations).toBe(locationsBefore);
    });
});
