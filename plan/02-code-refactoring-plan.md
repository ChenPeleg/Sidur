# Code Refactoring Plan

> Instruction: After you attempt or complete any step in this document, immediately update that step's status emoji to one of: ✅ (done), ⬜ (not done), ⚠️ (in progress). Keep this file updated after every step.

## Overview

This document outlines a systematic refactoring plan for the Sidur codebase to improve code clarity, maintainability, and organization. Based on comprehensive codebase analysis, this plan addresses files that are too large, unclear code patterns, and naming inconsistencies.

## Codebase Current State

- **Total Lines of Code**: ~13,542 lines of TypeScript/TSX
- **Total Files**: 145 files
- **Key Issues Identified**:
  - 5 files over 300 lines (largest: 371 lines)
  - Duplicate file: `downloadFile.ts` vs `download-file.ts`
  - 148 instances of unsafe type usage (`any`, `@ts-ignore`)
  - Inconsistent naming conventions (PascalCase vs kebab-case)
  - Large reducers with repetitive patterns
  - Missing performance optimizations
  - Limited JSDoc documentation

## Refactoring Goals

1. **Improve Code Clarity**: Break down complex files, add documentation
2. **Standardize Naming**: Consistent conventions across the codebase
3. **Enhance Type Safety**: Replace `any` types with proper TypeScript types
4. **Reduce Duplication**: Extract common patterns into reusable utilities
5. **Optimize Performance**: Add React optimization hooks where needed
6. **Improve Maintainability**: Better file organization and smaller, focused modules

## Phase 1: Critical Issues (High Priority)

### Step 1: ⬜ Resolve Duplicate File Issue

**Problem**: Two versions of downloadFile exist with different implementations
- `/src/services/downloadFile.ts` (957 bytes) - Has `DownloadFile()` and `DownloadCSVFile()`
- `/src/services/download-file.ts` (420 bytes) - Has only `DownloadFile()`

**Action**:
1. ⬜ Audit all imports to determine which file is actively used
2. ⬜ Consolidate functionality into single file: `download-file.ts`
3. ⬜ Update all import statements
4. ⬜ Delete the unused file
5. ⬜ Verify build and tests pass

**Files Affected**: 2 files to consolidate, multiple components importing

**Estimated Impact**: Low risk, high benefit (eliminates confusion)

---

### Step 2: ⬜ Standardize Enum File Naming

**Problem**: Inconsistent enum file naming conventions
- Some use: `DriveType.enum.ts` (PascalCase with `.enum.ts`)
- Others use: `profile-menu-click-action-type.enum.ts` (kebab-case with `.enum.ts`)
- Some use: `SketchDriveOrderEditActionEnum.ts` (PascalCase with `Enum.ts`)

**Action**:
1. ⬜ Choose standard convention: **kebab-case with `.enum.ts` suffix**
2. ⬜ Rename all enum files to follow pattern: `entity-name.enum.ts`
3. ⬜ Update all import statements across codebase
4. ⬜ Update exports in index files if present

**Files to Rename** (examples):
- `DriveType.enum.ts` → `drive-type.enum.ts`
- `SketchDriveOrderEditActionEnum.ts` → `sketch-drive-order-edit-action.enum.ts`
- `LocationGroupMenuClickActionType.enum.ts` → `location-group-menu-click-action-type.enum.ts`

**Estimated Impact**: Low risk, improves consistency

---

### Step 3: ⬜ Refactor Large Reducers (300+ lines)

**Problem**: Several reducers exceed 300 lines with repetitive patterns

**Target Files**:
1. `sketch-drive.reducer.ts` (371 lines)
2. `sidur.reducer.ts` (364 lines)
3. `pendingOrders.reducer.ts` (346 lines)
4. `transport.reducer.ts` (344 lines)

**Action Plan for Each Reducer**:

#### 3a. ⬜ Extract Common Reducer Utilities

Create `/src/store/utils/reducer-helpers.ts`:
```typescript
// Utility functions for common reducer patterns
export const updateItemInArray = <T extends { id: string }>(
    items: T[],
    itemId: string,
    updateFn: (item: T) => T
): T[] => { /* implementation */ }

export const removeItemFromArray = <T extends { id: string }>(
    items: T[],
    itemId: string
): T[] => { /* implementation */ }

export const findItemInNestedStructure = <T>(/* params */): T | undefined => { /* implementation */ }
```

**Files to Create**: 1 new utility file

#### 3b. ⬜ Split sketch-drive.reducer.ts

Break down into smaller focused modules:
- `sketch-drive.reducer.ts` (main reducer, ~150 lines)
- `sketch-drive.selectors.ts` (selector functions)
- `sketch-drive.helpers.ts` (helper functions like `getVehicleIdFromDriveId`)

**Original**: 371 lines → **Target**: 3 files × ~120-150 lines each

#### 3c. ⬜ Split sidur.reducer.ts

Break down into:
- `sidur.reducer.ts` (main reducer, ~150 lines)
- `sidur.crud-actions.ts` (CRUD operation handlers)
- `sidur.state-sync.ts` (state synchronization logic)

**Original**: 364 lines → **Target**: 3 files × ~120 lines each

#### 3d. ⬜ Split pendingOrders.reducer.ts

Break down into:
- `pendingOrders.reducer.ts` (main reducer, ~150 lines)
- `pendingOrders.transforms.ts` (state transformation functions)
- `pendingOrders.validators.ts` (validation logic)

**Original**: 346 lines → **Target**: 3 files × ~110-120 lines each

#### 3e. ⬜ Split transport.reducer.ts

Break down into:
- `transport.reducer.ts` (main reducer, ~150 lines)
- `transport.scheduling.ts` (scheduling logic)
- `transport.helpers.ts` (helper functions)

**Original**: 344 lines → **Target**: 3 files × ~110-120 lines each

**Estimated Impact**: Medium risk, high benefit (improves maintainability)

---

### Step 4: ⬜ Fix Unclear Function Naming

**Problem**: Several functions have unclear abbreviations or grammatically awkward names

**Functions to Rename**:

| Current Name | Location | New Name | Reason |
|--------------|----------|----------|--------|
| `mkDrv()` | utils.ts | `makeDrive()` | Unclear abbreviation |
| `h2n()` | utils.ts | `hourToNumber()` or `hourTextToNumber()` | Cryptic abbreviation |
| `shouldIMergeDrives()` | sidurEditor.service.ts | `shouldMergeDrives()` | Grammatically awkward |

**Action**:
1. ⬜ Rename functions with clear, descriptive names
2. ⬜ Update all call sites across codebase
3. ⬜ Update tests if function names are referenced
4. ⬜ Verify build passes

**Estimated Impact**: Low risk, improves readability

---

## Phase 2: Type Safety Improvements (High Priority)

### Step 5: ⬜ Eliminate Unsafe Type Usage

**Problem**: 148 instances of `any`, `@ts-ignore`, or unsafe type assertions

**Action Plan**:

#### 5a. ⬜ Create Proper Type Definitions

Create missing interface definitions for common patterns:
- Redux state shape interfaces
- Event handler types
- Ref types
- API response types

#### 5b. ⬜ Replace `any` in Common Areas

**Priority Areas** (by frequency):
1. ⬜ `useRef<any>()` → `useRef<HTMLElement>()` or specific type
2. ⬜ Redux selectors: `(state: any)` → `(state: RootState)`
3. ⬜ Event handlers: `(event: any)` → `(event: React.ChangeEvent<HTMLInputElement>)`
4. ⬜ Function parameters: `_buildSettings: any` → proper interface type

**Systematic Approach**:
1. ⬜ Search for all `any` usage: `grep -r ": any" src/`
2. ⬜ Categorize by type (refs, events, function params, etc.)
3. ⬜ Create proper types for each category
4. ⬜ Replace `any` with proper types in batches
5. ⬜ Run TypeScript compiler after each batch

**Target**: Reduce from 148 to < 20 instances (only where truly necessary)

**Estimated Impact**: High risk, very high benefit (type safety)

---

## Phase 3: Component Refactoring (Medium Priority)

### Step 6: ⬜ Break Down Large Components

**Problem**: Several components exceed 250 lines with multiple responsibilities

**Target Components**:

#### 6a. ⬜ Refactor Sketch.tsx (353 lines)

**Current Issues**:
- 6 `useState` calls
- 6 `useSelector` calls
- Multiple dialog management
- Complex event handlers

**Refactoring Plan**:
1. ⬜ Extract dialog management → `useSketchDialogs()` custom hook
2. ⬜ Extract order operations → `useSketchOrders()` custom hook
3. ⬜ Create sub-components:
   - `SketchHeader.tsx` (toolbar and actions)
   - `SketchContent.tsx` (main display)
   - `SketchDialogs.tsx` (dialog container)

**Original**: 353 lines → **Target**: 4 files × ~80-100 lines each

#### 6b. ⬜ Refactor location-transport-edit.tsx (340 lines)

**Refactoring Plan**:
1. ⬜ Extract form logic → `useTransportForm()` hook
2. ⬜ Create sub-components:
   - `TransportEditForm.tsx` (form fields)
   - `TransportEditActions.tsx` (save/cancel buttons)
   - `TransportValidation.tsx` (validation display)

**Original**: 340 lines → **Target**: 4 files × ~85-90 lines each

#### 6c. ⬜ Refactor location-group-edit-wrapper.tsx (291 lines)

**Refactoring Plan**:
1. ⬜ Extract wrapper logic → `useLocationGroupEdit()` hook
2. ⬜ Separate concerns:
   - Pure presentation component
   - Business logic in hook
   - API calls in service

**Original**: 291 lines → **Target**: 3 files × ~95-100 lines each

**Estimated Impact**: Medium risk, high benefit (component clarity)

---

### Step 7: ⬜ Create Shared Dialog Base Component

**Problem**: 15 dialog components with similar structure and repetitive code

**Action**:
1. ⬜ Create `BaseDialog.tsx` component with common functionality:
   - Dialog open/close handling
   - Common props interface
   - Standard layout structure
   - Close button placement
2. ⬜ Create `useDialog()` custom hook for state management
3. ⬜ Refactor existing dialogs to use base component (one at a time)
4. ⬜ Test each refactored dialog before moving to next

**Dialog Files to Refactor**:
- sketch-drive-edit-dialog.tsx (243 lines)
- sketch-drive-merge-dialog.tsx (258 lines)
- sidur-management-dialog.tsx (244 lines)
- import-sheets-dialog.tsx
- location-group-edit-dialog.tsx
- (10 more dialog files)

**Estimated Code Reduction**: ~500-800 lines total

**Estimated Impact**: Medium risk, high benefit (reduces duplication)

---

## Phase 4: Performance Optimization (Medium Priority)

### Step 8: ⬜ Add React Performance Optimizations

**Problem**: Missing memoization causing unnecessary re-renders

**Action Plan**:

#### 8a. ⬜ Add `React.memo()` to List Components

**Target Components**:
- Order list items
- Drive list items
- Location list items
- Vehicle list items

**Pattern**:
```typescript
export const OrderListItem = React.memo<OrderListItemProps>((props) => {
    // component implementation
});
```

#### 8b. ⬜ Add `useCallback` for Event Handlers

**Target Areas**:
- Components passing callbacks to children
- Event handlers in lists
- Form submission handlers

**Example**:
```typescript
const handleOrderClick = useCallback((orderId: string) => {
    dispatch(selectOrder(orderId));
}, [dispatch]);
```

#### 8c. ⬜ Add `useMemo` for Expensive Calculations

**Target Areas**:
- Filtered lists
- Sorted data
- Computed aggregations
- Complex transformations

**Example**:
```typescript
const filteredOrders = useMemo(
    () => orders.filter(order => order.status === 'pending'),
    [orders]
);
```

#### 8d. ⬜ Optimize Selector Usage

**Action**:
1. ⬜ Install `reselect` if not present
2. ⬜ Create memoized selectors for computed state
3. ⬜ Replace direct `useSelector` with memoized selectors

**Estimated Impact**: Low risk, medium benefit (performance)

---

## Phase 5: Code Organization (Low Priority)

### Step 9: ⬜ Improve store-utils.ts Organization

**Problem**: Single 171-line file handling multiple unrelated concerns

**Current Responsibilities**:
- CSV export
- ID prefix management
- Local storage persistence
- Session state defaults
- State synchronization

**Refactoring Plan**:
1. ⬜ Split into focused modules:
   - `store/utils/csv-export.ts` (CSV generation)
   - `store/utils/id-management.ts` (ID prefix logic)
   - `store/utils/local-storage.ts` (persistence)
   - `store/utils/session-defaults.ts` (default state)
   - `store/utils/state-sync.ts` (synchronization)
2. ⬜ Create barrel export: `store/utils/index.ts`
3. ⬜ Update import statements

**Original**: 171 lines → **Target**: 5 files × ~30-40 lines each

**Estimated Impact**: Low risk, medium benefit (organization)

---

### Step 10: ⬜ Add Barrel Exports for Cleaner Imports

**Problem**: No index.ts files, leading to verbose import paths

**Action**:
1. ⬜ Create `src/models/index.ts` (export all model types)
2. ⬜ Create `src/components/Dialogs/index.ts` (export all dialogs)
3. ⬜ Create `src/store/index.ts` (export all reducers/actions)
4. ⬜ Create `src/services/index.ts` (export all services)
5. ⬜ Update import statements to use barrel exports

**Example Before**:
```typescript
import { OrderModel } from '../models/order.model';
import { VehicleModel } from '../models/vehicle.model';
import { LocationModel } from '../models/location.model';
```

**Example After**:
```typescript
import { OrderModel, VehicleModel, LocationModel } from '../models';
```

**Estimated Impact**: Low risk, medium benefit (cleaner imports)

---

## Phase 6: Documentation (Low Priority)

### Step 11: ⬜ Add JSDoc Comments to Complex Functions

**Problem**: No documentation for complex business logic

**Priority Functions for Documentation**:

#### 11a. ⬜ Time Conversion Functions (utils.ts)

Functions to document:
- `hourTextToDecimal()` - Converts time text to decimal hours
- `DecimalTimeToHourText()` - Converts decimal hours to time text
- `minutesToFraction()` - Converts minutes to fraction of hour
- `FractionToMinutes()` - Converts fraction to minutes

**Example**:
```typescript
/**
 * Converts time text in format "HH:MM" to decimal hours.
 *
 * @param hourText - Time string in format "HH:MM" (e.g., "14:30")
 * @returns Decimal representation of hours (e.g., 14.5)
 *
 * @example
 * hourTextToDecimal("14:30") // Returns 14.5
 * hourTextToDecimal("09:15") // Returns 9.25
 */
export function hourTextToDecimal(hourText: string): number {
    // implementation
}
```

#### 11b. ⬜ Document sidurBuilder Algorithm

Add module-level documentation explaining:
- Overall algorithm purpose
- Order assignment strategy
- Optimization approach
- Key constraints

#### 11c. ⬜ Document Drive Merging Logic

Add documentation for:
- `shouldMergeDrives()` - Explain merge criteria
- Time overlap calculation logic
- Business rules for merging

**Estimated Impact**: Low risk, medium benefit (maintainability)

---

## Phase 7: Advanced Refactoring (Optional)

### Step 12: ⬜ Refactor import-orders-from-text.ts

**Problem**: 262-line file with complex regex patterns and parsing logic

**Issues**:
- TODO comment indicates incomplete feature (line 201)
- Complex date detection regex
- Multiple parsing strategies in one file
- No error recovery

**Refactoring Plan**:
1. ⬜ Extract regex patterns to constants with explanatory names
2. ⬜ Create separate parser strategies:
   - `DateParser.ts` - Date format detection
   - `OrderTextParser.ts` - Order text parsing
   - `ParserValidator.ts` - Validation logic
3. ⬜ Add error handling and user feedback
4. ⬜ Complete TODO feature or document why it's incomplete

**Original**: 262 lines → **Target**: 4 files × ~65-70 lines each

**Estimated Impact**: Medium risk, medium benefit

---

### Step 13: ⬜ Reduce sessionState Object Size

**Problem**: `sessionState` object has 14+ properties, mixing concerns

**Action**:
1. ⬜ Analyze sessionState properties and categorize by domain
2. ⬜ Consider splitting into multiple state slices:
   - UI state (dialogs, selections)
   - Edit state (current editing context)
   - View preferences (filters, sort order)
3. ⬜ Update reducers and selectors accordingly
4. ⬜ Migrate state gradually (one slice at a time)

**Estimated Impact**: High risk, high benefit (state management clarity)

---

## Testing Strategy

After each phase:

1. ✅ Run TypeScript compiler: `npm run typecheck`
2. ✅ Run tests: `npm test`
3. ✅ Run build: `npm run build`
4. ⚠️ Manual testing of affected features
5. ⚠️ Check browser console for warnings/errors

## Rollback Plan

- Keep each phase in separate commits
- Tag working versions after each phase
- Document any breaking changes
- Keep backup branch before starting

## Success Metrics

### Quantitative Goals:
- ⬜ Reduce files over 300 lines from 5 to 0
- ⬜ Reduce `any` type usage from 148 to < 20
- ⬜ Achieve 100% consistent naming conventions
- ⬜ Eliminate duplicate files (currently 2)
- ⬜ Reduce average file size by 20%

### Qualitative Goals:
- ⬜ Improved developer onboarding experience
- ⬜ Easier to locate and modify code
- ⬜ Better type safety and IDE autocomplete
- ⬜ Reduced cognitive load when reading code
- ⬜ Clearer separation of concerns

## Maintenance Notes

- This refactoring plan should be executed incrementally
- Each phase can be done independently
- Prioritize based on team needs and pain points
- Re-evaluate priorities after completing Phase 1 and 2
- Consider creating GitHub issues for tracking individual steps

## References

- Current codebase structure: `/src/` directory
- Related plans: `01-upgrade-dependencies.md`
- TypeScript strict mode: `tsconfig.json`
- Testing framework: Vitest + React Testing Library

---

**Last Updated**: 2026-03-27
**Status**: ⬜ Not Started
**Next Action**: Begin Phase 1, Step 1 (Resolve Duplicate File Issue)
