from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import string
from database import create_free_trial_request, init_database

app = Flask(__name__)
CORS(app)

# Initialize database
init_database()

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
    
    # For demo accounts, create demo account with generated credentials
    if account_type == 'demo':
        try:
            # Generate random username and password
            def generate_username(first_name, last_name):
                """Generate a unique username based on name"""
                base = f"{first_name[:4].lower()}{last_name[:4].lower()}"
                # Add random suffix to ensure uniqueness
                suffix = ''.join(random.choices(string.digits, k=4))
                return f"demo_{base}{suffix}"

            def generate_password():
                """Generate a random password"""
                return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))

            username = generate_username(first_name, last_name)
            password = generate_password()

            # Create demo account data, now including all fields from the form
            demo_data = {
                **data, # Include all original form data
                'api_username': username,
                'api_password': password,
                'status': 'demo_active'
            }

            # Save to database
            # The create_free_trial_request function already handles email uniqueness
            request_id = create_free_trial_request(demo_data)

            return jsonify({
                'success': True,
                'message': 'Demo account created successfully!',
                'username': username,
                'password': password,
                'request_id': request_id
            })

        except ValueError as ve:
            # This will catch the email uniqueness error from create_free_trial_request
            return jsonify({
                'success': False,
                'message': str(ve)
            }), 400
        except Exception as e:
            print(f"Database error on demo creation: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Error creating demo account. Please try again.'
            }), 500
    
    # For L&D accounts
    try:
        request_id = create_free_trial_request(data)
        return jsonify({
            'success': True,
            'message': 'Free trial request submitted successfully! An admin will review and assign an intern to assist you.',
            'request_id': request_id
        })
    except ValueError as ve:
        return jsonify({
            'success': False,
            'message': str(ve)
        }), 400
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error saving request. Please try again.'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Test API is running'})

if __name__ == '__main__':
    print("Starting test Flask server...")
    app.run(debug=True, host='127.0.0.1', port=5000) 