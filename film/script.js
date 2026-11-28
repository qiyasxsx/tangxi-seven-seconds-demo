'use strict';
window.FILM_CHAPTERS = [];
window.FilmScript = {
  // The invitation ends on the reader's handoff. The following page shows the result.
  actions: {
    'E00-S01/original': {label:'翻到夜访发出的那份'},
    'E01-S03/answer': {label:'照亮门外的落脚处'},
    'E03-S05/relay': {line:1, label:'把少算的五毛传给过弯'},
    'E06-S02/dry-platform': {label:'熄掉手电，看清水线'},
    'E08-S04/now-visible': {label:'把播放键交给小茵'}
  },
  scene(id, title, place, time, shots) { return {id, title, place, time, shots}; },
  shot(id, scale, image, mood, lines, direction = {}) {
    return {id, scale, image, mood, lines, ...direction};
  }
};
