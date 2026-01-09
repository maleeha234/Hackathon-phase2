# Quick Start Guide - Todo App with Working Auth

## One-Command Setup & Run

### Terminal 1 - Backend
```bash
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Run database migration (first time only)
python migrate_db.py

# Start backend server
uvicorn app.main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend

# Start frontend server
npm run dev
```

## Test Signup Immediately

1. Open browser: `http://localhost:3000/sign-up`
2. Enter:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test1234`
   - Confirm Password: `Test1234`
3. Click "Create Account"
4. You'll be redirected to tasks page

## What's Working

✅ **Backend API** (http://localhost:8000)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `GET/POST/PUT/DELETE /api/tasks` - Task management

✅ **Frontend** (http://localhost:3000)
- Sign up form with validation
- Sign in form
- Task management (create, edit, delete, complete)
- Search & filter tasks
- Loading states & error messages

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

Example valid passwords: `Test1234`, `Password9`, `MySecret1`

## Files Changed/Created

### Backend
- `backend/app/routers/auth.py` - NEW: Auth endpoints
- `backend/app/models.py` - Updated: Added password_hash, name fields
- `backend/app/main.py` - Updated: Added auth router
- `backend/migrate_db.py` - NEW: Database migration
- `backend/requirements.txt` - Added email-validator

### Frontend
- `frontend/src/lib/auth.ts` - Updated: Now connects to backend API
- `frontend/src/lib/api.ts` - Updated: Uses localStorage for token
- `frontend/src/app/(auth)/sign-in/page.tsx` - Connected to API
- `frontend/src/app/(auth)/sign-up/page.tsx` - Connected to API
- `frontend/src/app/(dashboard)/tasks/page.tsx` - Connected to API
- `frontend/src/contexts/TaskContext.tsx` - Task state management
- `frontend/.env` - Added NEXT_PUBLIC_API_URL

### Documentation
- `BACKEND_AUTH_GUIDE.md` - Complete documentation
- `QUICKSTART.md` - This file

## Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### Test Signup via curl
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test"}'
```

### Test Signin via curl
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Email already registered" | Use different email or sign in |
| "Invalid password" | Check requirements (8+ chars, upper, lower, number) |
| Backend not responding | Run `python migrate_db.py` then restart backend |
| Frontend API errors | Check NEXT_PUBLIC_API_URL in .env |
| CORS errors | Backend at http://localhost:8000, frontend at 3000 |

## Next Steps

1. ✅ Test signup/signin flow
2. ✅ Create tasks
3. ✅ Test task filtering (All/Active/Completed)
4. ✅ Test search functionality
5. ✅ Sign out and sign back in

All features are working! The signup system is complete.
