from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = ...):
    # Dummy authentication
    if form_data.username != "admin" or form_data.password != "admin":
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": "fake-token", "token_type": "bearer"}