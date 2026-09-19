def simulate_aeb(
    speed,
    object_distance,
    sensor_delay,
    visibility,
    weather,
    road_condition
):
    velocity = speed * 1000 / 3600

    reaction_time = 0.5

    visibility_delay = {
        "Good": 0,
        "Moderate": 0.1,
        "Poor": 0.2
    }

    extra_visibility_delay = visibility_delay[visibility]

    total_delay = (
        reaction_time
        + sensor_delay
        + extra_visibility_delay
    )

    delay_distance = velocity * total_delay

    base_deceleration = 8

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

    deceleration = (
        base_deceleration
        * weather_modifier[weather]
        * road_modifier[road_condition]
    )

    braking_distance = (
        velocity ** 2
    ) / (2 * deceleration)

    stopping_distance = (
        delay_distance
        + braking_distance
    )

    margin = (
        object_distance
        - stopping_distance
    )

    if stopping_distance <= object_distance:
        result = "PASS"
    else:
        result = "FAIL"

    return {
        "result": result,
        "speed_mps": velocity,
        "total_delay": total_delay,
        "delay_distance": delay_distance,
        "effective_deceleration": deceleration,
        "braking_distance": braking_distance,
        "stopping_distance": stopping_distance,
        "available_distance": object_distance,
        "margin": margin
    }