"""JWT authentication module for verifying tokens."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Optional
import os

from .config import get_settings
from .database import get_session
from .models import User


# Security scheme
security = HTTPBearer()


class TokenPayload(BaseModel):
    """JWT token payload structure."""
    sub: str
    exp: Optional[int] = None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session = Depends(get_session),
) -> str:
    """Extract and verify the current user from JWT token.

    Creates the user if they don't exist (for Better Auth compatibility).

    Args:
        credentials: HTTP Bearer credentials from request header.
        session: Database session.

    Returns:
        str: The user ID from the token's 'sub' claim.

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired.
    """
    settings = get_settings()
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing user identifier"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Auto-create user if not exists (for Better Auth compatibility)
    from sqlmodel import select
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user is None:
        # Create new user
        new_user = User(id=user_id)
        session.add(new_user)
        await session.commit()

    return user_id
