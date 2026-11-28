// Late chapters hold a camera in the room until an authored 〔换镜〕 asks it
// to move. These are shot assignments, never a second set of dialogue pages.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const art = name => ({bg: 'art/broadcast-cut-' + name + '.webp'});
  const old = name => ({bg: 'art/' + name + '.webp'});
  const vision = name => ({...art(name), view: '林雨所见'});
  const publicShot = name => ({...art(name), view: '当晚公开画面'});
  const screen = name => ({...art(name), layout: 'offscreen'});
  const rooftop = {zone: 'road', place: '楼顶 · 晾衣绳'};
  const fourCoats = {bg:'art/broadcast-cut-four-coats-r2.webp'};
  const landing = {bg:'../first-take/art/landingView.webp', zone:'hall', place:'三〇二 · 门口', near:null, far:null, actors:false, view:'', pan:0};
  // These late plates already carry the people who are physically present.
  // A replacement plate must not add a second, mismatched pair of portraits.
  const clear = {near: null, far: null, actors: false, view: '', pan: 0, moment: ''};
  const scene = (id, base, frames={}) => { cuts[id] = {...clear, ...base}; for (const [beat, frame] of Object.entries(frames)) cuts[id + '.' + beat] = frame; };

  scene('E05-S01', {...art('listen'), zone: 'room', place: '302 · 剪辑桌'}, {b02:screen('listen'),b03:screen('wave'),b04:screen('wave'),b05:{bg:'art/rental-desk.webp',actors:true,near:'linFrontListen',far:null,view:'',pan:0},b06:{bg:'art/rental-desk.webp',actors:true,near:'linFrontListen',far:null,view:'',pan:0},b07:old('rental-desk'),
    'b07~1':{bg:'approaches/roof-door.webp',zone:'hall',place:'三楼往上 · 天台铁门'},
    'b07~2':{...rooftop,...fourCoats}});
  scene('E05-S02', {...rooftop,...fourCoats}, {b02:art('sleeve'),b03:vision('clock'),'b04.o1.f1':vision('draft-week'),'b04.o2.f1':vision('draft-voice'),b06:vision('recipients')});
  scene('E05-S03', {...old('delivery-windows'),zone:'hall',place:'楼顶 · 收件窗',view:'林雨所见'}, {'b02.o2.f1':art('stamped'),b03:art('stamped'),b04:{bg:'art/broadcast-cut-resign-r2.webp',near:null,far:null,actors:false,view:'林雨所见',pan:0},b05:screen('resign-r2'),b06:screen('birthday'),b07:{...rooftop,...art('peg')}});
  scene('E05-S04', landing, {b01:landing,b02:landing,b03:landing,b04:{...landing,medium:'inbox',thread:'项目群 · 周铭'},b05:{...old('rental-desk'),zone:'room',place:'三〇二 · 剪辑桌'},'b06.o1.f1':screen('signed'),'b06.o1.f2':art('signed'),'b06.o2.f1':screen('private-export'),'b06.o2.f2':art('private-export'),b09:landing,b10:landing,b11:landing,b12:landing});
  const breakfast=old('retake-breakfast');
  scene('E05-S05', {...art('pay'),zone:'outside',place:'三巷 · 早摊'}, {
    wages:art('erase-lens'), b04:breakfast, 'sister.1':breakfast, 'sister.2':breakfast, 'sister.3':breakfast,
    'b05~0':art('pay'), 'b05~1':{...old('high-window'),date:'5月22日 · 傍晚',place:'十二号后楼外',zone:'road'},
  });

  scene('E08-S01', {...art('cable'),zone:'road',place:'粉摊 · 临时播出台'}, {b02:art('offer'),b03:art('public-vs-blank'),b04:screen('signed'),b05:screen('private-export'),b06:art('return-contract'),'stop-button':art('return-contract')});
  scene('E08-S02', {...art('cover-number'),zone:'road',place:'三巷 · 粉摊'}, {b02:art('chili-camera'),b04:art('cover-ledger'),b06:vision('visitors'),b07:vision('coins'),b08:art('empty-monitor'),b09:vision('xiaomei')});
  scene('E08-S03', {...art('control'),zone:'road',place:'粉摊 · 控制桌'}, {b01:art('trailer'),b02:{bg:'art/outdoor-set.webp',actors:true,near:'linFrontListen',far:null,view:'阿岑的机位',pan:0},b03:{bg:'art/outdoor-set.webp',actors:true,near:'linFrontListen',far:null,view:'阿岑的机位',pan:0},b04:{bg:'art/outdoor-set.webp',actors:true,near:'linFrontListen',far:null,view:'阿岑的机位',pan:0},'b05.o1.f1':art('deliver'),'b05.o2.f1':art('return-contract')});
  scene('E08-S04', {bg:'art/broadcast-cut-lower-camera-r2.webp',zone:'road',place:'粉摊 · 证人桌'}, {'correction.1':art('stop-hinge'),'b03.o1.f1':publicShot('demo-door'),'b03.o1.f2':publicShot('demo-door'),'b03.o2.correction':art('stop-hinge'),'b03.o2.f1':publicShot('deng-log'),'b03.o2.f2':{...old('cafe-cut-private-copy'),zone:'cafe',view:'朋友私下留存'},'b03.o3.correction':art('stop-hinge'),'b03.o3.f1':publicShot('lock-drawing'),'b03.o3.f2':publicShot('lock-drawing'),b04:publicShot('withdrawn'),b05:{bg:'art/witness-table.webp',actors:true,near:'linBackListen',far:'azhe',view:'',pan:0},b06:{bg:'art/witness-table.webp',actors:true,near:'linBackListen',far:'luo',view:'',pan:0},b08:vision('liang')});
  const afterShow={date:'7月18日 · 收播后',place:'三巷 · 粉摊外',zone:'road'}, july27={date:'7月27日 · 白天',place:'粉摊 · 桌边',zone:'road',bg:'approaches/crossing-morning.webp'};
  const afterNight={...afterShow,bg:'approaches/broadcast-yard.webp'};
  scene('E08-S05', afterNight, {'b01~0':afterNight,'b01~1':july27,b02:{...july27,...art('schedule')},b03:{...july27,...art('schedule')},'signed-later':{...july27,...art('schedule')},b04:{...july27,...art('budget')},'b05.o1.f1':{...july27,...art('return-copies')},'b05.o2.f1':{...july27,...art('four-tuesdays')}});
  const bus={date:'8月初',place:'棠西公交站',zone:'road'};
  scene('E08-S06', {...bus,...art('bus-seat')}, {'handover.1':art('bus-seat'),'handover.2':art('bus-seat'),'handover.3':art('cable-walk'),b01:art('bus-seat'),b02:art('bus-meal'),b03:art('bus-meal'),'b04~0':art('bus-seat'),'b04~1':{date:'几周后',place:'外地 · 工作间',zone:'room',...art('away-call')},b05:art('bus-seat'),b06:art('bus-seat')});
  const julyCabinet={date:'7月27日 · 下午',place:'三巷 · 旧柜档',zone:'room'}, firstTuesday={date:'8月 · 第一个周二',place:'三巷 · 旧柜档',zone:'room'}, secondTuesday={date:'8月 · 第二个周二',place:'三巷 · 旧柜档',zone:'room'};
  scene('E08-S07', {...julyCabinet,...art('send-correction')}, {'fewer.1':{...julyCabinet,...art('send-correction')},'b01~0':{...julyCabinet,...art('cut-key')},'b01~1':{...firstTuesday,...art('archive-lit')},b02:{...firstTuesday,...art('yawn')},b03:{...secondTuesday,...art('courier-map')},b04:{...secondTuesday,...art('courier-map')},b05:{...secondTuesday,...art('courier-phone')},b06:{...secondTuesday,...art('archive-lit')},b07:{...secondTuesday,...art('archive-lit')},b08:{...secondTuesday,...art('archive-lit')}});
  const signing={date:'7月18日 · 签字当晚',place:'粉摊 · 直播桌',zone:'road'}, august={date:'8月初',place:'新住处 · 厨房',zone:'room'};
  scene('E08-S08', {...signing,...art('stop-hinge')}, {'onair.1':{...signing,...art('stop-hinge')},'onair.2':{date:'7月19日 · 次日',place:'今宵便利店',zone:'shop',...art('apology')},'b01~0':{date:'8月初',place:'婚礼 · 家人合照',zone:'road',...art('wedding')},'b01~1':{...august,...art('broken-noodles')},'b02~0':{date:'8月初',place:'今宵便利店 · 侧门',zone:'shop',...art('turn-lamp')},'b02~1':{...august,...art('cannot-retract')},b03:{...august,...old('new-kitchen')},b04:{...august,...old('microwave')},b05:{...august,...old('new-kitchen')},b06:{...august,...old('new-kitchen')},b07:{...august,...old('microwave')},b08:{...august,...old('microwave')}});
})();
