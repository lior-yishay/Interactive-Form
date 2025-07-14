import { getBigThingCounts } from "./logic.js";

/**
 * Responsive "prediction-cards" layout  ·  p5.js v1.6.0
 *
 * - Title sits higher
 * - Central shapes fit perfectly inside cards
 * - Green clover has no gaps
 * - Smooth hover animation
 *
 * Fonts:
 *    – Title: Helvetica (system) → textStyle(BOLD)
 *    – Cards: Grotta-Trial-Semibold.otf
 */
let grotta;
const BASE_W = 1463;
const BASE_H = 768;
let cardHoverStates = [0, 0, 0]; // smooth animation values for each card
let cardRotationStates = [0, 0, 0]; // rotation values for each card's shape
let cardFlipStates = [0, 0, 0]; // flip animation values (0 = front, 1 = back)
let cardFlipped = [false, false, false]; // which cards are flipped
let selectedCard; // which card index is selected
let cardCenteringStates = [0, 0, 0]; // animation for centering the selected card
let cardScaleStates = [1, 1, 1]; // scale animation for selected card
let titleMoveState = 0; // animation for moving title below card
let glowRotation = 0; // rotation for the glow rays
// Vote counters for each card
let cardVotes;
const ANIMATION_SPEED = 0.15;
const ROTATION_SPEED = 0.02;
const FLIP_SPEED = 0.12;
const CENTERING_SPEED = 0.03; // Made even slower
const SCALE_SPEED = 0.04; // Made slower
const TITLE_MOVE_SPEED = 0.04; // Title movement speed
const GLOW_ROTATION_SPEED = 0.01; // Glow rotation speed

export function preloadBigThingScene() {
  grotta = loadFont("./assets/Grotta-Trial-Semibold.otf");
}
export async function setupBigThingScene() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  cardVotes = await getBigThingCounts();
  console.log("cardVotes:", cardVotes);
}
export function windowResizedBigThingScene() {
  resizeCanvas(windowWidth, windowHeight);
}
export function mouseMovedBigThingScene() {
  // Animation handled in draw loop
}
export function mousePressedBigThingScene() {
  // Don't allow new clicks if a card is already selected
  if (selectedCard !== undefined) return;

  // Check which card was clicked
  const scaleX = width / BASE_W;
  const scaleY = height / BASE_H;
  const s = min(scaleX, scaleY) * 0.85;

  const w = 360 * s;
  let gap = (360 + 70) * s;
  const cx = width / 2;

  // Ensure cards fit horizontally
  const totalWidth = cx - gap + gap + gap + w / 2;
  if (totalWidth > width * 0.95) {
    const maxGap = (width * 0.9 - w * 3) / 2;
    gap = min(gap, maxGap);
  }

  const cardHeight = 570 * s;
  let cy = height / 2;
  const titleHeight = 48 * s * 2.2;
  const totalHeight = titleHeight + cardHeight + 100 * s;
  const availableHeight = height * 0.9;

  if (totalHeight > availableHeight) {
    cy = titleHeight + (availableHeight - titleHeight) / 2;
  }

  // Card positions
  const cardPositions = [
    { x: cx - gap, y: cy },
    { x: cx, y: cy },
    { x: cx + gap, y: cy },
  ];

  // Check if click is within any card
  for (let i = 0; i < 3; i++) {
    const cardDist = dist(
      mouseX,
      mouseY,
      cardPositions[i].x,
      cardPositions[i].y
    );
    if (cardDist < w / 2) {
      cardFlipped[i] = true;
      selectedCard = i;
      // Increment vote count for the selected card
      cardVotes[i]++;
      break;
    }
  }
}
export function drawBigThingScene() {
  // Calculate responsive scale with better fitting
  const scaleX = width / BASE_W;
  const scaleY = height / BASE_H;
  const s = min(scaleX, scaleY) * 0.7; // Made smaller (was 0.85)

  background("#1E1E26");
  cursor("default");

  // Update glow rotation
  if (selectedCard !== undefined) {
    glowRotation += GLOW_ROTATION_SPEED;
  }

  // geometry
  const w = 360 * s;
  const h = 570 * s;
  let gap = (360 + 70) * s;
  const cx = width / 2;

  // Calculate positions to ensure everything fits
  const titleHeight = 48 * s * 2.2; // approximate title height with line spacing
  const cardHeight = h;
  const totalHeight = titleHeight + cardHeight + 100 * s; // gap between title and cards
  const availableHeight = height * 0.9; // use 90% of screen height

  // Adjust vertical positioning if content is too tall
  let cy = height / 2;
  if (totalHeight > availableHeight) {
    cy = titleHeight + (availableHeight - titleHeight) / 2;
  }

  // Ensure cards fit horizontally
  const totalWidth = cx - gap + gap + gap + w / 2;
  if (totalWidth > width * 0.95) {
    // If cards don't fit, reduce gap
    const maxGap = (width * 0.9 - w * 3) / 2;
    gap = min(gap, maxGap);
  }

  const titleY = cy - cardHeight / 2 - 100 * s;

  // Update title movement animation
  if (selectedCard !== undefined) {
    titleMoveState = lerp(titleMoveState, 1, TITLE_MOVE_SPEED);
  }

  // Calculate title position
  let finalTitleY = titleY;
  if (selectedCard !== undefined) {
    const belowCardY = height / 2 + (cardHeight * 1.4) / 2 + 80 * s; // Account for scaled card size
    finalTitleY = lerp(titleY, belowCardY, titleMoveState);
  }

  /* ───── Title ───── */
  if (selectedCard === undefined) {
    push();
    textFont("Helvetica");
    textStyle(BOLD);
    fill(255);
    textSize(48 * s);
    textLeading(54 * s);
    textAlign(CENTER, CENTER);
    noStroke();
    text("The next big\nthing to happen", cx, finalTitleY);
    pop();
  }
  /* ───── Cards ───── */
  const cardData = [
    {
      x: cx - gap,
      rot: radians(-7),
      color: "#FF6238",
      shapeColor: "#FF7E5A",
      shapeFn: () => roundedStarburst(0, 0, 150 * s * 0.75, 240 * s * 0.75, 18),
      text: "Israel and\nPalestine\nco host\nEurovision",
    },
    {
      x: cx,
      rot: radians(0),
      color: "#00A14B",
      shapeColor: "#5CCF88",
      shapeFn: () => clover(0, 0, 210 * s * 0.85, 0.5),
      text: "Trump wins\nNobel Peace\nPrize",
    },
    {
      x: cx + gap,
      rot: radians(6),
      color: "#7B67FF",
      shapeColor: "#9A8BFF",
      shapeFn: () => starburst(0, 0, 155 * s * 0.65, 260 * s * 0.65, 36),
      text: "Nuclear\nstrike in\nEurope",
    },
  ];

  for (let i = 0; i < 3; i++) {
    // Update centering animation
    if (selectedCard !== undefined) {
      if (i === selectedCard) {
        cardCenteringStates[i] = lerp(
          cardCenteringStates[i],
          1,
          CENTERING_SPEED
        );
        cardScaleStates[i] = lerp(cardScaleStates[i], 1.4, SCALE_SPEED); // Scale up selected card even more
      } else {
        cardCenteringStates[i] = lerp(
          cardCenteringStates[i],
          1,
          CENTERING_SPEED
        );
        cardScaleStates[i] = lerp(cardScaleStates[i], 0.7, SCALE_SPEED); // Scale down other cards more
      }
    }

    // Calculate final position
    let finalX = cardData[i].x;
    let finalY = cy;

    if (selectedCard !== undefined) {
      if (i === selectedCard) {
        // Selected card moves to center
        finalX = lerp(cardData[i].x, cx, cardCenteringStates[i]);
        finalY = lerp(cy, height / 2, cardCenteringStates[i]);
      } else {
        // Other cards move off screen (further out for smoother exit)
        const offScreenDistance = width * 0.8;
        const offScreenX =
          i < selectedCard ? -offScreenDistance : width + offScreenDistance;
        finalX = lerp(cardData[i].x, offScreenX, cardCenteringStates[i]);
      }
    }

    // Draw glow effect UNDER selected card
    if (selectedCard === i && cardCenteringStates[i] > 0.5) {
      drawGlowEffect(finalX, finalY, w * cardScaleStates[i], s);
    }

    drawCard(
      finalX,
      finalY,
      w,
      h,
      cardData[i].rot,
      cardData[i].color,
      cardData[i].shapeFn,
      cardData[i].shapeColor,
      cardData[i].text,
      s,
      i + 1,
      cardScaleStates[i]
    );
  }
}
/* ──────────────────────────────── Card routine */
function drawCard(
  x,
  y,
  w,
  h,
  rot,
  cardCol,
  shapeFcn,
  shapeCol,
  txt,
  s,
  cardIndex,
  cardScale = 1
) {
  // Check if mouse is hovering over this card (only if no card is selected)
  const cardCenterX = x;
  const cardCenterY = y;
  const hoverDistance = dist(mouseX, mouseY, cardCenterX, cardCenterY);
  const isHovering = selectedCard === undefined && hoverDistance < w / 2;

  // Smooth animation
  const targetHover = isHovering ? 1 : 0;
  cardHoverStates[cardIndex - 1] = lerp(
    cardHoverStates[cardIndex - 1],
    targetHover,
    ANIMATION_SPEED
  );

  // Flip animation
  const targetFlip = cardFlipped[cardIndex - 1] ? 1 : 0;
  cardFlipStates[cardIndex - 1] = lerp(
    cardFlipStates[cardIndex - 1],
    targetFlip,
    FLIP_SPEED
  );

  // Update rotation for spinning effect on hover (only if not selected)
  if (isHovering && selectedCard === undefined) {
    cardRotationStates[cardIndex - 1] += ROTATION_SPEED;
  }

  // Apply hover effect: move up in the direction of card rotation (only if not selected)
  let hoverOffsetX = 0;
  let hoverOffsetY = 0;
  if (selectedCard === undefined) {
    const moveDistance = 30 * s * cardHoverStates[cardIndex - 1];
    hoverOffsetX = -sin(rot) * moveDistance;
    hoverOffsetY = -cos(rot) * moveDistance;
  }

  push();
  translate(x + hoverOffsetX, y + hoverOffsetY);

  // Apply scale transformation
  scale(cardScale);

  rotate(rot);

  // 3D flip effect using scale
  const flipScale = cos(cardFlipStates[cardIndex - 1] * PI);
  scale(abs(flipScale), 1);

  // Determine if we're showing front or back
  const showBack = flipScale < 0;

  // base
  noStroke();
  fill(cardCol);
  rectMode(CENTER);
  rect(0, 0, w, h, 18 * s);

  if (showBack) {
    // Back side - result card
    drawCardBack(w, h, s, cardIndex);
  } else {
    // Front side - original prediction
    // central shape with rotation
    push();
    fill(shapeCol);
    rotate(cardRotationStates[cardIndex - 1]);
    shapeFcn();
    pop();
    // corner decorations
    push();
    const tint = shapeCol;
    fill(tint);
    const decoOff = w / 2 - 36 * s;
    for (let sx of [-1, 1]) {
      for (let sy of [-1, 1]) {
        push();
        translate(decoOff * sx, (h / 2 - 36 * s) * sy);
        scale(0.15);
        shapeFcn();
        pop();
      }
    }
    pop();
    // text
    push();
    fill(255);
    textFont(grotta);
    textSize(28 * s);
    textLeading(34 * s);
    textAlign(CENTER, CENTER);
    text(txt, 0, 0);
    pop();
  }

  pop();
}

function drawCardBack(w, h, s, cardIndex) {
  // Different content for each card back
  const backContent = [
    {
      title: "You are...\nThe Optimist",
      subtitle:
        "Wow. You're honestly\nadmirable for believing\npeace is possible in\nour lifetime.",
      category: "Optimist",
    },
    {
      title: "You are...\nThe Comedian",
      subtitle:
        "This is clearly a joke\nvote, but we appreciate\nyour sense of humor\nin dark times.",
      category: "Comedian",
    },
    {
      title: "You are...\nThe Realist",
      subtitle:
        "You've seen the news\nand you're preparing\nfor the worst case\nscenario.",
      category: "Realist",
    },
  ];

  const content = backContent[cardIndex - 1];
  const voteCount = cardVotes[cardIndex - 1];

  // Title - centered
  push();
  fill(255);
  textFont(grotta);
  textAlign(CENTER, CENTER);
  textSize(30 * s);
  textLeading(36 * s);
  text(content.title, 0, -h * 0.25);
  pop();

  // Subtitle - centered
  push();
  fill(255, 200);
  textFont("Helvetica");
  textAlign(CENTER, CENTER);
  textSize(26 * s);
  textLeading(32 * s);
  text(content.subtitle, 0, h * 0.05);
  pop();

  // Vote count - centered
  push();
  fill(255, 180);
  textFont(grotta);
  textAlign(CENTER, CENTER);
  textSize(18 * s);
  text(voteCount + " " + content.category + "s thought the same", 0, h * 0.35);
  pop();

  // Corner decorations - use same colors and opacity as front
  push();
  // Use the exact same colors as the front corner decorations (which use shapeColor)
  if (cardIndex === 1) {
    fill("#FF7E5A"); // Orange card shape color - same as front
  } else if (cardIndex === 2) {
    fill("#5CCF88"); // Green card shape color - same as front
  } else if (cardIndex === 3) {
    fill("#9A8BFF"); // Purple card shape color - same as front
  }
  const decoOff = w / 2 - 36 * s;
  for (let sx of [-1, 1]) {
    for (let sy of [-1, 1]) {
      push();
      translate(decoOff * sx, (h / 2 - 36 * s) * sy);
      scale(0.15); // Same scale as front corner decorations
      // Use the same shape as the front
      if (cardIndex === 1)
        roundedStarburst(0, 0, 150 * s * 0.75, 240 * s * 0.75, 18);
      else if (cardIndex === 2) clover(0, 0, 210 * s * 0.85, 0.5);
      else if (cardIndex === 3)
        starburst(0, 0, 155 * s * 0.65, 260 * s * 0.65, 36);
      pop();
    }
  }
  pop();
}
function drawGlowEffect(x, y, cardWidth, s) {
  push();
  translate(x, y);
  rotate(glowRotation);

  // Draw rotating rays - simple spinning
  const numRays = 8;
  const rayLength = cardWidth * 1.0;

  for (let i = 0; i < numRays; i++) {
    push();
    rotate((TWO_PI * i) / numRays);

    // Simple spinning ray
    stroke(255, 255, 255, 35);
    strokeWeight(2);
    strokeCap(ROUND);
    line(cardWidth * 0.55, 0, rayLength, 0);

    pop();
  }

  // Single circular glow layer - moderate
  for (let r = cardWidth * 1.0; r > cardWidth * 0.5; r -= 4) {
    const alpha = map(r, cardWidth * 0.5, cardWidth * 1.0, 0, 25);
    fill(255, 255, 255, alpha);
    noStroke();
    ellipse(0, 0, r, r);
  }

  pop();
}

/* ──────────────────────────────── Shapes */
function roundedStarburst(x, y, innerR, outerR, points) {
  beginShape();
  for (let i = 0; i < points; i++) {
    const angle = (TWO_PI * i) / points;
    const nextAngle = (TWO_PI * (i + 1)) / points;
    const r = i % 2 ? innerR : outerR;
    const nextR = (i + 1) % 2 ? innerR : outerR;

    if (i === 0) {
      vertex(x + cos(angle) * r, y + sin(angle) * r);
    }

    // Create control points for curve
    const controlDist = min(r, nextR) * 0.2;
    const cp1x = x + cos(angle) * r + cos(angle + HALF_PI) * controlDist;
    const cp1y = y + sin(angle) * r + sin(angle + HALF_PI) * controlDist;
    const cp2x =
      x + cos(nextAngle) * nextR + cos(nextAngle - HALF_PI) * controlDist;
    const cp2y =
      y + sin(nextAngle) * nextR + sin(nextAngle - HALF_PI) * controlDist;

    bezierVertex(
      cp1x,
      cp1y,
      cp2x,
      cp2y,
      x + cos(nextAngle) * nextR,
      y + sin(nextAngle) * nextR
    );
  }
  endShape(CLOSE);
}

function starburst(x, y, innerR, outerR, points) {
  beginShape();
  for (let i = 0; i < points; i++) {
    const angle = (TWO_PI * i) / points;
    const r = i % 2 ? innerR : outerR;
    vertex(x + cos(angle) * r, y + sin(angle) * r);
  }
  endShape(CLOSE);
}

function clover(x, y, radius, spacingFactor) {
  for (let i = 0; i < 4; i++) {
    const a = HALF_PI * i + QUARTER_PI;
    ellipse(
      x + cos(a) * radius * spacingFactor,
      y + sin(a) * radius * spacingFactor,
      radius,
      radius
    );
  }
}

//lior's code
export const getSelectedBigThingPickIndex = () => selectedCard;
