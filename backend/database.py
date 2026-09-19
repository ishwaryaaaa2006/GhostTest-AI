import sqlite3
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASE_FILE = os.path.join(
    BASE_DIR,
    "data",
    "ghosttest.db"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)

connection = sqlite3.connect(DATABASE_FILE)
cursor = connection.cursor()


# ==================================================
# Historical Tests Table
# ==================================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS historical_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    speed REAL,
    object_distance REAL,
    visibility TEXT,
    weather TEXT,
    sensor_delay REAL,
    road_condition TEXT,
    result TEXT,
    stopping_distance REAL,
    margin REAL,
    effective_deceleration REAL
)
""")


# ==================================================
# Ghost Scenarios Table
# ==================================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS ghost_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    speed REAL,
    object_distance REAL,
    visibility TEXT,
    weather TEXT,
    sensor_delay REAL,
    road_condition TEXT,
    predicted_result TEXT,
    failure_probability REAL,
    actual_result TEXT,
    prediction_correct INTEGER,
    regression_candidate INTEGER
)
""")


# ==================================================
# Load Historical Tests
# ==================================================

historical_file = os.path.join(
    DATA_DIR,
    "historical_tests.csv"
)

if os.path.exists(historical_file):

    historical_df = pd.read_csv(historical_file)

    historical_df = historical_df[
        [
            "speed",
            "object_distance",
            "visibility",
            "weather",
            "sensor_delay",
            "road_condition",
            "result",
            "stopping_distance",
            "margin",
            "effective_deceleration"
        ]
    ]

    historical_df.to_sql(
        "historical_tests",
        connection,
        if_exists="replace",
        index=False
    )

    print(
        f"Historical tests inserted: {len(historical_df)}"
    )


# ==================================================
# Load Validated Ghost Scenarios
# ==================================================

ghost_file = os.path.join(
    DATA_DIR,
    "validated_ghost_scenarios.csv"
)

if os.path.exists(ghost_file):

    ghost_df = pd.read_csv(ghost_file)

    # A validated FAIL becomes a regression candidate.
    ghost_df["regression_candidate"] = (
        ghost_df["actual_result"] == "FAIL"
    ).astype(int)

    ghost_df = ghost_df[
        [
            "speed",
            "object_distance",
            "visibility",
            "weather",
            "sensor_delay",
            "road_condition",
            "predicted_result",
            "failure_probability",
            "actual_result",
            "prediction_correct",
            "regression_candidate"
        ]
    ]

    ghost_df.to_sql(
        "ghost_scenarios",
        connection,
        if_exists="replace",
        index=False
    )

    print(
        f"Ghost scenarios inserted: {len(ghost_df)}"
    )


# ==================================================
# Database Summary
# ==================================================

print("\nGhostTest AI Database")
print("=" * 45)

cursor.execute(
    "SELECT COUNT(*) FROM historical_tests"
)

historical_count = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM ghost_scenarios"
)

ghost_count = cursor.fetchone()[0]

cursor.execute("""
    SELECT COUNT(*)
    FROM ghost_scenarios
    WHERE regression_candidate = 1
""")

regression_count = cursor.fetchone()[0]

print(
    f"Historical tests     : {historical_count}"
)

print(
    f"Ghost scenarios      : {ghost_count}"
)

print(
    f"Regression candidates: {regression_count}"
)

print("\nDatabase created successfully!")

print("\nDatabase location:")
print(DATABASE_FILE)

connection.close()