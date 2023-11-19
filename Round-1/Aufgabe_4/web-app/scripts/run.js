// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

/**
 * Returns the combination of torches (on/off) as a list
 * @param {matrix} runField 
 * @param {int} m 
 * @returns {list} combination
 */
function getCombination(runField, m){
    var combination = [];
    for(var j = 0; j < m; j++)
        if(runField[0][j] != null)
            combination.push(runField[0][j].attrs.fill == "yellow");
    return combination;
}
/**
 * Sets the states of the given cell and the cell to the right
 * @param {int} i 
 * @param {int} j 
 * @param {int} val 
 * @param {matrix} states 
 * @param {matrix} runField 
 */
function setStates(i, j, val, states, runField){
    states[i][j] = val;
    states[i][j+1] = val;
    if(runField[i][j] != null) runField[i][j].attrs.fill = states[i-1][j] ? "yellow" : "white";
    if(runField[i][j+1] != null) runField[i][j+1].attrs.fill = states[i-1][j+1] ? "yellow" : "white";
}
/**
 * This function runs the given combination on the field
 * @param {list} combination 
 * @param {matrix} field 
 * @param {matrix} runField 
 * @param {int} n 
 * @param {int} m 
 * @param {matrix} states 
 */
function runCombination(combination, field, runField, n, m, states){
    // set states of first row (torches) to given combination //
    var cur = 0;
    for(var j = 0; j < m; j++){
        if(field[0][j].charAt(0) == "Q"){
            states[0][j] = combination[cur];
            cur++;
        }
    }
    // set states of blocks between torches and leds//
    for(var i = 1; i < n-1; i++){
        for(var j = 0; j < m; j++){
            if(field[i][j] == "W") setStates(i,j, !(states[i-1][j] && states[i-1][j+1]), states, runField);
            else if(field[i][j] == "B") setStates(i,j, (states[i-1][j] || states[i-1][j+1]), states, runField);
            else if(field[i][j] == "r") setStates(i,j, !states[i-1][j+1], states, runField);
            else if(field[i][j] == "R") setStates(i,j, !states[i-1][j], states, runField);
            else j--;
            j++;
        }
    }
    // set last row (leds) to yellow or white // 
    for(var j = 0; j < m; j++)
        if(runField[n-1][j] != null)
            runField[n-1][j].attrs.fill = states[n-2][j] ? "yellow" : "white";
}
/**
 * Main run function which gets called from build.js
 * @param {matrix} field 
 * @param {matrix} runField 
 * @param {int} n 
 * @param {int} m 
 */
function run(field, runField, n, m){
    // create states matrix //
    var states = new Array(n);
    for(var i = 0; i < n; i++){
        states[i] = new Array(m);
        for(var j = 0; j < m; j++) states[i][j] = false;
    }
    // get combination and run it //
    var combination = getCombination(runField, m);
    runCombination(combination, field, runField, n, m, states);
    // redraw stage //
    stage.batchDraw();
}
