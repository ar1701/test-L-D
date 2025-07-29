#!/usr/bin/env python3
"""
Database migration script to add unique constraint to email field
"""
import sqlite3
import os
import shutil
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'smartcard.db')
BACKUP_PATH = os.path.join(os.path.dirname(__file__), f'smartcard_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db')

def migrate_database():
    """Migrate database to add unique constraint to email field"""
    
    # Check if database exists
    if not os.path.exists(DB_PATH):
        print("No existing database found. Creating new database with proper schema.")
        from database import init_database
        init_database()
        return
    
    # Create backup
    print(f"Creating backup: {BACKUP_PATH}")
    shutil.copy2(DB_PATH, BACKUP_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if the table already has unique constraint on email
        cursor.execute("PRAGMA table_info(free_trial_requests)")
        columns = cursor.fetchall()
        
        # Check if email column exists and if it has unique constraint
        email_column_info = None
        for column in columns:
            if column[1] == 'email':  # column[1] is the column name
                email_column_info = column
                break
        
        if email_column_info:
            # Check for unique constraint by trying to get indices
            cursor.execute("PRAGMA index_list(free_trial_requests)")
            indices = cursor.fetchall()
            
            has_unique_email = False
            for index in indices:
                if index[2] == 1:  # unique index
                    cursor.execute(f"PRAGMA index_info({index[1]})")
                    index_columns = cursor.fetchall()
                    for col in index_columns:
                        cursor.execute("PRAGMA table_info(free_trial_requests)")
                        table_columns = cursor.fetchall()
                        if table_columns[col[1]][1] == 'email':  # column name is email
                            has_unique_email = True
                            break
            
            if has_unique_email:
                print("Database already has unique constraint on email. No migration needed.")
                conn.close()
                return
        
        print("Migrating database to add unique constraint on email...")
        
        # Get all existing data
        cursor.execute("SELECT * FROM free_trial_requests")
        existing_requests = cursor.fetchall()
        
        cursor.execute("SELECT * FROM interns")
        existing_interns = cursor.fetchall()
        
        # Drop existing tables
        cursor.execute("DROP TABLE IF EXISTS free_trial_requests")
        cursor.execute("DROP TABLE IF EXISTS interns")
        
        # Recreate tables with proper schema
        cursor.execute('''
            CREATE TABLE free_trial_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                company TEXT NOT NULL,
                phone TEXT NOT NULL,
                industry_domain TEXT NOT NULL,
                smartcard_usage TEXT,
                primary_use_case TEXT,
                account_type TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                assigned_intern_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (assigned_intern_id) REFERENCES interns (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE interns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT NOT NULL,
                specialization TEXT NOT NULL,
                assigned_count INTEGER DEFAULT 0,
                completed_count INTEGER DEFAULT 0,
                success_rate REAL DEFAULT 0.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert existing data back (remove duplicates for requests based on email)
        seen_emails = set()
        unique_requests = []
        
        for request in existing_requests:
            email = request[3]  # email is at index 3
            if email not in seen_emails:
                seen_emails.add(email)
                unique_requests.append(request)
            else:
                print(f"Removing duplicate request for email: {email}")
        
        # Insert unique requests
        for request in unique_requests:
            cursor.execute('''
                INSERT INTO free_trial_requests (
                    id, first_name, last_name, email, company, phone, 
                    industry_domain, smartcard_usage, primary_use_case, 
                    account_type, status, assigned_intern_id, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', request)
        
        # Insert existing interns
        for intern in existing_interns:
            cursor.execute('''
                INSERT INTO interns (
                    id, name, username, password, email, specialization,
                    assigned_count, completed_count, success_rate, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', intern)
        
        conn.commit()
        print("Migration completed successfully!")
        print(f"Processed {len(unique_requests)} unique requests (removed {len(existing_requests) - len(unique_requests)} duplicates)")
        print(f"Processed {len(existing_interns)} interns")
        
    except Exception as e:
        print(f"Migration failed: {str(e)}")
        conn.rollback()
        # Restore backup
        if os.path.exists(BACKUP_PATH):
            print("Restoring backup...")
            shutil.copy2(BACKUP_PATH, DB_PATH)
        raise e
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
