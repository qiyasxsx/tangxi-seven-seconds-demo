// Lay the reading area on unpainted space. Reserve the entire camera move so
// the writing can stay still while the near shoulder and far face exchange focus.
(() => {
  'use strict';
  const text=document.getElementById('utterance'),view=document.getElementById('advance');
  const actors=['near','far'].map(id=>document.getElementById(id));
  function between(y,h) {
    const bounds=[innerWidth*.045,innerWidth*.948];
    actors.forEach((rig,i)=>{
      const bands=window.TX_INK[rig.dataset.pose];
      if(!bands||!rig.classList.contains('lit'))return;
      const img=rig.querySelector('img'),height=img.offsetHeight || rig.offsetHeight,width=img.offsetWidth;
      if(!height||!width)return;
      const dy=y-rig.offsetTop;
      const start=Math.max(0,Math.floor((dy-4)/height*32));
      const end=Math.min(31,Math.floor((dy+h+4)/height*32));
      if(start>end)return;
      let edge=i?100:0;
      for(let row=start;row<=end;row++)
        edge=i?Math.min(edge,bands[row*2]):Math.max(edge,bands[row*2+1]);
      const ink=rig.offsetLeft+width*edge/100,slide=innerWidth*(i ? .038 : .064);
      if(i)bounds[1]=Math.min(bounds[1],ink-slide-innerWidth*.014);
      else bounds[0]=Math.max(bounds[0],ink+slide+innerWidth*.014);
    });
    return bounds;
  }
  function place() {
    text.style.removeProperty('left');text.style.removeProperty('top');text.style.removeProperty('width');
    if(view.hidden||view.dataset.layout!=='speech')return;
    const right=document.getElementById('stage').dataset.focus==='right';
    for(const yp of [.235,.16,.09,.33,.43,.055]) {
      const y=innerHeight*yp;let width=innerWidth*.332;
      for(let pass=0;pass<4;pass++) {
        text.style.width=width+'px'; const h=text.offsetHeight;
        const [l,r]=between(y,h);
        if(r-l>=width-1 && y+h<innerHeight*.87){
          const desired=right?r-width:Math.max(innerWidth*.285,l);
          text.style.left=Math.max(l,Math.min(desired,r-width))+'px';text.style.top=y+'px';return;
        }
        if(r-l<innerWidth*.21)break;
        width=Math.min(width,r-l);
      }
    }
    text.style.width='33%';text.style.left='35%';text.style.top='9%';
  }
  window.SeasonCaptions={place};
  for(const rig of actors)rig.querySelector('img').addEventListener('load',place);
  window.addEventListener('resize',place);document.fonts?.ready.then(place);
})();
