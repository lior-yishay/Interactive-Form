import { getIceCreamSandwichCounts } from "./logic.js";

/*  sketch.js — pop-art "which flavor first?" — interactive
   --------------------------------------------------------------
   • pure p5.js (no extra HTML/CSS)
   • exact 1280×720 design space, then uniformly scaled
   • fonts: Grotta-Trial-Bold, SnellRoundhand-BlackScript
   • biscuits:    CasataTop.png  /  CasataBottom.png
*/

/* ---------- ASSETS ---------- */
let grotta, snell;
let topBiscuit, bottomBiscuit;
let flavorRatio = 0.5; // default to even
let flavorCounts = null; // set only after click
let patternImg;
let pulseTimer = 0;
let particles = [];
let starAngle = 0;
let iceCreamTruckSound;

/* ---------- FLAVOR SYSTEM ---------- */
const VANILLA_COLOR = "#f6f2e8";
const CHOCOLATE_COLOR = "#c28c84";

/* ---------- BACKGROUND COLOR SYSTEM ---------- */
const BACKGROUND_COLORS = [
  "#C9B8FF", // original purple
  "#0A5CFE", // pink
  "#10A959", // green
  "#F24D1F", // orange
  "#19171E", // light blue
  "#FF8041", // lavender
  "#FFC700", // yellow
];

let currentBgColorIndex = 0;
let dragStartTime = 0;

/* ---------- INTERACTION STATE ---------- */
let flavor = null; // VANILLA or CHOCOLATE
const VANILLA = "vanila",
  CHOCOLATE = "chocolate"; //lior's code
let flavorProgress = 0;
let flavorTime = 0; // reset animation time      // 0 → 1 animated preference // Timer for flavor animation
const flavorDuration = 60; // Total frames (slower animation)
let showVotes = false; // Control when to show vote counts
let voteDelayTimer = 0; // Delay before showing votes
const voteDelay = 30; // Frames to wait before showing votes

/* ---------- DRAGGING STATE ---------- */
let isDragging = false;
let dragTarget = null; // "survey" or "casata"
let dragOffset = { x: 0, y: 0 };

// Window visibility state
let windowVisible = {
  survey: true,
  casata: true,
};

// Window animation state
let windowAnimating = {
  survey: false,
  casata: false,
};

let windowAnimationProgress = {
  survey: 0,
  casata: 0,
};

const animationDuration = 30; // frames for animation

// Window positions (relative to scaled canvas)
let windowPositions = {
  survey: { x: 460, y: 230 }, // Centered on 1280x720 canvas
  casata: { x: 230, y: 130 }, // Centered on 1280x720 canvas
};

export function preloadIceCreamSandwichScene() {
  grotta = loadFont("Grotta-Trial-Bold.otf");
  snell = loadFont("SnellRoundhand-BlackScript.otf");

  topBiscuit = loadImage("CasataTop.png");
  bottomBiscuit = loadImage("CasataBottom.png");
  patternImg = loadImage("Pattern.png");

  iceCreamTruckSound = loadSound("ice-cream-truck-theme-77464.mp3");
}

/* ---------- CONSTANTS ---------- */
const BASE_W = 1280,
  BASE_H = 720;
const CASATA = {
  w: 340,
  h: 110,
  skew: 50,
  tilt: -10,
  x: 180,
  y: 220,
};

/* ---------- p5 BOOTSTRAP ---------- */
export async function setupIceCreamSandwichScene() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  flavorCounts = await getIceCreamSandwichCounts();

  // Audio will be started on first user interaction
}

function startAudio() {
  if (iceCreamTruckSound && !iceCreamTruckSound.isPlaying()) {
    iceCreamTruckSound.setVolume(0.3); // Set to 30% volume
    iceCreamTruckSound.loop();
  }
}

export function windowResizedIceCreamSandwichScene() {
  resizeCanvas(windowWidth, windowHeight);
}

/* ---------- ROOT DRAW ---------- */
export function drawIceCreamSandwichScene() {
  background("#EEEEEE");
  starAngle += 0.1; // Adjust speed as needed

  if (flavor && flavorTime < flavorDuration) {
    flavorProgress = easeOutQuart(flavorTime / flavorDuration);
    flavorTime++;
    if (flavorTime === flavorDuration) {
      flavorProgress = 1;
    }
  }

  // Handle vote display delay
  if (voteDelayTimer > 0) {
    voteDelayTimer--;
    if (voteDelayTimer === 0) {
      showVotes = true;
    }
  }

  // Handle window animations
  if (windowAnimating.survey) {
    windowAnimationProgress.survey++;
    if (windowAnimationProgress.survey >= animationDuration * 2) {
      // Animation complete, reset
      windowAnimating.survey = false;
      windowAnimationProgress.survey = 0;
      windowVisible.survey = true;
    }
  }

  if (windowAnimating.casata) {
    windowAnimationProgress.casata++;
    if (windowAnimationProgress.casata >= animationDuration * 2) {
      // Animation complete, reset
      windowAnimating.casata = false;
      windowAnimationProgress.casata = 0;
      windowVisible.casata = true;
    }
  }

  if (pulseTimer > 0) {
    pulseTimer -= 0.1;
  }

  // Update background color cycling
  updateBackgroundColor();

  const zoom = 1 + sin(pulseTimer * PI) * 0.02;
  const s = min(width / BASE_W, height / BASE_H) * zoom;

  push();
  translate((width - BASE_W * s) / 2, (height - BASE_H * s) / 2);
  scale(s);
  drawScene();
  drawParticles(); // ✨ draw the sparkles
  pop();

  // Force redraw for animation
  redraw();
}

function updateBackgroundColor() {
  if (isDragging && dragTarget === "casata") {
    // Fast background color cycling when dragging casata
    let timeElapsed = millis() - dragStartTime;
    let cycleSpeed = 200; // Change background every 200ms
    let newColorIndex =
      floor(timeElapsed / cycleSpeed) % BACKGROUND_COLORS.length;
    currentBgColorIndex = newColorIndex;
  } else {
    // Reset to original purple when not dragging
    currentBgColorIndex = 0;
  }
}

// Smooth easing functions for realistic motion
function easeOutQuart(t) {
  return 1 - pow(1 - t, 4);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function smoothStep(edge0, edge1, x) {
  let t = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ---------- CLICK HANDLER ---------- */
export function mousePressedIceCreamSandwichScene() {
  // Start audio on first interaction
  startAudio();

  const s = min(width / BASE_W, height / BASE_H);

  // Get mouse relative to canvas
  let mx = (mouseX - (width - BASE_W * s) / 2) / s;
  let my = (mouseY - (height - BASE_H * s) / 2) / s;

  // Check for close button clicks first (red button at x=40, y=25 in each window)
  if (
    windowVisible.survey &&
    !windowAnimating.survey &&
    mx >= windowPositions.survey.x + 34 &&
    mx <= windowPositions.survey.x + 46 &&
    my >= windowPositions.survey.y + 19 &&
    my <= windowPositions.survey.y + 31
  ) {
    windowVisible.survey = false;
    windowAnimating.survey = true;
    windowAnimationProgress.survey = 0;
    return;
  }

  if (
    windowVisible.casata &&
    !windowAnimating.casata &&
    mx >= windowPositions.casata.x + 34 &&
    mx <= windowPositions.casata.x + 46 &&
    my >= windowPositions.casata.y + 19 &&
    my <= windowPositions.casata.y + 31
  ) {
    windowVisible.casata = false;
    windowAnimating.casata = true;
    windowAnimationProgress.casata = 0;
    return;
  }

  // Check for title bar dragging (only if windows are visible)
  if (
    windowVisible.survey &&
    mx >= windowPositions.survey.x &&
    mx <= windowPositions.survey.x + 360 &&
    my >= windowPositions.survey.y &&
    my <= windowPositions.survey.y + 50
  ) {
    isDragging = true;
    dragTarget = "survey";
    dragOffset.x = mx - windowPositions.survey.x;
    dragOffset.y = my - windowPositions.survey.y;
    return;
  }

  if (
    windowVisible.casata &&
    mx >= windowPositions.casata.x &&
    mx <= windowPositions.casata.x + 820 &&
    my >= windowPositions.casata.y &&
    my <= windowPositions.casata.y + 50
  ) {
    isDragging = true;
    dragTarget = "casata";
    dragOffset.x = mx - windowPositions.casata.x;
    dragOffset.y = my - windowPositions.casata.y;
    dragStartTime = millis(); // Start background color cycling timer
    return;
  }

  // ORIGINAL VOTING LOGIC - UNCHANGED
  // Undo the transforms used in drawCasata() - updated for new position
  const scaleFactor = 0.4;
  const topW = topBiscuit.width * scaleFactor;
  const topH = topBiscuit.height * scaleFactor;
  const botH = bottomBiscuit.height * scaleFactor;
  const blockH = 301 * scaleFactor;
  const fillingW = topW * 0.8;
  const totalW = topW;
  const topY = 130;
  const centerX = windowPositions.casata.x + (820 - totalW) / 2 + totalW / 2;
  const centerY =
    windowPositions.casata.y + 50 + topY + (topH + blockH + botH) / 2 - 52;

  // Apply reverse transform
  mx -= centerX;
  my -= centerY;
  const rotatedX = mx * cos(-radians(2)) - my * sin(-radians(2));
  const rotatedY = mx * sin(-radians(2)) + my * cos(-radians(2));
  mx = rotatedX + totalW / 2;
  my = rotatedY + (topH + blockH + botH) / 2;

  // Local fill bounds
  const fillY = topH - 153;
  const fillX = (totalW - fillingW) / 2 + 17;
  const clickableHalf = fillingW / 2;

  // the following if statment was changed by lior. flavorCounts should be initialanize in the setup. replace flavorCounts with flavor to determine if there was a selection
  if (my >= fillY && my <= fillY + blockH && !flavor) {
    // Only allow click if no previous selection
    if (mx >= fillX && mx < fillX + clickableHalf) {
      flavorCounts.vanila++;
      flavor = VANILLA;
      flavorRatio =
        flavorCounts.vanila / (flavorCounts.vanila + flavorCounts.chocolate);
      postIceCreamSandwichVanila();
      createParticles(mouseX, mouseY, VANILLA);
    } else if (mx >= fillX + clickableHalf && mx < fillX + fillingW) {
      flavorCounts.chocolate++;
      flavor = CHOCOLATE;
      flavorRatio =
        flavorCounts.chocolate / (flavorCounts.vanila + flavorCounts.chocolate);
      postIceCreamSandwichChocolate();
      createParticles(mouseX, mouseY, CHOCOLATE);
    }

    flavorProgress = 0;
    flavorTime = 0; // Reset animation timer
    showVotes = false; // Hide votes initially
    voteDelayTimer = voteDelay; // Start the delay timer
    pulseProgress = 1; // trigger pulse effect
    loop(); // Start animation
  }
}

export function mouseDraggedIceCreamSandwichScene() {
  if (isDragging && dragTarget) {
    const s = min(width / BASE_W, height / BASE_H);
    const mx = (mouseX - (width - BASE_W * s) / 2) / s;
    const my = (mouseY - (height - BASE_H * s) / 2) / s;

    windowPositions[dragTarget].x = mx - dragOffset.x;
    windowPositions[dragTarget].y = my - dragOffset.y;

    // Keep windows within bounds
    windowPositions[dragTarget].x = constrain(
      windowPositions[dragTarget].x,
      0,
      BASE_W - (dragTarget === "survey" ? 360 : 820)
    );
    windowPositions[dragTarget].y = constrain(
      windowPositions[dragTarget].y,
      0,
      BASE_H - (dragTarget === "survey" ? 260 : 460)
    );
  }
}

export function mouseReleasedIceCreamSandwichScene() {
  isDragging = false;
  dragTarget = null;
}

function createParticles(x, y, flavor) {
  let particleColor = flavor === VANILLA ? "#f6f2e8" : "#c28c84";
  let accentColor = flavor === VANILLA ? "#fff5d6" : "#8b4513";

  // MASSIVE celebration burst that fills the entire screen!
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: x + random(-50, 50),
      y: y + random(-50, 50),
      vx: random(-20, 20),
      vy: random(-20, 20),
      life: random(80, 200),
      size: random(4, 12),
      color: color(i % 3 === 0 ? accentColor : particleColor),
    });
  }

  // TONS of sparkle particles
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: x + random(-100, 100),
      y: y + random(-100, 100),
      vx: random(-15, 15),
      vy: random(-15, 15),
      life: random(60, 150),
      size: random(3, 8),
      color: color("#FFD700"), // Gold sparkles
    });
  }

  // Screen-wide confetti explosion!
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-25, 25),
      vy: random(-25, 25),
      life: random(100, 250),
      size: random(2, 10),
      color: color(
        random([
          "#FF69B4",
          "#00CED1",
          "#FFD700",
          "#FF6347",
          "#98FB98",
          particleColor,
          accentColor,
        ])
      ),
    });
  }
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    noStroke();

    // Make sure we're using the particle's assigned color
    fill(p.color);

    // Use the particle's size property, or default to 4
    let size = p.size || 4;
    circle(p.x, p.y, size);

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98; // Slight friction
    p.vy += 0.1; // Gravity effect
    p.life -= 1;

    if (p.life <= 0) particles.splice(i, 1);
  }
}

/* ==============================================================
   =                        MAIN SCENE                          =
   ============================================================== */
function getWindowScale(windowName) {
  if (!windowAnimating[windowName]) return 1;

  let progress = windowAnimationProgress[windowName];

  if (progress <= animationDuration) {
    // Scale down phase (0 to 30 frames)
    let t = progress / animationDuration;
    return 1 - easeInOutCubic(t);
  } else {
    // Scale up phase (30 to 60 frames)
    let t = (progress - animationDuration) / animationDuration;
    return easeInOutCubic(t);
  }
}

function drawScene() {
  /* ---- CASATA WINDOW (now drawn first - background) ---- */
  if (windowVisible.casata || windowAnimating.casata) {
    push();
    translate(windowPositions.casata.x, windowPositions.casata.y);

    // Apply scale animation
    let scaleValue = getWindowScale("casata");
    if (scaleValue !== 1) {
      translate(410, 230); // Center of window
      scale(scaleValue);
      translate(-410, -230);
    }

    drawWindowShell(820, 460, "casata.png", true, false);

    push();
    translate(0, 50);

    push();
    clip(() => {
      rect(0, 0, 820, 410);
    });

    // Use current background color instead of fixed purple
    fill(BACKGROUND_COLORS[currentBgColorIndex]);
    noStroke();
    rect(0, 0, 820, 410);
    drawYellowStar(820, 410);
    if (patternImg) {
      imageMode(CORNER);
      image(patternImg, 0, 0, 820, 410);
    }
    pop();

    drawCasata();
    pop();
    pop();
  }

  /* ---- SURVEY WINDOW (now drawn second - foreground) ---- */
  if (windowVisible.survey || windowAnimating.survey) {
    push();
    translate(windowPositions.survey.x, windowPositions.survey.y);

    // Apply scale animation
    let scaleValue = getWindowScale("survey");
    if (scaleValue !== 1) {
      translate(180, 130); // Center of window
      scale(scaleValue);
      translate(-180, -130);
    }

    drawWindowShell(360, 260, "survey", true, true);
    fill("#2224FF");
    noStroke();
    rect(0, 50, 360, 210);
    drawSurveyText();
    pop();
  }
}

/* ==============================================================
   =                 INDIVIDUAL COMPONENTS                      =
   ============================================================== */
function drawWindowShell(w, h, title, shadow = false, isBlueWindow = false) {
  if (shadow) {
    noStroke();
    if (isBlueWindow) {
      fill(0, 200);
      rect(-6, 6, w, h);
    } else {
      fill(0, 30);
      rect(-6, 6, w, h);
    }
  }

  // Main window background
  stroke(0);
  strokeWeight(2);
  fill("#ffffff");
  rect(0, 0, w, h);

  // Add stroke to the bottom of the white title bar area (at y=50)
  stroke(0);
  strokeWeight(2);
  line(0, 50, w, 50);

  let whiteAreaCenterY = 25;

  [
    ["#ff5f56", 40],
    ["#ffbd2e", 60],
    ["#27c93f", 80],
  ].forEach(([c, x]) => {
    noStroke();
    fill(c);
    circle(x, whiteAreaCenterY, 12);
  });

  fill(50);
  textFont(grotta);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(title, 100, whiteAreaCenterY);
}

function drawSurveyText() {
  push();
  stroke(0);
  fill("#ffffff");
  textAlign(CENTER, CENTER);

  let groupCenterY = 155;

  // Original text only (no panic mode)
  textFont(grotta);
  textSize(45);
  text("WHICH", 180, groupCenterY - 60);

  textFont(snell);
  textSize(80);
  text("flavor", 180, groupCenterY - 14);

  textFont(grotta);
  textSize(45);
  text("FIRST?", 180, groupCenterY + 50);

  pop();
}

function drawYellowStar(w, h) {
  push();
  translate(w / 2, h / 2);
  rotate(starAngle);

  fill("#FFFF00");
  stroke(0);
  strokeWeight(2);
  beginShape();

  let numPoints = 18;
  let totalSteps = numPoints * 2;

  for (let i = 0; i < totalSteps; i++) {
    let angle = i * (360 / totalSteps);
    let radius = i % 2 === 0 ? w * 0.6 : w * 0.32;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    vertex(x, y);
  }

  endShape(CLOSE);
  pop();
}

function drawCasata() {
  const scaleFactor = 0.4;
  const biscuitTilt = radians(2);
  const fillingTilt = radians(13);

  const topW = topBiscuit.width * scaleFactor;
  const topH = topBiscuit.height * scaleFactor;
  const botW = bottomBiscuit.width * scaleFactor;
  const botH = bottomBiscuit.height * scaleFactor;

  const blockH = 310 * scaleFactor;
  const fillingW = topW * 0.8;
  const totalW = topW;
  const sandwichH = topH + blockH + botH;

  const topY = 130;
  const centerX = (820 - totalW) / 2 + totalW / 2;
  const centerY = topY + sandwichH / 2 - 52;

  const fillY = topH - 155.2;
  const fillX = (totalW - fillingW) / 2 + 20;

  let hoveringVanilla = false;
  let hoveringChoco = false;

  if (!flavor) {
    const s = min(width / BASE_W, height / BASE_H);
    let mx = (mouseX - (width - BASE_W * s) / 2) / s;
    let my = (mouseY - (height - BASE_H * s) / 2) / s;

    let relX = mx - (windowPositions.casata.x + centerX);
    let relY = my - (windowPositions.casata.y + 50 + centerY);
    let rotX = relX * cos(-radians(2)) - relY * sin(-radians(2));
    let rotY = relX * sin(-radians(2)) + relY * cos(-radians(2));
    mx = rotX + totalW / 2;
    my = rotY + (topH + blockH + botH) / 2;

    if (my >= fillY && my <= fillY + blockH) {
      if (mx >= fillX && mx < fillX + fillingW / 2) {
        hoveringVanilla = true;
      } else if (mx >= fillX + fillingW / 2 && mx < fillX + fillingW) {
        hoveringChoco = true;
      }
    }
  }

  // Add extra floating effect when dragging
  let floatIntensity = isDragging && dragTarget === "casata" ? 8 : 3;
  let floatSpeed = isDragging && dragTarget === "casata" ? 0.003 : 0.001;
  let floatY = Math.sin(Date.now() * floatSpeed) * floatIntensity;

  push();
  translate(centerX, centerY + floatY);
  rotate(biscuitTilt);
  translate(-totalW / 2, -sandwichH / 2);

  if (bottomBiscuit) {
    imageMode(CORNER);
    image(bottomBiscuit, 0, topH + blockH - botH - 100, botW, botH);
  }

  let vanillaW = fillingW / 2;
  let chocoW = fillingW / 2;
  if (flavor === VANILLA) {
    vanillaW = lerp(fillingW / 2, fillingW * flavorRatio, flavorProgress);
    chocoW = fillingW - vanillaW;
  } else if (flavor === CHOCOLATE) {
    chocoW = lerp(fillingW / 2, fillingW * flavorRatio, flavorProgress);
    vanillaW = fillingW - chocoW;
  }

  push();
  translate(totalW / 2, fillY + blockH / 2);
  rotate(-biscuitTilt + 5);
  rotate(fillingTilt);
  translate(-totalW / 2, -(fillY + blockH / 2));

  // Yellow background
  noStroke();
  fill("#FFFF00");
  rect(fillX, fillY, fillingW, blockH);

  // Keep vanilla and chocolate colors (no flavor cycling)
  let leftColor = VANILLA_COLOR;
  let rightColor = CHOCOLATE_COLOR;

  // Left side with hover effect
  fill(leftColor);
  rect(fillX, fillY, vanillaW, blockH);

  // Right side with hover effect
  fill(rightColor);
  rect(fillX + vanillaW, fillY, chocoW, blockH);

  // Borders
  stroke("#5c493e");
  strokeWeight(2);
  noFill();
  rect(fillX, fillY, fillingW, blockH);
  line(fillX + vanillaW, fillY, fillX + vanillaW, fillY + blockH);

  // Hover text labels
  if (hoveringVanilla) {
    textFont(grotta);
    textSize(24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(VANILLA, fillX + vanillaW / 2, fillY + blockH / 2);
  }

  if (hoveringChoco) {
    textFont(grotta);
    textSize(24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(CHOCOLATE, fillX + vanillaW + chocoW / 2, fillY + blockH / 2);
  }

  // Vote count labels (only show after delay)
  if (flavorCounts && showVotes) {
    textFont(grotta);
    textSize(24);
    fill(30);
    noStroke();
    textAlign(CENTER, CENTER);

    push();
    translate(fillX + vanillaW / 2, fillY + blockH / 2);
    rotate(0);
    text(flavorCounts.vanila, 0, -10);

    // Add "votes" text underneath
    textSize(12);
    text("votes", 0, 10);
    pop();

    push();
    translate(fillX + vanillaW + chocoW / 2, fillY + blockH / 2);
    rotate(0);
    text(flavorCounts.chocolate, 0, -10);

    // Add "votes" text underneath
    textSize(12);
    text("votes", 0, 10);
    pop();
  }

  pop(); // fillings

  if (topBiscuit) {
    imageMode(CORNER);
    image(topBiscuit, 0, 0, topW, topH);
  }

  pop(); // sandwich
}
// Keep your original server functions exactly as they were
// (These should be your actual working server API calls)

//lior's code
export const getIceCreamSandwichUserPick = () => flavor;
