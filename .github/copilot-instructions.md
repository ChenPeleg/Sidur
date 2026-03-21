# GitHub Copilot Instructions for Sidur

## Project Overview

Sidur is a React-based application for managing communal community transportation needs. The project is currently under active modernization and refactoring.

## Technology Stack

- **Frontend Framework**: React 19.2.4 with TypeScript (strict mode)
- **Build Tool**: Vite 7.3.1
- **State Management**: Redux Toolkit 2.11.2 with domain-separated reducers
- **UI Components**: Material-UI (MUI) v7.3.7
- **Styling**: Transitioning from MUI Box to Tailwind CSS v4
- **Routing**: React Router 7.13.0
- **Testing**: Vitest 4.0.18 with React Testing Library 16.3.2
- **Node Version**: 24.x (required)

## Code Style and Formatting

### TypeScript Configuration
- Use TypeScript in strict mode
- Target: ES2021
- JSX: react-jsx transform
- Always provide type annotations for function parameters and return types
- Use interfaces for component props

### Formatting (Prettier)
- **Indentation**: 4 spaces (tabWidth: 4)
- **Quotes**: Double quotes (singleQuote: false)
- **Semicolons**: Required (semi: true)
- **Trailing commas**: ES5 style
- **Line endings**: Auto

### Linting (ESLint)
- Follows @typescript-eslint/recommended rules
- Prettier integration enabled
- Warnings for prettier/prettier violations

## Component Architecture

### File Organization
- Components are organized by feature domain in `src/components/`
- Redux reducers are separated by domain in `src/store/`
- Shared styles and themes in `src/hoc/themes.ts`
- Test utilities in `src/__tests-utils__/`

### Component Structure
```typescript
// Preferred component structure
import React from "react";
import { useSelector, useDispatch } from "react-redux";

interface ComponentNameProps {
    propName: string;
    className?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
    const dispatch = useDispatch();
    const stateValue = useSelector((state: RootState) => state.domain.value);

    return (
        <div className="flex flex-col">
            {/* Component content */}
        </div>
    );
};
```

## Styling Guidelines

### Tailwind CSS Migration (In Progress)
- **DO**: Use Tailwind CSS utility classes for new components
- **DO**: Use `className` prop for styling
- **DO NOT**: Add new MUI `<Box>` components (use `<div>` instead)
- **DO NOT**: Use `sx` prop on new components
- **ONGOING**: Active migration from MUI Box to Tailwind div (see `plan/04-replace-mui-box-with-tailwind-divs.md`)

### Common Tailwind Patterns
```typescript
// Flex layouts (prefer these over MUI Box)
<div className="flex flex-row items-start content-start">
<div className="flex flex-col items-center justify-center">

// Spacing with arbitrary values
<div className="p-[10px] mb-[0.3em]">

// Dynamic styles (use template literals)
<div className={`${baseClass} ${isActive ? "opacity-100" : "opacity-50"}`}>
```

### Legacy MUI Components (Keep Using)
- Continue using MUI components like `Card`, `Button`, `Typography`, `AppBar`, `TextField`
- Only Box component is being replaced
- Icons can still use `sx` prop for sizing

## State Management

### Redux Store Structure
The store is organized into domain-specific reducers:
- `display` - UI display state
- `import-export` - Data import/export operations
- `location`, `locationGroup` - Location management
- `order`, `pendingOrders` - Order management
- `route` - Route planning
- `sidur` - Core scheduling
- `sketch`, `sketch-drive` - Sketch operations
- `transport`, `vehicle` - Transport and vehicle management

### Redux Toolkit Patterns
```typescript
// Use Redux Toolkit createSlice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Use typed selectors
const value = useSelector((state: RootState) => state.domain.value);

// Use typed dispatch
const dispatch = useDispatch<AppDispatch>();
```

## Testing

### Test Framework
- Use Vitest for all tests
- Use React Testing Library for component testing
- Use `@testing-library/jest-dom` matchers

### Test Commands
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Interactive test UI

### Test File Location
- Place tests in `src/__tests__/` directory
- Use `.test.ts` or `.test.tsx` extensions
- Test utilities should go in `src/__tests-utils__/`

### Testing Best Practices
```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("ComponentName", () => {
    it("should render correctly", () => {
        render(<ComponentName />);
        expect(screen.getByText("Expected Text")).toBeInTheDocument();
    });
});
```

## Build and Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - TypeScript check + production build
- `npm run typecheck` - Run TypeScript compiler checks
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier

### Build Process
1. Always run `npm run typecheck` before committing
2. Fix all TypeScript errors before creating PRs
3. Build must succeed: `npm run build`
4. Tests must pass: `npm run test`

## Deployment Targets

The project has multiple deployment configurations:
- **GitHub Pages**: `npm run build:gh-pages` (production-github mode)
- **Firebase**: `npm run build:site` (production-firebase mode)

## Security and Best Practices

### Security Requirements
- **DO NOT** commit secrets, API keys, or credentials
- **DO NOT** use `dangerouslySetInnerHTML` without explicit sanitization
- Validate and sanitize all user input
- Use TypeScript's strict mode for type safety

### Code Quality
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use meaningful variable and function names

## Current Refactoring Efforts

### Active Migrations (see `/plan/` directory)
1. **MUI Box → Tailwind div**: Removing all 222 Box instances across 47 files
2. **React 19 upgrade**: Completed (March 2026)
3. **React Router 7**: Completed
4. **MUI v7**: Completed

### Status Emoji Convention in Documentation
When updating plan files, use these emojis:
- ✅ Done/Completed
- ⬜ Not started
- ⚠️ In progress
- ❌ Blocked/Failed

## Right-to-Left (RTL) Support

This project includes Hebrew language support:
- Use `dir="rtl"` attribute on containers when needed
- Test UI layouts in both LTR and RTL modes
- Be aware of directional CSS properties

## Dependencies

### Adding New Dependencies
- Prefer existing dependencies over adding new ones
- Check if functionality exists in current stack before adding libraries
- Update `package.json` with specific versions (no `^` or `~` for major dependencies)
- Run `npm install` and test thoroughly after adding dependencies

### Current Major Dependencies
- React ecosystem (react, react-dom, react-redux, react-router)
- MUI (material-ui, emotion, mui icons)
- Redux (@reduxjs/toolkit)
- Tailwind CSS (@tailwindcss/vite)
- TypeScript
- Vite (build tool)
- Vitest (testing)

## Documentation

### Code Comments
- Use comments sparingly - prefer self-documenting code
- Add JSDoc comments for complex functions and public APIs
- Document "why" not "what" when comments are needed

### Plan Files
- Follow the format in `/plan/` directory
- Include clear goals, scope, and step-by-step instructions
- Update status emojis as work progresses
- Include rollback plans for major changes

## CI/CD

### GitHub Actions Workflows
- `ci-tests.yml` - Runs tests on every push
- `deploy-gh-pages.yml` - Deploys to GitHub Pages
- `deploy-to-site.yml` - Deploys to Firebase

### PR Requirements
- All CI checks must pass
- TypeScript compilation must succeed
- Tests must pass
- Code must be formatted with Prettier

## File Naming Conventions

- Components: kebab-case (e.g., `order-car-form.tsx`)
- Types/Interfaces: PascalCase in same file as component
- Utilities: kebab-case
- Test files: `*.test.ts` or `*.test.tsx`

## Import Organization

```typescript
// 1. External dependencies
import React from "react";
import { useSelector } from "react-redux";

// 2. MUI components
import { Card, Button, Typography } from "@mui/material";

// 3. Internal components
import { OrderCarForm } from "../Orders/order-car-form";

// 4. Types
import type { Order } from "../models/order";

// 5. Styles and utilities
import { Styles } from "../hoc/themes";
```

## Common Patterns to Follow

### Shared Styles
```typescript
// Use Styles constants from themes.ts
import { Styles } from "../hoc/themes";

<div className={Styles.flexRow}>
<div className={`${Styles.flexColumn} items-center`}>
```

### Conditional Rendering
```typescript
// Prefer logical AND for simple conditions
{isVisible && <Component />}

// Use ternary for if-else
{isLoading ? <Loading /> : <Content />}
```

### Event Handlers
```typescript
// Define handlers inline for simple operations
<button onClick={() => dispatch(action())}>

// Extract handlers for complex logic
const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Complex logic here
};
```

## Avoid

- ❌ Adding new MUI `<Box>` components (use `<div>` with Tailwind)
- ❌ Using `sx` prop on new components (use `className`)
- ❌ Inline styles unless absolutely necessary (dynamic colors, shadows)
- ❌ Any/unknown types (use proper TypeScript types)
- ❌ Console.log in production code (use proper logging if needed)
- ❌ Modifying code outside the scope of your task
- ❌ Over-engineering solutions
