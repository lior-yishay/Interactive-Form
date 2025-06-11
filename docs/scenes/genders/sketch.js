// import { getGenderCounts, postGenderPick } from "./logic.js";
import { getGenderCounts, postGenderPick } from "../../../proxy server/proxyServer.js"

let genderCounts = []

let balls = [];
let palette = ['#F14E1D', '#FFC700', '#10A959', '#C9B8FF', '#FFCBCB'];
let grottaFont;

export function preloadGendersScene() {
  grottaFont = loadFont('./assets/Grotta-Trial-Medium.ttf'); // Upload this file to the sketch
}

export async function setupGendersScene() {
  genderCounts = await getGenderCounts()

  createCanvas(windowWidth, windowHeight);
  textFont(grottaFont);
  textSize(16);
  angleMode(DEGREES);

  let maxAttempts = 10000;
  let attempts = 0;
  let baseR = 5;

  for (let i = 0; i < genderCounts.length && attempts < maxAttempts;) {
    let rawLabel = genderCounts[i].name.toUpperCase();
    let cleanLabel = rawLabel.replace(/[^A-Z0-9\s\-]/gi, '');

    let shapeType = random(['circle', 'starburst', 'scallop', 'rect']);
    let col = color(random(palette));
    let vx = random(-1, 1);
    let vy = random(-1, 1);

    let tempBall = new Ball(
      random(baseR, width - baseR),
      random(baseR + 100, height - baseR),
      baseR,
      cleanLabel,
      vx,
      vy,
      col,
      shapeType
    );
    tempBall.ensureTextFits();

    let noOverlap = balls.every(b => !tempBall.overlaps(b));
    let inCanvas = tempBall.isInCanvas();

    if (noOverlap && inCanvas) {
      balls.push(tempBall);
      i++;
    }
    attempts++;
  }

  // === Find the largest bounding box (width or height) ===
  let maxBox = 0;
  for (let b of balls) {
    maxBox = max(maxBox, b.shapeWidth, b.shapeHeight);
  }

  // === Scale all shapes to match the largest bounding box ===
  for (let b of balls) {
    let currentBox = max(b.shapeWidth, b.shapeHeight);
    if (currentBox > 0) {
      let scaleFactor = maxBox / currentBox;
      b.scale *= scaleFactor;
    }
  }

  // === Apply a global downscale factor ===
  let globalScaleDown = 0.5; // <-- adjust this factor (0.5 = half size)
  for (let b of balls) {
    b.scale *= globalScaleDown;
  }

  let stars = balls.filter(b => b.shapeType === 'starburst');
  shuffle(stars, true);
  for (let i = 0; i < min(4, stars.length); i++) {
    stars[i].shapeType = 'circle';
  }
}
export function windowResizedGendersScene() {
  resizeCanvas(windowWidth, windowHeight);
}

export function drawGendersScene() {
  background('EEEEEE');

  fill(0);
  textAlign(CENTER, CENTER);
  textFont(grottaFont);
  textSize(240);
  text("CHOOSE", width / 2, height / 2 - 260);
  text("YOUR", width / 2, height / 2);
  text("GENDER", width / 2, height / 2 + 260);

  for (let ball of balls) {
    ball.move();
    ball.collide(balls);
    ball.display();
  }
}

export async function mousePressedGendersScene() {
  for (let ball of balls) {
    if (ball.contains(mouseX, mouseY)) {
      ball.tryGrow(balls);
      await postGenderPick(ball.label)
    }
  }
}

class Ball {
  constructor(x, y, baseR, label, vx, vy, col, shapeType) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.baseR = baseR;
    this.scale = 1;
    this.label = label.replace(/[^A-Z0-9\s\-]/gi, ''); // Clean again just in case
    this.col = col;
    this.shapeType = shapeType;
    this.padding = 20;

    if (shapeType === 'starburst') {
      this.innerRatio = 0.5;
      this.points = 16;
    }
  }

  get r() {
    return this.baseR * this.scale;
  }

  get shapeWidth() {
    textFont(grottaFont);
    textSize(12);
    return max(this.r * 2, textWidth(this.label) + this.padding);
  }

  get shapeHeight() {
    return this.r * 1.6;
  }

  move() {
    this.pos.add(this.vel);
    let halfW = this.shapeWidth / 2;
    let halfH = this.shapeHeight / 2;
    let margin = this.shapeType === 'starburst' ? this.r * 0.5 : 0;

    this.pos.x = constrain(this.pos.x, halfW + margin, width - halfW - margin);
    this.pos.y = constrain(this.pos.y, halfH + margin, height - halfH - margin);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.col);

    let shapeToDraw = (this.shapeType === 'scallop') ? 'circle' : this.shapeType;

    switch (shapeToDraw) {
      case 'circle':
        ellipse(0, 0, this.shapeWidth, this.shapeHeight);
        break;
      case 'rect':
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
      case 'starburst':
        this.drawStarburst(0, 0, this.r * this.innerRatio, this.r, this.points);
        break;
    }

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(grottaFont);
    textSize(10 * this.scale);
    text(this.label, 0, 0);
    pop();
  }

  contains(mx, my) {
    return dist(mx, my, this.pos.x, this.pos.y) < this.shapeWidth / 2;
  }

  tryGrow(others) {
    let test = this.clone();
    test.scale *= 1.05;
    test.ensureTextFits();

    let maxW = width * 0.8;
    let maxH = height * 0.8;

    if (test.shapeWidth < maxW && test.shapeHeight < maxH) {
      this.scale = test.scale;
      for (let other of others) {
        if (other !== this) {
          let dir = p5.Vector.sub(other.pos, this.pos);
          let d = dir.mag();
          let minDist = (this.shapeWidth + other.shapeWidth) / 2;
          if (d < minDist && d > 0) {
            let overlap = minDist - d;
            dir.normalize();
            dir.mult(overlap / 2);
            other.pos.add(dir);
            this.pos.sub(dir);
          }
        }
      }
    }
  }

  ensureTextFits() {
    textFont(grottaFont);
    textSize(12);
    let labelW = textWidth(this.label) + this.padding;
    if (this.shapeType === 'starburst') {
      let targetInnerR = labelW / 2;
      let outerR = targetInnerR / this.innerRatio;
      let requiredR = outerR;
      if (this.r < requiredR) {
        this.baseR = requiredR / this.scale;
      }
    } else {
      let requiredR = labelW / 2;
      if (this.r < requiredR) {
        this.baseR = requiredR / this.scale;
      }
    }
  }

  isInCanvas() {
    let w = this.shapeWidth / 2;
    let h = this.shapeHeight / 2;
    let margin = this.shapeType === 'starburst' ? this.r * 0.5 : 0;

    return (
      this.pos.x - w - margin > 0 &&
      this.pos.x + w + margin < width &&
      this.pos.y - h - margin > 0 &&
      this.pos.y + h + margin < height
    );
  }

  overlaps(other) {
    return dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) <
      (this.shapeWidth + other.shapeWidth) / 2;
  }

  clone() {
    let clone = new Ball(this.pos.x, this.pos.y, this.baseR, this.label, this.vel.x, this.vel.y, this.col, this.shapeType);
    clone.scale = this.scale;
    return clone;
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
