import os
import json
from typing import Dict, Optional
from emergentintegrations.llm.chat import LlmChat, UserMessage

class AIAdvisorService:
    """
    AI Legal Advisor Service - ASESOR LEGAL PROFESIONAL REAL
    Proporciona análisis legal detallado, específico por jurisdicción y accionable
    """
    
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            print("⚠️ WARNING: No API key found (EMERGENT_LLM_KEY or OPENAI_API_KEY)")
            self.api_key = None
        else:
            key_type = "EMERGENT_LLM_KEY" if os.environ.get("EMERGENT_LLM_KEY") else "OPENAI_API_KEY"
            print(f"✅ Using {key_type} for AI Advisor (length: {len(self.api_key)})")
        
        self.provider = "openai"
        self.model = "gpt-4o-mini"
        
        # SYSTEM MESSAGE MEJORADO - Asesor Legal Profesional
        self.system_message = """Eres un ASESOR LEGAL EXPERTO especializado en:
- Tokenización de activos del mundo real (RWA/Real World Assets)
- Derecho internacional de valores y securities
- Regulación blockchain y criptoactivos
- Cumplimiento normativo multi-jurisdiccional
- Estructuración legal de SPVs y vehículos de inversión
- KYC/AML y compliance financiero

Tu misión es proporcionar ANÁLISIS LEGAL ESPECÍFICO, DETALLADO Y ACCIONABLE que un verdadero abogado daría.

Principios clave:
1. SÉ ESPECÍFICO: Menciona leyes, regulaciones, y frameworks específicos (ej: "Securities Act 1933 Section 5", "MiCA Regulation EU", "Ley del Mercado de Valores")
2. SÉ PRÁCTICO: Da pasos concretos numerados que el usuario puede seguir AHORA
3. SÉ CLARO SOBRE RIESGOS: Identifica riesgos legales reales y cómo mitigarlos
4. SÉ JURISDICCIONAL: Adapta el consejo a la ubicación del activo
5. NO SEAS GENÉRICO: Evita respuestas vagas como \"consulta un abogado\" sin dar contexto

Responde siempre en formato JSON estructurado con análisis legal profundo."""
    
    async def analyze_asset(self, asset_type: str, description: str, value_usd: float, location: str, user_context: Optional[Dict] = None):
        """
        Análisis legal OPTIMIZADO con guía práctica de tokenización
        
        Cambios:
        - Análisis más conciso (10-15s vs 30-60s)
        - Enfoque en pasos accionables
        - Guía práctica de tokenización paso a paso
        """
        if not self.api_key:
            print("⚠️ No API key available - using fallback")
            return self._get_fallback_analysis(asset_type, description, value_usd, location)
        
        try:
            print(f"🔑 Using {self.provider} {self.model} for LEGAL ANALYSIS")
            
            # PROMPT MEJORADO - Análisis Legal Profundo
            user_prompt = f"""
Actúa como un abogado senior especializado en tokenización de activos. Analiza este activo:

**ACTIVO A TOKENIZAR:**
- Tipo: {asset_type}
- Descripción: {description}
- Valor: ${value_usd:,} USD
- Jurisdicción: {location}
- Contexto Usuario: {user_context or 'Inversionista individual'}

**TU TAREA:**
Proporciona un análisis legal COMPLETO Y PROFESIONAL como lo haría un abogado experto en securities y blockchain.

Responde en JSON con esta estructura exacta:

{{
    "executive_summary": {{
        "viability_score": "1-10 con justificación legal",
        "primary_legal_classification": "Security/Utility/Commodity token según regulación",
        "key_insight": "Insight legal más importante en 1-2 líneas",
        "estimated_legal_costs": "Rango de costos legales en USD"
    }},
    
    "legal_analysis": {{
        "securities_classification": {{
            "is_security": "Yes/No con análisis Howey Test (USA) o equivalente",
            "applicable_framework": "Securities Act 1933/MiCA/Ley de Mercado de Valores, etc.",
            "exemptions_available": ["Reg D 506(c)", "Reg S", "Reg A+", etc.],
            "registration_requirements": "Específicos según clasificación"
        }},
        
        "jurisdictional_requirements": {{
            "primary_jurisdiction": "{location}",
            "applicable_laws": ["Lista de 4-6 leyes/regulaciones ESPECÍFICAS con números de artículo"],
            "regulatory_bodies": ["SEC/CNMV/FCA/BaFin según jurisdicción"],
            "cross_border_considerations": "Si aplica inversión internacional"
        }},
        
        "compliance_roadmap": {{
            "phase_1_immediate": [
                "1. Acción específica con marco legal",
                "2. Documento específico a preparar",
                "3. Registro o filing específico"
            ],
            "phase_2_structuring": [
                "1. Estructura legal recomendada (LLC/SPV/Trust)",
                "2. Documentos legales requeridos",
                "3. Acuerdos de custodia y tokenización"
            ],
            "phase_3_ongoing": [
                "1. Obligaciones de reporting (10-K, 10-Q, etc.)",
                "2. Compliance continuo (AML/CFT monitoring)",
                "3. Auditorías requeridas (frecuencia específica)"
            ]
        }}
    }},
    
    "risk_mitigation": {{
        "legal_risks": [
            {{
                "risk": "Riesgo legal específico",
                "severity": "Critical/High/Medium/Low",
                "mitigation": "Paso concreto de mitigación con referencia legal"
            }}
        ],
        "regulatory_risks": [
            {{
                "risk": "Riesgo regulatorio específico",
                "probability": "High/Medium/Low",
                "action_plan": "Plan de acción concreto"
            }}
        ]
    }},
    
    "kyc_aml_requirements": {{
        "investor_verification_level": "Basic/Enhanced/Full según valor y jurisdicción",
        "required_documents": ["Lista específica de documentos"],
        "ongoing_monitoring": "Frecuencia y tipo de monitoreo",
        "sanctions_screening": "OFAC/EU/UN listas específicas a verificar"
    }},
    
    "tokenization_structure": {{
        "recommended_token_type": "Security/Asset-backed con justificación legal",
        "token_rights": ["Derechos legales específicos del token"],
        "ownership_model": "Beneficial ownership/Direct ownership/Fractional",
        "smart_contract_considerations": "Requerimientos legales del contrato",
        "custody_requirements": "Requisitos de custodia según regulación"
    }},
    
    "tax_implications": {{
        "primary_tax_treatment": "Capital gains/Income/Property según jurisdicción",
        "withholding_requirements": "Específicos si aplica",
        "reporting_obligations": ["Form 1099/IRS filings/equivalente según país"],
        "tax_optimization_notes": "Consideraciones de optimización legal"
    }},
    
    "recommended_advisors": {{
        "legal_counsel": "Tipo de firma recomendada (securities/blockchain specialist)",
        "regulatory_consultant": "Si necesita consultant especializado",
        "tax_advisor": "Especialización recomendada",
        "estimated_professional_fees": "Rango de fees totales"
    }},
    
    "timeline_estimate": {{
        "minimum_timeline": "X meses con justificación",
        "realistic_timeline": "X-Y meses",
        "critical_path_items": ["Items que determinan el timeline"],
        "fast_track_options": "Si hay opciones para acelerar legalmente"
    }},
    
    "ai_legal_insights": {{
        "precedent_cases": "Casos similares o precedentes relevantes",
        "market_practice": "Práctica común del mercado para este tipo de activo",
        "emerging_regulations": "Regulaciones en desarrollo que pueden afectar",
        "strategic_recommendation": "Recomendación estratégica principal del asesor"
    }}
}}

**IMPORTANTE:**
- SÉ MUY ESPECÍFICO con números de leyes, artículos, secciones
- Menciona precedentes o casos relevantes si los hay
- Da rangos de costos y timelines REALISTAS
- Identifica TODOS los riesgos legales principales
- Proporciona pasos ACCIONABLES que el usuario puede seguir HOY
"""

            # Crear chat usando Emergent LLM integration
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"legal-advisor-{asset_type}-{hash(description)}",
                system_message=self.system_message
            ).with_model(self.provider, self.model)
            
            # Enviar mensaje
            user_message = UserMessage(text=user_prompt)
            response = await chat.send_message(user_message)
            
            print(f"📥 AI Legal Analysis received (length: {len(response) if response else 0})")
            
            if not response:
                print("⚠️ Empty response from AI")
                return self._get_fallback_analysis(asset_type, description, value_usd, location)
            
            # Limpiar markdown
            cleaned_response = response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.startswith("```"):
                cleaned_response = cleaned_response[3:]
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]
            cleaned_response = cleaned_response.strip()
            
            ai_analysis = json.loads(cleaned_response)
            
            # Añadir metadata
            ai_analysis["metadata"] = {
                "ai_powered": True,
                "model": self.model,
                "analysis_type": "professional_legal",
                "provider": self.provider,
                "disclaimer": "Este análisis es informativo. Consulta con abogado licenciado para decisiones legales finales."
            }
            
            print(f"✅ Professional Legal Analysis completed")
            return ai_analysis
            
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response preview: {cleaned_response[:500] if 'cleaned_response' in locals() else 'N/A'}")
            return self._get_fallback_analysis(asset_type, description, value_usd, location)
        except Exception as e:
            print(f"AI Advisor Error: {e}")
            return self._get_fallback_analysis(asset_type, description, value_usd, location)
    
    def _get_fallback_analysis(self, asset_type: str, description: str, value_usd: float, location: str) -> Dict:
        """
        Análisis de respaldo MEJORADO cuando falla la IA
        """
        return {
            "executive_summary": {
                "viability_score": "7/10 - Análisis básico disponible, se recomienda consulta legal completa",
                "primary_legal_classification": "Requiere análisis detallado para determinar si es Security Token",
                "key_insight": f"Activo tipo {asset_type} valorado en ${value_usd:,} requiere estructuración legal profesional",
                "estimated_legal_costs": "$15,000 - $50,000 USD dependiendo de jurisdicción y complejidad"
            },
            "legal_analysis": {
                "securities_classification": {
                    "is_security": "Requiere Howey Test analysis - consulta abogado securities",
                    "applicable_framework": f"Securities Act 1933 (USA), MiCA (EU), regulación local de {location}",
                    "exemptions_available": ["Reg D 506(b)", "Reg D 506(c)", "Reg S (offshore)", "Reg A+"],
                    "registration_requirements": "Depende de clasificación final y estrategia de distribución"
                },
                "jurisdictional_requirements": {
                    "primary_jurisdiction": location,
                    "applicable_laws": [
                        "📋 Securities Act local",
                        "💰 Anti-Money Laundering Act",
                        "🔐 Data Protection Regulation (GDPR/equivalente)",
                        "⚖️ Contract Law y Property Rights",
                        "🏦 Financial Services Regulation",
                        "🌐 Cross-border Investment Rules"
                    ],
                    "regulatory_bodies": ["SEC/CNMV/FCA", "Central Bank", "Tax Authority"],
                    "cross_border_considerations": "Requiere análisis si habrá inversores internacionales"
                },
                "compliance_roadmap": {
                    "phase_1_immediate": [
                        "1️⃣ Retener abogado especializado en securities y blockchain",
                        "2️⃣ Obtener valuación profesional certificada del activo",
                        "3️⃣ Determinar clasificación legal del token (security/utility)",
                        "4️⃣ Preparar documentación legal del activo (título, appraisals)"
                    ],
                    "phase_2_structuring": [
                        "1️⃣ Estructurar SPV o vehículo legal apropiado",
                        "2️⃣ Drafting: PPM, Subscription Agreement, Operating Agreement",
                        "3️⃣ Establecer custodia y segregación de activos",
                        "4️⃣ Implementar programa KYC/AML completo"
                    ],
                    "phase_3_ongoing": [
                        "1️⃣ Filing Form D (USA) o equivalente en 15 días post-first sale",
                        "2️⃣ Reporting periódico a inversores (trimestral/anual)",
                        "3️⃣ Auditoría financiera anual independiente",
                        "4️⃣ Monitoreo continuo AML y actualización KYC"
                    ]
                }
            },
            "risk_mitigation": {
                "legal_risks": [
                    {
                        "risk": "Clasificación como security no registrada",
                        "severity": "Critical",
                        "mitigation": "Usar exemption registration (Reg D/S/A+) o registrar con SEC/equivalente"
                    },
                    {
                        "risk": "Incumplimiento AML/KYC",
                        "severity": "High",
                        "mitigation": "Implementar programa KYC robusto con verificación de identidad de terceros"
                    },
                    {
                        "risk": "Violación de leyes de oferta pública",
                        "severity": "High",
                        "mitigation": "Restringir marketing y usar safe harbors regulatorios"
                    }
                ],
                "regulatory_risks": [
                    {
                        "risk": "Cambios regulatorios en blockchain/crypto",
                        "probability": "Medium",
                        "action_plan": "Monitorear propuestas regulatorias y mantener flexibilidad en estructura"
                    }
                ]
            },
            "kyc_aml_requirements": {
                "investor_verification_level": "Enhanced - requerido para security tokens",
                "required_documents": [
                    "Government-issued ID (passport/driver's license)",
                    "Proof of address (utility bill <3 months)",
                    "Accredited investor verification (if Reg D 506(c))",
                    "Source of funds documentation",
                    "Beneficial ownership declaration"
                ],
                "ongoing_monitoring": "Transaction monitoring continuo + re-verification cada 2 años",
                "sanctions_screening": "OFAC, EU Sanctions List, UN Consolidated List - verificación pre-investment"
            },
            "tokenization_structure": {
                "recommended_token_type": "Security Token (asset-backed) sujeto a securities law",
                "token_rights": [
                    "Ownership rights proporcionales al activo subyacente",
                    "Derecho a dividendos/distributions si genera ingresos",
                    "Derechos de voto según estructura (si aplica)",
                    "Exit rights y liquidation preferences"
                ],
                "ownership_model": "Beneficial ownership via SPV - tokens representan equity/debt del SPV",
                "smart_contract_considerations": "Incluir transfer restrictions, accredited investor check, whitelist",
                "custody_requirements": "Custodia calificada para activos de alto valor (>$1M)"
            },
            "tax_implications": {
                "primary_tax_treatment": "Capital gains para inversores, income si hay distributions",
                "withholding_requirements": "30% withholding para inversores extranjeros (USA) o según tratado",
                "reporting_obligations": [
                    "Form 1099-DIV para distributions (USA)",
                    "Form 1099-B para sales (USA)",
                    "Equivalent forms para otras jurisdicciones"
                ],
                "tax_optimization_notes": "Considerar estructura en jurisdicción tax-efficient (Delaware, Cayman, etc.)"
            },
            "recommended_advisors": {
                "legal_counsel": "Securities attorney con experiencia en tokenization (buscar en blockchain legal networks)",
                "regulatory_consultant": "Si multi-jurisdictional, considerar consultant regulatorio especializado",
                "tax_advisor": "CPA/Tax attorney con experiencia en digital assets y international tax",
                "estimated_professional_fees": "$30,000 - $150,000 total (legal $15-75k, tax $5-20k, regulatory $10-55k)"
            },
            "timeline_estimate": {
                "minimum_timeline": "3-4 meses (estructuración agresiva con todos recursos)",
                "realistic_timeline": "6-9 meses para tokenización completa y compliant",
                "critical_path_items": [
                    "Legal structure y drafting (2-3 meses)",
                    "Regulatory filings y approvals (1-2 meses)",
                    "KYC/AML platform setup (1 mes)",
                    "Smart contract audit (3-4 semanas)"
                ],
                "fast_track_options": "Usar tokenization platform existente con legal/compliance incluido (reduce timeline 50%)"
            },
            "ai_legal_insights": {
                "precedent_cases": "tZERO (securities), RealT (real estate), Blockchain Capital (VC fund) - casos exitosos de tokenización",
                "market_practice": f"Para {asset_type}, mercado típicamente usa Reg D 506(c) + accredited investors only",
                "emerging_regulations": "MiCA (EU 2024), stablecoin bills (USA), DLT pilot regime (varios países) en desarrollo",
                "strategic_recommendation": "⚡ PRIORIDAD: Contratar securities attorney ANTES de cualquier marketing o token sale. Compliance desde día 1 es crítico."
            },
            "metadata": {
                "ai_powered": False,
                "analysis_type": "fallback_professional",
                "disclaimer": "Este análisis es informativo y generalizado. DEBES consultar con abogado licenciado antes de proceder con tokenización."
            }
        }
    
    def _get_potential_by_type(self, asset_type: str) -> str:
        potential_map = {
            "real_estate": "Alto",
            "art": "Medio-Alto",
            "commodity": "Medio",
            "bond": "Bajo-Medio",
            "equity": "Alto"
        }
        return potential_map.get(asset_type, "Medio")
    
    def _get_risk_by_type(self, asset_type: str) -> str:
        risk_map = {
            "bond": "Bajo",
            "real_estate": "Medio",
            "commodity": "Medio",
            "art": "Medio-Alto",
            "equity": "Alto"
        }
        return risk_map.get(asset_type, "Medio")
