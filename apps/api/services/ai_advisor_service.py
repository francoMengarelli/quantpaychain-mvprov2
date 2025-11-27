import os
import json
import asyncio
from typing import Dict, Optional
import httpx

class AIAdvisorService:
    """
    AI Legal Advisor Service - IMPLEMENTACIÓN REAL CON OPENAI API
    - Guía legal para creación de assets
    - Sugerencias de uso (guardar, invertir, vender)
    - Gamificación y tips interactivos
    - Análisis de riesgo personalizado
    """
    
    def __init__(self):
        self.api_key = os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            print("⚠️ WARNING: OPENAI_API_KEY not found in environment variables")
            print(f"⚠️ Available env vars: {list(os.environ.keys())[:10]}...")
            self.api_key = None
        else:
            print(f"✅ OPENAI_API_KEY loaded successfully (length: {len(self.api_key)})")
        
        self.base_url = "https://api.openai.com/v1"
        self.model = "gpt-4o-mini"  # Modelo actualizado y más económico
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
        Analiza el asset usando OpenAI API directamente y proporciona advice legal y estratégico REAL
        """
        # Si no hay API key, usar fallback inmediatamente
        if not self.api_key:
            print("⚠️ No API key available - using fallback")
            return self._get_fallback_analysis(asset_type, description, value_usd, location)
        
        try:
            print(f"🔑 Using OpenAI API key: {self.api_key[:10]}...")
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

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": self.system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 2000
                    },
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    
                    # Parse JSON response
                    ai_analysis = json.loads(content)
                    
                    # Añadir metadata de AI
                    ai_analysis["metadata"] = {
                        "ai_powered": True,
                        "model": self.model,
                        "confidence": "high",
                        "generated_at": asyncio.get_event_loop().time()
                    }
                    
                    return ai_analysis
                else:
                    print(f"OpenAI API Error: {response.status_code} - {response.text}")
                    return self._get_fallback_analysis(asset_type, description, value_usd, location)
            
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
    
    async def get_gamification_tips(self, asset_id: str, user_stats: Optional[Dict] = None):
        """
        Tips gamificados usando AI para personalización
        """
        try:
            user_prompt = f"""
Genera tips de gamificación personalizados para un usuario de QuantPayChain.

**CONTEXTO:**
- Asset ID: {asset_id}
- Stats del usuario: {user_stats or 'Usuario nuevo'}

Responde con JSON exacto:
{{
    "achievements": [
        {{
            "id": "achievement_id",
            "name": "🏆 Nombre con emoji",
            "description": "Descripción motivadora",
            "unlocked": true/false,
            "progress": "1/3" (si aplica),
            "reward": "+XP puntos"
        }}
    ],
    "next_actions": [
        {{
            "action": "🎯 Acción específica con emoji",
            "xp": number,
            "difficulty": "Fácil|Medio|Difícil"
        }}
    ],
    "daily_challenge": {{
        "challenge": "🎲 Desafío específico con emoji",
        "reward": "+XP",
        "expires_in": "tiempo restante"
    }},
    "leaderboard_position": {{
        "rank": number,
        "total_users": number,
        "message": "🚀 Mensaje motivacional"
    }},
    "ai_motivation": "Mensaje personalizado motivacional de 1-2 líneas"
}}

Haz que sea específico y motivacional.
"""

            response = await self.client.chat_completion_async(
                messages=[
                    {"role": "system", "content": "Eres un experto en gamificación y engagement de usuarios. Crea experiencias motivadoras y personalizadas."},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            ai_tips = json.loads(response.choices[0].message.content)
            return ai_tips
            
        except Exception as e:
            print(f"Gamification AI Error: {e}")
            return self._get_fallback_gamification(asset_id)
    
    def _get_fallback_gamification(self, asset_id: str) -> Dict:
        """
        Gamificación de respaldo
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
                }
            ],
            "next_actions": [
                {
                    "action": "💰 Completa tu primer análisis AI",
                    "xp": 150,
                    "difficulty": "Fácil"
                },
                {
                    "action": "📈 Alcanza $10k en valor total", 
                    "xp": 300,
                    "difficulty": "Medio"
                }
            ],
            "daily_challenge": {
                "challenge": "🎲 Explora 3 assets en el marketplace",
                "reward": "+75 XP",
                "expires_in": "23h 45m"
            },
            "leaderboard_position": {
                "rank": 42,
                "total_users": 156, 
                "message": "🚀 ¡Escalando en el ranking!"
            },
            "ai_motivation": "🤖 Sigue tokenizando para desbloquear análisis AI más avanzados"
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