import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { UploadZone } from "@/components/UploadZone";
import { postPredictRole } from "@/lib/api";

export const Route = createFileRoute("/predict")({
  component: PredictPage,
  head: () => ({
    meta: [
      { title: "Predict Role — Resumatch" },
      { name: "description", content: "Detect your best-fit role and discover live job openings." },
    ],
  }),
});

type Job = Record<string, any>;
type Result = { predicted_role: string; jobs: Job[] };

function pickField(j: Job, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = j[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return undefined;
}

function PredictPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const run = async () => {
    if (!file) { setError("Resume required."); return; }
    setError(null);
    setLoading(true);
    try {
      const data = await postPredictRole(file);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Failed to predict.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar showLinks current="predict" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1 }}>
        <div style={{ padding: 28, borderRight: "1px solid #1e1e1e" }}>
          <div className="panel-label">01 — Input</div>
          <UploadZone file={file} onFile={setFile} />
          <button className="action-btn" style={{ marginTop: 24 }} onClick={run} disabled={loading}>
            {loading ? "→ Detecting..." : "→ Detect Role"}
          </button>
          {error && <div className="error-text">{error}</div>}
        </div>
        <div style={{ padding: 28, background: "#080808" }}>
          <div className="panel-label">02 — Output</div>
          {!result ? (
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 1, padding: 40, textAlign: "center", border: "1px dashed #1e1e1e", borderRadius: 4 }}>
              // AWAITING INPUT
            </div>
          ) : (
            <>
              <div className="role-block">
                <div className="role-lbl">Detected Role</div>
                <div className="role-name">{result.predicted_role}</div>
              </div>
              <div className="skills-label">Live Jobs</div>
              {(!result.jobs || result.jobs.length === 0) && (
                <div style={{ fontSize: 10, color: "#444", padding: 12 }}>// no jobs found</div>
              )}
              {result.jobs?.map((j, i) => {
                const title = pickField(j, ["title", "job_title", "Title", "name"]) ?? "Role";
                const company = pickField(j, ["company", "Company", "employer"]);
                const location = pickField(j, ["location", "Location", "city"]);
                const score = pickField(j, ["score", "match_score", "similarity"]);
                const link = pickField(j, ["link", "url", "apply_link", "Link"]);
                const meta = [score && `${score}%`, company, location].filter(Boolean).join(" · ");
                return (
                  <div key={i} className="job-card">
                    <div>
                      <p className="job-title-text">{title}</p>
                      <p className="job-meta">{meta || "—"}</p>
                    </div>
                    {link ? (
                      <a className="apply-btn" href={link} target="_blank" rel="noreferrer">Apply →</a>
                    ) : (
                      <button className="apply-btn">Apply →</button>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
