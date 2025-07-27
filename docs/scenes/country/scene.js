/*  ----------------------------------------------------------
    Boarding-Pass “Reasons to Leave” · FINAL p5.js sketch
    • Scene 1 : ticket, animated barcode stickers, scanner cursor
                - plays bingbong.mp3 + airportvoice.mp3 simultaneously
    • Loader  : yellow pill that fills while “calculating”
               (airplaneyellow.svg rides ahead & vanishes early)
    • Scene 2 : centred split-flap board
    • DOM “Check in” button (hidden until sticker scanned, hover style)
    ---------------------------------------------------------- */

import { recordDomElement } from "../../scene-managment/domManager.js";
import { playSound } from "../../soundManager.js";
import { getCountryCounts } from "./logic.js";

/* ───────── ASSETS ───────── */
let grottaMedium,
  grottaBold,
  snellScript,
  barcodeFont,
  perfogramaFont,
  scannerCursor,
  backgroundImg,
  airplaneImg,
  loaderPlaneImg,
  bingBong, // chime
  airportVoice, // PA announcement
  scannerBeep;

/* ───────── CONSTANTS ───────── */
const baseWidth = 1920;
const baseHeight = 1080;
const BARCODE_SIZE = 89;

/* ───────── STATE ───────── */
let stickers = []; //lior's code. changed from const to let
let easedCursor = 200,
  glow = false,
  glowTimer = 0,
  boardActive = false,
  boardRows = [],
  boardStart = 0,
  boardDone = false; //lior's code

/* loader state */
let loading = false;
let loadStart = 0;
const LOAD_TIME = 3000; // 3-second fill

/* play-once flag for chime+voice */
let paPlayed = false;

/* ───────── STICKERS TEXT & POSITIONS (lior's code) ───────── */
const stickerPos = [
  { label: "education", x: 800, y: 700 },
  { label: "peace of mind", x: 1150, y: 350 },
  { label: "love", x: 1500, y: 200 },
  { label: "a better future", x: 1300, y: 530 },
  { label: "anything", x: 350, y: 200 },
  { label: "nothing", x: 160, y: 350 },
  { label: "a better job", x: 1000, y: 180 },
  { label: "hope", x: 1150, y: 650 },
  { label: "a working government", x: 170, y: 630 },
];

/* ───────────────── preload ───────────────── */
export function preloadCountryScene() {
  grottaMedium = loadFont("./assets/Grotta-Trial-Medium.otf");
  grottaBold = loadFont("./assets/Grotta-Trial-Bold.otf");
  snellScript = loadFont("./assets/SnellRoundhand-BoldScript.otf");
  barcodeFont = loadFont("./assets/LibreBarcode128Text-Regular.ttf");
  perfogramaFont = loadFont("./assets/Perfograma.otf");
  scannerCursor = loadImage("./assets/scaner.png");
  backgroundImg = loadImage("./assets/backgroundIMG.png");
  airplaneImg = loadImage("./assets/airplane.svg");
  loaderPlaneImg = loadImage("./assets/airplaneyellow.svg");

  bingBong = loadSound("./assets/bingbong.mp3");
  airportVoice = loadSound("./assets/airportvoice.mp3");
  scannerBeep = loadSound("./assets/Scanner.mp3");
}

/* ───────────────── setup ───────────────── */
export async function setupCountryScene() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio(); // unlocks audio on first click
  textAlign(LEFT, TOP);
  noCursor();

  /* stickers */
  const serverScanCounts = await getCountryCounts();
  stickers = stickerPos.map(
    ({ label, x, y }) =>
      new Sticker(
        label,
        x,
        y,
        serverScanCounts ? (serverScanCounts[label] ?? 0) : 0
      )
  );

  createDoneButton();
}

export function windowResizedCountryScene() {
  resizeCanvas(windowWidth, windowHeight);
}

/* ───────────────── main draw ───────────────── */

export function drawCountryScene() {
  clear();
  drawResponsiveBackground(backgroundImg);

  if (loading) drawLoadingBar();
  else if (!boardActive) drawScene1();
  else drawFlightBoard();
}

/* ---------- responsive bg ---------- */
function drawResponsiveBackground(img) {
  imageMode(CENTER);
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let dw, dh;
  if (canvasAspect > imgAspect) {
    dw = width;
    dh = width / imgAspect;
  } else {
    dh = height;
    dw = height * imgAspect;
  }
  image(img, width / 2, height / 2, dw, dh);
}

/* ==========================================================
   Scene 1 : ticket + stickers + cursor + PA audio
   ========================================================== */
function drawScene1() {
  noCursor();
  /* play bing-bong and airport voice together (once) */
  if (!paPlayed && (bingBong.isLoaded() || airportVoice.isLoaded())) {
    paPlayed = true;
    playSound(bingBong, { withOverlapping: false });
    playSound(airportVoice, { withOverlapping: false });
  }

  const s = min(width / baseWidth, height / baseHeight);
  const offX = (width - baseWidth * s) / 2;
  const offY = (height - baseHeight * s) / 2;

  push();
  translate(offX, offY);
  scale(s);
  drawTicket();
  stickers.forEach((st) => {
    st.update(s);
    st.display();
  });
  pop();
  updateCursor(s);
}

/* ---------- ticket & airplane ---------- */
function drawTicket() {
  const cardW = 1600,
    cardH = 680;
  push();
  translate(baseWidth / 2, baseHeight / 2);
  rotate(-0.06);

  fill(255);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, cardW, cardH, 8);

  fill(0, 100, 255);
  const barW = cardW * 0.95,
    barH = 12;
  rect(0, -cardH / 2 + barH / 2, barW, barH);
  rect(0, cardH / 2 - barH / 2, barW, barH);

  stroke(0);
  strokeWeight(1.5);
  drawingContext.setLineDash([8, 8]);
  line(cardW / 2 - 100, -cardH / 2 + 20, cardW / 2 - 100, cardH / 2 - 20);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0);

  textAlign(LEFT, TOP); //lior's code important!
  textFont(grottaMedium);
  textSize(45);
  const lp = -cardW / 2 + 80,
    tp = -cardH / 2 + 80;
  text("Scan all the", lp + 360, tp + 90);
  text("reasons to leave your", lp + 360, tp + 130);

  textFont(snellScript);
  textSize(200);
  const cX = lp + 160,
    cY = tp + 100;
  text("Country", cX, cY);

  if (airplaneImg) {
    const aX = cX + textWidth("Country") + 30;
    imageMode(CENTER);
    image(airplaneImg, aX, cY, 60, 60);
  }
  pop();
}

/* ---------- Sticker class ---------- */
class Sticker {
  constructor(label, x, y, scans = 0) {
    this.label = label;
    this.baseX = x;
    this.baseY = y;
    this.rotation = random(-0.25, 0.25);
    this.scans = scans; //lior's code. changed from 0
    this.scanProg = 0;
    this.padX = 40;
    this.padY = 35;
    this.wx = random(TWO_PI);
    this.wy = random(TWO_PI);
    this.wz = random(TWO_PI);
    this.wSpeed = random(0.01, 0.02);
    this.wAmp = random(2.5, 7.0);
    this.rOff = random(TWO_PI);
    this.sOff = random(TWO_PI);

    this.userScanned = false; //lior's code
  }

  update(s) {
    const mx = (mouseX - (width - baseWidth * s) / 2) / s;
    const my = (mouseY - (height - baseHeight * s) / 2) / s;

    textFont(barcodeFont);
    textSize(BARCODE_SIZE);
    const w = textWidth(this.label) + this.padX * 2;
    const h = textAscent() + textDescent() + this.padY * 2;
    const inside =
      mx > this.baseX &&
      mx < this.baseX + w &&
      my > this.baseY &&
      my < this.baseY + h;

    if (mouseIsPressed && inside) {
      this.scanProg = constrain(this.scanProg + 0.01, 0, 1);
      if (this.scanProg === 1 && !this.userScanned) {
        this.userScanned = true;
        this.scans += 1;
        glow = true;
        glowTimer = 10;
        playSound(scannerBeep);
      }
    } else if (!mouseIsPressed && !this.userScanned) {
      this.scanProg = 0;
    }
  }

  display() {
    const t = frameCount * this.wSpeed;
    let x =
      this.baseX +
      sin(t + this.wx) * this.wAmp +
      sin(t * 2.3 + this.wy) * this.wAmp * 0.3;
    let y =
      this.baseY +
      cos(t * 0.8 + this.wy) * this.wAmp * 0.7 +
      cos(t * 1.7 + this.wz) * this.wAmp * 0.2;

    textFont(barcodeFont);
    textSize(BARCODE_SIZE);
    const w = textWidth(this.label) + this.padX * 2;
    const h = textAscent() + textDescent() + this.padY * 2;

    push();
    translate(x + w / 2, y + h / 2);
    rotate(this.rotation + sin(t * 0.7 + this.rOff) * 0.008);
    scale(1 + sin(t * 0.9 + this.sOff) * 0.008);
    translate(-w / 2, -h / 2);

    const c = lerpColor(color("#ff0"), color("#ff3b30"), this.scanProg);
    fill(c);
    noStroke();
    rect(0, 0, w, h, 6);

    if (this.scanProg > 0 && !this.userScanned) {
      const wave = (sin(this.scanProg * PI * 1.5) + 1) / 2;
      stroke(255, 255, 255, 150);
      strokeWeight(2);
      line(0, wave * h, w, wave * h);
      noStroke();
    }

    fill(red(c) * 0.8, green(c) * 0.8, blue(c) * 0.8);
    beginShape();
    vertex(w, h);
    vertex(w, h);
    vertex(w, h);
    endShape(CLOSE);

    fill(0);
    textAlign(LEFT, TOP); //lior's code important!
    text(this.label, this.padX, this.padY);
    pop();
  }

  isInside(mx, my) {
    textFont(barcodeFont);
    textSize(BARCODE_SIZE);
    const w = textWidth(this.label) + this.padX * 2;
    const h = textAscent() + textDescent() + this.padY * 2;
    return (
      mx > this.baseX &&
      mx < this.baseX + w &&
      my > this.baseY &&
      my < this.baseY + h
    );
  }
}

/* ---------- cursor (Scene 1 only) ---------- */
function isHovering(s) {
  const mx = (mouseX - (width - baseWidth * s) / 2) / s;
  const my = (mouseY - (height - baseHeight * s) / 2) / s;
  return stickers.some((st) => st.isInside(mx, my));
}
function updateCursor(s) {
  if (glow && --glowTimer <= 0) glow = false;
  let target = glow ? 220 : 200;
  if (isHovering(s)) target *= 0.8;
  easedCursor = lerp(easedCursor, target, 0.1);
  imageMode(CENTER);
  tint(255, glow ? 255 : 200);
  image(scannerCursor, mouseX, mouseY, easedCursor, easedCursor * 0.6);
  noTint();
}

export function onDone() {
  boardRows = stickers.map((st) => ({
    amount: String(st.scans),
    reason: st.label.toUpperCase(),
  }));
  loading = true;
  loadStart = millis();
  noCursor();
}

/* ==========================================================
   Loading bar : yellow pill that fills while “calculating”
   ========================================================== */
function drawLoadingBar() {
  const prog = constrain((millis() - loadStart) / LOAD_TIME, 0, 1);

  /* pill geometry */
  const barW = width * 0.4;
  const barH = barW * 0.15;
  const barX = width / 2 - barW / 2;
  const barY = height / 2 - barH / 2;
  const rad = barH / 2;
  const sW = 2; // thin outline
  const pad = sW * 2; // inner padding
  const gap = Math.max(barH * 0.3, 24); // plane-ahead distance
  const margin = Math.max(barH * 0.2, 30); // early vanish

  /* widths */
  const innerW = barW - pad * 2;
  const fillW = innerW * prog;

  /* background & fill */
  noStroke();
  fill(220, 220, 220, 40);
  rect(barX, barY, barW, barH, rad);

  noStroke();
  fill("#ff0");
  rect(barX + pad, barY + pad, fillW, barH - pad * 2, rad - pad);

  /* airplane icon עם clipping mask */
  if (loaderPlaneImg) {
    const ico = barH * 0.8;
    const planeX = barX + pad + fillW + gap;

    // יצירת clipping mask בצורת הפיל
    push();
    // יצירת mask path
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.roundRect(barX, barY, barW, barH, rad);
    drawingContext.clip();

    // ציור המטוס בתוך ה-clip
    imageMode(CENTER);
    image(loaderPlaneImg, planeX, barY + barH / 2, ico, ico);

    drawingContext.restore();
    pop();
  }

  /* outline */
  noFill();
  stroke("#ff0");
  strokeWeight(sW);
  rect(barX, barY, barW, barH, rad);

  /* when full → board */
  if (prog >= 1) {
    loading = false;
    boardActive = true;
    boardStart = millis();
  }
}

/* ==========================================================
   Scene 2 : centred split-flap board
   ========================================================== */
function drawFlightBoard() {
  cursor();

  fill(35, 23, 23, 200);
  noStroke();

  /* layout + timing */
  const BL = 0,
    AC = 4,
    GAP = 1,
    RC = 20,
    GU = 2;
  const MAX = BL + AC + GAP + RC + 1;
  const ROW_DELAY = 400,
    LET_DELAY = 90,
    FLIP = 600;
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const SIDE = width * 0.07;
  let bW = width - SIDE * 2;
  const k = 0.14,
    g = 0.3;
  let cell = (bW - (MAX - 1) * GU) / (MAX + 2 * (k + g));

  const headCells = 2.4;
  const pad = cell * (k + g);
  const OFF = cell * 0.8;
  let headH = headCells * cell;
  let gridH = boardRows.length * cell + (boardRows.length - 1) * GU;
  let bH = headH + pad + OFF + gridH + pad;

  const LIM = height * 0.88;
  if (bH > LIM) {
    cell =
      (LIM - 2 * pad - OFF - (boardRows.length - 1) * GU) /
      (headCells + boardRows.length);
    headH = headCells * cell;
    gridH = boardRows.length * cell + (boardRows.length - 1) * GU;
    bH = headH + pad + OFF + gridH + pad;
  }

  const bX = (width - bW) / 2;
  const bY = (height - bH) / 2;

  stroke("#ff0");
  strokeWeight(cell * k);
  noFill();
  rect(bX, bY, bW, bH, cell * 0.4);

  noStroke();
  fill("#231717");
  rect(bX, bY, bW, bH, cell * 0.4);

  strokeWeight(cell * 0.06);
  stroke("#ff0");
  line(bX, bY + headH, bX + bW, bY + headH);

  const ico = cell * 1.5;
  fill("#ff0");
  noStroke();
  rect(bX + pad, bY + (headH - ico) / 2, ico, ico, cell * 0.25);
  if (airplaneImg) {
    imageMode(CENTER);
    image(
      airplaneImg,
      bX + pad + ico / 2,
      bY + headH / 2,
      ico * 0.8,
      ico * 0.8
    );
  }

  fill("#ff0");
  textFont(grottaMedium);
  textSize(cell * 1.45);
  textAlign(LEFT, CENTER);
  text("All Results", bX + pad + ico + cell * 0.8, bY + headH / 2);

  textSize(cell * 0.6);
  textAlign(CENTER, CENTER);
  const hY = bY + headH + pad + cell * 0.2;
  const aX = bX + pad + BL * (cell + GU);
  const rX = aX + (AC + GAP) * (cell + GU);
  const aCX = aX + (AC * cell + (AC - 1) * GU) / 2;
  const rCX = rX + (RC * cell + (RC - 1) * GU) / 2;
  text("AMOUNT", aCX, hY);
  text("REASON", rCX, hY);

  const gY = bY + headH + pad + OFF;
  const now = millis();

  boardRows.forEach((row, rowIdx) => {
    const y = gY + rowIdx * (cell + GU);
    drawRow(row.amount, aX, y, AC, rowIdx);
    drawRow(row.reason, rX, y, RC, rowIdx);
  });

  function drawRow(str, startX, y, slots, rowIdx) {
    textFont(perfogramaFont);
    textSize(cell * 0.8);

    for (let i = 0; i < slots; i++) {
      const x = startX + i * (cell + GU);
      fill(0);
      stroke("#231717");
      strokeWeight(cell * 0.06); // שונה מ-stroke(60) לצבע הרקע
      rect(x, y, cell, cell);

      const ls = boardStart + rowIdx * ROW_DELAY + i * LET_DELAY;
      const le = ls + FLIP;
      let ch = "";
      if (now >= le) ch = str[i] || " ";
      else if (now >= ls) ch = CH.charAt(floor(random(CH.length)));

      if (ch !== " ") {
        fill("#ff0");
        noStroke();
        textAlign(CENTER, CENTER);
        text(ch, x + cell / 2, y + cell / 2);
      }
    }
  }

  //lior's code
  let totalRows = boardRows.length;
  let lastRowIdx = totalRows - 1;
  let lastCharIdx = Math.max(AC, RC) - 1; // longest column
  let lastFlipTime =
    boardStart + lastRowIdx * ROW_DELAY + lastCharIdx * LET_DELAY + FLIP;
  boardDone = millis() > lastFlipTime;
}

export const getCountryUserPicks = () =>
  stickers
    .filter((sticker) => sticker.userScanned)
    .map((sticker) => sticker.label);

export const didUserFinishCountyScene = () => boardDone;

export const didUserScan = () => stickers.some((st) => st.userScanned);
