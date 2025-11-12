"""
Database Migration Script
Adds new columns to existing tables:
- students: roll_number, email, photo_path
- attendance: camera_id
"""

import sqlite3
import os

# Database path
DB_PATH = "./sql_app.db"

def migrate_database():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        print("Creating new database with updated schema...")
        from backend.app.services.database import create_db_and_tables
        create_db_and_tables()
        print("✓ New database created successfully!")
        return

    print(f"Migrating database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if columns already exist
    cursor.execute("PRAGMA table_info(students)")
    students_columns = [column[1] for column in cursor.fetchall()]
    
    cursor.execute("PRAGMA table_info(attendance)")
    attendance_columns = [column[1] for column in cursor.fetchall()]

    try:
        # Add new columns to students table if they don't exist
        if 'roll_number' not in students_columns:
            print("Adding 'roll_number' column to students table...")
            cursor.execute("ALTER TABLE students ADD COLUMN roll_number TEXT")
            print("✓ Added roll_number column")
        else:
            print("✓ roll_number column already exists")

        if 'email' not in students_columns:
            print("Adding 'email' column to students table...")
            cursor.execute("ALTER TABLE students ADD COLUMN email TEXT")
            print("✓ Added email column")
        else:
            print("✓ email column already exists")

        if 'photo_path' not in students_columns:
            print("Adding 'photo_path' column to students table...")
            cursor.execute("ALTER TABLE students ADD COLUMN photo_path TEXT")
            print("✓ Added photo_path column")
        else:
            print("✓ photo_path column already exists")

        # Add new column to attendance table if it doesn't exist
        if 'camera_id' not in attendance_columns:
            print("Adding 'camera_id' column to attendance table...")
            cursor.execute("ALTER TABLE attendance ADD COLUMN camera_id TEXT")
            print("✓ Added camera_id column")
        else:
            print("✓ camera_id column already exists")

        # Update existing students with default roll numbers if needed
        cursor.execute("SELECT id, name FROM students WHERE roll_number IS NULL")
        students_without_roll = cursor.fetchall()
        
        if students_without_roll:
            print(f"\nUpdating {len(students_without_roll)} students with default roll numbers...")
            for student_id, name in students_without_roll:
                default_roll = f"STU{student_id:04d}"
                cursor.execute("UPDATE students SET roll_number = ? WHERE id = ?", (default_roll, student_id))
            print("✓ Updated existing students with default roll numbers")

        conn.commit()
        print("\n✓ Database migration completed successfully!")

    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
