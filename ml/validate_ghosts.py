import pandas as pd
import os
import sys
import random

# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

SIMULATOR_DIR = os.path.join(
    BASE_DIR,
    "simulator"
)

sys.path.append(SIMULATOR_DIR)

from simulator import simulate_aeb


ghost_file = os.path.join(
    BASE_DIR,
    "data",
    "ghost_scenarios.csv"
)

output_file = os.path.join(
    BASE_DIR,
    "data",
    "validated_ghost_scenarios.csv"
)


# ==========================================
# LOAD ALL UNSEEN SCENARIOS
# ==========================================

df = pd.read_csv(ghost_file)

print("\nGhostTest AI - Ghost Validation")
print("=" * 50)

print(
    f"Unseen scenarios available: {len(df)}"
)


# ==========================================
# RUN SIMULATOR
# ==========================================

validated_all = []

for _, scenario in df.iterrows():

    simulation = simulate_aeb(
        speed=scenario["speed"],
        object_distance=scenario["object_distance"],
        sensor_delay=scenario["sensor_delay"],
        visibility=scenario["visibility"],
        weather=scenario["weather"],
        road_condition=scenario["road_condition"]
    )

    actual_result = simulation["result"]

    validated_all.append({
        "speed": scenario["speed"],
        "object_distance": scenario["object_distance"],
        "visibility": scenario["visibility"],
        "weather": scenario["weather"],
        "sensor_delay": scenario["sensor_delay"],
        "road_condition": scenario["road_condition"],
        "predicted_result": scenario["predicted_result"],
        "failure_probability": scenario["failure_probability"],
        "actual_result": actual_result,
        "prediction_correct": int(
            scenario["predicted_result"] == actual_result
        ),
        "stopping_distance": simulation["stopping_distance"],
        "margin": simulation["margin"],
        "effective_deceleration": simulation[
            "effective_deceleration"
        ]
    })


all_validated = pd.DataFrame(validated_all)


# ==========================================
# SEPARATE PASS AND FAIL
# ==========================================

pass_cases = all_validated[
    all_validated["actual_result"] == "PASS"
]

fail_cases = all_validated[
    all_validated["actual_result"] == "FAIL"
]


print(
    f"Actual PASS scenarios available: {len(pass_cases)}"
)

print(
    f"Actual FAIL scenarios available: {len(fail_cases)}"
)


# ==========================================
# SELECT BALANCED VALIDATION SET
# ==========================================

random.seed(42)

selected_pass = pass_cases.sample(
    n=min(10, len(pass_cases)),
    random_state=42
)

selected_fail = fail_cases.sample(
    n=min(10, len(fail_cases)),
    random_state=42
)


validated_df = pd.concat(
    [selected_fail, selected_pass]
).sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


# ==========================================
# SAVE
# ==========================================

validated_df.to_csv(
    output_file,
    index=False
)


# ==========================================
# SUMMARY
# ==========================================

pass_count = (
    validated_df["actual_result"] == "PASS"
).sum()

fail_count = (
    validated_df["actual_result"] == "FAIL"
).sum()

correct_count = (
    validated_df["prediction_correct"] == 1
).sum()

accuracy = (
    correct_count / len(validated_df)
) * 100


print("\nValidation dataset created!")
print("=" * 50)

print(
    f"Validated scenarios : {len(validated_df)}"
)

print(
    f"PASS cases          : {pass_count}"
)

print(
    f"FAIL cases          : {fail_count}"
)

print(
    f"Prediction accuracy : {accuracy:.2f}%"
)

print("\nResult distribution:")
print(
    validated_df["actual_result"].value_counts()
)

print("\nSaved to:")
print(output_file)