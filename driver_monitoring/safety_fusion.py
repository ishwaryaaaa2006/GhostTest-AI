import math


# ============================================================
# GhostTest AI - Safety Fusion
# Driver State + AEB Scenario Risk
# ============================================================


def calculate_aeb_risk(
    speed,
    object_distance,
    visibility,
    weather,
    sensor_delay,
    road_condition
):
    """
    Estimate AEB scenario risk using the same physical
    assumptions as the GhostTest simulator.
    """

    # Convert km/h -> m/s
    velocity = speed * 1000 / 3600

    # Driver reaction time
    reaction_time = 0.5

    # Additional visibility delay
    visibility_delay = {
        "Good": 0.0,
        "Moderate": 0.1,
        "Poor": 0.2
    }

    extra_visibility_delay = visibility_delay.get(
        visibility,
        0.0
    )

    total_delay = (
        reaction_time
        + sensor_delay
        + extra_visibility_delay
    )

    # Distance travelled during delay
    delay_distance = velocity * total_delay

    # Base braking performance
    base_deceleration = 8.0

    weather_modifier = {
        "Clear": 1.0,
        "Rain": 0.9,
        "Fog": 0.85
    }

    road_modifier = {
        "Dry": 1.0,
        "Wet": 0.85,
        "Slippery": 0.70
    }

    weather_factor = weather_modifier.get(
        weather,
        1.0
    )

    road_factor = road_modifier.get(
        road_condition,
        1.0
    )

    effective_deceleration = (
        base_deceleration
        * weather_factor
        * road_factor
    )

    # Braking distance
    braking_distance = (
        velocity ** 2
        / (2 * effective_deceleration)
    )

    # Total stopping distance
    stopping_distance = (
        delay_distance
        + braking_distance
    )

    # Safety margin
    safety_margin = (
        object_distance
        - stopping_distance
    )

    # AEB result
    if safety_margin >= 0:
        aeb_result = "PASS"
    else:
        aeb_result = "FAIL"

    # ---------------------------------------------
    # Determine AEB risk level
    # ---------------------------------------------

    if safety_margin < -30:
        aeb_risk = "CRITICAL"

    elif safety_margin < 0:
        aeb_risk = "HIGH"

    elif safety_margin < 10:
        aeb_risk = "MEDIUM"

    else:
        aeb_risk = "LOW"

    return {
        "aeb_result": aeb_result,
        "aeb_risk": aeb_risk,
        "speed_mps": round(velocity, 2),
        "total_delay": round(total_delay, 2),
        "delay_distance": round(delay_distance, 2),
        "effective_deceleration": round(
            effective_deceleration,
            2
        ),
        "braking_distance": round(
            braking_distance,
            2
        ),
        "stopping_distance": round(
            stopping_distance,
            2
        ),
        "safety_margin": round(
            safety_margin,
            2
        )
    }


# ============================================================
# Driver risk
# ============================================================

def calculate_driver_risk(driver_state):

    driver_state = driver_state.upper()

    if driver_state == "ALERT":

        return {
            "risk": "LOW",
            "factors": []
        }

    if driver_state == "EYES CLOSING":

        return {
            "risk": "MEDIUM",
            "factors": [
                "Eyes are beginning to close"
            ]
        }

    if driver_state == "DROWSY":

        return {
            "risk": "HIGH",
            "factors": [
                "Driver appears drowsy",
                "Reduced driver alertness"
            ]
        }

    if driver_state == "MICROSLEEP":

        return {
            "risk": "CRITICAL",
            "factors": [
                "Possible microsleep detected",
                "Driver may temporarily lose visual awareness"
            ]
        }

    return {
        "risk": "MEDIUM",
        "factors": [
            "Driver state is unknown"
        ]
    }


# ============================================================
# Safety Fusion
# ============================================================

def fuse_safety_risk(
    driver_state,
    speed,
    object_distance,
    visibility,
    weather,
    sensor_delay,
    road_condition
):

    # ---------------------------------------------
    # Calculate individual risks
    # ---------------------------------------------

    driver_analysis = calculate_driver_risk(
        driver_state
    )

    aeb_analysis = calculate_aeb_risk(
        speed,
        object_distance,
        visibility,
        weather,
        sensor_delay,
        road_condition
    )


    # ---------------------------------------------
    # Collect risk factors
    # ---------------------------------------------

    risk_factors = []

    risk_factors.extend(
        driver_analysis["factors"]
    )


    # AEB-related factors
    if speed >= 100:

        risk_factors.append(
            "High vehicle speed"
        )

    elif speed >= 80:

        risk_factors.append(
            "Elevated vehicle speed"
        )


    if object_distance <= 10:

        risk_factors.append(
            "Very short object distance"
        )

    elif object_distance <= 20:

        risk_factors.append(
            "Limited object distance"
        )


    if visibility == "Poor":

        risk_factors.append(
            "Poor visibility"
        )

    elif visibility == "Moderate":

        risk_factors.append(
            "Moderate visibility"
        )


    if weather == "Rain":

        risk_factors.append(
            "Rain conditions"
        )

    elif weather == "Fog":

        risk_factors.append(
            "Fog conditions"
        )


    if road_condition == "Wet":

        risk_factors.append(
            "Wet road surface"
        )

    elif road_condition == "Slippery":

        risk_factors.append(
            "Slippery road surface"
        )


    if sensor_delay >= 0.15:

        risk_factors.append(
            "High sensor delay"
        )

    elif sensor_delay > 0:

        risk_factors.append(
            "Sensor delay present"
        )


    if aeb_analysis["aeb_result"] == "FAIL":

        risk_factors.append(
            "AEB stopping distance exceeds available distance"
        )


    # ---------------------------------------------
    # Combined risk
    # ---------------------------------------------

    risk_levels = {
        "LOW": 1,
        "MEDIUM": 2,
        "HIGH": 3,
        "CRITICAL": 4
    }

    driver_score = risk_levels[
        driver_analysis["risk"]
    ]

    aeb_score = risk_levels[
        aeb_analysis["aeb_risk"]
    ]


    # The fusion score gives additional importance
    # to dangerous combinations of driver + AEB risk.
    fusion_score = (
        driver_score
        + aeb_score
    )


    # ------------------------------------------------
    # Combined risk classification
    # ------------------------------------------------

    if (
        driver_analysis["risk"] == "CRITICAL"
        or aeb_analysis["aeb_risk"] == "CRITICAL"
        or fusion_score >= 7
    ):

        combined_risk = "CRITICAL"

    elif (
        driver_analysis["risk"] == "HIGH"
        and aeb_analysis["aeb_risk"] in ["HIGH", "CRITICAL"]
    ):

        combined_risk = "CRITICAL"

    elif (
        driver_analysis["risk"] == "HIGH"
        or aeb_analysis["aeb_risk"] == "HIGH"
    ):

        combined_risk = "HIGH"

    elif (
        driver_analysis["risk"] == "MEDIUM"
        or aeb_analysis["aeb_risk"] == "MEDIUM"
    ):

        combined_risk = "MEDIUM"

    else:

        combined_risk = "LOW"


    # ---------------------------------------------
    # Recommendation
    # ---------------------------------------------

    if combined_risk == "CRITICAL":

        recommendation = (
            "Prioritize this combined driver-and-AEB "
            "scenario for validation."
        )

    elif combined_risk == "HIGH":

        recommendation = (
            "Perform additional validation for this "
            "scenario before relying on the result."
        )

    elif combined_risk == "MEDIUM":

        recommendation = (
            "Consider this scenario for extended "
            "validation coverage."
        )

    else:

        recommendation = (
            "Scenario currently presents relatively "
            "low combined risk."
        )


    # ---------------------------------------------
    # Conclusion
    # ---------------------------------------------

    conclusion = (
        f"Driver risk: {driver_analysis['risk']}. "
        f"AEB risk: {aeb_analysis['aeb_risk']}. "
        f"Combined system risk: {combined_risk}."
    )


    # ---------------------------------------------
    # Final result
    # ---------------------------------------------

    return {

        "driver_state": driver_state,

        "driver_risk": driver_analysis["risk"],

        "aeb_result": aeb_analysis["aeb_result"],

        "aeb_risk": aeb_analysis["aeb_risk"],

        "combined_risk": combined_risk,

        "fusion_score": fusion_score,

        "risk_factors": risk_factors,

        "scenario": {
            "speed": speed,
            "object_distance": object_distance,
            "visibility": visibility,
            "weather": weather,
            "sensor_delay": sensor_delay,
            "road_condition": road_condition
        },

        "aeb_analysis": aeb_analysis,

        "recommendation": recommendation,

        "conclusion": conclusion
    }


# ============================================================
# Standalone test
# ============================================================

if __name__ == "__main__":

    result = fuse_safety_risk(
        driver_state="DROWSY",
        speed=100,
        object_distance=10,
        visibility="Poor",
        weather="Rain",
        sensor_delay=0.15,
        road_condition="Wet"
    )

    print()
    print("==============================================")
    print(" GhostTest AI - Safety Fusion Test")
    print("==============================================")

    print(
        f"Driver State : {result['driver_state']}"
    )

    print(
        f"Driver Risk  : {result['driver_risk']}"
    )

    print(
        f"AEB Result   : {result['aeb_result']}"
    )

    print(
        f"AEB Risk     : {result['aeb_risk']}"
    )

    print(
        f"System Risk  : {result['combined_risk']}"
    )

    print(
        f"Fusion Score : {result['fusion_score']}"
    )

    print()
    print("Risk Factors:")

    for factor in result["risk_factors"]:

        print(f" - {factor}")

    print()
    print(
        f"Stopping Distance : "
        f"{result['aeb_analysis']['stopping_distance']} m"
    )

    print(
        f"Safety Margin     : "
        f"{result['aeb_analysis']['safety_margin']} m"
    )

    print()
    print(
        f"Recommendation: "
        f"{result['recommendation']}"
    )

    print()
    print(
        f"Conclusion: "
        f"{result['conclusion']}"
    )

    print()