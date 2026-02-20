#!/usr/bin/env python3
"""
Backend API Testing for QuantPayChain (Render Deployment)
Testing PQC and ISO 20022 services as requested in the review
"""

import requests
import json
import sys
import xml.etree.ElementTree as ET
from datetime import datetime

# Base URL for the deployed API - Updated for current testing
BASE_URL = "https://institutional-rwa.preview.emergentagent.com"

# Global variables to store test data between tests
test_keypair = {}
test_signature_data = {}
test_payment_message_id = None

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

def test_ai_jurisdictional_analysis_demo():
    """Test POST /api/ai/jurisdictional-analysis-demo - verify institutional positioning prompt"""
    print("\n=== Testing AI Jurisdictional Analysis Demo ===")
    try:
        # Test data as specified in the review request
        test_data = {
            "jurisdiction_code": "CH",
            "asset_data": {
                "type": "Real Estate",
                "value_usd": 500000,
                "location": "Zurich",
                "description": "Commercial office building"
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/jurisdictional-analysis-demo",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=120  # AI requests might take longer
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response Length: {len(response.text)} characters")
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check response structure
                required_fields = ["report_id", "jurisdiction", "analysis", "metadata"]
                for field in required_fields:
                    if field in data:
                        print(f"✅ Found {field}")
                    else:
                        print(f"❌ Missing {field}")
                        success = False
                
                # Check jurisdiction info
                if "jurisdiction" in data:
                    jurisdiction = data["jurisdiction"]
                    if jurisdiction.get("code") == "CH":
                        print("✅ Correct jurisdiction code: CH")
                    else:
                        print(f"❌ Expected jurisdiction CH, got: {jurisdiction.get('code')}")
                        success = False
                    
                    if "Switzerland" in str(jurisdiction.get("name", "")):
                        print("✅ Jurisdiction name contains Switzerland")
                    else:
                        print(f"❌ Jurisdiction name issue: {jurisdiction.get('name')}")
                        success = False
                
                # Check analysis content for institutional positioning
                analysis_text = str(data.get("analysis", "")).lower()
                
                # Should NOT contain legal advisor phrases
                forbidden_phrases = ["asesor legal", "legal advisor"]
                for phrase in forbidden_phrases:
                    if phrase in analysis_text:
                        print(f"❌ FORBIDDEN PHRASE FOUND: '{phrase}' - should not be present")
                        success = False
                    else:
                        print(f"✅ Correctly avoided forbidden phrase: '{phrase}'")
                
                # Should contain institutional/risk intelligence phrases
                required_phrases = [
                    ("análisis pre-legal", "pre-legal"),
                    ("inteligencia regulatoria", "regulatory intelligence"),
                    ("indicativo", "indicative")
                ]
                
                found_phrases = []
                for spanish_phrase, english_phrase in required_phrases:
                    if spanish_phrase in analysis_text or english_phrase in analysis_text:
                        found_phrases.append(f"{spanish_phrase}/{english_phrase}")
                        print(f"✅ Found institutional phrase: {spanish_phrase} or {english_phrase}")
                    else:
                        print(f"❌ Missing institutional phrase: {spanish_phrase} or {english_phrase}")
                        success = False
                
                # Check for legal disclaimer
                disclaimer_phrases = ["no constituye asesoría legal", "not legal advice", "no es asesoría legal"]
                disclaimer_found = any(phrase in analysis_text for phrase in disclaimer_phrases)
                if disclaimer_found:
                    print("✅ Found legal disclaimer")
                else:
                    print("❌ Missing legal disclaimer")
                    success = False
                
                # Check for risk classification terms
                risk_terms = ["bajo", "medio", "alto", "low", "medium", "high"]
                risk_found = any(term in analysis_text for term in risk_terms)
                if risk_found:
                    print("✅ Found risk classification terms")
                else:
                    print("❌ Missing risk classification terms")
                    success = False
                
                # Check for executive/institutional tone indicators
                institutional_indicators = [
                    "resumen ejecutivo", "executive summary",
                    "contexto regulatorio", "regulatory context",
                    "consideraciones", "considerations",
                    "recomendaciones", "recommendations"
                ]
                institutional_found = any(indicator in analysis_text for indicator in institutional_indicators)
                if institutional_found:
                    print("✅ Found executive/institutional tone indicators")
                else:
                    print("❌ Missing executive/institutional tone indicators")
                    success = False
                
                # Print sample of analysis for manual review
                print(f"\n--- ANALYSIS SAMPLE (first 300 chars) ---")
                print(data.get("analysis", "")[:300] + "...")
                print("--- END SAMPLE ---\n")
                
                if success:
                    print("✅ AI Jurisdictional Analysis Demo PASSED - Institutional positioning working correctly")
                    return True
                else:
                    print("❌ AI Jurisdictional Analysis Demo FAILED - Issues with institutional positioning")
                    return False
                    
            except json.JSONDecodeError:
                print(f"❌ AI Jurisdictional Analysis Demo FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ AI Jurisdictional Analysis Demo FAILED - Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI Jurisdictional Analysis Demo FAILED - Request error: {e}")
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

def test_service_info():
    """Test GET / - should return service info with version 2.0.0"""
    print("\n=== Testing Service Info ===")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check version
                if data.get("version") == "2.0.0":
                    print("✅ Version 2.0.0 confirmed")
                else:
                    print(f"❌ Expected version 2.0.0, got: {data.get('version')}")
                    success = False
                
                # Check service name
                if "QuantPayChain" in str(data.get("service", "")):
                    print("✅ Service name contains QuantPayChain")
                else:
                    print(f"❌ Service name issue: {data.get('service')}")
                    success = False
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ Service Info FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ Service Info FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Service Info FAILED - Request error: {e}")
        return False

def test_pqc_service_info():
    """Test GET /api/pqc/service-info - should return PQC service status"""
    print("\n=== Testing PQC Service Info ===")
    try:
        response = requests.get(f"{BASE_URL}/api/pqc/service-info", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check for PQC service information
                if "service" in data and "pqc" in str(data["service"]).lower():
                    print("✅ PQC service info found")
                else:
                    print(f"❌ PQC service info missing: {data}")
                    success = False
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ PQC Service Info FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ PQC Service Info FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ PQC Service Info FAILED - Request error: {e}")
        return False

def test_iso20022_service_info():
    """Test GET /api/iso20022/service-info - should return ISO 20022 supported messages"""
    print("\n=== Testing ISO 20022 Service Info ===")
    try:
        response = requests.get(f"{BASE_URL}/api/iso20022/service-info", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check for ISO 20022 service information
                if "supported_messages" in data or "iso20022" in str(data).lower():
                    print("✅ ISO 20022 service info found")
                else:
                    print(f"❌ ISO 20022 service info missing: {data}")
                    success = False
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ ISO 20022 Service Info FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ ISO 20022 Service Info FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ISO 20022 Service Info FAILED - Request error: {e}")
        return False

def test_pqc_generate_keypair():
    """Test POST /api/pqc/generate-keypair - generate quantum-resistant keypair"""
    global test_keypair
    print("\n=== Testing PQC Generate Keypair ===")
    try:
        # Test without algorithm parameter (should use default ML-DSA-65)
        response = requests.post(
            f"{BASE_URL}/api/pqc/generate-keypair",
            json={},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check required fields
                required_fields = ["algorithm", "public_key", "private_key", "generated_at"]
                for field in required_fields:
                    if field in data:
                        print(f"✅ Found {field}")
                    else:
                        print(f"❌ Missing {field}")
                        success = False
                
                # Check default algorithm
                if data.get("algorithm") == "ML-DSA-65":
                    print("✅ Default algorithm ML-DSA-65 used")
                else:
                    print(f"❌ Expected ML-DSA-65, got: {data.get('algorithm')}")
                    success = False
                
                # Store keypair for later tests
                if success:
                    test_keypair = {
                        "public_key": data.get("public_key"),
                        "private_key": data.get("private_key"),
                        "algorithm": data.get("algorithm")
                    }
                    print("✅ Keypair stored for signature tests")
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ PQC Generate Keypair FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ PQC Generate Keypair FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ PQC Generate Keypair FAILED - Request error: {e}")
        return False

def test_pqc_sign_transaction():
    """Test POST /api/pqc/sign-transaction - sign a transaction"""
    global test_signature_data
    print("\n=== Testing PQC Sign Transaction ===")
    
    if not test_keypair.get("private_key"):
        print("❌ Cannot test signing - no keypair available from previous test")
        return False
    
    try:
        # Create test transaction data
        transaction_data = {
            "asset_id": "TEST001",
            "amount": 1000,
            "from": "user1",
            "to": "user2"
        }
        
        request_data = {
            "transaction_data": transaction_data,
            "private_key": test_keypair["private_key"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/pqc/sign-transaction",
            json=request_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check required fields
                required_fields = ["signature", "algorithm", "transaction_hash", "signed_at"]
                for field in required_fields:
                    if field in data:
                        print(f"✅ Found {field}")
                    else:
                        print(f"❌ Missing {field}")
                        success = False
                
                # Store signature data for verification test
                if success:
                    test_signature_data = {
                        "signature": data.get("signature"),
                        "transaction_hash": data.get("transaction_hash"),
                        "transaction_data": transaction_data
                    }
                    print("✅ Signature data stored for verification test")
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ PQC Sign Transaction FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ PQC Sign Transaction FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ PQC Sign Transaction FAILED - Request error: {e}")
        return False

def test_pqc_verify_signature():
    """Test POST /api/pqc/verify-signature - verify signature"""
    print("\n=== Testing PQC Verify Signature ===")
    
    if not test_signature_data.get("signature") or not test_keypair.get("public_key"):
        print("❌ Cannot test verification - no signature or public key available")
        return False
    
    try:
        request_data = {
            "transaction_data": test_signature_data["transaction_data"],
            "signature": test_signature_data["signature"],
            "public_key": test_keypair["public_key"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/pqc/verify-signature",
            json=request_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                
                # Check if signature is valid
                if data.get("valid") == True:
                    print("✅ Signature verification PASSED - valid: true")
                    return True
                else:
                    print(f"❌ Signature verification FAILED - valid: {data.get('valid')}")
                    return False
                
            except json.JSONDecodeError:
                print(f"❌ PQC Verify Signature FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ PQC Verify Signature FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ PQC Verify Signature FAILED - Request error: {e}")
        return False

def test_iso20022_payment_initiation():
    """Test POST /api/iso20022/payment-initiation - generate pain.001 message"""
    global test_payment_message_id
    print("\n=== Testing ISO 20022 Payment Initiation ===")
    try:
        # Sample payment data
        payment_data = {
            "debtor_name": "Test Company Ltd",
            "debtor_account": "DE89370400440532013000",
            "debtor_bic": "COBADEFF",
            "creditor_name": "Recipient Corp",
            "creditor_account": "FR7630006000011234567890189",
            "creditor_bic": "BNPAFRPP",
            "amount": 1500.50,
            "currency": "EUR",
            "reference": "TEST-INV-001",
            "remittance_info": "Test payment for services"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/iso20022/payment-initiation",
            json=payment_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check required fields
                required_fields = ["message_id", "message_type", "xml_content"]
                for field in required_fields:
                    if field in data:
                        print(f"✅ Found {field}")
                    else:
                        print(f"❌ Missing {field}")
                        success = False
                
                # Check message type
                if data.get("message_type") == "pain.001.001.08":
                    print("✅ Correct message type pain.001.001.08")
                else:
                    print(f"❌ Expected pain.001.001.08, got: {data.get('message_type')}")
                    success = False
                
                # Validate XML structure
                if data.get("xml_content"):
                    try:
                        ET.fromstring(data["xml_content"])
                        print("✅ XML content is well-formed")
                    except ET.ParseError:
                        print("❌ XML content is not well-formed")
                        success = False
                
                # Store message ID for status test
                if success:
                    test_payment_message_id = data.get("message_id")
                    print(f"✅ Message ID stored: {test_payment_message_id}")
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ ISO 20022 Payment Initiation FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ ISO 20022 Payment Initiation FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ISO 20022 Payment Initiation FAILED - Request error: {e}")
        return False

def test_iso20022_payment_status():
    """Test POST /api/iso20022/payment-status - generate pain.002 message"""
    print("\n=== Testing ISO 20022 Payment Status ===")
    
    if not test_payment_message_id:
        print("❌ Cannot test payment status - no message ID from previous test")
        return False
    
    try:
        request_data = {
            "message_id": test_payment_message_id,
            "status_code": "ACCP"  # Accepted
        }
        
        response = requests.post(
            f"{BASE_URL}/api/iso20022/payment-status",
            json=request_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check for XML content with status report
                if "xml_content" in data:
                    print("✅ Found XML content")
                    
                    # Validate XML structure
                    try:
                        ET.fromstring(data["xml_content"])
                        print("✅ XML content is well-formed")
                    except ET.ParseError:
                        print("❌ XML content is not well-formed")
                        success = False
                else:
                    print("❌ Missing xml_content")
                    success = False
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ ISO 20022 Payment Status FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ ISO 20022 Payment Status FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ISO 20022 Payment Status FAILED - Request error: {e}")
        return False

def test_iso20022_bank_statement():
    """Test POST /api/iso20022/bank-statement - generate camt.053 statement"""
    print("\n=== Testing ISO 20022 Bank Statement ===")
    try:
        # Sample statement data
        statement_data = {
            "account_iban": "DE89370400440532013000",
            "account_name": "Test Account",
            "statement_date": "2025-01-15",
            "opening_balance": 10000.00,
            "closing_balance": 11500.50,
            "currency": "EUR",
            "transactions": [
                {
                    "amount": 1500.50,
                    "credit_debit": "CRDT",
                    "booking_date": "2025-01-15",
                    "description": "Test transaction"
                }
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/iso20022/bank-statement",
            json=statement_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check for statement content
                if "xml_content" in data or "statement" in data:
                    print("✅ Found statement content")
                    
                    # If XML, validate structure
                    if "xml_content" in data:
                        try:
                            ET.fromstring(data["xml_content"])
                            print("✅ XML content is well-formed")
                        except ET.ParseError:
                            print("❌ XML content is not well-formed")
                            success = False
                else:
                    print("❌ Missing statement content")
                    success = False
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ ISO 20022 Bank Statement FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ ISO 20022 Bank Statement FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ISO 20022 Bank Statement FAILED - Request error: {e}")
        return False

def test_secure_payment_flow():
    """Test POST /api/secure-payment/initiate - combined PQC + ISO 20022"""
    print("\n=== Testing Secure Payment Flow ===")
    try:
        # Same payment data as ISO test
        payment_data = {
            "debtor_name": "Test Company Ltd",
            "debtor_account": "DE89370400440532013000",
            "debtor_bic": "COBADEFF",
            "creditor_name": "Recipient Corp",
            "creditor_account": "FR7630006000011234567890189",
            "creditor_bic": "BNPAFRPP",
            "amount": 1500.50,
            "currency": "EUR",
            "reference": "TEST-INV-001",
            "remittance_info": "Test payment for services"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/secure-payment/initiate",
            json=payment_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate long responses
        
        if response.status_code == 200:
            try:
                data = response.json()
                success = True
                
                # Check for both ISO 20022 and PQC components
                if "iso20022_message" in data:
                    print("✅ Found ISO 20022 message")
                    
                    # Check for pain.001 XML
                    iso_msg = data["iso20022_message"]
                    if "xml_content" in iso_msg:
                        print("✅ Found pain.001 XML content")
                    else:
                        print("❌ Missing pain.001 XML content")
                        success = False
                else:
                    print("❌ Missing iso20022_message")
                    success = False
                
                if "pqc_signature" in data:
                    print("✅ Found PQC signature")
                    
                    # Check signature components
                    pqc_sig = data["pqc_signature"]
                    if "signature" in pqc_sig:
                        print("✅ Found quantum-resistant signature")
                    else:
                        print("❌ Missing quantum-resistant signature")
                        success = False
                else:
                    print("❌ Missing pqc_signature")
                    success = False
                
                if "public_key" in data:
                    print("✅ Found public key for verification")
                else:
                    print("❌ Missing public key")
                    success = False
                
                # Check security level
                if "security_level" in data and "NIST Level 3" in str(data["security_level"]):
                    print("✅ NIST Level 3 security confirmed")
                else:
                    print(f"❌ Security level issue: {data.get('security_level')}")
                    success = False
                
                return success
                
            except json.JSONDecodeError:
                print(f"❌ Secure Payment Flow FAILED - Response is not valid JSON: {response.text}")
                return False
        else:
            print(f"❌ Secure Payment Flow FAILED - Expected 200, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Secure Payment Flow FAILED - Request error: {e}")
        return False

def main():
    """Run all backend tests"""
    print("=" * 80)
    print("QUANTPAYCHAIN API BACKEND TESTING - PQC & ISO 20022 SERVICES")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    print("=" * 80)
    
    # Run all tests in order
    tests = [
        # Health & Service Info
        ("Service Info (Version 2.0.0)", test_service_info),
        ("PQC Service Info", test_pqc_service_info),
        ("ISO 20022 Service Info", test_iso20022_service_info),
        
        # PQC Service Testing
        ("PQC Generate Keypair", test_pqc_generate_keypair),
        ("PQC Sign Transaction", test_pqc_sign_transaction),
        ("PQC Verify Signature", test_pqc_verify_signature),
        
        # ISO 20022 Service Testing
        ("ISO 20022 Payment Initiation", test_iso20022_payment_initiation),
        ("ISO 20022 Payment Status", test_iso20022_payment_status),
        ("ISO 20022 Bank Statement", test_iso20022_bank_statement),
        
        # Combined Secure Payment Flow
        ("Secure Payment Flow (PQC + ISO)", test_secure_payment_flow),
        
        # Existing AI Services
        ("Health Check", test_health_check),
        ("AI Services Status", test_ai_services_status),
        ("AI Legal Advisor", test_ai_legal_advisor),
        ("AI Jurisdictional Analysis Demo", test_ai_jurisdictional_analysis_demo),
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
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = 0
    total = len(results)
    
    # Group results by category
    categories = {
        "Service Info": ["Service Info (Version 2.0.0)", "PQC Service Info", "ISO 20022 Service Info"],
        "PQC Services": ["PQC Generate Keypair", "PQC Sign Transaction", "PQC Verify Signature"],
        "ISO 20022 Services": ["ISO 20022 Payment Initiation", "ISO 20022 Payment Status", "ISO 20022 Bank Statement"],
        "Combined Services": ["Secure Payment Flow (PQC + ISO)"],
        "AI Services": ["Health Check", "AI Services Status", "AI Legal Advisor", "AI Jurisdictional Analysis Demo", "Environment Debug"]
    }
    
    for category, test_names in categories.items():
        print(f"\n{category}:")
        for test_name in test_names:
            if test_name in results:
                status = "✅ PASSED" if results[test_name] else "❌ FAILED"
                print(f"  {test_name}: {status}")
                if results[test_name]:
                    passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - QuantPayChain API is fully functional!")
        return True
    else:
        print("⚠️  SOME TESTS FAILED - Check individual test results above")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)