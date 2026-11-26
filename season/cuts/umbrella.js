// The street stays audible until Lin has crossed. Only her subjective shots contain the umbrella.
(() => {
  'use strict';
  const cuts = window.SeasonCuts ||= {};
  const file = name => 'art/umbrella-cut-' + name + '.webp';
  const shot = (bg, extra = {}) => ({bg: file(bg), near: null, far: null, view: '', zone: 'outside', moment: '', ...extra});
  const shelter = shot('shelter', {view: '林雨所见'});
  const handle = shot('raise', {view: '林雨所见'});
  const shop = {zone: 'shop'};

  Object.assign(cuts, {
    'E01-S02': {place: '今宵便利 · 冰柜边', zone: 'shop'},
    'E01-S02.b03': shot('reflection', {view: '林雨所见', place: '便利店外 · 站牌玻璃'}),
    'E01-S02.b04': shot('reflection', {view: '林雨所见', place: '便利店外 · 站牌玻璃', caption: [45, 36, 29]}),
    'E01-S02.b05': shot('watch', {place: '便利店外 · 侧门边', caption: [6, 27, 29]}),
    'E01-S02.b06': {...shelter, place: '便利店外 · 水沟这边'},
    'E01-S03': shelter,
    'E01-S03.b01': {...shelter, caption: [61, 38, 30]},
    'E01-S03.b02': {...handle, cue: '', pages: [
      '阿婆把伞柄贴到铁牌边。手腕上裹着蓝布，和昨晚扎头巾的布纹一模一样。',
      '三响。',
      '店里拖把杆倒在墙上，灯亮了。',
    ]},
    'E01-S03.b02~1': {...handle, cue: 'iron-three',
      layers: [{src: file('strike'), motion: 'knock'}]},
    'E01-S03.b02~2': shot('lamp'),
    'E01-S03.b03': shot('lamp'),
    'E01-S03.b03.o1.f1': shot('call', {caption: [45, 28, 24]}),
    'E01-S03.b03.o1.f2': shot('qin', {caption: [8, 31, 39]}),
    'E01-S03.b03.o2.f1': shot('torch'),
    'E01-S03.b04': shot('qin', {caption: [9, 31, 38]}),
    'E01-S03.b05': shot('plate'),
    'E01-S03.b06': shot('plate', {caption: [48, 27, 30]}),
    'E01-S03.threshold.1': shot('watching', {cue: '', pages: [
      '小茵在窄门里侧看见她，',
      '把门往外多推了一掌宽。',
    ]}),
    'E01-S03.threshold.1~1': shot('push', {
      cue: 'door',
      layers: [{src: file('leaf'), x: 676 / 836 * 100, y: 32 / 470 * 100,
        w: 68 / 836 * 100, h: 438 / 470 * 100, motion: 'hinge'}],
    }),
    'E01-S03.b07': shot('plate', {pages: [
      '林雨刚想说自己没点，抬头看见粉叔的手稳稳端着空碟。',
      '她跨过水沟。',
      '阿岑靠门站，让开一步，等她进去才跟进来。',
      '两家店都有人往外看，男人掉头离开。',
    ]}),
    'E01-S03.b07~1': shot('crossing', {layout: 'speech', caption: [8, 28, 25]}),
    'E01-S03.b07~2': shot('entry', shop),
    'E01-S03.b07~3': shot('withdraw', shop),
    'E01-S03.b08': shot('relief', {...shop, caption: [28, 16, 25]}),
    'E01-S03.b09': shot('relief', {...shop, caption: [27, 13, 25]}),
    'E01-S03.b10': shot('stove', {...shop, pages: [
      '他真开火。',
      '林雨拿了干毛巾追到檐下，伞尖刚才滴水的地方已经空了。',
    ]}),
    'E01-S03.b10~1': shot('towel'),
  });
})();
