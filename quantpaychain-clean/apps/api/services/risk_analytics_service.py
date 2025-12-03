"""AI-Powered Risk Analytics & Monitoring Service

Transforms risk assessment from reactive to predictive and continuous:
- Real-time transaction monitoring (KYT - Know Your Transaction)
- On-chain risk analysis with ISO 20022 integration
- Fraud pattern detection and suspicious activity identification
- Asset validation with rich data from ISO 20022 messages
- Regulatory compliance automation

Strategic Focus: Add value services not possible in TradFi systems
"""

import os
import json
import hashlib
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage

class RiskAnalyticsService:
    """
    AI-Powered Risk Analytics for RWA Tokenization
    
    Integrates:
    - AI analytics (GPT-4) for risk assessment
    - ISO 20022 data for rich context
    - On-chain monitoring for real-time KYT
    - Pattern recognition for fraud detection
    """
    
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("OPENAI_API_KEY")
        self.provider = "openai"
        self.model = "gpt-4o-mini"
        self.ai_available = bool(self.api_key)
        
        # Risk scoring thresholds
        self.risk_thresholds = {
            "low": 30,
            "medium": 60,
            "high": 85
        }
        
        # Fraud patterns database (in production, use ML model)
        self.known_fraud_patterns = [
            "rapid_succession_transfers",
            "round_amount_pattern",
            "unusual_counterparty",
            "geographic_anomaly",
            "amount_structuring"
        ]
        
        print(f"🔍 Risk Analytics Service initialized (AI: {self.ai_available})")
    
    async def analyze_transaction_risk(self,
                                      transaction_data: Dict,
                                      iso20022_data: Optional[Dict] = None,
                                      user_history: Optional[List[Dict]] = None) -> Dict:
        """
        Real-time transaction risk analysis (KYT - Know Your Transaction)
        
        Combines:
        - Transaction details
        - ISO 20022 rich data
        - User transaction history
        - AI-powered pattern recognition
        
        Returns comprehensive risk assessment with actionable insights
        """
        
        # Extract key information
        amount = transaction_data.get("amount", 0)
        sender = transaction_data.get("sender", "unknown")
        recipient = transaction_data.get("recipient", "unknown")
        currency = transaction_data.get("currency", "USD")
        
        # Calculate base risk score
        base_risk = self._calculate_base_risk(transaction_data, user_history)
        
        # Detect fraud patterns
        fraud_indicators = self._detect_fraud_patterns(transaction_data, user_history)
        
        # Analyze ISO 20022 data if available
        iso_insights = {}
        if iso20022_data:
            iso_insights = self._analyze_iso20022_data(iso20022_data)
        
        # Get AI-powered risk analysis
        ai_analysis = None
        if self.ai_available and amount > 10000:  # Use AI for high-value transactions
            try:
                ai_analysis = await self._get_ai_risk_assessment(
                    transaction_data,
                    fraud_indicators,
                    iso_insights
                )
            except Exception as e:
                print(f"AI analysis failed: {e}")
                ai_analysis = None
        
        # Calculate final risk score
        final_risk_score = self._calculate_final_risk(
            base_risk,
            len(fraud_indicators),
            iso_insights.get("risk_factors", []),
            ai_analysis
        )
        
        # Determine risk level
        risk_level = self._get_risk_level(final_risk_score)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            risk_level,
            fraud_indicators,
            ai_analysis
        )
        
        return {
            "transaction_id": transaction_data.get("transaction_id", hashlib.sha256(str(transaction_data).encode()).hexdigest()[:16]),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "risk_assessment": {
                "risk_score": final_risk_score,
                "risk_level": risk_level,
                "base_risk": base_risk,
                "confidence": 0.85 if ai_analysis else 0.70
            },
            "fraud_detection": {
                "indicators_found": len(fraud_indicators),
                "patterns": fraud_indicators,
                "requires_review": len(fraud_indicators) > 0 or final_risk_score > 70
            },
            "iso20022_analysis": iso_insights,
            "ai_insights": ai_analysis or {
                "available": False,
                "reason": "AI analysis not triggered (amount < $10,000 or AI unavailable)"
            },
            "compliance": {
                "aml_flagged": final_risk_score > 70,
                "requires_kyc_verification": final_risk_score > 60,
                "sanctions_check_required": iso_insights.get("cross_border", False),
                "regulatory_reporting": final_risk_score > 85
            },
            "recommendations": recommendations,
            "next_actions": self._get_next_actions(risk_level, fraud_indicators)
        }
    
    async def validate_asset_with_ai(self,
                                    asset_data: Dict,
                                    iso20022_payment_history: Optional[List[Dict]] = None,
                                    on_chain_data: Optional[Dict] = None) -> Dict:
        """
        Deep asset validation using AI + ISO 20022 rich data
        
        Validates:
        - Asset authenticity and ownership
        - Payment history consistency
        - On-chain vs off-chain data reconciliation
        - Regulatory compliance
        """
        
        if not self.ai_available:
            return self._get_fallback_asset_validation(asset_data)
        
        try:
            # Prepare comprehensive context
            context = f\"\"\"\nAsset Validation Request:\n\n**Asset Details:**\n- Type: {asset_data.get('type', 'Unknown')}\n- Value: ${asset_data.get('value', 0):,.2f}\n- Owner: {asset_data.get('owner', 'Unknown')}\n- Location: {asset_data.get('location', 'Unknown')}\n- Documentation: {asset_data.get('legal_documents', 'Not provided')}\n\n**ISO 20022 Payment History:**\n{json.dumps(iso20022_payment_history[:5] if iso20022_payment_history else [], indent=2)}\n\n**On-Chain Data:**\n{json.dumps(on_chain_data or {}, indent=2)}\n\n**Validation Requirements:**\n1. Verify asset authenticity based on documentation\n2. Check payment history consistency with asset type\n3. Identify any red flags or inconsistencies\n4. Assess regulatory compliance\n5. Validate ownership claims\n6. Cross-reference on-chain and off-chain data\n\nProvide a JSON response with:\n{{\n    \"validation_result\": \"APPROVED/REJECTED/NEEDS_REVIEW\",\n    \"confidence_score\": \"0-100\",\n    \"authenticity_assessment\": \"detailed explanation\",\n    \"red_flags\": [\"list of concerns\"],\n    \"compliance_status\": \"COMPLIANT/NON_COMPLIANT/PENDING\",\n    \"ownership_verified\": true/false,\n    \"recommendations\": [\"list of recommendations\"],\n    \"data_consistency\": {{\n        \"on_chain_off_chain_match\": true/false,\n        \"payment_history_consistent\": true/false,\n        \"documentation_complete\": true/false\n    }}\n}}\n\"\"\"\n\n            chat = LlmChat(\n                api_key=self.api_key,\n                session_id=f\"asset-validation-{asset_data.get('id', 'unknown')}\",\n                system_message=\"You are an expert asset validator specializing in RWA tokenization, regulatory compliance, and fraud detection.\"\n            ).with_model(self.provider, self.model)\n            \n            response = await chat.send_message(UserMessage(text=context))\n            \n            # Parse AI response\n            cleaned = response.strip()\n            if cleaned.startswith("```json\"):\n                cleaned = cleaned[7:]\n            if cleaned.startswith("```\"):\n                cleaned = cleaned[3:]\n            if cleaned.endswith("```\"):\n                cleaned = cleaned[:-3]\n            cleaned = cleaned.strip()\n            \n            validation_result = json.loads(cleaned)\n            validation_result[\"ai_powered\"] = True\n            validation_result[\"analyzed_at\"] = datetime.utcnow().isoformat() + \"Z\"\n            \n            return validation_result\n            \n        except Exception as e:\n            print(f\"AI asset validation error: {e}\")\n            return self._get_fallback_asset_validation(asset_data)\n    \n    async def monitor_portfolio_risk(self,\n                                    user_id: str,\n                                    portfolio: List[Dict],\n                                    market_data: Optional[Dict] = None) -> Dict:\n        """
        Continuous portfolio risk monitoring
        
        Analyzes:
        - Portfolio concentration risk
        - Market correlation
        - Regulatory exposure
        - Liquidity risk
        """
        
        total_value = sum(asset.get('value', 0) for asset in portfolio)\n        
        # Calculate concentration risk
        concentration = self._calculate_concentration_risk(portfolio)\n        
        # Assess liquidity
        liquidity_score = self._assess_liquidity(portfolio)\n        
        # Calculate overall portfolio risk
        portfolio_risk = self._calculate_portfolio_risk(concentration, liquidity_score)\n        
        return {
            \"user_id\": user_id,
            \"portfolio_summary\": {\n                \"total_value\": total_value,\n                \"asset_count\": len(portfolio),\n                \"diversification_score\": 100 - concentration\n            },\n            \"risk_metrics\": {\n                \"concentration_risk\": concentration,\n                \"liquidity_risk\": 100 - liquidity_score,\n                \"overall_risk\": portfolio_risk,\n                \"risk_level\": self._get_risk_level(portfolio_risk)\n            },\n            \"alerts\": self._generate_portfolio_alerts(concentration, liquidity_score),\n            \"recommendations\": self._generate_portfolio_recommendations(portfolio, concentration),\n            \"monitored_at\": datetime.utcnow().isoformat() + \"Z\"\n        }
    
    def _calculate_base_risk(self, transaction: Dict, history: Optional[List[Dict]]) -> float:
        \"\"\"Calculate base risk score from transaction details\"\"\"
        score = 0.0
        
        amount = transaction.get(\"amount\", 0)
        
        # High-value transaction risk
        if amount > 100000:
            score += 30
        elif amount > 50000:
            score += 20
        elif amount > 10000:
            score += 10
        
        # First-time transaction risk
        if not history or len(history) == 0:
            score += 25
        
        # Round amount suspicion (potential structuring)
        if amount % 10000 == 0 and amount >= 10000:
            score += 15
        
        return min(score, 100)
    
    def _detect_fraud_patterns(self, transaction: Dict, history: Optional[List[Dict]]) -> List[str]:
        \"\"\"Detect known fraud patterns\"\"\"
        patterns = []
        
        amount = transaction.get(\"amount\", 0)
        
        # Check for round amounts (structuring)
        if amount % 10000 == 0 and amount >= 10000:
            patterns.append(\"round_amount_pattern\")\n        
        # Check for rapid succession (if history available)
        if history and len(history) > 0:
            recent_transactions = [t for t in history if self._is_recent(t.get(\"timestamp\"))]
            if len(recent_transactions) > 5:
                patterns.append(\"rapid_succession_transfers\")\n        
        # Check for amount just below reporting threshold
        if 9000 <= amount < 10000:
            patterns.append(\"amount_structuring\")\n        
        return patterns
    
    def _analyze_iso20022_data(self, iso_data: Dict) -> Dict:
        \"\"\"Extract risk insights from ISO 20022 data\"\"\"
        insights = {
            \"data_quality\": \"high\",
            \"cross_border\": False,
            \"risk_factors\": []
        }
        
        # Check for cross-border transaction
        debtor_country = iso_data.get(\"debtor_country\", \"\")
        creditor_country = iso_data.get(\"creditor_country\", \"\")
        
        if debtor_country and creditor_country and debtor_country != creditor_country:
            insights[\"cross_border\"] = True
            insights[\"risk_factors\"].append(\"cross_border_transaction\")\n        
        # Check payment purpose
        purpose = iso_data.get(\"purpose_code\", \"\")
        if purpose in [\"CHAR\", \"SALA\"]:  # Charity, Salary
            insights[\"risk_factors\"].append(\"special_purpose_payment\")\n        
        return insights
    
    async def _get_ai_risk_assessment(self, transaction: Dict, fraud_indicators: List[str], iso_insights: Dict) -> Dict:
        \"\"\"Get AI-powered risk assessment for complex cases\"\"\"
        
        prompt = f\"\"\"\nAnalyze this transaction for risk:\n\nTransaction: {json.dumps(transaction, indent=2)}\nFraud Indicators: {fraud_indicators}\nISO 20022 Insights: {json.dumps(iso_insights, indent=2)}\n\nProvide JSON:\n{{\n    \"risk_assessment\": \"LOW/MEDIUM/HIGH/CRITICAL\",\n    \"explanation\": \"brief explanation\",\n    \"key_concerns\": [\"list\"],\n    \"mitigation_steps\": [\"list\"]\n}}\n\"\"\"\n        \n        try:
            chat = LlmChat(\n                api_key=self.api_key,\n                session_id=f\"risk-{transaction.get('transaction_id', 'unknown')}\",\n                system_message=\"You are a financial crime analyst specializing in AML/CFT.\"\n            ).with_model(self.provider, self.model)\n            \n            response = await chat.send_message(UserMessage(text=prompt))\n            cleaned = response.strip().strip(\"```json\").strip(\"```\").strip()\n            return json.loads(cleaned)\n        except:\n            return None
    
    def _calculate_final_risk(self, base: float, fraud_count: int, iso_factors: List, ai_analysis: Optional[Dict]) -> float:
        \"\"\"Calculate final risk score\"\"\"
        score = base
        score += fraud_count * 15
        score += len(iso_factors) * 10
        
        if ai_analysis:
            ai_risk = ai_analysis.get(\"risk_assessment\", \"MEDIUM\")
            if ai_risk == \"CRITICAL\":
                score += 30
            elif ai_risk == \"HIGH\":
                score += 20
            elif ai_risk == \"MEDIUM\":
                score += 10
        
        return min(score, 100)
    
    def _get_risk_level(self, score: float) -> str:
        \"\"\"Convert score to risk level\"\"\"
        if score < self.risk_thresholds[\"low\"]:
            return \"LOW\"
        elif score < self.risk_thresholds[\"medium\"]:
            return \"MEDIUM\"
        elif score < self.risk_thresholds[\"high\"]:
            return \"HIGH\"
        else:
            return \"CRITICAL\"
    
    def _generate_recommendations(self, risk_level: str, fraud_indicators: List, ai_analysis: Optional[Dict]) -> List[str]:
        \"\"\"Generate actionable recommendations\"\"\"
        recommendations = []
        
        if risk_level == \"CRITICAL\":
            recommendations.append(\"🚨 BLOCK transaction pending manual review\")\n            recommendations.append(\"📞 Contact compliance officer immediately\")\n        elif risk_level == \"HIGH\":
            recommendations.append(\"⏸️ Hold transaction for enhanced verification\")\n            recommendations.append(\"📋 Request additional documentation\")\n        elif risk_level == \"MEDIUM\":
            recommendations.append(\"🔍 Perform enhanced due diligence\")\n        
        if fraud_indicators:
            recommendations.append(f\"⚠️ Investigate {len(fraud_indicators)} fraud indicators detected\")\n        
        if ai_analysis:
            ai_mitigation = ai_analysis.get(\"mitigation_steps\", [])
            recommendations.extend(ai_mitigation[:2])
        
        return recommendations
    
    def _get_next_actions(self, risk_level: str, fraud_indicators: List) -> List[str]:
        \"\"\"Determine next actions based on risk\"\"\"
        actions = []
        
        if risk_level in [\"HIGH\", \"CRITICAL\"]:
            actions.append(\"MANUAL_REVIEW_REQUIRED\")\n            actions.append(\"FREEZE_TRANSACTION\")\n        
        if fraud_indicators:
            actions.append(\"FRAUD_INVESTIGATION\")\n        
        if risk_level in [\"MEDIUM\", \"HIGH\"]:
            actions.append(\"ENHANCED_KYC\")\n        
        if not actions:
            actions.append(\"APPROVE\")\n        
        return actions
    
    def _get_fallback_asset_validation(self, asset_data: Dict) -> Dict:
        \"\"\"Fallback validation when AI unavailable\"\"\"
        return {
            \"validation_result\": \"NEEDS_REVIEW\",
            \"confidence_score\": 50,
            \"authenticity_assessment\": \"AI validation unavailable - manual review required\",
            \"red_flags\": [],
            \"compliance_status\": \"PENDING\",
            \"ownership_verified\": False,
            \"recommendations\": [\"Perform manual asset validation\", \"Verify legal documentation\"],
            \"data_consistency\": {
                \"on_chain_off_chain_match\": None,
                \"payment_history_consistent\": None,
                \"documentation_complete\": False
            },
            \"ai_powered\": False,
            \"analyzed_at\": datetime.utcnow().isoformat() + \"Z\"
        }
    
    def _calculate_concentration_risk(self, portfolio: List[Dict]) -> float:
        \"\"\"Calculate portfolio concentration risk\"\"\"
        if not portfolio:
            return 0
        
        total_value = sum(asset.get('value', 0) for asset in portfolio)
        if total_value == 0:
            return 0
        
        # Calculate Herfindahl index
        concentrations = [(asset.get('value', 0) / total_value) ** 2 for asset in portfolio]
        herfindahl = sum(concentrations) * 100
        
        return min(herfindahl, 100)
    
    def _assess_liquidity(self, portfolio: List[Dict]) -> float:
        \"\"\"Assess portfolio liquidity\"\"\"
        if not portfolio:
            return 0
        
        liquid_assets = sum(1 for asset in portfolio if asset.get('liquid', False))
        liquidity_score = (liquid_assets / len(portfolio)) * 100
        
        return liquidity_score
    
    def _calculate_portfolio_risk(self, concentration: float, liquidity_score: float) -> float:
        \"\"\"Calculate overall portfolio risk\"\"\"
        # Weighted average: concentration 60%, liquidity 40%
        risk = (concentration * 0.6) + ((100 - liquidity_score) * 0.4)
        return risk
    
    def _generate_portfolio_alerts(self, concentration: float, liquidity_score: float) -> List[Dict]:
        \"\"\"Generate portfolio alerts\"\"\"
        alerts = []
        
        if concentration > 70:
            alerts.append({
                \"type\": \"HIGH_CONCENTRATION\",
                \"severity\": \"HIGH\",
                \"message\": \"Portfolio is highly concentrated. Consider diversification.\"
            })
        
        if liquidity_score < 30:
            alerts.append({
                \"type\": \"LOW_LIQUIDITY\",
                \"severity\": \"MEDIUM\",
                \"message\": \"Portfolio has low liquidity. May face challenges in quick liquidation.\"
            })
        
        return alerts
    
    def _generate_portfolio_recommendations(self, portfolio: List[Dict], concentration: float) -> List[str]:
        \"\"\"Generate portfolio recommendations\"\"\"
        recommendations = []
        
        if concentration > 60:
            recommendations.append(\"Diversify holdings across different asset types\")\n        
        if len(portfolio) < 5:
            recommendations.append(\"Consider adding more assets to reduce concentration risk\")\n        
        recommendations.append(\"Maintain regular risk monitoring schedule\")\n        
        return recommendations
    
    def _is_recent(self, timestamp: Optional[str]) -> bool:
        \"\"\"Check if timestamp is within last 24 hours\"\"\"
        if not timestamp:
            return False
        try:
            tx_time = datetime.fromisoformat(timestamp.replace('Z', ''))
            return datetime.utcnow() - tx_time < timedelta(hours=24)
        except:
            return False
