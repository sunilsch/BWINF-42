// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

// get width and height //
var width = window.innerWidth;
var height = window.innerHeight;

// create stage
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
  draggable: true,
});

// add a layer for the shapes
var layer = new Konva.Layer();
stage.add(layer);

// values for block debugging //
var WIDTH = 3000;
var HEIGHT = 3000;

// block size //
var blockSize = 50;

/**
 * Checks if the given rectangles intersect
 * @param {konva-rectangle} r1 
 * @param {konva-rectangle} r2 
 * @returns {boolean} true if the rectangles intersect
 */
function haveIntersection(r1, r2) {
  return !(
    r2.x > r1.x + r1.width-5 ||
    r2.x + r2.width-5 < r1.x ||
    r2.y > r1.y + r1.height-5 ||
    r2.y + r2.height-5 < r1.y
  );
}

/**
 * Returns the position of the given value in the grid
 * @param {int} r 
 * @returns 
 */
function getPosition(r){
  return Math.round(r / blockSize) * blockSize;
}

/**
 * Checks if the given group intersects with any other group of the given types
 * @param {konva-group-object} group 
 * @param {string} ownType 
 * @param {string} otherType1 
 * @param {string} otherType2 
 * @param {*} first 
 * @returns {boolean} true if the group intersects with any other group of the given types
 */
function checkIntesection(group, ownType, otherType1, otherType2, first=false){
  console.log("Check intersection")
  var destroyed = false;
  stage.find("."+ownType).forEach((guideItem) => {
    if(guideItem == group) return;
    else {
      if(guideItem.x() == group.x() && guideItem.y() == group.y() || (ownType == 'block' && guideItem.x() == group.x() && (guideItem.y() == group.y()+50 || guideItem.y() == group.y()-50))){
        if(!first) group.destroy();
        destroyed = true;
      }
    }
  });
  stage.find("."+otherType1).forEach((guideItem) => {
    if (haveIntersection(group.getClientRect(), guideItem.getClientRect())) {
      if(!first) group.destroy();
      destroyed = true;
    }
  });
  stage.find("."+otherType2).forEach((guideItem) => {
    if (haveIntersection(group.getClientRect(), guideItem.getClientRect())) {
      if(!first) group.destroy();
      destroyed = true;
    }
  });
  return destroyed;
}

/**
 * Generates a wedge for a block at the given position at the top or bottom
 * @param {boolean} up 
 * @returns 
 */
function generateWedgeForBlock(up){
  return new Konva.Wedge({
    x: 1,
    y: (up ? 25 : 75),
    radius: 15,
    angle: 180,
    fill: 'white',
    stroke: 'black',
    rotation: -90
  });
}

/**
 * Generates a block at the given position
 * @param {string} color 
 * @param {boolean} redup 
 * @param {int} x 
 * @param {int} y 
 * @returns 
 */
function generateBlock(color, redup = null,x=WIDTH*Math.random(),y=HEIGHT* Math.random()){
  if(color == 'red' && redup == null){
    console.log('redup is null for red block');
    return;
  }
  var group = new Konva.Group({
    x: getPosition(x),
    y: getPosition(y),
    draggable: true,
    name: "block"
  });
  var box = new Konva.Rect({
    x: 0,
    y: 0,
    width: 50,
    height: 100,
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: 0, y: 100 },
    fillLinearGradientColorStops: [0, color, 0.5, 'gray', 1, color],
    stroke: 'black',
  });
  group.add(box);
  var wedge = generateWedgeForBlock((color == 'red' ? redup : true));
  group.add(wedge);
  if(color != 'red'){
    var wedge2 = generateWedgeForBlock(false);
    group.add(wedge2);
  }
  group.on('dragend', (e) => {
    group.position({
      x: getPosition(group.x()),
      y: getPosition(group.y())
    });
    checkIntesection(group,"block","torch","led");
  });
  if(checkIntesection(group,"block","torch","led",true)) return;
  layer.add(group);
}

/**
 * Generates a torch at the given position
 * @param {int} x 
 * @param {int} y 
 * @returns void
 */
function generateTorch(x=WIDTH*Math.random(),y=HEIGHT* Math.random()){
  var group = new Konva.Group({
    x: getPosition(x)-20,
    y: getPosition(y)+15,
    draggable: true,
    name: "torch"
  });
  var rec = new Konva.Rect({
    x: 0,
    y: 0,
    width: 30,
    height: 20,
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: 0, y: 20 },
    fillLinearGradientColorStops: [0, 'lightblue', 0.5, 'white', 1, 'lightblue'],
    stroke: 'black',
  });
  var trapeze = new Konva.Line({
    points: [30, 0, 50, -10, 50, 30, 30, 20],
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    closed: true,
  });
  group.add(trapeze)
  group.add(rec);
  group.on('dragend', (e) => {
    group.position({
      x: getPosition(group.x())-20,
      y: getPosition(group.y())+15
    });
    checkIntesection(group,"torch","block","led");
  });
  if(checkIntesection(group,"torch","block","led",true)) return;
  layer.add(group);
}

/**
 * Generates a led at the given position
 * @param {int} x 
 * @param {int} y 
 * @returns void
 */
function generateLED(x=WIDTH*Math.random(),y=HEIGHT* Math.random()){
  var group = new Konva.Group({
    x: getPosition(x),
    y: getPosition(y),
    draggable: true,
    name: "led"
  });
  var rec = new Konva.Rect({
    x: 0,
    y: 0,
    width: 20,
    height: 50,
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: 0, y: 50 },
    fillLinearGradientColorStops: [0, 'lightblue', 0.5, 'white', 1, 'lightblue'],
    stroke: 'black',
  });
  var wedege = new Konva.Wedge({
    x: 20,
    y: 25,
    radius: 15,
    angle: 180,
    fill: 'white',
    rotation: -90
  });
  group.add(wedege);
  group.add(rec);
  group.on('dragend', (e) => {
    group.position({
      x: getPosition(group.x()),
      y: getPosition(group.y())
    });
    checkIntesection(group,"led","block","torch");
  });
  if(checkIntesection(group,"led","block","torch",true)) return;
  layer.add(group);
}

/*
* KEY DOWN EVENTS
* 1: white block
* 2: red block with sensor up
* 3: red block with sensor down
* 4: blue block
* 5: torch
* 6: led
*/
window.addEventListener('keydown', function (e) {
  var pos = stage.getRelativePointerPosition();
  if(e.target.nodeName == "INPUT") return;
  if (e.keyCode == 49) generateBlock('white',false,pos.x,pos.y);
  else if(e.keyCode == 50) generateBlock('red',true,pos.x,pos.y);
  else if(e.keyCode == 51) generateBlock('red',false,pos.x,pos.y);
  else if(e.keyCode == 52) generateBlock('blue',false,pos.x,pos.y);
  else if(e.keyCode == 53) generateTorch(pos.x,pos.y);
  else if(e.keyCode == 54) generateLED(pos.x,pos.y);
});

stage.on("click", function(e){
  if(e.target == stage) return;
  if(e.target.parent.attrs.name == "torch")
      e.target.parent.getChildren()[0].attrs.fill = (e.target.parent.getChildren()[0].attrs.fill == "yellow") ? "white" : "yellow";
  stage.find(".led").forEach((led) => {
    led.getChildren()[0].attrs.fill = "white";
  });
  stage.find(".block").forEach((block) => {
    block.getChildren()[1].attrs.fill = "white";
    try {block.getChildren()[2].attrs.fill = "white";} catch(e){};
  });
  stage.batchDraw();
});


function help(){
  var string = `
    - Press 1 to add a white block
    - Press 2 to add a red block with sensor up
    - Press 3 to add a red block with sensor down
    - Press 4 to add a blue block
    - Press 5 to add a torch
    - Press 6 to add a led
    - Click on a torch to change its color
    - First torch (Q1) is at the bottom and last torch (Qn) is at the top
    - First led (L1) is at the bottom and last led (Ln) is at the top
    - So the construction is turned by 90° (clockwise when downloading the construction from canvas and counterclockwise when uploading the construction to canvas)
  
  `;
  alert(string);
}