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
  gate('b01 b02 b03', '@four-buns');
  gate('b04 b05 b06 b07 b08 b09 b11 b12 b13 b14 b15', 'gate');
  gate('b10', 'stair-light', {cue:'switch'});
  gate('b16', '@zheng-stairs', {zone:'hall'});

  const supper = scene('E02-S02', '@zheng-stairs', 'hall');
  supper('b01 b02 b03 b04.o1.f1', '@zheng-stairs');
  supper('b04.o2.f1', 'rail');
  supper('b05 b06 b07 b08 b09 b10', 'father-table', {...vision, zone: 'room'});
  supper('b11 b12 b13 b14', 'daughter-door', {...vision, zone: 'room'});
  supper('b15', '@zheng-stairs', {zone:'hall'});

  const shop = scene('E02-S03', 'earbud', 'hall');
  shop('b01 b02', 'earbud');
  shop('b03 b04 b05 b06', '@hardware-shop', {near: 'linBackListen', far: 'guoqiang', pan: 0, zone: 'room'});
  shop('b07 b08 b09 b10.o1.f1 b10.o1.f2', 'red-key', {zone: 'room'});
  shop('b10.o2.f1 b10.o2.f2 b11 b12', '@zheng-lock', {zone: 'hall'});

  const lock = scene('E02-S04', '@zheng-lock', 'hall');
  lock('b01 b02 b03', 'footprints', vision);
  lock('b04', 'ledger-gap', {cue:'paper'});
  lock('b05.o1.f1 b05.o1.f2 b05.o2.f1', 'hasp');
  lock('b06 b07', 'hinge-photo');
  // Father, absent seat, and the wet-haired daughter share one room state.
  // Do not turn Lin into the daughter by placing her across the table.
  lock('b08 b09 b10 b11 b12', null, {bg:'art/neighbors-cut-father-daughter-r2.webp', ...vision, zone: 'room'});
  lock('b13 b14', 'confession', vision);
  // The key has not fallen until b20.  Keep the real hallway and confession
  // consequences visible; reserve the audible impact for its own beat.
  lock('b15 b16 b17 b18 b19', '@zheng-lock', {...vision, zone:'hall'});
  lock('b20', 'drop-key', {...vision, cue:'keys'});

  const after = scene('E02-S05', 'witness', 'hall');
  after('b01 keeper b02 return-binder', 'witness');
  after('b03 b04 b05', 'paper-bag', {date: '几天后', place: '郑家 · 核对材料', zone: 'room'});
  after('b06 b07 b08 b09 b10 b11', 'soup', {...vision, zone: 'room'});
  after('b12 b13 b14 b15', 'call', {zone:'room', place:'302'});

  const first = scene('E03-S01', '@cafe-stairs', 'hall');
  first('b01 b02 b03 b04 b05 b06', '@cafe-stairs');
  first('b07 b08 b09 b10 b11 b12 b13 b14 wait-for', 'chair-kick', {...vision, zone: 'cafe'});
  first('b15', '@cafe-stairs', {zone:'hall'});

  const ten = scene('E03-S02', 'open-book', 'room');
  ten('b01 b02 b03 b04', 'open-book', vision);
  ten('b05.o1.f1 b05.o1.f2 b05.o1.f3', 'door-knock', vision);
  ten('b05.o2.f1 b05.o2.f2 b05.o2.f3 b06 b07', 'finger-gap', vision);
  ten('b08 b09 b10', 'cold-tea', {zone:'cafe'});

  const tape = scene('E03-S03', 'register', 'cafe');
  tape('b01', 'register', {cue:'paper'});
  tape('b02 b03 b04 b05 b06 b07 b08 b09 b10', 'repair-stitches', {zone:'room'});
  tape('b11.o1.f1 b11.o2.f1 b12 b13 b14 b15 b16 b17', 'interview', recording);
  tape('b18 b19', 'timecode', {zone: 'room'});

  const team = scene('E03-S04', 'ice-bag', 'room');
  team('b01 b02 b03 b04 b05 b06 b07 b08 b09 b10', 'ice-bag');
  team('b11 b12 b13 b14', 'rider-turn');

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
  shoes('b04', 'customer-sits', vision);

  const hems = scene('E07-S03', 'chalk', 'room');
  hems('b01 b02', 'chalk');
  hems('b03 b04 b05 b06', 'collar-tags', vision);
  hems('b06.o1.f1', 'undo-tag', vision);
  hems('b06.o2.f1', 'bus-pocket', vision);
  hems('b07', 'withdraw');
  hems('phone-down b08 b09', 'comes-back');

  const keys = scene('E07-S04', 'close-drawer', 'room');
  keys('b01 b02 b03', 'close-drawer');
  keys('b02 b03', '@key-counter', {near:'linBackListen', far:'luo', actors:true, view:'', pan:0});
  keys('b04', 'three-lockers');
  keys('b05', 'one-cabinet-each');
  keys('b05.o1.f1', 'hours-only');
  keys('b05.o2.f1', 'one-cabinet-each');
  keys('b06 b07', 'key-blank');
  keys('b07.o1.f1 b07.o1.f2', 'take-blank');
  keys('b07.o2.f1 b07.o2.f2', 'return-blank');
  keys('b08', 'private-mail', {place:'钥匙档 · 团队核对'});

  const desk = scene('E07-S05', 'stall-talk', 'room');
  desk('b01 b02 b03 b04', 'stall-talk');
  desk('ask-note note', 'two-cuts');
  desk('note.o1.f1', 'sign-date');
  desk('note.o2.f1', 'shut-folder');
  desk('audience.1', 'aim-hinge');
  desk('b05', 'empty-stool', {date:'6月底 · 夜', place:'302'});
  desk('right-to-cut answer-her', 'aim-hinge');
})();
