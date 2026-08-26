# ResumeIQ Deployment Guide

## Step 1 — Push to GitHub

```bash
# Create repo on github.com first, then:
git init
git add .
git commit -m "Initial commit: ResumeIQ AI job application intelligence platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resumeiq.git
git push -u origin main
```

---

## Step 2 — Deploy Backend to Railway (Free)

1. Go to https://railway.app → Sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `resumeiq` repo
4. Set **Root Directory** to `backend`
5. Railway auto-detects Python — click **Deploy**
6. Go to **Variables** tab → Add:
   ```
   ANTHROPIC_API_KEY = your_key_here
   ```
7. Go to **Settings** → **Networking** → **Generate Domain**
8. Copy your Railway URL (e.g. `https://resumeiq-backend.railway.app`)

---

## Step 3 — Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → Sign in with GitHub
2. Click **New Project** → Import your `resumeiq` repo
3. Set **Root Directory** to `frontend`
4. Framework: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variable:
   ```
   VITE_API_URL = https://resumeiq-backend.railway.app
   ```
   (use your Railway URL from Step 2)
8. Click **Deploy**
9. Vercel gives you a live URL like `https://resumeiq.vercel.app`

---

## Step 4 — Test the live app

1. Open your Vercel URL
2. Paste a job description
3. Paste your resume
4. Click **Analyze** — results should appear in 3-5 seconds

---

## Local Development

```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Click **API Keys** → **Create Key**
4. Copy the key — starts with `sk-ant-...`
5. Add it to your Railway environment variable

Free tier gives you enough credits to demo the app.

---

## Add to Your Portfolio

Once deployed, add these to your GitHub profile and LinkedIn:

**GitHub repo description:**
> AI-powered job application intelligence platform — ATS scoring, skill gap analysis, and tailored resume summaries using Claude AI. Built with React, FastAPI, and the Anthropic API.

**LinkedIn post:**
> Just shipped ResumeIQ — an AI tool that analyzes your resume against any job description and gives you:
> - ATS compatibility score
> - Matched vs missing skills
> - AI-tailored professional summary
> - Actionable recommendations
>
> Built with Python, FastAPI, React, and Claude AI.
> Live demo: [your-vercel-url]
> GitHub: [your-repo-url]

**Topics to add to GitHub repo:**
`python` `fastapi` `react` `anthropic` `claude-ai` `ats` `resume` `job-search` `ai` `data-engineering`