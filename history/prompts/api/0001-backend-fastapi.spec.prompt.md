---
id: "0001"
title: "Backend FastAPI Specification"
stage: "spec"
feature: "api"
date_iso: "2026-01-09"
model: "claude-sonnet-4-5-20250929"
branch: "master"
user: "Human"
command: "/sp.specify"
labels:
  - backend
  - fastapi
  - specification
  - jwt
  - postgresql
links:
  - SPEC: specs/api/v1_backend.spec.md
---

files_created:
  - specs/api/v1_backend.spec.md

prompt_text: |
  /sp.specify

  Generate the backend specification for Phase II of The Evolution of Todo.

  Requirements:
  - JWT authentication using Better Auth's JWT plugin with HS256 signing
  - User isolation: users can only access their own tasks
  - Neon PostgreSQL database with SQLModel ORM (async)
  - RESTful API design with proper HTTP methods and status codes
  - Environment variables: BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL
  - All endpoints under /api/ path
  - Proper error handling with JSON format: {"error": {"code": "CODE", "message": "message", "status": number}}

  Authentication requirements:
  - JWT tokens contain "sub" claim with user ID
  - 401 Unauthorized for missing/invalid/expired tokens
  - 404 Not Found for tasks not owned by user (never 403 to prevent enumeration)

  Environment variables (MUST use exact values):
  - BETTER_AUTH_SECRET: d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8
  - BETTER_AUTH_URL: http://localhost:3003
  - DATABASE_URL: postgresql://neondb_owner:npg_jCklh6bnPd5r@ep-snowy-sun-a78s5nex-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

  Output format: Complete backend specification document (Markdown)
  Include:
  - User stories with acceptance criteria
  - SQLModel User and Task models
  - JWT middleware implementation
  - All API endpoints (POST, GET, PUT, DELETE, PATCH)
  - Error response format
  - Async best practices
  - Testing scenarios

response_text: |
  Created comprehensive backend specification at specs/api/v1_backend.spec.md including:

  **Environment Variables:**
  - BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL with exact values provided

  **User Stories & Acceptance Criteria:**
  - User Story 1: Task CRUD Operations (P1)
  - User Story 2: Secure Multi-User Isolation (P1)
  - User Story 3: API Integration with Frontend (P1)

  **Data Models:**
  - User model with id, email, created_at, tasks relationship
  - Task model with id, user_id, title, description, completed, created_at, updated_at
  - Indexes on user_id, created_at, completed

  **JWT Middleware:**
  - HTTPBearer security scheme
  - Token verification with jose library
  - User extraction from "sub" claim
  - Proper 401 error handling

  **API Endpoints:**
  - POST /api/tasks - Create task (201)
  - GET /api/tasks - List tasks (200)
  - GET /api/tasks/{id} - Get single task (200)
  - PUT /api/tasks/{id} - Full update (200)
  - DELETE /api/tasks/{id} - Delete task (204)
  - PATCH /api/tasks/{id}/complete - Toggle completion (200)

  **Error Handling:**
  - Standard format: {"error": {"code": "...", "message": "...", "status": N}}
  - Error codes: INVALID_TOKEN, TASK_NOT_FOUND, VALIDATION_ERROR, INTERNAL_ERROR

  **Dependencies:**
  - fastapi>=0.115.0, sqlmodel>=0.0.0, asyncpg, python-jose[cryptography]>=3.3.0, pydantic>=2.0.0, uvicorn[standard]>=0.30.0
