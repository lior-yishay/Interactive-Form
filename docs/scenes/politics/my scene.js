import { getPoliticsCounts, postPoliticsCenter, postPoliticsLeft, postPoliticsRight } from "../../../proxy server/proxyServer.js";
// import { getPoliticsCounts, postPoliticsCenter, postPoliticsLeft, postPoliticsRight } from "./logic.js";

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine, world;

let font;
let walls = [];
let balls = [];

let politicsCounts;

export async function preloadPoliticsScene() {
  font = loadFont('./assets/GT-Maru-Bold-Trial.otf')
}

export async function setupPoliticsScene() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textAlign(CENTER, CENTER);

  engine = Engine.create();  // create engine
  world = engine.world;      // reference the world inside engine

  const wallsThickness = (width + height) / 200
  const wallheight = height * 2 / 3

  const wallsXPos = [- wallsThickness/2, getLeftBarrierX(), getRightBarrierX(), width + wallsThickness/2]

  walls = wallsXPos.map(x => Bodies.rectangle(x, height - wallheight / 2, wallsThickness, wallheight, { isStatic: true } ))
  walls.push( Bodies.rectangle(width / 2, height - wallsThickness / 2, width, wallsThickness, { isStatic: true } ) )
  World.add(world, walls);

  await generateBalls(height - wallsThickness, wallheight)
}

export function drawPoliticsScene() {
  background(240);
  Engine.update(engine);
  drawHeadline();

  drawBalls()
  drawWalls()
}

export function mousePressedPoliticsScene() {
  const x = mouseX
  const y = mouseY
  addBall(x, y)

  if (x < getLeftBarrierX()){
    postPoliticsLeft()
    politicsCounts.left++
  }

  else if (x > getRightBarrierX()){
    postPoliticsRight()
    politicsCounts.right++
  }

  else {
    postPoliticsCenter()
    politicsCounts.center++
  }
}

export function windowResizedPoliticsScene() {
  resizeCanvas(windowWidth, windowHeight);
  // Clear all bodies and constraints from the world
  World.clear(world, false); // false = don't keep the world instance itself
  Engine.clear(engine);      // clear engine's internal references
  setupPoliticsScene();
}

function getLeftBarrierX() {
  return width/2 - width/15
}

function getRightBarrierX() {
  return width/2 + width/15
}

function drawBalls() {
  fill(255, 0, 100);
  noStroke();
  for (let ball of balls) {
    ellipse(ball.position.x, ball.position.y, ball.circleRadius * 2);
  }
}

function drawWalls() {
  fill(0);
  for (let wall of walls) {
    rectMode(CENTER);
    rect(wall.position.x, wall.position.y, wall.bounds.max.x - wall.bounds.min.x, wall.bounds.max.y - wall.bounds.min.y);
  }
}

function drawHeadline() {
  fill(255, 0, 100);
  noStroke();
  let x = width * 0.07;
  let y = height * 0.05;
  textSize(height * 0.04);
  textAlign(LEFT, TOP);
  text("POLITICALLY", x, y);
  text("SPEAKING IM", x, y + height * 0.05);

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

function addBall(x, y) {
  let r = (width + height) / 150
  let ball = Bodies.circle(x, y, r, {
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

async function generateBalls (floorY, wallheight) {
  if(!politicsCounts)
    politicsCounts = await getPoliticsCounts()

  balls = []
  const xPosFuncs = {
    left: () => random(0, getLeftBarrierX()),
    center: () => random(getLeftBarrierX(), getRightBarrierX()),
    right: () => random(getRightBarrierX(), width) 
  }

  const getYPosFunc = (ballCount) => {
    const wallY = height - wallheight
    const maxY = floorY
    const minY = wallY + (maxY - wallY) / (ballCount*4/maxY + 1)
    return () => random(minY, maxY)
  }

  Object.entries(politicsCounts).map(([key, value]) => addBalls(value, xPosFuncs[key], getYPosFunc(value)))
}