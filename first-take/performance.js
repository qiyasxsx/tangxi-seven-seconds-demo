/* Expressions are held drawings. Breathing belongs to the registered body
   and continues through listening and waiting for a decision. */
(() => {
  const stage = document.getElementById("stage");
  function mount(base) {
    const rig = document.createElement("div"), body = document.createElement("div");
    rig.className = "actorRig";
    body.className = "idleBody";
    body.append(base);
    rig.append(body);
    for (const [emotion,patch] of Object.entries(window.TAKE_CAST_PLATES.faces[base.dataset.pose] || {})) {
      const layer = document.createElement("span"), [x,y,w,h] = patch.rect;
      layer.className = "facialPatch "+emotion;
      Object.assign(layer.style,{left:x*100+"%",top:y*100+"%",width:w*100+"%",height:h*100+"%",
        backgroundImage:'url("'+patch.file+'")'});
      body.append(layer);
    }
    rig.dataset.expression = "rest";
    return rig;
  }
  function express(side,emotion) {
    const rig = side && document.querySelector("#"+side+"Actor .actorRig");
    if (rig) rig.dataset.expression = emotion || "rest";
  }
  function suspend() {
    stage.dataset.paused = String(document.hidden || document.getElementById("overlay").open);
  }
  document.addEventListener("visibilitychange",suspend);
  new MutationObserver(suspend).observe(document.getElementById("overlay"),{attributes:true,attributeFilter:["open"]});
  window.TAKE_PERFORMANCE = {mount,express};
})();
