# Replace `react-final-form` with vanilla form handling

## Goal
Remove the dependency on `react-final-form` and manage the `OrderCarForm` state using React's `useState`. This simplifies the form logic and removes an external dependency.

## User Review Required
- **Validation Side Effects**: The current implementation dispatches `UPDATE_ORDER_IN_EDIT` to Redux during the *validation* phase of `react-final-form`. This behavior essentially syncs local form state to global Redux state on every keystroke/change. The new implementation will maintain this behavior by dispatching updates directly in the change handlers.

## Proposed Changes
### Components
#### [MODIFY] [order-car-form.tsx](file:///c:/Projects/Sidur/src/components/Orders/order-car-form.tsx)
- **State Management**: Introduce `useState` to hold the form data, initialized from `initialValues`.
- **Event Handling**: Create a generic `handleFieldChange` function to update local state and dispatch the `UPDATE_ORDER_IN_EDIT` action immediately, preserving current behavior.
- **Component Replacement**:
  - Remove `<Form>` wrapper.
  - Replace `<Field>` components with the actual render components (`RenderTextField`, `RenderSelectField`, etc.).
  - Adapter Pattern: Wrap the direct component usage to provide the `input` and `meta` props that these existing components expect (e.g., `input: { value, onChange, name }`).

### Dependencies
#### [MODIFY] [package.json](file:///c:/Projects/Sidur/package.json)
- Uninstall `react-final-form` and `final-form`.

## Verification Plan
### Manual Verification
1. **Start Application**: Run `npm start`.
2. **Navigate** to an Order (Edit mode) or Create New Order.
3. **Edit Fields**:
   - Change `Driver Name` -> Verify UI updates and Redux state updates (if observable via other UI elements).
   - Change `Type of Drive` -> Verify the "Where" field label updates (it relies on `LanguageUtilities` which takes `typeOfDrive` as arg).
   - Change `Start Hour` / `Finish Hour`.
4. **Advanced Mode**: Click "Advanced" and verify `flexibility` field appears and is editable.
5. **Submit**: Click "Submit" and verify the `UPDATE_ORDER` action is dispatched (form submission logic).
