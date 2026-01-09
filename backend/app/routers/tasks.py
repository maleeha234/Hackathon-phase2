"""Tasks router module with all CRUD endpoints."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession as SASession

from ..models import Task
from ..auth import get_current_user
from ..database import get_session
from .schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(get_current_user),
    session: SASession = Depends(get_session),
) -> Task:
    """Create a new task for the authenticated user."""
    task = Task(user_id=user_id, **task_data.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    completed: Optional[bool] = None,
    user_id: str = Depends(get_current_user),
    session: SASession = Depends(get_session),
) -> list[Task]:
    """List all tasks for the authenticated user."""
    query = select(Task).where(Task.user_id == user_id)
    if completed is not None:
        query = query.where(Task.completed == completed)
    query = query.order_by(Task.created_at.desc())

    result = await session.execute(query)
    return result.scalars().all()


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    user_id: str = Depends(get_current_user),
    session: SASession = Depends(get_session),
) -> Task:
    """Get a single task by ID.

    Returns 404 if task not found OR if task exists but is not owned by user.
    This prevents user enumeration attacks.
    """
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskCreate,
    user_id: str = Depends(get_current_user),
    session: SASession = Depends(get_session),
) -> Task:
    """Update an existing task.

    Returns 404 if task not found OR if task exists but is not owned by user.
    """
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.title = task_data.title
    task.description = task_data.description
    task.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    user_id: str = Depends(get_current_user),
    session: SASession = Depends(get_session),
) -> None:
    """Delete a task.

    Returns 404 if task not found OR if task exists but is not owned by user.
    """
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await session.delete(task)
    await session.commit()


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_complete(
    task_id: str,
    user_id: str = Depends(get_current_user),
    session: SASession = Depends(get_session),
) -> Task:
    """Toggle task completion status.

    Returns 404 if task not found OR if task exists but is not owned by user.
    """
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(task)
    return task
