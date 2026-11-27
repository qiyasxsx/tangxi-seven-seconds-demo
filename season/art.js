// Hold a shot until the next performed beat takes the camera, including after resume.
(() => {
  'use strict';
  const image = name => name.startsWith('@')
    ? '../first-take/art/' + name.slice(1) + '.webp'
    : 'art/' + name + '.webp';
  const shot = (at, name, actors = true) => ({at, bg: image(name), actors});
  const scene = (name, exit, shots = [], actors = true) => ({
    bg: image(name), exit, shots, actors,
  });

  const art = {
    'E00-S01': scene('@stop', [72,49]),
    'E00-S02': scene('@stop', [72,49]),
    'E00-S03': scene('@shop', [81,54]),
    'E00-S04': scene('bus-stop', [75,54]),
    'E01-S01': scene('@stop', [72,49]),
    'E01-S02': scene('freezer', [76,52]),
    'E01-S03': scene('@shopClosed', [74,52], [], false),
    'E01-S04': scene('rice-stall', [63,57]),
    'E01-S05': scene('freezer', [72,52]),
    'E02-S01': scene('zheng-front', [50, 63], [
      shot('E02-S01.b01', 'four-buns', false),
      shot('E02-S01.b05', 'zheng-front'),
      shot('E02-S01.b09', 'zheng-stairs'),
    ]),
    'E02-S02': scene('zheng-stairs', [56, 57], [
      shot('E02-S02.b02', 'zheng-dining'),
    ]),
    'E02-S03': scene('zheng-stairs', [63, 55], [
      shot('E02-S03.b03', 'zheng-front'),
      shot('E02-S03.b06', 'hardware-shop', false),
    ]),
    'E02-S04': scene('zheng-dining', [78, 51], [
      shot('E02-S04.b01~1', 'zheng-lock', false),
      shot('E02-S04.b06', 'zheng-dining'),
      shot('E02-S04.b11', 'zheng-lock'),
      shot('E02-S04.b13', 'zheng-lock', false),
    ]),
    'E02-S05': scene('zheng-front', [48, 58], [
      shot('E02-S05.b03', 'zheng-dining'),
      shot('E02-S05.b07', 'zheng-front'),
      shot('E02-S05.b08~1', '@playback', false),
    ]),
    'E03-S01': scene('cafe-stairs', [38, 50], [
      shot('E03-S01.b03', 'terminal-17'),
    ]),
    'E03-S02': scene('homework', [67, 53], [
      shot('E03-S02.b06', 'terminal-17'),
    ]),
    'E03-S03': scene('cobbler', [54, 58], [
      shot('E03-S03.b01', 'cafe-register', false),
      shot('E03-S03.b07', 'terminal-17'),
    ]),
    'E03-S04': scene('teashop', [84, 55], [
      shot('E03-S04.b10', 'cafe-stairs'),
    ]),
    'E03-S05': scene('five-chairs', [48, 55], [
      shot('E03-S05.b09~1', 'five-chairs', false),
    ]),
    'E04-S01': scene('chopsticks', [64, 52], [
      shot('E04-S01.b04', 'last-in-line', false),
      shot('E04-S01.b06', 'chopsticks'),
    ]),
    'E04-S02': scene('shed-meal', [67, 56], [
      shot('E04-S02.b03', 'bridge-meal', false),
      shot('E04-S02.b06', 'dock-meal', false),
    ], false),
    'E04-S03': scene('last-in-line', [58, 53], [
      shot('E04-S03.b05', 'chopsticks'),
      shot('E04-S03.b08', 'queue-double', false),
      shot('E04-S03.b11', 'chopsticks'),
    ], false),
    'E04-S04': scene('morning-ledger', [55, 55], [
      shot('E04-S04.b10', '@hallLit'),
    ]),
    'E05-S01': scene('rental-desk', [61, 52], [
      shot('E05-S01.b07', 'wet-workwear'),
    ]),
    'E05-S02': scene('wet-workwear', [68, 49], [
      shot('E05-S02.b06', 'delivery-windows', false),
    ]),
    'E05-S03': scene('delivery-windows', [72, 49], [
      shot('E05-S03.b08', 'wet-workwear', false),
    ], false),
    'E05-S04': scene('rental-desk', [22, 50]),
    'E05-S05': scene('morning-meal', [66, 54]),
    'E06-S01': scene('high-window', [52, 54]),
    'E06-S02': scene('cellar-glass', [56, 48], [
      shot('E06-S02.b03', 'cellar-glass'),
    ]),
    'E06-S03': scene('flood-landing', [63, 50], [
      shot('E06-S03.b04', 'cellar-glass', false),
      shot('E06-S03.b08', 'flood-cut-aliang', false),
    ]),
    'E06-S04': scene('gate-open', [73, 52], [
      shot('E06-S04.b01~0', 'flood-cut-key-pass', false),
      shot('E06-S04.b01~1', 'flood-cut-unlock', false),
      shot('E06-S04.b01~2', 'flood-cut-first-out', false),
      shot('E06-S04.b01~3', 'flood-cut-catch', false),
      shot('E06-S04.b02', 'flood-cut-first-out', false),
      shot('E06-S04.b03', 'flood-cut-aliang', false),
      shot('E06-S04.b04', 'flood-cut-fifth-bed', false),
      shot('E06-S04.b06~0', 'flood-cut-bucket', false),
      shot('E06-S04.b06~1', 'flood-cut-towel', false),
      shot('E06-S04.b11', 'dry-table', false),
    ]),
    'E07-S01': scene('old-shops', [53, 51]),
    'E07-S02': scene('cobbler', [62, 57]),
    'E07-S03': scene('tailor', [58, 53]),
    'E07-S04': scene('key-counter', [57, 55], [
      shot('E07-S04.b07', 'key-counter', false),
    ]),
    'E07-S05': scene('rice-stall', [61, 52]),
    'E08-S01': scene('outdoor-set', [56, 53]),
    'E08-S02': scene('audience', [65, 54], [
      shot('E08-S02.b07', 'witness-visitors', false),
    ]),
    'E08-S03': scene('outdoor-set', [57, 54]),
    'E08-S04': scene('witness-table', [50, 53], [
      shot('E08-S04.b08', 'audience', false),
    ]),
    'E08-S05': scene('after-show', [69, 56], [
      shot('E08-S05.b01~1', '@room'),
    ]),
    'E08-S06': scene('bus-leaving', [52, 52], [
      shot('E08-S06.b04~1', 'broadcast-cut-away-call', false),
    ]),
    'E08-S07': scene('archive-lamp', [56, 53]),
    'E08-S08': scene('new-kitchen', [56, 53], [
      shot('E08-S08.b01~1', 'new-kitchen'),
      shot('E08-S08.b02~0', '@shop'),
      shot('E08-S08.b02~1', 'new-kitchen'),
      shot('E08-S08.b04', 'microwave', false),
    ]),
  };

  window.SEASON_ART = art;
  window.TX_SEASON_ART = art;
})();
