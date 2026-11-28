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

  const field = (name, near, far, extra = {}) => ({
    bg: '../first-take/art/' + name + '.webp', near, far, view: '', ...extra,
  });
  direct('E00-S01', [['site',field('stop','linFrontListen',null,{zone:'road',place:'棠西村口 · 棚下'})]]);
  direct('E00-S02', [['site',field('stop','linFrontListen',null,{zone:'road',place:'棠西村口 · 缺角砖'})]]);
  direct('E00-S03', [['site',field('shop','linBackListen','qinStanding',{zone:'shop',place:'今宵便利 · 侧门'})]]);
  direct('E00-S04', [
    ['site',old('bus-stop',{near:'linFrontListen',zone:'road',place:'公交站 · 候车棚'})],
    ['b01',draw('hinge-pair')],
    ['b02 b02.o1.f1 b02.o2.f1',old('bus-stop',{near:'linFrontListen',zone:'road'})],
    ['b09',draw('bus-window',{zone:'room',place:'往城里的车上'})],
  ]);
  // Both sides of the conversation stay under the same awning.
  direct('E01-S01', [
    ['site',field('stop','linBackListen','xiaoyin',{zone:'outside',place:'三巷铁牌下'})],
  ]);
  direct('E01-S04', [
    ['site',field('shop','linBackListen','xiaoyin',{zone:'shop',place:'便利店窄门内'})],
    ['b03',plate('approaches/crossing.webp',{zone:'outside',place:'从窄门过水沟'})],
    ['b03~1 b04 b05',old('retake-umbrella-supper',{zone:'outside',place:'蓝棚下 · 粉摊'})],
    ['b06',draw('supper')],
    ['towel-grip',draw('towel')],
    ['b07 believe.1 believe.2 decision',old('retake-umbrella-listen')],
    ['thumb',draw('thumb',{cue:'freezer-lid'})],
    ['b08 b09 b10 b11',draw('thumb')],
    ['b12',draw('wipe-table')],
    ['b13 b14',old('retake-umbrella-supper')],
    ['across-gutter b15',old('umbrella-cut-qin',{place:'隔着水沟 · 窄门'})],
    ['b16',draw('supper')],
  ]);
  direct('E01-S05', [
    ['site',old('freezer',{zone:'shop',place:'今宵便利 · 蒸柜'})],
    ['b01 b02',draw('four-fingers',subjective)],
    ['b03',draw('catch-bag')],
    ['b03~1',draw('wet-receipt',{caption:[7,24,30]})],
    ['b04',field('shop','linBackListen','qinStanding')],
    ['b05 b06 b07',old('zheng-front',{near:'linFrontListen',zone:'road',date:'3月21日至27日',place:'郑家楼外'})],
    ['supper.1',old('rice-stall',{near:'linBackListen',far:'xiaoyin',zone:'outside',date:'其间一个晚上',place:'粉摊'})],
    ['b08',field('hallLit','linBackListen','xuStanding',{zone:'hall',place:'三巷十二号',date:'3月27日'})],
    ['b09 b10 b11',draw('lift-bed',{zone:'room',date:'3月27日',place:'三〇二 · 临街房间'})],
    ['b12',old('dining-reflection',{...subjective,zone:'room',date:'3月27日',place:'三〇二 · 柜脚'})],
    ['b12~1',field('room',null,null,{view:'阿岑所见',zone:'room',date:'3月27日',place:'三〇二 · 柜脚'})],
  ]);

  direct('E04-S01', [
    ['site',old('rice-stall',{zone:'outside',place:'蓝棚底下 · 粉摊'})],
    ['b02',old('chopsticks')],
    ['return-seat',draw('offer-seat')],
    ['b05',old('rice-stall')],
    ['b09 b10 b11 b12',old('chopsticks')],
    ['b13',draw('long-shadows',subjective)],
    ['b14',old('rice-stall',{near:'linBackListen',far:'cook'})],
    ['b15',draw('long-shadows',subjective)],
  ]);
  direct('E04-S02', [
    ['site',old('shed-meal',{zone:'outside',place:'工棚旧址'})],
    ['b03.o1.f1',draw('carbon')],
    ['b03.o2.f1',draw('mug-base')],
    ['b03.o2.f2',draw('trace-mug')],
    ['b04',plate('approaches/work-shed.webp')],
    ['under-bridge',plate('approaches/underpass.webp',{place:'从工棚走向桥底',zone:'road'})],
    ['b05 b06 b07 b08',draw('helmet',{place:'桥底',zone:'road'})],
    ['b09',old('bridge-meal',{place:'桥底栏杆边',zone:'road'})],
    ['dock-turn',old('revisit-cut-dock',{place:'桥另一头 · 卸货门',zone:'outside'})],
    ['b10 b11 b12',old('dock-meal',{place:'卸货门背后',zone:'outside'})],
    ['b13 b14',draw('worker-meal',{place:'卸货门背后',zone:'outside'})],
    ['b15',plate('approaches/crossing.webp',{place:'回到三巷 · 蓝棚外',zone:'outside'})],
  ]);
  direct('E04-S03', [
    ['site',draw('line',{...subjective,zone:'outside',place:'粉摊 · 队尾'})],
    ['b05.o1.f1',draw('line',subjective)],
    ['b05.o1.f2',plate('art/streets-cut-earpiece-r2.webp')],
    ['b05.o2.f1',draw('aunt-calls')],
    ['b05.o2.f2',draw('take-id')],
    ['b06',old('chopsticks')],
    ['b07 b08 b09 b10 sit-five',old('rice-stall',{near:'linBackListen',far:'xiaoyin'})],
    ['b11 b12',draw('double',subjective)],
    ['b13',draw('double',subjective)],
    ['b14 b15',draw('back-to-stool')],
    ['b16',draw('second-bite')],
  ]);
  direct('E04-S04', [
    ['site',draw('ledger',{zone:'outside',place:'天亮的粉摊 · 寻人本'})],
    ['b03 b04',draw('carbon')],
    ['b05 b06',draw('recognise-mug')],
    ['b08 b09 b10 b11 b12',old('morning-ledger')],
    ['visit.1 b13 b14 b15 b16 b17 heard-enough b18 b19 b20 b21',draw('charge-r2',{zone:'room',place:'三〇二 · 床边',date:'傍晚'})],
    ['b22 b23 b24 b25',field('building','linBackListen',null,{zone:'outside',place:'十二号楼下',date:'当晚'})],
  ]);

})();
