let brownPart, whitePart, meltImage;

let compositionScale = 0.8;

let ellipseGrow = 0;
let brownEllipseGrow = 0;
let whiteImageOffsetX = 67;
let whiteImageOffsetY = 69;
let brownImageOffsetX = -1.5;
let brownImageOffsetY = 18.59;

let whiteFillWidth = 230;
let brownFillWidth = 230;
let targetWhiteWidth = 265.5;
let targetBrownWidth = 265.5;

let whiteWindowWidth = 380;
let brownWindowWidth = 380;

let whiteFillingHeightRatio = 0.55;
let whiteFillingYOffsetRatio = 0.346;
let whiteFillingXOffset = 75;

let brownFillingHeightRatio = 0.55;
let brownFillingYOffsetRatio = 0.346;
let brownFillingXOffset = 266;

const whiteX = 250, whiteY = 160;
const brownX = 630, brownY = 210;
const windowX = 60, windowY = 60;

const whiteW = 500 / 1.6, whiteH = 350 / 1.6;
const brownW = 500 / 1.6, brownH = 350 / 1.6;

const windowBodyWidth = 380;
const windowBodyHeight = 300;
const titleBarHeight = 50;

const purpleWindowExtraWidth = 90;
const blackWindowExtraWidth = 90;
const whiteWindowExtraBottom = 20;
const brownWindowExtraTop = 20;

const brownWindowTrimLeft = 20;

let easing = 0.1;
let minVisualWidth = 10;
let scaleFactor, offsetX, offsetY;

let purpleDrag = { x: 0, y: 0 };
let blackDrag = { x: 0, y: 0 };
let whiteDrag = { x: 0, y: 0, targetX: 0, targetY: 0 };
let brownDrag = { x: 0, y: 0, targetX: 0, targetY: 0 };
let zigzagDrag = { x: 0, y: 0 };
let zigzagPrice = 99;

const zigzagX = 200, zigzagY = 500;
const zigzagWindowWidth = 300;
const zigzagWindowHeight = 200;

let activeDrag = null;
let didDrag = false;

let whiteVisible = true;
let whiteScale = 1;
let whiteTargetScale = 1;
let brownVisible = true;
let brownScale = 1;
let brownTargetScale = 1;

let brownFillingClicked = false;
let whiteFillingClicked = false;

let zigzagPieces = []; // NEW

function preload() {
  whitePart = loadImage('White2.png');
  brownPart = loadImage('Brown2.png');
  meltImage = loadImage('melt3.png');
  mouthGif = loadImage('mouth-2.gif');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#EEEEEE');

  // === Update and draw flying zigzags ===
  for (let piece of zigzagPieces) {
    piece.update();
    piece.display();
  }

  const minX = windowX;
  const maxX = brownX + windowBodyWidth;
  const minY = Math.min(windowY, whiteY, brownY - brownWindowExtraTop);
  const maxY = Math.max(
    windowY + titleBarHeight + windowBodyHeight,
    whiteY + titleBarHeight + windowBodyHeight + whiteWindowExtraBottom,
    brownY + titleBarHeight + windowBodyHeight
  );

  const compWidth = maxX - minX;
  const compHeight = maxY - minY;

  const marginX = width * 0.05;
  const marginY = height * 0.05;
  const availableWidth = width - marginX * 2;
  const availableHeight = height - marginY * 2;

  const fitScale = Math.min(availableWidth / compWidth, availableHeight / compHeight);
  scaleFactor = fitScale * compositionScale;

  offsetX = (width - compWidth * scaleFactor) / 2 - minX * scaleFactor;
  offsetY = (height - compHeight * scaleFactor) / 2 - minY * scaleFactor;

  whiteFillWidth = lerp(whiteFillWidth, targetWhiteWidth, easing);
  brownFillWidth = lerp(brownFillWidth, targetBrownWidth, easing);

  whiteWindowWidth = lerp(
    whiteWindowWidth,
    targetWhiteWidth > 265.5 ? windowBodyWidth + (targetWhiteWidth - 265.5) : windowBodyWidth,
    easing
  );
  brownWindowWidth = lerp(
    brownWindowWidth,
    targetBrownWidth > 245
      ? windowBodyWidth + (targetBrownWidth - 245) - brownWindowTrimLeft
      : windowBodyWidth - brownWindowTrimLeft,
    easing
  );

  whiteDrag.x = lerp(whiteDrag.x, whiteDrag.targetX, 0.2);
  whiteDrag.y = lerp(whiteDrag.y, whiteDrag.targetY, 0.2);
  brownDrag.x = lerp(brownDrag.x, brownDrag.targetX, 0.2);
  brownDrag.y = lerp(brownDrag.y, brownDrag.targetY, 0.2);

  whiteScale = lerp(whiteScale, whiteTargetScale, 0.2);
  brownScale = lerp(brownScale, brownTargetScale, 0.2);

  const brownRightEdge = brownX + windowBodyWidth;
  const dynamicBrownX = brownRightEdge - brownWindowWidth;

  push();
  scale(scaleFactor);
  translate(offsetX / scaleFactor, offsetY / scaleFactor);

  // === ZIGZAG WINDOW ===
  push();
translate(zigzagX + zigzagDrag.x + zigzagWindowWidth / 2, zigzagY + zigzagDrag.y + zigzagWindowHeight / 2);
scale(0.8);
translate(-(zigzagX + zigzagDrag.x + zigzagWindowWidth / 2), -(zigzagY + zigzagDrag.y + zigzagWindowHeight / 2));

drawWindow(zigzagX + zigzagDrag.x, zigzagY + zigzagDrag.y, color(240, 78, 35), zigzagWindowWidth, zigzagWindowHeight);
drawTrafficLights(zigzagX + zigzagDrag.x, zigzagY + zigzagDrag.y, false);

push();
translate(zigzagX + zigzagDrag.x + zigzagWindowWidth / 2, zigzagY + zigzagDrag.y + titleBarHeight + (zigzagWindowHeight / 2));
scale(0.4);
rotate(-3);

let shapeWidth = 300;
let shapeHeight = 100;
let zigZagStep = 10;

fill('#F04E23');
stroke(0);
strokeWeight(2);
beginShape();
vertex(-shapeWidth / 2, -shapeHeight / 2);
vertex(shapeWidth / 2, -shapeHeight / 2);
for (let y = -shapeHeight / 2; y + zigZagStep * 2 <= shapeHeight / 2; y += zigZagStep * 2) {
  vertex(shapeWidth / 2 + zigZagStep, y + zigZagStep);
  vertex(shapeWidth / 2, y + zigZagStep * 2);
}
vertex(shapeWidth / 2, shapeHeight / 2);
vertex(-shapeWidth / 2, shapeHeight / 2);
for (let y = shapeHeight / 2; y - zigZagStep * 2 >= -shapeHeight / 2; y -= zigZagStep * 2) {
  vertex(-shapeWidth / 2 - zigZagStep, y - zigZagStep);
  vertex(-shapeWidth / 2, y - zigZagStep * 2);
}
endShape(CLOSE);

fill(255);
noStroke();
textAlign(CENTER, CENTER);
textSize(48);
text("99$", 0, 0);
pop();
pop();
  
  // === YELLOW WINDOWS FIRST ===
  if (targetBrownWidth > targetWhiteWidth) {
    if (whiteVisible) {
      push();
      translate(whiteX + whiteDrag.x + whiteWindowWidth / 2, whiteY + whiteDrag.y + (windowBodyHeight + whiteWindowExtraBottom) / 2);
      scale(whiteScale);
      translate(-(whiteX + whiteDrag.x + whiteWindowWidth / 2), -(whiteY + whiteDrag.y + (windowBodyHeight + whiteWindowExtraBottom) / 2));
      drawWindow(whiteX + whiteDrag.x, whiteY + whiteDrag.y, color(255, 193, 7), whiteWindowWidth, windowBodyHeight + whiteWindowExtraBottom);
      drawTrafficLights(whiteX + whiteDrag.x, whiteY + whiteDrag.y, true);
      pop();
    }

    if (brownVisible) {
      push();
      translate(dynamicBrownX + brownDrag.x + brownWindowWidth / 2, brownY - brownWindowExtraTop + brownDrag.y + (windowBodyHeight + brownWindowExtraTop) / 2);
      scale(brownScale);
      translate(-(dynamicBrownX + brownDrag.x + brownWindowWidth / 2), -(brownY - brownWindowExtraTop + brownDrag.y + (windowBodyHeight + brownWindowExtraTop) / 2));
      drawWindow(dynamicBrownX + brownDrag.x, brownY - brownWindowExtraTop + brownDrag.y, color(255, 193, 7), brownWindowWidth, windowBodyHeight + brownWindowExtraTop);
      drawTrafficLights(dynamicBrownX + brownDrag.x, brownY - brownWindowExtraTop + brownDrag.y, false);
      pop();
    }
  } else {
    if (brownVisible) {
      push();
      translate(dynamicBrownX + brownDrag.x + brownWindowWidth / 2, brownY - brownWindowExtraTop + brownDrag.y + (windowBodyHeight + brownWindowExtraTop) / 2);
      scale(brownScale);
      translate(-(dynamicBrownX + brownDrag.x + brownWindowWidth / 2), -(brownY - brownWindowExtraTop + brownDrag.y + (windowBodyHeight + brownWindowExtraTop) / 2));
      drawWindow(dynamicBrownX + brownDrag.x, brownY - brownWindowExtraTop + brownDrag.y, color(255, 193, 7), brownWindowWidth, windowBodyHeight + brownWindowExtraTop);
      drawTrafficLights(dynamicBrownX + brownDrag.x, brownY - brownWindowExtraTop + brownDrag.y, false);
      pop();
    }

    if (whiteVisible) {
      push();
      translate(whiteX + whiteDrag.x + whiteWindowWidth / 2, whiteY + whiteDrag.y + (windowBodyHeight + whiteWindowExtraBottom) / 2);
      scale(whiteScale);
      translate(-(whiteX + whiteDrag.x + whiteWindowWidth / 2), -(whiteY + whiteDrag.y + (windowBodyHeight + whiteWindowExtraBottom) / 2));
      drawWindow(whiteX + whiteDrag.x, whiteY + whiteDrag.y, color(255, 193, 7), whiteWindowWidth, windowBodyHeight + whiteWindowExtraBottom);
      drawTrafficLights(whiteX + whiteDrag.x, whiteY + whiteDrag.y, true);
      pop();
    }
  }
  
  // === Fills and images ===
  const whiteFillingHeight = whiteH * whiteFillingHeightRatio;
  const whiteFillingYOffset = whiteH * whiteFillingYOffsetRatio;
  const whiteFillingX = whiteX + whiteImageOffsetX + whiteFillingXOffset + whiteDrag.x;
  const whiteFillingY = whiteY + titleBarHeight + whiteImageOffsetY + whiteFillingYOffset + whiteDrag.y;

  if (whiteVisible) {
    fill('#f3e9d9');
    noStroke();
    rect(whiteFillingX, whiteFillingY, whiteFillWidth - 26.5, whiteFillingHeight);
    image(whitePart, whiteX + whiteImageOffsetX + whiteDrag.x, whiteY + titleBarHeight + whiteImageOffsetY + whiteDrag.y, whiteW, whiteH);
  }

  const brownFillingHeight = brownH * brownFillingHeightRatio;
  const brownFillingYOffset = brownH * brownFillingYOffsetRatio;
  const brownFillingRight = brownX + brownImageOffsetX + brownFillingXOffset + brownDrag.x;
  const brownFillingY = brownY + titleBarHeight + brownImageOffsetY + brownFillingYOffset + brownDrag.y;
  const brownFillingX = brownFillingRight - brownFillWidth;

  if (brownVisible) {
    fill('#bc7567');
    rect(brownFillingX, brownFillingY, brownFillWidth + 27.5, brownFillingHeight);
    image(brownPart, brownX + brownImageOffsetX + brownDrag.x, brownY + titleBarHeight + brownImageOffsetY + brownDrag.y, brownW, brownH);
  }

  // === Arcs (ellipses) ===
  const mx = (mouseX - offsetX) / scaleFactor;
  const my = (mouseY - offsetY) / scaleFactor;

  const hoveringOverBrownWindow = mx >= brownX + brownDrag.x && mx <= brownX + brownDrag.x + brownWindowWidth &&
    my >= brownY - brownWindowExtraTop + brownDrag.y && my <= brownY - brownWindowExtraTop + brownDrag.y + windowBodyHeight + titleBarHeight;

  const hoveringOverWhiteWindow = mx >= whiteX + whiteDrag.x && mx <= whiteX + whiteDrag.x + whiteWindowWidth &&
    my >= whiteY + whiteDrag.y && my <= whiteY + whiteDrag.y + windowBodyHeight + titleBarHeight;

  const hoveringOverBrownFilling = mx > brownFillingX && mx < brownFillingRight &&
    my > brownFillingY && my < brownFillingY + brownFillingHeight;

  const hoveringOverWhiteFilling = mx > whiteFillingX && mx < whiteFillingX + whiteFillWidth &&
    my > whiteFillingY && my < whiteFillingY + whiteFillingHeight;

  if ((hoveringOverBrownWindow && !brownFillingClicked && !whiteFillingClicked) || (hoveringOverBrownFilling && !brownFillingClicked && !whiteFillingClicked)) {
    brownEllipseGrow = lerp(brownEllipseGrow, 1, 0.1);
  } else {
    brownEllipseGrow = lerp(brownEllipseGrow, 0, 0.5);
  }

  if (brownEllipseGrow > 0.01) {
    let ellipseX = brownX + brownImageOffsetX + brownDrag.x + brownW / 2 - 40;
    let ellipseY = brownY + titleBarHeight + brownImageOffsetY + brownDrag.y + brownH;
    let maxWidth = (brownW * 0.4) + 110;
    let maxHeight = (brownH * 0.1) + 40;
    fill('#BC7567');
    noStroke();
    arc(ellipseX, ellipseY, maxWidth * brownEllipseGrow, maxHeight * brownEllipseGrow, 0, PI, CHORD);
  }

  if ((hoveringOverWhiteWindow && !whiteFillingClicked && !brownFillingClicked) || (hoveringOverWhiteFilling && !whiteFillingClicked && !brownFillingClicked)) {
    ellipseGrow = lerp(ellipseGrow, 1, 0.1);
  } else {
    ellipseGrow = lerp(ellipseGrow, 0, 0.5);
  }

  if (ellipseGrow > 0.01) {
    let ellipseX = whiteX + whiteImageOffsetX + whiteDrag.x + whiteW / 2 + 31;
    let ellipseY = whiteY + titleBarHeight + whiteImageOffsetY + whiteDrag.y + whiteH;
    let maxWidth = (whiteW * 0.4) + 110;
    let maxHeight = (whiteH * 0.1) + 40;
    fill('#F3E9D9');
    noStroke();
    arc(ellipseX, ellipseY, maxWidth * ellipseGrow, maxHeight * ellipseGrow, 0, PI, CHORD);
  }


  // === BLACK WINDOW (transparent) ===
push();
translate(windowX + blackDrag.x + (windowBodyWidth + blackWindowExtraWidth) / 2, windowY + blackDrag.y + 12 + (windowBodyHeight + titleBarHeight) / 2);
scale(0.8);
translate(-(windowX + blackDrag.x + (windowBodyWidth + blackWindowExtraWidth) / 2), -(windowY + blackDrag.y + 12 + (windowBodyHeight + titleBarHeight) / 2));

stroke(0);
fill(255);
rect(windowX + blackDrag.x - 12, windowY + blackDrag.y + 12, windowBodyWidth + blackWindowExtraWidth, titleBarHeight);
noFill();
stroke(0);
rect(windowX + blackDrag.x - 12, windowY + blackDrag.y + 12, windowBodyWidth + blackWindowExtraWidth, windowBodyHeight + titleBarHeight);
drawTrafficLights(windowX + blackDrag.x - 12, windowY + blackDrag.y + 12, false);

let blackWindowWidth = windowBodyWidth + blackWindowExtraWidth;
let blackWindowHeight = windowBodyHeight;
let gifWidth = 300 * 2;
let gifHeight = 150 * 2;
let gifX = windowX + blackDrag.x - 12 + (blackWindowWidth - gifWidth) / 2;
let gifY = windowY + blackDrag.y + 12 + titleBarHeight + (blackWindowHeight - gifHeight) / 2;
image(mouthGif, gifX, gifY, gifWidth, gifHeight);
pop();

  // === PURPLE WINDOW ===
push();
translate(windowX + purpleDrag.x + (windowBodyWidth + purpleWindowExtraWidth) / 2, windowY + purpleDrag.y + (windowBodyHeight + titleBarHeight) / 2);
scale(0.8);
translate(-(windowX + purpleDrag.x + (windowBodyWidth + purpleWindowExtraWidth) / 2), -(windowY + purpleDrag.y + (windowBodyHeight + titleBarHeight) / 2));

drawWindow(windowX + purpleDrag.x, windowY + purpleDrag.y, color(195, 171, 249), windowBodyWidth + purpleWindowExtraWidth, windowBodyHeight);
drawTrafficLights(windowX + purpleDrag.x, windowY + purpleDrag.y, false);

fill(0);
noStroke();
textAlign(CENTER, CENTER);
textSize(24);
text("which side first?", windowX + purpleDrag.x + (windowBodyWidth + purpleWindowExtraWidth) / 2, windowY + purpleDrag.y + titleBarHeight + (windowBodyHeight / 2));
pop();
}

class ZigZagPiece {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-5, 5);
    this.vy = random(-5, 5);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.angle += this.rotationSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    scale(0.2);

    let shapeWidth = 300;
    let shapeHeight = 100;
    let zigZagStep = 10;

    fill('#F04E23');
    stroke(0);
    strokeWeight(2);
    beginShape();
    vertex(-shapeWidth / 2, -shapeHeight / 2);
    vertex(shapeWidth / 2, -shapeHeight / 2);
    for (let y = -shapeHeight / 2; y + zigZagStep * 2 <= shapeHeight / 2; y += zigZagStep * 2) {
      vertex(shapeWidth / 2 + zigZagStep, y + zigZagStep);
      vertex(shapeWidth / 2, y + zigZagStep * 2);
    }
    vertex(shapeWidth / 2, shapeHeight / 2);
    vertex(-shapeWidth / 2, shapeHeight / 2);
    for (let y = shapeHeight / 2; y - zigZagStep * 2 >= -shapeHeight / 2; y -= zigZagStep * 2) {
      vertex(-shapeWidth / 2 - zigZagStep, y - zigZagStep);
      vertex(-shapeWidth / 2, y - zigZagStep * 2);
    }
    endShape(CLOSE);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(48);
    text("99$", 0, 0);
    pop();
  }
}

// Helper functions (unchanged)
function drawWindow(x, y, bgColor, w, h) {
  stroke(0);
  fill(255);
  rect(x, y, w, titleBarHeight);
  stroke(0);
  fill(bgColor);
  rect(x, y + titleBarHeight, w, h);
}

function drawTrafficLights(x, y, isWhite) {
  noStroke();
  fill(255, 60, 60); circle(x + 20, y + 25, 12);
  fill(255, 180, 0); circle(x + 45, y + 25, 12);
  fill(0, 200, 0);   circle(x + 70, y + 25, 12);

  const mx = (mouseX - offsetX) / scaleFactor;
  const my = (mouseY - offsetY) / scaleFactor;

  if (mouseIsPressed) {
    const hitRadius = 20;
    if (isWhite && whiteVisible && dist(mx, my, whiteX + whiteDrag.x + 20, whiteY + whiteDrag.y + 25) < hitRadius) {
      whiteTargetScale = 0;
      const step = 10;
      const maxWidth = 450;
      for (let i = 0; i < 10; i++) {
        if (targetBrownWidth - step >= minVisualWidth && targetWhiteWidth + step <= maxWidth) {
          targetWhiteWidth += step;
          targetBrownWidth -= step;
        }
      }
      whiteFillingClicked = true;
      setTimeout(() => {
        whiteTargetScale = 1;
      }, 200);
    }
    if (!isWhite && brownVisible && dist(mx, my, brownX + brownDrag.x + 20, brownY + brownDrag.y + 25) < hitRadius) {
      brownTargetScale = 0;
      const step = 10;
      const maxWidth = 450;
      for (let i = 0; i < 10; i++) {
        if (targetWhiteWidth - step >= minVisualWidth && targetBrownWidth + step <= maxWidth) {
          targetBrownWidth += step;
          targetWhiteWidth -= step;
        }
      }
      brownFillingClicked = true;
      setTimeout(() => {
        brownTargetScale = 1;
      }, 200);
    }
  }
}

function insideWindow(mx, my, x, y, w) {
  return mx >= x && mx <= x + w && my >= y && my <= y + windowBodyHeight + titleBarHeight;
}

function mousePressed() {
  didDrag = false;
  const mx = (mouseX - offsetX) / scaleFactor;
  const my = (mouseY - offsetY) / scaleFactor;

  // Check black window first
  if (insideWindow(mx, my, windowX + blackDrag.x - 4, windowY + blackDrag.y + 4, windowBodyWidth + blackWindowExtraWidth)) {
    activeDrag = blackDrag;
  }
  // Then purple window
  else if (insideWindow(mx, my, windowX + purpleDrag.x, windowY + purpleDrag.y, windowBodyWidth + purpleWindowExtraWidth)) {
    activeDrag = purpleDrag;
  }
 // Check zigzag window
  if (insideWindow(mx, my, zigzagX + zigzagDrag.x, zigzagY + zigzagDrag.y, zigzagWindowWidth)) {
    activeDrag = zigzagDrag;

    // Add new flying zigzag piece
    zigzagPieces.push(new ZigZagPiece(
      zigzagX + zigzagDrag.x + zigzagWindowWidth / 2,
      zigzagY + zigzagDrag.y + zigzagWindowHeight / 2
    ));
  }
  // Then yellow windows (both move together)
  else if (
    insideWindow(mx, my, whiteX + whiteDrag.x, whiteY + whiteDrag.y, whiteWindowWidth) ||
    insideWindow(mx, my, brownX + brownDrag.x, brownY - brownWindowExtraTop + brownDrag.y, brownWindowWidth)
  ) {
    activeDrag = whiteDrag;
  }
}

function mouseDragged() {
  if (activeDrag) {
    if (activeDrag === purpleDrag || activeDrag === blackDrag || activeDrag === zigzagDrag) {
      activeDrag.x += movedX / scaleFactor;
      activeDrag.y += movedY / scaleFactor;
    } else if (activeDrag === whiteDrag) {
      let proposedX = whiteDrag.targetX + movedX / scaleFactor;
      let proposedY = whiteDrag.targetY + movedY / scaleFactor;

      whiteDrag.targetX = proposedX;
      whiteDrag.targetY = proposedY;
      brownDrag.targetX = proposedX;
      brownDrag.targetY = proposedY;

      didDrag = true;
    }
  }
}

function mouseReleased() {
  const mx = (mouseX - offsetX) / scaleFactor;
  const my = (mouseY - offsetY) / scaleFactor;
  const step = 10;

  const whiteFillingYOffset = whiteH * whiteFillingYOffsetRatio;
  const whiteFillingX = whiteX + whiteImageOffsetX + whiteFillingXOffset + whiteDrag.x;
  const whiteFillingY = whiteY + titleBarHeight + whiteImageOffsetY + whiteDrag.y;
  const whiteFillingH = whiteH * whiteFillingHeightRatio;

  const brownFillingRight = brownX + brownImageOffsetX + brownFillingXOffset + brownDrag.x;
  const brownFillingYOffset = brownH * brownFillingYOffsetRatio;
  const brownFillingY = brownY + titleBarHeight + brownImageOffsetY + brownFillingYOffset + brownDrag.y;
  const brownFillingH = brownH * brownFillingHeightRatio;
  const brownFillingX = brownFillingRight - brownFillWidth;

if (!didDrag) {
  if (
    mx > brownFillingX &&
    mx < brownFillingRight &&
    my > brownFillingY &&
    my < brownFillingY + brownFillingH
  ) {
    if (targetWhiteWidth - step >= minVisualWidth && targetBrownWidth + step <= 450) {
      targetBrownWidth += step;
      targetWhiteWidth -= step;
      brownFillingClicked = true;

      setTimeout(() => {
        brownFillingClicked = false;
      }, 200);
    }
  } else if (
    mx > whiteFillingX &&
    mx < whiteFillingX + whiteFillWidth &&
    my > whiteFillingY &&
    my < whiteFillingY + whiteFillingH
  ) {
    if (targetBrownWidth - step >= minVisualWidth && targetWhiteWidth + step <= 450) {
      targetWhiteWidth += step;
      targetBrownWidth -= step;
      whiteFillingClicked = true;

      setTimeout(() => {
        whiteFillingClicked = false;
      }, 200);
    }
  }
}

  // Snap back both yellow windows when released
  if (activeDrag === whiteDrag) {
    whiteDrag.targetX = 0;
    whiteDrag.targetY = 0;
    brownDrag.targetX = 0;
    brownDrag.targetY = 0;
  } else if (activeDrag && activeDrag !== purpleDrag) {
    activeDrag.targetX = 0;
    activeDrag.targetY = 0;
  }
  activeDrag = null;
}