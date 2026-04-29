from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.domain import User
from app.schemas.data import UserRecord
from app.services import db_service

router = APIRouter()

@router.get("/", response_model=List[UserRecord])
def read_users(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db_service.get_users(db)

@router.put("/{user_id}/approve", response_model=UserRecord)
def approve_user(user_id: str, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    user = db_service.approve_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
