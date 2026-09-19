import sys
import os
import csv

# Allow Python to find simulator.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simulator import simulate_aeb
from scenario_generator import scenario_list


# Store simulation results
results = []


print("\nGhostTest AI - AEB Simulation Engine")
print("=" * 45)

print(f"Total scenarios generated: {len(scenario_list)}")
print("Running simulations...\n")


# Run every generated scenario
for scenario in scenario_list:

    simulation = simulate_aeb(
        speed=scenario["speed"],
        object_distance=scenario["object_distance"],
        sensor_delay=scenario["sensor_delay"],
        visibility=scenario["visibility"],
        weather=scenario["weather"],
        road_condition=scenario["road_condition"]
    )

    results.append({
        **scenario,
        "result": simulation["result"],
        "stopping_distance": simulation["stopping_distance"],
        "margin": simulation["margin"],
        "effective_deceleration": simulation["effective_deceleration"]
    })


# Count results
pass_count = sum(1 for r in results if r["result"] == "PASS")
fail_count = sum(1 for r in results if r["result"] == "FAIL")


# Save results
output_file = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "simulation_results.csv"
)


with open(output_file, "w", newline="") as file:

    writer = csv.DictWriter(
        file,
        fieldnames=results[0].keys()
    )

    writer.writeheader()
    writer.writerows(results)


print("Simulation completed!")
print("-" * 45)
print(f"Total scenarios : {len(results)}")
print(f"PASS scenarios  : {pass_count}")
print(f"FAIL scenarios  : {fail_count}")
print(f"\nDataset saved to:")
print(output_file)
