def analyze_scenario(
    speed,
    object_distance,
    visibility,
    weather,
    sensor_delay,
    road_condition,
    simulation
):
    risk_factors = []

    # Speed analysis
    if speed >= 100:
        risk_factors.append(
            "High vehicle speed significantly increases braking distance."
        )
    elif speed >= 80:
        risk_factors.append(
            "Elevated vehicle speed increases the distance required to stop."
        )

    # Object distance
    if object_distance <= 10:
        risk_factors.append(
            "Very short object distance leaves little room for emergency braking."
        )
    elif object_distance <= 20:
        risk_factors.append(
            "Limited object distance reduces the available stopping margin."
        )

    # Sensor delay
    if sensor_delay >= 0.15:
        risk_factors.append(
            "High sensor delay increases the distance travelled before braking begins."
        )
    elif sensor_delay > 0:
        risk_factors.append(
            "Sensor delay adds additional reaction distance."
        )

    # Visibility
    if visibility == "Poor":
        risk_factors.append(
            "Poor visibility increases detection delay."
        )
    elif visibility == "Moderate":
        risk_factors.append(
            "Moderate visibility introduces additional detection delay."
        )

    # Weather
    if weather == "Rain":
        risk_factors.append(
            "Rain reduces effective braking performance."
        )
    elif weather == "Fog":
        risk_factors.append(
            "Fog reduces braking performance and visibility."
        )

    # Road condition
    if road_condition == "Wet":
        risk_factors.append(
            "Wet road conditions reduce effective deceleration."
        )
    elif road_condition == "Slippery":
        risk_factors.append(
            "Slippery road conditions significantly reduce braking performance."
        )

    # Risk level
    failure_probability = simulation.get(
        "failure_probability",
        None
    )

    if simulation["result"] == "FAIL":
        risk_level = "HIGH"
        recommendation = (
            "Add this scenario to the regression test suite."
        )
    else:
        risk_level = "LOW"
        recommendation = (
            "Scenario passes the stopping-distance check."
        )

    # If no specific factors were found
    if not risk_factors:
        risk_factors.append(
            "No major risk factors detected for this scenario."
        )

    # Main conclusion
    if simulation["result"] == "FAIL":
        conclusion = (
            "The vehicle cannot stop within the available "
            "object distance. This represents a potential "
            "AEB failure condition."
        )
    else:
        conclusion = (
            "The vehicle can stop within the available "
            "object distance. The AEB stopping-distance "
            "check passes."
        )

    return {
        "risk_level": risk_level,
        "failure_probability": failure_probability,
        "risk_factors": risk_factors,
        "stopping_distance": round(
            simulation["stopping_distance"], 2
        ),
        "available_distance": object_distance,
        "safety_margin": round(
            simulation["margin"], 2
        ),
        "effective_deceleration": round(
            simulation["effective_deceleration"], 2
        ),
        "conclusion": conclusion,
        "recommendation": recommendation
    }