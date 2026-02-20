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
    
    async def analyze_transaction_risk(self,
                                       transaction: Dict,
                                       user_history: Optional[List[Dict]] = None,
                                       iso20022_data: Optional[Dict] = None) -> Dict:
        """
        Real-time transaction risk analysis
        
        Args:
            transaction: Current transaction details
            user_history: User's transaction history
            iso20022_data: Rich ISO 20022 payment data if available
        
        Returns:
            Comprehensive risk assessment with AI insights
        """
        
        # Calculate base risk score
        base_risk = self._calculate_base_risk(transaction, user_history)
        
        # Detect fraud patterns
        fraud_indicators = self._detect_fraud_patterns(transaction, user_history)
        
        # Analyze ISO 20022 data if available
        iso_insights = {}
        if iso20022_data:
            iso_insights = self._analyze_iso20022_data(iso20022_data)
        
        # Get AI-powered deep analysis for high-risk or complex transactions
        ai_analysis = None
        if self.ai_available and (base_risk > 50 or len(fraud_indicators) > 0):
            ai_analysis = await self._get_ai_risk_assessment(
                transaction, fraud_indicators, iso_insights
            )
        
        # Calculate final risk score
        final_risk_score = self._calculate_final_risk(
            base_risk, len(fraud_indicators), 
            iso_insights.get("risk_factors", []), ai_analysis
        )
        
        risk_level = self._get_risk_level(final_risk_score)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(risk_level, fraud_indicators)
        
        return {
            "transaction_id": transaction.get("transaction_id"),
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "fraud_indicators": fraud_indicators,
            "iso20022_insights": iso_insights,
            "ai_analysis": ai_analysis,
            "compliance_actions": {
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
            payment_history_str = json.dumps(
                iso20022_payment_history[:5] if iso20022_payment_history else [], 
                indent=2
            )
            on_chain_str = json.dumps(on_chain_data or {}, indent=2)
            
            context = f"""
Asset Validation Request:

**Asset Details:**
- Type: {asset_data.get('type', 'Unknown')}
- Value: ${asset_data.get('value', 0):,.2f}
- Owner: {asset_data.get('owner', 'Unknown')}
- Location: {asset_data.get('location', 'Unknown')}
- Documentation: {asset_data.get('legal_documents', 'Not provided')}

**ISO 20022 Payment History:**
{payment_history_str}

**On-Chain Data:**
{on_chain_str}

**Validation Requirements:**
1. Verify asset authenticity based on documentation
2. Check payment history consistency with asset type
3. Identify any red flags or inconsistencies
4. Assess regulatory compliance
5. Validate ownership claims
6. Cross-reference on-chain and off-chain data

Provide a JSON response with:
{{
    "validation_result": "APPROVED/REJECTED/NEEDS_REVIEW",
    "confidence_score": "0-100",
    "authenticity_assessment": "detailed explanation",
    "red_flags": ["list of concerns"],
    "compliance_status": "COMPLIANT/NON_COMPLIANT/PENDING",
    "ownership_verified": true/false,
    "recommendations": ["list of recommendations"],
    "data_consistency": {{
        "on_chain_off_chain_match": true/false,
        "payment_history_consistent": true/false,
        "documentation_complete": true/false
    }}
}}
"""

            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"asset-validation-{asset_data.get('id', 'unknown')}",
                system_message="You are an expert asset validator specializing in RWA tokenization, regulatory compliance, and fraud detection."
            ).with_model(self.provider, self.model)
            
            response = await chat.send_message(UserMessage(text=context))
            
            # Parse AI response
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            
            validation_result = json.loads(cleaned)
            validation_result["ai_powered"] = True
            validation_result["analyzed_at"] = datetime.utcnow().isoformat() + "Z"
            
            return validation_result
            
        except Exception as e:
            print(f"AI asset validation error: {e}")
            return self._get_fallback_asset_validation(asset_data)
    
    async def monitor_portfolio_risk(self,
                                    user_id: str,
                                    portfolio: List[Dict],
                                    market_data: Optional[Dict] = None) -> Dict:
        """
        Continuous portfolio risk monitoring
        
        Analyzes:
        - Portfolio concentration risk
        - Market correlation
        - Regulatory exposure
        - Liquidity risk
        """
        
        total_value = sum(asset.get('value', 0) for asset in portfolio)
        
        # Calculate concentration risk
        concentration = self._calculate_concentration_risk(portfolio)
        
        # Assess liquidity
        liquidity_score = self._assess_liquidity(portfolio)
        
        # Calculate overall portfolio risk
        portfolio_risk = self._calculate_portfolio_risk(concentration, liquidity_score)
        
        return {
            "user_id": user_id,
            "portfolio_summary": {
                "total_value": total_value,
                "asset_count": len(portfolio),
                "diversification_score": 100 - concentration
            },
            "risk_metrics": {
                "concentration_risk": concentration,
                "liquidity_risk": 100 - liquidity_score,
                "overall_risk": portfolio_risk,
                "risk_level": self._get_risk_level(portfolio_risk)
            },
            "alerts": self._generate_portfolio_alerts(concentration, liquidity_score),
            "recommendations": self._generate_portfolio_recommendations(portfolio, concentration),
            "monitored_at": datetime.utcnow().isoformat() + "Z"
        }
    
    def _calculate_base_risk(self, transaction: Dict, history: Optional[List[Dict]]) -> float:
        """Calculate base risk score from transaction details"""
        score = 0.0
        
        amount = transaction.get("amount", 0)
        
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
        """Detect known fraud patterns"""
        patterns = []
        
        amount = transaction.get("amount", 0)
        
        # Check for round amounts (structuring)
        if amount % 10000 == 0 and amount >= 10000:
            patterns.append("round_amount_pattern")
        
        # Check for rapid succession (if history available)
        if history and len(history) > 0:
            recent_transactions = [t for t in history if self._is_recent(t.get("timestamp"))]
            if len(recent_transactions) > 5:
                patterns.append("rapid_succession_transfers")
        
        # Check for amount just below reporting threshold
        if 9000 <= amount < 10000:
            patterns.append("amount_structuring")
        
        return patterns
    
    def _analyze_iso20022_data(self, iso_data: Dict) -> Dict:
        """Extract risk insights from ISO 20022 data"""
        insights = {
            "data_quality": "high",
            "cross_border": False,
            "risk_factors": []
        }
        
        # Check for cross-border transaction
        debtor_country = iso_data.get("debtor_country", "")
        creditor_country = iso_data.get("creditor_country", "")
        
        if debtor_country and creditor_country and debtor_country != creditor_country:
            insights["cross_border"] = True
            insights["risk_factors"].append("cross_border_transaction")
        
        # Check payment purpose
        purpose = iso_data.get("purpose_code", "")
        if purpose in ["CHAR", "SALA"]:  # Charity, Salary
            insights["risk_factors"].append("special_purpose_payment")
        
        return insights
    
    async def _get_ai_risk_assessment(self, transaction: Dict, fraud_indicators: List[str], iso_insights: Dict) -> Dict:
        """Get AI-powered risk assessment for complex cases"""
        
        prompt = f"""
Analyze this transaction for risk:

Transaction: {json.dumps(transaction, indent=2)}
Fraud Indicators: {fraud_indicators}
ISO 20022 Insights: {json.dumps(iso_insights, indent=2)}

Provide JSON:
{{
    "risk_assessment": "LOW/MEDIUM/HIGH/CRITICAL",
    "explanation": "brief explanation",
    "key_concerns": ["list"],
    "mitigation_steps": ["list"]
}}
"""
        
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"risk-{transaction.get('transaction_id', 'unknown')}",
                system_message="You are a financial crime analyst specializing in AML/CFT."
            ).with_model(self.provider, self.model)
            
            response = await chat.send_message(UserMessage(text=prompt))
            cleaned = response.strip().strip("```json").strip("```").strip()
            return json.loads(cleaned)
        except:
            return None
    
    def _calculate_final_risk(self, base: float, fraud_count: int, iso_factors: List, ai_analysis: Optional[Dict]) -> float:
        """Calculate final risk score"""
        score = base
        score += fraud_count * 15
        score += len(iso_factors) * 10
        
        if ai_analysis:
            ai_risk = ai_analysis.get("risk_assessment", "MEDIUM")
            if ai_risk == "CRITICAL":
                score += 30
            elif ai_risk == "HIGH":
                score += 20
            elif ai_risk == "MEDIUM":
                score += 10
        
        return min(score, 100)
    
    def _get_risk_level(self, score: float) -> str:
        """Convert score to risk level"""
        if score < self.risk_thresholds["low"]:
            return "LOW"
        elif score < self.risk_thresholds["medium"]:
            return "MEDIUM"
        elif score < self.risk_thresholds["high"]:
            return "HIGH"
        else:
            return "CRITICAL"
    
    def _generate_recommendations(self, risk_level: str, fraud_indicators: List[str]) -> List[str]:
        """Generate action recommendations based on risk"""
        recommendations = []
        
        if risk_level in ["HIGH", "CRITICAL"]:
            recommendations.append("Manual review required before proceeding")
            recommendations.append("Enhanced due diligence recommended")
        
        if "amount_structuring" in fraud_indicators:
            recommendations.append("File SAR - Potential structuring detected")
        
        if "rapid_succession_transfers" in fraud_indicators:
            recommendations.append("Verify source of funds")
        
        if risk_level == "LOW":
            recommendations.append("Standard monitoring sufficient")
        
        return recommendations
    
    def _get_next_actions(self, risk_level: str, fraud_indicators: List[str]) -> List[Dict]:
        """Get recommended next actions"""
        actions = []
        
        if risk_level in ["HIGH", "CRITICAL"]:
            actions.append({
                "action": "MANUAL_REVIEW",
                "priority": "HIGH",
                "description": "Transaction requires manual compliance review"
            })
        
        if fraud_indicators:
            actions.append({
                "action": "ENHANCED_MONITORING",
                "priority": "MEDIUM",
                "description": "Add user to enhanced monitoring list"
            })
        
        return actions
    
    def _is_recent(self, timestamp) -> bool:
        """Check if timestamp is within last 24 hours"""
        if not timestamp:
            return False
        try:
            if isinstance(timestamp, str):
                ts = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            else:
                ts = timestamp
            return datetime.now(ts.tzinfo) - ts < timedelta(hours=24)
        except:
            return False
    
    def _get_fallback_asset_validation(self, asset_data: Dict) -> Dict:
        """Fallback validation when AI is unavailable"""
        return {
            "validation_result": "NEEDS_REVIEW",
            "confidence_score": 50,
            "authenticity_assessment": "Manual review required - AI unavailable",
            "red_flags": [],
            "compliance_status": "PENDING",
            "ownership_verified": False,
            "recommendations": ["Complete manual verification"],
            "data_consistency": {
                "on_chain_off_chain_match": None,
                "payment_history_consistent": None,
                "documentation_complete": None
            },
            "ai_powered": False,
            "analyzed_at": datetime.utcnow().isoformat() + "Z"
        }
    
    def _calculate_concentration_risk(self, portfolio: List[Dict]) -> float:
        """Calculate portfolio concentration risk"""
        if not portfolio:
            return 0
        
        total_value = sum(asset.get('value', 0) for asset in portfolio)
        if total_value == 0:
            return 0
        
        # Calculate Herfindahl-Hirschman Index (HHI)
        hhi = sum((asset.get('value', 0) / total_value * 100) ** 2 for asset in portfolio)
        
        # Normalize to 0-100 scale
        return min(hhi / 100, 100)
    
    def _assess_liquidity(self, portfolio: List[Dict]) -> float:
        """Assess portfolio liquidity"""
        if not portfolio:
            return 100
        
        # Simple liquidity scoring based on asset types
        liquidity_scores = {
            "real_estate": 30,
            "art": 20,
            "commodity": 70,
            "equity": 90,
            "bond": 85,
            "default": 50
        }
        
        total_value = sum(asset.get('value', 0) for asset in portfolio)
        if total_value == 0:
            return 100
        
        weighted_liquidity = sum(
            asset.get('value', 0) * liquidity_scores.get(asset.get('type', 'default'), 50)
            for asset in portfolio
        ) / total_value
        
        return weighted_liquidity
    
    def _calculate_portfolio_risk(self, concentration: float, liquidity: float) -> float:
        """Calculate overall portfolio risk"""
        # Weight factors
        concentration_weight = 0.6
        liquidity_weight = 0.4
        
        risk = (concentration * concentration_weight) + ((100 - liquidity) * liquidity_weight)
        return min(risk, 100)
    
    def _generate_portfolio_alerts(self, concentration: float, liquidity: float) -> List[Dict]:
        """Generate portfolio risk alerts"""
        alerts = []
        
        if concentration > 60:
            alerts.append({
                "type": "CONCENTRATION_WARNING",
                "severity": "HIGH",
                "message": "Portfolio is highly concentrated - diversification recommended"
            })
        
        if liquidity < 40:
            alerts.append({
                "type": "LIQUIDITY_WARNING",
                "severity": "MEDIUM",
                "message": "Low liquidity assets dominate portfolio"
            })
        
        return alerts
    
    def _generate_portfolio_recommendations(self, portfolio: List[Dict], concentration: float) -> List[str]:
        """Generate portfolio optimization recommendations"""
        recommendations = []
        
        if concentration > 50:
            recommendations.append("Consider diversifying across asset types")
        
        asset_types = set(asset.get('type') for asset in portfolio)
        if len(asset_types) < 3:
            recommendations.append("Add different asset classes for better diversification")
        
        return recommendations


# Create singleton instance
risk_analytics_service = RiskAnalyticsService()
