"""FastAPI application main module."""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db, close_db
from .routers import tasks, auth


@asynccontextmanager
async def lifespan(app: FastAPI) -> None:
    """Application lifespan context manager for startup and shutdown."""
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()


# Create FastAPI app
app = FastAPI(
    title="The Evolution of Todo API",
    version="1.0.0",
    description="Backend API for The Evolution of Todo Phase II",
    lifespan=lifespan,
)

# CORS configuration
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.better_auth_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/")
async def root() -> dict:
    """Root endpoint with API information."""
    return {
        "name": "The Evolution of Todo API",
        "version": "1.0.0",
        "status": "running",
    }
