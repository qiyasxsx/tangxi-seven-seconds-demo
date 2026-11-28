window.FILM_CHAPTERS ||= [];
window.FILM_CHAPTERS[7] = {
  id: "E07", title: "第七章　老生意街·三把钥匙",
  scenes: [
    {
      id: "E07-S01", title: "只歇星期二", place: "老生意街三家铺前", time: "6月18日 · 下午",
      shots: [
        {
          id: "three-shops", scale: "wide", image: "art/07/shop-row-wide.webp", mood: "ordinary",
          lines: [
            ["旁白", "上回离开二〇一，罗叔托林雨顺路看看修鞋的老陈。她前两趟都吃了闭门羹。今天你和她走到桥头，卷闸终于开到一半，里头有人在收复诊单子。"],
            ["林雨", "陈伯，您坐着。罗叔问您膝盖怎么样。我上礼拜还以为您不做了。"],
            ["陈伯", "做啊。上午看腿，下午才开。有时候我女儿硬拉我走，你来早了就见不着。"],
          ],
        },
        {
          id: "right-shoe", scale: "medium", image: "art/07/shop-row-wide.webp", mood: "ordinary", actors: ["hostBack", "vendor"], emotion: "open",
          lines: [
            ["陈伯", "她说我一天挣的，不够打车看腿。昨天我给人装鞋，差点装了两只右脚。"],
            ["阿岑", "您女儿给您算亏的，您偏往赚的算。哎，这箱我帮您抬到哪儿？"],
            ["陈伯", "先找左边那只。腿好不好走，脚底下试了才知道。"],
          ],
        },
        {
          id: "tuesday-slip", scale: "detail", image: "art/07/work-hours.webp", mood: "quiet", cue: "paper",
          lines: [
            ["旁白", "陈伯把营业牌翻成“半天”。黄姨那边压着两袋没取的裤脚，罗叔周二要去女儿家带娃。三张时间表排了一回，偏偏周二下午哪一扇都不开。"],
            ["林雨", "要不周二我来坐半天？"],
            ["阿岑", "你七月还住这儿吗？还得少接半天活。咱回去算了车钱，再跟人定日子。"],
            ["林雨", "好。今天我只帮忙认袋，别先写我名字。"],
          ],
        },
        {
          id: "bad-link", scale: "close", image: "art/07/bad-link.webp", mood: "uneasy", cue: "click",
          lines: [
            ["来取衣的人", "这张图盖着你们《夜访》的名字。我扫进来，它说四十三号是生门，叫我问主人住哪儿。"],
            ["阿岑", "别替它转。让我看一眼短链从哪儿跳的……星环试投。我记下链接和今天的时间。"],
          ],
        },
        {
          id: "foreign-print", scale: "close", image: "art/07/tailor-withdraw-detail.webp", mood: "quiet",
          lines: [
            ["黄姨", "那张街景照给我瞧瞧。你们要问怎么收裤脚，我能讲一天。问客人住哪儿，我这儿没有。"],
            ["林雨", "我给沈嘉留个话，问原图从谁那里出去。陈伯，眼前三只袋子搁哪个柜？"],
            ["陈伯", "有鞋印的给我。黄姨那堆颜色接近，你别端一筐全往我这儿倒。"],
          ],
        },
      ],
    },
    {
      id: "E07-S02", title: "左脚走过的路", place: "陈伯修鞋档", time: "6月18日 · 黄昏",
      shots: [
        {
          id: "shoe-stall", scale: "medium", image: "art/07/cobbler-stool-medium.webp", mood: "ordinary",
          lines: [
            ["等鞋的骑手", "快收工了，我回来拿鞋。上回鞋跟一歪，踩电动车脚撑都站不住。"],
            ["陈伯", "两只都拿过去。先坐着试，后跟顶不顶脚，说完再付钱。"],
          ],
        },
        {
          id: "long-street", scale: "wide", image: "art/07/shoe-memory.webp", mood: "uneasy", view: "林雨所见",
          lines: [
            ["旁白", "你还在柜外帮忙垫歪凳。林雨提起另一只旧鞋袋，老电视的反光里，那条街忽然拖得很长。前头有个人提着工具袋，每走一步，左脚都悬着半边。"],
            ["林雨", "陈伯，往桥那头去的那个人，您看得见吗？"],
            ["陈伯", "我只听见一轻一重两声。上回给他垫鞋，内侧有根旧钉。你翻左脚。"],
          ],
        },
        {
          id: "insole-patch", scale: "detail", image: "art/07/cobbler-sole-detail.webp", mood: "quiet", cue: "iron",
          lines: [
            ["旁白", "陈伯把旧鞋翻过来，沿着线脚摸到左边。补片削去一角，恰好给那处旧伤让空。鞋底边上还有一个三角形的铅笔记号。"],
            ["林雨", "四十三号袋以前换过绳。这个三角，你还认得？"],
            ["陈伯", "认得。是他的左脚，我补完让他来试，他没能走回来。你把鞋放凳边。"],
          ],
        },
        {
          id: "stool-level", scale: "medium", image: "art/07/rider-fits.webp", mood: "relief",
          lines: [
            ["旁白", "林雨放下那只鞋，电视里的路缩回街面。柜台前的骑手正把自己的脚往新补的鞋里送，手指沿着后跟压了一圈，站起来走了两步。"],
            ["等鞋的骑手", "这回能踩实了。您也坐，您这张凳今天可算不晃。"],
            ["阿岑", "底下那块纸是我垫的。您给他收钱，我把这根线头捡了。"],
            ["林雨", "旧鞋袋我挂回这一钩。两双的事我分开记。"],
          ],
        },
      ],
    },
    {
      id: "E07-S03", title: "把原来的边留着", place: "黄姨改衣铺", time: "6月18日 · 入夜",
      shots: [
        {
          id: "tailor-room", scale: "wide", image: "art/07/tailor-interior.webp", mood: "ordinary",
          lines: [
            ["旁白", "修鞋档的灯熄了，隔壁缝纫机还响着。姑娘在帘后换好牛仔裤。你把镜头朝下，留在门外；林雨一个人进店。"],
            ["黄姨", "你先穿着，走到镜前。我得看你坐下以后，裤脚提到哪儿。"],
          ],
        },
        {
          id: "try-on", scale: "medium", image: "art/07/tailor-try-on-medium.webp", mood: "ordinary", view: "林雨在铺里",
          lines: [
            ["来改衣的姑娘", "就短这么点。下面这圈边跟了我好多年，剪掉可就没了。"],
            ["黄姨", "原边留着，从上头收。来，膝盖弯一下，我在这儿画一道。"],
          ],
        },
        {
          id: "mirror-tags", scale: "medium", image: "art/07/tag-mirror.webp", mood: "uneasy", view: "林雨所见",
          lines: [
            ["旁白", "裁衣镜比试衣镜窄一截。林雨从它前面过去，镜里自己的领口多了几层旧布。“懂事”“肯熬夜”的布条压在下面，再底下才是她的摄影证。"],
            ["林雨", "黄姨，这里也能拆吗？一偏头就勒。"],
            ["黄姨", "你摸摸是哪一道。拆掉那针还有原来的布，不用整件扔。"],
          ],
        },
        {
          id: "loosen-stitch", scale: "detail", image: "art/07/loosen-collar.webp", mood: "quiet", view: "林雨所见", cue: "iron",
          lines: [
            ["旁白", "她从里襟挑开一针。布条一张张滑落，最旧那张是妈妈从前替她取衣服留的票。她把票收进口袋，终于能松松地转一下脖子。"],
          ],
        },
        {
          id: "delete-photo", scale: "close", image: "art/07/delete-photo.webp", mood: "quiet", view: "林雨在铺里", cue: "click",
          lines: [
            ["来改衣的姑娘", "裤脚原来我答应你拍，刚走到门口才想起来，我妈看一眼补花就知道是我。别留那张了，行吗？"],
            ["林雨", "你看，我把手机上这唯一一张删掉。刚才签的页也还你。明天你只管来取裤子。"],
          ],
        },
        {
          id: "street-takeout", scale: "medium", image: "art/07/street-takeout.webp", mood: "quiet", view: "林雨在铺里",
          lines: [
            ["来改衣的姑娘", "还是下午那个钟点？"],
            ["黄姨", "四点往后。押金在我这儿，不在电视台。裤子给你照常改。"],
          ],
        },
      ],
    },
    {
      id: "E07-S04", title: "无齿的钥匙", place: "罗叔钥匙档", time: "6月19日 · 傍晚",
      shots: [
        {
          id: "key-workshop", scale: "wide", image: "art/07/key-shop-wide.webp", mood: "ordinary",
          lines: [
            ["旁白", "第二天，罗叔让你们把一壶水看着。头一位客人亮出网上存的门牌照，要他照着配钥匙。罗叔把机器关着，按自己登记本里的号码打回去。"],
            ["罗叔", "本人说没托人来。这门我帮不了你开。照片就收回去吧。"],
          ],
        },
        {
          id: "call-back", scale: "medium", image: "art/07/key-call-medium.webp", mood: "ordinary",
          lines: [
            ["来领柜的店主", "我自己来了。跟我发的是同一张照片，您总认得我吧？"],
            ["罗叔", "认得。水快开了，你坐会儿。我还打回你登记的那个号。"],
            ["林雨", "是熟人也等这一通？"],
            ["罗叔", "越熟越等得起。你看，他自己口袋已经响了。"],
          ],
        },
        {
          id: "three-boxes", scale: "medium", image: "art/07/key-guidance-medium.webp", mood: "quiet",
          lines: [
            ["来领柜的店主", "是我。您电话里问的取件号，我当面再写给您看一次。"],
          ],
        },
        {
          id: "order-boxes", scale: "detail", image: "art/07/public-hours.webp", mood: "quiet", cue: "paper",
          lines: [
            ["旁白", "罗叔看完才给他领东西。鞋袋回陈伯的格，衣袋回黄姨的格，领用页锁进罗叔自己的抽屉。你站在柜外，纸上那排号码没朝镜头摊开。"],
          ],
        },
        {
          id: "hours-only", scale: "medium", image: "art/07/key-shop-wide.webp", mood: "quiet", actors: ["hostBack", "luo"], emotion: "guard",
          lines: [
            ["林雨", "公开那张只写几点开、到哪家柜台、本人怎么核对。客人真的号码放抽屉。这样够人走一趟吗？"],
            ["罗叔", "够。能找到柜台就够。回到谁家去了，不关下一个来领东西的事。"],
          ],
        },
        {
          id: "blank-key", scale: "detail", image: "art/07/key-blank-detail.webp", mood: "quiet", cue: "key",
          lines: [
            ["罗叔", "你替我跑了这几趟。柜档以后可以借，这片是坯，还没开齿。真要管，要能腾出四个周二。不值那天，柜子就照旧挂着。"],
            ["林雨", "今天先别配齿。我跟阿岑算过，八月的四个周二下午。我先试这一个月，其他时间我没法答应。"],
          ],
        },
        {
          id: "four-weeks", scale: "detail", image: "art/07/key-four-weeks-detail.webp", mood: "quiet", cue: "paper",
          lines: [
            ["旁白", "她数出纸上的四个空格，给无齿坯穿回红绳。罗叔把红绳从板钩上解下来，交到她手里。等她能定下几点来，再到柜台换那把真的。"],
            ["罗叔", "四回就写四回。到期还想来，咱再摊一次这张纸。"],
            ["林雨", "我只管取件、回电和登记。哪天临时有外景，我自己先打电话，别让人白等。"],
          ],
        },
        {
          id: "old-photo", scale: "close", image: "art/07/rain-mail.webp", mood: "uneasy", cue: "click",
          lines: [
            ["沈嘉的来电", "试投邮件找到了。星环来问我的排期，出镜人写的是你。你点开附件，看巷口那块雨棚。"],
            ["林雨", "那一帧我认得。是我早年的雨巷片，我自己挂上去的。你把原邮件留着，我自己去问周铭。"],
          ],
        },
      ],
    },
    {
      id: "E07-S05", title: "谁来点灯", place: "粉摊蓝棚、三〇二剪辑桌", time: "6月20日至7月初",
      shots: [
        {
          id: "terms-table", scale: "wide", image: "art/07/stall-terms-wide.webp", mood: "ordinary",
          lines: [
            ["旁白", "短链撤了。周铭先在电话里告诉你们这件事，没撤的是“七月十八日·今宵剧场”的档期。你把合同和算过两遍的开销带到粉叔那张桌前。"],
            ["粉叔", "棚你们用，先给我留一张吃饭的桌子。今宵是以前唱露天戏的叫法，锅不能让你们拿去搭台。"],
          ],
        },
        {
          id: "terms-close", scale: "detail", image: "art/07/terms-budget.webp", mood: "quiet", cue: "paper",
          lines: [
            ["周铭的消息", "签约有首页和保底，片子交我排。不签你们自己播，带宽和器材都自己扛。十八号上午给我句准话。"],
            ["阿岑", "我也想不用每月去借镜头。可这笔钱一收，最后那一下，是谁按？"],
            ["林雨", "先听小茵说她要把哪一截放出来，再算钱。"],
          ],
        },
        {
          id: "xiaoyin-cut", scale: "medium", image: "art/07/stall-xiaoyin-medium.webp", mood: "quiet",
          lines: [
            ["小茵", "骂过琴姐的那些人，我也想让他们听一回。只播门轴响的那截；到哪儿停，我自己拖。"],
            ["林雨", "哪一路都由你自己播这段。要签给他们，明天他们单剪一个卷闸，我撤不回来。"],
            ["小茵", "那你把十八号那一格给我。我只画我的线，要不要讲别的，到时我自己说。"],
          ],
        },
        {
          id: "borrowed-shed", scale: "medium", image: "art/07/two-circles.webp", mood: "quiet",
          lines: [
            ["阿岑", "五月那两刀，我们在项目群里署过名。仓管今天回我，柜档最多看两条时码。"],
            ["林雨", "就留那两个数和咱们的署名。她姓什么、去接谁，都别往外抄。"],
          ],
        },
        {
          id: "cursor", scale: "medium", image: "art/07/edit-alone.webp", mood: "quiet",
          lines: [
            ["旁白", "七月初，林雨回到三〇二，把门轴以前的三秒又放了一次。你听见那轻轻的一响，光标就在小茵选的地方停住了。"],
            ["阿岑", "三秒够。剩下要不要往后播，给她自己按吧。"],
          ],
        },
        {
          id: "calendar-line", scale: "detail", image: "art/07/july-tv.webp", mood: "quiet",
          lines: [
            ["旁白", "小茵选的那一天圈在纸上，旁边写着“十八日，自己号”。林雨把屋租续到二十七号，把水杯往里推开一寸。旧电视里只映出一张空凳。"],
          ],
        },
      ],
    },
  ],
};
