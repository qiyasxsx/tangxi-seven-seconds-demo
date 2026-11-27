// These are the locations a visitor can look at again after the conversation.
// Each plate was checked without the actor layers, including mirrors and screens.
(() => {
  'use strict';
  const place = (name, zone, label, note) => ({
    bg: (name.startsWith('@') ? '../first-take/art/' + name.slice(1) : 'art/' + name) + '.webp',
    zone, place: label, ...(note ? {note} : {}),
  });
  window.SeasonRevisits = {
    'E00-S01': place('@stop', 'road', '旧厂牌楼 · 村口', '从缺角砖抬头，棚沿还挡着便利店的窄门。'),
    'E00-S02': place('@stop', 'road', '牌楼 · 雨棚外'),
    'E00-S03': place('@shopClosed', 'outside', '今宵便利 · 沿街铺面'),
    'E00-S04': place('bus-stop', 'road', '公交站 · 候车棚'),

    'E01-S01': place('@stop', 'road', '三巷铁牌旁'),
    'E01-S02': place('freezer', 'shop', '便利店 · 冰柜边'),
    'E01-S03': place('@shop', 'outside', '今宵便利 · 侧门外'),
    'E01-S04': place('empty-plate', 'outside', '粉摊 · 檐下方桌'),
    'E01-S05': place('@room', 'room', '三〇二 · 临街房间', '床与柜子中间留出了一道缝。旧电视黑着，从床边能看见窗外的灯。'),

    'E02-S01': place('zheng-front', 'road', '郑家楼 · 铁闸外'),
    'E02-S02': place('zheng-stairs', 'hall', '郑家楼 · 转角楼梯'),
    'E02-S03': place('zheng-stairs', 'hall', '郑家楼 · 店铺楼梯'),
    'E02-S04': place('zheng-dining', 'room', '郑家楼 · 饭厅'),
    'E02-S05': place('zheng-front', 'road', '郑家楼 · 巷口'),

    'E03-S01': place('cafe-stairs', 'road', '星火网吧 · 铁梯下'),
    'E03-S02': place('revisit-cut-homework', 'room', '星火网吧 · 作业桌'),
    'E03-S03': place('cafe-register', 'cafe', '星火网吧 · 旧前台', '收银机还占着柜台的一角。越过本子和耳机，才看得见里头那排旧机子。'),
    'E03-S04': place('teashop', 'road', '茶饮铺 · 铁梯旁'),
    'E03-S05': place('revisit-cut-cafe', 'cafe', '星火网吧 · 十七号机', '整排屏幕都暗了。面向同一排桌子，每把椅子之间刚够一个人侧身经过。'),

    'E04-S01': place('rice-stall', 'outside', '粉摊 · 棚下'),
    'E04-S02': place('revisit-cut-dock', 'outside', '卸货门 · 门灯下', '卸货门旁的矮窗挨着巷道。站在收货口，能看见门边的手推车。'),
    'E04-S03': place('chopsticks', 'outside', '粉摊 · 矮凳边', '筷子和碟子还在矮桌上。沿着空出来的桌边能走回棚下。'),
    'E04-S04': place('morning-ledger', 'outside', '天亮的粉摊 · 账本边'),

    'E05-S01': place('rental-desk', 'room', '三〇二 · 剪辑桌'),
    'E05-S02': place('wet-workwear', 'outside', '十二号楼顶 · 晾衣绳'),
    'E05-S03': place('delivery-windows', 'outside', '楼顶 · 四扇收件窗'),
    'E05-S04': place('rental-desk', 'room', '三〇二 · 台灯下', '交片的电脑在床边，笔记本还摊在灯下。窗外的楼顶隔着防盗网。'),
    'E05-S05': place('morning-meal', 'outside', '三巷早摊 · 桌边'),

    'E06-S01': place('high-window', 'outside', '三巷十二号 · 后楼高窗'),
    'E06-S02': place('cellar-glass', 'hall', '半地下层 · 玻璃隔板外'),
    'E06-S03': place('flood-cut-landing', 'hall', '水房 · 楼梯缓台'),
    'E06-S04': place('flood-cut-ebb', 'outside', '水房 · 后巷格栅', '格栅已经推开。站在门外能看见缓台上湿过的墙脚。'),

    'E07-S01': place('old-shops', 'road', '老生意街 · 连檐铺面'),
    'E07-S02': place('cobbler', 'room', '修鞋档 · 工作台'),
    'E07-S03': place('tailor', 'room', '改衣铺 · 裁衣桌'),
    'E07-S04': place('key-counter', 'room', '钥匙档 · 柜台'),
    'E07-S05': place('morning-ledger', 'outside', '粉摊 · 炉前桌面'),

    'E08-S01': place('outdoor-set', 'outside', '粉摊 · 临时播出台'),
    'E08-S02': place('outdoor-set', 'outside', '三巷 · 观众席'),
    'E08-S03': place('channel-control', 'outside', '粉摊 · 频道控制桌'),
    'E08-S04': place('witness-table', 'outside', '粉摊 · 证人桌'),
    'E08-S05': place('after-show', 'road', '三巷十二号 · 收工后的街'),
    'E08-S06': place('bus-leaving', 'room', '棠西公交站 · 车窗边'),
    'E08-S07': place('archive-lamp', 'room', '三巷旧柜档 · 灯下'),
    'E08-S08': place('new-kitchen', 'room', '新住处 · 厨房'),
  };
})();
