import { useState, useEffect, useRef } from "react";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ScoreRing = ({ score }) => {
  const [animated, setAnimated] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  useEffect(() => {
    let cur = 0;
    const step = score / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, score);
      setAnimated(Math.round(cur));
      if (cur >= score) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [score]);
  return (
    <svg width="130" height="130" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#2A2D3E" strokeWidth="8" />
      <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.05s linear" }} />
      <text x="60" y="56" textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="monospace">{animated}</text>
      <text x="60" y="70" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="sans-serif">ATS SCORE</text>
    </svg>
  );
};

const Badge = ({ label, type }) => (
  <span className={`badge badge-${type}`}>
    <span className="badge-icon">{type === "match" ? "✓" : "✗"}</span>{label}
  </span>
);

const MatchBadge = ({ label, value }) => (
  <div className={`match-badge match-badge-${value?.toLowerCase()}`}>
    <div className="match-badge-label">{label}</div>
    <div className="match-badge-value">{value}</div>
  </div>
);

export default function App() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const analyze = async () => {
    if (!jd.trim() || !resume.trim()) { setError("Please provide both a job description and your resume."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jd, resume }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Analysis failed. Make sure the backend is running and your API key is set.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result.rewritten_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-row">
            <div className="logo-icon">⚡</div>
            <div>
              <div className="logo-text">Resume<span className="accent">IQ</span></div>
              <div className="logo-sub">AI-POWERED JOB APPLICATION INTELLIGENCE</div>
            </div>
          </div>
          <p className="header-desc">Paste a job description and your resume. Get your ATS score, skill gap analysis, and a tailored summary — powered by Claude AI.</p>
        </div>
      </header>
      <main className="main">
        <div className="input-grid">
          {[
            { label: "JOB DESCRIPTION", value: jd, set: setJd, placeholder: "Paste the full job description here..." },
            { label: "YOUR RESUME", value: resume, set: setResume, placeholder: "Paste your resume text here..." },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label} className="input-col">
              <div className="input-label">{label}</div>
              <textarea value={value} onChange={e => set(e.target.value)} placeholder={placeholder} className={`textarea ${value ? "filled" : ""}`} />
            </div>
          ))}
        </div>
        {error && <div className="error-box">{error}</div>}
        <button onClick={analyze} disabled={loading} className={`analyze-btn ${loading ? "loading" : ""}`}>
          {loading ? <><span className="spinner" />Analyzing...</> : <>⚡ Analyze my application</>}
        </button>
        {result && (
          <div ref={resultRef} className="results">
            <div className="score-card">
              <ScoreRing score={result.ats_score} />
              <div className="score-content">
                <div className="section-eyebrow">OVERALL ASSESSMENT</div>
                <p className="assessment-text">{result.summary_assessment}</p>
                <div className="match-badges">
                  <MatchBadge label="Keyword density" value={result.keyword_density} />
                  <MatchBadge label="Experience match" value={result.experience_match} />
                  <MatchBadge label="Domain match" value={result.domain_match} />
                </div>
              </div>
            </div>
            <div className="skills-grid">
              {[
                { title: `Matched skills (${result.matched_skills.length})`, items: result.matched_skills, type: "match", accent: "success" },
                { title: `Missing skills (${result.missing_skills.length})`, items: result.missing_skills, type: "miss", accent: "danger" },
              ].map(({ title, items, type, accent }) => (
                <div key={type} className="card">
                  <div className={`card-eyebrow eyebrow-${accent}`}>
                    <div className={`eyebrow-bar bar-${accent}`} />{title.toUpperCase()}
                  </div>
                  <div className="badges-wrap">
                    {items.length ? items.map(s => <Badge key={s} label={s} type={type} />) :
                      <span className="empty-note">{type === "match" ? "No direct matches found" : "No critical gaps found"}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-eyebrow eyebrow-accent"><div className="eyebrow-bar bar-accent" />AI-TAILORED PROFESSIONAL SUMMARY</div>
              <div className="summary-box">{result.rewritten_summary}</div>
              <button onClick={copy} className="copy-btn">{copied ? "✓ Copied!" : "Copy to clipboard"}</button>
            </div>
            <div className="card">
              <div className="card-eyebrow eyebrow-warning"><div className="eyebrow-bar bar-warning" />TOP RECOMMENDATIONS</div>
              {result.top_recommendations.map((rec, i) => (
                <div key={i} className="rec-row">
                  <div className="rec-num">{i + 1}</div>
                  <p className="rec-text">{rec}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setResult(null); setJd(""); setResume(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="reset-btn">↑ Start new analysis</button>
          </div>
        )}
      </main>
    </div>
  );
}