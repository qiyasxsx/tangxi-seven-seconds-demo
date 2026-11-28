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
    cafe:    {rain:.04,  street:0,    fan:.18, score:.16},
    room:    {rain:.055, street:0,    fan:0,   score:.22},
    shop:    {rain:.09,  street:.025, fan:.24, score:.26}
  };
  let started = false, muted = false, paused = false, zone = "road";
  let field = null, nextField = 0, streetTurn = 0, fieldAllowed = true;

  // The location beds say where the reader is.  This small, original WebAudio
  // score says what has changed there.  It deliberately has no rendered music
  // file: the motifs are assembled from plain oscillators so the mobile page
  // stays light and the score has an unambiguous project-owned source.
  let context = null, scoreTimer = 0, scoreStep = 0, scoreState = "street";
  let scoreFade = 0;
  const score = {
    street:    { notes:[50,57,62,57],       pulse:0,    space:1.25, gain:.030, wave:"sine" },
    threshold: { notes:[50,56,57,62],       pulse:43,   space:1.12, gain:.036, wave:"triangle" },
    room:      { notes:[45,52,57,51],       pulse:0,    space:1.45, gain:.027, wave:"sine" },
    witness:   { notes:[50,57,62,65],       pulse:45,   space:1.05, gain:.039, wave:"triangle" },
    night:     { notes:[43,50,55,57],       pulse:38,   space:1.18, gain:.034, wave:"triangle" },
    water:     { notes:[38,45,50,52],       pulse:33,   space:1.02, gain:.042, wave:"sine" },
    consent:   { notes:[50,57,62,66],       pulse:0,    space:1.34, gain:.029, wave:"sine" },
    broadcast: { notes:[45,52,57,64],       pulse:40,   space:1.08, gain:.041, wave:"triangle" },
    after:     { notes:[50,57,62,69],       pulse:0,    space:1.62, gain:.024, wave:"sine" },
    silence:   { notes:[],                  pulse:0,    space:1,    gain:0,    wave:"sine" }
  };
  const note = (hz, when, length, gain, wave) => {
    if (!context || gain <= 0) return;
    const oscillator = context.createOscillator(), envelope = context.createGain();
    oscillator.type = wave; oscillator.frequency.setValueAtTime(440 * Math.pow(2, (hz - 69) / 12), when);
    envelope.gain.setValueAtTime(.0001, when);
    envelope.gain.exponentialRampToValueAtTime(gain, when + .07);
    envelope.gain.exponentialRampToValueAtTime(.0001, when + length);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(when); oscillator.stop(when + length + .04);
  };
  function ensureScore() {
    if (context || !canSound()) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    context = new AudioContext();
    context.resume().catch(() => {});
  }
  function scheduleScore() {
    if (!context || !canSound() || scoreTimer || scoreState === "silence") return;
    const plan = score[scoreState] || score.street;
    const play = () => {
      if (!context || !canSound() || scoreState === "silence") { scoreTimer = 0; return; }
      const current = score[scoreState] || score.street, at = context.currentTime + .035;
      const index = scoreStep++ % current.notes.length;
      note(current.notes[index], at, current.space * .72, current.gain * scoreFade, current.wave);
      if (current.pulse && scoreStep % 2 === 0) note(current.pulse, at + .09, .18, current.gain * .52 * scoreFade, "sine");
      scoreTimer = window.setTimeout(play, current.space * 1000);
    };
    play();
  }
  function scoreQuiet() {
    if (scoreTimer) window.clearTimeout(scoreTimer);
    scoreTimer = 0;
    if (context && context.state === "running") context.suspend().catch(() => {});
  }
  function scoreResume() {
    ensureScore();
    if (context && context.state !== "running") context.resume().then(scheduleScore).catch(() => {});
    else scheduleScore();
  }
  function story(scene, line) {
    const sceneId = scene?.id || "", text = line?.text || "", id = line?.id || "";
    // This line closes the public broadcast before the delayed third strike.
    // Keep it explicit instead of depending on the displayed-page text, which
    // can be a partial caption while the reader advances.
    if (id === "E08-S05.b01") {
      if (scoreState !== "silence") { scoreState="silence";scoreStep=0;scoreFade=0;scoreQuiet();beds.score.volume=0;beds.score.pause(); }
      return;
    }
    let target = sceneId.startsWith("E00") ? "street" : sceneId.startsWith("E01") ? "threshold" :
      sceneId.startsWith("E02") ? "witness" : sceneId.startsWith("E03") ? "night" :
      sceneId.startsWith("E04") ? "consent" : sceneId.startsWith("E05") ? "room" :
      sceneId.startsWith("E06") ? "water" : sceneId.startsWith("E07") ? "consent" :
      sceneId.startsWith("E08") ? "broadcast" : "street";
    // Each override is a story beat, not a keyword-driven jump: it opens a
    // quiet space for an irreversible turn, then releases into the chapter's
    // next state. Page splits may hold that state for as long as the reader needs.
    if (/E01-S02\.b0[3-6]|E01-S03\.b0[1-7]/.test(id)) target = "threshold";
    if (/E01-S04\.b(?:0[7-9]|1[01])|E01-S05/.test(id)) target = "after";
    if (/E02-S02\.b(?:0[5-9]|1[0-4])|E02-S03\.b0[3-6]/.test(id)) target = "room";
    if (/E03-S05\.b0[6-9]|E04-S03/.test(id)) target = "silence";
    if (/E05-S02|E05-S03/.test(id)) target = "night";
    if (/E06-S03\.b0[3-8]|E06-S04\.b0[1-6]/.test(id)) target = "water";
    if (/E07-S05|E08-S0[1-4]/.test(id)) target = "broadcast";
    if (/E08-S05|E08-S0[6-8]/.test(id)) target = "after";
    if (/E08-S05\.b01/.test(id) || /第三声来得很迟|四个活人|水里的手全指着同一扇门/.test(text)) target = "silence";
    // Ordinary reading must continue the motif.  The former time-window
    // reset made a slow reader hear every 7.5s as a fresh cue; only a real
    // narrative state change is allowed to restart the phrase.
    if (target === scoreState) return;
    scoreState = target; scoreStep = 0; scoreFade = target === "silence" ? 0 : 1;
    scoreQuiet();
    // Silence is a narrative state, not merely a quieter WebAudio layer.  The
    // legacy recorded bed has no authored tail for these beats, so remove it
    // at the same transition rather than waiting for the next mixer tick.
    if (target === "silence") { beds.score.volume = 0; beds.score.pause(); }
    else mix();
    if (canSound()) scoreResume();
  }

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
    scoreQuiet();
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
    scoreResume();
    for (const [name,audio] of Object.entries(beds)) {
      const target = name === "score" && scoreState === "silence" ? 0 : gains[zone][name];
      audio.volume = Math.abs(audio.volume - target) < .004 ? target :
        audio.volume + (target - audio.volume) * (name === "score" ? (scoreState === "silence" ? .35 : .10) : .17);
      if (target > 0 && audio.paused && !audio.error) play(audio);
      if (!target && !audio.volume && !audio.paused) audio.pause();
    }
    if (!config.field || !fieldAllowed || field || performance.now() < nextField) return;
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
      planField(3.4); mix(); scoreResume();
    },
    mute(value) {
      muted = value;
      if (value) quiet(); else { planField(4); mix(); scoreResume(); }
    },
    pause(value) {
      paused = value;
      if (value) quiet(); else { planField(3.4); mix(); scoreResume(); }
    },
    fieldAllowed(value) {
      if (fieldAllowed === value) return;
      fieldAllowed = value;
      if (value) planField(5);
      else clearField();
    },
    zone(name) {
      if (!gains[name] || name === zone) return;
      if (config.field) { clearField(); clearActions(); }
      zone = name;
      planField(name === "shop" ? 3.2 : 4.4);
      mix();
    },
    story,
    // Read-only diagnostic for browser regression; never drives gameplay.
    state(){ return scoreState; },
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
