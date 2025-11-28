#!/usr/bin/env python3
"""
Backend API Testing for QuantPayChain (Render Deployment)
Testing the specific endpoints mentioned in the review request
"""

import requests
import json
import sys
from datetime import datetime

# Base URL for the deployed API
BASE_URL = "https://quantpaychain-api.onrender.com"

def test_health_check():
    """Test GET / - should return 200 with status 'operational'"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if data.get("status") == "operational":
                    print("✅ Health check PASSED - Status is 'operational'")
                    print(f"✅ Service: {data.get('service')}")
                    print(f"✅ Version: {data.get('version')}")
                    return True
                else:
                    print(f"❌ Health check FAILED - Expected status 'operational', got: {data.get('status')}")
                    return False
            except json.JSONDecodeError:
                print(f"❌ Health check FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ Health check FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check FAILED - Request error: {e}")
        return False

def test_ai_services_status():
    """Test GET /api/test/ai-status - verify AI services show ai_powered: true"""
    print("\n=== Testing AI Services Status ===")
    try:
        response = requests.get(f"{BASE_URL}/api/test/ai-status", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Parsed JSON: {json.dumps(data, indent=2)}")
                
                # Check if both services show ai_powered: true
                success = True
                if "advisor" in data:
                    if data["advisor"].get("ai_powered") != True:
                        print(f"❌ Advisor service ai_powered is not true: {data['advisor'].get('ai_powered')}")
                        success = False
                    else:
                        print(f"✅ Advisor service ai_powered: {data['advisor'].get('ai_powered')}")
                        print(f"✅ Advisor model: {data['advisor'].get('model')}")
                else:
                    print("❌ Advisor service not found in response")
                    success = False
                
                if "kyc" in data:
                    if data["kyc"].get("ai_powered") != True:
                        print(f"❌ KYC service ai_powered is not true: {data['kyc'].get('ai_powered')}")
                        success = False
                    else:
                        print(f"✅ KYC service ai_powered: {data['kyc'].get('ai_powered')}")
                        print(f"✅ KYC model: {data['kyc'].get('model')}")
                else:
                    print("❌ KYC service not found in response")
                    success = False
                
                if success:
                    print("✅ AI Services Status PASSED - Both services are AI powered")
                    return True
                else:
                    print("❌ AI Services Status FAILED - Services not properly AI powered")
                    return False
                    
            except json.JSONDecodeError:
                print(f"❌ AI Services Status FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ AI Services Status FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI Services Status FAILED - Request error: {e}")
        return False

def test_ai_legal_advisor():
    """Test POST /api/test/ai-advisor - should return real AI analysis"""
    print("\n=== Testing AI Legal Advisor ===")
    try:
        # Sample request data for AI advisor
        test_data = {
            "asset_type": "real_estate",
            "value": 500000,
            "description": "Commercial property in downtown area for tokenization analysis"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/test/ai-advisor", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=60  # AI requests might take longer
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                
                # Check for AI analysis structure
                success = True
                required_fields = ["asset_analysis", "legal_guidance", "tokenization_strategy"]
                
                for field in required_fields:
                    if field not in data:
                        print(f"❌ Missing required field: {field}")
                        success = False
                    else:
                        print(f"✅ Found field: {field}")
                
                # Check for AI metadata
                if "ai_powered" in data and data["ai_powered"] == True:
                    print("✅ Response shows ai_powered: true")
                else:
                    print(f"❌ ai_powered not true or missing: {data.get('ai_powered')}")
                    success = False
                
                if success:
                    print("✅ AI Legal Advisor PASSED - Real AI analysis returned")
                    return True
                else:
                    print("❌ AI Legal Advisor FAILED - Missing required analysis fields")
                    return False
                    
            except json.JSONDecodeError:
                print(f"❌ AI Legal Advisor FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ AI Legal Advisor FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI Legal Advisor FAILED - Request error: {e}")
        return False

def test_env_debug():
    """Test GET /api/test/env-debug - verify EMERGENT_LLM_KEY exists and has length 30"""
    print("\n=== Testing Environment Debug ===")
    try:
        response = requests.get(f"{BASE_URL}/api/test/env-debug", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Parsed JSON: {json.dumps(data, indent=2)}")
                
                # Check EMERGENT_LLM_KEY
                if "EMERGENT_LLM_KEY" in data:
                    key_info = data["EMERGENT_LLM_KEY"]
                    if isinstance(key_info, dict):
                        exists = key_info.get("exists", False)
                        length = key_info.get("length", 0)
                        
                        if exists and length >= 30:
                            print(f"✅ EMERGENT_LLM_KEY exists with length {length}")
                            print("✅ Environment Debug PASSED")
                            return True
                        else:
                            print(f"❌ EMERGENT_LLM_KEY issue - exists: {exists}, length: {length}")
                            return False
                    else:
                        print(f"❌ EMERGENT_LLM_KEY format unexpected: {key_info}")
                        return False
                else:
                    print("❌ EMERGENT_LLM_KEY not found in response")
                    return False
                    
            except json.JSONDecodeError:
                print(f"❌ Environment Debug FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ Environment Debug FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Environment Debug FAILED - Request error: {e}")
        return False

def main():
    """Run all backend tests"""
    print("=" * 60)
    print("QUANTPAYCHAIN BACKEND API TESTING")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    print("=" * 60)
    
    # Run all tests
    tests = [
        ("Health Check", test_health_check),
        ("AI Services Status", test_ai_services_status),
        ("AI Legal Advisor", test_ai_legal_advisor),
        ("Environment Debug", test_env_debug)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ {test_name} FAILED with exception: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Backend API is working correctly!")
        return True
    else:
        print("⚠️  SOME TESTS FAILED - Backend API has issues")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)