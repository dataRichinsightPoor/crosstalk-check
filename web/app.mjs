import {STATES, simulate, runPair, series, contrast, auc, signalAt} from "./model.mjs";
import {buildPlate,plateCSV} from "./assay.mjs";
const $ = id => document.getElementById(id);
const colors = {A:"#387796",B:"#9b711e",reference:"#386c5b",gate:"#b4513c",neutral:"#6b7378"};
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let cases, defaults, selected, p, lastPair, lastProtocol, importedProtocol=null, duration=40, pending, latestRun=0, sweepToken=0,lastPlate=null;
const exportPrefix="drip-cclxvii-99problems-08-crosstalk";
const timingControls=["sequence","a-start","a-end","b-start","b-end","a-level","b-level","switch-command"];
const ranges = {
  leak:"gate_leak",opening:"switch_tau_open",closing:"switch_tau_close",lag:"reporter_tau",sensor:"sensor_total",
  cooperation:"cooperation",relay:"transactivation",feedback:"feedback_gain",priming:"priming_gain",inhibition:"memory_inhibition",
  "memory-on":"memory_on","memory-tau":"memory_tau","pool-basal":"pool_a_basal"
};

function setError(message) {
  $("error").hidden = !message;
  $("error").textContent = message ? `${message} Previous results, if visible, have not been updated.` : "";
}
function lockExports(locked) {
  for(const id of ["csv","svg","export-config","assay-brief","make-plate"])$(id).disabled=locked;
}
function renderLibrary() {
  const query = $("search").value.toLowerCase().trim(), family = $("family").value;
  const filtered = cases.filter(c => (family === "all" || c.family === family) &&
    [c.title,c.family,c.mechanism,c.question].join(" ").toLowerCase().includes(query));
  $("case-count").textContent = `${filtered.length} / ${cases.length}`;
  $("case-list").innerHTML = filtered.length ? filtered.map(c =>
    `<button class="case-button" data-case="${c.id}" aria-current="${c.id === selected?.id}" role="listitem">${escapeHTML(c.title)}<span>${escapeHTML(c.mechanism)}</span></button>`
  ).join("") : '<p class="empty-state">No systems match. Clear the search or change the family.</p>';
  $("case-list").querySelectorAll("button").forEach(button => button.addEventListener("click", () => selectCase(button.dataset.case)));
}
function labels() {
  $("case-title").textContent = selected.title;
  $("case-family").textContent = `${selected.family} / ${selected.kind}`;
  $("case-question").textContent = selected.question;
  $("input-a-label").textContent = selected.a;
  $("input-b-label").textContent = selected.b;
  $("mechanism-label").textContent = selected.mechanism;
  $("gate-label").textContent = ({edge:"Connection gate",allocation:"A-allocation gate",hub:"Whole-effector gate",none:"No functional gate"})[p.gate_mode];
  $("reset").textContent=selected.id==="imported"?"Return to examples":"Reset case";
}
function syncControls() {
  for (const [id,key] of Object.entries(ranges)) {
    const input = $(id);
    if (p[key] > Number(input.max)) input.max = p[key];
    if (p[key] < Number(input.min)) input.min = p[key];
    input.value = p[key];
    $(`${id}-value`).textContent = `${Number(p[key]).toFixed(2)}${["opening","closing","lag","memory-tau"].includes(id) ? " min" : ""}`;
  }
  $("gate-mode").value = p.gate_mode;
  $("shared-pool").checked = p.shared_pool;
  $("parameter-json").textContent = JSON.stringify(p,null,2);
}
function setSequence(mode) {
  const timings = mode === "A then B" ? [2,10,12,24] : mode === "B then A" ? [12,24,2,10] : [2,26,2,26];
  ["a-start","a-end","b-start","b-end"].forEach((id,i) => $(id).value = timings[i]);
  $("sequence").value = mode;
  for (const id of ["a-start","a-end"]) $(id).disabled = mode === "Pulsed A";
}
function selectCase(id) {
  sweepToken++;
  selected = cases.find(c=>c.id===id) || cases[0];
  p = {...defaults,...selected.parameters}; duration=40; importedProtocol=null;
  $("import-notice").hidden=true;timingControls.forEach(id=>$(id).disabled=false);
  $("a-level").value=1; $("b-level").value=1;
  $("switch-command").value="window";
  $("readout").value="effector_free";
  setSequence(selected.protocolMode || "Simultaneous");
  syncControls(); labels(); renderLibrary(); renderEvidence();
  $("model-status").textContent="Synthetic parameters · literature-informed topology · not a fitted receptor model";
  $("sweep-result").innerHTML='<p class="empty-state">Run the sweep for this model. Previous-case results are not retained.</p>';
  lastPlate=null;$("plate-result").innerHTML="";
  scheduleRun();
}
function getProtocol() {
  if (importedProtocol) return structuredClone(importedProtocol);
  const aLevel=Number($("a-level").value),bLevel=Number($("b-level").value);
  const startA=Number($("a-start").value),endA=Number($("a-end").value),startB=Number($("b-start").value),endB=Number($("b-end").value);
  if ([startA,endA,startB,endB].some(v=>!Number.isFinite(v)||v<0||v>duration)) throw Error(`Stimulation times must be between 0 and ${duration}.`);
  const a = $("sequence").value==="Pulsed A" ? {segments:[2,10,18].map(start=>({start,end:start+4,level:aLevel}))} :
    {segments:[{start:startA,end:endA,level:aLevel}]};
  const b = {segments:[{start:startB,end:endB,level:bLevel}]};
  const command=$("switch-command").value;
  const sw = command==="open" ? {baseline:1} : command==="closed" ? {baseline:0} :
    command==="window" ? {baseline:1,segments:[{start:10,end:20,level:0}]} :
    command==="open-window" ? {baseline:0,segments:[{start:10,end:20,level:1}]} :
    {baseline:0,segments:[2,10,18,26,34].filter(t=>t<duration).map(start=>({start,end:Math.min(start+4,duration),level:1}))};
  return {a,b,switch:sw};
}
function scheduleRun() {
  clearTimeout(pending);
  lockExports(true);
  $("run-status").textContent="Updating…";
  const token=++latestRun;
  pending=setTimeout(()=>{
    try {
      const protocol=getProtocol();
      const result=runPair(p,protocol,duration,.1);
      if(token!==latestRun) return;
      lastPair=result; lastProtocol=protocol;
      setError(""); renderResults();
      lockExports(false);
      $("run-status").textContent="8 conditions · numerical checks passed";
      $("parameter-json").textContent=JSON.stringify(p,null,2);
      labels();
      renderAssayGuidance();
    } catch(error) { setError(error.message); $("run-status").textContent="Input requires attention"; }
  },80);
}
function makeLegend(id,curves) {
  $(id).innerHTML=curves.map(c=>`<span><i style="border-color:${c.color}" class="${c.dashed?"dashed":""}"></i>${escapeHTML(c.label)}</span>`).join("");
}
function renderChart(id,t,curves,{signed=false,height=265}={}) {
  const element=$(id),width=Math.max(285,element.clientWidth || 600),left=45,right=14,top=12,bottom=37;
  const w=width-left-right,h=height-top-bottom;
  const values=curves.flatMap(c=>c.values);
  const ymin=signed?Math.min(0,...values)*1.12:0;
  const ymax=signed?Math.max(.02,...values)*1.12:1;
  const span=Math.max(.02,ymax-ymin),x=v=>left+w*v/t.at(-1),y=v=>top+h*(1-(v-ymin)/span);
  const ticks=Array.from({length:5},(_,i)=>ymin+span*i/4);
  const path=curve=>curve.values.map((v,i)=>`${i?"L":"M"}${x(t[i]).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  element.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHTML(curves.map(c=>c.label).join(", "))} versus illustrative model time">
    <rect width="${width}" height="${height}" fill="#faf9f6"/>
    ${ticks.map(v=>`<line x1="${left}" x2="${width-right}" y1="${y(v)}" y2="${y(v)}" stroke="#dcded8" stroke-width=".6"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end" fill="#55616a" font-size="12" font-family="sans-serif">${v.toFixed(2)}</text>`).join("")}
    ${Array.from({length:5},(_,i)=>t.at(-1)*i/4).map(v=>`<text x="${x(v)}" y="${height-18}" text-anchor="middle" fill="#55616a" font-size="12" font-family="sans-serif">${v.toFixed(0)}</text>`).join("")}
    <text x="${left+w/2}" y="${height-2}" text-anchor="middle" fill="#55616a" font-size="12" font-family="sans-serif">Illustrative model time (min)</text>
    ${curves.map(c=>`<path d="${path(c)}" fill="none" stroke="${c.color}" stroke-width="${c.dashed?2.2:1.9}" ${c.dashed?'stroke-dasharray="6 4"':""} stroke-linejoin="round"/>`).join("")}
    <line class="cursor" x1="${left}" x2="${left}" y1="${top}" y2="${height-bottom}" stroke="#899398" stroke-dasharray="3 3" opacity="0"/>
  </svg><div class="chart-tooltip">Hover or tap the plot to inspect a time point.</div>`;
  const svg=element.querySelector("svg"),cursor=element.querySelector(".cursor"),tooltip=element.querySelector(".chart-tooltip");
  svg.addEventListener("pointermove",event=>{
    const bounds=svg.getBoundingClientRect(),px=(event.clientX-bounds.left)*width/bounds.width;
    const index=Math.max(0,Math.min(t.length-1,Math.round((px-left)/w*(t.length-1))));
    cursor.setAttribute("x1",x(t[index]));cursor.setAttribute("x2",x(t[index]));cursor.setAttribute("opacity","1");
    tooltip.textContent=`${t[index].toFixed(1)} min · ${curves.map(c=>`${c.label}: ${c.values[index].toFixed(3)}`).join(" · ")}`;
  });
}
function drift(reference,gated,label,readout) {
  const r=auc(reference[label].t,series(reference[label],readout)),g=auc(gated[label].t,series(gated[label],readout));
  return Math.abs(r)<1e-9?"n/a":`${(100*(g-r)/Math.abs(r)).toFixed(1)}%`;
}
function renderResults() {
  if(!lastPair)return;
  const {reference:r,gated:g}=lastPair,t=r.AB.t,name=$("readout").value;
  const curves=[
    {label:"A only · reference",values:series(r.A,name),color:colors.A},
    {label:"B only · reference",values:series(r.B,name),color:colors.B},
    {label:"A+B · reference",values:series(r.AB,name),color:colors.reference},
    {label:"A+B · intervention",values:series(g.AB,name),color:colors.gate,dashed:true}
  ];
  makeLegend("main-legend",curves);renderChart("main-chart",t,curves);
  const ir=contrast(r,name),ig=contrast(g,name);
  const interactionCurves=[
    {label:"Reference interaction",values:ir,color:colors.reference},
    {label:"Intervention interaction",values:ig,color:colors.gate,dashed:true}
  ];
  makeLegend("interaction-legend",interactionCurves);
  renderChart("interaction-chart",t,interactionCurves,{signed:true,height:210});
  const delta=auc(t,ir.map((v,i)=>v-ig[i]));
  $("metrics").innerHTML=`<div><span>Δ interaction AUC</span><strong>${delta.toFixed(3)}</strong><small>model units·min</small></div><div><span>A-only AUC change</span><strong>${drift(r,g,"A",name)}</strong><small>intervention vs reference</small></div><div><span>B-only AUC change</span><strong>${drift(r,g,"B",name)}</strong><small>n/a if reference is zero</small></div>`;
  const pc=[["receptor_a","Receptor A",colors.A,false],["receptor_b","Receptor B",colors.B,false],["branch_a","Branch A",colors.A,true],["branch_b","Branch B",colors.B,true]].map(([n,label,color,dashed])=>({label,color,dashed,values:series(g.AB,n)}));
  makeLegend("proximal-legend",pc);renderChart("proximal-chart",t,pc,{height:210});
  const tc=[
    {label:"Input A",color:colors.A,values:t.map(v=>signalAt(lastProtocol.a,v))},
    {label:"Input B",color:colors.B,values:t.map(v=>signalAt(lastProtocol.b,v))},
    {label:"Switch-open fraction",color:colors.gate,values:series(g.AB,"switch_open"),dashed:true}
  ];
  makeLegend("timing-legend",tc);renderChart("timing-chart",t,tc,{height:210});
  $("result-table").innerHTML=`<thead><tr><th>Condition</th><th>AUC</th><th>Peak</th><th>Final</th></tr></thead><tbody>${[["Reference",r],["Intervention",g]].flatMap(([title,results])=>["none","A","B","AB"].map(c=>{
    const v=series(results[c],name);return `<tr><td>${title} · ${c}</td><td>${auc(t,v).toFixed(4)}</td><td>${Math.max(...v).toFixed(4)}</td><td>${v.at(-1).toFixed(4)}</td></tr>`;
  })).join("")}</tbody>`;
}
function renderEvidence() {
  const sections=[
    ["Published observation",selected.evidence],
    ["What this model represents",selected.mapping],
    ["What it does not represent",selected.omissions],
    ["Conformational-switch idea",selected.switch],
    ["Discriminating assay readout",selected.readout]
  ];
  $("view-evidence").innerHTML=`<h2>Keep the observation separate from the model</h2><p>Example type: ${escapeHTML(selected.kind)}. Parameter status: illustrative, not fitted.</p>${sections.map(([title,body],i)=>`<div class="evidence-block"><p class="label">${title}</p><p>${escapeHTML(body)}${i===0&&selected.source?` <a href="${selected.source}" target="_blank" rel="noopener">${escapeHTML(selected.sourceLabel)} ↗</a>`:""}</p></div>`).join("")}<h3>Use this example to design a discriminating measurement</h3><p>Do not select a mechanism because its curve looks plausible. Compare receptor-proximal states, branch-specific measurements, intervention selectivity, and measurement kinetics.</p>`;
}
function assaySections() {
  const comparison=lastPair?`Readout: ${$("readout").selectedOptions[0].textContent}. Current A-only AUC change: ${drift(lastPair.reference,lastPair.gated,"A",$("readout").value)}; B-only change: ${drift(lastPair.reference,lastPair.gated,"B",$("readout").value)}. These are simulated contrasts, not acceptance criteria.`:"Run a simulation first.";
  return [
    ["Question to resolve",selected.question],
    ["Discriminating readouts",selected.readout],
    ["Candidate perturbation",selected.switch],
    ["Current control behavior",comparison],
    ["Required matched conditions","Neither input, A only, B only, and A+B under both the reference and intervention schedules. Keep receptor abundance, reporter expression, stimulation, acquisition, and cell context matched where possible."],
    ["Sampling logic","Measure before the gate changes, during its response, and after reopening or washout. Resolve proximal activity and the downstream readout separately; do not carry these illustrative model-minute values directly into a biological protocol."],
    ["Orthogonal controls","Include input without switch, a binding-defective payload, reporter/actuator interference controls, and an independently established positive control. These technical controls are not simulated and must be specified experimentally."],
    ["Before a mechanistic claim","Verify that the intended connection changed, check each receptor's independent proximal response, establish whole-system recovery kinetics, and test a second perturbation. Set equivalence margins and biological replication using empirical assay variability."],
    ["Known model omissions",selected.omissions]
  ];
}
function renderAssayGuidance() {
  $("assay-guidance").innerHTML=assaySections().map(([title,body])=>`<div class="evidence-block"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(body)}</p></div>`).join("");
}
function generatePlate() {
  try{
    lastPlate=buildPlate({replicates:Number($("plate-replicates").value),seed:Number($("plate-seed").value),
      excludeEdge:$("plate-edges").checked,controls:$("plate-controls").checked});
    $("plate-error").hidden=true;
    $("plate-result").innerHTML=`<p class="small-text">${lastPlate.wells.filter(w=>w.id).length} assigned wells · seed ${lastPlate.seed} · ${lastPlate.replicates} technical replicates</p><div class="table-scroll"><table class="plate-grid" aria-label="Randomized 96-well draft layout"><thead><tr><th></th>${Array.from({length:12},(_,i)=>`<th>${i+1}</th>`).join("")}</tr></thead><tbody>${Array.from({length:8},(_,r)=>`<tr><th>${String.fromCharCode(65+r)}</th>${lastPlate.wells.filter(w=>w.r===r).map(w=>`<td data-mode="${w.mode||""}" class="${w.id?"":"reserved"}" title="${escapeHTML(w.well+": "+(w.label||w.status)+(w.replicate?" · replicate "+w.replicate:""))}">${w.id?`${w.id}<br>${w.replicate}`:"·"}</td>`).join("")}</tr>`).join("")}</tbody></table></div><div class="plate-legend">${lastPlate.conditions.map(c=>`<div><strong>${c.id}</strong>${escapeHTML(c.label)}</div>`).join("")}</div><button id="plate-csv" class="button secondary">Download plate CSV</button>`;
    $("plate-csv").onclick=()=>download(`${exportPrefix}-${selected.id}-plate.csv`,plateCSV(lastPlate,selected.title,getProtocol()),"text/csv");
  }catch(error){lastPlate=null;$("plate-error").hidden=false;$("plate-error").textContent=error.message;$("plate-result").innerHTML="";}
}
function exportAssayBrief() {
  const body=`# Crosstalk Check: draft bioassay development brief\n\nData-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08\n\n## ${selected.title}\n\nThis is a synthetic-model planning aid, not a validated protocol. All numerical parameters are illustrative.\n\n`+
    assaySections().map(([title,text])=>`## ${title}\n\n${text}\n\n`).join("")+
    (selected.source?`## Evidence boundary\n\n${selected.evidence} ([${selected.sourceLabel}](${selected.source})).\n\n`:"")+
    `## Plate status\n\n${lastPlate?`${lastPlate.wells.filter(w=>w.id).length} assigned wells, ${lastPlate.replicates} technical replicates, seed ${lastPlate.seed}. Export the separate plate CSV for assignments.`:"No plate layout has been generated."}\n\n`+
    `## Reproducible configuration\n\n\`\`\`json\n${JSON.stringify({description:"Data-Rich, Insight-Poor CCLXVII / 99 Small Problems 08. Synthetic model.",parameters:p,protocol:getProtocol(),simulation:{duration,dt:.1}},null,2)}\n\`\`\`\n`;
  download(`${exportPrefix}-${selected.id}-assay-brief.md`,body,"text/markdown");
}
function download(name,body,type) {
  const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement("a");
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportCSV() {
  if(!lastPair)return;
  const rows=["condition,intervention,time_min,"+STATES.join(",")+",input_a,input_b,switch_target"];
  for(const [mode,conditions] of Object.entries(lastPair))for(const [label,r] of Object.entries(conditions))
    r.t.forEach((t,i)=>rows.push([label,mode,t,...r.values[i],signalAt(r.protocol.a,t),signalAt(r.protocol.b,t),signalAt(r.protocol.switch,t)].join(",")));
  download(`${exportPrefix}-${selected.id}.csv`,rows.join("\n"),"text/csv");
}
function exportChart() {
  const source=$("main-chart").querySelector("svg").cloneNode(true);
  source.querySelector(".cursor").remove();
  const width=Number(source.getAttribute("width")),height=Number(source.getAttribute("height"));
  source.setAttribute("y","168");
  const lines=[
    ["Crosstalk Check",16,"#26323b"],
    ["Data-Rich, Insight-Poor · No. CCLXVII",12,"#55616a"],
    ["99 Small Problems · Installment 08",12,"#55616a"],
    [selected.title,14,"#26323b"]
  ];
  const legend=[["A only · reference",colors.A],["B only · reference",colors.B],["A+B · reference",colors.reference],["A+B · intervention (dashed)",colors.gate]];
  const text=lines.map(([s,size,color],i)=>`<text x="10" y="${20+i*20}" fill="${color}" font-size="${size}" font-family="sans-serif">${escapeHTML(s)}</text>`).join("")+
    legend.map(([s,color],i)=>`<text x="10" y="${102+i*17}" fill="${color}" font-size="12" font-family="sans-serif">${escapeHTML(s)}</text>`).join("");
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height+215}" viewBox="0 0 ${width} ${height+215}"><title>Crosstalk Check: synthetic simulation</title><rect width="100%" height="100%" fill="#faf9f6"/>${text}${source.outerHTML}<text x="10" y="${height+188}" fill="#55616a" font-size="12" font-family="sans-serif">${escapeHTML($("readout").selectedOptions[0].textContent)}</text><text x="10" y="${height+205}" fill="#55616a" font-size="12" font-family="sans-serif">Synthetic parameters; not fitted biological data.</text></svg>`;
  download(`${exportPrefix}-${selected.id}.svg`,svg,"image/svg+xml");
}
async function sweep() {
  const token=++sweepToken,caseId=selected.id,caseTitle=selected.title;
  const button=$("run-sweep");button.disabled=true;button.textContent="Computing 25 conditions…";
  const snapshot={...p};
  $("sweep-result").innerHTML='<p class="empty-state">Solving the matched stimulation protocols…</p>';
  await new Promise(resolve=>setTimeout(resolve,40));
  try {
    const leaks=[0,.125,.25,.375,.5],taus=[.05,.2,.8,3,8];
    const protocol={a:{segments:[{start:2,end:24,level:1}]},b:{segments:[{start:2,end:24,level:1}]},switch:{baseline:1}};
    const ref=simulate(snapshot,protocol,30,.1);
    const window=r=>{const indexes=r.t.map((t,i)=>t>=10&&t<=20?i:-1).filter(i=>i>=0);return auc(indexes.map(i=>r.t[i]),indexes.map(i=>r.values[i][5]));};
    const denominator=window(ref),values=[];
    for(const tau of taus) {
      const row=[];
      for(const leak of leaks) {
        const r=simulate({...snapshot,gate_leak:leak,switch_tau_close:tau},{...protocol,switch:{baseline:1,segments:[{start:10,end:20,level:0}]}},30,.1);
        row.push(denominator>1e-12?100*(1-window(r)/denominator):null);
      }
      values.push(row);
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    const color=v=>v===null?"#eee":`hsl(160 16% ${96-Math.min(100,Math.abs(v))*.22}%)`;
    if(token!==sweepToken){button.disabled=false;button.textContent="Run 25-condition sweep";return;}
    $("sweep-result").innerHTML=`<h3 class="sweep-title">${escapeHTML(caseTitle)}: free-effector AUC reduction (%)</h3><div class="table-scroll"><table class="sweep-table"><thead><tr><th>Closing τ<br>↓ min / leak →</th>${leaks.map(v=>`<th>${v.toFixed(3)}</th>`).join("")}</tr></thead><tbody>${values.map((row,i)=>`<tr><th>${taus[i].toFixed(2)}</th>${row.map(v=>`<td style="background:${color(v)}">${v===null?"n/a":v.toFixed(1)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="chart-caption">Snapshot of parameters at sweep start. Zero means this gate target did not change the chosen output; that can be the expected answer.</p><button id="sweep-csv" class="button secondary">Download sweep CSV</button>`;
    $("sweep-csv").onclick=()=>download(`${exportPrefix}-${caseId}-sweep.csv`,["closing_tau_min,gate_leak,auc_reduction_percent",...values.flatMap((row,i)=>row.map((v,j)=>[taus[i],leaks[j],v??""].join(",")))].join("\n"),"text/csv");
  } catch(error){$("sweep-result").textContent=error.message;}
  button.disabled=false;button.textContent="Run 25-condition sweep";
}
function tab(name) {
  document.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===name)));
  document.querySelectorAll(".view").forEach(v=>v.hidden=v.id!==`view-${name}`);
  if(name==="lab")requestAnimationFrame(renderResults);
  if(name==="assay")renderAssayGuidance();
}
async function initialize() {
  lockExports(true);
  [cases,defaults]=await Promise.all([fetch("./cases.json").then(r=>r.json()),fetch("./defaults.json").then(r=>r.json())]);
  $("family").insertAdjacentHTML("beforeend",[...new Set(cases.map(c=>c.family))].map(v=>`<option>${escapeHTML(v)}</option>`).join(""));
  $("search").oninput=renderLibrary;$("family").onchange=renderLibrary;
  $("reset").onclick=()=>selectCase(selected.id);
  document.querySelectorAll("[data-tab]").forEach(button=>button.onclick=()=>tab(button.dataset.tab));
  document.querySelector(".tabs").addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    const buttons=[...document.querySelectorAll("[data-tab]")],index=buttons.indexOf(document.activeElement);
    if(index<0)return;
    const next=event.key==="Home"?0:event.key==="End"?buttons.length-1:(index+(event.key==="ArrowRight"?1:-1)+buttons.length)%buttons.length;
    event.preventDefault();buttons[next].focus();tab(buttons[next].dataset.tab);
  });
  $("sequence").onchange=()=>{importedProtocol=null;setSequence($("sequence").value);scheduleRun();};
  for(const id of ["a-start","a-end","b-start","b-end","a-level","b-level"])$(id).onchange=()=>{
    importedProtocol=null;if(id.endsWith("start")||id.endsWith("end"))$("sequence").value="Custom timing";scheduleRun();
  };
  for(const [id,key] of Object.entries(ranges))$(id).oninput=()=>{
    p[key]=Number($(id).value);syncControls();$("model-status").textContent="Custom parameter settings · still illustrative, not fitted";scheduleRun();
  };
  $("gate-mode").onchange=()=>{p.gate_mode=$("gate-mode").value;scheduleRun();};
  $("switch-command").onchange=()=>{importedProtocol=null;scheduleRun();};
  $("readout").onchange=renderResults;$("csv").onclick=exportCSV;
  $("svg").onclick=exportChart;
  $("shared-pool").onchange=()=>{p.shared_pool=$("shared-pool").checked;syncControls();scheduleRun();};
  $("null-model").onclick=()=>{
    for(const key of ["cooperation","transactivation","priming_gain","memory_inhibition","live_inhibition","memory_gain","pool_a_basal"])p[key]=0;
    p.shared_pool=false;syncControls();$("model-status").textContent="Explicit connections removed · shared-output saturation and feedback remain";scheduleRun();
  };
  $("edit-imported").onclick=()=>{
    importedProtocol=null;$("import-notice").hidden=true;timingControls.forEach(id=>$(id).disabled=false);
    setSequence($("sequence").value);$("model-status").textContent="Imported parameters · timing replaced by visible controls";scheduleRun();
  };
  $("export-config").onclick=()=>download(`${exportPrefix}-${selected.id}.json`,JSON.stringify({
    description:`Data-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08. Crosstalk Check: ${selected.title}. Synthetic illustrative model, not fitted. ${selected.source||""}`,
    parameters:p,protocol:getProtocol(),simulation:{duration,dt:.1}
  },null,2),"application/json");
  $("import-config").onchange=async event=>{
    try{
      const file=event.target.files[0];if(!file)return;
      if(file.size>100000)throw Error("Configuration is too large.");
      const config=JSON.parse(await file.text());
      if(Object.keys(config).some(k=>!["description","parameters","protocol","simulation"].includes(k)))throw Error("Unknown top-level configuration field.");
      if(Object.keys(config.protocol||{}).some(k=>!["a","b","switch"].includes(k)))throw Error("Unknown protocol field.");
      const unknown=Object.keys(config.parameters||{}).filter(k=>!(k in defaults));if(unknown.length)throw Error(`Unknown parameter fields: ${unknown.join(", ")}`);
      const next={...defaults,...config.parameters},protocol={a:{baseline:0},b:{baseline:0},switch:{baseline:1},...config.protocol};
      const dur=config.simulation?.duration??40;
      simulate(next,protocol,dur,.1);
      selected={id:"imported",title:"Imported model",family:"Custom",kind:"Uncalibrated model",a:"Input A",b:"Input B",mechanism:"User-defined topology",question:"Inspect the assumptions before interpreting the response.",evidence:"No literature evidence is inferred from an imported file.",mapping:"Parameters and stimulation are loaded from your configuration.",omissions:"Receptor identity and biological validity are not established by the file.",switch:"See the imported gate mode and kinetics.",readout:"Independent validation remains necessary."};
      p=next;duration=dur;importedProtocol=protocol;syncControls();labels();renderEvidence();renderLibrary();sweepToken++;
      $("import-notice").hidden=false;$("imported-timing").textContent=JSON.stringify(protocol,null,2);
      timingControls.forEach(id=>$(id).disabled=true);
      $("model-status").textContent="Imported configuration · exact protocol retained until timing controls are changed";
      $("import-status").textContent=`Loaded ${file.name}. The imported protocol is retained exactly; timing controls are locked until explicitly replaced.`;
      $("parameter-json").textContent=JSON.stringify({parameters:p,protocol},null,2);
      scheduleRun();tab("lab");
    }catch(error){$("import-status").textContent=`Not imported: ${error.message}`;setError(error.message);}
    event.target.value="";
  };
  $("run-sweep").onclick=sweep;
  $("make-plate").onclick=generatePlate;$("assay-brief").onclick=exportAssayBrief;
  document.querySelectorAll(".panel-detail").forEach(d=>d.addEventListener("toggle",()=>{if(d.open&&lastPair)renderResults();}));
  let resizeTimer;window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderResults,150);});
  selectCase(cases[0].id);
}
initialize().catch(error=>setError(`Could not load the model: ${error.message}`));
