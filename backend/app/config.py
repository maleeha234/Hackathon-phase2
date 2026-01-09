"""Configuration module for loading environment variables."""

import os
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


class Settings(BaseModel):
    """Application settings loaded from environment variables."""

    # JWT Authentication
    better_auth_secret: str
    better_auth_url: str

    # Database
    database_url: str

    @classmethod
    def load(cls) -> "Settings":
        """Load settings from environment variables."""
        return cls(
            better_auth_secret=os.getenv("BETTER_AUTH_SECRET", ""),
            better_auth_url=os.getenv("BETTER_AUTH_URL", ""),
            database_url=os.getenv("DATABASE_URL", ""),
        )

    def validate(self) -> None:
        """Validate that all required settings are present."""
        missing = []
        if not self.better_auth_secret:
            missing.append("BETTER_AUTH_SECRET")
        if not self.better_auth_url:
            missing.append("BETTER_AUTH_URL")
        if not self.database_url:
            missing.append("DATABASE_URL")

        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")


# Global settings instance (lazy loaded)
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """Get the application settings."""
    global _settings
    if _settings is None:
        _settings = Settings.load()
        _settings.validate()
    return _settings
