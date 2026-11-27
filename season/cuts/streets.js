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
    ['site',old('retake-umbrella-listen',{place:'粉摊 · 玻璃纸方桌',zone:'outside',pan:0})],
    ['b02 believe.1 believe.2 decision b03 b04',old('retake-umbrella-listen',{pan:0,caption:[41,12,19]})],
    ['thumb',draw('thumb',{cue:'freezer-lid'})],
    ['b07',draw('wipe-table')],
    ['b08 b09',old('rice-stall',{far:'cook'})],
    ['b10',old('rice-stall',{far:'qinStanding'})],
    ['b11',draw('supper')],
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
    ['site', old('chopsticks', {zone: 'outside', place: '夜宵粉摊 · 炉边'})],
    ['b02 b03', draw('offer-seat', {caption: [53, 16, 25]})],
    ['b04 b05', draw('long-shadows', subjective)],
    ['b06', old('chopsticks')],
  ]);
  direct('E04-S02', [
    ['site', old('shed-meal', {zone: 'outside', place: '工棚旧址'})],
    ['b03.o1.f1', draw('carbon', {layout: 'speech', caption: [58, 11, 33]})],
    ['b03.o2.f1', draw('mug-base', {caption: [61, 14, 33]})],
    ['b03.o2.f2', draw('trace-mug', {layout: 'speech', caption: [62, 15, 31]})],
    ['b03 b04', old('bridge-meal', {place: '桥底', zone: 'road'})],
    ['b05', draw('helmet', {place: '桥底', zone: 'road'})],
    ['b06 b07 b08', old('dock-meal', {place: '卸货门后'})],
    ['b09', draw('worker-meal', {place: '卸货门后'})],
  ]);
  direct('E04-S03', [
    ['site', draw('line', {...subjective, zone: 'outside', place: '粉摊 · 队尾'})],
    ['b01', draw('line', subjective)],
    ['b02 b03 b04', draw('line', subjective)],
    ['b05.o1.f1', draw('line', subjective)],
    ['b05.o1.f2', draw('earpiece')],
    ['b05.o2.f1', draw('aunt-calls')],
    ['b05.o2.f2', draw('take-id')],
    ['b06', draw('uncover')],
    ['b07 b08 b09', draw('second-bite')],
    ['b10 b11 b12', draw('double', subjective)],
    ['b13 b14 b15', draw('back-to-stool')],
  ]);
  direct('E04-S04', [
    ['site', draw('ledger', {zone: 'outside', place: '天亮的粉摊 · 寻人本'})],
    ['b03', draw('recognise-mug')],
    ['b06 b07 b08 b09', draw('scallions')],
    ['b10', {bg: '../first-take/art/hallLit.webp', near: null, far: null, view: '', zone: 'hall', place: '三巷十二号 · 续租'}],
    ['visit.1', draw('charger-visit', {zone: 'room', place: '三〇二 · 床边', date: '后来一个晚上'})],
  ]);
})();
