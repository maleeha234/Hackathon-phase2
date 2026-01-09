"""Database migration script to add auth fields to User model.

This script properly handles:
- Adding password_hash column
- Adding name column
- Making email NOT NULL
- Adding UNIQUE constraint on email (with duplicate handling)

Run this script to update the database schema for authentication:
    python migrate_db.py
"""

import asyncio
from sqlalchemy import text
from app.database import engine


async def migrate():
    """Run database migration."""
    print("Starting database migration...")
    print("-" * 50)

    async with engine.begin() as conn:
        # 1. Add password_hash column
        result = await conn.execute(
            text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'user'
                AND column_name = 'password_hash'
            """)
        )

        if not result.fetchone():
            print("1. Adding password_hash column to user table...")
            await conn.execute(
                text('ALTER TABLE "user" ADD COLUMN password_hash VARCHAR(255)')
            )
            print("   [OK] Added password_hash column")
        else:
            print("1. [OK] password_hash column already exists")

        # 2. Add name column
        result = await conn.execute(
            text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'user'
                AND column_name = 'name'
            """)
        )

        if not result.fetchone():
            print("2. Adding name column to user table...")
            await conn.execute(
                text('ALTER TABLE "user" ADD COLUMN name VARCHAR(255)')
            )
            print("   [OK] Added name column")
        else:
            print("2. [OK] name column already exists")

        # 3. Make email NOT NULL (if needed)
        result = await conn.execute(
            text("""
                SELECT is_nullable
                FROM information_schema.columns
                WHERE table_name = 'user'
                AND column_name = 'email'
            """)
        )
        email_nullable = result.scalar()

        if email_nullable == 'YES':
            print("3. Making email NOT NULL...")
            # Generate unique emails for NULL entries
            await conn.execute(
                text("""
                    UPDATE "user"
                    SET email = 'user_' || id || '@placeholder.com'
                    WHERE email IS NULL
                """)
            )
            await conn.execute(
                text('ALTER TABLE "user" ALTER COLUMN email SET NOT NULL')
            )
            print("   [OK] Made email NOT NULL")
        else:
            print("3. [OK] email is already NOT NULL")

        # 4. Add UNIQUE constraint on email (handle duplicates)
        result = await conn.execute(
            text("""
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = 'user'::regclass
                AND contype = 'u'
                AND conname LIKE '%email%'
            """)
        )

        if not result.fetchone():
            print("4. Adding unique constraint on email...")
            print("   Checking for duplicate emails...")

            # Find and fix duplicate emails
            result = await conn.execute(
                text("""
                    SELECT email, COUNT(*) as cnt
                    FROM "user"
                    WHERE email IS NOT NULL
                    GROUP BY email
                    HAVING COUNT(*) > 1
                """)
            )

            duplicates = result.fetchall()

            if duplicates:
                print(f"   Found {len(duplicates)} duplicate emails, fixing...")
                for row in duplicates:
                    email = row[0]
                    count = row[1]
                    print(f"   - Email '{email}' appears {count} times")

                    # Update duplicates with unique email
                    await conn.execute(
                        text("""
                            UPDATE "user"
                            SET email = email || '_' || id || '@duplicate.com'
                            WHERE id IN (
                                SELECT id
                                FROM (
                                    SELECT id,
                                           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
                                    FROM "user"
                                    WHERE email = :email
                                ) t
                                WHERE rn > 1
                            )
                        """),
                        {"email": email}
                    )
                print("   [OK] Fixed duplicate emails")

            # Now add the unique constraint
            await conn.execute(
                text('ALTER TABLE "user" ADD CONSTRAINT user_email_key UNIQUE (email)')
            )
            print("   [OK] Added unique constraint on email")
        else:
            print("4. [OK] Unique constraint on email already exists")

    print("-" * 50)
    print("=== Migration completed successfully! ===")
    print("\nYour database is now ready for authentication!")
    print("You can now start the backend server.")


if __name__ == "__main__":
    asyncio.run(migrate())
