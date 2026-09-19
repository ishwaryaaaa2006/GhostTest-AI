import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
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

output_file = os.path.join(
    BASE_DIR,
    "data",
    "ghost_scenarios.csv"
)

model_file = os.path.join(
    BASE_DIR,
    "ml",
    "ghosttest_model.pkl"
)


print("\nGhostTest AI - ML Risk Prediction")
print("=" * 50)


# -----------------------------------------------------
# LOAD DATA
# -----------------------------------------------------

historical = pd.read_csv(historical_file)
unseen = pd.read_csv(unseen_file)

print(f"Historical test cases : {len(historical)}")
print(f"Unseen scenarios      : {len(unseen)}")


# -----------------------------------------------------
# FEATURES
# -----------------------------------------------------

features = [
    "speed",
    "object_distance",
    "visibility",
    "weather",
    "sensor_delay",
    "road_condition"
]

target = "result"


X = historical[features]
y = historical[target].map({
    "PASS": 0,
    "FAIL": 1
})


# -----------------------------------------------------
# TRAIN / TEST SPLIT
# -----------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print(f"Training data: {len(X_train)}")
print(f"Testing data : {len(X_test)}")


# -----------------------------------------------------
# PREPROCESSING
# -----------------------------------------------------

categorical_features = [
    "visibility",
    "weather",
    "road_condition"
]

numeric_features = [
    "speed",
    "object_distance",
    "sensor_delay"
]


preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# -----------------------------------------------------
# BASE RANDOM FOREST
# -----------------------------------------------------

random_forest = RandomForestClassifier(
    n_estimators=250,
    random_state=42,
    class_weight="balanced",
    min_samples_leaf=3
)


base_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", random_forest)
])


# -----------------------------------------------------
# CALIBRATED MODEL
# -----------------------------------------------------

model = CalibratedClassifierCV(
    base_pipeline,
    method="sigmoid",
    cv=5
)


print("\nTraining calibrated Random Forest...")

model.fit(X_train, y_train)


# -----------------------------------------------------
# MODEL EVALUATION
# -----------------------------------------------------

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, 1]


accuracy = accuracy_score(y_test, predictions)
precision = precision_score(y_test, predictions, zero_division=0)
recall = recall_score(y_test, predictions, zero_division=0)
f1 = f1_score(y_test, predictions, zero_division=0)


print("\nModel Performance")
print("-" * 50)

print(f"Accuracy  : {accuracy:.3f}")
print(f"Precision : {precision:.3f}")
print(f"Recall    : {recall:.3f}")
print(f"F1 Score  : {f1:.3f}")


print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))


print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions,
        target_names=["PASS", "FAIL"],
        zero_division=0
    )
)


# -----------------------------------------------------
# PREDICT UNSEEN SCENARIOS
# -----------------------------------------------------

unseen_features = unseen[features]

unseen_predictions = model.predict(unseen_features)
unseen_probabilities = model.predict_proba(
    unseen_features
)[:, 1]


ghosts = unseen.copy()

ghosts["failure_probability"] = unseen_probabilities

ghosts["predicted_result"] = [
    "FAIL" if prediction == 1 else "PASS"
    for prediction in unseen_predictions
]


# -----------------------------------------------------
# SORT BY FAILURE PROBABILITY
# -----------------------------------------------------

ghosts = ghosts.sort_values(
    by="failure_probability",
    ascending=False
)

ghosts = ghosts.reset_index(drop=True)


# -----------------------------------------------------
# SAVE
# -----------------------------------------------------

ghosts.to_csv(
    output_file,
    index=False
)

joblib.dump(
    model,
    model_file
)


print("\nGhost scenario generation completed!")
print("-" * 50)

print(f"Unseen scenarios : {len(ghosts)}")

print(
    f"Predicted FAIL   : "
    f"{(ghosts.predicted_result == 'FAIL').sum()}"
)

print(
    f"Predicted PASS   : "
    f"{(ghosts.predicted_result == 'PASS').sum()}"
)

print("\nTop 10 Ghost Scenarios:")

print(
    ghosts[
        [
            "speed",
            "object_distance",
            "visibility",
            "weather",
            "sensor_delay",
            "road_condition",
            "failure_probability",
            "predicted_result"
        ]
    ].head(10).to_string(index=False)
)

print("\nSaved:")
print(output_file)