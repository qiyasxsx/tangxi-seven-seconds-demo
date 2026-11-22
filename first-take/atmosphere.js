/* Moisture hangs between buildings. Every light pool, puddle and bank of mist
   is measured in the same painting coordinates as the physical door. */
(() => {
  const id=n=>document.getElementById(n);
  const stage=id("stage"),world=id("world"),plate=id("plate");
  const canvas=document.createElement("canvas");
  canvas.id="siteAir";canvas.setAttribute("aria-hidden","true");
  const electric=new Image();electric.id="hallElectric";electric.alt="";electric.hidden=true;
  const vapour=["middleAir","nearAir"].map(name=>{
    const layer=document.createElement("canvas");layer.id=name;layer.setAttribute("aria-hidden","true");return layer;
  });
  plate.after(electric,canvas,vapour[0]);
  // Low mist can pass in front of the shopkeeper, but behind Lin's shoulder.
  id("rightActor").after(vapour[1]);
  const g=canvas.getContext("2d");
  // Cool readings follow the vanishing street. Warmer pools belong to the
  // shop tube and the nearer lamps; the reflections end on their own floor.
  const street={
    stop:{mist:[[.65,.60,.51,.28,.42],[.58,.72,.55,.19,.31],[.27,.89,.68,.15,.25]],
      lights:[[.138,.322,.16,.24,.21],[.657,.441,.16,.11,.17]],wet:[[.339,.958,.09,.17,.22],[.726,.828,.045,.17,.33]]},
    shop:{mist:[[.08,.56,.37,.44,.44],[.63,.68,.53,.18,.28],[.25,.93,.66,.15,.25]],
      lights:[[.742,.19,.22,.31,.26],[.389,.119,.49,.13,.14],[.07,.34,.17,.27,.13]],wet:[[.737,.89,.095,.18,.31],[.14,.81,.08,.17,.16]]},
    building:{mist:[[.062,.48,.33,.38,.43],[.38,.72,.64,.18,.31],[.69,.90,.61,.14,.24]],
      lights:[[.136,.22,.17,.22,.23],[.62,.31,.12,.28,.20]],wet:[[.6,.885,.07,.20,.32],[.143,.89,.06,.20,.21]]}
  };
  const windows={stairs:[.10,.07,.29,.55],room:[.296,.08,.28,.405],corridor:[.47,.08,.24,.22]};
  // Pool centres are measured on the actual ceiling, jamb, window and
  // reflected floor. The night grade leaves the lamp itself exposed.
  const pools={
    hall:[[.643,.059,.12,.11,1],[.64,.26,.23,.37,.68],[.65,.78,.23,.24,.44],[.08,.40,.09,.47,.28]],
    stairs:[[.604,.054,.13,.10,1],[.60,.22,.22,.32,.64],[.64,.88,.21,.20,.45],[.23,.35,.17,.37,.48]],
    corridor:[[.446,.111,.16,.065,1],[.446,.23,.19,.26,.58],[.453,.86,.14,.31,.40],[.43,.38,.12,.21,.37],[.766,.10,.07,.10,.40]],
    room:[[.49,.26,.19,.26,.52],[.89,.37,.065,.51,.58],[.52,.87,.15,.22,.24]]
  };
  const masks={};
  function shadeMask(name,on) {
    const mask=document.createElement("canvas");mask.width=320;mask.height=180;
    const ctx=mask.getContext("2d"),pixels=ctx.createImageData(mask.width,mask.height);
    for(let j=0;j<mask.height;j++)for(let i=0;i<mask.width;i++) {
      const x=(i+.5)/mask.width,y=(j+.5)/mask.height;
      let exposed=0;
      for(const [n,[cx,cy,rx,ry,power]] of pools[name].entries()){
        if(name==="hall" && !on && n<3)continue;
        const falloff=((x-cx)/rx)**2+((y-cy)/ry)**2;
        exposed=Math.min(1,exposed+power*Math.exp(-falloff));
      }
      const density=(name==="room" ? .53 : .73)*(1-exposed);
      pixels.data.set([7,27,24,Math.round(255*density)],4*(j*mask.width+i));
    }
    ctx.putImageData(pixels,0,0);return mask;
  }
  function grade(name,light) {
    masks[name] ||= {on:shadeMask(name,true),off:name==="hall"?shadeMask(name,false):null};
    const mask=masks[name];
    if(mask.off && light<1){g.globalAlpha=1-light;g.drawImage(mask.off,0,0,w,h);}
    g.globalAlpha=mask.off?light:1;
    if(!mask.off || light>0)g.drawImage(mask.on,0,0,w,h);
    g.globalAlpha=1;
  }
  let w=0,h=0,ox=0,oy=0,scale=1,last=0,frame=0,lampAt=null;
  const reduced=()=>document.body.classList.contains("reduce");
  const smooth=t=>t*t*(3-2*t);
  function noise(x,y,seed) {
    const hash=(i,j)=>{const n=Math.sin(127.1*i+311.7*j+seed)*43758.5453;return n-Math.floor(n);};
    const i=Math.floor(x),j=Math.floor(y),u=smooth(x-i),v=smooth(y-j);
    return (hash(i,j)*(1-u)+hash(i+1,j)*u)*(1-v)+(hash(i,j+1)*(1-u)+hash(i+1,j+1)*u)*v;
  }
  function fogStamp(seed){
    const c=document.createElement("canvas");c.width=196;c.height=84;
    const ctx=c.getContext("2d"),p=ctx.createImageData(c.width,c.height);
    for(let j=0;j<c.height;j++)for(let i=0;i<c.width;i++){
      const x=i/(c.width-1),y=j/(c.height-1),curl=noise(x*4,y*2,seed);
      const edge=Math.max(0,1-(x*2-1)**2-(y*2-1+.18*(curl-.5))**2);
      const density=edge**1.45*(.28+.52*curl+.20*noise(x*10,y*4,seed+3));
      p.data.set([166,187,193,Math.round(223*density)],(j*c.width+i)*4);
    }
    ctx.putImageData(p,0,0);return c;
  }
  const wisps=[fogStamp(2),fogStamp(37)];
  function layout(){
    if(!plate.naturalWidth)return;
    const vw=id("scenery").clientWidth,vh=world.clientHeight,z=Math.max(vw/plate.naturalWidth,vh/plate.naturalHeight);
    w=plate.naturalWidth*z;h=plate.naturalHeight*z;
    const pos=plate.style.objectPosition.split(/\s+/).map(n=>parseFloat(n)/100);
    ox=(vw-w)*(pos[0]??.5);oy=(vh-h)*(pos[1]??.5);electric.style.objectPosition=plate.style.objectPosition;
    scale=Math.min(1,720/vw);
    const cw=Math.ceil(vw*scale),ch=Math.ceil(vh*scale);
    for(const layer of [canvas,...vapour])if(cw!==layer.width || ch!==layer.height){layer.width=cw;layer.height=ch;}
  }
  function glow(x,y,width,height,strength,color) {
    g.save();g.translate(x*w,y*h);g.scale(width*w/2,height*h/2);
    const light=g.createRadialGradient(0,0,0,0,0,1);
    light.addColorStop(0,'rgba('+color+','+strength+')');
    light.addColorStop(.36,'rgba('+color+','+(strength*.54)+')');
    light.addColorStop(1,'rgba('+color+',0)');
    g.fillStyle=light;g.fillRect(-1,-1,2,2);g.restore();
  }
  function floatingSheets(name,t) {
    const place=street[name];
    for(let i=0;i<vapour.length;i++){
      const layer=vapour[i];layer.hidden=!place;
      if(!place)continue;
      const v=layer.getContext("2d");
      v.setTransform(1,0,0,1,0,0);v.clearRect(0,0,layer.width,layer.height);
      v.setTransform(scale,0,0,scale,ox*scale,oy*scale);
      const near=i===1;
      const [x,y,ww,hh,alpha]=place.mist[near?2:1];
      const drift=(near ? .078 : .042)*Math.sin(t*(near ? .125 : .087)+2*i+.4);
      const rise=.012*Math.sin(t*.105+i);
      v.globalAlpha=alpha*(near ? .98 : 1.18);
      v.drawImage(wisps[i],(x-ww/2+drift)*w,(y-hh/2+rise)*h,ww*w,hh*h);
      v.globalAlpha=1;v.globalCompositeOperation="source-atop";
      function tint(cx,cy,rx,ry,opacity) {
        v.save();v.translate(cx*w,cy*h);v.scale(rx*w,ry*h);
        const beam=v.createRadialGradient(0,0,0,0,0,1);
        beam.addColorStop(0,"rgba(255,215,154,"+opacity+")");beam.addColorStop(1,"rgba(255,215,154,0)");
        v.fillStyle=beam;v.fillRect(-1,-1,2,2);v.restore();
      }
      for(const [cx,cy,rx,ry] of place.lights)tint(cx,cy+.10,rx*.90,ry*1.42,.84);
      for(const [cx,cy,rx,ry] of place.wet)tint(cx,cy-.03,rx*2.1,ry,.46);
      v.globalCompositeOperation="source-over";
    }
  }
  function paint(ms) {
    g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);
    if(!w||!h)return;
    const name=stage.dataset.place,t=reduced()?0:ms/1000;
    g.save();g.setTransform(scale,0,0,scale,ox*scale,oy*scale);
    const streetLight=street[name];floatingSheets(name,t);
    if(streetLight) {
      {
        const [x,y,ww,hh,a]=streetLight.mist[0];
        const drift=.035*Math.sin(t*.075),rise=.007*Math.sin(t*.092);
        g.globalAlpha=a;
        g.drawImage(wisps[0],(x-ww/2+drift)*w,(y-hh/2+rise)*h,ww*w,hh*h);
      }
      g.globalAlpha=1;
      for(const [x,y,ww,hh,a] of streetLight.lights)glow(x,y,ww,hh,a,"244,207,153");
      for(const [x,y,ww,hh,a] of streetLight.wet)
        glow(x+.0018*Math.sin(t*.7+y*8),y,ww,hh,a*(.92+.08*Math.cos(t*.49)),"233,197,145");
    } else if (name==="hall") {
      const level=lampAt===null?0:reduced()?1:smooth(Math.max(0,Math.min(1,(ms-lampAt)/880)));
      canvas.dataset.lamp=level.toFixed(3);
      electric.style.opacity=String(level);grade(name,level);
      if(!electric.naturalWidth) {
        glow(.643,.059,.21,.24,.65*level,"251,209,147");
        glow(.65,.76,.28,.42,.32*level,"238,202,140");
      }
    } else if(windows[name]) {
      grade(name,1);
      const [x,y,ww,hh]=windows[name];g.beginPath();g.rect(x*w,y*h,ww*w,hh*h);g.clip();
      g.globalAlpha=.23;g.drawImage(wisps[0],(x+Math.sin(t*.09)*.023)*w,y*h,ww*w,hh*h);g.globalAlpha=1;
      glow(x+ww*.53,y+hh*.61,ww,hh,.13,"235,215,179");
    }
    g.restore();
  }
  function active(){return !document.hidden && !["title","end"].includes(stage.dataset.mode) &&
    stage.dataset.insert!=="true" && !id("overlay").open;}
  function tick(t){
    frame=0;if(!active())return;
    if(t-last>=82){paint(t);last=t;}
    if(!reduced())frame=requestAnimationFrame(tick);
  }
  function refresh(){
    cancelAnimationFrame(frame);frame=0;layout();
    if(active()){paint(performance.now());if(!reduced())frame=requestAnimationFrame(tick);}
  }
  window.TAKE_AIR={
    arrive(place,lit){
      electric.hidden=place!=="hall";
      if(!electric.hidden && !electric.getAttribute("src"))electric.src="art/hallLit.webp";
      lampAt=place==="hall" && lit?performance.now()-880:null;
      electric.style.opacity=lit?"1":"0";delete canvas.dataset.lamp;refresh();
    },
    footfall(){if(stage.dataset.place==="hall" && lampAt===null){lampAt=performance.now();refresh();}}
  };
  world.addEventListener("take-framing",refresh);plate.addEventListener("load",refresh);
  new ResizeObserver(refresh).observe(world);
  new MutationObserver(refresh).observe(stage,{attributes:true,attributeFilter:["data-place","data-mode","data-insert"]});
  new MutationObserver(refresh).observe(document.body,{attributes:true,attributeFilter:["class"]});
  new MutationObserver(refresh).observe(id("overlay"),{attributes:true,attributeFilter:["open"]});
  document.addEventListener("visibilitychange",refresh);refresh();
})();
