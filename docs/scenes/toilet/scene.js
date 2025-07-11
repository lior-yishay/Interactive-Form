// --- Responsive p5.js sketch: "Change the toilet paper" poster ---
// 1. Draw artwork at native size (1456×768).
// 2. Scale and center it responsively onto the window.

// Native design dimensions
const baseW = 1456;
const baseH = 768;

// Color palette and constants
const green = "#05a045";
const tileClr = "#008230";
const panelW = 360;

let fontSemiBold;
let fontRegular;
let toiletImage;
let emptyRollImage;
let underImage;
let overImage;

// Simple drag variables
let isDragging = false;
let draggedImage = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let rollReplaced = false;
let replacedWithImage = null;
let starRotation = 0;
let emptyRollY = 0;
let emptyRollRotation = 0;
let emptyRollFalling = false;
let emptyRollVelocityY = 0;
let emptyRollRotationSpeed = 0.15;
let whiteRectHeight = 0;
let animatingWhiteRect = false;

export function preloadToiletScene() {
  fontSemiBold = loadFont("./assets/Grotta-Trial-Semibold.otf");
  fontRegular = loadFont("./assets/Grotta-Trial-Regular.otf");

  toiletImage = loadImage("./assets/Toilet.png");
  emptyRollImage = loadImage("./assets/emptyroll.png");
  underImage = loadImage("./assets/under.png");
  overImage = loadImage("./assets/over.png");
}

export function setupToiletScene() {
  createCanvas(windowWidth, windowHeight);
}

export function drawToiletScene() {
  background(green);

  const sf = min(width / baseW, height / baseH);
  push();
  translate((width - baseW * sf) / 2, (height - baseH * sf) / 2);
  scale(sf);

  // Update star rotation
  starRotation += 0.01;

  // Update white rectangle animation
  if (animatingWhiteRect && whiteRectHeight < 60) {
    whiteRectHeight += 4; // Fast animation, grow to 60 pixels
  }

  // Update falling empty roll
  if (emptyRollFalling) {
    // Add gravity
    emptyRollVelocityY += 0.5; // Gravity acceleration
    emptyRollY += emptyRollVelocityY;
    emptyRollRotation += emptyRollRotationSpeed;

    // Check if hit the ground
    if (emptyRollY >= 420) {
      // Even higher ground level - from 440 to 420
      emptyRollY = 420;

      // Bounce effect
      if (emptyRollVelocityY > 0) {
        emptyRollVelocityY *= -0.4; // Bounce with energy loss

        // Stop bouncing if velocity is too small
        if (Math.abs(emptyRollVelocityY) < 2) {
          emptyRollVelocityY = 0;
        }
      }

      // Reduce rotation speed due to friction
      emptyRollRotationSpeed *= 0.95;

      // Stop rotation when it's very slow
      if (Math.abs(emptyRollRotationSpeed) < 0.01) {
        emptyRollRotationSpeed = 0;
      }
    }
  }

  renderPoster();
  pop();

  // Draw dragged image on top
  if (isDragging && draggedImage) {
    push();
    translate(mouseX - dragOffsetX, mouseY - dragOffsetY);
    imageMode(CENTER);
    // Keep exact same size as in the star
    const sf = min(width / baseW, height / baseH);
    let imgW = draggedImage.width;
    let imgH = draggedImage.height;
    let maxSize = 150 * sf; // Apply the same scaling factor
    let scaleVal = min(maxSize / imgW, maxSize / imgH);
    image(draggedImage, 0, 0, imgW * scaleVal, imgH * scaleVal);
    pop();
  }
}

export function windowResizedToiletScene() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function renderPoster() {
  drawTileGrid();
  drawInstructionPanel();
  drawToilet();
  drawBin();
  drawHolderAndEmptyRoll();
}

function drawTileGrid() {
  stroke(tileClr);
  strokeWeight(2);
  const tile = 96;
  let gridTop = baseH - 480;

  for (let x = 0; x <= baseW; x += tile) {
    line(x, gridTop, x, baseH);
  }
  line(baseW, gridTop, baseW, baseH);

  for (let y = gridTop; y <= baseH; y += tile) {
    line(0, y, baseW, y);
  }
}

function drawToilet() {
  let nativeW = toiletImage.width;
  let nativeH = toiletImage.height;
  let scaleFactor = baseH / nativeH;
  let newW = nativeW * scaleFactor;
  let newH = baseH;
  let xOffset = -newW / 2;

  image(toiletImage, xOffset, 0, newW, newH);
}

function drawBin() {
  push();
  translate(580, 650);
  fill(240);
  stroke(100);
  strokeWeight(2);

  const topW = 200,
    h = 250,
    bottomW = 180;

  beginShape();
  vertex(-bottomW / 2, -h / 2);
  vertex(-bottomW / 2, h / 2);
  vertex(bottomW / 2, h / 2);
  vertex(bottomW / 2, -h / 2);
  endShape(CLOSE);

  fill(220);
  ellipse(0, h / 2, bottomW, 30);

  // Top ellipse drawn last so it's on top
  fill(240);
  ellipse(0, -h / 2, bottomW, 34);
  pop();
}

function drawHolderAndEmptyRoll() {
  const cx = 520,
    cy = 350;

  // Dashed rectangle outline
  stroke(255);
  strokeWeight(3);
  drawingContext.setLineDash([12, 12]);
  noFill();
  rectMode(CENTER);
  rect(cx, cy, 200, 140);
  drawingContext.setLineDash([]);

  // Draw the black hollow part first (underneath everything) - only if not replaced
  if (!rollReplaced) {
    fill(0);
    noStroke();
    ellipse(cx + 40, cy + 15, 20, 50);
  }

  // Toilet paper holder - gray fill with thin black stroke - moved up 25 pixels
  fill("#C8C8C8");
  stroke(0);
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx - 14, cy + 5, 200, 20, 10);

  if (rollReplaced && replacedWithImage) {
    // Draw the replaced toilet paper roll - moved up 2 pixels
    imageMode(CENTER);
    let imgW = replacedWithImage.width;
    let imgH = replacedWithImage.height;
    let maxSize = 150;
    let scaleVal = min(maxSize / imgW, maxSize / imgH);
    image(replacedWithImage, cx, cy + 13, imgW * scaleVal, imgH * scaleVal);

    // Add white rectangle on top of the toilet paper image (at the bottom part)
    fill(255);
    noStroke();
    rectMode(CENTER);

    // Position rectangle differently based on which image it is
    let rectX = cx;
    let rectWidth = 81.2; // Default width (reduced by 0.2 pixels total - 0.1 from each side)
    if (replacedWithImage === overImage) {
      rectX = cx + 34.5; // Move half pixel right (from 34 to 34.5)
      rectWidth = 77.4; // Make it 2.4 pixels wider (from 76 to 77.4)
    } else {
      // For under image, shift left by 0.2 to reduce more from right side
      rectX = cx - 0.2;
      rectWidth = 80.4; // Reduce width by 0.1 from both sides (total reduction now 0.8)
    }
    rect(
      rectX,
      cy + 13 + (imgH * scaleVal) / 2 - 10 + whiteRectHeight / 2,
      rectWidth,
      whiteRectHeight,
      2
    ); // Growing downward

    // Add number text near the bottom of the rectangle
    if (whiteRectHeight > 20) {
      // Only show text when rectangle is big enough
      fill(0); // Black text
      textAlign(CENTER, CENTER);
      textSize(24); // Increased from 14 to 24
      textFont(fontSemiBold); // Use Grotta-Trial-Semibold

      // Determine which number to show based on the image
      let numberText = "1";
      if (replacedWithImage === overImage) {
        numberText = "2";
      }

      // Position text near bottom of rectangle
      let textY = cy + 13 + (imgH * scaleVal) / 2 - 10 + whiteRectHeight - 15;
      text(numberText, rectX, textY);
    }

    // Add stroke lines on left, right, and bottom (but not top)
    stroke(0);
    strokeWeight(1);
    noFill();

    // Calculate rectangle bounds for growing downward animation
    let rectLeft = rectX - rectWidth / 2;
    let rectRight = rectX + rectWidth / 2;
    let rectTop = cy + 13 + (imgH * scaleVal) / 2 - 10; // Fixed top position
    let rectBottom = cy + 13 + (imgH * scaleVal) / 2 - 10 + whiteRectHeight; // Growing bottom

    // Only draw lines if rectangle has some height
    if (whiteRectHeight > 0) {
      // Draw left, right, and bottom lines
      line(rectLeft, rectTop + 2, rectLeft, rectBottom - 2); // Left line
      line(rectRight, rectTop + 2, rectRight, rectBottom - 2); // Right line
      line(rectLeft + 2, rectBottom, rectRight - 2, rectBottom); // Bottom line
    }

    // Draw small top handle with stroke only on top and bottom
    fill("#C8C8C8");
    noStroke();
    rectMode(CENTER);
    rect(cx - 55, cy + 5, 50, 20, 5);

    // Add stroke lines only on top and bottom
    stroke(0);
    strokeWeight(1);
    line(cx - 80, cy - 5, cx - 30, cy - 5); // Top line
    line(cx - 80, cy + 15, cx - 30, cy + 15); // Bottom line
  } else {
    // Draw the empty roll - all moved up 25 pixels
    // Empty roll rectangle - changed color to #A9A77E
    fill("#A9A77E");
    stroke(0);
    strokeWeight(1);
    rectMode(CENTER);
    rect(cx - 20, cy + 15, 120, 50);

    // Left side - add ellipse on top (tall ellipse) - changed color to #A9A77E
    fill("#A9A77E");
    stroke(0);
    strokeWeight(1);
    ellipse(cx - 80, cy + 15, 35, 50);

    // Cover the inner part of the ellipse outline - changed color to #A9A77E
    fill("#A9A77E");
    noStroke();
    rect(cx - 70, cy + 15, 19, 50);
  }

  // Draw falling empty roll if it's falling
  if (emptyRollFalling) {
    push();
    translate(cx - 20, cy + 5 + emptyRollY); // Moved up 10 pixels (from cy + 15 to cy + 5)
    rotate(emptyRollRotation);

    // Draw the black hollow part
    fill(0);
    noStroke();
    ellipse(60, 0, 20, 50);

    // Empty roll rectangle
    fill("#A9A77E");
    stroke(0);
    strokeWeight(1);
    rectMode(CENTER);
    rect(0, 0, 120, 50);

    // Left side ellipse
    fill("#A9A77E");
    stroke(0);
    strokeWeight(1);
    ellipse(-60, 0, 35, 50);

    // Cover inner part
    fill("#A9A77E");
    noStroke();
    rect(-50, 0, 19, 50);

    pop();
  }
}

function drawInstructionPanel() {
  const x0 = baseW - panelW;

  fill(green);
  rect(x0, 0, panelW, baseH);
  stroke(200);
  strokeWeight(3);
  line(x0, 0, x0, baseH);
  noStroke();

  fill(255);
  textAlign(LEFT, TOP);
  textSize(46);
  textFont(fontSemiBold);
  text("Change the", x0 + 30, 40);

  textFont(fontRegular);
  textSize(40);
  text("toilet paper", x0 + 30, 92);

  drawRollBadge(x0 + panelW / 2, 330, underImage);
  drawRollBadge(x0 + panelW / 2, 540, overImage);
}

function drawRollBadge(cx, cy, rollImage) {
  // Don't draw the star if this image is currently used in the holder
  if (rollReplaced && replacedWithImage === rollImage) {
    return;
  }

  fill("#ffc400");
  noStroke();
  push();
  translate(cx, cy);
  rotate(starRotation); // Add rotation
  star(0, 0, 85, 120, 14);
  pop();

  // Only draw image if not being dragged
  if (!(isDragging && draggedImage === rollImage)) {
    push();
    translate(cx, cy);
    imageMode(CENTER);
    let imgW = rollImage.width;
    let imgH = rollImage.height;
    let maxSize = 150;
    let scaleVal = min(maxSize / imgW, maxSize / imgH);
    image(rollImage, 0, 0, imgW * scaleVal, imgH * scaleVal);
    pop();
  }
}

export function mousePressedToiletScene() {
  const sf = min(width / baseW, height / baseH);
  const offsetX = (width - baseW * sf) / 2;
  const offsetY = (height - baseH * sf) / 2;
  const x0 = baseW - panelW;

  // Check under image
  let underX = (x0 + panelW / 2) * sf + offsetX;
  let underY = 330 * sf + offsetY;
  if (dist(mouseX, mouseY, underX, underY) < 75 * sf) {
    isDragging = true;
    draggedImage = underImage;
    dragOffsetX = mouseX - underX;
    dragOffsetY = mouseY - underY;
    return;
  }

  // Check over image
  let overX = (x0 + panelW / 2) * sf + offsetX;
  let overY = 540 * sf + offsetY;
  if (dist(mouseX, mouseY, overX, overY) < 75 * sf) {
    isDragging = true;
    draggedImage = overImage;
    dragOffsetX = mouseX - overX;
    dragOffsetY = mouseY - overY;
    return;
  }
}

export function mouseReleasedToiletScene() {
  if (isDragging && draggedImage) {
    // Check if dropped in the dashed rectangle area
    const sf = min(width / baseW, height / baseH);
    const offsetX = (width - baseW * sf) / 2;
    const offsetY = (height - baseH * sf) / 2;

    let dropZoneX = 520 * sf + offsetX;
    let dropZoneY = 350 * sf + offsetY;
    let dropZoneW = 200 * sf;
    let dropZoneH = 140 * sf;

    let dropX = mouseX - dragOffsetX;
    let dropY = mouseY - dragOffsetY;

    if (
      dropX > dropZoneX - dropZoneW / 2 &&
      dropX < dropZoneX + dropZoneW / 2 &&
      dropY > dropZoneY - dropZoneH / 2 &&
      dropY < dropZoneY + dropZoneH / 2
    ) {
      // Replace the empty roll with the dragged image
      rollReplaced = true;
      replacedWithImage = draggedImage;

      // Start the falling animation for the empty roll
      emptyRollFalling = true;
      emptyRollY = 0;
      emptyRollRotation = 0;
      emptyRollVelocityY = 0;
      emptyRollRotationSpeed = 0.15;

      // Start white rectangle animation
      animatingWhiteRect = true;
      whiteRectHeight = 0;
    }
  }

  isDragging = false;
  draggedImage = null;
}

function star(x, y, r1, r2, n) {
  const angle = TWO_PI / n;
  const half = angle / 2;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    vertex(x + cos(a) * r2, y + sin(a) * r2);
    vertex(x + cos(a + half) * r1, y + sin(a + half) * r1);
  }
  endShape(CLOSE);
}
