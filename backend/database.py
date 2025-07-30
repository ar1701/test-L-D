import sqlite3
import os
import json
from datetime import datetime

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'smartcard.db')

def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    cursor = conn.cursor()
    
    # Create tables if they don't exist (simple approach)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS free_trial_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            company TEXT NOT NULL,
            phone TEXT NOT NULL,
            industry_domain TEXT NOT NULL,
            domain_type TEXT DEFAULT 'predefined',
            primary_use_case TEXT,
            primary_use_case_type TEXT DEFAULT 'predefined',
            custom_primary_use_case TEXT,
            account_type TEXT NOT NULL,
            
            -- Demo-specific fields
            selected_integrations TEXT, -- JSON array
            custom_integration TEXT,
            demo_use_case_type TEXT DEFAULT 'predefined',
            custom_demo_use_case TEXT,
            demo_testing_use_case TEXT,
            
            -- New dashboard tracking columns
            dashboards_requested INTEGER DEFAULT 0,
            dashboards_delivered INTEGER DEFAULT 0,
            
            -- Project tracking fields
            use_cases_list TEXT, -- JSON array of use cases
            integrations_list TEXT, -- JSON array of integrations
            ld_session_dates TEXT, -- JSON array of session dates
            project_info TEXT, -- JSON object with project details
            customer_feedback TEXT,
            next_steps TEXT,
            
            -- New note fields
            admin_note TEXT,
            intern_note TEXT,
            
            -- API credentials for delivered projects
            api_username TEXT,
            api_password TEXT,
            api_key TEXT,
            api_endpoint TEXT,
            
            status TEXT DEFAULT 'pending',
            assigned_intern_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_intern_id) REFERENCES interns (id)
        )
    ''')
    
    # Create updated interns table with additional fields
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            whatsapp TEXT,
            specialization TEXT NOT NULL,
            integrations TEXT, -- JSON array of integrations
            status TEXT DEFAULT 'active', -- active, inactive, on_leave
            assigned_count INTEGER DEFAULT 0,
            completed_count INTEGER DEFAULT 0,
            success_rate REAL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create demo credentials table for demo access
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS demo_credentials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            company TEXT NOT NULL,
            phone TEXT NOT NULL,
            industry_domain TEXT NOT NULL,
            selected_integrations TEXT, -- JSON array
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            assigned_intern_id INTEGER,
            admin_note TEXT,
            intern_note TEXT,
            FOREIGN KEY (assigned_intern_id) REFERENCES interns (id)
        )
    ''')
    
    # Create notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_type TEXT NOT NULL, -- 'admin' or 'intern'
            recipient_id INTEGER, -- NULL for admin notifications, intern_id for intern notifications
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
            read_status BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            related_entity_type TEXT, -- 'customer', 'intern', 'demo', 'status_change', etc.
            related_entity_id INTEGER -- ID of the related entity
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection with optimized settings"""
    conn = sqlite3.connect(DB_PATH, timeout=30.0)  # 30 second timeout
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    
    # Optimize for concurrency and performance
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA synchronous=NORMAL')
    conn.execute('PRAGMA cache_size=10000')
    conn.execute('PRAGMA temp_store=memory')
    conn.execute('PRAGMA busy_timeout=30000')  # 30 second busy timeout
    
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
        
        # Prepare use case data
        primary_use_case = data.get('primaryUseCase') or data.get('customPrimaryUseCase', '')
        
        # Prepare integrations data for demo accounts
        selected_integrations = None
        if data.get('accountType') == 'demo' and data.get('selectedIntegrations'):
            selected_integrations = json.dumps(data.get('selectedIntegrations'))
        
        # Handle demo account specific fields
        api_username = None
        api_password = None
        status = 'pending'
        
        if data.get('accountType') == 'demo':
            api_username = data.get('api_username')
            api_password = data.get('api_password')
            status = 'demo_active'
        
        cursor.execute('''
            INSERT INTO free_trial_requests (
                first_name, last_name, email, company, phone, 
                industry_domain, domain_type, primary_use_case, 
                primary_use_case_type, custom_primary_use_case, account_type,
                selected_integrations, custom_integration, demo_use_case_type,
                custom_demo_use_case, demo_testing_use_case,
                api_username, api_password, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('firstName'),
            data.get('lastName'),
            data.get('email'),
            data.get('company'),
            data.get('phone'),
            data.get('industryDomain'),
            data.get('domainType', 'predefined'),
            primary_use_case,
            data.get('primaryUseCaseType', 'predefined'),
            data.get('customPrimaryUseCase'),
            data.get('accountType'),
            selected_integrations,
            data.get('customIntegration'),
            data.get('demoUseCaseType', 'predefined'),
            data.get('customDemoUseCase'),
            data.get('demoTestingUseCase'),
            api_username,
            api_password,
            status
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

def update_project_details(request_id, project_data):
    """Update project details for a customer request"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE free_trial_requests 
            SET dashboards_requested = ?, dashboards_delivered = ?,
                use_cases_list = ?, integrations_list = ?, 
                ld_session_dates = ?, project_info = ?,
                customer_feedback = ?, next_steps = ?,
                admin_note = ?, intern_note = ?,
                api_username = ?, api_password = ?, api_key = ?, api_endpoint = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            project_data.get('dashboards_requested', 0),
            project_data.get('dashboards_delivered', 0),
            json.dumps(project_data.get('use_cases_list', [])),
            json.dumps(project_data.get('integrations_list', [])),
            json.dumps(project_data.get('ld_session_dates', [])),
            json.dumps(project_data.get('project_info', {})),
            project_data.get('customer_feedback', ''),
            project_data.get('next_steps', ''),
            project_data.get('admin_note', ''),
            project_data.get('intern_note', ''),
            project_data.get('api_username', ''),
            project_data.get('api_password', ''),
            project_data.get('api_key', ''),
            project_data.get('api_endpoint', ''),
            request_id
        ))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_project_details: {str(e)}")
        raise Exception("Database error occurred while updating project details")
    finally:
        conn.close()

def update_intern_note(request_id, intern_note):
    """Update intern note for a customer request"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE free_trial_requests 
            SET intern_note = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (intern_note, request_id))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_intern_note: {str(e)}")
        raise Exception("Database error occurred while updating intern note")
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
    
    # Convert to dict and parse JSON fields
    result = []
    for request in requests:
        request_dict = dict(request)
        
        # Parse JSON fields
        try:
            if request_dict.get('selected_integrations'):
                request_dict['selected_integrations'] = json.loads(request_dict['selected_integrations'])
            if request_dict.get('use_cases_list'):
                request_dict['use_cases_list'] = json.loads(request_dict['use_cases_list'])
            if request_dict.get('integrations_list'):
                request_dict['integrations_list'] = json.loads(request_dict['integrations_list'])
            if request_dict.get('ld_session_dates'):
                request_dict['ld_session_dates'] = json.loads(request_dict['ld_session_dates'])
            if request_dict.get('project_info'):
                request_dict['project_info'] = json.loads(request_dict['project_info'])
        except json.JSONDecodeError:
            # If JSON parsing fails, keep as string
            pass
            
        result.append(request_dict)
    
    return result

def get_requests_for_intern(intern_id):
    """Get all requests assigned to a specific intern"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM free_trial_requests 
        WHERE assigned_intern_id = ?
        ORDER BY created_at DESC
    ''', (intern_id,))
    
    requests = cursor.fetchall()
    conn.close()
    
    # Convert to dict and parse JSON fields
    result = []
    for request in requests:
        request_dict = dict(request)
        
        # Parse JSON fields
        try:
            if request_dict.get('selected_integrations'):
                request_dict['selected_integrations'] = json.loads(request_dict['selected_integrations'])
            if request_dict.get('use_cases_list'):
                request_dict['use_cases_list'] = json.loads(request_dict['use_cases_list'])
            if request_dict.get('integrations_list'):
                request_dict['integrations_list'] = json.loads(request_dict['integrations_list'])
            if request_dict.get('ld_session_dates'):
                request_dict['ld_session_dates'] = json.loads(request_dict['ld_session_dates'])
            if request_dict.get('project_info'):
                request_dict['project_info'] = json.loads(request_dict['project_info'])
        except json.JSONDecodeError:
            # If JSON parsing fails, keep as string
            pass
            
        result.append(request_dict)
    
    return result

def get_all_interns():
    """Get all interns"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM interns ORDER BY created_at DESC')
    
    interns = cursor.fetchall()
    conn.close()
    
    # Convert to dict and parse JSON fields
    result = []
    for intern in interns:
        intern_dict = dict(intern)
        
        # Parse JSON fields
        try:
            if intern_dict.get('integrations'):
                intern_dict['integrations'] = json.loads(intern_dict['integrations'])
        except json.JSONDecodeError:
            # If JSON parsing fails, keep as string
            pass
            
        result.append(intern_dict)
    
    return result

def get_intern_by_credentials(username, password):
    """Get intern by username and password for login"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM interns WHERE username = ? AND password = ?', (username, password))
    
    intern = cursor.fetchone()
    conn.close()
    
    return dict(intern) if intern else None

def get_intern_customer_companies(intern_id):
    """Get list of company names for customers assigned to an intern"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT DISTINCT company 
        FROM free_trial_requests 
        WHERE assigned_intern_id = ?
        ORDER BY company
    ''', (intern_id,))
    
    companies = cursor.fetchall()
    conn.close()
    
    return [company[0] for company in companies]

def create_intern_record(data):
    """Create a new intern"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Prepare integrations data
    integrations = None
    if data.get('integrations'):
        integrations = json.dumps(data.get('integrations'))
    
    cursor.execute('''
        INSERT INTO interns (name, username, password, email, phone, whatsapp, specialization, integrations, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('name'),
        data.get('username'),
        data.get('password'),
        data.get('email'),
        data.get('phone', ''),
        data.get('whatsapp', ''),
        data.get('specialization'),
        integrations,
        data.get('status', 'active')
    ))
    
    intern_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return intern_id

def update_intern_credentials(intern_id, username, password):
    """Update intern credentials in database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE interns 
            SET username = ?, password = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (username, password, intern_id))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_intern_credentials: {str(e)}")
        raise Exception("Database error occurred while updating intern credentials")
    finally:
        conn.close()

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

def update_intern_success_rate(intern_id):
    """Update intern success rate based on completed vs assigned count"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT assigned_count, completed_count FROM interns WHERE id = ?
        ''', (intern_id,))
        
        result = cursor.fetchone()
        if result:
            assigned_count, completed_count = result
            success_rate = (completed_count / assigned_count * 100) if assigned_count > 0 else 0.0
            
            cursor.execute('''
                UPDATE interns 
                SET success_rate = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (success_rate, intern_id))
            
            conn.commit()
            
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_intern_success_rate: {str(e)}")
        raise Exception("Database error occurred while updating success rate")
    finally:
        conn.close()

def update_request_status(request_id, status):
    """Update the status of a free trial request and update intern stats if completed"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get current status and assigned intern
        cursor.execute('''
            SELECT status, assigned_intern_id FROM free_trial_requests WHERE id = ?
        ''', (request_id,))
        result = cursor.fetchone()
        
        if result:
            old_status, intern_id = result
            
            # Update request status
            cursor.execute('''
                UPDATE free_trial_requests 
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (status, request_id))
            
            # If status changed to completed and intern is assigned
            if status == 'completed' and old_status != 'completed' and intern_id:
                cursor.execute('''
                    UPDATE interns 
                    SET completed_count = completed_count + 1, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (intern_id,))
                
                conn.commit()
                # Update success rate after committing the count change
                conn.close()
                update_intern_success_rate(intern_id)
                return
            
            # If status changed from completed to something else
            elif old_status == 'completed' and status != 'completed' and intern_id:
                cursor.execute('''
                    UPDATE interns 
                    SET completed_count = CASE 
                        WHEN completed_count > 0 THEN completed_count - 1 
                        ELSE 0 
                    END, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (intern_id,))
                
                conn.commit()
                # Update success rate after committing the count change
                conn.close()
                update_intern_success_rate(intern_id)
                return
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_request_status: {str(e)}")
        raise Exception("Database error occurred while updating request status")
    finally:
        conn.close()

def create_demo_credentials(data):
    """Create demo credentials with 10-day expiry"""
    import secrets
    import string
    from datetime import datetime, timedelta
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if email already exists
        cursor.execute('SELECT id FROM demo_credentials WHERE email = ? AND is_active = 1', (data.get('email'),))
        existing = cursor.fetchone()
        
        if existing:
            raise ValueError('Demo account already exists for this email')
            
        # Generate random username and password
        username = f"demo_{data.get('firstName', 'user').lower()[:4]}{secrets.randbelow(100):02d}"
        password = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(8))
        
        # Calculate expiry date (10 days from now)
        expires_at = datetime.now() + timedelta(days=10)
        
        # Prepare integrations data
        selected_integrations = None
        if data.get('selectedIntegrations'):
            selected_integrations = json.dumps(data.get('selectedIntegrations'))
        
        cursor.execute('''
            INSERT INTO demo_credentials (
                email, username, password, first_name, last_name, company, phone,
                industry_domain, selected_integrations, expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('email'),
            username,
            password,
            data.get('firstName'),
            data.get('lastName'),
            data.get('company'),
            data.get('phone'),
            data.get('industryDomain'),
            selected_integrations,
            expires_at
        ))
        
        demo_id = cursor.lastrowid
        conn.commit()
        
        return {
            'id': demo_id,
            'username': username,
            'password': password,
            'expires_at': expires_at.isoformat()
        }
        
    except ValueError as ve:
        conn.rollback()
        raise ve
    except Exception as e:
        conn.rollback()
        print(f"Database error in create_demo_credentials: {str(e)}")
        raise Exception("Database error occurred while creating demo credentials")
    finally:
        conn.close()

def get_companies_assigned_to_interns():
    """Get list of company names that are assigned to any intern"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT DISTINCT company 
        FROM free_trial_requests 
        WHERE assigned_intern_id IS NOT NULL
        ORDER BY company
    ''')
    
    companies = cursor.fetchall()
    conn.close()
    
    return [company[0] for company in companies]

def get_all_companies():
    """Get all company names from free trial requests and demo credentials"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT DISTINCT company FROM free_trial_requests
        UNION
        SELECT DISTINCT company FROM demo_credentials
        ORDER BY company
    ''')
    
    companies = cursor.fetchall()
    conn.close()
    
    return [company[0] for company in companies]

def update_dashboard_counts(request_id, dashboards_requested, dashboards_delivered):
    """Update dashboard requested and delivered counts for a request"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE free_trial_requests 
            SET dashboards_requested = ?, dashboards_delivered = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (dashboards_requested, dashboards_delivered, request_id))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_dashboard_counts: {str(e)}")
        raise Exception("Database error occurred while updating dashboard counts")
    finally:
        conn.close()

def delete_customer_record(customer_id):
    """Delete a customer record"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM free_trial_requests WHERE id = ?', (customer_id,))
        
        if cursor.rowcount == 0:
            raise Exception("Customer record not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in delete_customer_record: {str(e)}")
        raise Exception("Database error occurred while deleting customer record")
    finally:
        conn.close()

def delete_intern_record(intern_id):
    """Delete an intern record"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        # First, unassign this intern from any requests
        cursor.execute('''
            UPDATE free_trial_requests 
            SET assigned_intern_id = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE assigned_intern_id = ?
        ''', (intern_id,))
        
        # Then delete the intern record
        cursor.execute('DELETE FROM interns WHERE id = ?', (intern_id,))
        
        if cursor.rowcount == 0:
            raise Exception("Intern record not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in delete_intern_record: {str(e)}")
        raise Exception("Database error occurred while deleting intern record")
    finally:
        conn.close()

def update_customer_basic_info(customer_id, customer_data):
    """Update basic customer information"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE free_trial_requests 
            SET first_name = ?, last_name = ?, email = ?, company = ?, 
                phone = ?, industry_domain = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            customer_data.get('first_name'),
            customer_data.get('last_name'), 
            customer_data.get('email'),
            customer_data.get('company'),
            customer_data.get('phone'),
            customer_data.get('industry_domain'),
            customer_id
        ))
        
        if cursor.rowcount == 0:
            raise Exception("Customer record not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_customer_basic_info: {str(e)}")
        raise Exception("Database error occurred while updating customer basic info")
    finally:
        conn.close()

def update_intern_basic_info(intern_id, intern_data):
    """Update basic intern information"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE interns 
            SET name = ?, email = ?, phone = ?, whatsapp = ?, 
                specialization = ?, integrations = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            intern_data.get('name'),
            intern_data.get('email'),
            intern_data.get('phone'),
            intern_data.get('whatsapp'),
            intern_data.get('specialization'),
            json.dumps(intern_data.get('integrations', [])),
            intern_id
        ))
        
        if cursor.rowcount == 0:
            raise Exception("Intern record not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_intern_basic_info: {str(e)}")
        raise Exception("Database error occurred while updating intern basic info")
    finally:
        conn.close()

def get_all_demo_accounts():
    """Get all demo accounts"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT dc.id, dc.email, dc.username, dc.password, dc.first_name, dc.last_name, 
                   dc.company, dc.phone, dc.industry_domain, dc.selected_integrations, 
                   dc.created_at, dc.expires_at, dc.is_active, dc.assigned_intern_id,
                   dc.admin_note, dc.intern_note, i.name as assigned_intern_name
            FROM demo_credentials dc
            LEFT JOIN interns i ON dc.assigned_intern_id = i.id
            ORDER BY dc.created_at DESC
        ''')
        
        demo_accounts = []
        for row in cursor.fetchall():
            account = dict(row)
            # Parse integrations JSON
            if account['selected_integrations']:
                try:
                    account['selected_integrations'] = json.loads(account['selected_integrations'])
                except:
                    account['selected_integrations'] = []
            else:
                account['selected_integrations'] = []
            demo_accounts.append(account)
        
        return demo_accounts
        
    except Exception as e:
        print(f"Database error in get_all_demo_accounts: {str(e)}")
        raise Exception("Database error occurred while fetching demo accounts")
    finally:
        conn.close()

def delete_demo_account(demo_id):
    """Delete a demo account"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM demo_credentials WHERE id = ?', (demo_id,))
        
        if cursor.rowcount == 0:
            raise Exception("Demo account not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in delete_demo_account: {str(e)}")
        raise Exception("Database error occurred while deleting demo account")
    finally:
        conn.close()

def update_demo_account(demo_id, demo_data):
    """Update demo account information"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        # Prepare integrations data
        selected_integrations = None
        if demo_data.get('selected_integrations'):
            selected_integrations = json.dumps(demo_data.get('selected_integrations'))
        
        cursor.execute('''
            UPDATE demo_credentials 
            SET first_name = ?, last_name = ?, email = ?, company = ?, 
                phone = ?, industry_domain = ?, selected_integrations = ?
            WHERE id = ?
        ''', (
            demo_data.get('first_name'),
            demo_data.get('last_name'), 
            demo_data.get('email'),
            demo_data.get('company'),
            demo_data.get('phone'),
            demo_data.get('industry_domain'),
            selected_integrations,
            demo_id
        ))
        
        if cursor.rowcount == 0:
            raise Exception("Demo account not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_demo_account: {str(e)}")
        raise Exception("Database error occurred while updating demo account")
    finally:
        conn.close()

def regenerate_demo_credentials(demo_id):
    """Regenerate username and password for a demo account"""
    import secrets
    import string
    from datetime import datetime, timedelta
    
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        # Get current demo account info
        cursor.execute('SELECT first_name FROM demo_credentials WHERE id = ?', (demo_id,))
        account = cursor.fetchone()
        
        if not account:
            raise Exception("Demo account not found")
        
        # Generate new credentials
        username = f"demo_{account['first_name'].lower()[:4]}{secrets.randbelow(100):02d}"
        password = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(8))
        
        # Extend expiry by 10 days from now
        new_expires_at = datetime.now() + timedelta(days=10)
        
        cursor.execute('''
            UPDATE demo_credentials 
            SET username = ?, password = ?, expires_at = ?, is_active = 1
            WHERE id = ?
        ''', (username, password, new_expires_at, demo_id))
        
        if cursor.rowcount == 0:
            raise Exception("Demo account not found")
        
        conn.commit()
        
        return {
            'username': username,
            'password': password,
            'expires_at': new_expires_at.isoformat()
        }
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in regenerate_demo_credentials: {str(e)}")
        raise Exception("Database error occurred while regenerating demo credentials")
    finally:
        conn.close()

def assign_intern_to_demo(demo_id, intern_id):
    """Assign an intern to a demo account"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        # Allow None to unassign intern
        cursor.execute('''
            UPDATE demo_credentials 
            SET assigned_intern_id = ?
            WHERE id = ?
        ''', (intern_id, demo_id))
        
        if cursor.rowcount == 0:
            raise Exception("Demo account not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in assign_intern_to_demo: {str(e)}")
        raise Exception("Database error occurred while assigning intern to demo")
    finally:
        conn.close()

def update_demo_admin_note(demo_id, admin_note):
    """Update admin note for a demo account"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE demo_credentials 
            SET admin_note = ?
            WHERE id = ?
        ''', (admin_note, demo_id))
        
        if cursor.rowcount == 0:
            raise Exception("Demo account not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_demo_admin_note: {str(e)}")
        raise Exception("Database error occurred while updating demo admin note")
    finally:
        conn.close()

def update_demo_intern_note(demo_id, intern_note):
    """Update intern note for a demo account"""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE demo_credentials 
            SET intern_note = ?
            WHERE id = ?
        ''', (intern_note, demo_id))
        
        if cursor.rowcount == 0:
            raise Exception("Demo account not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in update_demo_intern_note: {str(e)}")
        raise Exception("Database error occurred while updating demo intern note")
    finally:
        conn.close()

def get_demo_accounts_for_intern(intern_id):
    """Get demo accounts assigned to a specific intern"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT dc.id, dc.email, dc.username, dc.password, dc.first_name, dc.last_name, 
                   dc.company, dc.phone, dc.industry_domain, dc.selected_integrations, 
                   dc.created_at, dc.expires_at, dc.is_active, dc.assigned_intern_id,
                   dc.admin_note, dc.intern_note, i.name as assigned_intern_name
            FROM demo_credentials dc
            LEFT JOIN interns i ON dc.assigned_intern_id = i.id
            WHERE dc.assigned_intern_id = ?
            ORDER BY dc.created_at DESC
        ''', (intern_id,))
        
        demo_accounts = []
        for row in cursor.fetchall():
            account = dict(row)
            # Parse integrations JSON
            if account['selected_integrations']:
                try:
                    account['selected_integrations'] = json.loads(account['selected_integrations'])
                except:
                    account['selected_integrations'] = []
            else:
                account['selected_integrations'] = []
            demo_accounts.append(account)
        
        return demo_accounts
        
    except Exception as e:
        print(f"Database error in get_demo_accounts_for_intern: {str(e)}")
        raise Exception("Database error occurred while fetching intern demo accounts")
    finally:
        conn.close()

def create_notification(recipient_type, recipient_id, title, message, notification_type='info', related_entity_type=None, related_entity_id=None):
    """Create a new notification"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO notifications (
                recipient_type, recipient_id, title, message, type, 
                related_entity_type, related_entity_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            recipient_type, recipient_id, title, message, notification_type,
            related_entity_type, related_entity_id
        ))
        
        notification_id = cursor.lastrowid
        conn.commit()
        
        return notification_id
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in create_notification: {str(e)}")
        raise Exception("Database error occurred while creating notification")
    finally:
        conn.close()

def get_notifications(recipient_type, recipient_id=None, limit=50, unread_only=False):
    """Get notifications for a recipient"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        query = '''
            SELECT id, recipient_type, recipient_id, title, message, type, 
                   read_status, created_at, related_entity_type, related_entity_id
            FROM notifications 
            WHERE recipient_type = ?
        '''
        params = [recipient_type]
        
        if recipient_id is not None:
            query += ' AND recipient_id = ?'
            params.append(recipient_id)
        else:
            query += ' AND recipient_id IS NULL'
            
        if unread_only:
            query += ' AND read_status = 0'
            
        query += ' ORDER BY created_at DESC LIMIT ?'
        params.append(limit)
        
        cursor.execute(query, params)
        
        notifications = []
        for row in cursor.fetchall():
            notifications.append(dict(row))
        
        return notifications
        
    except Exception as e:
        print(f"Database error in get_notifications: {str(e)}")
        raise Exception("Database error occurred while fetching notifications")
    finally:
        conn.close()

def mark_notification_as_read(notification_id):
    """Mark a notification as read"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE notifications 
            SET read_status = 1 
            WHERE id = ?
        ''', (notification_id,))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in mark_notification_as_read: {str(e)}")
        raise Exception("Database error occurred while marking notification as read")
    finally:
        conn.close()

def mark_all_notifications_as_read(recipient_type, recipient_id=None):
    """Mark all notifications as read for a recipient"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        if recipient_id is not None:
            cursor.execute('''
                UPDATE notifications 
                SET read_status = 1 
                WHERE recipient_type = ? AND recipient_id = ?
            ''', (recipient_type, recipient_id))
        else:
            cursor.execute('''
                UPDATE notifications 
                SET read_status = 1 
                WHERE recipient_type = ? AND recipient_id IS NULL
            ''', (recipient_type,))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in mark_all_notifications_as_read: {str(e)}")
        raise Exception("Database error occurred while marking all notifications as read")
    finally:
        conn.close()

def get_unread_notification_count(recipient_type, recipient_id=None):
    """Get count of unread notifications for a recipient"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        if recipient_id is not None:
            cursor.execute('''
                SELECT COUNT(*) FROM notifications 
                WHERE recipient_type = ? AND recipient_id = ? AND read_status = 0
            ''', (recipient_type, recipient_id))
        else:
            cursor.execute('''
                SELECT COUNT(*) FROM notifications 
                WHERE recipient_type = ? AND recipient_id IS NULL AND read_status = 0
            ''', (recipient_type,))
        
        count = cursor.fetchone()[0]
        return count
        
    except Exception as e:
        print(f"Database error in get_unread_notification_count: {str(e)}")
        raise Exception("Database error occurred while getting unread notification count")
    finally:
        conn.close()

def delete_notification(notification_id):
    """Delete a notification"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM notifications WHERE id = ?', (notification_id,))
        
        if cursor.rowcount == 0:
            raise Exception("Notification not found")
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        print(f"Database error in delete_notification: {str(e)}")
        raise Exception("Database error occurred while deleting notification")
    finally:
        conn.close()

# Note: Call init_database() explicitly when needed, not on module import
