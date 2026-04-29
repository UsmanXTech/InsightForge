from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
import hashlib
import secrets
from datetime import datetime

from app.models.domain import User, UserCredential, Sale, Project, Alert, Setting
from app.schemas.auth import LoginRequest, RegisterRequest

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return f"{salt}${digest}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, digest = stored_hash.split("$", 1)
    except ValueError:
        return False
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return secrets.compare_digest(candidate, digest)

def get_sales(db: Session):
    sales = db.query(Sale).all()
    if not sales:
        # Seed some data if empty
        seed_sales = [
            Sale(name='Jan', revenue=4000, users=2400),
            Sale(name='Feb', revenue=3000, users=1398),
            Sale(name='Mar', revenue=2000, users=9800),
            Sale(name='Apr', revenue=2780, users=3908),
            Sale(name='May', revenue=1890, users=4800),
            Sale(name='Jun', revenue=2390, users=3800),
            Sale(name='Jul', revenue=3490, users=4300),
        ]
        db.add_all(seed_sales)
        db.commit()
        sales = db.query(Sale).all()
    return sales

def get_projects(db: Session):
    projects = db.query(Project).all()
    if not projects:
        seed_projects = [
            Project(name='Q1', budget=4000, spend=2400),
            Project(name='Q2', budget=3000, spend=1398),
            Project(name='Q3', budget=2000, spend=9800),
            Project(name='Q4', budget=2780, spend=3908),
        ]
        db.add_all(seed_projects)
        db.commit()
        projects = db.query(Project).all()
    return projects

def get_users(db: Session):
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
            "department": user.department,
            "lastLogin": user.last_login
        }
        for user in users
    ]

def get_alerts(db: Session):
    alerts = db.query(Alert).all()
    if not alerts:
        seed_alerts = [
            Alert(title="Database Optimization Complete", desc="PostgreSQL indexes rebuilt automatically", time="Just now", type="success"),
            Alert(title="Memory Spike Detected", desc="Uvicorn worker PID 442 consuming >500MB", time="4 min ago", type="warn")
        ]
        db.add_all(seed_alerts)
        db.commit()
        alerts = db.query(Alert).all()
    return alerts

def get_settings(db: Session):
    settings = db.query(Setting).all()
    if not settings:
        seed_settings = [
            Setting(key="two_factor", value="enabled", enabled=1),
            Setting(key="auto_aggregation", value="disabled", enabled=0)
        ]
        db.add_all(seed_settings)
        db.commit()
        settings = db.query(Setting).all()
    return settings

def update_setting(db: Session, key: str, enabled: bool):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if setting:
        setting.enabled = 1 if enabled else 0
        db.commit()
        db.refresh(setting)
    return setting

def get_db_summary(db: Session):
    sales = get_sales(db)
    projects = get_projects(db)
    users = get_users(db)
    
    summary = "Sales Data:\n"
    for s in sales:
        summary += f"- {s.name}: Revenue {s.revenue}, Users {s.users}\n"
    
    summary += "\nProject Data:\n"
    for p in projects:
        summary += f"- {p.name}: Budget {p.budget}, Spend {p.spend}\n"
    
    summary += f"\nUser Count: {len(users)}\n"
    return summary

def approve_user(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.status = "Active"
        db.commit()
        db.refresh(user)
    if not user:
        return None
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "department": user.department,
        "lastLogin": user.last_login
    }

def login_user(db: Session, req: LoginRequest):
    user = db.query(User).filter(User.email == req.email).first()
    credential = db.query(UserCredential).filter(UserCredential.email == req.email).first()
    if not user or not credential:
        return None
    if not verify_password(req.password, credential.password_hash):
        return None
    user.last_login = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    db.commit()
    db.refresh(user)
    return user

def register_user(db: Session, req: RegisterRequest):
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        return None

    new_user = User(
        id=f"USR-{hash(req.email) % 10000}",
        name=req.name,
        email=req.email,
        role="Viewer",
        status="Pending",
        department="Unassigned",
        last_login="Never"
    )
    credential = UserCredential(
        email=req.email,
        password_hash=hash_password(req.password)
    )
    db.add(new_user)
    db.add(credential)
    db.commit()
    db.refresh(new_user)
    return new_user
