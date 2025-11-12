"""
Database migration script to add new fields to existing tables
Run this script to update your database schema without losing data
"""

from backend.app.services.database import engine, Base, Student, Attendance
from sqlalchemy import inspect, text

def migrate_database():
    inspector = inspect(engine)
    
    # Check existing columns in students table
    student_columns = [col['name'] for col in inspector.get_columns('students')]
    
    with engine.connect() as conn:
        # Add new columns to students table if they don't exist
        if 'roll_number' not in student_columns:
            print("Adding roll_number column to students table...")
            conn.execute(text("ALTER TABLE students ADD COLUMN roll_number VARCHAR"))
            conn.commit()
            
        if 'email' not in student_columns:
            print("Adding email column to students table...")
            conn.execute(text("ALTER TABLE students ADD COLUMN email VARCHAR"))
            conn.commit()
            
        if 'photo_path' not in student_columns:
            print("Adding photo_path column to students table...")
            conn.execute(text("ALTER TABLE students ADD COLUMN photo_path VARCHAR"))
            conn.commit()
    
    # Check existing columns in attendance table
    attendance_columns = [col['name'] for col in inspector.get_columns('attendance')]
    
    with engine.connect() as conn:
        # Add camera_id column to attendance table if it doesn't exist
        if 'camera_id' not in attendance_columns:
            print("Adding camera_id column to attendance table...")
            conn.execute(text("ALTER TABLE attendance ADD COLUMN camera_id VARCHAR"))
            conn.commit()
    
    print("✓ Database migration completed successfully!")
    print("Note: Existing students will have NULL values for new fields.")
    print("You can update them through the UI.")

if __name__ == "__main__":
    print("Starting database migration...")
    migrate_database()
