let faceapi;
let detections = [];

let video;
let canvas;
let serial;

function setupScene2() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  }

  faceapi = ml5.faceApi(video, faceOptions, faceReady);


  serial = new p5.SerialPort();
  serial.open("/dev/cu.usbmodem1301");
  serial.on('connected', serverConnected);
  serial.on('error', gotError);
}

function drawScene2() {
  image(video, 0, 0, width, height);
  drawBoxes(detections);
  drawLandmarks(detections);
  drawExpressions(detections, 20, 250, 14)

  if (detections.length > 0) {
    let detectedEmotion = detections[0].expressions.asSortedArray()[0].expression;
    sendEmotion(detectedEmotion);
  }
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

function drawBoxes(detections){
  if (detections.length > 0) {
    for (i=0; i < detections.length; i++){
      let {_x, _y, _width, _height} = detections[i].alignedRect._box;
      stroke(255);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {
    for (i=0; i < detections.length; i++){
      let points = detections[i].landmarks.positions;
      for (let j = 0; j < points.length; j++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[j]._x, points[j]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    let {happy, sad, surprised} = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    strokeWeight(2);
    stroke(255);
    text("happy:       "+ nf(happy*100,2,2)+"%", x, y+textYSpace);
    text("sad:           "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    text("surprised:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
  } else {
    text("happy: ", x, y + textYSpace);
    text("sad: ", x, y + textYSpace*3);
    text("surprised: ", x, y + textYSpace*5);
  }
}
