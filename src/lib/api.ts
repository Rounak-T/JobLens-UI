const API_BASE = (typeof window !== "undefined" && (window as any).__RESUMATCH_API__) || "http://127.0.0.1:8000";

export async function postResumeAnalysis(file: File, jd: string) {
  const fd = new FormData();
  fd.append("UserFile", file);
  fd.append("raw_jd_text", jd);
  const res = await fetch(`${API_BASE}/resume-analysis`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  return json.data as { match_score: number; missing_skills: string[]; matched_skills: string[] };
}

export async function postPredictRole(file: File) {
  const fd = new FormData();
  fd.append("UserFile", file);
  const res = await fetch(`${API_BASE}/predict-role`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  return json.data as { predicted_role: string; jobs: Array<Record<string, any>> };
}
