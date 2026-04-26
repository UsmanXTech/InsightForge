from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.models.domain import User, Sale, Project
from app.schemas.auth import LoginRequest, RegisterRequest

def get_sales(db: Session):
    return db.query(Sale).all()

def get_projects(db: Session):
    return db.query(Project).all()

def get_users(db: Session):
    return db.query(User).all()

def approve_user(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.status = "Active"
        db.commit()
        db.refresh(user)
    return user

def login_user(db: Session, req: LoginRequest):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        return None
    # For a real app, hash and check passwords. This is a mockup!
    return user

def register_user(db: Session, req: RegisterRequest):
    new_user = User(
        id=f"USR-{hash(req.email) % 10000}",
        name=req.name,
        email=req.email,
        role="Viewer",
        status="Pending",
        department="Unassigned",
        last_login="Never"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
