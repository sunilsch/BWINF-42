// Author: Linus Schumann
// Part of the BWINF 2023/2024 Round 1 Task 4 (name: "Nandu")

function fitStageIntoParentContainer() {
  // select parent container
  var container = document.querySelector('#stage-parent');
  // set hight and with
  stage.width(container.offsetWidth);
  stage.height(container.offsetHeight);
}

// adapt the stage on any window resize //
fitStageIntoParentContainer();
window.addEventListener('resize', fitStageIntoParentContainer);