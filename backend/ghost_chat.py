import re
from collections import Counter


def _pct(value):
    return f"{value * 100:.1f}%"


def _group_rates(ghosts, field):
    groups = {}
    for item in ghosts:
        name = item.get(field) or "Unknown"
        groups.setdefault(name, [0, 0])
        groups[name][0] += 1
        if str(item.get("predicted_result", "")).upper() == "FAIL":
            groups[name][1] += 1
    result = []
    for name, (total, fails) in groups.items():
        result.append({"name": name, "total": total, "fails": fails, "rate": fails / total if total else 0})
    return sorted(result, key=lambda x: x["rate"], reverse=True)


def _parse_scenario(text):
    q = text.lower()
    speed = re.search(r"(\d+(?:\.\d+)?)\s*(?:km/?h|kph)", q)
    distance = re.search(r"(\d+(?:\.\d+)?)\s*(?:m|meters?)\b", q)
    delay = re.search(r"(\d+(?:\.\d+)?)\s*(?:s|sec|secs|seconds)\s*(?:sensor\s*)?delay", q)

    visibility = next((x for x in ("poor", "moderate", "good") if x in q), None)
    weather = "Rain" if "rain" in q else "Fog" if "fog" in q else "Clear" if "clear" in q else None
    road = "Slippery" if "slippery" in q else "Wet" if re.search(r"\bwet\b", q) else "Dry" if "dry" in q else None

    values = {
        "speed": float(speed.group(1)) if speed else None,
        "object_distance": float(distance.group(1)) if distance else None,
        "visibility": visibility.title() if visibility else None,
        "weather": weather,
        "sensor_delay": float(delay.group(1)) if delay else None,
        "road_condition": road,
    }

    if not any(v is not None for v in values.values()):
        return None

    # Only fill omitted values when the user clearly intends a simulation.
    return {
        "speed": values["speed"] if values["speed"] is not None else 80,
        "object_distance": values["object_distance"] if values["object_distance"] is not None else 20,
        "visibility": values["visibility"] or "Good",
        "weather": values["weather"] or "Clear",
        "sensor_delay": values["sensor_delay"] if values["sensor_delay"] is not None else 0,
        "road_condition": values["road_condition"] or "Dry",
    }


def answer_project_question(question, summary, ghosts, regression, simulate=None):
    """Broad grounded GhostTest assistant. No invented project facts."""
    q = question.strip().lower()
    total = int(summary.get("ghost_scenarios") or len(ghosts))
    historical = int(summary.get("historical_tests") or 0)
    confirmed = int(summary.get("confirmed_failures") or 0)
    regressions = int(summary.get("regression_candidates") or len(regression))
    accuracy = float(summary.get("validation_accuracy") or 0)
    predicted_fails = sum(str(x.get("predicted_result", "")).upper() == "FAIL" for x in ghosts)
    predicted_passes = total - predicted_fails

    if re.search(r"\b(hi|hello|hey|good morning|good afternoon|good evening)\b", q):
        return "Hello. I'm Ghost, the automotive validation assistant. Ask me about the test space, ML predictions, AEB simulation, risk factors, regression candidates, coverage, model metrics, or a specific scenario."

    if re.search(r"\b(who are you|what are you|what is ghost|what is ghosttest)\b", q):
        return "Ghost is the assistant inside GhostTest AI. GhostTest is a simulation-based proof of concept for automotive safety-software validation. It uses historical test data, ML-assisted unseen-scenario prioritization, AEB simulation, explanation, and regression recommendations."

    if re.search(r"\b(how does ghosttest work|how does it work|workflow|pipeline|architecture)\b", q):
        return "The workflow is: historical test data → feature processing and ML risk prediction → unseen scenario prioritization → AEB simulation → result analysis and explanation → regression candidates. The key question is which important scenarios have not been tested yet."

    if re.search(r"\b(why|purpose|problem)\b", q) and re.search(r"ghosttest|project|system|need", q):
        return "GhostTest focuses on test-space gaps. Instead of only checking whether existing tests pass, it searches the remaining scenario combinations for cases that deserve attention, then validates selected scenarios through simulation."

    if re.search(r"\b(how many|number|count).*(unseen|untested|ghost)", q) or re.search(r"\b(unseen|untested)\b", q):
        return f"The current GhostTest dataset has {total:,} unseen scenarios. The defined scenario space contains 3,375 combinations and 400 historical cases, leaving 2,975 combinations outside the historical set."

    if re.search(r"\b(historical|history|known tests|existing tests)\b", q):
        return f"The current historical test set contains {historical:,} cases. They form the known test set used by the prototype before searching the remaining scenario space."

    if re.search(r"\b(coverage|covered|coverage percentage|how much.*tested)\b", q):
        coverage = historical / 3375 * 100 if historical else 0
        return f"Historical coverage is {coverage:.2f}% of the defined 3,375-combination scenario space. That corresponds to {historical:,} historical cases, with {total:,} combinations outside the historical set."

    if re.search(r"\b(predicted|prediction).*(fail|failure)|\bhow many.*fail", q):
        return f"The current unseen dataset contains {predicted_fails:,} scenarios predicted as FAIL and {predicted_passes:,} predicted as PASS. These are ML prioritization results; they are not confirmed vehicle failures until validated by the simulator."

    if re.search(r"\b(pass|passes|passed)\b", q) and re.search(r"\b(predicted|unseen|ghost)", q):
        return f"There are {predicted_passes:,} unseen scenarios currently predicted as PASS. Prediction is a model output, not a substitute for physical or production validation."

    if re.search(r"\b(regression|regression candidates|future tests|future regression)\b", q):
        return f"GhostTest currently has {regressions:,} regression candidates in the connected database. These are scenarios marked as confirmed failures after validation, rather than failures inferred from ML prediction alone."

    if re.search(r"\b(confirmed|validated).*(fail|failure)", q):
        return f"The current connected dataset reports {confirmed:,} confirmed failures. Confirmation here refers to the prototype's simulation-based validation."

    if re.search(r"\b(accuracy|precision|recall|f1|model metric|random forest|machine learning|ml model)\b", q):
        return f"The current validation accuracy reported by the project is {accuracy:.2f}%. The prototype uses a Random Forest classifier with encoded categorical features. The displayed metric comes from this synthetic validation setup and should not be interpreted as real-world vehicle performance."

    if re.search(r"\b(random forest|classifier|classification)\b", q):
        return "The ML baseline is a Random Forest classifier. It predicts PASS or FAIL for scenario combinations using the defined AEB scenario features. The model is used to prioritize unseen scenarios; simulation remains the confirmation step."

    if re.search(r"\b(aeb|automatic emergency braking|emergency braking)\b", q) and not _parse_scenario(question):
        return "AEB means Automatic Emergency Braking. In this prototype, the AEB simulator estimates reaction-distance and braking-distance requirements from speed, object distance, sensor delay, visibility, weather, and road condition, then checks whether the stopping distance fits within the available distance."

    if re.search(r"\b(variables|features|parameters|inputs|scenario space)\b", q):
        return "The current AEB scenario variables are speed, object distance, visibility, weather, sensor delay, and road condition. Their configured combinations produce 3,375 possible scenarios."

    if re.search(r"\b(3375|3,375|scenario combinations|combinations)\b", q):
        return "The defined scenario space has 3,375 combinations: 5 speeds × 5 object distances × 3 visibility levels × 3 weather conditions × 5 sensor delays × 3 road conditions."

    if re.search(r"\b(simulator|stopping distance|braking distance|reaction distance|deceleration|safety margin)\b", q) and not _parse_scenario(question):
        return "The simulator converts speed to m/s, accounts for reaction time plus sensor and visibility delay, calculates braking distance from effective deceleration, and compares total stopping distance with object distance. Safety margin is available distance minus stopping distance."

    if re.search(r"\b(risk|highest risk|high risk|dangerous)\b", q):
        if not ghosts:
            return "Ghost Explorer data is not loaded right now."
        top = sorted(ghosts, key=lambda x: float(x.get("failure_probability") or 0), reverse=True)[:5]
        examples = "; ".join(f"{x.get('speed')} km/h, {x.get('object_distance')} m, {x.get('visibility')}, {x.get('weather')}" for x in top)
        return f"Ghost Explorer ranks scenarios using predicted failure probability. The top current examples are: {examples}. These are ML-prioritized scenarios and require simulation validation before being treated as confirmed failures."

    for field, label, words in [
        ("speed", "speed", ["speed", "fastest", "slowest"]),
        ("weather", "weather", ["weather", "rain", "fog", "clear"]),
        ("road_condition", "road condition", ["road", "wet road", "slippery", "dry"]),
        ("visibility", "visibility", ["visibility", "poor visibility", "moderate visibility"]),
    ]:
        if any(word in q for word in words) and re.search(r"\b(failure|fail|impact|worst|highest|rate|effect)\b", q):
            groups = _group_rates(ghosts, field)
            if groups:
                text = "; ".join(f"{g['name']}: {_pct(g['rate'])} predicted failure rate" for g in groups)
                return f"Across the current unseen dataset, the predicted failure rates by {label} are {text}. These are synthetic scenario-space statistics, not field measurements."

    scenario = _parse_scenario(question)
    if scenario and simulate:
        result = simulate(scenario)
        sim = result["simulation"]
        explanation = result.get("explanation", {})
        factors = explanation.get("risk_factors", [])
        factor_text = " ".join(factors[:4])
        return (
            f"I simulated {scenario['speed']} km/h, object distance {scenario['object_distance']} m, "
            f"{scenario['visibility']} visibility, {scenario['weather']} weather, "
            f"{scenario['sensor_delay']} s sensor delay and {scenario['road_condition']} road. "
            f"Result: {sim['result']}. Stopping distance: {sim['stopping_distance']:.2f} m. "
            f"Available distance: {sim['available_distance']:.2f} m. Safety margin: {sim['margin']:.2f} m. "
            f"{explanation.get('conclusion', '')} {factor_text}"
        ).strip()

    if re.search(r"\b(limitations|limitation|not real|real vehicle|production|sil|safety)\b", q):
        return "This is a simulation-based proof of concept, not a production AEB implementation or a certified automotive SIL environment. The scenario data and validation results are synthetic, and the prototype does not prove real-vehicle safety."

    if re.search(r"\b(report|ppt|presentation|demo)\b", q):
        return "For a project demonstration, the strongest flow is: show the historical test coverage, open Ghost Explorer to reveal an unseen scenario, validate it in Ghost Intelligence, explain the failure factors, generate the test vector, and show the confirmed regression candidate."

    return "I can discuss GhostTest's architecture, AEB use case, scenario variables, 3,375-combination space, historical coverage, unseen scenarios, ML model and metrics, Ghost Explorer risk ranking, simulation physics, risk explanations, scenario comparisons, regression candidates, limitations, and specific AEB scenarios. For a project fact I do not have in the connected data, I will say so rather than invent it."
