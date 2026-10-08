/* ==========================================================================
   Journey engine: map, navigation, figures, live feed.

   It holds no copy and no numbers. Copy and figures live in
   journey-content.js (JOURNEY), numbers in data.js (SNAP). If you came here
   to change a sentence or a figure, it is in journey-content.js.
   ========================================================================== */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  /* A browser holding an index.html from before the content split has no
     script tag for journey-content.js, and would otherwise throw here and
     leave the visitor with a blank map and no chapters. Load the content and
     restart, once; HTML on a CDN outlives an asset version bump. */
  if (typeof JOURNEY === 'undefined') {
    if (window.__journeyRestarted) return;
    window.__journeyRestarted = true;
    const content = document.createElement('script');
    content.src = 'assets/journey-content.js';
    content.onload = () => {
      const engine = document.createElement('script');
      engine.src = 'assets/journey.js';
      document.head.append(engine);
    };
    content.onerror = () => {
      const credit = $('.map-credit');
      if (credit) credit.textContent = 'Please reload the page to load the journey.';
    };
    document.head.append(content);
    return;
  }

  const places = JOURNEY.places, chapters = JOURNEY.chapters, partners = JOURNEY.partners;
  const UI = JOURNEY.ui;
  places.forEach((place,i)=>{place.chapter=chapters.findIndex(chapter=>chapter.place===i&&chapter.visual!=='welcome');});

  const canvas = $('#europe'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0, mapData = null, width = 0, height = 0, flight = null, frame = 0, stageTimer = null, flightTimer = null, tickerTimer = null;
  let snapshot = {meta:{...SNAP.meta}, m32:{...SNAP.m32}, m9:{...SNAP.m9}};

  /* --- text ---------------------------------------------------------------
     A content field is a plain string, or {nl, en} once translated. */
  const lang = 'en';
  const t = value => typeof value === 'string' ? value : value == null ? '' : (value[lang] ?? value.en ?? '');
  const FILLERS = {
    partners: () => partners.length,
    nextYear: () => SNAP.family.nextModelYear ?? '—',
    runStart: () => SNAP.m32.startedAt
      ? new Date(SNAP.m32.startedAt).toLocaleDateString('en-GB', {day:'numeric', month:'long'}) : '—',
    /* Derived on every view, so "days so far" cannot go stale in the copy. */
    /* Pure compute time for the whole schedule at the measured step time. */
    trainDays: () => SNAP.m32.totalSteps && SNAP.m32.secPerStep
      ? Math.round(SNAP.m32.totalSteps * SNAP.m32.secPerStep / 86400) : '—',
    gpus: () => SNAP.m32.gpus?.toLocaleString('en-GB') ?? '—',
    nodes: () => SNAP.m32.nodes?.toLocaleString('en-GB') ?? '—',
    gpusPerNodeWord: () => ['one','two','three','four','five','six','seven','eight'][SNAP.m32.gpusPerNode - 1] ?? SNAP.m32.gpusPerNode ?? '—',
    /* Tensor x pipeline parallel GPUs hold one copy; data parallel is the copies. */
    replicaGpus: () => SNAP.m32.parallel ? SNAP.m32.parallel.tp * SNAP.m32.parallel.pp : '—',
    replicas: () => SNAP.m32.parallel?.dp ?? '—',
    smallRuns: () => SNAP.experiments.smallRuns?.toLocaleString('en-GB') ?? '—',
    runDays: () => SNAP.m32.startedAt
      ? Math.max(0, Math.floor((Date.now() - Date.parse(SNAP.m32.startedAt)) / 86400000)) : "—",
  };
  const fill = value => t(value).replace(/\{\{(\w+)\}\}/g, (all,key) => FILLERS[key] ? FILLERS[key]() : all);

  /* --- figures ------------------------------------------------------------
     `d` is what a figure reads: the live-updated snapshot over the static
     parts of SNAP. Anything null in it renders through tbd(), never a guess;
     window.journeyMissing lists what the page had to leave blank. */
  const missing = [];
  window.journeyMissing = missing;
  const tbd = label => {
    if (label && !missing.includes(label)) missing.push(label);
    return `<span class="tbd">${t(UI.stillToFillIn)}</span>`;
  };
  const data = () => ({...SNAP, ...snapshot});
  /* Fail-safe: Intl formats null as "0", so an unguarded gap would ship as
     a real-looking zero. A missing number renders as the chip instead. */
  const num = n => Number.isFinite(n) ? new Intl.NumberFormat('en-GB').format(n) : tbd();
  const icons = () => window.lucide && lucide.createIcons();
  const { tokens, plot } = JOURNEY.parts;
  function stamp() { return `${snapshot.meta.live?t(UI.liveFeed):t(UI.snapshot)} · ${new Date(snapshot.meta.takenAt).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})}`; }
  function visual(type) {
    const figure = JOURNEY.figures[type];
    if (!figure) return '';
    return figure({ d: data(), num, tbd, stamp, tokens, plot, partners, groups: JOURNEY.partnerGroups });
  }

  /* The figure's claim tag shares the line with the chapter note, so one
     line under every figure says what kind of thing it is. */
  const TAGS = {measured:'Measured', schematic:'Schematic', illustrative:'Illustrative'};
  function sceneNote(c) {
    const tag = c.tag ? `<span class="figure-tag" data-tag="${c.tag}">${TAGS[c.tag] ?? c.tag}</span>` : '';
    const note = fill(c.note);
    return tag || note ? `<p class="scene-note">${tag}${note}</p>` : '';
  }

  function render() {
    clearInterval(stageTimer);
    clearInterval(tickerTimer);
    const c=chapters[index], p=places[c.place];
    document.body.classList.toggle('welcome',c.visual==='welcome');
    $('#scene').dataset.chapter=c.visual;
    $('#scene').innerHTML=`<div class="scene-kicker"><span class="number">${String(index+1).padStart(2,'0')}</span>${fill(c.kicker)}</div><h1>${fill(c.title)}</h1><p class="lede">${fill(c.text)}</p><div class="visual">${visual(c.visual)}</div>${sceneNote(c)}`;
    const storyHost=document.createElement('div');
    storyHost.className='story-slot';
    $('#scene').append(storyHost);
    window.chapterStories.mount(c.visual,storyHost);
    const partnersChapter=c.visual==='partners';
    $('#place').textContent=partnersChapter?t(UI.acrossEurope):p.name;
    $('#machine').textContent=partnersChapter?t(UI.oneCollaboration):p.machine;
    $('#place-detail').textContent=partnersChapter?t(UI.collaborationSub):`${t(UI.operatedBy)} ${p.operator} · ${t(p.country)}`;
    const photo=$('#machine-photo');
    const photos=['snellius.webp','lumi.webp','marenostrum5.webp','leonardo.webp','jupiter.webp'];
    photo.hidden=partnersChapter||['sft','rl'].includes(c.visual);
    const photoUrl=`assets/images/${photos[c.place]}`;
    photo.querySelector('img').src=photoUrl;
    photo.querySelector('img').alt=`${p.machine}, operated by ${p.operator}`;
    photo.querySelector('a').href=photoUrl;
    photo.querySelector('a').setAttribute('aria-label',`View full photograph of ${p.machine} (opens in a new tab)`);
    photo.querySelector('figcaption').textContent=`${p.machine} · ${p.operator}`;
    $('#position').textContent=`${String(index+1).padStart(2,'0')} / ${chapters.length}`;
    $('#chapter-name').textContent=t(c.label);
    $('#prev').disabled=index===0;
    $('#next span').textContent=c.visual==='welcome'?'Start the journey':index===chapters.length-1?t(UI.backToStart):chapters[index+1].place!==c.place?t(UI.nextStop):t(UI.continue);
    $('#next').title=index===chapters.length-1?t(UI.backToStart):t(UI.nextChapter);
    $('#next').setAttribute('aria-label',$('#next').title);
    document.querySelectorAll('[data-chapter]').forEach(b=>{const active=+b.dataset.chapter===index;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    document.querySelectorAll('.pin').forEach((b,i)=>b.classList.toggle('active',!partnersChapter&&i===c.place));
    if ($('#clean')) $('#clean').onclick=()=>{const active=$('.visual').classList.toggle('filtered');$('#clean').setAttribute('aria-pressed',String(active));$('#clean span').textContent=active?t(UI.resetSample):t(UI.deduplicate);};
    if ($('#step-toggle')) {
      let phase=0, paused=true;
      const button=$('#step-toggle');
      const paintButton=()=>{button.innerHTML=`<i data-lucide="${paused?'play':'pause'}"></i>`;button.setAttribute('aria-pressed',String(paused));button.title=paused?t(UI.resumeFigure):t(UI.pauseFigure);button.setAttribute('aria-label',button.title);icons();};
      /* The phase drives the figure, not just the label: [data-phase] elements
         get .current, and .visual[data-active] lets CSS light up the row the
         phase is about. Clicking a phase pauses and jumps to it. */
      const paintPhase=()=>{
        document.querySelectorAll('[data-phase]').forEach(n=>{
          const on=+n.dataset.phase===phase;
          n.classList.toggle('current',on);
          if(n.tagName==='BUTTON')n.setAttribute('aria-pressed',String(on));
        });
        const figure=$('.visual'); if(figure)figure.dataset.active=phase;
      };
      document.querySelectorAll('.loop-bottom [data-phase]').forEach(b=>{b.onclick=()=>{phase=+b.dataset.phase;paused=true;paintPhase();paintButton();};});
      stageTimer=setInterval(()=>{if(paused||document.hidden)return;phase=(phase+1)%4;paintPhase();},2000);
      button.onclick=()=>{paused=!paused;paintButton();};paintButton();paintPhase();
    }
    if ($('#loss-play')) {
      const plot=$('.loss-replay'), button=$('#loss-play'), status=$('#loss-status');
      let progress=1, playing=false;
      const clip=plot.querySelector('#loss-clip rect'), turn=plot.querySelector('.loss-turn');
      const turnAt=turn ? +turn.dataset.at : .85, fullWidth=clip ? +clip.getAttribute('width') : 0;
      const paint=()=>{
        if(clip) clip.setAttribute('width', progress*fullWidth);
        else plot.style.setProperty('--reveal', `${progress*100}%`);
        turn?.classList.toggle('shown',progress>=turnAt);
        status.textContent=progress<turnAt?'Loss is falling: predictions are improving.':'Loss is rising. Is that normal?';
        status.classList.toggle('loss-alert',progress>=turnAt);
        button.innerHTML=`<i data-lucide="${playing?'pause':progress>=1?'rotate-ccw':'play'}"></i>`;
        button.title=playing?'Pause plot reveal':progress>=1?'Replay recorded plot':'Resume plot reveal';
        button.setAttribute('aria-label',button.title);icons();
      };
      button.onclick=()=>{
        if(progress>=1)progress=0;
        playing=!playing;paint();
      };
      // This reveals recorded pixels, not reconstructed measurements or a live alert.
      stageTimer=setInterval(()=>{
        if(!playing||document.hidden)return;
        progress=Math.min(1,progress+.0125);
        if(progress>=1)playing=false;
        paint();
      },100);
      if(!reduced){progress=0;playing=true;paint();}
      const answers={
        data:'Did the data mix change, or did damaged files, corrupted text or incorrect token IDs enter the pipeline? Inspect the actual batches and compare with known-good data. Harder text can also raise loss without a broken model.',
        gradients:'Did gradient magnitudes spike or become non-finite? Check how signals are scaled through the model. Insufficient normalization can allow unstable values; gradient clipping limits large updates but is not the same as normalization.',
        software:'Could a code change or an incorrect implementation affect attention masks, loss calculation or updates? Compare versions and reproduce a small case against a trusted implementation before blaming the hardware.',
        hardware:'Do GPU, memory or network diagnostics show errors? Check whether trouble follows a particular node and test or exclude it. Hardware faults often stop a job, but a loss curve alone cannot prove or rule out a fault.',
        changes:'What changed near the reversal: learning rate, precision, code, or a resumed checkpoint? Align the logs before attributing a cause.'
      };
      document.querySelectorAll('[data-check]').forEach(b=>{b.onclick=()=>{
        document.querySelectorAll('[data-check]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
        $('#incident-answer').textContent=answers[b.dataset.check];
        $('#incident-answer').hidden=false;
      };});
    }
    /* Counts tokens against the measured rate for as long as the page is
       open. An estimate, and the figure says so; it stops counting while the
       tab is hidden rather than pretending to have watched. */
    const ticker = $('#token-ticker');
    if (ticker) {
      const m = snapshot.m32, rate = m.tokensPerStep / m.secPerStep;
      if (Number.isFinite(rate) && rate > 0) {
        let counted = 0, since = performance.now();
        const paint = () => {
          const now = performance.now();
          if (!document.hidden) counted += (now - since) / 1000 * rate;
          since = now;
          ticker.textContent = new Intl.NumberFormat('en-GB').format(Math.round(counted));
        };
        paint(); tickerTimer = setInterval(paint, 1000);
      }
    }
    icons();draw();
  }
  function menu(open) { $('#chapters').hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));if(open)$('#chapter-list button.active').focus(); }
  function go(next) {
    if(next<0||next>=chapters.length)return;
    window.scrollTo({top:0,behavior:'instant'});
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
  const mapProjection=d3.geoConicConformal().parallels([40,65]).rotate([-15,0]).center([0,54]);
  let projectionKey='';
  let mapFrame=[0,0,0,0];
  function fitMap(){
    const mobile=width<700, overview=document.body.classList.contains('overview')||!!flight;
    const key=`${width}:${height}:${overview}:${!!mapData}`;
    if(key===projectionKey)return;
    projectionKey=key;
    /* Desktop: fill the map column, whatever width the CSS split gave it. */
    const column=document.getElementById('scene').getBoundingClientRect().left;
    const mapWidth=mobile?width*.88:overview?Math.min(width*.68,900):Math.max(width*.34,column-64);
    const top=mobile?210:overview?125:Math.min(370,height*.40);
    const bottom=Math.max(top+120,height-105);
    const left=mobile||overview?(width-mapWidth)/2:32;
    mapFrame=[left,top,mapWidth,bottom-top];
    // Fit projected vertices with one uniform scale; never stretch either axis.
    const coordinates=mapData?mapData.features.filter(f=>!f.properties.context).flatMap(f=>f.geometry.coordinates.flat(2)):[[-10,36],[35,35],[30,71],[-10,60]];
    mapProjection.fitExtent([[left,top],[left+mapWidth,bottom]],{type:'MultiPoint',coordinates});
  }
  function project(lon,lat){return mapProjection([lon,lat]);}
  function route(a,b,t=1){
    const p=project(places[a].lon,places[a].lat),q=project(places[b].lon,places[b].lat);
    const mid=[(p[0]+q[0])/2-40,(p[1]+q[1])/2-35];
    const point=u=>[(1-u)*(1-u)*p[0]+2*(1-u)*u*mid[0]+u*u*q[0],(1-u)*(1-u)*p[1]+2*(1-u)*u*mid[1]+u*u*q[1]];
    ctx.beginPath();ctx.moveTo(...p);for(let k=1;k<=60;k++)ctx.lineTo(...point(t*k/60));ctx.stroke();return point(t);
  }
  function draw(){
    if(!width)return;ctx.clearRect(0,0,width,height);ctx.fillStyle='#02090f';ctx.fillRect(0,0,width,height);
    fitMap();
    if(mapData){
      ctx.lineWidth=.7;ctx.strokeStyle='#25404f';ctx.fillStyle='#0b1b25';
      mapData.features.forEach(feature=>{
        const geometry=feature.geometry;if(!geometry)return;
        ctx.save();
        if(feature.properties.context){
          const [x,y,w,h]=mapFrame;
          ctx.beginPath();ctx.rect(x,y,Math.min(w+60,width-x-12),h);ctx.clip();
        }
        const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.type==='MultiPolygon'?geometry.coordinates:[];
        polygons.forEach(polygon=>{ctx.beginPath();polygon.forEach(ring=>{ring.forEach((coord,i)=>{const p=project(coord[0],coord[1]);if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p);});ctx.closePath();});ctx.fill('evenodd');ctx.stroke();});
        ctx.restore();
      });
    }
    ctx.setLineDash([3,6]);ctx.strokeStyle='#52768b';ctx.lineWidth=1;
    for(let i=0;i<places.length-1;i++)route(i,i+1);ctx.setLineDash([]);
    if(flight){ctx.strokeStyle='#ef8700';ctx.lineWidth=2;const p=route(flight.from,flight.to,flight.t||0);ctx.fillStyle='#ef8700';ctx.beginPath();ctx.arc(...p,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ef870030';ctx.lineWidth=10;ctx.stroke();}
    document.querySelectorAll('.pin').forEach((pin,i)=>{const p=project(places[i].lon,places[i].lat);pin.style.left=`${p[0]-6}px`;pin.style.top=`${p[1]-6}px`;});
  }
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  places.forEach((p,i)=>{const b=document.createElement('button');b.className='pin';b.title=p.name;b.setAttribute('aria-label',`${p.name}: ${t(chapters[p.chapter].label)}`);b.innerHTML=`<span>${p.name}</span>`;b.onclick=()=>go(p.chapter);$('#pins').append(b);});
  chapters.forEach((c,i)=>{
    const b=document.createElement('button');b.dataset.chapter=i;b.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b><span>${t(c.label)}<small>${['sft','rl'].includes(c.visual)?t(UI.toCome):c.visual==='partners'?t(UI.acrossEurope):`${places[c.place].machine} · ${places[c.place].operator}`}</small></span>`;b.onclick=()=>go(i);$('#chapter-list').append(b);
    const dot=document.createElement('button');dot.dataset.chapter=i;dot.title=t(c.label);dot.setAttribute('aria-label',t(c.label));dot.onclick=()=>go(i);$('#timeline').append(dot);
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
  fetch('assets/europe-countries.geojson?v=20260928-3').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json();}).then(data=>{mapData=data;draw();}).catch(()=>{$('.map-credit').textContent=t(UI.mapUnavailable);});
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
      snapshot={meta:{takenAt:live.meta.takenAt,live:live.meta.live===true},m32:merged,m9:{...snapshot.m9,...live.m9}};
      if(!flight&&['run','monitor','scaling'].includes(chapters[index].visual))render();
    }catch{/* Keep the last valid, timestamped snapshot when the feed is unavailable. */}
  }
  poll();setInterval(poll,900000);
})();
