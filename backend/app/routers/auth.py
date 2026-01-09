"""Authentication router for signup and signin.

Uses bcrypt for secure password hashing and provides comprehensive error handling.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
import re
import hashlib
import bcrypt

from ..config import get_settings
from ..database import get_session
from ..models import User
from sqlmodel import select


router = APIRouter()
security = HTTPBearer()
settings = get_settings()


# ==================== Request/Response Models ====================

class SignUpRequest(BaseModel):
    """Signup request model."""
    email: str
    password: str
    name: Optional[str] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Validate email format."""
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', v):
            raise ValueError('Invalid email format')
        return v.lower()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v


class SignInRequest(BaseModel):
    """Signin request model."""
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Validate email format."""
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', v):
            raise ValueError('Invalid email format')
        return v.lower()


class AuthResponse(BaseModel):
    """Authentication response model."""
    access_token: str
    token_type: str = "bearer"
    user: dict


class ErrorResponse(BaseModel):
    """Error response model."""
    detail: str


# ==================== Helper Functions ====================

def hash_password(password: str) -> str:
    """Hash password using bcrypt with salt.

    Args:
        password: Plain text password

    Returns:
        Hashed password
    """
    # bcrypt has a 72 byte limit, truncate if necessary
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash.

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database

    Returns:
        True if password matches, False otherwise
    """
    try:
        password_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token.

    Args:
        user_id: User's unique identifier
        email: User's email

    Returns:
        JWT token string
    """
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
    return token


# ==================== Endpoints ====================

@router.post(
    "/auth/signup",
    response_model=AuthResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Duplicate email"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
    summary="Create new user account",
    description="Register a new user with email and password. Password must be at least 8 characters with uppercase, lowercase, and number.",
)
async def signup(
    data: SignUpRequest,
    session = Depends(get_session),
) -> AuthResponse:
    """Create a new user account.

    Validates input, checks for duplicate emails, hashes password with bcrypt,
    and returns JWT token for immediate authentication.

    Raises:
        HTTPException: If validation fails or email already exists
    """
    try:
        # Check if email already exists
        result = await session.execute(
            select(User).where(User.email == data.email)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered. Please sign in instead."
            )

        # Generate user ID from email hash
        user_id = hashlib.sha256(data.email.encode()).hexdigest()[:32]

        # Hash password using bcrypt
        password_hash = hash_password(data.password)

        # Create new user
        new_user = User(
            id=user_id,
            email=data.email,
            password_hash=password_hash,
            name=data.name,
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

        # Generate access token
        access_token = create_access_token(user_id, data.email)

        return AuthResponse(
            access_token=access_token,
            user={
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
            }
        )

    except HTTPException:
        # Re-raise HTTP exceptions (validation, duplicate email)
        raise
    except Exception as e:
        # Catch and log any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating your account. Please try again later."
        )


@router.post(
    "/auth/signin",
    response_model=AuthResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
        404: {"model": ErrorResponse, "description": "User not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
    summary="Sign in to existing account",
    description="Authenticate with email and password to receive JWT access token.",
)
async def signin(
    data: SignInRequest,
    session = Depends(get_session),
) -> AuthResponse:
    """Sign in existing user.

    Verifies credentials using bcrypt password verification and returns JWT token.

    Raises:
        HTTPException: If user not found or password invalid
    """
    try:
        # Find user by email
        result = await session.execute(
            select(User).where(User.email == data.email)
        )
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account found with this email. Please sign up first."
            )

        # Verify password using bcrypt
        if not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password. Please try again."
            )

        # Generate access token
        access_token = create_access_token(user.id, user.email)

        return AuthResponse(
            access_token=access_token,
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
            }
        )

    except HTTPException:
        # Re-raise HTTP exceptions (user not found, invalid password)
        raise
    except Exception as e:
        # Catch and log any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while signing in. Please try again later."
        )


@router.get(
    "/auth/user",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
    summary="Get current user",
    description="Get information about the currently authenticated user.",
)
async def get_current_user_info(
    user_id: str = Depends(lambda: Depends(security)),
) -> dict:
    """Get current user information."""
    return {"message": "Use JWT token to access protected endpoints"}
