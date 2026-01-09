---
id: "plan-001"
title: "Backend Implementation Plan"
feature: "api"
version: "1.0.0"
date_iso: "2026-01-09"
status: "approved"
based_on: "specs/api/v1_backend.spec.md"
model: "claude-sonnet-4-5-20250929"
---

# Backend Implementation Plan: The Evolution of Todo Phase II

**Version**: 1.0.0
**Status**: Approved
**Specification Reference**: `specs/api/v1_backend.spec.md`
**Date**: January 9, 2026

---

## 1. Executive Summary

This plan guides the implementation of a secure, production-ready FastAPI backend for Phase II of "The Evolution of Todo." The implementation prioritizes security-first architecture, proper user isolation, and seamless integration with the completed Next.js frontend. All decisions are documented with clear rationale, and the implementation follows a phased approach with mandatory validation checkpoints.

### Key Objectives

- **Zero-Vulnerability Security**: JWT-based authentication with proper token validation, no trust of unverified user input
- **Perfect User Isolation**: Every database query filters by authenticated user_id; 404 responses prevent enumeration
- **Neon PostgreSQL Persistence**: Async SQLModel integration with proper connection pooling and session management
- **Frontend Integration**: API contracts match frontend expectations for immediate plug-and-play connectivity
- **Hackathon-Ready**: Fast response times, clean error handling, and robust edge case coverage

---

## 2. Architectural Decisions

### Decision 1: JWT Library Selection

**Decision**: Use `pyjwt[crypto]` for JWT operations

| Criteria | `pyjwt[crypto]` | `python-jose` |
|----------|-----------------|---------------|
| Simplicity | Single import, intuitive API | More verbose, additional abstractions |
| Speed | Faster execution | Slight overhead from extra layer |
| Algorithm Support | HS256, RS256, ES256 | Same, but more complex configuration |
| Maintenance | Actively maintained | Also active, but more complex |
| Type Safety | Better type hints | Good type hints |

**Rationale**: PyJWT provides the simplest, fastest path for HS256 JWT verification without unnecessary abstraction layers. The `[crypto]` extra provides cryptographic primitives needed for token signing/verification. For this project's scope, pyjwt's straightforward API reduces cognitive load and potential for misconfiguration.

**Reference**: `v1_backend.spec.md` Section 4 - JWT Middleware

---

### Decision 2: Database URL Handling

**Decision**: Use standard `DATABASE_URL` environment variable (rename from provided value)

**Provided Value**:
```
postgresql://neondb_owner:npg_jCklh6bnPd5r@ep-snowy-sun-a78s5nex-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Implementation**: Store exactly as provided in `.env` as `DATABASE_URL`

**Rationale**:
- `DATABASE_URL` is the de facto standard for database connection strings across frameworks
- SQLModel's `create_async_engine()` expects a URL string parameter
- Using standard naming improves code portability and reduces confusion
- No transformation needed - the provided Neon URL is already correctly formatted

**Reference**: `v1_backend.spec.md` Section 1 - Environment Variables

---

### Decision 3: User Model Strategy

**Decision**: Define lightweight User model with `id: str` as primary key (not rely solely on JWT token)

```python
class User(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=255)  # From JWT sub claim
    email: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: list["Task"] = Relationship(back_populates="user")
```

**Rationale**:
1. **Future Expansion**: Enables user preferences, profile data, and cross-references
2. **Data Integrity**: Foreign key constraints ensure task-to-user relationship integrity
3. **Cascading Deletes**: `ondelete="CASCADE"` on Task.user_id automatically cleans up tasks when user deleted
4. **Audit Trail**: `created_at` enables user activity tracking if needed
5. **Query Optimization**: Proper indexed foreign key improves JOIN performance

**Trade-off**: Slight additional complexity vs. token-only approach, but worth it for maintainability.

**Reference**: `v1_backend.spec.md` Section 3 - Database Schema & Models

---

### Decision 4: Error Response Format

**Decision**: Standardized JSON format: `{ "detail": "Human-readable message" }`

**Response Examples**:

| Scenario | Status | Response |
|----------|--------|----------|
| Missing token | 401 | `{ "detail": "Missing authentication credentials" }` |
| Invalid token | 401 | `{ "detail": "Invalid or expired token" }` |
| Task not found | 404 | `{ "detail": "Task not found" }` |
| Validation error | 422 | `{ "detail": "Title is required" }` (field-specific) |
| Internal error | 500 | `{ "detail": "An internal error occurred" }` |

**Rationale**:
- FastAPI's default `detail` key is well-understood by developers
- Matches what axios/fetch expect when calling `.json()` on error responses
- Simpler than custom nested structure while still providing code/message/status when needed
- Frontend can easily parse and display user-friendly messages

**Alternative Considered**: Custom `{ "error": { "code": "...", "message": "...", "status": N } }` format
- Rejected because it requires custom exception handlers and additional frontend parsing logic
- Standard format integrates with FastAPI's built-in HTTPException automatically

**Reference**: `v1_backend.spec.md` Section 6 - Error Response Format

---

### Decision 5: Route Organization

**Decision**: Single router file `app/routers/tasks.py` with clear internal separation

**Directory Structure**:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, lifespan, CORS
│   ├── config.py            # Environment loading
│   ├── models.py            # SQLModel User, Task
│   ├── database.py          # Engine, session, lifespan
│   ├── auth.py              # JWT verification dependency
│   ├── routers/
│   │   ├── __init__.py
│   │   └── tasks.py         # All task endpoints
│   └── schemas/             # Pydantic models (optional)
├── requirements.txt
└── .env
```

**Rationale**:
- Simpler project structure for single-resource API
- All task operations in one file improves discoverability
- Router prefix `/tasks` can be mounted at `/api` in main.py
- Avoids premature abstraction (routers/, users/, auth/ folders not needed yet)
- Easy to refactor later if scope expands

**Trade-off**: Less separation than fully modular structure, but appropriate for Phase II MVP.

**Reference**: `v1_backend.spec.md` Section 5 - API Endpoints

---

### Decision 6: Session Management

**Decision**: Per-request async session via FastAPI dependency injection

```python
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session

@app.get("/tasks", dependencies=[Depends(get_current_user)])
async def list_tasks(session: AsyncSession = Depends(get_session), user_id: str = Depends(get_current_user)):
    # Use session for queries
```

**Rationale**:
- Each request gets a fresh session (no state leakage)
- Automatic cleanup via context manager
- Works seamlessly with FastAPI's dependency injection
- Enables proper transaction management
- Follows SQLModel async best practices

**Implementation Details**:
- `AsyncSession` from `sqlmodel.ext.asyncio.session`
- Engine created once at startup via lifespan
- Session opened and closed per request

**Reference**: `v1_backend.spec.md` Section 7 - Dependency Injection Setup

---

## 3. Implementation Phases

### Phase 1: Project Foundation

**Objective**: Set up project structure, dependencies, and configuration

**Tasks**:

| # | Task | Description | Validation |
|---|------|-------------|------------|
| 1.1 | Create backend directory | Create `backend/` with `app/` subdirectory structure | Directory exists with all folders |
| 1.2 | Create requirements.txt | Add all dependencies from spec section 2 | File created with correct versions |
| 1.3 | Create .env file | Add all three environment variables | Variables load correctly |
| 1.4 | Create config.py | Load and validate environment variables | No hardcoded secrets, proper typing |
| 1.5 | Create database.py | Async engine, session factory, lifespan | Engine connects to Neon DB |
| 1.6 | Run initial test | Start server, verify it responds | `uvicorn main:app --reload` works |

**Reference**: `v1_backend.spec.md` Section 1, 2, 7

---

### Phase 2: Models & Database

**Objective**: Define SQLModel entities and create database tables

**Tasks**:

| # | Task | Description | Validation |
|---|------|-------------|------------|
| 2.1 | Create models.py | Define User model with id, email, created_at | Type check passes |
| 2.2 | Create models.py | Define Task model with all fields and relationships | Type check passes |
| 2.3 | Create indexes | idx_task_user_id, idx_task_created_at, idx_task_completed | Indexes created in DB |
| 2.4 | Run migrations | Create tables in Neon PostgreSQL | Tables exist in neondb |
| 2.5 | Verify connection | Query User table, confirm async operation | SELECT works, no sync errors |

**SQLModel Definition**:

```python
# backend/app/models.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

class User(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: List["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, max_length=36)
    user_id: str = Field(foreign_key="user.id", max_length=255, ondelete="CASCADE")
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="tasks")
```

**Reference**: `v1_backend.spec.md` Section 3 - Database Schema & Models

---

### Phase 3: JWT Authentication

**Objective**: Implement JWT verification middleware

**Tasks**:

| # | Task | Description | Validation |
|---|------|-------------|------------|
| 3.1 | Create auth.py | HTTPBearer security scheme setup | Security scheme configured |
| 3.2 | Create auth.py | Token decoding with pyjwt[crypto] | Valid token returns user_id |
| 3.3 | Create auth.py | get_current_user dependency | Returns str, raises 401 on error |
| 3.4 | Test token validation | Invalid token → 401, expired → 401 | All cases return 401 |
| 3.5 | Test user extraction | Token with sub claim → user_id | Correct extraction |

**Implementation**:

```python
# backend/app/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel
import os

security = HTTPBearer()

class TokenPayload(BaseModel):
    sub: str
    exp: Optional[int] = None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    token = credentials.credentials
    secret = os.getenv("BETTER_AUTH_SECRET")

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing user identifier"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
```

**Reference**: `v1_backend.spec.md` Section 4 - JWT Middleware

**Security Validation**:
- Never trust path/user_id parameters without JWT verification
- Always extract user_id from token, never from request body or params
- Verify token expiration is checked

---

### Phase 4: Task CRUD Endpoints

**Objective**: Implement all API endpoints with proper user isolation

**Tasks**:

| # | Task | Description | Validation |
|---|------|-------------|------------|
| 4.1 | Create Pydantic schemas | TaskCreate, TaskUpdate, TaskResponse | Validation works correctly |
| 4.2 | POST /tasks | Create task endpoint (201) | Returns created task with id |
| 4.3 | GET /tasks | List user's tasks (200) | Returns array, filtered by user_id |
| 4.4 | GET /tasks/{id} | Get single task (200) | Returns task, 404 if not owned |
| 4.5 | PUT /tasks/{id} | Full update (200) | Updates all fields, 404 if not owned |
| 4.6 | DELETE /tasks/{id} | Delete task (204) | Removes from DB, 404 if not owned |
| 4.7 | PATCH /tasks/{id}/complete | Toggle completion (200) | Flips completed status |

**User Isolation Validation**:
```python
# Every query MUST filter by user_id
async def get_task_by_id(task_id: str, user_id: str) -> Task | None:
    result = await session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    return result.one_or_none()
```

**Endpoint Specifications**:

| Method | Path | Status (Success) | Request Body | Response |
|--------|------|------------------|--------------|----------|
| POST | /api/tasks | 201 Created | TaskCreate | TaskResponse |
| GET | /api/tasks | 200 OK | - | {"data": [TaskResponse]} |
| GET | /api/tasks/{id} | 200 OK | - | {"data": TaskResponse} |
| PUT | /api/tasks/{id} | 200 OK | TaskCreate | {"data": TaskResponse} |
| DELETE | /api/tasks/{id} | 204 No Content | - | - |
| PATCH | /api/tasks/{id}/complete | 200 OK | - | {"data": TaskResponse} |

**Reference**: `v1_backend.spec.md` Section 5 - API Endpoints

---

### Phase 5: Error Handling & Validation

**Objective**: Implement consistent error responses

**Tasks**:

| # | Task | Description | Validation |
|---|------|-------------|------------|
| 5.1 | Custom exception handler | Register global exception handler | All errors return JSON |
| 5.2 | 401 handling | Missing/invalid token → 401 | Correct detail message |
| 5.3 | 404 handling | Task not found → 404 | No information leakage |
| 5.4 | 422 handling | Validation error → 422 | Field-specific errors |
| 5.5 | Edge cases | Empty title, title > 100 chars | Proper validation |

**Error Response Format**:

```python
# All errors return:
{
    "detail": "Human-readable message"
}
```

**Security Note on 404 vs 403**:
- Never return 403 for tasks owned by other users
- Return 404 for both "task not found" and "task exists but not owned"
- This prevents user enumeration attacks

**Reference**: `v1_backend.spec.md` Section 6 - Error Response Format

---

### Phase 6: Integration & Testing

**Objective**: Validate complete system with security and integration tests

**Tasks**:

| # | Test | Description | Success Criteria |
|---|------|-------------|------------------|
| 6.1 | Security audit | Invalid/missing token → 401 | Returns 401 with detail |
| 6.2 | Cross-user isolation | User A accesses User B's task | Returns 404, no data leaked |
| 6.3 | CRUD flow | Create → List → Update → Delete | All operations succeed |
| 6.4 | Persistence | Restart backend, verify data | Tasks persist across restarts |
| 6.5 | Edge cases | Non-existent ID, invalid body | 404/422 responses |
| 6.6 | Performance | Response times < 200ms p95 | Timings within budget |
| 6.7 | Full E2E journey | Signup → Login → JWT → Tasks | Complete flow works |

**Security Validation Checklist**:
- [ ] Token without Bearer prefix → 401
- [ ] Expired token → 401
- [ ] Malformed token → 401
- [ ] User A trying to read User B's task → 404
- [ ] User A trying to update User B's task → 404
- [ ] User A trying to delete User B's task → 404
- [ ] Request with valid token missing sub claim → 401
- [ ] No sensitive data in error messages

**Performance Validation**:
- [ ] Index on user_id used in query plan
- [ ] No N+1 query patterns
- [ ] Response times < 200ms at p95

---

## 4. Security Requirements

### Critical Security Rules

1. **Never Trust User Input in Queries**
   ```python
   # WRONG - DO NOT DO THIS
   await session.exec(f"SELECT * FROM tasks WHERE id = '{task_id}'")

   # CORRECT - Use parameterized queries
   await session.exec(select(Task).where(Task.id == task_id))
   ```

2. **Always Verify Token First**
   ```python
   # Every protected endpoint must call get_current_user first
   @app.get("/tasks/{id}")
   async def get_task(
       task_id: str,
       user_id: str = Depends(get_current_user),  # Must be first
       session: AsyncSession = Depends(get_session)
   ):
   ```

3. **User Isolation in Every Query**
   ```python
   # Every database access must filter by user_id
   result = await session.exec(
       select(Task).where(Task.id == task_id, Task.user_id == user_id)
   )
   ```

4. **No Information Leakage**
   - 404 for tasks owned by other users (not 403)
   - Generic error messages for internal errors
   - No stack traces in responses

### Environment Variables (Never Hardcode)

| Variable | Value | Purpose |
|----------|-------|---------|
| `BETTER_AUTH_SECRET` | `d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8` | JWT verification |
| `BETTER_AUTH_URL` | `http://localhost:3003` | CORS reference |
| `DATABASE_URL` | Neon PostgreSQL URL | Database connection |

**Reference**: `v1_backend.spec.md` Section 1 - Environment Variables

---

## 5. Async Best Practices

All database operations MUST use async/await:

```python
# Engine creation
from sqlmodel import create_async_engine
engine = create_async_engine(DATABASE_URL, echo=False)

# Session dependency
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session

# Route handlers
async def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
) -> TaskResponse:
    task = Task(user_id=user_id, **task_data.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task
```

**Rules**:
- Use `async def` for all route handlers
- Use `await` for all database operations
- Use `create_async_engine()` not `create_engine()`
- Use `AsyncSession` not `Session`
- Never block in route handlers

**Reference**: `v1_backend.spec.md` Section 8 - Async Best Practices

---

## 6. Validation Checkpoints

Each phase must pass validation before proceeding:

| Phase | Checkpoint | Tool/Command |
|-------|------------|--------------|
| 1 | Server starts without errors | `uvicorn main:app --reload` |
| 2 | Tables exist in neondb | SQL query or inspection tool |
| 3 | JWT verification works | Manual test with valid/invalid tokens |
| 4 | All endpoints return correct status | HTTPie or curl tests |
| 5 | Error responses match format | Verify JSON structure |
| 6 | Full E2E flow succeeds | Integration test suite |

**Checkpoint 1 - Foundation**:
```bash
# Verify server starts
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Expected: Server starts on http://0.0.0.0:8000
```

**Checkpoint 2 - Models**:
```python
# In Python
from app.models import User, Task
print(User.__fields__, Task.__fields__)
# Expected: All fields defined correctly
```

**Checkpoint 3 - Auth**:
```bash
# Test missing token
curl http://localhost:8000/api/tasks
# Expected: 401 Unauthorized

# Test invalid token
curl -H "Authorization: Bearer invalid" http://localhost:8000/api/tasks
# Expected: 401 Unauthorized
```

**Checkpoint 4 - CRUD**:
```bash
# Create task (with valid JWT)
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "description": "Test"}'
# Expected: 201 Created with task data
```

---

## 7. Testing Scenarios

### Happy Path Tests

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Create task with valid JWT | 201 Created, task returned with id |
| 2 | List tasks | 200 OK, array of user's tasks |
| 3 | Get single task | 200 OK, task object |
| 4 | Update task | 200 OK, updated task |
| 5 | Toggle completion | 200 OK, completed=true |
| 6 | Delete task | 204 No Content, task removed |

### Security Tests

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Request without token | 401 Unauthorized |
| 2 | Request with invalid token | 401 Unauthorized |
| 3 | Request with expired token | 401 Unauthorized |
| 4 | User A accesses User B's task | 404 Not Found |

### Validation Tests

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Create task without title | 422 Validation Error |
| 2 | Create task with title > 100 chars | 422 Validation Error |
| 3 | Create task with description > 1000 chars | 422 Validation Error |

**Reference**: `v1_backend.spec.md` Section 9 - Testing Scenarios

---

## 8. File Manifest

### New Files Created

| File | Purpose |
|------|---------|
| `backend/requirements.txt` | Python dependencies |
| `backend/.env` | Environment variables |
| `backend/app/__init__.py` | Package marker |
| `backend/app/config.py` | Environment loading |
| `backend/app/database.py` | Async engine, sessions |
| `backend/app/models.py` | SQLModel User, Task |
| `backend/app/auth.py` | JWT verification |
| `backend/app/routers/__init__.py` | Package marker |
| `backend/app/routers/tasks.py` | All task endpoints |
| `backend/app/main.py` | FastAPI app, routes, CORS |

### Modified Files

None (new project).

### Deleted Files

None.

---

## 9. Success Criteria

### Functional Requirements (from spec)

- [ ] FR-001: RESTful API endpoints under `/api/`
- [ ] FR-002: JWT verification using BETTER_AUTH_SECRET
- [ ] FR-003: user_id extracted from JWT `sub` claim
- [ ] FR-004: 401 for missing/invalid/expired JWT
- [ ] FR-005: 404 for tasks not belonging to user (never 403)
- [ ] FR-006: 422 for validation errors
- [ ] FR-007: Persistence to Neon PostgreSQL
- [ ] FR-008: User model compatible with Better Auth
- [ ] FR-009: Task model with all required fields
- [ ] FR-010: Async operations throughout
- [ ] FR-011: Uses DATABASE_URL environment variable
- [ ] FR-012: Requires BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL

### Success Metrics

- [ ] All API endpoints respond with correct HTTP status codes
- [ ] JWT verification correctly authenticates users
- [ ] User isolation prevents cross-user data access
- [ ] Database operations complete within 200ms p95
- [ ] Frontend API calls succeed end-to-end
- [ ] Error responses follow JSON format
- [ ] No vulnerabilities in security audit
- [ ] Build and tests pass without errors

---

## 10. Rollback Plan

### If Issues Found During Phase 5-6:

1. **Database Issues**:
   - Use SQLModel's `create_tables()` to recreate
   - Neon console allows table inspection/deletion

2. **Authentication Issues**:
   - Verify BETTER_AUTH_SECRET matches frontend
   - Check token expiration timestamps

3. **User Isolation Issues**:
   - Audit all queries for missing `user_id` filter
   - Add integration test for cross-user access

4. **Performance Issues**:
   - Check query plans for missing indexes
   - Add EXPLAIN ANALYZE to slow queries

---

## 11. References

- **Specification**: `specs/api/v1_backend.spec.md`
- **Frontend Spec**: `specs/ui/frontend-ui-ux.md`
- **Constitution**: `constitution.md`
- **SQLModel Docs**: https://sqlmodel.tiangolo.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **PyJWT Docs**: https://pyjwt.readthedocs.io/
- **Neon Docs**: https://neon.tech/docs

---

## 12. Appendix: Quick Reference

### Environment Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Generate Test JWT

```python
from jose import jwt
token = jwt.encode(
    {"sub": "user-123", "exp": 9999999999},
    "d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8",
    algorithm="HS256"
)
print(token)
```

### API Base URL

```
http://localhost:8000/api
```

### Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```
