function sizing(c) {
  c.fillStyle = "white";

  c.fillRect(0, 0, c.canvas.width, c.canvas.height);

  const cutTime = 20;
  const cutWidthCanvas = c.canvas.width / cutTime;
  const cutHeightCanvas = c.canvas.height / cutTime;
  for (let w = 0; w <= cutTime; w++) {
    c.beginPath();
    c.strokeStyle = "rgb(33 44 48 / 35%)";
    c.fillStyle = "red";
    c.lineWidth = c.canvas.width / 2 === cutWidthCanvas * w || c.canvas.height / 2 === cutHeightCanvas * w ? 1 : 0.5;
    c.moveTo(cutWidthCanvas * w, 0);
    c.lineTo(cutWidthCanvas * w, cutHeightCanvas * cutTime);
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.font = `10px sans-serif`;

    c.fillText((cutWidthCanvas * w).toFixed(1), cutWidthCanvas * w, 20);
    c.moveTo(0, cutHeightCanvas * w);
    c.fillText((cutWidthCanvas * w).toFixed(1), 25, cutHeightCanvas * w);
    c.lineTo(cutWidthCanvas * cutTime, cutHeightCanvas * w);
    c.stroke();
    c.closePath();
  }
}
