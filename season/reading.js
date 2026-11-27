// Each number selects the author's next action in the continuous edition.
// Only the five marked actions wait for an explicit touch.
window.TX_READING = {
  route: {
    'E00-S01.b08': 1, 'E00-S02.b07': 1, 'E00-S03.b05': 0, 'E00-S04.b02': 1,
    'E01-S02.b02': 0, 'E01-S03.b03': 1,
    'E02-S02.b04': 1, 'E02-S03.b10': 0, 'E02-S04.b05': 0,
    'E03-S02.b05': 1, 'E03-S03.b11': 1, 'E03-S05.b07': 0,
    'E04-S02.b03': 0, 'E04-S03.b05': 0,
    'E05-S02.b04': 1, 'E05-S03.b02': 1, 'E05-S04.b06': 0,
    'E06-S02.b04': 1, 'E06-S03.b05': 0, 'E06-S04.b09': 1,
    'E07-S02.b03': 0, 'E07-S03.b06': 0, 'E07-S04.b05': 1,
    'E07-S04.b07': 0, 'E07-S05.note': 0,
    'E08-S03.b05': 1, 'E08-S04.b03': 0, 'E08-S05.b05': 1,
  },
  stops: {
    'E00-S01.b08': 1, 'E01-S03.b03': 1, 'E03-S05.b07': 0,
    'E06-S03.b05': 0, 'E08-S04.b03': 0,
  },
  labels: {
    'E00-S01.b08': '翻回女孩发来的原片',
    'E01-S03.b03': '把手机的光照向门槛',
    'E03-S05.b07': '把梁安的话带给队友',
    'E06-S03.b05': '拉住他，问箱子里装了什么',
    'E08-S04.b03': '把播放键交给小茵',
  },
};
