# End-to-End Testing Plan

> Instruction: After you attempt or complete any step in this document, immediately update that step's status emoji to one of: ✅ (done), ⬜ (not done), ⚠️ (in progress). Keep this file updated after every step.

## Overview

Introduce a small, reliable browser-based end-to-end (E2E) suite that verifies Sidur's most important user journeys in a real browser. Keep the existing Vitest/jsdom suite for unit and component tests; E2E tests complement it rather than replace it.

## Current State

- Vitest runs with jsdom; `npm test` invokes `vitest run`.
- No browser automation dependency or E2E workflow is currently configured.
- The app uses React Router's `HashRouter` and exposes orders, sketch, and locations routes.
- Save/load data is persisted through `localStorage`.
- CI currently runs `npm test` on Node 24.

## Recommended Approach

Use Playwright Test with Chromium initially. Keep browser tests in a dedicated `e2e/` directory and configure a local Vite server for tests. Pin the Playwright package and browser version through the lockfile so local and CI runs use the same setup. Add other browsers only when there is a concrete compatibility requirement.

## Phase 1: Define the E2E Contract

1. ⬜ Confirm the supported test environment: Node 24 and Chromium on local development and GitHub Actions.
2. ⬜ Identify the app's supported way to create or load deterministic test data (for example, its existing import or sample-data flow); do not rely on a developer's saved browser data.
3. ⬜ Select the initial high-value journeys: app launch and default navigation to orders, navigation among orders/sketch/locations, and one representative data change that survives reload through the app's persistence flow.
4. ⬜ Record any prerequisites or unstable flows to exclude from the initial suite.

## Phase 2: Add Playwright Infrastructure

1. ⬜ Add Playwright Test as a development dependency and commit the updated lockfile.
2. ⬜ Add a Playwright configuration for the `e2e/` directory, Chromium, and a Vite web server bound to localhost; reuse the repository's Node and port conventions where practical.
3. ⬜ Add `test:e2e` and, if useful, `test:e2e:ui` scripts without changing the existing `test` script's Vitest behavior.
4. ⬜ Set a test-only base URL and isolate each test's browser context and `localStorage`; ensure test setup never reads or writes real user data.
5. ⬜ Add shared setup/helpers only for repeated behavior, such as loading deterministic data and locating common navigation controls.

## Phase 3: Implement the Smoke and Core Journeys

1. ⬜ Add a smoke test that opens the app and verifies the default route renders meaningful content.
2. ⬜ Add navigation coverage for orders, sketch, and locations, using the app's hash-based URLs and visible UI controls.
3. ⬜ Add one end-to-end persistence journey: load or create known test data through a supported UI flow, perform a representative change, reload, and assert the expected state remains.
4. ⬜ Prefer accessible roles, labels, and user-visible text for locators; add stable test IDs only when a necessary control has no reliable accessible locator.
5. ⬜ Keep assertions focused on user-observable behavior rather than implementation details or Redux internals.

## Phase 4: Run in CI and Document Usage

1. ⬜ Add a separate GitHub Actions E2E job using Node 24, dependency caching, and Playwright's pinned Chromium installation with required system dependencies.
2. ⬜ Run E2E tests on pull requests and pushes to the same branches as the existing test workflow; keep the existing unit-test job intact.
3. ⬜ Upload Playwright traces, screenshots, and reports on failure, with retention limited to failed runs where practical.
4. ⬜ Document local setup, first-time browser installation, commands, and failure artifact locations in the README or the repository's existing testing documentation.
5. ⬜ Verify both the existing `npm test` suite and the new E2E command locally and in CI.

## Acceptance Criteria

- `npm test` continues to run the existing Vitest suite unchanged.
- `npm run test:e2e` launches the application and runs deterministic tests in Chromium without requiring an already-running server or personal browser data.
- The initial journeys cover app startup, the primary routes, and a representative persisted user change.
- CI runs E2E tests on pull requests and provides useful failure artifacts without blocking or replacing the existing unit-test results.
- Setup and test commands are documented and reproducible with Node 24.

## Risks and Mitigations

- **Unstable selectors or UI timing:** Prefer accessible locators and Playwright's auto-waiting; avoid fixed sleeps.
- **Unrepeatable application state:** Start each test with an isolated browser context and known test data.
- **Slow or flaky CI:** Begin with a small Chromium-only suite, keep journeys independent, and capture traces for diagnosis.
- **Persisted data leaking between tests:** Use test-specific storage and clear browser state between tests; do not target the default user key.

## Rollback Plan

- Remove or disable the E2E job and `test:e2e` scripts if browser setup blocks CI, while preserving the existing Vitest workflow.
- Keep E2E-only helpers and configuration separate from production code so the test tooling can be reverted without application changes.
