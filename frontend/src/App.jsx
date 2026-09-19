import { useEffect, useRef, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("landing");

  const [summary, setSummary] = useState({});
  const [ghosts, setGhosts] = useState([]);
  const [regression, setRegression] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/summary`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error(err));

    fetch(`${API}/api/ghosts`)
      .then((res) => res.json())
      .then((data) => setGhosts(data))
      .catch((err) => console.error(err));

    fetch(`${API}/api/regression`)
      .then((res) => res.json())
      .then((data) => setRegression(data))
      .catch((err) => console.error(err));
  }, []);

  const goTo = (nextPage) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  /* ================= LANDING ================= */

  if (page === "landing") {
    return (
      <div className="landing-page">
        <div className="landing-grid"></div>

        <div className="landing-content">
          <div className="system-label">
            AUTOMOTIVE SOFTWARE VALIDATION SYSTEM
          </div>

          <h1>
            GHOST<span>TEST</span>
            <small>AI</small>
          </h1>

          <h2>
            Discover what your test suite hasn't seen.
          </h2>

          <p className="landing-description">
            AI-assisted scenario discovery for automotive safety software.
            GhostTest AI identifies unseen high-risk scenarios, validates them
            through simulation, and recommends confirmed failures for
            regression testing.
          </p>

          <button
            className="primary-button"
            onClick={() => goTo("control")}
          >
            EXPLORE GHOSTTEST
            <span>→</span>
          </button>

          <div className="landing-status">
            <div>
              <span className="status-dot"></span>
              SYSTEM ONLINE
            </div>

            <div>AEB VALIDATION</div>
            <div>SIMULATION MODE</div>
          </div>
        </div>

        <div className="radar">
          <div className="radar-circle circle-one"></div>
          <div className="radar-circle circle-two"></div>
          <div className="radar-circle circle-three"></div>
          <div className="radar-line"></div>

          <div className="radar-point point-one"></div>
          <div className="radar-point point-two"></div>
          <div className="radar-point point-three"></div>
        </div>
      </div>
    );
  }

  /* ================= CONTROL CENTER ================= */

  if (page === "control") {
    return (
      <div className="app">
        <Navigation page={page} goTo={goTo} />

        <main className="control-page">
          <div className="page-header">
            <div>
              <div className="eyebrow">GHOSTTEST AI</div>

              <h1>Validation Control Center</h1>

              <p>
                Select a module to explore the validation system.
              </p>
            </div>

            <div className="system-online">
              <span></span> SYSTEM ONLINE
            </div>
          </div>

          <div className="module-grid">
            <ModuleCard
              icon="◈"
              title="OVERVIEW"
              description="System metrics, validation status and test coverage."
              onClick={() => goTo("overview")}
            />

            <ModuleCard
              icon="◉"
              title="GHOST EXPLORER"
              description="Explore previously untested high-risk scenarios."
              onClick={() => goTo("ghosts")}
            />

            <ModuleCard
              icon="↻"
              title="REGRESSION"
              description="Review confirmed failures recommended for regression."
              onClick={() => goTo("regression")}
            />

            <ModuleCard
              icon="▥"
              title="ANALYTICS"
              description="Visualize system behaviour and machine-learning insights."
              onClick={() => goTo("analytics")}
            />

            <ModuleCard
              icon="✦"
              title="GHOST INTELLIGENCE"
              description="Explain why a scenario is risky and generate an engineering test vector."
              onClick={() => goTo("intelligence")}
            />

            <ModuleCard
              icon="⇄"
              title="SCENARIO COMPARISON"
              description="Compare two AEB scenarios and see how their outcomes differ."
              onClick={() => goTo("compare")}
            />

            <ModuleCard
              icon="AI"
              title="ASK GHOST"
              description="Interact with GhostTest using natural language and voice."
              onClick={() => goTo("ask")}
            />
          </div>

          <div className="control-footer">
            <span>SCENARIO SPACE</span>
            <strong>3,375</strong>

            <span>HISTORICAL TESTS</span>
            <strong>{summary.historical_tests || 400}</strong>

            <span>UNSEEN</span>
            <strong>{summary.ghost_scenarios || 2975}</strong>
          </div>
        </main>
      </div>
    );
  }

  /* ================= OVERVIEW ================= */

  if (page === "overview") {
    return (
      <PageLayout title="Overview" page={page} goTo={goTo}>
        <div className="stats-grid">
          <StatCard
            label="Historical Tests"
            value={summary.historical_tests || 0}
          />

          <StatCard
            label="Ghost Scenarios"
            value={summary.ghost_scenarios || 0}
          />

          <StatCard
            label="Confirmed Failures"
            value={summary.confirmed_failures || 0}
          />

          <StatCard
            label="Validation Accuracy"
            value={`${summary.validation_accuracy || 0}%`}
          />
        </div>

        <div className="info-panel">
          <div className="panel-title">
            VALIDATION PIPELINE
          </div>

          <div className="pipeline">
            <PipelineStep text="Historical Data" />
            <PipelineArrow />
            <PipelineStep text="ML Risk Prediction" />
            <PipelineArrow />
            <PipelineStep text="Ghost Discovery" />
            <PipelineArrow />
            <PipelineStep text="Simulation" />
            <PipelineArrow />
            <PipelineStep text="Regression" />
          </div>
        </div>

        <div className="info-panel">
          <div className="panel-title">
            SYSTEM SUMMARY
          </div>

          <p className="summary-text">
            GhostTest AI analyzes historical automotive test coverage,
            identifies previously unseen scenarios, predicts potentially
            high-risk conditions, and validates them through the AEB
            simulation engine.
          </p>
        </div>
      </PageLayout>
    );
  }

  /* ================= GHOST EXPLORER ================= */

  if (page === "ghosts") {
    return (
      <GhostExplorerPage
        ghosts={ghosts}
        page={page}
        goTo={goTo}
      />
    );
  }

  /* ================= REGRESSION ================= */

  if (page === "regression") {
    return (
      <PageLayout
        title="Regression Candidates"
        page={page}
        goTo={goTo}
      >
        <div className="section-intro">
          <div>
            <div className="eyebrow">
              CONFIRMED FAILURE CONDITIONS
            </div>

            <h2>Regression Candidates</h2>

            <p>
              Scenarios confirmed by simulation and recommended
              for future regression testing.
            </p>
          </div>
        </div>

        <div className="regression-grid">
          {regression.map((item, index) => (
            <div
              className="regression-card"
              key={index}
            >
              <div className="regression-number">
                GHOST #{String(index + 1).padStart(3, "0")}
              </div>

              <h3>
                {item.speed} km/h
                <span> · </span>
                {item.object_distance} m
              </h3>

              <div className="scenario-tags">
                <span>{item.visibility}</span>
                <span>{item.weather}</span>
                <span>{item.road_condition}</span>
                <span>{item.sensor_delay}s delay</span>
              </div>

              <div className="regression-result">
                <div>
                  <small>FAILURE PROBABILITY</small>

                  <strong>
                    {(item.failure_probability * 100).toFixed(0)}%
                  </strong>
                </div>

                <div>
                  <small>ACTUAL RESULT</small>

                  <strong>
                    {item.actual_result}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageLayout>
    );
  }

  /* ================= ANALYTICS ================= */

  if (page === "analytics") {
    return (
      <AnalyticsPage
        ghosts={ghosts}
        summary={summary}
        page={page}
        goTo={goTo}
      />
    );
  }

  /* ================= GHOST INTELLIGENCE ================= */

  if (page === "intelligence") {
    return (
      <GhostIntelligencePage
        page={page}
        goTo={goTo}
      />
    );
  }

  /* ================= SCENARIO COMPARISON ================= */

  if (page === "compare") {
    return (
      <ScenarioComparisonPage
        page={page}
        goTo={goTo}
      />
    );
  }

  /* ================= ASK GHOST ================= */

  if (page === "ask") {
    return (
      <AskGhostPage
        page={page}
        goTo={goTo}
      />
    );
  }

  return null;
}


/* =====================================================
   GHOST INTELLIGENCE
===================================================== */

function GhostIntelligencePage({ page, goTo }) {
  const [speed, setSpeed] = useState(100);
  const [distance, setDistance] = useState(10);
  const [visibility, setVisibility] = useState("Poor");
  const [weather, setWeather] = useState("Rain");
  const [sensorDelay, setSensorDelay] = useState(0.15);
  const [road, setRoad] = useState("Wet");
  const [analysis, setAnalysis] = useState(null);
  const [testVector, setTestVector] = useState(null);
  const [loading, setLoading] = useState(false);

  const runIntelligence = async () => {
    setLoading(true);
    setAnalysis(null);
    setTestVector(null);

    const scenario = {
      speed: Number(speed),
      object_distance: Number(distance),
      visibility,
      weather,
      sensor_delay: Number(sensorDelay),
      road_condition: road
    };

    try {
      const response = await fetch(`${API}/api/intelligence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario)
      });

      if (!response.ok) {
        throw new Error("Intelligence request failed");
      }

      const data = await response.json();
      setAnalysis(data);

      const vectorResponse = await fetch(`${API}/api/test-vector`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario)
      });

      if (!vectorResponse.ok) {
        throw new Error("Test vector request failed");
      }

      const vectorData = await vectorResponse.json();
      setTestVector(vectorData);

    } catch (error) {
      console.error(error);
      alert("Could not connect to GhostTest backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Ghost Intelligence"
      page={page}
      goTo={goTo}
    >
      <div style={newFeatureStyles.grid}>

        <div style={newFeatureStyles.card}>
          <div className="panel-title">
            SCENARIO INPUT
          </div>

          <ScenarioInputs
            speed={speed}
            setSpeed={setSpeed}
            distance={distance}
            setDistance={setDistance}
            visibility={visibility}
            setVisibility={setVisibility}
            weather={weather}
            setWeather={setWeather}
            sensorDelay={sensorDelay}
            setSensorDelay={setSensorDelay}
            road={road}
            setRoad={setRoad}
          />

          <button
            className="simulate-button"
            onClick={runIntelligence}
            disabled={loading}
          >
            {loading
              ? "ANALYZING..."
              : "ANALYZE SCENARIO →"}
          </button>
        </div>

        <div style={newFeatureStyles.card}>

          {!analysis ? (
            <div className="empty-result">
              <div className="empty-icon">✦</div>

              <h2>
                Ghost Intelligence Ready
              </h2>

              <p>
                Run a scenario to simulate AEB behaviour,
                explain the risk, and generate an engineering
                test vector.
              </p>
            </div>
          ) : (
            <>
              <div
                className={
                  analysis.simulation.result === "FAIL"
                    ? "result-header fail"
                    : "result-header pass"
                }
              >
                <span>GHOST ANALYSIS</span>

                <strong>
                  {analysis.simulation.result}
                </strong>
              </div>

              <div style={newFeatureStyles.metricGrid}>

                <Metric
                  label="RISK LEVEL"
                  value={analysis.analysis.risk_level}
                />

                <Metric
                  label="STOPPING DISTANCE"
                  value={`${analysis.analysis.stopping_distance} m`}
                />

                <Metric
                  label="AVAILABLE DISTANCE"
                  value={`${analysis.analysis.available_distance} m`}
                />

                <Metric
                  label="SAFETY MARGIN"
                  value={`${analysis.analysis.safety_margin} m`}
                />

              </div>

              <div style={newFeatureStyles.section}>

                <div className="panel-title">
                  RISK FACTORS
                </div>

                {analysis.analysis.risk_factors.map(
                  (factor, index) => (
                    <div
                      className="risk-factor"
                      key={index}
                    >
                      <span>◆</span>
                      {factor}
                    </div>
                  )
                )}

              </div>

              <div style={newFeatureStyles.conclusion}>

                <strong>ANALYSIS</strong>

                <p>
                  {analysis.analysis.conclusion}
                </p>

                <p>
                  <strong>
                    Recommendation:
                  </strong>{" "}
                  {analysis.analysis.recommendation}
                </p>

              </div>
            </>
          )}

        </div>
      </div>

      {testVector && (
        <div
          style={{
            ...newFeatureStyles.card,
            marginTop: "24px"
          }}
        >
          <div className="panel-title">
            GENERATED ENGINEERING TEST VECTOR
          </div>

          <div style={newFeatureStyles.vectorHeader}>
            <strong>
              {testVector.test_vector.test_id}
            </strong>

            <span className="risk-badge high">
              {testVector.test_vector.priority}
            </span>
          </div>

          <div style={newFeatureStyles.vectorGrid}>

            <VectorItem
              label="SPEED"
              value={`${testVector.test_vector.scenario.speed_kmh} km/h`}
            />

            <VectorItem
              label="OBJECT DISTANCE"
              value={`${testVector.test_vector.scenario.object_distance_m} m`}
            />

            <VectorItem
              label="VISIBILITY"
              value={testVector.test_vector.scenario.visibility}
            />

            <VectorItem
              label="WEATHER"
              value={testVector.test_vector.scenario.weather}
            />

            <VectorItem
              label="SENSOR DELAY"
              value={`${testVector.test_vector.scenario.sensor_delay_s} s`}
            />

            <VectorItem
              label="ROAD"
              value={testVector.test_vector.scenario.road_condition}
            />

            <VectorItem
              label="EXPECTED"
              value={testVector.test_vector.expected_result}
            />

            <VectorItem
              label="ACTUAL"
              value={testVector.test_vector.actual_result}
            />

          </div>

          <div style={newFeatureStyles.vectorFooter}>

            <span>
              Regression candidate:{" "}
              <strong>
                {testVector.test_vector.regression_candidate
                  ? "YES"
                  : "NO"}
              </strong>
            </span>

            <span>
              Safety margin:{" "}
              <strong>
                {testVector.test_vector.analysis.safety_margin_m} m
              </strong>
            </span>

          </div>
        </div>
      )}
    </PageLayout>
  );
}


/* =====================================================
   SCENARIO COMPARISON
===================================================== */

function ScenarioComparisonPage({ page, goTo }) {

  const defaultA = {
    speed: 80,
    object_distance: 20,
    visibility: "Good",
    weather: "Clear",
    sensor_delay: 0.05,
    road_condition: "Dry"
  };

  const defaultB = {
    speed: 100,
    object_distance: 20,
    visibility: "Poor",
    weather: "Rain",
    sensor_delay: 0.15,
    road_condition: "Wet"
  };

  const [scenarioA, setScenarioA] =
    useState(defaultA);

  const [scenarioB, setScenarioB] =
    useState(defaultB);

  const [comparison, setComparison] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const updateScenario =
    (setter, field, value) => {
      setter((current) => ({
        ...current,
        [field]: value
      }));
    };

  const compare = async () => {

    setLoading(true);
    setComparison(null);

    try {

      const response = await fetch(
        `${API}/api/compare`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            scenario_a: scenarioA,
            scenario_b: scenarioB
          })
        }
      );

      if (!response.ok) {
        throw new Error("Comparison failed");
      }

      setComparison(
        await response.json()
      );

    } catch (error) {

      console.error(error);

      alert(
        "Could not connect to GhostTest backend."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <PageLayout
      title="Scenario Comparison"
      page={page}
      goTo={goTo}
    >

      <div style={newFeatureStyles.compareGrid}>

        <ComparisonInput
          title="SCENARIO A"
          scenario={scenarioA}
          setScenario={setScenarioA}
          updateScenario={updateScenario}
        />

        <ComparisonInput
          title="SCENARIO B"
          scenario={scenarioB}
          setScenario={setScenarioB}
          updateScenario={updateScenario}
        />

      </div>

      <button
        className="simulate-button"
        onClick={compare}
        disabled={loading}
        style={{ marginTop: "24px" }}
      >
        {loading
          ? "COMPARING..."
          : "COMPARE SCENARIOS →"}
      </button>

      {comparison && (

        <div
          style={{
            ...newFeatureStyles.card,
            marginTop: "24px"
          }}
        >

          <div className="panel-title">
            COMPARISON RESULT
          </div>

          <div
            style={
              newFeatureStyles.compareResultGrid
            }
          >

            <ComparisonResult
              title="SCENARIO A"
              data={comparison.scenario_a}
            />

            <ComparisonResult
              title="SCENARIO B"
              data={comparison.scenario_b}
            />

          </div>

          <div style={newFeatureStyles.section}>

            <div className="panel-title">
              CHANGED PARAMETERS
            </div>

            {Object.entries(
              comparison.comparison.differences
            ).map(([key, values]) => (

              <div
                style={newFeatureStyles.diffRow}
                key={key}
              >

                <strong>
                  {key
                    .replaceAll("_", " ")
                    .toUpperCase()}
                </strong>

                <span>
                  {String(values.scenario_a)}
                </span>

                <span>→</span>

                <span>
                  {String(values.scenario_b)}
                </span>

              </div>

            ))}

          </div>

          <div
            style={
              newFeatureStyles.vectorFooter
            }
          >

            <span>
              Stopping-distance difference:{" "}
              <strong>
                {
                  comparison.comparison
                    .stopping_distance_difference
                }{" "}
                m
              </strong>
            </span>

            <span>
              Larger safety margin:{" "}
              <strong>
                {
                  comparison.comparison
                    .larger_safety_margin
                }
              </strong>
            </span>

          </div>

        </div>
      )}

    </PageLayout>
  );
}


function ScenarioInputs({
  speed,
  setSpeed,
  distance,
  setDistance,
  visibility,
  setVisibility,
  weather,
  setWeather,
  sensorDelay,
  setSensorDelay,
  road,
  setRoad
}) {

  return (
    <div style={newFeatureStyles.inputGrid}>

      <InputField
        label="VEHICLE SPEED"
        value={speed}
        onChange={setSpeed}
        type="number"
        suffix="km/h"
      />

      <InputField
        label="OBJECT DISTANCE"
        value={distance}
        onChange={setDistance}
        type="number"
        suffix="m"
      />

      <SelectField
        label="VISIBILITY"
        value={visibility}
        onChange={setVisibility}
        options={[
          "Good",
          "Moderate",
          "Poor"
        ]}
      />

      <SelectField
        label="WEATHER"
        value={weather}
        onChange={setWeather}
        options={[
          "Clear",
          "Rain",
          "Fog"
        ]}
      />

      <SelectField
        label="SENSOR DELAY"
        value={sensorDelay}
        onChange={setSensorDelay}
        options={[
          0,
          0.05,
          0.1,
          0.15,
          0.25
        ]}
        suffix="s"
      />

      <SelectField
        label="ROAD CONDITION"
        value={road}
        onChange={setRoad}
        options={[
          "Dry",
          "Wet",
          "Slippery"
        ]}
      />

    </div>
  );
}


function ComparisonInput({
  title,
  scenario,
  setScenario,
  updateScenario
}) {

  return (
    <div style={newFeatureStyles.card}>

      <div className="panel-title">
        {title}
      </div>

      <ScenarioInputs
        speed={scenario.speed}
        setSpeed={(v) =>
          updateScenario(
            setScenario,
            "speed",
            v
          )
        }
        distance={scenario.object_distance}
        setDistance={(v) =>
          updateScenario(
            setScenario,
            "object_distance",
            v
          )
        }
        visibility={scenario.visibility}
        setVisibility={(v) =>
          updateScenario(
            setScenario,
            "visibility",
            v
          )
        }
        weather={scenario.weather}
        setWeather={(v) =>
          updateScenario(
            setScenario,
            "weather",
            v
          )
        }
        sensorDelay={scenario.sensor_delay}
        setSensorDelay={(v) =>
          updateScenario(
            setScenario,
            "sensor_delay",
            v
          )
        }
        road={scenario.road_condition}
        setRoad={(v) =>
          updateScenario(
            setScenario,
            "road_condition",
            v
          )
        }
      />

    </div>
  );
}


function InputField({
  label,
  value,
  onChange,
  type = "text",
  suffix
}) {

  return (
    <label style={newFeatureStyles.label}>

      {label}

      <div
        style={
          newFeatureStyles.inputWrap
        }
      >

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={
            newFeatureStyles.input
          }
        />

        {suffix && (
          <span>{suffix}</span>
        )}

      </div>

    </label>
  );
}


function SelectField({
  label,
  value,
  onChange,
  options,
  suffix
}) {

  return (
    <label style={newFeatureStyles.label}>

      {label}

      <div
        style={
          newFeatureStyles.inputWrap
        }
      >

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={
            newFeatureStyles.input
          }
        >

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
              {suffix ? suffix : ""}
            </option>
          ))}

        </select>

      </div>

    </label>
  );
}


function Metric({ label, value }) {

  return (
    <div style={newFeatureStyles.metric}>

      <small>{label}</small>

      <strong>{value}</strong>

    </div>
  );
}


function VectorItem({ label, value }) {

  return (
    <div
      style={
        newFeatureStyles.vectorItem
      }
    >

      <small>{label}</small>

      <strong>{value}</strong>

    </div>
  );
}


function ComparisonResult({
  title,
  data
}) {

  return (
    <div
      style={
        newFeatureStyles.resultBox
      }
    >

      <small>{title}</small>

      <strong
        className={
          data.result === "FAIL"
            ? "result-badge fail"
            : "result-badge pass"
        }
      >
        {data.result}
      </strong>

      <div>
        Stopping distance:{" "}
        <b>{data.stopping_distance} m</b>
      </div>

      <div>
        Safety margin:{" "}
        <b>{data.safety_margin} m</b>
      </div>

    </div>
  );
}


const newFeatureStyles = {

  grid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(280px, 0.8fr) minmax(320px, 1.2fr)",
    gap: "24px",
    alignItems: "start"
  },

  compareGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "start"
  },

  card: {
    background:
      "rgba(255,255,255,0.025)",
    border:
      "1px solid rgba(255,255,255,0.09)",
    padding: "24px",
    borderRadius: "12px"
  },

  inputGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    margin: "18px 0"
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "11px",
    letterSpacing: "0.08em"
  },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    background:
      "rgba(0,0,0,0.25)",
    color: "inherit",
    border:
      "1px solid rgba(255,255,255,0.12)",
    borderRadius: "6px"
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "20px"
  },

  metric: {
    padding: "14px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px"
  },

  section: {
    marginTop: "24px"
  },

  conclusion: {
    marginTop: "20px",
    padding: "16px",
    borderLeft: "3px solid currentColor",
    background:
      "rgba(255,255,255,0.025)"
  },

  vectorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "16px 0"
  },

  vectorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "12px"
  },

  vectorItem: {
    padding: "12px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px"
  },

  vectorFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop:
      "1px solid rgba(255,255,255,0.08)"
  },

  compareResultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "18px"
  },

  resultBox: {
    display: "grid",
    gap: "10px",
    padding: "18px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px"
  },

  diffRow: {
    display: "grid",
    gridTemplateColumns:
      "1.4fr 1fr 30px 1fr",
    gap: "10px",
    padding: "10px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)"
  }
};


/* =====================================================
   NAVIGATION
===================================================== */

function Navigation({ page, goTo }) {

  return (
    <nav className="navbar">

      <div
        className="nav-logo"
        onClick={() =>
          goTo("control")
        }
      >
        GHOST<span>TEST</span> AI
      </div>

      <div className="nav-links">

        <button
          className={
            page === "control"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("control")
          }
        >
          CONTROL CENTER
        </button>

        <button
          className={
            page === "overview"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("overview")
          }
        >
          OVERVIEW
        </button>

        <button
          className={
            page === "ghosts"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("ghosts")
          }
        >
          GHOST EXPLORER
        </button>

        <button
          className={
            page === "regression"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("regression")
          }
        >
          REGRESSION
        </button>

        <button
          className={
            page === "analytics"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("analytics")
          }
        >
          ANALYTICS
        </button>

        <button
          className={
            page === "intelligence"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("intelligence")
          }
        >
          GHOST INTELLIGENCE
        </button>

        <button
          className={
            page === "compare"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("compare")
          }
        >
          SCENARIO COMPARISON
        </button>

        <button
          className={
            page === "ask"
              ? "active"
              : ""
          }
          onClick={() =>
            goTo("ask")
          }
        >
          ASK GHOST
        </button>

      </div>

    </nav>
  );
}


/* =====================================================
   PAGE LAYOUT
===================================================== */

function PageLayout({
  title,
  page,
  goTo,
  children
}) {

  return (
    <div className="app">

      <Navigation
        page={page}
        goTo={goTo}
      />

      <main className="content-page">

        <div className="page-title">

          <div className="eyebrow">
            GHOSTTEST AI / MODULE
          </div>

          <h1>{title}</h1>

        </div>

        {children}

      </main>

    </div>
  );
}


/* =====================================================
   MODULE CARD
===================================================== */

function ModuleCard({
  icon,
  title,
  description,
  onClick
}) {

  return (
    <button
      className="module-card"
      onClick={onClick}
    >

      <div className="module-icon">
        {icon}
      </div>

      <div className="module-content">

        <h2>{title}</h2>

        <p>{description}</p>

        <span className="module-open">
          OPEN MODULE →
        </span>

      </div>

    </button>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  label,
  value
}) {

  return (
    <div className="stat-card">

      <div className="stat-label">
        {label}
      </div>

      <div className="stat-value">
        {value}
      </div>

    </div>
  );
}


/* =====================================================
   PIPELINE
===================================================== */

function PipelineStep({
  text
}) {

  return (
    <div className="pipeline-step">
      {text}
    </div>
  );
}


function PipelineArrow() {

  return (
    <div className="pipeline-arrow">
      →
    </div>
  );
}


/* =====================================================
   ANALYTICS
===================================================== */

function AnalyticsPage({
  ghosts,
  summary,
  page,
  goTo
}) {

  const safeGhosts =
    Array.isArray(ghosts)
      ? ghosts
      : [];

  const total =
    safeGhosts.length;

  const predictedFails =
    safeGhosts.filter(
      (item) =>
        item.predicted_result ===
        "FAIL"
    ).length;

  const predictedPasses =
    safeGhosts.filter(
      (item) =>
        item.predicted_result ===
        "PASS"
    ).length;

  const highRisk =
    safeGhosts.filter(
      (item) =>
        Number(
          item.failure_probability
        ) >= 0.75
    ).length;

  const mediumRisk =
    safeGhosts.filter(
      (item) => {

        const p =
          Number(
            item.failure_probability
          );

        return (
          p >= 0.45 &&
          p < 0.75
        );
      }
    ).length;

  const lowRisk =
    safeGhosts.filter(
      (item) =>
        Number(
          item.failure_probability
        ) < 0.45
    ).length;

  const averageFailureProbability =
    total
      ? safeGhosts.reduce(
          (sum, item) =>
            sum +
            Number(
              item.failure_probability ||
                0
            ),
          0
        ) / total
      : 0;

  const groupBy = (key) => {

    const groups = {};

    safeGhosts.forEach(
      (item) => {

        const value =
          item[key] ||
          "Unknown";

        if (!groups[value]) {

          groups[value] = {
            total: 0,
            failures: 0,
            probability: 0
          };

        }

        groups[value].total += 1;

        if (
          item.predicted_result ===
          "FAIL"
        ) {
          groups[value].failures += 1;
        }

        groups[value].probability +=
          Number(
            item.failure_probability ||
              0
          );
      }
    );

    return Object.entries(
      groups
    )
      .map(
        ([name, data]) => ({
          name,
          total: data.total,
          failures: data.failures,
          failureRate:
            data.total
              ? (
                  data.failures /
                  data.total
                ) * 100
              : 0,
          averageProbability:
            data.total
              ? (
                  data.probability /
                  data.total
                ) * 100
              : 0
        })
      )
      .sort(
        (a, b) =>
          b.failureRate -
          a.failureRate
      );
  };

  const speedGroups =
    groupBy("speed");

  const weatherGroups =
    groupBy("weather");

  const roadGroups =
    groupBy("road_condition");

  const visibilityGroups =
    groupBy("visibility");

  return (
    <div className="app">

      <Navigation
        page={page}
        goTo={goTo}
      />

      <main className="content-page">

        <div className="page-title">

          <div className="eyebrow">
            DATA INTELLIGENCE / MODEL INSIGHTS
          </div>

          <h1>Analytics</h1>

          <p>
            Explore how the GhostTest scenario
            space behaves across risk, speed,
            weather, visibility and road
            conditions.
          </p>

        </div>

        <div className="analytics-kpi-grid">

          <AnalyticsKpi
            label="UNSEEN SCENARIOS"
            value={total.toLocaleString()}
            detail="Scenarios available for AI prioritization"
          />

          <AnalyticsKpi
            label="PREDICTED FAILURES"
            value={predictedFails.toLocaleString()}
            detail={`${total
              ? (
                  (predictedFails /
                    total) *
                  100
                ).toFixed(1)
              : 0}% of unseen space`}
          />

          <AnalyticsKpi
            label="HIGH-RISK SCENARIOS"
            value={highRisk.toLocaleString()}
            detail="Failure probability ≥ 75%"
          />

          <AnalyticsKpi
            label="AVG. FAILURE PROBABILITY"
            value={`${(
              averageFailureProbability *
              100
            ).toFixed(1)}%`}
            detail="Across all unseen scenarios"
          />

        </div>

        <div className="analytics-grid">

          <AnalyticsPanel
            title="PREDICTED OUTCOME DISTRIBUTION"
            subtitle="AI classification across unseen scenarios"
          >
            <DonutLike
              pass={predictedPasses}
              fail={predictedFails}
              total={total}
            />
          </AnalyticsPanel>

          <AnalyticsPanel
            title="RISK DISTRIBUTION"
            subtitle="Failure-probability bands"
          >
            <HorizontalBars
              data={[
                {
                  name: "HIGH",
                  value: highRisk,
                  percent:
                    total
                      ? (highRisk /
                          total) *
                        100
                      : 0
                },
                {
                  name: "MEDIUM",
                  value: mediumRisk,
                  percent:
                    total
                      ? (mediumRisk /
                          total) *
                        100
                      : 0
                },
                {
                  name: "LOW",
                  value: lowRisk,
                  percent:
                    total
                      ? (lowRisk /
                          total) *
                        100
                      : 0
                }
              ]}
            />
          </AnalyticsPanel>

          <AnalyticsPanel
            title="FAILURE RATE BY SPEED"
            subtitle="Predicted failure percentage for each speed"
          >
            <HorizontalBars
              data={speedGroups.map(
                (item) => ({
                  name: `${item.name} km/h`,
                  value: item.failures,
                  percent:
                    item.failureRate
                })
              )}
            />
          </AnalyticsPanel>

          <AnalyticsPanel
            title="WEATHER IMPACT"
            subtitle="Predicted failure rate by weather"
          >
            <HorizontalBars
              data={weatherGroups.map(
                (item) => ({
                  name: item.name,
                  value: item.failures,
                  percent:
                    item.failureRate
                })
              )}
            />
          </AnalyticsPanel>

          <AnalyticsPanel
            title="ROAD CONDITION IMPACT"
            subtitle="Predicted failure rate by road condition"
          >
            <HorizontalBars
              data={roadGroups.map(
                (item) => ({
                  name: item.name,
                  value: item.failures,
                  percent:
                    item.failureRate
                })
              )}
            />
          </AnalyticsPanel>

          <AnalyticsPanel
            title="VISIBILITY IMPACT"
            subtitle="Predicted failure rate by visibility"
          >
            <HorizontalBars
              data={visibilityGroups.map(
                (item) => ({
                  name: item.name,
                  value: item.failures,
                  percent:
                    item.failureRate
                })
              )}
            />
          </AnalyticsPanel>

        </div>

        <div className="analytics-insight">

          <div>

            <div className="eyebrow">
              GHOSTTEST MODEL VIEW
            </div>

            <h2>
              What the analytics tell us
            </h2>

            <p>
              GhostTest uses the machine-learning
              model to prioritize previously unseen
              scenarios for simulation. The charts
              above describe the current synthetic
              AEB scenario space and should be
              interpreted as prioritization insights,
              not as real-world vehicle failure
              statistics.
            </p>

          </div>

          <div className="insight-stats">

            <div>
              <small>
                HISTORICAL TESTS
              </small>

              <strong>
                {summary.historical_tests ||
                  0}
              </strong>
            </div>

            <div>
              <small>
                UNSEEN SPACE
              </small>

              <strong>
                {summary.ghost_scenarios ||
                  total}
              </strong>
            </div>

            <div>
              <small>
                VALIDATION ACCURACY
              </small>

              <strong>
                {summary.validation_accuracy ||
                  0}%
              </strong>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


function AnalyticsKpi({
  label,
  value,
  detail
}) {

  return (
    <div className="analytics-kpi">

      <div className="analytics-kpi-label">
        {label}
      </div>

      <div className="analytics-kpi-value">
        {value}
      </div>

      <div className="analytics-kpi-detail">
        {detail}
      </div>

    </div>
  );
}


function AnalyticsPanel({
  title,
  subtitle,
  children
}) {

  return (
    <section className="analytics-panel">

      <div className="analytics-panel-header">

        <div>

          <div className="panel-title">
            {title}
          </div>

          <small>
            {subtitle}
          </small>

        </div>

      </div>

      {children}

    </section>
  );
}


function HorizontalBars({
  data
}) {

  const max =
    Math.max(
      ...data.map(
        (item) =>
          item.percent
      ),
      1
    );

  return (
    <div className="analytics-bars">

      {data.map(
        (item) => (

          <div
            className="analytics-bar-row"
            key={item.name}
          >

            <div
              className="analytics-bar-label"
            >

              <span>
                {item.name}
              </span>

              <strong>
                {item.percent.toFixed(1)}%
              </strong>

            </div>

            <div
              className="analytics-bar-track"
            >

              <div
                className="analytics-bar-fill"
                style={{
                  width: `${
                    (item.percent /
                      max) *
                    100
                  }%`
                }}
              />

            </div>

            <small>
              {item.value.toLocaleString()} scenarios
            </small>

          </div>

        )
      )}

    </div>
  );
}


function DonutLike({
  pass,
  fail,
  total
}) {

  const failPercent =
    total
      ? (fail / total) * 100
      : 0;

  const passPercent =
    total
      ? (pass / total) * 100
      : 0;

  return (
    <div className="outcome-chart">

      <div
        className="outcome-ring"
        style={{
          background:
            `conic-gradient(
              #ff4d5a 0 ${failPercent}%,
              #3de0a8 ${failPercent}% 100%
            )`
        }}
      >

        <div
          className="outcome-ring-inner"
        >

          <strong>
            {total.toLocaleString()}
          </strong>

          <span>
            TOTAL
          </span>

        </div>

      </div>

      <div className="outcome-legend">

        <div>

          <span
            className="legend-dot fail"
          ></span>

          <div>

            <strong>
              {fail.toLocaleString()}
            </strong>

            <small>
              Predicted FAIL
            </small>

          </div>

        </div>

        <div>

          <span
            className="legend-dot pass"
          ></span>

          <div>

            <strong>
              {pass.toLocaleString()}
            </strong>

            <small>
              Predicted PASS
            </small>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   GHOST EXPLORER
===================================================== */

function GhostExplorerPage({
  ghosts,
  page,
  goTo
}) {

  const [search, setSearch] =
    useState("");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const [weatherFilter, setWeatherFilter] =
    useState("All");

  const [roadFilter, setRoadFilter] =
    useState("All");

  const [visibilityFilter, setVisibilityFilter] =
    useState("All");

  const [resultFilter, setResultFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 10;

  const getRiskLevel = (
    probability
  ) => {

    if (probability >= 0.75) {
      return "HIGH";
    }

    if (probability >= 0.45) {
      return "MEDIUM";
    }

    return "LOW";
  };

  const filteredGhosts =
    ghosts.filter(
      (ghost) => {

        const probability =
          Number(
            ghost.failure_probability
          );

        const risk =
          getRiskLevel(
            probability
          );

        const searchableText = `
          ${ghost.speed}
          ${ghost.object_distance}
          ${ghost.visibility}
          ${ghost.weather}
          ${ghost.sensor_delay}
          ${ghost.road_condition}
          ${ghost.predicted_result}
        `.toLowerCase();

        const matchesSearch =
          searchableText.includes(
            search.toLowerCase()
          );

        const matchesRisk =
          riskFilter === "All" ||
          risk === riskFilter;

        const matchesWeather =
          weatherFilter === "All" ||
          ghost.weather ===
            weatherFilter;

        const matchesRoad =
          roadFilter === "All" ||
          ghost.road_condition ===
            roadFilter;

        const matchesVisibility =
          visibilityFilter === "All" ||
          ghost.visibility ===
            visibilityFilter;

        const matchesResult =
          resultFilter === "All" ||
          ghost.predicted_result ===
            resultFilter;

        return (
          matchesSearch &&
          matchesRisk &&
          matchesWeather &&
          matchesRoad &&
          matchesVisibility &&
          matchesResult
        );
      }
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    riskFilter,
    weatherFilter,
    roadFilter,
    visibilityFilter,
    resultFilter
  ]);

  const totalPages =
    Math.ceil(
      filteredGhosts.length /
        rowsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const paginatedGhosts =
    filteredGhosts.slice(
      startIndex,
      startIndex + rowsPerPage
    );

  const total =
    ghosts.length;

  const predictedFails =
    ghosts.filter(
      (ghost) =>
        ghost.predicted_result ===
        "FAIL"
    ).length;

  const predictedPasses =
    ghosts.filter(
      (ghost) =>
        ghost.predicted_result ===
        "PASS"
    ).length;

  const resetFilters = () => {

    setSearch("");
    setRiskFilter("All");
    setWeatherFilter("All");
    setRoadFilter("All");
    setVisibilityFilter("All");
    setResultFilter("All");
    setCurrentPage(1);

  };

  const getPageNumbers = () => {

    if (totalPages <= 5) {

      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );

    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {

      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];

    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];
  };

  return (
    <div className="app">

      <Navigation
        page={page}
        goTo={goTo}
      />

      <main className="content-page ghost-explorer-page">

        <div className="ghost-header">

          <div>

            <div className="eyebrow">
              UNSEEN SCENARIO ANALYSIS
            </div>

            <h1>
              Ghost Explorer
            </h1>

            <p>
              Explore all previously untested
              scenarios generated from the
              automotive scenario space.
            </p>

          </div>

          <div className="ghost-kpis">

            <div className="ghost-kpi">

              <div className="kpi-icon">
                ◉
              </div>

              <div>

                <small>
                  TOTAL GHOST SCENARIOS
                </small>

                <strong>
                  {total.toLocaleString()}
                </strong>

              </div>

            </div>

            <div className="ghost-kpi">

              <div className="kpi-icon fail-icon">
                ◈
              </div>

              <div>

                <small>
                  PREDICTED FAILURES
                </small>

                <strong>
                  {predictedFails.toLocaleString()}
                </strong>

                <span>
                  {total
                    ? (
                        predictedFails /
                        total *
                        100
                      ).toFixed(1)
                    : 0}%
                </span>

              </div>

            </div>

            <div className="ghost-kpi">

              <div className="kpi-icon pass-icon">
                ◇
              </div>

              <div>

                <small>
                  PREDICTED PASSES
                </small>

                <strong>
                  {predictedPasses.toLocaleString()}
                </strong>

                <span>
                  {total
                    ? (
                        predictedPasses /
                        total *
                        100
                      ).toFixed(1)
                    : 0}%
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="ghost-filters">

          <div className="search-box">

            <span>⌕</span>

            <input
              placeholder="Search scenarios..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              Risk Level — All
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>

          </select>

          <select
            value={weatherFilter}
            onChange={(e) =>
              setWeatherFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              Weather — All
            </option>

            <option value="Clear">
              Clear
            </option>

            <option value="Rain">
              Rain
            </option>

            <option value="Fog">
              Fog
            </option>

          </select>

          <select
            value={roadFilter}
            onChange={(e) =>
              setRoadFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              Road — All
            </option>

            <option value="Dry">
              Dry
            </option>

            <option value="Wet">
              Wet
            </option>

            <option value="Slippery">
              Slippery
            </option>

          </select>

          <select
            value={visibilityFilter}
            onChange={(e) =>
              setVisibilityFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              Visibility — All
            </option>

            <option value="Good">
              Good
            </option>

            <option value="Moderate">
              Moderate
            </option>

            <option value="Poor">
              Poor
            </option>

          </select>

          <select
            value={resultFilter}
            onChange={(e) =>
              setResultFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              Result — All
            </option>

            <option value="PASS">
              PASS
            </option>

            <option value="FAIL">
              FAIL
            </option>

          </select>

          <button
            className="reset-button"
            onClick={resetFilters}
          >
            ↻ RESET
          </button>

        </div>

        <div className="ghost-table-container">

          <table className="ghost-table">

            <thead>

              <tr>

                <th>#</th>

                <th>
                  SPEED
                  <br />
                  <small>
                    (km/h)
                  </small>
                </th>

                <th>
                  DISTANCE
                  <br />
                  <small>
                    (m)
                  </small>
                </th>

                <th>
                  VISIBILITY
                </th>

                <th>
                  WEATHER
                </th>

                <th>
                  SENSOR DELAY
                  <br />
                  <small>
                    (s)
                  </small>
                </th>

                <th>
                  ROAD
                </th>

                <th>
                  FAILURE PROB.
                </th>

                <th>
                  PREDICTED RESULT
                </th>

                <th>
                  RISK LEVEL
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedGhosts.map(
                (ghost, index) => {

                  const probability =
                    Number(
                      ghost.failure_probability
                    );

                  const percentage =
                    probability * 100;

                  const risk =
                    getRiskLevel(
                      probability
                    );

                  return (
                    <tr
                      key={`${startIndex}-${index}`}
                    >

                      <td className="scenario-number">

                        {String(
                          startIndex +
                            index +
                            1
                        ).padStart(
                          4,
                          "0"
                        )}

                      </td>

                      <td>
                        {ghost.speed}
                      </td>

                      <td>
                        {ghost.object_distance}
                      </td>

                      <td>
                        {ghost.visibility}
                      </td>

                      <td>
                        {ghost.weather}
                      </td>

                      <td>
                        {Number(
                          ghost.sensor_delay
                        ).toFixed(2)}
                      </td>

                      <td>
                        {ghost.road_condition}
                      </td>

                      <td>

                        <div className="probability-cell">

                          <strong>
                            {percentage.toFixed(0)}%
                          </strong>

                          <div className="probability-bar">

                            <div
                              className={
                                risk ===
                                "HIGH"
                                  ? "probability-fill high"
                                  : risk ===
                                    "MEDIUM"
                                    ? "probability-fill medium"
                                    : "probability-fill low"
                              }
                              style={{
                                width:
                                  `${percentage}%`
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td>

                        <span
                          className={
                            ghost.predicted_result ===
                            "FAIL"
                              ? "result-badge fail"
                              : "result-badge pass"
                          }
                        >
                          {ghost.predicted_result}
                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            `risk-badge ${
                              risk.toLowerCase()
                            }`
                          }
                        >
                          {risk}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

              {paginatedGhosts.length === 0 && (

                <tr>

                  <td
                    colSpan="10"
                    className="no-results"
                  >
                    NO SCENARIOS MATCH
                    THE SELECTED FILTERS
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="ghost-table-footer">

          <span>

            Showing{" "}

            {filteredGhosts.length === 0
              ? 0
              : startIndex + 1}

            {" – "}

            {Math.min(
              startIndex +
                rowsPerPage,
              filteredGhosts.length
            )}

            {" of "}

            {filteredGhosts.length.toLocaleString()}

            {" ghost scenarios"}

          </span>

          <div className="pagination">

            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              ‹
            </button>

            {getPageNumbers().map(
              (pageNumber) => (

                <button
                  key={pageNumber}
                  className={
                    currentPage ===
                    pageNumber
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(
                      pageNumber
                    )
                  }
                >
                  {pageNumber}
                </button>

              )
            )}

            <button
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >
              ›
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   ASK GHOST — FIXED CHAT + VOICE
===================================================== */

function AskGhostPage({ page, goTo }) {

  const [messages, setMessages] =
    useState([
      {
        role: "ghost",
        text:
          "Hello. I'm Ghost, your automotive validation assistant. You can ask me about the project, AEB, the ML model, test coverage, Ghost Explorer, simulation behaviour, regression, limitations, or give me a specific scenario to simulate."
      }
    ]);

  const [input, setInput] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [mode, setMode] =
    useState("chat");

  const [voiceState, setVoiceState] =
    useState("idle");

  const [voiceError, setVoiceError] =
    useState("");

  const recognitionRef =
    useRef(null);

  const mountedRef =
    useRef(true);

  const processingVoiceRef =
    useRef(false);

  const speechSupportedRef =
    useRef(false);


  /* ==========================================
     CLEANUP
  ========================================== */

  useEffect(() => {

    mountedRef.current = true;

    speechSupportedRef.current =
      Boolean(
        window.SpeechRecognition ||
        window.webkitSpeechRecognition
      );

    return () => {

      mountedRef.current = false;

      if (recognitionRef.current) {

        try {
          recognitionRef.current.abort();
        } catch (error) {
          // Ignore cleanup errors
        }

        recognitionRef.current = null;
      }

      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

    };

  }, []);


  /* ==========================================
     TEXT TO SPEECH
  ========================================== */

  const speak = (text) => {

    if (
      !("speechSynthesis" in window)
    ) {

      if (mountedRef.current) {
        setVoiceError(
          "Speech output is not supported by this browser."
        );
      }

      return;

    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang = "en-IN";
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {

      if (mountedRef.current) {
        setVoiceState("speaking");
      }

    };

    utterance.onend = () => {

      if (mountedRef.current) {
        setVoiceState("idle");
      }

    };

    utterance.onerror = () => {

      if (mountedRef.current) {
        setVoiceState("idle");
      }

    };

    window.speechSynthesis.speak(
      utterance
    );
  };


  /* ==========================================
     ASK GHOST
  ========================================== */

  const askGhost = async (
    question,
    speakAnswer = false
  ) => {

    const clean =
      String(question || "").trim();

    if (
      !clean ||
      busy
    ) {
      return;
    }

    setInput("");
    setBusy(true);

    setMessages(
      (current) => [
        ...current,
        {
          role: "user",
          text: clean
        }
      ]
    );

    try {

      const response =
        await fetch(
          `${API}/api/ask`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              question: clean
            })
          }
        );

      if (!response.ok) {
        throw new Error(
          "Ask Ghost request failed"
        );
      }

      const data =
        await response.json();

      const answer =
        data.answer ||
        "I could not generate an answer from the connected GhostTest data.";

      if (mountedRef.current) {

        setMessages(
          (current) => [
            ...current,
            {
              role: "ghost",
              text: answer
            }
          ]
        );

      }

      if (speakAnswer) {
        speak(answer);
      }

    } catch (error) {

      console.error(
        "Ask Ghost error:",
        error
      );

      const answer =
        "I could not reach the GhostTest assistant service. Please make sure the FastAPI backend is running.";

      if (mountedRef.current) {

        setMessages(
          (current) => [
            ...current,
            {
              role: "ghost",
              text: answer
            }
          ]
        );

      }

      if (speakAnswer) {
        speak(answer);
      }

    } finally {

      if (mountedRef.current) {
        setBusy(false);
      }

    }
  };


  /* ==========================================
     START VOICE
  ========================================== */

  const startVoice = async () => {

    setVoiceError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      setVoiceState("idle");

      setVoiceError(
        "Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      setMessages(
        (current) => [
          ...current,
          {
            role: "ghost",
            text:
              "Voice recognition is not available in this browser. Please use Google Chrome or Microsoft Edge."
          }
        ]
      );

      return;
    }


    /* --------------------------------------
       DON'T START WHILE GHOST IS BUSY
    -------------------------------------- */

    if (busy) {

      setVoiceError(
        "Ghost is still processing the previous question. Please wait."
      );

      return;
    }


    /* --------------------------------------
       REMOVE OLD RECOGNITION
    -------------------------------------- */

    if (recognitionRef.current) {

      try {
        recognitionRef.current.abort();
      } catch (error) {
        // Ignore
      }

      recognitionRef.current =
        null;
    }


    /* --------------------------------------
       STOP OLD SPEECH
    -------------------------------------- */

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }


    /* --------------------------------------
       REQUEST MICROPHONE PERMISSION
    -------------------------------------- */

    try {

      if (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      ) {

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true
            }
          );

        /*
         * We only use this stream to make sure
         * the browser grants microphone access.
         * SpeechRecognition opens the microphone
         * itself afterwards.
         */

        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      }

    } catch (error) {

      console.error(
        "Microphone permission error:",
        error
      );

      setVoiceState("idle");

      if (
        error.name ===
        "NotAllowedError"
      ) {

        setVoiceError(
          "Microphone permission was blocked. Click the microphone/lock icon near the browser address bar and allow microphone access."
        );

      } else if (
        error.name ===
        "NotFoundError"
      ) {

        setVoiceError(
          "No microphone was detected. Check your microphone connection."
        );

      } else if (
        error.name ===
        "NotReadableError"
      ) {

        setVoiceError(
          "The microphone is being used by another application."
        );

      } else {

        setVoiceError(
          "Ghost could not access the microphone."
        );

      }

      return;
    }


    /* --------------------------------------
       CREATE COMPLETELY NEW RECOGNIZER
    -------------------------------------- */

    const recognition =
      new SpeechRecognition();

    recognitionRef.current =
      recognition;

    recognition.lang = "en-IN";

    recognition.continuous = false;

    /*
     * IMPORTANT:
     * interimResults=true lets Chrome produce
     * speech while the user is still talking.
     */
    recognition.interimResults = true;

    recognition.maxAlternatives = 1;


    /* --------------------------------------
       START
    -------------------------------------- */

    recognition.onstart = () => {

      console.log(
        "Ghost voice recognition started"
      );

      if (
        mountedRef.current
      ) {

        setVoiceError("");
        setVoiceState("listening");

      }

    };


    /* --------------------------------------
       SPEECH RESULT
    -------------------------------------- */

    recognition.onresult =
      async (event) => {

        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {

          transcript +=
            event.results[i][0]
              .transcript;

        }

        transcript =
          transcript.trim();

        console.log(
          "Ghost heard:",
          transcript
        );

        if (!transcript) {
          return;
        }


        /*
         * Only process a FINAL result.
         * This prevents the same sentence
         * from being sent multiple times.
         */

        const finalResult =
          event.results[
            event.results.length - 1
          ];

        if (
          !finalResult.isFinal
        ) {

          setInput(
            transcript
          );

          return;
        }


        if (
          processingVoiceRef.current
        ) {
          return;
        }

        processingVoiceRef.current =
          true;

        setInput(
          transcript
        );

        setVoiceState(
          "processing"
        );


        /*
         * Stop the recognition session
         * before sending to backend.
         */

        try {
          recognition.stop();
        } catch (error) {
          // Ignore
        }

        recognitionRef.current =
          null;


        await askGhost(
          transcript,
          true
        );

        processingVoiceRef.current =
          false;
      };


    /* --------------------------------------
       VOICE ERROR
    -------------------------------------- */

    recognition.onerror =
      (event) => {

        console.error(
          "Ghost voice recognition error:",
          event.error
        );

        recognitionRef.current =
          null;

        processingVoiceRef.current =
          false;

        if (
          !mountedRef.current
        ) {
          return;
        }


        if (
          event.error ===
          "aborted"
        ) {

          setVoiceState(
            "idle"
          );

          return;
        }


        let message =
          "I couldn't hear you. Please try again.";


        if (
          event.error ===
          "no-speech"
        ) {

          message =
            "I didn't detect speech. Click the microphone and speak after it changes to LISTENING.";

        } else if (
          event.error ===
          "not-allowed"
        ) {

          message =
            "Microphone access was blocked. Allow microphone access for this site and try again.";

        } else if (
          event.error ===
          "service-not-allowed"
        ) {

          message =
            "Chrome's speech-recognition service is not allowed. Please check browser microphone permissions.";

        } else if (
          event.error ===
          "audio-capture"
        ) {

          message =
            "The microphone could not be captured. Make sure your microphone is connected and not being used by another application.";

        } else if (
          event.error ===
          "network"
        ) {

          message =
            "Chrome's speech-recognition service reported a network problem. Please try again.";

        }


        setVoiceError(
          message
        );

        setVoiceState(
          "idle"
        );

      };


    /* --------------------------------------
       RECOGNITION END
    -------------------------------------- */

    recognition.onend = () => {

      console.log(
        "Ghost voice recognition ended"
      );

      recognitionRef.current =
        null;

      if (
        !mountedRef.current
      ) {
        return;
      }

      /*
       * Don't overwrite PROCESSING or SPEAKING.
       */
      setVoiceState(
        (current) => {

          if (
            current ===
              "processing" ||
            current ===
              "speaking"
          ) {
            return current;
          }

          return "idle";

        }
      );
    };


    /* --------------------------------------
       START RECOGNITION SAFELY
    -------------------------------------- */

    try {

      recognition.start();

    } catch (error) {

      console.error(
        "Recognition start error:",
        error
      );

      recognitionRef.current =
        null;

      setVoiceState(
        "idle"
      );

      setVoiceError(
        "Ghost could not start listening. Please wait one second and press the microphone again."
      );

    }

  };


  /* ==========================================
     STOP VOICE
  ========================================== */

  const stopVoice = () => {

    processingVoiceRef.current =
      false;

    if (
      recognitionRef.current
    ) {

      try {

        recognitionRef.current.abort();

      } catch (error) {

        console.log(
          "Recognition already stopped"
        );

      }

      recognitionRef.current =
        null;
    }

    if (
      "speechSynthesis" in window
    ) {

      window.speechSynthesis.cancel();

    }

    setVoiceState(
      "idle"
    );

  };


  /* ==========================================
     MODE SWITCH
  ========================================== */

  const switchMode = (
    nextMode
  ) => {

    stopVoice();

    setVoiceError("");

    setMode(
      nextMode
    );

  };


  /* ==========================================
     QUICK QUESTIONS
  ========================================== */

  const quickPrompts = [

    "What is GhostTest and how does it work?",

    "How many scenarios are in the test space?",

    "Explain the Random Forest model.",

    "What are the limitations of this project?",

    "Why does a scenario fail?",

    "How are regression candidates selected?",

    "What is AEB in this project?",

    "What is the historical test coverage?"

  ];


  return (
    <div className="app">

      <Navigation
        page={page}
        goTo={goTo}
      />

      <main className="content-page">

        <div className="page-title">

          <div className="eyebrow">
            GHOSTTEST INTELLIGENCE / ASSISTANT
          </div>

          <h1>
            Ask Ghost
          </h1>

          <p>
            A dual-mode assistant for exploring
            GhostTest data, understanding the
            validation system, and running scenario
            questions through the connected AEB engine.
          </p>

        </div>


        <div style={askStyles.shell}>

          {/* ====================================
              HEADER
          ==================================== */}

          <div style={askStyles.header}>

            <div>

              <div style={askStyles.brand}>

                <span
                  style={
                    askStyles.liveDot
                  }
                ></span>

                GHOST ONLINE

              </div>

              <div style={askStyles.sub}>
                AUTOMOTIVE VALIDATION ASSISTANT
              </div>

            </div>


            <div
              style={
                askStyles.statusGroup
              }
            >

              <div
                style={
                  askStyles.statusText
                }
              >

                {voiceState ===
                "listening"
                  ? "LISTENING"
                  : voiceState ===
                    "processing"
                    ? "PROCESSING"
                    : voiceState ===
                      "speaking"
                      ? "SPEAKING"
                      : "READY"}

              </div>


              <div
                style={
                  askStyles.modeSwitch
                }
              >

                <button
                  style={
                    mode === "chat"
                      ? askStyles.modeActive
                      : askStyles.modeButton
                  }
                  onClick={() =>
                    switchMode("chat")
                  }
                >
                  💬 CHAT
                </button>

                <button
                  style={
                    mode === "voice"
                      ? askStyles.modeActive
                      : askStyles.modeButton
                  }
                  onClick={() =>
                    switchMode("voice")
                  }
                >
                  🎙 VOICE
                </button>

              </div>

            </div>

          </div>


          {/* ====================================
              MODE DESCRIPTION
          ==================================== */}

          <div
            style={
              askStyles.modeDescription
            }
          >

            {mode === "chat"
              ? "Chat mode · type your question · Ghost responds with text"
              : "Voice mode · click microphone · speak your question · Ghost responds with text + voice"}

          </div>


          {/* ====================================
              CHAT
          ==================================== */}

          <div
            style={
              askStyles.chatWindow
            }
          >

            {messages.map(
              (
                message,
                index
              ) => (

                <div
                  key={index}
                  style={{
                    ...askStyles.messageRow,
                    justifyContent:
                      message.role ===
                      "user"
                        ? "flex-end"
                        : "flex-start"
                  }}
                >

                  <div
                    style={
                      message.role ===
                      "user"
                        ? askStyles.userBubble
                        : askStyles.ghostBubble
                    }
                  >

                    {message.role ===
                      "ghost" && (

                      <div
                        style={
                          askStyles.ghostLabel
                        }
                      >
                        GHOST
                      </div>

                    )}

                    {message.text}

                  </div>

                </div>

              )
            )}


            {busy && (

              <div
                style={
                  askStyles.typing
                }
              >
                GHOST IS ANALYZING{" "}
                <span>
                  •••
                </span>
              </div>

            )}

          </div>


          {/* ====================================
              QUICK QUESTIONS
          ==================================== */}

          <div
            style={
              askStyles.quickHeading
            }
          >
            TRY ASKING
          </div>

          <div
            style={
              askStyles.quickRow
            }
          >

            {quickPrompts.map(
              (prompt) => (

                <button
                  key={prompt}
                  style={
                    askStyles.quickButton
                  }
                  onClick={() =>
                    askGhost(
                      prompt,
                      mode ===
                        "voice"
                    )
                  }
                  disabled={busy}
                >
                  {prompt}
                </button>

              )
            )}

          </div>


          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {voiceError && (

            <div
              style={
                askStyles.voiceError
              }
            >
              ⚠ {voiceError}
            </div>

          )}


          {/* ====================================
              COMPOSER
          ==================================== */}

          <div
            style={
              askStyles.composer
            }
          >

            <input
              style={
                askStyles.input
              }
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  askGhost(
                    input,
                    false
                  );

                }

              }}
              placeholder={
                mode === "voice"
                  ? "Click 🎙 and speak to Ghost..."
                  : "Ask Ghost anything about the GhostTest system..."
              }
              disabled={
                busy ||
                mode === "voice"
              }
            />


            <button
              style={
                voiceState ===
                "listening"
                  ? askStyles.voiceButtonActive
                  : askStyles.voiceButton
              }
              onClick={() => {

                if (
                  voiceState ===
                    "listening" ||
                  voiceState ===
                    "speaking"
                ) {

                  stopVoice();

                } else {

                  startVoice();

                }

              }}
              disabled={
                busy &&
                voiceState !==
                  "speaking"
              }
              title={
                voiceState ===
                "listening"
                  ? "Stop listening"
                  : voiceState ===
                    "speaking"
                    ? "Stop speaking"
                    : "Start voice assistant"
              }
            >

              {voiceState ===
                "listening"
                ? "■"
                : voiceState ===
                  "speaking"
                  ? "■"
                  : "🎙"}

            </button>


            <button
              style={
                askStyles.sendButton
              }
              onClick={() =>
                askGhost(
                  input,
                  false
                )
              }
              disabled={
                busy ||
                mode ===
                  "voice" ||
                !input.trim()
              }
            >
              ➤
            </button>

          </div>


          {/* ====================================
              VOICE STATUS
          ==================================== */}

          <div
            style={
              askStyles.voiceHint
            }
          >

            {voiceState ===
              "listening"
              ? "🎙 LISTENING · speak now"
              : voiceState ===
                "processing"
                ? "◌ Ghost is processing your question…"
                : voiceState ===
                  "speaking"
                  ? "🔊 Ghost is speaking · press ■ to stop"
                  : mode ===
                    "voice"
                    ? "VOICE MODE · click 🎙 · wait for LISTENING · then speak"
                    : "CHAT MODE · text input · text response"}

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   ASK GHOST STYLES
===================================================== */

const askStyles = {

  shell: {
    maxWidth: "1050px",
    margin: "0 auto",
    border:
      "1px solid rgba(255,255,255,0.09)",
    borderRadius: "16px",
    overflow: "hidden",
    background:
      "rgba(5,10,15,0.72)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.25)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "20px 24px",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)"
  },

  brand: {
    fontWeight: 800,
    letterSpacing: "0.12em",
    fontSize: "13px"
  },

  liveDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3de0a8",
    boxShadow:
      "0 0 12px #3de0a8",
    marginRight: "7px"
  },

  sub: {
    fontSize: "10px",
    opacity: 0.55,
    letterSpacing: "0.14em",
    marginTop: "5px"
  },

  statusGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },

  statusText: {
    fontSize: "10px",
    letterSpacing: "0.14em",
    opacity: 0.7
  },

  modeSwitch: {
    display: "flex",
    border:
      "1px solid rgba(255,255,255,0.10)",
    borderRadius: "9px",
    overflow: "hidden"
  },

  modeButton: {
    border: "none",
    background: "transparent",
    color: "inherit",
    padding: "9px 12px",
    fontSize: "10px",
    letterSpacing: "0.08em",
    cursor: "pointer"
  },

  modeActive: {
    border: "none",
    background:
      "rgba(61,224,168,0.14)",
    color: "inherit",
    padding: "9px 12px",
    fontSize: "10px",
    letterSpacing: "0.08em",
    cursor: "pointer"
  },

  modeDescription: {
    padding: "11px 24px",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
    fontSize: "10px",
    letterSpacing: "0.08em",
    opacity: 0.55
  },

  chatWindow: {
    minHeight: "430px",
    maxHeight: "560px",
    overflowY: "auto",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  messageRow: {
    display: "flex",
    width: "100%"
  },

  ghostBubble: {
    maxWidth: "78%",
    padding: "16px 18px",
    borderRadius:
      "12px 12px 12px 3px",
    background:
      "rgba(255,255,255,0.045)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    lineHeight: 1.6,
    fontSize: "14px"
  },

  userBubble: {
    maxWidth: "78%",
    padding: "16px 18px",
    borderRadius:
      "12px 12px 3px 12px",
    background:
      "rgba(61,224,168,0.10)",
    border:
      "1px solid rgba(61,224,168,0.22)",
    lineHeight: 1.6,
    fontSize: "14px"
  },

  ghostLabel: {
    fontSize: "9px",
    letterSpacing: "0.16em",
    fontWeight: 800,
    marginBottom: "7px",
    opacity: 0.7
  },

  typing: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    opacity: 0.55,
    paddingLeft: "4px"
  },

  quickHeading: {
    padding:
      "0 24px 8px",
    fontSize: "9px",
    letterSpacing: "0.15em",
    opacity: 0.45
  },

  quickRow: {
    display: "flex",
    gap: "8px",
    padding:
      "0 24px 16px",
    overflowX: "auto"
  },

  quickButton: {
    whiteSpace: "nowrap",
    border:
      "1px solid rgba(255,255,255,0.10)",
    background: "transparent",
    color: "inherit",
    borderRadius: "20px",
    padding: "9px 12px",
    fontSize: "11px",
    cursor: "pointer"
  },

  voiceError: {
    margin:
      "0 24px 12px",
    padding:
      "12px 14px",
    border:
      "1px solid rgba(255,77,90,0.35)",
    background:
      "rgba(255,77,90,0.08)",
    borderRadius: "8px",
    fontSize: "11px",
    lineHeight: 1.5
  },

  composer: {
    display: "grid",
    gridTemplateColumns:
      "1fr 48px 48px",
    gap: "8px",
    padding:
      "18px 24px",
    borderTop:
      "1px solid rgba(255,255,255,0.08)"
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "9px",
    border:
      "1px solid rgba(255,255,255,0.12)",
    background:
      "rgba(0,0,0,0.25)",
    color: "inherit",
    outline: "none"
  },

  voiceButton: {
    borderRadius: "9px",
    border:
      "1px solid rgba(255,255,255,0.12)",
    background:
      "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px"
  },

  voiceButtonActive: {
    borderRadius: "9px",
    border:
      "1px solid rgba(255,77,90,0.5)",
    background:
      "rgba(255,77,90,0.12)",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px"
  },

  sendButton: {
    borderRadius: "9px",
    border:
      "1px solid rgba(61,224,168,0.35)",
    background:
      "rgba(61,224,168,0.10)",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px"
  },

  voiceHint: {
    textAlign: "center",
    fontSize: "10px",
    letterSpacing: "0.08em",
    opacity: 0.5,
    padding:
      "0 24px 18px"
  }

};


export default App;