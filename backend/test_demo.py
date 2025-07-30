#!/usr/bin/env python3

import requests
import json

def test_demo_registration():
    """Test the demo registration functionality"""
    
    # Test data
    test_data = {
        "firstName": "John",
        "lastName": "Doe", 
        "email": "test@example.com",
        "company": "Test Corp",
        "phone": "1234567890",
        "accountType": "demo"
    }
    
    try:
        # Make the API call
        response = requests.post(
            "http://localhost:5000/api/auth/register",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_data)
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ Demo registration successful!")
                print(f"Username: {result.get('username')}")
                print(f"Password: {result.get('password')}")
            else:
                print("❌ Demo registration failed")
                print(f"Error: {result.get('message')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the backend is running on port 5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_demo_registration() 