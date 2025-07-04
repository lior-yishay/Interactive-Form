/*
  1 CLICK : 0 IMPACT — landing page (+ spaced PNG mouse-trail + jazz music)
  -----------------------------------------------------------
  Icons (10):
    casata.png  disco.png  earth.png  fuck.png  heart.png
    spaceship.png  house.png  smilymouse.png  tringle.png
  Font: Grotta-Trial-Bold.otf  (only for large canvas headings / teaser)
  Music: jazz-lounge-elevator-music-332339.mp3
*/

import { getCurrentUser } from "../../currentUser.js";
import { nextScene } from "../../scene-managment/sceneOrder.js";
import { loopSound, resetRegisteredSounds } from "../../soundManager.js";

let userNumber;

let grotta;
let jazzMusic; // audio variable

/* === icon assets === */
const files = [
  "casata.png",
  "disco.png",
  "earth.png",
  "fuck.png",
  "heart.png",
  "spaceship.png",
  "house.png",
  "smilymouse.png",
  "tringle.png",
];
let icons = [];
const trail = [];
let lastPos = null;
let mouseVelocity = 0;
let lastMousePos = { x: 0, y: 0 };

let scaleFactor = 1;
let isButtonHovered = false;
let buttonFillProgress = 0; // for loading animation
let isNoteHovered = false; // for note hover effect
let noteHoverProgress = 0; // for smooth note animation
let typewriterProgress = 0; // for typewriter effect
let typewriterStarted = false; // track if typewriter has started
let typewriterCompleted = false; // track if typewriter is done
let hasShownTypewriterOnce = false; // track if we've shown the effect once

/* WHITE NOTE STATE */
const YSHIFT = 0.08; // drop 8% (increased from 5%)

let whiteNote = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  rotation: 15,
  targetRotation: 15,
  originalX: 0,
  originalY: 0,
  originalRotation: 15,
  baseWidth: 320,
  baseHeight: 320,
  isMoving: false,
  isAtCenter: false,
  easeSpeed: 0.04, // slower, smoother animation
};

/* colours */
const BG = "#131217",
  FG = "#ffffff";
const CLICK_COLOR = "#F24D1F"; // אדום-כתום עבור "1 CLICK"
const IMPACT_COLOR = "#C9B8FF"; // סגול בהיר עבור "0 IMPACT"

/* — preload — */
export function preloadStartScene() {
  grotta = loadFont("./assets/Grotta-Trial-Bold.otf");
  files.forEach((f) => icons.push(loadImage(`./assets/${f}`)));

  // Load the jazz music
  jazzMusic = loadSound("./assets/jazz-lounge-elevator-music-332339.mp3");
}

/* — setup — */
export async function setupStartScene() {
  createCanvas(windowWidth, windowHeight);
  updateScaleFactor();
  textAlign(CENTER, CENTER);
  noStroke();
  noCursor();
  updateWhiteNotePosition();

  userNumber = await getCurrentUser();
}

/* — start audio on first user interaction — */
function startAudioOnInteraction() {
  loopSound(jazzMusic, { volume: 0.3 });
}

/* — responsive — */
export function windowResizedStartScene() {
  resizeCanvas(windowWidth, windowHeight);
  updateScaleFactor();
  if (!whiteNote.isMoving) updateWhiteNotePosition();
}

/* — scaling helper — */
function updateScaleFactor() {
  const refW = 1200,
    refH = 800;
  const cS = min(width, height);
  const rS = min(refW, refH);
  scaleFactor = constrain(cS / rS, 0.5, 2.5);
}

/* — initial note location — */
function updateWhiteNotePosition() {
  const w = whiteNote.baseWidth * scaleFactor;
  const h = whiteNote.baseHeight * scaleFactor;
  whiteNote.x = w * 0.5;
  whiteNote.y = height - h * 0.1 + height * YSHIFT;
  whiteNote.targetX = whiteNote.x;
  whiteNote.targetY = whiteNote.y;
  whiteNote.originalX = whiteNote.x;
  whiteNote.originalY = whiteNote.y;
}

/* — cursor movement (trail) — */
export function mouseMovedStartScene() {
  // Mark user interaction and try to start audio
  startAudioOnInteraction();

  const cv = dist(mouseX, mouseY, lastMousePos.x, lastMousePos.y);
  mouseVelocity = lerp(mouseVelocity, cv, 0.1);
  lastMousePos = { x: mouseX, y: mouseY };

  const baseS = 45 * scaleFactor;
  const dynS = map(mouseVelocity, 0, 20, baseS * 1.5, baseS * 0.5);
  if (!lastPos || dist(mouseX, mouseY, lastPos.x, lastPos.y) > dynS) {
    addTrailIcon();
    lastPos = { x: mouseX, y: mouseY };
  }
}

/* — add icon to trail — */
function addTrailIcon() {
  let sel;
  if (trail.length === 0) {
    sel = random(icons);
  } else {
    const lastI = trail[trail.length - 1].img;
    do {
      sel = random(icons);
    } while (sel === lastI && icons.length > 1);
  }

  const baseLife = 45,
    maxS = 0.6 * scaleFactor,
    minS = 0.2 * scaleFactor,
    rSpd = 0.02,
    sVar = 0.3,
    maxT = floor(10 * scaleFactor);

  let tS = random(minS, maxS) * (1 + random(-sVar, sVar));
  const oMax = max(sel.width, sel.height),
    mAll = min(120, oMax) / oMax;
  tS = min(tS, mAll);

  trail.push({
    img: sel,
    x: mouseX,
    y: mouseY,
    life: baseLife + random(-10, 10),
    maxLife: baseLife,
    scale: 0,
    targetScale: tS,
    rotation: random(TWO_PI),
    rotationSpeed: random(-rSpd, rSpd),
    opacity: 1,
    offsetX: random(-15 * scaleFactor, 15 * scaleFactor),
    offsetY: random(-15 * scaleFactor, 15 * scaleFactor),
    velocityInfluence: map(mouseVelocity, 0, 20, 0.8, 1.4),
  });
  if (trail.length > maxT) trail.shift();
}

/* — draw loop — */
export function drawStartScene() {
  background(BG);

  const s = min(width, height),
    counterFs = s * 0.036 * 1.2,
    bigFs = s * 0.252,
    leading = bigFs * 0.78,
    btnH = s * 0.07,
    btnW = btnH * 4,
    margin = s * 0.05;

  /* TOP COUNTER */
  let cY = height * (0.15 + YSHIFT);
  let fullStr = `#${userNumber} people already voted`;
  let fSize = counterFs * 1.03;
  let kern = fSize * 0.1;

  textAlign(LEFT, BASELINE);
  textSize(fSize);

  let totalW = 0;
  for (let ch of fullStr) totalW += textWidth(ch) + kern;
  totalW -= kern;

  let x0 = width / 2 - totalW / 2,
    x = x0;

  noStroke();
  fill("#ebebeb");
  for (let ch of fullStr) {
    textFont(ch === "#" ? "Arial" : grotta);
    text(ch, x, cY);
    x += textWidth(ch) + kern;
  }

  /* HEADLINE WITH COLORS */
  let up = "1 CLICK",
    down = "0 IMPACT",
    y0 = height * (0.42 + YSHIFT) + sin(frameCount * 0.03) * 8,
    tScale = 1;

  textFont(grotta);
  textSize(bigFs);
  textLeading(leading);

  let upW = textWidth(up),
    downW = textWidth(down),
    maxW = max(upW, downW),
    pad = max(width * 0.1, 40 * scaleFactor),
    avail = width - pad * 2;
  if (maxW > avail) tScale = avail / maxW;

  textSize(bigFs * tScale);
  textLeading(leading * tScale);
  textAlign(CENTER, BASELINE);

  // "1 CLICK" בצבע אדום-כתום
  fill(CLICK_COLOR);
  noStroke();
  text(up, width / 2, y0);

  const dotR = bigFs * tScale * 0.14,
    gapY = dotR * 1.94,
    shiftUp = dotR * 2.5,
    offsetX = bigFs * tScale * 0.1,
    cx = width / 2 + upW / 2 + offsetX;

  // הנקודות נשארות לבנות
  noStroke();
  fill(FG);
  ellipse(cx, y0 - gapY - shiftUp, dotR, dotR);
  ellipse(cx, y0 + gapY - shiftUp, dotR, dotR);

  // "0 IMPACT" בצבע סגול בהיר
  fill(IMPACT_COLOR);
  text(down, width / 2, y0 + leading * tScale);

  /* WHITE NOTE */
  drawWhiteNote();

  /* CTA BUTTON */
  const noteH =
      whiteNote.baseHeight * scaleFactor * (whiteNote.isAtCenter ? 1.3 : 1),
    btnPad = max(width * 0.05, 20 * scaleFactor),
    maxBW = width - btnPad * 2;
  let bScale = btnW > maxBW ? maxBW / btnW : 1,
    wW = btnW * bScale,
    wH = btnH * bScale,
    bx = width - margin - wW / 2 - 30 * scaleFactor,
    by = height - margin - wH / 2;

  isButtonHovered =
    mouseX > bx - wW / 2 &&
    mouseX < bx + wW / 2 &&
    mouseY > by - wH / 2 &&
    mouseY < by + wH / 2;

  // Animate fill progress
  if (isButtonHovered) {
    buttonFillProgress = min(buttonFillProgress + 0.05, 1);
  } else {
    buttonFillProgress = max(buttonFillProgress - 0.05, 0);
  }

  // Draw button background
  rectMode(CENTER);
  stroke(FG);
  strokeWeight(2 * scaleFactor);
  noFill();
  rect(bx, by, wW, wH, wH / 2);

  // Draw fill animation from left to right with clipping
  if (buttonFillProgress > 0) {
    // Create a mask for the rounded rectangle
    push();
    // Create clipping path
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.roundRect(bx - wW / 2, by - wH / 2, wW, wH, wH / 2);
    drawingContext.clip();

    noStroke();
    fill(FG);
    let fillWidth = wW * buttonFillProgress;
    rectMode(CORNER);
    rect(bx - wW / 2, by - wH / 2, fillWidth, wH);

    drawingContext.restore();
    pop();
  }

  noStroke();
  fill(buttonFillProgress > 0.5 ? BG : FG); // change text color based on fill
  textAlign(CENTER, CENTER);
  textFont("Helvetica");
  textSize(wH * 0.35);
  text("Cast Your Vote", bx - wW * 0.08, by);
  textFont("Arial");
  text("→", bx + wW * 0.28, by);

  /* TRAIL + CURSOR */
  updateAndDrawTrail();
  drawCustomCursor();
}

/* — trail draw — */
function updateAndDrawTrail() {
  imageMode(CENTER);
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i];
    t.life--;
    t.rotation += t.rotationSpeed;
    const age = 1 - t.life / t.maxLife;

    if (age < 0.2)
      t.scale = lerp(0, t.targetScale * t.velocityInfluence, age * 5);
    else if (age > 0.7) {
      const f = (age - 0.7) / 0.3;
      t.scale = lerp(t.targetScale * t.velocityInfluence, 0, f);
      t.opacity = lerp(1, 0, f);
    } else {
      t.scale = t.targetScale * t.velocityInfluence;
    }

    const floatO = sin(frameCount * 0.05 + i * 0.5) * 2 * scaleFactor;

    push();
    translate(t.x + t.offsetX, t.y + t.offsetY + floatO);
    rotate(t.rotation);
    tint(255, t.opacity * 255);
    const fS = t.scale * 0.8;
    image(t.img, 0, 0, t.img.width * fS, t.img.height * fS);
    noTint();
    pop();

    if (t.life <= 0) trail.splice(i, 1);
  }
}

/* — custom cursor — */
function drawCustomCursor() {
  const bS = map(mouseVelocity, 0, 15, 8, 20) * scaleFactor;
  fill(255, 150);
  noStroke();
  ellipse(mouseX, mouseY, bS, bS);
  fill(255, 200);
  ellipse(mouseX, mouseY, bS * 0.3, bS * 0.3);
  mouseVelocity *= 0.95;
}

/* — WHITE NOTE — */
function drawWhiteNote() {
  /* — smooth animation — */
  if (whiteNote.isMoving) {
    whiteNote.x = lerp(whiteNote.x, whiteNote.targetX, whiteNote.easeSpeed);
    whiteNote.y = lerp(whiteNote.y, whiteNote.targetY, whiteNote.easeSpeed);
    whiteNote.rotation = lerp(
      whiteNote.rotation,
      whiteNote.targetRotation,
      whiteNote.easeSpeed
    );
    if (
      dist(whiteNote.x, whiteNote.y, whiteNote.targetX, whiteNote.targetY) <
        1 &&
      abs(whiteNote.rotation - whiteNote.targetRotation) < 0.5
    )
      whiteNote.isMoving = false;
  }

  /* — check if note is hovered when in corner — */
  if (!whiteNote.isAtCenter) {
    const baseW = whiteNote.baseWidth * scaleFactor,
      baseH = whiteNote.baseHeight * scaleFactor;
    const dx = mouseX - whiteNote.x,
      dy = mouseY - whiteNote.y,
      a = radians(whiteNote.rotation),
      lx = dx * cos(-a) - dy * sin(-a),
      ly = dx * sin(-a) + dy * cos(-a);

    isNoteHovered = abs(lx) < baseW / 2 && abs(ly) < baseH / 2;
  } else {
    isNoteHovered = false;
  }

  // Smooth animation for hover effect
  if (isNoteHovered) {
    noteHoverProgress = lerp(noteHoverProgress, 1, 0.15);
  } else {
    noteHoverProgress = lerp(noteHoverProgress, 0, 0.12);
  }

  push();
  translate(whiteNote.x, whiteNote.y);

  /* — add smooth hover effect for corner note — */
  let hoverRotationOffset = 0;
  let hoverOffset = 0;
  if (!whiteNote.isAtCenter) {
    hoverOffset = -15 * scaleFactor * noteHoverProgress; // smooth movement
    hoverRotationOffset = -8 * noteHoverProgress; // smooth rotation
  }

  rotate(radians(whiteNote.rotation + hoverRotationOffset));

  /* — dynamic card size — */
  let w = whiteNote.baseWidth * scaleFactor;
  let h = whiteNote.baseHeight * scaleFactor;

  if (whiteNote.isAtCenter) {
    w = min(w * 1.2, width * 0.5);
    h = min(h * 1.2, height * 0.5);
  }

  /* — draw the rectangle with hover offset — */
  rectMode(CENTER);
  stroke(0);
  strokeWeight(1.5 * scaleFactor); // black stroke
  fill(255);
  rect(0, hoverOffset, w, h); // apply hover offset to Y position

  /* — typography metrics — */
  const innerPad = w * 0.015; // minimal padding - very close to edges
  const fsHeadline = h * 0.11; // headline size stays the same
  const fsBody = h * 0.042; // bigger body text - increased from 0.035 to 0.042

  /* — centred layout — */
  if (whiteNote.isAtCenter) {
    noStroke(); // remove stroke for text
    textAlign(CENTER, CENTER);
    fill(0);

    // Only show typewriter effect the first time
    if (!hasShownTypewriterOnce) {
      // Start typewriter effect when note starts moving to center
      if (!typewriterStarted && whiteNote.isMoving) {
        typewriterStarted = true;
        typewriterProgress = 0;
      }

      // Progress typewriter effect slowly
      if (typewriterStarted && !typewriterCompleted) {
        typewriterProgress += 0.2; // back to slower speed
        if (typewriterProgress >= 200) {
          // much longer time to complete
          typewriterCompleted = true;
          typewriterProgress = 200;
          hasShownTypewriterOnce = true; // mark that we've shown it once
        }
      }
    }

    // Calculate total content height for proper vertical centering
    const lineHeight = fsBody * 1.3;
    const doubleSpace = fsBody * 1.5;
    const headlineSpace = fsHeadline + fsBody * 0.6;

    // All text lines
    const lines = [
      "Fair question.",
      "But honestly - does it really matter?",
      "", // double space
      "This project was made to explore",
      "people's opinions. That's all.",
      "You'll get choices to make and a",
      "glimpse into what others chose too.",
      "", // double space
      "Join in, and who knows, you might",
      "discover something about yourself.",
      "Or not.",
      "", // double space
      "No promises.",
    ];

    // Calculate total text height and position with padding on both top and bottom
    const totalTextHeight =
      headlineSpace + (lines.length - 3) * lineHeight + 3 * doubleSpace;
    const topPadding = h * 0.18; // Add 18% of card height as top padding
    const bottomPadding = h * 0.12; // Keep 12% of card height as bottom padding
    const availableHeight = h - topPadding - bottomPadding;
    // Center the text within the available space (between the paddings)
    let y = -h / 2 + topPadding + (availableHeight - totalTextHeight) / 2;

    // headline (Grotta Bold Italic) - always show
    textFont(grotta);
    textStyle(BOLDITALIC);
    textSize(fsHeadline);
    text("Who we are?", 0, y);
    y += headlineSpace;

    // body text with typewriter effect or full text
    textSize(fsBody);

    if (hasShownTypewriterOnce) {
      // If we've shown the typewriter once, always show full text
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "") {
          y += doubleSpace - lineHeight;
        } else {
          // Set font style based on content
          if (i < 7) {
            textFont("Helvetica");
            textStyle(ITALIC);
          } else {
            textFont("Helvetica-Light");
            textStyle(NORMAL);
          }
          text(lines[i], 0, y);
        }
        y += lineHeight;
      }
    } else {
      // Show typewriter effect
      let currentCharCount = 0;
      let targetCharCount = typewriterStarted ? typewriterProgress * 2 : 0; // simple calculation

      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "") {
          y += doubleSpace - lineHeight;
          currentCharCount += 1;
        } else {
          // Set font style based on content
          if (i < 7) {
            textFont("Helvetica");
            textStyle(ITALIC);
          } else {
            textFont("Helvetica-Light");
            textStyle(NORMAL);
          }

          let lineLength = lines[i].length;
          if (currentCharCount < targetCharCount) {
            let charsToShow = min(
              lineLength,
              max(0, targetCharCount - currentCharCount)
            );
            let partialText = lines[i].substring(0, charsToShow);
            text(partialText, 0, y);
          }
          currentCharCount += lineLength + 1;
        }
        y += lineHeight;
      }
    }
  } else {
    /* — small note with only title at top — */
    noStroke(); // remove stroke for text
    textAlign(CENTER, TOP);
    fill(0);

    // Only show the headline in the small note, positioned at top
    textFont(grotta);
    textStyle(BOLDITALIC);
    textSize(fsHeadline * 0.9); // bigger title for small note
    text("Who we are?", 0, -h / 2 + innerPad + h * 0.08 + hoverOffset); // apply hover offset to text too
  }

  // Add small X in top right corner only when centered
  if (whiteNote.isAtCenter) {
    noStroke();
    textAlign(RIGHT, TOP);
    textFont("Arial");
    textStyle(NORMAL);
    textSize(fsHeadline * 0.6);
    fill(120); // gray color for X
    text("×", w / 2 - innerPad, -h / 2 + innerPad);
  }

  pop();
}

/* — click toggles card position — */
export function mousePressedStartScene() {
  // Mark user interaction and try to start audio
  startAudioOnInteraction();

  const baseW = whiteNote.baseWidth * scaleFactor,
    baseH = whiteNote.baseHeight * scaleFactor;

  // Calculate actual note size based on its state
  let actualW = baseW;
  let actualH = baseH;

  if (whiteNote.isAtCenter) {
    actualW = min(baseW * 1.2, width * 0.5);
    actualH = min(baseH * 1.2, height * 0.5);
  }

  const dx = mouseX - whiteNote.x,
    dy = mouseY - whiteNote.y,
    a = radians(whiteNote.rotation),
    lx = dx * cos(-a) - dy * sin(-a),
    ly = dx * sin(-a) + dy * cos(-a);

  // Check if clicking within the actual note bounds
  if (abs(lx) < actualW / 2 && abs(ly) < actualH / 2) {
    if (whiteNote.isAtCenter) {
      // When centered, any click on the note closes it
      whiteNote.targetX = whiteNote.originalX;
      whiteNote.targetY = whiteNote.originalY;
      whiteNote.targetRotation = whiteNote.originalRotation;
      whiteNote.isAtCenter = false;
      whiteNote.isMoving = true;
      // Don't reset typewriter flags - keep hasShownTypewriterOnce = true
    } else {
      // When not centered, open the note
      whiteNote.targetX = width / 2;
      whiteNote.targetY = height / 2 + height * YSHIFT;
      whiteNote.targetRotation = 3; // positive angle - opposite direction
      whiteNote.isAtCenter = true;
      whiteNote.isMoving = true;
    }
  }

  //lior's code: add click logic for cast your vote
  if (isButtonHovered) {
    resetRegisteredSounds();
    nextScene();
  }
}

/* — additional interaction events for audio — */
export function keyPressedStartScene() {
  startAudioOnInteraction();
}

export function touchStartedStartScene() {
  startAudioOnInteraction();
}
