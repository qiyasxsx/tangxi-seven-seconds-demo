/* Continuous beds follow the room. First-take can add a score and location
   recordings without loading them in the earlier passage cuts. */
(() => {
  const script = document.currentScript;
  const config = script.dataset;
  const dir = new URL("./sfx/", script.src).href;
  const fx = new Set(), beds = {};
  const gains = {
    road:    {rain:.38,  street:.22,  fan:0,   score:.31},
    outside: {rain:.47,  street:.07,  fan:0,   score:.27},
    hall:    {rain:.12,  street:.015, fan:0,   score:.32},
    room:    {rain:.055, street:0,    fan:0,   score:.22},
    shop:    {rain:.09,  street:.025, fan:.24, score:.26}
  };
  let started = false, muted = false, paused = false, zone = "road";
  let field = null, nextField = 0, streetTurn = 0;

  for (const name of ["rain", "street", "fan", ...(config.score ? ["score"] : [])]) {
    const audio = new Audio(name === "score" ? config.score : dir + name + ".m4a");
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "none";
    beds[name] = audio;
  }
  function play(audio, onFailure = () => {}) {
    const promise = audio.play();
    if (promise) promise.catch(onFailure);
  }
  function canSound() { return started && !muted && !paused && !document.hidden; }
  function clearActions() {
    for (const audio of fx) audio.pause();
    fx.clear();
  }
  function clearField() {
    if (field) field.pause();
    field = null;
  }
  function quiet() {
    for (const audio of Object.values(beds)) audio.pause();
    clearActions();
    clearField();
  }
  function planField(wait) { nextField = performance.now() + wait * 1000; }

  function playField(name) {
    if (!config.field || !canSound()) return;
    clearField();
    const audio = field = new Audio(config.field + name + ".m4a");
    audio.volume = name === "scan" ? .47 : name === "far-dog" ? .31 : zone === "road" ? .47 : .32;
    audio.onended = audio.onerror = () => { if (field === audio) field = null; };
    play(audio, audio.onerror);
    planField(name === "scan" ? 28 + Math.random() * 18 : 14 + Math.random() * 13);
  }
  function mix() {
    if (!canSound()) return;
    for (const [name,audio] of Object.entries(beds)) {
      const target = gains[zone][name];
      audio.volume = Math.abs(audio.volume - target) < .004 ? target :
        audio.volume + (target - audio.volume) * (name === "score" ? .10 : .17);
      if (target > 0 && audio.paused && !audio.error) play(audio);
      if (!target && !audio.volume && !audio.paused) audio.pause();
    }
    if (!config.field || field || performance.now() < nextField) return;
    if (zone === "shop") playField("scan");
    else if (zone === "road" || zone === "outside") {
      const cues = ["lane-talk", "far-dog", "market-call"];
      playField(cues[streetTurn++ % cues.length]);
    }
  }
  setInterval(mix, 100);
  document.addEventListener("visibilitychange", () => { if (document.hidden) quiet(); });

  window.passageSound = {
    start() {
      started = true; paused = false;
      planField(3.4); mix();
    },
    mute(value) {
      muted = value;
      if (value) quiet(); else { planField(4); mix(); }
    },
    pause(value) {
      paused = value;
      if (value) quiet(); else { planField(3.4); mix(); }
    },
    zone(name) {
      if (!gains[name] || name === zone) return;
      if (config.field) { clearField(); clearActions(); }
      zone = name;
      planField(name === "shop" ? 3.2 : 4.4);
      mix();
    },
    review(name) { clearActions(); this.play(name); },
    play(name) {
      if (!canSound()) return;
      if (name === "scan") { if (zone === "shop") playField(name); return; }
      const foot = config.footsteps && (name === "step1" || name === "step2");
      const file = name === "iron-three" && config.iron ? config.iron :
        (foot ? config.footsteps : dir) + name + (name.endsWith("-lid") ? ".wav" : ".m4a");
      const audio = new Audio(file);
      audio.volume = foot ? .24 : name === "tv-noise" ? .19 : .55;
      fx.add(audio);
      audio.onended = audio.onerror = () => fx.delete(audio);
      play(audio, audio.onerror);
    }
  };
})();
