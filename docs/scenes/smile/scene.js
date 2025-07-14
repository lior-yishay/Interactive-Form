import { getSmileLeaderboard, getTotalSmileTime, postSmile } from "./logic.js";
import {
  getDetections,
  getVideo,
  getVideoDimensions,
  startFaceDetection,
} from "./videoManager.js";

let snellFont, grottaFont;
let smileImg;

//lior's code
let durationList = [];
let currentBestFrame;
let overallBestFrame;
let overallBestHappy = 0;

export function preloadSmileScene() {
  bannerIconImg = loadImage("./assets/bird.png");
  grottaFont = loadFont("./assets/Grotta-Trial-Medium.ttf");
  snellFont = loadFont("./assets/SnellBT-Regular.otf");
  smileImg = loadImage("./assets/imgnostroke.png"); // 🟡 load smile image
}

const FONT_FAMILY = "Helvetica";
const PROG_SPEED = 1 / 7200;

let coverS = 1,
  offX = 0,
  offY = 0;
let bannerIconImg = null;
let yourSmileDuration = 0;
let prevSmileActive = false;
let smileStopped = false;
let leaderboard = [];
let peaceProgress = 0;
let totalSmileFrames = 0;
let stopSmileFrame = null;
let currentBestHappy = 0;
// Global variable to track current session smile time
let currentSessionSmileTime = 0;

//popup message
let popupMessage = "";
let popupTimer = 0;
const POPUP_DURATION = 180; // 3 seconds at 60 FPS

// 🟡 Bouncing smile images
let bouncingSmiles = [];

const maxTimeForSmileBar = 300; //5 min

// ▸ Achievement indicators ON TOP of progress bar - positioned by their smile duration
const achievementColors = [
  "#ffd900", // Gold for 1st
  "#c0c0c0", // Silver for 2nd
  "#cd8032", // Bronze for 3rd
];

export async function setupSmileScene() {
  createCanvas(windowWidth, windowHeight);
  textFont(FONT_FAMILY);
  imageMode(CORNER);
  cursor();

  startFaceDetection();
  leaderboard = await getSmileLeaderboard();
  totalSmileFrames = await getTotalSmileTime();
}

export function drawSmileScene() {
  background(0);
  cursor("default");
  computeCover();
  drawVideo();
  drawFaceBoxes();
  drawMouthOverlay();
  updateSmileTracking();
  drawLeaderboard();
  drawBannerLoader();
  drawBouncingSmiles(); // 🟡 draw bouncing smiles

  if (smileStopped && stopSmileFrame) {
    stroke(255, 0, 0);
    strokeWeight(3);
    noFill();
    const r = stopSmileFrame;
    rect(r.x, r.y, r.w, r.h);
  }

  // Fixed popup code - slides from left
  if (popupTimer > 0) {
    const pad = 15;
    const msgSize = height * 0.035; // Much smaller text size
    const totalDuration = POPUP_DURATION;
    const progress = 1 - popupTimer / totalDuration;

    // 🟡 Slide in from left animation
    const slideProgress = Math.min(progress * 3, 1); // Faster slide in
    const slideOffset = (1 - slideProgress) * -300; // Slide from left

    // Fade out in last 25% of duration
    let alpha = 255;
    if (progress > 0.75) {
      alpha = map(progress, 0.75, 1, 255, 0);
    }

    // Calculate banner position to align with it
    const margin = 30;
    const bw = min(width - margin * 2, 1200);
    const bannerX0 = (width - bw) / 2; // Same calculation as in drawBannerLoader

    textFont(grottaFont);
    textSize(msgSize);
    const messageWidth = textWidth(popupMessage);
    const w = messageWidth + pad * 2;
    const h = msgSize + pad * 1.5;
    const x = bannerX0 + slideOffset; // Align exactly with banner background left edge
    const y = height * 0.15; // Upper portion of screen

    // ▸ Simple notification background - red with white stripe
    noStroke();
    fill("#DC5032"); // Red background
    rect(x, y, w, h, 6);

    // White stripe on left side
    fill(255, alpha);
    rect(x, y, 4, h, 6, 0, 0, 6);

    // ▸ Main notification text - centered
    textFont(grottaFont);
    textSize(msgSize);
    textAlign(LEFT, CENTER);
    fill(255, alpha);
    text(popupMessage, x + pad, y + h / 2);

    popupTimer--;
  }
}

export function windowResizedSmileScene() {
  resizeCanvas(windowWidth, windowHeight);
}

function computeCover() {
  const { vidW, vidH } = getVideoDimensions();
  coverS = max(width / vidW, height / vidH);
  offX = (width - vidW * coverS) / 2;
  offY = (height - vidH * coverS) / 2;
}

function v2cX(px) {
  return width - (offX + px * coverS);
}

function v2cY(py) {
  return offY + py * coverS;
}

function drawBouncingSmiles() {
  for (let s of bouncingSmiles) {
    s.x += s.vx;
    s.y += s.vy;

    if (s.x < 0 || s.x + s.size > width) s.vx *= -1;
    if (s.y < 0 || s.y + s.size > height) s.vy *= -1;

    image(smileImg, s.x, s.y, s.size, s.size);
  }
}

function drawVideo() {
  const { vidW, vidH } = getVideoDimensions();

  push();
  translate(width, 0);
  scale(-1, 1);
  image(getVideo(), offX, offY, vidW * coverS, vidH * coverS);
  pop();
}

function drawFaceBoxes() {
  getDetections().forEach((d) => {
    const b = d.alignedRect._box;
    stroke(255);
    noFill();
    strokeWeight(1);
    rect(
      v2cX(b._x + b._width),
      v2cY(b._y),
      b._width * coverS,
      b._height * coverS
    );
  });
}

function drawMouthOverlay() {
  getDetections().forEach((d) => {
    const happy = d.expressions.happy;
    if (happy <= 0.95) return;
    if (happy > currentBestHappy) {
      currentBestHappy = happy;
      currentBestFrame = captureMirroredVideo();
    }
    if (happy > overallBestHappy) {
      overallBestHappy = happy;
      overallBestFrame = captureMirroredVideo();
    }
    const pts = d.landmarks.positions.slice(48, 68);
    let minX = width,
      minY = height,
      maxX = 0,
      maxY = 0;
    pts.forEach((p) => {
      const cx = v2cX(p._x),
        cy = v2cY(p._y);
      minX = min(minX, cx);
      maxX = max(maxX, cx);
      minY = min(minY, cy);
      maxY = max(maxY, cy);
    });
    const m = 6,
      rx = minX - m,
      ry = minY - m,
      rw = maxX - minX + m * 2,
      rh = maxY - minY + m * 2;
    stroke(255, 255, 0);
    strokeWeight(2);
    noFill();
    rect(rx, ry, rw, rh);
    const pad = 4;
    textFont(FONT_FAMILY); // ✅ Always use Helvetica for smile label
    textSize(height * 0.02);
    const lh = textAscent() + textDescent();
    fill(255, 255, 0);
    noStroke();

    const top = "#Smile#",
      tw = textWidth(top) + pad * 2,
      th = lh + pad * 2;
    rect(rx, ry - th, tw, th);
    fill(0);
    textAlign(LEFT, TOP);
    text(top, rx + pad, ry - th + pad);
    const tot = floor(yourSmileDuration / 60),
      mn = floor(tot / 60),
      sc = tot % 60,
      bot = nf(mn, 2) + ":" + nf(sc, 2);
    const bw = textWidth(bot) + pad * 2,
      bh = lh + pad * 2,
      bx = rx + (rw - bw) / 2,
      by = ry + rh;
    fill(255, 255, 0);
    rect(bx, by, bw, bh);
    fill(0);
    textFont(FONT_FAMILY); // ✅ Helvetica for timer too
    text(bot, bx + pad, by + pad);
  });
}

function captureMirroredVideo() {
  const { vidW, vidH } = getVideoDimensions();
  const g = createGraphics(vidW, vidH);
  g.push();
  g.translate(vidW, 0);
  g.scale(-1, 1);
  g.image(getVideo(), 0, 0, vidW, vidH);
  g.pop();
  return g.get();
}

// 🟡 Smile spawn triggers in frames
const smileTriggers = [600, 1800, 3000, 3600]; // 10s, 30s, 50s, 60s
let smileSpawned = [false, false, false, false]; // tracks which smiles have appeared
const SMILE_SIZE = 60; // fixed size for all

function updateSmileTracking() {
  if (!getDetections().length) {
    peaceProgress = max(0, peaceProgress - PROG_SPEED);
    // Reset current session when not smiling
    currentSessionSmileTime = 0;
    return;
  }
  const primary = getDetections()[0];
  let smiling = 0;
  getDetections().forEach((d) => {
    if (d.expressions.happy > 0.95) smiling++;
  });

  if (smiling) {
    totalSmileFrames += smiling;
    peaceProgress = min(1, peaceProgress + PROG_SPEED * smiling);
    if (primary.expressions.happy > 0.95) {
      if (!prevSmileActive) {
        smileStopped = false;
        currentBestHappy = 0;
        currentBestFrame = null;
        // Reset session timer when starting new smile
        currentSessionSmileTime = 0;
      }
      yourSmileDuration++;
      currentSessionSmileTime += smiling; // Add all smiling faces to speed up time
      prevSmileActive = true;

      // 🟡 Spawn smiles at specific milestones
      for (let i = 0; i < smileTriggers.length; i++) {
        if (!smileSpawned[i] && yourSmileDuration >= smileTriggers[i]) {
          bouncingSmiles.push({
            x: random(width),
            y: random(height),
            vx: random(-3, 3),
            vy: random(-3, 3),
            size: SMILE_SIZE,
          });
          smileSpawned[i] = true;
        }
      }
    }
  } else {
    peaceProgress = max(0, peaceProgress - PROG_SPEED);
    // Reset current session when stopping smile
    currentSessionSmileTime = 0;

    if (prevSmileActive && !smileStopped) {
      const newEntry = {
        duration: yourSmileDuration,
        image: currentBestFrame || captureMirroredVideo(),
        isYours: true, // Mark this as your entry
      };
      leaderboard.push(newEntry);

      //lior's code
      durationList.push(yourSmileDuration);

      yourSmileDuration = 0;
      smileStopped = true;

      // 🟡 Reset for next smile attempt
      smileSpawned = [false, false, false, false];
      bouncingSmiles = [];

      const sorted = leaderboard.sort((a, b) => b.duration - a.duration);
      const rank = sorted.indexOf(newEntry);
      if (rank > -1 && rank < 3) {
        //show achievement popup
        const place = rank + 1;
        popupMessage = `${place}${place === 1 ? "st" : place === 2 ? "nd" : "rd"} place`;
        popupTimer = POPUP_DURATION;
      }

      const b = primary.alignedRect._box;
      stopSmileFrame = {
        x: v2cX(b._x + b._width),
        y: v2cY(b._y),
        w: b._width * coverS,
        h: b._height * coverS,
      };
    }
    prevSmileActive = false;
  }
}
function drawLeaderboard() {
  // Halved sizes for compact layout
  const scale = 0.7;

  const titleSize = height * 0.025 * scale;
  const gapBelowTitle = height * 0.035 * scale;
  const spacing = height * 0.025 * scale;
  const maxW = width * 0.15 * scale;
  const entryW = maxW;
  const aspectRatio = 3 / 4;
  const entryH = entryW * aspectRatio;
  const numEntries = min(leaderboard.length, 3);
  const startX = width - entryW - 40;
  const startY = 200 * scale; // MOVED UP: Changed from 300 to 200

  const places = ["1st", "2nd", "3rd"];

  // ▸ 1. Title with geometric background design
  const titleX = startX + entryW / 2;
  const titleY = startY;

  textFont(FONT_FAMILY); // CHANGED: Use Helvetica instead of grottaFont
  textSize(titleSize * 1.5); // Smaller text

  // Use same width as leaderboard entries for consistent look
  const titleRectWidth = entryW; // Same width as leaderboard images
  const textHeight = titleSize * 1.5;
  const padding = 12;

  // White rectangle for "Lead" - angled like in photo, same width as entries
  noStroke();
  fill(240, 240, 240); // Light gray background
  const leadRectHeight = textHeight + padding;

  // Create angled shape for "Lead" using quad
  beginShape();
  vertex(titleX - titleRectWidth / 2 - 20, titleY); // top left
  vertex(titleX + titleRectWidth / 2 - 20 + 20, titleY); // top right (extended)
  vertex(titleX + titleRectWidth / 2 - 20, titleY + leadRectHeight); // bottom right
  vertex(titleX - titleRectWidth / 2 - 20 - 20, titleY + leadRectHeight); // bottom left (extended)
  endShape(CLOSE);

  // Blue rectangle for "Board" - angled and touching, same width as entries
  fill(60, 60, 80); // Dark blue
  const boardRectHeight = textHeight + padding;
  const boardOffsetY = leadRectHeight; // No overlap - exactly touching

  // Create angled shape for "Board"
  beginShape();
  vertex(titleX - titleRectWidth / 2 - 20 + 20, titleY + boardOffsetY); // top left
  vertex(titleX + titleRectWidth / 2 - 20 + 40, titleY + boardOffsetY); // top right (extended)
  vertex(
    titleX + titleRectWidth / 2 - 20 + 20,
    titleY + boardOffsetY + boardRectHeight
  ); // bottom right
  vertex(
    titleX - titleRectWidth / 2 - 20,
    titleY + boardOffsetY + boardRectHeight
  ); // bottom left
  endShape(CLOSE);

  // Draw "Lead" text (dark on light)
  fill(60, 60, 80);
  textAlign(CENTER, CENTER);
  text("Lead", titleX - 40, titleY + leadRectHeight / 2);

  // Draw "Board" text (white on blue)
  fill(255);
  text("Board", titleX - 10 + 20, titleY + boardOffsetY + boardRectHeight / 2);

  // ▸ 2. Entries (no glassmorphism background)
  const titleTotalHeight = (titleSize * 1.5 + 12) * 2; // Exactly two rectangles touching
  for (let i = 0; i < numEntries; i++) {
    const e = leaderboard.sort((a, b) => b.duration - a.duration)[i];
    const x = startX;
    const y =
      startY + titleTotalHeight + gapBelowTitle + i * (entryH + spacing);

    image(e.image, x, y, entryW, entryH);
    noStroke();

    // REMOVED: No longer showing place text above the image

    // Timer with red background tag (like in photo)
    const fr = e.duration;
    const sec = floor(fr / 60);
    const mn = floor(sec / 60);
    const rm = sec % 60;
    const timeStr = nf(mn, 2) + ":" + nf(rm, 2);

    // Measure timer text for background
    textFont(FONT_FAMILY);
    textSize(entryH * 0.12); // SMALLER: Reduced from 0.14 to 0.12 for timer text
    const timerWidth = textWidth(timeStr);
    const timerHeight = textAscent() + textDescent();
    const timerPad = 4; // Reduced padding

    // FIXED: Place text positioning - put place text inside red background on the left
    // Measure place text
    const placeText = places[i];
    textFont(FONT_FAMILY); // CHANGED: Use Helvetica instead of snellFont
    textSize(entryH * 0.14); // SMALLER: Reduced from 0.18 to 0.14
    const placeWidth = textWidth(placeText);

    // Red background rectangle with angled right side (like "Board" title) - extends slightly beyond image
    const extensionAmount = 20; // How much to extend beyond the image
    const timerBgW = entryW + extensionAmount; // Extend beyond image width
    const timerBgH = timerHeight + timerPad * 2; // More padding for better look
    const timerBgX = x; // Start from left edge of image
    const timerBgY = y + entryH - timerBgH; // Flush with bottom edge
    const angleSize = 20; // Size of the angle on the right side

    fill(220, 80, 50); // Orange-red background
    noStroke();

    // Create rectangle with angled right side (OPPOSITE direction from "Board" title)
    beginShape();
    vertex(timerBgX, timerBgY); // top left
    vertex(timerBgX + timerBgW, timerBgY); // top right
    vertex(timerBgX + timerBgW - angleSize, timerBgY + timerBgH); // bottom right (angled - OPPOSITE direction)
    vertex(timerBgX, timerBgY + timerBgH); // bottom left
    endShape(CLOSE);

    // Place text with "place" word on the left side of red background (white on red) - NOT BOLD
    textFont(FONT_FAMILY); // Use Helvetica
    textStyle(NORMAL); // NOT BOLD
    textSize(entryH * 0.14); // SMALLER: reduced size
    textAlign(LEFT, CENTER);
    fill(255);
    const placeFullText = placeText + " place"; // Add "place" word
    text(placeFullText, timerBgX + timerPad * 2, timerBgY + timerBgH / 2);

    // Timer text on the right side of red background (white on red) - NOT BOLD
    textFont(FONT_FAMILY);
    textStyle(NORMAL); // NOT BOLD
    textSize(entryH * 0.12); // SMALLER: Matches the measurement size
    textAlign(RIGHT, CENTER);
    fill(255);
    text(timeStr, timerBgX + entryW - timerPad * 2, timerBgY + timerBgH / 2); // Use entryW instead of timerBgW to keep it within image bounds
  }
}
// Replace the entire drawBannerLoader() function with this code:
function drawBannerLoader() {
  const margin = 30;
  const totalHeight = height * 0.12; // Increased total height for the entire banner
  const redHeight = totalHeight * 0.25; // Smaller red section proportion
  const grayHeight = totalHeight * 0.8; // Much higher gray section

  // Responsive width - use most of screen width but with margins (made wider)
  const bw = min(width - margin * 1.5, 1300); // Wider: reduced margin and increased max width
  const x0 = (width - bw) / 2; // Center horizontally
  const x1 = x0 + bw;
  const y = height - totalHeight - margin - 20; // Move up by 20px

  const radius = 0; // Sharp corners like in photo
  const padding = 30;

  // ▸ Measure "TONIGHT'S QUESTION" text to size red section - make it angled and BIGGER
  textFont(FONT_FAMILY);
  textSize(redHeight * 0.65); // Increased from 0.45 to 0.65
  const redText = "TONIGHT'S QUESTION";
  const redTextWidth = textWidth(redText);
  const redSectionWidth = redTextWidth + padding * 2;

  // ▸ Red section for "TONIGHT'S QUESTION" - angled like in photo
  noStroke();
  fill(220, 80, 50); // Orange-red color

  // Create angled red section - less sharp angle, BIGGER
  beginShape();
  vertex(x0, y); // top left
  vertex(x0 + redSectionWidth + 25, y); // top right (bigger extension for larger text)
  vertex(x0 + redSectionWidth + 10, y + redHeight); // bottom right
  vertex(x0, y + redHeight); // bottom left
  endShape(CLOSE);

  // Red section text with more padding
  textAlign(LEFT, CENTER);
  fill(255); // White text
  text(redText, x0 + padding * 1.5, y + redHeight / 2); // Increased padding from padding to padding * 1.5

  // ▸ Gray section for main question and progress - full width with rounded corners
  fill(240, 240, 240); // Light gray to match photo
  rect(x0, y + redHeight, bw, grayHeight, 0, 0, 8, 8); // Rounded bottom corners

  // ▸ Main question text in gray section - BOLD, BIGGER, and LEFT ALIGNED with padding
  textFont(FONT_FAMILY); // Helvetica
  textStyle(BOLD); // Make it bold

  // Make text size bigger and responsive
  let fontSize = min(grayHeight * 0.35, bw * 0.03); // Increased from 0.25 and 0.025
  textSize(fontSize);

  // Check if text fits, if not reduce size
  const questionText = "HOW LONG WOULD YOU SMILE FOR WORLD PEACE?";
  const availableWidth = bw - padding * 4; // More padding for spacing

  while (textWidth(questionText) > availableWidth && fontSize > 12) {
    fontSize *= 0.95; // Reduce size by 5%
    textSize(fontSize);
  }

  // Left align with more padding from the left edge
  textAlign(LEFT, CENTER);
  fill(60, 60, 80); // Dark blue-gray text
  const questionY = y + redHeight + grayHeight * 0.3; // Centered vertically in gray area
  text(questionText, x0 + padding * 1.5, questionY); // Increased padding from padding to padding * 1.5

  // ▸ Timer on the right side of banner - SMALLER with "Total" next to time
  const t = floor(totalSmileFrames / 60);
  const mTime = floor(t / 60);
  const sTime = t % 60;
  const timeStr = nf(mTime, 2) + ":" + nf(sTime, 2);

  // Smaller text size for timer
  const timerTextSize = grayHeight * 0.2; // Reduced from 0.35 to 0.2

  textFont(FONT_FAMILY);
  textSize(timerTextSize);
  textAlign(RIGHT, CENTER);

  // "Total" in RED (changed from gray)
  fill(220, 80, 50); // RED for "Total" - same as the red sections
  const totalText = "Total ";
  const totalWidth = textWidth(totalText);
  const timeWidth = textWidth(timeStr);

  // Position "Total" a bit more to the left (add extra 10px space)
  text("Total", x1 - padding - timeWidth - 10, questionY);

  // Position time numbers
  fill(220, 80, 50); // Red numbers
  text(timeStr, x1 - padding, questionY);

  // ▸ Progress bar CENTERED in gray area
  const progressBarHeight = grayHeight * 0.2; // Reasonable progress bar height
  const progressBarY = y + redHeight + (grayHeight - progressBarHeight) * 0.7; // Center in lower portion of gray area
  const progressBarPadding = padding;

  // Progress bar with proper clipping for rounded corners
  push(); // Save current drawing state

  // Create clipping mask for rounded rectangle
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(
    x0 + progressBarPadding,
    progressBarY,
    bw - progressBarPadding * 2,
    progressBarHeight,
    8
  );
  drawingContext.clip();

  // Progress bar background (darker gray) - with rounded corners
  noStroke();
  fill(200, 200, 200);
  rect(
    x0 + progressBarPadding,
    progressBarY,
    bw - progressBarPadding * 2,
    progressBarHeight
  );

  // Progress bar fill - based on current session smile time, full bar = 5 minutes
  // Use smooth interpolation instead of floor for smoother animation
  const currentSessionSeconds = currentSessionSmileTime / 60; // Remove floor() for smooth progress
  const sessionProgress = min(currentSessionSeconds / maxTimeForSmileBar, 1);
  const progW = (bw - progressBarPadding * 2) * sessionProgress;

  if (progW > 0) {
    fill(220, 80, 50); // Orange progress
    // Draw progress fill - will be clipped to rounded rectangle
    rect(x0 + progressBarPadding, progressBarY, progW, progressBarHeight);
  }

  drawingContext.restore(); // Restore clipping mask
  pop(); // Restore drawing state

  // Show YOUR achievements positioned by the smile duration that earned each place
  leaderboard
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 3)
    .forEach((leaderboardEntry, index) => {
      const smileDurationSeconds = floor(leaderboardEntry.duration / 60); // How long the winning smile was

      // Position on progress bar based on smile duration (same scale as bar)
      const durationRatio = min(smileDurationSeconds / maxTimeForSmileBar, 1);
      const achievementX =
        x0 + progressBarPadding + (bw - progressBarPadding * 2) * durationRatio;
      const achievementY = progressBarY + progressBarHeight / 2; // Center on progress bar

      // Draw achievement circle ON the progress bar
      noStroke();
      fill(achievementColors[index]);
      circle(achievementX, achievementY, 18);

      // Number inside circle (place)
      textFont(FONT_FAMILY);
      textSize(10);
      textAlign(CENTER, CENTER);
      fill(0);
      text(index + 1, achievementX, achievementY);
    });
}

//lior's code
export const getSmileDurationList = () => durationList;
export const getSmileUserImage = () => overallBestFrame;

//unused functions
function handleBannerPhoto(file) {
  if (file.type === "image") bannerIconImg = loadImage(file.data);
}
