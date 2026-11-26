(() => {
  'use strict';
  const plate = name => 'art/cafe-cut-' + name + '.webp';
  // The seat legs, backrest and lap stay registered while his shoulders rise.
  const seat = {
    src: plate('seat'), x: 38.8756, y: 31.8810, w: 19.0191, h: 58.8735,
    motion: 'still'
  };
  const liang = {
    src: plate('liang'), x: 43.3612, y: 32.7311, w: 13.2775, h: 27.2051,
    motion: 'breath'
  };
  const witness = {layers: [seat, liang], view: '林雨所见'};
  const friends = {bg: plate('four-friends')};
  const cuts = window.SeasonCuts ||= {};
  Object.assign(cuts, {
    'E03-S05': {bg: plate('seated'), near: null, far: null, view: '', zone: 'cafe', pan: 0},
    'E03-S05.b01': {cue: 'cafe-drive'},
    'E03-S05.b02': {...witness, caption: [46, 12, 32]},
    'E03-S05.b03': {...witness, caption: [58, 12, 38]},
    'E03-S05.b04': {...witness, caption: [45, 14, 32]},
    'E03-S05.b05': witness,
    'E03-S05.b05.o1.f1': {...witness, caption: [8, 14, 36]},
    'E03-S05.b05.o1.f2': {
      pages: ['过弯摸出四枚硬币，压在键盘角。', '屏幕上第五个头像总算亮了。']
    },
    'E03-S05.b05.o1.f2~0': {bg: plate('coins'), cue: 'cafe-coin'},
    'E03-S05.b05.o1.f2~1': {bg: plate('fifth-avatar')},
    'E03-S05.b05.o2.f1': {
      pages: ['第五只鼠标响了四下。', '过弯试探着把三块五数到四块，鼠标停了。', '胖虎扭过脸，笑得鼻音很重。']
    },
    'E03-S05.b05.o2.f1~0': {bg: plate('mouse'), cue: 'cafe-mouse-four'},
    'E03-S05.b05.o2.f1~1': {bg: plate('coins'), cue: 'cafe-coin'},
    'E03-S05.b05.o2.f1~2': friends,
    'E03-S05.b06': {...friends, ...witness, caption: [43, 11, 37]},
    'E03-S05.b07': {bg: plate('card'), view: '林雨所见', layout: 'offscreen'},
    'E03-S05.b08': {
      view: '林雨所见',
      pages: [
        '一局打完，计分没谁顾上看。梁安把卡往柜台推。',
        '林雨忽然想起陈姐说过那件洗干净的西装，问他想穿哪件回去。梁安把大外衣一脱，里面是件领口褪白的旧球衣。',
        '他拿外套盖在椅背上，好像明天还会回来拿。',
        '他起身时把那把好椅让给了阿岑。',
        '阿岑继续拧松的那条腿，手忽然顿了一下。'
      ]
    },
    'E03-S05.b08~0': {bg: plate('return-card')},
    'E03-S05.b08~1': {bg: plate('lift')},
    'E03-S05.b08~2': {bg: plate('drape')},
    'E03-S05.b08~3': {bg: plate('offer-chair'), cue: 'cafe-chair'},
    'E03-S05.b08~4': {bg: plate('cen'), view: ''},
    'E03-S05.b09': {
      view: '林雨所见',
      pages: [
        '林雨最后才问起那几行骂人的字。屏上还留了一行“都怪你”。',
        '胖虎说他后来骂过自己，半糖说那天也怨过胖虎。没人见过谁敲进这四个字。',
        '梁安把对话框缩小，频道里响起一次很普通的组队邀请，没再把谁关在门外。'
      ]
    },
    'E03-S05.b09~0': {bg: plate('chat')},
    'E03-S05.b09~1': {bg: plate('chat')},
    'E03-S05.b09~2': {bg: plate('invitation')},
    'E03-S05.friends.1': {
      pages: [
        '阿岑把拍完的一局给他们四个看。画面里，四个人朝一把空椅子笑。',
        '半糖把这段拷进木头带来的旧盘，留给几个朋友。'
      ]
    },
    'E03-S05.friends.1~0': {...friends, layers: [], view: '机内回放'},
    'E03-S05.friends.1~1': {bg: plate('private-copy'), cue: 'cafe-drive'},
    'E03-S05.b10': {bg: 'art/cafe-register.webp', near: 'linBackListen', far: 'laodeng', focus: 'right'},
  });
})();
