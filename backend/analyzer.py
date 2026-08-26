import anthropic
import json
import os
from models import AnalyzeResponse

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) analyzer and career coach.
Your job is to objectively analyze a resume against a job description and return structured JSON.
Be honest, specific, and actionable. Never fabricate skills or experiences."""

def build_prompt(job_description: str, resume: str) -> str:
    return f"""Analyze this job description against the provided resume and return ONLY a JSON object with exactly this structure:

{{
  "ats_score": <integer 0-100, honest fit score>,
  "matched_skills": [<skills in JD that are present in resume, max 12 items>],
  "missing_skills": [<skills in JD missing from resume, max 8 items>],
  "summary_assessment": "<2-3 sentence honest assessment of overall fit>",
  "rewritten_summary": "<improved professional summary tailored to this JD, 3-4 sentences, first person, based on resume content>",
  "top_recommendations": [
    "<specific actionable recommendation 1>",
    "<specific actionable recommendation 2>",
    "<specific actionable recommendation 3>"
  ],
  "keyword_density": "<Low/Medium/High>",
  "experience_match": "<Strong/Moderate/Weak>",
  "domain_match": "<Strong/Moderate/Weak>"
}}

Scoring guide:
- 85-100: Excellent match, apply immediately
- 70-84: Strong match, minor gaps
- 55-69: Moderate match, notable gaps
- 40-54: Weak match, significant gaps
- Below 40: Poor match, major gaps

JOB DESCRIPTION:
{job_description[:4000]}

RESUME:
{resume[:4000]}

Return ONLY the JSON object. No markdown, no explanation, no preamble."""

async def analyze_resume(job_description: str, resume: str) -> AnalyzeResponse:
    prompt = build_prompt(job_description, resume)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    raw = message.content[0].text
    clean = raw.replace("```json", "").replace("```", "").strip()
    data = json.loads(clean)

    return AnalyzeResponse(
        ats_score=data["ats_score"],
        matched_skills=data["matched_skills"],
        missing_skills=data["missing_skills"],
        summary_assessment=data["summary_assessment"],
        rewritten_summary=data["rewritten_summary"],
        top_recommendations=data["top_recommendations"],
        keyword_density=data["keyword_density"],
        experience_match=data["experience_match"],
        domain_match=data["domain_match"]
    )