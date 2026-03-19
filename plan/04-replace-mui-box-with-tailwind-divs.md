# Replace MUI `Box` with `div` + Tailwind CSS

> **Instruction**: After you attempt or complete any step in this document, immediately update that step's status emoji to one of: ✅ (done), ⬜ (not done), ⚠️ (in progress), ❌ (blocked/failed). Keep this file updated after every step.

## Goal

Remove all MUI `<Box>` component usage from the project. Replace each `<Box>` with a plain `<div>`, and convert all CSS-in-JS styles (`sx` prop, direct layout props) to Tailwind CSS utility classes.

## Scope

- **222 `<Box>` instances** across **47 files**
- Only `Box` is targeted — other MUI components (`Card`, `Button`, `Typography`, `AppBar`, etc.) remain unchanged
- Tailwind CSS v4 is **already installed** (`@tailwindcss/vite` plugin + `@import "tailwindcss"` in `index.css`)

---

## Current State Analysis

### Tailwind CSS Setup

Already configured:
- `@tailwindcss/vite` in `vite.config.ts`
- `@import "tailwindcss"` in `src/index.css`
- No custom theme overrides yet

### Files Affected (47 files)

| Directory | Files | Approx. Box Instances |
|---|---|---|
| `src/layouts/` | `main-layout.tsx`, `header-layout.tsx` | ~7 |
| `src/components/Sketch/` | 9 files | ~60 |
| `src/components/Orders/` | 4 files | ~30 |
| `src/components/Dialogs/` | 9 files | ~40 |
| `src/components/buttons/` | 8 files | ~30 |
| `src/components/LocationsEdit/` | 6 files | ~20 |
| `src/components/LocationsEditRoutes/` | 1 file | ~10 |
| `src/components/LocationsEditTransports/` | 1 file | ~10 |
| `src/components/NavBar/` | 1 file | ~3 |
| `src/components/Vehicles/` | 1 file | ~3 |
| `src/components/Form/` | 1 file | ~2 |
| `src/components/Icons/` | 1 file | ~2 |
| `src/components/Loading/` | 3 files | ~5 |

### Shared Style Objects in `themes.ts`

```ts
// src/hoc/themes.ts
export const Styles: Record<string, SxProps> = {
    smallIcons: { height: "0.7em", width: "0.7em" },
    flexRow: { display: "flex", flexDirection: "row", alignItems: "start", alignContent: "start" },
    flexColumn: { display: "flex", flexDirection: "column", alignItems: "start", alignContent: "start" },
};
```

These are spread into `sx` props across many files (Sketch, LocationsEdit, LocationsEditRoutes, LocationsEditTransports, Dialogs).

### sx Pattern Categories

| Pattern | Example | Tailwind Equivalent | Frequency |
|---|---|---|---|
| Flex layout | `display: "flex", flexDirection: "row"` | `flex flex-row` | Very High |
| Padding (MUI shorthand) | `p: "0.2em"`, `pl: "0.25em"` | `p-[0.2em] pl-[0.25em]` | High |
| Margin (MUI shorthand) | `m: "0.2em"`, `mb: "0.3em"` | `m-[0.2em] mb-[0.3em]` | High |
| Padding (CSS) | `padding: "10px"` | `p-[10px]` | High |
| Sizing | `width: "10px"`, `height: "50px"` | `w-[10px] h-[50px]` | High |
| Position | `position: "absolute"`, `zIndex: 10000` | `absolute z-[10000]` | Medium |
| Cursor | `cursor: "pointer"` / `cursor: "default"` | `cursor-pointer` / `cursor-default` | Medium |
| Background color | `bgcolor: "#aadcff"` | `bg-[#aadcff]` | Low |
| Font | `fontSize: "48px"`, `fontWeight: "bold"` | `text-[48px] font-bold` | Low |
| Overflow | `overflowY: "auto"` | `overflow-y-auto` | Low |
| Border | `borderBottom: "1px solid grey"` | `border-b border-gray-400` | Low |
| Opacity/Filter | `opacity: "0.5"`, `filter: "grayscale(120%)"` | `opacity-50 grayscale` | Low |
| Direction | `direction: "rtl"` | `dir="rtl"` HTML attribute | Low |
| Box shadow | `boxShadow: "0px -1px 7px..."` | `shadow-[...]` or inline `style` | Low |
| Align/justify | `alignItems: "center"`, `justifyContent: "center"` | `items-center justify-center` | High |

### Edge Cases

1. **Direct props on Box** (not `sx`): `main-layout.tsx` and `header-layout.tsx` use `<Box flexDirection="row" display="flex" ...>` — direct MUI Box props, not `sx`
2. **Theme callbacks**: `header-layout.tsx` `useStyles` uses `(theme) => theme.typography.h1.fontSize` — must be resolved to static values (theme defines `h1.fontSize` as `"3rem"`)
3. **Dynamic SxProps function**: `SketchDrive.tsx` `custumSxMaker()` returns different `SxProps` based on `ChooseDriveMode` state — convert to a function returning className strings
4. **SxProps as component prop**: `order-car-brief.tsx` accepts `sx: SxProps` in its props interface — change to `className: string`
5. **Dynamic boxShadow**: `SketchDrive.tsx` uses `Colors.warningRed.replace("1.0", "0.8")` for computed boxShadow — must use inline `style` attribute
6. **Dynamic bgcolor**: `Colors.warningRed` used in `bgcolor` — use inline `style` or Tailwind arbitrary value with CSS variable
7. **`Styles.smallIcons` on non-Box components**: Used on MUI icons (`<Archive sx={Styles.smallIcons} />`) in `sidur-management-dialog.tsx` — these stay as `sx` since they're on MUI Icon components, not Box
8. **Box inside `<Fade>` wrapper**: `loading.tsx` wraps `<Box>` inside MUI `<Fade>` — `<Fade>` expects a child that accepts `ref`; must use `React.forwardRef` or wrap div in a span

---

## Steps

### Step 1 — Configure Tailwind Theme (optional but recommended)

⬜ **File**: `src/index.css`

MUI default breakpoints differ from Tailwind defaults. If responsive breakpoints are used (currently none found in Box `sx`), add matching overrides. For now, this is optional.

```css
@import "tailwindcss";

@theme {
  --breakpoint-sm: 600px;  /* MUI sm */
  --breakpoint-md: 900px;  /* MUI md */
  --breakpoint-lg: 1200px; /* MUI lg */
  --breakpoint-xl: 1536px; /* MUI xl */
}
```

---

### Step 2 — Convert shared `Styles` object in `themes.ts`

⬜ **File**: `src/hoc/themes.ts`

Convert the `Styles` object from `Record<string, SxProps>` to `Record<string, string>` containing Tailwind class strings.

**Before:**
```ts
export const Styles: Record<string, SxProps> = {
    smallIcons: { height: "0.7em", width: "0.7em" },
    flexRow: { display: "flex", flexDirection: "row", alignItems: "start", alignContent: "start" },
    flexColumn: { display: "flex", flexDirection: "column", alignItems: "start", alignContent: "start" },
};
```

**After:**
```ts
export const Styles = {
    smallIcons: "h-[0.7em] w-[0.7em]",
    flexRow: "flex flex-row items-start content-start",
    flexColumn: "flex flex-col items-start content-start",
} as const;
```

- Remove the `SxProps` import from `@mui/system` if no longer used in this file
- Note: `Styles.smallIcons` is also used on MUI Icon `sx` props (non-Box) — those usages must either be left as inline `sx` objects, or also migrated to `className`

**Decision required**: Since `Styles.smallIcons` is passed to MUI `<Icon sx={...}>` components (not Box), you have two options:
1. Keep a separate `StylesSx` object for MUI components and `Styles` for Tailwind classes
2. Convert Icon sx usages to `className` as well (scope creep — not covered in this plan)

**Recommended**: Option 1 — keep a small `IconStyles` SxProps object for the 4 Icon usages in `sidur-management-dialog.tsx`.

---

### Step 3 — Convert local `SxProps` variables to Tailwind class strings

⬜ Convert the following local `SxProps` variables to `string` constants with Tailwind classes:

| File | Variable | Current Value | Tailwind Classes |
|---|---|---|---|
| `Orders/order-car-form.tsx` | `fieldWrapper` | `{ padding: "10px" }` | `"p-[10px]"` |
| `Orders/order-car-form.tsx` | `selectFieldWrapper` | `{ ...fieldWrapper, paddingBottom: "0px" }` | `"p-[10px] pb-0"` |
| `Orders/order-car-form.tsx` | `advanceFieldWrapper` (inside component) | `{ ...fieldWrapper, paddingBottom: "0px" }` | `"p-[10px] pb-0"` |
| `Orders/order-car-form.tsx` | `fieldWrapperText` | `{ display: "inline-flex", padding: "10px", maxWidth: "150px" }` | `"inline-flex p-[10px] max-w-[150px]"` |
| `Sketch/SketchPendeingOrders.tsx` | `foldingButtonSX` | fold/unfold button styles | Convert to Tailwind string |
| `Loading/loading.tsx` | `loadingSx` | `{ position: "absolute", top: "65px", ... }` | `"absolute top-[65px] left-[75px] h-[50px] w-[50px] z-[10000]"` |
| `Sketch/SketchDrive.tsx` | `custumSxMaker()` | Returns SxProps per mode | Returns className string per mode |

⬜ Remove `SxProps` import from `@mui/system` in each file once all usages are converted.

---

### Step 4 — Convert `order-car-brief.tsx` prop interface

⬜ **File**: `src/components/Orders/order-car-brief.tsx`

Change the component's props from `sx: SxProps` to `className: string`.

**Before:**
```ts
type AppProps = {
    orderId: string;
    sx: SxProps;
    isInEdit: boolean;
};
```

**After:**
```ts
type AppProps = {
    orderId: string;
    className: string;
    isInEdit: boolean;
};
```

⬜ Update all call sites (in `order-car.tsx`) to pass `className` with Tailwind classes instead of `sx` with SxProps.

---

### Step 5 — Replace Box → div: Tier 1 — Empty/simple wrapper Boxes

⬜ Files with Boxes that have **no `sx` prop or minimal styling** — simple tag swap.

For each file:
1. Replace `<Box>` / `<Box>...</Box>` with `<div>` / `<div>...</div>`
2. Remove `Box` from the import statement (remove entire import line if `Box` was the only import)

**Files in this tier** (examples):
- `buttons/warning-icon.tsx` — Box as empty wrapper
- `buttons/app-button.tsx` — Box as empty wrapper
- `Sketch/SketchDrive.tsx` line 73 `<Box>` — wrapper with no sx
- `Orders/order-car.tsx` line 87 `<Box>` — wrapper with no sx
- `Sketch/SketchPendingOrder.tsx` — wrapper Boxes with no sx

---

### Step 6 — Replace Box → div: Tier 2 — Static inline `sx` styles

⬜ Files with Boxes that have **static inline `sx={{ ... }}`** — convert to `className="..."`.

**Conversion approach for each Box:**
```tsx
// Before
<Box sx={{ display: "flex", flexDirection: "row", padding: "10px" }}>

// After
<div className="flex flex-row p-[10px]">
```

**Files in this tier** (~25 files):
- `Dialogs/file-upload-dialog.tsx`
- `Dialogs/import-sheets-dialog.tsx`
- `Dialogs/orders-import-dialog.tsx`
- `Dialogs/sidur-management-dialog.tsx`
- `Dialogs/sketch-drive-edit-dialog.tsx`
- `Dialogs/sketch-drive-merge-dialog.tsx`
- `Dialogs/sketch-order-to-transport-dialog.tsx`
- `Dialogs/transport-schedual-dialog.tsx`
- `Dialogs/vehicle-edit-dialog.tsx`
- `Sketch/Sketch.tsx`
- `Sketch/SketchesContainer.tsx`
- `Sketch/SketchesContainerMessage.tsx`
- `Sketch/sketch-no-sketch-message.tsx`
- `Sketch/SketchPendingOrderBrief.tsx`
- `Sketch/SketchPendingOrderFull.tsx`
- `Orders/orders.tsx`
- `Orders/order-car-form.tsx`
- `buttons/clone-button.tsx`
- `buttons/delete-button.tsx`
- `buttons/order-action-button.tsx`
- `buttons/sketch-vehicle-add-button.tsx`
- `buttons/vertical-hour-field.tsx`
- `buttons/air-bnb-slider.tsx`
- `Form/flexibility-field.tsx`
- `Icons/add-button.tsx`
- `Loading/linear-loading.tsx`
- `Loading/loading-shield.tsx`
- `LocationsEdit/location-cant-edit-message.tsx`
- `LocationsEdit/location-choose-button.tsx`
- `LocationsEdit/location-form.tsx`
- `LocationsEdit/location-group-edit-tabs.tsx`
- `LocationsEdit/location-route-transport-choose.tsx`
- `LocationsEdit/locations-edit.tsx`
- `Vehicles/vehicles.tsx`

---

### Step 7 — Replace Box → div: Tier 3 — Spread shared styles (`Styles.flexRow`, etc.)

⬜ Files that use `sx={{ ...Styles.flexRow, ... }}` or `sx={Styles.flexColumn}` — replace with `className` combining the shared Tailwind constant with additional classes.

**Conversion approach:**
```tsx
// Before
<Box sx={{ ...Styles.flexRow, alignItems: "center" }}>

// After (Styles.flexRow is now a string "flex flex-row items-start content-start")
<div className={`${Styles.flexRow} items-center`}>
```

**Files in this tier:**
- `LocationsEditTransports/locations-transport-edit-wrapper.tsx` — heavy use of `Styles.flexRow` / `Styles.flexCol`
- `LocationsEditRoutes/locations-routes-edit-wrapper.tsx` — same pattern
- `LocationsEdit/locations-edit.tsx`
- `LocationsEdit/location-cant-edit-message.tsx`
- `Sketch/SketchDrive.tsx`
- `Sketch/SketchesContainerMessage.tsx`
- `Dialogs/sketch-order-to-transport-dialog.tsx`
- `Dialogs/sketch-drive-merge-dialog.tsx`

**Note**: Verify `Styles.flexCol` reference (some files use `flexCol` while `themes.ts` defines `flexColumn`) — normalize during conversion.

---

### Step 8 — Replace Box → div: Tier 4 — Edge cases

⬜ **8a. Direct layout props** (`main-layout.tsx`, `header-layout.tsx`)

These use Box props directly instead of `sx`:
```tsx
// Before
<Box flexDirection="row" display="flex" alignItems="start" justifyContent="start">

// After
<div className="flex flex-row items-start justify-start">
```

⬜ **8b. Theme callback styles** (`header-layout.tsx`)

`useStyles` returns objects with theme callbacks like `(theme) => theme.typography.h1.fontSize`. The theme defines `h1.fontSize` as `"3rem"`. Resolve to static values:

```tsx
// Before
headerText: {
    fontSize: (theme) => theme?.typography?.h1.fontSize,  // "3rem"
    margin: (theme) => theme?.typography?.h1.marginTop,   // 0
    padding: "5px",
    display: "flex",
    ...
}

// After — inline the resolved values as Tailwind classes
<div className="text-[3rem] m-0 p-[5px] flex flex-row justify-center items-center">
```

Remove the `useStyles` function entirely after conversion.

⬜ **8c. Dynamic SxProps function** (`SketchDrive.tsx`)

Convert `custumSxMaker` to return Tailwind class strings:

```tsx
// Before
const custumSxMaker = (chooseDriveMode: ChooseDriveMode): SxProps => { ... }

// After
const custumClassMaker = (chooseDriveMode: ChooseDriveMode): string => {
    switch (chooseDriveMode) {
        case ChooseDriveMode.nonSelectable:
            return "grayscale opacity-50";
        case ChooseDriveMode.selectable:
            return "drop-shadow-[0px_0px_3px_#00b705]";
        case ChooseDriveMode.NotActive:
        default:
            return "";
    }
};
```

This function's return value is currently spread into a `Card` `sx` prop (not Box) — the Card migration is out of scope, but the function should still be converted so it's ready, OR leave as-is if only used on Card.

⬜ **8d. Dynamic background color / boxShadow** (`SketchDrive.tsx`)

`bgcolor: Colors.warningRed` and computed `boxShadow` with `Colors.warningRed.replace(...)` cannot be purely Tailwind. Use inline `style`:

```tsx
<div
    className="z-50 relative m-[0.2em] mb-[0.3em] flex flex-row items-stretch justify-start cursor-default px-[0.5em]"
    style={{
        backgroundColor: Colors.warningRed,
        boxShadow: `0px -1px 7px 7px ${Colors.warningRed.replace("1.0", "0.8")}`,
    }}
>
```

⬜ **8e. Box inside `<Fade>` wrapper** (`Loading/loading.tsx`)

MUI `<Fade>` requires its child to accept a `ref`. A plain `<div>` handles this natively, so this is a straightforward replacement — no `forwardRef` needed.

⬜ **8f. `dir="rtl"` attribute** (`NavBar/app-nav-bar.tsx`)

Box with `dir="rtl"` — simply move the attribute to the `<div>`:
```tsx
<div dir="rtl" className="...">
```

⬜ **8g. Conditional SxProps** (`Orders/order-car.tsx`)

`briefOrderStyle` is conditionally an empty object or `{ cursor: "pointer", bgcolor: { transition: ... } }`. Convert to conditional className:
```tsx
const briefOrderClass = props.isInEdit ? "" : "cursor-pointer transition-colors duration-100";
```

Note: This style is applied to a `Card` `sx`, not to `Box` — verify during implementation.

---

### Step 9 — Clean up imports

⬜ In every modified file:
1. Remove `Box` from `@mui/material` or `@mui/system` import
2. Remove `SxProps` from `@mui/system` import if no longer used
3. Remove the import line entirely if `Box` / `SxProps` was the only import from that module
4. Remove `Styles` import from `themes.ts` if the file no longer uses it (unlikely — most files will still use the Tailwind string version)

---

### Step 10 — Build & smoke test

⬜ Run `npm run build` — fix any TypeScript / compilation errors
⬜ Run `npm run dev` — visually verify:
  - Header layout (icon + title alignment)
  - Main layout (flex row container, margin)
  - Orders view (order cards, form fields, padding)
  - Sketch view (drives, pending orders, overlap warnings)
  - Locations view (routes, transports, edit wrappers)
  - Dialogs (all 9 dialog files)
  - Loading spinner (position, z-index)
  - Nav bar (RTL direction)
⬜ Run `npm run test` — fix any broken selectors or snapshot tests

---

## SxProps → Tailwind Quick Reference

| MUI `sx` Property | Tailwind Class |
|---|---|
| `display: "flex"` | `flex` |
| `display: "inline-flex"` | `inline-flex` |
| `flexDirection: "row"` | `flex-row` |
| `flexDirection: "column"` | `flex-col` |
| `flexWrap: "wrap"` | `flex-wrap` |
| `flexGrow: 1` | `grow` |
| `flexShrink: 4` | `shrink-[4]` |
| `alignItems: "start"` | `items-start` |
| `alignItems: "center"` | `items-center` |
| `alignItems: "stretch"` | `items-stretch` |
| `alignContent: "start"` | `content-start` |
| `justifyContent: "start"` | `justify-start` |
| `justifyContent: "center"` | `justify-center` |
| `justifyContent: "space-around"` | `justify-around` |
| `p: "10px"` / `padding: "10px"` | `p-[10px]` |
| `pl: "0.25em"` | `pl-[0.25em]` |
| `pr: "0.25em"` | `pr-[0.25em]` |
| `pb: "0px"` / `paddingBottom: "0px"` | `pb-0` |
| `m: "0.2em"` / `margin: "0.2em"` | `m-[0.2em]` |
| `mb: "0.3em"` | `mb-[0.3em]` |
| `mt: "10px"` | `mt-[10px]` |
| `ml: "5px"` | `ml-[5px]` |
| `mr: "5px"` | `mr-[5px]` |
| `width: "10px"` | `w-[10px]` |
| `height: "50px"` | `h-[50px]` |
| `minWidth: "100px"` | `min-w-[100px]` |
| `minHeight: "10vh"` | `min-h-[10vh]` |
| `maxWidth: "150px"` | `max-w-[150px]` |
| `position: "absolute"` | `absolute` |
| `position: "relative"` | `relative` |
| `top: "65px"` | `top-[65px]` |
| `left: "75px"` | `left-[75px]` |
| `zIndex: 10000` | `z-[10000]` |
| `cursor: "pointer"` | `cursor-pointer` |
| `cursor: "default"` | `cursor-default` |
| `bgcolor: "#aadcff"` | `bg-[#aadcff]` |
| `color: "#fff"` | `text-white` |
| `fontSize: "48px"` | `text-[48px]` |
| `fontWeight: "bold"` | `font-bold` |
| `overflowY: "auto"` | `overflow-y-auto` |
| `overflow: "auto"` | `overflow-auto` |
| `borderBottom: "1px solid grey"` | `border-b border-gray-400` |
| `opacity: "0.5"` | `opacity-50` |
| `filter: "grayscale(120%)"` | `grayscale` |
| `textAlign: "center"` | `text-center` |
| `direction: "rtl"` | Use `dir="rtl"` attribute |
| `boxShadow: "..."` (dynamic) | Use inline `style` |
| `margin: "20px"` | `m-5` or `m-[20px]` |

---

## Rollback Plan

All changes are purely presentational replacements. If visual regressions are found:
1. Revert the affected file(s) using `git checkout`
2. Re-examine the sx → Tailwind mapping for that component
3. Use browser DevTools to compare computed styles before/after

## Considerations

- **No responsive breakpoints** are currently used in any Box `sx` prop — Step 1 (theme config) is optional
- **`Styles.smallIcons`** is used on MUI Icon components (not Box) — leave those `sx` usages in place
- **`custumSxMaker` result is spread into a `Card` `sx`** — converting the function is optional since Card is out of scope; only convert if the return value is also used on Box
- **MUI spacing multiplier** is not used — all values are explicit strings like `"10px"` or `"0.2em"`, so no MUI 8px-grid conversion is needed
- After this migration, evaluate whether `@mui/system` can be removed from `package.json` (depends on remaining MUI component usage)

