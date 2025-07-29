import sqlite3
import os
from datetime import datetime

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'smartcard.db')

def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create free_trial_requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS free_trial_requests (
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
    
    # Create interns table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interns (
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
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn

def create_free_trial_request(data):
    """Create a new free trial request"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if email already exists
        cursor.execute('SELECT id FROM free_trial_requests WHERE email = ?', (data.get('email'),))
        existing_request = cursor.fetchone()
        
        if existing_request:
            raise ValueError('An account with this email already exists. Each email can only be used once for a free trial.')
        
        cursor.execute('''
            INSERT INTO free_trial_requests (
                first_name, last_name, email, company, phone, 
                industry_domain, smartcard_usage, primary_use_case, account_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('firstName'),
            data.get('lastName'),
            data.get('email'),
            data.get('company'),
            data.get('phone'),
            data.get('industryDomain'),
            data.get('smartcardUsage'),
            data.get('primaryUseCase'),
            data.get('accountType')
        ))
        
        request_id = cursor.lastrowid
        conn.commit()
        return request_id
        
    except ValueError as ve:
        conn.rollback()
        raise ve
    except Exception as e:
        conn.rollback()
        print(f"Database error in create_free_trial_request: {str(e)}")
        raise Exception("Database error occurred while creating request")
    finally:
        conn.close()

def get_all_free_trial_requests():
    """Get all free trial requests"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT ftr.*, i.name as intern_name
        FROM free_trial_requests ftr
        LEFT JOIN interns i ON ftr.assigned_intern_id = i.id
        ORDER BY ftr.created_at DESC
    ''')
    
    requests = cursor.fetchall()
    conn.close()
    
    return [dict(request) for request in requests]

def get_all_interns():
    """Get all interns"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM interns ORDER BY created_at DESC')
    
    interns = cursor.fetchall()
    conn.close()
    
    return [dict(intern) for intern in interns]

def create_intern_record(data):
    """Create a new intern"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO interns (name, username, password, email, specialization)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data.get('name'),
        data.get('username'),
        data.get('password'),
        data.get('email'),
        data.get('specialization')
    ))
    
    intern_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return intern_id

def assign_intern_to_request(request_id, intern_id):
    """Assign an intern to a free trial request (handles reassignment)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # First, get the current assignment to handle reassignment
        cursor.execute('''
            SELECT assigned_intern_id FROM free_trial_requests WHERE id = ?
        ''', (request_id,))
        result = cursor.fetchone()
        current_intern_id = result[0] if result else None
        
        # If there's a current intern assigned, decrease their count
        if current_intern_id:
            cursor.execute('''
                UPDATE interns 
                SET assigned_count = assigned_count - 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (current_intern_id,))
        
        # Update the request assignment
        if intern_id and intern_id != "":  # Check for empty string too
            # Assign new intern
            cursor.execute('''
                UPDATE free_trial_requests 
                SET assigned_intern_id = ?, status = 'assigned', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (intern_id, request_id))
            
            # Update new intern's assigned count
            cursor.execute('''
                UPDATE interns 
                SET assigned_count = assigned_count + 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (intern_id,))
        else:
            # Unassign (set to null)
            cursor.execute('''
                UPDATE free_trial_requests 
                SET assigned_intern_id = NULL, status = 'pending', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (request_id,))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in assign_intern_to_request: {str(e)}")
        raise Exception("Database error occurred while assigning intern")
    finally:
        conn.close()

def update_request_status(request_id, status):
    """Update the status of a free trial request"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE free_trial_requests 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (status, request_id))
    
    conn.commit()
    conn.close()

# Initialize database when module is imported
init_database()
