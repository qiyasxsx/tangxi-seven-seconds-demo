// Rain stays on this side of the gutter until both feet clear the shop threshold.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const file = name => 'art/umbrella-cut-' + name + '.webp';
  const street = (bg, extra = {}) => ({bg, near:null, far:null, zone:'outside', view:'', moment:'', ...extra});
  const shot = (name, extra) => street(file(name), extra);
  const door = open => '../first-take/art/' + (open ? 'shop' : 'shopClosed') + '.webp';
  const wet = street(door(false), {place:'水沟外 · 雨棚尽头'});
  // Same exposure on both sides of the scene boundary. The body is on the
  // foreground pavement; the lamplit shop is across the lane on her right.
  const shelter = {...wet, view:'林雨所见', layers:[{
    src:'art/retake-umbrella-guide.webp', x:8, y:-7, w:43, h:119, motion:'breath'
  }]};
  const reach = shot('raise', {view:'林雨所见', place:'水沟外 · 铁牌'});
  const lit = street(door(true), {moment:'signal',place:'水沟外 · 望向侧门'});
  const qin = {...lit, far:'qinStanding', farFace:'brow'};
  const counter = {zone:'shop',place:'侧门内 · 檐下'};
  // Once Lin's heel clears the threshold, she answers the stall from safety;
  // Powder Uncle remains across the gutter and is not composited into the shop.
  const inside = {...lit, near:'linBackListen', far:'qinStanding', ...counter};
  // Door-side reverse: the stall is explicitly across the gutter, and the
  // plate is empty before Lin makes the crossing.  This bridges the call to
  // eat with the later interior stove shot without inventing a stall indoors.
  const plate = street('art/umbrella-cut-plate-r2.webp', {place:'水沟外 · 回看对面粉摊'});
  Object.assign(cuts, {
    'E01-S02': street('art/freezer.webp',{zone:'shop',place:'今宵便利 · 冰柜边'}),
    'E01-S02.reason': street('art/freezer.webp',{near:'linFrontListen',zone:'shop',place:'今宵便利 · 冰柜边'}),
    'E01-S02.b03':shot('reflection',{view:'林雨所见',place:'水沟外 · 站牌玻璃'}),
    'E01-S02.b04':shot('reflection',{view:'林雨所见',place:'水沟外 · 站牌玻璃',caption:[47,25,33]}),
    'E01-S02.b05':wet,
    'E01-S02.b06':wet,
    'E01-S02.b06~1':shelter,
    'E01-S03':shelter,
    'E01-S03.b01':{...shelter,caption:[53,21,33]},
    'E01-S03.b02':{...reach,cue:''},
    'E01-S03.b02~1':{...reach,cue:'iron-three',layers:[{src:file('strike'),motion:'knock'}]},
    'E01-S03.b02~2':lit,
    'E01-S03.b03':qin,
    'E01-S03.b03.o1.f1':{...qin,near:'linBackListen',caption:[34,17,29]},
    'E01-S03.b03.o1.f2':qin,
    'E01-S03.b03.o2.f1':shot('torch'),
    'E01-S03.b04':qin,
    'E01-S03.b05':plate,
    'E01-S03.b06':{...plate,caption:[42,14,30]},
    'E01-S03.threshold.1':shot('qin',{cue:''}),
    'E01-S03.threshold.1~1':shot('mop-r2',{cue:'door'}),
    'E01-S03.b07':plate,
    'E01-S03.b07~1':shot('step-r2',{cue:'threshold'}),
    'E01-S03.b07~2':shot('entry',counter),
    'E01-S03.b07~3':shot('withdraw',counter),
    'E01-S03.b08':{...inside,caption:[39,9,26]},
    'E01-S03.b09':{...inside,caption:[34,13,27]},
    'E01-S03.b10':street('art/umbrella-cut-ignition-r2.webp',{...counter,place:'门内望向对面的蓝棚'}),
    'E01-S03.b10~1':shot('towel',{...counter,view:'林雨所见'}),
  });
})();
