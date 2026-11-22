/* Keep the game in one 16:9 coordinate space. Rotating the frame, rather
   than its scene layers, preserves hotspot, caption and dialog geometry. */
(() => {
  "use strict";
  const viewport=document.getElementById("viewport");
  const screen=document.getElementById("screen");
  const frame=document.getElementById("gameFrame");
  function fit() {
    const width=viewport.clientWidth,height=viewport.clientHeight;
    if(!width || !height)return;
    const rotated=height>width;
    const availableWidth=rotated?height:width,availableHeight=rotated?width:height;
    const fittedWidth=Math.min(availableWidth,availableHeight*16/9);
    const virtualWidth=Math.max(960,Math.ceil(fittedWidth/16)*16);
    viewport.dataset.rotated=String(rotated);
    screen.style.width=fittedWidth+"px";
    screen.style.height=fittedWidth*9/16+"px";
    frame.style.width=virtualWidth+"px";
    frame.style.height=virtualWidth*9/16+"px";
    frame.style.transform="scale("+fittedWidth/virtualWidth+")";
  }
  fit();
  new ResizeObserver(fit).observe(viewport);
  window.visualViewport?.addEventListener("resize",fit);
  frame.src="game.html"+location.search+location.hash;
})();
