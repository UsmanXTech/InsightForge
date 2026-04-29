from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
import pandas as pd
import google.generativeai as genai
import os
import io
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.domain import User
from app.services import db_service
from app.schemas.data import ChatRequest

router = APIRouter()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "missing_key"))

@router.post("/chat")
async def chat_with_data(req: ChatRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    try:
        summary = db_service.get_db_summary(db)
        
        prompt = f"""
        You are an AI data assistant for InsightForge.
        Here is the current summary of our database:
        {summary}
        
        The user has asked the following question about the data: "{req.query}"
        
        Answer the user's question directly and concisely based ONLY on the provided data summary.
        If the answer is not in the data, say "I don't have enough data to answer that."
        """
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyze-db")
async def analyze_db_insights(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    try:
        summary = db_service.get_db_summary(db)
        
        prompt = f"""
        Analyze the following business metrics from the InsightForge database:
        {summary}

        Provide 3 clear, actionable business insights based on this data. 
        Focus on trends between sales and projects if possible.
        Keep it extremely concise.
        """
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        return {"filename": "Live Database", "rows": "N/A", "insights": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_csv_for_insights(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        sample = df.head(10).to_csv(index=False)
        columns = ", ".join(df.columns.tolist())
        row_count = len(df)
        
        prompt = f"""
        Analyze this dataset with {row_count} rows and columns: {columns}.
        Here is a sample of the top 10 rows:
        {sample}

        Provide 3 clear, actionable business insights based on this sample format and dataset structure. Keep it extremely concise and purely analytical.
        """
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        return {"filename": file.filename, "rows": row_count, "insights": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
