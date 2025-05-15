let faceapi;
let detections = [];

let video;
let canvas;

let serial;

let smileCounter = 0;
let yourSmileDuration = 0; // in frames
let prevSmileActive = false;
let smileStopped = false;
let leaderboard = []; // stores {duration, image}

let peaceProgress = 0;
let peaceBarSpeed = 0.0005;

let stopSmileFrame = null;

export function setupSmileScene() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);
  video.hide(); // hide default video element

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);

  serial = new p5.SerialPort();
  serial.open("/dev/cu.usbmodem1301");
  serial.on('connected', serverConnected);
  serial.on('error', gotError);
}

function serverConnected() {
  console.log('connected to server.');
}

function gotError(theerror) {
  console.log(theerror);
}

function sendEmotion(emotion) {
  serial.write(emotion + '\n');
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  faceapi.detect(gotFaces);
}

function drawBoxes(detections) {
  for (let i = 0; i < detections.length; i++) {
    let {_x, _y, _width, _height} = detections[i].alignedRect._box;
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(_x, _y, _width, _height);
  }
}

function drawLandmarks(detections) {
  for (let i = 0; i < detections.length; i++) {
    let points = detections[i].landmarks.positions;
    for (let j = 0; j < points.length; j++) {
      stroke(44, 169, 225);
      strokeWeight(3);
      point(points[j]._x, points[j]._y);
    }
  }
}

export function drawSmileScene() {
  image(video, 0, 0, width, height);
  drawBoxes(detections);
  drawLandmarks(detections);

  textSize(24);
  fill(255, 204, 0);
  noStroke();
  textAlign(CENTER);
  text("Smile for World Peace 😊", width / 2, 30);

  updateSmileTracking();

  textSize(28);
  fill(255);
  textAlign(LEFT);
  text("Smiles Count: " + smileCounter, 20, 70);

  let seconds = floor(yourSmileDuration / 60);
  let minutes = floor(seconds / 60);
  seconds = seconds % 60;
  let timerText = nf(minutes, 2) + ":" + nf(seconds, 2);
  textSize(20);
  text("Smile Time: " + timerText, 20, 100);

  drawLeaderboard();
  drawPeaceBar();

  if (stopSmileFrame) {
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    rect(stopSmileFrame.x, stopSmileFrame.y, stopSmileFrame.w, stopSmileFrame.h);
  }

  if (detections.length > 0) {
    let detectedEmotion = detections[0].expressions.asSortedArray()[0].expression;
    sendEmotion(detectedEmotion);
  }
}

function updateSmileTracking() {
  if (detections.length === 0) {
    peaceProgress = max(0, peaceProgress - peaceBarSpeed);
    return;
  }

  let smileProb = detections[0].expressions.happy;

  if (smileProb > 0.95) {
    if (!prevSmileActive) {
      smileCounter++;
      smileStopped = false;
    }
    yourSmileDuration++;
    prevSmileActive = true;
    peaceProgress = min(1, peaceProgress + peaceBarSpeed);
  } else {
    if (prevSmileActive && !smileStopped) {
      // Freeze video frame and store it
      let frozen = get(); // grabs entire canvas (video + drawings)
      leaderboard.push({
        duration: yourSmileDuration,
        image: frozen
      });

      yourSmileDuration = 0;
      smileStopped = true;

      let box = detections[0].alignedRect._box;
      stopSmileFrame = {
        x: box._x,
        y: box._y,
        w: box._width,
        h: box._height
      };
    }

    prevSmileActive = false;
    peaceProgress = max(0, peaceProgress - peaceBarSpeed);
  }
}

function drawLeaderboard() {
  fill(255);
  textSize(16);
  textAlign(RIGHT);
  text("Leaderboard (Time)", width - 20, 60);

  let sorted = leaderboard
    .slice()
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 3); // show top 3

  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i];
    let frames = entry.duration;
    let totalSeconds = floor(frames / 60);
    let minutes = floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

    // Draw thumbnail
    let thumbW = 80;
    let thumbH = 60;
    let x = width - thumbW - 20;
    let y = 80 + i * (thumbH + 30);

    image(entry.image, x, y, thumbW, thumbH);

    // Draw time text under thumbnail
    fill(255);
    textAlign(CENTER);
    text(`#${i + 1}: ${timeString}`, x + thumbW / 2, y + thumbH + 15);
  }
}

function drawPeaceBar() {
  let barWidth = width - 40;
  let barHeight = 20;
  let x = 20;
  let y = height - 30;

  fill(50);
  rect(x, y, barWidth, barHeight, 10);

  let fillWidth = barWidth * peaceProgress;
  fill(0, 200, 100);
  rect(x, y, fillWidth, barHeight, 10);

  fill(255);
  textSize(14);
  textAlign(CENTER);
  if (peaceProgress <= 0.01) {
    text("⚠ Peace Broken", width / 2, y - 5);
  } else {
    text("🌍 World Peace: Loading...", width / 2, y - 5);
  }
}


