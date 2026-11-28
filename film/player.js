/* One reader position identifies the actual painted shot and the spoken line.
   Camera focus and pagination never alter the world-space positions of the cast. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const stage = $('stage'), world = $('world'), sound = window.passageSound;
  const cast = window.FILM_CAST, chapters = window.FILM_CHAPTERS;
  const records = [], byAddress = new Map(), images = new Map();
  const bookmark = 'tangxi.film.reading.1', preferenceKey = 'tangxi.film.preferences.1';
  const waits = ms => new Promise(resolve => setTimeout(resolve, ms));
  const chapterNames = ['序章','第一章','第二章','第三章','第四章','第五章','第六章','第七章','第八章'];
  const sceneSounds = {
    'E03-S05/coins':'cafe-coin', 'E03-S05/flank':'cafe-mouse-four',
    'E03-S05/parting':'cafe-chair', 'E03-S05/burn':'cafe-drive',
    'E06-S04/bucket-down':'drain'
  };
  const sourceNames = {ordinary:'street',uneasy:'threshold',threat:'night',quiet:'room',relief:'after'};
  const read = (key, fallback) => { try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;} };
  function store(key, value) { try {localStorage.setItem(key,JSON.stringify(value));} catch { /* Private readers can still complete the story. */ } }
  let preferences = read(preferenceKey,{}), saved = read(bookmark,{}), greatest = -1;
  let current = -1, frame = null, busy = false, failed = null, foley = null, transaction = 0, textShot = null;
  function pages(text) {
    const chunks = [];
    let rest = text;
    while (rest.length > 44) {
      const prefix = rest.slice(0,43);
      const ends = [...prefix.matchAll(/[。！？，、：；……！？]/g)].map(m=>m.index+1).filter(n=>n>=19);
      let end = ends.pop() || 40;
      while ('」』”）'.includes(rest.charAt(end)) && end < rest.length) end++;
      chunks.push(rest.slice(0,end)); rest = rest.slice(end);
    }
    if(rest) chunks.push(rest);
    return chunks;
  }
  for(const [chapterIndex,chapter] of chapters.entries()) {
    for (const scene of chapter.scenes) for (const shot of scene.shots) {
      for (const [lineIndex,[name,original,expression]] of shot.lines.entries()) {
        for (const [part,text] of pages(original).entries()) {
          const address=[scene.id,shot.id,lineIndex,part].join('/');
          byAddress.set(address,records.length);
          records.push({chapter,chapterIndex,scene,shot,lineIndex,part,name,text,original,expression,address});
        }
      }
    }
  }
  function loadImage(src) {
    if (!images.has(src)) {
      const task = (async () => {
        const img = new Image();
        img.decoding='async';img.src=src;
        await img.decode();
        return img;
      })().catch(error=>{images.delete(src);throw error;});
      images.set(src,task);
      if (images.size>24) images.delete(images.keys().next().value);
    } else {
      const task=images.get(src);images.delete(src);images.set(src,task);
    }
    return images.get(src);
  }
  const foregrounds = {
    'art/00/tarp.webp':'layers/tarp.webp','art/01/iron.webp':'layers/iron.webp',
    'art/08/table.webp':'layers/table.webp'
  };
  function getCast(r) {
    const ids = r.shot.actors || [];
    return ids.map((id,index)=>{
      const actor=cast[id];
      if (!actor) throw Error('未知演员 '+id);
      const active = actor.name===r.name || (id==='qin' && r.name==='店主');
      // Keep the same take through a sentence. Props are introduced by the
      // particular beat in which they appear; mood alone may not conjure a prop.
      let pose = null;
      for (let i=r.lineIndex;i>=0;i--) {
        const [speaker,,key]=r.shot.lines[i];
        if(speaker===actor.name && actor.faces[key]) {pose=key;break;}
      }
      if (!pose && id==='host' && active) pose = ({ordinary:'open',uneasy:'listen',threat:'worry',relief:'ease',quiet:'listen'})[r.shot.mood];
      if (!pose && active && ['host','qin','xiaomei','xu','acen'].includes(id)) pose = r.shot.emotion;
      const take = r.shot.poses?.[id] || pose;
      return {id, actor, active, side:r.shot.side || (index===0?'left':'right'), src:actor.faces[take]||actor.main};
    });
  }
  function layout(r, actors) {return r.shot.phone?'phone':actors.length>1?'duo':actors.length?'solo':'insert';}
  function subtitles(r,actors,textOnly=false) {
    const count=actors.length, phone=textOnly?null:r.shot.phone;
    const isPhone=phone && r.name.startsWith('手机');
    const label = r.name.startsWith('手机·')?r.name.slice(3):r.name;
    $('speaker').textContent=r.name==='旁白'?'':label;
    $('words').textContent=r.text;
    $('caption').hidden=Boolean(isPhone);
    $('caption').dataset.side=count>1?'center':count===1?(actors[0].side==='right'?'left' :'right'):phone?'left':'center';
    $('phone').hidden=!phone;
    if(phone) {
      const type=r.shot.phone, isClip=type!=='inbox' && r.scene.id==='E00-S01';
      $('phone').dataset.type=type;
      $('phone').querySelector('.phone-head').textContent=type==='inbox'?'‹　私信':type==='post'?'夜访　　作品':'‹　投稿原件';
      $('clip').hidden=!isClip;
      if(isClip)$('clip').src='art/00/clip.webp';
      $('account').textContent=isPhone?label:(type==='inbox'?'会话记录':type==='post'?'@夜访':'橙子　发给你的原件');
      $('message').textContent=isPhone?r.text:(type==='post'?'整条巷，没人开门。':type==='inbox'?'已送达':'');
      $('clipTime').textContent=isClip?'00:07　━━━━━━　00:07':type==='clip'?'❚❚　 ──●────　原声':'';
    }
    const next=records[current+1];
    const invitation=window.FilmScript.actions[r.scene.id+'/'+r.shot.id];
    const showAction=invitation && (invitation.line===undefined ? next?.shot!==r.shot : r.lineIndex===invitation.line && next?.lineIndex!==r.lineIndex);
    $('action').hidden=!showAction;
    $('action').textContent=showAction?invitation.label:'';
    $('next').hidden=Boolean(showAction);
    $('advance').setAttribute('aria-label',showAction?invitation.label:'继续阅读');
  }
  function actorNode(info,img) {
    const div=document.createElement('div'), breath=document.createElement('div');
    div.className='actor '+info.side; div.dataset.actor=info.id;div.dataset.framing=info.actor.framing;
    breath.className='breath';const sprite=img.cloneNode(false);sprite.alt='';breath.append(sprite);div.append(breath);return div;
  }
  function showActors(r, actors, decoded, changed) {
    if (changed) {
      const newFrame=document.createElement('div');
      newFrame.className='frame active';
      const plate=decoded[0].cloneNode(false);plate.className='plate';plate.alt='';newFrame.append(plate);
      actors.forEach((act,i)=>newFrame.append(actorNode(act,decoded[i+1])));
      if (foregrounds[r.shot.image]) {
        const fg=decoded.at(-1).cloneNode(false);fg.className='foreground';fg.alt='';newFrame.append(fg);
      }
      const previous=frame;
      world.append(newFrame);frame=newFrame;
      requestAnimationFrame(()=>requestAnimationFrame(()=>newFrame.classList.add('arrived')));
      if (previous) {
        previous.classList.add('leaving');
        setTimeout(()=>previous.remove(),450);
      }
    } else {
      actors.forEach((act,i)=>{
        const node=frame.querySelectorAll('.actor img')[i];
        if (node && node.getAttribute('src')!==act.src) node.replaceWith(decoded[i+1].cloneNode(false));
      });
    }
    actors.forEach((info,i)=>{
      const node=frame.querySelectorAll('.actor')[i];
      node.classList.toggle('speaker',info.active);
      node.classList.toggle('listener',!info.active && actors.some(a=>a.active));
    });
    const on=actors.find(a=>a.active);
    stage.dataset.focus=on?.side||'none';
    // Foreground shoulders move farther than shop walls in a small real pan.
    world.style.setProperty('--pan-x', (!preferences.still && on && actors.length>1 ? (on.side==='right'?-8:7) : 0)+'px');
  }
  function stopFx(){if(foley){foley.pause();foley=null;}}
  function playFile(file) {
    stopFx(); if(preferences.muted || document.hidden) return;
    foley=new Audio('../season/foley/'+file+'.m4a');foley.volume=.43;foley.play().catch(()=>{});
  }
  function audio(r,first) {
    const ch=r.chapterIndex;
    const interior= /楼梯|饭厅|卧室|网吧|柜台|三〇二|302|201|机房|地下|走道|值班室|楼板|屋里|出租房|剪辑桌/.test(r.scene.place);
    const zone=ch===3 && /网吧|机房|柜台/.test(r.scene.place)?'cafe':interior?'hall':/今宵便利|便利店/.test(r.scene.place)?'shop':'road';
    sound?.zone(zone);sound?.fieldAllowed(!['threat','uneasy'].includes(r.shot.mood) && (ch<2 || ch===4 || ch===7));
    let score=sourceNames[r.shot.mood]||'room';
    if(ch===6 && r.shot.mood==='threat')score='water';
    if(ch===8 && r.scene.id==='E08-S04')score='broadcast';
    if(['contact','loss','stop-at-the-door','lights'].includes(r.shot.id))score='silence';
    sound?.story(r.scene,{id:r.scene.id+'.'+r.shot.id,score});
    if(!first || preferences.muted || document.hidden)return;
    const cue=r.shot.cue;
    const eventSound=sceneSounds[r.scene.id+'/'+r.shot.id];
    if(eventSound)playFile(eventSound);
    else if(cue==='iron' && r.scene.id==='E01-S03')sound?.play('iron-three');
    else if(cue==='iron-once' || cue==='iron')playFile('one-strike');
    else if(cue==='water' && r.shot.mood==='threat')playFile('seep');
    else if(cue==='click' && ch===3)playFile('cafe-mouse-two');
    else if(r.shot.id==='freezer')sound?.play('freezer-lid');
    else if(['key','door','paper','click'].includes(cue))sound?.play(({key:'keys',door:'door',paper:'paper',click:'switch'})[cue]);
  }
  function controls(playing) {
    for(const id of ['place','pause','advance'])$(id).hidden=!playing;
    if(!playing)for(const id of ['caption','next','phone','action'])$(id).hidden=true;
  }
  function setSave(finished=false) {
    if(current<0)return;
    greatest=Math.max(greatest,current);
    saved={position:records[current].address,greatest:records[greatest].address,finished};
    store(bookmark,saved);
  }
  function preferenceStyle(){
    stage.classList.toggle('large',Boolean(preferences.large));
    stage.classList.toggle('still',Boolean(preferences.still || matchMedia('(prefers-reduced-motion: reduce)').matches));
    sound?.mute(Boolean(preferences.muted));
  }
  async function render(index, textOnly=false) {
    const r=records[index],previous=records[current];
    if(!r || busy)return;
    if(textOnly)textShot=r.shot;
    else if(textShot!==r.shot)textShot=null;
    textOnly=textShot===r.shot;
    const token=++transaction;busy=true;stage.setAttribute('aria-busy','true');failed=null;$('failure').hidden=true;
    const changed=r.shot!==previous?.shot || !frame || frame.dataset.missing==='yes';
    const moved=r.scene!==previous?.scene;
    let decoded=[],actors=getCast(r);
    try {
      if (!textOnly) {
        const files=[r.shot.image,...actors.map(a=>a.src)];
        if(foregrounds[r.shot.image])files.push(foregrounds[r.shot.image]);
        decoded=await Promise.all(files.map(loadImage));
        if(r.shot.phone && r.scene.id==='E00-S01')await loadImage('art/00/clip.webp');
      }
      if(token!==transaction)return;
      const firstIndex=current<0;
      if(changed)stage.classList.add('turning');
      const cut=changed && !firstIndex && (moved || stage.dataset.layout!==layout(r,actors));
      if(cut){$('shutter').classList.add('dark');await waits(stage.classList.contains('still')?0:230);}
      if(token!==transaction)return;
      current=index;stage.dataset.mode='play';$('home').hidden=true;$('ending').hidden=true;
      stage.dataset.handset=String(!textOnly && r.shot.image==='art/00/handset.webp');
      stage.dataset.layout=textOnly?'insert':layout(r,actors);stage.dataset.mood=r.shot.mood;stage.dataset.scale=r.shot.scale;
      if(textOnly){
        frame=document.createElement('div');frame.className='frame active arrived';frame.dataset.missing='yes';world.replaceChildren(frame);actors=[];
      } else showActors(r,actors,decoded,changed);
      const chapterLabel=r.chapter.title.replace(/^第[一二三四五六七八九]+章[　\s]*/,'');
      $('date').textContent=chapterNames[r.chapterIndex]+' · '+chapterLabel+'　'+r.scene.time;$('location').textContent=r.scene.place;
      const perspective=r.shot.view || (r.shot.id==='relay' && r.chapterIndex===3?'林雨所见':'');
      $('view').textContent=perspective;$('view').hidden=!perspective;
      controls(true);subtitles(r,actors,textOnly);
      audio(r,changed&&r.part===0&&r.lineIndex===0);
      stage.dataset.address=r.address;
      $('shutter').classList.remove('dark');setSave();
      const next=records.find((v,n)=>n>index && v.shot!==r.shot);
      if(next)loadImage(next.shot.image).catch(()=>{});
      if(changed) {
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        if(!stage.classList.contains('still'))await waits(cut?260:300);
      }
    } catch(err) {
      if(token===transaction){failed=index;$('failure').hidden=false;$('shutter').classList.remove('dark');}
      console.warn('本镜未载入',r.address,err.message);
    } finally {if(token===transaction){busy=false;stage.classList.remove('turning');stage.setAttribute('aria-busy','false');}}
  }
  function begin(index) {sound?.start();preferenceStyle();render(index);}
  function advance() {
    if(busy || failed!==null || $('menu').open || stage.dataset.mode!=='play')return;
    if(current+1<records.length){render(current+1);return;}
    setSave(true);stopFx();sound?.pause(true);controls(false);stage.dataset.mode='end';$('ending').hidden=false;$('backHome').focus();
  }
  function home() {
    ++transaction;busy=false;failed=null;textShot=null;current=-1;frame=null;world.replaceChildren();controls(false);
    $('failure').hidden=true;$('ending').hidden=true;$('home').hidden=false;stage.dataset.mode='title';
    $('resume').hidden=!byAddress.has(saved.position) || saved.finished;
  }
  function button(label,act){const el=document.createElement('button');el.textContent=label;el.onclick=act;return el;}
  function menu(tab='history') {
    const dialog=$('menu'),panel=$('panel');
    if(!dialog.open){sound?.pause(true);stopFx();dialog.showModal();}
    dialog.dataset.tab=tab;panel.replaceChildren();
    for(const el of dialog.querySelectorAll('[data-tab]'))el.setAttribute('aria-pressed',String(el.dataset.tab===tab));
    if(tab==='history'){
      const ol=document.createElement('ol');
      const recent=records.slice(0,current+1).filter(r=>r.part===0).slice(-12);
      for(const r of recent){
        const li=document.createElement('li'),name=document.createElement('strong'),words=document.createElement('span');
        name.textContent=r.name;words.textContent=r.original;li.append(name,words);ol.append(li);
      }panel.append(ol);requestAnimationFrame(()=>{panel.scrollTop=panel.scrollHeight;});
    } else if(tab==='chapters'){
      for(const [i,c] of chapters.entries()){
        const idx=records.findIndex(r=>r.chapter===c),title=c.title.replace(/^第[一二三四五六七八九]+章[　\s]*/,'');
        const b=button(chapterNames[i]+'　'+title,()=>{dialog.close();render(idx);});
        b.disabled=idx>greatest;panel.append(b);
      }
    } else {
      for(const [key,on,off] of [['muted','声音已关闭','声音已开启'],['large','较大字号','标准字号'],['still','减少动态已开启','减少动态已关闭']]){
        panel.append(button(preferences[key]?on:off,()=>{preferences[key]=!preferences[key];store(preferenceKey,preferences);preferenceStyle();menu(tab);}));
      }
      const p=document.createElement('p');p.textContent='配乐《Dark Walk》　Kevin MacLeod（incompetech.com）。本作调整了循环、响度及 AAC 编码。';const a=document.createElement('a');
      a.href='https://creativecommons.org/licenses/by/4.0/';a.target='_blank';a.rel='noopener noreferrer';a.textContent='CC BY 4.0';p.append(a);panel.append(p);
    }
  }
  $('start').onclick=()=>begin(0);$('resume').onclick=()=>begin(byAddress.get(saved.position)??0);
  $('advance').onclick=advance;$('action').onclick=advance;$('backHome').onclick=home;
  $('pause').onclick=()=>{if(!busy)menu();};$('closeMenu').onclick=()=>$('menu').close();
  $('menu').addEventListener('close',()=>{sound?.pause(false);$('advance').focus({preventScroll:true});});
  $('menu').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>menu(b.dataset.tab));
  $('retry').onclick=()=>{if(failed!==null)render(failed);};$('readText').onclick=()=>{if(failed!==null)render(failed,true);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopFx();});
  document.addEventListener('keydown',event=>{
    if(stage.dataset.mode!=='play' || $('menu').open || event.repeat)return;
    if(event.key==='Escape' && !busy){menu();return;}
    if(!['Enter',' ','ArrowRight'].includes(event.key) || (event.target instanceof HTMLButtonElement && !['advance','action','start','resume'].includes(event.target.id)))return;
    event.preventDefault();advance();
  });
  greatest=byAddress.get(saved.greatest)??-1;home();preferenceStyle();
})();
