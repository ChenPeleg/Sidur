# Copilot instructions

## Project

Sidur is a React application for coordinating community transportation. It uses TypeScript, Vite, Redux Toolkit, React Router, MUI, Tailwind CSS, and Vitest. Check `package.json` and the relevant config before assuming versions or behavior.

## Working in this repo

- Follow existing patterns and keep changes focused. Prefer clear, typed TypeScript; avoid `any`, unsafe HTML, and committed secrets.
- Components live in `src/components/`, Redux domains in `src/store/`, and tests in `test/`. Match nearby file naming and organization.
- Use Tailwind utilities for new layout and styling. Do not add MUI `Box`; keep using established MUI components where appropriate. Preserve Hebrew and RTL support.
- Reuse existing dependencies and helpers. Check the project before adding dependencies or introducing abstractions.
- Add or update tests for behavior changes. Use the scripts in `package.json` to run relevant checks; `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` are available.
- Match local formatting and avoid unrelated edits.

## Pull requests

In cloud sessions, open a pull request for every task that changes repository content, using the user's GitHub identity. Skip opening a PR only when the prompt is strictly a question.
