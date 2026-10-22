const STAGES = ['Touched','Signed up','First search','Activated','Paid'];
const DATA = [
  { id:'vc', name:'VC partner network', count:'31 accounts', desc:'Portfolio intros from three London funds; quarterly partner updates with pipeline attached.', spend: 4200,
    accounts:[
      {n:'Series A AI devtools startup', s:4},{n:'Seed-stage robotics hiring platform', s:3},
      {n:'Series B fintech, 40 heads to hire', s:4},{n:'Fund portfolio ops team (multi-account)', s:2},
      {n:'Pre-seed founder community cohort', s:1}],
    verdict:'Double down.', why:'Lowest cost per activated account in the quarter, and the sourced accounts hire in clusters - one fund intro reached four portfolio companies.' },
  { id:'dinners', name:'Founder dinners', count:'18 accounts', desc:'Monthly eight-seat dinners for heads of talent at post-seed startups.', spend: 6800,
    accounts:[
      {n:'Seed HR-tech, first recruiting hire', s:3},{n:'Series A healthtech, 25 open roles', s:4},
      {n:'Stealth AI lab, founding recruiter', s:4},{n:'Series C marketplace, talent lead', s:2}],
    verdict:'Keep, tighten the list.', why:'Highest activation rate of any channel - the room does the qualifying. Cap seats at operators with live headcount plans.' },
  { id:'conf', name:'Conference presence', count:'54 accounts', desc:'Two ecosystem conferences; booth plus a hosted side-event for talent leaders.', spend: 21000,
    accounts:[
      {n:'Enterprise retailer, 200+ hires/yr', s:2},{n:'Scale-up logistics, TA team of 6', s:1},
      {n:'Growth-stage SaaS, 60 roles', s:2},{n:'Recruitment agency (partner, not buyer)', s:1}],
    verdict:'Cut the booth, keep the side-event.', why:'The booth sourced volume but almost nothing activated; every account that progressed came through the hosted side-event. Same budget, half the spend.' },
  { id:'ooh', name:'OOH campaign', count:'77 accounts', desc:'Shoreditch poster run near startup offices, timed to a product launch week.', spend: 14500,
    accounts:[
      {n:'Consumer app, 15 open roles', s:1},{n:'Fintech scale-up, brand-led signup', s:1},
      {n:'AI research lab, direct traffic spike', s:2}],
    verdict:'Treat as brand, not pipeline.', why:'Awareness moved - direct signups rose that week - but almost nothing ties to an activated account. Fund it from brand budget or not at all.' }
];

const $ = s => document.querySelector(s);
const money = n => '£' + n.toLocaleString('en-GB');
function activated(d){ return d.accounts.filter(a=>a.s>=3).length; }
function cpa(d){ const a=activated(d); return a? Math.round(d.spend/a) : null; }

function tick(el, target, prefix='', suffix=''){
  const t0 = performance.now(), dur=700;
  function step(t){ const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
    el.textContent = prefix + Math.round(target*e).toLocaleString('en-GB') + suffix;
    if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}

function renderAccounts(d){
  const box = $('#accounts');
  box.innerHTML = d.accounts.map(a=>{
    const chips = STAGES.map((st,i)=>`<span class="stage${i<=a.s?' done':''}">${st}</span>`).join('<span class="arrow">-&gt;</span>');
    return `<div class="acct"><p class="acct-name">${a.n}</p><div class="chain">${chips}</div></div>`;
  }).join('');
  const cp = cpa(d);
  $('#decision').hidden = false;
  $('#verdict').textContent = d.verdict;
  $('#why').textContent = `${d.why} Spend ${money(d.spend)} - ${activated(d)} activated - ${cp? money(cp)+' per activated account':'no activations yet'}.`;
}

function select(id){
  const d = DATA.find(x=>x.id===id);
  document.querySelectorAll('.init').forEach(el=>el.classList.toggle('sel', el.dataset.id===id));
  renderAccounts(d);
}

function init(){
  $('#initiatives').innerHTML = DATA.map(d=>{
    const cp = cpa(d);
    return `<div class="init" data-id="${d.id}" role="button" tabindex="0">
      <div class="init-top"><span class="init-name">${d.name}</span><span class="init-count">${d.count}</span></div>
      <p class="init-desc">${d.desc}</p>
      <p class="init-econ">${cp? money(cp)+' / activated account':'no activations yet'}</p>
    </div>`;
  }).join('');
  document.querySelectorAll('.init').forEach(el=>{
    el.addEventListener('click', ()=>select(el.dataset.id));
    el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();select(el.dataset.id);} });
  });
  const totalA = DATA.reduce((n,d)=>n+d.accounts.length,0);
  const totalAct = DATA.reduce((n,d)=>n+activated(d),0);
  const totalSpend = DATA.reduce((n,d)=>n+d.spend,0);
  tick($('#cAccounts'), totalA); tick($('#cActivated'), totalAct);
  tick($('#cCpa'), Math.round(totalSpend/totalAct), '£');
  const ranked = [...DATA].sort((a,b)=> (cpa(a)??1e9) - (cpa(b)??1e9));
  $('#ranking').innerHTML = ranked.map((d,i)=>{
    const cp = cpa(d);
    return `<div class="rank-row"><div><p class="rank-name"><span class="rk">0${i+1}</span>${d.name}</p><p class="rank-why">${d.verdict}</p></div><span class="rank-stat">${cp? money(cp)+' / activated':'no activations'}</span></div>`;
  }).join('');
  select('vc');
}
init();
