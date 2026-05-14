import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getApiBase, setApiBase } from "@/lib/api";

export function NavBar({ showLinks = false, current }: { showLinks?: boolean; current?: "analysis" | "predict" }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => { setUrl(getApiBase()); }, [open]);

  const save = () => { setApiBase(url); setOpen(false); };

  return (
    <nav className="nav-bar">
      <Link to="/" className="logo">
        <span className="logo-dot" />
        RESUMATCH
      </Link>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {showLinks && (
          <>
            {current !== "analysis" && <Link to="/analysis" className="nav-btn">Resume Analysis</Link>}
            {current !== "predict" && <Link to="/predict" className="nav-btn">Predict Role</Link>}
            <Link to="/" className="nav-btn">Home</Link>
          </>
        )}
        <button className="nav-btn" onClick={() => setOpen((v) => !v)}>API</button>
      </div>
      {open && (
        <div style={{ position: "absolute", top: 56, right: 16, background: "#0a0a0a", border: "1px solid #1e1e1e", padding: 12, borderRadius: 4, zIndex: 50, width: 360 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 8 }}>API BASE URL</div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-backend.ngrok-free.app"
            style={{ width: "100%", background: "#000", border: "1px solid #1e1e1e", color: "#eee", padding: "8px 10px", fontSize: 12, fontFamily: "monospace", borderRadius: 3 }}
          />
          <div style={{ fontSize: 10, color: "#666", marginTop: 6, lineHeight: 1.5 }}>
            HTTPS previews can't call <code>http://127.0.0.1</code> (mixed content). Use ngrok or run locally.
          </div>
          <button className="nav-btn" style={{ marginTop: 8 }} onClick={save}>Save</button>
        </div>
      )}
    </nav>
  );
}
