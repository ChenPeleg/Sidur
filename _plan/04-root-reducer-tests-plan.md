# Root Reducer Tests Plan (Strategy B)

> Instruction: After you attempt or complete any step, immediately update its status emoji: ✅ (done), ⬜ (not done), ⚠️ (in progress).

Based on `03-redux-reducers-testing-plan.md`, using **Strategy B — test the whole reducer** through the exported root `reducer(state, action)` from `src/store/reducer.ts`. Domain reducers are exercised only through the root, so routing and behaviour are verified together.

## App logic under test

Sidur coordinates community transportation: **orders** (ride requests) are arranged into **sketches** (drive plans) for **vehicles**, inside a **sidur** (a schedule record).

### Root reducer (`reducer.ts`)

- `initialState` is built once at import: the saved store from `localStorage` (key `"chen"`, via `SaveLoadService`) or `DefaultSidurFetching`.
- `reducer(state = initialState, action)` shallow-copies the state, then a `switch` on `action.type` routes to a domain map (`SidurReducer`, `OrderReducer`, `ImportExportReducer`, `VehicleReducer`, `DisplayReducer`, `SketchReducer`, `PendingOrdersReducer`, `SketchDriveReducer`, `LocationGroupReducer`, `LocationReducer`, `RouteReducer`, `TransportReducer`).
- Unknown types (e.g. `OPEN_MY_PROFILE`, which is declared but not routed) fall through to `default` and return the shallow copy (equal, not identical, to the input).

### Domain behaviours worth asserting

| Domain  | Key rules                                                                                                                                                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Order   | `ADD_NEW_ORDER` unshifts a default order with `Utils.getNextId` over active **and** deleted ids (prefixes `Del`/`Arch` stripped). `CLONE_ORDER` inserts a copy right after the source with a new id; unknown id is a no-op. `CLICKED_ORDER` commits the order being edited, then sets `orderIdInEdit`. `UPDATE_ORDER_IN_EDIT` stores a draft in `sessionState.dataHolderForCurrentOrderInEdit`. `UPDATE_ORDER` replaces the order with the draft and clears draft and `orderIdInEdit`. `DELETE_ORDER` removes the order and clears draft/edit id if they point at it. |
| Vehicle | `NEW_VEHICLE` assigns next id; a duplicate `vehicleName` gets the id appended. `UPDATE_VEHICLE` replaces by id, same duplicate-name rule (excluding itself); id `"0"` gets a fresh id. `DELETE_VEHICLE` filters by id.                              |
| Sidur   | `CHOOSE_SIDUR` is a no-op for the current id; otherwise saves current orders/deletedOrders/sketches/vehicles into the previous record, loads the chosen record into the top-level state, and refreshes `recordBriefs`. `RENAME_SIDUR` ignores empty names. Also add, clone, delete (to archive), archive, move to active, delete forever, change location group. |
| Sketch  | `NEW_SKETCH` builds a sketch with `SidurBuilder` from the current sidur, gives it the next id, and sets `sketchIdInEdit`. Also choose, rename, clone, delete, download.                                                                              |
| Display | `CHANGE_VIEW` sets `displaySetting.view`; start/stop loading toggles `sessionState.isAnimationRunning`.                                                                                                                                              |
| Others  | Pending orders (select/merge/split/move/add to vehicle), sketch drives (update/delete/merge/replace/add from pending), location groups, locations, routes, transports (add/edit/update/delete/clone), import/export (modal, paste, approve, file upload). |

Most mutating actions also call `StoreUtils.UpdateSidurCollectionWithCurrenSidur` (sync top-level data into the current `SidurRecord`) and `HandleReducerSaveToLocalStorage` (persist).

### Known risk to guard

Several reducers shallow-copy the state and then mutate the nested `sessionState` (e.g. `UPDATE_ORDER_IN_EDIT`, `CLICKED_ORDER`, `NEW_SKETCH`). Tests should document this: for now assert on the returned state; if the input is deep-frozen, those actions throw, so freeze only the collections (`orders`, `vehicles`, `sidurCollection`, …) and treat `sessionState` mutation as a tracked known issue (`it.fails` / `it.todo`).

## Setup

1. ⬜ `test/store/helpers/build-store.ts`: `buildStore(partial?: Partial<SidurStore>)` returning a valid `SidurStore` from `DefaultSidurFetching` (deep-cloned per call) with one sidur in `sidurCollection` matching `sidurId`.
2. ⬜ `test/store/helpers/deep-freeze.ts`: `deepFreeze` for collections (see risk above).
3. ⬜ Import `reducer` after `localStorage.clear()` (`beforeEach` + `vi.resetModules()` + dynamic import where needed) so the initial state is the default.
4. ⬜ Determinism: `vi.mock` `StoreUtils.HandleReducerSaveToLocalStorage` (or spy on `SaveLoadService.saveToLocalStorage`); fake timers for date-based ids if encountered.

## Test files (all call only the root `reducer`)

Place in `test/store/`:

5. ⬜ `reducer.routing.test.ts`
   - Default state is used when `state` is `undefined`; saved `localStorage` state is used when present.
   - Unknown action returns an equal state.
   - Iterate every `ActionsTypes` value (except documented unrouted ones: `OPEN_MY_PROFILE`) and assert the reducer does not fall through, e.g. by spying on each domain map entry (`vi.spyOn(OrderReducer, type)`) and checking it was called once with `(state copy, action)`.
6. ⬜ `reducer.display-vehicle.test.ts`: display and vehicle rules above.
7. ⬜ `reducer.order.test.ts`: order rules above (add, clone, edit flow, update, delete, unknown id, deleted-id collision).
8. ⬜ `reducer.sidur.test.ts`: choose (same id, other id, unknown id), rename (empty), add, clone, delete, archive, move to active, delete forever, location group change.
9. ⬜ `reducer.sketch.test.ts`: new, choose, rename, clone, delete, download (mock `DownloadCSVFile`).
10. ⬜ `reducer.pending-orders-and-drives.test.ts`: pending-order and sketch-drive actions.
11. ⬜ `reducer.locations-routes-transports.test.ts`: location group, location, route, transport actions.
12. ⬜ `reducer.import-export.test.ts`: modal open/close, paste validation status, approve, file upload and text import (mock file/download services).
13. ⬜ One end-to-end sequence through the root reducer: add order → edit → update → new sketch → choose other sidur → back, asserting data is preserved.

## Conventions

- Test names describe behaviour, e.g. `"clones the order right after the source"`.
- Each test: arrange (`buildStore`) → act (`reducer(state, {type, payload})`) → assert; also assert untouched collections keep reference equality and the input collections are unchanged.
- Cover per action: happy path, unknown id / empty collection, and idempotency where relevant.

## Verify

14. ⬜ `npm test`, `npm run typecheck`, `npm run lint`.

## Success criteria

- Every routed `ActionsTypes` value is reached through the root reducer in at least one test (happy path plus an edge case).
- Routing test fails if a new action type is added without being wired.
- Tests are deterministic and pass in CI.
