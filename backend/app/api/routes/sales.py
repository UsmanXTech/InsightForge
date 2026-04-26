from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.data import SalesData
from app.services import db_service

router = APIRouter()

@router.get("/", response_model=List[SalesData])
def read_sales(db: Session = Depends(get_db)):
    return db_service.get_sales(db)
