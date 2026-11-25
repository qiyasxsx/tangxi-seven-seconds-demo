// Each cue is a substring of a performed line. Walking back through the lines
// actually seen also restores the camera after a save or a branching reply.
(() => {
  'use strict';
  const image = name => name.startsWith('@')
    ? '../first-take/art/' + name.slice(1) + '.webp'
    : 'art/' + name + '.webp';
  const shot = (match, name, actors = true) => ({match, bg: image(name), actors});
  const scene = (name, exit, shots = [], actors = true) => ({
    bg: image(name), exit, shots, actors,
  });

  const art = {
    'E00-S01': scene('editing-lunch', [64, 46], [
      shot('女孩喊了一声', '@clipBefore', false),
      shot('相同的七秒', '@clipBefore', false),
      shot('这是我写的', 'editing-lunch'),
    ]),
    'E00-S02': scene('factory-arch', [71, 55], [
      shot('整块灯牌都在头顶', '@shop', false),
      {match: '卷闸在左', bg: 'props/alley-empty.webp', actors: false},
      shot('她掀开雨棚', '@shop'),
    ]),
    'E00-S03': scene('@shop', [82, 54], [
      shot('推开雨棚下的一扇窄门', '@side', false),
      shot('只拍门，手我自己的', '@shop'),
    ]),
    'E00-S04': scene('bus-stop', [75, 54], [
      shot('两人挤上末班前的一趟车', 'night-bus', false),
    ]),
    'E01-S01': scene('factory-arch', [75, 56], [
      shot('横过街，推侧门', '@shop'),
      shot('粉摊旁又折回来', 'rice-stall'),
    ]),
    'E01-S02': scene('freezer', [75, 53], [
      shot('林雨往站牌走', 'bus-stop'),
      shot('一把旧红伞已经撑在她身旁', 'umbrella-shelter', false),
    ]),
    'E01-S03': scene('umbrella-shelter', [66, 48], [
      shot('阿婆把伞柄贴到铁牌边', 'umbrella-strike', false),
      shot('后面那位', '@shop'),
      shot('托起一只空碟', 'empty-plate', false),
      shot('才跟进来', 'freezer'),
      shot('干毛巾追到檐下', '@stop', false),
    ], false),
    'E01-S04': scene('rice-stall', [62, 56], [
      shot('粉叔的方桌湿了', 'empty-plate', false),
      shot('腿短的朝墙摆', 'rice-stall'),
    ]),
    'E01-S05': scene('freezer', [65, 50], [
      shot('收银机结完矿泉水的钱', 'empty-bag', false),
      shot('按约带两人走到楼口', 'zheng-front'),
      shot('一个人住，每月九百', '@hallLit'),
      shot('先摸摸床腿', '@room'),
      shot('旧电视，插头卷在柜脚', 'dining-reflection', false),
    ]),
    'E02-S01': scene('zheng-front', [50, 63], [
      shot('四个叉烧包', 'four-buns', false),
      shot('郑国强从隔壁门店过来', 'zheng-front'),
      shot('楼道里一下有了热包的香味', 'zheng-stairs'),
    ]),
    'E02-S02': scene('zheng-stairs', [56, 57], [
      shot('用手背碰碰汤碗', 'zheng-dining'),
    ]),
    'E02-S03': scene('zheng-stairs', [63, 55], [
      shot('阿岑把纸袋递还', 'zheng-front'),
      shot('从写字台下取出旧工具袋', 'hardware-shop', false),
    ]),
    'E02-S04': scene('zheng-dining', [78, 51], [
      shot('国强亲手开外门', 'zheng-lock', false),
      shot('空椅往后响', 'zheng-dining'),
      shot('国强跪在门槛外', 'zheng-lock'),
      shot('落在水泥上', 'zheng-lock', false),
    ]),
    'E02-S05': scene('zheng-front', [48, 58], [
      shot('饭厅短暂亮起来', 'zheng-dining'),
      shot('门从里面合上', 'zheng-front'),
      shot('302电视里', '@playback', false),
    ]),
    'E03-S01': scene('cafe-stairs', [38, 50], [
      shot('主机插头', 'terminal-17'),
    ]),
    'E03-S02': scene('homework', [67, 53], [
      shot('阿岑从门外敲三声', 'terminal-17'),
    ]),
    'E03-S03': scene('cobbler', [54, 58], [
      shot('最后一次结账', 'cafe-register', false),
      shot('陈姐当面放出原带', 'terminal-17'),
    ]),
    'E03-S04': scene('teashop', [84, 55], [
      shot('他往里走', 'cafe-stairs'),
    ]),
    'E03-S05': scene('five-chairs', [48, 55], [
      shot('把对话框缩小', 'five-chairs', false),
    ]),
    'E04-S01': scene('chopsticks', [64, 52], [
      shot('摊前忽然排了十几个人', 'last-in-line', false),
      shot('接的单子都是以前手写的', 'chopsticks'),
    ]),
    'E04-S02': scene('shed-meal', [67, 56], [
      shot('我在桥底歇脚', 'bridge-meal', false),
      shot('女孩坐在卸货门背后', 'dock-meal', false),
    ], false),
    'E04-S03': scene('last-in-line', [58, 53], [
      shot('压住的两根筷子', 'chopsticks'),
      shot('队伍退回棚边', 'queue-double', false),
      shot('从摊外回到矮凳', 'chopsticks'),
    ], false),
    'E04-S04': scene('morning-ledger', [55, 55], [
      shot('去老许处续租', '@hallLit'),
    ]),
    'E05-S01': scene('rental-desk', [61, 52], [
      shot('林雨去楼顶收衣', 'wet-workwear'),
    ]),
    'E05-S02': scene('wet-workwear', [68, 49], [
      shot('四个不同的收件人', 'delivery-windows', false),
    ]),
    'E05-S03': scene('delivery-windows', [72, 49], [
      shot('镜头回现实', 'wet-workwear', false),
    ], false),
    'E05-S04': scene('wet-workwear', [22, 50], [
      shot('老许抱着落下来的一床被单', 'wet-workwear'),
    ]),
    'E05-S05': scene('morning-meal', [66, 54]),
    'E06-S01': scene('high-window', [52, 54]),
    'E06-S02': scene('cellar-glass', [56, 48], [
      shot('拖箱往有灯的缓台上走', 'flood-landing'),
    ]),
    'E06-S03': scene('flood-landing', [63, 50], [
      shot('隔着玻璃，林雨看见', 'cellar-glass', false),
      shot('阿良在她身后越敲越急', 'cellar-glass'),
      shot('她让罗叔从现实的巷口确认', 'flood-landing'),
    ]),
    'E06-S04': scene('flood-landing', [73, 52], [
      shot('格栅往外拉开', 'gate-open', false),
      shot('阿良把桶放下', 'cellar-glass', false),
      shot('在201坐到同行来接', '@hallLit'),
      shot('拿插座给手机充电', 'dry-table', false),
    ]),
    'E07-S01': scene('old-shops', [53, 51]),
    'E07-S02': scene('cobbler', [62, 57], [
      shot('街短了', 'old-shops'),
    ]),
    'E07-S03': scene('tailor', [58, 53]),
    'E07-S04': scene('key-counter', [57, 55], [
      shot('拣出一片光滑的坯', 'key-counter', false),
    ]),
    'E07-S05': scene('rice-stall', [61, 52], [
      shot('那夜302的旧电视', '@playback', false),
    ]),
    'E08-S01': scene('outdoor-set', [56, 53]),
    'E08-S02': scene('audience', [65, 54], [
      shot('第一次牌响', 'witness-visitors', false),
    ]),
    'E08-S03': scene('outdoor-set', [57, 54], [
      shot('拿出合同', 'channel-control'),
    ]),
    'E08-S04': scene('witness-table', [50, 53], [
      shot('镜头转向桌上空格', 'witness-table', false),
      shot('第二声牌响', 'audience', false),
    ]),
    'E08-S05': scene('after-show', [69, 56], [
      shot('老许上楼问302还续不续', '@room'),
    ]),
    'E08-S06': scene('bus-leaving', [52, 52], [
      shot('有人敲三下车窗', 'bus-leaving', false),
    ]),
    'E08-S07': scene('archive-lamp', [56, 53], [
      shot('那盏灯还给一个正在写字的人', 'archive-lamp', false),
    ]),
    'E08-S08': scene('new-kitchen', [56, 53], [
      shot('阿琴叫儿子帮忙挡了两回', '@shop'),
      shot('林雨坐地上打开更正框', 'new-kitchen'),
      shot('微波炉叮了一下', 'microwave', false),
    ]),
  };

  window.SEASON_ART = art;
  window.TX_SEASON_ART = art;
})();
