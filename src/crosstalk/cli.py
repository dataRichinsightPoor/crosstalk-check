"""Command-line entry points. No network access or private data are required."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from .model import Parameters, Protocol, simulate


def load_config(path: Path) -> tuple[Parameters, Protocol, dict]:
    data = json.loads(path.read_text())
    unknown = set(data) - {"description", "parameters", "protocol", "simulation"}
    if unknown:
        raise ValueError(f"unknown config fields: {sorted(unknown)}")
    simulation = data.get("simulation", {})
    allowed = {"duration", "dt", "rtol", "atol", "max_step"}
    if set(simulation) - allowed:
        raise ValueError("unknown simulation settings")
    return (
        Parameters.from_dict(data.get("parameters", {})),
        Protocol.from_dict(data.get("protocol", {})),
        simulation,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    run = sub.add_parser("run", help="Run one JSON-defined stimulation protocol.")
    run.add_argument("--config", type=Path, required=True)
    run.add_argument("--output", type=Path, default=Path("results/custom"))
    demo = sub.add_parser("demo", help="Reproduce the synthetic experiment gallery.")
    demo.add_argument("--output", type=Path, default=Path("results/demo"))
    demo.add_argument("--sweep-size", type=int, default=7)
    args = parser.parse_args()
    from .report import generate_demo, plot_single, save_result
    if args.command == "demo":
        generate_demo(args.output, args.sweep_size)
    else:
        p, protocol, settings = load_config(args.config)
        result = simulate(p, protocol, **settings)
        args.output.mkdir(parents=True, exist_ok=True)
        save_result(result, args.output, "simulation")
        plot_single(result, args.output / "simulation.png")
        print(json.dumps(result.summary(), indent=2))
    print(f"Outputs: {args.output.resolve()}")
    print("Synthetic forward simulation. Not fitted or biologically validated.")


if __name__ == "__main__":
    main()
