// All distances are relative to the photographer. Changing speaker moves the camera,
// the sight lines and the depth of field together; it never changes the scenery scale.
(() => {
  'use strict';
  const stage = document.getElementById('stage');
  const near = document.getElementById('near'), far = document.getElementById('far');
  const plates = ['plateA','plateB'].map(id=>document.getElementById(id));
  const shared = '../first-take/art/';
  const cast = {
    林雨:'linFrontListen', 阿琴:'qinStanding', 老许:'xuStanding', 小茵:'xiaoyin',
    老人:'fushun', 粉叔:'cook', 福顺伯:'fushun', 郑国强:'guoqiang', 小梅:'xiaomei',
    老邓:'laodeng', 梁安:'liangan', 陈伯:'chenbo', 黄姨:'huang', 陈姐:'chenjie',
    过弯:'guowan', 周铭:'zhouming', 阿良:'aliang', 罗叔:'luo', 阿哲:'azhe',
    女孩:'girl', 新租客:'azhe', 胖虎:'panghu', 半糖:'bantang', 姑娘:'customer',
    女骑手:'rider', 转租人:'sublessor', 代驾:'driver'
  };
  const publicPose = new Set(['linFrontListen','linBackListen','qinStanding','xuStanding']);
  const portraits={
    linFrontListen:'portraits/host.webp',linBackListen:'portraits/host-back.webp',
    xiaoyin:'portraits/xiaoyin.webp',azhe:'portraits/azhe.webp',guoqiang:'portraits/guoqiang.webp',
    luo:'portraits/luo.webp',huang:'portraits/huang.webp'
  };
  // Registered to the same ink silhouette. Expressions change on a story
  // beat and hold through the reply, without animating the mouth per word.
  const performance={
    xiaoyin:{relief:{file:'portraits/xiaoyin-relief.webp',rect:[.34412,.16136,.28109,.15795]}},
    azhe:{fear:{file:'portraits/azhe-fear.webp',rect:[.39182,.13409,.23339,.13864]}},
    guoqiang:{shame:{file:'portraits/guoqiang-shame.webp',rect:[.36797,.12045,.25724,.15682]}}
  };
  const media = /^(手机|旧带|录音|窗后声音|阿岑的语音)/;
  const narrator = /^(旁白|片尾|动作|声画)$/;
  // A master is the place the reader should still recognise after the text is
  // covered.  It is deliberately separate from the exceptional inserts below:
  // a phone, a hand at the side door, or a subjective check may cut away, but
  // ordinary replies never buy a new all-figure illustration.
  //
  // E00 is the proved template for the rest of the season.  `stop` and `shop`
  // are the approved field plates: the warm sign, green shutter and wet lane
  // are the shared objects that make the long shot and shop-front one place.
  const continuity = {
    'E00-S01': {
      key:'arch', bg:shared+'stop.webp', zone:'road', place:'棠西村口 · 旧厂牌楼',
      near:'linFrontListen', far:null, pan:0, focus:'left',
      inserts:{
        'E00-S01.bus-arrival':{bg:'approaches/village.webp',near:null,far:null,view:''},
        'E00-S01.bus-mic':{bg:'approaches/village.webp',near:'linFrontListen',far:null,view:''},
        'E00-S01.bus-answer':{bg:'approaches/village.webp',near:'linFrontListen',far:null,view:''},
        'E00-S01.first-listen':{bg:'approaches/village.webp',near:null,far:null,view:''}
      },
      phone: line => media.test(line?.speaker||'') || /\.b08\./.test(line?.id||'')
    },
    'E00-S02': {
      key:'arch', bg:shared+'stop.webp', zone:'road', place:'棠西村口 · 旧厂牌楼',
      near:'linFrontListen', far:null, pan:0, focus:'left',
      inserts:{
        'E00-S02.b04':{bg:'art/streets-cut-twine.webp',near:null,far:null,view:'林雨所见'},
        'E00-S02.b07.o2.f1':{bg:'props/alley-empty.webp',near:null,far:null,view:'阿岑所见',pan:0},
        'E00-S02.b08':{bg:'props/alley-empty.webp',near:null,far:null,view:'阿岑所见',pan:0},
        'E00-S02.b09':{bg:'art/retake-arch-fingertips.webp',near:null,far:null,view:'阿岑所见',pan:0}
      }
    },
    'E00-S03': {
      key:'shop', bg:shared+'shop.webp', zone:'shop', place:'今宵便利 · 沿街铺面',
      near:'linBackListen', far:'qinStanding',
      inserts:{
        // The only early cut-away: it proves which narrow door is being
        // discussed, then the next ordinary reply returns to the shared plate.
        'E00-S03.b02':{bg:'art/streets-cut-crate.webp',near:null,far:null,pan:0},
        'E00-S03.b06':{bg:shared+'side.webp', near:null, far:null, actors:false,
          view:'林雨所见', pan:0, focus:'left', cut:'insert'}
      }
    }
  };
  let sceneId='', requested='', generation=0, active=0, lastCue='', lastFoley='';
  const reduced = ()=>document.body.classList.contains('reduce');
  function sceneArt(scene) {
    return (window.TX_SEASON_ART || window.SEASON_ART || {})[scene.id] || {};
  }
  const layerHolders=plates.map(plate=>{
    const holder=document.createElement('div');
    holder.className='shotLayers';plate.after(holder);
    return holder;
  });
  const fieldFocus=document.createElement('div');
  fieldFocus.className='fieldFocus';
  document.getElementById('scenery').append(fieldFocus);
  // Local practical light and vapour share the coordinates of the painted object.
  const paintedEyelines={
    'streets-cut-lunch':{'林雨':[40,12,23],'阿岑':[45,8,20]},
    'neighbors-cut-daughter-door':{'小梅':[32,11,25]},
    'neighbors-cut-father-table':{'福顺伯':[38,10,31],'林雨':[42,12,29]},
    'neighbors-cut-comes-back':{'姑娘':[36,13,29],'黄姨':[39,15,27]},
    'streets-cut-old-phone':{'小茵':[36,17,27],'林雨':[39,16,27]},
    'broadcast-cut-offer':{'周铭':[25,11,26]},
    'broadcast-cut-courier-map':{'林雨':[44,12,25],'女骑手':[41,13,25]}
  };
  const practicals={
    'cafe-cut-seated':['crt',48,37,15,18],
    'cafe-cut-four-friends':['crt',48,37,15,18],
    'retake-umbrella-stove':['steam',5,53,6,12],
    'streets-cut-second-bite':['steam',13,37,7,14],
    'flood-cut-ebb':['puddle',64,83,32,6],
    'neighbors-cut-father-daughter':['porcelain',48,61,5,12]
  };
  let requestedFrame='', displayedPlate='', frameReady=Promise.resolve(true), composition=0;
  const actorLoads=new Map();
  const retryPlate=document.getElementById('retryPlate');
  function paint(url,layers=[]) {
    if(!url)return;
    const plateKey=JSON.stringify([url,layers]);
    const actors=[...actorLoads.values()];
    const key=JSON.stringify([plateKey,...actors.map(actor=>actor.src)]);
    if(key===requestedFrame)return;
    requestedFrame=key;requested=url;
    retryPlate.hidden=true;
    stage.setAttribute('aria-busy','true');
    const turn=++generation;
    const load=src=>{const img=new Image();img.src=src;return img.decode().then(()=>img)};
    const scenery=displayedPlate===plateKey ? Promise.resolve(null) :
      Promise.all([load(url),...layers.map(layer=>load(layer.src))]);
    frameReady=Promise.all([scenery,...actors.map(actor=>actor.ready)]).then(([pictures,...ready])=>{
      if(turn!==generation)return false;
      if(ready.includes(false))throw new Error('Portrait unavailable');
      if(!pictures){stage.removeAttribute('aria-busy');return true}
      const [image,...images]=pictures;
      const next=1-active,target=plates[next],holder=layerHolders[next];
      holder.replaceChildren(...images.map((img,i)=>{
        const layer=layers[i];
        img.className='shotLayer';img.dataset.motion=layer.motion||'still';
        Object.assign(img.style,{left:(layer.x??0)+'%',top:(layer.y??0)+'%',width:(layer.w??100)+'%',height:(layer.h??100)+'%'});
        return img;
      }));
      const field=practicals[url.split('/').pop().replace(/\.(?:webp|jpe?g)$/,'')];
      if(field){
        const [type,x,y,w,h]=field, light=document.createElement('i');
        light.className='practical '+type;
        Object.assign(light.style,{left:(x-w/2)+'%',top:(y-h/2)+'%',width:w+'%',height:h+'%'});
        holder.append(light);
      }
      if(url.endsWith('/neighbors-cut-permissions.webp')){
        const columns=[['可公开','小茵 · 门轴'],['仅供核对','郑家 · 照护簿'],['已经取回','改衣局部照']];
        columns.forEach(([title,detail],index)=>{
          const heading=document.createElement('div'),small=document.createElement('small');
          heading.className='edit-bin';heading.style.left=[39.4,54.5,69.3][index]+'%';
          heading.textContent=title;small.textContent=detail;heading.append(small);holder.append(heading);
        });
      }
      target.src=image.src;
      target.classList.add('on');holder.classList.add('on');
      plates[active].classList.remove('on');layerHolders[active].classList.remove('on');
      active=next;displayedPlate=plateKey;stage.removeAttribute('aria-busy');return true;
    }).catch(()=>{
      if(turn===generation){
        requestedFrame='';retryPlate.hidden=false;
        retryPlate.onclick=()=>stage.dispatchEvent(new Event('retryframe'));
      }
      return false;
    });
  }
  function framing(scene,line,page=0) {
    const cuts=window.SeasonCuts||{};
    const id=line?.id;
    const entries=[cuts[scene.id], id && cuts[id], id && cuts[id+'~'+page]];
    const shot={};
    for(const entry of entries){
      if(!entry)continue;
      // A replacement plate owns its props. An incremental change of focus,
      // caption or sound keeps the layers on the plate already in the lens.
      if(entry.bg)Object.assign(shot,{layers:[],near:null,far:null});
      Object.assign(shot,entry);
    }
    return shot;
  }
  function continuityFrame(scene,line,base,shot={}) {
    const rule=continuity[scene.id];
    if(!rule)return {cut:base,shot,rule:null,phone:false};
    const insert=rule.inserts?.[line?.id];
    if(insert) {
      const cut={...base,...insert};
      return {cut,shot:{...shot,bg:insert.bg,actors:false},rule,phone:false};
    }
    // Keep the camera on the scene master for dialogue, choice feedback and
    // resume.  Explicit insert records above remain the only way to break it.
    const {inserts,phone,...master}=rule;
    const cut={...base,...master,layers:undefined,cut:'master'};
    return {cut,shot:{...shot,bg:master.bg,actors:true},rule,phone:!!phone?.(line)};
  }
  // While the player reads, request the next known plate at low priority.
  // Decisions keep their possible replies unloaded until the player commits.
  const warmed=new Set();
  function warmPlate(src) {
    if(!src||src===requested||warmed.has(src)||navigator.connection?.saveData)return;
    warmed.add(src);
    const preview=new Image();preview.fetchPriority='low';
    preview.onerror=()=>warmed.delete(src);
    preview.src=src;
  }
  function warm(scene,line,page=0) {
    if(!line || navigator.connection?.saveData)return;
    const cut=continuityFrame(scene,line,framing(scene,line,page)).cut;
    for(const src of [cut.bg,...(cut.layers||[]).map(l=>l.src)])warmPlate(src);
  }
  function locationCard(scene,cut) {
    document.getElementById('calendar').textContent=cut.date||scene.time;
    document.getElementById('locationName').textContent=cut.place||scene.place;
  }
  function roomTone(zone) {
    stage.dataset.weather=['road','outside'].includes(zone)?'street':'inside';
    window.passageSound.zone(zone);
  }
  function showActor(rig,pose,hearing,expression='') {
    rig.classList.toggle('hearing',!!hearing);
    if(!pose){rig.classList.remove('lit','newFace');actorLoads.delete(rig);delete rig.dataset.pose;return}
    const fresh=rig.dataset.pose!==pose;
    if(fresh || actorLoads.get(rig)?.failed) {
      rig.dataset.pose=pose;rig.classList.remove('newFace');
      const src=portraits[pose]||(publicPose.has(pose)?shared+pose+'.webp':'cast/'+pose+'.webp');
      const img=rig.querySelector('img'),actor={src,failed:false};
      actorLoads.set(rig,actor);rig.style.visibility='hidden';
      rig.querySelector('i').style.backgroundImage='none';
      img.src=src;
      actor.ready=img.decode().then(()=>{
        if(actorLoads.get(rig)!==actor)return false;
        rig.style.removeProperty('visibility');return true;
      },()=>{actor.failed=true;return false});
      rig.classList.toggle('full',pose==='qinStanding'||pose==='xuStanding');
      void rig.offsetWidth;
      rig.classList.add('newFace','lit');
    }
    const localFace=performance[pose]?.[expression];
    const patch=localFace||window.TAKE_CAST_PLATES?.faces[pose]?.[expression], overlay=rig.querySelector('i');
    if(pose==='linFrontListen'){
      const concerned=['curious','brow','firm','concern'].includes(expression);
      Object.assign(overlay.style,{inset:'0',width:'100%',height:'100%',
        backgroundImage:'url("portraits/host-concern.webp")',opacity:concerned?'1':'0'});
      return;
    }
    overlay.style.removeProperty('inset');
    if(patch) {
      const [x,y,w,h]=patch.rect;
      Object.assign(overlay.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%',backgroundImage:'url("'+(localFace?'':'../first-take/')+patch.file+'")',opacity:'1'});
    } else {overlay.style.opacity='0';overlay.style.backgroundImage='none'}
  }
  const acoustic = place => /便利|柜台|粉摊|档|改衣铺|茶饮/.test(place)?'shop':/站|牌楼|街|巷口|楼前|桥底|楼顶|后巷/.test(place)?'road':/地下|楼梯|缓台|入口|铁梯/.test(place)?'hall':'room';
  function recordShot(scene,read,page) {
    const data=sceneArt(scene);
    let shot=data;
    for (const l of read) for(const s of data.shots||[]) {
      const [id,from]=s.at.split('~');
      if(l.id===id && (l!==read.at(-1) || page>=Number(from||0)))shot=s;
    }
    const result={...data,...shot};
    if(scene.id==='E00-S01' && shot.bg===shared+'clipBefore.webp')result.bg=data.bg;
    return result;
  }
  function arrivalCard(scene){
    const cut=framing(scene);
    return {time:cut.date||scene.time,place:cut.place||scene.place};
  }
  function prepare(scene,revisit=false,arriving=false) {
    composition++;
    const fresh=sceneId!==scene.id;
    if(fresh){window.SeasonDoorway.clear();sceneId=scene.id;lastCue='';lastFoley='';showActor(near);showActor(far)}
    let cut=(revisit && window.SeasonRevisits?.[scene.id]) || framing(scene);
    // A revisit is evidence of the original location, so leave its intentionally
    // empty plate alone.  Normal entry starts on the declared master.
    if(!revisit)cut=continuityFrame(scene,null,cut).cut;
    if(revisit){showActor(near);showActor(far)}
    const zone=cut.zone||acoustic(scene.place);
    stage.dataset.chapter=scene.chapter;
    stage.dataset.scene=scene.id;
    window.passageSound.fieldAllowed(scene.id!=='E01-S03');
    roomTone(zone);window.passageSound.story(scene,null);locationCard(scene,cut);
    stage.dataset.mood=cut.mood||'';stage.dataset.moment='';stage.dataset.frame='';stage.dataset.light=window.SeasonLight(scene.id);
    const art=sceneArt(scene);
    const entry=arriving && !revisit && window.SeasonJourney[scene.id];
    paint(entry?.wide||cut.bg||art.bg,entry?[]:cut.layers);
    if(entry?.threshold)warmPlate(entry.threshold);
    stage.dataset.phone='';stage.dataset.medium='';stage.dataset.continuity='';
    delete stage.dataset.paintedFocus;delete stage.dataset.print;delete stage.dataset.margin;
    document.getElementById('phoneReplay').hidden=true;
    camera(0);
    stage.dataset.depth='site';
    return cut;
  }
  function camera(amount) {
    for(const [property, factor] of [['--camera',.36],['--far',.66],['--near',1.12]])
      stage.style.setProperty(property,(factor*amount)+'vw');
  }
  function compose(scene,line,history,playCue=false,page=0,decision=null) {
    const turn=++composition;
    let shot=recordShot(scene,history,page), text=line?.text || '', name=line?.speaker || '';
    let cut=framing(scene,line,page);
    const cuts=window.SeasonCuts;
    // Inserted reaction lines stay with the previous filmed moment. Going
    // back to the scene's default master used to put dinner guests on stairs.
    if(line && !cuts[line.id] && !cuts[line.id+'~'+page] &&
       !/^E\d+-S\d+\.b\d+/.test(line.id)){
      const prev=history.slice(0,-1).reverse().find(l=>cuts[l.id]||cuts[l.id+'~0']);
      if(prev){
        let finalPage=0;
        for(let i=1;i<20;i++)if(cuts[prev.id+'~'+i])finalPage=i;
        cut=framing(scene,prev,finalPage);delete cut.caption;delete cut.layout;cut.cue='';
      }
    }
    if(decision){
      const setup=window.SeasonCuts?.[decision.id];
      if(setup?.bg)Object.assign(cut,{layers:[],near:null,far:null});
      Object.assign(cut,setup);
    }
    const held=continuityFrame(scene,line,cut,shot);
    cut=held.cut;shot=held.shot;
    const picture=cut.bg||shot.bg;
    const anchor=paintedEyelines[picture?.split('/').pop()?.replace(/\.(?:webp|jpe?g)$/,'')]?.[name];
    if(!decision && anchor && !cut.caption && !cut.layout){cut.caption=anchor;cut.pan??=(name==='林雨'?1:-1)}
    window.passageSound.fieldAllowed(scene.id!=='E01-S03' && !(scene.id==='E01-S02' && cut.zone==='outside'));
    roomTone(cut.zone||acoustic(scene.place));window.passageSound.story(scene,line);
    locationCard(scene,cut);
    stage.dataset.frame=line?.id||'';stage.dataset.light=window.SeasonLight(scene.id,history,page);
    stage.dataset.mood=cut.mood||'';
    stage.dataset.caption=cut.caption?.join(',')||'';
    const reached=(id,from=0)=>history.some((l,i)=>l.id===id && (i<history.length-1 || page>=from));
    stage.dataset.moment=reached('E01-S03.b02',2)||reached('E08-S02.b07')?'signal':
      reached('E06-S02.b03',1)?'tank':reached('E06-S03.b04',1)?'rising':reached('E06-S04.b06',1)?'ebb':'';

    if(cut.moment!==undefined)stage.dataset.moment=cut.moment;
    const replay=scene.id==='E00-S01' && line?.id.includes('.b08.o');
    const phoneUI=held.phone || replay || cut.medium==='inbox';
    const directMessage=cut.medium==='inbox' || (phoneUI && /店家的儿子|水果头像/.test(name));
    stage.dataset.medium=phoneUI?(directMessage?'inbox':'clip'):cut.view==='机内回放'?'playback':'';
    if(phoneUI){
      const phone=document.getElementById('phoneReplay');
      phone.querySelector('i').textContent=directMessage?'‹　'+(cut.thread||'私信　·　'+name.split('·').pop()):replay?'‹　投稿原件':'‹　夜访　／　作品';
      phone.querySelector('small').textContent=directMessage?'发消息…':'00:07　━━━━━━　00:07';
    }
    stage.dataset.continuity=held.rule?.key||'';
    stage.dataset.phone=phoneUI?'on':'';
    document.getElementById('phoneReplay').hidden=!phoneUI;
    const recent=history.filter(l=>l.speaker!=='片尾');
    let counterpart='';
    for (const l of recent) {
      if(/按约带两人走到楼口|她一个人走|店门已经关了|她在外地收到|回到302|回到三〇二/.test(l.text))counterpart='';
      if(cast[l.speaker] && l.speaker!=='林雨') counterpart=cast[l.speaker];
      if(/阿婆把伞柄|阿婆从伞|伞沿底下/.test(l.text)) counterpart='granny';
      if(/没有人影|桌边谁也没坐|已经走远|阿婆离开/.test(l.text)) counterpart='';
    }
    const layout=media.test(name)?'message':name&&!narrator.test(name)?'speech':'action';
    let left='',right='';
    if(shot.actors!==false && layout!=='message' && name!=='片尾') {
      if(counterpart){left='linBackListen';right=counterpart}
      else if(name==='林雨' || name==='阿岑' || recent.some(b=>b.speaker==='林雨')) left='linFrontListen';
    }
    let lookingRight=!!right && cast[name]===right;
    if(scene.chapter==='E03' && !reached('E03-S05.b08',2) && right==='liangan')right='liangan-suit';
    if(scene.id==='E03-S05' && reached('E03-S05.b08',2)){right='liangan';lookingRight=true}
    if((scene.id==='E03-S05' && /阿岑把拍完的一局/.test(text)) ||
       (scene.id==='E01-S05' && /阿岑只看见自己映/.test(text)))right='';
    if(cut.near!==undefined)left=cut.near;
    if(cut.far!==undefined)right=cut.far;
    if(scene.id==='E00-S01' && ['E00-S01.b01','E00-S01.b02'].includes(line?.id))left='';
    // A line belongs to its speaker. A held master can prescribe where to look
    // for a gesture, but must not keep a listener in focus through their reply.
    const speakerPose=cast[name];
    const speakingFar=right && (speakerPose===right || (name==='梁安'&&right==='liangan-suit'));
    lookingRight=layout==='speech' && (speakingFar||name==='林雨') ? !!speakingFar : cut.focus==='right';
    let expr='';
    if(left==='linFrontListen') {
      if(scene.id==='E00-S01')expr=reached('E00-S01.b05')?'concern':'welcome';
      else if(/各位晚上好|欢迎|晚饭|鸡腿|吃饭|大家好|你打/.test(text))expr='welcome';
      else if(/怪|不见|害怕|别拍|没看见|听不见/.test(text))expr='brow';
      else if(/？|吗|什么/.test(text))expr='curious';
      else if(/答应|不播|我写的|同意/.test(text))expr='firm';
    }
    showActor(near,left,lookingRight,cut.nearFace||expr);
    let reaction=cut.farFace || (lookingRight && /？|怎么/.test(text)?'brow':'');
    if(right==='xiaoyin' && (reached('E01-S01.b10') || reached('E04-S03.sit-five')))reaction='relief';
    if(right==='azhe' && (reached('E06-S01.deposit') || scene.id==='E06-S04'))reaction='fear';
    if(right==='guoqiang' && (scene.id==='E02-S05' || reached('E02-S03.b06')))reaction='shame';
    showActor(far,right,right && !lookingRight && layout==='speech',reaction);
    paint(picture,cut.layers);
    const plateName=picture?.split('/').pop().replace(/\.(?:webp|jpe?g)$/,'');
    const faces=!left && !right && !phoneUI && window.SeasonEyes?.[plateName];
    const eye=faces && layout==='speech' && faces[name];
    const space=faces && window.SeasonMargins?.[plateName];
    // Reserve room for a full page before the first line on a painting.
    // The same picture must not shrink when a longer reply comes in.
    const size=parseFloat(getComputedStyle(document.getElementById('words')).fontSize)||24;
    const charsPerLine=space && Math.floor(innerWidth*space[2]/100/(size*1.06));
    const required=charsPerLine && size*(1.6*Math.ceil(59/charsPerLine)+1.45);
    const margin=space && charsPerLine && required<=innerHeight*space[3]/100 ? space : null;
    // The caption rail is an actual strip outside the painting. It stays for
    // the entire exposure, including the narrator, so a reply never crops a face.
    stage.dataset.print=faces ? (margin?'open':'rail') : '';
    stage.dataset.margin=margin?margin.join(','):'';
    stage.style.setProperty('--voice-x',(eye?Math.max(7,Math.min(55,eye[0]-17)):8)+'%');
    if(eye){
      fieldFocus.style.setProperty('--eye-x',eye[0]+'%');
      fieldFocus.style.setProperty('--eye-y',eye[1]+'%');
      stage.dataset.paintedFocus=name;
    } else delete stage.dataset.paintedFocus;
    stage.dataset.depth=(left||right)?'people':'site';
    const view=document.getElementById('viewpoint');
    const paintedGhost=shot.bg && /umbrella-shelter|umbrella-strike|queue-double|witness-visitors/.test(shot.bg);
    const cameraFile=/机内画面|阿岑把拍完的一局|阿岑的预监/.test(text);
    const witness=right && ['fushun','xiaomei','liangan','liangan-suit','aliang','granny'].includes(right);
    view.hidden=!(cameraFile||paintedGhost||witness);
    view.textContent=cameraFile?'机内回放': '林雨所见';
    if(cut.view!==undefined){view.textContent=cut.view;view.hidden=!cut.view}
    stage.dataset.focus=lookingRight?'right':'left';
    const speechPan=left && right && (speakingFar||name==='林雨') && layout==='speech';
    camera(eye ? (50-eye[0])*.09 : speechPan ? (lookingRight?-5.55:5.55) : cut.pan??0);
    stage.dataset.shot=shot.at || 'establish';
    const soundPage=window.SeasonCuts?.[line?.id+'~'+page];
    const pageContact=soundPage?.cue !== undefined || line?.id==='E06-S04.b01';
    const cueId=pageContact ? line.id+'~'+page : line?.id;
    if(playCue && line && lastCue!==cueId)frameReady.then(visible=>{
      if(!visible||turn!==composition||stage.dataset.mode!=='advance')return;
      if(lastFoley!==line.id){window.SeasonFoley.perform(line);lastFoley=line.id}
      const contact=line.id==='E06-S04.b01' ? ['keys','latch'][page] : null;
      const cue=cut.cue!==undefined?cut.cue:contact||(/三响|敲三下|铁牌连响/.test(text)?'iron-three':/提手比盖沿|柜盖响/.test(text)?'freezer-lid':
        /锁舌退出|门闩落下/.test(text)?'latch':/钥匙响|钥匙串轻轻/.test(text)?'keys':
        /纸袋.*滑|折好转交清单|撕下回单/.test(text)?'paper':/电视.*雪花/.test(text)?'tv-noise':null);
      if(cue){lastCue=cueId;if(!window.SeasonFoley.contact(cue))window.passageSound.play(cue)}
    });
    if(replay)return 'message';
    if(faces && !margin)return 'rail';
    if(eye && margin)return 'speech';
    if(cut.layout)return cut.layout;
    if(cut.caption && layout==='speech')return 'speech';
    if(name==='阿岑' || (layout==='speech' && (!left&&!right || !cast[name])))return 'offscreen';
    return layout;
  }
  async function enterLocation(route) {
    if(!route?.threshold||route.threshold===route.wide)return;
    const world=document.getElementById('world');
    world.style.transformOrigin=route.centre[0]+'% '+route.centre[1]+'%';
    stage.classList.add('following');
    if(!reduced())await new Promise(resolve=>setTimeout(resolve,420));
    paint(route.threshold);
    await frameReady;
    if(!reduced())await new Promise(resolve=>setTimeout(resolve,660));
    stage.classList.remove('following');
  }
  function travel(scene) {
    const art=sceneArt(scene);
    const pos=art.exit || [73,63];
    const button=document.getElementById('route');
    button.style.left=(Array.isArray(pos)?pos[0]:73)+'%';
    button.style.top=(Array.isArray(pos)?pos[1]:63)+'%';
    camera(-1.4);
  }
  function leave(done,advanceThroughSpace=true) {
    const veil=document.getElementById('veil'),world=document.getElementById('world');
    const exit=sceneArt(globalThis.TX_SEASON.scenes[sceneId]).exit || [66,55];
    world.style.transformOrigin=exit[0]+'% '+exit[1]+'%';
    if(advanceThroughSpace){stage.classList.add('walking');camera(-2.4)}
    setTimeout(()=>veil.classList.add('dark'),reduced()||!advanceThroughSpace?0:245);
    setTimeout(()=>{
      done();stage.classList.remove('walking');window.SeasonFoley.quiet();
      const unveil=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>veil.classList.remove('dark')));
      frameReady.then(unveil,unveil);
    },reduced()?0:advanceThroughSpace?585:325);
  }
  async function approach(place) {
    showActor(near);showActor(far);camera(0);
    stage.dataset.depth='site';
    paint(shared+place+'.webp');
    let light=false;
    if(place==='hall')window.TAKE_AIR={footfall(){
      if(light)return;light=true;paint(shared+'hallLit.webp');window.passageSound.play('switch');
    }};
    try {await window.SeasonDoorway.play(place)}
    finally {if(place==='hall')delete window.TAKE_AIR}
    // The approaching drawing and the speaking drawing share the same eye
    // point. Hold the landing frame as the dialogue takes over the camera.
    stage.classList.add('lensHeld');far.classList.add('matchCut');
    showActor(far,place==='hall'?'xuStanding':'qinStanding',false);
    far.classList.remove('newFace');void far.offsetWidth;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      far.classList.remove('matchCut');stage.classList.remove('lensHeld');
    }));
  }
  window.SeasonDirection={prepare,compose,travel,leave,approach,enterLocation,warm,arrivalCard};
})();
