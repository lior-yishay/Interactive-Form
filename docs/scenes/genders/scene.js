import { getFooterTop } from "../../footer/footer.js";
import { playSound } from "../../soundManager.js";
import { getGenderCounts, postGenderPick } from "./logic.js";
// import { getGenderCounts, postGenderPick } from "../../../proxy server/proxyServer.js"

let genderCounts = [];
let balls = [];

let userPicked = null;
let palette = ["#F14E1D", "#FFC700", "#10A959", "#C9B8FF", "#FFCBCB"];
let grottaFont;
let snellFont;
let heartParticles = [];
let selectedBall = null;
let isInverted = false;
let hasInvertedOnce = false;

let lastClickedBall = null;

let clickSound;

const maxCount = 200;

export function preloadGendersScene() {
  grottaFont = loadFont("./assets/Grotta-Trial-Medium.ttf");
  snellFont = loadFont("./assets/SnellBT-Bold.otf");

  clickSound = loadSound("./assets/minimal-pop-click-ui-3-198303.mp3");
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function getCleanLabel(label) {
  return label.toUpperCase().replace(/[^A-Z0-9\s\-]/gi, "");
}

async function getNormalizedGenderCounts(maxCount = 20) {
  const originalCounts = await getGenderCounts();
  const alteredCounts = originalCounts.map((gender) => ({
    ...gender,
    count: gender.count + additionalVotes(gender),
  }));

  const currentMax = Math.max(...alteredCounts.map((g) => g.count));
  if (currentMax < maxCount) return alteredCounts;
  return alteredCounts.map((gender) => ({
    ...gender,
    count: Math.round((gender.count / currentMax) * maxCount),
  }));
}

const additionalVotes = (gender) => {
  return ["MALE", "FEMALE"].includes(getCleanLabel(gender.name)) ? 100 : 0;
};

export async function setupGendersScene() {
  genderCounts = await getNormalizedGenderCounts(maxCount);
  console.log(genderCounts);
  createCanvas(windowWidth, windowHeight);
  textFont(grottaFont);
  textSize(14);
  cursor();
  angleMode(DEGREES);

  let baseR = 5;
  let origin = createVector(width / 2, height / 2);
  let tempBalls = [];

  for (let i = 0; i < genderCounts.length; i++) {
    let { name, count } = genderCounts[i];
    let cleanLabel = getCleanLabel(name);
    let shapeType =
      cleanLabel.length > 9
        ? "circle"
        : random(["circle", "starburst", "scallop", "rect"]);
    let col = color(random(palette));

    let angle = random(TWO_PI);
    let speed = random(0.3, 1.2);
    let vx = (cos(angle) * speed) / 10;
    let vy = (sin(angle) * speed) / 10;

    let tempBall = new GenderBall(
      origin.x,
      origin.y,
      baseR,
      cleanLabel,
      vx,
      vy,
      col,
      shapeType
    );

    if (shapeType === "starburst") {
      tempBall.baseR *= 0.7;
    }

    tempBall.baseScale = map(count, 1, 140, 0.3, 1.2);
    tempBall.ensureTextFits();
    tempBalls.push(tempBall);
  }

  let maxStarburstHeight = 0;
  for (let b of tempBalls) {
    if (b.shapeType === "starburst") {
      maxStarburstHeight = max(maxStarburstHeight, b.shapeHeight);
    }
  }

  if (maxStarburstHeight === 0) {
    maxStarburstHeight = max(tempBalls.map((b) => b.shapeHeight));
  }

  for (let b of tempBalls) {
    let currentH = b.shapeHeight;
    let visualAdjust = b.shapeType === "starburst" ? 1 : 1.2;
    let targetH = maxStarburstHeight;
    let scaleFactor = (targetH * visualAdjust) / currentH;
    b.baseR *= scaleFactor;
    b.ensureTextFits();
    balls.push(b);
  }

  let globalScaleDown = 0.5;
  for (let b of balls) b.baseR *= globalScaleDown;

  for (let ball of balls) {
    const genderCount =
      genderCounts.find(({ name }) => getCleanLabel(name) === ball.label)
        ?.count ?? 0;
    ball.overshootTarget = genderCount;
    ball.overshootProgress = 0;
    ball.initialOvershoot = genderCount;
  }
}

export function windowResizedGendersScene() {
  resizeCanvas(windowWidth, windowHeight);
}

export function drawGendersScene() {
  background(isInverted ? 0 : "EEEEEE");
  fill(isInverted ? 255 : 0);
  textAlign(CENTER, CENTER);

  textFont(grottaFont);
  textSize(240);
  text("CHOOSE", width / 2, height / 2 - 200);
  text("Gender", width / 2, height / 2 + 200);
  textFont(snellFont);
  textSize(180);
  text("YOUR", width / 2, height / 2);

  for (let ball of balls) {
    let timeSinceClick = millis() - ball.lastClickTime;
    if (timeSinceClick < 1000) {
      ball.overshootProgress = lerp(
        ball.overshootProgress,
        ball.overshootTarget,
        0.1
      );
    } else {
      ball.overshootTarget = ball.initialOvershoot;
      ball.overshootProgress = lerp(
        ball.overshootProgress,
        ball.initialOvershoot,
        0.1
      );
    }

    ball.move();
    ball.collide(balls);
    ball.display();
  }

  for (let h of heartParticles) {
    h.update();
    h.display();
  }
  heartParticles = heartParticles.filter((h) => !h.isDead());
}

export function mousePressedGendersScene() {
  let currentTime = millis();
  let maxOvershoot = min(width, height);

  for (let ball of balls) {
    if (ball.contains(mouseX, mouseY)) {
      ball.clickPulse = 1;

      if (lastClickedBall === ball) {
        ball.overshootTarget = min(ball.overshootTarget + 2, maxOvershoot);
      } else {
        for (let b of balls) {
          b.overshootTarget = b.initialOvershoot;
          b.overshootProgress = b.initialOvershoot;
        }
        ball.overshootTarget = 2 + ball.initialOvershoot;
      }

      ball.lastClickTime = currentTime;
      lastClickedBall = ball;

      if (selectedBall && selectedBall !== ball) selectedBall.selected = false;
      selectedBall = ball;
      selectedBall.selected = true;

      if (!ball.userPickedLogged) {
        userPicked = ball.label;
        ball.userPickedLogged = true;
      }

      if (!hasInvertedOnce) {
        isInverted = true;
        hasInvertedOnce = true;
      }

      playSound(clickSound);

      break;
    }
  }
}

// GenderBall class with new display() method

class GenderBall {
  constructor(x, y, baseR, label, vx, vy, col, shapeType) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.baseR = baseR;
    this.baseScale = 1;
    this.hoverScale = 1;
    this.label = label;
    this.col = col;
    this.shapeType = shapeType;
    this.padding = 32;
    this.selected = false;
    this.selectionOffset = createVector(0, 0);
    this.overshootProgress = 0;
    this.overshootTarget = 0;
    this.initialOvershoot = 0;
    this.lastClickTime = 0;
    this.clickPulse = 0;
    this.userPickedLogged = false;
    this.hasInitialized = false;

    if (shapeType === "starburst") {
      this.innerRatio = 0.5;
      this.points = 16;
    }
  }

  get r() {
    const base = this.baseR * this.baseScale * this.hoverScale;
    const overshootFactor = 1 + this.overshootProgress / base;
    const pulseFactor = easeOutBack(this.clickPulse) * 0.1;
    return base * overshootFactor * (1 + pulseFactor);
  }

  get shapeWidth() {
    return this.r * 2;
  }

  get shapeHeight() {
    return this.shapeType === "rect" ? this.r * 2 : this.r * 1.6; //lior's code chaned this
  }

  move() {
    if (this.hasInitialized) {
      this.vel.x += random(-0.02, 0.02);
      this.vel.y += random(-0.02, 0.02);
      this.vel.limit(0.5);
      this.pos.add(this.vel);
    } else {
      this.hasInitialized = true;
    }

    //previous
    // let buffer = 50;
    // if (this.pos.x < buffer) this.vel.x += 0.05;
    // if (this.pos.x > width - buffer) this.vel.x -= 0.05;
    // if (this.pos.y < buffer) this.vel.y += 0.05;
    // if (this.pos.y > height - buffer) this.vel.y -= 0.05;

    //lior's code
    if (this.pos.x < this.shapeWidth / 2) {
      this.pos.x = this.shapeWidth / 2;
      this.vel.x *= -0.7; // bounce back (dampen velocity)
    }

    if (this.pos.x > width - this.shapeWidth / 2) {
      this.pos.x = width - this.shapeWidth / 2;
      this.vel.x *= -0.7; // bounce back (dampen velocity)
    }

    if (this.pos.y < this.shapeHeight / 2) {
      this.pos.y = this.shapeHeight / 2;
      this.vel.y *= -0.7; // bounce back (dampen velocity)
    }

    if (this.pos.y > getFooterTop() - this.shapeHeight / 2) {
      this.pos.y = getFooterTop() - this.shapeHeight / 2;
      this.vel.y *= -0.7; // bounce back (dampen velocity)
    }
    //end of lior's code

    let hover = this.contains(mouseX, mouseY);
    this.hoverScale = lerp(this.hoverScale, hover ? 1.1 : 1, 0.1);
    this.clickPulse = lerp(this.clickPulse, 0, 0.1);

    if (this.selected) {
      this.selectionOffset.x = sin(frameCount * 5) * 2;
      this.selectionOffset.y = cos(frameCount * 5) * 2;
    } else {
      this.selectionOffset.set(0, 0);
    }
  }

  display() {
    push();
    translate(
      this.pos.x + this.selectionOffset.x,
      this.pos.y + this.selectionOffset.y
    );

    if (this.selected) {
      stroke(isInverted ? 255 : 0);
      strokeWeight(2);
    } else {
      noStroke();
    }

    fill(this.col);
    let shapeToDraw = this.shapeType === "scallop" ? "circle" : this.shapeType;

    switch (shapeToDraw) {
      case "circle":
        ellipse(0, 0, this.shapeWidth, this.shapeHeight);
        break;
      case "rect": {
        let petals = 7;
        let radius = this.r * 1.2;
        beginShape();
        for (let angle = 0; angle <= 360; angle += 1) {
          let r = radius + radius * 0.3 * sin(petals * angle);
          let x = r * cos(angle);
          let y = r * sin(angle);
          vertex(x, y);
        }
        endShape(CLOSE);
        break;
      }
      case "starburst":
        this.drawStarburst(0, 0, this.r * this.innerRatio, this.r, this.points);
        break;
    }

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(grottaFont);

    // 🆕 Smoothed dynamic text size based on shape width (dampened)
    let baseFontSize = 14;
    textSize(baseFontSize);
    let labelW = textWidth(this.label);
    let availableW = this.shapeWidth - this.padding;

    let rawScale = availableW / max(labelW, 1);
    let dampedScale = 1 + (rawScale - 1) * 0.4; // ✨ less aggressive growth
    let scaledSize = constrain(baseFontSize * dampedScale, 8, 36);

    textSize(scaledSize);
    text(this.label, 0, 0);
    pop();
  }

  contains(mx, my) {
    return dist(mx, my, this.pos.x, this.pos.y) < this.shapeWidth / 2;
  }

  ensureTextFits() {
    textFont(grottaFont);
    textSize(14);
    let labelW = textWidth(this.label) + this.padding;
    let maxShapeW = width * 0.9;
    let maxShapeH = height * 0.9;

    if (this.shapeType === "starburst") {
      let targetInnerR = labelW / 2;
      let outerR = targetInnerR / this.innerRatio;
      if (this.r < outerR) {
        this.baseR = outerR / (this.baseScale * this.hoverScale);
      }
      if (outerR * 2 > maxShapeW || outerR * 2 > maxShapeH) {
        let maxR = min(maxShapeW, maxShapeH) / 2;
        this.baseR = maxR / (this.baseScale * this.hoverScale);
      }
    } else {
      let requiredR = labelW / 2;
      if (this.r < requiredR) {
        this.baseR = requiredR / (this.baseScale * this.hoverScale);
      }
      let shapeW = requiredR * 2;
      let shapeH = requiredR * 1.6;
      if (shapeW > maxShapeW || shapeH > maxShapeH) {
        let maxR = min(maxShapeW / 2, maxShapeH / 1.6);
        this.baseR = maxR / (this.baseScale * this.hoverScale);
      }
    }
  }

  collide(others) {
    for (let other of others) {
      if (other !== this) {
        let dir = p5.Vector.sub(this.pos, other.pos);
        let d = dir.mag();
        let minDist = (this.shapeWidth + other.shapeWidth) / 2;
        if (d < minDist && d > 0) {
          let overlap = minDist - d;
          dir.normalize();
          dir.mult(overlap / 2);
          this.pos.add(dir);
          other.pos.sub(dir);
          this.vel.add(dir.copy().mult(0.02));
          other.vel.sub(dir.copy().mult(0.02));
        }
      }
    }
  }

  drawStarburst(x, y, innerR, outerR, points) {
    push();
    translate(x, y);
    beginShape();
    for (let i = 0; i < points; i++) {
      let angle1 = (360 / points) * i;
      let angle2 = angle1 + 360 / (points * 2);
      let angle3 = angle1 + 360 / points;

      let x1 = cos(angle1) * outerR;
      let y1 = sin(angle1) * outerR;
      let x2 = cos(angle2) * innerR;
      let y2 = sin(angle2) * innerR;
      let x3 = cos(angle3) * outerR;
      let y3 = sin(angle3) * outerR;

      vertex(x1, y1);
      quadraticVertex(x2, y2, x3, y3);
    }
    endShape(CLOSE);
    pop();
  }
}

//lior's code
export function getGendersUserPick() {
  return userPicked;
}
