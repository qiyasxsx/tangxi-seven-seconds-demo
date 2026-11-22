/* A small fixed sign belongs to the wall. Its drawing position follows the
   same cover crop as the location and never moves independently of the lens. */
(() => {
  const id = name => document.getElementById(name);
  const stage=id("stage"),world=id("world"),plate=id("plate"),marks=id("marks");
  const panel=id("evidence"),clock=id("evidenceTime"),label=id("evidenceLabel");
  const signs={
    stop: [["paintedSign","宵",.7965,.460,.019,.030],["number","三巷",.019,.090,.052,.045]],
    shop: [["paintedSign","宵",.897,.101,.060,.083]],
    building: [["number","十二号",.622,.098,.049,.031]]
  };
  let place="", key="";
  function paintSigns(){
    marks.replaceChildren();
    const src=signs[place];if(!src || !plate.naturalWidth) return;
    const original=window.TAKE_ART.plates[place].anchor||[.5,.5];
    const position=plate.style.objectPosition.split(/\s+/);
    const a=original.map((v,i)=>position[i]?.endsWith("%")?Number.parseFloat(position[i])/100:v);
    const surface=id("scenery");
    const scale=Math.max(surface.clientWidth/plate.naturalWidth,surface.clientHeight/plate.naturalHeight);
    const w=plate.naturalWidth*scale,h=plate.naturalHeight*scale;
    const ox=(surface.clientWidth-w)*a[0],oy=(surface.clientHeight-h)*a[1];
    for(const [kind,text,x,y,sw,sh] of src){
      const s=document.createElement("span");s.className="mark "+kind;s.textContent=text;
      Object.assign(s.style,{left:(ox+(x-sw/2)*w)+"px",top:(oy+(y-sh/2)*h)+"px",width:(sw*w)+"px",height:(sh*h)+"px",fontSize:(kind==="sign"?sw*w*.78:Math.min(sh*h*.83,sw*w/text.length*.88))+"px"});marks.append(s);
    }
  }
  const proof=id("phoneProof"),handset=id("handset"),audio=id("filmAudio");
  const play=id("filmPlay"),seek=id("filmSeek"),lead=id("clipLead"),last=id("clipLast"),rain=id("clipRain");
  const ctx=rain.getContext("2d"),memoryKey="tangxi-first-take-visible-phone-v1";
  const clipPrefsKey="tangxi-first-take-clip-controls", saveButton=id("filmSave"),soundButton=id("filmSound");
  let clipPrefs={};
  try {clipPrefs=JSON.parse(localStorage.getItem(clipPrefsKey))||{};} catch {}
  let page=null, elapsed=0, running=false, dragging=false, folded=false, posted=false, raf=0, previous=0;
  let savedSecond=-1,cueTimer;

  function stateChanged(){ document.dispatchEvent(new Event("take-evidence-change")); }
  function suspended(){ return document.hidden || id("overlay").open; }
  function ownsText(){ return !!page?.owns; }
  function holdsReading(){
    return !!page && !folded && (running || dragging || proof.contains(document.activeElement));
  }
  function remember(){
    if (!page) return;
    try { sessionStorage.setItem(memoryKey,JSON.stringify({key,elapsed,posted,folded})); } catch {}
  }
  function previousState(){
    try { return JSON.parse(sessionStorage.getItem(memoryKey)); } catch { return null; }
  }
  function pauseSound(){ audio.pause(); }
  function wholeGameMuted(){
    if(stage.dataset.muted!==undefined)return stage.dataset.muted==="true";
    try { return !!JSON.parse(localStorage.getItem("tangxi-opening-first-take-v1-settings"))?.mute; } catch { return false; }
  }
  function updateClipActions(){
    const saved=!!clipPrefs[posted?"repost":"original"],globalMute=wholeGameMuted();
    saveButton.setAttribute("aria-pressed",String(saved));
    saveButton.setAttribute("aria-label",(saved?"取消收藏":"收藏")+(posted?"节目转发":"投稿原片"));
    saveButton.lastElementChild.textContent=saved?"已收藏":"收藏";
    audio.muted=globalMute || !!clipPrefs.quiet;
    soundButton.disabled=globalMute;
    soundButton.setAttribute("aria-pressed",String(!audio.muted));
    soundButton.setAttribute("aria-label",globalMute?"全作已静音":audio.muted?"开启投稿原声":"关闭投稿原声");
    soundButton.lastElementChild.textContent=globalMute?"全作静音":audio.muted?"已静音":"原声";
  }
  function toggleClipPref(name){
    clipPrefs[name]=!clipPrefs[name];
    try {localStorage.setItem(clipPrefsKey,JSON.stringify(clipPrefs));} catch {}
    updateClipActions();
  }
  function soundAt(t){
    updateClipActions();audio.volume=.24;
    if (!running || suspended() || folded) {pauseSound();return;}
    try { audio.currentTime=t; } catch {}
    audio.play()?.catch(()=>{});
  }
  function drawRain(){
    const w=rain.clientWidth,h=rain.clientHeight;if(!w||!h)return;
    if(rain.width!==w||rain.height!==h){rain.width=w;rain.height=h;}
    ctx.clearRect(0,0,w,h);
    if(document.body.classList.contains("reduce"))return;
    ctx.strokeStyle="#c9d6de66";ctx.lineWidth=.7;
    for(let i=0;i<18;i++){
      const x=w*((i*.618+.091+elapsed*.009)%1),y=h*((i*.237+elapsed*(.34+(i%4)*.037))%1);
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-1.5,y+5+i%4);ctx.stroke();
    }
  }
  function displayTime(){
    lead.style.opacity=String(Math.min(1,Math.max(0,(3.45-elapsed)/.16)));
    seek.value=String(elapsed);seek.setAttribute("aria-valuetext",elapsed.toFixed(1)+"秒，共7秒");
    seek.style.setProperty("--file-position",(elapsed*100/7)+"%");
    id("phoneTime").textContent="00:"+String(Math.floor(elapsed)).padStart(2,"0")+" / 00:07";
    const action=running?"暂停投稿":elapsed>=7?"重播这七秒":"播放这七秒";
    play.dataset.action=running?"pause":elapsed>=7?"replay":"play";
    play.setAttribute("aria-label",action);id("filmSurface").setAttribute("aria-label",action);
    play.setAttribute("aria-pressed",String(running));
    if (Math.floor(elapsed)!==savedSecond){savedSecond=Math.floor(elapsed);remember();}
    drawRain();
  }
  function scheduleFilm(){
    cancelAnimationFrame(raf);previous=performance.now();
    soundAt(elapsed);
    if(running&&!suspended()&&!folded)raf=requestAnimationFrame(tick);
  }
  function tick(now){
    if(!running || suspended() || folded || !page)return;
    elapsed=Math.min(7,elapsed+Math.max(0,now-previous)/1000);previous=now;
    if(elapsed>=7){running=false;pauseSound();}
    displayTime();if(running)raf=requestAnimationFrame(tick);else stateChanged();
  }
  function setOwner(){
    id("originalTab").setAttribute("aria-pressed",String(!posted));id("postTab").setAttribute("aria-pressed",String(posted));
    id("videoAuthor").textContent=posted?"林雨 · 夜访":"匿名投稿人";
    id("videoRole").textContent=posted?"转发":"原片";
    const caption=id("phoneCaption");
    const originalCaption=page?.kind==="post"?"":page?.owns?page.text:"";
    const post=page?.kind==="post" && page.text.match(/「(.+?)」\s*(.*)/);
    caption.textContent=posted?(post?post[1]:"整条巷，没人开门"):originalCaption;
    caption.hidden=!caption.textContent;
    const context=id("postContext");
    context.textContent=posted && post?post[2]:"";context.hidden=!context.textContent;
    proof.dataset.version=posted?"repost":"original";
    updateClipActions();
  }
  function showDispatch(){
    const notice=page.kind==="notice";
    const postedNotice=notice && page.text.match(/^([^　]+)　(.+)$/);
    const message=!notice && page.text.match(/^(?:([^　]+\d:\d{2})　)?[^「]*「(.+)」$/);
    const time=id("messageTime"),title=id("noticeTitle");
    id("messageAuthor").textContent=page.sender;
    proof.dataset.contact=notice?"account":page.sender==="许先生"?"landlord":"sender";
    time.textContent=message?.[1]||"";time.hidden=!time.textContent;
    title.textContent=postedNotice?.[1]||"";title.hidden=!title.textContent;
    id("messageBody").textContent=postedNotice?.[2]||message?.[2]||page.text;
  }
  function chooseVersion(value){
    posted=value;setOwner();remember();stateChanged();
  }

  // In the source artwork for the seven-second file the files are distinct
  // poses of the same girl, with the lamp and the awning in fixed positions.
  function clipImage(image,portrait,fallback){
    if(image.dataset.portrait===portrait)return;
    image.dataset.portrait=portrait;
    image.onerror=()=>{image.onerror=null;image.src=fallback;};
    image.src=portrait;
  }
  function describe(insert,beat,row){
    if(!row)return null;
    if(insert==="clip" || row.who==="旧视频")return {kind:"video",text:row.text,owns:row.who==="旧视频"};
    if(row.who==="手机"){
      if(beat==="correctThePost")return {kind:"post",text:row.text,owns:true};
      const notice=(beat==="publishCorrection" || beat==="withdrawClip")&&!row.text.startsWith("投稿人");
      return {kind:notice?"notice":"message",text:row.text,owns:true,
        sender:notice?"林雨 ·《夜访》":beat==="checkNumber"?"许先生":"匿名投稿人"};
    }
    if(beat==="rentMessage" && row===window.FIRST_TAKE.beats.rentMessage.lines[0])
      return {kind:"message",sender:"许先生",text:window.FIRST_TAKE.beats.checkNumber.lines[0].text,owns:false};
    return null;
  }
  function comparison(){
    const field=id("fieldView"),side=page?.kind==="video" && (place==="room" || place==="stairs");
    field.hidden=!side;
    stage.dataset.phoneCompare=String(!!side);
    if(!side)return;
    const upper=place==="room",asset=upper?"roomView":"landingView";
    const src=window.TAKE_ART.inserts[asset]?.file;
    if(!src){field.hidden=true;return;}
    if(field.dataset.asset!==asset){field.dataset.asset=asset;id("fieldPicture").src=src;}
    id("fieldPicture").alt=upper?"从三〇二的窗看去，宵字完整露出。":"从转角窗看去，棚沿遮住宵字的下半部。";
    id("fieldCaption").textContent=upper?"三〇二 · 窗外":"二楼 · 窗外";
    proof.classList.add("comparing");
  }
  function fold(value,focus){
    folded=value;handset.hidden=value;id("raisePhone").hidden=!value;
    if(value){running=false;pauseSound();cancelAnimationFrame(raf);}
    proof.dataset.folded=String(value);stage.dataset.phoneRaised=String(!value);comparison();remember();stateChanged();
    if(focus)(value?id("raisePhone"):id("lowerPhone")).focus({preventScroll:true});
  }
  function hidePhone(){
    if(proof.contains(document.activeElement))document.activeElement.blur();
    proof.hidden=true;id("fieldView").hidden=true;proof.classList.remove("comparing");
    delete stage.dataset.phone;delete stage.dataset.phoneRaised;delete stage.dataset.phoneCompare;page=null;running=dragging=folded=false;
    cancelAnimationFrame(raf);pauseSound();
    clearTimeout(cueTimer);id("playCue").hidden=true;
  }
  function show(nextPlace,insert,beat,i,liveCue=false){
    const row=window.FIRST_TAKE?.beats[beat]?.lines[i];
    const data=stage.dataset.mode==="read"?describe(insert,beat,row):null;
    const next=nextPlace+"|"+insert+"|"+beat+"|"+i+"|"+(data?.kind||"");
    if(next===key)return {ownsText:ownsText()};
    if(page)remember();
    hidePhone();key=next;place=nextPlace;paintSigns();stage.dataset.proof=insert||"";
    const location=window.TAKE_ART.plates[nextPlace];
    if(location)stage.style.setProperty("--street","url("+JSON.stringify(new URL(location.file,document.baseURI).href)+")");
    const dark=id("glassEnd");if((insert==="tv"||insert==="tvFade")&&!dark.getAttribute("src"))dark.src="art/playback.webp";
    dark.hidden=insert!=="tvFade";dark.classList.toggle("extinguish",insert==="tvFade"&&liveCue);
    panel.hidden=insert!=="playback";
    if(!panel.hidden){label.textContent="阿岑 / 机内回放";clock.textContent="回放";panel.style.setProperty("--progress","100%");}
    if(!data){stateChanged();return {ownsText:false};}

    page=data;stage.dataset.phone=page.kind;proof.hidden=false;proof.dataset.kind=page.kind;
    const video=page.kind==="video"||page.kind==="post";
    id("videoPage").hidden=!video;id("phoneTabs").hidden=!video;id("messagePage").hidden=video;
    id("phoneChannel").hidden=video;
    id("phoneChannel").textContent=page.kind==="notice"?"栏目动态":"私信";
    const saved=!liveCue?previousState():null,restored=saved?.key===key;
    folded=restored&&!!saved.folded;posted=restored?!!saved.posted:page.kind==="post";
    if(video){
      clipImage(last,"art/clipPhoneEnd.webp","art/clip.webp");clipImage(lead,"art/clipPhoneBefore.webp","art/clipBefore.webp");
      elapsed=restored?Math.min(7,Math.max(0,Number(saved.elapsed)||0)):(beat==="sevenSeconds"&&liveCue?0:7);
      running=liveCue&&beat==="sevenSeconds"&&!folded;savedSecond=-1;
      setOwner();displayTime();
    }else{
      showDispatch();
    }
    fold(folded,false);if(video)scheduleFilm();stateChanged();
    return {ownsText:ownsText()};
  }
  play.onclick=()=>{
    if(!page)return;
    running=!running;if(running&&elapsed>=7)elapsed=0;
    displayTime();scheduleFilm();remember();stateChanged();
    const cue=id("playCue");cue.dataset.symbol=running?"pause":"play";cue.hidden=false;
    clearTimeout(cueTimer);cueTimer=setTimeout(()=>{cue.hidden=true;},600);
  };
  id("filmSurface").onclick=play.onclick;
  saveButton.onclick=()=>toggleClipPref(posted?"repost":"original");
  soundButton.onclick=()=>toggleClipPref("quiet");
  seek.oninput=()=>{
    running=false;cancelAnimationFrame(raf);pauseSound();elapsed=Number(seek.value);displayTime();remember();stateChanged();
  };
  seek.addEventListener("pointerdown",()=>{dragging=true;stateChanged();});
  document.addEventListener("pointerup",()=>{if(dragging){dragging=false;stateChanged();}});
  document.addEventListener("pointercancel",()=>{if(dragging){dragging=false;stateChanged();}});
  id("lowerPhone").onclick=()=>fold(true,true);id("raisePhone").onclick=()=>fold(false,true);
  id("originalTab").onclick=()=>chooseVersion(false);id("postTab").onclick=()=>chooseVersion(true);
  proof.addEventListener("click",e=>e.stopPropagation());
  proof.addEventListener("keydown",e=>{
    if(e.key==="Escape"){e.preventDefault();e.stopPropagation();id("menu").click();return;}
    if(["Enter"," ","Home","End","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))e.stopPropagation();
  });
  proof.addEventListener("focusin",stateChanged);proof.addEventListener("focusout",()=>queueMicrotask(stateChanged));
  document.addEventListener("visibilitychange",()=>{remember();scheduleFilm();});
  window.addEventListener("pagehide",()=>{remember();cancelAnimationFrame(raf);pauseSound();});
  new MutationObserver(()=>{if(page)scheduleFilm();}).observe(id("overlay"),{attributes:true,attributeFilter:["open"]});
  world.addEventListener("take-framing",paintSigns);
  plate.addEventListener("load",paintSigns);
  new ResizeObserver(()=>{paintSigns();if(page)drawRain();}).observe(world);
  window.TAKE_EVIDENCE={show,holdsReading,handlesText:ownsText};
})();
