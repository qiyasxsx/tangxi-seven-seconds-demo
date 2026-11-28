// Poses are complete cutouts. Specific props such as the revealed key or the
// unbuttoned suit belong to the named action and must follow that story beat.
(() => {
  'use strict';
  const url = file => 'cast/' + file + '.webp';
  function actor(name, file, poses = {}, framing = 'full') {
    return {
      name, main: url(file), framing,
      faces: Object.fromEntries(Object.entries(poses).map(([cue, image]) => [cue, url(image)])),
    };
  }
  const cast = {
    host: actor('林雨', 'host', {
      open: 'host-welcome', welcome: 'host-welcome', listen: 'host-listen',
      worry: 'host-worry', guard: 'host-listen', firm: 'host-firm', ease: 'host',
    }),
    hostBack: actor('林雨', 'hostBack', {wide: 'host-back-full'}, 'shoulder'),
    acen: actor('阿岑', 'acen', {listen: 'acen-listen', worry: 'acen-listen'}),
    qin: actor('阿琴', 'qin', {guard: 'qin-guard', stop: 'qin-guard'}),
    xu: actor('老许', 'xu', {recall: 'xu-recall', listen: 'xu-recall'}),
    xiaoyin: actor('小茵', 'xiaoyin', {firm: 'xiaoyin-firm', showPhone: 'xiaoyin-firm'}),
    granny: actor('张婆婆', 'granny', {shelter: 'granny-shelter'}),
    guoqiang: actor('郑国强', 'guoqiang', {admit: 'guoqiang-admit', revealKey: 'guoqiang-admit'}),
    xiaomei: actor('小梅', 'xiaomei', {angry: 'xiaomei-angry', firm: 'xiaomei-angry'}),
    fushun: actor('福顺伯', 'fushun', {offer: 'fushun-offer'}),
    liang: actor('梁安', 'liang', {rest: 'liang-rest', removeJacket: 'liang-rest'}),
    cook: actor('粉叔', 'cook', {offer: 'cook-offer'}),
    deng: actor('老邓', 'deng', {recall: 'deng-recall', showLedger: 'deng-recall'}),
    huan: actor('黄姨', 'huan', {return: 'huan-return'}),
    azhe: actor('阿哲', 'azhe', {hold: 'azhe-hold', reach: 'azhe-hold'}),
    luo: actor('罗叔', 'luo', {check: 'luo-check', offerBlank: 'luo-check'}),
    zhou: actor('周铭', 'zhou', {insist: 'zhou-insist', offerContract: 'zhou-insist'}),
    vendor: actor('陈伯', 'vendor', {listen: 'vendor-hear', hear: 'vendor-hear'}),
    aliang: actor('阿良', 'aliang', {listen: 'aliang-listen', tap: 'aliang-listen'}),
    chenjie: actor('陈姐', 'chenjie'), shenjia: actor('沈嘉', 'shenjia'),
    panghu: actor('胖虎', 'panghu'), bantang: actor('半糖', 'bantang'),
    mutou: actor('木头', 'mutou'), guowan: actor('过弯', 'guowan'),
    customer: actor('改衣的姑娘', 'customer'), worker: actor('工人', 'worker'),
    driver: actor('代驾', 'driver'), girl: actor('卸货门女孩', 'girl'),
  };
  cast.chenbo = cast.vendor;
  cast.huang = cast.huan;
  window.FILM_CAST = cast;
})();
