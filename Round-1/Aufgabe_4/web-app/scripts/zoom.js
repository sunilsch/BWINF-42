// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

var scaleBy = 1.1;
stage.on('wheel', (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    // determine new scale
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();
    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) direction = -direction;
    
    // 
    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  });