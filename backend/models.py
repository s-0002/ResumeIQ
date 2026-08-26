from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    job_description: str
    resume: str

class AnalyzeResponse(BaseModel):
    ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    summary_assessment: str
    rewritten_summary: str
    top_recommendations: List[str]
    keyword_density: str
    experience_match: str
    domain_match: str