from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import sqlite3
import os
import sys
import pandas as pd

app = FastAPI(
    title="GhostTest AI API",
    description="AI-assisted automotive software validation system",
    version="1.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_FILE = os.path.join(BASE_DIR, "data", "ghosttest.db")
UNSEEN_FILE = os.path.join(BASE_DIR, "data", "unseen_scenarios.csv")
GHOST_FILE = os.path.join(BASE_DIR, "data", "ghost_scenarios.csv")
SIMULATOR_DIR = os.path.join(BASE_DIR, "simulator")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

sys.path.append(SIMULATOR_DIR)
sys.path.append(BACKEND_DIR)

from simulator import simulate_aeb
from ghost_intelligence import analyze_scenario
from test_vector_generator import generate_test_vector
from scenario_comparison import compare_scenarios
from ghost_chat import answer_project_question


def get_connection():
    return sqlite3.connect(DATABASE_FILE)


class ScenarioRequest(BaseModel):
    speed: float
    object_distance: float
    visibility: Literal["Good", "Moderate", "Poor"]
    weather: Literal["Clear", "Rain", "Fog"]
    sensor_delay: float
    road_condition: Literal["Dry", "Wet", "Slippery"]


class CompareRequest(BaseModel):
    scenario_a: ScenarioRequest
    scenario_b: ScenarioRequest


class AskRequest(BaseModel):
    question: str


def run_aeb(request: ScenarioRequest):
    return simulate_aeb(
        speed=request.speed,
        object_distance=request.object_distance,
        sensor_delay=request.sensor_delay,
        visibility=request.visibility,
        weather=request.weather,
        road_condition=request.road_condition
    )


def scenario_dict(request: ScenarioRequest):
    return {
        "speed": request.speed,
        "object_distance": request.object_distance,
        "visibility": request.visibility,
        "weather": request.weather,
        "sensor_delay": request.sensor_delay,
        "road_condition": request.road_condition
    }


def explain_scenario(speed, object_distance, sensor_delay, visibility, weather, road_condition, simulation):
    factors = []
    if speed >= 100:
        factors.append("High vehicle speed significantly increases braking distance.")
    elif speed >= 80:
        factors.append("Elevated vehicle speed increases the distance required to stop.")
    if object_distance <= 10:
        factors.append("Very short object distance leaves little room for emergency braking.")
    elif object_distance <= 20:
        factors.append("Limited object distance reduces the available stopping margin.")
    if sensor_delay >= 0.15:
        factors.append("Sensor delay increases the distance travelled before braking begins.")
    elif sensor_delay > 0:
        factors.append("Sensor delay adds additional reaction distance.")
    if visibility == "Poor":
        factors.append("Poor visibility increases detection delay.")
    elif visibility == "Moderate":
        factors.append("Moderate visibility introduces additional detection delay.")
    if weather == "Rain":
        factors.append("Rain reduces effective braking performance.")
    elif weather == "Fog":
        factors.append("Fog reduces braking performance and is also associated with reduced visibility.")
    if road_condition == "Wet":
        factors.append("Wet road conditions reduce effective deceleration.")
    elif road_condition == "Slippery":
        factors.append("Slippery road conditions significantly reduce effective braking performance.")
    if simulation["result"] == "FAIL":
        conclusion = "The vehicle cannot stop within the available distance. This scenario represents a potential AEB failure condition."
    else:
        conclusion = "The vehicle can stop within the available distance. The scenario passes the AEB stopping-distance check."
    return {"risk_factors": factors, "conclusion": conclusion}


@app.get("/")
def root():
    return {"message": "GhostTest AI API is running", "status": "active"}


@app.get("/api/summary")
def get_summary():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM historical_tests")
    historical_tests = cursor.fetchone()[0]

    ghost_scenarios = 0
    if os.path.exists(UNSEEN_FILE):
        unseen_df = pd.read_csv(UNSEEN_FILE)
        ghost_scenarios = len(unseen_df)

    cursor.execute("SELECT COUNT(*) FROM ghost_scenarios WHERE actual_result = 'FAIL'")
    confirmed_failures = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM ghost_scenarios WHERE prediction_correct = 1")
    correct_predictions = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM ghost_scenarios WHERE regression_candidate = 1")
    regression_candidates = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM ghost_scenarios")
    validated_count = cursor.fetchone()[0]
    connection.close()

    validation_accuracy = 0
    if validated_count > 0:
        validation_accuracy = (correct_predictions / validated_count) * 100

    return {
        "historical_tests": historical_tests,
        "ghost_scenarios": ghost_scenarios,
        "confirmed_failures": confirmed_failures,
        "validation_accuracy": round(validation_accuracy, 2),
        "regression_candidates": regression_candidates
    }


@app.get("/api/ghosts")
def get_ghosts():
    if not os.path.exists(GHOST_FILE):
        return []
    df = pd.read_csv(GHOST_FILE)
    df["failure_probability"] = pd.to_numeric(df["failure_probability"], errors="coerce").fillna(0)
    if "predicted_result" not in df.columns:
        df["predicted_result"] = df["failure_probability"].apply(lambda x: "FAIL" if x >= 0.5 else "PASS")
    df = df.fillna("")
    df = df.sort_values(by="failure_probability", ascending=False)
    return df.to_dict(orient="records")


@app.get("/api/historical")
def get_historical():
    connection = get_connection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM historical_tests")
    rows = cursor.fetchall()
    connection.close()
    return [dict(row) for row in rows]


@app.get("/api/regression")
def get_regression_candidates():
    connection = get_connection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM ghost_scenarios WHERE regression_candidate = 1 ORDER BY failure_probability DESC")
    rows = cursor.fetchall()
    connection.close()
    return [dict(row) for row in rows]


@app.post("/api/ask")
def ask_ghost(request: AskRequest):
    # Keep the assistant grounded in the same live data exposed by the dashboard.
    summary = get_summary()
    ghosts = get_ghosts()
    regression = get_regression_candidates()

    def simulate_for_ghost(scenario):
        scenario_request = ScenarioRequest(**scenario)
        simulation = run_aeb(scenario_request)
        explanation = explain_scenario(
            speed=scenario_request.speed,
            object_distance=scenario_request.object_distance,
            sensor_delay=scenario_request.sensor_delay,
            visibility=scenario_request.visibility,
            weather=scenario_request.weather,
            road_condition=scenario_request.road_condition,
            simulation=simulation
        )
        return {"scenario": scenario, "simulation": simulation, "explanation": explanation}

    answer = answer_project_question(
        request.question,
        summary,
        ghosts,
        regression,
        simulate=simulate_for_ghost
    )

    return {
        "answer": answer,
        "grounded": True,
        "assistant": "Ghost",
    }


@app.post("/api/simulate")
def run_simulation(scenario: ScenarioRequest):
    simulation = run_aeb(scenario)
    explanation = explain_scenario(
        speed=scenario.speed,
        object_distance=scenario.object_distance,
        sensor_delay=scenario.sensor_delay,
        visibility=scenario.visibility,
        weather=scenario.weather,
        road_condition=scenario.road_condition,
        simulation=simulation
    )
    return {
        "scenario": scenario_dict(scenario),
        "simulation": simulation,
        "explanation": explanation
    }


@app.post("/api/intelligence")
def run_intelligence(scenario: ScenarioRequest):
    simulation = run_aeb(scenario)
    analysis = analyze_scenario(
        speed=scenario.speed,
        object_distance=scenario.object_distance,
        visibility=scenario.visibility,
        weather=scenario.weather,
        sensor_delay=scenario.sensor_delay,
        road_condition=scenario.road_condition,
        simulation=simulation
    )
    return {
        "scenario": scenario_dict(scenario),
        "simulation": simulation,
        "analysis": analysis
    }


@app.post("/api/test-vector")
def run_test_vector(scenario: ScenarioRequest):
    simulation = run_aeb(scenario)
    analysis = analyze_scenario(
        speed=scenario.speed,
        object_distance=scenario.object_distance,
        visibility=scenario.visibility,
        weather=scenario.weather,
        sensor_delay=scenario.sensor_delay,
        road_condition=scenario.road_condition,
        simulation=simulation
    )

    vector_scenario = scenario_dict(scenario)
    vector_scenario["predicted_result"] = simulation["result"]
    vector_scenario["actual_result"] = simulation["result"]

    test_vector = generate_test_vector(vector_scenario, analysis)

    return {
        "test_vector": test_vector,
        "simulation": simulation,
        "analysis": analysis
    }


@app.post("/api/compare")
def compare_scenario_pair(request: CompareRequest):
    simulation_a = run_aeb(request.scenario_a)
    simulation_b = run_aeb(request.scenario_b)

    scenario_a = scenario_dict(request.scenario_a)
    scenario_a.update({
        "result": simulation_a["result"],
        "stopping_distance": simulation_a["stopping_distance"],
        "margin": simulation_a["margin"]
    })

    scenario_b = scenario_dict(request.scenario_b)
    scenario_b.update({
        "result": simulation_b["result"],
        "stopping_distance": simulation_b["stopping_distance"],
        "margin": simulation_b["margin"]
    })

    comparison = compare_scenarios(scenario_a, scenario_b)

    return {
        "scenario_a": {
            "result": simulation_a["result"],
            "stopping_distance": round(simulation_a["stopping_distance"], 2),
            "safety_margin": round(simulation_a["margin"], 2)
        },
        "scenario_b": {
            "result": simulation_b["result"],
            "stopping_distance": round(simulation_b["stopping_distance"], 2),
            "safety_margin": round(simulation_b["margin"], 2)
        },
        "comparison": comparison
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "GhostTest AI"}
