# Redux Reducers Testing Plan

> Instruction: After you attempt or complete any step in this document, immediately update that step's status emoji to one of: ✅ (done), ⬜ (not done), ⚠️ (in progress). Keep this file updated after every step.

## Overview

The store (`src/store/`) uses a single root `reducer` in `reducer.ts` that dispatches by `action.type` to domain reducer maps (`SidurReducer`, `OrderReducer`, `VehicleReducer`, `SketchReducer`, `PendingOrdersReducer`, `RouteReducer`, `TransportReducer`, `LocationReducer`, `LocationGroupReducer`, `ImportExportReducer`, `DisplayReducer`, `SketchDriveReducer`). Each map is `{ [ActionsTypes.X]: (state: SidurStore, action: IAction) => SidurStore }`.

Currently there are no reducer tests (`test/` holds only component, hoc and util tests). Tests run with Vitest (`npm test`), `globals: true`, jsdom, setup file `src/setupTests.ts`.

Constraints worth noting:

- `reducer.ts` reads `localStorage` at import time (`buildInitialState`), so importing the root reducer has a side effect.
- Several reducers use ids/dates generated at runtime (`store-utils.ts`), which hurts determinism.
- Reducers are expected to be pure; mutation of the input state is a real bug class to guard against.

## Strategies

### Strategy A — Direct unit tests per domain reducer (pure function tests)

Import a domain reducer map (e.g. `OrderReducer`), build a state fixture, call `OrderReducer[ActionsTypes.X](state, action)`, assert on the result.

**Pros**

- Fast, simple, and precise failure localisation.
- No store, React, or localStorage involvement.
- Easy to cover edge cases (empty state, missing ids, duplicates).
- Matches the reducer-map structure 1:1 (one test file per reducer).

**Cons**

- Does not verify routing in `reducer.ts` (an action may be missing from the switch).
- Requires hand-built `SidurStore` fixtures; verbose without helpers.
- Does not catch cross-reducer interactions.

### Strategy B — Root reducer tests through `reducer(state, action)`

Test via the exported root reducer with real action types.

**Pros**

- Verifies action routing and the default (unknown action) path.
- Closest to real behaviour with little extra setup.
- Catches actions declared in `ActionsTypes` but not wired.

**Cons**

- Import triggers `localStorage` loading; needs mocking/clearing in setup.
- Less targeted failures; larger action surface per test file.
- Couples domain tests to routing details.

### Strategy C — Integration tests with a real Redux store

Create a store with `createStore`/`configureStore` and the root reducer, dispatch sequences of actions, assert on `getState()` (existing `test/utils/redux-mock-store.ts` can help).

**Pros**

- Tests realistic multi-step workflows (create sidur → add order → add to sketch).
- Validates cross-reducer interactions and middleware.

**Cons**

- Slower, more brittle; failures harder to diagnose.
- Needs more fixture/setup effort; order dependence between steps.
- Overkill for simple reducers.

### Strategy D — Snapshot tests

Call reducers with fixtures and `expect(result).toMatchSnapshot()`.

**Pros**

- Very quick to write; broad coverage for large state shapes.
- Good for characterisation of legacy behaviour before refactoring (see `02-code-refactoring-plan.md`).

**Cons**

- Snapshots are easily blindly updated; weak intent documentation.
- Noisy diffs with large state; non-deterministic ids/dates must be mocked.
- Does not prove correctness, only stability.

### Strategy E — Property-based tests (e.g. `fast-check`)

Generate random states/actions and assert invariants (purity, no input mutation, ids unique, counts preserved).

**Pros**

- Finds unexpected edge cases and mutation bugs.
- Invariants serve as living documentation.

**Cons**

- New dependency (`fast-check`) and learning curve.
- Needs arbitraries for a complex `SidurStore`; high initial cost.
- Flaky-looking failures require shrinking/seed handling.

## Comparison

| Strategy               | Setup cost | Failure clarity | Routing covered | Cross-reducer | Dependencies |
| ---------------------- | ---------- | --------------- | --------------- | ------------- | ------------ |
| A. Unit per reducer    | Low        | High            | No              | No            | None         |
| B. Root reducer        | Low–Med    | Medium          | Yes             | Partial       | None         |
| C. Store integration   | Medium     | Low–Med         | Yes             | Yes           | None         |
| D. Snapshots           | Low        | Low             | No              | No            | None         |
| E. Property-based      | High       | Medium          | Optional        | Optional      | fast-check   |

## Recommendation

Combine **A + B**, with a few **C** scenarios:

1. A for the bulk of logic coverage (primary).
2. B as a single routing test: iterate over every `ActionsTypes` value and assert the root reducer handles it (or returns state unchanged for unknown types).
3. C for 2–3 key user workflows.
4. D only temporarily, as characterisation before refactoring risky reducers (`transport`, `route`, `pendingOrders`).
5. E optional, later, for invariants (no mutation, id uniqueness).

## Implementation Steps

1. ⬜ Add `test/store/helpers/` with a `buildStore(partial)` fixture factory returning a valid `SidurStore` (based on `DefaultSidurFetching`) and an `deepFreeze` helper to detect mutation.
2. ⬜ Mock id/date generators from `store-utils.ts` (`vi.mock` / `vi.useFakeTimers`) for determinism.
3. ⬜ Clear `localStorage` in `beforeEach` so importing `reducer.ts` is deterministic.
4. ⬜ Write unit tests (Strategy A), simplest first: `display`, `vehicle`, `location`, `locationGroup`.
5. ⬜ Unit tests: `order`, `sketch`, `sketch-drive*`, `sidur`.
6. ⬜ Unit tests: `pendingOrders`, `route`, `transport`, `import-export`.
7. ⬜ Root reducer routing test (Strategy B) covering all `ActionsTypes`.
8. ⬜ 2–3 integration workflows (Strategy C).
9. ⬜ Verify: `npm test`, `npm run typecheck`, `npm run lint`.

## Conventions

- Place tests in `test/store/<name>.reducer.test.ts`.
- Each test: arrange (frozen fixture) → act → assert; also assert the original state is not mutated.
- Test names describe behaviour, e.g. `"deletes the order and keeps others"`.
- Cover: happy path, unknown id, empty collections, and idempotency where relevant.

## Success Criteria

- Every reducer action type has at least one happy-path and one edge-case test.
- All tests deterministic and pass in CI (`npm test`).
- No reducer mutates its input state.
