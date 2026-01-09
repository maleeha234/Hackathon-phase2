"""Script to initialize the database and test the connection."""
import asyncio
import sys
sys.path.insert(0, ".")

from app.config import get_settings
from app.database import init_db, engine
from sqlmodel import SQLModel


async def main():
    print("Initializing database...")
    print(f"Database URL: {get_settings().database_url[:50]}...")

    try:
        await init_db()
        print("Database initialized successfully!")
        print("Tables created:")
        for table in SQLModel.metadata.tables:
            print(f"  - {table}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
