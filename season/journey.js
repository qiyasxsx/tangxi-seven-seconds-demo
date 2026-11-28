// The first exposure is a place seen on the way in. The second is the
// threshold in that same place. A missing threshold means we hold our ground.
(() => {
  const place = (path, wide, threshold, centre, point) => ({path, wide, threshold, centre, point});
  const field = '../first-take/art/';
  const street = 'approaches/';
  const art = 'art/';
  const room = name => field + name + '.webp';
  const shot = name => art + name + '.webp';
  const far = name => street + name + '.webp';
  window.SeasonJourney = {
    'E00-S01':place('广州 · 棠西村　／　公交站外',far('village'),null,[65,49],[65,48]),
    'E00-S02':place('牌楼里面　／　三巷雨棚下',room('stop'),null,[69,57],[70,48]),
    'E00-S03':place('沿水沟往里　／　今宵便利侧门',room('stop'),room('shop'),[74,59],[73,58]),
    'E00-S04':place('出牌楼　／　回城方向',shot('bus-stop'),null,[60,55],[32,54]),
    'E01-S01':place('次晚　／　回到三巷铁牌下',far('village'),room('stop'),[63,55],[64,54]),
    'E01-S02':place('等小茵下班　／　今宵便利门前',room('shop'),shot('freezer'),[81,54],[80,58]),
    'E01-S03':place('仍在雨棚下　／　水沟外的红伞',room('stop'),room('shopClosed'),[69,57],[68,58]),
    'E01-S04':place('从窄门往外看　／　斜对面蓝棚底下',far('crossing'),null,[30,49],[31,54]),
    'E01-S05':place('把毛巾还给琴姐　／　回到便利店',room('shop'),shot('freezer'),[82,55],[78,53]),
    'E02-S01':place('从街口拐进里巷　／　郑家楼下',far('zheng-lane'),shot('zheng-front'),[56,60],[56,61]),
    'E02-S02':place('还是这段楼梯　／　国强给的十分钟',shot('zheng-stairs'),null,[55,66],[52,65]),
    'E02-S03':place('从饭厅下楼　／　国强的店门口',shot('zheng-stairs'),null,[44,57],[43,61]),
    'E02-S04':place('绕到后楼　／　地下室门外',shot('zheng-lock'),null,[65,51],[62,53]),
    'E02-S05':place('四月五日　／　回三〇二听国强说',room('landingView'),shot('rental-desk'),[62,53],[64,58]),
    'E03-S01':place('茶饮铺那条街　／　星火网吧铁梯下',far('stairs'),shot('cafe-stairs'),[38,51],[35,52]),
    'E03-S02':place('楼上　／　电脑桌排尽头',shot('terminal-17'),shot('homework'),[51,57],[51,53]),
    'E03-S03':place('次日　／　铁梯旁的茶饮铺',far('stairs'),shot('teashop'),[36,50],[35,52]),
    'E03-S04':place('下班后　／　铁梯旁的茶饮铺',far('stairs'),shot('teashop'),[75,57],[77,55]),
    'E03-S05':place('收了铺　／　沿铁梯上星火网吧',shot('cafe-stairs'),shot('terminal-17'),[28,46],[37,52]),
    'E04-S01':place('回到三巷　／　粉叔的炉子前',far('crossing'),shot('rice-stall'),[30,52],[28,56]),
    'E04-S02':place('离开炉火　／　工棚旧址',far('work-shed'),null,[67,48],[67,51]),
    'E04-S03':place('原路回三巷　／　粉摊队尾',far('crossing'),shot('rice-stall'),[30,52],[28,56]),
    'E04-S04':place('天亮　／　还是昨晚那张桌子',far('crossing-morning'),shot('morning-ledger'),[29,48],[28,56]),
    'E05-S01':place('十二号　／　三楼临街的房间',room('building'),shot('rental-desk'),[59,46],[56,53]),
    'E05-S02':place('站在晾衣绳下　／　风把袖口送了过来',shot('broadcast-cut-four-coats-r2'),null,[70,38],[65,37]),
    'E05-S03':place('穿过晾衣绳　／　铁门背后',shot('wet-workwear'),shot('delivery-windows'),[38,51],[40,53]),
    'E05-S04':place('从天台折返　／　三〇二',room('landingView'),shot('rental-desk'),[66,52],[72,57]),
    'E05-S05':place('次日早班　／　三巷粉摊',far('crossing-morning'),shot('morning-meal'),[29,48],[28,56]),
    'E06-S01':place('十二号前楼　／　绕到后巷',far('rear'),shot('high-window'),[65,60],[65,62]),
    'E06-S02':place('从矮窗旁的门下去　／　半地下层',shot('high-window'),far('room-glass'),[22,48],[23,51]),
    'E06-S03':place('隔板外　／　通后巷的转角',shot('cellar-glass'),shot('flood-cut-landing'),[28,55],[29,55]),
    'E06-S04':place('铁栅两侧　／　从缓台望向后巷',shot('flood-cut-landing'),null,[78,48],[77,51]),
    'E07-S01':place('老生意街　／　陈伯的修鞋档',far('shop-row'),null,[42,51],[41,54]),
    'E07-S02':place('停在档口　／　陈伯工作台前',shot('old-shops'),shot('cobbler'),[32,58],[34,58]),
    'E07-S03':place('沿同一排屋檐　／　黄姨改衣铺',far('shop-row-night'),shot('tailor'),[56,61],[55,59]),
    'E07-S04':place('隔天　／　罗叔的钥匙档',far('shop-row'),far('key-workshop'),[77,63],[73,59]),
    'E07-S05':place('回三巷　／　粉摊的桌子',shot('morning-ledger'),null,[48,51],[43,55]),
    'E08-S01':place('七月十八日　／　三巷临时外拍场',far('broadcast-yard'),shot('outdoor-set'),[38,47],[41,50]),
    'E08-S02':place('日落后　／　从店门望向播出台',far('broadcast-yard'),shot('outdoor-set'),[39,53],[41,54]),
    'E08-S03':place('在证人桌背后　／　转到监视器这边',shot('outdoor-set'),shot('channel-control'),[72,59],[71,59]),
    'E08-S04':place('仍在粉摊　／　把镜头交给证人桌',shot('outdoor-set'),shot('witness-table'),[62,57],[61,57]),
    'E08-S05':place('收播后　／　桌外的三巷',far('broadcast-yard'),shot('outdoor-set'),[37,54],[40,54]),
    'E08-S07':place('同日下午　／　三巷旧柜档',shot('after-show'),shot('archive-lamp'),[54,58],[55,58]),
  };
  // Optional inspection describes what the camera can actually see at this distance.
  const details={
    'E00-S01':['抬头看灯牌','在站棚旁往牌楼里看，那家店只露出一点灯光。要读出店名，得走近一点。'],
    'E00-S03':['找窄门','站在棚下只看得见卷闸。沿着水沟走，右手边墙上还有一线光。'],
    'E01-S01':['认集合的路','出了公交亭，进牌楼，再往三巷走。昨晚就是从这边进去的。'],
    'E01-S02':['看店门','侧门的灯还亮着。只有进到柜台旁，才能听清冰柜提手磕回去的第二声。'],
    'E01-S04':['望向对街','从窄门望出去，露出水面的砖正对着蓝棚。粉叔招手时，林雨隔着水沟也能看得见。'],
    'E01-S05':['回头看店','从棚下望过去，琴姐那边还亮着。湿毛巾得送回对街去。'],
    'E02-S01':['找绿闸','走到里巷尽头，白砖外墙下的绿闸才露出来。国强说他会在这儿。'],
    'E02-S02':['看门口','进了绿闸才上楼。站在巷里，只能看见楼梯口的灯。'],
    'E02-S04':['看锁环','锁环和锁眼在门的同一面。到了另一边，这盏灯就照不到手上的钥匙了。'],
    'E02-S05':['看三楼木门','从楼梯拐上来，朝走廊尽头走，就是林雨和阿岑临时剪片的屋。'],
    'E03-S03':['沿铁梯找人','茶饮铺就在铁梯旁边。上楼才是老邓的柜台。'],
    'E03-S05':['看看铁梯','四个人收工了，才凑到这道梯子前。五把椅子还在楼上。'],
    'E04-S01':['认蓝棚','从窄门口能看见斜对面白色的蒸气，粉叔今晚又开炉了。'],
    'E04-S02':['望向工棚','穿过小院，亮着罩灯的铁栏后面就是上夜班的地方。'],
    'E04-S03':['望向摊边','出了工棚，再过水沟。蓝棚底下亮着，炉子还没收。'],
    'E04-S04':['看早上的粉摊','还是同一条水沟。天光照到棚面，路灯已经熄了。'],
    'E05-S01':['看楼口','从十二号正门进去，上三层。窗后那张桌子已经成了外拍组的剪辑台。'],
    'E05-S02':['抬头看楼梯','越过三楼还得上半层，晾衣的天台在顶上。'],
    'E05-S03':['看衣绳','衣袖被风吹到一起。几张薄纸在口袋边抖，露出来的都是折角。'],
    'E05-S04':['看三〇二门','这道门后放着剪片用的电脑。从天台下来，阿岑仍在里面等她。'],
    'E05-S05':['找早摊','日头照亮了对面的蓝棚。昨晚聚在这里的人已经去上班。'],
    'E06-S02':['找楼梯入口','有窗的墙根在脚下，入口却在矮窗旁。得从那边下去。'],
    'E07-S01':['沿檐认三家铺','顺着檐下走，先是红棚修鞋，再是改裤脚的蓝白棚。檐最里头有块挂钥匙的木板。'],
    'E07-S03':['找改衣铺','走过陈伯的台子，隔壁棚下那台缝纫机就是黄姨的。'],
    'E07-S04':['找配钥匙的档口','过了改衣铺，最里头那一格的钥匙板在灯下。'],
    'E08-S01':['看电缆走向','从这头看，三张椅子摆在粉摊前，播出台的线顺桌腿垂下来。水沟上的砖仍留给人过。'],
    'E08-S02':['看桌前的空位','炉子还要用，播出台挪到旁边。椅子留给愿意自己来的人。'],
    'E08-S03':['看导播桌','阿岑的预监还亮着。播出去的声音，得从桌子这一侧切过去。'],
    'E08-S04':['看那几张椅子','桌子斜对着窄门，只要把镜头压下一点，就能只收一双放原片的手。'],
    'E08-S05':['望向粉摊','节目收了，桌和炉子还在。灯底下是三月站在对街时就看得见的位置。'],
  };
  for(const [id,observation] of Object.entries(details))window.SeasonJourney[id].look=observation;
  // Across these boundaries the same people are still in the middle of one action.
  for(const id of ['E01-S03','E02-S02','E03-S02','E05-S02','E06-S04'])window.SeasonJourney[id].match=true;
})();
