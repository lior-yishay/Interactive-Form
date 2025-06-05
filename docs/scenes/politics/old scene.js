// import { generateBalls } from "./logic.js";

let font;
let container = [];
let scaledContainer = [];
export let balls = [];
let gravity = 0.9;
let damping = -0.4;
let friction = 0.95;

let containerX, containerY, containerW, containerH;

export function preloadPoliticsScene() {
  font = loadFont('./assets/GT-Maru-Bold-Trial.otf')
  container = loadJSON("./assets/accurate_left_container.json");
}

export async function setupPoliticsScene() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textAlign(CENTER, CENTER);
  container = Object.values(container);

  containerX = width * 0.05;
  containerY = height * 0.2;
  containerW = width * 0.42;
  containerH = height * 0.7;

  scaledContainer = container.map(pt => [
    containerX + pt[0] * containerW,
    containerY + pt[1] * containerH
  ]);

  //my code
  await generateBalls(150, 850, 0, 0, 0, 0)
  createStaticFloorBalls()
}

export function drawPoliticsScene() {
  background(0);
  drawHeadline();
  drawContainerShape();

//   for (let i = 0; i < balls.length; i++) {
//     let ball = balls[i];
//     ball.applyPhysics();
//     for (let j = i + 1; j < balls.length; j++) {
//       ball.collideWith(balls[j]);
//     }
//     ball.updateContainment(scaledContainer);
//     ball.containWithinCanvasOrContainer();
//     ball.display();
//   }

    //my code
    updateAllBalls();
}

function drawHeadline() {
  fill('#D9FF00');
  noStroke();
  let x = width * 0.07;
  let y = height * 0.05;
  textSize(height * 0.04);
  textAlign(LEFT, TOP);
  text("POLITICALLY", x, y);
  text("SPEAKING I'M", x, y + height * 0.05);

  stroke('#D9FF00');
  noFill();
  beginShape();
  for (let i = 0; i < 100; i++) {
    let px = x + i * 2;
    let py = y + height * 0.04 + sin(i * 0.2) * 4;
    vertex(px, py);
  }
  endShape();
}

function drawContainerShape() {
  stroke(255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let pt of scaledContainer) {
    vertex(pt[0], pt[1]);
  }
  endShape();
}

export function mousePressedPoliticsScene() {
    console.log(mouseX, mouseY)
  balls.push(new Ball(mouseX, mouseY, randomLetter()));
}

function randomLetter() {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return chars.charAt(floor(random(chars.length)));
}

//my code:
const updateAllBalls = () => {
  for (let ball of balls) {
    ball.applyPhysics();
  }

  // Repeat collision resolution multiple times for stability
  for (let k = 0; k < 10; k++) {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        balls[i].collideWith(balls[j]);
      }
    }
  }

  for (let ball of balls) {
    ball.updateContainment(scaledContainer);
    ball.containWithinCanvasOrContainer();
    ball.display();
  }


}

//my code
const createStaticFloorBalls = () => {
  const radius = min(width, height) * 0.02;
  let spacing = 2 * radius;
  for (let x = containerX + radius; x < containerX + containerW; x += spacing) {
    let b = new Ball(x, containerY + containerH - radius, 's');
    b.vx = 0;
    b.vy = 0;
    b.isStatic = true; // add property
    balls.push(b);
  }
}



export class Ball {
  constructor(x, y, letter) {
    this.x = x;
    this.y = y;
    this.r = min(width, height) * 0.02;
    this.vx = random(-0.1, 0.1);
    this.vy = 0;
    this.letter = letter;
    this.wasInsideContainer = false; // 🟢 key flag!
    this.isStatic = false
  }

  applyPhysics() {
    if(this.isStatic)
        return

    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.985;
    this.vy *= 0.985;
  }

//   collideWith(other) {
//     let dx = this.x - other.x;
//     let dy = this.y - other.y;
//     let dist = sqrt(dx * dx + dy * dy);
//     let minDist = this.r + other.r;

//     if (dist < minDist && dist > 0) {
//       let angle = atan2(dy, dx);
//       let overlap = (minDist - dist) * 0.5;

//       let ax = cos(angle) * overlap;
//       let ay = sin(angle) * overlap;

//       this.x += ax;
//       this.y += ay;
//       other.x -= ax;
//       other.y -= ay;

//       let tempVX = this.vx;
//       let tempVY = this.vy;
//       this.vx = other.vx * 0.5;
//       this.vy = other.vy * 0.5;
//       other.vx = tempVX * 0.5;
//       other.vy = tempVY * 0.5;
//     }
//   }
    collideWith(other) {
        if(this.isStatic && other.isStatic) 
            return

        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let dist = sqrt(dx * dx + dy * dy);
        let minDist = this.r + other.r;

        if (dist < minDist && dist > 0) {
            let nx = dx / dist;
            let ny = dy / dist;
            let overlap = (minDist - dist) * 0.5;

            let correction = 0.5
            if (this.isStatic || other.isStatic) {
                let dynamic = this.isStatic ? other : this;
                // only move the dynamic one
                dynamic.x += nx * overlap * correction;
                dynamic.y += ny * overlap * correction;
                // dynamic.vx *= -0.3;
                // dynamic.vy = 0;

                 // Apply friction-like dampening
                dynamic.vx *= 0.5;
                dynamic.vy *= 0.5;

                // Stop tiny vibrations
                if (abs(dynamic.vx) < 0.05) dynamic.vx = 0;
                if (abs(dynamic.vy) < 0.05) dynamic.vy = 0;
                return
            }

            // Push them apart
            this.x += nx * overlap * correction;
            this.y += ny * overlap* correction;
            other.x -= nx * overlap* correction;
            other.y -= ny * overlap* correction;

            // Relative velocity
            let dvx = this.vx - other.vx;
            let dvy = this.vy - other.vy;

            // Dot product of velocity difference and normal
            let dot = dvx * nx + dvy * ny;

            if (dot < 0) {
            let bounce = 0.7; // restitution coefficient
            let impulse = (2 * dot) / 2; // equal mass
            this.vx -= impulse * nx * bounce;
            this.vy -= impulse * ny * bounce;
            other.vx += impulse * nx * bounce;
            other.vy += impulse * ny * bounce;
            }
        }
    }


  updateContainment(polygon) {
    // check if still inside container
    let bottom = [this.x, this.y + this.r];
    if (pointInPolygon(bottom, polygon)) {
      this.wasInsideContainer = true;
    }
  }

  containWithinCanvasOrContainer() {
    if (this.wasInsideContainer) {
      // 🟢 use container logic
      if (this.y > containerY + containerH - this.r * 0.95) {
        this.y = containerY + containerH - this.r * 0.95;
        this.vy = 0;
      }

      if (this.x - this.r < containerX + 1) {
        this.x = containerX + this.r + 1;
        this.vx *= -0.3;
      }

      if (this.x + this.r > containerX + containerW - 1) {
        this.x = containerX + containerW - this.r - 1;
        this.vx *= -0.3;
      }
    } else {
      // 🔵 use screen boundaries
      if (this.x - this.r < 0) {
        this.x = this.r;
        this.vx *= -0.4;
      }
      if (this.x + this.r > width) {
        this.x = width - this.r;
        this.vx *= -0.4;
      }
      if (this.y + this.r > height) {
        this.y = height - this.r;
        this.vy = 0;
      }
    }
  }

  display() {
    fill(this.isStatic ? 100 : 255);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2);
    if(this.isStatic)
        return
    fill(0);
    noStroke();
    textSize(this.r);
    text(this.letter, this.x, this.y + 1);
  }
}

function pointInPolygon(point, poly) {
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i][0], yi = poly[i][1];
    let xj = poly[j][0], yj = poly[j][1];
    let intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / ((yj - yi) + 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function windowResizedPoliticsScene() {
  resizeCanvas(windowWidth, windowHeight);
  setupPoliticsScene();
}