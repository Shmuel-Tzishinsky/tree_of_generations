function sizingTimeline(c) {
  ctx.fillStyle = "white";

  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const cutTime = 100;
  const cutWidthCanvas = ctx.canvas.width / cutTime;
  const cutHeightCanvas = ctx.canvas.height / cutTime;
  for (let w = 0; w <= cutTime; w++) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(33 44 48 / 70%)";
    ctx.fillStyle = "red";
    ctx.lineWidth = ctx.canvas.width / 2 === cutWidthCanvas * w || ctx.canvas.height / 2 === cutHeightCanvas * w ? 1 : 0.5;
    ctx.moveTo(cutWidthCanvas * w, 0);
    ctx.lineTo(cutWidthCanvas * w, cutHeightCanvas * cutTime);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `10px sans-serif`;

    ctx.stroke();
    ctx.closePath();
  }
}
