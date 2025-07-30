from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from database import (
    init_database,
    create_free_trial_request, 
    get_all_free_trial_requests, 
    get_all_interns, 
    create_intern_record, 
    assign_intern_to_request, 
    update_request_status,
    update_project_details,
    get_intern_by_credentials,
    update_intern_credentials,
    get_requests_for_intern,
    update_intern_note,
    get_intern_customer_companies,
    get_db_connection,
    create_demo_credentials,
    get_companies_assigned_to_interns,
    get_all_companies,
    update_dashboard_counts,
    delete_customer_record,
    delete_intern_record,
    update_customer_basic_info,
    update_intern_basic_info,
    get_all_demo_accounts,
    delete_demo_account,
    update_demo_account,
    regenerate_demo_credentials,
    assign_intern_to_demo,
    update_demo_admin_note,
    update_demo_intern_note,
    get_demo_accounts_for_intern,
    create_notification,
    get_notifications,
    mark_notification_as_read,
    mark_all_notifications_as_read,
    get_unread_notification_count,
    delete_notification
)

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database tables
init_database()

# Routes for serving the frontend
@app.route('/user-portal')
@app.route('/user-portal/<path:path>')
def user_portal(path=''):
    """Serve the user portal (LD SaaS Platform)"""
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'dist')
    if path and os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    return send_from_directory(frontend_dir, 'index.html')

@app.route('/admin-portal')
@app.route('/admin-portal/<path:path>')
def admin_portal(path=''):
    """Serve the admin portal"""
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'dist')
    if path and os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    return send_from_directory(frontend_dir, 'index.html')

# API Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    """Handle user login - supports both admin and intern login"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Check for admin login (hardcoded for now)
    if username == 'admin' and password == 'admin123':
        return jsonify({
            'success': True,
            'user': {
                'id': 1,
                'name': 'Admin User',
                'role': 'admin',
                'username': username
            }
        })
    
    # Check for intern login
    intern = get_intern_by_credentials(username, password)
    if intern:
        return jsonify({
            'success': True,
            'user': {
                'id': intern['id'],
                'name': intern['name'],
                'role': 'intern',
                'username': intern['username'],
                'email': intern['email'],
                'phone': intern['phone'],
                'whatsapp': intern['whatsapp'],
                'specialization': intern['specialization']
            }
        })
    
    return jsonify({
        'success': False,
        'message': 'Invalid credentials'
    }), 401

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user or create demo credentials"""
    data = request.get_json()
    
    # Basic validation
    if not data.get('firstName') or not data.get('lastName') or not data.get('email'):
        return jsonify({
            'success': False,
            'message': 'First name, last name, and email are required'
        }), 400
    
    try:
        # Check account type
        account_type = data.get('accountType', 'ld')
        
        if account_type == 'demo':
            # Create demo credentials with 10-day expiry
            demo_result = create_demo_credentials(data)
            
            return jsonify({
                'success': True,
                'message': 'Demo account created successfully',
                'demo': True,
                'username': demo_result['username'],
                'password': demo_result['password'],
                'expires_at': demo_result['expires_at']
            })
        else:
            # Create regular L&D request
            request_id = create_free_trial_request(data)
            
            return jsonify({
                'success': True,
                'message': 'Free trial request submitted successfully! An admin will review your request and assign an intern specialist to assist you.',
                'request_id': request_id,
                'demo': False
            })
            
    except ValueError as ve:
        return jsonify({
            'success': False,
            'message': str(ve)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Handle user logout"""
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """Get user profile"""
    # TODO: Implement user profile retrieval from database
    return jsonify({
        'success': False,
        'message': 'User profile endpoint not implemented'
    }), 501

@app.route('/api/user/dashboard', methods=['GET'])
def get_user_dashboard():
    """Get user dashboard data"""
    # TODO: Implement user dashboard data retrieval from database
    return jsonify({
        'success': False,
        'message': 'User dashboard endpoint not implemented'
    }), 501

@app.route('/api/admin/dashboard', methods=['GET'])
def get_admin_dashboard():
    """Get admin dashboard data"""
    # TODO: Implement admin dashboard data retrieval from database
    return jsonify({
        'success': False,
        'message': 'Admin dashboard endpoint not implemented'
    }), 501

@app.route('/api/admin/interns', methods=['GET'])
def get_admin_interns():
    """Get all interns for admin with their customer companies"""
    try:
        interns = get_all_interns()
        
        # Add customer companies for each intern
        for intern in interns:
            intern['customer_companies'] = get_intern_customer_companies(intern['id'])
        
        return jsonify({
            'success': True,
            'data': interns
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching interns: {str(e)}'
        }), 500

@app.route('/api/admin/interns', methods=['POST'])
def create_intern():
    """Create a new intern"""
    data = request.get_json()
    
    # Basic validation
    if not data.get('name') or not data.get('email'):
        return jsonify({
            'success': False,
            'message': 'Name and email are required'
        }), 400
    
    try:
        intern_id = create_intern_record(data)
        return jsonify({
            'success': True,
            'message': 'Intern created successfully',
            'intern_id': intern_id
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error creating intern: {str(e)}'
        }), 500

@app.route('/api/admin/customers', methods=['GET'])
def get_admin_customers():
    """Get all customers for admin - returns free trial requests"""
    try:
        requests = get_all_free_trial_requests()
        return jsonify({
            'success': True,
            'data': requests
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching trial requests: {str(e)}'
        }), 500

@app.route('/api/admin/customers', methods=['POST'])
def create_customer():
    """Create a new customer record manually"""
    data = request.get_json()
    
    # Basic validation
    required_fields = ['first_name', 'last_name', 'email', 'company']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required'
            }), 400
    
    try:
        # Create free trial request record
        request_id = create_free_trial_request(
            data['first_name'],
            data['last_name'],
            data['email'],
            data['company'],
            data.get('phone', ''),
            data.get('industry_domain', ''),
            data.get('request_type', 'L&D')
        )
        
        return jsonify({
            'success': True,
            'message': 'Customer record created successfully',
            'data': {'id': request_id}
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error creating customer: {str(e)}'
        }), 500

@app.route('/api/admin/requests/<int:request_id>/assign', methods=['POST'])
def assign_intern_to_trial_request(request_id):
    """Assign an intern to a free trial request (supports reassignment and unassignment)"""
    data = request.get_json()
    intern_id = data.get('intern_id')
    
    # Allow empty string or None for unassignment
    if intern_id == "":
        intern_id = None
    
    try:
        assign_intern_to_request(request_id, intern_id)
        
        # Create notifications
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get customer details
        cursor.execute('SELECT first_name, last_name, company FROM free_trial_requests WHERE id = ?', (request_id,))
        customer = cursor.fetchone()
        
        if intern_id and customer:
            # Get intern name
            cursor.execute('SELECT name FROM interns WHERE id = ?', (intern_id,))
            intern = cursor.fetchone()
            
            if intern:
                # Notify admin
                create_notification(
                    'admin', None,
                    'Intern Assigned',
                    f'{intern["name"]} has been assigned to {customer["first_name"]} {customer["last_name"]} from {customer["company"]}',
                    'success', 'assignment', request_id
                )
                
                # Notify intern
                create_notification(
                    'intern', intern_id,
                    'New Assignment',
                    f'You have been assigned to {customer["first_name"]} {customer["last_name"]} from {customer["company"]}',
                    'info', 'assignment', request_id
                )
        elif customer:
            # Unassignment notification
            create_notification(
                'admin', None,
                'Intern Unassigned',
                f'Intern has been unassigned from {customer["first_name"]} {customer["last_name"]} from {customer["company"]}',
                'warning', 'unassignment', request_id
            )
        
        conn.close()
        
        if intern_id:
            message = 'Intern assigned successfully'
        else:
            message = 'Intern unassigned successfully'
        
        return jsonify({
            'success': True,
            'message': message
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error assigning intern: {str(e)}'
        }), 500

@app.route('/api/admin/requests/<int:request_id>/status', methods=['PUT'])
def update_trial_request_status(request_id):
    """Update the status of a trial request"""
    data = request.get_json()
    status = data.get('status')
    
    if not status:
        return jsonify({
            'success': False,
            'message': 'Status is required'
        }), 400
    
    try:
        update_request_status(request_id, status)
        
        # Create notifications
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get customer and intern details
        cursor.execute('''
            SELECT first_name, last_name, company, assigned_intern_id 
            FROM free_trial_requests WHERE id = ?
        ''', (request_id,))
        customer = cursor.fetchone()
        
        if customer:
            # Notify admin
            create_notification(
                'admin', None,
                'Status Updated',
                f'Status for {customer["first_name"]} {customer["last_name"]} from {customer["company"]} changed to {status}',
                'info', 'status_change', request_id
            )
            
            # Notify assigned intern if any
            if customer['assigned_intern_id']:
                create_notification(
                    'intern', customer['assigned_intern_id'],
                    'Status Updated',
                    f'Status for {customer["first_name"]} {customer["last_name"]} from {customer["company"]} changed to {status}',
                    'info', 'status_change', request_id
                )
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Status updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating status: {str(e)}'
        }), 500

@app.route('/api/admin/requests/<int:request_id>/project', methods=['PUT'])
def update_trial_request_project(request_id):
    """Update project details for a trial request"""
    data = request.get_json()
    
    try:
        update_project_details(request_id, data)
        return jsonify({
            'success': True,
            'message': 'Project details updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating project details: {str(e)}'
        }), 500

@app.route('/api/admin/users', methods=['GET'])
def get_admin_users():
    """Get all users for admin - kept for backward compatibility"""
    # TODO: Implement user data retrieval from database
    return jsonify({
        'success': False,
        'message': 'Admin users endpoint not implemented'
    }), 501

@app.route('/api/admin/integrations', methods=['GET'])
def get_integrations():
    """Get all available integration types"""
    # TODO: Implement integration types retrieval from database
    return jsonify({
        'success': False,
        'message': 'Integrations endpoint not implemented'
    }), 501

@app.route('/api/admin/integrations', methods=['POST'])
def create_integration():
    """Add a new integration type"""
    data = request.get_json()
    
    # Basic validation
    if not data.get('value') or not data.get('label'):
        return jsonify({
            'success': False,
            'message': 'Value and label are required'
        }), 400
    
    # TODO: Implement database save functionality
    return jsonify({
        'success': False,
        'message': 'Create integration endpoint not implemented'
    }), 501

@app.route('/api/admin/domains', methods=['GET'])
def get_domains():
    """Get all available domain types"""
    # TODO: Implement domain types retrieval from database
    return jsonify({
        'success': False,
        'message': 'Domains endpoint not implemented'
    }), 501

@app.route('/api/admin/domains', methods=['POST'])
def create_domain():
    """Add a new domain type"""
    data = request.get_json()
    
    # Basic validation
    if not data.get('value') or not data.get('label'):
        return jsonify({
            'success': False,
            'message': 'Value and label are required'
        }), 400
    
    # TODO: Implement database save functionality
    return jsonify({
        'success': False,
        'message': 'Create domain endpoint not implemented'
    }), 501

@app.route('/api/admin/interns/<intern_id>/regenerate', methods=['POST'])
def regenerate_intern_credentials(intern_id):
    """Regenerate credentials for an intern"""
    # Basic validation
    if not intern_id:
        return jsonify({
            'success': False,
            'message': 'Intern ID is required'
        }), 400
    
    # TODO: Implement credential regeneration with database update
    return jsonify({
        'success': False,
        'message': 'Regenerate credentials endpoint not implemented'
    }), 501

@app.route('/api/admin/interns/<int:intern_id>/credentials', methods=['PUT'])
def update_intern_credentials_api(intern_id):
    """Update intern credentials"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Username and password are required'
        }), 400
    
    try:
        update_intern_credentials(intern_id, username, password)
        return jsonify({
            'success': True,
            'message': 'Credentials updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating credentials: {str(e)}'
        }), 500

@app.route('/api/intern/requests', methods=['GET'])
def get_intern_requests():
    """Get requests assigned to the current intern"""
    # In a real app, you'd get intern_id from JWT token or session
    intern_id = request.args.get('intern_id')
    
    if not intern_id:
        return jsonify({
            'success': False,
            'message': 'Intern ID is required'
        }), 400
    
    try:
        requests = get_requests_for_intern(intern_id)
        return jsonify({
            'success': True,
            'data': requests
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching requests: {str(e)}'
        }), 500

@app.route('/api/intern/requests/<int:request_id>/note', methods=['PUT'])
def update_intern_note_api(request_id):
    """Update intern note for a request"""
    data = request.get_json()
    intern_note = data.get('intern_note', '')
    
    try:
        update_intern_note(request_id, intern_note)
        return jsonify({
            'success': True,
            'message': 'Note updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating note: {str(e)}'
        }), 500

@app.route('/api/intern/demos', methods=['GET'])
def get_intern_demo_accounts():
    """Get demo accounts assigned to the current intern"""
    intern_id = request.args.get('intern_id')
    
    if not intern_id:
        return jsonify({
            'success': False,
            'message': 'Intern ID is required'
        }), 400
    
    try:
        demo_accounts = get_demo_accounts_for_intern(intern_id)
        return jsonify({
            'success': True,
            'data': demo_accounts
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching demo accounts: {str(e)}'
        }), 500

@app.route('/api/intern/demos/<int:demo_id>/note', methods=['PUT'])
def update_intern_demo_note_api(demo_id):
    """Update intern note for a demo account (with access control)"""
    data = request.get_json()
    intern_note = data.get('intern_note', '')
    intern_id = data.get('intern_id')  # Pass intern_id to verify access
    
    if not intern_id:
        return jsonify({
            'success': False,
            'message': 'Intern ID is required for access control'
        }), 400
    
    try:
        # First verify that this intern is assigned to this demo account
        demo_accounts = get_demo_accounts_for_intern(intern_id)
        demo_account = next((demo for demo in demo_accounts if demo['id'] == demo_id), None)
        
        if not demo_account:
            return jsonify({
                'success': False,
                'message': 'Access denied: You are not assigned to this demo account'
            }), 403
            
        update_demo_intern_note(demo_id, intern_note)
        
        # Create notifications
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get intern and demo account details
        cursor.execute('SELECT name FROM interns WHERE id = ?', (intern_id,))
        intern = cursor.fetchone()
        
        cursor.execute('SELECT first_name, last_name, company FROM demo_credentials WHERE id = ?', (demo_id,))
        demo_details = cursor.fetchone()
        
        if intern and demo_details:
            # Notify admin about intern note update
            create_notification(
                'admin', None,
                'Demo Account Note Updated',
                f'{intern["name"]} updated their note for demo account: {demo_details["first_name"]} {demo_details["last_name"]} from {demo_details["company"]}',
                'info', 'demo_note_update', demo_id
            )
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Demo note updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating demo note: {str(e)}'
        }), 500

@app.route('/api/admin/companies', methods=['GET'])
def get_assigned_companies():
    """Get list of companies assigned to interns"""
    try:
        companies = get_companies_assigned_to_interns()
        return jsonify({
            'success': True,
            'data': companies
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching companies: {str(e)}'
        }), 500

@app.route('/api/admin/all-companies', methods=['GET'])
def get_all_companies_endpoint():
    """Get list of all companies in database"""
    try:
        companies = get_all_companies()
        return jsonify({
            'success': True,
            'data': companies
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching companies: {str(e)}'
        }), 500

@app.route('/api/admin/customers/<int:request_id>/dashboards', methods=['PUT'])
def update_customer_dashboards(request_id):
    """Update dashboard counts for a customer request"""
    data = request.get_json()
    
    try:
        dashboards_requested = int(data.get('dashboards_requested', 0))
        dashboards_delivered = int(data.get('dashboards_delivered', 0))
        
        update_dashboard_counts(request_id, dashboards_requested, dashboards_delivered)
        
        return jsonify({
            'success': True,
            'message': 'Dashboard counts updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating dashboard counts: {str(e)}'
        }), 500

# Delete customer record
@app.route('/api/admin/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete a customer record"""
    try:
        delete_customer_record(customer_id)
        return jsonify({
            'success': True,
            'message': 'Customer record deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting customer record: {str(e)}'
        }), 500

# Update customer basic info
@app.route('/api/admin/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update customer basic information"""
    data = request.get_json()
    
    # Basic validation
    required_fields = ['first_name', 'last_name', 'email', 'company']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required'
            }), 400
    
    try:
        update_customer_basic_info(customer_id, data)
        return jsonify({
            'success': True,
            'message': 'Customer record updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating customer record: {str(e)}'
        }), 500

# Delete intern record
@app.route('/api/admin/interns/<int:intern_id>', methods=['DELETE'])
def delete_intern(intern_id):
    """Delete an intern record"""
    try:
        delete_intern_record(intern_id)
        return jsonify({
            'success': True,
            'message': 'Intern record deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting intern record: {str(e)}'
        }), 500

# Update intern basic info
@app.route('/api/admin/interns/<int:intern_id>', methods=['PUT'])
def update_intern(intern_id):
    """Update intern basic information"""
    data = request.get_json()
    
    # Basic validation
    required_fields = ['name', 'email']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required'
            }), 400
    
    try:
        update_intern_basic_info(intern_id, data)
        return jsonify({
            'success': True,
            'message': 'Intern record updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating intern record: {str(e)}'
        }), 500

# Demo Accounts Management
@app.route('/api/admin/demos', methods=['GET'])
def get_demo_accounts():
    """Get all demo accounts"""
    try:
        demo_accounts = get_all_demo_accounts()
        return jsonify({
            'success': True,
            'data': demo_accounts
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching demo accounts: {str(e)}'
        }), 500

@app.route('/api/admin/demos/<int:demo_id>', methods=['DELETE'])
def delete_demo_account_endpoint(demo_id):
    """Delete a demo account"""
    try:
        delete_demo_account(demo_id)
        return jsonify({
            'success': True,
            'message': 'Demo account deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting demo account: {str(e)}'
        }), 500

@app.route('/api/admin/demos/<int:demo_id>', methods=['PUT'])
def update_demo_account_endpoint(demo_id):
    """Update demo account information"""
    data = request.get_json()
    
    # Basic validation
    required_fields = ['first_name', 'last_name', 'email', 'company']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required'
            }), 400
    
    try:
        update_demo_account(demo_id, data)
        return jsonify({
            'success': True,
            'message': 'Demo account updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating demo account: {str(e)}'
        }), 500

@app.route('/api/admin/demos/<int:demo_id>/regenerate-credentials', methods=['POST'])
def regenerate_demo_credentials_endpoint(demo_id):
    """Regenerate credentials for a demo account"""
    try:
        result = regenerate_demo_credentials(demo_id)
        return jsonify({
            'success': True,
            'message': 'Demo credentials regenerated successfully',
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error regenerating demo credentials: {str(e)}'
        }), 500

@app.route('/api/admin/demos/<int:demo_id>/assign-intern', methods=['POST'])
def assign_intern_to_demo_endpoint(demo_id):
    """Assign an intern to a demo account"""
    data = request.get_json()
    intern_id = data.get('intern_id')
    
    # Allow empty string or None for unassignment
    if intern_id == "":
        intern_id = None
    
    try:
        assign_intern_to_demo(demo_id, intern_id)
        
        # Create notifications
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get demo account details
        cursor.execute('SELECT first_name, last_name, company FROM demo_credentials WHERE id = ?', (demo_id,))
        demo_account = cursor.fetchone()
        
        if intern_id and demo_account:
            # Get intern name
            cursor.execute('SELECT name FROM interns WHERE id = ?', (intern_id,))
            intern = cursor.fetchone()
            
            if intern:
                # Notify admin
                create_notification(
                    'admin', None,
                    'Intern Assigned to Demo',
                    f'{intern["name"]} has been assigned to demo account for {demo_account["first_name"]} {demo_account["last_name"]} from {demo_account["company"]}',
                    'success', 'demo_assignment', demo_id
                )
                
                # Notify intern
                create_notification(
                    'intern', intern_id,
                    'New Demo Assignment',
                    f'You have been assigned to demo account for {demo_account["first_name"]} {demo_account["last_name"]} from {demo_account["company"]}',
                    'info', 'demo_assignment', demo_id
                )
        elif demo_account:
            # Unassignment notification
            create_notification(
                'admin', None,
                'Intern Unassigned from Demo',
                f'Intern has been unassigned from demo account for {demo_account["first_name"]} {demo_account["last_name"]} from {demo_account["company"]}',
                'info', 'demo_unassignment', demo_id
            )
        
        conn.close()
        
        if intern_id:
            message = 'Intern assigned to demo account successfully'
        else:
            message = 'Intern unassigned from demo account successfully'
            
        return jsonify({
            'success': True,
            'message': message
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error assigning intern to demo: {str(e)}'
        }), 500

@app.route('/api/admin/demos/<int:demo_id>/admin-note', methods=['PUT'])
def update_demo_admin_note_endpoint(demo_id):
    """Update admin note for a demo account"""
    data = request.get_json()
    admin_note = data.get('admin_note', '')
    
    try:
        update_demo_admin_note(demo_id, admin_note)
        
        # Create notifications
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get demo account details and assigned intern
        cursor.execute('''
            SELECT dc.first_name, dc.last_name, dc.company, dc.assigned_intern_id, i.name as intern_name
            FROM demo_credentials dc
            LEFT JOIN interns i ON dc.assigned_intern_id = i.id
            WHERE dc.id = ?
        ''', (demo_id,))
        demo_details = cursor.fetchone()
        
        if demo_details:
            if demo_details['assigned_intern_id']:
                # Notify assigned intern about admin note update
                create_notification(
                    'intern', demo_details['assigned_intern_id'],
                    'Admin Note Added to Demo',
                    f'Admin added a note to demo account: {demo_details["first_name"]} {demo_details["last_name"]} from {demo_details["company"]}',
                    'info', 'demo_admin_note', demo_id
                )
            
            # Also notify admin (for activity tracking)
            create_notification(
                'admin', None,
                'Demo Admin Note Updated',
                f'Admin note updated for demo account: {demo_details["first_name"]} {demo_details["last_name"]} from {demo_details["company"]}',
                'success', 'demo_admin_note', demo_id
            )
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Demo admin note updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating demo admin note: {str(e)}'
        }), 500

@app.route('/api/admin/demos/<int:demo_id>/intern-note', methods=['PUT'])
def update_demo_intern_note_endpoint(demo_id):
    """Update intern note for a demo account"""
    data = request.get_json()
    intern_note = data.get('intern_note', '')
    
    try:
        update_demo_intern_note(demo_id, intern_note)
        return jsonify({
            'success': True,
            'message': 'Demo intern note updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating demo intern note: {str(e)}'
        }), 500

# Notifications Management
@app.route('/api/notifications/<recipient_type>', methods=['GET'])
def get_notifications_endpoint(recipient_type):
    """Get notifications for a recipient type (admin/intern)"""
    recipient_id = request.args.get('recipient_id', type=int)
    limit = request.args.get('limit', 50, type=int)
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    
    if recipient_type not in ['admin', 'intern']:
        return jsonify({
            'success': False,
            'message': 'Invalid recipient type'
        }), 400
    
    try:
        notifications = get_notifications(recipient_type, recipient_id, limit, unread_only)
        return jsonify({
            'success': True,
            'data': notifications
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching notifications: {str(e)}'
        }), 500

@app.route('/api/notifications/<recipient_type>/unread-count', methods=['GET'])
def get_unread_notification_count_endpoint(recipient_type):
    """Get unread notification count for a recipient"""
    recipient_id = request.args.get('recipient_id', type=int)
    
    if recipient_type not in ['admin', 'intern']:
        return jsonify({
            'success': False,
            'message': 'Invalid recipient type'
        }), 400
    
    try:
        count = get_unread_notification_count(recipient_type, recipient_id)
        return jsonify({
            'success': True,
            'data': {'count': count}
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error getting unread count: {str(e)}'
        }), 500

@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read_endpoint(notification_id):
    """Mark a notification as read"""
    try:
        mark_notification_as_read(notification_id)
        return jsonify({
            'success': True,
            'message': 'Notification marked as read'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error marking notification as read: {str(e)}'
        }), 500

@app.route('/api/notifications/<recipient_type>/mark-all-read', methods=['PUT'])
def mark_all_notifications_read_endpoint(recipient_type):
    """Mark all notifications as read for a recipient"""
    recipient_id = request.args.get('recipient_id', type=int)
    
    if recipient_type not in ['admin', 'intern']:
        return jsonify({
            'success': False,
            'message': 'Invalid recipient type'
        }), 400
    
    try:
        mark_all_notifications_as_read(recipient_type, recipient_id)
        return jsonify({
            'success': True,
            'message': 'All notifications marked as read'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error marking notifications as read: {str(e)}'
        }), 500

@app.route('/api/notifications/<int:notification_id>', methods=['DELETE'])
def delete_notification_endpoint(notification_id):
    """Delete a notification"""
    try:
        delete_notification(notification_id)
        return jsonify({
            'success': True,
            'message': 'Notification deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting notification: {str(e)}'
        }), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'SmartCard AI API is running'})

# Default route to serve frontend
@app.route('/')
def index():
    """Redirect to user portal by default"""
    return user_portal()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
