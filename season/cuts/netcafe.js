(() => {
  'use strict';
  // Keep the four friends and station 17 spatially anchored; state changes use
  // only three return shots, then come back to this same desk.
  const master = {
    bg: 'art/retake-middle-netcafe-master-r2.webp', near: null, far: null,
    view: '', zone: 'cafe', pan: 0,
  };
  const loss = {
    bg: 'art/retake-middle-netcafe-loss-r2.webp', near: null, far: null,
    view: '结算桌面', zone: 'cafe', pan: 0,
  };
  const suit = {
    bg: 'art/neighbors-cut-chair-kick.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const jersey = {
    bg: 'art/retake-middle-netcafe-jersey-r2.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const suitChair = {
    bg: 'art/retake-middle-netcafe-suit-chair-r2.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const offerChair = {
    bg: 'art/retake-middle-netcafe-offer-chair-r2.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const disc = {
    bg: 'art/retake-middle-netcafe-disc.webp', near: null, far: null,
    view: '留给朋友', zone: 'cafe', pan: 0,
  };
  const card = {
    bg: 'art/cafe-cut-return-card.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const farewell = {
    bg: 'art/cafe-cut-chat.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const exit = {
    bg: 'art/cafe-stairs.webp', near: null, far: null,
    view: '', zone: 'hall', pan: 0,
  };
  // After b12, the grey suit is a physical proof on 17's empty armrest.
  // The private replay retains the four friends, never an anonymous empty room.
  const afterwards = {...suitChair};
  const recording = {...suitChair, view: '机内回放'};
  const counter = {...master, bg:'art/neighbors-cut-register.webp'};
  const cuts = window.SeasonCuts ||= {};
  Object.assign(cuts, {
    'E03-S05': master,
    'E03-S05.b01': master,
    'E03-S05.b02': master,
    'E03-S05.b03': master,
    'E03-S05.b04': master,
    'E03-S05.b05': suit,
    'E03-S05.b06': suit,
    'E03-S05.b07': suit,
    'E03-S05.b07.o1.f1': suit,
    'E03-S05.b07.o1.f2': master,
    'E03-S05.b07.o2.f1': master,
    'E03-S05.b07.o2.f2': suit,
    'E03-S05.b08': loss,
    'E03-S05.b09': jersey,
    'E03-S05.b10': jersey,
    'E03-S05.b11': card,
    // Stable paged beats: first page leaves the repaired 17 chair with its
    // suit; second page visibly slides Liang An's good chair into offer.
    'E03-S05.b12': suitChair,
    'E03-S05.b12~0': suitChair,
    'E03-S05.b12~1': offerChair,
    'E03-S05.b13': offerChair,
    'E03-S05.friends.1': loss,
    'E03-S05.friends.1~0': loss,
    'E03-S05.friends.1~1': recording,
    'E03-S05.b14': farewell,
    'E03-S05.b15': afterwards,
    'E03-S05.b16': afterwards,
    'E03-S05.b17': disc,
    'E03-S05.b18': afterwards,
    'E03-S05.b19': afterwards,
    'E03-S05.b20': afterwards,
    'E03-S05.b21': counter,
    'E03-S05.b22': counter,
    'E03-S05.b23': counter,
    'E03-S05.b24': exit,
  });
})();
