#!/usr/bin/env python3
"""
Focused test for AI Jurisdictional Analysis endpoint
Testing the new institutional positioning prompt as requested
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend env
BASE_URL = "https://institutional-rwa.preview.emergentagent.com"

def test_ai_jurisdictional_analysis_demo():
    """Test POST /api/ai/jurisdictional-analysis-demo - verify institutional positioning prompt"""
    print("\n=== Testing AI Jurisdictional Analysis Demo ===")
    print(f"Testing URL: {BASE_URL}/api/ai/jurisdictional-analysis-demo")
    
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
        
        print(f"Request payload: {json.dumps(test_data, indent=2)}")
        
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
                
                print("✅ Valid JSON response received")
                
                # Check response structure
                required_fields = ["report_id", "jurisdiction", "analysis", "metadata"]
                for field in required_fields:
                    if field in data:
                        print(f"✅ Found required field: {field}")
                    else:
                        print(f"❌ Missing required field: {field}")
                        success = False
                
                # Check jurisdiction info
                if "jurisdiction" in data:
                    jurisdiction = data["jurisdiction"]
                    if jurisdiction.get("code") == "CH":
                        print("✅ Correct jurisdiction code: CH")
                    else:
                        print(f"❌ Expected jurisdiction CH, got: {jurisdiction.get('code')}")
                        success = False
                    
                    if "Switzerland" in str(jurisdiction.get("name", "")) or "Suiza" in str(jurisdiction.get("name", "")):
                        print("✅ Jurisdiction name contains Switzerland/Suiza")
                    else:
                        print(f"❌ Jurisdiction name issue: {jurisdiction.get('name')}")
                        success = False
                
                # Check analysis content for institutional positioning
                analysis_text = str(data.get("analysis", "")).lower()
                print(f"\nAnalysis text length: {len(analysis_text)} characters")
                
                # Should NOT contain legal advisor phrases (except in disclaimers)
                forbidden_phrases = ["asesor legal", "legal advisor"]
                for phrase in forbidden_phrases:
                    if phrase in analysis_text:
                        # Check if it's in a disclaimer context (which is acceptable)
                        index = analysis_text.find(phrase)
                        start = max(0, index - 50)
                        end = min(len(analysis_text), index + len(phrase) + 50)
                        context = analysis_text[start:end]
                        
                        # Acceptable contexts where legal advisor can be mentioned
                        acceptable_contexts = ["no como asesor legal", "not as a legal advisor", "no es asesor legal", "not legal advisor"]
                        is_acceptable = any(acceptable in context for acceptable in acceptable_contexts)
                        
                        if is_acceptable:
                            print(f"✅ Found '{phrase}' in acceptable disclaimer context: ...{context}...")
                        else:
                            print(f"❌ FORBIDDEN PHRASE FOUND: '{phrase}' - should not be present outside disclaimers")
                            print(f"Context: ...{context}...")
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
                
                # Check for risk classification terms (more comprehensive)
                risk_terms = ["bajo", "medio", "alto", "low", "medium", "high", "riesgo", "risk", "viable", "favorable", "consideraciones"]
                risk_found = any(term in analysis_text for term in risk_terms)
                if risk_found:
                    found_risk_terms = [term for term in risk_terms if term in analysis_text]
                    print(f"✅ Found risk classification terms: {found_risk_terms[:3]}")
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
                print(f"\n--- ANALYSIS SAMPLE (first 500 chars) ---")
                print(data.get("analysis", "")[:500] + "...")
                print("--- END SAMPLE ---\n")
                
                if success:
                    print("✅ AI Jurisdictional Analysis Demo PASSED - Institutional positioning working correctly")
                    return True
                else:
                    print("❌ AI Jurisdictional Analysis Demo FAILED - Issues with institutional positioning")
                    return False
                    
            except json.JSONDecodeError:
                print(f"❌ AI Jurisdictional Analysis Demo FAILED - Response is not valid JSON")
                print(f"Response content: {response.text[:500]}...")
                return False
        else:
            print(f"❌ AI Jurisdictional Analysis Demo FAILED - Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI Jurisdictional Analysis Demo FAILED - Request error: {e}")
        return False

def main():
    """Run the AI Jurisdictional Analysis test"""
    print("=" * 80)
    print("AI JURISDICTIONAL ANALYSIS ENDPOINT TESTING")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    print("=" * 80)
    
    success = test_ai_jurisdictional_analysis_demo()
    
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    if success:
        print("🎉 AI Jurisdictional Analysis Demo PASSED - Institutional positioning is working correctly!")
        print("✅ The new prompt successfully avoids 'asesor legal' language")
        print("✅ Uses proper risk intelligence and pre-legal analysis terminology")
        print("✅ Includes appropriate disclaimers and executive tone")
        return True
    else:
        print("⚠️  AI Jurisdictional Analysis Demo FAILED - Issues found with institutional positioning")
        print("❌ Check the analysis above for specific issues")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)