"""Reproducible CSV/JSON outputs and publication-readable synthetic figures."""

from __future__ import annotations

from dataclasses import replace
import json
from pathlib import Path
import platform

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import scipy

from . import __version__
from .experiments import contrast_summary, factorial, gate_sweep, interaction, pulse
from .model import Parameters, Protocol, Result, Segment, Signal, simulate

COLORS = {"A": "#387796", "B": "#b58332", "AB": "#386c5b", "gate": "#b95846"}
plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 10, "axes.spines.top": False,
    "axes.spines.right": False, "figure.facecolor": "#fbfaf7",
    "axes.facecolor": "#fbfaf7", "savefig.facecolor": "#fbfaf7",
    "axes.labelcolor": "#252d32", "text.color": "#252d32",
})


def save_result(result: Result, directory: Path, name: str) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    columns, matrix = result.matrix()
    np.savetxt(directory / f"{name}.csv", matrix, delimiter=",", header=",".join(columns), comments="", fmt="%.9g")
    (directory / f"{name}.json").write_text(json.dumps(result.metadata(), indent=2) + "\n")


def plot_single(result: Result, path: Path) -> None:
    fig, axes = plt.subplots(3, 1, figsize=(11, 9), sharex=True, constrained_layout=True)
    for name, label, color in (
        ("receptor_a", "Receptor A", COLORS["A"]), ("receptor_b", "Receptor B", COLORS["B"]),
    ):
        axes[0].plot(result.t, result[name], label=label, color=color)
    for name, label, color in (
        ("effector_free", "Free active effector", COLORS["AB"]),
        ("reporter", "Reversible reporter", COLORS["gate"]),
        ("recorder", "Irreversible recorder", "#6e6a64"),
    ):
        axes[1].plot(result.t, result[name], label=label, color=color)
    axes[2].plot(result.t, result["switch_open"], label="Switch-open fraction", color=COLORS["AB"])
    axes[2].plot(result.t, [result.protocol.switch(t) for t in result.t], "--", label="Command", color="#6e6a64")
    for ax in axes:
        ax.set_ylim(-.03, 1.03)
        ax.set_ylabel("Normalized state")
        ax.legend(loc="upper right", frameon=False, fontsize=9)
    axes[-1].set_xlabel("Illustrative model time (min)")
    fig.suptitle("Crosstalk Check | Synthetic stimulation experiment", fontsize=15, fontweight="bold")
    fig.savefig(path, dpi=160)
    plt.close(fig)


def generate_demo(directory: Path, sweep_size: int = 7) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    data = directory / "data"
    p = Parameters()
    opened, closed = factorial(p, 1), factorial(p, 0)
    hub_open, hub_closed = factorial(replace(p, gate_mode="hub"), 1), factorial(replace(p, gate_mode="hub"), 0)
    for prefix, results in (("edge_open", opened), ("edge_closed", closed), ("hub_open", hub_open), ("hub_closed", hub_closed)):
        for condition, result in results.items():
            save_result(result, data, f"{prefix}_{condition}")
    summaries = {
        "edge": contrast_summary(opened, closed),
        "hub": contrast_summary(hub_open, hub_closed),
    }
    fig, axes = plt.subplots(2, 2, figsize=(12, 8), constrained_layout=True, sharex=True)
    for j, (title, ref, gated) in enumerate((
        ("Connection-selective gate", opened, closed),
        ("Broad effector gate", hub_open, hub_closed),
    )):
        ax = axes[0, j]
        for condition in ("A", "B", "AB"):
            ax.plot(ref[condition].t, ref[condition]["effector_free"], color=COLORS[condition], label=f"{condition}, open")
        ax.plot(gated["AB"].t, gated["AB"]["effector_free"], "--", color=COLORS["gate"], label="AB, gated")
        ax.set_title(title, loc="left", fontweight="bold")
        ax.set_ylabel("Free active effector")
        ax.legend(frameon=False, fontsize=8)
        axes[1, j].plot(ref["AB"].t, interaction(ref), color=COLORS["AB"], label="Open interaction")
        axes[1, j].plot(gated["AB"].t, interaction(gated), color=COLORS["gate"], label="Gated interaction")
        axes[1, j].axhline(0, color="#b8b3ab", linewidth=.6)
        axes[1, j].set_ylabel("AB − A − B + baseline")
        axes[1, j].set_xlabel("Illustrative model time (min)")
        axes[1, j].legend(frameon=False, fontsize=8)
    fig.suptitle("Removing an interaction is not the same as suppressing the output\nSynthetic parameters; not experimental data", fontsize=14, fontweight="bold")
    fig.savefig(directory / "connection-versus-hub.png", dpi=160)
    plt.close(fig)
    protocol = Protocol(pulse(2, 26), pulse(2, 26), Signal(1, (Segment(10, 20, 0),)))
    temporal = simulate(p, protocol)
    save_result(temporal, data, "temporal_gate")
    plot_single(temporal, directory / "temporal-gate.png")

    fig, axes = plt.subplots(1, 2, figsize=(12, 4.6), constrained_layout=True)
    for sensor, color in ((0, COLORS["AB"]), (.5, COLORS["A"]), (2, COLORS["gate"])):
        result = simulate(replace(p, sensor_total=sensor), Protocol(pulse(2, 12), pulse(2, 12)))
        save_result(result, data, f"sensor_{sensor:g}")
        axes[0].plot(result.t, result["effector_free"], label=f"Sensor total = {sensor:g}", color=color)
    for tau, color in ((.2, COLORS["AB"]), (3, COLORS["A"]), (10, COLORS["gate"])):
        result = simulate(replace(p, reporter_tau=tau), Protocol(pulse(2, 12), pulse(2, 12)))
        save_result(result, data, f"reporter_tau_{tau:g}")
        axes[1].plot(result.t, result["reporter"], label=f"Reporter time constant = {tau:g} min", color=color)
    axes[0].set_title("A reader can change the free signal", loc="left")
    axes[1].set_title("A slow reader can mimic persistence", loc="left")
    for ax in axes:
        ax.set_xlabel("Illustrative model time (min)")
        ax.set_ylabel("Normalized response")
        ax.legend(frameon=False, fontsize=8)
    fig.suptitle("Measurement is part of the system | Synthetic examples", fontsize=14, fontweight="bold")
    fig.savefig(directory / "measurement-artifacts.png", dpi=160)
    plt.close(fig)

    leaks, closing, values = gate_sweep(p, sweep_size)
    rows = [[leak, tau, values[i, j]] for i, tau in enumerate(closing) for j, leak in enumerate(leaks)]
    np.savetxt(directory / "gate-sweep.csv", rows, delimiter=",",
               header="gate_leak,closing_tau_min,effector_auc_reduction_percent", comments="", fmt="%.9g")
    fig, ax = plt.subplots(figsize=(8, 5.5), constrained_layout=True)
    image = ax.imshow(values, origin="lower", aspect="auto", cmap="cividis")
    ax.set_xticks(range(len(leaks)), [f"{v:.2f}" for v in leaks])
    ax.set_yticks(range(len(closing)), [f"{v:.2f}" for v in closing])
    ax.set_xlabel("Residual gate leak")
    ax.set_ylabel("Closing time constant (min)")
    ax.set_title("Conditional gate-performance sweep\nSynthetic AUC reduction during minutes 10–20", loc="left", fontweight="bold")
    fig.colorbar(image, ax=ax, label="Free-effector AUC reduction (%)")
    fig.savefig(directory / "gate-sweep.png", dpi=160)
    plt.close(fig)
    manifest = {
        "publication": "Data-Rich, Insight-Poor · No. CCLXVII",
        "series": "99 Small Problems · Installment 08",
        "version": __version__, "python": platform.python_version(),
        "numpy": np.__version__, "scipy": scipy.__version__, "matplotlib": matplotlib.__version__,
        "parameters": temporal.metadata()["parameters"], "contrast_summaries": summaries,
        "sweep_size": sweep_size, "randomness": "None: deterministic forward simulation",
    }
    (directory / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    edge = summaries["edge"]
    hub = summaries["hub"]
    (directory / "RESULTS.md").write_text(
        "# Crosstalk Check: reproducible synthetic results\n\n"
        "Data-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08. These are model outputs, not experimental estimates.\n\n"
        "## Connection versus hub\n\n"
        f"- Edge gate, interaction-AUC change: {edge['effector_free_delta_interaction_auc']:.4f} model units·min.\n"
        f"- Edge gate, A-only AUC change: {edge['effector_free_A_auc_difference']:.4g}.\n"
        f"- Hub gate, A-only AUC change: {hub['effector_free_A_auc_difference']:.4f}.\n\n"
        "The selective-gate result is built into the stated topology and is a verification of the model, "
        "not biological evidence that such a selective reagent exists.\n\n"
        "## Readout interpretation\n\n"
        "The measurement-artifact figure compares free signal under sensor loading and apparent persistence "
        "under different reporter lags. The sweep is conditional sensitivity analysis, not uncertainty estimation.\n\n"
        "## Reproduction\n\n"
        "Run `crosstalk demo --output results/demo`. The manifest records software versions, all parameters, "
        "and contrast metrics; each trajectory has a CSV and JSON metadata file. No random seed is needed.\n"
    )
