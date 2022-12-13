const canvasTree = document.querySelector("#canvasTree");

const c = canvasTree.getContext("2d");

const tree = new Tree();

const letsStart = async () => {
  canvasTree.width = innerWidth;
  canvasTree.height = innerHeight;

  const fat = await fetch("http://127.0.0.1:5500/generations.json");
  const generation = await fat.json();
  let father;

  const width = 100;
  const height = 30;
  // create the tree
  for (let i = 0; i < generation.length; i++) {
    const g = generation[i];

    // if it's the first father
    if (i === 0) {
      father = new Node({
        id: g.id,
        name: g.name,
        gender: g.gender,
        width,
        height,
      });
    } else {
      let fetFather = g.parents.fatherID === father.id ? father : father.getDescendent(g.parents.fatherID);
      let mather = g.parents.matherID ? father.getThePartners(g.parents.matherID) : null;
      fetFather?.addChild(
        new Node({
          id: g.id,
          name: g.name,
          gender: g.gender,
          father: fetFather,
          mather: mather,
          width,
          height,
        })
      );
    }
  }

  // if hes partners
  for (let i = 0; i < generation.length; i++) {
    const g = generation[i];
    g.partner.forEach(({ id }) => {
      const partner = id === father.id ? father : father.getDescendent(id);
      const fetFather = id === father.id ? father : father.getDescendent(g.parents.fatherID);
      const mather = id === father.id ? father : father.getDescendent(g.parents.matherID);
      if (!partner) console.log(id);
      partner.addPartner(
        new Node({
          id: g.id,
          name: g.name,
          gender: g.gender,
          partner: partner,
          father: fetFather,
          mather: mather,
          width,
          height,
        })
      );
    });
  }

  tree.update({
    nodes: father,
    x: 0,
    y: 0,
  });
};

// Start
letsStart();

window.addEventListener("resize", letsStart);
