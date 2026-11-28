// Conversation retakes.  Load after cuts/* and before direction.js.
//
// These replace only ordinary, standing replies whose old painted figures no
// longer match the approved cast.  A shared empty plate keeps the location,
// while the runtime rigs carry the current clothes, eyelines and depth.
(() => {
  'use strict';
  const cuts = window.SeasonCuts;
  const season = globalThis.TX_SEASON;
  if (!cuts || !season) return;

  const sourceIds = new Set();
  for (const scene of Object.values(season.scenes)) {
    for (const beat of scene.beats) {
      sourceIds.add(beat.id);
      for (const option of beat.options || []) {
        sourceIds.add(option.id);
        for (const feedback of option.feedback || []) sourceIds.add(feedback.id);
      }
    }
  }

  function interview(ids, frame) {
    for (const id of ids) {
      if (!sourceIds.has(id)) throw new Error('Unknown screenplay beat: ' + id);
      const sceneId = id.slice(0, id.indexOf('.'));
      if (!cuts[sceneId]) throw new Error('Missing scene cut: ' + sceneId);
      // Some authored lines deliberately have no earlier cut.  Start from the
      // scene master in that case, rather than silently dropping the retake.
      const next = {...cuts[sceneId], ...(cuts[id] || {}), actors: true, view: '', pan: 0, ...frame};
      delete next.layers;
      cuts[id] = next;
    }
  }

  // E02: the green shutter is one uninterrupted talk, not a succession of
  // incompatible full-figure drawings.  The tool shop remains in the frame.
  interview(['E02-S03.b02', 'E02-S03.b03', 'E02-S03.b04', 'E02-S03.b05', 'E02-S03.b06'], {
    bg: 'art/hardware-shop.webp', near: 'linBackListen', far: 'guoqiang',
  });

  // E04: ordinary counter talk stays at the same full empty stall.  The later
  // offer of a seat, the food, and Xiaoyin sitting down remain authored cuts.
  interview(['E04-S01.b03', 'E04-S01.b04'], {
    bg: 'art/rice-stall.webp', near: 'linBackListen', far: 'cook',
    actors: true, view: '', pan: 0,
  });
  interview(['E04-S01.b06', 'E04-S01.b07', 'E04-S01.b08'], {
    bg: 'art/rice-stall.webp', near: 'linBackListen', far: 'cook',
    actors: true, view: '', pan: 0,
  });

  // E05: the empty 302 desk lets Lin answer on camera; A-cen's reply remains
  // off camera, rather than inventing a new on-screen portrait for him.
  interview(['E05-S01.b05', 'E05-S01.b06', 'E05-S01.no-fill'], {
    bg: 'art/rental-desk.webp', near: 'linFrontListen', far: null,
    actors: true, view: '', pan: 0,
  });

  // E06: the prospective tenant and Lin first meet at the real rear-building
  // window.  The flooded stair, the hand-off, and the opened gate stay intact.
  interview(['E06-S01.meet-at-door', 'E06-S01.night-bed', 'E06-S01.deposit'], {
    bg: 'art/high-window.webp', near: 'linBackListen', far: 'azhe',
    actors: true, view: '', pan: 0,
  });

  // E07: each small shop gets its own empty counter and the person who owns
  // it.  The shoe inspection and the clothing alteration return to their
  // action inserts immediately after these replies.
  interview(['E07-S01.b02', 'E07-S01.b03', 'E07-S01.b04'], {
    bg: 'approaches/shop-row.webp', near: 'linBackListen', far: 'chenbo',
    actors: true, view: '', pan: 0,
  });
  interview(['E07-S03.b04', 'E07-S03.b05'], {
    bg: 'art/tailor.webp', near: 'linBackListen', far: 'huang',
    actors: true, view: '', pan: 0,
  });

  // E08: retain the separate witness statements as a true two-person setup.
  // The contract hand-off, private copies, screen playback and Xiaoyin's stop
  // remain their existing action/screen cuts.
  interview(['E08-S04.b05'], {
    bg: 'art/broadcast-cut-lower-camera-r2.webp', near: 'linBackListen', far: 'azhe',
    actors: true, view: '', pan: 0,
  });
  interview(['E08-S04.b06'], {
    bg: 'art/broadcast-cut-lower-camera-r2.webp', near: 'linBackListen', far: 'luo',
    actors: true, view: '', pan: 0,
  });

  // E02: Guoqiang brings the care ledger to 302, then Lin walks back to the
  // Zheng lane before Shen Jia's phone call.  The room and the lane cannot
  // share one standing-at-the-door picture.
  interview(['E02-S05.b01', 'E02-S05.keeper', 'E02-S05.b02', 'E02-S05.return-binder'], {
    bg: 'art/neighbors-cut-room-ledger-r2.webp', near: null, far: null,
    actors: false, view: '', pan: 0, zone: 'room', place: '三〇二 · 剪辑桌',
  });
  interview(['E02-S05.b12', 'E02-S05.b13'], {
    bg: 'art/zheng-front.webp', near: 'linBackListen', far: null,
    actors: true, view: '', pan: 0, zone: 'road', place: '郑家 · 巷口',
  });
  interview(['E02-S05.back-at-twelve'], {
    bg: '../first-take/art/landingView.webp', near: null, far: null,
    actors: false, view: '', pan: 0, zone: 'hall', place: '三〇二 · 门口',
  });

  // E03: follow the witnesses in the order of the actual investigation.
  // The old tape is a single playback beat, not a wallpaper behind the tea
  // shop, Lao Deng, Chenbo, Huang Yi, or Chen Jie.
  interview(['E03-S03.b02'], {
    bg: 'art/teashop.webp', near: null, far: null,
    actors: false, view: '', pan: 0, zone: 'road', place: '茶饮铺 · 铁梯旁',
  });
  interview(['E03-S03.b03', 'E03-S03.b04', 'E03-S03.b05'], {
    bg: 'approaches/cafe-counter.webp', near: 'linBackListen', far: 'laodeng',
    actors: true, view: '', pan: 0, zone: 'cafe', place: '星火网吧 · 旧前台',
  });
  interview(['E03-S03.turn-to-stalls'], {
    bg: 'approaches/shop-row.webp', near: null, far: null,
    actors: false, view: '', pan: 0, zone: 'road', place: '老生意街 · 三家铺前',
  });
  interview(['E03-S03.b06', 'E03-S03.b07'], {
    bg: 'approaches/shop-row.webp', near: 'linBackListen', far: 'chenbo',
    actors: true, view: '', pan: 0, zone: 'road', place: '老生意街 · 修鞋档',
  });
  interview(['E03-S03.b08', 'E03-S03.b09', 'E03-S03.b10'], {
    bg: 'art/tailor.webp', near: 'linBackListen', far: 'huang',
    actors: true, view: '', pan: 0, zone: 'room', place: '黄姨 · 改衣铺',
  });
  interview(['E03-S03.meet-editor'], {
    bg: 'art/tailor.webp', near: 'linBackListen', far: 'chenjie',
    actors: true, view: '', pan: 0, zone: 'room', place: '黄姨 · 铺后小桌',
  });
  interview(['E03-S03.b11.o1.f1', 'E03-S03.b11.o2.f1'], {
    bg: 'art/cafe-register.webp', near: null, far: null,
    actors: false, view: '', pan: 0, zone: 'cafe', place: '星火网吧 · 旧前台',
  });
  interview(['E03-S03.b12', 'E03-S03.b14', 'E03-S03.b15', 'E03-S03.b16', 'E03-S03.b17'], {
    bg: 'art/tailor.webp', near: 'linBackListen', far: 'chenjie',
    actors: true, view: '', pan: 0, zone: 'room', place: '黄姨 · 铺后小桌',
  });
  interview(['E03-S03.b13'], {
    bg: 'art/neighbors-cut-interview.webp', near: null, far: null,
    actors: false, view: '旧带回放', pan: 0, zone: 'room', place: '黄姨 · 铺后小桌',
  });
  interview(['E03-S03.b18', 'E03-S03.b19'], {
    bg: 'art/tailor.webp', near: 'linBackListen', far: 'huang',
    actors: true, view: '', pan: 0, zone: 'room', place: '黄姨 · 铺后小桌',
  });

  // E07: use a full workshop plate for the ordinary exchange; the later key
  // and drawer inserts retain their close, object-scale action framing.
  interview(['E07-S04.b02', 'E07-S04.b03'], {
    bg: 'approaches/key-workshop.webp', near: 'linBackListen', far: 'luo',
    actors: true, view: '', pan: 0, zone: 'room', place: '旧柜档 · 柜台外',
  });

  // These are action inserts, not interviews: the fifth player's round stays
  // on the old monitor, and the first descent shows a dry, empty glass room.
  interview(['E03-S05.first-round', 'E03-S05.old-call', 'E03-S05.fifth-button',
    'E03-S05.last-round', 'E03-S05.last-minute'], {
    bg: 'approaches/game-round.webp', near: null, far: null,
    actors: false, view: '十七号机屏幕', pan: 0,
  });
  interview(['E06-S02.water-entry', 'E06-S02.water-first', 'E06-S02.water-answer'], {
    bg: 'approaches/room-glass.webp', near: null, far: null,
    actors: false, view: '', pan: 0,
  });
})();
