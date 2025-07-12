/*  “Is The Answer…” sticker-mash sketch  —  FULL UPDATED VERSION
    ---------------------------------------------------------------------
    • Drag the top sticker to swap answers; each swap increments its votes.
    • After the first swap a small “SUBMIT” button appears under the artboard.
    • Hover → underline (below the word); click → shows the vote-spread screen.
    • Text is always centered inside stickers (alignment fixed).
*/

import { getTheAnswerCounts } from "./logic.js";

let answers;
const COLOURS = ["#F24D1F", "#C9B8FF", "#10A959"];
const SHAPES = ["star", "capsule", "circle"];

let marginX, marginY, artW, artH;
let anchorX, anchorY;
let topSticker, nextSticker;
let idx = 0;
let dragging = false;
let switchedOnce = false; // true after first swap
let dX = 0,
  dY = 0;
let grotta;

let showAll = false;
let allStickers = [];
let draggedSticker = null;

let btnBox = null; // submit button hit-box
let answerCounts;

export function preloadTheAnswerScene() {
  grotta = loadFont("./assets/Grotta-Trial-Medium.ttf");
}

export async function setupTheAnswerScene() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  calcLayout();

  answerCounts = await getTheAnswerCounts();
  answers = answerCounts.map(({ name }) => name);

  initStack();
}

export function drawTheAnswerScene() {
  background("#000");
  noStroke();
  fill("#F9F6F1");
  rect(marginX, marginY, artW, artH);

  push();
  translate(marginX, marginY);

  drawHint();
  drawHeadline();

  if (showAll) {
    for (let i = 0; i < allStickers.length; i++) {
      allStickers[i].show();
      drawVotes(allStickers[i], i);
    }
  } else {
    if (nextSticker) nextSticker.show();
    if (topSticker) topSticker.show();
  }

  pop();

  // ---------- SUBMIT ----------
  if (!showAll) drawSubmitButton();
}

/* ---------- submit-button ---------- */
function drawSubmitButton() {
  push(); // isolate style changes
  const label = "Submit";

  // slightly smaller (§ 0.028)
  const fs = max(14, artW * 0.028);

  textFont(grotta);
  textSize(fs);
  textStyle(NORMAL);
  textAlign(CENTER, TOP);

  const btnCol = "#F9F6F1";
  const w = textWidth(label);
  const x = width / 2;
  const y = artH + marginY + fs * 0.1; //lior changed from 0.6 to 0.1

  btnBox = { x: x - w / 2, y: y, w: w, h: fs };

  const hovering =
    mouseX >= btnBox.x &&
    mouseX <= btnBox.x + btnBox.w &&
    mouseY >= btnBox.y &&
    mouseY <= btnBox.y + btnBox.h;

  if (hovering) {
    stroke(btnCol);
    strokeWeight(2);
    line(
      btnBox.x,
      btnBox.y + fs + 3, // underline just below text
      btnBox.x + w,
      btnBox.y + fs + 3
    );
    cursor(HAND);
  } else {
    noStroke();
    cursor(ARROW);
  }

  fill(btnCol);
  noStroke();
  text(label, x, y);
  pop(); // restore previous styles
}

/* ---------- layout ---------- */
function calcLayout() {
  const PAD = 0.12;
  marginX = width * PAD;
  marginY = height * PAD;
  artW = width - marginX * 2;
  artH = height - marginY * 2;
  anchorX = artW * 0.22;
  anchorY = artH * 0.23;
  if (topSticker) topSticker.move(anchorX, anchorY);
  if (nextSticker) nextSticker.move(anchorX, anchorY);
}

export function windowResizedTheAnswerScene() {
  resizeCanvas(windowWidth, windowHeight);
  calcLayout();
}

/* ---------- sticker cycle ---------- */
function initStack() {
  topSticker = makeSticker(idx);
  nextSticker = makeSticker((idx + 1) % answers.length);
}

function advance() {
  idx = (idx + 1) % answers.length;
  topSticker = nextSticker;
  nextSticker = makeSticker((idx + 1) % answers.length);
}

function makeSticker(i) {
  const shape = SHAPES[i % SHAPES.length];
  const col = COLOURS[i % COLOURS.length];
  const angle = random(-15, 15);
  return new Sticker(anchorX, anchorY, answers[i], shape, col, angle);
}

/* ---------- second screen ---------- */
function enterShowAll() {
  showAll = true;
  allStickers = [];

  for (let i = 0; i < answers.length; i++) {
    const s = makeSticker(i);

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 1000) {
      s.x = random(artW * 0.1, artW * 0.9);
      s.y = random(artH * 0.2, artH * 0.9);
      placed = true;

      for (let j = 0; j < allStickers.length; j++) {
        if (
          rectsOverlap(
            s.x,
            s.y,
            s.w,
            s.h,
            allStickers[j].x,
            allStickers[j].y,
            allStickers[j].w,
            allStickers[j].h,
            15
          )
        ) {
          placed = false;
          break;
        }
      }
      attempts++;
    }
    allStickers.push(s);
  }
}

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2, pad = 10) {
  return !(
    x1 + w1 / 2 + pad < x2 - w2 / 2 ||
    x1 - w1 / 2 - pad > x2 + w2 / 2 ||
    y1 + h1 / 2 + pad < y2 - h2 / 2 ||
    y1 - h1 / 2 - pad > y2 + h2 / 2
  );
}

function drawVotes(sticker, i) {
  push();
  translate(sticker.x, sticker.y);
  rotate(sticker.ang);
  fill(0);
  textFont(grotta);
  textSize(sticker.txtSize * 0.5);
  textAlign(CENTER, BOTTOM);
  const count = answerCounts[i].count + i === idx ? 1 : 0;
  text(`${count} vote${count !== 1 ? "s" : ""}`, 0, -sticker.txtSize * 0.3);
  pop();
}

/* ---------- mouse ---------- */
export function mousePressedTheAnswerScene() {
  console.log(getTheAnswerUserPick());

  // submit button?
  if (!showAll && btnBox) {
    if (
      mouseX >= btnBox.x &&
      mouseX <= btnBox.x + btnBox.w &&
      mouseY >= btnBox.y &&
      mouseY <= btnBox.y + btnBox.h
    ) {
      enterShowAll();
      cursor(ARROW);
      return;
    }
  }

  const mx = mouseX - marginX;
  const my = mouseY - marginY;

  if (!topSticker) return;
  const rad = max(topSticker.w, topSticker.h) * 0.6;
  if (dist(mx, my, topSticker.x, topSticker.y) < rad) {
    dragging = true;
    dX = mx - topSticker.x;
    dY = my - topSticker.y;
  }
}

export function mouseDraggedTheAnswerScenee() {
  if (showAll && draggedSticker) {
    const mx = mouseX - marginX;
    const my = mouseY - marginY;

    const oldX = draggedSticker.x,
      oldY = draggedSticker.y;
    draggedSticker.x = mx - dX;
    draggedSticker.y = my - dY;

    for (let s of allStickers) {
      if (
        s !== draggedSticker &&
        rectsOverlap(
          draggedSticker.x,
          draggedSticker.y,
          draggedSticker.w,
          draggedSticker.h,
          s.x,
          s.y,
          s.w,
          s.h,
          5
        )
      ) {
        draggedSticker.x = oldX;
        draggedSticker.y = oldY;
        break;
      }
    }
  }

  if (!showAll && dragging && topSticker) {
    topSticker.x = mouseX - marginX - dX;
    topSticker.y = mouseY - marginY - dY;
  }
}

export function mouseReleasedTheAnswerScene() {
  if (showAll) {
    draggedSticker = null;
    return;
  }

  if (!dragging) return;
  dragging = false;
  const distFromAnchor = dist(topSticker.x, topSticker.y, anchorX, anchorY);
  const threshold = max(topSticker.w, topSticker.h) * 0.7;
  if (distFromAnchor > threshold) advance();
  else topSticker.move(anchorX, anchorY);
}

/* ---------- UI text ---------- */
function drawHint() {
  fill(0);
  const fs = max(10, artW * 0.015);
  textSize(fs);
  textFont(grotta);
  textAlign(CENTER, CENTER);
  text("drag to change and click submit to select", artW / 2, artH * 0.05);
}

function drawHeadline() {
  const lines = ["IS THE", "ANSWER TO", "ALL OUR", "PROBLEMS"];
  let fs = 340;
  textFont("Helvetica");
  for (let k = 0; k < 20; k++) {
    textSize(fs);
    textStyle(BOLDITALIC);
    const w = Math.max(...lines.map((t) => textWidth(t)));
    const h = fs + fs * 0.93 * 3;
    if (w <= artW * 0.9 && h <= artH * 0.85) break;
    fs *= 0.9;
  }
  push();
  textSize(fs);
  textStyle(BOLDITALIC);
  textLeading(fs * 0.93);
  textAlign(CENTER, TOP);
  translate(artW / 2, artH * 0.12);
  text(lines.join("\n"), 0, 0);
  pop();
}

/* ---------- Sticker class ---------- */
class Sticker {
  constructor(x, y, lbl, shp, col, angDeg) {
    this.x = x;
    this.y = y;
    this.lbl = lbl;
    this.shape = shp;
    this.col = col;
    this.ang = radians(angDeg);
    this.resize();
  }

  move(nx, ny) {
    this.x = nx;
    this.y = ny;
  }

  resize() {
    const fs = max(16, artW * 0.025);
    this.txtSize = fs;
    textFont(grotta);
    textSize(fs);
    this.w = textWidth(this.lbl) + fs * 2.5;
    this.h = fs * 3.2;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    noStroke();
    fill(this.col);

    if (this.shape === "capsule") {
      rect(-this.w / 2, -this.h / 2, this.w, this.h, this.h / 2);
    } else if (this.shape === "circle") {
      ellipse(0, 0, this.w * 1.2, this.h * 1.2);
    } else {
      this.drawStar();
    }

    // label
    fill(0);
    textFont(grotta);
    textSize(this.txtSize);
    textAlign(CENTER, CENTER); // always center the label
    text(this.lbl, 0, 0);
    pop();
  }

  drawStar() {
    const pts = 12,
      R = max(this.w, this.h) * 0.55,
      r = R * 0.8;
    beginShape();
    for (let i = 0; i <= pts; i++) {
      const a = (i * TWO_PI) / pts;
      const ax = cos(a) * R,
        ay = sin(a) * R;
      const bx = cos(a + PI / pts) * r,
        by = sin(a + PI / pts) * r;
      curveVertex(ax, ay);
      curveVertex(bx, by);
    }
    endShape(CLOSE);
  }
}

//lior's code
export const getTheAnswerUserPick = () => answers[idx];

export const didUserSubmitTheAnswer = () => showAll;
