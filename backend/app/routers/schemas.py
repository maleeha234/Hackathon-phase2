"""Pydantic schemas for task-related data validation."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Task title (1-100 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (optional, max 1000 characters)"
    )


class TaskUpdate(BaseModel):
    """Schema for updating a task."""

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Task title (1-100 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (optional, max 1000 characters)"
    )
    completed: Optional[bool] = Field(
        default=None,
        description="Task completion status"
    )


class TaskResponse(BaseModel):
    """Schema for task API responses."""

    id: str
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
