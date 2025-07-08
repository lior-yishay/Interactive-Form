import { loopSound, stopSound } from "../../soundManager.js";
import { getVideoDimensions } from "../smile/videoManager.js";
import { getMagnets } from "./logic.js";

// my code don't delete
let magnets = [];
let maruFont, weddingFont, believeFont;
let noteImage;
let plantImage;
let dragCursorImage;
let draggingMagnet = null;
let draggingNote = false;
let draggingWedding = false;
let draggingPlant = false;
let offsetX, offsetY;
let easing = 0.2;
let textSizeVal;
let planetX;
let plantX;
let noteX, noteY;
const wedTilt = 5;

// 🪰 fly gif variables
let flyGif;
let showFly = false;
let lastFlyTime = 0;
let flyDuration = 2000;

// 🔊 sound variables
let chairMovingSound;
let isDragging = false;

//lior's code
let smileImage;
let fridgeDimentions = {};
let smileMagnetDim = {};
let plantHeight, plantWidth;
export const letterColors = {
  A: "#FF0000",
  B: "#8000FF",
  C: "#FF8000",
  D: "#FF8000",
  E: "#3399FF",
  F: "#FF6600",
  G: "#FF6600",
  H: "#00A2FF",
  I: "#00CC66",
  J: "#00CC66",
  K: "#FF8000",
  L: "#3399FF",
  M: "#FF0000",
  N: "#FF6600",
  O: "#FF8000",
  P: "#8000FF",
  Q: "#FFFF00",
  R: "#FF8000",
  S: "#8000FF",
  T: "#00CC66",
  U: "#FFFF00",
  V: "#FF0000",
  W: "#00CC66",
  X: "#00CC66",
  Y: "#FF8000",
  Z: "#8000FF",
};

export function preloadIBeliveInScene() {
  maruFont = loadFont("./assets/GT-Maru-Bold-Trial.otf");
  weddingFont = loadFont("./assets/snellroundhand_bold.otf");
  believeFont = loadFont("./assets/PFCentroSerifCond-Italic-subset.otf");
  noteImage = loadImage("./assets/note1.png");
  plantImage = loadImage("./assets/plant.png");
  dragCursorImage = loadImage("./assets/dragCursor.png");

  chairMovingSound = loadSound("./assets/chair-moving-38333.mp3");

  // preload fly gif
  flyGif = createImg("./assets/fly.gif", "fly gif");
  flyGif.style("position", "absolute");
  flyGif.style("transform", "translate(-50%, -50%)");
  flyGif.hide();
}

export async function setupIBeliveInScene() {
  createCanvas(windowWidth, windowHeight);
  planetX = 0;

  let noteScale = 0.1;
  let noteWidth = width * noteScale;
  let handleHeight = height * 0.5;
  noteX = width / 2 - noteWidth / 2 - 400;
  noteY = height - handleHeight + handleHeight - 180;

  setupFridgeDimentions();
  resizePlantImg();
  setupSmileMagnetDimentions();

  resizePlantImg();
  plantX = width / 2 - plantWidth / 2 - plantWidth * 0.3;

  textSizeVal = width * 0.045;
  textSize(textSizeVal);

  magnets = await getMagnets(() => radians(random(-15, 15)));
}

export function windowResizedIBeliveInScene() {
  resizeCanvas(windowWidth, windowHeight);
  textSizeVal = width * 0.045;
  setupFridgeDimentions();
  resizePlantImg();
  setupSmileMagnetDimentions();
}

export function setupNewMagnets() {
  const newMagnets = [];
  textSizeVal = width * 0.045;
  textSize(textSizeVal);

  const { x: fx, y: fy, innerW, h } = fridgeDimentions;

  for (let i = 0; i < 26; i++) {
    const baseLetter = String.fromCharCode(65 + i);
    const col = letterColors[baseLetter] || "#000000";

    ["upper", "lower"].forEach((caseType, j) => {
      const letter =
        caseType === "upper" ? baseLetter : baseLetter.toLowerCase();

      const x = random(fx + textSizeVal, fx + innerW - textSizeVal);
      const y = random(fy + textSizeVal, fy + h - textSizeVal);
      const rot = radians(random(-15, 15));

      newMagnets.push(new Magnet(letter, x / width, y / height, col, rot));
    });
  }

  return newMagnets;
}

export function drawIBeliveInScene() {
  background("#8590D4");
  drawGrid();
  drawFridge();
  drawNote();
  drawSmileMagnet();
  drawIBelieveInText();

  for (let m of magnets) {
    m.update();
    m.display();
  }

  drawHandle();
  drawPlant();

  // 🖱️ Custom cursor while dragging
  if (isDragging) {
    cursor("none"); // hide default cursor
    let cursorSize = 26; // medium size - between 20 and 32
    let offsetY = 10; // smaller offset - bringing cursor up a bit
    image(
      dragCursorImage,
      mouseX - cursorSize / 2,
      mouseY + offsetY,
      cursorSize,
      cursorSize
    );
  } else {
    cursor("default"); // show default cursor when not dragging
  }

  // 🪰 show fly gif every 10 sec
  let currentTime = millis();
  if (currentTime - lastFlyTime > 10000) {
    showFly = true;
    lastFlyTime = currentTime;
    flyGif.show();
    flyGif.position(width / 2, height / 2);
  }

  if (showFly && currentTime - lastFlyTime > flyDuration) {
    flyGif.hide();
    showFly = false;
  }
}

function drawGrid() {
  stroke(255, 150);
  strokeWeight(1);
  for (let x = 0; x < width; x += 60) line(x, 0, x, height);
  for (let y = 0; y < height; y += 60) line(0, y, width, y);
}

function drawFridge() {
  const { x, y, w, h, innerW } = fridgeDimentions;
  fill("#E0E0E0");
  stroke(0);
  strokeWeight(2);
  rect(x, y, w, h, 120, 120, 0, 0);
  rect(x, y, innerW, h, 120, 120, 0, 0);
}

function drawPlant() {
  image(plantImage, plantX, 0, plantWidth, plantHeight);
}

function drawNote() {
  let noteScale = 0.1;
  let noteWidth = width * noteScale;
  let noteHeight = noteImage.height * (noteWidth / noteImage.width);
  image(noteImage, noteX, noteY, noteWidth, noteHeight);
}

function drawSmileMagnet() {
  push();
  const { x, y, w, h, photoH, photoW } = smileMagnetDim;

  translate(x, y);
  rotate(radians(wedTilt));
  rectMode(CENTER);

  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(0, 0, w, h, 4);

  fill(180);
  noStroke();

  rect(0, -h * 0.17, photoW, photoH, 2);

  textFont(weddingFont);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(h * 0.1);
  text("Maya & Shiri", 0, h * 0.2);
  textSize(h * 0.09);
  text("Pagmar", 0, h * 0.3);
  pop();
}

function drawIBelieveInText() {
  push();
  translate(width / 2, height * 0.55);
  rotate(radians(-5));
  let textW = width * 0.25;
  let textH = width * 0.05;
  rectMode(CENTER);
  fill(0);
  noStroke();
  rect(0, 0, textW, textH, 4);
  textFont(believeFont);
  fill(255);
  textSize(textH * 0.9);
  textAlign(CENTER, CENTER);
  text("I believe in", 0, 0);
  pop();
}

function drawHandle() {
  let handleWidth = fridgeDimentions.w * 0.05;
  let handleHeight = height * 0.5;
  let handleY = height - handleHeight;
  let handleX = fridgeDimentions.x + fridgeDimentions.w * 0.07;
  stroke(0);
  strokeWeight(2);
  fill("#d9d9d9");
  rect(handleX, handleY, handleWidth, handleHeight, 10);
  stroke(255);
  strokeWeight(5);
  line(handleX + 8, handleY + handleHeight, handleX + 8, handleY + 20);
}

export function mousePressedIBeliveInScene() {
  let noteScale = 0.1;
  let noteWidth = width * noteScale;
  let noteHeight = noteImage.height * (noteWidth / noteImage.width);

  if (
    mouseX >= plantX &&
    mouseX <= plantX + plantWidth &&
    mouseY >= 0 &&
    mouseY <= plantHeight
  ) {
    draggingPlant = true;
    offsetX = mouseX - plantX;
    offsetY = mouseY - 0;
    // Start playing sound when starting to drag
    if (!isDragging) {
      isDragging = true;
    }
  } else if (
    mouseX >= noteX &&
    mouseX <= noteX + noteWidth &&
    mouseY >= noteY &&
    mouseY <= noteY + noteHeight
  ) {
    draggingNote = true;
    offsetX = mouseX - noteX;
    offsetY = mouseY - noteY;
    // Start playing sound when starting to drag
    if (!isDragging) {
      isDragging = true;
    }
  } else if (
    abs(mouseX - smileMagnetDim.x) < smileMagnetDim.w / 2 &&
    abs(mouseY - smileMagnetDim.y) < smileMagnetDim.h / 2
  ) {
    draggingWedding = true;
    offsetX = mouseX - smileMagnetDim.x;
    offsetY = mouseY - smileMagnetDim.y;
    // Start playing sound when starting to drag
    if (!isDragging) {
      isDragging = true;
    }
  } else {
    for (let m of magnets) {
      if (m.isMouseOver() && !isDragging) {
        draggingMagnet = m;
        offsetX = mouseX - m.pos.x;
        offsetY = mouseY - m.pos.y;
        // Start playing sound when starting to drag
        if (!isDragging) {
          isDragging = true;
        }
        break;
      }
    }
  }

  if (isDragging) {
    loopSound(chairMovingSound, { volume: 0.5 });
  }
}

export function mouseDraggedIBeliveInScene() {
  if (draggingPlant) {
    let minX = fridgeDimentions.x + plantWidth / 4;
    let maxX = fridgeDimentions.x + fridgeDimentions.innerW - plantWidth;

    let newPlantX = mouseX - offsetX;
    plantX = constrain(newPlantX, minX, maxX);
  } else if (draggingNote) {
    let noteScale = 0.1;
    let noteW = width * noteScale;
    let noteH = noteImage.height * (noteW / noteImage.width);
    noteX = constrain(
      mouseX - offsetX,
      fridgeDimentions.x,
      fridgeDimentions.x + fridgeDimentions.innerW - noteW
    );
    noteY = constrain(
      mouseY - offsetY,
      fridgeDimentions.y,
      fridgeDimentions.y + fridgeDimentions.height - noteH
    );
  } else if (draggingWedding) {
    smileMagnetDim.x = constrain(
      mouseX - offsetX,
      fridgeDimentions.x + smileMagnetDim.w / 2,
      fridgeDimentions.x + fridgeDimentions.innerW - smileMagnetDim.w / 2
    );
    smileMagnetDim.y = constrain(
      mouseY - offsetY,
      fridgeDimentions.y + smileMagnetDim.h / 2,
      fridgeDimentions.y + fridgeDimentions.h - smileMagnetDim.h / 2
    );
  } else if (draggingMagnet) {
    draggingMagnet.posNorm.x = (mouseX - offsetX) / width;
    draggingMagnet.posNorm.y = (mouseY - offsetY) / height;
    draggingMagnet.targetNorm.x = draggingMagnet.posNorm.x;
    draggingMagnet.targetNorm.y = draggingMagnet.posNorm.y;
  }
}

export function mouseReleasedIBeliveInScene() {
  if (draggingMagnet) {
    draggingMagnet.posNorm.x = draggingMagnet.targetNorm.x;
    draggingMagnet.posNorm.y = draggingMagnet.targetNorm.y;
  }
  draggingMagnet = null;
  draggingNote = false;
  draggingWedding = false;
  draggingPlant = false;

  // Stop sound when mouse is released
  if (isDragging) {
    stopSound(chairMovingSound);
    isDragging = false;
  }
}

//lior's code
const setupFridgeDimentions = () => {
  fridgeDimentions = {
    y: height * 0.2,
    w: width * 0.8,
  };

  fridgeDimentions.x = (width - fridgeDimentions.w) / 2;
  fridgeDimentions.h = height - fridgeDimentions.y;
  fridgeDimentions.innerW = fridgeDimentions.w * 0.96;
};

const setupSmileMagnetDimentions = () => {
  const { vidW: photoOriginalW, vidH: photoOriginalH } = getVideoDimensions();

  const w = width * 0.16 * 0.8;
  const photoW = w * 0.86;
  const photoH = (photoW * photoOriginalH) / photoOriginalW;
  const h = photoH + width * 0.07;
  const x = width * 0.75;
  const y = height * 0.45;

  smileMagnetDim = {
    x,
    y,
    w,
    h,
    photoW,
    photoH,
  };
};

const resizePlantImg = () => {
  plantHeight = fridgeDimentions.y;
  plantWidth = (plantImage.width * fridgeDimentions.y) / plantImage.height;
};

export const getSceneMagnets = () => magnets;

export class Magnet {
  constructor(char, xNorm, yNorm, col, rot) {
    this.char = char;
    this.posNorm = createVector(xNorm, yNorm); // Stored as normalized
    this.targetNorm = createVector(xNorm, yNorm); // Stored as normalized
    this.color = col;
    this.rotation = rot;
  }

  get pos() {
    return createVector(this.posNorm.x * width, this.posNorm.y * height);
  }

  get target() {
    return createVector(this.targetNorm.x * width, this.targetNorm.y * height);
  }

  set target(val) {
    this.targetNorm.x = val.x / width;
    this.targetNorm.y = val.y / height;
  }

  update() {
    let px = this.posNorm.x * width;
    let py = this.posNorm.y * height;
    let tx = this.targetNorm.x * width;
    let ty = this.targetNorm.y * height;

    px += (tx - px) * easing;
    py += (ty - py) * easing;

    this.posNorm.x = px / width;
    this.posNorm.y = py / height;

    this.clampToBounds();

    for (let other of magnets) {
      this.resolveCollision(other);
    }
  }

  clampToBounds() {
    let halfW = textWidth(this.char) / 2;
    let halfH = (textAscent() + textDescent()) / 2;

    let tx = this.targetNorm.x * width;
    let ty = this.targetNorm.y * height;

    tx = constrain(
      tx,
      fridgeDimentions.x + halfW,
      fridgeDimentions.x + fridgeDimentions.innerW - halfW
    );
    ty = constrain(ty, fridgeDimentions.y + halfH, height - halfH);

    this.targetNorm.x = tx / width;
    this.targetNorm.y = ty / height;
  }

  display() {
    let p = this.pos;
    push();
    translate(p.x, p.y);
    rotate(this.rotation);
    textFont(maruFont);
    textSize(textSizeVal);
    textAlign(CENTER, CENTER);
    let depthOffset = 2;
    stroke(0);
    strokeWeight(1.8);
    fill(lerpColor(color(this.color), color(0), 0.3));
    text(this.char, depthOffset, depthOffset);
    stroke(0);
    strokeWeight(2.2);
    fill(this.color);
    text(this.char, 0, 0);
    noStroke();
    fill(255, 35);
    text(this.char, -1, -1);
    pop();
  }

  isMouseOver() {
    // Ensure correct font & size for measuring text
    textFont(maruFont);
    textSize(textSizeVal);

    // Compute pixel position from normalized
    const px = this.posNorm.x * width;
    const py = this.posNorm.y * height;

    const w = textWidth(this.char);
    const h = textAscent() + textDescent();

    return (
      mouseX >= px - w / 2 &&
      mouseX <= px + w / 2 &&
      mouseY >= py - h / 2 &&
      mouseY <= py + h / 2
    );
  }

  resolveCollision(other) {
    textFont(maruFont);
    textSize(textSizeVal);
    if (this === other) return;

    let w1 = textWidth(this.char);
    let h1 = textAscent() + textDescent();
    let w2 = textWidth(other.char);
    let h2 = textAscent() + textDescent();

    let thisT = this.target;
    let otherT = other.target;

    let dx = thisT.x - otherT.x;
    let dy = thisT.y - otherT.y;

    let overlapX = (w1 + w2) / 2 - Math.abs(dx);
    let overlapY = (h1 + h2) / 2 - Math.abs(dy);

    if (overlapX > 0 && overlapY > 0) {
      let scatterFactor = 0.015;
      let resolveX = overlapX * scatterFactor * Math.sign(dx || 1);
      let resolveY = overlapY * scatterFactor * Math.sign(dy || 1);

      if (draggingMagnet === this) {
        other.target = createVector(otherT.x - resolveX, otherT.y - resolveY);
      } else if (draggingMagnet === other) {
        this.target = createVector(thisT.x + resolveX, thisT.y + resolveY);
      } else {
        this.target = createVector(
          thisT.x + resolveX / 2,
          thisT.y + resolveY / 2
        );
        other.target = createVector(
          otherT.x - resolveX / 2,
          otherT.y - resolveY / 2
        );
      }
    }

    this.clampToBounds();
    other.clampToBounds();
  }
}
