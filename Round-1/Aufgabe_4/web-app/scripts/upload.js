// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

/**
 * Handles the upload of a file
 * @param {event object} evt 
 */
function handleFileSelect(evt) {
    // get file //
    let file = evt.target.files;
    let f = file[0];
    let reader = new FileReader();
    // read file //
    reader.readAsText(f);
    reader.onload = function() {
        // check if canvas is empty //
        if(layer.getChildren().length > 0){
            alert("Please reset or clear the canvas before uploading a new file");
            return;
        }
        // split file into lines and words //
        var split = reader.result.split("\r\n");
        for(var i = 0; i < split.length; i++){
            if(split[i].endsWith(" ")) split[i] = split[i].substring(0, split[i].length-1);
            if(split[i].startsWith(" ")) split[i] = split[i].substring(1, split[i].length);
            split[i] = split[i].split(/\s+/);
        }
        // get n and m //
        var m = parseInt(split[0][0]);
        var n = parseInt(split[0][1]);

        // place blocks, torches and leds on canvas //
        for(var i = 1; i < n+1; i++){
            for(var j = 0; j < m; j++){
                if(split[i][j] == "X") continue;
                if(split[i][j].startsWith("Q")){
                    generateTorch(50*i, 50*(m-j-1));
                }
                if(split[i][j] == "W"){
                    generateBlock('white',false,50*i, 50*(m-j-2));
                    j++;
                }
                if(split[i][j] == "B"){
                    generateBlock('blue',false,50*i, 50*(m-j-2));
                    j++;
                }
                if(split[i][j] == "r"){
                    generateBlock('red',(split[i][j+1]=="R") ? true : false,50*i, (split[i][j+1]=="R") ? 50*(m-j-2) : 50*((m-j)-1));
                }
                if(split[i][j].startsWith("L")){
                    generateLED(50*i, 50*(m-j-1));
                }
            }
        }
    };
    // catch errors //
    reader.onerror = function() {alert(reader.error)};
}
// add event listener to upload button //
document.getElementById('upload').addEventListener('change', handleFileSelect, false);