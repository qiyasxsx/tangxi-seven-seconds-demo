// The cellar keeps one geography: dry landing, barred exit, then the same
// landing after the water recedes. Only authored 〔换镜〕 pages change view.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const art = name => ({bg:'art/flood-cut-'+name+'.webp'}), vision=name=>({...art(name),view:'林雨所见'});
  const cellar={near:null,far:null,zone:'hall',place:'十二号 · 半地下层',view:'',moment:'',pan:0},alley={zone:'road',place:'后巷 · 格栅外'},hall201={zone:'room',place:'十二号 · 201门厅'};
  const scene=(id,base,frames={})=>{cuts[id]={...cellar,...base};for(const [beat,frame] of Object.entries(frames))cuts[id+'.'+beat]=frame;};
  scene('E06-S01',{bg:'art/high-window.webp',zone:'road',place:'三巷十二号 · 后楼'},{'night-bed':art('deposit'),deposit:art('deposit'),b02:art('divider'),b04:art('divider'),b05:art('crop')});
  scene('E06-S02',art('azhe-stairs'),{b01:vision('aliang'),b02:vision('aliang'),b03:vision('face'),'b04.o1.f1':art('torch'),'b04.o2.f1':art('mud'),b07:vision('aliang')});
  scene('E06-S03',art('landing'),{b01:art('landing'),b02:art('receipt'),b04:vision('bed-wet'),'b05.o1.f1':art('grip'),'b05.o1.name':art('name'),'b05.o1.f2':art('lift'),'b05.o2.f1':art('call'),'b05.o2.f2':art('name'),b06:vision('knock'),b08:vision('aliang')});
  scene('E06-S04',{...alley,...art('outer-lock')},{'b01~0':art('key-pass'),'b01~1':art('unlock'),'b01~2':art('first-out'),'b01~3':art('catch'),b02:{...alley,...art('first-out')},b03:vision('aliang'),b04:vision('fifth-bed'),b05:vision('aliang'),'b06~0':{...alley,...vision('bucket')},'b06~1':{...alley,...art('towel')},b07:{...alley,bg:'art/gate-open.webp',actors:true,near:'linBackListen',far:'azhe',view:'',pan:0},'ownwords.1':{...hall201,...art('xu-review'),date:'追押金当晚'},'ownwords.2':{...hall201,...art('xu-review'),date:'追押金当晚'},'ownwords.3':{...hall201,...art('xu-review'),date:'追押金当晚'},b08:{...hall201,...art('save-slip')},'b09.o1.f1':{...hall201,...art('save-slip')},'b09.o2.f1':{...hall201,...art('sketch')},b11:{...hall201,...art('chili')}});
})();
