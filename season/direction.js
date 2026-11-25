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
  const media = /^(手机|旧带|录音|窗后声音|阿岑的语音)/;
  const narrator = /^(旁白|片尾|动作|声画)$/;
  let sceneId='', requested='', generation=0, active=0, lastCue='', lastFoley='';
  const reduced = ()=>document.body.classList.contains('reduce');
  function sceneArt(scene) {
    return (window.TX_SEASON_ART || window.SEASON_ART || {})[scene.id] || {};
  }
  function paint(url) {
    if (!url || requested===url) return;
    requested=url;
    const turn=++generation, target=plates[1-active];
    const preload=new Image();
    preload.onload=async()=>{
      try {await preload.decode()} catch {}
      if(turn!==generation)return;
      target.src=url; target.classList.add('on');plates[active].classList.remove('on');active=1-active;
    };
    preload.onerror=()=>{if(turn===generation){requested='';console.error('场景图未能载入',url);}};
    preload.src=url;
  }
  function showActor(rig,pose,hearing,expression='') {
    rig.classList.toggle('hearing',!!hearing);
    if(!pose){rig.classList.remove('lit','newFace'); delete rig.dataset.pose;return}
    const fresh=rig.dataset.pose!==pose;
    if(fresh) {
      rig.dataset.pose=pose;rig.classList.remove('newFace');
      const src=publicPose.has(pose)?shared+pose+'.webp':'cast/'+pose+'.webp';
      rig.querySelector('img').src=src;
      rig.classList.toggle('full',pose==='qinStanding'||pose==='xuStanding');
      void rig.offsetWidth;
      rig.classList.add('newFace','lit');
    }
    const patch=window.TAKE_CAST_PLATES?.faces[pose]?.[expression], overlay=rig.querySelector('i');
    if(patch) {
      const [x,y,w,h]=patch.rect;
      Object.assign(overlay.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%',backgroundImage:'url("../first-take/'+patch.file+'")',opacity:'1'});
    } else overlay.style.opacity='0';
  }
  const acoustic = place => /便利|柜台|粉摊|档|改衣铺|茶饮/.test(place)?'shop':/站|牌楼|街|巷口|楼前|桥底|楼顶|后巷/.test(place)?'road':/地下|楼梯|缓台|入口|铁梯/.test(place)?'hall':'room';
  function recordShot(scene,read) {
    const data=sceneArt(scene);
    let shot=data;
    for (const l of read) for(const s of data.shots||[]) {
      if(s.match && l.text.includes(s.match))shot=s;
    }
    const result={...data,...shot};
    if(scene.id==='E00-S01' && shot.bg===shared+'clipBefore.webp')result.bg=data.bg;
    return result;
  }
  function prepare(scene) {
    const fresh=sceneId!==scene.id;
    if(fresh){window.SeasonDoorway.clear();sceneId=scene.id;lastCue='';lastFoley='';showActor(near);showActor(far)}
    const zone=acoustic(scene.place);
    stage.dataset.weather=zone==='road'?'street':'inside';
    stage.dataset.chapter=scene.chapter;
    stage.dataset.scene=scene.id;
    window.passageSound.zone(zone);
    const art=sceneArt(scene);
    paint(art.bg);
    camera(0);
    stage.dataset.depth='site';
  }
  function camera(amount) {
    for(const [property, factor] of [['--camera',.36],['--far',.66],['--near',1.12]])
      stage.style.setProperty(property,(factor*amount)+'vw');
  }
  function compose(scene,line,history,playCue=false) {
    const shot=recordShot(scene,history), text=line?.text || '', name=line?.speaker || '';
    paint(shot.bg);
    const cues=history.map(l=>l.text).join(' ');
    stage.dataset.moment=scene.id==='E01-S03' && /店里拖把杆倒/.test(cues)?'signal':
      scene.id==='E06-S02' && /水缸之间/.test(cues)?'tank':
      scene.id==='E06-S03' && /水涌过插座/.test(cues)?'rising':
      scene.id==='E06-S04' && /水面平了一会儿/.test(cues)?'ebb':
      scene.id==='E08-S02' && /第一次牌响/.test(cues)?'signal':'';

    const replay=scene.id==='E00-S01' && line?.id.includes('.b08.o');
    document.getElementById('phoneReplay').hidden=!replay;
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
    if(scene.chapter==='E03' && !/梁安把大外衣一脱/.test(cues) && right==='liangan')right='liangan-suit';
    if(scene.id==='E03-S05' && line?.text.includes('梁安把大外衣一脱')){right='liangan';lookingRight=true}
    if((scene.id==='E03-S05' && /阿岑把拍完的一局/.test(text)) ||
       (scene.id==='E01-S05' && /阿岑只看见自己映/.test(text)))right='';
    let expr='';
    if(left==='linFrontListen') {
      if(/欢迎|晚饭|鸡腿|吃饭|大家好|你打/.test(text))expr='welcome';
      else if(/怪|不见|害怕|别拍|没看见|听不见/.test(text))expr='brow';
      else if(/？|吗|什么/.test(text))expr='curious';
      else if(/答应|不播|我写的|同意/.test(text))expr='firm';
    }
    showActor(near,left,lookingRight,expr);
    showActor(far,right,right && !lookingRight && layout==='speech',lookingRight && /？|怎么/.test(text)?'brow':'');
    stage.dataset.depth=(left||right)?'people':'site';
    const view=document.getElementById('viewpoint');
    const paintedGhost=shot.bg && /umbrella-shelter|umbrella-strike|queue-double|witness-visitors/.test(shot.bg);
    const cameraFile=/机内画面|阿岑把拍完的一局|阿岑的预监/.test(text);
    const witness=right && ['fushun','xiaomei','liangan','liangan-suit','aliang','granny'].includes(right);
    view.hidden=!(cameraFile||paintedGhost||witness);
    view.textContent=cameraFile?'机内回放': '林雨所见';
    stage.dataset.focus=lookingRight?'right':'left';
    camera(layout==='speech'?(lookingRight?-5.55:5.55):0);
    stage.dataset.shot=shot.match || 'establish';
    if(playCue && line && lastCue!==line.id) {
      if(lastFoley!==line.id){window.SeasonFoley.perform(line);lastFoley=line.id}
      const cue=/三响|敲三下|铁牌连响/.test(text)?'iron-three':/提手比盖沿|柜盖响/.test(text)?'freezer-lid':
        /锁舌退出|门闩落下/.test(text)?'latch':/钥匙响|钥匙串轻轻/.test(text)?'keys':
        /纸袋.*滑|折好转交清单|撕下回单/.test(text)?'paper':/电视.*雪花/.test(text)?'tv-noise':null;
      if(cue){lastCue=line.id;window.passageSound.play(cue)}
    }
    if(replay)return 'replay';
    if(name==='阿岑' || (layout==='speech' && (!left&&!right || !cast[name])))return 'offscreen';
    return layout;
  }
  function travel(scene) {
    const art=sceneArt(scene);
    const pos=art.exit || [73,63];
    const button=document.getElementById('route');
    button.style.left=(Array.isArray(pos)?pos[0]:73)+'%';
    button.style.top=(Array.isArray(pos)?pos[1]:63)+'%';
    camera(-1.4);
  }
  function leave(done) {
    const veil=document.getElementById('veil'),world=document.getElementById('world');
    const exit=sceneArt(globalThis.TX_SEASON.scenes[sceneId]).exit || [66,55];
    world.style.transformOrigin=exit[0]+'% '+exit[1]+'%';
    stage.classList.add('walking');camera(-2.4);
    setTimeout(()=>veil.classList.add('dark'),reduced()?0:245);
    setTimeout(()=>{
      done();stage.classList.remove('walking');window.SeasonFoley.quiet();
      const image=new Image();image.src=requested;
      const unveil=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>veil.classList.remove('dark')));
      if(image.complete)unveil();
      else {image.onload=unveil;image.onerror=unveil;setTimeout(unveil,1500)}
    },reduced()?0:585);
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
  window.SeasonDirection={prepare,compose,travel,leave,approach};
})();
