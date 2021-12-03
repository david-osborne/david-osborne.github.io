var gbl_canvasWidth = window.innerWidth;
var gbl_canvasHeight = window.innerHeight;
var cvs;
var ctx;
var secondsPassed;
var oldTimeStamp;
var fps = 0;
var gbl_imagePosX = gbl_canvasWidth / 2;
var gbl_imagePosY = gbl_canvasHeight / 2;
var gbl_imageDir = '';
var gbl_mouseDown = false;
var gbl_mouseX = 0;
var gbl_mouseY = 0;
var gbl_particleCount = 0;
var gbl_timestampStart;
var gbl_listX = []; // x pos
var gbl_listY = []; // y pos
var gbl_listR = []; // radius
var gbl_listC = []; // color
var gbl_listA = []; // angle
var gbl_listT = []; // type
var gbl_lastKeyDown;
var gbl_rectAngle = 0;
window.onload = init;
function init() {
    generateCanvas();
    cvs = document.getElementById('canvas');
    ctx = cvs.getContext('2d');
    //scaleCanvas();
    var startTime = new Date;
    gbl_timestampStart = startTime;
    createEventListeners();
    generateArrays();
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
function createEventListeners() {
    window.addEventListener('resize', windowSize);
}
function scaleCanvas() {
    var scaleFactor = backingScale(ctx);
    if (scaleFactor > 1) {
        ctx.canvas.width = ctx.canvas.width * scaleFactor;
        ctx.canvas.height = ctx.canvas.height * scaleFactor;
        // update the context for the new canvas scale
        ctx = cvs.getContext("2d");
    }
}
function windowSize() {
    gbl_canvasWidth = window.innerWidth;
    gbl_canvasHeight = window.innerHeight;
    //scaleCanvas();
    ctx.canvas.width = gbl_canvasWidth;
    ctx.canvas.height = gbl_canvasHeight;
    gbl_listX = [];
    gbl_listY = [];
    gbl_listA = [];
    gbl_listR = [];
}
function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}
function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    clearCanvas();
    generateArrays();
    draw();
    drawText(fps);
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}
function generateCanvas() {
    var body = document.getElementById('body');
    var canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = gbl_canvasWidth;
    canvas.height = gbl_canvasHeight;
    body.appendChild(canvas);
}
function clearCanvas() {
    //clear canvas
    //ctx.clearRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gbl_canvasWidth, gbl_canvasHeight);
}
function generateArrays() {
    /*
        for (let i = 0; i < 1000; i++) {
            gbl_listA[i] = randomInt(0, 360);
            gbl_listX[i] = gbl_canvasWidth / 2;
            gbl_listY[i] = gbl_canvasHeight / 2;
            gbl_listR[i] = randomInt(1,3);
        }
    */
    for (var i = 0; i < gbl_listX.length; i++) {
        if (gbl_listY[i] > gbl_canvasHeight + gbl_listR[i]
            ||
                gbl_listY[i] < 0 + gbl_listR[i]
            ||
                gbl_listX[i] > gbl_canvasWidth + gbl_listR[i]
            ||
                gbl_listX[i] < 0 + gbl_listR[i]) {
            gbl_listX.splice(i, 1);
            gbl_listY.splice(i, 1);
            gbl_listR.splice(i, 1);
            gbl_listA.splice(i, 1);
        }
    }
    //generate randoms
    var randomX = randomInt(1, 100);
    var randomY = randomInt(1, 100);
    var randomR = randomInt(1, 2);
    var randomA = randomInt(0, 360);
    //append new array items
    gbl_listX.push(gbl_canvasWidth / 2);
    gbl_listY.push(gbl_canvasHeight / 2);
    gbl_listR.push(randomR);
    gbl_listA.push(randomA);
}
function draw() {
    //draw particle for each array item
    for (var i = 0; i < gbl_listX.length; i++) {
        ctx.fillStyle = 'white';
        gbl_listX[i] += Math.cos(gbl_listA[i]);
        gbl_listY[i] += Math.sin(gbl_listA[i] * 18);
        ctx.beginPath();
        ctx.arc(gbl_listX[i], gbl_listY[i], gbl_listR[i], 0, 360);
        //ctx.arc(randomX, randomY, randomR, 0, 360);
        ctx.fill();
    }
}
function drawText(fps) {
    var d = new Date();
    var hh = d.getHours().toString();
    var mm = d.getMinutes().toString();
    var ss = d.getSeconds().toString();
    var ms = d.getMilliseconds().toString();
    //ctx.fillStyle = 'black';
    //ctx.fillRect(0, 0, 280, 130);
    ctx.font = '24px Courier New';
    ctx.fillStyle = 'orange';
    ctx.fillText('FPS: ' + fps, 10, 22);
    ctx.font = '15px Courier New';
    ctx.fillStyle = 'lime';
    ctx.fillText('Timestamp: ' + hh + ':' + mm + ':' + ss + '.' + ms, 10, 40);
    ctx.fillText('Mouse X: ' + gbl_mouseX.toString() + ' / Mouse Y: ' + gbl_mouseY.toString(), 10, 60);
    ctx.fillText('Particle count: ' + gbl_listX.length.toString(), 10, 80);
    ctx.fillText('Elapsed time: ' + timeDiff().toString(), 10, 100);
    ctx.fillText('Window size: ' + gbl_canvasWidth + 'W x ' + gbl_canvasHeight + 'H', 10, 120);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function timeDiff() {
    var timeDiff = new Date().getTime() - gbl_timestampStart.getTime();
    timeDiff /= 1000; //strip ms
    return timeDiff;
}
//# sourceMappingURL=main.js.map