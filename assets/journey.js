(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const places = [
    {name:'Amsterdam', machine:'Snellius', operator:'SURF', country:'The Netherlands', lon:4.90, lat:52.37},
    {name:'Kajaani', machine:'LUMI', operator:'CSC', country:'Finland', lon:27.73, lat:64.23},
    {name:'Barcelona', machine:'MareNostrum 5', operator:'BSC', country:'Spain', lon:2.17, lat:41.39},
    {name:'Bologna', machine:'Leonardo', operator:'Cineca', country:'Italy', lon:11.34, lat:44.49},
    {name:'Jülich', machine:'JUPITER', operator:'JSC', country:'Germany', lon:6.36, lat:50.92}
  ];
  const chapters = [
    {place:0, title:'A life in<br>pretraining.', label:'A life in pretraining', kicker:'Snellius · SURF / OpenEuroLLM', text:'From my desk at SURF in Amsterdam to Europe’s supercomputers. My work on the data, experiments and training behind the OpenEuroLLM model family.', visual:'intro', note:'One project. Many people. A journey through my part of it.'},
    {place:0, title:'Built across<br>Europe.', label:'The project partners', kicker:'OpenEuroLLM / The collaboration', text:'Universities, research teams, companies and supercomputing centres bring their expertise together to build an open European model family.', visual:'partners', note:'21 partners · select a logo to visit the organization’s website.'},
    {place:1, title:'Before the model,<br>the data.', label:'Preparing the data', kicker:'LUMI · CSC / Data preparation', text:'Curate, clean, deduplicate. Then turn text into tokens and mix the languages and sources the model will learn from.', visual:'data', note:'Source rights, quality, personal data and evaluation overlap all need attention.'},
    {place:2, title:'Small runs.<br>Big decisions.', label:'Scaling experiments', kicker:'MareNostrum 5 · BSC / Experiments', text:'Experiments help us choose the global batch size and learning rate. Scaling laws connect model size, data and compute to the bigger training budget.', visual:'scaling', note:'Illustrative curves, not measured experiment results.'},
    {place:3, title:'First, 9 billion.', label:'The 9B model', kicker:'Leonardo · Cineca / Pretraining', text:'The smallest model in the OpenEuroLLM family was pretrained on Leonardo in Bologna. It is awaiting annealing, the final phase of pretraining.', visual:'nine', note:'9B · the smallest member of the OpenEuroLLM model family.'},
    {place:4, title:'Now, 32 billion.', label:'The 32B run', kicker:'JUPITER · JSC / Training', text:'Our intermediate model is training now. Thousands of GPUs work together as we build towards a larger model planned for 2027.', visual:'run', note:'OpenEuroLLM model family · 9B → 32B now → larger model planned for 2027.'},
    {place:4, title:'How a model<br>actually learns.', label:'One training step', kicker:'JUPITER · JSC / Inside a step', text:'Predict the next tokens. Measure the loss. Compute gradients. Only then does the optimizer change the parameters.', visual:'step', note:'Positions train in parallel. Each sees only the tokens up to its position. Predictions are illustrative.'},
    {place:4, title:'The run needs<br>looking after.', label:'Watching the run', kicker:'JUPITER · JSC / My day-to-day', text:'Watch the loss, gradients and throughput. Check the data. Save checkpoints. Investigate when the run stops behaving as expected.', visual:'monitor', note:'Monitoring is about patterns over time, not just a single number.'},
    {place:4, title:'A gentler finish.', label:'Annealing', kicker:'JUPITER · JSC / Next phase', text:'Lower the learning rate and shift the data mix towards quality. Longer-context training is another part of the plan to explore, not an automatic consequence of annealing.', visual:'anneal', note:'The result is still a base model. The exact schedule and context target are not published here.'},
    {place:4, title:'From text to<br>helpful answers.', label:'Supervised fine-tuning', kicker:'To come / SFT', text:'Train on examples of prompts and good responses. The base model learns the format and behaviour of an assistant.', visual:'sft', note:'Future chapter. Post-training hardware and schedule are not confirmed; the map stays at the last known stop.'},
    {place:4, title:'Learning from<br>feedback.', label:'Reinforcement learning', kicker:'To come / Post-training', text:'Reward better responses. Feedback can come from people or from outcomes we can verify, such as passing a code test.', visual:'rl', note:'GRPO is an optimization algorithm; RLHF and RLVR describe feedback sources. The project’s method is not yet confirmed.'}
  ];
  places.forEach((place,i)=>{place.chapter=chapters.findIndex(chapter=>chapter.place===i);});
  const partnerCountries=['Netherlands','Norway','Sweden','Finland','Germany','Italy','Spain'];
  const partners=[
    {name:'Charles University / UFAL',href:'https://ufal.mff.cuni.cz',logo:'charles-university.webp',group:'research'},
    {name:'AI Sweden',href:'https://www.ai.se/en',logo:'ai-sweden.webp',group:'research'},
    {name:'ALT-EDIC',href:'https://alt-edic.eu/about-us/',logo:'alt-edic.webp',group:'research'},
    {name:'University of Tübingen',href:'https://uni-tuebingen.de/en/',logo:'university-tuebingen.webp',group:'research'},
    {name:'ELLIS Institute Tübingen',href:'https://institute-tue.ellis.eu/',logo:'ellis-tuebingen.webp',group:'research'},
    {name:'Fraunhofer IAIS',href:'https://www.iais.fraunhofer.de/en.html',logo:'fraunhofer-iais.webp',group:'research'},
    {name:'Barcelona Supercomputing Center',href:'https://www.bsc.es/',logo:'bsc.svg',group:'research'},
    {name:'Forschungszentrum Jülich',href:'https://www.fz-juelich.de/en',logo:'fz-juelich.webp',group:'research'},
    {name:'Eindhoven University of Technology',href:'https://www.tue.nl/en/',logo:'tu-eindhoven.webp',group:'research'},
    {name:'University of Helsinki',href:'https://www.helsinki.fi/en',logo:'university-helsinki.webp',group:'research'},
    {name:'University of Oslo',href:'https://www.uio.no/english/',logo:'university-oslo.webp',group:'research'},
    {name:'University of Turku',href:'https://www.utu.fi/en',logo:'university-turku.webp',group:'research'},
    {name:'Aleph Alpha',href:'https://aleph-alpha.com/',logo:'aleph-alpha.webp',group:'company'},
    {name:'AMD Silo AI',href:'https://www.silo.ai/',logo:'amd-silo-ai.svg',group:'company'},
    {name:'Ellamind',href:'https://ellamind.com/',logo:'ellamind.webp',group:'company'},
    {name:'LightOn',href:'https://www.lighton.ai/',logo:'lighton.webp',group:'company'},
    {name:'ELDA',href:'http://www.elda.fr/en/',logo:'elda.webp',group:'company'},
    {name:'Prompsit',href:'https://www.prompsit.com/',logo:'prompsit.webp',group:'company'},
    {name:'Cineca',href:'https://www.cineca.it/en',logo:'cineca.svg',group:'hpc'},
    {name:'CSC',href:'https://csc.fi/en/',logo:'csc.webp',group:'hpc'},
    {name:'SURF',href:'https://www.surf.nl/en',logo:'surf.webp',group:'hpc'}
  ];
  const canvas = $('#europe'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0, mapData = null, width = 0, height = 0, flight = null, frame = 0, stageTimer = null, flightTimer = null;
  let snapshot = {meta:{...SNAP.meta}, m32:{...SNAP.m32}};
  const num = n => new Intl.NumberFormat('en-GB').format(n);
  const icons = () => window.lucide && lucide.createIcons();
  const tokens = values => `<div class="tokens">${values.map(v=>`<span class="token">${v}</span>`).join('')}</div>`;
  const plot = (anneal=false) => `<svg class="plot" viewBox="0 0 380 140" role="img" aria-label="${anneal?'Illustrative learning rate schedule':'Illustrative experimental loss curves'}"><path class="axis" d="M25 10V110H365"/><text x="25" y="132">${anneal?'Pretraining':'Training tokens'}</text><text x="365" y="132" text-anchor="end">${anneal?'Annealing':'More compute'}</text>${anneal?'<path stroke="#18775c" d="M25 25H230 Q265 25 280 51L355 105"/><path stroke="#c25a35" stroke-dasharray="3 4" d="M230 12V113"/>':'<path stroke="#18775c" d="M25 15C50 70 75 76 125 86S275 104 355 107"/><path stroke="#c25a35" d="M25 25C60 46 90 70 140 74S260 89 355 94"/>'}</svg>`;
  function visual(type) {
    switch(type) {
      case 'intro': return '<div class="family-label">THE OPENEUROLLM MODEL FAMILY</div><div class="model-family"><div><strong>9B</strong><span>Smallest</span><small>Awaiting annealing</small></div><i data-lucide="arrow-right"></i><div class="family-current"><strong>32B</strong><span>Intermediate</span><small>Training now</small></div><i data-lucide="arrow-right"></i><div><strong>2027</strong><span>Larger model</span><small>Planned</small></div></div><a class="project-link" href="https://openeurollm.eu/" target="_blank" rel="noopener noreferrer">openeurollm.eu <i data-lucide="arrow-up-right"></i></a>';
      case 'partners': return `<div class="partner-grid" role="list" aria-label="21 OpenEuroLLM partners">${partners.map(p=>`<a class="partner-logo partner-logo--${p.group}" role="listitem" href="${p.href}" target="_blank" rel="noopener noreferrer" title="${p.name}" aria-label="${p.name} (opens in a new tab)"><img src="assets/partners/${p.logo}" alt="${p.name}" loading="eager"></a>`).join('')}</div><div class="partner-key" aria-hidden="true"><span>Research</span><span>Companies</span><span>HPC centres</span></div><div class="partner-countries"><small>PARTNER COUNTRIES INCLUDE</small><p>${partnerCountries.join(' · ')}</p></div><a class="project-link" href="https://openeurollm.eu/" target="_blank" rel="noopener noreferrer">Meet the consortium <i data-lucide="arrow-up-right"></i></a>`;
      case 'data': return `<div class="data-docs">${Array.from({length:6},()=>'<div class="doc"><i></i><i></i><i></i></div>').join('')}</div>${tokens(['De','▁A','fs','luit','d','ijk'])}<div class="data-stages"><span>Curate</span><span>Clean & deduplicate</span><span>Tokenize & mix</span></div><button class="small-action" id="clean" aria-pressed="false"><i data-lucide="filter"></i><span>Deduplicate sample</span></button>`;
      case 'scaling': return `${plot()}<div class="legend"><span>Recipe A</span><span>Recipe B</span></div><div class="intro-rule"></div><div class="intro-meta"><div><strong>4,096</strong>32B global batch / sequences</div><div><strong>${snapshot.m32.lr.toExponential(2)}</strong>32B learning rate</div></div>`;
      case 'nine': return '<div class="giant" style="color:var(--blue)">9B</div><div class="visual-caption">LEONARDO · BOLOGNA</div><div style="margin-top:24px"><span class="pill">Pretrained · awaiting annealing</span></div>';
      case 'run': return runVisual();
      case 'step': return `${tokens(['Het','▁weer','▁in'])}<div class="loop-arrows"><span>↓</span><span>↓</span><span>↓</span></div><div class="model-block">OpenEuroLLM · 32B parameters</div><div class="loop-label">NEXT-TOKEN TARGETS</div>${tokens(['▁weer','▁in','▁Nederland'])}<div class="loop-bottom"><span data-phase="0" class="current">Predict</span><span data-phase="1">Loss</span><span data-phase="2">Gradients</span><span data-phase="3">Update ↺</span></div><button class="small-action" id="step-toggle" aria-label="Pause training illustration" title="Pause training illustration" aria-pressed="false"><i data-lucide="pause"></i></button>`;
      case 'monitor': return `<div class="monitor-readout"><div><strong>${snapshot.m32.loss.toFixed(2)}</strong><small>Loss</small></div><div><strong>${snapshot.m32.gradNorm ?? '—'}</strong><small>Gradient norm</small></div><div><strong>${snapshot.m32.secPerStep}s</strong><small>Per step</small></div></div><div class="model-block">Checkpoint · step ${num(snapshot.m32.lastCheckpointStep)}</div><div class="status-list"><span>Loss & stability</span><span>Performance</span><span>Recovery</span></div><div class="visual-caption">${stamp()}</div>`;
      case 'anneal': return `${plot(true)}<div class="intro-meta"><div><strong>Lower LR</strong>smaller parameter updates</div><div><strong>Quality mix</strong>final pretraining data</div></div><div class="intro-rule"></div><span class="pill" style="align-self:center">Base model → post-training</span>`;
      case 'sft': return '<div class="conversation"><div><small>PROMPT · ILLUSTRATIVE</small>Explain pretraining in one sentence.</div><div><small>DEMONSTRATION</small>A model learns patterns in text by repeatedly predicting what comes next.</div></div>';
      case 'rl': return '<div class="reward-options"><div><strong>RLHF</strong>Human feedback</div><div><strong>RLVR</strong>Verifiable rewards</div></div><div class="loop-label" style="margin-top:23px">GENERATE → SCORE → UPDATE</div>';
      default: return '';
    }
  }
  function stamp() { return `${snapshot.meta.live?'Live feed':'Snapshot'} · ${new Date(snapshot.meta.takenAt).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})}`; }
  function runVisual() {
    const m=snapshot.m32, percent=Math.min(100,Math.max(0,m.step/m.totalSteps*100));
    return `<div class="run-stats"><div><strong>${num(m.gpus)}</strong>GH200 GPUs</div><div><strong>${num(m.nodes)}</strong>nodes</div><div><strong>${num(m.step)}</strong>steps</div></div><div class="gpu-grid" aria-label="512 nodes, four GPUs per node">${'<i></i>'.repeat(512)}</div><div class="visual-caption">One square = one node · four GPUs</div><div class="progress-label"><strong>${percent.toFixed(1)}% of planned steps</strong><span>${(m.step*m.tokensPerStep/1e12).toFixed(2)}T / ${(m.totalTokens/1e12).toFixed(0)}T tokens</span></div><progress value="${percent}" max="100" aria-label="32B training progress"></progress><div class="visual-caption">${stamp()}</div>`;
  }
  function render() {
    clearInterval(stageTimer);
    const c=chapters[index], p=places[c.place];
    $('#scene').dataset.chapter=c.visual;
    $('#scene').innerHTML=`<div class="scene-kicker"><span class="number">${String(index+1).padStart(2,'0')}</span>${c.kicker}</div><h1>${c.title}</h1><p class="lede">${c.text}</p><div class="visual">${visual(c.visual)}</div><p class="scene-note">${c.note}</p>`;
    const partners=c.visual==='partners';
    $('#place').textContent=partners?'Across Europe':p.name;
    $('#machine').textContent=partners?'One collaboration':p.machine;
    $('#place-detail').textContent=partners?'Research · Industry · Supercomputing':`Operated by ${p.operator} · ${p.country}`;
    $('#position').textContent=`${String(index+1).padStart(2,'0')} / ${chapters.length}`;
    $('#chapter-name').textContent=c.label;
    $('#prev').disabled=index===0;
    $('#next span').textContent=index===chapters.length-1?'Back to start':chapters[index+1].place!==c.place?'Next stop':'Continue';
    $('#next').title=index===chapters.length-1?'Back to start':'Next chapter';
    $('#next').setAttribute('aria-label',$('#next').title);
    document.querySelectorAll('[data-chapter]').forEach(b=>{const active=+b.dataset.chapter===index;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    document.querySelectorAll('.pin').forEach((b,i)=>b.classList.toggle('active',!partners&&i===c.place));
    if ($('#clean')) $('#clean').onclick=()=>{const active=$('.visual').classList.toggle('filtered');$('#clean').setAttribute('aria-pressed',String(active));$('#clean span').textContent=active?'Reset sample':'Deduplicate sample';};
    if ($('#step-toggle')) {
      let phase=0, paused=reduced;
      const button=$('#step-toggle');
      const paintButton=()=>{button.innerHTML=`<i data-lucide="${paused?'play':'pause'}"></i>`;button.setAttribute('aria-pressed',String(paused));button.title=paused?'Resume training illustration':'Pause training illustration';button.setAttribute('aria-label',button.title);icons();};
      stageTimer=setInterval(()=>{if(paused||document.hidden)return;phase=(phase+1)%4;document.querySelectorAll('[data-phase]').forEach(n=>n.classList.toggle('current',+n.dataset.phase===phase));},1300);
      button.onclick=()=>{paused=!paused;paintButton();};paintButton();
    }
    icons();draw();
  }
  function menu(open) { $('#chapters').hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));if(open)$('#chapter-list button.active').focus(); }
  function go(next) {
    if(next<0||next>=chapters.length)return;
    clearTimeout(flightTimer);cancelAnimationFrame(frame);flight=null;
    const from=chapters[index].place,to=chapters[next].place;
    index=next;history.replaceState(null,'',`#chapter-${index+1}`);menu(false);
    document.body.classList.remove('overview');$('#overview').setAttribute('aria-pressed','false');
    document.body.classList.remove('travelling');
    if(from!==to&&!reduced){
      document.body.classList.add('travelling');$('#scene').inert=true;
      $('#travel').textContent=`${places[from].name} → ${places[to].name}`;
      flight={from,to,start:performance.now(),duration:1900};
      function animate(now){if(!flight)return;flight.t=Math.min(1,(now-flight.start)/flight.duration);draw();if(flight.t<1)frame=requestAnimationFrame(animate);}
      frame=requestAnimationFrame(animate);
      flightTimer=setTimeout(()=>{flight=null;render();document.body.classList.remove('travelling');$('#scene').inert=false;$('#travel').textContent='';},2050);
    }else{render();$('#scene').inert=false;$('#travel').textContent='';if(!reduced)$('#scene').animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});}
  }
  function project(lon,lat){
    const merc = value => Math.log(Math.tan(Math.PI/4+value*Math.PI/360));
    const mobile=width<700, overview=document.body.classList.contains('overview')||!!flight;
    const mapWidth=mobile?width*.88:overview?Math.min(width*.68,900):width*.46;
    const scale=mapWidth/60, x=mobile?width*.10:overview?(width-mapWidth)/2:width*.035;
    const y=mobile?190:height*.30;
    return [x+(lon+13)*scale,y+(merc(69)-merc(lat))*180/Math.PI*scale*.70];
  }
  function route(a,b,t=1){
    const p=project(places[a].lon,places[a].lat),q=project(places[b].lon,places[b].lat);
    const mid=[(p[0]+q[0])/2-40,(p[1]+q[1])/2-35];
    const point=u=>[(1-u)*(1-u)*p[0]+2*(1-u)*u*mid[0]+u*u*q[0],(1-u)*(1-u)*p[1]+2*(1-u)*u*mid[1]+u*u*q[1]];
    ctx.beginPath();ctx.moveTo(...p);for(let k=1;k<=60;k++)ctx.lineTo(...point(t*k/60));ctx.stroke();return point(t);
  }
  function draw(){
    if(!width)return;ctx.clearRect(0,0,width,height);ctx.fillStyle='#02090f';ctx.fillRect(0,0,width,height);
    if(mapData){
      ctx.lineWidth=.7;ctx.strokeStyle='#25404f';ctx.fillStyle='#0b1b25';
      mapData.features.forEach(feature=>{const geometry=feature.geometry;if(!geometry)return;const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.type==='MultiPolygon'?geometry.coordinates:[];polygons.forEach(polygon=>{ctx.beginPath();polygon.forEach(ring=>{ring.forEach((coord,i)=>{const p=project(coord[0],coord[1]);if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p);});ctx.closePath();});ctx.fill('evenodd');ctx.stroke();});});
    }
    ctx.setLineDash([3,6]);ctx.strokeStyle='#52768b';ctx.lineWidth=1;
    for(let i=0;i<4;i++)route(i,i+1);ctx.setLineDash([]);
    if(flight){ctx.strokeStyle='#ef8700';ctx.lineWidth=2;const p=route(flight.from,flight.to,flight.t||0);ctx.fillStyle='#ef8700';ctx.beginPath();ctx.arc(...p,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ef870030';ctx.lineWidth=10;ctx.stroke();}
    document.querySelectorAll('.pin').forEach((pin,i)=>{const p=project(places[i].lon,places[i].lat);pin.style.left=`${p[0]-6}px`;pin.style.top=`${p[1]-6}px`;});
  }
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  places.forEach((p,i)=>{const b=document.createElement('button');b.className='pin';b.title=p.name;b.setAttribute('aria-label',`${p.name}: ${chapters[p.chapter].label}`);b.innerHTML=`<span>${p.name}</span>`;b.onclick=()=>go(p.chapter);$('#pins').append(b);});
  chapters.forEach((c,i)=>{
    const b=document.createElement('button');b.dataset.chapter=i;b.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b><span>${c.label}<small>${['sft','rl'].includes(c.visual)?'To come':c.visual==='partners'?'Across Europe':`${places[c.place].machine} · ${places[c.place].operator}`}</small></span>`;b.onclick=()=>go(i);$('#chapter-list').append(b);
    const dot=document.createElement('button');dot.dataset.chapter=i;dot.title=c.label;dot.setAttribute('aria-label',c.label);dot.onclick=()=>go(i);$('#timeline').append(dot);
  });
  $('#prev').onclick=()=>go(index-1);$('#next').onclick=()=>go((index+1)%chapters.length);
  $('#menu-toggle').onclick=()=>menu($('#chapters').hidden);
  $('#menu-close').onclick=()=>{menu(false);$('#menu-toggle').focus();};
  $('#overview').onclick=()=>{clearTimeout(flightTimer);cancelAnimationFrame(frame);flight=null;document.body.classList.remove('travelling');$('#travel').textContent='';const active=document.body.classList.toggle('overview');$('#overview').setAttribute('aria-pressed',String(active));$('#scene').inert=active;render();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu(false);if(document.body.classList.contains('overview'))$('#overview').click();}if(!$('#chapters').hidden||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();go((index+1)%chapters.length);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}});
  document.addEventListener('click',e=>{if(!$('#chapters').hidden&&!e.target.closest('#chapters,#menu-toggle'))menu(false);});
  window.addEventListener('resize',resize);
  const requested=Number(location.hash.replace('#chapter-',''))-1;if(Number.isInteger(requested)&&requested>=0&&requested<chapters.length)index=requested;
  resize();render();
  fetch('assets/europe-countries.geojson').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json();}).then(data=>{mapData=data;draw();}).catch(()=>{$('.map-credit').textContent='Map unavailable · Journey locations remain selectable';});
  async function poll(){
    try{
      const response=await fetch('live.json',{cache:'no-store'});if(!response.ok)return;
      const live=await response.json(),m=live.m32,date=Date.parse(live.meta?.takenAt);
      if(!m||!Number.isFinite(date)||date<=Date.parse(snapshot.meta.takenAt))return;
      const positive=['totalSteps','tokensPerStep','totalTokens','secPerStep','gpus','nodes','lr'];
      const nonnegative=['step','loss','lastCheckpointStep'];
      const merged={...snapshot.m32,...m};
      if(positive.some(k=>!Number.isFinite(merged[k])||merged[k]<=0)||nonnegative.some(k=>!Number.isFinite(merged[k])||merged[k]<0))return;
      if(merged.gradNorm!=null&&!Number.isFinite(merged.gradNorm))return;
      snapshot={meta:{takenAt:live.meta.takenAt,live:live.meta.live===true},m32:merged};
      if(!flight&&['run','monitor','scaling'].includes(chapters[index].visual))render();
    }catch{/* Keep the last valid, timestamped snapshot when the feed is unavailable. */}
  }
  poll();setInterval(poll,900000);
})();
