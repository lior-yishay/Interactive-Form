let grottaFont, snellFont, smilyImg, customCursor;
let smilies = [];
let miniSmilies = [];
let smilySize = 90;
let bgColor;
let bgColors = ["#3A3B62"];
let draggingSmiley = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let starImg;

export function preloadSmileLoaderScene() {
  grottaFont = loadFont("./assets/Grotta-Trial-Regular.ttf");
  snellFont = loadFont("./assets/snellroundhand_black.otf");
  smilyImg = loadImage("./assets/smily.png");
  customCursor = loadImage("./assets/curor.png");
  starImg = loadImage("./assets/Star 15.svg"); // Load the SVG star
}

export function setupSmileLoaderScene() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  bgColor = color("#3A3B62");

  for (let i = 0; i < 4; i++) {
    smilies.push({
      x: random(smilySize, width - smilySize),
      y: random(smilySize, height - smilySize),
      dx: random([-3, 3]),
      dy: random([-2, 2]),
      size: smilySize,
      angle: random(TWO_PI),
      angleSpeed: random(0.01, 0.03),
      lastPopFrame: 0,
      dragging: false,
      hasDuplicated: false,
    });
  }
}

export function drawSmileLoaderScene() {
  background(bgColor);
  noCursor();

  // Mini smilies (burst animation)
  for (let i = miniSmilies.length - 1; i >= 0; i--) {
    let s = miniSmilies[i];
    s.x += s.dx;
    s.y += s.dy;
    s.life--;
    s.angle += s.angleSpeed;

    if (s.life > 100) {
      s.size *= 1.03;
    } else {
      s.size *= 0.98;
    }

    let alpha = map(s.life, 0, 120, 0, 255);
    tint(255, alpha);

    push();
    translate(s.x, s.y);
    rotate(s.angle);
    image(smilyImg, 0, 0, s.size, s.size);
    pop();
    noTint();

    if (s.life <= 0 || s.size < 1) {
      miniSmilies.splice(i, 1);
    }
  }

  // Smilies
  for (let smily of smilies) {
    if (!smily.dragging) {
      smily.x += smily.dx;
      smily.y += smily.dy;

      let hitWall = false;
      if (smily.x < smily.size / 2 || smily.x > width - smily.size / 2) {
        smily.dx *= -1;
        hitWall = true;
      }
      if (smily.y < smily.size / 2 || smily.y > height - smily.size / 2) {
        smily.dy *= -1;
        hitWall = true;
      }

      if (hitWall) {
        bgColor = color(random(bgColors));

        // Only duplicate once
        if (!smily.hasDuplicated) {
          duplicateSmiley(smily);
          smily.hasDuplicated = true;
        }
      }
    }

    smily.angle += smily.angleSpeed;

    if (
      !smily.dragging &&
      dist(mouseX, mouseY, smily.x, smily.y) < smily.size * 0.7
    ) {
      if (frameCount - smily.lastPopFrame > 4) {
        spawnMiniSmilies(smily.x, smily.y);
        smily.lastPopFrame = frameCount;
      }
    }

    push();
    translate(smily.x, smily.y);
    rotate(smily.angle);
    image(smilyImg, 0, 0, smily.size, smily.size);
    pop();
  }

  // Texts
  textFont("Helvetica");
  textSize(80);
  fill(255);
  noStroke();
  textStyle(ITALIC);
  text("BE PREPARED", width / 2, height / 3 - 10);

  // "TO SMILE" Text
  textStyle(BOLD);
  textSize(80);
  let toSmileText = "TO SMILE";
  text(toSmileText, width / 2, height / 3 + 80);

  // Measure text to find "T" position
  let toSmileTotalWidth = textWidth(toSmileText);
  let tWidth = textWidth("T");
  let tX = width / 2 - toSmileTotalWidth / 2;

  // Draw the star just left and slightly lower than the "T"
  image(starImg, tX - 25, height / 3 + 55, 25, 25);

  let dots = int((frameCount / 30) % 4);
  let loadingText = "loading" + ".".repeat(dots);
  textFont(grottaFont);
  textSize(32);
  noStroke();
  fill(255); // Now white
  text(loadingText, width / 2, height / 2 + 180);
  image(customCursor, mouseX - 60, mouseY - 20, 100, 100);
}

function spawnMiniSmilies(x, y) {
  let num = int(random(3, 6));
  for (let i = 0; i < num; i++) {
    miniSmilies.push({
      x: x,
      y: y,
      dx: random(-4, 4),
      dy: random(-4, 4),
      size: random(20, 40),
      life: 120,
      angle: random(TWO_PI),
      angleSpeed: random(-0.1, 0.1),
    });
  }
}

function duplicateSmiley(original) {
  let speed = 3;
  let angle = random(TWO_PI);
  smilies.push({
    x: constrain(original.x + random(-20, 20), smilySize, width - smilySize),
    y: constrain(original.y + random(-20, 20), smilySize, height - smilySize),
    dx: speed * cos(angle),
    dy: speed * sin(angle),
    size: smilySize,
    angle: random(TWO_PI),
    angleSpeed: random(0.01, 0.03),
    lastPopFrame: 0,
    dragging: false,
    hasDuplicated: true, // new smiley won't duplicate again
  });
}

export function mousePressedSmileLoaderScene() {
  for (let smily of smilies) {
    if (dist(mouseX, mouseY, smily.x, smily.y) < smily.size * 0.7) {
      smily.dragging = true;
      draggingSmiley = smily;
      dragOffsetX = mouseX - smily.x;
      dragOffsetY = mouseY - smily.y;
      break;
    }
  }
}

export function mouseDraggedSmileLoaderScene() {
  if (draggingSmiley) {
    draggingSmiley.x = mouseX - dragOffsetX;
    draggingSmiley.y = mouseY - dragOffsetY;
  }
}

export function mouseReleasedSmileLoaderScene() {
  if (draggingSmiley) {
    draggingSmiley.dragging = false;
    draggingSmiley = null;
  }
}

export function windowResizedSmileLoaderScene() {
  resizeCanvas(windowWidth, windowHeight);
}
