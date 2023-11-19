// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

let currentShape;
var menuNode = document.getElementById('menu');

document.getElementById('delete-button').addEventListener('click', () => { // delete shape action
    currentShape.parent.destroy();
});
window.addEventListener('click', () => { // hide menu
    menuNode.style.display = 'none';
});

stage.on('contextmenu', function (e) {
    if (e.target === stage) { // if we are on empty place of the stage we will do nothing
        console.log("empty place");
        return;
    }
    e.evt.preventDefault(); // prevent default behavior
    currentShape = e.target; // store current shape

    // show menu //
    menuNode.style.display = 'initial';
    var containerRect = stage.container().getBoundingClientRect();
    menuNode.style.top = containerRect.top + stage.getPointerPosition().y + 4 + 'px';
    menuNode.style.left = containerRect.left + stage.getPointerPosition().x + 4 + 'px';
});