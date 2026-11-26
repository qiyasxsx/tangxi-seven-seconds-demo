(() => {
  'use strict';
  const book=globalThis.TX_SEASON, direction=window.SeasonDirection, audio=window.passageSound;
  const $=id=>document.getElementById(id);
  const SAVE='tangxi.season.v1', PREFS=SAVE+'.prefs', LAST=SAVE+'.console';
  const panels=['home','slate','advance','choices','route','end'];
  let state, transition=false, showingChoices='', lostStorage=false, activeScene='';
  const pages=window.SeasonCaptions.pages;
  function load(key) {try{return JSON.parse(localStorage.getItem(key))}catch{return null}}
  function store(key,value) {
    try {localStorage.setItem(key,JSON.stringify(value))}
    catch {if(!lostStorage){lostStorage=true;notice('浏览器未允许本地存档，本次仍可继续游玩。')}}
  }
  function valid(s) {return !!(s && s.version===1 && book.scenes[s.scene] && Number.isInteger(s.beat) && s.beat>=0 && ['arrive','read','feedback','travel','end'].includes(s.phase) && Array.isArray(s.flags) && Array.isArray(s.log) && s.records)}
  const fresh=()=>({version:1,edition:2,scene:book.start,beat:0,page:0,phase:'arrive',selected:null,fb:0,flags:[],records:{},log:[],visited:[book.start]});
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
  function save(){store(SAVE,state)}
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
    if(window.SeasonInvestigation?.render($('choices'),scene().id,item.prompt,opts,selectOption))return;
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
  function arrival(s) {
    const c=chapter(),mark=direction.arrivalCard(s);only('slate');
    $('slate').classList.toggle('smallArrival',c.scenes[0]!==s.id);
    $('chapterNo').textContent=c.scenes[0]===s.id?mark.time+'　／　'+mark.place:c.title+'　／　'+mark.time;
    $('chapterName').textContent=c.scenes[0]===s.id?c.title:mark.place;
    $('arrive').textContent=s.title;
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
      const b=$('look');b.hidden=false;b.style.left=entry[0]+'%';b.style.top=entry[1]+'%';b.textContent=entry[2];
      b.onclick=()=>{
        state.inspected ||= [];state.inspected.push(s.id);save();b.hidden=true;
        openPanel(entry[2]);paragraph(entry[3]);menuButton('看回现场',closePanel);
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
      if(activeScene!==s.id){activeScene=s.id;direction.prepare(s)}
      if(state.phase==='arrive'){arrival(s);siteMarkers();break}
      if(state.phase==='end'){
        only('end');$('endingTitle').textContent=s.title.replace(/^结局.　/,'');
        $('endingLine').textContent=s.id==='E08-S06'?'车门合上，街坊手里各留着一份。':s.id==='E08-S07'?'周二，柜台的小灯亮着。':'片尾署了名，原片的去向由合同决定。';break
      }
      if(state.phase==='travel'){
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
    const line=state.phase==='feedback'?optionAt()?.feedback[state.fb]:beat();
    if(!line)return;
    if(++state.page>=pages(line).length){state.page=0;if(state.phase==='feedback')state.fb++;else state.beat++}
    if(state.scene==='E01-S05' && state.phase==='read' && state.page===0 && beat()?.id==='E01-S05.b08')await approach('hall');
    render(true);
  }
  function run(saved) {
    // Original saves hold an ordinal. Follow the previous beat past any added
    // dialogue, including feedback and the saved return to the broadcast desk.
    if(!saved.edition){
      const sequence=book.scenes[saved.scene].beats;
      const prior=sequence.filter(b=>!b.pickup);
      const event=prior[saved.beat];
      saved.beat=event?sequence.indexOf(event):sequence.length;
      saved.edition=2;
    }
    closePanel();state=saved;activeScene='';showingChoices='';audio.start();preferences();render();
  }
  function home(){
    activeScene='';transition=false;state=null;audio.pause(true);window.SeasonFoley.quiet();
    $('resume').hidden=!valid(load(SAVE));only('home');
  }
  $('stage').addEventListener('retryframe',()=>{
    if(!state)return;
    if(state.phase==='arrive' || state.phase==='travel')direction.prepare(scene());
    render(true);
  });
  $('enter').onclick=async()=>{
    if(transition||state?.phase!=='arrive'||$('notebook').open)return;
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
      openPanel('重新开始');paragraph('从剪辑桌重新开始，会替换这份九章进度。');
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
        const s=book.scenes[id];menuButton(s.time+'　'+s.place+'　·　'+s.title,()=>visitSite(id));
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
