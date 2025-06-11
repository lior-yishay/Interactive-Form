import { SMILE } from "../../scenes-names.js";
import { getMagnets, getSceneAnswer, postMagnetPositions, updateWindowSizeAndMagnetsPos } from "./logic.js";

let magnets = [];
let colors = ['#10A959', '#FFC700', '#F14E1D', '#EEEEEE'];
let maruFont;
let noteImage;
let smileImage; // my code
let draggingMagnet = null;
let draggingPlanet = false;
let draggingNote = false;
let offsetX, offsetY;
let easing = 0.2;
let textSizeVal;
let planetX;
let noteX, noteY;



export function preloadIBeliveInScene() {
  // maruFont = loadFont('./assets/GT-Maru-Mono-Bold-Trial.otf');
  maruFont = loadFont('./assets/GT-Maru-Bold-Trial.otf')
  noteImage = loadImage('./assets/note1.png');
  // mayaShiriImage = loadImage('twopeople.jpg'); // NEW
}

export async function setupIBeliveInScene() {
  createCanvas(windowWidth, windowHeight);
  // setupMagnets(); 
  planetX = 0;

  let noteScale = 0.10;
  let noteWidth = width * noteScale;
  let handleHeight = height * 0.5;
  let handleY = height - handleHeight;
  noteX = width / 2 - noteWidth / 2 - 400;
  noteY = handleY + handleHeight - 180;

  //my code
  smileImage = getSceneAnswer(SMILE)?.image

  textSizeVal = width * 0.045;
  textSize(textSizeVal);

  let topOffset = 200;
  let fridgeWidth = width * 0.8;
  let fridgeX = (width - fridgeWidth) / 2;
  let topX = fridgeX - 20;
  let topWidth = fridgeWidth - 20;
  let topHeight = height - topOffset + 50;

  magnets = await getMagnets(colors, () => radians(random(-15, 15)), topX, topOffset, topWidth, topHeight)
  setupMagnets()
}

export function windowResizedIBeliveIn() {
  resizeCanvas(windowWidth, windowHeight);
  updateWindowSizeAndMagnetsPos(magnets)
  //setupMagnets();
}

export function setupMagnets() {
  const newMagnets = [];
  textSizeVal = width * 0.045;
  textSize(textSizeVal);

  let topOffset = 200;
  let fridgeWidth = width * 0.8;
  let fridgeX = (width - fridgeWidth) / 2;
  let topX = fridgeX - 20;
  let topWidth = fridgeWidth - 20;
  let topHeight = height - topOffset + 50;

  for (let i = 0; i < 26; i++) {
    let baseLetter = String.fromCharCode(65 + i);
    for (let j = 0; j < 2; j++) {
      let isUpper = random() < 0.5;
      let letter = isUpper ? baseLetter : baseLetter.toLowerCase();
      let col = colors[(i + j) % colors.length];

      let x = random(topX + textSizeVal, topX + topWidth - textSizeVal);
      let y = random(topOffset + textSizeVal, topOffset + topHeight - textSizeVal);

      let rot = radians(random(-15, 15));
      newMagnets.push(new Magnet(letter, x, y, col, rot, topX, topOffset, topWidth, topHeight));
    }
  }

  return newMagnets
}

export function drawIBeliveInScene() {
  background('#C9B8FF');
  let gridSpacing = 60;
  stroke(255, 150);
  strokeWeight(1);
  for (let x = 0; x < width; x += gridSpacing) line(x, 0, x, height);
  for (let y = 0; y < height; y += gridSpacing) line(0, y, width, y);

  let topOffset = 200;
  let fridgeWidth = width * 0.8;
  let fridgeX = (width - fridgeWidth) / 2;

  stroke(0);
  strokeWeight(2);
  fill('#E1D5C2');
  rect(fridgeX, topOffset, fridgeWidth, height - topOffset + 50, 120, 120, 0, 0);

  let topX = fridgeX - 20;
  let topY = topOffset;
  let topWidth = fridgeWidth - 20;
  let topHeight = height - topOffset + 50;

  stroke(0);
  strokeWeight(2);
  fill('#F4EBDC');
  rect(topX, topY, topWidth, topHeight, 120, 120, 0, 0);

  // Pot and plant
  push();
  let potWidth = topWidth * 0.15;
  let potHeight = topY;
  let potX = constrain(planetX + topWidth / 2 - potWidth / 2, topX, topX + topWidth - potWidth - 60);
  let potY = topY;
  translate(potX, potY - potHeight);
  stroke(0);
  strokeWeight(2);

  fill(255);
  beginShape();
  vertex(0, 0);
  vertex(potWidth, 0);
  vertex(potWidth * 0.8, potHeight);
  vertex(potWidth * 0.2, potHeight);
  endShape(CLOSE);

  fill('#10A959');
  beginShape();
  vertex(potWidth * 0.2, 0);
  vertex(potWidth * 0.1, potHeight - 50 * 1.2);
  vertex(potWidth * 0.4, 0);
  endShape(CLOSE);
  beginShape();
  vertex(potWidth * 0.5, 0);
  vertex(potWidth * 0.48, potHeight - 50 * 1.5);
  vertex(potWidth * 0.6, 0);
  endShape(CLOSE);
  beginShape();
  vertex(potWidth * 0.8, 0);
  vertex(potWidth * 0.9, potHeight - 50 * 1.2);
  vertex(potWidth * 0.9, 0);
  endShape(CLOSE);
  pop();

  // "I believe in" sticker
  push();
  translate(width / 2, topY + 350);
  rotate(radians(-5));
  fill(0);
  stroke(0);
  strokeWeight(1.5);
  let stickerW = width * 0.25;
  let stickerH = width * 0.05;
  rect(-stickerW / 2, -stickerH / 2, stickerW, stickerH, 5);

  fill('#10A959');
  noStroke();
  let circleSize = stickerH * 0.7;
  ellipse(-stickerW / 2 + circleSize / 2, -stickerH / 2 + circleSize / 2, circleSize);

  fill(255);
  textFont('Georgia');
  textAlign(CENTER, CENTER);
  textSize(stickerH * 0.6);
  text("I believe in", 0, 0);
  pop();

// Right side Shiri & Maya photo magnet WITH IMAGE + TEXT
push();
let photoW = width * 0.12;
let photoH = photoW * 0.8;
let photoX = fridgeX + 120 + fridgeWidth * 0.75;
let photoY = topY + 300;

translate(photoX, photoY);
rotate(radians(5));

fill(255);
stroke(0);
strokeWeight(1);
rectMode(CENTER);
rect(0, 0, photoW, photoH);

// Insert loaded image inside (with inset and top margin)
let imgInset = photoW * 0.15;
let topMargin = photoH * 0.1;
let imageAreaHeight = photoH * 0.8; // reserve bottom for text
imageMode(CENTER);

if(smileImage) { //my if statment. 
  image(
    smileImage,
    0,
    -imageAreaHeight * 0.15, // shift slightly up within the image area
    photoW - imgInset,
    imageAreaHeight - imgInset
  );
}


// Green circle magnet on top
fill('#10A959');
noStroke();
ellipse(0, -photoH / 2 + 10, photoW * 0.15); // adjust position to stay near the top edge

// Keep the text label UNDER the image with space
fill(0);
textAlign(CENTER, CENTER);
textSize(photoH * 0.08);
text("Maya & Shiri\nFridge Magnet", 0, photoH * 0.3); // push text down slightly for spacing
pop();

  let noteScale = 0.10;
  let noteWidth = width * noteScale;
  let noteHeight = noteImage.height * (noteWidth / noteImage.width);
  image(noteImage, noteX, noteY, noteWidth, noteHeight);

  for (let i = 0; i < magnets.length; i++) {
    for (let j = i + 1; j < magnets.length; j++) {
      magnets[i].resolveCollision(magnets[j]);
    }
  }
  for (let m of magnets) {
    m.update();
    m.display();
  }

  let handleWidth = fridgeWidth * 0.05;
  let handleHeight = height * 0.5;
  let handleY = height - handleHeight;
  let handleX = fridgeX + fridgeWidth * 0.07;

  stroke(0);
  strokeWeight(2);
  fill('#d9d9d9');
  rect(handleX, handleY, handleWidth, handleHeight, 10, 10, 0, 0);

  stroke(255);
  strokeWeight(5);
  let lineX = handleX + 8;
  let lineY1 = handleY + handleHeight;
  let lineY2 = handleY + 20;
  line(lineX, lineY1, lineX, lineY2);
}

export async function mousePressedIBeliveInScene() {
  let noteScale = 0.10;
  let noteWidth = width * noteScale;
  let noteHeight = noteImage.height * (noteWidth / noteImage.width);

  if (mouseX >= noteX && mouseX <= noteX + noteWidth &&
      mouseY >= noteY && mouseY <= noteY + noteHeight) {
    draggingNote = true;
    offsetX = mouseX - noteX;
    offsetY = mouseY - noteY;
  } else if (mouseY >= 0 && mouseY <= 200) {
    draggingPlanet = true;
    offsetX = mouseX - planetX;
  } else {
    for (let m of magnets) {
      if (m.isMouseOver()) {
        draggingMagnet = m;
        offsetX = mouseX - m.target.x;
        offsetY = mouseY - m.target.y;
        break;
      }
    }
  }
}

export function mouseDraggedIBeliveInScene() {
  let fridgeWidth = width * 0.8;
  let fridgeX = (width - fridgeWidth) / 2;
  let topX = fridgeX - 20;
  let topY = 200;
  let topWidth = fridgeWidth - 20;
  let topHeight = height - topY + 50;

  if (draggingNote) {
    let noteScale = 0.10;
    let noteW = width * noteScale;
    let noteH = noteImage.height * (noteW / noteImage.width);

    noteX = mouseX - offsetX;
    noteY = mouseY - offsetY;

    noteX = constrain(noteX, topX, topX + topWidth - noteW);
    noteY = constrain(noteY, topY, topY + topHeight - noteH);
  } else if (draggingPlanet) {
    let potWidth = topWidth * 0.15;
    planetX = mouseX - offsetX;
    planetX = constrain(planetX, topX - topWidth / 2 + potWidth / 2, topX + topWidth / 2 - potWidth / 2);
  } else if (draggingMagnet) {
    draggingMagnet.target.x = mouseX - offsetX;
    draggingMagnet.target.y = mouseY - offsetY;
  }
}

export function mouseReleasedIBeliveInScene() {
  draggingMagnet = null;
  draggingPlanet = false;
  draggingNote = false;
}

export class Magnet {
  constructor(char, x, y, col, rot, boundX, boundY, boundW, boundH) {
    this.char = char;
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.color = col;
    this.rotation = rot;

    this.boundX = boundX;
    this.boundY = boundY;
    this.boundW = boundW;
    this.boundH = boundH;
  }

  update() {
    this.pos.x = lerp(this.pos.x, this.target.x, easing);
    this.pos.y = lerp(this.pos.y, this.target.y, easing);
    this.clampToBounds();
  }

  clampToBounds() {
    let halfW = textWidth(this.char) / 2;
    let halfH = (textAscent() + textDescent()) / 2;
    this.target.x = constrain(this.target.x, this.boundX + halfW, this.boundX + this.boundW - halfW);
    this.target.y = constrain(this.target.y, this.boundY + halfH, this.boundY + this.boundH - halfH);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    stroke(0);
    strokeWeight(1.64);
    fill(this.color);
    textFont(maruFont);
    textSize(textSizeVal);
    textAlign(CENTER, CENTER);
    text(this.char, 0, 0);
    pop();
  }

  isMouseOver() {
    let w = textWidth(this.char);
    let h = textAscent() + textDescent();
    return (mouseX > this.pos.x - w / 2 && mouseX < this.pos.x + w / 2 &&
            mouseY > this.pos.y - h / 2 && mouseY < this.pos.y + h / 2);
  }

  resolveCollision(other) {
    if (this === other) return;

    let w1 = textWidth(this.char);
    let h1 = textAscent() + textDescent();
    let w2 = textWidth(other.char);
    let h2 = textAscent() + textDescent();

    let dx = this.target.x - other.target.x;
    let dy = this.target.y - other.target.y;
    let overlapX = (w1 + w2) / 2 - Math.abs(dx);
    let overlapY = (h1 + h2) / 2 - Math.abs(dy);

    if (overlapX > 0 && overlapY > 0) {
      let resolveX = (overlapX + 1) * 0.5 * Math.sign(dx || 1);
      let resolveY = (overlapY + 1) * 0.5 * Math.sign(dy || 1);

      if (draggingMagnet === this) {
        other.target.x -= resolveX;
        other.target.y -= resolveY;
      } else if (draggingMagnet === other) {
        this.target.x += resolveX;
        this.target.y += resolveY;
      } else {
        this.target.x += resolveX / 2;
        this.target.y += resolveY / 2;
        other.target.x -= resolveX / 2;
        other.target.y -= resolveY / 2;
      }
    }

    this.clampToBounds();
    other.clampToBounds();
  }
}