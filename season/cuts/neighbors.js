// Zheng house, the Starfire interviews and the three neighbouring counters.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const vision = {view: '林雨所见'};
  const recording = {view: '旧采访回放'};
  const src = name => name.startsWith('@') ? 'art/' + name.slice(1) + '.webp' : 'art/neighbors-cut-' + name + '.webp';
  function scene(id, name, zone) {
    cuts[id] = {bg: src(name), zone, near: null, far: null, pan: 0, view: ''};
    return (keys, name, details = {}) => {
      const changes = name ? {bg: src(name), ...details} : details;
      for (const key of keys.split(' ')) cuts[id + '.' + key] = changes;
    };
  }

  const gate = scene('E02-S01', 'gate', 'road');
  gate('b01 b02 b03 b04', '@four-buns');
  gate('b05 b07 b08', 'gate');
  gate('b06', 'stair-light', {cue:'switch'});
  gate('b09', 'stair-light');

  const supper = scene('E02-S02', '@zheng-stairs', 'hall');
  supper('b01 b01.o1.f1', '@zheng-stairs');
  supper('b01.o2.f1', 'rail');
  supper('b02 b04 b05 b06', 'father-table', {...vision, zone: 'room'});
  supper('b03', 'reflected-stool', {...vision, zone: 'room'});
  supper('b03~1', 'bare-floor', {zone:'room'});
  supper('b07 b08', 'daughter-door', {...vision, zone: 'room'});

  const shop = scene('E02-S03', 'earbud', 'hall');
  shop('b01 b02', 'earbud');
  shop('b03 b04 b05', '@hardware-shop', {near: 'linBackListen', far: 'guoqiang', pan: 0, zone: 'room'});
  shop('b06 b07 b08', 'red-key', {zone: 'room'});
  shop('b08.o1.f1', '@zheng-lock', {zone: 'hall'});
  shop('b08.o2.f1', 'earbud');

  const lock = scene('E02-S04', '@zheng-lock', 'hall');
  lock('b01', null, {pages: [
    '国强走到父亲旧屋才停下。两双湿脚印穿过他的脚尖，他往后缩，小梅站到了那把红柄钥匙旁。',
    '林雨问他愿不愿等民警一起来查。国强点头。',
    '接到林雨关于失踪老人房间的线索后，辖区民警到场查看，国强亲手开外门。阿岑待在门外，把时间和位置记在手机上。'
  ]});
  lock('b01~0 b01~1', 'footprints', vision);
  lock('b01~2', 'open-door', {cue:'latch'});
  lock('b02 b03 b03.o1.f1 b03.o1.f2', 'hasp');
  lock('b03.o2.f1', 'ledger-gap', {cue:'paper'});
  lock('b04', 'hinge-photo');
  lock('b05', 'rail');
  lock('b06', 'overturned-bowl', {...vision, zone: 'room'});
  lock('b07 b08 b09 b10', 'father-daughter', {...vision, zone: 'room'});
  lock('b11 b12', 'confession', vision);
  lock('b13', 'drop-key', {...vision, cue:'keys'});
  lock('b14', 'confession', vision);

  const after = scene('E02-S05', 'witness', 'hall');
  after('b01', null, {pages: [
    '民警在过道记下国强的自述。',
    '隔了几天，家属拿来收件回执和初检摘录。上面写着棉絮、鼠药诱饵碎屑。',
    '林雨把装过包子的纸袋折了两折，才往下读。她亲眼见过的是门外的锁。人究竟怎么死的，还在查。'
  ]});
  after('b01~0', 'witness');
  after('b01~1 b01~2', 'paper-bag', {date: '几天后', place: '郑家 · 核对材料', zone: 'room'});
  after('keeper', 'binder', {date: '几天后', place: '郑家 · 核对材料', zone: 'room'});
  after('return-binder', 'separate-note', {date: '几天后', place: '郑家 · 核对材料', zone: 'room'});
  after('b03', 'offer-buns', {pages:[
    '林雨在门口搁下四个新包。饭厅短暂亮起来。',
    '桌子变回一张挤手的小方桌，小梅揪走大哥包子尖上的面皮，伸手去接父亲端不动的汤。她仍没看大哥。'
  ]});
  after('b03~1 b04 b05 b06', 'soup', {...vision, zone: 'room'});
  after('b07', 'son-alone');
  after('b08', null, {zone:'room', place:'302', pages:[
    '阿岑给《夜访》的工作伙伴沈嘉打电话。她正替一家旧栏目做授权清点，听说他们在棠西，想起一段拍在星火网吧的旧采访。',
    '她把已公开的节目名发过来，让他们自己去问原采访者。',
    '302电视里，有只鼠标一下一下地撞桌沿。'
  ]});
  after('b08~0 b08~1', 'call');
  after('b08~2', 'tv-mouse');

  const first = scene('E03-S01', '@cafe-stairs', 'hall');
  first('b01', '@cafe-stairs');
  first('b02', '@cafe-stairs', {near: 'linBackListen', far: 'laodeng'});
  first('b03', 'dusty-plug', {zone:'cafe', pages:[
    '阿岑摸到主机插头，插脚上积了灰。',
    '林雨眼前的显示器亮起来。一个穿大西服的男孩先踢了踢隔壁椅子。'
  ]});
  first('b03~1 b04 b05 b06 b08 wait-for', 'chair-kick', {...vision, zone: 'cafe'});
  first('b07', 'catch-chair', {zone:'cafe', cue:'cafe-chair'});

  const ten = scene('E03-S02', 'open-book', 'room');
  ten('b01 b02', 'open-book', vision);
  ten('b03', 'open-book', vision);
  ten('b03.o1.f1 b03.o1.f2', 'door-knock', vision);
  ten('b03.o2.f1 b03.o2.f2', 'finger-gap', vision);
  ten('b04 b05', 'finger-gap', vision);
  ten('b06', 'shut-book', {zone:'cafe', pages:[
    '阿岑从门外敲三声，林雨回敲。电脑房还在，男孩已经听不见。',
    '老邓端着半杯凉茶，问她真要去找几个已经上班的孩子？'
  ]});
  ten('b06~1', 'cold-tea');

  const tape = scene('E03-S03', 'register', 'cafe');
  tape('b01', 'register', {cue:'paper'});
  tape('b02 b03 b04 b05', 'repair-stitches', {zone:'room'});
  tape('b06 b06.o1.f1', 'interview', recording);
  tape('b06.o2.f1', 'seam-mark', recording);
  tape('b07', 'interview', {...recording, pages:[
    '陈姐当面放出原带。父亲把儿子的衣领扣到最上一粒。',
    '采访结束，画面先黑下去，麦还在录。'
  ]});
  tape('b07~1', 'black-tape', {view:'旧带录音'});
  tape('b08 b10', 'timecode', {zone: 'room'});
  tape('b09', 'black-tape', {zone: 'room', view:'旧带录音'});

  const team = scene('E03-S04', 'ice-bag', 'room');
  team('b01 b02 b03 b06', 'ice-bag');
  team('b04', 'table-tap');
  team('b05', 'rider-turn');
  team('b07', 'offline-drive', {cue:'cafe-drive'});
  team('b08', 'offline-drive');
  team('b09 b10', 'visor');

  const stalls = scene('E07-S01', 'three-shops', 'road');
  stalls('b01 b02 tuesday.1 tuesday.2', 'three-shops');
  stalls('b03 b04', 'wrong-shoe');
  stalls('b05 b06', 'ask-address');
  stalls('b07', 'one-cabinet-each');

  const shoes = scene('E07-S02', '@cobbler', 'room');
  shoes('b01', 'ghost-walk', vision);
  shoes('b02 b03', '@cobbler');
  shoes('b03.o1.f1', 'insole', vision);
  shoes('b03.o2.f1', 'bag-43', vision);
  shoes('b04', '@cobbler', {far:'chenbo'});
  shoes('b05', 'customer-sits', {...vision, pages:[
    '那人坐下时，街短了。',
    '真正等取鞋的骑手在柜台边试穿，老板没和他说那些旧事。阿岑替陈伯把茶桌边歪的一只脚重新垫平。'
  ]});
  shoes('b05~1', 'rider-fit', {view:''});

  const hems = scene('E07-S03', 'chalk', 'room');
  hems('b01 b02', 'chalk');
  hems('b03 b04 b05 b06', 'collar-tags', vision);
  hems('b06.o1.f1', 'undo-tag', vision);
  hems('b06.o2.f1', 'bus-pocket', vision);
  hems('b07', null, {pages:[
    '姑娘同意林雨用“旧牛仔裤改短”的局部照示范原边手艺。',
    '走了三步，她又回来。母亲也穿过这条裤子，会认得她缝上去的补花。她改了主意。',
    '林雨当面删除局部照，在节目索引写“取回”，把她签过名字那页还给本人。'
  ]});
  hems('b07~0', 'hem-consent');
  hems('b07~1', 'comes-back');
  hems('b07~2', 'withdraw');
  hems('phone-down b08 b09', 'comes-back');

  const keys = scene('E07-S04', 'close-drawer', 'room');
  keys('b01 b02 b03', 'close-drawer');
  keys('b04 b06 b06.o1.f1', 'three-lockers');
  keys('b05', 'one-cabinet-each');
  keys('b06.o2.f1', 'hours-only');
  keys('b07 b08', 'key-blank');
  keys('b08.o1.f1 b08.o1.f2', 'take-blank');
  keys('b08.o2.f1 b08.o2.f2', 'return-blank');
  keys('b09', 'private-mail', {place:'钥匙档 · 团队核对'});

  const desk = scene('E07-S05', 'stall-talk', 'room');
  desk('b01 b02 b03 b04', 'stall-talk');
  desk('ask-note note', 'two-cuts');
  desk('note.o1.f1', 'sign-date');
  desk('note.o2.f1', 'shut-folder');
  desk('audience.1', 'aim-hinge');
  desk('b05', null, {pages:[
    '周铭给了7月18日晚的栏目档期，到点才见得到首页推介。',
    '林雨当面和小茵约好，无论签不签合作，借自己账号在那晚把开门声给当初那些观众听全。',
    '6月底，林雨把302再续到7月27日。',
    '她把授权到哪一秒、谁要求取回、哪些只能核对逐项排上剪辑时间线。',
    '那夜302的旧电视没有人像，只映出一张空凳。她把桌上的水杯往里挪了一寸。'
  ]});
  desk('b05~0', 'stall-talk');
  desk('b05~1', 'aim-hinge');
  desk('b05~2', 'july', {date:'6月底', place:'302'});
  desk('b05~3', 'permissions', {date:'6月底', place:'302 · 剪辑桌'});
  desk('b05~4', 'empty-stool', {date:'6月底 · 夜', place:'302'});
  desk('right-to-cut answer-her', 'aim-hinge');
})();
