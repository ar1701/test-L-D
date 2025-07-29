#!/usr/bin/env python3
"""
Script to test the registration endpoint
"""
import requests
import json

# Test data
test_request = {
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "company": "Test Company",
    "phone": "+1234567890",
    "industryDomain": "Technology",
    "smartcardUsage": "Access Control",
    "primaryUseCase": "Employee ID cards",
    "accountType": "ld"
}

def test_registration():
    """Test the registration endpoint"""
    url = "http://localhost:5000/api/auth/register"
    
    try:
        response = requests.post(url, json=test_request, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
        else:
            print("❌ Registration failed!")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_duplicate_registration():
    """Test duplicate email registration"""
    url = "http://localhost:5000/api/auth/register" 
    
    try:
        response = requests.post(url, json=test_request, timeout=10)
        print(f"\nDuplicate test - Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 400:
            print("✅ Duplicate email properly rejected!")
        else:
            print("❌ Duplicate email not properly handled!")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("Testing registration endpoint...")
    test_registration()
    test_duplicate_registration()
