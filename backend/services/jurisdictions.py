"""
Jurisdictional Profiles Database for RWA Tokenization
=====================================================

This module provides jurisdiction-specific regulatory profiles for 
Real World Asset (RWA) tokenization analysis.

Each profile includes:
- Regulatory maturity and framework
- KYC/AML requirements
- Token classification rules
- Risk factors
- Estimated costs and timelines
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum


class RegulatoryMaturity(Enum):
    """Level of regulatory development for digital assets"""
    NASCENT = "nascent"           # No specific framework
    EMERGING = "emerging"         # Framework in development
    PARTIAL = "partial"           # Some regulations exist
    ADVANCED = "advanced"         # Comprehensive framework
    RESTRICTIVE = "restrictive"   # Heavily regulated/restricted


class RiskLevel(Enum):
    """Risk classification levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class JurisdictionalProfile:
    """Complete regulatory profile for a jurisdiction"""
    code: str
    name: str
    region: str
    regulatory_profile: Dict
    requirements: Dict
    risk_factors: Dict
    typical_structures: List[str]
    estimated_timeline_days: int
    estimated_legal_cost_usd: Dict
    notes: str


# =============================================================================
# JURISDICTIONAL PROFILES DATABASE
# =============================================================================

JURISDICTIONS: Dict[str, JurisdictionalProfile] = {
    
    # =========================================================================
    # LATIN AMERICA
    # =========================================================================
    
    "CL": JurisdictionalProfile(
        code="CL",
        name="Chile",
        region="LATAM",
        regulatory_profile={
            "maturity": RegulatoryMaturity.EMERGING.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "partial",
            "sandbox_available": True,
            "regulator": "CMF (Comisión para el Mercado Financiero)",
            "key_legislation": "Ley Fintech (2023)",
            "crypto_legal_status": "legal_regulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": False,
            "max_retail_investment_usd": None,
            "prospectus_required": "depends_on_amount",
            "prospectus_threshold_usd": 1000000,
            "tax_treatment": "capital_gains_taxable",
            "capital_gains_rate": "10-40%",
            "reporting_requirements": ["CMF registration", "AML reporting"],
            "custody_requirements": "licensed_custodian_recommended"
        },
        risk_factors={
            "regulatory_risk": RiskLevel.MEDIUM.value,
            "legal_clarity": RiskLevel.MEDIUM.value,
            "enforcement_risk": RiskLevel.LOW.value,
            "political_stability": RiskLevel.LOW.value,
            "currency_risk": RiskLevel.MEDIUM.value
        },
        typical_structures=[
            "SPV (Sociedad por Acciones)",
            "Fideicomiso",
            "Tokenización directa con contrato"
        ],
        estimated_timeline_days=90,
        estimated_legal_cost_usd={
            "min": 15000,
            "max": 50000,
            "typical": 25000
        },
        notes="Chile has a progressive Fintech Law (2023) that provides a sandbox for tokenization. The CMF is relatively crypto-friendly. Real estate tokenization is gaining traction."
    ),
    
    "MX": JurisdictionalProfile(
        code="MX",
        name="México",
        region="LATAM",
        regulatory_profile={
            "maturity": RegulatoryMaturity.PARTIAL.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "partial",
            "sandbox_available": True,
            "regulator": "CNBV (Comisión Nacional Bancaria y de Valores)",
            "key_legislation": "Ley Fintech (2018)",
            "crypto_legal_status": "legal_regulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": False,
            "max_retail_investment_usd": 160000,  # ~3M MXN
            "prospectus_required": True,
            "tax_treatment": "capital_gains_taxable",
            "capital_gains_rate": "10%",
            "reporting_requirements": ["CNBV registration", "SAT reporting"]
        },
        risk_factors={
            "regulatory_risk": RiskLevel.MEDIUM.value,
            "legal_clarity": RiskLevel.MEDIUM.value,
            "enforcement_risk": RiskLevel.MEDIUM.value,
            "political_stability": RiskLevel.MEDIUM.value
        },
        typical_structures=[
            "SAPI (Sociedad Anónima Promotora de Inversión)",
            "Fideicomiso",
            "CKD (Certificado de Capital de Desarrollo)"
        ],
        estimated_timeline_days=120,
        estimated_legal_cost_usd={
            "min": 20000,
            "max": 80000,
            "typical": 40000
        },
        notes="Mexico's Fintech Law requires all crypto activities to go through licensed ITFs. Tokenization must comply with securities laws."
    ),
    
    "AR": JurisdictionalProfile(
        code="AR",
        name="Argentina",
        region="LATAM",
        regulatory_profile={
            "maturity": RegulatoryMaturity.NASCENT.value,
            "digital_securities_recognized": False,
            "tokenization_framework": "none",
            "sandbox_available": False,
            "regulator": "CNV (Comisión Nacional de Valores)",
            "crypto_legal_status": "legal_unregulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": "recommended",
            "prospectus_required": "depends_on_structure",
            "capital_controls": True,
            "tax_treatment": "uncertain"
        },
        risk_factors={
            "regulatory_risk": RiskLevel.HIGH.value,
            "legal_clarity": RiskLevel.LOW.value,
            "enforcement_risk": RiskLevel.LOW.value,
            "political_stability": RiskLevel.HIGH.value,
            "currency_risk": RiskLevel.CRITICAL.value
        },
        typical_structures=[
            "Contrato privado",
            "SPV offshore",
            "Estructura híbrida"
        ],
        estimated_timeline_days=60,
        estimated_legal_cost_usd={
            "min": 10000,
            "max": 40000,
            "typical": 20000
        },
        notes="Argentina has no specific tokenization framework. High economic volatility. Consider offshore structures or targeting accredited investors only."
    ),
    
    # =========================================================================
    # NORTH AMERICA
    # =========================================================================
    
    "US": JurisdictionalProfile(
        code="US",
        name="United States",
        region="NORTH_AMERICA",
        regulatory_profile={
            "maturity": RegulatoryMaturity.ADVANCED.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "full",
            "sandbox_available": False,
            "regulator": "SEC / FINRA / State regulators",
            "key_legislation": "Securities Act 1933, Howey Test",
            "crypto_legal_status": "legal_heavily_regulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": "depends_on_exemption",
            "exemptions_available": [
                "Reg D 506(b) - Accredited only, no advertising",
                "Reg D 506(c) - Accredited only, advertising allowed",
                "Reg A+ Tier 1 - Up to $20M, limited disclosure",
                "Reg A+ Tier 2 - Up to $75M, full disclosure",
                "Reg CF - Up to $5M, retail allowed"
            ],
            "prospectus_required": "depends_on_exemption",
            "broker_dealer_required": "usually",
            "transfer_agent_required": True,
            "tax_treatment": "capital_gains_taxable",
            "capital_gains_rate": "0-20%",
            "state_blue_sky_compliance": True
        },
        risk_factors={
            "regulatory_risk": RiskLevel.HIGH.value,
            "legal_clarity": RiskLevel.HIGH.value,
            "enforcement_risk": RiskLevel.CRITICAL.value,
            "litigation_risk": RiskLevel.HIGH.value
        },
        typical_structures=[
            "LLC with Reg D 506(c)",
            "Delaware Series LLC",
            "REIT tokenization",
            "SPV with broker-dealer"
        ],
        estimated_timeline_days=180,
        estimated_legal_cost_usd={
            "min": 50000,
            "max": 300000,
            "typical": 100000
        },
        notes="US has the most complex regulatory environment. Most tokens are securities under Howey Test. Use exemptions carefully. SEC enforcement is aggressive."
    ),
    
    # =========================================================================
    # EUROPE
    # =========================================================================
    
    "ES": JurisdictionalProfile(
        code="ES",
        name="España",
        region="EU",
        regulatory_profile={
            "maturity": RegulatoryMaturity.ADVANCED.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "MiCA + National",
            "sandbox_available": True,
            "regulator": "CNMV (Comisión Nacional del Mercado de Valores)",
            "key_legislation": "MiCA (2024), Ley del Mercado de Valores",
            "crypto_legal_status": "legal_regulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": False,
            "prospectus_required": "depends_on_amount",
            "prospectus_threshold_eur": 8000000,
            "mica_compliance": True,
            "tax_treatment": "capital_gains_taxable",
            "capital_gains_rate": "19-26%"
        },
        risk_factors={
            "regulatory_risk": RiskLevel.LOW.value,
            "legal_clarity": RiskLevel.HIGH.value,
            "enforcement_risk": RiskLevel.MEDIUM.value
        },
        typical_structures=[
            "SL (Sociedad Limitada)",
            "SA con tokenización",
            "SOCIMI (REIT español)",
            "Sandbox CNMV"
        ],
        estimated_timeline_days=120,
        estimated_legal_cost_usd={
            "min": 30000,
            "max": 100000,
            "typical": 50000
        },
        notes="Spain has a regulatory sandbox and is MiCA-compliant. Good environment for tokenization. SOCIMI structure is ideal for real estate."
    ),
    
    "CH": JurisdictionalProfile(
        code="CH",
        name="Suiza",
        region="EUROPE",
        regulatory_profile={
            "maturity": RegulatoryMaturity.ADVANCED.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "full",
            "sandbox_available": True,
            "regulator": "FINMA",
            "key_legislation": "DLT Act (2021)",
            "crypto_legal_status": "legal_crypto_friendly"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": False,
            "prospectus_required": "depends_on_amount",
            "finma_registration": "depends_on_classification"
        },
        risk_factors={
            "regulatory_risk": RiskLevel.LOW.value,
            "legal_clarity": RiskLevel.HIGH.value,
            "enforcement_risk": RiskLevel.LOW.value
        },
        typical_structures=[
            "AG (Aktiengesellschaft)",
            "Tokenized shares",
            "Zug Crypto Valley structures"
        ],
        estimated_timeline_days=90,
        estimated_legal_cost_usd={
            "min": 40000,
            "max": 150000,
            "typical": 70000
        },
        notes="Switzerland (Crypto Valley) is the most crypto-friendly jurisdiction in Europe. DLT Act provides clear framework for tokenization."
    ),
    
    # =========================================================================
    # ASIA
    # =========================================================================
    
    "SG": JurisdictionalProfile(
        code="SG",
        name="Singapur",
        region="ASIA",
        regulatory_profile={
            "maturity": RegulatoryMaturity.ADVANCED.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "full",
            "sandbox_available": True,
            "regulator": "MAS (Monetary Authority of Singapore)",
            "key_legislation": "Securities and Futures Act, Payment Services Act",
            "crypto_legal_status": "legal_regulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "accredited_investor_only": "depends_on_offering",
            "mas_license_required": "depends_on_activity"
        },
        risk_factors={
            "regulatory_risk": RiskLevel.LOW.value,
            "legal_clarity": RiskLevel.HIGH.value,
            "enforcement_risk": RiskLevel.MEDIUM.value
        },
        typical_structures=[
            "Private Limited Company",
            "VCC (Variable Capital Company)",
            "Exempt offering"
        ],
        estimated_timeline_days=120,
        estimated_legal_cost_usd={
            "min": 50000,
            "max": 200000,
            "typical": 80000
        },
        notes="Singapore is Asia's leading hub for tokenization. MAS is progressive but requires proper licensing. VCC structure is ideal for funds."
    ),
    
    "AE": JurisdictionalProfile(
        code="AE",
        name="Emiratos Árabes Unidos",
        region="MIDDLE_EAST",
        regulatory_profile={
            "maturity": RegulatoryMaturity.ADVANCED.value,
            "digital_securities_recognized": True,
            "tokenization_framework": "full",
            "sandbox_available": True,
            "regulator": "VARA (Dubai), ADGM, DIFC",
            "crypto_legal_status": "legal_regulated"
        },
        requirements={
            "kyc_required": True,
            "aml_required": True,
            "vara_license": "required_in_dubai",
            "free_zone_options": True
        },
        risk_factors={
            "regulatory_risk": RiskLevel.LOW.value,
            "legal_clarity": RiskLevel.HIGH.value,
            "enforcement_risk": RiskLevel.LOW.value
        },
        typical_structures=[
            "DIFC Company",
            "ADGM Company",
            "Dubai Free Zone"
        ],
        estimated_timeline_days=90,
        estimated_legal_cost_usd={
            "min": 30000,
            "max": 120000,
            "typical": 60000
        },
        notes="UAE is aggressively pursuing crypto/tokenization. VARA provides clear framework. Tax-free environment is attractive."
    )
}


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_jurisdiction(code: str) -> Optional[JurisdictionalProfile]:
    """Get jurisdiction profile by country code"""
    return JURISDICTIONS.get(code.upper())


def get_all_jurisdictions() -> List[Dict]:
    """Get all available jurisdictions"""
    return [
        {
            "code": j.code,
            "name": j.name,
            "region": j.region,
            "maturity": j.regulatory_profile["maturity"],
            "risk_level": j.risk_factors.get("regulatory_risk", "medium")
        }
        for j in JURISDICTIONS.values()
    ]


def get_jurisdictions_by_region(region: str) -> List[JurisdictionalProfile]:
    """Get all jurisdictions in a region"""
    return [j for j in JURISDICTIONS.values() if j.region == region]


def get_jurisdiction_risk_score(code: str) -> int:
    """Calculate overall risk score for a jurisdiction (0-100)"""
    j = get_jurisdiction(code)
    if not j:
        return 50  # Default medium risk
    
    risk_weights = {
        RiskLevel.LOW.value: 20,
        RiskLevel.MEDIUM.value: 50,
        RiskLevel.HIGH.value: 75,
        RiskLevel.CRITICAL.value: 95
    }
    
    scores = [
        risk_weights.get(j.risk_factors.get("regulatory_risk"), 50),
        risk_weights.get(j.risk_factors.get("legal_clarity"), 50),
        risk_weights.get(j.risk_factors.get("enforcement_risk"), 50)
    ]
    
    return int(sum(scores) / len(scores))


def get_jurisdiction_summary(code: str) -> Dict:
    """Get a summary for display"""
    j = get_jurisdiction(code)
    if not j:
        return {"error": "Jurisdiction not found"}
    
    return {
        "code": j.code,
        "name": j.name,
        "region": j.region,
        "regulatory_maturity": j.regulatory_profile["maturity"],
        "tokenization_framework": j.regulatory_profile.get("tokenization_framework"),
        "regulator": j.regulatory_profile.get("regulator"),
        "kyc_required": j.requirements.get("kyc_required"),
        "accredited_only": j.requirements.get("accredited_investor_only"),
        "estimated_timeline_days": j.estimated_timeline_days,
        "estimated_cost_usd": j.estimated_legal_cost_usd,
        "risk_score": get_jurisdiction_risk_score(code),
        "typical_structures": j.typical_structures,
        "notes": j.notes
    }


# =============================================================================
# REGIONS
# =============================================================================

REGIONS = {
    "LATAM": {
        "name": "Latin America",
        "jurisdictions": ["CL", "MX", "AR", "BR", "CO"],
        "general_notes": "Emerging market with mixed regulatory clarity. Chile and Mexico are most advanced."
    },
    "NORTH_AMERICA": {
        "name": "North America", 
        "jurisdictions": ["US", "CA"],
        "general_notes": "Highly regulated. US requires careful exemption selection."
    },
    "EU": {
        "name": "European Union",
        "jurisdictions": ["ES", "DE", "FR", "PT"],
        "general_notes": "MiCA provides unified framework. Good legal clarity."
    },
    "EUROPE": {
        "name": "Europe (Non-EU)",
        "jurisdictions": ["CH", "UK"],
        "general_notes": "Switzerland is most crypto-friendly."
    },
    "ASIA": {
        "name": "Asia Pacific",
        "jurisdictions": ["SG", "HK", "JP"],
        "general_notes": "Singapore is the regional hub. Japan is restrictive."
    },
    "MIDDLE_EAST": {
        "name": "Middle East",
        "jurisdictions": ["AE", "BH"],
        "general_notes": "UAE is aggressively pursuing tokenization. Tax advantages."
    }
}
