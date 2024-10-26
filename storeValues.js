const faceDetectedWrapper = document.getElementsByClassName('faces-detected-wrapper')[0];
const textualInformation = document.getElementsByClassName('textual-informations')[0];

var videoId = 'video';
var scaleFactor = .25;
var snapshots = [];

function capture(video, scaleFactor, index) {
    if (scaleFactor == null) {
        scaleFactor = 1;
    }

    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');
    let width = document.body.getAttribute("width").trimEnd().split(' ');
    let height = document.body.getAttribute("height").trimEnd().split(' ');
    let originX = document.body.getAttribute("originX").trimEnd().split(' ');
    let originY = document.body.getAttribute("originY").trimEnd().split(' ');

    ctx.drawImage(video, parseInt(originX[index]) - 10, parseInt(originY[index]) - 10, parseInt(width[index]) + 10, parseInt(height[index]) + 10, 0, 0, w, h);
    return canvas;
}

function shoot() {
    var video = document.getElementById(videoId);
    faceDetectedWrapper.innerHTML = '';
    

    try {
        let width = document.body.getAttribute("width").trimEnd().split(' ');

        for (let i = 0; i < width.length; i++) {
            var canvas = capture(video, scaleFactor, i);

            const faceWrapper = document.createElement('div');
            faceDetectedWrapper.appendChild(faceWrapper);
            faceWrapper.classList.add('face-wrapper');
            faceWrapper.appendChild(canvas);

        }
    } catch (error) {
        
    }
    
}
setInterval(() => {
    shoot();
}, 1000)