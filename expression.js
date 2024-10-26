"use strict"
const imageCapture = document.getElementsByClassName('videoView')[0];
const expressionWraper = document.getElementsByClassName('face-expression-wrapper')[0]

const video = document.getElementById('video');
let canvasWidth;
let canvasHeight;
let displaySize;

window.addEventListener('resize', () => {
    canvasWidth = video.getBoundingClientRect().width;
    canvasHeight = video.getBoundingClientRect().height;
    displaySize = { width: canvasWidth, height: canvasHeight }
});

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
    console.log("video started")
    const canvas = faceapi.createCanvasFromMedia(video)
    canvas.setAttribute('id', 'canvas-face')
    imageCapture.append(canvas)
    displaySize = { width: canvasWidth, height: canvasHeight }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        let detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        let resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        expressionWraper.innerHTML = ""

        if (resizedDetections.length == 0) return;
        
        for (let i = 0; i < resizedDetections.length; i++) {
            const neutralProgress = Math.ceil(resizedDetections[i].expressions["neutral"] * 100)
            const angryProgress = Math.ceil(resizedDetections[i].expressions["angry"] * 100)
            const happyProgress = Math.ceil(resizedDetections[i].expressions["happy"] * 100)
            const sadProgress = Math.ceil(resizedDetections[i].expressions["sad"] * 100)
            const disgustedProgress = Math.ceil(resizedDetections[i].expressions["disgusted"] * 100)
            const fearfulProgress = Math.ceil(resizedDetections[i].expressions["fearful"] * 100)
            const surprisedProgress = Math.ceil(resizedDetections[i].expressions["surprised"] * 100)

            expressionWraper.insertAdjacentHTML('beforeend', `
                <div class="expression-detected">
                    <div class="face-no">Face No: ${i + 1}</div>
                    <div class="happy-ex">😀: ${happyProgress}</div>
                    <div class="neutral-ex">😐: ${neutralProgress}</div>
                    <div class="angry-ex">😡: ${angryProgress}</div>
                    <div class="sad-ex">😔: ${sadProgress}</div>
                    <div class="disgust-ex">🤢: ${disgustedProgress}</div>
                    <div class="surprised-ex">😮: ${surprisedProgress}</div>
                    <div class="fearful-ex">😨: ${fearfulProgress}</div>
                </div>
            `);
        }

    }, 200)

}