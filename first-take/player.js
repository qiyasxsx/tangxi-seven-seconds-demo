/* First-take player. All scene positions are in the original painting. */
(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  function boot() {
    const story = window.FIRST_TAKE, art = window.TAKE_ART;
    const stage = byId("stage"), world = byId("world"), plate = byId("plate"), pins = byId("pins");
    const speech = byId("bubble"), overlay = byId("overlay"), status = byId("status");
    const scene = byId("scene") || world.parentElement, scenery=byId("scenery");
    const saveKey = "tangxi-opening-first-take-v1", prefKey = saveKey + "-settings";
    const storage = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
    const store = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } };
    const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
    const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
    const images = new Map(), sounds = window.passageSound;
    if (!story?.places?.[story.start] || !art?.plates) {
      status.hidden = false; status.textContent = "序章场记未载入。";
      const retry = document.createElement("button"); retry.textContent = "重新读取";
      retry.onclick = () => location.reload(); status.append(retry); return;
    }
    const fresh = () => ({version:1,scriptRevision:3,quietVisit:false,place:story.start,seen:{},inspected:{},flags:{},answers:{},usedReplies:{},faces:{},sounded:{},log:[],read:null,end:false});
    let state = fresh(), mode = "title", epoch = 0, view = 0, loading = false, menuFrom = null, autoTimer;
    const prefs = Object.assign({mute:false,reduce:matchMedia("(prefers-reduced-motion:reduce)").matches,big:false,auto:false},storage(prefKey));
    const roles = {林雨:"lin",阿琴:"qin",老许:"xu"};
    const basePose = {lin:"linNeutral",qin:"qinStanding",xu:"xuStanding"};
    const faceHeight = asset => asset.faceHeight || .36;
    function evidence(insert="",liveCue=false) {
      return window.TAKE_EVIDENCE?.show(state.place,insert,state.read?.key || "",state.read?.i || 0,liveCue);
    }
    const zoneIds = new Set(["road","outside","hall","room","shop"]);
    let activePlate = "", pendingRetry = null, surveyAnchor = null, panFrame = 0;
    let shotAnchor=null, shotFrame=0;
    // A lateral camera travel projects each stationary plane inversely to
    // its distance. Distances agree with the established over-shoulder sizes.
    const depth={wall:5,resident:2.8,near:1.58};
    let truck=0,truckTarget=0,travelFrame=0,finishTravel=null,pendingTravel=null;
    function projectCamera(value) {
      truck=value;
      const travel=value*Math.max(0,(scenery.clientWidth-world.clientWidth)/2)*.84;
      for(const [plane,distance] of Object.entries(depth))
        stage.style.setProperty("--camera-"+plane,(travel*depth.wall/distance).toFixed(3)+"px");
    }
    function trackTo(target,instant=false) {
      if (prefs.reduce) target=0;
      if (!instant && travelFrame && truckTarget===target) return pendingTravel;
      cancelAnimationFrame(travelFrame);travelFrame=0;finishTravel?.();finishTravel=null;
      delete stage.dataset.tracking;truckTarget=target;
      if(instant || prefs.reduce || Math.abs(truck-target)<.001) {
        projectCamera(target);return Promise.resolve();
      }
      const start=truck,duration=540+155*Math.abs(target-start);
      let last=performance.now(),elapsed=0;
      stage.dataset.tracking="true";
      pendingTravel=new Promise(resolve=>{finishTravel=resolve;});
      function move(now) {
        if (!document.hidden && !overlay.open) elapsed+=Math.min(64,now-last);
        last=now;
        const t=clamp(elapsed/duration,0,1);
        projectCamera(start+(target-start)*t*t*(3-2*t));arrangePins();
        if(t<1)travelFrame=requestAnimationFrame(move);
        else {travelFrame=0;delete stage.dataset.tracking;finishTravel();finishTravel=null;}
      }
      travelFrame=requestAnimationFrame(move);return pendingTravel;
    }
    const entrance = window.TAKE_ENTRANCE.create({stage,world,art,getImage,project,drawPlate,
      isCurrent:ticket=>ticket===epoch, reduced:()=>prefs.reduce, playSound:cue=>sounds?.play(cue),
      headroom:()=>parseFloat(getComputedStyle(byId("cast")).paddingTop) || 0});
    function valid(s) {
      return s?.version===1 && !!story.places[s.place] && s.seen && s.flags && s.faces &&
        s.answers && Array.isArray(s.log);
    }
    function recover(saved) {
      if (!valid(saved)) return null;
      const read=saved.read;
      if (read) {
        const rows=story.beats[read.key]?.lines;
        if (!rows?.length) saved.read=null;
        else if (saved.scriptRevision!==3 || !Number.isInteger(read.i) || !rows[read.i]) {
          // The old line number may now identify a later sentence. Its text
          // in the reader's journal survives shortening of the script.
          const last=saved.log.at(-1), same=row=>last && row.text===last.text && (row.who || "旁白")===last.who;
          if (!rows[read.i] || !same(rows[read.i])) read.i=Math.max(0,rows.findIndex(same));
        }
      }
      if (!saved.inspected) {
        saved.inspected = {};
        for (const [place,location] of Object.entries(story.places)) {
          for (const act of location.inspect.filter(a=>a.once && a.key!==read?.key)) {
            const last = story.beats[act.key].lines.at(-1);
            const legacyArch="旧厂烟囱就在晾衣杆后面。巷里一块「宵」字灯牌，和投稿里的一样。";
            if (saved.log.some(entry=>entry.place===place && (entry.text===last.text || act.key==="readArch" && entry.text===legacyArch)))
              saved.inspected[act.key]=true;
          }
        }
      }
      if (saved.inspected.readArch) saved.flags.archLooked=true;
      for (const [place,completed] of [["shop","doorsCompared"],["hall","stairsAdmitted"],["corridor","hasRoomKey"]]) {
        if (saved.flags[completed]) saved.seen[place]=true;
      }
      if (typeof saved.quietVisit!=="boolean") saved.quietVisit=!read && (
        (saved.place==="shop" && !!saved.flags.doorsCompared) || (saved.place==="hall" && !!saved.flags.stairsAdmitted) ||
        (["stairs","corridor"].includes(saved.place) && !!saved.flags.hasRoomKey));
      // Older pose caches recorded who once stood in a room. Presence now
      // follows the current visit and the resident's actual departure.
      if (saved.scriptRevision!==3) {
        saved.faces={};
        saved.log=saved.log.filter(entry=>Object.values(story.beats).some(b=>b.lines.some(r=>(r.who || "旁白")===entry.who && r.text===entry.text)));
        if (saved.read) {
          const r=story.beats[saved.read.key].lines[saved.read.i];
          if (saved.log.at(-1)?.text!==r.text) saved.log.push({who:r.who || "旁白",text:r.text,place:saved.place});
        }
      }
      // Older checkpoints kept successful outcomes, but a mistaken inference
      // only survives in the journal. Its first reply is unique to that branch.
      if (!saved.usedReplies) {
        saved.usedReplies={};
        for (const reply of Object.values(saved.answers)) saved.usedReplies[reply]=true;
        for (const beat of Object.values(story.beats)) for (const c of beat.choices || []) {
          const first=story.beats[c.key].lines[0];
          if (read?.key===c.key || saved.log.some(row=>row.text===first.text && row.who===(first.who || "旁白")))
            saved.usedReplies[c.key]=true;
        }
      }
      saved.scriptRevision=3; return saved;
    }
    function checkpoint() {
      if (store(saveKey,state)) stage.dataset.saved = "local";
      else {
        if (stage.dataset.saved!=="session") announce("当前浏览器只保留本次阅读进度。");
        stage.dataset.saved = "session";
      }
    }
    function setMode(next) {
      const previous=mode;
      if (next!=="read") { trackTo(0,next!=="explore"); delete stage.dataset.lens; delete stage.dataset.lookAt; delete stage.dataset.matched; }
      mode = next; stage.dataset.mode = next; stage.dataset.place = state.place; stage.dataset.decision = "false";
      byId("title").hidden = next !== "title"; byId("ending").hidden = next !== "end";
      byId("reader").hidden = !["read","explore"].includes(next);
      byId("menu").hidden = next === "title"; byId("menu").disabled = next === "moving";
      byId("chapter").hidden = byId("objective").hidden = next === "title";
      if (next !== "read") speech.hidden = true;
      byId("choices").hidden = true;
      byId("lookControls").hidden = next !== "explore";
      if (next!=="explore") { cancelAnimationFrame(panFrame); delete stage.dataset.turning; }
      if (next!==previous) {
        cancelAnimationFrame(shotFrame); shotAnchor=null; delete stage.dataset.reframing;
        if (surveyAnchor && ((previous==="explore" && next==="read") || (previous==="read" && next==="explore")))
          reframeFromSurvey();
      }
      if (next==="read") framePainting();
      byId("cast").style.removeProperty("--caption-headroom");
      clearTimeout(autoTimer);
    }
    function announce(text) {
      status.replaceChildren(); status.textContent = text;
      status.hidden = !text;
    }
    function objective() { return story.objective?.(state) || story.places[state.place].name; }
    function setZone() {
      const p = story.places[state.place];
      const zone = zoneIds.has(p.cue) ? p.cue :
        ({stop:"road",shop:"shop",building:"outside",room:"room"})[state.place] || "hall";
      sounds?.zone(zone);
    }
    function getImage(file) {
      if (!images.has(file)) {
        const i = new Image(); i.decoding = "async";
        const ready = new Promise((resolve,reject) => {
          i.onload = () => resolve(i); i.onerror = () => { images.delete(file); reject(new Error(file)); };
        });
        images.set(file,ready); i.src = file;
      }
      return images.get(file);
    }
    function anchor(asset) {
      return Array.isArray(asset?.anchor) ? asset.anchor : [Number(asset?.anchor) || .5,.5];
    }
    function surveyFraming() {
      return mode==="explore" || (mode==="read" && story.places[state.place].inspect.some(a=>a.once && a.key===state.read?.key));
    }
    function plateAnchor(id,img,useSurvey=surveyFraming()) {
      const a=anchor(art.plates[id]), width=world.clientWidth, height=world.clientHeight;
      if (useSurvey && surveyAnchor && id===activePlate) return surveyAnchor;
      const jamb=window.TAKE_ENTRANCE.edges[id];
      if (jamb==null || !width || !img?.naturalWidth || width/height>=1.12) return a;
      const plane=scenery.clientWidth,margin=(plane-width)/2;
      const paintedWidth=img.naturalWidth*Math.max(plane/img.naturalWidth,height/img.naturalHeight);
      if (paintedWidth<=plane) return a;
      // On a phone, the portrait crop must include both the leaf and the
      // person behind it. Use this same crop for pins, marks and close-ups.
      const toSeeJamb=(jamb*paintedWidth-width*.84-margin)/(paintedWidth-plane);
      return [clamp(Math.max(a[0],toSeeJamb),0,1),a[1]];
    }
    // Match object-fit: cover and the CSS object-position used for this plate.
    // The same source point drives both its hit target and the approaching lens.
    function project(x,y) {
      const w=scenery.clientWidth,h=world.clientHeight,iw=plate.naturalWidth || 16,ih=plate.naturalHeight || 9;
      const z=Math.max(w/iw,h/ih),ax=shotAnchor || plateAnchor(activePlate,plate);
      const margin=(w-world.clientWidth)/2;
      return [(w-iw*z)*ax[0]+x*iw*z-margin+truck*margin*.84,(h-ih*z)*ax[1]+y*ih*z];
    }
    function crop() {
      const w=scenery.clientWidth,h=world.clientHeight,iw=plate.naturalWidth || 16,ih=plate.naturalHeight || 9;
      const scale=Math.max(w/iw,h/ih),horizontal=iw*scale-w>ih*scale-h;
      return {axis:horizontal?0:1,extent:horizontal?world.clientWidth:h,span:horizontal?w:h,painted:horizontal?iw*scale:ih*scale};
    }
    function pinPosition(pin) {
      if (pin.dataset.anchor==="hand") {
        const img=byId("leftActor").querySelector("img[data-pose]");
        if (img?.naturalWidth) {
          const rect=img.getBoundingClientRect(), frame=pins.getBoundingClientRect();
          const [x,y]=art.poses[img.dataset.pose].remote || [.13,.64];
          return [rect.left+rect.width*x-frame.left,rect.top+rect.height*y-frame.top];
        }
      }
      return project(Number(pin.dataset.x),Number(pin.dataset.y));
    }
    function arrangePins() {
      if (mode!=="explore") return;
      const area=crop(), sides=[false,false];
      const w=pins.clientWidth;
      for (const pin of pins.children) {
        const pos=pinPosition(pin), at=pos[area.axis];
        const off=at<8 ? -1 : at>area.extent-8 ? 1 : 0;
        pin.hidden=!!off; pin.dataset.offscreen=String(off);
        if (off) { sides[off<0?0:1]=true; continue; }
        pin.style.left=pos[0]+"px"; pin.style.top=pos[1]+"px";
        pin.dataset.labelSide=pos[0] > w*.56 ? "left" : "right";
      }
      const controls=byId("lookControls"); controls.dataset.axis=area.axis===0?"x":"y";
      for (const [i,button] of [...controls.children].entries()) {
        button.hidden=!sides[i];
        button.setAttribute("aria-label",(area.axis===0?["向左看","向右看"]:["向上看","向下看"])[i]);
      }
    }
    function reframeFromSurvey(duration=550) {
      if (prefs.reduce || !plate.naturalWidth) return;
      const from=plate.style.objectPosition.split(" ").map(v=>parseFloat(v)/100);
      const target=plateAnchor(activePlate,plate);
      if (from.length!==2 || from.some(v=>!Number.isFinite(v)) ||
          from.every((v,i)=>Math.abs(v-target[i])<.00005)) return;
      shotAnchor=from; stage.dataset.reframing="true";
      const start=performance.now();
      function tick(now) {
        const t=clamp((now-start)/duration,0,1),ease=t*t*(3-2*t);
        shotAnchor=t<1 ? from.map((v,i)=>v+(target[i]-v)*ease) : null;
        framePainting(); arrangePins();
        if (t<1) shotFrame=requestAnimationFrame(tick);
        else { delete stage.dataset.reframing; placeSpeech(); }
      }
      shotFrame=requestAnimationFrame(tick);
    }
    function framePainting() {
      if (!activePlate || !plate.naturalWidth) return;
      const [x,y]=shotAnchor || plateAnchor(activePlate,plate), position=(x*100)+"% "+(y*100)+"%";
      if (plate.style.objectPosition!==position) {
        plate.style.objectPosition=position;
        world.dispatchEvent(new Event("take-framing"));
      }
      const cast=byId("cast");
      if (shotAnchor || surveyFraming() && surveyAnchor) {
        const [bx,by]=plateAnchor(activePlate,plate,false), area=crop();
        const delta=(area.span-area.painted)*(area.axis===0 ? x-bx : y-by);
        cast.style.setProperty("--survey-x",(area.axis===0 ? delta : 0)+"px");
        cast.style.setProperty("--survey-y",(area.axis===1 ? delta : 0)+"px");
      } else {
        cast.style.removeProperty("--survey-x"); cast.style.removeProperty("--survey-y");
      }
    }
    function look(direction) {
      if (mode!=="explore" || overlay.open) return;
      const area=crop();
      const candidates=[...pins.children].filter(p=>Number(p.dataset.offscreen)===direction);
      if (!candidates.length || area.painted<=area.span) return;
      const coordinates=candidates.map(p=>pinPosition(p)[area.axis]);
      const target=direction>0?Math.min(...coordinates):Math.max(...coordinates);
      const from=plateAnchor(activePlate,plate), to=clamp(from[area.axis]+(target-area.extent/2)/(area.painted-area.span),0,1);
      const start=performance.now();
      cancelAnimationFrame(panFrame);
      stage.dataset.turning="true";
      function turn(now) {
        if (mode!=="explore") return;
        const t=prefs.reduce?1:clamp((now-start)/340,0,1), ease=t*t*(3-2*t);
        surveyAnchor=from.slice(); surveyAnchor[area.axis]=from[area.axis]+(to-from[area.axis])*ease;
        framePainting(); arrangePins();
        if (t<1) panFrame=requestAnimationFrame(turn);
        else {
          delete stage.dataset.turning;
          if (document.activeElement===document.body || document.activeElement.closest("#lookControls"))
            candidates.find(pin=>!pin.hidden)?.focus({preventScroll:true});
        }
      }
      turn(start);
    }
    function makeButton(host,text,fn,cls="command") {
      const b = document.createElement("button"); b.type = "button"; b.className = cls;
      b.textContent = text; b.setAttribute("aria-label",text); b.onclick = fn; host.append(b); return b;
    }
    function drawPlate(place,img) {
      if (activePlate !== story.places[place].plate) surveyAnchor=null;
      activePlate = story.places[place].plate; const [x,y] = plateAnchor(activePlate,img);
      plate.style.objectFit = "cover"; plate.style.objectPosition = (x*100)+"% "+(y*100)+"%";
      plate.src = img.src; plate.alt = story.places[place].name; plate.hidden = false;
    }
    async function loadPlace(place,ticket,firstView=false) {
      const closedShop = firstView && place==="shop" && !state.seen.shop && art.plates.shopClosed;
      const a = closedShop || art.plates[story.places[place].plate];
      if (!a?.file) { announce("缺少地点画面："+story.places[place].name); return null; }
      for (;;) {
        try {
          const img = await getImage(a.file);
          if (ticket !== epoch) return null;
          announce(""); return img;
        } catch {
          if (ticket !== epoch) return null;
          announce(story.places[place].name+"的画面未载入。");
          await new Promise(resolve => {
            pendingRetry = resolve; makeButton(status,"重新读取画面",resolve); makeButton(status,"返回标题",title);
          });
          pendingRetry = null;
          if (ticket !== epoch) return null;
        }
      }
    }
    function stepEpoch() {
      epoch++; view++; pendingRetry?.(); pendingRetry = null; clearTimeout(autoTimer); return epoch;
    }
    function wants(flags,keys) {
      return !keys || (Array.isArray(keys)?keys:[keys]).every(k => !!flags[k]);
    }
    function omit(action) {
      return action.unless && (Array.isArray(action.unless)?action.unless:[action.unless]).some(k => !!state.flags[k]);
    }
    function applyFlag(beat) {
      if (!beat.flag) return;
      for (const key of Array.isArray(beat.flag) ? beat.flag : [beat.flag]) state.flags[key] = true;
    }
    function rememberLine() {
      const row = story.beats[state.read.key].lines[state.read.i];
      state.log.push({who:row.who || "旁白",text:row.text,place:state.place});
      if (state.log.length>400) state.log.shift();
    }
    function poseOwner(pose) { return /^(lin|qin|xu)/.exec(pose || "")?.[1]; }
    function resident() {
      if (state.place==="shop" && !state.flags.doorsCompared) return "qin";
      if (state.place==="hall" && !state.flags.stairsAdmitted && !state.flags.hasRoomKey) return "xu";
      if (state.place==="corridor" && state.flags.stairsAdmitted && !state.flags.hasRoomKey) return "xu";
      return null;
    }
    function faces() {
      const here=state.faces[state.place] ||= {};
      here.left ||= "linListen";
      const owner=resident();
      if (!owner) delete here.right;
      else if (poseOwner(here.right)!==owner) here.right=basePose[owner];
      return here;
    }
    function rememberCast(row) {
      const here = faces(), speaker = roles[row.who], owner = poseOwner(row.pose) || speaker;
      if (here.left && (speaker==="qin" || speaker==="xu" || row.who==="阿岑" || row.who==="手机" || row.who==="旧视频" || row.insert==="clip")) here.left="linListen";
      if (here.right && (speaker==="lin" || row.who==="阿岑")) {
        here.right=basePose[poseOwner(here.right)];
      }
      if (owner) {
        const slot = owner === "lin" ? "left" : "right";
        if (!here[slot] || poseOwner(here[slot]) !== owner) here[slot] = basePose[owner];
        if (row.pose && art.poses?.[row.pose]) here[slot] = row.pose;
      }
    }
    const fromBehind = new Set(["shop","hall","stairs","corridor"]);
    function filmedPose(pose) {
      const owner=poseOwner(pose);
      if (owner==="qin" || owner==="xu") return owner+"Standing";
      if (owner!=="lin") return null;
      const b=state.read, directlyToCamera=b && story.beats[b.key].lines[b.i].toCamera;
      return fromBehind.has(state.place) && !directlyToCamera ? "linBackListen" : "linFrontListen";
    }
    function firstMeetingFrame() {
      return mode==="read" && state.read?.i===0 && ["atShutter","meetXu"].includes(state.read.key);
    }
    function actorSize(slot,img) {
      if (img.dataset.distance==="door") return;
      const a = art.poses[img.dataset.pose], area = world.getBoundingClientRect(), box = slot.getBoundingClientRect();
      if (!a || !area.width || !img.naturalWidth) return;
      const [hx,hy] = a.head || [.5,.006], left = slot === byId("leftActor");
      const narrow = area.width/area.height < 1.12, reverse = fromBehind.has(state.place);
      const face = faceHeight(a);
      const measuredEye = a.eye || [hx,hy+(a.eyeFraction || .46)*face];
      const shoulder=left && reverse && img.dataset.pose.startsWith("linBack");
      const eyeY = left ? (shoulder ? .325 : .352) : .373;
      const head = left ? (shoulder ? .395 : .319) : .222;
      const h = head / face * area.height, w = h*img.naturalWidth/img.naturalHeight;
      const x = left ? (reverse ? (narrow ? .135 : .217) : (narrow ? .405 : .427)) : (narrow ? .745 : .708);
      // The eye line sets the cut. The foreground shoulder can continue
      // below the picture; the resident has their own distance from the lens.
      Object.assign(img.closest(".actorRig").style,{width:w+"px",height:h+"px",
        left:(area.left-box.left+x*area.width-measuredEye[0]*w)+"px",top:(area.top-box.top+eyeY*area.height-measuredEye[1]*h)+"px",
        right:"auto",bottom:"auto"});
      slot.style.clipPath = "inset(0 0 "+Math.max(0,box.bottom-area.bottom)+"px 0)";
    }
    function heldExpression(side) {
      if (mode!=="read" || !state.read) return "rest";
      const beat=story.beats[state.read.key];
      for(let i=state.read.i;i>=0;i--) {
        const row=beat.lines[i],speaker=roles[row.who];
        if(side==="left" && row.reaction)return row.reaction;
        if(speaker && (speaker==="lin"?"left":"right")===side)return row.expression || "rest";
      }
      return "rest";
    }
    async function showActor(side,storedPose,revision) {
      const slot = byId(side === "left" ? "leftActor":"rightActor");
      const waitingHost=storedPose && side==="left" && mode==="explore" && state.place==="stop" && !state.flags.clipRead;
      const pose = waitingHost ? "linFrontListen" : filmedPose(storedPose);
      if (!pose) { slot.replaceChildren(); slot.hidden = true; return; }
      const current = slot.querySelector("img[data-pose]");
      if (current?.dataset.pose === pose && current.dataset.distance!=="door") { actorSize(slot,current); return; }
      const a = art.poses?.[pose];
      if (!a) { slot.replaceChildren(); slot.hidden = true; return; }
      let loaded;
      try { loaded = await getImage(a.file); } catch { if (revision===view) { slot.replaceChildren(); slot.hidden=true; } return; }
      if (revision!==view) return;
      const img = loaded.cloneNode(); img.dataset.pose = pose; img.dataset.distance = side==="left"?"near":"partner";
      img.alt = ({lin:"林雨",qin:"阿琴",xu:"老许"})[poseOwner(pose)] || "";
      img.style.position = "absolute"; img.style.pointerEvents = "none";
      img.onload = () => { if (img.isConnected) { actorSize(slot,img); placeSpeech(); } };
      await img.decode().catch(()=>{});
      if (revision!==view) return;
      const entranceActive=stage.hasAttribute("data-entrance-phase");
      const rig=window.TAKE_PERFORMANCE.mount(img);rig.dataset.expression=heldExpression(side);
      if (current && !prefs.reduce) {
        await current.closest(".actorRig").animate([{opacity:1},{opacity:0}],{duration:155,fill:"forwards"}).finished.catch(()=>{});
        if (revision!==view) return;
      }
      slot.hidden=false; slot.replaceChildren(rig); actorSize(slot,img); arrangePins();
      if (!prefs.reduce && !entranceActive) {
        const fade=rig.animate([{opacity:0},{opacity:1}],{duration:current ? 240 : 550,easing:"ease-in-out"});
        await fade.finished.catch(()=>{});
      }
    }
    function clearCast() {
      entrance.clear();
      for (const id of ["leftActor","rightActor"]) {
        const slot=byId(id); slot.replaceChildren(); slot.hidden=true;
      }
    }
    async function showInsert(name,revision) {
      const target = byId("insert"), a = name && art.inserts?.[name];
      if (!a) { target.hidden = true; target.dataset.art = ""; stage.dataset.insert = "false"; return false; }
      try {
        const img = await getImage(a.file); if (revision!==view) return false;
        const [x,y] = anchor(a);
        target.style.objectPosition = (x*100)+"% "+(y*100)+"%"; target.src = img.src;
        target.alt = a.label || a.alt || ""; target.dataset.art = name; target.hidden = false; stage.dataset.insert = "true"; return true;
      } catch {
        if (revision===view) { target.hidden = true; target.dataset.art = ""; stage.dataset.insert = "false"; }
        return false;
      }
    }
    function headOf(side) {
      const img = byId(side==="left"?"leftActor":"rightActor").querySelector("img[data-pose]");
      if (!img) return null;
      const a = art.poses[img.dataset.pose], bounds = img.getBoundingClientRect(), head = a.head || [.5,.06];
      const height = bounds.height*faceHeight(a);
      const x=a.eye ? bounds.left+a.eye[0]*bounds.width : bounds.left+head[0]*bounds.width;
      const eye=a.eye ? bounds.top+a.eye[1]*bounds.height : bounds.top+head[1]*bounds.height+height*.46;
      return {x,eye,top:bounds.top+head[1]*bounds.height,h:height};
    }
    function placeSpeech() {
      if (speech.hidden) return;
      const frame = world.getBoundingClientRect(), root = stage.getBoundingClientRect();
      if (!frame.width || !frame.height) return;
      const pad = Math.max(10, Math.min(25, frame.width * .021));
      const left = frame.left + pad, right = frame.right - pad, top = frame.top + pad;
      const cast = byId("cast");
      cast.style.removeProperty("--caption-headroom");
      const head = speech.dataset.source === "head" && headOf(speech.dataset.side);
      const anchor = head || {x:left, eye:frame.top+frame.height*.27};
      const listener = head && headOf(speech.dataset.side==="right" ? "left" : "right");
      const obstacles = [];
      for (const img of cast.querySelectorAll("img")) {
        const bounds = img.getBoundingClientRect(), bands = art.silhouettes[img.dataset.pose];
        if (!bands) { obstacles.push(bounds); continue; }
        const step = bounds.height / (bands.length / 2);
        for (let i=0; i<bands.length; i+=2) {
          if (bands[i] >= bands[i+1]) continue;
          const y = bounds.top + i/2*step;
          obstacles.push({left:bounds.left+bounds.width*bands[i]/100, right:bounds.left+bounds.width*bands[i+1]/100,
            top:y, bottom:Math.min(frame.bottom,y+step)});
        }
      }
      const controls = [byId("menu"), byId("choices")].filter(el=>!el.hidden).map(el=>el.getBoundingClientRect());
      obstacles.push(...controls);
      obstacles.sort((a,b)=>a.left-b.left);
      const size = parseFloat(getComputedStyle(speech).fontSize);
      const usable = right-left;
      const natural = Math.min(usable, Math.max(6,byId("bubbleWords").textContent.length)*size+4);
      const widths = [...new Set([Math.min(natural,size*16),Math.min(natural,size*12),Math.min(natural,size*9),Math.min(natural,byId("menu").getBoundingClientRect().left-pad-left),natural].filter(w=>w>0).map(Math.floor))];
      let best;
      for (const width of widths) {
        speech.style.width = width+"px";
        const height = speech.offsetHeight, maxY = Math.min(frame.bottom-height-pad,anchor.eye+size);
        for (let y=top; y<=maxY; y+=8) {
          const intervals = obstacles.filter(b=>b.bottom+8>y && b.top-8<y+height);
          let start = left;
          // Subtract all occupied intervals from this horizontal band.
          for (const b of [...intervals,{left:right+8,right}]) {
            const end = Math.min(right,b.left-8);
            if (end-start >= width) {
              const x = clamp(anchor.x-width*.5,start,end-width);
              const dx = Math.max(x-anchor.x,anchor.x-x-width,0);
              const dy = Math.max(y-anchor.eye,anchor.eye-y-height,0);
              const overListener = listener ? Math.max(0,Math.min(x+width,listener.x+listener.h*.32)-Math.max(x,listener.x-listener.h*.32)) : 0;
              const cost = Math.hypot(dx,dy) + .35*Math.abs(x+width/2-anchor.x) +
                .10*Math.abs(y+height/2-anchor.eye) + .27*height + .8*overListener;
              if (!best || cost<best.cost) best = {x,y,width,cost};
            }
            start = Math.max(start,b.right+8);
            if (start>=right) break;
          }
        }
      }
      if (!best) {
        // For a short viewport or large type, create real headroom in the shot.
        // Keep both actors on the same baseline and keep the menu accessible.
        const end = Math.min(right,byId("menu").getBoundingClientRect().left-8);
        const width = Math.max(1,Math.min(natural,end-left));
        speech.style.width = width+"px";
        const crown = Math.min(...Array.from(cast.querySelectorAll("img"),img=>img.getBoundingClientRect().top));
        cast.style.setProperty("--caption-headroom",Math.max(0,top+speech.offsetHeight+10-crown)+"px");
        best = {x:clamp(anchor.x-width/2,left,end-width),y:top,width};
      }
      speech.style.width = best.width+"px";
      speech.style.left = (best.x-root.left)+"px";
      speech.style.top = (best.y-root.top)+"px";
    }
    function layout() {
      projectCamera(truck);framePainting();
      entrance.layout();
      for (const id of ["leftActor","rightActor"]) {
        const slot=byId(id);const img=slot.querySelector("img[data-pose]");if(img)actorSize(slot,img);
      }
      arrangePins(); placeSpeech();
    }
    function updateHeader() {
      byId("chapter").textContent = story.places[state.place].name;
      byId("objective").textContent = objective();
    }
    function schedule() {
      clearTimeout(autoTimer);
      const read = state.read;
      if (!prefs.auto || mode!=="read" || loading || !read || overlay.open || document.hidden || stage.dataset.decision==="true") return;
      if (window.TAKE_EVIDENCE?.holdsReading?.()) return;
      const beat = story.beats[read.key];
      const text = beat.lines[read.i].text;
      const playsOriginal=read.key==="sevenSeconds" && beat.lines[read.i].insert==="clip";
      const filmDwell=window.TAKE_EVIDENCE?.holdsReading ? 850 : 7400;
      const dwell=playsOriginal ? filmDwell : clamp(1100+text.length*97,2500,8000);
      autoTimer = setTimeout(() => {
        if (!window.TAKE_EVIDENCE?.holdsReading?.() && !overlay.open && stage.dataset.decision!=="true") advance();
      },dwell);
    }
    function setSpeech(row,insert,deviceOwnsText=false) {
      const focus = roles[row.who] || (row.who==="阿岑"?"camera":"world");
      const device = row.who==="手机" || row.who==="旧视频";
      const side = focus==="lin" ? "left":"right";
      const source = insert ? null : focus==="camera" ? "camera" : device ? "device" : focus==="world" || !headOf(side) ? null : "head";
      stage.dataset.focus = focus; stage.dataset.speech = String(!!source && !deviceOwnsText);
      byId("who").textContent = row.who || "旁白"; byId("line").textContent = row.text;
      byId("who").hidden = byId("line").hidden = !!source || deviceOwnsText;
      speech.hidden = !source || deviceOwnsText;
      if (source) {
        byId("bubbleName").textContent = focus==="camera"?"阿岑 · 机后":row.who;
        const words = byId("bubbleWords");
        words.replaceChildren();
        for (const [i,part] of row.text.split(/(林雨|阿岑|阿琴|老许|棠西村|今宵便利|《夜访》)/).entries()) {
          if (i%2===0) words.append(part);
          else { const name=document.createElement("span"); name.textContent=part; words.append(name); }
        }
        speech.dataset.source = source; speech.dataset.side = side;
        speech.setAttribute("aria-label",row.who+"："+row.text+"　继续");
      }
    }
    function remainingReplies(beat) {
      return (beat.choices || []).filter(c=>!omit(c) && !state.usedReplies[c.key]);
    }
    async function readRow({effect=false,restore=false}={}) {
      const revision = ++view, beat = story.beats[state.read.key], row = beat.lines[state.read.i];
      const offered = remainingReplies(beat);
      const choice=offered.length>0 && state.read.i===beat.lines.length-1 && !state.answers[state.read.key];
      const canChoose = choice && offered.some(c=>wants(state.flags,c.need));
      setMode("read"); stage.dataset.shot = "conversation"; loading = true; stage.dataset.arriving = "true";
      stage.dataset.beat = state.read.key; stage.dataset.line = String(state.read.i);
      stage.dataset.matched=String(firstMeetingFrame());
      if (byId("insert").dataset.art && byId("insert").dataset.art !== row.insert) evidence();
      speech.hidden = true; byId("who").hidden = byId("line").hidden = byId("next").hidden = true;
      byId("choices").replaceChildren(); pins.replaceChildren(); byId("objective").hidden = true; updateHeader();
      const slot=roles[row.who]==="lin"?"left":roles[row.who]?"right":null;
      const previousLook=stage.dataset.lookAt;
      const hasPeople=!row.insert && !row.departure && (slot || stage.dataset.lens==="people" || state.read.i===0 && (row.pose || resident()));
      stage.dataset.lens=hasPeople?"people":"field";
      const look=slot || (hasPeople?previousLook || (resident()?"right":"left"):"wide");
      stage.dataset.lookAt=look;
      if (effect && row.cue) {
        const marker = state.read.key+"/"+state.read.i;
        state.sounded ||= {};
        if (!state.sounded[marker]) { state.sounded[marker] = true; sounds?.play(row.cue); checkpoint(); }
      }
      const here=faces();
      const localExchange=!!resident() && beat.lines.some(r=>roles[r.who]===resident() || poseOwner(r.pose)===resident());
      const onLocation=!row.departure && (!state.quietVisit || localExchange);
      const twoPeople=hasPeople && onLocation && resident() && !firstMeetingFrame();
      // A question held open keeps its framing. An insert, an unaddressed
      // action or the first shared view returns to the two-shot.
      const destination=twoPeople && slot ? (slot==="left"?1:-1) : 0;
      const cameraSettled=trackTo(destination,restore);
      await Promise.all([showActor("left",onLocation || slot==="left" ? here.left : null,revision),
        showActor("right",onLocation && resident() ? here.right : null,revision),showInsert(row.insert,revision),
        cameraSettled]);
      if (revision!==view) return;
      const revealShoulder=firstMeetingFrame() && stage.hasAttribute("data-entrance-phase") && !prefs.reduce;
      entrance.settle();
      if (revealShoulder) {
        const shoulder=byId("leftActor").firstElementChild;
        if (shoulder) await shoulder.animate([{opacity:0},{opacity:1}],{duration:520,easing:"ease-in-out"}).finished.catch(()=>{});
        if (revision!==view) return;
      }
      const admitted = await evidence(byId("insert").hidden?"":row.insert,effect);
      if (revision!==view) return;
      loading = false; stage.dataset.arriving = "false";
      setSpeech(row,!!row.insert && !byId("insert").hidden,admitted?.ownsText || window.TAKE_EVIDENCE?.handlesText?.());
      byId("next").hidden = !!canChoose; byId("choices").hidden = !choice;
      speech.disabled = !!canChoose;
      if (choice) {
        stage.dataset.decision = String(!!canChoose);
        byId("choices").setAttribute("role","group");
        byId("choices").setAttribute("aria-label","选择林雨接下来的行动");
        byId("choices").setAttribute("aria-describedby",speech.hidden ? (byId("line").hidden ? "messageBody" : "line") : "bubbleWords");
        if (canChoose && beat.flag && !wants(state.flags,beat.flag)) { applyFlag(beat); checkpoint(); }
        speech.removeAttribute("aria-label");
        for (const c of offered) {
          const button = makeButton(byId("choices"),c.label,()=>select(c)); button.dataset.action = c.key;
          if (!wants(state.flags,c.need)) {
            button.disabled=true;button.setAttribute("aria-disabled","true");
            const reason=document.createElement("small");reason.textContent=c.reason || "还缺一条线索";
            button.append(reason);button.setAttribute("aria-description",reason.textContent);
          }
        }
        if (!overlay.open) byId("choices").querySelector("button:not([aria-disabled=true])")?.focus({preventScroll:true});
      }
      placeSpeech();
      for (const side of ["left","right"]) window.TAKE_PERFORMANCE.express(side,heldExpression(side));
      schedule();
    }
    function beginBeat(key,effect=true) {
      const beat = story.beats[key];
      if (!beat?.lines?.length) return;
      const returningToQuestion=beat.choices?.some(reply=>state.usedReplies[reply.key]);
      const i=returningToQuestion ? beat.lines.length-1 : 0;
      state.read={key,i}; rememberLine(); rememberCast(beat.lines[i]); checkpoint(); readRow({effect});
    }
    function select(c) {
      if (loading || mode!=="read" || overlay.open || !state.read) return;
      const {key,i} = state.read, b = story.beats[key];
      if (i !== b.lines.length-1 || state.answers[key] || state.usedReplies[c.key] || !b.choices?.includes(c)) return;
      if (!wants(state.flags,c.need)) { announce(c.reason || objective()); return; }
      const reply = story.beats[c.key];
      if (!reply) return;
      // A mistaken reading sends the player back to the actual object for
      // another look. Keep only decisions whose outcome becomes a story fact.
      state.usedReplies[c.key] = true;
      if (reply.flag || reply.end) state.answers[key] = c.key;
      applyFlag(b); announce(""); beginBeat(c.key);
    }
    function advance() {
      if (mode!=="read" || !state.read || loading || overlay.open || stage.dataset.decision==="true") return;
      const {key,i} = state.read, beat = story.beats[key];
      if (i<beat.lines.length-1) {
        state.read.i++; rememberLine(); rememberCast(beat.lines[i+1]); checkpoint(); readRow({effect:true}); return;
      }
      if (beat.choices?.length) {
        // No available action can be taken yet; return to the objects whose
        // investigation can uncover that prerequisite, without granting it.
        state.read=null; checkpoint(); explore(); return;
      }
      if (beat.then) { applyFlag(beat); beginBeat(beat.then); return; }
      if (story.places[state.place].inspect.some(a=>a.once && a.key===key)) state.inspected[key]=true;
      applyFlag(beat); state.read = null; if (beat.end) state.end = true; checkpoint();
      if (state.end) end(); else explore();
    }
    function explore() {
      const revision = ++view; loading = false; setMode("explore"); entrance.clear(); stage.dataset.shot = "survey"; evidence();
      stage.dataset.arriving = "false"; stage.dataset.focus = "world"; stage.dataset.insert = stage.dataset.speech = "false";
      byId("insert").hidden = true; byId("next").hidden = byId("who").hidden = byId("line").hidden = true;
      updateHeader();
      const p = story.places[state.place];
      pins.replaceChildren(); byId("choices").replaceChildren();
      for (const a of [...p.inspect,...p.links]) {
        if (omit(a) || !wants(state.flags,a.need) || (a.once && state.inspected[a.key])) continue;
        const mark = makeButton(pins,"",()=>{
          if (mode!=="explore" || overlay.open) return;
          announce(""); if (a.to) travel(a); else beginBeat(a.key);
        },"pin");
        const label = document.createElement("span"); label.textContent=a.label; mark.append(label);
        mark.dataset.action=a.to || a.key; mark.dataset.kind=a.to ? "route" : "inspect";
        if (a.hand) mark.dataset.anchor="hand";
        if (a.to && a.x<.5) mark.dataset.back="true";
        mark.dataset.x=a.x; mark.dataset.y=a.y; mark.setAttribute("aria-label",a.label);
      }
      const here=faces();layout();
      showActor("left",state.quietVisit ? null : here.left,revision);
      showActor("right",state.quietVisit ? null : here.right,revision);
    }
    const locationHold = {stop:1650,shop:2200,building:1780,hall:2200,stairs:1720,corridor:1840,room:1940};
    async function arrive(restored=false) {
      setZone(); updateHeader();
      const p = story.places[state.place], first = !state.seen[state.place], ticket = epoch;
      if (state.place==="hall" && (!first || restored)) window.TAKE_AIR?.footfall();
      if (first && !restored) {
        setMode("moving"); stage.dataset.shot="establish"; stage.dataset.arriving="true";
        stage.dataset.focus="world"; stage.dataset.speech=stage.dataset.insert="false";
        clearCast(); pins.replaceChildren(); byId("insert").hidden=true; byId("objective").hidden=true;
        evidence(); checkpoint();
        // Start the ambient bed on the empty location. The first readable
        // line belongs to the shot that follows this uninterrupted hold.
        const hold=locationHold[state.place] || 1650;
        if (state.place==="shop" && shotAnchor) {
          await wait(760);
          if (ticket!==epoch) return;
          reframeFromSurvey(1100); // From the fascia to the leaf, at a fixed focal length.
          await wait(hold-760);
        } else await wait(hold);
        if (ticket!==epoch) return;
        if (state.place==="stop" || window.TAKE_ENTRANCE.edges[state.place]!=null) {
          const firstLine=story.beats[p.enter]?.lines[0], marker=p.enter+"/0";
          if (firstLine?.cue && !state.sounded?.[marker]) {
            (state.sounded ||= {})[marker]=true; sounds?.play(firstLine.cue); checkpoint();
          }
          await entrance.play(state.place,ticket);
          if (ticket!==epoch) return;
        }
      }
      if (first) state.seen[state.place] = true;
      if (first && p.enter) beginBeat(p.enter,!restored); else { checkpoint(); explore(); }
    }
    async function travel(edge) {
      if (mode!=="explore" || !story.places[state.place].links?.includes(edge) || !story.places[edge.to]) return;
      const ticket = stepEpoch(), origin = state.place;
      const [px,py] = project(edge.x ?? .5,edge.y ?? .5);
      setMode("moving"); stage.dataset.shot = "crossing"; evidence(); pins.replaceChildren(); byId("insert").hidden = true;
      const next = await loadPlace(edge.to,ticket,true); if (!next || ticket!==epoch) return;
      const bridge = byId("bridge"), w = world.clientWidth, h = world.clientHeight;
      const x = clamp(px/Math.max(1,w),.06,.94), y = clamp(py/Math.max(1,h),.10,.90);
      const door = [["building","hall"],["hall","building"],["corridor","room"],["room","corridor"]].some(([a,b])=>a===origin&&b===edge.to);
      if (door) sounds?.play("door"); else sounds?.play("step1");
      // The projection of the clicked doorway stays fixed during the push.
      // Swap the painting only while the entire viewfinder is dark.
      const push=!prefs.reduce && world.animate;
      const animations=[];
      const motion=(node,frames,ms)=>{
        const animation=node.animate(frames,{duration:ms,easing:"ease-in-out",fill:"forwards"});
        animations.push(animation);return animation.finished.catch(()=>{});
      };
      try {
        bridge.replaceChildren(); bridge.hidden=false; bridge.style.opacity="0";
        if (push) {
          world.style.transformOrigin=x*100+"% "+y*100+"%";
          motion(world,[{transform:"scale(1)"},{transform:"scale("+(door?1.13:1.08)+")"}],850);
          motion(byId("cast"),[{opacity:1},{opacity:0}],580);
          await wait(290);
        }
        if (ticket!==epoch) return;
        await motion(bridge,[{opacity:0},{opacity:1}],push?560:180);
        if (ticket!==epoch) return;
        clearCast(); state.quietVisit=!!state.seen[edge.to]; state.place=edge.to;
        stage.dataset.place=state.place; window.TAKE_AIR?.arrive(state.place,false);
        drawPlate(edge.to,next);
        if (edge.to==="shop" && !state.seen.shop && !prefs.reduce && w/h<1.12) {
          const span=scenery.clientWidth,painted=next.naturalWidth*Math.max(span/next.naturalWidth,h/next.naturalHeight);
          if (painted>span) {
            shotAnchor=[clamp((.38*painted-span/2)/(painted-span),0,1),.5];
            plate.style.objectPosition=shotAnchor.map(v=>v*100+"%").join(" ");
            world.dispatchEvent(new Event("take-framing"));
          }
        }
        updateHeader(); setZone(); checkpoint();
        for (const animation of animations.splice(0)) animation.cancel();
        world.style.transformOrigin=""; bridge.style.opacity="1"; sounds?.play("step2");
        await wait(push?125:70);
        if (ticket!==epoch) return;
        await motion(bridge,[{opacity:1},{opacity:0}],push?690:220);
      } finally {
        for (const animation of animations) animation.cancel();
        bridge.hidden=true; bridge.style.opacity=""; world.style.transformOrigin="";
      }
      if (ticket===epoch) arrive();
    }
    function end() {
      ++view; loading = false; setMode("end"); stage.dataset.shot="end"; evidence(); pins.replaceChildren(); speech.hidden = true; byId("insert").hidden = true;
      stage.dataset.speech = stage.dataset.insert = "false"; stage.dataset.focus = "world"; clearCast(); sounds?.pause(true);
    }
    function title() {
      stepEpoch(); surveyAnchor=null; state = fresh(); setMode("title"); stage.dataset.shot="title"; evidence(); clearCast(); speech.hidden = true; byId("insert").hidden = true; byId("bridge").hidden = true;
      pins.replaceChildren(); announce(""); stage.dataset.insert = stage.dataset.speech = "false"; stage.dataset.focus = "world";
      byId("resume").hidden = !valid(storage(saveKey)); sounds?.pause(true);
      const p = story.places[story.start], a = art.plates[p.plate], t = epoch;
      if (a?.file) getImage(a.file).then(i=>{if(t===epoch) drawPlate(story.start,i);}).catch(()=>{});
    }
    async function start(resume) {
      if (mode!=="title") return;
      const ticket = stepEpoch(); const old = resume && recover(storage(saveKey)); state = old || fresh();
      setMode("moving"); sounds?.start(); sounds?.pause(false); setZone();
      const image = await loadPlace(state.place,ticket);
      if (!image || ticket!==epoch) return;
      drawPlate(state.place,image); window.TAKE_AIR?.arrive(state.place,!!old);
      if (state.end) { checkpoint(); end(); }
      else if (state.read) { rememberCast(story.beats[state.read.key].lines[state.read.i]); checkpoint(); readRow({restore:true}); }
      else arrive(!!old);
    }
    function settings() {
      if (prefs.reduce && truck!==0) trackTo(0,true);
      document.body.classList.toggle("reduce",prefs.reduce); document.body.classList.toggle("big",prefs.big);
      stage.dataset.reduced = String(prefs.reduce); stage.dataset.muted = String(prefs.mute);
      sounds?.mute(prefs.mute); store(prefKey,prefs);
    }
    function dialog(page) {
      clearTimeout(autoTimer); const body = byId("overlayBody"); body.replaceChildren();
      byId("overlayTitle").textContent = page==="history"?"回看对白":page==="settings"?"设置":"暂停";
      if (page==="history") {
        for (const entry of state.log) {
          const p = document.createElement("p"), b = document.createElement("b");
          b.textContent = entry.who+"　"; p.append(b,document.createTextNode(entry.text)); body.append(p);
        }
        if (!state.log.length) body.textContent = "还没有读过的对白。";
      } else if (page==="settings") {
        for (const [key,label] of [["mute","静音"],["reduce","减少动态"],["big","大字幕"],["auto","自动读下一句"]]) {
          const l=document.createElement("label"), input=document.createElement("input");
          input.type="checkbox"; input.checked=!!prefs[key]; input.onchange=()=>{ prefs[key]=input.checked; settings(); layout(); };
          l.append(input,document.createTextNode(label)); body.append(l);
        }
      } else {
        if (mode==="explore") for (const a of story.places[state.place].reviews || []) {
          if (wants(state.flags,a.need)) makeButton(body,"复查 · "+a.label,()=>{overlay.close();beginBeat(a.key);});
        }
        makeButton(body,"回看对白",()=>dialog("history")); makeButton(body,"设置",()=>dialog("settings"));
        makeButton(body,"返回标题",()=>{overlay.close(); title();});
      }
      if (!overlay.open) { menuFrom=document.activeElement; overlay.showModal(); sounds?.pause(true); }
      if (page==="history") requestAnimationFrame(()=>{body.scrollTop=body.scrollHeight;});
    }
    speech.setAttribute("aria-live","polite"); speech.setAttribute("aria-atomic","true");
    for (const button of byId("lookControls").children) button.onclick=()=>look(Number(button.dataset.direction));
    byId("new").onclick = () => start(false); byId("resume").onclick = () => start(true);
    byId("next").onclick = speech.onclick = byId("line").onclick = advance; byId("menu").onclick = () => { if (mode!=="moving") dialog("menu"); };
    byId("closeMenu").onclick = () => overlay.close(); byId("finish").onclick = title;
    overlay.onclose = () => { sounds?.pause(mode==="title"||mode==="end"||document.hidden); schedule(); menuFrom?.focus?.({preventScroll:true}); };
    scene.addEventListener("click",event=>{
      if (mode==="read" && !event.target.closest("button,input,#phoneProof,#filmTools")) advance();
    });
    document.addEventListener("take-evidence-change",schedule);
    document.addEventListener("keydown",event=>{
      if (event.repeat || overlay.open || event.target.closest("input,textarea,select,#phoneProof,#filmTools")) return;
      if (stage.dataset.decision==="true") {
        const options=[...byId("choices").querySelectorAll("button:not([aria-disabled=true])")];
        const at=options.indexOf(document.activeElement);
        if (options.length && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"].includes(event.key)) {
          event.preventDefault();
          const direction=["ArrowDown","ArrowRight"].includes(event.key)?1:-1;
          const index=event.key==="Home"?0:event.key==="End"?options.length-1:at<0?0:(at+direction+options.length)%options.length;
          options[index].focus({preventScroll:true}); return;
        }
        if (event.key!=="Escape") return; // Enter/space activate only the focused choice.
      }
      if (event.key==="Escape" && ["read","explore"].includes(mode)) { event.preventDefault(); dialog("menu"); }
      if ((event.key==="ArrowRight" || (["Enter"," "].includes(event.key)&&!event.target.closest("button"))) && mode==="read") {
        event.preventDefault(); advance();
      }
    });
    document.addEventListener("visibilitychange",()=>{sounds?.pause(document.hidden||overlay.open||mode==="title"||mode==="end"); schedule();});
    new ResizeObserver(layout).observe(scene);
    document.fonts?.ready.then(layout); settings(); title();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();
