from fastapi import APIRouter, File, UploadFile, HTTPException
import pandas as pd
import google.generativeai as genai
import os
import io

router = APIRouter()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "missing_key"))

@router.post("/upload")
async def upload_csv_for_insights(file: UploadFile = File(...)):
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
