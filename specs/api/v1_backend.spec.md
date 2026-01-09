# Feature Specification: Backend FastAPI for Todo Application

**Feature Branch**: `005-backend-fastapi`
**Created**: January 9, 2026
**Status**: Draft
**Input**: Backend specification for The Evolution of Todo Phase II - FastAPI backend with JWT auth and PostgreSQL persistence

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Task CRUD Operations (Priority: P1)

As an authenticated user, I want to create, read, update, and delete my own tasks so that I can manage my todo list efficiently.

**Why this priority**: Core functionality - without task CRUD, the application has no value. This is the primary user interaction.

**Independent Test**: Can be tested by calling API endpoints with valid JWT token and verifying task data is created/returned/updated/deleted correctly with proper user isolation.

**Acceptance Scenarios**:

1. **Given** authenticated user with valid JWT, **When** they create a task via POST `/api/tasks`, **Then** task is saved with their `user_id` and returned with generated ID and timestamps.

2. **Given** authenticated user, **When** they request their tasks via GET `/api/tasks`, **Then** only tasks belonging to that user are returned.

3. **Given** authenticated user, **When** they update their task via PUT `/api/tasks/{id}`, **Then** task fields are modified and changes persisted.

4. **Given** authenticated user, **When** they delete their task via DELETE `/api/tasks/{id}`, **Then** task is removed from database and 204 status returned.

5. **Given** authenticated user, **When** they mark a task complete via PATCH `/api/tasks/{id}/complete`, **Then** task's `completed` status is toggled.

---

### User Story 2 - Secure Multi-User Isolation (Priority: P1)

As a user, I want assurance that my tasks are private and cannot be accessed, modified, or deleted by other users.

**Why this priority**: Security is non-negotiable. Without proper isolation, the application fails basic security requirements and user trust.

**Independent Test**: Can be tested by creating tasks as User A, then attempting to access/modify/delete User A's tasks as User B and verifying 403/404 responses.

**Acceptance Scenarios**:

1. **Given** authenticated User A owns task T1, **When** User B requests T1, **Then** response is 404 (not 403 to prevent enumeration).

2. **Given** authenticated User A, **When** they request tasks via GET `/api/tasks`, **Then** only tasks with matching `user_id` are returned.

3. **Given** missing or invalid JWT token, **When** any protected endpoint is accessed, **Then** response is 401 Unauthorized.

---

### User Story 3 - API Integration with Frontend (Priority: P1)

As a frontend developer, I want clean, well-documented API endpoints that match the frontend expectations so that integration is seamless.

**Why this priority**: Frontend cannot function without backend API. Poor integration causes user-facing failures.

**Independent Test**: Can be verified by running frontend dev server, performing UI actions, and confirming API calls succeed with proper JSON responses.

**Acceptance Scenarios**:

1. **Given** Next.js frontend sends request with `Authorization: Bearer <token>` header, **When** backend receives request, **Then** JWT is verified, `user_id` extracted, and operation performed.

2. **Given** API operation succeeds, **When** response is sent, **Then** response follows JSON format with proper status codes (201 for create, 200 for read/update, 204 for delete).

3. **Given** API validation fails, **When** response is sent, **Then** response includes error code, message, and 422 status.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend MUST expose RESTful API endpoints under `/api/` path for all task operations.
- **FR-002**: Backend MUST verify JWT tokens on every protected route using `BETTER_AUTH_SECRET` environment variable.
- **FR-003**: Backend MUST extract `user_id` from JWT `sub` claim and use it for all data access filtering.
- **FR-004**: Backend MUST return 401 Unauthorized for missing, invalid, or expired JWT tokens.
- **FR-005**: Backend MUST return 404 Not Found for tasks not belonging to the authenticated user (never 403 to prevent enumeration).
- **FR-006**: Backend MUST validate all request payloads against Pydantic models and return 422 for validation errors.
- **FR-007**: Backend MUST persist all data to Neon PostgreSQL database using SQLModel with async operations.
- **FR-008**: Backend MUST implement User model compatible with Better Auth's user identifiers.
- **FR-009**: Backend MUST implement Task model with fields: id, user_id, title, description, completed, created_at, updated_at.
- **FR-010**: Backend MUST use async engine, async sessions, and async route handlers throughout.
- **FR-011**: Backend MUST use the exact `DATABASE_URL` environment variable provided for Neon PostgreSQL connection.
- **FR-012**: Backend MUST provide the exact environment variables as specified: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`.

### Key Entities

- **User**: Represents authenticated user from Better Auth. Key attributes: `id` (from JWT sub claim), `email` (optional from JWT), `created_at`.
- **Task**: Represents a todo item owned by a user. Attributes: `id` (UUID), `user_id` (FK to User), `title` (string, 1-100 chars), `description` (optional, max 1000 chars), `completed` (boolean), `created_at` (datetime), `updated_at` (datetime).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All API endpoints respond with correct HTTP status codes (201, 200, 204, 401, 404, 422).
- **SC-002**: JWT verification correctly authenticates users and rejects invalid tokens with 401.
- **SC-003**: User isolation prevents any cross-user data access - verified by attempting unauthorized access.
- **SC-004**: Database operations complete within 200ms p95 for typical CRUD operations.
- **SC-005**: Frontend API calls succeed end-to-end with proper authentication flow.
- **SC-006**: Error responses follow the JSON format: `{"error": {"code": "CODE", "message": "message", "status": number}}`.

---

## Backend Specification Details *(additional for FastAPI)*

### 1. Environment Variables

The following environment variables MUST be configured:

| Variable | Value | Purpose |
|----------|-------|---------|
| `BETTER_AUTH_SECRET` | `d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8` | JWT verification secret (32-byte hex) |
| `BETTER_AUTH_URL` | `http://localhost:3003` | Frontend URL for CORS reference |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_jCklh6bnPd5r@ep-snowy-sun-a78s5nex-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Neon PostgreSQL connection string |

### 2. Dependencies (Python)

Only the following packages are permitted:

- `fastapi>=0.115.0` - Web framework
- `sqlmodel>=0.0.0` - ORM with Pydantic integration
- `asyncpg` - Async PostgreSQL driver (via DATABASE_URL)
- `python-jose[cryptography]>=3.3.0` - JWT verification
- `pydantic>=2.0.0` - Data validation and settings
- `uvicorn[standard]>=0.30.0` - ASGI server

### 3. Database Schema & Models

#### User Model (SQLModel)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=255)  # From JWT sub claim
    email: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: list["Task"] = Relationship(back_populates="user")
```

#### Task Model (SQLModel)

```python
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

#### Indexes

- `idx_task_user_id`: ON tasks(user_id) - for user isolation queries
- `idx_task_created_at`: ON tasks(created_at) - for sorting
- `idx_task_completed`: ON tasks(completed) - for filtering

### 4. JWT Middleware

#### Verification Process

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            BETTER_AUTH_SECRET,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"error": {"code": "INVALID_TOKEN", "message": "Token missing user identifier", "status": 401}}
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_TOKEN", "message": "Invalid or expired token", "status": 401}}
        )
```

#### User Isolation Pattern

All task operations MUST filter by `user_id`:

```python
async def get_task_by_id(task_id: str, user_id: str) -> Task | None:
    result = await session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    return result.one_or_none()
```

### 5. API Endpoints

All endpoints require: `Authorization: Bearer <JWT_TOKEN>`

#### POST /api/tasks

Create a new task.

**Request Body**:
```json
{
  "title": "string (1-100 chars, required)",
  "description": "string (0-1000 chars, optional)",
  "due_date": "string (ISO date, optional)"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "uuid",
    "user_id": "string",
    "title": "string",
    "description": "string | null",
    "completed": false,
    "created_at": "ISO datetime",
    "updated_at": "ISO datetime"
  }
}
```

**Errors**:
- 401: Invalid/missing token
- 422: Validation error (missing title, title too long)

---

#### GET /api/tasks

List all tasks for authenticated user.

**Query Parameters**:
- `completed` (optional): `true` | `false` - filter by completion status
- `sort` (optional): `due_date` | `created_at` | `title` - sort field

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "string",
      "title": "string",
      "description": "string | null",
      "completed": false,
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    }
  ]
}
```

**Errors**:
- 401: Invalid/missing token

---

#### GET /api/tasks/{id}

Get a single task by ID.

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "user_id": "string",
    "title": "string",
    "description": "string | null",
    "completed": false,
    "created_at": "ISO datetime",
    "updated_at": "ISO datetime"
  }
}
```

**Errors**:
- 401: Invalid/missing token
- 404: Task not found (or not owned by user)

---

#### PUT /api/tasks/{id}

Full update of a task (all fields).

**Request Body**:
```json
{
  "title": "string (1-100 chars, required)",
  "description": "string (0-1000 chars, optional)",
  "due_date": "string (ISO date, optional)"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "user_id": "string",
    "title": "string",
    "description": "string | null",
    "completed": false,
    "created_at": "ISO datetime",
    "updated_at": "ISO datetime"
  }
}
```

**Errors**:
- 401: Invalid/missing token
- 404: Task not found
- 422: Validation error

---

#### DELETE /api/tasks/{id}

Delete a task.

**Response** (204 No Content): Empty body

**Errors**:
- 401: Invalid/missing token
- 404: Task not found

---

#### PATCH /api/tasks/{id}/complete

Toggle task completion status.

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "user_id": "string",
    "title": "string",
    "description": "string | null",
    "completed": true,
    "created_at": "ISO datetime",
    "updated_at": "ISO datetime"
  }
}
```

**Errors**:
- 401: Invalid/missing token
- 404: Task not found

---

### 6. Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "status": 401 | 403 | 404 | 422 | 500
  }
}
```

**Error Codes**:

| Code | Status | Condition |
|------|--------|-----------|
| `INVALID_TOKEN` | 401 | Missing, invalid, or expired JWT |
| `TASK_NOT_FOUND` | 404 | Task ID not found or not owned by user |
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### 7. Dependency Injection Setup

```python
from fastapi import FastAPI
from sqlmodel import create_async_engine, AsyncSession

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, echo=False)

async def get_session() -> AsyncSession:
    async with AsyncSession(engine) as session:
        yield session

app = FastAPI(
    title="The Evolution of Todo API",
    version="1.0.0",
    dependencies=[Depends(get_session)]
)
```

### 8. Async Best Practices

- Use `async def` for all route handlers
- Use `await` for all database operations
- Use `create_async_engine()` for database connection
- Use `AsyncSession` for all sessions
- Avoid synchronous I/O operations in route handlers

### 9. Testing Scenarios

#### Happy Path Tests
1. Create task with valid JWT → 201 Created, task returned
2. List tasks → 200 OK, array of tasks
3. Get single task → 200 OK, task object
4. Update task → 200 OK, updated task
5. Toggle completion → 200 OK, updated task
6. Delete task → 204 No Content

#### Security Tests
1. Request without token → 401 Unauthorized
2. Request with invalid token → 401 Unauthorized
3. Request with expired token → 401 Unauthorized
4. User A tries to access User B's task → 404 Not Found

#### Validation Tests
1. Create task without title → 422 Validation Error
2. Create task with title > 100 chars → 422 Validation Error
3. Create task with description > 1000 chars → 422 Validation Error

---

## Assumptions

1. Better Auth issues JWTs with `sub` claim containing the user ID string.
2. JWTs use HS256 algorithm for signing.
3. Frontend handles token storage and automatic attachment to requests.
4. Frontend runs on `http://localhost:3000` for local development.
5. `due_date` field in Task model is allowed but not required to be implemented for Phase II MVP.
6. Advanced features (tags, priorities, recurring tasks) are out of scope for Phase II.
7. CORS configuration is handled by deployment infrastructure, not the backend spec.

---

## Notes

- This specification assumes the Frontend specification (`specs/ui/frontend-ui-ux.md`) and Constitution (`constitution.md`) as authoritative references.
- All paths use `/api/` prefix as required by the constitution.
- Environment variables are fixed and must match exactly.
- No additional frameworks, ORMs, or libraries beyond the specified dependencies.
- Async/await patterns must be used throughout for database operations.
