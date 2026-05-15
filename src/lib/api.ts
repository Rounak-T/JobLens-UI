const DEFAULT_API = import.meta.env.VITE_API_URL;

export function getApiBase(): string {
  if (typeof window === "undefined") return DEFAULT_API;
  return localStorage.getItem("RESUMATCH_API") || (window as any).__RESUMATCH_API__ || DEFAULT_API;
}

export function setApiBase(url: string) {
  if (typeof window === "undefined") return;
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed) localStorage.setItem("RESUMATCH_API", trimmed);
  else localStorage.removeItem("RESUMATCH_API");
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return j.detail || j.message || `Request failed: ${res.status}`;
  } catch {
    return `Request failed: ${res.status}`;
  }
}

async function safeFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (e: any) {
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const isHttpTarget = url.startsWith("http://");
    if (isHttps && isHttpTarget) {
      throw new Error(
        "Browser blocked HTTP request from HTTPS preview (mixed content). Set an HTTPS API URL (e.g. ngrok) in the API settings, or run the frontend locally on http://localhost:5173.",
      );
    }
    throw new Error(e?.message || "Network error — is the backend reachable?");
  }
}

export async function postResumeAnalysis(file: File, jd: string) {
  const fd = new FormData();
  fd.append("UserFile", file);
  fd.append("raw_jd_text", jd);
  const res = await safeFetch(`${getApiBase()}/resume-analysis`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await parseError(res));
  const json = await res.json();
  return json.data as { match_score: number; missing_skills: string[]; matched_skills: string[] };
}

export async function postPredictRole(file: File) {
  const fd = new FormData();
  fd.append("UserFile", file);
  const res = await safeFetch(`${getApiBase()}/predict-role`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await parseError(res));
  const json = await res.json();
  return json.data as { predicted_role: string; jobs: Array<Record<string, any>> };
}
