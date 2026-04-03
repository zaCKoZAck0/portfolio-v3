# Draft: Portfolio App Refactor & Tech Debt Cleanup

## Requirements (confirmed)
- **Goal**: Both code quality/maintainability AND performance optimization
- **Scope**: Moderate — restructure where needed, keep overall approach, component reorganization okay
- **Risk tolerance**: Personal/in-development — more freedom for breaking changes
- **App type**: React + TypeScript + Vite portfolio app simulating a desktop/VS Code UI

## Technical Decisions
- State management: Zustand (keep) — AppContext.tsx is unused dead code, remove it
- TypeScript: strict mode already ON (good baseline)
- Styling: Mixed inline styles + Tailwind — needs consolidation
- Build: Vite 8 + React 19 + pnpm

## Research Findings (3 agents completed)

### Architecture (Agent 1)
- **Component tree**: App → TopBar + Dock + Desktop → Window → VSCodeContent / FilesContent
- **Large components**: Window.tsx (300 lines), VSCodeContent.tsx (226 lines), store/windows.ts (210 lines)
- **Dead code**: AppContext.tsx (65 lines) — unused React Context duplicating Zustand store functionality
- **Duplication**: Scrollbar CSS in MarkdownPreview + MarkdownEditor; title generation in store + AppContext; hardcoded hex colors (#1e1e1e, #252526, #007acc) across 6+ files
- **Barrel indirection**: windows/VSCodeContent.tsx re-exports vscode/VSCodeContent.tsx (double hop)
- **Hardcoded values**: ICON_BASE, MIN_WIDTH/MIN_HEIGHT, explorer widths, theme colors — all scattered

### Tech Debt & Code Smells (Agent 2)
- **No `any` types** — clean (good)
- **No TODO/FIXME/HACK** comments
- **update_tabs.py**: Dangerous Python script that mutates source via string replacement — targets wrong file, brittle, MUST remove
- **Inline <style> blocks**: MarkdownEditor.tsx + MarkdownPreview.tsx inject CSS at runtime
- **Accessibility**: Clickable divs without roles/keyboard handlers in EditorTabs, ActivityBar, FileExplorer, Dock
- **No ErrorBoundary**: Render errors can crash entire app
- **package.json**: Build-time deps (@tailwindcss/vite) in dependencies instead of devDependencies
- **dist/ directory**: Present in repo root (should be git-ignored build artifact)
- **Performance**: Inline closures in map(), no React.memo on pure components, inline style objects recreated every render

### Type Safety & Test Infra (Agent 3)
- **Test infrastructure**: NONE — no test runner, no test files, no test scripts
- **TypeScript strict**: ON with noUnusedLocals, noUnusedParameters
- **Type assertions found**:
  - Window.tsx: 10+ `as number` casts on motion values (lines 113-176)
  - Breadcrumbs.tsx: non-null assertion `segment.iconName!` (line 53), `as BreadcrumbSegment` (line 43)
  - store/windows.ts: `as WindowState` (line 115)
- **ESLint**: NOT type-aware — uses recommended but not recommendedTypeChecked
- **No CI/CD**: No GitHub Actions or equivalent
- **.gitignore**: Missing .env* patterns

## Final Decisions
- **Tests**: No automated tests — agent-executed QA only (Playwright, build verification)
- **Accessibility**: YES — include semantic HTML, ARIA roles, keyboard handlers for EditorTabs, ActivityBar, FileExplorer, Dock
- **CI/CD**: Skip for now

## Scope Boundaries
- INCLUDE: Dead code removal, component splitting, style consolidation, accessibility, performance, type safety, config cleanup, dangerous script removal
- EXCLUDE: New features, visual redesign, full test suite (unless user wants)
