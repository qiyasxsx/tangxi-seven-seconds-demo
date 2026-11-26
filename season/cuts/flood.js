(() => {
  'use strict';
  const art = name => 'art/flood-cut-' + name + '.webp';
  const plate = name => ({bg: art(name)});
  const lin = name => ({...plate(name), view: '林雨所见'});
  // Only the floor and the submerged parts of the wall change. The lamp,
  // socket and steps keep their coordinates between the three exposures.
  const tide = name => ({
    ...plate('landing'),
    layers: [{src: art(name), motion: 'reveal'}]
  });
  const cellar = {near: null, far: null, zone: 'hall', view: '', moment: '', pan: 0};
  const alley = {zone: 'road', place: '后巷 · 格栅外'};
  const hall201 = {zone: 'room', place: '十二号 · 201 门厅'};
  const cuts = window.SeasonCuts ||= {};
  Object.assign(cuts, {
    'E06-S01': {...cellar, bg: 'art/high-window.webp', zone: 'road'},
    'E06-S01.night-bed': {...plate('deposit'), layout: 'offscreen'},
    'E06-S01.deposit': {...plate('deposit'), layout: 'offscreen'},
    'E06-S01.b02': {...plate('divider'), zone: 'hall', caption: [47, 15, 35]},
    'E06-S01.b03': {...plate('divider'), zone: 'hall', layout: 'offscreen'},
    'E06-S01.b04': {...plate('divider'), zone: 'hall', caption: [47, 15, 35]},
    'E06-S01.b05': plate('crop'),
    'E06-S01.b06': {...plate('deposit'), layout: 'offscreen'},
    'E06-S02': {...cellar, ...plate('azhe-stairs')},
    'E06-S02.b01': lin('aliang'),
    'E06-S02.b02': {...lin('aliang'), caption: [22, 22, 43]},
    'E06-S02.b03': {
      pages: [
        '林雨往前一步，陆地上的走道在她眼里变成水缸之间的缝。',
        '有人从玻璃后瞪着她，嘴张得很大，听不到。',
        '新租客只看见天花板在滴水，拖箱往有灯的缓台上走。'
      ]
    },
    'E06-S02.b03~0': lin('aliang'),
    'E06-S02.b03~1': lin('face'),
    'E06-S02.b03~2': {...plate('azhe-stairs'), cue: 'seep'},
    'E06-S02.b04': plate('torch'),
    'E06-S02.b04.o1.f1': {
      pages: ['那线随手电移动。', '新租客关掉手电，亮边消失，墙面仍有一条粗痕。']
    },
    'E06-S02.b04.o1.f1~0': plate('torch'),
    'E06-S02.b04.o1.f1~1': {...plate('mud'), cue: 'switch'},
    'E06-S02.b04.o2.f1': plate('mud'),
    'E06-S02.b05': {...lin('aliang'), caption: [24, 25, 40]},
    'E06-S02.b06': plate('azhe-stairs'),

    'E06-S03': {...cellar, ...plate('landing')},
    'E06-S03.b01': {
      pages: [
        '转租人怕人拿错货，从外侧把通向后巷的格栅扣上了。',
        '实际进水从雨棚底下反涌。',
        '阿岑在高处打电话叫人，老许上楼向业主取这扇格栅的备用钥匙。罗叔守在后巷。',
        '新租客还攥着押金条。'
      ]
    },
    'E06-S03.b01~1': {...tide('rise'), cue: 'seep'},
    'E06-S03.b01~2': plate('call'),
    'E06-S03.b01~3': plate('receipt'),
    'E06-S03.b02': {...plate('receipt'), caption: [53, 12, 28]},
    'E06-S03.b03': {...plate('receipt'), layout: 'offscreen'},
    'E06-S03.b04': {
      pages: [
        '隔着玻璃，林雨看见一间已经住熟的屋：墙上有被人修过两回的置物架，床脚压一片折成四层的旧年画，花被面上搭着男人新洗的袜子。',
        '水涌过插座的位置，那些东西一件件安静浮起来。',
        '阿哲一眼也没看见，却忽然弯腰避开了一只从高处掉下来的真实塑料盆。盆底用圆珠笔写着三个电话号码，末一行已经泡得晕开。'
      ]
    },
    'E06-S03.b04~0': lin('bed-wet'),
    'E06-S03.b04~1': {...tide('crest'), view: '林雨所见'},
    'E06-S03.b04~2': {...plate('basin'), cue: 'pot'},
    'E06-S03.b05': {
      pages: [
        '阿良在她身后越敲越急。玻璃里的每个人都伸手要求开门，连刚听过的妈妈声音也在里头。',
        '林雨转身，', '差点把手从活人的箱带上松开。'
      ]
    },
    'E06-S03.b05~0': lin('knock'),
    'E06-S03.b05~1': plate('grip'),
    'E06-S03.b05~2': plate('slip'),
    'E06-S03.b06': plate('slip'),
    'E06-S03.b06.o1.f1': {...plate('grip'), layout: 'offscreen'},
    'E06-S03.b06.o1.f2': plate('lift'),
    'E06-S03.b06.o1.name': {...plate('name'), caption: [6, 20, 32]},
    'E06-S03.b06.o2.f1': {...plate('call'), layout: 'offscreen'},
    'E06-S03.b06.o2.f2': {...plate('name'), caption: [6, 20, 32]},
    'E06-S03.b07': lin('aliang'),
    'E06-S03.b08': {
      pages: [
        '阿良用水桶在栏杆外壁磕出一声。他指了个方向。林雨看见几十只手隔水伸向开不到的一边。',
        '她让罗叔从现实的巷口确认。'
      ]
    },
    'E06-S03.b08~0': {...lin('knock'), cue: 'one-strike'},
    'E06-S03.b08~1': {...alley, ...plate('outer-lock')},

    'E06-S04': {...cellar, ...alley, ...plate('outer-lock')},
    'E06-S04.b01': {caption: [8, 16, 41]},
    'E06-S04.b02': {
      pages: [
        '阿岑在外头照明，', '老许把备用钥匙交给罗叔；', '格栅往外拉开。',
        '阿哲把自己的箱子留在高台，自己先出去，', '然后接住林雨。',
        '林雨两脚都踩上干砖，隔着栏杆往里望。阿良还在敲三号门那块玻璃。'
      ]
    },
    'E06-S04.b02~0': plate('light'),
    'E06-S04.b02~1': {...plate('key-pass'), cue: 'keys'},
    'E06-S04.b02~2': {...plate('unlock'), cue: 'latch'},
    'E06-S04.b02~3': plate('first-out'),
    'E06-S04.b02~4': plate('catch'),
    'E06-S04.b02~5': {...lin('aliang'), zone: 'road', place: '后巷 · 从格栅外望入'},
    'E06-S04.b03': {...lin('aliang'), zone: 'road', place: '后巷 · 从格栅外望入'},
    'E06-S04.b04': {...lin('aliang'), zone: 'road', place: '后巷 · 从格栅外望入', caption: [23, 23, 42]},
    'E06-S04.b05': {...lin('aliang'), zone: 'road', place: '后巷 · 从格栅外望入'},
    'E06-S04.b06': {
      pages: [
        '阿良把桶放下。', '水面平了一会儿。', '第五格的花被子湿了半边，凹下去的床沿慢慢弹了回来。',
        '林雨走上最后一级，阿岑把干毛巾扔来，刚好罩住她的脸。'
      ]
    },
    'E06-S04.b06~0': {...lin('bucket'), zone: 'road', place: '后巷 · 从格栅外望入'},
    'E06-S04.b06~1': {...plate('ebb'), zone: 'hall', place: '地下室 · 缓台', cue: 'drain'},
    'E06-S04.b06~2': {...lin('fifth-bed'), zone: 'hall', place: '地下室 · 第五格'},
    'E06-S04.b06~3': plate('towel'),
    'E06-S04.b07': {...plate('ebb'), far: 'sublessor', focus: 'right'},
    'E06-S04.b08': {...plate('save-slip'), layout: 'offscreen'},
    'E06-S04.b09': {
      pages: [
        '阿哲自己留存广告、押金条和当晚录到的通话，向有关人员反映这处仍在招租；',
        '罗叔愿提供自己亲见的锁位。', '老许陪他在201坐到同行来接。',
        '几天后转租人退还押金；旧案责任仍须另行查证。'
      ]
    },
    'E06-S04.b09~0': plate('save-slip'),
    'E06-S04.b09~1': {...plate('ebb'), far: 'luo'},
    'E06-S04.b09~2': {...hall201, ...plate('wait')},
    'E06-S04.b09~3': {...plate('refund'), place: '临时办事柜台', zone: 'room', date: '几天后'},
    'E06-S04.b10': {...hall201, bg: 'art/dry-table.webp', date: '几天后'},
    'E06-S04.b10.o1.f1': {...plate('save-slip'), date: '当晚 · 留存原件', layout: 'offscreen'},
    'E06-S04.b10.o2.f1': {...hall201, ...plate('sketch'), date: '留存记录', layout: 'offscreen'},
    'E06-S04.b12': {
      ...hall201,
      pages: [
        '阿哲在201拿插座给手机充电，拍了两瓶辣椒发给妈妈。照片只拍到一张干桌子。',
        '他说等真找到带灶的房再补另一张。老许让他先留一瓶，省得下次搬得沉。',
        '到月底，瓶子还在等主人来拿。'
      ]
    },
    'E06-S04.b12~0': plate('chili'),
    'E06-S04.b12~1': plate('chili'),
    'E06-S04.b12~2': {...plate('one-jar'), date: '月底'},
    'E06-S04.ownwords.1': {...hall201, ...plate('xu-review'), date: '追押金当晚'},
    'E06-S04.ownwords.2': {...hall201, ...plate('xu-review'), date: '追押金当晚', layout: 'offscreen'},
    'E06-S04.ownwords.3': {...hall201, ...plate('xu-review'), date: '追押金当晚', layout: 'offscreen'}
  });
})();
