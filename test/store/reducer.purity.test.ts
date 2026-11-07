import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/import-orders-from-text", () => ({
    ImportOrdersFromText: vi.fn(() => []),
    validateImportedData: vi.fn(),
}));
vi.mock("../../src/services/download-file", () => ({
    DownloadFile: vi.fn(),
}));

import reducer from "../../src/store/reducer";
import { ActionsTypes } from "../../src/store/types.actions";
import { stubPersistence } from "./helpers/setup";
import {
    act,
    buildFixtureSketch,
    buildStoreWithSketch,
    driveOf,
    FIXTURE,
} from "./helpers/build-sketch";
import { expectInputUntouched, snapshot } from "./helpers/purity";
import {
    FileUploadType,
    IAction,
    SidurStore,
} from "../../src/store/store.types";
import { StoreUtils } from "../../src/store/store-utils";
import { buildStore } from "./helpers/build-store";
import * as downloads from "../../src/services/downloadFile";

/**
 * A rich input: current sidur "5" with sketches "1" (in edit) and "2", a
 * pending order in edit, an inactive sidur "6" and an archived sidur "Arch7".
 */
const base = (): SidurStore => {
    const state = buildStoreWithSketch({
        pendingOrderIdInEdit: FIXTURE.pendingOverlapping,
    });
    state.sketches.push({ ...buildFixtureSketch(), id: "2", name: "two" });
    const first = state.sidurCollection[0];
    first.sketches = structuredClone(state.sketches);
    state.sidurCollection.push({
        ...structuredClone(first),
        id: "6",
        Name: "second",
    });
    state.sidurArchive = [
        { ...structuredClone(first), id: "Arch7", Name: "archived" },
    ];
    const group = state.LocationGroups[0];
    state.sessionState.locationGroupInEdit = group.id;
    state.sessionState.routeIdInEdit = group.Routes[0].id;
    state.sessionState.transportIdInEdit = group.Transports[0].id;
    state.sessionState.dataHolderForCurrentOrderInEdit = {
        ...state.orders[0],
        driverName: "edited",
    };
    return state;
};

type Row = [ActionsTypes, (s: SidurStore) => IAction["payload"]];

const group = (s: SidurStore) => s.LocationGroups[0];

const rows: Row[] = [
    // sidur
    [ActionsTypes.CHOOSE_SIDUR, () => ({ id: "6" })],
    [ActionsTypes.RENAME_SIDUR, () => ({ id: "6", value: "renamed" })],
    [ActionsTypes.ADD_NEW_SIDUR, () => ({})],
    [ActionsTypes.DELETE_SIDUR, () => ({ id: "6" })],
    [ActionsTypes.CLONE_SIDUR, () => ({ id: "5" })],
    [ActionsTypes.ARCHIVE_SIDUR, () => ({ id: "6" })],
    [ActionsTypes.MOVE_TO_ACTIVE_SIDUR, () => ({ id: "Arch7" })],
    [ActionsTypes.DELETE_FOREVER_SIDUR, () => ({ id: "Arch7" })],
    [ActionsTypes.CHANGE_SIDUR_LOCATION_GROUP, (s) => ({ id: group(s).id })],
    // orders
    [ActionsTypes.CLICKED_ORDER, (s) => ({ id: s.orders[1].id })],
    [ActionsTypes.UPDATE_ORDER, (s) => ({ id: s.orders[0].id })],
    [
        ActionsTypes.UPDATE_ORDER_IN_EDIT,
        (s) => ({ ...s.orders[0], driverName: "x" }),
    ],
    [ActionsTypes.DELETE_ORDER, (s) => ({ id: s.orders[0].id })],
    [ActionsTypes.ADD_NEW_ORDER, () => ({})],
    [ActionsTypes.CLONE_ORDER, (s) => ({ id: s.orders[0].id })],
    // import / export
    [ActionsTypes.EXPORT_ALL, () => ({})],
    [
        ActionsTypes.IMPORT_FILE_UPLOADED,
        () => ({
            uploadType: FileUploadType.uploadFullDataAndAdd,
            fileAsString: JSON.stringify(
                StoreUtils.buildSaveDataModel(buildStore({ sidurId: "up" }))
            ),
        }),
    ],
    [ActionsTypes.IMPORT_ORDERS_AS_TEXT, () => ({ importedOrders: "" })],
    [ActionsTypes.OPEN_IMPORT_SHEETS_MODAL, () => ({})],
    [ActionsTypes.CLOSE_IMPORT_SHEETS_MODAL, () => ({})],
    [ActionsTypes.IMPORT_SHEETS_DATA_PASTE, () => "text"],
    [ActionsTypes.APPROVE_IMPORT_SHEETS_DATA, () => "text"],
    // vehicles
    [
        ActionsTypes.NEW_VEHICLE,
        (s) => ({ value: { ...s.vehicles[0], id: "99" } }),
    ],
    [
        ActionsTypes.UPDATE_VEHICLE,
        (s) => ({ value: { ...s.vehicles[0], vehicleName: "x" } }),
    ],
    [ActionsTypes.DELETE_VEHICLE, (s) => ({ id: s.vehicles[0].id })],
    // display
    [ActionsTypes.CHANGE_VIEW, () => ({ value: "orders" })],
    [ActionsTypes.START_LOADING_ANIMATION, () => ({})],
    [ActionsTypes.STOP_LOADING_ANIMATION, () => ({})],
    // sketches
    [ActionsTypes.NEW_SKETCH, () => ({})],
    [ActionsTypes.CHOOSE_SKETCH, () => ({ id: "2" })],
    [ActionsTypes.CLONE_SKETCH, () => ({ id: "1" })],
    [ActionsTypes.RENAME_SKETCH, () => ({ id: "1", value: "renamed" })],
    [ActionsTypes.DELETE_SKETCH, () => ({ id: "2" })],
    [ActionsTypes.DOWNLOAD_SKETCH, () => ({ id: "1" })],
    // pending orders
    [ActionsTypes.CLICKED_PENDING_ORDER, () => ({ id: FIXTURE.pendingLonely })],
    [ActionsTypes.CLICKED_CLOSE_PENDING_ORDER, () => ({})],
    [
        ActionsTypes.CLICKED_REMOVE_PENDING_ORDER,
        () => ({ id: FIXTURE.pendingOverlapping }),
    ],
    [ActionsTypes.CLICKED_MERGE_PENDING_ORDER, () => ({})],
    [
        ActionsTypes.CLICKED_SPLIT_PENDING_ORDER,
        () => ({ id: FIXTURE.pendingTsamud }),
    ],
    [ActionsTypes.CLICKED_CHANGE_PENDING_ORDER, () => ({})],
    [ActionsTypes.CLICKED_CHANGE_TIME_PENDING_ORDER, () => ({})],
    [ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER, () => ({})],
    [
        ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER,
        () => ({ id: FIXTURE.pendingLonely }),
    ],
    [ActionsTypes.CLICKED_ADD_TO_PENDING_PENDING_ORDER, () => ({})],
    [ActionsTypes.REMOVE_PENDING_ORDER_STATUS, () => ({})],
    [
        ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER,
        () => ({ id: FIXTURE.pendingLonely }),
    ],
    [
        ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER,
        () => ({ id: FIXTURE.pendingOverlapping }),
    ],
    [ActionsTypes.CLICKED_ADD_TO_VEHICLE_PENDING_ORDER, () => ({})],
    // sketch drives
    [
        ActionsTypes.DELETE_SKETCH_DRIVE,
        (s) => ({ value: { ...driveOf(s, FIXTURE.drive10) } }),
    ],
    [
        ActionsTypes.UPDATE_SKETCH_DRIVE,
        (s) => ({
            value: { ...driveOf(s, FIXTURE.drive10), startHour: "16:00" },
        }),
    ],
    [
        ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE,
        () => ({ sketchDriveId: FIXTURE.drive14, orderId: "202" }),
    ],
    [
        ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER,
        (s) => ({
            value: {
                ...driveOf(s, FIXTURE.drive14),
                implementsOrders: ["202", FIXTURE.pendingOverlapping],
            },
        }),
    ],
    [
        ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER,
        (s) => ({ value: { ...driveOf(s, FIXTURE.drive10) } }),
    ],
    [
        ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER,
        () => ({ value: FIXTURE.vehicle1 }),
    ],
    // location groups
    [ActionsTypes.UPDATE_LOCATION_GROUP, () => ({})],
    [ActionsTypes.DELETE_LOCATION_GROUP, (s) => ({ id: group(s).id })],
    [ActionsTypes.NEW_LOCATION_GROUP, () => ({})],
    [ActionsTypes.CLONE_LOCATION_GROUP, (s) => ({ id: group(s).id })],
    [
        ActionsTypes.RENAME_LOCATION_GROUP,
        (s) => ({ id: group(s).id, value: "renamed" }),
    ],
    [ActionsTypes.CHOOSE_LOCATION_GROUP, () => ({ id: "other" })],
    [ActionsTypes.CHOOSE_LOCATION_GROUP_TAB, () => ({ id: "2" })],
    // locations
    [ActionsTypes.ADD_NEW_LOCATION, () => ({})],
    [ActionsTypes.START_EDIT_LOCATION, () => ({ id: "3" })],
    [ActionsTypes.STOP_EDIT_LOCATION, () => ({})],
    [
        ActionsTypes.UPDATE_LOCATION,
        (s) => ({ ...group(s).Locations[0], name: "x" }),
    ],
    [ActionsTypes.DELETE_LOCATION, (s) => ({ id: group(s).Locations[0].id })],
    // routes
    [ActionsTypes.ADD_NEW_ROUTE, () => ({})],
    [ActionsTypes.START_EDIT_ROUTE, (s) => ({ id: group(s).Routes[1].id })],
    [ActionsTypes.STOP_EDIT_ROUTE, () => ({})],
    [
        ActionsTypes.UPDATE_ROUTE,
        (s) => ({ ...structuredClone(group(s).Routes[0]), comments: "x" }),
    ],
    [ActionsTypes.DELETE_ROUTE, (s) => ({ id: group(s).Routes[0].id })],
    [ActionsTypes.ADD_LOCATION_TO_ROUTE, () => ({ id: "1" })],
    [ActionsTypes.CLONE_ROUTE, (s) => ({ id: group(s).Routes[0].id })],
    // transports
    [ActionsTypes.ADD_NEW_TRANSPORT, () => ({})],
    [
        ActionsTypes.START_EDIT_TRANSPORT,
        (s) => ({ id: group(s).Transports[1].id }),
    ],
    [ActionsTypes.STOP_EDIT_TRANSPORT, () => ({})],
    [
        ActionsTypes.UPDATE_TRANSPORT,
        (s) => ({
            ...structuredClone(group(s).Transports[0]),
            comments: "x",
        }),
    ],
    [ActionsTypes.DELETE_TRANSPORT, (s) => ({ id: group(s).Transports[0].id })],
    [ActionsTypes.ADD_LOCATION_TO_TRANSPORT, () => ({ id: "1" })],
    [ActionsTypes.CLONE_TRANSPORT, (s) => ({ id: group(s).Transports[0].id })],
];

/**
 * Actions that mutate their input today. Each is a known impurity (shallow
 * `{ ...state }` copy followed by in-place writes to `sessionState`, sketch
 * objects, location groups or sidur records, or `sortVehicleByStartHour`
 * sorting in place). Fixing one turns its row red: remove it from this set.
 */
const KNOWN_TO_MUTATE = new Set<ActionsTypes>([
    ActionsTypes.CHOOSE_SIDUR,
    ActionsTypes.ADD_NEW_SIDUR,
    ActionsTypes.DELETE_SIDUR,
    ActionsTypes.CLONE_SIDUR,
    ActionsTypes.ARCHIVE_SIDUR,
    ActionsTypes.MOVE_TO_ACTIVE_SIDUR,
    ActionsTypes.CLICKED_ORDER,
    ActionsTypes.UPDATE_ORDER,
    ActionsTypes.UPDATE_ORDER_IN_EDIT,
    ActionsTypes.DELETE_ORDER,
    ActionsTypes.OPEN_IMPORT_SHEETS_MODAL,
    ActionsTypes.CLOSE_IMPORT_SHEETS_MODAL,
    ActionsTypes.NEW_SKETCH,
    ActionsTypes.CHOOSE_SKETCH,
    ActionsTypes.CLONE_SKETCH,
    ActionsTypes.RENAME_SKETCH,
    ActionsTypes.DELETE_SKETCH,
    ActionsTypes.CLICKED_PENDING_ORDER,
    ActionsTypes.CLICKED_CLOSE_PENDING_ORDER,
    ActionsTypes.CLICKED_REMOVE_PENDING_ORDER,
    ActionsTypes.CLICKED_MERGE_PENDING_ORDER,
    ActionsTypes.CLICKED_SPLIT_PENDING_ORDER,
    ActionsTypes.CLICKED_REPLACE_EXISTING_PENDING_ORDER,
    ActionsTypes.CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER,
    ActionsTypes.CLICKED_MOVE_TO_TOP_PENDING_ORDER,
    ActionsTypes.CLICKED_MOVE_TO_BOTTOM_PENDING_ORDER,
    ActionsTypes.CLICKED_ADD_TO_VEHICLE_PENDING_ORDER,
    ActionsTypes.DELETE_SKETCH_DRIVE,
    ActionsTypes.UPDATE_SKETCH_DRIVE,
    ActionsTypes.REMOVE_ORDER_FROM_SKETCH_DRIVE,
    ActionsTypes.UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER,
    ActionsTypes.REPLACE_SKETCH_DRIVE_WITH_ORDER,
    ActionsTypes.ADD_SKETCH_DRIVE_FROM_PENDING_ORDER,
    ActionsTypes.DELETE_LOCATION_GROUP,
    ActionsTypes.NEW_LOCATION_GROUP,
    ActionsTypes.CLONE_LOCATION_GROUP,
    ActionsTypes.CHOOSE_LOCATION_GROUP,
    ActionsTypes.ADD_NEW_LOCATION,
    ActionsTypes.START_EDIT_LOCATION,
    ActionsTypes.STOP_EDIT_LOCATION,
    ActionsTypes.UPDATE_LOCATION,
    ActionsTypes.DELETE_LOCATION,
    ActionsTypes.ADD_NEW_ROUTE,
    ActionsTypes.START_EDIT_ROUTE,
    ActionsTypes.STOP_EDIT_ROUTE,
    ActionsTypes.UPDATE_ROUTE,
    ActionsTypes.DELETE_ROUTE,
    ActionsTypes.ADD_LOCATION_TO_ROUTE,
    ActionsTypes.CLONE_ROUTE,
    ActionsTypes.ADD_NEW_TRANSPORT,
    ActionsTypes.START_EDIT_TRANSPORT,
    ActionsTypes.STOP_EDIT_TRANSPORT,
    ActionsTypes.UPDATE_TRANSPORT,
    ActionsTypes.DELETE_TRANSPORT,
    ActionsTypes.ADD_LOCATION_TO_TRANSPORT,
    ActionsTypes.CLONE_TRANSPORT,
]);

describe("root reducer - purity (input is never mutated)", () => {
    beforeEach(() => {
        stubPersistence();
        vi.spyOn(downloads, "DownloadCSVFile").mockImplementation(
            () => undefined
        );
    });
    afterEach(() => vi.restoreAllMocks());

    it("covers every routed action exactly once", () => {
        const unrouted: string[] = [ActionsTypes.OPEN_MY_PROFILE];
        const routed = Object.values(ActionsTypes).filter(
            (t) => !unrouted.includes(t)
        );
        const covered = rows.map(([type]) => type);
        expect(new Set(covered).size).toBe(covered.length);
        expect([...covered].sort()).toEqual([...routed].sort());
    });

    describe.each(rows)("%s", (type, payload) => {
        const test = KNOWN_TO_MUTATE.has(type) ? it.fails : it;
        test("leaves the input state untouched", () => {
            const state = base();
            const action = act(type, payload(state));
            const before = snapshot(state);
            reducer(state, action);
            expectInputUntouched(before, state);
        });
    });
});
