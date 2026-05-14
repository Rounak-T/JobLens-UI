import { Link } from "@tanstack/react-router";

export function NavBar({ showLinks = false, current }: { showLinks?: boolean; current?: "analysis" | "predict" }) {
  return (
    <nav className="nav-bar">
      <Link to="/" className="logo">
        <span className="logo-dot" />
        RESUMATCH
      </Link>
      {showLinks && (
        <div style={{ display: "flex", gap: 6 }}>
          {current !== "analysis" && (
            <Link to="/analysis" className="nav-btn">Resume Analysis</Link>
          )}
          {current !== "predict" && (
            <Link to="/predict" className="nav-btn">Predict Role</Link>
          )}
          <Link to="/" className="nav-btn">Home</Link>
        </div>
      )}
    </nav>
  );
}
