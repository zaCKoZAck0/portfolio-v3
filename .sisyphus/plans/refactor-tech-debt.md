# Portfolio App Refactor & Tech Debt Cleanup

## TL;DR

> **Quick Summary**: Comprehensive refactoring of a React + TypeScript + Vite portfolio app — eliminating dead code, splitting oversized components into hooks, consolidating scattered theme values into CSS variables, fixing accessibility gaps (clickable divs → semantic buttons), removing a dangerous Python mutation script, and adding performance optimizations.
> 
> **Deliverables**:
> - Dead code removed (AppContext.tsx, update_tabs.py, barrel indirection)
> - Window.tsx split into component + hooks (useWindowDrag, useWindowResize)
> - VSCodeContent.tsx split into smaller concerns (useEditorState hook, useExplorerResize hook, useScrollSync hook)
> - Centralized theme CSS variables replacing 77 hardcoded color values
> - Centralized UI constants config (sizes, paths)
> - Accessible interactive elements (4 components fixed)
> - ErrorBoundary added
> - ESLint upgraded to type-aware rules
> - Type assertions eliminated or narrowed
> - Performance: React.memo, externalized CSS, cleaned closures
> - Package.json dependency classification fixed
> 
> **Estimated Effort**: Medium (2-4 days with parallel execution)
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 (theme config) → Task 7 (Window.tsx split) → Task 8 (VSCodeContent.tsx split) → Final Verification

---

## Context

### Original Request
User requested code refactoring and tech debt identification for their portfolio app — a desktop/VS Code-like UI built with React 19, TypeScript, Vite 8, Zustand, Framer Motion, and Tailwind CSS.

### Interview Summary
**Key Discussions**:
- **Priority**: Both code quality/maintainability AND performance — comprehensive cleanup
- **Scope**: Moderate — restructure where needed, keep overall approach (Zustand, component hierarchy)
- **Risk tolerance**: Personal/in-development — more freedom for breaking changes
- **Tests**: No automated tests — agent-executed QA scenarios (Playwright, build verification) only
- **Accessibility**: Yes — fix semantic HTML, ARIA roles, keyboard handlers
- **CI/CD**: Skip for now

**Research Findings**:
- Architecture agent mapped full component tree: App → TopBar + Dock + Desktop → Window → VSCodeContent/FilesContent
- 3 oversized files: Window.tsx (300 lines), VSCodeContent.tsx (226 lines), store/windows.ts (210 lines)
- AppContext.tsx: zero external references — confirmed dead code
- 77 hardcoded color instances across 13 files
- update_tabs.py targets non-existent code (`openFileIds`) — truly orphaned and dangerous
- Barrel chain: Desktop → windows/VSCodeContent → vscode/index → vscode/VSCodeContent (3 hops)
- Single selector-less Zustand call in Window.tsx line 40

### Metis Review
**Identified Gaps** (addressed):
- Theme centralization scope: Limited to CSS variables for top ~10 repeated colors, not all 77 instances in one pass
- Window.tsx split: dragControls coupling between title bar and motion.div must be preserved when extracting hooks
- Zustand selector-less call (Window.tsx:40): Must fix during Window.tsx refactor
- Barrel chain: Simplify to 1 hop max

---

## Work Objectives

### Core Objective
Eliminate tech debt, improve code structure through component splitting and hook extraction, centralize scattered configuration, fix accessibility gaps, and add performance optimizations — all while preserving existing visual behavior.

### Concrete Deliverables
- Deleted: `update_tabs.py`, `src/AppContext.tsx`, `src/components/windows/VSCodeContent.tsx` (trivial re-export)
- New files: `src/hooks/useWindowDrag.ts`, `src/hooks/useWindowResize.ts`, `src/hooks/useEditorState.ts`, `src/hooks/useExplorerResize.ts`, `src/hooks/useScrollSync.ts`, `src/config/ui.ts`, `src/components/ErrorBoundary.tsx`
- Modified: Window.tsx, VSCodeContent.tsx (significantly smaller), EditorTabs.tsx, ActivityBar.tsx, FileExplorer.tsx, Dock.tsx, Breadcrumbs.tsx, MarkdownPreview.tsx, MarkdownEditor.tsx, index.css, eslint.config.js, package.json, .gitignore, Desktop.tsx, vscode/index.ts

### Definition of Done
- [ ] `pnpm build` succeeds with zero errors
- [ ] `pnpm lint` succeeds with zero errors (under new type-aware ESLint)
- [ ] All interactive elements are keyboard-navigable (Tab/Enter/Space)
- [ ] Visual appearance unchanged (verified via Playwright screenshots)
- [ ] No `update_tabs.py` or `AppContext.tsx` in codebase
- [ ] Zero `as number` casts in Window.tsx

### Must Have
- All existing visual behavior preserved — this is a refactor, not a redesign
- Zustand remains the single state management solution
- Framer Motion drag/resize behavior unchanged
- Every component that renders today must render identically after refactor

### Must NOT Have (Guardrails)
- NO new features — only structural improvements
- NO visual changes — pixel-identical output
- NO new dependencies except ErrorBoundary (built-in React pattern)
- NO over-abstraction — if a hook would only be used once AND is <20 lines, keep it inline
- NO premature memoization — only React.memo components that receive stable parent but re-render due to reference changes
- NO full theme system — just CSS variables for the top repeated colors; don't rewrite every className
- NO touching store/windows.ts internal logic — only fix the selector-less call and the `as WindowState` cast

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: None
- **Approach**: Agent-Executed QA Scenarios only

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build verification**: Use Bash — `pnpm build`, `pnpm lint`
- **Type checking**: Use Bash — `pnpm exec tsc --noEmit`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — independent cleanup & config, START IMMEDIATELY):
├── Task 1: Centralize theme CSS variables + UI constants config [quick]
├── Task 2: Remove dead code (AppContext.tsx, update_tabs.py) [quick]
├── Task 3: Fix package.json deps + .gitignore + ESLint type-aware upgrade [quick]
├── Task 4: Add ErrorBoundary component [quick]
├── Task 5: Externalize inline CSS (MarkdownPreview + MarkdownEditor scrollbar styles) [quick]
└── Task 6: Fix type assertions in Breadcrumbs.tsx + store/windows.ts [quick]

Wave 2 (Component Splitting — depends on Wave 1 theme config):
├── Task 7: Split Window.tsx — extract useWindowDrag + useWindowResize hooks [deep]
├── Task 8: Split VSCodeContent.tsx — extract useEditorState + useExplorerResize + useScrollSync hooks [deep]
└── Task 9: Simplify barrel chain (Desktop import path) [quick]

Wave 3 (Accessibility + Performance — depends on Wave 2 component structure):
├── Task 10: Fix accessibility in EditorTabs.tsx (tabs → buttons, ARIA, keyboard) [unspecified-high]
├── Task 11: Fix accessibility in ActivityBar.tsx + Dock.tsx (buttons, ARIA, keyboard) [unspecified-high]
├── Task 12: Fix accessibility in FileExplorer.tsx (tree roles, ARIA-expanded, keyboard nav) [unspecified-high]
├── Task 13: Add React.memo + optimize inline closures across pure components [unspecified-high]
└── Task 14: Apply centralized theme CSS variables across all components [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: Task 1 → Task 7/8 → Task 13/14 → F1-F4 → user okay
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 6 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 7, 8, 14 |
| 2 | — | 9 |
| 3 | — | — |
| 4 | — | — |
| 5 | — | — |
| 6 | — | 7 |
| 7 | 1, 6 | 10, 13 |
| 8 | 1 | 10, 12, 13 |
| 9 | 2 | — |
| 10 | 7, 8 | — |
| 11 | — | — |
| 12 | 8 | — |
| 13 | 7, 8 | — |
| 14 | 1 | — |

### Agent Dispatch Summary

- **Wave 1**: **6 tasks** — T1-T6 → `quick`
- **Wave 2**: **3 tasks** — T7 → `deep`, T8 → `deep`, T9 → `quick`
- **Wave 3**: **5 tasks** — T10-T12 → `unspecified-high`, T13 → `unspecified-high`, T14 → `unspecified-high`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. Centralize Theme CSS Variables + UI Constants Config

  **What to do**:
  - Create `src/config/ui.ts` exporting UI constants:
    - `ICON_BASE = "/icons"` (currently hardcoded in `src/components/vscode/icons.tsx:1`)
    - `DOCK_ICON_PATH = "/icons/dock"` (currently hardcoded in `src/components/Dock.tsx:35-38,64-66`)
    - `WINDOW_MIN_WIDTH = 300`, `WINDOW_MIN_HEIGHT = 200` (from `Window.tsx:133-134`)
    - `EXPLORER_DEFAULT_WIDTH = 200`, `EXPLORER_MIN_WIDTH = 120`, `EXPLORER_MAX_WIDTH = 500` (from `VSCodeContent.tsx:31,148-151`)
  - Add CSS custom properties to `src/index.css` under `:root` for the top 8-10 most repeated VS Code theme colors:
    - `--vsc-bg-primary: #1e1e1e` (editor background)
    - `--vsc-bg-secondary: #252526` (sidebar/panel background)
    - `--vsc-bg-tertiary: #2c2c2c` (input/hover background)
    - `--vsc-accent: #007acc` (selection/focus blue)
    - `--vsc-text-primary: #d4d4d4` (main text)
    - `--vsc-text-secondary: #cccccc` (secondary text)
    - `--vsc-border: #333333` (borders)
    - `--vsc-tab-active-bg: #1e1e1e` (active tab)
    - `--vsc-tab-inactive-bg: #2d2d2d` (inactive tab)
  - Do NOT rewrite all 77 color instances now — that's Task 14. This task only creates the variables.

  **Must NOT do**:
  - Do NOT create a full design system or theme switching capability
  - Do NOT add new dependencies (no styled-components, no CSS-in-JS)
  - Do NOT touch component files in this task — only create config/ui.ts and update index.css

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Creating two new files with known values — straightforward extraction
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — this is config setup, not visual work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5, 6)
  - **Blocks**: Tasks 7, 8, 14
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/config/vscode.ts` — Existing config file pattern; follow same export style (named exports, TypeScript interfaces)
  - `src/index.css` — Current CSS structure; add `:root` block with custom properties after the Tailwind import

  **API/Type References**:
  - `src/components/vscode/icons.tsx:1` — Current `ICON_BASE = "/icons"` definition to extract
  - `src/components/Window.tsx:133-134` — `MIN_WIDTH = 300, MIN_HEIGHT = 200` to extract
  - `src/components/vscode/VSCodeContent.tsx:31,148-151` — Explorer width defaults to extract

  **External References**:
  - CSS custom properties: standard CSS spec, no library needed

  **WHY Each Reference Matters**:
  - `config/vscode.ts` shows how the project organizes config — match the pattern (named exports, no default export)
  - The specific lines in icons.tsx, Window.tsx, VSCodeContent.tsx are the exact values to extract — don't guess, copy exact values

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Config files exist and export correct values
    Tool: Bash
    Preconditions: Task files created
    Steps:
      1. Run: cat src/config/ui.ts
      2. Assert: File exports ICON_BASE, DOCK_ICON_PATH, WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT, EXPLORER_DEFAULT_WIDTH, EXPLORER_MIN_WIDTH, EXPLORER_MAX_WIDTH
      3. Run: grep "ICON_BASE" src/config/ui.ts — expect "/icons"
      4. Run: grep "WINDOW_MIN_WIDTH" src/config/ui.ts — expect "300"
    Expected Result: All constants present with correct values
    Failure Indicators: Missing exports or wrong values
    Evidence: .sisyphus/evidence/task-1-config-exports.txt

  Scenario: CSS variables defined in index.css
    Tool: Bash
    Preconditions: index.css updated
    Steps:
      1. Run: grep "\-\-vsc-" src/index.css
      2. Assert: At least 8 CSS custom properties defined
      3. Assert: --vsc-bg-primary contains #1e1e1e
      4. Assert: --vsc-accent contains #007acc
    Expected Result: All theme CSS variables present under :root
    Failure Indicators: Missing variables or wrong color values
    Evidence: .sisyphus/evidence/task-1-css-vars.txt

  Scenario: Build still passes after changes
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0, no errors
    Expected Result: Build succeeds — new files don't break anything
    Failure Indicators: Build fails or type errors
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES
  - Message: `chore: centralize theme CSS vars and UI constants`
  - Files: `src/config/ui.ts`, `src/index.css`
  - Pre-commit: `pnpm build`

- [ ] 2. Remove Dead Code (AppContext.tsx, update_tabs.py)

  **What to do**:
  - Delete `src/AppContext.tsx` — confirmed zero external references by grep and agent analysis. Contains unused React Context that duplicates Zustand store.
  - Delete `update_tabs.py` — confirmed orphaned Python script that targets non-existent code (`openFileIds` reference). String-based source mutation is dangerous.
  - Verify no imports reference AppContext anywhere: `grep -r "AppContext\|AppProvider\|useAppContext" src/`
  - Verify no scripts reference update_tabs.py: `grep -r "update_tabs" .`

  **Must NOT do**:
  - Do NOT modify any other files — just delete these two
  - Do NOT remove the barrel re-export yet (that's Task 9)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Deleting 2 files with zero dependencies — trivial
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 6)
  - **Blocks**: Task 9
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/AppContext.tsx` — The file to delete (65 lines, defines AppContext/AppProvider/useAppContext — none imported elsewhere)
  - `update_tabs.py` — The file to delete (project root, Python script that does string replacement on source)

  **WHY Each Reference Matters**:
  - Both files are the deletion targets. Agent must verify zero references before deleting.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Dead files are deleted
    Tool: Bash
    Preconditions: Files exist before deletion
    Steps:
      1. Run: test -f src/AppContext.tsx && echo "EXISTS" || echo "DELETED"
      2. Assert: Output is "DELETED"
      3. Run: test -f update_tabs.py && echo "EXISTS" || echo "DELETED"
      4. Assert: Output is "DELETED"
    Expected Result: Both files no longer exist
    Failure Indicators: Either file still exists
    Evidence: .sisyphus/evidence/task-2-deletion-check.txt

  Scenario: No dangling references
    Tool: Bash
    Preconditions: Files deleted
    Steps:
      1. Run: grep -r "AppContext\|AppProvider\|useAppContext" src/ || echo "CLEAN"
      2. Assert: Output is "CLEAN"
      3. Run: grep -r "update_tabs" . --include="*.ts" --include="*.tsx" --include="*.json" || echo "CLEAN"
      4. Assert: Output is "CLEAN"
    Expected Result: Zero references to deleted code
    Failure Indicators: Any grep match found
    Evidence: .sisyphus/evidence/task-2-no-refs.txt

  Scenario: Build passes after deletion
    Tool: Bash
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0
    Expected Result: Build succeeds — confirms no code depended on deleted files
    Evidence: .sisyphus/evidence/task-2-build.txt
  ```

  **Commit**: YES
  - Message: `chore: remove dead code (AppContext.tsx, update_tabs.py)`
  - Files: `src/AppContext.tsx` (deleted), `update_tabs.py` (deleted)
  - Pre-commit: `pnpm build`

- [ ] 3. Fix package.json Dependencies + .gitignore + ESLint Type-Aware Upgrade

  **What to do**:
  - **package.json**: Move `@tailwindcss/vite` from `dependencies` to `devDependencies`. Run `pnpm install` after.
  - **.gitignore**: Add patterns for `.env`, `.env.local`, `.env.*`, `coverage/`, `.vite/`
  - **eslint.config.js**: Upgrade from `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked`. Add `parserOptions.project` and `tsconfigRootDir`. Follow the instructions already present in the project's README.md.
  - Run `pnpm lint` after changes — fix any new lint errors that the type-aware rules surface.

  **Must NOT do**:
  - Do NOT add `strictTypeChecked` — `recommendedTypeChecked` is sufficient for moderate refactoring
  - Do NOT add new ESLint plugins (react-x, react-dom) — keep scope limited
  - Do NOT change any tsconfig settings

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 3 config file edits with clear instructions
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `eslint.config.js` — Current ESLint config; upgrade the `extends` array to use type-checked variant
  - `README.md` — Contains exact instructions for enabling type-aware ESLint (copy the parserOptions block from README)

  **API/Type References**:
  - `package.json` — Current dependency declarations; identify `@tailwindcss/vite` in `dependencies` to move
  - `tsconfig.app.json` + `tsconfig.node.json` — These are the project references to pass to ESLint parserOptions.project

  **WHY Each Reference Matters**:
  - README.md has the exact ESLint config snippet the project maintainer intended — follow it precisely
  - tsconfig paths are needed for the parserOptions.project array

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: ESLint runs with type-aware rules
    Tool: Bash
    Steps:
      1. Run: pnpm lint
      2. Assert: Exit code 0 (or document known pre-existing issues)
      3. Run: grep "recommendedTypeChecked\|strictTypeChecked" eslint.config.js
      4. Assert: Match found (type-aware config enabled)
    Expected Result: Lint passes with type-aware rules active
    Failure Indicators: Lint crashes or config not upgraded
    Evidence: .sisyphus/evidence/task-3-lint.txt

  Scenario: Dependencies correctly classified
    Tool: Bash
    Steps:
      1. Run: node -e "const p=require('./package.json'); console.log('deps:', Object.keys(p.dependencies||{}).join(',')); console.log('devDeps:', Object.keys(p.devDependencies||{}).join(','))"
      2. Assert: @tailwindcss/vite appears in devDependencies, NOT in dependencies
    Expected Result: Build-time deps in devDependencies
    Evidence: .sisyphus/evidence/task-3-deps.txt

  Scenario: .gitignore has env patterns
    Tool: Bash
    Steps:
      1. Run: grep -c "\.env" .gitignore
      2. Assert: At least 1 match for .env pattern
    Expected Result: Environment files properly ignored
    Evidence: .sisyphus/evidence/task-3-gitignore.txt
  ```

  **Commit**: YES
  - Message: `chore: fix deps classification, gitignore, enable type-aware ESLint`
  - Files: `package.json`, `pnpm-lock.yaml`, `.gitignore`, `eslint.config.js`
  - Pre-commit: `pnpm lint`

- [ ] 4. Add ErrorBoundary Component

  **What to do**:
  - Create `src/components/ErrorBoundary.tsx` — a class component implementing `componentDidCatch` and `getDerivedStateFromError`
  - Display a user-friendly fallback UI when errors occur (e.g., "Something went wrong" with a retry button that reloads the page)
  - Style using Tailwind classes matching the dark theme (bg-[#1e1e1e], text-[#d4d4d4])
  - Wrap `<App />` in `<ErrorBoundary>` in `src/main.tsx`

  **Must NOT do**:
  - Do NOT install any error boundary library — implement manually (React built-in pattern)
  - Do NOT add error reporting/logging services
  - Keep it simple: catch, show fallback, offer reload

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small standalone component + one line wrapper in main.tsx
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5, 6)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/main.tsx` — Where to wrap `<App />` with `<ErrorBoundary>`; currently renders `<App />` directly into root
  - `src/App.tsx` — The component being wrapped; understand its structure (renders TopBar + Dock + Desktop)

  **External References**:
  - React ErrorBoundary pattern: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

  **WHY Each Reference Matters**:
  - main.tsx is where the wrapping happens — must understand current render structure
  - React docs provide the canonical class component pattern to follow

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: ErrorBoundary component exists and wraps App
    Tool: Bash
    Steps:
      1. Run: cat src/components/ErrorBoundary.tsx
      2. Assert: Contains "componentDidCatch" and "getDerivedStateFromError"
      3. Run: grep "ErrorBoundary" src/main.tsx
      4. Assert: ErrorBoundary wraps App in the render tree
    Expected Result: ErrorBoundary properly implemented and integrated
    Failure Indicators: Missing lifecycle methods or not wrapping App
    Evidence: .sisyphus/evidence/task-4-errorboundary.txt

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0
    Expected Result: No type errors from new class component
    Evidence: .sisyphus/evidence/task-4-build.txt
  ```

  **Commit**: YES
  - Message: `feat: add ErrorBoundary to catch render errors`
  - Files: `src/components/ErrorBoundary.tsx`, `src/main.tsx`
  - Pre-commit: `pnpm build`

- [ ] 5. Externalize Inline CSS (Scrollbar Styles)

  **What to do**:
  - Extract the duplicated scrollbar CSS from:
    - `src/components/vscode/MarkdownPreview.tsx` (lines ~14-36, inline `<style>` block with `.vsc-md-preview::-webkit-scrollbar` rules)
    - `src/components/windows/MarkdownEditor.tsx` (lines ~31-40, inline `<style>` block with `.cm-scroller::-webkit-scrollbar` rules)
  - Move these styles to `src/index.css` as proper CSS rules (not inline `<style>` tags)
  - Remove the inline `<style>` JSX elements from both components
  - Ensure the class selectors still match the elements (`.vsc-md-preview`, `.cm-scroller`)

  **Must NOT do**:
  - Do NOT change any visual appearance — identical scrollbar styling
  - Do NOT refactor other inline styles in these components (that's Task 14)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Moving CSS from inline to file — mechanical extraction
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 6)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/components/vscode/MarkdownPreview.tsx:14-36` — Inline `<style>` block to extract (scrollbar width, track color, thumb color, thumb hover)
  - `src/components/windows/MarkdownEditor.tsx:31-40` — Inline `<style>` block to extract (similar scrollbar styles for CodeMirror)
  - `src/index.css` — Destination file; currently has Tailwind import and body rules

  **WHY Each Reference Matters**:
  - The exact line ranges contain the CSS to move — copy precisely, don't rewrite
  - index.css is the destination — append after existing rules

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Inline style tags removed from components
    Tool: Bash
    Steps:
      1. Run: grep -c "<style>" src/components/vscode/MarkdownPreview.tsx
      2. Assert: Output is 0 (no inline style tags)
      3. Run: grep -c "<style>" src/components/windows/MarkdownEditor.tsx
      4. Assert: Output is 0
    Expected Result: No runtime CSS injection in either component
    Failure Indicators: Style tags still present
    Evidence: .sisyphus/evidence/task-5-no-inline-styles.txt

  Scenario: Styles moved to index.css
    Tool: Bash
    Steps:
      1. Run: grep "webkit-scrollbar" src/index.css
      2. Assert: Scrollbar styles present in index.css
    Expected Result: Centralized scrollbar CSS
    Evidence: .sisyphus/evidence/task-5-css-moved.txt

  Scenario: Visual appearance unchanged
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running (pnpm dev)
    Steps:
      1. Navigate to app, open VS Code window
      2. Open a markdown file to trigger both editor and preview
      3. Screenshot the editor area — scrollbars should match dark theme
    Expected Result: Scrollbars render identically to before
    Evidence: .sisyphus/evidence/task-5-scrollbar-visual.png
  ```

  **Commit**: YES
  - Message: `refactor: externalize inline scrollbar CSS to index.css`
  - Files: `src/components/vscode/MarkdownPreview.tsx`, `src/components/windows/MarkdownEditor.tsx`, `src/index.css`
  - Pre-commit: `pnpm build`

- [ ] 6. Fix Type Assertions in Breadcrumbs.tsx + store/windows.ts

  **What to do**:
  - **`src/components/vscode/Breadcrumbs.tsx`**:
    - Line 43: Replace `{ name: activeFileName, type: "file" } as BreadcrumbSegment` with a properly typed object that satisfies `BreadcrumbSegment` without casting (add the optional `iconName` field or use a helper function)
    - Line 53: Replace `segment.iconName!` (non-null assertion) with a safe check: `{segment.iconName && <Icon name={segment.iconName} size={16} />}`
  - **`src/store/windows.ts`**:
    - Line 115: Remove `as WindowState` cast — construct the object so it fully satisfies `WindowState` type without assertion (ensure all required fields are present)
    - Line 60: Fix unused `get` variable (already flagged by LSP) — if `get` is not used in the function, remove it from the destructured parameters

  **Must NOT do**:
  - Do NOT change store logic or behavior
  - Do NOT modify other type patterns in Window.tsx (that's Task 7)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 4 precise line-level fixes across 2 files
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:

  **API/Type References**:
  - `src/components/vscode/types.ts` — `BreadcrumbSegment` interface definition (name: string, type: "folder"|"file", iconName?: string)
  - `src/store/windows.ts:115` — The `as WindowState` cast to remove
  - `src/store/windows.ts:60` — Unused `get` parameter
  - `src/components/vscode/Breadcrumbs.tsx:43,53` — The two type assertion locations

  **WHY Each Reference Matters**:
  - types.ts defines BreadcrumbSegment — must understand optional fields to construct objects without casting
  - The specific lines are the exact locations to fix

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: No type assertions remain in target files
    Tool: Bash
    Steps:
      1. Run: grep "as BreadcrumbSegment\|as WindowState\|iconName!" src/components/vscode/Breadcrumbs.tsx src/store/windows.ts
      2. Assert: Zero matches
      3. Run: pnpm exec tsc --noEmit
      4. Assert: Exit code 0 — no type errors
    Expected Result: Type-safe code without assertions
    Failure Indicators: Any grep match or tsc error
    Evidence: .sisyphus/evidence/task-6-type-safety.txt

  Scenario: Unused get variable fixed
    Tool: Bash
    Steps:
      1. Run: pnpm exec tsc --noEmit 2>&1 | grep "is declared but"
      2. Assert: No "get is declared but its value is never read" error
    Expected Result: Zero unused variable warnings
    Evidence: .sisyphus/evidence/task-6-unused-var.txt

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0
    Expected Result: Clean build
    Evidence: .sisyphus/evidence/task-6-build.txt
  ```

  **Commit**: YES
  - Message: `fix: eliminate type assertions in Breadcrumbs and store`
  - Files: `src/components/vscode/Breadcrumbs.tsx`, `src/store/windows.ts`
  - Pre-commit: `pnpm build`

- [ ] 7. Split Window.tsx — Extract useWindowDrag + useWindowResize Hooks

  **What to do**:
  - **Current state**: `src/components/Window.tsx` is 300 lines mixing drag logic, resize logic (8 directions), window chrome (title bar + controls), pointer event handling, and Framer Motion animation.
  - **Extract `src/hooks/useWindowResize.ts`**:
    - Move all resize-related logic: the 8-direction resize handles, pointer handlers for resize (onPointerDown/Move/Up), MIN_WIDTH/MIN_HEIGHT constants (import from `src/config/ui.ts` created in Task 1), startWidth/startHeight/startPosX/startPosY tracking, and the resize math that calls `updateSize`/`updatePosition` on the store.
    - Accept parameters: `windowId`, `motionX`, `motionY`, `motionWidth`, `motionHeight`, `isMaximized`
    - Return: JSX for resize handles (or a ResizeHandles component) + any needed state
    - **CRITICAL**: Eliminate the `as number` casts (lines 113-114, 128-131, 171-176) by typing motion values as `useMotionValue<number>` instead of `number | string`. If `maxW`/`maxH` return numbers, the motion values should be `<number>`.
  - **Extract `src/hooks/useWindowDrag.ts`**:
    - Move drag-related logic: `useDragControls()`, the drag handler that calls `updatePosition` on pointer up, and the drag constraints logic.
    - Accept parameters: `windowId`, `isMaximized`
    - Return: `dragControls`, `onDragEnd` handler, drag-related props for `motion.div`
    - **CRITICAL**: The `dragControls` instance must be shared between the title bar (which starts the drag via `onPointerDown`) and the `motion.div` wrapper (which uses `dragControls={dragControls}`). Ensure the hook returns both the controls and the startDrag handler.
  - **Fix selector-less Zustand call**: Line 40 currently destructures multiple actions from `useWindowsStore` without a selector. Replace with individual selector calls: `const closeWindow = useWindowsStore(s => s.closeWindow)` etc.
  - **Resulting Window.tsx**: Should be ~100-150 lines, primarily composition: import hooks, render title bar + controls + resize handles + children.

  **Must NOT do**:
  - Do NOT change the visual appearance or behavior of window drag/resize
  - Do NOT modify the Zustand store actions themselves
  - Do NOT change Framer Motion animation parameters (spring config, transitions)
  - Do NOT create a separate TitleBar component if it would only add indirection — keep it inline if <40 lines

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex refactoring of tightly coupled drag/resize logic with Framer Motion — requires careful understanding of motion value flow and pointer event lifecycle
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — no visual changes, pure structural refactoring

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel with Task 8 and 9)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 10, 13
  - **Blocked By**: Tasks 1 (needs config/ui.ts for constants), 6 (needs type assertion cleanup baseline)

  **References**:

  **Pattern References**:
  - `src/components/Window.tsx` — ENTIRE FILE is the refactoring target. Read all 300 lines carefully before splitting.
  - `src/store/windows.ts` — Store actions used by Window: `closeWindow`, `minimizeWindow`, `toggleMaximize`, `focusWindow`, `updatePosition`, `updateSize`, `patchWindow`. Understand their signatures.

  **API/Type References**:
  - `src/store/windows.ts:WindowState` — The window state shape (position, size, isMaximized, zIndex, meta, etc.)
  - `src/config/ui.ts` — WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT (created in Task 1)
  - Framer Motion: `useMotionValue`, `useDragControls`, `motion.div` drag props, `MotionValue` type

  **External References**:
  - Framer Motion drag: https://motion.dev/docs/react-drag — understand dragControls, dragListener, onDragEnd
  - Framer Motion motion values: https://motion.dev/docs/react-motion-value — understand .get()/.set() typing

  **WHY Each Reference Matters**:
  - Window.tsx is the entire target — every line must be understood before splitting
  - Store actions define the API the hooks will call — must match signatures exactly
  - Framer Motion docs explain the dragControls sharing pattern and motion value typing

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Window drag works correctly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running (pnpm dev)
    Steps:
      1. Navigate to the app
      2. Click a dock icon to open a window
      3. Grab the title bar of the window (the top bar area)
      4. Drag the window to a new position (offset by +100px, +50px)
      5. Release — window should stay at new position
    Expected Result: Window moves smoothly during drag and stays at final position
    Failure Indicators: Window snaps back, doesn't move, or jerky movement
    Evidence: .sisyphus/evidence/task-7-drag.png

  Scenario: Window resize works in all 8 directions
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, a window is open
    Steps:
      1. Hover over the right edge of an open window — cursor should change to resize
      2. Drag the right edge to make window wider
      3. Repeat for bottom edge (make taller)
      4. Repeat for bottom-right corner (diagonal)
      5. Verify window respects minimum size (try to resize smaller than 300x200)
    Expected Result: All resize directions work, minimum size enforced
    Failure Indicators: Resize doesn't work in any direction, or window shrinks below minimum
    Evidence: .sisyphus/evidence/task-7-resize.png

  Scenario: Window controls work (minimize, maximize, close)
    Tool: Playwright (playwright skill)
    Steps:
      1. Open a window via dock
      2. Click maximize button — window fills screen
      3. Click maximize again — window returns to previous size/position
      4. Click minimize — window disappears (minimized to dock)
      5. Click close — window removed
    Expected Result: All window controls function identically to before
    Evidence: .sisyphus/evidence/task-7-controls.png

  Scenario: Zero type assertions in Window.tsx
    Tool: Bash
    Steps:
      1. Run: grep "as number\|as string" src/components/Window.tsx src/hooks/useWindowResize.ts src/hooks/useWindowDrag.ts
      2. Assert: Zero matches
      3. Run: pnpm exec tsc --noEmit
      4. Assert: Exit code 0
    Expected Result: All `as number` casts eliminated via proper typing
    Evidence: .sisyphus/evidence/task-7-type-safety.txt

  Scenario: Window.tsx is under 150 lines
    Tool: Bash
    Steps:
      1. Run: wc -l src/components/Window.tsx
      2. Assert: Line count <= 150
    Expected Result: Component successfully decomposed
    Evidence: .sisyphus/evidence/task-7-linecount.txt
  ```

  **Commit**: YES
  - Message: `refactor: split Window.tsx into component + useWindowDrag/useWindowResize hooks`
  - Files: `src/components/Window.tsx`, `src/hooks/useWindowDrag.ts`, `src/hooks/useWindowResize.ts`
  - Pre-commit: `pnpm build`

- [ ] 8. Split VSCodeContent.tsx — Extract useEditorState + useExplorerResize + useScrollSync Hooks

  **What to do**:
  - **Current state**: `src/components/vscode/VSCodeContent.tsx` is 226 lines mixing file/tab state management, explorer panel resize logic, bidirectional scroll sync between editor and preview, and global store integration (patchWindow for title).
  - **Extract `src/hooks/useEditorState.ts`**:
    - Move: `files` state (from INITIAL_FILES), `openTabIds`, `activeFileId`, `showPreview` state, and all handlers: openFile, closeTab, setActiveTab, togglePreview, file content update.
    - Also move: the `useEffect` that calls `patchWindow` to update the window title when `activeFileId` changes.
    - Accept parameters: `windowId` (for patchWindow), initial files config
    - Return: `{ files, openTabIds, activeFileId, showPreview, activeFile, openFile, closeTab, setActiveTab, togglePreview, updateFileContent }`
  - **Extract `src/hooks/useExplorerResize.ts`**:
    - Move: `explorerWidth` state (default 200), `explorerVisible` state, the pointer event handlers for resizing the explorer panel (onPointerDown, onPointerMove, onPointerUp), and the ref for the resize handle.
    - Import width constants from `src/config/ui.ts` (Task 1)
    - Return: `{ explorerWidth, explorerVisible, toggleExplorer, resizeHandleProps }`
  - **Extract `src/hooks/useScrollSync.ts`**:
    - Move: The bidirectional scroll synchronization logic between the CodeMirror editor and the markdown preview pane. This includes refs, scroll event listeners, and the isScrolling flag to prevent loops.
    - Return: `{ editorRef, previewRef, onEditorScroll, onPreviewScroll }`
  - **Resulting VSCodeContent.tsx**: Should be ~80-120 lines of composition: import hooks, render layout (ActivityBar + Explorer + EditorArea + StatusBar).

  **Must NOT do**:
  - Do NOT change the VS Code editor behavior or appearance
  - Do NOT restructure the component hierarchy further (ActivityBar, FileExplorer, EditorTabs etc. stay as-is)
  - Do NOT touch the MarkdownEditor or MarkdownPreview components
  - Do NOT change the file tree structure or config

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex state extraction with multiple interconnected pieces (scroll sync, editor state affecting window title)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel with Task 7 and 9)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 10, 12, 13
  - **Blocked By**: Task 1 (needs config/ui.ts for explorer width constants)

  **References**:

  **Pattern References**:
  - `src/components/vscode/VSCodeContent.tsx` — ENTIRE FILE is the refactoring target. Read all 226 lines.
  - `src/config/vscode.ts` — Defines INITIAL_FILES, VSCODE_FILE_TREE, TreeNode, FileContent types used by the editor state

  **API/Type References**:
  - `src/config/vscode.ts:FileContent` — The file content type (id, name, language, value, readOnly?)
  - `src/config/vscode.ts:INITIAL_FILES` — Default files loaded into editor
  - `src/store/windows.ts:patchWindow` — Called to update window title; signature: `(id: string, patch: Partial<WindowState>) => void`
  - `src/config/ui.ts` — EXPLORER_DEFAULT_WIDTH, EXPLORER_MIN_WIDTH, EXPLORER_MAX_WIDTH (from Task 1)

  **WHY Each Reference Matters**:
  - VSCodeContent.tsx is the full target — must read carefully to identify clean split boundaries
  - config/vscode.ts provides the types and data the useEditorState hook will consume
  - patchWindow is the cross-store integration point — hook must maintain this connection

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: VS Code editor opens files and switches tabs
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Open the VS Code window via dock
      2. Click a file in the file explorer to open it
      3. Verify file content appears in editor
      4. Open a second file — verify it appears as a new tab
      5. Click the first tab — editor switches to first file
      6. Close a tab via the X button — tab disappears
    Expected Result: File opening, tab switching, and tab closing work identically
    Failure Indicators: Files don't open, tabs don't switch, or content doesn't update
    Evidence: .sisyphus/evidence/task-8-tabs.png

  Scenario: Explorer panel resizes correctly
    Tool: Playwright (playwright skill)
    Steps:
      1. Open VS Code window
      2. Grab the resize handle between explorer and editor
      3. Drag to make explorer wider, then narrower
      4. Verify explorer respects min (120px) and max (500px) width
    Expected Result: Explorer resize works with constraints
    Evidence: .sisyphus/evidence/task-8-explorer-resize.png

  Scenario: Markdown preview scroll sync works
    Tool: Playwright (playwright skill)
    Steps:
      1. Open a markdown file with enough content to scroll
      2. Toggle preview on (if not already showing)
      3. Scroll the editor — preview should scroll proportionally
      4. Scroll the preview — editor should scroll proportionally
    Expected Result: Bidirectional scroll sync maintained
    Evidence: .sisyphus/evidence/task-8-scroll-sync.png

  Scenario: VSCodeContent.tsx is under 120 lines
    Tool: Bash
    Steps:
      1. Run: wc -l src/components/vscode/VSCodeContent.tsx
      2. Assert: Line count <= 120
      3. Run: pnpm build
      4. Assert: Exit code 0
    Expected Result: Component successfully decomposed and builds clean
    Evidence: .sisyphus/evidence/task-8-linecount.txt
  ```

  **Commit**: YES
  - Message: `refactor: split VSCodeContent into component + useEditorState/useExplorerResize/useScrollSync hooks`
  - Files: `src/components/vscode/VSCodeContent.tsx`, `src/hooks/useEditorState.ts`, `src/hooks/useExplorerResize.ts`, `src/hooks/useScrollSync.ts`
  - Pre-commit: `pnpm build`

- [ ] 9. Simplify Barrel Chain (Desktop Import Path)

  **What to do**:
  - **Current barrel chain** (3 hops): `Desktop.tsx` → `src/components/windows/VSCodeContent.tsx` (re-export) → `src/components/vscode/index.ts` (barrel) → `src/components/vscode/VSCodeContent.tsx` (implementation)
  - **Simplify to 1 hop**: Update `Desktop.tsx` to import directly from `src/components/vscode/VSCodeContent.tsx` (or from `src/components/vscode` via the index barrel)
  - Delete `src/components/windows/VSCodeContent.tsx` (the trivial re-export file)
  - Keep `src/components/vscode/index.ts` barrel if other components import from it; otherwise simplify
  - Update any other imports that go through the deleted re-export

  **Must NOT do**:
  - Do NOT rename any components
  - Do NOT change any component behavior

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Updating 1-2 import paths and deleting a 1-line file
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel with Task 7 and 8)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 2 (dead code cleanup ensures no scripts reference the re-export file)

  **References**:

  **Pattern References**:
  - `src/components/Desktop.tsx` — Contains the import to update; currently imports VSCodeContent through the windows/ re-export path
  - `src/components/windows/VSCodeContent.tsx` — The 1-line re-export file to delete: `export { default } from "../vscode";`
  - `src/components/vscode/index.ts` — The barrel: `export { default } from "./VSCodeContent";`

  **WHY Each Reference Matters**:
  - Desktop.tsx is where the import path must be updated
  - windows/VSCodeContent.tsx is the deletion target
  - vscode/index.ts is the barrel that remains — import through this

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Re-export file deleted and imports updated
    Tool: Bash
    Steps:
      1. Run: test -f src/components/windows/VSCodeContent.tsx && echo "EXISTS" || echo "DELETED"
      2. Assert: Output is "DELETED"
      3. Run: grep -r "windows/VSCodeContent" src/ || echo "CLEAN"
      4. Assert: Output is "CLEAN" (no imports through deleted path)
      5. Run: pnpm build
      6. Assert: Exit code 0
    Expected Result: Import chain simplified, build passes
    Evidence: .sisyphus/evidence/task-9-barrel.txt
  ```

  **Commit**: YES
  - Message: `chore: simplify VSCode import barrel chain`
  - Files: `src/components/Desktop.tsx`, `src/components/windows/VSCodeContent.tsx` (deleted)
  - Pre-commit: `pnpm build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm exec tsc --noEmit` + `pnpm lint` + verify build. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Open in browser via Playwright. Verify: desktop renders, dock icons clickable, windows open/close/minimize/maximize/drag/resize, VS Code editor opens files, tabs switch, file explorer toggles, markdown preview works, keyboard navigation works on all interactive elements. Take before/after screenshots. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Wave | Commit Message | Files |
|------|---------------|-------|
| 1 | `chore: centralize theme CSS vars and UI constants` | index.css, src/config/ui.ts |
| 1 | `chore: remove dead code (AppContext, update_tabs.py, barrel)` | AppContext.tsx, update_tabs.py |
| 1 | `chore: fix package.json deps, .gitignore, ESLint type-aware` | package.json, .gitignore, eslint.config.js |
| 1 | `feat: add ErrorBoundary component` | ErrorBoundary.tsx, main.tsx or App.tsx |
| 1 | `refactor: externalize inline scrollbar CSS` | MarkdownPreview.tsx, MarkdownEditor.tsx, index.css |
| 1 | `fix: eliminate type assertions in Breadcrumbs + store` | Breadcrumbs.tsx, store/windows.ts |
| 2 | `refactor: split Window.tsx into component + hooks` | Window.tsx, useWindowDrag.ts, useWindowResize.ts |
| 2 | `refactor: split VSCodeContent into component + hooks` | VSCodeContent.tsx, useEditorState.ts, useExplorerResize.ts, useScrollSync.ts |
| 2 | `chore: simplify VSCode import barrel chain` | Desktop.tsx, windows/VSCodeContent.tsx, vscode/index.ts |
| 3 | `a11y: fix interactive elements across EditorTabs, ActivityBar, Dock, FileExplorer` | EditorTabs.tsx, ActivityBar.tsx, Dock.tsx, FileExplorer.tsx |
| 3 | `perf: add React.memo and optimize render closures` | Multiple components |
| 3 | `refactor: apply centralized theme CSS variables` | Multiple components |

---

## Success Criteria

### Verification Commands
```bash
pnpm build          # Expected: Build succeeds, zero errors
pnpm lint           # Expected: Zero lint errors (with type-aware rules)
pnpm exec tsc --noEmit  # Expected: Zero type errors
```

### Final Checklist
- [ ] All "Must Have" present (visual behavior preserved, Zustand sole state, Framer Motion intact)
- [ ] All "Must NOT Have" absent (no new features, no visual changes, no new deps, no over-abstraction)
- [ ] `update_tabs.py` deleted
- [ ] `AppContext.tsx` deleted  
- [ ] ErrorBoundary wraps app
- [ ] Window.tsx < 150 lines
- [ ] VSCodeContent.tsx < 120 lines
- [ ] All interactive elements keyboard-accessible
- [ ] Build + lint + typecheck pass
