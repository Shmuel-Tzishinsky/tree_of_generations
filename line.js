const canvasTimeline = document.querySelector("#canvasTimeline");
const ctx = canvasTimeline.getContext("2d");

canvasTimeline.width = innerWidth;
canvasTimeline.height = innerHeight;

class Line {
  constructor({ ind, id, name, father, birthday, deceased }) {
    this.ind = ind;
    this.id = id;
    this.name = name;
    this.birthday = birthday;
    this.deceased = deceased;
    this.father = father || null;
    this.prelimY = 20;
    this.children = [];
    this.currentSelect = null;
    this.selected = false;
    this.pos = {
      x: 0,
      y: 0,
    };
  }

  select(b) {
    this.selected = b;
  }

  getChild(id) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id === id) {
        return this.children[i];
      }
    }
  }

  addChild(tree) {
    this.children.push(tree);
  }

  getDescendent(id) {
    let children = this.children;
    let found;
    if (this.id === id) {
      return this;
    } else if (this.getChild(id)) {
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

class NodeLine {
  constructor() {
    this.nodeLine = {};
  }

  draw(human) {
    if (human.birthday === null || human.deceased === null) {
      console.log(human);

      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.font = `12px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.fillText(human.name, 100, 20 * human.ind + 10);
      // right
      ctx.moveTo(130, 20 * human.ind + 10);
      ctx.lineTo(140, 20 * human.ind + 10);
      // left
      ctx.moveTo(60, 20 * human.ind + 10);
      ctx.lineTo(70, 20 * human.ind + 10);
      ctx.lineWidth = 0.5;
      ctx.stroke();
      // return;
    } else {
      if (human.father) {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(203,191,183)";
        ctx.moveTo(human.birthday / 3 + 20, 20 * human.father.ind + 26); //30 * i
        ctx.lineTo(human.birthday / 3 + 20, 20 * human.ind + 16);
        ctx.stroke();
        ctx.closePath();
      }
      ctx.fillStyle = !human.selected ? "rgb(70,37,75)" : "rgb(171,14,154)";
      ctx.strokeStyle = !human.selected ? "rgb(70,37,75)" : "rgb(171,14,154)";
      // ctx.fillRect(human.birthday / 3, 20 * human.ind, ( human.deceased) / 3, 20);

      if (human.selected) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(human.birthday / 3 + 20, 0); //30 * i
        ctx.lineTo(human.birthday / 3 + 20, window.innerHeight);
        ctx.moveTo(human.birthday / 3 + human.deceased / 3 + 20, 0); //30 * i
        ctx.lineTo(human.birthday / 3 + human.deceased / 3 + 20, window.innerHeight);
        ctx.fillStyle = "rgb(171 14 154 / 46%)";
        ctx.fillRect(human.birthday / 3 + 20, 0, human.deceased / 3, window.innerHeight);

        ctx.stroke();
        ctx.closePath();
      }

      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.font = `15px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.fillText(human.name, human.birthday / 3 + 50, 20 * human.ind + 10);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = "#fff";
      ctx.arc(human.birthday / 3 + 20, 20 * human.ind + 20, 5, 0, Math.PI * 2, true);
      ctx.arc(human.birthday / 3 + 20 + human.deceased / 3, 20 * human.ind + 20, 5, -600, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

    for (let i = 0; i < human.children.length; i++) {
      if (human.children[i].birthday !== null || human.children[i].deceased !== null) {
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = !human.selected ? "rgb(110,37,75)" : "rgb(171,14,154)";
        ctx.lineWidth = 2;
        ctx.arc(human.children[i].birthday / 3 + 20, 20 * human.ind + 20, 5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
      this.draw(human.children[i]);
    }
  }

  async selectHuman(id) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.canvas.width, c.canvas.height);

    await years.draw();
    this.currentSelect?.select(false);
    let human = this.nodeLine.getDescendent(id);
    console.log("🚀 ~ file: line.js:137 ~ NodeLine ~ selectHuman ~ human", human);
    this.currentSelect = human;
    human?.select(true);
    this.draw(this.nodeLine);
    toggleCanvas(null, id === false ? false : true);
  }

  update(nodeLine) {
    this.nodeLine = nodeLine;

    this.draw(this.nodeLine);
  }
}

class Years {
  constructor() {
    this.humans = undefined;
  }

  addImageProcess(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async draw() {
    // "/copy.jpg";

    // BACKGROUND
    const img = await this.addImageProcess(
      "https://img.freepik.com/free-vector/white-gray-background-with-diagonal-lines-pattern_1017-25100.jpg?w=740&t=st=1670886763~exp=1670887363~hmac=883e7508164a65856b4e1b5db26e62fe259826d39265b286e43796ef45367423"
    );
    ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
  }

  update(humans) {
    this.humans = humans;

    this.draw();
  }
}

const years = new Years();
const nodeLine = new NodeLine();

async function startTimeline() {
  const getData = await fetch("./generations.json");
  const humans = await getData.json();
  let father;
  for (let i = 0; i < humans.length; i++) {
    const human = humans[i];
    const father = humans.find((fat) => fat.id === human.parents?.fatherID);
    let birthday = father?.born && human.born ? human.born + father.birthday || father?.born : human.born;
    human.birthday = birthday;
  }

  for (let i = 0; i < humans.length; i++) {
    const h = humans[i];

    // if it's the first father
    if (i === 0) {
      father = new Line({
        ind: i,
        id: h.id,
        name: h.name,
        birthday: h.birthday,
        deceased: h.deceased,
      });
    } else {
      let fetFather = h.parents.fatherID === father.id ? father : father.getDescendent(h.parents.fatherID);

      fetFather?.addChild(
        new Line({
          ind: i,
          id: h.id,
          name: h.name,
          father: fetFather,
          birthday: h.birthday,
          deceased: h.deceased,
        })
      );
    }
  }
  console.log(father);
  years.update(humans);
  nodeLine.update(father);
}

// sizingTimeline();
startTimeline();
