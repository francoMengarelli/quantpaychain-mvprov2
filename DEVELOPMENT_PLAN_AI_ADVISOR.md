# PLAN DE DESARROLLO: AI ADVISOR SERVICE
# Objetivo: Motor de Análisis Jurisdiccional para RWA

## 1. ESTRUCTURA DE DATOS JURISDICCIONAL

### 1.1 Input del Usuario (Nuevo)
```json
{
  "asset": {
    "type": "real_estate",
    "value_usd": 500000,
    "location": "Santiago, Chile",
    "description": "Departamento comercial"
  },
  "jurisdiction": {
    "country": "CL",
    "country_name": "Chile",
    "region": "LATAM",
    "specific_location": "Santiago"
  },
  "tokenization_intent": {
    "target_investors": "accredited",  // retail, accredited, institutional
    "offering_type": "private",        // public, private, exempt
    "target_chains": ["ethereum", "polygon"]
  }
}
```

### 1.2 Perfiles Jurisdiccionales (Base de Datos)
```json
{
  "CL": {
    "name": "Chile",
    "region": "LATAM",
    "regulatory_profile": {
      "maturity": "emerging",
      "digital_securities_recognized": true,
      "tokenization_framework": "partial",
      "sandbox_available": true,
      "regulator": "CMF (Comisión para el Mercado Financiero)"
    },
    "requirements": {
      "kyc_required": true,
      "aml_required": true,
      "accredited_investor_only": false,
      "max_retail_investment": null,
      "prospectus_required": "depends_on_amount",
      "tax_implications": "capital_gains_20%"
    },
    "risk_factors": {
      "regulatory_risk": "medium",
      "legal_clarity": "medium",
      "enforcement_risk": "low"
    },
    "typical_structure": "SPV or Direct Tokenization",
    "estimated_timeline_days": 90,
    "estimated_legal_cost_usd": {
      "min": 15000,
      "max": 50000
    }
  },
  "US": {
    "name": "United States",
    "region": "NORTH_AMERICA",
    "regulatory_profile": {
      "maturity": "advanced",
      "digital_securities_recognized": true,
      "tokenization_framework": "full",
      "sandbox_available": false,
      "regulator": "SEC / FINRA"
    },
    "requirements": {
      "kyc_required": true,
      "aml_required": true,
      "accredited_investor_only": "depends_on_exemption",
      "exemptions_available": ["Reg D 506(b)", "Reg D 506(c)", "Reg A+", "Reg CF"],
      "prospectus_required": "depends_on_exemption"
    },
    "risk_factors": {
      "regulatory_risk": "high",
      "legal_clarity": "high",
      "enforcement_risk": "high"
    }
  },
  "ES": {
    "name": "España",
    "region": "EU",
    "regulatory_profile": {
      "maturity": "advanced",
      "digital_securities_recognized": true,
      "tokenization_framework": "MiCA",
      "sandbox_available": true,
      "regulator": "CNMV"
    }
  }
}
```

## 2. ESTRUCTURA DEL INFORME MEJORADO

### Executive Summary
- Viabilidad general
- Risk Score (0-100)
- Recomendación (PROCEED / CAUTION / NOT_RECOMMENDED)

### Jurisdictional & Regulatory Context (NUEVO)
- País analizado
- Perfil regulatorio (tabla)
- Marco legal aplicable
- Requisitos específicos
- Timeline estimado

### Asset Classification & Legal Nature
- Tipo de activo
- Clasificación legal (utility vs security)
- Estructura recomendada (SPV, fideicomiso, etc.)

### Compliance & Risk Analysis
- Risk Score por categoría
- Flags detectados
- KYC/AML requirements

### Implementation Roadmap
- Pasos específicos por jurisdicción
- Timeline
- Costos estimados

### Final Recommendation & Disclaimer

## 3. IMPLEMENTACIÓN TÉCNICA

### 3.1 Nuevo Endpoint
POST /api/ai/jurisdictional-analysis

### 3.2 Archivos a Modificar/Crear
- /backend/services/jurisdictions.py (NUEVO)
- /backend/services/ai_advisor_service.py (MODIFICAR)
- /frontend/components/ai-advisor-panel.tsx (MODIFICAR)

### 3.3 Prompt Mejorado para GPT
"""
You are an expert legal and compliance advisor specializing in Real World Asset (RWA) tokenization.

CONTEXT:
- Asset: {asset_details}
- Jurisdiction: {jurisdiction_profile}
- Intent: {tokenization_intent}

ANALYSIS REQUIREMENTS:
1. Evaluate tokenization viability under {country} regulations
2. Identify specific legal requirements
3. Classify the token (utility vs security)
4. Recommend optimal structure
5. Estimate timeline and costs
6. Flag any regulatory risks

OUTPUT FORMAT:
{structured_json_format}
"""
