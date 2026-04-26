from pydantic import BaseModel

class SalesData(BaseModel):
    name: str
    revenue: int
    users: int

class ProjectData(BaseModel):
    name: str
    budget: int
    spend: int

class UserRecord(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str
    department: str
    lastLogin: str

class AlertSchema(BaseModel):
    title: str
    desc: str
    time: str
    type: str

class SettingSchema(BaseModel):
    key: str
    value: str
    enabled: bool

class ChatRequest(BaseModel):
    query: str
