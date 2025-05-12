let currentScene = "scene1";

function setup() {
  if (currentScene === "scene1") setupScene1();
  else if (currentScene === "scene2") setupScene2();
}

function draw() {
  if (currentScene === "scene1") drawScene1();
  else if (currentScene === "scene2") drawScene2();
}

function mousePressed() {
  if (currentScene === "scene1") mousePressedScene1();
  if (currentScene === "scene2") mousePressedScene2();
}
