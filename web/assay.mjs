// Draft experimental-layout helpers. No doses or biological validation are inferred.
export const CONDITIONS = [
  {id:"R0",label:"Reference · neither input",a:false,b:false,mode:"reference"},
  {id:"RA",label:"Reference · A only",a:true,b:false,mode:"reference"},
  {id:"RB",label:"Reference · B only",a:false,b:true,mode:"reference"},
  {id:"RAB",label:"Reference · A+B",a:true,b:true,mode:"reference"},
  {id:"G0",label:"Intervention · neither input",a:false,b:false,mode:"intervention"},
  {id:"GA",label:"Intervention · A only",a:true,b:false,mode:"intervention"},
  {id:"GB",label:"Intervention · B only",a:false,b:true,mode:"intervention"},
  {id:"GAB",label:"Intervention · A+B",a:true,b:true,mode:"intervention"},
];
export const EXTRA_CONTROLS=[
  {id:"NS",label:"No switch + A+B + actuator input",a:true,b:true,mode:"not simulated"},
  {id:"BD",label:"Binding-dead payload + A+B + actuator input",a:true,b:true,mode:"not simulated"},
  {id:"RO",label:"Reporter-only + actuator input",a:false,b:false,mode:"not simulated"},
  {id:"PC",label:"Orthogonal positive control, specify experimentally",a:null,b:null,mode:"not simulated"},
];
function randomGenerator(seed) {
  let t=seed>>>0;
  return ()=>{t+=0x6D2B79F5;let v=t;v=Math.imul(v^v>>>15,v|1);v^=v+Math.imul(v^v>>>7,v|61);return ((v^v>>>14)>>>0)/4294967296;};
}
export function buildPlate({replicates=3,seed=26708,excludeEdge=true,controls=true}={}) {
  if(!Number.isInteger(replicates)||replicates<1||replicates>8)throw Error("Technical replicates must be an integer from 1 to 8.");
  if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error("Randomization seed must be an integer from 0 to 4294967295.");
  const conditions=[...CONDITIONS,...(controls?EXTRA_CONTROLS:[])];
  const wells=Array.from({length:8},(_,r)=>Array.from({length:12},(_,c)=>({
    well:String.fromCharCode(65+r)+String(c+1).padStart(2,"0"),r,c,
    edge:r===0||r===7||c===0||c===11
  }))).flat();
  const available=wells.filter(w=>!excludeEdge||!w.edge);
  if(conditions.length*replicates>available.length)throw Error(`${conditions.length*replicates} wells are required, but only ${available.length} are available. Reduce replicates or allow edge wells.`);
  const random=randomGenerator(seed),shuffled=[...available];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  let index=0;const assignments=new Map();
  for(const condition of conditions)for(let replicate=1;replicate<=replicates;replicate++){
    const well=shuffled[index++];assignments.set(well.well,{...condition,replicate});
  }
  return {replicates,seed,excludeEdge,controls,conditions,
    wells:wells.map(w=>({...w,...assignments.get(w.well),status:assignments.has(w.well)?"assigned":excludeEdge&&w.edge?"edge reserved":"unassigned"}))};
}
const csvEscape=value=>`"${String(value??"").replaceAll('"','""')}"`;
export function plateCSV(plate,caseTitle,protocol) {
  return ["well,condition_id,condition,technical_replicate,status,simulation_status,case,input_a_protocol,input_b_protocol,switch_protocol",
    ...plate.wells.map(w=>[w.well,w.id,w.label,w.replicate,w.status,w.mode,caseTitle,
      w.a?JSON.stringify(protocol.a):w.a===false?"No A input":"Specify",
      w.b?JSON.stringify(protocol.b):w.b===false?"No B input":"Specify",
      w.mode==="reference"?"Always open":w.mode==="intervention"?JSON.stringify(protocol.switch):"Specify experimentally"
    ].map(csvEscape).join(","))].join("\n");
}
