(() => {
  'use strict';
  const local={
    'E00-S03.b02':['carton',.20], 'E00-S03.b06':['shutter',.23],
    'E01-S02.b01':['freezer-lid',.18], 'E01-S04.thumb':['paper',.15],
    'E02-S01.b16':['bag',.15], 'E02-S02.b15':['knock',.18],
    'E02-S04.b01':['latch',.22], 'E03-S01.b01':['keyboard',.12],
    'E03-S05.fifth-button':['cafe-mouse-two',.27],
    'E01-S03.b10':['pot',.30], 'E02-S02.b05':['pot',.21],
    'E04-S01.b01':['pot',.32], 'E05-S02.b01':['seep',.13],
    'E06-S02.b01':['seep',.31],
    'E03-S05.b07.o1.f2':['cafe-mouse-four',.27],
    'E03-S05.b07.o2.f2':['cafe-mouse-four',.27], 'E03-S05.b12':['cafe-chair',.22],
    'E03-S05.b17':['cafe-drive',.22], 'E06-S04.b06':['drain',.25],
    'E08-S02.b06':['one-strike',.37], 'E08-S04.b08':['one-strike',.48]
  };
  let active=null,muted=false,context=null,lastName='',lastAt=0;
  function quiet(){if(active){active.pause();active=null}}
  const recorded=new Set(['cafe-coin','cafe-chair','cafe-drive','cafe-mouse-four','cafe-mouse-two','drain','seep','pot','one-strike']);
  const contacts=new Set([...recorded,
    'keys','latch','paper','freezer-lid','tv-noise','carton','shutter','threshold','bag','knock','keyboard','coin','dish']);
  function synth(name,volume=.28){
    if(muted||document.hidden)return;
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)return;
    context ||= new AudioContext(); context.resume().catch(()=>{});
    const now=context.currentTime+.012, out=context.createGain();out.gain.value=Math.min(.12,volume*.27);out.connect(context.destination);
    const tone=(frequency,when=now,duration=.11,type='triangle',gain=1)=>{
      const osc=context.createOscillator(),env=context.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,when);
      env.gain.setValueAtTime(.0001,when);env.gain.exponentialRampToValueAtTime(gain,when+.008);env.gain.exponentialRampToValueAtTime(.0001,when+duration);
      osc.connect(env).connect(out);osc.start(when);osc.stop(when+duration+.02);
    };
    if(name==='keys'||name==='coin'){[0,.055,.12].forEach((delay,i)=>tone(1500-i*180,now+delay,.07,'sine',.52));return}
    if(name==='paper'||name==='bag'||name==='carton'){tone(175,now,.16,'triangle',.5);tone(460,now+.035,.08,'sine',.22);return}
    if(name==='shutter'||name==='latch'||name==='threshold'||name==='knock'){tone(name==='shutter'?108:245,now,.13,'square',.52);tone(name==='shutter'?76:160,now+.07,.19,'triangle',.35);return}
    if(name==='freezer-lid'||name==='dish'){tone(name==='dish'?980:330,now,.11,'sine',.47);tone(name==='dish'?1420:210,now+.06,.15,'triangle',.25);return}
    if(name==='keyboard'){[0,.07].forEach(delay=>tone(1120,now+delay,.045,'square',.32));return}
    if(name==='tv-noise'){tone(280,now,.08,'sawtooth',.18);return}
    tone(260,now,.11,'triangle',.36);
  }
  function contact(name){
    if(!contacts.has(name))return false;
    // A beat-specific foley cue can coincide with the generic visible-action
    // cue in direction.js.  Keep one physical contact, rather than layering
    // two copies of the same strike on the same frame.
    const now=performance.now();
    if(name===lastName && now-lastAt<260)return true;
    lastName=name;lastAt=now;
    if(recorded.has(name) && !muted && !document.hidden){quiet();active=new Audio('foley/'+name+'.m4a');active.volume=.46;active.play().catch(()=>{})}
    else synth(name,.32);
    return true;
  }
  function perform(line){
    const cue=local[line.id] || (line.text.includes('第三声来得很迟')?['one-strike',.32]:null);
    if(!cue || muted || document.hidden)return;
    lastName=cue[0];lastAt=performance.now();
    if(!recorded.has(cue[0])){synth(cue[0],cue[1]);return}
    quiet();active=new Audio('foley/'+cue[0]+'.m4a');active.volume=cue[1];active.play().catch(()=>{});
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)quiet()});
  window.SeasonFoley={perform,contact,quiet,mute(value){muted=value;if(value)quiet()}};
})();
