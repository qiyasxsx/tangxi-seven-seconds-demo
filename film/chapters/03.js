window.FILM_CHAPTERS ||= [];
window.FILM_CHAPTERS[3] = {
  id: "E03", title: "第三章　黑网吧·缺一人",
  scenes: [
    {
      id: "E03-S01", title: "十七号开机", place: "星火网吧铁梯与机房", time: "4月16日 · 夜",
      shots: [
        {
          id: "call-back", scale: "wide", image: "art/03/callback-room.webp", mood: "ordinary",
          lines: [
            ["旁白", "四天后的傍晚，阿岑在三〇二接到了陈姐的回电。电话另一头，两个塑料带盒轻轻碰了一下。"],
            ["陈姐", "我是当年去星火拍梁安的那个记者。原带找出来了，我不借。朋友们想听，我可以跟他们当面坐下来放。"],
            ["林雨", "我们连人都还没找全。网吧这些年还开门吗？"],
            ["陈姐", "早关了。原来守柜台的老邓还管那栋楼，我替你俩约他今晚八点。认门看外墙那把铁梯，茶铺卷闸上头还有“星火”两字。"],
          ],
        },
        {
          id: "iron-stair", scale: "wide", image: "art/03/cafe-stairs.webp", mood: "ordinary", cue: "iron",
          lines: [
            ["旁白", "八点差五分，林雨先在绿卷闸前站住。阿岑背着机器顺外墙上了半截，看见楼口一个男人在摘钥匙，停下来等她。"],
          ],
        },
        {
          id: "stair-meeting", scale: "medium", image: "art/03/stair-meeting.webp", mood: "ordinary",
          lines: [
            ["林雨", "邓老板？我是陈姐约来的林雨。这位是阿岑，机器先留在包里。"],
            ["老邓", "架子底下是我替人寄的纸箱。过一箱点一箱，别怪我没提醒。半小时够不够？"],
          ],
        },
        {
          id: "aisle", scale: "medium", image: "art/03/cafe-aisle.webp", mood: "ordinary", actors: ["hostBack", "deng"], emotion: "guard",
          lines: [
            ["林雨", "够。从铁梯上来，尽头就是十七号？"],
            ["老邓", "对。那一排桌子早跟墙拴死了，搬不动。货主当货架用。"],
            ["阿岑", "电也没接。你看插头上这一层灰。"],
          ],
        },
        {
          id: "unplug", scale: "detail", image: "art/03/dead-plug.webp", mood: "uneasy",
          lines: [
            ["旁白", "阿岑的指头在插头旁边停住。从林雨这边望过去，最里面却有一块蓝光慢慢爬上墙。"],
            ["梁安", "哎，那把别坐！坐这把。刚才腿还在呢，人一坐就往旁边歪。"],
          ],
        },
        {
          id: "catch-chair", scale: "medium", image: "art/03/loose-chair.webp", mood: "uneasy",
          lines: [
            ["阿岑", "嚯！……我接着了。你刚才在跟谁说话？"],
            ["林雨", "一个穿大人西服的男孩。他刚用脚把坏椅子踢出来了。"],
            ["阿岑", "那我靠墙放。谁要往后退，先喊我。"],
          ],
        },
        {
          id: "first-question", scale: "medium", image: "art/03/cafe-end.webp", mood: "uneasy", actors: ["hostBack", "liang"], emotion: "guard", view: "林雨所见",
          lines: [
            ["林雨", "有个陈姐留着你以前的带子。她让我先找你朋友。"],
            ["梁安", "又是神童那个？别问我它。你问胖虎他们等了多久。他说五分钟你别信，光开五台机都不止。"],
            ["林雨", "我要是找不齐呢？"],
            ["梁安", "也回来告诉我一声。就这几行，我都翻烂了。"],
            ["林雨", "嗯。找着几个，我就告诉你几个。"],
          ],
        },
      ],
    },
    {
      id: "E03-S02", title: "答应过的十分钟", place: "十七号的屏光、梁家门外", time: "4月16日 · 深夜",
      shots: [
        {
          id: "promise", scale: "wide", image: "art/03/study-desk.webp", mood: "uneasy", view: "林雨所见",
          lines: [
            ["旁白", "林雨顺铁梯往下退了一步。踏板不见了，她的鞋尖抵着一张写字桌的横档。一本作业摊到头，最后一题也有勾。"],
            ["梁安", "“做完玩十分钟”。你看最下面那个日期。最上面是上个礼拜。"],
          ],
        },
        {
          id: "book", scale: "detail", image: "art/03/school-dates.webp", mood: "uneasy", view: "林雨所见",
          lines: [
            ["林雨", "三次？我都数到第三次了。"],
            ["阿岑", "林雨？你在看十七号机上那本？从这头看是合着的。你别再退，后面是楼梯。"],
            ["旁白", "她的手还搭在栏杆上，掌心里的凉铁却变成了门上的漆。门外有人催，里面的孩子没答。"],
          ],
        },
        {
          id: "knock", scale: "medium", image: "art/03/school-door.webp", mood: "quiet", cue: "door", view: "林雨所见",
          lines: [
            ["林雨", "我把电话扣下了。你听听我在门底敲的。你想让我走，我退回去就是。"],
            ["旁白", "第一下很轻。等她敲了第二下，门里面也咚、咚两声。两个节奏贴在一块儿，催作业的声音慢了半拍。"],
            ["梁安", "胖虎、木头、半糖，还有过弯。明天去问老邓几点打的烊。他见过他们四个。"],
            ["林雨", "我记下。还有什么不许我乱问的？"],
            ["梁安", "别问他我为什么没去。他哪知道。"],
          ],
        },
        {
          id: "cold-tea", scale: "wide", image: "art/03/cafe-aisle.webp", mood: "quiet", actors: ["hostBack", "deng"], emotion: "ease",
          lines: [
            ["阿岑", "我敲三下，听见就还三下。来，站稳了。"],
            ["旁白", "第三声落在铁扶手上。老邓手里的茶已经凉透了，他把玻璃杯换到另一只手，腾出路来。"],
            ["老邓", "这四个都有工作。电话我不给。"],
            ["林雨", "店名就够了。我挨家去问，不肯见，就让人家照样做生意。"],
          ],
        },
      ],
    },
    {
      id: "E03-S03", title: "四十二分钟", place: "网吧柜台、桥头旧铺", time: "4月17日到18日 · 日间",
      shots: [
        {
          id: "cash-desk", scale: "wide", image: "art/03/counter-day.webp", mood: "ordinary", actors: ["hostBack", "deng"], emotion: "open",
          lines: [
            ["老邓", "你先把写别人名字那半边折进去。看这行，有上机时间，有结账时间。", "showLedger"],
            ["林雨", "两头一减，四十二分钟。这天机器只记到这儿？"],
            ["老邓", "嗯。后来我开始拖地，他们四个还蹲这儿等。等到两点，我亲手把闸拉的。"],
          ],
        },
        {
          id: "minutes", scale: "detail", image: "art/03/cafe-ledger.webp", mood: "quiet",
          lines: [
            ["阿岑", "那我在票根上另起一行。机器记四十二分钟。四个人等到两点，是你亲眼看见。"],
            ["老邓", "对。他回去干什么，我瞎猜都不行。你们要想问他那身西装，找桥头给人改衣的黄姨。"],
          ],
        },
        {
          id: "shops", scale: "wide", image: "art/03/bridge-shops.webp", mood: "ordinary",
          lines: [
            ["陈伯", "先等我把鞋搁稳。这后跟我补过两回。高脚椅子底下有铁管，孩子坐不住，脚就在上头晃。"],
          ],
        },
        {
          id: "cobbler", scale: "medium", image: "art/03/bridge-shops.webp", mood: "ordinary", actors: ["hostBack", "vendor"], emotion: "open",
          lines: [
            ["林雨", "我拍到塑料凳为止。这样行吗？"],
            ["陈伯", "鞋拍得着就行，我这脸今天要吃云吞。西服问隔壁。"],
          ],
        },
        {
          id: "stitches", scale: "detail", image: "art/03/shoe-hem.webp", mood: "ordinary",
          lines: [
            ["黄姨", "人那么小，西服这么大。那会儿赶着拍，袖子我只蹭两针，跟他说回来我给你拆。后来没见他穿来过。"],
          ],
        },
        {
          id: "compare", scale: "close", image: "art/03/three-edits.webp", mood: "ordinary",
          lines: [
            ["阿岑", "三段视频里，这儿的线都多垂一小截。你听，掉笔的声音也一样。"],
            ["林雨", "同一天，同一支笔。抬头以后三个视频都断了。不能把这一段算成三个人说的话。"],
          ],
        },
        {
          id: "recorder", scale: "medium", image: "art/03/tailor-desk.webp", mood: "quiet",
          lines: [
            ["陈姐", "哪位是林雨？黄姨，我借你这张桌子用一下。录了他抬头以后那截的，是我。"],
            ["林雨", "您来按。我只记时码。"],
          ],
        },
        {
          id: "collar", scale: "close", image: "art/03/collar-tape.webp", mood: "quiet", view: "陈姐的采访原带",
          lines: [
            ["陈姐", "看，扣领子的是他爸爸。这儿摄像停了，收声还开着。"],
          ],
        },
        {
          id: "blank-tape", scale: "detail", image: "art/03/tape-player.webp", mood: "quiet", cue: "click",
          lines: [
            ["旧带·梁安", "都拍好了吧？今天能不能让我不当神童。就今天。这件衣服扎我脖子。"],
            ["旁白", "屏幕一片黑，声音就在小桌上。陈姐的大拇指按停，磁带飞轮转了半圈才停下来。"],
            ["陈姐", "当年是活生生一个孩子说的。几个朋友想听，我放给他们听。节目里不要用。"],
            ["林雨", "好。我拿时间去问，你把带子带走。"],
          ],
        },
      ],
    },
    {
      id: "E03-S04", title: "四个活人", place: "半糖的茶饮铺、铁梯口", time: "4月19日 · 收工后",
      shots: [
        {
          id: "tea-front", scale: "wide", image: "art/03/tea-awning.webp", mood: "ordinary",
          lines: [
            ["半糖", "只关了半边。我得冻明天的料。凳别收，那边还要来一个。"],
          ],
        },
        {
          id: "tea-wait", scale: "medium", image: "art/03/tea-awning.webp", mood: "ordinary", actors: ["hostBack", "mutou"], emotion: "open",
          lines: [
            ["木头", "过弯接了最后一单。说九点到，你甭等他才说。"],
            ["林雨", "那我就问。十七号机前有个人，他一直在等你们当年的一句话。你们等到几点？"],
          ],
        },
        {
          id: "wet-bag", scale: "medium", image: "art/03/ice-tea.webp", mood: "quiet",
          lines: [
            ["胖虎", "到打烊。我把老板骂了一通，当时真以为梁安考上少年班就看不起我们了。这句也得传，难听我认。"],
            ["半糖", "你把漏冰的袋子挂椅背上吧。……你听这个。他以前第一个上铁梯，就这样叫我们跟上。"],
            ["林雨", "两下。昨夜他也是这么回答我的。"],
          ],
        },
        {
          id: "old-disk", scale: "close", image: "art/03/original-disc.webp", mood: "quiet",
          lines: [
            ["木头", "旧盘在我这儿。等他的四个人都说了话。那句“你个废物”，你找得到是谁发的吗？"],
            ["阿岑", "你翻得够慢了，我没看见发送人。我也不去搜你们现在的号。"],
            ["半糖", "能一起去打一局。先说好，不在镜头前挨个说心里话。"],
          ],
        },
        {
          id: "scooter", scale: "medium", image: "art/03/tea-scooter.webp", mood: "relief",
          lines: [
            ["过弯", "车别扶，脚撑支好了！送晚那单我转出去了。以前都是他等我，今晚也让他少等会儿。"],
            ["半糖", "你这护目镜又戴歪了。低点头，要不一上楼就撞门楣。"],
            ["阿岑", "我带个扳手。我那把椅子还在楼上等着呢。"],
            ["旁白", "冰袋提在胖虎手上，木头把旧盘塞进衣袋。半糖最后熄了茶招的灯，四个人从不同的位置走向同一把铁梯。"],
          ],
        },
      ],
    },
    {
      id: "E03-S05", title: "五把椅子", place: "星火网吧十七号机", time: "4月19日 · 近零点",
      shots: [
        {
          id: "five", scale: "wide", image: "art/03/five-empty.webp", mood: "quiet",
          lines: [
            ["老邓", "往里挪挪。五把都拉出来，别卡着走道。十七号留正中间。"],
          ],
        },
        {
          id: "sit-down", scale: "medium", image: "art/03/arrive-chairs.webp", mood: "quiet",
          lines: [
            ["旁白", "四个人先后坐下。阿岑蹲到正中空椅子旁，手摸到一颗松螺帽，把扳手搁在脚边。"],
            ["胖虎", "老邓让咱回家的时候，我还以为你第二天能来。等到打烊啊，我们真没先走。"],
          ],
        },
        {
          id: "debts", scale: "medium", image: "art/03/five-friends.webp", mood: "quiet",
          lines: [
            ["过弯", "对了，你垫我的三块五。我记着呢。"],
          ],
        },
        {
          id: "relay", scale: "medium", image: "art/03/five-witness.webp", mood: "relief", view: "林雨所见",
          lines: [
            ["梁安", "四块。他一张嘴，五毛钱就叫他说没了。"],
            ["旁白", "林雨看得见梁安挨在空椅子边，过弯只看着空出来的椅面。"],
            ["林雨", "他说四块。少的那五毛，他还替你记着。你们这局，打不打？"],
            ["过弯", "成。你收好了啊，一块、两块、三块、四块。"],
          ],
        },
        {
          id: "coins", scale: "detail", image: "art/03/coins-mouse.webp", mood: "relief", cue: "click",
          lines: [
            ["半糖", "你钱别搁杯子下面。我把耳机挂这儿。开局你来，我们等你。"],
            ["旁白", "没人替十七号按开始。旁边的鼠标咔哒一声，五台显示器一齐换了光。"],
          ],
        },
        {
          id: "flank", scale: "medium", image: "art/03/five-lean.webp", mood: "ordinary",
          lines: [
            ["胖虎", "回来！回头看，你后面有一个。哎你跑哪儿去！"],
            ["过弯", "你冲我嚷什么？我在你左手边儿。你刚喊的是他那个位置。"],
            ["旁白", "十七号的鼠标短短响了两次。屏幕里落到最后面的那个小人回过头，追上了他们。"],
            ["半糖", "他听见了。胖子，看你自己那边！"],
          ],
        },
        {
          id: "loss", scale: "close", image: "art/03/game-last.webp", mood: "relief",
          lines: [
            ["胖虎", "再走一步，再走……啊。就差一分。过弯，你那个币能买一分吗？"],
            ["过弯", "你有脸收我五毛，就有脸再输一局。"],
            ["旁白", "四只手离开键盘。过弯先笑出了声，木头也跟着笑。结算的声音过去了，谁也没急着按退出。"],
          ],
        },
        {
          id: "take-off", scale: "medium", image: "art/03/cafe-end.webp", mood: "quiet", actors: ["hostBack", "liang"], poses: {"liang": "rest"}, view: "林雨所见",
          lines: [
            ["旁白", "下了机，梁安从肩上褪下那身不合身的西服，褪白的小球队领口终于露了出来。他把旧卡和外套分别递向两边。"],
            ["梁安", "老邓，卡退你。西服留给陈姐。下回她要拍，让她找个穿得下的人。"],
            ["老邓", "卡我收着。你这照片角是你自己卷的啊。"],
          ],
        },
        {
          id: "coat-return", scale: "close", image: "art/03/coat-on-chair.webp", mood: "quiet",
          lines: [
            ["旁白", "林雨从他手里接过那件西服，用手托住领口，把它搭上十七号。沉沉的两只袖子落在椅背两边。"],
          ],
        },
        {
          id: "wheel", scale: "detail", image: "art/03/chair-wrench.webp", mood: "quiet", cue: "iron",
          lines: [
            ["阿岑", "这颗就是。你再歪一下试试……行，现在落地了。"],
            ["梁安", "你坐好的。以后别再用手去接要摔的椅子。"],
          ],
        },
        {
          id: "parting", scale: "medium", image: "art/03/good-chair.webp", mood: "quiet", view: "林雨所见",
          lines: [
            ["旁白", "另一把好椅子慢慢滚到阿岑脚边。他低头按住椅背，抬头的时候，林雨望着的地方已经空了。"],
            ["阿岑", "这把给我的？……谢了。你们那一局，要不要看看我拍到什么？"],
          ],
        },
        {
          id: "rewind", scale: "close", image: "art/03/report-view.webp", mood: "quiet", cue: "click",
          lines: [
            ["阿岑", "我倒回最后半分钟。你们看我手上这块小屏。"],
          ],
        },
        {
          id: "before", scale: "wide", image: "art/03/five-lean.webp", mood: "quiet", view: "机内回放",
          lines: [
            ["阿岑", "看，四副肩膀一起往前倾，正中那把椅子空着。"],
            ["林雨", "再往后一点。过弯第一个转过头的那儿。"],
          ],
        },
        {
          id: "after", scale: "wide", image: "art/03/five-coat.webp", mood: "quiet", view: "机内回放",
          lines: [
            ["旁白", "同一个机位，灰西服已经搭上椅背。四个朋友朝着它笑。阿岑把这几秒又放了一遍，画面里一直只有这四个人。"],
            ["半糖", "留给我们。别放频道。以后谁再不回消息，我们就拿这张盘去敲他家门。"],
          ],
        },
        {
          id: "burn", scale: "detail", image: "art/03/burn-disc.webp", mood: "relief",
          lines: [
            ["木头", "这是原来那张，我收回衣袋。这张空的给你。"],
            ["阿岑", "好，写完了。胖虎别捏亮的那一面。拿油笔写你的大名吧。"],
            ["胖虎", "谁还记得我的大名？写胖虎。日期就让欠钱的那位写。"],
          ],
        },
        {
          id: "pocket", scale: "medium", image: "art/03/takeaway-disc.webp", mood: "relief",
          lines: [
            ["半糖", "我放袋子最里头，再漏冰也淋不着。下周我早关半个钟，来喝茶。别背相机。"],
          ],
        },
        {
          id: "keep-original", scale: "close", image: "art/03/pocket-old.webp", mood: "quiet",
          lines: [
            ["林雨", "好。那天我也早点收工。"],
            ["老邓", "要是讲起网吧，你们可以放我的话。那天前台有四个孩子，等他到打烊。这句是我自己说的。"],
          ],
        },
        {
          id: "downstairs", scale: "wide", image: "art/03/exit-stairs.webp", mood: "quiet",
          lines: [
            ["旁白", "木头在胸前摸到了原来的盘。另一张在半糖的外卖袋里。沿铁梯下去，街角正好掀开蒸柜。粉叔端出了最后一屉肠粉。"],
            ["半糖", "下周这天，七点半。我关半扇卷闸，茶在门口喝。别又忙得把约忘了。"],
            ["林雨", "我把晚上空出来。胖虎要是先到，喊他给我留杯少糖的。"],
          ],
        },
      ],
    },
  ],
};
