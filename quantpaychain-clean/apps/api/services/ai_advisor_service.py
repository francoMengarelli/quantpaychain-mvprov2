import os
import json
import asyncio
from typing import Dict, Optional
from emergentintegrations import ChatClient

class AIAdvisorService:
    """
    AI Legal Advisor Service - IMPLEMENTACIÓN REAL CON GPT-4
    - Guía legal para creación de assets
    - Sugerencias de uso (guardar, invertir, vender)
    - Gamificación y tips interactivos
    - Análisis de riesgo personalizado
    """
    
    def __init__(self):
        self.api_key = "sk-emergent-7A968AeD5Dc41Be1bD"
        self.client = ChatClient(
            api_key=self.api_key,
            model="gpt-4",
            temperature=0.7
        )
        self.system_prompt = """
Eres un experto legal y financiero especializado en tokenización de activos del mundo real (RWA).
Tu trabajo es analizar activos y proporcionar:

1. Requisitos legales específicos por jurisdicción
2. Estrategia de tokenización óptima
3. Análisis de riesgo y potencial de inversión
4. Recomendaciones prácticas y accionables

Responde siempre en JSON válido con estructura específica.
Usa emojis para hacer el contenido más atractivo.
Sé preciso, profesional pero accesible.
"""
    
    async def analyze_asset(self, asset_type: str, description: str, value_usd: float, location: str, user_context: Optional[Dict] = None):
        """
        Analiza el asset usando GPT-4 y proporciona advice legal y estratégico REAL
        """
        try:
            user_prompt = f"""
Analiza este activo para tokenización:

**ACTIVO:**
- Tipo: {asset_type}
- Descripción: {description}
- Valor USD: ${value_usd:,}
- Ubicación: {location}

**CONTEXTO USUARIO:** {user_context or 'Usuario nuevo'}

Responde con JSON en este formato exacto:
{{
    "asset_analysis": {{
        "type": "{asset_type}",
        "value_assessment": "string con evaluación del valor",
        "location_analysis": "análisis específico de la ubicación",
        "market_insights": "insights de mercado relevantes"
    }},
    "legal_guidance": {{
        "requirements": ["lista de 4-6 requisitos legales específicos con emojis"],
        "compliance_level": "High|Medium|Low",
        "jurisdictional_notes": "notas específicas para {location}",
        "next_steps": ["4 pasos concretos numerados con emojis"]
    }},
    "tokenization_strategy": {{
        "recommended_tokens": "número recomendado de tokens a crear",
        "pricing_model": "estrategia de precio por token",
        "liquidity_approach": "cómo maximizar liquidez",
        "fractionalization_benefits": "beneficios del fraccionamiento"
    }},
    "investment_recommendations": {{
        "potential": "Alto|Medio-Alto|Medio|Bajo-Medio|Bajo",
        "risk_level": "Alto|Medio-Alto|Medio|Bajo-Medio|Bajo",
        "strategies": ["3-4 estrategias específicas con emojis"],
        "timeline": "recomendación de timeline de inversión",
        "expected_returns": "estimación de retornos anuales"
    }},
    "ai_insights": {{
        "market_trends": "tendencias de mercado para este tipo de activo",
        "timing_analysis": "análisis del momento actual para tokenizar",
        "competitive_advantages": "ventajas competitivas de este activo",
        "gamification_tip": "tip gamificado con emoji 🎮"
    }}
}}
"""

            response = await self.client.chat_completion_async(
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            # Parse JSON response
            ai_analysis = json.loads(response.choices[0].message.content)
            
            # Añadir metadata de AI
            ai_analysis["metadata"] = {
                "ai_powered": True,
                "model": "gpt-4",
                "confidence": "high",
                "generated_at": asyncio.get_event_loop().time()
            }
            
            return ai_analysis
            
        except json.JSONDecodeError:
            # Fallback si GPT-4 no devuelve JSON válido
            return self._get_fallback_analysis(asset_type, description, value_usd, location)
        except Exception as e:
            print(f"AI Advisor Error: {e}")
            return self._get_fallback_analysis(asset_type, description, value_usd, location)
    
    def _get_fallback_analysis(self, asset_type: str, description: str, value_usd: float, location: str) -> Dict:
        """
        Análisis de respaldo si falla la IA
        """
        return {
            "asset_analysis": {
                "type": asset_type,
                "value_assessment": f"Asset valorado en ${value_usd:,} - Análisis básico disponible",
                "location_analysis": f"Ubicado en {location}",
                "market_insights": "Conectando con AI - análisis básico mostrado"
            },
            "legal_guidance": {
                "requirements": [
                    "📋 Documentación legal básica",
                    "⚖️ Cumplimiento regulatorio local",
                    "💰 Valuación profesional",
                    "🔍 Due diligence completo"
                ],
                "compliance_level": "Medium",
                "jurisdictional_notes": f"Revisar regulaciones específicas de {location}",
                "next_steps": [
                    "1️⃣ Reunir documentación",
                    "2️⃣ Obtener valuación",
                    "3️⃣ Verificar compliance",
                    "4️⃣ Estructurar tokens"
                ]
            },
            "tokenization_strategy": {
                "recommended_tokens": "1,000 tokens para liquidez óptima",
                "pricing_model": f"${value_usd/1000:,.2f} por token",
                "liquidity_approach": "Marketplace público + incentivos",
                "fractionalization_benefits": "Acceso democratizado a inversión"
            },
            "investment_recommendations": {
                "potential": self._get_potential_by_type(asset_type),
                "risk_level": self._get_risk_by_type(asset_type),
                "strategies": [
                    "💎 Hold para apreciación a largo plazo",
                    "💰 Generar ingresos pasivos",
                    "📈 Diversificar portafolio"
                ],
                "timeline": "3-5 años recomendado",
                "expected_returns": "Varía según mercado"
            },
            "ai_insights": {
                "market_trends": f"{asset_type.title()} en tendencia positiva",
                "timing_analysis": "Momento neutral para tokenización",
                "competitive_advantages": "First-mover advantage en tokenización",
                "gamification_tip": "🎮 ¡Completa tu análisis AI para ganar XP extra!"
            },
            "metadata": {
                "ai_powered": False,
                "model": "fallback",
                "confidence": "basic",
                "note": "AI analysis temporarily unavailable"
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