"""Advanced QPC Routes - Using professional TypeScript qpc-v2-core

These endpoints provide access to the production-grade PQC, ISO20022,
and KYC/AML implementation from the TypeScript core package.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from services.qpc_client import QPCClient

router = APIRouter(prefix="/api/qpc", tags=["QPC Advanced"])
qpc_client = QPCClient()


# ========== Pydantic Models ==========

class KeyPairRequest(BaseModel):
    algorithm: Optional[str] = None
    key_type: Optional[str] = None
    purpose: str = "general"


class SignRequest(BaseModel):
    message: str
    key_pair: Dict[str, Any]


class VerifyRequest(BaseModel):
    message: str
    signature_result: Dict[str, Any]


class EncryptRequest(BaseModel):
    plaintext: str
    recipient_public_key: str


class ISO20022ParseRequest(BaseModel):
    xml_string: str


class ISO20022ValidateRequest(BaseModel):
    parsed_message: Dict[str, Any]


class ISO20022ToInternalRequest(BaseModel):
    parsed_message: Dict[str, Any]
    options: Optional[Dict[str, Any]] = None


class ISO20022ToISORequest(BaseModel):
    payments: List[Dict[str, Any]]
    message_type: Optional[str] = None
    options: Optional[Dict[str, Any]] = None


class ISO20022ProcessRequest(BaseModel):
    xml_string: str
    validate_message: bool = True
    transform_options: Optional[Dict[str, Any]] = None


class ComplianceCheckRequest(BaseModel):
    transaction: Dict[str, Any]
    customer: Dict[str, Any]
    transaction_history: Optional[List[Dict[str, Any]]] = None


class DocumentVerificationRequest(BaseModel):
    request: Dict[str, Any]
    customer: Dict[str, Any]


class ComplianceReportRequest(BaseModel):
    start_date: str
    end_date: str


# ========== PQC Endpoints ==========

@router.post("/pqc/generate-keypair")
async def generate_pqc_keypair(request: KeyPairRequest):
    """
    Generate post-quantum cryptographic keypair
    
    Uses ML-KEM-768 (Kyber) for key exchange or ML-DSA-65 (Dilithium) for signatures.
    Includes automatic key rotation capabilities.
    """
    try:
        result = await qpc_client.generate_pqc_keypair(
            algorithm=request.algorithm,
            key_type=request.key_type,
            purpose=request.purpose
        )
        return {
            "success": True,
            "data": result,
            "message": "PQC keypair generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pqc/sign")
async def sign_with_pqc(request: SignRequest):
    """
    Sign message with post-quantum digital signature
    
    Provides quantum-resistant signatures using ML-DSA algorithms.
    """
    try:
        result = await qpc_client.sign_with_pqc(
            message=request.message,
            key_pair=request.key_pair
        )
        return {
            "success": True,
            "data": result,
            "message": "Message signed successfully with PQC"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pqc/verify")
async def verify_pqc_signature(request: VerifyRequest):
    """
    Verify post-quantum signature
    
    Validates signatures created with ML-DSA algorithms.
    """
    try:
        result = await qpc_client.verify_pqc_signature(
            message=request.message,
            signature_result=request.signature_result
        )
        return {
            "success": True,
            "data": result,
            "message": "Signature verification complete"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pqc/encrypt")
async def encrypt_with_pqc(request: EncryptRequest):
    """
    Encrypt data using ML-KEM key encapsulation
    
    Provides quantum-resistant encryption using ML-KEM-768 + AES-GCM.
    """
    try:
        result = await qpc_client.encrypt_with_pqc(
            plaintext=request.plaintext,
            recipient_public_key=request.recipient_public_key
        )
        return {
            "success": True,
            "data": result,
            "message": "Data encrypted successfully with PQC"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== ISO 20022 Endpoints ==========

@router.post("/iso20022/parse")
async def parse_iso20022(request: ISO20022ParseRequest):
    """
    Parse ISO 20022 XML message
    
    Supports pain.001, pain.002, pacs.008, camt.053, camt.054 message types.
    """
    try:
        result = await qpc_client.parse_iso20022(xml_string=request.xml_string)
        return {
            "success": True,
            "data": result,
            "message": "ISO 20022 message parsed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/iso20022/validate")
async def validate_iso20022(request: ISO20022ValidateRequest):
    """
    Validate ISO 20022 message against official schema
    
    Checks compliance with ISO 20022 standards and returns detailed validation results.
    """
    try:
        result = await qpc_client.validate_iso20022(
            parsed_message=request.parsed_message
        )
        return {
            "success": True,
            "data": result,
            "message": "ISO 20022 message validated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/iso20022/to-internal")
async def iso20022_to_internal(request: ISO20022ToInternalRequest):
    """
    Transform ISO 20022 message to internal payment format
    
    Converts standardized ISO 20022 XML to internal system format.
    """
    try:
        result = await qpc_client.iso20022_to_internal(
            parsed_message=request.parsed_message,
            options=request.options
        )
        return {
            "success": True,
            "data": result,
            "message": "ISO 20022 transformed to internal format"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/iso20022/to-iso")
async def internal_to_iso20022(request: ISO20022ToISORequest):
    """
    Transform internal payments to ISO 20022 XML
    
    Generates compliant ISO 20022 XML from internal payment objects.
    """
    try:
        result = await qpc_client.internal_to_iso20022(
            payments=request.payments,
            message_type=request.message_type,
            options=request.options
        )
        return {
            "success": True,
            "data": {"xml": result},
            "message": "Internal format transformed to ISO 20022 XML"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/iso20022/process")
async def process_iso20022(request: ISO20022ProcessRequest):
    """
    Process ISO 20022 message end-to-end
    
    Complete pipeline: Parse → Validate → Transform to internal format.
    """
    try:
        result = await qpc_client.process_iso20022(
            xml_string=request.xml_string,
            validate_message=request.validate_message,
            transform_options=request.transform_options
        )
        return {
            "success": True,
            "data": result,
            "message": "ISO 20022 message processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== KYC/AML Endpoints ==========

@router.post("/kyc-aml/compliance-check")
async def perform_compliance_check(request: ComplianceCheckRequest):
    """
    Perform comprehensive KYC/AML compliance check
    
    Includes:
    - AI-powered risk scoring
    - Sanctions list checking
    - Transaction pattern detection
    - Rules engine evaluation
    - Compliance flag generation
    """
    try:
        result = await qpc_client.perform_compliance_check(
            transaction=request.transaction,
            customer=request.customer,
            transaction_history=request.transaction_history
        )
        return {
            "success": True,
            "data": result,
            "message": "Compliance check completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/kyc-aml/verify-document")
async def verify_kyc_document(request: DocumentVerificationRequest):
    """
    Verify KYC document
    
    Performs document verification including OCR and authenticity checks.
    """
    try:
        result = await qpc_client.verify_kyc_document(
            request=request.request,
            customer=request.customer
        )
        return {
            "success": True,
            "data": result,
            "message": "Document verification completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/kyc-aml/generate-report")
async def generate_compliance_report(request: ComplianceReportRequest):
    """
    Generate compliance report for specified date range
    
    Provides detailed compliance statistics, flags, and assessment summaries.
    """
    try:
        result = await qpc_client.generate_compliance_report(
            start_date=request.start_date,
            end_date=request.end_date
        )
        return {
            "success": True,
            "data": result,
            "message": "Compliance report generated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/kyc-aml/summary")
async def get_compliance_summary():
    """
    Get overall compliance summary
    
    Returns current compliance status, trends, and alerts.
    """
    try:
        result = await qpc_client.get_compliance_summary()
        return {
            "success": True,
            "data": result,
            "message": "Compliance summary retrieved"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== Health Check ==========

@router.get("/health")
async def qpc_health_check():
    """Check health of QPC microservice"""
    try:
        result = await qpc_client.health_check()
        return {
            "success": True,
            "data": result,
            "message": "QPC service health check complete"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
