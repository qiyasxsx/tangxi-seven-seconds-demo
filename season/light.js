// Light follows what the crew has witnessed. Remembering the most recent cue
// keeps the exposure through a reply, its reading pages, a choice or a reload.
(() => {
  const scenes={
    'E00-S01':['dusk',{b05:'screen',b13:'dusk'}], 'E00-S02':['dusk'], 'E00-S03':['counter'], 'E00-S04':['dusk'],
    'E01-S01':['dusk'], 'E01-S02':['counter',{b03:'rain'}],
    'E01-S03':['rain',{'b02~2':'doorlight',b07:'doorlight','b07~2':'counter'}], 'E01-S04':['counter',{b03:'rain','b03~1':'hearth'}], 'E01-S05':['counter'],
    'E02-S01':['day',{b16:'stairwell'}], 'E02-S02':['stairwell',{b05:'supper',b11:'stairwell',b15:'dusk'}],
    'E02-S03':['dusk',{b07:'stairwell'}], 'E02-S04':['stairwell',{b08:'supper',b13:'witness',b20:'stairwell'}], 'E02-S05':['day'],
    'E03-S01':['night',{b07:'crt'}], 'E03-S02':['crt',{b08:'night'}], 'E03-S03':['day'], 'E03-S04':['counter'],
    'E03-S05':['crt',{b08:'loss',b09:'aftergame','friends.1':'screen',b15:'aftergame',b24:'night'}],
    'E04-S01':['hearth',{b13:'queue'}], 'E04-S02':['night',{b10:'stairwell'}], 'E04-S03':['queue',{b06:'hearth',b11:'queue',b14:'hearth'}], 'E04-S04':['day'],
    'E05-S01':['screen'], 'E05-S02':['dusk',{b03:'screen'}], 'E05-S03':['screen'], 'E05-S04':['screen',{b09:'counter'}], 'E05-S05':['day'],
    'E06-S01':['dusk'], 'E06-S02':['stairwell',{b03:'submerged'}], 'E06-S03':['submerged',{b08:'grate'}],
    'E06-S04':['grate',{'b01~2':'doorlight',b03:'submerged',b06:'grate','b06~1':'counter','ownwords.1':'supper'}],
    'E07-S01':['day'], 'E07-S02':['dusk',{b02:'bench'}], 'E07-S03':['bench'], 'E07-S04':['bench'], 'E07-S05':['counter'],
    'E08-S01':['dusk'], 'E08-S02':['night',{b06:'doorlight'}], 'E08-S03':['screen',{b06:'witness'}], 'E08-S04':['witness',{b08:'doorlight'}],
    'E08-S05':['hearth'], 'E08-S06':['day'], 'E08-S07':['day',{b02:'bench'}], 'E08-S08':['screen']
  };
  window.SeasonLight=(scene,history=[],page=0)=>{
    const [initial,cues]=scenes[scene]||['day'];let state=initial;
    if(!cues)return state;
    for(const [index,line] of history.entries()){
      const key=line.id.slice(scene.length+1);
      if(cues[key])state=cues[key];
      const lastPage=index===history.length-1?page:Infinity;
      for(const [id,value] of Object.entries(cues)){
        const [beat,offset]=id.split('~');
        if(beat===key && offset!==undefined && +offset<=lastPage)state=value;
      }
    }
    return state;
  };
})();
