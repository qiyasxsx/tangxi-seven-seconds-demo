// Unlabelled figures in Lin's subjective shots are kept out of the crew's footage.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const plate = (bg, extra = {}) => ({bg, near: null, far: null, view: '', ...extra});
  const draw = (name, extra) => plate('art/streets-cut-' + name + '.webp', extra);
  const old = (name, extra) => plate('art/' + name + '.webp', extra);
  const subjective = {view: '林雨所见'};
  function direct(scene, entries) {
    for (const [beats, shot] of entries) {
      for (const beat of beats.split(' ')) cuts[beat === 'site' ? scene : scene + '.' + beat] = shot;
    }
  }

  direct('E00-S01', [
    ['site', draw('lunch', {zone: 'room', place: '剪辑桌 · 两份午饭'})],
    ['b03', old('editing-lunch')],
    ['b04 b05 b06 b07', draw('counter-photo')],
    ['b08 b08.o1.f1 b08.o2.f1', old('editing-lunch')],
    ['b09 b11 b12 b13', draw('remove-pin')],
  ]);
  // Retain the original playable approach, entrance and shoulder compositions.
  direct('E00-S02', [
    ['site', {place: '旧厂牌楼 · 雨棚', zone: 'road'}],
    ['b04', draw('twine', subjective)],
  ]);
  direct('E00-S03', [
    ['site', {place: '今宵便利 · 沿街铺面', zone: 'shop'}],
    ['b02', draw('crate')],
    ['b05.o1.f1', draw('tally', {pages: ['这里。', '灭了。您要看刚才那段，我可以倒回去。']})],
    ['b05.o1.f1~1 b05.o1.f2 lens-off', draw('stop-camera')],
    ['b05.o2.f1 b05.o2.f2 phone-back', draw('qin-scrub')],
  ]);
  direct('E00-S04', [
    ['site', draw('stop', {zone: 'road', place: '公交站 · 候车棚'})],
    ['b02 b02.o1.f1 b02.o2.f1', draw('hinge-pair')],
    ['b09', draw('bus-window', {...subjective, zone: 'room', place: '末班前一趟车'})],
  ]);
  direct('E01-S01', [
    ['site', draw('old-phone', {zone: 'outside', place: '三巷铁牌下'})],
    ['permission.1 permission.2 b07 b08 b09 b10', draw('pull-back')],
    ['b11 b12', draw('take-cable')],
  ]);
  direct('E01-S04', [
    ['site', draw('thumb', {place: '粉摊 · 玻璃纸方桌', zone: 'outside'})],
    ['b01', draw('supper', {cue: ''})],
    ['b01~1', draw('thumb', {cue: ''})],
    ['b05 b06', draw('hinge-pair')],
    ['b07 b08 b09', draw('wipe-table')],
    ['b10', old('rice-stall', {near: 'linBackListen', far: 'qinStanding'})],
    ['b11 b12', draw('towel')],
  ]);
  direct('E01-S05', [
    ['site', old('freezer', {place: '今宵便利 · 蒸柜', date: '3月21日 01:55', zone: 'shop'})],
    ['b01', draw('four-fingers', {...subjective, pages: [
      '一个老人站在蒸柜旁，伸手要四个叉烧包。',
      '阿岑看见牛皮纸袋从蒸柜滑下来，伸手一托，林雨却在跟半空里的人说话。',
    ]})],
    ['b01~1', draw('catch-bag')],
    ['b02', draw('four-fingers', subjective)],
    ['b03', draw('catch-bag', {pages: [
      '纸袋坠到阿岑掌心，空的。',
      '阿琴打了个哈欠，给两人扫了一瓶水。收银机结完矿泉水的钱，额外吐出一截湿纸，上面只有“郑家楼”三个倒印的字。',
    ]})],
    ['b03~1', draw('wet-receipt', {layout: 'speech', caption: [5, 22, 34]})],
    ['b04', {bg: '../first-take/art/shop.webp', near: 'linBackListen', far: 'qinStanding'}],
    ['b05 b06 b07', old('zheng-front', {zone: 'road', date: '3月21日至27日', place: '郑家楼外'})],
    ['supper.1', draw('supper', {zone: 'outside', date: '其间一个晚上', place: '相约吃粉'})],
    ['b08 b09', {bg: '../first-take/art/hallLit.webp', near: 'linBackListen', far: 'xuStanding', zone: 'hall', place: '三巷十二号', date: '3月27日'}],
    ['b10 b11', draw('lift-bed', {zone: 'room', date: '3月27日', place: '三〇二 · 临街房间'})],
    ['b12 b13', old('dining-reflection', {...subjective, zone: 'room', date: '3月27日', place: '三〇二 · 柜脚'})],
  ]);

  direct('E04-S01', [
    ['site', old('chopsticks', {zone: 'outside', place: '夜宵粉摊 · 炉边'})],
    ['b02 b03 spare-seat', draw('offer-seat', {caption: [53, 16, 25]})],
    ['b04 b05', draw('long-shadows', subjective)],
    ['b06', old('chopsticks')],
  ]);
  direct('E04-S02', [
    ['site', old('shed-meal', {zone: 'outside', place: '工棚旧址'})],
    ['b02.o1.f1', draw('carbon', {layout: 'speech', caption: [58, 11, 33]})],
    ['b02.o2.f1', draw('mug-base', {caption: [61, 14, 33]})],
    ['b02.o2.f2', draw('trace-mug', {layout: 'speech', caption: [62, 15, 31]})],
    ['b03 b04', old('bridge-meal', {place: '桥底', zone: 'road'})],
    ['b05', draw('helmet', {place: '桥底', zone: 'road'})],
    ['b06 b07 b08', old('dock-meal', {place: '卸货门后'})],
    ['b09', draw('worker-meal', {place: '卸货门后'})],
  ]);
  direct('E04-S03', [
    ['site', draw('line', {...subjective, zone: 'outside', place: '粉摊 · 队尾'})],
    ['b01', draw('line', {...subjective, pages: [
      '回到摊上，那个蓝白耳麦还在队伍里。',
      '排在小茵前面的人脚跟离地；小茵的鞋挤破水泡，袜口有血。',
      '她手机第三次震，屏幕亮着今晚换班的通知。',
    ]})],
    ['b01~1', draw('heel', {...subjective, layout: 'speech', caption: [4,19,35]})],
    ['b04.o1.f1', draw('line', subjective)],
    ['b04.o1.f2', draw('earpiece')],
    ['b04.o2.f1', draw('aunt-calls')],
    ['b04.o2.f2', draw('take-id')],
    ['b05', draw('uncover', {pages: [
      '粉叔把压住的两根筷子推到她手边，转过身调火。林雨把没动的那碟掀开。',
      '小茵咬得慢，吃到第二口才发觉已经凉了。',
    ]})],
    ['b05~1 b06 b07', draw('second-bite')],
    ['b08', old('chopsticks', {pages: [
      '小茵把自己的碟子叠上来。队伍退回棚边。',
      '她刚才站的位置上，短暂地出现了另一个端着外卖盒的林雨，还在等一个工单提示。',
      '林雨往后退一步，那个人却往前走了一步，把下一个号举到胸前。粉叔撂下碟子。',
    ]})],
    ['b08~1', old('queue-double', subjective)],
    ['b08~2 b09 b10', draw('double', subjective)],
    ['b11', draw('double', {...subjective, pages: [
      '队里的林雨侧过身来。她脸上没有眼睛，只有旧手机熄屏时留下的两点指印。',
      '林雨端着碟从摊外回到矮凳。小茵把手机翻过来，两个人面朝同一碟还有点温的酱汁。',
    ]})],
    ['b11~1', draw('back-to-stool')],
  ]);
  direct('E04-S04', [
    ['site', draw('ledger', {zone: 'outside', place: '天亮的粉摊 · 寻人本'})],
    ['b03', draw('recognise-mug')],
    ['b06 b07 b08 b09', draw('scallions')],
    ['b10', {bg: '../first-take/art/hallLit.webp', near: null, far: null, view: '', zone: 'hall', place: '三巷十二号 · 续租'}],
    ['visit.1', draw('charger-visit', {zone: 'room', place: '三〇二 · 床边', date: '后来一个晚上'})],
  ]);
})();
