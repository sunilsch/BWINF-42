// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

/**
 * Check if the list is empty and alert if it is
 * @param {list} list 
 * @param {string} name 
 * @returns {boolean} true if the list is empty
 */
function checkEmpty(list, name){
    if(list.length == 0){
        alert("no "+name+" found!");
        return true;
    }
    return false;
}

/**
 * Get all elements with the given name and return a list of them
 * @param {string} name 
 * @returns {list} list of elements
 */
function getAll(name){
    var list = [];
    stage.find("."+name).forEach((item) => {
        list.push([item.x(), item.y(), item])
    });
    return list;
}

/**
 * Check if the x coordinate of the list is the same and if it is equal to the given xValue
 * @param {list} list 
 * @param {string} name 
 * @param {int} xValue 
 * @returns {boolean} true if the x coordinate is not the same or if it is not equal to the given xValue
 */
function checkXValue(list, name, xValue){
    if(list[0][0] != xValue){
        alert(name+" x coordinates are wrong!");
        return true;
    }
    for(var i = 1; i < list.length; i++){
        if(list[i][0] != xValue){
            alert(name+" x coordinates are not equal!, please check your connections");
            return true;
        }
    }
    return false;
}

/**
 * Check if the y coordinate of the list is too low or too high
 * @param {list} list 
 * @param {string} name 
 * @param {int} minY 
 * @param {int} maxY 
 * @returns {boolean} true if the y coordinate is too low or too high
 */
function checkYValue(list, name, minY, maxY){
    for(var i = 0; i < list.length; i++){
        if(list[i][1] < minY){
            alert(name+ " y coordinate is too low");
            return true;
        } else if(list[i][1] > maxY){
            alert(name+" y coordinate is too high");
            return true;
        }
    }
}

/**
 * Builds the text for the download
 * @returns {string} text
 */
function getText(){
    var text = "";
    text+=m+" "+n;
    text+="\r\n";
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++){
            if(j == m-1)
                text+=matrix[i][j];
            else
                text+=(matrix[i][j].padEnd(3));
        }
        text+="\r\n";
    }
    return text;
}

/**
 * Checks the given connections and prepares running or downloading
 * @param {boolean} run
 * @returns 
 */
function build(runit){
    // get all torches //
    var torches = getAll("torch");
    var leds = getAll("led");
    
    // get all blocks //
    var blocks = [];
    stage.find(".block").forEach((block) => {
        console.log(block);
        var color = block.getChildren()[0].attrs.fillLinearGradientColorStops[1];
        if(color == "red") color = (block.getChildren()[1].attrs.y == 25) ? "redUp" : "redDown";
        blocks.push([block.x(), block.y(), color, block]);
    });

    // sort by y coordinate reversed //
    torches.sort((a,b) => a[1] - b[1]).reverse();
    leds.sort((a,b) => a[1] - b[1]).reverse();


    // check if there are any torches, leds or blocks //
    if(checkEmpty(torches, "torches")) return false;
    if(checkEmpty(leds, "leds")) return false;
    if(checkEmpty(blocks, "blocks")) return false;

    // sort by x coordinate //
    blocks.sort((a,b) => a[0] - b[0]);
    var minX = blocks[0][0];
    var maxX = blocks[blocks.length-1][0];

    // sort by y coordinate //
    blocks.sort((a,b) => a[1] - b[1]); 
    var minY = blocks[0][1];
    var maxY = blocks[blocks.length-1][1];

    // get n and m
    var n = ((maxX - minX) / 50)+3;
    var m = ((maxY - minY) / 50)+2;
    
    // check if torches have the same and correct x coordinate //
    if(checkXValue(torches, "torches", minX-70)) return false;
    if(checkXValue(leds, "leds", maxX+50)) return false;
    if(checkYValue(torches, "torch", minY, maxY+100)) return false;
    if(checkYValue(leds, "led", minY, maxY+50)) return false;

    // build matrix and runMatrix //
    var matrix = [];
    var runMatrix = [];
    for(var i = 0; i < n; i++){
        matrix.push([]);
        runMatrix.push([]);
        for(var j = 0; j < m; j++){
            matrix[i].push("X");
            runMatrix[i].push(null);
        }
    }
    for(var i = 0; i < torches.length; i++){
        var y = torches[i][1]-15;
        matrix[0][((maxY-y)/50)+1] = "Q"+(i+1);
        runMatrix[0][((maxY-y)/50)+1] = torches[i][2].getChildren()[0];
    }
    for(var i = 0; i < leds.length; i++){
        var y = leds[i][1];
        matrix[matrix.length-1][((maxY-y)/50)+1] = "L"+(i+1);
        runMatrix[matrix.length-1][((maxY-y)/50)+1] = leds[i][2].getChildren()[0];
    }
    for(var i = 0; i < blocks.length; i++){
        var x = ((blocks[i][0]-minX)/50)+1;
        var y = (maxY-blocks[i][1])/50;
        var color = blocks[i][2];
        if(color == "white"){
            matrix[x][y] = "W";
            matrix[x][y+1] = "W";
            runMatrix[x][y] = blocks[i][3].getChildren()[2];
            runMatrix[x][y+1] = blocks[i][3].getChildren()[1];
        } else if(color == "blue"){
            matrix[x][y] = "B";
            matrix[x][y+1] = "B";
            runMatrix[x][y] = blocks[i][3].getChildren()[2];
            runMatrix[x][y+1] = blocks[i][3].getChildren()[1];
        } else if(color == "redUp"){
            matrix[x][y] = "r";
            matrix[x][y+1] = "R";
            runMatrix[x][y+1] = blocks[i][3].getChildren()[1];
        } else if(color == "redDown"){
            matrix[x][y] = "R";
            matrix[x][y+1] = "r";
            runMatrix[x][y] = blocks[i][3].getChildren()[1];
        }
    }

    // run or download //
    if(runit) run(matrix, runMatrix, n, m);
    else download(getText());
}