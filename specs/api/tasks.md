---
id: "tasks-001"
title: "Backend Implementation Tasks"
feature: "api"
date_iso: "2026-01-09"
based_on: "specs/api/plan.md"
model: "claude-sonnet-4-5-20250929"
---

# Backend Implementation Tasks

**Feature**: API - FastAPI Backend for Phase II
**Based On**: `specs/api/plan.md`
**Date**: January 9, 2026
**Status**: Ready for Implementation

---

## Phase 1: Project Foundation

**Objective**: Set up project structure, dependencies, and configuration

### T001: Create backend directory structure

- **Description**: Create `backend/` directory with `app/` subdirectory structure
- **Acceptance Criteria**:
  - [ ] `backend/` directory exists at project root
  - [ ] `backend/app/` directory exists
  - [ ] `backend/app/routers/` directory exists
  - [ ] `backend/app/routers/__init__.py` created
  - [ ] All directories have `__init__.py` files
- **Reference**: Plan Section 3 - Phase 1

### T002: Create requirements.txt

- **Description**: Add all Python dependencies from specification
- **Acceptance Criteria**:
  - [ ] `fastapi>=0.115.0` included
  - [ ] `sqlmodel>=0.0.0` included
  - [ ] `pyjwt[crypto]>=2.9.0` included (using pyjwt per ADR1)
  - [ ] `pydantic>=2.0.0` included
  - [ ] `uvicorn[standard]>=0.30.0` included
  - [ ] `python-multipart>=0.0.9` included (for form data)
- **Reference**: v1_backend.spec.md Section 2

### T003: Create .env file with environment variables

- **Description**: Create `.env` file with all required environment variables
- **Acceptance Criteria**:
  - [ ] `BETTER_AUTH_SECRET=d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8`
  - [ ] `BETTER_AUTH_URL=http://localhost:3003`
  - [ ] `DATABASE_URL` set to provided Neon PostgreSQL URL
  - [ ] No hardcoded values in Python files
- **Reference**: v1_backend.spec.md Section 1

### T004: Create config.py for environment loading

- **Description**: Create `backend/app/config.py` to load and validate environment variables
- **Acceptance Criteria**:
  - [ ] Uses `pydantic-settings` or `python-dotenv`
  - [ ] Loads `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`
  - [ ] Provides typed access to configuration
  - [ ] Raises error if required variables missing
- **Reference**: Plan Decision 2

### T005: Create database.py with async engine

- **Description**: Create `backend/app/database.py` with async SQLModel setup
- **Acceptance Criteria**:
  - [ ] Uses `create_async_engine()` not `create_engine()`
  - [ ] Engine configured with Neon PostgreSQL URL
  - [ ] Implements lifespan context manager for startup/shutdown
  - [ ] Provides `get_session()` async dependency
  - [ ] Uses `AsyncSession` throughout
- **Reference**: v1_backend.spec.md Section 7, Plan Decision 6

### T006: Create main.py with FastAPI app

- **Description**: Create `backend/app/main.py` with app initialization
- **Acceptance Criteria**:
  - [ ] FastAPI app created with title "The Evolution of Todo API"
  - [ ] Version set to "1.0.0"
  - [ ] CORS configured for localhost:3000 and localhost:3003
  - [ ] Health check endpoint at `/health`
  - [ ] Includes all routers under `/api` prefix
- **Reference**: v1_backend.spec.md Section 7

### T007: Verify Phase 1 - Server starts

- **Description**: Verify backend server starts without errors
- **Acceptance Criteria**:
  - [ ] `uvicorn app.main:app --reload` starts successfully
  - [ ] Server responds on http://localhost:8000
  - [ ] Health check returns 200 OK
- **Validation**: `curl http://localhost:8000/health`

---

## Phase 2: Models & Database

**Objective**: Define SQLModel entities and create database tables

### T008: Create User model

- **Description**: Define User SQLModel in `backend/app/models.py`
- **Acceptance Criteria**:
  - [ ] `id: str` as primary key, max_length=255
  - [ ] `email: Optional[str]` with max_length=255
  - [ ] `created_at: datetime` with default_factory
  - [ ] `tasks` relationship defined
- **Reference**: v1_backend.spec.md Section 3, Plan Decision 3

### T009: Create Task model

- **Description**: Define Task SQLModel in `backend/app/models.py`
- **Acceptance Criteria**:
  - [ ] `id: str` with UUID default_factory, primary key, max_length=36
  - [ ] `user_id: str` foreign_key to User.id, max_length=255, ondelete="CASCADE"
  - [ ] `title: str` with min_length=1, max_length=100
  - [ ] `description: Optional[str]` with max_length=1000
  - [ ] `completed: bool` with default=False
  - [ ] `created_at: datetime` with default_factory
  - [ ] `updated_at: datetime` with default_factory
  - [ ] `user` relationship defined
- **Reference**: v1_backend.spec.md Section 3

### T010: Create database tables

- **Description**: Run SQLModel to create tables in Neon PostgreSQL
- **Acceptance Criteria**:
  - [ ] `users` table created
  - [ ] `task` table created (SQLModel pluralizes)
  - [ ] Foreign key relationship established
  - [ ] Indexes created on user_id, created_at, completed
- **Reference**: v1_backend.spec.md Section 3 - Indexes

### T011: Verify database connection

- **Description**: Test async database connection
- **Acceptance Criteria**:
  - [ ] Async engine connects to Neon successfully
  - [ ] Session can execute SELECT on users table
  - [ ] No sync operations in database code
- **Validation**: Python script connecting and querying

---

## Phase 3: JWT Authentication

**Objective**: Implement JWT verification middleware

### T012: Create HTTPBearer security scheme

- **Description**: Set up HTTPBearer in `backend/app/auth.py`
- **Acceptance Criteria**:
  - [ ] `HTTPBearer` imported from fastapi.security
  - [ ] Security scheme instantiated
  - [ ] Works with Depends() in routes
- **Reference**: v1_backend.spec.md Section 4

### T013: Implement token decoding with pyjwt

- **Description**: Create JWT verification logic using pyjwt
- **Acceptance Criteria**:
  - [ ] Uses `jwt.decode()` from pyjwt
  - [ ] Verifies with HS256 algorithm
  - [ ] Uses `BETTER_AUTH_SECRET` from environment
  - [ ] Checks `verify_exp=True` for expiration
- **Reference**: v1_backend.spec.md Section 4, Plan Decision 1

### T014: Create get_current_user dependency

- **Description**: Implement `get_current_user()` dependency
- **Acceptance Criteria**:
  - [ ] Returns `str` (user_id from token)
  - [ ] Raises HTTPException 401 for missing token
  - [ ] Raises HTTPException 401 for invalid token
  - [ ] Raises HTTPException 401 for expired token
  - [ ] Extracts `sub` claim from token payload
- **Reference**: v1_backend.spec.md Section 4

### T015: Test authentication endpoints

- **Description**: Verify JWT middleware works correctly
- **Acceptance Criteria**:
  - [ ] Missing Authorization header → 401
  - [ ] Invalid token → 401
  - [ ] Expired token → 401
  - [ ] Valid token → returns user_id
- **Validation**: Curl tests for each scenario

---

## Phase 4: Task CRUD Endpoints

**Objective**: Implement all API endpoints with proper user isolation

### T016: Create Pydantic request schemas

- **Description**: Define TaskCreate, TaskUpdate Pydantic models
- **Acceptance Criteria**:
  - [ ] `TaskCreate` with title (required), description (optional)
  - [ ] `TaskUpdate` with all optional fields
  - [ ] Validation: title 1-100 chars, description max 1000
- **Reference**: v1_backend.spec.md Section 5

### T017: Create Pydantic response schemas

- **Description**: Define TaskResponse Pydantic model
- **Acceptance Criteria**:
  - [ ] Includes all Task fields
  - [ ] Response format wraps in `{"data": ...}` per spec
  - [ ] Datetime fields serialized as ISO strings
- **Reference**: v1_backend.spec.md Section 5

### T018: Implement user isolation helper

- **Description**: Create helper for querying tasks with user filter
- **Acceptance Criteria**:
  - [ ] Every query filters by `user_id`
  - [ ] Returns None if task not found OR not owned
  - [ ] Never reveals existence of tasks to wrong users
- **Reference**: v1_backend.spec.md Section 4, Plan Decision 4

### T019: POST /api/tasks - Create task

- **Description**: Implement task creation endpoint
- **Acceptance Criteria**:
  - [ ] Requires `Authorization: Bearer <token>`
  - [ ] Validates request body with Pydantic
  - [ ] Creates task with authenticated user's user_id
  - [ ] Returns 201 Created
  - [ ] Returns task in `{"data": ...}` format
  - [ ] Returns 422 for validation errors
- **Reference**: v1_backend.spec.md Section 5 - POST /api/tasks

### T020: GET /api/tasks - List tasks

- **Description**: Implement task list endpoint
- **Acceptance Criteria**:
  - [ ] Requires `Authorization: Bearer <token>`
  - [ ] Returns only tasks owned by authenticated user
  - [ ] Supports `?completed=true/false` filter
  - [ ] Returns 200 OK with array
  - [ ] Returns `{"data": [...]}` format
- **Reference**: v1_backend.spec.md Section 5 - GET /api/tasks

### T021: GET /api/tasks/{id} - Get single task

- **Description**: Implement single task retrieval
- **Acceptance Criteria**:
  - [ ] Requires `Authorization: Bearer <token>`
  - [ ] Returns 404 if task not found OR not owned
  - [ ] Never returns 403 (prevents enumeration)
  - [ ] Returns 200 OK with task
  - [ ] Returns `{"data": {...}}` format
- **Reference**: v1_backend.spec.md Section 5 - GET /api/tasks/{id}

### T022: PUT /api/tasks/{id} - Full update

- **Description**: Implement task full update endpoint
- **Acceptance Criteria**:
  - [ ] Requires `Authorization: Bearer <token>`
  - [ ] Validates all fields in request body
  - [ ] Updates all provided fields
  - [ ] Returns 404 if not owned
  - [ ] Returns 200 OK with updated task
  - [ ] Returns `{"data": {...}}` format
- **Reference**: v1_backend.spec.md Section 5 - PUT /api/tasks/{id}

### T023: DELETE /api/tasks/{id} - Delete task

- **Description**: Implement task deletion endpoint
- **Acceptance Criteria**:
  - [ ] Requires `Authorization: Bearer <token>`
  - [ ] Returns 404 if not owned
  - [ ] Returns 204 No Content
  - [ ] Task removed from database (CASCADE)
- **Reference**: v1_backend.spec.md Section 5 - DELETE /api/tasks/{id}

### T024: PATCH /api/tasks/{id}/complete - Toggle completion

- **Description**: Implement task completion toggle endpoint
- **Acceptance Criteria**:
  - [ ] Requires `Authorization: Bearer <token>`
  - [ ] Flips `completed` boolean field
  - [ ] Returns 404 if not owned
  - [ ] Returns 200 OK with updated task
  - [ ] Returns `{"data": {...}}` format
- **Reference**: v1_backend.spec.md Section 5 - PATCH /api/tasks/{id}/complete

---

## Phase 5: Error Handling & Validation

**Objective**: Implement consistent error responses

### T025: Implement validation error handling

- **Description**: Ensure 422 responses for validation errors
- **Acceptance Criteria**:
  - [ ] Missing title → 422 with detail
  - [ ] Title > 100 chars → 422 with detail
  - [ ] Description > 1000 chars → 422 with detail
  - [ ] Error message is user-friendly
- **Reference**: v1_backend.spec.md Section 6, Plan Decision 4

### T026: Implement 404 handling

- **Description**: Ensure proper 404 responses for user isolation
- **Acceptance Criteria**:
  - [ ] Non-existent task ID → 404
  - [ ] Task owned by other user → 404 (never 403!)
  - [ ] Message: "Task not found"
- **Reference**: v1_backend.spec.md Section 6, FR-005

### T027: Test all error scenarios

- **Description**: Verify error handling for all edge cases
- **Acceptance Criteria**:
  - [ ] Missing token → 401 with message
  - [ ] Invalid token → 401 with message
  - [ ] Expired token → 401 with message
  - [ ] Missing sub claim → 401 with message
  - [ ] All 4xx errors return `{"detail": "..."}` format
- **Reference**: v1_backend.spec.md Section 6

---

## Phase 6: Integration & Testing

**Objective**: Validate complete system with security and integration tests

### T028: Security audit - Token validation

- **Description**: Comprehensive token validation tests
- **Acceptance Criteria**:
  - [ ] No token → 401
  - [ ] Bearer prefix missing → 401
  - [ ] Malformed token → 401
  - [ ] Wrong signature → 401
  - [ ] Expired token → 401
  - [ ] Token without sub claim → 401
- **Reference**: Plan Section 6 - Security Tests

### T029: Security audit - User isolation

- **Description**: Verify user isolation prevents data leakage
- **Acceptance Criteria**:
  - [ ] User A cannot read User B's task (→ 404)
  - [ ] User A cannot update User B's task (→ 404)
  - [ ] User A cannot delete User B's task (→ 404)
  - [ ] User A cannot toggle User B's task (→ 404)
  - [ ] Error responses contain no task metadata
- **Reference**: Plan Section 6 - Security Tests

### T030: CRUD flow test

- **Description**: Test complete create → read → update → delete flow
- **Acceptance Criteria**:
  - [ ] Create task → 201, returns task with id
  - [ ] List tasks → 200, includes new task
  - [ ] Get task → 200, correct task data
  - [ ] Update task → 200, updated fields
  - [ ] Toggle complete → 200, completed=true
  - [ ] Delete task → 204, task removed
- **Reference**: Plan Section 6 - Happy Path Tests

### T031: Data persistence test

- **Description**: Verify data survives backend restart
- **Acceptance Criteria**:
  - [ ] Create task
  - [ ] Restart backend server
  - [ ] List tasks → created task still present
  - [ ] All task fields correct
- **Reference**: Plan Section 6 - Persistence

### T032: Edge case testing

- **Description**: Test boundary conditions
- **Acceptance Criteria**:
  - [ ] Non-existent task ID → 404
  - [ ] Invalid UUID format → 422 or 404
  - [ ] Empty title → 422
  - [ ] Title exactly 100 chars → 201
  - [ ] Title 101 chars → 422
- **Reference**: Plan Section 6 - Edge Cases

### T033: Performance validation

- **Description**: Verify response times meet targets
- **Acceptance Criteria**:
  - [ ] List tasks < 100ms
  - [ ] Create task < 100ms
  - [ ] Get task < 50ms
  - [ ] Query plan shows index usage on user_id
  - [ ] No N+1 query patterns
- **Reference**: v1_backend.spec.md SC-004

### T034: End-to-end journey test

- **Description**: Simulate complete user journey
- **Acceptance Criteria**:
  - [ ] Generate valid JWT for user
  - [ ] Create task as user
  - [ ] List only user's tasks
  - [ ] Verify no cross-user access possible
  - [ ] All operations complete successfully
- **Reference**: Plan Section 6 - Full E2E Journey

---

## Phase 7: Documentation & Handover

**Objective**: Finalize documentation and prepare for demo

### T035: Document API endpoints

- **Description**: Create API documentation summary
- **Acceptance Criteria**:
  - [ ] All endpoints documented with method, path, request, response
  - [ ] Authentication requirements clear
  - [ ] Error codes documented
  - [ ] Example curl commands provided
- **Reference**: v1_backend.spec.md Section 5

### T036: Create run script

- **Description**: Create startup script for easy execution
- **Acceptance Criteria**:
  - [ ] Script installs dependencies
  - [ ] Script starts uvicorn server
  - [ ] Script sets environment variables from .env
- **Reference**: Plan Section 12

### T037: Verify full-stack integration readiness

- **Description**: Confirm backend ready for frontend integration
- **Acceptance Criteria**:
  - [ ] CORS allows localhost:3000
  - [ ] JWT secret matches frontend expectation
  - [ ] API response format matches frontend API client
  - [ ] All frontend API calls will succeed
- **Reference**: v1_backend.spec.md SC-005

---

## Task Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Foundation | T001-T007 | Pending |
| Phase 2: Models | T008-T011 | Pending |
| Phase 3: Authentication | T012-T015 | Pending |
| Phase 4: CRUD Endpoints | T016-T024 | Pending |
| Phase 5: Error Handling | T025-T027 | Pending |
| Phase 6: Integration & Testing | T028-T034 | Pending |
| Phase 7: Documentation | T035-T037 | Pending |

**Total Tasks**: 37

---

## Validation Commands

### Quick Test Suite

```bash
# Start server
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Generate test JWT (in Python)
from jose import jwt
token = jwt.encode(
    {"sub": "test-user-123", "exp": 9999999999},
    "d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8",
    algorithm="HS256"
)
echo $token

# Test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/tasks
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task"}'
```

### Security Test Commands

```bash
# Missing token
curl http://localhost:8000/api/tasks
# Expected: 401 {"detail":"Missing authentication credentials"}

# Invalid token
curl -H "Authorization: Bearer invalid" http://localhost:8000/api/tasks
# Expected: 401 {"detail":"Invalid or expired token"}
```

---

## Dependencies Between Tasks

```
T001-T006 (Foundation)
    ↓
T007 (Phase 1 Validation)
    ↓
T008-T010 (Models)
    ↓
T011 (Phase 2 Validation)
    ↓
T012-T014 (Auth)
    ↓
T015 (Phase 3 Validation)
    ↓
T016-T017 (Schemas)
    ↓
T018 (User Isolation Helper)
    ↓
T019-T024 (CRUD Endpoints)
    ↓
T025-T027 (Error Handling)
    ↓
T028-T034 (Integration Tests)
    ↓
T035-T037 (Documentation)
```

---

## Notes

- All database operations must be async (no sync `session.execute()`)
- All routes must be `async def`
- Every query MUST include `user_id` filter
- Never return 403 for user isolation failures (use 404)
- Use `Depends(get_current_user)` on all protected routes
- Validate with Pydantic models before database operations
- Test each task immediately after completion
