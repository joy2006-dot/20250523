let video;
let faceapi;
let detections = [];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Initialize FaceApi with the video feed
  const faceOptions = {
    withLandmarks: true,
    withDescriptors: false,
  };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);
}

function modelReady() {
  console.log('FaceAPI model loaded!');
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  detections = result;
  faceapi.detect(gotResults); // Continue detecting
}

function draw() {
  image(video, 0, 0, width, height);

  if (detections.length > 0) {
    for (let detection of detections) {
      const { alignedRect, parts } = detection;
      const { _x, _y, _width, _height } = alignedRect._box;

      // Draw a rectangle around the detected face
      noFill();
      stroke(0, 255, 0);
      strokeWeight(2);
      rect(_x, _y, _width, _height);

      // Draw the mouth shape
      if (parts && parts.mouth) {
        const mouth = parts.mouth;
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        beginShape();
        for (let point of mouth) {
          vertex(point._x, point._y);
        }
        endShape(CLOSE);
      }

      // Draw the left eye shape
      if (parts && parts.leftEye) {
        const leftEye = parts.leftEye;
        noFill();
        stroke(0, 0, 255);
        strokeWeight(2);
        beginShape();
        for (let point of leftEye) {
          vertex(point._x, point._y);
        }
        endShape(CLOSE);
      }

      // Draw the right eye shape
      if (parts && parts.rightEye) {
        const rightEye = parts.rightEye;
        noFill();
        stroke(0, 0, 255);
        strokeWeight(2);
        beginShape();
        for (let point of rightEye) {
          vertex(point._x, point._y);
        }
        endShape(CLOSE);
      }
    }
  }
}
