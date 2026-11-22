(() => {
  "use strict";

  const line = (who, text, extra = {}) => ({ who, text, ...extra });
  const action = (text, extra) => line("", text, extra);
  const lin = (text, pose = "linNeutral") => line("林雨", text, { pose });
  const cen = text => line("阿岑", text);
  const qin = (text, pose = "qinStanding") => line("阿琴", text, { pose });
  const xu = (text, pose = "xuStanding") => line("老许", text, { pose });
  const phone = text => line("手机", text);
  const clip = text => line("旧视频", text, { insert: "clip" });
  const choose = (label, key) => ({ label, key });
  const placeLink = (to, label, x, y, need) => ({ to, label, x, y, need });
  const point = (label, x, y, key, need, unless) => ({ label, x, y, key, need, unless });

  const once = (label,x,y,key) => ({...point(label,x,y,key), once:true});

  const places = {
    stop: {
      name: "棠西村口 · 旧厂牌楼", plate: "stop", cue: "road", enter: "testTake",
      links: [placeLink("shop", "往今宵便利去", .72, .57, "clipRead")],
      inspect: [
        once("从牌楼下认街口", .23, .27, "readArch"),
        {...point("请林雨回放投稿", .46, .70, "sevenSeconds", undefined, "clipRead"), hand:true}
      ],
      reviews:[{key:"sevenSeconds",label:"回放投稿的七秒",need:"clipRead"}]
    },
    shop: {
      name: "今宵便利 · 沿街铺面", plate: "shop", cue: "shop", enter: "atShutter",
      links: [
        placeLink("stop", "回到牌楼", .10, .64),
        placeLink("building", "沿屋檐找十二号", .85, .58, "doorsCompared")
      ],
      inspect: [
        point("向店家说明来意", .75, .45, "meetQin", undefined, "qinAsked"),
        point("请阿琴指一指门", .75, .45, "askAfterLowering", "qinLowered", "shopConsent"),
        point("请阿琴指一指门", .75, .45, "askAfterShowing", "qinSawClip", "shopConsent"),
        point("沿雨棚比对最后一帧", .69, .61, "compareDoors", "shopConsent", "doorsCompared"),
      ],
      reviews:[{key:"streetAgain",label:"在原位再看两扇门",need:"doorsCompared"}]
    },
    building: {
      name: "三巷十二号 · 楼前", plate: "building", cue: "outside", enter: "atNumberTwelve",
      links: [
        placeLink("shop", "回到便利店门前", .13, .66),
        placeLink("hall", "推开楼门", .70, .61, "numberChecked")
      ],
      inspect: [
        point("对照陶牌与租房消息", .622, .098, "checkNumber", undefined, "numberChecked"),
        once("回头看看灯箱", .107, .30, "behindYou")
      ]
    },
    hall: {
      name: "十二号 · 一楼门厅", plate: "hall", cue: "hall", enter: "meetXu",
      links: [
        placeLink("building", "回到楼门外", .16, .70),
        placeLink("stairs", "上楼到转角", .71, .64, "stairsAdmitted")
      ],
      inspect: [
        point("给他看白天的约定", .48, .51, "rentMessage", undefined, "tenantKnown"),
        point("请老许带路", .70, .45, "followWithLightOff", "xuSwitchedOff", "stairsAdmitted"),
        point("请老许带路", .70, .45, "followAfterWaiting", "xuWaited", "stairsAdmitted")
      ]
    },
    stairs: {
      name: "二楼转角 · 临街小窗", plate: "stairs", cue: "hall", enter: "halfLanding",
      links: [
        placeLink("hall", "沿扶手下到一楼", .18, .72),
        placeLink("corridor", "继续上三楼", .85, .54, "landingTested")
      ],
      inspect: [
        point("贴近转角的窗", .25, .40, "testLanding", undefined, "landingTested"),
      ],
      reviews:[{key:"landingAgain",label:"再看棚边遮住的位置",need:"landingTested"}]
    },
    corridor: {
      name: "三楼 · 三〇二门前", plate: "corridor", cue: "hall", enter: "thirdFloor",
      links: [
        placeLink("stairs", "回到楼梯转角", .16, .64),
        placeLink("room", "开三〇二的门", .84, .56, "hasRoomKey")
      ],
      inspect: [
        point("向老许接钥匙", .56, .57, "keyAfterLightOff", "xuSwitchedOff", "hasRoomKey"),
        point("向老许接钥匙", .56, .57, "keyAfterWaiting", "xuWaited", "hasRoomKey"),
        once("看门边的房号", .767, .105, "readRoomNumber")
      ]
    },
    room: {
      name: "三〇二 · 临街出租屋", plate: "room", cue: "room", enter: "inside302",
      links: [placeLink("corridor", "回到三楼走廊", .89, .55)],
      inspect: [
        point("从防盗窗核对灯牌", .515, .23, "roomWindow", undefined, "windowMatched"),
        point("查看电视线的尽头", .798, .912, "inspectPlug", "windowMatched", "plugChecked"),
        point("看向发亮的玻璃", .707, .482, "imageInGlass", "plugChecked", "tvSeen"),
        point("回放阿岑刚才的一条", .49, .69, "recordedGlass", "tvSeen", "footageChecked"),
        point("处理栏目里的旧帖", .77, .64, "correctThePost", "footageChecked")
      ],
      reviews:[{key:"recordingAgain",label:"核对刚才的机内回放",need:"footageChecked"},{key:"windowAgain",label:"回看窗外的雨棚",need:"windowMatched"}]
    }
  };

  const contactChoices = [
    choose("请阿岑把镜头放低", "lowerTheRig"),
    choose("把原片递给她", "giveHerTheClip"),
    {label:"指给她看牌楼下认出的灯牌",key:"showTheSign",need:"archLooked",reason:"还没在牌楼下认过灯牌"}
  ];

  const beats = {
    testTake: {
      lines: [
        action("林雨把采访麦转了半圈，让「夜访」朝着镜头。阿岑从牌楼上的「棠西」落回她脸上。红灯亮了。",{pose:"linListen",reaction:"welcome"}),
        {...lin("你们给我寄过一块铁牌的照片。广州棠西村，三巷，旧纺织厂宿舍背后。说是夜里敲它三下，早就落了闸的铺子也会亮灯。"),expression:"curious"},
        {...lin("晚上好，我是林雨。第一次刷到《夜访》？我们做探灵直播，掌镜的叫阿岑。上回你们叫我来敲铁牌，锤子我可没带。"),expression:"welcome"},
        cen("有人问，这次是来等灯亮的吗？"),
        {...lin("本来想等。昨天有个姑娘给我发了七秒视频，她朝一家店喊了声「搭把手」。我转发的时候，多写了一句「整条巷，没人开门」。"),expression:"concern"},
        {...lin("今天一早她又找我。她问，你站在拍片那个人的位置上，真看得见那家店的门吗？我把视频倒回去看了好几遍，回不上来。","linListen"),expression:"concern"},
        cen("这会儿还有人拿着你写的那句话，在评论里找那家店。"),
        {...lin("所以我们来了。我想先站到她说的位置，再问问店里的人。你们先陪我看这一小段，只拍我；到店门口我就关直播。"),expression:"firm"},
        {...lin("你们想先听哪件？阿岑，挑条留言念给我。","linListen"),expression:"welcome"}
      ],
      choices:[choose("念问铁牌来历的留言","viewerSign"),choose("念问那行标题的留言","viewerTitle")]
    },
    viewerSign: {
      lines:[
        cen("「你怎么知道有人敲了三下？」"),
        {...lin("我不知道。传得最广的那张照片只有牌，没有人；投稿里也没拍到敲牌的手。要是今晚真听见，我会让你们自己听。"),expression:"curious"},
        {...lin("先认店。阿岑，镜头往下点，你们看看女孩伸手时，右边让什么挡住了。","linListen"),expression:"firm"}
      ],flag:"viewerAskedSign"
    },
    viewerTitle: {
      lines:[
        cen("「没人开门」这四个字，是姑娘自己说的吗？"),
        {...lin("不是。她发来的原片一个字也没加。那行标题是我写的。"),expression:"concern"},
        {...lin("别凭我这句话去找店家。阿岑，先拍我的手机，原片和我转的那条都在，你们可以来回对着看。","linListen"),expression:"firm"}
      ],flag:"viewerAskedTitle"
    },
    readArch: {
      lines:[action("从旧厂牌楼往三巷看，雨棚沿遮住半块招牌，只露一个「宵」字。再往左挪，就只能看见卷闸。")],
      flag:"archLooked"
    },
    sevenSeconds: {
      lines:[
        clip("「搭把手！」姑娘抬起手。镜头只拍到落着的卷闸，右边给雨棚挡住了。第七秒，画面停了。"),
        phone("投稿人　「三巷十二号，临街那排窗。你去看看，从拍得到整个灯牌的位置，还能看见棚底下吗？」"),
        {...lin("那半个灯牌上有个「宵」。街对面也有。阿岑，直播到这儿，别把老板没打招呼的脸送上网。"),expression:"curious"},
        cen("关了。走吧，我把机头朝着你。")
      ],
      flag:"clipRead"
    },
    atShutter: {
      lines:[
        action("门闩响了一声。围着深蓝围裙的女人走到屋檐底下，停下来打量他们。",{pose:"qinStanding",cue:"latch"}),
        qin("买东西？水在里头，常温的在最下面。","qinStanding"),
        lin("谢谢。老板，我们是来找您的。方便说两句话吗？","linListen"),
        qin("你俩是谁？"),
        lin("我叫林雨，他叫阿岑。我们做网上那个《夜访》。昨天发的片子里有您这家店，标题是我写的。"),
        qin("哦，就是你。昨晚两个人举着手机堵我柜台，非要我说清楚那晚为什么没开门。我那时候还不知道他们看了什么。"),
        lin("给您添麻烦了。我能把原来那条给您看看吗？您怎么称呼？","linListen"),
        {...qin("叫我阿琴就行。你先告诉我，那台机子现在对着谁？"),expression:"question"}
      ],
      flag:"qinAsked",choices:contactChoices
    },
    meetQin: {
      lines: [
        lin("老板，您好。我姓林，他是阿岑。想跟您说说昨晚那段视频，现在方便吗？", "linListen"),
        qin("视频是你们发的？叫我阿琴就行。你先让我看看机头朝哪儿。")
      ],
      flag: "qinAsked", choices: contactChoices
    },
    lowerTheRig: {
      lines:[
        {...lin("阿岑，机头低一点。对，就停这儿。","linListen"),toCamera:true},
        lin("琴姐，现在只拍我自己的鞋。您说停我们就停。","linListen"),
        action("画面里只剩两双鞋，阿琴等红灯熄了，才往门边挪了一步。",{insert:"aimLow"}),
        qin("行。你们人过来，就站我这儿。我给你开一遍门，只拍门和我的手。","qinStanding")
      ],
      flag:["qinLowered","shopConsent"]
    },
    showTheSign: {
      lines:[
        lin("阿岑朝我这边。琴姐，我从牌楼底下看过来，灯牌只有个「宵」，刚好跟片里一样。"),
        qin("对，你从那边过来，只能看见大闸。送货的怎么进，你站我旁边看看就知道了。"),
        lin("我站这儿？好。阿岑，你照她说的，只拍门。","linListen")
      ],
      flag:["qinLowered","shopConsent"]
    },
    giveHerTheClip: {
      lines:[
        action("林雨把手机递过去。阿琴用拇指把进度条拨回头，又从头看了一次。",{insert:"offer"}),
        qin("就这么长？昨晚那个人给我看的，上面还有一行字。","qinStanding"),
        lin("那是我加的。这才是姑娘寄给我的。"),
        qin("你拿回去。站这儿，我把那扇小门推给你看。脸就别拍了。","qinStanding")
      ],
      flag:["qinSawClip","shopConsent"]
    },
    askAfterLowering: {
      lines: [qin("机子放低了我才敢出来。你就站那儿，别拍脸。", "qinStanding")],
      flag: "shopConsent"
    },
    askAfterShowing: {
      lines: [qin("停在我指的那一格。我要拉门了，你对着门沿。", "qinStanding")],
      flag: "shopConsent"
    },
    compareDoors: {
      lines:[
        action("卷闸一动没动。阿琴推了下门框旁边的窄门，够一个人侧身进来。",{insert:"side"}),
        cen("我站牌楼这边就只剩卷闸了。要拍到她这只手，得往右跨一步。"),
        qin("昨天你们网上那帮人，就拿着这个角度来问我。你现在看见什么了？","qinStanding")
      ],
      choices:[choose("问她当晚是不是这样开的门","overstateTheDoor"),choose("承认原片只拍到了卷闸","limitTheClaim")]
    },
    overstateTheDoor: {
      lines: [
        lin("那天，是您开的侧门？", "linListen"),
        qin("今天是我拉的。昨晚呢？你从片子里指给我看。"),
        action("林雨停在最后一帧。棚沿下面，没有门扇，也没有阿琴的手。", { insert: "clip" })
      ]
    },
    limitTheClaim: {
      lines:[
        lin("我只看见您今天开的这扇小门。昨天的七秒拍不到这儿。琴姐，我那行标题写错了。","linListen"),
        qin("你要找拍片的地方，去隔壁十二号楼。那边楼梯窗跟人家屋里的窗，高低差一截。"),
        lin("十二号？那正是我订的房。我们上去看看，回来再跟您说。"),
        {...qin("今晚先别等我。我儿子在里头替我看收银，我得去后面点货。"),cue:"scan"},
        action("阿琴从侧门回了店里。隔着柜台，只听见她在里头报货数。",{departure:true})
      ],flag:"doorsCompared"
    },
    streetAgain: {
      lines: [action("从侧面能看见门缝。回到投稿的角度，这一块就落在棚后。", { insert: "side" })]
    },
    atNumberTwelve: {
      lines:[action("走过便利店旁的雨棚，就是十二号楼。门楣有块陶牌。"),
        cen("你订的房在这儿？"),
        lin("嗯。投稿人说拍片那扇窗临街，我才特意订了三楼。先跟房东碰个头。","linListen")]
    },
    checkNumber: {
      lines: [
        phone("今天 10:07　许　「三巷十二号，三楼临街的302。今晚我在楼里，把你订房那条消息留着。」"),
        action("林雨把手机和陶牌并在一起。陶牌上是三巷十二号。门后已经传来了一下钥匙声。")
      ],
      flag: "numberChecked"
    },
    behindYou: {
      lines: [
        action("回头望，灯箱横挑出墙，照着雨棚的锈边。站在楼门前只能看见它的底板，一排螺钉沿着边发亮。"),
        lin("片里那道黑线在字的上面。在这个高度拍不到。", "linListen")
      ]
    },
    meetXu: {
      lines:[
        action("钥匙轻轻碰了一下扶手。一个戴眼镜的男人走下最后一级，在楼道灯下停住。",{pose:"xuStanding",cue:"keys"}),
        xu("晚了，找哪户？","xuStanding"),
        lin("您好。白天在手机上订三楼那间的，我姓林。您是许师傅吗？"),
        xu("我姓许。噢，林小姐。我以为你一个人来，给你留的是单间。"),
        lin("是我一个人住。他叫阿岑，送我上来。我们在村里做一期探访，带了台相机，先跟您打个招呼。","linListen"),
        {...xu("探访什么？上个月也有人来，举个机器连我邻居门上的姓名都拍进去了。"),expression:"concern"},
        lin("我们想从楼梯窗看一眼隔壁的雨棚。我先给您看订房那条消息，您看对不对。","linListen"),
        xu("行，让我看看。")
      ]
    },
    rentMessage: {
      lines:[
        action("林雨翻出上午那条消息。老许凑近看了一眼房号，点点头。"),
        xu("是我那间。你问雨棚我知道，可我不知道那晚街上是谁。别给我也安个故事。"),
        lin("我们就量一量从哪扇窗看得到灯牌。过道里有人经过，我们等。"),
        xu("二楼住着个老太太，这会儿她儿子快下班了。楼道随你走，别把人拍进去。成吗？","xuStanding")
      ],flag:"tenantKnown",
      choices:[choose("当着老许的面关掉录像","shutItOff"),choose("让阿岑收好机子，等人过去","waitWithTheBag")]
    },
    shutItOff: {
      lines: [
        action("林雨把机身转给老许看，按下停止。红灯灭了，阿岑把镜头盖扣回去。"),
        lin("您看着它关。到三〇二我再问您，哪边的窗不会拍到邻居。"),
        xu("行，那你俩一起上。我走在前头。", "xuStanding")
      ],
      flag: "xuSwitchedOff"
    },
    waitWithTheBag: {
      lines: [
        {...lin("阿岑，机子先放回包里。楼上有人下来了，给人家让个道。"),toCamera:true},
        cen("行。拉链拉上了。你跟老许先走，我在三楼门口找你。"),
        action("老许听见拉链头碰到包扣，给提着洗衣篮下楼的人让出一边。"),
        xu("这样好。上来还走这边扶手，里头那排是人家厨房。", "xuStanding")
      ],
      flag: "xuWaited"
    },
    followWithLightOff: {
      lines:[
        xu("你们在二楼窗边看一眼。我去三楼给你开门。","xuStanding"),
        action("老许把钥匙收回掌心，先上了楼。门厅里只剩墙上的灯。",{departure:true})
      ],flag:"stairsAdmitted"
    },
    followAfterWaiting: {
      lines:[
        cen("林雨，你先上。我在这儿给人家留条路。"),
        xu("我先去三楼开门。二楼窗台窄，你的包别搁上头。","xuStanding"),
        action("老许先上去了。下楼的人出了铁门，阿岑收好包，追上楼梯。",{departure:true})
      ],flag:"stairsAdmitted"
    },
    halfLanding: {
      lines: [
        action("转过第一道弯，窗里透出店牌的暖光。屋檐爬到窗台那么高，刚才在街上看见的螺钉已经看不见了。"),
        lin("就是这盏。你看，从这儿只能看见牌的上半截。等我把原片停在同一帧。", "linListen")
      ]
    },
    testLanding: {
      lines: [
        action("林雨贴近小窗。棚边从「宵」字中间切过去，下面半个字被挡住。", { insert: "landingView" }),
        action("她把来稿停在带这个字的一帧。", { insert: "clip" }),
        lin("同一盏。手机上那个字，能从头读到底。", "linListen")
      ],
      then: "goOneHigher"
    },
    assumeSecondFloor: {
      lines: [
        action("林雨弯下膝盖，遮住的地方更多。她踮起脚，仍隔着棚看不见那个字的下沿。", { insert: "landingView" }),
        cen("别再往外探了。我在你后面看着呢，灯牌下面那个口字旁，怎么挪也看不全。")
      ]
    },
    goOneHigher: {
      lines: [
        lin("是同一边。可这里看不见完整的字。先上三楼，别急着说是哪个窗口。"),
        cen("上去吧。楼上有人开门了，应该是许师傅。")
      ],
      flag: "landingTested"
    },
    landingAgain: {
      lines: [
        action("棚边仍压着灯箱的下半部。这扇窗能认方向，还对不上来稿里的完整招牌。", { insert: "landingView" })
      ]
    },
    thirdFloor: {
      lines:[action("上完最后一跑楼梯，老许已经在三〇二门口等他们。他从钥匙圈里挑出一把平钥匙。",{pose:"xuStanding"}),
        lin("窗户是靠街那面吧？我们进去就把门关上。"),
        xu("朝街。进屋你就知道了，门别替我留。我还有两户要收水费。","xuStanding")]
    },
    readRoomNumber: {
      lines: [
        action("铜牌上的302朝墙歪了一点，下面留着三颗旧钉眼。订单里的房号和眼前的房号一致。")
      ]
    },
    keyAfterLightOff: {
      lines:[
        xu("钥匙给你，明早走的时候放我信箱。刚才你肯关录像，我才敢让你在这层慢慢看。","xuStanding"),
        lin("好。只拍我自己那扇窗，谢谢您。","linListen"),
        action("钥匙到了林雨手里。老许揣好剩下的那串，下楼去了。",{cue:"keys",departure:true})
      ],flag:"hasRoomKey"
    },
    keyAfterWaiting: {
      lines:[
        xu("我刚还惦记着你搭档呢。真让人过去才上来？","xuStanding"),
        cen("嗯。刚跟上，包都没打开。"),
        xu("谢谢。钥匙就这一把，别锁在屋里。"),
        action("林雨接过钥匙。老许朝楼梯一摆手，下楼收水费去了。",{cue:"keys",departure:true})
      ],flag:"hasRoomKey"
    },
    inside302: {
      lines: [
        action("林雨关上门，把钥匙放在窗台上。房里一张床，一台旧电视，防盗窗外就是刚才那排屋檐。"),
        cen("门关了。我在屋里开机，只看咱们眼前的东西。"),
        lin("你站我肩后。片里灯牌上头有道斜线，窗外要是也有，咱们就找对地方了。")
      ]
    },
    roomWindow: {
      lines: [
        action("从三〇二望出去，这回棚边落到灯箱下面，一个「宵」字完整露出来了。", { insert: "roomView" }),
        action("林雨贴着防盗窗朝隔壁斜看。灯箱顶有根弯铁撑，「宵」字整个露出来。她把手机移到同一根窗条边，来稿里的黑线正好压在那根铁撑上。", { insert: "clip" }),
        cen("卷闸第一条横缝也在。往右再挪半步试试？"),
        lin("还是挡着。怪不得她问我那句话。阿岑，把这个位置记下来，窗别拍到对门去。", "linListen")
      ],
      flag: "windowMatched"
    },
    windowAgain: {
      lines: [
        action("隔壁卷闸的一道横缝、完整的「宵」和灯箱顶的弯铁撑都在。侧门藏在雨棚下。", { insert: "roomView" })
      ]
    },
    inspectPlug: {
      lines: [
        action("床边旧电视的电线垂到墙脚。林雨顺线捡起插头，两片铜脚上都是灰。整窗铁条投在黑玻璃上。", { insert: "plug" }),
        lin("别动那根线。阿岑，你拍到了吧？插头在我手底下。"),
        cen("收到了，线一直连到电视后盖。你放回原处。"),
        action("插头落回墙脚。阿岑的镜头还朝着地板，一层灰蓝的光却从床边照过来。")
      ],
      flag: "plugChecked"
    },
    imageInGlass: {
      lines: [
        action("林雨刚放回插头，玻璃里亮起一条暖光。她转过身，窗外灯箱还在原处。玻璃里那盏灯却在半扇门的外面。", { insert: "tv", cue: "tv-noise" }),
        lin("阿岑，站我这儿看。刚才那根铁撑朝左，现在怎么朝右了？像是从店门里往外看。", "linListen"),
        action("铁片响了三下。一、二，停了一口气，第三下。阿岑把镜头移到玻璃上。屋里的亮光收掉，插头仍在墙脚。", { insert: "tvFade", cue: "iron-three" }),
        cen("从你放回插头起，这条我没停。先看机子到底收着什么。")
      ],
      flag: "tvSeen"
    },
    recordedGlass: {
      lines: [
        action("阿岑把刚才的机内文件倒回头。画面里地上的插头清楚，镜头移到电视时却只照见黑玻璃。", { insert: "playback" }),
        cen("我也听见了，三声。可门呢？我倒回去看了两遍，插头拍得清清楚楚，一照玻璃就全黑了。"),
        lin("我当时真看见一扇门开了。可要再写「我拍到了」，就跟昨天那行标题一样了。", "linListen"),
        cen("明早琴姐开门，要是又有人堵她呢？你那条转发还挂着。")
      ],
      flag: "footageChecked"
    },
    recordingAgain: {
      lines: [
        action("机内条目还在。电视玻璃里只有房内的反光。七秒来稿也还在手机里，两份文件各有各的结束位置。", { insert: "playback" }),
        cen("没覆盖。明天谁肯当面讲，你再拿原件跟她对。")
      ]
    },
    correctThePost: {
      lines: [
        phone("《夜访》已发布　「整条巷，没人开门」　留言仍有人在问店名。"),
        lin("琴姐让我看的那扇门，在原片里根本看不见。我自己写的标题，我现在改。")
      ],
      choices: [
        choose("撤掉原题，在原帖发布更正", "publishCorrection"),
        choose("先撤整条片，在主页说明缘由", "withdrawClip")
      ]
    },
    publishCorrection: {
      lines: [
        action("林雨打开自己发过的原帖，删去那个标题，把更正放在片子上方。她按下发布，刷新后的第一行已变成「更正」。"),
        phone("更正　我把七秒里的一扇卷闸当成了整条街。画面没有拍到侧门。原来的标题是我写错的。请别再去店里找人。——林雨"),
        cen("从栏目主页点进去，也能看见这一行。"),
        phone("投稿人　「我看见你改的那行了。明晚九点，三巷的铁牌旁见。相机先收着，到时候我自己跟你说。」"),
        {...lin("九点，铁牌旁。我等你。"),expression:"firm"}
      ],
      flag: "correctedPublicly", end: true
    },
    withdrawClip: {
      lines: [
        action("林雨先保存收到的原文件，再把栏目的转发撤下。旧地址打开，已看不到那段片。她在主页贴上一条说明。"),
        phone("撤片说明　那七秒只拍到卷闸。帖子里说没人开门，是我写过了头。片子已经撤下，请别再去店里找人。——林雨"),
        cen("旧链接打不开了。主页能看见你刚写的说明。"),
        phone("投稿人　「旧片我点不开了，说明也看到了。明晚九点，三巷的铁牌旁见。先别把我拍进去。」"),
        {...lin("好。明晚我到，你先认我。"),expression:"firm"}
      ],
      flag: "withdrawnPublicly", end: true
    }
  };

  function objective(state) {
    const f = state?.flags ?? {};
    if (f.correctedPublicly || f.withdrawnPublicly) return "明晚九点，三巷铁牌旁。";
    if (!f.clipRead) return "请林雨回放那七秒。看看女孩伸手时，雨棚挡住了什么。";
    if (!f.qinAsked) return "到今宵便利，向店里的人表明来意。";
    if (!f.shopConsent) return "听阿琴把话说完，问清她允许怎样拍。";
    if (!f.doorsCompared) return "站在街上，把最后一帧和眼前的铺面对齐。";
    if (!f.numberChecked) return "沿同一排屋檐走到十二号，对照租房消息。";
    if (!f.tenantKnown) return "进楼找到管钥匙的人，让他核对租房约定。";
    if (!f.stairsAdmitted) return "收好楼道里的相机，请老许带路。";
    if (!f.landingTested) return "到二楼窗前比一比来稿的高度。";
    if (!f.hasRoomKey) return "沿楼梯到三楼，接过三〇二的钥匙。";
    if (!f.windowMatched) return "进租来的三〇二，从窗边找来稿里的灯牌。";
    if (!f.plugChecked) return "看看旧电视的线接到哪里。";
    if (!f.tvSeen) return "回头看看刚刚亮起来的电视。";
    if (!f.footageChecked) return "回放阿岑刚拍的文件。";
    return "处理栏目里的旧帖，再看投稿人的回信。";
  }

  window.FIRST_TAKE = { start: "stop", places, beats, objective };
})();
