import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { UploadZone } from "@/components/UploadZone";
import { postResumeAnalysis } from "@/lib/api";

export const Route = createFileRoute("/analysis")({
  component: AnalysisPage,
  head: () => ({
    meta: [
      { title: "Resume Analysis — Joblens" },
      { name: "description", content: "Score your resume against any job description and see matched/missing skills." },
    ],
  }),
});

type Result = { match_score: number; matched_skills: string[]; missing_skills: string[] };

function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const run = async () => {
    if (!file || !jd.trim()) {
      setError("Resume and job description required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await postResumeAnalysis(file, jd);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Failed to analyse.");
    } finally {
      setLoading(false);
    }
  };

  const score = result ? Math.round(result.match_score * (result.match_score <= 1 ? 100 : 1)) : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar showLinks current="analysis" />
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1 }}>
        <div className="split-pane split-pane-left" style={{ padding: 28, borderRight: "1px solid #1e1e1e" }}>
          <div className="panel-label">01 — Input</div>
          <UploadZone file={file} onFile={setFile} />
          <label className="field-label">Job Description</label>
          <textarea
            className="input-area"
            placeholder="// paste job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <button className="action-btn" onClick={run} disabled={loading}>
            {loading ? "→ Analysing..." : "→ Run Analysis"}
          </button>
          {error && <div className="error-text">{error}</div>}
        </div>
        <div className="split-pane" style={{ padding: 28, background: "#080808" }}>
          <div className="panel-label">02 — Output</div>
          {!result ? (
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 1, padding: 40, textAlign: "center", border: "1px dashed #1e1e1e", borderRadius: 4 }}>
              // AWAITING INPUT
            </div>
          ) : (
            <>
              <div className="score-block">
                <div className="score-big">{score}%</div>
                <div className="score-sub">Match Score</div>
              </div>
              <div className="skills-section">
                <div className="skills-label">Matched</div>
                <div className="tags">
                  {result.matched_skills.length === 0 && <span className="tag matched">— none —</span>}
                  {result.matched_skills.map((s) => <span key={s} className="tag matched">{s}</span>)}
                </div>
              </div>
              <div className="skills-section">
                <div className="skills-label">Missing</div>
                <div className="tags">
                  {result.missing_skills.length === 0 && <span className="tag missing">— none —</span>}
                  {result.missing_skills.map((s) => <span key={s} className="tag missing">{s}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
