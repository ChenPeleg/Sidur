# Update Eshbal Public Transport Data Plan

> Instruction: After you attempt or complete any step in this document, immediately update that step's status emoji to one of: ✅ (done), ⬜ (not done), ⚠️ (in progress), ❌ (blocked). Keep this file updated after every step.

## Goal

Bring every public-transport line to and from Eshbal (אשבל) in the built-in `ESHBAL` location group up to date with the current official timetable: correct lines, directions, stops, travel times and departure times. Remove lines that no longer run and add lines that are missing.

## Scope

**In scope**
- `Transports` array of the `ESHBAL` location group in `src/services/fixtures/sidur-default.json` (about lines 1263–1475).
- Any new `Locations` entries in the same group that new or changed lines need (for example a new junction or terminal).
- Getting the updated data to existing users, whose saved state in `localStorage` overrides the fixture (see Phase 4).
- Tests that cover the new data.

**Out of scope**
- Changing the `TransportModel` schema (unless the decision in step 1.3 requires it).
- UI and styling changes, and the MUI Box → Tailwind migration.
- `Routes` (private driving routes) and any location group other than `ESHBAL`.
- The sample sidur/order comments in the fixture that mention Eshbal.

## Current State (as of 2026-10-29)

### Where the data lives
- `src/services/fixtures/sidur-default.json` → `savedStore.LocationGroups[id="ESHBAL"].Transports` (6 lines, 71 locations, 8 routes).
- It is loaded through `src/store/store-inital-state.ts` → `DefaultSidurFetching`.
- `src/store/reducer.ts` `buildInitialState()` uses `localStorage` (`SaveLoadService.loadFromLocalStorage("chen")`) when saved data exists. The fixture is only a fallback. **Users with saved data will not see fixture changes.**
- The `ESHBAL` group is locked in the UI (`location-group-menu.tsx`: `isEditable = locationGroupMenuId !== "ESHBAL"`). Users cannot fix this data themselves.
- Model (`src/models/Location.model.ts`): `TransportModel { id, name, comments, TransportStops: RoadStopModel[], TransportTime: string[] }`. `TransportTime` holds departure times from the first stop, as `"HH:MM"` strings, with no day-of-week split.
- Consumers (display only; the sidur builder does not use them): `transport-schedual-dialog.tsx`, `LocationsEditTransports/*`, `useTransportEdit.ts` (shows the first `MAX_HOURS_TO_SHOW` times), and `locations-edit.tsx` (marks locations as "used in" a transport).

### Existing lines

| id | Name | Stops (locationId → name) | # times |
|----|------|---------------------------|---------|
| 1 | 169 מצומת יובלים לחיפה | 66 צומת יובלים → 3 חיפה | 9 |
| 2 | קו 42 מאשבל לכרמיאל | HOME_LOCATION → 65 צומת אשבל → 1 כרמיאל → 13 רכבת כרמיאל | 9 |
| 3 | קו 42 מכרמיאל לאשבל | 13 רכבת כרמיאל → 1 כרמיאל → HOME_LOCATION | 8 |
| 4 | 169 מחיפה לצומת יובלים | 3 חיפה → 70 צומת משגב → 66 צומת יובלים | 8 |
| 5 | 265 חיפה צומת יובלים | 3 חיפה → 70 צומת משגב → 66 צומת יובלים | 15 |
| 6 | 265 צומת יובלים חיפה | 66 צומת יובלים → 70 צומת משגב → 3 חיפה | 15 |

### Known data problems to fix along the way
- Line 1: times are out of order (`"09:10"` comes before `"09:00"`).
- Line 1 skips stop 70 (צומת משגב), but its reverse (line 4) and line 265 both include it.
- Line 2 stops at 65 (צומת אשבל), but its reverse (line 3) does not.
- The first stop of every line has a non-zero `minutesFromLast` (20). Decide on one convention (0 for the first stop) or document that the value is ignored.
- Naming is inconsistent: lines 5 and 6 have no "מ…ל…" wording and no "קו" prefix.
### Research findings (2026-10, web aggregators; departure times NOT obtained)
All three lines still exist and are run by Nateev Express (נתיב אקספרס).
- **42**: the only line that stops in Eshbal itself (Eshbal ⇄ Karmiel railway station, via Eshbal junction, Yuvalim junction, the Misgav council and Lev Karmiel). There may also be a pre-booked variant ("42 בהזמנה מראש"). Reported operating windows:
  - Eshbal→Karmiel: Sun–Thu 06:55–22:00, Fri 07:00–13:20, Sat 19:45–22:15.
  - Karmiel→Eshbal: Sun–Thu 06:30–22:10, Fri 08:35–15:05, Sat 21:15–23:20.
  - The fixture's 07:00 and 23:25 departures don't fit these windows.
- **265**: actually Karmiel (Big) ⇄ Haifa Mifratz Central Station, not "Yuvalim junction ⇄ Haifa". Going toward Haifa it passes Eshbal junction (+25 min from Karmiel), Yuvalim junction (+26) and Misgav junction (+27), and reaches Haifa Mifratz at +64. The fixture omits Eshbal junction (location 65), so add that stop. Reported Sun–Thu window: 05:25–22:30.
- **169**: actually Deir Hanna / Sakhnin ⇄ Haifa Mifratz. It passes Yuvalim junction but probably not Eshbal junction or Misgav junction. Fix the line name and stops.
- Sources: busstation.co.il (routes 1:7677 and 1:6563), bus.co.il (265), Moovit. Exact departure times still need the Ministry of Transport GTFS feed (step 1.2).

## Phase 1: Research and Decisions

### 1.1 Get authoritative timetable data ⬜
- Source of truth: the Ministry of Transport GTFS feed (`https://gtfs.mot.gov.il/gtfsfiles/israel-public-transportation.zip`).
- Cross-check against: kavkav.net (קו-קו), bus.co.il, Moovit, and the operator (Nateev Express) site.
- Record the GTFS feed date in the commit message and in each transport's `comments`, for example `"עודכן לפי GTFS 2026-10-xx"`.

### 1.2 Extract all lines touching Eshbal ⬜
- In `stops.txt`, find the stops whose names contain `אשבל`, `צומת אשבל`, `צומת יובלים` and `צומת משגב`. Use only stops within walking distance of Eshbal.
- Using `stop_times.txt` → `trips.txt` → `routes.txt`, list every route and direction that serves those stops. Keep only destinations that matter to the community: Karmiel, Karmiel train, Haifa, Misgav council, and any others found.
- For each route and direction, record:
  - the ordered stops that map to existing `Locations` (boarding stop → main destinations),
  - the travel minutes between those stops (from `stop_times` arrival differences, rounded),
  - the departure times **at the boarding stop near Eshbal** for outbound trips, or at the origin for inbound trips, for each day type (Sun–Thu, Fri, Sat). Use `calendar.txt`.
- Use a throwaway script outside the repo for this, or under the session folder. Do not commit it.

### 1.3 Decide how to handle day-of-week differences ⬜
`TransportTime` holds a single list of times. Options:
- **A (recommended, no schema change):** Put the Sun–Thu times in `TransportTime`. Put the Fri/Sat times in `comments`, for example `"שישי: 07:00, 09:40 | מוצ\"ש: 19:45"`.
- **B:** Add separate transports per day type, such as `"קו 42 מאשבל לכרמיאל (שישי)"`.
- **C:** Extend `TransportModel` with optional day-type times. This needs model, dialog and reducer changes and is out of scope unless requested.

Get the owner's decision before Phase 2.

### 1.4 Write a change table ⬜
Add an appendix to this file that lists each line as keep / update / add / remove, with the old and new values. Get it reviewed before editing the fixture.

## Phase 2: Update the Fixture Data

### 2.1 Add or adjust locations ⬜
- If a new line needs a stop that does not exist yet, add it to `ESHBAL.Locations`. Use the next free numeric `id` (currently the highest is 71), plus `name`, `EnName` and `ETA` (minutes from Eshbal by car).
- Do **not** renumber or remove existing location ids. Routes, orders and saved sidurim reference them.

### 2.2 Update existing lines in place ⬜
- Keep the existing `id` of each line that still runs (`"1"`–`"6"`), so references stay stable.
- Update `name` in one consistent format: `"קו <num> מ<origin> ל<destination>"`.
- Update `TransportStops`: correct order, consecutive `position` values from 1, `minutesFromLast` from GTFS, and the agreed convention for the first stop.
- Replace `TransportTime` with the sorted, de-duplicated, zero-padded `"HH:MM"` departure times for the chosen day type.
- Fill in `comments` (source date and Fri/Sat times if option A is chosen).

### 2.3 Remove discontinued lines ⬜
- Delete transports that GTFS shows no longer serve the Eshbal stops. Research shows 42, 169 and 265 all still run, so expect to remove none. Confirm this against GTFS.

### 2.4 Add missing lines ⬜
- Add new transports with new ids (`"7"`, `"8"`, …), one per direction.

### 2.5 Keep the fixture formatted ⬜
- Keep the JSON's existing 4-space indentation.
- The diff should touch only the `ESHBAL` group (plus `Locations` if step 2.1 applies).

## Phase 3: Validation

### 3.1 Add a data-integrity test ⬜
Add `src/__tests__/eshbal-transports.test.ts` (Vitest). For every transport in `ESHBAL`, it should check that:
- every `TransportStops[].locationId` exists in the group's `Locations` or equals `ConfigService.Constants.HomeLocationId`,
- `position` values are 1..n with no gaps,
- every `TransportTime` entry matches `/^([01]\d|2[0-3]):[0-5]\d$/`, is sorted ascending, and has no duplicates,
- ids are unique and every name is non-empty.

### 3.2 Check the app by hand ⬜
- Clear the `localStorage` key `$123AT6chen` (or use a fresh browser profile) and run `npm run dev`.
- Open Locations → the Eshbal group → the Transports tab. Check each line's stops and times, and the schedule dialog.
- In a sketch, check that the public-transport suggestion still shows the lines (`sketch-order-to-transport-dialog.tsx`).
- Check the RTL display of the new Hebrew names.

### 3.3 Run the build checks ⬜
- `npm run typecheck`, `npm run test`, `npm run build`.

## Phase 4: Getting the Update to Existing Users

Saved `localStorage` state replaces the fixture completely, and the `ESHBAL` group cannot be edited in the UI. Without this phase, current users will keep the old timetables.

### 4.1 Choose a delivery mechanism ⬜ (decide with the owner)
- **A (recommended):** In `buildInitialState()` (`src/store/reducer.ts`), after loading saved state, replace that state's `ESHBAL` group `Transports` (and any newly added `Locations`) with the fixture's values. Base this on a version marker, for example a `defaultDataVersion` field on the store or fixture. User-created groups and sidurim are left alone.
- **B:** Do nothing in code. Tell users to reset or re-import. This is simpler but easy to miss.

### 4.2 If A: test the migration ⬜
Add a unit test showing that a saved state with old `ESHBAL` transports is upgraded, that other groups and sidurim are unchanged, and that the upgrade runs only once (it is version-gated).

## Phase 5: Wrap-up

### 5.1 Update the docs ⬜
- Update the status emojis in this file and add the change-table appendix.
- If option 1.3 C or 4.1 A is chosen, add a short note to `README.md` or `Docs/to-develope.md`.

### 5.2 Open a PR ⬜
- Branch `chore/update-eshbal-public-transport`. Mention the GTFS feed date in the PR description and attach the change table.

## Risks

| Risk | Mitigation |
|------|------------|
| Timetables change again (Israel updates its schedules several times a year) | Record the source date in `comments`. Consider a recurring update reminder. |
| Changing a location id breaks saved routes or orders | Never renumber ids. Only add new ones. |
| The migration overwrites local edits users made | `ESHBAL` cannot be edited in the UI, so the risk is low. Only `Transports` and new `Locations` are replaced. |
| Fri/Sat service is lost because the model holds one list | Decision 1.3 (comments or separate transports). |
| GTFS stop-to-location mapping is ambiguous | Map stops by hand in the change table and get it reviewed (step 1.4). |

## Rollback

- Fixture: `git revert` the data commit. The old values remain in git history.
- Migration (Phase 4 A): revert the reducer change. Already-migrated users keep the new data, which is valid. To force the old data back, bump the version marker and ship the previous `Transports`.
