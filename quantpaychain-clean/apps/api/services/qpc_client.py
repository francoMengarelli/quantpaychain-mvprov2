"""QPC Client - Bridge to access qpc-v2-core TypeScript service from Python

This client provides Python access to the professional TypeScript implementation
of PQC, ISO20022, and KYC/AML modules.
"""

import httpx
import os
from typing import Dict, Optional, List, Any
from datetime import datetime


class QPCClient:
    """Client for communicating with QPC TypeScript microservice"""
    
    def __init__(self):
        self.base_url = os.environ.get("QPC_SERVICE_URL", "http://localhost:3001")
        self.timeout = 30.0
        print(f"✅ QPC Client initialized - connecting to {self.base_url}")
    
    async def _post(self, endpoint: str, data: Dict) -> Dict:
        """Internal method to make POST requests"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    f"{self.base_url}{endpoint}",
                    json=data
                )
                response.raise_for_status()
                result = response.json()
                
                if not result.get("success"):
                    raise Exception(f"QPC Service error: {result.get('error', 'Unknown error')}")
                
                return result.get("data", {})
            except httpx.HTTPStatusError as e:
                raise Exception(f"HTTP error calling QPC service: {e}")
            except Exception as e:
                raise Exception(f"Error calling QPC service: {str(e)}")
    
    async def _get(self, endpoint: str) -> Dict:
        """Internal method to make GET requests"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(f"{self.base_url}{endpoint}")
                response.raise_for_status()
                result = response.json()
                
                if not result.get("success"):
                    raise Exception(f"QPC Service error: {result.get('error', 'Unknown error')}")
                
                return result.get("data", {})
            except httpx.HTTPStatusError as e:
                raise Exception(f"HTTP error calling QPC service: {e}")
            except Exception as e:
                raise Exception(f"Error calling QPC service: {str(e)}")
    
    # ========== PQC Methods ==========
    
    async def generate_pqc_keypair(self, 
                                  algorithm: Optional[str] = None,
                                  key_type: Optional[str] = None,
                                  purpose: str = "general") -> Dict:
        """
        Generate post-quantum cryptographic keypair using ML-KEM or ML-DSA
        
        Args:
            algorithm: PQC algorithm (ML-KEM-768, ML-DSA-65, etc.)
            key_type: Type of key (KEY_EXCHANGE, SIGNATURE)
            purpose: Purpose of the key
        
        Returns:
            KeyPair with publicKey, privateKey, algorithm, metadata
        """
        return await self._post("/pqc/generate-keypair", {
            "algorithm": algorithm,
            "keyType": key_type,
            "purpose": purpose
        })
    
    async def sign_with_pqc(self, message: str, key_pair: Dict) -> Dict:
        """
        Sign message with post-quantum digital signature
        
        Args:
            message: Message to sign
            key_pair: KeyPair object from generate_pqc_keypair
        
        Returns:
            Signature result with signature, algorithm, timestamp
        """
        return await self._post("/pqc/sign", {
            "message": message,
            "keyPair": key_pair
        })
    
    async def verify_pqc_signature(self, message: str, signature_result: Dict) -> Dict:
        """
        Verify post-quantum signature
        
        Args:
            message: Original message
            signature_result: Signature result from sign_with_pqc
        
        Returns:
            Verification result with isValid, algorithm, timestamp
        """
        return await self._post("/pqc/verify", {
            "message": message,
            "signatureResult": signature_result
        })
    
    async def encrypt_with_pqc(self, plaintext: str, recipient_public_key: str) -> Dict:
        """
        Encrypt data using ML-KEM key encapsulation
        
        Args:
            plaintext: Data to encrypt
            recipient_public_key: Base64 encoded public key
        
        Returns:
            Encrypted data with encapsulation and ciphertext
        """
        return await self._post("/pqc/encrypt", {
            "plaintext": plaintext,
            "recipientPublicKey": recipient_public_key
        })
    
    # ========== ISO 20022 Methods ==========
    
    async def parse_iso20022(self, xml_string: str) -> Dict:
        """
        Parse ISO 20022 XML message
        
        Args:
            xml_string: ISO 20022 XML content
        
        Returns:
            Parsed message with messageType, data, metadata
        """
        return await self._post("/iso20022/parse", {
            "xmlString": xml_string
        })
    
    async def validate_iso20022(self, parsed_message: Dict) -> Dict:
        """
        Validate ISO 20022 message against schema
        
        Args:
            parsed_message: Parsed message from parse_iso20022
        
        Returns:
            Validation result with isValid, errors, warnings
        """
        return await self._post("/iso20022/validate", {
            "parsedMessage": parsed_message
        })
    
    async def iso20022_to_internal(self, 
                                  parsed_message: Dict,
                                  options: Optional[Dict] = None) -> List[Dict]:
        """
        Transform ISO 20022 message to internal payment format
        
        Args:
            parsed_message: Parsed ISO 20022 message
            options: Transformation options
        
        Returns:
            List of internal payment objects
        """
        return await self._post("/iso20022/to-internal", {
            "parsedMessage": parsed_message,
            "options": options or {}
        })
    
    async def internal_to_iso20022(self,
                                  payments: List[Dict],
                                  message_type: Optional[str] = None,
                                  options: Optional[Dict] = None) -> str:
        """
        Transform internal payments to ISO 20022 XML
        
        Args:
            payments: List of internal payment objects
            message_type: Target ISO 20022 message type (pain.001, etc.)
            options: Transformation options
        
        Returns:
            ISO 20022 XML string
        """
        result = await self._post("/iso20022/to-iso", {
            "payments": payments,
            "messageType": message_type,
            "options": options or {}
        })
        return result.get("xml", "")
    
    async def process_iso20022(self,
                              xml_string: str,
                              validate_message: bool = True,
                              transform_options: Optional[Dict] = None) -> Dict:
        """
        Process ISO 20022 message end-to-end: parse → validate → transform
        
        Args:
            xml_string: ISO 20022 XML content
            validate_message: Whether to validate the message
            transform_options: Transformation options
        
        Returns:
            Complete result with parsed, validation, and payments
        """
        return await self._post("/iso20022/process", {
            "xmlString": xml_string,
            "validateMessage": validate_message,
            "transformOptions": transform_options or {}
        })
    
    # ========== KYC/AML Methods ==========
    
    async def perform_compliance_check(self,
                                      transaction: Dict,
                                      customer: Dict,
                                      transaction_history: Optional[List[Dict]] = None) -> Dict:
        """
        Perform comprehensive KYC/AML compliance check
        
        Includes:
        - Risk scoring
        - Sanctions check
        - Pattern detection
        - Rules engine evaluation
        
        Args:
            transaction: Transaction details
            customer: Customer information
            transaction_history: Optional transaction history for pattern detection
        
        Returns:
            Complete risk assessment with score, flags, recommendation
        """
        return await self._post("/kyc-aml/compliance-check", {
            "transaction": transaction,
            "customer": customer,
            "transactionHistory": transaction_history or []
        })
    
    async def verify_kyc_document(self, request: Dict, customer: Dict) -> Dict:
        """
        Verify KYC document (ID, passport, etc.)
        
        Args:
            request: Document verification request
            customer: Customer information
        
        Returns:
            Verification result with status, confidence, issues
        """
        return await self._post("/kyc-aml/verify-document", {
            "request": request,
            "customer": customer
        })
    
    async def generate_compliance_report(self, 
                                        start_date: str,
                                        end_date: str) -> Dict:
        """
        Generate compliance report for date range
        
        Args:
            start_date: ISO format date string
            end_date: ISO format date string
        
        Returns:
            Compliance report with statistics, flags, assessments
        """
        return await self._post("/kyc-aml/generate-report", {
            "startDate": start_date,
            "endDate": end_date
        })
    
    async def get_compliance_summary(self) -> Dict:
        """
        Get overall compliance summary
        
        Returns:
            Summary with statistics, trends, alerts
        """
        return await self._get("/kyc-aml/summary")
    
    async def health_check(self) -> Dict:
        """Check if QPC service is healthy"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.json()
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            }
