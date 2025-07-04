import { getSmileLeaderboard, getTotalSmileTime, postSmile } from "./logic.js";


let faceapi;
let detections = [];

let video;
let canvas;

let serial;

let yourSmileDuration = 0;
let prevSmileActive = false;
let smileStopped = false;
let leaderboard = [];

let peaceProgress = 0;
let peaceBarSpeed = 1 / 7200; // fills in 2 minutes (at 60fps)

let stopSmileFrame = null;
let videoReady = false;

let totalSmileFrames = 0; // 🆕 total time all people smiled

//my-code
let postButton;
let durationList = [];
let smileImage = null;


export async function setupSmileScene() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);
  video.hide();

  video.elt.onloadeddata = () => {
    videoReady = true;
  };

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

  //my-code
  postButton = createButton('click me')
  postButton.mousePressed(() => postSmile(durationList, smileImage))
  leaderboard = await getSmileLeaderboard(3)

  totalSmileFrames = await getTotalSmileTime()

}

export function windowResizedSmileScene() {
  resizeCanvas(windowWidth, windowHeight);
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

export function drawSmileScene() {
  background(0);

  if (videoReady) {
    let vidW = video.elt.videoWidth;
    let vidH = video.elt.videoHeight;

    let videoAspect = vidW / vidH;
    let canvasAspect = width / height;

    let drawWidth, drawHeight;

    if (videoAspect > canvasAspect) {
      drawWidth = width;
      drawHeight = width / videoAspect;
    } else {
      drawHeight = height;
      drawWidth = height * videoAspect;
    }

    let offsetX = (width - drawWidth) / 2;
    let offsetY = (height - drawHeight) / 2;
    
    image(video, offsetX, offsetY, drawWidth, drawHeight);
  }

  drawBoxes(detections);
  drawLandmarks(detections); // yellow by default

  textSize(height * 0.035);
  fill(255, 204, 0);
  noStroke();
  textAlign(CENTER);
  text("Smile for World Peace 😊", width / 2, height * 0.05);

  updateSmileTracking();

  textSize(height * 0.03);
  fill(255);
  textAlign(LEFT);

  // 🆕 Total accumulated smile time display
  let totalSeconds = floor(totalSmileFrames / 60);
  let totalMinutes = floor(totalSeconds / 60);
  let remainingSeconds = totalSeconds % 60;
  let totalSmileTimeText = nf(totalMinutes, 2) + ":" + nf(remainingSeconds, 2);
  text("Total Smile Time: " + totalSmileTimeText, 20, height * 0.1);

  // Your personal smile duration
  let seconds = floor(yourSmileDuration / 60);
  let minutes = floor(seconds / 60);
  seconds = seconds % 60;
  let timerText = nf(minutes, 2) + ":" + nf(seconds, 2);
  textSize(height * 0.025);
  text("Your Smile Time: " + timerText, 20, height * 0.15);

  drawLeaderboard();
  drawPeaceBar();

  if (stopSmileFrame) {
    stroke(255, 0, 0);
    strokeWeight(3);
    noFill();
    rect(stopSmileFrame.x, stopSmileFrame.y, stopSmileFrame.w, stopSmileFrame.h);
  }

  if (detections.length > 0) {
    let detectedEmotion = detections[0].expressions.asSortedArray()[0].expression;
    sendEmotion(detectedEmotion);
  }
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
  stroke(255, 204, 0); // 🟡 yellow dots
  strokeWeight(6);

  for (let i = 0; i < detections.length; i++) {
    let points = detections[i].landmarks.positions;
    for (let j = 0; j < points.length; j++) {
      point(points[j]._x, points[j]._y - 55); // your custom offset
    }
  }
}

function updateSmileTracking() {
  if (detections.length === 0) {
    peaceProgress = max(0, peaceProgress - peaceBarSpeed);
    return;
  }

  let smilingCount = 0;

  for (let i = 0; i < detections.length; i++) {
    let smileProb = detections[i].expressions.happy;
    if (smileProb > 0.95) {
      smilingCount++;
    }
  }

  if (smilingCount > 0) {
    totalSmileFrames += smilingCount; // 🆕 add to total smile time
    peaceProgress = min(1, peaceProgress + peaceBarSpeed * smilingCount);

    let primarySmile = detections[0].expressions.happy > 0.95;
    if (primarySmile) {
      if (!prevSmileActive) {
        smileStopped = false;
      }
      yourSmileDuration++;
      prevSmileActive = true;
    }
  } else {
    peaceProgress = max(0, peaceProgress - peaceBarSpeed);

    if (prevSmileActive && !smileStopped) {
      let frozen = get();
      leaderboard.push({
        duration: yourSmileDuration,
        image: frozen
      });

      //my-code
      smileImage = frozen;
      durationList.push(yourSmileDuration)

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
  }
}

function drawLeaderboard() {
  fill(255);
  textSize(height * 0.025);
  textAlign(RIGHT);
  text("Leaderboard (Time)", width - 40, height * 0.08);

  let sorted = leaderboard
    .slice()
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 3);

  let thumbW = width * 0.15;
  let thumbH = thumbW * 0.7925;

  let startX = width - thumbW - 40;
  let startY = height * 0.1;

  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i];
    let frames = entry.duration;
    let totalSeconds = floor(frames / 60);
    let minutes = floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

    let x = startX;
    let y = startY + i * (thumbH + height * 0.05);

    image(entry.image, x, y, thumbW, thumbH);

    fill(255);
    textAlign(CENTER);
    text(`#${i + 1}: ${timeString}`, x + thumbW / 2, y + thumbH + 24);
  }
}

function drawPeaceBar() {
  let barWidth = width - 80;
  let barHeight = 30;
  let x = 40;
  let y = height - 60;

  fill(50);
  rect(x, y, barWidth, barHeight, 10);

  let fillWidth = barWidth * peaceProgress;
  fill(0, 200, 100);
  rect(x, y, fillWidth, barHeight, 10);

  fill(255);
  textSize(20);
  textAlign(CENTER);
  if (peaceProgress <= 0.01) {
    text("⚠ Peace Broken", width / 2, y - 10);
  } else {
    text("🌍 World Peace: Loading...", width / 2, y - 10);
  }
}