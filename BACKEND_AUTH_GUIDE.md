# Todo App - Complete Authentication System

This guide explains how to set up and run the complete working signup/signin system.

## Overview

The authentication system now includes:
- ✅ Complete backend API with signup/signin endpoints
- ✅ Password validation (min 8 chars, uppercase, lowercase, number)
- ✅ Duplicate email detection
- ✅ Real error messages
- ✅ JWT token authentication
- ✅ Password hashing (SHA-256)
- ✅ Frontend connected to backend

## Environment Variables

### Backend (`backend/.env`)
```env
BETTER_AUTH_SECRET=d7a9ed6f731c1a05926598e546cc3759c8d16a5543850c7ebb19b37c0ab077a8
BETTER_AUTH_URL=http://localhost:3003
DATABASE_URL=postgresql://neondb_owner:npg_jCklh6bnPd5r@...neondb?sslmode=require&channel_binding=require
```

### Frontend (`frontend/.env`)
```env
BETTER_AUTH_SECRET=EaOuHd7ZaLW7xG0Cknx3n6E3hNcUihsQ
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note:** The `NEXT_PUBLIC_AUTH_URL` has been removed since auth is now in the backend itself.

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- `email-validator>=2.0.0` - For email validation

### 2. Run Database Migration

```bash
cd backend
python migrate_db.py
```

This script adds:
- `password_hash` column to `user` table
- `name` column to `user` table
- Makes `email` NOT NULL and UNIQUE

### 3. Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at: `http://localhost:8000`

### 4. Start the Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will be running at: `http://localhost:3000`

## Testing the Signup System

### Method 1: Via Frontend UI

1. Navigate to `http://localhost:3000/sign-up`
2. Fill in the form:
   - **Name**: (optional) John Doe
   - **Email**: test@example.com
   - **Password**: Test1234 (must have uppercase, lowercase, number, and min 8 chars)
   - **Confirm Password**: Test1234
3. Click "Create Account"
4. You should be redirected to `/tasks` page

### Method 2: Via API (curl)

**Signup:**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "1a2b3c4d...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Signin:**
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

## Error Messages

The system provides specific error messages:

| Error | HTTP Code | Message |
|-------|-----------|---------|
| Invalid email | 422 | `Invalid email format` |
| Password too short | 422 | `Password must be at least 8 characters` |
| No uppercase | 422 | `Password must contain at least one uppercase letter` |
| No lowercase | 422 | `Password must contain at least one lowercase letter` |
| No number | 422 | `Password must contain at least one number` |
| Email exists | 400 | `Email already registered. Please sign in instead.` |
| User not found | 404 | `No account found with this email. Please sign up first.` |
| Wrong password | 401 | `Invalid password. Please try again.` |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/signin` | Sign in to existing account |

### Tasks (Protected - requires JWT token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/{id}` | Get single task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion |

### General

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API info |

## File Structure

### Backend
```
backend/
├── app/
│   ├── main.py              # FastAPI app with auth router
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models.py            # User, Task models
│   ├── auth.py              # JWT verification
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # NEW: Signup/Signin endpoints
│       └── tasks.py         # Task CRUD endpoints
├── migrate_db.py            # NEW: Database migration script
├── requirements.txt
└── .env
```

### Frontend
```
frontend/
├── src/
│   ├── lib/
│   │   ├── api.ts           # Task API client (uses localStorage token)
│   │   ├── auth.ts          # Auth API client (updated)
│   │   └── utils.ts
│   ├── contexts/
│   │   └── TaskContext.tsx  # Task state management
│   └── app/
│       ├── (auth)/
│       │   ├── sign-in/page.tsx
│       │   └── sign-up/page.tsx
│       └── (dashboard)/
│           ├── layout.tsx   # With TaskProvider
│           └── tasks/page.tsx
└── .env
```

## Security Notes

**This implementation is for demonstration purposes.** For production:

1. **Use bcrypt instead of SHA-256** for password hashing
2. **Use random salt per user** instead of fixed salt
3. **Add rate limiting** to prevent brute force attacks
4. **Implement refresh tokens** for better session management
5. **Add email verification** for signup
6. **Add password reset functionality**
7. **Use HTTPS** in production
8. **Store secrets securely** (e.g., AWS Secrets Manager, HashiCorp Vault)

## Troubleshooting

### "Email already registered" error
- The email already exists in the database
- Try signing in instead, or use a different email

### "Invalid password" error
- Make sure you're using the exact password you signed up with
- Passwords are case-sensitive

### "Failed to create account" (generic)
- Check backend logs: `python backend/app/main.py`
- Verify backend is running: `curl http://localhost:8000/health`
- Check frontend console for detailed error messages

### Database connection error
- Verify `DATABASE_URL` in `backend/.env`
- Ensure PostgreSQL is running and accessible
- Run migration: `python backend/migrate_db.py`

## Next Steps

After signup works:
1. Create tasks at `/tasks`
2. Try the filter tabs (All, Active, Completed)
3. Search tasks
4. Edit/delete tasks
5. Sign out and sign back in to test persistence
