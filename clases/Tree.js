class Tree {
  constructor() {
    this.nodes = {};
    this.previousLevelTree = []; // right human in each line
    this.nodesArrayList = []; //for loop pointer event

    // Space between humans
    this.SPACE_TO_ONE_CHILD; // y position is *half* height of human
    this.SPACE_TO_MORE_THAN_ONE_CHILD; // // y position is height of human
    this.SPACE_BETWEEN_BROTHERS; // x position is 10 percentage from width human
  }
  // zooming inside canvas
  zooming(tree, inOrOut) {
    tree.width *= inOrOut;
    tree.height *= inOrOut;

    for (let i = 0; i < tree.children.length; i++) {
      this.zooming(tree.children[i], inOrOut);
    }
    for (let i = 0; i < tree.partner.length; i++) {
      this.zooming(tree.partner[i], inOrOut);
    }
  }
  // find the left human
  getLeftMost = function (tree, level, maxLevel) {
    if (level >= maxLevel) return tree;
    if (tree.children.length === 0) return null;
    let n = tree.children.length;
    for (let i = 0; i < n; i++) {
      let iChild = tree.children[i];
      let leftmostDescendant = this.getLeftMost(iChild, level + 1, maxLevel);
      if (leftmostDescendant !== null) return leftmostDescendant;
    }
    return null;
  };
  // Makes sure that no one person oversteps the other's position
  apportion(tree, level) {
    let firstChild = tree.children[0],
      firstChildLeftNeighbor = firstChild.leftNeighbor,
      j = 1;

    for (let k = 100 - level; firstChild !== null && firstChildLeftNeighbor !== undefined && j <= k; ) {
      let modifierSumRight = 0;
      let modifierSumLeft = 0;
      let rightAncestor = firstChild;
      let leftAncestor = firstChildLeftNeighbor;
      for (let l = 0; l < j; l++) {
        rightAncestor = rightAncestor.father;
        leftAncestor = leftAncestor.father;
        modifierSumRight += rightAncestor.modifier;
        modifierSumLeft += leftAncestor.modifier;
      }
      let totalGap =
        firstChildLeftNeighbor.prelimX +
        modifierSumLeft +
        firstChildLeftNeighbor.width +
        this.SPACE_BETWEEN_BROTHERS -
        (firstChild.prelimX + modifierSumRight);
      if (totalGap > 0) {
        let subtreeAux = tree;
        let numSubtrees = 0;
        for (; subtreeAux !== null && subtreeAux !== leftAncestor; subtreeAux = subtreeAux.leftNeighbor) {
          numSubtrees++;
        }
        if (subtreeAux !== null) {
          let subtreeMoveAux = tree;
          let singleGap = totalGap / numSubtrees;
          for (; subtreeMoveAux !== leftAncestor; subtreeMoveAux = subtreeMoveAux.leftNeighbor) {
            subtreeMoveAux.prelimX += totalGap;
            subtreeMoveAux.modifier += totalGap;
            totalGap -= singleGap;
          }
        }
      }
      j++;
      if (!firstChild.children.length) {
        firstChild = this.getLeftMost(tree, 0, j);
      } else {
        firstChild = firstChild.children[0];
      }
      if (firstChild !== null) {
        firstChildLeftNeighbor = firstChild.leftNeighbor;
      }
    }
  }
  // set the prelim
  addPrelim({ tree, level }) {
    if (tree.partner.length) {
      for (let i = 0; i < tree.partner.length; i++) {
        const partner = tree.partner[i];
        tree.width += partner.width + this.SPACE_BETWEEN_BROTHERS;
      }
    }
    tree.leftNeighbor = this.previousLevelTree[level];
    this.previousLevelTree[level] = tree;

    let leftSibling = tree.leftNeighbor && tree.leftNeighbor.father === tree.father ? tree.leftNeighbor : undefined;

    if (tree.leftNeighbor) tree.leftNeighbor.rightNeighbor = tree;

    if (leftSibling) tree.prelimX = leftSibling.prelimX + leftSibling.width + this.SPACE_BETWEEN_BROTHERS;
    else if (!tree.children.length) tree.prelimX = 0;

    if (tree.children.length) {
      // call te function on each child
      for (let i = 0; i < tree.children.length; i++) {
        this.addPrelim({
          tree: tree.children[i],
          level: level + 1,
        });
      }
      let firstHuman = tree.children[0];
      let lastHuman = tree.children[tree.children?.length - 1];
      let midPoint = firstHuman.prelimX + (lastHuman.prelimX - firstHuman.prelimX + lastHuman.width - tree.width) / 2;
      if (leftSibling) {
        tree.modifier = tree.prelimX - midPoint;
        this.apportion(tree, level);
      } else {
        tree.prelimX = midPoint;
      }
    }
  }
  //  add the position
  addThePos({ tree, level, x, y }) {
    tree.xPos = tree.prelimX + x;
    tree.yPos = y;

    for (let i = 0; i < tree.partner.length; i++) {
      const partner = tree.partner[i];
      tree.width = partner.width;
      partner.xPos = tree.xPos + (i !== 0 ? 0 : this.SPACE_BETWEEN_BROTHERS) * i;
      partner.yPos = tree.yPos;
      tree.xPos = partner.xPos + (this.SPACE_BETWEEN_BROTHERS + partner.width) * (i === 0 ? i + 1 : i);
    }

    if (tree.children.length)
      this.addThePos({
        tree: tree.children[0],
        level: level + 1,
        x: x + (tree.modifier || 0),
        y: y + tree.height + (tree.children.length > 1 ? this.SPACE_TO_MORE_THAN_ONE_CHILD : this.SPACE_TO_ONE_CHILD),
      });

    let rightSibling = tree?.rightNeighbor?.father === tree.father ? tree.rightNeighbor : null;
    if (rightSibling)
      this.addThePos({
        tree: rightSibling,
        level,
        x,
        y,
      });
  }
  // draw to canvas
  draw(tree) {
    this.nodesArrayList.push(tree);
    c.fillStyle = "black";
    c.font = "15px sans-serif";
    c.font = `${tree.width / 6}px sans-serif`;
    c.fillText(tree.name + " " + tree.id, tree.xPos + tree.width / 2, tree.yPos + tree.height / 2);
    c.fillStyle = tree.gender !== "male" ? "hsl(0deg 100% 50% / 50%)" : "hsl(240deg 100% 50% / 50%)";
    c.fillRect(tree.xPos, tree.yPos, tree.width, tree.height);
    if (tree.select) {
      c.strokeStyle = "red";
      c.lineWidth = 1.5;
      c.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
      c.strokeRect(tree.xPos, tree.yPos, tree.width, tree.height);
    }
    if (tree.id === 1) {
      c.beginPath();
      c.moveTo(tree.xPos + tree.width / 2, tree.yPos);
      c.lineTo(tree.xPos + tree.width / 2, tree.yPos + tree.height);
      c.strokeStyle = "red";
      c.lineWidth = 1;
      c.stroke();
    }

    for (let i = 0; i < tree.partner.length; i++) {
      this.draw(tree.partner[i]);
    }

    for (let i = 0; i < tree.children.length; i++) {
      this.draw(tree.children[i]);
    }

    // c.strokeRect();
  }
  // align them all according to the main father end mouse position
  alignThePos({ tree, x, y }) {
    sizing(c);
    tree.xPos += x;
    tree.yPos += y;

    for (let i = 0; i < tree.children.length; i++) {
      this.alignThePos({
        tree: tree.children[i],
        x,
        y,
      });
    }
    for (let i = 0; i < tree.partner.length; i++) {
      this.alignThePos({
        tree: tree.partner[i],
        x,
        y,
      });
    }
  }
  //
  async update({ nodes, x, y }) {
    this.nodes = nodes;
    tree.previousLevelTree = [];
    tree.nodesArrayList = [];
    this.SPACE_TO_ONE_CHILD = nodes.height / 3;
    this.SPACE_TO_MORE_THAN_ONE_CHILD = nodes.height / 2;
    this.SPACE_BETWEEN_BROTHERS = (nodes.width * 10) / 100;

    this.addPrelim({
      tree: this.nodes,
      level: 0,
    });

    this.addThePos({
      tree: this.nodes,
      level: 0,
      x: 0,
      y: 0,
    });

    this.alignThePos({
      tree: this.nodes,
      x: (canvasTree.width - this.nodes.width) / 2 - this.nodes.xPos,
      y: 50,
    });

    this.draw(this.nodes, 0);
  }
}
