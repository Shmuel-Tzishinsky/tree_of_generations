class Node {
  constructor({ id, name, gender, partner = [], father, width, height }) {
    this.id = id;
    this.name = name;
    this.prelimX = 0;
    this.prelimY = 0;
    this.partner = partner;
    this.children = [];
    this.leftNeighbor = null;
    this.rightNeighbor = null;
    this.father = father || null;
    this.gender = gender || "male";
    this.modifier = 0;
    this.width = width || 100;
    this.height = height || 30;
    this.xPos = 0;
    this.yPos = 0;
    this.select = false;
  }

  getChild(id) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id === id) {
        return this.children[i];
      }
    }
  }

  getPartner(id) {
    for (let i = 0; i < this.partner.length; i++) {
      if (this.partner[i].id === id) {
        return this.partner[i];
      }
    }
  }

  addChild(tree) {
    this.children.push(tree);
  }

  addPartner(tree) {
    this.partner.push(tree);
  }

  getThePartners(id) {
    let partner = this.partner;
    let found;
    if (this.getPartner(id)) {
      return this.getPartner(id);
    } else {
      for (let i = 0; i < partner.length; i++) {
        found = partner[i].getThePartners(id);
        if (found) {
          return found;
        }
      }
    }
  }

  selected(b) {
    this.select = b;
  }

  getDescendent(id) {
    let children = this.children;
    let found;
    if (this.getChild(id)) {
      return this.getChild(id);
    } else {
      for (let i = 0; i < children.length; i++) {
        found = children[i].getDescendent(id);
        if (found) {
          return found;
        }
      }
    }
  }
}
