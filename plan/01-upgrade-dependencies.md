# Dependency Upgrade Plan

## Overview
This document outlines the dependencies that need to be upgraded and the steps required for complex upgrades.

## Current Status (as of 2026-01-28)

### Major Version Upgrades Required

#### 🔴 **React 18 → 19** (Breaking Changes Expected)
- **Current**: 18.3.1
- **Latest**: 19.2.4
- **Impact**: HIGH - Core dependency affecting entire application
- **Breaking Changes**:
  - New JSX transform improvements
  - React Server Components (if using)
  - Concurrent rendering changes
  - Removed deprecated APIs (e.g., ReactDOM.render)

**Upgrade Steps**:
1. Review [React 19 release notes](https://react.dev/blog/2024/04/25/react-19)
2. Update both `react` and `react-dom` together: `npm install react@19 react-dom@19`
3. Update `@types/react` and `@types/react-dom` to version 19
4. Check for deprecated API usage (findDOMNode, legacy context, etc.)
5. Test all components thoroughly
6. Update testing library if needed
7. Review and update any third-party libraries that depend on React

#### 🔴 **MUI X Date Pickers 7 → 8** (Breaking Changes Expected)
- **Current**: 7.29.4
- **Latest**: 8.26.0
- **Impact**: HIGH - Major version change in date picker components
- **Breaking Changes**:
  - API changes in date picker components
  - Prop renames or removals
  - Possible styling changes
  - Date adapter changes

**Upgrade Steps**:
1. Review [MUI X v8 migration guide](https://mui.com/x/migration/migration-pickers-v7/)
2. Check for breaking changes in used components (DatePicker, DateTimePicker, etc.)
3. Update: `npm install @mui/x-date-pickers@latest`
4. Update date adapter if using one (date-fns-adapter)
5. Test all date picker implementations
6. Update props that have been renamed or removed
7. Verify date formatting and localization still works

#### 🟡 **Final Form 4 → 5** (Moderate Impact)
- **Current**: 4.20.10
- **Latest**: 5.0.0
- **Impact**: MEDIUM - Form library upgrade
- **Note**: Also requires upgrading `react-final-form` to v7

**Upgrade Steps**:
1. Review final-form v5 changelog
2. Update both packages: `npm install final-form@5 react-final-form@7`
3. Test all forms in the application
4. Check for API changes in field validators and form subscriptions
5. Verify form submission and validation logic

#### 🟡 **Web Vitals 4 → 5** (Low Impact)
- **Current**: 4.2.4
- **Latest**: 5.1.0
- **Impact**: LOW - Performance monitoring library

**Upgrade Steps**:
1. Review web-vitals v5 changelog
2. Update: `npm install web-vitals@latest`
3. Check if reportWebVitals implementation needs updates
4. Test performance monitoring still works

### Minor/Patch Updates

#### 🟢 **@mui/lab** (Beta version update)
- **Current**: 7.0.0-beta.17
- **Latest**: 7.0.1-beta.21
- **Impact**: LOW - Beta version, likely bug fixes
- **Command**: `npm install @mui/lab@latest`

#### 🟢 **@types/node**
- **Current**: 22.19.7
- **Latest**: 25.0.10
- **Impact**: LOW - Type definitions only
- **Command**: `npm install -D @types/node@latest`

## Recommended Upgrade Order

1. **Phase 1: Low Risk Updates**
   - `@mui/lab@latest`
   - `@types/node@latest`
   - `web-vitals@latest`

2. **Phase 2: Form Libraries** (before React 19)
   - `final-form@5`
   - `react-final-form@7`
   - Test all forms thoroughly

3. **Phase 3: React 19 Upgrade** (Major)
   - Create a separate branch
   - `react@19` and `react-dom@19`
   - Update `@types/react@19` and `@types/react-dom@19`
   - Update testing libraries if needed
   - Comprehensive testing

4. **Phase 4: MUI X Date Pickers** (After React 19 is stable)
   - `@mui/x-date-pickers@8`
   - Test all date picker components
   - Verify integration with updated MUI core

## MUI Ecosystem Compatibility

**Current MUI Versions**:
- `@mui/material`: 7.3.5 ✅ (latest)
- `@mui/icons-material`: 7.3.5 ✅ (latest)
- `@mui/lab`: 7.0.0-beta.17 (update available)
- `@mui/x-date-pickers`: 7.29.4 (major update available)
- `@emotion/react`: 11.14.0 ✅ (latest)
- `@emotion/styled`: 11.14.0 ✅ (latest)

**Notes**:
- MUI v7 is compatible with React 18
- Need to verify MUI v7 + React 19 compatibility before upgrading React
- MUI X v8 may require React 19 or have specific compatibility requirements

## Testing Strategy

After each phase:
1. Run TypeScript compiler: `npm run build`
2. Run tests: `npm test`
3. Start dev server: `npm run dev`
4. Manual testing of affected features
5. Check browser console for warnings/errors
6. Test production build: `npm run build:prod`

## Rollback Plan

- Create git branch before each phase
- Commit after each successful upgrade
- Document any issues encountered
- Keep package-lock.json for quick rollback

## Additional Considerations

- **React Router**: Currently on v7.2.1 (latest) ✅
- **Redux**: Currently on v5.0.1 (latest) ✅
- **TypeScript**: v5.7.3 (latest) ✅
- **Vite**: v6.0.7 (latest) ✅

All build tools and state management libraries are up to date!
