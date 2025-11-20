from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import openai
import os
from datetime import datetime
import uuid

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")

class ReportRequest(BaseModel):
    report_type: str = "transaction_summary"

class Report(BaseModel):
    id: str
    user_id: str
    report_type: str
    data: dict
    generated_at: str

@router.post("/generate", response_model=Report)
async def generate_report(request: ReportRequest, user_id: str):
    """Generate ISO 20022 report with AI"""
    try:
        # Get user transactions (mock for now)
        transactions = []
        
        # Generate report with OpenAI
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in ISO 20022 financial messaging standards."},
                {"role": "user", "content": f"Generate an ISO 20022 compliant {request.report_type} report for these transactions: {transactions}"}
            ]
        )
        
        report_content = response.choices[0].message.content
        
        report = Report(
            id=str(uuid.uuid4()),
            user_id=user_id,
            report_type=request.report_type,
            data={"content": report_content, "transactions_count": len(transactions)},
            generated_at=datetime.utcnow().isoformat()
        )
        
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze-asset")
async def analyze_asset(asset_data: dict, user_id: str):
    """Analyze RWA asset with AI"""
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in Real World Asset (RWA) tokenization and financial analysis."},
                {"role": "user", "content": f"Analyze this asset for tokenization: {asset_data}"}
            ]
        )
        
        return {"analysis": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
