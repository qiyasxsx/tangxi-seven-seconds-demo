(() => {
  'use strict';
  const local={
    'E01-S03.b10':['pot',.30], 'E02-S02.b07':['pot',.21],
    'E04-S01.b01':['pot',.32], 'E05-S02.b01':['seep',.13],
    'E06-S02.b01':['seep',.31],
    'E08-S02.b07':['one-strike',.37], 'E08-S04.b08':['one-strike',.48]
  };
  let active=null,muted=false;
  function quiet(){if(active){active.pause();active=null}}
  const contacts=new Set(['cafe-coin','cafe-chair','cafe-drive','cafe-mouse-four','drain','seep','pot','one-strike']);
  function contact(name){
    if(!contacts.has(name))return false;
    if(!muted && !document.hidden){quiet();active=new Audio('foley/'+name+'.m4a');active.volume=.46;active.play().catch(()=>{})}
    return true;
  }
  function perform(line){
    const cue=local[line.id] || (line.text.includes('第三声来得很迟')?['one-strike',.32]:null);
    if(!cue || muted || document.hidden)return;
    quiet();active=new Audio('foley/'+cue[0]+'.m4a');active.volume=cue[1];active.play().catch(()=>{});
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)quiet()});
  window.SeasonFoley={perform,contact,quiet,mute(value){muted=value;if(value)quiet()}};
})();
