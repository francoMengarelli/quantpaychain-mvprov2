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
                services = data.get("services", {})
                
                if "ai_advisor" in services:
                    advisor = services["ai_advisor"]
                    if advisor.get("ai_powered") != True:
                        print(f"❌ AI Advisor service ai_powered is not true: {advisor.get('ai_powered')}")
                        success = False
                    else:
                        print(f"✅ AI Advisor service ai_powered: {advisor.get('ai_powered')}")
                        print(f"✅ AI Advisor model: {advisor.get('model')}")
                        print(f"✅ AI Advisor status: {advisor.get('status')}")
                else:
                    print("❌ AI Advisor service not found in response")
                    success = False
                
                if "kyc_aml" in services:
                    kyc = services["kyc_aml"]
                    if kyc.get("ai_powered") != True:
                        print(f"❌ KYC/AML service ai_powered is not true: {kyc.get('ai_powered')}")
                        success = False
                    else:
                        print(f"✅ KYC/AML service ai_powered: {kyc.get('ai_powered')}")
                        print(f"✅ KYC/AML model: {kyc.get('model')}")
                        print(f"✅ KYC/AML status: {kyc.get('status')}")
                else:
                    print("❌ KYC/AML service not found in response")
                    success = False
                
                # Check emergent LLM key status
                if data.get("emergent_llm_key"):
                    print(f"✅ Emergent LLM Key: {data.get('emergent_llm_key')}")
                
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
                
                # Check for test status
                if "test_status" in data:
                    print(f"✅ Test Status: {data['test_status']}")
                
                # Check for model used
                if "model_used" in data:
                    print(f"✅ Model Used: {data['model_used']}")
                
                # Check for AI analysis structure
                success = True
                ai_analysis = data.get("ai_analysis", {})
                
                # Look for analysis components in the actual response structure
                if "asset_analysis" in ai_analysis:
                    print("✅ Found asset_analysis")
                    asset_analysis = ai_analysis["asset_analysis"]
                    if "value_assessment" in asset_analysis:
                        print("✅ Found value_assessment")
                    if "location_analysis" in asset_analysis:
                        print("✅ Found location_analysis")
                else:
                    print("❌ Missing asset_analysis")
                    success = False
                
                if "legal_guidance" in ai_analysis:
                    print("✅ Found legal_guidance")
                else:
                    print("❌ Missing legal_guidance")
                    success = False
                
                if "tokenization_strategy" in ai_analysis:
                    print("✅ Found tokenization_strategy")
                else:
                    print("❌ Missing tokenization_strategy")
                    success = False
                
                # Check if response indicates AI is working
                if data.get("model_used") in ["gpt-4", "gpt-4o", "gpt-4o-mini"]:
                    print("✅ Real AI model being used (not fallback)")
                else:
                    print(f"❌ Unexpected model: {data.get('model_used')}")
                    success = False
                
                if success:
                    print("✅ AI Legal Advisor PASSED - Real AI analysis returned")
                    return True
                else:
                    print("❌ AI Legal Advisor FAILED - Missing required analysis components")
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
    """Test GET /api/test/env-debug - verify AI service keys exist"""
    print("\n=== Testing Environment Debug ===")
    try:
        response = requests.get(f"{BASE_URL}/api/test/env-debug", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Parsed JSON: {json.dumps(data, indent=2)}")
                
                success = True
                
                # Check AI services keys
                if "ai_services_keys" in data:
                    ai_keys = data["ai_services_keys"]
                    
                    if "ai_advisor_key" in ai_keys and ai_keys["ai_advisor_key"]:
                        print(f"✅ AI Advisor key exists: {ai_keys['ai_advisor_key']}")
                    else:
                        print("❌ AI Advisor key missing")
                        success = False
                    
                    if "kyc_key" in ai_keys and ai_keys["kyc_key"]:
                        print(f"✅ KYC key exists: {ai_keys['kyc_key']}")
                    else:
                        print("❌ KYC key missing")
                        success = False
                else:
                    print("❌ ai_services_keys not found in response")
                    success = False
                
                # Check environment variables
                if "environment_variables" in data:
                    env_vars = data["environment_variables"]
                    print(f"✅ Found {len(env_vars)} environment variables")
                    
                    # Check for key services
                    key_services = ["OPENAI_API_KEY", "SUPABASE_URL", "STRIPE_SECRET_KEY"]
                    for service in key_services:
                        if service in env_vars and env_vars[service].get("exists"):
                            print(f"✅ {service} exists (length: {env_vars[service].get('length')})")
                        else:
                            print(f"❌ {service} missing or not configured")
                
                # Check total environment variables
                if "total_env_vars" in data:
                    print(f"✅ Total environment variables: {data['total_env_vars']}")
                
                if success:
                    print("✅ Environment Debug PASSED - AI service keys configured")
                    return True
                else:
                    print("❌ Environment Debug FAILED - Missing AI service keys")
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