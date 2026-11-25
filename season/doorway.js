// Match the original film crew's shop and stair approaches to this play's first meetings.
(() => {
  'use strict';
  const world=document.getElementById('world'),stage=document.getElementById('stage');
  let serial=0, plate=null;
  const images=new Map();
  function getImage(name) {
    if(!images.has(name))images.set(name,new Promise((resolve,reject)=>{
      const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{images.delete(name);reject(Error(name))};img.src='../first-take/'+name;
    }));
    return images.get(name);
  }
  function project(x,y) {
    const w=world.clientWidth,h=world.clientHeight,iw=plate?.naturalWidth || 16,ih=plate?.naturalHeight || 9;
    const scale=Math.max(w*1.044/iw,h/ih);
    return [(w-iw*scale)/2+x*iw*scale,(h-ih*scale)/2+y*ih*scale];
  }
  const entrance=window.TAKE_ENTRANCE.create({stage,world,art:window.TAKE_ART,getImage,project,
    headroom:()=>0,reduced:()=>document.body.classList.contains('reduce'),isCurrent:t=>t===serial,
    drawPlate:()=>{},playSound:name=>window.passageSound.play(name)});
  let place='';
  async function play(id) {
    const next=++serial;
    place=id;stage.dataset.entrance=id;
    try {
      plate=await getImage(window.TAKE_ART.plates[id].file);
      if(next===serial)await entrance.play(id,next);
    } finally {
      if(next===serial){entrance.clear();delete stage.dataset.entrance;place=''}
    }
  }
  function clear(){serial++;entrance.clear();delete stage.dataset.entrance;place=''}
  new ResizeObserver(()=>{if(place)entrance.layout()}).observe(world);
  window.SeasonDoorway={play,clear};
})();
