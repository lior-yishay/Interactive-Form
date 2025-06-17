import { getPoliticsCounts } from "./logic.js";

// Restored design + shake, tilt, gravity-collapse effect
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;
let engine, world;

let currentLetterIndex = 0;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let politicsCounts;
let nextBtnX,
  nextBtnY,
  nextBtnW = 100,
  nextBtnH = 36;
let resetBtnX,
  resetBtnY,
  resetBtnW = 100,
  resetBtnH = 36;
let introBtnX, introBtnY, introBtnH, introBtnW;

let warningResetBtn = { x: 0, y: 0, w: 120, h: 40 };
let warningDoneBtn = { x: 0, y: 0, w: 120, h: 40 };

let introFading = false;
let introAlpha = 255;
let introScale = 1;

//message
let showWarning = false;
let showPreview = true;
let warningAlpha = 0;
let warningScale = 0.95;

//intro
let showIntro = true;
let selectedLetter = "";

let ballTrails = [];

let wallH;

let RADIUS;
const CHROME_H = 46;
const BLUE_PAD = 58;
let WALL_START_Y;
const CENTER_RATIO = 0.15;
const WALL_THICK = 4;

const BLUE = "#2124ff";

let blueX, blueY, blueW, blueH;
let leftW, centreW, sepLeftX, sepRightX;
let balls = [],
  walls = [],
  separators = [];
let textElements = []; // For physics-enabled text elements

let grotaFont;

let rotationTriggered = false;
let rotationAngle = 0;
let rotationTarget;
let shakeTimer = 0;
let gravityAngle = 0;
let ballDropped = false;

let lastDroppedBall = null;
let lastVoteSide = null;
let votePosted = false;

export function preloadPoliticsScene() {
  grotaFont = loadFont("./assets/Grotta-Trial-Light.otf");
}

export async function setupPoliticsScene() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("Helvetica Neue, Arial, sans-serif");
  textAlign(CENTER, CENTER);
  rotationTarget = radians(3);

  initPhysics();
  buildLayout();
}

export function windowResizedPoliticsScene() {
  resizeCanvas(windowWidth, windowHeight);
  World.clear(world, false);
  Engine.clear(engine);
  buildLayout();
}

export function drawPoliticsScene() {
  Engine.update(engine);

  push();

  if (rotationTriggered) {
    if (shakeTimer > 0) {
      translate(random(-6, 6), random(-4, 4));
      shakeTimer--;
    }

    if (rotationAngle < rotationTarget) {
      rotationAngle += radians(0.08);
    }

    translate(width / 2, height / 2);
    rotate(rotationAngle);
    translate(-width / 2, -height / 2);

    gravityAngle = rotationAngle;
    engine.world.gravity.x = sin(gravityAngle);
    engine.world.gravity.y = cos(gravityAngle);
  }

  background(0);
  drawChrome();
  drawBluePane();
  //drawDoneButton();
  //drawResetButton();
  drawUI();
  drawBalls();
  drawTextElements();
  drawPreview();
  if (!rotationTriggered) {
    drawBottomLabels();
  }

  pop(); // ✅ End of transformed world

  // ✅ Animate and draw warning message
  if (showWarning) {
    warningAlpha = lerp(warningAlpha, 255, 0.1);
    warningScale = lerp(warningScale, 1, 0.1);
    drawWarningMessage();
  } else {
    warningAlpha = 0;
    warningScale = 0.95;

    if (showIntro) {
      drawIntroScreen();
      return;
    }
  }
}

function isHoveringButton(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

export async function mousePressedPoliticsScene() {
  if (showIntro) {
    if (
      mouseX >= introBtnX &&
      mouseX <= introBtnX + introBtnW &&
      mouseY >= introBtnY &&
      mouseY <= introBtnY + introBtnH
    ) {
      selectedLetter = LETTERS[currentLetterIndex];
      showIntro = false;
      // ✅ Generate balls only after button press
      await generateBalls();
    }
    return;
  }

  if (showWarning) {
    if (
      mouseX >= warningResetBtn.x &&
      mouseX <= warningResetBtn.x + warningResetBtn.w &&
      mouseY >= warningResetBtn.y &&
      mouseY <= warningResetBtn.y + warningResetBtn.h
    ) {
      if (ballDropped && lastDroppedBall && lastVoteSide) {
        World.remove(world, lastDroppedBall);
        balls = balls.filter((b) => b !== lastDroppedBall);
        if (politicsCounts && politicsCounts[lastVoteSide] > 0) {
          politicsCounts[lastVoteSide]--;
        }
        lastDroppedBall = null;
        lastVoteSide = null;
        votePosted = false;
      }

      rotationTriggered = false;
      rotationAngle = 0;
      ballDropped = false;
      shakeTimer = 0;
      gravityAngle = 0;
      engine.world.gravity.x = 0;
      engine.world.gravity.y = 1;

      showPreview = true;
      showWarning = false;

      buildLayout();
      // ✅ Regenerate balls after reset
      await generateBalls();
      return;
    }

    if (
      mouseX >= warningDoneBtn.x &&
      mouseX <= warningDoneBtn.x + warningDoneBtn.w &&
      mouseY >= warningDoneBtn.y &&
      mouseY <= warningDoneBtn.y + warningDoneBtn.h
    ) {
      if (!ballDropped) return;

      if (!votePosted && lastVoteSide) {
        // if (lastVoteSide === "left") await postPoliticsLeft();
        // else if (lastVoteSide === "right") await postPoliticsRight();
        // else if (lastVoteSide === "center") await postPoliticsCenter();
        votePosted = true;
      }

      rotationTriggered = true;
      shakeTimer = 20;

      separators.forEach((s) => Body.setStatic(s, false));
      textElements.forEach((t) => {
        Body.setStatic(t.body, false);
        t.body.isSensor = false;
      });

      selectedLetter = ""; // ✅ Clear only after vote is done
      showWarning = false;
      return;
    }

    return;
  }

  if (!rotationTriggered) {
    if (
      mouseX >= nextBtnX &&
      mouseX <= nextBtnX + nextBtnW &&
      mouseY >= nextBtnY &&
      mouseY <= nextBtnY + nextBtnH
    ) {
      if (!ballDropped) return;

      if (!votePosted && lastVoteSide) {
        if (lastVoteSide === "left") await postPoliticsLeft();
        else if (lastVoteSide === "right") await postPoliticsRight();
        else if (lastVoteSide === "center") await postPoliticsCenter();
        votePosted = true;
      }

      rotationTriggered = true;
      shakeTimer = 20;

      separators.forEach((s) => Body.setStatic(s, false));
      textElements.forEach((t) => {
        Body.setStatic(t.body, false);
        t.body.isSensor = false;
      });

      return;
    }

    if (
      mouseX >= resetBtnX &&
      mouseX <= resetBtnX + resetBtnW &&
      mouseY >= resetBtnY &&
      mouseY <= resetBtnY + resetBtnH
    ) {
      if (ballDropped && lastDroppedBall && lastVoteSide) {
        World.remove(world, lastDroppedBall);
        balls = balls.filter((b) => b !== lastDroppedBall);
        if (politicsCounts && politicsCounts[lastVoteSide] > 0) {
          politicsCounts[lastVoteSide]--;
        }
        lastDroppedBall = null;
        lastVoteSide = null;
        votePosted = false;
      }

      rotationTriggered = false;
      rotationAngle = 0;
      ballDropped = false;
      shakeTimer = 0;
      gravityAngle = 0;
      engine.world.gravity.x = 0;
      engine.world.gravity.y = 1;

      showPreview = true;
      showWarning = false;

      await buildLayout();
      // ✅ Regenerate balls after reset
      await generateBalls();
      return;
    }
  }

  // ✅ Drop new ball
  if (!mouseInBlue()) return;

  if (!rotationTriggered && ballDropped) {
    showWarning = true;
    return;
  }

  const { x, y } = clampToSafe(mouseX, mouseY);
  addBall(x, y, selectedLetter); // ✅ Use selectedLetter if available

  // if (selectedLetter) selectedLetter = ''; // ✅ Clear only after used

  if (!rotationTriggered) {
    ballDropped = true;
    showPreview = false;

    lastDroppedBall = balls[balls.length - 1];
    votePosted = false;

    if (x < sepLeftX) {
      politicsCounts.left++;
      lastVoteSide = "left";
    } else if (x > sepRightX) {
      politicsCounts.right++;
      lastVoteSide = "right";
    } else {
      politicsCounts.center++;
      lastVoteSide = "center";
    }
  }
}

function initPhysics() {
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1;
}

function buildLayout() {
  RADIUS = (width + height) / 120;
  WALL_START_Y = height / 3;

  blueX = BLUE_PAD;
  blueY = BLUE_PAD + CHROME_H;
  blueW = width - BLUE_PAD * 2;
  blueH = height - blueY - BLUE_PAD;

  centreW = blueW * CENTER_RATIO;
  leftW = (blueW - centreW) * 0.5;
  sepLeftX = blueX + leftW;
  sepRightX = blueX + leftW + centreW;

  World.clear(world, false);
  balls = [];
  walls = [];
  separators = [];
  textElements = [];

  const options = { isStatic: true };

  walls.push(
    Bodies.rectangle(
      blueX + blueW * 0.5,
      blueY + blueH + 25,
      blueW + 200,
      50,
      options
    )
  );
  walls.push(
    Bodies.rectangle(blueX + blueW * 0.5, blueY - 25, blueW + 200, 50, options)
  );
  walls.push(
    Bodies.rectangle(blueX - 25, blueY + blueH * 0.5, 50, blueH, options)
  );
  walls.push(
    Bodies.rectangle(
      blueX + blueW + 25,
      blueY + blueH * 0.5,
      50,
      blueH,
      options
    )
  );
  walls.push(
    Bodies.rectangle(blueX + blueW / 2, blueY + blueH + 10, blueW, 20, options)
  );
  walls.push(
    Bodies.rectangle(blueX + blueW / 2, blueY - 10, blueW, 20, options)
  );
  walls.push(
    Bodies.rectangle(blueX - 10, blueY + blueH / 2, 20, blueH, options)
  );
  walls.push(
    Bodies.rectangle(blueX + blueW + 10, blueY + blueH / 2, 20, blueH, options)
  );

  wallH = blueH - (WALL_START_Y - CHROME_H);
  const wallMid = blueY + WALL_START_Y + wallH / 2;

  const sepLeft = Bodies.rectangle(
    sepLeftX,
    wallMid,
    WALL_THICK,
    wallH,
    options
  );
  const sepRight = Bodies.rectangle(
    sepRightX,
    wallMid,
    WALL_THICK,
    wallH,
    options
  );
  separators.push(sepLeft, sepRight);

  World.add(world, walls);
  World.add(world, separators);
  createTextElements();
  // ✅ Removed generateBalls() call from here - only called after button press
}

function createTextElements() {
  const leftTextBody = Bodies.rectangle(
    blueX + 100,
    blueY + blueH - 50,
    200,
    40,
    {
      isStatic: true,
      isSensor: true,
    }
  );
  textElements.push({
    body: leftTextBody,
    text: "Left-wing",
    size: 64,
    align: "left",
  });

  const centerTextBody = Bodies.rectangle(
    sepLeftX + centreW * 0.5,
    blueY + blueH * 0.5,
    120,
    40,
    {
      isStatic: true,
      isSensor: true,
    }
  );
  textElements.push({
    body: centerTextBody,
    text: "Centrist",
    size: 64,
    align: "center",
    rotate: true,
  });

  const rightTextBody = Bodies.rectangle(
    blueX + blueW - 100,
    blueY + blueH - 50,
    200,
    40,
    {
      isStatic: true,
      isSensor: true,
    }
  );
  textElements.push({
    body: rightTextBody,
    text: "Right-wing",
    size: 64,
    align: "right",
  });

  textElements.forEach((t) => World.add(world, t.body));
}

function drawChrome() {
  noStroke();
  fill(255);
  rect(blueX, blueY - CHROME_H, blueW, CHROME_H);

  const btnY = blueY - CHROME_H * 0.5;
  fill("#ff6059");
  circle(blueX + 18, btnY, 12);
  fill("#ffbd2e");
  circle(blueX + 38, btnY, 12);
  fill("#28c941");
  circle(blueX + 58, btnY, 12);

  const addrW = min(600, blueW - 160);
  const addrX = blueX + (blueW - addrW) * 0.5;
  const addrY = blueY - CHROME_H * 0.5 - CHROME_H * 0.25;
  fill(0, 0, 0, 20);
  rect(addrX, addrY, addrW, CHROME_H * 0.5, 4);

  fill(70);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(
    "http://your-political-opinion-is-not-important.vote.il",
    addrX + addrW * 0.5,
    addrY + CHROME_H * 0.25
  );
}

function drawDoneButton() {
  if (rotationTriggered) return;

  nextBtnX = blueX + blueW - nextBtnW - 20;
  nextBtnY = blueY + 24;

  const hovering = isHoveringButton(nextBtnX, nextBtnY, nextBtnW, nextBtnH);
  const scaleAmt = hovering && ballDropped ? 1.08 : 1;

  push();
  translate(nextBtnX + nextBtnW / 2, nextBtnY + nextBtnH / 2);
  scale(scaleAmt);
  rectMode(CENTER);

  const alpha = ballDropped ? 255 : 180; // 70% opacity if not dropped yet

  // Button background
  noStroke();
  fill(255, alpha); // white background, full or 70% opacity
  rect(0, 0, nextBtnW, nextBtnH, 6);

  // Button text
  fill(red(BLUE), green(BLUE), blue(BLUE), alpha); // same blue, controlled alpha
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Done?", 0, 0);
  pop();
}

function drawResetButton() {
  if (rotationTriggered) return;

  resetBtnW = 100;
  resetBtnH = 36;
  resetBtnX = nextBtnX - resetBtnW - 24;
  resetBtnY = nextBtnY;

  const hovering = isHoveringButton(resetBtnX, resetBtnY, resetBtnW, resetBtnH);
  const scaleAmt = hovering ? 1.08 : 1;

  push();
  translate(resetBtnX + resetBtnW / 2, resetBtnY + resetBtnH / 2);
  scale(scaleAmt);
  rectMode(CENTER);

  noFill();
  stroke(255);
  strokeWeight(1);
  rect(0, 0, resetBtnW, resetBtnH, 6);

  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Reset", 0, 0);
  pop();
}
function drawBluePane() {
  fill(BLUE);
  rect(blueX, blueY, blueW, blueH);
}

function drawUI() {
  stroke(255);
  strokeWeight(1);
  if (!rotationTriggered) {
    line(sepLeftX, blueY + WALL_START_Y, sepLeftX, blueY + blueH);
    line(sepRightX, blueY + WALL_START_Y, sepRightX, blueY + blueH);
  } else {
    noStroke();
    fill(255);
    separators.forEach((sep) => {
      push();
      translate(sep.position.x, sep.position.y);
      rotate(sep.angle);
      rect(-WALL_THICK / 2, -wallH / 2, WALL_THICK, wallH); // Fixed height
      pop();
    });
  }

  const tx = blueX + 40;
  const ty = blueY + 24;
  const paddingX = 12;
  const paddingY = 6;
  textSize(28);
  textAlign(LEFT, TOP);

  let word1 = "POLITICLY";
  let word2 = "SPEAKING";
  let word3 = "I'M...";
  let h = 28 + paddingY * 2;

  fill(255);
  rect(tx, ty, textWidth(word1) + paddingX * 2, h);
  rect(tx, ty + h + 4, textWidth(word2) + paddingX * 2, h);
  rect(tx, ty + h * 2 + 8, textWidth(word3) + paddingX * 2, h);

  fill(0);
  textStyle(BOLD);
  text(word1, tx + paddingX, ty + paddingY);
  textStyle(NORMAL);
  text(word2, tx + paddingX, ty + h + 4 + paddingY);
  textStyle(BOLD);
  text(word3, tx + paddingX, ty + h * 2 + 8 + paddingY);

  const arrowCX = tx + textWidth(word3) + paddingX * 2 + 30;
  const arrowCY = ty + h * 2 + 8 + h / 2;
  stroke(0);
  strokeWeight(2);
  fill(255);
  circle(arrowCX, arrowCY, 36);
  const ang = atan2(mouseY - arrowCY, mouseX - arrowCX);
  push();
  translate(arrowCX, arrowCY);
  rotate(ang - HALF_PI);
  noStroke();
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("↓", 0, 2);
  pop();
}

function drawBottomLabels() {
  if (rotationTriggered) return;

  textSize(64);
  fill(0);
  textStyle(BOLD);
  textAlign(LEFT, BASELINE);
  text("Left-wing", blueX + 20, blueY + blueH - 24);

  push();
  translate(sepLeftX + centreW * 0.5, blueY + blueH * 0.5);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text("Centrist", 0, 0);
  pop();

  textAlign(RIGHT, BASELINE);
  text("Right-wing", blueX + blueW - 20, blueY + blueH - 24);
  textStyle(NORMAL);
}

function drawTextElements() {
  if (!rotationTriggered) return;

  textElements.forEach((t) => {
    push();
    translate(t.body.position.x, t.body.position.y);
    rotate(t.body.angle);

    fill(0);
    textSize(t.size);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    if (t.rotate) rotate(-HALF_PI);

    text(t.text, 0, 0);
    pop();
  });

  textStyle(NORMAL);
}

function drawBalls() {
  noStroke();
  balls.forEach((b) =>
    drawStyledBall(b.position.x, b.position.y, RADIUS, b.letter)
  );
}

function drawStyledBall(x, y, r, letter) {
  push();
  noStroke();
  fill(255);
  ellipse(x, y, r * 2);
  fill(0);
  textAlign(CENTER, BASELINE);
  textFont(grotaFont || "Calibri");
  textSize(r * 0.6);
  text(letter, x, y + r * 0.65);
  pop();
}

function drawPreview() {
  if (!mouseInBlue()) return;
  const p = clampToSafe(mouseX, mouseY);
  noStroke();
  fill(255, 120);
  circle(p.x, p.y, RADIUS * 2);
}

function mouseInBlue() {
  return (
    mouseX > blueX &&
    mouseX < blueX + blueW &&
    mouseY > blueY &&
    mouseY < blueY + blueH
  );
}

function clampToSafe(mx, my) {
  let x = constrain(mx, blueX + RADIUS, blueX + blueW - RADIUS);
  let y = constrain(my, blueY + RADIUS, blueY + blueH - RADIUS);
  return { x, y };
}

function addBall(x, y, customLetter = null) {
  const letter = customLetter || random("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
  let ball = Bodies.circle(x, y, RADIUS, {
    restitution: 0.8,
    friction: 0.1,
  });
  ball.letter = letter;
  balls.push(ball);
  World.add(world, ball);
}

function addBalls(num, generateX, generateY) {
  for (let i = 0; i < num; i++) {
    addBall(generateX(), generateY());
  }
}

async function generateBalls() {
  if (!politicsCounts) politicsCounts = await getPoliticsCounts();

  const xPosFuncs = {
    left: () => random(blueX, sepLeftX),
    center: () => random(sepLeftX, sepRightX),
    right: () => random(sepRightX, blueX + blueW),
  };

  const getYPosFunc = (ballCount) => {
    const maxY = blueY + blueH;
    const minY =
      WALL_START_Y + (maxY - WALL_START_Y) / ((ballCount * 4) / maxY + 1);
    return () => random(minY, maxY);
  };

  Object.entries(politicsCounts).forEach(([key, value]) =>
    addBalls(value, xPosFuncs[key], getYPosFunc(value))
  );
}

function drawWarningMessage() {
  const boxW = 460;
  const boxH = 180;
  const boxX = width / 2;
  const boxY = height / 2;

  push();
  translate(boxX, boxY);
  scale(warningScale);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // Background
  noStroke();
  fill(255, 94, 49, warningAlpha);
  rect(0, 0, boxW, boxH, 4);

  // Text
  fill(255, warningAlpha);
  textSize(20);
  textStyle(NORMAL);
  text("Changing your view?", 0, -50);
  text("Drop the ball.", 0, -25);
  text("Principles are overated anyway.", 0, 0);

  // Buttons positions (relative to center of warning box)
  warningResetBtn.x = boxX - 70 - warningResetBtn.w / 2;
  warningResetBtn.y = boxY + 50 - warningResetBtn.h / 2;

  warningDoneBtn.x = boxX + 70 - warningDoneBtn.w / 2;
  warningDoneBtn.y = boxY + 50 - warningDoneBtn.h / 2;

  // Draw Reset Button
  push();
  translate(
    warningResetBtn.x + warningResetBtn.w / 2 - boxX,
    warningResetBtn.y + warningResetBtn.h / 2 - boxY
  );
  rectMode(CENTER);
  noFill();
  stroke(255, warningAlpha);
  strokeWeight(1.5);
  rect(0, 0, warningResetBtn.w, warningResetBtn.h, 6);
  fill(255, warningAlpha);
  noStroke();
  textSize(16);
  textStyle(BOLD);
  text("Switch", 0, 2);
  pop();

  // Draw Done Button
  push();
  translate(
    warningDoneBtn.x + warningDoneBtn.w / 2 - boxX,
    warningDoneBtn.y + warningDoneBtn.h / 2 - boxY
  );
  rectMode(CENTER);
  noStroke();
  fill(255, warningAlpha);
  rect(0, 0, warningDoneBtn.w, warningDoneBtn.h, 6);
  fill(BLUE + hex(floor(warningAlpha), 2));
  textSize(16);
  textStyle(BOLD);
  text("Anarchy", 0, 2);
  pop();

  pop();
}

function updateBallTrails() {
  balls.forEach((b) => {
    ballTrails.push({
      x: b.position.x,
      y: b.position.y,
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      alpha: 255,
      radius: RADIUS * 0.1, // smaller particles
    });
  });

  ballTrails.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 6;
    p.radius *= 0.96;
  });

  ballTrails = ballTrails.filter((p) => p.alpha > 0);
}

function drawBallTrails() {
  noStroke();
  ballTrails.forEach((p) => {
    fill(255, p.alpha);
    ellipse(p.x, p.y, p.radius * 2);
  });
}

function drawIntroScreen() {
  push();
  translate(width / 2, height / 2);
  scale(introScale);
  translate(-width / 2, -height / 2);
  tint(255, introAlpha);

  // Draw overlay only on top of the blue area
  fill(BLUE);
  rect(blueX, blueY, blueW, blueH);

  const centerX = blueX + blueW / 2;
  const centerY = blueY + blueH / 2;
  const ballRadius = min(blueW, blueH) * 0.12;

  // Title – 24px above the ball
  textFont(grotaFont || "Calibri");
  textSize(28);
  fill(255);
  textAlign(CENTER, BOTTOM);
  text("Scroll to choose a letter", centerX, centerY - ballRadius - 24);

  // Ball
  fill(255);
  ellipse(centerX, centerY, ballRadius * 2);

  // Letter inside ball
  fill(0);
  textSize(ballRadius * 0.7);
  textAlign(CENTER, CENTER);
  const letter = LETTERS[currentLetterIndex];
  textFont(grotaFont || "Calibri");
  text(letter, centerX, centerY + ballRadius * 0.1);

  // "Finished" button — 24px below the ball
  introBtnW = 180;
  introBtnH = 50;
  introBtnX = centerX - introBtnW / 2;
  introBtnY = centerY + ballRadius + 60;

  const hovering = isHoveringButton(introBtnX, introBtnY, introBtnW, introBtnH);
  const scaleAmt = hovering ? 1.05 : 1;

  push();
  translate(introBtnX + introBtnW / 2, introBtnY + introBtnH / 2);
  scale(scaleAmt);
  rectMode(CENTER);
  noStroke();
  noFill();
  stroke(255);
  strokeWeight(1.5);
  rect(0, 0, introBtnW, introBtnH, 10);

  noStroke();
  fill(255);
  textFont("Helvetica Neue");
  textSize(20);
  textAlign(CENTER, CENTER);
  text("This is my ball", 0, 2);
  pop();

  noTint();
  pop();
}

let scrollAccum = 0;
const SCROLL_THRESHOLD = 100; // Adjust this to make it more or less sensitive

export function mouseWheelPoliticsScene(event) {
  if (showIntro) {
    scrollAccum += event.delta;

    if (scrollAccum > SCROLL_THRESHOLD) {
      currentLetterIndex = (currentLetterIndex + 1) % LETTERS.length;
      scrollAccum = 0;
    } else if (scrollAccum < -SCROLL_THRESHOLD) {
      currentLetterIndex =
        (currentLetterIndex - 1 + LETTERS.length) % LETTERS.length;
      scrollAccum = 0;
    }

    return false; // prevent page from scrolling
  }
}

//lior's code
export function getPoliticsUserPick() {
  return lastVoteSide;
}
