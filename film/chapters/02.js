window.FILM_CHAPTERS ||= [];
window.FILM_CHAPTERS[2] = {
  id: "E02", title: "第二章　卖不出去的阴宅",
  scenes: [
    {
      id: "E02-S01", title: "四个包", place: "郑家楼前", time: "4月4日 · 下午",
      shots: [
        {
          id: "alley", scale: "wide", image: "art/02/zheng-gate.webp", mood: "ordinary",
          lines: [
            ["旁白", "雨收了。阿琴捏着便利店小票，带两人拐过五金铺。巷尾只有这栋楼还贴着红色的售房纸。"],
            ["阿琴", "到了。电话是国强写的。你们过门去，他不让进就回来。"],
            ["林雨", "您不跟我们进？"],
            ["阿琴", "我跟他爸认识几十年。他跟我说不出口的，对你倒说得出。"],
          ],
        },
        {
          id: "notice", scale: "medium", image: "art/02/scrape-poster.webp", mood: "ordinary",
          lines: [
            ["郑国强", "看房？隔壁领钥匙。我今天只来铲广告。"],
            ["林雨", "我姓林，做《夜访》。阿琴说这儿贴过一张寻人启事。我们想看一眼，您愿意吗？"],
            ["郑国强", "找我爸那张？上头好几个电话，你拍出去，人家半夜也打来。"],
            ["郑国强", "我铲完这张跟你们说。你们先躲里头，檐口还在滴水。"],
          ],
        },
        {
          id: "pleat", scale: "detail", image: "art/02/four-buns.webp", mood: "ordinary", cue: "paper",
          lines: [
            ["旁白", "阿琴把今天新买的四个包交到林雨手上，三个一样大，最小那个顶上掐了一朵花。阿琴把它往袋底拨了拨。"],
            ["林雨", "三月店里的那只袋子已经空了。您今天又去买了四个？最小这个捏的什么？"],
            ["阿琴", "阿梅以前挑食，掐了花她就肯咬。陈年旧事，别拿这个去敲人家门。"],
            ["林雨", "那您收好小票。我认得怎么回去。"],
          ],
        },
        {
          id: "numbers", scale: "close", image: "art/02/notice-crop.webp", mood: "quiet",
          lines: [
            ["阿岑", "现在能看了吗？我先不开机。您指，哪一块能留？"],
            ["郑国强", "这两个字可以。电话框在外头。拍完翻过来我看。"],
            ["旁白", "阿岑把机位压到启事下沿。国强亲手在屏上比过边界，钥匙才从拳头里露出来。"],
            ["林雨", "楼里那盏灯是您留的？"],
            ["郑国强", "我自己怕摔。别写成我等人回来。"],
          ],
        },
        {
          id: "opening-gate", scale: "medium", image: "art/02/gate-turn.webp", mood: "ordinary",
          lines: [
            ["郑国强", "我来开。你们看着门角，别踩进水里。"],
            ["旁白", "国强这才把攥住的手松开，将楼口那把钥匙插进铁门。"],
          ],
        },
        {
          id: "threshold", scale: "wide", image: "art/02/stair-foot.webp", mood: "uneasy", cue: "door",
          lines: [
            ["郑国强", "地下杂物房漏水，别下。楼梯跟这张纸给你们十分钟，隔壁还有人等我开柜。"],
            ["阿岑", "十分钟我喊她出来。"],
            ["旁白", "铁门只开到够人侧身。阿琴站在巷里挥手。林雨踏上第一阶，怀里的纸袋忽然烫了起来。"],
          ],
        },
      ],
    },
    {
      id: "E02-S02", title: "一楼上面还是一楼", place: "郑家楼梯与饭厅", time: "4月4日 · 黄昏",
      shots: [
        {
          id: "first-flight", scale: "wide", image: "art/02/stair-foot.webp", mood: "uneasy",
          lines: [
            ["阿岑", "我上来过了。第二层门口怎么也写着一楼？"],
            ["林雨", "你刚绑的绕线带呢？"],
            ["阿岑", "你手边那根栏杆，朝楼底摸。我在底下等，听见三下就答三下。"],
          ],
        },
        {
          id: "rail", scale: "detail", image: "art/02/marked-rail.webp", mood: "uneasy",
          lines: [
            ["旁白", "绕带在她左手。她再走一趟，同样的位置摸到光木头。她退回扎带旁，掌心下多出一阵瓷勺碰碗的轻响。"],
            ["林雨", "别关灯。我看见一扇门。"],
            ["阿岑", "我这里看过去只有窗。你别替我扶，我站得住。"],
          ],
        },
        {
          id: "warm-table", scale: "wide", image: "art/02/supper-table.webp", mood: "quiet", view: "林雨所见",
          lines: [
            ["福顺伯", "一、二、三。哎，我明明洗了四双。"],
            ["旁白", "老人坐在长桌外侧，用手背碰碰汤碗，把矮凳往里推。三双短筷旁边，还摆着第四只碗。"],
          ],
        },
        {
          id: "reserve", scale: "medium", image: "art/02/far-family.webp", mood: "quiet", actors: ["hostBack", "fushun"], emotion: "open", view: "林雨所见",
          lines: [
            ["福顺伯", "那是阿梅的。她下班迟，你坐我这头。", "offer"],
            ["林雨", "您先坐着。我是楼下来拍楼梯的，不跟她抢。"],
          ],
        },
        {
          id: "soup", scale: "close", image: "art/02/soup-seat.webp", mood: "quiet", view: "林雨所见",
          lines: [
            ["林雨", "那个小包要放她碗里吗？"],
            ["福顺伯", "先放碟边。汤烫，她回来急着喝，嘴里就起泡。"],
            ["林雨", "国强叫我十分钟下去。您要我帮您喊谁？"],
            ["旁白", "他把碗往空位挪了半寸，像只听见碗碰桌面的声响。"],
          ],
        },
        {
          id: "far-door", scale: "medium", image: "art/02/coat-hook.webp", mood: "uneasy", view: "林雨所见",
          lines: [
            ["小梅", "你下去见到我哥，问他敢不敢自己回来坐一会儿。"],
            ["林雨", "你是阿梅？"],
          ],
        },
        {
          id: "ask-brother", scale: "medium", image: "art/02/far-family.webp", mood: "uneasy", actors: ["hostBack", "xiaomei"], emotion: "guard", view: "林雨所见",
          lines: [
            ["小梅", "你就问他肯不肯。我药袋都拿回来了，他回不回来，用不着你哄。", "firm"],
            ["福顺伯", "药钱你压碗底，我阳台那瓶开过封，别混了。"],
            ["小梅", "爸，那瓶早吃完了。"],
          ],
        },
        {
          id: "three-taps", scale: "close", image: "art/02/marked-rail.webp", mood: "quiet", cue: "click",
          lines: [
            ["林雨", "我只把话带下去。他不肯我也回来告诉你。"],
            ["旁白", "一只小板凳从桌底轻轻蹭到她脚边。林雨让过凳脚，隔着门槛敲了三下。"],
            ["阿岑", "听到了。出来一层，黑带子在这边。"],
          ],
        },
      ],
    },
    {
      id: "E02-S03", title: "长子的店", place: "五金铺与郑家楼梯", time: "4月4日 · 傍晚",
      shots: [
        {
          id: "shopfront", scale: "wide", image: "art/02/hardware-door.webp", mood: "ordinary",
          lines: [
            ["旁白", "五金铺卷闸落了一半。国强在里头数零钱，看见他们回来，没把闸拉到底。"],
            ["郑国强", "十分钟。没下去吧？"],
            ["阿岑", "你要看相机也行。铁门、楼梯、启事，就这些。"],
          ],
        },
        {
          id: "offer", scale: "medium", image: "art/02/hardware-desk.webp", mood: "uneasy", actors: ["hostBack", "guoqiang"], emotion: "guard",
          lines: [
            ["林雨", "阿梅叫我带话。不是叫你去见她。她问你肯不肯回来，在你爸面前坐一会儿。"],
            ["郑国强", "老二从楼梯上摔下来，老三在路口撞了石墩。她提没提这个？"],
            ["林雨", "没提。我也不晓得里面还有什么。您要不去，我就上去说您不同意。"],
            ["郑国强", "我上个月自己上去过。我爸问今晚该谁守着，我都没敢回他。"],
          ],
        },
        {
          id: "schoolbag", scale: "detail", image: "art/02/redkey-bag.webp", mood: "uneasy", cue: "key",
          lines: [
            ["旁白", "国强弯腰从桌下拖出工具袋。里头还有一只小学生的书包。红柄钥匙卡在线头里，他捏住钥匙柄，慢慢把线退下来。"],
          ],
        },
        {
          id: "key-shown", scale: "medium", image: "art/02/hardware-desk.webp", mood: "uneasy", actors: ["hostBack", "guoqiang"], poses: {"guoqiang": "revealKey"},
          lines: [
            ["郑国强", "这把才是地下室的。我去。门是我来开。得先给派出所打个电话，叫他们当面看。"],
            ["林雨", "要不要我们出去？"],
            ["郑国强", "你们别拍。地址我自己说。"],
          ],
        },
        {
          id: "telephone", scale: "close", image: "art/02/call-counter.webp", mood: "quiet",
          lines: [
            ["旁白", "阿岑合上镜头盖。国强报了地址，停了一下，才说他知道父亲最后住在哪一间。"],
            ["郑国强", "我有钥匙。我愿意开门。你们什么时候能到？"],
            ["阿岑", "我守楼梯这边。罗叔要认锁，也从外面看。"],
          ],
        },
        {
          id: "handoff", scale: "wide", image: "art/02/hardware-door.webp", mood: "quiet",
          lines: [
            ["郑国强", "锁在哪一面，开门的时候你们自己看。今晚我不营业了。"],
            ["林雨", "那张绕线带我给您留着。等会儿看见我还站上头，就敲扶手。"],
            ["旁白", "国强把手机倒扣在柜台。他拉下卷闸，钥匙单独揣在裤袋里，没有再往书包里塞。"],
          ],
        },
      ],
    },
    {
      id: "E02-S04", title: "门外的锁", place: "后楼地下室门槛", time: "4月4日 · 入夜",
      shots: [
        {
          id: "police", scale: "wide", image: "art/02/cellar-hall.webp", mood: "uneasy",
          lines: [
            ["旁白", "辖区民警赶到时，过道的灯已经亮了。国强把他们领到绿铁门前。阿岑留在楼梯口，把到场时间记在手机备忘录。"],
            ["林雨", "我们来找失踪的郑福顺。这间屋子是他儿子带我们来的。"],
            ["郑国强", "钥匙在我这儿。你们看着我开。"],
          ],
        },
        {
          id: "exterior-lock", scale: "detail", image: "art/02/outer-hasp.webp", mood: "uneasy", cue: "key",
          lines: [
            ["罗叔", "等一下。铰链在左，锁环在走廊这面。把它们拍在同一张里，回头才认得是哪扇门。"],
            ["林雨", "我站里面伸手，隔着整块门板。您能说明以前谁锁过吗？"],
            ["罗叔", "没亲眼见。我只认今天这一面。"],
          ],
        },
        {
          id: "unfinished", scale: "close", image: "art/02/care-ledger.webp", mood: "threat",
          lines: [
            ["旁白", "门里是一张矮床。水泥地上有一道鞋底蹭白的印，床脚压着空药板和旧照护簿。国强把皱起的簿角捏平。"],
            ["郑国强", "三十一天的月，我只填了三十天。你翻前三个月，都一样。"],
            ["林雨", "您在哪儿填的？"],
            ["郑国强", "店里。一口气填的。要问谁写的，问我。"],
          ],
        },
        {
          id: "daughter", scale: "medium", image: "art/02/table-argument.webp", mood: "uneasy", view: "林雨所见",
          lines: [
            ["旁白", "暖灯从门板上掠过去。林雨回头，饭厅里一只碗扣了底，另一把空椅自己往后蹭。福顺伯还在分包子。小梅手握在门环旁，那把红柄钥匙在她指间露出一点。"],
            ["小梅", "爸，他们都在。最大的那个，你又留给他？"],
            ["福顺伯", "他抢惯了。先拿走，别把你的压坏。"],
            ["小梅", "你从前也是这句。"],
            ["福顺伯", "包子我分。我没说过他们做的每一件事，我都替他们答。"],
          ],
        },
        {
          id: "admit", scale: "medium", image: "art/02/confession.webp", mood: "threat",
          lines: [
            ["旁白", "国强跪在门外，膝盖停在那道白印前。他张开手，掌心还留着钥匙压出的一道红痕。阿岑的相机一直收在包里。"],
            ["郑国强", "门是我锁的。卖楼的人逼我要个证明，说我爸没住这儿。我拿簿子给人看，又说他走丢了。"],
            ["郑国强", "我扣上锁的时候，知道他还在里头。"],
            ["林雨", "您愿不愿意朝过道，再跟民警说一遍？我只能说出我亲眼看见的。"],
            ["郑国强", "让我起来。我自己说。"],
          ],
        },
        {
          id: "exit", scale: "close", image: "art/02/dropped-key.webp", mood: "relief", cue: "key",
          lines: [
            ["旁白", "他扶墙站起，先托隔壁替他把店门拉到底，再向民警走过去。小梅一直攥着药袋的手终于松开，另一只手放下了红柄钥匙。钥匙落在门槛上，只响了一下。"],
            ["小梅", "路给你留着。他说的，你别替他擦掉。"],
            ["林雨", "我从这儿出去。阿岑，你还在吗？"],
            ["阿岑", "在。你脚底有一级。"],
          ],
        },
      ],
    },
    {
      id: "E02-S05", title: "有人还能作证", place: "302与郑家楼口", time: "4月5日—12日",
      shots: [
        {
          id: "binder", scale: "wide", image: "art/02/wait-stool.webp", mood: "ordinary",
          lines: [
            ["旁白", "第二天，国强敲开三〇二，把照护簿放到剪辑桌上，自己没脱鞋，靠着门坐下。"],
          ],
        },
        {
          id: "keep-private", scale: "medium", image: "art/02/seated-binder.webp", mood: "quiet",
          lines: [
            ["郑国强", "给办案的人核，可以。节目里别放。我不想再拿它骗人。"],
            ["林雨", "您收着。我另记一张纸，写几号见的您、您说了什么。"],
          ],
        },
        {
          id: "receipt", scale: "close", image: "art/02/return-binder.webp", mood: "quiet", cue: "paper",
          lines: [
            ["旁白", "林雨合上文件，把簿子推回桌边。国强拿走了它。"],
          ],
        },
        {
          id: "preliminary", scale: "detail", image: "art/02/interim-receipt.webp", mood: "quiet",
          lines: [
            ["旁白", "四月十二日家属送来收件回执，只借她在场看初检摘录。"],
            ["林雨", "“棉絮……鼠药诱饵碎屑。”我抄到这儿就行。"],
            ["阿岑", "死因那栏呢？"],
            ["林雨", "还在查。我能指给人看的，是门外那把锁。"],
          ],
        },
        {
          id: "food", scale: "wide", image: "art/02/zheng-gate.webp", mood: "quiet",
          lines: [
            ["旁白", "她又买了四个包，来到那扇铁门前。阿岑把机器留在楼下。这次没人来给她计时。"],
            ["林雨", "阿琴教我挑的。小的那个，掐了花。"],
          ],
        },
        {
          id: "shared-bowl", scale: "medium", image: "art/02/share-soup.webp", mood: "relief", view: "林雨所见",
          lines: [
            ["旁白", "饭厅只亮了一会儿。小梅揪掉大哥包子尖上的一撮面皮，腾出两只手接父亲端不住的汤。国强也伸出手，却只碰到门框。"],
            ["小梅", "别写他最后胃口好。他牙都松了，吃硬的疼。"],
            ["林雨", "那句我删掉。“他把包子放凉了。”这样可以吗？"],
            ["小梅", "瘦的。下回你还买，别拿错了。"],
          ],
        },
        {
          id: "phone", scale: "wide", image: "art/02/alley-night.webp", mood: "quiet",
          lines: [
            ["旁白", "门从里头合上。国强坐在台阶上，包子在手里，一口没动。林雨走回巷口，阿岑在接沈嘉的电话。"],
            ["沈嘉", "我这边正清旧栏目的授权，有一段是在星火网吧拍的。陈姐是原采访的人，你们方便的话，我给你们转过去。"],
            ["阿岑", "郑家的材料还在他们家。我们只问那段采访。"],
          ],
        },
        {
          id: "unknown-mouse", scale: "detail", image: "art/02/room302-tv.webp", mood: "uneasy", cue: "click",
          lines: [
            ["旁白", "回到三〇二，林雨把小票搁在桌角。旧电视是黑的，喇叭里传出一下轻响，像只鼠标撞着桌沿。"],
            ["林雨", "先等陈姐回电话。带子是她的，她点头才去听。"],
            ["阿岑", "沈嘉把我的电话留给她了。郑家的事咱先收在这儿，她要找我们，直接打来。"],
          ],
        },
      ],
    },
  ],
};
