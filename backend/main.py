from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import AnalyzeRequest, AnalyzeResponse
from analyzer import analyze_resume
import os

app = FastAPI(
    title="ResumeIQ API",
    description="AI-Powered Job Application Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    if not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required")
    if not request.resume.strip():
        raise HTTPException(status_code=400, detail="Resume is required")
    try:
        result = await analyze_resume(request.job_description, request.resume)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.options("/{full_path:path}")
async def preflight_handler(full_path: str):
    return {"status": "ok"}
