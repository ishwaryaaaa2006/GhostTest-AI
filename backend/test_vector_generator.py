def generate_test_vector(
    scenario,
    intelligence
):
    test_id = "GT-AEB-0001"

    if intelligence["risk_level"] == "HIGH":
        priority = "HIGH"
    elif intelligence["risk_level"] == "MEDIUM":
        priority = "MEDIUM"
    else:
        priority = "LOW"

    actual_result = scenario.get(
        "actual_result",
        scenario.get("result", "UNKNOWN")
    )

    predicted_result = scenario.get(
        "predicted_result",
        "UNKNOWN"
    )

    test_vector = {
        "test_id": test_id,

        "scenario": {
            "speed_kmh": scenario["speed"],
            "object_distance_m": scenario["object_distance"],
            "visibility": scenario["visibility"],
            "weather": scenario["weather"],
            "sensor_delay_s": scenario["sensor_delay"],
            "road_condition": scenario["road_condition"]
        },

        "expected_result": predicted_result,
        "actual_result": actual_result,

        "analysis": {
            "risk_level": intelligence["risk_level"],
            "stopping_distance_m": intelligence["stopping_distance"],
            "available_distance_m": intelligence["available_distance"],
            "safety_margin_m": intelligence["safety_margin"],
            "effective_deceleration": intelligence[
                "effective_deceleration"
            ]
        },

        "risk_factors": intelligence["risk_factors"],

        "priority": priority,

        "regression_candidate": (
            actual_result == "FAIL"
        ),

        "conclusion": intelligence["conclusion"],

        "recommendation": intelligence["recommendation"]
    }

    return test_vector