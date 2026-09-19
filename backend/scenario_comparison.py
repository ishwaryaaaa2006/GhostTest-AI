def compare_scenarios(scenario_a, scenario_b):
    differences = {}

    fields = [
        "speed",
        "object_distance",
        "visibility",
        "weather",
        "sensor_delay",
        "road_condition"
    ]

    for field in fields:
        value_a = scenario_a.get(field)
        value_b = scenario_b.get(field)

        if value_a != value_b:
            differences[field] = {
                "scenario_a": value_a,
                "scenario_b": value_b
            }

    # Compare simulation results
    stopping_a = scenario_a.get("stopping_distance")
    stopping_b = scenario_b.get("stopping_distance")

    margin_a = scenario_a.get("margin")
    margin_b = scenario_b.get("margin")

    result_a = scenario_a.get("actual_result", scenario_a.get("result"))
    result_b = scenario_b.get("actual_result", scenario_b.get("result"))

    comparison = {
        "scenario_a": {
            "result": result_a,
            "stopping_distance": stopping_a,
            "safety_margin": margin_a
        },

        "scenario_b": {
            "result": result_b,
            "stopping_distance": stopping_b,
            "safety_margin": margin_b
        },

        "differences": differences
    }

    # Determine which scenario has the smaller stopping distance
    if stopping_a is not None and stopping_b is not None:
        if stopping_a < stopping_b:
            comparison["stopping_distance_difference"] = round(
                stopping_b - stopping_a, 2
            )
            comparison["lower_stopping_distance"] = "Scenario A"

        elif stopping_b < stopping_a:
            comparison["stopping_distance_difference"] = round(
                stopping_a - stopping_b, 2
            )
            comparison["lower_stopping_distance"] = "Scenario B"

        else:
            comparison["stopping_distance_difference"] = 0
            comparison["lower_stopping_distance"] = "Equal"

    # Compare safety margins
    if margin_a is not None and margin_b is not None:
        comparison["margin_difference"] = round(
            margin_a - margin_b, 2
        )

        if margin_a > margin_b:
            comparison["larger_safety_margin"] = "Scenario A"

        elif margin_b > margin_a:
            comparison["larger_safety_margin"] = "Scenario B"

        else:
            comparison["larger_safety_margin"] = "Equal"

    return comparison