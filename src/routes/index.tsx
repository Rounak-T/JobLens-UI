import { createFileRoute, Link } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Resumatch — AI Resume Matcher" },
      { name: "description", content: "Upload your resume. Score it against a JD or detect your best role." },
    ],
  }),
});

function Landing() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", position: "relative" }}>
        <div className="corner-mark tl" />
        <div className="corner-mark tr" />
        <div className="corner-mark bl" />
        <div className="corner-mark br" />

        <div className="system-tag">SYSTEM · READY</div>

        <h1 className="landing-title">
          RESUME<br />
          <span className="dot-accent">///</span> MATCHER
        </h1>
        <p className="landing-sub">
          UPLOAD YOUR RESUME.<br />
          LET AI DO THE REST.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 560 }}>
          <Link to="/analysis" className="option-card">
            <div className="card-num">01 — ANALYSE</div>
            <div className="card-icon-row">
              <div className="dot-icon" /><div className="dot-icon" />
              <div className="dot-icon dim" /><div className="dot-icon dim" /><div className="dot-icon dim" />
            </div>
            <div className="card-title">Resume Analysis</div>
            <div className="card-desc">Score your resume against a job description. See what matches and what's missing.</div>
            <div className="card-cta"><div className="cta-arrow" />RUN ANALYSIS</div>
          </Link>

          <Link to="/predict" className="option-card">
            <div className="card-num">02 — PREDICT</div>
            <div className="card-icon-row">
              <div className="dot-icon" /><div className="dot-icon" />
              <div className="dot-icon" /><div className="dot-icon" /><div className="dot-icon dim" />
            </div>
            <div className="card-title">Predict My Role</div>
            <div className="card-desc">Let AI detect your best job role and find live openings matched to your profile.</div>
            <div className="card-cta"><div className="cta-arrow" />DETECT ROLE</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
