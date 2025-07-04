let video;
let faceapi;
let videoReady = false;
let faceApiReady = false;
let detecting = false;
let detections = [];

let vidW = 640;
let vidH = 480;

export const setupVideoAndFaceApi = () => {
  return new Promise((resolve) => {
    video = createCapture(VIDEO);
    video.hide();

    video.elt.onloadeddata = () => {
      vidW = video.elt.videoWidth;
      vidH = video.elt.videoHeight;
      videoReady = true;

      faceapi = ml5.faceApi(
        video,
        {
          withLandmarks: true,
          withExpressions: true,
          withDescriptors: true,
          minConfidence: 0.5,
        },
        () => {
          faceApiReady = true;
          resolve();
        }
      );
    };
  });
};

export const isVideoReady = () => videoReady;

export const isFaceApiReady = () => faceApiReady;

export const stopVideo = () => {
  if (video?.elt?.srcObject) {
    const tracks = video.elt.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }
  if (video?.remove) video.remove();
  videoReady = false;
};

export const stopFaceDetection = () => {
  detecting = false;
};

export const startFaceDetection = () => {
  if (faceapi && faceApiReady) {
    detecting = true;
    faceapi.detect(gotFaces);
  }
};

export const getDetections = () => detections;

export const getVideo = () => video;

export const getVideoDimensions = () => ({
  vidW,
  vidH,
});

const gotFaces = (err, res) => {
  if (err) {
    console.error("FaceAPI Error:", err);
    return;
  }

  detections = res;

  if (detecting && faceapi) {
    faceapi.detect(gotFaces);
  }
};
