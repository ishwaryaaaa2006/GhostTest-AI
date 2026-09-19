from itertools import product


# Possible values for each scenario variable
speeds = [40, 60, 80, 100, 120]

object_distances = [5, 10, 15, 20, 30]

visibilities = ["Good", "Moderate", "Poor"]

weather_conditions = ["Clear", "Rain", "Fog"]

sensor_delays = [0, 0.05, 0.1, 0.15, 0.25]

road_conditions = ["Dry", "Wet", "Slippery"]


# Generate every possible combination
scenarios = product(
    speeds,
    object_distances,
    visibilities,
    weather_conditions,
    sensor_delays,
    road_conditions
)


# Convert combinations into dictionaries
scenario_list = []

for scenario in scenarios:

    speed, distance, visibility, weather, sensor_delay, road = scenario

    scenario_list.append({
        "speed": speed,
        "object_distance": distance,
        "visibility": visibility,
        "weather": weather,
        "sensor_delay": sensor_delay,
        "road_condition": road
    })


print("Total scenarios:", len(scenario_list))

print("\nFirst 5 scenarios:")

for scenario in scenario_list[:5]:
    print(scenario)