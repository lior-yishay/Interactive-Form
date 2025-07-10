import { getPoliticsCounts } from "./logic.js";

// Restored design + shake, tilt, gravity-collapse effect
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;
let engine, world;

let politicsCounts;
let nextBtnX,
  nextBtnY,
  nextBtnW = 100,
  nextBtnH = 36;
let resetBtnX,
  resetBtnY,
  resetBtnW = 100,
  resetBtnH = 36;

let warningResetBtn = { x: 0, y: 0, w: 120, h: 40 };
let warningDoneBtn = { x: 0, y: 0, w: 120, h: 40 };

//message
let showWarning = false;
let warningAlpha = 0;
let warningScale = 0.95;

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
  // textFont("Helvetica Neue, Arial, sans-serif");
  textAlign(CENTER, CENTER);
  rotationTarget = radians(3);

  initPhysics();
  await buildLayout();
}

export async function windowResizedPoliticsScene() {
  resizeCanvas(windowWidth, windowHeight);
  World.clear(world, false);
  Engine.clear(engine);
  await buildLayout();
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
  }
}

export async function mousePressedPoliticsScene() {
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

      showWarning = false;

      await buildLayout();
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

      showWarning = false;

      await buildLayout();
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
  addBall(x, y);

  if (!rotationTriggered) {
    ballDropped = true;

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

async function buildLayout() {
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
  await generateBalls();
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
  setSceneTextFont();
  text(
    "http://your-political-opinion-is-not-important.vote.il",
    addrX + addrW * 0.5,
    addrY + CHROME_H * 0.25
  );
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
  setSceneTextFont();
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
  setSceneTextFont();
  text("↓", 0, 2);
  pop();
}

function drawBottomLabels() {
  if (rotationTriggered) return;

  textSize(90);
  fill(0);
  textStyle(BOLD);
  textAlign(LEFT, BASELINE);
  setSceneTextFont();
  text("Left-wing", blueX + 20, blueY + blueH - 24);

  push();
  translate(sepLeftX + centreW * 0.5, blueY + blueH * 0.5);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  setSceneTextFont();
  text("Centrist", 0, 0);
  pop();

  textAlign(RIGHT, BASELINE);
  setSceneTextFont();
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

    setSceneTextFont();
    text(t.text, 0, 0);
    pop();
  });

  textStyle(NORMAL);
}

function drawBalls() {
  noStroke();
  balls.forEach((b) =>
    drawStyledBall(b.position.x, b.position.y, RADIUS, b.number)
  );
}

function drawStyledBall(x, y, r, number) {
  push();
  noStroke();
  fill(255);
  ellipse(x, y, r * 2);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(r * 0.6);
  text(number, x, y);
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

function addBall(x, y) {
  let ball = Bodies.circle(x, y, RADIUS, {
    restitution: 0.8,
    friction: 0.1,
  });
  const number = balls.length + 1;
  ball.number = number;
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
  setSceneTextFont();
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
  setSceneTextFont();
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
  setSceneTextFont();
  text("Anarchy", 0, 2);
  pop();

  pop();
}

const setSceneTextFont = () => textFont("Helvetica");

//lior's code
export function getPoliticsUserPick() {
  return lastVoteSide;
}
