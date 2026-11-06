# More Reducer Tests Plan (Strategy B, round 2)

> Instruction: After you attempt or complete any step, immediately update its status emoji: ✅ (done), ⬜ (not done), ⚠️ (in progress).

Follow-up to `04-root-reducer-tests-plan.md`. Plan 04 is complete: 9 files in `test/store/`, 184 passing tests + 3 `it.fails`, and every routed `ActionsTypes` value is reached by the routing spy test. Coverage, though, shows that several reducers are only *routed*, not *behaviour-tested*, and many guard branches are never hit.

Same rules as plan 04: tests call only the root `reducer(state, action)` from `src/store/reducer.ts`, use `buildStore` / `stubPersistence` from `test/store/helpers/`, and follow arrange → act → assert.

## Baseline (coverage of `src/store/**` from `test/store` only)

Measured with `npx vitest run test/store --coverage --coverage.include='src/store/**'` (needs `@vitest/coverage-v8` matching the `vitest` version).

| File                              | Lines  | Branches | Main gaps                                                    |
| --------------------------------- | ------ | -------- | ------------------------------------------------------------ |
| **All `src/store`**               | 86.3%  | 69.2%    |                                                              |
| `sketch-drive-update.reducer.ts`  | 22.2%  | 16.7%    | `UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER`, `REPLACE_SKETCH_DRIVE_WITH_ORDER` untested |
| `pendingOrders.reducer.ts`        | 54.2%  | 45.5%    | lines 168–286: add-to-vehicle, remove status, split, replace existing, public transport, change/change-time/add-to-pending no-ops |
| `sketch-drive-order.reducer.ts`   | 83.6%  | 60%      | `REMOVE_ORDER_FROM_SKETCH_DRIVE` happy path, `DELETE_SKETCH_DRIVE` unknown drive |
| `locationGroup.reducer.ts`        | 90.9%  | 55%      | guards for missing group / no group in edit                  |
| `route.reducer.ts`                | 94.9%  | 63.5%    | guards for no route in edit / unknown id                     |
| `transport.reducer.ts`            | 94.3%  | 58.7%    | guards for no transport in edit / unknown id                 |
| `location.reducer.ts`             | 98.6%  | 61.5%    | guards for missing group / location                          |
| `sidur.reducer.ts`                | 87.5%  | 67.5%    | lines ~130–225 & 280 branches (rename/delete/archive edge cases) |
| `sketch.reducer.ts`               | 95.9%  | 70%      | missing-record / unknown-id branches                         |
| `store-utils.ts`                  | 82%    | 71.4%    | `updateSidurRecordWithSketchChanges` when record missing     |

Action types with **no behaviour test** (only the routing spy):
`UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER`, `REPLACE_SKETCH_DRIVE_WITH_ORDER`, `CLICKED_ADD_TO_VEHICLE_PENDING_ORDER`, `CLICKED_SPLIT_PENDING_ORDER`, `CLICKED_CHANGE_PENDING_ORDER`, `CLICKED_CHANGE_TIME_PENDING_ORDER`, `CLICKED_REPLACE_EXISTING_PENDING_ORDER`, `CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER`, `CLICKED_ADD_TO_PENDING_PENDING_ORDER`, `REMOVE_PENDING_ORDER_STATUS`.

## Setup

1. ⬜ Add `@vitest/coverage-v8` (same version as `vitest`) to `devDependencies` and a `test:coverage` script: `vitest run --coverage`. Configure `coverage.include: ["src/store/**"]` in `vite.config` / `vitest.config` (or pass it on the CLI), reporter `text` + `json-summary`.
2. ⬜ `test/store/helpers/build-sketch.ts`: `buildStoreWithSketch(opts?)` returning a store that already has a sketch in edit, with
   - at least two vehicles, each with drives at different `startHour`s (to observe `sortVehicleByStartHour`),
   - drives whose `implementsOrders` reference orders in `assignedOrders`,
   - a pending order in `unassignedOrders` and optionally `pendingOrderIdInEdit` set,
   - a Tsamud-type order (for split).
   Plus small accessors: `sketchOf(state)`, `vehicleOf(state, driveId)`, `act(type, payload)` (move the duplicated `act` helper from the existing test files here).
3. ⬜ Optional: `expectInputUntouched(before, after)` helper that compares a `structuredClone` taken before the call to the input after the call (catches in-place mutation without freezing `sessionState`).

## New / extended test files

4. ⬜ `reducer.sketch-drive-update.test.ts` (new)
   - `UPDATE_SKETCH_DRIVE`: re-sorts the vehicle's drives by `startHour` after changing a drive's hour; unknown drive id leaves drives as they were; no sketch in edit is a no-op.
   - `UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER`: replaces the drive, moves the **old** drive's `implementsOrders` from `unassignedOrders` to `assignedOrders`, clears `pendingOrderInEditAction` / `...SelectDrives`; unknown drive id only clears the session action; no sketch in edit only clears the session action.
   - `REPLACE_SKETCH_DRIVE_WITH_ORDER`: inserts a new drive built from the pending order (new id from `getNewDriveIdFromSketch`, `implementsOrders: [pendingId]`, `description` from `LanguageUtilities.buildBriefText`), removes the pending order from `unassignedOrders`, moves the replaced drive's orders back from `assignedOrders` to `unassignedOrders`, re-sorts drives; no-op when `pendingOrderIdInEdit` is null or not in `unassignedOrders`.
5. ⬜ Extend `reducer.pending-orders-and-drives.test.ts` (or split into `reducer.pending-orders-actions.test.ts`)
   - `CLICKED_ADD_TO_VEHICLE_PENDING_ORDER` sets action `AddToVehicle` and select-drives `["noDrivesRealyNeeded"]`.
   - `REMOVE_PENDING_ORDER_STATUS` clears action and select-drives to `null`.
   - `CLICKED_REPLACE_EXISTING_PENDING_ORDER` sets action `ReplaceExisting`; sets select-drives only when `SidurEditorService.getRelevantDriveIdsToChoose` returns ids, otherwise keeps the previous value (both branches).
   - `CLICKED_MERGE_PENDING_ORDER`: the "no relevant drives" branch keeps previous select-drives.
   - `CLICKED_PUBLIC_TRANSPORT_PENDING_ORDER` sets action `publicTransport`, `pendingOrderIdInEdit = payload.id`, select-drives `null`.
   - `CLICKED_SPLIT_PENDING_ORDER`: the split order is replaced at the front of `unassignedOrders` by two orders with consecutive next ids (computed over assigned + unassigned), `pendingOrderIdInEdit` cleared, session action aborted, sidur record sketches synced; unknown id keeps the orders but still clears the edit id; no sketch in edit only aborts the session action.
   - `CLICKED_CHANGE_PENDING_ORDER`, `CLICKED_CHANGE_TIME_PENDING_ORDER`, `CLICKED_ADD_TO_PENDING_PENDING_ORDER`: document as current no-ops (equal, not identical, state; persistence called once) so a future implementation is a visible change.
   - `CLICKED_MOVE_TO_TOP/BOTTOM_PENDING_ORDER` with an unknown id, and with no sketch in edit.
6. ⬜ Extend sketch-drive-order tests
   - `REMOVE_ORDER_FROM_SKETCH_DRIVE` happy path: order id removed from the drive's `implementsOrders`, order moved from `assignedOrders` to the end of `unassignedOrders`, record synced; order not in `assignedOrders` only edits the drive.
   - `DELETE_SKETCH_DRIVE` with an unknown drive id keeps all drives; remaining drives stay sorted.
   - `ADD_SKETCH_DRIVE_FROM_PENDING_ORDER` places the new drive in start-hour order among existing drives.
7. ⬜ Guard-branch tests in `reducer.locations-routes-transports.test.ts` (one `describe.each` per domain to keep it short)
   - Routes / transports: every "in edit" action (`UPDATE_*`, `ADD_LOCATION_TO_*`, `CLONE_*`, `DELETE_*`, `STOP_EDIT_*`) with no item in edit and with an unknown id → collections unchanged.
   - `DELETE_ROUTE` / `DELETE_TRANSPORT` of the item in edit clears `routeIdInEdit` / `transportIdInEdit`.
   - Location groups: `RENAME_LOCATION_GROUP` with empty name; `DELETE_LOCATION_GROUP` of a non-selected group keeps the selection; actions with no `locationGroupInEdit`.
   - Locations: `UPDATE_LOCATION` / `DELETE_LOCATION` / `START_EDIT_LOCATION` when the group in edit is missing.
8. ⬜ Sidur and sketch edge cases
   - `sidur.reducer.ts` uncovered branches (≈ lines 130–225, 280): rename of a non-current sidur, delete/archive when the collection becomes empty, `MOVE_TO_ACTIVE_SIDUR` / `DELETE_FOREVER_SIDUR` with unknown ids, `ADD_NEW_SIDUR` name collision (`getDefaultSidur` appends the id).
   - `sketch.reducer.ts` uncovered branches (lines 29, 47, 74–77, 104–110, 131, 148, 160): actions when `sidurCollection` has no record for `sidurId`, `RENAME_SKETCH` unknown id, `DELETE_SKETCH` of a non-selected sketch keeps the selection.
9. ⬜ Import / export leftovers: `import-export.reducer.ts` lines 44 and 68 (the `"Error: " + err.message || "Error"` fallback). Note that the `|| "Error"` is dead code due to operator precedence — add an `it.fails` that expects `"Error"` for an error without a message, and log it as a known bug.

## Purity / mutation suite

10. ⬜ `reducer.purity.test.ts` (new): a table of `[actionType, arrangeFn, payload]` covering every routed action. For each row: deep-clone the input, run the reducer, assert the input still deep-equals the clone.
    - Rows known to mutate today (shallow copy + nested mutation: `sessionState`, sketch objects mutated in place by pending-order and sketch-drive reducers, `sortVehicleByStartHour` sorting in place) are marked `it.fails` with a comment, so fixing one turns the test red and forces removing the marker.
    - This is the safety net for the refactoring plan (`02-code-refactoring-plan.md`).

## Multi-step sequences

11. ⬜ Extend `reducer.sequence.test.ts` with:
    - Pending-order flow: new sketch → click pending order → merge → `UPDATE_SKETCH_DRIVE_WITH_MERGED_ORDER` → remove order from drive → order back in pending.
    - Replace flow: click pending order → replace existing → `REPLACE_SKETCH_DRIVE_WITH_ORDER` → switch sidur → switch back → sketch changes preserved in the record.
    - Location group switch: `CHANGE_SIDUR_LOCATION_GROUP` → `ADD_NEW_ORDER` → order uses the new group's locations.

## Verify

12. ⬜ `npm test`, `npm run typecheck`, `npm run lint`, `npm run test:coverage`.
13. ⬜ Record the new coverage numbers in this file next to the baseline.

## Success criteria

- Every routed `ActionsTypes` value has at least one **behaviour** assertion (not just the routing spy).
- `src/store/**` coverage from `test/store` reaches **≥ 95% lines and ≥ 85% branches**; no reducer file below 80% branches.
- Each known bug / impurity is captured as an `it.fails` with a one-line explanation, so fixing it is a deliberate, visible change.
- Tests stay deterministic (persistence stubbed, no real timers or downloads).
