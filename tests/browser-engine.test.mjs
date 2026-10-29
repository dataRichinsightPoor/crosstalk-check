import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {simulate, derivative, contrast, runPair, auc, series} from "../web/model.mjs";
import {buildPlate,plateCSV} from "../web/assay.mjs";

const fixtures = JSON.parse(fs.readFileSync(new URL("./fixtures/reference.json", import.meta.url)));
const defaults = JSON.parse(fs.readFileSync(new URL("../web/defaults.json", import.meta.url)));
for (const fixture of fixtures) {
  test(`Browser RK4 matches Python DOP853: ${fixture.id}`, () => {
    const actual = simulate(fixture.parameters, fixture.protocol, fixture.duration, fixture.dt);
    let error = 0;
    actual.values.forEach((row, i) => row.forEach((v, j) => error = Math.max(error, Math.abs(v - fixture.values[i][j]))));
    assert.ok(error < 2e-5, `maximum absolute error ${error}`);
  });
}
test("invalid browser input is rejected rather than silently clipped", () => {
  assert.throws(() => simulate({...defaults, switch_tau_close: 0}, fixtures[0].protocol));
  assert.throws(() => simulate(defaults, {...fixtures[0].protocol, a: {baseline: 2}}));
  assert.throws(() => simulate(defaults, fixtures[0].protocol, -1));
});
test("browser edge gating does not alter an isolated A pathway", () => {
  const pair = runPair(defaults, fixtures[0].protocol, 16, .25);
  const diff = series(pair.reference.A, "effector_free").map((v, i) => Math.abs(v - pair.gated.A.values[i][5]));
  assert.ok(Math.max(...diff) < 1e-12);
  assert.ok(auc(pair.reference.AB.t, contrast(pair.reference, "effector_free")) >
    auc(pair.gated.AB.t, contrast(pair.gated, "effector_free")));
});
test("all derivatives are finite for a valid baseline state", () => {
  assert.ok(derivative([0,0,0,0,1,0,0,0,0,0,0], defaults, 0, 0, 1).every(Number.isFinite));
});
test("plate layout has unique assignments, reserved edges, and reproducible randomization",()=>{
  const p=buildPlate(),q=buildPlate();
  assert.deepEqual(p,q);
  assert.equal(p.wells.length,96);
  assert.equal(p.wells.filter(w=>w.id).length,36);
  assert.equal(new Set(p.wells.map(w=>w.well)).size,96);
  assert.ok(p.wells.filter(w=>w.edge).every(w=>!w.id));
  for(const c of p.conditions)assert.equal(p.wells.filter(w=>w.id===c.id).length,3);
  assert.ok(plateCSV(p,"example",{a:{},b:{},switch:{}}).includes("not simulated"));
});
test("plate capacity and invalid replicate requests are rejected",()=>{
  assert.throws(()=>buildPlate({replicates:6,excludeEdge:true,controls:true}));
  assert.throws(()=>buildPlate({replicates:1.5}));
  assert.notDeepEqual(buildPlate({seed:1}).wells,buildPlate({seed:2}).wells);
});
