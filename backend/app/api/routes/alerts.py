from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/")
def get_alerts() -> List[Dict]:
    return [
        { "title": "Database Optimization Complete", "desc": "PostgreSQL indexes rebuilt automatically", "time": "Just now", "type": "success" },
        { "title": "Memory Spike Detected", "desc": "Uvicorn worker PID 442 consuming >500MB", "time": "4 min ago", "type": "warn" },
        { "title": "Daily Gemini Target Exceeded", "desc": "105% quota usage on API requests", "time": "1 hour ago", "type": "warn" },
        { "title": "System Reboot Scheduled", "desc": "Cloud Run container rolling restart at 0200", "time": "4 hours ago", "type": "success" }
    ]
