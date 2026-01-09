"""SQLModel database models for User and Task entities."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid

if TYPE_CHECKING:
    from .routers.tasks import Task  # noqa: F401


def utcnow() -> datetime:
    """Return current UTC datetime."""
    return datetime.utcnow()


class User(SQLModel, table=True):
    """User model representing authenticated users."""

    id: str = Field(primary_key=True, max_length=255)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: Optional[str] = Field(default=None, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """Task model representing todo items owned by users."""

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36
    )
    user_id: str = Field(
        foreign_key="user.id",
        max_length=255,
        ondelete="CASCADE"
    )
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")
