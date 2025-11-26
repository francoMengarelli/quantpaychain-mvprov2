import os
from typing import Dict, Optional
import json

class AIAdvisorService:
    """
    AI Legal Advisor Service
    - Guía legal para creación de assets
    - Sugerencias de uso (guardar, invertir, vender)
    - Gamificación y tips interactivos
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("EMERGENT_LLM_KEY")
        self.model = "gpt-4"
    
    async def analyze_asset(self, asset_type: str, description: str, value_usd: float, location: str, user_context: Optional[Dict] = None):
        """
        Analiza el asset y proporciona advice legal y estratégico
        """
        
        # TODO: Integrar con OpenAI API real
        # Por ahora, retorno estructura de ejemplo
        
        asset_guides = {
            "real_estate": {
                "legal_requirements": [
                    "🏛️ Verificar título de propiedad",
                    "📋 Avalúo profesional reciente",
                    "⚖️ Verificar zonificación y permisos",
                    "🔍 Due diligence completo"
                ],
                "tokenization_strategy": "Fraccionamiento ideal: 1,000-10,000 tokens para liquidez óptima",
                "investment_potential": "Alto",
                "recommendations": [
                    "💡 Considera alquilar para generar ingresos pasivos",
                    "📈 Revalorización promedio: 5-8% anual",
                    "🎯 Ideal para diversificar portafolio"
                ]
            },
            "art": {
                "legal_requirements": [
                    "🎨 Certificado de autenticidad",
                    "📜 Provenance documentation",
                    "🔐 Seguro de arte",
                    "🏛️ Valuación por experto certificado"
                ],
                "tokenization_strategy": "Fraccionamiento: 100-1,000 tokens para colección premium",
                "investment_potential": "Medio-Alto",
                "recommendations": [
                    "🖼️ Arte contemporáneo tiene mejor liquidez",
                    "💎 Considerar artista emergente vs establecido",
                    "🔄 Rotación de colección cada 3-5 años"
                ]
            },
            "commodity": {
                "legal_requirements": [
                    "📦 Certificado de origen",
                    "⚖️ Cumplimiento con regulaciones comerciales",
                    "🏭 Certificaciones de calidad (ISO, etc.)",
                    "📊 Contratos de almacenamiento"
                ],
                "tokenization_strategy": "Tokens representan unidades físicas (kg, barriles, etc.)",
                "investment_potential": "Medio",
                "recommendations": [
                    "📈 Correlaciona con inflación",
                    "🌍 Exposición a mercados globales",
                    "⏰ Timing importa: seguir ciclos de commodities"
                ]
            },
            "bond": {
                "legal_requirements": [
                    "📋 Prospecto de emisión",
                    "⚖️ Cumplimiento con regulaciones de valores",
                    "💰 Rating crediticio",
                    "📄 Términos y condiciones claros"
                ],
                "tokenization_strategy": "Tokens = cupones o participación en bono",
                "investment_potential": "Bajo-Medio (más seguro)",
                "recommendations": [
                    "🛡️ Ideal para perfil conservador",
                    "💵 Ingresos predecibles",
                    "📊 Diversifica con bonos de diferentes plazos"
                ]
            },
            "equity": {
                "legal_requirements": [
                    "🏢 Documentación corporativa completa",
                    "📊 Estados financieros auditados",
                    "⚖️ Cumplimiento con leyes de valores",
                    "👥 Acuerdos de accionistas"
                ],
                "tokenization_strategy": "Tokens = Equity stake / Derechos de voto",
                "investment_potential": "Alto (mayor riesgo)",
                "recommendations": [
                    "🚀 Potencial de alto retorno",
                    "⚠️ Mayor volatilidad",
                    "🔍 Due diligence exhaustivo necesario"
                ]
            }
        }
        
        guide = asset_guides.get(asset_type, asset_guides["real_estate"])
        
        return {
            "asset_analysis": {
                "type": asset_type,
                "value_assessment": self._assess_value(value_usd),
                "location_analysis": self._analyze_location(location)
            },
            "legal_guidance": {
                "requirements": guide["legal_requirements"],
                "compliance_level": "Medium",
                "next_steps": [
                    "1️⃣ Reunir documentación legal",
                    "2️⃣ Obtener valuación profesional",
                    "3️⃣ Verificar cumplimiento regulatorio",
                    "4️⃣ Configurar estructura de tokens"
                ]
            },
            "tokenization_strategy": guide["tokenization_strategy"],
            "investment_recommendations": {
                "potential": guide["investment_potential"],
                "strategies": guide["recommendations"],
                "risk_level": self._calculate_risk(asset_type, value_usd)
            },
            "ai_insights": {
                "market_trends": f"📊 {asset_type.title()} muestra tendencia positiva en {location}",
                "timing": "⏰ Momento favorable para tokenizar",
                "gamification_tip": "🎮 ¡Completa tu primer asset para desbloquear badge 'Tokenizador Novato'!"
            }
        }
    
    async def get_gamification_tips(self, asset_id: str):
        """
        Tips gamificados para mantener engagement
        """
        return {
            "achievements": [
                {
                    "id": "first_asset",
                    "name": "🌟 Primer Asset",
                    "description": "Tokeniza tu primer activo",
                    "unlocked": True,
                    "reward": "+100 XP"
                },
                {
                    "id": "diversifier",
                    "name": "🎯 Diversificador",
                    "description": "Crea assets en 3 categorías diferentes",
                    "unlocked": False,
                    "progress": "1/3"
                },
                {
                    "id": "high_value",
                    "name": "💎 Alto Valor",
                    "description": "Tokeniza un asset valorado en $1M+",
                    "unlocked": False,
                    "reward": "+500 XP"
                }
            ],
            "next_actions": [
                {
                    "action": "💰 Vende tu primer token",
                    "xp": 200,
                    "difficulty": "Medio"
                },
                {
                    "action": "📈 Alcanza $10k en valor total",
                    "xp": 300,
                    "difficulty": "Alto"
                }
            ],
            "daily_challenge": {
                "challenge": "🎲 Explora 5 assets en el marketplace",
                "reward": "+50 XP",
                "expires_in": "23h 45m"
            },
            "leaderboard_position": {
                "rank": 42,
                "total_users": 156,
                "message": "🚀 ¡Estás en el top 27%!"
            }
        }
    
    def _assess_value(self, value_usd: float) -> str:
        if value_usd < 100000:
            return "Entry-level asset - Ideal para empezar"
        elif value_usd < 1000000:
            return "Mid-range asset - Buen balance riesgo/retorno"
        else:
            return "High-value asset - Requiere expertise adicional"
    
    def _analyze_location(self, location: str) -> str:
        # Simplificado - en producción usar API de análisis de mercado
        return f"Ubicación estratégica en {location}"
    
    def _calculate_risk(self, asset_type: str, value_usd: float) -> str:
        risk_levels = {
            "bond": "Bajo",
            "real_estate": "Medio",
            "commodity": "Medio",
            "art": "Medio-Alto",
            "equity": "Alto"
        }
        return risk_levels.get(asset_type, "Medio")