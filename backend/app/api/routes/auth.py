from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse
from app.services import db_service
from app.core.security import create_access_token

router = APIRouter()

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db_service.login_user(db, req)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return AuthResponse(message="Login successful", email=user.email, token=create_access_token(user.email))

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    user = db_service.register_user(db, req)
    if not user:
        raise HTTPException(status_code=409, detail="Email already exists")
    return AuthResponse(message="Registration successful", email=user.email, token=create_access_token(user.email))
