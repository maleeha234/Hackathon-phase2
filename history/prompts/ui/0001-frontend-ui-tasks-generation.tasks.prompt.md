---
id: 0001
title: Frontend UI Tasks Generation
stage: tasks
feature: ui
date_iso: 2026-01-09
model: claude-sonnet-4-5-20250929
branch: master
user: Human
command: /sp.tasks
labels:
  - frontend
  - ui-ux
  - task-generation
  - nextjs
  - tailwind-css
links:
  - SPEC: specs/ui/frontend-ui-ux.md
  - PLAN: specs/ui/plan.md
  - CONSTITUTION: constitution.md
---

files_created:
  - specs/ui/tasks.md

prompt_text: |
  $ARGUMENTS

  You **MUST** consider the user input before proceeding (if not empty).

  ## Outline

  1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

  2. **Load design documents**: Read from FEATURE_DIR:
     - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
     - **Optional**: data-model.md (entities), contracts/ (API endpoints), research.md (decisions), quickstart.md (test scenarios)
     - Note: Not all projects have all documents. Generate tasks based on what's available.

  3. **Execute task generation workflow**:
     - Load plan.md and extract tech stack, libraries, project structure
     - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
     - If data-model.md exists: Extract entities and map to user stories
     - If contracts/ exists: Map endpoints to user stories
     - If research.md exists: Extract decisions for setup tasks
     - Generate tasks organized by user story (see Task Generation Rules below)
     - Generate dependency graph showing user story completion order
     - Create parallel execution examples per user story
     - Validate task completeness (each user story has all needed tasks, independently testable)

  4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
     - Correct feature name from plan.md
     - Phase 1: Setup tasks (project initialization)
     - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
     - Phase 3+: One phase per user story (in priority order from spec.md)
     - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
     - Final Phase: Polish & cross-cutting concerns
     - All tasks must follow the strict checklist format (see Task Generation Rules below)
     - Clear file paths for each task
     - Dependencies section showing story completion order
     - Parallel execution examples per story
     - Implementation strategy section (MVP first, incremental delivery)

  5. **Report**: Output path to generated tasks.md and summary:
     - Total task count
     - Task count per user story
     - Parallel opportunities identified
     - Independent test criteria for each story
     - Suggested MVP scope (typically just User Story 1)
     - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

  Context for task generation: $ARGUMENTS

  The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

  ## Task Generation Rules

  **CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

  **Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

  ### Checklist Format (REQUIRED)

  Every task MUST strictly follow this format:

  ```text
  - [ ] [TaskID] [P?] [Story?] Description with file path
  ```

  **Format Components**:

  1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
  2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
  3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
  4. **[Story] label**: REQUIRED for user story phase tasks only
     - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
     - Setup phase: NO story label
     - Foundational phase: NO story label
     - User Story phases: MUST have story label
     - Polish phase: NO story label
  5. **Description**: Clear action with exact file path

  **Examples**:

  - ✅ CORRECT: `- [ ] [TaskID] Create project structure per implementation plan`
  - ✅ CORRECT: `- [ ] [TaskID] [P] Implement authentication middleware in src/middleware/auth.py`
  - ✅ CORRECT: `- [ ] [TaskID] [P] [US1] Create User model in src/models/user.py`
  - ✅ CORRECT: `- [ ] [TaskID] [US1] Implement UserService in src/services/user_service.py`
  - ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
  - ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
  - ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
  - ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

response_text: |
  Generated tasks.md at specs/ui/tasks.md with 72 tasks across 8 phases:
  - Phase 1: Setup (Design System Foundation) - 12 tasks
  - Phase 2: Application Shell & Navigation - 7 tasks
  - Phase 3: Landing Page - 6 tasks
  - Phase 4: Authentication Pages - 8 tasks
  - Phase 5: Task Management UI - 10 tasks
  - Phase 6: Task List Page - 7 tasks
  - Phase 7: Accessibility & Responsiveness - 10 tasks
  - Phase 8: UI Quality Review & Final Polish - 12 tasks

  32 parallelizable tasks identified. Tasks follow the strict checklist format with IDs, [P] markers, and exact file paths.

  Reference documents: specs/ui/plan.md, specs/ui/frontend-ui-ux.md, constitution.md
---

## Summary

**Tasks Generated:** 72 total tasks across 8 phases
**Parallelizable:** 32 tasks marked with [P]
**Phases:** 8 sequential phases

| Phase | Focus | Tasks |
|-------|-------|-------|
| 1 | Design System Foundation | 12 |
| 2 | Application Shell & Navigation | 7 |
| 3 | Landing Page | 6 |
| 4 | Authentication Pages | 8 |
| 5 | Task Management UI | 10 |
| 6 | Task List Page | 7 |
| 7 | Accessibility & Responsiveness | 10 |
| 8 | UI Quality Review & Polish | 12 |

**Output Path:** `specs/ui/tasks.md`

**Next Steps:**
1. Review tasks.md for completeness
2. Execute tasks phase by phase using Claude Code agents
3. Each phase ends with checkpoint validation

The tasks.md is immediately executable - each task has specific file paths and clear actions following the checklist format `- [ ] T### [P] Description with file path`.
