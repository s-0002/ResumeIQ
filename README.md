# ⚡ ResumeIQ — AI-Powered Job Application Intelligence Platform

> Paste a job description + your resume. Get your ATS score, skill gap analysis, and a tailored professional summary — powered by Claude AI.

![ResumeIQ Demo](https://img.shields.io/badge/Built%20with-Claude%20AI-blue?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.11+-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## What It Does

ResumeIQ analyzes your resume against any job description and gives you:

- **ATS Score (0–100)** — how well your resume matches the JD
- **Matched Skills** — skills the JD wants that you already have
- **Missing Skills** — gaps to address before applying
- **AI-Tailored Summary** — a rewritten professional summary specific to that JD
- **Top 3 Recommendations** — specific, actionable improvements
- **Match Badges** — Keyword Density, Experience Match, Domain Match ratings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Python, FastAPI |
| AI Engine | Anthropic Claude Sonnet (claude-sonnet-4-6) |
| Styling | CSS Variables, Responsive Grid |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
resumeiq/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── main.py              # FastAPI app
│   ├── analyzer.py          # Claude AI analysis logic
│   ├── models.py            # Pydantic request/response models
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/resumeiq.git
cd resumeiq
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

---

## API Endpoints

### `POST /analyze`

Analyzes a resume against a job description.

**Request:**
```json
{
  "job_description": "Senior Data Engineer with 5+ years...",
  "resume": "Experienced Data Engineer with expertise in..."
}
```

**Response:**
```json
{
  "ats_score": 82,
  "matched_skills": ["Python", "Spark", "AWS", "SQL"],
  "missing_skills": ["Flink", "Trino"],
  "summary_assessment": "Strong match — 82% alignment...",
  "rewritten_summary": "Senior Data Engineer with 8+ years...",
  "top_recommendations": [
    "Add Apache Flink experience or mention adjacent streaming tools",
    "Quantify your Spark optimization results with specific metrics",
    "Highlight your AWS certifications in the skills section"
  ],
  "keyword_density": "High",
  "experience_match": "Strong",
  "domain_match": "Moderate"
}
```

### `GET /health`

Returns API health status.

---

## Deployment

### Frontend → Vercel (Free)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add environment variable: `VITE_API_URL=https://your-railway-url.railway.app`
7. Deploy

### Backend → Railway (Free Tier)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select the repo, set **Root Directory** to `backend`
3. Add environment variable: `ANTHROPIC_API_KEY=your_key`
4. Railway auto-detects Python and deploys
5. Copy the Railway URL and add it to Vercel as `VITE_API_URL`

---

## How It Works

```
User Input (JD + Resume)
        ↓
FastAPI Backend
        ↓
Prompt Engineering → Claude Sonnet API
        ↓
Structured JSON Response (ATS score, skills, summary, recommendations)
        ↓
React Frontend renders animated results
```

The backend sends a carefully engineered prompt to Claude Sonnet, asking it to return structured JSON with ATS analysis. The response is validated with Pydantic models before being sent to the frontend.

---

## Key Features

- **Animated ATS Score Ring** — fills progressively as results load
- **Color-coded skill badges** — green for matched, red for missing
- **One-click copy** — copy the AI-tailored summary to clipboard
- **Responsive design** — works on mobile and desktop
- **Dark/light mode** — adapts to system preference
- **Fast** — analysis completes in 3-5 seconds

---

## Author

**Vasanth Avula** — Senior Data Engineer
- LinkedIn: [linkedin.com/in/vasanthavula2945](https://linkedin.com/in/vasanthavula2945)
- GitHub: [github.com/Sxavasanth](https://github.com/Sxavasanth)

---

## License

MIT — feel free to use, modify, and distribute.