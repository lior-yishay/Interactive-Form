import { recordDomElement } from "../../scene-managment/domManager.js";
import { playSound, stopSound } from "../../soundManager.js";
import { getUnrealCounts, postUnrealPicks } from "./logic.js";

let img0, gif0;
let img1, gif1;
let img2, gif2;
let img3, gif3;
let img4, gif4;
let img5, gif5;
let img6, gif6;
let img7, gif7;
let img8, gif8;

// === ADDED: Sound variables ===
let soundAliens,
  soundBermuda,
  soundNesziona,
  soundFlatearth,
  soundBrain,
  soundVacs,
  soundMoon,
  soundBanana,
  soundIllumanity;

let sounds = [];

let selected = [false, false, false, false, false, false, false, false, false];

// === ADDED: Hover state tracking for sounds ===
let hoverStates = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

// === Updated sizes to make CAPTCHA bigger ===
let imgW = 180.5; // 190 * 0.95
let imgH = 168.15; // 177 * 0.95
let padding = 11.4; // 12 * 0.95
let headerH = 161.5; // 170 * 0.95
let footerH = 66.5; // 70 * 0.95
let gridSize = 3;
let widgetX, widgetY, widgetW, widgetH;
let customFont;
let verifyState = "default";
let verifyStartTime = 0;
let iconLoad, iconAudio;

let showResults = false;
let serverCounts; //lior's code
let resultCounts = [];
let resultRevealProgress = 0;

let showMessage = false;
let messageStartTime = 0;
let messageDuration = 5000; // 5 seconds

let postedUserPicksFlag = false; //lior's code

const unrealMap = {
  0: "bermuda",
  1: "nesziona",
  2: "flatearth",
  3: "brain",
  4: "moon",
  5: "vacs",
  6: "aliens",
  7: "banana",
  8: "illumanity",
};

export function preloadUnrealScene() {
  customFont = loadFont("./assets/Grotta-Trial-Medium.ttf");
  iconLoad = loadImage("./assets/load.svg");
  iconAudio = loadImage("./assets/headphones.svg");

  // === ADDED: Load sound files ===
  soundBermuda = loadSound("./assets/airplane-sfx-326783.mp3"); // For bermuda hover (index 0)
  soundNesziona = loadSound("./assets/nesziona.mp3"); // For nesziona hover (index 1)
  soundFlatearth = loadSound("./assets/swoosh-5-359829.mp3"); // For flatearth hover (index 2)
  soundBrain = loadSound("./assets/ui-sounds-pack-2-sound-6-358891.mp3"); // For brain hover (index 3)
  soundMoon = loadSound("./assets/impact-sound-effect-308750.mp3"); // For moon hover (index 4)
  soundVacs = loadSound("./assets/inject-sound-269721.mp3"); // For vaccination hover (index 5)
  soundAliens = loadSound("./assets/interior-spaceship-19828.mp3"); // For aliens hover (index 6)
  soundBanana = loadSound("./assets/woosh-230554.mp3"); // For banana hover (index 7)
  soundIllumanity = loadSound("./assets/space-sound-4-367748.mp3"); // For illuminati hover (index 8)

  img0 = loadImage("./assets/bermuda.png");
  img1 = loadImage("./assets/nesziona.png");
  img2 = loadImage("./assets/flatearth.png");
  img3 = loadImage("./assets/brainn.png");
  img4 = loadImage("./assets/moon.png");
  img5 = loadImage("./assets/vacs.png");
  img6 = loadImage("./assets/aliens.png");
  img7 = loadImage("./assets/banana.png");
  img8 = loadImage("./assets/illumanity.png");
}

export async function setupUnrealScene() {
  createCanvas(windowWidth, windowHeight).style("z-index", "-1");
  calculateLayout();
  textFont(customFont);
  noStroke();

  sounds = [
    soundBermuda,
    soundNesziona,
    soundFlatearth,
    soundBrain,
    soundMoon,
    soundVacs,
    soundAliens,
    soundBanana,
    soundIllumanity,
  ];

  gif0 = createImg("./assets/bermuda_hover.gif");
  gif1 = createImg("./assets/nesziona_hover.gif");
  gif2 = createImg("./assets/flatearth_hover.gif");
  gif3 = createImg("./assets/brainn_hover.gif");
  gif4 = createImg("./assets/moon_hover.gif");
  gif5 = createImg("./assets/vacs_hover.gif");
  gif6 = createImg("./assets/aliens_hover.gif");
  gif7 = createImg("./assets/banana_hover.gif");
  gif8 = createImg("./assets/illumanity_hover.gif");

  [gif0, gif1, gif2, gif3, gif4, gif5, gif6, gif7, gif8].forEach((gif) => {
    setupGif(gif);
    recordDomElement(gif);
  });

  serverCounts = await getUnrealCounts();
}

function setupGif(gif) {
  gif.hide();
  gif.style("position", "absolute");
  gif.style("pointer-events", "none");
}

function calculateLayout() {
  widgetW = gridSize * imgW + (gridSize + 1) * padding;
  widgetH = headerH + gridSize * imgH + (gridSize + 1) * padding + footerH;
  widgetX = (width - widgetW) / 2;
  widgetY = (height - widgetH) / 2;
}

export function drawUnrealScene() {
  background("#ECF1F7");
  cursor("default");

  fill("#DEE7F1");
  let rectSize = 400;
  for (let x = 0; x < width; x += rectSize + 20) {
    for (let y = 0; y < height; y += rectSize + 20) {
      if (!postedUserPicksFlag && selected.some((picked) => picked)) {
        strokeWeight(3);
        stroke(255);
      } else noStroke();
      rect(x, y, rectSize, rectSize, 2);
    }
  }

  fill(255);
  rect(widgetX, widgetY, widgetW, widgetH, 6);

  stroke(255);
  strokeWeight(12);
  noFill();
  rect(widgetX - 2, widgetY - 2, widgetW + 4, widgetH + 4, 6);

  noStroke();
  fill(66, 133, 244);
  rect(widgetX, widgetY, widgetW, headerH, 4, 4, 0, 0);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(24);
  text("Select all squares with", widgetX + 20, widgetY + headerH / 2 - 28);

  push();
  textSize(42);
  stroke("#232323");
  strokeWeight(1);
  noFill();
  text("The real things", widgetX + 20, widgetY + headerH / 2 + 10);
  pop();

  noStroke();
  fill(255);
  textSize(42);
  text("The real things", widgetX + 20, widgetY + headerH / 2 + 10);

  if (showResults && resultRevealProgress < 1) {
    resultRevealProgress += 0.05;
  }

  drawGrid();

  let btnW = 90;
  let btnH = 32;
  let btnX = widgetX + widgetW - btnW - 10;
  let btnY = widgetY + widgetH - btnH - 19;

  let isOverBtn =
    mouseX > btnX &&
    mouseX < btnX + btnW &&
    mouseY > btnY &&
    mouseY < btnY + btnH;

  if (verifyState === "default" && isOverBtn) {
    verifyState = "hover";
  } else if (verifyState === "hover" && !isOverBtn) {
    verifyState = "default";
  }

  // --- Enhanced Button ---
  let scaleAmt =
    verifyState === "hover" && isOverBtn && verifyState !== "verifying"
      ? 1.05
      : 1.0;
  push();
  translate(btnX + btnW / 2, btnY + btnH / 2);
  scale(scaleAmt);
  translate(-btnW / 2, -btnH / 2);

  if (verifyState === "verifying") {
    fill("#F9AB00"); // Bright yellow
  } else {
    fill(66, 133, 244); // Standard blue
  }

  noStroke();
  rect(0, 0, btnW, btnH, 2);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (verifyState === "verifying") {
    textFont("Helvetica-Bold");
    let dotCount = int((millis() - verifyStartTime) / 300) % 4;
    let dots = ".".repeat(dotCount);
    text("Verifying" + dots, btnW / 2, btnH / 2);
  } else {
    textFont(customFont);
    text("Verify", btnW / 2, btnH / 2);
  }
  pop();

  let iconSize = 24;
  let iconY = btnY + (btnH - iconSize) / 2;
  let iconAudioX = widgetX + padding + iconSize + 8;
  let iconAudioY = iconY;

  image(iconLoad, widgetX + padding, iconY, iconSize, iconSize);
  image(iconAudio, iconAudioX, iconAudioY, iconSize, iconSize);

  if (verifyState === "verifying" && millis() - verifyStartTime > 2000) {
    verifyState = "default";

    resultCounts = [];
    for (let i = 0; i < 9; i++) {
      let key = unrealMap[i];
      resultCounts[i] = serverCounts[key] || 0;
    }

    showResults = true;
    resultRevealProgress = 0;
  }

  // Draw verification message if active
  if (showMessage) {
    let elapsed = millis() - messageStartTime;
    if (elapsed < messageDuration) {
      push();
      let opacity = map(elapsed, 0, messageDuration * 0.2, 0, 255);
      opacity = constrain(opacity, 0, 255);

      let y = height - 75;
      textSize(18);
      textAlign(LEFT, CENTER);

      textFont("Helvetica");
      let checkText = "✔ ";
      let colonText = ":";
      let checkWidth = textWidth(checkText);
      let colonWidth = textWidth(colonText);

      textFont(customFont);
      let verifiedText = "Verified";
      let suffixText = " A conspiracy theory";
      let verifiedWidth = textWidth(verifiedText + " ");
      let suffixWidth = textWidth(suffixText);

      let totalWidth = checkWidth + verifiedWidth + colonWidth + suffixWidth;
      let startX = width / 2 - totalWidth / 2;

      fill(0, opacity);
      noStroke();
      rectMode(CENTER);
      rect(width / 2, y, totalWidth + 40, 50, 8);

      let x = startX;

      textFont("Helvetica");
      fill(255, opacity);
      text(checkText, x, y);
      x += checkWidth;

      textFont(customFont);
      text(verifiedText + " ", x, y);
      x += verifiedWidth;

      textFont("Helvetica");
      text(colonText, x, y);
      x += colonWidth;

      textFont(customFont);
      text(suffixText, x, y);

      pop();
    } else {
      showMessage = false;
    }
  }
}

function drawGrid() {
  drawCell(img0, gif0, 0);
  drawCell(img1, gif1, 1);
  drawCell(img2, gif2, 2);
  drawCell(img3, gif3, 3);
  drawCell(img4, gif4, 4);
  drawCell(img5, gif5, 5);
  drawCell(img6, gif6, 6);
  drawCell(img7, gif7, 7);
  drawCell(img8, gif8, 8);
}

function drawCell(img, gif, index) {
  let gx = index % 3;
  let gy = Math.floor(index / 3);
  let x = widgetX + padding + gx * (imgW + padding);
  let y = widgetY + headerH + padding + gy * (imgH + padding);

  let isHover =
    mouseX > x && mouseX < x + imgW && mouseY > y && mouseY < y + imgH;

  // === ADDED: Sound effect logic ===
  if (
    isHover &&
    !hoverStates[index] &&
    !showResults &&
    verifyState !== "verifying"
  ) {
    // Just started hovering - play sound once
    playSound(sounds[index]);
  } else if (!isHover && hoverStates[index]) {
    // Just stopped hovering - stop the sound
    stopSound(sounds[index]);
  }
  hoverStates[index] = isHover && !showResults && verifyState !== "verifying";

  fill(255);
  rect(x, y, imgW, imgH, 5);

  let scaleFactor = selected[index] ? 0.88 : 1.0;
  let drawW = imgW * scaleFactor;
  let drawH = imgH * scaleFactor;
  let offsetX = (imgW - drawW) / 2;
  let offsetY = (imgH - drawH) / 2;

  if (isHover && !showResults && verifyState !== "verifying") {
    gif.show();
    gif.position(x + offsetX, y + offsetY);
    gif.size(drawW, drawH);
  } else {
    gif.hide();
    image(img, x + offsetX, y + offsetY, drawW, drawH);
  }

  if (showResults) {
    fill(0, 0, 0, 100 * resultRevealProgress);
    rect(x + offsetX, y + offsetY, drawW, drawH, 5);
  }

  if (selected[index]) {
    stroke(255);
    strokeWeight(4);
    noFill();
    rect(x, y, imgW, imgH, 5);

    fill(66, 133, 244);
    circle(x + 32, y + 28, 28);

    push();
    stroke(255);
    strokeWeight(3);
    noFill();
    beginShape();
    vertex(x + 27, y + 27);
    vertex(x + 31, y + 32);
    vertex(x + 39, y + 22);
    endShape();
    pop();
  }

  if (showResults) {
    let value = resultCounts[index];
    if (selected[index]) {
      value += 1;
    }

    fill(255);
    noStroke();
    textSize(28);
    textAlign(CENTER, CENTER);
    text(value, x + imgW / 2, y + imgH / 2);
  }
}

export async function mousePressedUnrealScene() {
  for (let i = 0; i < 9; i++) {
    let gx = i % 3;
    let gy = Math.floor(i / 3);
    let x = widgetX + padding + gx * (imgW + padding);
    let y = widgetY + headerH + padding + gy * (imgH + padding);

    if (mouseX > x && mouseX < x + imgW && mouseY > y && mouseY < y + imgH) {
      selected[i] = !selected[i];
    }
  }

  let btnW = 90;
  let btnH = 32;
  let btnX = widgetX + widgetW - btnW - 10;
  let btnY = widgetY + widgetH - btnH - 19;

  if (
    mouseX > btnX &&
    mouseX < btnX + btnW &&
    mouseY > btnY &&
    mouseY < btnY + btnH &&
    verifyState !== "verifying"
  ) {
    verifyState = "verifying";
    verifyStartTime = millis();
    showResults = false;

    showMessage = true;
    messageStartTime = millis();

    let picks = [];
    for (let i = 0; i < selected.length; i++) {
      if (selected[i]) {
        picks.push(unrealMap[i]);
      }
    }

    if (!postedUserPicksFlag) {
      await postUnrealPicks(picks);
      postedUserPicksFlag = true;
    }
  }
}

export function windowResizedUnrealScene() {
  resizeCanvas(windowWidth, windowHeight);
  calculateLayout();
}

//lior's code
export const getUnrealPostedUserPicksFlag = () => postedUserPicksFlag;
