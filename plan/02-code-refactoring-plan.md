# Code Refactoring Plan

> Instruction: After you attempt or complete any step in this document, immediately update that step's status emoji to one of: ✅ (done), ⬜ (not done), ⚠️ (in progress). Keep this file updated after every step.

## Overview

This document outlines a comprehensive refactoring strategy for the Sidur codebase to address:
- Large files with too many responsibilities
- Unclear code and poor naming conventions
- Code duplication across components and reducers
- Type safety improvements
- Component organization issues

## Analysis Summary

**Repository Statistics:**
- Total source files (TS/TSX): 145 files
- Files exceeding 300 lines: 7 files
- Naming inconsistencies identified: 15+ instances
- Misspelled field names: 10+ files affected
- Major code duplication areas: 5+
- Large utility modules (god objects): 3 files

## Phase 1: Critical Naming Fixes (HIGH PRIORITY)

### 1.1 Fix Misspelled "minuets" → "minutes" ⬜

**Impact**: 10+ files across models, components, and reducers

**Files to update**:
- `src/models/Location.model.ts` - `minuetsFromLast` field
- `src/components/LocationsEditTransports/location-transport-edit.tsx`
- `src/components/LocationsEditRoutes/location-route-edit.tsx`
- `src/store/transport.reducer.ts`
- `src/store/route.reducer.ts`
- `src/services/config-service.ts` - `MinimumMinuetGapFormNotifications`

**Steps**:
1. ⬜ Create a new branch for this refactoring
2. ⬜ Update Location model interface: `minuetsFromLast` → `minutesFromLast`
3. ⬜ Update all component references
4. ⬜ Update reducer references
5. ⬜ Update config service field name
6. ⬜ Search for `minuet` (case-insensitive) to ensure all instances are caught
7. ⬜ Run TypeScript compiler to verify no broken references
8. ⬜ Run tests to ensure functionality unchanged
9. ⬜ Update any documentation mentioning this field

**Verification**:
- `npm run typecheck` passes
- `npm test` passes
- Grep for "minuet" returns zero results (except in comments explaining the fix)

### 1.2 Standardize ID Naming Convention ⬜

**Issue**: Inconsistent PascalCase vs camelCase for ID fields

**Files to update**:
- `src/models/SessionModel.ts`
  - `SketchIdInEdit` → `sketchIdInEdit` (standardize to camelCase)
  - Keep `pendingOrderIdInEdit` as is

**Steps**:
1. ⬜ Update SessionModel interface
2. ⬜ Update all usages in components
3. ⬜ Update store references
4. ⬜ Run TypeScript compiler
5. ⬜ Run tests

### 1.3 Fix Typo: "routStops" → "routeStops" ⬜

**Files to update**:
- Search for `routStops` and replace with `routeStops`

**Steps**:
1. ⬜ Identify all occurrences
2. ⬜ Update model definitions
3. ⬜ Update component usages
4. ⬜ Verify with TypeScript compiler

### 1.4 Clarify Unclear Variable Names ⬜

**Updates needed**:
- `location-group-edit-wrapper.tsx:144` - `chosenSketch` → `chosenLocationGroup`
- `location-route-edit.tsx:49` - `sketchMenuId` → `routeMenuId`
- `sketch.reducer.ts` - `deconstructedSidur` → `updatedSidur` or `sidurCopy`
- `SessionModel.ts` - Add JSDoc comment for `daHolderForCurrentOrderInEdit` to clarify purpose

**Steps**:
1. ⬜ Rename variables one file at a time
2. ⬜ Verify each change with TypeScript compiler
3. ⬜ Update any related tests

## Phase 2: Split Large Files (HIGH PRIORITY)

### 2.1 Refactor sketch-drive.reducer.ts (371 lines) ⬜

**Current issues**:
- Handles 6 different action types
- Multiple helper functions at bottom
- Complex nested loops and deep mutations

**Refactoring approach**:
1. ⬜ Extract helper functions to `src/store/utils/sketch-drive-helpers.ts`:
   - `getVehicleIdFromDriveId`
   - `getNewDriveIdFromSketch`
   - `sortVehicleByStartHour`
2. ⬜ Consider splitting into multiple focused reducers:
   - `sketch-drive-update.reducer.ts` - Handle drive updates
   - `sketch-drive-order.reducer.ts` - Handle order-related actions
3. ⬜ Use Redux Toolkit's `createSlice` to reduce boilerplate
4. ⬜ Combine back into single export if needed for backwards compatibility

**Target**: Reduce main reducer file to <200 lines

### 2.2 Refactor sidur.reducer.ts (364 lines) ⬜

**Current issues**:
- Handles 9 action types
- Duplicated transformation patterns

**Refactoring approach**:
1. ⬜ Extract helper functions to `src/store/utils/sidur-helpers.ts`:
   - `setChosenSidur`
   - `getAllSidurIDs`
   - `getDefaultSidur`
2. ⬜ Extract common mapping patterns into reusable functions
3. ⬜ Group related action handlers together
4. ⬜ Add JSDoc comments for complex transformations

**Target**: Reduce main reducer file to <250 lines

### 2.3 Split Sketch.tsx Component (353 lines) ⬜

**Current issues**:
- Too many responsibilities
- 5 state variables
- Multiple dialog handlers
- Deep nesting

**Refactoring approach**:
1. ⬜ Create `src/components/Sketch/SketchVehicleColumn.tsx`:
   - Extract vehicle column rendering logic
   - Props: `vehicle`, `drives`, `onDriveClick`
2. ⬜ Create `src/components/Sketch/SketchPendingOrdersList.tsx`:
   - Extract pending orders list
   - Props: `pendingOrders`, `onOrderClick`
3. ⬜ Create `src/components/Sketch/hooks/useSketchDialogs.ts`:
   - Custom hook to manage dialog state
   - Returns: dialog states and handlers
4. ⬜ Refactor main `Sketch.tsx` to be a container component (<150 lines)

**Target**: Main component <150 lines, with 2-3 child components

### 2.4 Refactor pendingOrders.reducer.ts (346 lines) ⬜

**Current issues**:
- 14 different action types
- Repetitive patterns

**Refactoring approach**:
1. ⬜ Group actions by domain:
   - Create actions (ADD_*, CREATE_*)
   - Update actions (UPDATE_*, EDIT_*)
   - Delete actions (DELETE_*, REMOVE_*)
2. ⬜ Extract common patterns into helper functions
3. ⬜ Consider using Redux Toolkit's `createEntityAdapter` for CRUD operations

**Target**: Reduce to <250 lines with better organization

### 2.5 Refactor location-transport-edit.tsx (340 lines) ⬜

**Current issues**:
- Mixed concerns: form display, stop management, scheduling
- Too many handler functions

**Refactoring approach**:
1. ⬜ Create `TransportEditForm.tsx` - Form fields and validation
2. ⬜ Create `TransportStopsList.tsx` - Stop management UI
3. ⬜ Create `TransportSchedule.tsx` - Time schedule editing
4. ⬜ Create `hooks/useTransportEdit.ts` - Business logic hook
5. ⬜ Main component becomes container (<100 lines)

**Target**: Split into 4 files, main component <100 lines

## Phase 3: Eliminate Code Duplication (HIGH PRIORITY)

### 3.1 Merge Route/Transport Duplicate Components ⬜

**Duplicated pair 1**: `location-route-edit.tsx` (258 lines) vs `location-transport-edit.tsx` (340 lines)

**Issue**: 90% identical code, only differs in data source

**Refactoring approach**:
1. ⬜ Create generic `LocationScheduleEdit.tsx` component:
   - Accept `type: 'route' | 'transport'` prop
   - Use discriminated union for type-specific props
   - Shared `StopModel` interface
2. ⬜ Create wrapper components for backward compatibility:
   - `LocationRouteEdit.tsx` - thin wrapper passing `type='route'`
   - `LocationTransportEdit.tsx` - thin wrapper passing `type='transport'`
3. ⬜ Extract shared logic to `hooks/useScheduleEdit.ts`
4. ⬜ Update tests to cover both modes

**Estimated line reduction**: ~200 lines

### 3.2 Merge Route/Transport Duplicate Reducers ⬜

**Duplicated pair 2**: `route.reducer.ts` (331 lines) vs `transport.reducer.ts` (344 lines)

**Issue**: Nearly identical action handlers for nested stop/location operations

**Refactoring approach**:
1. ⬜ Analyze differences between the two reducers
2. ⬜ Create `src/store/utils/schedule-reducer-helpers.ts`:
   - `addScheduleItem`
   - `updateScheduleItem`
   - `deleteScheduleItem`
   - `updateNestedStop`
3. ⬜ Refactor both reducers to use shared helpers
4. ⬜ Consider creating a generic reducer factory function
5. ⬜ Maintain separate reducers for type safety

**Estimated line reduction**: ~150 lines

### 3.3 Consolidate Dialog Handler Patterns ⬜

**Issue**: 15 dialog components with identical boilerplate

**Refactoring approach**:
1. ⬜ Create `src/components/shared/hooks/useDialog.ts`:
   ```typescript
   interface UseDialogOptions<T> {
     onClose: (value: T | null) => void;
     onDelete?: () => void;
   }
   export function useDialog<T>(options: UseDialogOptions<T>) {
     // Returns: { isOpen, open, close, handleClose, handleDelete }
   }
   ```
2. ⬜ Refactor dialog components to use the hook:
   - `sketch-drive-edit-dialog.tsx`
   - `sketch-drive-merge-dialog.tsx`
   - `sketch-order-to-transport-dialog.tsx`
   - `vehicle-edit-dialog.tsx`
   - And 11 more dialogs
3. ⬜ Create base `BaseDialog.tsx` component with common structure
4. ⬜ Each specific dialog extends/uses the base

**Estimated line reduction**: ~300 lines across all dialogs

### 3.4 Extract Repeated Reducer Patterns ⬜

**Issue**: State cloning and array mapping repeated 30+ times

**Refactoring approach**:
1. ⬜ Create `src/store/utils/immutable-helpers.ts`:
   ```typescript
   export function updateItemInArray<T>(
     array: T[],
     predicate: (item: T) => boolean,
     updateFn: (item: T) => T
   ): T[]

   export function updateNestedItem<T, K extends keyof T>(
     state: T,
     key: K,
     itemId: string,
     updateFn: (item: any) => any
   ): T
   ```
2. ⬜ Refactor all reducers to use these helpers
3. ⬜ Document the helper functions with examples

**Estimated line reduction**: ~500 lines across all reducers

## Phase 4: Improve Type Safety (MEDIUM PRIORITY)

### 4.1 Replace `any` in IAction Type ⬜

**File**: `src/store/store.types.ts`

**Current issue**:
```typescript
export type IAction = {
    type: ActionsTypes;
    payload: any | { value: any };  // Too permissive
};
```

**Refactoring approach**:
1. ⬜ Define specific action payload types for each action:
   ```typescript
   type AddOrderPayload = { order: Order };
   type UpdateOrderPayload = { orderId: string; updates: Partial<Order> };
   // ... etc
   ```
2. ⬜ Create discriminated union type:
   ```typescript
   type AppAction =
     | { type: 'ADD_ORDER'; payload: AddOrderPayload }
     | { type: 'UPDATE_ORDER'; payload: UpdateOrderPayload }
     | ...
   ```
3. ⬜ Replace `IAction` with `AppAction` throughout codebase
4. ⬜ Update reducers to leverage type narrowing
5. ⬜ Run TypeScript compiler with strict mode

**Benefits**:
- Catch payload type errors at compile time
- Better IDE autocomplete
- Safer refactoring

### 4.2 Add Type Safety to SessionModel ⬜

**File**: `src/models/SessionModel.ts`

**Issues**:
```typescript
pendingOrderInEditActionSelectDrives: null | string[];  // No type for drive IDs
```

**Refactoring approach**:
1. ⬜ Create `DriveId` branded type: `type DriveId = string & { __brand: 'DriveId' }`
2. ⬜ Update field: `pendingOrderInEditActionSelectDrives: null | DriveId[]`
3. ⬜ Update usages throughout codebase
4. ⬜ Consider creating similar branded types for other ID fields

## Phase 5: Split Utility Modules (MEDIUM PRIORITY)

### 5.1 Refactor services/utils.ts (154 lines) ⬜

**Current issue**: Utility dump with unrelated functions

**Refactoring approach**:
1. ⬜ Create `src/services/time-utils.ts`:
   - Hour conversion functions
   - Time manipulation utilities
2. ⬜ Create `src/services/id-generator.ts`:
   - ID generation logic
   - ID prefix utilities
3. ⬜ Create `src/services/data-transform-utils.ts`:
   - Data transformation helpers
4. ⬜ Update imports across codebase
5. ⬜ Deprecate old `utils.ts` or make it re-export from new modules

### 5.2 Refactor store-utils.ts (171 lines) ⬜

**Current issue**: God object with 10+ unrelated utilities

**Refactoring approach**:
1. ⬜ Create `src/store/utils/session-utils.ts`:
   - Session-related utilities
2. ⬜ Create `src/store/utils/state-clone-utils.ts`:
   - State cloning helpers
3. ⬜ Create `src/store/utils/record-brief-utils.ts`:
   - Brief text generation utilities
4. ⬜ Update imports
5. ⬜ Delete or deprecate `store-utils.ts`

### 5.3 Organize translations.ts (173 lines) ⬜

**Current issue**: Flat translation object

**Refactoring approach**:
1. ⬜ Organize by feature domain:
   ```typescript
   export const translations = {
     common: { /* common strings */ },
     orders: { /* order-related strings */ },
     routes: { /* route-related strings */ },
     vehicles: { /* vehicle-related strings */ },
     // ...
   };
   ```
2. ⬜ Update usages to use nested structure
3. ⬜ Consider splitting into multiple files if grows larger

## Phase 6: Documentation and Code Quality (LOW PRIORITY)

### 6.1 Document ID Prefixing System ⬜

**Issue**: Magic strings like `"Del"`, `ArchiveIdPrefix` are unclear

**Steps**:
1. ⬜ Create `docs/id-system.md` documenting:
   - ID structure and format
   - Meaning of prefixes
   - When each prefix is used
2. ⬜ Add JSDoc comments to relevant functions
3. ⬜ Consider extracting constants:
   ```typescript
   export const ID_PREFIXES = {
     DELETE: 'Del',
     ARCHIVE: AppConstants.ArchiveIdPrefix,
     // ...
   } as const;
   ```

### 6.2 Add JSDoc Comments to Complex Functions ⬜

**Focus areas**:
- `services/language-utilities.ts` - `buildBriefText` method
- Reducer transformation functions
- Complex business logic functions

**Steps**:
1. ⬜ Identify top 10 most complex functions
2. ⬜ Add JSDoc comments with:
   - Description of what the function does
   - @param tags with descriptions
   - @returns tag with description
   - @example if helpful
3. ⬜ Focus on "why" not "what"

### 6.3 Extract Magic Numbers to Constants ⬜

**Steps**:
1. ⬜ Identify hardcoded numbers (except 0, 1, -1)
2. ⬜ Create `src/constants/app-constants.ts` (if doesn't exist)
3. ⬜ Extract to named constants with clear purpose
4. ⬜ Update usages

### 6.4 Create Custom Hooks for Reusable Logic ⬜

**Focus areas**:
- Menu management (`handleMenuClick`, `handleMenuOpen` patterns)
- Form state management
- Data fetching patterns

**Steps**:
1. ⬜ Identify repeated logic across 3+ components
2. ⬜ Create custom hooks in `src/hooks/`:
   - `useMenu.ts`
   - `useFormState.ts`
   - Others as identified
3. ⬜ Refactor components to use hooks
4. ⬜ Add tests for custom hooks

## Testing Strategy

After each phase:

1. ⬜ Run TypeScript compiler: `npm run typecheck`
2. ⬜ Run all tests: `npm test`
3. ⬜ Manual testing of affected features
4. ⬜ Check for console warnings/errors
5. ⬜ Test production build: `npm run build`

## Rollback Plan

- Create feature branch for each phase
- Test thoroughly before merging
- Keep detailed notes of changes in PR descriptions
- Can revert individual commits if issues arise

## Risk Assessment

**Risk Level**: MEDIUM-HIGH
- Large codebase with many interdependencies
- Some changes may have cascading effects
- Requires careful testing at each step

**Mitigation**:
- Work in phases with complete testing between each
- Start with naming fixes (lowest risk)
- Use TypeScript compiler as safety net
- Maintain backward compatibility where possible
- Create wrapper components/functions for breaking changes

## Success Metrics

**Code Quality Improvements**:
- [ ] Reduce files >300 lines from 7 to 0
- [ ] Eliminate all spelling errors in code
- [ ] Reduce code duplication by ~50% (estimate ~1000 lines)
- [ ] Increase type safety (0 uses of `any` in new code)
- [ ] Improve test coverage for refactored areas

**Developer Experience**:
- [ ] Faster TypeScript compilation
- [ ] Better IDE autocomplete
- [ ] Easier to find and modify code
- [ ] Clear and consistent naming
- [ ] Well-documented complex areas

## Estimated Timeline

- **Phase 1 (Naming)**: 1-2 days
- **Phase 2 (Large Files)**: 4-5 days
- **Phase 3 (Duplication)**: 5-7 days
- **Phase 4 (Type Safety)**: 2-3 days
- **Phase 5 (Utilities)**: 2-3 days
- **Phase 6 (Documentation)**: 2-3 days

**Total**: 2-4 weeks (depending on testing thoroughness and issue discoveries)

## Next Steps

1. ⬜ Review this plan with team
2. ⬜ Prioritize phases based on current project needs
3. ⬜ Create GitHub issues for each phase
4. ⬜ Begin with Phase 1 (lowest risk, high impact)
5. ⬜ Schedule regular check-ins to assess progress

## Notes

- This plan is based on analysis performed on 2026-03-27
- Codebase may evolve; reassess before starting each phase
- Feel free to adjust order or scope based on project priorities
- Some phases can be done in parallel by different developers
- Consider pairing for complex refactoring tasks
