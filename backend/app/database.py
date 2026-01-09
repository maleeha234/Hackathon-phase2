"""Database module for async SQLModel setup."""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from urllib.parse import urlparse, parse_qs

from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine as sqlalchemy_create_async_engine, AsyncSession as SASession

from .config import get_settings


def build_async_db_url(database_url: str) -> tuple[str, dict]:
    """Convert synchronous PostgreSQL URL to async with asyncpg driver.

    Returns:
        Tuple of (async_url, connect_args)
    """
    # Parse the URL
    parsed = urlparse(database_url)

    # Extract SSL parameters from query string
    query_params = parse_qs(parsed.query)

    # Build async URL without query parameters
    async_url = f"postgresql+asyncpg://{parsed.netloc}{parsed.path}"

    # Add SSL settings as connect_args for asyncpg
    connect_args = {}
    if "sslmode" in query_params:
        connect_args["ssl"] = "require"
    if "channel_binding" in query_params:
        pass  # asyncpg doesn't support channel_binding

    return async_url, connect_args


# Create async engine using SQLAlchemy with asyncpg driver
settings = get_settings()
async_url, connect_args = build_async_db_url(settings.database_url)

engine = sqlalchemy_create_async_engine(
    async_url,
    echo=False,
    pool_pre_ping=True,
    connect_args=connect_args
)


@asynccontextmanager
async def get_engine() -> AsyncGenerator:
    """Context manager for the database engine."""
    yield engine


async def get_session() -> AsyncGenerator[SASession, None]:
    """Get an async database session.

    Yields:
        AsyncSession: An async SQLAlchemy session.
    """
    async with SASession(engine) as session:
        yield session


async def init_db() -> None:
    """Initialize the database by creating all tables."""
    from .models import User, Task  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """Close the database connection pool."""
    await engine.dispose()
