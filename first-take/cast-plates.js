// Landmark points and overlay rectangles are fractions of the uncropped display plate.
// Each silhouette has 24 horizontal bands with left/right ink limits in percent.
// Neutral mouths are painted into the base. Emotional changes use held patches.
window.TAKE_CAST_PLATES = {
  poses: {
    qinStanding: {"file":"art/qinStanding.webp","size":[451,1525],"head":[0.49889135,0.00721311],"eye":[0.49667406,0.11803279],"faceHeight":0.17770492,"chin":[0.49889135,0.18491803],"mouth":[0.49889135,0.15934426],"foot":[0.46895787,0.99213115],"soles":[[0.25720621,0.99213115],[0.68070953,0.99213115]]},
    xuStanding: {"file":"art/xuStanding.webp","size":[509,1525],"head":[0.45972495,0.0104918],"eye":[0.46365422,0.09704918],"faceHeight":0.15278689,"chin":[0.47151277,0.16327869],"mouth":[0.47151277,0.13901639],"foot":[0.48624755,0.99180328],"soles":[[0.23968566,0.99213115],[0.73280943,0.99147541]]}
  },
  silhouettes: {
    qinStanding: [27,69,18,82,17,83,17,81,30,71,12,89,8,93,5,94,3,98,3,99,3,98,5,95,3,97,1,98,3,97,7,94,6,96,5,96,11,85,12,83,14,81,16,79,16,77,16,78],
    xuStanding: [27,64,25,67,26,67,31,63,20,82,11,89,7,93,2,98,1,99,6,94,6,94,7,93,8,93,7,94,11,92,13,80,19,79,20,78,19,78,19,78,20,78,20,77,16,82,14,84]
  },
  faces: {
    qinStanding: {brow:{file:"art/qinStandingBrow.webp",rect:[0.35254989,0.09180328,0.28603104,0.03540984]}},
    xuStanding: {brow:{file:"art/xuStandingBrow.webp",rect:[0.33005894,0.07016393,0.24165029,0.03409836]}},
    linFrontListen: {
      welcome:{file:"art/linFrontListenWelcome.webp",rect:[0.35067437,0.13979707,0.30057803,0.16798196]},
      curious:{file:"art/linFrontListenCurious.webp",rect:[0.35067437,0.13979707,0.30057803,0.16798196]},
      brow:{file:"art/linFrontListenBrow.webp",rect:[0.35067437,0.13979707,0.30057803,0.16798196]},
      firm:{file:"art/linFrontListenFirm.webp",rect:[0.35067437,0.13979707,0.30057803,0.16798196]}
    }
  }
};
