from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.models.domain import User, Sale, Project, Alert, Setting
from app.schemas.auth import LoginRequest, RegisterRequest

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
    return db.query(User).all()

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
