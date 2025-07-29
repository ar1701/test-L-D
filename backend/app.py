from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from database import (
    create_free_trial_request, 
    get_all_free_trial_requests,
    get_all_interns,
    create_intern_record,
    assign_intern_to_request,
    update_request_status
)

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'

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
    """Handle user login"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # No mock users - real authentication required
    # In a real application, you would validate against a database
    return jsonify({
        'success': False, 
        'message': 'Invalid credentials. Please register first if you don\'t have an account.'
    }), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Handle user registration"""
    data = request.get_json()
    
    # Get form data
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    company = data.get('company')
    phone = data.get('phone')
    account_type = data.get('accountType', 'ld')
    
    # Basic validation
    if not all([first_name, last_name, email, company, phone]):
        return jsonify({
            'success': False,
            'message': 'All fields are required'
        }), 400
    
    # For L&D account type, save as free trial request
    if account_type == 'ld':
        try:
            request_id = create_free_trial_request(data)
            return jsonify({
                'success': True,
                'message': 'Free trial request submitted successfully! An admin will review and assign an intern to assist you.',
                'request_id': request_id
            })
        except ValueError as ve:
            # Handle email uniqueness error
            return jsonify({
                'success': False,
                'message': str(ve)
            }), 400
        except Exception as e:
            print(f"Database error: {str(e)}")  # Log the actual error
            return jsonify({
                'success': False,
                'message': 'Error saving request. Please try again.'
            }), 500
    
    # For demo accounts, just return success (existing behavior)
    return jsonify({
        'success': True,
        'message': 'Registration successful! Please login with your credentials.',
    })

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
    """Get all interns for admin"""
    try:
        interns = get_all_interns()
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
        return jsonify({
            'success': True,
            'message': 'Status updated successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating status: {str(e)}'
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
