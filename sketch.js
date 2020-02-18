let s;
let webImages;

function preload() {
  webImages = [];
  webImages.push(loadImage('https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e3917e828b7c2502b0041813eff1294&auto=format&fit=crop&w=634&q=80'));
  webImages.push(loadImage('https://images.unsplash.com/photo-1575140685026-1908fb64d279?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'));
  webImages.push(loadImage('https://images.unsplash.com/photo-1575121274665-9dd0af2b0eea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'));
  webImages.push(loadImage('https://images.unsplash.com/photo-1575146272339-e53cd2fd34bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'));
}

function setup() {
  createCanvas(600, 600);
  s = {};
  s.bgColor = '#caa5a5';
  s.rowCount = 15;
  s.columnCount = 8;
  s.seed = floor(random(10000));
  s.rectWidth = 8;
  s.oscAmplitude = 20;
  s.oscFrequency = 0.1;
  s.oscModFrequency = 0.1;
  s.activeImageIndex = 0;
  s.maxRotation = 60;
  s.randomDisplacementAmplitude = 100;
  s.polygonPointCount = 4;
  initColors();
  background(s.bgColor);
  let gui = new dat.GUI();
  gui.add(s, 'rectWidth', 0, 100).name('largeur rectangle');
  let rowCountController = gui.add(s, 'rowCount', 1, 100).name('nombre lignes');
  let columnCountController = gui.add(s, 'columnCount', 1, 100).name('nombre colonnes');
  rowCountController.onChange(value => {
    s.rowCount = floor(value);
    initColors();
  });
  columnCountController.onChange(value => {
    s.columnCount = floor(value);
    initColors();
  });
  gui.add(this, 'initColors');
  gui.addColor(s, 'bgColor');
  let activeImageIndexController = gui.add(s, 'activeImageIndex', [...webImages.keys()]);
  activeImageIndexController.onChange(value => {
    s.activeImageIndex = value;
    initColors();
  });
  gui.add(s, 'maxRotation', 0, 180);
  gui.add(s, 'randomDisplacementAmplitude', 0, 200);
  gui.add(s, 'polygonPointCount', 3, 20);
}

function initColors() {
  s.rectColors = [];
  let webImage = webImages[s.activeImageIndex];
  for (let i = 0; i < s.rowCount * s.columnCount; i++) {
    let x = random(0, webImage.width);
    let y = random(0, webImage.height);
    let c = webImage.get(x, y);
    s.rectColors.push(c);
  }
}

function draw() {
  background(s.bgColor);
  drawGrid(400, 400);
}

function drawGrid(w, h) {
  randomSeed(0)
  let cellWidth = w / s.columnCount;
  let cellHeight = h / s.rowCount;
  push();
  translate((width - w) / 2, (height - h) / 2);
  let k = 0;
  for (let i = 0; i < s.columnCount; i++) {
    for (let j = 0; j < s.rowCount; j++) {
      let c = s.rectColors[k];
      noStroke();
      fill(c);
      push();
      let shift = s.oscAmplitude * sin(frameCount * s.oscFrequency);
      shift += s.oscAmplitude * sin(frameCount * (s.oscFrequency + i / s.columnCount * s.oscModFrequency));
      shift += s.oscAmplitude * sin(frameCount * (s.oscFrequency + j / s.rowCount * s.oscModFrequency));
      translate(i * cellWidth + cellWidth / 2 + shift + random(-1, 1) * s.randomDisplacementAmplitude, j * cellHeight + cellHeight / 2 + random(-1, 1) * s.randomDisplacementAmplitude); // centering
      rotate(sin(i / 10 + j / 2) * s.maxRotation * PI / 180);
      // rectByCenter(0, 0, s.rectWidth, cellHeight);
      polygon(0, 0, s.rectWidth, s.polygonPointCount);
      pop();
      k++;
    }
  }
  pop();
}

function polygon(x, y, radius, pointCount) {
  let angle = TWO_PI / pointCount;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function rectByCenter(x, y, w, h) {
  push();
  translate(-w / 2, -h / 2);
  rect(x, y, w, h);
  pop();
}

function keyTyped() {
  if (key === 'n') {
    initColors();
  }
}