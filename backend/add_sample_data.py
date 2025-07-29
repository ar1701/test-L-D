#!/usr/bin/env python3
"""
Script to add sample data to the database via direct database operations
"""
import sqlite3
import os

DB_PATH = 'smartcard.db'

def add_sample_data():
    """Add sample interns and admin user"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if interns table exists and has data
        cursor.execute("SELECT COUNT(*) FROM interns")
        intern_count = cursor.fetchone()[0]
        
        if intern_count == 0:
            print("Adding sample interns...")
            # Add sample interns
            interns = [
                ('John Smith', 'john.smith', 'password123', 'john.smith@company.com', 'IoT & Smart Systems'),
                ('Sarah Johnson', 'sarah.johnson', 'password123', 'sarah.johnson@company.com', 'Security & Access Control'), 
                ('Mike Chen', 'mike.chen', 'password123', 'mike.chen@company.com', 'Mobile Applications')
            ]
            
            for intern in interns:
                cursor.execute('''
                    INSERT INTO interns (name, username, password, email, specialization, assigned_count, completed_count, success_rate)
                    VALUES (?, ?, ?, ?, ?, 0, 0, 0.0)
                ''', intern)
                print(f"  - Added intern: {intern[0]}")
            
            conn.commit()
            print("Sample interns added successfully!")
        else:
            print(f"Database already has {intern_count} interns")
        
        # Show current interns
        cursor.execute("SELECT id, name, specialization, assigned_count FROM interns")
        interns = cursor.fetchall()
        print("\nCurrent interns in database:")
        for intern in interns:
            print(f"  ID: {intern[0]}, Name: {intern[1]}, Specialization: {intern[2]}, Assigned: {intern[3]}")
        
        # Show current requests
        cursor.execute("SELECT COUNT(*) FROM free_trial_requests")
        request_count = cursor.fetchone()[0]
        print(f"\nCurrent free trial requests: {request_count}")
        
        if request_count > 0:
            cursor.execute("SELECT id, email, status, assigned_intern_id FROM free_trial_requests")
            requests = cursor.fetchall()
            print("Requests:")
            for req in requests:
                print(f"  ID: {req[0]}, Email: {req[1]}, Status: {req[2]}, Assigned Intern: {req[3]}")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_sample_data()
