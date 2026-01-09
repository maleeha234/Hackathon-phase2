# The Evolution of Todo — Phase II Constitution

**Version:** v2.0
**Date:** December 30, 2025
**Status:** Active — Governs all Phase II development
**Phase:** II — Full-Stack Web Application with Persistent Storage

---

## 1. Project Overview

### 1.1 Vision Statement

The Evolution of Todo transitions from Phase I's single-user in-memory console application to Phase II's modern, multi-user full-stack web application with persistent storage. This constitution establishes the foundational governance for all Phase II development, defining high-level goals, security requirements, technology stack, monorepo structure, and strict agentic development rules.

### 1.2 Phase I Recap

Phase I delivered a functional console-based todo manager using Python standard library only, demonstrating core CRUD operations with in-memory data structures. This foundation is complete and serves as the conceptual baseline for Phase II enhancement.

### 1.3 Phase II Scope

Phase II delivers a production-ready, multi-user todo application featuring:

- **Web Interface:** Responsive UI built with Next.js 16+ App Router and Tailwind CSS
- **Authentication:** Secure JWT-based auth via Better Auth with JWT plugin
- **Persistent Storage:** Neon Serverless PostgreSQL via SQLModel ORM
- **API Layer:** RESTful endpoints served by FastAPI backend
- **Monorepo Architecture:** Unified repository with frontend/ and backend/ separation

### 1.4 Target Audience

This constitution serves three primary audiences:

| Audience | Primary Needs |
|----------|---------------|
| Hackathon Judges | Evaluate advanced agentic development, security, and code quality |
| Developers | Build secure multi-user todo applications following established patterns |
| AI Agents (Claude Code) | Implement features via Spec-Kit Plus with precise, actionable guidance |

---

## 2. Core Requirements

### 2.1 Feature Set (Web Context)

The five core todo features translate to web-native operations with mandatory user isolation:

| Feature | Description | User Isolation |
|---------|-------------|----------------|
| **Add Task** | Create new task with title, description, optional due date | Users see only their own tasks |
| **Delete Task** | Remove existing task by ID | Users can only delete their own tasks |
| **Update Task** | Modify task title, description, or due date | Users can only update their own tasks |
| **View Tasks** | List all tasks with optional filtering/sorting | Users see only their own tasks |
| **Mark Complete** | Toggle task completion status | Users can only complete their own tasks |

### 2.2 RESTful API Endpoints

All endpoints require valid JWT authentication via `Authorization: Bearer <token>` header.

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| `POST` | `/api/tasks` | Create new task | `{ "title": string, "description"?: string, "due_date"?: string }` | 201 + task object |
| `GET` | `/api/tasks` | List all user tasks | Query: `?completed=true/false&sort=due_date` | 200 + task array |
| `GET` | `/api/tasks/:id` | Get single task | — | 200 + task object |
| `PUT` | `/api/tasks/:id` | Update task | `{ "title"?: string, "description"?: string, "due_date"?: string }` | 200 + task object |
| `DELETE` | `/api/tasks/:id` | Delete task | — | 204 No Content |
| `PATCH` | `/api/tasks/:id/complete` | Toggle completion | — | 200 + updated task |

### 2.3 Error Response Format

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID '123' not found or access denied",
    "status": 404
  }
}
```

---

## 3. Authentication & Security

### 3.1 JWT-Based Authentication Bridge

Phase II implements a shared JWT authentication strategy between Next.js frontend and FastAPI backend:

```
┌─────────────────┐     JWT Token      ┌─────────────────┐     Verify JWT      ┌─────────────────┐
│  Next.js +      │ ─────────────────> │  Frontend       │ ─────────────────> │  FastAPI        │
│  Better Auth    │   (Cookie/Header)  │  (Browser)      │   (Bearer Token)   │  Backend        │
│                 │                    │                 │                    │                 │
│  Issues JWT     │                    │  Attaches JWT   │                    │  Verifies JWT   │
│  with user_id   │                    │  to all requests│                    │  with SHARED    │
│                 │                    │                 │                    │  SECRET          │
└─────────────────┘                    └─────────────────┘                    └─────────────────┘
```

### 3.2 Token Flow

1. **Token Issuance:** Better Auth authenticates user credentials and issues JWT containing `user_id` and expiration
2. **Token Storage:** JWT stored as HTTP-only cookie and accessible via `auth.getToken()` helper
3. **Token Attachment:** Frontend automatically attaches `Authorization: Bearer <token>` to all API requests
4. **Token Verification:** FastAPI middleware validates JWT signature using `BETTER_AUTH_SECRET` environment variable
5. **User Extraction:** Middleware extracts `sub` (user_id) claim and injects into request context
6. **User Isolation:** All task operations query with `WHERE user_id = current_user` ensuring strict isolation

### 3.3 Security Measures

| Measure | Implementation |
|---------|---------------|
| **Shared Secret** | `BETTER_AUTH_SECRET` env var shared between frontend and backend |
| **Signature Validation** | HS256 algorithm with shared secret |
| **User Isolation** | Database queries always include `user_id` filter |
| **Token Expiration** | 7-day session expiry with refresh token support |
| **HTTPS Only** | Production requires TLS; cookies marked `Secure` |
| **CORS Configuration** | Strict origin allowlist for cross-origin requests |

### 3.4 Environment Variables

```bash
# Shared
BETTER_AUTH_SECRET=your-32-character-minimum-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000

# Backend
DATABASE_URL=postgresql://user:pass@ep-xyz.us-east-1.aws.neon.tech/evolution_todo
BETTER_AUTH_SECRET=your-32-character-minimum-secret
```

---

## 4. Non-Functional Requirements

### 4.1 Code Quality

| Language | Standard | Tools |
|----------|----------|-------|
| TypeScript | Strict mode, no `any`, full typing | ESLint, TypeScript compiler |
| Python | PEP 8, type hints everywhere | Black, isort, mypy |

### 4.2 Modularity

- Frontend: Feature-based folder structure under `src/features/`
- Backend: Modular routers in `app/api/v1/`
- Shared types defined in `packages/types/`

### 4.3 Type Safety

- End-to-end type safety from database to API to UI
- Shared TypeScript interfaces for API responses
- SQLModel generates Pydantic models from database schema

### 4.4 UI Requirements

- Responsive design (mobile-first, breakpoints: sm/md/lg/xl)
- Accessible markup (semantic HTML, ARIA labels)
- Loading states via React Suspense boundaries
- Error boundaries for graceful failure handling

### 4.5 Error Handling

| Layer | Strategy |
|-------|----------|
| API | HTTP status codes (200, 201, 400, 401, 403, 404, 500) |
| Backend | Structured logging with request IDs |
| Frontend | Toast notifications with user-friendly messages |
| Database | Connection pooling, retry logic for transient failures |

### 4.6 Performance Targets

- API response time: p95 < 200ms
- Page load: First Contentful Paint < 1s
- Database queries: Connection pooling, prepared statements

---

## 5. Technology Stack and Tools

### 5.1 Frontend Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16+ (App Router) |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Authentication | Better Auth | Latest + JWT plugin |
| UI Components | Native HTML + Tailwind | — |
| State Management | React Server Components | — |

### 5.2 Backend Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | FastAPI | 0.115+ |
| Language | Python | 3.11+ |
| ORM | SQLModel | 0.0+ |
| Database | Neon Serverless PostgreSQL | — |
| ASGI Server | Uvicorn | — |

### 5.3 Development Tools

| Tool | Purpose |
|------|---------|
| Claude Code | AI agent for all implementation |
| Spec-Kit Plus | Specification-driven development framework |
| Docker Compose | Local development environment |
| Git | Version control |
| npm/pip | Package management |

### 5.4 Docker Compose Services

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
```

---

## 6. Development Workflow

### 6.1 Agentic Development Cycle

All implementation follows Spec-Kit Plus methodology with zero manual coding:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Development Workflow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CONSTITUTION ─────> 2. SPECS ─────> 3. PLAN ─────> 4. TASKS │
│       │                    │               │            │        │
│       v                    v               v            v        │
│  Governance         Requirements     Architecture   Testable    │
│  & goals            & stories        & decisions    cases       │
│                                                                 │
│       │                    │               │            │        │
│       v                    v               v            v        │
│  5. AGENTS/SKILLS ──> 6. IMPLEMENT ──> 7. TEST ──> 8. ITERATE  │
│       │                                   │            │        │
│       v                                   v            v        │
│  Claude Code          Code gen         Validate      Refine     │
│  executes             via skills       & verify       specs     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Workflow Steps

| Step | Actor | Output |
|------|-------|--------|
| **Constitution** | Human + Agent | `constitution.md` — Project governance |
| **Specs** | Agent | `specs/features/<feature>/spec.md` — Feature requirements |
| **Plan** | Agent | `specs/features/<feature>/plan.md` — Architecture decisions |
| **Tasks** | Agent | `specs/features/<feature>/tasks.md` — Implementation tasks |
| **Agents/Skills** | Claude Code | Execute tasks via specialized agents |
| **Implementation** | Agents | Generated code committed to repo |
| **Testing** | Integration Tester | E2E validation of features |
| **Iteration** | Human + Agent | Spec refinements based on feedback |

### 6.3 No Manual Coding Rule

- **Strict Enforcement:** All production code generated by Claude Code agents using skills
- **Exception:** README, .gitignore, basic config files only
- **Skills Directory:** `.claude/<skill>/skill.md` contains domain expertise for agents
- **Quality Standard:** Generated code meets all quality requirements defined in this constitution

---

## 7. Monorepo Structure

```
evolution-todo/
├── .claude/                      # Claude Code skills
│   └── <skill>/
│       └── skill.md
├── .spec-kit/                    # Spec-Kit Plus configuration
│   └── config.yaml
├── specs/                        # Feature specifications
│   ├── features/
│   │   └── <feature-name>/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       └── tasks.md
│   ├── api/
│   ├── database/
│   └── ui/
├── frontend/                     # Next.js frontend
│   ├── CLAUDE.md                 # Frontend-specific rules
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   ├── components/
│   │   ├── lib/                  # Utilities
│   │   └── types/                # Shared types
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.ts
├── backend/                      # FastAPI backend
│   ├── CLAUDE.md                 # Backend-specific rules
│   ├── app/
│   │   ├── main.py               # Application entry
│   │   ├── api/                  # API routes
│   │   ├── models/               # SQLModel models
│   │   ├── schemas/              # Pydantic schemas
│   │   └── middleware/           # Auth middleware
│   ├── requirements.txt
│   └── pyproject.toml
├── docker-compose.yml
├── constitution.md               # This file
├── .env.example
└── README.md
```

### 7.1 Layered CLAUDE.md Files

| File | Scope |
|------|-------|
| `CLAUDE.md` (root) | Overall project rules |
| `frontend/CLAUDE.md` | Frontend-specific conventions |
| `backend/CLAUDE.md` | Backend-specific conventions |

### 7.2 Spec-Kit Config

```yaml
# .spec-kit/config.yaml
project: evolution-todo
version: 2.0.0
structure:
  frontend: frontend
  backend: backend
  specs: specs
  skills: .claude
features:
  - authentication
  - task-management
  - api-integration
agents:
  - spec-writer
  - architecture-planner
  - frontend-engineer
  - fastapi-backend-engineer
  - integration-tester
```

---

## 8. Guiding Principles

### 8.1 Core Principles

| Principle | Application |
|-----------|-------------|
| **Spec-First Development** | All code preceded by approved specifications |
| **Security by Design** | User isolation enforced at database query level |
| **Simplicity** | Minimal viable implementation; avoid over-engineering |
| **Maintainability** | Clean code, documentation, agent-readable specs |
| **Process Transparency** | Full specification history visible for hackathon judging |

### 8.2 Phase III Preparation

Phase II architecture anticipates Phase III chatbot integration:

- API-first design enables chatbot as additional client
- User isolation protects data regardless of interface
- Shared types allow chatbot to consume same data structures
- Extensible task model supports future enhancement

### 8.3 Agentic Development Values

- **Reproducibility:** All actions traceable to specifications
- **Auditability:** Complete prompt history in `history/prompts/`
- **Autonomy:** Agents operate within constitutional bounds
- **Transparency:** No hidden code or undocumented changes

---

## 9. Deliverables and Success Criteria

### 9.1 Working Application

| Criterion | Verification |
|-----------|--------------|
| Runnable via `docker-compose up` | Clean startup with no errors |
| All features accessible via UI | Add, Delete, Update, View, Mark Complete |
| All endpoints functional via API | curl/Postman testing passes |
| Multi-user isolation verified | Cross-user access attempts blocked |
| Responsive design | Works on mobile and desktop |

### 9.2 Code Quality Gates

| Requirement | Tool/Check |
|-------------|------------|
| TypeScript strict mode | `tsc --noEmit` passes |
| Python linting | `black --check`, `isort --check` pass |
| No lint errors | ESLint reports 0 violations |
| Agent-generated only | Git history shows agent commits |

### 9.3 Documentation Requirements

| Artifact | Location |
|----------|----------|
| Constitution | `constitution.md` (root) |
| Feature specs | `specs/features/<name>/spec.md` |
| Architecture plans | `specs/features/<name>/plan.md` |
| Implementation tasks | `specs/features/<name>/tasks.md` |
| Prompt history | `history/prompts/` |
| API documentation | Inline code + README |

### 9.4 Demo-Ready State

For hackathon presentation:

- Create 2-3 sample users with representative tasks
- Pre-populated data showcases all features
- Login flow demonstrated with credential handling
- API responses visible via browser DevTools
- Terminal shows clean container logs

### 9.5 Success Criteria Summary

- [ ] Docker Compose launches fully functional stack
- [ ] JWT authentication works across frontend/backend
- [ ] All 5 CRUD operations function via UI and API
- [ ] User isolation verified (users cannot access others' tasks)
- [ ] All code generated by Claude Code agents
- [ ] Complete specification chain (constitution → specs → plan → tasks)
- [ ] Demo-ready with sample data

---

## Appendix A: Quick Reference

### Essential Commands

```bash
# Start development environment
docker-compose up

# Run frontend only
cd frontend && npm run dev

# Run backend only
cd backend && uvicorn app.main:app --reload

# Generate specifications
cd .spec-kit && npm run spec:generate

# Run tests
npm test          # Frontend
pytest           # Backend
```

### Key Files

| File | Purpose |
|------|---------|
| `constitution.md` | This document — project governance |
| `.env.example` | Environment variable template |
| `docker-compose.yml` | Local development orchestration |
| `.spec-kit/config.yaml` | Spec-Kit Plus configuration |

---

**Constitution Version:** v2.0
**Effective Date:** December 30, 2025
**Author:** Claude Code (Agentic Generation)
**Approval:** Immediate — Authorizes Phase II development launch

*This constitution serves as the authoritative source for all Phase II decisions. All agents, developers, and specifications must align with its principles.*
