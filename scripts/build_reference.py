"""Generate shared defaults and independent numerical fixtures for JS parity tests."""
import json
from dataclasses import asdict
from pathlib import Path

from crosstalk.model import Parameters, Protocol, Segment, Signal, simulate

ROOT = Path(__file__).resolve().parents[1]


def main():
    (ROOT / "web/defaults.json").write_text(json.dumps(asdict(Parameters()), indent=2) + "\n")
    cases = json.loads((ROOT / "web/cases.json").read_text())
    fixtures = []
    for case in cases:
        p = Parameters.from_dict(case["parameters"])
        a = Signal(segments=(Segment(2, 8, 1),))
        b = Signal(segments=(Segment(5, 12, 0.8),))
        gate = Signal(1, (Segment(6, 10, 0),))
        protocol = Protocol(a, b, gate)
        result = simulate(p, protocol, duration=16, dt=.25, rtol=1e-11, atol=1e-13)
        fixtures.append({
            "id": case["id"], "parameters": asdict(p), "protocol": asdict(protocol),
            "duration": 16, "dt": .25, "t": result.t.tolist(), "values": result.values.tolist(),
        })
    target = ROOT / "tests/fixtures"
    target.mkdir(exist_ok=True)
    (target / "reference.json").write_text(json.dumps(fixtures, separators=(",", ":")) + "\n")
    print(f"Generated shared defaults and {len(fixtures)} DOP853 reference fixtures.")


if __name__ == "__main__":
    main()
