/* All doorway coordinates refer to the original location paintings. */
(() => {
  "use strict";
  const edges = {shop:.778, hall:.819};
  const limit = (n,lo=0,hi=1) => Math.max(lo,Math.min(hi,n));
  const mix = (a,b,t) => a+(b-a)*t;
  function ease(t,start,end) {
    const x=limit((t-start)/(end-start));return x*x*(3-2*x);
  }
  function polygon(g,points) {
    g.beginPath();g.moveTo(...points[0]);
    for (const point of points.slice(1)) g.lineTo(...point);
    g.closePath();
  }
  function surface(w,h) {
    const c=document.createElement("canvas");
    c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c;
  }

  const leaf={left:.643,right:.823,top:.130,bottom:.845};
  function metalLeaf(closed) {
    const {left,right,top,bottom}=leaf,w=closed.naturalWidth,h=closed.naturalHeight;
    const c=surface((right-left)*w,(bottom-top)*h),g=c.getContext("2d");
    const xy=(x,y)=>[(x-left)*w,(y-top)*h];
    polygon(g,[xy(left,.170),xy(right,top),xy(right,bottom),xy(left,.815)]);g.clip();
    g.drawImage(closed,left*w,top*h,c.width,c.height,0,0,c.width,c.height);
    // Remove the shelves painted through the pane. They remain visible in
    // the stationary room behind the door, even while its latch turns.
    polygon(g,[xy(.659,.191),xy(.804,.164),xy(.804,.518),xy(.659,.506)]);g.clip();
    g.clearRect(0,0,c.width,c.height);
    const tint=g.createLinearGradient(0,0,c.width,c.height);
    tint.addColorStop(0,"rgba(145,157,150,.20)");
    tint.addColorStop(.45,"rgba(210,201,171,.12)");
    tint.addColorStop(1,"rgba(84,100,108,.16)");
    g.fillStyle=tint;g.fillRect(0,0,c.width,c.height);
    return c;
  }
  function doorEdge(u,angle) {
    const depth=1+.35*u*Math.sin(angle), centre=(leaf.top+leaf.bottom)/2;
    return {x:leaf.right-(leaf.right-leaf.left)*u*Math.cos(angle)/depth,
      y:centre+(leaf.top-centre)/depth,h:(leaf.bottom-leaf.top)/depth};
  }
  function drawLeaf(g,texture,angle) {
    const slices=20, slice=texture.width/slices;
    for (let i=0;i<slices;i++) {
      const a=doorEdge(1-i/slices,angle),b=doorEdge(1-(i+1)/slices,angle);
      g.drawImage(texture,i*slice,0,slice,texture.height,a.x,(a.y+b.y)/2,
        b.x-a.x+.00012,(a.h+b.h)/2);
    }
  }

  function recordingLight(take,shadeAmount) {
    const c=take.figure,g=c.getContext("2d"),w=c.width,h=c.height;
    g.clearRect(0,0,w,h);g.drawImage(take.person,0,0,w,h);
    if(take.welcome) {
      const [x,y,rw,rh]=window.TAKE_CAST_PLATES.faces.linFrontListen.welcome.rect;
      g.drawImage(take.welcome,x*w,y*h,rw*w,rh*h);
    }
    g.globalCompositeOperation="source-atop";
    const shade=g.createLinearGradient(0,0,w,h*.3);
    shade.addColorStop(0,"rgba(37,45,52,"+shadeAmount*.12+")");
    shade.addColorStop(1,"rgba(22,34,45,"+shadeAmount*.32+")");
    g.fillStyle=shade;g.fillRect(0,0,w,h);g.globalCompositeOperation="source-over";
  }
  function figureBox(take,eyeX,eyeY,height) {
    const img=take.person,a=take.pose, head=a.head||[.5,0];
    const eye=a.eye||[head[0],head[1]+a.faceHeight*.46];
    const w=height*(img.naturalWidth/img.naturalHeight)/take.photoRatio;
    return {x:eyeX-eye[0]*w, y:eyeY-eye[1]*height, w,h:height};
  }

  // Centres of actual walking surfaces in the two paintings. In the hall
  // each narrow tread is sampled on its top, not on the vertical riser.
  const paths={
    shop:{start:1.40,cadence:.51,axis:.483,split:.764,knee:.802,ankle:.936,lift:.011,sway:.105,rise:.0035,
      marks:[[.716,.773,.445],[.713,.801,.464],[.709,.831,.491],[.703,.862,.527],[.697,.891,.563],[.691,.922,.601]]},
    hall:{start:1.12,cadence:.56,axis:.478,split:.599,knee:.728,ankle:.931,lift:.014,sway:.135,rise:.0042,
      marks:[[.683,.631,.378],[.681,.678,.403],[.678,.726,.433],[.674,.778,.471],[.669,.850,.519],[.665,.913,.575]]}
  };
  // The receiver walks beyond the photographed threshold towards the operator.
  // Its foreground landing is projected from the same eye line as the standing
  // drawing. The floor below the bottom of the frame is still a walkable plane.
  function approachPath(take) {
    const base=paths[take.place],{world,project}=take.env;
    const p=project(0,0),q=project(1,1);
    const w=world.clientWidth,h=world.clientHeight, pose=take.pose;
    const height=.222*h/((q[1]-p[1])*pose.faceHeight);
    const width=height*take.person.naturalWidth/take.person.naturalHeight/take.photoRatio;
    const x=((w/h<1.12 ? .745 : .708)*w-p[0])/(q[0]-p[0])+(pose.foot[0]-pose.eye[0])*width;
    const y=(.373*h+take.env.headroom()-p[1])/(q[1]-p[1])+(pose.foot[1]-pose.eye[1])*height;
    const last=base.marks.at(-1),end=[x,y,height],marks=[...base.marks];
    for(let step=1;step<=4;step++) {
      const u=step/4,t=u+u*u*(1-u);
      // Shorten the approach to rest in real depth before projecting it;
      // otherwise the penultimate stride gets longer at the operator's feet.
      const f=t*last[2]/((1-t)*height+t*last[2]);
      marks.push(last.map((v,i)=>mix(v,end[i],f)));
    }
    // At a foot exchange the hips pass between the previous and next
    // tread. Through those points their motion is continuous, even during
    // double support. Only the first and last poses are at rest.
    const midpoints=marks.slice(1).map((mark,i)=>mark.map((coord,j)=>(coord+marks[i][j])/2));
    const centres=[marks[0],...midpoints,marks.at(-1)];
    const tangents=centres.map((centre,i)=>centre.map((coord,j)=>{
      if (!i || i===centres.length-1) return 0;
      const before=coord-centres[i-1][j],after=centres[i+1][j]-coord;
      return before*after>0 ? 2*before*after/(before+after) : 0;
    }));
    return {...base,marks,centres,tangents};
  }
  function footMark(take,station,side) {
    const [x,y,h]=take.path.marks[station], soles=take.pose.soles;
    const mid=(soles[0][0]+soles[1][0])/2,baseline=(soles[0][1]+soles[1][1])/2;
    const w=h*take.person.naturalWidth/take.person.naturalHeight/take.photoRatio;
    return {x:x+(soles[side][0]-mid)*w,y:y+(soles[side][1]-baseline)*h,h};
  }
  function torsoAt(path,i,t) {
    // Cubic Hermite interpolation retains both contact positions and the
    // shared forward velocity as the body's weight changes feet.
    const from=path.centres[i],to=path.centres[i+1],out=path.tangents[i],into=path.tangents[i+1];
    const weight=t*t*(3-2*t),leave=t*(1-t)*(1-t),arrive=t*t*(1-t);
    return from.map((p,j)=>mix(p,to[j],weight)+out[j]*leave-into[j]*arrive);
  }
  function gait(take,t) {
    const {path,pose}=take,n=path.marks.length;
    const beat=limit((t-path.start)/path.cadence,0,n),step=Math.min(n-1,Math.floor(beat));
    const fraction=beat-step, moving=beat>0&&beat<n, swing=step%2, stood=[0,0];
    const clearance=path.lift*(step===n-1 ? .64 : step===0 ? .82 : 1);
    for(let i=0;i<step;i++) stood[i%2]=Math.min(n-1,i+1);
    const feet=stood.map((index,side)=>{
      const a=footMark(take,index,side),b=footMark(take,side===swing?Math.min(step+1,n-1):index,side);
      const u=side===swing?ease(fraction,.055,.875):0;
      const arc=side===swing && moving ? Math.sin(u*Math.PI) : 0;
      const surface=mix(a.y,b.y,u);
      return {x:mix(a.x,b.x,u),y:surface-clearance*arc,surface,arc,h:mix(a.h,b.h,u),contact:arc<.001};
    });
    const [centreX,floor,height]=torsoAt(path,step,fraction);
    const w=height*take.person.naturalWidth/take.person.naturalHeight/take.photoRatio;
    const load=ease(beat,0,.65)*(1-ease(beat,n-.8,n)),sway=Math.sin(Math.PI*beat);
    const stance=w*(pose.soles[1][0]-pose.soles[0][0]);
    const bodyX=centreX+path.sway*stance*sway*load,bodyY=floor-height*path.rise*sway*sway*load;
    const midX=(pose.soles[0][0]+pose.soles[1][0])/2,baseY=(pose.soles[0][1]+pose.soles[1][1])/2;
    return {feet,box:{x:bodyX-midX*w,y:bodyY-baseY*height,w,h:height},floor,beat,step,rest:beat===0||beat===n};
  }
  function groundShadow(g,take,walk) {
    for(const f of walk.feet) {
      g.save();g.translate(f.x,f.surface+.001);g.scale(f.h*.047,f.h*.010);
      const ink=g.createRadialGradient(0,0,0,0,0,1);
      ink.addColorStop(0,"rgba(16,19,23,"+(.40-.18*f.arc)+")");ink.addColorStop(.52,"rgba(17,20,24,.13)");ink.addColorStop(1,"rgba(12,14,18,0)");
      g.fillStyle=ink;g.fillRect(-1,-1,2,2);g.restore();
    }
  }
  function colourWalk(take,walk,opened) {
    const c=take.figure,g=c.getContext("2d"),w=c.width,h=c.height;
    g.clearRect(0,0,w,h);g.drawImage(take.person,0,0,w,h);
    const shop=take.place==="shop",front=walk.floor;
    const face=shop?ease(front,.773,.844)*opened:ease(front,.634,.764);
    const waist=shop?ease(front,.783,.863)*opened:ease(front,.655,.805);
    const shoe=shop?ease(front,.805,.891)*opened:ease(front,.690,.850);
    const penumbra=g.createLinearGradient(w*.27,h*.10,w*.59,h*.98);
    const shade=(amount,light)=>"rgba("+light+","+(.90*(1-amount)+.035)+")";
    penumbra.addColorStop(0,shade(face,"21,29,33"));penumbra.addColorStop(.30,shade(face*.8+waist*.2,"24,31,35"));
    penumbra.addColorStop(.59,shade(waist,"24,29,31"));penumbra.addColorStop(1,shade(shoe,"18,25,31"));
    g.globalCompositeOperation="source-atop";g.fillStyle=penumbra;g.fillRect(0,0,w,h);g.globalCompositeOperation="source-over";
  }
  function legBounds(take,y) {
    // His hand and keys hang outside the trousers. Keep them, her apron
    // and both shoulders attached to the unwarped painted upper body.
    if(take.place==="shop") return [0,take.path.axis,1];
    const blend=ease(y,.60,.678);
    return [mix(.178,0,blend),take.path.axis,mix(.792,1,blend)];
  }
  function onBody(box,x,y) { return [box.x+x*box.w,box.y+y*box.h]; }
  function bentPoint(take,walk,side,x,y) {
    const p=take.path,f=walk.feet[side],b=walk.box,sole=take.pose.soles[side];
    const neutral=onBody(b,sole[0],sole[1]),dx=f.x-neutral[0],dy=f.y-neutral[1];
    const knee=ease(y,p.split,p.knee),ankle=ease(y,p.knee,p.ankle);
    const weight=knee*.33+ankle*.67;
    // The knee advances toward the lens and the lower leg foreshortens.
    // The shoe keeps its contact point and the size at that tread's depth.
    const legSign=side===0?-1:1, flex=f.arc*knee*(1-ankle);
    const localScale=(f.h/b.h-1)*ankle;
    return [b.x+b.w*x+dx*weight+legSign*.0011*flex+(x-sole[0])*b.w*localScale,
      b.y+b.h*y+dy*weight-.004*flex+(y-sole[1])*b.h*localScale];
  }
  function triangle(g,img,src,dst) {
    const [[x0,y0],[x1,y1],[x2,y2]]=src,[[a,b],[c,d],[e,f]]=dst;
    const den=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);if(!den)return;
    const m11=((c-a)*(y2-y0)-(e-a)*(y1-y0))/den,m12=((d-b)*(y2-y0)-(f-b)*(y1-y0))/den;
    const m21=((x1-x0)*(e-a)-(x2-x0)*(c-a))/den,m22=((x1-x0)*(f-b)-(x2-x0)*(d-b))/den;
    g.save();const cx=(a+c+e)/3,cy=(b+d+f)/3;
    polygon(g,dst.map(([x,y])=>[x+Math.sign(x-cx)*.00017,y+Math.sign(y-cy)*.00023]));g.clip();
    g.transform(m11,m12,m21,m22,a-m11*x0-m21*y0,b-m12*x0-m22*y0);
    g.drawImage(img,0,0,1,1);g.restore();
  }
  function drawPerson(g,take,walk) {
    const b=walk.box,source=take.figure,p=take.path;
    if(walk.rest) {g.drawImage(source,b.x,b.y,b.w,b.h);return;}
    const rows=[p.split,p.knee,(p.knee+p.ankle)*.5,p.ankle,1.002];
    const bounds=rows.map(y=>legBounds(take,y));
    // Preserve the whole original torso and any dangling fingers outside
    // the trouser contours. Only the two lower-limb sections are articulated.
    g.save();g.beginPath();g.rect(b.x,b.y,b.w,b.h);
    for(let i=0;i<rows.length;i++) {
      const point=onBody(b,bounds[i][0],rows[i]);if(i===0)g.moveTo(...point);else g.lineTo(...point);
    }
    for(let i=rows.length-1;i>=0;i--)g.lineTo(...onBody(b,bounds[i][2],rows[i]));
    g.closePath();g.clip("evenodd");g.drawImage(source,b.x,b.y,b.w,b.h);g.restore();
    for(let side=0;side<2;side++)for(let i=0;i<rows.length-1;i++) {
      const u=[bounds[i][side],rows[i]],v=[bounds[i][side+1],rows[i]],
        a=[bounds[i+1][side],rows[i+1]],d=[bounds[i+1][side+1],rows[i+1]];
      const dest=xy=>bentPoint(take,walk,side,...xy);
      triangle(g,source,[u,v,a],[dest(u),dest(v),dest(a)]);
      triangle(g,source,[v,d,a],[dest(v),dest(d),dest(a)]);
    }
  }
  function stairRail(g) {
    // The actor descends the central, open flight. The rail only occludes
    // a real intersection to its right; the soles remain on visible treads.
    g.beginPath();g.rect(0,0,1,1);
    g.moveTo(.724,.368);g.lineTo(.819,.206);g.lineTo(.819,.223);g.lineTo(.732,.391);g.closePath();g.clip("evenodd");
    g.beginPath();g.rect(0,0,1,1);g.moveTo(.723,.364);g.lineTo(.733,.369);g.lineTo(.752,.738);g.lineTo(.741,.736);g.closePath();g.clip("evenodd");
  }
  function walkFrame(g,take,t) {
    const shop=take.place==="shop",walk=gait(take,t),opening=shop?ease(t,.12,1.15):1,angle=opening*70*Math.PI/180;
    const phase=t>=take.times.stop?"held":t<take.path.start?"shadow":
      walk.beat<2.15?"step":walk.beat>=5?"approach":"light";
    if (!shop && t>=take.path.start+.24) window.TAKE_AIR?.footfall();
    colourWalk(take,walk,opening);
    g.save();
    if(shop && walk.floor<.825) {
      const gap=opening>=.999?edges.shop:Math.min(edges.shop,doorEdge(1,angle).x);
      // She is on the clear floor in FRONT of the counter, so its top
      // never cuts her waist or feet. The right-hinged physical leaf does.
      polygon(g,[[.648,.161],[gap,.134],[gap,1.02],[.648,1.02]]);g.clip();
    } else if(!shop && walk.floor<.802) stairRail(g);
    groundShadow(g,take,walk);drawPerson(g,take,walk);g.restore();
    if(shop && opening<.999) drawLeaf(g,take.leaf,angle);
    for(const [i,f] of walk.feet.entries()) {
      take.canvas.dataset[i===0?"leftSole":"rightSole"]=[f.x,f.y,f.surface].map(n=>n.toFixed(5)).join(",");
    }
    take.canvas.dataset.support=walk.feet.map(f=>f.contact?"1":"0").join("");
    take.canvas.dataset.pose=shop?"qinStanding":"xuStanding";
    take.canvas.dataset.beat=walk.beat.toFixed(4);
    const {project,world}=take.env,tl=project(walk.box.x,walk.box.y),br=project(walk.box.x+walk.box.w,walk.box.y+walk.box.h);
    take.canvas.dataset.figure=[tl[0]/world.clientWidth,tl[1]/world.clientHeight,
      br[0]/world.clientWidth,br[1]/world.clientHeight].map(n=>n.toFixed(5)).join(",");
    if(t>=take.times.stop) {
      const b=walk.box,eye=project(b.x+take.pose.eye[0]*b.w,b.y+take.pose.eye[1]*b.h);
      take.canvas.dataset.mediumEye=[eye[0]/world.clientWidth,eye[1]/world.clientHeight].join(",");
      take.canvas.dataset.mediumSoles=walk.feet.map(f=>{
        const [sx,sy]=project(f.x,f.y);return [sx/world.clientWidth,sy/world.clientHeight].join(",");
      }).join("|");
    }
    return {phase,depth:walk.box.h/take.path.marks[0][2]};
  }
  function recordingFrame(g,take,t) {
    const {project,world}=take.env, p=project(0,0),q=project(1,1);
    const view={x:-p[0]/(q[0]-p[0]),y:-p[1]/(q[1]-p[1]),w:world.clientWidth/(q[0]-p[0]),h:world.clientHeight/(q[1]-p[1])};
    const narrow=world.clientWidth/world.clientHeight<1.12;
    const focus=ease(t,.10,.88),eyeX=view.x+(narrow ? .405 : .427)*view.w,eyeY=view.y+(.352+take.env.headroom()/world.clientHeight)*view.h;
    // Cut on the remote click to the marked host, already present in the
    // recording frame. The operator takes up focus without moving her body.
    // The tripod stays put. The painted street and its atmosphere continue
    // behind the opaque host as the exposure settles on her face.
    const h=view.h*.319/take.pose.faceHeight,box=figureBox(take,eyeX,eyeY,h);
    recordingLight(take,1-focus);
    g.drawImage(take.figure,box.x,box.y,box.w,box.h);
    return {phase:t<.70?"focus":"held",depth:1,eye:box};
  }

  function create(env) {
    const {stage,world,art,getImage,project,drawPlate,isCurrent,reduced,playSound}=env;
    let generation=0,active=null,checkNear=0;
    function discardCanvas() {
      cancelAnimationFrame(checkNear);checkNear=0;
      if (active) {
        cancelAnimationFrame(active.raf);active.canvas.remove();active.done?.();active=null;
      }
      delete stage.dataset.entrancePhase;
    }
    function clear() {
      generation++;discardCanvas();
    }
    function render(take) {
      const canvas=take.canvas,w=world.clientWidth,h=world.clientHeight;
      if (!w || !h) return;
      const scale=Math.min(window.devicePixelRatio||1,1.5,1800/w);
      if (canvas.width!==Math.round(w*scale)||canvas.height!==Math.round(h*scale)) {
        canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);
      }
      const g=canvas.getContext("2d"),p=project(0,0),q=project(1,1);
      g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);
      g.setTransform((q[0]-p[0])*scale,0,0,(q[1]-p[1])*scale,p[0]*scale,p[1]*scale);
      if (take.path && (take.viewW!==w || take.viewH!==h)) {
        take.path=approachPath(take);take.viewW=w;take.viewH=h;
      }
      const result=take.paint(g,take,take.t);
      canvas.dataset.phase=result.phase;
      if (!take.fallback) stage.dataset.entrancePhase=result.phase;
      canvas.dataset.depth=result.depth.toFixed(3);canvas.dataset.time=take.t.toFixed(3);
    }
    function layout() { if (active) render(active); }
    async function play(place,ticket) {
      clear();
      const poseId={stop:"linFrontListen",shop:"qinStanding",hall:"xuStanding"}[place];
      if (!poseId || !art.poses[poseId]) return;
      const id=generation,pose=art.poses[poseId],isShop=place==="shop";
      const [person,plate,closed,welcome]=await Promise.all([
        getImage(pose.file).catch(()=>null),getImage(art.plates[place].file).catch(()=>null),
        isShop&&art.plates.shopClosed ? getImage(art.plates.shopClosed.file).catch(()=>null) : null,
        place==="stop" ? getImage(window.TAKE_CAST_PLATES.faces.linFrontListen.welcome.file).catch(()=>null) : null]);
      if (id!==generation || !isCurrent(ticket)) return;
      if (!person || !plate || (isShop && !closed)) {
        if (isShop && plate) drawPlate(place,plate);
        return;
      }
      const canvas=surface(1,1);canvas.dataset.entrance=place;
      canvas.setAttribute("aria-hidden","true");Object.assign(canvas.style,{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:"2",pointerEvents:"none"});
      const figScale=Math.min(1,760/person.naturalHeight);
      const take={place,ticket,env,pose,person,plate,welcome,canvas,figure:surface(person.naturalWidth*figScale,person.naturalHeight*figScale),
        photoRatio:plate.naturalWidth/plate.naturalHeight,leaf:closed?metalLeaf(closed):null,
        path:paths[place],strikes:0,
        paint:place==="stop"?recordingFrame:walkFrame,t:0,raf:0};
      if (take.path) {
        const stop=take.path.start+(take.path.marks.length+4)*take.path.cadence;
        take.times={stop,end:stop+.64};
      }
      active=take;
      stage.dataset.shot=place==="stop"?"recording":"doorway";stage.dataset.focus="world";
      world.append(canvas);
      if (isShop) { drawPlate("shop",plate);playSound("door"); }
      if (place==="stop") playSound("switch");
      render(take);
      const reducedMotion=reduced(),duration=place==="stop"?1.31:take.times.end;
      return new Promise(resolve=>{
        take.done=resolve; let previous=performance.now(),elapsed=0;
        const tick=now=>{
          if (active!==take) { resolve();return; }
          if (!isCurrent(ticket)) { clear();return; }
          const dt=Math.max(0,Math.min(.10,(now-previous)/1000));previous=now;
          if (!document.hidden && !document.querySelector("dialog[open]")) elapsed+=dt;
          let t=Math.min(duration,elapsed), end=duration;
          if (reducedMotion) {
            if(take.path) {
              const stills=[take.path.start-.05,take.path.start+take.path.cadence,take.path.start+5*take.path.cadence,take.times.stop+.26,duration];
              end=2.90;t=stills[Math.min(stills.length-1,Math.floor(elapsed/.58))];
            } else {end=1.37;t=elapsed<.44 ? .12 : elapsed<.92 ? .78 : duration;}
          }
          if (t!==take.t) { take.t=t;render(take); }
          if (take.path && !reducedMotion) {
            const contacts=limit(Math.floor((t-take.path.start)/take.path.cadence+.15),0,take.path.marks.length);
            while(take.strikes<contacts) {playSound(take.strikes%2?"step2":"step1");take.strikes++;}
          }
          if (elapsed>=end) { take.done=null;resolve(); }
          else take.raf=requestAnimationFrame(tick);
        };
        take.raf=requestAnimationFrame(tick);
      });
    }
    function settle() {
      if (!active) return;
      const take=active, owner={stop:"lin",shop:"qinStanding",hall:"xuStanding"}[take.place];
      const image=[...document.querySelectorAll("#cast img[data-pose]")].find(img=>
        img.dataset.pose.startsWith(owner) && img.naturalWidth>0 && !img.closest("[hidden]"));
      if (stage.dataset.place!==take.place || !isCurrent(take.ticket)) {discardCanvas();return;}
      if (!image && stage.dataset.insert!=="true") {
        // The near file failed or the author intentionally kept this line
        // on the threshold view. Preserve the painted subject for this
        // beat, but release the cast mask so captions and listeners work.
        const first={stop:"testTake",shop:"atShutter",hall:"meetXu"}[take.place];
        if(stage.dataset.mode==="read" && stage.dataset.beat===first) {
          take.fallback=true;take.canvas.dataset.fallback="true";delete stage.dataset.entrancePhase;

        } else discardCanvas();
        return;
      }
      // The incoming pose is decoded before play() releases the wide take.
      // In a matched cut, reveal its already-opaque ink and remove the
      // canvas in the same DOM update; preserve the camera for EVERY line.
      if (image && stage.dataset.insert!=="true") {
        for (let el=image;el && el!==stage;el=el.parentElement) {
          if (Number(getComputedStyle(el).opacity)<.995) {
            if (!checkNear)checkNear=requestAnimationFrame(()=>{checkNear=0;if(active===take)settle();});
            return;
          }
        }
      }
      discardCanvas();
    }
    return {play,layout,settle,clear};
  }
  window.TAKE_ENTRANCE={edges,create};
})();
