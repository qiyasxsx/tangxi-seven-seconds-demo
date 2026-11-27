/* Local, disposable evidence views. Only the season player commits a story choice. */
(() => {
  "use strict";
  const field = "../first-take/art/";
  const props = "props/";
  const fx = "../passage/sfx/";
  let audio = null;
  let filmTimer = 0;
  let pauseFilm = null;
  let muted = false;

  function suspend() {
    if (audio) {
      audio.pause();
      audio = null;
    }
    clearInterval(filmTimer);
    filmTimer = 0;
    pauseFilm?.();
  }

  function clear() {
    suspend();
    pauseFilm = null;
  }

  function play(file, volume = 0.75) {
    if (audio) audio.pause();
    if (muted) return;
    audio = new Audio(file);
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  function node(tag, cls, parent, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    parent?.append(el);
    return el;
  }

  function button(parent, label, click, cls = "") {
    const b = node("button", cls, parent, label);
    b.type = "button";
    b.addEventListener("click", click);
    return b;
  }

  function picture(parent, url, alt, cls = "") {
    const img = node("img", cls, parent);
    img.src = url;
    img.alt = alt;
    img.draggable = false;
    return img;
  }

  function area(view, name = "") {
    return node("div", "sx-area " + name, view.stage);
  }

  function frame(parent, art, alt) {
    const f = node("div", "sx-frame", parent);
    if (art) picture(f, art, alt, "sx-base");
    return f;
  }

  function pin(parent, x, y, label, run, option, options) {
    const b = button(parent, label, run, "sx-pin");
    b.style.left = x + "%";
    b.style.top = y + "%";
    b.setAttribute("aria-label", options[option].label);
    b.disabled = !!options[option].disabled;
    return b;
  }

  function range(parent, name, min, max, value, step, update) {
    const input = node("input", "sx-range", parent);
    input.type = "range";
    Object.assign(input, { min, max, step, value });
    input.setAttribute("aria-label", name);
    input.addEventListener("input", () => update(Number(input.value)));
    return input;
  }

  // The foreground awning is cut from the actual shot. It moves faster than the shop.
  function awning(parent, portrait = false) {
    const cut = picture(parent, props + (portrait ? "awning-phone.webp" : "awning-field.webp"), "", "sx-awning");
    cut.classList.toggle("sx-portrait-awning", portrait);
    return cut;
  }

  function phone(v) {
    const space = area(v, "sx-phone-space");
    const holder = node("div", "sx-phone", space);
    const glass = node("div", "sx-glass", holder);
    const shot = picture(glass, field + "clipPhoneBefore.webp", "卷闸、提起的手与雨棚", "sx-phone-shot");
    const shade = awning(glass,true);
    const tabs = node("div", "sx-phone-tabs", glass);
    const status = node("small", "sx-phone-author", glass);
    const postedText = node("strong", "sx-post-text", glass, "三巷，姑娘喊人搭把手。整条巷，没人开门。");
    const controls = node("div", "sx-phone-controls", glass);
    const time = node("output", "", controls);
    let pos = 0, selected = 0, sawRepost = false;
    const slider = range(controls, "七秒视频进度", 0, 7, 0, 0.1, value => {
      suspend();
      pos = value;
      paint();
    });
    function paint() {
      const nextFrame = field + (pos < 3.4 ? "clipPhoneBefore.webp" : "clipPhoneEnd.webp");
      if (shot.getAttribute("src")!==nextFrame) shot.src=nextFrame;
      shade.style.opacity = pos < 3.4 ? "0" : "1";
      time.textContent = "00:0" + Math.floor(pos) + " / 00:07";
      slider.value = String(pos);
      slider.setAttribute("aria-valuetext", pos.toFixed(1) + " 秒");
      if (pos>=3.4 && selected===0 && v.confirm.disabled) {
        v.observe(sawRepost?1:0,"女孩伸手时，卷闸还在左边。投稿的最后一帧上没有那行字。");
        v.confirm.textContent="放下手机";
      }
    }
    const playback = button(controls, "播放", () => {
      if (filmTimer) { suspend(); return; }
      if (pos >= 7) pos = 0;
      if (!muted) play(fx + "rain.m4a", 0.28);
      const started = performance.now() - 1000 * pos;
      playback.textContent = "暂停";
      filmTimer = setInterval(() => {
        pos = Math.min(7, (performance.now() - started) / 1000);
        paint();
        if (pos >= 7) suspend();
      }, 85);
    }, "sx-play");
    pauseFilm = () => { playback.textContent = pos >= 7 ? "重播" : "播放"; };
    function show(version) {
      suspend();
      selected = version;
      if (version === 1) sawRepost = true;
      const index = sawRepost && selected === 0 ? 1 : 0;
      [original, repost].forEach((b,i) => b.setAttribute("aria-pressed", String(i === version)));
      postedText.hidden = !version;
      status.textContent = version ? "林雨 · 夜访" : "水果头像 · 投稿原件";
      pos = 0; paint();
      v.observe(index, version ? "这行字在林雨转发的版本里。点「查看原片」对照同一处卷闸。" : "原件从女孩的求助开始，在雨棚前结束。画面上没有转发标题。", !!version);
      v.confirm.textContent = version ? "先查看原片" : "放下手机";
    }
    const original = button(tabs, "原片", () => show(0));
    const repost = button(tabs, "转发", () => show(1));
    original.setAttribute("aria-label", "查看原片");
    repost.setAttribute("aria-label", "打开《夜访》转发");
    let touchStart = null;
    glass.addEventListener("pointerdown", e => {
      if (!e.target.closest("button,input")) touchStart = e.clientX;
    });
    glass.addEventListener("pointerup", e => {
      if (touchStart===null) return;
      const delta = e.clientX - touchStart;
      if (Math.abs(delta) > 24) show(delta < 0 ? 1 : 0);
      touchStart = null;
    });
    glass.addEventListener("pointercancel", () => { touchStart = null; });
    show(0);
    v.observe(0,"拖动七秒的进度条，或点开转发对照画面上的字。",true);
  }

  function camera(v) {
    const space = area(v, "sx-camera");
    const pane = frame(space, props + "alley-empty.webp", "现场的卷闸、宵字灯牌与棚沿");
    const foreground = awning(pane);
    const ref = node("figure", "sx-reference", space);
    const refPhoto = frame(ref, field + "clip.webp", "投稿末帧，棚沿遮着半个宵字");
    awning(refPhoto).style.transform = "translateX(-16.8%)";
    node("figcaption", "", ref, "投稿末帧　00:07");
    const control = node("div", "sx-track", space);
    const slider = range(control, "从便利店正门挪到缺角砖", 0, 100, 0, 1, setPosition);
    const stops = node("div", "sx-stops", control);
    button(stops, "便利店正门", () => { slider.value = 0; setPosition(0); });
    button(stops, "缺角砖", () => { slider.value = 100; setPosition(100); });
    function setPosition(n) {
      foreground.style.transform = "translateX(" + (-0.168 * n) + "%)";
      const aligned = n >= 85;
      const mid = n > 15 && !aligned;
      slider.setAttribute("aria-valuetext", aligned ? "缺角砖" : mid ? "正门和缺角砖之间" : "便利店正门");
      v.observe(aligned ? 1 : 0, aligned ? "雨棚的黑边压住了半个字。右边的路出了画框。" :
        mid ? "沿牌楼再挪一点，看看棚边落在字的哪一笔。" : "从正门看，灯箱上的字露得很全。", mid);
      v.confirm.textContent = "确定这个机位";
    }
    setPosition(0);
  }

  function freezer(v) {
    const space = area(v);
    const f = frame(space, props + "freezer.webp", "冰柜上活动提手与靠近人的柜沿");
    const source = button(space, "▷　重听小茵的尾音", () => {
      play(fx + "phone-lid.wav");
      v.note("耳机里先是一声闷响，跟着一声短而薄的金属响。");
    }, "sx-listen");
    source.setAttribute("aria-label", "重听小茵准许核对的柜响");
    pin(f, 65, 57, "弹提手", () => {
      play(props + "handle.wav"); v.observe(0, "固定柜盖，提手自己弹出一声薄响。");
    }, 0, v.options);
    pin(f, 27, 76, "压住提手试柜沿", () => {
      play(props + "rim.wav"); v.observe(1, "提手压住时，盖沿只剩第一声闷响。");
    }, 1, v.options);
  }

  function stairs(v) {
    const f = frame(area(v), props + "zheng-landing.webp", "旧木扶手、绕线带和门旁的搪瓷牌");
    node("i","sx-wire",f);
    node("small","sx-floor-sign",f,"一楼");
    pin(f, 78, 20, "看门牌", () => v.observe(0,"两趟门旁都是这两个字。"), 0, v.options);
    pin(f, 13, 55, "摸扶手", () => v.observe(1,"这里有一圈黑线，刚经过的那边只有光木头。"), 1, v.options);
  }

  function lock(v) {
    const space = area(v, "sx-spread");
    const door = node("div", "sx-door", space);
    node("span","sx-door-inside",door,"屋内");
    picture(door,props+"inside-lock.webp","从屋内望向门缝，锁环挂在过道一侧","sx-door-plate");
    node("span","sx-door-outside",door,"过道");
    button(door,"从屋内摸到门缝",() => {
      door.classList.toggle("sx-touched",true);
      v.observe(0,"手指到门缝便停了。锁环在过道那一面。");
    }, "sx-action");
    const ledger = node("div","sx-paper",space);
    node("h3","",ledger,"照护簿");
    const leaf = node("div","sx-dates",ledger);
    ["廿八","廿九","三十","三十一"].forEach((s,i) => node("span","",leaf,s + (i === 3 ? "　　" : "　✓")));
    let turned = 0;
    const count = node("small","",ledger,"本月末页");
    button(ledger,"往前翻一页",() => {
      ++turned;
      count.textContent = ["本月末页","前一册末页","再前一册末页"][1 + ((turned - 1) % 2)];
      v.observe(1,"翻过一页，末日那一栏仍是空的。把本子交给国强看。");
    }, "sx-action");
  }

  function interview(v) {
    const space = area(v, "sx-interviews");
    const strips = node("div","sx-strips",space);
    const offsets = [-9, 0, 13], shots = [];
    ["横版","方版","竖版"].forEach((name,i) => {
      const col = node("div","sx-tape",strips);
      const f = frame(col, props+"cuff-pen.webp","两针松线、镜边缺角与落下的笔");
      node("small","",col,name);
      const bars = node("canvas","sx-wave",col);
      bars.width=420;
      bars.height=28;
      bars.setAttribute("aria-label","落笔声的波形");
      shots.push({f,bars});
    });
    const track = node("div","sx-track",space);
    const scrub = range(track,"移动剪口，对齐掉笔声",0,100,0,1,value => {
      renderSync(value);
      if (value >= 85) { play(props+"pen.wav"); v.observe(0,"三处声峰合到一起，笔在同一块地砖上落地。"); }
      else v.observe(0,"画幅各不相同。把三条声峰移到同一条线上。",true);
    });
    function renderSync(value) {
      shots.forEach(({f,bars},i) => {
        const offset = offsets[i] * (1-value/100);
        const ctx=bars.getContext("2d");
        if(ctx) {
          const width=bars.width, mid=bars.height/2, peak=(.5+offset/100)*width;
          ctx.clearRect(0,0,width,bars.height);
          ctx.strokeStyle="#9fb6a5";
          ctx.beginPath();
          for(let x=0;x<width;x++) {
            const dt=x-peak;
            const strike=(age,gain)=>age<0 ? 0 : gain*Math.exp(-age/5);
            const envelope=strike(dt,1)+strike(dt-17,.48)+strike(dt-31,.22);
            const amp=(.55+.43*Math.abs(Math.sin(x*1.6)))*envelope;
            ctx.moveTo(x,mid-Math.max(.45,amp*mid));ctx.lineTo(x,mid+Math.max(.45,amp*mid));
          }
          ctx.stroke();
          ctx.fillStyle="#ddc795";ctx.fillRect(peak,0,1,bars.height);
        }
        f.firstChild.style.objectPosition = (50+offset)+"% center";
      });
    }
    renderSync(0);
    const actions = node("div","sx-stops",track);
    button(actions,"听落笔点",() => {
      shots.forEach(({f})=>f.classList.remove("sx-zoom-cuff"));
      scrub.value=100; renderSync(100); play(props+"pen.wav");
      v.observe(0,"三个剪口都留了同一声落笔。");
    });
    button(actions,"叠合袖口两针",() => {
      shots.forEach(({f}) => f.classList.add("sx-zoom-cuff"));
      scrub.value=100; renderSync(100); v.observe(1,"三幅里的袖口针脚与后面镜边的缺角对上了。");
    });
  }

  function receipt(v) {
    const f = frame(area(v), props+"receipt-mug.webp","左边是复写纸和铅笔，右边是蓝边缺瓷饭缸");
    const trace = node("span","sx-trace",f);
    pin(f, 28, 66, "垫好复写纸", () => {
      trace.textContent="副页";trace.className="sx-trace sx-copy";
      v.observe(0,"下面垫好复写纸，原页留在工人手边。");
    },0,v.options);
    pin(f, 71, 55, "沿缺口描形", () => {
      trace.textContent="";trace.className="sx-trace sx-chip";
      v.observe(1,"描下朝外的蓝边缺口。屋号折在里面。");
    },1,v.options);
  }

  function timeline(v) {
    const space = area(v,"sx-spread");
    const sheet = node("div","sx-paper",space);
    node("h3","",sheet,"采访排期");
    const days = node("div","sx-days",sheet);
    "一二三四五六日".split("").forEach(d=>node("span","",days,d));
    button(sheet,"只保留周三",() => {
      days.classList.add("sx-wednesday");
      v.observe(0,"周历只留下本人答应的那一天。");
    },"sx-action");
    const edit = node("div","sx-edit-track",space);
    node("h3","",edit,"原声剪口");
    node("span","sx-clip-a",edit,"仓管员的回答");
    const after = node("span","sx-clip-b",edit,"接妹妹");
    button(edit,"把后半句接回",() => {
      after.classList.toggle("sx-spliced",true);
      v.observe(1,"后半句接回自己的声轨。");
    },"sx-action");
  }

  function mail(v) {
    const space = area(v,"sx-mail");
    const row = node("div","sx-dispatch",space);
    const envelope = node("div","sx-envelope",row,"工资明细 · 副本");
    const slots = node("div","sx-slots",space);
    let active = false;
    function deposit(i) {
      active = false;
      delete slots.dataset.posted;
      if (i !== 0 && i !== 1) {
        const message = ["","","署名的辞职草稿留给本人寄。这一窗不收工资明细。","旧耳机连着邮费，这里收寄往家里的物件。","有人摆好了两只碟，这一窗等的是蛋糕。"][i];
        envelope.textContent="工资明细 · 副本";
        v.observe(0,message,true);
        return;
      }
      envelope.textContent = i === 0 ? "工资明细 · 贴纸退件" : "工资明细 · 已递副本";
      if (i === 1) slots.dataset.posted="1";
      v.observe(i, i === 0 ? "表扬栏里只有贴纸。" : "申诉窗内留有可盖日期的回执。");
    }
    function receive(parent,name,i,cls) {
      const b=button(parent,name,()=>deposit(i),cls);
      b.addEventListener("dragover",e=>{if(active)e.preventDefault();});
      b.addEventListener("drop",e=>{e.preventDefault();if(active)deposit(i);});
      return b;
    }
    receive(row,"优秀员工",0,"sx-praise");
    [["本人收件",2],["蛋糕送达",4],["申诉收件",1],["邮寄退件",3]].forEach(([name,i])=>receive(slots,name,i,"sx-slot"));
    envelope.draggable=true;
    envelope.addEventListener("dragstart",e => { active=true; e.dataTransfer.setData("text/plain","工资明细"); });
    envelope.addEventListener("dragend",()=>{active=false;});
  }

  function water(v) {
    const space = area(v,"sx-water");
    const f = frame(space,props+"sediment.webp","床垫左侧与右边墙上的干泥在同一高度，高窗在上方");
    const light = node("i","sx-glint",f);
    const measure = node("i","sx-water-line",f);
    const controls = node("div","sx-track",space);
    const slider = range(controls,"移动对照线到床垫泥边或反光",0,100,38,1,position);
    const ends = node("div","sx-stops",controls);
    function position(value) {
      measure.style.top=value+"%";
      const sediment = Math.abs(value-71)<5, reflection = Math.abs(value-38)<6;
      v.observe(sediment?1:0,sediment?"尺线穿过左边床垫的干泥，也穿过墙皮上同高的砂粒。":
        reflection?"手电晃一下，这道亮边也跟着走。":"继续挪动横尺，让它同时压住两处留下的痕迹。",!sediment&&!reflection);
      v.confirm.textContent="记下这条线";
    }
    button(ends,"照一照亮边",()=>{light.classList.toggle("sx-shift");slider.value=38;position(38);});
    button(ends,"对齐床垫泥边",()=>{slider.value=71;position(71);});
    position(38);
  }

  function shoes(v) {
    const f = frame(area(v),props+"insole.webp","左鞋垫的内侧补片，四十三号鞋袋与鞋底上的三角记号");
    const ticket = node("i","sx-bag-ticket",f);
    const patch = node("i","sx-sole-patch",f);
    pin(f,30,71,"翻开左鞋垫",()=>{
      patch.classList.add("sx-marked");ticket.classList.remove("sx-marked");
      v.observe(0,"垫片有半寸厚，靠内侧收针，正好避开钉伤。");
    },0,v.options);
    pin(f,62,78,"翻看袋号",()=>{
      patch.classList.remove("sx-marked");ticket.classList.add("sx-marked");
      v.observe(1,"四十三号重复用过。比对鞋底，还留有同样的三角点。");
    },1,v.options);
  }

  function tailor(v) {
    const space = area(v,"sx-tailor");
    const f = frame(space,props+"inner-coat.webp","翻开的旧衣内侧，领口的针脚与公交卡袋");
    const pass = node("i","sx-bus-pass",f);
    pin(f,22,47,"松开领内这针",()=>{
      pass.classList.remove("sx-marked");
      v.observe(0,"从里侧挑开扎颈的线，留下原来的布边。");
    },0,v.options);
    pin(f,65,58,"补出口袋",()=>{
      pass.classList.add("sx-marked");
      v.observe(1,"让公交卡沉进新兜里，试一试袋底。");
    },1,v.options);
  }

  function directions(v) {
    const space=area(v,"sx-spread");
    [["住址与袋号",["付修住址　■■■■","对应袋号　四十三","就近上门"]],["取件办法",["鞋袋 → 陈伯柜","衣袋 → 黄姨柜","钥匙领用页 → 罗叔柜"]]].forEach(([title,lines],i)=>{
      const card=node("div","sx-paper",space);
      node("h3","",card,title);
      lines.forEach(line=>node("p","",card,line));
      button(card,i?"附上周二暂存与本人核验":"按门牌排袋号",()=>v.observe(i,i?"取件号在柜里查。对外的指引只说明哪天、找哪家、谁来核验。":"这份指引把付修人的私址和袋号绑在一起。"),"sx-action");
    });
  }

  function witness(v) {
    const space = area(v,"sx-witness");
    const tray = node("div","sx-tray",space);
    const screen = node("div","sx-monitor",space);
    const title = node("h3","",screen,"证人桌 · 预监");
    const visual = node("div","sx-witness-visual",screen);
    visual.hidden=true;
    const scope = node("p","",screen,"先翻看桌上的一份材料。");
    const notes=[
      ["柜门轴响","小茵只同意放到轴响。画面由林雨重站机位、阿琴当场开门。","试听轴响",fx+"door.m4a"],
      ["老邓的账页","上机四十二分钟是账上所记。等到两点是老邓关门时看过表。采访原带留给朋友。","翻看账页",fx+"paper.m4a"],
      ["格栅朝向","罗叔在纸上比内外。只让手和图进镜，锁是谁挂的由当事人另说。","听罗叔摆下锁环",fx+"keys.m4a"]
    ];
    let listen = null;
    notes.forEach(([name,text,action,file],i) => {
      const material=button(tray,name,()=>{
        tray.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b===material)));
        title.textContent=name;scope.textContent=text;
        visual.hidden=false;
        visual.replaceChildren();
        if(i===0) {
          picture(visual,props+"alley-empty.webp","同机位的侧门被棚沿挡住","sx-base");
          awning(visual).style.transform="translateX(-16.8%)";
        } else if(i===1) {
          node("p","",visual,"上机流水　42 分钟");
          node("p","",visual,"关门时刻　凌晨两点");
        } else {
          node("span","sx-grille",visual);
          node("small","sx-sketch-inside",visual,"屋内");
          node("small","sx-sketch-outside",visual,"过道　○");
        }
        visual.dataset.proof=String(i);
        if(listen)listen.remove();
        listen=button(screen,action,()=>play(file),"sx-action");
        v.observe(i,v.options[i].label+"。");
        v.confirm.textContent="交给证人桌";
      },"sx-material");
      node("small","",material,["小茵许可片段","亲历与账页","罗叔本人示意"][i]);
    });
  }

  const scenes = {
    "E00-S01":phone,"E00-S02":camera,"E01-S02":freezer,"E02-S02":stairs,
    "E02-S04":lock,"E03-S03":interview,"E04-S02":receipt,"E05-S02":timeline,
    "E05-S03":mail,"E06-S02":water,"E07-S02":shoes,"E07-S03":tailor,
    "E07-S04":directions,"E08-S04":witness
  };

  function render(host,sceneId,item,options,onSelect) {
    clear();
    const build = scenes[sceneId];
    if (!build || (sceneId==="E07-S04" && item.kind!=="retry")) return false;
    const prompt=item.prompt;
    host.replaceChildren();
    const root = node("section","sx-investigation",host);
    root.dataset.scene=sceneId;
    root.setAttribute("aria-label",prompt);
    const heading=node("h2","sx-prompt",root,prompt);
    heading.tabIndex=-1;
    const stage=node("div","sx-object-stage",root);
    const foot=node("div","sx-foot",root);
    const status=node("p","sx-note",foot,"点画面里的物件查看。");
    status.setAttribute("aria-live","polite");
    let chosen=-1, delivered=false;
    const confirm = button(foot,"确认所见",()=>{
      if(delivered || chosen<0 || options[chosen]?.disabled) return;
      delivered=true;
      clear();
      onSelect(chosen);
    },"sx-confirm");
    confirm.disabled=true;
    const view = {
      stage,confirm,options,
      note(message) { status.textContent=message; },
      observe(index,message,pending=false) {
        chosen=pending?-1:index;
        status.textContent=message;
        confirm.disabled=chosen<0 || !!options[chosen]?.disabled;
        if(chosen>=0) confirm.title=options[chosen].label;
        else confirm.removeAttribute("title");
      }
    };
    // Prevent the narrative's click-to-advance and global Space/arrow shortcuts.
    root.addEventListener("click",event=>event.stopPropagation());
    root.addEventListener("keydown",event=>{
      if([" ","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key))
        event.stopPropagation();
    });
    build(view);
    return true;
  }

  document.addEventListener("visibilitychange",()=>{if (document.hidden) suspend();});
  window.addEventListener("pagehide",clear);
  window.SeasonInvestigation = { render,clear,suspend,setMuted(value) {
    muted=!!value;
    if(muted && audio) { audio.pause(); audio=null; }
  }};
})();
