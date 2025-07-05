import { getFooterTop } from "../../footer/footer.js";

let grottaRegular;
let grottaBold;
let sidebarOpen = false;
let sidebarWidth = 0;
let targetSidebarWidth = 0;
let animationSpeed = 0.15;

// Shape selection
let selectedShapeIndex = 0;
let hoveredShapeIndex = -1;
let hoveredArrowIndex = -1; // -1: none, 0: left arrow, 1: right arrow
let hoveredKeyIndex = -1; // -1: none, or index for keyboard keys
let hoveredCustomizeButton = false; // Track hover on customize button
let carouselStartIndex = 0; // Which shape pair we're showing (0, 2, 4, etc.)
let shapeTransitionSpeed = 0.15;
let shapes = [
  "clover", // ① four-lobed cloud
  "blob", // ② wavy star / paint-splash
  "roundRect", // ③ vertical rounded rectangle
  "oval", // ④ ellipse
  "rect", // ⑤ classic rectangle
  "diamond",
]; // ⑥ diamond

// Color selection
let selectedColorIndex = 0;
let hoveredColorIndex = -1;
let colors = ["#10A959", "#F14E1D", "#FFC700", "#C9B8FF", "#F4EBDC"];

// Text input
let currentText = "";
let selectedSticker = null; // Will store the currently selected sticker info
let stickerTransform = { x: 0, y: 0, rotation: 0, scale: 1 }; // Sticker position and transform
let isDragging = false;
let isRotating = false;
let stickerSelected = false; // Track if sticker is in edit mode
let dragOffset = { x: 0, y: 0 };
let lastMouseAngle = 0;
let stickerBounds = { x: 0, y: 0, width: 240, height: 180 }; // Bounding box

// Cursor and backspace functionality
let showCursor = false;
let lastTypingTime = 0;
let isBackspacePressed = false;
let backspaceStartTime = 0;
let lastBackspaceTime = 0;
let backspaceRepeatDelay = 500; // Initial delay before repeat starts (ms)
let backspaceRepeatRate = 100; // Repeat rate after initial delay (ms)
let capsLockOn = false; // Track caps lock state
let keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"],
];

export function preloadFeedbackScene() {
  grottaRegular = loadFont("./assets/Grotta-Trial-Regular.otf");
  grottaBold = loadFont("./assets/Grotta-Trial-Bold.otf");
}

export function setupFeedbackScene() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  // Initialize sticker position to center
  // lior's code: stickerTransform stores the relative position
  // those fields were changed throughout the whole code
  stickerTransform.x = (width + 60) / (2 * width);
  stickerTransform.y = 0.5;
}

export function drawFeedbackScene() {
  // Dark background
  background("#19171E");

  // Update cursor visibility
  updateCursor();

  // Handle backspace long press
  handleBackspaceLongPress();

  // Animate sidebar width
  sidebarWidth = lerp(sidebarWidth, targetSidebarWidth, animationSpeed);

  // Draw main content area first
  drawMainContent();

  // Draw selected sticker in the center of the screen
  if (selectedSticker) {
    drawSelectedSticker();
  }

  // Draw the customize bar (this should be behind the sidebar)
  let customizeBarPosition = sidebarOpen ? sidebarWidth : sidebarWidth;
  fill("#19171E");
  noStroke();
  rect(customizeBarPosition, 0, 60, getFooterTop());

  // White line next to the sidebar with padding from top and bottom
  stroke(255, 255, 255);
  strokeWeight(1);
  line(
    customizeBarPosition + 60,
    40,
    customizeBarPosition + 60,
    getFooterTop()
  );
  noStroke();

  // Draw collapsible sidebar LAST (so it's above everything else)
  if (sidebarWidth > 5) {
    drawCustomizeSidebar();
  }

  // "Customize sticker" text with arrow (always on top)
  drawCustomizeText();
}

export function windowResizedFeedbackScene() {
  resizeCanvas(windowWidth, windowHeight);
}

export function mousePressedFeedbackScene() {
  // Check if clicked on customize sticker area - adjust position based on sidebar state
  let customizeBarPosition = sidebarOpen ? sidebarWidth : sidebarWidth;
  if (mouseX >= customizeBarPosition && mouseX <= customizeBarPosition + 60) {
    sidebarOpen = !sidebarOpen;
    targetSidebarWidth = sidebarOpen ? 350 : 0;
    return;
  }

  // Handle sidebar interactions
  if (sidebarOpen && mouseX < sidebarWidth) {
    handleSidebarClick();
    return;
  }

  // Check if clicking on rotation handle first (when sticker is selected)
  if (selectedSticker && stickerSelected && isMouseOverRotationHandle()) {
    isRotating = true;
    lastMouseAngle = atan2(
      mouseY - stickerTransform.y,
      mouseX - stickerTransform.x
    );
    return; // Don't check other interactions
  }

  // Check if clicking on sticker
  if (selectedSticker && isMouseOverSticker()) {
    // Select the sticker and start dragging
    stickerSelected = true;
    isDragging = true;
    dragOffset.x = mouseX - stickerTransform.x * width;
    dragOffset.y = mouseY - stickerTransform.y * height;
  } else {
    // Clicked outside sticker and rotation handle - deselect it
    stickerSelected = false;
  }
}

export function mouseDraggedFeedbackScene() {
  if (isDragging && selectedSticker) {
    stickerTransform.x = (mouseX - dragOffset.x) / width;
    stickerTransform.y = (mouseY - dragOffset.y) / height;
  }

  if (isRotating && selectedSticker) {
    let currentAngle = atan2(
      mouseY - stickerTransform.y * hieght,
      mouseX - stickerTransform.x * width
    );
    let angleDiff = currentAngle - lastMouseAngle;
    stickerTransform.rotation += angleDiff;
    lastMouseAngle = currentAngle;
  }
}

export function mouseReleasedFeedbackScene() {
  isDragging = false;
  isRotating = false;
}

export function mouseMovedFeedbackScene() {
  // Handle hover effects in sidebar
  if (sidebarOpen && mouseX < sidebarWidth) {
    hoveredColorIndex = -1;
    hoveredShapeIndex = -1;
    hoveredArrowIndex = -1;
    hoveredKeyIndex = -1;
    hoveredCustomizeButton = false;
    let contentWidth = sidebarWidth - 40;
    let leftMargin = 40;

    // Check color hover
    if (mouseY > 120 && mouseY < 160) {
      let colorSpacing = 45;
      let startX = leftMargin + 10;
      for (let i = 0; i < colors.length; i++) {
        let colorX = startX + i * colorSpacing;
        if (mouseX > colorX - 20 && mouseX < colorX + 20) {
          hoveredColorIndex = i;
          break;
        }
      }
    }

    // Check shape hover
    if (mouseY > 245 && mouseY < 325) {
      // Left arrow
      if (mouseX > leftMargin && mouseX < leftMargin + 40) {
        hoveredArrowIndex = 0;
      }
      // Right arrow
      else if (mouseX > contentWidth - 40 && mouseX < contentWidth) {
        hoveredArrowIndex = 1;
      }
      // Main shape area (between arrows)
      else if (mouseX > 100 && mouseX < 180) {
        hoveredShapeIndex = 0;
      }
      // Preview shape area
      else if (mouseX > 200 && mouseX < 280) {
        hoveredShapeIndex = 1;
      }
    }

    // Check keyboard hover
    let keyboardY = 415 + getTextInputHeight(contentWidth) + 15;
    if (mouseY > keyboardY) {
      checkKeyboardHover(leftMargin, keyboardY, contentWidth - 60);
    }
  } else {
    hoveredColorIndex = -1;
    hoveredShapeIndex = -1;
    hoveredArrowIndex = -1;
    hoveredKeyIndex = -1;

    // Check customize button hover
    let customizeBarPosition = sidebarOpen ? sidebarWidth : sidebarWidth;
    if (
      mouseX >= customizeBarPosition &&
      mouseX <= customizeBarPosition + 60 &&
      mouseY > 100 &&
      mouseY < 200
    ) {
      hoveredCustomizeButton = true;
    } else {
      hoveredCustomizeButton = false;
    }
  }
}

function drawCustomizeSidebar() {
  // Sidebar background - same color as main background with full opacity
  fill("#19171E");
  noStroke();
  rect(0, 0, sidebarWidth, height);

  // Only draw content if sidebar is wide enough
  if (sidebarWidth > 300) {
    let contentWidth = sidebarWidth - 40;
    let leftMargin = 40; // Increased from 20 to 40

    // Color section (first section) - moved down slightly
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(24);
    textFont(grottaRegular);
    text("Colour", leftMargin, 70);

    // Color line
    stroke(255);
    strokeWeight(1);
    line(leftMargin, 90, contentWidth - 20, 90);
    noStroke();

    // Color options
    let colorY = 140;
    let colorSpacing = 45;
    let startX = leftMargin + 10; // Adjusted for new margin

    for (let i = 0; i < colors.length; i++) {
      fill(colors[i]);
      let x = startX + i * colorSpacing;
      if (x < contentWidth - 20) {
        ellipse(x, colorY, 30, 30);

        // Hover effect
        if (i === hoveredColorIndex) {
          noFill();
          stroke(255);
          strokeWeight(1);
          ellipse(x, colorY, 40, 40);
          noStroke();
        }

        // Selection indicator
        if (i === selectedColorIndex) {
          noFill();
          stroke(255);
          strokeWeight(2);
          ellipse(x, colorY, 35, 35);
          noStroke();
        }
      }
    }

    // Shape section (second section - increased spacing from color section)
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(24);
    textFont(grottaRegular);
    text("Shape", leftMargin, 220);

    // Shape line
    stroke(255);
    strokeWeight(1);
    line(leftMargin, 240, contentWidth - 20, 240);
    noStroke();

    // Shape options
    let shapeY = 285;

    // Left arrow for shapes
    fill(hoveredArrowIndex === 0 ? 255 : 150);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont("Helvetica");
    text("<", leftMargin + 20, shapeY); // Moved further left

    // Right arrow for shapes
    fill(hoveredArrowIndex === 1 ? 255 : 150);
    text(">", contentWidth - 20, shapeY); // Moved further right

    // Simple smooth shape display
    let mainShapeX = 140; // Adjusted for new margin
    let partialShapeX = 240; // Adjusted for new margin

    // Show current pair of shapes based on carouselStartIndex
    let firstShapeIndex = carouselStartIndex % shapes.length;
    let secondShapeIndex = (carouselStartIndex + 1) % shapes.length;

    // Draw first shape
    let isMainHovered = hoveredShapeIndex === 0;
    let isMainSelected = firstShapeIndex === selectedShapeIndex;
    let fillColor =
      isMainHovered || isMainSelected ? colors[selectedColorIndex] : null;
    drawShape(
      mainShapeX,
      shapeY,
      firstShapeIndex,
      fillColor,
      isMainSelected,
      isMainHovered
    );

    // Draw second shape
    let isPreviewHovered = hoveredShapeIndex === 1;
    let isPreviewSelected = secondShapeIndex === selectedShapeIndex;
    let previewFillColor =
      isPreviewHovered || isPreviewSelected ? colors[selectedColorIndex] : null;
    drawShape(
      partialShapeX,
      shapeY,
      secondShapeIndex,
      previewFillColor,
      isPreviewSelected,
      isPreviewHovered
    );

    // Text section (third section - increased spacing from shape section)
    fill(150);
    textAlign(LEFT, CENTER);
    textSize(24);
    textFont(grottaRegular);
    text("Text", leftMargin, 390);

    // Text input area - calculate height based on text content
    let inputHeight = getTextInputHeight(contentWidth);

    // Draw text input area with calculated height
    fill(50);
    rect(leftMargin, 415, contentWidth - 60, inputHeight, 3);
    // Display current text or placeholder with character-level wrapping
    if (currentText.length > 0) {
      // Show actual text with character-level wrapping
      fill(255);
      textAlign(LEFT, TOP);
      textSize(14);
      textFont(grottaRegular);

      let availableWidth = contentWidth - 70;
      let textContent = currentText;
      let currentLine = "";
      let lineY = 425; // Start position
      let letterSpacing = 1.5; // מרווח בין אותיות

      for (let i = 0; i < textContent.length; i++) {
        let char = textContent[i];
        let testLine = currentLine + char;

        // חישוב רוחב עם מרווח
        let testWidth = 0;
        for (let j = 0; j < testLine.length; j++) {
          testWidth += textWidth(testLine[j]);
          if (j < testLine.length - 1 && testLine[j] !== " ") {
            testWidth += letterSpacing;
          }
        }

        if (testWidth > availableWidth) {
          // ציור השורה עם מרווח
          let currentX = leftMargin + 5;
          for (let j = 0; j < currentLine.length; j++) {
            let char = currentLine[j];
            text(char, currentX, lineY);
            currentX += textWidth(char);
            if (j < currentLine.length - 1 && char !== " ") {
              currentX += letterSpacing;
            }
          }
          lineY += 20;
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.length > 0) {
        // ציור השורה האחרונה עם מרווח
        let currentX = leftMargin + 5;
        for (let j = 0; j < currentLine.length; j++) {
          let char = currentLine[j];
          text(char, currentX, lineY);
          currentX += textWidth(char);
          if (j < currentLine.length - 1 && char !== " ") {
            currentX += letterSpacing;
          }
        }

        // ציור הסמן
        if (showCursor) {
          fill(255);
          rect(currentX, lineY, 1, 16);
        }
      }
    } else {
      // Show placeholder text
      fill(120); // Dimmed color for placeholder
      textAlign(LEFT, CENTER);
      textSize(14);
      textFont(grottaRegular);
      text("leave a feedback", leftMargin + 5, 415 + inputHeight / 2);
    }

    // Keyboard - positioned after the text input area
    let keyboardY = 415 + inputHeight + 15; // 15px gap below text input
    drawKeyboard(leftMargin, keyboardY, contentWidth - 60);
  }
}

function drawShape(
  cx,
  cy,
  shapeIndex,
  fillColor = null,
  isSelected = false,
  isHovered = false
) {
  // For clover, call it only once with all parameters
  if (shapeIndex === 0) {
    clover(cx, cy, 80, 60, fillColor, isHovered, isSelected);
    return;
  }

  // For other shapes, draw filled version if color provided
  if (fillColor) {
    fill(fillColor);
    noStroke();

    switch (shapeIndex) {
      case 1:
        blob(cx, cy, 25, 8, 10);
        break;
      case 2:
        roundRect(cx - 20, cy - 30, 40, 60, 8);
        break;
      case 3:
        ellipse(cx, cy, 80, 60);
        break;
      case 4:
        rect(cx - 40, cy - 30, 80, 60);
        break;
      case 5:
        diamond(cx, cy, 80, 60);
        break;
    }
  }

  // Draw outline for other shapes
  stroke(255);
  strokeWeight(isSelected || isHovered ? 2 : 1);
  noFill();

  switch (shapeIndex) {
    case 1:
      blob(cx, cy, 25, 8, 10);
      break;
    case 2:
      roundRect(cx - 20, cy - 30, 40, 60, 8);
      break;
    case 3:
      ellipse(cx, cy, 80, 60);
      break;
    case 4:
      rect(cx - 40, cy - 30, 80, 60);
      break;
    case 5:
      diamond(cx, cy, 80, 60);
      break;
  }
  noStroke();
}

/* ① clover – six-circle clover with overlapping rows -------------*/
function clover(
  cx,
  cy,
  w,
  h,
  fillColor = null,
  isHovered = false,
  isSelected = false
) {
  let r = 15; // radius for outline circles
  let offsetX = 18;
  let offsetY = 10; // reduced vertical spacing so rows overlap

  push();

  // First draw the outline circles (white stroke, no fill)
  noFill();
  stroke(255);
  strokeWeight(1);

  ellipse(cx - offsetX, cy - offsetY, r * 2, r * 2);
  ellipse(cx, cy - offsetY, r * 2, r * 2);
  ellipse(cx + offsetX, cy - offsetY, r * 2, r * 2);
  ellipse(cx - offsetX, cy + offsetY, r * 2, r * 2);
  ellipse(cx, cy + offsetY, r * 2, r * 2);
  ellipse(cx + offsetX, cy + offsetY, r * 2, r * 2);

  // Then draw smaller circles on top to hide internal lines
  let smallerR = r - 1; // slightly smaller radius
  // Use selected/hover color if selected or hovered, otherwise use black background color
  fill(isSelected || isHovered ? fillColor || "#19171E" : "#19171E");
  noStroke();

  ellipse(cx - offsetX, cy - offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx, cy - offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx + offsetX, cy - offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx - offsetX, cy + offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx, cy + offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx + offsetX, cy + offsetY, smallerR * 2, smallerR * 2);

  pop();
}

/* ② blob – smooth wavy star with really curved edges ------------------*/
function blob(cx, cy, baseR, amp, lobes) {
  beginShape();
  // Create many more vertices for ultra-smooth curves
  let totalPoints = lobes * 8; // Increased for maximum smoothness
  for (let i = 0; i < totalPoints; i++) {
    let angle = (TWO_PI * i) / totalPoints;

    // Use a smoother wave function with easing
    let lobeAngle = lobes * angle;
    let wave = cos(lobeAngle);

    // Apply smooth easing to the wave (makes transitions more curved)
    let smoothWave = wave * wave * wave; // Cubic easing for more curves
    if (wave < 0) smoothWave = -smoothWave; // Preserve negative values

    // Calculate radius with smooth transitions
    let radiusMultiplier = 1 + (amp / baseR) * smoothWave * 0.7; // Reduced amplitude for gentler curves
    let radius = baseR * radiusMultiplier;

    // Use curveVertex for Bezier-like smoothing
    curveVertex(cx + cos(angle) * radius, cy + sin(angle) * radius);
  }
  // Add extra points at the beginning and end for proper curve closure
  for (let i = 0; i < 3; i++) {
    let angle = (TWO_PI * i) / totalPoints;
    let lobeAngle = lobes * angle;
    let wave = cos(lobeAngle);
    let smoothWave = wave * wave * wave;
    if (wave < 0) smoothWave = -smoothWave;
    let radiusMultiplier = 1 + (amp / baseR) * smoothWave * 0.7;
    let radius = baseR * radiusMultiplier;
    curveVertex(cx + cos(angle) * radius, cy + sin(angle) * radius);
  }
  endShape(CLOSE);
}

/* ③ roundRect – classic rounded rectangle ------------------------*/
function roundRect(x, y, w, h, r) {
  // p5's rect() only supports a uniform radius – perfect here
  rect(x, y, w, h, r);
}

/* ④ diamond – simple diamond shape ------------------------*/
function diamond(cx, cy, w, h) {
  beginShape();
  vertex(cx, cy - h / 2); // top
  vertex(cx + w / 2, cy); // right
  vertex(cx, cy + h / 2); // bottom
  vertex(cx - w / 2, cy); // left
  endShape(CLOSE);
}

function drawSelectedSticker() {
  if (!selectedSticker) return;

  // Use transform position instead of fixed center
  let centerX = stickerTransform.x * width;
  let centerY = stickerTransform.y * height;

  // Draw the sticker 2x bigger than in sidebar
  let stickerColor = colors[selectedSticker.colorIndex];

  push();
  translate(centerX, centerY);
  rotate(stickerTransform.rotation);
  scale(stickerTransform.scale);

  // For clover, handle it specially
  if (selectedSticker.shapeIndex === 0) {
    // Draw clover with filled circles only
    let r = 45; // radius for big circles (double the sidebar size)
    let offsetX = 54;
    let offsetY = 30;

    fill(stickerColor);
    noStroke();

    ellipse(-offsetX, -offsetY, r * 2, r * 2);
    ellipse(0, -offsetY, r * 2, r * 2);
    ellipse(offsetX, -offsetY, r * 2, r * 2);
    ellipse(-offsetX, offsetY, r * 2, r * 2);
    ellipse(0, offsetY, r * 2, r * 2);
    ellipse(offsetX, offsetY, r * 2, r * 2);
  } else {
    // For other shapes, draw normally
    fill(stickerColor);
    noStroke();

    switch (selectedSticker.shapeIndex) {
      case 1:
        blob(0, 0, 75, 24, 10);
        break; // increased from 50, 16
      case 2:
        roundRect(-60, -90, 120, 180, 24);
        break; // increased from -40, -60, 80, 120, 16
      case 3:
        ellipse(0, 0, 240, 180);
        break; // increased from 160, 120
      case 4:
        rect(-120, -90, 240, 180);
        break; // increased from -80, -60, 160, 120
      case 5:
        diamond(0, 0, 240, 180);
        break; // increased from 160, 120
    }
  }

  // Add text if there is any
  if (selectedSticker.text && selectedSticker.text.length > 0) {
    drawTextInShape(0, 0, selectedSticker.text, selectedSticker.shapeIndex);
  }

  pop();

  // Draw selection handles only if sticker is selected for editing
  if (stickerSelected) {
    drawSelectionHandles();
  }
}

function drawSelectionHandles() {
  let centerX = stickerTransform.x * width;
  let centerY = stickerTransform.y * height;

  push();
  translate(centerX, centerY);
  rotate(stickerTransform.rotation);
  scale(stickerTransform.scale);

  // Draw bounding box
  stroke(255);
  strokeWeight(2);
  noFill();
  rect(
    -stickerBounds.width / 2,
    -stickerBounds.height / 2,
    stickerBounds.width,
    stickerBounds.height
  );

  // Draw corner handles
  fill(255);
  noStroke();
  let handleSize = 8;
  let halfW = stickerBounds.width / 2;
  let halfH = stickerBounds.height / 2;

  // // Corner handles for moving
  // rect(-halfW - handleSize/2, -halfH - handleSize/2, handleSize, handleSize);
  // rect(halfW - handleSize/2, -halfH - handleSize/2, handleSize, handleSize);
  // rect(-halfW - handleSize/2, halfH - handleSize/2, handleSize, handleSize);
  // rect(halfW - handleSize/2, halfH - handleSize/2, handleSize, handleSize);

  // Rotation handle (hollow white circle)
  noFill();
  stroke(255);
  strokeWeight(2);
  let rotHandleDistance = halfH + 20;
  ellipse(0, -rotHandleDistance, 12, 12);

  // Line to rotation handle
  stroke(255);
  strokeWeight(1);
  line(0, -halfH, 0, -rotHandleDistance + 6);

  pop();
}

function isMouseOverSticker() {
  if (!selectedSticker) return false;

  // Transform mouse coordinates to sticker's local space
  let dx = mouseX - stickerTransform.x * width;
  let dy = mouseY - stickerTransform.y * height;

  // Simple bounding box check (could be more precise for each shape)
  let halfW = (stickerBounds.width / 2) * stickerTransform.scale;
  let halfH = (stickerBounds.height / 2) * stickerTransform.scale;

  return dx > -halfW && dx < halfW && dy > -halfH && dy < halfH;
}

function drawTextInShape(centerX, centerY, textContent, shapeIndex) {
  // Define text area bounds for each shape - more conservative
  let maxWidth, maxHeight, textAreaCenterY;

  switch (shapeIndex) {
    case 0: // clover
      maxWidth = 120; // הוגדל מ-80
      maxHeight = 90; // הוגדל מ-50
      textAreaCenterY = centerY;
      break;
    case 1: // blob
      maxWidth = 100; // הוגדל מ-60
      maxHeight = 80; // הוגדל מ-40
      textAreaCenterY = centerY;
      break;
    case 2: // roundRect
      maxWidth = 90; // הוגדל מ-50
      maxHeight = 140; // הוגדל מ-80
      textAreaCenterY = centerY;
      break;
    case 3: // ellipse
      maxWidth = 160; // הוגדל מ-100
      maxHeight = 110; // הוגדל מ-60
      textAreaCenterY = centerY;
      break;
    case 4: // rect
      maxWidth = 180; // הוגדל מ-120
      maxHeight = 140; // הוגדל מ-80
      textAreaCenterY = centerY;
      break;
    case 5: // diamond
      maxWidth = 120; // הוגדל מ-70
      maxHeight = 100; // הוגדל מ-50
      textAreaCenterY = centerY;
      break;
  }
  // Get text color based on sticker background color
  let textColor = getTextColor();
  fill(textColor);
  textAlign(LEFT, TOP);
  textFont(grottaBold);

  // Start with a smaller text size
  let fontSize = 18; // Reduced from 24
  textSize(fontSize);

  // Break text into lines with character-level wrapping
  let lines = [];
  let currentLine = "";

  for (let i = 0; i < textContent.length; i++) {
    let char = textContent[i];
    let testLine = currentLine + char;
    let testWidth = textWidth(testLine);

    if (testWidth > maxWidth) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        // Single character is too wide, force it
        lines.push(char);
        currentLine = "";
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Calculate total text height
  let lineHeight = fontSize * 1.1; // Tighter line spacing
  let totalTextHeight = lines.length * lineHeight;

  // Adjust font size if text is too tall
  while (totalTextHeight > maxHeight && fontSize > 8) {
    fontSize -= 1; // Smaller decrements
    textSize(fontSize);
    lineHeight = fontSize * 1.1;

    // Recalculate lines with new font size
    lines = [];
    currentLine = "";
    for (let i = 0; i < textContent.length; i++) {
      let char = textContent[i];
      let testLine = currentLine + char;
      let testWidth = textWidth(testLine);

      if (testWidth > maxWidth) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          lines.push(char);
          currentLine = "";
        }
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    totalTextHeight = lines.length * lineHeight;
  }

  // Draw each line centered
  let startY = textAreaCenterY - totalTextHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    let lineY = startY + i * lineHeight;
    let lineWidth = textWidth(lines[i]);
    let lineX = centerX - lineWidth / 2; // Center each line
    text(lines[i], lineX, lineY);
  }
}

function getTextColor() {
  if (!selectedSticker) return "#FFFFFF";

  let bgColor = colors[selectedSticker.colorIndex];

  switch (bgColor) {
    case "#10A959": // Green
      return "#FFFFFF";
    case "#F14E1D": // Orange
      return "#FFFFFF";
    case "#FFC700": // Yellow
      return "#9B570F";
    case "#C9B8FF": // Purple
      return "#9B570F";
    case "#F4EBDC": // "White"/Cream
      return "#10A959";
    default:
      return "#FFFFFF";
  }
}

function getTextInputHeight(contentWidth) {
  let inputHeight = 35;

  if (currentText.length > 0) {
    // Calculate how many lines the text will take with character breaking and spacing
    textSize(14);
    textFont(grottaRegular);
    let availableWidth = contentWidth - 70; // Account for padding
    let textContent = currentText;
    let lines = 0;
    let currentLine = "";
    let letterSpacing = 1.5; // אותו מרווח כמו בציור

    for (let i = 0; i < textContent.length; i++) {
      let char = textContent[i];
      let testLine = currentLine + char;

      // חישוב רוחב עם מרווח (אותו חישוב כמו בציור)
      let testWidth = 0;
      for (let j = 0; j < testLine.length; j++) {
        testWidth += textWidth(testLine[j]);
        if (j < testLine.length - 1 && testLine[j] !== " ") {
          testWidth += letterSpacing;
        }
      }

      if (testWidth > availableWidth) {
        lines++;
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      lines++;
    }

    // Minimum 1 line, add padding
    lines = max(1, lines);
    inputHeight = lines * 20 + 15; // 20px per line + padding
  }

  return inputHeight;
}

function updateSelectedSticker() {
  // Store current transform if sticker already exists
  let currentTransform = null;
  if (selectedSticker) {
    currentTransform = {
      x: stickerTransform.x,
      y: stickerTransform.y,
      rotation: stickerTransform.rotation,
      scale: stickerTransform.scale,
    };
  }

  selectedSticker = {
    shapeIndex: selectedShapeIndex,
    colorIndex: selectedColorIndex,
    text: currentText,
  };

  // If this is a new sticker (no previous transform), set to center
  if (!currentTransform) {
    stickerTransform.x = (width + 60) / (2 * width);
    stickerTransform.y = 0.5;
    stickerTransform.rotation = 0;
    stickerTransform.scale = 1;
    stickerSelected = true; // Auto-select new sticker
  } else {
    // Keep the existing transform (position, rotation, scale)
    stickerTransform = currentTransform;
    // Keep the selection state as it was
  }
}

function drawKeyboard(startX, startY, maxWidth) {
  let keySize = 25;
  let keySpacing = 28;
  let rowSpacing = 32;

  for (let row = 0; row < keyboard.length; row++) {
    let rowWidth = keyboard[row].length * keySpacing;
    let offsetX = (maxWidth - rowWidth) / 2;

    for (let col = 0; col < keyboard[row].length; col++) {
      let x = startX + offsetX + col * keySpacing;
      let y = startY + row * rowSpacing;

      if (x + keySize < startX + maxWidth) {
        let keyIndex = row * 100 + col; // Unique index for each key
        let isHovered = hoveredKeyIndex === keyIndex;
        let isShiftKey = keyboard[row][col] === "⇧";
        let isShiftPressed = isShiftKey && capsLockOn;

        // Key background - different color for pressed shift
        fill(isHovered ? 255 : isShiftPressed ? 100 : 60);
        rect(x, y, keySize, keySize, 3);

        // Key text
        fill(isHovered ? 0 : isShiftPressed ? 255 : 255);
        textAlign(CENTER, CENTER);
        textSize(16); // Increased to 16 for better visibility

        // Use system font for special symbols
        let key = keyboard[row][col];
        if (key === "⇧" || key === "⌫") {
          textFont("Arial"); // system default
        } else {
          textFont(grottaRegular);
        }

        text(key, x + keySize / 2, y + keySize / 2);
      }
    }
  }

  // Space bar - smaller
  let spaceY = startY + keyboard.length * rowSpacing;
  let spaceWidth = maxWidth * 0.6;
  let spaceX = startX + (maxWidth - spaceWidth) / 2;
  let isSpaceHovered = hoveredKeyIndex === 999; // Special index for space

  fill(isSpaceHovered ? 255 : 60);
  rect(spaceX, spaceY, spaceWidth, keySize, 3);
  fill(isSpaceHovered ? 0 : 255);
  textAlign(CENTER, CENTER);
  textSize(16); // Increased to 16 for consistency
  textFont("Arial"); // system font for "space"
  text("space", spaceX + spaceWidth / 2, spaceY + keySize / 2);
}

function drawCustomizeText() {
  push();
  // Move text further down
  let customizeBarPosition = sidebarOpen ? sidebarWidth : sidebarWidth;
  translate(customizeBarPosition + 30, 150);
  rotate(-PI / 2);

  // Main text with hover effect and bold on hover
  let textColor = hoveredCustomizeButton ? 255 : 200;
  fill(textColor, textColor, textColor);
  textAlign(CENTER, CENTER);
  textSize(max(12, width * 0.014));
  textStyle(NORMAL);
  textFont("Helvetica");
  let customizeText = "Customize sticker ";
  let arrowText = sidebarOpen ? "←" : "→";

  // Make "Customize sticker" bold on hover
  if (hoveredCustomizeButton) {
    textFont(grottaBold);
  } else {
    textFont(grottaRegular);
  }
  let textWidth1 = textWidth(customizeText);
  text(customizeText, -textWidth(arrowText) / 2, 0);

  push();
  translate(textWidth1 / 2, 0);
  rotate(PI / 2);
  textFont("Helvetica");
  fill(hoveredCustomizeButton ? 255 : textColor);
  text(arrowText, 0, 0);
  pop();

  pop();
}

function drawMainContent() {
  // Keep main content in original position - don't move it when sidebar opens
  let centerX = (width + 60) / 2;
  let baseY = height * 0.35;

  let leaveSize = max(30, width * 0.035);
  let feedbackSize = max(60, width * 0.085);
  let resultsSize = max(30, width * 0.035);

  // Calculate spacing - same distance between all three lines
  let lineSpacing = leaveSize * 1.6; // Consistent spacing between lines

  fill(255, 255, 255);
  textSize(leaveSize);
  textStyle(NORMAL);
  textFont(grottaRegular);
  textAlign(CENTER, CENTER); // Changed to center alignment
  text("Leave a", centerX, baseY);

  let pulse = sin(frameCount * 0.05) * 5 + 255;
  fill(pulse, pulse, pulse);
  textSize(feedbackSize);
  textStyle(NORMAL);
  textFont(grottaBold);
  textAlign(CENTER, CENTER); // Changed to center alignment
  text("FEEDBACK", centerX, baseY + lineSpacing);

  // "to see results" positioned below "FEEDBACK" with same spacing
  fill(255, 255, 255);
  textSize(resultsSize);
  textStyle(ITALIC);
  textFont(grottaRegular);
  textAlign(CENTER, CENTER); // Changed to center alignment
  text("to see results", centerX, baseY + 8 + lineSpacing * 2);
}

function isMouseOverRotationHandle() {
  if (!selectedSticker || !stickerSelected) return false;

  let centerX = stickerTransform.x * width;
  let centerY = stickerTransform.y * height;

  // Calculate rotation handle position
  let rotHandleDistance =
    (stickerBounds.height / 2 + 20) * stickerTransform.scale;
  let handleX =
    centerX + cos(stickerTransform.rotation - PI / 2) * rotHandleDistance;
  let handleY =
    centerY + sin(stickerTransform.rotation - PI / 2) * rotHandleDistance;

  let distance = dist(mouseX, mouseY, handleX, handleY);
  return distance < 15; // Increased tolerance to 15 pixels for easier clicking
}

function checkKeyboardHover(startX, startY, maxWidth) {
  let keySize = 25;
  let keySpacing = 28;
  let rowSpacing = 32;

  // Check regular keys
  for (let row = 0; row < keyboard.length; row++) {
    let rowWidth = keyboard[row].length * keySpacing;
    let offsetX = (maxWidth - rowWidth) / 2;

    for (let col = 0; col < keyboard[row].length; col++) {
      let x = startX + offsetX + col * keySpacing;
      let y = startY + row * rowSpacing;

      if (
        mouseX > x &&
        mouseX < x + keySize &&
        mouseY > y &&
        mouseY < y + keySize
      ) {
        hoveredKeyIndex = row * 100 + col;
        return;
      }
    }
  }

  // Check space bar
  let spaceY = startY + keyboard.length * rowSpacing;
  let spaceWidth = maxWidth * 0.6;
  let spaceX = startX + (maxWidth - spaceWidth) / 2;

  if (
    mouseX > spaceX &&
    mouseX < spaceX + spaceWidth &&
    mouseY > spaceY &&
    mouseY < spaceY + keySize
  ) {
    hoveredKeyIndex = 999; // Special index for space
  }
}

function handleSidebarClick() {
  let relativeX = mouseX;
  let contentWidth = sidebarWidth - 40;
  let leftMargin = 40;

  // Shape navigation and selection
  if (mouseY > 245 && mouseY < 325) {
    // Arrow navigation - move by 2 shapes each time
    if (relativeX > leftMargin && relativeX < leftMargin + 40) {
      // Left arrow - go back 2 shapes
      carouselStartIndex =
        (carouselStartIndex - 2 + shapes.length) % shapes.length;
    } else if (relativeX > contentWidth - 40 && relativeX < contentWidth) {
      // Right arrow - go forward 2 shapes
      carouselStartIndex = (carouselStartIndex + 2) % shapes.length;
    }
    // Direct shape selection
    else if (relativeX > 100 && relativeX < 180) {
      // Click on first shape - select it
      selectedShapeIndex = carouselStartIndex % shapes.length;
      updateSelectedSticker(); // Update the sticker when shape changes
    } else if (relativeX > 200 && relativeX < 280) {
      // Click on second shape - select it
      selectedShapeIndex = (carouselStartIndex + 1) % shapes.length;
      updateSelectedSticker(); // Update the sticker when shape changes
    }
  }

  // Color selection - updated Y coordinates
  if (mouseY > 120 && mouseY < 160) {
    let colorSpacing = 45;
    let startX = leftMargin + 10;
    for (let i = 0; i < colors.length; i++) {
      let colorX = startX + i * colorSpacing;
      if (relativeX > colorX - 15 && relativeX < colorX + 15) {
        selectedColorIndex = i;
        updateSelectedSticker(); // Update the sticker when color changes
        break;
      }
    }
  }

  // Keyboard interaction - updated Y coordinates
  let keyboardY = 415 + getTextInputHeight(contentWidth) + 15;
  if (mouseY > keyboardY) {
    handleKeyboardClick(
      relativeX - leftMargin,
      mouseY - keyboardY,
      contentWidth - 60
    );
  }
}

function handleKeyboardClick(x, y, maxWidth) {
  let keySize = 25;
  let keySpacing = 28;
  let rowSpacing = 32;

  for (let row = 0; row < keyboard.length; row++) {
    if (y > row * rowSpacing && y < row * rowSpacing + keySize) {
      let rowWidth = keyboard[row].length * keySpacing;
      let offsetX = (maxWidth - rowWidth) / 2;

      for (let col = 0; col < keyboard[row].length; col++) {
        let keyX = offsetX + col * keySpacing;
        if (x > keyX && x < keyX + keySize) {
          let key = keyboard[row][col];
          if (key === "⌫") {
            // Simple backspace - delete one character immediately
            if (currentText.length > 0) {
              currentText = currentText.slice(0, -1);
              updateSelectedSticker();
            }
            lastTypingTime = millis(); // Show cursor
          } else if (key === "⇧") {
            // Toggle caps lock
            capsLockOn = !capsLockOn;
          } else {
            // Add character with caps lock consideration
            let charToAdd = key;
            if (capsLockOn && key.match(/[a-z]/)) {
              charToAdd = key.toUpperCase();
            }
            currentText += charToAdd;
            lastTypingTime = millis(); // Show cursor
            updateSelectedSticker(); // Update the sticker when text changes
          }
          return;
        }
      }
    }
  }

  // Check space bar
  let spaceY = keyboard.length * rowSpacing;
  if (y > spaceY && y < spaceY + keySize) {
    let spaceWidth = maxWidth * 0.6;
    let spaceX = (maxWidth - spaceWidth) / 2;
    if (x > spaceX && x < spaceX + spaceWidth) {
      currentText += " ";
      lastTypingTime = millis(); // Show cursor
      updateSelectedSticker(); // Update the sticker when text changes
    }
  }
}

// New functions for cursor and backspace functionality
function updateCursor() {
  let currentTime = millis();
  // Show cursor for 2 seconds after typing, then blink
  if (currentTime - lastTypingTime < 2000) {
    showCursor = true;
  } else {
    // Blink cursor every 500ms
    showCursor = (currentTime - lastTypingTime) % 1000 < 500;
  }
}

function handleBackspaceLongPress() {
  if (isBackspacePressed) {
    let currentTime = millis();
    let timeSinceStart = currentTime - backspaceStartTime;
    let timeSinceLastDelete = currentTime - lastBackspaceTime;

    // After initial delay, start repeating
    if (
      timeSinceStart > backspaceRepeatDelay &&
      timeSinceLastDelete > backspaceRepeatRate
    ) {
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        updateSelectedSticker();
        lastBackspaceTime = currentTime;
        lastTypingTime = currentTime; // Keep cursor visible
      }
    }
  }
}

//lior's code
export const getUserSticker = () =>
  selectedSticker && stickerTransform
    ? { ...selectedSticker, ...stickerTransform }
    : null;

//----------- unused functions ----------- //:
function drawTextWithSpacing(textString, x, y, spacing) {
  let currentX = x;
  for (let i = 0; i < textString.length; i++) {
    let char = textString[i];
    text(char, currentX, y);
    currentX += textWidth(char) + (char !== " " ? spacing : textWidth(" "));
  }
}
function getTextWidthWithSpacing(textString, spacing) {
  if (textString.length === 0) return 0;

  let totalWidth = 0;
  for (let i = 0; i < textString.length; i++) {
    let char = textString[i];
    totalWidth += textWidth(char);
    if (i < textString.length - 1 && char !== " ") {
      totalWidth += spacing;
    }
  }
  return totalWidth;
}

// Helper function to check if any line is too big
function hasLineTooBig(lines, maxWidth) {
  for (let line of lines) {
    if (textWidth(line) > maxWidth) {
      return true;
    }
  }
  return false;
}

function drawShapeWithAlpha(cx, cy, shapeIndex, alpha) {
  // All shapes adjusted to same height (~60px) and positioned to not overlap
  switch (shapeIndex) {
    /* ① CLOVER – union of six equal circles ---------------------*/
    case 0:
      cloverWithAlpha(cx, cy, 80, 60, alpha);
      break;
    /* ② BLOB – 10-lobe wavy / "splash" ---------------------------*/
    case 1:
      blobWithAlpha(cx, cy, 25, 8, 10, alpha);
      break;
    /* ③ ROUNDED  RECTANGLE  (vertical) ---------------------------*/
    case 2:
      roundRect(cx - 20, cy - 30, 40, 60, 8);
      break;
    /* ④ OVAL ------------------------------------------------------*/
    case 3:
      ellipse(cx, cy, 80, 60);
      break;
    /* ⑤ RECTANGLE -------------------------------------------------*/
    case 4:
      rect(cx - 40, cy - 30, 80, 60);
      break;
    /* ⑥ DIAMOND ---------------------------------------------------*/
    case 5:
      diamond(cx, cy, 80, 60);
      break;
  }
}

function cloverWithAlpha(
  cx,
  cy,
  w,
  h,
  alpha,
  fillColor = null,
  isHovered = false,
  isSelected = false
) {
  let r = 15; // radius for outline circles
  let offsetX = 18;
  let offsetY = 10; // reduced vertical spacing so rows overlap

  push();

  // First draw the outline circles (white stroke with alpha, no fill)
  noFill();
  stroke(255, alpha);
  strokeWeight(1);

  ellipse(cx - offsetX, cy - offsetY, r * 2, r * 2);
  ellipse(cx, cy - offsetY, r * 2, r * 2);
  ellipse(cx + offsetX, cy - offsetY, r * 2, r * 2);
  ellipse(cx - offsetX, cy + offsetY, r * 2, r * 2);
  ellipse(cx, cy + offsetY, r * 2, r * 2);
  ellipse(cx + offsetX, cy + offsetY, r * 2, r * 2);

  // Then draw smaller circles on top to hide internal lines
  let smallerR = r - 1; // slightly smaller radius
  // Use selected/hover color if selected or hovered, otherwise use black background color
  fill(isSelected || isHovered ? fillColor || "#19171E" : "#19171E");
  noStroke();

  ellipse(cx - offsetX, cy - offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx, cy - offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx + offsetX, cy - offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx - offsetX, cy + offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx, cy + offsetY, smallerR * 2, smallerR * 2);
  ellipse(cx + offsetX, cy + offsetY, smallerR * 2, smallerR * 2);

  pop();
}

function blobWithAlpha(cx, cy, baseR, amp, lobes, alpha) {
  beginShape();
  // Create many more vertices for ultra-smooth curves
  let totalPoints = lobes * 8; // Increased for maximum smoothness
  for (let i = 0; i < totalPoints; i++) {
    let angle = (TWO_PI * i) / totalPoints;

    // Use a smoother wave function with easing
    let lobeAngle = lobes * angle;
    let wave = cos(lobeAngle);

    // Apply smooth easing to the wave (makes transitions more curved)
    let smoothWave = wave * wave * wave; // Cubic easing for more curves
    if (wave < 0) smoothWave = -smoothWave; // Preserve negative values

    // Calculate radius with smooth transitions
    let radiusMultiplier = 1 + (amp / baseR) * smoothWave * 0.7; // Reduced amplitude for gentler curves
    let radius = baseR * radiusMultiplier;

    // Use curveVertex for Bezier-like smoothing
    curveVertex(cx + cos(angle) * radius, cy + sin(angle) * radius);
  }
  // Add extra points at the beginning and end for proper curve closure
  for (let i = 0; i < 3; i++) {
    let angle = (TWO_PI * i) / totalPoints;
    let lobeAngle = lobes * angle;
    let wave = cos(lobeAngle);
    let smoothWave = wave * wave * wave;
    if (wave < 0) smoothWave = -smoothWave;
    let radiusMultiplier = 1 + (amp / baseR) * smoothWave * 0.7;
    let radius = baseR * radiusMultiplier;
    curveVertex(cx + cos(angle) * radius, cy + sin(angle) * radius);
  }
  endShape(CLOSE);
}
