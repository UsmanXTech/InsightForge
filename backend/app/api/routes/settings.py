from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.domain import User
from app.schemas.data import SettingSchema
from app.services import db_service

router = APIRouter()

@router.get("/", response_model=List[SettingSchema])
def get_settings(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db_service.get_settings(db)

@router.put("/{key}")
def update_setting(key: str, enabled: bool, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    setting = db_service.update_setting(db, key, enabled)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting
