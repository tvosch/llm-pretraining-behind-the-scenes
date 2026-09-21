/* ==========================================================================
   Journey engine: map, navigation, figures, live feed.

   It holds no copy and no numbers. Copy and figures live in
   journey-content.js (JOURNEY), numbers in data.js (SNAP). If you came here
   to change a sentence or a figure, it is in journey-content.js.
   ========================================================================== */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  const places = JOURNEY.places, chapters = JOURNEY.chapters, partners = JOURNEY.partners;
  const UI = JOURNEY.ui;
  places.forEach((place,i)=>{place.chapter=chapters.findIndex(chapter=>chapter.place===i);});

  const canvas = $('#europe'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0, mapData = null, width = 0, height = 0, flight = null, frame = 0, stageTimer = null, flightTimer = null;
  let snapshot = {meta:{...SNAP.meta}, m32:{...SNAP.m32}, m9:{...SNAP.m9}};

  /* --- text ---------------------------------------------------------------
     A content field is a plain string, or {nl, en} once translated. */
  const lang = 'en';
  const t = value => typeof value === 'string' ? value : value == null ? '' : (value[lang] ?? value.en ?? '');
  const FILLERS = {
    partners: () => partners.length,
    nextYear: () => SNAP.family.nextModelYear ?? '—',
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
    const c=chapters[index], p=places[c.place];
    $('#scene').dataset.chapter=c.visual;
    $('#scene').innerHTML=`<div class="scene-kicker"><span class="number">${String(index+1).padStart(2,'0')}</span>${fill(c.kicker)}</div><h1>${fill(c.title)}</h1><p class="lede">${fill(c.text)}</p><div class="visual">${visual(c.visual)}</div>${sceneNote(c)}`;
    const partnersChapter=c.visual==='partners';
    $('#place').textContent=partnersChapter?t(UI.acrossEurope):p.name;
    $('#machine').textContent=partnersChapter?t(UI.oneCollaboration):p.machine;
    $('#place-detail').textContent=partnersChapter?t(UI.collaborationSub):`${t(UI.operatedBy)} ${p.operator} · ${t(p.country)}`;
    $('#position').textContent=`${String(index+1).padStart(2,'0')} / ${chapters.length}`;
    $('#chapter-name').textContent=t(c.label);
    $('#prev').disabled=index===0;
    $('#next span').textContent=index===chapters.length-1?t(UI.backToStart):chapters[index+1].place!==c.place?t(UI.nextStop):t(UI.continue);
    $('#next').title=index===chapters.length-1?t(UI.backToStart):t(UI.nextChapter);
    $('#next').setAttribute('aria-label',$('#next').title);
    document.querySelectorAll('[data-chapter]').forEach(b=>{const active=+b.dataset.chapter===index;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    document.querySelectorAll('.pin').forEach((b,i)=>b.classList.toggle('active',!partnersChapter&&i===c.place));
    if ($('#clean')) $('#clean').onclick=()=>{const active=$('.visual').classList.toggle('filtered');$('#clean').setAttribute('aria-pressed',String(active));$('#clean span').textContent=active?t(UI.resetSample):t(UI.deduplicate);};
    if ($('#step-toggle')) {
      let phase=0, paused=reduced;
      const button=$('#step-toggle');
      const paintButton=()=>{button.innerHTML=`<i data-lucide="${paused?'play':'pause'}"></i>`;button.setAttribute('aria-pressed',String(paused));button.title=paused?t(UI.resumeFigure):t(UI.pauseFigure);button.setAttribute('aria-label',button.title);icons();};
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
  fetch('assets/europe-countries.geojson').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json();}).then(data=>{mapData=data;draw();}).catch(()=>{$('.map-credit').textContent=t(UI.mapUnavailable);});
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
