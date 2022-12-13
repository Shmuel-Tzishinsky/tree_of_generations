canvasTree.addEventListener("mousemove", (e) => {
  let x = e.pageX - canvasTree.offsetLeft,
    y = e.pageY - canvasTree.offsetTop;

  for (let i = 0; i < tree.nodesArrayList.length; i++) {
    if (
      x > tree.nodesArrayList[i].xPos &&
      y > tree.nodesArrayList[i].yPos &&
      x < tree.nodesArrayList[i].xPos + tree.nodesArrayList[i].width &&
      y < tree.nodesArrayList[i].yPos + tree.nodesArrayList[i].height
    ) {
      canvasTree.style.cursor = "pointer";
      break;
    } else {
      canvasTree.style.cursor = "auto";
    }
  }
});

canvasTree.addEventListener("mousedown", (e) => {
  let x = e.pageX - canvasTree.offsetLeft,
    y = e.pageY - canvasTree.offsetTop;

  let checkSelect;
  for (let i = 0; i < tree.nodesArrayList.length; i++) {
    if (
      !tree.nodesArrayList[i].select &&
      x > tree.nodesArrayList[i].xPos &&
      y > tree.nodesArrayList[i].yPos &&
      x < tree.nodesArrayList[i].xPos + tree.nodesArrayList[i].width &&
      y < tree.nodesArrayList[i].yPos + tree.nodesArrayList[i].height
    ) {
      tree.nodesArrayList[i].selected(true);
      nodeLine.selectHuman(tree.nodesArrayList[i].id);
      checkSelect = true;
    } else {
      tree.nodesArrayList[i].selected(false);
    }
  }

  if (!checkSelect) nodeLine.selectHuman(false);
  tree.nodesArrayList = [];
  sizing(c);
  tree.draw(tree.nodes, 0);
});

canvasTree.addEventListener("wheel", (e) => {
  let x = 0; // e.pageX - canvasTree.offsetLeft,
  y = 0; //e.pageY - canvasTree.offsetTop;

  if (Math.sign(e.deltaY) !== 1) {
    if (tree.nodes.width > 200) return;
    tree.zooming(tree.nodes, 1.05);
  } else {
    if (tree.nodes.width < 35) return;
    tree.zooming(tree.nodes, 0.95);
  }
  tree.update({ nodes: tree.nodes, x, y });
});
