// Cut on the hand that makes the decision. A public programme, its operator's
// viewfinder and the people standing outside the camera are separate pictures.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const plate = name => ({bg: 'art/broadcast-cut-' + name + '.webp'});
  const old = name => ({bg: 'art/' + name + '.webp'});
  const witness = name => ({...plate(name), view: '林雨所见'});
  const publicShot = name => ({...plate(name), view: '当晚公开画面'});
  const screen = name => ({...plate(name), layout: 'offscreen'});
  const rooftop = {zone: 'road', place: '楼顶 · 晾衣绳'};
  const blank = {near: null, far: null, view: '', pan: 0, moment: ''};
  const cut = value => typeof value === 'string' ? plate(value) : value;
  function scene(id, base, frames) {
    cuts[id] = {...blank, ...base};
    for (const [line, frame] of Object.entries(frames)) cuts[id + '.' + line] = cut(frame);
  }
  function sequence(id, frames) {
    cuts[id] = {...cuts[id], pages: frames.map(([text]) => text)};
    frames.forEach(([,frame], index) => {cuts[id + '~' + index] = cut(frame)});
  }

  scene('E05-S01', {...plate('listen'), zone:'room'}, {
    b02: screen('listen'), b03: screen('wave'), b04: screen('wave'), b05: 'listen',
    b06: {...rooftop, ...plate('four-coats')}
  });
  scene('E05-S02', {...rooftop, ...plate('four-coats')}, {
    b02: 'sleeve', b03: witness('clock'), b04: witness('clock'),
    'b04.o1.f1': witness('draft-week'), 'b04.o2.f1': witness('draft-voice'),
    b05: witness('clock'), b06: witness('recipients')
  });
  sequence('E05-S02.b01', [
    ['四件湿工装把绳子拉到了腰际。窗后透出显示器的蓝光，工位间隔恰好是一根绳那么长。','four-coats'],
    ['一件卫衣伸出袖口按鼠标，一次比一次慢。',witness('sleeve')]
  ]);
  scene('E05-S03', {...old('delivery-windows'), zone:'hall', view:'林雨所见'}, {
    b01: old('delivery-windows'),
    'b01.o1.f1':'returned', 'b01.o2.f1':{...plate('stamped'),cue:'paper'},
    b02:'stamped', b03:'resign', b04:'resign', b05:screen('resign'), b07:screen('birthday')
  });
  sequence('E05-S03.b06', [
    ['保安的耳机电池仓里藏着邮费。林雨只写到县名，衣袖自己在地址下面添上一个小组号，把旧耳机送回家。','parcel'],
    ['最后一窗等一个蛋糕，妹妹在里面摆好两只碟。林雨捡出盒绳里卡住的蓝蜡烛。','birthday']
  ]);
  sequence('E05-S03.b08', [
    ['林雨隔着窗帮妹妹扶住纸碟。湿玻璃上映出四张回执。','birthday'],
    ['她再伸手，指肚让一截旧衣夹夹疼了。楼顶的衣绳就在手边。',{...rooftop,...plate('peg'),view:''}]
  ]);
  scene('E05-S04', {...rooftop, ...plate('wrong-cut')}, {
    b02:'peg-tap', b03:'wrong-cut', b04:screen('wrong-cut'), b05:'wrong-cut',
    'b05.o1.f1':screen('signed'), 'b05.o1.f2':'signed',
    'b05.o2.f1':screen('private-export'), 'b05.o2.f2':'private-export',
    b06:'wednesday', b07:'private-audio', b08:'xu-sheet',
    b09:{...plate('xu-sheet'),caption:[63,12,31]}, b10:'xu-sheet', b11:'xu-sheet'
  });
  scene('E05-S05', {...plate('pay'),zone:'shop'}, {
    b01:screen('pay'), b02:'pay', b03:screen('pay'), wages:'erase-lens', b04:'pay',
    'sister.1':{...plate('sister-call'),place:'302 · 窗边',date:'几天后',zone:'room'},
    'sister.2':{...screen('sister-call'),place:'302 · 窗边',date:'几天后',zone:'room'},
    'sister.3':{...plate('sister-call'),place:'302 · 窗边',date:'几天后',zone:'room',caption:[6,61,33]}
  });

  scene('E08-S01', {...plate('cable'),zone:'road'}, {
    b02:{...plate('offer'),caption:[48,8,35]}, b03:'public-vs-blank', b04:'offer',
    b05:'public-vs-blank', b06:screen('signed'), b07:screen('private-export')
  });
  scene('E08-S02', {...plate('cover-number'),zone:'road'}, {
    b02:'chili-camera', b03:'chili-camera', b04:'framing', b05:'cover-ledger', b06:'cover-ledger',
    b08:witness('coins'), b09:{...plate('empty-monitor'),cue:'cafe-mouse-four'},
    b10:witness('xiaomei'), b11:witness('xiaomei'), b12:witness('xiaomei')
  });
  sequence('E08-S02.b01', [
    ['有人举手机蹲在三号桌前等红伞。阿琴把粉叔家属的电话号码从炉边夹板上遮住，阿岑扶起挡路的折凳。','cover-number'],
    ['阿哲来拿存在201的辣椒，一瓶还剩大半，另一瓶盖上贴着老许写的“有人回来拿”。','chili-camera']
  ]);
  sequence('E08-S02.b07', [
    ['第一次牌响，林雨看见一起等灯的亡者到了，各自坐好。有人撑伞，有人端空碗，有人进来还先擦鞋。',witness('visitors')],
    ['阿岑只觉得身后多了几种重量不同的座椅响。直播还在倒数。屏幕里那一排椅子依旧空着。',{...plate('empty-monitor'),view:'阿岑预监'}]
  ]);
  scene('E08-S03', {...plate('control'),zone:'road'}, {
    b02:'control', b03:'control', b04:'control', b05:'control',
    'b05.o1.f1':{...plate('deliver'),cue:'paper'},
    'b05.o2.f1':'return-contract'
  });
  sequence('E08-S03.b01', [
    ['周铭的审定片只有《夜访》自有的空巷、柜门和红灯，没有未经同意的原件。','trailer'],
    ['它将窄门关上的画面放在“女孩求助”之后，掐了开门声；片尾是「你敢来吗」。这样剪，观众很容易重新相信那个早已更正的标题。','trailer'],
    ['周铭拿出合同给两位合伙人签。','control']
  ]);
  scene('E08-S04', {...plate('lower-camera'),zone:'road'}, {
    b02:'lower-camera', 'correction.1':screen('stop-hinge'), b03:'framing',
    'b03.o1.f1':publicShot('demo-door'), 'b03.o1.f2':publicShot('demo-door'),
    'b03.o2.correction':{...plate('stop-hinge'),cue:'door'},
    'b03.o2.f1':publicShot('deng-log'), 'b03.o2.f2':{...old('cafe-cut-private-copy'),view:'朋友私下留存',zone:'cafe'},
    'b03.o3.correction':{...plate('stop-hinge'),cue:'door'},
    'b03.o3.f1':publicShot('lock-drawing'), 'b03.o3.f2':publicShot('lock-drawing'),
    b05:{...plate('chili-camera'),view:'镜头外',layout:'offscreen'},
    b06:{...plate('framing'),view:'镜头外',layout:'offscreen'},
    b07:old('key-counter'),
    b09:witness('liang'), b10:witness('liang'), b11:witness('liang')
  });
  sequence('E08-S04.b04', [
    ['林雨念出试投截图的日期。“那天我没签字。巷口那张底图，是我先挂上去的。”',publicShot('withdrawn')],
    ['桌上空着一格。有人在桌后轻轻说了声谢，阿岑把手从变焦环上拿开。','zoom-ring']
  ]);
  sequence('E08-S04.b08', [
    ['第二声牌响，旧荧屏在各自的屋里亮了一瞬。阿岑的预监仍是棚下那张桌。',{...plate('framing'),view:'阿岑预监'}],
    ['林雨抬眼，看见梁安挤进一群大人中间，踮脚看弹幕。',witness('liang')]
  ]);

  const julyClose = {date:'7月18日 · 收播后',place:'三巷 · 粉摊外',zone:'road'};
  const july27 = {date:'7月27日 · 白天',place:'三巷十二号',zone:'room'};
  scene('E08-S05', {...julyClose,...old('after-show')}, {
    b01:{...julyClose,...old('after-show')}, b02:{...july27,...plate('budget')},
    'four-days':{...july27,...plate('schedule')}, b03:{...july27,...plate('schedule')},
    'signed-later':{...july27,...plate('schedule')}, b04:{...july27,...plate('schedule')},
    b05:{...july27,...plate('budget')},
    'b05.o1.f1':{...july27,...plate('return-copies'),cue:'paper'},
    'b05.o2.f1':{...july27,...plate('four-tuesdays'),cue:'paper'}
  });
  scene('E08-S06', {...plate('return-copies'),zone:'road',date:'8月初',place:'三巷 · 告别'}, {
    'handover.2':'return-copies', 'handover.3':'cable-walk',
    b02:{...plate('bus-meal'),place:'棠西公交站'}, b03:{...plate('bus-meal'),place:'棠西公交站'},
    b04:{...plate('bus-meal'),place:'棠西公交站'},
    b06:{...plate('away-call'),date:'几星期后',place:'外地 · 工作间',zone:'room'}
  });
  sequence('E08-S06.b01', [
    ['老许把押金退清，水电抄到昨天。小茵过来还充电宝的短线，上一次落在她公司，这次终于想起来。','cable-walk'],
    ['阿琴把包好的肠粉递到车窗下。',{...plate('bus-meal'),place:'棠西公交站'}]
  ]);
  sequence('E08-S06.b05', [
    ['有人敲三下车窗。阿岑回头时只见雨棚边甩来一把湿伞，',{...plate('bus-seat'),place:'棠西公交站'}],
    ['林雨却看见张婆婆转身，在路口给下一班夜车留位。',{...witness('bus-granny'),place:'棠西公交站'}],
    ['几星期后她在外地收到一通电话，有人找旧票上的店。她按约先问店主，再回拨，没有替人家接下下一个采访。',{...plate('away-call'),date:'几星期后',place:'外地 · 工作间',zone:'room'}]
  ]);
  const tuesday2 = {date:'8月 · 第二个周二'};
  scene('E08-S07', {...plate('send-correction'),zone:'room'}, {
    'fewer.1':{...plate('send-correction'),place:'后排小间'},
    b01:'cut-key', b02:'yawn', b03:{...tuesday2,...plate('courier-map')},
    b04:{...tuesday2,...plate('courier-map')}, b05:{...tuesday2,...plate('courier-phone')},
    b06:{...tuesday2,...plate('archive-lit')}, b07:{...tuesday2,...plate('archive-lit')}
  });
  const signNight = {date:'7月18日 · 签字当晚',place:'粉摊 · 直播桌',zone:'road'};
  const nextDay = {date:'7月19日 · 次日',place:'今宵便利店',zone:'shop'};
  const august = {date:'8月初',place:'新住处 · 厨房',zone:'room'};
  scene('E08-S08', {...signNight,...plate('lower-camera')}, {
    'onair.2':{...nextDay,...plate('apology')},
    b02:{...august,zone:'shop',place:'今宵便利店 · 侧门',...plate('turn-lamp')},
    b03:{...august,...plate('cannot-retract')}, b04:{...august,...witness('earlobe')},
    b05:{...august,...screen('cannot-retract')}, b07:{...august,...witness('glass-looks')}
  });
  sequence('E08-S08.onair.1', [
    ['签字当晚，首页预告一过，小茵把机位压低到只照桌面。她当着那些观众说，是她穿过雨棚开的门。',{...signNight,...plate('lower-camera')}],
    ['她亲手放出门轴声，在母亲开口前停住。',{...signNight,...plate('stop-hinge'),cue:'door'}]
  ]);
  sequence('E08-S08.b01', [
    ['第一笔保底到账，团队付清器材租金。阿岑终于买下那支用惯的镜头，拿来拍的第一件事是给朋友婚礼补一组家人合照。',{...august,...plate('wedding'),place:'婚礼 · 家人合照'}],
    ['林雨搬到有独立灶台的小房间，试着蒸了第一碟肠粉。她把粉浆倒厚了，一折就断。',{...august,...plate('broken-noodles')}]
  ]);
  sequence('E08-S08.b06', [
    ['她把已经凉掉的粉吃了。楼下今晚还有人等阿琴关门。',{...august,...plate('cold-noodles')}],
    ['玻璃里，剪片的人终于抬起头，叫了她一声全名。',{...august,...witness('glass-looks')}]
  ]);
})();
