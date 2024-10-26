import {FaceDetector, FilesetResolver} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
// const demosSection = document.getElementById("demos");

let faceDetector;
let runningMode = "IMAGE";

// Initialize the object detector
const initializefaceDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
        },
        runningMode: runningMode
    })
    // demosSection.classList.remove("invisible");
};

initializefaceDetector().then(() => {
    enableCam();
});

const imageContainers = document.getElementsByClassName("detectOnClick");
for (let imageContainer of imageContainers) {
    imageContainer.children[0].addEventListener("click", handleClick);
}

 // Demo 2: Continuously grab image from webcam stream and detect it.
let video = document.getElementById("video");
const liveView = document.getElementById("liveView");

var children = [];
// If webcam supported, add event listener to button for when user
// wants to activate it.
// Enable the live webcam view and start detection.
async function enableCam() {
    if (!faceDetector) {
        alert("Face Detector is still loading. Please try again..");
        return;
    }

    // getUsermedia parameters
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            video.addEventListener("loadeddata", predictWebcam);
        })
        .catch((err) => {
            console.error(err);
        });
}
let lastVideoTime = -1;

async function predictWebcam() {
    // if image mode is initialized, create a new classifier with video runningMode
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceDetector.setOptions({runningMode: "VIDEO"});
    }
    let startTimeMs = performance.now();
    // Detect faces using detectForVideo
    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const detections = faceDetector.detectForVideo(video, startTimeMs)
            .detections;
        displayVideoDetections(detections);
    }
    
    // Call this function again to keep predicting when the browser is ready
    window.requestAnimationFrame(predictWebcam);
}

function displayVideoDetections(detections) {
    // Remove any highlighting from previous frame
    for (let child of children) {
        liveView.removeChild(child);
    }

    let width = "";
    let height = "";
    let originX = "";
    let originY = "";
    children.splice(0);
    // Iterate through predictions and draw them to the live view
    for (let detection of detections) {
        const p = document.createElement("p");
        width += detection.boundingBox.width + " ";
        height += detection.boundingBox.height + " ";
        originX += detection.boundingBox.originX + " ";
        originY += detection.boundingBox.originY + " ";
    }

    document.body.setAttribute("width", width);
    document.body.setAttribute("height", height);
    document.body.setAttribute("originX", originX);
    document.body.setAttribute("originY", originY);
}