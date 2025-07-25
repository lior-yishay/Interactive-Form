import { getFooterTop } from "../../footer/footer.js";
import { recordDomElement } from "../../scene-managment/domManager.js";
import { playSound } from "../../soundManager.js";
import {
  drawNameHistoryBuffer,
  recordStroke,
  setupNameHistoryBuffer,
} from "./logic.js";

let brushSizeSlider;
let selectedColor;
let colors = [];
let canvasBuffer;
let isSliding = false;
let isMouseDown = false;
let isErasing = false;

let snellFont;
let grottaFont;
let clickSound;

let eraserBtn;

let helloYTarget, nameYTarget;
let helloYCurrent, nameYCurrent;
let helloAlpha = 0;
let nameAlpha = 0;

//lior's code
let margin,
  redCardWidth,
  redCardHeight,
  redCardX,
  redCardY,
  whiteAreaY,
  whiteAreaHeight;

export function preloadNameScene() {
  snellFont = loadFont("./assets/snellroundhand_bold.otf");
  grottaFont = loadFont("./assets/Grotta-Trial-Medium.ttf");

  // Load the click sound effect
  clickSound = loadSound("./assets/click-345983.mp3");
}

export async function setupNameScene() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  rectMode(CORNER);
  noStroke();

  canvasBuffer = createGraphics(width, height);
  await setupNameHistoryBuffer(10); //lior's code

  addCustomSliderStyles();

  const redCardTop = height * 0.18;
  const colorValues = ["#000000", "#C3ADFF", "#F14E1D", "#1B9955"];

  for (let i = 0; i < colorValues.length; i++) {
    const btn = createDiv("");
    btn.style("background", colorValues[i]);
    btn.style("width", "30px");
    btn.style("height", "30px");
    btn.style("border-radius", "50%");
    btn.style("border", "1px solid black");
    btn.style("position", "absolute");
    btn.style("left", `${windowWidth - 100}px`);
    btn.style("top", `${redCardTop + i * 50}px`);
    btn.style("cursor", "pointer");
    btn.style("transition", "all 0.2s ease");

    btn.mouseOver(() => {
      btn.style("width", "40px");
      btn.style("height", "40px");
      btn.style("transform", "translate(-5px, -5px)");
    });

    btn.mouseOut(() => {
      btn.style("width", "30px");
      btn.style("height", "30px");
      btn.style("transform", "translate(0px, 0px)");
    });

    btn.mousePressed(() => {
      selectedColor = color(colorValues[i]);
      isErasing = false;

      // Play click sound when selecting color
      playSound(clickSound);
    });

    colors.push(btn);
    recordDomElement(btn); //lior's code
  }

  eraserBtn = createImg("./assets/erasericon.png", "eraser");
  recordDomElement(eraserBtn); //lior's code

  eraserBtn.style("position", "absolute");
  eraserBtn.style("width", "30px");
  eraserBtn.style("height", "30px");
  eraserBtn.style("left", `${windowWidth - 100}px`);
  eraserBtn.style("top", `${redCardTop + colorValues.length * 50}px`);
  eraserBtn.style("cursor", "pointer");
  eraserBtn.style("transition", "all 0.2s ease");

  eraserBtn.mouseOver(() => {
    eraserBtn.style("width", "40px");
    eraserBtn.style("height", "40px");
    eraserBtn.style("transform", "translate(-5px, -5px)");
  });

  eraserBtn.mouseOut(() => {
    eraserBtn.style("width", "30px");
    eraserBtn.style("height", "30px");
    eraserBtn.style("transform", "translate(0px, 0px)");
  });

  eraserBtn.mousePressed(() => {
    selectedColor = color(255);
    isErasing = true;

    playSound(clickSound);
  });

  brushSizeSlider = createSlider(10, 50, 15);
  recordDomElement(brushSizeSlider); //lior's code

  brushSizeSlider.position(windowWidth - 250, windowHeight / 2 + 100);
  brushSizeSlider.style("transform", "rotate(-90deg)");
  brushSizeSlider.style("width", "320px");
  brushSizeSlider.style("appearance", "none");
  brushSizeSlider.style("background", "transparent");
  brushSizeSlider.style("border", "none");
  brushSizeSlider.style("outline", "none");
  brushSizeSlider.elt.classList.add("custom-slider");

  brushSizeSlider.mousePressed(() => {
    isSliding = true;
  });

  brushSizeSlider.mouseReleased(() => {
    isSliding = false;
  });

  document.addEventListener("mouseup", () => {
    isSliding = false;
  });

  selectedColor = color(colorValues[0]);

  helloYTarget = (redCardY + whiteAreaY) / 2 - 25;
  nameYTarget = helloYTarget + 60;
  helloYCurrent = helloYTarget + 60;
  nameYCurrent = nameYTarget + 60;
}

export function drawNameScene() {
  background(245);
  stroke(220);
  strokeWeight(1);
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) line(x, 0, x, height);
  for (let y = 0; y < height; y += gridSize) line(0, y, width, y);

  drawCardLayout();
  drawNameHistoryBuffer(); //lior's code
  image(canvasBuffer, 0, 0);
  drawTextOverlay();

  if (isSliding) drawBrushPreview();

  if (
    isMouseDown &&
    !isSliding &&
    !isMouseOverColor() &&
    !isMouseOverSlider()
  ) {
    drawBrush();
  }
  // Draw custom cursor - circular brush preview at mouse position
  if (!isMouseOverColor() && !isMouseOverSlider() && !isSliding) {
    drawCustomCursor();
  }
}

function drawCustomCursor() {
  // Hide default cursor
  noCursor();

  const brushSize = brushSizeSlider ? brushSizeSlider.value() : 1;

  // Draw cursor as circle with brush color and size
  noFill();
  stroke(selectedColor ?? 0);
  strokeWeight(2);
  ellipse(mouseX, mouseY, brushSize);

  // Add small center dot for precision
  fill(selectedColor ?? 0);
  noStroke();
  ellipse(mouseX, mouseY, 3);
}

function drawCardLayout() {
  margin = width * 0.1;
  redCardWidth = width - 2 * margin;
  redCardHeight = height * 0.74;
  redCardX = margin;
  redCardY = height * 0.13;
  whiteAreaY = redCardY + redCardHeight * 0.3;
  whiteAreaHeight = redCardHeight * 0.6;

  noStroke();
  fill("#F14E1D");
  rect(redCardX, redCardY, redCardWidth, redCardHeight, 20);

  fill(255);
  rect(redCardX, whiteAreaY, redCardWidth, whiteAreaHeight);
}

function drawTextOverlay() {
  helloAlpha = min(255, helloAlpha + 5);
  nameAlpha = min(255, nameAlpha + 5);
  helloYCurrent = lerp(helloYCurrent, helloYTarget, 0.1);
  nameYCurrent = lerp(nameYCurrent, nameYTarget, 0.1);

  const bounce = sin(frameCount * 0.03) * 4;

  fill(255, helloAlpha);
  textAlign(CENTER);
  textFont(snellFont);
  textSize(96);
  textStyle(ITALIC);
  text("Hello", width / 2, helloYCurrent + bounce);

  fill(255, nameAlpha);
  textFont(grottaFont);
  textSize(48);
  textStyle(NORMAL);
  text("my name is", width / 2, nameYCurrent + bounce * 0.5);
}

function drawBrushPreview() {
  const sliderLength = 320;
  const sliderX = windowWidth - 250;
  const sliderY = windowHeight / 2 + 80;

  const previewX = sliderX + 160;
  const previewY = sliderY + sliderLength / 2 + 100;

  const brushSize = brushSizeSlider.value();
  const pulse = 1 + 0.05 * sin(frameCount * 0.3);

  noStroke();
  fill(selectedColor);
  ellipse(previewX, previewY, brushSize * pulse);
}

function drawBrush() {
  if (isErasing) {
    canvasBuffer.erase();
  } else {
    canvasBuffer.noErase();
    canvasBuffer.stroke(selectedColor);
  }
  canvasBuffer.strokeWeight(brushSizeSlider.value());
  canvasBuffer.strokeCap(ROUND);

  const steps = 1; //lior changed this from 10. request size was too large
  for (let i = 0; i < steps; i++) {
    const x1 = lerp(pmouseX, mouseX, i / steps);
    const y1 = lerp(pmouseY, mouseY, i / steps);
    const x2 = lerp(pmouseX, mouseX, (i + 1) / steps);
    const y2 = lerp(pmouseY, mouseY, (i + 1) / steps);

    if (y1 > getFooterTop() || y2 > getFooterTop()) continue;
    canvasBuffer.line(x1, y1, x2, y2);
    //lior's code
    const from = { x: x1, y: y1 };
    const to = { x: x2, y: y2 };
    const colorValue = isErasing ? null : selectedColor.toString("#rrggbb");
    const weight = brushSizeSlider.value();
    recordStroke(from, to, colorValue, weight);
    //end of lior's code
  }
  canvasBuffer.noErase();

  canvasBuffer;
}

export function mousePressedNameScene() {
  isMouseDown = true;
}

export function mouseReleasedNameScene() {
  isMouseDown = false;
}

function isMouseOverSlider() {
  if (!brushSizeSlider) return false;

  const rect = brushSizeSlider.elt.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const x = mouseX + canvasRect.left;
  const y = mouseY + canvasRect.top;
  const isOver =
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

  // Show default cursor when over slider
  if (isOver) {
    cursor();
  }

  return isOver;
}

function isMouseOverColor() {
  const canvasRect = canvas.getBoundingClientRect();
  const x = mouseX + canvasRect.left;
  const y = mouseY + canvasRect.top;
  const isOver = colors.some((btn) => {
    const rect = btn.elt.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  });

  // Also check eraser button
  if (!eraserBtn) return isOver;

  const eraserRect = eraserBtn.elt.getBoundingClientRect();
  const isOverEraser =
    x >= eraserRect.left &&
    x <= eraserRect.right &&
    y >= eraserRect.top &&
    y <= eraserRect.bottom;

  // Show default cursor when over color buttons or eraser
  if (isOver || isOverEraser) {
    cursor();
  }

  return isOver || isOverEraser;
}

function addCustomSliderStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .custom-slider::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      background: #aaa;
      border-radius: 2px;
    }
    .custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #5E5E5E;
      border-radius: 50%;
      border: none;
      box-shadow: 0 0 8px rgba(0,0,0,0.3);
      margin-top: -8px;
      cursor: pointer;
    }
    .custom-slider::-moz-range-track {
      height: 4px;
      background: #aaa;
      border-radius: 2px;
    }
    .custom-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #333;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(0,0,0,0.3);
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}
