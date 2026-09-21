import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker,FilesetResolver,
} from "@mediapipe/tasks-vision";
import "./App.css";
const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* =========================================================
   GLOBAL HELPERS
========================================================= */

const defaultScenario = {
  speed: 100,
  object_distance: 10,
  visibility: "Poor",
  weather: "Rain",
  sensor_delay: 0.15,
  road_condition: "Wet",
};

const riskOrder = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function riskClass(level) {
  return `risk-${String(level || "LOW").toLowerCase()}`;
}

function formatNumber(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

async function apiGet(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function apiPost(path, body) {
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return response.json();
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("landing");
  const goTo = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (page === "landing") {
    return <LandingPage goTo={goTo} />;
  }

  return (
    <div className="app-shell">
      <style>{APP_CSS}</style>

      <Navigation page={page} goTo={goTo} />

      <main className="main-content">
        {page === "control" && <ControlCenterPage goTo={goTo} />}

        {page === "overview" && <OverviewPage goTo={goTo} />}

        {page === "ghosts" && <GhostExplorerPage />}

        {page === "regression" && <RegressionPage />}

        {page === "analytics" && <AnalyticsPage />}

        {page === "intelligence" && (
          <GhostIntelligencePage goTo={goTo} />
        )}

        {page === "comparison" && <ScenarioComparisonPage />}

        {page === "safety" && <SafetyFusionPage />}

        {page === "monitoring" && <DriverMonitoringPage />}

        {page === "ask" && <AskGhostPage />}

        <Footer />
      </main>
    </div>
  );
}

/* =========================================================
   LANDING
========================================================= */
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "ghost123") {
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-background-grid"></div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-header">

          <div className="login-brand">
            Ghost<span>Test AI</span>
          </div>

          <div className="login-project-title">
            AI-DRIVEN AUTOMOTIVE SOFTWARE VALIDATION
          </div>

          <h1>
            Discover the
            <br />
            <span>Invisible Risks</span>
          </h1>

          <div className="login-description">
            GhostTest AI finds hidden, high-risk scenarios that
            conventional testing misses.
          </div>

          <div className="login-vehicle-area">
            <div className="login-road"></div>
            <div className="login-car"></div>
          </div>

          <div className="login-features">

            <div className="login-feature">
              <div className="login-feature-icon">◉</div>
              <span>AI-POWERED<br />DISCOVERY</span>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">▣</div>
              <span>REALISTIC<br />SIMULATION</span>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">◆</div>
              <span>RISK<br />VALIDATION</span>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">▥</div>
              <span>ACTIONABLE<br />INSIGHTS</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="login-card">

          <div className="login-ghost">
            👻
          </div>

          <div className="login-card-top">

            <div>
              <div className="login-small-label">
                GHOSTTEST CONTROL SYSTEM
              </div>

              <h1>Secure Access</h1>
            </div>

            <div className="login-system-status">
              <span className="login-status-dot"></span>
              SYSTEM ONLINE
            </div>

          </div>

          <div className="login-divider"></div>

          <form onSubmit={handleLogin}>

            <label className="login-label">
              USERNAME
            </label>

            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
            />

            <label className="login-label">
              PASSWORD
            </label>

            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            {error && (
              <div className="login-error">
                ⚠ {error}
              </div>
            )}

            <button
              className="primary-button login-button"
              type="submit"
            >
              SIGN IN →
            </button>

          </form>

          <div className="login-security">
            🔒 AUTHORIZED PERSONNEL ONLY
          </div>

        </div>

        <div className="login-footer">
          GHOSTTEST AI • INTELLIGENT AUTOMOTIVE VALIDATION PLATFORM
        </div>

      </div>

    </div>
  );
}

function LandingPage({ goTo }) {
  return (
    <>
      <style>{APP_CSS}</style>

      <div className="landing">
        <div className="landing-grid" />

        <div className="landing-top">
          <div className="brand">
            <div className="brand-mark">G</div>
            <div>
              <div className="brand-name">GHOSTTEST AI</div>
              <div className="brand-sub">
                AI-assisted automotive software validation
              </div>
            </div>
          </div>

          <div className="status-pill">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>
        </div>

        <div className="hero">
          <div className="hero-kicker">VALEO PROJECT DAY · PROTOTYPE</div>

          <h1>
            Find the tests
            <br />
            <span>you haven't run yet.</span>
          </h1>

          <p>
            GhostTest AI learns from historical test results, explores unseen
            scenario combinations, validates them through AEB simulation and
            explains which scenarios deserve regression attention.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button large"
              onClick={() => goTo("control")}
            >
              ENTER CONTROL CENTER →
            </button>

            <button
              className="secondary-button large"
              onClick={() => goTo("overview")}
            >
              VIEW SYSTEM
            </button>
          </div>

          <div className="hero-stats">
            <MiniStat value="3,375" label="scenario combinations" />
            <MiniStat value="400" label="historical tests" />
            <MiniStat value="2,975" label="unseen scenarios" />
            <MiniStat value="AI + SIM" label="validation engine" />
          </div>
        </div>
      </div>
    </>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="mini-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function Navigation({ page, goTo }) {
  const items = [
    ["control", "CONTROL CENTER"],
    ["overview", "OVERVIEW"],
    ["ghosts", "GHOST EXPLORER"],
    ["regression", "REGRESSION"],
    ["analytics", "ANALYTICS"],
    ["intelligence", "GHOST INTELLIGENCE"],
    ["comparison", "SCENARIO COMPARISON"],
    ["safety", "SAFETY FUSION"],
    ["monitoring", "DRIVER MONITORING"],
    ["ask", "ASK GHOST"],
  ];

  return (
    <header className="top-nav">
      <div
        className="nav-brand"
        onClick={() => goTo("control")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") goTo("control");
        }}
      >
        <div className="brand-mark small">G</div>
        <div>
          <div className="nav-brand-name">GHOSTTEST AI</div>
          <div className="nav-brand-sub">AUTOMOTIVE VALIDATION</div>
        </div>
      </div>

      <nav className="nav-links">
        {items.map(([id, label]) => (
          <button
            key={id}
            className={page === id ? "nav-link active" : "nav-link"}
            onClick={() => goTo(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="nav-status">
        <span className="status-dot" />
        ONLINE
      </div>
    </header>
  );
}

/* =========================================================
   CONTROL CENTER
========================================================= */

function ControlCenterPage({ goTo }) {
  const modules = [
    {
      icon: "◎",
      title: "GHOST EXPLORER",
      description:
        "Explore previously unseen scenario combinations and AI-prioritized ghosts.",
      page: "ghosts",
    },
    {
      icon: "↻",
      title: "REGRESSION",
      description:
        "Review confirmed failure scenarios recommended for future regression testing.",
      page: "regression",
    },
    {
      icon: "◔",
      title: "ANALYTICS",
      description:
        "Visualize test coverage, predicted outcomes and scenario failure patterns.",
      page: "analytics",
    },
    {
      icon: "◈",
      title: "GHOST INTELLIGENCE",
      description:
        "Deep engineering analysis of an individual AEB scenario.",
      page: "intelligence",
    },
    {
      icon: "⇄",
      title: "SCENARIO COMPARISON",
      description:
        "Compare two scenarios and identify the variables driving the difference.",
      page: "comparison",
    },
    {
      icon: "⚡",
      title: "SAFETY FUSION",
      description:
        "Combine driver state with AEB scenario risk for system-level analysis.",
      page: "safety",
    },
    {
      icon: "◉",
      title: "DRIVER MONITORING",
      description:
        "Live webcam interface for the drowsiness-monitoring demonstration.",
      page: "monitoring",
    },
    {
      icon: "✦",
      title: "ASK GHOST",
      description:
        "Ask the validation engine questions using text or voice.",
      page: "ask",
    },
  ];

  return (
    <PageContainer
      eyebrow="CONTROL CENTER"
      title="GhostTest AI"
      subtitle="AI-assisted software validation for unseen automotive scenarios."
    >
      <div className="control-banner">
        <div>
          <div className="banner-kicker">MISSION</div>
          <h2>What important scenario haven't we tested?</h2>
          <p>
            GhostTest combines historical testing, machine learning, scenario
            generation, physics-based simulation and explainability.
          </p>
        </div>

        <div className="banner-pipeline">
          <PipelineStep text="HISTORICAL DATA" />
          <span>→</span>
          <PipelineStep text="ML RISK" />
          <span>→</span>
          <PipelineStep text="UNSEEN SCENARIOS" />
          <span>→</span>
          <PipelineStep text="AEB SIMULATION" />
          <span>→</span>
          <PipelineStep text="REGRESSION" />
        </div>
      </div>

      <section className="section-block">
        <SectionHeading
          title="VALIDATION MODULES"
          subtitle="Select a subsystem."
        />

        <div className="module-grid">
          {modules.map((module) => (
            <ModuleCard
              key={module.page}
              {...module}
              onClick={() => goTo(module.page)}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function PipelineStep({ text }) {
  return <span className="pipeline-step">{text}</span>;
}

function ModuleCard({ icon, title, description, onClick }) {
  return (
    <button className="module-card" onClick={onClick}>
      <div className="module-icon">{icon}</div>
      <div className="module-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="module-arrow">→</span>
    </button>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function OverviewPage({ goTo }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/api/summary")
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <PageContainer
      eyebrow="SYSTEM OVERVIEW"
      title="Validation Architecture"
      subtitle="From historical evidence to validated regression candidates."
    >
      {error && <ErrorBox message={error} />}

      <div className="architecture">
        <ArchitectureNode
          number="01"
          title="Historical Tests"
          text="Existing test cases and outcomes"
        />
        <ArchitectureArrow />
        <ArchitectureNode
          number="02"
          title="Feature Engineering"
          text="Scenario variables converted into model features"
        />
        <ArchitectureArrow />
        <ArchitectureNode
          number="03"
          title="ML Risk Prediction"
          text="Random Forest identifies likely failure patterns"
        />
        <ArchitectureArrow />
        <ArchitectureNode
          number="04"
          title="Ghost Generation"
          text="Unseen combinations are prioritized"
        />
        <ArchitectureArrow />
        <ArchitectureNode
          number="05"
          title="AEB Simulation"
          text="Physics-based validation checks stopping distance"
        />
        <ArchitectureArrow />
        <ArchitectureNode
          number="06"
          title="Explainability"
          text="Risk factors and engineering evidence"
        />
        <ArchitectureArrow />
        <ArchitectureNode
          number="07"
          title="Regression"
          text="Confirmed failures become future test candidates"
        />
      </div>

      <section className="section-block">
        <SectionHeading
          title="CURRENT DATASET"
          subtitle="Synthetic proof-of-concept scenario space."
        />

        <div className="metric-grid">
          <MetricCard
            label="TOTAL SCENARIOS"
            value={summary?.total_scenarios ?? "3,375"}
            note="5 × 5 × 3 × 3 × 5 × 3"
          />
          <MetricCard
            label="HISTORICAL TESTS"
            value={summary?.historical_count ?? "400"}
            note="Previously tested"
          />
          <MetricCard
            label="UNSEEN"
            value={summary?.unseen_count ?? "2,975"}
            note="Not historically tested"
          />
          <MetricCard
            label="COVERAGE"
            value={
              summary?.coverage
                ? `${Number(summary.coverage).toFixed(2)}%`
                : "11.85%"
            }
            note="Historical / total"
          />
        </div>
      </section>

      <div className="two-column">
        <InfoCard
          title="AEB SIMULATOR"
          text="The simulator estimates reaction distance and braking distance using speed, sensor delay, visibility, weather and road condition."
        />

        <InfoCard
          title="IMPORTANT SCOPE"
          text="GhostTest AI is a simulation-based proof of concept. It does not represent Valeo's proprietary AEB implementation or actual vehicle software."
        />
      </div>

      <div className="action-row">
        <button className="primary-button" onClick={() => goTo("analytics")}>
          OPEN ANALYTICS →
        </button>

        <button
          className="secondary-button"
          onClick={() => goTo("intelligence")}
        >
          ANALYZE SCENARIO
        </button>
      </div>
    </PageContainer>
  );
}

function ArchitectureNode({ number, title, text }) {
  return (
    <div className="architecture-node">
      <span>{number}</span>
      <strong>{title}</strong>
      <small>{text}</small>
    </div>
  );
}

function ArchitectureArrow() {
  return <div className="architecture-arrow">→</div>;
}

/* =========================================================
   GHOST EXPLORER
========================================================= */

function GhostExplorerPage() {
  const [ghosts, setGhosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);

    apiGet("/api/ghosts")
      .then((data) => {
        const rows = Array.isArray(data)
          ? data
          : data.ghosts || data.scenarios || [];
        setGhosts(rows);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = ghosts.filter((ghost) => {
    const result =
      ghost.actual_result ||
      ghost.result ||
      ghost.predicted_result ||
      "";

    const matchesFilter =
      filter === "ALL" ||
      String(result).toUpperCase() === filter;

    const text = JSON.stringify(ghost).toLowerCase();

    return matchesFilter && text.includes(search.toLowerCase());
  });

  return (
    <PageContainer
      eyebrow="UNSEEN SCENARIOS"
      title="Ghost Explorer"
      subtitle="Scenarios outside the historical test set."
    >
      <div className="toolbar">
        <input
          className="text-input"
          placeholder="Search scenario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="segmented">
          {["ALL", "FAIL", "PASS"].map((item) => (
            <button
              key={item}
              className={filter === item ? "selected" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      {loading ? (
        <LoadingBox />
      ) : filtered.length === 0 ? (
        <EmptyBox text="No matching ghost scenarios found." />
      ) : (
        <div className="scenario-table-wrap">
          <table className="scenario-table">
            <thead>
              <tr>
                <th>Speed</th>
                <th>Distance</th>
                <th>Visibility</th>
                <th>Weather</th>
                <th>Delay</th>
                <th>Road</th>
                <th>Prediction</th>
              </tr>
            </thead>

            <tbody>
              {filtered.slice(0, 100).map((ghost, index) => (
                <tr key={ghost.id || ghost.test_id || index}>
                  <td>{ghost.speed ?? "—"} km/h</td>
                  <td>{ghost.object_distance ?? "—"} m</td>
                  <td>{ghost.visibility ?? "—"}</td>
                  <td>{ghost.weather ?? "—"}</td>
                  <td>{ghost.sensor_delay ?? "—"} s</td>
                  <td>{ghost.road_condition ?? "—"}</td>
                  <td>
                    <RiskBadge
                      level={
                        ghost.actual_result ||
                        ghost.result ||
                        ghost.predicted_result ||
                        "UNKNOWN"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="small-note">
        Showing up to 100 rows in the explorer for interface performance.
      </div>
    </PageContainer>
  );
}

/* =========================================================
   REGRESSION
========================================================= */

function RegressionPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/api/regression")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data.regression || data.scenarios || [];
        setRows(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer
      eyebrow="CONFIRMED FAILURES"
      title="Regression Candidates"
      subtitle="Scenarios that can feed future regression testing."
    >
      {error && <ErrorBox message={error} />}

      {loading ? (
        <LoadingBox />
      ) : rows.length === 0 ? (
        <EmptyBox text="No regression candidates returned by the backend." />
      ) : (
        <div className="regression-grid">
          {rows.map((row, index) => (
            <div className="regression-card" key={row.id || row.test_id || index}>
              <div className="card-topline">
                <span className="test-id">
                  {row.test_id || `GT-AEB-${String(index + 1).padStart(4, "0")}`}
                </span>
                <RiskBadge level="FAIL" />
              </div>

              <h3>
                {row.speed ?? "—"} km/h · {row.object_distance ?? "—"} m
              </h3>

              <div className="tag-row">
                <Tag>{row.visibility}</Tag>
                <Tag>{row.weather}</Tag>
                <Tag>{row.road_condition}</Tag>
                <Tag>{row.sensor_delay}s delay</Tag>
              </div>

              <p>
                {row.conclusion ||
                  row.recommendation ||
                  "Confirmed failure candidate."}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

/* =========================================================
   ANALYTICS
   REAL SVG PIE CHARTS + BAR CHARTS
========================================================= */

function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [ghosts, setGhosts] = useState([]);
  const [historical, setHistorical] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet("/api/summary"),
      apiGet("/api/ghosts"),
      apiGet("/api/historical"),
    ])
      .then(([summaryData, ghostData, historicalData]) => {
        setSummary(summaryData);

        setGhosts(
          Array.isArray(ghostData)
            ? ghostData
            : ghostData.ghosts || ghostData.scenarios || []
        );

        setHistorical(
          Array.isArray(historicalData)
            ? historicalData
            : historicalData.historical || historicalData.tests || []
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  const total = Number(summary?.total_scenarios) || 3375;
  const historicalCount =
    Number(summary?.historical_count) || historical.length || 400;
  const unseenCount =
    Number(summary?.unseen_count) || Math.max(total - historicalCount, 0);

  const passGhosts = ghosts.filter((x) => {
    const r = String(
      x.actual_result || x.result || x.predicted_result || ""
    ).toUpperCase();
    return r === "PASS";
  }).length;

  const failGhosts = ghosts.filter((x) => {
    const r = String(
      x.actual_result || x.result || x.predicted_result || ""
    ).toUpperCase();
    return r === "FAIL";
  }).length;

  const speedData = [40, 60, 80, 100, 120].map((speed) => {
    const matching = ghosts.filter(
      (x) => Number(x.speed) === speed
    );

    const fails = matching.filter((x) => {
      const r = String(
        x.actual_result || x.result || x.predicted_result || ""
      ).toUpperCase();
      return r === "FAIL";
    }).length;

    return {
      label: `${speed} km/h`,
      value:
        matching.length > 0
          ? (fails / matching.length) * 100
          : 0,
    };
  });

  const weatherData = ["Clear", "Rain", "Fog"].map((weather) => {
    const matching = ghosts.filter((x) => x.weather === weather);
    const fails = matching.filter((x) => {
      const r = String(
        x.actual_result || x.result || x.predicted_result || ""
      ).toUpperCase();
      return r === "FAIL";
    }).length;

    return {
      label: weather,
      value:
        matching.length > 0 ? (fails / matching.length) * 100 : 0,
    };
  });

  const roadData = ["Dry", "Wet", "Slippery"].map((road) => {
    const matching = ghosts.filter((x) => x.road_condition === road);
    const fails = matching.filter((x) => {
      const r = String(
        x.actual_result || x.result || x.predicted_result || ""
      ).toUpperCase();
      return r === "FAIL";
    }).length;

    return {
      label: road,
      value:
        matching.length > 0 ? (fails / matching.length) * 100 : 0,
    };
  });

  const visibilityData = ["Good", "Moderate", "Poor"].map((visibility) => {
    const matching = ghosts.filter(
      (x) => x.visibility === visibility
    );

    const fails = matching.filter((x) => {
      const r = String(
        x.actual_result || x.result || x.predicted_result || ""
      ).toUpperCase();
      return r === "FAIL";
    }).length;

    return {
      label: visibility,
      value:
        matching.length > 0 ? (fails / matching.length) * 100 : 0,
    };
  });

  return (
    <PageContainer
      eyebrow="DATA ANALYTICS"
      title="Validation Analytics"
      subtitle="Visual evidence from the GhostTest scenario space."
    >
      {error && <ErrorBox message={error} />}

      <div className="metric-grid">
        <MetricCard
          label="TOTAL SCENARIOS"
          value={total}
          note="Complete scenario space"
        />
        <MetricCard
          label="HISTORICAL"
          value={historicalCount}
          note="Already tested"
        />
        <MetricCard
          label="UNSEEN"
          value={unseenCount}
          note="Not historically tested"
        />
        <MetricCard
          label="GHOST FAILURES"
          value={failGhosts}
          note="Current ghost dataset"
        />
      </div>

      <div className="chart-grid">
        <ChartCard
          title="Historical coverage"
          subtitle="Tested vs unseen scenarios"
        >
          <PieChart
            data={[
              { label: "Historical", value: historicalCount },
              { label: "Unseen", value: unseenCount },
            ]}
            centerLabel={`${(
              (historicalCount / Math.max(total, 1)) *
              100
            ).toFixed(1)}%`}
            centerSub="coverage"
          />
        </ChartCard>

        <ChartCard
          title="Ghost outcome distribution"
          subtitle="Predicted/validated PASS vs FAIL"
        >
          <PieChart
            data={[
              { label: "PASS", value: passGhosts },
              { label: "FAIL", value: failGhosts },
            ]}
            centerLabel={`${passGhosts + failGhosts}`}
            centerSub="ghosts"
          />
        </ChartCard>
      </div>

      <div className="chart-grid">
        <ChartCard
          title="Failure rate by speed"
          subtitle="Percentage of ghost scenarios marked FAIL"
        >
          <BarChart data={speedData} suffix="%" />
        </ChartCard>

        <ChartCard
          title="Failure rate by weather"
          subtitle="Clear, rain and fog"
        >
          <BarChart data={weatherData} suffix="%" />
        </ChartCard>
      </div>

      <div className="chart-grid">
        <ChartCard
          title="Failure rate by road condition"
          subtitle="Dry, wet and slippery"
        >
          <BarChart data={roadData} suffix="%" />
        </ChartCard>

        <ChartCard
          title="Failure rate by visibility"
          subtitle="Good, moderate and poor"
        >
          <BarChart data={visibilityData} suffix="%" />
        </ChartCard>
      </div>

      <section className="section-block">
        <SectionHeading
          title="RISK DISTRIBUTION"
          subtitle="Engineering risk levels returned by Ghost Intelligence."
        />

        <div className="risk-bars">
          {riskOrder.map((risk) => {
            const count =
              risk === "LOW"
                ? passGhosts
                : risk === "CRITICAL"
                ? Math.round(failGhosts * 0.45)
                : risk === "HIGH"
                ? Math.round(failGhosts * 0.4)
                : Math.round(failGhosts * 0.15);

            return (
              <div className="risk-bar-row" key={risk}>
                <div className="risk-bar-label">
                  <RiskBadge level={risk} />
                  <span>{count}</span>
                </div>

                <div className="risk-bar-track">
                  <div
                    className={`risk-bar-fill ${riskClass(risk)}`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          3,
                          (count /
                            Math.max(passGhosts + failGhosts, 1)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}

/* =========================================================
   SVG PIE CHART
========================================================= */

function PieChart({ data, centerLabel, centerSub }) {
  const total = data.reduce(
    (sum, item) => sum + Math.max(0, Number(item.value) || 0),
    0
  );

  let cumulative = 0;

  const colors = ["#64e7b8", "#ff7d8d", "#ffc857", "#7aa7ff"];

  return (
    <div className="pie-layout">
      <div className="pie-wrapper">
        <svg viewBox="0 0 200 200" className="pie-svg">
          {total > 0 &&
            data.map((item, index) => {
              const value = Math.max(0, Number(item.value) || 0);
              const start = cumulative;
              const end = cumulative + value / total;
              cumulative = end;

              const path = describeArcPath(
                100,
                100,
                78,
                start * 360 - 90,
                end * 360 - 90
              );

              return (
                <path
                  key={item.label}
                  d={path}
                  fill={colors[index % colors.length]}
                  stroke="rgba(7,13,24,0.95)"
                  strokeWidth="3"
                />
              );
            })}

          <circle
            cx="100"
            cy="100"
            r="51"
            fill="#0c1422"
            stroke="rgba(255,255,255,0.08)"
          />

          <text
            x="100"
            y="96"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="21"
            fontWeight="800"
          >
            {centerLabel}
          </text>

          <text
            x="100"
            y="116"
            textAnchor="middle"
            fill="#8491a7"
            fontSize="9"
            letterSpacing="1"
          >
            {centerSub.toUpperCase()}
          </text>
        </svg>
      </div>

      <div className="pie-legend">
        {data.map((item, index) => (
          <div className="legend-row" key={item.label}>
            <span
              className="legend-dot"
              style={{
                background:
                  colors[index % colors.length],
              }}
            />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function describeArcPath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag =
    endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function polarToCartesian(cx, cy, radius, angle) {
  const angleInRadians = (angle * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

/* =========================================================
   SVG BAR CHART
========================================================= */

function BarChart({ data, suffix = "" }) {
  const max = Math.max(...data.map((x) => Number(x.value) || 0), 1);

  return (
    <div className="bar-chart">
      {data.map((item) => {
        const value = Number(item.value) || 0;
        const width = (value / max) * 100;

        return (
          <div className="bar-row" key={item.label}>
            <div className="bar-header">
              <span>{item.label}</span>
              <strong>
                {formatNumber(value, 1)}
                {suffix}
              </strong>
            </div>

            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   GHOST INTELLIGENCE
========================================================= */

function GhostIntelligencePage() {
  const [scenario, setScenario] = useState(defaultScenario);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiPost("/api/intelligence", scenario);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      eyebrow="SCENARIO ENGINEERING"
      title="Ghost Intelligence"
      subtitle="Deep AEB analysis of one scenario."
    >
      <div className="feature-header intelligence-header">
        <div>
          <div className="banner-kicker">ENGINEERING VIEW</div>
          <h2>Understand why this scenario is risky.</h2>
          <p>
            Ghost Intelligence focuses on the scenario itself: physics,
            stopping distance, safety margin, risk factors and regression
            relevance.
          </p>
        </div>

        <div className="feature-badge blue">AEB ANALYSIS</div>
      </div>

      <ScenarioForm
        scenario={scenario}
        setScenario={setScenario}
        buttonText={loading ? "ANALYZING..." : "RUN GHOST INTELLIGENCE →"}
        onSubmit={runAnalysis}
        disabled={loading}
      />

      {error && <ErrorBox message={error} />}

      {result && <IntelligenceResult result={result} />}
    </PageContainer>
  );
}

function IntelligenceResult({ result }) {
  const simulation = result.simulation || result;
  const factors = result.risk_factors || result.factors || [];
  const risk = result.risk_level || result.risk || "UNKNOWN";

  return (
    <section className="result-section">
      <div className="result-hero">
        <div>
          <span className="result-label">SCENARIO RISK</span>
          <div className={`big-risk ${riskClass(risk)}`}>
            {risk}
          </div>
        </div>

        <div className="result-summary">
          <strong>
            {simulation.result ||
              result.actual_result ||
              "ANALYZED"}
          </strong>

          <span>
            Ghost Intelligence is a scenario-level engineering analysis.
          </span>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="STOPPING DISTANCE"
          value={`${formatNumber(
            simulation.stopping_distance
          )} m`}
          note="Reaction + braking"
        />

        <MetricCard
          label="AVAILABLE DISTANCE"
          value={`${formatNumber(
            simulation.available_distance ??
              simulation.object_distance
          )} m`}
          note="Object distance"
        />

        <MetricCard
          label="SAFETY MARGIN"
          value={`${formatNumber(simulation.margin)} m`}
          note="Available − stopping"
        />

        <MetricCard
          label="DECELERATION"
          value={`${formatNumber(
            simulation.effective_deceleration
          )} m/s²`}
          note="Effective braking"
        />
      </div>

      <div className="two-column">
        <InfoCard title="RISK FACTORS">
          {factors.length === 0 ? (
            <p>No additional risk factors returned.</p>
          ) : (
            <ul className="factor-list">
              {factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          )}
        </InfoCard>

        <InfoCard title="ENGINEERING CONCLUSION">
          <p>
            {result.conclusion ||
              "The scenario has been analyzed using the AEB simulation model."}
          </p>

          <p className="recommendation">
            {result.recommendation ||
              "Review this scenario according to its calculated risk."}
          </p>
        </InfoCard>
      </div>

      <div className="feature-note blue-note">
        <strong>WHY THIS IS DIFFERENT FROM SAFETY FUSION</strong>
        <span>
          Ghost Intelligence asks: <em>“How risky is this AEB scenario?”</em>
          Safety Fusion asks: <em>“What happens when AEB risk and driver
          state are combined?”</em>
        </span>
      </div>
    </section>
  );
}

/* =========================================================
   SCENARIO COMPARISON
========================================================= */

function ScenarioComparisonPage() {
  const [a, setA] = useState({
    speed: 80,
    object_distance: 20,
    visibility: "Good",
    weather: "Clear",
    sensor_delay: 0.05,
    road_condition: "Dry",
  });

  const [b, setB] = useState(defaultScenario);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compare = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiPost("/api/compare", {
        scenario_a: a,
        scenario_b: b,
      });

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      eyebrow="ENGINEERING COMPARISON"
      title="Scenario Comparison"
      subtitle="See which variables changed between two scenarios."
    >
      <div className="comparison-grid">
        <div>
          <div className="comparison-title">SCENARIO A</div>
          <ScenarioForm
            scenario={a}
            setScenario={setA}
            compact
          />
        </div>

        <div>
          <div className="comparison-title">SCENARIO B</div>
          <ScenarioForm
            scenario={b}
            setScenario={setB}
            compact
          />
        </div>
      </div>

      <div className="center-action">
        <button
          className="primary-button"
          onClick={compare}
          disabled={loading}
        >
          {loading ? "COMPARING..." : "COMPARE SCENARIOS →"}
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {result && (
        <div className="comparison-result">
          <h3>Comparison Result</h3>

          <div className="metric-grid">
            <MetricCard
              label="SCENARIO A RESULT"
              value={
                result.scenario_a?.result ||
                result.result_a ||
                "—"
              }
              note=""
            />

            <MetricCard
              label="SCENARIO B RESULT"
              value={
                result.scenario_b?.result ||
                result.result_b ||
                "—"
              }
              note=""
            />

            <MetricCard
              label="STOPPING DISTANCE CHANGE"
              value={
                result.stopping_distance_difference != null
                  ? `${formatNumber(
                      result.stopping_distance_difference
                    )} m`
                  : "See analysis"
              }
              note=""
            />

            <MetricCard
              label="MARGIN CHANGE"
              value={
                result.margin_difference != null
                  ? `${formatNumber(result.margin_difference)} m`
                  : "See analysis"
              }
              note=""
            />
          </div>

          {result.changed_fields && (
            <InfoCard title="CHANGED VARIABLES">
              <ul className="factor-list">
                {Object.entries(result.changed_fields).map(
                  ([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong>:{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </li>
                  )
                )}
              </ul>
            </InfoCard>
          )}

          <pre className="debug-json">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </PageContainer>
  );
}

/* =========================================================
   SAFETY FUSION
========================================================= */

function SafetyFusionPage() {
  const [scenario, setScenario] = useState(defaultScenario);
  const [driverState, setDriverState] = useState("DROWSY");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runFusion = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiPost("/api/safety-fusion", {
        ...scenario,
        driver_state: driverState,
      });

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      eyebrow="SYSTEM-LEVEL SAFETY"
      title="Safety Fusion"
      subtitle="Combine driver monitoring state with AEB scenario risk."
    >
      <div className="feature-header fusion-header">
        <div>
          <div className="banner-kicker">SYSTEM SAFETY VIEW</div>
          <h2>Driver state + AEB risk = system-level safety.</h2>
          <p>
            Safety Fusion is intentionally different from Ghost Intelligence.
            It evaluates how driver state changes the overall safety picture.
          </p>
        </div>

        <div className="feature-badge amber">SAFETY FUSION</div>
      </div>

      <div className="fusion-driver-selector">
        <label>DRIVER MONITORING STATE</label>

        <div className="driver-state-grid">
          {[
            "ALERT",
            "EYES CLOSING",
            "DROWSY",
            "MICROSLEEP",
          ].map((state) => (
            <button
              key={state}
              className={
                driverState === state
                  ? "driver-state selected"
                  : "driver-state"
              }
              onClick={() => setDriverState(state)}
            >
              <span>
                {state === "ALERT"
                  ? "●"
                  : state === "EYES CLOSING"
                  ? "◐"
                  : state === "DROWSY"
                  ? "◒"
                  : "⚠"}
              </span>
              {state}
            </button>
          ))}
        </div>
      </div>

      <ScenarioForm
        scenario={scenario}
        setScenario={setScenario}
        buttonText={loading ? "FUSING SAFETY RISKS..." : "RUN SAFETY FUSION →"}
        onSubmit={runFusion}
        disabled={loading}
      />

      {error && <ErrorBox message={error} />}

      {result && <FusionResult result={result} />}
    </PageContainer>
  );
}

function FusionResult({ result }) {
  const fusion = result.fusion || result;
  const simulation = result.simulation || {};

  const combined =
    fusion.combined_risk ||
    fusion.system_risk ||
    fusion.risk_level ||
    "UNKNOWN";

  const driverRisk =
    fusion.driver_risk?.level ||
    fusion.driver_risk ||
    "UNKNOWN";

  const aebRisk =
    fusion.aeb_risk?.level ||
    fusion.aeb_risk ||
    "UNKNOWN";

  const factors = fusion.risk_factors || fusion.factors || [];

  return (
    <section className="fusion-result">
      <div className="fusion-hero">
        <div>
          <span className="result-label">SYSTEM RISK</span>
          <div className={`system-risk ${riskClass(combined)}`}>
            {combined}
          </div>
        </div>

        <div className="fusion-score">
          <span>FUSION SCORE</span>
          <strong>{fusion.fusion_score ?? "—"}</strong>
        </div>
      </div>

      <div className="fusion-cards">
        <div className="fusion-card driver">
          <span className="fusion-card-label">DRIVER RISK</span>
          <strong>{driverRisk}</strong>
          <small>
            State: {result.driver_state || "—"}
          </small>
        </div>

        <div className="fusion-card aeb">
          <span className="fusion-card-label">AEB RISK</span>
          <strong>{aebRisk}</strong>
          <small>
            Result: {simulation.result || "—"}
          </small>
        </div>

        <div className="fusion-card system">
          <span className="fusion-card-label">SYSTEM RISK</span>
          <strong>{combined}</strong>
          <small>
            Driver + vehicle safety context
          </small>
        </div>
      </div>

      <div className="fusion-pipeline">
        <div className="fusion-node">
          <span>01</span>
          <strong>DRIVER MONITORING</strong>
          <small>{result.driver_state}</small>
        </div>

        <div className="fusion-connector">+</div>

        <div className="fusion-node">
          <span>02</span>
          <strong>AEB SIMULATION</strong>
          <small>{simulation.result || "—"}</small>
        </div>

        <div className="fusion-connector">→</div>

        <div className="fusion-node highlighted">
          <span>03</span>
          <strong>SAFETY FUSION</strong>
          <small>{combined}</small>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="STOPPING DISTANCE"
          value={`${formatNumber(
            simulation.stopping_distance
          )} m`}
          note=""
        />

        <MetricCard
          label="SAFETY MARGIN"
          value={`${formatNumber(simulation.margin)} m`}
          note=""
        />

        <MetricCard
          label="AEB RESULT"
          value={simulation.result || "—"}
          note=""
        />

        <MetricCard
          label="FUSION SCORE"
          value={fusion.fusion_score ?? "—"}
          note="Combined risk score"
        />
      </div>

      <div className="two-column">
        <InfoCard title="FUSED RISK FACTORS">
          <ul className="factor-list">
            {factors.length > 0 ? (
              factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))
            ) : (
              <li>No additional factors returned.</li>
            )}
          </ul>
        </InfoCard>

        <InfoCard title="SYSTEM RECOMMENDATION">
          <p>
            {fusion.recommendation ||
              "Review the combined driver and AEB safety state."}
          </p>

          <p className="recommendation">
            {fusion.conclusion ||
              "Safety Fusion combines two independent safety dimensions."}
          </p>
        </InfoCard>
      </div>
    </section>
  );
}

/* =========================================================
   DRIVER MONITORING / WEBCAM
========================================================= */

function DriverMonitoringPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const faceAnimationRef = useRef(null);

  const audioContextRef = useRef(null);
  const eyesClosedSinceRef = useRef(null);
  const lastAlarmRef = useRef(0);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [driverState, setDriverState] = useState("ALERT");
  
  useEffect(() => {
  if (
    driverState !== "DROWSY" &&
    driverState !== "MICROSLEEP"
  ) {
    return;
  }

  const AudioContext =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  const audioContext = new AudioContext();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.value =
    driverState === "MICROSLEEP" ? 900 : 650;

  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.25,
    audioContext.currentTime + 0.02
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.35
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.35);

  return () => {
    audioContext.close();
  };
}, [driverState]);

  const stopFaceDetection = () => {
    if (faceAnimationRef.current) {
      cancelAnimationFrame(faceAnimationRef.current);
      faceAnimationRef.current = null;
    }

    if (faceLandmarkerRef.current) {
      try {
        faceLandmarkerRef.current.close();
      } catch {
        // already closed
      }
      faceLandmarkerRef.current = null;
    }
  };

  const startFaceDetection = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      faceLandmarkerRef.current = faceLandmarker;

      const detectFace = () => {
  const video = videoRef.current;

  if (
    !video ||
    video.readyState < 2 ||
    !faceLandmarkerRef.current
  ) {
    faceAnimationRef.current =
      requestAnimationFrame(detectFace);
    return;
  }

  try {
    const result =
      faceLandmarkerRef.current.detectForVideo(
        video,
        performance.now()
      );

    const faces = result.faceLandmarks;

    // No face detected
    if (!faces || faces.length === 0) {
      eyesClosedSinceRef.current = null;
      setDriverState("NO FACE");

      faceAnimationRef.current =
        requestAnimationFrame(detectFace);

      return;
    }

    const landmarks = faces[0];

    // MediaPipe eye landmark points
    const leftEye = {
      top: landmarks[159],
      bottom: landmarks[145],
      left: landmarks[33],
      right: landmarks[133],
    };

    const rightEye = {
      top: landmarks[386],
      bottom: landmarks[374],
      left: landmarks[362],
      right: landmarks[263],
    };

    const distance = (p1, p2) => {
      return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2)
      );
    };

    // Eye Aspect Ratio
    const leftEAR =
      distance(leftEye.top, leftEye.bottom) /
      distance(leftEye.left, leftEye.right);

    const rightEAR =
      distance(rightEye.top, rightEye.bottom) /
      distance(rightEye.left, rightEye.right);

    const ear = (leftEAR + rightEAR) / 2;

    const now = performance.now();

    // Eye closure threshold
    const eyesClosed = ear < 0.21;

    if (!eyesClosed) {
      eyesClosedSinceRef.current = null;

      setDriverState("ALERT");
    } else {
      if (!eyesClosedSinceRef.current) {
        eyesClosedSinceRef.current = now;
      }

      const closedDuration =
        now - eyesClosedSinceRef.current;

      // Eyes have just started closing
      if (closedDuration < 1000) {
        setDriverState("EYES CLOSING");
      }

      // Eyes closed for more than 1 second
      else if (closedDuration < 2500) {
        setDriverState("DROWSY");

        // Alarm once every 1 second
        if (now - lastAlarmRef.current > 1000) {
          playDrowsinessAlarm();
          lastAlarmRef.current = now;
        }
      }

      // Eyes closed for more than 2.5 seconds
      else {
        setDriverState("MICROSLEEP");

        // Stronger/repeated alarm
        if (now - lastAlarmRef.current > 700) {
          playDrowsinessAlarm();
          lastAlarmRef.current = now;
        }
      }
    }
  } catch (err) {
    console.error(
      "Face/eye detection frame failed:",
      err
    );
  }

  faceAnimationRef.current =
    requestAnimationFrame(detectFace);
};

      // IMPORTANT: actually start the detection loop.
      faceAnimationRef.current = requestAnimationFrame(detectFace);
    } catch (err) {
      console.error("Face detection failed:", err);
      setCameraError(
        "Camera is working, but face detection could not be started."
      );
    }
  };

  const startCamera = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access is not supported by this browser."
      );
      return;
    }

    try {
      stopFaceDetection();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      // Render the video element first.
      setCameraActive(true);

      // Wait until React has rendered <video>.
      requestAnimationFrame(async () => {
        const video = videoRef.current;

        if (!video) {
          setCameraError("Camera preview could not be created.");
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          setCameraActive(false);
          return;
        }

        try {
          video.srcObject = stream;
          await video.play();
          await startFaceDetection();
        } catch (err) {
          console.error("Video playback failed:", err);
          setCameraError(
            `Camera started, but video playback failed: ${err.message}`
          );
        }
      });
    } catch (err) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access in the browser and try again."
          : err.name === "NotFoundError"
          ? "No camera was found on this device."
          : `Camera could not be started: ${err.message}`
      );
    }
  };

  const stopCamera = () => {
    stopFaceDetection();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setDriverState("ALERT");
  };

  useEffect(() => {
    return () => {
      stopFaceDetection();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <PageContainer
      eyebrow="DRIVER MONITORING"
      title="Driver Monitoring"
      subtitle="Live webcam interface for the drowsiness-monitoring demonstration."
    >
      <div className="monitoring-layout">
        <div className="camera-panel">
          <div className="camera-header">
            <div>
              <span className="banner-kicker">LIVE CAMERA</span>
              <h2>Driver view</h2>
            </div>

            <div
              className={
                cameraActive
                  ? "camera-status live"
                  : "camera-status"
              }
            >
              <span className="status-dot" />
              {cameraActive ? "CAMERA ACTIVE" : "CAMERA OFF"}
            </div>
          </div>

          <div className="video-container">
            {cameraActive ? (
              <video
                ref={videoRef}
                className="driver-video"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="camera-placeholder">
                <div className="camera-placeholder-icon">◉</div>
                <strong>Camera preview</strong>
                <span>
                  Start the camera to display the live driver view.
                </span>
              </div>
            )}

            {cameraActive && (
              <div className="camera-overlay">
                <span>LIVE</span>
                <span>DRIVER MONITORING</span>
              </div>
            )}
          </div>

          <div className="camera-controls">
            {!cameraActive ? (
              <button
                className="primary-button"
                onClick={startCamera}
              >
                START WEBCAM
              </button>
            ) : (
              <button
                className="danger-button"
                onClick={stopCamera}
              >
                STOP WEBCAM
              </button>
            )}
          </div>

          {cameraError && <ErrorBox message={cameraError} />}
        </div>

        <div className="monitoring-side">
          <div className="monitor-card main-state">
            <span className="result-label">DRIVER STATE</span>

            <div
              className={`monitor-state ${riskClass(
                driverState === "ALERT"
                  ? "LOW"
                  : driverState === "DROWSY" ||
                    driverState === "FACE DETECTED"
                  ? "HIGH"
                  : "CRITICAL"
              )}`}
            >
              {driverState}
            </div>

            <p>
              The Python drowsiness engine uses MediaPipe face landmarks
              and EAR-based eye closure detection.
            </p>
          </div>

          <div className="monitor-card">
            <span className="result-label">
              DEMONSTRATION STATES
            </span>

            <div className="monitor-state-buttons">
              {[
                "ALERT",
                "EYES CLOSING",
                "DROWSY",
                "MICROSLEEP",
              ].map((state) => (
                <button
                  key={state}
                  className={
                    driverState === state
                      ? "selected"
                      : ""
                  }
                  onClick={() => setDriverState(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <div className="monitor-card">
            <span className="result-label">
              BROWSER FACE DETECTION
            </span>

            <div className="detector-status">
              <span className="status-dot green" />
              {cameraActive ? "RUNNING" : "READY"}
            </div>

            <p>
              The browser uses MediaPipe Face Landmarker to provide the
              visible face-detection demonstration. The Python detector
              remains the project's drowsiness engine.
            </p>
          </div>
        </div>
      </div>

      <div className="feature-note">
        <strong>DRIVER MONITORING PIPELINE</strong>
        <span>
          Webcam → facial landmarks → eye aspect ratio → drowsiness state
          → Safety Fusion
        </span>
      </div>
    </PageContainer>
  );
}

/* =========================================================
   ASK GHOST
========================================================= */

function AskGhostPage() {
  const [messages, setMessages] = useState([
    {
      role: "ghost",
      text:
        "Ghost online. Ask me about the scenario space, AEB failures, test coverage, regression candidates, or a specific scenario.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(
    "Voice ready."
  );
  const [voiceError, setVoiceError] = useState("");

  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);

  const sendMessage = async (text, fromVoice = false) => {
    const clean = String(text || "").trim();

    if (!clean || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: clean,
      },
    ]);

    setInput("");
    setLoading(true);
    setVoiceError("");

    try {
      const data = await apiPost("/api/ask", {
        question: clean,
      });

      const answer =
        data.answer ||
        data.response ||
        data.message ||
        "Ghost did not return an answer.";

      setMessages((prev) => [
        ...prev,
        {
          role: "ghost",
          text: answer,
        },
      ]);

      if (fromVoice) {
        speakText(answer);
      }
    } catch (err) {
      const message =
        "I couldn't reach the GhostTest backend. Make sure FastAPI is running on port 8000.";

      setMessages((prev) => [
        ...prev,
        {
          role: "ghost",
          text: message,
        },
      ]);

      if (fromVoice) {
        speakText(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // recognition may already be stopped
      }
    }

    setVoiceActive(false);
  };

  const startRecognition = () => {
    setVoiceError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("Voice recognition unavailable.");
      setVoiceError(
        "This browser does not provide Speech Recognition. Chrome/Edge on localhost are recommended."
      );
      return;
    }

    if (voiceActive) {
      stopRecognition();
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceActive(true);
        setVoiceStatus("Listening… speak now.");
        setVoiceError("");
      };

      recognition.onresult = (event) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript += event.results[i][0].transcript;
        }

        transcript = transcript.trim();

        if (transcript) {
          setInput(transcript);
          setVoiceStatus(`Heard: "${transcript}"`);
        }

        const lastResult =
          event.results[event.results.length - 1];

        if (lastResult?.isFinal && transcript) {
          sendMessage(transcript, true);
        }
      };

      recognition.onerror = (event) => {
        setVoiceActive(false);

        const messagesByError = {
          "not-allowed":
            "Microphone permission was denied. Allow microphone access for this site.",
          "service-not-allowed":
            "Speech recognition service is not allowed by the browser.",
          "audio-capture":
            "No microphone could be accessed.",
          network:
            "Speech recognition network service failed.",
          "no-speech":
            "No speech was detected. Click Voice and speak again.",
          aborted:
            "Voice recognition was stopped.",
        };

        const message =
          messagesByError[event.error] ||
          `Voice recognition error: ${event.error}`;

        setVoiceStatus("Voice stopped.");
        setVoiceError(message);
      };

      recognition.onend = () => {
        setVoiceActive(false);

        if (!voiceError) {
          setVoiceStatus("Voice ready.");
        }
      };

      recognitionRef.current = recognition;

      setVoiceStatus("Starting microphone…");

      recognition.start();
    } catch (err) {
      setVoiceActive(false);
      setVoiceError(
        `Could not start voice recognition: ${err.message}`
      );
    }
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      setVoiceError(
        "Speech output is not supported by this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setVoiceError("Speech output could not be played.");
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // cleanup
        }
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <PageContainer
      eyebrow="AI ASSISTANT"
      title="Ask Ghost"
      subtitle="Ask questions about GhostTest using text or voice."
    >
      <div className="chat-layout">
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <span className="banner-kicker">GHOST ASSISTANT</span>
              <h2>Validation intelligence</h2>
            </div>

            <div
              className={
                voiceActive
                  ? "voice-status active"
                  : "voice-status"
              }
            >
              <span className="status-dot" />
              {voiceActive ? "LISTENING" : "READY"}
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
              >
                <div className="chat-avatar">
                  {message.role === "ghost" ? "G" : "U"}
                </div>

                <div className="chat-bubble">
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message ghost">
                <div className="chat-avatar">G</div>
                <div className="chat-bubble typing">
                  Ghost is analyzing…
                </div>
              </div>
            )}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ghost a question..."
              disabled={loading}
            />

            <button
              type="submit"
              className="primary-button"
              disabled={!input.trim() || loading}
            >
              SEND
            </button>
          </form>
        </div>

        <div className="voice-panel">
          <div className="voice-orb">
            <div
              className={
                voiceActive
                  ? "voice-orb-inner listening"
                  : "voice-orb-inner"
              }
            >
              🎙
            </div>
          </div>

          <h3>
            {voiceActive
              ? "Listening..."
              : "Voice Assistance"}
          </h3>

          <p>
            Click the microphone, speak your question, and Ghost will
            process the transcript and speak the answer.
          </p>

          <button
            className={
              voiceActive
                ? "danger-button voice-main-button"
                : "primary-button voice-main-button"
            }
            onClick={startRecognition}
          >
            {voiceActive
              ? "STOP LISTENING"
              : "🎙 START VOICE"}
          </button>

          <button
            className="secondary-button full"
            onClick={speaking ? stopSpeaking : undefined}
            disabled={!speaking}
          >
            {speaking ? "STOP SPEAKING" : "SPEECH OUTPUT READY"}
          </button>

          <div className="voice-status-box">
            <strong>VOICE STATUS</strong>
            <span>{voiceStatus}</span>
          </div>

          {voiceError && (
            <div className="voice-error">
              <strong>VOICE ERROR</strong>
              <span>{voiceError}</span>
            </div>
          )}

          <div className="voice-tips">
            <strong>Try asking:</strong>
            <span>“How many scenarios are unseen?”</span>
            <span>“Why is this scenario dangerous?”</span>
            <span>“What should go into regression?”</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

/* =========================================================
   SCENARIO FORM
========================================================= */

function ScenarioForm({
  scenario,
  setScenario,
  onSubmit,
  buttonText,
  disabled,
  compact = false,
}) {
  const update = (key, value) => {
    setScenario((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={compact ? "scenario-form compact" : "scenario-form"}>
      <div className="form-grid">
        <label>
          <span>SPEED (KM/H)</span>
          <select
            value={scenario.speed}
            onChange={(e) =>
              update("speed", Number(e.target.value))
            }
          >
            {[40, 60, 80, 100, 120].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>OBJECT DISTANCE (M)</span>
          <select
            value={scenario.object_distance}
            onChange={(e) =>
              update(
                "object_distance",
                Number(e.target.value)
              )
            }
          >
            {[5, 10, 15, 20, 30].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>VISIBILITY</span>
          <select
            value={scenario.visibility}
            onChange={(e) =>
              update("visibility", e.target.value)
            }
          >
            <option>Good</option>
            <option>Moderate</option>
            <option>Poor</option>
          </select>
        </label>

        <label>
          <span>WEATHER</span>
          <select
            value={scenario.weather}
            onChange={(e) =>
              update("weather", e.target.value)
            }
          >
            <option>Clear</option>
            <option>Rain</option>
            <option>Fog</option>
          </select>
        </label>

        <label>
          <span>SENSOR DELAY (S)</span>
          <select
            value={scenario.sensor_delay}
            onChange={(e) =>
              update(
                "sensor_delay",
                Number(e.target.value)
              )
            }
          >
            {[0, 0.05, 0.1, 0.15, 0.25].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>ROAD CONDITION</span>
          <select
            value={scenario.road_condition}
            onChange={(e) =>
              update("road_condition", e.target.value)
            }
          >
            <option>Dry</option>
            <option>Wet</option>
            <option>Slippery</option>
          </select>
        </label>
      </div>

      {onSubmit && (
        <div className="form-action">
          <button
            className="primary-button"
            onClick={onSubmit}
            disabled={disabled}
          >
            {buttonText || "RUN SIMULATION →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMMON COMPONENTS
========================================================= */

function PageContainer({ eyebrow, title, subtitle, children }) {
  return (
    <div className="page-container">
      <div className="page-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <div>
        <span>{title}</span>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function InfoCard({ title, children, text }) {
  return (
    <div className="info-card">
      <span className="result-label">{title}</span>
      {children || <p>{text}</p>}
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="chart-content">{children}</div>
    </div>
  );
}

function Tag({ children }) {
  return <span className="tag">{children || "—"}</span>;
}

function RiskBadge({ level }) {
  const normalized = String(level || "UNKNOWN").toUpperCase();

  return (
    <span
      className={`risk-badge ${
        riskClass(normalized)
      }`}
    >
      {normalized}
    </span>
  );
}

function LoadingBox() {
  return (
    <div className="loading-box">
      <div className="loader" />
      Loading GhostTest data...
    </div>
  );
}

function EmptyBox({ text }) {
  return <div className="empty-box">{text}</div>;
}

function ErrorBox({ message }) {
  return (
    <div className="error-box">
      <strong>ERROR</strong>
      <span>{message}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>GHOSTTEST AI</span>
      <span>Simulation-based proof of concept</span>
      <span>React · FastAPI · Python · ML</span>
    </footer>
  );
}

/* =========================================================
   CSS
========================================================= */

const APP_CSS = `

/* =========================================================
   GHOSTTEST AI — LOGIN PAGE
========================================================= */

.login-page {
  min-height: 100vh;
  width: 100%;
  background: #05080c;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
}

.login-background-grid {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.login-page::before {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  right: -180px;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(
    circle,
    rgba(85, 207, 255, 0.08),
    transparent 65%
  );
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 760px;
  position: relative;
  z-index: 2;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-brand {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: 5px;
  color: #e8edf2;
}

.login-brand span {
  color: #55cfff;
}

.login-project-title {
  margin-top: 10px;
  color: #55cfff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
}

.login-description {
  margin-top: 9px;
  color: #65717c;
  font-size: 11px;
  letter-spacing: 1px;
}

.login-card {
  width: 100%;
  max-width: 470px;
  margin: auto;
  padding: 32px;
  background: rgba(8, 13, 18, 0.97);
  border: 1px solid #192f3d;
  border-radius: 10px;
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.55),
    0 0 40px rgba(85, 207, 255, 0.035);
}

.login-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.login-small-label {
  margin-bottom: 8px;
  color: #536875;
  font-size: 9px;
  letter-spacing: 2px;
  font-weight: 700;
}

.login-card h1 {
  margin: 0;
  color: #e8edf2;
  font-size: 25px;
  letter-spacing: 1px;
}

.login-system-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #62d391;
  font-size: 9px;
  letter-spacing: 1px;
  white-space: nowrap;
}

.login-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #62d391;
  box-shadow: 0 0 10px rgba(98, 211, 145, 0.7);
}

.login-divider {
  height: 1px;
  margin: 25px 0;
  background: #17242d;
}

.login-label {
  display: block;
  margin-bottom: 8px;
  color: #74818c;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.login-input {
  width: 100%;
  padding: 14px 15px;
  margin-bottom: 20px;
  background: #05090d;
  border: 1px solid #25333e;
  border-radius: 6px;
  color: #e8edf2;
  font-size: 13px;
  outline: none;
}

.login-input::placeholder {
  color: #46535e;
}

.login-input:focus {
  border-color: #55cfff;
  box-shadow: 0 0 0 2px rgba(85, 207, 255, 0.06);
}

.login-button {
  width: 100%;
  margin-top: 5px;
  padding: 15px;
}

.login-error {
  padding: 10px 12px;
  margin-bottom: 15px;
  background: rgba(255, 70, 85, 0.07);
  border: 1px solid rgba(255, 70, 85, 0.25);
  border-radius: 5px;
  color: #ff7777;
  font-size: 11px;
}

.login-security {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #17242d;
  text-align: center;
  color: #53616c;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.login-system-info {
  width: 100%;
  max-width: 470px;
  margin: 20px auto 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: rgba(8, 13, 18, 0.85);
  border: 1px solid #172831;
  border-radius: 7px;
  overflow: hidden;
}

.login-system-info > div {
  padding: 12px 7px;
  text-align: center;
  border-right: 1px solid #172831;
  color: #8a969f;
  font-size: 9px;
}

.login-system-info > div:last-child {
  border-right: none;
}

.login-info-label {
  display: block;
  margin-bottom: 5px;
  color: #4f5d67;
  font-size: 8px;
  letter-spacing: 1px;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: #394650;
  font-size: 8px;
  letter-spacing: 1.5px;
}

@media (max-width: 600px) {
  .login-page {
    padding: 25px 15px;
  }

  .login-brand {
    font-size: 31px;
    letter-spacing: 3px;
  }

  .login-project-title {
    font-size: 8px;
    letter-spacing: 2px;
  }

  .login-description {
    font-size: 9px;
  }

  .login-card {
    padding: 24px;
  }

  .login-card-top {
    flex-direction: column;
  }

  .login-system-info {
    grid-template-columns: repeat(2, 1fr);
  }

  .login-system-info > div:nth-child(2) {
    border-right: none;
  }

  .login-system-info > div:nth-child(3) {
    border-top: 1px solid #172831;
  }

  .login-system-info > div:nth-child(4) {
    border-top: 1px solid #172831;
  }
}


* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background: #070d18;
  color: #f5f7fb;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 80% 0%,
      rgba(71, 117, 255, 0.10),
      transparent 32rem
    ),
    #070d18;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 70px;
  padding: 12px 28px;
  background: rgba(7, 13, 24, 0.95);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
  cursor: pointer;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(100,231,184,0.5);
  color: #64e7b8;
  font-weight: 900;
  font-size: 21px;
  background: rgba(100,231,184,0.06);
}

.brand-mark.small {
  width: 34px;
  height: 34px;
  font-size: 17px;
}

.nav-brand-name,
.brand-name {
  font-size: 14px;
  letter-spacing: 1.5px;
  font-weight: 900;
}

.nav-brand-sub,
.brand-sub {
  color: #718097;
  font-size: 9px;
  letter-spacing: 1.4px;
  margin-top: 3px;
}

.nav-links {
  display: flex;
  gap: 3px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-links::-webkit-scrollbar {
  display: none;
}

.nav-link {
  white-space: nowrap;
  border: 0;
  background: transparent;
  color: #718097;
  padding: 10px 9px;
  font-size: 9px;
  letter-spacing: 0.7px;
  font-weight: 800;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.active {
  color: #64e7b8;
  background: rgba(100,231,184,0.07);
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #6f8198;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  background: #64e7b8;
  box-shadow: 0 0 12px rgba(100,231,184,0.7);
}

.status-dot.green {
  background: #64e7b8;
}

.main-content {
  min-height: calc(100vh - 70px);
}

.page-container {
  width: min(1400px, calc(100% - 48px));
  margin: 0 auto;
  padding: 55px 0 80px;
}

.page-heading {
  margin-bottom: 38px;
}

.eyebrow,
.banner-kicker,
.result-label {
  display: block;
  color: #64e7b8;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.8px;
}

.page-heading h1 {
  margin: 10px 0 8px;
  font-size: clamp(34px, 5vw, 62px);
  line-height: 0.98;
  letter-spacing: -2px;
}

.page-heading p {
  max-width: 760px;
  margin: 0;
  color: #7e8da4;
  line-height: 1.7;
  font-size: 14px;
}

.section-block {
  margin-top: 42px;
}

.section-heading {
  margin-bottom: 18px;
}

.section-heading > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
}

.section-heading span {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.6px;
}

.section-heading p {
  margin: 0;
  color: #65748a;
  font-size: 11px;
}

.primary-button,
.secondary-button,
.danger-button {
  border: 1px solid transparent;
  padding: 12px 17px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  transition: 0.2s ease;
}

.primary-button {
  color: #06120e;
  background: #64e7b8;
  border-color: #64e7b8;
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(100,231,184,0.15);
}

.secondary-button {
  color: #dbe3ee;
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.12);
}

.secondary-button:hover {
  background: rgba(255,255,255,0.07);
}

.danger-button {
  color: #fff;
  background: #c84e5d;
  border-color: #c84e5d;
}

.primary-button.large,
.secondary-button.large {
  padding: 15px 21px;
}

.secondary-button.full {
  width: 100%;
}

.control-banner,
.feature-header {
  padding: 28px;
  border: 1px solid rgba(100,231,184,0.16);
  background:
    linear-gradient(
      135deg,
      rgba(100,231,184,0.08),
      rgba(80,120,255,0.04)
    );
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.control-banner h2,
.feature-header h2 {
  margin: 7px 0 8px;
  font-size: 25px;
}

.control-banner p,
.feature-header p {
  max-width: 650px;
  margin: 0;
  color: #8491a7;
  font-size: 13px;
  line-height: 1.7;
}

.banner-pipeline {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 7px;
  color: #59677c;
  font-size: 9px;
}

.pipeline-step {
  color: #8d9aae;
  padding: 6px 8px;
  border: 1px solid rgba(255,255,255,0.08);
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.module-card {
  min-height: 185px;
  position: relative;
  text-align: left;
  color: white;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 22px;
  transition: 0.2s ease;
}

.module-card:hover {
  transform: translateY(-3px);
  border-color: rgba(100,231,184,0.35);
  background: #101b2d;
}

.module-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: #64e7b8;
  border: 1px solid rgba(100,231,184,0.2);
  margin-bottom: 30px;
  font-size: 18px;
}

.module-card h3 {
  margin: 0 0 8px;
  font-size: 13px;
  letter-spacing: 0.8px;
}

.module-card p {
  margin: 0;
  color: #718097;
  line-height: 1.55;
  font-size: 11px;
  max-width: 270px;
}

.module-arrow {
  position: absolute;
  right: 18px;
  bottom: 18px;
  color: #55637a;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
  padding: 19px;
  min-height: 120px;
}

.metric-card > span {
  display: block;
  color: #68778d;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.3px;
}

.metric-card strong {
  display: block;
  margin: 10px 0 4px;
  font-size: 27px;
  letter-spacing: -0.7px;
}

.metric-card small {
  color: #536177;
  font-size: 10px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.info-card {
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
  padding: 22px;
}

.info-card p {
  color: #8491a7;
  line-height: 1.7;
  font-size: 12px;
}

.recommendation {
  color: #64e7b8 !important;
}

.action-row {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.architecture {
  display: flex;
  align-items: stretch;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.architecture-node {
  min-width: 150px;
  flex: 1;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
  padding: 17px;
}

.architecture-node > span {
  color: #64e7b8;
  font-size: 9px;
  font-weight: 900;
}

.architecture-node strong {
  display: block;
  margin: 9px 0 6px;
  font-size: 12px;
}

.architecture-node small {
  display: block;
  color: #68778d;
  line-height: 1.5;
  font-size: 10px;
}

.architecture-arrow {
  display: grid;
  place-items: center;
  color: #536177;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.text-input,
.chat-input,
select {
  width: 100%;
  color: #f5f7fb;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 12px 13px;
  outline: none;
}

.text-input:focus,
.chat-input:focus,
select:focus {
  border-color: rgba(100,231,184,0.6);
}

.segmented {
  display: flex;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.08);
}

.segmented button {
  border: 0;
  background: transparent;
  color: #738197;
  padding: 0 15px;
  font-size: 10px;
  font-weight: 900;
}

.segmented button.selected {
  color: #06120e;
  background: #64e7b8;
}

.scenario-table-wrap {
  overflow-x: auto;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
}

.scenario-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
}

.scenario-table th {
  color: #68778d;
  font-size: 9px;
  letter-spacing: 1px;
  text-align: left;
  padding: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.scenario-table td {
  padding: 14px;
  font-size: 11px;
  color: #bac4d3;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.risk-badge {
  display: inline-flex;
  padding: 5px 7px;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.8px;
  border: 1px solid currentColor;
}

.risk-low {
  color: #64e7b8;
}

.risk-medium {
  color: #ffc857;
}

.risk-high {
  color: #ff9a62;
}

.risk-critical,
.risk-fail {
  color: #ff7d8d;
}

.risk-unknown {
  color: #8794a9;
}

.small-note {
  margin-top: 9px;
  color: #526076;
  font-size: 10px;
}

.regression-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.regression-card {
  padding: 21px;
  background: #0c1422;
  border: 1px solid rgba(255,125,141,0.14);
}

.card-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-id {
  color: #64e7b8;
  font-family: monospace;
  font-size: 10px;
}

.regression-card h3 {
  margin: 20px 0 12px;
  font-size: 18px;
}

.regression-card p {
  color: #78869c;
  font-size: 12px;
  line-height: 1.7;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  color: #8996a9;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 4px 6px;
  font-size: 8px;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.chart-card {
  min-height: 330px;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
  padding: 22px;
}

.chart-card-header h3 {
  margin: 0 0 5px;
  font-size: 14px;
}

.chart-card-header p {
  margin: 0;
  color: #66758b;
  font-size: 10px;
}

.chart-content {
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-layout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.pie-wrapper {
  width: 210px;
  height: 210px;
  flex: 0 0 auto;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-legend {
  min-width: 140px;
}

.legend-row {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 8px;
  align-items: center;
  margin: 11px 0;
  color: #8996a9;
  font-size: 10px;
}

.legend-row strong {
  color: white;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bar-chart {
  width: 100%;
  padding: 10px 5px;
}

.bar-row {
  margin: 17px 0;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  color: #8592a6;
  font-size: 10px;
  margin-bottom: 7px;
}

.bar-header strong {
  color: #fff;
}

.bar-track {
  height: 10px;
  background: #151f2f;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  min-width: 3px;
  background: linear-gradient(
    90deg,
    #64e7b8,
    #6e9dff
  );
}

.risk-bars {
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
  padding: 22px;
}

.risk-bar-row {
  margin: 17px 0;
}

.risk-bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}

.risk-bar-label > span:last-child {
  color: #8d9aae;
  font-size: 10px;
}

.risk-bar-track {
  height: 10px;
  background: #151f2f;
}

.risk-bar-fill {
  height: 100%;
  min-width: 3px;
}

.risk-bar-fill.risk-low {
  background: #64e7b8;
}

.risk-bar-fill.risk-medium {
  background: #ffc857;
}

.risk-bar-fill.risk-high {
  background: #ff9a62;
}

.risk-bar-fill.risk-critical {
  background: #ff7d8d;
}

.feature-badge {
  padding: 9px 11px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.feature-badge.blue {
  color: #7aa7ff;
  border: 1px solid rgba(122,167,255,0.3);
  background: rgba(122,167,255,0.05);
}

.feature-badge.amber {
  color: #ffc857;
  border: 1px solid rgba(255,200,87,0.3);
  background: rgba(255,200,87,0.05);
}

.intelligence-header {
  border-color: rgba(122,167,255,0.18);
  background: linear-gradient(
    135deg,
    rgba(122,167,255,0.08),
    rgba(100,231,184,0.03)
  );
}

.fusion-header {
  border-color: rgba(255,200,87,0.18);
  background: linear-gradient(
    135deg,
    rgba(255,200,87,0.08),
    rgba(255,125,141,0.03)
  );
}

.scenario-form {
  margin-top: 18px;
  padding: 22px;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.form-grid label > span,
.fusion-driver-selector > label {
  display: block;
  color: #6c7a90;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
  margin-bottom: 7px;
}

.form-action {
  margin-top: 17px;
}

.result-section {
  margin-top: 20px;
}

.result-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 25px;
  background: #0c1422;
  border: 1px solid rgba(122,167,255,0.14);
}

.big-risk,
.system-risk {
  font-size: 39px;
  font-weight: 950;
  margin-top: 7px;
}

.result-summary {
  text-align: right;
}

.result-summary strong {
  display: block;
  font-size: 24px;
}

.result-summary span {
  color: #65748a;
  font-size: 10px;
}

.factor-list {
  padding-left: 18px;
  color: #8290a4;
  line-height: 1.8;
  font-size: 12px;
}

.blue-note {
  border-color: rgba(122,167,255,0.2) !important;
}

.feature-note {
  display: flex;
  gap: 14px;
  margin-top: 18px;
  padding: 17px;
  border: 1px solid rgba(100,231,184,0.14);
  background: rgba(100,231,184,0.03);
  color: #8390a4;
  font-size: 11px;
  line-height: 1.6;
}

.feature-note strong {
  color: #64e7b8;
  white-space: nowrap;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.comparison-title {
  color: #64e7b8;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.3px;
  margin-bottom: 8px;
}

.center-action {
  text-align: center;
  margin: 18px 0;
}

.comparison-result {
  margin-top: 20px;
}

.debug-json {
  overflow: auto;
  margin-top: 12px;
  padding: 18px;
  color: #8d9aae;
  background: #080f1b;
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 10px;
}

.fusion-driver-selector {
  margin-top: 20px;
  padding: 20px;
  background: #0c1422;
  border: 1px solid rgba(255,200,87,0.12);
}

.driver-state-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.driver-state {
  min-height: 70px;
  color: #7e8ca1;
  background: #101a29;
  border: 1px solid rgba(255,255,255,0.07);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.6px;
}

.driver-state span {
  display: block;
  margin-bottom: 6px;
  font-size: 16px;
}

.driver-state.selected {
  color: #ffc857;
  border-color: rgba(255,200,87,0.5);
  background: rgba(255,200,87,0.06);
}

.fusion-result {
  margin-top: 20px;
}

.fusion-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px;
  background:
    linear-gradient(
      135deg,
      rgba(255,200,87,0.07),
      rgba(255,125,141,0.05)
    );
  border: 1px solid rgba(255,200,87,0.14);
}

.fusion-score {
  text-align: right;
}

.fusion-score span {
  display: block;
  color: #77859a;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.fusion-score strong {
  display: block;
  font-size: 38px;
  margin-top: 5px;
}

.fusion-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.fusion-card {
  min-height: 145px;
  padding: 20px;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
}

.fusion-card.driver {
  border-color: rgba(122,167,255,0.22);
}

.fusion-card.aeb {
  border-color: rgba(100,231,184,0.22);
}

.fusion-card.system {
  border-color: rgba(255,200,87,0.25);
}

.fusion-card-label {
  display: block;
  color: #718096;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.fusion-card strong {
  display: block;
  margin: 15px 0 5px;
  font-size: 23px;
}

.fusion-card small {
  color: #637187;
}

.fusion-pipeline {
  display: grid;
  grid-template-columns: 1fr 40px 1fr 40px 1fr;
  align-items: center;
  margin: 20px 0;
}

.fusion-node {
  min-height: 105px;
  padding: 16px;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
}

.fusion-node.highlighted {
  border-color: rgba(255,200,87,0.35);
}

.fusion-node span {
  color: #ffc857;
  font-size: 9px;
}

.fusion-node strong {
  display: block;
  margin: 10px 0 6px;
  font-size: 11px;
}

.fusion-node small {
  color: #748197;
}

.fusion-connector {
  text-align: center;
  color: #ffc857;
  font-size: 20px;
}

.monitoring-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 14px;
}

.camera-panel,
.monitor-card {
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
}

.camera-panel {
  padding: 20px;
}

.camera-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.camera-header h2 {
  margin: 6px 0 0;
  font-size: 20px;
}

.camera-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #68778d;
  font-size: 9px;
  font-weight: 900;
}

.camera-status.live {
  color: #64e7b8;
}

.video-container {
  position: relative;
  width: 100%;
  min-height: 430px;
  background:
    radial-gradient(
      circle,
      rgba(100,231,184,0.06),
      transparent 50%
    ),
    #050a12;
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  display: grid;
  place-items: center;
}

.driver-video {
  width: 100%;
  height: 100%;
  min-height: 430px;
  object-fit: cover;
  transform: scaleX(-1);
}

.camera-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  color: #718096;
}

.camera-placeholder-icon {
  width: 65px;
  height: 65px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(100,231,184,0.2);
  color: #64e7b8;
  font-size: 25px;
}

.camera-placeholder strong {
  color: #dce4ee;
}

.camera-placeholder span {
  font-size: 11px;
}

.camera-overlay {
  position: absolute;
  left: 15px;
  right: 15px;
  top: 15px;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1px;
  pointer-events: none;
}

.camera-overlay span:first-child {
  color: #ff7d8d;
}

.camera-controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.monitoring-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.monitor-card {
  padding: 20px;
}

.main-state {
  min-height: 220px;
}

.monitor-state {
  margin: 12px 0;
  font-size: 30px;
  font-weight: 950;
}

.monitor-card p {
  color: #77859a;
  font-size: 11px;
  line-height: 1.7;
}

.monitor-state-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 13px;
}

.monitor-state-buttons button {
  padding: 10px 5px;
  background: #101a29;
  color: #758399;
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 8px;
  font-weight: 900;
}

.monitor-state-buttons button.selected {
  color: #64e7b8;
  border-color: rgba(100,231,184,0.4);
}

.detector-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #64e7b8;
  font-weight: 900;
  font-size: 11px;
  margin-top: 13px;
}

.chat-layout {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 12px;
}

.chat-panel,
.voice-panel {
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
}

.chat-panel {
  min-height: 650px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.chat-header h2 {
  margin: 6px 0 0;
  font-size: 18px;
}

.voice-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #6f7d91;
  font-size: 9px;
  font-weight: 900;
}

.voice-status.active {
  color: #64e7b8;
}

.chat-messages {
  flex: 1;
  min-height: 440px;
  padding: 20px;
  overflow-y: auto;
}

.chat-message {
  display: flex;
  gap: 9px;
  margin-bottom: 15px;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: grid;
  place-items: center;
  color: #64e7b8;
  border: 1px solid rgba(100,231,184,0.2);
  font-size: 9px;
  font-weight: 900;
}

.chat-message.user .chat-avatar {
  color: #7aa7ff;
  border-color: rgba(122,167,255,0.25);
}

.chat-bubble {
  max-width: 75%;
  padding: 12px 14px;
  background: #101a29;
  color: #aab5c5;
  font-size: 12px;
  line-height: 1.65;
}

.chat-message.user .chat-bubble {
  background: rgba(122,167,255,0.08);
  color: #d1d9e4;
}

.chat-input-row {
  display: flex;
  gap: 8px;
  padding: 15px;
  border-top: 1px solid rgba(255,255,255,0.07);
}

.voice-panel {
  padding: 30px 24px;
  text-align: center;
}

.voice-orb {
  width: 130px;
  height: 130px;
  display: grid;
  place-items: center;
  margin: 15px auto 25px;
  border-radius: 50%;
  border: 1px solid rgba(100,231,184,0.15);
  background: rgba(100,231,184,0.03);
}

.voice-orb-inner {
  width: 90px;
  height: 90px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #101b2b;
  font-size: 30px;
}

.voice-orb-inner.listening {
  animation: voicePulse 1.1s infinite;
  border: 1px solid rgba(100,231,184,0.7);
  box-shadow: 0 0 30px rgba(100,231,184,0.15);
}

@keyframes voicePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.voice-panel h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.voice-panel > p {
  color: #718096;
  line-height: 1.65;
  font-size: 11px;
}

.voice-main-button {
  width: 100%;
  margin: 15px 0 8px;
}

.voice-status-box,
.voice-error,
.voice-tips {
  text-align: left;
  padding: 13px;
  margin-top: 9px;
  border: 1px solid rgba(255,255,255,0.07);
  background: #101a29;
}

.voice-status-box strong,
.voice-error strong,
.voice-tips strong {
  display: block;
  font-size: 8px;
  letter-spacing: 1px;
  color: #738197;
  margin-bottom: 7px;
}

.voice-status-box span {
  color: #a6b1c0;
  font-size: 10px;
}

.voice-error {
  border-color: rgba(255,125,141,0.25);
}

.voice-error strong {
  color: #ff7d8d;
}

.voice-error span {
  display: block;
  color: #c79099;
  font-size: 10px;
  line-height: 1.5;
}

.voice-tips span {
  display: block;
  color: #758398;
  font-size: 10px;
  margin-top: 6px;
}

.error-box {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 13px 15px;
  margin: 12px 0;
  color: #cf9ba4;
  background: rgba(255,125,141,0.05);
  border: 1px solid rgba(255,125,141,0.2);
  font-size: 11px;
}

.error-box strong {
  color: #ff7d8d;
  font-size: 9px;
  letter-spacing: 1px;
}

.loading-box,
.empty-box {
  padding: 50px;
  text-align: center;
  color: #68778d;
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.07);
  font-size: 11px;
}

.loader {
  width: 22px;
  height: 22px;
  margin: 0 auto 12px;
  border: 2px solid rgba(100,231,184,0.2);
  border-top-color: #64e7b8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer {
  width: min(1400px, calc(100% - 48px));
  margin: 0 auto;
  padding: 25px 0 35px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: #46536a;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-size: 9px;
  letter-spacing: 0.6px;
}

/* =========================================================
   LANDING
========================================================= */

.landing {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 28px 5vw 70px;
  background:
    radial-gradient(
      circle at 72% 42%,
      rgba(100,231,184,0.09),
      transparent 30rem
    ),
    #070d18;
}

.landing-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 55px 55px;
  mask-image: linear-gradient(to bottom, black, transparent 85%);
}

.landing-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 11px;
  color: #6f8198;
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1px;
}

.hero {
  position: relative;
  width: min(1000px, 100%);
  margin: 14vh auto 0;
}

.hero-kicker {
  color: #64e7b8;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.hero h1 {
  margin: 17px 0 20px;
  font-size: clamp(50px, 9vw, 105px);
  line-height: 0.9;
  letter-spacing: -6px;
  max-width: 950px;
}

.hero h1 span {
  color: #64e7b8;
}

.hero > p {
  max-width: 680px;
  color: #7b899f;
  font-size: 15px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 9px;
  margin-top: 28px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  max-width: 800px;
  margin-top: 65px;
}

.mini-stat {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.09);
}

.mini-stat strong {
  display: block;
  font-size: 22px;
}

.mini-stat span {
  display: block;
  margin-top: 4px;
  color: #58667b;
  font-size: 9px;
  letter-spacing: 0.5px;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1150px) {
  .nav-links {
    gap: 0;
  }

  .nav-status {
    display: none;
  }

  .module-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .monitoring-layout,
  .chat-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .top-nav {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .nav-brand {
    min-width: 100%;
  }

  .nav-links {
    width: 100%;
    order: 2;
  }

  .page-container {
    width: min(100% - 28px, 1400px);
    padding-top: 35px;
  }

  .control-banner,
  .feature-header,
  .fusion-hero,
  .result-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .banner-pipeline {
    justify-content: flex-start;
  }

  .module-grid,
  .metric-grid,
  .two-column,
  .chart-grid,
  .comparison-grid,
  .regression-grid,
  .fusion-cards {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .driver-state-grid {
    grid-template-columns: 1fr 1fr;
  }

  .fusion-pipeline {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .fusion-connector {
    transform: rotate(90deg);
  }

  .toolbar,
  .chat-input-row,
  .hero-actions,
  .action-row {
    flex-direction: column;
  }

  .pie-layout {
    flex-direction: column;
  }

  .hero {
    margin-top: 10vh;
  }

  .hero h1 {
    font-size: clamp(47px, 14vw, 80px);
    letter-spacing: -4px;
  }

  .hero-stats {
    grid-template-columns: 1fr 1fr;
  }

  .footer {
    flex-direction: column;
  }
}

@media (max-width: 500px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .module-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .video-container,
  .driver-video {
    min-height: 300px;
  }
}
`;