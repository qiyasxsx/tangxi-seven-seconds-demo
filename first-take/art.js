/* Coordinates are measured on the new plates. Head is the top-centre of the
   skull, faceHeight the measured distance from crown to chin in the sprite. */
(() => {
  const image = (name,x=.5,y=.5) => ({file:"art/"+name+".webp",anchor:[x,y]});
  const hostFront={file:"art/linFrontListen.webp",head:[0.49325626,0.00338219],eye:[0.49518304,0.20744081],faceHeight:0.32018038,remote:[0.13102119,0.46448703]};
  const hostShoulder={file:"art/linBackListen.webp",head:[0.48266667,0.00415512],eye:[0.48533333,0.20498615],faceHeight:0.31717452};
  window.TAKE_ART = {
    plates:{
      stop:image("stop",.63),shop:image("shop",.64),shopClosed:image("shopClosed",.64),building:image("building",.64),
      hall:image("hall",.59),stairs:image("stairs",.42),corridor:image("corridor",.64),room:image("room",.52)
    },
    // Horizontal ink limits in 24 slices, in percent of the uncropped sprite.
    // Premeasured from alpha so the offline reader can also avoid hands and hair.
    silhouettes:{
      ...window.TAKE_CAST_PLATES?.silhouettes,
      linFrontListen:[33,60,26,68,23,73,20,74,20,76,19,76,19,74,1,73,0,74,0,85,2,90,4,92,8,94,8,96,7,99,8,100,10,100,16,100,14,97,13,95,13,98,13,100,12,100,12,95],
      linBackListen:[30,59,24,66,20,70,18,71,18,71,18,69,24,65,25,69,24,75,12,87,9,89,7,91,6,92,5,94,3,95,3,95,3,96,2,99,3,100,4,99,1,97,0,96,0,97,6,96],
    },
    poses:{
      ...window.TAKE_CAST_PLATES?.poses,
      linNeutral:hostFront,linListen:hostFront,linFront:hostFront,linFrontListen:hostFront,
      linBack:hostShoulder,linBackListen:hostShoulder
    },
    inserts:{
      clip:image("clip",.69,.48),side:image("side",.62,.49),
      aimLow:image("aimLow",.55,.65),offer:image("offer",.49,.54),plug:image("plug",.49,.64),
      tv:image("tv",.66,.48),tvFade:image("tv",.66,.48),playback:image("playback",.66,.48),
      landingView:image("landingView",.54,.53),roomView:image("roomView",.68,.44)
    }
  };
})();
