from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from supabase import create_client, Client
import os

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: str | None = None
    role: str = "user"

@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: str = Header(...)):
    """Get current authenticated user"""
    try:
        # Extract token from Bearer header
        token = authorization.replace("Bearer ", "")
        
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        result = supabase.table("users").select("*").eq("id", user.user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout")
async def logout(authorization: str = Header(...)):
    """Logout user"""
    try:
        token = authorization.replace("Bearer ", "")
        supabase.auth.sign_out(token)
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
