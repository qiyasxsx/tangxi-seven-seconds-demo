(() => {
  'use strict';
  const book=globalThis.TX_SEASON, direction=window.SeasonDirection, audio=window.passageSound;
  const $=id=>document.getElementById(id);
  const DIRECTOR=new URLSearchParams(location.search).get('edition')==='director';
  const SAVE_BASE='tangxi.season.v1', SAVE=DIRECTOR?SAVE_BASE:SAVE_BASE+'.reading', PREFS=SAVE_BASE+'.prefs', LAST=DIRECTOR?SAVE_BASE+'.console':SAVE_BASE+'.reading.console';
  const reading=window.TX_READING||{route:{},stops:{},labels:{}};
  const SAVE_EDITION=4;
  // Director-cut saves were already edition 2.  These are stable beat-prefix
  // renames from that shipped story to the rebuilt screenplay; option suffixes
  // and their feedback keep the same meaning after the prefix is translated.
  const legacyPrefixes=Object.freeze({
    'E02-S02.b01':'E02-S02.b04', 'E02-S03.b08':'E02-S03.b10',
    'E02-S04.b03':'E02-S04.b05', 'E03-S02.b03':'E03-S02.b05',
    'E03-S03.b06':'E03-S03.b11', 'E03-S05.b05':'E03-S05.b07',
    'E04-S02.b02':'E04-S02.b03', 'E04-S03.b04':'E04-S03.b05',
    'E05-S03.b01':'E05-S03.b02', 'E05-S04.b05':'E05-S04.b06',
    'E06-S03.b06':'E06-S03.b05', 'E06-S04.b10':'E06-S04.b09',
    'E07-S04.b06':'E07-S04.b05', 'E07-S04.b08':'E07-S04.b07'
  });
  // A save can be made while an interaction is open, before it has a log line.
  // Keep those old ordinals explicit rather than guessing from the new length.
  const legacyChoices=Object.freeze({
    'E00-S01:7':'E00-S01.b08', 'E00-S02:6':'E00-S02.b07', 'E00-S03:4':'E00-S03.b05', 'E00-S04:1':'E00-S04.b02',
    'E01-S02:1':'E01-S02.b02', 'E01-S03:2':'E01-S03.b03',
    'E02-S02:0':'E02-S02.b04', 'E02-S03:7':'E02-S03.b10', 'E02-S04:2':'E02-S04.b05',
    'E03-S02:2':'E03-S02.b05', 'E03-S03:5':'E03-S03.b11', 'E03-S05:4':'E03-S05.b07',
    'E04-S02:1':'E04-S02.b03', 'E04-S03:3':'E04-S03.b05',
    'E05-S02:3':'E05-S02.b04', 'E05-S03:0':'E05-S03.b02', 'E05-S04:4':'E05-S04.b06',
    'E06-S02:3':'E06-S02.b04', 'E06-S03:5':'E06-S03.b05', 'E06-S04:9':'E06-S04.b09',
    'E07-S02:2':'E07-S02.b03', 'E07-S03:5':'E07-S03.b06',
    'E07-S04:5':'E07-S04.b05', 'E07-S04:7':'E07-S04.b07', 'E07-S05:5':'E07-S05.note',
    'E08-S03:4':'E08-S03.b05', 'E08-S04:3':'E08-S04.b03', 'E08-S05:6':'E08-S05.b05'
  });
  const panels=['home','slate','advance','choices','route','end'];
  let state, transition=false, showingChoices='', lostStorage=false, activeScene='';
  const pages=window.SeasonCaptions.pages;
  function load(key) {try{return JSON.parse(localStorage.getItem(key))}catch{return null}}
  function store(key,value) {
    try {localStorage.setItem(key,JSON.stringify(value))}
    catch {if(!lostStorage){lostStorage=true;notice('浏览器未允许本地存档，本次仍可继续游玩。')}}
  }
  function valid(s) {return !!(s && s.version===1 && book.scenes[s.scene] && Number.isInteger(s.beat) && s.beat>=0 && ['arrive','read','feedback','travel','end'].includes(s.phase) && Array.isArray(s.flags) && Array.isArray(s.log) && s.records)}
  const fresh=()=>({version:1,edition:SAVE_EDITION,mode:DIRECTOR?'director':'reading',scene:book.start,beat:0,page:0,phase:'arrive',selected:null,fb:0,flags:[],records:{},log:[],visited:[book.start]});
  const prefs=Object.assign({mute:false,big:false,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches},load(PREFS)||{});
  function preferences() {
    document.body.classList.toggle('big',prefs.big);
    document.body.classList.toggle('reduce',prefs.reduce);
    audio.mute(prefs.mute);window.SeasonFoley.mute(prefs.mute);window.SeasonCaptions.place();window.SeasonInvestigation?.setMuted(prefs.mute);
  }
  let nTimer;
  function notice(message) {clearTimeout(nTimer);$('notice').textContent=message;$('notice').hidden=false;nTimer=setTimeout(()=>$('notice').hidden=true,2200)}
  function only(which) {
    $('look').hidden=true;$('backSite').hidden=true;$('reviewSite').hidden=true;
    if(which!=='choices' && showingChoices){window.SeasonInvestigation?.clear();$('choices').replaceChildren();showingChoices=''}
    for(const id of panels)$(id).hidden=id!==which;
    $('stage').dataset.mode=which;
    $('pause').hidden=which==='home';
    $('location').hidden=!['advance','route','choices'].includes(which);
    if(which!=='advance')$('advance').removeAttribute('data-layout');
  }
  const scene=()=>book.scenes[state.scene], beat=()=>scene().beats[state.beat];
  const chapter=()=>book.chapters.find(c=>c.id===scene().chapter);
  function save(){state.beatId=beat()?.id||null;store(SAVE,state)}
  function history() {
    return state.log.filter(l=>l.scene===state.scene);
  }
  function remember(line) {
    const last=state.log.at(-1);
    if(last?.id===line.id && last.scene===state.scene){last.text=line.text;last.speaker=line.speaker}
    else state.log.push({scene:state.scene,id:line.id,speaker:line.speaker,text:line.text});
  }
  function permitted(rule, alternatives={}) {
    return !rule || (Array.isArray(rule)?rule:[rule]).every(id=>
      state.flags.includes(id) || alternatives[id]?.some(other=>state.flags.includes(other)));
  }
  function displayLine(line,audible) {
    const chunks=pages(line);
    state.page=Math.max(0,Math.min(state.page,chunks.length-1));
    only('advance');
    const visible=chunks.slice(0,state.page+1).join('');
    remember({...line,text:visible});
    const read=history();
    const layout=direction.compose(scene(),{...line,text:visible},read,audible,state.page);
    $('advance').dataset.layout=layout;
    if(state.page+1<chunks.length)direction.warm(scene(),line,state.page+1);
    else {
      const next=state.phase==='feedback'?optionAt()?.feedback[state.fb+1]:scene().beats[state.beat+1];
      if(next?.type==='line' && permitted(next.when))direction.warm(scene(),next);
    }
    $('speaker').textContent=({'旁白':'','动作':'','片尾':'','声画':''})[line.speaker]??line.speaker;
    $('words').textContent=chunks[state.page];
    if(line.id==='E07-S05.b05' && state.page===3)
      $('words').setAttribute('aria-label',chunks[state.page]+' 可公开的是门轴；照护簿仅供核对；改衣局部照已经取回。');
    else $('words').removeAttribute('aria-label');
    window.SeasonCaptions.place();
    $('nextHint').textContent=chunks.length>1?(state.page+1)+' / '+chunks.length+'　⌄':'继续　⌄';
  }
  function optionAt() {return beat()?.options?.find(o=>o.id===state.selected)}
  function resolveChoice() {
    const selected=optionAt(); if(!selected){state.phase='read';return}
    state.selected=null;state.fb=0;state.page=0;
    if(selected.retry){state.missed ||= [];if(!state.missed.includes(selected.id))state.missed.push(selected.id);state.phase='read';return}
    if(!state.flags.includes(selected.id))state.flags.push(selected.id);
    if(selected.to){state.nextScene=selected.to;state.phase='travel';return}
    state.beat++;state.phase='read';
  }
  function selectOption(i) {
    if(transition||$('notebook').open || state.phase!=='read')return;
    const item=beat(),o=item?.options?.[i];
    if(!o || !permitted(o.requires,o.alternatives) || state.flags.includes(o.id) || state.missed?.includes(o.id))return;
    state.phase='feedback';state.selected=o.id;state.fb=0;state.page=0;
    only('advance');render(true);
  }
  function own(map,id) {return Object.prototype.hasOwnProperty.call(map||{},id)}
  function readingOption(item) {
    const selected=own(reading.route,item.id)?reading.route[item.id]:-1;
    const valid=index=>Number.isInteger(index) && item.options[index] && !item.options[index].retry
      && permitted(item.options[index].requires,item.options[index].alternatives);
    if(valid(selected))return selected;
    return item.options.findIndex(option=>!option.retry && permitted(option.requires,option.alternatives));
  }
  function readingStop(item) {
    const index=own(reading.stops,item.id)?reading.stops[item.id]:-1;
    return Number.isInteger(index) && item.options[index] && !item.options[index].retry ? index : -1;
  }
  function holdReadingAction(item,index) {
    const prior=history(),last=prior.at(-1),label=reading.labels?.[item.id]||item.options[index].label;
    state.readingStop=item.id;only('advance');
    direction.compose(scene(),last,prior,false,last?pages(last).length-1:0,item);
    $('speaker').textContent='行动';$('words').textContent=label;$('nextHint').textContent='执行　⌄';
    window.SeasonCaptions.place();
  }
  function choose(item) {
    only('choices');
    if(showingChoices===item.id)return;
    showingChoices=item.id;
    function reason(o) {
      if (!o.requires) return '';
      const needed=o.requires.filter(id=>!permitted(id,o.alternatives));
      return needed.map(id=>o.alternatives?.[id]?'还缺一份街坊可查的署名说明':'还未接下无齿坯和四周的值班').join('；');
    }
    const opts=item.options.map(o=>({id:o.id,label:o.label,disabled:!permitted(o.requires,o.alternatives)||state.missed?.includes(o.id),lockReason:state.missed?.includes(o.id)?'已经核过这处':reason(o)}));
    if(window.SeasonInvestigation?.render($('choices'),scene().id,item,opts,selectOption))return;
    const heading=document.createElement('h2');heading.textContent=item.prompt;
    $('choices').replaceChildren(heading);
    for(const [i,o] of opts.entries()) {
      if(state.flags.includes(o.id)||state.missed?.includes(o.id))continue;
      const button=document.createElement('button');button.className='answer';button.dataset.option=i;
      button.textContent=o.label;button.disabled=o.disabled;
      if(o.disabled){const reason=document.createElement('small');reason.textContent='锁定　'+o.lockReason;button.append(reason)}
      button.onclick=()=>selectOption(i);$('choices').append(button);
    }
  }
  function go(id) {
    state.nextScene=null;state.scene=id;state.beat=0;state.page=0;state.phase='arrive';state.selected=null;state.fb=0;
    if(!state.visited.includes(id))state.visited.push(id);
    if(id==='E08-S03')store(LAST,state);
  }
  const sceneTitle=s=>DIRECTOR?s.title:s.title.replace(/^结局.　/,'尾声　');
  function arrival(s) {
    const c=chapter(),mark=direction.arrivalCard(s);only('slate');
    $('slate').classList.toggle('smallArrival',c.scenes[0]!==s.id);
    $('chapterNo').textContent=c.scenes[0]===s.id?mark.time+'　／　'+mark.place:c.title+'　／　'+mark.time;
    $('chapterName').textContent=c.scenes[0]===s.id?c.title:mark.place;
    const route=!DIRECTOR && window.SeasonJourney[s.id];
    $('arrive').textContent=route?route.path:sceneTitle(s);
  }
  function visitSite(id) {
    closePanel();only('review');$('reviewSite').hidden=false;$('pause').hidden=true;
    const target=book.scenes[id],shot=direction.prepare(target,true);
    $('reviewTime').textContent='现场回想　／　'+(shot.date||target.time);
    $('reviewName').textContent=shot.place||target.place;
    $('reviewNote').textContent=shot.note||window.TX_SITES[id]?.[3]||target.title;
    $('reviewDone').onclick=()=>{activeScene='';render()};
  }
  function siteMarkers() {
    const s=scene(),entry=window.TX_SITES[s.id];
    if(entry && !state.inspected?.includes(s.id)){
      const route=!DIRECTOR && window.SeasonJourney[s.id];
      const [x,y]=route?.point||entry;
      const [title,detail]=route?.look||entry.slice(2);
      const b=$('look');b.hidden=false;b.style.left=x+'%';b.style.top=y+'%';b.textContent=title;
      b.onclick=()=>{
        state.inspected ||= [];state.inspected.push(s.id);save();b.hidden=true;
        openPanel(title);paragraph(detail);menuButton('看回现场',closePanel);
      };
    }
    const previous=state.visited[state.visited.lastIndexOf(s.id)-1];
    if(previous && scene().chapter===book.scenes[previous].chapter){
      const b=$('backSite');b.hidden=false;b.onclick=()=>visitSite(previous);
    }
  }
  function render(audible=false) {
    for(;;){
      const s=scene();
      if(activeScene!==s.id){activeScene=s.id;direction.prepare(s,false,!DIRECTOR&&state.phase==='arrive')}
      if(state.phase==='arrive'){arrival(s);siteMarkers();break}
      if(state.phase==='end'){
        only('end');$('endingTitle').textContent=s.title.replace(/^结局.　/,'');
        $('endingLine').textContent=s.id==='E08-S06'?'车门合上，街坊手里各留着一份。':s.id==='E08-S07'?'周二，柜台的小灯亮着。':'片尾署了名，原片的去向由合同决定。';break
      }
      if(state.phase==='travel'){
        if(!DIRECTOR){
          if(transition)break;
          const destination=state.nextScene||s.next;
          if(window.SeasonJourney[destination]?.match){
            go(destination);state.phase='read';continue;
          }
          const leaving=state;
          transition=true;only('transit');$('stage').classList.add('is-travelling');
          direction.leave(()=>{
            transition=false;$('stage').classList.remove('is-travelling');
            if(state!==leaving)return;
            go(destination);render();
          },window.SeasonJourney[destination]?.wide!==window.SeasonJourney[s.id]?.wide);
          break;
        }
        only('route');direction.travel(s);const next=book.scenes[state.nextScene||s.next];
        const destination=direction.arrivalCard(next).place;
        $('route').textContent=($('locationName').textContent===destination?'留在':'前往')+'　'+destination;break
      }
      if(state.phase==='feedback'){
        const f=optionAt()?.feedback[state.fb];
        if(!f){resolveChoice();continue}
        displayLine(f,audible);break;
      }
      const b=beat();
      if(!b){state.phase=s.next?'travel':'end';continue}
      if(!permitted(b.when)){state.beat++;continue}
      if(b.type==='set'){
        state.records[b.record]={title:b.text,scope:b.scope,holder:b.holder,detail:b.detail,scene:s.id};
        state.beat++;continue;
      }
      if(b.type==='end'){state.phase='end';continue}
      if(b.type==='interaction'){
        const prior=history(),last=prior.at(-1);
        if(!DIRECTOR){
          const stop=readingStop(b);
          if(stop>=0 && !state.flags.includes(b.options[stop].id)){holdReadingAction(b,stop);break}
          state.readingStop=null;
          const index=readingOption(b);
          if(index<0){state.beat++;continue}
          const selected=b.options[index];
          state.phase='feedback';state.selected=selected.id;state.fb=0;state.page=0;
          continue;
        }
        direction.compose(s,last,prior,false,last?pages(last).length-1:0,b);choose(b);break
      }
      if(b.type==='line'){displayLine(b,audible);break}
      throw Error('未知演出类型 '+b.type);
    }
    save();
  }
  async function approach(place) {
    transition=true;only('approach');
    $('stage').classList.add('approaching');
    try {await direction.approach(place)}
    finally {transition=false;$('stage').classList.remove('approaching')}
  }
  async function advance() {
    if(transition||$('stage').getAttribute('aria-busy')==='true'||$('notebook').open||!state||$('advance').hidden)return;
    if(!DIRECTOR && state.readingStop){
      const item=beat(),index=item?.id===state.readingStop?readingStop(item):-1;
      state.readingStop=null;
      if(index>=0){selectOption(index);return}
      render(true);return;
    }
    const line=state.phase==='feedback'?optionAt()?.feedback[state.fb]:beat();
    if(!line)return;
    if(++state.page>=pages(line).length){state.page=0;if(state.phase==='feedback')state.fb++;else state.beat++}
    if(state.scene==='E01-S05' && state.phase==='read' && state.page===0 && beat()?.id==='E01-S05.b08')await approach('hall');
    render(true);
  }
  function remapLegacyId(id='') {
    for(const [from,to] of Object.entries(legacyPrefixes))
      if(id===from || id.startsWith(from+'.'))return to+id.slice(from.length);
    return id;
  }
  function beatForId(sequence,id) {
    const direct=sequence.findIndex(b=>b.id===id);
    if(direct>=0)return direct;
    return sequence.findIndex(b=>(b.options||[]).some(o=>(o.feedback||[]).some(f=>f.id===id)));
  }
  function migrate(saved) {
    if(saved.edition===SAVE_EDITION)return saved;
    const target=book.scenes[saved.scene];
    if(!target)return fresh();
    const original=saved.edition||1;
    const map=id=>original<3?remapLegacyId(id):id;
    saved.flags=[...new Set((saved.flags||[]).map(map))];
    if(saved.missed)saved.missed=[...new Set(saved.missed.map(map))];
    if(saved.selected)saved.selected=map(saved.selected);
    saved.log=(saved.log||[]).map(line=>({...line,id:map(line.id)}));
    saved.visited=[...new Set((saved.visited||[]).filter(id=>book.scenes[id]))];
    if(!saved.visited.includes(saved.scene))saved.visited.push(saved.scene);
    if(saved.nextScene && !book.scenes[saved.nextScene])saved.nextScene=null;

    const sequence=target.beats;
    let index=beatForId(sequence,saved.readingStop||saved.beatId||'');
    if(saved.phase==='feedback' && saved.selected)
      index=sequence.findIndex(b=>(b.options||[]).some(o=>o.id===saved.selected));
    if(index<0 && original<3) {
      const oldChoice=legacyChoices[saved.scene+':'+saved.beat];
      if(oldChoice)index=beatForId(sequence,oldChoice);
    }
    if(index<0) {
      const latest=[...saved.log].reverse().find(line=>line.scene===saved.scene);
      if(latest)index=beatForId(sequence,latest.id);
    }
    saved.beat=saved.phase==='arrive'?0:index>=0 ? index : Math.max(0,Math.min(saved.beat||0,sequence.length));
    saved.page=Math.max(0,saved.page||0);saved.fb=Math.max(0,saved.fb||0);
    if(saved.phase==='feedback' && !optionAtFor(sequence,saved.beat,saved.selected)) {
      saved.phase='read';saved.selected=null;saved.fb=0;saved.page=0;
    }
    saved.edition=SAVE_EDITION;
    return saved;
  }
  function optionAtFor(sequence,index,id) {return sequence[index]?.options?.find(o=>o.id===id)}
  function run(saved) {
    saved=migrate(saved);
    closePanel();state=saved;activeScene='';showingChoices='';audio.start();preferences();render();
  }
  function home(){
    activeScene='';transition=false;state=null;audio.pause(true);window.SeasonFoley.quiet();
    $('resume').hidden=!valid(load(SAVE));only('home');
  }
  $('stage').addEventListener('retryframe',()=>{
    if(!state)return;
    if(state.phase==='arrive' || state.phase==='travel')direction.prepare(scene(),false,!DIRECTOR&&state.phase==='arrive');
    render(true);
  });
  $('enter').onclick=async()=>{
    if(transition||state?.phase!=='arrive'||$('notebook').open)return;
    if(!DIRECTOR && window.SeasonJourney[state.scene]?.threshold){
      transition=true;only('approach');$('stage').classList.add('approaching');
      try{await direction.enterLocation(window.SeasonJourney[state.scene])}
      finally{transition=false;$('stage').classList.remove('approaching')}
    }
    if(state.scene==='E00-S03')await approach('shop');
    state.phase='read';render(true);
  };
  $('route').onclick=()=>{
    const dest=state.nextScene||scene().next;if(transition||!dest)return;
    transition=true;direction.leave(()=>{go(dest);transition=false;render()});
  };
  $('advance').onclick=advance;
  $('resume').onclick=()=>{const saved=load(SAVE);if(valid(saved))run(saved)};
  $('return').onclick=home;
  $('start').onclick=()=>{
    if(valid(load(SAVE))) {
      openPanel('重新开始');paragraph('从棠西村口重新开始，会替换这份九章进度。');
      menuButton('从头开始',()=>{store(LAST,null);run(fresh())});menuButton('保留进度',closePanel);
    } else run(fresh());
  };
  function openPanel(title) {
    $('panelTitle').textContent=title;$('panelBody').replaceChildren();
    if(!$('notebook').open){$('notebook').showModal();document.body.classList.add('paused');window.SeasonInvestigation?.suspend();window.SeasonFoley.quiet();audio.pause(true)}
  }
  function closePanel(){if($('notebook').open)$('notebook').close()}
  $('notebook').addEventListener('close',()=>{document.body.classList.remove('paused');audio.pause(!state)});
  $('close').onclick=closePanel;
  function paragraph(text,detail) {
    const p=document.createElement('p');p.textContent=text;
    if(detail){const sm=document.createElement('small');sm.textContent=detail;p.append(sm)}
    $('panelBody').append(p);
  }
  function menuButton(text,action) {
    const b=document.createElement('button');b.textContent=text;b.onclick=action;$('panelBody').append(b);
  }
  function journal() {
    openPanel('外拍手记');const entries=Object.values(state.records);
    if(!entries.length)paragraph('还没有入档的材料。');
    const label={public:'获准公开',private:'仅供核对',withdrawn:'已经撤回',returned:'已归还'};
    for(const r of entries) paragraph(r.title,[label[r.scope],r.holder,r.detail,book.scenes[r.scene]?.place].filter(Boolean).join('　·　'));
    menuButton('返回菜单',menu);
  }
  function menu() {
    if(transition)return;
    openPanel('暂停');menuButton('继续游戏',closePanel);menuButton('外拍手记　'+Object.keys(state.records).length,journal);
    menuButton('回看走过的地点',()=>{
      openPanel('走过的地点');for(const id of state.visited.slice().reverse()){
        const s=book.scenes[id];menuButton(s.time+'　'+s.place+'　·　'+sceneTitle(s),()=>visitSite(id));
      }menuButton('返回菜单',menu);
    });
    menuButton('回看已读对白',()=>{
      openPanel('场记');for(const l of state.log.slice().reverse())paragraph(l.text,l.speaker+'　·　'+book.scenes[l.scene].place);
      menuButton('返回菜单',menu);
    });
    for(const [key,label] of [['mute','静音'],['reduce','减少动态'],['big','大字']])
      menuButton(label+'　'+(prefs[key]?'开':'关'),()=>{prefs[key]=!prefs[key];store(PREFS,prefs);preferences();menu()});
    if(state.phase==='end' && valid(load(LAST)))
      menuButton('重返终章控制桌',()=>run(load(LAST)));
    menuButton('音乐与制作',()=>{
      openPanel('音乐与制作');
      paragraph('《棠西村秘闻》　夜访','外拍手绘互动小说');
      paragraph('蒸汽、水流与退水　／　rubberduck','OpenGameArt · CC0 · 水声录音剪辑。铁牌取自《七秒以后》原敲击。');
      paragraph('网吧键鼠、硬币、椅脚与硬盘','使用项目收录的 CC0 钥匙、台面、踏步和开关录音重新剪接。');
      paragraph('Dark Walk　／　Kevin MacLeod','Incompetech · CC BY 4.0 · 游戏内裁切、循环及混音');
      for(const [text,url] of [['配乐作者','https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100468'],['CC BY 4.0 授权','https://creativecommons.org/licenses/by/4.0/']]){
        const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener';$('panelBody').append(a,document.createTextNode('　'));
      }
      menuButton('返回菜单',menu);
    });
    menuButton('保存并回到片名',()=>{save();closePanel();home()});
  }
  $('pause').onclick=menu;
  document.addEventListener('keydown',e=>{
    if(e.repeat||e.defaultPrevented||$('notebook').open||!state||!$('reviewSite').hidden)return;
    if(e.key==='Escape'){menu();return}
    if((e.key===' '||e.key==='Enter'||e.key==='ArrowRight') && !$('advance').hidden && !['INPUT','TEXTAREA'].includes(e.target.tagName) && (e.target.tagName!=='BUTTON'||e.target===$('advance'))){e.preventDefault();advance()}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && state && !$('notebook').open)audio.pause(false)});
  preferences();home();
  $('loading')?.setAttribute('hidden','');
  $('start').hidden=false;
})();
