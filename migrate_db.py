"""
Database migration script to add new columns to existing tables
"""
import sqlite3
import os
import shutil
from datetime import datetime

DB_PATH = "./sql_app.db"
BACKUP_PATH = f"./sql_app_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"

def migrate_database():
    # Create backup
    if os.path.exists(DB_PATH):
        print(f"Creating backup: {BACKUP_PATH}")
        shutil.copy2(DB_PATH, BACKUP_PATH)
    
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if columns exist
        cursor.execute("PRAGMA table_info(students)")
        columns = [col[1] for col in cursor.fetchall()]
        
        # Add new columns to students table if they don't exist
        if 'roll_number' not in columns:
            print("Adding roll_number column to students table...")
            cursor.execute("ALTER TABLE students ADD COLUMN roll_number TEXT")
            print("✓ Added roll_number column")
        
        if 'email' not in columns:
            print("Adding email column to students table...")
            cursor.execute("ALTER TABLE students ADD COLUMN email TEXT")
            print("✓ Added email column")
        
        if 'photo_path' not in columns:
            print("Adding photo_path column to students table...")
            cursor.execute("ALTER TABLE students ADD COLUMN photo_path TEXT")
            print("✓ Added photo_path column")
        
        # Check attendance table
        cursor.execute("PRAGMA table_info(attendance)")
        att_columns = [col[1] for col in cursor.fetchall()]
        
        if 'camera_id' not in att_columns:
            print("Adding camera_id column to attendance table...")
            cursor.execute("ALTER TABLE attendance ADD COLUMN camera_id TEXT")
            print("✓ Added camera_id column")
        
        # Commit changes
        conn.commit()
        print("\n✅ Database migration completed successfully!")
        print(f"Backup saved at: {BACKUP_PATH}")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
