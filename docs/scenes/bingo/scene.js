/* ------------------------------------------------------------------
   BEST • TV SHOWS  –  interactive poll poster (p5.js 1.9.x)
------------------------------------------------------------------- */

const BG = "#131217",
  BLUE = "#2031FF",
  YEL = "#FFC500",
  OFFWHITE = "#FFFDFA";

/* --- סדרות --- */
const shows4x4 = [
  ["BREAKING\nBAD", "GAME OF\nTHRONES", "FRIENDS", "SEINFELD"],
  ["HOW I MET\nYOUR MOTHER", "SEX AND THE CITY", "THE\nSOPRANOS", "MAD MEN"],
  ["LOST", "BETTER CALL\nSAUL", "THE WHITE LOTUS", "STRANGER\nTHINGS"],
  ["BLACK\nMIRROR", "THE OFFICE", "SUCCESSION", "my show\nis not here."],
];

/* --- מוני הצבעות --- */
let votes4x4 = Array.from({ length: 4 }, () => Array(4).fill(0));

/* --- פונט Snell --- */
let snell;
export function preloadBingoScene() {
  snell = loadFont("./assets/snellroundhand_black.otf");
}

export function setupBingoScene() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
}

export function drawBingoScene() {
  background(BG);
  drawBursts();

  /* === חישובי פוסטר וגריד === */
  const pW = constrain(min(width, height) * 0.7, 260, 620);
  const pX = width / 2 - pW / 2;
  const pY = height / 2 - (pW * 1.25) / 2;
  const m = pW * 0.08;

  const bestSz = constrain(pW * 0.11, 16, 64);
  const tvSz = constrain(pW * 0.16, 22, 90);

  const rows = 4;
  const shows = shows4x4;
  const votes = votes4x4;

  const gridSide = pW - m * 2;
  const cell = gridSide / rows;
  const topPad = m * 4.2;
  const botPad = m * 0.9;
  const pH = topPad + gridSide + botPad;

  /* --- רקע פוסטר כחול + מסגרת צהובה --- */
  stroke(YEL);
  strokeWeight(pW * 0.006);
  fill(BLUE);
  rect(pX, pY, pW, pH, pW * 0.012);

  const gX = pX + m; // grid left
  const gY = pY + topPad; // grid top

  /* ---------- כותרות ---------- */
  textAlign(LEFT, TOP);

  // “Best”
  push();
  textFont(snell || "Georgia");
  textSize(bestSz);
  fill(255);
  stroke(0);
  strokeWeight(bestSz * 0.04);
  text("Best", gX, pY + m * 0.25);
  pop();

  // “TV SHOWS”
  const tvY = pY + m * 1.65;
  push();
  textFont("Helvetica");
  textStyle(BOLD);
  textSize(tvSz);
  fill(255);
  stroke(0);
  strokeWeight(tvSz * 0.04);
  text("TV SHOWS", gX, tvY);
  pop();

  // Divider line
  const dividerY = tvY + tvSz * 1.05;
  stroke(255);
  strokeWeight(2);
  line(gX, dividerY, gX + gridSide, dividerY);

  /* ---------- גריד אינטראקטיבי ---------- */
  const fsFactor = 0.34; // בסיס לגודל פונט בתאים
  let fs = cell * fsFactor;
  while (fs > 8 && !allFit(shows, fs, cell)) fs--;
  const leading = fs * 1.15;

  textFont("Helvetica");
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows; c++) {
      /* רקע התא – צהוב אם יש הצבעה */
      fill(votes[r][c] > 0 ? YEL : OFFWHITE);
      noStroke();
      rect(gX + c * cell, gY + r * cell, cell, cell);

      /* שם הסדרה */
      const cx = gX + c * cell + cell / 2;
      const cy = gY + r * cell + cell / 2;
      const lines = shows[r][c].split("\n");
      const blockH = leading * (lines.length - 1);

      fill(BLUE);
      textSize(fs);
      for (let i = 0; i < lines.length; i++) {
        text(lines[i], cx, cy - blockH / 2 + i * leading);
      }

      /* מונה הצבעות – גדול, ללא סוגריים, נמוך יותר */
      if (votes[r][c] > 0) {
        const voteFS = fs * 1.25; // גדול יותר
        const voteYOff = blockH / 2 + fs * 2.0; // מרווח גדול יותר
        textSize(voteFS);
        text(votes[r][c], cx, cy + voteYOff);
      }
    }
  }

  /* קווי רשת מעל תאים */
  stroke(BLUE);
  strokeWeight(max(1, pW * 0.002));
  noFill();
  rect(gX, gY, gridSide, gridSide);
  for (let i = 1; i < rows; i++) {
    line(gX + i * cell, gY, gX + i * cell, gY + gridSide);
    line(gX, gY + i * cell, gX + gridSide, gY + i * cell);
  }

  /* כוכב במרכז */
  fill(BLUE);
  noStroke();
  const starR = cell * 0.11;
  star(gX + gridSide / 2, gY + gridSide / 2, starR, starR * 0.55, 8);

  /* שומר מידע ל-mousePressed */
  gridGeom = { gX, gY, cell, rows };
}

/* --- קליק: צביעה + ספירה --- */
let gridGeom;
export function mousePressedBingoScene() {
  console.log(gridGeom);
  if (!gridGeom) return;
  const { gX, gY, cell, rows } = gridGeom;

  if (
    mouseX < gX ||
    mouseX > gX + cell * rows ||
    mouseY < gY ||
    mouseY > gY + cell * rows
  )
    return;

  console.log("noder");
  const c = floor((mouseX - gX) / cell);
  const r = floor((mouseY - gY) / cell);
  if (r < 0 || c < 0 || r >= rows || c >= rows) return;
  /* עדכון מונה */ else votes4x4[r][c]++;

  //   redraw();
}

/* ---------- פונקציות עזר ---------- */
function allFit(arr, fs, cellW) {
  textSize(fs);
  const lead = fs * 1.15;
  for (const row of arr)
    for (const t of row) {
      const L = t.split("\n");
      const maxW = Math.max(...L.map((l) => textWidth(l)));
      const blockH = lead * (L.length - 1);
      if (maxW > cellW * 0.85 || blockH > cellW * 0.85) return false;
    }
  return true;
}

function star(x, y, r1, r2, n, rot = 0) {
  beginShape();
  for (let i = 0; i < n * 2; i++) {
    const a = (i * 180) / n + rot;
    const r = i % 2 === 0 ? r1 : r2;
    vertex(x + cos(a) * r, y + sin(a) * r);
  }
  endShape(CLOSE);
}

function drawBursts() {
  noStroke();
  fill(YEL);
  star(-width * 0.2, height * 0.1, width * 0.55, width * 0.25, 12);
  star(width * 1.1, height * 0.65, width * 0.6, width * 0.27, 11);
}

export function windowResizedBingoScene() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
