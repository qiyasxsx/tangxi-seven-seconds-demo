(() => {
  'use strict';
  // Keep the four friends and station 17 spatially anchored; state changes use
  // only three return shots, then come back to this same desk.
  const master = {
    bg: 'art/retake-middle-netcafe-master.webp', near: null, far: null,
    view: '', zone: 'cafe', pan: 0,
  };
  const loss = {
    bg: 'art/retake-middle-netcafe-loss.webp', near: null, far: null,
    view: '结算桌面', zone: 'cafe', pan: 0,
  };
  const suit = {
    bg: 'art/neighbors-cut-chair-kick.webp', near: null, far: null,
    view: '林雨所见', zone: 'cafe', pan: 0,
  };
  const jersey = {
    bg: 'art/retake-middle-netcafe-jersey.webp', near: null, far: null,
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
  const chair = {
    bg: 'art/cafe-cut-offer-chair.webp', near: null, far: null,
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
  const afterwards = {...master, bg:'art/retake-middle-netcafe-playback.webp'};
  const recording = {...afterwards, view: '机内回放'};
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
    'E03-S05.b12': chair,
    'E03-S05.b13': chair,
    'E03-S05.friends.1': recording,
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
