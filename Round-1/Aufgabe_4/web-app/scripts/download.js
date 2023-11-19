// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

/**
 * Create file with filename and text content and push to user
 * @param {string} filename 
 * @param {string} text 
 */
function download(text) {
    var filename = document.getElementById("filename").value; // get filename from input
    if(filename == ""){ // check if filename is empty
        alert("please enter a filename!");
        return;
    }
    // prepare download //
    var element = document.createElement('a'); 
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename+".txt");
    element.style.display = 'none';
    document.body.appendChild(element);

    // perform user download //
    element.click();
    document.body.removeChild(element);
}