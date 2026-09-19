import pandas as pd
import os

HISTORICAL_TEST_COUNT = 400
RANDOM_SEED = 42

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

simulation_file = os.path.join(
    BASE_DIR,
    "data",
    "simulation_results.csv"
)

historical_file = os.path.join(
    BASE_DIR,
    "data",
    "historical_tests.csv"
)

unseen_file = os.path.join(
    BASE_DIR,
    "data",
    "unseen_scenarios.csv"
)


print("\nGhostTest AI - Data Pipeline")
print("=" * 50)


df = pd.read_csv(simulation_file)

scenario_columns = [
    "speed",
    "object_distance",
    "visibility",
    "weather",
    "sensor_delay",
    "road_condition"
]


# -----------------------------------------------------
# CREATE BALANCED HISTORICAL SAMPLE
# -----------------------------------------------------

passes = df[df["result"] == "PASS"]
fails = df[df["result"] == "FAIL"]


# Approximately half PASS and half FAIL
pass_count = min(
    HISTORICAL_TEST_COUNT // 2,
    len(passes)
)

fail_count = HISTORICAL_TEST_COUNT - pass_count


historical_pass = passes.sample(
    n=pass_count,
    random_state=RANDOM_SEED
)

historical_fail = fails.sample(
    n=fail_count,
    random_state=RANDOM_SEED
)


historical = pd.concat(
    [
        historical_pass,
        historical_fail
    ]
)


historical = historical.sample(
    frac=1,
    random_state=RANDOM_SEED
).reset_index(drop=True)


# -----------------------------------------------------
# FIND UNSEEN SCENARIOS
# -----------------------------------------------------

historical_keys = set(
    tuple(row)
    for row in historical[scenario_columns].values
)


unseen = df[
    ~df[scenario_columns]
    .apply(tuple, axis=1)
    .isin(historical_keys)
].copy()


# -----------------------------------------------------
# SAVE
# -----------------------------------------------------

historical.to_csv(
    historical_file,
    index=False
)

unseen.to_csv(
    unseen_file,
    index=False
)


coverage = (
    len(historical) / len(df)
) * 100


print("\nData pipeline completed!")
print("-" * 50)

print(f"Total scenarios       : {len(df)}")
print(f"Historical test cases : {len(historical)}")
print(f"Historical PASS       : {(historical.result == 'PASS').sum()}")
print(f"Historical FAIL       : {(historical.result == 'FAIL').sum()}")
print(f"Untested scenarios    : {len(unseen)}")
print(f"Historical coverage   : {coverage:.2f}%")

print("\nFiles created:")
print(historical_file)
print(unseen_file)