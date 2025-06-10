/*  Politically-speaking ball drop – v5
    -----------------------------------
    • Address bar centred in the chrome
    • Arrow inside ⬤ rotates to face the mouse                      */

import { getPoliticsCounts, postPoliticsCenter, postPoliticsLeft, postPoliticsRight } from "../../../proxy server/proxyServer.js";
// import { getPoliticsCounts, postPoliticsCenter, postPoliticsLeft, postPoliticsRight } from "./logic.js";


let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
let engine, world;

let politicsCounts;

let RADIUS
const CHROME_H      = 46;
const BLUE_PAD      = 58;
let WALL_START_Y
const CENTER_RATIO  = 0.22;
const WALL_THICK    = 4;

const BLUE = '#2124ff';

let blueX, blueY, blueW, blueH;
let leftW, centreW, sepLeftX, sepRightX;
let balls = [], walls = [];

/* ---------- p5 setup / resize -------------------------------- */
export async function setupPoliticsScene() {
  createCanvas(windowWidth, windowHeight);
  textFont('Helvetica Neue, Arial, sans-serif');
  textAlign(CENTER, CENTER);
  
  initPhysics();
  await buildLayout();

}

export async function windowResizedPoliticsScene() {
  resizeCanvas(windowWidth, windowHeight);
  // Clear all bodies and constraints from the world
  World.clear(world, false); // false = don't keep the world instance itself
  Engine.clear(engine);      // clear engine's internal references
  await buildLayout()
}

/* ---------- draw loop ---------------------------------------- */
export function drawPoliticsScene() {
  background(0);
  Engine.update(engine);

  drawChrome();
  drawBluePane();
  drawUI();
  drawBalls();
  drawPreview();
}

/* ---------- interaction ------------------------------------- */
export async function mousePressedPoliticsScene() {
  if (!mouseInBlue()) return;

  const { x, y } = clampToSafe(mouseX, mouseY);
  addBall(x, y)
  if (x < sepLeftX){
    await postPoliticsLeft()
    politicsCounts.left++
  }

  else if (x > sepRightX){
    await postPoliticsRight()
    politicsCounts.right++
  }

  else {
    await postPoliticsCenter()
    politicsCounts.center++
  }
}

/* ---------- physics ----------------------------------------- */
function initPhysics() {
  engine = Engine.create();
  world  = engine.world;
  world.gravity.y = 1;
}

async function buildLayout() {
  RADIUS = (width + height) / 150
  WALL_START_Y = height / 3
  
  /* blue pane geometry ------------------------------------- */
  blueX = BLUE_PAD;
  blueY = BLUE_PAD + CHROME_H;
  blueW = width  - BLUE_PAD * 2;
  blueH = height - blueY - BLUE_PAD;

  centreW   = blueW * CENTER_RATIO;
  leftW     = (blueW - centreW) * 0.5;
  sepLeftX  = blueX + leftW;
  sepRightX = blueX + leftW + centreW;

  /* rebuild static walls ----------------------------------- */
  World.remove(world, walls);
  walls = [];

  // floor, roof, sides
  walls.push(Bodies.rectangle(blueX + blueW * 0.5, blueY + blueH + 25, blueW + 200, 50, { isStatic:true }));
  walls.push(Bodies.rectangle(blueX + blueW * 0.5, blueY - 25,        blueW + 200, 50, { isStatic:true }));
  walls.push(Bodies.rectangle(blueX - 25,         blueY + blueH * 0.5, 50, blueH,    { isStatic:true }));
  walls.push(Bodies.rectangle(blueX + blueW + 25, blueY + blueH * 0.5, 50, blueH,    { isStatic:true }));

  const wallH   = blueH - (WALL_START_Y - CHROME_H);
  const wallMid = blueY + WALL_START_Y + wallH * 0.5;

  walls.push(Bodies.rectangle(sepLeftX,  wallMid, WALL_THICK, wallH, { isStatic:true }));
  walls.push(Bodies.rectangle(sepRightX, wallMid, WALL_THICK, wallH, { isStatic:true }));

  World.add(world, walls);
  
  await generateBalls()
}

/* ---------- drawing helpers --------------------------------- */
function drawChrome() {
  /* white bar ------------------------------------------------ */
  noStroke(); fill(255);
  rect(blueX, blueY - CHROME_H, blueW, CHROME_H);

  /* traffic-light buttons ----------------------------------- */
  const btnY = blueY - CHROME_H * 0.5;
  fill('#ff6059'); circle(blueX + 18, btnY, 12);
  fill('#ffbd2e'); circle(blueX + 38, btnY, 12);
  fill('#28c941'); circle(blueX + 58, btnY, 12);

  /* centred address field ----------------------------------- */
  const addrW = min(600, blueW - 160);             // max width but never touch buttons
  const addrX = blueX + (blueW - addrW) * 0.5;
  const addrY = blueY - CHROME_H * 0.66;
  fill(0, 0, 0, 20);                               // subtle shadow
  rect(addrX, addrY, addrW, CHROME_H * 0.5, 4);

  fill(70); textSize(14); textAlign(CENTER, CENTER);
  text('http://your-political-opinion-is-not-important.vote.il',
       addrX + addrW * 0.5, btnY + 1);
}

function drawBluePane() {
  noStroke(); fill(BLUE);
  rect(blueX, blueY, blueW, blueH);
}

function drawUI() {
  /* separators --------------------------------------------- */
  stroke(255); strokeWeight(1);
  line(sepLeftX,  blueY + WALL_START_Y, sepLeftX,  blueY + blueH);
  line(sepRightX, blueY + WALL_START_Y, sepRightX, blueY + blueH);

  /* title --------------------------------------------------- */
  noStroke(); fill(255);
  textSize(32); textStyle(BOLD); textAlign(LEFT, TOP);
  const tx = blueX + 40, ty = blueY + 24;
  text('POLITICLY', tx, ty);
  text('SPEAKING',  tx, ty + 32);
  text("I'M...",     tx, ty + 64);

   /* arrow circle that FOLLOWS the mouse -------------------- */
  const arrowCX = tx + 110, arrowCY = ty + 80;

  // outer ring
  stroke(255); strokeWeight(3); fill(BLUE);
  circle(arrowCX, arrowCY, 36);

  // work out angle from button-centre to the cursor
  const ang = atan2(mouseY - arrowCY, mouseX - arrowCX);

  // draw the “↓” glyph rotated so its tip aims at the mouse
  push();
  translate(arrowCX, arrowCY);
  rotate(ang - HALF_PI);          // <--- key fix:  minus, not plus
  noStroke(); fill(255); textSize(20); textAlign(CENTER, CENTER);
  text('↓', 0, 2);
  pop();

  /* column labels ------------------------------------------ */
  textStyle(NORMAL); textSize(64); fill(255);
  textAlign(LEFT, BASELINE);
  text('Left-wing', blueX + 20, blueY + blueH - 24);

  push();
  translate(sepLeftX + centreW * 0.5, blueY + blueH * 0.5);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Centrist', 0, 0);
  pop();

  textAlign(RIGHT, BASELINE);
  text('Right-wing', blueX + blueW - 20, blueY + blueH - 24);
}

function drawBalls() {
  noStroke(); fill(255);
  balls.forEach(b => circle(b.position.x, b.position.y, RADIUS * 2));
}

function drawPreview() {
  if (!mouseInBlue()) return;
  const p = clampToSafe(mouseX, mouseY);
  noStroke(); fill(255, 120);
  circle(p.x, p.y, RADIUS * 2);
}

/* ---------- util ------------------------------------------- */
function mouseInBlue() {
  return mouseX > blueX && mouseX < blueX + blueW &&
         mouseY > blueY && mouseY < blueY + blueH;
}

function clampToSafe(mx, my) {
  let x = constrain(mx, blueX + RADIUS, blueX + blueW - RADIUS);
  let y = constrain(my, blueY + RADIUS, blueY + blueH - RADIUS);

  if (abs(x - sepLeftX)  < RADIUS + WALL_THICK * 0.5)
    x = sepLeftX  + (x < sepLeftX ? -1 : 1) * (RADIUS + WALL_THICK * 0.5);

  if (abs(x - sepRightX) < RADIUS + WALL_THICK * 0.5)
    x = sepRightX + (x < sepRightX ? -1 : 1) * (RADIUS + WALL_THICK * 0.5);

  return { x, y };
}

function addBall(x, y) {
  let ball = Bodies.circle(x, y, RADIUS, {
    restitution: 0.8,
    friction: 0.1
  });
  balls.push(ball);
  World.add(world, ball);
}

function addBalls(num, generateX, generateY) {
  for(let i = 0; i < num; i++){
    addBall(generateX(), generateY())
  }
}

async function generateBalls () {
  if(!politicsCounts)
    politicsCounts = await getPoliticsCounts()

  balls = []
  const xPosFuncs = {
    left: () => random(blueX, sepLeftX),
    center: () => random(sepLeftX, sepRightX),
    right: () => random(sepRightX, blueX+blueW) 
  }

  const getYPosFunc = (ballCount) => {
    const maxY = blueY + blueH
    const minY = WALL_START_Y + (maxY - WALL_START_Y) / (ballCount*4/maxY + 1)
    return () => random(minY, maxY)
  }

  Object.entries(politicsCounts).map(([key, value]) => addBalls(value, xPosFuncs[key], getYPosFunc(value)))
}

